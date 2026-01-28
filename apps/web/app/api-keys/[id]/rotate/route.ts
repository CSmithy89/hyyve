import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@platform/auth/server';
import { createClerkSupabaseClient } from '@platform/auth/supabase';
import { generateApiKey } from '@/lib/api-keys';

const RotationSchema = z.object({
  graceHours: z.number().int().min(1).max(24).default(1),
  revokeOld: z.boolean().optional(),
});

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

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const organizationId = await getAdminOrganizationId(session.userId);
  if (!organizationId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const parsed = RotationSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const keyId = params.id;
  const supabase = await createClerkSupabaseClient();

  const { data: existingKey, error } = await supabase
    .from('api_keys')
    .select(
      'id, name, scopes, environment, expires_at, revoked_at, rate_limit_per_minute, rate_limit_per_day, allowed_origins, allowed_ips'
    )
    .eq('id', keyId)
    .eq('organization_id', organizationId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!existingKey) {
    return NextResponse.json({ error: 'API key not found' }, { status: 404 });
  }

  if (existingKey.revoked_at) {
    return NextResponse.json({ error: 'API key is revoked' }, { status: 400 });
  }

  if (
    existingKey.expires_at &&
    new Date(existingKey.expires_at) <= new Date()
  ) {
    return NextResponse.json({ error: 'API key is expired' }, { status: 400 });
  }

  const { fullKey, keyHash, keyPrefix } = generateApiKey(
    existingKey.environment
  );
  const graceHours = parsed.data.graceHours;
  const revokeOld = parsed.data.revokeOld ?? false;
  const now = new Date();
  const graceUntil = new Date(now.getTime() + graceHours * 60 * 60 * 1000);
  const originalExpiresAt = existingKey.expires_at
    ? new Date(existingKey.expires_at)
    : null;
  const graceExpiresAt = originalExpiresAt
    ? new Date(Math.min(originalExpiresAt.getTime(), graceUntil.getTime()))
    : graceUntil;

  const { data: newKey, error: insertError } = await supabase
    .from('api_keys')
    .insert({
      organization_id: organizationId,
      name: existingKey.name,
      key_prefix: keyPrefix,
      key_hash: keyHash,
      scopes: existingKey.scopes,
      environment: existingKey.environment,
      expires_at: existingKey.expires_at,
      rate_limit_per_minute: existingKey.rate_limit_per_minute,
      rate_limit_per_day: existingKey.rate_limit_per_day,
      allowed_origins: existingKey.allowed_origins ?? [],
      allowed_ips: existingKey.allowed_ips ?? [],
    })
    .select(
      'id, name, key_prefix, scopes, environment, expires_at, created_at, rate_limit_per_minute, rate_limit_per_day, allowed_origins, allowed_ips'
    )
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  let rotationWarning: string | null = null;
  const updatePayload = revokeOld
    ? { revoked_at: now.toISOString() }
    : { expires_at: graceExpiresAt.toISOString() };

  const { error: updateError } = await supabase
    .from('api_keys')
    .update(updatePayload)
    .eq('id', keyId)
    .eq('organization_id', organizationId);

  if (updateError) {
    rotationWarning = updateError.message;
  }

  return NextResponse.json({
    apiKey: newKey,
    fullKey,
    warning: rotationWarning,
  });
}
