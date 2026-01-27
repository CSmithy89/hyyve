'use client';

import * as React from 'react';
import { AppHeader, AppSidebar, MobileNav } from '@/components/nav';

/**
 * AppShell Props Interface
 *
 * Story: 0-2-3 Create Layout Shells
 * AC1: AppShell Layout - Main authenticated layout for dashboard, settings, projects
 * Updated in Story 0-2-4 to integrate navigation components
 */
export interface AppShellProps {
  /** Page content rendered in the main area */
  children: React.ReactNode;
  /** Custom sidebar content (overrides AppSidebar) */
  sidebarContent?: React.ReactNode;
  /** Custom header actions (right side) */
  headerRight?: React.ReactNode;
  /** Custom header content (left side, after hamburger on mobile) */
  headerLeft?: React.ReactNode;
  /** Current active path for navigation highlighting */
  activePath?: string;
}

/**
 * AppShell Layout Component
 *
 * Main authenticated layout featuring:
 * - Fixed top navigation bar with h-16 (64px) height
 * - Collapsible sidebar with w-64 (256px) width on desktop
 * - Sidebar hidden on mobile, accessible via hamburger menu (Sheet)
 * - Main content area that fills remaining space with scrolling
 *
 * Uses CSS custom properties from globals.css for theming.
 *
 * @see hyyve_home_dashboard/code.html for wireframe reference
 */
export function AppShell({
  children,
  sidebarContent,
  headerRight,
  // headerLeft is available in props but AppHeader handles mobile layout internally
  headerLeft: _headerLeft,
  activePath,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      {/* Desktop Sidebar - Uses AppSidebar navigation component */}
      {sidebarContent || <AppSidebar activePath={activePath} />}

      {/* Mobile Navigation Drawer */}
      <MobileNav
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        activePath={activePath}
      />

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col overflow-hidden bg-background">
        {/* Top Header - Uses AppHeader navigation component */}
        <AppHeader
          onMenuClick={() => setSidebarOpen(true)}
          rightContent={headerRight}
        />

        {/* Scrollable Content Area */}
        <div
          id="main-content"
          className="flex-1 overflow-y-auto"
          role="main"
          tabIndex={-1}
        >
          {children}
        </div>
      </main>
    </div>
  );
}

export default AppShell;
