# API Layer

## Stack

```
Component
  → useDataPagination / useQueryFetch / useMutationSubmit
  → useFetchApi
  → fetchApi (utils/fetchApi.ts)
  → axios (lib/axios.ts)
  → API Server
```

## `fetchApi` — Core

Low-level function. Handles: FormData auto-detection, param cleaning, error normalization.

```ts
import fetchApi from '@/utils/fetchApi';

fetchApi({
  url: '/users',
  method: 'GET',
  params: { page: 1, limit: 10 },
});

// POST with payload
fetchApi({
  url: '/users',
  method: 'POST',
  payload: { name: 'John', email: 'john@example.com' },
});

// File upload — auto converts to FormData
fetchApi({
  url: '/upload',
  method: 'POST',
  payload: { file: fileObject, name: 'avatar' },
});
```

**Error shape:**
```ts
interface FetchError {
  errorMessage: string;
  typeAlert: 'success' | 'error' | 'warning' | 'info';
  errors?: string[];
}
```

## `useQueryFetch` — GET + Caching

Wraps `useQuery` from React Query.

```ts
import { useQueryFetch } from '@/hooks';
import type { User } from '@/types/api';

// Basic GET
const { data, isLoading, error } = useQueryFetch<User[]>({
  queryKey: ['users'],
  url: '/users',
});

// With params
const { data } = useQueryFetch<User[]>({
  queryKey: ['users', 'list'],
  url: '/users',
  params: { page: 1, limit: 10, search: 'john' },
  staleTime: 60_000,
});

// Conditional fetch
const { data } = useQueryFetch<User>({
  queryKey: ['user', userId],
  url: `/users/${userId}`,
  enabled: Boolean(userId),
});

// Access response
data?.data       // actual payload (ApiResponse<T>.data)
data?.pagination // pagination meta if present
data?.message
```

## `useMutationSubmit` — POST/PUT/PATCH/DELETE

Wraps `useMutation` from React Query.

```ts
import { useMutationSubmit } from '@/hooks';
import { useToast } from '@/hooks';

const toast = useToast();

// POST
const { mutate, isPending } = useMutationSubmit({
  url: '/users',
  method: 'POST',
  onSuccess: () => {
    toast.success('User berhasil dibuat');
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
});

mutate({ name: 'John', email: 'john@example.com' });

// PUT
const { mutate: updateUser } = useMutationSubmit({
  url: `/users/${id}`,
  method: 'PUT',
});

updateUser({ name: 'Jane' });

// DELETE
const { mutate: deleteUser } = useMutationSubmit({
  url: `/users/${id}`,
  method: 'DELETE',
});
```

## `useDataPagination` — URL-synced Paginated List

For list pages with server-side pagination + filtering. Syncs all params to URL (browser back/forward works).

```ts
import { useDataPagination } from '@/hooks';

// Basic
const { data, isLoading, pagination, goToPage } = useDataPagination({
  dataSourceUrl: '/users',
});

// With auto-generated filter helpers
const {
  data, pagination, isLoading, isFetching,
  searchQuery, searchByQuery,   // generated from generatedParamsKey
  statusQuery, statusByQuery,
  isFiltered, resetParams,
  goToPage, setByQuery, refetch,
} = useDataPagination({
  dataSourceUrl: '/users',
  defaultParams: { page: 1, limit: 20 },
  generatedParamsKey: {
    search: ['search'],   // → searchQuery (current), searchByQuery(val) (setter)
    status: ['status'],   // → statusQuery, statusByQuery
  },
});
```

**Actions:**

| Method | Effect |
|--------|--------|
| `searchByQuery('john')` | `?search=john&page=1` |
| `statusByQuery('active')` | `?status=active&page=1` |
| `goToPage(3)` | `?page=3` |
| `goToPage(1, 50)` | change limit → reset to page 1 |
| `setByQuery({ type: 'admin' })` | set multiple params, reset page |
| `resetParams()` | restore `defaultParams` |
| `nextPage()` / `prevPage()` | navigate relative pages |

**Return values:**

| Key | Type | Description |
|-----|------|-------------|
| `data` | `ApiResource[]` | Array of `{ id, type, attributes }` |
| `pagination` | `ApiPagination` | `{ count, page, limit, last, from, to, prev, next }` |
| `isFiltered` | `boolean` | Any param differs from default |
| `paramsObj` | object | Current merged params |

**Ant Design Table:**
```tsx
<Table
  dataSource={data.map(r => r.attributes)}
  loading={isLoading}
  pagination={{
    current: pagination?.page,
    total: pagination?.count,
    pageSize: pagination?.limit,
    onChange: goToPage,
    showSizeChanger: true,
    onShowSizeChange: goToPage,
  }}
/>
```

**Multiple param names for one alias** (e.g. backend accepts both `search` and `q`):
```ts
generatedParamsKey: {
  search: ['search', 'q'],  // searchByQuery('x') sets both search=x and q=x
}
```

## Axios Instance (`lib/axios.ts`)

- Base URL: `VITE_API_URL`
- Auth: auto-injects `Bearer <token>` from `useAuthStore`
- 401: clears auth, redirects to `/login`
- Timeout: 30s

## API Response Types

```ts
// Standard response
interface ApiResponse<T = unknown> {
  success: boolean;
  code: number;
  message: string;
  alert: 'success' | 'error' | 'warning' | 'info';
  data: T;
  pagination?: ApiPagination;
  errors?: string[];
}

// Usage
const { data } = useQueryFetch<User[]>({ ... });
const users = data?.data;           // T
const total = data?.pagination?.count;
```

## Error Handling

Errors from `useMutationSubmit` are typed as `FetchError`:

```ts
const { mutate, error } = useMutationSubmit({ ... });

if (error) {
  console.log(error.errorMessage);  // human-readable message
  console.log(error.typeAlert);     // 'error' | 'warning' | ...
  console.log(error.errors);        // validation errors array
}
```

Custom error handler:
```ts
useMutationSubmit({
  url: '/users',
  onError: (err) => {
    // return false → suppress default error
    // return 'custom message' → override error message
  },
});
```
