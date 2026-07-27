import type { ThemeConfig } from 'antd';

// ── Brand Colors ──────────────────────────────────────────
export const colors = {
  primary: {
    50: '#E6F0FF',
    100: '#B3D1FF',
    200: '#66A3FF',
    400: '#1A75FF',
    600: '#0052CC',
    800: '#003D99',
    900: '#002966',
  },
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    400: '#94A3B8',
    600: '#475569',
    800: '#1E293B',
    900: '#0F172A',
  },
};

// ── Design Tokens ─────────────────────────────────────────
export const tokens = {
  // Light mode
  light: {
    primary: '#1A75FF',
    primaryDark: '#0052CC',
    primaryLight: '#E6F0FF',
    accent: '#F0B51C',
    accentLight: '#FFF9E6',

    success: '#16A34A',
    warning: '#D97706',
    danger: '#DC2626',
    info: '#2563EB',

    text: '#1E293B',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    textInverse: '#FFFFFF',

    bg: '#F8FAFC',
    bgCard: '#FFFFFF',
    border: '#E2E8F0',
    divider: '#F1F5F9',
  },
  // Dark mode
  dark: {
    primary: '#3B8FFF',
    primaryDark: '#1A75FF',
    primaryLight: 'rgba(59, 143, 255, 0.15)',
    accent: '#F0B51C',
    accentLight: 'rgba(240, 181, 28, 0.15)',

    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#60A5FA',

    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    textMuted: '#475569',
    textInverse: '#0F172A',

    bg: '#0F172A',
    bgCard: '#1E293B',
    border: '#334155',
    divider: '#1E293B',
  },
};

// ── Shared Design Tokens ──────────────────────────────────
export const UI = {
  shadow: {
    sm: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    md: '0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04)',
    lg: '0 10px 25px rgba(0,0,0,0.07), 0 6px 10px rgba(0,0,0,0.04)',
    xl: '0 20px 50px rgba(0,0,0,0.09), 0 10px 20px rgba(0,0,0,0.05)',
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '9999px',
  },
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

// ── Ant Design Theme Config ───────────────────────────────
const sharedComponents: ThemeConfig['components'] = {
  Button: { borderRadius: 10, controlHeight: 40 },
  Card: { borderRadiusLG: 14 },
  Input: { borderRadius: 10, controlHeight: 40 },
  Select: { borderRadius: 10, controlHeight: 40 },
  Table: { borderRadius: 14 },
  Menu: { borderRadius: 10, itemBorderRadius: 10 },
  Modal: { borderRadiusLG: 16 },
  Notification: { borderRadiusLG: 12 },
  Tag: { borderRadiusSM: 6 },
  Tabs: { borderRadius: 10 },
  DatePicker: { borderRadius: 10, controlHeight: 40 },
};

export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: tokens.light.primary,
    colorLink: tokens.light.primary,
    colorSuccess: tokens.light.success,
    colorWarning: tokens.light.warning,
    colorError: tokens.light.danger,
    colorInfo: tokens.light.info,
    colorBgLayout: tokens.light.bg,
    colorBgContainer: tokens.light.bgCard,
    colorBorder: tokens.light.border,
    colorText: tokens.light.text,
    colorTextSecondary: tokens.light.textSecondary,
    borderRadius: 10,
    fontFamily: UI.fontFamily,
    fontSize: 14,
    controlHeight: 40,
  },
  components: sharedComponents,
};

export const darkTheme: ThemeConfig = {
  token: {
    colorPrimary: tokens.dark.primary,
    colorLink: tokens.dark.primary,
    colorSuccess: tokens.dark.success,
    colorWarning: tokens.dark.warning,
    colorError: tokens.dark.danger,
    colorInfo: tokens.dark.info,
    colorBgLayout: tokens.dark.bg,
    colorBgContainer: tokens.dark.bgCard,
    colorBorder: tokens.dark.border,
    colorText: tokens.dark.text,
    colorTextSecondary: tokens.dark.textSecondary,
    borderRadius: 10,
    fontFamily: UI.fontFamily,
    fontSize: 14,
    controlHeight: 40,
  },
  components: sharedComponents,
};
