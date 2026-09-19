import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Pill,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  Sparkles,
} from 'lucide-react-native';
import { Card, Button, TextInput } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useElderly } from '@/context/ElderlyContext';
import { useCare } from '@/context/CareContext';

export default function DoctorPrescriptionsScreen() {
  const { activeProfile } = useElderly();
  const { medications, todayDoses, addMedication } = useCare();

  const [modalVisible, setModalVisible] = useState(false);
  const [drugName, setDrugName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once daily');
  const [scheduledTime, setScheduledTime] = useState('08:00 AM');
  const [instructions, setInstructions] = useState('');

  const seniorName = activeProfile?.fullName || 'Margaret Thompson';

  const handleAddPrescription = () => {
    if (!drugName.trim() || !dosage.trim()) {
      Alert.alert('Incomplete Form', 'Please specify the medication name and dosage.');
      return;
    }

    addMedication({
      name: drugName.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      instructions: instructions.trim() || 'Take as clinically directed by physician.',
      timesOfDay: [scheduledTime.trim() || '08:00 AM'],
    });

    setDrugName('');
    setDosage('');
    setInstructions('');
    setModalVisible(false);
    Alert.alert('Prescription Added', `${drugName.trim()} added. Caregiver schedule updated.`);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F3FF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerOverline}>CLINICAL PRESCRIPTIONS</Text>
          <Text style={styles.headerTitle}>{seniorName}</Text>
          <Text style={styles.headerSub}>
            Authorized medication regimen administered by caregiver
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Plus size={18} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Prescribe</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Meds Count Banner */}
        <Card style={styles.summaryBanner}>
          <View style={styles.bannerIcon}>
            <Pill size={22} color="#7C3AED" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>{medications.length} Active Prescriptions</Text>
            <Text style={styles.bannerSub}>
              Synchronized directly with the caregiver daily care schedule
            </Text>
          </View>
        </Card>

        {/* Prescription List */}
        <Text style={styles.sectionHeading}>ACTIVE REGIMEN</Text>
        <View style={styles.medList}>
          {medications.map((med) => {
            const matchingDoses = todayDoses.filter((d) => d.medicationName === med.name);
            const isTakenToday = matchingDoses.some((d) => d.status === 'taken');

            return (
              <Card key={med.id} style={styles.medCard}>
                <View style={styles.medHeaderRow}>
                  <View style={styles.medBadge}>
                    <Text style={styles.medBadgeText}>Rx</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.medName}>{med.name}</Text>
                    <Text style={styles.medDosage}>{med.dosage}</Text>
                  </View>
                  <View style={[styles.statusPill, isTakenToday && styles.statusPillTaken]}>
                    {isTakenToday ? (
                      <CheckCircle2 size={12} color="#16A34A" />
                    ) : (
                      <Clock size={12} color="#F59E0B" />
                    )}
                    <Text
                      style={[
                        styles.statusPillText,
                        isTakenToday && styles.statusPillTextTaken,
                      ]}
                    >
                      {isTakenToday ? 'Administered' : 'Scheduled'}
                    </Text>
                  </View>
                </View>

                <View style={styles.medMetaRow}>
                  <View style={styles.metaItem}>
                    <Clock size={13} color="#64748B" />
                    <Text style={styles.metaText}>{med.frequency}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaTime}>Times: {med.timesOfDay.join(', ')}</Text>
                  </View>
                </View>

                {med.instructions ? (
                  <View style={styles.instructionsBox}>
                    <Text style={styles.instructionsLabel}>Instructions:</Text>
                    <Text style={styles.instructionsText}>{med.instructions}</Text>
                  </View>
                ) : null}
              </Card>
            );
          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Add Prescription Modal ───────────────────────────── */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Prescribe Medication</Text>
                <Text style={styles.modalSub}>Patient: {seniorName}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400 }}>
              <TextInput
                label="Medication / Drug Name *"
                value={drugName}
                onChangeText={setDrugName}
                placeholder="e.g. Atorvastatin"
              />

              <View style={styles.formSpacing} />

              <TextInput
                label="Dosage & Strength *"
                value={dosage}
                onChangeText={setDosage}
                placeholder="e.g. 20mg Tablet"
              />

              <View style={styles.formSpacing} />

              <TextInput
                label="Frequency"
                value={frequency}
                onChangeText={setFrequency}
                placeholder="e.g. Once daily in the evening"
              />

              <View style={styles.formSpacing} />

              <TextInput
                label="Administration Time"
                value={scheduledTime}
                onChangeText={setScheduledTime}
                placeholder="e.g. 08:00 PM"
              />

              <View style={styles.formSpacing} />

              <TextInput
                label="Clinical Instructions"
                value={instructions}
                onChangeText={setInstructions}
                placeholder="e.g. Take with food, monitor for muscle aches"
                multiline
              />
            </ScrollView>

            <View style={styles.modalActions}>
              <Button
                title="Save & Prescribe"
                onPress={handleAddPrescription}
                variant="primary"
                size="lg"
                fullWidth
                style={{ backgroundColor: '#7C3AED' }}
              />
              <View style={{ height: 8 }} />
              <Button
                title="Cancel"
                onPress={() => setModalVisible(false)}
                variant="secondary"
                size="lg"
                fullWidth
              />
            </View>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerOverline: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  headerSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#7C3AED',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  summaryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDE9FE',
    marginBottom: 20,
  },
  bannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  bannerSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  medList: {
    gap: 12,
  },
  medCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  medHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  medBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  medBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#7C3AED',
  },
  medName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  medDosage: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusPillTaken: {
    backgroundColor: '#F0FDF4',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  statusPillTextTaken: {
    color: '#16A34A',
  },
  medMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
  },
  metaTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  instructionsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
  },
  instructionsLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  instructionsText: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formSpacing: {
    height: Spacing.sm,
  },
  modalActions: {
    marginTop: 16,
  },
});
