/**
 * MFA Login Form Component
 *
 * Story: 1-1-11 MFA Login Verification
 * Wireframe: hyyve_login_page/code.html
 *
 * Features:
 * - Multi-method MFA verification (TOTP, SMS, Backup codes)
 * - Tab-based method selection
 * - 6-digit OTP input with auto-advance
 * - 8-character backup code input
 * - Loading and error states
 * - Recovery options (Lost access?)
 * - Full accessibility with ARIA attributes
 *
 * Integrates with Clerk MFA APIs:
 * - signIn.attemptSecondFactor({ strategy: 'totp', code })
 * - signIn.prepareSecondFactor({ strategy: 'phone_code' })
 * - signIn.attemptSecondFactor({ strategy: 'backup_code', code })
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSignIn } from '@clerk/nextjs';
import { cn } from '@/lib/utils';

import { OtpInput } from './otp-input';

/**
 * Props for the MfaLoginForm component
 */
export interface MfaLoginFormProps {
  /** Callback when verification succeeds */
  onSuccess?: () => void;
  /** Callback when user cancels */
  onCancel?: () => void;
  /** Redirect URL after successful verification */
  redirectUrl?: string;
}

/**
 * Verification method type
 */
type VerificationMethod = 'totp' | 'sms' | 'backup';

/**
 * Hyyve Logo Component
 */
function HyyveLogo() {
  return (
    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/25">
      <svg
        className="size-8 text-white"
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
 * MfaLoginForm Component
 *
 * Handles MFA verification during login flow with support for
 * TOTP, SMS, and backup code verification methods.
 */
export function MfaLoginForm({
  onSuccess,
  onCancel,
  redirectUrl = '/dashboard',
}: MfaLoginFormProps) {
  const router = useRouter();
  const { signIn, setActive } = useSignIn();

  // State
  const [method, setMethod] = React.useState<VerificationMethod>('totp');
  const [otpCode, setOtpCode] = React.useState<string[]>(['', '', '', '', '', '']);
  const [backupCode, setBackupCode] = React.useState('');
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isSendingSms, setIsSendingSms] = React.useState(false);
  const [smsSent, setSmsSent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showRecoveryOptions, setShowRecoveryOptions] = React.useState(false);

  // Refs
  const otpInputRef = React.useRef<HTMLDivElement>(null);
  const backupInputRef = React.useRef<HTMLInputElement>(null);

  /**
   * Get available MFA methods from signIn object
   */
  const availableMethods = React.useMemo(() => {
    if (!signIn?.supportedSecondFactors) {
      return ['totp', 'backup'] as VerificationMethod[];
    }
    const methods: VerificationMethod[] = [];
    for (const factor of signIn.supportedSecondFactors) {
      if (factor.strategy === 'totp') methods.push('totp');
      if (factor.strategy === 'phone_code') methods.push('sms');
      if (factor.strategy === 'backup_code') methods.push('backup');
    }
    // Always include backup as fallback
    if (!methods.includes('backup')) methods.push('backup');
    return methods;
  }, [signIn?.supportedSecondFactors]);

  /**
   * Check if code is complete
   */
  const isCodeComplete =
    method === 'backup'
      ? backupCode.length >= 8
      : otpCode.every((digit) => digit !== '');

  /**
   * Handle TOTP/SMS verification
   */
  const handleOtpVerify = async () => {
    if (!signIn || !isCodeComplete) return;

    const code = otpCode.join('');

    try {
      setIsVerifying(true);
      setError(null);

      const result = await signIn.attemptSecondFactor({
        strategy: method === 'sms' ? 'phone_code' : 'totp',
        code,
      });

      if (result.status === 'complete') {
        await setActive?.({ session: result.createdSessionId });
        onSuccess?.();
        router.push(redirectUrl);
      }
    } catch (err) {
      console.error('MFA verification failed:', err);
      setError('Invalid verification code. Please try again.');

      // Clear inputs and refocus
      setOtpCode(['', '', '', '', '', '']);
      setTimeout(() => {
        const firstInput = otpInputRef.current?.querySelector('input');
        firstInput?.focus();
      }, 0);
    } finally {
      setIsVerifying(false);
    }
  };

  /**
   * Handle backup code verification
   */
  const handleBackupVerify = async () => {
    if (!signIn || !isCodeComplete) return;

    try {
      setIsVerifying(true);
      setError(null);

      const result = await signIn.attemptSecondFactor({
        strategy: 'backup_code',
        code: backupCode.toUpperCase(),
      });

      if (result.status === 'complete') {
        await setActive?.({ session: result.createdSessionId });
        onSuccess?.();
        router.push(redirectUrl);
      }
    } catch (err) {
      console.error('Backup code verification failed:', err);
      setError('Invalid backup code. Please try again.');

      // Clear input and refocus
      setBackupCode('');
      setTimeout(() => {
        backupInputRef.current?.focus();
      }, 0);
    } finally {
      setIsVerifying(false);
    }
  };

  /**
   * Handle verification submit
   */
  const handleVerify = async () => {
    if (method === 'backup') {
      await handleBackupVerify();
    } else {
      await handleOtpVerify();
    }
  };

  /**
   * Request SMS code
   */
  const handleRequestSms = async () => {
    if (!signIn) return;

    try {
      setIsSendingSms(true);
      setError(null);

      await signIn.prepareSecondFactor({
        strategy: 'phone_code',
      });

      setSmsSent(true);
    } catch (err) {
      console.error('Failed to send SMS:', err);
      setError('Failed to send verification code. Please try again.');
    } finally {
      setIsSendingSms(false);
    }
  };

  /**
   * Handle method change
   */
  const handleMethodChange = (newMethod: VerificationMethod) => {
    setMethod(newMethod);
    setError(null);
    setOtpCode(['', '', '', '', '', '']);
    setBackupCode('');
    setSmsSent(false);
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    onCancel?.();
    router.push('/auth/login');
  };

  /**
   * Get method label
   */
  const getMethodLabel = (m: VerificationMethod) => {
    switch (m) {
      case 'totp':
        return 'Authenticator';
      case 'sms':
        return 'SMS';
      case 'backup':
        return 'Backup Code';
    }
  };

  return (
    <div className="dark relative flex min-h-screen w-full flex-col justify-center items-center overflow-hidden bg-background-dark">
      {/* Background Effects - matching login page wireframe */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-40 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-[440px] px-4 py-8">
        {/* Card Container */}
        <div className="flex flex-col w-full bg-white dark:bg-card-dark rounded-xl shadow-2xl border border-slate-200 dark:border-border-dark overflow-hidden p-8 sm:p-10 relative z-10">
          {/* Logo & Header */}
          <div className="flex flex-col items-center justify-center mb-8 gap-4">
            <HyyveLogo />
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
                Verify Your Identity
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Enter your verification code to continue
              </p>
            </div>
          </div>

          {/* Method Selection Tabs */}
          {availableMethods.length > 1 && (
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-background-dark rounded-lg mb-6">
              {availableMethods.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleMethodChange(m)}
                  className={cn(
                    'flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark',
                    method === m
                      ? 'bg-white dark:bg-card-dark text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  )}
                  aria-pressed={method === m}
                >
                  {getMethodLabel(m)}
                </button>
              ))}
            </div>
          )}

          {/* TOTP Input */}
          {method === 'totp' && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                Enter the 6-digit code from your authenticator app
              </p>
              <div ref={otpInputRef} className="flex justify-center py-4">
                <OtpInput
                  value={otpCode}
                  onChange={setOtpCode}
                  disabled={isVerifying}
                  error={!!error}
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* SMS Input */}
          {method === 'sms' && (
            <div className="flex flex-col gap-4">
              {!smsSent ? (
                <>
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                    We'll send a verification code to your registered phone number
                  </p>
                  <button
                    type="button"
                    onClick={handleRequestSms}
                    disabled={isSendingSms}
                    className={cn(
                      'w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg',
                      'shadow-lg shadow-primary/25 transition-all',
                      'flex items-center justify-center gap-2',
                      'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark',
                      isSendingSms && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {isSendingSms ? (
                      <>
                        <span className="animate-spin material-symbols-outlined text-[18px]">
                          progress_activity
                        </span>
                        <span>Sending...</span>
                      </>
                    ) : (
                      'Send Code'
                    )}
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                    Enter the 6-digit code sent to your phone
                  </p>
                  <div ref={otpInputRef} className="flex justify-center py-4">
                    <OtpInput
                      value={otpCode}
                      onChange={setOtpCode}
                      disabled={isVerifying}
                      error={!!error}
                      autoFocus
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRequestSms}
                    disabled={isSendingSms}
                    className="text-sm text-primary hover:text-primary/80 transition-colors text-center"
                  >
                    Resend code
                  </button>
                </>
              )}
            </div>
          )}

          {/* Backup Code Input */}
          {method === 'backup' && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                Enter one of your 8-character backup codes
              </p>
              <input
                ref={backupInputRef}
                type="text"
                value={backupCode}
                onChange={(e) => setBackupCode(e.target.value.toUpperCase().slice(0, 8))}
                placeholder="XXXXXXXX"
                disabled={isVerifying}
                aria-label="Backup code"
                className={cn(
                  'w-full text-center text-xl font-mono font-bold tracking-widest',
                  'py-3 px-4 rounded-lg',
                  'bg-slate-50 dark:bg-background-dark',
                  'border outline-none transition-all',
                  'text-slate-900 dark:text-white',
                  'placeholder-slate-400',
                  error
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                    : 'border-slate-300 dark:border-border-dark focus:ring-2 focus:ring-primary focus:border-primary',
                  isVerifying && 'opacity-50 cursor-not-allowed'
                )}
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="mt-4 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-center"
            >
              {error}
            </div>
          )}

          {/* Verify Button */}
          {(method !== 'sms' || smsSent) && (
            <button
              type="button"
              onClick={handleVerify}
              disabled={!isCodeComplete || isVerifying}
              aria-busy={isVerifying}
              className={cn(
                'mt-6 w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-lg',
                'shadow-lg shadow-primary/25 transition-all active:scale-[0.98]',
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
                'Verify'
              )}
            </button>
          )}

          {/* Divider */}
          <div className="relative mt-6 mb-4">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-border-dark" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-card-dark px-3 text-xs text-slate-500">
                or
              </span>
            </div>
          </div>

          {/* Lost Access Link */}
          <button
            type="button"
            onClick={() => setShowRecoveryOptions(true)}
            className="text-sm text-primary hover:text-primary/80 transition-colors text-center"
          >
            Lost access? Need help?
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={handleCancel}
            className="mt-4 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-center"
          >
            Back to login
          </button>
        </div>

        {/* Recovery Options Modal */}
        {showRecoveryOptions && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowRecoveryOptions(false)}
          >
            <div
              className="w-full max-w-md bg-white dark:bg-card-dark rounded-xl shadow-2xl border border-slate-200 dark:border-border-dark p-6"
              onClick={(e) => e.stopPropagation()}
              data-testid="recovery-options"
            >
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Recovery Options
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-background-dark rounded-lg">
                  <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                    Use a backup code
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    If you saved your backup codes during MFA setup, you can use one to sign in.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRecoveryOptions(false);
                      handleMethodChange('backup');
                    }}
                    className="mt-3 text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    Enter backup code
                  </button>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-background-dark rounded-lg">
                  <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                    Contact support
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    If you've lost access to all your MFA methods, our support team can help.
                  </p>
                  <Link
                    href="/support"
                    className="mt-3 inline-block text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    Get help
                  </Link>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRecoveryOptions(false)}
                className="mt-6 w-full py-2 px-4 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MfaLoginForm;
