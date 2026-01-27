/**
 * WorkflowNodes Component
 *
 * Story: 0-2-11 Implement Module Builder UI Shell
 * AC3: Sample Workflow Nodes
 *
 * Custom node types for the module builder canvas.
 * Matches wireframe design from hyyve_module_builder/code.html lines 244-343.
 */

'use client';

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { cn } from '@/lib/utils';

// =============================================================================
// NODE DATA TYPES
// =============================================================================

export interface TriggerNodeData {
  label: string;
  webhookUrl?: string;
  method?: string;
}

export interface LLMNodeData {
  label: string;
  model?: string;
  temperature?: number;
  contextFiles?: string[];
  isActive?: boolean;
}

export interface BranchNodeData {
  label: string;
  conditions?: { path: string; condition: string }[];
}

export interface IntegrationNodeData {
  label: string;
  integration: 'slack' | 'github' | 'email';
  channel?: string;
}

// Node props interface for custom nodes
interface CustomNodeProps<T> {
  data: T;
  selected?: boolean;
}

// =============================================================================
// TRIGGER NODE
// =============================================================================

export const TriggerNode = memo(function TriggerNode({
  data,
}: CustomNodeProps<TriggerNodeData>) {
  return (
    <div className="w-[200px] bg-[#1c1a2e] border border-border-dark rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col group hover:border-primary transition-colors">
      <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-t-xl" />
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <span className="material-symbols-outlined text-purple-400 text-[18px]">
              bolt
            </span>
            {data.label || 'Input Trigger'}
          </div>
          <span className="material-symbols-outlined text-text-secondary text-[16px]">
            more_horiz
          </span>
        </div>
        <div className="bg-[#131221] rounded p-2 mb-2">
          <p className="text-xs text-text-secondary font-mono">
            Webhook: {data.webhookUrl || '/api/v1/trigger'}
          </p>
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!size-3 !bg-white !border-2 !border-primary"
      />
    </div>
  );
});

// =============================================================================
// LLM NODE
// =============================================================================

export const LLMNode = memo(function LLMNode({
  data,
}: CustomNodeProps<LLMNodeData>) {
  return (
    <div
      className={cn(
        'w-[240px] bg-[#1c1a2e] rounded-xl flex flex-col group',
        data.isActive
          ? 'border border-primary shadow-[0_0_20px_rgba(80,72,229,0.15)]'
          : 'border border-border-dark shadow-lg'
      )}
    >
      <div className="h-2 bg-primary rounded-t-xl" />
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <span className="material-symbols-outlined text-primary text-[18px]">
              psychology
            </span>
            {data.label || 'LLM Processing'}
          </div>
          {data.isActive && (
            <div className="px-1.5 py-0.5 bg-primary/20 text-primary text-[10px] font-bold rounded uppercase">
              Active
            </div>
          )}
        </div>

        {/* Settings Preview */}
        <div className="space-y-2 mb-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">Model</span>
            <span className="text-white font-mono bg-[#131221] px-1 rounded">
              {data.model || 'GPT-4-Turbo'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">Temperature</span>
            <span className="text-white font-mono bg-[#131221] px-1 rounded">
              {data.temperature ?? 0.7}
            </span>
          </div>
        </div>

        {/* Context Files */}
        {data.contextFiles && data.contextFiles.length > 0 && (
          <div className="mt-2 pt-2 border-t border-dashed border-border-dark">
            <p className="text-[10px] text-text-secondary uppercase font-bold mb-1">
              Context
            </p>
            <div className="flex gap-1 flex-wrap">
              {data.contextFiles.map((file: string) => (
                <span
                  key={file}
                  className="text-[10px] bg-[#272546] text-white px-1.5 py-0.5 rounded flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[10px]">
                    description
                  </span>
                  {file}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!size-3 !bg-white !border-2 !border-primary"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!size-3 !bg-white !border-2 !border-primary"
      />
    </div>
  );
});

// =============================================================================
// BRANCH NODE
// =============================================================================

export const BranchNode = memo(function BranchNode({
  data,
}: CustomNodeProps<BranchNodeData>) {
  return (
    <div className="w-[200px] bg-[#1c1a2e] border border-border-dark rounded-xl shadow-lg flex flex-col group hover:border-primary transition-colors">
      <div className="h-2 bg-gradient-to-r from-orange-400 to-red-400 rounded-t-xl" />
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <span className="material-symbols-outlined text-orange-400 text-[18px]">
              alt_route
            </span>
            {data.label || 'Branch Logic'}
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between p-1.5 bg-[#131221] rounded border border-green-500/30">
            <span className="text-xs text-green-400">Success</span>
            <span className="material-symbols-outlined text-green-400 text-[14px]">
              check_circle
            </span>
          </div>
          <div className="flex items-center justify-between p-1.5 bg-[#131221] rounded border border-red-500/30">
            <span className="text-xs text-red-400">Failure</span>
            <span className="material-symbols-outlined text-red-400 text-[14px]">
              cancel
            </span>
          </div>
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!size-3 !bg-white !border-2 !border-primary"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="success"
        style={{ top: '52px' }}
        className="!size-3 !bg-green-500 !border-2 !border-[#1c1a2e]"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="failure"
        style={{ top: '92px' }}
        className="!size-3 !bg-red-500 !border-2 !border-[#1c1a2e]"
      />
    </div>
  );
});

// =============================================================================
// INTEGRATION NODE (SLACK)
// =============================================================================

export const IntegrationNode = memo(function IntegrationNode({
  data,
}: CustomNodeProps<IntegrationNodeData>) {
  return (
    <div className="w-[200px] bg-[#1c1a2e] border border-border-dark rounded-xl shadow-lg flex flex-col group hover:border-primary transition-colors">
      <div className="h-2 bg-[#4A154B] rounded-t-xl" />
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <div className="bg-white rounded p-0.5 flex">
              <span className="material-symbols-outlined text-[#4A154B] text-[12px]">
                tag
              </span>
            </div>
            {data.label || 'Slack Notify'}
          </div>
        </div>
        <div className="bg-[#131221] rounded p-2">
          <p className="text-xs text-text-secondary">
            Channel: {data.channel || '#alerts-ai'}
          </p>
        </div>
      </div>

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!size-3 !bg-white !border-2 !border-primary"
      />
    </div>
  );
});

// =============================================================================
// NODE TYPES MAP
// =============================================================================

export const WorkflowNodes = {
  trigger: TriggerNode,
  llm: LLMNode,
  branch: BranchNode,
  integration: IntegrationNode,
};

export default WorkflowNodes;
