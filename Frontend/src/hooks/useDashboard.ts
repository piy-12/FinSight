import { useCallback, useEffect, useState } from 'react';
import { dashboardService } from '../services/api/dashboardService';
import { DashboardData } from '../types/models';
import { parseApiError } from '../services/api/client';

interface UseDashboardResult {
  data: DashboardData | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useDashboard(): UseDashboardResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const result = await dashboardService.getDashboard();
      setData(result);
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    data,
    loading,
    refreshing,
    error,
    refresh: () => fetchDashboard(true),
  };
}
