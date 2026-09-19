import { prisma } from '../utils/prisma';
import { socketManager } from '../socket/socketManager';
import { config } from '../../src/config';
import { TelemetryPayload } from '../types';

export class RulesEngineService {
  /**
   * Evaluates an incoming IoT telemetry packet against biometric and motion thresholds.
   * Creates alert incidents when anomalies occur and broadcasts updates over WebSockets.
   */
  public static async processTelemetry(payload: TelemetryPayload) {
    let elderlyId = payload.elderlyId;

    // If elderlyId wasn't passed directly, resolve via deviceId
    if (!elderlyId && payload.deviceId) {
      const device = await prisma.device.findUnique({
        where: { deviceId: payload.deviceId },
        select: { elderlyId: true },
      });
      if (device) {
        elderlyId = device.elderlyId;
      }
    }

    if (!elderlyId) {
      throw new Error(`Unable to associate telemetry packet with an elderly profile. Device: ${payload.deviceId}`);
    }

    const elderly = await prisma.elderlyProfile.findUnique({
      where: { id: elderlyId },
      select: { fullName: true, id: true },
    });

    const elderlyName = elderly?.fullName || 'Senior';

    // 1. Record vital entry in Database
    const vitalRecord = await prisma.vitalRecord.create({
      data: {
        elderlyId,
        heartRate: Math.round(payload.heartRate),
        spo2: Math.round(payload.spo2),
        temperature: parseFloat(payload.temperature.toFixed(1)),
        steps: payload.steps || 0,
        activity: payload.activity || 'Resting',
        gForce: payload.gForce !== undefined ? payload.gForce : 1.0,
        fallDetected: Boolean(payload.fallDetected),
        batteryPct: payload.batteryPct,
        latitude: payload.location?.latitude,
        longitude: payload.location?.longitude,
        geofenceZone: payload.location?.geofenceZone || 'Living Room',
      },
    });

    // Update paired device status
    if (payload.deviceId) {
      await prisma.device.updateMany({
        where: { deviceId: payload.deviceId },
        data: {
          lastSync: new Date(),
          batteryLevel: payload.batteryPct !== undefined ? payload.batteryPct : undefined,
          connected: true,
        },
      });
    }

    // 2. Anomaly evaluation
    const triggeredAlerts = [];

    // A. Fall Detection
    const isFall = Boolean(payload.fallDetected) || (payload.gForce !== undefined && payload.gForce >= config.thresholds.fallGForce);
    if (isFall) {
      const fallAlert = await prisma.alertIncident.create({
        data: {
          elderlyId,
          type: 'fall',
          severity: 'critical',
          status: 'active',
          title: 'Fall Detected',
          description: `Impact shock of ${payload.gForce?.toFixed(2) || '3.2'}G detected by wearable sensor. Margaret may require immediate physical assistance.`,
          location: payload.location?.geofenceZone || 'Living Room',
          latitude: payload.location?.latitude,
          longitude: payload.location?.longitude,
          heartRate: payload.heartRate,
          spo2: payload.spo2,
          temperature: payload.temperature,
          impactGForce: payload.gForce || 3.2,
        },
      });
      triggeredAlerts.push(fallAlert);
      socketManager.emitAlertTriggered(elderlyId, {
        ...fallAlert,
        elderlyName,
      });
    }

    // B. Tachycardia Check
    if (payload.heartRate > config.thresholds.tachycardiaBpm) {
      const hrAlert = await prisma.alertIncident.create({
        data: {
          elderlyId,
          type: 'heart_rate',
          severity: 'warning',
          status: 'active',
          title: 'Elevated Heart Rate (Tachycardia)',
          description: `Heart rate spiked to ${payload.heartRate} bpm while classified as ${payload.activity || 'Resting'}.`,
          location: payload.location?.geofenceZone || 'Living Room',
          heartRate: payload.heartRate,
          spo2: payload.spo2,
          temperature: payload.temperature,
        },
      });
      triggeredAlerts.push(hrAlert);
      socketManager.emitAlertTriggered(elderlyId, {
        ...hrAlert,
        elderlyName,
      });
    }

    // C. Hypoxemia Check (Low SpO2)
    if (payload.spo2 < config.thresholds.hypoxemiaSpo2) {
      const o2Alert = await prisma.alertIncident.create({
        data: {
          elderlyId,
          type: 'spo2',
          severity: 'critical',
          status: 'active',
          title: 'SpO₂ Oxygen Saturation Critical',
          description: `Blood oxygen saturation dropped to ${payload.spo2}%, below safe clinical threshold of 92%.`,
          location: payload.location?.geofenceZone || 'Living Room',
          heartRate: payload.heartRate,
          spo2: payload.spo2,
          temperature: payload.temperature,
        },
      });
      triggeredAlerts.push(o2Alert);
      socketManager.emitAlertTriggered(elderlyId, {
        ...o2Alert,
        elderlyName,
      });
    }

    // 3. Broadcast real-time vitals to mobile clients
    const vitalsUpdatePacket = {
      elderlyId,
      elderlyName,
      heartRate: payload.heartRate,
      spo2: payload.spo2,
      temperature: payload.temperature,
      steps: payload.steps || 0,
      activity: payload.activity || 'Resting',
      batteryLevel: payload.batteryPct || 85,
      isConnected: true,
      lastSyncTime: 'Just now',
      timestamp: vitalRecord.timestamp.toISOString(),
    };

    socketManager.emitVitalUpdate(elderlyId, vitalsUpdatePacket);

    return {
      vitalRecord,
      triggeredAlerts,
    };
  }
}
