import { prisma } from '../utils/prisma';
import { socketManager } from '../socket/socketManager';

export class AlertsService {
  public static async getAlerts(elderlyId?: string, status?: string) {
    const where: any = {};
    if (elderlyId) where.elderlyId = elderlyId;
    if (status) where.status = status;

    const alerts = await prisma.alertIncident.findMany({
      where,
      include: {
        elderly: {
          select: { fullName: true, preferredName: true },
        },
      },
      orderBy: { timestamp: 'desc' },
    });

    return alerts.map(this.formatAlert);
  }

  public static async getAlertById(id: string) {
    const alert = await prisma.alertIncident.findUnique({
      where: { id },
      include: {
        elderly: {
          select: { fullName: true, preferredName: true },
        },
      },
    });

    if (!alert) {
      throw new Error(`Alert incident with ID '${id}' not found.`);
    }

    return this.formatAlert(alert);
  }

  public static async triggerAlert(data: {
    elderlyId: string;
    type: string;
    severity: string;
    title: string;
    description: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    heartRate?: number;
    spo2?: number;
    temperature?: number;
    impactGForce?: number;
  }) {
    const elderly = await prisma.elderlyProfile.findUnique({
      where: { id: data.elderlyId },
      select: { fullName: true },
    });

    const alert = await prisma.alertIncident.create({
      data: {
        elderlyId: data.elderlyId,
        type: data.type,
        severity: data.severity,
        status: 'active',
        title: data.title,
        description: data.description,
        location: data.location || 'Home',
        latitude: data.latitude,
        longitude: data.longitude,
        heartRate: data.heartRate,
        spo2: data.spo2,
        temperature: data.temperature,
        impactGForce: data.impactGForce,
      },
    });

    const formatted = this.formatAlert({
      ...alert,
      elderly: { fullName: elderly?.fullName || 'Senior' },
    });

    socketManager.emitAlertTriggered(data.elderlyId, formatted);

    return formatted;
  }

  public static async acknowledgeAlert(id: string, acknowledgedBy: string) {
    const existing = await prisma.alertIncident.findUnique({ where: { id } });
    if (!existing) {
      throw new Error(`Alert incident with ID '${id}' not found.`);
    }

    const updated = await prisma.alertIncident.update({
      where: { id },
      data: {
        status: 'acknowledged',
        acknowledgedBy,
        acknowledgedAt: new Date(),
      },
      include: {
        elderly: { select: { fullName: true } },
      },
    });

    const formatted = this.formatAlert(updated);
    socketManager.emitAlertUpdated(updated.elderlyId, 'alert:acknowledged', formatted);

    return formatted;
  }

  public static async resolveAlert(id: string, resolvedBy: string, resolutionNotes: string) {
    const existing = await prisma.alertIncident.findUnique({ where: { id } });
    if (!existing) {
      throw new Error(`Alert incident with ID '${id}' not found.`);
    }

    const updated = await prisma.alertIncident.update({
      where: { id },
      data: {
        status: 'resolved',
        resolvedBy,
        resolvedAt: new Date(),
        resolutionNotes,
      },
      include: {
        elderly: { select: { fullName: true } },
      },
    });

    const formatted = this.formatAlert(updated);
    socketManager.emitAlertUpdated(updated.elderlyId, 'alert:resolved', formatted);

    return formatted;
  }

  private static formatAlert(a: any) {
    return {
      id: a.id,
      type: a.type,
      severity: a.severity,
      status: a.status,
      title: a.title,
      description: a.description,
      timestamp: a.timestamp.toISOString(),
      elderlyId: a.elderlyId,
      elderlyName: a.elderly?.fullName || 'Margaret Thompson',
      location: a.location,
      coordinates: a.latitude && a.longitude ? { latitude: a.latitude, longitude: a.longitude } : undefined,
      vitalReadings: {
        heartRate: a.heartRate ?? undefined,
        spo2: a.spo2 ?? undefined,
        temperature: a.temperature ?? undefined,
        impactGForce: a.impactGForce ?? undefined,
      },
      acknowledgedBy: a.acknowledgedBy ?? undefined,
      acknowledgedAt: a.acknowledgedAt ? a.acknowledgedAt.toISOString() : undefined,
      resolvedBy: a.resolvedBy ?? undefined,
      resolvedAt: a.resolvedAt ? a.resolvedAt.toISOString() : undefined,
      resolutionNotes: a.resolutionNotes ?? undefined,
    };
  }
}
