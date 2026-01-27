/**
 * ConversationNodes Component
 *
 * Story: 0-2-12 Implement Chatbot Builder UI Shell
 * AC3: Sample Conversation Nodes
 *
 * Custom node types for the chatbot builder canvas.
 * Matches wireframe design from chatbot_builder_main/code.html lines 183-258.
 */

'use client';

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { cn } from '@/lib/utils';

// =============================================================================
// NODE DATA TYPES
// =============================================================================

export interface StartNodeData {
  label: string;
}

export interface DecisionNodeData {
  label: string;
  waitForInput?: boolean;
}

export interface BotSaysNodeData {
  label: string;
  trigger?: string;
  message?: string;
  isActive?: boolean;
}

export interface UserInputNodeData {
  label: string;
  slotName?: string;
  validation?: string;
}

// Node props interface for custom nodes
interface CustomNodeProps<T> {
  data: T;
  selected?: boolean;
}

// =============================================================================
// START NODE
// =============================================================================

export const StartNode = memo(function StartNode({
  data,
}: CustomNodeProps<StartNodeData>) {
  return (
    <div className="flex items-center justify-center w-[100px] h-[60px] rounded-full bg-[#1b1a2d] border-2 border-primary shadow-[0_0_20px_rgba(80,72,229,0.2)] cursor-pointer hover:scale-105 transition-transform">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-[20px]">
          bolt
        </span>
        <span className="font-bold text-sm text-white">
          {data.label || 'Start'}
        </span>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!size-3 !bg-primary !border-2 !border-background-dark"
      />
    </div>
  );
});

// =============================================================================
// DECISION NODE
// =============================================================================

export const DecisionNode = memo(function DecisionNode({
  data,
}: CustomNodeProps<DecisionNodeData>) {
  return (
    <div className="w-[250px] rounded-xl bg-[#1b1a2d] border border-border-dark shadow-xl cursor-pointer hover:border-primary/50 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-dark px-3 py-2 bg-background-dark/50 rounded-t-xl">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400 text-[18px]">
            alt_route
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
            Decision
          </span>
        </div>
        <span className="material-symbols-outlined text-text-secondary text-[16px]">
          more_horiz
        </span>
      </div>

      {/* Content */}
      <div className="p-3">
        <p className="text-sm font-medium mb-2 text-white">
          {data.label || 'Identify Intent'}
        </p>
        <div className="text-xs text-text-secondary bg-background-dark rounded p-2 border border-border-dark">
          Waits for user input...
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!size-3 !bg-primary !border-2 !border-background-dark"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!size-3 !bg-primary !border-2 !border-background-dark"
      />
    </div>
  );
});

// =============================================================================
// BOT SAYS NODE
// =============================================================================

export const BotSaysNode = memo(function BotSaysNode({
  data,
}: CustomNodeProps<BotSaysNodeData>) {
  return (
    <div
      className={cn(
        'w-[280px] rounded-xl bg-[#1b1a2d] shadow-xl cursor-pointer',
        data.isActive
          ? 'border border-primary shadow-[0_0_30px_rgba(80,72,229,0.1)]'
          : 'border border-border-dark opacity-75 hover:opacity-100 transition-opacity'
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between border-b border-border-dark px-3 py-2 rounded-t-xl',
          data.isActive ? 'bg-primary/10' : 'bg-background-dark/50'
        )}
      >
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'material-symbols-outlined text-[18px]',
              data.isActive ? 'text-primary' : 'text-text-secondary'
            )}
          >
            forum
          </span>
          <span
            className={cn(
              'text-xs font-bold uppercase tracking-wider',
              data.isActive ? 'text-primary' : 'text-text-secondary'
            )}
          >
            Bot Says
          </span>
        </div>
        <span className="material-symbols-outlined text-text-secondary text-[16px]">
          more_horiz
        </span>
      </div>

      {/* Content */}
      <div className="p-3">
        {data.trigger && (
          <p className="text-[10px] font-bold uppercase text-text-secondary mb-1">
            Trigger: {data.trigger}
          </p>
        )}
        <div
          className={cn(
            'text-sm bg-background-dark rounded-lg p-3 border border-border-dark leading-relaxed',
            data.isActive ? 'text-white' : 'text-text-secondary'
          )}
        >
          {data.message || 'Enter bot message...'}
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!size-3 !bg-primary !border-2 !border-background-dark"
      />
      <Handle
        type="source"
        position={Position.Right}
        className={cn(
          '!size-3 !border-2 !border-background-dark',
          data.isActive ? '!bg-primary' : '!bg-border-dark hover:!bg-primary transition-colors'
        )}
      />
    </div>
  );
});

// =============================================================================
// USER INPUT NODE
// =============================================================================

export const UserInputNode = memo(function UserInputNode({
  data,
}: CustomNodeProps<UserInputNodeData>) {
  return (
    <div className="w-[250px] rounded-xl bg-[#1b1a2d] border border-border-dark shadow-xl cursor-pointer hover:border-primary/50 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-dark px-3 py-2 bg-background-dark/50 rounded-t-xl">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-400 text-[18px]">
            chat
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
            User Input
          </span>
        </div>
        <span className="material-symbols-outlined text-text-secondary text-[16px]">
          more_horiz
        </span>
      </div>

      {/* Content */}
      <div className="p-3">
        <p className="text-sm font-medium mb-2 text-white">
          {data.label || 'Collect Input'}
        </p>
        {data.slotName && (
          <div className="text-xs text-text-secondary bg-background-dark rounded p-2 border border-border-dark">
            Slot: {data.slotName}
          </div>
        )}
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!size-3 !bg-primary !border-2 !border-background-dark"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!size-3 !bg-primary !border-2 !border-background-dark"
      />
    </div>
  );
});

// =============================================================================
// NODE TYPES MAP
// =============================================================================

export const conversationNodeTypes = {
  start: StartNode,
  decision: DecisionNode,
  bot_says: BotSaysNode,
  user_input: UserInputNode,
};

// Named export for ConversationNodes (alias for conversationNodeTypes)
export const ConversationNodes = conversationNodeTypes;

export default conversationNodeTypes;
