/**
 * Forgot Password Form Component
 *
 * Story: 1-1-5 Password Reset Flow
 */

'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { validateEmail } from '@/lib/validations/auth';
import { requestPasswordReset } from '@/actions/auth';

export interface ForgotPasswordFormProps {
  /** Optional callback after successful request */
  onSuccess?: () => void;
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<{ email?: string }>({});
  const [generalError, setGeneralError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setGeneralError(null);

    const emailResult = validateEmail(email);
    const nextErrors = {
      email: emailResult.isValid ? undefined : emailResult.error,
    };

    setErrors(nextErrors);

    if (nextErrors.email) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await requestPasswordReset({ email });
      if (result.success) {
        setIsSuccess(true);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setGeneralError(result.error || 'Failed to send reset link');
      }
    } catch {
      setGeneralError('Failed to send reset link');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl border border-slate-200 dark:border-[#334155] overflow-hidden p-8 sm:p-10 relative z-10">
      <div className="flex flex-col items-center justify-center mb-6 gap-4">
        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/25">
          <span className="material-symbols-outlined text-white text-[32px]">lock_reset</span>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
            Forgot your password?
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter your email and we will send you a reset link
          </p>
        </div>
      </div>

      {generalError && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-500"
        >
          {generalError}
        </div>
      )}

      {isSuccess ? (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-600 dark:text-emerald-300">
          <p className="font-medium">Check your email</p>
          <p className="mt-1 text-xs text-emerald-600/80 dark:text-emerald-300/80">
            We sent a password reset link. It will be valid for 1 hour.
          </p>
          <a
            href="/auth/login"
            className="mt-3 inline-flex text-xs font-medium text-primary hover:text-indigo-400"
          >
            Back to sign in
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="space-y-1.5">
            <label
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
              htmlFor="forgot-email"
            >
              Email Address
            </label>
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">mail</span>
              </div>
              <input
                id="forgot-email"
                name="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isSubmitting}
                aria-describedby={errors.email ? 'forgot-email-error' : undefined}
                aria-invalid={!!errors.email}
                className={cn(
                  'block w-full rounded-lg border-slate-300 dark:border-[#334155] bg-slate-50 dark:bg-[#0f172a] py-2.5 pl-10 pr-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-primary shadow-sm transition-colors',
                  isSubmitting && 'opacity-60 cursor-not-allowed',
                  errors.email && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                )}
              />
            </div>
            {errors.email && (
              <p id="forgot-email-error" role="alert" className="text-xs text-red-500">
                {errors.email}
              </p>
            )}
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
                Sending link...
              </span>
            ) : (
              'Send reset link'
            )}
          </button>
        </form>
      )}

      {!isSuccess && (
        <div className="mt-6 text-center">
          <a href="/auth/login" className="text-xs font-medium text-primary hover:text-indigo-400">
            Back to sign in
          </a>
        </div>
      )}
    </div>
  );
}
