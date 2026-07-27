# Hub Vite Boilerplate

Production-ready React boilerplate — Vite + TypeScript + React Query + Zustand + Axios + Ant Design 6 + i18n + styled-components + Recharts.

## Stack

| Tech | Version | Role |
|------|---------|------|
| Vite | ^6 | Build tool + HMR |
| React | ^19 | UI framework |
| TypeScript | ^5 | Type safety |
| React Query | ^5 | Server state + caching |
| Zustand | ^5 | Client state (auth, theme, lang) |
| Axios | ^1 | HTTP client |
| Ant Design | ^6 | UI components |
| @ant-design/icons | ^6 | Icon set |
| styled-components | ^6 | CSS-in-JS, extend antd components |
| recharts | ^2 | Charts (bar, area, line, pie) |
| i18next | ^25 | i18n engine |
| react-i18next | ^15 | React bindings for i18next |
| i18next-http-backend | ^3 | Lazy-load locale JSON files |
| React Router | ^7 | Routing |

## Quick Start

```bash
# Install dependencies
pnpm install   # or npm install

# Copy env file
cp .env.example .env

# Start dev server
pnpm dev

# Type check
pnpm type-check

# Build
pnpm build
```

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx                  Header nav + Footer (public pages)
│   │   └── dashboard/
│   │       ├── DashboardLayout.tsx        4-variant dashboard wrapper
│   │       ├── DashboardMenu.tsx          Antd Menu with active-state logic
│   │       ├── useMenuState.ts            Selected/open keys from pathname
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
│   ├── useDataPagination.ts      URL-synced paginated list + filter helpers
│   ├── useToast.tsx              Ant Design notification helper
│   ├── useI18n.ts                i18n hook (t, lang, setLang)
│   └── index.ts
│
├── lib/
│   ├── axios.ts                  Axios instance + auth header + 401 interceptor
│   └── i18n.ts                   i18next init (backend, namespaces, fallback)
│
├── pages/
│   ├── HomePage.tsx                       Simple page (no subfolder needed)
│   ├── LoginPage.tsx
│   ├── AnalyticsPage.tsx
│   ├── NotFoundPage.tsx
│   └── [feature]/                         Feature with sub-components/hooks
│       ├── FeaturePage.tsx
│       ├── components/                    Components used ONLY in this feature
│       │   └── FeatureTable.tsx
│       └── hooks/
│           ├── useFeatureMutator.ts       CRUD hook (GET + POST + PUT + DELETE)
│           └── useFeatureDetailData.ts    Read-only single-resource hook
│
├── providers/
│   └── StyledThemeProvider.tsx   Bridges useThemeStore → styled-components ThemeProvider
│
├── routes/
│   └── index.tsx                 Routes + PrivateRoute + PublicOnlyRoute
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
├── ARCHITECTURE.md               Folder conventions, data flow, state layers
├── THEME.md                      Dark mode, Ant Design tokens, CSS data-theme
├── API.md                        fetchApi, useQueryFetch, useMutationSubmit usage
├── STORES.md                     Auth store, theme store, language store, patterns
├── I18N.md                       i18next setup, useI18n hook, namespaces, adding langs
├── STYLED.md                     styled-components + recharts, tokens, chart usage
└── LAYOUTS.md                    AppLayout, DashboardLayout variants, menu system
```

## Environment Variables

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Hub App
VITE_APP_VERSION=1.0.0
```

## Key Patterns

### Fetching Data

```tsx
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
import { useDataPagination } from '@/hooks';

// Basic
const { data, isLoading, pagination, goToPage } = useDataPagination({
  dataSourceUrl: '/users',
});

// With search + filter helpers (auto-generated from generatedParamsKey)
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
isFiltered                      // → true if any param differs from default

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
import { useDataPagination, useMutationSubmit, useToast } from '@/hooks';

function useUsersMutator({ editingId, onSaveSuccess }: { editingId?: string | null; onSaveSuccess: () => void }) {
  const toast = useToast();

  // GET list — paginated + URL-synced filters
  const { data, pagination, isLoading, searchByQuery, goToPage, refetch } = useDataPagination({
    dataSourceUrl: '/users',
    generatedParamsKey: { search: ['search'], status: ['status'] },
  });

  // POST or PUT (create / edit)
  const { mutate: saveUser, isPending: saving } = useMutationSubmit({
    url: editingId ? `/users/${editingId}` : '/users',
    method: editingId ? 'PUT' : 'POST',
    onSuccess: () => { toast.success('Saved'); refetch(); onSaveSuccess(); },
  });

  // DELETE
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
import { useToast } from '@/hooks';

const toast = useToast();
toast.success('Saved!');
toast.error('Something went wrong');
toast.warning('Check your input');
toast.info('FYI');

// Outside React (axios interceptors, etc.)
import toast from '@/hooks';
toast.error('Session expired');
```

### Translation

```tsx
import { useI18n } from '@/hooks';

const { t, lang, setLang } = useI18n();

t('common.save')                               // → 'Simpan' | 'Save'
t('validation.required', { field: 'Email' })   // → 'Email wajib diisi'
setLang('en')                                  // switch language + persist
```

### Styled Components + Ant Design

```tsx
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

4 variants, all collapsible, mobile-responsive, active-state auto-detected from pathname.

```tsx
import { DashboardLayout } from '@/components';

// classic — dark sider, no header (actions in sider bottom)
<Route element={<PrivateRoute><DashboardLayout variant="classic" /></PrivateRoute>}>
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/dashboard/users" element={<UsersPage />} />
</Route>

// top-sider — header with logo, light sider below
<Route element={<PrivateRoute><DashboardLayout variant="top-sider" /></PrivateRoute>}>
  <Route path="/dash-top" element={<DashboardPage />} />
</Route>

// mixed — light sider with logo, header with actions only
<Route element={<PrivateRoute><DashboardLayout variant="mixed" /></PrivateRoute>}>
  <Route path="/dash-mixed" element={<DashboardPage />} />
</Route>

// mini — 64px icon-only dark sider, header with logo
<Route element={<PrivateRoute><DashboardLayout variant="mini" /></PrivateRoute>}>
  <Route path="/dash-mini" element={<DashboardPage />} />
</Route>
```

Custom menu + sider width:

```tsx
import { DashboardLayout, DEFAULT_MENU_ITEMS } from '@/components';

const myMenu = [
  { key: 'home', label: 'Home', icon: <HomeOutlined />, path: '/' },
  {
    key: 'mgmt',
    label: 'Management',
    icon: <AppstoreOutlined />,
    children: [
      { key: 'users', label: 'Users', path: '/users' },
      { key: 'roles', label: 'Roles', path: '/roles' },
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
import { useThemeStore } from '@/stores';

const { mode, toggle, setMode } = useThemeStore();
toggle();        // light ↔ dark
setMode('dark'); // explicit
```

## Docs

| Doc | Content |
|-----|---------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Folder conventions, naming, data flow, state layers, route guards |
| [THEME.md](docs/THEME.md) | Dark mode mechanism, Ant Design tokens, CSS `data-theme`, customization |
| [API.md](docs/API.md) | `fetchApi`, `useQueryFetch`, `useMutationSubmit`, error handling |
| [STORES.md](docs/STORES.md) | Auth store, theme store, language store, adding new stores, persistence |
| [I18N.md](docs/I18N.md) | i18next setup, `useI18n` hook, namespaces, adding languages |
| [STYLED.md](docs/STYLED.md) | styled-components tokens, antd extension pattern, chart components |
| [LAYOUTS.md](docs/LAYOUTS.md) | AppLayout, DashboardLayout 4 variants, props, menu system, scroll behavior |
