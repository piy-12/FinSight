import React, { useCallback, useState } from 'react';
import { Image, View } from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Screen } from '../../components/common/Screen';
import { AppText } from '../../components/common/AppText';
import { LoadingIndicator } from '../../components/common/LoadingIndicator';
import { ErrorState } from '../../components/common/ErrorState';
import { Card } from '../../components/cards/Card';
import { IconButton } from '../../components/buttons/IconButton';
import { ConfirmModal } from '../../components/modals/ConfirmModal';
import { useTheme } from '../../theme/ThemeContext';
import { useProfileContext } from '../../context/ProfileContext';
import { expenseService } from '../../services/api/expenseService';
import { parseApiError } from '../../services/api/client';
import { Expense } from '../../types/models';
import { ExpenseStackParamList } from '../../types/navigation';
import { CATEGORY_META } from '../../constants/categories';
import { formatCurrency, formatDate } from '../../utils/formatters';

type Nav = NativeStackNavigationProp<ExpenseStackParamList, 'ExpenseDetails'>;
type RouteProps = RouteProp<ExpenseStackParamList, 'ExpenseDetails'>;

const ExpenseDetailsScreen: React.FC = () => {
  const { colors, spacing, radius } = useTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const { expenseId } = route.params;
  const { profile } = useProfileContext();
  const currency = profile?.currency ?? 'USD';

  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadExpense = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await expenseService.getExpenseById(expenseId);
      setExpense(result);
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, [expenseId]);

  useFocusEffect(
    useCallback(() => {
      loadExpense();
    }, [loadExpense]),
  );

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await expenseService.deleteExpense(expenseId);
      setConfirmDelete(false);
      navigation.goBack();
    } catch (err) {
      setError(parseApiError(err).message);
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingIndicator fullScreen />;
  }

  if (error || !expense) {
    return (
      <Screen>
        <ErrorState message={error ?? 'Expense not found.'} onRetry={loadExpense} />
      </Screen>
    );
  }

  const meta = CATEGORY_META[expense.category] ?? {
    label: expense.category,
    icon: 'shape-outline',
  };

  return (
    <>
      <Screen scroll>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.lg,
          }}
        >
          <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <IconButton
              icon="pencil-outline"
              onPress={() =>
                navigation.navigate('EditExpense', { expenseId: expense.id })
              }
            />
            <IconButton
              icon="trash-can-outline"
              color={colors.danger}
              backgroundColor={colors.dangerBg}
              onPress={() => setConfirmDelete(true)}
            />
          </View>
        </View>

        <View style={{ alignItems: 'center', marginBottom: spacing.lg }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: radius.lg,
              backgroundColor: colors.primaryLight,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.sm,
            }}
          >
            <Icon name={meta.icon} size={30} color={colors.primary} />
          </View>
          <AppText variant="display">
            {formatCurrency(expense.amount, currency)}
          </AppText>
          <AppText variant="body" color="secondary">
            {meta.label}
          </AppText>
        </View>

        <Card style={{ marginBottom: spacing.md }}>
          <DetailRow label="Date" value={formatDate(expense.expenseDate)} />
          <DetailRow label="Category" value={meta.label} isLast={!expense.notes} />
          {expense.notes ? (
            <DetailRow label="Notes" value={expense.notes} isLast />
          ) : null}
        </Card>

        {expense.receiptUrl ? (
          <Card>
            <AppText variant="bodyMedium" style={{ marginBottom: spacing.sm }}>
              Receipt
            </AppText>
            <Image
              source={{ uri: expense.receiptUrl }}
              style={{
                width: '100%',
                height: 220,
                borderRadius: radius.sm,
                backgroundColor: colors.surfaceAlt,
              }}
              resizeMode="cover"
            />
          </Card>
        ) : null}

        <View style={{ height: spacing.xl }} />
      </Screen>

      <ConfirmModal
        visible={confirmDelete}
        title="Delete expense?"
        message="This action can't be undone."
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
};

const DetailRow: React.FC<{ label: string; value: string; isLast?: boolean }> = ({
  label,
  value,
  isLast,
}) => {
  const { colors, spacing } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing.xs,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.divider,
      }}
    >
      <AppText variant="body" color="muted">
        {label}
      </AppText>
      <AppText variant="bodyMedium">{value}</AppText>
    </View>
  );
};

export default ExpenseDetailsScreen;
