/**
 * Server-side Clerk Authentication Utilities
 *
 * These utilities are for use in Server Components, Route Handlers,
 * and Server Actions. They require the Clerk middleware to be configured.
 */

// Re-export server-side auth utilities from Clerk
export {
  auth,
  currentUser,
  clerkClient,
} from '@clerk/nextjs/server';

// Re-export middleware utilities
export {
  clerkMiddleware,
  createRouteMatcher,
  getAuth,
} from '@clerk/nextjs/server';

// Type exports for convenience
export type { User } from '@clerk/nextjs/server';
