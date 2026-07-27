'use client';

import { Suspense, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { useLanguageStore } from '@/stores';

function I18nSync() {
  const { lang } = useLanguageStore();
  useEffect(() => {
    if (i18n.language !== lang) i18n.changeLanguage(lang);
  }, [lang]);
  return null;
}

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <Suspense>
        <I18nSync />
      </Suspense>
      {children}
    </I18nextProvider>
  );
}
