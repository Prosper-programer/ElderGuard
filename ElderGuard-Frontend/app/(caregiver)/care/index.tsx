import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
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

export default function CaregiverCareScreen() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [activityType, setActivityType] = useState('wellness-check');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  const [activities, setActivities] = useState(MOCK_CARE_ACTIVITIES);

  const activityTypes = [
    { id: 'wellness-check', label: 'Wellness check', color: '#3C6FDB' },
    { id: 'medication', label: 'Medication', color: '#8B5CF6' },
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
      caregiver: 'Sarah Mitchell',
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

  const todayActs = activities.filter((a) => a.date === 'Today');

  return (
    <ScreenContainer
      scrollable
      padded
      backgroundColor="#F0F4FA"
      bottomBar={<BottomTabBar activeTab="care" role="caregiver" />}
    >
      <TopBar
        title="Care Activities"
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

      {/* Summary Header */}
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
              placeholder="Describe tasks completed, Margaret's response, vitals or any observations..."
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
});
