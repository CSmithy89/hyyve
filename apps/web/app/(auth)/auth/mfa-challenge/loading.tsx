/**
 * MFA Challenge Loading State
 *
 * Story: 1-1-11 MFA Login Verification
 * Route: /auth/mfa-challenge
 *
 * Displays a skeleton loading state while the page loads.
 */

export default function MfaChallengeLoading() {
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
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto w-3/4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto w-full" />
            </div>
          </div>

          {/* Method tabs placeholder */}
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-background-dark rounded-lg mb-6">
            <div className="flex-1 h-10 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse" />
            <div className="flex-1 h-10 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse" />
            <div className="flex-1 h-10 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse" />
          </div>

          {/* Description placeholder */}
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto w-3/4 mb-4" />

          {/* OTP inputs placeholder */}
          <div className="flex justify-center gap-2 sm:gap-3 py-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={`left-${i}`}
                className="w-10 h-12 sm:w-12 sm:h-14 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"
              />
            ))}
            <div className="flex items-center justify-center text-slate-400">-</div>
            {[...Array(3)].map((_, i) => (
              <div
                key={`right-${i}`}
                className="w-10 h-12 sm:w-12 sm:h-14 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"
              />
            ))}
          </div>

          {/* Button placeholder */}
          <div className="mt-6 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />

          {/* Divider placeholder */}
          <div className="relative mt-6 mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-border-dark" />
            </div>
          </div>

          {/* Links placeholder */}
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto w-1/3 mb-4" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto w-1/4" />
        </div>
      </div>
    </div>
  );
}
