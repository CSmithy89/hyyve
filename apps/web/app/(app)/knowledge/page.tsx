/**
 * Knowledge Base List Page
 *
 * Story: 0-2-13 Implement Knowledge Base UI
 * AC1: Knowledge base list with search and create button
 */

'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { KnowledgeBaseCard } from '@/components/knowledge';
import { KNOWLEDGE_BASES } from '@/lib/mock-data/knowledge-base';

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredKBs = KNOWLEDGE_BASES.filter(
    (kb) =>
      kb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kb.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Knowledge Bases</h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage your document collections and RAG pipelines
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Create New</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
        <input
          type="text"
          placeholder="Search knowledge bases..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-surface-dark border border-border-dark rounded-lg text-white placeholder:text-text-secondary focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Knowledge Base Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredKBs.map((kb) => (
          <KnowledgeBaseCard key={kb.id} knowledgeBase={kb} />
        ))}
      </div>

      {/* Empty State */}
      {filteredKBs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-secondary">
            No knowledge bases found matching &quot;{searchQuery}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
