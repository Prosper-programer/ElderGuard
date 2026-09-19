import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  /** Remove default padding */
  noPadding?: boolean;
  /** Add subtle shadow */
  elevated?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, noPadding, elevated, style }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        !noPadding && styles.padded,
        elevated && Shadows.md,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  padded: {
    padding: Spacing.base,
  },
});
