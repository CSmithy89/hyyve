/**
 * Module Builder Page
 *
 * Story: 0-2-11 Implement Module Builder UI Shell
 * AC1: Three-panel layout at /builders/module/[id]
 * AC2: Panel layout with resizable panels
 * AC3: Sample workflow nodes
 * AC4: Canvas controls (zoom, minimap)
 *
 * Main module builder page with three-panel layout:
 * - Left: Knowledge Base file browser
 * - Center: Flow canvas with sample nodes
 * - Right: Agent Bond chat interface
 */

'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { KnowledgeBasePanel } from '@/components/builders/module';
import { WorkflowNodes } from '@/components/builders/module/WorkflowNodes';
import { FlowCanvas } from '@/components/canvas/FlowCanvas';
import { AgentChat } from '@/components/chat/AgentChat';
import type { Message } from '@/components/chat/types';
import type { Node, Edge } from '@xyflow/react';
import { WORKFLOW_NODES, WORKFLOW_EDGES } from '@/lib/mock-data/module-builder';

const LEFT_PANEL_MIN = 240;
const LEFT_PANEL_MAX = 420;
const RIGHT_PANEL_MIN = 280;
const RIGHT_PANEL_MAX = 460;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function ModuleBuilderPage() {
  // Convert mock data to React Flow format
  const initialNodes: Node[] = useMemo(
    () =>
      WORKFLOW_NODES.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: {
          label: node.label,
          ...node.config,
          isActive: node.isActive,
        },
      })),
    []
  );

  const initialEdges: Edge[] = useMemo(
    () =>
      WORKFLOW_EDGES.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        type: 'custom',
        animated: edge.animated,
        data: {
          edgeType:
            edge.type === 'success'
              ? 'success'
              : edge.type === 'failure'
                ? 'error'
                : 'default',
          animated: edge.type === 'failure', // Dashed animation for failure edges
        },
      })),
    []
  );

  const [leftPanelWidth, setLeftPanelWidth] = useState(288);
  const [rightPanelWidth, setRightPanelWidth] = useState(320);

  // Track drag cleanup to prevent listener leaks on unmount
  const dragCleanupRef = useRef<(() => void) | null>(null);

  // Clean up drag listeners on unmount
  useEffect(() => {
    return () => {
      dragCleanupRef.current?.();
    };
  }, []);

  const startResize =
    (side: 'left' | 'right') => (event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    const startX = event.clientX;
    const startLeft = leftPanelWidth;
    const startRight = rightPanelWidth;

    const handleMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      if (side === 'left') {
        setLeftPanelWidth(
          clamp(startLeft + deltaX, LEFT_PANEL_MIN, LEFT_PANEL_MAX)
        );
      } else {
        setRightPanelWidth(
          clamp(startRight - deltaX, RIGHT_PANEL_MIN, RIGHT_PANEL_MAX)
        );
      }
    };

    const cleanup = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      dragCleanupRef.current = null;
    };

    const handleUp = () => cleanup();

    // Store cleanup for unmount protection
    dragCleanupRef.current = cleanup;

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  // Mock messages for Agent Bond
  const mockMessages: Message[] = [
    {
      id: 'msg-1',
      role: 'agent',
      content: "I've analyzed the Product_Manual.pdf you just uploaded.",
      timestamp: new Date(),
    },
    {
      id: 'msg-2',
      role: 'agent',
      content:
        'Should I automatically connect it as a context source to the LLM Processing node?',
      timestamp: new Date(),
      quickActions: [
        { id: 'action-connect', label: 'Yes, connect it', variant: 'primary' },
        { id: 'action-summary', label: 'No, show summary', variant: 'secondary' },
      ],
    },
    {
      id: 'msg-3',
      role: 'user',
      content: 'Yes, go ahead. Also increase the temperature to 0.8.',
      timestamp: new Date(),
    },
  ];

  return (
    <div className="flex flex-1 overflow-hidden relative">
      {/* Left Panel: Knowledge Base */}
      <div
        className="flex-none relative"
        style={{ width: leftPanelWidth }}
      >
        <KnowledgeBasePanel className="w-full" />
        <div
          role="separator"
          aria-label="Resize knowledge base panel"
          aria-orientation="vertical"
          className="absolute right-0 top-0 z-20 h-full w-1.5 cursor-col-resize bg-transparent hover:bg-primary/30 transition-colors"
          onMouseDown={startResize('left')}
        />
      </div>

      {/* Center Panel: Flow Canvas */}
      <main className="flex-1 relative bg-canvas-dark overflow-hidden">
        <ReactFlowProvider>
          <FlowCanvas
            initialNodes={initialNodes}
            initialEdges={initialEdges}
            nodeTypes={WorkflowNodes}
            showMiniMap={true}
            showControls={true}
          />
        </ReactFlowProvider>
      </main>

      {/* Right Panel: Agent Bond Chat */}
      <div
        className="flex-none relative"
        style={{ width: rightPanelWidth }}
      >
        <AgentChat
          className="w-full"
          agentId="bond"
          messages={mockMessages}
          isTyping={true}
          status="online"
        />
        <div
          role="separator"
          aria-label="Resize agent chat panel"
          aria-orientation="vertical"
          className="absolute left-0 top-0 z-20 h-full w-1.5 cursor-col-resize bg-transparent hover:bg-primary/30 transition-colors"
          onMouseDown={startResize('right')}
        />
      </div>
    </div>
  );
}
