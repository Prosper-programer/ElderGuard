import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  MapPin,
  Phone,
  RefreshCw,
  Plus,
  Minus,
  Clock,
  Compass,
} from 'lucide-react-native';
import {
  ScreenContainer,
  BottomTabBar,
  Card,
  TopBar,
  MapView,
  Button,
} from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';
import { MOCK_ELDERLY_PERSON, MOCK_USERS } from '@/services/mockData';

export default function CaregiverLocationScreen() {
  const router = useRouter();
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleCallParent = () => {
    Linking.openURL(
      `tel:${(MOCK_USERS.Tutor.phone || '+15551234567').replace(/[^0-9+]/g, '')}`
    ).catch(() => {});
  };

  return (
    <ScreenContainer
      scrollable
      padded
      backgroundColor="#F0F4FA"
      bottomBar={<BottomTabBar activeTab="home" role="caregiver" />}
    >
      <TopBar
        title="Location"
        onBack={() => (router.canGoBack() ? router.back() : router.replace('/(caregiver)' as any))}
      />

      {/* ── 1. Map Card with Live Beacon and Zoom Controls ──── */}
      <View style={styles.mapWrapper}>
        <MapView
          height={260}
          showGeofence={true}
          geofenceRadius={280 * zoomLevel}
          address={MOCK_ELDERLY_PERSON.address}
          room={MOCK_ELDERLY_PERSON.room}
          isSafe={true}
        />

        {/* Floating Zoom Controls */}
        <View style={styles.zoomControls}>
          <TouchableOpacity
            style={styles.zoomBtn}
            onPress={() => setZoomLevel((z) => Math.min(z + 0.2, 1.6))}
            activeOpacity={0.8}
          >
            <Plus size={16} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.zoomDivider} />
          <TouchableOpacity
            style={styles.zoomBtn}
            onPress={() => setZoomLevel((z) => Math.max(z - 0.2, 0.6))}
            activeOpacity={0.8}
          >
            <Minus size={16} color="#0F172A" />
          </TouchableOpacity>
        </View>

        {/* Floating Live Beacon Overlay Badge */}
        <View style={styles.floatingBeaconBadge}>
          <Text style={styles.beaconAddress}>42 Maple Street</Text>
          <View style={styles.beaconLiveRow}>
            <View style={styles.liveGreenDot} />
            <Text style={styles.beaconLiveText}>LIVE · GPS ±5m</Text>
          </View>
        </View>
      </View>

      {/* ── 2. Margaret's Location Status Card ────────────────── */}
      <Card style={styles.locationCard}>
        <View style={styles.locationCardHeader}>
          <Text style={styles.locationCardTitle}>Margaret&apos;s Location</Text>
          <View style={styles.safeBadge}>
            <View style={styles.safeDot} />
            <Text style={styles.safeBadgeText}>Safe</Text>
          </View>
        </View>

        <View style={styles.addressRow}>
          <MapPin size={18} color="#3C6FDB" style={{ marginTop: 2 }} />
          <Text style={styles.addressText}>{MOCK_ELDERLY_PERSON.address}</Text>
        </View>

        <View style={styles.updateRow}>
          <RefreshCw size={12} color="#64748B" />
          <Text style={styles.updateText}>Updated 2 min ago · Currently at home</Text>
        </View>
      </Card>

      {/* ── 3. Today's Movements Timeline ────────────────────── */}
      <View style={styles.movementsSection}>
        <Text style={styles.sectionHeading}>Today&apos;s movements</Text>
        <Card style={styles.movementsCard}>
          {/* Movement 1: Garden */}
          <View style={styles.timelineItem}>
            <View style={styles.timelineMarkerCol}>
              <View style={[styles.timelineDot, { backgroundColor: '#22C55E' }]} />
              <View style={styles.timelineLine} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.movementTitle}>Garden (rear)</Text>
              <Text style={styles.movementSub}>10:48 AM · 1,247 steps recorded</Text>
            </View>
          </View>

          {/* Movement 2: Ground Floor Room 1 */}
          <View style={styles.timelineItem}>
            <View style={styles.timelineMarkerCol}>
              <View style={[styles.timelineDot, { backgroundColor: '#3C6FDB' }]} />
              <View style={styles.timelineLine} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.movementTitle}>Ground Floor Room 1</Text>
              <Text style={styles.movementSub}>Now · Physiotherapy session</Text>
            </View>
          </View>

          {/* Movement 3: 42 Maple Street */}
          <View style={[styles.timelineItem, { paddingBottom: 0 }]}>
            <View style={styles.timelineMarkerCol}>
              <View style={[styles.timelineDot, { backgroundColor: '#94A3B8' }]} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.movementTitle}>42 Maple Street</Text>
              <Text style={styles.movementSub}>07:00 AM · Overnight stay</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* ── 4. Quick Action: Call Family ─────────────────────── */}
      <View style={{ marginTop: 12 }}>
        <Button
          variant="outline"
          fullWidth
          onPress={handleCallParent}
          leftIcon={<Phone size={16} color={Colors.primary} />}
          title={`Call Family (${MOCK_USERS.Tutor.name})`}
        />
      </View>

      <View style={{ height: Spacing.xl }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  mapWrapper: {
    marginVertical: 12,
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  zoomControls: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
  },
  zoomBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  floatingBeaconBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  beaconAddress: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  beaconLiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  liveGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  beaconLiveText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#15803D',
    letterSpacing: 0.5,
  },
  locationCard: {
    padding: 16,
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
  },
  locationCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  locationCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  safeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  safeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  safeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  addressText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
    lineHeight: 18,
  },
  updateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  updateText: {
    fontSize: 11,
    color: '#64748B',
  },
  movementsSection: {
    marginTop: 4,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  movementsCard: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 16,
  },
  timelineMarkerCol: {
    alignItems: 'center',
    width: 14,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 2,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginTop: 4,
    marginBottom: -4,
  },
  timelineContent: {
    flex: 1,
  },
  movementTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  movementSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
});
