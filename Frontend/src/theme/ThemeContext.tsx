import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  PropsWithChildren,
} from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { darkColors, lightColors, ThemeColors } from './colors';
import { typography, spacing, radius, shadow } from './typography';
import { StorageKeys } from '../constants/storageKeys';
import { getItem, setItem } from '../storage/asyncStorage';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  typography: typeof typography;
  spacing: typeof spacing;
  radius: typeof radius;
  shadow: typeof shadow;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(
    () => Appearance.getColorScheme() ?? 'light',
  );

  useEffect(() => {
    (async () => {
      const saved = await getItem<ThemeMode>(StorageKeys.THEME_MODE);
      if (saved) {
        setModeState(saved);
      }
    })();
  }, []);

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme);
    });
    return () => sub.remove();
  }, []);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    setItem(StorageKeys.THEME_MODE, next);
  };

  const isDark =
    mode === 'dark' || (mode === 'system' && systemScheme === 'dark');

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      isDark,
      colors: isDark ? darkColors : lightColors,
      typography,
      spacing,
      radius,
      shadow,
      setMode,
    }),
    [mode, isDark],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
};
