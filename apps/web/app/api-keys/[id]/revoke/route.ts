import { NextResponse } from 'next/server';
import { auth } from '@platform/auth/server';
import { createClerkSupabaseClient } from '@platform/auth/supabase';

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
  _request: Request,
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

  const keyId = params.id;
  const supabase = await createClerkSupabaseClient();

  const { data: existingKey, error } = await supabase
    .from('api_keys')
    .select('id, revoked_at')
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
    return NextResponse.json({ error: 'API key already revoked' }, { status: 400 });
  }

  const { data, error: updateError } = await supabase
    .from('api_keys')
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', keyId)
    .eq('organization_id', organizationId)
    .select('id, revoked_at')
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ apiKey: data });
}
