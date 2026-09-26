/**
 * GUYNOVA GUARD Centralized Mock Data
 *
 * Enriched with the complete Figma design datasets for Margaret, Robert,
 * Sarah Mitchell, Dr. Hargreaves, vitals telemetry history, medications,
 * daily routines, alerts, and timeline events.
 */

import { User } from '@/types/auth';

export const MOCK_USERS: Record<string, User> = {
  Tutor: {
    id: '6', // Matches Robert Ngu in MySQL DB
    name: 'Robert Ngu',
    email: 'robert.ngu@GUYNOVA GUARD.cm',
    role: 'parent',
    phone: '+237 671 23 45 67',
    assignedElderlyCount: 1,
    createdAt: '2026-01-15T08:00:00.000Z',
    status: 'active',
  },
  caregiver: {
    id: 'usr-caregiver-01',
    name: 'Amara Biya',
    email: 'amara.biya@GUYNOVA GUARD.cm',
    role: 'caregiver',
    phone: '+237 699 45 23 10',
    assignedElderlyCount: 1,
    createdAt: '2026-02-01T09:30:00.000Z',
    status: 'active',
  },
  doctor: {
    id: 'usr-doctor-01',
    name: 'Dr. Jean-Paul Mbarga',
    email: 'doctor.mbarga@GUYNOVA GUARD.cm',
    role: 'doctor',
    phone: '+237 655 89 12 34',
    assignedElderlyCount: 1,
    createdAt: '2026-01-10T08:00:00.000Z',
    status: 'active',
  },
};

export const MOCK_ELDERLY_PERSON = {
  id: 'eld-01',
  fullName: 'Pa Samuel Ngu',
  preferredName: 'Pa Samuel',
  age: 78,
  dateOfBirth: '1948-03-15',
  gender: 'Male',
  height: '174 cm',
  weight: '72 kg',
  bloodType: 'O+',
  primaryCaregiverId: 'usr-caregiver-01',
  parentManagerId: 'usr-Tutor-01',
  emergencyContact: {
    name: 'Robert Ngu',
    relationship: 'Son (Primary)',
    phone: '+237 671 23 45 67',
  },
  address: 'Bastos, Yaoundé, Cameroon',
  room: 'Main Villa, Ground Suite',
  deviceConnected: true,
  deviceId: 'EG-IOT-4892',
  conditions: ['Hypertension', 'Type 2 Diabetes', 'Mild Joint Stiffness'],
  allergies: ['Penicillin'],
  photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&h=400&fit=crop&auto=format',
};

export const MOCK_CAREGIVER = {
  name: 'Amara Biya',
  firstName: 'Amara',
  email: 'amara.biya@GUYNOVA GUARD.cm',
  phone: '+237 699 45 23 10',
  qualification: 'Infirmière Diplômée d’État (IDE)',
  experience: '7 ans',
  avatar: 'AB',
  shiftStart: '07:30',
  shiftEnd: '18:30',
};

export const MOCK_DOCTOR = {
  name: 'Dr. Jean-Paul Mbarga',
  specialty: 'Cardiologie & Médecine Gériatrique',
  phone: '+237 655 89 12 34',
  hospital: 'Hôpital Central de Yaoundé',
};

export const MOCK_VITALS = {
  heartRate: 72,
  spo2: 97,
  temperature: 36.8,
  activity: 'Resting',
  steps: 1247,
  status: 'safe' as const,
  lastUpdated: '2 min ago',
  battery: 84,
  deviceConnected: true,
};

export const MOCK_HEART_RATE_HISTORY = [
  { time: '00:00', value: 66 },
  { time: '02:00', value: 63 },
  { time: '04:00', value: 61 },
  { time: '06:00', value: 65 },
  { time: '08:00', value: 74 },
  { time: '09:30', value: 91 },
  { time: '10:00', value: 85 },
  { time: '11:00', value: 76 },
  { time: '12:00', value: 72 },
  { time: '13:00', value: 70 },
  { time: '14:00', value: 68 },
  { time: '15:00', value: 69 },
  { time: '16:00', value: 73 },
  { time: '17:00', value: 75 },
  { time: '18:00', value: 74 },
  { time: '20:00', value: 70 },
  { time: '22:00', value: 67 },
  { time: 'Now', value: 72 },
];

export const MOCK_SPO2_HISTORY = [
  { time: '00:00', value: 97 },
  { time: '04:00', value: 96 },
  { time: '08:00', value: 97 },
  { time: '10:00', value: 95 },
  { time: '12:00', value: 97 },
  { time: '14:00', value: 98 },
  { time: '16:00', value: 97 },
  { time: '18:00', value: 96 },
  { time: '20:00', value: 97 },
  { time: 'Now', value: 97 },
];

export const MOCK_TEMP_HISTORY = [
  { time: '06:00', value: 36.4 },
  { time: '10:00', value: 36.6 },
  { time: '14:00', value: 36.9 },
  { time: '18:00', value: 36.8 },
  { time: 'Now', value: 36.8 },
];

export const MOCK_MEDICATIONS = [
  {
    id: 1,
    name: 'Aspirin',
    dose: '100mg',
    schedule: '08:00',
    period: 'Morning',
    taken: true,
    takenAt: '08:07 AM',
    color: '#3C6FDB',
    instructions: 'Take with food',
    stock: 22,
  },
  {
    id: 2,
    name: 'Lisinopril',
    dose: '10mg',
    schedule: '08:00',
    period: 'Morning',
    taken: true,
    takenAt: '08:07 AM',
    color: '#16A34A',
    instructions: 'Take with water',
    stock: 14,
  },
  {
    id: 3,
    name: 'Metformin',
    dose: '500mg',
    schedule: '13:00',
    period: 'After Lunch',
    taken: true,
    takenAt: '13:12 PM',
    color: '#EA580C',
    instructions: 'Take after meals',
    stock: 30,
  },
  {
    id: 4,
    name: 'Alendronic Acid',
    dose: '70mg',
    schedule: 'Weekly – Friday',
    period: 'Morning (empty stomach)',
    taken: false,
    takenAt: null,
    color: '#8B5CF6',
    instructions: '30 min before eating, stand upright for 30 min',
    stock: 8,
  },
  {
    id: 5,
    name: 'Metformin',
    dose: '500mg',
    schedule: '19:00',
    period: 'After Dinner',
    taken: false,
    takenAt: null,
    color: '#EA580C',
    instructions: 'Take after meals',
    stock: 30,
  },
];

export const MOCK_PROGRAMME = [
  { time: '07:00', label: 'Wake up', done: true, icon: 'sun' },
  { time: '07:30', label: 'Breakfast', done: true, icon: 'coffee' },
  { time: '08:00', label: 'Morning medication', done: true, icon: 'pill', isMed: true },
  { time: '09:00', label: 'Physical therapy exercises', done: true, icon: 'activity' },
  { time: '10:30', label: 'Light walk — garden', done: true, icon: 'walk' },
  { time: '12:30', label: 'Lunch', done: false, icon: 'utensils', current: true },
  { time: '13:00', label: 'Midday medication', done: false, icon: 'pill', isMed: true },
  { time: '14:00', label: 'Rest / Afternoon nap', done: false, icon: 'moon' },
  { time: '16:00', label: 'Afternoon tea', done: false, icon: 'coffee' },
  { time: '17:30', label: 'Family video call', done: false, icon: 'video' },
  { time: '19:00', label: 'Dinner', done: false, icon: 'utensils' },
  { time: '19:30', label: 'Evening medication', done: false, icon: 'pill', isMed: true },
  { time: '21:30', label: 'Prepare for bed', done: false, icon: 'moon' },
];

export const MOCK_ALERTS_LIST = [
  {
    id: 'alt-01',
    type: 'warning' as const,
    title: 'Elevated Heart Rate',
    description: 'Heart rate reached 91 bpm during morning activity. Returned to normal within 12 minutes.',
    time: '09:32 AM',
    date: 'Today',
    resolved: true,
  },
  {
    id: 'alt-02',
    type: 'info' as const,
    title: 'Morning Medication Taken',
    description: 'Aspirin 100mg and Lisinopril 10mg confirmed taken at 08:07 AM.',
    time: '08:07 AM',
    date: 'Today',
    resolved: true,
  },
  {
    id: 'alt-03',
    type: 'info' as const,
    title: 'Caregiver Check-in',
    description: 'Amara Biya confirmed morning wellness check and recorded vitals.',
    time: '08:30 AM',
    date: 'Today',
    resolved: true,
  },
  {
    id: 'alt-04',
    type: 'critical' as const,
    title: 'Fall Detected',
    description: 'Wearable sensor detected a fall event. Pa Samuel confirmed he is okay. Minor bruise on left knee noted.',
    time: '10:15 AM',
    date: 'Yesterday',
    resolved: true,
  },
  {
    id: 'alt-05',
    type: 'warning' as const,
    title: 'SpO₂ Below Threshold',
    description: 'Oxygen saturation dropped to 94% for approximately 4 minutes during rest. Returned to 97%.',
    time: '03:22 PM',
    date: 'Yesterday',
    resolved: true,
  },
  {
    id: 'alt-06',
    type: 'info' as const,
    title: 'Device Recharged',
    description: 'Wearable device battery fully charged to 100%.',
    time: '07:45 PM',
    date: 'Yesterday',
    resolved: true,
  },
];

export const MOCK_CARE_ACTIVITIES = [
  {
    id: 1,
    caregiver: 'Amara Biya',
    type: 'wellness-check',
    title: 'Morning Wellness Check',
    notes: 'Pa Samuel is in good spirits this morning. Vital signs normal. No complaints of pain. Assisted with morning hygiene routine in Yaoundé Bastos.',
    time: '08:30 AM',
    date: 'Today',
    duration: '25 min',
    completed: true,
  },
  {
    id: 2,
    caregiver: 'Amara Biya',
    type: 'medication',
    title: 'Medication Administration',
    notes: 'Administered Amlodipine 5mg and Lisinopril 10mg as scheduled. Pa Samuel took both with water without difficulty.',
    time: '08:07 AM',
    date: 'Today',
    duration: '5 min',
    completed: true,
  },
  {
    id: 3,
    caregiver: 'Amara Biya',
    type: 'physiotherapy',
    title: 'Physiotherapy Exercises',
    notes: 'Completed 30-min physiotherapy session focusing on leg strength and balance. Pa Samuel performed all exercises with good effort.',
    time: '09:00 AM',
    date: 'Today',
    duration: '30 min',
    completed: true,
  },
  {
    id: 4,
    caregiver: 'Amara Biya',
    type: 'walk',
    title: 'Outdoor Walk — Bastos Compound',
    notes: 'Accompanied Pa Samuel for a 20-minute walk in the garden. Good mood, 1,247 steps recorded. Pleasant weather.',
    time: '10:30 AM',
    date: 'Today',
    duration: '20 min',
    completed: false,
  },
];

export const MOCK_TIMELINE_EVENTS = [
  {
    date: 'Today, 25 Aug',
    events: [
      { time: '09:32', type: 'warning', text: 'Elevated heart rate (91 bpm) during morning walk' },
      { time: '09:00', type: 'activity', text: 'Physiotherapy session completed — 30 min' },
      { time: '08:30', type: 'caregiver', text: 'Amara Biya: Morning wellness check completed' },
      { time: '08:07', type: 'medication', text: 'Morning medications taken — Amlodipine, Lisinopril' },
      { time: '07:00', type: 'activity', text: 'Wake up detected by motion sensor' },
    ],
  },
  {
    date: 'Yesterday, 24 Aug',
    events: [
      { time: '19:00', type: 'medication', text: 'Evening medications taken — Metformin 500mg' },
      { time: '10:15', type: 'critical', text: 'Fall detected — assessed by Amara, Dr. Jean-Paul Mbarga notified' },
      { time: '08:07', type: 'medication', text: 'Morning medications taken on time' },
    ],
  },
];

