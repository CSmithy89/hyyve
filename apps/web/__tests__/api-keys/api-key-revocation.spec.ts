/**
 * Story 1.2.8: API Key Revocation - ATDD Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const WEB_APP_PATH = path.resolve(__dirname, '..', '..');

describe('Story 1.2.8: API Key Revocation', () => {
  describe('UI revoke action', () => {
    let apiKeysContent = '';

    beforeEach(() => {
      const filePath = path.join(
        WEB_APP_PATH,
        'components/settings/ApiKeysSection.tsx'
      );
      apiKeysContent = fs.existsSync(filePath)
        ? fs.readFileSync(filePath, 'utf-8')
        : '';
    });

    it('renders revoke key action', () => {
      expect(apiKeysContent).toMatch(/revoke key/i);
    });
  });

  describe('Revocation API', () => {
    it('implements revoke endpoint that records revoked_at', () => {
      const filePath = path.join(
        WEB_APP_PATH,
        'app/api-keys/[id]/revoke/route.ts'
      );
      const content = fs.existsSync(filePath)
        ? fs.readFileSync(filePath, 'utf-8')
        : '';

      expect(content).toMatch(/revoked_at/i);
    });
  });
});
