'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { HyyveLogo } from './HyyveLogo';
import { NavLink, NavItem } from './NavLink';
import { UserMenu } from './UserMenu';
import { DEFAULT_NAV_ITEMS } from './constants';

/**
 * AppSidebarProps Interface
 *
 * Story: 0-2-4 Create Navigation Components
 * AC2: AppSidebar Component
 */
export interface AppSidebarProps {
  /** Current active path for highlighting */
  activePath?: string;
  /** Custom navigation items (defaults to standard nav) */
  items?: NavItem[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * AppSidebar Component
 *
 * Main sidebar navigation featuring:
 * - w-64 (256px) fixed width
 * - Hyyve logo at top
 * - Navigation links with icons
 * - Active state highlighting (bg-card-border)
 * - UserMenu at bottom
 * - Hidden on mobile (hidden md:flex)
 * - Flex column layout with justify-between for sticky footer
 *
 * @see hyyve_home_dashboard/code.html lines 53-94 for wireframe reference
 */
export function AppSidebar({
  activePath,
  items = DEFAULT_NAV_ITEMS,
  className,
}: AppSidebarProps) {
  return (
    <aside
      className={cn(
        'hidden w-64 flex-col justify-between border-r border-card-border bg-background-dark p-4 md:flex',
        className
      )}
      role="region"
      aria-label="Main navigation sidebar"
    >
      {/* Top Section - Logo & Navigation */}
      <div className="flex flex-col gap-6">
        {/* Logo */}
        <Link href="/dashboard" className="px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
          <HyyveLogo variant="full" />
        </Link>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2" aria-label="Main navigation">
          {items.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={activePath === item.href}
            />
          ))}
        </nav>
      </div>

      {/* Bottom Section - User Profile */}
      <UserMenu variant="sidebar" />
    </aside>
  );
}

export default AppSidebar;
