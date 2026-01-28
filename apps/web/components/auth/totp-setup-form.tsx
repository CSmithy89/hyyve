/**
 * TOTP Setup Form Component
 *
 * Story: 1-1-8 MFA Setup - TOTP Authenticator
 * Wireframe: mfa_authenticator_setup/code.html
 *
 * Features:
 * - Two-column layout (QR code / Verification)
 * - QR code display with OTPAuth URI
 * - Manual key input with copy functionality
 * - 6-digit OTP verification input
 * - Countdown timer for secret expiration
 * - Skip/cancel with warning modal
 * - Info boxes (Why do I need this? / Having trouble?)
 * - Loading and error states
 * - Full accessibility with ARIA attributes
 *
 * Integrates with Clerk TOTP APIs:
 * - user.createTOTP() - Generate new TOTP secret
 * - user.verifyTOTP({ code }) - Verify the TOTP code
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils';

import { OtpInput } from './otp-input';
import { QrCodeDisplay } from './qr-code-display';
import { ManualKeyInput } from './manual-key-input';
import { SetupTimer } from './setup-timer';
import { TotpInfoBox } from './totp-info-box';
import { SkipTotpWarningModal } from './skip-totp-warning-modal';

/**
 * Props for the TotpSetupForm component
 */
export interface TotpSetupFormProps {
  /** Initial time in seconds for the countdown timer (default: 300) */
  initialTime?: number;
  /** Callback when verification succeeds */
  onVerifySuccess?: () => void;
  /** Callback when user skips setup */
  onSkip?: () => void;
  /** Callback when timer expires */
  onExpire?: () => void;
  /** Test-only: Pre-populated TOTP data to bypass async loading */
  __testTotpData?: TotpData;
}

/**
 * TOTP data interface
 */
interface TotpData {
  secret: string;
  uri: string;
  verified: boolean;
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
 * TotpSetupForm Component
 *
 * Main form component for TOTP authenticator setup.
 * Handles QR code display, manual key entry, OTP verification,
 * and the complete setup flow.
 */
export function TotpSetupForm({
  initialTime = 300,
  onVerifySuccess,
  onSkip,
  onExpire,
  __testTotpData,
}: TotpSetupFormProps) {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  // State - use test data if provided
  const [totpData, setTotpData] = React.useState<TotpData | null>(__testTotpData || null);
  const [otpCode, setOtpCode] = React.useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = React.useState(!__testTotpData);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showWarningModal, setShowWarningModal] = React.useState(false);

  // Refs
  const otpInputRef = React.useRef<HTMLDivElement>(null);

  /**
   * Generate TOTP secret on mount (skip if test data is provided)
   */
  React.useEffect(() => {
    // Skip generation if test data is provided
    if (__testTotpData) return;

    if (!isLoaded || !user) return;

    // Track if effect is still mounted
    let isMounted = true;

    setIsLoading(true);

    // Use .then() instead of async/await to better handle fake timer environments
    user
      .createTOTP()
      .then((totp) => {
        if (isMounted) {
          setTotpData({
            secret: totp.secret || '',
            uri: totp.uri || '',
            verified: totp.verified || false,
          });
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to generate TOTP:', err);
        if (isMounted) {
          setError('Failed to generate authenticator setup. Please try again.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user, isLoaded, __testTotpData]);

  /**
   * Check if OTP code is complete
   */
  const isCodeComplete = otpCode.every((digit) => digit !== '');

  /**
   * Handle OTP verification
   */
  const handleVerify = async () => {
    if (!user || !isCodeComplete) return;

    const code = otpCode.join('');

    try {
      setIsVerifying(true);
      setError(null);
      await user.verifyTOTP({ code });

      // Success - call callback and navigate
      onVerifySuccess?.();
      router.push('/auth/mfa-setup/backup');
    } catch (err) {
      console.error('TOTP verification failed:', err);
      setError('Invalid verification code. Please try again.');

      // Clear inputs and refocus first input
      setOtpCode(['', '', '', '', '', '']);
      // Focus first input on next tick
      setTimeout(() => {
        const firstInput = otpInputRef.current?.querySelector('input');
        firstInput?.focus();
      }, 0);
    } finally {
      setIsVerifying(false);
    }
  };

  /**
   * Handle skip button click
   */
  const handleSkip = () => {
    setShowWarningModal(true);
  };

  /**
   * Handle confirming skip
   */
  const handleConfirmSkip = () => {
    setShowWarningModal(false);
    onSkip?.();
    router.push('/settings/security');
  };

  /**
   * Handle timer expiration
   */
  const handleTimerExpire = () => {
    onExpire?.();
    router.push('/auth/mfa-setup');
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
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex gap-6">
            <Link
              href="/dashboard"
              className="text-gray-600 dark:text-text-secondary hover:text-primary dark:hover:text-white text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/deployments"
              className="text-gray-600 dark:text-text-secondary hover:text-primary dark:hover:text-white text-sm font-medium transition-colors"
            >
              Deployments
            </Link>
            <span className="text-primary dark:text-white text-sm font-medium">
              Settings
            </span>
            <Link
              href="/support"
              className="text-gray-600 dark:text-text-secondary hover:text-primary dark:hover:text-white text-sm font-medium transition-colors"
            >
              Support
            </Link>
          </nav>
          <div className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-surface-border">
            <span className="text-xs text-gray-500 dark:text-text-secondary hidden sm:block">
              {user?.emailAddresses?.[0]?.emailAddress || 'user@example.com'}
            </span>
            <div
              className="bg-center bg-no-repeat bg-cover rounded-full size-9 ring-2 ring-primary/20"
              aria-label="User profile avatar"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex justify-center py-10 px-4 sm:px-6">
        <div className="w-full max-w-4xl flex flex-col gap-8">
          {/* Page Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-primary mb-1">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <Link
                href="/settings/security"
                className="text-sm font-medium hover:underline"
              >
                Back to Security Settings
              </Link>
            </div>
            <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight">
              Enable Two-Factor Authentication
            </h1>
            <p className="text-gray-500 dark:text-text-secondary text-base">
              Secure your account by setting up an authenticator app like Google Authenticator or Authy.
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-border rounded-xl p-6 md:p-10 shadow-sm">
              <div className="flex items-center justify-center py-12">
                <span className="animate-spin material-symbols-outlined text-[32px] text-primary">
                  progress_activity
                </span>
                <span className="ml-3 text-text-secondary">Generating authenticator setup...</span>
              </div>
            </div>
          )}

          {/* Content Card */}
          {!isLoading && totpData && (
            <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-border rounded-xl p-6 md:p-10 shadow-sm flex flex-col md:flex-row gap-10">
              {/* Left Column: Scan / Key */}
              <div className="flex-1 flex flex-col gap-6 border-b md:border-b-0 md:border-r border-gray-200 dark:border-surface-border pb-8 md:pb-0 md:pr-10">
                {/* Step 1 Indicator */}
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    1
                  </div>
                  <h3 className="text-gray-900 dark:text-white font-semibold text-lg">
                    Scan QR Code
                  </h3>
                </div>

                <p className="text-sm text-gray-500 dark:text-text-secondary">
                  Open your authenticator app and scan the image below.
                </p>

                {/* QR Code */}
                <QrCodeDisplay uri={totpData.uri} />

                {/* Manual Key */}
                <ManualKeyInput secretKey={totpData.secret} />
              </div>

              {/* Right Column: Verify */}
              <div className="flex-1 flex flex-col gap-6">
                {/* Step 2 Indicator */}
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    2
                  </div>
                  <h3 className="text-gray-900 dark:text-white font-semibold text-lg">
                    Verify Code
                  </h3>
                </div>

                <p className="text-sm text-gray-500 dark:text-text-secondary">
                  Enter the 6-digit verification code generated by your app.
                </p>

                {/* OTP Input */}
                <div ref={otpInputRef} className="py-2">
                  <OtpInput
                    value={otpCode}
                    onChange={setOtpCode}
                    disabled={isVerifying}
                    error={!!error}
                    autoFocus={false}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div
                    role="alert"
                    className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
                  >
                    {error}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex flex-col gap-4">
                  <button
                    type="button"
                    onClick={handleVerify}
                    disabled={!isCodeComplete || isVerifying}
                    aria-busy={isVerifying}
                    className={cn(
                      'w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg',
                      'shadow-lg shadow-primary/25 transition-all',
                      'flex items-center justify-center gap-2',
                      'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark',
                      (!isCodeComplete || isVerifying) && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {isVerifying ? (
                      <>
                        <span className="animate-spin material-symbols-outlined text-[18px]">
                          progress_activity
                        </span>
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify & Enable</span>
                        <span className="material-symbols-outlined text-[18px]">
                          check_circle
                        </span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleSkip}
                      className="text-sm text-gray-500 dark:text-text-secondary hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                    >
                      I'll do this later
                    </button>

                    {/* Timer */}
                    <SetupTimer
                      initialSeconds={initialTime}
                      onExpire={handleTimerExpire}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info Boxes */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <TotpInfoBox
                icon="lock"
                title="Why do I need this?"
                content="MFA adds a layer of protection to your Hyyve account. Even if your password is stolen, your account remains secure."
                variant="primary"
              />
              <TotpInfoBox
                icon="help"
                title="Having trouble?"
                content={
                  <>
                    Contact our{' '}
                    <Link href="/support" className="text-primary hover:underline">
                      support team
                    </Link>{' '}
                    if you are unable to scan the code or verify your device.
                  </>
                }
                variant="default"
              />
            </div>
          )}
        </div>
      </main>

      {/* Skip Warning Modal */}
      <SkipTotpWarningModal
        open={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        onConfirmSkip={handleConfirmSkip}
      />
    </div>
  );
}

export default TotpSetupForm;
