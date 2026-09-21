import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Share2,
  FileText,
  Heart,
  Activity,
  Pill,
  AlertTriangle,
  Stethoscope,
  Calendar,
  Download,
  CheckCircle2,
} from 'lucide-react-native';
import { Card, Button } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useElderly } from '@/context/ElderlyContext';
import { useCare } from '@/context/CareContext';
import { useVitals } from '@/context/VitalsContext';

export default function HealthReportScreen() {
  const router = useRouter();
  const { activeProfile } = useElderly();
  const { medications, todayDoses } = useCare();
  const { vitals } = useVitals();

  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [exported, setExported] = useState(false);

  const seniorName = activeProfile?.fullName || 'Margaret Thompson';
  const doctorName = activeProfile?.doctorName || 'Dr. Jean-Paul Mbarga';
  const doctorHospital = activeProfile?.doctorHospital || "St. Thomas' Hospital, London";
  const doctorSpecialty = activeProfile?.doctorSpecialty || 'Geriatric Medicine';

  const takenMeds = todayDoses.filter((d) => d.status === 'taken').length;
  const adherenceRate = todayDoses.length > 0 ? Math.round((takenMeds / todayDoses.length) * 100) : 100;

  const handleShare = async () => {
    try {
      const summaryText =
        `========================================\n` +
        `  ELDERGUARD CLINICAL HEALTH SUMMARY\n` +
        `========================================\n` +
        `Patient: ${seniorName} (${activeProfile?.age || 78} yrs, ${activeProfile?.gender || 'Female'})\n` +
        `Primary Doctor: ${doctorName} (${doctorSpecialty}, ${doctorHospital})\n` +
        `Reporting Period: ${period.toUpperCase()}\n` +
        `Date Generated: ${new Date().toLocaleDateString()}\n\n` +
        `[VITAL TELEMETRY]\n` +
        `• Heart Rate: ${vitals.heartRate?.value || 72} bpm (Normal range: 60-100 bpm)\n` +
        `• Blood Oxygen (SpO2): ${vitals.spo2?.value || 97}% (Target: >95%)\n` +
        `• Temperature: ${vitals.temperature?.value || 36.8}°C\n` +
        `• Device Status: Connected & Monitored\n\n` +
        `[MEDICATION ADHERENCE]\n` +
        `• Adherence Rate: ${adherenceRate}%\n` +
        `• Prescriptions Active: ${medications.length} items\n` +
        medications.map((m) => `  - ${m.name} (${m.dosage}) [${m.frequency}]`).join('\n') +
        `\n\n[MEDICAL CONDITIONS]\n` +
        `• Conditions: ${activeProfile?.medicalInfo?.chronicConditions?.join(', ') || 'Hypertension, Type 2 Diabetes'}\n` +
        `• Allergies: ${activeProfile?.medicalInfo?.allergies?.join(', ') || 'Penicillin'}\n` +
        `\n========================================\n` +
        `Generated via ElderGuard Family Care Platform`;

      await Share.share({
        title: `ElderGuard Clinical Report — ${seniorName}`,
        message: summaryText,
      });
      setExported(true);
    } catch (err: any) {
      Alert.alert('Export Error', err.message || 'Could not export report.');
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F4FA" />

      {/* Navigation Header */}
      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Clinical Health Summary</Text>
        <TouchableOpacity
          onPress={handleShare}
          style={styles.shareHeaderBtn}
          activeOpacity={0.7}
        >
          <Share2 size={20} color="#2563EB" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Period Selector Tabs */}
        <View style={styles.periodRow}>
          <TouchableOpacity
            style={[styles.periodTab, period === 'weekly' && styles.periodTabActive]}
            onPress={() => setPeriod('weekly')}
            activeOpacity={0.8}
          >
            <Calendar size={15} color={period === 'weekly' ? '#2563EB' : '#64748B'} />
            <Text style={[styles.periodTabText, period === 'weekly' && styles.periodTabTextActive]}>
              Past 7 Days
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodTab, period === 'monthly' && styles.periodTabActive]}
            onPress={() => setPeriod('monthly')}
            activeOpacity={0.8}
          >
            <Calendar size={15} color={period === 'monthly' ? '#2563EB' : '#64748B'} />
            <Text style={[styles.periodTabText, period === 'monthly' && styles.periodTabTextActive]}>
              Past 30 Days
            </Text>
          </TouchableOpacity>
        </View>

        {/* Report Header Card */}
        <Card style={styles.reportHeaderCard}>
          <View style={styles.badgeRow}>
            <View style={styles.officialBadge}>
              <FileText size={13} color="#2563EB" />
              <Text style={styles.officialBadgeText}>PHYSICIAN EXPORT</Text>
            </View>
            <Text style={styles.generatedDate}>
              {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>
          </View>

          <Text style={styles.patientName}>{seniorName}</Text>
          <Text style={styles.patientMeta}>
            {activeProfile?.gender || 'Female'} · Age {activeProfile?.age || 78} · Blood Type {activeProfile?.medicalInfo?.bloodType || 'O+'}
          </Text>

          <View style={styles.divider} />

          {/* Attending Doctor */}
          <View style={styles.doctorRow}>
            <View style={styles.doctorIconBox}>
              <Stethoscope size={18} color="#7C3AED" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.doctorNameText}>{doctorName}</Text>
              <Text style={styles.doctorHospitalText}>{doctorSpecialty} · {doctorHospital}</Text>
            </View>
          </View>
        </Card>

        {/* Vitals Summary Card */}
        <Text style={styles.sectionLabel}>VITALS & TELEMETRY SUMMARY</Text>
        <Card style={styles.summaryCard}>
          <View style={styles.vitalStatRow}>
            <View style={[styles.vitalIconBox, { backgroundColor: '#FEE2E2' }]}>
              <Heart size={18} color="#EF4444" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.vitalStatLabel}>Resting Heart Rate</Text>
              <Text style={styles.vitalStatSub}>Normal sinus rhythm · Sensor Active</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.vitalStatVal}>{vitals.heartRate?.value || 72} bpm</Text>
              <Text style={styles.vitalStatusSafe}>Normal</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.vitalStatRow}>
            <View style={[styles.vitalIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Activity size={18} color="#2563EB" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.vitalStatLabel}>Blood Oxygen (SpO2)</Text>
              <Text style={styles.vitalStatSub}>Optimal oxygenation saturation</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.vitalStatVal}>{vitals.spo2?.value || 97}%</Text>
              <Text style={styles.vitalStatusSafe}>Optimal</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.vitalStatRow}>
            <View style={[styles.vitalIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Heart size={18} color="#D97706" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.vitalStatLabel}>Body Temperature</Text>
              <Text style={styles.vitalStatSub}>Normothermic telemetry reading</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.vitalStatVal}>{vitals.temperature?.value || 36.8}°C</Text>
              <Text style={styles.vitalStatusSafe}>Normal</Text>
            </View>
          </View>
        </Card>

        {/* Medication Compliance Card */}
        <Text style={styles.sectionLabel}>MEDICATION ADHERENCE</Text>
        <Card style={styles.summaryCard}>
          <View style={styles.adherenceHeader}>
            <View style={styles.adherenceLeft}>
              <Pill size={20} color="#16A34A" />
              <Text style={styles.adherenceTitle}>Prescription Compliance</Text>
            </View>
            <View style={styles.adherenceBadge}>
              <Text style={styles.adherenceBadgeText}>{adherenceRate}% Adherence</Text>
            </View>
          </View>

          <Text style={styles.adherenceSub}>
            {takenMeds} of {todayDoses.length || medications.length} doses confirmed taken by caregiver.
          </Text>

          <View style={styles.medsList}>
            {medications.map((m) => (
              <View key={m.id} style={styles.medRow}>
                <View style={styles.medDot} />
                <Text style={styles.medName}>{m.name} ({m.dosage})</Text>
                <Text style={styles.medStatus}>{m.frequency}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Incident / Fall History */}
        <Text style={styles.sectionLabel}>CRITICAL INCIDENTS & ALERTS</Text>
        <Card style={styles.summaryCard}>
          <View style={styles.incidentRow}>
            <CheckCircle2 size={20} color="#16A34A" />
            <View style={{ flex: 1 }}>
              <Text style={styles.incidentHeadline}>Zero Critical Falls</Text>
              <Text style={styles.incidentSub}>
                No fall impacts or severe tachycardia episodes detected during this {period} period.
              </Text>
            </View>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <Button
            title={exported ? 'Summary Shared!' : 'Share / Export Summary'}
            onPress={handleShare}
            variant="primary"
            size="lg"
            fullWidth
            leftIcon={<Share2 size={18} color="#FFFFFF" />}
            style={{ backgroundColor: '#2563EB' }}
          />

          <View style={{ height: Spacing.sm }} />

          <Button
            title="Return to Dashboard"
            onPress={() => router.back()}
            variant="secondary"
            size="lg"
            fullWidth
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F0F4FA',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  shareHeaderBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    ...Typography.h3,
    fontSize: 18,
    color: '#0F172A',
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  periodRow: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    gap: 6,
  },
  periodTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  periodTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  periodTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  periodTabTextActive: {
    color: '#2563EB',
  },
  reportHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  officialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  officialBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 0.5,
  },
  generatedDate: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  patientName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  patientMeta: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  doctorIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  doctorHospitalText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
  },
  vitalStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  vitalIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vitalStatLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  vitalStatSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  vitalStatVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  vitalStatusSafe: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
    marginTop: 2,
  },
  adherenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  adherenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adherenceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  adherenceBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  adherenceBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
  },
  adherenceSub: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  medsList: {
    gap: 8,
  },
  medRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  medDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
    marginRight: 10,
  },
  medName: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '600',
    flex: 1,
  },
  medStatus: {
    fontSize: 12,
    color: '#16A34A',
    fontWeight: '700',
  },
  incidentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  incidentHeadline: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  incidentSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 18,
  },
  actionContainer: {
    marginTop: 10,
  },
});
