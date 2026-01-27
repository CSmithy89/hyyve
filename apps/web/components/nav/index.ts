/**
 * Navigation Components - Barrel Export
 *
 * Story: 0-2-4 Create Navigation Components
 *
 * This file exports all navigation components and their TypeScript interfaces
 * for consistent importing across the application.
 *
 * Usage:
 *   import { AppHeader, AppSidebar, BuilderHeader } from '@/components/nav';
 *   import type { NavItem, BreadcrumbItem } from '@/components/nav';
 */

// =============================================================================
// CONSTANTS
// =============================================================================

// Shared navigation constants
export { DEFAULT_NAV_ITEMS } from './constants';

// =============================================================================
// COMPONENT EXPORTS
// =============================================================================

// HyyveLogo - Logo component with icon and full variants
export { HyyveLogo } from './HyyveLogo';
export type { HyyveLogoProps } from './HyyveLogo';

// NavLink - Reusable navigation link with active state
export { NavLink } from './NavLink';
export type { NavLinkProps, NavItem } from './NavLink';

// Breadcrumbs - Dynamic breadcrumb navigation
export { Breadcrumbs } from './Breadcrumbs';
export type { BreadcrumbsProps, BreadcrumbItem } from './Breadcrumbs';

// UserMenu - User profile dropdown with Clerk integration
export { UserMenu } from './UserMenu';
export type { UserMenuProps } from './UserMenu';

// AppHeader - Dashboard/Settings header bar
export { AppHeader } from './AppHeader';
export type { AppHeaderProps } from './AppHeader';

// AppSidebar - Main sidebar navigation
export { AppSidebar } from './AppSidebar';
export type { AppSidebarProps } from './AppSidebar';

// MobileNav - Mobile navigation drawer
export { MobileNav } from './MobileNav';
export type { MobileNavProps } from './MobileNav';

// BuilderHeader - Builder-specific header
export { BuilderHeader } from './BuilderHeader';
export type { BuilderHeaderProps } from './BuilderHeader';
