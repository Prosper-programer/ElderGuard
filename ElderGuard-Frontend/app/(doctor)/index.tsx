import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Stethoscope,
  Heart,
  Activity,
  Shield,
  Phone,
  Pill,
  FileText,
  AlertTriangle,
  ChevronRight,
  LogOut,
  Clock,
  User,
  Users,
  CheckCircle2,
} from 'lucide-react-native';
import { Card, Button } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useElderly } from '@/context/ElderlyContext';
import { useVitals } from '@/context/VitalsContext';
import { useCare } from '@/context/CareContext';

export default function DoctorPortalScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { activeProfile, profiles } = useElderly();
  const { vitals } = useVitals();
  const { medications, todayDoses } = useCare();

  const doctorName = user?.name || activeProfile?.doctorName || 'Dr. Jean-Paul Mbarga';
  const doctorHospital = activeProfile?.doctorHospital || "St. Thomas' Hospital, London";
  const doctorSpecialty = activeProfile?.doctorSpecialty || 'Geriatric Medicine';

  const senior = activeProfile;
  const seniorName = senior?.fullName || 'Margaret Thompson';
  const seniorAge = senior?.age || 78;

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
      if (typeof window !== 'undefined' && window.confirm('Are you sure you want to sign out of your physician account?')) {
        doLogout();
      }
    } else {
      Alert.alert('Sign Out', 'Are you sure you want to sign out of your physician account?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: doLogout,
        },
      ]);
    }
  };

  const handleCall = (phone: string, name: string) => {
    const clean = phone.replace(/[^\d+]/g, '');
    Linking.openURL(`tel:${clean}`).catch(() => {
      Alert.alert(`Call ${name}`, `Direct line: ${phone}`);
    });
  };

  const takenMeds = todayDoses.filter((d) => d.status === 'taken').length;
  const adherence = todayDoses.length > 0 ? Math.round((takenMeds / todayDoses.length) * 100) : 100;

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F3FF" />

      {/* Top App Bar with Doctor Profile */}
      <View style={styles.header}>
        <View style={styles.doctorProfileRow}>
          <View style={styles.doctorAvatar}>
            <Text style={styles.doctorAvatarText}>
              {doctorName
                .replace('Dr.', '')
                .trim()
                .split(' ')
                .map((w) => w[0])
                .slice(0, 2)
                .join('')
                .toUpperCase() || 'JH'}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.roleTag}>
              <Stethoscope size={12} color="#7C3AED" />
              <Text style={styles.roleTagText}>ATTENDING PHYSICIAN</Text>
            </View>
            <Text style={styles.doctorName}>{doctorName}</Text>
            <Text style={styles.doctorHospital}>{doctorSpecialty} · {doctorHospital}</Text>
          </View>
          <TouchableOpacity
            onPress={handleSignOut}
            style={styles.signOutBtn}
            activeOpacity={0.7}
          >
            <LogOut size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Clinical Overview Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{profiles.length > 0 ? profiles.length : 1}</Text>
            <Text style={styles.statLabel}>Assigned Senior</Text>
          </View>
          <View style={[styles.statBox, { borderColor: '#BBF7D0', backgroundColor: '#F0FDF4' }]}>
            <Text style={[styles.statVal, { color: '#16A34A' }]}>Stable</Text>
            <Text style={styles.statLabel}>Clinical Status</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statVal, { color: '#2563EB' }]}>{adherence}%</Text>
            <Text style={styles.statLabel}>Rx Adherence</Text>
          </View>
        </View>

        {/* Section Heading */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ASSIGNED PATIENT ROSTER</Text>
          <Text style={styles.sectionMeta}>Real-time monitoring active</Text>
        </View>

        {/* Primary Senior Patient Card */}
        <Card style={styles.patientCard}>
          {/* Header Row */}
          <View style={styles.patientHeader}>
            <View style={styles.patientAvatarWrap}>
              <Image
                source={require('@/assets/images/elderly_margaret.jpg')}
                style={styles.patientAvatar}
              />
              <View style={styles.activeDot} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.patientName}>{seniorName}</Text>
              <Text style={styles.patientSub}>
                Female · Age {seniorAge} · Room 1, 42 Maple St.
              </Text>
              <View style={styles.conditionTags}>
                <View style={styles.conditionPill}>
                  <Text style={styles.conditionPillText}>Hypertension</Text>
                </View>
                <View style={styles.conditionPill}>
                  <Text style={styles.conditionPillText}>Type 2 Diabetes</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Vitals Telemetry Live Bar */}
          <View style={styles.vitalsBar}>
            <View style={styles.vitalMetric}>
              <View style={styles.vitalMetricTop}>
                <Heart size={14} color="#EF4444" />
                <Text style={styles.vitalMetricLabel}>Heart Rate</Text>
              </View>
              <Text style={styles.vitalMetricVal}>{vitals.heartRate?.value || 72} bpm</Text>
              <Text style={styles.vitalMetricStatus}>Normal Sinus</Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.vitalMetric}>
              <View style={styles.vitalMetricTop}>
                <Activity size={14} color="#2563EB" />
                <Text style={styles.vitalMetricLabel}>SpO2 Sat</Text>
              </View>
              <Text style={styles.vitalMetricVal}>{vitals.spo2?.value || 97}%</Text>
              <Text style={styles.vitalMetricStatus}>Optimal</Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.vitalMetric}>
              <View style={styles.vitalMetricTop}>
                <Clock size={14} color="#D97706" />
                <Text style={styles.vitalMetricLabel}>Temp</Text>
              </View>
              <Text style={styles.vitalMetricVal}>{vitals.temperature?.value || 36.8}°C</Text>
              <Text style={styles.vitalMetricStatus}>Normothermic</Text>
            </View>
          </View>

          {/* Connected Care Team */}
          <View style={styles.careTeamBox}>
            <Text style={styles.careTeamTitle}>COLLABORATING CARE TEAM</Text>
            <View style={styles.careTeamRow}>
              <View style={styles.memberInfo}>
                <User size={15} color="#2563EB" />
                <Text style={styles.memberName}>Robert Ngu (Son / Manager)</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleCall('+237 671 23 45 67', 'Robert Ngu')}
                style={styles.callSmallBtn}
                activeOpacity={0.7}
              >
                <Phone size={13} color="#2563EB" />
                <Text style={styles.callSmallBtnText}>Call</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.careTeamRow}>
              <View style={styles.memberInfo}>
                <Shield size={15} color="#16A34A" />
                <Text style={styles.memberName}>Amara Biya (Assigned Nurse)</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleCall('+237 699 45 23 10', 'Amara Biya')}
                style={[styles.callSmallBtn, { backgroundColor: '#F0FDF4' }]}
                activeOpacity={0.7}
              >
                <Phone size={13} color="#16A34A" />
                <Text style={[styles.callSmallBtnText, { color: '#16A34A' }]}>Call</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Doctor Actions */}
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => router.push('/(doctor)/telemetry' as any)}
              activeOpacity={0.8}
            >
              <Activity size={18} color="#7C3AED" />
              <Text style={styles.actionBtnText}>Vitals History</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => router.push('/(doctor)/prescriptions' as any)}
              activeOpacity={0.8}
            >
              <Pill size={18} color="#7C3AED" />
              <Text style={styles.actionBtnText}>Prescriptions</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => router.push('/(doctor)/notes' as any)}
              activeOpacity={0.8}
            >
              <FileText size={18} color="#7C3AED" />
              <Text style={styles.actionBtnText}>Clinical Notes</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Clinical Advisory Card */}
        <Card style={styles.advisoryCard}>
          <CheckCircle2 size={20} color="#7C3AED" />
          <View style={{ flex: 1 }}>
            <Text style={styles.advisoryHeadline}>No Telemetry Anomalies</Text>
            <Text style={styles.advisorySub}>
              All vital parameters are currently within baseline thresholds. ElderGuard wearable hardware is active and syncing every 60 seconds.
            </Text>
          </View>
        </Card>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#F5F3FF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDE9FE',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  doctorProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  doctorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorAvatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  roleTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: 0.5,
  },
  doctorName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  doctorHospital: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  signOutBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  sectionMeta: {
    fontSize: 11,
    color: '#16A34A',
    fontWeight: '600',
  },
  patientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientAvatarWrap: {
    position: 'relative',
  },
  patientAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  activeDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#16A34A',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  patientName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  patientSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  conditionTags: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  conditionPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  conditionPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  vitalsBar: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  vitalMetric: {
    flex: 1,
    alignItems: 'center',
  },
  vitalMetricTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  vitalMetricLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  vitalMetricVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  vitalMetricStatus: {
    fontSize: 10,
    fontWeight: '700',
    color: '#16A34A',
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
  },
  careTeamBox: {
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  careTeamTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  careTeamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  memberName: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  callSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  callSmallBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F5F3FF',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
  },
  advisoryCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#F5F3FF',
    borderColor: '#DDD6FE',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  advisoryHeadline: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7C3AED',
  },
  advisorySub: {
    fontSize: 12,
    color: '#6B21A8',
    marginTop: 2,
    lineHeight: 18,
  },
});
