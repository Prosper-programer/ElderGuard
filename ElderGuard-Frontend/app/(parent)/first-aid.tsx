import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  Shield,
  ChevronLeft,
  Phone,
  AlertCircle,
  AlertTriangle,
  WifiOff,
  Lightbulb,
} from 'lucide-react-native';
import { ScreenContainer, Card, TopBar, Button } from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';
import { useElderly } from '@/context/ElderlyContext';
import { fetchFirstAidProtocol } from '@/services/firstAidService';
import { FirstAidProtocol } from '@/constants/firstAidProtocols';

// Emergency type display labels
const EMERGENCY_LABELS: Record<string, string> = {
  fall: 'Fall / Trip',
  cardiac: 'Cardiac Emergency',
  stroke: 'Stroke / Brain Attack',
  choking: 'Choking',
  breathing: 'Breathing Difficulty',
};

export default function FirstAidScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string }>();
  const { activeProfile } = useElderly();

  const emergencyType = (params.type || 'fall').toLowerCase().trim();
  const patientName = activeProfile?.fullName || 'the patient';

  const [protocol, setProtocol] = useState<FirstAidProtocol | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setCurrentStep(0);
      const result = await fetchFirstAidProtocol(emergencyType);
      if (!cancelled) {
        setProtocol(result);
        setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [emergencyType]);

  const handleCallEmergency = () => {
    Linking.openURL('tel:119').catch(() => {
      Alert.alert(
        'Calling Emergency Services',
        'Initiating emergency dispatch call.'
      );
    });
  };

  const isOffline = protocol?.source === 'offline';
  const steps = protocol?.steps ?? [];
  const activeStep = steps[currentStep];

  return (
    <ScreenContainer scrollable padded backgroundColor="#F0F4FA">
      <TopBar title="First Aid Protocol" onBack={() => router.back()} />

      {/* ── Emergency Disclaimer Banner ── */}
      <View style={styles.disclaimerBanner}>
        <AlertTriangle size={15} color="#B45309" />
        <Text style={styles.disclaimerText}>
          {protocol?.disclaimer ??
            'For a serious or life-threatening emergency, contact local emergency medical services immediately.'}
        </Text>
      </View>

      {/* ── Patient Context ── */}
      <View style={styles.contextRow}>
        <View style={styles.contextInfo}>
          <Text style={styles.contextLabel}>
            {EMERGENCY_LABELS[emergencyType] ?? 'Emergency'} detected
          </Text>
          <Text style={styles.contextPatient}>For {patientName}</Text>
          <Text style={styles.contextSub}>
            Follow these steps while help is being arranged.
          </Text>
        </View>

        {/* Severity badge */}
        {protocol && (
          <View
            style={[
              styles.severityBadge,
              protocol.severity === 'critical'
                ? styles.severityCritical
                : styles.severityHigh,
            ]}
          >
            <Text style={styles.severityText}>
              {protocol.severity.toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* ── Offline Mode Badge ── */}
      {isOffline && !loading && (
        <View style={styles.offlineBadge}>
          <WifiOff size={13} color="#92400E" />
          <Text style={styles.offlineBadgeText}>
            OFFLINE MODE — Using emergency protocol stored on this device.
          </Text>
        </View>
      )}

      {/* ── Loading State ── */}
      {loading ? (
        <Card style={styles.loadingCard}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading emergency protocol…</Text>
        </Card>
      ) : (
        <>
          {/* ── Step Progress Pills ── */}
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

          {/* ── Main Protocol Card ── */}
          {activeStep && (
            <Card style={styles.protocolCard}>
              <View style={styles.iconCircle}>
                <Shield size={28} color={Colors.primary} />
              </View>

              <Text style={styles.protocolTitle}>{activeStep.title}</Text>
              <Text style={styles.protocolDesc}>{activeStep.description}</Text>

              <View style={styles.instructionBox}>
                <AlertCircle size={16} color={Colors.primary} />
                <Text style={styles.instructionText}>
                  {activeStep.instruction}
                </Text>
              </View>
            </Card>
          )}

          {/* ── AI Contextual Tip (only when present & not offline) ── */}
          {protocol?.contextualTip && !isOffline && (
            <View style={styles.aiTipBox}>
              <Lightbulb size={14} color="#6D28D9" />
              <View style={styles.aiTipContent}>
                <Text style={styles.aiTipLabel}>AI-ASSISTED TIP</Text>
                <Text style={styles.aiTipText}>{protocol.contextualTip}</Text>
              </View>
            </View>
          )}

          {/* ── Step Navigation ── */}
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
                onClick={() =>
                  setCurrentStep((prev) =>
                    Math.min(steps.length - 1, prev + 1)
                  )
                }
                className="flex-1"
              >
                Next Step
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => router.push('/(parent)/emergency' as any)}
                className="flex-1"
              >
                Back to Emergency
              </Button>
            )}
          </View>
        </>
      )}

      {/* ── Always Visible: Call Emergency Services ── */}
      <TouchableOpacity
        style={styles.callBtn}
        onPress={handleCallEmergency}
        activeOpacity={0.85}
      >
        <Phone size={18} color="#FFFFFF" />
        <Text style={styles.callBtnText}>CALL EMERGENCY SERVICES</Text>
      </TouchableOpacity>

      <View style={{ height: Spacing.xl }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  disclaimerBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCD34D',
    padding: 12,
    marginBottom: 14,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11.5,
    color: '#92400E',
    fontWeight: '600',
    lineHeight: 17,
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  contextInfo: {
    flex: 1,
  },
  contextLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EF4444',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  contextPatient: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 3,
  },
  contextSub: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginLeft: 10,
    marginTop: 2,
  },
  severityCritical: {
    backgroundColor: '#FEE2E2',
  },
  severityHigh: {
    backgroundColor: '#FEF3C7',
  },
  severityText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.6,
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FCD34D',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
  },
  offlineBadgeText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  loadingCard: {
    padding: 40,
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
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
    marginBottom: 14,
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
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    width: '100%',
  },
  instructionText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#1D4ED8',
    lineHeight: 17,
  },
  aiTipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    backgroundColor: '#F5F3FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    padding: 12,
    marginBottom: 14,
  },
  aiTipContent: {
    flex: 1,
  },
  aiTipLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: 0.7,
    marginBottom: 3,
  },
  aiTipText: {
    fontSize: 12,
    color: '#4C1D95',
    fontWeight: '500',
    lineHeight: 17,
  },
  navRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#DC2626',
    borderRadius: 16,
    paddingVertical: 15,
    width: '100%',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  callBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
