import React, { PropsWithChildren } from 'react';
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';

interface ScreenProps extends PropsWithChildren {
  scroll?: boolean;
  padded?: boolean;
  edges?: Edge[];
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  scroll = false,
  padded = true,
  edges = ['top', 'left', 'right'],
  style,
  contentContainerStyle,
  refreshing,
  onRefresh,
}) => {
  const { colors, spacing, isDark } = useTheme();

  const containerStyle = [
    styles.flex,
    { backgroundColor: colors.background },
    style,
  ];

  const inner = padded ? { padding: spacing.md } : undefined;

  return (
    <SafeAreaView style={containerStyle} edges={edges}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[inner, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={!!refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, inner, contentContainerStyle]}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
