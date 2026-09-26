import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Mail,
  Lock,
  Shield,
  HeartHandshake,
  Stethoscope,
  AlertCircle,
  ChevronRight,
} from 'lucide-react-native';
import { ScreenContainer, Button, TextInput } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';

interface RolePreset {
  role: UserRole;
  label: string;
  badge: string;
  name: string;
  email: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  accentColor: string;
  accentBg: string;
}

const ROLE_PRESETS: RolePreset[] = [
  {
    role: 'parent',
    label: 'parent',
    badge: 'Family Manager',
    name: 'Robert Thompson',
    email: 'robert.thompson@email.com',
    icon: Shield,
    accentColor: '#2563EB',
    accentBg: '#EFF6FF',
  },
  {
    role: 'caregiver',
    label: 'Caregiver',
    badge: 'Professional Care',
    name: 'Sarah Mitchell',
    email: 'caregiver@GUYNOVA GUARD.com',
    icon: HeartHandshake,
    accentColor: '#16A34A',
    accentBg: '#F0FDF4',
  },
  {
    role: 'doctor',
    label: 'Doctor',
    badge: 'Primary Physician',
    name: 'Dr. Jean-Paul Mbarga',
    email: 'doctor@GUYNOVA GUARD.com',
    icon: Stethoscope,
    accentColor: '#7C3AED',
    accentBg: '#F5F3FF',
  },
];

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();
  const { login } = useAuth();

  const initialRole: UserRole =
    params.role === 'doctor'
      ? 'doctor'
      : params.role === 'caregiver'
      ? 'caregiver'
      : 'parent';
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);

  useEffect(() => {
    if (params.role === 'doctor' || params.role === 'caregiver' || params.role === 'parent') {
      setSelectedRole(params.role);
    }
  }, [params.role]);

  const activePreset = ROLE_PRESETS.find((p) => p.role === selectedRole) || ROLE_PRESETS[0];
  const ActiveIcon = activePreset.icon;

  const [email, setEmail] = useState(activePreset.email);
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // When selectedRole changes, update default email
  useEffect(() => {
    setEmail(activePreset.email);
    setError(null);
  }, [selectedRole]);

  const handleToggleRole = () => {
    let nextRole: UserRole = 'parent';
    if (selectedRole === 'parent') nextRole = 'caregiver';
    else if (selectedRole === 'caregiver') nextRole = 'doctor';
    else nextRole = 'parent';
    setSelectedRole(nextRole);
  };

  const handleLogin = async () => {
    setError(null);
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Failed to sign in. Please check your credentials.');
    } else {
      const activeRole = result.user?.role || selectedRole;
      if (activeRole === 'parent') {
        router.replace('/(parent)');
      } else if (activeRole === 'caregiver') {
        router.replace('/(caregiver)');
      } else if (activeRole === 'doctor') {
        router.replace('/(doctor)' as any);
      } else {
        router.replace('/');
      }
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(auth)/welcome' as any);
    }
  };

  return (
    <ScreenContainer scrollable keyboardAvoiding padded backgroundColor={Colors.background}>
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={22} color="#0F172A" />
        </TouchableOpacity>
      </View>

      {/* Screen Header */}
      <View style={styles.header}>
        <View style={[styles.rolePill, { backgroundColor: activePreset.accentBg }]}>
          <ActiveIcon size={16} color={activePreset.accentColor} />
          <Text style={[styles.rolePillText, { color: activePreset.accentColor }]}>
            {activePreset.label} Account
          </Text>
        </View>

        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>
          {selectedRole === 'parent'
            ? 'Sign in to monitor Margaret Thompson and access health telemetry.'
            : selectedRole === 'caregiver'
            ? 'Sign in to access your assigned care schedule and sensor alerts.'
            : 'Sign in to monitor clinical vitals, manage prescriptions, and record consultation notes.'}
        </Text>
      </View>

      {/* ── Active Role Account Card & Login Form ────────────── */}
      <View style={styles.accountCard}>
        {/* Selected Profile Summary */}
        <View style={styles.profileSummaryRow}>
          <View style={[styles.profileAvatar, { backgroundColor: activePreset.accentBg }]}>
            <ActiveIcon size={22} color={activePreset.accentColor} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{activePreset.name}</Text>
            <Text style={styles.profileRoleLabel}>
              {activePreset.label} · {activePreset.badge}
            </Text>
          </View>
        </View>

        {/* Error Alert */}
        {error && (
          <View style={styles.errorBanner}>
            <AlertCircle size={16} color="#DC2626" />
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        {/* Standard Credentials Form */}
        <View style={styles.formSection}>
          <TextInput
            label="Email address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError(null);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon={<Mail size={16} color={Colors.textTertiary} />}
          />

          <View style={{ height: Spacing.md }} />

          <TextInput
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (error) setError(null);
            }}
            secureTextEntry
            leftIcon={<Lock size={16} color={Colors.textTertiary} />}
          />

          <View style={styles.forgotRow}>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* Role-colored Sign In Button */}
          <Button
            title={`Sign In as ${activePreset.label}`}
            onPress={handleLogin}
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            style={{ backgroundColor: activePreset.accentColor, marginTop: Spacing.xs }}
          />

          {/* Switch Role Subtle Toggle */}
          <TouchableOpacity
            style={styles.switchRoleRow}
            onPress={handleToggleRole}
            activeOpacity={0.7}
          >
            <Text style={styles.switchRoleText}>
              Switch to {selectedRole === 'parent' ? 'Caregiver' : selectedRole === 'caregiver' ? 'Doctor' : 'Tutor'} sign in
            </Text>
            <ChevronRight size={14} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Switch to Sign Up (Only for Tutors) */}
      {selectedRole !== 'parent' ? (
        <View style={styles.caregiverNotice}>
          <Text style={styles.caregiverNoticeText}>
            {selectedRole === 'caregiver'
              ? 'Caregiver accounts are created by the senior\'s family manager. Contact the Tutor if you need login credentials.'
              : 'Doctor accounts are provisioned by families or healthcare partners. Log in with your assigned clinical credentials.'}
          </Text>
        </View>
      ) : (
        <View style={styles.footer}>
          <Text style={styles.footerText}>{"Don't have an account?"}</Text>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/signup')}
            activeOpacity={0.7}
          >
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  navBar: {
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  rolePill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },
  rolePillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    ...Typography.h1,
    fontSize: 28,
    color: '#0F172A',
    fontWeight: '800',
  },
  subtitle: {
    ...Typography.body,
    fontSize: 14,
    color: '#64748B',
    marginTop: Spacing.xs,
    lineHeight: 20,
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  profileSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 16,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  profileRoleLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
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
    marginBottom: 16,
  },
  errorBannerText: {
    fontSize: 13,
    color: '#DC2626',
    flex: 1,
  },
  formSection: {
    gap: 4,
  },
  forgotRow: {
    alignItems: 'flex-end',
    marginTop: 4,
    marginBottom: 14,
  },
  forgotText: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '600',
  },
  switchRoleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 12,
    marginTop: 6,
  },
  switchRoleText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 24,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#64748B',
  },
  footerLink: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '700',
  },
  caregiverNotice: {
    marginTop: 24,
    marginBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  caregiverNoticeText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
});

