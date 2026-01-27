import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Story 0.1.2: Configure TypeScript with Strict Mode
 *
 * ATDD Tests for TypeScript Configuration
 *
 * These tests validate the acceptance criteria for:
 * - AC1: Base TypeScript Configuration with strict mode settings
 * - AC2: Shared Configuration Extension (apps/packages extend base)
 * - AC3: Path Aliases Configuration (@/ and @platform/*)
 * - AC4: TypeScript Version (5.x installed)
 *
 * @see _bmad-output/implementation-artifacts/story-0-1-2-configure-typescript-strict-mode.md
 */

// Project root - go up from tests/unit/infrastructure to project root
const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..');

describe('Story 0.1.2: TypeScript Strict Mode Configuration', () => {
  describe('AC1: Base TypeScript Configuration', () => {
    let baseConfig: {
      compilerOptions?: Record<string, unknown>;
      [key: string]: unknown;
    };

    beforeAll(() => {
      const basePath = path.join(PROJECT_ROOT, 'packages', 'tsconfig', 'base.json');
      const content = fs.readFileSync(basePath, 'utf-8');
      baseConfig = JSON.parse(content);
    });

    it('should have packages/tsconfig/base.json file', () => {
      const basePath = path.join(PROJECT_ROOT, 'packages', 'tsconfig', 'base.json');
      expect(fs.existsSync(basePath)).toBe(true);
    });

    it('should have compilerOptions defined', () => {
      expect(baseConfig.compilerOptions).toBeDefined();
      expect(typeof baseConfig.compilerOptions).toBe('object');
    });

    describe('strict mode settings', () => {
      it('should have strict: true', () => {
        expect(baseConfig.compilerOptions?.strict).toBe(true);
      });

      it('should have noUncheckedIndexedAccess: true for safer array/object access', () => {
        expect(baseConfig.compilerOptions?.noUncheckedIndexedAccess).toBe(true);
      });

      it('should have noImplicitReturns: true to enforce explicit returns', () => {
        expect(baseConfig.compilerOptions?.noImplicitReturns).toBe(true);
      });

      it('should have esModuleInterop: true for module compatibility', () => {
        expect(baseConfig.compilerOptions?.esModuleInterop).toBe(true);
      });

      it('should have moduleResolution: "bundler" for modern bundler compatibility', () => {
        expect(baseConfig.compilerOptions?.moduleResolution).toBe('bundler');
      });

      it('should have target: "ES2022" for modern JavaScript features', () => {
        expect(baseConfig.compilerOptions?.target).toBe('ES2022');
      });
    });
  });

  describe('AC2: Shared Configuration Extension', () => {
    describe('packages/tsconfig/nextjs.json', () => {
      let nextjsConfig: { extends?: string; [key: string]: unknown };

      beforeAll(() => {
        const configPath = path.join(PROJECT_ROOT, 'packages', 'tsconfig', 'nextjs.json');
        const content = fs.readFileSync(configPath, 'utf-8');
        nextjsConfig = JSON.parse(content);
      });

      it('should exist', () => {
        const configPath = path.join(PROJECT_ROOT, 'packages', 'tsconfig', 'nextjs.json');
        expect(fs.existsSync(configPath)).toBe(true);
      });

      it('should extend base.json', () => {
        expect(nextjsConfig.extends).toBeDefined();
        expect(nextjsConfig.extends).toContain('base.json');
      });
    });

    describe('packages/tsconfig/react-library.json', () => {
      let reactLibConfig: { extends?: string; [key: string]: unknown };

      beforeAll(() => {
        const configPath = path.join(
          PROJECT_ROOT,
          'packages',
          'tsconfig',
          'react-library.json'
        );
        const content = fs.readFileSync(configPath, 'utf-8');
        reactLibConfig = JSON.parse(content);
      });

      it('should exist', () => {
        const configPath = path.join(
          PROJECT_ROOT,
          'packages',
          'tsconfig',
          'react-library.json'
        );
        expect(fs.existsSync(configPath)).toBe(true);
      });

      it('should extend base.json', () => {
        expect(reactLibConfig.extends).toBeDefined();
        expect(reactLibConfig.extends).toContain('base.json');
      });
    });

    describe('apps/web/tsconfig.json', () => {
      let webTsconfig: { extends?: string; [key: string]: unknown };

      beforeAll(() => {
        const configPath = path.join(PROJECT_ROOT, 'apps', 'web', 'tsconfig.json');
        const content = fs.readFileSync(configPath, 'utf-8');
        webTsconfig = JSON.parse(content);
      });

      it('should extend the shared nextjs config', () => {
        expect(webTsconfig.extends).toBeDefined();
        // Should extend @hyyve/tsconfig/nextjs.json or similar
        expect(webTsconfig.extends).toMatch(/nextjs/i);
      });
    });

    describe('@platform packages extend shared configs', () => {
      it('@platform/ui should extend react-library config', () => {
        const configPath = path.join(
          PROJECT_ROOT,
          'packages',
          '@platform',
          'ui',
          'tsconfig.json'
        );
        const content = fs.readFileSync(configPath, 'utf-8');
        const config = JSON.parse(content);

        expect(config.extends).toBeDefined();
        expect(config.extends).toMatch(/react-library/i);
      });

      it('@platform/db should extend base or react-library config', () => {
        const configPath = path.join(
          PROJECT_ROOT,
          'packages',
          '@platform',
          'db',
          'tsconfig.json'
        );
        const content = fs.readFileSync(configPath, 'utf-8');
        const config = JSON.parse(content);

        expect(config.extends).toBeDefined();
        expect(config.extends).toMatch(/base|react-library/i);
      });

      it('@platform/auth should extend base or react-library config', () => {
        const configPath = path.join(
          PROJECT_ROOT,
          'packages',
          '@platform',
          'auth',
          'tsconfig.json'
        );
        const content = fs.readFileSync(configPath, 'utf-8');
        const config = JSON.parse(content);

        expect(config.extends).toBeDefined();
        expect(config.extends).toMatch(/base|react-library/i);
      });
    });
  });

  describe('AC3: Path Aliases Configuration', () => {
    describe('apps/web path aliases', () => {
      let webTsconfig: {
        compilerOptions?: { paths?: Record<string, string[]> };
        [key: string]: unknown;
      };

      beforeAll(() => {
        const configPath = path.join(PROJECT_ROOT, 'apps', 'web', 'tsconfig.json');
        const content = fs.readFileSync(configPath, 'utf-8');
        webTsconfig = JSON.parse(content);
      });

      it('should have paths configuration', () => {
        expect(webTsconfig.compilerOptions?.paths).toBeDefined();
      });

      it('should have @/* path alias for local imports', () => {
        const paths = webTsconfig.compilerOptions?.paths;
        expect(paths).toBeDefined();
        expect(paths!['@/*']).toBeDefined();
        expect(Array.isArray(paths!['@/*'])).toBe(true);
      });

      it('should have @platform/* path aliases for cross-package imports', () => {
        const paths = webTsconfig.compilerOptions?.paths;
        expect(paths).toBeDefined();
        // Check for specific @platform aliases (ui, shared, types, etc.)
        const platformAliases = Object.keys(paths!).filter((key) =>
          key.startsWith('@platform/')
        );
        expect(platformAliases.length).toBeGreaterThan(0);
      });

      it('@/* alias should point to local directory', () => {
        const paths = webTsconfig.compilerOptions?.paths;
        expect(paths!['@/*'][0]).toMatch(/^\.\//);
      });

      it('@platform/* aliases should point to packages/@platform', () => {
        const paths = webTsconfig.compilerOptions?.paths;
        // Check that at least one @platform alias points to the packages directory
        const platformAliases = Object.entries(paths!).filter(([key]) =>
          key.startsWith('@platform/')
        );
        expect(platformAliases.length).toBeGreaterThan(0);
        const [, values] = platformAliases[0]!;
        expect(values[0]).toContain('@platform');
      });
    });
  });

  describe('AC4: TypeScript Version', () => {
    let rootPackageJson: {
      devDependencies?: Record<string, string>;
      dependencies?: Record<string, string>;
      [key: string]: unknown;
    };

    beforeAll(() => {
      const packagePath = path.join(PROJECT_ROOT, 'package.json');
      const content = fs.readFileSync(packagePath, 'utf-8');
      rootPackageJson = JSON.parse(content);
    });

    it('should have TypeScript installed', () => {
      const deps = rootPackageJson.dependencies || {};
      const devDeps = rootPackageJson.devDependencies || {};
      const allDeps = { ...deps, ...devDeps };

      expect(allDeps.typescript).toBeDefined();
    });

    it('should have TypeScript 5.x installed', () => {
      const deps = rootPackageJson.dependencies || {};
      const devDeps = rootPackageJson.devDependencies || {};
      const allDeps = { ...deps, ...devDeps };

      const tsVersion = allDeps.typescript;
      expect(tsVersion).toBeDefined();
      // Match 5.x.x, ^5.x.x, ~5.x.x, 5.x, etc.
      expect(tsVersion).toMatch(/^[\^~]?5\./);
    });
  });
});

describe('Story 0.1.2: TypeScript Configuration Hierarchy', () => {
  describe('Configuration file structure', () => {
    it('should have packages/tsconfig/base.json', () => {
      const filePath = path.join(PROJECT_ROOT, 'packages', 'tsconfig', 'base.json');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have packages/tsconfig/nextjs.json', () => {
      const filePath = path.join(PROJECT_ROOT, 'packages', 'tsconfig', 'nextjs.json');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have packages/tsconfig/react-library.json', () => {
      const filePath = path.join(
        PROJECT_ROOT,
        'packages',
        'tsconfig',
        'react-library.json'
      );
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have packages/tsconfig/package.json for workspace', () => {
      const filePath = path.join(PROJECT_ROOT, 'packages', 'tsconfig', 'package.json');
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  describe('Configuration inheritance chain', () => {
    it('nextjs.json should extend base.json directly', () => {
      const configPath = path.join(PROJECT_ROOT, 'packages', 'tsconfig', 'nextjs.json');
      const content = fs.readFileSync(configPath, 'utf-8');
      const config = JSON.parse(content);

      // Should be a direct extension, not through another intermediate
      expect(config.extends).toBe('./base.json');
    });

    it('react-library.json should extend base.json directly', () => {
      const configPath = path.join(
        PROJECT_ROOT,
        'packages',
        'tsconfig',
        'react-library.json'
      );
      const content = fs.readFileSync(configPath, 'utf-8');
      const config = JSON.parse(content);

      expect(config.extends).toBe('./base.json');
    });
  });
});

describe('Story 0.1.2: Strict Mode Enforcement Validation', () => {
  describe('Additional strict options', () => {
    let baseConfig: {
      compilerOptions?: Record<string, unknown>;
      [key: string]: unknown;
    };

    beforeAll(() => {
      const basePath = path.join(PROJECT_ROOT, 'packages', 'tsconfig', 'base.json');
      const content = fs.readFileSync(basePath, 'utf-8');
      baseConfig = JSON.parse(content);
    });

    it('should have strictNullChecks enabled (covered by strict: true but can be explicit)', () => {
      // When strict: true, strictNullChecks is implied, but can also be explicit
      const options = baseConfig.compilerOptions || {};
      const hasStrict = options.strict === true;
      const hasExplicitStrictNullChecks = options.strictNullChecks === true;

      // At least one must be true
      expect(hasStrict || hasExplicitStrictNullChecks).toBe(true);
    });

    it('should have skipLibCheck for performance', () => {
      // This is recommended for monorepos
      expect(baseConfig.compilerOptions?.skipLibCheck).toBe(true);
    });

    it('should have isolatedModules for bundler compatibility', () => {
      // Required for modern bundlers like esbuild, vite, etc.
      expect(baseConfig.compilerOptions?.isolatedModules).toBe(true);
    });
  });
});
