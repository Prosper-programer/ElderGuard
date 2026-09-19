import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Sparkles,
  Zap,
  Check,
  Activity,
  Brain,
} from 'lucide-react-native';
import { BottomTabBar } from '@/components/ui';

export default function AIHealthInsightsScreen() {
  const router = useRouter();

  const handleAction = (title: string, actionText: string) => {
    Alert.alert(title, `Recommendation applied: ${actionText}`);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F4FA" />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(parent)/more' as any))}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Health Insights</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ElderGuard AI Dark Banner */}
        <View style={styles.aiBanner}>
          <View style={styles.aiIconBox}>
            <Brain size={20} color="#00FBFB" />
          </View>
          <Text style={styles.aiBannerText}>ElderGuard AI</Text>
        </View>

        {/* Card 1: Morning heart rate spikes */}
        <View style={[styles.insightCard, styles.orangeBorder]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: '#FFEDD5' }]}>
              <TrendingUp size={18} color="#EA580C" />
            </View>
            <Text style={styles.cardTitle}>Morning heart rate spikes</Text>
          </View>
          <Text style={styles.cardBody}>
            Heart rate consistently exceeds 88 bpm during morning activity (09:00–10:30 AM) over 5 days. Consider reducing exercise intensity.
          </Text>
          <TouchableOpacity
            style={[styles.actionPill, { backgroundColor: '#FFF7ED' }]}
            onPress={() => handleAction('Morning heart rate spikes', 'Discuss with physiotherapist')}
            activeOpacity={0.8}
          >
            <Zap size={14} color="#EA580C" />
            <Text style={[styles.actionPillText, { color: '#EA580C' }]}>
              Discuss with physiotherapist
            </Text>
          </TouchableOpacity>
        </View>

        {/* Card 2: Improving sleep pattern */}
        <View style={[styles.insightCard, styles.greenBorder]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}>
              <TrendingDown size={18} color="#16A34A" />
            </View>
            <Text style={styles.cardTitle}>Improving sleep pattern</Text>
          </View>
          <Text style={styles.cardBody}>
            Resting heart rate during sleep improved from 68 to 63 bpm over the past week — better cardiovascular rest.
          </Text>
          <TouchableOpacity
            style={[styles.actionPill, { backgroundColor: '#F0FDF4' }]}
            onPress={() => handleAction('Improving sleep pattern', 'Keep current bedtime routine')}
            activeOpacity={0.8}
          >
            <Zap size={14} color="#16A34A" />
            <Text style={[styles.actionPillText, { color: '#16A34A' }]}>
              Keep current bedtime routine
            </Text>
          </TouchableOpacity>
        </View>

        {/* Card 3: Stable blood oxygen levels */}
        <View style={[styles.insightCard, styles.greenBorder]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}>
              <Minus size={18} color="#16A34A" strokeWidth={3} />
            </View>
            <Text style={styles.cardTitle}>Stable blood oxygen levels</Text>
          </View>
          <Text style={styles.cardBody}>
            SpO₂ consistently 95–99% over 7 days. The isolated 94% reading on 23 Aug was brief and self-resolved.
          </Text>
          <TouchableOpacity
            style={[styles.actionPill, { backgroundColor: '#F0FDF4' }]}
            onPress={() => handleAction('Stable blood oxygen levels', 'No action needed')}
            activeOpacity={0.8}
          >
            <Zap size={14} color="#16A34A" />
            <Text style={[styles.actionPillText, { color: '#16A34A' }]}>
              No action needed
            </Text>
          </TouchableOpacity>
        </View>

        {/* Card 4: Low daily step count */}
        <View style={[styles.insightCard, styles.orangeBorder]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: '#FFEDD5' }]}>
              <AlertTriangle size={18} color="#EA580C" />
            </View>
            <Text style={styles.cardTitle}>Low daily step count</Text>
          </View>
          <Text style={styles.cardBody}>
            Average 1,340 steps/day — below the recommended 3,000. Reduced mobility may increase fall risk.
          </Text>
          <TouchableOpacity
            style={[styles.actionPill, { backgroundColor: '#FFF7ED' }]}
            onPress={() => handleAction('Low daily step count', 'Increase afternoon walk duration')}
            activeOpacity={0.8}
          >
            <Zap size={14} color="#EA580C" />
            <Text style={[styles.actionPillText, { color: '#EA580C' }]}>
              Increase afternoon walk duration
            </Text>
          </TouchableOpacity>
        </View>

        {/* Card 5: Health Score */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreCardTitle}>Health Score</Text>
          <View style={styles.scoreRow}>
            {/* SVG Progress Donut */}
            <View style={styles.donutContainer}>
              <Svg width={80} height={80} viewBox="0 0 80 80">
                {/* Background Ring */}
                <Circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="#E2E8F0"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Progress Ring: 78% of 2*pi*32 = 201.06 -> strokeDashoffset = 201.06 * (1 - 0.78) = 44.23 */}
                <Circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="#22C55E"
                  strokeWidth="8"
                  strokeDasharray="201.06"
                  strokeDashoffset="44.23"
                  strokeLinecap="round"
                  fill="transparent"
                  transform="rotate(-90 40 40)"
                />
              </Svg>
              <View style={styles.scoreCenterNum}>
                <Text style={styles.scoreNumText}>78</Text>
              </View>
            </View>

            {/* Score Meta */}
            <View style={styles.scoreDetails}>
              <Text style={styles.scoreStatusText}>Good</Text>
              <Text style={styles.scoreSubText}>78/100 health score</Text>
              <Text style={styles.scoreChangeText}>↑ +3 from last week</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Bottom Tab Bar with More active */}
      <BottomTabBar activeTab="more" role="parent" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F0F4FA',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  aiBanner: {
    backgroundColor: '#1E1B4B',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  aiIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiBannerText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F8FAFC',
  },
  orangeBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#F97316',
  },
  greenBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  cardBody: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12,
  },
  actionPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  actionPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  scoreCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  donutContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  scoreCenterNum: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  scoreDetails: {
    flex: 1,
  },
  scoreStatusText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#16A34A',
  },
  scoreSubText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  scoreChangeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16A34A',
    marginTop: 4,
  },
});
