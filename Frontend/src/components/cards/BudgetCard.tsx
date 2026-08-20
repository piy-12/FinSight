import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../theme/ThemeContext';
import { AppText } from '../common/AppText';
import { Card } from './Card';
import { formatCurrency } from '../../utils/formatters';

interface BudgetCardProps {
  label: string;
  amount: number;
  currency?: string;
  icon: string;
  tone: 'primary' | 'success' | 'danger' | 'warning';
}

export const BudgetCard: React.FC<BudgetCardProps> = ({
  label,
  amount,
  currency = 'USD',
  icon,
  tone,
}) => {
  const { colors, spacing, radius } = useTheme();

  const toneColor = {
    primary: colors.primary,
    success: colors.success,
    danger: colors.danger,
    warning: colors.warning,
  }[tone];

  const toneBg = {
    primary: colors.primaryLight,
    success: colors.successBg,
    danger: colors.dangerBg,
    warning: colors.warningBg,
  }[tone];

  return (
    <Card style={{ flex: 1 }}>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: radius.sm,
          backgroundColor: toneBg,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing.xs,
        }}
      >
        <Icon name={icon} size={18} color={toneColor} />
      </View>
      <AppText variant="caption" color="muted">
        {label}
      </AppText>
      <View style={{ marginTop: 2 }}>
        <AppText variant="numericMedium" numberOfLines={1} adjustsFontSizeToFit>
          {formatCurrency(amount, currency)}
        </AppText>
      </View>
    </Card>
  );
};
