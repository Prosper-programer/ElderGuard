import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Check,
  Phone,
  Smartphone,
  MessageSquare,
  PhoneCall,
  CheckSquare,
  ClipboardCheck,
} from 'lucide-react-native';
import { useElderly } from '@/context/ElderlyContext';

export default function DoctorStatusScreen() {
  const router = useRouter();
  const { activeProfile } = useElderly();

  const doctorName = activeProfile?.doctorName || 'Dr. Jean-Paul Mbarga';
  const doctorSpecialty = activeProfile?.doctorSpecialty || 'Cardiologie & Médecine Gériatrique';
  const doctorHospital = activeProfile?.doctorHospital || 'Hôpital Central de Yaoundé';
  const doctorPhone = activeProfile?.doctorPhone || '+237 655 89 12 34';
  const doctorInitials = doctorName
    .replace('Dr.', '')
    .trim()
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'JM';

  const handleCallDoctor = () => {
    const cleanPhone = doctorPhone.replace(/[^\d+]/g, '');
    Linking.openURL(`tel:${cleanPhone}`).catch(() => {
      Alert.alert(
        `Call ${doctorName}`,
        `Direct line: ${doctorPhone} (${doctorHospital})`
      );
    });
  };

  const timelineEvents = [
    {
      id: '1',
      icon: Smartphone,
      iconBg: '#EEF2FF',
      iconColor: '#4F46E5',
      title: `Push notification to ${doctorName}`,
      time: '10:15:03 AM',
    },
    {
      id: '2',
      icon: MessageSquare,
      iconBg: '#F3E8FF',
      iconColor: '#9333EA',
      title: 'SMS: "URGENCE — Chute détectée à Bastos Yaoundé. FC 108 bpm. Prière d\'intervenir."',
      time: '10:15:05 AM',
    },
    {
      id: '3',
      icon: PhoneCall,
      iconBg: '#FEE2E2',
      iconColor: '#EF4444',
      title: 'Auto-call to +237 655 89 12 34',
      time: '10:15:08 AM',
    },
    {
      id: '4',
      icon: CheckSquare,
      iconBg: '#DCFCE7',
      iconColor: '#16A34A',
      title: 'Call answered · Duration 2m 14s',
      time: '10:17:22 AM',
    },
    {
      id: '5',
      icon: ClipboardCheck,
      iconBg: '#FEF3C7',
      iconColor: '#D97706',
      title: 'Dr. Jean-Paul Mbarga confirmed: will visit within 2 hours',
      time: '10:17:45 AM',
    },
  ];

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F4FA" />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Doctor Notified</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.greenIconContainer}>
            <View style={styles.greenCircle}>
              <Check size={26} color="#16A34A" strokeWidth={2.5} />
            </View>
          </View>
          <Text style={styles.statusOverline}>NOTIFICATION STATUS</Text>
          <Text style={styles.statusHeadline}>Doctor Notified</Text>
          <Text style={styles.statusSubtitle}>
            {doctorName} has been successfully notified.
          </Text>
        </View>

        {/* Doctor Contact Card */}
        <View style={styles.doctorCard}>
          <View style={styles.doctorInfoRow}>
            <View style={styles.doctorAvatar}>
              <Text style={styles.doctorAvatarText}>{doctorInitials}</Text>
            </View>
            <View style={styles.doctorDetails}>
              <Text style={styles.doctorName}>{doctorName}</Text>
              <Text style={styles.doctorSpecialty}>{doctorSpecialty}</Text>
              <Text style={styles.doctorHospital}>{doctorHospital}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.callDoctorBtn}
            onPress={handleCallDoctor}
            activeOpacity={0.88}
          >
            <Phone size={18} color="#FFFFFF" />
            <Text style={styles.callDoctorBtnText}>Call {doctorPhone}</Text>
          </TouchableOpacity>
        </View>

        {/* Notification Timeline */}
        <Text style={styles.sectionHeading}>NOTIFICATION TIMELINE</Text>
        <View style={styles.timelineCard}>
          {timelineEvents.map((item, idx) => {
            const Icon = item.icon;
            const isLast = idx === timelineEvents.length - 1;

            return (
              <View
                key={item.id}
                style={[
                  styles.timelineRow,
                  !isLast && styles.timelineRowBorder,
                ]}
              >
                <View style={[styles.eventIconBox, { backgroundColor: item.iconBg }]}>
                  <Icon size={18} color={item.iconColor} />
                </View>

                <View style={styles.eventTextBox}>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  <Text style={styles.eventTime}>{item.time}</Text>
                </View>

                <View style={styles.checkWrap}>
                  <Check size={16} color="#16A34A" strokeWidth={2.5} />
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F0F4FA',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  greenIconContainer: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  greenCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusOverline: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#94A3B8',
    marginBottom: 6,
  },
  statusHeadline: {
    fontSize: 22,
    fontWeight: '800',
    color: '#15803D',
    marginBottom: 8,
  },
  statusSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  doctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  doctorInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 14,
  },
  doctorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorAvatarText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  doctorSpecialty: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  doctorHospital: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 1,
  },
  callDoctorBtn: {
    backgroundColor: '#16A34A',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  callDoctorBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#94A3B8',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    gap: 12,
  },
  timelineRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  eventIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  eventTextBox: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    lineHeight: 18,
  },
  eventTime: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },
  checkWrap: {
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
