/**
 * Dashboard Loading State
 *
 * Story: 0-2-9 Implement Dashboard and Project Browser
 * Provides Suspense boundary while dashboard data loads.
 */

import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 pb-10">
        {/* Welcome Heading Skeleton */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-5 w-64" />
        </div>

        {/* Quick Action Cards Skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          ))}
        </div>

        {/* Layout Skeleton */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Column */}
          <div className="flex flex-col gap-8 lg:col-span-2">
            {/* Recent Projects Skeleton */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="min-w-[280px] flex-1 rounded-xl border border-border bg-card"
                  >
                    <Skeleton className="h-32 w-full rounded-t-xl" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Activity Feed Skeleton */}
            <section>
              <div className="mb-4">
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Usage Widget Skeleton */}
          <div className="flex flex-col">
            <Skeleton className="mb-4 h-6 w-40" />
            <div className="flex-1 rounded-xl border border-border bg-card p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-2 w-full rounded-full" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="h-px w-full" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-2 w-full rounded-full" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-28 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
