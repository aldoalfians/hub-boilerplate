import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

export type SupportedLang = 'id' | 'en';
export type SupportedNs = 'common';

export const SUPPORTED_LANGS: SupportedLang[] = ['id', 'en'];
export const DEFAULT_LANG: SupportedLang = 'id';
export const FALLBACK_LANG: SupportedLang = 'id';

if (!i18n.isInitialized) {
  i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
      lng: DEFAULT_LANG,
      fallbackLng: FALLBACK_LANG,
      supportedLngs: SUPPORTED_LANGS,
      ns: ['common'],
      defaultNS: 'common',
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
      interpolation: {
        escapeValue: false, // React handles XSS
      },
      react: {
        useSuspense: true,
      },
    });
}

export default i18n;
