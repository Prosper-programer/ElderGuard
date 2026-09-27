import React from 'react';
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
import { ChevronLeft, Download, Share } from 'lucide-react-native';
import Svg, { Circle, G } from 'react-native-svg';

import { Colors } from '@/constants/theme';
const TEAL = Colors.primary;
const BG = '#F9FAFB';

export default function ReportPreviewScreen() {
  const router = useRouter();

  // Simple SVG Donut logic
  const radius = 40;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const completedPercent = 92;
  const missedPercent = 8;
  const completedStroke = (completedPercent / 100) * circumference;
  const missedStroke = (missedPercent / 100) * circumference;

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Care Report Preview</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtnSmall}>
            <Download size={18} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtnSmall}>
            <Share size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* HERO CARD */}
        <View style={styles.heroCard}>
          <Text style={styles.heroBrand}>ELDERGUARD</Text>
          <Text style={styles.heroTitle}>Elderly Care Report</Text>
          <Text style={styles.heroSubtitle}>Marie Johnson - Weekly Report</Text>
          <Text style={styles.heroSubtitle}>Aug 18 – Aug 25, 2024</Text>
        </View>

        {/* HEALTH SUMMARY */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Health Summary</Text>
          
          <View style={styles.rowItem}>
            <Text style={styles.rowLabel}>Average Heart Rate</Text>
            <View style={styles.rowValueWrap}>
              <Text style={styles.rowValue}>78 BPM</Text>
              <View style={styles.pillNormal}><Text style={styles.pillTextNormal}>Normal</Text></View>
            </View>
          </View>
          
          <View style={styles.rowItem}>
            <Text style={styles.rowLabel}>Average SpO₂</Text>
            <View style={styles.rowValueWrap}>
              <Text style={styles.rowValue}>97%</Text>
              <View style={styles.pillNormal}><Text style={styles.pillTextNormal}>Normal</Text></View>
            </View>
          </View>

          <View style={[styles.rowItem, { borderBottomWidth: 0 }]}>
            <Text style={styles.rowLabel}>Average Temperature</Text>
            <View style={styles.rowValueWrap}>
              <Text style={styles.rowValue}>36.7°C</Text>
              <View style={styles.pillNormal}><Text style={styles.pillTextNormal}>Normal</Text></View>
            </View>
          </View>
        </View>

        {/* ALERTS SUMMARY */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Alerts Summary</Text>
          <View style={styles.alertsGrid}>
            <View style={[styles.alertBox, { backgroundColor: '#F0FDF4' }]}>
              <Text style={[styles.alertBoxNum, { color: TEAL }]}>4</Text>
              <Text style={[styles.alertBoxLabel, { color: TEAL }]}>Total</Text>
            </View>
            <View style={[styles.alertBox, { backgroundColor: '#FEF2F2' }]}>
              <Text style={[styles.alertBoxNum, { color: '#EF4444' }]}>1</Text>
              <Text style={[styles.alertBoxLabel, { color: '#EF4444' }]}>Critical</Text>
            </View>
            <View style={[styles.alertBox, { backgroundColor: '#FFFBEB' }]}>
              <Text style={[styles.alertBoxNum, { color: '#F59E0B' }]}>2</Text>
              <Text style={[styles.alertBoxLabel, { color: '#F59E0B' }]}>Warning</Text>
            </View>
          </View>
        </View>

        {/* CAREGIVER ACTIVITY */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Caregiver Activity</Text>
          <View style={styles.donutRow}>
            {/* Donut Chart */}
            <View style={styles.chartContainer}>
              <Svg width="100" height="100" viewBox="0 0 100 100">
                <G rotation="-90" origin="50, 50">
                  <Circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="#EF4444" // Missed
                    strokeWidth={strokeWidth}
                    fill="transparent"
                  />
                  <Circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="#10B981" // Completed
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - completedStroke}
                    strokeLinecap="round"
                  />
                </G>
              </Svg>
            </View>

            {/* Legend */}
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.legendLabel}>Completed</Text>
                <Text style={[styles.legendValue, { color: '#10B981' }]}>92%</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                <Text style={styles.legendLabel}>Missed</Text>
                <Text style={[styles.legendValue, { color: '#EF4444' }]}>8%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* OVERALL SUMMARY */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Overall Summary</Text>
          <Text style={styles.summaryText}>
            During this period, Marie Johnson's health remained generally stable. Three alerts were recorded and one emergency event occurred. The caregiver completed 92% of scheduled care activities and responded to all emergency alerts.
          </Text>
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtnSmall: {
    width: 36,
    height: 36,
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: TEAL,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  heroBrand: {
    color: '#A7F3D0',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: '#E6F3F2',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 16,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  rowLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  rowValueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  pillNormal: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pillTextNormal: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '700',
  },
  alertsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  alertBox: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertBoxNum: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  alertBoxLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  donutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  chartContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendContainer: {
    flex: 1,
    paddingLeft: 24,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  legendLabel: {
    flex: 1,
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: 'rgba(60, 111, 219, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: TEAL,
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 22,
    color: TEAL,
    opacity: 0.9,
    fontWeight: '500',
  },
});
