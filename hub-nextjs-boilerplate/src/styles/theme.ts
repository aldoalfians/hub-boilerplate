import type { ThemeConfig } from 'antd';

export const UI = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

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
    colorPrimary: '#1A75FF',
    colorLink: '#1A75FF',
    colorSuccess: '#16A34A',
    colorWarning: '#D97706',
    colorError: '#DC2626',
    colorInfo: '#2563EB',
    colorBgLayout: '#F8FAFC',
    colorBgContainer: '#FFFFFF',
    colorBorder: '#E2E8F0',
    colorText: '#1E293B',
    colorTextSecondary: '#475569',
    borderRadius: 10,
    fontFamily: UI.fontFamily,
    fontSize: 14,
    controlHeight: 40,
  },
  components: sharedComponents,
};

export const darkTheme: ThemeConfig = {
  algorithm: undefined, // set via AntdProvider using darkAlgorithm
  token: {
    colorPrimary: '#3B8FFF',
    colorLink: '#3B8FFF',
    colorSuccess: '#22C55E',
    colorWarning: '#F59E0B',
    colorError: '#EF4444',
    colorInfo: '#60A5FA',
    colorBgLayout: '#0F172A',
    colorBgContainer: '#1E293B',
    colorBorder: '#334155',
    colorText: '#F1F5F9',
    colorTextSecondary: '#94A3B8',
    borderRadius: 10,
    fontFamily: UI.fontFamily,
    fontSize: 14,
    controlHeight: 40,
  },
  components: sharedComponents,
};
