'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * NavLinkProps Interface
 *
 * Story: 0-2-4 Create Navigation Components
 * Reusable navigation link with active state
 */
export interface NavLinkProps {
  /** Target URL for the link */
  href: string;
  /** Icon component or Lucide icon name */
  icon?: React.ReactNode;
  /** Link label text */
  label: string;
  /** Whether this link is currently active */
  isActive?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * NavItem Interface for navigation configuration
 */
export interface NavItem {
  /** Display label for the nav item */
  label: string;
  /** Target URL path */
  href: string;
  /** Material Symbol name */
  icon: string;
}

/**
 * NavLink Component
 *
 * Reusable navigation link with:
 * - Active state highlighting (bg-card-border)
 * - Hover transitions
 * - Icon and label support
 * - Next.js Link for client-side navigation
 * - Accessibility support with aria-current
 *
 * @see hyyve_home_dashboard/code.html lines 67-82 for wireframe reference
 */
export function NavLink({
  href,
  icon,
  label,
  isActive = false,
  className,
}: NavLinkProps) {
  const iconName = typeof icon === 'string' ? icon : null;

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors group',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        isActive
          ? 'bg-card-border text-white'
          : 'text-text-secondary hover:bg-card-border/50 hover:text-white',
        className
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* Icon */}
      {iconName ? (
        <span
          className={cn(
            'material-symbols-outlined text-[20px]',
            isActive ? 'text-white' : 'text-text-secondary group-hover:text-white'
          )}
          aria-hidden="true"
        >
          {iconName}
        </span>
      ) : icon ? (
        <span
          className={cn(
            'size-5 flex items-center justify-center',
            isActive ? 'text-white' : 'text-text-secondary group-hover:text-white'
          )}
          aria-hidden="true"
        >
          {icon}
        </span>
      ) : null}

      {/* Label */}
      <span
        className={cn(
          'text-sm font-medium',
          isActive ? 'text-white' : 'text-text-secondary group-hover:text-white'
        )}
      >
        {label}
      </span>
    </Link>
  );
}

export default NavLink;
