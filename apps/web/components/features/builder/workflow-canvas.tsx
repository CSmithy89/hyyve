'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Maximize2 } from 'lucide-react';

interface WorkflowCanvasProps {
  children: React.ReactNode;
  /** Zoom level (0.5 to 2) */
  zoom?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitToScreen?: () => void;
  /** Show minimap */
  showMinimap?: boolean;
  className?: string;
}

export function WorkflowCanvas({
  children,
  zoom = 1,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  showMinimap = true,
  className,
}: WorkflowCanvasProps) {
  return (
    <main
      className={cn(
        'relative flex-1 cursor-grab overflow-hidden bg-background active:cursor-grabbing',
        className
      )}
    >
      {/* Background Grid */}
      <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-30" />

      {/* Floating Controls */}
      <div className="absolute bottom-6 left-6 z-30 flex flex-col gap-2">
        {/* Zoom Controls */}
        <div className="flex flex-col rounded-lg border border-border bg-background p-1 shadow-xl">
          <Button
            variant="ghost"
            size="icon"
            onClick={onZoomIn}
            className="h-8 w-8"
            title="Zoom In"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onZoomOut}
            className="h-8 w-8"
            title="Zoom Out"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="my-0.5 h-px bg-border" />
          <Button
            variant="ghost"
            size="icon"
            onClick={onFitToScreen}
            className="h-8 w-8"
            title="Fit to Screen"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Minimap */}
        {showMinimap && (
          <div
            className="relative h-16 w-16 overflow-hidden rounded-lg border border-border bg-background shadow-xl"
            title="Minimap"
          >
            {/* Minimap representation - would be dynamically generated */}
            <div className="absolute left-2 top-2 h-2 w-4 rounded-sm bg-primary/40" />
            <div className="absolute left-8 top-2 h-3 w-4 rounded-sm bg-muted-foreground/40" />
            <div className="absolute bottom-4 left-5 h-2 w-4 rounded-sm bg-muted-foreground/40" />
            <div className="pointer-events-none absolute inset-0 border-2 border-primary/30" />
          </div>
        )}
      </div>

      {/* SVG Layer for Connections - would be managed by @xyflow/react */}
      <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full">
        {/* Connection paths would be rendered here */}
      </svg>

      {/* Nodes Container */}
      <div
        className="absolute inset-0 z-10"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </div>
    </main>
  );
}

// =============================================================================
// Workflow Node Components
// =============================================================================

export type NodeType = 'trigger' | 'llm' | 'branch' | 'action' | 'integration';

interface WorkflowNodeProps {
  id: string;
  type: NodeType;
  title: string;
  icon?: React.ReactNode;
  /** Gradient colors for the top bar */
  gradient?: string;
  /** Whether the node is selected/active */
  isActive?: boolean;
  /** Badge text (e.g., "Active") */
  badge?: string;
  /** Position */
  position: { x: number; y: number };
  /** Node content */
  children?: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  className?: string;
}

export function WorkflowNode({
  type,
  title,
  icon,
  gradient,
  isActive = false,
  badge,
  position,
  children,
  onClick,
  className,
}: WorkflowNodeProps) {
  const defaultGradients: Record<NodeType, string> = {
    trigger: 'from-purple-500 to-indigo-500',
    llm: 'from-primary to-primary',
    branch: 'from-orange-400 to-red-400',
    action: 'from-green-500 to-emerald-500',
    integration: 'from-blue-500 to-cyan-500',
  };

  const nodeGradient = gradient || defaultGradients[type];

  return (
    <div
      className={cn(
        'absolute flex w-[200px] flex-col rounded-xl border bg-card shadow-lg transition-colors group',
        isActive ? 'border-primary shadow-[0_0_20px_rgba(80,72,229,0.15)]' : 'border-border hover:border-primary',
        className
      )}
      style={{ top: position.y, left: position.x }}
      onClick={onClick}
    >
      {/* Top Color Bar */}
      <div className={cn('h-2 rounded-t-xl bg-gradient-to-r', nodeGradient)} />

      {/* Content */}
      <div className="p-3">
        {/* Header */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold">
            {icon}
            <span>{title}</span>
          </div>
          {badge && (
            <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary">
              {badge}
            </span>
          )}
        </div>

        {/* Body */}
        {children}
      </div>

      {/* Connection Handles */}
      <NodeHandle position="left" />
      <NodeHandle position="right" />
    </div>
  );
}

// Connection Handle
interface NodeHandleProps {
  position: 'left' | 'right' | 'top' | 'bottom';
  color?: string;
}

function NodeHandle({ position, color }: NodeHandleProps) {
  const positionStyles: Record<string, string> = {
    left: 'top-1/2 -left-1.5 -translate-y-1/2',
    right: 'top-1/2 -right-1.5 -translate-y-1/2',
    top: 'left-1/2 -top-1.5 -translate-x-1/2',
    bottom: 'left-1/2 -bottom-1.5 -translate-x-1/2',
  };

  return (
    <div
      className={cn(
        'absolute h-3 w-3 cursor-crosshair rounded-full border-2 border-primary bg-background transition-transform hover:scale-125',
        positionStyles[position],
        color
      )}
    />
  );
}

// Node Setting Row
interface NodeSettingProps {
  label: string;
  value: string;
}

export function NodeSetting({ label, value }: NodeSettingProps) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="rounded bg-muted px-1 font-mono">{value}</span>
    </div>
  );
}

// Node Context Tag
interface NodeContextProps {
  icon?: React.ReactNode;
  label: string;
}

export function NodeContext({ icon, label }: NodeContextProps) {
  return (
    <span className="flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px]">
      {icon}
      {label}
    </span>
  );
}
