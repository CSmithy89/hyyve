/**
 * PipelineFlow Component
 *
 * Story: 0-2-13 Implement Knowledge Base UI
 * AC3: Visual 4-step pipeline flow
 */

'use client';

import { Database, Scissors, Cpu, HardDrive, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PipelineStep } from '@/lib/mock-data/knowledge-base';

export interface PipelineFlowProps {
  steps: PipelineStep[];
  className?: string;
}

const STEP_ICONS: Record<string, React.ReactNode> = {
  database: <Database className="h-5 w-5" />,
  content_cut: <Scissors className="h-5 w-5" />,
  memory: <Cpu className="h-5 w-5" />,
  storage: <HardDrive className="h-5 w-5" />,
};

const STEP_LABELS: Record<string, string> = {
  'Data Sources': 'Ingest',
  'Chunking': 'Chunk',
  'Embedding': 'Embed',
  'Vector Index': 'Store',
};

const STATUS_STYLES = {
  active: {
    container: 'bg-primary/10 border-primary/30',
    icon: 'text-primary',
    label: 'text-white',
  },
  inactive: {
    container: 'bg-surface-dark border-border-dark',
    icon: 'text-text-secondary',
    label: 'text-text-secondary',
  },
  error: {
    container: 'bg-red-500/10 border-red-500/30',
    icon: 'text-red-400',
    label: 'text-red-400',
  },
};

export function PipelineFlow({ steps, className }: PipelineFlowProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {steps.map((step, index) => {
        const statusStyle = STATUS_STYLES[step.status];
        const icon = STEP_ICONS[step.icon] ?? <Database className="h-5 w-5" />;
        const label = STEP_LABELS[step.name] ?? step.name;

        return (
          <div key={step.id} className="flex items-center gap-2">
            {/* Step Card */}
            <div
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-xl border min-w-[100px]',
                statusStyle.container
              )}
            >
              <div className={cn('p-2 rounded-lg bg-white/5', statusStyle.icon)}>
                {icon}
              </div>
              <span className={cn('text-xs font-medium', statusStyle.label)}>
                {label}
              </span>
              {step.status === 'active' && (
                <span className="text-[10px] text-primary font-mono">Active</span>
              )}
              {step.status === 'error' && (
                <span className="text-[10px] text-red-400 font-mono">Error</span>
              )}
            </div>

            {/* Arrow Connector */}
            {index < steps.length - 1 && (
              <ChevronRight className="h-5 w-5 text-text-secondary flex-shrink-0" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default PipelineFlow;
