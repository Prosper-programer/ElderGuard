import { useElderly } from '@/context/ElderlyContext';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  AlertTriangle,
  ShieldAlert,
  Heart,
  Battery,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react-native';
import {
  ScreenContainer,
  Card,
  StatusBadge,
  BottomTabBar,
  TopBar,
  AlertItem,
} from '@/components/ui';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { useAlerts } from '@/context/AlertContext';
import { useVitals } from '@/context/VitalsContext';
import { MOCK_ALERTS_LIST } from '@/services/mockData';

export default function AlertsListScreen() {
  const router = useRouter();
    const { activeProfile } = useElderly();
  const { alerts, triggerAlert, acknowledgeAlert, resolveAlert } = useAlerts();
  const { simulateAnomaly, resetToNormal } = useVitals();

  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  const combinedAlerts = alerts.length > 0 ? alerts : MOCK_ALERTS_LIST;

  const filteredAlerts = combinedAlerts.filter((a: any) => {
    const sev = (a.severity || a.type || 'info').toLowerCase();
    if (activeTab === 'critical') return sev === 'critical';
    if (activeTab === 'warning') return sev === 'warning';
    if (activeTab === 'info') return sev === 'info';
    return true;
  });

  const handleSimulateFall = () => {
    simulateAnomaly('fall');
    triggerAlert({
      type: 'fall',
      severity: 'critical',
      title: 'Fall Detected',
      description: 'Wearable sensor detected a sudden 3.4g impact in Kitchen.',
      elderlyId: activeProfile?.id?.toString() || 'unknown',
      elderlyName: activeProfile?.fullName || 'Patient',
      location: 'Ground Floor, Kitchen',
      vitalReadings: {
        heartRate: 119,
        spo2: 94,
        impactGForce: 3.4,
      },
    });
  };

  const handleSimulateTachycardia = () => {
    simulateAnomaly('tachycardia');
    triggerAlert({
      type: 'heart_rate',
      severity: 'warning',
      title: 'Elevated Heart Rate',
      description: 'Heart rate reached 91 bpm during morning activity.',
      elderlyId: activeProfile?.id?.toString() || 'unknown',
      elderlyName: activeProfile?.fullName || 'Patient',
      location: 'Living Room',
      vitalReadings: {
        heartRate: 91,
        spo2: 97,
      },
    });
  };

  return (
    <ScreenContainer
      scrollable
      padded
      backgroundColor="#F0F4FA"
      bottomBar={<BottomTabBar activeTab="alerts" role="parent" />}
    >
      <TopBar
        title="Alerts & Incidents"
        onBack={() => (router.canGoBack() ? router.back() : router.replace('/(Tutor)' as any))}
      />

      {/* Filter Tabs matching Figma */}
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

      {/* Live Simulation Testing Bar */}
      <Card style={styles.simCard}>
        <View style={styles.simHeader}>
          <Sparkles size={14} color={Colors.primary} />
          <Text style={styles.simTitle}>SIMULATE TELEMETRY ALERTS</Text>
        </View>
        <View style={styles.simRow}>
          <TouchableOpacity
            onPress={handleSimulateFall}
            style={[styles.simBtn, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}
            activeOpacity={0.8}
          >
            <ShieldAlert size={13} color="#DC2626" />
            <Text style={[styles.simBtnText, { color: '#DC2626' }]}>Trigger Fall</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSimulateTachycardia}
            style={[styles.simBtn, { backgroundColor: '#FFF7ED', borderColor: '#FED7AA' }]}
            activeOpacity={0.8}
          >
            <Heart size={13} color="#EA580C" />
            <Text style={[styles.simBtnText, { color: '#EA580C' }]}>Spike Pulse</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => resetToNormal()}
            style={[styles.simBtn, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}
            activeOpacity={0.8}
          >
            <Zap size={13} color="#16A34A" />
            <Text style={[styles.simBtnText, { color: '#16A34A' }]}>Normalize</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Alert Feed */}
      <View style={{ marginTop: 8 }}>
        {filteredAlerts.length === 0 ? (
          <Card style={styles.emptyCard}>
            <CheckCircle2 size={36} color={Colors.safe} />
            <Text style={styles.emptyTitle}>No Incidents Found</Text>
            <Text style={styles.emptySub}>All health systems and telemetry are normal.</Text>
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
                time={a.time || (a.createdAt ? new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now')}
                date={a.date || 'Today'}
                resolved={isResolved}
                onPress={() => {
                  if (type === 'critical' || a.type === 'fall' || a.title?.toLowerCase().includes('fall')) {
                    router.push('/(Tutor)/emergency' as any);
                  } else {
                    router.push(`/(Tutor)/alerts/${a.id}` as any);
                  }
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
  simCard: {
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  simHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  simTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  simRow: {
    flexDirection: 'row',
    gap: 8,
  },
  simBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  simBtnText: {
    fontSize: 10,
    fontWeight: '700',
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
