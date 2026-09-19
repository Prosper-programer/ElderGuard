import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import {
  Shield,
  Heart,
  MapPin,
  Bell,
  Brain,
  ArrowRight,
  Stethoscope,
} from 'lucide-react-native';

const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = Math.min(Math.max(WINDOW_HEIGHT * 0.48, 360), 440);

const FEATURE_CHIPS = [
  { icon: Heart, text: 'Health vitals', color: '#EF4444' },
  { icon: MapPin, text: 'GPS location', color: '#3C6FDB' },
  { icon: Bell, text: 'Instant alerts', color: '#F59E0B' },
  { icon: Shield, text: 'Fall detection', color: '#8B5CF6' },
  { icon: Brain, text: 'AI insights', color: '#00FBFB' },
];

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#060D1F" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Full-bleed hero banner */}
        <View style={[styles.heroContainer, { height: HERO_HEIGHT }]}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1758686253861-bbfd56e5ba7a?w=800&auto=format&fit=crop',
            }}
            defaultSource={require('@/assets/images/auth_welcome_hero.jpg')}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Smooth Linear Gradient Overlay via SVG (Zero banding / degradation) */}
          <Svg
            style={StyleSheet.absoluteFillObject}
            width="100%"
            height={HERO_HEIGHT}
          >
            <Defs>
              <LinearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#060D1F" stopOpacity="0.45" />
                <Stop offset="25%" stopColor="#060D1F" stopOpacity="0.1" />
                <Stop offset="55%" stopColor="#060D1F" stopOpacity="0.5" />
                <Stop offset="85%" stopColor="#060D1F" stopOpacity="0.92" />
                <Stop offset="100%" stopColor="#060D1F" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height={HERO_HEIGHT} fill="url(#heroGradient)" />
          </Svg>

          {/* Top Logo Bar */}
          <View style={styles.topLogoBar}>
            <View style={styles.brandRow}>
              <View style={styles.brandIconBox}>
                <Shield size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.brandTitle}>
                Elder<Text style={styles.brandAccent}>Guard</Text>
              </Text>
            </View>

            <TouchableOpacity
              style={styles.howItWorksButton}
              onPress={() => router.push('/(auth)/about')}
              activeOpacity={0.75}
            >
              <Text style={styles.howItWorksText}>How it works</Text>
            </TouchableOpacity>
          </View>

          {/* Hero Copy */}
          <View style={styles.heroCopyContainer}>
            <View style={styles.liveIndicatorRow}>
              <View style={styles.pulseOuter}>
                <View style={styles.pulseInner} />
              </View>
              <Text style={styles.liveIndicatorText}>REAL-TIME MONITORING</Text>
            </View>

            <Text style={styles.heroHeadline}>
              Peace of mind,{'\n'}every heartbeat.
            </Text>
            <Text style={styles.heroSubtitle}>
              Continuous safety monitoring for your loved ones — anytime, anywhere.
            </Text>
          </View>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          {/* Feature Chips */}
          <View style={styles.chipsWrap}>
            {FEATURE_CHIPS.map((chip) => {
              const IconComp = chip.icon;
              return (
                <View key={chip.text} style={styles.chip}>
                  <IconComp size={12} color={chip.color} />
                  <Text style={styles.chipText}>{chip.text}</Text>
                </View>
              );
            })}
          </View>

          {/* Role Navigation Buttons */}
          <View style={styles.roleButtonsContainer}>
            {/* Parent Role Button */}
            <TouchableOpacity
              style={styles.parentRoleButton}
              onPress={() =>
                router.push({
                  pathname: '/(auth)/login',
                  params: { role: 'parent' },
                } as any)
              }
              activeOpacity={0.88}
            >
              <View style={styles.roleIconBoxParent}>
                <Heart size={20} color="#FFFFFF" />
              </View>
              <View style={styles.roleTextGroup}>
                <Text style={styles.roleMainTitle}>I'm a Parent</Text>
                <Text style={styles.roleSubTitle}>Monitor your loved one</Text>
              </View>
              <ArrowRight size={18} color="rgba(255, 255, 255, 0.7)" />
            </TouchableOpacity>

            {/* Caregiver Role Button */}
            <TouchableOpacity
              style={styles.caregiverRoleButton}
              onPress={() =>
                router.push({
                  pathname: '/(auth)/login',
                  params: { role: 'caregiver' },
                } as any)
              }
              activeOpacity={0.88}
            >
              <View style={styles.roleIconBoxCaregiver}>
                <Shield size={20} color="rgba(255, 255, 255, 0.8)" />
              </View>
              <View style={styles.roleTextGroup}>
                <Text style={styles.roleMainTitleLight}>I'm a Caregiver</Text>
                <Text style={styles.roleSubTitleLight}>Access assigned care</Text>
              </View>
              <ArrowRight size={18} color="rgba(255, 255, 255, 0.35)" />
            </TouchableOpacity>

            {/* Doctor Role Button */}
            <TouchableOpacity
              style={styles.doctorRoleButton}
              onPress={() => router.push('/(auth)/doctor-onboarding' as any)}
              activeOpacity={0.88}
            >
              <View style={styles.roleIconBoxDoctor}>
                <Stethoscope size={20} color="#A78BFA" />
              </View>
              <View style={styles.roleTextGroup}>
                <Text style={styles.roleMainTitleLight}>I'm a Doctor</Text>
                <Text style={styles.roleSubTitleLight}>Clinical vitals & medical portal</Text>
              </View>
              <ArrowRight size={18} color="rgba(255, 255, 255, 0.35)" />
            </TouchableOpacity>
          </View>

          {/* Create Account Banner */}
          <TouchableOpacity
            style={styles.createAccountCard}
            onPress={() => router.push('/(auth)/signup')}
            activeOpacity={0.85}
          >
            <Text style={styles.createAccountPrompt}>
              New family manager?{' '}
              <Text style={styles.createAccountLink}>Register parent account →</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#060D1F',
  },
  container: {
    flex: 1,
    backgroundColor: '#060D1F',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 28,
  },
  heroContainer: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#060D1F',
    overflow: 'hidden',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.55,
  },
  topLogoBar: {
    position: 'absolute',
    top: 16,
    left: 18,
    right: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  brandIconBox: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#3C6FDB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3C6FDB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 4,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  brandAccent: {
    color: '#00FBFB',
  },
  howItWorksButton: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  howItWorksText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11.5,
    fontWeight: '600',
  },
  heroCopyContainer: {
    position: 'absolute',
    bottom: 14,
    left: 18,
    right: 18,
    zIndex: 5,
  },
  liveIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 8,
  },
  pulseOuter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00FBFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00FBFB',
  },
  liveIndicatorText: {
    color: '#00FBFB',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  heroHeadline: {
    color: '#FFFFFF',
    fontSize: 29,
    fontWeight: '800',
    lineHeight: 35,
    letterSpacing: -0.6,
    marginBottom: 8,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.68)',
    fontSize: 13.5,
    lineHeight: 19,
  },
  bottomSection: {
    backgroundColor: '#060D1F',
    paddingHorizontal: 18,
    paddingTop: 10,
    gap: 16,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  chipText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 11.5,
    fontWeight: '500',
  },
  roleButtonsContainer: {
    gap: 11,
  },
  parentRoleButton: {
    backgroundColor: '#3C6FDB',
    height: 58,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 14,
    shadowColor: '#3C6FDB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 4,
  },
  caregiverRoleButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    height: 58,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 14,
  },
  roleIconBoxParent: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleIconBoxCaregiver: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTextGroup: {
    flex: 1,
  },
  roleMainTitle: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  roleSubTitle: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 11.5,
    marginTop: 1,
  },
  roleMainTitleLight: {
    color: 'rgba(255, 255, 255, 0.92)',
    fontSize: 15.5,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  roleSubTitleLight: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 11.5,
    marginTop: 1,
  },
  doctorRoleButton: {
    backgroundColor: 'rgba(124, 58, 237, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.28)',
    height: 58,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 14,
  },
  roleIconBoxDoctor: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(124, 58, 237, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createAccountCard: {
    backgroundColor: 'rgba(60, 111, 219, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  createAccountPrompt: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 13,
  },
  createAccountLink: {
    color: '#3C6FDB',
    fontWeight: '700',
  },
});
