/**
 * MFA Method Selection Component
 *
 * Story: 1-1-7 MFA Setup - Method Selection
 * Wireframe: mfa_method_selection/code.html
 *
 * Features:
 * - Display three MFA method options (Authenticator App, SMS, Email)
 * - Authenticator App pre-selected by default and marked as "Recommended"
 * - Selection visual feedback with border/background changes
 * - Continue button navigates to method-specific setup
 * - Cancel button shows security warning modal
 * - Breadcrumb navigation
 * - Info box explaining 2FA benefits
 * - Responsive design (mobile, tablet, desktop)
 * - Full accessibility with ARIA attributes and keyboard navigation
 *
 * Design tokens from wireframe:
 * - Page max-width: max-w-[640px]
 * - Background: bg-background-dark (#131221)
 * - Surface: bg-surface-dark (#1c1b2e)
 * - Border: border-border-dark (#272546)
 * - Primary: #5048e5
 * - Text secondary: text-text-secondary (#9795c6)
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

import { MfaMethodCard, type MfaMethod } from './mfa-method-card';
import { MfaInfoBox } from './mfa-info-box';
import { SkipMfaWarningModal } from './skip-mfa-warning-modal';

/**
 * MFA Method configuration
 */
const MFA_METHODS = [
  {
    method: 'app' as MfaMethod,
    title: 'Authenticator App',
    description:
      'Use Google Authenticator, Authy, or 1Password to generate time-based codes.',
    icon: 'phonelink_lock',
    recommended: true,
    route: '/auth/mfa-setup/authenticator',
  },
  {
    method: 'sms' as MfaMethod,
    title: 'SMS Verification',
    description:
      'Receive a unique one-time code via text message to your mobile device.',
    icon: 'sms',
    recommended: false,
    route: '/auth/mfa-setup/sms',
  },
  {
    method: 'email' as MfaMethod,
    title: 'Email Verification',
    description:
      'Receive a unique one-time code via your registered email address.',
    icon: 'mail',
    recommended: false,
    route: '/auth/mfa-setup/email',
  },
];

/**
 * Props for the MfaMethodSelection component
 */
export interface MfaMethodSelectionProps {
  /** Callback when method selection changes */
  onMethodSelect?: (method: MfaMethod) => void;
  /** Callback when Continue button is clicked */
  onContinue?: (method: MfaMethod) => void;
  /** Callback when user confirms skipping MFA */
  onSkip?: () => void;
}

/**
 * Hyyve Logo Component
 */
function HyyveLogo() {
  return (
    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
      <svg
        className="size-5"
        fill="none"
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

/**
 * MfaMethodSelection Component
 *
 * Main component for the MFA method selection page.
 * Allows users to choose between Authenticator App, SMS, or Email
 * for their two-factor authentication method.
 */
export function MfaMethodSelection({
  onMethodSelect,
  onContinue,
  onSkip,
}: MfaMethodSelectionProps) {
  const router = useRouter();

  // State
  const [selectedMethod, setSelectedMethod] = React.useState<MfaMethod>('app');
  const [isLoading, setIsLoading] = React.useState(false);
  const [showWarningModal, setShowWarningModal] = React.useState(false);

  // Refs
  const cancelButtonRef = React.useRef<HTMLButtonElement>(null);

  /**
   * Handle method selection change
   */
  const handleMethodChange = (method: MfaMethod) => {
    setSelectedMethod(method);
    onMethodSelect?.(method);
  };

  /**
   * Handle Continue button click
   */
  const handleContinue = async () => {
    setIsLoading(true);

    try {
      // Call the optional callback
      if (onContinue) {
        onContinue(selectedMethod);
      }

      // Find the route for the selected method
      const methodConfig = MFA_METHODS.find((m) => m.method === selectedMethod);
      if (methodConfig) {
        router.push(methodConfig.route);
      }
    } catch {
      // Reset loading state on error
      setIsLoading(false);
    }
  };

  /**
   * Handle Cancel button click
   */
  const handleCancel = () => {
    setShowWarningModal(true);
  };

  /**
   * Handle closing the warning modal
   */
  const handleCloseWarningModal = () => {
    setShowWarningModal(false);
    // Return focus to cancel button after dialog closes
    // Using requestAnimationFrame to ensure DOM has updated
    requestAnimationFrame(() => {
      cancelButtonRef.current?.focus();
    });
  };

  /**
   * Handle confirming skip
   */
  const handleConfirmSkip = () => {
    setShowWarningModal(false);
    if (onSkip) {
      onSkip();
    }
    // Navigate to settings or dashboard
    router.push('/settings/security');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-dark text-white font-display antialiased selection:bg-primary/30 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 flex w-full items-center justify-between border-b border-border-dark bg-background-dark/80 px-6 py-4 backdrop-blur-md md:px-10">
        <div className="flex items-center gap-4 text-white">
          <HyyveLogo />
          <h2 className="text-lg font-bold leading-tight tracking-tight">
            Hyyve
          </h2>
        </div>
        <div className="flex items-center gap-6">
          <button
            type="button"
            className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">help</span>
            <span className="hidden sm:block">Support</span>
          </button>
          <div className="h-8 w-[1px] bg-border-dark" />
          <div
            className="size-9 overflow-hidden rounded-full bg-surface-dark border border-border-dark ring-2 ring-transparent hover:ring-primary/50 transition-all cursor-pointer"
            data-alt="User profile avatar"
            aria-label="User profile"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center px-4 py-8 md:px-0 md:py-12">
        <div className="flex w-full max-w-[640px] flex-col gap-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm font-medium" aria-label="Breadcrumb">
            <Link
              href="/settings"
              className="text-text-secondary hover:text-white transition-colors"
            >
              Settings
            </Link>
            <span className="text-border-dark select-none" aria-hidden="true">
              /
            </span>
            <Link
              href="/settings/security"
              className="text-text-secondary hover:text-white transition-colors"
            >
              Security
            </Link>
            <span className="text-border-dark select-none" aria-hidden="true">
              /
            </span>
            <span className="text-white" aria-current="page">
              MFA Setup
            </span>
          </nav>

          {/* Page Heading */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Choose Authentication Method
            </h1>
            <p className="text-base text-text-secondary md:text-lg">
              Add an extra layer of security to your Hyyve workspace.
            </p>
          </div>

          {/* Selection Cards */}
          <div
            role="radiogroup"
            aria-label="mfa methods"
            className="flex flex-col gap-4"
          >
            {MFA_METHODS.map((methodConfig) => (
              <MfaMethodCard
                key={methodConfig.method}
                method={methodConfig.method}
                title={methodConfig.title}
                description={methodConfig.description}
                icon={methodConfig.icon}
                selected={selectedMethod === methodConfig.method}
                onChange={handleMethodChange}
                recommended={methodConfig.recommended}
              />
            ))}
          </div>

          {/* Info Box */}
          <MfaInfoBox
            content="Two-factor authentication provides enhanced protection for your account by requiring more than just a password to log in. This significantly reduces the chance of unauthorized access."
          />

          {/* Action Buttons */}
          <div className="mt-4 flex w-full flex-col gap-3 sm:flex-row">
            <button
              ref={cancelButtonRef}
              type="button"
              onClick={handleCancel}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-lg',
                'bg-surface-dark border border-border-dark px-6 py-3 text-sm font-semibold text-white',
                'transition-all hover:bg-border-dark',
                'focus:outline-none focus:ring-2 focus:ring-border-dark focus:ring-offset-2 focus:ring-offset-background-dark',
                'sm:w-auto'
              )}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleContinue}
              disabled={isLoading}
              aria-busy={isLoading}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-lg',
                'bg-primary px-6 py-3 text-sm font-semibold text-white',
                'shadow-lg shadow-primary/25 transition-all',
                'hover:bg-primary-hover',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark',
                isLoading && 'opacity-70 cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin material-symbols-outlined text-[18px]">
                    progress_activity
                  </span>
                  Processing...
                </>
              ) : (
                <>
                  Continue Setup
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Skip Warning Modal */}
      <SkipMfaWarningModal
        open={showWarningModal}
        onClose={handleCloseWarningModal}
        onConfirmSkip={handleConfirmSkip}
      />
    </div>
  );
}

export default MfaMethodSelection;
