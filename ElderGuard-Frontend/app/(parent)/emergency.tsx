import React, { useState, useEffect, useRef } from 'react';
import { useElderly } from '@/context/ElderlyContext';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { useElderly } from '@/context/ElderlyContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useElderly } from '@/context/ElderlyContext';
import { useRouter } from 'expo-router';
import { useElderly } from '@/context/ElderlyContext';
import {
  AlertTriangle,
  Phone,
  Shield,
  MessageSquare,
  MapPin,
  Check,
  X,
} from 'lucide-react-native';
import { useElderly } from '@/context/ElderlyContext';
import { MOCK_ELDERLY_PERSON, MOCK_DOCTOR, MOCK_CAREGIVER } from '@/services/mockData';

export default function EmergencyScreen() {
  const router = useRouter();
  const { activeProfile } = useElderly();
  const [called, setCalled] = useState(false);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.18,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1.0,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [bounceAnim]);

  const handleCallEmergency = () => {
    setCalled(true);
    Linking.openURL('tel:119').catch(() => {
      Alert.alert(
        'Calling Emergency Services',
        'Simulated 119 dispatch call initiated to Cameroon Emergency Services.'
      );
    });
  };

  const handleDoctorStatus = () => {
    router.push('/(Tutor)/doctor-status' as any);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#220404" />
      {/* Top Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeBtn}
          activeOpacity={0.7}
        >
          <X size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerTitleCol}>
          <Text style={styles.headerSubtitle}>EMERGENCY ALERT</Text>
          <Text style={styles.headerTitle}>Immediate attention required</Text>
        </View>

        <View style={styles.activePill}>
          <View style={styles.activeDot} />
          <Text style={styles.activeText}>ACTIVE</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Central Pulsing Red Rings with Alert Symbol */}
        <View style={styles.sosContainer}>
          <View style={styles.ring3}>
            <View style={styles.ring2}>
              <View style={styles.ring1}>
                <Animated.View
                  style={[
                    styles.centerRedCircle,
                    { transform: [{ scale: bounceAnim }] },
                  ]}
                >
                  <AlertTriangle size={32} color="#FFFFFF" strokeWidth={2.5} />
                </Animated.View>
              </View>
            </View>
          </View>

          <Text style={styles.fallLabel}>FALL DETECTED</Text>
          <Text style={styles.seniorName}>{(activeProfile?.fullName || 'Patient')}</Text>
          <Text style={styles.seniorLocation}>
            {MOCK_ELDERLY_PERSON.address} · 10:15 AM
          </Text>
        </View>

        {/* Vitals at Time of Fall Card */}
        <View style={styles.vitalsBox}>
          <Text style={styles.vitalsBoxHeading}>VITALS AT TIME OF FALL</Text>
          <View style={styles.vitalsGrid}>
            {/* Heart Rate */}
            <View style={[styles.vitalCell, styles.vitalCellAlert]}>
              <Text style={styles.vitalNum}>
                108<Text style={styles.vitalUnit}>bpm</Text>
              </Text>
              <Text style={styles.vitalName}>Heart Rate</Text>
              <Text style={styles.alertBadge}>▲ HIGH</Text>
            </View>

            {/* SpO2 */}
            <View style={[styles.vitalCell, styles.vitalCellAlert]}>
              <Text style={styles.vitalNum}>
                94<Text style={styles.vitalUnit}>%</Text>
              </Text>
              <Text style={styles.vitalName}>SpO₂</Text>
              <Text style={styles.alertBadge}>▲ HIGH</Text>
            </View>

            {/* Temperature */}
            <View style={styles.vitalCell}>
              <Text style={styles.vitalNum}>
                37.2<Text style={styles.vitalUnit}>°C</Text>
              </Text>
              <Text style={styles.vitalName}>Temperature</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          {/* Call 999 Button */}
          <TouchableOpacity
            style={styles.callBtn}
            onPress={handleCallEmergency}
            activeOpacity={0.88}
          >
            <Phone size={19} color="#DC2626" />
            <Text style={styles.callBtnText}>
              {called ? 'Emergency Services Contacted' : 'Call Emergency Services \u2014 119'}
            </Text>
          </TouchableOpacity>

          {/* First Aid & Doctor Status Buttons */}
          <View style={styles.subActionsRow}>
            <TouchableOpacity
              style={styles.subBtn}
              onPress={() => router.push('/(Tutor)/first-aid' as any)}
              activeOpacity={0.8}
            >
              <Shield size={16} color="#FFFFFF" />
              <Text style={styles.subBtnText}>First Aid</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.subBtn}
              onPress={handleDoctorStatus}
              activeOpacity={0.8}
            >
              <MessageSquare size={16} color="#FFFFFF" />
              <Text style={styles.subBtnText}>Doctor Status</Text>
            </TouchableOpacity>
          </View>

          {/* View Location link */}
          <TouchableOpacity
            style={styles.locationLink}
            onPress={() => router.push('/(Tutor)/location' as any)}
            activeOpacity={0.7}
          >
            <MapPin size={14} color="rgba(255, 255, 255, 0.6)" />
            <Text style={styles.locationLinkText}>View Location</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications Sent Card */}
        <View style={styles.notificationsCard}>
          <Text style={styles.notificationsHeading}>NOTIFICATIONS SENT</Text>

          <View style={styles.notificationRow}>
            <View style={styles.checkCircle}>
              <Check size={11} color="#22C55E" strokeWidth={3} />
            </View>
            <Text style={styles.notificationText}>SMS to Dr. Jean-Paul Mbarga</Text>
            <Text style={styles.notificationTime}>10:15 AM</Text>
          </View>

          <View style={styles.notificationRow}>
            <View style={styles.checkCircle}>
              <Check size={11} color="#22C55E" strokeWidth={3} />
            </View>
            <Text style={styles.notificationText}>Auto-call to Dr. Jean-Paul Mbarga</Text>
            <Text style={styles.notificationTime}>10:16 AM</Text>
          </View>

          <View style={styles.notificationRow}>
            <View style={styles.checkCircle}>
              <Check size={11} color="#22C55E" strokeWidth={3} />
            </View>
            <Text style={styles.notificationText}>Push notification to Sarah Mitchell</Text>
            <Text style={styles.notificationTime}>10:15 AM</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#280606',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleCol: {
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#EF4444',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 1,
    letterSpacing: -0.2,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  activeText: {
    color: '#EF4444',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 32,
    alignItems: 'center',
  },
  sosContainer: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 20,
  },
  ring3: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(220, 38, 38, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  ring2: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(220, 38, 38, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring1: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(220, 38, 38, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerRedCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },
  fallLabel: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  seniorName: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
    textAlign: 'center',
  },
  seniorLocation: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
    textAlign: 'center',
  },
  vitalsBox: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  vitalsBoxHeading: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 12,
    textAlign: 'center',
  },
  vitalsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  vitalCell: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  vitalCellAlert: {
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    borderColor: 'rgba(220, 38, 38, 0.35)',
  },
  vitalNum: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  vitalUnit: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  vitalName: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10.5,
    marginTop: 2,
    fontWeight: '600',
  },
  alertBadge: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 4,
  },
  actionSection: {
    width: '100%',
    gap: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  callBtn: {
    width: '100%',
    height: 54,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  callBtnText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '800',
  },
  subActionsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  subBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  subBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  locationLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  locationLinkText: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 13,
    fontWeight: '600',
  },
  notificationsCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.09)',
    padding: 16,
  },
  notificationsHeading: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 14,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 10,
  },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    flex: 1,
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12.5,
    fontWeight: '500',
  },
  notificationTime: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 11,
    fontWeight: '600',
  },
});
