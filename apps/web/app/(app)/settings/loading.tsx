/**
 * Settings Loading State
 *
 * Story: 0-2-10 Implement Settings Pages
 * Loading skeleton for settings page.
 */

import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsLoading() {
  return (
    <div className="space-y-8">
      {/* Page Heading Skeleton */}
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Content Skeleton */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar Skeleton */}
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="size-32 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Form Skeleton */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Theme Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card rounded-xl border border-border p-6">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="aspect-video rounded-lg" />
            <Skeleton className="aspect-video rounded-lg" />
            <Skeleton className="aspect-video rounded-lg" />
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <Skeleton className="h-6 w-28 mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Skeleton className="h-14 w-full" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
