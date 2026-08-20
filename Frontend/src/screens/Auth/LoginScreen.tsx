import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Screen } from '../../components/common/Screen';
import { AppText } from '../../components/common/AppText';
import { FormTextInput } from '../../components/inputs/FormTextInput';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { validators } from '../../utils/validators';
import { AuthStackParamList } from '../../types/navigation';

interface LoginFormValues {
  email: string;
  password: string;
}

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const navigation = useNavigation<Nav>();
  const { login } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      await login(values.email.trim(), values.password);
      // RootNavigator reacts to isAuthenticated automatically.
    } catch (error: any) {
      setSubmitError(error?.message ?? 'Unable to log in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <View style={[styles.iconWrap, { backgroundColor: colors.primaryLight }]}>
        <Icon name="chart-donut" size={30} color={colors.primary} />
      </View>

      <View style={{ marginTop: spacing.lg, marginBottom: spacing.xl }}>
        <AppText variant="h1">Welcome back</AppText>
        <View style={{ marginTop: spacing.xxs }}>
          <AppText variant="body" color="secondary">
            Log in to keep track of your spending.
          </AppText>
        </View>
      </View>

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
        placeholder="Enter your password"
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
        label="Log In"
        onPress={handleSubmit(onSubmit)}
        loading={submitting}
        style={{ marginTop: spacing.xs }}
      />

      <View style={[styles.footer, { marginTop: spacing.lg }]}>
        <AppText variant="body" color="secondary">
          Don&apos;t have an account?{' '}
        </AppText>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <AppText variant="bodyMedium" color="brand">
            Sign Up
          </AppText>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default LoginScreen;
