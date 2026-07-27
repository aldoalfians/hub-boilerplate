'use client';

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import useFetchApi from './useFetchApi';
import type { FetchOptions } from '@/utils/fetchApi';
import type { ApiResponse } from '@/types/api';

interface UseQueryFetchOptions<T> extends Omit<FetchOptions, 'method'> {
  queryKey: string[];
  enabled?: boolean;
  staleTime?: number;
  queryOptions?: Partial<UseQueryOptions<ApiResponse<T>>>;
}

const useQueryFetch = <T = unknown>({
  queryKey, url, params, headers, onSuccess, onError,
  enabled = true, staleTime, queryOptions,
}: UseQueryFetchOptions<T>) => {
  const fetch = useFetchApi({ url, method: 'GET', params, headers, onSuccess, onError });

  return useQuery<ApiResponse<T>>({
    queryKey: [...queryKey, params],
    queryFn: () => fetch() as Promise<ApiResponse<T>>,
    enabled,
    staleTime,
    ...queryOptions,
  });
};

export default useQueryFetch;
