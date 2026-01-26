/**
 * ATDD Tests for Story 0.1.19: Configure Anthropic SDK for Claude
 *
 * Validates Anthropic SDK configuration for both TypeScript and Python.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Get project root
const projectRoot = join(__dirname, '../../..');
const webAppPath = join(projectRoot, 'apps/web');
const agentServicePath = join(projectRoot, 'apps/agent-service');

describe('Story 0.1.19: Configure Anthropic SDK for Claude', () => {
  let webPackageJson: Record<string, unknown>;
  let agentServicePyproject: string;

  beforeAll(() => {
    const webPackagePath = join(webAppPath, 'package.json');
    if (existsSync(webPackagePath)) {
      webPackageJson = JSON.parse(readFileSync(webPackagePath, 'utf-8'));
    }

    const pyprojectPath = join(agentServicePath, 'pyproject.toml');
    if (existsSync(pyprojectPath)) {
      agentServicePyproject = readFileSync(pyprojectPath, 'utf-8');
    }
  });

  describe('AC1: TypeScript Anthropic SDK', () => {
    it('should have @anthropic-ai/sdk dependency in apps/web', () => {
      const deps = {
        ...(webPackageJson?.dependencies as Record<string, string>),
        ...(webPackageJson?.devDependencies as Record<string, string>),
      };
      expect('@anthropic-ai/sdk' in deps).toBe(true);
    });
  });

  describe('AC2: Python Anthropic SDK', () => {
    it('should have anthropic in agent-service dependencies', () => {
      expect(agentServicePyproject).toMatch(/anthropic/i);
    });
  });

  describe('AC3: Claude Client Configuration', () => {
    let anthropicClientContent: string;

    beforeAll(() => {
      const clientPath = join(webAppPath, 'lib/llm/anthropic.ts');
      if (existsSync(clientPath)) {
        anthropicClientContent = readFileSync(clientPath, 'utf-8');
      }
    });

    it('should have apps/web/lib/llm directory', () => {
      expect(existsSync(join(webAppPath, 'lib/llm'))).toBe(true);
    });

    it('should have anthropic.ts client file', () => {
      expect(existsSync(join(webAppPath, 'lib/llm/anthropic.ts'))).toBe(true);
    });

    it('should import from @anthropic-ai/sdk', () => {
      expect(anthropicClientContent).toMatch(/@anthropic-ai\/sdk/);
    });

    it('should reference ANTHROPIC_API_KEY', () => {
      expect(anthropicClientContent).toMatch(/ANTHROPIC_API_KEY/);
    });

    it('should configure timeout', () => {
      expect(anthropicClientContent).toMatch(/timeout/i);
    });

    it('should configure retries', () => {
      expect(anthropicClientContent).toMatch(/retr/i);
    });

    it('should define default model constant', () => {
      expect(anthropicClientContent).toMatch(/claude.*sonnet.*4/i);
    });
  });

  describe('AC4: Streaming Support', () => {
    let anthropicClientContent: string;

    beforeAll(() => {
      const clientPath = join(webAppPath, 'lib/llm/anthropic.ts');
      if (existsSync(clientPath)) {
        anthropicClientContent = readFileSync(clientPath, 'utf-8');
      }
    });

    it('should have streaming helper function', () => {
      expect(anthropicClientContent).toMatch(/stream/i);
    });

    it('should have stream event handling', () => {
      expect(anthropicClientContent).toMatch(
        /content_block|message_start|message_delta|text/i
      );
    });
  });

  describe('AC5: Tool Use Support', () => {
    let anthropicClientContent: string;

    beforeAll(() => {
      const clientPath = join(webAppPath, 'lib/llm/anthropic.ts');
      if (existsSync(clientPath)) {
        anthropicClientContent = readFileSync(clientPath, 'utf-8');
      }
    });

    it('should support tool definitions', () => {
      expect(anthropicClientContent).toMatch(/tool/i);
    });
  });

  describe('AC6: Cost Tracking Integration', () => {
    let anthropicClientContent: string;

    beforeAll(() => {
      const clientPath = join(webAppPath, 'lib/llm/anthropic.ts');
      if (existsSync(clientPath)) {
        anthropicClientContent = readFileSync(clientPath, 'utf-8');
      }
    });

    it('should track token usage', () => {
      expect(anthropicClientContent).toMatch(/usage|token/i);
    });

    it('should have cost calculation helper', () => {
      expect(anthropicClientContent).toMatch(/cost/i);
    });
  });

  describe('LLM Module Structure', () => {
    it('should have types.ts file', () => {
      expect(existsSync(join(webAppPath, 'lib/llm/types.ts'))).toBe(true);
    });

    it('should have index.ts barrel export', () => {
      expect(existsSync(join(webAppPath, 'lib/llm/index.ts'))).toBe(true);
    });
  });

  describe('Python Claude Client', () => {
    let pythonClaudeContent: string;

    beforeAll(() => {
      const claudePath = join(agentServicePath, 'src/llm/claude.py');
      if (existsSync(claudePath)) {
        pythonClaudeContent = readFileSync(claudePath, 'utf-8');
      }
    });

    it('should have apps/agent-service/src/llm directory', () => {
      expect(existsSync(join(agentServicePath, 'src/llm'))).toBe(true);
    });

    it('should have claude.py client file', () => {
      expect(existsSync(join(agentServicePath, 'src/llm/claude.py'))).toBe(
        true
      );
    });

    it('should import anthropic', () => {
      expect(pythonClaudeContent).toMatch(/import anthropic|from anthropic/);
    });

    it('should have __init__.py', () => {
      expect(existsSync(join(agentServicePath, 'src/llm/__init__.py'))).toBe(
        true
      );
    });
  });

  describe('Environment Configuration', () => {
    let envExampleContent: string;

    beforeAll(() => {
      const envPath = join(projectRoot, '.env.example');
      if (existsSync(envPath)) {
        envExampleContent = readFileSync(envPath, 'utf-8');
      }
    });

    it('should document ANTHROPIC_API_KEY', () => {
      expect(envExampleContent).toMatch(/ANTHROPIC_API_KEY/);
    });
  });
});
