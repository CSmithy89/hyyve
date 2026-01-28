/**
 * Story 1.2.3: API Key Rate Limiting - ATDD Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

describe('Story 1.2.3: API Key Rate Limiting', () => {
  describe('UI configuration', () => {
    let apiKeysContent = '';

    beforeEach(() => {
      const filePath = path.join(
        WEB_APP_PATH,
        'components/settings/ApiKeysSection.tsx'
      );
      if (fs.existsSync(filePath)) {
        apiKeysContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('renders rate limit inputs for minute and day', () => {
      expect(apiKeysContent).toMatch(/requests per minute/i);
      expect(apiKeysContent).toMatch(/requests per day/i);
    });

    it('renders rate limit display on key cards', () => {
      expect(apiKeysContent).toMatch(/req\/min|requests per minute/i);
    });
  });

  describe('API rate limit headers', () => {
    it('sets X-RateLimit headers when limits are enforced', () => {
      const authPath = path.join(WEB_APP_PATH, 'lib/api-key-auth.ts');
      const routePath = path.join(WEB_APP_PATH, 'app/api-key-test/route.ts');
      const authContent = fs.existsSync(authPath)
        ? fs.readFileSync(authPath, 'utf-8')
        : '';
      const routeContent = fs.existsSync(routePath)
        ? fs.readFileSync(routePath, 'utf-8')
        : '';

      expect(authContent).toMatch(/X-RateLimit-Limit/i);
      expect(authContent).toMatch(/X-RateLimit-Remaining/i);
      expect(authContent).toMatch(/X-RateLimit-Reset/i);
      expect(routeContent).toMatch(/429/);
    });
  });
});
