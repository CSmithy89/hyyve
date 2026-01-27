/**
 * KnowledgeBaseCard Component
 *
 * Story: 0-2-13 Implement Knowledge Base UI
 * AC1: KB cards with document count and size
 */

'use client';

import Link from 'next/link';
import { FileText, Clock, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { KnowledgeBase } from '@/lib/mock-data/knowledge-base';

export interface KnowledgeBaseCardProps {
  knowledgeBase: KnowledgeBase;
  className?: string;
}

const STATUS_CONFIG = {
  active: {
    label: 'Active',
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-500',
  },
  syncing: {
    label: 'Syncing',
    color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    dot: 'bg-amber-500 animate-pulse',
  },
  error: {
    label: 'Error',
    color: 'bg-red-500/10 text-red-400 border-red-500/20',
    dot: 'bg-red-500',
  },
};

export function KnowledgeBaseCard({
  knowledgeBase,
  className,
}: KnowledgeBaseCardProps) {
  const statusConfig = STATUS_CONFIG[knowledgeBase.status];

  return (
    <Link
      href={`/knowledge/${knowledgeBase.id}`}
      className={cn(
        'block p-5 bg-[#1c1b2e] border border-border-dark rounded-xl hover:border-primary/50 transition-all group',
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors">
              {knowledgeBase.name}
            </h3>
            {knowledgeBase.description && (
              <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">
                {knowledgeBase.description}
              </p>
            )}
          </div>
        </div>
        <span
          className={cn(
            'text-xs font-mono px-2 py-1 rounded border',
            statusConfig.color
          )}
        >
          <span className={cn('inline-block w-1.5 h-1.5 rounded-full mr-1.5', statusConfig.dot)} />
          {statusConfig.label}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-text-secondary">
        <div className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5" />
          <span>{knowledgeBase.documentCount} documents</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-primary">{knowledgeBase.totalSize}</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <Clock className="h-3.5 w-3.5" />
          <span>{new Date(knowledgeBase.lastUpdated).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default KnowledgeBaseCard;
