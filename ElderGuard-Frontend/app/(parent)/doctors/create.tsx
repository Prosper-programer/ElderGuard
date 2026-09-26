import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Stethoscope,
  Mail,
  Phone,
  Lock,
  Building2,
  Award,
  Shield,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react-native';
import { ScreenContainer, Button, TextInput, Card, TopBar } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useElderly } from '@/context/ElderlyContext';

export default function CreateDoctorScreen() {
  const router = useRouter();
  const { provisionDoctor, activeProfile } = useElderly();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [specialty, setSpecialty] = useState('Geriatric Medicine');
  const [hospital, setHospital] = useState("St. Thomas' Hospital, London");
  const [password, setPassword] = useState('password123');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCreate = async () => {
    setError(null);
    if (!fullName.trim()) {
      setError('Please enter the physician’s full name (e.g. Dr. Jean-Paul Mbarga).');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address for doctor login.');
      return;
    }
    if (!phoneNumber.trim()) {
      setError('Please enter the doctor’s direct emergency phone number.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const res = await provisionDoctor({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phoneNumber: phoneNumber.trim(),
      password,
    });
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Failed to create doctor account.');
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
      <TopBar title="Link / Provision Doctor" onBack={handleBack} />

      {/* ── Explanation Banner ────────────────────────────────── */}
      <Card style={styles.bannerCard}>
        <View style={styles.bannerIconWrap}>
          <Stethoscope size={20} color="#7C3AED" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>Doctor Account Provisioning</Text>
          <Text style={styles.bannerSub}>
            Provision access for your loved one&apos;s primary doctor. They can log in to view real-time vital telemetry, review incident logs, and write consultation notes.
          </Text>
        </View>
      </Card>

      {success && (
        <Card style={styles.successCard}>
          <CheckCircle2 size={24} color="#16A34A" />
          <View style={{ flex: 1 }}>
            <Text style={styles.successTitle}>Doctor Account Ready!</Text>
            <Text style={styles.successSub}>
              Credentials created. The physician can now sign in with role &apos;Doctor&apos;.
            </Text>
          </View>
        </Card>
      )}

      {error && (
        <Card style={styles.errorCard}>
          <AlertCircle size={20} color="#DC2626" />
          <Text style={styles.errorText}>{error}</Text>
        </Card>
      )}

      {/* ── Form Fields ───────────────────────────────────────── */}
      <Text style={styles.sectionLabel}>PHYSICIAN DETAILS</Text>
      <Card style={styles.card}>
        <TextInput
          label="Doctor Full Name *"
          value={fullName}
          onChangeText={(t) => {
            setFullName(t);
            if (error) setError(null);
          }}
          placeholder="e.g. Dr. Jean-Paul Mbarga"
          leftIcon={<Stethoscope size={16} color="#64748B" />}
        />

        <View style={styles.spacing} />

        <TextInput
          label="Medical Specialty"
          value={specialty}
          onChangeText={setSpecialty}
          placeholder="e.g. Cardiologie & Médecine Gériatrique"
          leftIcon={<Award size={16} color="#64748B" />}
        />

        <View style={styles.spacing} />

        <TextInput
          label="Clinic / Hospital Affiliation"
          value={hospital}
          onChangeText={setHospital}
          placeholder="e.g. Hôpital Central de Yaoundé"
          leftIcon={<Building2 size={16} color="#64748B" />}
        />

        <View style={styles.spacing} />

        <TextInput
          label="Direct Phone Number *"
          value={phoneNumber}
          onChangeText={(t) => {
            setPhoneNumber(t);
            if (error) setError(null);
          }}
          keyboardType="phone-pad"
          placeholder="e.g. +237 655 89 12 34"
          leftIcon={<Phone size={16} color="#64748B" />}
        />
      </Card>

      <View style={{ height: Spacing.md }} />

      <Text style={styles.sectionLabel}>DOCTOR LOGIN CREDENTIALS</Text>
      <Card style={styles.card}>
        <TextInput
          label="Login Email Address *"
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            if (error) setError(null);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="e.g. doctor@GUYNOVA GUARD.com"
          leftIcon={<Mail size={16} color="#64748B" />}
          helperText="The physician will use this email address to log into their portal"
        />

        <View style={styles.spacing} />

        <TextInput
          label="Initial Password *"
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            if (error) setError(null);
          }}
          secureTextEntry
          placeholder="At least 6 characters"
          leftIcon={<Lock size={16} color="#64748B" />}
          helperText="Share this temporary password securely with the physician"
        />
      </Card>

      {/* ── Submit Buttons ────────────────────────────────────── */}
      <View style={styles.actions}>
        <Button
          title="Create Doctor Account"
          onPress={handleCreate}
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          style={{ backgroundColor: '#7C3AED' }}
        />

        <View style={{ height: Spacing.sm }} />

        <Button
          title="Cancel"
          onPress={handleBack}
          variant="secondary"
          size="lg"
          fullWidth
        />
      </View>

      <View style={{ height: 40 }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#F5F3FF',
    borderColor: '#DDD6FE',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: Spacing.md,
  },
  bannerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7C3AED',
  },
  bannerSub: {
    fontSize: 12,
    color: '#6B21A8',
    marginTop: 2,
    lineHeight: 18,
  },
  successCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: Spacing.md,
  },
  successTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16A34A',
  },
  successSub: {
    fontSize: 12,
    color: '#15803D',
    marginTop: 2,
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: Spacing.md,
  },
  errorText: {
    fontSize: 13,
    color: '#DC2626',
    flex: 1,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: Spacing.sm,
  },
  spacing: {
    height: Spacing.md,
  },
  actions: {
    marginTop: Spacing.lg,
  },
});

