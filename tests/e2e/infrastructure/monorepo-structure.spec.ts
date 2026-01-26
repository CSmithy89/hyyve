import { test, expect } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Story 0.1.1: Scaffold Turborepo Monorepo with Next.js 15
 *
 * E2E Tests for Monorepo Structure Verification
 *
 * These tests verify the project structure matches the acceptance criteria:
 * - AC1: Project Structure Created
 * - AC2: Package Manager Configuration
 * - AC3: Turbo Pipeline Configuration
 * - AC4: Workspace Configuration
 * - AC5: Node Version Specification
 *
 * @see _bmad-output/implementation-artifacts/story-0-1-1-scaffold-turborepo-monorepo.md
 */

// Project root path - go up from tests/e2e/infrastructure to project root
const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..');

test.describe('Story 0.1.1: Monorepo Structure Verification', () => {
  test.describe('AC1: Project Structure Created', () => {
    test.describe('apps/web directory structure', () => {
      test('apps/web directory exists', async () => {
        const appsWebPath = path.join(PROJECT_ROOT, 'apps', 'web');
        const exists = fs.existsSync(appsWebPath);
        expect(exists).toBe(true);
      });

      test('apps/web/app directory exists (App Router pages)', async () => {
        const appPath = path.join(PROJECT_ROOT, 'apps', 'web', 'app');
        const exists = fs.existsSync(appPath);
        expect(exists).toBe(true);
      });

      test('apps/web/components directory exists', async () => {
        const componentsPath = path.join(PROJECT_ROOT, 'apps', 'web', 'components');
        const exists = fs.existsSync(componentsPath);
        expect(exists).toBe(true);
      });

      test('apps/web/hooks directory exists', async () => {
        const hooksPath = path.join(PROJECT_ROOT, 'apps', 'web', 'hooks');
        const exists = fs.existsSync(hooksPath);
        expect(exists).toBe(true);
      });

      test('apps/web/lib directory exists', async () => {
        const libPath = path.join(PROJECT_ROOT, 'apps', 'web', 'lib');
        const exists = fs.existsSync(libPath);
        expect(exists).toBe(true);
      });

      test('apps/web/stores directory exists (Zustand stores)', async () => {
        const storesPath = path.join(PROJECT_ROOT, 'apps', 'web', 'stores');
        const exists = fs.existsSync(storesPath);
        expect(exists).toBe(true);
      });
    });

    test.describe('packages/@platform directory structure', () => {
      test('packages/@platform/ui directory exists', async () => {
        const uiPath = path.join(PROJECT_ROOT, 'packages', '@platform', 'ui');
        const exists = fs.existsSync(uiPath);
        expect(exists).toBe(true);
      });

      test('packages/@platform/db directory exists', async () => {
        const dbPath = path.join(PROJECT_ROOT, 'packages', '@platform', 'db');
        const exists = fs.existsSync(dbPath);
        expect(exists).toBe(true);
      });

      test('packages/@platform/auth directory exists', async () => {
        const authPath = path.join(PROJECT_ROOT, 'packages', '@platform', 'auth');
        const exists = fs.existsSync(authPath);
        expect(exists).toBe(true);
      });
    });

    test.describe('packages/tsconfig directory structure', () => {
      test('packages/tsconfig directory exists', async () => {
        const tsconfigPath = path.join(PROJECT_ROOT, 'packages', 'tsconfig');
        const exists = fs.existsSync(tsconfigPath);
        expect(exists).toBe(true);
      });
    });
  });

  test.describe('AC2: Package Manager Configuration', () => {
    test('pnpm-workspace.yaml exists', async () => {
      const workspacePath = path.join(PROJECT_ROOT, 'pnpm-workspace.yaml');
      const exists = fs.existsSync(workspacePath);
      expect(exists).toBe(true);
    });

    test('pnpm-workspace.yaml contains valid workspace configuration', async () => {
      const workspacePath = path.join(PROJECT_ROOT, 'pnpm-workspace.yaml');
      const content = fs.readFileSync(workspacePath, 'utf-8');

      // Should contain packages definition
      expect(content).toContain('packages:');

      // Should include apps/* and packages/*
      expect(content).toMatch(/apps\/\*/);
      expect(content).toMatch(/packages\/\*/);
    });
  });

  test.describe('AC3: Turbo Pipeline Configuration', () => {
    test('turbo.json exists', async () => {
      const turboPath = path.join(PROJECT_ROOT, 'turbo.json');
      const exists = fs.existsSync(turboPath);
      expect(exists).toBe(true);
    });

    test('turbo.json contains build pipeline', async () => {
      const turboPath = path.join(PROJECT_ROOT, 'turbo.json');
      const content = fs.readFileSync(turboPath, 'utf-8');
      const turboConfig = JSON.parse(content);

      // Check for tasks or pipeline (Turbo v2 uses 'tasks', v1 used 'pipeline')
      const tasks = turboConfig.tasks || turboConfig.pipeline;
      expect(tasks).toBeDefined();
      expect(tasks.build).toBeDefined();
    });

    test('turbo.json contains lint pipeline', async () => {
      const turboPath = path.join(PROJECT_ROOT, 'turbo.json');
      const content = fs.readFileSync(turboPath, 'utf-8');
      const turboConfig = JSON.parse(content);

      const tasks = turboConfig.tasks || turboConfig.pipeline;
      expect(tasks).toBeDefined();
      expect(tasks.lint).toBeDefined();
    });

    test('turbo.json contains test pipeline', async () => {
      const turboPath = path.join(PROJECT_ROOT, 'turbo.json');
      const content = fs.readFileSync(turboPath, 'utf-8');
      const turboConfig = JSON.parse(content);

      const tasks = turboConfig.tasks || turboConfig.pipeline;
      expect(tasks).toBeDefined();
      expect(tasks.test).toBeDefined();
    });
  });

  test.describe('AC4: Workspace Configuration', () => {
    test('root package.json exists', async () => {
      const packagePath = path.join(PROJECT_ROOT, 'package.json');
      const exists = fs.existsSync(packagePath);
      expect(exists).toBe(true);
    });

    test('root package.json has workspace configuration', async () => {
      const packagePath = path.join(PROJECT_ROOT, 'package.json');
      const content = fs.readFileSync(packagePath, 'utf-8');
      const packageJson = JSON.parse(content);

      // pnpm workspaces can be defined in pnpm-workspace.yaml, but package.json should indicate monorepo
      // Check for either workspaces field or name indicating root package
      const hasWorkspaceConfig =
        packageJson.workspaces !== undefined ||
        packageJson.private === true;

      expect(hasWorkspaceConfig).toBe(true);
    });

    test('root package.json specifies pnpm as package manager', async () => {
      const packagePath = path.join(PROJECT_ROOT, 'package.json');
      const content = fs.readFileSync(packagePath, 'utf-8');
      const packageJson = JSON.parse(content);

      // Modern approach is to use packageManager field
      expect(packageJson.packageManager).toBeDefined();
      expect(packageJson.packageManager).toMatch(/pnpm/);
    });
  });

  test.describe('AC5: Node Version Specification', () => {
    test('.nvmrc file exists', async () => {
      const nvmrcPath = path.join(PROJECT_ROOT, '.nvmrc');
      const exists = fs.existsSync(nvmrcPath);
      expect(exists).toBe(true);
    });

    test('.nvmrc specifies Node.js 20.x', async () => {
      const nvmrcPath = path.join(PROJECT_ROOT, '.nvmrc');
      const content = fs.readFileSync(nvmrcPath, 'utf-8').trim();

      // Should be 20, 20.x, or a specific 20.x.x version
      const isNode20 = /^20(\.[\dx]+)*$/.test(content) || content === '20';
      expect(isNode20).toBe(true);
    });
  });

  test.describe('Package-level configurations', () => {
    test('apps/web has package.json', async () => {
      const packagePath = path.join(PROJECT_ROOT, 'apps', 'web', 'package.json');
      const exists = fs.existsSync(packagePath);
      expect(exists).toBe(true);
    });

    test('apps/web package.json has Next.js 15.x dependency', async () => {
      const packagePath = path.join(PROJECT_ROOT, 'apps', 'web', 'package.json');
      const content = fs.readFileSync(packagePath, 'utf-8');
      const packageJson = JSON.parse(content);

      const nextVersion =
        packageJson.dependencies?.next || packageJson.devDependencies?.next;
      expect(nextVersion).toBeDefined();
      expect(nextVersion).toMatch(/15\./);
    });

    test('apps/web package.json has React 19.x dependency', async () => {
      const packagePath = path.join(PROJECT_ROOT, 'apps', 'web', 'package.json');
      const content = fs.readFileSync(packagePath, 'utf-8');
      const packageJson = JSON.parse(content);

      const reactVersion =
        packageJson.dependencies?.react || packageJson.devDependencies?.react;
      expect(reactVersion).toBeDefined();
      expect(reactVersion).toMatch(/19\./);
    });

    test('packages/@platform/ui has package.json', async () => {
      const packagePath = path.join(
        PROJECT_ROOT,
        'packages',
        '@platform',
        'ui',
        'package.json'
      );
      const exists = fs.existsSync(packagePath);
      expect(exists).toBe(true);
    });

    test('packages/@platform/db has package.json', async () => {
      const packagePath = path.join(
        PROJECT_ROOT,
        'packages',
        '@platform',
        'db',
        'package.json'
      );
      const exists = fs.existsSync(packagePath);
      expect(exists).toBe(true);
    });

    test('packages/@platform/auth has package.json', async () => {
      const packagePath = path.join(
        PROJECT_ROOT,
        'packages',
        '@platform',
        'auth',
        'package.json'
      );
      const exists = fs.existsSync(packagePath);
      expect(exists).toBe(true);
    });

    test('packages/tsconfig has package.json', async () => {
      const packagePath = path.join(
        PROJECT_ROOT,
        'packages',
        'tsconfig',
        'package.json'
      );
      const exists = fs.existsSync(packagePath);
      expect(exists).toBe(true);
    });
  });

  test.describe('TypeScript Configuration', () => {
    test('apps/web has tsconfig.json', async () => {
      const tsconfigPath = path.join(PROJECT_ROOT, 'apps', 'web', 'tsconfig.json');
      const exists = fs.existsSync(tsconfigPath);
      expect(exists).toBe(true);
    });

    test('apps/web tsconfig has path aliases for @/', async () => {
      const tsconfigPath = path.join(PROJECT_ROOT, 'apps', 'web', 'tsconfig.json');
      const content = fs.readFileSync(tsconfigPath, 'utf-8');
      const tsconfig = JSON.parse(content);

      const paths = tsconfig.compilerOptions?.paths;
      expect(paths).toBeDefined();

      // Should have @/* alias
      const hasLocalAlias = Object.keys(paths).some((key) => key.startsWith('@/'));
      expect(hasLocalAlias).toBe(true);
    });

    test('apps/web tsconfig has path aliases for @platform/', async () => {
      const tsconfigPath = path.join(PROJECT_ROOT, 'apps', 'web', 'tsconfig.json');
      const content = fs.readFileSync(tsconfigPath, 'utf-8');
      const tsconfig = JSON.parse(content);

      const paths = tsconfig.compilerOptions?.paths;
      expect(paths).toBeDefined();

      // Should have @platform/* alias
      const hasPlatformAlias = Object.keys(paths).some((key) =>
        key.startsWith('@platform/')
      );
      expect(hasPlatformAlias).toBe(true);
    });
  });
});
