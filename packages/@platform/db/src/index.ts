/**
 * @platform/db - Supabase Client & Types
 *
 * This package provides Supabase client configuration and
 * database type definitions for the Hyyve platform.
 *
 * @example
 * ```typescript
 * // Server Component
 * import { createClient } from '@platform/db/server';
 * const supabase = await createClient();
 *
 * // Client Component
 * import { createClient } from '@platform/db/browser';
 * const supabase = createClient();
 *
 * // Middleware
 * import { updateSession } from '@platform/db/middleware';
 * ```
 */

// Export server client with explicit naming to avoid conflicts
export {
  createClient as createServerSupabaseClient,
  createAdminClient,
} from './server';

// Export browser client with explicit naming
export { createClient as createBrowserSupabaseClient } from './browser';

// Export types
export * from './types';

// Export middleware helpers
export { updateSession, isProtectedRoute } from './middleware';

// Export Redis utilities
export {
  getRedisClient,
  closeRedisConnection,
  cacheGet,
  cacheSet,
  cacheDelete,
  cacheDeletePattern,
  publish,
  subscribe,
  unsubscribe,
  checkRateLimit,
  checkRateLimitSimple,
  type RateLimitResult,
} from './redis';
