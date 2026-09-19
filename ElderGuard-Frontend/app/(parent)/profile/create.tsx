import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, UserPlus, AlertCircle } from 'lucide-react-native';
import { ScreenContainer, Button, TextInput, Card } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useElderly } from '@/context/ElderlyContext';
import { useAuth } from '@/context/AuthContext';

export default function CreateElderlyProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { createProfile } = useElderly();

  const [fullName, setFullName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [age, setAge] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const [bloodType, setBloodType] = useState('O+');
  const [allergies, setAllergies] = useState('');
  const [chronicConditions, setChronicConditions] = useState('');
  const [medicationNotes, setMedicationNotes] = useState('');

  const [emergencyName, setEmergencyName] = useState(user?.name || '');
  const [emergencyRelation, setEmergencyRelation] = useState('Parent Manager');
  const [emergencyPhone, setEmergencyPhone] = useState('+1 (555) 234-5678');

  const [doctorName, setDoctorName] = useState('Dr. James Hargreaves');
  const [doctorSpecialty, setDoctorSpecialty] = useState('Geriatric Medicine');
  const [doctorHospital, setDoctorHospital] = useState("St. Thomas' Hospital, London");
  const [doctorPhone, setDoctorPhone] = useState('+44 20 7946 0000');
  const [doctorEmail, setDoctorEmail] = useState('doctor@elderguard.com');

  const [deviceId, setDeviceId] = useState(`EG-IOT-${Math.floor(1000 + Math.random() * 9000)}`);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setError(null);
    if (!fullName.trim()) {
      setError('Please enter the full legal name.');
      return;
    }
    if (!age || isNaN(parseInt(age, 10))) {
      setError('Please enter a valid age in years.');
      return;
    }
    if (!address.trim()) {
      setError('Please enter the primary residence address.');
      return;
    }
    if (!emergencyName.trim() || !emergencyPhone.trim()) {
      setError('Please provide a primary emergency contact name and phone.');
      return;
    }

    setLoading(true);

    const parsedAllergies = allergies
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedConditions = chronicConditions
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const created = await createProfile({
      fullName: fullName.trim(),
      preferredName: preferredName.trim() || fullName.split(' ')[0],
      age: parseInt(age, 10),
      dateOfBirth: dateOfBirth.trim() || '1950-01-01',
      gender,
      address: address.trim(),
      phone: phone.trim(),
      parentManagerId: user?.id || 'usr-parent-01',
      doctorName: doctorName.trim() || 'Dr. James Hargreaves',
      doctorSpecialty: doctorSpecialty.trim() || 'Geriatric Medicine',
      doctorHospital: doctorHospital.trim() || "St. Thomas' Hospital, London",
      doctorPhone: doctorPhone.trim() || '+44 20 7946 0000',
      doctorEmail: doctorEmail.trim() || 'doctor@elderguard.com',
      medicalInfo: {
        bloodType: bloodType.trim(),
        allergies: parsedAllergies,
        chronicConditions: parsedConditions,
        medicationNotes: medicationNotes.trim(),
        physicianName: doctorName.trim() || 'Dr. James Hargreaves',
        physicianPhone: doctorPhone.trim() || '+44 20 7946 0000',
        hospitalPreference: doctorHospital.trim() || "St. Thomas' Hospital, London",
      },
      emergencyContacts: [
        {
          id: `ec-${Date.now()}`,
          name: emergencyName.trim(),
          relationship: emergencyRelation.trim(),
          phone: emergencyPhone.trim(),
          isPrimary: true,
        },
      ],
      deviceStatus: {
        deviceId: deviceId.trim(),
        deviceName: 'ElderGuard Smart Wearable',
        connected: true,
        batteryLevel: 95,
        lastSync: 'Just now',
        signalStrength: 'strong',
        firmwareVersion: 'v2.4.1',
      },
    });

    setLoading(false);
    if (created) {
      router.replace('/(parent)');
    } else {
      setError('Failed to create elderly profile. Please try again.');
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(parent)/profile' as any);
    }
  };

  return (
    <ScreenContainer scrollable keyboardAvoiding padded backgroundColor={Colors.background}>
      {/* ── Top Navigation Bar ──────────────────────────────── */}
      <View style={styles.topNav}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={22} color={Colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.navTitle}>Add Elderly Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Screen Intro */}
      <View style={styles.introHeader}>
        <Text style={styles.title}>Register Loved One</Text>
        <Text style={styles.subtitle}>
          Create a profile to begin real-time IoT monitoring, emergency alerts, and daily care records.
        </Text>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <AlertCircle size={16} color={Colors.critical} />
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      )}

      {/* ── 1. Personal Information ─────────────────────────── */}
      <Text style={styles.sectionLabel}>PERSONAL DETAILS</Text>
      <Card style={styles.card}>
        <TextInput
          label="Full Legal Name *"
          value={fullName}
          onChangeText={(t) => {
            setFullName(t);
            if (error) setError(null);
          }}
          placeholder="e.g. Robert Vance"
        />

        <View style={styles.spacing} />

        <TextInput
          label="Preferred Name"
          value={preferredName}
          onChangeText={setPreferredName}
          placeholder="e.g. Bob"
        />

        <View style={styles.spacing} />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <TextInput
              label="Age (Years) *"
              value={age}
              onChangeText={(t) => {
                setAge(t);
                if (error) setError(null);
              }}
              keyboardType="numeric"
              placeholder="e.g. 81"
            />
          </View>
          <View style={{ width: Spacing.md }} />
          <View style={{ flex: 1 }}>
            <TextInput
              label="Date of Birth"
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="YYYY-MM-DD"
            />
          </View>
        </View>

        <View style={styles.spacing} />

        {/* Gender Selection */}
        <Text style={styles.fieldLabel}>Gender</Text>
        <View style={styles.genderRow}>
          {(['Female', 'Male', 'Other'] as const).map((g) => (
            <TouchableOpacity
              key={g}
              onPress={() => setGender(g)}
              style={[styles.genderChip, gender === g && styles.genderChipActive]}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.genderChipText, gender === g && styles.genderChipTextActive]}
              >
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.spacing} />

        <TextInput
          label="Home Address *"
          value={address}
          onChangeText={(t) => {
            setAddress(t);
            if (error) setError(null);
          }}
          placeholder="e.g. 504 Oak Ridge Way, Newark, NJ"
        />

        <View style={styles.spacing} />

        <TextInput
          label="Personal Phone (Optional)"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="e.g. +1 (555) 432-8901"
        />
      </Card>

      <View style={{ height: Spacing.lg }} />

      {/* ── 2. Primary Emergency Contact ────────────────────── */}
      <Text style={styles.sectionLabel}>PRIMARY EMERGENCY CONTACT</Text>
      <Card style={styles.card}>
        <TextInput
          label="Contact Name *"
          value={emergencyName}
          onChangeText={(t) => {
            setEmergencyName(t);
            if (error) setError(null);
          }}
          placeholder="e.g. Eleanor Vance"
        />

        <View style={styles.spacing} />

        <TextInput
          label="Relationship *"
          value={emergencyRelation}
          onChangeText={setEmergencyRelation}
          placeholder="e.g. Daughter / Primary Family Manager"
        />

        <View style={styles.spacing} />

        <TextInput
          label="Emergency Phone *"
          value={emergencyPhone}
          onChangeText={(t) => {
            setEmergencyPhone(t);
            if (error) setError(null);
          }}
          keyboardType="phone-pad"
          placeholder="e.g. +1 (555) 234-5678"
        />
      </Card>

      <View style={{ height: Spacing.lg }} />

      {/* ── 3. Medical Profile ──────────────────────────────── */}
      <Text style={styles.sectionLabel}>HEALTH & MEDICAL PROFILE</Text>
      <Card style={styles.card}>
        <TextInput
          label="Blood Type"
          value={bloodType}
          onChangeText={setBloodType}
          placeholder="e.g. O+, A+, B-"
        />

        <View style={styles.spacing} />

        <TextInput
          label="Allergies (comma-separated)"
          value={allergies}
          onChangeText={setAllergies}
          placeholder="e.g. Penicillin, Peanuts"
        />

        <View style={styles.spacing} />

        <TextInput
          label="Chronic Conditions (comma-separated)"
          value={chronicConditions}
          onChangeText={setChronicConditions}
          placeholder="e.g. Type 2 Diabetes, Hypertension"
        />

        <View style={styles.spacing} />

        <TextInput
          label="Medication Notes"
          value={medicationNotes}
          onChangeText={setMedicationNotes}
          placeholder="e.g. Morning insulin, blood pressure medicine"
          multiline
        />
      </Card>

      <View style={{ height: Spacing.lg }} />

      {/* ── 4. Primary Doctor / Physician ────────────────────── */}
      <Text style={styles.sectionLabel}>PRIMARY PHYSICIAN / DOCTOR</Text>
      <Card style={styles.card}>
        <TextInput
          label="Doctor's Full Name"
          value={doctorName}
          onChangeText={setDoctorName}
          placeholder="e.g. Dr. James Hargreaves"
        />

        <View style={styles.spacing} />

        <TextInput
          label="Medical Specialty"
          value={doctorSpecialty}
          onChangeText={setDoctorSpecialty}
          placeholder="e.g. Geriatric Medicine, Cardiology"
        />

        <View style={styles.spacing} />

        <TextInput
          label="Clinic / Hospital"
          value={doctorHospital}
          onChangeText={setDoctorHospital}
          placeholder="e.g. St. Thomas' Hospital, London"
        />

        <View style={styles.spacing} />

        <TextInput
          label="Emergency Phone"
          value={doctorPhone}
          onChangeText={setDoctorPhone}
          keyboardType="phone-pad"
          placeholder="e.g. +44 20 7946 0000"
        />

        <View style={styles.spacing} />

        <TextInput
          label="Doctor Email"
          value={doctorEmail}
          onChangeText={setDoctorEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="e.g. doctor@elderguard.com"
        />
      </Card>

      <View style={{ height: Spacing.lg }} />

      {/* ── 5. IoT Wearable Device ──────────────────────────── */}
      <Text style={styles.sectionLabel}>WEARABLE IOT HARDWARE</Text>
      <Card style={styles.card}>
        <TextInput
          label="Paired Device ID"
          value={deviceId}
          onChangeText={setDeviceId}
          placeholder="e.g. EG-IOT-4892"
          helperText="Unique identifier printed on the ElderGuard smart wearable band"
        />
      </Card>

      {/* ── Bottom Actions ──────────────────────────────────── */}
      <View style={styles.bottomActions}>
        <Button
          title="Create Elderly Profile"
          onPress={handleCreate}
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          leftIcon={<UserPlus size={18} color={Colors.white} />}
        />

        <View style={{ height: Spacing.sm }} />

        <Button
          title="Cancel"
          onPress={handleBack}
          variant="secondary"
          size="lg"
          fullWidth
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceSecondary,
  },
  navTitle: {
    ...Typography.bodySemiBold,
    fontSize: 17,
    color: Colors.textPrimary,
  },
  introHeader: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.criticalBg,
    borderColor: Colors.critical,
    borderWidth: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.base,
  },
  errorBannerText: {
    ...Typography.bodySmall,
    color: Colors.critical,
    flex: 1,
  },
  sectionLabel: {
    ...Typography.overline,
    color: Colors.textTertiary,
    marginBottom: Spacing.xs,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: Colors.white,
  },
  spacing: {
    height: Spacing.md,
  },
  row: {
    flexDirection: 'row',
  },
  fieldLabel: {
    ...Typography.captionMedium,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  genderRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  genderChip: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  genderChipActive: {
    backgroundColor: Colors.primaryFaded,
    borderColor: Colors.primary,
  },
  genderChipText: {
    ...Typography.captionMedium,
    color: Colors.textSecondary,
  },
  genderChipTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  bottomActions: {
    paddingVertical: Spacing.xl,
    paddingBottom: Spacing['3xl'],
  },
});
