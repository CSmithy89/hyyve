/**
 * Projects Page
 *
 * Story: 0-2-9 Implement Dashboard and Project Browser
 * AC2: Project Browser at /dashboard/projects
 *
 * Project browser featuring:
 * - Grid/list view toggle
 * - Search and filter controls
 * - Project cards with status, last edited, version, owner
 * - Create new project button
 *
 * @see project_browser_&_folders/code.html for wireframe reference
 */

'use client';

import { useState, useMemo } from 'react';
import { Search, Grid, List, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProjectCard, NewProjectCard } from '@/components/dashboard';
import { ALL_PROJECTS } from '@/lib/mock-data/dashboard';

type ViewMode = 'grid' | 'list';
type StatusFilter = 'all' | 'active' | 'training' | 'paused' | 'draft';

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filteredProjects = useMemo(() => {
    return ALL_PROJECTS.filter((project) => {
      // Filter by search query
      const matchesSearch = project.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Filter by status
      const matchesStatus =
        statusFilter === 'all' || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8">
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Projects</h1>
            <p className="mt-1 text-muted-foreground">
              Manage and organize your AI projects
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Project
          </Button>
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filters and View Toggle */}
          <div className="flex items-center gap-2">
            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {statusFilter === 'all' ? 'All Status' : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('training')}>
                  Training
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('paused')}>
                  Paused
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('draft')}>
                  Draft
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-border bg-muted p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                className="h-7 w-7"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
                <span className="sr-only">Grid view</span>
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                className="h-7 w-7"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
                <span className="sr-only">List view</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="mb-4 text-sm text-muted-foreground">
          {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
        </p>

        {/* Project Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <NewProjectCard className="min-h-[200px]" />
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredProjects.map((project) => (
              <ProjectListItem key={project.id} project={project} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              No projects found
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Project List Item for list view
 */
function ProjectListItem({
  project,
}: {
  project: (typeof ALL_PROJECTS)[number];
}) {
  const statusStyles = {
    active: 'bg-emerald-500/20 text-emerald-400',
    training: 'bg-amber-500/20 text-amber-400',
    paused: 'bg-slate-500/20 text-slate-400',
    draft: 'bg-blue-500/20 text-blue-400',
  };

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50">
      {/* Thumbnail */}
      <div
        className="h-12 w-12 rounded-lg bg-cover bg-center"
        style={{
          backgroundImage: project.thumbnail
            ? `url('${project.thumbnail}')`
            : 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
        }}
      />

      {/* Info */}
      <div className="flex-1">
        <h3 className="font-medium text-foreground">{project.name}</h3>
        <p className="text-sm text-muted-foreground">
          {project.description || `Last edited ${project.lastModified}`}
        </p>
      </div>

      {/* Status */}
      <span
        className={`rounded px-2 py-1 text-xs font-medium ${statusStyles[project.status]}`}
      >
        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
      </span>

      {/* Last Modified */}
      <span className="hidden text-sm text-muted-foreground sm:block">
        {project.lastModified}
      </span>
    </div>
  );
}
