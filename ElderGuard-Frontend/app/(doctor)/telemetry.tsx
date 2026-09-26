import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Heart,
  Activity,
  Thermometer,
  Shield,
  Sliders,
  AlertCircle,
  Wifi,
  Battery,
} from 'lucide-react-native';
import { Card, Button } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useElderly } from '@/context/ElderlyContext';
import { useVitals } from '@/context/VitalsContext';
import {
  MOCK_HEART_RATE_HISTORY,
  MOCK_SPO2_HISTORY,
  MOCK_TEMP_HISTORY,
} from '@/services/mockData';

export default function DoctorTelemetryScreen() {
  const { activeProfile } = useElderly();
  const { vitals } = useVitals();

  const [activeTab, setActiveTab] = useState<'heart' | 'spo2' | 'temp'>('heart');

  const seniorName = activeProfile?.fullName || 'Margaret Thompson';

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F3FF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerOverline}>CLINICAL TELEMETRY MONITOR</Text>
        <Text style={styles.headerTitle}>{seniorName}</Text>
        <Text style={styles.headerSubtitle}>
          Continuous sensor feed from GUYNOVA GUARD Band (EG-IOT-4892)
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Metric Selector Tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'heart' && styles.tabBtnActive]}
            onPress={() => setActiveTab('heart')}
            activeOpacity={0.8}
          >
            <Heart size={16} color={activeTab === 'heart' ? '#EF4444' : '#64748B'} />
            <Text style={[styles.tabBtnText, activeTab === 'heart' && styles.tabBtnTextActive]}>
              Heart Rate
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'spo2' && styles.tabBtnActive]}
            onPress={() => setActiveTab('spo2')}
            activeOpacity={0.8}
          >
            <Activity size={16} color={activeTab === 'spo2' ? '#2563EB' : '#64748B'} />
            <Text style={[styles.tabBtnText, activeTab === 'spo2' && styles.tabBtnTextActive]}>
              SpO2 Blood
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'temp' && styles.tabBtnActive]}
            onPress={() => setActiveTab('temp')}
            activeOpacity={0.8}
          >
            <Thermometer size={16} color={activeTab === 'temp' ? '#D97706' : '#64748B'} />
            <Text style={[styles.tabBtnText, activeTab === 'temp' && styles.tabBtnTextActive]}>
              Temperature
            </Text>
          </TouchableOpacity>
        </View>

        {/* Real-time Reading Highlight */}
        <Card style={styles.currentCard}>
          <View style={styles.currentCardRow}>
            <View>
              <Text style={styles.currentLabel}>CURRENT TELEMETRY VALUE</Text>
              <Text style={styles.currentVal}>
                {activeTab === 'heart'
                  ? `${vitals.heartRate?.value || 72} bpm`
                  : activeTab === 'spo2'
                  ? `${vitals.spo2?.value || 97}%`
                  : `${vitals.temperature?.value || 36.8}°C`}
              </Text>
              <Text style={styles.currentStatus}>
                Status: Normal · No clinical anomaly flagged
              </Text>
            </View>

            <View style={styles.hardwareBadge}>
              <View style={styles.hardwareRow}>
                <Wifi size={13} color="#16A34A" />
                <Text style={styles.hardwareText}>Live Sync</Text>
              </View>
              <View style={styles.hardwareRow}>
                <Battery size={13} color="#16A34A" />
                <Text style={styles.hardwareText}>84% Batt</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* 24-Hour Timeline Data Log */}
        <Text style={styles.sectionHeading}>24-HOUR HISTORICAL LOG</Text>
        <Card style={styles.historyCard}>
          {activeTab === 'heart' && (
            <View style={styles.historyList}>
              {MOCK_HEART_RATE_HISTORY.slice(-8).map((point, index) => (
                <View key={index} style={styles.historyRow}>
                  <Text style={styles.historyTime}>{point.time}</Text>
                  <View style={styles.historyBarWrap}>
                    <View
                      style={[
                        styles.historyBar,
                        {
                          width: `${Math.min(100, Math.max(20, ((point.value - 50) / 60) * 100))}%`,
                          backgroundColor: point.value > 90 ? '#EF4444' : '#7C3AED',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.historyVal}>{point.value} bpm</Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'spo2' && (
            <View style={styles.historyList}>
              {MOCK_SPO2_HISTORY.slice(-8).map((point, index) => (
                <View key={index} style={styles.historyRow}>
                  <Text style={styles.historyTime}>{point.time}</Text>
                  <View style={styles.historyBarWrap}>
                    <View
                      style={[
                        styles.historyBar,
                        {
                          width: `${point.value}%`,
                          backgroundColor: point.value < 95 ? '#F59E0B' : '#2563EB',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.historyVal}>{point.value}%</Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'temp' && (
            <View style={styles.historyList}>
              {MOCK_TEMP_HISTORY.map((point, index) => (
                <View key={index} style={styles.historyRow}>
                  <Text style={styles.historyTime}>{point.time}</Text>
                  <View style={styles.historyBarWrap}>
                    <View
                      style={[
                        styles.historyBar,
                        {
                          width: `${((point.value - 35) / 4) * 100}%`,
                          backgroundColor: '#D97706',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.historyVal}>{point.value}°C</Text>
                </View>
              ))}
            </View>
          )}
        </Card>

        {/* Clinical Thresholds Set by Physician */}
        <Text style={styles.sectionHeading}>PHYSICIAN ALERT THRESHOLDS</Text>
        <Card style={styles.thresholdCard}>
          <View style={styles.thresholdRow}>
            <View>
              <Text style={styles.thresholdTitle}>Tachycardia Alert Trigger</Text>
              <Text style={styles.thresholdSub}>Triggers emergency notification to doctor</Text>
            </View>
            <View style={styles.thresholdPill}>
              <Text style={styles.thresholdPillText}>&gt; 110 bpm</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.thresholdRow}>
            <View>
              <Text style={styles.thresholdTitle}>Bradycardia Alert Trigger</Text>
              <Text style={styles.thresholdSub}>Triggers warning to caregiver on duty</Text>
            </View>
            <View style={styles.thresholdPill}>
              <Text style={styles.thresholdPillText}>&lt; 55 bpm</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.thresholdRow}>
            <View>
              <Text style={styles.thresholdTitle}>Hypoxemia Threshold (SpO2)</Text>
              <Text style={styles.thresholdSub}>Triggers immediate respiratory alert</Text>
            </View>
            <View style={[styles.thresholdPill, { backgroundColor: '#FEE2E2', borderColor: '#FECACA' }]}>
              <Text style={[styles.thresholdPillText, { color: '#DC2626' }]}>&lt; 92%</Text>
            </View>
          </View>
        </Card>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#F5F3FF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDE9FE',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerOverline: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#EDE9FE',
    borderRadius: 14,
    padding: 4,
    gap: 6,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },
  currentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EDE9FE',
    marginBottom: 20,
  },
  currentCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  currentLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: 0.5,
  },
  currentVal: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginVertical: 4,
  },
  currentStatus: {
    fontSize: 12,
    color: '#16A34A',
    fontWeight: '600',
  },
  hardwareBadge: {
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    gap: 6,
  },
  hardwareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hardwareText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#15803D',
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  historyList: {
    gap: 12,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyTime: {
    width: 48,
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  historyBarWrap: {
    flex: 1,
    height: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 5,
    overflow: 'hidden',
  },
  historyBar: {
    height: '100%',
    borderRadius: 5,
  },
  historyVal: {
    width: 60,
    textAlign: 'right',
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  thresholdCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  thresholdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  thresholdTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  thresholdSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  thresholdPill: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  thresholdPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
});

