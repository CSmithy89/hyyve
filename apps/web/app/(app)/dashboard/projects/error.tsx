'use client';

/**
 * Projects Error Boundary
 *
 * Story: 0-2-9 Implement Dashboard and Project Browser
 * Handles errors during projects page rendering.
 */

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ProjectsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProjectsError({ error, reset }: ProjectsErrorProps) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Projects page error:', error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-6 w-6 text-destructive" />
      </div>

      <div className="space-y-2 text-center">
        <h2 className="text-lg font-semibold text-foreground">
          Unable to load projects
        </h2>
        <p className="text-sm text-muted-foreground">
          We encountered an issue loading your projects. Please try again.
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
