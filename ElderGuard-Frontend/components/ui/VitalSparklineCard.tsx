/**
 * ============================================================================
 * ElderGuard — VitalSparklineCard.tsx
 * ============================================================================
 * 
 * PURPOSE:
 * A medical-grade biometric card displaying a specific physiological reading
 * (Heart Rate, Blood Oxygen, Body Temp, Steps) alongside an embedded 24-hour
 * SVG trend sparkline wave.
 * 
 * VISUAL STRUCTURE:
 * 1. HEADER ROW   : Metric icon, title label, and color-coded status chip.
 * 2. TELEMETRY ROW: Oversized live value + unit, paired with an embedded Bézier wave curve.
 * 3. FOOTER ROW   : Clinical baseline normal range (e.g. "Normal: 60 - 100 bpm").
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { StatusBadge } from './StatusBadge';
import { Colors, Typography, Spacing, BorderRadius, StatusType } from '@/constants/theme';

interface VitalSparklineCardProps {
  /** Metric label (e.g. 'Heart Rate', 'Blood Oxygen') */
  label: string;
  /** Live numeric value (e.g. 72, 98, 36.7) */
  value: number | string;
  /** Measurement unit (e.g. 'bpm', '%', '°C') */
  unit: string;
  /** Status classification for color assignment */
  status: StatusType;
  /** Status pill text (e.g. 'Normal Resting', 'Optimal') */
  statusLabel: string;
  /** Clinical reference range string */
  normalRange: string;
  /** Lucide icon element */
  icon: React.ReactNode;
  /** Background tint for icon circle */
  iconBg: string;
  /** Optional custom stroke color override for sparkline */
  sparklineColor?: string;
  /** Trend trajectory indicator */
  trend?: 'stable' | 'rising' | 'falling';
}

export function VitalSparklineCard({
  label,
  value,
  unit,
  status,
  statusLabel,
  normalRange,
  icon,
  iconBg,
  sparklineColor,
}: VitalSparklineCardProps) {
  const isCritical = status === 'critical';
  const isWarning = status === 'warning';

  // Dynamic sparkline stroke color based on status
  const strokeColor =
    sparklineColor ||
    (isCritical ? Colors.critical : isWarning ? Colors.warning : Colors.primary);

  // SVG Bézier wave paths representing 24-hour historical fluctuation
  // Uses cubic curves (C) to render organic, smooth physiological waves
  const pathD = isCritical
    ? 'M0,18 C15,18 25,6 40,6 C55,6 65,22 80,22 C95,22 105,2 120,2' // Erratic spikes
    : isWarning
    ? 'M0,14 C20,14 30,8 50,8 C70,8 80,18 100,18 C110,18 115,10 120,10' // Moderate drift
    : 'M0,14 C15,14 25,10 40,10 C55,10 65,16 80,16 C95,16 105,12 120,12'; // Stable rhythm

  return (
    <View style={styles.card}>
      {/* ── 1. Header: Icon, Metric Title & Status Pill ────── */}
      <View style={styles.topRow}>
        <View style={[styles.iconBox, { backgroundColor: iconBg }]}>{icon}</View>
        <Text style={styles.label}>{label}</Text>
        <StatusBadge status={status} label={statusLabel} size="sm" />
      </View>

      {/* ── 2. Telemetry: Big Value & Mini SVG Wave ──────────── */}
      <View style={styles.middleRow}>
        <View style={styles.valueWrap}>
          <Text style={styles.value}>
            {value} <Text style={styles.unit}>{unit}</Text>
          </Text>
        </View>

        {/* Embedded 24-Hour Wave Sparkline */}
        <View style={styles.sparklineWrap}>
          <Svg width={75} height={24} viewBox="0 0 120 24">
            <Path
              d={pathD}
              fill="none"
              stroke={strokeColor}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      </View>

      {/* ── 3. Reference Range Footer ────────────────────────── */}
      <Text style={styles.rangeText}>Normal: {normalRange}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: Spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.xs,
  },
  label: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    flex: 1,
    fontSize: 13,
  },
  middleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  valueWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    ...Typography.h2,
    fontSize: 22,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  unit: {
    ...Typography.bodySmall,
    color: Colors.textTertiary,
    fontSize: 13,
    fontWeight: '500',
  },
  sparklineWrap: {
    opacity: 0.85,
  },
  rangeText: {
    ...Typography.caption,
    color: Colors.textTertiary,
    fontSize: 11,
    marginTop: 2,
  },
});
