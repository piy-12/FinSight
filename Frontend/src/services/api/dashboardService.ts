import { apiClient } from './client';
import { ApiSuccess } from '../../types/api';
import { DashboardData } from '../../types/models';

export const dashboardService = {
  async getDashboard(): Promise<DashboardData> {
    // Backend returns { success, data: {...} } once /api/dashboard is mounted.
    const res = await apiClient.get<ApiSuccess<DashboardData>>(
      '/api/dashboard',
    );
    return res.data.data;
  },
};
