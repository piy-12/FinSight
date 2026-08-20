import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import axios from 'axios';
import { profileService } from '../services/api/profileService';
import { UserProfile } from '../types/models';
import { parseApiError } from '../services/api/client';
import { useAuth } from './AuthContext';

interface ProfileContextValue {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  hasNoProfile: boolean;
  refresh: () => Promise<void>;
  createProfile: (
    monthlyIncome: number,
    savingsGoal: number,
  ) => Promise<void>;
  updateProfile: (
    monthlyIncome: number,
    savingsGoal: number,
  ) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(
  undefined,
);

export const ProfileProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
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
    if (isAuthenticated) {
      refresh();
    } else {
      setProfile(null);
      setHasNoProfile(false);
    }
  }, [isAuthenticated, refresh]);

  const createProfile = useCallback(
    async (monthlyIncome: number, savingsGoal: number) => {
      const result = await profileService.createProfile({
        monthlyIncome,
        savingsGoal,
      });
      setProfile(result);
      setHasNoProfile(false);
    },
    [],
  );

  const updateProfile = useCallback(
    async (monthlyIncome: number, savingsGoal: number) => {
      const result = await profileService.updateProfile({
        monthlyIncome,
        savingsGoal,
      });
      setProfile(result);
    },
    [],
  );

  const value = useMemo<ProfileContextValue>(
    () => ({
      profile,
      loading,
      error,
      hasNoProfile,
      refresh,
      createProfile,
      updateProfile,
    }),
    [profile, loading, error, hasNoProfile, refresh, createProfile, updateProfile],
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};

export const useProfileContext = (): ProfileContextValue => {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return ctx;
};
