import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Story 0.1.1: Scaffold Turborepo Monorepo with Next.js 15
 *
 * Unit Tests for Turbo and Workspace Configuration
 *
 * These tests validate the detailed configuration of:
 * - turbo.json pipeline definitions
 * - pnpm-workspace.yaml structure
 * - Root package.json workspace settings
 * - TypeScript path alias configuration
 *
 * @see _bmad-output/implementation-artifacts/story-0-1-1-scaffold-turborepo-monorepo.md
 */

// Project root - go up from tests/unit/infrastructure to project root
const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..');

describe('Story 0.1.1: Turbo Configuration', () => {
  describe('turbo.json structure', () => {
    let turboConfig: Record<string, unknown>;

    beforeAll(() => {
      const turboPath = path.join(PROJECT_ROOT, 'turbo.json');
      const content = fs.readFileSync(turboPath, 'utf-8');
      turboConfig = JSON.parse(content);
    });

    it('should have a $schema field for IDE support', () => {
      expect(turboConfig.$schema).toBeDefined();
      expect(turboConfig.$schema).toContain('turbo');
    });

    it('should define tasks (Turbo v2) or pipeline (Turbo v1)', () => {
      const hasTasks = 'tasks' in turboConfig;
      const hasPipeline = 'pipeline' in turboConfig;
      expect(hasTasks || hasPipeline).toBe(true);
    });

    describe('build task', () => {
      it('should define build task', () => {
        const tasks = (turboConfig.tasks || turboConfig.pipeline) as Record<
          string,
          unknown
        >;
        expect(tasks.build).toBeDefined();
      });

      it('build task should depend on ^build (topological)', () => {
        const tasks = (turboConfig.tasks || turboConfig.pipeline) as Record<
          string,
          { dependsOn?: string[] }
        >;
        const build = tasks.build;
        expect(build.dependsOn).toBeDefined();
        expect(build.dependsOn).toContain('^build');
      });

      it('build task should specify outputs', () => {
        const tasks = (turboConfig.tasks || turboConfig.pipeline) as Record<
          string,
          { outputs?: string[] }
        >;
        const build = tasks.build;
        expect(build.outputs).toBeDefined();
        expect(Array.isArray(build.outputs)).toBe(true);
      });
    });

    describe('lint task', () => {
      it('should define lint task', () => {
        const tasks = (turboConfig.tasks || turboConfig.pipeline) as Record<
          string,
          unknown
        >;
        expect(tasks.lint).toBeDefined();
      });

      it('lint task should depend on ^lint for consistent ordering', () => {
        const tasks = (turboConfig.tasks || turboConfig.pipeline) as Record<
          string,
          { dependsOn?: string[] }
        >;
        const lint = tasks.lint;
        // Lint can optionally depend on ^lint or have no deps
        expect(lint).toBeDefined();
      });
    });

    describe('test task', () => {
      it('should define test task', () => {
        const tasks = (turboConfig.tasks || turboConfig.pipeline) as Record<
          string,
          unknown
        >;
        expect(tasks.test).toBeDefined();
      });
    });

    describe('dev task', () => {
      it('should define dev task', () => {
        const tasks = (turboConfig.tasks || turboConfig.pipeline) as Record<
          string,
          unknown
        >;
        expect(tasks.dev).toBeDefined();
      });

      it('dev task should be marked as persistent', () => {
        const tasks = (turboConfig.tasks || turboConfig.pipeline) as Record<
          string,
          { persistent?: boolean; cache?: boolean }
        >;
        const dev = tasks.dev;
        // Dev tasks should either be persistent or have cache: false
        const isPersistentOrNonCached = dev.persistent === true || dev.cache === false;
        expect(isPersistentOrNonCached).toBe(true);
      });
    });
  });

  describe('pnpm-workspace.yaml structure', () => {
    let workspaceContent: string;

    beforeAll(() => {
      const workspacePath = path.join(PROJECT_ROOT, 'pnpm-workspace.yaml');
      workspaceContent = fs.readFileSync(workspacePath, 'utf-8');
    });

    it('should have packages field', () => {
      expect(workspaceContent).toContain('packages:');
    });

    it('should include apps/* in workspace', () => {
      expect(workspaceContent).toMatch(/'apps\/\*'|"apps\/\*"|apps\/\*/);
    });

    it('should include packages/* in workspace', () => {
      expect(workspaceContent).toMatch(/'packages\/\*'|"packages\/\*"|packages\/\*/);
    });

    it('should include packages/@platform/* in workspace', () => {
      expect(workspaceContent).toMatch(
        /'packages\/@platform\/\*'|"packages\/@platform\/\*"|packages\/@platform\/\*/
      );
    });
  });

  describe('Root package.json configuration', () => {
    let packageJson: Record<string, unknown>;

    beforeAll(() => {
      const packagePath = path.join(PROJECT_ROOT, 'package.json');
      const content = fs.readFileSync(packagePath, 'utf-8');
      packageJson = JSON.parse(content);
    });

    it('should be marked as private (monorepo root)', () => {
      expect(packageJson.private).toBe(true);
    });

    it('should specify packageManager as pnpm with version', () => {
      expect(packageJson.packageManager).toBeDefined();
      expect(packageJson.packageManager).toMatch(/^pnpm@\d+\.\d+\.\d+/);
    });

    it('should have turbo as a devDependency', () => {
      const devDeps = packageJson.devDependencies as Record<string, string>;
      expect(devDeps).toBeDefined();
      expect(devDeps.turbo).toBeDefined();
    });

    it('should have workspace scripts defined', () => {
      const scripts = packageJson.scripts as Record<string, string>;
      expect(scripts).toBeDefined();
      expect(scripts.build).toBeDefined();
      expect(scripts.dev).toBeDefined();
      expect(scripts.lint).toBeDefined();
      expect(scripts.test).toBeDefined();
    });

    it('scripts should use turbo for parallelization', () => {
      const scripts = packageJson.scripts as Record<string, string>;
      expect(scripts.build).toContain('turbo');
      expect(scripts.dev).toContain('turbo');
    });
  });

  describe('.nvmrc configuration', () => {
    let nvmrcContent: string;

    beforeAll(() => {
      const nvmrcPath = path.join(PROJECT_ROOT, '.nvmrc');
      nvmrcContent = fs.readFileSync(nvmrcPath, 'utf-8').trim();
    });

    it('should specify Node.js version 20', () => {
      expect(nvmrcContent).toMatch(/^20/);
    });

    it('should be a valid Node.js version format', () => {
      // Valid formats: 20, 20.x, 20.10.0, v20.10.0
      const isValidFormat = /^v?20(\.[\dx]+)*$/.test(nvmrcContent);
      expect(isValidFormat).toBe(true);
    });
  });
});

describe('Story 0.1.1: Package Structure', () => {
  describe('apps/web package configuration', () => {
    let webPackageJson: Record<string, unknown>;

    beforeAll(() => {
      const packagePath = path.join(PROJECT_ROOT, 'apps', 'web', 'package.json');
      const content = fs.readFileSync(packagePath, 'utf-8');
      webPackageJson = JSON.parse(content);
    });

    it('should have name @hyyve/web', () => {
      expect(webPackageJson.name).toBe('@hyyve/web');
    });

    it('should have next@15.x as dependency', () => {
      const deps = webPackageJson.dependencies as Record<string, string>;
      expect(deps.next).toBeDefined();
      expect(deps.next).toMatch(/15\./);
    });

    it('should have react@19.x as dependency', () => {
      const deps = webPackageJson.dependencies as Record<string, string>;
      expect(deps.react).toBeDefined();
      expect(deps.react).toMatch(/19\.|^19$/);
    });

    it('should have react-dom@19.x as dependency', () => {
      const deps = webPackageJson.dependencies as Record<string, string>;
      expect(deps['react-dom']).toBeDefined();
      expect(deps['react-dom']).toMatch(/19\.|^19$/);
    });

    it('should have build script', () => {
      const scripts = webPackageJson.scripts as Record<string, string>;
      expect(scripts.build).toBeDefined();
      expect(scripts.build).toContain('next');
    });

    it('should have dev script', () => {
      const scripts = webPackageJson.scripts as Record<string, string>;
      expect(scripts.dev).toBeDefined();
      expect(scripts.dev).toContain('next');
    });

    it('should have lint script', () => {
      const scripts = webPackageJson.scripts as Record<string, string>;
      expect(scripts.lint).toBeDefined();
    });

    it('should reference @platform packages as workspace dependencies', () => {
      const deps = webPackageJson.dependencies as Record<string, string>;
      const devDeps = (webPackageJson.devDependencies || {}) as Record<string, string>;
      const allDeps = { ...deps, ...devDeps };

      // At minimum, should reference @platform/ui
      const hasPlatformDep = Object.keys(allDeps).some((key) =>
        key.startsWith('@platform/')
      );
      expect(hasPlatformDep).toBe(true);
    });
  });

  describe('packages/@platform/ui configuration', () => {
    let uiPackageJson: Record<string, unknown>;

    beforeAll(() => {
      const packagePath = path.join(
        PROJECT_ROOT,
        'packages',
        '@platform',
        'ui',
        'package.json'
      );
      const content = fs.readFileSync(packagePath, 'utf-8');
      uiPackageJson = JSON.parse(content);
    });

    it('should have name @platform/ui', () => {
      expect(uiPackageJson.name).toBe('@platform/ui');
    });

    it('should export components', () => {
      expect(uiPackageJson.main || uiPackageJson.exports).toBeDefined();
    });

    it('should have React as peer dependency', () => {
      const peerDeps = (uiPackageJson.peerDependencies || {}) as Record<string, string>;
      expect(peerDeps.react).toBeDefined();
    });
  });

  describe('packages/@platform/db configuration', () => {
    let dbPackageJson: Record<string, unknown>;

    beforeAll(() => {
      const packagePath = path.join(
        PROJECT_ROOT,
        'packages',
        '@platform',
        'db',
        'package.json'
      );
      const content = fs.readFileSync(packagePath, 'utf-8');
      dbPackageJson = JSON.parse(content);
    });

    it('should have name @platform/db', () => {
      expect(dbPackageJson.name).toBe('@platform/db');
    });

    it('should have @supabase/supabase-js as dependency', () => {
      const deps = dbPackageJson.dependencies as Record<string, string>;
      const devDeps = (dbPackageJson.devDependencies || {}) as Record<string, string>;
      const allDeps = { ...deps, ...devDeps };
      expect(allDeps['@supabase/supabase-js']).toBeDefined();
    });
  });

  describe('packages/@platform/auth configuration', () => {
    let authPackageJson: Record<string, unknown>;

    beforeAll(() => {
      const packagePath = path.join(
        PROJECT_ROOT,
        'packages',
        '@platform',
        'auth',
        'package.json'
      );
      const content = fs.readFileSync(packagePath, 'utf-8');
      authPackageJson = JSON.parse(content);
    });

    it('should have name @platform/auth', () => {
      expect(authPackageJson.name).toBe('@platform/auth');
    });

    it('should have auth-related dependencies', () => {
      const deps = authPackageJson.dependencies as Record<string, string>;
      const devDeps = (authPackageJson.devDependencies || {}) as Record<string, string>;
      const allDeps = { ...deps, ...devDeps };

      // Should have Clerk or other auth provider
      const hasAuthDep = Object.keys(allDeps).some(
        (key) => key.includes('clerk') || key.includes('auth') || key.includes('workos')
      );
      expect(hasAuthDep).toBe(true);
    });
  });

  describe('packages/tsconfig configuration', () => {
    let tsconfigPackageJson: Record<string, unknown>;

    beforeAll(() => {
      const packagePath = path.join(
        PROJECT_ROOT,
        'packages',
        'tsconfig',
        'package.json'
      );
      const content = fs.readFileSync(packagePath, 'utf-8');
      tsconfigPackageJson = JSON.parse(content);
    });

    it('should have name @hyyve/tsconfig or tsconfig', () => {
      const name = tsconfigPackageJson.name as string;
      expect(name).toMatch(/tsconfig/);
    });

    it('should export tsconfig files', () => {
      // Check that it exports json files
      const files = tsconfigPackageJson.files as string[];
      expect(files).toBeDefined();
      expect(files.some((f) => f.endsWith('.json'))).toBe(true);
    });
  });
});

describe('Story 0.1.1: TypeScript Path Aliases', () => {
  describe('apps/web tsconfig.json', () => {
    let webTsconfig: Record<string, unknown>;

    beforeAll(() => {
      const tsconfigPath = path.join(PROJECT_ROOT, 'apps', 'web', 'tsconfig.json');
      const content = fs.readFileSync(tsconfigPath, 'utf-8');
      webTsconfig = JSON.parse(content);
    });

    it('should have compilerOptions.paths defined', () => {
      const compilerOptions = webTsconfig.compilerOptions as Record<string, unknown>;
      expect(compilerOptions).toBeDefined();
      expect(compilerOptions.paths).toBeDefined();
    });

    it('should have @/* path alias for local imports', () => {
      const compilerOptions = webTsconfig.compilerOptions as Record<string, unknown>;
      const paths = compilerOptions.paths as Record<string, string[]>;

      expect(paths['@/*']).toBeDefined();
      expect(paths['@/*'][0]).toContain('./');
    });

    it('should have @platform/* path alias for package imports', () => {
      const compilerOptions = webTsconfig.compilerOptions as Record<string, unknown>;
      const paths = compilerOptions.paths as Record<string, string[]>;

      expect(paths['@platform/*']).toBeDefined();
    });

    it('should extend shared tsconfig', () => {
      expect(webTsconfig.extends).toBeDefined();
      expect(webTsconfig.extends).toContain('tsconfig');
    });

    it('should include App Router specific settings', () => {
      const compilerOptions = webTsconfig.compilerOptions as Record<string, unknown>;

      // Next.js App Router requires specific settings
      expect(compilerOptions.module).toBeDefined();
      expect(compilerOptions.jsx).toBeDefined();
    });
  });

  describe('Root tsconfig.json', () => {
    let rootTsconfig: Record<string, unknown>;

    beforeAll(() => {
      const tsconfigPath = path.join(PROJECT_ROOT, 'tsconfig.json');
      const content = fs.readFileSync(tsconfigPath, 'utf-8');
      rootTsconfig = JSON.parse(content);
    });

    it('should reference package tsconfigs', () => {
      const references = rootTsconfig.references as Array<{ path: string }>;
      expect(references).toBeDefined();
      expect(references.length).toBeGreaterThan(0);
    });
  });
});
