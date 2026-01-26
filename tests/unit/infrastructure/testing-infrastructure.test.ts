/**
 * ATDD Tests for Story 0.1.12: Configure Testing Infrastructure
 *
 * These tests verify that the testing infrastructure is correctly configured
 * including Vitest, Playwright, and Testing Library.
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const ROOT_DIR = path.resolve(__dirname, '../../..');

describe('Story 0.1.12: Configure Testing Infrastructure', () => {
  describe('AC1: Unit Testing Framework Installed', () => {
    it('should have vitest@4.0.x installed', () => {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf-8')
      );

      const vitestVersion = packageJson.devDependencies?.vitest;
      expect(vitestVersion).toBeDefined();

      // Extract major version from version string
      const majorVersion = vitestVersion.replace(/[^0-9.]/g, '').split('.')[0];
      expect(parseInt(majorVersion)).toBeGreaterThanOrEqual(4);
    });

    it('should have @vitest/coverage-v8 installed', () => {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf-8')
      );

      expect(packageJson.devDependencies?.['@vitest/coverage-v8']).toBeDefined();
    });
  });

  describe('AC2: E2E Testing Framework Installed', () => {
    it('should have @playwright/test@1.51.0 installed', () => {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf-8')
      );

      const playwrightVersion = packageJson.devDependencies?.['@playwright/test'];
      expect(playwrightVersion).toBeDefined();
      expect(playwrightVersion).toContain('1.51');
    });
  });

  describe('AC3: Component Testing Libraries Installed', () => {
    it('should have @testing-library/react installed', () => {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf-8')
      );

      expect(
        packageJson.devDependencies?.['@testing-library/react']
      ).toBeDefined();
    });

    it('should have @testing-library/jest-dom installed', () => {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf-8')
      );

      expect(
        packageJson.devDependencies?.['@testing-library/jest-dom']
      ).toBeDefined();
    });
  });

  describe('AC4: Vitest Configuration', () => {
    it('should have vitest.config.ts at project root', () => {
      const configPath = path.join(ROOT_DIR, 'vitest.config.ts');
      expect(fs.existsSync(configPath)).toBe(true);
    });

    it('should configure jsdom environment', () => {
      const configPath = path.join(ROOT_DIR, 'vitest.config.ts');
      const configContent = fs.readFileSync(configPath, 'utf-8');

      expect(configContent).toContain("environment: 'jsdom'");
    });

    it('should configure path aliases', () => {
      const configPath = path.join(ROOT_DIR, 'vitest.config.ts');
      const configContent = fs.readFileSync(configPath, 'utf-8');

      expect(configContent).toContain('alias');
    });

    it('should have setup file configured', () => {
      const configPath = path.join(ROOT_DIR, 'vitest.config.ts');
      const configContent = fs.readFileSync(configPath, 'utf-8');

      expect(configContent).toContain('setupFiles');
      expect(configContent).toContain('vitest-setup');
    });

    it('should have vitest-setup.ts file', () => {
      const setupPath = path.join(ROOT_DIR, 'tests/support/vitest-setup.ts');
      expect(fs.existsSync(setupPath)).toBe(true);
    });
  });

  describe('AC5: Playwright Configuration', () => {
    it('should have playwright.config.ts at project root', () => {
      const configPath = path.join(ROOT_DIR, 'playwright.config.ts');
      expect(fs.existsSync(configPath)).toBe(true);
    });

    it('should target Chromium browser', () => {
      const configPath = path.join(ROOT_DIR, 'playwright.config.ts');
      const configContent = fs.readFileSync(configPath, 'utf-8');

      expect(configContent).toContain("name: 'chromium'");
    });

    it('should target Firefox browser', () => {
      const configPath = path.join(ROOT_DIR, 'playwright.config.ts');
      const configContent = fs.readFileSync(configPath, 'utf-8');

      expect(configContent).toContain("name: 'firefox'");
    });

    it('should target WebKit browser', () => {
      const configPath = path.join(ROOT_DIR, 'playwright.config.ts');
      const configContent = fs.readFileSync(configPath, 'utf-8');

      expect(configContent).toContain("name: 'webkit'");
    });

    it('should configure parallel execution', () => {
      const configPath = path.join(ROOT_DIR, 'playwright.config.ts');
      const configContent = fs.readFileSync(configPath, 'utf-8');

      expect(configContent).toContain('fullyParallel');
    });

    it('should configure screenshot on failure', () => {
      const configPath = path.join(ROOT_DIR, 'playwright.config.ts');
      const configContent = fs.readFileSync(configPath, 'utf-8');

      expect(configContent).toContain('screenshot');
      expect(configContent).toContain('only-on-failure');
    });

    it('should configure video on retry', () => {
      const configPath = path.join(ROOT_DIR, 'playwright.config.ts');
      const configContent = fs.readFileSync(configPath, 'utf-8');

      expect(configContent).toContain('video');
    });
  });

  describe('AC6: Test Scripts in Pipeline', () => {
    it('should have test:unit script', () => {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf-8')
      );

      expect(packageJson.scripts?.['test:unit']).toBeDefined();
      expect(packageJson.scripts?.['test:unit']).toContain('vitest');
    });

    it('should have test:e2e script', () => {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf-8')
      );

      expect(packageJson.scripts?.['test:e2e']).toBeDefined();
      expect(packageJson.scripts?.['test:e2e']).toContain('playwright');
    });

    it('should have test:unit:coverage script', () => {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf-8')
      );

      expect(packageJson.scripts?.['test:unit:coverage']).toBeDefined();
      expect(packageJson.scripts?.['test:unit:coverage']).toContain('coverage');
    });

    it('should have test task in turbo.json', () => {
      const turboJson = JSON.parse(
        fs.readFileSync(path.join(ROOT_DIR, 'turbo.json'), 'utf-8')
      );

      expect(turboJson.tasks?.test).toBeDefined();
    });
  });

  describe('AC7: Coverage Reporting', () => {
    it('should configure v8 coverage provider', () => {
      const configPath = path.join(ROOT_DIR, 'vitest.config.ts');
      const configContent = fs.readFileSync(configPath, 'utf-8');

      expect(configContent).toContain("provider: 'v8'");
    });

    it('should configure coverage reporters', () => {
      const configPath = path.join(ROOT_DIR, 'vitest.config.ts');
      const configContent = fs.readFileSync(configPath, 'utf-8');

      expect(configContent).toContain('reporter');
      expect(configContent).toContain('text');
      expect(configContent).toContain('json');
      expect(configContent).toContain('html');
      expect(configContent).toContain('lcov');
    });

    it('should configure reports directory', () => {
      const configPath = path.join(ROOT_DIR, 'vitest.config.ts');
      const configContent = fs.readFileSync(configPath, 'utf-8');

      expect(configContent).toContain('reportsDirectory');
      expect(configContent).toContain('coverage');
    });
  });
});
