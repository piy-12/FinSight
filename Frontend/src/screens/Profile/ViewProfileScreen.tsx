import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Screen } from '../../components/common/Screen';
import { AppText } from '../../components/common/AppText';
import { Card } from '../../components/cards/Card';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { LoadingIndicator } from '../../components/common/LoadingIndicator';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useProfileContext } from '../../context/ProfileContext';
import { ProfileStackParamList } from '../../types/navigation';
import { formatCurrency } from '../../utils/formatters';

type Nav = NativeStackNavigationProp<ProfileStackParamList, 'ViewProfile'>;

const ViewProfileScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const { profile, loading, refresh } = useProfileContext();

  if (loading && !profile) {
    return <LoadingIndicator fullScreen />;
  }

  const initials = (user?.name ?? '?')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Screen scroll refreshing={loading} onRefresh={refresh}>
      <View style={{ alignItems: 'center', marginBottom: spacing.xl }}>
        <View
          style={{
            width: 84,
            height: 84,
            borderRadius: 42,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing.sm,
          }}
        >
          <AppText variant="h1" style={{ color: colors.onPrimary }}>
            {initials}
          </AppText>
        </View>
        <AppText variant="h2">{user?.name}</AppText>
        <AppText variant="body" color="secondary">
          {user?.email}
        </AppText>
      </View>

      <Card style={{ marginBottom: spacing.md }}>
        <AppText variant="bodyMedium" color="secondary" style={{ marginBottom: spacing.sm }}>
          Budget Overview
        </AppText>
        <StatRow
          icon="cash"
          label="Monthly Income"
          value={formatCurrency(profile?.monthlyIncome ?? 0, profile?.currency)}
        />
        <StatRow
          icon="piggy-bank-outline"
          label="Savings Goal"
          value={formatCurrency(profile?.savingsGoal ?? 0, profile?.currency)}
        />
        <StatRow
          icon="wallet-outline"
          label="Spending Budget"
          value={formatCurrency(profile?.spendingBudget ?? 0, profile?.currency)}
          isLast
        />
      </Card>

      <PrimaryButton
        label="Edit Profile"
        icon="pencil-outline"
        variant="outline"
        onPress={() => navigation.navigate('EditProfile')}
      />
    </Screen>
  );
};

const StatRow: React.FC<{
  icon: string;
  label: string;
  value: string;
  isLast?: boolean;
}> = ({ icon, label, value, isLast }) => {
  const { colors, spacing, radius } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.divider,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: radius.sm,
          backgroundColor: colors.surfaceAlt,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: spacing.sm,
        }}
      >
        <Icon name={icon} size={18} color={colors.primary} />
      </View>
      <AppText variant="body" style={{ flex: 1 }} color="secondary">
        {label}
      </AppText>
      <AppText variant="bodyMedium">{value}</AppText>
    </View>
  );
};

export default ViewProfileScreen;
