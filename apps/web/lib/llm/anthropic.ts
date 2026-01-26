/**
 * Anthropic SDK Configuration
 *
 * Provides Claude client with retry handling, streaming support,
 * tool use, and cost tracking integration with Langfuse.
 */

import Anthropic from '@anthropic-ai/sdk';
import type { Message, MessageParam, Tool } from '@anthropic-ai/sdk/resources';
import {
  CLAUDE_MODELS,
  DEFAULT_MODEL,
  type ClaudeModelId,
  type ChatCompletionOptions,
  type ChatCompletionResult,
  type CostResult,
  type StreamEventHandlers,
  type TokenUsage,
  type ToolDefinition,
  type ToolUseResult,
} from './types';

/**
 * Default configuration values
 *
 * Default model: claude-sonnet-4-20250514 (see types.ts for all models)
 */
const DEFAULT_TIMEOUT = 60000; // 60 seconds
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_MAX_TOKENS = 4096;

/**
 * Singleton Anthropic client instance
 */
let clientInstance: Anthropic | null = null;

/**
 * Get or create the Anthropic client instance
 */
export function getAnthropicClient(): Anthropic {
  if (!clientInstance) {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error(
        'ANTHROPIC_API_KEY environment variable is not set. ' +
          'Please set it in your .env.local file.'
      );
    }

    clientInstance = new Anthropic({
      apiKey,
      timeout: DEFAULT_TIMEOUT,
      maxRetries: DEFAULT_MAX_RETRIES,
    });
  }

  return clientInstance;
}

/**
 * Reset the client instance (for testing)
 */
export function resetAnthropicClient(): void {
  clientInstance = null;
}

/**
 * Calculate cost from token usage
 */
export function calculateCost(
  model: ClaudeModelId,
  usage: TokenUsage
): CostResult {
  const modelConfig = CLAUDE_MODELS[model];

  const inputCost = (usage.inputTokens / 1_000_000) * modelConfig.inputCostPer1M;
  const outputCost =
    (usage.outputTokens / 1_000_000) * modelConfig.outputCostPer1M;

  return {
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost,
  };
}

/**
 * Convert tool definitions to Anthropic format
 */
function toAnthropicTools(tools: ToolDefinition[]): Tool[] {
  return tools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    input_schema: tool.inputSchema,
  }));
}

/**
 * Extract tool use results from message content
 */
function extractToolUse(message: Message): ToolUseResult[] {
  const toolCalls: ToolUseResult[] = [];

  for (const block of message.content) {
    if (block.type === 'tool_use') {
      toolCalls.push({
        toolUseId: block.id,
        name: block.name,
        input: block.input as Record<string, unknown>,
      });
    }
  }

  return toolCalls;
}

/**
 * Extract text content from message
 */
function extractTextContent(message: Message): string {
  const textBlocks = message.content
    .filter((block) => block.type === 'text')
    .map((block) => {
      if (block.type === 'text') {
        return block.text;
      }
      return '';
    });

  return textBlocks.join('');
}

/**
 * Create a chat completion (non-streaming)
 */
export async function createChatCompletion(
  messages: MessageParam[],
  options: ChatCompletionOptions = {}
): Promise<ChatCompletionResult> {
  const client = getAnthropicClient();
  const model = options.model || DEFAULT_MODEL;

  const message = await client.messages.create({
    model,
    max_tokens: options.maxTokens || DEFAULT_MAX_TOKENS,
    messages,
    system: options.system,
    temperature: options.temperature,
    stop_sequences: options.stopSequences,
    tools: options.tools ? toAnthropicTools(options.tools) : undefined,
  });

  const usage: TokenUsage = {
    inputTokens: message.usage.input_tokens,
    outputTokens: message.usage.output_tokens,
  };

  const cost = calculateCost(model, usage);
  const toolCalls = extractToolUse(message);

  return {
    content: extractTextContent(message),
    stopReason: message.stop_reason || 'end_turn',
    usage,
    cost,
    toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
  };
}

/**
 * Create a streaming chat completion
 */
export async function createStreamingChatCompletion(
  messages: MessageParam[],
  handlers: StreamEventHandlers,
  options: ChatCompletionOptions = {}
): Promise<void> {
  const client = getAnthropicClient();
  const model = options.model || DEFAULT_MODEL;

  let inputTokens = 0;
  let outputTokens = 0;

  try {
    const stream = client.messages.stream({
      model,
      max_tokens: options.maxTokens || DEFAULT_MAX_TOKENS,
      messages,
      system: options.system,
      temperature: options.temperature,
      stop_sequences: options.stopSequences,
      tools: options.tools ? toAnthropicTools(options.tools) : undefined,
    });

    // Handle stream events
    stream.on('text', (text: string) => {
      handlers.onTextDelta?.(text);
    });

    stream.on('message', (message: Message) => {
      inputTokens = message.usage.input_tokens;
      outputTokens = message.usage.output_tokens;

      // Handle tool use
      const toolCalls = extractToolUse(message);
      for (const tool of toolCalls) {
        handlers.onToolUse?.(tool);
      }
    });

    // Wait for stream to complete
    await stream.finalMessage();

    handlers.onComplete?.({
      inputTokens,
      outputTokens,
    });
  } catch (error) {
    handlers.onError?.(error instanceof Error ? error : new Error(String(error)));
    throw error;
  }
}

/**
 * Create a simple text completion (convenience wrapper)
 */
export async function completeText(
  prompt: string,
  options: ChatCompletionOptions = {}
): Promise<string> {
  const result = await createChatCompletion(
    [{ role: 'user', content: prompt }],
    options
  );
  return result.content;
}

/**
 * Check if Anthropic is configured
 */
export function isAnthropicConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

// Export types and constants
export {
  CLAUDE_MODELS,
  DEFAULT_MODEL,
  DEFAULT_TIMEOUT,
  DEFAULT_MAX_RETRIES,
};
export type { ClaudeModelId };
