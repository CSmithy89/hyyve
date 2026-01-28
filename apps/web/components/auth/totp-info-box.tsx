/**
 * TOTP Info Box Component
 *
 * Story: 1-1-8 MFA Setup - TOTP Authenticator
 * Wireframe: mfa_authenticator_setup/code.html (lines 129-144)
 *
 * Features:
 * - Two variants: "primary" (info) and "default" (help)
 * - Icon, title, and content
 * - Accessible styling
 *
 * Design tokens from wireframe:
 * - Primary variant: bg-primary/5 border border-primary/10 rounded-lg p-4
 * - Default variant: bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-border rounded-lg p-4
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for the TotpInfoBox component
 */
export interface TotpInfoBoxProps {
  /** Title of the info box */
  title: string;
  /** Content/description text */
  content: React.ReactNode;
  /** Icon name (Material Symbols) */
  icon: string;
  /** Variant styling */
  variant?: 'primary' | 'default';
  /** Additional CSS classes */
  className?: string;
}

/**
 * TotpInfoBox Component
 *
 * Information box with icon, title, and content.
 * Used for "Why do I need this?" and "Having trouble?" sections.
 */
export function TotpInfoBox({
  title,
  content,
  icon,
  variant = 'default',
  className,
}: TotpInfoBoxProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg p-4',
        variant === 'primary'
          ? 'bg-primary/5 border border-primary/10'
          : 'bg-surface-dark border border-gray-200 dark:border-surface-border',
        className
      )}
    >
      <span
        data-testid="info-icon"
        className={cn(
          'material-symbols-outlined mt-0.5',
          variant === 'primary' ? 'text-primary' : 'text-gray-400 dark:text-text-secondary'
        )}
        aria-hidden="true"
      >
        {icon}
      </span>
      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          {title}
        </h4>
        <p className="text-xs text-gray-500 dark:text-text-secondary mt-1">
          {content}
        </p>
      </div>
    </div>
  );
}

export default TotpInfoBox;
