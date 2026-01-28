/**
 * Skip TOTP Warning Modal Component
 *
 * Story: 1-1-8 MFA Setup - TOTP Authenticator
 * AC9: Skip/Cancel Setup
 *
 * Features:
 * - Security warning dialog when user tries to skip TOTP setup
 * - Two action buttons: Skip for Now / Return to Setup
 * - Accessible with proper ARIA attributes
 * - Focus management and keyboard navigation
 * - Uses shadcn Dialog component
 *
 * Design tokens:
 * - Warning icon: text-amber-500
 * - Skip button: Destructive red styling
 * - Return button: Primary styling
 */

'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

/**
 * Props for the SkipTotpWarningModal component
 */
export interface SkipTotpWarningModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Callback when user confirms skipping TOTP */
  onConfirmSkip: () => void;
}

/**
 * Warning Icon Component
 */
function WarningIcon({ className }: { className?: string }) {
  return (
    <span
      data-testid="warning-icon"
      className={cn('material-symbols-outlined', className)}
      aria-hidden="true"
    >
      warning
    </span>
  );
}

/**
 * SkipTotpWarningModal Component
 *
 * A confirmation dialog that warns users about the security risks
 * of skipping TOTP authenticator setup. Provides clear options to either
 * proceed without MFA or return to setup.
 */
export function SkipTotpWarningModal({
  open,
  onClose,
  onConfirmSkip,
}: SkipTotpWarningModalProps) {
  const returnButtonRef = React.useRef<HTMLButtonElement>(null);

  // Focus the return button when modal opens
  React.useEffect(() => {
    if (!open || !returnButtonRef.current) {
      return;
    }
    // Small delay to ensure dialog is rendered
    const timeoutId = setTimeout(() => {
      returnButtonRef.current?.focus();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        aria-modal="true"
        aria-labelledby="skip-totp-title"
        className="bg-surface-dark border-border-dark max-w-md"
      >
        <DialogHeader className="flex flex-col items-center gap-4 pt-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-amber-500/20">
            <WarningIcon className="text-[32px] text-amber-500" />
          </div>
          <div className="text-center">
            <DialogTitle
              id="skip-totp-title"
              className="text-xl font-semibold text-white"
            >
              Skip Authenticator Setup?
            </DialogTitle>
            <DialogDescription className="mt-2 text-text-secondary">
              Your account will be more secure with two-factor authentication enabled.
              We strongly recommend completing this setup to protect against unauthorized access.
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="mt-6 flex flex-col gap-3 sm:flex-col">
          <button
            ref={returnButtonRef}
            type="button"
            onClick={onClose}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-lg',
              'bg-primary px-6 py-3 text-sm font-semibold text-white',
              'shadow-lg shadow-primary/25 transition-all',
              'hover:bg-primary-hover',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark'
            )}
          >
            Return to Setup
          </button>
          <button
            type="button"
            onClick={onConfirmSkip}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-lg',
              'bg-red-500/20 border border-red-500/30 px-6 py-3 text-sm font-semibold text-red-400',
              'transition-all hover:bg-red-500/30',
              'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-background-dark'
            )}
          >
            Skip for Now
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SkipTotpWarningModal;
