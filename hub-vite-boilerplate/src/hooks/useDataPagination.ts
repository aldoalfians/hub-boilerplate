import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useQueryFetch from './useQueryFetch';
import type { ApiResponse, ApiResource, ApiPagination } from '@/types/api';

type GeneratedParamsMap = Record<string, string | string[]>;

interface UseDataPaginationOptions {
  /** API endpoint URL */
  dataSourceUrl: string;
  /** Default query params — merged with URL params on mount */
  defaultParams?: Record<string, unknown>;
  /** Transform / handle successful response */
  onFetchSuccess?: (data: ApiResponse) => unknown;
  /** Handle fetch error */
  onFetchError?: (err: unknown) => unknown;
  /**
   * Auto-generate `{key}Query` (current value) + `{key}ByQuery` (setter) helpers.
   * Value is a param name or array of param names that map to the same query key.
   *
   * @example
   * generatedParamsKey: {
   *   search: ['search', 'q'],  // searchQuery, searchByQuery
   *   status: ['status'],       // statusQuery, statusByQuery
   * }
   */
  generatedParamsKey?: GeneratedParamsMap;
  /** URL params to exclude from being merged into fetch params */
  excludeUrlParams?: string[];
  /** Disable fetch. Default: true */
  enabled?: boolean;
}

const DEFAULT_GENERATED_PARAMS: GeneratedParamsMap = {
  search: ['search', 'q'],
};

/**
 * URL-synced paginated data fetcher with auto-generated filter helpers.
 *
 * - Reads/writes page state to URL search params (browser back/forward works)
 * - Auto-generates `{key}Query` + `{key}ByQuery` for each generatedParamsKey entry
 * - Resets page to 1 on filter change
 *
 * @example
 * // Basic
 * const { data, isLoading, pagination, goToPage } = useDataPagination({
 *   dataSourceUrl: '/users',
 * });
 *
 * // With search + filter helpers
 * const {
 *   data, pagination, isLoading,
 *   searchQuery, searchByQuery,
 *   statusQuery, statusByQuery,
 *   isFiltered, resetParams, goToPage,
 * } = useDataPagination({
 *   dataSourceUrl: '/users',
 *   defaultParams: { page: 1, limit: 20 },
 *   generatedParamsKey: {
 *     search: ['search'],
 *     status: ['status'],
 *   },
 * });
 *
 * searchByQuery('john')   // → URL: ?search=john&page=1
 * statusByQuery('active') // → URL: ?status=active&page=1
 * goToPage(3)             // → URL: ?page=3
 * resetParams()           // → resets to defaultParams
 */
function useDataPagination({
  dataSourceUrl,
  defaultParams = { page: 1, limit: 20 },
  onFetchSuccess,
  onFetchError,
  generatedParamsKey: customGenerated,
  excludeUrlParams = [],
  enabled = true,
}: UseDataPaginationOptions) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Merge URL params with defaults (excluding specified keys)
  const paramsObj = useMemo(() => {
    const obj: Record<string, unknown> = { ...defaultParams };
    searchParams.forEach((value, key) => {
      if (!excludeUrlParams.includes(key)) obj[key] = value;
    });
    return obj;
  }, [searchParams, defaultParams, excludeUrlParams]);

  // Write cleaned params to URL
  const updateSearchParams = useCallback(
    (nextParams: Record<string, unknown>) => {
      const cleaned = Object.entries(nextParams).reduce<Record<string, string>>(
        (acc, [k, v]) => {
          if (v !== undefined && v !== null && v !== '' && String(v) !== 'undefined') {
            acc[k] = String(v);
          }
          return acc;
        },
        {},
      );
      setSearchParams(cleaned, { replace: true });
    },
    [setSearchParams],
  );

  // Merge + clean params (strip empties, apply excludeKeys)
  const validateNextParams = useCallback(
    (nextParams: Record<string, unknown> = {}, excludeKeys: string[] = []) => {
      return Object.entries({ ...paramsObj, ...nextParams }).reduce<Record<string, unknown>>(
        (acc, [k, v]) => {
          if (v !== null && v !== undefined && v !== '' && !excludeKeys.includes(k)) {
            acc[k] = v;
          }
          return acc;
        },
        {},
      );
    },
    [paramsObj],
  );

  // Fetch
  const query = useQueryFetch<ApiResource[]>({
    queryKey: [dataSourceUrl],
    url: dataSourceUrl,
    params: paramsObj,
    enabled: Boolean(dataSourceUrl) && enabled,
    queryOptions: {
      select: (res) => {
        if (onFetchSuccess) onFetchSuccess(res);
        return res;
      },
    },
  });

  if (query.error && onFetchError) {
    onFetchError(query.error);
  }

  const queryResult = (query.data ?? {}) as ApiResponse<ApiResource[]>;

  // Navigate to page (resets to page 1 if perPage changed)
  const goToPage = useCallback(
    (page: number, perPage?: number) => {
      if (typeof page !== 'number') return;
      const isPerPageChanged = perPage !== undefined && perPage !== Number(paramsObj.limit);
      updateSearchParams({
        ...paramsObj,
        ...(perPage !== undefined && { limit: perPage }),
        page: isPerPageChanged ? 1 : page,
      });
    },
    [paramsObj, updateSearchParams],
  );

  // Build generated helpers: {alias}Query + {alias}ByQuery
  const generatedParamsKey = useMemo(
    () => ({ ...DEFAULT_GENERATED_PARAMS, ...customGenerated }),
    [customGenerated],
  );

  const generatedHelpers = useMemo(() => {
    return Object.entries(generatedParamsKey)
      .flatMap(([alias, paramNames]) => {
        const names = Array.isArray(paramNames) ? paramNames : [paramNames];
        const currentValue = names.map((n) => paramsObj?.[n]).find((v) => v !== undefined);

        return {
          [`${alias}Query`]: currentValue as string | undefined,
          [`${alias}ByQuery`]: (value: string) => {
            const newParams = names.reduce<Record<string, unknown>>((acc, n) => {
              acc[n] = value || undefined;
              return acc;
            }, {});
            updateSearchParams({ ...validateNextParams(newParams), page: 1 });
          },
        };
      })
      .reduce<Record<string, unknown>>((acc, item) => ({ ...acc, ...item }), {});
  }, [generatedParamsKey, paramsObj, validateNextParams, updateSearchParams]);

  // Set multiple params at once (resets page to 1)
  const setByQuery = useCallback(
    (nextParams: Record<string, unknown> = {}) => {
      updateSearchParams({ ...validateNextParams(nextParams), page: 1 });
    },
    [validateNextParams, updateSearchParams],
  );

  // Reset all params to defaults
  const resetParams = useCallback(() => {
    const cleaned = Object.entries(defaultParams).reduce<Record<string, string>>(
      (acc, [k, v]) => {
        if (v !== undefined && v !== null && v !== '') acc[k] = String(v);
        return acc;
      },
      {},
    );
    setSearchParams(cleaned, { replace: true });
  }, [defaultParams, setSearchParams]);

  // True if any active param differs from default
  const isFiltered = useMemo(() => {
    const current = { ...paramsObj };
    Object.keys(defaultParams).forEach((k) => {
      if (String(current[k]) === String(defaultParams[k])) delete current[k];
    });
    return Object.keys(current).length > 0;
  }, [paramsObj, defaultParams]);

  return {
    // Generated filter helpers (searchQuery, searchByQuery, etc.)
    ...generatedHelpers,
    /** Array of ApiResource items */
    data: (queryResult?.data ?? []) as ApiResource[],
    /** Pagination meta from backend */
    pagination: queryResult?.pagination as ApiPagination | undefined,
    /** Full ApiResponse */
    response: queryResult,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
    /** Navigate to page. Pass perPage to change limit (resets to page 1). */
    goToPage,
    /** Set multiple filter params at once (resets page to 1) */
    setByQuery,
    /** Reset all params to defaultParams */
    resetParams,
    /** True if any active param differs from default */
    isFiltered,
    /** Current merged params object */
    paramsObj,
    nextPage: () => goToPage(queryResult?.pagination?.next ?? 1),
    prevPage: () => goToPage(queryResult?.pagination?.prev ?? 1),
  };
}

export default useDataPagination;
