import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

interface DividerProps {
  /** Vertical spacing above and below */
  spacing?: number;
  style?: ViewStyle;
}

export function Divider({ spacing = Spacing.base, style }: DividerProps) {
  return (
    <View
      style={[
        styles.line,
        { marginVertical: spacing },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.divider,
    width: '100%',
  },
});
