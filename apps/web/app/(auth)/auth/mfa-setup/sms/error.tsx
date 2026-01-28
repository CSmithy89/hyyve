/**
 * SMS MFA Setup Error Boundary
 *
 * Story: 1-1-10 MFA SMS Verification
 * Route: /auth/mfa-setup/sms
 *
 * Error boundary for the SMS MFA setup page.
 */

'use client';

import Link from 'next/link';

export default function SmsMfaSetupError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-dark text-white font-display antialiased">
      <div className="flex flex-col items-center gap-6 max-w-md text-center px-4">
        {/* Error icon */}
        <div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-[32px] text-red-500">error</span>
        </div>

        {/* Error message */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-text-secondary">
            We encountered an error while setting up SMS verification.
            {error.message && (
              <span className="block mt-2 text-sm text-red-400">
                {error.message}
              </span>
            )}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={reset}
            className="flex-1 flex items-center justify-center gap-2 bg-primary px-6 py-3 text-sm font-semibold text-white rounded-lg hover:bg-primary-hover transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Try Again
          </button>

          <Link
            href="/auth/mfa-setup"
            className="flex-1 flex items-center justify-center gap-2 bg-surface-dark border border-border-dark px-6 py-3 text-sm font-semibold text-white rounded-lg hover:bg-border-dark transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Methods
          </Link>
        </div>

        {/* Support link */}
        <p className="text-sm text-text-secondary">
          Need help?{' '}
          <a href="/support" className="text-primary hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
