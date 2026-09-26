import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Stethoscope,
  Activity,
  Pill,
  FileText,
  ArrowRight,
  ChevronLeft,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react-native';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

const CLINICAL_FEATURES = [
  {
    icon: Activity,
    color: '#7C3AED',
    bg: '#F5F3FF',
    title: 'Continuous Biometric Telemetry',
    desc: "24/7 stream of resting heart rate, blood oxygen (SpO2), and temperature from the senior's wearable IoT band with physician alarm thresholds.",
  },
  {
    icon: Pill,
    color: '#0284C7',
    bg: '#F0F9FF',
    title: 'Prescription Synchronization',
    desc: "Prescribe or modify standing dosages digitally. Changes synchronize directly with the caregiver's daily administration schedule.",
  },
  {
    icon: FileText,
    color: '#16A34A',
    bg: '#F0FDF4',
    title: 'Clinical Consultation Notes',
    desc: 'Record diagnosis, assessment directives, and consultation summaries preserved in secure, encrypted medical records.',
  },
  {
    icon: Users,
    color: '#D97706',
    bg: '#FFFBEB',
    title: 'Coordinated Care Team',
    desc: 'Direct communication with the family manager (Robert Thompson) and assigned registered caregiver (Sarah Mitchell).',
  },
];

export default function DoctorOnboardingScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const handleGoToLogin = () => {
    router.push({
      pathname: '/(auth)/login',
      params: { role: 'doctor' },
    } as any);
  };

  const handleInstantDemoLogin = async () => {
    const res = await login('doctor@GUYNOVA GUARD.com', 'password123');
    if (res.success) {
      router.replace('/(doctor)' as any);
    } else {
      handleGoToLogin();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color="#0F172A" />
        </TouchableOpacity>

        <View style={styles.roleBadge}>
          <Stethoscope size={14} color="#7C3AED" />
          <Text style={styles.roleBadgeText}>CLINICAL PORTAL</Text>
        </View>

        <TouchableOpacity onPress={handleGoToLogin} activeOpacity={0.7}>
          <Text style={styles.skipText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Banner */}
        <View style={styles.heroCard}>
          <View style={styles.heroAura} />
          <View style={styles.heroContent}>
            <View style={styles.iconCircle}>
              <Stethoscope size={28} color="#FFFFFF" />
            </View>

            <Text style={styles.heroTitle}>Physician Clinical Suite</Text>
            <Text style={styles.heroSubtitle}>
              Dedicated remote medical management for attending physicians and geriatric specialists.
            </Text>

            <View style={styles.tagRow}>
              <View style={styles.heroPill}>
                <Sparkles size={12} color="#DDD6FE" />
                <Text style={styles.heroPillText}>Real-Time Telemetry</Text>
              </View>
              <View style={styles.heroPill}>
                <Shield size={12} color="#DDD6FE" />
                <Text style={styles.heroPillText}>Medical Grade</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeading}>CLINICAL CAPABILITIES</Text>
          <Text style={styles.sectionSub}>Everything you need to oversee patient health</Text>
        </View>

        {/* Feature Cards */}
        <View style={styles.featuresList}>
          {CLINICAL_FEATURES.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <View key={idx} style={styles.featureItem}>
                <View style={[styles.featureIconBox, { backgroundColor: item.bg }]}>
                  <IconComponent size={22} color={item.color} />
                </View>
                <View style={styles.featureTextGroup}>
                  <Text style={styles.featureTitle}>{item.title}</Text>
                  <Text style={styles.featureDesc}>{item.desc}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Default Physician Card */}
        <View style={styles.physicianCard}>
          <View style={styles.physicianHeader}>
            <View style={styles.physicianAvatar}>
              <Text style={styles.physicianAvatarText}>JH</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.physicianName}>Dr. Jean-Paul Mbarga</Text>
              <Text style={styles.physicianMeta}>Geriatric Medicine · St. Thomas Hospital</Text>
            </View>
            <View style={styles.activeDot} />
          </View>
          <Text style={styles.physicianNote}>
            Assigned Senior: <Text style={{ fontWeight: '700', color: '#0F172A' }}>Margaret Thompson (Age 78)</Text>
          </Text>
        </View>

        {/* Bottom Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleInstantDemoLogin}
            activeOpacity={0.88}
          >
            <Text style={styles.primaryButtonText}>Enter Doctor Portal (Instant Demo)</Text>
            <ArrowRight size={18} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleGoToLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Sign In with Custom Credentials</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
    letterSpacing: 0.5,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  heroCard: {
    backgroundColor: '#6D28D9',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#6D28D9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  heroAura: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  heroContent: {
    zIndex: 1,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13.5,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 20,
    marginBottom: 16,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  heroPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  sectionSub: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '500',
    marginTop: 2,
  },
  featuresList: {
    gap: 12,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
    alignItems: 'flex-start',
  },
  featureIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTextGroup: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 3,
  },
  featureDesc: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
  },
  physicianCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  physicianHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  physicianAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#DDD6FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  physicianAvatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#7C3AED',
  },
  physicianName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  physicianMeta: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },
  physicianNote: {
    fontSize: 12,
    color: '#475569',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  actionsContainer: {
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#7C3AED',
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButton: {
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
});

