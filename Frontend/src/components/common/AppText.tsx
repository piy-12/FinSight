import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

type Variant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bodyLarge'
  | 'body'
  | 'bodyMedium'
  | 'caption'
  | 'overline'
  | 'numericLarge'
  | 'numericMedium';

type ColorVariant =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'inverse'
  | 'success'
  | 'danger'
  | 'warning'
  | 'brand';

interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: ColorVariant;
  align?: TextStyle['textAlign'];
}

export const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  color = 'primary',
  align,
  style,
  children,
  ...rest
}) => {
  const { colors, typography } = useTheme();

  const colorMap: Record<ColorVariant, string> = {
    primary: colors.textPrimary,
    secondary: colors.textSecondary,
    muted: colors.textMuted,
    inverse: colors.textInverse,
    success: colors.success,
    danger: colors.danger,
    warning: colors.warning,
    brand: colors.primary,
  };

  return (
    <Text
      style={[
        typography[variant],
        { color: colorMap[color], textAlign: align },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};
