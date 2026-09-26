import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Pill, AlertCircle } from 'lucide-react-native';
import { ScreenContainer, Button, TextInput, Card } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useCare } from '@/context/CareContext';

export default function NewMedicationScreen() {
  const router = useRouter();
  const { addMedication } = useCare();

  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once daily');
  const [time, setTime] = useState('08:00 AM');
  const [instructions, setInstructions] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    setError(null);
    if (!name.trim()) {
      setError('Please enter the medication name.');
      return;
    }
    if (!dosage.trim()) {
      setError('Please enter the dosage amount (e.g. 10mg).');
      return;
    }

    addMedication({
      name: name.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      instructions: instructions.trim() || 'Take with water as directed.',
      timesOfDay: [time.trim() || '08:00 AM'],
    });

    handleBack();
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(parent)/care' as any);
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

        <Text style={styles.navTitle}>Add Medication</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>New Prescription</Text>
        <Text style={styles.subtitle}>
          Add a scheduled medication for Margaret Johnson&apos;s daily regimen.
        </Text>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <AlertCircle size={18} color={Colors.critical} />
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      )}

      <Card style={styles.formCard}>
        <TextInput
          label="Medication Name *"
          value={name}
          onChangeText={(t) => {
            setName(t);
            if (error) setError(null);
          }}
          placeholder="e.g. Amlodipine"
        />

        <View style={styles.spacing} />

        <TextInput
          label="Dosage Form & Strength *"
          value={dosage}
          onChangeText={(t) => {
            setDosage(t);
            if (error) setError(null);
          }}
          placeholder="e.g. 5mg Tablet"
        />

        <View style={styles.spacing} />

        <TextInput
          label="Frequency"
          value={frequency}
          onChangeText={setFrequency}
          placeholder="e.g. Once daily, Twice daily"
        />

        <View style={styles.spacing} />

        <TextInput
          label="Scheduled Time"
          value={time}
          onChangeText={setTime}
          placeholder="e.g. 08:00 AM"
        />

        <View style={styles.spacing} />

        <TextInput
          label="Special Instructions"
          value={instructions}
          onChangeText={setInstructions}
          placeholder="e.g. Take with dinner. Avoid grapefruit."
          multiline
        />
      </Card>

      <View style={styles.bottomActions}>
        <Button
          title="Save to Medication Schedule"
          onPress={handleSave}
          variant="primary"
          size="lg"
          fullWidth
          leftIcon={<Pill size={18} color={Colors.white} />}
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
  header: {
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
  formCard: {
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
