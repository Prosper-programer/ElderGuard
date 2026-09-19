import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertTriangle, CheckCircle, Info, ShieldAlert, ChevronRight } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

interface AlertItemProps {
  type: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  time: string;
  date?: string;
  resolved?: boolean;
  onPress?: () => void;
}

export function AlertItem({
  type,
  title,
  description,
  time,
  date,
  resolved = false,
  onPress,
}: AlertItemProps) {
  const configs = {
    info: {
      Icon: Info,
      color: '#2563EB',
      bg: '#EFF6FF',
      border: '#BFDBFE',
    },
    warning: {
      Icon: AlertTriangle,
      color: '#EA580C',
      bg: '#FFF7ED',
      border: '#FDBA74',
    },
    critical: {
      Icon: ShieldAlert,
      color: '#DC2626',
      bg: '#FEF2F2',
      border: '#FCA5A5',
    },
  };

  const cfg = configs[type];
  const { Icon } = cfg;

  const content = (
    <View style={styles.row}>
      <View style={[styles.iconWrap, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
        <Icon size={18} color={cfg.color} />
      </View>

      <View style={styles.textWrap}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {resolved && (
            <View style={styles.resolvedBadge}>
              <CheckCircle size={12} color={Colors.safe} />
              <Text style={styles.resolvedText}>Resolved</Text>
            </View>
          )}
        </View>

        <Text style={styles.description} numberOfLines={2}>{description}</Text>

        <View style={styles.footerRow}>
          <Text style={styles.timestamp}>
            {date ? `${date} · ` : ''}{time}
          </Text>
          {onPress && <ChevronRight size={14} color={Colors.textTertiary} />}
        </View>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.container, resolved && styles.containerResolved]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, resolved && styles.containerResolved]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  containerResolved: {
    opacity: 0.85,
    backgroundColor: '#FAFCFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  textWrap: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  resolvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.safeBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  resolvedText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.safe,
  },
  description: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 17,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  timestamp: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
});
