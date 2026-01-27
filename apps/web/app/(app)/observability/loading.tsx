/**
 * Observability Loading State
 *
 * Story: 0-2-14 Implement Observability Dashboard UI
 */

export default function ObservabilityLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-surface-dark rounded-lg" />
          <div className="h-4 w-80 bg-surface-dark rounded mt-2" />
        </div>
        <div className="h-10 w-36 bg-surface-dark rounded-lg" />
      </div>

      {/* Metrics Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 bg-surface-dark border border-border-dark rounded-xl"
          />
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="h-96 bg-surface-dark border border-border-dark rounded-xl" />

      {/* Table Skeleton */}
      <div className="h-80 bg-surface-dark border border-border-dark rounded-xl" />
    </div>
  );
}
