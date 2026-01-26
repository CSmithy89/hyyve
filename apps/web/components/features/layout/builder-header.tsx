'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Blocks,
  Play,
  Save,
  Share2,
  Settings,
  ChevronRight,
  Undo2,
  Redo2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Breadcrumb {
  label: string;
  href?: string;
}

interface BuilderHeaderProps {
  breadcrumbs: Breadcrumb[];
  onRun?: () => void;
  onSave?: () => void;
  onExport?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  isRunning?: boolean;
  isSaving?: boolean;
  user?: {
    name: string;
    avatar?: string;
  };
}

export function BuilderHeader({
  breadcrumbs,
  onRun,
  onSave,
  onExport,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  isRunning = false,
  isSaving = false,
  user,
}: BuilderHeaderProps) {
  return (
    <header className="flex h-16 flex-none items-center justify-between border-b border-border bg-background px-6">
      {/* Left: Logo & Breadcrumbs */}
      <div className="flex items-center gap-6">
        {/* Logo */}
        <Link href="/workspace" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center text-primary">
            <Blocks className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Hyyve</h2>
        </Link>

        {/* Separator */}
        <div className="h-6 w-px bg-border" />

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium">
                  {crumb.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onUndo}
            disabled={!canUndo}
            className="h-9 w-9"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRedo}
            disabled={!canRedo}
            className="h-9 w-9"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-border" />

        {/* Run Button */}
        <Button
          onClick={onRun}
          disabled={isRunning}
          className={cn(
            'gap-2 shadow-lg shadow-primary/30',
            isRunning && 'animate-pulse'
          )}
        >
          <Play className="h-4 w-4" />
          {isRunning ? 'Running...' : 'Run'}
        </Button>

        {/* Save Button */}
        <Button variant="secondary" onClick={onSave} disabled={isSaving} className="gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>

        {/* Export Button */}
        <Button variant="secondary" onClick={onExport} className="gap-2">
          <Share2 className="h-4 w-4" />
          Export
        </Button>

        <div className="mx-1 h-6 w-px bg-border" />

        {/* Settings */}
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <Settings className="h-5 w-5" />
        </Button>

        {/* User Avatar */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full p-0">
                <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
