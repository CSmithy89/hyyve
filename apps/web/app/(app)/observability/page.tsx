/**
 * Observability Dashboard Page
 *
 * Story: 0-2-14 Implement Observability Dashboard UI
 * AC1: Metrics cards, AC2: Execution chart, AC3: Executions table
 */

'use client';

import { RefreshCw } from 'lucide-react';
import { MetricsCard, ExecutionChart, ExecutionsTable } from '@/components/observability';
import { METRICS, EXECUTIONS, CHART_DATA } from '@/lib/mock-data/observability';

export default function ObservabilityPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">System Health</h1>
          <p className="text-sm text-text-secondary mt-1">
            Real-time monitoring of AI pipeline performance and execution stability.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-md shadow-primary/20">
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {METRICS.map((metric) => (
          <MetricsCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Execution Chart */}
      <ExecutionChart data={CHART_DATA} />

      {/* Executions Table */}
      <ExecutionsTable executions={EXECUTIONS} />
    </div>
  );
}
