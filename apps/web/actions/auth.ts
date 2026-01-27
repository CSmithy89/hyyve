/**
 * Authentication Server Actions
 *
 * Story: 1-1-4 User Login with Email/Password
 */

'use server';

import { z } from 'zod';

const SignInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export interface AuthActionResult {
  success: boolean;
  error?: string;
}

export async function signInWithEmailPassword(data: {
  email: string;
  password: string;
  rememberMe?: boolean;
}): Promise<AuthActionResult> {
  try {
    const validated = SignInSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Invalid credentials',
      };
    }

    // TODO: Integrate Clerk sign-in and session handling.
    return { success: true };
  } catch (error) {
    console.error('Sign-in failed:', error);
    return { success: false, error: 'Failed to sign in' };
  }
}
