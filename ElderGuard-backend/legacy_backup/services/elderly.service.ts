import { prisma } from '../utils/prisma';

export class ElderlyService {
  public static async getProfilesForUser(userId: string, userRole: string) {
    let whereClause: any = {};
    if (userRole === 'parent') {
      whereClause = { parentManagerId: userId };
    } else if (userRole === 'caregiver') {
      whereClause = { primaryCaregiverId: userId };
    }

    const profiles = await prisma.elderlyProfile.findMany({
      where: whereClause,
      include: {
        parentManager: { select: { id: true, name: true, phone: true } },
        primaryCaregiver: { select: { id: true, name: true, phone: true } },
        emergencyContacts: true,
        devices: true,
      },
    });

    return profiles.map(this.formatProfile);
  }

  public static async getProfileById(id: string) {
    const profile = await prisma.elderlyProfile.findUnique({
      where: { id },
      include: {
        parentManager: { select: { id: true, name: true, phone: true } },
        primaryCaregiver: { select: { id: true, name: true, phone: true } },
        emergencyContacts: true,
        devices: true,
      },
    });

    if (!profile) {
      throw new Error(`Elderly profile with ID '${id}' not found.`);
    }

    return this.formatProfile(profile);
  }

  public static async createProfile(data: {
    fullName: string;
    preferredName?: string;
    age: number;
    dateOfBirth: string;
    gender: string;
    height?: string;
    weight?: string;
    bloodType?: string;
    address: string;
    room?: string;
    phone?: string;
    imageUrl?: string;
    parentManagerId: string;
    primaryCaregiverId?: string;
    allergies?: string[];
    conditions?: string[];
    physicianName?: string;
    physicianPhone?: string;
    hospitalPreference?: string;
    emergencyContacts?: Array<{
      name: string;
      relationship: string;
      phone: string;
      isPrimary?: boolean;
    }>;
    deviceId?: string;
  }) {
    const profile = await prisma.elderlyProfile.create({
      data: {
        fullName: data.fullName,
        preferredName: data.preferredName || data.fullName.split(' ')[0],
        age: data.age,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        height: data.height,
        weight: data.weight,
        bloodType: data.bloodType,
        address: data.address,
        room: data.room,
        phone: data.phone,
        imageUrl: data.imageUrl,
        parentManagerId: data.parentManagerId,
        primaryCaregiverId: data.primaryCaregiverId,
        allergies: data.allergies ? JSON.stringify(data.allergies) : null,
        conditions: data.conditions ? JSON.stringify(data.conditions) : null,
        physicianName: data.physicianName,
        physicianPhone: data.physicianPhone,
        hospitalPreference: data.hospitalPreference,
        emergencyContacts: data.emergencyContacts ? {
          create: data.emergencyContacts.map((c) => ({
            name: c.name,
            relationship: c.relationship,
            phone: c.phone,
            isPrimary: c.isPrimary ?? false,
          })),
        } : undefined,
        devices: data.deviceId ? {
          create: {
            deviceId: data.deviceId,
            deviceName: 'ElderGuard Smart Band',
          },
        } : undefined,
      },
      include: {
        parentManager: { select: { id: true, name: true, phone: true } },
        primaryCaregiver: { select: { id: true, name: true, phone: true } },
        emergencyContacts: true,
        devices: true,
      },
    });

    return this.formatProfile(profile);
  }

  public static async updateProfile(id: string, updates: any) {
    const updateData: any = { ...updates };
    if (updates.allergies && Array.isArray(updates.allergies)) {
      updateData.allergies = JSON.stringify(updates.allergies);
    }
    if (updates.conditions && Array.isArray(updates.conditions)) {
      updateData.conditions = JSON.stringify(updates.conditions);
    }

    const profile = await prisma.elderlyProfile.update({
      where: { id },
      data: updateData,
      include: {
        parentManager: { select: { id: true, name: true, phone: true } },
        primaryCaregiver: { select: { id: true, name: true, phone: true } },
        emergencyContacts: true,
        devices: true,
      },
    });

    return this.formatProfile(profile);
  }

  private static formatProfile(p: any) {
    let allergies: string[] = [];
    let conditions: string[] = [];
    try {
      if (p.allergies) allergies = JSON.parse(p.allergies);
    } catch (_) {}
    try {
      if (p.conditions) conditions = JSON.parse(p.conditions);
    } catch (_) {}

    const primaryDevice = p.devices?.[0];

    return {
      id: p.id,
      fullName: p.fullName,
      preferredName: p.preferredName,
      age: p.age,
      dateOfBirth: p.dateOfBirth,
      gender: p.gender,
      height: p.height,
      weight: p.weight,
      bloodType: p.bloodType,
      address: p.address,
      room: p.room,
      phone: p.phone,
      imageUrl: p.imageUrl,
      parentManagerId: p.parentManagerId,
      parentManagerName: p.parentManager?.name,
      primaryCaregiverId: p.primaryCaregiverId,
      primaryCaregiverName: p.primaryCaregiver?.name,
      medicalInfo: {
        bloodType: p.bloodType || 'Unknown',
        allergies,
        chronicConditions: conditions,
        physicianName: p.physicianName,
        physicianPhone: p.physicianPhone,
        hospitalPreference: p.hospitalPreference,
      },
      emergencyContacts: (p.emergencyContacts || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        relationship: c.relationship,
        phone: c.phone,
        isPrimary: c.isPrimary,
      })),
      deviceStatus: {
        deviceId: primaryDevice?.deviceId || 'UNPAIRED',
        deviceName: primaryDevice?.deviceName || 'ElderGuard Smart Band',
        connected: primaryDevice?.connected ?? false,
        batteryLevel: primaryDevice?.batteryLevel ?? 0,
        lastSync: primaryDevice?.lastSync ? primaryDevice.lastSync.toISOString() : new Date().toISOString(),
        signalStrength: primaryDevice?.signalStrength || 'strong',
        firmwareVersion: primaryDevice?.firmwareVersion || 'v2.4.1',
      },
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    };
  }
}
