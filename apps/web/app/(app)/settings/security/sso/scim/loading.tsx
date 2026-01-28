/**
 * SCIM Settings Page Loading Skeleton
 *
 * Story: 1-1-14 SCIM User Provisioning
 * Route: /settings/security/sso/scim
 *
 * Displays loading skeleton while page data is being fetched.
 */

export default function ScimSettingsLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background-dark font-display text-white">
      {/* Main Content */}
      <main className="flex flex-1 justify-center py-8">
        <div className="flex w-full max-w-[960px] flex-col px-4 md:px-6">
          {/* Page Heading Skeleton */}
          <div className="mb-6 flex flex-wrap justify-between gap-3">
            <div className="flex min-w-72 flex-col gap-2">
              <div className="h-10 w-72 animate-pulse rounded-lg bg-[#272546]" />
              <div className="h-5 w-96 animate-pulse rounded bg-[#272546]" />
            </div>
          </div>

          {/* Breadcrumbs Skeleton */}
          <div className="mb-8 flex items-center gap-2">
            <div className="h-4 w-16 animate-pulse rounded bg-[#272546]" />
            <span className="text-border-dark">/</span>
            <div className="h-4 w-16 animate-pulse rounded bg-[#272546]" />
            <span className="text-border-dark">/</span>
            <div className="h-4 w-12 animate-pulse rounded bg-[#272546]" />
            <span className="text-border-dark">/</span>
            <div className="h-4 w-14 animate-pulse rounded bg-[#272546]" />
          </div>

          {/* Back Link Skeleton */}
          <div className="mb-6 h-5 w-36 animate-pulse rounded bg-[#272546]" />

          {/* SCIM Status Card Skeleton */}
          <div className="mb-8 rounded-xl border border-[#383663] bg-[#1e1c36] p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 animate-pulse rounded-lg bg-[#272546]" />
                <div className="flex flex-col gap-2">
                  <div className="h-6 w-40 animate-pulse rounded bg-[#272546]" />
                  <div className="h-4 w-64 animate-pulse rounded bg-[#272546]" />
                </div>
              </div>
              <div className="h-6 w-11 animate-pulse rounded-full bg-[#272546]" />
            </div>
          </div>

          {/* Endpoint Section Skeleton */}
          <div className="mb-8 flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <div className="h-5 w-5 animate-pulse rounded bg-[#272546]" />
              <div className="h-6 w-32 animate-pulse rounded bg-[#272546]" />
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-[#383663] bg-[#131221] p-4">
              <div className="h-5 w-72 animate-pulse rounded bg-[#272546]" />
              <div className="h-8 w-20 animate-pulse rounded-lg bg-[#272546]" />
            </div>
          </div>

          {/* Token Section Skeleton */}
          <div className="mb-8 flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <div className="h-5 w-5 animate-pulse rounded bg-[#272546]" />
              <div className="h-6 w-28 animate-pulse rounded bg-[#272546]" />
            </div>
            <div className="flex flex-col gap-3 rounded-lg border border-[#383663] bg-[#131221] p-4">
              <div className="flex items-center gap-3">
                <div className="h-5 w-80 animate-pulse rounded bg-[#272546]" />
                <div className="h-8 w-8 animate-pulse rounded-lg bg-[#272546]" />
                <div className="h-8 w-20 animate-pulse rounded-lg bg-[#272546]" />
              </div>
              <div className="flex items-center justify-between border-t border-[#383663] pt-3">
                <div className="h-4 w-64 animate-pulse rounded bg-[#272546]" />
                <div className="h-8 w-36 animate-pulse rounded-lg bg-[#272546]" />
              </div>
            </div>
          </div>

          {/* Users Section Skeleton */}
          <div className="mb-10 flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 animate-pulse rounded bg-[#272546]" />
                <div className="h-6 w-40 animate-pulse rounded bg-[#272546]" />
              </div>
              <div className="h-4 w-24 animate-pulse rounded bg-[#272546]" />
            </div>
            <div className="overflow-hidden rounded-xl border border-[#383663]">
              {/* Table Header */}
              <div className="flex border-b border-[#383663] bg-[#1e1c36] p-4">
                <div className="h-4 w-20 animate-pulse rounded bg-[#272546]" />
                <div className="ml-auto mr-8 h-4 w-16 animate-pulse rounded bg-[#272546]" />
                <div className="mr-8 h-4 w-24 animate-pulse rounded bg-[#272546]" />
                <div className="h-4 w-16 animate-pulse rounded bg-[#272546]" />
              </div>
              {/* Table Rows */}
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center border-b border-[#383663] bg-[#131221] p-4 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 animate-pulse rounded-full bg-[#272546]" />
                    <div className="flex flex-col gap-1">
                      <div className="h-4 w-28 animate-pulse rounded bg-[#272546]" />
                      <div className="h-3 w-40 animate-pulse rounded bg-[#272546]" />
                    </div>
                  </div>
                  <div className="ml-auto mr-8 h-5 w-16 animate-pulse rounded-full bg-[#272546]" />
                  <div className="mr-8 h-4 w-16 animate-pulse rounded bg-[#272546]" />
                  <div className="h-7 w-20 animate-pulse rounded-lg bg-[#272546]" />
                </div>
              ))}
            </div>
          </div>

          {/* Info Box Skeleton */}
          <div className="rounded-xl border border-[#383663] bg-[#272546]/30 p-6">
            <div className="flex gap-4">
              <div className="h-6 w-6 animate-pulse rounded bg-[#272546]" />
              <div className="flex flex-1 flex-col gap-3">
                <div className="h-5 w-48 animate-pulse rounded bg-[#272546]" />
                <div className="h-4 w-full animate-pulse rounded bg-[#272546]" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-[#272546]" />
                <div className="mt-2 flex flex-col gap-2">
                  <div className="h-4 w-64 animate-pulse rounded bg-[#272546]" />
                  <div className="h-4 w-56 animate-pulse rounded bg-[#272546]" />
                  <div className="h-4 w-60 animate-pulse rounded bg-[#272546]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
