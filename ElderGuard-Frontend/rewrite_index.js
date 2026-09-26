const fs = require('fs');
const path = 'app/(parent)/index.tsx';

const code = import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, MapPin, Pill, ShieldAlert, HeartHandshake, Shield, CheckCircle, UserPlus, Plus } from 'lucide-react-native';
import { ScreenContainer, BottomTabBar, Card } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius, Layout, Shadows } from '@/constants/theme';

import { useAuth } from '@/context/AuthContext';
import { useElderly } from '@/context/ElderlyContext';
import { useVitals } from '@/context/VitalsContext';
import { useCare } from '@/context/CareContext';
import { useAlerts } from '@/context/AlertContext';

export default function ParentDashboardScreen() {
  const router = useRouter();
  const { user, isDeactivated } = useAuth();
  const { activeProfile, hasSenior, assignedCaregiverName, hasCaregiver } = useElderly();
  const { vitals } = useVitals();
  const { todayDoses } = useCare();
  const { activeAlerts } = useAlerts();

  // Deactivated state tracking
  const prevDeactivatedRef = React.useRef(isDeactivated);
  React.useEffect(() => {
    prevDeactivatedRef.current = isDeactivated;
  }, [isDeactivated]);

  const parentFirstName = user?.name?.split(' ')[0] || 'Parent';

  const seniorName = activeProfile?.fullName || 'Patient';
  const seniorAge = activeProfile?.age || '';
  const seniorPhoto = activeProfile?.imageUrl || undefined;

  const getStatusColor = (status) => {
    if (status === 'safe') return Colors.safe;
    if (status === 'warning') return Colors.warning;
    if (status === 'critical') return Colors.critical;
    return Colors.offline;
  };
  const getStatusBg = (status) => {
    if (status === 'safe') return Colors.safeBg;
    if (status === 'warning') return Colors.warningBg;
    if (status === 'critical') return Colors.criticalBg;
    return Colors.offlineBg;
  };

  const currentStatusText = vitals?.overallStatus === 'safe' ? 'SAFE' : 
                            vitals?.overallStatus === 'warning' ? 'NEEDS ATTENTION' : 
                            vitals?.overallStatus === 'critical' ? 'CRITICAL' : 'OFFLINE';
  
  const statusColor = getStatusColor(vitals?.overallStatus || 'offline');
  const statusBg = getStatusBg(vitals?.overallStatus || 'offline');

  return (
    <ScreenContainer
      scrollable
      padded
      backgroundColor={Colors.background}
      bottomBar={<BottomTabBar activeTab="home" role="parent" />}
    >
      {/* 1. HEADER */}
      <View style={styles.topHeader}>
        <Text style={styles.greetingTitle}>Good morning, {parentFirstName} ??</Text>
        <TouchableOpacity
          onPress={() => router.push('/(parent)/alerts' as any)}
          style={styles.headerIconButton}
          activeOpacity={0.7}
        >
          <Bell size={20} color={Colors.textPrimary} />
          {activeAlerts && activeAlerts.length > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{activeAlerts.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* SUSPENDED STATE */}
      {isDeactivated && (
        <Card style={styles.deactivatedCard}>
          <View style={styles.deactivatedHeaderRow}>
            <View style={styles.deactivatedBadge}>
              <View style={styles.deactivatedDotPulse} />
              <Text style={styles.deactivatedBadgeText}>ACCOUNT SUSPENDED</Text>
            </View>
          </View>
          <View style={styles.deactivatedContentRow}>
            <View style={styles.deactivatedIconWrap}>
              <ShieldAlert size={26} color={Colors.critical} />
            </View>
            <View style={styles.deactivatedTextWrap}>
              <Text style={styles.deactivatedTitle}>Account Deactivated</Text>
              <Text style={styles.deactivatedMessage}>Your account has been paused by an admin. Live monitoring is disabled.</Text>
            </View>
          </View>
        </Card>
      )}

      {/* 2. PATIENT + SAFETY STATUS */}
      {!hasSenior ? (
        <Card style={styles.emptySeniorHeroCard}>
          <View style={styles.emptySeniorIconWrap}>
            <UserPlus size={24} color={Colors.primary} />
          </View>
          <Text style={styles.emptySeniorTitle}>Welcome to GUYNOVA GUARD</Text>
          <Text style={styles.emptySeniorSub}>Add your loved one to monitor their safety and vitals.</Text>
          <TouchableOpacity style={styles.addSeniorHeroBtn} onPress={() => router.push('/(parent)/profile/create' as any)}>
            <Plus size={16} color={Colors.white} />
            <Text style={styles.addSeniorHeroBtnText}>Add Patient</Text>
          </TouchableOpacity>
        </Card>
      ) : (
        <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/(parent)/profile' as any)}>
          <Card style={styles.patientStatusCard}>
             <View style={styles.patientHeaderRow}>
               {seniorPhoto ? (
                 <Image source={seniorPhoto} style={styles.patientAvatar} />
               ) : (
                 <View style={styles.patientAvatarPlaceholder}>
                   <Text style={styles.patientAvatarInitials}>{seniorName.substring(0,2).toUpperCase()}</Text>
                 </View>
               )}
               <View style={styles.patientInfoCol}>
                 <Text style={styles.patientName} numberOfLines={1}>{seniorName}</Text>
                 <Text style={styles.patientSubtext}>{seniorAge} years · {activeProfile?.address || 'Unknown'}</Text>
               </View>
             </View>

             <View style={styles.statusDivider} />

             <View style={styles.statusRow}>
               <View style={[styles.statusPill, { backgroundColor: statusBg }]}>
                  <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                  <Text style={[styles.statusPillText, { color: statusColor }]}>{currentStatusText}</Text>
               </View>
               <Text style={styles.lastUpdateText}>
                  {vitals?.overallStatus === 'offline' 
                    ? 'Last known data' 
                    : \Updated \\}
               </Text>
             </View>

             <View style={styles.vitalsSummaryGrid}>
                <View style={styles.vitalSummaryItem}>
                  <Text style={styles.vitalSummaryValue}>{vitals?.heartRate?.value || '--'}<Text style={styles.vitalSummaryUnit}> bpm</Text></Text>
                  <Text style={styles.vitalSummaryLabel}>Heart rate</Text>
                </View>
                <View style={styles.vitalSummaryItem}>
                  <Text style={styles.vitalSummaryValue}>{vitals?.spo2?.value || '--'}<Text style={styles.vitalSummaryUnit}> %</Text></Text>
                  <Text style={styles.vitalSummaryLabel}>SpO2</Text>
                </View>
                <View style={styles.vitalSummaryItem}>
                  <Text style={styles.vitalSummaryValue}>{vitals?.temperature?.value || '--'}<Text style={styles.vitalSummaryUnit}> °C</Text></Text>
                  <Text style={styles.vitalSummaryLabel}>Temp</Text>
                </View>
                <View style={styles.vitalSummaryItem}>
                  <Text style={styles.vitalSummaryValue}>{vitals?.steps?.value || '--'}</Text>
                  <Text style={styles.vitalSummaryLabel}>Steps</Text>
                </View>
             </View>
          </Card>
        </TouchableOpacity>
      )}

      {/* 3. QUICK ACTIONS */}
      <View style={styles.sectionWrap}>
        <Text style={styles.sectionOverline}>QUICK ACTIONS</Text>
        <View style={styles.quickActionsGrid}>
          {[
            { icon: MapPin, label: 'Location', route: '/(parent)/location', isDanger: false },
            { icon: Bell, label: 'Alerts', route: '/(parent)/alerts', isDanger: false },
            { icon: Pill, label: 'Care plan', route: '/(parent)/care', isDanger: false },
            { icon: ShieldAlert, label: 'Emergency', route: '/(parent)/emergency', isDanger: true },
          ].map((action) => (
            <TouchableOpacity
              key={action.label}
              onPress={() => router.push(action.route as any)}
              style={[styles.quickActionBtn, action.isDanger && styles.quickActionDangerBorder]}
              activeOpacity={0.8}
            >
              <action.icon size={20} color={action.isDanger ? Colors.critical : Colors.textPrimary} />
              <Text style={[styles.quickActionLabel, action.isDanger && styles.quickActionDangerText]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 4. CARE TEAM */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionOverline}>CARE TEAM</Text>
          <TouchableOpacity onPress={() => router.push('/(parent)/caregivers' as any)}>
            <Text style={styles.sectionActionText}>View all ></Text>
          </TouchableOpacity>
        </View>
        {hasCaregiver ? (
          <Card style={styles.caregiverCard}>
            <View style={styles.caregiverIconBox}>
              <HeartHandshake size={20} color={Colors.white} />
            </View>
            <View style={styles.caregiverInfo}>
              <Text style={styles.caregiverName}>{assignedCaregiverName || 'Caregiver'}</Text>
              <Text style={styles.caregiverRole}>Caregiver · 08:00–20:00</Text>
            </View>
            <View style={styles.caregiverStatus}>
              <View style={[styles.statusDot, { backgroundColor: Colors.safe }]} />
              <Text style={styles.caregiverStatusText}>ON DUTY</Text>
            </View>
          </Card>
        ) : (
          <Card style={styles.noCaregiverCard}>
            <View style={styles.caregiverInfo}>
              <Text style={styles.caregiverName}>No caregiver assigned</Text>
            </View>
            <TouchableOpacity style={styles.addCaregiverBtn} onPress={() => router.push('/(parent)/caregivers/create' as any)}>
              <Plus size={14} color={Colors.primary} />
              <Text style={styles.addCaregiverBtnText}>Assign caregiver</Text>
            </TouchableOpacity>
          </Card>
        )}
      </View>

      {/* 5. HEALTH OVERVIEW */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionOverline}>HEALTH OVERVIEW</Text>
          <TouchableOpacity onPress={() => router.push('/(parent)/health' as any)}>
            <Text style={styles.sectionActionText}>Full report ></Text>
          </TouchableOpacity>
        </View>
        <Card style={styles.healthOverviewCard}>
          {[
            { label: 'Heart rate', val: vitals?.heartRate },
            { label: 'SpO2', val: vitals?.spo2 },
            { label: 'Temperature', val: vitals?.temperature },
            { label: 'Activity', val: vitals?.steps }
          ].map((metric, i) => (
            <View key={metric.label} style={[styles.healthRow, i !== 0 && styles.itemBorder]}>
              <View style={styles.healthRowLeft}>
                <Text style={styles.healthRowLabel}>{metric.label}</Text>
                <Text style={styles.healthRowValue}>
                  {metric.val?.value || '--'} <Text style={styles.healthRowUnit}>{metric.val?.unit || ''}</Text>
                </Text>
              </View>
              <View style={styles.healthRowRight}>
                {metric.val?.statusLabel ? (
                   <View style={styles.healthTrendRow}>
                      <View style={[styles.statusDotSmall, { backgroundColor: getStatusColor(metric.val.status) }]} />
                      <Text style={styles.healthTrendText}>
                        {metric.val.statusLabel}
                        {metric.val.trend === 'rising' ? ' ?' : metric.val.trend === 'falling' ? ' ?' : ''}
                      </Text>
                   </View>
                ) : (
                   <Text style={styles.healthTimeText}>{metric.val?.lastUpdated || 'No recent data'}</Text>
                )}
              </View>
            </View>
          ))}
        </Card>
      </View>

      {/* 6. TODAY'S CARE */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionOverline}>TODAY'S CARE</Text>
          <TouchableOpacity onPress={() => router.push('/(parent)/care' as any)}>
            <Text style={styles.sectionActionText}>View all ></Text>
          </TouchableOpacity>
        </View>
        <Card style={styles.careCard}>
           {todayDoses && todayDoses.length > 0 ? (
             todayDoses.slice(0,4).map((dose, i) => (
                <View key={dose.id} style={[styles.careRow, i !== 0 && styles.itemBorder]}>
                  {dose.status === 'taken' ? (
                    <CheckCircle size={18} color={Colors.safe} />
                  ) : dose.status === 'missed' ? (
                    <View style={[styles.careDot, { borderColor: Colors.critical }]} />
                  ) : (
                    <View style={[styles.careDot, { borderColor: Colors.primary }]} />
                  )}
                  <View style={styles.careRowContent}>
                    <Text style={[styles.careRowTitle, dose.status === 'taken' && styles.careRowTitleDone]}>{dose.medicationName}</Text>
                  </View>
                  <Text style={[styles.careRowTime, dose.status === 'taken' && styles.careRowTitleDone]}>{dose.scheduledTime}</Text>
                </View>
             ))
           ) : (
             <Text style={styles.emptyStateText}>No care scheduled today</Text>
           )}
        </Card>
      </View>
      
      <View style={{height: 40}} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 8,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.critical,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
  sectionWrap: {
    marginBottom: Spacing.xl,
  },
  sectionOverline: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionActionText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
  
  // PATIENT STATUS CARD
  patientStatusCard: {
    padding: Spacing.base,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  patientHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  patientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  patientAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientAvatarInitials: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  patientInfoCol: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  patientSubtext: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statusDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  lastUpdateText: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  vitalsSummaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vitalSummaryItem: {
    alignItems: 'flex-start',
  },
  vitalSummaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  vitalSummaryUnit: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '400',
  },
  vitalSummaryLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  // EMPTY SENIOR
  emptySeniorHeroCard: {
    padding: Spacing.xl,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  emptySeniorIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  emptySeniorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  emptySeniorSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  addSeniorHeroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
  },
  addSeniorHeroBtnText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },

  // QUICK ACTIONS
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionBtn: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    ...Shadows.sm,
  },
  quickActionDangerBorder: {
    borderColor: Colors.criticalBg,
    backgroundColor: Colors.criticalLight,
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginTop: 8,
  },
  quickActionDangerText: {
    color: Colors.critical,
    fontWeight: '600',
  },

  // CARE TEAM
  caregiverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  caregiverIconBox: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  caregiverInfo: {
    flex: 1,
  },
  caregiverName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  caregiverRole: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  caregiverStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.safeLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
  },
  caregiverStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.safe,
  },
  noCaregiverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.base,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addCaregiverBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addCaregiverBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.primary,
  },

  // HEALTH OVERVIEW
  healthOverviewCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  healthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  healthRowLeft: {
    flex: 1,
  },
  healthRowLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  healthRowValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  healthRowUnit: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  healthRowRight: {
    alignItems: 'flex-end',
  },
  healthTrendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  healthTrendText: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  healthTimeText: {
    fontSize: 12,
    color: Colors.textTertiary,
  },

  // TODAY'S CARE
  careCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  careRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  careDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  careRowContent: {
    flex: 1,
    paddingHorizontal: 12,
  },
  careRowTitle: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  careRowTitleDone: {
    color: Colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  careRowTime: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  emptyStateText: {
    padding: 16,
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: 13,
  },

  // DEACTIVATED STATE
  deactivatedCard: {
    backgroundColor: Colors.criticalLight,
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    marginBottom: Spacing.xl,
  },
  deactivatedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  deactivatedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
  },
  deactivatedDotPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.critical,
  },
  deactivatedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#991B1B',
  },
  liveSyncText: {
    fontSize: 11,
    color: Colors.critical,
  },
  deactivatedContentRow: {
    flexDirection: 'row',
    gap: 12,
  },
  deactivatedIconWrap: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deactivatedTextWrap: {
    flex: 1,
  },
  deactivatedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#991B1B',
  },
  deactivatedMessage: {
    fontSize: 12,
    color: '#BE123C',
    marginTop: 4,
    lineHeight: 18,
  },
});
;
fs.writeFileSync(path, code, 'utf8');
