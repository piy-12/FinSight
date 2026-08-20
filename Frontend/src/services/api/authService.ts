import { apiClient } from './client';
import {
  ApiSuccess,
  LoginRequest,
  LoginResponseData,
  RegisterRequest,
} from '../../types/api';
import { User } from '../../types/models';

export const authService = {
  async register(payload: RegisterRequest): Promise<User> {
    const res = await apiClient.post<ApiSuccess<User>>(
      '/api/auth/register',
      payload,
    );
    return res.data.data;
  },

  async login(payload: LoginRequest): Promise<LoginResponseData> {
    const res = await apiClient.post<ApiSuccess<LoginResponseData>>(
      '/api/auth/login',
      payload,
    );
    return res.data.data;
  },
};
