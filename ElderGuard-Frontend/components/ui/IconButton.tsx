import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  GestureResponderEvent,
} from 'react-native';
import { Colors, Layout } from '@/constants/theme';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  size?: number;
  variant?: 'default' | 'filled' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
}

export function IconButton({
  icon,
  onPress,
  size = Layout.minTouchTarget,
  variant = 'default',
  disabled = false,
  style,
}: IconButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.6}
      style={[
        styles.base,
        variantStyles[variant],
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        disabled && styles.disabled,
        style,
      ]}
      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
    >
      {icon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
});

const variantStyles: Record<string, ViewStyle> = {
  default: {
    backgroundColor: Colors.surfaceSecondary,
  },
  filled: {
    backgroundColor: Colors.primaryFaded,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
};
