/**
 * Story 1.2.6: API Key Listing & Management - ATDD Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const WEB_APP_PATH = path.resolve(__dirname, '..', '..');

describe('Story 1.2.6: API Key Listing & Management', () => {
  describe('Listing fields', () => {
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

    it('renders created and last used metadata', () => {
      expect(apiKeysContent).toMatch(/Created on/i);
      expect(apiKeysContent).toMatch(/Last used/i);
    });
  });

  describe('Search and filters', () => {
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

    it('renders search input for key name', () => {
      expect(apiKeysContent).toMatch(/search keys/i);
    });

    it('renders environment and status filters', () => {
      expect(apiKeysContent).toMatch(/filter by environment/i);
      expect(apiKeysContent).toMatch(/filter by status/i);
    });
  });
});
