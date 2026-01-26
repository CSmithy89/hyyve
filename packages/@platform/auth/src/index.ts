/**
 * @platform/auth - Authentication Helpers
 *
 * This package provides authentication utilities and helpers
 * using Clerk for consumer auth and WorkOS for enterprise SSO.
 *
 * @example
 * ```typescript
 * // Client Components - use hooks
 * import { useUser, useAuth, ClerkProvider } from '@platform/auth';
 *
 * // Server Components - use auth helpers
 * import { auth, currentUser } from '@platform/auth/server';
 *
 * // Clerk + Supabase integration
 * import { createClerkSupabaseClient } from '@platform/auth/supabase';
 * ```
 */

// Re-export Clerk utilities for consumer authentication (Client Components)
export {
  ClerkProvider,
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
  useUser,
  useClerk,
  useSession,
  SignInButton,
  SignUpButton,
  SignOutButton,
} from '@clerk/nextjs';

// Note: Server-side utilities (auth, currentUser) are in @platform/auth/server
// to avoid importing server code in client bundles
