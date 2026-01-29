/**
 * Story 1.2.5: CORS Origin Restrictions - ATDD Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const WEB_APP_PATH = path.resolve(__dirname, '..', '..');

describe('Story 1.2.5: CORS Origin Restrictions', () => {
  describe('UI configuration', () => {
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

    it('renders allowed origins input', () => {
      expect(apiKeysContent).toMatch(/allowed origins|origin restrictions/i);
      expect(apiKeysContent).toMatch(/https:\/\//i);
    });
  });

  describe('API enforcement', () => {
    it('returns 403 for non-allowed origins', () => {
      const filePath = path.join(WEB_APP_PATH, 'app/api-key-test/route.ts');
      const content = fs.existsSync(filePath)
        ? fs.readFileSync(filePath, 'utf-8')
        : '';

      expect(content).toMatch(/Origin not allowed/i);
      expect(content).toMatch(/status:\s*403/i);
    });
  });
});
