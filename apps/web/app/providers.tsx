'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode } from 'react';

/**
 * Client-side providers wrapper.
 *
 * This component wraps children with client-side providers like ClerkProvider.
 * During build time without Clerk keys, it renders children without ClerkProvider.
 */
export function Providers({ children }: { children: ReactNode }) {
  // Skip ClerkProvider if publishable key is not set
  // This allows builds to succeed without Clerk configuration
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    // During build or when Clerk is not configured, render without auth
    return <>{children}</>;
  }

  return <ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider>;
}
