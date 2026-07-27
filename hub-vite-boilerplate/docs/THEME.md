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
| `src/main.tsx` | `ThemedApp` — reads mode, passes to `ConfigProvider` |

## How Dark Mode Works

```tsx
// main.tsx
const ThemedApp = () => {
  const { mode } = useThemeStore();
  const isDark = mode === 'dark';

  return (
    <ConfigProvider
      theme={{
        ...(isDark ? darkTheme : lightTheme),
        algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
      }}
    >
      ...
    </ConfigProvider>
  );
};
```

`useThemeStore.toggle()` flips mode → re-renders `ThemedApp` → new algorithm applied.
Also sets `data-theme` attribute on `<html>` for CSS-level dark mode.

## Toggling Theme

```tsx
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
    // ... other tokens
  },
  components: {
    Button: { borderRadius: 10, controlHeight: 40 },
    // ... per-component overrides
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
