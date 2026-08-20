import { NavigatorScreenParams } from '@react-navigation/native';
import { Expense } from './models';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type DashboardStackParamList = {
  DashboardHome: undefined;
  ExpenseDetails: { expenseId: string };
};

export type ExpenseStackParamList = {
  ExpenseList: undefined;
  ExpenseDetails: { expenseId: string };
  AddExpense: { prefill?: Partial<Expense>; receiptUri?: string } | undefined;
  EditExpense: { expenseId: string };
  OCRScan: undefined;
};

export type ProfileStackParamList = {
  ViewProfile: undefined;
  EditProfile: undefined;
};

export type SettingsStackParamList = {
  SettingsHome: undefined;
};

export type MainTabParamList = {
  DashboardTab: NavigatorScreenParams<DashboardStackParamList>;
  ExpensesTab: NavigatorScreenParams<ExpenseStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
  SettingsTab: NavigatorScreenParams<SettingsStackParamList>;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
