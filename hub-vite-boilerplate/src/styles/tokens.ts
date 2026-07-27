/**
 * Design tokens for styled-components.
 * Flat objects consumed via ${({ theme }) => theme.primary} in template literals.
 * Bridges Ant Design theme config ↔ styled-components ThemeProvider.
 */

export interface StyledTokens {
  // Brand
  primary: string;
  primaryLight: string;
  primaryGlow: string;
  primaryGradient: string;

  // Accent
  accent: string;
  accentLight: string;
  accentGlow: string;

  // Status
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  danger: string;
  dangerLight: string;
  info: string;
  infoLight: string;

  // Text
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;

  // Background
  bg: string;
  bgCard: string;
  border: string;
  divider: string;

  // Effects
  shadow: string;
  shadowHover: string;
  shadowCard: string;

  // Radius
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusXl: string;

  // Chart colors (ordered palette)
  chartColors: string[];
}

export const lightTokens: StyledTokens = {
  primary: '#1A75FF',
  primaryLight: '#E6F0FF',
  primaryGlow: 'rgba(26, 117, 255, 0.12)',
  primaryGradient: 'linear-gradient(135deg, #1A75FF 0%, #0052CC 100%)',

  accent: '#F0B51C',
  accentLight: '#FFF9E6',
  accentGlow: 'rgba(240, 181, 28, 0.15)',

  success: '#16A34A',
  successLight: '#ECFDF5',
  warning: '#D97706',
  warningLight: '#FEF9E7',
  danger: '#DC2626',
  dangerLight: '#FEF2F2',
  info: '#2563EB',
  infoLight: '#EFF6FF',

  text: '#1E293B',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',

  bg: '#F8FAFC',
  bgCard: '#FFFFFF',
  border: '#E2E8F0',
  divider: '#F1F5F9',

  shadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  shadowHover: '0 8px 30px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.06)',
  shadowCard: '0 2px 16px rgba(0,0,0,0.04), 0 0 1px rgba(0,0,0,0.06)',

  radiusSm: '8px',
  radiusMd: '12px',
  radiusLg: '16px',
  radiusXl: '20px',

  chartColors: ['#1A75FF', '#16A34A', '#F0B51C', '#DC2626', '#2563EB', '#9333EA', '#0891B2'],
};

export const darkTokens: StyledTokens = {
  primary: '#3B8FFF',
  primaryLight: 'rgba(59, 143, 255, 0.15)',
  primaryGlow: 'rgba(59, 143, 255, 0.20)',
  primaryGradient: 'linear-gradient(135deg, #3B8FFF 0%, #1A75FF 100%)',

  accent: '#F0B51C',
  accentLight: 'rgba(240, 181, 28, 0.15)',
  accentGlow: 'rgba(240, 181, 28, 0.20)',

  success: '#22C55E',
  successLight: 'rgba(34, 197, 94, 0.15)',
  warning: '#F59E0B',
  warningLight: 'rgba(245, 158, 11, 0.15)',
  danger: '#EF4444',
  dangerLight: 'rgba(239, 68, 68, 0.15)',
  info: '#60A5FA',
  infoLight: 'rgba(96, 165, 250, 0.15)',

  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverse: '#0F172A',

  bg: '#0F172A',
  bgCard: '#1E293B',
  border: '#334155',
  divider: '#1E293B',

  shadow: '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
  shadowHover: '0 8px 30px rgba(0,0,0,0.4), 0 0 1px rgba(0,0,0,0.3)',
  shadowCard: '0 2px 16px rgba(0,0,0,0.25), 0 0 1px rgba(0,0,0,0.2)',

  radiusSm: '8px',
  radiusMd: '12px',
  radiusLg: '16px',
  radiusXl: '20px',

  chartColors: ['#3B8FFF', '#22C55E', '#F0B51C', '#EF4444', '#60A5FA', '#A78BFA', '#22D3EE'],
};
