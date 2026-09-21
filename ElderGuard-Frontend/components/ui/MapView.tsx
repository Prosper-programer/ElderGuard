import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Rect, Path, Line, Circle, G, Text as SvgText } from 'react-native-svg';
import { MapPin, Navigation, ShieldCheck } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

interface MapViewProps {
  showGeofence?: boolean;
  geofenceRadius?: number;
  height?: number;
  address?: string;
  room?: string;
  isSafe?: boolean;
  onPressExpand?: () => void;
}

export function MapView({
  showGeofence = false,
  geofenceRadius = 300,
  height = 200,
  address = 'Bastos, Yaoundé, Cameroon',
  room = 'Living Room',
  isSafe = true,
  onPressExpand,
}: MapViewProps) {
  const svgRadius = Math.max(28, Math.min(geofenceRadius / 3.2, 85));

  return (
    <View style={[styles.card, { height }]}>
      <Svg viewBox="0 0 400 240" style={StyleSheet.absoluteFillObject} preserveAspectRatio="xMidYMid slice">
        {/* Base ground */}
        <Rect width="400" height="240" fill="#EEF3FA" />

        {/* Water body */}
        <Path
          d="M 0 190 Q 70 180 150 188 Q 230 196 310 185 Q 360 178 400 188 L 400 240 L 0 240 Z"
          fill="#BAD8F7"
          opacity={0.6}
        />

        {/* Park Green Areas */}
        <Rect x="14" y="14" width="96" height="60" fill="#BBF7D0" rx="8" opacity={0.75} />
        <Rect x="280" y="140" width="105" height="60" fill="#BBF7D0" rx="8" opacity={0.75} />

        {/* Tree markers in park */}
        {[
          [30, 30], [50, 26], [70, 34], [88, 28], [32, 50], [60, 46], [82, 44]
        ].map(([cx, cy], i) => (
          <Circle key={i} cx={cx} cy={cy} r="4" fill="#4ADE80" opacity={0.8} />
        ))}
        <SvgText x="62" y="66" fontSize="7" fill="#15803D" textAnchor="middle" fontWeight="bold">BASTOS PARK</SvgText>

        {/* City building blocks */}
        {[
          [14, 86, 54, 30], [76, 86, 48, 30],
          [14, 126, 50, 34], [72, 126, 52, 34],
          [146, 14, 48, 28], [202, 14, 56, 28],
          [266, 14, 58, 36], [332, 14, 52, 36],
          [146, 52, 52, 28], [206, 52, 52, 28],
          [266, 58, 56, 32], [330, 58, 54, 32],
          [146, 90, 50, 28], [204, 90, 54, 28],
          [266, 98, 118, 26],
          [146, 128, 54, 32], [208, 128, 50, 32],
        ].map(([x, y, w, h], i) => (
          <Rect key={i} x={x} y={y} width={w} height={h} fill="#DCE6F2" rx="4" />
        ))}

        {/* Roads */}
        <Rect x="0" y="80" width="400" height="7" fill="#FFFFFF" opacity={0.95} />
        <Rect x="0" y="120" width="400" height="5" fill="#FFFFFF" opacity={0.9} />
        <Rect x="134" y="0" width="9" height="240" fill="#FFFFFF" opacity={0.95} />
        <Rect x="260" y="0" width="7" height="180" fill="#FFFFFF" opacity={0.9} />

        {/* Geofence Perimeter Ring */}
        {showGeofence && (
          <G>
            <Circle
              cx="200"
              cy="104"
              r={svgRadius}
              fill="rgba(34, 197, 94, 0.12)"
              stroke="#22C55E"
              strokeWidth="2"
              strokeDasharray="4,4"
            />
            <Circle
              cx="200"
              cy="104"
              r={svgRadius + 8}
              fill="none"
              stroke="rgba(34, 197, 94, 0.3)"
              strokeWidth="1"
            />
          </G>
        )}

        {/* Margaret's Pulse Ping & Pin Marker */}
        <Circle cx="200" cy="104" r="18" fill="rgba(60, 111, 219, 0.2)" />
        <Circle cx="200" cy="104" r="10" fill="rgba(60, 111, 219, 0.4)" />
        <Circle cx="200" cy="104" r="6" fill="#3C6FDB" stroke="#FFFFFF" strokeWidth="2" />
      </Svg>

      {/* Floating Header Pill */}
      <View style={styles.topPill}>
        <View style={styles.statusDot} />
        <Text style={styles.topPillText}>{isSafe ? 'Inside Safe Zone' : 'Outside Boundary'}</Text>
        <Text style={styles.roomText}>• {room}</Text>
      </View>

      {/* Floating Bottom Card */}
      <View style={styles.bottomCard}>
        <View style={styles.addressRow}>
          <MapPin size={15} color={Colors.primary} />
          <Text style={styles.addressText} numberOfLines={1}>{address}</Text>
        </View>
        {onPressExpand && (
          <TouchableOpacity onPress={onPressExpand} style={styles.expandBtn} activeOpacity={0.8}>
            <Navigation size={13} color="#FFFFFF" />
            <Text style={styles.expandText}>Track</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#EEF3FA',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  topPill: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.safe,
  },
  topPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  roomText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
  },
  bottomCard: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  addressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  expandText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
