import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useProfileContext } from '../context/ProfileContext';
import { useTheme } from '../theme/ThemeContext';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import SplashScreen from '../screens/Auth/SplashScreen';
import CreateProfileScreen from '../screens/Profile/CreateProfileScreen';

const Stack = createNativeStackNavigator();

/**
 * Three states, in order of precedence:
 * 1. Auth still bootstrapping from storage -> full-screen loader.
 * 2. Not authenticated -> Login/Register flow.
 * 3. Authenticated but profile hasn't been created yet -> CreateProfile gate.
 * 4. Authenticated + has profile -> Main tab app.
 */
const RootNavigator: React.FC = () => {
  const { colors, isDark } = useTheme();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { hasNoProfile, loading: profileLoading } = useProfileContext();

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.border,
      primary: colors.primary,
    },
  };

  if (authLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer theme={navTheme}>
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : profileLoading ? (
        <SplashScreen />
      ) : hasNoProfile ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
        </Stack.Navigator>
      ) : (
        <MainTabNavigator />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
