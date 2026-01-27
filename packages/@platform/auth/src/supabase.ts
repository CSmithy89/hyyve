/**
 * Clerk + Supabase Integration
 *
 * Provides utilities for creating Supabase clients authenticated
 * with Clerk's JWT tokens for Row Level Security (RLS).
 *
 * Prerequisites:
 * 1. Configure a JWT template named 'supabase' in Clerk Dashboard
 * 2. Set up RLS policies in Supabase that verify the Clerk JWT
 *
 * @see https://clerk.com/docs/integrations/databases/supabase
 */

import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Create a Supabase client authenticated with the current Clerk user's JWT.
 *
 * This client is for use in Server Components, Route Handlers, and Server Actions.
 * The JWT is obtained from Clerk using the 'supabase' template.
 *
 * @example
 * ```typescript
 * // In a Server Component or Route Handler
 * import { createClerkSupabaseClient } from '@platform/auth/supabase';
 *
 * export async function GET() {
 *   const supabase = await createClerkSupabaseClient();
 *   const { data } = await supabase.from('projects').select('*');
 *   return Response.json(data);
 * }
 * ```
 *
 * @returns A Supabase client with the Clerk user's JWT in the Authorization header
 * @throws If no Supabase URL or anon key is configured
 */
export async function createClerkSupabaseClient() {
  const { getToken } = await auth();

  // Get the Supabase access token from Clerk
  // This requires a JWT template named 'supabase' in Clerk Dashboard
  const supabaseAccessToken = await getToken({ template: 'supabase' });

  // getToken() returns null when user is not authenticated
  if (!supabaseAccessToken) {
    throw new Error(
      'User is not authenticated. Cannot create authenticated Supabase client. ' +
        'Ensure the user is signed in before calling this function.'
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. ' +
        'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${supabaseAccessToken}`,
      },
    },
  });
}

/**
 * Create a Supabase client for anonymous/public access.
 *
 * Use this when you don't need user authentication,
 * such as for public data or unauthenticated API routes.
 *
 * @returns A Supabase client without user authentication
 */
export function createPublicSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. ' +
        'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}
