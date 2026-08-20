import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../theme/ThemeContext';
import { AppText } from './AppText';
import { PrimaryButton } from '../buttons/PrimaryButton';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox-outline',
  title,
  description,
  actionLabel,
  onAction,
}) => {
  const { colors, spacing, radius } = useTheme();

  return (
    <View style={[styles.container, { padding: spacing.xl }]}>
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: colors.surfaceAlt,
            borderRadius: radius.pill,
            marginBottom: spacing.md,
          },
        ]}
      >
        <Icon name={icon} size={36} color={colors.textMuted} />
      </View>
      <AppText variant="h3" align="center">
        {title}
      </AppText>
      {description ? (
        <View style={{ marginTop: spacing.xxs }}>
          <AppText variant="body" color="secondary" align="center">
            {description}
          </AppText>
        </View>
      ) : null}
      {actionLabel && onAction ? (
        <View style={{ marginTop: spacing.lg, alignSelf: 'stretch' }}>
          <PrimaryButton label={actionLabel} onPress={onAction} />
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
  iconWrap: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
