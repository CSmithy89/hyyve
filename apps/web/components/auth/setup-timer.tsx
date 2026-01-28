/**
 * Setup Timer Component
 *
 * Story: 1-1-8 MFA Setup - TOTP Authenticator
 * Wireframe: mfa_authenticator_setup/code.html (lines 120-123)
 *
 * Features:
 * - Countdown timer in MM:SS format
 * - Timer icon with primary styling
 * - Warning state when time is low (< 1 minute)
 * - Callback when timer expires
 * - Auto-updates every second
 *
 * Design tokens from wireframe:
 * - Badge: flex items-center gap-1.5 text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded
 * - Icon: material-symbols-outlined text-[14px]
 * - Warning colors: text-yellow-500, text-orange-500, text-red-500
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for the SetupTimer component
 */
export interface SetupTimerProps {
  /** Initial time in seconds (default: 300 = 5 minutes) */
  initialSeconds: number;
  /** Callback when timer expires */
  onExpire: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Format seconds into MM:SS string
 */
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Get timer color based on remaining time
 */
function getTimerColor(seconds: number): string {
  if (seconds <= 30) {
    return 'text-red-500';
  }
  if (seconds <= 60) {
    return 'text-orange-500';
  }
  return 'text-primary';
}

/**
 * Get timer badge background based on remaining time
 */
function getTimerBadgeBackground(seconds: number): string {
  if (seconds <= 30) {
    return 'bg-red-500/10';
  }
  if (seconds <= 60) {
    return 'bg-orange-500/10';
  }
  return 'bg-primary/10';
}

/**
 * SetupTimer Component
 *
 * Displays a countdown timer for the TOTP setup process.
 * Changes color to warn users when time is running low.
 */
export function SetupTimer({
  initialSeconds,
  onExpire,
  className,
}: SetupTimerProps) {
  const [seconds, setSeconds] = React.useState(initialSeconds);

  React.useEffect(() => {
    if (seconds <= 0) {
      onExpire();
      return;
    }

    const timerId = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [seconds, onExpire]);

  const timerColor = getTimerColor(seconds);
  const badgeBackground = getTimerBadgeBackground(seconds);

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded',
        badgeBackground,
        timerColor,
        className
      )}
    >
      <span
        data-testid="timer-icon"
        className="material-symbols-outlined text-[14px]"
        aria-hidden="true"
      >
        timer
      </span>
      <span aria-live="polite" aria-label={`Time remaining: ${formatTime(seconds)}`}>
        {formatTime(seconds)}
      </span>
    </div>
  );
}

export default SetupTimer;
