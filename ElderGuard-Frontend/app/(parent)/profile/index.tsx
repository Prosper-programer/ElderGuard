import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Phone,
  Pencil,
  MapPin,
  Shield,
  Activity,
  User,
  Heart,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Battery,
  Wifi,
  CheckCircle,
  Settings,
  LogOut,
} from 'lucide-react-native';
import {
  ScreenContainer,
  Card,
  TopBar,
  StatusBadge,
  SectionHeader,
  Button,
} from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';
import { useElderly } from '@/context/ElderlyContext';
import { useAuth } from '@/context/AuthContext';
import {
  MOCK_ELDERLY_PERSON,
  MOCK_CAREGIVER,
  MOCK_DOCTOR,
  MOCK_USERS,
} from '@/services/mockData';

export default function ParentElderlyProfileScreen() {
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

  const handleCall = (phone?: string) => {
    if (!phone) return;
    Linking.openURL(`tel:${phone.replace(/[^0-9+]/g, '')}`).catch(() => {});
  };

  const name = activeProfile?.fullName || 'Patient';
  const age = activeProfile?.age || '';
  const dob = activeProfile?.dateOfBirth || '';
  const photo = activeProfile?.imageUrl;

  return (
    <ScreenContainer
      scrollable
      padded
      backgroundColor="#F0F4FA"
    >
      <TopBar
        title="Patient Profile"
        onBack={() => (router.canGoBack() ? router.back() : router.replace('/(Tutor)' as any))}
        right={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TouchableOpacity
              onPress={() => router.push('/(Tutor)/settings' as any)}
              style={styles.headerIconBtn}
              activeOpacity={0.7}
            >
              <Settings size={17} color="#475569" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/(Tutor)/profile/edit' as any)}
              style={styles.editBtn}
              activeOpacity={0.7}
            >
              <Pencil size={17} color="#475569" />
            </TouchableOpacity>
          </View>
        }
      />

      {/* Main Profile Card with Gradient Header Banner */}
      <Card style={styles.profileCard}>
        <View style={styles.gradientHeader} />

        <View style={styles.profileBody}>
          <View style={styles.avatarRow}>
            {photo ? (<Image source={typeof photo === 'string' ? { uri: photo } : photo} style={styles.avatarImage} />) : (<View style={[styles.avatarImage, { backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' }]}><Text style={{fontSize: 24, fontWeight: 'bold', color: '#64748B'}}>{name.slice(0, 2).toUpperCase()}</Text></View>)}
            <View style={styles.statusBadgeWrap}>
              <StatusBadge status="safe" size="md" />
            </View>
          </View>

          <Text style={styles.profileName}>{name}</Text>
          <Text style={styles.profileSub}>Born {dob} · {age} years old</Text>

          {/* 3-Col Clinical Specs */}
          <View style={styles.clinicalGrid}>
            <View style={styles.clinicalCell}>
              <Text style={styles.clinicalLabel}>BLOOD TYPE</Text>
              <Text style={styles.clinicalVal}>{MOCK_ELDERLY_PERSON.bloodType}</Text>
            </View>
            <View style={styles.clinicalDivider} />
            <View style={styles.clinicalCell}>
              <Text style={styles.clinicalLabel}>HEIGHT</Text>
              <Text style={styles.clinicalVal}>{MOCK_ELDERLY_PERSON.height}</Text>
            </View>
            <View style={styles.clinicalDivider} />
            <View style={styles.clinicalCell}>
              <Text style={styles.clinicalLabel}>WEIGHT</Text>
              <Text style={styles.clinicalVal}>{MOCK_ELDERLY_PERSON.weight}</Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Home Address Card */}
      <Card style={styles.addressCard}>
        <View style={styles.addressIconWrap}>
          <MapPin size={18} color={Colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.addressHeading}>Home Address</Text>
          <Text style={styles.addressText}>{MOCK_ELDERLY_PERSON.address}</Text>
          <Text style={styles.roomText}>{MOCK_ELDERLY_PERSON.room}</Text>
        </View>
      </Card>

      {/* Medical Conditions */}
      <Card style={styles.conditionsCard}>
        <Text style={styles.cardHeading}>Medical Conditions</Text>
        <View style={styles.conditionsList}>
          {MOCK_ELDERLY_PERSON.conditions.map((cond, i) => (
            <View key={i} style={styles.conditionRow}>
              <View style={styles.conditionRedDot} />
              <Text style={styles.conditionText}>{cond}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Known Allergies */}
      <Card style={styles.allergiesCard}>
        <Text style={styles.cardHeading}>Known Allergies</Text>
        <View style={styles.allergiesWrap}>
          {MOCK_ELDERLY_PERSON.allergies.map((all, i) => (
            <View key={i} style={styles.allergyPill}>
              <AlertTriangle size={12} color="#DC2626" />
              <Text style={styles.allergyText}>{all}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Emergency Contacts with One-Tap Dialers */}
      <View style={styles.sectionWrap}>
        <SectionHeader title="Emergency Contacts" />
        <Card style={styles.cardZeroPadding}>
          {[
            {
              name: MOCK_USERS.Tutor.name,
              role: 'Son · Primary Tutor',
              phone: MOCK_USERS.Tutor.phone,
              initials: 'RT',
              color: '#3C6FDB',
            },
            {
              name: MOCK_CAREGIVER.name,
              role: 'Assigned Caregiver · RN',
              phone: MOCK_CAREGIVER.phone,
              initials: 'SM',
              color: '#16A34A',
            },
            {
              name: MOCK_DOCTOR.name,
              role: 'Attending Physician · GP',
              phone: MOCK_DOCTOR.phone,
              initials: 'JH',
              color: '#8B5CF6',
            },
          ].map((c, i) => (
            <View
              key={c.name}
              style={[
                styles.contactRow,
                i === 2 && { borderBottomWidth: 0 },
              ]}
            >
              <View style={[styles.contactInitials, { backgroundColor: c.color + '18' }]}>
                <Text style={[styles.contactInitialsText, { color: c.color }]}>
                  {c.initials}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.contactName}>{c.name}</Text>
                <Text style={styles.contactRole}>{c.role}</Text>
                <Text style={styles.contactPhone}>{c.phone}</Text>
              </View>

              <TouchableOpacity
                onPress={() => handleCall(c.phone)}
                style={styles.callCircleBtn}
                activeOpacity={0.7}
              >
                <Phone size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </Card>
      </View>

      {/* Active Medications matching design */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionOverline}>ACTIVE MEDICATIONS</Text>
          <TouchableOpacity
            onPress={() => router.push('/(Tutor)/care' as any)}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionActionText}>Full list →</Text>
          </TouchableOpacity>
        </View>

        <Card style={styles.cardZeroPadding}>
          {[
            { name: 'Aspirin 100mg', time: 'Morning · 08:00', color: '#3C6FDB' },
            { name: 'Lisinopril 10mg', time: 'Morning · 08:00', color: '#16A34A' },
            { name: 'Metformin 500mg', time: 'After Lunch · 13:00', color: '#EA580C' },
          ].map((med, i) => (
            <View
              key={med.name}
              style={[
                styles.medicationRow,
                i === 2 && { borderBottomWidth: 0 },
              ]}
            >
              <View style={[styles.medDot, { backgroundColor: med.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.medNameText}>{med.name}</Text>
                <Text style={styles.medTimeText}>{med.time}</Text>
              </View>
              <CheckCircle size={17} color="#16A34A" />
            </View>
          ))}
        </Card>
      </View>

      {/* ── My Tutor Account & Session Card ────────────────── */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionOverline}>ACCOUNT & SESSION</Text>
        </View>

        <Card style={styles.accountCard}>
          <View style={styles.accountRow}>
            <View style={styles.accountAvatarBox}>
              <Text style={styles.accountAvatarText}>
                {(user?.name || 'Robert Thompson')
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.accountName}>{user?.name || 'Robert Thompson'}</Text>
              <Text style={styles.accountEmail}>{user?.email || 'robert.thompson@email.com'}</Text>
              <Text style={styles.accountRole}>Family Manager (Tutor)</Text>
            </View>
          </View>

          <View style={styles.accountActionsRow}>
            <TouchableOpacity
              style={styles.accountSettingsBtn}
              onPress={() => router.push('/(Tutor)/settings' as any)}
              activeOpacity={0.7}
            >
              <Settings size={15} color="#3C6FDB" />
              <Text style={styles.accountSettingsBtnText}>Settings & Preferences</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.accountSignOutBtn}
              onPress={handleSignOut}
              activeOpacity={0.7}
            >
              <LogOut size={15} color="#EF4444" />
              <Text style={styles.accountSignOutBtnText}>Sign out</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>

      <View style={{ height: Spacing.xl }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: 14,
  },
  gradientHeader: {
    height: 70,
    backgroundColor: '#3C6FDB',
  },
  profileBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    marginTop: -32,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  avatarImage: {
    width: 68,
    height: 68,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  statusBadgeWrap: {
    marginBottom: 4,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  profileSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  clinicalGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  clinicalCell: {
    flex: 1,
    alignItems: 'center',
  },
  clinicalDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  clinicalLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  clinicalVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 2,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    marginBottom: 14,
  },
  addressIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addressText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  roomText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  conditionsCard: {
    padding: 16,
    marginBottom: 14,
  },
  cardHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  conditionsList: {
    gap: 8,
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  conditionRedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  conditionText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  allergiesCard: {
    padding: 16,
    marginBottom: 14,
  },
  allergiesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  allergyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  allergyText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  sectionWrap: {
    marginBottom: 14,
  },
  cardZeroPadding: {
    padding: 0,
    overflow: 'hidden',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  contactInitials: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInitialsText: {
    fontSize: 14,
    fontWeight: '800',
  },
  contactName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  contactRole: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  contactPhone: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 2,
  },
  callCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  deviceIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  deviceSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionOverline: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  sectionActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3C6FDB',
  },
  medicationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    gap: 12,
  },
  medDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  medNameText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  medTimeText: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  accountAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3C6FDB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountAvatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  accountName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  accountEmail: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  accountRole: {
    fontSize: 11,
    color: '#3C6FDB',
    fontWeight: '600',
    marginTop: 2,
  },
  accountActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  accountSettingsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(60, 111, 219, 0.08)',
  },
  accountSettingsBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3C6FDB',
  },
  accountSignOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
  },
  accountSignOutBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
  },
});
