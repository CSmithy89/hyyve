/**
 * Story 1.2.7: API Key Rotation - ATDD Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

describe('Story 1.2.7: API Key Rotation', () => {
  describe('UI rotation action', () => {
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

    it('renders rotate key action and grace period control', () => {
      expect(apiKeysContent).toMatch(/rotate key/i);
      expect(apiKeysContent).toMatch(/grace period/i);
    });
  });

  describe('Rotation API', () => {
    it('implements rotation endpoint with grace period handling', () => {
      const filePath = path.join(
        WEB_APP_PATH,
        'app/api-keys/[id]/rotate/route.ts'
      );
      const content = fs.existsSync(filePath)
        ? fs.readFileSync(filePath, 'utf-8')
        : '';

      expect(content).toMatch(/grace/i);
      expect(content).toMatch(/expires_at|revoked_at/i);
    });
  });
});
