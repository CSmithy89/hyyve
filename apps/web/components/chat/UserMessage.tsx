'use client';

import * as React from 'react';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserMessageProps } from './types';

/**
 * Format a relative timestamp
 */
function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else {
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
  }
}

/**
 * UserMessage Component
 *
 * Displays a message from the user with avatar and bubble styling
 * AC2: Message list with agent/user bubbles
 *
 * Features:
 * - Avatar on right side with gradient border
 * - Message bubble with primary background
 * - Right-aligned layout
 * - Timestamp below message
 *
 * @see hyyve_module_builder/code.html lines 391-402
 */
export function UserMessage({
  content,
  timestamp,
  avatarUrl,
  className,
}: UserMessageProps) {
  return (
    <div className={cn('flex gap-3 flex-row-reverse', className)}>
      {/* User Avatar */}
      <div className="size-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 p-[1.5px] flex-none mt-1">
        {avatarUrl ? (
          <img
            alt="User"
            className="rounded-full bg-black w-full h-full object-cover"
            src={avatarUrl}
          />
        ) : (
          <div className="rounded-full bg-black w-full h-full flex items-center justify-center">
            <User className="size-4 text-white" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className="flex flex-col gap-1 max-w-[85%] items-end">
        <div className="bg-primary text-white rounded-2xl rounded-tr-none p-3 text-sm shadow-sm">
          <p>{content}</p>
        </div>
        {timestamp && (
          <span className="text-[10px] text-text-secondary">
            {formatTimestamp(timestamp)}
          </span>
        )}
      </div>
    </div>
  );
}

export default UserMessage;
