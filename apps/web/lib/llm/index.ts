/**
 * LLM Module
 *
 * Exports LLM clients and utilities for the Hyyve platform.
 */

// Anthropic Claude client
export {
  getAnthropicClient,
  resetAnthropicClient,
  createChatCompletion,
  createStreamingChatCompletion,
  completeText,
  calculateCost,
  isAnthropicConfigured,
  CLAUDE_MODELS,
  DEFAULT_MODEL,
  DEFAULT_TIMEOUT,
  DEFAULT_MAX_RETRIES,
} from './anthropic';

// Types
export type {
  ClaudeModelId,
  ClaudeModelConfig,
  TokenUsage,
  CostResult,
  ChatCompletionOptions,
  ChatCompletionResult,
  ToolDefinition,
  ToolUseResult,
  StreamEventType,
  StreamEventHandlers,
  MessageParam,
  ContentBlock,
} from './types';

export { CLAUDE_MODELS as ClaudeModels } from './types';
