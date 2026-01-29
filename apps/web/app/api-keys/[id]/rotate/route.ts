import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@platform/auth/server';
import { createClerkSupabaseClient } from '@platform/auth/supabase';
import { generateApiKey } from '@/lib/api-keys';
import { getAdminOrganizationId } from '@/lib/organizations';

const RotationSchema = z.object({
  graceHours: z.number().int().min(1).max(24).default(1),
  revokeOld: z.boolean().optional(),
});
const ParamsSchema = z.object({
  id: z.string().uuid(),
});

export async function POST(
  request: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
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
  const parsed = RotationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const paramsResult = ParamsSchema.safeParse(await context.params);
  if (!paramsResult.success) {
    return NextResponse.json({ error: 'Invalid API key id' }, { status: 400 });
  }
  const keyId = paramsResult.data.id;
  const supabase = await createClerkSupabaseClient();

  const { data: existingKey, error } = await supabase
    .from('api_keys')
    .select(
      'id, name, scopes, environment, project_id, expires_at, revoked_at, rate_limit_per_minute, rate_limit_per_day, allowed_origins, allowed_ips'
    )
    .eq('id', keyId)
    .eq('organization_id', organizationId)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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
      project_id: existingKey.project_id ?? null,
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

  if (insertError || !newKey) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }

  const updatePayload = revokeOld
    ? { revoked_at: now.toISOString() }
    : { expires_at: graceExpiresAt.toISOString() };

  const { error: updateError } = await supabase
    .from('api_keys')
    .update(updatePayload)
    .eq('id', keyId)
    .eq('organization_id', organizationId);

  if (updateError) {
    await supabase
      .from('api_keys')
      .delete()
      .eq('id', newKey.id)
      .eq('organization_id', organizationId);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    apiKey: newKey,
    fullKey,
  });
}
