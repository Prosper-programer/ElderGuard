/**
 * ElderGuard Typography Scale
 *
 * Uses Inter font family for a clean, modern, highly readable mobile experience.
 * All sizes are optimized for smartphone screens.
 */

import { TextStyle } from 'react-native';

export const FontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const Typography: Record<string, TextStyle> = {
  // ── Headings ──────────────────────────────────────────
  h1: {
    fontFamily: FontFamily.bold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: FontFamily.bold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: FontFamily.semiBold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.2,
  },

  // ── Body ───────────────────────────────────────────────
  body: {
    fontFamily: FontFamily.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  bodyMedium: {
    fontFamily: FontFamily.medium,
    fontSize: 15,
    lineHeight: 22,
  },
  bodySemiBold: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    lineHeight: 22,
  },
  bodySmall: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  bodySmallMedium: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    lineHeight: 18,
  },

  // ── UI Elements ────────────────────────────────────────
  caption: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  captionMedium: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 0.3,
  },
  button: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  buttonSmall: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  overline: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  // ── Numbers / Data ─────────────────────────────────────
  metric: {
    fontFamily: FontFamily.bold,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  metricSmall: {
    fontFamily: FontFamily.bold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  metricUnit: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    lineHeight: 18,
  },
} as const;
