# Architecture

## Folder Conventions

```
src/
├── app/                    Next.js App Router — route tree
│   ├── layout.tsx          Root layout (Providers wrapper)
│   ├── providers.tsx       Client providers (StyledComponents > ReactQuery > Antd > StyledTheme > I18n)
│   ├── page.tsx            Redirect to /home
│   ├── not-found.tsx       404
│   ├── (auth)/             Auth route group — no layout
│   │   └── login/page.tsx
│   ├── (app)/              AppLayout group (header + footer)
│   │   ├── layout.tsx
│   │   ├── home/page.tsx
│   │   └── analytics/page.tsx
│   └── (dashboard)/        DashboardLayout group
│       ├── layout.tsx      → DashboardShell (auto-picks variant)
│       ├── dashboard/page.tsx
│       ├── dash-top/page.tsx
│       ├── dash-mixed/page.tsx
│       └── dash-mini/page.tsx
│
├── components/             Reusable UI shared across multiple pages
│   ├── layout/             App shell (AppLayout, DashboardLayout variants)
│   └── charts/             Chart widgets (BarChart, Area, Line, Pie)
│
├── hooks/                  Global hooks — shared across pages
│   ├── useFetchApi.ts
│   ├── useQueryFetch.ts
│   ├── useMutationSubmit.ts
│   ├── useDataPagination.ts
│   └── useI18n.ts
│
├── lib/                    Third-party config (axios, i18next, queryClient)
│
├── middleware.ts            Auth redirect (reads hub-auth-token cookie)
│
├── pages/                  Page-level components (all 'use client')
│   ├── HomePage.tsx                     ← simple page, no subfolder needed
│   └── users/                           ← feature with sub-components + hooks
│       ├── UsersPage.tsx
│       ├── components/                  ← components used ONLY in this feature
│       │   ├── UserTable.tsx
│       │   ├── UserForm.tsx
│       │   └── UserStatusBadge.tsx
│       └── hooks/                       ← hooks used ONLY in this feature
│           ├── useUsersMutator.ts       ← CRUD hook (GET + POST + PUT + DELETE)
│           └── useUserDetailData.ts     ← read-only hook (single resource)
│
├── providers/              SSR + client providers
├── stores/                 Zustand global state — one store per domain
├── styles/                 Global CSS + Ant Design theme tokens
├── types/                  Shared TypeScript interfaces
└── utils/                  Pure functions — no React dependency
```

### Rule: Where does a component/hook live?

| Scope | Location |
|-------|----------|
| Used in 2+ pages | `src/components/` or `src/hooks/` |
| Used in 1 page only | `src/pages/[feature]/components/` or `src/pages/[feature]/hooks/` |
| Global state (auth, theme, lang) | `src/stores/` |

### `'use client'` Rule

Any file that uses React hooks, Zustand stores, styled-components, or browser APIs must have `'use client'` at the top. Server Components (layout.tsx, page.tsx that only render) don't need it.

```tsx
// ✅ Client component — uses hooks
'use client';
import { useState } from 'react';
import styled from 'styled-components';

// ✅ Server component — just renders
// src/app/(app)/home/page.tsx
import HomePage from '@/pages/HomePage'; // HomePage has 'use client' internally
export default function Page() {
  return <HomePage />;
}
```

---

## useMutator Pattern

When a page has CRUD operations, group all API interactions into a single `use[Resource]Mutator` hook. This keeps the page component clean and co-locates all server-state logic.

A mutator hook can contain any combination of:
- `useDataPagination` — paginated GET list
- `useQueryFetch` — single resource GET
- `useMutationSubmit` — POST / PUT / PATCH / DELETE
- Local state related to the mutations (loading flags, modal open, etc.)

### Example: `src/pages/users/hooks/useUsersMutator.ts`

```ts
'use client';
import { useDataPagination, useMutationSubmit } from '@/hooks';
import { useToast } from '@/hooks';

interface UseUsersMutatorParams {
  editingId?: string | null;
  onSaveSuccess: () => void;
  onDeleteSuccess: () => void;
}

function useUsersMutator({ editingId, onSaveSuccess, onDeleteSuccess }: UseUsersMutatorParams) {
  const toast = useToast();

  // GET list (paginated + URL-synced filters)
  const {
    data, pagination, isLoading, isFetching,
    searchByQuery, statusByQuery, statusQuery,
    goToPage, refetch,
  } = useDataPagination({
    dataSourceUrl: '/users',
    generatedParamsKey: {
      search: ['search'],
      status: ['status'],
    },
  });

  // POST / PUT (create or update)
  const { mutate: saveUser, isPending: saving } = useMutationSubmit({
    url: editingId ? `/users/${editingId}` : '/users',
    method: editingId ? 'PUT' : 'POST',
    onSuccess: () => {
      toast.success(editingId ? 'User updated' : 'User created');
      refetch();
      onSaveSuccess();
    },
  });

  // DELETE
  const { mutate: deleteUser, isPending: deleting } = useMutationSubmit({
    url: '',               // URL overridden per-call
    method: 'DELETE',
    onSuccess: () => {
      toast.success('User deleted');
      refetch();
      onDeleteSuccess();
    },
  });

  // PATCH (status toggle, etc.)
  const { mutate: toggleStatus, isPending: toggling } = useMutationSubmit({
    url: '',
    method: 'PATCH',
    onSuccess: () => { toast.success('Status updated'); refetch(); },
  });

  return {
    // list
    data, pagination, isLoading, isFetching,
    searchByQuery, statusByQuery, statusQuery, goToPage, refetch,
    // mutations
    saveUser, saving,
    deleteUser, deleting,
    toggleStatus, toggling,
  };
}

export default useUsersMutator;
```

### Usage in page component

```tsx
// src/pages/users/UsersPage.tsx
'use client';
import useUsersMutator from './hooks/useUsersMutator';

const UsersPage = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    data, pagination, isLoading,
    searchByQuery, goToPage,
    saveUser, saving,
    deleteUser, deleting,
  } = useUsersMutator({
    editingId,
    onSaveSuccess: () => setModalOpen(false),
    onDeleteSuccess: () => {},
  });

  return (
    <>
      <Input.Search onSearch={searchByQuery} />
      <Table
        dataSource={data.map(r => r.attributes)}
        loading={isLoading}
        pagination={{ current: pagination?.page, total: pagination?.count, onChange: goToPage }}
      />
    </>
  );
};
```

```tsx
// src/app/(dashboard)/dashboard/users/page.tsx
import UsersPage from '@/pages/users/UsersPage';
export default function Page() {
  return <UsersPage />;
}
```

### Read-only hook (single resource)

```ts
// src/pages/users/hooks/useUserDetailData.ts
'use client';
import { useQueryFetch } from '@/hooks';

function useUserDetailData(id: string) {
  const { data, isLoading, refetch } = useQueryFetch({
    queryKey: ['user', id],
    url: `/users/${id}`,
  });

  const user = data?.data?.attributes ?? null;
  return { user, isLoading, refetch };
}

export default useUserDetailData;
```

---

## Naming Conventions

| Item | Pattern | Example |
|------|---------|---------|
| Components | PascalCase | `UserTable.tsx` |
| Hooks | `use` prefix camelCase | `useUsersMutator.ts` |
| CRUD hooks | `use[Resource]Mutator` | `useAddressMutator.ts` |
| Read-only hooks | `use[Resource]Data` | `useUserDetailData.ts` |
| Stores | `use[Domain]Store` | `useAuthStore.ts` |
| Types | PascalCase | `ApiResponse<T>` |
| Utils | camelCase | `fetchApi.ts` |
| Pages | PascalCase + `Page` | `UsersPage.tsx` |

---

## Import Alias

`@/` → `src/`. Use for all internal imports.

```ts
import { useAuthStore } from '@/stores';
import { useQueryFetch } from '@/hooks';
import type { ApiResponse } from '@/types/api';
```

---

## Data Flow

```
page.tsx (Server Component — thin shell)
  ↓
[Feature]Page.tsx (Client Component — 'use client')
  ↓
use[Resource]Mutator (page-local hook)
  ↓
useDataPagination / useQueryFetch / useMutationSubmit  (global hooks)
  ↓
useFetchApi                        (memoized options merger)
  ↓
fetchApi                           (core — FormData, error norm)
  ↓
axios (lib/axios.ts)               (auth header, 401 redirect)
  ↓
API
```

---

## State Layers

| Layer | Tool | Persisted |
|-------|------|-----------|
| Server cache | React Query | Memory |
| Auth | Zustand `useAuthStore` | localStorage |
| Theme | Zustand `useThemeStore` | localStorage |
| Language | Zustand `useLanguageStore` | localStorage |
| Forms | Ant Design Form | Component |
| Local UI | useState | Component |

---

## Auth Guard

Auth is handled at the **edge** via `src/middleware.ts` — no `PrivateRoute` component needed.

- Login → sets `hub-auth-token` cookie (`document.cookie = 'hub-auth-token=<token>; path=/'`)
- Middleware reads the cookie on every request
- Unauthenticated request → redirect `/login`
- Logged-in user on `/login` → redirect `/home`

```ts
// Logout
clearAuthData();
document.cookie = 'hub-auth-token=; path=/; max-age=0';
router.push('/login');
```

---

## Adding a New Feature

1. Create page component `src/pages/[feature]/[Feature]Page.tsx` (with `'use client'`)
2. Add `hooks/use[Feature]Mutator.ts` — CRUD logic
3. Add `components/` — sub-components used only in this feature
4. Create route: `src/app/(app)/[feature]/page.tsx` (or `(dashboard)/...`)
5. Global reusable components/hooks → promote to `src/components/` or `src/hooks/`
