/**
 * Server-side Supabase Client
 *
 * Creates a Supabase client for use in Server Components, Route Handlers,
 * and Server Actions with proper cookie handling for Next.js App Router.
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './types';

/**
 * Create a Supabase client for server-side usage.
 *
 * This client is configured for Next.js App Router with proper
 * cookie handling for authentication state management.
 *
 * @example
 * ```typescript
 * // In a Server Component
 * import { createClient } from '@platform/db/server';
 *
 * export default async function Page() {
 *   const supabase = await createClient();
 *   const { data } = await supabase.from('users').select();
 *   return <div>{data}</div>;
 * }
 * ```
 *
 * @returns Promise resolving to a typed Supabase client
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Create a Supabase admin client for server-side usage.
 *
 * This client uses the service role key and bypasses RLS.
 * Only use this for administrative operations that require elevated privileges.
 *
 * @warning This client bypasses Row Level Security - use with caution!
 *
 * @returns A typed Supabase admin client
 */
export async function createAdminClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore - called from Server Component
          }
        },
      },
    }
  );
}
