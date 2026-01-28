/**
 * Story 1.2.10: API Key Expiration Management - ATDD Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

describe('Story 1.2.10: API Key Expiration Management', () => {
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

  it('flags expired keys in the listing', () => {
    expect(apiKeysContent).toMatch(/expired/i);
  });

  it('shows notifications for keys expiring soon', () => {
    expect(apiKeysContent).toMatch(/expires in|expiring in|expiration alert/i);
  });
});
