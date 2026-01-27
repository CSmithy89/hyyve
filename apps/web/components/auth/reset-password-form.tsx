/**
 * Reset Password Form Component
 *
 * Story: 1-1-5 Password Reset Flow
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  calculatePasswordStrength,
  validatePassword,
} from '@/lib/validations/auth';
import { PasswordRequirements } from './password-requirements';
import { PasswordStrengthIndicator } from './password-strength-indicator';
import { resetPasswordWithToken } from '@/actions/auth';

export interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [generalError, setGeneralError] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<{ password?: string; confirmPassword?: string }>({});

  const passwordStrength = calculatePasswordStrength(password);
  const passwordValidation = validatePassword(password);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setGeneralError(null);

    if (!token) {
      setGeneralError('Invalid or missing reset token');
      return;
    }

    const nextErrors: { password?: string; confirmPassword?: string } = {};
    if (!passwordValidation.isValid) {
      nextErrors.password = passwordValidation.errors[0] || 'Password does not meet requirements';
    }
    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(nextErrors);

    if (nextErrors.password || nextErrors.confirmPassword) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await resetPasswordWithToken({ token, password });
      if (result.success) {
        router.push('/auth/login');
      } else {
        setGeneralError(result.error || 'Failed to reset password');
      }
    } catch {
      setGeneralError('Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl border border-slate-200 dark:border-[#334155] overflow-hidden p-8 sm:p-10 relative z-10">
      <div className="flex flex-col items-center justify-center mb-6 gap-4">
        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/25">
          <span className="material-symbols-outlined text-white text-[32px]">key</span>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
            Reset your password
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Choose a strong password you have not used before
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="reset-password">
            New password
          </label>
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 text-[20px]">lock</span>
            </div>
            <input
              id="reset-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting}
              aria-describedby={errors.password ? 'reset-password-error' : undefined}
              aria-invalid={!!errors.password}
              className={cn(
                'block w-full rounded-lg border-slate-300 dark:border-[#334155] bg-slate-50 dark:bg-[#0f172a] py-2.5 pl-10 pr-10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-primary shadow-sm transition-colors',
                isSubmitting && 'opacity-60 cursor-not-allowed',
                errors.password && 'border-red-500 focus:border-red-500 focus:ring-red-500'
              )}
            />
            <button
              type="button"
              aria-label="Toggle password visibility"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-slate-300 text-slate-500 dark:text-slate-400 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p id="reset-password-error" role="alert" className="text-xs text-red-500">
              {errors.password}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="reset-password-confirm">
            Confirm password
          </label>
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 text-[20px]">lock</span>
            </div>
            <input
              id="reset-password-confirm"
              name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              disabled={isSubmitting}
              aria-describedby={errors.confirmPassword ? 'reset-confirm-error' : undefined}
              aria-invalid={!!errors.confirmPassword}
              className={cn(
                'block w-full rounded-lg border-slate-300 dark:border-[#334155] bg-slate-50 dark:bg-[#0f172a] py-2.5 pl-10 pr-10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-primary shadow-sm transition-colors',
                isSubmitting && 'opacity-60 cursor-not-allowed',
                errors.confirmPassword && 'border-red-500 focus:border-red-500 focus:ring-red-500'
              )}
            />
            <button
              type="button"
              aria-label="Toggle confirm password visibility"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-slate-300 text-slate-500 dark:text-slate-400 transition-colors"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p id="reset-confirm-error" role="alert" className="text-xs text-red-500">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="space-y-3 rounded-lg border border-slate-200 dark:border-[#334155] bg-slate-50/70 dark:bg-[#0f172a] p-4">
          <PasswordStrengthIndicator strength={passwordStrength} />
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
              Resetting...
            </span>
          ) : (
            'Reset password'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <a href="/auth/login" className="text-xs font-medium text-primary hover:text-indigo-400">
          Back to sign in
        </a>
      </div>
    </div>
  );
}
