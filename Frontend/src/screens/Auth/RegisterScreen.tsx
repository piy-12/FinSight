import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../../components/common/Screen';
import { AppText } from '../../components/common/AppText';
import { FormTextInput } from '../../components/inputs/FormTextInput';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { IconButton } from '../../components/buttons/IconButton';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { validators } from '../../utils/validators';
import { AuthStackParamList } from '../../types/navigation';

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const { spacing } = useTheme();
  const navigation = useNavigation<Nav>();
  const { register } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<RegisterFormValues>({
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      await register(values.name.trim(), values.email.trim(), values.password);
      // After register+login succeeds, AuthContext flips isAuthenticated,
      // and RootNavigator sends the user into CreateProfile (no profile yet).
    } catch (error: any) {
      setSubmitError(
        error?.message ?? 'Unable to create your account. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <IconButton
        icon="arrow-left"
        onPress={() => navigation.goBack()}
        style={{ alignSelf: 'flex-start', marginBottom: spacing.lg }}
        accessibilityLabel="Go back"
      />

      <View style={{ marginBottom: spacing.xl }}>
        <AppText variant="h1">Create your account</AppText>
        <View style={{ marginTop: spacing.xxs }}>
          <AppText variant="body" color="secondary">
            Start tracking your expenses in minutes.
          </AppText>
        </View>
      </View>

      <FormTextInput
        control={control}
        name="name"
        label="Full Name"
        icon="account-outline"
        placeholder="Jane Doe"
        rules={validators.name}
      />
      <FormTextInput
        control={control}
        name="email"
        label="Email"
        icon="email-outline"
        placeholder="you@example.com"
        keyboardType="email-address"
        rules={validators.email}
      />
      <FormTextInput
        control={control}
        name="password"
        label="Password"
        icon="lock-outline"
        placeholder="At least 6 characters"
        isPassword
        rules={validators.password}
      />

      {submitError ? (
        <View style={{ marginBottom: spacing.md }}>
          <AppText variant="caption" color="danger">
            {submitError}
          </AppText>
        </View>
      ) : null}

      <PrimaryButton
        label="Sign Up"
        onPress={handleSubmit(onSubmit)}
        loading={submitting}
        style={{ marginTop: spacing.xs }}
      />

      <View style={[styles.footer, { marginTop: spacing.lg }]}>
        <AppText variant="body" color="secondary">
          Already have an account?{' '}
        </AppText>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <AppText variant="bodyMedium" color="brand">
            Log In
          </AppText>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: { flexGrow: 1, justifyContent: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'center' },
});

export default RegisterScreen;
