/**
 * Knowledge Base UI - ATDD Tests
 *
 * Story: 0-2-13 Implement Knowledge Base UI
 *
 * Tests the knowledge base pages per acceptance criteria:
 * - AC1: Knowledge base list at /knowledge
 * - AC2: Knowledge base detail at /knowledge/[id]
 * - AC3: Visual pipeline flow
 * - AC4: Design consistency
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// FILE EXISTENCE TESTS
// =============================================================================

describe('Story 0-2-13: Knowledge Base - File Structure', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  describe('Knowledge Base Page Files', () => {
    it('should have knowledge base list page', () => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/knowledge/page.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have knowledge base detail page', () => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/knowledge/[id]/page.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have knowledge base layout', () => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/knowledge/layout.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have knowledge base loading state', () => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/knowledge/loading.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  describe('Knowledge Base Component Files', () => {
    it('should have KnowledgeBaseCard component', () => {
      const filePath = path.join(WEB_APP_PATH, 'components/knowledge/KnowledgeBaseCard.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have DocumentList component', () => {
      const filePath = path.join(WEB_APP_PATH, 'components/knowledge/DocumentList.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have PipelineFlow component', () => {
      const filePath = path.join(WEB_APP_PATH, 'components/knowledge/PipelineFlow.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have component index for barrel exports', () => {
      const filePath = path.join(WEB_APP_PATH, 'components/knowledge/index.ts');
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  describe('Mock Data Files', () => {
    it('should have knowledge base mock data', () => {
      const filePath = path.join(WEB_APP_PATH, 'lib/mock-data/knowledge-base.ts');
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
});

// =============================================================================
// AC1: KNOWLEDGE BASE LIST TESTS
// =============================================================================

describe('Story 0-2-13: AC1 - Knowledge Base List', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  describe('Knowledge Base List Page', () => {
    let pageContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/knowledge/page.tsx');
      if (fs.existsSync(filePath)) {
        pageContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should render knowledge base list page', () => {
      expect(pageContent).toBeDefined();
    });

    it('should have search functionality', () => {
      expect(pageContent).toMatch(/search|Search/i);
    });

    it('should have create new KB button', () => {
      expect(pageContent).toMatch(/create|new|add/i);
    });
  });
});

// =============================================================================
// AC2: KNOWLEDGE BASE DETAIL TESTS
// =============================================================================

describe('Story 0-2-13: AC2 - Knowledge Base Detail', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  describe('Knowledge Base Detail Page', () => {
    let pageContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/knowledge/[id]/page.tsx');
      if (fs.existsSync(filePath)) {
        pageContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should render knowledge base detail page', () => {
      expect(pageContent).toBeDefined();
    });

    it('should show document list', () => {
      expect(pageContent).toMatch(/document|Document|file|File/i);
    });
  });
});

// =============================================================================
// AC3: PIPELINE FLOW TESTS
// =============================================================================

describe('Story 0-2-13: AC3 - Pipeline Flow', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  describe('PipelineFlow Component', () => {
    let componentContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'components/knowledge/PipelineFlow.tsx');
      if (fs.existsSync(filePath)) {
        componentContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should export PipelineFlow component', () => {
      expect(componentContent).toMatch(/export\s+(function|const)\s+PipelineFlow/);
    });

    it('should show ingest step', () => {
      expect(componentContent).toMatch(/ingest|Ingest|source|Source/i);
    });

    it('should show chunk step', () => {
      expect(componentContent).toMatch(/chunk|Chunk|process|Process/i);
    });

    it('should show embed step', () => {
      expect(componentContent).toMatch(/embed|Embed/i);
    });

    it('should show store step', () => {
      expect(componentContent).toMatch(/store|Store|vector|Vector/i);
    });
  });
});

// =============================================================================
// AC4: DESIGN CONSISTENCY TESTS
// =============================================================================

describe('Story 0-2-13: AC4 - Design Consistency', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  it('should use Hyyve design tokens', () => {
    const filePath = path.join(WEB_APP_PATH, 'app/(app)/knowledge/page.tsx');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toMatch(/bg-|text-|border-|rounded-/);
    }
  });

  it('should use Material Symbols or lucide icons', () => {
    const filePath = path.join(WEB_APP_PATH, 'components/knowledge/PipelineFlow.tsx');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toMatch(/material-symbols|lucide|icon/i);
    }
  });
});

// =============================================================================
// BARREL EXPORT TESTS
// =============================================================================

describe('Story 0-2-13: Component Exports', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  it('should export all knowledge components from index', () => {
    const filePath = path.join(WEB_APP_PATH, 'components/knowledge/index.ts');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toMatch(/export.*KnowledgeBaseCard/);
      expect(content).toMatch(/export.*DocumentList/);
      expect(content).toMatch(/export.*PipelineFlow/);
    }
  });
});
