/**
 * Chatbot Builder Page
 *
 * Story: 0-2-12 Implement Chatbot Builder UI Shell
 * AC1: Three-panel layout at /builders/chatbot/[id]
 * AC2: Intents panel with tabs and search
 * AC3: Sample conversation nodes
 * AC4: Canvas controls (zoom, minimap)
 *
 * Main chatbot builder page with three-panel layout:
 * - Left: Intent/Entity management
 * - Center: Conversation flow canvas
 * - Right: Agent Wendy chat interface
 */

'use client';

import { useMemo } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { IntentsPanel, WendyPanel, conversationNodeTypes } from '@/components/builders/chatbot';
import { FlowCanvas } from '@/components/canvas/FlowCanvas';
import type { Node, Edge } from '@xyflow/react';
import {
  CONVERSATION_NODES,
  CONVERSATION_EDGES,
} from '@/lib/mock-data/chatbot-builder';

export default function ChatbotBuilderPage() {
  // Convert mock data to React Flow format
  const initialNodes: Node[] = useMemo(
    () =>
      CONVERSATION_NODES.map((node) => ({
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
      CONVERSATION_EDGES.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        type: 'custom',
        animated: edge.animated,
        data: {
          edgeType: 'default',
          animated: edge.style === 'dashed',
          // Use secondary color for solid edges
          color: edge.style === 'solid' ? '#272546' : undefined,
        },
      })),
    []
  );

  // Mock messages for Agent Wendy
  const mockMessages = [
    {
      id: 'msg-1',
      role: 'agent' as const,
      content:
        "I've analyzed your flow structure. It looks solid, but I found an optimization opportunity.",
      timestamp: new Date(),
    },
    {
      id: 'msg-2',
      role: 'agent' as const,
      content:
        'The intent #order_status has low confidence (85%). Consider adding more training phrases.',
      timestamp: new Date(),
      quickActions: [
        { id: 'action-add', label: 'Add to Training', variant: 'primary' as const },
        { id: 'action-ignore', label: 'Ignore', variant: 'secondary' as const },
      ],
    },
    {
      id: 'msg-3',
      role: 'agent' as const,
      content:
        'You also have a disconnected node. Should I connect it to the fallback flow?',
      timestamp: new Date(),
      quickActions: [
        { id: 'action-fix', label: 'Yes, fix it', variant: 'secondary' as const },
        { id: 'action-skip', label: 'Ignore', variant: 'secondary' as const },
      ],
    },
  ];

  return (
    <div className="flex flex-1 overflow-hidden relative">
      {/* Left Panel: Intents & Training */}
      <IntentsPanel />

      {/* Center Panel: Conversation Flow Canvas */}
      <main className="flex-1 relative bg-[#0f0e1b] overflow-hidden">
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#272546 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <ReactFlowProvider>
          <FlowCanvas
            initialNodes={initialNodes}
            initialEdges={initialEdges}
            nodeTypes={conversationNodeTypes}
            showMiniMap={false}
            showControls={true}
          />
        </ReactFlowProvider>

        {/* Add Node FAB */}
        <button className="absolute bottom-8 right-8 h-12 w-12 rounded-full bg-primary text-white shadow-lg shadow-primary/40 flex items-center justify-center hover:scale-110 transition-transform active:scale-95 z-30">
          <span className="material-symbols-outlined text-[28px]">add</span>
        </button>
      </main>

      {/* Right Panel: Agent Wendy Chat with Suggestions */}
      <WendyPanel messages={mockMessages} isTyping={false} />
    </div>
  );
}
