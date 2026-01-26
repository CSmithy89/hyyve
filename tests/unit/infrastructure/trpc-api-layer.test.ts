import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Story 0.1.7: Configure tRPC API Layer
 *
 * ATDD Tests for tRPC API Layer Configuration
 *
 * These tests validate the acceptance criteria for:
 * - AC1: tRPC Packages Installed
 * - AC2: tRPC Router Configuration
 * - AC3: App Router Integration
 * - AC4: Protected Procedure with Clerk Auth
 * - AC5: React Query Provider Configuration
 * - AC6: Client Hooks Work
 *
 * @see _bmad-output/implementation-artifacts/story-0-1-7-configure-trpc-api-layer.md
 */

const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..');
const WEB_APP_PATH = path.join(PROJECT_ROOT, 'apps', 'web');

describe('Story 0.1.7: Configure tRPC API Layer', () => {
  describe('AC1: tRPC Packages Installed', () => {
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

    it('should have @trpc/server installed', () => {
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      expect(deps['@trpc/server']).toBeDefined();
    });

    it('should have @trpc/server version 11.x', () => {
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      expect(deps['@trpc/server']).toMatch(/^[\^~]?11\./);
    });

    it('should have @trpc/client installed', () => {
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      expect(deps['@trpc/client']).toBeDefined();
    });

    it('should have @trpc/client version 11.x', () => {
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      expect(deps['@trpc/client']).toMatch(/^[\^~]?11\./);
    });

    it('should have @trpc/react-query installed', () => {
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      expect(deps['@trpc/react-query']).toBeDefined();
    });

    it('should have @trpc/react-query version 11.x', () => {
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      expect(deps['@trpc/react-query']).toMatch(/^[\^~]?11\./);
    });

    it('should have @tanstack/react-query installed', () => {
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      expect(deps['@tanstack/react-query']).toBeDefined();
    });

    it('should have superjson installed for serialization', () => {
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      expect(deps['superjson']).toBeDefined();
    });
  });

  describe('AC2: tRPC Router Configuration', () => {
    it('should have server.ts file', () => {
      const serverPath = path.join(WEB_APP_PATH, 'lib', 'trpc', 'server.ts');
      expect(fs.existsSync(serverPath)).toBe(true);
    });

    it('should have index.ts barrel export', () => {
      const indexPath = path.join(WEB_APP_PATH, 'lib', 'trpc', 'index.ts');
      expect(fs.existsSync(indexPath)).toBe(true);
    });

    describe('server.ts content', () => {
      let serverContent: string;

      beforeAll(() => {
        const serverPath = path.join(WEB_APP_PATH, 'lib', 'trpc', 'server.ts');
        if (fs.existsSync(serverPath)) {
          serverContent = fs.readFileSync(serverPath, 'utf-8');
        } else {
          serverContent = '';
        }
      });

      it('should import initTRPC from @trpc/server', () => {
        expect(serverContent).toContain('@trpc/server');
        expect(serverContent).toContain('initTRPC');
      });

      it('should configure superjson transformer', () => {
        expect(serverContent).toContain('superjson');
      });

      it('should export router', () => {
        expect(serverContent).toMatch(/export\s+(const|function)\s+router/);
      });

      it('should export publicProcedure', () => {
        expect(serverContent).toContain('publicProcedure');
      });

      it('should export protectedProcedure', () => {
        expect(serverContent).toContain('protectedProcedure');
      });
    });
  });

  describe('AC3: App Router Integration', () => {
    it('should have route handler directory', () => {
      const routeDir = path.join(WEB_APP_PATH, 'app', 'api', 'trpc', '[trpc]');
      expect(fs.existsSync(routeDir)).toBe(true);
    });

    it('should have route.ts file', () => {
      const routePath = path.join(
        WEB_APP_PATH,
        'app',
        'api',
        'trpc',
        '[trpc]',
        'route.ts'
      );
      expect(fs.existsSync(routePath)).toBe(true);
    });

    describe('route.ts content', () => {
      let routeContent: string;

      beforeAll(() => {
        const routePath = path.join(
          WEB_APP_PATH,
          'app',
          'api',
          'trpc',
          '[trpc]',
          'route.ts'
        );
        if (fs.existsSync(routePath)) {
          routeContent = fs.readFileSync(routePath, 'utf-8');
        } else {
          routeContent = '';
        }
      });

      it('should export GET handler', () => {
        expect(routeContent).toMatch(/export\s+(const|async\s+function)\s+GET/);
      });

      it('should export POST handler', () => {
        expect(routeContent).toMatch(/export\s+(const|async\s+function)\s+POST/);
      });
    });
  });

  describe('AC4: Protected Procedure with Clerk Auth', () => {
    let serverContent: string;

    beforeAll(() => {
      const serverPath = path.join(WEB_APP_PATH, 'lib', 'trpc', 'server.ts');
      if (fs.existsSync(serverPath)) {
        serverContent = fs.readFileSync(serverPath, 'utf-8');
      } else {
        serverContent = '';
      }
    });

    it('should import from @platform/auth or @clerk/nextjs', () => {
      const hasAuthImport =
        serverContent.includes('@platform/auth') ||
        serverContent.includes('@clerk/nextjs');
      expect(hasAuthImport).toBe(true);
    });

    it('should create context with db', () => {
      const hasDb =
        serverContent.includes('db') &&
        (serverContent.includes('supabase') ||
          serverContent.includes('createServerSupabaseClient') ||
          serverContent.includes('@platform/db'));
      expect(hasDb).toBe(true);
    });

    it('should create context with user or session', () => {
      const hasUserContext =
        serverContent.includes('user') ||
        serverContent.includes('session') ||
        serverContent.includes('auth');
      expect(hasUserContext).toBe(true);
    });

    it('should throw UNAUTHORIZED for unauthenticated requests', () => {
      expect(serverContent).toContain('UNAUTHORIZED');
    });
  });

  describe('AC5: React Query Provider Configuration', () => {
    it('should have provider.tsx file', () => {
      const providerPath = path.join(WEB_APP_PATH, 'lib', 'trpc', 'provider.tsx');
      expect(fs.existsSync(providerPath)).toBe(true);
    });

    describe('provider.tsx content', () => {
      let providerContent: string;

      beforeAll(() => {
        const providerPath = path.join(WEB_APP_PATH, 'lib', 'trpc', 'provider.tsx');
        if (fs.existsSync(providerPath)) {
          providerContent = fs.readFileSync(providerPath, 'utf-8');
        } else {
          providerContent = '';
        }
      });

      it('should have "use client" directive', () => {
        expect(providerContent).toContain("'use client'");
      });

      it('should import QueryClientProvider from @tanstack/react-query', () => {
        expect(providerContent).toContain('@tanstack/react-query');
        expect(providerContent).toContain('QueryClientProvider');
      });

      it('should create QueryClient', () => {
        expect(providerContent).toContain('QueryClient');
      });

      it('should configure httpBatchLink or similar', () => {
        const hasLink =
          providerContent.includes('httpBatchLink') ||
          providerContent.includes('httpLink') ||
          providerContent.includes('link');
        expect(hasLink).toBe(true);
      });

      it('should export TRPCProvider component', () => {
        expect(providerContent).toMatch(
          /export\s+(function|const)\s+TRPCProvider/
        );
      });
    });

    describe('providers.tsx integration', () => {
      let providersContent: string;

      beforeAll(() => {
        const providersPath = path.join(WEB_APP_PATH, 'app', 'providers.tsx');
        if (fs.existsSync(providersPath)) {
          providersContent = fs.readFileSync(providersPath, 'utf-8');
        } else {
          providersContent = '';
        }
      });

      it('should import TRPCProvider', () => {
        expect(providersContent).toContain('TRPCProvider');
      });

      it('should wrap children with TRPCProvider', () => {
        expect(providersContent).toContain('<TRPCProvider');
      });
    });
  });

  describe('AC6: Client Hooks Work', () => {
    it('should have client.ts file', () => {
      const clientPath = path.join(WEB_APP_PATH, 'lib', 'trpc', 'client.ts');
      expect(fs.existsSync(clientPath)).toBe(true);
    });

    describe('client.ts content', () => {
      let clientContent: string;

      beforeAll(() => {
        const clientPath = path.join(WEB_APP_PATH, 'lib', 'trpc', 'client.ts');
        if (fs.existsSync(clientPath)) {
          clientContent = fs.readFileSync(clientPath, 'utf-8');
        } else {
          clientContent = '';
        }
      });

      it('should import createTRPCReact from @trpc/react-query', () => {
        expect(clientContent).toContain('@trpc/react-query');
        expect(clientContent).toContain('createTRPCReact');
      });

      it('should export trpc client', () => {
        expect(clientContent).toMatch(/export\s+(const|let)\s+trpc/);
      });

      it('should type client with AppRouter', () => {
        expect(clientContent).toContain('AppRouter');
      });
    });
  });

  describe('Router Structure', () => {
    it('should have routers directory', () => {
      const routersDir = path.join(WEB_APP_PATH, 'lib', 'trpc', 'routers');
      expect(fs.existsSync(routersDir)).toBe(true);
    });

    it('should have routers/index.ts', () => {
      const routersIndexPath = path.join(
        WEB_APP_PATH,
        'lib',
        'trpc',
        'routers',
        'index.ts'
      );
      expect(fs.existsSync(routersIndexPath)).toBe(true);
    });

    describe('routers/index.ts content', () => {
      let routersContent: string;

      beforeAll(() => {
        const routersIndexPath = path.join(
          WEB_APP_PATH,
          'lib',
          'trpc',
          'routers',
          'index.ts'
        );
        if (fs.existsSync(routersIndexPath)) {
          routersContent = fs.readFileSync(routersIndexPath, 'utf-8');
        } else {
          routersContent = '';
        }
      });

      it('should export appRouter', () => {
        expect(routersContent).toMatch(/export\s+(const|type)\s+.*[Aa]ppRouter/);
      });

      it('should export AppRouter type', () => {
        expect(routersContent).toContain('AppRouter');
      });
    });
  });
});
