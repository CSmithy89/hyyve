'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode } from 'react';
import { TRPCProvider } from '@/lib/trpc/provider';

/**
 * Client-side providers wrapper.
 *
 * This component wraps children with client-side providers:
 * - ClerkProvider for authentication
 * - TRPCProvider for type-safe API calls
 *
 * During build time without Clerk keys, it renders children without ClerkProvider.
 */
export function Providers({ children }: { children: ReactNode }) {
  // Skip ClerkProvider if publishable key is not set
  // This allows builds to succeed without Clerk configuration
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    // During build or when Clerk is not configured, render with tRPC only
    return <TRPCProvider>{children}</TRPCProvider>;
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <TRPCProvider>{children}</TRPCProvider>
    </ClerkProvider>
  );
}
