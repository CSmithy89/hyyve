/**
 * Story 1.2.1: API Key Creation with Scopes - ATDD Tests
 *
 * These tests assert required UI fields and server-side key generation logic.
 * They are expected to fail until the story is implemented.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const WEB_APP_PATH = path.resolve(__dirname, '..', '..');

describe('Story 1.2.1: API Key Creation with Scopes', () => {
  describe('UI requirements (ApiKeysSection)', () => {
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

    it('includes environment choices (Development, Staging, Production)', () => {
      expect(apiKeysContent).toMatch(/Development/i);
      expect(apiKeysContent).toMatch(/Staging/i);
      expect(apiKeysContent).toMatch(/Production/i);
    });

    it('includes expiration controls (never or N days)', () => {
      expect(apiKeysContent).toMatch(/expire|expiration|days?/i);
    });

    it('includes scope selections for chatbot, module, voice, analytics, webhook', () => {
      expect(apiKeysContent).toMatch(/chatbot/i);
      expect(apiKeysContent).toMatch(/module/i);
      expect(apiKeysContent).toMatch(/voice/i);
      expect(apiKeysContent).toMatch(/analytics/i);
      expect(apiKeysContent).toMatch(/webhook/i);
    });
  });

  describe('Server-side key generation utility', () => {
    it('has a dedicated api-keys utility module', () => {
      const filePath = path.join(WEB_APP_PATH, 'lib/api-keys.ts');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('uses randomBytes and sha256 hashing with ak_* prefixes', () => {
      const filePath = path.join(WEB_APP_PATH, 'lib/api-keys.ts');
      const content = fs.existsSync(filePath)
        ? fs.readFileSync(filePath, 'utf-8')
        : '';

      expect(content).toMatch(/randomBytes\(24\)/i);
      expect(content).toMatch(/sha256/i);
      expect(content).toMatch(/ak_dev_/i);
      expect(content).toMatch(/ak_stg_/i);
      expect(content).toMatch(/ak_live_/i);
    });
  });
});
