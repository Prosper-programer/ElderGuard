import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  GestureResponderEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Line,
  Circle,
  Rect,
} from 'react-native-svg';
import {
  ChevronLeft,
  Heart,
  Activity,
  Thermometer,
  AlertTriangle,
} from 'lucide-react-native';
import {
  ScreenContainer,
  BottomTabBar,
  Card,
} from '@/components/ui';

const { width: WINDOW_WIDTH } = Dimensions.get('window');
const chartWidth = WINDOW_WIDTH - 72;

interface HrDataPoint {
  time: string;
  bpm: number;
  label?: string;
}

const HR_DATA: HrDataPoint[] = [
  { time: '00:00', bpm: 70 },
  { time: '04:00', bpm: 63 },
  { time: '08:00', bpm: 60 },
  { time: '09:32', bpm: 91, label: 'Elevated' },
  { time: '12:00', bpm: 78 },
  { time: '14:00', bpm: 68 },
  { time: '16:00', bpm: 76 },
  { time: '18:00', bpm: 78 },
  { time: '22:00', bpm: 70 },
  { time: 'Now', bpm: 72 },
];

interface Spo2DataPoint {
  time: string;
  pct: number;
}

const SPO2_DATA: Spo2DataPoint[] = [
  { time: '00:00', pct: 96.5 },
  { time: '04:00', pct: 96.0 },
  { time: '08:00', pct: 96.8 },
  { time: '10:00', pct: 94.2 },
  { time: '12:00', pct: 96.0 },
  { time: '14:00', pct: 97.2 },
  { time: '16:00', pct: 96.8 },
  { time: '18:00', pct: 95.5 },
  { time: 'Now', pct: 96.8 },
];

interface TempBarPoint {
  time: string;
  temp: number;
}

const TEMP_DATA: TempBarPoint[] = [
  { time: '06:00', temp: 36.3 },
  { time: '10:00', temp: 36.5 },
  { time: '14:00', temp: 36.8 },
  { time: '18:00', temp: 36.6 },
  { time: 'Now', temp: 36.6 },
];

export default function HealthMonitoringScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState<'24h' | '7d' | '30d'>('24h');

  // Interactive Hover / Scrub state for Heart Rate Chart
  const [hrActiveIdx, setHrActiveIdx] = useState<number>(5); // default 14:00
  const [isHrHovered, setIsHrHovered] = useState<boolean>(true);

  // Interactive Hover / Scrub state for SpO2 Chart
  const [spo2ActiveIdx, setSpo2ActiveIdx] = useState<number | null>(null);

  // Interactive Hover / Touch state for Temperature Bar Chart
  const [tempActiveIdx, setTempActiveIdx] = useState<number | null>(2); // default 14:00 (36.8)

  // ── Heart Rate Coordinates Helper ──────────────────────────
  const hrY = (bpm: number) => {
    const min = 50;
    const max = 110;
    const height = 110;
    return height - ((bpm - min) / (max - min)) * height;
  };

  const getHrPointCoords = (index: number) => {
    const x = (index / (HR_DATA.length - 1)) * chartWidth;
    const y = hrY(HR_DATA[index].bpm);
    return { x, y };
  };

  const hrPoints = HR_DATA.map((_, i) => getHrPointCoords(i));

  const hrCurveD = hrPoints.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = hrPoints[i - 1];
    const midX = (prev.x + pt.x) / 2;
    return `${acc} C ${midX} ${prev.y}, ${midX} ${pt.y}, ${pt.x} ${pt.y}`;
  }, '');

  const hrAreaD = `${hrCurveD} L ${chartWidth} 110 L 0 110 Z`;

  const handleHrTouch = (evt: GestureResponderEvent) => {
    const touchX = evt.nativeEvent.locationX;
    const ratio = Math.max(0, Math.min(1, touchX / chartWidth));
    const closest = Math.round(ratio * (HR_DATA.length - 1));
    setHrActiveIdx(closest);
    setIsHrHovered(true);
  };

  const activeHrPoint = hrPoints[hrActiveIdx] || hrPoints[5];
  const activeHrData = HR_DATA[hrActiveIdx] || HR_DATA[5];
  const hrTooltipLeft = Math.min(Math.max(activeHrPoint.x - 70, 8), chartWidth - 145);

  // ── SpO2 Coordinates Helper ────────────────────────────────
  const spo2Y = (pct: number) => {
    const min = 90;
    const max = 100;
    const height = 90;
    return height - ((pct - min) / (max - min)) * height;
  };

  const getSpo2PointCoords = (index: number) => {
    const x = (index / (SPO2_DATA.length - 1)) * chartWidth;
    const y = spo2Y(SPO2_DATA[index].pct);
    return { x, y };
  };

  const spo2Points = SPO2_DATA.map((_, i) => getSpo2PointCoords(i));

  const spo2CurveD = spo2Points.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = spo2Points[i - 1];
    const midX = (prev.x + pt.x) / 2;
    return `${acc} C ${midX} ${prev.y}, ${midX} ${pt.y}, ${pt.x} ${pt.y}`;
  }, '');

  const handleSpo2Touch = (evt: GestureResponderEvent) => {
    const touchX = evt.nativeEvent.locationX;
    const ratio = Math.max(0, Math.min(1, touchX / chartWidth));
    const closest = Math.round(ratio * (SPO2_DATA.length - 1));
    setSpo2ActiveIdx(closest);
  };

  const activeSpo2Point = spo2ActiveIdx !== null ? spo2Points[spo2ActiveIdx] : null;
  const activeSpo2Data = spo2ActiveIdx !== null ? SPO2_DATA[spo2ActiveIdx] : null;
  const spo2TooltipLeft = activeSpo2Point
    ? Math.min(Math.max(activeSpo2Point.x - 65, 8), chartWidth - 140)
    : 0;

  // ── Temperature Bar Coordinates ────────────────────────────
  const tempY = (val: number) => {
    const min = 35.5;
    const max = 38.0;
    const height = 90;
    return height - ((val - min) / (max - min)) * height;
  };

  const barWidth = 46;
  const tempAvailableWidth = chartWidth - 30;
  const tempSpacing = (tempAvailableWidth - barWidth * TEMP_DATA.length) / (TEMP_DATA.length - 1);

  return (
    <ScreenContainer
      scrollable
      padded
      backgroundColor="#F0F4FA"
      bottomBar={<BottomTabBar activeTab="health" role="parent" />}
    >
      {/* ── 1. Header with Inline Period Switcher ───────────── */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(parent)' as any))}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ChevronLeft size={20} color="#334155" />
        </TouchableOpacity>

        <Text style={styles.screenTitle}>Health Monitoring</Text>

        <View style={styles.periodSwitcher}>
          {(['24h', '7d', '30d'] as const).map((p) => {
            const active = period === p;
            return (
              <TouchableOpacity
                key={p}
                onPress={() => setPeriod(p)}
                style={[styles.periodBtn, active && styles.periodBtnActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.periodBtnText, active && styles.periodBtnTextActive]}>
                  {p}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── 2. 4-Vital Cards in 2x2 Grid ────────────────────── */}
      <View style={styles.vitalsGrid}>
        {/* Heart Rate */}
        <Card style={styles.vitalCard}>
          <View style={[styles.cardAccentBar, { backgroundColor: '#10B981' }]} />
          <View style={styles.cardContent}>
            <View style={styles.cardTopRow}>
              <View style={[styles.metricIconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
                <Heart size={14} color="#10B981" />
              </View>
              <Text style={styles.metricLabel}>HEART RATE</Text>
              <View style={styles.cyanLiveDot} />
            </View>
            <View style={styles.metricValRow}>
              <Text style={styles.metricValue}>72</Text>
              <Text style={styles.metricUnit}> bpm</Text>
            </View>
            <View style={styles.metricStatusRow}>
              <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
              <Text style={[styles.statusText, { color: '#10B981' }]}>Safe</Text>
            </View>
          </View>
        </Card>

        {/* SpO2 */}
        <Card style={styles.vitalCard}>
          <View style={[styles.cardAccentBar, { backgroundColor: '#10B981' }]} />
          <View style={styles.cardContent}>
            <View style={styles.cardTopRow}>
              <View style={[styles.metricIconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
                <Activity size={14} color="#10B981" />
              </View>
              <Text style={styles.metricLabel}>SPO₂</Text>
              <View style={styles.cyanLiveDot} />
            </View>
            <View style={styles.metricValRow}>
              <Text style={styles.metricValue}>97</Text>
              <Text style={styles.metricUnit}> %</Text>
            </View>
            <View style={styles.metricStatusRow}>
              <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
              <Text style={[styles.statusText, { color: '#10B981' }]}>Safe</Text>
            </View>
          </View>
        </Card>

        {/* Temperature */}
        <Card style={styles.vitalCard}>
          <View style={[styles.cardAccentBar, { backgroundColor: '#10B981' }]} />
          <View style={styles.cardContent}>
            <View style={styles.cardTopRow}>
              <View style={[styles.metricIconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
                <Thermometer size={14} color="#10B981" />
              </View>
              <Text style={styles.metricLabel}>TEMPERATURE</Text>
              <View style={styles.cyanLiveDot} />
            </View>
            <View style={styles.metricValRow}>
              <Text style={styles.metricValue}>36.8</Text>
              <Text style={styles.metricUnit}> °C</Text>
            </View>
            <View style={styles.metricStatusRow}>
              <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
              <Text style={[styles.statusText, { color: '#10B981' }]}>Safe</Text>
            </View>
          </View>
        </Card>

        {/* Steps */}
        <Card style={styles.vitalCard}>
          <View style={[styles.cardAccentBar, { backgroundColor: '#3C6FDB' }]} />
          <View style={styles.cardContent}>
            <View style={styles.cardTopRow}>
              <Text style={styles.metricLabel}>STEPS</Text>
              <View style={styles.livePill}>
                <View style={styles.liveCyanDot} />
                <Text style={styles.livePillText}>LIVE</Text>
              </View>
            </View>
            <View style={styles.metricValRow}>
              <Text style={styles.metricValue}>1,247</Text>
            </View>
            <Text style={styles.goalSubText}>Goal: 3,000 steps</Text>
          </View>
        </Card>
      </View>

      {/* ── 3. Heart Rate Detailed Interactive Hover/Scrub Chart Card ─ */}
      <Card style={styles.chartCard}>
        <View style={styles.chartHeaderRow}>
          <View>
            <Text style={styles.chartTitle}>Heart Rate</Text>
            <Text style={styles.chartSubtitle}>beats per minute · 24h</Text>
          </View>

          <View style={styles.statsRow}>
            <Text style={styles.statLabel}>
              Min <Text style={styles.statVal}>61</Text>
            </Text>
            <Text style={styles.statLabel}>
              Avg <Text style={styles.statVal}>72</Text>
            </Text>
            <Text style={styles.statLabel}>
              Max <Text style={[styles.statVal, { color: '#EF4444' }]}>91</Text>
            </Text>
          </View>
        </View>

        {/* Interactive Scrub Area */}
        <View
          style={styles.chartSvgContainer}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={handleHrTouch}
          onResponderMove={handleHrTouch}
        >
          <Svg width={chartWidth} height={140}>
            <Defs>
              <LinearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#3C6FDB" stopOpacity="0.25" />
                <Stop offset="1" stopColor="#3C6FDB" stopOpacity="0.01" />
              </LinearGradient>
            </Defs>

            {/* Horizontal Grid lines */}
            <Line x1="0" y1={hrY(110)} x2={chartWidth} y2={hrY(110)} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4,4" />
            <Line x1="0" y1={hrY(95)} x2={chartWidth} y2={hrY(95)} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4,4" />
            <Line x1="0" y1={hrY(80)} x2={chartWidth} y2={hrY(80)} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4,4" />
            <Line x1="0" y1={hrY(65)} x2={chartWidth} y2={hrY(65)} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4,4" />
            <Line x1="0" y1={hrY(50)} x2={chartWidth} y2={hrY(50)} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4,4" />

            {/* Orange dashed threshold at 90 bpm */}
            <Line x1="0" y1={hrY(90)} x2={chartWidth} y2={hrY(90)} stroke="#F97316" strokeWidth="1.5" strokeDasharray="5,4" />

            {/* Dynamic Vertical Guide Line */}
            {isHrHovered && (
              <Line
                x1={activeHrPoint.x}
                y1={24}
                x2={activeHrPoint.x}
                y2={110}
                stroke="#CBD5E1"
                strokeWidth="1.5"
                strokeDasharray="3,3"
              />
            )}

            {/* Area Fill */}
            <Path d={hrAreaD} fill="url(#hrGrad)" />

            {/* Blue line */}
            <Path d={hrCurveD} fill="none" stroke="#3C6FDB" strokeWidth="2.5" />

            {/* Dynamic Indicator Circle on line */}
            {isHrHovered && (
              <Circle
                cx={activeHrPoint.x}
                cy={activeHrPoint.y}
                r="5"
                fill="#3C6FDB"
                stroke="#FFFFFF"
                strokeWidth="2.5"
              />
            )}
          </Svg>

          {/* Dynamic Floating Tooltip Box */}
          {isHrHovered && (
            <View style={[styles.floatingTooltip, { left: hrTooltipLeft }]}>
              <Text style={styles.tooltipTime}>{activeHrData.time}</Text>
              <Text style={styles.tooltipValue}>
                Heart Rate : {activeHrData.bpm} bpm
                {activeHrData.bpm > 90 ? ' (Elevated)' : ''}
              </Text>
            </View>
          )}

          {/* Y Axis Labels */}
          <View style={styles.yAxisLabels}>
            <Text style={styles.axisText}>110</Text>
            <Text style={styles.axisText}>95</Text>
            <Text style={styles.axisText}>80</Text>
            <Text style={styles.axisText}>65</Text>
            <Text style={styles.axisText}>50</Text>
          </View>
        </View>

        {/* X Axis Timestamps */}
        <View style={styles.xAxisRow}>
          <Text style={styles.axisText}>00:00</Text>
          <Text style={styles.axisText}>08:00</Text>
          <Text style={styles.axisText}>12:00</Text>
          <Text style={styles.axisText}>16:00</Text>
          <Text style={styles.axisText}>22:00</Text>
        </View>

        {/* Alert Banner inside card */}
        <View style={styles.alertBanner}>
          <AlertTriangle size={15} color="#EA580C" />
          <Text style={styles.alertBannerText}>
            Elevated at 09:32 AM — returned to normal in 12 min
          </Text>
        </View>
      </Card>

      {/* ── 4. Blood Oxygen (SpO2) Detailed Interactive Chart Card ─ */}
      <Card style={styles.chartCard}>
        <View style={styles.chartHeaderRow}>
          <View>
            <Text style={styles.chartTitle}>Blood Oxygen (SpO₂)</Text>
            <Text style={styles.chartSubtitle}>percentage · 24h</Text>
          </View>

          <View style={styles.statsRow}>
            <Text style={styles.statLabel}>
              Min <Text style={styles.statVal}>95%</Text>
            </Text>
            <Text style={styles.statLabel}>
              Avg <Text style={styles.statVal}>97%</Text>
            </Text>
          </View>
        </View>

        <View
          style={styles.chartSvgContainer}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={handleSpo2Touch}
          onResponderMove={handleSpo2Touch}
        >
          <Svg width={chartWidth} height={110}>
            {/* Grid Lines */}
            <Line x1="0" y1={spo2Y(100)} x2={chartWidth} y2={spo2Y(100)} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4,4" />
            <Line x1="0" y1={spo2Y(96)} x2={chartWidth} y2={spo2Y(96)} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4,4" />
            <Line x1="0" y1={spo2Y(93)} x2={chartWidth} y2={spo2Y(93)} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4,4" />
            <Line x1="0" y1={spo2Y(90)} x2={chartWidth} y2={spo2Y(90)} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4,4" />

            {/* Red dashed low threshold */}
            <Line x1="0" y1={spo2Y(94)} x2={chartWidth} y2={spo2Y(94)} stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4,4" />

            {/* Dynamic vertical indicator line */}
            {activeSpo2Point && (
              <Line
                x1={activeSpo2Point.x}
                y1={0}
                x2={activeSpo2Point.x}
                y2={90}
                stroke="#CBD5E1"
                strokeWidth="1.5"
                strokeDasharray="3,3"
              />
            )}

            {/* Green smooth curve */}
            <Path d={spo2CurveD} fill="none" stroke="#16A34A" strokeWidth="2.5" />

            {/* Active circle indicator */}
            {activeSpo2Point && (
              <Circle
                cx={activeSpo2Point.x}
                cy={activeSpo2Point.y}
                r="5"
                fill="#16A34A"
                stroke="#FFFFFF"
                strokeWidth="2.5"
              />
            )}
          </Svg>

          {/* Dynamic SpO2 Tooltip Box */}
          {activeSpo2Point && activeSpo2Data && (
            <View style={[styles.floatingTooltip, { left: spo2TooltipLeft }]}>
              <Text style={styles.tooltipTime}>{activeSpo2Data.time}</Text>
              <Text style={[styles.tooltipValue, { color: activeSpo2Data.pct < 95 ? '#EF4444' : '#16A34A' }]}>
                SpO₂ : {activeSpo2Data.pct}% {activeSpo2Data.pct < 95 ? '(Low)' : '(Normal)'}
              </Text>
            </View>
          )}

          {/* Low Threshold Label */}
          <View style={[styles.lowBadgeWrap, { top: spo2Y(94) - 8 }]}>
            <Text style={styles.lowBadgeText}>LOW</Text>
          </View>

          {/* Y Axis Labels */}
          <View style={[styles.yAxisLabels, { height: 90 }]}>
            <Text style={styles.axisText}>100</Text>
            <Text style={styles.axisText}>96</Text>
            <Text style={styles.axisText}>93</Text>
            <Text style={styles.axisText}>90</Text>
          </View>
        </View>

        {/* X Axis Timestamps */}
        <View style={styles.xAxisRow}>
          <Text style={styles.axisText}>00:00</Text>
          <Text style={styles.axisText}>04:00</Text>
          <Text style={styles.axisText}>08:00</Text>
          <Text style={styles.axisText}>10:00</Text>
          <Text style={styles.axisText}>12:00</Text>
          <Text style={styles.axisText}>14:00</Text>
          <Text style={styles.axisText}>16:00</Text>
          <Text style={styles.axisText}>18:00</Text>
          <Text style={styles.axisText}>Now</Text>
        </View>
      </Card>

      {/* ── 5. Body Temperature Interactive Bar Chart Card ──── */}
      <Card style={styles.chartCard}>
        <View style={styles.chartHeaderRow}>
          <View>
            <Text style={styles.chartTitle}>Body Temperature</Text>
            <Text style={styles.chartSubtitle}>°C · 24h</Text>
          </View>

          <View style={styles.statsRow}>
            <Text style={styles.statLabel}>
              Min <Text style={styles.statVal}>36.3°C</Text>
            </Text>
            <Text style={styles.statLabel}>
              Avg <Text style={styles.statVal}>36.6°C</Text>
            </Text>
          </View>
        </View>

        <View style={styles.chartSvgContainer}>
          <Svg width={chartWidth} height={105}>
            {/* Grid Lines */}
            <Line x1="0" y1={tempY(38.0)} x2={chartWidth} y2={tempY(38.0)} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4,4" />
            <Line x1="0" y1={tempY(36.8)} x2={chartWidth} y2={tempY(36.8)} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4,4" />
            <Line x1="0" y1={tempY(36.15)} x2={chartWidth} y2={tempY(36.15)} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4,4" />
            <Line x1="0" y1={tempY(35.5)} x2={chartWidth} y2={tempY(35.5)} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4,4" />

            {/* Bars */}
            {TEMP_DATA.map((item, index) => {
              const barX = 20 + index * (barWidth + tempSpacing);
              const topY = tempY(item.temp);
              const bHeight = Math.max(8, 90 - topY);
              const isSelected = tempActiveIdx === index;

              return (
                <Rect
                  key={item.time}
                  x={barX}
                  y={topY}
                  width={barWidth}
                  height={bHeight}
                  rx={6}
                  ry={6}
                  fill={isSelected ? '#2563EB' : '#5B8DEF'}
                  opacity={isSelected ? 1 : 0.85}
                  onPress={() => setTempActiveIdx(index)}
                />
              );
            })}
          </Svg>

          {/* Floating Tooltip Box over Active Bar */}
          {tempActiveIdx !== null && (
            <View
              style={[
                styles.floatingTooltip,
                {
                  left: Math.min(
                    Math.max(20 + tempActiveIdx * (barWidth + tempSpacing) - 45, 6),
                    chartWidth - 145
                  ),
                  top: -2,
                },
              ]}
            >
              <Text style={styles.tooltipTime}>{TEMP_DATA[tempActiveIdx].time}</Text>
              <Text style={[styles.tooltipValue, { color: '#2563EB' }]}>
                Temp : {TEMP_DATA[tempActiveIdx].temp} °C
              </Text>
            </View>
          )}

          {/* Y Axis Labels */}
          <View style={[styles.yAxisLabels, { height: 90 }]}>
            <Text style={styles.axisText}>38</Text>
            <Text style={styles.axisText}>36.8</Text>
            <Text style={styles.axisText}>36.15</Text>
            <Text style={styles.axisText}>35.5</Text>
          </View>
        </View>

        {/* X Axis Timestamps for Bars */}
        <View style={[styles.xAxisRow, { paddingHorizontal: 22 }]}>
          {TEMP_DATA.map((item, index) => (
            <TouchableOpacity
              key={item.time}
              onPress={() => setTempActiveIdx(index)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.axisText,
                  tempActiveIdx === index && { color: '#2563EB', fontWeight: '800' },
                ]}
              >
                {item.time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Normal Range Footer */}
        <View style={styles.tempFooterRow}>
          <Text style={styles.tempFooterNormal}>Normal: 36.1 – 37.2°C</Text>
          <Text style={styles.tempFooterStatus}>All normal</Text>
        </View>
      </Card>

      {/* ── 6. Activity Summary 3-Col Card ──────────────────── */}
      <Card style={styles.activitySummaryCard}>
        <Text style={styles.activitySummaryTitle}>Activity Summary</Text>
        <View style={styles.activitySummaryGrid}>
          {/* Steps */}
          <View style={styles.activityMetricBox}>
            <Text style={[styles.activityMetricVal, { color: '#3C6FDB' }]}>1,247</Text>
            <Text style={styles.activityMetricLabel}>Steps</Text>
            <Text style={styles.activityMetricSub}>of 3,000</Text>
          </View>

          {/* Active Time */}
          <View style={styles.activityMetricBox}>
            <Text style={[styles.activityMetricVal, { color: '#16A34A' }]}>45 min</Text>
            <Text style={styles.activityMetricLabel}>Active</Text>
            <Text style={styles.activityMetricSub}>today</Text>
          </View>

          {/* Resting */}
          <View style={styles.activityMetricBox}>
            <Text style={[styles.activityMetricVal, { color: '#8B5CF6' }]}>18 hrs</Text>
            <Text style={styles.activityMetricLabel}>Resting</Text>
            <Text style={styles.activityMetricSub}>incl. sleep</Text>
          </View>
        </View>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 12,
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
  periodSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 999,
    padding: 3,
  },
  periodBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  periodBtnActive: {
    backgroundColor: '#3C6FDB',
  },
  periodBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  periodBtnTextActive: {
    color: '#FFFFFF',
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  vitalCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    position: 'relative',
    padding: 0,
  },
  cardAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3.5,
  },
  cardContent: {
    padding: 12,
    paddingLeft: 14,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  metricIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    flex: 1,
  },
  cyanLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00FBFB',
  },
  metricValRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 25,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  metricUnit: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  metricStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 251, 251, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
  },
  liveCyanDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#00FBFB',
  },
  livePillText: {
    color: '#0891B2',
    fontSize: 9.5,
    fontWeight: '800',
  },
  goalSubText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
  },
  chartHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  chartSubtitle: {
    fontSize: 11.5,
    color: '#94A3B8',
    marginTop: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statLabel: {
    fontSize: 11.5,
    color: '#94A3B8',
    fontWeight: '500',
  },
  statVal: {
    color: '#0F172A',
    fontWeight: '700',
  },
  chartSvgContainer: {
    position: 'relative',
    height: 140,
    width: chartWidth,
  },
  floatingTooltip: {
    position: 'absolute',
    top: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
    zIndex: 20,
  },
  tooltipTime: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  tooltipValue: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#3C6FDB',
    marginTop: 2,
  },
  yAxisLabels: {
    position: 'absolute',
    left: -2,
    top: 0,
    bottom: 30,
    justifyContent: 'space-between',
  },
  axisText: {
    fontSize: 9.5,
    color: '#94A3B8',
    fontWeight: '500',
  },
  xAxisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
    paddingBottom: 8,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
  },
  alertBannerText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#C2410C',
    flex: 1,
  },
  lowBadgeWrap: {
    position: 'absolute',
    left: chartWidth * 0.48,
  },
  lowBadgeText: {
    color: '#EF4444',
    fontSize: 9,
    fontWeight: '800',
  },
  tempFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 4,
  },
  tempFooterNormal: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  tempFooterStatus: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
  },
  activitySummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
    marginBottom: 20,
  },
  activitySummaryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 14,
  },
  activitySummaryGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  activityMetricBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityMetricVal: {
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 4,
  },
  activityMetricLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  activityMetricSub: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 1,
  },
});
