/**
 * Module Builder UI Shell - ATDD Tests
 *
 * Story: 0-2-11 Implement Module Builder UI Shell
 *
 * Tests the module builder page per acceptance criteria:
 * - AC1: Three-panel layout at /builders/module/[id]
 * - AC2: Panel layout with resizable panels
 * - AC3: Sample workflow nodes
 * - AC4: Canvas controls
 * - AC5: Top navigation bar
 * - AC6: Design consistency
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// FILE EXISTENCE TESTS
// =============================================================================

describe('Story 0-2-11: Module Builder - File Structure', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  describe('Module Builder Page Files', () => {
    it('should have module builder page at app/(app)/builders/module/[id]/page.tsx', () => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/builders/module/[id]/page.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have module builder layout', () => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/builders/module/[id]/layout.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have module builder loading state', () => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/builders/module/[id]/loading.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  describe('Module Builder Component Files', () => {
    it('should have ModuleBuilderHeader component', () => {
      const filePath = path.join(WEB_APP_PATH, 'components/builders/module/ModuleBuilderHeader.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have KnowledgeBasePanel component', () => {
      const filePath = path.join(WEB_APP_PATH, 'components/builders/module/KnowledgeBasePanel.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have WorkflowNodes component', () => {
      const filePath = path.join(WEB_APP_PATH, 'components/builders/module/WorkflowNodes.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have component index for barrel exports', () => {
      const filePath = path.join(WEB_APP_PATH, 'components/builders/module/index.ts');
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  describe('Mock Data Files', () => {
    it('should have module builder mock data', () => {
      const filePath = path.join(WEB_APP_PATH, 'lib/mock-data/module-builder.ts');
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
});

// =============================================================================
// AC1: THREE-PANEL LAYOUT TESTS
// =============================================================================

describe('Story 0-2-11: AC1 - Three-Panel Layout', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  describe('Module Builder Page', () => {
    let pageContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/builders/module/[id]/page.tsx');
      if (fs.existsSync(filePath)) {
        pageContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should render module builder page', () => {
      expect(pageContent).toBeDefined();
    });

    it('should include left panel (knowledge base)', () => {
      expect(pageContent).toMatch(/knowledge|left|panel|aside/i);
    });

    it('should include center panel (canvas)', () => {
      expect(pageContent).toMatch(/canvas|center|main|flow/i);
    });

    it('should include right panel (agent chat)', () => {
      expect(pageContent).toMatch(/agent|chat|bond|right/i);
    });
  });
});

// =============================================================================
// AC2: PANEL LAYOUT TESTS
// =============================================================================

describe('Story 0-2-11: AC2 - Panel Layout', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  describe('KnowledgeBasePanel Component', () => {
    let componentContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'components/builders/module/KnowledgeBasePanel.tsx');
      if (fs.existsSync(filePath)) {
        componentContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should export KnowledgeBasePanel component', () => {
      expect(componentContent).toMatch(/export\s+(function|const)\s+KnowledgeBasePanel/);
    });

    it('should have search functionality', () => {
      expect(componentContent).toMatch(/search/i);
    });

    it('should have folders section', () => {
      expect(componentContent).toMatch(/folder/i);
    });

    it('should have files section', () => {
      expect(componentContent).toMatch(/file/i);
    });
  });
});

// =============================================================================
// AC3: SAMPLE WORKFLOW NODES TESTS
// =============================================================================

describe('Story 0-2-11: AC3 - Sample Workflow Nodes', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  describe('WorkflowNodes Component', () => {
    let componentContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'components/builders/module/WorkflowNodes.tsx');
      if (fs.existsSync(filePath)) {
        componentContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should export WorkflowNodes component', () => {
      expect(componentContent).toMatch(/export\s+(function|const)\s+WorkflowNodes/);
    });

    it('should have input trigger node', () => {
      expect(componentContent).toMatch(/trigger|input|webhook/i);
    });

    it('should have LLM processing node', () => {
      expect(componentContent).toMatch(/llm|processing|gpt|model/i);
    });

    it('should have branch logic node', () => {
      expect(componentContent).toMatch(/branch|logic|condition/i);
    });

    it('should have slack notification node', () => {
      expect(componentContent).toMatch(/slack|notify|notification/i);
    });
  });

  describe('Mock Data - Workflow Nodes', () => {
    let mockDataContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'lib/mock-data/module-builder.ts');
      if (fs.existsSync(filePath)) {
        mockDataContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should export workflow nodes data', () => {
      expect(mockDataContent).toMatch(/node|WORKFLOW|NODE/i);
    });

    it('should export workflow edges data', () => {
      expect(mockDataContent).toMatch(/edge|EDGE|connection/i);
    });
  });
});

// =============================================================================
// AC4: CANVAS CONTROLS TESTS
// =============================================================================

describe('Story 0-2-11: AC4 - Canvas Controls', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  describe('Module Builder Page - Canvas Controls', () => {
    let pageContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/builders/module/[id]/page.tsx');
      if (fs.existsSync(filePath)) {
        pageContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should have zoom controls', () => {
      expect(pageContent).toMatch(/zoom|Controls|add|remove/i);
    });

    it('should have minimap', () => {
      expect(pageContent).toMatch(/minimap|MiniMap/i);
    });
  });
});

// =============================================================================
// AC5: TOP NAVIGATION BAR TESTS
// =============================================================================

describe('Story 0-2-11: AC5 - Top Navigation Bar', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  describe('ModuleBuilderHeader Component', () => {
    let componentContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'components/builders/module/ModuleBuilderHeader.tsx');
      if (fs.existsSync(filePath)) {
        componentContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should export ModuleBuilderHeader component', () => {
      expect(componentContent).toMatch(/export\s+(function|const)\s+ModuleBuilderHeader/);
    });

    it('should have breadcrumbs', () => {
      expect(componentContent).toMatch(/breadcrumb|chevron|project|workflow/i);
    });

    it('should have run button', () => {
      expect(componentContent).toMatch(/run|play/i);
    });

    it('should have save button', () => {
      expect(componentContent).toMatch(/save/i);
    });

    it('should have export button', () => {
      expect(componentContent).toMatch(/export|share/i);
    });
  });
});

// =============================================================================
// AC6: DESIGN CONSISTENCY TESTS
// =============================================================================

describe('Story 0-2-11: AC6 - Design Consistency', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  it('should use Hyyve design tokens in module builder', () => {
    const filePath = path.join(WEB_APP_PATH, 'app/(app)/builders/module/[id]/page.tsx');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toMatch(/bg-|text-|border-|rounded-/);
    }
  });

  it('should use Material Symbols or lucide icons', () => {
    const filePath = path.join(WEB_APP_PATH, 'components/builders/module/ModuleBuilderHeader.tsx');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toMatch(/material-symbols|lucide|icon/i);
    }
  });
});

// =============================================================================
// LOADING STATE TESTS
// =============================================================================

describe('Story 0-2-11: Loading State', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  it('should have skeleton components in loading state', () => {
    const filePath = path.join(WEB_APP_PATH, 'app/(app)/builders/module/[id]/loading.tsx');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toMatch(/Skeleton|loading|skeleton/i);
    }
  });
});

// =============================================================================
// BARREL EXPORT TESTS
// =============================================================================

describe('Story 0-2-11: Component Exports', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  it('should export all module builder components from index', () => {
    const filePath = path.join(WEB_APP_PATH, 'components/builders/module/index.ts');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toMatch(/export.*ModuleBuilderHeader/);
      expect(content).toMatch(/export.*KnowledgeBasePanel/);
      expect(content).toMatch(/export.*WorkflowNodes/);
    }
  });
});
