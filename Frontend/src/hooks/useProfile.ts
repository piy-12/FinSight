import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { profileService } from '../services/api/profileService';
import { UserProfile } from '../types/models';
import { parseApiError } from '../services/api/client';

interface UseProfileResult {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  /** True once we've confirmed via a 404 that the user has no profile yet. */
  hasNoProfile: boolean;
  refresh: () => Promise<void>;
  createProfile: (
    monthlyIncome: number,
    savingsGoal: number,
  ) => Promise<UserProfile>;
  updateProfile: (
    monthlyIncome: number,
    savingsGoal: number,
  ) => Promise<UserProfile>;
}

export function useProfile(autoFetch = true): UseProfileResult {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [hasNoProfile, setHasNoProfile] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await profileService.getProfile();
      setProfile(result);
      setHasNoProfile(false);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setProfile(null);
        setHasNoProfile(true);
      } else {
        setError(parseApiError(err).message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createProfile = async (monthlyIncome: number, savingsGoal: number) => {
    const result = await profileService.createProfile({
      monthlyIncome,
      savingsGoal,
    });
    setProfile(result);
    setHasNoProfile(false);
    return result;
  };

  const updateProfile = async (monthlyIncome: number, savingsGoal: number) => {
    const result = await profileService.updateProfile({
      monthlyIncome,
      savingsGoal,
    });
    setProfile(result);
    return result;
  };

  return {
    profile,
    loading,
    error,
    hasNoProfile,
    refresh,
    createProfile,
    updateProfile,
  };
}
