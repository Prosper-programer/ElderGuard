import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Phone,
  Heart,
  Battery,
  Wifi,
  AlertTriangle,
  Stethoscope,
  Info,
  MapPin,
  LogOut,
} from 'lucide-react-native';
import { ScreenContainer, Button, Card, StatusBadge, Avatar, BottomTabBar } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useElderly } from '@/context/ElderlyContext';
import { useAuth } from '@/context/AuthContext';

export default function CaregiverElderlyProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { activeProfile } = useElderly();

  const handleSignOut = () => {
    const doLogout = async () => {
      try {
        await logout();
      } catch (e) {
        console.error('Logout error:', e);
      } finally {
        router.replace('/(auth)/welcome' as any);
      }
    };

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm('Are you sure you want to sign out?')) {
        doLogout();
      }
    } else {
      Alert.alert('Sign out', 'Are you sure you want to sign out?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: doLogout,
        },
      ]);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(caregiver)' as any);
    }
  };

  if (!activeProfile) {
    return (
      <ScreenContainer
        scrollable
        padded
        backgroundColor="#F8FAFC"
        bottomBar={<BottomTabBar activeTab="profile" role="caregiver" />}
      >
        <Card style={{ padding: 28, alignItems: 'center', marginTop: 40 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#0F172A' }}>No Senior Assigned</Text>
          <Text style={{ fontSize: 13, color: '#64748B', marginTop: 6, textAlign: 'center' }}>
            You do not currently have an assigned senior. Once the family manager links your account, their care profile will appear here.
          </Text>
        </Card>
      </ScreenContainer>
    );
  }

  const primaryContact =
    activeProfile.emergencyContacts.find((c) => c.isPrimary) ||
    activeProfile.emergencyContacts[0];

  const handleCall = (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const url = Platform.OS === 'ios' ? `telprompt:${cleanPhone}` : `tel:${cleanPhone}`;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <ScreenContainer
      scrollable
      padded
      backgroundColor="#F8FAFC"
      bottomBar={<BottomTabBar activeTab="profile" role="caregiver" />}
    >
      {/* ── Top Navigation Bar ──────────────────────────────── */}
      <View style={styles.topNav}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={22} color={Colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.navTitle}>Assigned Care Profile</Text>

        <View style={styles.readOnlyPill}>
          <Text style={styles.readOnlyText}>Read-Only</Text>
        </View>
      </View>

      {/* ── 1. Hero Card ────────────────────────────────────── */}
      <Card elevated style={styles.heroCard}>
        <View style={styles.heroRow}>
          <Avatar
            name={activeProfile.fullName}
            imageUrl={activeProfile.imageUrl}
            size={76}
            statusIndicator="safe"
          />
          <View style={styles.heroMeta}>
            <Text style={styles.heroName}>{activeProfile.fullName}</Text>
            <Text style={styles.heroSub}>
              {activeProfile.age} yrs · {activeProfile.gender} · &quot;{activeProfile.preferredName}&quot;
            </Text>
            <View style={styles.statusWrap}>
              <StatusBadge status="safe" label="Device Connected · Normal" size="sm" />
            </View>
          </View>
        </View>

        {/* Live Device Strip */}
        <View style={styles.deviceStrip}>
          <View style={styles.deviceMetric}>
            <Battery size={16} color={Colors.safe} />
            <Text style={styles.deviceMetricText}>{activeProfile.deviceStatus.batteryLevel}% Battery</Text>
          </View>
          <View style={styles.deviceDivider} />
          <View style={styles.deviceMetric}>
            <Wifi size={16} color={Colors.primary} />
            <Text style={styles.deviceMetricText}>Synced {activeProfile.deviceStatus.lastSync}</Text>
          </View>
        </View>
      </Card>

      <View style={{ height: Spacing.md }} />

      {/* ── 2. Primary Emergency Contact ────────────────────── */}
      <Card style={styles.sectionCard}>
        <View style={styles.cardHeader}>
          <Phone size={18} color={Colors.critical} />
          <Text style={styles.cardTitle}>FAMILY EMERGENCY CONTACT</Text>
        </View>

        {primaryContact && (
          <View style={styles.contactItem}>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{primaryContact.name}</Text>
              <Text style={styles.contactRelation}>{primaryContact.relationship}</Text>
              <Text style={styles.contactPhone}>{primaryContact.phone}</Text>
            </View>
            <TouchableOpacity
              onPress={() => handleCall(primaryContact.phone)}
              style={styles.callActionButton}
              activeOpacity={0.8}
            >
              <Phone size={16} color={Colors.white} />
              <Text style={styles.callActionText}>Call</Text>
            </TouchableOpacity>
          </View>
        )}
      </Card>

      <View style={{ height: Spacing.md }} />

      {/* ── 3. Critical Health & Medical Alerts ──────────────── */}
      <Card style={styles.sectionCard}>
        <View style={styles.cardHeader}>
          <Heart size={18} color={Colors.critical} />
          <Text style={styles.cardTitle}>CRITICAL HEALTH & ALLERGIES</Text>
        </View>

        {/* Blood Type & Allergies */}
        <View style={styles.medicalRow}>
          <View style={styles.bloodTypeBox}>
            <Text style={styles.bloodTypeLabel}>BLOOD</Text>
            <Text style={styles.bloodTypeValue}>{activeProfile.medicalInfo.bloodType}</Text>
          </View>

          <View style={styles.allergiesBox}>
            <View style={styles.alertHeader}>
              <AlertTriangle size={14} color={Colors.warning} />
              <Text style={styles.allergiesLabel}>KNOWN ALLERGIES</Text>
            </View>
            <View style={styles.chipsWrap}>
              {activeProfile.medicalInfo.allergies.map((allergy, i) => (
                <View key={i} style={styles.allergyChip}>
                  <Text style={styles.allergyText}>{allergy}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Chronic Conditions */}
        <View style={styles.conditionSection}>
          <Text style={styles.metaSubhead}>CHRONIC CONDITIONS</Text>
          <View style={styles.chipsWrap}>
            {activeProfile.medicalInfo.chronicConditions.map((condition, i) => (
              <View key={i} style={styles.conditionChip}>
                <Text style={styles.conditionText}>{condition}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Daily Medication Care Notes */}
        {activeProfile.medicalInfo.medicationNotes && (
          <View style={styles.medNoteBox}>
            <Text style={styles.medNoteLabel}>DAILY MEDICATION SCHEDULE</Text>
            <Text style={styles.medNoteText}>{activeProfile.medicalInfo.medicationNotes}</Text>
          </View>
        )}

        {/* Attending Physician */}
        <View style={styles.physicianBox}>
          <Stethoscope size={16} color={Colors.textSecondary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.physicianName}>{activeProfile.medicalInfo.physicianName}</Text>
            <Text style={styles.hospitalName}>{activeProfile.medicalInfo.hospitalPreference}</Text>
          </View>
        </View>
      </Card>

      <View style={{ height: Spacing.md }} />

      {/* ── 4. Residence & Address ───────────────────────────── */}
      <Card style={styles.sectionCard}>
        <View style={styles.cardHeader}>
          <MapPin size={18} color={Colors.primary} />
          <Text style={styles.cardTitle}>RESIDENCE ADDRESS</Text>
        </View>
        <Text style={styles.addressText}>{activeProfile.address}</Text>
      </Card>

      <View style={{ height: Spacing.md }} />

      {/* ── 5. Permission & Access Notice ───────────────────── */}
      <View style={styles.noticeCard}>
        <Info size={18} color={Colors.primary} />
        <Text style={styles.noticeText}>
          You are viewing this profile as an assigned Caregiver. Core profile details, IoT hardware pairing, and emergency policies are managed by the Tutor administrator.
        </Text>
      </View>

      <View style={{ height: Spacing.lg }} />

      {/* ── 6. Bottom Action ─────────────────────────────────── */}
      <Button
        title="Return to Care Dashboard"
        onPress={handleBack}
        variant="secondary"
        size="lg"
        fullWidth
      />

      {/* ── 7. Sign Out Action ─────────────────────────────────── */}
      <View style={{ height: Spacing.sm }} />
      <TouchableOpacity
        style={styles.signOutButton}
        onPress={handleSignOut}
        activeOpacity={0.8}
      >
        <LogOut size={18} color="#EF4444" />
        <Text style={styles.signOutButtonText}>Sign out of Account</Text>
      </TouchableOpacity>

      <View style={{ height: Spacing['2xl'] }} />
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
  readOnlyPill: {
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  readOnlyText: {
    ...Typography.caption,
    color: Colors.textTertiary,
    fontWeight: '600',
  },
  heroCard: {
    backgroundColor: Colors.white,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
  },
  heroMeta: {
    flex: 1,
  },
  heroName: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  heroSub: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statusWrap: {
    marginTop: Spacing.xs,
    alignSelf: 'flex-start',
  },
  deviceStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.base,
  },
  deviceMetric: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
  },
  deviceMetricText: {
    ...Typography.captionMedium,
    color: Colors.textSecondary,
  },
  deviceDivider: {
    width: 1,
    height: 18,
    backgroundColor: Colors.border,
  },
  sectionCard: {
    backgroundColor: Colors.white,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.base,
  },
  cardTitle: {
    ...Typography.overline,
    color: Colors.textTertiary,
    letterSpacing: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    ...Typography.bodySemiBold,
    color: Colors.textPrimary,
  },
  contactRelation: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  contactPhone: {
    ...Typography.captionMedium,
    color: Colors.primary,
    marginTop: 2,
  },
  callActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.safe,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
  },
  callActionText: {
    ...Typography.captionMedium,
    color: Colors.white,
    fontWeight: '600',
  },
  medicalRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  bloodTypeBox: {
    backgroundColor: Colors.surfaceSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  bloodTypeLabel: {
    ...Typography.overline,
    fontSize: 9,
    color: Colors.textTertiary,
  },
  bloodTypeValue: {
    ...Typography.metricSmall,
    color: Colors.critical,
    marginTop: 2,
  },
  allergiesBox: {
    flex: 1,
    backgroundColor: Colors.surfaceSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  allergiesLabel: {
    ...Typography.overline,
    fontSize: 9,
    color: Colors.warning,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  allergyChip: {
    backgroundColor: Colors.warningLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
  },
  allergyText: {
    ...Typography.caption,
    fontSize: 11,
    color: '#B45309',
    fontWeight: '600',
  },
  conditionSection: {
    marginBottom: Spacing.md,
  },
  metaSubhead: {
    ...Typography.overline,
    fontSize: 10,
    color: Colors.textTertiary,
    marginBottom: 6,
  },
  conditionChip: {
    backgroundColor: Colors.primaryFaded,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
  },
  conditionText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.primaryDark,
    fontWeight: '500',
  },
  medNoteBox: {
    backgroundColor: '#FEF9C3',
    borderColor: '#FDE047',
    borderWidth: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  medNoteLabel: {
    ...Typography.overline,
    fontSize: 9,
    color: '#854D0E',
    marginBottom: 2,
  },
  medNoteText: {
    ...Typography.bodySmall,
    color: '#713F12',
    lineHeight: 18,
  },
  physicianBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surfaceSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  physicianName: {
    ...Typography.bodySmallSemiBold,
    color: Colors.textPrimary,
  },
  hospitalName: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  addressText: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.primaryFaded,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(60, 111, 219, 0.2)',
  },
  noticeText: {
    ...Typography.caption,
    color: Colors.primaryDark,
    flex: 1,
    lineHeight: 17,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: '#FEE2E2',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  signOutButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
});
