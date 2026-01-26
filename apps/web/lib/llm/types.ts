/**
 * LLM Type Definitions
 *
 * Type definitions for LLM clients and operations.
 */

import type { MessageParam, ContentBlock } from '@anthropic-ai/sdk/resources';

/**
 * Supported Claude model IDs
 */
export type ClaudeModelId =
  | 'claude-sonnet-4-20250514'
  | 'claude-opus-4-20250514'
  | 'claude-haiku-4-20250514';

/**
 * Claude model configuration
 */
export interface ClaudeModelConfig {
  id: ClaudeModelId;
  displayName: string;
  maxTokens: number;
  inputCostPer1M: number;
  outputCostPer1M: number;
}

/**
 * Model configurations with cost information
 */
export const CLAUDE_MODELS: Record<ClaudeModelId, ClaudeModelConfig> = {
  'claude-sonnet-4-20250514': {
    id: 'claude-sonnet-4-20250514',
    displayName: 'Claude Sonnet 4',
    maxTokens: 8192,
    inputCostPer1M: 3.0,
    outputCostPer1M: 15.0,
  },
  'claude-opus-4-20250514': {
    id: 'claude-opus-4-20250514',
    displayName: 'Claude Opus 4',
    maxTokens: 8192,
    inputCostPer1M: 15.0,
    outputCostPer1M: 75.0,
  },
  'claude-haiku-4-20250514': {
    id: 'claude-haiku-4-20250514',
    displayName: 'Claude Haiku 4',
    maxTokens: 8192,
    inputCostPer1M: 0.25,
    outputCostPer1M: 1.25,
  },
};

/**
 * Default model for general use
 */
export const DEFAULT_MODEL: ClaudeModelId = 'claude-sonnet-4-20250514';

/**
 * Token usage tracking
 */
export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
}

/**
 * Cost calculation result
 */
export interface CostResult {
  inputCost: number;
  outputCost: number;
  totalCost: number;
}

/**
 * Chat completion options
 */
export interface ChatCompletionOptions {
  model?: ClaudeModelId;
  maxTokens?: number;
  temperature?: number;
  system?: string;
  tools?: ToolDefinition[];
  stopSequences?: string[];
}

/**
 * Tool definition for function calling
 */
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

/**
 * Tool use result
 */
export interface ToolUseResult {
  toolUseId: string;
  name: string;
  input: Record<string, unknown>;
}

/**
 * Stream event types
 */
export type StreamEventType =
  | 'message_start'
  | 'content_block_start'
  | 'content_block_delta'
  | 'content_block_stop'
  | 'message_delta'
  | 'message_stop';

/**
 * Stream event handler
 */
export interface StreamEventHandlers {
  onTextDelta?: (text: string) => void;
  onToolUse?: (tool: ToolUseResult) => void;
  onComplete?: (usage: TokenUsage) => void;
  onError?: (error: Error) => void;
}

/**
 * Chat completion result
 */
export interface ChatCompletionResult {
  content: string;
  stopReason: string;
  usage: TokenUsage;
  cost: CostResult;
  toolCalls?: ToolUseResult[];
}

// Re-export Anthropic types for convenience
export type { MessageParam, ContentBlock };
