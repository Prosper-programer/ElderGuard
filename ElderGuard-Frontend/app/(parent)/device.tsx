import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Battery,
  Wifi,
  Radio,
  Cpu,
  Shield,
  Activity,
  CheckCircle,
  RefreshCw,
  Bell,
} from 'lucide-react-native';
import {
  ScreenContainer,
  Card,
  TopBar,
  SectionHeader,
  Button,
} from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';
import { MOCK_ELDERLY_PERSON, MOCK_VITALS } from '@/services/mockData';

export default function DeviceStatusScreen() {
  const router = useRouter();
  const [pinging, setPinging] = useState(false);

  const handlePing = () => {
    setPinging(true);
    setTimeout(() => {
      setPinging(false);
      Alert.alert('Device Pinged', 'Smart Band EG-IOT-4892 vibrated and chimed successfully.');
    }, 1200);
  };

  return (
    <ScreenContainer
      scrollable
      padded
      backgroundColor="#F0F4FA"
    >
      <TopBar title="Device Status" onBack={() => router.back()} />

      {/* Hero Band Card */}
      <Card style={styles.heroBandCard}>
        <View style={styles.bandIconCircle}>
          <Shield size={32} color={Colors.primary} />
        </View>

        <Text style={styles.bandModel}>ElderGuard Smart Band</Text>
        <Text style={styles.bandSerial}>ID: {MOCK_ELDERLY_PERSON.deviceId}</Text>

        <View style={styles.statusPill}>
          <View style={styles.greenDot} />
          <Text style={styles.statusPillText}>CONNECTED & TRANSMITTING</Text>
        </View>

        <View style={styles.specsRow}>
          <View style={styles.specItem}>
            <Text style={styles.specVal}>84%</Text>
            <Text style={styles.specLbl}>Battery (~36h)</Text>
          </View>
          <View style={styles.specDivider} />
          <View style={styles.specItem}>
            <Text style={styles.specVal}>v2.4.1</Text>
            <Text style={styles.specLbl}>Firmware</Text>
          </View>
          <View style={styles.specDivider} />
          <View style={styles.specItem}>
            <Text style={styles.specVal}>-78 dBm</Text>
            <Text style={styles.specLbl}>Signal (LTE-M)</Text>
          </View>
        </View>
      </Card>

      {/* Telemetry & Links */}
      <View style={styles.sectionWrap}>
        <SectionHeader title="Connectivity Diagnostics" />
        <Card style={styles.cardZeroPadding}>
          {[
            {
              icon: Wifi,
              title: 'BLE 5.2 Bluetooth Link',
              detail: 'Directly linked to caregiver base station',
              status: 'Connected',
              color: Colors.safe,
            },
            {
              icon: Radio,
              title: 'Cellular NB-IoT / LTE-M',
              detail: 'Autonomous failover network active',
              status: 'Active',
              color: Colors.safe,
            },
            {
              icon: Cpu,
              title: 'Embedded Firmware OS',
              detail: 'ARM Cortex-M33 Real-Time Kernel',
              status: 'Up to date',
              color: Colors.primary,
            },
          ].map((item, i) => (
            <View
              key={item.title}
              style={[styles.diagRow, i === 2 && { borderBottomWidth: 0 }]}
            >
              <View style={styles.diagIconWrap}>
                <item.icon size={18} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.diagTitle}>{item.title}</Text>
                <Text style={styles.diagDetail}>{item.detail}</Text>
              </View>
              <View style={[styles.diagBadge, { backgroundColor: item.color + '15' }]}>
                <Text style={[styles.diagBadgeText, { color: item.color }]}>{item.status}</Text>
              </View>
            </View>
          ))}
        </Card>
      </View>

      {/* Biosensor Modules */}
      <View style={styles.sectionWrap}>
        <SectionHeader title="Biosensors & Hardware Modules" />
        <Card style={styles.cardZeroPadding}>
          {[
            { name: 'PPG Optical Heart & SpO₂ Sensor', rate: '25 Hz Sampling', ok: true },
            { name: '6-Axis IMU Fall Detection Accelerometer', rate: '50 Hz Trigger (3.0g)', ok: true },
            { name: 'Skin Contact Thermistor', rate: 'Continuous (±0.1°C)', ok: true },
            { name: 'Capacitive Wear Detection Sensor', rate: 'Worn on wrist', ok: true },
          ].map((sensor, i) => (
            <View
              key={sensor.name}
              style={[styles.sensorRow, i === 3 && { borderBottomWidth: 0 }]}
            >
              <CheckCircle size={16} color={Colors.safe} />
              <View style={{ flex: 1 }}>
                <Text style={styles.sensorName}>{sensor.name}</Text>
                <Text style={styles.sensorRate}>{sensor.rate}</Text>
              </View>
              <Text style={styles.sensorOkText}>Operational</Text>
            </View>
          ))}
        </Card>
      </View>

      {/* Ping Band Action Button */}
      <View style={{ marginTop: 8 }}>
        <Button
          variant="outline"
          fullWidth
          disabled={pinging}
          onClick={handlePing}
        >
          <Bell size={16} color={Colors.primary} />
          {pinging ? 'Pinging Band...' : 'Ping Band (Locate in Room)'}
        </Button>
      </View>

      <View style={{ height: Spacing.xl }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroBandCard: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  bandIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  bandModel: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  bandSerial: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.safeBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.safe,
    letterSpacing: 0.5,
  },
  specsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  specItem: {
    flex: 1,
    alignItems: 'center',
  },
  specDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  specVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  specLbl: {
    fontSize: 9,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '600',
  },
  sectionWrap: {
    marginBottom: 14,
  },
  cardZeroPadding: {
    padding: 0,
    overflow: 'hidden',
  },
  diagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  diagIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diagTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  diagDetail: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  diagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  diagBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  sensorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 10,
  },
  sensorName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  sensorRate: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },
  sensorOkText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.safe,
  },
});
