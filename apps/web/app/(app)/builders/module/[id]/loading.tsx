/**
 * Module Builder Loading State
 *
 * Story: 0-2-11 Implement Module Builder UI Shell
 * Loading skeleton for module builder page.
 */

import { Skeleton } from '@/components/ui/skeleton';

export default function ModuleBuilderLoading() {
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left Panel Skeleton */}
      <aside className="w-72 flex-none bg-[#131221] border-r border-border-dark flex flex-col">
        <div className="px-5 py-4 border-b border-border-dark">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="px-4 py-3">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex-1 px-4 py-2 space-y-2">
          <Skeleton className="h-4 w-16 mb-3" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-16 mt-4 mb-3" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="p-4 border-t border-border-dark">
          <Skeleton className="h-10 w-full" />
        </div>
      </aside>

      {/* Center Panel Skeleton */}
      <main className="flex-1 relative bg-canvas-dark overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-32 w-48 rounded-xl" />
            <Skeleton className="h-40 w-56 rounded-xl" />
            <Skeleton className="h-32 w-48 rounded-xl" />
          </div>
        </div>
        {/* Controls Skeleton */}
        <div className="absolute bottom-6 left-6 z-30 flex flex-col gap-2">
          <Skeleton className="h-24 w-10 rounded-lg" />
          <Skeleton className="h-16 w-16 rounded-lg" />
        </div>
      </main>

      {/* Right Panel Skeleton */}
      <aside className="w-80 flex-none bg-[#131221] border-l border-border-dark flex flex-col">
        <div className="px-5 py-4 border-b border-border-dark flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="size-2 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="size-5" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          <div className="flex justify-center">
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="h-16 flex-1 rounded-2xl" />
          </div>
          <div className="flex gap-3">
            <div className="w-8" />
            <Skeleton className="h-20 flex-1 rounded-2xl" />
          </div>
          <div className="flex gap-3 flex-row-reverse">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="h-12 flex-1 rounded-2xl" />
          </div>
        </div>
        <div className="p-4 border-t border-border-dark">
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </aside>
    </div>
  );
}
