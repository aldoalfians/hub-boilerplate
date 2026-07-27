# Styled Components + Charts

## Setup

`styled-components` v6 + `recharts` v2 — both theme-aware via `StyledThemeProvider`.

All files using styled-components must have `'use client'` at the top.

## SSR Setup

Next.js requires server-side style collection to prevent FOUC. This is handled by `StyledComponentsRegistry`:

```tsx
// src/providers/StyledComponentsRegistry.tsx
'use client';
// Uses useServerInsertedHTML + ServerStyleSheet to collect styles during SSR
// and inject them into <head> before hydration.
```

Also required in `next.config.ts`:
```ts
compiler: { styledComponents: true }
```

The registry must be the **outermost** wrapper in `src/app/providers.tsx`.

## How It Works

```
useThemeStore (mode: 'light' | 'dark')
  ↓
StyledThemeProvider (src/providers/)
  ↓ picks lightTokens | darkTokens
ThemeProvider (styled-components)
  ↓ theme prop injected
styled components access ${({ theme }) => theme.primary}
```

`StyledThemeProvider` is nested inside `AntdProvider` in `providers.tsx` — both switch simultaneously on dark mode toggle.

## Token Reference (`src/styles/tokens.ts`)

```ts
theme.primary         // brand blue
theme.primaryLight    // light tint of primary
theme.primaryGlow     // transparent primary for backgrounds
theme.primaryGradient // linear gradient string

theme.accent          // secondary accent color
theme.success / .warning / .danger / .info
theme.successLight / .warningLight / .dangerLight / .infoLight

theme.text            // main text color
theme.textSecondary
theme.textMuted

theme.bg              // page background
theme.bgCard          // card background
theme.border          // border color
theme.divider

theme.shadow / .shadowHover / .shadowCard

theme.radiusSm / .radiusMd / .radiusLg / .radiusXl

theme.chartColors     // ordered color palette for charts (7 colors)
```

## Using styled-components

```tsx
'use client';
import styled from 'styled-components';
import { Card } from 'antd';

// Basic element
const Box = styled.div`
  background: ${({ theme }) => theme.bgCard};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radiusLg};
  box-shadow: ${({ theme }) => theme.shadowCard};
`;

// Extend Ant Design component
const StyledCard = styled(Card)`
  border-radius: ${({ theme }) => theme.radiusLg} !important;
  border: 1px solid ${({ theme }) => theme.border} !important;

  .ant-card-body {
    padding: 20px !important;
  }
`;

// Custom props — use shouldForwardProp to prevent DOM leaking
const AlertBox = styled.div.withConfig({
  shouldForwardProp: (prop) => !['$type'].includes(prop),
})<{ $type: 'success' | 'error' | 'warning' }>`
  background: ${({ theme, $type }) => theme[$type + 'Light']};
  border-left: 4px solid ${({ theme, $type }) => theme[$type]};
  border-radius: ${({ theme }) => theme.radiusMd};
  padding: 12px 16px;
`;
```

> **Convention**: prefix custom props with `$` (e.g. `$type`, `$trend`) to distinguish from HTML attributes and prevent forwarding warnings.

## TypeScript

`src/styled.d.ts` extends `DefaultTheme` — full autocomplete on `theme.*`:

```ts
// This works automatically in all styled-components files:
const Box = styled.div`
  color: ${({ theme }) => theme.primary}; // ✓ typed
`;
```

## Charts (`src/components/charts/`)

All charts: read `theme.chartColors` and `theme.border` / `theme.textMuted` from `useTheme()`.
All chart files have `'use client'` at the top.

| Component | Use case |
|-----------|----------|
| `BarChartWidget` | Comparisons, categories |
| `AreaChartWidget` | Trends over time with fill |
| `LineChartWidget` | Multi-series trends |
| `PieChartWidget` | Proportions, donut charts |

### Common Props

```tsx
// All chart widgets share these props:
interface CommonChartProps {
  data: Record<string, unknown>[];
  dataKeys: string[];          // which keys to render
  xKey?: string;               // default: 'name'
  colors?: string[];           // override theme.chartColors
  height?: number;             // default: 300
  showLegend?: boolean;
  formatter?: (value: number, name: string) => string;
  showGrid?: boolean;
}
```

### Usage Examples

```tsx
'use client';
import { BarChartWidget, AreaChartWidget, LineChartWidget, PieChartWidget } from '@/components/charts';

// Bar chart
<BarChartWidget
  data={[{ name: 'Jan', sales: 4200 }, { name: 'Feb', sales: 5800 }]}
  dataKeys={['sales']}
  height={300}
  formatter={(val) => `$${val.toLocaleString()}`}
/>

// Area chart — multi-series
<AreaChartWidget
  data={monthlyData}
  dataKeys={['revenue', 'users']}
  showLegend
  smooth
/>

// Line chart
<LineChartWidget
  data={weeklyData}
  dataKeys={['visits', 'conversions']}
  showDots
  strokeWidth={2}
/>

// Donut chart
<PieChartWidget
  data={[{ name: 'A', value: 400 }, { name: 'B', value: 300 }]}
  innerRadius={55}
  outerRadius={100}
  formatter={(val) => `${val.toLocaleString()} units`}
/>

// Custom colors (overrides theme)
<BarChartWidget
  data={data}
  dataKeys={['revenue']}
  colors={['#FF6B35', '#004E89']}
/>
```

### Custom Tooltip

`ChartTooltip` — styled via theme tokens, used in all chart widgets automatically.
Override with custom `content` prop on the recharts component if needed.

## Demo Page

`/analytics` route — `src/pages/AnalyticsPage.tsx`:
- 4 stat cards with hover effect + trend indicator
- Area chart (revenue + users)
- Donut pie (category breakdown)
- Bar chart (monthly orders)
- Line chart (daily visits)
