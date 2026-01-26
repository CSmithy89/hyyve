/**
 * Middleware Helper for Supabase Session Refresh
 *
 * Provides utilities for refreshing user sessions in Next.js middleware.
 * This ensures auth cookies are properly refreshed on each request.
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from './types';

/**
 * Update the user session on each request.
 *
 * This function should be called from your Next.js middleware
 * to ensure auth cookies are refreshed before they expire.
 *
 * @example
 * ```typescript
 * // apps/web/middleware.ts
 * import { updateSession } from '@platform/db/middleware';
 * import { type NextRequest } from 'next/server';
 *
 * export async function middleware(request: NextRequest) {
 *   return await updateSession(request);
 * }
 *
 * export const config = {
 *   matcher: [
 *     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
 *   ],
 * };
 * ```
 *
 * @param request - The incoming Next.js request
 * @returns The response with updated session cookies
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: DO NOT REMOVE THIS LINE
  // This refreshes the user's session if it's about to expire
  // and ensures the session is valid on each request.
  // The `getUser()` call is required for session refresh to work.
  await supabase.auth.getUser();

  // You can add additional logic here, such as:
  // - Redirecting unauthenticated users from protected routes
  // - Adding user info to headers
  // - Logging authentication events

  return supabaseResponse;
}

/**
 * Check if a path requires authentication.
 *
 * Helper function to determine if a route should be protected.
 *
 * @param pathname - The current request pathname
 * @param protectedRoutes - Array of protected route prefixes
 * @returns Whether the route requires authentication
 */
export function isProtectedRoute(
  pathname: string,
  protectedRoutes: string[] = ['/dashboard', '/settings', '/api/protected']
): boolean {
  return protectedRoutes.some((route) => pathname.startsWith(route));
}
