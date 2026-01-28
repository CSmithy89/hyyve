import { NextResponse } from 'next/server';
import {
  enforceApiKeyRateLimit,
  isIpAllowed,
  isOriginAllowed,
  validateApiKey,
} from '@/lib/api-key-auth';

/**
 * API Key Test Endpoint
 *
 * Story: 1.2.3 API Key Rate Limiting
 * Uses API key auth and rate limit headers to validate enforcement.
 */
export async function GET(request: Request) {
  const headerValue =
    request.headers.get('x-api-key') || request.headers.get('authorization');
  const apiKey = headerValue?.replace(/^Bearer\s+/i, '').trim();

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 401 });
  }

  const record = await validateApiKey(apiKey);
  if (!record) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const clientIp = forwardedFor?.split(',')[0]?.trim() ?? realIp ?? null;

  if (!isIpAllowed(record, clientIp)) {
    return NextResponse.json(
      { error: 'IP not allowed' },
      { status: 403 }
    );
  }

  const origin = request.headers.get('origin');
  if (!isOriginAllowed(record, origin)) {
    return NextResponse.json(
      { error: 'Origin not allowed' },
      { status: 403 }
    );
  }

  const rateLimit = await enforceApiKeyRateLimit(record);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: rateLimit.headers }
    );
  }

  return NextResponse.json(
    { ok: true },
    {
      headers: rateLimit.headers,
    }
  );
}
