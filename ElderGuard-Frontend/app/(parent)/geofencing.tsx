import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { Circle as MapCircle, Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import {
  ChevronLeft,
  Shield,
  MapPin,
} from 'lucide-react-native';
import {
  ScreenContainer,
  BottomTabBar,
  Card,
} from '@/components/ui';
import { useElderly } from '@/context/ElderlyContext';
import { apiGetGeofence, apiCreateGeofence, apiToggleGeofence } from '@/services/elderlyService';

// Default center to Yaounde, Cameroon
const DEFAULT_CENTER = {
  latitude: 3.8821,
  longitude: 11.5126,
};

export default function GeofencingScreen() {
  const router = useRouter();
  const { activeProfile } = useElderly();
  const elderlyId = activeProfile?.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [radius, setRadius] = useState<number>(500);
  const [centerLocation, setCenterLocation] = useState(DEFAULT_CENTER);

  // Real location state
  const [locationName, setLocationName] = useState<string>('Fetching location...');
  const [locationLoading, setLocationLoading] = useState(true);

  // Alerts
  const [alertExit, setAlertExit] = useState<boolean>(true);
  const [alertReturn, setAlertReturn] = useState<boolean>(true);

  useEffect(() => {
    loadGeofence();
    fetchRealLocation();
  }, [elderlyId]);

  /**
   * Fetches the device's real GPS location and reverse-geocodes it to a
   * human-readable string like "Bastos, Yaoundé, Cameroon".
   */
  const fetchRealLocation = async () => {
    setLocationLoading(true);
    try {
      // 1. Ask for permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationName('Location permission denied');
        setLocationLoading(false);
        return;
      }

      // 2. Get current GPS coordinates
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // 3. Update the map centre to the real position
      setCenterLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      // 4. Reverse-geocode to get a readable address
      const [place] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (place) {
        // Build a clean label from available parts
        const parts: string[] = [];
        if (place.district || place.subregion) parts.push(place.district || place.subregion || '');
        if (place.city) parts.push(place.city);
        if (place.country) parts.push(place.country);
        setLocationName(parts.filter(Boolean).join(', ') || 'Current Location');
      } else {
        setLocationName(
          `${loc.coords.latitude.toFixed(4)}, ${loc.coords.longitude.toFixed(4)}`
        );
      }
    } catch (e) {
      setLocationName('Unable to get location');
    } finally {
      setLocationLoading(false);
    }
  };

  const loadGeofence = async () => {
    if (!elderlyId) return;
    setIsLoading(true);
    const data = await apiGetGeofence(elderlyId);
    if (data) {
      setIsEnabled(data.is_enabled);
      setRadius(data.radius);
      setCenterLocation({
        latitude: parseFloat(data.center_latitude) || DEFAULT_CENTER.latitude,
        longitude: parseFloat(data.center_longitude) || DEFAULT_CENTER.longitude,
      });
    } else {
      setIsEnabled(false);
    }
    setIsLoading(false);
  };

  const handleToggle = async (val: boolean) => {
    setIsEnabled(val);
    if (!elderlyId) return;
    setIsSaving(true);

    const existing = await apiGetGeofence(elderlyId);
    if (!existing && val) {
      await apiCreateGeofence({
        elderly_id: elderlyId,
        center_latitude: centerLocation.latitude,
        center_longitude: centerLocation.longitude,
        radius: radius,
      });
    } else {
      await apiToggleGeofence(elderlyId, val);
    }
    setIsSaving(false);
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
  };

  const saveRadiusToBackend = async (newRadius: number) => {
    if (!elderlyId) return;
    await apiCreateGeofence({
      elderly_id: elderlyId,
      center_latitude: centerLocation.latitude,
      center_longitude: centerLocation.longitude,
      radius: newRadius,
    });
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3C6FDB" />
      </View>
    );
  }

  return (
    <ScreenContainer
      scrollable
      padded
      backgroundColor="#F0F4FA"
      bottomBar={<BottomTabBar activeTab="location" role="parent" />}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <ChevronLeft size={20} color="#334155" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Geofencing</Text>
        <View style={{ width: 38 }} />
      </View>

      <Card style={styles.toggleCard}>
        <View style={[styles.toggleIconBox, { backgroundColor: isEnabled ? '#F0FDF4' : '#F1F5F9' }]}>
          <Shield size={20} color={isEnabled ? '#16A34A' : '#94A3B8'} />
        </View>

        <View style={styles.toggleTextCol}>
          <Text style={styles.toggleTitle}>Safe Zone</Text>
          <Text style={styles.toggleSub}>
            {isEnabled
              ? 'Active — Monitoring boundary'
              : 'Off — No safe zone configured'}
          </Text>
        </View>

        <Switch
          value={isEnabled}
          onValueChange={handleToggle}
          trackColor={{ false: '#CBD5E1', true: '#3C6FDB' }}
          thumbColor="#FFFFFF"
          disabled={isSaving}
        />
      </Card>

      <View style={styles.sectionWrap}>
        <Text style={styles.sectionOverline}>SAFE ZONE MAP</Text>
        <Card style={styles.mapCard}>
          <View style={styles.mapContainer}>
            {!isEnabled ? (
              <View style={styles.disabledMapWrap}>
                <View style={styles.disabledOverlay}>
                  <View style={styles.disabledIconBox}>
                    <Shield size={28} color="#94A3B8" />
                  </View>
                  <Text style={styles.disabledTitle}>Geofencing is off</Text>
                  <Text style={styles.disabledSub}>Enable the safe zone above</Text>
                </View>
              </View>
            ) : (
              <MapView
                style={StyleSheet.absoluteFillObject}
                provider={PROVIDER_DEFAULT}
                initialRegion={{
                  latitude: centerLocation.latitude,
                  longitude: centerLocation.longitude,
                  latitudeDelta: 0.02,
                  longitudeDelta: 0.02,
                }}
              >
                <Marker coordinate={centerLocation} title="Home Base" />
                <MapCircle
                  center={centerLocation}
                  radius={radius}
                  fillColor="rgba(60, 111, 219, 0.15)"
                  strokeColor="rgba(60, 111, 219, 0.8)"
                  strokeWidth={2}
                />
              </MapView>
            )}
          </View>
        </Card>
      </View>

      <Card style={styles.radiusCard}>
        <View style={styles.radiusHeader}>
          <View>
            <Text style={styles.cardHeading}>Boundary Radius</Text>
            <Text style={styles.cardSub}>Distance from centre</Text>
          </View>
          <Text style={styles.radiusValText}>{radius} m</Text>
        </View>

        <View style={styles.presetRow}>
          {[100, 500, 1000, 2000].map((preset) => (
            <TouchableOpacity
              key={preset}
              onPress={() => {
                handleRadiusChange(preset);
                saveRadiusToBackend(preset);
              }}
              style={[styles.presetBtn, radius === preset && styles.presetBtnActive]}
            >
              <Text style={[styles.presetText, radius === preset && styles.presetTextActive]}>
                {preset}m
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Centre Point Card — shows real location */}
      <Card style={styles.centerCard}>
        <Text style={styles.cardHeading}>Centre Point</Text>
        <View style={styles.centerRow}>
          <View style={styles.centerIconBox}>
            <MapPin size={18} color="#3C6FDB" />
          </View>
          <View style={styles.centerTextCol}>
            <Text style={styles.centerMainText}>Current Location</Text>
            {locationLoading ? (
              <ActivityIndicator size="small" color="#3C6FDB" style={{ alignSelf: 'flex-start', marginTop: 2 }} />
            ) : (
              <Text style={styles.centerSubText}>{locationName}</Text>
            )}
          </View>
          {/* Refresh button */}
          <TouchableOpacity onPress={fetchRealLocation} style={styles.refreshBtn} activeOpacity={0.7}>
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </Card>

    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, marginBottom: 8 },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  screenTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', letterSpacing: -0.3 },
  toggleCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16, gap: 14 },
  toggleIconBox: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  toggleTextCol: { flex: 1 },
  toggleTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  toggleSub: { fontSize: 11.5, color: '#64748B', marginTop: 2 },
  sectionWrap: { marginBottom: 16 },
  sectionOverline: { fontSize: 11.5, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10 },
  mapCard: { backgroundColor: '#FFFFFF', borderRadius: 22, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden', padding: 0 },
  mapContainer: { position: 'relative', height: 260, width: '100%', backgroundColor: '#E8F1FC' },
  disabledMapWrap: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  disabledOverlay: { position: 'absolute', alignItems: 'center', justifyContent: 'center', padding: 20 },
  disabledIconBox: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  disabledTitle: { fontSize: 15, fontWeight: '800', color: '#475569' },
  disabledSub: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  radiusCard: { backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', padding: 16, marginBottom: 16 },
  radiusHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 },
  cardHeading: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  cardSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  radiusValText: { fontSize: 22, fontWeight: '800', color: '#3C6FDB' },
  presetRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  presetBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  presetBtnActive: { backgroundColor: '#EEF5FF', borderColor: '#3C6FDB' },
  presetText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  presetTextActive: { color: '#3C6FDB' },
  centerCard: { backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', padding: 16, marginBottom: 16 },
  centerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12, backgroundColor: '#F8FAFC', borderRadius: 14, padding: 12 },
  centerIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EEF5FF', alignItems: 'center', justifyContent: 'center' },
  centerTextCol: { flex: 1 },
  centerMainText: { fontSize: 13.5, fontWeight: '700', color: '#1E293B' },
  centerSubText: { fontSize: 11.5, color: '#64748B', marginTop: 1 },
  refreshBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: '#EEF5FF', borderWidth: 1, borderColor: '#3C6FDB' },
  refreshText: { fontSize: 11, fontWeight: '700', color: '#3C6FDB' },
});
