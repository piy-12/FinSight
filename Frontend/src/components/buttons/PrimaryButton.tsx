import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../theme/ThemeContext';
import { AppText } from '../common/AppText';

type Variant = 'solid' | 'outline' | 'ghost' | 'danger';

interface PrimaryButtonProps {
  label: string;
  onPress: (e: GestureResponderEvent) => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  variant = 'solid',
  disabled = false,
  loading = false,
  icon,
  style,
  fullWidth = true,
}) => {
  const { colors, spacing, radius } = useTheme();
  const isDisabled = disabled || loading;

  const backgroundColor =
    variant === 'solid'
      ? colors.primary
      : variant === 'danger'
      ? colors.danger
      : 'transparent';

  const borderColor = variant === 'outline' ? colors.primary : 'transparent';

  const textColor =
    variant === 'solid' || variant === 'danger'
      ? colors.onPrimary
      : variant === 'outline'
      ? colors.primary
      : colors.textSecondary;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={isDisabled}
      onPress={onPress}
      style={[
        styles.base,
        {
          backgroundColor,
          borderColor,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          borderRadius: radius.md,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          opacity: isDisabled ? 0.6 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {icon ? (
            <Icon
              name={icon}
              size={18}
              color={textColor}
              style={{ marginRight: spacing.xxs }}
            />
          ) : null}
          <AppText
            variant="bodyMedium"
            style={{ color: textColor }}
            align="center"
          >
            {label}
          </AppText>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
});
