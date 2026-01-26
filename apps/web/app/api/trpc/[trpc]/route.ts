import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/lib/trpc/routers';
import { createTRPCContext } from '@/lib/trpc/server';

/**
 * tRPC App Router Handler
 *
 * Handles all tRPC requests at /api/trpc/*
 * Supports both GET (queries) and POST (mutations)
 */
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`
            );
          }
        : undefined,
  });

export const GET = handler;
export const POST = handler;
