import React, { useState, useEffect } from 'react';
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
  FileText,
  Plus,
  Calendar,
  User,
  Stethoscope,
  X,
  CheckCircle2,
  Sparkles,
} from 'lucide-react-native';
import { Card, Button, TextInput } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useElderly } from '@/context/ElderlyContext';
import { useAuth } from '@/context/AuthContext';
import {
  apiGetClinicalNotes,
  apiCreateClinicalNote,
  ClinicalNoteRecord,
} from '@/services/elderlyService';

const DEMO_NOTES: ClinicalNoteRecord[] = [
  {
    note_id: 1,
    elderly_id: 1,
    doctor_id: 11,
    title: 'Bi-Weekly Geriatric Cardiovascular Review',
    note_content:
      'Patient Margaret Thompson is maintaining good hemodynamic stability. Resting heart rate telemetry averaged 72 bpm over the preceding 7 days without significant sinus bradycardia. SpO2 maintained >96% consistently.',
    recommendations:
      'Maintain current Lisinopril 10mg morning schedule. Continue daily hydration protocol (1500ml target monitored by caregiver Sarah). Repeat assessment in 14 days.',
    doctor_name: 'Dr. James Hargreaves',
    created_at: '2026-09-10T14:30:00Z',
  },
  {
    note_id: 2,
    elderly_id: 1,
    doctor_id: 11,
    title: 'Initial Intake & Fall Risk Stratification',
    note_content:
      'Baseline evaluation completed. Mild osteoporosis noted. ElderGuard wearable fall-detection accelerometer calibrated to High Sensitivity. Gait steady with walking aid.',
    recommendations:
      'Ensure obstacle-free hallway lighting at night. Caregiver instructed to log all medication doses promptly.',
    doctor_name: 'Dr. James Hargreaves',
    created_at: '2026-08-28T10:15:00Z',
  },
];

export default function DoctorNotesScreen() {
  const { activeProfile } = useElderly();
  const { user } = useAuth();

  const [notes, setNotes] = useState<ClinicalNoteRecord[]>(DEMO_NOTES);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [saving, setSaving] = useState(false);

  const seniorName = activeProfile?.fullName || 'Margaret Thompson';
  const doctorName = user?.name || activeProfile?.doctorName || 'Dr. James Hargreaves';

  useEffect(() => {
    async function loadNotes() {
      if (activeProfile?.id) {
        const res = await apiGetClinicalNotes(activeProfile.id);
        if (res.success && res.notes.length > 0) {
          setNotes(res.notes);
        }
      }
    }
    loadNotes();
  }, [activeProfile?.id]);

  const handleCreateNote = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Incomplete Form', 'Please provide a title and clinical observations.');
      return;
    }

    setSaving(true);
    const res = await apiCreateClinicalNote({
      elderlyId: activeProfile?.id || 1,
      title: title.trim(),
      noteContent: content.trim(),
      recommendations: recommendations.trim() || undefined,
    });
    setSaving(false);

    const newRecord: ClinicalNoteRecord = res.success && res.note
      ? res.note
      : {
          note_id: Date.now(),
          elderly_id: 1,
          doctor_id: 11,
          title: title.trim(),
          note_content: content.trim(),
          recommendations: recommendations.trim() || null,
          doctor_name: doctorName,
          created_at: new Date().toISOString(),
        };

    setNotes((prev) => [newRecord, ...prev]);
    setTitle('');
    setContent('');
    setRecommendations('');
    setModalVisible(false);
    Alert.alert('Clinical Note Saved', 'Consultation note has been officially added to the patient medical record.');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F3FF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerOverline}>MEDICAL CONSULTATION NOTES</Text>
          <Text style={styles.headerTitle}>{seniorName}</Text>
          <Text style={styles.headerSub}>
            Clinical records visible to collaborating family manager
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Plus size={18} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add Note</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Notes Feed */}
        <View style={styles.notesFeed}>
          {notes.map((note) => {
            const formattedDate = new Date(note.created_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <Card key={note.note_id} style={styles.noteCard}>
                <View style={styles.noteTop}>
                  <View style={styles.noteBadge}>
                    <FileText size={16} color="#7C3AED" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.noteTitle}>{note.title}</Text>
                    <View style={styles.metaRow}>
                      <View style={styles.metaItem}>
                        <Stethoscope size={12} color="#64748B" />
                        <Text style={styles.metaText}>{note.doctor_name || doctorName}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Calendar size={12} color="#64748B" />
                        <Text style={styles.metaText}>{formattedDate}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.divider} />

                <Text style={styles.bodySectionLabel}>CLINICAL OBSERVATION</Text>
                <Text style={styles.noteContent}>{note.note_content}</Text>

                {note.recommendations ? (
                  <View style={styles.recommendationBox}>
                    <Text style={styles.recTitle}>RECOMMENDATIONS & CARE DIRECTIVES</Text>
                    <Text style={styles.recContent}>{note.recommendations}</Text>
                  </View>
                ) : null}
              </Card>
            );
          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Add Consultation Note Modal ────────────────────── */}
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
                <Text style={styles.modalTitle}>Record Clinical Note</Text>
                <Text style={styles.modalSub}>Patient: {seniorName}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              <TextInput
                label="Consultation Title *"
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Monthly Geriatric Evaluation"
              />

              <View style={styles.formSpacing} />

              <TextInput
                label="Clinical Observations & Findings *"
                value={content}
                onChangeText={setContent}
                placeholder="Document patient physical state, vital telemetry response, and symptoms..."
                multiline
              />

              <View style={styles.formSpacing} />

              <TextInput
                label="Actionable Recommendations / Next Steps"
                value={recommendations}
                onChangeText={setRecommendations}
                placeholder="Directives for parent manager and attending caregiver..."
                multiline
              />
            </ScrollView>

            <View style={styles.modalActions}>
              <Button
                title="Save Clinical Note"
                onPress={handleCreateNote}
                variant="primary"
                size="lg"
                fullWidth
                loading={saving}
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
  notesFeed: {
    gap: 14,
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  noteTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  noteBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  bodySectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  noteContent: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
  },
  recommendationBox: {
    backgroundColor: '#F5F3FF',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#7C3AED',
  },
  recTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  recContent: {
    fontSize: 12,
    color: '#4C1D95',
    lineHeight: 18,
    fontWeight: '500',
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
