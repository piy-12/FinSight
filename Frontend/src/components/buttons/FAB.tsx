import React from 'react';
import { GestureResponderEvent, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../theme/ThemeContext';

interface FABProps {
  icon?: string;
  onPress: (e: GestureResponderEvent) => void;
}

export const FAB: React.FC<FABProps> = ({ icon = 'plus', onPress }) => {
  const { colors, shadow } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.fab,
        { backgroundColor: colors.primary },
        shadow.lg,
      ]}
      accessibilityLabel="Add expense"
      accessibilityRole="button"
    >
      <Icon name={icon} size={28} color={colors.onPrimary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
