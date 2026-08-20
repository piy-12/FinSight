import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../theme/ThemeContext';
import { AppText } from './AppText';
import { PrimaryButton } from '../buttons/PrimaryButton';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Please check your connection and try again.',
  onRetry,
}) => {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { padding: spacing.xl }]}>
      <Icon name="alert-circle-outline" size={40} color={colors.danger} />
      <View style={{ marginTop: spacing.md }}>
        <AppText variant="h3" align="center">
          {title}
        </AppText>
      </View>
      <View style={{ marginTop: spacing.xxs }}>
        <AppText variant="body" color="secondary" align="center">
          {message}
        </AppText>
      </View>
      {onRetry ? (
        <View style={{ marginTop: spacing.lg, alignSelf: 'stretch' }}>
          <PrimaryButton label="Try Again" onPress={onRetry} variant="outline" />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
