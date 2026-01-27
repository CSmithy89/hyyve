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

import { useMemo } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { KnowledgeBasePanel } from '@/components/builders/module';
import { workflowNodeTypes } from '@/components/builders/module/WorkflowNodes';
import { FlowCanvas } from '@/components/canvas/FlowCanvas';
import { AgentChat } from '@/components/chat/AgentChat';
import type { Node, Edge } from '@xyflow/react';
import { WORKFLOW_NODES, WORKFLOW_EDGES } from '@/lib/mock-data/module-builder';

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
        style:
          edge.type === 'success'
            ? { stroke: '#10b981' }
            : edge.type === 'failure'
              ? { stroke: '#ef4444', strokeDasharray: '4' }
              : undefined,
      })),
    []
  );

  // Mock messages for Agent Bond
  const mockMessages = [
    {
      id: 'msg-1',
      role: 'agent' as const,
      content: "I've analyzed the Product_Manual.pdf you just uploaded.",
      timestamp: new Date(),
    },
    {
      id: 'msg-2',
      role: 'agent' as const,
      content:
        'Should I automatically connect it as a context source to the LLM Processing node?',
      timestamp: new Date(),
      quickActions: [
        { id: 'action-connect', label: 'Yes, connect it', variant: 'primary' as const },
        { id: 'action-summary', label: 'No, show summary', variant: 'secondary' as const },
      ],
    },
    {
      id: 'msg-3',
      role: 'user' as const,
      content: 'Yes, go ahead. Also increase the temperature to 0.8.',
      timestamp: new Date(),
    },
  ];

  return (
    <div className="flex flex-1 overflow-hidden relative">
      {/* Left Panel: Knowledge Base */}
      <KnowledgeBasePanel />

      {/* Center Panel: Flow Canvas */}
      <main className="flex-1 relative bg-canvas-dark overflow-hidden">
        <ReactFlowProvider>
          <FlowCanvas
            initialNodes={initialNodes}
            initialEdges={initialEdges}
            nodeTypes={workflowNodeTypes}
            showMiniMap={true}
            showControls={true}
          />
        </ReactFlowProvider>
      </main>

      {/* Right Panel: Agent Bond Chat */}
      <AgentChat
        agentId="bond"
        messages={mockMessages}
        isTyping={true}
        status="online"
      />
    </div>
  );
}
