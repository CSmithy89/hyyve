/**
 * Knowledge Base Mock Data
 *
 * Story: 0-2-13 Implement Knowledge Base UI
 *
 * Mock data for knowledge bases, documents, and pipeline configuration.
 */

// =============================================================================
// TYPES
// =============================================================================

export interface KnowledgeBase {
  id: string;
  name: string;
  description?: string;
  documentCount: number;
  totalSize: string;
  status: 'active' | 'syncing' | 'error';
  lastUpdated: string;
  embeddingModel: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'txt' | 'md' | 'html' | 'csv';
  size: string;
  status: 'indexed' | 'processing' | 'pending' | 'error';
  chunkCount?: number;
  uploadedAt: string;
}

export interface PipelineStep {
  id: string;
  name: string;
  icon: string;
  status: 'active' | 'inactive' | 'error';
  config: Record<string, string>;
}

// =============================================================================
// KNOWLEDGE BASES
// =============================================================================

export const KNOWLEDGE_BASES: KnowledgeBase[] = [
  {
    id: 'kb-1',
    name: 'Knowledge_Base_v2',
    description: 'Primary product documentation and support articles',
    documentCount: 156,
    totalSize: '24.5 MB',
    status: 'active',
    lastUpdated: '2026-01-27T10:00:00Z',
    embeddingModel: 'text-embedding-3-small',
  },
  {
    id: 'kb-2',
    name: 'Customer_Support_KB',
    description: 'FAQ and troubleshooting guides',
    documentCount: 89,
    totalSize: '12.3 MB',
    status: 'active',
    lastUpdated: '2026-01-26T15:30:00Z',
    embeddingModel: 'text-embedding-3-small',
  },
  {
    id: 'kb-3',
    name: 'Engineering_Docs',
    description: 'Technical documentation and API references',
    documentCount: 234,
    totalSize: '45.7 MB',
    status: 'syncing',
    lastUpdated: '2026-01-27T09:45:00Z',
    embeddingModel: 'text-embedding-3-large',
  },
  {
    id: 'kb-4',
    name: 'Sales_Materials',
    description: 'Presentations and case studies',
    documentCount: 45,
    totalSize: '67.2 MB',
    status: 'active',
    lastUpdated: '2026-01-25T12:00:00Z',
    embeddingModel: 'text-embedding-3-small',
  },
];

// =============================================================================
// DOCUMENTS
// =============================================================================

export const DOCUMENTS: Document[] = [
  {
    id: 'doc-1',
    name: 'Product_Manual_v3.pdf',
    type: 'pdf',
    size: '2.4 MB',
    status: 'indexed',
    chunkCount: 156,
    uploadedAt: '2026-01-27T10:00:00Z',
  },
  {
    id: 'doc-2',
    name: 'API_Reference.md',
    type: 'md',
    size: '450 KB',
    status: 'indexed',
    chunkCount: 89,
    uploadedAt: '2026-01-26T14:30:00Z',
  },
  {
    id: 'doc-3',
    name: 'FAQ_2026.docx',
    type: 'docx',
    size: '1.2 MB',
    status: 'processing',
    uploadedAt: '2026-01-27T09:45:00Z',
  },
  {
    id: 'doc-4',
    name: 'Release_Notes.txt',
    type: 'txt',
    size: '85 KB',
    status: 'indexed',
    chunkCount: 34,
    uploadedAt: '2026-01-25T11:00:00Z',
  },
  {
    id: 'doc-5',
    name: 'Data_Export.csv',
    type: 'csv',
    size: '5.6 MB',
    status: 'pending',
    uploadedAt: '2026-01-27T11:00:00Z',
  },
];

// =============================================================================
// PIPELINE CONFIGURATION
// =============================================================================

export const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: 'step-1',
    name: 'Data Sources',
    icon: 'database',
    status: 'active',
    config: {
      sources: '3 Connected',
      types: 'Notion, PDF',
    },
  },
  {
    id: 'step-2',
    name: 'Chunking',
    icon: 'content_cut',
    status: 'active',
    config: {
      strategy: 'RecursiveCharSplitter',
      chunkSize: '1000',
      overlap: '200',
    },
  },
  {
    id: 'step-3',
    name: 'Embedding',
    icon: 'memory',
    status: 'active',
    config: {
      model: 'text-embedding-3-small',
      dimensions: '1536',
    },
  },
  {
    id: 'step-4',
    name: 'Vector Index',
    icon: 'storage',
    status: 'active',
    config: {
      provider: 'Pinecone',
      index: 'production-index-v1',
    },
  },
];
