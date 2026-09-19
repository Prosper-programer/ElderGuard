import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Check,
  FileText,
} from 'lucide-react-native';
import { BottomTabBar } from '@/components/ui';

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export default function ReportsScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState<'week' | 'month' | 'custom'>('week');

  const [items, setItems] = useState<ChecklistItem[]>([
    { id: '1', label: 'Health events & vitals', checked: true },
    { id: '2', label: 'Alerts & notifications', checked: true },
    { id: '3', label: 'Medication activity', checked: true },
    { id: '4', label: 'Location & geofencing events', checked: false },
    { id: '5', label: 'Caregiver activities', checked: true },
    { id: '6', label: 'Emergency events', checked: true },
  ]);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleGenerateReport = () => {
    const activeCount = items.filter((i) => i.checked).length;
    const periodLabel =
      period === 'week' ? 'This week' : period === 'month' ? 'This month' : 'Custom period';

    if (Platform.OS === 'web') {
      Alert.alert(
        'Report Generated',
        `ElderGuard Care Summary Report (${periodLabel})\n${activeCount} modules included.\nPrinting / download dialog prepared.`,
        [
          {
            text: 'Print / Save PDF',
            onPress: () => window.print(),
          },
          { text: 'Close', style: 'cancel' },
        ]
      );
    } else {
      Alert.alert(
        'Report Generated',
        `ElderGuard Care Summary Report (${periodLabel}) has been generated with ${activeCount} data sections and saved to your device.`
      );
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
        <Text style={styles.headerTitle}>Generate Report</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Report Period Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Report Period</Text>
          <View style={styles.periodRow}>
            {/* This week */}
            <TouchableOpacity
              style={[
                styles.periodPill,
                period === 'week' && styles.periodPillActive,
              ]}
              onPress={() => setPeriod('week')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.periodText,
                  period === 'week' && styles.periodTextActive,
                ]}
              >
                This week
              </Text>
            </TouchableOpacity>

            {/* This month */}
            <TouchableOpacity
              style={[
                styles.periodPill,
                period === 'month' && styles.periodPillActive,
              ]}
              onPress={() => setPeriod('month')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.periodText,
                  period === 'month' && styles.periodTextActive,
                ]}
              >
                This month
              </Text>
            </TouchableOpacity>

            {/* Custom */}
            <TouchableOpacity
              style={[
                styles.periodPill,
                period === 'custom' && styles.periodPillActive,
              ]}
              onPress={() => setPeriod('custom')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.periodText,
                  period === 'custom' && styles.periodTextActive,
                ]}
              >
                Custom
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Include in Report Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Include in Report</Text>

          <View style={styles.checkList}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.checkRow}
                onPress={() => toggleItem(item.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    item.checked && styles.checkboxActive,
                  ]}
                >
                  {item.checked && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                </View>

                <Text style={styles.checkLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Generate Report Button */}
        <TouchableOpacity
          style={styles.generateBtn}
          onPress={handleGenerateReport}
          activeOpacity={0.88}
        >
          <FileText size={18} color="#FFFFFF" />
          <Text style={styles.generateBtnText}>Generate Report</Text>
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
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
  },
  periodRow: {
    flexDirection: 'row',
    gap: 8,
  },
  periodPill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  periodPillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  periodText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  periodTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  checkList: {
    gap: 16,
    paddingVertical: 4,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  checkLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
  },
  generateBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  generateBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
