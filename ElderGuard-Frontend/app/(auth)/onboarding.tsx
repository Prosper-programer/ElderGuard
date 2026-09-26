import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import {
  ShieldAlert,
  Activity,
  HeartHandshake,
  ArrowRight,
  ArrowLeft,
  Shield,
  Sparkles,
} from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, FontFamily } from '@/constants/theme';

interface OnboardingSlide {
  id: string;
  category: string;
  title: string;
  description: string;
  image: any;
  icon: React.ComponentType<{ size: number; color: string }>;
  accentColor: string;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: 'safety',
    category: 'Patient SAFETY',
    title: 'Protecting Your Loved Ones 24/7',
    description:
      'Wearable IoT tracking automatically detects unexpected falls and critical movements, giving your family complete peace of mind at every moment.',
    image: require('@/assets/images/onboarding_safety.jpg'),
    icon: ShieldAlert,
    accentColor: Colors.accent, // Cyan accent
  },
  {
    id: 'vitals',
    category: 'HEALTH MONITORING',
    title: 'Real-Time Vital Statistics',
    description:
      'Live sensor updates track heart rate, blood oxygen (SpO₂), and body temperature with intuitive Safe, Warning, and Critical status indicators.',
    image: require('@/assets/images/onboarding_vitals.jpg'),
    icon: Activity,
    accentColor: '#38BDF8', // Bright sky blue
  },
  {
    id: 'care',
    category: 'CARE COORDINATION',
    title: 'Instant Alerts & Daily Care',
    description:
      'Receive instant high-priority emergency notifications while seamlessly coordinating medication reminders and daily routines with caregivers.',
    image: require('@/assets/images/onboarding_care.jpg'),
    icon: HeartHandshake,
    accentColor: Colors.safe, // Green safe accent
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const isCompact = screenHeight < 750;

  const [currentIndex, setCurrentIndex] = useState(0);

  const currentSlide = SLIDES[currentIndex];
  const isLastSlide = currentIndex === SLIDES.length - 1;
  const SlideIcon = currentSlide.icon;

  const handleNext = () => {
    if (isLastSlide) {
      router.replace('/(auth)/welcome');
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    router.replace('/(auth)/welcome');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── 1. Full-Screen Background Image ─────────────────── */}
      <Image
        key={currentSlide.id}
        source={currentSlide.image}
        style={[StyleSheet.absoluteFillObject, { width: screenWidth, height: screenHeight }]}
        resizeMode="cover"
      />

      {/* ── 2. Cinematic Gradient Overlay (Top to Bottom) ─────── */}
      <Svg style={StyleSheet.absoluteFillObject} width="100%" height="100%">
        <Defs>
          <LinearGradient id="screenOverlay" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#0B132B" stopOpacity="0.45" />
            <Stop offset="0.30" stopColor="#0B132B" stopOpacity="0.25" />
            <Stop offset="0.55" stopColor="#0B132B" stopOpacity="0.75" />
            <Stop offset="0.80" stopColor="#0B132B" stopOpacity="0.95" />
            <Stop offset="1.0" stopColor="#0B132B" stopOpacity="1.0" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#screenOverlay)" />
      </Svg>

      {/* ── 3. Top Navigation Bar (SafeArea-Aware) ────────────── */}
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 16) }]}>
        {/* Brand Pill */}
        <View style={styles.brandPill}>
          <Shield size={16} color={Colors.accent} />
          <Text style={styles.brandTitle}>GUYNOVA GUARD</Text>
        </View>

        {/* Skip Action */}
        {!isLastSlide ? (
          <TouchableOpacity
            onPress={handleSkip}
            style={styles.skipButton}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.skipPlaceholder} />
        )}
      </View>

      {/* ── 4. Bottom Text & Controls Container ──────────────── */}
      <View
        style={[
          styles.bottomContainer,
          { paddingBottom: Math.max(insets.bottom, 24) + Spacing.sm },
        ]}
      >
        <View style={styles.bottomInnerContent}>
          {/* Category Badge */}
          <View style={[styles.badgeContainer, isCompact && { marginBottom: Spacing.sm }]}>
            <View style={[styles.badgeIconDot, { backgroundColor: currentSlide.accentColor }]}>
              <SlideIcon size={12} color="#0B132B" />
            </View>
            <Text style={[styles.badgeText, { color: currentSlide.accentColor }]}>
              {currentSlide.category}
            </Text>
          </View>

          {/* Slide Title */}
          <Text style={[styles.title, isCompact && styles.titleCompact]}>{currentSlide.title}</Text>

          {/* Slide Description */}
          <Text style={[styles.description, isCompact && styles.descriptionCompact]}>
            {currentSlide.description}
          </Text>

          {/* Pagination Dots Row */}
          <View style={[styles.paginationRow, isCompact && { marginBottom: Spacing.md }]}>
            {SLIDES.map((slide, index) => {
              const isActive = index === currentIndex;
              return (
                <TouchableOpacity
                  key={slide.id}
                  onPress={() => setCurrentIndex(index)}
                  activeOpacity={0.8}
                  style={[
                    styles.pageIndicator,
                    isActive ? styles.pageIndicatorActive : styles.pageIndicatorInactive,
                  ]}
                />
              );
            })}
          </View>

          {/* Controls: Cool Action Buttons */}
          <View style={styles.buttonsRow}>
            {currentIndex > 0 && (
              <TouchableOpacity
                onPress={handleBack}
                style={[styles.backGlassButton, isCompact && styles.backGlassButtonCompact]}
                activeOpacity={0.7}
              >
                <ArrowLeft size={isCompact ? 19 : 22} color={Colors.white} />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={handleNext}
              style={[
                styles.primaryActionButton,
                isCompact && styles.primaryActionButtonCompact,
                isLastSlide ? styles.getStartedButton : undefined,
                currentIndex === 0 && styles.fullWidthButton,
              ]}
              activeOpacity={0.85}
            >
              <Text style={[styles.primaryActionText, isLastSlide && styles.getStartedText]}>
                {isLastSlide ? 'Enter GUYNOVA GUARD' : 'Continue'}
              </Text>
              {isLastSlide ? (
                <Sparkles size={18} color="#0B132B" />
              ) : (
                <View style={styles.arrowIconBubble}>
                  <ArrowRight size={16} color={Colors.primary} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B132B',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  brandPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  brandTitle: {
    ...Typography.captionMedium,
    color: Colors.white,
    letterSpacing: 0.3,
  },
  skipButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: Spacing.base,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
  },
  skipText: {
    ...Typography.captionMedium,
    color: Colors.white,
    letterSpacing: 0.2,
  },
  skipPlaceholder: {
    width: 50,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bottomInnerContent: {
    width: '100%',
    maxWidth: 560,
    paddingHorizontal: Spacing.xl,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  badgeIconDot: {
    width: 18,
    height: 18,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    ...Typography.overline,
    fontSize: 11,
    letterSpacing: 1.1,
  },
  title: {
    ...Typography.h1,
    fontSize: 28,
    lineHeight: 35,
    color: Colors.white,
    letterSpacing: -0.4,
    marginBottom: Spacing.sm,
  },
  titleCompact: {
    fontSize: 23,
    lineHeight: 29,
    marginBottom: Spacing.xs,
  },
  description: {
    ...Typography.body,
    color: 'rgba(241, 245, 249, 0.88)', // Soft slate white
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  descriptionCompact: {
    fontSize: 13.5,
    lineHeight: 19,
    marginBottom: Spacing.md,
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.xl,
  },
  pageIndicator: {
    height: 6,
    borderRadius: BorderRadius.full,
  },
  pageIndicatorActive: {
    width: 32,
    backgroundColor: Colors.accent, // Glowing Cyan Accent
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 3,
  },
  pageIndicatorInactive: {
    width: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    width: '100%',
  },
  backGlassButton: {
    width: 54,
    height: 54,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backGlassButtonCompact: {
    width: 48,
    height: 48,
  },
  primaryActionButton: {
    flex: 1,
    height: 54,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  primaryActionButtonCompact: {
    height: 48,
    paddingHorizontal: Spacing.lg,
  },
  getStartedButton: {
    backgroundColor: Colors.accent, // Cyan accent for the final "Get Started" CTA
    shadowColor: Colors.accent,
    shadowOpacity: 0.5,
  },
  fullWidthButton: {
    flex: 1,
  },
  primaryActionText: {
    ...Typography.button,
    fontSize: 16,
    letterSpacing: 0.3,
    color: Colors.white,
  },
  getStartedText: {
    color: '#0B132B',
    fontFamily: FontFamily.bold,
  },
  arrowIconBubble: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

