/**
 * Knowledge Base Detail Page
 *
 * Story: 0-2-13 Implement Knowledge Base UI
 * AC2: Document list with processing status
 * AC3: Visual pipeline flow
 */

'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import {
  DocumentList,
  DocumentDetailsPanel,
  PipelineFlow,
} from '@/components/knowledge';
import {
  KNOWLEDGE_BASES,
  DOCUMENTS,
  PIPELINE_STEPS,
  type Document,
} from '@/lib/mock-data/knowledge-base';

interface KnowledgeBaseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function KnowledgeBaseDetailPage({
  params,
}: KnowledgeBaseDetailPageProps) {
  const { id } = use(params);
  const kb = KNOWLEDGE_BASES.find((k) => k.id === id) ?? KNOWLEDGE_BASES[0];
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );

  // This should never happen with mock data, but satisfies TypeScript
  if (!kb) {
    return (
      <div className="p-6 text-center">
        <p className="text-text-secondary">Knowledge base not found</p>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/knowledge"
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[20px] text-text-secondary">
              arrow_back
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <span className="material-symbols-outlined text-[24px]">
                database
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{kb.name}</h1>
              {kb.description && (
                <p className="text-sm text-text-secondary">{kb.description}</p>
              )}
            </div>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-surface-dark border border-border-dark text-white rounded-lg hover:bg-white/5 transition-colors">
          <span className="material-symbols-outlined text-[18px]">settings</span>
          <span>Settings</span>
        </button>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-6 p-4 bg-[#1c1b2e] border border-border-dark rounded-xl">
        <div>
          <p className="text-xs text-text-secondary">Documents</p>
          <p className="text-lg font-bold text-white">{kb.documentCount}</p>
        </div>
        <div className="h-8 w-px bg-border-dark" />
        <div>
          <p className="text-xs text-text-secondary">Total Size</p>
          <p className="text-lg font-bold text-primary">{kb.totalSize}</p>
        </div>
        <div className="h-8 w-px bg-border-dark" />
        <div>
          <p className="text-xs text-text-secondary">Embedding Model</p>
          <p className="text-sm font-mono text-white">{kb.embeddingModel}</p>
        </div>
        <div className="h-8 w-px bg-border-dark" />
        <div>
          <p className="text-xs text-text-secondary">Last Updated</p>
          <p className="text-sm text-white">
            {new Date(kb.lastUpdated).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Pipeline Flow */}
      <div className="p-4 bg-[#1c1b2e] border border-border-dark rounded-xl">
        <h2 className="text-sm font-medium text-text-secondary mb-4">
          Processing Pipeline
        </h2>
        <PipelineFlow steps={PIPELINE_STEPS} />
      </div>

        {/* Documents Section */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Documents</h2>
          <DocumentList
            documents={DOCUMENTS}
            selectedId={selectedDocument?.id}
            onSelect={setSelectedDocument}
          />
        </div>
      </div>

      {/* Document Details Panel */}
      <DocumentDetailsPanel
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
      />
    </div>
  );
}
