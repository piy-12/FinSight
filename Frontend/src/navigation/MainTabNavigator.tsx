import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MainTabParamList } from '../types/navigation';
import { useTheme } from '../theme/ThemeContext';
import { DashboardNavigator } from './DashboardNavigator';
import { ExpenseNavigator } from './ExpenseNavigator';
import { ProfileNavigator } from './ProfileNavigator';
import { SettingsNavigator } from './SettingsNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS: Record<keyof MainTabParamList, string> = {
  DashboardTab: 'view-dashboard-outline',
  ExpensesTab: 'receipt-text-outline',
  ProfileTab: 'account-outline',
  SettingsTab: 'cog-outline',
};

export const MainTabNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, size }) => (
          <Icon
            name={ICONS[route.name as keyof MainTabParamList]}
            color={color}
            size={size}
          />
        ),
      })}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardNavigator}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="ExpensesTab"
        component={ExpenseNavigator}
        options={{ title: 'Expenses' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{ title: 'Profile' }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsNavigator}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
};
