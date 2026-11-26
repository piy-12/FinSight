import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Screen } from '../../components/common/Screen';
import { AppText } from '../../components/common/AppText';
import { IconButton } from '../../components/buttons/IconButton';
import { useTheme } from '../../theme/ThemeContext';
import { aiService, parseAiError } from '../../services/api/aiService';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'error';
  content: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  'Analyze all my expenses so far',
  'Where am I overspending?',
  'How can I hit my savings goal?',
];

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi! I'm FinSight AI. I have access to your full expense history and monthly budget. Ask me anything about your spending habits or how to save more.",
  timestamp: new Date(),
};

const AdvisorChatScreen: React.FC = () => {
  const { colors, spacing, radius, typography } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [threadId, setThreadId] = useState<string | undefined>(undefined);
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const handleSend = async (overrideText?: string) => {
    const trimmed = (overrideText ?? inputText).trim();
    if (!trimmed || sending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    if (!overrideText) setInputText('');
    setSending(true);

    try {
      const response = await aiService.sendMessage({
        message: trimmed,
        thread_id: threadId,
      });

      setThreadId(response.thread_id);

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'error',
        content: parseAiError(error),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errMessage]);
    } finally {
      setSending(false);
    }
  };

  const handleResetChat = () => {
    setThreadId(undefined);
    setMessages([WELCOME_MESSAGE]);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';
    const isError = item.role === 'error';

    return (
      <View
        style={[
          styles.bubbleRow,
          { justifyContent: isUser ? 'flex-end' : 'flex-start' },
        ]}
      >
        {!isUser ? (
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: isError ? colors.dangerBg : colors.primaryLight,
                marginRight: spacing.xs,
              },
            ]}
          >
            <Icon
              name={isError ? 'alert-circle-outline' : 'robot-happy-outline'}
              size={18}
              color={isError ? colors.danger : colors.primary}
            />
          </View>
        ) : null}

        <View
          style={[
            styles.bubble,
            {
              backgroundColor: isUser
                ? colors.primary
                : isError
                ? colors.dangerBg
                : colors.card,
              borderColor: isUser || isError ? 'transparent' : colors.border,
              borderWidth: isUser || isError ? 0 : 1,
              borderRadius: radius.md,
              padding: spacing.sm,
            },
          ]}
        >
          <AppText
            variant="body"
            style={{
              color: isUser
                ? colors.onPrimary
                : isError
                ? colors.danger
                : colors.textPrimary,
            }}
          >
            {item.content}
          </AppText>
        </View>
      </View>
    );
  };

  return (
    <Screen padded={false} style={{ flex: 1 }}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            borderBottomWidth: 1,
            borderBottomColor: colors.divider,
          },
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={[
              styles.headerBadge,
              { backgroundColor: colors.primaryLight, marginRight: spacing.sm },
            ]}
          >
            <Icon name="sparkles" size={20} color={colors.primary} />
          </View>
          <View>
            <AppText variant="h3">FinSight AI</AppText>
            <AppText variant="caption" color="muted">
              Personal Financial Advisor
            </AppText>
          </View>
        </View>

        <IconButton
          icon="refresh"
          size={18}
          accessibilityLabel="New conversation"
          onPress={handleResetChat}
        />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{
            padding: spacing.md,
            paddingBottom: spacing.lg,
          }}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: true })
          }
          ListFooterComponent={
            sending ? (
              <View
                style={[
                  styles.typingRow,
                  { marginTop: spacing.xs, paddingLeft: 40 },
                ]}
              >
                <ActivityIndicator size="small" color={colors.primary} />
                <View style={{ marginLeft: spacing.xs }}>
                  <AppText variant="caption" color="muted">
                    Analyzing your expenses...
                  </AppText>
                </View>
              </View>
            ) : null
          }
        />

        {/* Quick prompts shown before user's first message */}
        {messages.length === 1 && !sending ? (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: spacing.xs,
              paddingHorizontal: spacing.md,
              paddingBottom: spacing.sm,
            }}
          >
            {SUGGESTED_PROMPTS.map(prompt => (
              <TouchableOpacity
                key={prompt}
                onPress={() => handleSend(prompt)}
                style={{
                  backgroundColor: colors.surfaceAlt,
                  borderRadius: radius.pill,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: spacing.xs,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <AppText variant="caption" color="secondary">
                  {prompt}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        {/* Message Composer */}
        <View
          style={[
            styles.composer,
            {
              backgroundColor: colors.surface,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
            },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                color: colors.textPrimary,
                borderColor: colors.border,
                borderRadius: radius.lg,
                paddingHorizontal: spacing.md,
                ...typography.body,
              },
            ]}
            placeholder="Ask about your spending or budget..."
            placeholderTextColor={colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={!sending}
          />
          <TouchableOpacity
            onPress={() => handleSend()}
            disabled={!inputText.trim() || sending}
            style={[
              styles.sendBtn,
              {
                backgroundColor:
                  !inputText.trim() || sending
                    ? colors.surfaceAlt
                    : colors.primary,
                marginLeft: spacing.xs,
              },
            ]}
          >
            <Icon
              name="send"
              size={20}
              color={
                !inputText.trim() || sending
                  ? colors.textMuted
                  : colors.onPrimary
              }
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    maxWidth: '80%',
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    borderWidth: 1,
    paddingVertical: 10,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AdvisorChatScreen;