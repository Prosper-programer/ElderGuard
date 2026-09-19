import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  ShieldAlert,
  Phone,
  Clock,
  MapPin,
  Heart,
  Activity,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Navigation,
} from 'lucide-react-native';
import { ScreenContainer, Button, Card, StatusBadge, TextInput, Divider } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAlerts } from '@/context/AlertContext';
import { useAuth } from '@/context/AuthContext';

export default function CaregiverAlertDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { getAlertById, acknowledgeAlert, resolveAlert } = useAlerts();

  const alert = getAlertById(id || '');

  const [notes, setNotes] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(caregiver)/alerts' as any);
    }
  };

  if (!alert) {
    return (
      <ScreenContainer padded backgroundColor="#F8FAFC">
        <View style={styles.topNav}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <Card style={styles.notFoundCard}>
          <AlertTriangle size={32} color={Colors.warning} />
          <Text style={styles.notFoundTitle}>Incident Not Found</Text>
          <Button title="Back to Alerts" onPress={handleBack} variant="secondary" />
        </Card>
      </ScreenContainer>
    );
  }

  const handleAcknowledge = () => {
    acknowledgeAlert(alert.id, `${user?.name || 'David Miller'} (Caregiver)`);
  };

  const handleResolve = () => {
    if (!notes.trim()) {
      setShowNoteInput(true);
      return;
    }
    setIsSubmitting(true);
    resolveAlert(alert.id, `${user?.name || 'David Miller'} (Caregiver)`, notes.trim());
    setIsSubmitting(false);
    setShowNoteInput(false);
  };

  const handleCall = (phone: string) => {
    const clean = phone.replace(/[^0-9+]/g, '');
    const url = Platform.OS === 'ios' ? `telprompt:${clean}` : `tel:${clean}`;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <ScreenContainer scrollable keyboardAvoiding padded backgroundColor="#F8FAFC">
      {/* ── Top Navigation Bar ──────────────────────────────── */}
      <View style={styles.topNav}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={22} color={Colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.navTitle}>Incident Response</Text>

        <StatusBadge
          status={
            alert.status === 'resolved'
              ? 'safe'
              : alert.severity === 'critical'
              ? 'critical'
              : 'warning'
          }
          label={alert.status.toUpperCase()}
          size="sm"
        />
      </View>

      {/* ── 1. Severity Banner ─────────────────────────────────── */}
      <Card
        elevated
        style={[
          styles.bannerCard,
          alert.severity === 'critical' ? styles.bannerCritical : styles.bannerWarning,
        ]}
      >
        <View style={styles.bannerHeader}>
          <ShieldAlert
            size={26}
            color={alert.severity === 'critical' ? Colors.critical : Colors.warning}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>{alert.title}</Text>
            <Text style={styles.bannerTarget}>Recipient: {alert.elderlyName}</Text>
          </View>
        </View>
        <Text style={styles.bannerDesc}>{alert.description}</Text>
      </Card>

      <View style={{ height: Spacing.md }} />

      {/* ── 2. Geofence & Location Card ───────────────────────── */}
      <Card style={styles.mapCard}>
        <View style={styles.mapHeader}>
          <Navigation size={18} color={Colors.safe} />
          <View style={{ flex: 1 }}>
            <Text style={styles.mapAddress}>{alert.location}</Text>
            <Text style={styles.mapCoords}>Location Coordinates: 40.7306° N, 74.2638° W</Text>
          </View>
        </View>
      </Card>

      <View style={{ height: Spacing.md }} />

      {/* ── 3. Sensor Telemetry at Event ──────────────────────── */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionLabel}>SENSOR TELEMETRY AT EVENT</Text>
        <View style={styles.telemetryGrid}>
          {alert.vitalReadings?.heartRate && (
            <View style={styles.telemetryBox}>
              <Heart size={18} color={Colors.critical} />
              <Text style={styles.telemetryVal}>{alert.vitalReadings.heartRate} bpm</Text>
              <Text style={styles.telemetryLbl}>Heart Rate</Text>
            </View>
          )}

          {alert.vitalReadings?.spo2 && (
            <View style={styles.telemetryBox}>
              <Activity size={18} color={Colors.primary} />
              <Text style={styles.telemetryVal}>{alert.vitalReadings.spo2}%</Text>
              <Text style={styles.telemetryLbl}>Blood Oxygen</Text>
            </View>
          )}

          {alert.vitalReadings?.impactGForce && (
            <View style={styles.telemetryBox}>
              <AlertTriangle size={18} color={Colors.critical} />
              <Text style={styles.telemetryVal}>{alert.vitalReadings.impactGForce}G</Text>
              <Text style={styles.telemetryLbl}>Impact Force</Text>
            </View>
          )}
        </View>

        <Divider spacing={Spacing.md} />

        <View style={styles.metaRow}>
          <Clock size={15} color={Colors.textTertiary} />
          <Text style={styles.metaText}>Recorded: {alert.timestamp}</Text>
        </View>

        <View style={styles.metaRow}>
          <MapPin size={15} color={Colors.textTertiary} />
          <Text style={styles.metaText}>Location: {alert.location}</Text>
        </View>
      </Card>

      <View style={{ height: Spacing.md }} />

      {/* ── 4. Quick Response Emergency Call Dock ─────────────── */}
      <Card style={styles.emergencyDockCard}>
        <Text style={styles.sectionLabel}>CRISIS RESPONSE HOTLINES</Text>
        <View style={styles.dialActionsRow}>
          <TouchableOpacity
            onPress={() => handleCall('+1 (555) 234-5678')}
            style={styles.familyDialBtn}
            activeOpacity={0.85}
          >
            <Phone size={18} color={Colors.white} />
            <Text style={styles.familyDialText}>Call Eleanor (Parent)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleCall('911')}
            style={styles.emergencyDialBtn}
            activeOpacity={0.85}
          >
            <Phone size={18} color={Colors.critical} />
            <Text style={styles.emergencyDialText}>911 EMS</Text>
          </TouchableOpacity>
        </View>
      </Card>

      <View style={{ height: Spacing.md }} />

      {/* ── 5. Response Lifecycle ──────────────────────────────── */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionLabel}>CARE RESPONSE STATUS</Text>

        {alert.status === 'active' && (
          <View style={styles.actionStateBox}>
            <Text style={styles.stateNoticeText}>
              Acknowledge to confirm you are actively attending to Margaret Johnson.
            </Text>
            <Button
              title="Acknowledge Alert"
              onPress={handleAcknowledge}
              variant="primary"
              size="lg"
              fullWidth
              style={{ backgroundColor: Colors.safe }}
              leftIcon={<CheckCircle2 size={18} color={Colors.white} />}
            />
          </View>
        )}

        {alert.status === 'acknowledged' && (
          <View style={styles.timelineItem}>
            <UserCheck size={18} color={Colors.safe} />
            <View style={{ flex: 1 }}>
              <Text style={styles.timelineTitle}>Acknowledged by {alert.acknowledgedBy}</Text>
              <Text style={styles.timelineTime}>{alert.acknowledgedAt}</Text>
            </View>
          </View>
        )}

        {alert.status !== 'resolved' && (
          <View style={{ marginTop: Spacing.md }}>
            {showNoteInput ? (
              <View>
                <TextInput
                  label="Care Action Notes *"
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="e.g. Margaret assisted safely to bed, water provided, vitals stable."
                  multiline
                />
                <View style={{ height: Spacing.sm }} />
                <Button
                  title="Submit & Mark Resolved"
                  onPress={handleResolve}
                  variant="primary"
                  size="md"
                  fullWidth
                  loading={isSubmitting}
                  style={{ backgroundColor: Colors.safe }}
                />
              </View>
            ) : (
              <Button
                title="Mark Incident as Resolved"
                onPress={() => setShowNoteInput(true)}
                variant="secondary"
                size="md"
                fullWidth
              />
            )}
          </View>
        )}

        {alert.status === 'resolved' && (
          <View style={styles.resolvedBox}>
            <CheckCircle2 size={22} color={Colors.safe} />
            <View style={{ flex: 1 }}>
              <Text style={styles.resolvedTitle}>Incident Resolved</Text>
              <Text style={styles.resolvedBy}>Resolved by: {alert.resolvedBy}</Text>
              {alert.resolutionNotes && (
                <Text style={styles.resolvedNotes}>&quot;{alert.resolutionNotes}&quot;</Text>
              )}
            </View>
          </View>
        )}
      </Card>

      <View style={{ height: Spacing['3xl'] }} />
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
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  navTitle: {
    ...Typography.bodySemiBold,
    fontSize: 17,
    color: Colors.textPrimary,
  },
  bannerCard: {
    backgroundColor: Colors.white,
    borderLeftWidth: 4,
  },
  bannerCritical: {
    borderLeftColor: Colors.critical,
  },
  bannerWarning: {
    borderLeftColor: Colors.warning,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xs,
  },
  bannerTitle: {
    ...Typography.h3,
    fontSize: 18,
    color: Colors.textPrimary,
  },
  bannerTarget: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  bannerDesc: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 4,
  },
  mapCard: {
    backgroundColor: Colors.white,
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  mapAddress: {
    ...Typography.bodySemiBold,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  mapCoords: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: Colors.white,
  },
  sectionLabel: {
    ...Typography.overline,
    color: Colors.textTertiary,
    letterSpacing: 0.8,
    fontSize: 11,
    marginBottom: Spacing.base,
  },
  telemetryGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  telemetryBox: {
    flex: 1,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    alignItems: 'center',
  },
  telemetryVal: {
    ...Typography.bodySemiBold,
    fontSize: 16,
    color: Colors.textPrimary,
    marginTop: 4,
  },
  telemetryLbl: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textTertiary,
    marginTop: 2,
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 3,
  },
  metaText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontSize: 12,
  },
  emergencyDockCard: {
    backgroundColor: Colors.white,
    borderColor: 'rgba(34, 197, 94, 0.25)',
    borderWidth: 1,
  },
  dialActionsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  familyDialBtn: {
    flex: 1.5,
    height: 52,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  familyDialText: {
    ...Typography.button,
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  emergencyDialBtn: {
    flex: 1,
    height: 52,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  emergencyDialText: {
    ...Typography.button,
    color: Colors.critical,
    fontSize: 14,
    fontWeight: '700',
  },
  actionStateBox: {
    gap: Spacing.md,
  },
  stateNoticeText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.safeBg,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  timelineTitle: {
    ...Typography.bodySmallSemiBold,
    color: Colors.safe,
  },
  timelineTime: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  resolvedBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.safeBg,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  resolvedTitle: {
    ...Typography.bodySmallSemiBold,
    color: Colors.safe,
  },
  resolvedBy: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  resolvedNotes: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  notFoundCard: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
    gap: Spacing.md,
  },
  notFoundTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
});
