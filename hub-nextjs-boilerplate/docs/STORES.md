# Zustand Stores

All stores are in `src/stores/` and have `'use client'` at the top. They are used only inside Client Components.

## Auth Store (`useAuthStore`)

Manages authentication state. Persisted to `localStorage` key `hub-auth`.

```ts
import { useAuthStore } from '@/stores';

const {
  user,        // AuthUser | null
  accessToken, // string | null
  isLoggedIn,  // boolean

  setAuthData,   // (token, user) => void
  setAccessToken,// (token) => void
  setUser,       // (user) => void
  clearAuthData, // () => void — call on logout
  getUser,       // () => AuthUser | null — for use outside React
} = useAuthStore();
```

**Login flow (Next.js):**
```ts
const { setAuthData } = useAuthStore();

// After successful login API call:
setAuthData(response.accessToken, response.user);

// Also set the cookie so middleware can protect routes:
document.cookie = `hub-auth-token=${response.accessToken}; path=/`;
```

**Logout:**
```ts
const { clearAuthData } = useAuthStore();
const router = useRouter();

clearAuthData();
document.cookie = 'hub-auth-token=; path=/; max-age=0'; // clear middleware cookie
router.push('/login');
```

**Outside React (e.g. axios interceptor):**
```ts
import { useAuthStore } from '@/stores';

const token = useAuthStore.getState().accessToken;
useAuthStore.getState().clearAuthData();
```

## Theme Store (`useThemeStore`)

Manages light/dark mode. Persisted to `localStorage` key `hub-theme`.
Also sets `data-theme` attribute on `<html>` for CSS.

```ts
import { useThemeStore } from '@/stores';

const {
  mode,    // 'light' | 'dark'
  toggle,  // () => void — flip mode
  setMode, // (mode) => void — set explicitly
} = useThemeStore();
```

**Toggle button:**
```tsx
'use client';
const { mode, toggle } = useThemeStore();

<Button onClick={toggle}>
  {mode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
</Button>
```

## Language Store (`useLanguageStore`)

Manages active language. Persisted to `localStorage` key `hub-lang`.
Setting lang also calls `i18n.changeLanguage()`.

```ts
import { useLanguageStore } from '@/stores';

const {
  lang,    // 'id' | 'en'
  setLang, // (lang) => void
} = useLanguageStore();
```

Prefer using `useI18n()` which wraps both `t()` + `lang` + `setLang` in one hook.

## Adding a New Store

```ts
// src/stores/useCounterStore.ts
'use client';
import { create } from 'zustand';

interface CounterState {
  count: number;
  increment: () => void;
  reset: () => void;
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
  reset: () => set({ count: 0 }),
}));
```

Export from `src/stores/index.ts`:
```ts
export { useCounterStore } from './useCounterStore';
```

## Adding Persistence

```ts
'use client';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useMyStore = create<MyState>()(
  persist(
    (set) => ({
      // state & actions
    }),
    {
      name: 'hub-my-store',      // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // only persist these fields:
        field1: state.field1,
      }),
    },
  ),
);
```

## SSR Note

Zustand stores with `persist` use `localStorage` which is not available on the server. The `persist` middleware handles this gracefully — it skips hydration on the server and rehydrates on the client. To avoid hydration mismatches, use stores only inside Client Components (`'use client'`).
