import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Story 0.1.3: Install Core Frontend Dependencies
 *
 * ATDD Tests for Frontend Dependencies Configuration
 *
 * These tests validate the acceptance criteria for:
 * - AC1: Core Dependencies Installed (tailwindcss, zustand, zod, @xyflow/react, clsx, tailwind-merge)
 * - AC2: Tailwind CSS Configuration with shadcn theme defaults
 * - AC3: Global Styles Setup with CSS variables
 * - AC4: cn() Utility Function Created
 *
 * @see _bmad-output/implementation-artifacts/story-0-1-3-install-core-frontend-dependencies.md
 */

// Project root - go up from tests/unit/infrastructure to project root
const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..');
const WEB_APP_PATH = path.join(PROJECT_ROOT, 'apps', 'web');

describe('Story 0.1.3: Install Core Frontend Dependencies', () => {
  describe('AC1: Core Dependencies Installed', () => {
    let webPackageJson: {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      [key: string]: unknown;
    };

    beforeAll(() => {
      const packagePath = path.join(WEB_APP_PATH, 'package.json');
      const content = fs.readFileSync(packagePath, 'utf-8');
      webPackageJson = JSON.parse(content);
    });

    it('should have tailwindcss@4.x installed', () => {
      const deps = { ...webPackageJson.dependencies, ...webPackageJson.devDependencies };
      expect(deps.tailwindcss).toBeDefined();
      // Match 4.x.x, ^4.x.x, ~4.x.x, etc.
      expect(deps.tailwindcss).toMatch(/^[\^~]?4\./);
    });

    it('should have zustand@5.0.8 installed', () => {
      const deps = { ...webPackageJson.dependencies, ...webPackageJson.devDependencies };
      expect(deps.zustand).toBeDefined();
      expect(deps.zustand).toMatch(/^[\^~]?5\.0\.8$/);
    });

    it('should have zod@4.0.1 installed', () => {
      const deps = { ...webPackageJson.dependencies, ...webPackageJson.devDependencies };
      expect(deps.zod).toBeDefined();
      expect(deps.zod).toMatch(/^[\^~]?4\.0\.1$/);
    });

    it('should have @xyflow/react@12.10.0 installed', () => {
      const deps = { ...webPackageJson.dependencies, ...webPackageJson.devDependencies };
      expect(deps['@xyflow/react']).toBeDefined();
      expect(deps['@xyflow/react']).toMatch(/^[\^~]?12\.10\.0$/);
    });

    it('should have clsx installed', () => {
      const deps = { ...webPackageJson.dependencies, ...webPackageJson.devDependencies };
      expect(deps.clsx).toBeDefined();
    });

    it('should have tailwind-merge installed', () => {
      const deps = { ...webPackageJson.dependencies, ...webPackageJson.devDependencies };
      expect(deps['tailwind-merge']).toBeDefined();
    });

    it('should have immer installed for Zustand middleware', () => {
      const deps = { ...webPackageJson.dependencies, ...webPackageJson.devDependencies };
      expect(deps.immer).toBeDefined();
    });

    it('should have postcss installed', () => {
      const deps = { ...webPackageJson.dependencies, ...webPackageJson.devDependencies };
      expect(deps.postcss).toBeDefined();
    });

    it('should have autoprefixer installed', () => {
      const deps = { ...webPackageJson.dependencies, ...webPackageJson.devDependencies };
      expect(deps.autoprefixer).toBeDefined();
    });
  });

  describe('AC2: Tailwind CSS Configuration', () => {
    it('should have tailwind.config.ts file', () => {
      const configPath = path.join(WEB_APP_PATH, 'tailwind.config.ts');
      expect(fs.existsSync(configPath)).toBe(true);
    });

    it('should have postcss.config.js file', () => {
      const configPath = path.join(WEB_APP_PATH, 'postcss.config.js');
      expect(fs.existsSync(configPath)).toBe(true);
    });

    describe('tailwind.config.ts content', () => {
      let tailwindConfig: string;

      beforeAll(() => {
        const configPath = path.join(WEB_APP_PATH, 'tailwind.config.ts');
        tailwindConfig = fs.readFileSync(configPath, 'utf-8');
      });

      it('should have content paths configured', () => {
        expect(tailwindConfig).toContain('content');
      });

      it('should include app directory in content paths', () => {
        expect(tailwindConfig).toContain('./app/');
      });

      it('should have theme configuration with shadcn colors', () => {
        // Check for shadcn CSS variable-based color references
        expect(tailwindConfig).toContain('background');
        expect(tailwindConfig).toContain('foreground');
        expect(tailwindConfig).toContain('primary');
        expect(tailwindConfig).toContain('secondary');
        expect(tailwindConfig).toContain('muted');
        expect(tailwindConfig).toContain('accent');
        expect(tailwindConfig).toContain('destructive');
      });

      it('should have border-radius configuration', () => {
        expect(tailwindConfig).toContain('borderRadius');
        expect(tailwindConfig).toContain('radius');
      });
    });

    describe('postcss.config.js content', () => {
      let postcssConfig: string;

      beforeAll(() => {
        const configPath = path.join(WEB_APP_PATH, 'postcss.config.js');
        postcssConfig = fs.readFileSync(configPath, 'utf-8');
      });

      it('should have tailwindcss plugin', () => {
        // Tailwind v4 uses @tailwindcss/postcss plugin
        const hasTailwindPlugin =
          postcssConfig.includes('tailwindcss') ||
          postcssConfig.includes('@tailwindcss/postcss');
        expect(hasTailwindPlugin).toBe(true);
      });

      it('should have autoprefixer plugin', () => {
        expect(postcssConfig).toContain('autoprefixer');
      });
    });
  });

  describe('AC3: Global Styles Setup', () => {
    let globalsCss: string;

    beforeAll(() => {
      const cssPath = path.join(WEB_APP_PATH, 'app', 'globals.css');
      globalsCss = fs.readFileSync(cssPath, 'utf-8');
    });

    it('should have globals.css file', () => {
      const cssPath = path.join(WEB_APP_PATH, 'app', 'globals.css');
      expect(fs.existsSync(cssPath)).toBe(true);
    });

    it('should have Tailwind directives', () => {
      // Check for either Tailwind v3 or v4 style imports
      const hasV3Directives =
        globalsCss.includes('@tailwind base') ||
        globalsCss.includes('@tailwind components') ||
        globalsCss.includes('@tailwind utilities');
      const hasV4Import = globalsCss.includes('@import "tailwindcss"');

      expect(hasV3Directives || hasV4Import).toBe(true);
    });

    describe('CSS Variables for theming', () => {
      it('should have :root selector with CSS variables', () => {
        expect(globalsCss).toContain(':root');
      });

      it('should have --background CSS variable', () => {
        expect(globalsCss).toContain('--background');
      });

      it('should have --foreground CSS variable', () => {
        expect(globalsCss).toContain('--foreground');
      });

      it('should have --primary CSS variable', () => {
        expect(globalsCss).toContain('--primary');
      });

      it('should have --secondary CSS variable', () => {
        expect(globalsCss).toContain('--secondary');
      });

      it('should have --muted CSS variable', () => {
        expect(globalsCss).toContain('--muted');
      });

      it('should have --accent CSS variable', () => {
        expect(globalsCss).toContain('--accent');
      });

      it('should have --destructive CSS variable', () => {
        expect(globalsCss).toContain('--destructive');
      });

      it('should have --border CSS variable', () => {
        expect(globalsCss).toContain('--border');
      });

      it('should have --input CSS variable', () => {
        expect(globalsCss).toContain('--input');
      });

      it('should have --ring CSS variable', () => {
        expect(globalsCss).toContain('--ring');
      });

      it('should have --radius CSS variable', () => {
        expect(globalsCss).toContain('--radius');
      });

      it('should have --card CSS variable', () => {
        expect(globalsCss).toContain('--card');
      });

      it('should have --popover CSS variable', () => {
        expect(globalsCss).toContain('--popover');
      });

      it('should have dark mode variables', () => {
        expect(globalsCss).toContain('.dark');
      });
    });
  });

  describe('AC4: Utility Function Created', () => {
    it('should have lib/utils.ts file', () => {
      const utilsPath = path.join(WEB_APP_PATH, 'lib', 'utils.ts');
      expect(fs.existsSync(utilsPath)).toBe(true);
    });

    describe('cn() utility function', () => {
      let utilsContent: string;

      beforeAll(() => {
        const utilsPath = path.join(WEB_APP_PATH, 'lib', 'utils.ts');
        utilsContent = fs.readFileSync(utilsPath, 'utf-8');
      });

      it('should export cn function', () => {
        expect(utilsContent).toMatch(/export\s+(function\s+cn|const\s+cn)/);
      });

      it('should import clsx', () => {
        expect(utilsContent).toContain("from 'clsx'");
      });

      it('should import twMerge from tailwind-merge', () => {
        expect(utilsContent).toContain("from 'tailwind-merge'");
        expect(utilsContent).toContain('twMerge');
      });

      it('should use twMerge with clsx', () => {
        expect(utilsContent).toContain('twMerge');
        expect(utilsContent).toContain('clsx');
      });
    });
  });
});

describe('Story 0.1.3: cn() Utility Function Behavior', () => {
  // Dynamic import to test actual functionality
  // Note: These tests require the implementation to exist

  describe('cn() merges Tailwind classes correctly', () => {
    it('should be testable after implementation', async () => {
      // This is a placeholder that validates the file structure
      // Actual behavior tests would require dynamic imports
      const utilsPath = path.join(WEB_APP_PATH, 'lib', 'utils.ts');
      expect(fs.existsSync(utilsPath)).toBe(true);
    });
  });
});
