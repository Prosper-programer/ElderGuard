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
  Bluetooth,
  FileText,
  ChevronRight,
  LogOut,
  Stethoscope,
} from 'lucide-react-native';
import { BottomTabBar } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

export default function ParentSettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [healthThresholds, setHealthThresholds] = useState(true);
  const [medicationReminders, setMedicationReminders] = useState(true);
  const [caregiverUpdates, setCaregiverUpdates] = useState(false);

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

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F4FA" />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile & Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card (Blue banner) */}
        <View style={styles.profileCard}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarText}>
              {(user?.name || 'Robert Thompson')
                .split(' ')
                .map((n: string) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'Robert Ngu'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'robert.ngu@elderguard.cm'}</Text>
            <Text style={styles.profilePhone}>{user?.phone || '+237 671 23 45 67'}</Text>
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            activeOpacity={0.8}
            onPress={() => Alert.alert('Edit Profile', `Profile editor for ${user?.name || 'Parent'}.`)}
          >
            <Pencil size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Notifications Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Notifications</Text>

          {/* Emergency & fall alerts */}
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Emergency & fall alerts</Text>
            <Switch
              value={emergencyAlerts}
              onValueChange={setEmergencyAlerts}
              trackColor={{ false: '#E2E8F0', true: '#2563EB' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Health threshold alerts */}
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Health threshold alerts</Text>
            <Switch
              value={healthThresholds}
              onValueChange={setHealthThresholds}
              trackColor={{ false: '#E2E8F0', true: '#2563EB' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Medication reminders */}
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Medication reminders</Text>
            <Switch
              value={medicationReminders}
              onValueChange={setMedicationReminders}
              trackColor={{ false: '#E2E8F0', true: '#2563EB' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Caregiver check-in updates */}
          <View style={[styles.switchRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <Text style={styles.switchLabel}>Caregiver check-in updates</Text>
            <Switch
              value={caregiverUpdates}
              onValueChange={setCaregiverUpdates}
              trackColor={{ false: '#E2E8F0', true: '#2563EB' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Navigation Options List */}
        <View style={[styles.card, styles.cardMenu]}>
          {/* Elderly person profile */}
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => router.push('/(parent)/profile' as any)}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconWrap}>
              <User size={18} color="#2563EB" />
            </View>
            <Text style={styles.menuLabel}>Elderly Person Profile</Text>
            <ChevronRight size={18} color="#CBD5E1" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Add / Create Elderly Person */}
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => router.push('/(parent)/profile/create' as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: '#EFF6FF' }]}>
              <User size={18} color="#3C6FDB" />
            </View>
            <Text style={styles.menuLabel}>+ Add Elderly Loved One</Text>
            <ChevronRight size={18} color="#CBD5E1" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Caregiver Provisioning */}
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => router.push('/(parent)/caregivers/create' as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: '#F0FDF4' }]}>
              <Shield size={18} color="#16A34A" />
            </View>
            <Text style={styles.menuLabel}>+ Add / Provision Caregiver</Text>
            <ChevronRight size={18} color="#CBD5E1" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Doctor Provisioning */}
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => router.push('/(parent)/doctors/create' as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: '#F5F3FF' }]}>
              <Stethoscope size={18} color="#7C3AED" />
            </View>
            <Text style={styles.menuLabel}>+ Add / Link Primary Doctor</Text>
            <ChevronRight size={18} color="#CBD5E1" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Clinical Health Summary for Doctor */}
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => router.push('/(parent)/health-report' as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: '#EFF6FF' }]}>
              <FileText size={18} color="#2563EB" />
            </View>
            <Text style={styles.menuLabel}>Clinical Health Summary (Doctor Report)</Text>
            <ChevronRight size={18} color="#CBD5E1" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Emergency contacts */}
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => router.push('/(parent)/emergency' as any)}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconWrap}>
              <Shield size={18} color="#2563EB" />
            </View>
            <Text style={styles.menuLabel}>Emergency Contacts</Text>
            <ChevronRight size={18} color="#CBD5E1" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Device settings */}
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => router.push('/(parent)/device' as any)}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconWrap}>
              <Bluetooth size={18} color="#2563EB" />
            </View>
            <Text style={styles.menuLabel}>Device Settings</Text>
            <ChevronRight size={18} color="#CBD5E1" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Reports & exports */}
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => router.push('/(parent)/reports' as any)}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconWrap}>
              <FileText size={18} color="#2563EB" />
            </View>
            <Text style={styles.menuLabel}>Reports & Exports</Text>
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
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Bottom Tab Bar */}
      <BottomTabBar activeTab="more" role="parent" />
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
    backgroundColor: '#2563EB',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#2563EB',
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
  profileEmail: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  profilePhone: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
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
    fontWeight: '500',
    color: '#0F172A',
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
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
    flex: 1,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 64,
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
