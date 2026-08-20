import React, { useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Screen } from '../../components/common/Screen';
import { AppText } from '../../components/common/AppText';
import { FormTextInput } from '../../components/inputs/FormTextInput';
import { DateInput } from '../../components/inputs/DateInput';
import { CategoryPicker } from '../../components/inputs/CategoryPicker';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { IconButton } from '../../components/buttons/IconButton';
import { useTheme } from '../../theme/ThemeContext';
import { useExpenses } from '../../hooks/useExpenses';
import { validators } from '../../utils/validators';
import { toISODateOnly } from '../../utils/formatters';
import { CATEGORY_META } from '../../constants/categories';
import { ExpenseCategory } from '../../types/models';
import { ExpenseStackParamList } from '../../types/navigation';

interface AddExpenseFormValues {
  amount: string;
  notes: string;
}

type Nav = NativeStackNavigationProp<ExpenseStackParamList, 'AddExpense'>;
type RouteProps = RouteProp<ExpenseStackParamList, 'AddExpense'>;

const AddExpenseScreen: React.FC = () => {
  const { colors, spacing, radius } = useTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const prefill = route.params?.prefill;
  // NOTE: the backend has no file-upload endpoint — expenses only accept a
  // `receiptUrl` string. We pass through the local device URI so the receipt
  // is at least viewable within this app; wire this up to real storage
  // (S3/Cloudinary/etc.) once that endpoint exists on the backend.
  const [receiptUri, setReceiptUri] = useState<string | undefined>(
    route.params?.receiptUri,
  );

  const { createExpense } = useExpenses(false);
  const [category, setCategory] = useState<ExpenseCategory>(
    (prefill?.category as ExpenseCategory) ?? 'FOOD',
  );
  const [date, setDate] = useState<Date>(
    prefill?.expenseDate ? new Date(prefill.expenseDate) : new Date(),
  );
  const [categoryPickerVisible, setCategoryPickerVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<AddExpenseFormValues>({
    defaultValues: {
      amount: prefill?.amount ? String(prefill.amount) : '',
      notes: prefill?.notes ?? '',
    },
  });

  const categoryMeta = CATEGORY_META[category];

  const pickReceipt = (fromCamera: boolean) => {
    const handler = fromCamera ? launchCamera : launchImageLibrary;
    handler({ mediaType: 'photo', quality: 0.7 }, response => {
      if (response.didCancel || response.errorCode) return;
      const uri = response.assets?.[0]?.uri;
      if (uri) setReceiptUri(uri);
    });
  };

  const onSubmit = async (values: AddExpenseFormValues) => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      await createExpense({
        amount: Number(values.amount),
        category,
        notes: values.notes?.trim() || undefined,
        expenseDate: toISODateOnly(date),
        receiptUrl: receiptUri,
      });
      navigation.goBack();
    } catch (error: any) {
      setSubmitError(error?.message ?? 'Unable to save expense.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen scroll>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: spacing.lg,
        }}
      >
        <IconButton icon="close" onPress={() => navigation.goBack()} />
        <View style={{ marginLeft: spacing.sm }}>
          <AppText variant="h2">Add Expense</AppText>
        </View>
      </View>

      {prefill ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.successBg,
            borderRadius: radius.sm,
            padding: spacing.sm,
            marginBottom: spacing.md,
          }}
        >
          <Icon name="text-recognition" size={18} color={colors.success} />
          <View style={{ marginLeft: spacing.xs, flex: 1 }}>
            <AppText variant="caption" color="success">
              Details filled from your receipt scan — review before saving.
            </AppText>
          </View>
        </View>
      ) : null}

      <FormTextInput
        control={control}
        name="amount"
        label="Amount"
        icon="currency-usd"
        placeholder="0.00"
        keyboardType="decimal-pad"
        rules={validators.positiveAmount}
      />

      <View style={{ marginBottom: spacing.md }}>
        <AppText variant="bodyMedium" color="secondary" style={{ marginBottom: spacing.xxs }}>
          Category
        </AppText>
        <TouchableOpacity
          onPress={() => setCategoryPickerVisible(true)}
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
            name={categoryMeta.icon}
            size={20}
            color={colors.primary}
            style={{ marginRight: spacing.xs }}
          />
          <AppText variant="bodyLarge" style={{ flex: 1 }}>
            {categoryMeta.label}
          </AppText>
          <Icon name="chevron-down" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <DateInput label="Date" value={date} onChange={setDate} />

      <FormTextInput
        control={control}
        name="notes"
        label="Notes (optional)"
        icon="note-text-outline"
        placeholder="What was this for?"
        multiline
      />

      <View style={{ marginBottom: spacing.lg }}>
        <AppText variant="bodyMedium" color="secondary" style={{ marginBottom: spacing.xxs }}>
          Receipt (optional)
        </AppText>
        {receiptUri ? (
          <View>
            <Image
              source={{ uri: receiptUri }}
              style={{
                width: '100%',
                height: 180,
                borderRadius: radius.sm,
                marginBottom: spacing.xs,
              }}
              resizeMode="cover"
            />
            <PrimaryButton
              label="Remove Receipt"
              variant="ghost"
              onPress={() => setReceiptUri(undefined)}
            />
          </View>
        ) : (
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <View style={{ flex: 1 }}>
              <PrimaryButton
                label="Camera"
                icon="camera-outline"
                variant="outline"
                onPress={() => pickReceipt(true)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <PrimaryButton
                label="Gallery"
                icon="image-outline"
                variant="outline"
                onPress={() => pickReceipt(false)}
              />
            </View>
          </View>
        )}
      </View>

      {submitError ? (
        <View style={{ marginBottom: spacing.md }}>
          <AppText variant="caption" color="danger">
            {submitError}
          </AppText>
        </View>
      ) : null}

      <PrimaryButton
        label="Save Expense"
        onPress={handleSubmit(onSubmit)}
        loading={submitting}
      />
      <View style={{ height: spacing.xl }} />

      <CategoryPicker
        visible={categoryPickerVisible}
        selected={category}
        onSelect={setCategory}
        onClose={() => setCategoryPickerVisible(false)}
      />
    </Screen>
  );
};

export default AddExpenseScreen;
