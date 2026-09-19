/**
 * ============================================================================
 * ElderGuard — ScreenContainer.tsx
 * ============================================================================
 * 
 * PURPOSE:
 * The foundational layout wrapper used across all screens in the ElderGuard app.
 * 
 * CORE RESPONSIBILITIES:
 * 1. DYNAMIC SAFE AREA INSET ADAPTATION:
 *    - Automatically calculates `insets.top` from `react-native-safe-area-context`.
 *    - Guarantees that app content never overflows beneath the phone's physical hardware
 *      (iPhone Dynamic Island, notch, Android hole-punch cameras, or status bar).
 * 2. PINNED BOTTOM BAR SUPPORT:
 *    - Supports an optional `bottomBar` prop (e.g. `BottomTabBar`), keeping navigation
 *      permanently docked while allowing screen content above it to scroll smoothly.
 * 3. KEYBOARD AVOIDANCE:
 *    - Seamlessly wraps forms with `KeyboardAvoidingView` to prevent software keyboards
 *      from obscuring text inputs on iOS and Android.
 */

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Layout, Spacing } from '@/constants/theme';

interface ScreenContainerProps {
  /** The child elements/components to render inside the screen */
  children: React.ReactNode;
  /** When true, wraps content in a smooth vertical ScrollView (default: true) */
  scrollable?: boolean;
  /** When true, applies standard horizontal layout margins (default: true) */
  padded?: boolean;
  /** Background color override (default: Colors.background #F8FAFC) */
  backgroundColor?: string;
  /** Enables KeyboardAvoidingView for screens containing text input fields (default: false) */
  keyboardAvoiding?: boolean;
  /** Extra bottom padding to prevent content from touching the bottom edge */
  bottomPadding?: number;
  /** Pinned bottom dock element (e.g. <BottomTabBar />) */
  bottomBar?: React.ReactNode;
  /** Custom style overrides for the outer container */
  style?: ViewStyle;
  /** Custom style overrides for the inner content container */
  contentStyle?: ViewStyle;
}

export function ScreenContainer({
  children,
  scrollable = true,
  padded = true,
  backgroundColor = Colors.background,
  keyboardAvoiding = false,
  bottomPadding,
  bottomBar,
  style,
  contentStyle,
}: ScreenContainerProps) {
  // Read physical hardware insets (top notch, bottom home indicator)
  const insets = useSafeAreaInsets();

  // Root container style ensuring content begins below the device status bar
  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor,
    paddingTop: insets.top,
  };

  // Scroll content inner padding
  const innerContentStyle: ViewStyle = {
    ...(padded && {
      paddingHorizontal: Layout.screenPaddingH,
    }),
    paddingTop: Layout.screenPaddingTop,
    // When a bottom bar is docked, use standard spacing; otherwise respect home indicator inset
    paddingBottom: bottomBar
      ? Spacing.xl
      : (bottomPadding ?? Layout.screenPaddingBottom) + insets.bottom,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  };

  // Render scrollable or static content container based on prop
  const content = scrollable ? (
    <ScrollView
      style={[styles.scroll, style]}
      contentContainerStyle={[innerContentStyle, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.scroll, innerContentStyle, style, contentStyle]}>
      {children}
    </View>
  );

  return (
    <View style={containerStyle}>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
      
      {/* Wrap with keyboard avoidance if enabled (for forms like login or edit profile) */}
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}

      {/* Pinned Bottom Navigation Bar */}
      {bottomBar}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
});
