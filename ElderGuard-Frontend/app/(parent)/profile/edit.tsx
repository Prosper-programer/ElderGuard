import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, Save } from 'lucide-react-native';
import { ScreenContainer, Button, TextInput, Card, TopBar } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useElderly } from '@/context/ElderlyContext';

export default function EditElderlyProfileScreen() {
  const router = useRouter();
  const { activeProfile, updateProfile } = useElderly();

  const primaryContact =
    activeProfile?.emergencyContacts.find((c) => c.isPrimary) ||
    activeProfile?.emergencyContacts[0] || {
      id: 'ec-1',
      name: '',
      relationship: '',
      phone: '',
      isPrimary: true,
    };

  const [fullName, setFullName] = useState(activeProfile?.fullName || '');
  const [preferredName, setPreferredName] = useState(activeProfile?.preferredName || '');
  const [age, setAge] = useState(activeProfile?.age ? activeProfile.age.toString() : '');
  const [address, setAddress] = useState(activeProfile?.address || '');
  const [phone, setPhone] = useState(activeProfile?.phone || '');

  const [bloodType, setBloodType] = useState(activeProfile?.medicalInfo?.bloodType || 'O+');
  const [allergies, setAllergies] = useState(activeProfile?.medicalInfo?.allergies?.join(', ') || '');
  const [chronicConditions, setChronicConditions] = useState(
    activeProfile?.medicalInfo?.chronicConditions?.join(', ') || ''
  );
  const [medicationNotes, setMedicationNotes] = useState(
    activeProfile?.medicalInfo?.medicationNotes || ''
  );
  const [physicianName, setPhysicianName] = useState(
    activeProfile?.doctorName || activeProfile?.medicalInfo?.physicianName || 'Dr. Jean-Paul Mbarga'
  );
  const [doctorSpecialty, setDoctorSpecialty] = useState(
    activeProfile?.doctorSpecialty || 'Cardiologie & Médecine Gériatrique'
  );
  const [doctorHospital, setDoctorHospital] = useState(
    activeProfile?.doctorHospital || activeProfile?.medicalInfo?.hospitalPreference || 'Hôpital Central de Yaoundé'
  );
  const [doctorPhone, setDoctorPhone] = useState(
    activeProfile?.doctorPhone || activeProfile?.medicalInfo?.physicianPhone || '+237 655 89 12 34'
  );
  const [doctorEmail, setDoctorEmail] = useState(
    activeProfile?.doctorEmail || 'doctor.mbarga@elderguard.cm'
  );

  const [emergencyName, setEmergencyName] = useState(primaryContact.name);
  const [emergencyRelation, setEmergencyRelation] = useState(primaryContact.relationship);
  const [emergencyPhone, setEmergencyPhone] = useState(primaryContact.phone);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    if (!activeProfile) return;
    setError(null);
    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }

    setLoading(true);

    const updatedAllergies = allergies
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedConditions = chronicConditions
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedContacts = activeProfile.emergencyContacts.map((c) => {
      if (c.isPrimary) {
        return {
          ...c,
          name: emergencyName.trim(),
          relationship: emergencyRelation.trim(),
          phone: emergencyPhone.trim(),
        };
      }
      return c;
    });

    updateProfile(activeProfile.id, {
      fullName: fullName.trim(),
      preferredName: preferredName.trim(),
      age: parseInt(age, 10) || activeProfile.age,
      address: address.trim(),
      phone: phone.trim(),
      doctorName: physicianName.trim(),
      doctorSpecialty: doctorSpecialty.trim(),
      doctorHospital: doctorHospital.trim(),
      doctorPhone: doctorPhone.trim(),
      doctorEmail: doctorEmail.trim(),
      medicalInfo: {
        ...activeProfile.medicalInfo,
        bloodType: bloodType.trim(),
        allergies: updatedAllergies,
        chronicConditions: updatedConditions,
        medicationNotes: medicationNotes.trim(),
        physicianName: physicianName.trim(),
        physicianPhone: doctorPhone.trim(),
        hospitalPreference: doctorHospital.trim(),
      },
      emergencyContacts: updatedContacts,
    });

    setLoading(false);
    setSavedSuccess(true);
    setTimeout(() => {
      router.replace('/(parent)/profile' as any);
    }, 400);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(parent)/profile' as any);
    }
  };

  if (!activeProfile) {
    return (
      <ScreenContainer padded backgroundColor="#F0F4FA">
        <TopBar title="Edit Profile" onBack={handleBack} />
        <Card style={{ padding: 24, alignItems: 'center', marginTop: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#0F172A' }}>No Profile Found</Text>
          <Text style={{ fontSize: 13, color: '#64748B', marginTop: 4, textAlign: 'center' }}>
            Please add an elderly profile first before editing.
          </Text>
          <Button
            title="Create Senior Profile"
            onPress={() => router.replace('/(parent)/profile/create' as any)}
            style={{ marginTop: 16 }}
          />
        </Card>
      </ScreenContainer>
    );
  }

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

        <Text style={styles.navTitle}>Edit Profile</Text>

        <TouchableOpacity
          onPress={handleSave}
          style={styles.saveHeaderButton}
          activeOpacity={0.7}
        >
          {savedSuccess ? (
            <Check size={18} color={Colors.safe} />
          ) : (
            <Save size={18} color={Colors.primary} />
          )}
        </TouchableOpacity>
      </View>

      {/* ── 1. Personal Information ─────────────────────────── */}
      <Text style={styles.sectionLabel}>PERSONAL DETAILS</Text>
      <Card style={styles.card}>
        <TextInput
          label="Full Legal Name"
          value={fullName}
          onChangeText={setFullName}
          placeholder="e.g. Margaret Johnson"
        />

        <View style={styles.spacing} />

        <TextInput
          label="Preferred Name"
          value={preferredName}
          onChangeText={setPreferredName}
          placeholder="e.g. Margaret"
        />

        <View style={styles.spacing} />

        <TextInput
          label="Age (Years)"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          placeholder="e.g. 78"
        />

        <View style={styles.spacing} />

        <TextInput
          label="Home Address"
          value={address}
          onChangeText={setAddress}
          placeholder="e.g. 142 Elm Street, Maplewood, NJ"
        />

        <View style={styles.spacing} />

        <TextInput
          label="Contact Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="e.g. +1 (555) 782-9012"
        />
      </Card>

      <View style={{ height: Spacing.lg }} />

      {/* ── 2. Primary Emergency Contact ────────────────────── */}
      <Text style={styles.sectionLabel}>PRIMARY EMERGENCY CONTACT</Text>
      <Card style={styles.card}>
        <TextInput
          label="Contact Name"
          value={emergencyName}
          onChangeText={setEmergencyName}
          placeholder="e.g. Eleanor Vance"
        />

        <View style={styles.spacing} />

        <TextInput
          label="Relationship"
          value={emergencyRelation}
          onChangeText={setEmergencyRelation}
          placeholder="e.g. Daughter (Primary Manager)"
        />

        <View style={styles.spacing} />

        <TextInput
          label="Emergency Phone"
          value={emergencyPhone}
          onChangeText={setEmergencyPhone}
          keyboardType="phone-pad"
          placeholder="e.g. +1 (555) 234-5678"
        />
      </Card>

      <View style={{ height: Spacing.lg }} />

      {/* ── 3. Health & Medical Notes ───────────────────────── */}
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
          label="Known Allergies (comma-separated)"
          value={allergies}
          onChangeText={setAllergies}
          placeholder="e.g. Penicillin, Sulfa drugs"
          helperText="Separate multiple allergies with commas"
        />

        <View style={styles.spacing} />

        <TextInput
          label="Chronic Conditions (comma-separated)"
          value={chronicConditions}
          onChangeText={setChronicConditions}
          placeholder="e.g. Hypertension, Osteoarthritis"
          helperText="Separate multiple conditions with commas"
        />

        <View style={styles.spacing} />

        <TextInput
          label="Daily Medication Notes"
          value={medicationNotes}
          onChangeText={setMedicationNotes}
          placeholder="e.g. Lisinopril 10mg every morning at 08:00 AM"
          multiline
        />

        <View style={styles.spacing} />

        <TextInput
          label="Primary Physician"
          value={physicianName}
          onChangeText={setPhysicianName}
          placeholder="e.g. Dr. Jean-Paul Mbarga"
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
          label="Doctor Phone"
          value={doctorPhone}
          onChangeText={setDoctorPhone}
          keyboardType="phone-pad"
          placeholder="e.g. +237 655 89 12 34"
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

      {/* ── Bottom Save Actions ─────────────────────────────── */}
      <View style={styles.bottomActions}>
        <Button
          title={savedSuccess ? 'Changes Saved!' : 'Save Changes'}
          onPress={handleSave}
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          leftIcon={<Save size={18} color={Colors.white} />}
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
    marginBottom: Spacing.md,
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
  saveHeaderButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryFaded,
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
  bottomActions: {
    paddingVertical: Spacing.xl,
    paddingBottom: Spacing['3xl'],
  },
});
