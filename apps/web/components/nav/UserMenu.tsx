'use client';

import * as React from 'react';
import Link from 'next/link';
import { useUser, useClerk } from '@clerk/nextjs';
import { ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * UserMenuProps Interface
 *
 * Story: 0-2-4 Create Navigation Components
 * AC5: UserMenu Component
 */
export interface UserMenuProps {
  /** Display variant - sidebar (default) or header (gradient border) */
  variant?: 'sidebar' | 'header';
  /** Additional CSS classes */
  className?: string;
}

/**
 * UserMenu Component
 *
 * User profile dropdown with:
 * - Clerk integration for user data
 * - Avatar with fallback to initials
 * - User name and plan badge
 * - Dropdown menu with Profile, Settings, Sign Out
 * - Two variants: sidebar (full card) and header (avatar only)
 *
 * @see hyyve_home_dashboard/code.html lines 86-93 for sidebar variant
 * @see hyyve_module_builder/code.html lines 123-127 for header variant
 */
export function UserMenu({ variant = 'sidebar', className }: UserMenuProps) {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  // Loading skeleton
  if (!isLoaded) {
    return <UserMenuSkeleton variant={variant} />;
  }

  // Not signed in
  if (!user) {
    return null;
  }

  // User details
  const displayName =
    user.fullName || user.firstName || user.emailAddresses[0]?.emailAddress || 'User';
  const avatarUrl = user.imageUrl;
  const initials = getInitials(displayName);

  const handleSignOut = () => {
    signOut({ redirectUrl: '/' });
  };

  // Header variant - just avatar with gradient border
  if (variant === 'header') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'size-9 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 p-[2px] cursor-pointer',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              className
            )}
            aria-label="User menu"
          >
            <div className="size-full rounded-full bg-black overflow-hidden">
              {avatarUrl ? (
                <img
                  alt={`${displayName}'s avatar`}
                  className="rounded-full w-full h-full object-cover"
                  src={avatarUrl}
                />
              ) : (
                <div className="size-full flex items-center justify-center bg-card-dark text-white text-xs font-medium">
                  {initials}
                </div>
              )}
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 border border-card-border bg-card-dark"
        >
          <DropdownMenuItem
            className="cursor-pointer focus:bg-card-border focus:text-white"
            asChild
          >
            <Link href="/profile" className="flex items-center gap-2">
              <User className="size-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer focus:bg-card-border focus:text-white"
            asChild
          >
            <Link href="/settings" className="flex items-center gap-2">
              <Settings className="size-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-card-border" />
          <DropdownMenuItem
            className="cursor-pointer focus:bg-card-border focus:text-white text-red-400"
            onClick={handleSignOut}
          >
            <LogOut className="size-4 mr-2" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Sidebar variant - full card with user info
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'flex w-full items-center gap-3 rounded-lg border border-card-border bg-card-dark p-3',
            'hover:border-primary/50 transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            className
          )}
          aria-label="User menu"
        >
          {/* Avatar */}
          <div className="h-9 w-9 rounded-full bg-cover bg-center overflow-hidden flex-shrink-0">
            {avatarUrl ? (
              <img
                alt={`${displayName}'s avatar`}
                className="w-full h-full object-cover"
                src={avatarUrl}
              />
            ) : (
              <div className="size-full flex items-center justify-center bg-primary text-white text-sm font-medium">
                {initials}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex flex-1 flex-col overflow-hidden text-left">
            <p className="truncate text-sm font-medium text-white">{displayName}</p>
            <p className="truncate text-xs text-text-secondary">Pro Plan</p>
          </div>

          {/* Expand Icon */}
          <ChevronDown className="size-4 text-text-secondary flex-shrink-0" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="top"
        className="w-56 border border-card-border bg-card-dark"
      >
        <DropdownMenuItem
          className="cursor-pointer focus:bg-card-border focus:text-white"
          asChild
        >
          <Link href="/profile" className="flex items-center gap-2">
            <User className="size-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer focus:bg-card-border focus:text-white"
          asChild
        >
          <Link href="/settings" className="flex items-center gap-2">
            <Settings className="size-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-card-border" />
        <DropdownMenuItem
          className="cursor-pointer focus:bg-card-border focus:text-white text-red-400"
          onClick={handleSignOut}
        >
          <LogOut className="size-4 mr-2" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Loading skeleton for UserMenu
 */
function UserMenuSkeleton({ variant }: { variant: 'sidebar' | 'header' }) {
  if (variant === 'header') {
    return (
      <div className="size-9 rounded-full bg-card-border animate-pulse" />
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-card-border bg-card-dark p-3">
      <div className="h-9 w-9 rounded-full bg-card-border animate-pulse" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-4 w-24 rounded bg-card-border animate-pulse" />
        <div className="h-3 w-16 rounded bg-card-border animate-pulse" />
      </div>
    </div>
  );
}

/**
 * Get user initials from display name
 */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default UserMenu;
