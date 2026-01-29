import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  enforceApiKeyRateLimit,
  isIpAllowed,
  isOriginAllowed,
  logApiKeyUsage,
  validateApiKey,
} from '@/lib/api-key-auth';

/**
 * API Key Test Endpoint
 *
 * Story: 1.2.3 API Key Rate Limiting
 * Uses API key auth and rate limit headers to validate enforcement.
 */
export async function GET(request: NextRequest) {
  const startedAt = Date.now();
  const headerValue =
    request.headers.get('x-api-key') || request.headers.get('authorization');
  const apiKey =
    headerValue != null
      ? headerValue.replace(/^Bearer\s+/i, '').trim()
      : null;

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 401 });
  }

  const apiKeyResult = z.string().trim().min(1).safeParse(apiKey);
  if (!apiKeyResult.success) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  const record = await validateApiKey(apiKeyResult.data);
  if (!record) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const forwardedIp = forwardedFor?.split(',')[0]?.trim() ?? null;
  const clientIp =
    request.ip ??
    (process.env.TRUST_PROXY === 'true' ? forwardedIp ?? realIp ?? null : null);
  const endpoint = new URL(request.url).pathname;
  const userAgent = request.headers.get('user-agent');

  const logUsage = async (statusCode: number) => {
    await logApiKeyUsage({
      apiKeyId: record.id,
      organizationId: record.organization_id,
      endpoint,
      method: request.method,
      statusCode,
      responseTimeMs: Date.now() - startedAt,
      ipAddress: clientIp,
      userAgent,
    });
  };

  if (!isIpAllowed(record, clientIp)) {
    await logUsage(403);
    return NextResponse.json(
      { error: 'IP not allowed' },
      { status: 403 }
    );
  }

  const origin = request.headers.get('origin');
  if (!isOriginAllowed(record, origin)) {
    await logUsage(403);
    return NextResponse.json(
      { error: 'Origin not allowed' },
      { status: 403 }
    );
  }

  const rateLimit = await enforceApiKeyRateLimit(record);

  if (!rateLimit.allowed) {
    await logUsage(429);
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: rateLimit.headers }
    );
  }

  await logUsage(200);
  return NextResponse.json(
    { ok: true },
    {
      headers: rateLimit.headers,
    }
  );
}
