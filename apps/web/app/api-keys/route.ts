import { NextResponse } from 'next/server';
import { auth } from '@platform/auth/server';
import { createClerkSupabaseClient } from '@platform/auth/supabase';
import { ApiKeyCreateSchema } from '@/lib/validations/api-keys';
import { generateApiKey } from '@/lib/api-keys';

async function getAdminOrganizationId(userId: string) {
  const supabase = await createClerkSupabaseClient();

  const { data, error } = await supabase
    .from('organization_members')
    .select('organization_id, role')
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  const membership = data.find(
    (member) => member.role === 'owner' || member.role === 'admin'
  );

  return membership?.organization_id ?? null;
}

export async function GET() {
  const session = await auth();
  if (!session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const organizationId = await getAdminOrganizationId(session.userId);
  if (!organizationId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const supabase = await createClerkSupabaseClient();
  const { data, error } = await supabase
    .from('api_keys')
    .select(
      'id, name, key_prefix, scopes, environment, expires_at, created_at, last_used_at, revoked_at, rate_limit_per_minute, rate_limit_per_day, allowed_ips'
    )
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ items: data });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const organizationId = await getAdminOrganizationId(session.userId);
  if (!organizationId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
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
      allowed_ips: allowedIps ?? [],
    })
    .select(
      'id, name, key_prefix, scopes, environment, expires_at, created_at, rate_limit_per_minute, rate_limit_per_day, allowed_ips'
    )
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ apiKey: data, fullKey });
}
