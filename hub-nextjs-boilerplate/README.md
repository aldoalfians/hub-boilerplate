# Hub Next.js Boilerplate

Production-ready Next.js 15 App Router boilerplate — same stack as `hub-vite-boilerplate` but with SSR.

## Stack

| Tech | Version | Role |
|------|---------|------|
| Next.js | ^15 | Framework — App Router, SSR |
| React | ^19 | UI |
| TypeScript | ^5 | Type safety |
| React Query | ^5 | Server state + caching |
| Zustand | ^5 | Client state (auth, theme, lang) |
| Axios | ^1 | HTTP client |
| Ant Design | ^6 | UI components |
| @ant-design/nextjs-registry | ^1 | Ant Design SSR support |
| @ant-design/icons | ^6 | Icon set |
| styled-components | ^6 | CSS-in-JS — SSR via StyledComponentsRegistry |
| recharts | ^2 | Charts (bar, area, line, pie) |
| i18next | ^25 | i18n engine |
| react-i18next | ^15 | React bindings |
| i18next-http-backend | ^3 | Lazy-load locale JSON |

## Quick Start

```bash
pnpm install
cp .env.example .env.local
pnpm dev        # → http://localhost:3000
pnpm type-check
pnpm build
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              Root layout — Providers
│   ├── providers.tsx           Client providers (StyledComponents > ReactQuery > Antd > StyledTheme > I18n)
│   ├── page.tsx                Redirect to /home
│   ├── not-found.tsx           404 page
│   ├── (auth)/
│   │   └── login/page.tsx      Login page (no layout)
│   ├── (app)/                  AppLayout group (header + footer)
│   │   ├── layout.tsx
│   │   ├── home/page.tsx
│   │   └── analytics/page.tsx
│   └── (dashboard)/            DashboardLayout group (sider variants)
│       ├── layout.tsx          → DashboardShell (auto-picks variant from pathname)
│       ├── dashboard/page.tsx  → classic variant
│       ├── dash-top/page.tsx   → top-sider variant
│       ├── dash-mixed/page.tsx → mixed variant
│       └── dash-mini/page.tsx  → mini variant
│
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx                  Header nav + footer (public pages)
│   │   └── dashboard/
│   │       ├── DashboardLayout.tsx        4-variant dashboard wrapper
│   │       ├── DashboardShell.tsx         Variant auto-picker from pathname
│   │       ├── DashboardMenu.tsx          Antd Menu with active-state logic
│   │       ├── useMenuState.ts            Selected/open keys from usePathname
│   │       └── types.ts                   DashboardLayoutProps, NavMenuItem
│   └── charts/
│       ├── BarChartWidget.tsx    Bar chart — theme-aware colors
│       ├── AreaChartWidget.tsx   Area/gradient chart
│       ├── LineChartWidget.tsx   Line chart
│       ├── PieChartWidget.tsx    Pie / donut chart
│       └── ChartTooltip.tsx      Shared styled tooltip
│
├── hooks/
│   ├── useFetchApi.ts            Memoized fetch wrapper (base)
│   ├── useQueryFetch.ts          GET + React Query useQuery
│   ├── useMutationSubmit.ts      POST/PUT/PATCH/DELETE + useMutation
│   ├── useDataPagination.ts      URL-synced paginated list (uses next/navigation)
│   ├── useToast.tsx              Ant Design notification helper
│   ├── useI18n.ts                i18n hook (t, lang, setLang)
│   └── index.ts
│
├── lib/
│   ├── axios.ts                  Axios instance + auth header + 401 interceptor
│   ├── i18n.ts                   i18next init (backend, namespaces, fallback)
│   └── queryClient.ts            Singleton browser client / new per server request
│
├── middleware.ts                 Auth redirect (reads hub-auth-token cookie)
│
├── pages/
│   ├── HomePage.tsx                       Simple page (no subfolder needed)
│   ├── AnalyticsPage.tsx
│   └── [feature]/                         Feature with sub-components/hooks
│       ├── FeaturePage.tsx
│       ├── components/                    Components used ONLY in this feature
│       │   └── FeatureTable.tsx
│       └── hooks/
│           ├── useFeatureMutator.ts       CRUD hook (GET + POST + PUT + DELETE)
│           └── useFeatureDetailData.ts    Read-only single-resource hook
│
├── providers/
│   ├── StyledComponentsRegistry.tsx  SSR styles via useServerInsertedHTML
│   ├── AntdProvider.tsx              AntdRegistry + ConfigProvider
│   ├── StyledThemeProvider.tsx       ThemeProvider (light/dark tokens)
│   ├── ReactQueryProvider.tsx        QueryClientProvider
│   └── I18nProvider.tsx             I18nextProvider + lang sync
│
├── stores/
│   ├── useAuthStore.ts           Auth (user, token, persist localStorage)
│   ├── useThemeStore.ts          Theme mode (light/dark, persist)
│   ├── useLanguageStore.ts       Language (id/en, persist, sync i18next)
│   └── index.ts
│
├── styles/
│   ├── theme.ts                  Ant Design lightTheme + darkTheme config
│   ├── tokens.ts                 styled-components tokens (lightTokens, darkTokens)
│   └── global.css                CSS reset + scrollbar + transitions
│
├── types/
│   └── api.ts                    ApiResponse, AuthUser, PaginationParams, FetchError
│
├── utils/
│   └── fetchApi.ts               Core HTTP function (FormData auto-detect, error norm)
│
└── styled.d.ts                   Extends styled-components DefaultTheme → full autocomplete

public/
└── locales/
    ├── id/
    │   └── common.json           Indonesian translations
    └── en/
        └── common.json           English translations

docs/
├── ARCHITECTURE.md               Folder conventions, 'use client' rules, useMutator pattern
├── THEME.md                      Dark mode, AntdProvider, SSR styled-components
├── API.md                        fetchApi, useQueryFetch, useMutationSubmit usage
├── STORES.md                     Auth store, cookie logout, SSR note
├── I18N.md                       i18next setup, useI18n hook, adding langs
├── STYLED.md                     styled-components SSR, tokens, chart components
└── LAYOUTS.md                    AppLayout, DashboardLayout variants, DashboardShell
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=Hub App
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## Key Patterns

### `'use client'` Rule

Any file using React hooks, Zustand stores, styled-components, or browser APIs must have `'use client'` at the top. Page files (`app/**/page.tsx`) that only render a client component don't need it.

```tsx
// ✅ page.tsx — Server Component, thin shell
import UsersPage from '@/pages/users/UsersPage';
export default function Page() {
  return <UsersPage />;
}

// ✅ UsersPage.tsx — Client Component
'use client';
import { useState } from 'react';
import styled from 'styled-components';
```

### Fetching Data

```tsx
'use client';
import { useQueryFetch, useMutationSubmit } from '@/hooks';

// GET
const { data, isLoading } = useQueryFetch<User[]>({
  queryKey: ['users'],
  url: '/users',
  params: { page: 1, limit: 10 },
});

// POST
const { mutate, isPending } = useMutationSubmit({
  url: '/users',
  method: 'POST',
  onSuccess: () => toast.success('Berhasil'),
});
mutate({ name: 'John', email: 'john@example.com' });
```

### Paginated Data + URL-synced Filters

```tsx
'use client';
import { useDataPagination } from '@/hooks';

const {
  data, pagination, isLoading, isFetching,
  searchQuery, searchByQuery,   // ← auto-generated
  statusQuery, statusByQuery,   // ← auto-generated
  isFiltered, resetParams,
  goToPage, setByQuery, refetch,
} = useDataPagination({
  dataSourceUrl: '/users',
  defaultParams: { page: 1, limit: 20 },
  generatedParamsKey: {
    search: ['search'],    // searchQuery + searchByQuery
    status: ['status'],    // statusQuery + statusByQuery
  },
});

searchByQuery('john')           // → URL: ?search=john&page=1
statusByQuery('active')         // → URL: ?status=active&page=1
goToPage(3)                     // → URL: ?page=3
goToPage(1, 50)                 // → change limit to 50, reset to page 1
setByQuery({ type: 'admin' })   // → set multiple params at once
resetParams()                   // → reset to defaultParams

// Ant Design Table integration
<Table
  dataSource={data.map(r => r.attributes)}
  loading={isLoading}
  pagination={{
    current: pagination?.page,
    total: pagination?.count,
    pageSize: pagination?.limit,
    onChange: goToPage,
  }}
/>
```

### useMutator — CRUD Hook Pattern

When a page has CRUD, group all API logic in `src/pages/[feature]/hooks/use[Resource]Mutator.ts`.

```ts
// src/pages/users/hooks/useUsersMutator.ts
'use client';
import { useDataPagination, useMutationSubmit, useToast } from '@/hooks';

function useUsersMutator({ editingId, onSaveSuccess }: { editingId?: string | null; onSaveSuccess: () => void }) {
  const toast = useToast();

  const { data, pagination, isLoading, searchByQuery, goToPage, refetch } = useDataPagination({
    dataSourceUrl: '/users',
    generatedParamsKey: { search: ['search'], status: ['status'] },
  });

  const { mutate: saveUser, isPending: saving } = useMutationSubmit({
    url: editingId ? `/users/${editingId}` : '/users',
    method: editingId ? 'PUT' : 'POST',
    onSuccess: () => { toast.success('Saved'); refetch(); onSaveSuccess(); },
  });

  const { mutate: deleteUser, isPending: deleting } = useMutationSubmit({
    url: '',
    method: 'DELETE',
    onSuccess: () => { toast.success('Deleted'); refetch(); },
  });

  return { data, pagination, isLoading, searchByQuery, goToPage, saveUser, saving, deleteUser, deleting };
}
```

**Scope rules:**
- Component used in 1 page → `src/pages/[feature]/components/`
- Hook used in 1 page → `src/pages/[feature]/hooks/`
- Used in 2+ pages → promote to `src/components/` or `src/hooks/`

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for full pattern with examples.

### Toast Notifications

```tsx
'use client';
import { useToast } from '@/hooks';

const toast = useToast();
toast.success('Saved!');
toast.error('Something went wrong');
toast.warning('Check your input');
toast.info('FYI');
```

### Translation

```tsx
'use client';
import { useI18n } from '@/hooks';

const { t, lang, setLang } = useI18n();

t('common.save')                               // → 'Simpan' | 'Save'
t('validation.required', { field: 'Email' })   // → 'Email wajib diisi'
setLang('en')                                  // switch language + persist
```

### Styled Components + Ant Design

```tsx
'use client';
import styled from 'styled-components';
import { Card } from 'antd';

// Extend antd component with theme tokens
const StyledCard = styled(Card)`
  border-radius: ${({ theme }) => theme.radiusLg} !important;
  border: 1px solid ${({ theme }) => theme.border} !important;
  box-shadow: ${({ theme }) => theme.shadowCard} !important;
`;

// Custom props — prefix $ to prevent DOM forwarding
const Badge = styled.span.withConfig({
  shouldForwardProp: (prop) => !['$status'].includes(prop),
})<{ $status: 'active' | 'inactive' }>`
  color: ${({ theme, $status }) =>
    $status === 'active' ? theme.success : theme.textMuted};
`;
```

### Charts

```tsx
'use client';
import { BarChartWidget, AreaChartWidget, LineChartWidget, PieChartWidget } from '@/components/charts';

// Auto picks colors from theme — switches with dark mode
<AreaChartWidget
  data={monthlyData}
  dataKeys={['revenue', 'users']}
  height={300}
  showLegend
  formatter={(val, name) => name === 'revenue' ? `$${val}` : String(val)}
/>

// Donut chart
<PieChartWidget
  data={categoryData}
  innerRadius={55}
  outerRadius={100}
/>

// Override colors
<BarChartWidget
  data={data}
  dataKeys={['value']}
  colors={['#FF6B35', '#004E89']}
/>
```

### Dashboard Layout

4 variants, all collapsible, mobile-responsive, active-state auto-detected from pathname. Variant is auto-picked by `DashboardShell` based on URL prefix — no configuration needed per route.

```
/dashboard   → classic   (dark sider, no header — actions in sider bottom)
/dash-top    → top-sider (header with logo, light sider below)
/dash-mixed  → mixed     (light sider with logo, header with actions only)
/dash-mini   → mini      (64px icon-only dark sider, header with logo)
```

Custom menu + sider width:

```tsx
'use client';
import { DashboardLayout } from '@/components';

const myMenu = [
  { key: 'home', label: 'Home', icon: <HomeOutlined />, path: '/' },
  {
    key: 'mgmt',
    label: 'Management',
    icon: <AppstoreOutlined />,
    children: [
      { key: 'users', label: 'Users', path: '/dashboard/users' },
      { key: 'roles', label: 'Roles', path: '/dashboard/roles' },
    ],
  },
];

<DashboardLayout variant="classic" menuItems={myMenu} siderWidth={260} />
```

| Variant | Sider | Header | Logo location |
|---------|-------|--------|---------------|
| `classic` | Dark | No | Sider top |
| `top-sider` | Light | Yes | Header |
| `mixed` | Light | Yes | Sider top |
| `mini` | Dark 64px | Yes | Header |

See [docs/LAYOUTS.md](docs/LAYOUTS.md) for full reference.

### Dark Mode

```tsx
'use client';
import { useThemeStore } from '@/stores';

const { mode, toggle, setMode } = useThemeStore();
toggle();        // light ↔ dark
setMode('dark'); // explicit
```

## SSR: styled-components

Next.js requires style injection during SSR to prevent FOUC.

`StyledComponentsRegistry` wraps the app and uses `useServerInsertedHTML` to collect
styled-components styles on the server and inject them into `<head>` before hydration.

Also required in `next.config.ts`:
```ts
compiler: { styledComponents: true }
```

The registry must be the **outermost** wrapper, before any styled-components are rendered.

## Auth Flow

- Login sets `hub-auth-token` cookie (client-side) + Zustand store
- `middleware.ts` reads that cookie on every request (edge runtime)
- Unauthenticated → redirect `/login`
- Logged-in on auth page → redirect `/home`
- Logout clears both Zustand store and cookie

For production: set the cookie server-side (HttpOnly) from your API login response.

## Docs

| Doc | Content |
|-----|---------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Folder conventions, `'use client'` rules, useMutator pattern, data flow |
| [THEME.md](docs/THEME.md) | Dark mode, AntdProvider, styled-components SSR, customization |
| [API.md](docs/API.md) | `fetchApi`, `useQueryFetch`, `useMutationSubmit`, error handling |
| [STORES.md](docs/STORES.md) | Auth store, cookie logout, SSR note, adding stores |
| [I18N.md](docs/I18N.md) | i18next setup, `useI18n` hook, namespaces, adding languages |
| [STYLED.md](docs/STYLED.md) | SSR setup, tokens, antd extension pattern, chart components |
| [LAYOUTS.md](docs/LAYOUTS.md) | AppLayout, DashboardLayout 4 variants, DashboardShell, scroll behavior |

## vs hub-vite-boilerplate

| Feature | Vite | Next.js |
|---------|------|---------|
| Routing | React Router v7 | App Router (file-based) |
| SSR | No | Yes |
| styled-components SSR | N/A | StyledComponentsRegistry |
| Auth guard | PrivateRoute component | middleware.ts (edge) |
| `useNavigate` | react-router-dom | `useRouter` from next/navigation |
| `useLocation` | react-router-dom | `usePathname` from next/navigation |
| `useSearchParams` | react-router-dom | `useSearchParams` from next/navigation |
| Env prefix | `VITE_` | `NEXT_PUBLIC_` |
| Entry point | `src/main.tsx` | `src/app/layout.tsx` |
| antd locale | `main.tsx` ConfigProvider | `AntdProvider.tsx` |
| Bundle | Vite | Next.js (Turbopack in dev) |
| `'use client'` | Not needed | Required on hook-using files |
