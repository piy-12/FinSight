import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { authService } from '../services/api/authService';
import { getItem, removeItem, setItem } from '../storage/asyncStorage';
import { StorageKeys } from '../constants/storageKeys';
import { User } from '../types/models';
import { appEvents, APP_EVENTS } from '../utils/eventEmitter';
import { parseApiError } from '../services/api/client';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    setUser(null);
    setToken(null);
    await Promise.all([
      removeItem(StorageKeys.AUTH_TOKEN),
      removeItem(StorageKeys.AUTH_USER),
    ]);
  }, []);

  // Bootstrap session from storage on app start.
  useEffect(() => {
    (async () => {
      const [storedToken, storedUser] = await Promise.all([
        getItem<string>(StorageKeys.AUTH_TOKEN),
        getItem<User>(StorageKeys.AUTH_USER),
      ]);
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
      setIsLoading(false);
    })();
  }, []);

  // Global 401 handler — any API call that comes back unauthorized logs the user out.
  useEffect(() => {
    const unsubscribe = appEvents.on(APP_EVENTS.UNAUTHORIZED, () => {
      logout();
    });
    return unsubscribe;
  }, [logout]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const result = await authService.login({ email, password });
      setToken(result.token);
      setUser(result.user);
      await Promise.all([
        setItem(StorageKeys.AUTH_TOKEN, result.token),
        setItem(StorageKeys.AUTH_USER, result.user),
      ]);
    } catch (error) {
      throw new Error(parseApiError(error).message);
    }
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        await authService.register({ name, email, password });
        // Backend register doesn't return a token — log in right after.
        await login(email, password);
      } catch (error) {
        throw new Error(parseApiError(error).message);
      }
    },
    [login],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: !!token,
      login,
      register,
      logout,
    }),
    [user, token, isLoading, logout, login, register],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
