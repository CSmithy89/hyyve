'use client';

import * as React from 'react';
import { Menu, Search, Bell, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/**
 * AppHeaderProps Interface
 *
 * Story: 0-2-4 Create Navigation Components
 * AC1: AppHeader Component
 */
export interface AppHeaderProps {
  /** Callback when mobile menu button is clicked */
  onMenuClick?: () => void;
  /** Custom content for the right side of the header */
  rightContent?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * AppHeader Component
 *
 * Top navigation bar for dashboard/settings pages featuring:
 * - h-16 (64px) fixed height
 * - Sticky positioning with backdrop blur
 * - Mobile hamburger menu trigger
 * - Desktop search input
 * - Notification button with badge
 * - Quick-add button
 * - Support for custom rightContent slot
 *
 * @see hyyve_home_dashboard/code.html lines 98-122 for wireframe reference
 */
export function AppHeader({
  onMenuClick,
  rightContent,
  className,
}: AppHeaderProps) {
  return (
    <header
      className={cn(
        'flex h-16 items-center justify-between border-b border-border-dark px-6 py-3',
        'bg-background-dark/50 backdrop-blur-md sticky top-0 z-10',
        className
      )}
      role="banner"
    >
      {/* Left Side - Mobile Menu Button & Logo */}
      <div className="flex items-center gap-4 text-white md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-card-border"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" aria-hidden="true" />
        </Button>
        <h2 className="text-lg font-bold">Hyyve</h2>
      </div>

      {/* Center - Desktop Search */}
      <div className="hidden md:flex flex-1 max-w-xl">
        <div className="relative w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary size-5"
            aria-hidden="true"
          />
          <input
            type="text"
            className={cn(
              'w-full rounded-lg border border-transparent bg-card-border py-2 pl-10 pr-4',
              'text-sm text-white placeholder-text-secondary',
              'focus:border-primary focus:bg-card-dark focus:outline-none focus:ring-1 focus:ring-primary',
              'transition-all'
            )}
            placeholder="Search projects, modules, or docs..."
            aria-label="Search"
          />
        </div>
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center gap-4">
        {/* Custom right content */}
        {rightContent}

        {/* Notification Button */}
        <Button
          variant="ghost"
          size="icon"
          className="relative size-9 rounded-lg bg-card-border text-white hover:bg-card-border/80"
          aria-label="Notifications"
        >
          <Bell className="size-5" aria-hidden="true" />
          {/* Notification Badge */}
          <span className="absolute right-2 top-2 size-2 rounded-full bg-primary ring-2 ring-background-dark animate-pulse" />
        </Button>

        {/* Quick Add Button */}
        <Button
          variant="ghost"
          size="icon"
          className="size-9 rounded-lg bg-primary text-white hover:bg-primary/90"
          aria-label="Quick add"
        >
          <Plus className="size-5" aria-hidden="true" />
        </Button>
      </div>
    </header>
  );
}

export default AppHeader;
