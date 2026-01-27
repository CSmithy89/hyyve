/**
 * Chat Component Types
 *
 * Story: 0-2-5 Create Agent Chat Component
 * AC7: Component props (agentId, messages, onSendMessage, etc.)
 */

import type * as React from 'react';

/**
 * Agent ID type - the four agent personalities
 */
export type AgentId = 'bond' | 'wendy' | 'morgan' | 'artie';

/**
 * Agent status for online/offline indicator
 */
export type AgentStatus = 'online' | 'offline' | 'busy';

/**
 * Message role - who sent the message
 */
export type MessageRole = 'agent' | 'user';

/**
 * Quick action that can be displayed in agent messages
 */
export interface QuickAction {
  /** Action ID for tracking */
  id: string;
  /** Display label */
  label: string;
  /** Primary or secondary styling */
  variant?: 'primary' | 'secondary';
  /** Callback when action is clicked */
  onClick?: () => void;
}

/**
 * Message interface for chat messages
 */
export interface Message {
  /** Unique message ID */
  id: string;
  /** Message content */
  content: string;
  /** Who sent the message */
  role: MessageRole;
  /** When the message was created */
  timestamp: Date;
  /** Optional quick actions for agent messages */
  quickActions?: QuickAction[];
}

/**
 * Agent color configuration
 * AC8: Agent personality affects appearance
 */
export const AGENT_COLORS: Record<AgentId, string> = {
  bond: '#5048e5', // Primary purple
  wendy: '#f97316', // Warm orange
  morgan: '#3b82f6', // Cool blue
  artie: '#ec4899', // Creative pink
};

/**
 * Agent display names
 */
export const AGENT_NAMES: Record<AgentId, string> = {
  bond: 'Agent Bond',
  wendy: 'Agent Wendy',
  morgan: 'Agent Morgan',
  artie: 'Agent Artie',
};

/**
 * Get the color class for an agent
 */
export function getAgentColor(agentId: AgentId): string {
  return AGENT_COLORS[agentId];
}

/**
 * Get the background color style for an agent avatar
 */
export function getAgentAvatarStyle(agentId: AgentId): React.CSSProperties {
  return { backgroundColor: AGENT_COLORS[agentId] };
}

/**
 * Props for AgentChat component
 */
export interface AgentChatProps {
  /** Which agent is chatting */
  agentId: AgentId;
  /** Messages to display (controlled mode) */
  messages?: Message[];
  /** Callback when user sends a message */
  onSendMessage?: (message: string) => void;
  /** Whether the agent is currently typing */
  isTyping?: boolean;
  /** Agent status (online/offline/busy) */
  status?: AgentStatus;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Props for AgentMessage component
 */
export interface AgentMessageProps {
  /** Message content */
  content: string;
  /** Whether to show the avatar (false for sequential messages) */
  showAvatar?: boolean;
  /** Agent ID for avatar color */
  agentId: AgentId;
  /** Quick actions to display */
  quickActions?: QuickAction[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * Props for UserMessage component
 */
export interface UserMessageProps {
  /** Message content */
  content: string;
  /** When the message was sent */
  timestamp?: Date;
  /** User avatar URL */
  avatarUrl?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Props for ChatInput component
 */
export interface ChatInputProps {
  /** Callback when message is sent */
  onSend?: (message: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Agent name for placeholder */
  agentName?: string;
  /** Whether input is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Props for TypingIndicator component
 */
export interface TypingIndicatorProps {
  /** Agent ID for avatar color */
  agentId: AgentId;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Props for DateDivider component
 */
export interface DateDividerProps {
  /** Date to display */
  date: Date;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Props for QuickActionButton component
 */
export interface QuickActionButtonProps {
  /** Button label */
  label: string;
  /** Primary or secondary variant */
  variant?: 'primary' | 'secondary';
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}
