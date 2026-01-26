import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from './routers';

/**
 * tRPC React Client
 *
 * This creates the typed tRPC hooks for use in React components.
 * Usage:
 *   const { data } = trpc.example.hello.useQuery({ text: 'world' });
 *   const mutation = trpc.example.create.useMutation();
 */
export const trpc = createTRPCReact<AppRouter>();
