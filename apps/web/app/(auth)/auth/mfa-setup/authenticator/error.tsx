/**
 * Error Boundary for TOTP Authenticator Setup Page
 *
 * Story: 1-1-8 MFA Setup - TOTP Authenticator
 * Displays an error message with retry option when the page fails to load.
 */

'use client';

import { useEffect } from 'react';

export default function TotpSetupError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('TOTP Setup Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6 max-w-md text-center">
        <div className="size-16 rounded-full bg-red-500/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-[32px] text-red-500">
            error
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-white">
            Something went wrong
          </h2>
          <p className="text-text-secondary text-sm">
            We couldn&apos;t load the authenticator setup. Please try again.
          </p>
        </div>
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
