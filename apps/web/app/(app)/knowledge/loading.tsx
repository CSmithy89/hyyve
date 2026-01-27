/**
 * Knowledge Base Loading State
 *
 * Story: 0-2-13 Implement Knowledge Base UI
 */

export default function KnowledgeLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-surface-dark rounded-lg" />
          <div className="h-4 w-64 bg-surface-dark rounded mt-2" />
        </div>
        <div className="h-10 w-32 bg-surface-dark rounded-lg" />
      </div>

      {/* Search Skeleton */}
      <div className="h-10 w-80 bg-surface-dark rounded-lg" />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-32 bg-surface-dark border border-border-dark rounded-xl"
          />
        ))}
      </div>
    </div>
  );
}
