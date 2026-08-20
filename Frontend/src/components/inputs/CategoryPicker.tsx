import React from 'react';
import { FlatList, Modal, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../theme/ThemeContext';
import { AppText } from '../common/AppText';
import { EXPENSE_CATEGORIES, ExpenseCategory } from '../../types/models';
import { CATEGORY_META } from '../../constants/categories';

interface CategoryPickerProps {
  visible: boolean;
  selected?: ExpenseCategory;
  onSelect: (category: ExpenseCategory) => void;
  onClose: () => void;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  visible,
  selected,
  onSelect,
  onClose,
}) => {
  const { colors, spacing, radius } = useTheme();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: colors.overlay }}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={{ flex: 1 }} />
        <TouchableOpacity activeOpacity={1}>
          <View
            style={{
              backgroundColor: colors.surface,
              borderTopLeftRadius: radius.lg,
              borderTopRightRadius: radius.lg,
              padding: spacing.md,
              maxHeight: '70%',
            }}
          >
            <View
              style={{
                alignSelf: 'center',
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: colors.border,
                marginBottom: spacing.md,
              }}
            />
            <AppText variant="h3" style={{ marginBottom: spacing.sm }}>
              Select Category
            </AppText>
            <FlatList
              data={EXPENSE_CATEGORIES}
              keyExtractor={item => item}
              renderItem={({ item }) => {
                const meta = CATEGORY_META[item];
                const isSelected = item === selected;
                return (
                  <TouchableOpacity
                    onPress={() => {
                      onSelect(item);
                      onClose();
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: spacing.sm,
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: radius.sm,
                        backgroundColor: isSelected
                          ? colors.primaryLight
                          : colors.surfaceAlt,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: spacing.sm,
                      }}
                    >
                      <Icon
                        name={meta.icon}
                        size={18}
                        color={isSelected ? colors.primary : colors.textSecondary}
                      />
                    </View>
                    <AppText
                      variant={isSelected ? 'bodyMedium' : 'body'}
                      style={{ flex: 1 }}
                    >
                      {meta.label}
                    </AppText>
                    {isSelected ? (
                      <Icon name="check" size={20} color={colors.primary} />
                    ) : null}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
