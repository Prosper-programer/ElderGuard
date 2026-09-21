import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
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
  Shield,
  MapPin,
  Plus,
  Minus,
  Bell,
} from 'lucide-react-native';
import {
  ScreenContainer,
  BottomTabBar,
  Card,
} from '@/components/ui';

export default function GeofencingScreen() {
  const router = useRouter();
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [radius, setRadius] = useState<number>(500);
  const [alertExit, setAlertExit] = useState<boolean>(true);
  const [alertReturn, setAlertReturn] = useState<boolean>(true);

  // Scaled SVG radius for the dashed circle on map:
  // 100m -> r=35, 500m -> r=68, 1000m -> r=92, 2000m -> r=120
  const svgRadius = 35 + ((radius - 100) / 1900) * 85;

  const handleCenterChange = () => {
    Alert.alert('Change Centre Point', 'Centre point is anchored to registered residential address: Bastos, Yaoundé, Cameroon.');
  };

  return (
    <ScreenContainer
      scrollable
      padded
      backgroundColor="#F0F4FA"
      bottomBar={<BottomTabBar activeTab="location" role="parent" />}
    >
      {/* ── 1. Header ───────────────────────────────────────── */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ChevronLeft size={20} color="#334155" />
        </TouchableOpacity>

        <Text style={styles.screenTitle}>Geofencing</Text>
        <View style={{ width: 38 }} />
      </View>

      {/* ── 2. Safe Zone Toggle Switch Card ─────────────────── */}
      <Card style={styles.toggleCard}>
        <View
          style={[
            styles.toggleIconBox,
            { backgroundColor: isEnabled ? '#F0FDF4' : '#F1F5F9' },
          ]}
        >
          <Shield size={20} color={isEnabled ? '#16A34A' : '#94A3B8'} />
        </View>

        <View style={styles.toggleTextCol}>
          <Text style={styles.toggleTitle}>Safe Zone</Text>
          <Text style={styles.toggleSub}>
            {isEnabled
              ? 'Active · Margaret is inside the zone'
              : 'Off · No safe zone configured'}
          </Text>
        </View>

        <Switch
          value={isEnabled}
          onValueChange={setIsEnabled}
          trackColor={{ false: '#CBD5E1', true: '#3C6FDB' }}
          thumbColor="#FFFFFF"
        />
      </Card>

      {/* ── 3. SAFE ZONE MAP ────────────────────────────────── */}
      <View style={styles.sectionWrap}>
        <Text style={styles.sectionOverline}>SAFE ZONE MAP</Text>

        <Card style={styles.mapCard}>
          <View style={styles.mapContainer}>
            {/* When Disabled: Blurred / Faded Map Placeholder */}
            {!isEnabled ? (
              <View style={styles.disabledMapWrap}>
                <Svg width="100%" height={260} viewBox="0 0 340 260" opacity={0.35}>
                  <Rect x="0" y="0" width="340" height="260" fill="#E8F1FC" />
                  <Line x1="130" y1="0" x2="130" y2="260" stroke="#FFFFFF" strokeWidth="8" />
                  <Line x1="215" y1="0" x2="215" y2="260" stroke="#FFFFFF" strokeWidth="8" />
                  <Line x1="0" y1="65" x2="340" y2="65" stroke="#FFFFFF" strokeWidth="8" />
                  <Line x1="0" y1="116" x2="340" y2="116" stroke="#FFFFFF" strokeWidth="8" />
                  <Line x1="0" y1="166" x2="340" y2="166" stroke="#FFFFFF" strokeWidth="8" />
                </Svg>

                <View style={styles.disabledOverlay}>
                  <View style={styles.disabledIconBox}>
                    <Shield size={28} color="#94A3B8" />
                  </View>
                  <Text style={styles.disabledTitle}>Geofencing is off</Text>
                  <Text style={styles.disabledSub}>Enable the safe zone above</Text>
                </View>
              </View>
            ) : (
              /* When Enabled: Active Map with Geofence Radius Circle */
              <>
                <Svg width="100%" height={260} viewBox="0 0 340 260">
                  <Rect x="0" y="0" width="340" height="260" fill="#E8F1FC" />

                  {/* Parks */}
                  <Rect x="14" y="20" width="106" height="74" rx="10" fill="#BBF7D0" opacity={0.8} />
                  <Circle cx="35" cy="35" r="4" fill="#86EFAC" />
                  <Circle cx="60" cy="38" r="4.5" fill="#86EFAC" />
                  <Circle cx="45" cy="55" r="4" fill="#86EFAC" />
                  <SvgText x="20" y="82" fill="#15803D" fontSize="8" fontWeight="bold">
                    BASTOS PARK
                  </SvgText>

                  <Rect x="222" y="165" width="104" height="85" rx="10" fill="#BBF7D0" opacity={0.8} />
                  <SvgText x="238" y="228" fill="#15803D" fontSize="8" fontWeight="bold">
                    OMNISPORTS GARDENS
                  </SvgText>

                  {/* Grid Lines */}
                  <Line x1="130" y1="0" x2="130" y2="260" stroke="#FFFFFF" strokeWidth="8" />
                  <Line x1="215" y1="0" x2="215" y2="260" stroke="#FFFFFF" strokeWidth="8" />
                  <Line x1="0" y1="65" x2="340" y2="65" stroke="#FFFFFF" strokeWidth="8" />
                  <Line x1="0" y1="116" x2="340" y2="116" stroke="#FFFFFF" strokeWidth="8" />
                  <Line x1="0" y1="166" x2="340" y2="166" stroke="#FFFFFF" strokeWidth="8" />

                  {/* Dynamic Dashed Geofence Boundary Circle */}
                  <Circle
                    cx="175"
                    cy="128"
                    r={svgRadius}
                    fill="rgba(60, 111, 219, 0.08)"
                    stroke="#3C6FDB"
                    strokeWidth="2"
                    strokeDasharray="5,4"
                  />

                  {/* Beacon Marker */}
                  <Circle cx="175" cy="128" r="10" fill="#FFFFFF" stroke="#3C6FDB" strokeWidth="2.5" />
                  <Circle cx="175" cy="128" r="5" fill="#3C6FDB" />
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
              </>
            )}
          </View>
        </Card>
      </View>

      {/* ── 4. Safe Radius Slider Card ──────────────────────── */}
      {isEnabled && (
        <Card style={styles.radiusCard}>
          <View style={styles.radiusHeader}>
            <View>
              <Text style={styles.cardHeading}>Safe Radius</Text>
              <Text style={styles.cardSub}>Distance from home centre point</Text>
            </View>
            <Text style={styles.radiusValText}>{radius}m</Text>
          </View>

          {/* Interactive Radius Stepper / Preset Slider */}
          <View style={styles.sliderTrackWrap}>
            <View style={styles.sliderTrackBg}>
              <View
                style={[
                  styles.sliderTrackFill,
                  { width: `${((radius - 100) / 1900) * 100}%` },
                ]}
              />
            </View>
            <View
              style={[
                styles.sliderThumb,
                { left: `${Math.max(0, Math.min(94, ((radius - 100) / 1900) * 94))}%` },
              ]}
            />
          </View>

          {/* Preset Buttons */}
          <View style={styles.presetRow}>
            {[100, 500, 1000, 2000].map((val) => (
              <TouchableOpacity
                key={val}
                onPress={() => setRadius(val)}
                style={[styles.presetBtn, radius === val && styles.presetBtnActive]}
                activeOpacity={0.7}
              >
                <Text style={[styles.presetText, radius === val && styles.presetTextActive]}>
                  {val >= 1000 ? `${val / 1000}km` : `${val}m`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
      )}

      {/* ── 5. Centre Point Card ────────────────────────────── */}
      <Card style={styles.centerCard}>
        <Text style={styles.cardHeading}>Centre Point</Text>

        <View style={styles.centerRow}>
          <View style={styles.centerIconBox}>
            <MapPin size={17} color="#3C6FDB" />
          </View>
          <View style={styles.centerTextCol}>
            <Text style={styles.centerMainText}>Bastos, Yaoundé</Text>
            <Text style={styles.centerSubText}>Cameroon</Text>
          </View>
          <TouchableOpacity onPress={handleCenterChange} activeOpacity={0.7}>
            <Text style={styles.changeLink}>Change</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* ── 6. Alert Settings ───────────────────────────────── */}
      <Card style={styles.alertsCard}>
        <Text style={styles.cardHeading}>Alert Settings</Text>

        <View style={[styles.alertSettingRow, styles.alertSettingDivider]}>
          <View style={styles.alertSettingTextCol}>
            <Text style={styles.alertSettingTitle}>Alert on boundary exit</Text>
            <Text style={styles.alertSettingSub}>Notify immediately when boundary is crossed</Text>
          </View>
          <Switch
            value={alertExit}
            onValueChange={setAlertExit}
            trackColor={{ false: '#CBD5E1', true: '#3C6FDB' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.alertSettingRow}>
          <View style={styles.alertSettingTextCol}>
            <Text style={styles.alertSettingTitle}>Alert on boundary return</Text>
            <Text style={styles.alertSettingSub}>Notify when returning to home boundary</Text>
          </View>
          <Switch
            value={alertReturn}
            onValueChange={setAlertReturn}
            trackColor={{ false: '#CBD5E1', true: '#3C6FDB' }}
            thumbColor="#FFFFFF"
          />
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
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    gap: 14,
  },
  toggleIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleTextCol: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  toggleSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  sectionWrap: {
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
  mapCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    padding: 0,
  },
  mapContainer: {
    position: 'relative',
    height: 260,
    width: '100%',
    backgroundColor: '#E8F1FC',
  },
  disabledMapWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  disabledIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  disabledTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#475569',
  },
  disabledSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
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
  radiusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
  },
  radiusHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  radiusValText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#3C6FDB',
  },
  sliderTrackWrap: {
    height: 30,
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 10,
  },
  sliderTrackBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  sliderTrackFill: {
    height: 6,
    backgroundColor: '#3C6FDB',
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    top: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3C6FDB',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  presetBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  presetBtnActive: {
    backgroundColor: '#EEF5FF',
    borderColor: '#3C6FDB',
  },
  presetText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  presetTextActive: {
    color: '#3C6FDB',
  },
  centerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
  },
  centerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
  },
  centerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EEF5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTextCol: {
    flex: 1,
  },
  centerMainText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  centerSubText: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  changeLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3C6FDB',
  },
  alertsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 20,
  },
  alertSettingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  alertSettingDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  alertSettingTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  alertSettingTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  alertSettingSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
});
