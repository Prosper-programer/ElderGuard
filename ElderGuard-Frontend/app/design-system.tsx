import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Shield, Heart, Bell, MapPin, Battery, Wifi, Search } from 'lucide-react-native';
import {
  ScreenContainer,
  Button,
  TextInput,
  Card,
  StatusBadge,
  Avatar,
  IconButton,
  Divider,
  LoadingSpinner,
  EmptyState,
} from '@/components/ui';
import { Colors, Typography, Spacing } from '@/constants/theme';

/**
 * Phase 0 — Design System Reference Screen
 *
 * Preserved showcase to visually verify and inspect all design tokens,
 * typography scales, and 10 reusable UI components.
 */
export default function DesignSystemScreen() {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(parent)' as any);
    }
  };

  return (
    <ScreenContainer>
      {/* Top Bar with Back Button */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={Colors.primary} />
          <Text style={[Typography.bodyMedium, { color: Colors.primary }]}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={[Typography.h1, { color: Colors.textPrimary }]}>
          ElderGuard
        </Text>
        <Text style={[Typography.bodySmall, { color: Colors.textTertiary }]}>
          Design System & Component Library — Phase 0
        </Text>
      </View>

      {/* ── Colors ─────────────────────────────────────── */}
      <Text style={styles.sectionTitle}>Brand & Semantic Colors</Text>
      <View style={styles.colorRow}>
        <View style={[styles.colorSwatch, { backgroundColor: Colors.primary }]} />
        <View style={[styles.colorSwatch, { backgroundColor: Colors.primaryLight }]} />
        <View style={[styles.colorSwatch, { backgroundColor: Colors.accent }]} />
        <View style={[styles.colorSwatch, { backgroundColor: Colors.safe }]} />
        <View style={[styles.colorSwatch, { backgroundColor: Colors.warning }]} />
        <View style={[styles.colorSwatch, { backgroundColor: Colors.critical }]} />
        <View style={[styles.colorSwatch, { backgroundColor: Colors.offline }]} />
      </View>

      <Divider />

      {/* ── Typography ─────────────────────────────────── */}
      <Text style={styles.sectionTitle}>Typography</Text>
      <Text style={[Typography.h1, { color: Colors.textPrimary }]}>Heading 1 — 28px Bold</Text>
      <Text style={[Typography.h2, { color: Colors.textPrimary }]}>Heading 2 — 22px Bold</Text>
      <Text style={[Typography.h3, { color: Colors.textPrimary }]}>Heading 3 — 18px SemiBold</Text>
      <Text style={[Typography.body, { color: Colors.textSecondary, marginTop: 4 }]}>
        Body text — Inter Regular 15px
      </Text>
      <Text style={[Typography.bodySmall, { color: Colors.textTertiary }]}>
        Body small — Inter Regular 13px
      </Text>
      <Text style={[Typography.caption, { color: Colors.textTertiary }]}>
        Caption — Inter Regular 12px
      </Text>
      <Text style={[Typography.overline, { color: Colors.textTertiary, marginTop: 4 }]}>
        OVERLINE LABEL — 11PX SEMIBOLD
      </Text>

      <Divider />

      {/* ── Status Badges ──────────────────────────────── */}
      <Text style={styles.sectionTitle}>Status Badges</Text>
      <View style={styles.badgeRow}>
        <StatusBadge status="safe" />
        <StatusBadge status="warning" />
        <StatusBadge status="critical" />
        <StatusBadge status="offline" />
      </View>
      <View style={[styles.badgeRow, { marginTop: Spacing.sm }]}>
        <StatusBadge status="safe" size="sm" label="Connected" />
        <StatusBadge status="critical" size="sm" label="SOS Alert" />
      </View>

      <Divider />

      {/* ── Avatars ────────────────────────────────────── */}
      <Text style={styles.sectionTitle}>Avatars</Text>
      <View style={styles.avatarRow}>
        <Avatar name="Margaret Johnson" statusIndicator="safe" />
        <Avatar name="Robert Williams" size={52} statusIndicator="warning" />
        <Avatar name="Eleanor Davis" size={36} statusIndicator="critical" />
        <Avatar name="James" size={40} statusIndicator="offline" />
      </View>

      <Divider />

      {/* ── Buttons ────────────────────────────────────── */}
      <Text style={styles.sectionTitle}>Buttons</Text>
      <View style={styles.buttonSection}>
        <Button title="Primary Button" fullWidth />
        <Button title="Secondary Button" variant="secondary" fullWidth />
        <Button title="Outline Button" variant="outline" fullWidth />
        <View style={styles.buttonRow}>
          <Button title="Ghost" variant="ghost" />
          <Button title="Danger" variant="danger" />
        </View>
        <View style={styles.buttonRow}>
          <Button title="Small" size="sm" />
          <Button title="Loading…" loading />
          <Button title="Disabled" disabled />
        </View>
        <Button
          title="With Icon"
          leftIcon={<Shield size={18} color={Colors.white} />}
          fullWidth
        />
      </View>

      <Divider />

      {/* ── Text Inputs ────────────────────────────────── */}
      <Text style={styles.sectionTitle}>Text Inputs</Text>
      <TextInput
        label="Email address"
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon={<Search size={18} color={Colors.textTertiary} />}
      />
      <View style={{ height: Spacing.md }} />
      <TextInput
        label="Password"
        placeholder="Enter your password"
        secureTextEntry
      />
      <View style={{ height: Spacing.md }} />
      <TextInput
        label="With Error"
        placeholder="Something wrong"
        error="This field is required"
      />
      <View style={{ height: Spacing.md }} />
      <TextInput
        label="With Helper"
        placeholder="Optional field"
        helperText="This information helps us personalise your experience"
      />

      <Divider />

      {/* ── Cards ──────────────────────────────────────── */}
      <Text style={styles.sectionTitle}>Cards</Text>
      <Card>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Heart size={20} color={Colors.critical} />
            <Text style={[Typography.bodyMedium, { color: Colors.textPrimary }]}>
              Heart Rate
            </Text>
            <StatusBadge status="safe" size="sm" label="Normal" />
          </View>
          <View style={styles.metricRow}>
            <Text style={[Typography.metric, { color: Colors.textPrimary }]}>72</Text>
            <Text style={[Typography.metricUnit, { color: Colors.textTertiary }]}>bpm</Text>
          </View>
          <Text style={[Typography.caption, { color: Colors.textTertiary }]}>
            Last updated 2 min ago
          </Text>
        </View>
      </Card>

      <View style={{ height: Spacing.md }} />

      <Card elevated>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Battery size={20} color={Colors.safe} />
            <Text style={[Typography.bodyMedium, { color: Colors.textPrimary }]}>
              Device Status
            </Text>
            <StatusBadge status="safe" size="sm" label="Connected" />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginTop: Spacing.sm }}>
            <Wifi size={16} color={Colors.safe} />
            <Text style={[Typography.bodySmall, { color: Colors.textSecondary }]}>
              Bluetooth connected · Battery 87%
            </Text>
          </View>
        </View>
      </Card>

      <Divider />

      {/* ── Icon Buttons ───────────────────────────────── */}
      <Text style={styles.sectionTitle}>Icon Buttons</Text>
      <View style={styles.iconButtonRow}>
        <IconButton
          icon={<Bell size={20} color={Colors.textSecondary} />}
          variant="default"
        />
        <IconButton
          icon={<MapPin size={20} color={Colors.primary} />}
          variant="filled"
        />
        <IconButton
          icon={<Heart size={20} color={Colors.critical} />}
          variant="ghost"
        />
        <IconButton
          icon={<Shield size={20} color={Colors.textTertiary} />}
          disabled
        />
      </View>

      <Divider />

      {/* ── Loading ────────────────────────────────────── */}
      <Text style={styles.sectionTitle}>Loading State</Text>
      <LoadingSpinner label="Syncing device data…" />

      <Divider />

      {/* ── Empty State ────────────────────────────────── */}
      <Text style={styles.sectionTitle}>Empty State</Text>
      <EmptyState
        icon={<Bell size={32} color={Colors.textTertiary} />}
        title="No alerts"
        description="When your loved one's device detects an event, alerts will appear here."
        actionLabel="Refresh"
        onAction={() => {}}
      />

      <View style={{ height: Spacing['3xl'] }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topBar: {
    marginBottom: Spacing.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.overline,
    color: Colors.textTertiary,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  colorRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
  },
  buttonSection: {
    gap: Spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  cardContent: {
    gap: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  iconButtonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
});
