/**
 * Story 1.2.2: API Key Environment Configuration - ATDD Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const WEB_APP_PATH = path.resolve(__dirname, '..', '..');

describe('Story 1.2.2: API Key Environment Configuration', () => {
  describe('API key cards display environment', () => {
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

    it('renders environment badge on key cards', () => {
      expect(apiKeysContent).toMatch(/data-testid="api-key-environment"/i);
    });
  });
});
