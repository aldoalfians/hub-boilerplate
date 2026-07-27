'use client';

import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import useFetchApi from './useFetchApi';
import type { FetchOptions } from '@/utils/fetchApi';
import type { ApiResponse, FetchError } from '@/types/api';

interface UseMutationSubmitOptions<TData = unknown, TVariables = Record<string, unknown>>
  extends Omit<FetchOptions, 'method' | 'payload'> {
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  mutationOptions?: Partial<UseMutationOptions<ApiResponse<TData>, FetchError, TVariables>>;
}

const useMutationSubmit = <TData = unknown, TVariables extends Record<string, unknown> = Record<string, unknown>>({
  url, method = 'POST', params, headers, onSuccess, onError, mutationOptions,
}: UseMutationSubmitOptions<TData, TVariables>) => {
  const fetch = useFetchApi({ url, method, params, headers, onSuccess, onError });

  return useMutation<ApiResponse<TData>, FetchError, TVariables>({
    mutationFn: (variables: TVariables) => fetch(variables as Record<string, unknown>) as Promise<ApiResponse<TData>>,
    ...mutationOptions,
  });
};

export default useMutationSubmit;
