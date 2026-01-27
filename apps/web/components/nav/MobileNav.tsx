'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { HyyveLogo } from './HyyveLogo';
import { NavLink, NavItem } from './NavLink';
import { UserMenu } from './UserMenu';
import { DEFAULT_NAV_ITEMS } from './constants';

/**
 * MobileNavProps Interface
 *
 * Story: 0-2-4 Create Navigation Components
 * AC6: MobileNav Component
 */
export interface MobileNavProps {
  /** Whether the drawer is open */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Current active path for highlighting */
  activePath?: string;
  /** Custom navigation items (defaults to standard nav) */
  items?: NavItem[];
}

/**
 * MobileNav Component
 *
 * Mobile navigation drawer using shadcn Sheet with:
 * - Slide from left side
 * - w-64 width matching AppSidebar
 * - Same navigation items as AppSidebar
 * - UserMenu at bottom
 * - Controlled open/close state
 * - Focus trap when open
 * - Escape to close keyboard support
 *
 * @see AC6: MobileNav in story spec
 */
export function MobileNav({
  open,
  onOpenChange,
  activePath,
  items = DEFAULT_NAV_ITEMS,
}: MobileNavProps) {
  const touchStartX = React.useRef<number | null>(null);
  const touchStartY = React.useRef<number | null>(null);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const touch = event.changedTouches[0];
    if (!touch) return;
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;

    if (deltaX < -60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className={cn(
          'w-64 bg-background-dark p-4 border-card-border',
          'flex flex-col justify-between'
        )}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Accessibility labels */}
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">
          Main navigation sidebar for mobile devices
        </SheetDescription>

        {/* Top Section - Logo & Navigation */}
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
            onClick={() => onOpenChange(false)}
          >
            <HyyveLogo variant="full" />
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2" aria-label="Main navigation">
            {items.map((item) => (
              <div key={item.href} onClick={() => onOpenChange(false)}>
                <NavLink
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  isActive={activePath === item.href}
                />
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Section - User Profile */}
        <UserMenu variant="sidebar" />
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav;
