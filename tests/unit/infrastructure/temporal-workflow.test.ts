/**
 * ATDD Tests for Story 0.1.18: Configure Temporal Workflow Orchestration
 *
 * Validates Temporal workflow infrastructure configuration.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Get project root
const projectRoot = join(__dirname, '../../..');
const temporalWorkerPath = join(projectRoot, 'apps/temporal-worker');
const temporalPackagePath = join(projectRoot, 'packages/@platform/temporal');
const agentServicePath = join(projectRoot, 'apps/agent-service');

describe('Story 0.1.18: Configure Temporal Workflow Orchestration', () => {
  let agentServicePyproject: string;

  beforeAll(() => {

    const pyprojectPath = join(agentServicePath, 'pyproject.toml');
    if (existsSync(pyprojectPath)) {
      agentServicePyproject = readFileSync(pyprojectPath, 'utf-8');
    }
  });

  describe('AC1: Node.js Temporal Packages', () => {
    let workerPackageJson: Record<string, unknown>;

    beforeAll(() => {
      const packagePath = join(temporalWorkerPath, 'package.json');
      if (existsSync(packagePath)) {
        workerPackageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
      }
    });

    it('should have temporal-worker package.json', () => {
      expect(existsSync(join(temporalWorkerPath, 'package.json'))).toBe(true);
    });

    it('should have @temporalio/worker dependency', () => {
      const deps = {
        ...(workerPackageJson?.dependencies as Record<string, string>),
        ...(workerPackageJson?.devDependencies as Record<string, string>),
      };
      expect('@temporalio/worker' in deps).toBe(true);
    });

    it('should have @temporalio/workflow dependency', () => {
      const deps = {
        ...(workerPackageJson?.dependencies as Record<string, string>),
        ...(workerPackageJson?.devDependencies as Record<string, string>),
      };
      expect('@temporalio/workflow' in deps).toBe(true);
    });

    it('should have @temporalio/activity dependency', () => {
      const deps = {
        ...(workerPackageJson?.dependencies as Record<string, string>),
        ...(workerPackageJson?.devDependencies as Record<string, string>),
      };
      expect('@temporalio/activity' in deps).toBe(true);
    });
  });

  describe('AC2: Python Temporal Package', () => {
    it('should have temporalio in agent-service dependencies', () => {
      expect(agentServicePyproject).toMatch(/temporalio/i);
    });
  });

  describe('AC3: Temporal Worker Application', () => {
    it('should have apps/temporal-worker directory', () => {
      expect(existsSync(temporalWorkerPath)).toBe(true);
    });

    it('should have src directory', () => {
      expect(existsSync(join(temporalWorkerPath, 'src'))).toBe(true);
    });

    it('should have worker entry point', () => {
      expect(existsSync(join(temporalWorkerPath, 'src/worker.ts'))).toBe(true);
    });

    it('should have workflows directory', () => {
      expect(existsSync(join(temporalWorkerPath, 'src/workflows'))).toBe(true);
    });

    it('should have activities directory', () => {
      expect(existsSync(join(temporalWorkerPath, 'src/activities'))).toBe(true);
    });

    it('should have tsconfig.json', () => {
      expect(existsSync(join(temporalWorkerPath, 'tsconfig.json'))).toBe(true);
    });
  });

  describe('AC4: Temporal Client Package', () => {
    it('should have packages/@platform/temporal directory', () => {
      expect(existsSync(temporalPackagePath)).toBe(true);
    });

    it('should have package.json', () => {
      expect(existsSync(join(temporalPackagePath, 'package.json'))).toBe(true);
    });

    it('should have src directory', () => {
      expect(existsSync(join(temporalPackagePath, 'src'))).toBe(true);
    });

    it('should have index.ts exporting client utilities', () => {
      expect(existsSync(join(temporalPackagePath, 'src/index.ts'))).toBe(true);
    });

    it('should have client.ts with Temporal client', () => {
      expect(existsSync(join(temporalPackagePath, 'src/client.ts'))).toBe(true);
    });

    it('should export @temporalio/client dependency', () => {
      const packagePath = join(temporalPackagePath, 'package.json');
      const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
      const deps = {
        ...(packageJson?.dependencies as Record<string, string>),
        ...(packageJson?.devDependencies as Record<string, string>),
      };
      expect('@temporalio/client' in deps).toBe(true);
    });
  });

  describe('AC5: Workflow Definitions', () => {
    let agentWorkflowContent: string;

    beforeAll(() => {
      const workflowPath = join(
        temporalWorkerPath,
        'src/workflows/agent.ts'
      );
      if (existsSync(workflowPath)) {
        agentWorkflowContent = readFileSync(workflowPath, 'utf-8');
      }
    });

    it('should have agent workflow file', () => {
      expect(
        existsSync(join(temporalWorkerPath, 'src/workflows/agent.ts'))
      ).toBe(true);
    });

    it('should have workflows index file', () => {
      expect(
        existsSync(join(temporalWorkerPath, 'src/workflows/index.ts'))
      ).toBe(true);
    });

    it('should define workflow function', () => {
      expect(agentWorkflowContent).toMatch(
        /export\s+(async\s+)?function|defineWorkflow/
      );
    });

    it('should have activities index file', () => {
      expect(
        existsSync(join(temporalWorkerPath, 'src/activities/index.ts'))
      ).toBe(true);
    });

    it('should have agent activities file', () => {
      expect(
        existsSync(join(temporalWorkerPath, 'src/activities/agent.ts'))
      ).toBe(true);
    });
  });

  describe('AC6: Worker Configuration', () => {
    let workerContent: string;

    beforeAll(() => {
      const workerPath = join(temporalWorkerPath, 'src/worker.ts');
      if (existsSync(workerPath)) {
        workerContent = readFileSync(workerPath, 'utf-8');
      }
    });

    it('should import from @temporalio/worker', () => {
      expect(workerContent).toMatch(/@temporalio\/worker/);
    });

    it('should configure task queue', () => {
      expect(workerContent).toMatch(/taskQueue/i);
    });

    it('should reference workflows', () => {
      expect(workerContent).toMatch(/workflow/i);
    });

    it('should reference activities', () => {
      expect(workerContent).toMatch(/activit/i);
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

    it('should document TEMPORAL_ADDRESS', () => {
      expect(envExampleContent).toMatch(/TEMPORAL_ADDRESS/);
    });

    it('should document TEMPORAL_NAMESPACE', () => {
      expect(envExampleContent).toMatch(/TEMPORAL_NAMESPACE/);
    });

    it('should document TEMPORAL_TASK_QUEUE', () => {
      expect(envExampleContent).toMatch(/TEMPORAL_TASK_QUEUE/);
    });
  });
});
