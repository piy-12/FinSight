import React, { useState } from 'react';
import { Image, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Screen } from '../../components/common/Screen';
import { AppText } from '../../components/common/AppText';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { IconButton } from '../../components/buttons/IconButton';
import { Card } from '../../components/cards/Card';
import { LoadingIndicator } from '../../components/common/LoadingIndicator';
import { useTheme } from '../../theme/ThemeContext';
import { ExpenseStackParamList } from '../../types/navigation';
import {
  parseAmountFromReceipt,
  parseDateFromReceipt,
  suggestCategoryFromReceipt,
} from '../../utils/ocrParser';
import { CATEGORY_META } from '../../constants/categories';
import { toISODateOnly } from '../../utils/formatters';

type Nav = NativeStackNavigationProp<ExpenseStackParamList, 'OCRScan'>;

type Stage = 'pick' | 'scanning' | 'reviewing' | 'error';

const OCRScanScreen: React.FC = () => {
  const { colors, spacing, radius } = useTheme();
  const navigation = useNavigation<Nav>();

  const [stage, setStage] = useState<Stage>('pick');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [amount, setAmount] = useState<number | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [category, setCategory] = useState<ReturnType<typeof suggestCategoryFromReceipt>>('OTHER');
  const [errorMessage, setErrorMessage] = useState('');

  const runOCR = async (uri: string) => {
    setImageUri(uri);
    setStage('scanning');
    try {
      const result = await TextRecognition.recognize(uri);
      const text = result.text ?? '';
      setExtractedText(text);
      setAmount(parseAmountFromReceipt(text));
      setDate(parseDateFromReceipt(text));
      setCategory(suggestCategoryFromReceipt(text));
      setStage('reviewing');
    } catch {
      setErrorMessage(
        'Could not read text from this image. Try a clearer, well-lit photo.',
      );
      setStage('error');
    }
  };

  const pickImage = (fromCamera: boolean) => {
    const handler = fromCamera ? launchCamera : launchImageLibrary;
    handler({ mediaType: 'photo', quality: 0.9 }, response => {
      if (response.didCancel || response.errorCode) return;
      const uri = response.assets?.[0]?.uri;
      if (uri) runOCR(uri);
    });
  };

  const useDetails = () => {
    navigation.navigate('AddExpense', {
      receiptUri: imageUri ?? undefined,
      prefill: {
        amount: amount ?? undefined,
        category,
        expenseDate: date ? toISODateOnly(date) : undefined,
      },
    });
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
          <AppText variant="h2">Scan Receipt</AppText>
        </View>
      </View>

      {stage === 'pick' && (
        <View>
          <View
            style={{
              alignItems: 'center',
              paddingVertical: spacing.xl,
              marginBottom: spacing.lg,
            }}
          >
            <View
              style={{
                width: 84,
                height: 84,
                borderRadius: 42,
                backgroundColor: colors.primaryLight,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: spacing.md,
              }}
            >
              <Icon name="receipt-text-outline" size={38} color={colors.primary} />
            </View>
            <AppText variant="h3" align="center">
              Snap or upload a receipt
            </AppText>
            <View style={{ marginTop: spacing.xxs, paddingHorizontal: spacing.lg }}>
              <AppText variant="body" color="secondary" align="center">
                We'll pull out the amount, date, and category so you can
                review and save in seconds.
              </AppText>
            </View>
          </View>

          <PrimaryButton
            label="Take Photo"
            icon="camera-outline"
            onPress={() => pickImage(true)}
            style={{ marginBottom: spacing.sm }}
          />
          <PrimaryButton
            label="Choose from Gallery"
            icon="image-outline"
            variant="outline"
            onPress={() => pickImage(false)}
          />
        </View>
      )}

      {stage === 'scanning' && (
        <View>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={{
                width: '100%',
                height: 240,
                borderRadius: radius.md,
                marginBottom: spacing.lg,
              }}
              resizeMode="cover"
            />
          ) : null}
          <LoadingIndicator label="Reading receipt..." />
        </View>
      )}

      {stage === 'error' && (
        <View>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={{
                width: '100%',
                height: 200,
                borderRadius: radius.md,
                marginBottom: spacing.md,
              }}
              resizeMode="cover"
            />
          ) : null}
          <Card style={{ marginBottom: spacing.md, backgroundColor: colors.dangerBg }}>
            <AppText variant="body" color="danger">
              {errorMessage}
            </AppText>
          </Card>
          <PrimaryButton label="Try Again" onPress={() => setStage('pick')} />
        </View>
      )}

      {stage === 'reviewing' && (
        <View>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={{
                width: '100%',
                height: 200,
                borderRadius: radius.md,
                marginBottom: spacing.md,
              }}
              resizeMode="cover"
            />
          ) : null}

          <Card style={{ marginBottom: spacing.md }}>
            <AppText variant="bodyMedium" color="secondary" style={{ marginBottom: spacing.sm }}>
              Detected Details
            </AppText>
            <ReviewRow
              icon="currency-usd"
              label="Amount"
              value={amount !== null ? amount.toFixed(2) : 'Not detected'}
            />
            <ReviewRow
              icon="calendar-outline"
              label="Date"
              value={date ? date.toDateString() : 'Not detected'}
            />
            <ReviewRow
              icon={CATEGORY_META[category].icon}
              label="Category"
              value={CATEGORY_META[category].label}
              isLast
            />
          </Card>

          <View
            style={{
              backgroundColor: colors.warningBg,
              borderRadius: radius.sm,
              padding: spacing.sm,
              marginBottom: spacing.md,
            }}
          >
            <AppText variant="caption" color="warning">
              Double-check these details on the next screen — OCR isn't
              perfect, especially with faded or angled receipts.
            </AppText>
          </View>

          <PrimaryButton
            label="Continue to Add Expense"
            onPress={useDetails}
            style={{ marginBottom: spacing.sm }}
          />
          <PrimaryButton
            label="Retake Photo"
            variant="ghost"
            onPress={() => setStage('pick')}
          />

          {extractedText ? (
            <View style={{ marginTop: spacing.lg }}>
              <AppText variant="caption" color="muted" style={{ marginBottom: spacing.xxs }}>
                Raw extracted text
              </AppText>
              <Card>
                <ScrollView style={{ maxHeight: 140 }}>
                  <AppText variant="caption" color="muted">
                    {extractedText}
                  </AppText>
                </ScrollView>
              </Card>
            </View>
          ) : null}
        </View>
      )}
    </Screen>
  );
};

const ReviewRow: React.FC<{
  icon: string;
  label: string;
  value: string;
  isLast?: boolean;
}> = ({ icon, label, value, isLast }) => {
  const { colors, spacing, radius } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.divider,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: radius.sm,
          backgroundColor: colors.surfaceAlt,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: spacing.sm,
        }}
      >
        <Icon name={icon} size={18} color={colors.primary} />
      </View>
      <AppText variant="body" color="secondary" style={{ flex: 1 }}>
        {label}
      </AppText>
      <AppText variant="bodyMedium">{value}</AppText>
    </View>
  );
};

export default OCRScanScreen;
