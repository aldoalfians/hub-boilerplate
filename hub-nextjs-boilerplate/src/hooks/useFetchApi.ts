'use client';

import { useCallback } from 'react';
import fetchApi, { type FetchOptions } from '@/utils/fetchApi';

const useFetchApi = (options: Omit<FetchOptions, 'payload'>) => {
  return useCallback(
    (payload?: Record<string, unknown>) => fetchApi({ ...options, payload: payload ?? {} }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options.url, options.method],
  );
};

export default useFetchApi;
