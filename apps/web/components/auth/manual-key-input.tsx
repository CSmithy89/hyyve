/**
 * Manual Key Input Component
 *
 * Story: 1-1-8 MFA Setup - TOTP Authenticator
 * Wireframe: mfa_authenticator_setup/code.html (lines 84-91)
 *
 * Features:
 * - Displays TOTP setup key in 4-character groups
 * - Read-only input with monospace font
 * - Copy to clipboard button
 * - Visual feedback after copying (icon change)
 * - Accessible with proper ARIA labels
 *
 * Design tokens from wireframe:
 * - Input: font-mono tracking-wider flex-1 rounded-l-lg border bg-gray-50 dark:bg-background-dark h-12 px-4
 * - Copy button: flex items-center justify-center px-4 rounded-r-lg border bg-gray-100 dark:bg-surface-border/50
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for the ManualKeyInput component
 */
export interface ManualKeyInputProps {
  /** The Base32 secret key (unformatted) */
  secretKey: string;
  /** Callback when key is copied */
  onCopy?: (key: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Format secret key into 4-character groups
 * e.g., "JBSWY3DPEHPK3PXP" -> "JBSW Y3DP EHPK 3PXP"
 */
function formatSecretKey(key: string): string {
  return key.replace(/(.{4})/g, '$1 ').trim();
}

/**
 * ManualKeyInput Component
 *
 * Displays the TOTP setup key with a copy button for manual entry
 * in authenticator apps when QR code scanning is not possible.
 */
export function ManualKeyInput({
  secretKey,
  onCopy,
  className,
}: ManualKeyInputProps) {
  const [copied, setCopied] = React.useState(false);

  const formattedKey = formatSecretKey(secretKey);

  /**
   * Handle copy to clipboard
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(secretKey);
      setCopied(true);
      onCopy?.(secretKey);

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className={cn('flex flex-col gap-2 mt-2', className)}>
      <label className="text-sm font-medium text-gray-700 dark:text-white">
        Unable to scan? Use this setup key:
      </label>
      <div className="flex w-full items-stretch rounded-lg shadow-sm">
        <input
          type="text"
          readOnly
          value={formattedKey}
          className={cn(
            'font-mono tracking-wider flex-1 rounded-l-lg',
            'border border-r-0 border-gray-300 dark:border-surface-border',
            'bg-gray-50 dark:bg-background-dark',
            'text-gray-900 dark:text-white',
            'h-12 px-4',
            'text-sm',
            'focus:ring-1 focus:ring-primary focus:border-primary'
          )}
          aria-label="TOTP setup key"
        />
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Copied to clipboard' : 'Copy setup key'}
          className={cn(
            'flex items-center justify-center px-4 rounded-r-lg',
            'border border-l-0 border-gray-300 dark:border-surface-border',
            'bg-gray-100 dark:bg-surface-border/50',
            'hover:bg-gray-200 dark:hover:bg-surface-border',
            'text-gray-600 dark:text-text-secondary',
            'transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark'
          )}
        >
          <span
            className="material-symbols-outlined text-[20px]"
            aria-hidden="true"
          >
            {copied ? 'check' : 'content_copy'}
          </span>
        </button>
      </div>
    </div>
  );
}

export default ManualKeyInput;
