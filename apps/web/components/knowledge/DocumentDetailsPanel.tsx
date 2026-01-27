/**
 * DocumentDetailsPanel Component
 *
 * Story: 0-2-13 Implement Knowledge Base UI
 * AC2: Document details panel
 *
 * Shows detailed information about a selected document including
 * metadata, chunks, and processing status.
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { Document } from '@/lib/mock-data/knowledge-base';

export interface DocumentDetailsPanelProps {
  document: Document | null;
  onClose?: () => void;
  className?: string;
}

const STATUS_CONFIG = {
  indexed: {
    label: 'Indexed',
    icon: 'check_circle',
    color: 'text-emerald-400',
  },
  processing: {
    label: 'Processing',
    icon: 'sync',
    color: 'text-amber-400',
  },
  pending: {
    label: 'Pending',
    icon: 'schedule',
    color: 'text-slate-400',
  },
  error: {
    label: 'Error',
    icon: 'error',
    color: 'text-red-400',
  },
};

export function DocumentDetailsPanel({
  document,
  onClose,
  className,
}: DocumentDetailsPanelProps) {
  if (!document) {
    return (
      <aside
        className={cn(
          'w-80 flex-none bg-[#1c1b2e] border-l border-border-dark p-6 flex flex-col items-center justify-center text-center',
          className
        )}
      >
        <span className="material-symbols-outlined text-[48px] text-text-secondary mb-4">
          description
        </span>
        <p className="text-sm text-text-secondary">
          Select a document to view details
        </p>
      </aside>
    );
  }

  const statusConfig = STATUS_CONFIG[document.status];

  return (
    <aside
      className={cn(
        'w-80 flex-none bg-[#1c1b2e] border-l border-border-dark flex flex-col overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border-dark flex items-center justify-between">
        <h3 className="font-semibold text-white truncate flex-1">
          Document Details
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        )}
      </div>

      {/* Document Info */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* File Info */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <span className="material-symbols-outlined text-primary text-[24px]">
              description
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {document.name}
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              {document.type.toUpperCase()} &bull; {document.size}
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="bg-[#131221] rounded-lg p-4">
          <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">
            Status
          </p>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'material-symbols-outlined text-[20px]',
                statusConfig.color
              )}
            >
              {statusConfig.icon}
            </span>
            <span className={cn('text-sm font-medium', statusConfig.color)}>
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Metadata */}
        <div className="space-y-3">
          <p className="text-xs text-text-secondary uppercase tracking-wider">
            Metadata
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#131221] rounded-lg p-3">
              <p className="text-xs text-text-secondary">Chunks</p>
              <p className="text-lg font-bold text-white mt-1">
                {document.chunkCount ?? '—'}
              </p>
            </div>
            <div className="bg-[#131221] rounded-lg p-3">
              <p className="text-xs text-text-secondary">Vectors</p>
              <p className="text-lg font-bold text-primary mt-1">
                {document.chunkCount ? document.chunkCount * 1 : '—'}
              </p>
            </div>
          </div>

          <div className="bg-[#131221] rounded-lg p-3">
            <p className="text-xs text-text-secondary">Uploaded</p>
            <p className="text-sm text-white mt-1">
              {new Date(document.uploadedAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <p className="text-xs text-text-secondary uppercase tracking-wider">
            Actions
          </p>
          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-2 w-full px-3 py-2 bg-[#131221] hover:bg-[#272546] text-white text-sm rounded-lg transition-colors">
              <span className="material-symbols-outlined text-[18px]">
                visibility
              </span>
              Preview Document
            </button>
            <button className="flex items-center gap-2 w-full px-3 py-2 bg-[#131221] hover:bg-[#272546] text-white text-sm rounded-lg transition-colors">
              <span className="material-symbols-outlined text-[18px]">
                refresh
              </span>
              Reprocess
            </button>
            <button className="flex items-center gap-2 w-full px-3 py-2 bg-[#131221] hover:bg-red-500/10 text-red-400 text-sm rounded-lg transition-colors">
              <span className="material-symbols-outlined text-[18px]">
                delete
              </span>
              Delete Document
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default DocumentDetailsPanel;
