/**
 * ElderGuard Spacing & Layout Tokens
 *
 * Consistent spacing scale used across all screens and components.
 * Based on a 4px base unit for pixel-perfect alignment.
 */

export const Spacing = {
  /** 4px — micro spacing (icon gaps, badge padding) */
  xs: 4,
  /** 8px — small spacing (inline gaps, tight lists) */
  sm: 8,
  /** 12px — medium-small (between related elements) */
  md: 12,
  /** 16px — base spacing (standard padding, gaps) */
  base: 16,
  /** 20px — comfortable spacing */
  lg: 20,
  /** 24px — section spacing */
  xl: 24,
  /** 32px — large section spacing */
  '2xl': 32,
  /** 40px — screen section separation */
  '3xl': 40,
  /** 48px — major screen divisions */
  '4xl': 48,
} as const;

export const BorderRadius = {
  /** 4px — subtle rounding (tags, badges) */
  xs: 4,
  /** 8px — small rounding (buttons, inputs) */
  sm: 8,
  /** 12px — medium rounding (cards, containers) */
  md: 12,
  /** 16px — large rounding (modals, sheets) */
  lg: 16,
  /** 24px — pill shape (chips, toggle) */
  xl: 24,
  /** 9999px — full circle */
  full: 9999,
} as const;

export const Layout = {
  /** Horizontal screen padding */
  screenPaddingH: 20,
  /** Top padding below safe area */
  screenPaddingTop: 16,
  /** Bottom padding above safe area */
  screenPaddingBottom: 24,
  /** Min touch target size (44pt Apple HIG) */
  minTouchTarget: 44,
  /** Standard icon size in UI */
  iconSizeSmall: 16,
  iconSizeMedium: 20,
  iconSizeLarge: 24,
  iconSizeXL: 32,
} as const;

export const Shadows = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
} as const;
