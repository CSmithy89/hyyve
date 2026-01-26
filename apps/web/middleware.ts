/**
 * Next.js Middleware for Clerk Authentication and Supabase Session
 *
 * This middleware handles:
 * 1. Clerk authentication - protects routes requiring auth
 * 2. Supabase session refresh - keeps auth cookies fresh
 */

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { updateSession } from '@platform/db/middleware';

/**
 * Public routes that don't require authentication.
 * These routes are accessible to all users.
 */
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/public(.*)',
]);

/**
 * Combined middleware that handles both Clerk auth and Supabase session.
 *
 * For public routes: Just refreshes the Supabase session
 * For protected routes: Requires Clerk authentication, then refreshes session
 */
export default clerkMiddleware(async (auth, request) => {
  // Protect non-public routes
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  // Refresh Supabase session for all routes
  // This ensures auth cookies stay fresh
  return await updateSession(request);
});

/**
 * Matcher configuration for middleware.
 *
 * This ensures the middleware runs on all routes except:
 * - Static files (_next/static)
 * - Image optimization (_next/image)
 * - Favicon and common asset files
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico and common asset files
     * - Files with extensions (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf|eot)$).*)',
    '/(api|trpc)(.*)',
  ],
};
