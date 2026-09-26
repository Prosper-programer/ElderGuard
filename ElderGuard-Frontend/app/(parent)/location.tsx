import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, {
  Rect,
  Circle,
  Path,
  Line,
  Text as SvgText,
} from 'react-native-svg';
import {
  ChevronLeft,
  MapPin,
  RefreshCw,
  Shield,
  Plus,
  Minus,
  Trees,
  Home,
} from 'lucide-react-native';
import {
  ScreenContainer,
  BottomTabBar,
  Card,
} from '@/components/ui';
import { useElderly } from '@/context/ElderlyContext';
import { MOCK_ELDERLY_PERSON } from '@/services/mockData';

export default function ParentLocationScreen() {
  const router = useRouter();
  const { activeProfile } = useElderly();
  const seniorFirstName = activeProfile?.fullName?.split(' ')[0] || 'Pa Samuel';

  return (
    <ScreenContainer
      scrollable
      padded
      backgroundColor="#F0F4FA"
      bottomBar={<BottomTabBar activeTab="location" role="Tutor" />}
    >
      {/* ── 1. Header with Geofencing Quick Link ────────────── */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(Tutor)' as any))}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ChevronLeft size={20} color="#334155" />
        </TouchableOpacity>

        <Text style={styles.screenTitle}>Location</Text>

        <TouchableOpacity
          onPress={() => router.push('/(Tutor)/geofencing' as any)}
          activeOpacity={0.7}
        >
          <Text style={styles.geofencingLink}>Geofencing</Text>
        </TouchableOpacity>
      </View>

      {/* ── 2. Stylized Map View Card ───────────────────────── */}
      <Card style={styles.mapCard}>
        <View style={styles.mapContainer}>
          <Svg width="100%" height={260} viewBox="0 0 340 260">
            {/* Background Base */}
            <Rect x="0" y="0" width="340" height="260" fill="#E8F1FC" />

            {/* River / Water Canal */}
            <Path
              d="M 0 200 C 60 190, 140 215, 220 205 C 280 198, 320 202, 340 200 L 340 260 L 0 260 Z"
              fill="#D0E3FA"
            />

            {/* City Blocks (Light Rectangles) */}
            <Rect x="140" y="24" width="70" height="38" rx="6" fill="#DCE7F5" />
            <Rect x="220" y="24" width="70" height="38" rx="6" fill="#DCE7F5" />

            <Rect x="140" y="70" width="70" height="42" rx="6" fill="#DCE7F5" />
            <Rect x="220" y="70" width="70" height="42" rx="6" fill="#DCE7F5" />

            <Rect x="140" y="120" width="70" height="42" rx="6" fill="#DCE7F5" />
            <Rect x="220" y="120" width="70" height="42" rx="6" fill="#DCE7F5" />

            <Rect x="40" y="120" width="80" height="42" rx="6" fill="#DCE7F5" />

            {/* Parks (Green zones) */}
            {/* Bastos Park */}
            <Rect x="14" y="20" width="106" height="74" rx="10" fill="#BBF7D0" opacity={0.8} />
            <Circle cx="35" cy="35" r="4" fill="#86EFAC" />
            <Circle cx="60" cy="38" r="4.5" fill="#86EFAC" />
            <Circle cx="45" cy="55" r="4" fill="#86EFAC" />
            <Circle cx="75" cy="58" r="5" fill="#86EFAC" />
            <Circle cx="95" cy="40" r="4.5" fill="#86EFAC" />
            <SvgText x="20" y="82" fill="#15803D" fontSize="8" fontWeight="bold">
              BASTOS PARK
            </SvgText>

            {/* Omnisports Gardens */}
            <Rect x="222" y="165" width="104" height="85" rx="10" fill="#BBF7D0" opacity={0.8} />
            <SvgText x="238" y="228" fill="#15803D" fontSize="8" fontWeight="bold">
              OMNISPORTS GARDENS
            </SvgText>

            {/* Street Grid Lines */}
            <Line x1="130" y1="0" x2="130" y2="260" stroke="#FFFFFF" strokeWidth="8" />
            <Line x1="215" y1="0" x2="215" y2="260" stroke="#FFFFFF" strokeWidth="8" />
            <Line x1="0" y1="65" x2="340" y2="65" stroke="#FFFFFF" strokeWidth="8" />
            <Line x1="0" y1="116" x2="340" y2="116" stroke="#FFFFFF" strokeWidth="8" />
            <Line x1="0" y1="166" x2="340" y2="166" stroke="#FFFFFF" strokeWidth="8" />

            {/* Street Names */}
            <SvgText x="156" y="96" fill="#94A3B8" fontSize="7.5" fontWeight="600">
              RUE DE BASTOS
            </SvgText>
            <SvgText x="127" y="130" fill="#94A3B8" fontSize="6.5" fontWeight="600" transform="rotate(-90 127 130)">
              AVENUE DE PARIS
            </SvgText>

            {/* Pulsing Beacon Rings at Bastos Residence */}
            <Circle cx="175" cy="128" r="22" fill="none" stroke="#3C6FDB" strokeWidth="1" strokeDasharray="3,3" opacity={0.6} />
            <Circle cx="175" cy="128" r="14" fill="#3C6FDB" opacity={0.18} />
            <Circle cx="175" cy="128" r="8" fill="#FFFFFF" stroke="#3C6FDB" strokeWidth="2.5" />
            <Circle cx="175" cy="128" r="4" fill="#3C6FDB" />
          </Svg>

          {/* Floating Location Beacon Badge */}
          <View style={styles.mapBeaconBadge}>
            <Text style={styles.beaconAddressText}>Bastos Residence</Text>
            <View style={styles.beaconLiveRow}>
              <View style={styles.beaconCyanDot} />
              <Text style={styles.beaconLiveText}>LIVE - GPS ±5m</Text>
            </View>
          </View>

          {/* Zoom Buttons */}
          <View style={styles.zoomButtonsWrap}>
            <TouchableOpacity style={styles.zoomBtn} activeOpacity={0.7}>
              <Plus size={16} color="#334155" />
            </TouchableOpacity>
            <View style={styles.zoomDivider} />
            <TouchableOpacity style={styles.zoomBtn} activeOpacity={0.7}>
              <Minus size={16} color="#334155" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Senior's Location Summary Bar below map */}
        <View style={styles.locationSummaryBar}>
          <View style={styles.locationSummaryHeader}>
            <Text style={styles.locationSummaryTitle}>{seniorFirstName}&apos;s Location</Text>
            <View style={styles.safeBadgePill}>
              <View style={styles.safeBadgeDot} />
              <Text style={styles.safeBadgeText}>Safe</Text>
            </View>
          </View>

          <View style={styles.locationAddressRow}>
            <MapPin size={15} color="#3C6FDB" />
            <Text style={styles.locationAddressText}>
              {activeProfile?.address || 'Bastos, Yaoundé, Cameroon'}
            </Text>
          </View>

          <View style={styles.locationFooterRow}>
            <RefreshCw size={11} color="#94A3B8" />
            <Text style={styles.locationFooterText}>
              Updated 2 min ago · Currently at home
            </Text>
          </View>
        </View>
      </Card>

      {/* ── 3. Location Details (2x2 Grid) ──────────────────── */}
      <Card style={styles.detailsCard}>
        <Text style={styles.detailsHeading}>Location Details</Text>

        <View style={styles.detailsGrid}>
          {/* Status */}
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>STATUS</Text>
            <Text style={[styles.detailValue, { color: '#16A34A' }]}>At home</Text>
          </View>

          {/* Speed */}
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>SPEED</Text>
            <Text style={[styles.detailValue, { color: '#3C6FDB' }]}>0 km/h</Text>
          </View>

          {/* GPS Signal */}
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>GPS SIGNAL</Text>
            <Text style={[styles.detailValue, { color: '#16A34A' }]}>Strong</Text>
          </View>

          {/* Last Moved */}
          <View style={styles.detailBox}>
            <Text style={styles.detailLabel}>LAST MOVED</Text>
            <Text style={[styles.detailValue, { color: '#334155' }]}>10:48 AM</Text>
          </View>
        </View>
      </Card>

      {/* ── 4. Today's Location History ─────────────────────── */}
      <View style={styles.historySection}>
        <Text style={styles.sectionOverline}>TODAY'S LOCATION HISTORY</Text>

        <Card style={styles.historyCard}>
          {/* Item 1 */}
          <View style={[styles.historyRow, styles.historyDivider]}>
            <View style={[styles.historyIconBox, { backgroundColor: '#F0FDF4' }]}>
              <Trees size={18} color="#16A34A" />
            </View>
            <View style={styles.historyContent}>
              <Text style={styles.historyTitle}>Garden (rear)</Text>
              <Text style={styles.historySubtitle}>20-min walk · 1,247 steps</Text>
            </View>
            <Text style={styles.historyTime}>10:48 AM</Text>
          </View>

          {/* Item 2 */}
          <View style={[styles.historyRow, styles.historyDivider]}>
            <View style={[styles.historyIconBox, { backgroundColor: '#FFF7ED' }]}>
              <Home size={18} color="#EA580C" />
            </View>
            <View style={styles.historyContent}>
              <Text style={styles.historyTitle}>Ground Floor, Room 1</Text>
              <Text style={styles.historySubtitle}>Physiotherapy session</Text>
            </View>
            <Text style={styles.historyTime}>09:00 AM</Text>
          </View>

          {/* Item 3 */}
          <View style={styles.historyRow}>
            <View style={[styles.historyIconBox, { backgroundColor: '#EEF5FF' }]}>
              <Home size={18} color="#3C6FDB" />
            </View>
            <View style={styles.historyContent}>
              <Text style={styles.historyTitle}>Bastos Residence</Text>
              <Text style={styles.historySubtitle}>Overnight stay</Text>
            </View>
            <Text style={styles.historyTime}>07:00 AM</Text>
          </View>
        </Card>
      </View>

      {/* ── 5. Configure Safe Zone Button ───────────────────── */}
      <TouchableOpacity
        style={styles.configureSafeZoneBtn}
        onPress={() => router.push('/(Tutor)/geofencing' as any)}
        activeOpacity={0.8}
      >
        <Shield size={16} color="#3C6FDB" />
        <Text style={styles.configureSafeZoneText}>Configure Safe Zone</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 8,
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
  geofencingLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3C6FDB',
  },
  mapCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    padding: 0,
    marginBottom: 16,
  },
  mapContainer: {
    position: 'relative',
    height: 260,
    width: '100%',
    backgroundColor: '#E8F1FC',
  },
  mapBeaconBadge: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  beaconAddressText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1E293B',
  },
  beaconLiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  beaconCyanDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#06B6D4',
  },
  beaconLiveText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0891B2',
  },
  zoomButtonsWrap: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  zoomBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  locationSummaryBar: {
    padding: 16,
  },
  locationSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  locationSummaryTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  safeBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
  },
  safeBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  safeBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16A34A',
  },
  locationAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  locationAddressText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  locationFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationFooterText: {
    fontSize: 11.5,
    color: '#94A3B8',
    fontWeight: '500',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
  },
  detailsHeading: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 14,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  detailBox: {
    width: '48.2%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  historySection: {
    marginBottom: 16,
  },
  sectionOverline: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  historyDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  historyIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  historySubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  historyTime: {
    fontSize: 11.5,
    color: '#94A3B8',
    fontWeight: '600',
  },
  configureSafeZoneBtn: {
    height: 48,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#3C6FDB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  configureSafeZoneText: {
    color: '#3C6FDB',
    fontSize: 14,
    fontWeight: '700',
  },
});
