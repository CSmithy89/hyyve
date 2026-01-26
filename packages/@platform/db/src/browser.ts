/**
 * Browser-side Supabase Client
 *
 * Creates a Supabase client for use in Client Components.
 * Uses the createBrowserClient from @supabase/ssr for proper
 * cookie handling in the browser.
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

/**
 * Create a Supabase client for browser/client-side usage.
 *
 * This client is configured for React Client Components and
 * handles auth state via cookies automatically.
 *
 * @example
 * ```typescript
 * 'use client';
 *
 * import { createClient } from '@platform/db/browser';
 * import { useEffect, useState } from 'react';
 *
 * export function UserProfile() {
 *   const [user, setUser] = useState(null);
 *   const supabase = createClient();
 *
 *   useEffect(() => {
 *     supabase.auth.getUser().then(({ data }) => setUser(data.user));
 *   }, []);
 *
 *   return <div>{user?.email}</div>;
 * }
 * ```
 *
 * @returns A typed Supabase client for browser usage
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
