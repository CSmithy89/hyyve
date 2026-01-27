'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { AgentChatProps, Message } from './types';
import { AGENT_NAMES, getAgentColor } from './types';
import { AgentMessage } from './AgentMessage';
import { UserMessage } from './UserMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { DateDivider } from './DateDivider';

/**
 * Check if two dates are on different days
 */
function isDifferentDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() !== date2.toDateString();
}

/**
 * Check if messages are from the same sender consecutively
 */
function isConsecutiveMessage(current: Message, previous: Message | undefined): boolean {
  if (!previous) return false;
  return current.role === previous.role && current.role === 'agent';
}

/**
 * AgentChat Component
 *
 * Main chat interface for agent conversations
 * Story: 0-2-5 Create Agent Chat Component
 *
 * Features:
 * - AC1: Agent header with status indicator
 * - AC2: Message list with agent/user bubbles
 * - AC3: Date dividers between message groups
 * - AC4: Typing indicator with bouncing dots
 * - AC5: Quick action buttons in agent messages
 * - AC6: Input area with attachment and send
 * - AC7: Component props (agentId, messages, onSendMessage, etc.)
 * - AC8: Agent personality colors
 * - AC9: Accessibility requirements
 *
 * @see hyyve_module_builder/code.html lines 346-427
 */
// status: 'online' | 'offline' | 'busy' for agent availability indicator
export function AgentChat({
  agentId,
  messages = [],
  onSendMessage,
  isTyping = false,
  status = 'online',
  className,
}: AgentChatProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const messagesContainerRef = React.useRef<HTMLDivElement>(null);
  const agentName = AGENT_NAMES[agentId];
  const agentColor = getAgentColor(agentId);

  // Smart auto-scroll: only scroll if user is near bottom
  React.useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <aside
      className={cn(
        'w-80 flex-none bg-[#131221] border-l border-border-dark flex flex-col z-10',
        className
      )}
      style={{ '--agent-color': agentColor } as React.CSSProperties}
    >
      {/* Header - AC1 */}
      <div className="px-5 py-4 border-b border-border-dark flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Status Indicator */}
          <div
            className={cn(
              'size-2 rounded-full',
              status === 'online' && 'bg-green-500 animate-pulse',
              status === 'offline' && 'bg-gray-500',
              status === 'busy' && 'bg-yellow-500 animate-pulse'
            )}
            aria-label={`Agent status: ${status}`}
          />
          {/* Agent Name */}
          <h3 className="text-white font-semibold text-sm tracking-wide">
            {agentName}
          </h3>
        </div>

        {/* More Options Button */}
        <button
          type="button"
          className="text-text-secondary hover:text-white transition-colors"
          aria-label="More options"
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
            more_vert
          </span>
        </button>
      </div>

      {/* Chat Area - AC2, AC3, AC4 */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col"
        role="log"
        aria-live="polite"
        aria-label={`Chat with ${agentName}`}
      >
        {/* Empty State */}
        {messages.length === 0 && !isTyping && (
          <div className="flex-1 flex items-center justify-center text-center p-4">
            <div className="text-text-secondary text-sm">
              <p className="font-medium text-white mb-1">
                Hi! I&apos;m {agentName}.
              </p>
              <p>How can I help you with your workflow today?</p>
            </div>
          </div>
        )}

        {messages.map((message, index) => {
          const previousMessage = messages[index - 1];
          const showDateDivider =
            index === 0 ||
            (previousMessage && isDifferentDay(message.timestamp, previousMessage.timestamp));
          const isConsecutive =
            isConsecutiveMessage(message, previousMessage) && !showDateDivider;

          return (
            <React.Fragment key={message.id}>
              {/* Date Divider - AC3 */}
              {showDateDivider && <DateDivider date={message.timestamp} />}

              {/* Message - AC2, AC5 */}
              {message.role === 'agent' ? (
                <AgentMessage
                  content={message.content}
                  agentId={agentId}
                  showAvatar={!isConsecutive}
                  quickActions={message.quickActions}
                />
              ) : (
                <UserMessage
                  content={message.content}
                  timestamp={message.timestamp}
                />
              )}
            </React.Fragment>
          );
        })}

        {/* Typing Indicator - AC4 */}
        {isTyping && <TypingIndicator agentId={agentId} />}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - AC6 */}
      <ChatInput
        onSend={onSendMessage}
        agentName={agentName}
        placeholder={`Ask ${agentName} to edit workflow...`}
      />
    </aside>
  );
}

export default AgentChat;
