/**
 * MFA Challenge Page
 *
 * Story: 1-1-11 MFA Login Verification
 * Route: /auth/mfa-challenge
 * Wireframe: hyyve_login_page
 *
 * This page handles MFA verification during the login flow.
 * Users are redirected here after successful first-factor auth
 * if they have MFA enabled.
 */

import { Suspense } from 'react';
import { MfaLoginForm } from '@/components/auth/mfa-login-form';

/**
 * Loading skeleton for the MFA challenge page
 */
function MfaChallengeSkeleton() {
  return (
    <div className="dark relative flex min-h-screen w-full flex-col justify-center items-center overflow-hidden bg-background-dark">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-40 pointer-events-none" />

      <div className="relative w-full max-w-[440px] px-4 py-8">
        <div className="flex flex-col w-full bg-white dark:bg-card-dark rounded-xl shadow-2xl border border-slate-200 dark:border-border-dark overflow-hidden p-8 sm:p-10">
          {/* Logo placeholder */}
          <div className="flex flex-col items-center justify-center mb-8 gap-4">
            <div className="h-14 w-14 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="space-y-2 w-full max-w-[200px]">
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            </div>
          </div>

          {/* Method tabs placeholder */}
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-background-dark rounded-lg mb-6">
            <div className="flex-1 h-10 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse" />
            <div className="flex-1 h-10 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse" />
            <div className="flex-1 h-10 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse" />
          </div>

          {/* OTP inputs placeholder */}
          <div className="flex justify-center gap-2 py-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-10 h-12 sm:w-12 sm:h-14 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"
              />
            ))}
          </div>

          {/* Button placeholder */}
          <div className="mt-6 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/**
 * MFA Challenge Page
 */
export default function MfaChallengePage() {
  return (
    <Suspense fallback={<MfaChallengeSkeleton />}>
      <MfaLoginForm />
    </Suspense>
  );
}
