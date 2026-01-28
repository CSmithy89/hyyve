/**
 * SSO Settings Loading State
 *
 * Story: 1-1-12 Enterprise SSO SAML Configuration
 * Route: /settings/security/sso
 *
 * Provides skeleton UI while the SSO settings page loads.
 */

import { Skeleton } from '@/components/ui/skeleton';

export default function SsoSettingsLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background-dark font-display text-white">
      <main className="flex flex-1 justify-center py-8">
        <div className="flex w-full max-w-[960px] flex-col px-4">
          {/* Page Heading Skeleton */}
          <div className="mb-6 flex flex-wrap justify-between gap-3">
            <div className="flex min-w-72 flex-col gap-2">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-5 w-96" />
            </div>
          </div>

          {/* Breadcrumbs Skeleton */}
          <div className="mb-8 flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-12" />
          </div>

          {/* SSO Status Card Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>

          {/* Identity Provider Heading Skeleton */}
          <Skeleton className="mb-4 h-6 w-40" />

          {/* IdP Cards Grid Skeleton */}
          <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>

          {/* Info Box Skeleton */}
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </main>
    </div>
  );
}
