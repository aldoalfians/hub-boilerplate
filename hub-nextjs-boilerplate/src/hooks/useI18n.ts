'use client';

import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '@/stores';
import type { SupportedNs } from '@/lib/i18n';

const useI18n = (ns: SupportedNs = 'common') => {
  const { t, ready } = useTranslation(ns);
  const { lang, setLang } = useLanguageStore();

  return {
    t: (key: string, options?: Record<string, unknown>) => t(key, options) as string,
    lang,
    setLang,
    isLoading: !ready,
  };
};

export default useI18n;
