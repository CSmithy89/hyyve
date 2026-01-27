/**
 * ExecutionChart Component
 *
 * Story: 0-2-14 Implement Observability Dashboard UI
 * AC2: Hourly execution chart with SVG visualization
 */

'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { ChartDataPoint } from '@/lib/mock-data/observability';

export interface ExecutionChartProps {
  data: ChartDataPoint[];
  className?: string;
}

type TimePeriod = '24h' | '7d' | '30d';

export function ExecutionChart({ data, className }: ExecutionChartProps) {
  const [period, setPeriod] = useState<TimePeriod>('24h');

  // Calculate chart dimensions
  const width = 1000;
  const height = 300;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate max value for scaling
  const maxValue = Math.max(...data.map((d) => d.value));
  const yScale = (value: number) =>
    chartHeight - (value / maxValue) * chartHeight + padding.top;
  const xScale = (index: number) =>
    (index / (data.length - 1)) * chartWidth + padding.left;

  // Generate path data
  const pathData = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.value)}`)
    .join(' ');

  const areaPath = `${pathData} L ${xScale(data.length - 1)} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;

  // Time labels for X-axis
  const timeLabels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'];

  return (
    <div
      className={cn(
        'bg-surface-dark rounded-xl border border-border-dark shadow-sm p-6',
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Hourly Execution Volume</h3>
          <p className="text-sm text-text-secondary">
            Total requests processed over the last {period}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg self-start sm:self-auto">
          {(['24h', '7d', '30d'] as TimePeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                period === p
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-text-secondary hover:text-white'
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full h-[300px] relative">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-full h-px bg-slate-800 border-t border-dashed border-slate-700"
            />
          ))}
        </div>

        {/* SVG Chart */}
        <svg
          className="w-full h-full overflow-visible"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5048e5" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#5048e5" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area */}
          <path d={areaPath} fill="url(#chartGradient)" />

          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="#5048e5"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Data points (optional hover targets) */}
          {data.map((d, i) => (
            <circle
              key={i}
              cx={xScale(i)}
              cy={yScale(d.value)}
              r="4"
              fill="#5048e5"
              className="opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
            />
          ))}
        </svg>
      </div>

      {/* X-Axis Labels */}
      <div className="flex justify-between mt-2 text-xs text-text-secondary font-mono">
        {timeLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}

export default ExecutionChart;
