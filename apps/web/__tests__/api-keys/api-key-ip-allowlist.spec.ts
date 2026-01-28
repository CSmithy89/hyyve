/**
 * Story 1.2.4: Enterprise IP Allowlisting - ATDD Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const WEB_APP_PATH = path.resolve(__dirname, '..', '..');

describe('Story 1.2.4: Enterprise IP Allowlisting', () => {
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

    it('renders IP restrictions input', () => {
      expect(apiKeysContent).toMatch(/ip restrictions|allowed ips/i);
      expect(apiKeysContent).toMatch(/ipv4|ipv6/i);
    });
  });

  describe('API enforcement', () => {
    it('returns 403 for non-allowed IPs', () => {
      const filePath = path.join(WEB_APP_PATH, 'app/api-key-test/route.ts');
      const content = fs.existsSync(filePath)
        ? fs.readFileSync(filePath, 'utf-8')
        : '';

      expect(content).toMatch(/IP not allowed/i);
      expect(content).toMatch(/status:\s*403/i);
    });
  });
});
