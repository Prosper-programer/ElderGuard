/**
 * ElderGuard Color Palette
 *
 * Primary: #3C6FDB (brand blue)
 * Accent: #00FBFB (cyan — used sparingly for interactive highlights)
 * Semantic: green/orange/red for status communication
 */

export const Colors = {
  // ── Brand ──────────────────────────────────────────────
  primary: '#3C6FDB',
  primaryLight: '#5A8AE6',
  primaryDark: '#2A56B0',
  primaryFaded: 'rgba(60, 111, 219, 0.08)',
  primaryFadedMedium: 'rgba(60, 111, 219, 0.15)',

  accent: '#00FBFB',
  accentDark: '#00D4D4',
  accentFaded: 'rgba(0, 251, 251, 0.10)',

  // ── Semantic / Status ──────────────────────────────────
  safe: '#22C55E',
  safeBg: 'rgba(34, 197, 94, 0.08)',
  safeLight: '#DCFCE7',

  warning: '#F59E0B',
  warningBg: 'rgba(245, 158, 11, 0.08)',
  warningLight: '#FEF3C7',

  critical: '#EF4444',
  criticalBg: 'rgba(239, 68, 68, 0.08)',
  criticalLight: '#FEE2E2',

  offline: '#94A3B8',
  offlineBg: 'rgba(148, 163, 184, 0.08)',
  offlineLight: '#F1F5F9',

  // ── Neutrals ──────────────────────────────────────────
  white: '#FFFFFF',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F5F9',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#E2E8F0',

  // ── Text ───────────────────────────────────────────────
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  textInverse: '#FFFFFF',
  textLink: '#3C6FDB',

  // ── Overlays ───────────────────────────────────────────
  overlay: 'rgba(15, 23, 42, 0.5)',
  shadowColor: 'rgba(15, 23, 42, 0.08)',

  // ── Misc ───────────────────────────────────────────────
  inputBackground: '#F8FAFC',
  inputBorder: '#CBD5E1',
  inputFocusBorder: '#3C6FDB',
  disabled: '#CBD5E1',
  disabledText: '#94A3B8',
} as const;

/**
 * Pre-composed status color sets for convenience.
 * Usage: StatusColors[status].color / .bg / .light
 */
export const StatusColors = {
  safe: { color: Colors.safe, bg: Colors.safeBg, light: Colors.safeLight, label: 'Safe' },
  warning: { color: Colors.warning, bg: Colors.warningBg, light: Colors.warningLight, label: 'Warning' },
  critical: { color: Colors.critical, bg: Colors.criticalBg, light: Colors.criticalLight, label: 'Critical' },
  offline: { color: Colors.offline, bg: Colors.offlineBg, light: Colors.offlineLight, label: 'Offline' },
} as const;

export type StatusType = keyof typeof StatusColors;
