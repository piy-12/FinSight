import { apiClient } from './client';
import { ProfileRequest, ProfileResponse } from '../../types/api';
import { UserProfile } from '../../types/models';

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    const res = await apiClient.get<ProfileResponse>('/api/profile');
    return res.data.profile;
  },

  async createProfile(payload: ProfileRequest): Promise<UserProfile> {
    const res = await apiClient.post<ProfileResponse>(
      '/api/profile',
      payload,
    );
    return res.data.profile;
  },

  async updateProfile(payload: ProfileRequest): Promise<UserProfile> {
    const res = await apiClient.put<ProfileResponse>('/api/profile', payload);
    return res.data.profile;
  },
};
