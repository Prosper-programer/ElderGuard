import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Bell,
  ChevronRight,
  MapPin,
  Shield,
  Pill,
  Heart,
  Activity,
  Thermometer,
  CheckCircle,
  RefreshCw,
  Clock,
  AlertTriangle,
  UserPlus,
  Plus,
  HeartHandshake,
  ShieldAlert,
} from 'lucide-react-native';
import {
  ScreenContainer,
  BottomTabBar,
  Card,
  SectionHeader,
} from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useElderly } from '@/context/ElderlyContext';
import { useVitals } from '@/context/VitalsContext';
import { useAlerts } from '@/context/AlertContext';
import {
  MOCK_ELDERLY_PERSON,
  MOCK_PROGRAMME,
} from '@/services/mockData';

export default function ParentDashboardScreen() {
  const router = useRouter();
  const { user, isAccountActive, accountStatus } = useAuth();
  const { activeProfile, hasSenior, hasCaregiver, assignedCaregiverName } = useElderly();
  const { vitals } = useVitals();
  const { activeAlerts } = useAlerts();

  const [justReactivated, setJustReactivated] = React.useState(false);
  const prevStatusRef = React.useRef(accountStatus);

  React.useEffect(() => {
    if (prevStatusRef.current === 'inactive' && accountStatus === 'active') {
      setJustReactivated(true);
      const timer = setTimeout(() => setJustReactivated(false), 5000);
      return () => clearTimeout(timer);
    }
    prevStatusRef.current = accountStatus;
  }, [accountStatus]);

  const isDeactivated = accountStatus === 'inactive' || user?.status === 'inactive';

  const parentFirstName = user?.name ? user.name.split(' ')[0] : 'Robert';
  const userInitials = (user?.name || 'Robert Thompson')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const seniorName = activeProfile?.fullName || 'Patient';
  const seniorAge = activeProfile?.age || '';
  const seniorPhoto = activeProfile?.imageUrl || undefined;

  return (
    <ScreenContainer
      scrollable
      padded
      backgroundColor="#F0F4FA"
      bottomBar={<BottomTabBar activeTab="home" role="parent" />}
    >
      {/* ── 1. Top Header Bar ───────────────────────────────── */}
      <View style={styles.topHeader}>
        <View>
          <View style={styles.dateStatusRow}>
            <Text style={styles.dateLabel}>THU, 10 SEPT 2026</Text>
            {isDeactivated ? (
              <View style={styles.headerInactiveBadge}>
                <View style={styles.inactivePulseDot} />
                <Text style={styles.headerInactiveBadgeText}>SUSPENDED</Text>
              </View>
            ) : (
              <View style={styles.headerActiveBadge}>
                <View style={styles.activePulseDot} />
                <Text style={styles.headerActiveBadgeText}>ACTIVE</Text>
              </View>
            )}
          </View>
          <Text style={styles.greetingTitle}>Good morning, {parentFirstName} 👋</Text>
        </View>

        <View style={styles.headerRightActions}>
          <TouchableOpacity
            onPress={() => router.push('/(parent)/alerts' as any)}
            style={styles.headerIconButton}
            activeOpacity={0.7}
          >
            <Bell size={18} color="#475569" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>2</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(parent)/settings' as any)}
            style={styles.avatarButton}
            activeOpacity={0.8}
          >
            <View style={styles.avatarInner}>
              <Text style={styles.avatarButtonText}>{userInitials}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Real-Time Account Deactivated Alert Card ─────────── */}
      {isDeactivated && (
        <Card style={styles.deactivatedCard}>
          <View style={styles.deactivatedHeaderRow}>
            <View style={styles.deactivatedBadge}>
              <View style={styles.deactivatedDotPulse} />
              <Text style={styles.deactivatedBadgeText}>ACCOUNT SUSPENDED</Text>
            </View>
            <View style={styles.liveSyncBadge}>
              <RefreshCw size={10} color="#DC2626" />
              <Text style={styles.liveSyncText}>Live Admin Status</Text>
            </View>
          </View>

          <View style={styles.deactivatedContentRow}>
            <View style={styles.deactivatedIconWrap}>
              <ShieldAlert size={26} color="#DC2626" />
            </View>
            <View style={styles.deactivatedTextWrap}>
              <Text style={styles.deactivatedTitle}>Account Deactivated by Administrator</Text>
              <Text style={styles.deactivatedMessage}>
                Your Tutor account has been deactivated by a platform administrator. Live emergency escalations, sensor telemetry, and modifying actions are currently paused.
              </Text>
            </View>
          </View>

          <View style={styles.restrictionsBox}>
            <View style={styles.restrictionItem}>
              <Text style={styles.restrictionBullet}>🔒</Text>
              <Text style={styles.restrictionText}>Profile edits & new senior additions locked</Text>
            </View>
            <View style={styles.restrictionItem}>
              <Text style={styles.restrictionBullet}>⏸️</Text>
              <Text style={styles.restrictionText}>Live fall detection & vitals telemetry paused</Text>
            </View>
            <View style={styles.restrictionItem}>
              <Text style={styles.restrictionBullet}>🛡️</Text>
              <Text style={styles.restrictionText}>Access restored immediately in real-time when re-activated</Text>
            </View>
          </View>

          <View style={styles.deactivatedActionsRow}>
            <TouchableOpacity
              style={styles.contactAdminBtn}
              activeOpacity={0.85}
              onPress={() => {
                Linking.openURL(
                  `mailto:support@GUYNOVA GUARD.com?subject=GUYNOVA GUARD%20Account%20Reactivation%20Request%20(${encodeURIComponent(user?.email || 'Tutor')})&body=Hello%20Administrator,%0D%0A%0D%0AMy%20GUYNOVA GUARD%20account%20(ID:%20${user?.id},%20Email:%20${user?.email})%20is%20currently%20deactivated.%20Please%20review%20and%20reactivate%20my%20account%20access.%0D%0A%0D%0AThank%20you.`
                ).catch(() => {
                  Alert.alert(
                    'Contact Administrator',
                    'Please email support@GUYNOVA GUARD.com with your account email (' +
                      (user?.email || 'your registered email') +
                      ') to request reactivation.'
                  );
                });
              }}
            >
              <Text style={styles.contactAdminBtnText}>Contact Administrator</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.viewStatusBtn}
              activeOpacity={0.7}
              onPress={() => {
                Alert.alert(
                  'Account Status: Deactivated',
                  `User: ${user?.name || 'Tutor'}\nEmail: ${user?.email || 'N/A'}\nStatus: Inactive\n\nWhen an administrator reactivates your account in the Admin Console, this dashboard will immediately unlock in real time without refreshing.`,
                  [{ text: 'OK' }]
                );
              }}
            >
              <Text style={styles.viewStatusBtnText}>Status Details</Text>
            </TouchableOpacity>
          </View>
        </Card>
      )}

      {/* ── Real-Time Account Reactivated Toast ─────────── */}
      {justReactivated && (
        <View style={styles.reactivatedToast}>
          <View style={styles.reactivatedIconWrap}>
            <CheckCircle size={18} color="#16A34A" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.reactivatedTitle}>Account Reactivated! 🎉</Text>
            <Text style={styles.reactivatedSub}>
              Full monitoring, emergency vitals dispatch, and permissions are now active in real time.
            </Text>
          </View>
        </View>
      )}

      {/* ── 2. Senior Status Hero / Onboarding Card ─────────── */}
      {!hasSenior ? (
        <Card style={styles.emptySeniorHeroCard}>
          <View style={styles.emptySeniorIconWrap}>
            <UserPlus size={24} color="#2563EB" />
          </View>
          <Text style={styles.emptySeniorTitle}>Welcome to GUYNOVA GUARD!</Text>
          <Text style={styles.emptySeniorSub}>
            You haven&apos;t added an Patient loved one yet. Create their profile to monitor vitals, track safe zones, and connect medical sensors.
          </Text>
          <TouchableOpacity
            style={styles.addSeniorHeroBtn}
            onPress={() => router.push('/(parent)/profile/create' as any)}
            activeOpacity={0.85}
          >
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.addSeniorHeroBtnText}>Add Patient Loved One</Text>
          </TouchableOpacity>
        </Card>
      ) : (
        <TouchableOpacity
          onPress={() => router.push('/(parent)/profile' as any)}
          activeOpacity={0.92}
          style={styles.heroCardContainer}
        >
          <View style={styles.heroCardGradient}>
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
                <Text style={styles.seniorSubText}>{seniorAge} years · London, SW1A</Text>

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

            {/* Mini Vitals 4-Col Grid */}
            <View style={styles.miniVitalsGrid}>
              <View style={styles.miniVitalCell}>
                <Text style={styles.miniVitalValue}>
                  72<Text style={styles.miniVitalUnit}>bpm</Text>
                </Text>
                <Text style={styles.miniVitalLabel}>HR</Text>
              </View>

              <View style={styles.miniVitalDivider} />

              <View style={styles.miniVitalCell}>
                <Text style={styles.miniVitalValue}>
                  97<Text style={styles.miniVitalUnit}>%</Text>
                </Text>
                <Text style={styles.miniVitalLabel}>SpO₂</Text>
              </View>

              <View style={styles.miniVitalDivider} />

              <View style={styles.miniVitalCell}>
                <Text style={styles.miniVitalValue}>
                  36.8<Text style={styles.miniVitalUnit}>°C</Text>
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
              <Text style={styles.heroFooterText}>Live - Updated 2 min ago</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* ── 3. Quick Actions 4-Button Row ───────────────────── */}
      <View style={styles.sectionWrap}>
        <Text style={styles.sectionOverline}>QUICK ACTIONS</Text>
        <View style={styles.quickActionsGrid}>
          {[
            {
              icon: MapPin,
              label: 'Location',
              route: '/(parent)/location',
              color: '#3C6FDB',
              bg: '#EEF5FF',
            },
            {
              icon: Bell,
              label: 'Alerts',
              route: '/(parent)/alerts',
              color: '#F97316',
              bg: '#FFF7ED',
            },
            {
              icon: Pill,
              label: 'Programme',
              route: '/(parent)/care',
              color: '#16A34A',
              bg: '#F0FDF4',
            },
            {
              icon: Shield,
              label: 'Emergency',
              route: '/(parent)/emergency',
              color: '#EF4444',
              bg: '#FEF2F2',
            },
          ].map(({ icon: Icon, label, route, color, bg }) => (
            <TouchableOpacity
              key={label}
              onPress={() => router.push(route as any)}
              style={styles.quickActionBtn}
              activeOpacity={0.82}
            >
              <View style={[styles.quickActionIconWrap, { backgroundColor: bg }]}>
                <Icon size={20} color={color} />
              </View>
              <Text style={styles.quickActionLabel}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── 3.5. Assigned Caregiver Section ─────────────────── */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionOverline}>ASSIGNED CAREGIVER</Text>
          <TouchableOpacity
            onPress={() => router.push('/(parent)/caregivers/create' as any)}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionActionText}>+ Provision caregiver →</Text>
          </TouchableOpacity>
        </View>

        {hasCaregiver ? (
          <Card style={styles.caregiverActiveCard}>
            <View style={styles.caregiverIconBox}>
              <HeartHandshake size={20} color="#16A34A" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.caregiverActiveName}>
                {assignedCaregiverName || 'Sarah Mitchell'}
              </Text>
              <Text style={styles.caregiverActiveSub}>Active Shift · 08:00–20:00 · On Duty</Text>
            </View>
            <View style={styles.caregiverStatusPill}>
              <View style={styles.greenDot} />
              <Text style={styles.caregiverStatusText}>ON DUTY</Text>
            </View>
          </Card>
        ) : (
          <Card style={styles.noCaregiverCard}>
            <View style={styles.noCaregiverIconBox}>
              <ShieldAlert size={20} color="#D97706" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.noCaregiverTitle}>No Caregiver Assigned Yet</Text>
              <Text style={styles.noCaregiverSub}>
                Caregivers cannot sign up on their own. Provision their login credentials so they can sign in and record care activities.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.addCaregiverBtn}
              onPress={() => router.push('/(parent)/caregivers/create' as any)}
              activeOpacity={0.85}
            >
              <Plus size={14} color="#FFFFFF" />
              <Text style={styles.addCaregiverBtnText}>Add</Text>
            </TouchableOpacity>
          </Card>
        )}
      </View>

      {/* ── 4. Live Vitals Grid ─────────────────────────────── */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionOverline}>LIVE VITALS</Text>
          <TouchableOpacity
            onPress={() => router.push('/(parent)/health' as any)}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionActionText}>Full report →</Text>
          </TouchableOpacity>
        </View>

        {!hasSenior ? (
          <Card style={styles.emptyVitalsNoticeCard}>
            <Activity size={24} color="#94A3B8" />
            <Text style={styles.emptyVitalsNoticeTitle}>Vitals Telemetry Pending Setup</Text>
            <Text style={styles.emptyVitalsNoticeSub}>
              Add your Patient loved one and pair an GUYNOVA GUARD Smart Wearable to receive live heart rate, SpO₂, and body temperature readings.
            </Text>
          </Card>
        ) : (
          <View style={styles.vitals2ColGrid}>
          {/* Heart Rate */}
          <Card style={styles.vitalCardItem}>
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
                <Text style={styles.vitalValueText}>72</Text>
                <Text style={styles.vitalUnitText}> bpm</Text>
              </View>

              <View style={styles.vitalStatusRow}>
                <View style={[styles.statusDotSmall, { backgroundColor: '#10B981' }]} />
                <Text style={[styles.vitalStatusText, { color: '#10B981' }]}>Safe</Text>
              </View>
            </View>
          </Card>

          {/* Blood Oxygen */}
          <Card style={styles.vitalCardItem}>
            <View style={[styles.vitalAccentBar, { backgroundColor: '#10B981' }]} />
            <View style={styles.vitalCardInner}>
              <View style={styles.vitalCardHeader}>
                <View style={[styles.vitalIconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
                  <Activity size={14} color="#10B981" />
                </View>
                <Text style={styles.vitalTypeLabel}>SPO₂ OXYGEN</Text>
                <View style={styles.cyanLiveDot} />
              </View>

              <View style={styles.vitalValueRow}>
                <Text style={styles.vitalValueText}>97</Text>
                <Text style={styles.vitalUnitText}> %</Text>
              </View>

              <View style={styles.vitalStatusRow}>
                <View style={[styles.statusDotSmall, { backgroundColor: '#10B981' }]} />
                <Text style={[styles.vitalStatusText, { color: '#10B981' }]}>Safe</Text>
              </View>
            </View>
          </Card>

          {/* Body Temperature */}
          <Card style={styles.vitalCardItem}>
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
                <Text style={styles.vitalValueText}>36.8</Text>
                <Text style={styles.vitalUnitText}> °C</Text>
              </View>

              <View style={styles.vitalStatusRow}>
                <View style={[styles.statusDotSmall, { backgroundColor: '#10B981' }]} />
                <Text style={[styles.vitalStatusText, { color: '#10B981' }]}>Safe</Text>
              </View>
            </View>
          </Card>

          {/* Activity / Steps */}
          <Card style={styles.vitalCardItem}>
            <View style={[styles.vitalAccentBar, { backgroundColor: '#3C6FDB' }]} />
            <View style={styles.vitalCardInner}>
              <View style={styles.vitalCardHeader}>
                <View style={[styles.vitalIconWrap, { backgroundColor: 'rgba(60, 111, 219, 0.12)' }]}>
                  <Activity size={14} color="#3C6FDB" />
                </View>
                <Text style={styles.vitalTypeLabel}>ACTIVITY</Text>
              </View>

              <View style={styles.vitalValueRow}>
                <Text style={[styles.vitalValueText, { fontSize: 22 }]}>Resting</Text>
              </View>

              <Text style={styles.stepsSubText}>1,247 steps today</Text>
            </View>
          </Card>
        </View>
        )}
      </View>

      {/* ── 5. Today's Programme Preview ────────────────────── */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionOverline}>TODAY'S PROGRAMME</Text>
          <TouchableOpacity
            onPress={() => router.push('/(parent)/care' as any)}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionActionText}>Full view →</Text>
          </TouchableOpacity>
        </View>

        {!hasSenior ? (
          <Card style={styles.emptyVitalsNoticeCard}>
            <Pill size={24} color="#94A3B8" />
            <Text style={styles.emptyVitalsNoticeTitle}>No Programme Scheduled</Text>
            <Text style={styles.emptyVitalsNoticeSub}>
              Add your Patient loved one to configure medication schedules and daily activity routines.
            </Text>
          </Card>
        ) : (
          <Card style={styles.programmeCard}>
            {[
              { id: 1, title: 'Light walk — garden', time: '10:30', done: true },
              { id: 2, title: 'Lunch', time: '12:30', done: false, current: true },
              { id: 3, title: 'Midday medication', time: '13:00', done: false, isMed: true },
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
        )}
      </View>

      {/* ── 6. Recent Alerts Section ────────────────────────── */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionOverline}>RECENT ALERTS</Text>
          <TouchableOpacity
            onPress={() => router.push('/(parent)/alerts' as any)}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionActionText}>See all →</Text>
          </TouchableOpacity>
        </View>

        <Card style={styles.alertsCard}>
          {/* Alert 1 */}
          <View style={[styles.alertItemRow, styles.alertItemDivider]}>
            <View style={[styles.alertIconBox, { backgroundColor: '#FFF7ED', borderColor: '#FED7AA' }]}>
              <AlertTriangle size={18} color="#EA580C" />
            </View>
            <View style={styles.alertContentCol}>
              <View style={styles.alertTitleRow}>
                <Text style={styles.alertTitleText}>Elevated Heart Rate</Text>
                <CheckCircle size={16} color="#16A34A" />
              </View>
              <Text style={styles.alertDescText}>
                Heart rate reached 91 bpm during morning activity. Returned to normal within 12 minutes.
              </Text>
              <Text style={styles.alertTimeText}>Today · 09:32 AM</Text>
            </View>
          </View>

          {/* Alert 2 */}
          <View style={styles.alertItemRow}>
            <View style={[styles.alertIconBox, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
              <Activity size={18} color="#3C6FDB" />
            </View>
            <View style={styles.alertContentCol}>
              <View style={styles.alertTitleRow}>
                <Text style={styles.alertTitleText}>Morning Medication Taken</Text>
                <CheckCircle size={16} color="#16A34A" />
              </View>
              <Text style={styles.alertDescText}>
                Aspirin 100mg and Lisinopril 10mg confirmed taken at 08:07 AM.
              </Text>
              <Text style={styles.alertTimeText}>Today · 08:07 AM</Text>
            </View>
          </View>
        </Card>
      </View>
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
    backgroundColor: '#3C6FDB',
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
    shadowColor: '#3C6FDB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 6,
  },
  heroCardGradient: {
    backgroundColor: '#3C6FDB',
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
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
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
    backgroundColor: 'rgba(0, 251, 251, 0.25)',
  },
  seniorAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
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
    borderColor: '#3C6FDB',
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
    color: 'rgba(255, 255, 255, 0.65)',
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
    backgroundColor: 'rgba(34, 197, 94, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.4)',
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ADE80',
  },
  safeStatusText: {
    color: '#4ADE80',
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
    backgroundColor: 'rgba(0, 251, 251, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(0, 251, 251, 0.35)',
  },
  cyanDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00FBFB',
  },
  batteryText: {
    color: '#00FBFB',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  miniVitalsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  miniVitalValue: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
  miniVitalUnit: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  miniVitalLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
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
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 11,
    fontWeight: '500',
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
    color: '#3C6FDB',
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
  vitals2ColGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  vitalCardItem: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    position: 'relative',
    padding: 0,
  },
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
    backgroundColor: '#EFF6FF',
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
  programmeDotDone: {},
  programmeDotCurrent: {
    backgroundColor: 'rgba(60, 111, 219, 0.15)',
  },
  programmeDotPending: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  programmeDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  programmeTextCol: {
    flex: 1,
  },
  programmeTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  programmeTitleDone: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  programmeTitleCurrent: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  programmeCurrentTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3C6FDB',
    marginTop: 1,
  },
  programmeCurrentRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#3C6FDB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  programmeCurrentRadioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3C6FDB',
  },
  programmeTimeCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  programmeTimeText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
  },
  alertsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
  },
  alertItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    gap: 12,
  },
  alertItemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  alertIconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  alertContentCol: {
    flex: 1,
  },
  alertTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  alertTitleText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  alertDescText: {
    fontSize: 12,
    lineHeight: 17,
    color: '#64748B',
    marginBottom: 6,
  },
  alertTimeText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  emptySeniorHeroCard: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  emptySeniorIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptySeniorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  emptySeniorSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  addSeniorHeroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  addSeniorHeroBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  caregiverActiveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#16A34A',
  },
  caregiverIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  caregiverActiveName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  caregiverActiveSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  caregiverStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  caregiverStatusText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#15803D',
    letterSpacing: 0.5,
  },
  noCaregiverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderWidth: 1,
    borderRadius: 16,
  },
  noCaregiverIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noCaregiverTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  noCaregiverSub: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 2,
    lineHeight: 15,
  },
  addCaregiverBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D97706',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addCaregiverBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyVitalsNoticeCard: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyVitalsNoticeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 8,
    marginBottom: 4,
  },
  emptyVitalsNoticeSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 17,
  },

  // ── Real-Time Account Status Styles ─────────────────────────
  dateStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerInactiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  inactivePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  headerInactiveBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.5,
  },
  headerActiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  headerActiveBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#16A34A',
    letterSpacing: 0.5,
  },
  deactivatedCard: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
    borderWidth: 1.5,
    borderRadius: 18,
    padding: 16,
    marginBottom: Spacing.md,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  deactivatedDotPulse: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#DC2626',
  },
  deactivatedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#991B1B',
    letterSpacing: 0.5,
  },
  liveSyncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  liveSyncText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#DC2626',
  },
  deactivatedContentRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  deactivatedIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deactivatedTextWrap: {
    flex: 1,
  },
  deactivatedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#881337',
    marginBottom: 4,
  },
  deactivatedMessage: {
    fontSize: 12,
    color: '#9F1239',
    lineHeight: 17,
  },
  restrictionsBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    padding: 10,
    marginTop: 12,
    marginBottom: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#FFE4E6',
  },
  restrictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  restrictionBullet: {
    fontSize: 12,
  },
  restrictionText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#4C0519',
  },
  deactivatedActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
  },
  contactAdminBtn: {
    flex: 1,
    backgroundColor: '#DC2626',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  contactAdminBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  viewStatusBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECDD3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewStatusBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9F1239',
  },
  reactivatedToast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    borderRadius: 14,
    padding: 12,
    marginBottom: Spacing.md,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  reactivatedIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactivatedTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D',
  },
  reactivatedSub: {
    fontSize: 11,
    color: '#166534',
    marginTop: 2,
    lineHeight: 15,
  },
});

