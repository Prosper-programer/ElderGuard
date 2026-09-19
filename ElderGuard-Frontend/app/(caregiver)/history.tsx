import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Clock,
  CheckCircle,
  Calendar,
} from 'lucide-react-native';
import {
  ScreenContainer,
  BottomTabBar,
  Card,
  TopBar,
} from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';
import { MOCK_TIMELINE_EVENTS } from '@/services/mockData';

export default function CaregiverHistoryScreen() {
  const router = useRouter();

  const typeColors: Record<string, string> = {
    warning: '#EA580C',
    critical: '#DC2626',
    activity: '#3C6FDB',
    caregiver: '#16A34A',
    medication: '#8B5CF6',
  };

  return (
    <ScreenContainer
      scrollable
      padded
      backgroundColor="#F0F4FA"
      bottomBar={<BottomTabBar activeTab="history" role="caregiver" />}
    >
      <TopBar title="Care History & Logs" onBack={() => router.push('/(caregiver)')} />

      {/* Week Summary Gradient Banner */}
      <View style={styles.summaryBanner}>
        <Text style={styles.bannerSubtitle}>THIS WEEK ON SHIFT</Text>
        <View style={styles.metricsRow}>
          <View style={styles.metricCell}>
            <Text style={styles.metricVal}>22</Text>
            <Text style={styles.metricLbl}>Activities</Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricCell}>
            <Text style={styles.metricVal}>18.5<Text style={styles.unitText}>h</Text></Text>
            <Text style={styles.metricLbl}>Hours on shift</Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricCell}>
            <Text style={styles.metricVal}>4</Text>
            <Text style={styles.metricLbl}>Alerts handled</Text>
          </View>
        </View>
      </View>

      {/* Grouped Timelines */}
      {MOCK_TIMELINE_EVENTS.map(({ date, events }) => (
        <View key={date} style={styles.dateGroup}>
          <Text style={styles.dateGroupTitle}>{date}</Text>
          <Card style={styles.timelineCard}>
            {events.map((ev, i) => {
              const dotColor = typeColors[ev.type] || '#94A3B8';
              const isLast = i === events.length - 1;

              return (
                <View key={i} style={styles.timelineRow}>
                  <View style={styles.lineCol}>
                    <View style={[styles.timelineDot, { backgroundColor: dotColor }]} />
                    {!isLast && <View style={styles.timelineLine} />}
                  </View>

                  <View style={styles.contentCol}>
                    <Text style={styles.timelineTime}>{ev.time}</Text>
                    <Text style={styles.timelineText}>{ev.text}</Text>
                  </View>
                </View>
              );
            })}
          </Card>
        </View>
      ))}

      <View style={{ height: Spacing.xl }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  summaryBanner: {
    borderRadius: 22,
    backgroundColor: '#15803D',
    padding: 16,
    marginVertical: 12,
  },
  bannerSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.75)',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricCell: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14,
    paddingVertical: 10,
    marginHorizontal: 3,
  },
  metricDivider: {
    display: 'none',
  },
  metricVal: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  unitText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  metricLbl: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
    fontWeight: '500',
  },
  dateGroup: {
    marginBottom: 14,
  },
  dateGroupTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  timelineCard: {
    padding: 16,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  lineCol: {
    alignItems: 'center',
    width: 14,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 24,
    backgroundColor: '#F1F5F9',
    marginVertical: 2,
  },
  contentCol: {
    flex: 1,
    paddingBottom: 14,
  },
  timelineTime: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  timelineText: {
    fontSize: 13,
    color: '#334155',
    marginTop: 2,
    lineHeight: 18,
  },
});
