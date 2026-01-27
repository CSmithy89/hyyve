/**
 * Execution Detail Page
 *
 * Story: 0-2-14 Implement Observability Dashboard UI
 * AC4: Execution detail view with trace steps
 */

'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Edit, Bolt, Database, Brain, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EXECUTIONS, TRACE_STEPS } from '@/lib/mock-data/observability';

interface ExecutionDetailPageProps {
  params: Promise<{ id: string }>;
}

const STEP_ICONS = {
  trigger: <Bolt className="h-5 w-5" />,
  retrieve: <Database className="h-5 w-5" />,
  llm: <Brain className="h-5 w-5" />,
  output: <Send className="h-5 w-5" />,
};

const STATUS_COLORS = {
  success: 'border-emerald-500 text-emerald-500',
  running: 'border-primary text-primary',
  failed: 'border-red-500 text-red-500',
  pending: 'border-slate-500 text-slate-500',
};

export default function ExecutionDetailPage({ params }: ExecutionDetailPageProps) {
  const { id } = use(params);
  const execution = EXECUTIONS.find((e) => e.id === id) ?? EXECUTIONS[0];

  if (!execution) {
    return (
      <div className="p-6 text-center">
        <p className="text-text-secondary">Execution not found</p>
      </div>
    );
  }

  const isFailed = execution.status === 'fail';

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="h-16 border-b border-border-dark bg-surface-dark flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/observability"
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-text-secondary" />
          </Link>
          <div className="flex items-center text-sm text-text-secondary">
            <span className="hover:text-primary cursor-pointer transition-colors">
              Observability
            </span>
            <span className="mx-2">/</span>
            <span className="font-medium text-white">Run #{execution.id}</span>
          </div>
          <div
            className={cn(
              'flex items-center gap-2 px-3 py-1 rounded-full border',
              isFailed
                ? 'bg-red-500/10 border-red-500/20'
                : 'bg-emerald-500/10 border-emerald-500/20'
            )}
          >
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                isFailed ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'
              )}
            />
            <span
              className={cn(
                'text-xs font-semibold uppercase tracking-wide',
                isFailed ? 'text-red-400' : 'text-emerald-400'
              )}
            >
              {isFailed ? 'Failed' : 'Passed'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-surface-dark border border-border-dark rounded-lg hover:bg-white/5 transition-colors">
            <Edit className="h-4 w-4" />
            Edit Workflow
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20">
            <RefreshCw className="h-4 w-4" />
            Re-run Execution
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Pane: Execution Flow */}
        <section className="flex-1 relative bg-black/20 overflow-hidden p-8">
          {/* Grid Background */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundSize: '20px 20px',
              backgroundImage: 'radial-gradient(circle, #333333 1px, transparent 1px)',
            }}
          />

          {/* Trace Steps */}
          <div className="relative z-10 flex flex-col gap-8 max-w-md mx-auto mt-12">
            {TRACE_STEPS.map((step, index) => {
              const icon = STEP_ICONS[step.type];
              const statusColor = STATUS_COLORS[step.status];

              return (
                <div key={step.id} className="relative">
                  {/* Connector Line */}
                  {index < TRACE_STEPS.length - 1 && (
                    <div className="absolute left-5 top-14 w-0.5 h-8 bg-slate-700" />
                  )}

                  {/* Node Card */}
                  <div
                    className={cn(
                      'bg-surface-dark rounded-xl border p-4 shadow-lg',
                      statusColor
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn('p-2 rounded-lg bg-white/5', statusColor)}>
                          {icon}
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase text-text-secondary">
                            {step.type}
                          </p>
                          <p className="text-sm font-medium text-white">{step.name}</p>
                        </div>
                      </div>
                      {step.duration && (
                        <span className="text-xs text-text-secondary font-mono">
                          {step.duration}
                        </span>
                      )}
                    </div>
                    {step.details && (
                      <p className="text-xs text-text-secondary mt-2 font-mono bg-black/20 rounded p-2">
                        {step.details}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Pane: Execution Details */}
        <aside className="w-96 border-l border-border-dark bg-surface-dark p-6 overflow-y-auto">
          <h3 className="text-lg font-semibold text-white mb-4">Execution Details</h3>

          <div className="space-y-4">
            <div className="p-4 bg-black/20 rounded-lg">
              <p className="text-xs text-text-secondary uppercase font-semibold mb-2">
                Pipeline
              </p>
              <p className="text-sm text-white font-medium">{execution.pipelineName}</p>
            </div>

            <div className="p-4 bg-black/20 rounded-lg">
              <p className="text-xs text-text-secondary uppercase font-semibold mb-2">
                Duration
              </p>
              <p className="text-sm text-white font-mono">{execution.duration}</p>
            </div>

            <div className="p-4 bg-black/20 rounded-lg">
              <p className="text-xs text-text-secondary uppercase font-semibold mb-2">
                Started At
              </p>
              <p className="text-sm text-white font-mono">
                {new Date(execution.startedAt).toLocaleString()}
              </p>
            </div>

            {isFailed && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-xs text-red-400 uppercase font-semibold mb-2">
                  Error Log
                </p>
                <p className="text-sm text-red-300 font-mono">
                  Rate limit exceeded for model GPT-4-Turbo. Please try again in 60
                  seconds.
                </p>
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}
