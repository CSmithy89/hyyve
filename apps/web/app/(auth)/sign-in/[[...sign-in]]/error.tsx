'use client';

/**
 * Sign-In Error Boundary
 *
 * Story: 0-2-8 Implement Auth Pages (Clerk UI)
 * Handles errors during Clerk component rendering.
 */

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface SignInErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SignInError({ error, reset }: SignInErrorProps) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Sign-in error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-[360px] text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-6 w-6 text-destructive" />
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">
          Unable to load sign-in
        </h2>
        <p className="text-sm text-muted-foreground">
          We encountered an issue loading the sign-in form. Please try again.
        </p>
      </div>

      <Button onClick={reset} variant="default" className="mt-2">
        Try again
      </Button>

      <p className="text-xs text-muted-foreground">
        If this problem persists,{' '}
        <a href="/support" className="text-primary hover:underline">
          contact support
        </a>
      </p>
    </div>
  );
}
