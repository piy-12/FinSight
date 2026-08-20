import React, { useState } from 'react';
import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../../components/common/Screen';
import { AppText } from '../../components/common/AppText';
import { FormTextInput } from '../../components/inputs/FormTextInput';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { IconButton } from '../../components/buttons/IconButton';
import { useTheme } from '../../theme/ThemeContext';
import { useProfileContext } from '../../context/ProfileContext';
import { validators } from '../../utils/validators';
import { ProfileStackParamList } from '../../types/navigation';

interface EditProfileFormValues {
  monthlyIncome: string;
  savingsGoal: string;
}

type Nav = NativeStackNavigationProp<ProfileStackParamList, 'EditProfile'>;

const EditProfileScreen: React.FC = () => {
  const { spacing } = useTheme();
  const navigation = useNavigation<Nav>();
  const { profile, updateProfile } = useProfileContext();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<EditProfileFormValues>({
    defaultValues: {
      monthlyIncome: profile ? String(profile.monthlyIncome) : '',
      savingsGoal: profile ? String(profile.savingsGoal) : '',
    },
  });

  const onSubmit = async (values: EditProfileFormValues) => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      await updateProfile(Number(values.monthlyIncome), Number(values.savingsGoal));
      navigation.goBack();
    } catch (error: any) {
      setSubmitError(error?.message ?? 'Unable to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen scroll>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: spacing.lg,
        }}
      >
        <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
        <View style={{ marginLeft: spacing.sm }}>
          <AppText variant="h2">Edit Profile</AppText>
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
      />

      {submitError ? (
        <View style={{ marginBottom: spacing.md }}>
          <AppText variant="caption" color="danger">
            {submitError}
          </AppText>
        </View>
      ) : null}

      <PrimaryButton
        label="Save Changes"
        onPress={handleSubmit(onSubmit)}
        loading={submitting}
      />
    </Screen>
  );
};

export default EditProfileScreen;
