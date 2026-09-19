import { prisma } from '../utils/prisma';
import { socketManager } from '../socket/socketManager';

export class CareService {
  public static async getMedications(elderlyId: string) {
    const meds = await prisma.medication.findMany({
      where: { elderlyId },
      include: { doses: true },
    });

    return meds.map((m) => {
      let times: string[] = [];
      try {
        times = JSON.parse(m.timesOfDay);
      } catch (_) {}
      return {
        id: m.id,
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        instructions: m.instructions,
        timesOfDay: times,
        color: m.color,
        stock: m.stock,
      };
    });
  }

  public static async createMedication(data: {
    elderlyId: string;
    name: string;
    dosage: string;
    frequency: string;
    instructions: string;
    timesOfDay: string[];
    color?: string;
    stock?: number;
  }) {
    const med = await prisma.medication.create({
      data: {
        elderlyId: data.elderlyId,
        name: data.name,
        dosage: data.dosage,
        frequency: data.frequency,
        instructions: data.instructions,
        timesOfDay: JSON.stringify(data.timesOfDay),
        color: data.color || '#3C6FDB',
        stock: data.stock || 30,
      },
    });

    // Create today's doses for this new medication
    const today = new Date().toISOString().split('T')[0];
    for (const time of data.timesOfDay) {
      await prisma.medicationDose.create({
        data: {
          medicationId: med.id,
          scheduledTime: time,
          period: this.getPeriodFromTime(time),
          status: 'pending',
          date: today,
        },
      });
    }

    return {
      id: med.id,
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      instructions: med.instructions,
      timesOfDay: data.timesOfDay,
      color: med.color,
      stock: med.stock,
    };
  }

  public static async getTodayDoses(elderlyId?: string) {
    const today = new Date().toISOString().split('T')[0];

    const doses = await prisma.medicationDose.findMany({
      where: {
        date: today,
        medication: elderlyId ? { elderlyId } : undefined,
      },
      include: {
        medication: {
          select: { name: true, dosage: true, color: true, elderlyId: true },
        },
      },
      orderBy: { scheduledTime: 'asc' },
    });

    return doses.map((d) => ({
      id: d.id,
      medicationId: d.medicationId,
      medicationName: d.medication.name,
      dosage: d.medication.dosage,
      color: d.medication.color,
      scheduledTime: d.scheduledTime,
      period: d.period,
      status: d.status,
      date: d.date,
      takenAt: d.takenAt,
      loggedBy: d.loggedBy,
      loggedAt: d.loggedAt ? d.loggedAt.toISOString() : undefined,
      notes: d.notes,
    }));
  }

  public static async updateDoseStatus(
    doseId: string,
    status: 'pending' | 'taken' | 'missed',
    loggedByName: string,
    notes?: string
  ) {
    const dose = await prisma.medicationDose.findUnique({
      where: { id: doseId },
      include: { medication: true },
    });

    if (!dose) {
      throw new Error(`Medication dose with ID '${doseId}' not found.`);
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const updated = await prisma.medicationDose.update({
      where: { id: doseId },
      data: {
        status,
        takenAt: status === 'taken' ? timeStr : null,
        loggedBy: loggedByName,
        loggedAt: now,
        notes,
      },
      include: { medication: true },
    });

    // If taken, decrement stock
    if (status === 'taken' && dose.status !== 'taken' && dose.medication.stock > 0) {
      await prisma.medication.update({
        where: { id: dose.medicationId },
        data: { stock: dose.medication.stock - 1 },
      });
    }

    const result = {
      id: updated.id,
      medicationId: updated.medicationId,
      medicationName: updated.medication.name,
      dosage: updated.medication.dosage,
      scheduledTime: updated.scheduledTime,
      status: updated.status,
      takenAt: updated.takenAt,
      loggedBy: updated.loggedBy,
      loggedAt: updated.loggedAt?.toISOString(),
      notes: updated.notes,
    };

    socketManager.emitDoseUpdated(dose.medication.elderlyId, result);

    return result;
  }

  public static async getActivities(elderlyId: string) {
    return prisma.careActivity.findMany({
      where: { elderlyId },
      orderBy: { scheduledTime: 'asc' },
    });
  }

  public static async updateActivityProgress(
    activityId: string,
    incrementValue: number,
    loggedByName: string
  ) {
    const activity = await prisma.careActivity.findUnique({ where: { id: activityId } });
    if (!activity) {
      throw new Error(`Care activity with ID '${activityId}' not found.`);
    }

    const newCurrent = Math.min(activity.target, Math.max(0, activity.current + incrementValue));
    const newStatus = newCurrent >= activity.target ? 'completed' : newCurrent > 0 ? 'in_progress' : 'pending';

    return prisma.careActivity.update({
      where: { id: activityId },
      data: {
        current: newCurrent,
        status: newStatus,
        loggedBy: loggedByName,
        loggedAt: new Date(),
      },
    });
  }

  private static getPeriodFromTime(time: string): string {
    const hour = parseInt(time.split(':')[0], 10);
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  }
}
