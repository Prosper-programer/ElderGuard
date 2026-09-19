/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        elder: {
          primary: '#3C6FDB',
          primaryLight: '#5A8AE6',
          primaryDark: '#2A56B0',
          primaryFaded: 'rgba(60, 111, 219, 0.08)',
          accent: '#00FBFB',
          accentDark: '#00D4D4',
          accentFaded: 'rgba(0, 251, 251, 0.10)',
          safe: '#22C55E',
          safeLight: '#DCFCE7',
          warning: '#F59E0B',
          warningLight: '#FEF3C7',
          critical: '#EF4444',
          criticalLight: '#FEE2E2',
          navy: '#0B1120',
          navySurface: '#0F172A',
          navyCard: '#1E293B',
          navyBorder: '#334155',
          bg: '#F8FAFC',
          surface: '#FFFFFF',
          border: '#E2E8F0',
          textPrimary: '#0F172A',
          textSecondary: '#475569',
          textTertiary: '#94A3B8',
        },
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        card: '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        elevated: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
        modal: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
        glow: '0 0 20px -3px rgba(0, 251, 251, 0.35)',
        primaryGlow: '0 0 20px -3px rgba(60, 111, 219, 0.4)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-left': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 15px rgba(0, 251, 251, 0.5)' },
          '50%': { opacity: '0.6', boxShadow: '0 0 5px rgba(0, 251, 251, 0.2)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slide-up 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-left': 'slide-left 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-glow': 'pulse-glow 2.5s infinite ease-in-out',
      },
    },
  },
  plugins: [],
}

