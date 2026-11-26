import axios, { AxiosError } from 'axios';
import { AI_API_BASE_URL, AI_TIMEOUT_MS } from '../../constants/config';
import { StorageKeys } from '../../constants/storageKeys';
import { getItem } from '../../storage/asyncStorage';
import { AiChatRequest, AiChatResponse } from '../../types/api';
import { appEvents, APP_EVENTS } from '../../utils/eventEmitter';

const aiApiClient = axios.create({
  baseURL: AI_API_BASE_URL,
  timeout: AI_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

aiApiClient.interceptors.request.use(async config => {
  const token = await getItem<string>(StorageKeys.AUTH_TOKEN);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

aiApiClient.interceptors.response.use(
  response => response,
  error => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      appEvents.emit(APP_EVENTS.UNAUTHORIZED);
    }
    return Promise.reject(error);
  },
);

export function parseAiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<{ detail?: string; message?: string }>;
    if (axiosErr.response?.data?.detail) {
      return axiosErr.response.data.detail;
    }
    if (axiosErr.response?.data?.message) {
      return axiosErr.response.data.message;
    }
    if (axiosErr.code === 'ECONNABORTED') {
      return 'The AI advisor took too long to respond. Please try again.';
    }
    if (!axiosErr.response) {
      return 'Unable to reach FinSight AI service. Ensure port 8000 is running.';
    }
  }
  return 'Something went wrong while talking to FinSight AI.';
}

export const aiService = {
  async sendMessage(payload: AiChatRequest): Promise<AiChatResponse> {
    const res = await aiApiClient.post<AiChatResponse>(
      '/api/v1/financial/chat',
      payload,
    );
    return res.data;
  },
};