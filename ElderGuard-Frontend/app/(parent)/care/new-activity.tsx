import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Activity, AlertCircle } from 'lucide-react-native';
import { ScreenContainer, Button, TextInput, Card } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useCare } from '@/context/CareContext';
import type { ActivityCategory } from '@/types/care';

const CATEGORIES: { label: string; value: ActivityCategory }[] = [
  { label: '💧 Hydration', value: 'hydration' },
  { label: '🚶 Mobility', value: 'mobility' },
  { label: '❤️ Vital Check', value: 'vital_check' },
  { label: '🍽️ Nutrition', value: 'nutrition' },
  { label: '🧼 Hygiene', value: 'hygiene' },
];

export default function NewActivityScreen() {
  const router = useRouter();
  const { addActivity } = useCare();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('hydration');
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    setError(null);
    if (!title.trim()) {
      setError('Please enter an activity title.');
      return;
    }
    if (!target || isNaN(parseFloat(target)) || parseFloat(target) <= 0) {
      setError('Please enter a valid target value (e.g. 8, 30, 2000).');
      return;
    }
    if (!unit.trim()) {
      setError('Please enter a unit (e.g. glasses, minutes, ml).');
      return;
    }

    addActivity({
      title: title.trim(),
      category,
      target: parseFloat(target),
      unit: unit.trim(),
      notes: notes.trim() || undefined,
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
      {/* ── Top Navigation Bar ── */}
      <View style={styles.topNav}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Add Daily Activity</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>New Care Activity</Text>
        <Text style={styles.subtitle}>
          Add a wellness or care task to track daily progress.
        </Text>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <AlertCircle size={18} color={Colors.critical} />
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      )}

      <Card style={styles.formCard}>
        {/* Title */}
        <TextInput
          label="Activity Title *"
          value={title}
          onChangeText={(t) => { setTitle(t); if (error) setError(null); }}
          placeholder="e.g. Daily Water Hydration"
        />

        <View style={styles.spacing} />

        {/* Category Selector */}
        <Text style={styles.fieldLabel}>Category *</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              onPress={() => setCategory(cat.value)}
              style={[
                styles.categoryBtn,
                category === cat.value && styles.categoryBtnActive,
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === cat.value && styles.categoryTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.spacing} />

        {/* Target + Unit in a row */}
        <View style={styles.rowFields}>
          <View style={{ flex: 1 }}>
            <TextInput
              label="Target Goal *"
              value={target}
              onChangeText={(t) => { setTarget(t); if (error) setError(null); }}
              placeholder="e.g. 8"
              keyboardType="decimal-pad"
            />
          </View>
          <View style={{ width: 12 }} />
          <View style={{ flex: 1 }}>
            <TextInput
              label="Unit *"
              value={unit}
              onChangeText={(t) => { setUnit(t); if (error) setError(null); }}
              placeholder="e.g. glasses"
            />
          </View>
        </View>

        <View style={styles.spacing} />

        {/* Notes */}
        <TextInput
          label="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          placeholder="e.g. Encourage patient to drink throughout the day"
          multiline
        />
      </Card>

      <View style={styles.bottomActions}>
        <Button
          title="Save Activity"
          onPress={handleSave}
          variant="primary"
          size="lg"
          fullWidth
          leftIcon={<Activity size={18} color={Colors.white} />}
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
  fieldLabel: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceSecondary,
  },
  categoryBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: '#EEF5FF',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  categoryTextActive: {
    color: Colors.primary,
  },
  rowFields: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bottomActions: {
    paddingVertical: Spacing.xl,
    paddingBottom: Spacing['3xl'],
  },
});
