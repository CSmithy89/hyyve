/**
 * ModuleBuilderHeader Component
 *
 * Story: 0-2-11 Implement Module Builder UI Shell
 * AC5: Top Navigation Bar
 *
 * Top navigation bar with breadcrumbs, Run, Save, Export buttons.
 * Matches wireframe design from hyyve_module_builder/code.html lines 83-129.
 */

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HyyveLogo } from '@/components/nav/HyyveLogo';
import { cn } from '@/lib/utils';

export interface ModuleBuilderHeaderProps {
  workspaceName?: string;
  projectName?: string;
  workflowName?: string;
  className?: string;
}

export function ModuleBuilderHeader({
  workspaceName = 'Hyyve',
  projectName = 'Project Alpha',
  workflowName = 'Workflow 1',
  className,
}: ModuleBuilderHeaderProps) {
  return (
    <header
      className={cn(
        'h-16 flex-none flex items-center justify-between border-b border-border-dark bg-[#131221] px-6 z-20',
        className
      )}
    >
      {/* Left: Logo and Breadcrumbs */}
      <div className="flex items-center gap-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3">
          <HyyveLogo className="size-8 text-primary" />
          <h2 className="text-white text-xl font-bold tracking-tight">Hyyve</h2>
        </Link>

        {/* Separator */}
        <div className="h-6 w-px bg-border-dark" />

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
          <Link
            href="/dashboard"
            className="text-text-secondary hover:text-white transition-colors"
          >
            {workspaceName}
          </Link>
          <span className="material-symbols-outlined text-text-secondary text-[16px]">
            chevron_right
          </span>
          <Link
            href="/projects"
            className="text-text-secondary hover:text-white transition-colors"
          >
            {projectName}
          </Link>
          <span className="material-symbols-outlined text-text-secondary text-[16px]">
            chevron_right
          </span>
          <span className="text-white font-medium bg-[#272546] px-2 py-0.5 rounded text-xs">
            {workflowName}
          </span>
        </nav>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Undo / Redo */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-[#272546] hover:bg-[#34315c] text-white"
            aria-label="Undo"
          >
            <span className="material-symbols-outlined text-[18px]">undo</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-[#272546] hover:bg-[#34315c] text-white"
            aria-label="Redo"
          >
            <span className="material-symbols-outlined text-[18px]">redo</span>
          </Button>
        </div>

        {/* Run Button */}
        <Button
          className="gap-2 bg-primary hover:bg-primary-dark shadow-[0_0_15px_rgba(80,72,229,0.3)]"
          size="sm"
        >
          <span className="material-symbols-outlined text-[18px]">play_arrow</span>
          <span>Run</span>
        </Button>

        {/* Save Button */}
        <Button
          variant="secondary"
          className="gap-2 bg-[#272546] hover:bg-[#34315c] text-white border-0"
          size="sm"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          <span>Save</span>
        </Button>

        {/* Export Button */}
        <Button
          variant="secondary"
          className="gap-2 bg-[#272546] hover:bg-[#34315c] text-white border-0"
          size="sm"
        >
          <span className="material-symbols-outlined text-[18px]">share</span>
          <span>Export</span>
        </Button>

        {/* Separator */}
        <div className="w-px h-6 bg-border-dark mx-1" />

        {/* Settings Button */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-[#272546] hover:bg-[#34315c] text-white"
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </Button>

        {/* User Avatar with gradient border */}
        <div className="rounded-full bg-gradient-to-br from-pink-500 to-orange-400 p-0.5">
          <Avatar className="size-8">
            <AvatarImage src="/avatars/user.png" alt="User" />
            <AvatarFallback className="bg-[#1c1a2e] text-white text-sm">
              U
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

export default ModuleBuilderHeader;
