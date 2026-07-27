# Theme System

## Overview

Uses Ant Design 6 `ConfigProvider` with dynamic `algorithm` for light/dark switching.
Theme mode persisted in `localStorage` via `useThemeStore`.

## Files

| File | Role |
|------|------|
| `src/styles/theme.ts` | Design tokens + `lightTheme` + `darkTheme` |
| `src/styles/global.css` | CSS reset, scrollbar, base transitions |
| `src/stores/useThemeStore.ts` | Mode state, toggle, persist |
| `src/providers/AntdProvider.tsx` | `ConfigProvider` — reads mode, applies theme + antd locale |
| `src/providers/StyledThemeProvider.tsx` | `ThemeProvider` — bridges useThemeStore → styled-components |

## How Dark Mode Works

```tsx
// src/providers/AntdProvider.tsx
'use client';
export default function AntdProvider({ children }) {
  const { mode } = useThemeStore();

  const themeConfig = mode === 'dark'
    ? { ...darkTheme, algorithm: antTheme.darkAlgorithm }
    : { ...lightTheme, algorithm: antTheme.defaultAlgorithm };

  return (
    <AntdRegistry>
      <ConfigProvider theme={themeConfig} locale={...}>
        {children}
      </ConfigProvider>
    </AntdRegistry>
  );
}
```

`useThemeStore.toggle()` flips mode → re-renders `AntdProvider` + `StyledThemeProvider` → new algorithm + new tokens applied simultaneously.

Also sets `data-theme` attribute on `<html>` for CSS-level dark mode.

## Toggling Theme

```tsx
'use client';
import { useThemeStore } from '@/stores';

const { mode, toggle, setMode } = useThemeStore();

// Toggle light ↔ dark
toggle();

// Set explicitly
setMode('dark');
setMode('light');
```

## Design Tokens (`src/styles/theme.ts`)

```ts
import { tokens, UI, colors } from '@/styles/theme';

// Brand colors
tokens.light.primary    // '#1A75FF'
tokens.dark.primary     // '#3B8FFF'

// Shadows
UI.shadow.sm
UI.shadow.md

// Border radius
UI.radius.sm   // '8px'
UI.radius.md   // '12px'
UI.radius.lg   // '16px'
```

## Customizing Theme

Edit `lightTheme` / `darkTheme` in `src/styles/theme.ts`:

```ts
export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: '#your-brand-color',
    borderRadius: 12,
    fontFamily: "'Your Font', sans-serif",
  },
  components: {
    Button: { borderRadius: 10, controlHeight: 40 },
  },
};
```

## Available Algorithms

| Algorithm | Import |
|-----------|--------|
| Default (light) | `antTheme.defaultAlgorithm` |
| Dark | `antTheme.darkAlgorithm` |
| Compact | `antTheme.compactAlgorithm` |

Combine algorithms:
```ts
algorithm: [antTheme.darkAlgorithm, antTheme.compactAlgorithm]
```

## CSS Dark Mode

`data-theme` attribute set on `<html>` — use in CSS:

```css
[data-theme='dark'] .my-component {
  background: #1e293b;
}
```

## SSR Note

`StyledComponentsRegistry` (`src/providers/StyledComponentsRegistry.tsx`) collects styled-components styles during SSR and injects them into `<head>` via `useServerInsertedHTML` before hydration. This prevents FOUC (Flash of Unstyled Content).

Also required in `next.config.ts`:
```ts
compiler: { styledComponents: true }
```
