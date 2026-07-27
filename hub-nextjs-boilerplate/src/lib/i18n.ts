'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

export type SupportedLang = 'id' | 'en';
export type SupportedNs = 'common';
export const DEFAULT_LANG: SupportedLang = 'id';

if (!i18n.isInitialized) {
  i18n
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
      lng: DEFAULT_LANG,
      fallbackLng: DEFAULT_LANG,
      supportedLngs: ['id', 'en'],
      ns: ['common'],
      defaultNS: 'common',
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
      interpolation: { escapeValue: false },
      react: { useSuspense: true },
    });
}

export default i18n;
