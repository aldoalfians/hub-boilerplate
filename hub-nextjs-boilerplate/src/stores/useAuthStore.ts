'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthUser } from '@/types/api';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  setAuthData: (token: string, user: AuthUser) => void;
  setAccessToken: (token: string) => void;
  setUser: (user: AuthUser) => void;
  clearAuthData: () => void;
  getUser: () => AuthUser | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isLoggedIn: false,
      setAuthData: (token, user) => set({ accessToken: token, user, isLoggedIn: true }),
      setAccessToken: (token) => set({ accessToken: token }),
      setUser: (user) => set({ user, isLoggedIn: Boolean(user) }),
      clearAuthData: () => set({ accessToken: null, user: null, isLoggedIn: false }),
      getUser: () => get().user,
    }),
    {
      name: 'hub-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isLoggedIn: state.isLoggedIn,
      }),
    },
  ),
);
