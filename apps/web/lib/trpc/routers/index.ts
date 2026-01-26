import { router, publicProcedure, protectedProcedure } from '../server';
import { z } from 'zod';

/**
 * Root App Router
 *
 * This is the main router that combines all sub-routers.
 * Add new routers here as the application grows.
 *
 * Example sub-router:
 *   import { workflowRouter } from './workflow';
 *   export const appRouter = router({
 *     workflow: workflowRouter,
 *     // ... other routers
 *   });
 */
export const appRouter = router({
  /**
   * Health check endpoint - public
   */
  health: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date() };
  }),

  /**
   * Example protected endpoint
   * Returns the current user's info
   */
  me: protectedProcedure.query(({ ctx }) => {
    return {
      id: ctx.user.id,
      email: ctx.user.emailAddresses[0]?.emailAddress ?? null,
      firstName: ctx.user.firstName,
      lastName: ctx.user.lastName,
    };
  }),

  /**
   * Example mutation with input validation
   */
  echo: publicProcedure
    .input(z.object({ message: z.string() }))
    .mutation(({ input }) => {
      return { echo: input.message, timestamp: new Date() };
    }),
});

/**
 * Export the AppRouter type for client-side type inference
 */
export type AppRouter = typeof appRouter;
