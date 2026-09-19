/**
 * ============================================================================
 * ElderGuard — Splash Screen (app/(auth)/splash.tsx)
 * ============================================================================
 * 
 * DESIGN SPECIFICATION:
 * - Background   : Clean Slate (#F8FAFC) with subtle #3C6FDB ambient accents.
 * - Center Emblem: Shield (#3C6FDB) + White Heart + Smart IoT Pulse Line (#00FBFB).
 * - Typography   : "ElderGuard" in dark charcoal (#0F172A),
 *                  "Smart Care. Safer Living." in soft slate (#64748B).
 * - Footer Loader: Minimal 3-dot animated pulse in primary blue (#3C6FDB).
 * - Feeling      : Safety + Trust + Care + Technology (Warm & Professional).
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path, Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();

  // Entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  // Staggered 3-dot pulse animations
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // 1. Smooth entrance reveal for brand mark and typography
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Subtle 3-dot pulse wave loop
    const createDotLoop = (anim: Animated.Value, delay: number) => {
      return Animated.sequence([
        Animated.delay(delay),
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 350,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0.3,
              duration: 350,
              useNativeDriver: true,
            }),
            Animated.delay(350),
          ])
        ),
      ]);
    };

    Animated.parallel([
      createDotLoop(dot1, 0),
      createDotLoop(dot2, 180),
      createDotLoop(dot3, 360),
    ]).start();

    // 3. Natural transition to the onboarding tour after 2.4s
    const timer = setTimeout(() => {
      router.replace('/(auth)/onboarding');
    }, 2400);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, dot1, dot2, dot3, router]);

  const handleSkip = () => {
    router.replace('/(auth)/onboarding');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <TouchableOpacity
        style={styles.touchArea}
        activeOpacity={1}
        onPress={handleSkip}
      >
        {/* Subtle, soft ambient background accent aura */}
        <View style={styles.ambientAura} />

        {/* ── Center Identity Stack ───────────────────────────── */}
        <Animated.View
          style={[
            styles.centerStack,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* ElderGuard Emblem: Shield + Heart + Pulse */}
          <View style={styles.logoWrap}>
            <Svg width={80} height={90} viewBox="0 0 80 90" fill="none">
              {/* 1. Guardian Shield (#3C6FDB) */}
              <Path
                d="M40 3 C40 3 68 12 70 14 C72 16 72 38 72 48 C72 67 56 81 40 87 C24 81 8 67 8 48 C8 38 8 16 10 14 C12 12 40 3 40 3 Z"
                fill="#3C6FDB"
              />

              {/* 2. Pure White Heart (Elderly Care & Health) */}
              <Path
                d="M40 56 C38.5 54.5 25 43.5 25 33.5 C25 27.5 29.5 23 35.5 23 C38.5 23 40 24.5 40 24.5 C40 24.5 41.5 23 44.5 23 C50.5 23 55 27.5 55 33.5 C55 43.5 41.5 54.5 40 56 Z"
                fill="#FFFFFF"
              />

              {/* 3. Smart IoT Pulse Line (#00FBFB Cyan Telemetry Rhythm) */}
              <Path
                d="M20 38 H29 L33 28 L38 46 L43 32 L46 40 L49 38 H60"
                stroke="#00FBFB"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* 4. Satellite Telemetry Beacon Dot */}
              <Circle cx="40" cy="14" r="2.5" fill="#00FBFB" />
            </Svg>
          </View>

          {/* App Name */}
          <Text style={styles.brandTitle}>ElderGuard</Text>

          {/* Short Reassuring Tagline */}
          <Text style={styles.tagline}>Smart Care. Safer Living.</Text>
        </Animated.View>

        {/* ── Bottom: Subtle 3-Dot Pulse Loader ───────────────── */}
        <Animated.View style={[styles.bottomArea, { opacity: fadeAnim }]}>
          <View style={styles.dotsRow}>
            <Animated.View
              style={[
                styles.dot,
                {
                  opacity: dot1,
                  transform: [
                    {
                      scale: dot1.interpolate({
                        inputRange: [0.3, 1],
                        outputRange: [0.8, 1.25],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.dot,
                {
                  opacity: dot2,
                  transform: [
                    {
                      scale: dot2.interpolate({
                        inputRange: [0.3, 1],
                        outputRange: [0.8, 1.25],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.dot,
                {
                  opacity: dot3,
                  transform: [
                    {
                      scale: dot3.interpolate({
                        inputRange: [0.3, 1],
                        outputRange: [0.8, 1.25],
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Clean Slate 50
  },
  touchArea: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 24,
  },
  ambientAura: {
    position: 'absolute',
    top: '30%',
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: (width * 0.75) / 2,
    backgroundColor: 'rgba(60, 111, 219, 0.04)', // Very subtle blue accent
  },
  centerStack: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrap: {
    width: 104,
    height: 104,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)', // #E2E8F0
    shadowColor: '#3C6FDB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 18,
    elevation: 4,
  },
  brandTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    color: '#0F172A', // Dark charcoal/navy
    letterSpacing: -0.4,
  },
  tagline: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: '#64748B', // Soft slate gray
    marginTop: 8,
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  bottomArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#3C6FDB', // Primary Blue
  },
});
