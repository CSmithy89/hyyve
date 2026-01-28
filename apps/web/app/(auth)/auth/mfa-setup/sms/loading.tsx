/**
 * SMS MFA Setup Loading State
 *
 * Story: 1-1-10 MFA SMS Verification
 * Route: /auth/mfa-setup/sms
 *
 * Suspense boundary with skeleton loading UI matching page layout.
 */

export default function SmsMfaSetupLoading() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-dark text-white font-display antialiased">
      {/* Header skeleton */}
      <header className="sticky top-0 z-10 flex w-full items-center justify-between border-b border-border-dark bg-background-dark/80 px-6 py-4 backdrop-blur-md md:px-10">
        <div className="flex items-center gap-4">
          <div className="size-8 rounded-lg bg-surface-dark animate-pulse" />
          <div className="h-5 w-16 rounded bg-surface-dark animate-pulse" />
        </div>
        <div className="flex items-center gap-6">
          <div className="h-4 w-20 rounded bg-surface-dark animate-pulse" />
          <div className="h-8 w-[1px] bg-border-dark" />
          <div className="size-9 rounded-full bg-surface-dark animate-pulse" />
        </div>
      </header>

      {/* Main content skeleton */}
      <main className="flex flex-1 flex-col items-center px-4 py-8 md:px-0 md:py-12">
        <div className="flex w-full max-w-lg flex-col gap-8">
          {/* Back link skeleton */}
          <div className="h-4 w-40 rounded bg-surface-dark animate-pulse" />

          {/* Heading skeleton */}
          <div className="flex flex-col gap-2">
            <div className="h-10 w-3/4 rounded bg-surface-dark animate-pulse" />
            <div className="h-5 w-full rounded bg-surface-dark animate-pulse" />
          </div>

          {/* Content card skeleton */}
          <div className="bg-surface-dark border border-border-dark rounded-xl p-6 md:p-8">
            {/* Step indicator skeleton */}
            <div className="flex items-center gap-3 mb-6">
              <div className="size-8 rounded-full bg-background-dark animate-pulse" />
              <div className="h-4 w-32 rounded bg-background-dark animate-pulse" />
            </div>

            {/* Phone input skeleton */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <div className="w-24 h-12 rounded-lg bg-background-dark animate-pulse" />
                <div className="flex-1 h-12 rounded-lg bg-background-dark animate-pulse" />
              </div>

              {/* Button skeleton */}
              <div className="h-12 w-full rounded-lg bg-primary/20 animate-pulse" />
            </div>

            <div className="border-t border-border-dark my-6" />

            {/* Skip button skeleton */}
            <div className="h-4 w-32 mx-auto rounded bg-background-dark animate-pulse" />
          </div>

          {/* Info boxes skeleton */}
          <div className="flex flex-col gap-4">
            <div className="h-24 rounded-lg bg-surface-dark animate-pulse" />
            <div className="h-24 rounded-lg bg-surface-dark animate-pulse" />
          </div>
        </div>
      </main>
    </div>
  );
}
