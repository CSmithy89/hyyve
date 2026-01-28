/**
 * IdP Provider Card Component
 *
 * Story: 1-1-12 Enterprise SSO SAML Configuration
 * Wireframe: enterprise_sso_configuration/code.html (lines 94-131)
 *
 * Features:
 * - Selectable identity provider card
 * - Visual feedback for selected state
 * - Icon display with provider branding
 * - Keyboard accessible
 *
 * Design tokens from wireframe:
 * - Surface: bg-surface-dark (#1b1a31)
 * - Border: border-border-dark (#272546)
 * - Primary: #5048e5
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Identity Provider type
 */
export type IdpProvider = 'okta' | 'azure' | 'google' | 'saml';

/**
 * Props for IdpProviderCard component
 */
export interface IdpProviderCardProps {
  /** Provider identifier */
  provider: IdpProvider;
  /** Display name */
  name: string;
  /** Material icon name */
  icon: string;
  /** Whether this provider is currently selected */
  selected: boolean;
  /** Callback when provider is selected */
  onSelect: (provider: IdpProvider) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * IdpProviderCard Component
 *
 * A selectable card for identity provider selection.
 * Used in the SSO configuration page to choose between
 * Okta, Azure AD, Google, or custom SAML 2.0.
 */
export function IdpProviderCard({
  provider,
  name,
  icon,
  selected,
  onSelect,
  className,
}: IdpProviderCardProps) {
  const handleClick = () => {
    onSelect(provider);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(provider);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      data-testid={`idp-${provider}`}
      className={cn(
        'group relative cursor-pointer rounded-xl border-2 p-5 transition-all',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark',
        selected
          ? 'border-primary bg-primary/5'
          : 'border-border-dark bg-surface-dark hover:border-primary/50',
        className
      )}
    >
      <div className="flex flex-col items-center gap-3">
        {/* Icon */}
        <div
          data-testid="provider-icon"
          className={cn(
            'flex size-12 items-center justify-center rounded-lg',
            selected ? 'bg-primary/20' : 'bg-white/5'
          )}
        >
          <span
            className={cn(
              'material-symbols-outlined text-3xl',
              selected ? 'text-primary' : 'text-text-secondary'
            )}
          >
            {icon}
          </span>
        </div>

        {/* Name */}
        <p className="text-base font-bold leading-tight text-white">{name}</p>

        {/* Selected Indicator */}
        {selected && (
          <span
            data-testid="selected-idp-check"
            className="material-symbols-outlined absolute right-2 top-2 text-xl text-primary"
          >
            check_circle
          </span>
        )}
      </div>
    </div>
  );
}

export default IdpProviderCard;
