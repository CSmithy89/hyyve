import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Story 0.1.6: Configure Clerk Authentication
 *
 * ATDD Tests for Clerk Authentication Configuration
 *
 * These tests validate the acceptance criteria for:
 * - AC1: Clerk Package Installed (@clerk/nextjs@6.x)
 * - AC2: ClerkProvider Wraps Application
 * - AC3: Middleware Protects Routes
 * - AC4: Server Components Auth (auth() helper)
 * - AC5: Client Components Hooks (useUser, useAuth)
 * - AC6: Sign-In/Sign-Up Pages
 * - AC7: Clerk + Supabase Integration
 *
 * @see _bmad-output/implementation-artifacts/story-0-1-6-configure-clerk-authentication.md
 */

const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..');
const AUTH_PACKAGE_PATH = path.join(PROJECT_ROOT, 'packages', '@platform', 'auth');
const WEB_APP_PATH = path.join(PROJECT_ROOT, 'apps', 'web');

describe('Story 0.1.6: Configure Clerk Authentication', () => {
  describe('AC1: Clerk Package Installed', () => {
    let authPackageJson: {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      [key: string]: unknown;
    };

    beforeAll(() => {
      const packagePath = path.join(AUTH_PACKAGE_PATH, 'package.json');
      const content = fs.readFileSync(packagePath, 'utf-8');
      authPackageJson = JSON.parse(content);
    });

    it('should have @clerk/nextjs installed', () => {
      const deps = { ...authPackageJson.dependencies, ...authPackageJson.devDependencies };
      expect(deps['@clerk/nextjs']).toBeDefined();
    });

    it('should have @clerk/nextjs version 6.x or higher', () => {
      const deps = { ...authPackageJson.dependencies, ...authPackageJson.devDependencies };
      // Match 6.x.x, ^6.x.x, ~6.x.x, or >=6.x
      expect(deps['@clerk/nextjs']).toMatch(/^[\^~]?6\.|>=6/);
    });
  });

  describe('AC2: ClerkProvider Wraps Application', () => {
    let layoutContent: string;
    let providersContent: string;

    beforeAll(() => {
      const layoutPath = path.join(WEB_APP_PATH, 'app', 'layout.tsx');
      const providersPath = path.join(WEB_APP_PATH, 'app', 'providers.tsx');
      layoutContent = fs.readFileSync(layoutPath, 'utf-8');
      if (fs.existsSync(providersPath)) {
        providersContent = fs.readFileSync(providersPath, 'utf-8');
      } else {
        providersContent = '';
      }
    });

    it('should have Providers component or ClerkProvider in layout', () => {
      const hasProviders = layoutContent.includes('Providers');
      const hasClerkProvider = layoutContent.includes('ClerkProvider');
      expect(hasProviders || hasClerkProvider).toBe(true);
    });

    it('should have ClerkProvider in providers.tsx or layout.tsx', () => {
      const inProviders = providersContent.includes('ClerkProvider');
      const inLayout = layoutContent.includes('ClerkProvider');
      expect(inProviders || inLayout).toBe(true);
    });

    it('should import from @clerk/nextjs or @platform/auth', () => {
      const combined = layoutContent + providersContent;
      const hasClerkImport =
        combined.includes("from '@clerk/nextjs'") ||
        combined.includes("from '@platform/auth'");
      expect(hasClerkImport).toBe(true);
    });

    it('should wrap children with ClerkProvider or Providers', () => {
      const combined = layoutContent + providersContent;
      const hasWrapper =
        combined.includes('<ClerkProvider') || combined.includes('<Providers');
      expect(hasWrapper).toBe(true);
    });
  });

  describe('AC3: Middleware Protects Routes', () => {
    let middlewareContent: string;

    beforeAll(() => {
      const middlewarePath = path.join(WEB_APP_PATH, 'middleware.ts');
      middlewareContent = fs.readFileSync(middlewarePath, 'utf-8');
    });

    it('should import clerkMiddleware', () => {
      expect(middlewareContent).toContain('clerkMiddleware');
    });

    it('should import from @clerk/nextjs/server', () => {
      expect(middlewareContent).toContain('@clerk/nextjs/server');
    });

    it('should define public routes', () => {
      const hasPublicRoutes =
        middlewareContent.includes('isPublicRoute') ||
        middlewareContent.includes('publicRoutes') ||
        middlewareContent.includes('createRouteMatcher');
      expect(hasPublicRoutes).toBe(true);
    });

    it('should export middleware as default', () => {
      expect(middlewareContent).toMatch(/export\s+default\s+clerkMiddleware/);
    });
  });

  describe('AC4: Server Components Auth', () => {
    describe('auth package exports server utilities', () => {
      let authServerContent: string;

      beforeAll(() => {
        const serverPath = path.join(AUTH_PACKAGE_PATH, 'src', 'server.ts');

        if (fs.existsSync(serverPath)) {
          authServerContent = fs.readFileSync(serverPath, 'utf-8');
        } else {
          authServerContent = '';
        }
      });

      it('should have server.ts file', () => {
        const serverPath = path.join(AUTH_PACKAGE_PATH, 'src', 'server.ts');
        expect(fs.existsSync(serverPath)).toBe(true);
      });

      it('should export auth from @clerk/nextjs/server', () => {
        expect(authServerContent).toContain('@clerk/nextjs/server');
        expect(authServerContent).toContain('auth');
      });

      it('should export currentUser from @clerk/nextjs/server', () => {
        expect(authServerContent).toContain('currentUser');
      });
    });
  });

  describe('AC5: Client Components Hooks', () => {
    let authIndexContent: string;

    beforeAll(() => {
      const indexPath = path.join(AUTH_PACKAGE_PATH, 'src', 'index.ts');
      authIndexContent = fs.readFileSync(indexPath, 'utf-8');
    });

    it('should export useUser hook', () => {
      expect(authIndexContent).toContain('useUser');
    });

    it('should export useAuth hook', () => {
      expect(authIndexContent).toContain('useAuth');
    });

    it('should export ClerkProvider', () => {
      expect(authIndexContent).toContain('ClerkProvider');
    });

    it('should export UserButton', () => {
      expect(authIndexContent).toContain('UserButton');
    });

    it('should export SignedIn and SignedOut', () => {
      expect(authIndexContent).toContain('SignedIn');
      expect(authIndexContent).toContain('SignedOut');
    });
  });

  describe('AC6: Sign-In/Sign-Up Pages', () => {
    it('should have sign-in page directory', () => {
      const signInPath = path.join(WEB_APP_PATH, 'app', 'sign-in');
      expect(fs.existsSync(signInPath)).toBe(true);
    });

    it('should have sign-in catch-all page', () => {
      const signInPagePath = path.join(
        WEB_APP_PATH,
        'app',
        'sign-in',
        '[[...sign-in]]',
        'page.tsx'
      );
      expect(fs.existsSync(signInPagePath)).toBe(true);
    });

    it('should have sign-up page directory', () => {
      const signUpPath = path.join(WEB_APP_PATH, 'app', 'sign-up');
      expect(fs.existsSync(signUpPath)).toBe(true);
    });

    it('should have sign-up catch-all page', () => {
      const signUpPagePath = path.join(
        WEB_APP_PATH,
        'app',
        'sign-up',
        '[[...sign-up]]',
        'page.tsx'
      );
      expect(fs.existsSync(signUpPagePath)).toBe(true);
    });

    describe('sign-in page content', () => {
      let signInContent: string;

      beforeAll(() => {
        const signInPagePath = path.join(
          WEB_APP_PATH,
          'app',
          'sign-in',
          '[[...sign-in]]',
          'page.tsx'
        );
        if (fs.existsSync(signInPagePath)) {
          signInContent = fs.readFileSync(signInPagePath, 'utf-8');
        } else {
          signInContent = '';
        }
      });

      it('should use SignIn component', () => {
        expect(signInContent).toContain('SignIn');
      });
    });

    describe('sign-up page content', () => {
      let signUpContent: string;

      beforeAll(() => {
        const signUpPagePath = path.join(
          WEB_APP_PATH,
          'app',
          'sign-up',
          '[[...sign-up]]',
          'page.tsx'
        );
        if (fs.existsSync(signUpPagePath)) {
          signUpContent = fs.readFileSync(signUpPagePath, 'utf-8');
        } else {
          signUpContent = '';
        }
      });

      it('should use SignUp component', () => {
        expect(signUpContent).toContain('SignUp');
      });
    });
  });

  describe('AC7: Clerk + Supabase Integration', () => {
    describe('supabase integration file', () => {
      let supabaseContent: string;

      beforeAll(() => {
        const supabasePath = path.join(AUTH_PACKAGE_PATH, 'src', 'supabase.ts');
        if (fs.existsSync(supabasePath)) {
          supabaseContent = fs.readFileSync(supabasePath, 'utf-8');
        } else {
          supabaseContent = '';
        }
      });

      it('should have supabase.ts file', () => {
        const supabasePath = path.join(AUTH_PACKAGE_PATH, 'src', 'supabase.ts');
        expect(fs.existsSync(supabasePath)).toBe(true);
      });

      it('should import auth from @clerk/nextjs/server', () => {
        expect(supabaseContent).toContain('@clerk/nextjs/server');
      });

      it('should use getToken with supabase template', () => {
        expect(supabaseContent).toContain('getToken');
        expect(supabaseContent).toContain('supabase');
      });

      it('should export a function to create Clerk-authenticated Supabase client', () => {
        expect(supabaseContent).toMatch(
          /export\s+(async\s+)?function\s+\w*(Supabase|supabase)\w*/
        );
      });
    });
  });

  describe('Environment Variables Documentation', () => {
    it('should have Clerk env vars in .env.example', () => {
      const envExamplePath = path.join(PROJECT_ROOT, '.env.example');
      const envContent = fs.readFileSync(envExamplePath, 'utf-8');

      expect(envContent).toContain('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');
      expect(envContent).toContain('CLERK_SECRET_KEY');
    });

    it('should have Clerk sign-in/sign-up URLs in .env.example', () => {
      const envExamplePath = path.join(PROJECT_ROOT, '.env.example');
      const envContent = fs.readFileSync(envExamplePath, 'utf-8');

      expect(envContent).toContain('NEXT_PUBLIC_CLERK_SIGN_IN_URL');
      expect(envContent).toContain('NEXT_PUBLIC_CLERK_SIGN_UP_URL');
    });
  });

  describe('Package Exports', () => {
    let packageJson: {
      exports?: Record<string, unknown>;
      [key: string]: unknown;
    };

    beforeAll(() => {
      const packagePath = path.join(AUTH_PACKAGE_PATH, 'package.json');
      const content = fs.readFileSync(packagePath, 'utf-8');
      packageJson = JSON.parse(content);
    });

    it('should have server export path', () => {
      expect(packageJson.exports).toHaveProperty('./server');
    });

    it('should have supabase export path', () => {
      expect(packageJson.exports).toHaveProperty('./supabase');
    });
  });
});
