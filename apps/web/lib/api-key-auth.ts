import 'server-only';

import { createHash } from 'crypto';
import { isIP } from 'net';
import { checkRateLimitSimple, type TablesInsert } from '@platform/db';
import { createAdminClient } from '@platform/db/server';

export interface ApiKeyRecord {
  id: string;
  organization_id: string;
  scopes: string[];
  rate_limit_per_minute: number;
  rate_limit_per_day: number;
  allowed_origins: string[];
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
      'id, organization_id, scopes, rate_limit_per_minute, rate_limit_per_day, allowed_origins, allowed_ips, expires_at, revoked_at'
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
  let resetInSeconds = Math.min(
    minuteResult.resetInSeconds,
    dayResult.resetInSeconds
  );

  if (!allowed) {
    if (!minuteResult.allowed && !dayResult.allowed) {
      resetInSeconds = Math.max(
        minuteResult.resetInSeconds,
        dayResult.resetInSeconds
      );
    } else {
      resetInSeconds = minuteResult.allowed
        ? dayResult.resetInSeconds
        : minuteResult.resetInSeconds;
    }
  }

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

  const normalizedIp = normalizeIp(ipAddress);

  return allowlist.some((entry) => isIpMatch(normalizedIp, entry));
}

function normalizeIp(ip: string) {
  return ip.trim().replace(/^::ffff:/i, '');
}

function isIpv4(ip: string) {
  return isIP(ip) === 4;
}

function ipv4ToInt(ip: string) {
  return ip
    .split('.')
    .map((octet) => Number(octet))
    .reduce((acc, octet) => ((acc << 8) + octet) >>> 0, 0);
}

function isIpInCidr(ip: string, cidr: string) {
  const [base, prefixLength] = cidr.split('/');
  const prefix = Number(prefixLength);

  if (!base || !Number.isInteger(prefix)) {
    return false;
  }

  if (!isIpv4(ip) || !isIpv4(base) || prefix < 0 || prefix > 32) {
    return false;
  }

  const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
  const ipInt = ipv4ToInt(ip);
  const baseInt = ipv4ToInt(base);

  return (ipInt & mask) === (baseInt & mask);
}

function isIpMatch(ipAddress: string, entry: string) {
  const normalizedEntry = normalizeIp(entry);

  if (normalizedEntry.includes('/')) {
    return isIpInCidr(ipAddress, normalizedEntry);
  }

  return ipAddress === normalizedEntry;
}

function normalizeOrigin(origin: string) {
  return origin.trim().replace(/\/$/, '').toLowerCase();
}

export function isOriginAllowed(
  apiKey: ApiKeyRecord,
  originHeader: string | null
) {
  const allowlist = apiKey.allowed_origins ?? [];

  if (allowlist.length === 0) {
    return true;
  }

  if (!originHeader) {
    return false;
  }

  const normalizedOrigin = normalizeOrigin(originHeader);

  return allowlist.some(
    (origin) => normalizeOrigin(origin) === normalizedOrigin
  );
}

export async function logApiKeyUsage(input: {
  apiKeyId: string;
  organizationId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTimeMs: number;
  ipAddress: string | null;
  userAgent: string | null;
}) {
  const supabase = await createAdminClient();

  const payload: TablesInsert<'api_key_usage'> = {
    api_key_id: input.apiKeyId,
    organization_id: input.organizationId,
    endpoint: input.endpoint,
    method: input.method,
    status_code: input.statusCode,
    response_time_ms: input.responseTimeMs,
    ip_address: input.ipAddress,
    user_agent: input.userAgent,
  };

  const { error } = await supabase.from('api_key_usage').insert(payload);

  if (error) {
    // Best-effort logging; avoid failing the main request.
    return;
  }
}
