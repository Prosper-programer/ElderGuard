const fs = require('fs');

const content = \import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

const TEAL = '#0D7066';
const LIGHT_TEAL = '#E6F3F2';
const BG = '#FFFFFF';
const TEXT_DARK = '#1F2937';
const TEXT_LIGHT = '#6B7280';
const BORDER = '#E5E7EB';

export default function ReportsScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Custom'>('Weekly');
  const [activeReportTypes, setActiveReportTypes] = useState<string[]>(['Elderly Health']);

  const reportTypes = [
    { id: 'Elderly Health', icon: '??' },
    { id: 'Alerts', icon: '??' },
    { id: 'Emergency Events', icon: '??' },
    { id: 'Medication History', icon: '??' },
    { id: 'Caregiver Activity', icon: '?????' },
    { id: 'Geofencing Events', icon: '??' },
  ];

  const toggleReportType = (id: string) => {
    setActiveReportTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Generate Report</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* ELDERLY PERSON */}
        <Text style={styles.sectionTitle}>ELDERLY PERSON</Text>
        <View style={styles.personCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop' }}
            style={styles.personAvatar}
          />
          <Text style={styles.personName}>Marie Johnson <Text style={styles.personAge}>· Age 74</Text></Text>
        </View>

        {/* REPORT PERIOD */}
        <Text style={styles.sectionTitle}>REPORT PERIOD</Text>
        <View style={styles.grid2x2}>
          {['Daily', 'Weekly', 'Monthly', 'Custom'].map((p) => {
            const isActive = period === p;
            return (
              <TouchableOpacity
                key={p}
                style={[styles.periodBtn, isActive && styles.periodBtnActive]}
                onPress={() => setPeriod(p as any)}
                activeOpacity={0.8}
              >
                <Text style={[styles.periodBtnText, isActive && styles.periodBtnTextActive]}>
                  {p}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* REPORT TYPE */}
        <Text style={styles.sectionTitle}>REPORT TYPE</Text>
        <View style={styles.grid2x3}>
          {reportTypes.map((type) => {
            const isActive = activeReportTypes.includes(type.id);
            return (
              <TouchableOpacity
                key={type.id}
                style={[styles.typeBtn, isActive && styles.typeBtnActive]}
                onPress={() => toggleReportType(type.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.typeIcon}>{type.icon}</Text>
                <Text style={[styles.typeBtnText, isActive && styles.typeBtnTextActive]}>
                  {type.id}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.generateBtn}
            activeOpacity={0.8}
          >
            <Text style={styles.generateBtnText}>Generate Report</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.previewBtn}
            onPress={() => router.push('/(parent)/reports/preview' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.previewBtnText}>Preview</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: TEXT_LIGHT,
    marginBottom: 10,
    marginTop: 24,
    letterSpacing: 0.5,
  },
  personCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1.5,
    borderColor: TEAL,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  personAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  personName: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  personAge: {
    fontWeight: '500',
  },
  grid2x2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  periodBtn: {
    width: '48%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodBtnActive: {
    backgroundColor: TEAL,
  },
  periodBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_LIGHT,
  },
  periodBtnTextActive: {
    color: '#FFFFFF',
  },
  grid2x3: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeBtn: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER,
  },
  typeBtnActive: {
    borderColor: TEAL,
    backgroundColor: LIGHT_TEAL,
  },
  typeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  typeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_LIGHT,
    flex: 1,
  },
  typeBtnTextActive: {
    color: TEAL,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  generateBtn: {
    flex: 1,
    backgroundColor: TEAL,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  previewBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewBtnText: {
    color: TEXT_DARK,
    fontSize: 16,
    fontWeight: '700',
  },
});
\;

fs.writeFileSync('app/(parent)/reports/index.tsx', content, 'utf8');
