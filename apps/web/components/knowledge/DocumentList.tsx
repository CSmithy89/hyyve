/**
 * DocumentList Component
 *
 * Story: 0-2-13 Implement Knowledge Base UI
 * AC2: Document list with upload dropzone
 */

'use client';

import { cn } from '@/lib/utils';
import type { Document } from '@/lib/mock-data/knowledge-base';

export interface DocumentListProps {
  documents: Document[];
  selectedId?: string | null;
  onSelect?: (document: Document) => void;
  className?: string;
}

const FILE_ICONS: Record<Document['type'], { icon: string; color: string }> = {
  pdf: { icon: 'picture_as_pdf', color: 'text-red-400' },
  docx: { icon: 'description', color: 'text-blue-400' },
  txt: { icon: 'article', color: 'text-text-secondary' },
  md: { icon: 'code', color: 'text-purple-400' },
  html: { icon: 'code', color: 'text-orange-400' },
  csv: { icon: 'table_chart', color: 'text-green-400' },
};

const STATUS_CONFIG = {
  indexed: {
    label: 'Indexed',
    color: 'bg-emerald-500/10 text-emerald-400',
  },
  processing: {
    label: 'Processing',
    color: 'bg-amber-500/10 text-amber-400',
  },
  pending: {
    label: 'Pending',
    color: 'bg-slate-500/10 text-slate-400',
  },
  error: {
    label: 'Error',
    color: 'bg-red-500/10 text-red-400',
  },
};

export function DocumentList({
  documents,
  selectedId,
  onSelect,
  className,
}: DocumentListProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Dropzone */}
      <div className="border-2 border-dashed border-border-dark rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer group">
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-full text-primary group-hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined text-[24px]">upload</span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              Drop files here or click to upload
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Supports PDF, DOCX, TXT, MD, HTML, CSV
            </p>
          </div>
        </div>
      </div>

      {/* Document Table */}
      <div className="bg-[#1c1b2e] border border-border-dark rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-dark">
              <th className="text-left text-xs font-medium text-text-secondary px-4 py-3">
                Name
              </th>
              <th className="text-left text-xs font-medium text-text-secondary px-4 py-3">
                Size
              </th>
              <th className="text-left text-xs font-medium text-text-secondary px-4 py-3">
                Chunks
              </th>
              <th className="text-left text-xs font-medium text-text-secondary px-4 py-3">
                Status
              </th>
              <th className="text-left text-xs font-medium text-text-secondary px-4 py-3">
                Uploaded
              </th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => {
              const statusConfig = STATUS_CONFIG[doc.status];
              const fileIcon = FILE_ICONS[doc.type];
              const isSelected = selectedId === doc.id;
              return (
                <tr
                  key={doc.id}
                  onClick={() => onSelect?.(doc)}
                  className={cn(
                    'border-b border-border-dark last:border-b-0 transition-colors cursor-pointer',
                    isSelected
                      ? 'bg-primary/10 hover:bg-primary/15'
                      : 'hover:bg-white/5'
                  )}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'material-symbols-outlined text-[18px]',
                          fileIcon.color
                        )}
                      >
                        {fileIcon.icon}
                      </span>
                      <span className="text-sm text-white">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {doc.size}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {doc.chunkCount ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'text-xs font-mono px-2 py-0.5 rounded',
                        statusConfig.color
                      )}
                    >
                      {statusConfig.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DocumentList;
