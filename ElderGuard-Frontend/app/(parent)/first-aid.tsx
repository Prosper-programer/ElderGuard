import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Shield,
  ChevronRight,
  ChevronLeft,
  Phone,
  AlertCircle,
  CheckCircle,
} from 'lucide-react-native';
import {
  ScreenContainer,
  Card,
  TopBar,
  Button,
} from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';

export default function FirstAidScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Stay Calm & Assess',
      desc: 'Do not move Margaret unless she is in immediate hazard. Approach gently and speak clearly: "Margaret, can you hear me? Where are you hurting?"',
      instruction: 'Observe her breathing and posture without lifting her.',
    },
    {
      title: 'Check Responsiveness',
      desc: 'Gently squeeze her hand or shoulder. If unresponsive or confused, immediately call emergency services (999 / 911).',
      instruction: 'Do not shake vigorously or give fluids if drowsy.',
    },
    {
      title: 'Check for Fractures & Bleeding',
      desc: 'Carefully inspect common impact points: hips, wrists, knees, and back of the head. Look for swelling, bruising, or unnatural limb angles.',
      instruction: 'Apply gentle clean pressure if surface bleeding is seen.',
    },
    {
      title: 'Do Not Force Movement',
      desc: 'If hip pain, severe back pain, or neck tenderness is reported, keep Margaret lying still. Keep her warm with a blanket while waiting for paramedics.',
      instruction: 'Moving someone with a fracture can worsen internal injury.',
    },
    {
      title: 'Safe Assisted Rise (If Uninjured)',
      desc: 'Only if Margaret insists she is uninjured: roll onto hands and knees first, crawl toward a sturdy armchair, and rest on one knee before rising.',
      instruction: 'Always place a chair behind her to sit down immediately.',
    },
  ];

  const active = steps[currentStep];

  return (
    <ScreenContainer
      scrollable
      padded
      backgroundColor="#F0F4FA"
    >
      <TopBar title="First Aid Protocol" onBack={() => router.back()} />

      {/* Progress Pills */}
      <View style={styles.stepsIndicator}>
        {steps.map((_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setCurrentStep(i)}
            style={[
              styles.stepBar,
              i === currentStep && styles.stepBarActive,
              i < currentStep && styles.stepBarCompleted,
            ]}
          />
        ))}
      </View>

      <Text style={styles.stepCount}>
        STEP {currentStep + 1} OF {steps.length}
      </Text>

      {/* Main Protocol Card */}
      <Card style={styles.protocolCard}>
        <View style={styles.iconCircle}>
          <Shield size={28} color={Colors.primary} />
        </View>

        <Text style={styles.protocolTitle}>{active.title}</Text>
        <Text style={styles.protocolDesc}>{active.desc}</Text>

        <View style={styles.instructionBox}>
          <AlertCircle size={16} color={Colors.primary} />
          <Text style={styles.instructionText}>{active.instruction}</Text>
        </View>
      </Card>

      {/* Step Navigation Controls */}
      <View style={styles.navRow}>
        <Button
          variant="secondary"
          disabled={currentStep === 0}
          onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
          className="flex-1"
        >
          Previous
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button
            variant="primary"
            onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
            className="flex-1"
          >
            Next Step
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={() => router.push('/(Tutor)/emergency' as any)}
            className="flex-1"
          >
            Finished
          </Button>
        )}
      </View>

      <View style={{ height: Spacing.xl }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  stepsIndicator: {
    flexDirection: 'row',
    gap: 6,
    marginVertical: 14,
  },
  stepBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
  },
  stepBarActive: {
    backgroundColor: Colors.primary,
  },
  stepBarCompleted: {
    backgroundColor: Colors.safe,
  },
  stepCount: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  protocolCard: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  protocolTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  protocolDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  instructionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  instructionText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#1D4ED8',
    lineHeight: 16,
  },
  navRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
