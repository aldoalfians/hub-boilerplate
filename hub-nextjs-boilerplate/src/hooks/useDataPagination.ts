'use client';

import { useCallback, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import useQueryFetch from './useQueryFetch';
import type { ApiResponse, ApiResource, ApiPagination } from '@/types/api';

type GeneratedParamsMap = Record<string, string | string[]>;

interface UseDataPaginationOptions {
  dataSourceUrl: string;
  defaultParams?: Record<string, unknown>;
  onFetchSuccess?: (data: ApiResponse) => unknown;
  onFetchError?: (err: unknown) => unknown;
  generatedParamsKey?: GeneratedParamsMap;
  excludeUrlParams?: string[];
  enabled?: boolean;
}

const DEFAULT_GENERATED_PARAMS: GeneratedParamsMap = {
  search: ['search', 'q'],
};

function useDataPagination({
  dataSourceUrl,
  defaultParams = { page: 1, limit: 20 },
  onFetchSuccess,
  onFetchError,
  generatedParamsKey: customGenerated,
  excludeUrlParams = [],
  enabled = true,
}: UseDataPaginationOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const paramsObj = useMemo(() => {
    const obj: Record<string, unknown> = { ...defaultParams };
    searchParams.forEach((value, key) => {
      if (!excludeUrlParams.includes(key)) obj[key] = value;
    });
    return obj;
  }, [searchParams, defaultParams, excludeUrlParams]);

  const updateSearchParams = useCallback(
    (nextParams: Record<string, unknown>) => {
      const cleaned = Object.entries(nextParams).reduce<Record<string, string>>(
        (acc, [k, v]) => {
          if (v !== undefined && v !== null && v !== '' && String(v) !== 'undefined') acc[k] = String(v);
          return acc;
        },
        {},
      );
      const params = new URLSearchParams(cleaned);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname],
  );

  const validateNextParams = useCallback(
    (nextParams: Record<string, unknown> = {}, excludeKeys: string[] = []) => {
      return Object.entries({ ...paramsObj, ...nextParams }).reduce<Record<string, unknown>>(
        (acc, [k, v]) => {
          if (v !== null && v !== undefined && v !== '' && !excludeKeys.includes(k)) acc[k] = v;
          return acc;
        },
        {},
      );
    },
    [paramsObj],
  );

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

  if (query.error && onFetchError) onFetchError(query.error);

  const queryResult = (query.data ?? {}) as ApiResponse<ApiResource[]>;

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

  const setByQuery = useCallback(
    (nextParams: Record<string, unknown> = {}) => {
      updateSearchParams({ ...validateNextParams(nextParams), page: 1 });
    },
    [validateNextParams, updateSearchParams],
  );

  const resetParams = useCallback(() => {
    const cleaned = Object.entries(defaultParams).reduce<Record<string, string>>(
      (acc, [k, v]) => {
        if (v !== undefined && v !== null && v !== '') acc[k] = String(v);
        return acc;
      },
      {},
    );
    const params = new URLSearchParams(cleaned);
    router.replace(`${pathname}?${params.toString()}`);
  }, [defaultParams, router, pathname]);

  const isFiltered = useMemo(() => {
    const current = { ...paramsObj };
    Object.keys(defaultParams).forEach((k) => {
      if (String(current[k]) === String(defaultParams[k])) delete current[k];
    });
    return Object.keys(current).length > 0;
  }, [paramsObj, defaultParams]);

  return {
    ...generatedHelpers,
    data: (queryResult?.data ?? []) as ApiResource[],
    pagination: queryResult?.pagination as ApiPagination | undefined,
    response: queryResult,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
    goToPage,
    setByQuery,
    resetParams,
    isFiltered,
    paramsObj,
    nextPage: () => goToPage(queryResult?.pagination?.next ?? 1),
    prevPage: () => goToPage(queryResult?.pagination?.prev ?? 1),
  };
}

export default useDataPagination;
