import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  useWindowDimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  User,
  Calendar,
  Shield,
  Eye,
  History,
  BarChart2,
  Brain,
  Bluetooth,
  Settings,
  X,
  Sparkles,
  ArrowRight,
  Users,
  Stethoscope,
} from 'lucide-react-native';
import { BottomTabBar } from '@/components/ui';

export default function ParentMoreScreen() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const [aiModalVisible, setAiModalVisible] = useState(false);

  // 3 columns: screenWidth - horizontal padding (32) - 2 gaps (24) divided by 3
  const cardWidth = Math.floor((screenWidth - 32 - 24) / 3);

  const menuItems = [
    {
      id: 'profile',
      title: "Margaret's\nProfile",
      icon: User,
      iconColor: '#0284C7',
      iconBg: '#E0F2FE',
      onPress: () => router.push('/(Tutor)/profile' as any),
    },
    {
      id: 'daily_programme',
      title: 'Daily\nProgramme',
      icon: Calendar,
      iconColor: '#16A34A',
      iconBg: '#DCFCE7',
      onPress: () => router.push('/(Tutor)/care' as any),
    },
    {
      id: 'geofencing',
      title: 'Geofencing',
      icon: Shield,
      iconColor: '#9333EA',
      iconBg: '#F3E8FF',
      onPress: () => router.push('/(Tutor)/geofencing' as any),
    },
    {
      id: 'manage_caregivers',
      title: 'Caregivers',
      icon: Users,
      iconColor: '#0284C7',
      iconBg: '#E0F2FE',
      onPress: () => router.push('/(Tutor)/caregivers' as any),
    },
    {
      id: 'manage_doctors',
      title: 'Doctors',
      icon: Stethoscope,
      iconColor: '#059669',
      iconBg: '#D1FAE5',
      onPress: () => router.push('/(Tutor)/doctors' as any),
    },
    {
      id: 'history',
      title: 'History',
      icon: History,
      iconColor: '#475569',
      iconBg: '#F1F5F9',
      onPress: () => router.push('/(Tutor)/history' as any),
    },
    {
      id: 'reports',
      title: 'Reports',
      icon: BarChart2,
      iconColor: '#EA580C',
      iconBg: '#FFEDD5',
      onPress: () => router.push('/(Tutor)/reports' as any),
    },
    {
      id: 'ai_insights',
      title: 'AI Insights',
      icon: Brain,
      iconColor: '#A855F7',
      iconBg: '#F3E8FF',
      onPress: () => router.push('/(Tutor)/ai-insights' as any),
    },
    {
      id: 'device_status',
      title: 'Device Status',
      icon: Bluetooth,
      iconColor: '#06B6D4',
      iconBg: '#E0F2FE',
      onPress: () => router.push('/(Tutor)/device' as any),
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings,
      iconColor: '#64748B',
      iconBg: '#F1F5F9',
      onPress: () => router.push('/(Tutor)/settings' as any),
    },
  ];

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F4FA" />

      {/* Screen Title */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>More</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 3x3 Grid of Menu Cards */}
        <View style={styles.gridContainer}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, { width: cardWidth, minHeight: cardWidth * 1.15 }]}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
                  <Icon size={24} color={item.iconColor} strokeWidth={2.2} />
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* AI Insights Modal */}
      <Modal
        visible={aiModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAiModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconWrap}>
                <Sparkles size={20} color="#A855F7" />
              </View>
              <Text style={styles.modalTitle}>GUYNOVA GUARD AI Insights</Text>
              <TouchableOpacity
                onPress={() => setAiModalVisible(false)}
                style={styles.closeModalBtn}
              >
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.insightBox}>
              <Text style={styles.insightBadge}>CLINICAL OBSERVATION</Text>
              <Text style={styles.insightHeading}>Gait & Stability Analysis</Text>
              <Text style={styles.insightBody}>
                Margaret&apos;s stride cadence decreased by 8% over the past 48 hours. Heart rate recovery after morning walks remained normal at 74 bpm.
              </Text>
            </View>

            <View style={[styles.insightBox, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
              <Text style={[styles.insightBadge, { color: '#16A34A' }]}>MEDICATION ADHERENCE</Text>
              <Text style={styles.insightHeading}>Optimal Schedule Alignment</Text>
              <Text style={styles.insightBody}>
                Morning Lisinopril and Aspirin doses have been taken within 15 minutes of the prescribed schedule for 7 consecutive days.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.modalActionBtn}
              onPress={() => {
                setAiModalVisible(false);
                router.push('/(Tutor)/reports' as any);
              }}
              activeOpacity={0.88}
            >
              <Text style={styles.modalActionBtnText}>View Full Analytics Report</Text>
              <ArrowRight size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Tab Bar */}
      <BottomTabBar activeTab="more" role="parent" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F0F4FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F8FAFC',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 380,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  modalIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  closeModalBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 12,
  },
  insightBadge: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#9333EA',
    marginBottom: 4,
  },
  insightHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  insightBody: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
  },
  modalActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 6,
    gap: 8,
  },
  modalActionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

