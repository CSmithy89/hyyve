/**
 * ProjectCard Component
 *
 * Story: 0-2-9 Implement Dashboard and Project Browser
 * AC1: Recent projects list with project cards
 *
 * Displays a project card with thumbnail, name, status badge, and last modified.
 * Matches wireframe design from hyyve_home_dashboard/code.html lines 184-232.
 */

'use client';

import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Project } from '@/lib/mock-data/dashboard';

export interface ProjectCardProps {
  /** Project data */
  project: Project;
  /** Additional CSS classes */
  className?: string;
}

const statusStyles = {
  active: {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    label: 'Active',
  },
  training: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    label: 'Training',
  },
  paused: {
    bg: 'bg-slate-500/20',
    text: 'text-slate-400',
    label: 'Paused',
  },
  draft: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    label: 'Draft',
  },
};

export function ProjectCard({ project, className }: ProjectCardProps) {
  const statusStyle = statusStyles[project.status];

  return (
    <div
      className={cn(
        'min-w-[280px] flex-1 cursor-pointer overflow-hidden rounded-xl border border-border bg-card',
        'transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5',
        className
      )}
    >
      {/* Thumbnail */}
      <div
        className="h-32 w-full bg-cover bg-center"
        style={{
          backgroundImage: project.thumbnail
            ? `url('${project.thumbnail}')`
            : 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
        }}
      >
        <div className="flex h-full w-full flex-col justify-between bg-gradient-to-t from-card to-transparent p-4">
          {/* Status Badge */}
          <div
            className={cn(
              'self-end rounded px-2 py-0.5 text-xs font-semibold backdrop-blur-sm',
              statusStyle.bg,
              statusStyle.text
            )}
          >
            {statusStyle.label}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <Link href={`/projects/${project.id}`} className="flex-1">
            <h3 className="font-bold text-foreground">{project.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Last edited {project.lastModified}
            </p>
          </Link>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Project actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Open</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>Move to folder</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

/**
 * New Project Card (placeholder for creating new projects)
 */
export function NewProjectCard({ className }: { className?: string }) {
  return (
    <Link
      href="/projects/new"
      className={cn(
        'min-w-[280px] flex-1 cursor-pointer overflow-hidden rounded-xl',
        'flex flex-col items-center justify-center gap-2',
        'border border-dashed border-border bg-card/30 p-4',
        'transition-colors hover:bg-card/50',
        className
      )}
    >
      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <span className="material-symbols-outlined text-muted-foreground">add</span>
      </div>
      <h3 className="font-bold text-foreground">New Project</h3>
    </Link>
  );
}

export default ProjectCard;
