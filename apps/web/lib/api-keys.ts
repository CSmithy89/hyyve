import 'server-only';

import { createHash, randomBytes } from 'crypto';
import { type ApiKeyEnvironment } from '@/lib/validations/api-keys';

const KEY_PREFIXES: Record<ApiKeyEnvironment, string> = {
  development: 'ak_dev_',
  staging: 'ak_stg_',
  production: 'ak_live_',
};

export function generateApiKey(environment: ApiKeyEnvironment) {
  const environmentPrefix = KEY_PREFIXES[environment];
  const randomPart = randomBytes(24).toString('base64url');
  const fullKey = `${environmentPrefix}${randomPart}`;
  const keyPrefix = fullKey.slice(0, 12);
  const keyHash = createHash('sha256').update(fullKey).digest('hex');

  return {
    fullKey,
    keyHash,
    keyPrefix,
  };
}
