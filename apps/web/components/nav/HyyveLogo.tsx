'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * HyyveLogo Props Interface
 *
 * Story: 0-2-4 Create Navigation Components
 * Internal component for consistent logo rendering
 */
export interface HyyveLogoProps {
  /** Show icon only or full logo with text */
  variant?: 'icon' | 'full';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Hyyve Logo SVG Component
 *
 * Renders the Hyyve brand logo in two variants:
 * - icon: Just the hive icon (for mobile/compact spaces)
 * - full: Icon with "Hyyve" text and "AI Platform" subtitle
 *
 * @see hyyve_module_builder/code.html lines 86-93 for wireframe reference
 */
export function HyyveLogo({ variant = 'full', className }: HyyveLogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Logo Icon */}
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
        <svg
          fill="none"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
          className="size-6 text-white"
          aria-hidden="true"
        >
          <path
            d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Logo Text - Only shown in 'full' variant */}
      {variant === 'full' && (
        <div className="flex flex-col">
          <h1 className="text-white text-lg font-bold leading-none tracking-tight">
            Hyyve
          </h1>
          <p className="text-text-secondary text-xs font-medium">AI Platform</p>
        </div>
      )}
    </div>
  );
}

export default HyyveLogo;
