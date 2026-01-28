/**
 * Backup Code Card Component
 *
 * Story: 1-1-9 MFA Backup Codes Generation
 * Wireframe: mfa_backup_codes
 *
 * Individual backup code display with sequential number and monospace formatting.
 * Used in the backup codes grid display after TOTP setup.
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for the BackupCodeCard component
 */
export interface BackupCodeCardProps {
  /** Sequential number (1-10) */
  number: number;
  /** The backup code (8 characters alphanumeric) */
  code: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * BackupCodeCard Component
 *
 * Displays a single backup code with its sequential number.
 * Uses monospace font for code readability and consistent styling.
 */
export function BackupCodeCard({ number, code, className }: BackupCodeCardProps) {
  return (
    <li
      data-testid="backup-code"
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg',
        'bg-gray-50 dark:bg-background-dark',
        'border border-gray-200 dark:border-surface-border',
        'font-mono tracking-wider text-base',
        className
      )}
    >
      <span className="text-gray-400 dark:text-text-secondary font-sans text-sm min-w-[24px]">
        {number}.
      </span>
      <span className="text-gray-900 dark:text-white font-semibold select-all">
        {code}
      </span>
    </li>
  );
}

export default BackupCodeCard;
