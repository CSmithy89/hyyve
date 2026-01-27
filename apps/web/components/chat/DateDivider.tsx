'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { DateDividerProps } from './types';

/**
 * Format a date for display in chat
 */
function formatChatDate(date: Date): string {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  if (isToday) {
    return `Today, ${timeStr}`;
  } else if (isYesterday) {
    return `Yesterday, ${timeStr}`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }
}

/**
 * DateDivider Component
 *
 * Displays a date/time divider between message groups
 * AC3: Date dividers show between message groups
 *
 * Features:
 * - Centered text with timestamp
 * - Uppercase, tracking-widest styling
 * - Text-secondary color
 * - Smart date formatting (Today, Yesterday, or full date)
 *
 * @see hyyve_module_builder/code.html lines 359-362
 */
export function DateDivider({ date, className }: DateDividerProps) {
  return (
    <div className={cn('flex justify-center', className)}>
      <span className="text-[10px] text-text-secondary uppercase tracking-widest">
        {formatChatDate(date)}
      </span>
    </div>
  );
}

export default DateDivider;
