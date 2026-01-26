'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, X } from 'lucide-react';

interface SidePanelProps {
  title: string;
  subtitle?: string;
  position?: 'left' | 'right';
  width?: string;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  onAdd?: () => void;
  addLabel?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function SidePanel({
  title,
  subtitle,
  position = 'left',
  width = 'w-72',
  searchPlaceholder = 'Search...',
  onSearch,
  onAdd,
  addLabel = 'Add',
  collapsible = false,
  collapsed = false,
  onToggleCollapse,
  children,
  footer,
  className,
}: SidePanelProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  if (collapsed) {
    return (
      <aside
        className={cn(
          'flex w-12 flex-none flex-col items-center border-border bg-background py-4',
          position === 'left' ? 'border-r' : 'border-l',
          className
        )}
      >
        {collapsible && (
          <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        )}
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        'flex flex-none flex-col bg-background',
        width,
        position === 'left' ? 'border-r border-border' : 'border-l border-border',
        className
      )}
    >
      {/* Header */}
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">{title}</h3>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {collapsible && (
            <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Search */}
      {onSearch && (
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-9"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-2 py-2">{children}</div>

      {/* Footer */}
      {(footer || onAdd) && (
        <div className="border-t border-border p-4">
          {footer || (
            <Button onClick={onAdd} variant="secondary" className="w-full gap-2">
              <Plus className="h-4 w-4" />
              {addLabel}
            </Button>
          )}
        </div>
      )}
    </aside>
  );
}

// File/Folder Item Component
interface FileItemProps {
  icon: React.ReactNode;
  name: string;
  size?: string;
  selected?: boolean;
  onClick?: () => void;
  onContextMenu?: () => void;
}

export function FileItem({ icon, name, size, selected, onClick, onContextMenu }: FileItemProps) {
  return (
    <div
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu?.();
      }}
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors group',
        selected
          ? 'bg-muted border border-primary/20'
          : 'hover:bg-muted/50'
      )}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className={cn('truncate text-sm font-medium', selected ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground')}>
          {name}
        </p>
        {size && <p className="text-xs text-muted-foreground">{size}</p>}
      </div>
    </div>
  );
}

// Section Component
interface SectionProps {
  title: string;
  onAdd?: () => void;
  children: React.ReactNode;
}

export function PanelSection({ title, onAdd, children }: SectionProps) {
  return (
    <div className="mb-4">
      <div className="flex cursor-pointer items-center justify-between px-3 py-1 mb-1 group">
        <span className="text-xs font-semibold uppercase text-muted-foreground group-hover:text-foreground transition-colors">
          {title}
        </span>
        {onAdd && (
          <Button variant="ghost" size="icon" onClick={onAdd} className="h-5 w-5">
            <Plus className="h-3 w-3" />
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}
