/**
 * Story 1.2.9: API Key Usage Analytics - ATDD Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');
const MIGRATIONS_PATH = path.join(process.cwd(), 'supabase/migrations');

describe('Story 1.2.9: API Key Usage Analytics', () => {
  describe('Analytics UI', () => {
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

    it('renders usage metrics and analytics sections', () => {
      expect(apiKeysContent).toMatch(/requests today/i);
      expect(apiKeysContent).toMatch(/requests this month/i);
      expect(apiKeysContent).toMatch(/usage trend/i);
      expect(apiKeysContent).toMatch(/top endpoints/i);
      expect(apiKeysContent).toMatch(/error rate/i);
      expect(apiKeysContent).toMatch(/average response time|avg response time/i);
    });
  });

  describe('Usage table migration', () => {
    it('creates the api_key_usage table', () => {
      const migrationFiles = fs.existsSync(MIGRATIONS_PATH)
        ? fs.readdirSync(MIGRATIONS_PATH)
        : [];
      const usageMigration = migrationFiles.find((file) =>
        file.includes('api_key_usage')
      );

      const migrationPath = usageMigration
        ? path.join(MIGRATIONS_PATH, usageMigration)
        : '';
      const content = usageMigration && fs.existsSync(migrationPath)
        ? fs.readFileSync(migrationPath, 'utf-8')
        : '';

      expect(content).toMatch(/api_key_usage/i);
    });
  });
});
