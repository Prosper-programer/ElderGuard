/**
 * ============================================================================
 * ElderGuard — CareContext.tsx
 * ============================================================================
 * 
 * PURPOSE:
 * Manages daily care plans, prescribed medications, scheduled dosages, and
 * wellness activities (Hydration, Mobility Walks, Blood Pressure Checks).
 * 
 * CORE ENTITIES:
 * 1. `Medication`: The standing clinical prescription (e.g. Lisinopril 10mg, Once daily).
 * 2. `MedicationDose`: Today's specific dose instance (e.g. 08:00 AM, status: 'taken').
 * 3. `CareActivity`: Daily wellness targets with progress increments (+250ml, +5 mins).
 * 
 * ADHERENCE FORMULA:
 *   Adherence % = (Count of doses with status === 'taken' / Total scheduled doses) * 100
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Medication, MedicationDose, CareActivity, CareContextValue, DoseStatus } from '@/types/care';

/**
 * Baseline doctor prescriptions for Margaret Johnson:
 * - Lisinopril (Morning hypertension control)
 * - Calcium + D3 (Midday bone density support)
 * - Metformin (Evening blood sugar regulation)
 */
const INITIAL_MEDICATIONS: Medication[] = [
  {
    id: 'med-1',
    name: 'Lisinopril',
    dosage: '10mg Tablet',
    frequency: 'Once daily',
    instructions: 'Take in the morning with a full glass of water.',
    timesOfDay: ['08:00 AM'],
  },
  {
    id: 'med-2',
    name: 'Calcium + Vitamin D3',
    dosage: '600mg / 400 IU',
    frequency: 'Once daily with meal',
    instructions: 'Take with lunch to maximize absorption.',
    timesOfDay: ['12:30 PM'],
  },
  {
    id: 'med-3',
    name: 'Metformin',
    dosage: '500mg Tablet',
    frequency: 'Once daily with evening meal',
    instructions: 'Take immediately with dinner.',
    timesOfDay: ['07:00 PM'],
  },
];

/**
 * Today's dosage instances:
 * Morning and afternoon doses have already been marked 'taken' by caregiver David.
 * Evening Metformin is 'pending'.
 */
const INITIAL_DOSES: MedicationDose[] = [
  {
    id: 'dose-1',
    medicationId: 'med-1',
    medicationName: 'Lisinopril',
    dosage: '10mg Tablet',
    scheduledTime: '08:00 AM',
    status: 'taken',
    loggedBy: 'David Miller (Caregiver)',
    loggedAt: '08:05 AM',
  },
  {
    id: 'dose-2',
    medicationId: 'med-2',
    medicationName: 'Calcium + Vitamin D3',
    dosage: '600mg',
    scheduledTime: '12:30 PM',
    status: 'taken',
    loggedBy: 'David Miller (Caregiver)',
    loggedAt: '12:35 PM',
  },
  {
    id: 'dose-3',
    medicationId: 'med-3',
    medicationName: 'Metformin',
    dosage: '500mg Tablet',
    scheduledTime: '07:00 PM',
    status: 'pending',
  },
];

/**
 * Today's non-pharmacological care and wellness activities:
 */
const INITIAL_ACTIVITIES: CareActivity[] = [
  {
    id: 'act-1',
    title: 'Daily Water Hydration',
    category: 'hydration',
    target: 2.0,
    current: 1.6,
    unit: 'Liters',
    status: 'in_progress',
    notes: 'Glasses tracked throughout morning & lunch',
  },
  {
    id: 'act-2',
    title: 'Gentle Mobility Walk',
    category: 'mobility',
    target: 30,
    current: 25,
    unit: 'mins',
    status: 'in_progress',
    notes: 'Walked in backyard garden with walker support',
  },
  {
    id: 'act-3',
    title: 'Resting Blood Pressure Check',
    category: 'vital_check',
    target: 1,
    current: 1,
    unit: 'check',
    status: 'completed',
    notes: 'Reading: 124 / 82 mmHg (Normal)',
    loggedBy: 'David Miller (Caregiver)',
    loggedAt: '11:15 AM',
  },
];

// React Context definition for care operations
const CareContext = createContext<CareContextValue | undefined>(undefined);

/**
 * CareProvider Component
 * Exposes prescription state, daily doses, and mutation methods to log medication and care progress.
 */
export function CareProvider({ children }: { children: React.ReactNode }) {
  const [medications, setMedications] = useState<Medication[]>(INITIAL_MEDICATIONS);
  const [todayDoses, setTodayDoses] = useState<MedicationDose[]>(INITIAL_DOSES);
  const [activities, setActivities] = useState<CareActivity[]>(INITIAL_ACTIVITIES);

  /**
   * Updates the administration status of a medication dose (e.g. 'taken', 'missed', 'pending').
   * Attaches responder name and current local timestamp for clinical compliance logs.
   */
  const markDoseStatus = useCallback(
    (doseId: string, status: DoseStatus, loggedByName: string) => {
      setTodayDoses((prev) =>
        prev.map((dose) => {
          if (dose.id === doseId) {
            return {
              ...dose,
              status,
              loggedBy: loggedByName,
              loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
          }
          return dose;
        })
      );
    },
    []
  );

  /**
   * Increments the progress of a daily wellness activity (e.g. adding 250ml water or 5 min walk).
   * Automatically marks the activity 'completed' if the target goal is reached or exceeded.
   */
  const updateActivityProgress = useCallback(
    (activityId: string, incrementValue: number, loggedByName: string) => {
      setActivities((prev) =>
        prev.map((act) => {
          if (act.id === activityId) {
            const newCurrent = Math.min(act.target, Math.max(0, act.current + incrementValue));
            const newStatus = newCurrent >= act.target ? 'completed' : 'in_progress';
            return {
              ...act,
              current: Math.round(newCurrent * 10) / 10,
              status: newStatus,
              loggedBy: loggedByName,
              loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
          }
          return act;
        })
      );
    },
    []
  );

  /**
   * Adds a new prescribed medication and immediately schedules today's doses.
   */
  const addMedication = useCallback((medicationData: Omit<Medication, 'id'>) => {
    const newMed: Medication = {
      ...medicationData,
      id: `med-${Date.now()}`,
    };
    setMedications((prev) => [...prev, newMed]);

    // Generate matching dose records for today
    const newDoses: MedicationDose[] = medicationData.timesOfDay.map((time, idx) => ({
      id: `dose-${Date.now()}-${idx}`,
      medicationId: newMed.id,
      medicationName: newMed.name,
      dosage: newMed.dosage,
      scheduledTime: time,
      status: 'pending',
    }));

    setTodayDoses((prev) => [...prev, ...newDoses]);
    return newMed;
  }, []);

  return (
    <CareContext.Provider
      value={{
        medications,
        todayDoses,
        activities,
        markDoseStatus,
        updateActivityProgress,
        addMedication,
      }}
    >
      {children}
    </CareContext.Provider>
  );
}

/**
 * useCare Custom Hook
 * Provides direct access to prescriptions, doses, adherence rates, and logging methods.
 */
export function useCare(): CareContextValue {
  const context = useContext(CareContext);
  if (!context) {
    throw new Error('useCare must be used within a CareProvider');
  }
  return context;
}
