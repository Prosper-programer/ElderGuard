/**
 * ============================================================================
 * ElderGuard — AlertContext.tsx
 * ============================================================================
 * 
 * PURPOSE:
 * Manages the complete lifecycle of safety incidents and emergency alerts:
 * 
 * THE 5-STAGE INCIDENT LIFECYCLE:
 * 1. MONITOR   : Wearable streams accelerometer G-force, gyroscope, and vitals.
 * 2. DETECT    : Fall heuristic or threshold breach triggers (e.g. 3.2G impact).
 * 3. ALERT     : Generates an active incident, plays alert tone, updates red tab badge.
 * 4. RESPOND   : Family or caregiver taps "Acknowledge" (silencing sirens on other phones).
 * 5. RECORD    : Responder enters resolution notes ("Assisted to chair, vitals stable")
 *                and archives the incident into the clinical audit log.
 * 
 * LIVE BADGE INTEGRATION:
 * The `BottomTabBar` component watches `activeAlerts.length` to render the red
 * notification pill on the Alerts tab in real time.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertIncident, AlertContextValue } from '@/types/alerts';

/**
 * Pre-seeded demonstration incidents:
 * - One active critical fall incident (3.2G impact in Living Room).
 * - One acknowledged heart rate warning (118 bpm resting).
 * - One resolved low-battery maintenance event.
 */
const INITIAL_ALERTS: AlertIncident[] = [
  {
    id: 'alt-101',
    type: 'fall',
    severity: 'critical',
    status: 'active', // 'active' | 'acknowledged' | 'resolved'
    title: 'Potential Fall Detected',
    description:
      'Wearable accelerometer detected high impact (3.2G) followed by 45 seconds of immobility.',
    timestamp: '8 minutes ago',
    elderlyId: 'eld-01',
    elderlyName: 'Margaret Johnson',
    location: 'Living Room — 142 Elm Street',
    coordinates: { latitude: 40.73061, longitude: -74.26384 },
    vitalReadings: {
      heartRate: 114,
      spo2: 97,
      impactGForce: 3.2,
    },
  },
  {
    id: 'alt-102',
    type: 'heart_rate',
    severity: 'warning',
    status: 'acknowledged',
    title: 'Elevated Heart Rate',
    description: 'Sustained resting heart rate of 118 bpm detected for 10 minutes.',
    timestamp: '2 hours ago',
    elderlyId: 'eld-01',
    elderlyName: 'Margaret Johnson',
    location: 'Home Residence',
    vitalReadings: {
      heartRate: 118,
      spo2: 98,
    },
    acknowledgedBy: 'David Miller (Caregiver)',
    acknowledgedAt: '1 hour 50 mins ago',
  },
  {
    id: 'alt-103',
    type: 'battery',
    severity: 'info',
    status: 'resolved',
    title: 'Low Wearable Battery (15%)',
    description: 'Wearable battery reached low threshold. Charging cradle placed.',
    timestamp: 'Yesterday at 08:30 PM',
    elderlyId: 'eld-01',
    elderlyName: 'Margaret Johnson',
    location: 'Bedroom',
    resolvedBy: 'Eleanor Vance (Parent)',
    resolvedAt: 'Yesterday at 09:00 PM',
    resolutionNotes: 'Charged device on nightstand until 100%. Re-paired successfully.',
  },
];

// React Context for alert and incident state
const AlertContext = createContext<AlertContextValue | undefined>(undefined);

/**
 * AlertProvider Component
 * Exposes active and resolved alerts, plus mutation actions to acknowledge and resolve incidents.
 */
export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<AlertIncident[]>(INITIAL_ALERTS);

  // Filtered lists for quick tab rendering
  const activeAlerts = alerts.filter((a) => a.status === 'active' || a.status === 'acknowledged');
  const resolvedAlerts = alerts.filter((a) => a.status === 'resolved');

  /**
   * Triggers a new safety incident (e.g. from IoT hardware or test simulation).
   * Automatically prepends the incident to the top of the alerts list.
   */
  const triggerAlert = useCallback(
    (alertData: Omit<AlertIncident, 'id' | 'timestamp' | 'status'>) => {
      const newAlert: AlertIncident = {
        ...alertData,
        id: `alt-${Date.now()}`,
        status: 'active',
        timestamp: 'Just now',
      };
      setAlerts((prev) => [newAlert, ...prev]);
      return newAlert;
    },
    []
  );

  /**
   * Acknowledges an active incident.
   * Silences sirens on connected devices and records which responder took ownership.
   */
  const acknowledgeAlert = useCallback((id: string, responderName: string) => {
    setAlerts((prev) =>
      prev.map((alert) => {
        if (alert.id === id) {
          return {
            ...alert,
            status: 'acknowledged',
            acknowledgedBy: responderName,
            acknowledgedAt: 'Just now',
          };
        }
        return alert;
      })
    );
  }, []);

  /**
   * Resolves an incident with clinical resolution notes.
   * Moves the incident from active lists to the permanent historical audit trail.
   */
  const resolveAlert = useCallback((id: string, responderName: string, notes: string) => {
    setAlerts((prev) =>
      prev.map((alert) => {
        if (alert.id === id) {
          return {
            ...alert,
            status: 'resolved',
            resolvedBy: responderName,
            resolvedAt: 'Just now',
            resolutionNotes: notes,
          };
        }
        return alert;
      })
    );
  }, []);

  /**
   * Looks up an incident by its unique ID (used by the [id].tsx detail screens).
   */
  const getAlertById = useCallback(
    (id: string) => {
      return alerts.find((a) => a.id === id);
    },
    [alerts]
  );

  return (
    <AlertContext.Provider
      value={{
        alerts,
        activeAlerts,
        resolvedAlerts,
        triggerAlert,
        acknowledgeAlert,
        resolveAlert,
        getAlertById,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
}

/**
 * useAlerts Custom Hook
 * Provides direct access to active incidents, resolution handlers, and badge counts.
 */
export function useAlerts(): AlertContextValue {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
}
