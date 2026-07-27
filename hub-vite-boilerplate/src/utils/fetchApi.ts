import { AxiosError } from 'axios';
import api from '@/lib/axios';
import type { ApiResponse, FetchError } from '@/types/api';

export interface FetchRequest {
  url: string;
  params: Record<string, unknown>;
  payload: Record<string, unknown>;
  headers: Record<string, unknown>;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
}

export interface FetchOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, unknown>;
  payload?: Record<string, unknown>;
  params?: Record<string, unknown>;
  onSuccess?: (data: ApiResponse, request: FetchRequest) => unknown;
  onError?: (err: unknown, request: FetchRequest) => void | boolean | string;
  signal?: AbortSignal;
  responseType?: 'json' | 'blob' | 'arraybuffer';
}

function hasFilePayload(payload: Record<string, unknown>): boolean {
  return Object.values(payload).some((value) => {
    if (Array.isArray(value)) return value.some((v) => v instanceof File);
    return value instanceof File;
  });
}

function toFormData(payload: Record<string, unknown>): FormData {
  const fd = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => fd.append(`${key}[]`, v as string | Blob));
    } else if (value !== null && value !== undefined) {
      fd.append(key, value as string | Blob);
    }
  });
  return fd;
}

export default function fetchApi({
  url,
  method = 'GET',
  payload = {},
  params = {},
  headers = {},
  onSuccess,
  onError,
  signal,
  responseType,
}: FetchOptions): Promise<ApiResponse> {
  const request: FetchRequest = { url, method, headers, params, payload };
  const isFormData = hasFilePayload(payload);

  const requestConfig: Record<string, unknown> = {
    url,
    method,
    headers: { ...headers },
    signal,
    responseType,
  };

  // Clean & attach params
  if (Object.keys(params).length > 0) {
    requestConfig.params = Object.fromEntries(
      Object.entries(params).filter(
        ([, v]) => v !== undefined && v !== null && v !== '' && String(v) !== 'undefined',
      ),
    );
  }

  // Attach payload
  if (isFormData) {
    requestConfig.data = toFormData(payload);
    (requestConfig.headers as Record<string, string>)['Content-Type'] = 'multipart/form-data';
  } else if (Object.keys(payload).length > 0 && method !== 'GET') {
    requestConfig.data = payload;
  }

  return new Promise<ApiResponse>((resolve, reject) => {
    api(requestConfig)
      .then((res) => {
        const data: ApiResponse = res.data as ApiResponse;

        if (typeof data?.success === 'boolean' && !data.success) {
          throw new AxiosError(
            data.message || 'Terjadi kesalahan',
            String(data.code || res.status),
            res.config,
            res.request,
            res,
          );
        }

        if (onSuccess) {
          resolve(onSuccess(data, request) as ApiResponse);
          return;
        }

        resolve(data);
      })
      .catch((e: AxiosError<ApiResponse>) => {
        const typeAlert = e.response?.data?.alert ?? 'error';

        const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register');
        if (e.response?.status === 401 && !isAuthEndpoint) {
          reject({ errorMessage: 'Session expired', typeAlert: 'warning' } satisfies FetchError);
          return;
        }

        const errResult = onError?.(e, request);
        if (errResult === false) {
          reject({ errorMessage: '', typeAlert } satisfies FetchError);
          return;
        }

        const errorMessage =
          (typeof errResult === 'string' ? errResult : null) ??
          e.response?.data?.message ??
          e.message ??
          'Terjadi kesalahan, silakan coba lagi';

        const errors = e.response?.data?.errors;
        reject({ errorMessage, typeAlert, errors } satisfies FetchError);
      });
  });
}
