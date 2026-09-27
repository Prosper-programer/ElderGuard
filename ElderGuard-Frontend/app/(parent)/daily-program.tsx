import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Plus, Check, X, Calendar, Clock, ChevronDown } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

export default function DailyProgramScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const stats = { done: 5, pending: 4, missed: 1 };

  const timeline = [
    { id: 1, title: 'Wake Up', time: '07:00', icon: '🌅', status: 'done' },
    { id: 2, title: 'Breakfast', time: '08:00', icon: '🥣', status: 'done' },
    { id: 3, title: 'Medication', time: '09:00', icon: '💊', status: 'done' },
    { id: 4, title: 'Check Vitals', time: '11:00', icon: '🩺', status: 'missed' },
    { id: 5, title: 'Lunch', time: '13:00', icon: '🥗', status: 'pending' },
    { id: 6, title: 'Afternoon Walk', time: '15:30', icon: '👟', status: 'pending' },
  ];

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <ChevronLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Daily Programme</Text>
        </View>
        <TouchableOpacity 
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Blocks */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: '#D1FAE5' }]}>
          <Text style={[styles.statNum, { color: '#059669' }]}>{stats.done}</Text>
          <Text style={[styles.statLabel, { color: '#059669' }]}>Done</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: '#FEF3C7' }]}>
          <Text style={[styles.statNum, { color: '#D97706' }]}>{stats.pending}</Text>
          <Text style={[styles.statLabel, { color: '#D97706' }]}>Pending</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: '#FEE2E2' }]}>
          <Text style={[styles.statNum, { color: '#DC2626' }]}>{stats.missed}</Text>
          <Text style={[styles.statLabel, { color: '#DC2626' }]}>Missed</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Timeline */}
        <View style={styles.timelineContainer}>
          {timeline.map((item, index) => {
            const isLast = index === timeline.length - 1;
            const isDone = item.status === 'done';
            const isMissed = item.status === 'missed';
            
            return (
              <View key={item.id} style={styles.timelineItem}>
                
                {/* Timeline Line & Dot */}
                <View style={styles.timelineLineWrap}>
                  <View style={[
                    styles.timelineDot,
                    isDone && { borderColor: '#10B981' },
                    isMissed && { borderColor: '#EF4444' }
                  ]}>
                    {isDone && <Check size={12} color="#10B981" strokeWidth={3} />}
                    {isMissed && <X size={12} color="#EF4444" strokeWidth={3} />}
                  </View>
                  {!isLast && <View style={styles.timelineLine} />}
                </View>

                {/* Timeline Card */}
                <View style={[styles.timelineCard, isMissed && { opacity: 0.7 }]}>
                  <Text style={styles.cardIcon}>{item.icon}</Text>
                  <View style={styles.cardTextWrap}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardTime}>{item.time}</Text>
                  </View>
                  
                  {isDone && (
                    <View style={styles.statusPill}>
                      <Check size={14} color="#059669" />
                      <Text style={styles.statusPillText}>Done</Text>
                    </View>
                  )}
                  {isMissed && (
                    <View style={[styles.statusPill, { backgroundColor: '#FEE2E2' }]}>
                      <X size={14} color="#DC2626" />
                      <Text style={[styles.statusPillText, { color: '#DC2626' }]}>Missed</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Set Reminder Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set Reminder</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="Reminder title"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Activity Type</Text>
                <View style={styles.pickerBox}>
                  <Text style={styles.pickerText}>Medication</Text>
                  <ChevronDown size={18} color="#6B7280" />
                </View>
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Frequency</Text>
                <View style={styles.pickerBox}>
                  <Text style={styles.pickerText}>Once</Text>
                  <ChevronDown size={18} color="#6B7280" />
                </View>
              </View>
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Date</Text>
                <View style={styles.pickerBox}>
                  <Text style={styles.pickerText}>dd/mm/yyyy</Text>
                  <Calendar size={18} color="#6B7280" />
                </View>
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Time</Text>
                <View style={styles.pickerBox}>
                  <Text style={styles.pickerText}>--:--</Text>
                  <Clock size={18} color="#6B7280" />
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.saveBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.saveBtnText}>Save Reminder</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    marginTop: 8,
  },
  statBox: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNum: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  timelineContainer: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  timelineLineWrap: {
    width: 30,
    alignItems: 'center',
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 4,
    marginBottom: -16,
  },
  timelineCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginLeft: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  cardTextWrap: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardTime: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  statusPillText: {
    color: '#059669',
    fontSize: 13,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  pickerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  pickerText: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
