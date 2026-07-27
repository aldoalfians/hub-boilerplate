import 'styled-components';
import type { StyledTokens } from '@/styles/tokens';

declare module 'styled-components' {
  export interface DefaultTheme extends StyledTokens {}
}
