'use client';

/**
 * FlowCanvas Component - Main flow canvas using @xyflow/react
 *
 * Story: 0-2-6 Create Flow Canvas Base
 * AC1: FlowCanvas with dot grid background
 * AC4: Pan and zoom interactions
 *
 * Features:
 * - Dot grid background pattern (bg-dot-grid class)
 * - Responsive sizing (fills container)
 * - Canvas dark background (#0f1115)
 * - Mouse wheel zoom
 * - Click-drag to pan
 * - Touch support for mobile
 * - Cursor changes (grab/grabbing)
 *
 * @see hyyve_module_builder/code.html lines 207-343
 */

import * as React from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
  type NodeTypes,
  type EdgeTypes,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { cn } from '@/lib/utils';
import { useCanvasStore } from '@/lib/stores/canvas-store';
import { CanvasControls } from './CanvasControls';
import { CustomEdge } from './CustomEdge';

/**
 * FlowCanvas Props
 */
export interface FlowCanvasProps {
  /** Initial nodes */
  initialNodes?: Node[];
  /** Initial edges */
  initialEdges?: Edge[];
  /** Custom node types */
  nodeTypes?: NodeTypes;
  /** Custom edge types */
  edgeTypes?: EdgeTypes;
  /** Connection handler */
  onConnect?: OnConnect;
  /** Show minimap */
  showMiniMap?: boolean;
  /** Show controls */
  showControls?: boolean;
  /** Additional class names */
  className?: string;
  /** Children (for additional overlays) */
  children?: React.ReactNode;
}

/**
 * Default edge types including CustomEdge
 */
const defaultEdgeTypes: EdgeTypes = {
  custom: CustomEdge,
  default: CustomEdge,
};

/**
 * FlowCanvas Component
 *
 * Main composition component for the flow editor.
 * Uses Zustand store for state management.
 */
export function FlowCanvas({
  initialNodes,
  initialEdges,
  nodeTypes,
  edgeTypes,
  onConnect,
  showMiniMap = true,
  showControls = true,
  className,
  children,
}: FlowCanvasProps) {
  // Get state from Zustand store
  const nodes = useCanvasStore((state) => state.nodes);
  const edges = useCanvasStore((state) => state.edges);
  const onNodesChange: OnNodesChange = useCanvasStore(
    (state) => state.onNodesChange
  );
  const onEdgesChange: OnEdgesChange = useCanvasStore(
    (state) => state.onEdgesChange
  );
  const setNodes = useCanvasStore((state) => state.setNodes);
  const setEdges = useCanvasStore((state) => state.setEdges);
  const addEdge = useCanvasStore((state) => state.addEdge);

  // Track if initial load has happened to prevent overwriting user changes
  const initializedRef = React.useRef(false);

  // Initialize with provided nodes/edges (only once on mount)
  React.useEffect(() => {
    if (initializedRef.current) return;

    if (initialNodes && initialNodes.length > 0) {
      setNodes(initialNodes);
    }
    if (initialEdges && initialEdges.length > 0) {
      setEdges(initialEdges);
    }

    initializedRef.current = true;
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Handle new connections
  const handleConnect: OnConnect = React.useCallback(
    (connection) => {
      if (connection.source && connection.target) {
        // Include handles in ID to support multiple edges between same nodes
        const handleSuffix = connection.sourceHandle || connection.targetHandle
          ? `-${connection.sourceHandle || 'out'}-${connection.targetHandle || 'in'}`
          : `-${Date.now()}`;

        addEdge({
          id: `edge-${connection.source}-${connection.target}${handleSuffix}`,
          source: connection.source,
          target: connection.target,
          sourceHandle: connection.sourceHandle ?? undefined,
          targetHandle: connection.targetHandle ?? undefined,
          type: 'custom',
        });
      }
      onConnect?.(connection);
    },
    [addEdge, onConnect]
  );

  // Merge edge types
  const mergedEdgeTypes = React.useMemo(
    () => ({
      ...defaultEdgeTypes,
      ...edgeTypes,
    }),
    [edgeTypes]
  );

  return (
    <div
      className={cn(
        // Container fills parent
        'h-full w-full min-h-[400px]',
        // Canvas dark background
        'bg-canvas-dark',
        // Cursor styles
        'cursor-grab active:cursor-grabbing',
        // Custom class
        className
      )}
      style={{ backgroundColor: '#0f1115' }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        nodeTypes={nodeTypes}
        edgeTypes={mergedEdgeTypes}
        // Interaction settings
        panOnDrag
        panOnScroll={false}
        zoomOnScroll
        zoomOnPinch
        zoomOnDoubleClick={false}
        // Min/max zoom
        minZoom={0.1}
        maxZoom={2}
        // Fit view on mount
        fitView
        fitViewOptions={{ padding: 0.2 }}
        // Style
        className="react-flow-canvas"
      >
        {/* Dot grid background */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="#374151"
          className="bg-dot-grid opacity-30"
        />

        {/* Controls and minimap */}
        {showControls && <CanvasControls showMiniMap={showMiniMap} />}

        {/* Additional children/overlays */}
        {children}
      </ReactFlow>
    </div>
  );
}

export default FlowCanvas;
