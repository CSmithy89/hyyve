'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { QuickActionButtonProps } from './types';

/**
 * QuickActionButton Component
 *
 * Inline action button for agent messages
 * AC5: Quick action buttons in agent messages
 *
 * Features:
 * - Primary variant with border-primary styling
 * - Secondary variant with border-dark styling
 * - Rounded-full button styling
 * - Hover transitions
 *
 * @see hyyve_module_builder/code.html lines 381-388
 */
// variant: 'primary' | 'secondary' styling options
export function QuickActionButton({
  label,
  variant = 'secondary',
  onClick,
  disabled = false,
  className,
}: QuickActionButtonProps & { disabled?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        'text-xs px-3 py-1.5 rounded-full transition-colors',
        'bg-[#1c1a2e] border',
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && variant === 'primary'
          ? 'hover:bg-[#5048e5]/20 border-primary/30 text-primary'
          : !disabled
            ? 'hover:bg-[#272546] border-border-dark text-text-secondary'
            : 'border-border-dark text-text-secondary',
        className
      )}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

export default QuickActionButton;
