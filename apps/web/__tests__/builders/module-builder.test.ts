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
import { fileExists, safeReadFile } from '../support/file-helpers';

// =============================================================================
// FILE EXISTENCE TESTS
// =============================================================================

describe('Story 0-2-11: Module Builder - File Structure', () => {
  describe('Module Builder Page Files', () => {
    it('should have module builder page at app/(app)/builders/module/[id]/page.tsx', () => {
      expect(fileExists('app/(app)/builders/module/[id]/page.tsx')).toBe(true);
    });

    it('should have module builder layout', () => {
      expect(fileExists('app/(app)/builders/module/[id]/layout.tsx')).toBe(true);
    });

    it('should have module builder loading state', () => {
      expect(fileExists('app/(app)/builders/module/[id]/loading.tsx')).toBe(true);
    });
  });

  describe('Module Builder Component Files', () => {
    it('should have ModuleBuilderHeader component', () => {
      expect(fileExists('components/builders/module/ModuleBuilderHeader.tsx')).toBe(true);
    });

    it('should have KnowledgeBasePanel component', () => {
      expect(fileExists('components/builders/module/KnowledgeBasePanel.tsx')).toBe(true);
    });

    it('should have WorkflowNodes component', () => {
      expect(fileExists('components/builders/module/WorkflowNodes.tsx')).toBe(true);
    });

    it('should have component index for barrel exports', () => {
      expect(fileExists('components/builders/module/index.ts')).toBe(true);
    });
  });

  describe('Mock Data Files', () => {
    it('should have module builder mock data', () => {
      expect(fileExists('lib/mock-data/module-builder.ts')).toBe(true);
    });
  });
});

// =============================================================================
// AC1: THREE-PANEL LAYOUT TESTS
// =============================================================================

describe('Story 0-2-11: AC1 - Three-Panel Layout', () => {
  describe('Module Builder Page', () => {
    let pageContent = '';

    beforeEach(() => {
      pageContent = safeReadFile('app/(app)/builders/module/[id]/page.tsx');
    });

    it('should render module builder page', () => {
      expect(pageContent.length).toBeGreaterThan(0);
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
  describe('KnowledgeBasePanel Component', () => {
    let componentContent = '';

    beforeEach(() => {
      componentContent = safeReadFile('components/builders/module/KnowledgeBasePanel.tsx');
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
  describe('WorkflowNodes Component', () => {
    let componentContent = '';

    beforeEach(() => {
      componentContent = safeReadFile('components/builders/module/WorkflowNodes.tsx');
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
    let mockDataContent = '';

    beforeEach(() => {
      mockDataContent = safeReadFile('lib/mock-data/module-builder.ts');
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
  describe('Module Builder Page - Canvas Controls', () => {
    let pageContent = '';

    beforeEach(() => {
      pageContent = safeReadFile('app/(app)/builders/module/[id]/page.tsx');
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
  describe('ModuleBuilderHeader Component', () => {
    let componentContent = '';

    beforeEach(() => {
      componentContent = safeReadFile('components/builders/module/ModuleBuilderHeader.tsx');
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
  it('should use Hyyve design tokens in module builder', () => {
    const content = safeReadFile('app/(app)/builders/module/[id]/page.tsx');
    expect(content).toMatch(/bg-|text-|border-|rounded-/);
  });

  it('should use Material Symbols or lucide icons', () => {
    const content = safeReadFile('components/builders/module/ModuleBuilderHeader.tsx');
    expect(content).toMatch(/material-symbols|lucide|icon/i);
  });
});

// =============================================================================
// LOADING STATE TESTS
// =============================================================================

describe('Story 0-2-11: Loading State', () => {
  it('should have skeleton components in loading state', () => {
    const content = safeReadFile('app/(app)/builders/module/[id]/loading.tsx');
    expect(content).toMatch(/Skeleton|loading|skeleton/i);
  });
});

// =============================================================================
// BARREL EXPORT TESTS
// =============================================================================

describe('Story 0-2-11: Component Exports', () => {
  it('should export all module builder components from index', () => {
    const content = safeReadFile('components/builders/module/index.ts');
    expect(content).toMatch(/export.*ModuleBuilderHeader/);
    expect(content).toMatch(/export.*KnowledgeBasePanel/);
    // WorkflowNodes is exported in a multi-line export block
    expect(content).toContain('WorkflowNodes');
  });
});
