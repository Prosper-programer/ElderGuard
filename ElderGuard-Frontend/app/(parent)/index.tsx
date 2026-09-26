import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, MapPin, Pill, ShieldAlert, Shield, CheckCircle, UserPlus, Plus, Heart, Activity, Thermometer, Footprints, ChevronRight, Battery } from 'lucide-react-native';
import { ScreenContainer, BottomTabBar, Card, VitalSparklineCard } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';

import { useAuth } from '@/context/AuthContext';
import { useElderly } from '@/context/ElderlyContext';
import { useVitals } from '@/context/VitalsContext';
import { useCare } from '@/context/CareContext';
import { useAlerts } from '@/context/AlertContext';

export default function ParentDashboardScreen() {
  const router = useRouter();
  const { user, accountStatus } = useAuth();
  const isDeactivated = accountStatus === 'inactive';
  const { activeProfile, hasSenior, assignedCaregiverName, hasCaregiver } = useElderly();
  const { vitals } = useVitals();
  const { todayDoses } = useCare();
  const { activeAlerts } = useAlerts();

  const parentFirstName = user?.name?.split(' ')[0] || 'Parent';
  const seniorName = activeProfile?.fullName || 'Patient';
  const seniorAge = activeProfile?.age || '';
  const seniorPhoto = activeProfile?.imageUrl || undefined;

  const getStatusColor = (status: string) => {
    if (status === 'safe') return Colors.safe;
    if (status === 'warning') return Colors.warning;
    if (status === 'critical') return Colors.critical;
    return Colors.offline;
  };
  const getStatusBg = (status: string) => {
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

  // Placeholders
  const caregiverImageUri = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop';
  const mapImageUri = 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400&auto=format&fit=crop';
  const emptyHeroImgUri = 'https://images.unsplash.com/photo-1581579205115-0b5cb063c2c3?q=80&w=400&auto=format&fit=crop';
  const emptyCareImgUri = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=400&auto=format&fit=crop';

  return (
    <ScreenContainer
      scrollable
      padded
      backgroundColor={Colors.background}
      bottomBar={<BottomTabBar activeTab="home" role="parent" />}
    >
      {/* 1. HEADER */}
      <View style={styles.topHeader}>
        <Text style={styles.greetingTitle}>Good morning, {parentFirstName} 👋</Text>
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
          <Image source={{uri: emptyHeroImgUri}} style={styles.emptyHeroImg} />
          <View style={styles.emptySeniorOverlay}>
            <Text style={styles.emptySeniorTitle}>Welcome to GUYNOVA GUARD</Text>
            <Text style={styles.emptySeniorSub}>Add your loved one to monitor their safety and vitals with premium care tools.</Text>
            <TouchableOpacity style={styles.addSeniorHeroBtn} onPress={() => router.push('/(parent)/profile/create' as any)}>
              <Plus size={16} color={Colors.white} />
              <Text style={styles.addSeniorHeroBtnText}>Add Patient</Text>
            </TouchableOpacity>
          </View>
        </Card>
      ) : (
        <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/(parent)/profile' as any)}>
          <Card style={styles.patientStatusCard}>
             <View style={styles.patientHeaderRow}>
               <View style={styles.avatarContainer}>
                 {seniorPhoto ? (
                   <Image source={seniorPhoto} style={styles.patientAvatar} />
                 ) : (
                   <View style={styles.patientAvatarPlaceholder}>
                     <Text style={styles.patientAvatarInitials}>{seniorName.substring(0,2).toUpperCase()}</Text>
                   </View>
                 )}
                 {/* Live Breathing Ring */}
                 {vitals?.overallStatus !== 'offline' && (
                   <View style={[styles.breathingRing, { borderColor: statusColor }]} />
                 )}
               </View>
               <View style={styles.patientInfoCol}>
                 <View style={styles.patientNameRow}>
                   <Text style={styles.patientName} numberOfLines={1}>{seniorName}</Text>
                   <View style={[styles.statusPillSmall, { backgroundColor: statusBg }]}>
                      <View style={[styles.statusDotSmall, { backgroundColor: statusColor }]} />
                      <Text style={[styles.statusPillTextSmall, { color: statusColor }]}>{currentStatusText}</Text>
                   </View>
                 </View>
                 <Text style={styles.patientSubtext}>{seniorAge} years · {activeProfile?.address || 'Unknown'}</Text>
                 
                 <View style={styles.deviceStatusRow}>
                   <Text style={styles.lastUpdateText}>
                      {vitals?.overallStatus === 'offline' 
                        ? 'Last known data' 
                        : `Updated ${vitals?.lastSyncTime || 'recently'}`}
                   </Text>
                   {vitals?.overallStatus !== 'offline' && (
                     <View style={styles.batteryWrap}>
                       <Battery size={14} color='rgba(255,255,255,0.7)' />
                       <Text style={styles.batteryText}>84%</Text>
                     </View>
                   )}
                 </View>
               </View>
               
               <View style={styles.chevronWrap}>
                 <ChevronRight size={20} color='rgba(255,255,255,0.4)' />
               </View>
             </View>
          </Card>
        </TouchableOpacity>
      )}

      {/* 3. QUICK ACTIONS (Upgraded with Map Image) */}
      <View style={styles.sectionWrap}>
        <Text style={styles.sectionOverline}>QUICK ACTIONS</Text>
        <View style={styles.quickActionsGrid2x2}>
          {/* Location Action with Map Background */}
          <TouchableOpacity
            style={styles.mapQuickAction}
            activeOpacity={0.8}
            onPress={() => router.push('/(parent)/location' as any)}
          >
            <ImageBackground source={{ uri: mapImageUri }} style={styles.mapQuickActionBg} imageStyle={styles.mapQuickActionImage}>
              <View style={styles.mapQuickActionOverlay}>
                <View style={styles.mapQuickActionIconBox}>
                  <MapPin size={20} color={Colors.primary} />
                </View>
                <Text style={styles.mapQuickActionLabel}>Location</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>

          <View style={styles.quickActionsCol}>
            <TouchableOpacity onPress={() => router.push('/(parent)/alerts' as any)} style={styles.quickActionBtnSmall} activeOpacity={0.8}>
              <Bell size={20} color={Colors.textPrimary} />
              <Text style={styles.quickActionLabelSmall}>Alerts</Text>
            </TouchableOpacity>
            
            <View style={{flexDirection: 'row', gap: 12, flex: 1}}>
              <TouchableOpacity onPress={() => router.push('/(parent)/care' as any)} style={[styles.quickActionBtnSmall, {flex: 1}]} activeOpacity={0.8}>
                <Pill size={20} color={Colors.textPrimary} />
                <Text style={styles.quickActionLabelSmall}>Care plan</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/(parent)/emergency' as any)} style={[styles.quickActionBtnSmall, styles.quickActionDangerBorder, {flex: 1}]} activeOpacity={0.8}>
                <ShieldAlert size={20} color={Colors.critical} />
                <Text style={[styles.quickActionLabelSmall, styles.quickActionDangerText]}>SOS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* 4. CARE TEAM (Upgraded with Real Image) */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionOverline}>CARE TEAM</Text>
          <TouchableOpacity onPress={() => router.push('/(parent)/caregivers' as any)}>
            <Text style={styles.sectionActionText}>View all {'>'}</Text>
          </TouchableOpacity>
        </View>
        {hasCaregiver ? (
          <Card style={styles.caregiverCard}>
            <Image source={{ uri: caregiverImageUri }} style={styles.caregiverImage} />
            <View style={styles.caregiverInfo}>
              <Text style={styles.caregiverName}>{assignedCaregiverName || 'Sarah Mitchell'}</Text>
              <Text style={styles.caregiverRole}>Primary Caregiver · 08:00–20:00</Text>
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
              <Text style={styles.caregiverRole}>Ensure your loved one gets the right support.</Text>
            </View>
            <TouchableOpacity style={styles.addCaregiverBtn} onPress={() => router.push('/(parent)/caregivers/create' as any)}>
              <Plus size={16} color={Colors.white} />
              <Text style={styles.addCaregiverBtnText}>Assign caregiver</Text>
            </TouchableOpacity>
          </Card>
        )}
      </View>

      {/* 5. HEALTH OVERVIEW (Clean Responsive List) */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionOverline}>HEALTH OVERVIEW</Text>
          <TouchableOpacity onPress={() => router.push('/(parent)/health' as any)}>
            <Text style={styles.sectionActionText}>Full report {'>'}</Text>
          </TouchableOpacity>
        </View>
        
        <Card style={styles.healthListCard}>
          {vitals?.heartRate && (
            <View style={[styles.healthRow, styles.itemBorderBottom]}>
              <View style={[styles.healthIconWrap, { backgroundColor: Colors.criticalBg }]}>
                <Heart size={18} color={Colors.critical} />
              </View>
              <Text style={styles.healthRowTitle}>{vitals.heartRate.label || 'Heart Rate'}</Text>
              <View style={styles.healthRowRight}>
                <Text style={styles.healthRowValue}>{vitals.heartRate.value} <Text style={styles.healthRowUnit}>{vitals.heartRate.unit}</Text></Text>
                <Text style={[styles.healthRowStatus, { color: getStatusColor(vitals.heartRate.status as any) }]}>{vitals.heartRate.statusLabel}</Text>
              </View>
            </View>
          )}

          {vitals?.spo2 && (
            <View style={[styles.healthRow, styles.itemBorderBottom]}>
              <View style={[styles.healthIconWrap, { backgroundColor: Colors.primaryFaded }]}>
                <Activity size={18} color={Colors.primary} />
              </View>
              <Text style={styles.healthRowTitle}>{vitals.spo2.label || 'Blood Oxygen'}</Text>
              <View style={styles.healthRowRight}>
                <Text style={styles.healthRowValue}>{vitals.spo2.value} <Text style={styles.healthRowUnit}>{vitals.spo2.unit}</Text></Text>
                <Text style={[styles.healthRowStatus, { color: getStatusColor(vitals.spo2.status as any) }]}>{vitals.spo2.statusLabel}</Text>
              </View>
            </View>
          )}

          {vitals?.temperature && (
            <View style={[styles.healthRow, styles.itemBorderBottom]}>
              <View style={[styles.healthIconWrap, { backgroundColor: Colors.warningBg }]}>
                <Thermometer size={18} color={Colors.warning} />
              </View>
              <Text style={styles.healthRowTitle}>{vitals.temperature.label || 'Body Temp'}</Text>
              <View style={styles.healthRowRight}>
                <Text style={styles.healthRowValue}>{vitals.temperature.value} <Text style={styles.healthRowUnit}>{vitals.temperature.unit}</Text></Text>
                <Text style={[styles.healthRowStatus, { color: getStatusColor(vitals.temperature.status as any) }]}>{vitals.temperature.statusLabel}</Text>
              </View>
            </View>
          )}

          {vitals?.steps && (
            <View style={styles.healthRow}>
              <View style={[styles.healthIconWrap, { backgroundColor: Colors.safeBg }]}>
                <Footprints size={18} color={Colors.safe} />
              </View>
              <Text style={styles.healthRowTitle}>{vitals.steps.label || 'Activity'}</Text>
              <View style={styles.healthRowRight}>
                <Text style={styles.healthRowValue}>{vitals.steps.value} <Text style={styles.healthRowUnit}>{vitals.steps.unit}</Text></Text>
                <Text style={[styles.healthRowStatus, { color: getStatusColor(vitals.steps.status as any) }]}>{vitals.steps.statusLabel}</Text>
              </View>
            </View>
          )}
        </Card>
      </View>

      {/* 6. TODAY'S CARE */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionOverline}>TODAY'S CARE</Text>
          <TouchableOpacity onPress={() => router.push('/(parent)/care' as any)}>
            <Text style={styles.sectionActionText}>View all {'>'}</Text>
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
             <View style={styles.emptyCareWrap}>
               <Image source={{uri: emptyCareImgUri}} style={styles.emptyCareImg} />
               <View style={styles.emptyCareOverlay}>
                 <Text style={styles.emptyStateText}>No care scheduled today.</Text>
                 <Text style={styles.emptyStateSub}>Take a moment to relax.</Text>
               </View>
             </View>
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
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
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
    shadowColor: Colors.primary,
    shadowOpacity: 0.05,
    shadowRadius: 10,
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
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 12,
    textTransform: 'uppercase',
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
    fontWeight: '600',
  },
  
  // PATIENT STATUS CARD
  patientStatusCard: {
    padding: Spacing.lg,
    backgroundColor: Colors.primary, // Changed to Brand Blue
    borderRadius: BorderRadius.lg,
    borderWidth: 0,
    marginBottom: Spacing.xl,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 8,
  },
  patientHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatarContainer: {
    position: 'relative',
    padding: 3,
  },
  patientAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  patientAvatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingRing: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 34,
    borderWidth: 2.5,
    opacity: 0.75,
  },
  patientAvatarInitials: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  patientInfoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  patientNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  patientName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: -0.5,
    flexShrink: 1,
  },
  statusPillSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  statusDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusPillTextSmall: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  patientSubtext: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    marginBottom: 8,
  },
  deviceStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  lastUpdateText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  batteryWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  batteryText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  chevronWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },

  // EMPTY SENIOR
  emptySeniorHeroCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
  },
  emptyHeroImg: {
    width: '100%',
    height: 120,
    opacity: 0.8,
  },
  emptySeniorOverlay: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptySeniorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  emptySeniorSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 18,
  },
  addSeniorHeroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
  },
  addSeniorHeroBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },

  // QUICK ACTIONS (MAP UPGRADE)
  quickActionsGrid2x2: {
    flexDirection: 'row',
    gap: 12,
  },
  mapQuickAction: {
    flex: 1,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    height: 160,
  },
  mapQuickActionBg: {
    width: '100%',
    height: '100%',
  },
  mapQuickActionImage: {
    opacity: 0.85,
  },
  mapQuickActionOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: 16,
    justifyContent: 'flex-end',
  },
  mapQuickActionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  mapQuickActionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  quickActionsCol: {
    flex: 1,
    gap: 12,
    height: 160,
  },
  quickActionBtnSmall: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    gap: 6,
  },
  quickActionDangerBorder: {
    borderColor: Colors.criticalBg,
    backgroundColor: Colors.criticalLight,
  },
  quickActionLabelSmall: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  quickActionDangerText: {
    color: Colors.critical,
  },

  // CARE TEAM
  caregiverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.primary,
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 2,
  },
  caregiverImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: Spacing.md,
  },
  caregiverInfo: {
    flex: 1,
  },
  caregiverName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  caregiverRole: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
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
    fontWeight: '800',
    color: Colors.safe,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  noCaregiverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.base,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addCaregiverBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.xs,
    gap: 4,
  },
  addCaregiverBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },

  // HEALTH OVERVIEW (LIST)
  healthListCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.primary,
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 2,
    overflow: 'hidden',
  },
  healthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  itemBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  healthIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  healthRowTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  healthRowRight: {
    alignItems: 'flex-end',
  },
  healthRowValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  healthRowUnit: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  healthRowStatus: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },

  // TODAY'S CARE
  careCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.primary,
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 2,
    overflow: 'hidden',
  },
  careRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  itemBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  careDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
  },
  careRowContent: {
    flex: 1,
    paddingHorizontal: 12,
  },
  careRowTitle: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  careRowTitleDone: {
    color: Colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  careRowTime: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  emptyCareWrap: {
    width: '100%',
    height: 120,
    position: 'relative',
  },
  emptyCareImg: {
    width: '100%',
    height: '100%',
    opacity: 0.4,
  },
  emptyCareOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  emptyStateText: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  emptyStateSub: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
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
    fontWeight: '800',
    color: '#991B1B',
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
    fontWeight: '700',
    color: '#991B1B',
  },
  deactivatedMessage: {
    fontSize: 13,
    color: '#BE123C',
    marginTop: 4,
    lineHeight: 18,
  },
});
