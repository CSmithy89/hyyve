'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './client';
import superjson from 'superjson';

/**
 * tRPC + React Query Provider
 *
 * Wraps the application with:
 * - QueryClientProvider for React Query
 * - trpc.Provider for tRPC hooks
 *
 * The tRPC client is configured with:
 * - httpBatchLink for batched HTTP requests
 * - superjson transformer for Date/BigInt serialization
 */
export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
          // Transformer must be set at the link level in tRPC v11
          transformer: superjson,
          // Optional: Add custom headers
          async headers() {
            return {};
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
