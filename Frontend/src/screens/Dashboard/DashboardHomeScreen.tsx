import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../../components/common/Screen';
import { AppText } from '../../components/common/AppText';
import { LoadingIndicator } from '../../components/common/LoadingIndicator';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/cards/Card';
import { BudgetCard } from '../../components/cards/BudgetCard';
import { ExpenseListItem } from '../../components/cards/ExpenseListItem';
import { CategoryPieChart } from '../../components/charts/CategoryPieChart';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useProfileContext } from '../../context/ProfileContext';
import { useDashboard } from '../../hooks/useDashboard';
import { DashboardStackParamList } from '../../types/navigation';

type Nav = NativeStackNavigationProp<DashboardStackParamList, 'DashboardHome'>;

const DashboardHomeScreen: React.FC = () => {
  const { spacing } = useTheme();
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const { profile } = useProfileContext();
  const { data, loading, refreshing, error, refresh } = useDashboard();
  const currency = profile?.currency ?? 'USD';

  if (loading) {
    return <LoadingIndicator fullScreen label="Loading your dashboard..." />;
  }

  if (error) {
    return (
      <Screen>
        <ErrorState message={error} onRetry={refresh} />
      </Screen>
    );
  }

  if (!data) {
    return (
      <Screen>
        <EmptyState
          icon="chart-donut"
          title="No dashboard data yet"
          description="Add your first expense to see insights here."
        />
      </Screen>
    );
  }

  const overBudget = data.totalSpent > data.spendingBudget;

  return (
    <Screen scroll refreshing={refreshing} onRefresh={refresh}>
      <View style={{ marginBottom: spacing.lg }}>
        <AppText variant="body" color="secondary">
          Welcome back,
        </AppText>
        <AppText variant="h1">{user?.name ?? 'there'}</AppText>
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm }}>
        <BudgetCard
          label="Spending Budget"
          amount={data.spendingBudget}
          currency={currency}
          icon="wallet-outline"
          tone="primary"
        />
        <BudgetCard
          label="Total Spent"
          amount={data.totalSpent}
          currency={currency}
          icon="trending-down"
          tone={overBudget ? 'danger' : 'warning'}
        />
      </View>
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg }}>
        <BudgetCard
          label="Remaining"
          amount={data.remainingBudget}
          currency={currency}
          icon="cash-check"
          tone={data.remainingBudget >= 0 ? 'success' : 'danger'}
        />
        <BudgetCard
          label="Savings Goal"
          amount={data.savingsGoal}
          currency={currency}
          icon="piggy-bank-outline"
          tone="primary"
        />
      </View>

      <Card style={{ marginBottom: spacing.lg }}>
        <AppText variant="h3" style={{ marginBottom: spacing.sm }}>
          Spending by Category
        </AppText>
        <CategoryPieChart breakdown={data.categoryBreakdown} currency={currency} />
      </Card>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.xs,
        }}
      >
        <AppText variant="h3">Recent Expenses</AppText>
        <TouchableOpacity
          onPress={() =>
            navigation.getParent()?.navigate('ExpensesTab', {
              screen: 'ExpenseList',
            })
          }
        >
          <AppText variant="bodyMedium" color="brand">
            See all
          </AppText>
        </TouchableOpacity>
      </View>

      <Card>
        {data.recentExpenses.length === 0 ? (
          <AppText variant="body" color="muted" align="center">
            No expenses yet.
          </AppText>
        ) : (
          data.recentExpenses.map((expense, index) => (
            <View
              key={expense.id}
              style={
                index !== data.recentExpenses.length - 1
                  ? {
                      borderBottomWidth: 1,
                      borderBottomColor: 'transparent',
                    }
                  : undefined
              }
            >
              <ExpenseListItem
                expense={expense}
                currency={currency}
                onPress={() =>
                  navigation.navigate('ExpenseDetails', {
                    expenseId: expense.id,
                  })
                }
              />
            </View>
          ))
        )}
      </Card>

      <View style={{ height: spacing.xl }} />
    </Screen>
  );
};

export default DashboardHomeScreen;
