import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Plus,
  CheckCircle,
  Pill,
  AlertTriangle,
  Check,
} from 'lucide-react-native';
import {
  ScreenContainer,
  BottomTabBar,
  Card,
} from '@/components/ui';

interface ScheduleItem {
  id: number;
  time: string;
  title: string;
  isMed?: boolean;
  done: boolean;
  current?: boolean;
}

const SCHEDULE_ITEMS: ScheduleItem[] = [
  { id: 1, time: '07:00', title: 'Wake up', done: true },
  { id: 2, time: '07:30', title: 'Breakfast', done: true },
  { id: 3, time: '08:00', title: 'Morning medication', isMed: true, done: true },
  { id: 4, time: '09:00', title: 'Physical therapy exercises', done: true },
  { id: 5, time: '10:30', title: 'Light walk — garden', done: true },
  { id: 6, time: '12:30', title: 'Lunch', done: false, current: true },
  { id: 7, time: '13:00', title: 'Midday medication', isMed: true, done: false },
  { id: 8, time: '14:00', title: 'Rest / Afternoon nap', done: false },
  { id: 9, time: '16:00', title: 'Afternoon tea', done: false },
  { id: 10, time: '17:30', title: 'Family video call', done: false },
  { id: 11, time: '19:00', title: 'Dinner', done: false },
  { id: 12, time: '19:30', title: 'Evening medication', isMed: true, done: false },
];

interface MedItem {
  id: number;
  name: string;
  dosage: string;
  timing: string;
  instruction: string;
  color: string;
  iconBg: string;
  statusBadge: string;
  statusTime?: string;
  stock: number;
  isTaken?: boolean;
  isWeekly?: boolean;
}

const MEDICATIONS_LIST: MedItem[] = [
  {
    id: 1,
    name: 'Aspirin',
    dosage: '100mg',
    timing: 'Morning',
    instruction: 'Take with food',
    color: '#3C6FDB',
    iconBg: '#EEF5FF',
    statusBadge: 'Taken',
    statusTime: '08:07 AM',
    stock: 22,
    isTaken: true,
  },
  {
    id: 2,
    name: 'Lisinopril',
    dosage: '10mg',
    timing: 'Morning',
    instruction: 'Take with water',
    color: '#16A34A',
    iconBg: '#F0FDF4',
    statusBadge: 'Taken',
    statusTime: '08:07 AM',
    stock: 14,
    isTaken: true,
  },
  {
    id: 3,
    name: 'Metformin',
    dosage: '500mg',
    timing: 'After Lunch',
    instruction: 'Take after meals',
    color: '#EA580C',
    iconBg: '#FFF7ED',
    statusBadge: 'Taken',
    statusTime: '13:12 PM',
    stock: 30,
    isTaken: true,
  },
  {
    id: 4,
    name: 'Alendronic Acid',
    dosage: '70mg',
    timing: 'Morning (empty stomach)',
    instruction: '30 min before eating, stand upright for 30 min',
    color: '#9333EA',
    iconBg: '#FAF5FF',
    statusBadge: 'Weekly – Friday',
    stock: 8,
    isWeekly: true,
  },
  {
    id: 5,
    name: 'Metformin',
    dosage: '500mg',
    timing: 'After Dinner',
    instruction: 'Take after meals',
    color: '#EA580C',
    iconBg: '#FFF7ED',
    statusBadge: '19:00',
    stock: 30,
  },
];

export default function ParentCareScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'schedule' | 'medications'>('schedule');
  const [items, setItems] = useState<ScheduleItem[]>(SCHEDULE_ITEMS);

  const doneCount = items.filter((i) => i.done).length;

  const toggleItem = (id: number) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, done: !it.done } : it))
    );
  };

  return (
    <ScreenContainer
      scrollable
      padded
      backgroundColor="#F0F4FA"
      bottomBar={<BottomTabBar activeTab="care" role="parent" />}
    >
      {/* ── 1. Top Bar ──────────────────────────────────────── */}
      <View style={styles.topBarRow}>
        <TouchableOpacity
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(Tutor)' as any))}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ChevronLeft size={20} color="#334155" />
        </TouchableOpacity>

        <Text style={styles.screenTitle}>Daily Programme</Text>

        <TouchableOpacity
          onPress={() => router.push('/(Tutor)/care/new-medication' as any)}
          style={styles.addBtn}
          activeOpacity={0.7}
        >
          <Plus size={20} color="#475569" />
        </TouchableOpacity>
      </View>

      {/* ── 2. Tabs Switcher ────────────────────────────────── */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab('schedule')}
          style={[styles.tabButton, activeTab === 'schedule' && styles.tabButtonActive]}
          activeOpacity={0.75}
        >
          <Text style={[styles.tabText, activeTab === 'schedule' && styles.tabTextActive]}>
            Schedule
          </Text>
          {activeTab === 'schedule' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('medications')}
          style={[styles.tabButton, activeTab === 'medications' && styles.tabButtonActive]}
          activeOpacity={0.75}
        >
          <Text style={[styles.tabText, activeTab === 'medications' && styles.tabTextActive]}>
            Medications
          </Text>
          {activeTab === 'medications' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
      </View>

      {/* ── 3. SCHEDULE TAB CONTENT ─────────────────────────── */}
      {activeTab === 'schedule' && (
        <View style={styles.tabContentContainer}>
          {/* Date & Progress Summary */}
          <View style={styles.scheduleHeaderRow}>
            <Text style={styles.dateHeading}>Thursday 10 September</Text>
            <View style={styles.doneBadge}>
              <Text style={styles.doneBadgeText}>{doneCount}/13 done</Text>
            </View>
          </View>

          {/* Schedule Timeline List Card */}
          <Card style={styles.scheduleCard}>
            {items.map((item, idx) => {
              const isLast = idx === items.length - 1;

              if (item.current) {
                return (
                  <View key={item.id} style={styles.currentItemBox}>
                    <View style={styles.currentRadioOuter}>
                      <View style={styles.currentRadioInner} />
                    </View>
                    <View style={styles.itemMainTextCol}>
                      <Text style={styles.currentTitle}>{item.title}</Text>
                      <Text style={styles.nowTag}>Now</Text>
                    </View>
                    <Text style={styles.currentTimeText}>{item.time}</Text>
                  </View>
                );
              }

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.scheduleRow, !isLast && styles.scheduleRowDivider]}
                  onPress={() => toggleItem(item.id)}
                  activeOpacity={0.7}
                >
                  {/* Left Indicator */}
                  {item.done ? (
                    <View style={styles.checkWrap}>
                      <CheckCircle size={18} color="#22C55E" />
                    </View>
                  ) : (
                    <View style={styles.pendingCircleOuter}>
                      <View style={styles.pendingCircleInner} />
                    </View>
                  )}

                  {/* Title & optional med pill */}
                  <View style={styles.itemMainTextCol}>
                    <Text
                      style={[
                        styles.itemTitle,
                        item.done && styles.itemTitleDone,
                      ]}
                    >
                      {item.title}
                    </Text>
                  </View>

                  {/* Optional Pill Icon */}
                  {item.isMed && (
                    <Pill size={14} color="#C084FC" style={styles.rowMedIcon} />
                  )}

                  {/* Time */}
                  <Text
                    style={[
                      styles.itemTime,
                      item.done && styles.itemTimeDone,
                    ]}
                  >
                    {item.time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Card>
        </View>
      )}

      {/* ── 4. MEDICATIONS TAB CONTENT ──────────────────────── */}
      {activeTab === 'medications' && (
        <View style={styles.tabContentContainer}>
          {/* Low Stock Warning Banner */}
          <View style={styles.lowStockBanner}>
            <AlertTriangle size={18} color="#EA580C" />
            <View style={styles.lowStockTextCol}>
              <Text style={styles.lowStockTitle}>
                Low stock — Alendronic Acid
              </Text>
              <Text style={styles.lowStockSubtitle}>
                8 tablets remaining. Please reorder.
              </Text>
            </View>
          </View>

          {/* Medication Cards List */}
          <Card style={styles.medCard}>
            {MEDICATIONS_LIST.map((med, idx) => {
              const isLast = idx === MEDICATIONS_LIST.length - 1;

              return (
                <View
                  key={med.id}
                  style={[styles.medRow, !isLast && styles.medRowDivider]}
                >
                  {/* Left Icon */}
                  <View style={[styles.medIconBox, { backgroundColor: med.iconBg }]}>
                    <Pill size={17} color={med.color} />
                  </View>

                  {/* Med Name & Instructions */}
                  <View style={styles.medDetailsCol}>
                    <Text style={styles.medNameText}>
                      {med.name} {med.dosage}
                    </Text>
                    <Text style={styles.medTimingText}>{med.timing}</Text>
                    <Text style={styles.medInstructionText}>
                      {med.instruction}
                    </Text>
                  </View>

                  {/* Right Status Badge & Stock */}
                  <View style={styles.medRightCol}>
                    {med.isTaken ? (
                      <View style={styles.takenBadgeRow}>
                        <Check size={11} color="#16A34A" strokeWidth={3} />
                        <Text style={styles.takenBadgeText}>Taken</Text>
                      </View>
                    ) : med.isWeekly ? (
                      <Text style={styles.weeklyBadgeText}>{med.statusBadge}</Text>
                    ) : (
                      <Text style={styles.pendingTimeBadgeText}>{med.statusBadge}</Text>
                    )}

                    {med.statusTime && (
                      <Text style={styles.medTimeSubText}>{med.statusTime}</Text>
                    )}

                    <Text style={styles.medStockText}>Stock: {med.stock}</Text>
                  </View>
                </View>
              );
            })}
          </Card>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 8,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
  },
  tabButtonActive: {},
  tabText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#3C6FDB',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: -1,
    left: 12,
    right: 12,
    height: 2.5,
    backgroundColor: '#3C6FDB',
    borderRadius: 1.5,
  },
  tabContentContainer: {
    gap: 14,
  },
  scheduleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  dateHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  doneBadge: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  doneBadgeText: {
    color: '#16A34A',
    fontSize: 11.5,
    fontWeight: '800',
  },
  scheduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    gap: 12,
  },
  scheduleRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  checkWrap: {
    width: 22,
    alignItems: 'center',
  },
  pendingCircleOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  pendingCircleInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },
  itemMainTextCol: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#334155',
  },
  itemTitleDone: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  rowMedIcon: {
    marginRight: 6,
  },
  itemTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  itemTimeDone: {
    color: '#94A3B8',
  },
  currentItemBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 4,
    gap: 12,
  },
  currentRadioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#3C6FDB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentRadioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3C6FDB',
  },
  currentTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  nowTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3C6FDB',
    marginTop: 1,
  },
  currentTimeText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  lowStockBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 18,
    padding: 14,
  },
  lowStockTextCol: {
    flex: 1,
  },
  lowStockTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#C2410C',
    marginBottom: 2,
  },
  lowStockSubtitle: {
    fontSize: 11.5,
    color: '#EA580C',
    fontWeight: '500',
  },
  medCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
  },
  medRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    gap: 12,
  },
  medRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  medIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  medDetailsCol: {
    flex: 1,
  },
  medNameText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 2,
  },
  medTimingText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 2,
  },
  medInstructionText: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 15,
  },
  medRightCol: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  takenBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  takenBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16A34A',
  },
  weeklyBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#7C3AED',
  },
  pendingTimeBadgeText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#475569',
  },
  medTimeSubText: {
    fontSize: 10.5,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 1,
  },
  medStockText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 3,
  },
});
