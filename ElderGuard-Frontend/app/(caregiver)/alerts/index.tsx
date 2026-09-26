import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ShieldAlert,
  Heart,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Activity,
} from 'lucide-react-native';
import {
  ScreenContainer,
  Card,
  BottomTabBar,
  TopBar,
  AlertItem,
} from '@/components/ui';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { useAlerts } from '@/context/AlertContext';
import { MOCK_ALERTS_LIST, MOCK_ELDERLY_PERSON, MOCK_CAREGIVER } from '@/services/mockData';

export default function CaregiverAlertsScreen() {
  const router = useRouter();
    const { activeProfile } = useElderly();
  const { alerts } = useAlerts();

  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  const combinedAlerts = alerts.length > 0 ? alerts : MOCK_ALERTS_LIST;

  const filteredAlerts = combinedAlerts.filter((a: any) => {
    const sev = (a.severity || a.type || 'info').toLowerCase();
    if (activeTab === 'critical') return sev === 'critical';
    if (activeTab === 'warning') return sev === 'warning';
    if (activeTab === 'info') return sev === 'info';
    return true;
  });

  return (
    <ScreenContainer
      scrollable
      padded
      backgroundColor="#F0F4FA"
      bottomBar={<BottomTabBar activeTab="alerts" role="caregiver" />}
    >
      <TopBar
        title="Alerts & Incidents"
        onBack={() => (router.canGoBack() ? router.back() : router.replace('/(caregiver)' as any))}
      />

      {/* Filter Tabs matching Figma & Tutor design */}
      <View style={styles.tabContainer}>
        {(['all', 'critical', 'warning', 'info'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Caregiver Duty Status Banner (Replaces Tutor simulation controls) */}
      <Card style={styles.dutyCard}>
        <View style={styles.dutyHeader}>
          <View style={styles.dutyBadge}>
            <View style={styles.activeDot} />
            <Text style={styles.dutyBadgeText}>ON DUTY · RESPONSE READY</Text>
          </View>
          <Text style={styles.dutySeniorName}>{(activeProfile?.fullName || 'Patient')}</Text>
        </View>
        <Text style={styles.dutySubtext}>
          Assigned to {MOCK_CAREGIVER.name} ({MOCK_CAREGIVER.shiftStart}–{MOCK_CAREGIVER.shiftEnd}). Real-time telemetry monitored.
        </Text>
      </Card>

      {/* Alert Feed matching Tutor UI */}
      <View style={{ marginTop: 8 }}>
        {filteredAlerts.length === 0 ? (
          <Card style={styles.emptyCard}>
            <CheckCircle2 size={36} color={Colors.safe} />
            <Text style={styles.emptyTitle}>No Incidents Found</Text>
            <Text style={styles.emptySub}>
              {(activeProfile?.fullName || 'Patient')} is safe and vitals are normal.
            </Text>
          </Card>
        ) : (
          filteredAlerts.map((a: any) => {
            const type = (a.severity || a.type || 'info') as 'critical' | 'warning' | 'info';
            const isResolved = a.status === 'resolved' || a.resolved === true;

            return (
              <AlertItem
                key={a.id}
                type={type === 'critical' ? 'critical' : type === 'warning' ? 'warning' : 'info'}
                title={a.title}
                description={a.description}
                time={
                  a.time ||
                  (a.createdAt
                    ? new Date(a.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Just now')
                }
                date={a.date || 'Today'}
                resolved={isResolved}
                onPress={() => {
                  router.push(`/(caregiver)/alerts/${a.id}` as any);
                }}
              />
            );
          })
        )}
      </View>

      <View style={{ height: Spacing.xl }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    padding: 4,
    marginVertical: 12,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },
  dutyCard: {
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 3,
    borderLeftColor: '#16A34A',
  },
  dutyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  dutyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  dutyBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
    letterSpacing: 0.5,
  },
  dutySeniorName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  dutySubtext: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
    marginTop: 2,
  },
  emptyCard: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
});
