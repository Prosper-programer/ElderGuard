import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
} from 'react-native';
import { Colors, Typography, BorderRadius, Spacing, Layout } from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title?: string;
  children?: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  onClick?: (event: any) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  maxWidth?: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

export function Button({
  title,
  children,
  onPress,
  onClick,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  maxWidth,
  leftIcon,
  rightIcon,
  style,
}: ButtonProps) {
  const handlePress = onPress || onClick;
  const isDisabled = disabled || loading;

  const containerStyles: ViewStyle[] = [
    styles.base,
    sizeStyles[size],
    variantStyles[variant],
    fullWidth && styles.fullWidth,
    Boolean(maxWidth) && { maxWidth },
    isDisabled && styles.disabled,
    isDisabled && variant === 'primary' && styles.disabledPrimary,
    isDisabled && variant === 'danger' && styles.disabledDanger,
    style as ViewStyle,
  ].filter(Boolean) as ViewStyle[];

  const textColor = getTextColor(variant, isDisabled);

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.75}
      style={containerStyles}
      hitSlop={size === 'sm' ? { top: 6, bottom: 6, left: 6, right: 6 } : undefined}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={textColor}
          style={styles.loader}
        />
      ) : (
        leftIcon && <>{leftIcon}</>
      )}
      {children ? (
        typeof children === 'string' || typeof children === 'number' ? (
          <Text
            numberOfLines={2}
            style={[
              size === 'sm' ? Typography.buttonSmall : Typography.button,
              styles.buttonText,
              { color: textColor },
            ]}
          >
            {children}
          </Text>
        ) : Array.isArray(children) ? (
          React.Children.map(children, (child) =>
            typeof child === 'string' || typeof child === 'number' ? (
              <Text
                numberOfLines={2}
                style={[
                  size === 'sm' ? Typography.buttonSmall : Typography.button,
                  styles.buttonText,
                  { color: textColor },
                ]}
              >
                {child}
              </Text>
            ) : (
              child
            )
          )
        ) : (
          children
        )
      ) : (
        <Text
          numberOfLines={2}
          style={[
            size === 'sm' ? Typography.buttonSmall : Typography.button,
            styles.buttonText,
            { color: textColor },
          ]}
        >
          {title}
        </Text>
      )}
      {!loading && rightIcon && <>{rightIcon}</>}
    </TouchableOpacity>
  );
}

function getTextColor(variant: ButtonVariant, isDisabled: boolean): string {
  if (isDisabled) {
    if (variant === 'primary' || variant === 'danger') return Colors.white;
    return Colors.disabledText;
  }
  switch (variant) {
    case 'primary':
      return Colors.white;
    case 'secondary':
      return Colors.primary;
    case 'outline':
      return Colors.primary;
    case 'ghost':
      return Colors.primary;
    case 'danger':
      return Colors.white;
  }
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    minHeight: Layout.minTouchTarget,
  },
  buttonText: {
    textAlign: 'center',
    flexShrink: 1,
  },
  fullWidth: {
    width: '100%',
    alignSelf: 'stretch',
  },
  disabled: {
    opacity: 0.55,
  },
  disabledPrimary: {
    backgroundColor: Colors.disabled,
    opacity: 1,
  },
  disabledDanger: {
    backgroundColor: Colors.disabled,
    opacity: 1,
  },
  loader: {
    marginRight: 2,
  },
});

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  sm: {
    minHeight: 38,
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  md: {
    minHeight: 48,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.sm,
  },
  lg: {
    minHeight: 54,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
};

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.primaryFaded,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: Colors.critical,
  },
};
