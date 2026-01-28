import { NextResponse } from 'next/server';
import { auth } from '@platform/auth/server';
import { createClerkSupabaseClient } from '@platform/auth/supabase';
import { ApiKeyCreateSchema } from '@/lib/validations/api-keys';
import { generateApiKey } from '@/lib/api-keys';
import { getAdminOrganizationId } from '@/lib/organizations';

export async function GET() {
  const session = await auth();
  if (!session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let organizationId: string | null = null;
  try {
    organizationId = await getAdminOrganizationId(session);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
  if (!organizationId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const supabase = await createClerkSupabaseClient();
  const { data, error } = await supabase
    .from('api_keys')
    .select(
      'id, name, key_prefix, scopes, environment, expires_at, created_at, last_used_at, revoked_at, rate_limit_per_minute, rate_limit_per_day, allowed_origins, allowed_ips'
    )
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }

  return NextResponse.json({ items: data });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let organizationId: string | null = null;
  try {
    organizationId = await getAdminOrganizationId(session);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
  if (!organizationId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const parsed = ApiKeyCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const {
    name,
    environment,
    scopes,
    rateLimitPerMinute,
    rateLimitPerDay,
    allowedIps,
    allowedOrigins,
    expiresInDays,
  } = parsed.data;
  const { fullKey, keyHash, keyPrefix } = generateApiKey(environment);
  const expiresAt = expiresInDays
    ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
    : null;

  const supabase = await createClerkSupabaseClient();
  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      organization_id: organizationId,
      name,
      key_prefix: keyPrefix,
      key_hash: keyHash,
      scopes,
      environment,
      expires_at: expiresAt,
      rate_limit_per_minute: rateLimitPerMinute ?? 60,
      rate_limit_per_day: rateLimitPerDay ?? 10000,
      allowed_origins: allowedOrigins ?? [],
      allowed_ips: allowedIps ?? [],
    })
    .select(
      'id, name, key_prefix, scopes, environment, expires_at, created_at, rate_limit_per_minute, rate_limit_per_day, allowed_origins, allowed_ips'
    )
    .single();

  if (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }

  return NextResponse.json({ apiKey: data, fullKey });
}
