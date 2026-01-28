/**
 * SMS MFA Setup Form Component
 *
 * Story: 1-1-10 MFA SMS Verification
 *
 * Features:
 * - Two-step flow: phone entry -> code verification
 * - Phone number input with country code selector
 * - 6-digit SMS code verification using OtpInput
 * - Resend code with 60-second cooldown
 * - Skip setup with security warning
 * - Error handling for invalid codes
 * - Loading states during API calls
 * - Accessible with proper ARIA labels
 *
 * Design tokens from wireframe:
 * - Background: bg-background-dark (#131221)
 * - Surface: bg-surface-dark (#1c1b2e)
 * - Border: border-border-dark (#272546)
 * - Primary: #5048e5
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils';

import { PhoneInput } from './phone-input';
import { OtpInput } from './otp-input';
import { SkipMfaWarningModal } from './skip-mfa-warning-modal';
import { TotpInfoBox } from './totp-info-box';

/**
 * Props for the SmsMfaSetupForm component
 */
export interface SmsMfaSetupFormProps {
  /** Callback when SMS verification succeeds */
  onVerifySuccess?: () => void;
  /** Callback when user skips setup */
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
 * Step indicator component
 */
function StepIndicator({
  step,
  label,
  active,
}: {
  step: number;
  label: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div
        className={cn(
          'size-8 rounded-full flex items-center justify-center font-bold text-sm',
          active
            ? 'bg-primary text-white'
            : 'bg-surface-dark border border-border-dark text-text-secondary'
        )}
      >
        {step}
      </div>
      <span
        className={cn(
          'font-medium',
          active ? 'text-white' : 'text-text-secondary'
        )}
      >
        {label}
      </span>
    </div>
  );
}

/**
 * Mask phone number for display (show last 4 digits)
 */
function maskPhoneNumber(phone: string): string {
  if (phone.length < 4) return phone;
  const last4 = phone.slice(-4);
  return `***-***-${last4}`;
}

/**
 * SmsMfaSetupForm Component
 */
export function SmsMfaSetupForm({
  onVerifySuccess,
  onSkip,
}: SmsMfaSetupFormProps) {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  // State
  const [step, setStep] = React.useState<'phone-entry' | 'code-verification'>('phone-entry');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [countryCode, setCountryCode] = React.useState('+1');
  const [verificationCode, setVerificationCode] = React.useState(['', '', '', '', '', '']);
  const [isSendingCode, setIsSendingCode] = React.useState(false);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showWarningModal, setShowWarningModal] = React.useState(false);
  const [resendCooldown, setResendCooldown] = React.useState(0);
  const [phoneNumberId, setPhoneNumberId] = React.useState<string | null>(null);

  // Refs
  const skipButtonRef = React.useRef<HTMLButtonElement>(null);

  // Resend cooldown timer
  React.useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  /**
   * Validate phone number (minimum 10 digits)
   */
  const isPhoneValid = phoneNumber.length >= 10;

  /**
   * Check if verification code is complete
   */
  const isCodeComplete = verificationCode.every((d) => d !== '');

  /**
   * Handle sending verification code
   */
  const handleSendCode = async () => {
    if (!user || !isPhoneValid) return;

    setIsSendingCode(true);
    setError(null);

    try {
      // Create phone number in Clerk
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      const phone = await user.createPhoneNumber({ phoneNumber: fullPhoneNumber });

      // Send verification code
      await phone.prepareVerification();

      setPhoneNumberId(phone.id);
      setStep('code-verification');
      setResendCooldown(60);
    } catch (err) {
      console.error('Failed to send verification code:', err);
      setError('Failed to send verification code. Please check your phone number and try again.');
    } finally {
      setIsSendingCode(false);
    }
  };

  /**
   * Handle resending verification code
   */
  const handleResendCode = async () => {
    if (!user || !phoneNumberId || resendCooldown > 0) return;

    setIsSendingCode(true);
    setError(null);

    try {
      // Find the phone number object
      const phone = user.phoneNumbers?.find((p) => p.id === phoneNumberId);
      if (phone) {
        await phone.prepareVerification();
        setResendCooldown(60);
        setVerificationCode(['', '', '', '', '', '']);
      }
    } catch (err) {
      console.error('Failed to resend code:', err);
      setError('Failed to resend verification code. Please try again.');
    } finally {
      setIsSendingCode(false);
    }
  };

  /**
   * Handle verifying SMS code
   */
  const handleVerify = async () => {
    if (!user || !phoneNumberId || !isCodeComplete) return;

    setIsVerifying(true);
    setError(null);

    try {
      const code = verificationCode.join('');

      // Find the phone number object
      const phone = user.phoneNumbers?.find((p) => p.id === phoneNumberId);
      if (phone) {
        await phone.attemptVerification({ code });

        // Set as primary phone and enable MFA
        await user.update({ primaryPhoneNumberId: phone.id });

        onVerifySuccess?.();
        router.push('/auth/mfa-setup/backup');
      }
    } catch (err) {
      console.error('Verification failed:', err);
      setError('Invalid verification code. Please try again.');
      // Clear inputs and refocus
      setVerificationCode(['', '', '', '', '', '']);
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
   * Handle closing the warning modal
   */
  const handleCloseWarningModal = () => {
    setShowWarningModal(false);
    requestAnimationFrame(() => {
      skipButtonRef.current?.focus();
    });
  };

  /**
   * Handle confirming skip
   */
  const handleConfirmSkip = () => {
    setShowWarningModal(false);
    onSkip?.();
    router.push('/settings/security');
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-dark">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="size-12 rounded-lg bg-surface-dark" />
          <div className="h-4 w-32 rounded bg-surface-dark" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-dark text-white font-display antialiased selection:bg-primary/30 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 flex w-full items-center justify-between border-b border-border-dark bg-background-dark/80 px-6 py-4 backdrop-blur-md md:px-10">
        <div className="flex items-center gap-4 text-white">
          <HyyveLogo />
          <h2 className="text-lg font-bold leading-tight tracking-tight">Hyyve</h2>
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
            aria-label="User profile"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center px-4 py-8 md:px-0 md:py-12">
        <div className="flex w-full max-w-lg flex-col gap-8">
          {/* Back Link */}
          <Link
            href="/auth/mfa-setup"
            className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-white transition-colors w-fit"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Method Selection
          </Link>

          {/* Page Heading */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Setup SMS Verification
            </h1>
            <p className="text-base text-text-secondary md:text-lg">
              Receive verification codes via text message to your phone.
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-surface-dark border border-border-dark rounded-xl p-6 md:p-8">
            {/* Step 1: Phone Entry */}
            {step === 'phone-entry' && (
              <>
                <StepIndicator step={1} label="Enter Phone Number" active={true} />

                <div className="flex flex-col gap-4">
                  <PhoneInput
                    value={phoneNumber}
                    countryCode={countryCode}
                    onChange={setPhoneNumber}
                    onCountryCodeChange={setCountryCode}
                    disabled={isSendingCode}
                    error={!!error}
                  />

                  {error && (
                    <div role="alert" className="text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={!isPhoneValid || isSendingCode}
                    aria-busy={isSendingCode}
                    className={cn(
                      'w-full flex items-center justify-center gap-2',
                      'bg-primary px-6 py-3 text-sm font-semibold text-white rounded-lg',
                      'shadow-lg shadow-primary/25 transition-all',
                      'hover:bg-primary-hover',
                      'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark',
                      (!isPhoneValid || isSendingCode) && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {isSendingCode ? (
                      <>
                        <span className="animate-spin material-symbols-outlined text-[18px]">
                          progress_activity
                        </span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">send</span>
                        Send Verification Code
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Step 2: Code Verification */}
            {step === 'code-verification' && (
              <>
                <StepIndicator step={2} label="Enter Verification Code" active={true} />

                <div className="flex flex-col gap-4">
                  {/* Phone display */}
                  <div className="text-center text-text-secondary text-sm mb-2">
                    Code sent to {maskPhoneNumber(phoneNumber)}
                  </div>

                  {/* OTP Input */}
                  <div className="flex justify-center">
                    <OtpInput
                      value={verificationCode}
                      onChange={setVerificationCode}
                      disabled={isVerifying}
                      error={!!error}
                      autoFocus
                    />
                  </div>

                  {error && (
                    <div role="alert" className="text-red-400 text-sm text-center">
                      {error}
                    </div>
                  )}

                  {/* Resend button */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={resendCooldown > 0 || isSendingCode}
                      className={cn(
                        'text-sm font-medium transition-colors',
                        resendCooldown > 0
                          ? 'text-text-secondary cursor-not-allowed'
                          : 'text-primary hover:text-primary-hover'
                      )}
                    >
                      {resendCooldown > 0 ? (
                        <>Resend code in {resendCooldown}s</>
                      ) : (
                        'Resend code'
                      )}
                    </button>
                  </div>

                  {/* Verify button */}
                  <button
                    type="button"
                    onClick={handleVerify}
                    disabled={!isCodeComplete || isVerifying}
                    aria-busy={isVerifying}
                    className={cn(
                      'w-full flex items-center justify-center gap-2',
                      'bg-primary px-6 py-3 text-sm font-semibold text-white rounded-lg',
                      'shadow-lg shadow-primary/25 transition-all',
                      'hover:bg-primary-hover',
                      'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark',
                      (!isCodeComplete || isVerifying) && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {isVerifying ? (
                      <>
                        <span className="animate-spin material-symbols-outlined text-[18px]">
                          progress_activity
                        </span>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">check</span>
                        Verify & Enable
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Divider */}
            <div className="border-t border-border-dark my-6" />

            {/* Skip button */}
            <button
              ref={skipButtonRef}
              type="button"
              onClick={handleSkip}
              className="w-full text-center text-sm font-medium text-text-secondary hover:text-white transition-colors"
            >
              I&apos;ll do this later
            </button>
          </div>

          {/* Info Boxes */}
          <div className="flex flex-col gap-4">
            <TotpInfoBox
              icon="lock"
              title="Why SMS verification?"
              content="SMS verification adds an extra layer of security by requiring a code sent to your phone in addition to your password. This helps protect your account even if your password is compromised."
              variant="primary"
            />

            <TotpInfoBox
              icon="help"
              title="Didn't receive the code?"
              content="Make sure your phone number is correct and check your message inbox. If you still don't receive it, try resending the code or contact our support team."
              variant="default"
            />
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

export default SmsMfaSetupForm;
