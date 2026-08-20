import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../theme/ThemeContext';
import { AppText } from '../common/AppText';
import { Expense } from '../../types/models';
import { CATEGORY_META } from '../../constants/categories';
import { formatCurrency, formatDateShort } from '../../utils/formatters';

interface ExpenseListItemProps {
  expense: Expense;
  currency?: string;
  onPress?: () => void;
}

export const ExpenseListItem: React.FC<ExpenseListItemProps> = ({
  expense,
  currency = 'USD',
  onPress,
}) => {
  const { colors, spacing, radius } = useTheme();
  const meta = CATEGORY_META[expense.category] ?? {
    label: expense.category,
    icon: 'shape-outline',
  };

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: radius.sm,
          backgroundColor: colors.surfaceAlt,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: spacing.sm,
        }}
      >
        <Icon name={meta.icon} size={20} color={colors.primary} />
      </View>

      <View style={{ flex: 1 }}>
        <AppText variant="bodyMedium" numberOfLines={1}>
          {meta.label}
        </AppText>
        <AppText variant="caption" color="muted">
          {formatDateShort(expense.expenseDate)}
          {expense.notes ? `  ·  ${expense.notes}` : ''}
        </AppText>
      </View>

      <AppText variant="bodyMedium">
        {formatCurrency(expense.amount, currency)}
      </AppText>
    </TouchableOpacity>
  );
};
