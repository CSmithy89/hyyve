import { NextResponse } from 'next/server';
import { auth } from '@platform/auth/server';
import { createClerkSupabaseClient } from '@platform/auth/supabase';
import { getAdminOrganizationId } from '@/lib/organizations';

export async function POST(
  _request: Request,
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

  const { id: keyId } = await context.params;
  const supabase = await createClerkSupabaseClient();

  const { data: existingKey, error } = await supabase
    .from('api_keys')
    .select('id, revoked_at')
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
    return NextResponse.json({ apiKey: existingKey });
  }

  const { data, error: updateError } = await supabase
    .from('api_keys')
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', keyId)
    .eq('organization_id', organizationId)
    .select('id, revoked_at')
    .single();

  if (updateError) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }

  return NextResponse.json({ apiKey: data });
}
