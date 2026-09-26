/**
 * ============================================================================
 * GUYNOVA GUARD — ElderlyContext.tsx
 * ============================================================================
 * 
 * PURPOSE:
 * Stores and manages senior profiles, including:
 * 1. Demographic and contact data.
 * 2. Clinical and medical history.
 * 3. Emergency contacts hierarchy.
 * 4. Paired IoT hardware telemetry status.
 * 5. Integration with Express + MySQL backend and empty state handling.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ElderlyProfile, ElderlyContextValue } from '@/types/Patient';
import { useAuth } from '@/context/AuthContext';
import {
  apiGetElderlyProfiles,
  apiCreateElderlyProfile,
  apiCreateCaregiver,
  apiCreateDoctor,
} from '@/services/elderlyService';

/**
 * Baseline demonstration profile for Pa Samuel Ngu (Age 78, Yaoundé, Cameroon):
 */
const DEMO_MARGARET_PROFILE: ElderlyProfile = {
  id: 'eld-01',
  fullName: 'Pa Samuel Ngu',
  preferredName: 'Pa Samuel',
  age: 78,
  dateOfBirth: '1948-03-15',
  gender: 'Male',
  address: 'Bastos, Yaoundé, Cameroon',
  phone: '+237 671 23 45 67',
  imageUrl: require('@/assets/images/elderly_margaret.jpg'),
  parentManagerId: 'usr-Tutor-01',
  primaryCaregiverId: 'usr-caregiver-01',
  primaryCaregiverName: 'Amara Biya',
  doctorId: 'usr-doctor-01',
  doctorName: 'Dr. Jean-Paul Mbarga',
  doctorPhone: '+237 655 89 12 34',
  doctorSpecialty: 'Cardiologie & Médecine Gériatrique',
  doctorHospital: 'Hôpital Central de Yaoundé',
  doctorEmail: 'doctor.mbarga@GUYNOVA GUARD.cm',

  medicalInfo: {
    bloodType: 'O+',
    allergies: ['Penicillin'],
    chronicConditions: ['Hypertension', 'Type 2 Diabetes', 'Mild Joint Stiffness'],
    medicationNotes: 'Amlodipine 5mg in the morning at 08:00 AM. Metformin 500mg after dinner.',
    physicianName: 'Dr. Jean-Paul Mbarga',
    physicianPhone: '+237 655 89 12 34',
    hospitalPreference: 'Hôpital Central de Yaoundé',
  },

  emergencyContacts: [
    {
      id: 'ec-1',
      name: 'Robert Ngu',
      relationship: 'Son (Primary)',
      phone: '+237 671 23 45 67',
      isPrimary: true,
    },
  ],

  deviceStatus: {
    deviceId: 'EG-IOT-4892',
    deviceName: 'GUYNOVA GUARD Wearable Band V2',
    connected: true,
    batteryLevel: 84,
    lastSync: '2 minutes ago',
    signalStrength: 'strong',
    firmwareVersion: 'v2.4.1',
  },
  createdAt: '2026-01-16T10:00:00.000Z',
  updatedAt: '2026-09-02T14:30:00.000Z',
};

const ElderlyContext = createContext<ElderlyContextValue | undefined>(undefined);

export function ElderlyProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();

  const [profiles, setProfiles] = useState<ElderlyProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isDemoAccount =
    user?.email === 'Tutor@GUYNOVA GUARD.com' ||
    user?.email === 'robert.thompson@email.com' ||
    user?.email === 'robert.ngu@GUYNOVA GUARD.cm' ||
    user?.email === 'caregiver@GUYNOVA GUARD.com' ||
    user?.email === 'amara.biya@GUYNOVA GUARD.cm' ||
    user?.email === 'doctor@GUYNOVA GUARD.com' ||
    user?.email === 'doctor.mbarga@GUYNOVA GUARD.cm';

  const refreshProfiles = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setProfiles([]);
      setActiveProfileId(null);
      return;
    }

    setIsLoading(true);
    const result = await apiGetElderlyProfiles();

    if (result.success && result.profiles.length > 0) {
      setProfiles(result.profiles);
      setActiveProfileId(result.profiles[0].id);
    } else if (result.success && result.profiles.length === 0) {
      // If user is a known demo account, fallback to pre-seeded Pa Samuel
      if (isDemoAccount) {
        setProfiles([DEMO_MARGARET_PROFILE]);
        setActiveProfileId(DEMO_MARGARET_PROFILE.id);
      } else {
        // Real new user with no profiles created yet!
        setProfiles([]);
        setActiveProfileId(null);
      }
    } else {
      // Backend not reached or offline: fallback to demo profile if demo user
      if (isDemoAccount) {
        setProfiles([DEMO_MARGARET_PROFILE]);
        setActiveProfileId(DEMO_MARGARET_PROFILE.id);
      }
    }
    setIsLoading(false);
  }, [isAuthenticated, user, isDemoAccount]);

  useEffect(() => {
    refreshProfiles();
  }, [refreshProfiles]);

  const activeProfile =
    profiles.find((p) => p.id === activeProfileId) || (profiles.length > 0 ? profiles[0] : null);

  const hasSenior = Boolean(activeProfile);
  const hasCaregiver = Boolean(
    activeProfile &&
      (activeProfile.primaryCaregiverId || activeProfile.primaryCaregiverName)
  );
  const hasDoctor = Boolean(
    activeProfile &&
      (activeProfile.doctorId || activeProfile.doctorName)
  );

  const updateProfile = (id: string, updates: Partial<ElderlyProfile>) => {
    setProfiles((prev) =>
      prev.map((profile) => {
        if (profile.id === id) {
          return {
            ...profile,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
        return profile;
      })
    );
  };

  const createProfile = async (
    data: Omit<ElderlyProfile, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ElderlyProfile | null> => {
    // 1. Post to backend
    const res = await apiCreateElderlyProfile({
      fullName: data.fullName,
      dateOfBirth: data.dateOfBirth || '1950-01-01',
      gender: data.gender || 'Female',
      address: data.address,
      emergencyContact: data.phone || data.emergencyContacts?.[0]?.phone || '+1 555 000 0000',
      medicalInformation: data.medicalInfo?.chronicConditions?.join(', ') || undefined,
    });

    const newProfile: ElderlyProfile = res.success && res.profile
      ? {
          ...res.profile,
          doctorName: data.doctorName || res.profile.doctorName,
          doctorPhone: data.doctorPhone || res.profile.doctorPhone,
          doctorSpecialty: data.doctorSpecialty || res.profile.doctorSpecialty,
          doctorHospital: data.doctorHospital || res.profile.doctorHospital,
          doctorEmail: data.doctorEmail || res.profile.doctorEmail,
        }
      : {
          ...data,
          id: `eld-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

    setProfiles((prev) => [newProfile, ...prev]);
    setActiveProfileId(newProfile.id);
    return newProfile;
  };

  const provisionCaregiver = async (data: {
    fullName: string;
    email: string;
    phoneNumber: string;
    password?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const res = await apiCreateCaregiver(data);
    if (!res.success) {
      return { success: false, error: res.error || 'Failed to create caregiver.' };
    }

    // Automatically associate with active profile if active profile has no caregiver
    if (activeProfile && !activeProfile.primaryCaregiverName && res.caregiver) {
      updateProfile(activeProfile.id, {
        primaryCaregiverId: `usr-${res.caregiver.user_id}`,
        primaryCaregiverName: res.caregiver.full_name,
      });
    }

    return { success: true };
  };

  const provisionDoctor = async (data: {
    fullName: string;
    email: string;
    phoneNumber: string;
    password?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const res = await apiCreateDoctor(data);
    if (!res.success) {
      return { success: false, error: res.error || 'Failed to create doctor account.' };
    }

    if (activeProfile && res.doctor) {
      updateProfile(activeProfile.id, {
        doctorId: `usr-${res.doctor.user_id}`,
        doctorName: res.doctor.full_name,
        doctorPhone: res.doctor.phone_number,
        doctorEmail: res.doctor.email,
      });
    }

    return { success: true };
  };

  const getAssignedProfileForCaregiver = (caregiverId: string): ElderlyProfile | undefined => {
    return profiles.find((p) => p.primaryCaregiverId === caregiverId) || (profiles[0] ?? undefined);
  };

  return (
    <ElderlyContext.Provider
      value={{
        activeProfile,
        profiles,
        hasSenior,
        hasCaregiver,
        hasDoctor,
        assignedCaregiverName: activeProfile?.primaryCaregiverName,
        assignedDoctorName: activeProfile?.doctorName,
        updateProfile,
        createProfile,
        provisionCaregiver,
        provisionDoctor,
        refreshProfiles,
        getAssignedProfileForCaregiver,
      }}
    >
      {children}
    </ElderlyContext.Provider>
  );
}

export function useElderly(): ElderlyContextValue {
  const context = useContext(ElderlyContext);
  if (!context) {
    throw new Error('useElderly must be used within an ElderlyProvider');
  }
  return context;
}

