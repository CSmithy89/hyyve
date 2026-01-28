/**
 * SSO Connection Card Component
 *
 * Story: 1-1-12 Enterprise SSO SAML Configuration
 * Wireframe: enterprise_sso_configuration/code.html (lines 79-91)
 *
 * Features:
 * - SSO status display with toggle switch
 * - Status message based on enabled state
 * - Confirmation dialog before disabling
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
 * Props for SsoConnectionCard component
 */
export interface SsoConnectionCardProps {
  /** Whether SSO is currently enabled */
  enabled: boolean;
  /** Callback when toggle state changes */
  onToggle: (enabled: boolean) => void;
  /** Whether to show confirmation before disabling */
  requireConfirmation?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * SsoConnectionCard Component
 *
 * Displays the SSO status with a toggle switch.
 * Shows appropriate message based on enabled/disabled state.
 */
export function SsoConnectionCard({
  enabled,
  onToggle,
  requireConfirmation = true,
  className,
}: SsoConnectionCardProps) {
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);

  const handleToggle = () => {
    // If currently enabled and trying to disable, show confirmation
    if (enabled && requireConfirmation) {
      setShowConfirmDialog(true);
    } else {
      onToggle(!enabled);
    }
  };

  const handleConfirmDisable = () => {
    setShowConfirmDialog(false);
    onToggle(false);
  };

  const handleCancelDisable = () => {
    setShowConfirmDialog(false);
  };

  return (
    <>
      <div
        data-testid="sso-status-card"
        className={cn(
          'flex flex-1 flex-col items-start justify-between gap-4 rounded-xl',
          'border border-border-dark bg-surface-dark p-6',
          '@[480px]:flex-row @[480px]:items-center',
          className
        )}
      >
        <div className="flex flex-col gap-1">
          <p className="text-lg font-bold leading-tight text-white">SSO Status</p>
          <p className="text-sm font-normal leading-normal text-text-secondary">
            {enabled
              ? 'Single Sign-On is currently enabled. Users must authenticate via your provider.'
              : 'SSO is currently disabled. Users can sign in with email and password.'}
          </p>
        </div>

        {/* Toggle Switch */}
        <label
          className={cn(
            'relative flex h-[34px] w-[60px] cursor-pointer items-center rounded-full border-none p-1 transition-all duration-300',
            enabled ? 'justify-end bg-primary' : 'bg-border-dark'
          )}
        >
          <div className="aspect-square h-full rounded-full bg-white shadow-lg" />
          <input
            type="checkbox"
            role="switch"
            checked={enabled}
            onChange={handleToggle}
            aria-checked={enabled}
            aria-label="Toggle SSO"
            className="invisible absolute"
          />
        </label>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="disable-sso-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-xl border border-border-dark bg-surface-dark p-6 shadow-xl">
            <div className="flex flex-col gap-4">
              {/* Warning Icon */}
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-yellow-500/20">
                  <span className="material-symbols-outlined text-2xl text-yellow-500">
                    warning
                  </span>
                </div>
                <h3
                  id="disable-sso-title"
                  className="text-lg font-bold text-white"
                >
                  Disable SSO?
                </h3>
              </div>

              {/* Warning Message */}
              <p className="text-sm text-text-secondary">
                Disabling SSO will allow users to sign in with email and password
                instead of your identity provider. This may affect your
                organization&apos;s security policies.
              </p>

              {/* Action Buttons */}
              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  onClick={handleCancelDisable}
                  className={cn(
                    'flex flex-1 items-center justify-center rounded-lg px-4 py-2.5',
                    'border border-border-dark bg-surface-dark text-sm font-semibold text-white',
                    'transition-all hover:bg-border-dark',
                    'focus:outline-none focus:ring-2 focus:ring-border-dark focus:ring-offset-2 focus:ring-offset-background-dark'
                  )}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDisable}
                  className={cn(
                    'flex flex-1 items-center justify-center rounded-lg px-4 py-2.5',
                    'bg-red-500/20 text-sm font-semibold text-red-400',
                    'transition-all hover:bg-red-500/30',
                    'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-background-dark'
                  )}
                >
                  Disable SSO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SsoConnectionCard;
