'use client';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, theme as antTheme } from 'antd';
import { useThemeStore } from '@/stores';
import { lightTheme, darkTheme } from '@/styles/theme';
import idID from 'antd/locale/id_ID';
import enUS from 'antd/locale/en_US';
import { useLanguageStore } from '@/stores';

const antdLocaleMap = { id: idID, en: enUS };

export default function AntdProvider({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeStore();
  const { lang } = useLanguageStore();

  const themeConfig = mode === 'dark'
    ? { ...darkTheme, algorithm: antTheme.darkAlgorithm }
    : { ...lightTheme, algorithm: antTheme.defaultAlgorithm };

  return (
    <AntdRegistry>
      <ConfigProvider
        theme={themeConfig}
        locale={antdLocaleMap[lang] ?? idID}
      >
        {children}
      </ConfigProvider>
    </AntdRegistry>
  );
}
