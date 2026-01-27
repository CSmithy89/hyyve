'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { TRPCProvider } from '@/lib/trpc/provider';

/**
 * Client-side providers wrapper.
 *
 * This component wraps children with client-side providers:
 * - ThemeProvider for light/dark/system theme switching (Story 0-2-17)
 * - ClerkProvider for authentication
 * - TRPCProvider for type-safe API calls
 *
 * Theme Configuration (UX Spec 22.16, ADR-023):
 * - Dark mode as default
 * - System preference detection enabled
 * - Persistence via localStorage
 * - Class attribute for Tailwind dark mode
 *
 * During build time without Clerk keys, it renders children without ClerkProvider.
 */
export function Providers({ children }: { children: ReactNode }) {
  // Skip ClerkProvider if publishable key is not set
  // This allows builds to succeed without Clerk configuration
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // Theme wrapper - always present
  const themedChildren = (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  );

  if (!publishableKey) {
    // During build or when Clerk is not configured, render with tRPC only
    return <TRPCProvider>{themedChildren}</TRPCProvider>;
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <TRPCProvider>{themedChildren}</TRPCProvider>
    </ClerkProvider>
  );
}
