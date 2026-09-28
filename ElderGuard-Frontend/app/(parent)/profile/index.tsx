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
        onBack={() => (router.canGoBack() ? router.back() : router.replace('/(parent)' as any))}
        right={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TouchableOpacity
              onPress={() => router.push('/(parent)/settings' as any)}
              style={styles.headerIconBtn}
              activeOpacity={0.7}
            >
              <Settings size={17} color="#475569" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/(parent)/profile/edit' as any)}
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

          
          {/* We removed the hardcoded 3-col clinical specs (height, weight) because they aren't collected during creation */}
        </View>
      </Card>

      {/* Home Address Card */}
      <Card style={styles.addressCard}>
        <View style={styles.addressIconWrap}>
          <MapPin size={18} color={Colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.addressHeading}>Home Address</Text>
          <Text style={styles.addressText}>{activeProfile?.address || 'No Address Provided'}</Text>
          {activeProfile?.address ? <Text style={styles.roomText}>Primary Residence</Text> : null}
        </View>
      </Card>

      {/* Medical Conditions */}
      {activeProfile?.medicalInfo?.chronicConditions && activeProfile.medicalInfo.chronicConditions.length > 0 && activeProfile.medicalInfo.chronicConditions[0] !== '' && (
        <Card style={styles.conditionsCard}>
          <Text style={styles.cardHeading}>Medical Information</Text>
          <View style={styles.conditionsList}>
            {activeProfile.medicalInfo.chronicConditions.map((cond, i) => (
              <View key={i} style={styles.conditionRow}>
                <View style={styles.conditionRedDot} />
                <Text style={styles.conditionText}>{cond}</Text>
              </View>
            ))}
          </View>
        </Card>
      )}

      {/* Real Emergency Contact */}
      <View style={styles.sectionWrap}>
        <SectionHeader title="Emergency Contact" />
        <Card style={styles.cardZeroPadding}>
          <View style={[styles.contactRow, { borderBottomWidth: 0 }]}>
            <View style={[styles.contactInitials, { backgroundColor: Colors.primaryFaded || '#3C6FDB18' }]}>
              <Text style={[styles.contactInitialsText, { color: Colors.primary }]}>
                EC
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactName}>Primary Emergency Contact</Text>
              <Text style={styles.contactRole}>Designated Number</Text>
              <Text style={styles.contactPhone}>{activeProfile?.phone || 'Not Set'}</Text>
            </View>

            {activeProfile?.phone ? (
              <TouchableOpacity
                onPress={() => handleCall(activeProfile.phone)}
                style={styles.callCircleBtn}
                activeOpacity={0.7}
              >
                <Phone size={16} color={Colors.primary} />
              </TouchableOpacity>
            ) : null}
          </View>
        </Card>
      </View>

      {/* Assigned Caregiver & Doctor */}
      <View style={styles.sectionWrap}>
        <SectionHeader title="Assigned Personnel" />
        <Card style={styles.cardZeroPadding}>
          <View style={styles.contactRow}>
            <View style={[styles.contactInitials, { backgroundColor: '#16A34A18' }]}>
              <Text style={[styles.contactInitialsText, { color: '#16A34A' }]}>
                CG
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactName}>{activeProfile?.primaryCaregiverName || 'No Caregiver Assigned'}</Text>
              <Text style={styles.contactRole}>Primary Caregiver</Text>
            </View>
          </View>
          <View style={[styles.contactRow, { borderBottomWidth: 0 }]}>
            <View style={[styles.contactInitials, { backgroundColor: '#8B5CF618' }]}>
              <Text style={[styles.contactInitialsText, { color: '#8B5CF6' }]}>
                DR
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactName}>{activeProfile?.doctorName || 'No Doctor Assigned'}</Text>
              <Text style={styles.contactRole}>Attending Physician</Text>
              {activeProfile?.doctorPhone ? (
                <Text style={styles.contactPhone}>{activeProfile.doctorPhone}</Text>
              ) : null}
            </View>
          </View>
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
              <Text style={styles.accountRole}>Family Manager (parent)</Text>
            </View>
          </View>

          <View style={styles.accountActionsRow}>
            <TouchableOpacity
              style={styles.accountSettingsBtn}
              onPress={() => router.push('/(parent)/settings' as any)}
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
