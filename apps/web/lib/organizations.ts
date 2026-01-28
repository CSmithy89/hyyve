import { createClerkSupabaseClient } from '@platform/auth/supabase';

type SessionContext = {
  userId?: string | null;
  orgId?: string | null;
  organizationId?: string | null;
};

export async function getAdminOrganizationId(
  session: SessionContext
): Promise<string | null> {
  if (!session?.userId) {
    return null;
  }

  const organizationId = session.orgId ?? session.organizationId ?? null;
  if (!organizationId) {
    return null;
  }

  const supabase = await createClerkSupabaseClient();

  const { data, error } = await supabase
    .from('organization_members')
    .select('role')
    .eq('user_id', session.userId)
    .eq('organization_id', organizationId);

  if (error) {
    throw new Error(error.message);
  }

  const isAdmin = (data ?? []).some(
    (member) => member.role === 'owner' || member.role === 'admin'
  );

  return isAdmin ? organizationId : null;
}
