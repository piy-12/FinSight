import React, { useCallback, useEffect, useState } from 'react';
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
import { LoadingIndicator } from '../../components/common/LoadingIndicator';
import { ErrorState } from '../../components/common/ErrorState';
import { useTheme } from '../../theme/ThemeContext';
import { expenseService } from '../../services/api/expenseService';
import { parseApiError } from '../../services/api/client';
import { validators } from '../../utils/validators';
import { toISODateOnly } from '../../utils/formatters';
import { CATEGORY_META } from '../../constants/categories';
import { ExpenseCategory } from '../../types/models';
import { ExpenseStackParamList } from '../../types/navigation';

interface EditExpenseFormValues {
  amount: string;
  notes: string;
}

type Nav = NativeStackNavigationProp<ExpenseStackParamList, 'EditExpense'>;
type RouteProps = RouteProp<ExpenseStackParamList, 'EditExpense'>;

const EditExpenseScreen: React.FC = () => {
  const { colors, spacing, radius } = useTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const { expenseId } = route.params;

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [category, setCategory] = useState<ExpenseCategory>('FOOD');
  const [date, setDate] = useState<Date>(new Date());
  const [receiptUri, setReceiptUri] = useState<string | undefined>(undefined);
  const [categoryPickerVisible, setCategoryPickerVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { control, handleSubmit, reset } = useForm<EditExpenseFormValues>({
    defaultValues: { amount: '', notes: '' },
  });

  const loadExpense = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const expense = await expenseService.getExpenseById(expenseId);
      setCategory(expense.category);
      setDate(new Date(expense.expenseDate));
      setReceiptUri(expense.receiptUrl ?? undefined);
      reset({
        amount: String(expense.amount),
        notes: expense.notes ?? '',
      });
    } catch (err) {
      setLoadError(parseApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, [expenseId, reset]);

  useEffect(() => {
    loadExpense();
  }, [loadExpense]);

  const categoryMeta = CATEGORY_META[category];

  const pickReceipt = (fromCamera: boolean) => {
    const handler = fromCamera ? launchCamera : launchImageLibrary;
    handler({ mediaType: 'photo', quality: 0.7 }, response => {
      if (response.didCancel || response.errorCode) return;
      const uri = response.assets?.[0]?.uri;
      if (uri) setReceiptUri(uri);
    });
  };

  const onSubmit = async (values: EditExpenseFormValues) => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      await expenseService.updateExpense(expenseId, {
        amount: Number(values.amount),
        category,
        notes: values.notes?.trim() || undefined,
        expenseDate: toISODateOnly(date),
        receiptUrl: receiptUri,
      });
      navigation.goBack();
    } catch (error: any) {
      setSubmitError(error?.message ?? 'Unable to update expense.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingIndicator fullScreen />;
  }

  if (loadError) {
    return (
      <Screen>
        <ErrorState message={loadError} onRetry={loadExpense} />
      </Screen>
    );
  }

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
          <AppText variant="h2">Edit Expense</AppText>
        </View>
      </View>

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
        label="Save Changes"
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

export default EditExpenseScreen;
