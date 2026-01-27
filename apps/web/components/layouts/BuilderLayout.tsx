'use client';

import * as React from 'react';
import { Plus, Minus, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BuilderHeader, BreadcrumbItem } from '@/components/nav';

/**
 * BuilderLayout Props Interface
 *
 * Story: 0-2-3 Create Layout Shells
 * AC2: BuilderLayout - Three-panel layout for Module Builder, Chatbot Builder, etc.
 * Updated in Story 0-2-4 to integrate BuilderHeader navigation component
 */
export interface BuilderLayoutProps {
  /** Canvas content (center panel) */
  children: React.ReactNode;
  /** Left panel content (knowledge base, intents, tools) */
  leftPanel?: React.ReactNode;
  /** Right panel content (agent chat assistant) */
  rightPanel?: React.ReactNode;
  /** Header actions (right side of header) - deprecated, use onRun/onSave/onExport */
  headerActions?: React.ReactNode;
  /** Breadcrumbs items for navigation path */
  breadcrumbs?: BreadcrumbItem[];
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
}

/**
 * BuilderLayout Component
 *
 * Three-panel layout for builders featuring:
 * - Fixed header with h-16 (64px) height
 * - Left sidebar panel with w-72 (288px) width
 * - Center canvas area with flex-1 (fills remaining space)
 * - Right chat panel with w-80 (320px) width
 * - Canvas uses bg-canvas-dark with dot-grid pattern
 * - Floating zoom controls in canvas area
 * - Support for fullscreen toggle to collapse panels
 *
 * Uses CSS custom properties from globals.css for theming.
 *
 * @see hyyve_module_builder/code.html for wireframe reference
 */
export function BuilderLayout({
  children,
  leftPanel,
  rightPanel,
  // headerActions is deprecated - kept for backwards compatibility
  headerActions: _headerActions,
  breadcrumbs,
  onRun,
  onSave,
  onExport,
  onSettings,
  isRunning,
  isSaving,
}: BuilderLayoutProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = React.useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = React.useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setLeftPanelCollapsed(true);
      setRightPanelCollapsed(true);
    } else {
      setLeftPanelCollapsed(false);
      setRightPanelCollapsed(false);
    }
  };

  // Default breadcrumbs if not provided
  const defaultBreadcrumbs: BreadcrumbItem[] = [
    { label: 'Hyyve', href: '/dashboard' },
    { label: 'Project', href: '/projects' },
    { label: 'Workflow' },
  ];
  const leftPanelContent = leftPanel || <DefaultLeftPanel />;
  const rightPanelContent = rightPanel || <DefaultRightPanel />;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Top Navigation Bar - Uses BuilderHeader component */}
      <BuilderHeader
        breadcrumbs={breadcrumbs || defaultBreadcrumbs}
        onRun={onRun}
        onSave={onSave}
        onExport={onExport}
        onSettings={onSettings}
        isRunning={isRunning}
        isSaving={isSaving}
      />

      {/* Main Workspace - Three Panel Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile: Tabbed panels */}
        <div className="flex flex-1 lg:hidden">
          <Tabs defaultValue="canvas" className="flex flex-1 flex-col">
            <div className="border-b border-border bg-background px-4 py-3">
              <TabsList className="w-full">
                <TabsTrigger value="left" className="flex-1">
                  Panels
                </TabsTrigger>
                <TabsTrigger value="canvas" className="flex-1">
                  Canvas
                </TabsTrigger>
                <TabsTrigger value="right" className="flex-1">
                  Chat
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="left" className="mt-0 flex-1 overflow-auto">
              <div className="h-full bg-background">{leftPanelContent}</div>
            </TabsContent>
            <TabsContent value="canvas" className="mt-0 flex-1 overflow-hidden">
              <CanvasPanel
                isFullscreen={isFullscreen}
                onToggleFullscreen={toggleFullscreen}
              >
                {children}
              </CanvasPanel>
            </TabsContent>
            <TabsContent value="right" className="mt-0 flex-1 overflow-auto">
              <div className="h-full bg-background">{rightPanelContent}</div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop: Three-panel layout */}
        <div className="hidden lg:flex flex-1 overflow-hidden relative">
          {/* Left Panel: Knowledge Base */}
          {!leftPanelCollapsed && (
            <aside
              className={cn(
                'w-72 flex-none bg-background border-r border-border flex flex-col z-10'
              )}
              role="complementary"
              aria-label="Knowledge base panel"
            >
              {leftPanelContent}
            </aside>
          )}

          <CanvasPanel
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
          >
            {children}
          </CanvasPanel>

          {/* Right Panel: Agent Chat */}
          {!rightPanelCollapsed && (
            <aside
              className={cn(
                'w-80 flex-none bg-background border-l border-border flex flex-col z-10'
              )}
              role="complementary"
              aria-label="Agent chat panel"
            >
              {rightPanelContent}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

function CanvasPanel({
  children,
  isFullscreen,
  onToggleFullscreen,
}: {
  children: React.ReactNode;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}) {
  return (
    <main
      className={cn(
        'flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing',
        'bg-canvas-dark'
      )}
      role="main"
    >
      {/* Background Grid - Dot Grid Pattern */}
      <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" />

      {/* Canvas Content */}
      <div className="absolute inset-0 z-10">{children}</div>

      {/* Floating Zoom Controls - Bottom Left */}
      <ZoomControls
        onToggleFullscreen={onToggleFullscreen}
        isFullscreen={isFullscreen}
      />
    </main>
  );
}

/**
 * Zoom Controls Component
 * Floating controls in the bottom-left of the canvas
 */
function ZoomControls({
  onToggleFullscreen,
  isFullscreen,
}: {
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}) {
  return (
    <div
      className="absolute bottom-6 left-6 z-30 flex flex-col gap-2"
      role="toolbar"
      aria-label="Canvas zoom controls"
    >
      {/* Zoom Buttons */}
      <div className="bg-background border border-border rounded-lg p-1 shadow-xl flex flex-col">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-foreground hover:bg-secondary"
          aria-label="Zoom in"
          tabIndex={0}
        >
          <Plus className="size-4" aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-foreground hover:bg-secondary"
          aria-label="Zoom out"
          tabIndex={0}
        >
          <Minus className="size-4" aria-hidden="true" />
        </Button>
        <div className="h-px bg-border my-0.5" aria-hidden="true" />
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-foreground hover:bg-secondary"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Toggle fullscreen'}
          onClick={onToggleFullscreen}
          tabIndex={0}
        >
          {isFullscreen ? (
            <Minimize2 className="size-4" aria-hidden="true" />
          ) : (
            <Maximize2 className="size-4" aria-hidden="true" />
          )}
        </Button>
      </div>

      {/* Minimap */}
      <div
        className="bg-background border border-border rounded-lg size-16 shadow-xl overflow-hidden relative"
        title="Minimap"
      >
        {/* Minimap representation */}
        <div className="absolute top-2 left-2 w-4 h-2 bg-primary/40 rounded-sm" />
        <div className="absolute top-2 left-8 w-4 h-3 bg-muted-foreground/30 rounded-sm" />
        <div className="absolute bottom-4 left-5 w-4 h-2 bg-muted-foreground/30 rounded-sm" />
        <div className="absolute inset-0 border-2 border-primary/30 pointer-events-none" />
      </div>
    </div>
  );
}

/**
 * Default left panel placeholder
 */
function DefaultLeftPanel() {
  return (
    <div className="flex flex-col h-full">
      {/* Panel Header */}
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-1">
          Knowledge Base
        </h3>
        <p className="text-muted-foreground text-xs">Manage context sources</p>
      </div>

      {/* Content placeholder */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <p className="text-muted-foreground text-sm">Left panel content</p>
      </div>
    </div>
  );
}

/**
 * Default right panel placeholder
 */
function DefaultRightPanel() {
  return (
    <div className="flex flex-col h-full">
      {/* Panel Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-foreground font-semibold text-sm tracking-wide">
            Agent Bond
          </h3>
        </div>
      </div>

      {/* Chat Area placeholder */}
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-muted-foreground text-sm">Right panel content</p>
      </div>
    </div>
  );
}

export default BuilderLayout;
