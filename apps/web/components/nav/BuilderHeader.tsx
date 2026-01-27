'use client';

import * as React from 'react';
import { Play, Save, Share2, Settings, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs';
import { UserMenu } from './UserMenu';

/**
 * BuilderHeaderProps Interface
 *
 * Story: 0-2-4 Create Navigation Components
 * AC3: BuilderHeader Component
 */
export interface BuilderHeaderProps {
  /** Breadcrumb items for navigation path */
  breadcrumbs: BreadcrumbItem[];
  /** Callback when Run button is clicked */
  onRun?: () => Promise<void> | void;
  /** Callback when Save button is clicked */
  onSave?: () => Promise<void> | void;
  /** Callback when Export button is clicked */
  onExport?: () => Promise<void> | void;
  /** Callback when Settings button is clicked */
  onSettings?: () => void;
  /** Whether a run operation is in progress */
  isRunning?: boolean;
  /** Whether a save operation is in progress */
  isSaving?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * BuilderHeader Component
 *
 * Builder-specific header featuring:
 * - h-16 (64px) fixed height matching AppHeader
 * - Logo with vertical separator
 * - Breadcrumbs navigation
 * - Action buttons: Run (with glow), Save, Export
 * - Settings button (icon only)
 * - User avatar with gradient border
 * - Loading states for Run and Save buttons
 *
 * @see hyyve_module_builder/code.html lines 83-129 for wireframe reference
 */
export function BuilderHeader({
  breadcrumbs,
  onRun,
  onSave,
  onExport,
  onSettings,
  isRunning = false,
  isSaving = false,
  className,
}: BuilderHeaderProps) {
  return (
    <header
      className={cn(
        'h-16 flex-none flex items-center justify-between border-b border-border-dark bg-[#131221] px-6 z-20',
        className
      )}
      role="banner"
    >
      {/* Left Section - Logo & Breadcrumbs */}
      <div className="flex items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="size-8 text-primary">
            <svg
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 className="text-white text-xl font-bold tracking-tight">Hyyve</h2>
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-border-dark" aria-hidden="true" />

        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Right Section - Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Run Button - Primary with glow effect */}
        <Button
          className={cn(
            'h-9 px-4 bg-primary hover:bg-primary-dark text-white text-sm font-bold',
            'shadow-[0_0_15px_rgba(80,72,229,0.3)]',
            'transition-all'
          )}
          onClick={onRun}
          disabled={isRunning}
          aria-label={isRunning ? 'Running...' : 'Run workflow'}
        >
          {isRunning ? (
            <Loader2 className="size-5 mr-2 animate-spin" aria-hidden="true" />
          ) : (
            <Play className="size-5 mr-2" aria-hidden="true" />
          )}
          <span>{isRunning ? 'Running...' : 'Run'}</span>
        </Button>

        {/* Save Button - Secondary */}
        <Button
          variant="secondary"
          className="h-9 px-4 bg-[#272546] hover:bg-[#34315c] text-white text-sm font-bold"
          onClick={onSave}
          disabled={isSaving}
          aria-label={isSaving ? 'Saving...' : 'Save workflow'}
        >
          {isSaving ? (
            <Loader2 className="size-[18px] mr-2 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="size-[18px] mr-2" aria-hidden="true" />
          )}
          <span>{isSaving ? 'Saving...' : 'Save'}</span>
        </Button>

        {/* Export Button - Secondary */}
        <Button
          variant="secondary"
          className="h-9 px-4 bg-[#272546] hover:bg-[#34315c] text-white text-sm font-bold"
          onClick={onExport}
          aria-label="Export workflow"
        >
          <Share2 className="size-[18px] mr-2" aria-hidden="true" />
          <span>Export</span>
        </Button>

        {/* Separator */}
        <div className="w-px h-6 bg-border-dark mx-1" aria-hidden="true" />

        {/* Settings Button - Icon only */}
        <Button
          variant="ghost"
          size="icon"
          className="size-9 rounded-full bg-[#272546] hover:bg-[#34315c] text-white"
          onClick={onSettings}
          aria-label="Settings"
        >
          <Settings className="size-5" aria-hidden="true" />
        </Button>

        {/* User Avatar - Header variant with gradient border */}
        <UserMenu variant="header" />
      </div>
    </header>
  );
}

export default BuilderHeader;
