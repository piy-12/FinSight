import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../theme/ThemeContext';
import { AppText } from '../common/AppText';

interface FormTextInputProps<T extends FieldValues>
  extends Omit<TextInputProps, 'style'> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  icon?: string;
  isPassword?: boolean;
  helperText?: string;
  rules?: RegisterOptions<T, Path<T>>;
}

export function FormTextInput<T extends FieldValues>({
  control,
  name,
  label,
  icon,
  isPassword = false,
  helperText,
  rules,
  ...inputProps
}: FormTextInputProps<T>) {
  const { colors, spacing, radius, typography } = useTheme();
  const [secure, setSecure] = useState(isPassword);
  const [focused, setFocused] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={{ marginBottom: spacing.md }}>
          {label ? (
            <View style={{ marginBottom: spacing.xxs }}>
              <AppText variant="bodyMedium" color="secondary">
                {label}
              </AppText>
            </View>
          ) : null}

          <View
            style={[
              styles.inputWrap,
              {
                backgroundColor: colors.inputBg,
                borderRadius: radius.sm,
                borderColor: error
                  ? colors.danger
                  : focused
                  ? colors.primary
                  : colors.border,
                paddingHorizontal: spacing.sm,
              },
            ]}
          >
            {icon ? (
              <Icon
                name={icon}
                size={20}
                color={colors.textMuted}
                style={{ marginRight: spacing.xs }}
              />
            ) : null}
            <TextInput
              style={[
                styles.input,
                { color: colors.textPrimary, ...typography.bodyLarge },
              ]}
              value={value !== undefined && value !== null ? String(value) : ''}
              onChangeText={onChange}
              onBlur={() => {
                onBlur();
                setFocused(false);
              }}
              onFocus={() => setFocused(true)}
              placeholderTextColor={colors.textMuted}
              secureTextEntry={secure}
              autoCapitalize="none"
              {...inputProps}
            />
            {isPassword ? (
              <TouchableOpacity onPress={() => setSecure(s => !s)} hitSlop={8}>
                <Icon
                  name={secure ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            ) : null}
          </View>

          {error ? (
            <View style={{ marginTop: spacing.xxs }}>
              <AppText variant="caption" color="danger">
                {error.message}
              </AppText>
            </View>
          ) : helperText ? (
            <View style={{ marginTop: spacing.xxs }}>
              <AppText variant="caption" color="muted">
                {helperText}
              </AppText>
            </View>
          ) : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    minHeight: 52,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
});
