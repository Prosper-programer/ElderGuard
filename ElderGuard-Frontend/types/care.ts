export type DoseStatus = 'pending' | 'taken' | 'missed';
export type ActivityCategory = 'hydration' | 'mobility' | 'vital_check' | 'nutrition' | 'hygiene';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  timesOfDay: string[];
}

export interface MedicationDose {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  scheduledTime: string;
  status: DoseStatus;
  loggedBy?: string;
  loggedAt?: string;
}

export interface CareActivity {
  id: string;
  title: string;
  category: ActivityCategory;
  target: number;
  current: number;
  unit: string;
  status: 'pending' | 'in_progress' | 'completed';
  notes?: string;
  loggedBy?: string;
  loggedAt?: string;
}

export interface CareContextValue {
  medications: Medication[];
  todayDoses: MedicationDose[];
  activities: CareActivity[];
  markDoseStatus: (doseId: string, status: DoseStatus, loggedByName: string) => void;
  updateActivityProgress: (activityId: string, incrementValue: number, loggedByName: string) => void;
  addMedication: (medication: Omit<Medication, 'id'>) => Medication;
}
