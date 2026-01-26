'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * AuthLayout Props Interface
 *
 * Story: 0-2-3 Create Layout Shells
 * AC3: AuthLayout - Centered card layout for authentication pages
 */
export interface AuthLayoutProps {
  /** Form content rendered inside the card */
  children: React.ReactNode;
  /** Footer content below the card (e.g., signup link) */
  footer?: React.ReactNode;
}

/**
 * AuthLayout Component
 *
 * Centered card layout for authentication pages featuring:
 * - Full viewport height with flex centering
 * - Card with max-w-[440px] width constraint
 * - Card has rounded-xl border radius and shadow-2xl
 * - Ambient gradient background effects (purple/indigo glow)
 * - Grid pattern overlay for visual texture
 * - Hyyve logo and branding in card header
 * - Support for responsive padding (p-8 / sm:p-10)
 *
 * Uses CSS custom properties from globals.css for theming.
 *
 * @see hyyve_login_page/code.html for wireframe reference
 */
export function AuthLayout({ children, footer }: AuthLayoutProps) {
  return (
    <div
      className={cn(
        'relative flex min-h-screen w-full flex-col justify-center items-center overflow-hidden',
        'bg-background text-foreground'
      )}
    >
      {/* Background Effects */}
      <BackgroundEffects />

      {/* Card Container */}
      <div className="relative w-full max-w-[440px] px-4 py-8">
        {/* Card */}
        <div
          className={cn(
            'flex flex-col w-full bg-card rounded-xl shadow-2xl',
            'border border-border overflow-hidden p-8 sm:p-10 relative z-10'
          )}
        >
          {/* Logo & Header */}
          <div className="flex flex-col items-center justify-center mb-8 gap-4">
            <HyyveLogo />
          </div>

          {/* Form Content */}
          {children}
        </div>

        {/* Footer Links */}
        {footer && (
          <div className="mt-6 text-center relative z-10">{footer}</div>
        )}
      </div>
    </div>
  );
}

/**
 * Background Effects Component
 * Creates ambient gradient and grid pattern effects
 */
function BackgroundEffects() {
  return (
    <>
      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"
        aria-hidden="true"
      />

      {/* Gradient Overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent',
          'opacity-40 pointer-events-none'
        )}
        aria-hidden="true"
      />

      {/* Top Right Glow - Purple/Indigo */}
      <div
        className={cn(
          'absolute top-[-10%] right-[-5%] w-[500px] h-[500px]',
          'bg-primary/20 rounded-full blur-[120px] pointer-events-none'
        )}
        aria-hidden="true"
      />

      {/* Bottom Left Glow - Purple */}
      <div
        className={cn(
          'absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px]',
          'bg-violet-600/10 rounded-full blur-[100px] pointer-events-none'
        )}
        aria-hidden="true"
      />
    </>
  );
}

/**
 * Hyyve Logo Component
 * Renders the brand logo for the auth card header
 */
function HyyveLogo() {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Logo Icon */}
      <div
        className={cn(
          'h-14 w-14 rounded-xl flex items-center justify-center',
          'bg-gradient-to-br from-primary to-indigo-600',
          'shadow-lg shadow-primary/25'
        )}
      >
        <svg
          className="w-8 h-8 text-primary-foreground"
          fill="none"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
          Welcome to Hyyve
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to access your workspace
        </p>
      </div>
    </div>
  );
}

export default AuthLayout;
