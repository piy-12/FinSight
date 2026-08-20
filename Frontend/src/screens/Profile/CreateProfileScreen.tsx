import React, { useState } from 'react';
import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Screen } from '../../components/common/Screen';
import { AppText } from '../../components/common/AppText';
import { FormTextInput } from '../../components/inputs/FormTextInput';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { useTheme } from '../../theme/ThemeContext';
import { useProfileContext } from '../../context/ProfileContext';
import { validators } from '../../utils/validators';

interface ProfileFormValues {
  monthlyIncome: string;
  savingsGoal: string;
}

const CreateProfileScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const { createProfile } = useProfileContext();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<ProfileFormValues>({
    defaultValues: { monthlyIncome: '', savingsGoal: '' },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      await createProfile(Number(values.monthlyIncome), Number(values.savingsGoal));
      // RootNavigator watches profile state upstream and will move to Main
      // once this screen's parent re-checks — see MainGate below.
    } catch (error: any) {
      setSubmitError(
        error?.message ?? 'Unable to save your profile. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen scroll contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <View style={{ alignItems: 'center', marginBottom: spacing.xl }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            backgroundColor: colors.primaryLight,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing.md,
          }}
        >
          <Icon name="wallet-outline" size={30} color={colors.primary} />
        </View>
        <AppText variant="h1" align="center">
          Set up your budget
        </AppText>
        <View style={{ marginTop: spacing.xxs, paddingHorizontal: spacing.md }}>
          <AppText variant="body" color="secondary" align="center">
            Tell us your monthly income and savings goal — FinSight uses this
            to track your spending budget.
          </AppText>
        </View>
      </View>

      <FormTextInput
        control={control}
        name="monthlyIncome"
        label="Monthly Income"
        icon="cash"
        placeholder="e.g. 4000"
        keyboardType="decimal-pad"
        rules={validators.positiveAmount}
      />
      <FormTextInput
        control={control}
        name="savingsGoal"
        label="Monthly Savings Goal"
        icon="piggy-bank-outline"
        placeholder="e.g. 500"
        keyboardType="decimal-pad"
        rules={validators.positiveAmount}
        helperText="Spending budget = income − savings goal"
      />

      {submitError ? (
        <View style={{ marginBottom: spacing.md }}>
          <AppText variant="caption" color="danger">
            {submitError}
          </AppText>
        </View>
      ) : null}

      <PrimaryButton
        label="Continue"
        onPress={handleSubmit(onSubmit)}
        loading={submitting}
      />
    </Screen>
  );
};

export default CreateProfileScreen;
