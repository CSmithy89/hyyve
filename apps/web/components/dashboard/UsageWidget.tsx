/**
 * UsageWidget Component
 *
 * Story: 0-2-9 Implement Dashboard and Project Browser
 * AC1: Usage summary widget (API calls, cost estimate)
 *
 * Displays usage metrics with progress bars.
 * Matches wireframe design from hyyve_home_dashboard/code.html lines 278-336.
 */

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { UsageStats } from '@/lib/mock-data/dashboard';

export interface UsageWidgetProps {
  /** Usage statistics data */
  stats: UsageStats;
  /** Additional CSS classes */
  className?: string;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}k`;
  }
  return num.toLocaleString();
}

export function UsageWidget({ stats, className }: UsageWidgetProps) {
  const apiCallsPercentage = Math.round((stats.apiCalls.used / stats.apiCalls.limit) * 100);
  const costPercentage = Math.round((stats.cost.current / stats.cost.limit) * 100);

  return (
    <section className={cn('flex h-full flex-col', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Usage This Month</h2>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-6 rounded-xl border border-border bg-card p-6">
        {/* API Calls Metric */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <span className="material-symbols-outlined text-lg">api</span>
              API Calls
            </span>
            <span className="rounded bg-muted px-2 py-1 text-xs text-foreground">
              {stats.plan}
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-foreground">
              {formatNumber(stats.apiCalls.used)}
            </span>
            <span className="text-sm text-muted-foreground">
              / {formatNumber(stats.apiCalls.limit)}
            </span>
          </div>
          {/* Progress Bar */}
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.min(apiCallsPercentage, 100)}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Resets in {stats.apiCalls.resetDays} days
          </p>
        </div>

        <div className="h-px w-full bg-border" />

        {/* Cost Estimate Metric */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <span className="material-symbols-outlined text-lg">payments</span>
              Est. Cost
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-foreground">
              ${stats.cost.current.toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground">{stats.cost.currency}</span>
          </div>
          {/* Progress Bar */}
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${Math.min(costPercentage, 100)}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Within budget (${stats.cost.limit.toFixed(2)} limit)
          </p>
        </div>

        {/* Upgrade CTA */}
        <div className="mt-4 rounded-lg border border-primary/20 bg-gradient-to-br from-primary/20 to-primary/5 p-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary">rocket_launch</span>
            <div>
              <h4 className="text-sm font-bold text-foreground">Scale up?</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Upgrade to Enterprise for unlimited API calls and dedicated support.
              </p>
              <Button size="sm" className="mt-3">
                Upgrade Plan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UsageWidget;
