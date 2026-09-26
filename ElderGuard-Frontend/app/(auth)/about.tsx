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
  Shield,
  Smartphone,
  Heart,
  MapPin,
  Bell,
  Brain,
  ArrowRight,
  ChevronLeft,
} from 'lucide-react-native';
import { Card } from '@/components/ui';

const STEPS = [
  {
    step: '01',
    icon: Smartphone,
    title: 'Connect the wearable',
    desc: 'The Patient wears the GUYNOVA GUARD smart band. It continuously monitors heart rate, SpO₂, temperature, activity and fall detection.',
    color: '#3C6FDB',
  },
  {
    step: '02',
    icon: Heart,
    title: 'Real-time health monitoring',
    desc: 'Vitals stream live to the family and caregiver dashboards. Smart thresholds trigger instant alerts when readings leave safe ranges.',
    color: '#EF4444',
  },
  {
    step: '03',
    icon: MapPin,
    title: 'Location & geofencing',
    desc: "Track the exact location of your loved one. Set an optional safe zone — you'll be notified instantly if they leave the boundary.",
    color: '#8B5CF6',
  },
  {
    step: '04',
    icon: Bell,
    title: 'Smart alerts & emergency response',
    desc: 'Critical events trigger immediate alerts. Emergency services are contacted automatically, and the doctor receives an instant SMS or call.',
    color: '#EA580C',
  },
  {
    step: '05',
    icon: Brain,
    title: 'AI health insights',
    desc: 'AI analyses patterns in health data to surface early warning signs and personalised recommendations before they become emergencies.',
    color: '#00C2CB',
  },
];

const USER_ROLES = [
  {
    role: 'Tutor / Family',
    desc: 'Monitor health, manage care, receive alerts and generate reports.',
    color: '#3C6FDB',
  },
  {
    role: 'Caregiver',
    desc: 'View assigned Patient vitals, log care activities and respond to alerts.',
    color: '#16A34A',
  },
  {
    role: 'Doctor',
    desc: 'Receives emergency SMS or call notification during critical events.',
    color: '#8B5CF6',
  },
];

export default function AboutScreen() {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(auth)/welcome' as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with deep blue banner */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <ChevronLeft size={18} color="rgba(255, 255, 255, 0.7)" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          {/* Logo brand */}
          <View style={styles.logoRow}>
            <View style={styles.logoBox}>
              <Shield size={18} color="#FFFFFF" />
            </View>
            <Text style={styles.brandTitle}>
              Patient<Text style={styles.brandAccent}>Guard</Text>
            </Text>
          </View>

          <Text style={styles.screenTitle}>How it works</Text>
          <Text style={styles.screenSubtitle}>
            A complete safety ecosystem connecting families, caregivers and smart wearables.
          </Text>
        </View>

        {/* 5 Steps timeline */}
        <View style={styles.content}>
          <View style={styles.stepsList}>
            {STEPS.map((item, index) => {
              const IconComponent = item.icon;
              const isLast = index === STEPS.length - 1;

              return (
                <View key={item.step} style={styles.stepItemRow}>
                  {/* Left Column: Icon & connecting line */}
                  <View style={styles.stepIconColumn}>
                    <View
                      style={[
                        styles.stepIconBox,
                        { backgroundColor: `${item.color}18` },
                      ]}
                    >
                      <IconComponent size={19} color={item.color} />
                    </View>
                    {!isLast && <View style={styles.stepConnectingLine} />}
                  </View>

                  {/* Right Column: Text information */}
                  <View style={[styles.stepTextColumn, !isLast && styles.stepTextColumnPadded]}>
                    <Text style={styles.stepNumberBadge}>STEP {item.step}</Text>
                    <Text style={styles.stepItemTitle}>{item.title}</Text>
                    <Text style={styles.stepItemDesc}>{item.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Who uses GUYNOVA GUARD */}
          <Card style={styles.rolesCard}>
            <Text style={styles.rolesHeading}>Who uses GUYNOVA GUARD?</Text>
            {USER_ROLES.map((user, idx) => (
              <View
                key={user.role}
                style={[
                  styles.roleItemRow,
                  idx < USER_ROLES.length - 1 && styles.roleItemBorder,
                ]}
              >
                <View style={[styles.roleColorBar, { backgroundColor: user.color }]} />
                <View style={styles.roleTextContainer}>
                  <Text style={styles.roleName}>{user.role}</Text>
                  <Text style={styles.roleDesc}>{user.desc}</Text>
                </View>
              </View>
            ))}
          </Card>

          {/* Bottom Actions */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={styles.primaryCtaButton}
              onPress={() => router.push('/(auth)/signup')}
              activeOpacity={0.88}
            >
              <Text style={styles.primaryCtaText}>Get started free</Text>
              <ArrowRight size={17} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.signInRow}>
              <Text style={styles.signInLabel}>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => router.push('/(auth)/login')}
                activeOpacity={0.7}
              >
                <Text style={styles.signInLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  header: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginBottom: 18,
    paddingVertical: 4,
  },
  backText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  brandAccent: {
    color: '#00FBFB',
  },
  screenTitle: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  screenSubtitle: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13.5,
    lineHeight: 20,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 20,
    gap: 20,
  },
  stepsList: {
    gap: 0,
  },
  stepItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  stepIconColumn: {
    alignItems: 'center',
    width: 42,
  },
  stepIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepConnectingLine: {
    width: 2,
    flex: 1,
    minHeight: 28,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
    borderRadius: 1,
  },
  stepTextColumn: {
    flex: 1,
    paddingTop: 2,
  },
  stepTextColumnPadded: {
    paddingBottom: 22,
  },
  stepNumberBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1.1,
    marginBottom: 3,
  },
  stepItemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  stepItemDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#64748B',
  },
  rolesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rolesHeading: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 14,
  },
  roleItemRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
  },
  roleItemBorder: {
    marginBottom: 6,
  },
  roleColorBar: {
    width: 3.5,
    borderRadius: 2,
    alignSelf: 'stretch',
    minHeight: 36,
  },
  roleTextContainer: {
    flex: 1,
  },
  roleName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  roleDesc: {
    fontSize: 12,
    lineHeight: 17,
    color: '#64748B',
  },
  actionSection: {
    paddingTop: 4,
    gap: 14,
    alignItems: 'center',
  },
  primaryCtaButton: {
    backgroundColor: '#3C6FDB',
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    shadowColor: '#3C6FDB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 4,
  },
  primaryCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  signInLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3C6FDB',
  },
});

