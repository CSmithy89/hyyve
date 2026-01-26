import { initTRPC, TRPCError } from '@trpc/server';
import { auth, currentUser } from '@platform/auth/server';
import { createServerSupabaseClient } from '@platform/db';
import superjson from 'superjson';
import type { User } from '@clerk/nextjs/server';

/**
 * tRPC Server Configuration
 *
 * This file sets up the tRPC server with:
 * - Context creation with Supabase client and Clerk user
 * - Public and protected procedures
 * - superjson transformer for Date/BigInt serialization
 */

/**
 * Create context for each tRPC request
 * Includes database client and authentication info
 */
export const createTRPCContext = async () => {
  const session = await auth();
  const db = await createServerSupabaseClient();
  const user = session?.userId ? await currentUser() : null;

  return {
    db,
    session,
    user,
  };
};

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

/**
 * Initialize tRPC with context and superjson transformer
 */
const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

/**
 * Router factory
 */
export const router = t.router;

/**
 * Middleware factory
 */
export const middleware = t.middleware;

/**
 * Public procedure - no authentication required
 */
export const publicProcedure = t.procedure;

/**
 * Auth middleware - validates user is authenticated
 */
const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.userId || !ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to perform this action',
    });
  }

  return next({
    ctx: {
      ...ctx,
      // Narrow the user type to non-null
      user: ctx.user as User,
      session: ctx.session,
    },
  });
});

/**
 * Protected procedure - requires authentication
 * Context is typed with guaranteed non-null user
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
