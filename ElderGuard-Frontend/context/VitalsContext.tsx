/**
 * ============================================================================
 * ElderGuard — VitalsContext.tsx
 * ============================================================================
 * 
 * PURPOSE:
 * Provides real-time physiological telemetry (Heart Rate, Blood Oxygen/SpO2,
 * Body Temperature, and Daily Step Activity) for the monitored senior.
 * 
 * ARCHITECTURAL ROLE:
 * - Acts as the single source of truth for vitals across Parent and Caregiver dashboards.
 * - Powers the Apple-Health style Hero Status Ring and SVG 24-hr Sparkline Cards.
 * - Implements the Anomaly Simulation Engine (allowing developers and testers to
 *   trigger realistic 3.4G falls or tachycardia states on demand without physical hardware).
 * 
 * PRODUCTION HARDWARE INTEGRATION POINT:
 * - In production, replace the local mock state with a WebSocket listener:
 *     const socket = new WebSocket('wss://api.elderguard.com/v1/stream');
 *     socket.onmessage = (e) => setVitals(JSON.parse(e.data));
 * - Or connect directly to Bluetooth Low Energy (BLE) using `react-native-ble-plx`.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { VitalsSummary, VitalsContextValue } from '@/types/vitals';

/**
 * Baseline clinical vitals for Margaret Johnson (Age 78).
 * All metrics start within safe, stable thresholds.
 */
const INITIAL_VITALS: VitalsSummary = {
  elderlyId: 'eld-01',
  elderlyName: 'Margaret Johnson',
  overallStatus: 'safe',
  overallStatusMessage: 'All Vitals Within Normal Thresholds',
  
  // Heart Rate: Resting baseline 72 bpm (Normal clinical range: 60 - 100 bpm)
  heartRate: {
    type: 'heartRate',
    label: 'Heart Rate',
    value: 72,
    unit: 'bpm',
    status: 'safe',
    statusLabel: 'Normal Resting',
    normalRange: '60 - 100 bpm',
    lastUpdated: 'Just now',
    trend: 'stable',
  },

  // SpO2: Blood oxygen saturation 98% (Normal clinical range: 95 - 100%)
  spo2: {
    type: 'spo2',
    label: 'Blood Oxygen',
    value: 98,
    unit: '%',
    status: 'safe',
    statusLabel: 'Optimal',
    normalRange: '95 - 100%',
    lastUpdated: '1 min ago',
    trend: 'stable',
  },

  // Body Temperature: Core temperature 36.7°C (Normal: 36.1 - 37.2°C)
  temperature: {
    type: 'temperature',
    label: 'Body Temp',
    value: 36.7,
    unit: '°C',
    status: 'safe',
    statusLabel: 'Normal',
    normalRange: '36.1 - 37.2 °C',
    lastUpdated: '3 mins ago',
    trend: 'stable',
  },

  // Steps & Mobility: 3,840 steps (Target goal: 5,000 steps daily)
  steps: {
    type: 'steps',
    label: 'Daily Activity',
    value: 3840,
    unit: 'steps',
    status: 'safe',
    statusLabel: '76% of Goal (5,000)',
    normalRange: 'Target: 5,000',
    lastUpdated: 'Live',
    trend: 'rising',
  },

  batteryLevel: 87, // Smart Band hardware battery percentage (0-100%)
  isConnected: true, // IoT BLE / Cellular radio connection status
  lastSyncTime: '2 mins ago',
};

// React Context definition for vitals telemetry
const VitalsContext = createContext<VitalsContextValue | undefined>(undefined);

/**
 * VitalsProvider Component
 * Wrap your app root with this provider to make real-time telemetry accessible to all screens.
 */
export function VitalsProvider({ children }: { children: React.ReactNode }) {
  const [vitals, setVitals] = useState<VitalsSummary>(INITIAL_VITALS);

  /**
   * Refreshes the telemetry from the IoT wearable.
   * Simulates network latency (800ms) and introduces natural physiological variance (+/- 3 bpm).
   */
  const refreshVitals = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    setVitals((prev) => ({
      ...prev,
      lastSyncTime: 'Just now',
      heartRate: {
        ...prev.heartRate,
        value: 70 + Math.floor(Math.random() * 6),
        lastUpdated: 'Just now',
      },
    }));
  }, []);

  /**
   * Simulation Engine for Quality Assurance & Demonstrations:
   * Instantly overrides baseline vitals to simulate emergency and anomaly events.
   * 
   * @param anomalyType - 'fall' (sudden impact + elevated pulse),
   *                      'tachycardia' (abnormally high heart rate > 130 bpm),
   *                      'lowOxygen' (hypoxemia with SpO2 < 92%)
   */
  const simulateAnomaly = useCallback((anomalyType: 'fall' | 'tachycardia' | 'lowOxygen') => {
    if (anomalyType === 'fall') {
      setVitals((prev) => ({
        ...prev,
        overallStatus: 'critical',
        overallStatusMessage: 'CRITICAL ALERT: Sudden Fall Detected',
        heartRate: {
          ...prev.heartRate,
          value: 118,
          status: 'warning',
          statusLabel: 'Elevated Following Fall',
        },
      }));
    } else if (anomalyType === 'tachycardia') {
      setVitals((prev) => ({
        ...prev,
        overallStatus: 'critical',
        overallStatusMessage: 'CRITICAL: Tachycardia Detected',
        heartRate: {
          ...prev.heartRate,
          value: 138,
          status: 'critical',
          statusLabel: 'Abnormally High (>130)',
        },
      }));
    } else if (anomalyType === 'lowOxygen') {
      setVitals((prev) => ({
        ...prev,
        overallStatus: 'warning',
        overallStatusMessage: 'WARNING: Blood Oxygen Below Normal (91%)',
        spo2: {
          ...prev.spo2,
          value: 91,
          status: 'warning',
          statusLabel: 'Low Oxygen Alert (<92%)',
        },
      }));
    }
  }, []);

  /**
   * Resets all vitals back to normal resting baselines after testing.
   */
  const resetToNormal = useCallback(() => {
    setVitals(INITIAL_VITALS);
  }, []);

  return (
    <VitalsContext.Provider
      value={{
        vitals,
        refreshVitals,
        simulateAnomaly,
        resetToNormal,
      }}
    >
      {children}
    </VitalsContext.Provider>
  );
}

/**
 * useVitals Custom Hook
 * Call this hook inside any component to access Margaret's live telemetry and simulation controls.
 * 
 * Example:
 * const { vitals, simulateAnomaly } = useVitals();
 * console.log(vitals.heartRate.value); // 72
 */
export function useVitals(): VitalsContextValue {
  const context = useContext(VitalsContext);
  if (!context) {
    throw new Error('useVitals must be used within a VitalsProvider');
  }
  return context;
}
