# Zustand Stores

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

**Login flow:**
```ts
const { setAuthData } = useAuthStore();

// After successful login API call:
setAuthData(response.accessToken, response.user);
```

**Logout:**
```ts
const { clearAuthData } = useAuthStore();
clearAuthData();
navigate('/login');
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
const { mode, toggle } = useThemeStore();

<Button onClick={toggle}>
  {mode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
</Button>
```

## Adding a New Store

```ts
// src/stores/useCounterStore.ts
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
