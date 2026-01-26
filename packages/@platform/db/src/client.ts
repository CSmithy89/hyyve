import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

/**
 * Create a Supabase client for browser/client-side usage.
 *
 * @param supabaseUrl - The Supabase project URL
 * @param supabaseAnonKey - The Supabase anon/public key
 * @returns A typed Supabase client
 */
export function createBrowserClient(
  supabaseUrl: string,
  supabaseAnonKey: string
): SupabaseClient<Database> {
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}

/**
 * Create a Supabase client for server-side usage.
 *
 * @param supabaseUrl - The Supabase project URL
 * @param supabaseServiceKey - The Supabase service role key
 * @returns A typed Supabase client
 */
export function createServerClient(
  supabaseUrl: string,
  supabaseServiceKey: string
): SupabaseClient<Database> {
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
