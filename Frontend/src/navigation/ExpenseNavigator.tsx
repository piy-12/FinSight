import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExpenseStackParamList } from '../types/navigation';
import ExpenseListScreen from '../screens/Expense/ExpenseListScreen';
import ExpenseDetailsScreen from '../screens/Expense/ExpenseDetailsScreen';
import AddExpenseScreen from '../screens/Expense/AddExpenseScreen';
import EditExpenseScreen from '../screens/Expense/EditExpenseScreen';
import OCRScanScreen from '../screens/OCR/OCRScanScreen';

const Stack = createNativeStackNavigator<ExpenseStackParamList>();

export const ExpenseNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExpenseList" component={ExpenseListScreen} />
      <Stack.Screen name="ExpenseDetails" component={ExpenseDetailsScreen} />
      <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
      <Stack.Screen name="EditExpense" component={EditExpenseScreen} />
      <Stack.Screen name="OCRScan" component={OCRScanScreen} />
    </Stack.Navigator>
  );
};
