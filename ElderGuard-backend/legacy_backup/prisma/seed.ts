import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('[Seed] Starting ElderGuard database seeding...');

  // 1. Clean existing records (in reverse dependency order)
  await prisma.careActivity.deleteMany();
  await prisma.medicationDose.deleteMany();
  await prisma.medication.deleteMany();
  await prisma.alertIncident.deleteMany();
  await prisma.vitalRecord.deleteMany();
  await prisma.device.deleteMany();
  await prisma.emergencyContact.deleteMany();
  await prisma.elderlyProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 2. Create Users
  const parent = await prisma.user.create({
    data: {
      id: 'usr-parent-01',
      name: 'Robert Thompson',
      email: 'robert.thompson@email.com',
      password: passwordHash,
      role: 'parent',
      phone: '+44 7700 900123',
    },
  });

  const caregiver = await prisma.user.create({
    data: {
      id: 'usr-caregiver-01',
      name: 'Sarah Mitchell',
      email: 'sarah.mitchell@elderguard.com',
      password: passwordHash,
      role: 'caregiver',
      phone: '+44 7700 900456',
    },
  });

  console.log('[Seed] Created users: Robert Thompson (Parent), Sarah Mitchell (Caregiver)');

  // 3. Create Senior Profile (Margaret)
  const elderly = await prisma.elderlyProfile.create({
    data: {
      id: 'eld-01',
      fullName: 'Margaret Thompson',
      preferredName: 'Margaret',
      age: 78,
      dateOfBirth: '1946-03-15',
      gender: 'Female',
      height: '162 cm',
      weight: '68 kg',
      bloodType: 'A+',
      address: '42 Maple Street, London, SW1A 2AA',
      room: 'Ground Floor, Room 1',
      phone: '+44 20 7946 0199',
      imageUrl: 'https://images.unsplash.com/photo-1758691031787-90867cb6fb2c?w=120&h=120&fit=crop&auto=format',
      parentManagerId: parent.id,
      primaryCaregiverId: caregiver.id,
      allergies: JSON.stringify(['Penicillin', 'Sulfonamides']),
      conditions: JSON.stringify(['Type 2 Diabetes', 'Hypertension', 'Mild Osteoporosis']),
      physicianName: 'Dr. James Hargreaves',
      physicianPhone: '+44 20 7946 0000',
      hospitalPreference: "St. Thomas' Hospital, London",
      emergencyContacts: {
        create: [
          {
            name: 'Robert Thompson',
            relationship: 'Son (Primary)',
            phone: '+44 7700 900123',
            isPrimary: true,
          },
          {
            name: 'Sarah Mitchell',
            relationship: 'Registered Nurse / Caregiver',
            phone: '+44 7700 900456',
            isPrimary: false,
          },
        ],
      },
      devices: {
        create: [
          {
            deviceId: 'EG-IOT-4892',
            deviceName: 'ElderGuard Smart Band',
            connected: true,
            batteryLevel: 84,
            signalStrength: 'strong',
            firmwareVersion: 'v2.4.1',
          },
        ],
      },
    },
  });

  console.log('[Seed] Created senior profile: Margaret Thompson (eld-01)');

  // 4. Seed 24-hour Vitals Waveform
  const mockHeartRate = [66, 63, 61, 65, 74, 91, 85, 76, 72, 70, 68, 69, 73, 75, 74, 70, 67, 72];
  const mockSpo2 = [97, 96, 97, 95, 97, 98, 97, 96, 97, 97];
  const now = new Date();

  for (let i = mockHeartRate.length - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hr = mockHeartRate[mockHeartRate.length - 1 - i];
    const sp = mockSpo2[i % mockSpo2.length];
    await prisma.vitalRecord.create({
      data: {
        elderlyId: elderly.id,
        heartRate: hr,
        spo2: sp,
        temperature: 36.6 + (i % 4) * 0.1,
        steps: Math.max(0, 1247 - i * 60),
        activity: hr > 80 ? 'Light Walk' : 'Resting',
        gForce: 1.0,
        fallDetected: false,
        batteryPct: 84,
        geofenceZone: 'Living Room',
        timestamp,
      },
    });
  }

  console.log('[Seed] Seeded historical 24h vitals');

  // 5. Seed Medications & Today's Doses
  const today = now.toISOString().split('T')[0];

  const medData = [
    {
      name: 'Aspirin',
      dosage: '100mg',
      frequency: 'Once daily',
      instructions: 'Take with food',
      timesOfDay: ['08:00'],
      color: '#3C6FDB',
      stock: 22,
      doseTaken: true,
      takenAt: '08:07 AM',
      period: 'Morning',
    },
    {
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      instructions: 'Take with water',
      timesOfDay: ['08:00'],
      color: '#16A34A',
      stock: 14,
      doseTaken: true,
      takenAt: '08:07 AM',
      period: 'Morning',
    },
    {
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      instructions: 'Take after meals',
      timesOfDay: ['13:00', '19:00'],
      color: '#EA580C',
      stock: 30,
      doseTaken: true,
      takenAt: '13:12 PM',
      period: 'After Lunch',
    },
    {
      name: 'Alendronic Acid',
      dosage: '70mg',
      frequency: 'Weekly – Friday',
      instructions: '30 min before eating, stand upright for 30 min',
      timesOfDay: ['08:00'],
      color: '#8B5CF6',
      stock: 8,
      doseTaken: false,
      takenAt: null,
      period: 'Morning (empty stomach)',
    },
  ];

  for (const m of medData) {
    const med = await prisma.medication.create({
      data: {
        elderlyId: elderly.id,
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        instructions: m.instructions,
        timesOfDay: JSON.stringify(m.timesOfDay),
        color: m.color,
        stock: m.stock,
      },
    });

    for (const time of m.timesOfDay) {
      const isTaken = m.doseTaken && time === m.timesOfDay[0];
      await prisma.medicationDose.create({
        data: {
          medicationId: med.id,
          scheduledTime: time,
          period: m.period,
          status: isTaken ? 'taken' : 'pending',
          date: today,
          takenAt: isTaken ? m.takenAt : null,
          loggedBy: isTaken ? 'Sarah Mitchell' : null,
          loggedAt: isTaken ? new Date() : null,
        },
      });
    }
  }

  console.log('[Seed] Seeded medications and today doses');

  // 6. Seed Care Activities
  await prisma.careActivity.createMany({
    data: [
      {
        elderlyId: elderly.id,
        title: 'Morning Wellness Check',
        category: 'vital_check',
        target: 1,
        current: 1,
        unit: 'check',
        status: 'completed',
        notes: 'Margaret is in good spirits this morning. Vital signs normal. No complaints of pain.',
        loggedBy: 'Sarah Mitchell',
        scheduledTime: '08:30',
      },
      {
        elderlyId: elderly.id,
        title: 'Physiotherapy Exercises',
        category: 'mobility',
        target: 30,
        current: 30,
        unit: 'min',
        status: 'completed',
        notes: 'Completed 30-min physiotherapy session focusing on leg strength and balance.',
        loggedBy: 'Sarah Mitchell',
        scheduledTime: '09:00',
      },
      {
        elderlyId: elderly.id,
        title: 'Daily Hydration Goal',
        category: 'hydration',
        target: 1800,
        current: 1200,
        unit: 'ml',
        status: 'in_progress',
        notes: 'Target 1.8L of water throughout the day.',
        loggedBy: 'Sarah Mitchell',
        scheduledTime: '12:00',
      },
      {
        elderlyId: elderly.id,
        title: 'Outdoor Garden Walk',
        category: 'mobility',
        target: 20,
        current: 0,
        unit: 'min',
        status: 'pending',
        notes: 'Accompanied walk in the garden.',
        scheduledTime: '16:30',
      },
    ],
  });

  console.log('[Seed] Seeded care activities');

  // 7. Seed Alerts History
  await prisma.alertIncident.createMany({
    data: [
      {
        elderlyId: elderly.id,
        type: 'heart_rate',
        severity: 'warning',
        status: 'resolved',
        title: 'Elevated Heart Rate',
        description: 'Heart rate reached 91 bpm during morning activity. Returned to normal within 12 minutes.',
        location: 'Garden',
        heartRate: 91,
        spo2: 97,
        temperature: 36.8,
        acknowledgedBy: 'Sarah Mitchell',
        resolvedBy: 'Sarah Mitchell',
        resolutionNotes: 'Rested in chair for 10 minutes. Heart rate returned to 74 bpm.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
      {
        elderlyId: elderly.id,
        type: 'fall',
        severity: 'critical',
        status: 'resolved',
        title: 'Fall Detected',
        description: 'Wearable sensor detected a fall event. Margaret confirmed she is okay. Minor bruise on left knee noted.',
        location: 'Living Room',
        impactGForce: 3.42,
        heartRate: 104,
        spo2: 96,
        temperature: 36.8,
        acknowledgedBy: 'Robert Thompson',
        resolvedBy: 'Sarah Mitchell',
        resolutionNotes: 'Checked Margaret in living room, assisted to chair, vitals stable, cold pack applied to knee.',
        timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
      },
      {
        elderlyId: elderly.id,
        type: 'spo2',
        severity: 'warning',
        status: 'resolved',
        title: 'SpO₂ Below Threshold',
        description: 'Oxygen saturation dropped to 94% for approximately 4 minutes during rest. Returned to 97%.',
        location: 'Bedroom',
        heartRate: 68,
        spo2: 94,
        temperature: 36.7,
        acknowledgedBy: 'Sarah Mitchell',
        resolvedBy: 'Sarah Mitchell',
        resolutionNotes: 'Repositioned pillows, deep breathing exercises done, saturation restored to 97%.',
        timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000),
      },
    ],
  });

  console.log('[Seed] Seeded alerts history');
  console.log('[Seed] Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('[Seed] Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
