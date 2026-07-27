import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '@/stores/useLanguageStore';
import type { SupportedLang, SupportedNs } from '@/lib/i18n';

interface UseI18nReturn {
  /** Translate key. Falls back to key if not found. */
  t: (key: string, options?: Record<string, unknown>) => string;
  /** Current active language */
  lang: SupportedLang;
  /** Change language globally */
  setLang: (lang: SupportedLang) => void;
  /** Whether translations are still loading */
  isLoading: boolean;
}

/**
 * Main i18n hook. Wraps react-i18next useTranslation.
 * Synced with useLanguageStore for persistence.
 *
 * @param ns - Namespace to load. Defaults to 'common'.
 *
 * @example
 * const { t, lang, setLang } = useI18n();
 * t('login.title')       // → 'Masuk' (id) | 'Login' (en)
 * setLang('en')          // switch language globally
 *
 * // With specific namespace:
 * const { t } = useI18n('dashboard');
 * t('welcome')
 */
const useI18n = (ns: SupportedNs = 'common'): UseI18nReturn => {
  const { t, ready } = useTranslation(ns);
  const { lang, setLang } = useLanguageStore();

  return {
    t: (key, options) => t(key, options) as string,
    lang,
    setLang,
    isLoading: !ready,
  };
};

export default useI18n;
