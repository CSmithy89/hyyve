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

const ResetRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
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

export async function requestPasswordReset(data: { email: string }): Promise<AuthActionResult> {
  try {
    const validated = ResetRequestSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Invalid email',
      };
    }

    // TODO: Integrate Clerk password reset email flow.
    return { success: true };
  } catch (error) {
    console.error('Password reset request failed:', error);
    return { success: false, error: 'Failed to send reset link' };
  }
}

export async function resetPasswordWithToken(data: {
  token: string;
  password: string;
}): Promise<AuthActionResult> {
  try {
    const validated = ResetPasswordSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Invalid reset request',
      };
    }

    // TODO: Integrate Clerk password reset verification.
    return { success: true };
  } catch (error) {
    console.error('Password reset failed:', error);
    return { success: false, error: 'Failed to reset password' };
  }
}
