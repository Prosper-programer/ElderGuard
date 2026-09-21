import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Plus,
  X,
  CheckCircle,
  Pill,
  Clock,
  Heart,
  Activity,
  Check,
  CheckCircle2,
} from 'lucide-react-native';
import {
  ScreenContainer,
  BottomTabBar,
  Card,
  TopBar,
  SectionHeader,
  Button,
} from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';
import { MOCK_CARE_ACTIVITIES } from '@/services/mockData';
import { useCare } from '@/context/CareContext';
import { useAuth } from '@/context/AuthContext';
import { useElderly } from '@/context/ElderlyContext';

export default function CaregiverCareScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { activeProfile } = useElderly();
  const { todayDoses, markDoseStatus, medications } = useCare();

  const [showModal, setShowModal] = useState(false);
  const [activityType, setActivityType] = useState('wellness-check');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  const [activities, setActivities] = useState(MOCK_CARE_ACTIVITIES);

  const caregiverName = user?.name || 'Amara Biya';
  const seniorName = activeProfile?.fullName || 'Pa Samuel Ngu';

  const activityTypes = [
    { id: 'wellness-check', label: 'Wellness check', color: '#3C6FDB' },
    { id: 'physiotherapy', label: 'Physiotherapy', color: '#16A34A' },
    { id: 'walk', label: 'Walk / exercise', color: '#0EA5E9' },
    { id: 'personal-care', label: 'Personal care', color: '#EA580C' },
    { id: 'meal', label: 'Meal assistance', color: '#D97706' },
  ];

  const handleSave = () => {
    if (!title.trim() && !notes.trim()) return;

    setSaved(true);
    const newAct = {
      id: Date.now(),
      caregiver: caregiverName,
      type: activityType,
      title: title.trim() || activityTypes.find((t) => t.id === activityType)?.label || 'Care Activity',
      notes: notes.trim() || 'Completed on schedule without issues.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      duration: '15 min',
      completed: true,
    };

    setTimeout(() => {
      setActivities([newAct, ...activities]);
      setSaved(false);
      setShowModal(false);
      setTitle('');
      setNotes('');
    }, 800);
  };

  const handleMarkDoseDone = (doseId: string, medName: string) => {
    markDoseStatus(doseId, 'taken', caregiverName);
    Alert.alert(
      'Medication Administered',
      `${medName} has been recorded as taken. The parent and medical chart have been updated.`
    );
  };

  const todayActs = activities.filter((a) => a.date === 'Today');
  const completedDosesCount = todayDoses.filter((d) => d.status === 'taken').length;

  return (
    <ScreenContainer
      scrollable
      padded
      backgroundColor="#F0F4FA"
      bottomBar={<BottomTabBar activeTab="care" role="caregiver" />}
    >
      <TopBar
        title="Care & Medications"
        onBack={() => router.push('/(caregiver)')}
        right={
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            style={styles.addBtn}
            activeOpacity={0.7}
          >
            <Plus size={18} color="#FFFFFF" />
          </TouchableOpacity>
        }
      />

      {/* ── 1. Medication Administration Checklist (Rx) ─────── */}
      <View style={styles.headerRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Pill size={14} color="#7C3AED" />
          <Text style={styles.headerTitle}>MEDICATION SCHEDULE (Rx)</Text>
        </View>
        <View style={[styles.countPill, { backgroundColor: '#F5F3FF' }]}>
          <Text style={[styles.countPillText, { color: '#7C3AED' }]}>
            {completedDosesCount}/{todayDoses.length} Done
          </Text>
        </View>
      </View>

      <Card style={styles.cardZeroPadding}>
        {todayDoses.map((dose, idx) => {
          const isDone = dose.status === 'taken';
          return (
            <View
              key={dose.id}
              style={[
                styles.medDoseRow,
                idx === todayDoses.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <View
                style={[
                  styles.medIconBox,
                  isDone ? styles.medIconBoxDone : styles.medIconBoxPending,
                ]}
              >
                {isDone ? (
                  <CheckCircle2 size={18} color="#16A34A" />
                ) : (
                  <Clock size={18} color="#7C3AED" />
                )}
              </View>

              <View style={{ flex: 1 }}>
                <View style={styles.medTitleRow}>
                  <Text style={styles.medNameText}>{dose.medicationName}</Text>
                  <Text style={styles.medTimeBadge}>{dose.scheduledTime}</Text>
                </View>

                <Text style={styles.medDosageText}>{dose.dosage}</Text>

                {isDone ? (
                  <View style={styles.adminSuccessRow}>
                    <Check size={12} color="#16A34A" />
                    <Text style={styles.adminSuccessText}>
                      Administered at {dose.loggedAt || '08:05 AM'} by {dose.loggedBy || caregiverName}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.adminPendingText}>Awaiting administration for {seniorName}</Text>
                )}
              </View>

              {!isDone ? (
                <TouchableOpacity
                  style={styles.actionDoneBtn}
                  onPress={() => handleMarkDoseDone(dose.id, dose.medicationName)}
                  activeOpacity={0.8}
                >
                  <Check size={14} color="#FFFFFF" strokeWidth={2.5} />
                  <Text style={styles.actionDoneBtnText}>Done</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.completedBadgePill}>
                  <Text style={styles.completedBadgePillText}>Taken</Text>
                </View>
              )}
            </View>
          );
        })}
      </Card>

      <View style={{ height: Spacing.lg }} />

      {/* ── 2. Today's Care Protocols ───────────────────────── */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>TODAY&apos;S CARE PROTOCOLS</Text>
        <View style={styles.countPill}>
          <Text style={styles.countPillText}>{todayActs.length} logged</Text>
        </View>
      </View>

      {/* Activities Card List */}
      <Card style={styles.cardZeroPadding}>
        {todayActs.map((act, i) => {
          const typeMatch = activityTypes.find((t) => t.id === act.type);
          const color = typeMatch?.color || '#3C6FDB';

          return (
            <View
              key={act.id}
              style={[
                styles.activityItem,
                i === todayActs.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <View style={[styles.typeIconBox, { backgroundColor: color + '15' }]}>
                <CheckCircle size={16} color={color} />
              </View>

              <View style={{ flex: 1 }}>
                <View style={styles.itemTitleRow}>
                  <Text style={styles.itemTitle}>{act.title}</Text>
                  <View style={styles.donePill}>
                    <Text style={styles.donePillText}>Done</Text>
                  </View>
                </View>

                <Text style={styles.itemTime}>
                  {act.time} · {act.duration} · By {act.caregiver}
                </Text>

                <Text style={styles.itemNotes}>{act.notes}</Text>
              </View>
            </View>
          );
        })}
      </Card>

      <View style={{ height: Spacing.xl }} />

      {/* Log Activity Modal Sheet */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Log Care Activity</Text>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={styles.closeBtn}
              >
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>ACTIVITY TYPE</Text>
            <View style={styles.typesWrap}>
              {activityTypes.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => setActivityType(t.id)}
                  style={[
                    styles.typeChip,
                    activityType === t.id && {
                      backgroundColor: t.color,
                      borderColor: t.color,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.typeChipText,
                      activityType === t.id && { color: '#FFFFFF' },
                    ]}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>CLINICAL OBSERVATIONS & NOTES</Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={4}
              placeholder="Describe tasks completed, senior's response, vitals or any observations..."
              placeholderTextColor="#94A3B8"
              value={notes}
              onChangeText={setNotes}
            />

            <View style={styles.modalButtonsRow}>
              <Button
                variant="ghost"
                onClick={() => setShowModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={saved}
                onClick={handleSave}
                className="flex-1"
              >
                {saved ? 'Saved ✓' : 'Save Protocol'}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  headerTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  countPill: {
    backgroundColor: Colors.safeBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  countPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.safe,
  },
  cardZeroPadding: {
    padding: 0,
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  typeIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  donePill: {
    backgroundColor: Colors.safeBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  donePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.safe,
  },
  itemTime: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  itemNotes: {
    fontSize: 12,
    color: '#475569',
    marginTop: 6,
    lineHeight: 17,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 36,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  typesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typeChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
    fontSize: 13,
    color: '#0F172A',
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 18,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  medDoseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  medIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medIconBoxPending: {
    backgroundColor: '#F5F3FF',
  },
  medIconBoxDone: {
    backgroundColor: '#F0FDF4',
  },
  medTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  medNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  medTimeBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  medDosageText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  adminSuccessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  adminSuccessText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#16A34A',
  },
  adminPendingText: {
    fontSize: 11,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  actionDoneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#16A34A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  actionDoneBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  completedBadgePill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  completedBadgePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },
});
