/**
 * Chat Components - Barrel Export
 *
 * Story: 0-2-5 Create Agent Chat Component
 * AC10: All components properly exported
 */

// Main component
export { AgentChat } from './AgentChat';
export { default as AgentChatDefault } from './AgentChat';

// Message components
export { AgentMessage } from './AgentMessage';
export { default as AgentMessageDefault } from './AgentMessage';
export { UserMessage } from './UserMessage';
export { default as UserMessageDefault } from './UserMessage';

// Input component
export { ChatInput } from './ChatInput';
export { default as ChatInputDefault } from './ChatInput';

// Supporting components
export { TypingIndicator } from './TypingIndicator';
export { default as TypingIndicatorDefault } from './TypingIndicator';
export { DateDivider } from './DateDivider';
export { default as DateDividerDefault } from './DateDivider';
export { QuickActionButton } from './QuickActionButton';
export { default as QuickActionButtonDefault } from './QuickActionButton';

// Types
export type {
  AgentId,
  AgentStatus,
  MessageRole,
  Message,
  QuickAction,
  AgentChatProps,
  AgentMessageProps,
  UserMessageProps,
  ChatInputProps,
  TypingIndicatorProps,
  DateDividerProps,
  QuickActionButtonProps,
} from './types';

// Utilities
export {
  AGENT_COLORS,
  AGENT_NAMES,
  getAgentColor,
  getAgentAvatarStyle,
} from './types';
