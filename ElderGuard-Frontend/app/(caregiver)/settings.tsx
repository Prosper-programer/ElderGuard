import { useElderly } from '@/context/ElderlyContext';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Pencil,
  User,
  Shield,
  FileText,
  ChevronRight,
  LogOut,
  HeartHandshake,
  CheckCircle,
} from 'lucide-react-native';
import { BottomTabBar } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { MOCK_CAREGIVER, MOCK_ELDERLY_PERSON } from '@/services/mockData';

export default function CaregiverSettingsScreen() {
  const router = useRouter();
  const { activeProfile } = useElderly();
  const { logout } = useAuth();

  const [onDuty, setOnDuty] = useState(true);
  const [fallAlerts, setFallAlerts] = useState(true);
  const [medicationReminders, setMedicationReminders] = useState(true);
  const [shiftHandovers, setShiftHandovers] = useState(true);

  const handleSignOut = () => {
    const doLogout = async () => {
      try {
        await logout();
      } catch (e) {
        console.error('Logout error:', e);
      } finally {
        router.replace('/(auth)/welcome' as any);
      }
    };

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm('Are you sure you want to sign out?')) {
        doLogout();
      }
    } else {
      Alert.alert('Sign out', 'Are you sure you want to sign out?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: doLogout,
        },
      ]);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(caregiver)' as any);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F4FA" />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Caregiver Profile & Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Caregiver Profile Banner (Emerald) */}
        <View style={styles.profileCard}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarText}>SM</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{MOCK_CAREGIVER.name}</Text>
            <Text style={styles.profileRole}>Certified Nursing Assistant · St. Jude</Text>
            <Text style={styles.profileEmail}>sarah.mitchell@care.org</Text>
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            activeOpacity={0.8}
            onPress={() => Alert.alert('Caregiver Profile', 'Profile editor for Sarah Mitchell.')}
          >
            <Pencil size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Active Duty Status Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Duty Status</Text>
          <View style={styles.switchRow}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.switchLabel}>
                {onDuty ? 'On Active Duty' : 'Off Duty'}
              </Text>
              <Text style={styles.switchSub}>
                {onDuty
                  ? `Active shift · ${MOCK_CAREGIVER.shiftStart}–${MOCK_CAREGIVER.shiftEnd}. Receiving live sensor telemetry.`
                  : 'Alerts forwarded to primary family contact.'}
              </Text>
            </View>
            <Switch
              value={onDuty}
              onValueChange={setOnDuty}
              trackColor={{ false: '#E2E8F0', true: '#16A34A' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Notifications Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Care Notifications</Text>

          {/* Critical Emergency & Fall Alerts */}
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Emergency & fall notifications</Text>
            <Switch
              value={fallAlerts}
              onValueChange={setFallAlerts}
              trackColor={{ false: '#E2E8F0', true: '#16A34A' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Medication reminders */}
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Scheduled medication reminders</Text>
            <Switch
              value={medicationReminders}
              onValueChange={setMedicationReminders}
              trackColor={{ false: '#E2E8F0', true: '#16A34A' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Shift Handover updates */}
          <View style={[styles.switchRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <Text style={styles.switchLabel}>Shift handover updates</Text>
            <Switch
              value={shiftHandovers}
              onValueChange={setShiftHandovers}
              trackColor={{ false: '#E2E8F0', true: '#16A34A' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Care Coordination List */}
        <View style={[styles.card, styles.cardMenu]}>
          {/* Assigned Senior */}
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => router.push('/(caregiver)/profile' as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: '#F0FDF4' }]}>
              <User size={18} color="#16A34A" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuLabel}>Assigned Senior</Text>
              <Text style={styles.menuSub}>{(activeProfile?.fullName || 'Patient')} · {MOCK_ELDERLY_PERSON.room}</Text>
            </View>
            <ChevronRight size={18} color="#CBD5E1" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Shift Handover Notes */}
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => Alert.alert('Shift Handover', 'Shift notes submitted for next on-duty nurse.')}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: '#F0FDF4' }]}>
              <FileText size={18} color="#16A34A" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuLabel}>Shift Handover Notes</Text>
              <Text style={styles.menuSub}>Morning and afternoon routine logged</Text>
            </View>
            <ChevronRight size={18} color="#CBD5E1" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Emergency First Aid Protocols */}
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => router.push('/(Tutor)/first-aid' as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: '#F0FDF4' }]}>
              <Shield size={18} color="#16A34A" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuLabel}>Emergency First Aid Guide</Text>
              <Text style={styles.menuSub}>Standard fall recovery protocols</Text>
            </View>
            <ChevronRight size={18} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <LogOut size={18} color="#EF4444" />
          <Text style={styles.signOutText}>Sign out of Caregiver Portal</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Bottom Tab Bar with More active */}
      <BottomTabBar activeTab="more" role="caregiver" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F0F4FA',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  profileCard: {
    backgroundColor: '#059669',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
    gap: 14,
  },
  avatarBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileRole: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
    fontWeight: '600',
  },
  profileEmail: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  editBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  switchSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 16,
  },
  cardMenu: {
    padding: 0,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  menuIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  menuSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 66,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 24,
    paddingVertical: 14,
    marginTop: 4,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
  },
});
