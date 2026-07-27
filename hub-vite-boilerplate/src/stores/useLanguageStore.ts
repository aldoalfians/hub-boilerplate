import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SupportedLang } from '@/lib/i18n';
import { DEFAULT_LANG } from '@/lib/i18n';

interface LanguageState {
  lang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      lang: DEFAULT_LANG,

      setLang: (lang) => {
        set({ lang });
        // Sync i18next — lazy import to avoid circular dep
        import('@/lib/i18n').then(({ default: i18n }) => {
          i18n.changeLanguage(lang);
        });
      },
    }),
    {
      name: 'hub-lang',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Sync i18next on hydration
          import('@/lib/i18n').then(({ default: i18n }) => {
            i18n.changeLanguage(state.lang);
          });
        }
      },
    },
  ),
);
