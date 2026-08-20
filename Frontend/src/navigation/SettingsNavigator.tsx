import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../types/navigation';
import SettingsScreen from '../screens/Settings/SettingsScreen';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export const SettingsNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsHome" component={SettingsScreen} />
    </Stack.Navigator>
  );
};
