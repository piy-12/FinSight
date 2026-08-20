import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { AppText } from './AppText';

interface LoadingIndicatorProps {
  fullScreen?: boolean;
  label?: string;
  size?: 'small' | 'large';
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  fullScreen = false,
  label,
  size = 'large',
}) => {
  const { colors, spacing } = useTheme();

  return (
    <View
      style={[
        styles.container,
        fullScreen && { flex: 1, backgroundColor: colors.background },
        { padding: spacing.lg },
      ]}
    >
      <ActivityIndicator size={size} color={colors.primary} />
      {label ? (
        <View style={{ marginTop: spacing.sm }}>
          <AppText variant="body" color="muted" align="center">
            {label}
          </AppText>
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
