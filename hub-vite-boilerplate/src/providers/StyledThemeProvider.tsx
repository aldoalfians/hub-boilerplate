import { ThemeProvider } from 'styled-components';
import { useThemeStore } from '@/stores';
import { lightTokens, darkTokens } from '@/styles/tokens';

/**
 * Bridges Zustand useThemeStore ↔ styled-components ThemeProvider.
 * Wrap around app root so styled-components can access theme tokens.
 *
 * Usage in styled-components:
 *   const Box = styled.div`color: ${({ theme }) => theme.primary};`
 */
const StyledThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { mode } = useThemeStore();

  return (
    <ThemeProvider theme={mode === 'dark' ? darkTokens : lightTokens}>
      {children}
    </ThemeProvider>
  );
};

export default StyledThemeProvider;
