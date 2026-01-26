import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Story 0.1.5: Configure Supabase Database Client
 *
 * ATDD Tests for Supabase SSR Configuration
 *
 * These tests validate the acceptance criteria for:
 * - AC1: Supabase Packages Installed (@supabase/supabase-js, @supabase/ssr)
 * - AC2: Server Client Created with proper cookie handling
 * - AC3: Browser Client Created
 * - AC4: Middleware Auth Cookie Refresh
 * - AC5: TypeScript Types Generated
 *
 * @see _bmad-output/implementation-artifacts/story-0-1-5-configure-supabase-database-client.md
 */

// Project root - go up from tests/unit/infrastructure to project root
const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..');
const DB_PACKAGE_PATH = path.join(PROJECT_ROOT, 'packages', '@platform', 'db');
const WEB_APP_PATH = path.join(PROJECT_ROOT, 'apps', 'web');

describe('Story 0.1.5: Configure Supabase Database Client', () => {
  describe('AC1: Supabase Packages Installed', () => {
    let dbPackageJson: {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      [key: string]: unknown;
    };

    beforeAll(() => {
      const packagePath = path.join(DB_PACKAGE_PATH, 'package.json');
      const content = fs.readFileSync(packagePath, 'utf-8');
      dbPackageJson = JSON.parse(content);
    });

    it('should have @supabase/supabase-js installed', () => {
      const deps = { ...dbPackageJson.dependencies, ...dbPackageJson.devDependencies };
      expect(deps['@supabase/supabase-js']).toBeDefined();
    });

    it('should have @supabase/supabase-js version 2.x', () => {
      const deps = { ...dbPackageJson.dependencies, ...dbPackageJson.devDependencies };
      expect(deps['@supabase/supabase-js']).toMatch(/^[\^~]?2\./);
    });

    it('should have @supabase/ssr installed', () => {
      const deps = { ...dbPackageJson.dependencies, ...dbPackageJson.devDependencies };
      expect(deps['@supabase/ssr']).toBeDefined();
    });
  });

  describe('AC2: Server Client Created', () => {
    it('should have server.ts file', () => {
      const serverPath = path.join(DB_PACKAGE_PATH, 'src', 'server.ts');
      expect(fs.existsSync(serverPath)).toBe(true);
    });

    describe('server.ts content', () => {
      let serverContent: string;

      beforeAll(() => {
        const serverPath = path.join(DB_PACKAGE_PATH, 'src', 'server.ts');
        if (fs.existsSync(serverPath)) {
          serverContent = fs.readFileSync(serverPath, 'utf-8');
        } else {
          serverContent = '';
        }
      });

      it('should import createServerClient from @supabase/ssr', () => {
        expect(serverContent).toContain('@supabase/ssr');
        expect(serverContent).toContain('createServerClient');
      });

      it('should import cookies from next/headers', () => {
        expect(serverContent).toContain('next/headers');
        expect(serverContent).toContain('cookies');
      });

      it('should have cookie handling with getAll', () => {
        expect(serverContent).toContain('getAll');
      });

      it('should have cookie handling with setAll', () => {
        expect(serverContent).toContain('setAll');
      });

      it('should export a createClient function', () => {
        expect(serverContent).toMatch(/export\s+(async\s+)?function\s+createClient/);
      });
    });
  });

  describe('AC3: Browser Client Created', () => {
    it('should have browser.ts file', () => {
      const browserPath = path.join(DB_PACKAGE_PATH, 'src', 'browser.ts');
      expect(fs.existsSync(browserPath)).toBe(true);
    });

    describe('browser.ts content', () => {
      let browserContent: string;

      beforeAll(() => {
        const browserPath = path.join(DB_PACKAGE_PATH, 'src', 'browser.ts');
        if (fs.existsSync(browserPath)) {
          browserContent = fs.readFileSync(browserPath, 'utf-8');
        } else {
          browserContent = '';
        }
      });

      it('should import createBrowserClient from @supabase/ssr', () => {
        expect(browserContent).toContain('@supabase/ssr');
        expect(browserContent).toContain('createBrowserClient');
      });

      it('should export a createClient function', () => {
        expect(browserContent).toMatch(/export\s+function\s+createClient/);
      });

      it('should use NEXT_PUBLIC environment variables', () => {
        expect(browserContent).toContain('NEXT_PUBLIC_SUPABASE_URL');
        expect(browserContent).toContain('NEXT_PUBLIC_SUPABASE_ANON_KEY');
      });
    });
  });

  describe('AC4: Middleware Auth Cookie Refresh', () => {
    describe('middleware helper in @platform/db', () => {
      it('should have middleware.ts file in db package', () => {
        const middlewarePath = path.join(DB_PACKAGE_PATH, 'src', 'middleware.ts');
        expect(fs.existsSync(middlewarePath)).toBe(true);
      });

      describe('middleware.ts content', () => {
        let middlewareContent: string;

        beforeAll(() => {
          const middlewarePath = path.join(DB_PACKAGE_PATH, 'src', 'middleware.ts');
          if (fs.existsSync(middlewarePath)) {
            middlewareContent = fs.readFileSync(middlewarePath, 'utf-8');
          } else {
            middlewareContent = '';
          }
        });

        it('should import createServerClient from @supabase/ssr', () => {
          expect(middlewareContent).toContain('@supabase/ssr');
          expect(middlewareContent).toContain('createServerClient');
        });

        it('should import NextRequest and NextResponse', () => {
          expect(middlewareContent).toContain('NextRequest');
          expect(middlewareContent).toContain('NextResponse');
        });

        it('should export updateSession function', () => {
          expect(middlewareContent).toContain('updateSession');
          expect(middlewareContent).toMatch(/export\s+(async\s+)?function\s+updateSession/);
        });

        it('should call getUser to refresh session', () => {
          expect(middlewareContent).toContain('getUser');
        });
      });
    });

    describe('Next.js middleware', () => {
      it('should have middleware.ts in apps/web', () => {
        const middlewarePath = path.join(WEB_APP_PATH, 'middleware.ts');
        expect(fs.existsSync(middlewarePath)).toBe(true);
      });

      describe('apps/web/middleware.ts content', () => {
        let webMiddlewareContent: string;

        beforeAll(() => {
          const middlewarePath = path.join(WEB_APP_PATH, 'middleware.ts');
          if (fs.existsSync(middlewarePath)) {
            webMiddlewareContent = fs.readFileSync(middlewarePath, 'utf-8');
          } else {
            webMiddlewareContent = '';
          }
        });

        it('should import updateSession from @platform/db', () => {
          expect(webMiddlewareContent).toContain('@platform/db');
          expect(webMiddlewareContent).toContain('updateSession');
        });

        it('should export config with matcher', () => {
          expect(webMiddlewareContent).toContain('config');
          expect(webMiddlewareContent).toContain('matcher');
        });

        it('should export middleware function', () => {
          expect(webMiddlewareContent).toMatch(/export\s+(async\s+)?function\s+middleware/);
        });
      });
    });
  });

  describe('AC5: TypeScript Types', () => {
    it('should have types.ts file', () => {
      const typesPath = path.join(DB_PACKAGE_PATH, 'src', 'types.ts');
      expect(fs.existsSync(typesPath)).toBe(true);
    });

    describe('types.ts content', () => {
      let typesContent: string;

      beforeAll(() => {
        const typesPath = path.join(DB_PACKAGE_PATH, 'src', 'types.ts');
        typesContent = fs.readFileSync(typesPath, 'utf-8');
      });

      it('should export Database type', () => {
        expect(typesContent).toContain('export type Database');
      });

      it('should have public schema definition', () => {
        expect(typesContent).toContain('public');
      });
    });
  });

  describe('Package Exports', () => {
    describe('index.ts barrel exports', () => {
      let indexContent: string;

      beforeAll(() => {
        const indexPath = path.join(DB_PACKAGE_PATH, 'src', 'index.ts');
        indexContent = fs.readFileSync(indexPath, 'utf-8');
      });

      it('should export from server module', () => {
        expect(indexContent).toContain('./server');
      });

      it('should export from browser module', () => {
        expect(indexContent).toContain('./browser');
      });

      it('should export from types module', () => {
        expect(indexContent).toContain('./types');
      });

      it('should export from middleware module', () => {
        expect(indexContent).toContain('./middleware');
      });
    });

    describe('package.json exports', () => {
      let packageJson: {
        exports?: Record<string, unknown>;
        [key: string]: unknown;
      };

      beforeAll(() => {
        const packagePath = path.join(DB_PACKAGE_PATH, 'package.json');
        const content = fs.readFileSync(packagePath, 'utf-8');
        packageJson = JSON.parse(content);
      });

      it('should have server export path', () => {
        expect(packageJson.exports).toHaveProperty('./server');
      });

      it('should have browser export path', () => {
        expect(packageJson.exports).toHaveProperty('./browser');
      });

      it('should have middleware export path', () => {
        expect(packageJson.exports).toHaveProperty('./middleware');
      });
    });
  });

  describe('Environment Variables Documentation', () => {
    it('should have .env.example with Supabase variables', () => {
      const envExamplePath = path.join(PROJECT_ROOT, '.env.example');
      if (fs.existsSync(envExamplePath)) {
        const envContent = fs.readFileSync(envExamplePath, 'utf-8');
        expect(envContent).toContain('NEXT_PUBLIC_SUPABASE_URL');
        expect(envContent).toContain('NEXT_PUBLIC_SUPABASE_ANON_KEY');
        expect(envContent).toContain('SUPABASE_SERVICE_ROLE_KEY');
      } else {
        // If no root .env.example, check apps/web
        const webEnvPath = path.join(WEB_APP_PATH, '.env.example');
        expect(fs.existsSync(webEnvPath)).toBe(true);
        const envContent = fs.readFileSync(webEnvPath, 'utf-8');
        expect(envContent).toContain('NEXT_PUBLIC_SUPABASE_URL');
      }
    });
  });
});
