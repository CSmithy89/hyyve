/**
 * DocumentList Component
 *
 * Story: 0-2-13 Implement Knowledge Base UI
 * AC2: Document list with upload dropzone
 */

'use client';

import { FileText, FileType, File, Table, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Document } from '@/lib/mock-data/knowledge-base';

export interface DocumentListProps {
  documents: Document[];
  className?: string;
}

const FILE_ICONS: Record<Document['type'], React.ReactNode> = {
  pdf: <FileText className="h-4 w-4 text-red-400" />,
  docx: <FileType className="h-4 w-4 text-blue-400" />,
  txt: <File className="h-4 w-4 text-text-secondary" />,
  md: <FileText className="h-4 w-4 text-purple-400" />,
  html: <FileText className="h-4 w-4 text-orange-400" />,
  csv: <Table className="h-4 w-4 text-green-400" />,
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

export function DocumentList({ documents, className }: DocumentListProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Dropzone */}
      <div className="border-2 border-dashed border-border-dark rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer group">
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-full text-primary group-hover:bg-primary/20 transition-colors">
            <Upload className="h-6 w-6" />
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
              return (
                <tr
                  key={doc.id}
                  className="border-b border-border-dark last:border-b-0 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {FILE_ICONS[doc.type]}
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
