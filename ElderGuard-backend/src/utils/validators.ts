import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['parent', 'caregiver', 'admin']),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const telemetryIngestSchema = z.object({
  deviceId: z.string().min(1, 'Device ID is required'),
  elderlyId: z.string().optional(),
  batteryPct: z.number().min(0).max(100).optional(),
  heartRate: z.number().min(30).max(250),
  spo2: z.number().min(50).max(100),
  temperature: z.number().min(30).max(45),
  steps: z.number().optional(),
  gForce: z.number().optional(),
  fallDetected: z.boolean().optional(),
  activity: z.string().optional(),
  location: z.object({
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    geofenceZone: z.string().optional(),
  }).optional(),
});

export const simulateSchema = z.object({
  elderlyId: z.string().optional(),
  anomalyType: z.enum(['fall', 'tachycardia', 'lowOxygen', 'normal']),
});

export const acknowledgeAlertSchema = z.object({
  acknowledgedBy: z.string().optional(),
});

export const resolveAlertSchema = z.object({
  notes: z.string().min(1, 'Resolution notes are required'),
  resolvedBy: z.string().optional(),
});

export const updateDoseStatusSchema = z.object({
  status: z.enum(['pending', 'taken', 'missed']),
  notes: z.string().optional(),
  loggedByName: z.string().optional(),
});

export const createMedicationSchema = z.object({
  elderlyId: z.string().min(1),
  name: z.string().min(1),
  dosage: z.string().min(1),
  frequency: z.string().min(1),
  instructions: z.string().min(1),
  timesOfDay: z.array(z.string()).min(1),
  color: z.string().optional(),
  stock: z.number().optional(),
});
