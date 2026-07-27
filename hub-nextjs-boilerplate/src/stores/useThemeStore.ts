'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'light',
      toggle: () => {
        const next = get().mode === 'light' ? 'dark' : 'light';
        set({ mode: next });
        document.documentElement.setAttribute('data-theme', next);
      },
      setMode: (mode) => {
        set({ mode });
        document.documentElement.setAttribute('data-theme', mode);
      },
    }),
    {
      name: 'hub-theme',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.setAttribute('data-theme', state.mode);
        }
      },
    },
  ),
);
