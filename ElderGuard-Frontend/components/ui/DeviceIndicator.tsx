import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Battery, Wifi, WifiOff } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

interface DeviceIndicatorProps {
  connected?: boolean;
  battery?: number;
  compact?: boolean;
}

export function DeviceIndicator({
  connected = true,
  battery = 84,
  compact = false,
}: DeviceIndicatorProps) {
  return (
    <View style={[styles.container, compact && styles.compact]}>
      {connected ? (
        <View style={styles.item}>
          <Wifi size={compact ? 11 : 13} color={Colors.safe} />
          <Text style={[styles.label, { color: Colors.safe }]}>Online</Text>
        </View>
      ) : (
        <View style={styles.item}>
          <WifiOff size={compact ? 11 : 13} color={Colors.offline} />
          <Text style={[styles.label, { color: Colors.offline }]}>Offline</Text>
        </View>
      )}

      <View style={styles.divider} />

      <View style={styles.item}>
        <Battery
          size={compact ? 11 : 13}
          color={battery > 20 ? (battery > 50 ? Colors.safe : Colors.warning) : Colors.critical}
        />
        <Text style={styles.label}>{battery}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  compact: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  divider: {
    width: 1,
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 6,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
