import React, { PropsWithChildren } from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface CardProps extends PropsWithChildren {
  style?: ViewStyle;
  onPress?: () => void;
  padded?: boolean;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  padded = true,
  elevated = true,
}) => {
  const { colors, spacing, radius, shadow } = useTheme();

  const containerStyle: ViewStyle = {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: elevated ? 0 : 1,
    borderColor: colors.border,
    padding: padded ? spacing.md : 0,
    ...(elevated ? shadow.sm : {}),
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={[containerStyle, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[containerStyle, style]}>{children}</View>;
};
