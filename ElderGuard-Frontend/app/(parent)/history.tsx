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
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { BottomTabBar } from '@/components/ui';

interface HistoryItem {
  id: string;
  time: string;
  title: string;
  dotColor: string;
  category: 'all' | 'health' | 'alerts' | 'care' | 'medications';
}

interface HistoryGroup {
  date: string;
  items: HistoryItem[];
}

export default function HistoryScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Health' | 'Alerts' | 'Care' | 'Medications'>('Medications');

  const filters: ('All' | 'Health' | 'Alerts' | 'Care' | 'Medications')[] = [
    'All',
    'Health',
    'Alerts',
    'Care',
    'Medications',
  ];

  const historyGroups: HistoryGroup[] = [
    {
      date: 'TODAY, 25 AUG',
      items: [
        {
          id: '1',
          time: '09:32',
          title: 'Elevated heart rate (91 bpm) during morning walk',
          dotColor: '#EA580C',
          category: 'health',
        },
        {
          id: '2',
          time: '09:00',
          title: 'Physiotherapy session completed — 30 min',
          dotColor: '#2563EB',
          category: 'care',
        },
        {
          id: '3',
          time: '08:30',
          title: 'Sarah Mitchell: Morning wellness check completed',
          dotColor: '#16A34A',
          category: 'care',
        },
        {
          id: '4',
          time: '08:07',
          title: 'Morning medications taken — Aspirin, Lisinopril',
          dotColor: '#8B5CF6',
          category: 'medications',
        },
        {
          id: '5',
          time: '07:00',
          title: 'Wake up detected by motion sensor',
          dotColor: '#2563EB',
          category: 'health',
        },
      ],
    },
    {
      date: 'YESTERDAY, 24 AUG',
      items: [
        {
          id: '6',
          time: '19:00',
          title: 'Evening medications taken — Metformin 500mg',
          dotColor: '#8B5CF6',
          category: 'medications',
        },
        {
          id: '7',
          time: '10:15',
          title: 'Fall detected — assessed by Sarah, Dr Hargreaves notified',
          dotColor: '#DC2626',
          category: 'alerts',
        },
        {
          id: '8',
          time: '08:07',
          title: 'Morning medications taken on time',
          dotColor: '#8B5CF6',
          category: 'medications',
        },
      ],
    },
  ];

  // Filtering: when 'All' is selected, show all. Otherwise filter by selected category
  const filteredGroups = historyGroups.map((group) => {
    if (selectedFilter === 'All') return group;
    // If a specific filter is chosen, in the screenshot when "Medications" is active it shows the context of that day
    // We can filter items or highlight. Let's filter items matching category, or if user wants all when All is selected
    const filteredItems = group.items.filter(
      (item) => item.category === selectedFilter.toLowerCase()
    );
    return {
      ...group,
      items: filteredItems.length > 0 ? filteredItems : group.items, // fallback to group items if none in filter
    };
  });

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F4FA" />

      {/* Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filters.map((filter) => {
            const isActive = selectedFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                style={[
                  styles.filterPill,
                  isActive && styles.filterPillActive,
                ]}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.filterTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Timeline Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredGroups.map((group) => (
          <View key={group.date} style={styles.groupWrap}>
            <Text style={styles.groupDate}>{group.date}</Text>

            <View style={styles.card}>
              {group.items.map((item, idx) => {
                const isLast = idx === group.items.length - 1;

                return (
                  <View key={item.id} style={styles.timelineRow}>
                    {/* Dot and connecting line */}
                    <View style={styles.leftCol}>
                      <View
                        style={[styles.dot, { backgroundColor: item.dotColor }]}
                      />
                      {!isLast && <View style={styles.verticalLine} />}
                    </View>

                    {/* Event Content */}
                    <View style={[styles.rightCol, !isLast && styles.rightColSpacing]}>
                      <Text style={styles.timeText}>{item.time}</Text>
                      <Text style={styles.titleText}>{item.title}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Bottom Bar with More tab highlighted */}
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
  filterContainer: {
    paddingVertical: 6,
    marginBottom: 8,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  filterPillActive: {
    backgroundColor: '#2563EB',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  groupWrap: {
    marginBottom: 20,
  },
  groupDate: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#94A3B8',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  timelineRow: {
    flexDirection: 'row',
  },
  leftCol: {
    alignItems: 'center',
    width: 20,
    marginRight: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  verticalLine: {
    width: 1.5,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  rightCol: {
    flex: 1,
  },
  rightColSpacing: {
    paddingBottom: 20,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 3,
  },
  titleText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0F172A',
    lineHeight: 18,
  },
});
