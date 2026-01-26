'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, MoreVertical, PlusCircle, Send } from 'lucide-react';

// =============================================================================
// AGENT_CONTENT_ZONE - This component renders agent-generated content via AG-UI
// =============================================================================

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
  isStreaming?: boolean;
  quickReplies?: string[];
}

interface ChatPanelProps {
  /** Unique zone ID for AG-UI integration */
  zoneId: string;
  /** Agent name to display */
  agentName?: string;
  /** Agent avatar URL */
  agentAvatar?: string;
  /** Whether agent is online */
  isOnline?: boolean;
  /** Chat messages */
  messages: ChatMessage[];
  /** Whether currently streaming a response */
  isStreaming?: boolean;
  /** Callback when user sends a message */
  onSendMessage?: (message: string) => void;
  /** Callback when user clicks a quick reply */
  onQuickReply?: (reply: string) => void;
  /** User info for displaying user messages */
  user?: {
    name: string;
    avatar?: string;
  };
  /** Placeholder text for input */
  placeholder?: string;
  /** Disclaimer text */
  disclaimer?: string;
  className?: string;
}

export function ChatPanel({
  zoneId,
  agentName = 'Agent',
  agentAvatar,
  isOnline = true,
  messages,
  isStreaming = false,
  onSendMessage,
  onQuickReply,
  user,
  placeholder = 'Type your message...',
  disclaimer,
  className,
}: ChatPanelProps) {
  const [inputValue, setInputValue] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue.trim());
      setInputValue('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px`;
  };

  return (
    <aside className={cn('flex w-80 flex-none flex-col border-l border-border bg-background', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          {isOnline && <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />}
          <h3 className="text-sm font-semibold tracking-wide">{agentName}</h3>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* AGENT_CONTENT_ZONE - Chat messages area */}
      {/* This is where AG-UI streaming events will render content */}
      <div
        id={`${zoneId}-zone`}
        data-ag-ui="conversation"
        data-ag-ui-stream="true"
        className="flex flex-1 flex-col gap-4 overflow-y-auto p-4"
      >
        {/* Date Divider (static example) */}
        <div className="flex justify-center">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* Messages */}
        {messages.map((message, index) => (
          <ChatMessageBubble
            key={message.id}
            message={message}
            agentName={agentName}
            agentAvatar={agentAvatar}
            user={user}
            isConsecutive={
              index > 0 && messages[index - 1]?.role === message.role
            }
            onQuickReply={onQuickReply}
          />
        ))}

        {/* Typing Indicator */}
        {isStreaming && (
          <div className="flex gap-3">
            <Avatar className="mt-1 h-8 w-8 flex-none bg-primary">
              {agentAvatar ? (
                <AvatarImage src={agentAvatar} alt={agentName} />
              ) : (
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex w-16 items-center gap-1 rounded-2xl rounded-tl-none bg-muted p-4">
              <div className="animate-bounce-delayed-1 h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              <div className="animate-bounce-delayed-2 h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              <div className="animate-bounce-delayed-3 h-1.5 w-1.5 rounded-full bg-muted-foreground" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background p-4">
        <div className="flex items-end gap-2 rounded-xl border border-border bg-muted/50 p-2 focus-within:border-primary transition-colors">
          <Button variant="ghost" size="icon" className="h-9 w-9 flex-none">
            <PlusCircle className="h-5 w-5 text-muted-foreground" />
          </Button>
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className="max-h-24 w-full resize-none border-none bg-transparent p-2 text-sm focus:outline-none focus:ring-0"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isStreaming}
            size="icon"
            className="h-9 w-9 flex-none shadow-lg shadow-primary/20"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {disclaimer && (
          <p className="mt-2 text-center text-[10px] text-muted-foreground">{disclaimer}</p>
        )}
      </div>
    </aside>
  );
}

// Individual Message Bubble Component
interface ChatMessageBubbleProps {
  message: ChatMessage;
  agentName: string;
  agentAvatar?: string;
  user?: { name: string; avatar?: string };
  isConsecutive?: boolean;
  onQuickReply?: (reply: string) => void;
}

function ChatMessageBubble({
  message,
  agentName,
  agentAvatar,
  user,
  isConsecutive,
  onQuickReply,
}: ChatMessageBubbleProps) {
  const isUser = message.role === 'user';
  const userInitials = user?.name?.split(' ').map((n) => n[0]).join('') ?? 'U';

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      {/* Avatar */}
      {!isConsecutive ? (
        <Avatar className={cn('mt-1 h-8 w-8 flex-none', isUser ? 'ring-2 ring-primary/20' : 'bg-primary')}>
          {isUser ? (
            <>
              <AvatarImage src={user?.avatar} alt={user?.name ?? 'You'} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </>
          ) : (
            <>
              {agentAvatar ? (
                <AvatarImage src={agentAvatar} alt={agentName} />
              ) : (
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              )}
            </>
          )}
        </Avatar>
      ) : (
        <div className="w-8 flex-none" /> // Spacer for consecutive messages
      )}

      {/* Message Content */}
      <div className={cn('flex max-w-[85%] flex-col gap-1', isUser && 'items-end')}>
        <div
          className={cn(
            'rounded-2xl p-3 text-sm shadow-sm',
            isUser
              ? 'rounded-tr-none bg-primary text-primary-foreground'
              : 'rounded-tl-none bg-muted text-foreground'
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Quick Replies */}
        {message.quickReplies && message.quickReplies.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-2">
            {message.quickReplies.map((reply, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onQuickReply?.(reply)}
                className="h-auto rounded-full px-3 py-1.5 text-xs"
              >
                {reply}
              </Button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        {message.timestamp && !isConsecutive && (
          <span className="text-[10px] text-muted-foreground">{message.timestamp}</span>
        )}
      </div>
    </div>
  );
}
