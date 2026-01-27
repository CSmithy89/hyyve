/**
 * Registration Form Component
 *
 * Story: 1-1-1 User Registration with Email/Password
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useSignUp } from '@clerk/nextjs';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { validateEmail, validatePassword } from '@/lib/validations/auth';
import { PasswordRequirements } from './password-requirements';
import { PasswordStrengthIndicator } from './password-strength-indicator';
import { RegistrationStepper } from './registration-stepper';
import { SocialAuthButtons } from './social-auth-buttons';

export interface RegistrationFormProps {
  /** Optional callback after successful sign-up */
  onSuccess?: () => void;
}

const registrationSteps = ['Account', 'Organization', 'Review'];

export function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const router = useRouter();
  const { signUp, setActive, isLoaded } = useSignUp();

  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [verificationCode, setVerificationCode] = React.useState('');
  const [errors, setErrors] = React.useState<{ name?: string; email?: string; password?: string }>(
    {}
  );
  const [generalError, setGeneralError] = React.useState<string | null>(null);
  const [socialError, setSocialError] = React.useState<string | null>(null);

  const handleSocialStart = React.useCallback(() => {
    setGeneralError(null);
    setSocialError(null);
  }, []);

  const handleSocialError = React.useCallback((error: Error) => {
    const message = error.message?.toLowerCase() || '';
    if (message.includes('not linked')) {
      setSocialError('This social account is not linked. Try email/password or sign up first.');
      return;
    }
    setSocialError('Social sign-up failed. Please try again or use email/password.');
  }, []);

  const passwordValidation = validatePassword(password);

  const splitName = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) {
      return { firstName: '', lastName: '' };
    }
    const [first, ...rest] = trimmed.split(/\s+/);
    return { firstName: first, lastName: rest.join(' ') };
  };

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setGeneralError(null);
    setSocialError(null);

    if (!isLoaded || !signUp) {
      setGeneralError('Authentication is still loading. Please try again.');
      return;
    }

    const emailResult = validateEmail(email);
    const nextErrors: { name?: string; email?: string; password?: string } = {
      name: fullName.trim() ? undefined : 'Full name is required',
      email: emailResult.isValid ? undefined : emailResult.error,
      password: passwordValidation.isValid ? undefined : passwordValidation.errors[0],
    };

    setErrors(nextErrors);

    if (nextErrors.name || nextErrors.email || nextErrors.password) {
      return;
    }

    setIsSubmitting(true);
    try {
      const { firstName, lastName } = splitName(fullName);

      const signUpAttempt = await signUp.create({
        emailAddress: email,
        password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      });

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/auth/register/org');
        }
        return;
      }

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setIsVerifying(true);
    } catch (error) {
      console.error('Sign-up failed:', error);
      const clerkError = error as { errors?: { message?: string }[]; message?: string };
      const message =
        clerkError.errors?.[0]?.message ||
        clerkError.message ||
        'Failed to create account';
      setGeneralError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerification = async (event: React.FormEvent) => {
    event.preventDefault();
    setGeneralError(null);
    setSocialError(null);

    if (!isLoaded || !signUp) {
      setGeneralError('Authentication is still loading. Please try again.');
      return;
    }

    if (!verificationCode.trim()) {
      setGeneralError('Verification code is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const verificationAttempt = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (verificationAttempt.status === 'complete') {
        await setActive({ session: verificationAttempt.createdSessionId });
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/auth/register/org');
        }
        return;
      }

      setGeneralError('Verification failed. Please try again.');
    } catch {
      setGeneralError('Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      data-testid="registration-card"
      className="flex flex-col w-full bg-[#1c1b32] rounded-2xl border border-[#383663] shadow-2xl p-8 sm:p-10 text-white"
    >
      <div className="flex flex-col items-center justify-center gap-4 mb-8">
        <div
          data-testid="hyyve-logo"
          className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/25"
        >
          <span className="material-symbols-outlined text-white text-[32px]">hive</span>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="text-sm text-[#9795c6]">Start building with Hyyve</p>
        </div>
      </div>

      <div className="mb-8">
        <div data-testid="registration-stepper">
          <RegistrationStepper currentStep={0} steps={registrationSteps} />
        </div>
      </div>

      {!isVerifying && (
        <div className="mb-6">
          <SocialAuthButtons
            mode="signUp"
            showActionText
            fullWidth
            onOAuthStart={handleSocialStart}
            onError={handleSocialError}
            error={socialError || undefined}
          />
        </div>
      )}

      {!isVerifying && (
        <div className="flex items-center gap-3 text-xs text-[#6f6b9b] uppercase tracking-[0.2em] mb-6">
          <span className="h-px flex-1 bg-[#2b284f]" />
          <span>Or continue with email</span>
          <span className="h-px flex-1 bg-[#2b284f]" />
        </div>
      )}

      {generalError && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300"
        >
          {generalError}
        </div>
      )}

      {isVerifying ? (
        <form onSubmit={handleVerification} className="flex flex-col gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#e0def6]" htmlFor="register-code">
              Verification code
            </label>
            <input
              id="register-code"
              name="code"
              type="text"
              inputMode="numeric"
              placeholder="Enter the code from your email"
              value={verificationCode}
              onChange={(event) => setVerificationCode(event.target.value)}
              disabled={isSubmitting}
              className={cn(
                'block w-full rounded-lg border-[#383663] bg-[#121121] py-2.5 px-3 text-sm text-white placeholder-[#6f6b9b] focus:border-primary focus:ring-primary',
                isSubmitting && 'opacity-60 cursor-not-allowed'
              )}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all active:scale-[0.98]',
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-600'
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying...
              </span>
            ) : (
              'Verify email'
            )}
          </button>

          <p className="text-xs text-[#9795c6] text-center">
            Check your inbox for the verification code.
          </p>
        </form>
      ) : (
        <form onSubmit={handleSignUp} className="flex flex-col gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#e0def6]" htmlFor="register-name">
              Full name
            </label>
            <input
              id="register-name"
              name="name"
              type="text"
              placeholder="Jane Doe"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              disabled={isSubmitting}
              aria-describedby={errors.name ? 'register-name-error' : undefined}
              aria-invalid={!!errors.name}
              className={cn(
                'block w-full rounded-lg border-[#383663] bg-[#121121] py-2.5 px-3 text-sm text-white placeholder-[#6f6b9b] focus:border-primary focus:ring-primary',
                isSubmitting && 'opacity-60 cursor-not-allowed',
                errors.name && 'border-red-500 focus:border-red-500 focus:ring-red-500'
              )}
            />
            {errors.name && (
              <p id="register-name-error" role="alert" className="text-xs text-red-300">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#e0def6]" htmlFor="register-email">
              Work email
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={() => {
                const emailResult = validateEmail(email);
                setErrors((prev) => ({
                  ...prev,
                  email: emailResult.isValid ? undefined : emailResult.error,
                }));
              }}
              disabled={isSubmitting}
              aria-describedby={errors.email ? 'register-email-error' : undefined}
              aria-invalid={!!errors.email}
              className={cn(
                'block w-full rounded-lg border-[#383663] bg-[#121121] py-2.5 px-3 text-sm text-white placeholder-[#6f6b9b] focus:border-primary focus:ring-primary',
                isSubmitting && 'opacity-60 cursor-not-allowed',
                errors.email && 'border-red-500 focus:border-red-500 focus:ring-red-500'
              )}
            />
            {errors.email && (
              <p
                id="register-email-error"
                data-testid="email-error"
                role="alert"
                className="text-xs text-red-300"
              >
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#e0def6]" htmlFor="register-password">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                id="register-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isSubmitting}
                aria-describedby={errors.password ? 'register-password-error' : undefined}
                aria-invalid={!!errors.password}
                className={cn(
                  'block w-full rounded-lg border-[#383663] bg-[#121121] py-2.5 pl-3 pr-10 text-sm text-white placeholder-[#6f6b9b] focus:border-primary focus:ring-primary',
                  isSubmitting && 'opacity-60 cursor-not-allowed',
                  errors.password && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                )}
              />
              <button
                type="button"
                aria-label="Toggle password visibility"
                data-testid="password-visibility-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9795c6] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p
                id="register-password-error"
                data-testid="password-error"
                role="alert"
                className="text-xs text-red-300"
              >
                {errors.password}
              </p>
            )}
          </div>

          <div className="space-y-3 rounded-lg border border-[#383663] bg-[#121121] p-4">
            <PasswordStrengthIndicator password={password} />
            <PasswordRequirements password={password} />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all active:scale-[0.98]',
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-600'
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </span>
            ) : (
              'Continue'
            )}
          </button>
        </form>
      )}

      <div className="mt-6 text-center">
        <a href="/auth/login" className="text-xs font-medium text-primary hover:text-indigo-400">
          Already have an account? Sign in
        </a>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4 text-xs text-[#9795c6]">
        <a href="/terms" className="hover:text-white">
          Terms of Service
        </a>
        <span>•</span>
        <a href="/privacy" className="hover:text-white">
          Privacy Policy
        </a>
        <span>•</span>
        <a href="/help" className="hover:text-white">
          Help
        </a>
      </div>
    </div>
  );
}
