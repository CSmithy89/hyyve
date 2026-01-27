/**
 * Navigation Constants
 *
 * Story: 0-2-4 Create Navigation Components
 *
 * Shared constants for navigation components to avoid duplication.
 */

import type { NavItem } from './NavLink';

/**
 * Default Navigation Items
 *
 * Standard navigation items used by AppSidebar and MobileNav.
 * Centralized here to ensure consistency and avoid duplication.
 */
export const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/dashboard', icon: 'home' },
  { label: 'Projects', href: '/projects', icon: 'folder_open' },
  { label: 'Settings', href: '/settings', icon: 'settings' },
  { label: 'Documentation', href: '/docs', icon: 'menu_book' },
];
