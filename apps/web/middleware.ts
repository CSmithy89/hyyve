/**
 * Next.js Middleware for Supabase Session Refresh
 *
 * This middleware runs on every request and ensures the user's
 * auth session is refreshed before it expires.
 */

import { updateSession } from '@platform/db/middleware';
import { type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

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
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Common image extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
