'use client';

import { ThemeProvider } from 'styled-components';
import { useThemeStore } from '@/stores';
import { lightTokens, darkTokens } from '@/styles/tokens';

export default function StyledThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeStore();
  const tokens = mode === 'dark' ? darkTokens : lightTokens;

  return <ThemeProvider theme={tokens}>{children}</ThemeProvider>;
}
