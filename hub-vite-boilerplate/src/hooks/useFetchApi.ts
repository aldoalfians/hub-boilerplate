import { useCallback, useRef } from 'react';
import fetchApi, { type FetchOptions } from '@/utils/fetchApi';

/**
 * Memoized fetch wrapper with stable function reference.
 * Pre-configures options, allows runtime overrides.
 * Used by useQueryFetch and useMutationSubmit internally.
 */
const useFetchApi = (options: FetchOptions) => {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  return useCallback(
    (
      runtimePayload: Record<string, unknown> = {},
      runtimeParams: Record<string, unknown> = {},
      extraConfig: Partial<FetchOptions> = {},
    ) => {
      const {
        url,
        method,
        headers,
        payload = {},
        params = {},
        onSuccess,
        onError,
        ...rest
      } = optionsRef.current;

      return fetchApi({
        url,
        method,
        headers,
        payload: { ...payload, ...runtimePayload },
        params: { ...params, ...runtimeParams },
        onSuccess,
        onError,
        ...rest,
        ...extraConfig,
      });
    },
    [],
  );
};

export default useFetchApi;
