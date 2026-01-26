'use client';

import * as React from 'react';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';

/**
 * AppShell Props Interface
 *
 * Story: 0-2-3 Create Layout Shells
 * AC1: AppShell Layout - Main authenticated layout for dashboard, settings, projects
 */
export interface AppShellProps {
  /** Page content rendered in the main area */
  children: React.ReactNode;
  /** Custom sidebar content */
  sidebarContent?: React.ReactNode;
  /** Custom header actions (right side) */
  headerRight?: React.ReactNode;
  /** Custom header content (left side, after hamburger on mobile) */
  headerLeft?: React.ReactNode;
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
  headerLeft,
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

      {/* Desktop Sidebar - Hidden on mobile (md:flex) */}
      <aside
        className={cn(
          'hidden w-64 flex-col justify-between border-r border-border bg-background p-4 md:flex'
        )}
        role="complementary"
        aria-label="Main navigation sidebar"
      >
        {sidebarContent || <DefaultSidebarContent />}
      </aside>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col overflow-hidden bg-background">
        {/* Top Header - Fixed h-16 height */}
        <header
          className={cn(
            'flex h-16 items-center justify-between border-b border-border px-6 py-3',
            'bg-background/50 backdrop-blur-md sticky top-0 z-10'
          )}
          role="banner"
        >
          {/* Mobile Menu Button and Header Left Content */}
          <div className="flex items-center gap-4 md:hidden">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-64 bg-background p-4 border-border"
              >
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Main navigation sidebar for mobile devices
                </SheetDescription>
                {sidebarContent || <DefaultSidebarContent />}
              </SheetContent>
            </Sheet>
            {headerLeft || (
              <h2 className="text-lg font-bold text-foreground">Hyyve</h2>
            )}
          </div>

          {/* Desktop Header Left Content */}
          <div className="hidden md:flex flex-1">
            {headerLeft || <div className="flex-1" />}
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center gap-4">{headerRight}</div>
        </header>

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

/**
 * Default sidebar content placeholder
 * Can be replaced by passing sidebarContent prop
 */
function DefaultSidebarContent() {
  return (
    <div className="flex flex-col gap-6">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
          <span className="text-primary-foreground text-xl font-bold">H</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-foreground text-lg font-bold leading-none tracking-tight">
            Hyyve
          </h1>
          <p className="text-muted-foreground text-xs font-medium">
            AI Platform
          </p>
        </div>
      </div>

      {/* Navigation placeholder */}
      <nav className="flex flex-col gap-2" aria-label="Main navigation">
        <span className="px-3 text-xs text-muted-foreground">
          Navigation content here
        </span>
      </nav>
    </div>
  );
}

export default AppShell;
