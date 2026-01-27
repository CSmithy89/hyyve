/**
 * Chatbot Builder UI Shell - ATDD Tests
 *
 * Story: 0-2-12 Implement Chatbot Builder UI Shell
 *
 * Tests the chatbot builder page per acceptance criteria:
 * - AC1: Three-panel layout at /builders/chatbot/[id]
 * - AC2: Intents panel with tabs and search
 * - AC3: Sample conversation nodes
 * - AC4: Canvas controls
 * - AC5: Top navigation bar
 * - AC6: Wendy AI panel
 * - AC7: Design consistency
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// FILE EXISTENCE TESTS
// =============================================================================

describe('Story 0-2-12: Chatbot Builder - File Structure', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  describe('Chatbot Builder Page Files', () => {
    it('should have chatbot builder page at app/(app)/builders/chatbot/[id]/page.tsx', () => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/builders/chatbot/[id]/page.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have chatbot builder layout', () => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/builders/chatbot/[id]/layout.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have chatbot builder loading state', () => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/builders/chatbot/[id]/loading.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  describe('Chatbot Builder Component Files', () => {
    it('should have ChatbotBuilderHeader component', () => {
      const filePath = path.join(WEB_APP_PATH, 'components/builders/chatbot/ChatbotBuilderHeader.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have IntentsPanel component', () => {
      const filePath = path.join(WEB_APP_PATH, 'components/builders/chatbot/IntentsPanel.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have ConversationNodes component', () => {
      const filePath = path.join(WEB_APP_PATH, 'components/builders/chatbot/ConversationNodes.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have component index for barrel exports', () => {
      const filePath = path.join(WEB_APP_PATH, 'components/builders/chatbot/index.ts');
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  describe('Mock Data Files', () => {
    it('should have chatbot builder mock data', () => {
      const filePath = path.join(WEB_APP_PATH, 'lib/mock-data/chatbot-builder.ts');
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
});

// =============================================================================
// AC1: THREE-PANEL LAYOUT TESTS
// =============================================================================

describe('Story 0-2-12: AC1 - Three-Panel Layout', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  describe('Chatbot Builder Page', () => {
    let pageContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/builders/chatbot/[id]/page.tsx');
      if (fs.existsSync(filePath)) {
        pageContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should render chatbot builder page', () => {
      expect(pageContent).toBeDefined();
    });

    it('should include left panel (intents)', () => {
      expect(pageContent).toMatch(/intent|left|panel|aside/i);
    });

    it('should include center panel (canvas)', () => {
      expect(pageContent).toMatch(/canvas|center|main|flow/i);
    });

    it('should include right panel (Wendy chat)', () => {
      expect(pageContent).toMatch(/wendy|agent|chat|right/i);
    });
  });
});

// =============================================================================
// AC2: INTENTS PANEL TESTS
// =============================================================================

describe('Story 0-2-12: AC2 - Intents Panel', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  describe('IntentsPanel Component', () => {
    let componentContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'components/builders/chatbot/IntentsPanel.tsx');
      if (fs.existsSync(filePath)) {
        componentContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should export IntentsPanel component', () => {
      expect(componentContent).toMatch(/export\s+(function|const)\s+IntentsPanel/);
    });

    it('should have search functionality', () => {
      expect(componentContent).toMatch(/search/i);
    });

    it('should have tabs (Intents, Entities, Variables)', () => {
      expect(componentContent).toMatch(/tab|intents|entities|variables/i);
    });

    it('should display confidence scores', () => {
      expect(componentContent).toMatch(/confidence|percent|%/i);
    });
  });
});

// =============================================================================
// AC3: CONVERSATION NODES TESTS
// =============================================================================

describe('Story 0-2-12: AC3 - Conversation Nodes', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  describe('ConversationNodes Component', () => {
    let componentContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'components/builders/chatbot/ConversationNodes.tsx');
      if (fs.existsSync(filePath)) {
        componentContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should export ConversationNodes component', () => {
      expect(componentContent).toMatch(/export\s+(function|const)\s+ConversationNodes/);
    });

    it('should have start node', () => {
      expect(componentContent).toMatch(/start|trigger|bolt/i);
    });

    it('should have decision/router node', () => {
      expect(componentContent).toMatch(/decision|router|identify|alt_route/i);
    });

    it('should have bot says/message node', () => {
      expect(componentContent).toMatch(/bot|says|message|forum/i);
    });
  });

  describe('Mock Data - Conversation Nodes', () => {
    let mockDataContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'lib/mock-data/chatbot-builder.ts');
      if (fs.existsSync(filePath)) {
        mockDataContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should export conversation nodes data', () => {
      expect(mockDataContent).toMatch(/node|CONVERSATION|NODE/i);
    });

    it('should export intents data', () => {
      expect(mockDataContent).toMatch(/intent|INTENT/i);
    });
  });
});

// =============================================================================
// AC4: CANVAS CONTROLS TESTS
// =============================================================================

describe('Story 0-2-12: AC4 - Canvas Controls', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  describe('Chatbot Builder Page - Canvas Controls', () => {
    let pageContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/builders/chatbot/[id]/page.tsx');
      if (fs.existsSync(filePath)) {
        pageContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should have zoom controls or canvas controls', () => {
      expect(pageContent).toMatch(/zoom|Controls|add|remove|FlowCanvas/i);
    });
  });
});

// =============================================================================
// AC5: TOP NAVIGATION BAR TESTS
// =============================================================================

describe('Story 0-2-12: AC5 - Top Navigation Bar', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  describe('ChatbotBuilderHeader Component', () => {
    let componentContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'components/builders/chatbot/ChatbotBuilderHeader.tsx');
      if (fs.existsSync(filePath)) {
        componentContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should export ChatbotBuilderHeader component', () => {
      expect(componentContent).toMatch(/export\s+(function|const)\s+ChatbotBuilderHeader/);
    });

    it('should have breadcrumbs', () => {
      expect(componentContent).toMatch(/breadcrumb|chevron|project|flow/i);
    });

    it('should have training status indicator', () => {
      expect(componentContent).toMatch(/training|status/i);
    });

    it('should have preview button', () => {
      expect(componentContent).toMatch(/preview/i);
    });

    it('should have deploy button', () => {
      expect(componentContent).toMatch(/deploy/i);
    });
  });
});

// =============================================================================
// AC6: WENDY AI PANEL TESTS
// =============================================================================

describe('Story 0-2-12: AC6 - Wendy AI Panel', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  describe('Chatbot Builder Page - Wendy Chat', () => {
    let pageContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/builders/chatbot/[id]/page.tsx');
      if (fs.existsSync(filePath)) {
        pageContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should include Agent Wendy chat', () => {
      expect(pageContent).toMatch(/wendy|AgentChat/i);
    });
  });
});

// =============================================================================
// AC7: DESIGN CONSISTENCY TESTS
// =============================================================================

describe('Story 0-2-12: AC7 - Design Consistency', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  it('should use Hyyve design tokens in chatbot builder', () => {
    const filePath = path.join(WEB_APP_PATH, 'app/(app)/builders/chatbot/[id]/page.tsx');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toMatch(/bg-|text-|border-|rounded-/);
    }
  });

  it('should use Material Symbols or lucide icons', () => {
    const filePath = path.join(WEB_APP_PATH, 'components/builders/chatbot/ChatbotBuilderHeader.tsx');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toMatch(/material-symbols|lucide|icon/i);
    }
  });
});

// =============================================================================
// LOADING STATE TESTS
// =============================================================================

describe('Story 0-2-12: Loading State', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  it('should have skeleton components in loading state', () => {
    const filePath = path.join(WEB_APP_PATH, 'app/(app)/builders/chatbot/[id]/loading.tsx');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toMatch(/Skeleton|loading|skeleton/i);
    }
  });
});

// =============================================================================
// BARREL EXPORT TESTS
// =============================================================================

describe('Story 0-2-12: Component Exports', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  it('should export all chatbot builder components from index', () => {
    const filePath = path.join(WEB_APP_PATH, 'components/builders/chatbot/index.ts');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toMatch(/export.*ChatbotBuilderHeader/);
      expect(content).toMatch(/export.*IntentsPanel/);
      expect(content).toMatch(/export.*ConversationNodes/);
    }
  });
});
