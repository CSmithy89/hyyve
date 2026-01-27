/**
 * MetricsCard Component
 *
 * Story: 0-2-14 Implement Observability Dashboard UI
 * AC1: Metrics cards with trend indicators
 */

'use client';

import { TrendingUp, TrendingDown, Play, CheckCircle, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Metric } from '@/lib/mock-data/observability';

export interface MetricsCardProps {
  metric: Metric;
  className?: string;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  play_circle: <Play className="h-12 w-12" />,
  check_circle: <CheckCircle className="h-12 w-12" />,
  speed: <Gauge className="h-12 w-12" />,
};

export function MetricsCard({ metric, className }: MetricsCardProps) {
  const isPositive = metric.trend >= 0;
  const icon = ICON_MAP[metric.icon] ?? <Play className="h-12 w-12" />;

  return (
    <div
      className={cn(
        'relative bg-surface-dark p-5 rounded-xl border border-border-dark shadow-sm overflow-hidden group',
        className
      )}
    >
      {/* Background Icon */}
      <div
        className={cn(
          'absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity',
          metric.iconColor
        )}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 relative z-10">
        <p className="text-sm font-medium text-text-secondary">{metric.label}</p>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white tracking-tight font-mono">
            {metric.value}
          </span>
          <span
            className={cn(
              'flex items-center text-xs font-semibold px-1.5 py-0.5 rounded',
              isPositive
                ? 'text-emerald-400 bg-emerald-500/10'
                : 'text-emerald-400 bg-emerald-500/10'
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3 mr-0.5" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-0.5" />
            )}
            {Math.abs(metric.trend)}
            {metric.label === 'Avg Latency' ? 'ms' : '%'}
          </span>
        </div>

        <p className="text-xs text-text-secondary mt-2">{metric.trendLabel}</p>
      </div>
    </div>
  );
}

export default MetricsCard;
