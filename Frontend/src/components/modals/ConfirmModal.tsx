import React from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { AppText } from '../common/AppText';
import { PrimaryButton } from '../buttons/PrimaryButton';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const { colors, spacing, radius } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.overlay,
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing.lg,
        }}
      >
        <View
          style={{
            width: '100%',
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            padding: spacing.lg,
          }}
        >
          <AppText variant="h3" style={{ marginBottom: spacing.xs }}>
            {title}
          </AppText>
          <AppText variant="body" color="secondary" style={{ marginBottom: spacing.lg }}>
            {message}
          </AppText>

          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <View style={{ flex: 1 }}>
              <PrimaryButton
                label={cancelLabel}
                variant="ghost"
                onPress={onCancel}
                disabled={loading}
              />
            </View>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                disabled={loading}
                onPress={onConfirm}
                style={{
                  minHeight: 48,
                  borderRadius: radius.md,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: destructive ? colors.danger : colors.primary,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                <AppText
                  variant="bodyMedium"
                  style={{ color: colors.onPrimary }}
                >
                  {confirmLabel}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
