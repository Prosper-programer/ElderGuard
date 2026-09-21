import { API_BASE_URL } from '../constants/api';
import { getAuthToken } from './authService';
import { ElderlyProfile } from '../types/elderly';

export interface BackendElderlyProfile {
  elderly_id: number;
  parent_id: number;
  caregiver_id?: number | null;
  doctor_id?: number | null;
  full_name: string;
  date_of_birth: string;
  gender: string;
  address: string;
  emergency_contact: string;
  medical_information?: string | null;
  caregiver_name?: string | null;
  caregiver_phone?: string | null;
  doctor_name?: string | null;
  doctor_phone?: string | null;
  doctor_specialty?: string | null;
  doctor_hospital?: string | null;
  doctor_email?: string | null;
  created_at: string;
}

export interface CaregiverUser {
  user_id: number;
  full_name: string;
  email: string;
  phone_number: string;
  status: string;
}

export interface DoctorUser {
  user_id: number;
  full_name: string;
  email: string;
  phone_number: string;
  status: string;
}

export interface ClinicalNoteRecord {
  note_id: number;
  elderly_id: number;
  doctor_id: number;
  title: string;
  note_content: string;
  recommendations?: string | null;
  doctor_name?: string;
  doctor_phone?: string;
  created_at: string;
}

export function mapBackendToElderlyProfile(item: BackendElderlyProfile): ElderlyProfile {
  const birthYear = item.date_of_birth ? new Date(item.date_of_birth).getFullYear() : 1948;
  const currentYear = new Date().getFullYear();
  const calculatedAge = Math.max(1, currentYear - birthYear);

  return {
    id: `eld-${item.elderly_id}`,
    fullName: item.full_name,
    preferredName: item.full_name.split(' ')[0],
    age: calculatedAge,
    dateOfBirth: item.date_of_birth ? String(item.date_of_birth).split('T')[0] : '1948-03-22',
    gender: (item.gender as 'Female' | 'Male' | 'Other') || 'Female',
    address: item.address,
    phone: item.emergency_contact,
    imageUrl: require('@/assets/images/elderly_margaret.jpg'),
    parentManagerId: `usr-${item.parent_id}`,
    primaryCaregiverId: item.caregiver_id ? `usr-${item.caregiver_id}` : undefined,
    primaryCaregiverName: item.caregiver_name || (item.caregiver_id ? 'Assigned Caregiver' : undefined),
    doctorId: item.doctor_id ? `usr-${item.doctor_id}` : undefined,
    doctorName: item.doctor_name || 'Dr. Jean-Paul Mbarga',
    doctorPhone: item.doctor_phone || '+237 655 89 12 34',
    doctorSpecialty: item.doctor_specialty || 'Cardiologie & Médecine Gériatrique',
    doctorHospital: item.doctor_hospital || 'Hôpital Central de Yaoundé',
    doctorEmail: item.doctor_email || 'doctor.mbarga@elderguard.cm',
    medicalInfo: {
      bloodType: 'O+',
      allergies: [],
      chronicConditions: item.medical_information ? [item.medical_information] : ['Hypertension', 'Type 2 Diabetes'],
      medicationNotes: item.medical_information || 'Amlodipine 5mg le matin, Metformin 500mg le soir après le dîner.',
      physicianName: item.doctor_name || 'Dr. Jean-Paul Mbarga',
      physicianPhone: item.doctor_phone || '+237 655 89 12 34',
      hospitalPreference: item.doctor_hospital || 'Hôpital Central de Yaoundé',
    },
    emergencyContacts: [
      {
        id: `ec-${item.elderly_id}`,
        name: 'Family Contact',
        relationship: 'Emergency Contact',
        phone: item.emergency_contact,
        isPrimary: true,
      },
    ],
    deviceStatus: {
      deviceId: `EG-IOT-${item.elderly_id.toString().padStart(4, '0')}`,
      deviceName: 'ElderGuard Smart Wearable',
      connected: true,
      batteryLevel: 94,
      lastSync: 'Just now',
      signalStrength: 'strong',
      firmwareVersion: 'v2.4.1',
    },
    createdAt: item.created_at,
    updatedAt: item.created_at,
  };
}

/**
 * Fetch all elderly profiles managed by or assigned to the authenticated user.
 */
export async function apiGetElderlyProfiles(): Promise<{
  success: boolean;
  profiles: ElderlyProfile[];
  error?: string;
}> {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/api/elderly`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return {
        success: false,
        profiles: [],
        error: data.message || 'Failed to fetch elderly profiles.',
      };
    }

    const data = await response.json();
    const list: BackendElderlyProfile[] = data.data || [];
    const mapped = list.map(mapBackendToElderlyProfile);

    return {
      success: true,
      profiles: mapped,
    };
  } catch (err: any) {
    console.error('apiGetElderlyProfiles error:', err);
    return {
      success: false,
      profiles: [],
      error: err.message || 'Network error fetching elderly profiles.',
    };
  }
}

/**
 * Create a new elderly profile in the backend database.
 */
export async function apiCreateElderlyProfile(payload: {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  emergencyContact: string;
  medicalInformation?: string;
  caregiverId?: number | null;
}): Promise<{
  success: boolean;
  profile?: ElderlyProfile;
  error?: string;
}> {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/api/elderly`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Failed to create elderly profile.',
      };
    }

    const mapped = mapBackendToElderlyProfile(data.data);
    return {
      success: true,
      profile: mapped,
    };
  } catch (err: any) {
    console.error('apiCreateElderlyProfile error:', err);
    return {
      success: false,
      error: err.message || 'Network error creating elderly profile.',
    };
  }
}

/**
 * Fetch list of active caregivers from the backend.
 */
export async function apiGetCaregivers(): Promise<{
  success: boolean;
  caregivers: CaregiverUser[];
  error?: string;
}> {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/api/users/caregivers`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      return { success: false, caregivers: [], error: 'Failed to fetch caregivers.' };
    }

    const data = await response.json();
    return {
      success: true,
      caregivers: data.data || [],
    };
  } catch (err: any) {
    console.error('apiGetCaregivers error:', err);
    return {
      success: false,
      caregivers: [],
      error: err.message || 'Network error fetching caregivers.',
    };
  }
}

/**
 * Provision / create a new caregiver account in the backend.
 */
export async function apiCreateCaregiver(payload: {
  fullName: string;
  email: string;
  phoneNumber: string;
  password?: string;
}): Promise<{
  success: boolean;
  caregiver?: CaregiverUser;
  error?: string;
}> {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/api/users/caregivers`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...payload,
        password: payload.password || 'password123',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Failed to create caregiver.',
      };
    }

    return {
      success: true,
      caregiver: data.data,
    };
  } catch (err: any) {
    console.error('apiCreateCaregiver error:', err);
    return {
      success: false,
      error: err.message || 'Network error creating caregiver.',
    };
  }
}

/**
 * Fetch list of active doctors from the backend.
 */
export async function apiGetDoctors(): Promise<{
  success: boolean;
  doctors: DoctorUser[];
  error?: string;
}> {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/api/users/doctors`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      return { success: false, doctors: [], error: 'Failed to fetch doctors.' };
    }

    const data = await response.json();
    return {
      success: true,
      doctors: data.data || [],
    };
  } catch (err: any) {
    console.error('apiGetDoctors error:', err);
    return {
      success: false,
      doctors: [],
      error: err.message || 'Network error fetching doctors.',
    };
  }
}

/**
 * Provision / create a new doctor account in the backend.
 */
export async function apiCreateDoctor(payload: {
  fullName: string;
  email: string;
  phoneNumber: string;
  password?: string;
}): Promise<{
  success: boolean;
  doctor?: DoctorUser;
  error?: string;
}> {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/api/users/doctors`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...payload,
        password: payload.password || 'password123',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Failed to create doctor.',
      };
    }

    return {
      success: true,
      doctor: data.data,
    };
  } catch (err: any) {
    console.error('apiCreateDoctor error:', err);
    return {
      success: false,
      error: err.message || 'Network error creating doctor.',
    };
  }
}

/**
 * Fetch clinical consultation notes for an elderly person.
 */
export async function apiGetClinicalNotes(elderlyId: number | string): Promise<{
  success: boolean;
  notes: ClinicalNoteRecord[];
  error?: string;
}> {
  try {
    const numericId = typeof elderlyId === 'string' ? elderlyId.replace('eld-', '') : elderlyId;
    const token = getAuthToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/api/clinical-notes/elderly/${numericId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      return { success: false, notes: [], error: 'Failed to fetch clinical notes.' };
    }

    const data = await response.json();
    return {
      success: true,
      notes: data.data || [],
    };
  } catch (err: any) {
    console.error('apiGetClinicalNotes error:', err);
    return {
      success: false,
      notes: [],
      error: err.message || 'Network error fetching clinical notes.',
    };
  }
}

/**
 * Create a new clinical note (by Doctor).
 */
export async function apiCreateClinicalNote(payload: {
  elderlyId: number | string;
  title: string;
  noteContent: string;
  recommendations?: string;
}): Promise<{
  success: boolean;
  note?: ClinicalNoteRecord;
  error?: string;
}> {
  try {
    const numericId = typeof payload.elderlyId === 'string' ? payload.elderlyId.replace('eld-', '') : payload.elderlyId;
    const token = getAuthToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/api/clinical-notes`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...payload,
        elderlyId: Number(numericId),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Failed to record clinical note.',
      };
    }

    return {
      success: true,
      note: data.data,
    };
  } catch (err: any) {
    console.error('apiCreateClinicalNote error:', err);
    return {
      success: false,
      error: err.message || 'Network error creating clinical note.',
    };
  }
}

export interface PrescriptionRecord {
  prescription_id: number;
  elderly_id: number;
  doctor_id: number;
  medication_name: string;
  dosage: string;
  frequency: string;
  scheduled_time: string;
  instructions?: string | null;
  status: 'active' | 'completed' | 'discontinued';
  last_administered_at?: string | null;
  last_administered_by?: string | null;
  created_at?: string;
  doctor?: {
    user_id: number;
    full_name: string;
    email: string;
    phone_number: string;
  };
}

/**
 * Fetch prescriptions for an elderly person.
 */
export async function apiGetPrescriptions(elderlyId: number | string): Promise<{
  success: boolean;
  prescriptions: PrescriptionRecord[];
  error?: string;
}> {
  try {
    const numericId = typeof elderlyId === 'string' ? elderlyId.replace('eld-', '') : elderlyId;
    const token = getAuthToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/api/prescriptions/elderly/${numericId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      return { success: false, prescriptions: [], error: 'Failed to fetch prescriptions.' };
    }

    const data = await response.json();
    return {
      success: true,
      prescriptions: data.data || [],
    };
  } catch (err: any) {
    console.error('apiGetPrescriptions error:', err);
    return {
      success: false,
      prescriptions: [],
      error: err.message || 'Network error fetching prescriptions.',
    };
  }
}

/**
 * Create a new prescription (by Doctor).
 */
export async function apiCreatePrescription(payload: {
  elderly_id: number | string;
  medication_name: string;
  dosage: string;
  frequency: string;
  scheduled_time: string;
  instructions?: string;
}): Promise<{
  success: boolean;
  prescription?: PrescriptionRecord;
  error?: string;
}> {
  try {
    const numericId = typeof payload.elderly_id === 'string' ? payload.elderly_id.replace('eld-', '') : payload.elderly_id;
    const token = getAuthToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/api/prescriptions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...payload,
        elderly_id: Number(numericId),
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Failed to create prescription.',
      };
    }

    return {
      success: true,
      prescription: data.data,
    };
  } catch (err: any) {
    console.error('apiCreatePrescription error:', err);
    return {
      success: false,
      error: err.message || 'Network error creating prescription.',
    };
  }
}

/**
 * Record administration of medication (Caregiver clicks "Done").
 */
export async function apiAdministerPrescription(
  prescriptionId: number,
  administeredBy?: string
): Promise<{
  success: boolean;
  prescription?: PrescriptionRecord;
  error?: string;
}> {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/api/prescriptions/${prescriptionId}/administer`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ administered_by: administeredBy }),
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Failed to record medication administration.',
      };
    }

    return {
      success: true,
      prescription: data.data,
    };
  } catch (err: any) {
    console.error('apiAdministerPrescription error:', err);
    return {
      success: false,
      error: err.message || 'Network error recording administration.',
    };
  }
}

/**
 * Parent updates caregiver details.
 */
export async function apiUpdateCaregiver(
  caregiverId: number,
  payload: { fullName?: string; phoneNumber?: string; email?: string; status?: string }
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/api/users/caregivers/${caregiverId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.message || 'Failed to update caregiver.' };
    }
    return { success: true, data: data.data };
  } catch (err: any) {
    console.error('apiUpdateCaregiver error:', err);
    return { success: false, error: err.message || 'Network error updating caregiver.' };
  }
}

/**
 * Parent updates doctor details.
 */
export async function apiUpdateDoctor(
  doctorId: number,
  payload: { fullName?: string; phoneNumber?: string; email?: string; status?: string }
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/api/users/doctors/${doctorId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.message || 'Failed to update doctor.' };
    }
    return { success: true, data: data.data };
  } catch (err: any) {
    console.error('apiUpdateDoctor error:', err);
    return { success: false, error: err.message || 'Network error updating doctor.' };
  }
}

/**
 * Parent deletes/unlinks a caregiver or doctor user.
 */
export async function apiDeleteUser(userId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: 'DELETE',
      headers,
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.message || 'Failed to remove user.' };
    }
    return { success: true };
  } catch (err: any) {
    console.error('apiDeleteUser error:', err);
    return { success: false, error: err.message || 'Network error removing user.' };
  }
}

