/**
 * GUYNOVA GUARD Data Types
 * Clean TypeScript interfaces matching the UML Class Diagram entities
 */

export type UserRole = 'parent' | 'caregiver' | 'doctor' | 'admin';

// User account (Parent / Caregiver / Doctor)
export interface User {
  user_id: number;
  full_name: string;
  email: string;
  phone_number: string;
  password?: string;
  role: 'parent' | 'caregiver' | 'doctor';
  status: 'active' | 'inactive';
  created_at?: string;
}

// Admin account
export interface Admin {
  admin_id: number;
  name: string;
  email: string;
  password?: string;
  created_at?: string;
}

// Payload stored inside the JWT token
export interface AuthTokenPayload {
  userId: number;
  email: string;
  role: UserRole;
}

// Elderly Person Profile
export interface ElderlyProfile {
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
  doctor_name?: string | null;
  doctor_phone?: string | null;
  doctor_specialty?: string | null;
  doctor_hospital?: string | null;
  doctor_email?: string | null;
  created_at?: string;
}

// Clinical Consultation Note
export interface ClinicalNote {
  note_id: number;
  elderly_id: number;
  doctor_id: number;
  title: string;
  note_content: string;
  recommendations?: string | null;
  created_at?: string;
}

// Daily Activity
export interface DailyActivity {
  activity_id: number;
  elderly_id: number;
  name: string;
  date: string;
  start_time: string;
  end_time: string;
  description?: string | null;
  status: 'pending' | 'completed';
  created_at?: string;
}

// Location
export interface LocationRecord {
  location_id: number;
  elderly_id: number;
  latitude: number;
  longitude: number;
  timestamp: string;
}

// Reminder
export interface Reminder {
  reminder_id: number;
  elderly_id: number;
  title: string;
  date: string;
  time: string;
  description?: string | null;
  type: string;
  status: 'active' | 'completed' | 'dismissed';
  created_at?: string;
}

// Notification
export interface NotificationRecord {
  notification_id: number;
  user_id: number;
  title: string;
  message: string;
  date_time: string;
  status: 'unread' | 'read';
}

// Alert
export interface AlertRecord {
  alert_id: number;
  elderly_id: number;
  notification_id?: number | null;
  description: string;
  date_time: string;
}

// IOT Device
export interface IotDevice {
  device_id: number;
  elderly_id?: number | null;
  device_name: string;
  last_connection?: string | null;
  status: 'connected' | 'disconnected';
  created_at?: string;
}

// Geofence
export interface Geofence {
  geofence_id: number;
  elderly_id: number;
  center_latitude: number;
  center_longitude: number;
  radius: number;
  is_enabled: boolean;
  created_at?: string;
}

// Report
export interface Report {
  report_id: number;
  elderly_id: number;
  parent_id: number;
  title: string;
  period: string;
  generated_date: string;
  content: string;
}

