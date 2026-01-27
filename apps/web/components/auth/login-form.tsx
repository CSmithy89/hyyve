/**
 * Login Form Component
 *
 * Story: 1-1-4 User Login with Email/Password
 * Wireframe: hyyve_login_page
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { validateEmail } from '@/lib/validations/auth';
import { signInWithEmailPassword } from '@/actions/auth';

export interface LoginFormProps {
  /** Optional callback after successful login */
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({});
  const [generalError, setGeneralError] = React.useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setGeneralError(null);

    const emailResult = validateEmail(email);
    const passwordError = password ? undefined : 'Password is required';
    const nextErrors = {
      email: emailResult.isValid ? undefined : emailResult.error,
      password: passwordError,
    };

    setErrors(nextErrors);

    if (nextErrors.email || nextErrors.password) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signInWithEmailPassword({ email, password, rememberMe });
      if (result.success) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/dashboard');
        }
      } else {
        setGeneralError(result.error || 'Failed to sign in');
      }
    } catch {
      setGeneralError('Failed to sign in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl border border-slate-200 dark:border-[#334155] overflow-hidden p-8 sm:p-10 relative z-10">
      <div className="flex flex-col items-center justify-center mb-8 gap-4">
        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/25">
          <span className="material-symbols-outlined text-white text-[32px]">smart_toy</span>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter your credentials to access your workspace
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
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="login-email">
            Email Address
          </label>
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 text-[20px]">
                mail
              </span>
            </div>
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
              aria-describedby={errors.email ? 'login-email-error' : undefined}
              aria-invalid={!!errors.email}
              className={cn(
                'block w-full rounded-lg border-slate-300 dark:border-[#334155] bg-slate-50 dark:bg-[#0f172a] py-2.5 pl-10 pr-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-primary shadow-sm transition-colors',
                isSubmitting && 'opacity-60 cursor-not-allowed',
                errors.email && 'border-red-500 focus:border-red-500 focus:ring-red-500'
              )}
            />
          </div>
          {errors.email && (
            <p id="login-email-error" role="alert" className="text-xs text-red-500">
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="login-password">
            Password
          </label>
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 text-[20px]">
                lock
              </span>
            </div>
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting}
              aria-describedby={errors.password ? 'login-password-error' : undefined}
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
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p id="login-password-error" role="alert" className="text-xs text-red-500">
              {errors.password}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0f172a] text-primary focus:ring-primary focus:ring-offset-0 transition-colors cursor-pointer"
              aria-label="Remember me"
            />
            <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors select-none">
              Remember me
            </span>
          </label>
          <a
            href="/auth/forgot-password"
            className="text-sm font-medium text-primary hover:text-indigo-400 transition-colors"
          >
            Forgot password?
          </a>
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
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="relative mt-8 mb-6">
        <div aria-hidden="true" className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-[#334155]"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white dark:bg-[#1e293b] px-3 text-xs font-medium text-slate-500 uppercase tracking-wide">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-[#334155] bg-white dark:bg-[#0f172a] px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
        >
          <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            ></path>
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            ></path>
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26z"
              fill="#FBBC05"
            ></path>
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            ></path>
          </svg>
          Google
        </button>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-[#334155] bg-white dark:bg-[#0f172a] px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
        >
          <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-[20px]">
            vpn_key
          </span>
          SSO
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{' '}
          <a
            href="/auth/request-access"
            className="font-medium text-primary hover:text-indigo-400 transition-colors"
          >
            Request access
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
