import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  UserCheck,
  Mail,
  Phone,
  Lock,
  Clock,
  Shield,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react-native';
import { ScreenContainer, Button, TextInput, Card, TopBar } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useElderly } from '@/context/ElderlyContext';

export default function CreateCaregiverScreen() {
  const router = useRouter();
  const { provisionCaregiver, activeProfile } = useElderly();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shiftHours, setShiftHours] = useState('08:00–20:00');
  const [password, setPassword] = useState('password123');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCreate = async () => {
    setError(null);
    if (!fullName.trim()) {
      setError('Please enter the caregiver’s full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address for caregiver login.');
      return;
    }
    if (!phoneNumber.trim()) {
      setError('Please enter the caregiver’s emergency phone number.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const res = await provisionCaregiver({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phoneNumber: phoneNumber.trim(),
      password,
    });
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Failed to create caregiver account.');
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.replace('/(Tutor)');
      }, 1200);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(Tutor)' as any);
    }
  };

  return (
    <ScreenContainer scrollable keyboardAvoiding padded backgroundColor="#F0F4FA">
      <TopBar title="Add Caregiver" onBack={handleBack} />

      {/* ── Explanation Banner ────────────────────────────────── */}
      <Card style={styles.bannerCard}>
        <View style={styles.bannerIconWrap}>
          <Shield size={20} color="#16A34A" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>Tutor Account Provisioning</Text>
          <Text style={styles.bannerSub}>
            Caregivers do not sign up independently. You create their credentials here. They will sign in using this email and password.
          </Text>
        </View>
      </Card>

      {success && (
        <Card style={styles.successCard}>
          <CheckCircle2 size={24} color="#16A34A" />
          <View style={{ flex: 1 }}>
            <Text style={styles.successTitle}>Caregiver Created!</Text>
            <Text style={styles.successSub}>
              {fullName} can now sign in with {email}. Returning to dashboard...
            </Text>
          </View>
        </Card>
      )}

      {error && (
        <View style={styles.errorBanner}>
          <AlertCircle size={16} color="#DC2626" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* ── Form ──────────────────────────────────────────────── */}
      <Card style={styles.formCard}>
        <Text style={styles.sectionHeader}>CAREGIVER DETAILS</Text>

        <TextInput
          label="Caregiver Full Name"
          placeholder="e.g. Sarah Mitchell"
          value={fullName}
          onChangeText={(t) => {
            setFullName(t);
            if (error) setError(null);
          }}
          autoCapitalize="words"
        />

        <View style={{ height: Spacing.sm }} />

        <TextInput
          label="Email Address (Login ID)"
          placeholder="e.g. sarah.mitchell@GUYNOVA GUARD.com"
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            if (error) setError(null);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          leftIcon={<Mail size={16} color={Colors.textTertiary} />}
        />

        <View style={{ height: Spacing.sm }} />

        <TextInput
          label="Phone Number"
          placeholder="e.g. +237 699 45 23 10"
          value={phoneNumber}
          onChangeText={(t) => {
            setPhoneNumber(t);
            if (error) setError(null);
          }}
          keyboardType="phone-pad"
          leftIcon={<Phone size={16} color={Colors.textTertiary} />}
        />

        <View style={{ height: Spacing.sm }} />

        <TextInput
          label="Assigned Shift Hours"
          placeholder="08:00–20:00"
          value={shiftHours}
          onChangeText={setShiftHours}
          leftIcon={<Clock size={16} color={Colors.textTertiary} />}
        />

        <View style={{ height: Spacing.sm }} />

        <TextInput
          label="Temporary Login Password"
          placeholder="At least 6 characters"
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            if (error) setError(null);
          }}
          secureTextEntry
          leftIcon={<Lock size={16} color={Colors.textTertiary} />}
        />

        {activeProfile && (
          <View style={styles.assignmentBox}>
            <UserCheck size={16} color="#2563EB" />
            <Text style={styles.assignmentText}>
              Will be automatically assigned to <Text style={{ fontWeight: '700' }}>{activeProfile.fullName}</Text>
            </Text>
          </View>
        )}

        <View style={{ height: Spacing.lg }} />

        <Button
          title="Create & Provision Caregiver"
          onPress={handleCreate}
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          disabled={success}
        />
      </Card>

      <View style={{ height: Spacing['2xl'] }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    borderWidth: 1,
    marginBottom: 14,
  },
  bannerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#166534',
  },
  bannerSub: {
    fontSize: 11,
    color: '#15803D',
    marginTop: 2,
    lineHeight: 16,
  },
  successCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
    borderWidth: 1,
    marginBottom: 14,
  },
  successTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#15803D',
  },
  successSub: {
    fontSize: 11,
    color: '#166534',
    marginTop: 1,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    flex: 1,
    fontWeight: '600',
  },
  formCard: {
    padding: 18,
    backgroundColor: '#FFFFFF',
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  assignmentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
  },
  assignmentText: {
    fontSize: 12,
    color: '#1E40AF',
  },
});

