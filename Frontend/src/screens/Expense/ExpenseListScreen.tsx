import React, { useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../../components/common/Screen';
import { AppText } from '../../components/common/AppText';
import { LoadingIndicator } from '../../components/common/LoadingIndicator';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { ExpenseListItem } from '../../components/cards/ExpenseListItem';
import { FAB } from '../../components/buttons/FAB';
import { IconButton } from '../../components/buttons/IconButton';
import { useTheme } from '../../theme/ThemeContext';
import { useExpenses } from '../../hooks/useExpenses';
import { useProfileContext } from '../../context/ProfileContext';
import { ExpenseStackParamList } from '../../types/navigation';
import { formatCurrency } from '../../utils/formatters';

type Nav = NativeStackNavigationProp<ExpenseStackParamList, 'ExpenseList'>;

const ExpenseListScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const navigation = useNavigation<Nav>();
  const { profile } = useProfileContext();
  const { expenses, loading, refreshing, error, refresh } = useExpenses();
  const currency = profile?.currency ?? 'USD';
  const [hasFocusedOnce, setHasFocusedOnce] = useState(false);

  // Refresh the list whenever this screen regains focus (e.g. after adding
  // or editing an expense) so it never shows stale data.
  useFocusEffect(
    React.useCallback(() => {
      if (hasFocusedOnce) {
        refresh();
      } else {
        setHasFocusedOnce(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasFocusedOnce]),
  );

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  if (loading) {
    return <LoadingIndicator fullScreen label="Loading expenses..." />;
  }

  return (
    <Screen padded={false} style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          padding: spacing.md,
          paddingBottom: spacing.xs,
        }}
      >
        <View>
          <AppText variant="h1">Expenses</AppText>
          {expenses.length > 0 ? (
            <AppText variant="body" color="secondary">
              {expenses.length} expense{expenses.length !== 1 ? 's' : ''} ·{' '}
              {formatCurrency(total, currency)} total
            </AppText>
          ) : null}
        </View>
        <IconButton
          icon="text-recognition"
          accessibilityLabel="Scan receipt"
          onPress={() => navigation.navigate('OCRScan')}
        />
      </View>

      {error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : expenses.length === 0 ? (
        <EmptyState
          icon="receipt-text-outline"
          title="No expenses yet"
          description="Add your first expense to start tracking your spending."
          actionLabel="Add Expense"
          onAction={() => navigation.navigate('AddExpense', undefined)}
        />
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={item => item.id}
          contentContainerStyle={{
            paddingHorizontal: spacing.md,
            paddingBottom: 100,
          }}
          renderItem={({ item }) => (
            <ExpenseListItem
              expense={item}
              currency={currency}
              onPress={() =>
                navigation.navigate('ExpenseDetails', { expenseId: item.id })
              }
            />
          )}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: colors.divider }} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        />
      )}

      <FAB onPress={() => navigation.navigate('AddExpense', undefined)} />
    </Screen>
  );
};

export default ExpenseListScreen;
