/**
 * Environment Variable Validation
 *
 * This module validates environment variables at runtime using Zod.
 * It separates server-only and client-safe variables to prevent
 * accidental exposure of secrets to the browser.
 *
 * @example Server-side usage (API routes, Server Components)
 * ```typescript
 * import { serverEnv } from '@/lib/env';
 * const key = serverEnv.STRIPE_SECRET_KEY;
 * ```
 *
 * @example Client-side usage (Client Components)
 * ```typescript
 * import { clientEnv } from '@/lib/env';
 * const url = clientEnv.NEXT_PUBLIC_APP_URL;
 * ```
 */

import { z } from 'zod';

// ============================================================================
// Server-Side Environment Schema
// ============================================================================
// These variables are only available on the server.
// NEVER expose these to the client.

const serverSchema = z.object({
  // Node environment
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  // Supabase (server-only)
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // Clerk (server-only)
  CLERK_SECRET_KEY: z.string().optional(),
  CLERK_WEBHOOK_SECRET: z.string().optional(),

  // Redis
  REDIS_URL: z.string().optional(),

  // Stripe (server-only)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Langfuse (server-only)
  LANGFUSE_SECRET_KEY: z.string().optional(),
  LANGFUSE_HOST: z.string().optional(),
});

// ============================================================================
// Client-Side Environment Schema
// ============================================================================
// These variables are safe to expose to the browser.
// They must start with NEXT_PUBLIC_ in Next.js.

const clientSchema = z.object({
  // Supabase (client-safe)
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),

  // Clerk (client-safe)
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default('/sign-in'),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().default('/sign-up'),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().default('/dashboard'),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().default('/dashboard'),

  // Stripe (client-safe)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),

  // Langfuse (client-safe)
  LANGFUSE_PUBLIC_KEY: z.string().optional(),

  // App configuration
  NEXT_PUBLIC_APP_URL: z.string().default('http://localhost:3000'),
});

// ============================================================================
// Environment Parsing
// ============================================================================

/**
 * Parse and validate server environment variables.
 * This should only be called on the server.
 */
function getServerEnv() {
  const parsed = serverSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      '❌ Invalid server environment variables:',
      parsed.error.flatten().fieldErrors
    );
    // In production, we might want to throw
    // For now, return empty defaults to allow builds
    return serverSchema.parse({});
  }

  return parsed.data;
}

/**
 * Parse and validate client environment variables.
 * These are safe to expose to the browser.
 */
function getClientEnv() {
  const parsed = clientSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL:
      process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL:
      process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    LANGFUSE_PUBLIC_KEY: process.env.LANGFUSE_PUBLIC_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });

  if (!parsed.success) {
    console.error(
      '❌ Invalid client environment variables:',
      parsed.error.flatten().fieldErrors
    );
    // Return defaults to allow builds
    return clientSchema.parse({});
  }

  return parsed.data;
}

// ============================================================================
// Exports
// ============================================================================

/**
 * Server-side environment variables.
 * Only use in Server Components, API routes, or server actions.
 */
export const serverEnv = getServerEnv();

/**
 * Client-side environment variables.
 * Safe to use in Client Components.
 */
export const clientEnv = getClientEnv();

/**
 * Type definitions for environment variables
 */
export type ServerEnv = z.infer<typeof serverSchema>;
export type ClientEnv = z.infer<typeof clientSchema>;
