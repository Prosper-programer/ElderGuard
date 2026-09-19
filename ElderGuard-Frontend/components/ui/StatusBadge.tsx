import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { StatusColors, Typography, BorderRadius, Spacing } from '@/constants/theme';
import type { StatusType } from '@/constants/theme';

interface StatusBadgeProps {
  status: StatusType;
  /** Override default label */
  label?: string;
  /** Show a filled dot before the label */
  showDot?: boolean;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export function StatusBadge({
  status,
  label,
  showDot = true,
  size = 'md',
  style,
}: StatusBadgeProps) {
  const statusConfig = StatusColors[status];
  const displayLabel = label || statusConfig.label;
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        isSmall ? styles.badgeSm : styles.badgeMd,
        { backgroundColor: statusConfig.bg },
        style,
      ]}
    >
      {showDot && (
        <View
          style={[
            styles.dot,
            isSmall ? styles.dotSm : styles.dotMd,
            { backgroundColor: statusConfig.color },
          ]}
        />
      )}
      <Text
        style={[
          isSmall ? Typography.caption : Typography.captionMedium,
          { color: statusConfig.color },
        ]}
      >
        {displayLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    gap: 4,
  },
  badgeMd: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xl,
    gap: 6,
  },
  dot: {
    borderRadius: BorderRadius.full,
  },
  dotSm: {
    width: 5,
    height: 5,
  },
  dotMd: {
    width: 7,
    height: 7,
  },
});
