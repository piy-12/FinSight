import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../theme/ThemeContext';
import { AppText } from '../../components/common/AppText';
import { useAuth } from '../../context/AuthContext';

/**
 * Splash simply shows brand while AuthContext finishes bootstrapping from
 * AsyncStorage. RootNavigator (not this screen) decides where to go next
 * based on `isLoading` / `isAuthenticated` — this screen just needs to exist
 * as the initial route so there's no blank flash.
 */
const SplashScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const { isLoading } = useAuth();
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fade]);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <Animated.View style={[styles.brand, { opacity: fade }]}>
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: colors.onPrimary, marginBottom: spacing.md },
          ]}
        >
          <Icon name="chart-donut" size={40} color={colors.primary} />
        </View>
        <AppText
          variant="h1"
          style={{ color: colors.onPrimary }}
          align="center"
        >
          FinSight
        </AppText>
        <AppText
          variant="body"
          style={{ color: colors.primaryLight }}
          align="center"
        >
          Know where your money goes
        </AppText>
      </Animated.View>
      {isLoading ? null : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    alignItems: 'center',
  },
  iconWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SplashScreen;
