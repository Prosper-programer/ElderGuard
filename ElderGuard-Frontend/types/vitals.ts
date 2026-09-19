import { StatusType } from '@/constants/theme';

export interface VitalMetric {
  type: 'heartRate' | 'spo2' | 'temperature' | 'steps';
  label: string;
  value: number | string;
  unit: string;
  status: StatusType;
  statusLabel: string;
  normalRange: string;
  lastUpdated: string;
  trend: 'stable' | 'rising' | 'falling';
}

export interface VitalsSummary {
  elderlyId: string;
  elderlyName: string;
  overallStatus: StatusType;
  overallStatusMessage: string;
  heartRate: VitalMetric;
  spo2: VitalMetric;
  temperature: VitalMetric;
  steps: VitalMetric;
  batteryLevel: number;
  isConnected: boolean;
  lastSyncTime: string;
}

export interface VitalsContextValue {
  vitals: VitalsSummary;
  refreshVitals: () => Promise<void>;
  simulateAnomaly: (anomalyType: 'fall' | 'tachycardia' | 'lowOxygen') => void;
  resetToNormal: () => void;
}
