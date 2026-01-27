'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Home, FolderOpen, Settings, BookOpen, LucideIcon } from 'lucide-react';

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
  /** Lucide icon name */
  icon: string;
}

/**
 * Map of icon names to Lucide components
 */
const iconMap: Record<string, LucideIcon> = {
  home: Home,
  folder_open: FolderOpen,
  settings: Settings,
  menu_book: BookOpen,
};

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
  // Resolve icon from string or use provided ReactNode
  const IconComponent =
    typeof icon === 'string' ? iconMap[icon] : null;

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
      {IconComponent ? (
        <IconComponent
          className={cn(
            'size-5',
            isActive ? 'text-white' : 'text-text-secondary group-hover:text-white'
          )}
          aria-hidden="true"
        />
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
