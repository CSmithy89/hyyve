/**
 * tRPC Barrel Exports
 *
 * Re-exports all tRPC utilities for convenient importing:
 *   import { trpc, TRPCProvider, router } from '@/lib/trpc';
 */

// Server utilities
export {
  router,
  publicProcedure,
  protectedProcedure,
  middleware,
  createTRPCContext,
  type TRPCContext,
} from './server';

// Client utilities
export { trpc } from './client';

// Provider component
export { TRPCProvider } from './provider';

// Router types
export { appRouter, type AppRouter } from './routers';
