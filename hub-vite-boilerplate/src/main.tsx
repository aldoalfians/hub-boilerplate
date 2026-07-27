import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { App as AntApp, ConfigProvider, Spin, theme as antTheme } from 'antd';
import idID from 'antd/locale/id_ID';
import enUS from 'antd/locale/en_US';
import App from './App';
import { useThemeStore } from './stores/useThemeStore';
import { useLanguageStore } from './stores/useLanguageStore';
import { lightTheme, darkTheme } from './styles/theme';
import StyledThemeProvider from './providers/StyledThemeProvider';

// Init i18n before render
import './lib/i18n';
import './styles/global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

const antdLocaleMap = {
  id: idID,
  en: enUS,
} as const;

// Theme + Language aware root
const ThemedApp = () => {
  const { mode } = useThemeStore();
  const { lang } = useLanguageStore();
  const isDark = mode === 'dark';

  return (
    <ConfigProvider
      locale={antdLocaleMap[lang]}
      theme={{
        ...(isDark ? darkTheme : lightTheme),
        algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
      }}
    >
      {/* styled-components ThemeProvider — synced with dark mode */}
      <StyledThemeProvider>
        <AntApp>
          <BrowserRouter>
            <Suspense
              fallback={
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                  <Spin size="large" />
                </div>
              }
            >
              <App />
            </Suspense>
          </BrowserRouter>
        </AntApp>
      </StyledThemeProvider>
    </ConfigProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemedApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
