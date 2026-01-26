/**
 * @platform/auth - Authentication Helpers
 *
 * This package provides authentication utilities and helpers
 * using Clerk for consumer auth and WorkOS for enterprise SSO.
 */

// Re-export Clerk utilities for consumer authentication
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
} from '@clerk/nextjs';

// Export custom auth utilities as they are created
export {};
