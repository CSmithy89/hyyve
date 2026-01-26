import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Story 0.1.9: Configure Langfuse Observability
 *
 * ATDD Tests for Langfuse Observability Configuration
 *
 * These tests validate the acceptance criteria for:
 * - AC1: Langfuse Packages Installed
 * - AC2: Langfuse Client Initialized
 * - AC3: Trace Wrapper Functions
 * - AC4: Cost Tracking Configuration
 * - AC5: Observability Package Exports
 *
 * @see _bmad-output/implementation-artifacts/story-0-1-9-configure-langfuse-observability.md
 */

const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..');
const WEB_APP_PATH = path.join(PROJECT_ROOT, 'apps', 'web');

describe('Story 0.1.9: Configure Langfuse Observability', () => {
  describe('AC1: Langfuse Packages Installed', () => {
    let packageJson: {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      [key: string]: unknown;
    };

    beforeAll(() => {
      const packagePath = path.join(WEB_APP_PATH, 'package.json');
      const content = fs.readFileSync(packagePath, 'utf-8');
      packageJson = JSON.parse(content);
    });

    it('should have langfuse package installed', () => {
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      expect(deps['langfuse']).toBeDefined();
    });

    it('should have @langfuse/core package installed', () => {
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      expect(deps['@langfuse/core']).toBeDefined();
    });
  });

  describe('AC2: Langfuse Client Initialized', () => {
    it('should have langfuse.ts file', () => {
      const langfusePath = path.join(WEB_APP_PATH, 'lib', 'observability', 'langfuse.ts');
      expect(fs.existsSync(langfusePath)).toBe(true);
    });

    describe('langfuse.ts content', () => {
      let langfuseContent: string;

      beforeAll(() => {
        const langfusePath = path.join(WEB_APP_PATH, 'lib', 'observability', 'langfuse.ts');
        if (fs.existsSync(langfusePath)) {
          langfuseContent = fs.readFileSync(langfusePath, 'utf-8');
        } else {
          langfuseContent = '';
        }
      });

      it('should import from langfuse', () => {
        const hasLangfuseImport =
          langfuseContent.includes("from 'langfuse'") ||
          langfuseContent.includes('from "langfuse"');
        expect(hasLangfuseImport).toBe(true);
      });

      it('should use LANGFUSE_PUBLIC_KEY environment variable', () => {
        expect(langfuseContent).toContain('LANGFUSE_PUBLIC_KEY');
      });

      it('should use LANGFUSE_SECRET_KEY environment variable', () => {
        expect(langfuseContent).toContain('LANGFUSE_SECRET_KEY');
      });

      it('should use LANGFUSE_HOST environment variable', () => {
        expect(langfuseContent).toContain('LANGFUSE_HOST');
      });

      it('should create a Langfuse client instance', () => {
        const hasClient =
          langfuseContent.includes('new Langfuse') ||
          langfuseContent.includes('Langfuse(');
        expect(hasClient).toBe(true);
      });
    });
  });

  describe('AC3: Trace Wrapper Functions', () => {
    let langfuseContent: string;

    beforeAll(() => {
      const langfusePath = path.join(WEB_APP_PATH, 'lib', 'observability', 'langfuse.ts');
      if (fs.existsSync(langfusePath)) {
        langfuseContent = fs.readFileSync(langfusePath, 'utf-8');
      } else {
        langfuseContent = '';
      }
    });

    it('should have trace wrapper for LLM calls', () => {
      const hasLLMTrace =
        langfuseContent.includes('traceLLMCall') ||
        langfuseContent.includes('traceLLM') ||
        langfuseContent.includes('traceGeneration');
      expect(hasLLMTrace).toBe(true);
    });

    it('should have trace wrapper for agent runs', () => {
      const hasAgentTrace =
        langfuseContent.includes('traceAgentRun') ||
        langfuseContent.includes('traceAgent') ||
        langfuseContent.includes('createAgentTrace');
      expect(hasAgentTrace).toBe(true);
    });

    it('should have trace wrapper for tool executions', () => {
      const hasToolTrace =
        langfuseContent.includes('traceToolExecution') ||
        langfuseContent.includes('traceTool') ||
        langfuseContent.includes('traceToolCall');
      expect(hasToolTrace).toBe(true);
    });

    it('should support async/await pattern', () => {
      const hasAsync =
        langfuseContent.includes('async') && langfuseContent.includes('await');
      expect(hasAsync).toBe(true);
    });
  });

  describe('AC4: Cost Tracking Configuration', () => {
    let langfuseContent: string;

    beforeAll(() => {
      const langfusePath = path.join(WEB_APP_PATH, 'lib', 'observability', 'langfuse.ts');
      if (fs.existsSync(langfusePath)) {
        langfuseContent = fs.readFileSync(langfusePath, 'utf-8');
      } else {
        langfuseContent = '';
      }
    });

    it('should have model cost configuration', () => {
      const hasCostConfig =
        langfuseContent.includes('MODEL_COSTS') ||
        langfuseContent.includes('modelCosts') ||
        langfuseContent.includes('cost') ||
        langfuseContent.includes('pricing');
      expect(hasCostConfig).toBe(true);
    });

    it('should track token counts', () => {
      const hasTokenTracking =
        langfuseContent.includes('token') ||
        langfuseContent.includes('input') ||
        langfuseContent.includes('output') ||
        langfuseContent.includes('usage');
      expect(hasTokenTracking).toBe(true);
    });

    it('should reference Claude models', () => {
      const hasClaudeModels =
        langfuseContent.includes('claude') ||
        langfuseContent.includes('Claude') ||
        langfuseContent.includes('sonnet') ||
        langfuseContent.includes('opus') ||
        langfuseContent.includes('haiku');
      expect(hasClaudeModels).toBe(true);
    });
  });

  describe('AC5: Observability Package Exports', () => {
    it('should have observability index.ts file', () => {
      const indexPath = path.join(WEB_APP_PATH, 'lib', 'observability', 'index.ts');
      expect(fs.existsSync(indexPath)).toBe(true);
    });

    describe('index.ts exports', () => {
      let indexContent: string;

      beforeAll(() => {
        const indexPath = path.join(WEB_APP_PATH, 'lib', 'observability', 'index.ts');
        if (fs.existsSync(indexPath)) {
          indexContent = fs.readFileSync(indexPath, 'utf-8');
        } else {
          indexContent = '';
        }
      });

      it('should export from langfuse module', () => {
        const hasLangfuseExport =
          indexContent.includes('./langfuse') ||
          indexContent.includes('langfuse');
        expect(hasLangfuseExport).toBe(true);
      });
    });
  });

  describe('Environment Variables', () => {
    it('should have LANGFUSE_PUBLIC_KEY in .env.example', () => {
      const envExamplePath = path.join(PROJECT_ROOT, '.env.example');
      const envContent = fs.readFileSync(envExamplePath, 'utf-8');
      expect(envContent).toContain('LANGFUSE_PUBLIC_KEY');
    });

    it('should have LANGFUSE_SECRET_KEY in .env.example', () => {
      const envExamplePath = path.join(PROJECT_ROOT, '.env.example');
      const envContent = fs.readFileSync(envExamplePath, 'utf-8');
      expect(envContent).toContain('LANGFUSE_SECRET_KEY');
    });

    it('should have LANGFUSE_HOST in .env.example', () => {
      const envExamplePath = path.join(PROJECT_ROOT, '.env.example');
      const envContent = fs.readFileSync(envExamplePath, 'utf-8');
      expect(envContent).toContain('LANGFUSE_HOST');
    });
  });
});
