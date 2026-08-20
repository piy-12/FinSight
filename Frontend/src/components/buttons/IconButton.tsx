import React from 'react';
import { GestureResponderEvent, TouchableOpacity, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../theme/ThemeContext';

interface IconButtonProps {
  icon: string;
  onPress: (e: GestureResponderEvent) => void;
  size?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 22,
  color,
  backgroundColor,
  style,
  accessibilityLabel,
}) => {
  const { colors, radius } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      style={[
        {
          width: size + 24,
          height: size + 24,
          borderRadius: radius.pill,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: backgroundColor ?? colors.surfaceAlt,
        },
        style,
      ]}
    >
      <Icon name={icon} size={size} color={color ?? colors.textPrimary} />
    </TouchableOpacity>
  );
};
