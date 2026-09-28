const fs = require('fs');
let text = fs.readFileSync('services/elderlyService.ts', 'utf8');

const replacement = `export function mapBackendToElderlyProfile(item: BackendElderlyProfile): ElderlyProfile {
  const birthYear = item.date_of_birth ? new Date(item.date_of_birth).getFullYear() : new Date().getFullYear();
  const currentYear = new Date().getFullYear();
  const calculatedAge = Math.max(1, currentYear - birthYear);

  return {
    id: \`eld-\${item.elderly_id}\`,
    fullName: item.full_name,
    preferredName: item.full_name.split(' ')[0],
    age: calculatedAge,
    dateOfBirth: item.date_of_birth ? String(item.date_of_birth).split('T')[0] : '',
    gender: (item.gender as 'Female' | 'Male' | 'Other') || 'Other',
    address: item.address,
    phone: item.emergency_contact,
    imageUrl: require('@/assets/images/elderly_margaret.jpg'), // Keeping default avatar for UI appeal
    parentManagerId: \`usr-\${item.parent_id}\`,
    primaryCaregiverId: item.caregiver_id ? \`usr-\${item.caregiver_id}\` : undefined,
    primaryCaregiverName: item.caregiver_name || undefined,
    doctorId: item.doctor_id ? \`usr-\${item.doctor_id}\` : undefined,
    doctorName: item.doctor_name || undefined,
    doctorPhone: item.doctor_phone || undefined,
    doctorSpecialty: item.doctor_specialty || undefined,
    doctorHospital: item.doctor_hospital || undefined,
    doctorEmail: item.doctor_email || undefined,
    medicalInfo: {
      bloodType: '',
      allergies: [],
      chronicConditions: item.medical_information ? [item.medical_information] : [],
      medicationNotes: item.medical_information || '',
      physicianName: item.doctor_name || undefined,
      physicianPhone: item.doctor_phone || undefined,
      hospitalPreference: item.doctor_hospital || undefined,
    },
    emergencyContacts: [
      {
        id: \`ec-\${item.elderly_id}\`,
        name: 'Designated Contact',
        relationship: 'Emergency Contact',
        phone: item.emergency_contact,
        isPrimary: true,
      },
    ],
    deviceStatus: {
      deviceId: \`EG-IOT-\${item.elderly_id.toString().padStart(4, '0')}\`,
      deviceName: 'GUYNOVA GUARD Smart Wearable',
      connected: true,
      batteryLevel: 94,
      lastSync: 'Just now',
      signalStrength: 'strong',
      firmwareVersion: 'v2.4.1',`;

const regex = /export function mapBackendToElderlyProfile\([\s\S]*?firmwareVersion: 'v2\.4\.1',/;
text = text.replace(regex, replacement);

fs.writeFileSync('services/elderlyService.ts', text, 'utf8');
