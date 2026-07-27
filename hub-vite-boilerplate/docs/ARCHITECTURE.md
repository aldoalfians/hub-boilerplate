# Architecture

## Folder Conventions

```
src/
├── components/         Reusable UI shared across multiple pages
│   ├── layout/         App shell (AppLayout, DashboardLayout variants)
│   └── charts/         Chart widgets (BarChart, Area, Line, Pie)
│
├── hooks/              Global hooks — shared across pages
│   ├── useFetchApi.ts
│   ├── useQueryFetch.ts
│   ├── useMutationSubmit.ts
│   ├── useDataPagination.ts
│   └── useI18n.ts
│
├── lib/                Third-party config (axios, i18next)
│
├── pages/              One folder per feature / route group
│   ├── HomePage.tsx                     ← simple page, no subfolder needed
│   ├── LoginPage.tsx
│   └── users/                           ← feature with sub-components + hooks
│       ├── UsersPage.tsx
│       ├── UserDetailPage.tsx
│       ├── components/                  ← components used ONLY in this feature
│       │   ├── UserTable.tsx
│       │   ├── UserForm.tsx
│       │   └── UserStatusBadge.tsx
│       └── hooks/                       ← hooks used ONLY in this feature
│           ├── useUsersMutator.ts       ← CRUD hook (GET + POST + PUT + DELETE)
│           └── useUserDetailData.ts     ← read-only hook (single resource)
│
├── routes/             Route tree + guards
├── stores/             Zustand global state — one store per domain
├── styles/             Global CSS + Ant Design theme tokens
├── types/              Shared TypeScript interfaces
└── utils/              Pure functions — no React dependency
```

### Rule: Where does a component/hook live?

| Scope | Location |
|-------|----------|
| Used in 2+ pages | `src/components/` or `src/hooks/` |
| Used in 1 page only | `src/pages/[feature]/components/` or `src/pages/[feature]/hooks/` |
| Global state (auth, theme, lang) | `src/stores/` |

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

### Usage in page

```tsx
// src/pages/users/UsersPage.tsx
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

### Read-only hook (single resource)

For detail pages that only fetch, no mutations needed — use a plain `useQueryFetch` wrapper:

```ts
// src/pages/users/hooks/useUserDetailData.ts
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
Page Component
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

## Route Guards

- `PrivateRoute` — requires `isLoggedIn`, else redirects `/login`
- `PublicOnlyRoute` — for auth pages, redirects `/` if already logged in

---

## Adding a New Feature

1. Create folder `src/pages/[feature]/`
2. Add `[Feature]Page.tsx` — page component (thin, delegates to hooks)
3. Add `hooks/use[Feature]Mutator.ts` — CRUD logic
4. Add `components/` — any sub-components used only in this feature
5. Register route in `src/routes/index.tsx`
6. Global reusable components/hooks → promote to `src/components/` or `src/hooks/`
