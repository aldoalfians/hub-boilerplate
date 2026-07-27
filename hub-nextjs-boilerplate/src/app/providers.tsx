'use client';

import StyledComponentsRegistry from '@/providers/StyledComponentsRegistry';
import StyledThemeProvider from '@/providers/StyledThemeProvider';
import AntdProvider from '@/providers/AntdProvider';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import I18nProvider from '@/providers/I18nProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StyledComponentsRegistry>
      <ReactQueryProvider>
        <AntdProvider>
          <StyledThemeProvider>
            <I18nProvider>
              {children}
            </I18nProvider>
          </StyledThemeProvider>
        </AntdProvider>
      </ReactQueryProvider>
    </StyledComponentsRegistry>
  );
}
