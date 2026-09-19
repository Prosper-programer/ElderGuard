export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';
export type AlertType = 'fall' | 'heart_rate' | 'spo2' | 'temperature' | 'geofence' | 'battery';

export interface AlertIncident {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  description: string;
  timestamp: string;
  elderlyId: string;
  elderlyName: string;
  location: string;
  coordinates?: { latitude: number; longitude: number };
  vitalReadings?: {
    heartRate?: number;
    spo2?: number;
    temperature?: number;
    impactGForce?: number;
  };
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface AlertContextValue {
  alerts: AlertIncident[];
  activeAlerts: AlertIncident[];
  resolvedAlerts: AlertIncident[];
  triggerAlert: (alert: Omit<AlertIncident, 'id' | 'timestamp' | 'status'>) => AlertIncident;
  acknowledgeAlert: (id: string, responderName: string) => void;
  resolveAlert: (id: string, responderName: string, notes: string) => void;
  getAlertById: (id: string) => AlertIncident | undefined;
}
