import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdvisorStackParamList } from '../types/navigation';
import AdvisorChatScreen from '../screens/Advisor/AdvisorChatScreen';

const Stack = createNativeStackNavigator<AdvisorStackParamList>();

export const AdvisorNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdvisorChat" component={AdvisorChatScreen} />
    </Stack.Navigator>
  );
};