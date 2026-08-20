import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Screen } from '../../components/common/Screen';
import { AppText } from '../../components/common/AppText';
import { Card } from '../../components/cards/Card';
import { ConfirmModal } from '../../components/modals/ConfirmModal';
import { useTheme, ThemeMode } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: string }[] = [
  { mode: 'light', label: 'Light', icon: 'white-balance-sunny' },
  { mode: 'dark', label: 'Dark', icon: 'weather-night' },
  { mode: 'system', label: 'System', icon: 'cellphone-cog' },
];

const SettingsScreen: React.FC = () => {
  const { colors, spacing, radius, mode, setMode } = useTheme();
  const { logout, user } = useAuth();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
    setConfirmLogout(false);
  };

  return (
    <>
      <Screen scroll>
        <AppText variant="h1" style={{ marginBottom: spacing.lg }}>
          Settings
        </AppText>

        <Card style={{ marginBottom: spacing.md }}>
          <AppText variant="bodyMedium" color="secondary" style={{ marginBottom: spacing.sm }}>
            Appearance
          </AppText>
          {THEME_OPTIONS.map((opt, index) => {
            const selected = mode === opt.mode;
            return (
              <TouchableOpacity
                key={opt.mode}
                onPress={() => setMode(opt.mode)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: spacing.sm,
                  borderBottomWidth: index !== THEME_OPTIONS.length - 1 ? 1 : 0,
                  borderBottomColor: colors.divider,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: radius.sm,
                    backgroundColor: selected ? colors.primaryLight : colors.surfaceAlt,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: spacing.sm,
                  }}
                >
                  <Icon
                    name={opt.icon}
                    size={18}
                    color={selected ? colors.primary : colors.textSecondary}
                  />
                </View>
                <AppText variant="body" style={{ flex: 1 }}>
                  {opt.label}
                </AppText>
                {selected ? (
                  <Icon name="check" size={20} color={colors.primary} />
                ) : null}
              </TouchableOpacity>
            );
          })}
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <AppText variant="bodyMedium" color="secondary" style={{ marginBottom: spacing.sm }}>
            Account
          </AppText>
          <AppText variant="body">{user?.name}</AppText>
          <AppText variant="caption" color="muted">
            {user?.email}
          </AppText>
        </Card>

        <TouchableOpacity
          onPress={() => setConfirmLogout(true)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: spacing.sm,
          }}
        >
          <Icon name="logout" size={18} color={colors.danger} />
          <View style={{ marginLeft: spacing.xs }}>
            <AppText variant="bodyMedium" color="danger">
              Log Out
            </AppText>
          </View>
        </TouchableOpacity>
      </Screen>

      <ConfirmModal
        visible={confirmLogout}
        title="Log out?"
        message="You'll need to log in again to access your account."
        confirmLabel="Log Out"
        destructive
        loading={loggingOut}
        onConfirm={handleLogout}
        onCancel={() => setConfirmLogout(false)}
      />
    </>
  );
};

export default SettingsScreen;
