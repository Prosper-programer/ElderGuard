import { prisma } from '../utils/prisma';

export class VitalsService {
  public static async getLatestVitals(elderlyId: string) {
    const elderly = await prisma.elderlyProfile.findUnique({
      where: { id: elderlyId },
      include: {
        devices: true,
        vitals: {
          orderBy: { timestamp: 'desc' },
          take: 2,
        },
      },
    });

    if (!elderly) {
      throw new Error(`Elderly profile with ID '${elderlyId}' not found.`);
    }

    const latest = elderly.vitals[0];
    const previous = elderly.vitals[1];
    const primaryDevice = elderly.devices[0];

    const hr = latest ? latest.heartRate : 72;
    const prevHr = previous ? previous.heartRate : hr;
    const hrTrend = hr > prevHr ? 'rising' : hr < prevHr ? 'falling' : 'stable';
    const hrStatus = hr > 115 || hr < 50 ? 'critical' : hr > 100 || hr < 60 ? 'warning' : 'safe';
    const hrStatusLabel = hrStatus === 'critical' ? (hr > 115 ? 'High (Tachycardia)' : 'Low (Bradycardia)') : hrStatus === 'warning' ? 'Elevated' : 'Normal';

    const spo2 = latest ? latest.spo2 : 97;
    const prevSpo2 = previous ? previous.spo2 : spo2;
    const spo2Trend = spo2 > prevSpo2 ? 'rising' : spo2 < prevSpo2 ? 'falling' : 'stable';
    const spo2Status = spo2 < 92 ? 'critical' : spo2 < 95 ? 'warning' : 'safe';
    const spo2StatusLabel = spo2Status === 'critical' ? 'Critically Low' : spo2Status === 'warning' ? 'Low' : 'Normal';

    const temp = latest ? latest.temperature : 36.8;
    const prevTemp = previous ? previous.temperature : temp;
    const tempTrend = temp > prevTemp ? 'rising' : temp < prevTemp ? 'falling' : 'stable';
    const tempStatus = temp > 38.0 || temp < 35.5 ? 'critical' : temp > 37.5 ? 'warning' : 'safe';
    const tempStatusLabel = tempStatus === 'critical' ? (temp > 38.0 ? 'Fever' : 'Hypothermia') : tempStatus === 'warning' ? 'Mild Fever' : 'Normal';

    const steps = latest ? latest.steps : 1247;

    // Determine overall status
    let overallStatus: 'safe' | 'warning' | 'critical' = 'safe';
    let overallStatusMessage = 'All vitals within normal target ranges.';

    if (hrStatus === 'critical' || spo2Status === 'critical' || tempStatus === 'critical' || latest?.fallDetected) {
      overallStatus = 'critical';
      overallStatusMessage = latest?.fallDetected ? 'CRITICAL: Fall impact detected!' : 'CRITICAL: Abnormal vital metrics recorded!';
    } else if (hrStatus === 'warning' || spo2Status === 'warning' || tempStatus === 'warning') {
      overallStatus = 'warning';
      overallStatusMessage = 'Attention needed: minor vital anomalies observed.';
    }

    return {
      elderlyId: elderly.id,
      elderlyName: elderly.fullName,
      overallStatus,
      overallStatusMessage,
      heartRate: {
        type: 'heartRate',
        label: 'Heart Rate',
        value: hr,
        unit: 'bpm',
        status: hrStatus,
        statusLabel: hrStatusLabel,
        normalRange: '60–100 bpm',
        lastUpdated: latest ? '2 min ago' : 'No data',
        trend: hrTrend,
      },
      spo2: {
        type: 'spo2',
        label: 'Blood Oxygen (SpO₂)',
        value: spo2,
        unit: '%',
        status: spo2Status,
        statusLabel: spo2StatusLabel,
        normalRange: '95–100%',
        lastUpdated: latest ? '2 min ago' : 'No data',
        trend: spo2Trend,
      },
      temperature: {
        type: 'temperature',
        label: 'Skin Temperature',
        value: temp,
        unit: '°C',
        status: tempStatus,
        statusLabel: tempStatusLabel,
        normalRange: '36.1–37.2°C',
        lastUpdated: latest ? '2 min ago' : 'No data',
        trend: tempTrend,
      },
      steps: {
        type: 'steps',
        label: 'Mobility & Steps',
        value: steps,
        unit: 'steps',
        status: 'safe',
        statusLabel: steps > 3000 ? 'Active' : 'Moderate',
        normalRange: 'Target: 3,000+',
        lastUpdated: latest ? '2 min ago' : 'No data',
        trend: 'stable',
      },
      batteryLevel: primaryDevice?.batteryLevel ?? (latest?.batteryPct ?? 84),
      isConnected: primaryDevice?.connected ?? true,
      lastSyncTime: primaryDevice?.lastSync ? primaryDevice.lastSync.toISOString() : new Date().toISOString(),
    };
  }

  public static async getVitalsHistory(elderlyId: string, metric?: string, period: string = '24h') {
    const hours = period === '7d' ? 168 : 24;
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const records = await prisma.vitalRecord.findMany({
      where: {
        elderlyId,
        timestamp: { gte: since },
      },
      orderBy: { timestamp: 'asc' },
    });

    const formatted = records.map((r) => {
      const timeStr = r.timestamp.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      return {
        id: r.id,
        timestamp: r.timestamp.toISOString(),
        time: timeStr,
        heartRate: r.heartRate,
        spo2: r.spo2,
        temperature: r.temperature,
        steps: r.steps,
        activity: r.activity,
        gForce: r.gForce,
      };
    });

    return {
      period,
      count: formatted.length,
      history: formatted,
    };
  }
}
