import React, { useState } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../theme/ThemeContext';
import { AppText } from '../common/AppText';
import { formatDate } from '../../utils/formatters';

interface DateInputProps {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  maximumDate?: Date;
}

export const DateInput: React.FC<DateInputProps> = ({
  label,
  value,
  onChange,
  maximumDate = new Date(),
}) => {
  const { colors, spacing, radius } = useTheme();
  const [show, setShow] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    // Android closes the picker itself after a selection/dismiss event.
    if (Platform.OS === 'android') {
      setShow(false);
    }
    if (event.type === 'set' && selected) {
      onChange(selected);
    }
  };

  return (
    <View style={{ marginBottom: spacing.md }}>
      {label ? (
        <View style={{ marginBottom: spacing.xxs }}>
          <AppText variant="bodyMedium" color="secondary">
            {label}
          </AppText>
        </View>
      ) : null}
      <TouchableOpacity
        onPress={() => setShow(true)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.inputBg,
          borderRadius: radius.sm,
          borderWidth: 1.5,
          borderColor: colors.border,
          paddingHorizontal: spacing.sm,
          minHeight: 52,
        }}
      >
        <Icon
          name="calendar-outline"
          size={20}
          color={colors.textMuted}
          style={{ marginRight: spacing.xs }}
        />
        <AppText variant="bodyLarge">{formatDate(value)}</AppText>
      </TouchableOpacity>

      {show ? (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleChange}
          maximumDate={maximumDate}
        />
      ) : null}
    </View>
  );
};
