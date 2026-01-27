/**
 * Storybook Configuration - ATDD Tests
 *
 * Story: 0-2-15 Create Storybook Visual Regression Baseline
 *
 * Tests the Storybook setup per acceptance criteria:
 * - AC1: Storybook installed and configured
 * - AC2: Component stories exist
 * - AC3: Documentation included
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// AC1: STORYBOOK INSTALLATION TESTS
// =============================================================================

describe('Story 0-2-15: Storybook Installation', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  describe('Storybook Configuration Files', () => {
    it('should have .storybook directory', () => {
      const dirPath = path.join(WEB_APP_PATH, '.storybook');
      expect(fs.existsSync(dirPath)).toBe(true);
    });

    it('should have main.ts configuration', () => {
      const filePath = path.join(WEB_APP_PATH, '.storybook/main.ts');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have preview configuration', () => {
      const filePath = path.join(WEB_APP_PATH, '.storybook/preview.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should configure Next.js framework', () => {
      const filePath = path.join(WEB_APP_PATH, '.storybook/main.ts');
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        expect(content).toMatch(/@storybook\/nextjs/);
      }
    });

    it('should have dark mode background configured', () => {
      const filePath = path.join(WEB_APP_PATH, '.storybook/preview.tsx');
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        expect(content).toMatch(/dark|#121121/);
      }
    });
  });

  describe('Package.json Configuration', () => {
    it('should have storybook scripts', () => {
      const filePath = path.join(WEB_APP_PATH, 'package.json');
      if (fs.existsSync(filePath)) {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        expect(content.scripts.storybook).toBeDefined();
        expect(content.scripts['build-storybook']).toBeDefined();
      }
    });

    it('should have @storybook/react dependency', () => {
      const filePath = path.join(WEB_APP_PATH, 'package.json');
      if (fs.existsSync(filePath)) {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        expect(content.devDependencies['@storybook/react']).toBeDefined();
      }
    });

    it('should have @storybook/nextjs dependency', () => {
      const filePath = path.join(WEB_APP_PATH, 'package.json');
      if (fs.existsSync(filePath)) {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        expect(content.devDependencies['@storybook/nextjs']).toBeDefined();
      }
    });
  });
});

// =============================================================================
// AC2: COMPONENT STORIES TESTS
// =============================================================================

describe('Story 0-2-15: Component Stories', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  describe('Stories Directory Structure', () => {
    it('should have stories directory', () => {
      const dirPath = path.join(WEB_APP_PATH, 'stories');
      expect(fs.existsSync(dirPath)).toBe(true);
    });

    it('should have component stories', () => {
      const filePath = path.join(WEB_APP_PATH, 'stories/components/Button.stories.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have navigation stories', () => {
      const filePath = path.join(WEB_APP_PATH, 'stories/navigation/Sidebar.stories.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have chat stories', () => {
      const filePath = path.join(WEB_APP_PATH, 'stories/chat/AgentChat.stories.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  describe('Story Content', () => {
    it('should use CSF format with meta export', () => {
      const filePath = path.join(WEB_APP_PATH, 'stories/components/Button.stories.tsx');
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        expect(content).toMatch(/const meta.*Meta/);
        expect(content).toMatch(/export default meta/);
      }
    });

    it('should have story documentation', () => {
      const filePath = path.join(WEB_APP_PATH, 'stories/components/Button.stories.tsx');
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        expect(content).toMatch(/description|docs/i);
      }
    });

    it('should export story variants', () => {
      const filePath = path.join(WEB_APP_PATH, 'stories/components/Button.stories.tsx');
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        expect(content).toMatch(/export const.*Story/);
      }
    });
  });
});

// =============================================================================
// AC3: DOCUMENTATION TESTS
// =============================================================================

describe('Story 0-2-15: Documentation', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  it('should have autodocs tag', () => {
    const filePath = path.join(WEB_APP_PATH, 'stories/components/Button.stories.tsx');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toMatch(/tags.*autodocs/);
    }
  });

  it('should have argTypes for controls', () => {
    const filePath = path.join(WEB_APP_PATH, 'stories/components/Button.stories.tsx');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toMatch(/argTypes/);
    }
  });
});
