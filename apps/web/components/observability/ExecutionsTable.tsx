/**
 * ExecutionsTable Component
 *
 * Story: 0-2-14 Implement Observability Dashboard UI
 * AC3: Recent executions table with search and pagination
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Execution } from '@/lib/mock-data/observability';

export interface ExecutionsTableProps {
  executions: Execution[];
  className?: string;
}

const STATUS_CONFIG = {
  pass: {
    label: 'Pass',
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-500',
  },
  running: {
    label: 'Running',
    color: 'bg-primary/10 text-primary border-primary/20',
    dot: 'bg-primary animate-pulse',
  },
  fail: {
    label: 'Fail',
    color: 'bg-red-500/10 text-red-400 border-red-500/20',
    dot: 'bg-red-500',
  },
};

export function ExecutionsTable({ executions, className }: ExecutionsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExecutions = executions.filter(
    (exec) =>
      exec.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exec.pipelineName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={cn(
        'bg-surface-dark rounded-xl border border-border-dark shadow-sm overflow-hidden flex flex-col',
        className
      )}
    >
      {/* Header */}
      <div className="p-5 border-b border-border-dark flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Recent Executions</h3>
          <p className="text-sm text-text-secondary">
            Detailed log of recent pipeline activity
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Search by ID or Pipeline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-border-dark rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-text-secondary"
            />
          </div>
          <button className="p-2 rounded-lg border border-border-dark hover:bg-slate-800 text-text-secondary transition-colors">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800/50 text-xs uppercase text-text-secondary font-semibold tracking-wider">
            <tr>
              <th className="px-6 py-4">Execution ID</th>
              <th className="px-6 py-4">Pipeline Name</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">Started At</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-dark text-sm">
            {filteredExecutions.map((execution) => {
              const statusConfig = STATUS_CONFIG[execution.status];
              return (
                <tr
                  key={execution.id}
                  className="group hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-primary font-medium">
                    #{execution.id}
                  </td>
                  <td className="px-6 py-4 text-white font-medium">
                    {execution.pipelineName}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                        statusConfig.color
                      )}
                    >
                      <span
                        className={cn('w-1.5 h-1.5 rounded-full', statusConfig.dot)}
                      />
                      {statusConfig.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">{execution.duration}</td>
                  <td className="px-6 py-4 text-text-secondary">
                    {new Date(execution.startedAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/observability/${execution.id}`}
                      className="text-text-secondary hover:text-primary transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredExecutions.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-text-secondary">
            No executions found matching &quot;{searchQuery}&quot;
          </p>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="p-4 border-t border-border-dark flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          Showing <span className="font-medium text-white">1-{filteredExecutions.length}</span>{' '}
          of <span className="font-medium text-white">{executions.length}</span> results
        </p>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded-md border border-border-dark text-text-secondary text-sm disabled:opacity-50"
            disabled
          >
            Previous
          </button>
          <button className="px-3 py-1 rounded-md border border-border-dark text-text-secondary text-sm hover:bg-slate-800 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExecutionsTable;
