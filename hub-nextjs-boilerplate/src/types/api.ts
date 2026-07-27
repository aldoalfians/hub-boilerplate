export interface ApiResource<T = Record<string, unknown>> {
  id: string;
  type: string;
  attributes: T;
}

export interface ApiPagination {
  count: number;
  page: number;
  limit: number;
  offset: number;
  last: number;
  from: number;
  to: number;
  prev: number | null;
  next: number | null;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  code: number;
  status: string;
  message: string;
  alert: 'success' | 'error' | 'warning' | 'info';
  data: T;
  pagination?: ApiPagination;
  filters?: Record<string, unknown>;
  sorting?: { field: string; direction: 'asc' | 'desc' };
  errors?: string[];
  timestamp?: string;
  path?: string;
}

export type ApiListResponse<T = Record<string, unknown>> = ApiResponse<ApiResource<T>[]>;
export type ApiResourceResponse<T = Record<string, unknown>> = ApiResponse<ApiResource<T>>;

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl: string | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  [key: string]: unknown;
}

export interface FetchError {
  errorMessage: string;
  typeAlert: 'success' | 'error' | 'warning' | 'info';
  errors?: string[];
}
