import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardStackParamList } from '../types/navigation';
import DashboardHomeScreen from '../screens/Dashboard/DashboardHomeScreen';
import ExpenseDetailsScreen from '../screens/Expense/ExpenseDetailsScreen';

const Stack = createNativeStackNavigator<DashboardStackParamList>();

export const DashboardNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardHome" component={DashboardHomeScreen} />
      <Stack.Screen name="ExpenseDetails" component={ExpenseDetailsScreen} />
    </Stack.Navigator>
  );
};
