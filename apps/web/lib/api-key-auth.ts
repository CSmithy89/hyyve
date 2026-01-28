import 'server-only';

import { createHash } from 'crypto';
import { createAdminClient } from '@platform/db/server';
import { checkRateLimitSimple } from '@platform/db';

export interface ApiKeyRecord {
  id: string;
  organization_id: string;
  scopes: string[];
  rate_limit_per_minute: number;
  rate_limit_per_day: number;
  allowed_ips: string[];
  expires_at: string | null;
  revoked_at: string | null;
}

export async function validateApiKey(fullKey: string) {
  const keyHash = createHash('sha256').update(fullKey).digest('hex');
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('api_keys')
    .select(
      'id, organization_id, scopes, rate_limit_per_minute, rate_limit_per_day, allowed_ips, expires_at, revoked_at'
    )
    .eq('key_hash', keyHash)
    .maybeSingle();

  const record = data as ApiKeyRecord | null;

  if (error || !record) {
    return null;
  }

  if (record.revoked_at) {
    return null;
  }

  if (record.expires_at && new Date(record.expires_at) <= new Date()) {
    return null;
  }

  return record;
}

export async function enforceApiKeyRateLimit(apiKey: ApiKeyRecord) {
  const minuteLimit = apiKey.rate_limit_per_minute ?? 60;
  const dayLimit = apiKey.rate_limit_per_day ?? 10000;

  const minuteResult = await checkRateLimitSimple(
    `rate_limit:${apiKey.id}:minute`,
    minuteLimit,
    60
  );
  const dayResult = await checkRateLimitSimple(
    `rate_limit:${apiKey.id}:day`,
    dayLimit,
    60 * 60 * 24
  );

  const allowed = minuteResult.allowed && dayResult.allowed;
  const remaining = Math.min(minuteResult.remaining, dayResult.remaining);
  const resetInSeconds = Math.min(
    minuteResult.resetInSeconds,
    dayResult.resetInSeconds
  );

  return {
    allowed,
    headers: {
      'X-RateLimit-Limit': `${minuteLimit}`,
      'X-RateLimit-Remaining': `${remaining}`,
      'X-RateLimit-Reset': `${resetInSeconds}`,
    },
  };
}

export function isIpAllowed(apiKey: ApiKeyRecord, ipAddress: string | null) {
  const allowlist = apiKey.allowed_ips ?? [];

  if (allowlist.length === 0) {
    return true;
  }

  if (!ipAddress) {
    return false;
  }

  return allowlist.includes(ipAddress);
}
