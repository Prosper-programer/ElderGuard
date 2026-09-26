import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Bell,
  ChevronRight,
  AlertTriangle,
  MapPin,
  CheckCircle,
  Pill,
  RefreshCw,
  Heart,
  Activity,
  Thermometer,
  Phone,
  Stethoscope,
  CheckSquare,
  Check,
  CheckCircle2,
  Clock,
} from 'lucide-react-native';
import {
  ScreenContainer,
  BottomTabBar,
  Card,
} from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useElderly } from '@/context/ElderlyContext';
import { useVitals } from '@/context/VitalsContext';
import { useAlerts } from '@/context/AlertContext';
import { useCare } from '@/context/CareContext';
import {
  MOCK_ELDERLY_PERSON,
  MOCK_CAREGIVER,
  MOCK_CARE_ACTIVITIES,
  MOCK_USERS,
} from '@/services/mockData';

export default function CaregiverHomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { activeProfile } = useElderly();
  const { vitals } = useVitals();
  const { activeAlerts } = useAlerts();
  const { todayDoses, markDoseStatus } = useCare();

  const todayStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();

  const caregiverName = user?.name || MOCK_CAREGIVER.name;
  const caregiverFirstName = caregiverName.split(' ')[0];
  const caregiverInitials = caregiverName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const seniorPhoto = activeProfile?.imageUrl || undefined;
  const seniorName = activeProfile?.fullName || 'Patient';
  const seniorAge = activeProfile?.age || '';

  const hrValue = vitals.heartRate?.value || 72;
  const spo2Value = vitals.spo2?.value || 97;
  const tempValue = vitals.temperature?.value || 36.8;

  const handleCallParent = () => {
    const phone = activeProfile?.emergencyContacts?.[0]?.phone || MOCK_USERS.Tutor.phone || '+237671234567';
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const url = Platform.OS === 'ios' ? `telprompt:${cleanPhone}` : `tel:${cleanPhone}`;
    Linking.openURL(url).catch(() => {});
  };

  const handleCallDoctor = () => {
    const phone = activeProfile?.doctorPhone || MOCK_USERS.doctor.phone || '+237655891234';
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const url = Platform.OS === 'ios' ? `telprompt:${cleanPhone}` : `tel:${cleanPhone}`;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <ScreenContainer
      scrollable
      padded
      backgroundColor="#F0F4FA"
      bottomBar={<BottomTabBar activeTab="home" role="caregiver" />}
    >
      {/* ── 1. Top Header Bar (Matching Tutor Design System) ── */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.dateLabel}>{todayStr}</Text>
          <Text style={styles.greetingTitle}>Good morning, {caregiverFirstName} 👋</Text>
          <View style={styles.shiftPillRow}>
            <View style={styles.shiftGreenDot} />
            <Text style={styles.shiftPillText}>ON DUTY · {MOCK_CAREGIVER.shiftStart}–{MOCK_CAREGIVER.shiftEnd}</Text>
          </View>
        </View>

        <View style={styles.headerRightActions}>
          <TouchableOpacity
            onPress={() => router.push('/(caregiver)/alerts' as any)}
            style={styles.headerIconButton}
            activeOpacity={0.7}
          >
            <Bell size={18} color="#475569" />
            {activeAlerts.length > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{activeAlerts.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(caregiver)/settings' as any)}
            style={styles.avatarButton}
            activeOpacity={0.8}
          >
            <View style={styles.avatarInner}>
              <Text style={styles.avatarButtonText}>{caregiverInitials}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── 2. Senior Status Hero Emerald Gradient Card ──────── */}
      <TouchableOpacity
        onPress={() => router.push('/(caregiver)/profile' as any)}
        activeOpacity={0.92}
        style={styles.heroCardContainer}
      >
        <View style={styles.heroGreenGradient}>
          {/* Subtle Ambient Radial Glow */}
          <View style={styles.ambientGlow} />

          <View style={styles.heroTopRow}>
            {/* Senior Photo with Live Green Ring */}
            <View style={styles.avatarWrap}>
              <View style={styles.avatarHalo} />
              <Image
                source={typeof seniorPhoto === 'string' ? { uri: seniorPhoto } : seniorPhoto}
                style={styles.seniorAvatar}
              />
              <View style={styles.safeLiveDot} />
            </View>

            <View style={styles.heroMeta}>
              <Text style={styles.seniorNameText}>{seniorName}</Text>
              <Text style={styles.seniorSubText}>
                {seniorAge} years · {activeProfile?.address || 'Bastos, Yaoundé, Cameroon'}
              </Text>

              <View style={styles.heroBadgeRow}>
                <View style={styles.safeStatusPill}>
                  <View style={styles.greenDot} />
                  <Text style={styles.safeStatusText}>SAFE</Text>
                </View>

                <View style={styles.batteryPill}>
                  <View style={styles.cyanDot} />
                  <Text style={styles.batteryText}>84%</Text>
                </View>
              </View>
            </View>

            <ChevronRight size={20} color="rgba(255, 255, 255, 0.5)" />
          </View>

          {/* Mini Vitals 4-Col Grid (Matching Tutor Layout) */}
          <View style={styles.miniVitalsGrid}>
            <View style={styles.miniVitalCell}>
              <Text style={styles.miniVitalValue}>
                {hrValue}<Text style={styles.miniVitalUnit}>bpm</Text>
              </Text>
              <Text style={styles.miniVitalLabel}>HR</Text>
            </View>

            <View style={styles.miniVitalDivider} />

            <View style={styles.miniVitalCell}>
              <Text style={styles.miniVitalValue}>
                {spo2Value}<Text style={styles.miniVitalUnit}>%</Text>
              </Text>
              <Text style={styles.miniVitalLabel}>SpO₂</Text>
            </View>

            <View style={styles.miniVitalDivider} />

            <View style={styles.miniVitalCell}>
              <Text style={styles.miniVitalValue}>
                {tempValue}<Text style={styles.miniVitalUnit}>°C</Text>
              </Text>
              <Text style={styles.miniVitalLabel}>Temp</Text>
            </View>

            <View style={styles.miniVitalDivider} />

            <View style={styles.miniVitalCell}>
              <Text style={styles.miniVitalValue}>1.2k</Text>
              <Text style={styles.miniVitalLabel}>Steps</Text>
            </View>
          </View>

          {/* Sync Timestamp Footer */}
          <View style={styles.heroFooterRow}>
            <RefreshCw size={11} color="rgba(255, 255, 255, 0.65)" />
            <Text style={styles.heroFooterText}>
              Live · Updated {vitals.lastSyncTime || '2 min ago'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* ── 3. Active Incident Notice Banner (if any alerts) ─── */}
      {activeAlerts.length > 0 && (
        <TouchableOpacity
          onPress={() => router.push('/(caregiver)/alerts' as any)}
          activeOpacity={0.85}
          style={{ marginBottom: 18 }}
        >
          <Card style={styles.activeNoticeCard}>
            <View style={styles.noticeIconWrap}>
              <AlertTriangle size={18} color="#EA580C" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.noticeTitle}>{activeAlerts[0]?.title || 'Elevated heart rate detected'}</Text>
              <Text style={styles.noticeDesc}>
                {activeAlerts[0]?.description || 'Check vitals and confirm senior condition'}
              </Text>
            </View>
            <ChevronRight size={16} color="#FB923C" />
          </Card>
        </TouchableOpacity>
      )}

      {/* ── 4. Quick Actions (4-Button Grid Matching Tutor) ─── */}
      <View style={styles.sectionWrap}>
        <Text style={styles.sectionOverline}>QUICK ACTIONS</Text>
        <View style={styles.quickActionsGrid}>
          {[
            {
              icon: MapPin,
              label: 'Location',
              route: '/(caregiver)/location',
              color: '#3C6FDB',
              bg: '#EEF5FF',
            },
            {
              icon: Bell,
              label: 'Alerts',
              route: '/(caregiver)/alerts',
              color: '#F97316',
              bg: '#FFF7ED',
            },
            {
              icon: CheckSquare,
              label: 'Care Tasks',
              route: '/(caregiver)/care',
              color: '#16A34A',
              bg: '#F0FDF4',
            },
            {
              icon: Phone,
              label: 'Call Family',
              action: handleCallParent,
              color: '#EF4444',
              bg: '#FEF2F2',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.label}
                onPress={() => (item.action ? item.action() : router.push(item.route as any))}
                style={styles.quickActionBtn}
                activeOpacity={0.82}
              >
                <View style={[styles.quickActionIconWrap, { backgroundColor: item.bg }]}>
                  <Icon size={20} color={item.color} />
                </View>
                <Text style={styles.quickActionLabel}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── 5. Live Vitals (2x2 Grid Matching Tutor) ───────── */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionOverline}>LIVE VITALS</Text>
          <TouchableOpacity
            onPress={() => router.push('/(caregiver)/alerts' as any)}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionActionText}>Alert logs →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.vitals2ColGrid}>
          {/* Row 1 */}
          <View style={styles.vitalsRow}>
            <Card style={[styles.vitalCardItem]}>
              <View style={[styles.vitalAccentBar, { backgroundColor: '#10B981' }]} />
              <View style={styles.vitalCardInner}>
                <View style={styles.vitalCardHeader}>
                  <View style={[styles.vitalIconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
                    <Heart size={14} color="#10B981" />
                  </View>
                  <Text style={styles.vitalTypeLabel}>HEART RATE</Text>
                  <View style={styles.cyanLiveDot} />
                </View>
                <View style={styles.vitalValueRow}>
                  <Text style={styles.vitalValueText}>{hrValue}</Text>
                  <Text style={styles.vitalUnitText}> bpm</Text>
                </View>
                <View style={styles.vitalStatusRow}>
                  <View style={[styles.statusDotSmall, { backgroundColor: '#10B981' }]} />
                  <Text style={[styles.vitalStatusText, { color: '#10B981' }]}>Safe</Text>
                </View>
              </View>
            </Card>
            <Card style={[styles.vitalCardItem]}>
              <View style={[styles.vitalAccentBar, { backgroundColor: '#10B981' }]} />
              <View style={styles.vitalCardInner}>
                <View style={styles.vitalCardHeader}>
                  <View style={[styles.vitalIconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
                    <Activity size={14} color="#10B981" />
                  </View>
                  <Text style={styles.vitalTypeLabel}>SPO{'\u2082'} OXYGEN</Text>
                  <View style={styles.cyanLiveDot} />
                </View>
                <View style={styles.vitalValueRow}>
                  <Text style={styles.vitalValueText}>{spo2Value}</Text>
                  <Text style={styles.vitalUnitText}> %</Text>
                </View>
                <View style={styles.vitalStatusRow}>
                  <View style={[styles.statusDotSmall, { backgroundColor: '#10B981' }]} />
                  <Text style={[styles.vitalStatusText, { color: '#10B981' }]}>Safe</Text>
                </View>
              </View>
            </Card>
          </View>
          {/* Row 2 */}
          <View style={styles.vitalsRow}>
            <Card style={[styles.vitalCardItem]}>
              <View style={[styles.vitalAccentBar, { backgroundColor: '#10B981' }]} />
              <View style={styles.vitalCardInner}>
                <View style={styles.vitalCardHeader}>
                  <View style={[styles.vitalIconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
                    <Thermometer size={14} color="#10B981" />
                  </View>
                  <Text style={styles.vitalTypeLabel}>TEMPERATURE</Text>
                  <View style={styles.cyanLiveDot} />
                </View>
                <View style={styles.vitalValueRow}>
                  <Text style={styles.vitalValueText}>{tempValue}</Text>
                  <Text style={styles.vitalUnitText}> {'\u00b0'}C</Text>
                </View>
                <View style={styles.vitalStatusRow}>
                  <View style={[styles.statusDotSmall, { backgroundColor: '#10B981' }]} />
                  <Text style={[styles.vitalStatusText, { color: '#10B981' }]}>Safe</Text>
                </View>
              </View>
            </Card>
            <Card style={[styles.vitalCardItem]}>
              <View style={[styles.vitalAccentBar, { backgroundColor: '#16A34A' }]} />
              <View style={styles.vitalCardInner}>
                <View style={styles.vitalCardHeader}>
                  <View style={[styles.vitalIconWrap, { backgroundColor: 'rgba(22, 163, 74, 0.12)' }]}>
                    <Activity size={14} color="#16A34A" />
                  </View>
                  <Text style={styles.vitalTypeLabel}>ACTIVITY</Text>
                </View>
                <View style={styles.vitalValueRow}>
                  <Text style={[styles.vitalValueText, { fontSize: 20 }]}>Resting</Text>
                </View>
                <Text style={styles.stepsSubText}>1,247 steps today</Text>
              </View>
            </Card>
          </View>
        </View>
        </View>
      </View>

      {/* ── 5.5 Medication Schedule & Quick Administration ── */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeaderRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Pill size={14} color="#7C3AED" />
            <Text style={styles.sectionOverline}>MEDICATIONS TO ADMINISTER</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(caregiver)/care' as any)}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionActionText}>View all →</Text>
          </TouchableOpacity>
        </View>

        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {todayDoses.map((dose, idx) => {
            const isDone = dose.status === 'taken';
            return (
              <View
                key={dose.id}
                style={[
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 14,
                    borderBottomWidth: idx === todayDoses.length - 1 ? 0 : 1,
                    borderBottomColor: '#F1F5F9',
                    gap: 12,
                  },
                ]}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isDone ? '#F0FDF4' : '#F5F3FF',
                  }}
                >
                  {isDone ? (
                    <CheckCircle2 size={18} color="#16A34A" />
                  ) : (
                    <Clock size={18} color="#7C3AED" />
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#0F172A' }}>
                      {dose.medicationName}
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: '700',
                        color: '#7C3AED',
                        backgroundColor: '#F5F3FF',
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 6,
                      }}
                    >
                      {dose.scheduledTime}
                    </Text>
                  </View>

                  <Text style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>
                    {dose.dosage}
                  </Text>

                  {isDone ? (
                    <Text style={{ fontSize: 10, fontWeight: '600', color: '#16A34A', marginTop: 2 }}>
                      ✓ Administered at {dose.loggedAt || '08:05 AM'}
                    </Text>
                  ) : null}
                </View>

                {!isDone ? (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                      backgroundColor: '#16A34A',
                      paddingHorizontal: 12,
                      paddingVertical: 7,
                      borderRadius: 8,
                    }}
                    onPress={() => {
                      markDoseStatus(dose.id, 'taken', caregiverName);
                    }}
                    activeOpacity={0.8}
                  >
                    <Check size={13} color="#FFFFFF" strokeWidth={3} />
                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#FFFFFF' }}>Done</Text>
                  </TouchableOpacity>
                ) : (
                  <View
                    style={{
                      backgroundColor: '#DCFCE7',
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 6,
                    }}
                  >
                    <Text style={{ fontSize: 10, fontWeight: '700', color: '#16A34A' }}>Taken</Text>
                  </View>
                )}
              </View>
            );
          })}
        </Card>
      </View>

      {/* ── 6. Care Team & Emergency Coordination ────────────── */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionOverline}>CARE TEAM CONTACTS</Text>
        </View>

        <View style={styles.contactsColumn}>
          {/* Family Manager Card */}
          <Card style={styles.contactCard}>
            <View style={[styles.contactIconWrap, { backgroundColor: '#EFF6FF' }]}>
              <Heart size={20} color="#2563EB" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactName}>{activeProfile?.emergencyContacts?.[0]?.name || 'Robert Ngu'}</Text>
              <Text style={styles.contactRole}>Son · Primary Family Manager</Text>
            </View>
            <TouchableOpacity
              style={[styles.callBtn, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}
              onPress={handleCallParent}
              activeOpacity={0.8}
            >
              <Phone size={15} color="#2563EB" />
              <Text style={[styles.callBtnText, { color: '#2563EB' }]}>Call</Text>
            </TouchableOpacity>
          </Card>

          {/* Attending Physician Card */}
          <Card style={styles.contactCard}>
            <View style={[styles.contactIconWrap, { backgroundColor: '#F5F3FF' }]}>
              <Stethoscope size={20} color="#7C3AED" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactName}>
                {activeProfile?.doctorName || 'Dr. Jean-Paul Mbarga'}
              </Text>
              <Text style={styles.contactRole}>
                {activeProfile?.doctorSpecialty || 'Cardiologie & Médecine Gériatrique'} · {activeProfile?.doctorHospital || 'Hôpital Central de Yaoundé'}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.callBtn, { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' }]}
              onPress={handleCallDoctor}
              activeOpacity={0.8}
            >
              <Phone size={15} color="#7C3AED" />
              <Text style={[styles.callBtnText, { color: '#7C3AED' }]}>Call</Text>
            </TouchableOpacity>
          </Card>
        </View>
      </View>

      {/* ── 7. Today's Programme (Matching Tutor Timeline Card) ── */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionOverline}>TODAY'S CARE SCHEDULE</Text>
          <TouchableOpacity
            onPress={() => router.push('/(caregiver)/care' as any)}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionActionText}>Full schedule →</Text>
          </TouchableOpacity>
        </View>

        <Card style={styles.programmeCard}>
          {[
            { id: 1, title: 'Light walk — garden', time: '10:30', done: true },
            { id: 2, title: 'Lunch & Hydration', time: '12:30', done: false, current: true },
            { id: 3, title: 'Midday medication (Metformin)', time: '13:00', done: false, isMed: true },
            { id: 4, title: 'Rest / Afternoon nap', time: '14:00', done: false },
          ].map((item, i) => (
            <View
              key={item.id}
              style={[
                styles.programmeRow,
                item.current && styles.programmeRowCurrent,
                i === 3 && { borderBottomWidth: 0 },
              ]}
            >
              <View
                style={[
                  styles.programmeDotCircle,
                  item.done
                    ? styles.programmeDotDone
                    : item.current
                    ? styles.programmeDotCurrent
                    : styles.programmeDotPending,
                ]}
              >
                {item.done ? (
                  <CheckCircle size={14} color="#16A34A" />
                ) : item.current ? (
                  <View style={styles.programmeCurrentRadio}>
                    <View style={styles.programmeCurrentRadioInner} />
                  </View>
                ) : (
                  <View style={styles.programmeDotInner} />
                )}
              </View>

              <View style={styles.programmeTextCol}>
                <Text
                  style={[
                    styles.programmeTitle,
                    item.done && styles.programmeTitleDone,
                    item.current && styles.programmeTitleCurrent,
                  ]}
                >
                  {item.title}
                </Text>
              </View>

              {item.isMed && (
                <Pill size={13} color="#C084FC" style={{ marginRight: 6 }} />
              )}

              <View style={styles.programmeTimeCol}>
                <Text
                  style={[
                    styles.programmeTimeText,
                    item.done && styles.programmeTitleDone,
                    item.current && styles.programmeTitleCurrent,
                  ]}
                >
                  {item.time}
                </Text>
              </View>
            </View>
          ))}
        </Card>
      </View>

      {/* ── 8. Recent Logged Care Activities ─────────────────── */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionOverline}>RECENT LOGGED ACTIVITIES</Text>
          <TouchableOpacity
            onPress={() => router.push('/(caregiver)/history' as any)}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionActionText}>History log →</Text>
          </TouchableOpacity>
        </View>

        <Card style={styles.cardZeroPadding}>
          {MOCK_CARE_ACTIVITIES.slice(0, 3).map((act, i) => (
            <View
              key={act.id}
              style={[styles.activityRow, i === 2 && { borderBottomWidth: 0 }]}
            >
              <View style={styles.activityIconCircle}>
                <CheckCircle size={15} color="#16A34A" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.activityTitle}>{act.title}</Text>
                <Text style={styles.activityNotes} numberOfLines={1}>
                  {act.duration ? `Completed in ${act.duration}` : act.notes}
                </Text>
              </View>
              <Text style={styles.activityTime}>{act.time}</Text>
            </View>
          ))}
        </Card>
      </View>

      <View style={{ height: Spacing.xl }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 12,
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  greetingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
    letterSpacing: -0.3,
  },
  shiftPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  shiftGreenDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#16A34A',
  },
  shiftPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
    letterSpacing: 0.3,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
  },
  avatarButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  heroCardContainer: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 6,
  },
  heroGreenGradient: {
    backgroundColor: '#16A34A',
    padding: 16,
    borderRadius: 24,
    position: 'relative',
  },
  ambientGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  avatarWrap: {
    position: 'relative',
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarHalo: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  seniorAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  safeLiveDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#22C55E',
    borderWidth: 2.5,
    borderColor: '#16A34A',
  },
  heroMeta: {
    flex: 1,
  },
  seniorNameText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  seniorSubText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
    marginTop: 2,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  safeStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  safeStatusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  batteryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  cyanDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00FBFB',
  },
  batteryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  miniVitalsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  miniVitalCell: {
    flex: 1,
    alignItems: 'center',
  },
  miniVitalDivider: {
    width: 1,
    height: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  miniVitalValue: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
  miniVitalUnit: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  miniVitalLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  heroFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 2,
  },
  heroFooterText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontWeight: '500',
  },
  activeNoticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FED7AA',
    backgroundColor: '#FFF7ED',
    borderRadius: 16,
  },
  noticeIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#9A3412',
  },
  noticeDesc: {
    fontSize: 12,
    color: '#C2410C',
    marginTop: 1,
  },
  sectionWrap: {
    marginBottom: 20,
  },
  sectionOverline: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16A34A',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  quickActionBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  quickActionIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  vitals2ColGrid: { flexDirection: 'column', gap: 12 },
  vitalsRow: { flexDirection: 'row', gap: 12 },
  vitalCardItem: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden', position: 'relative', padding: 0 },
  vitalAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3.5,
  },
  vitalCardInner: {
    padding: 12,
    paddingLeft: 14,
  },
  vitalCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  vitalIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vitalTypeLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    flex: 1,
  },
  cyanLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00FBFB',
  },
  vitalValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  vitalValueText: {
    fontSize: 25,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  vitalUnitText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  vitalStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  vitalStatusText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  stepsSubText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  contactsColumn: {
    gap: 10,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  contactIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  contactRole: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
  },
  callBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  programmeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
  },
  programmeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 10,
  },
  programmeRowCurrent: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  programmeDotCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  programmeDotDone: {
    backgroundColor: '#DCFCE7',
  },
  programmeDotCurrent: {
    backgroundColor: 'transparent',
  },
  programmeDotPending: {
    backgroundColor: '#F1F5F9',
  },
  programmeCurrentRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  programmeCurrentRadioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },
  programmeDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#94A3B8',
  },
  programmeTextCol: {
    flex: 1,
  },
  programmeTitle: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#1E293B',
  },
  programmeTitleDone: {
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  programmeTitleCurrent: {
    color: '#15803D',
    fontWeight: '700',
  },
  programmeTimeCol: {
    alignItems: 'flex-end',
  },
  programmeTimeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  cardZeroPadding: {
    padding: 0,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  activityIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityTitle: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  activityNotes: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  activityTime: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#94A3B8',
  },
});
