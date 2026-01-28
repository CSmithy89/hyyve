/**
 * MFA Setup Success Page
 *
 * Story: 1-1-9 MFA Backup Codes Generation
 * Route: /auth/mfa-setup/success
 *
 * This page confirms that MFA has been successfully enabled.
 * It's the final page in the MFA setup flow.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils';

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
 * MfaSetupSuccessPage Component
 *
 * Displays a success message after MFA is enabled.
 * Provides links to dashboard and security settings.
 */
export default function MfaSetupSuccessPage() {
  const { user } = useUser();

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-dark text-white font-display antialiased selection:bg-primary/30 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 flex w-full items-center justify-between border-b border-border-dark bg-background-dark/80 px-6 py-4 backdrop-blur-md md:px-10">
        <div className="flex items-center gap-4 text-white">
          <HyyveLogo />
          <h2 className="text-lg font-bold leading-tight tracking-tight">Hyyve</h2>
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
      <main className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6">
        <div className="w-full max-w-md flex flex-col items-center text-center gap-6">
          {/* Success Icon */}
          <div className="size-20 rounded-full bg-green-500/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-green-500 text-[48px]">
              check_circle
            </span>
          </div>

          {/* Success Message */}
          <div className="flex flex-col gap-2">
            <h1 className="text-gray-900 dark:text-white text-2xl font-bold leading-tight">
              Two-Factor Authentication Enabled
            </h1>
            <p className="text-gray-500 dark:text-text-secondary text-base">
              Your account is now protected with MFA. You'll be asked for a verification code when signing in.
            </p>
          </div>

          {/* Info Card */}
          <div className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-border rounded-xl p-6 shadow-sm">
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[20px] flex-shrink-0 mt-0.5">
                  shield
                </span>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Enhanced Security
                  </p>
                  <p className="text-sm text-gray-500 dark:text-text-secondary mt-1">
                    Your account now requires both your password and an authenticator code to sign in.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[20px] flex-shrink-0 mt-0.5">
                  key
                </span>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Backup Codes Saved
                  </p>
                  <p className="text-sm text-gray-500 dark:text-text-secondary mt-1">
                    Remember to keep your backup codes safe. You can use them if you lose access to your authenticator.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-3 pt-2">
            <Link
              href="/dashboard"
              className={cn(
                'w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg',
                'shadow-lg shadow-primary/25 transition-all',
                'flex items-center justify-center gap-2',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark'
              )}
            >
              <span>Go to Dashboard</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>

            <Link
              href="/settings/security"
              className={cn(
                'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg',
                'border border-gray-200 dark:border-surface-border',
                'bg-white dark:bg-surface-dark',
                'text-gray-700 dark:text-white text-sm font-medium',
                'hover:bg-gray-50 dark:hover:bg-background-dark',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark',
                'transition-all'
              )}
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>
              <span>Security Settings</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
