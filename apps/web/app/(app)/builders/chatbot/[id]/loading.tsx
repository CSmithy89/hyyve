/**
 * Chatbot Builder Loading State
 *
 * Story: 0-2-12 Implement Chatbot Builder UI Shell
 * Loading skeleton for chatbot builder page.
 */

import { Skeleton } from '@/components/ui/skeleton';

export default function ChatbotBuilderLoading() {
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left Panel Skeleton - Intents */}
      <aside className="w-80 flex-none bg-background-dark border-r border-border-dark flex flex-col">
        <div className="px-4 py-4 border-b border-border-dark/50">
          <Skeleton className="h-5 w-40 mb-2" />
        </div>
        <div className="px-4 py-3">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex px-4 gap-4 border-b border-border-dark/50 mb-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex-1 px-2 py-2 space-y-2">
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-14 w-full rounded-lg" />
        </div>
        <div className="p-4 border-t border-border-dark flex justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
      </aside>

      {/* Center Panel Skeleton - Canvas */}
      <main className="flex-1 relative bg-[#0f0e1b] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[800px] h-[500px]">
            {/* Start Node */}
            <Skeleton className="absolute left-[20px] top-[200px] w-[100px] h-[60px] rounded-full" />
            {/* Decision Node */}
            <Skeleton className="absolute left-[200px] top-[180px] w-[250px] h-[100px] rounded-xl" />
            {/* Bot Says Nodes */}
            <Skeleton className="absolute left-[520px] top-[100px] w-[280px] h-[120px] rounded-xl" />
            <Skeleton className="absolute left-[520px] top-[280px] w-[280px] h-[120px] rounded-xl" />
          </div>
        </div>
        {/* Controls Skeleton */}
        <div className="absolute bottom-6 left-6 z-30 flex gap-2">
          <Skeleton className="h-20 w-10 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
        {/* FAB Skeleton */}
        <Skeleton className="absolute bottom-8 right-8 h-12 w-12 rounded-full" />
      </main>

      {/* Right Panel Skeleton - Wendy Chat */}
      <aside className="w-80 flex-none bg-background-dark border-l border-border-dark flex flex-col">
        <div className="px-5 py-4 border-b border-border-dark flex items-center gap-3">
          <Skeleton className="size-9 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="size-5" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          <div className="flex gap-3">
            <Skeleton className="size-6 rounded-full flex-shrink-0" />
            <Skeleton className="h-16 flex-1 rounded-xl" />
          </div>
          <Skeleton className="h-24 w-full rounded-xl" />
          <div className="flex gap-3">
            <Skeleton className="size-6 rounded-full flex-shrink-0" />
            <Skeleton className="h-12 flex-1 rounded-xl" />
          </div>
        </div>
        <div className="p-4 border-t border-border-dark">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </aside>
    </div>
  );
}
