/**
 * ATDD Tests for Story 0.1.13: Configure Environment Variables & Secrets
 *
 * These tests verify that environment variable management is properly configured
 * with Zod validation and proper client/server separation.
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const ROOT_DIR = path.resolve(__dirname, '../../..');
const WEB_DIR = path.join(ROOT_DIR, 'apps/web');

describe('Story 0.1.13: Configure Environment Variables & Secrets', () => {
  describe('AC1: Environment Example File', () => {
    it('should have .env.example at project root', () => {
      const envExamplePath = path.join(ROOT_DIR, '.env.example');
      expect(fs.existsSync(envExamplePath)).toBe(true);
    });

    it('should document Supabase variables', () => {
      const content = fs.readFileSync(
        path.join(ROOT_DIR, '.env.example'),
        'utf-8'
      );

      expect(content).toContain('NEXT_PUBLIC_SUPABASE_URL');
      expect(content).toContain('NEXT_PUBLIC_SUPABASE_ANON_KEY');
      expect(content).toContain('SUPABASE_SERVICE_ROLE_KEY');
    });

    it('should document Clerk variables', () => {
      const content = fs.readFileSync(
        path.join(ROOT_DIR, '.env.example'),
        'utf-8'
      );

      expect(content).toContain('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');
      expect(content).toContain('CLERK_SECRET_KEY');
      expect(content).toContain('CLERK_WEBHOOK_SECRET');
    });

    it('should document Redis variables', () => {
      const content = fs.readFileSync(
        path.join(ROOT_DIR, '.env.example'),
        'utf-8'
      );

      expect(content).toContain('REDIS_URL');
    });

    it('should document Stripe variables', () => {
      const content = fs.readFileSync(
        path.join(ROOT_DIR, '.env.example'),
        'utf-8'
      );

      expect(content).toContain('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
      expect(content).toContain('STRIPE_SECRET_KEY');
      expect(content).toContain('STRIPE_WEBHOOK_SECRET');
    });

    it('should document Langfuse variables', () => {
      const content = fs.readFileSync(
        path.join(ROOT_DIR, '.env.example'),
        'utf-8'
      );

      expect(content).toContain('LANGFUSE_PUBLIC_KEY');
      expect(content).toContain('LANGFUSE_SECRET_KEY');
      expect(content).toContain('LANGFUSE_HOST');
    });

    it('should document App URL variable', () => {
      const content = fs.readFileSync(
        path.join(ROOT_DIR, '.env.example'),
        'utf-8'
      );

      expect(content).toContain('NEXT_PUBLIC_APP_URL');
    });
  });

  describe('AC2: Environment Validation', () => {
    it('should have lib/env.ts in apps/web', () => {
      const envPath = path.join(WEB_DIR, 'lib/env.ts');
      expect(fs.existsSync(envPath)).toBe(true);
    });

    it('should import zod in env.ts', () => {
      const envPath = path.join(WEB_DIR, 'lib/env.ts');
      const content = fs.readFileSync(envPath, 'utf-8');

      expect(content).toContain('import');
      expect(content).toContain('zod');
    });

    it('should define server schema', () => {
      const envPath = path.join(WEB_DIR, 'lib/env.ts');
      const content = fs.readFileSync(envPath, 'utf-8');

      expect(content).toContain('serverSchema');
      expect(content).toContain('z.object');
    });

    it('should define client schema', () => {
      const envPath = path.join(WEB_DIR, 'lib/env.ts');
      const content = fs.readFileSync(envPath, 'utf-8');

      expect(content).toContain('clientSchema');
    });

    it('should export serverEnv', () => {
      const envPath = path.join(WEB_DIR, 'lib/env.ts');
      const content = fs.readFileSync(envPath, 'utf-8');

      expect(content).toContain('export');
      expect(content).toContain('serverEnv');
    });

    it('should export clientEnv', () => {
      const envPath = path.join(WEB_DIR, 'lib/env.ts');
      const content = fs.readFileSync(envPath, 'utf-8');

      expect(content).toContain('export');
      expect(content).toContain('clientEnv');
    });
  });

  describe('AC3: Client/Server Separation', () => {
    it('should have server-only variables in serverSchema', () => {
      const envPath = path.join(WEB_DIR, 'lib/env.ts');
      const content = fs.readFileSync(envPath, 'utf-8');

      // Server-only variables should NOT start with NEXT_PUBLIC_
      expect(content).toMatch(/serverSchema.*SUPABASE_SERVICE_ROLE_KEY/s);
      expect(content).toMatch(/serverSchema.*CLERK_SECRET_KEY/s);
      expect(content).toMatch(/serverSchema.*STRIPE_SECRET_KEY/s);
    });

    it('should have client-safe variables in clientSchema', () => {
      const envPath = path.join(WEB_DIR, 'lib/env.ts');
      const content = fs.readFileSync(envPath, 'utf-8');

      // Client variables should start with NEXT_PUBLIC_
      expect(content).toMatch(/clientSchema.*NEXT_PUBLIC_SUPABASE_URL/s);
      expect(content).toMatch(/clientSchema.*NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY/s);
      expect(content).toMatch(/clientSchema.*NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY/s);
    });
  });

  describe('AC4: Git Ignore Configuration', () => {
    it('should ignore .env', () => {
      const gitignorePath = path.join(ROOT_DIR, '.gitignore');
      const content = fs.readFileSync(gitignorePath, 'utf-8');

      expect(content).toMatch(/^\.env$/m);
    });

    it('should ignore .env.local', () => {
      const gitignorePath = path.join(ROOT_DIR, '.gitignore');
      const content = fs.readFileSync(gitignorePath, 'utf-8');

      expect(content).toContain('.env.local');
    });

    it('should ignore .env*.local patterns', () => {
      const gitignorePath = path.join(ROOT_DIR, '.gitignore');
      const content = fs.readFileSync(gitignorePath, 'utf-8');

      // Should match patterns like .env.test.local or .env.*.local
      expect(content).toMatch(/\.env\.\*\.local|\.env\.test\.local/);
    });

    it('should NOT ignore .env.example', () => {
      const gitignorePath = path.join(ROOT_DIR, '.gitignore');
      const content = fs.readFileSync(gitignorePath, 'utf-8');

      // .env.example should not be in gitignore
      expect(content).not.toContain('.env.example');
    });
  });
});
