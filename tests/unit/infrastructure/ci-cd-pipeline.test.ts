/**
 * ATDD Tests for Story 0.1.15: Configure CI/CD Pipeline
 *
 * Validates GitHub Actions CI/CD pipeline configuration.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'yaml';

// Get project root
const projectRoot = join(__dirname, '../../..');

interface WorkflowConfig {
  name?: string;
  on?: {
    push?: { branches?: string[] };
    pull_request?: { branches?: string[] };
    workflow_dispatch?: {
      inputs?: Record<string, unknown>;
    };
  };
  env?: Record<string, string>;
  jobs?: Record<
    string,
    {
      name?: string;
      'runs-on'?: string;
      'timeout-minutes'?: number;
      needs?: string | string[];
      steps?: Array<{
        name?: string;
        uses?: string;
        run?: string;
        with?: Record<string, unknown>;
        env?: Record<string, unknown>;
        if?: string;
      }>;
      strategy?: {
        matrix?: Record<string, unknown>;
      };
    }
  >;
}

describe('Story 0.1.15: Configure CI/CD Pipeline', () => {
  let ciWorkflow: WorkflowConfig;
  let e2eWorkflow: WorkflowConfig;

  beforeAll(() => {
    const ciPath = join(projectRoot, '.github/workflows/ci.yml');
    const e2ePath = join(projectRoot, '.github/workflows/e2e-tests.yml');

    if (existsSync(ciPath)) {
      ciWorkflow = yaml.parse(readFileSync(ciPath, 'utf-8'));
    }

    if (existsSync(e2ePath)) {
      e2eWorkflow = yaml.parse(readFileSync(e2ePath, 'utf-8'));
    }
  });

  describe('AC1: CI Workflow Exists', () => {
    it('should have ci.yml in .github/workflows/', () => {
      const ciPath = join(projectRoot, '.github/workflows/ci.yml');
      expect(existsSync(ciPath)).toBe(true);
    });

    it('should have valid YAML structure', () => {
      expect(ciWorkflow).toBeDefined();
      expect(ciWorkflow.name).toBeDefined();
      expect(ciWorkflow.on).toBeDefined();
      expect(ciWorkflow.jobs).toBeDefined();
    });

    it('should trigger on push to main and develop', () => {
      expect(ciWorkflow.on?.push?.branches).toContain('main');
      expect(ciWorkflow.on?.push?.branches).toContain('develop');
    });

    it('should trigger on pull requests to main and develop', () => {
      expect(ciWorkflow.on?.pull_request?.branches).toContain('main');
      expect(ciWorkflow.on?.pull_request?.branches).toContain('develop');
    });
  });

  describe('AC2: Lint and Type Check Job', () => {
    it('should have a lint job', () => {
      expect(ciWorkflow.jobs?.lint).toBeDefined();
    });

    it('should run ESLint', () => {
      const lintJob = ciWorkflow.jobs?.lint;
      const hasEslintStep = lintJob?.steps?.some(
        (step) => step.run?.includes('lint') || step.name?.toLowerCase().includes('eslint')
      );
      expect(hasEslintStep).toBe(true);
    });

    it('should run TypeScript typecheck', () => {
      const lintJob = ciWorkflow.jobs?.lint;
      const hasTypecheckStep = lintJob?.steps?.some(
        (step) => step.run?.includes('typecheck') || step.name?.toLowerCase().includes('type')
      );
      expect(hasTypecheckStep).toBe(true);
    });

    it('should use pnpm caching', () => {
      const lintJob = ciWorkflow.jobs?.lint;
      const nodeStep = lintJob?.steps?.find((step) =>
        step.uses?.includes('actions/setup-node')
      );
      expect(nodeStep?.with?.cache).toBe('pnpm');
    });
  });

  describe('AC3: Unit Tests Job', () => {
    it('should have a unit-tests job', () => {
      expect(ciWorkflow.jobs?.['unit-tests']).toBeDefined();
    });

    it('should run unit tests with coverage', () => {
      const unitJob = ciWorkflow.jobs?.['unit-tests'];
      const hasTestStep = unitJob?.steps?.some(
        (step) => step.run?.includes('test:unit') && step.run?.includes('coverage')
      );
      expect(hasTestStep).toBe(true);
    });

    it('should use Node 20.x', () => {
      const unitJob = ciWorkflow.jobs?.['unit-tests'];
      const nodeStep = unitJob?.steps?.find((step) =>
        step.uses?.includes('actions/setup-node')
      );
      expect(nodeStep?.with?.['node-version']).toBe('20');
    });

    it('should have Codecov integration', () => {
      const unitJob = ciWorkflow.jobs?.['unit-tests'];
      const hasCodecov = unitJob?.steps?.some((step) =>
        step.uses?.includes('codecov/codecov-action')
      );
      expect(hasCodecov).toBe(true);
    });
  });

  describe('AC4: Build Job', () => {
    it('should have a build job', () => {
      expect(ciWorkflow.jobs?.build).toBeDefined();
    });

    it('should depend on lint and unit-tests', () => {
      const buildJob = ciWorkflow.jobs?.build;
      const needs = Array.isArray(buildJob?.needs) ? buildJob.needs : [buildJob?.needs];
      expect(needs).toContain('lint');
      expect(needs).toContain('unit-tests');
    });

    it('should run pnpm build', () => {
      const buildJob = ciWorkflow.jobs?.build;
      const hasBuildStep = buildJob?.steps?.some((step) => step.run?.includes('pnpm build'));
      expect(hasBuildStep).toBe(true);
    });

    it('should upload build artifacts', () => {
      const buildJob = ciWorkflow.jobs?.build;
      const hasArtifactUpload = buildJob?.steps?.some((step) =>
        step.uses?.includes('actions/upload-artifact')
      );
      expect(hasArtifactUpload).toBe(true);
    });
  });

  describe('AC5: E2E Tests Job', () => {
    it('should have e2e-tests job in CI workflow', () => {
      expect(ciWorkflow.jobs?.['e2e-tests']).toBeDefined();
    });

    it('should run Playwright tests', () => {
      const e2eJob = ciWorkflow.jobs?.['e2e-tests'];
      const hasPlaywrightStep = e2eJob?.steps?.some(
        (step) =>
          step.run?.includes('playwright') ||
          step.run?.includes('test:e2e') ||
          step.name?.toLowerCase().includes('playwright')
      );
      expect(hasPlaywrightStep).toBe(true);
    });

    it('should install Playwright browsers', () => {
      const e2eJob = ciWorkflow.jobs?.['e2e-tests'];
      const installsPlaywright = e2eJob?.steps?.some(
        (step) => step.run?.includes('playwright install')
      );
      expect(installsPlaywright).toBe(true);
    });

    it('should upload test reports', () => {
      const e2eJob = ciWorkflow.jobs?.['e2e-tests'];
      const uploadsReports = e2eJob?.steps?.some(
        (step) =>
          step.uses?.includes('actions/upload-artifact') &&
          (step.with?.path?.toString().includes('report') ||
            step.name?.toLowerCase().includes('report'))
      );
      expect(uploadsReports).toBe(true);
    });
  });

  describe('AC6: Dedicated E2E Workflow', () => {
    it('should have e2e-tests.yml in .github/workflows/', () => {
      const e2ePath = join(projectRoot, '.github/workflows/e2e-tests.yml');
      expect(existsSync(e2ePath)).toBe(true);
    });

    it('should have valid YAML structure', () => {
      expect(e2eWorkflow).toBeDefined();
      expect(e2eWorkflow.name).toBeDefined();
    });

    it('should support manual workflow dispatch', () => {
      expect(e2eWorkflow.on?.workflow_dispatch).toBeDefined();
    });

    it('should have browser input option for dispatch', () => {
      const dispatchInputs = e2eWorkflow.on?.workflow_dispatch?.inputs;
      expect(dispatchInputs?.browser).toBeDefined();
    });

    it('should have matrix browser configuration', () => {
      const e2eJob = e2eWorkflow.jobs?.['e2e-tests'];
      expect(e2eJob?.strategy?.matrix?.browser).toBeDefined();
    });

    it('should upload artifacts on failure', () => {
      const e2eJob = e2eWorkflow.jobs?.['e2e-tests'];
      const uploadsOnFailure = e2eJob?.steps?.some(
        (step) =>
          step.uses?.includes('actions/upload-artifact') &&
          step.if?.includes('failure')
      );
      expect(uploadsOnFailure).toBe(true);
    });
  });

  describe('Additional Requirements', () => {
    it('should use pnpm action for setup in CI', () => {
      const jobs = ciWorkflow.jobs;
      const allJobsUsePnpm = Object.values(jobs || {}).every((job) =>
        job.steps?.some((step) => step.uses?.includes('pnpm/action-setup'))
      );
      expect(allJobsUsePnpm).toBe(true);
    });

    it('should set CI environment variable', () => {
      // YAML parses 'true' as boolean true
      expect(ciWorkflow.env?.CI).toBe(true);
    });

    it('should have appropriate timeouts', () => {
      const lintTimeout = ciWorkflow.jobs?.lint?.['timeout-minutes'];
      const unitTimeout = ciWorkflow.jobs?.['unit-tests']?.['timeout-minutes'];
      const buildTimeout = ciWorkflow.jobs?.build?.['timeout-minutes'];

      // Timeouts should be reasonable (< 60 minutes)
      expect(lintTimeout).toBeDefined();
      expect(lintTimeout).toBeLessThanOrEqual(60);
      expect(unitTimeout).toBeDefined();
      expect(unitTimeout).toBeLessThanOrEqual(60);
      expect(buildTimeout).toBeDefined();
      expect(buildTimeout).toBeLessThanOrEqual(60);
    });
  });
});
