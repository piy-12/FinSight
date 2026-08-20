import axios, { AxiosError, AxiosInstance } from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS } from '../../constants/config';
import { StorageKeys } from '../../constants/storageKeys';
import { getItem } from '../../storage/asyncStorage';
import { appEvents, APP_EVENTS } from '../../utils/eventEmitter';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async config => {
  const token = await getItem<string>(StorageKeys.AUTH_TOKEN);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Normalized error shape every service call can rely on. */
export interface ApiErrorInfo {
  status: number | null;
  message: string;
}

export function parseApiError(error: unknown): ApiErrorInfo {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const status = axiosError.response?.status ?? null;
    const message =
      axiosError.response?.data?.message ??
      (axiosError.code === 'ECONNABORTED'
        ? 'Request timed out. Please check your connection.'
        : !axiosError.response
        ? 'Unable to reach the server. Please check your connection.'
        : 'Something went wrong. Please try again.');
    return { status, message };
  }
  return { status: null, message: 'Something went wrong. Please try again.' };
}

apiClient.interceptors.response.use(
  response => response,
  error => {
    const info = parseApiError(error);
    if (info.status === 401) {
      appEvents.emit(APP_EVENTS.UNAUTHORIZED);
    }
    return Promise.reject(error);
  },
);
