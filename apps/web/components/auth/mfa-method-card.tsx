/**
 * MFA Method Card Component
 *
 * Story: 1-1-7 MFA Setup - Method Selection
 * Wireframe: mfa_method_selection/code.html (lines 102-149)
 *
 * Features:
 * - Reusable card component for each MFA method option
 * - Selected/unselected visual states with proper styling
 * - Recommended badge for preferred methods
 * - Icon display with dynamic styling based on selection
 * - Full accessibility with ARIA attributes
 * - Keyboard navigation support via native radio inputs
 *
 * Design tokens from wireframe:
 * - Selected: border-primary bg-primary/5
 * - Unselected: border-border-dark bg-surface-dark
 * - Icon selected: bg-primary/20 text-primary
 * - Icon unselected: bg-border-dark text-text-secondary
 * - Recommended badge: bg-primary/20 text-primary
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * MFA Method type
 */
export type MfaMethod = 'app' | 'sms' | 'email';

/**
 * Props for the MfaMethodCard component
 */
export interface MfaMethodCardProps {
  /** The MFA method type */
  method: MfaMethod;
  /** Title of the MFA method */
  title: string;
  /** Description of how the method works */
  description: string;
  /** Material Symbols icon name */
  icon: string;
  /** Whether this option is currently selected */
  selected: boolean;
  /** Callback when this option is selected */
  onChange: (method: MfaMethod) => void;
  /** Whether to show the "Recommended" badge */
  recommended?: boolean;
  /** Input name for the radio group */
  name?: string;
}

/**
 * MfaMethodCard Component
 *
 * A radio button card for selecting an MFA method.
 * Displays the method icon, title, description, and optional recommended badge.
 * Uses native radio input for accessibility and keyboard navigation.
 */
export function MfaMethodCard({
  method,
  title,
  description,
  icon,
  selected,
  onChange,
  recommended = false,
  name = 'mfa_method',
}: MfaMethodCardProps) {
  const labelId = `option-${method}-label`;
  const descId = `option-${method}-desc`;

  const handleChange = () => {
    onChange(method);
  };

  return (
    <label
      className={cn(
        'group relative flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all md:p-5',
        selected
          ? 'border-primary bg-primary/5 hover:bg-primary/10'
          : 'border-border-dark bg-surface-dark hover:border-primary/50 hover:bg-surface-dark/80'
      )}
    >
      {/* Radio Input */}
      <div className="flex h-6 items-center">
        <input
          type="radio"
          name={name}
          value={method}
          checked={selected}
          onChange={handleChange}
          aria-labelledby={labelId}
          aria-describedby={descId}
          className={cn(
            'size-4 border-gray-300 text-primary focus:ring-primary',
            'dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800'
          )}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 items-start gap-4">
        {/* Icon Container */}
        <div
          data-testid="icon-container"
          className={cn(
            'flex size-12 shrink-0 items-center justify-center rounded-lg transition-colors',
            selected
              ? 'bg-primary/20 text-primary'
              : 'bg-border-dark text-text-secondary group-hover:text-white'
          )}
        >
          <span
            data-testid={`icon-${icon}`}
            className="material-symbols-outlined text-[24px]"
            aria-hidden="true"
          >
            {icon}
          </span>
        </div>

        {/* Text Content */}
        <div className="flex flex-col gap-1">
          {/* Title row with optional recommended badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              id={labelId}
              className="text-base font-semibold text-white"
            >
              {title}
            </span>
            {recommended && (
              <span className="rounded bg-primary/20 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-primary">
                Recommended
              </span>
            )}
          </div>

          {/* Description */}
          <p
            id={descId}
            className="text-sm leading-relaxed text-text-secondary"
          >
            {description}
          </p>
        </div>
      </div>
    </label>
  );
}

export default MfaMethodCard;
