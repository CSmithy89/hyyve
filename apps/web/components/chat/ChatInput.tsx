'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { ChatInputProps } from './types';

/**
 * ChatInput Component
 *
 * Input area for sending messages to the agent
 * AC6: Input area with attachment and send
 *
 * Features:
 * - Attachment button (plus icon)
 * - Auto-growing textarea (max-h-24)
 * - Send button with primary styling
 * - Disclaimer text below input
 * - Keyboard support (Enter to send, Shift+Enter for newline)
 *
 * @see hyyve_module_builder/code.html lines 415-427
 */
export function ChatInput({
  onSend,
  placeholder,
  agentName = 'the agent',
  disabled = false,
  className,
}: ChatInputProps) {
  const [value, setValue] = React.useState('');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = React.useCallback(() => {
    const trimmed = value.trim();
    if (trimmed && onSend) {
      onSend(trimmed);
      setValue('');
      // Reset textarea height and return focus
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.focus();
      }
    }
  }, [value, onSend]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      // Auto-grow textarea
      const textarea = e.target;
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px`;
    },
    []
  );

  return (
    <div className={cn('p-4 border-t border-border-dark bg-[#131221]', className)}>
      <div className="relative flex items-end gap-2 bg-[#1c1a2e] border border-border-dark rounded-xl p-2 focus-within:border-primary transition-colors">
        {/* Attachment Button - Disabled until file upload is implemented */}
        <button
          type="button"
          className="p-2 text-text-secondary/50 rounded-lg cursor-not-allowed"
          aria-label="Attach file (coming soon)"
          disabled
          title="File attachments coming soon"
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
            add_circle
          </span>
        </button>

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          className="bg-transparent border-none text-white text-sm w-full focus:ring-0 focus:outline-none p-2 max-h-24 resize-none placeholder-text-secondary/50"
          placeholder={placeholder || `Ask ${agentName} to edit workflow...`}
          rows={1}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-label="Message input"
        />

        {/* Send Button */}
        <button
          type="button"
          className="p-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
            send
          </span>
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-text-secondary text-center mt-2">
        {agentName} can make mistakes. Verify important logic.
      </p>
    </div>
  );
}

export default ChatInput;
