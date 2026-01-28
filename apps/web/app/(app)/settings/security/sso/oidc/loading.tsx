/**
 * OIDC Configuration Loading State
 *
 * Story: 1-1-13 Enterprise SSO OIDC Configuration
 * Route: /settings/security/sso/oidc
 *
 * Provides skeleton UI while the OIDC configuration page loads.
 */

import { Skeleton } from '@/components/ui/skeleton';

export default function OidcConfigLoading() {
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
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-12" />
          </div>

          {/* Back Button Skeleton */}
          <Skeleton className="mb-6 h-5 w-40" />

          {/* Info Box Skeleton */}
          <Skeleton className="mb-8 h-24 w-full rounded-xl" />

          {/* Configuration Form Card Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>

          {/* Scopes Card Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-72 w-full rounded-xl" />
          </div>

          {/* Redirect URI Card Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex justify-end gap-4">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-44" />
          </div>
        </div>
      </main>
    </div>
  );
}
