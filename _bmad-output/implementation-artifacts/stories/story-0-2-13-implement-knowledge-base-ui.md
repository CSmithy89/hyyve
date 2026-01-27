# Story 0.2.13: Implement Knowledge Base UI

## Story

As a **developer**,
I want **the Knowledge Base management pages**,
So that **users can view and manage their document collections**.

## Acceptance Criteria

- **AC1:** Knowledge Base List at `/knowledge`:
  - Search bar for filtering knowledge bases
  - Create new KB button
  - KB cards with document count and size

- **AC2:** Knowledge Base Detail at `/knowledge/[id]`:
  - Document list (files uploaded)
  - Upload dropzone area
  - Document details panel
  - Processing status (chunking, embedding)

- **AC3:** Visual Pipeline Flow:
  - Shows 4-step pipeline: Ingest → Chunk → Embed → Store
  - Status indicators for each step
  - Active/inactive state styling

- **AC4:** Design Consistency:
  - Matches `rag_pipeline_config/code.html` wireframe
  - Hyyve design tokens
  - Uses Material Symbols icons
  - Dark theme with card styling

## Technical Notes

- Uses mock data initially (no API integration)
- Reuses design patterns from other builder pages

## Source Reference

Wireframe: `rag_pipeline_config/code.html`

## Creates

- app/(app)/knowledge/page.tsx
- app/(app)/knowledge/[id]/page.tsx
- app/(app)/knowledge/layout.tsx
- app/(app)/knowledge/loading.tsx
- components/knowledge/KnowledgeBaseCard.tsx
- components/knowledge/DocumentList.tsx
- components/knowledge/PipelineFlow.tsx
- components/knowledge/index.ts
- lib/mock-data/knowledge-base.ts

## Implementation Tasks

- [x] Create mock data for knowledge bases
- [x] Create KnowledgeBaseCard component
- [x] Create DocumentList component
- [x] Create PipelineFlow component
- [x] Create knowledge base list page
- [x] Create knowledge base detail page
- [x] Add loading states
- [x] Add unit tests

## Dev Agent Record

### File List

| File | Action | Description |
|------|--------|-------------|
| lib/mock-data/knowledge-base.ts | created | Mock data for KBs, documents, pipeline steps |
| components/knowledge/KnowledgeBaseCard.tsx | created | KB card with status, doc count, size |
| components/knowledge/DocumentList.tsx | created | Document table with upload dropzone |
| components/knowledge/PipelineFlow.tsx | created | 4-step visual pipeline flow |
| components/knowledge/index.ts | created | Barrel exports for knowledge components |
| app/(app)/knowledge/page.tsx | created | KB list page with search and create |
| app/(app)/knowledge/[id]/page.tsx | created | KB detail page with docs and pipeline |
| app/(app)/knowledge/layout.tsx | created | Knowledge layout wrapper |
| app/(app)/knowledge/loading.tsx | created | Skeleton loading state |
| __tests__/knowledge/knowledge-base.test.ts | created | 26 ATDD tests for all ACs |

### Change Log

- 2026-01-27: Story file created
- 2026-01-27: Implementation complete - all components and pages created

## Status

done
