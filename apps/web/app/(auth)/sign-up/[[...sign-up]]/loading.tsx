/**
 * Sign-Up Loading State
 *
 * Story: 0-2-8 Implement Auth Pages (Clerk UI)
 * Provides Suspense boundary while Clerk component hydrates.
 */

import { Skeleton } from '@/components/ui/skeleton';

export default function SignUpLoading() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[360px]">
      {/* Social buttons skeleton */}
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-11 rounded-lg" />
        <Skeleton className="h-11 rounded-lg" />
      </div>

      {/* Divider skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-px flex-1" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-px flex-1" />
      </div>

      {/* Form fields skeleton */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-11 rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-11 rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-11 rounded-lg" />
        </div>
      </div>

      {/* Button skeleton */}
      <Skeleton className="h-11 rounded-lg" />

      {/* Footer skeleton */}
      <Skeleton className="h-4 w-48 mx-auto" />
    </div>
  );
}
