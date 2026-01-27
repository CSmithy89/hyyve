/**
 * Langfuse Observability Client
 *
 * This module provides:
 * - Langfuse client initialization
 * - Trace wrappers for LLM calls, agent runs, and tool executions
 * - Cost tracking per model
 *
 * @example
 * ```typescript
 * import { traceLLMCall, traceAgentRun, traceToolExecution } from '@/lib/observability/langfuse';
 *
 * // Trace an LLM call
 * const result = await traceLLMCall('chat-completion', async (generation) => {
 *   const response = await callLLM(prompt);
 *   generation.update({
 *     output: response.content,
 *     usage: { input: response.inputTokens, output: response.outputTokens },
 *     model: 'claude-sonnet-4-20250514',
 *   });
 *   return response;
 * });
 * ```
 */

import { Langfuse } from 'langfuse';

// ============================================================================
// Types
// ============================================================================

export interface LLMUsage {
  input: number;
  output: number;
  total?: number;
}

export interface GenerationUpdate {
  output?: unknown;
  usage?: LLMUsage;
  model?: string;
  statusMessage?: string;
  metadata?: Record<string, unknown>;
}

export interface SpanUpdate {
  output?: unknown;
  statusMessage?: string;
  metadata?: Record<string, unknown>;
}

export interface GenerationContext {
  update: (data: GenerationUpdate) => void;
  end: () => void;
}

export interface SpanContext {
  update: (data: SpanUpdate) => void;
  end: () => void;
}

// ============================================================================
// Model Cost Configuration (per 1M tokens)
// ============================================================================

export const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  // Claude Sonnet 4 (default)
  'claude-sonnet-4-20250514': { input: 3.0, output: 15.0 },
  'claude-4-sonnet-20250514': { input: 3.0, output: 15.0 },

  // Claude Opus 4 (advanced)
  'claude-opus-4-20250514': { input: 15.0, output: 75.0 },
  'claude-4-opus-20250514': { input: 15.0, output: 75.0 },

  // Claude Haiku 4 (fast)
  'claude-haiku-4-20250514': { input: 0.25, output: 1.25 },
  'claude-4-haiku-20250514': { input: 0.25, output: 1.25 },

  // Legacy Claude 3.5 Sonnet
  'claude-3-5-sonnet-20241022': { input: 3.0, output: 15.0 },

  // Default fallback
  default: { input: 3.0, output: 15.0 },
};

/**
 * Calculate cost for a given model and token usage
 */
export function calculateCost(
  model: string,
  usage: LLMUsage
): { inputCost: number; outputCost: number; totalCost: number } {
  const costs = MODEL_COSTS[model] ?? MODEL_COSTS['default'];

  const inputCost = (usage.input / 1_000_000) * (costs?.input ?? 3.0);
  const outputCost = (usage.output / 1_000_000) * (costs?.output ?? 15.0);
  const totalCost = inputCost + outputCost;

  return { inputCost, outputCost, totalCost };
}

// ============================================================================
// Langfuse Client Singleton
// ============================================================================

let langfuseClient: Langfuse | null = null;
let noOpMode = false;

/**
 * No-op Langfuse client for environments without credentials.
 * Provides stub methods that do nothing, allowing code to run without Langfuse.
 */
const noOpLangfuse = {
  trace: () => ({
    generation: () => ({
      update: () => {},
      end: () => {},
    }),
    span: () => ({
      update: () => {},
      end: () => {},
    }),
    update: () => {},
  }),
  shutdownAsync: async () => {},
  flushAsync: async () => {},
} as unknown as Langfuse;

/**
 * Get the Langfuse client singleton.
 * Uses lazy initialization for serverless compatibility.
 *
 * If credentials are not configured, returns a no-op client that
 * allows the application to run without Langfuse observability.
 */
export function getLangfuseClient(): Langfuse {
  if (!langfuseClient) {
    const publicKey = process.env.LANGFUSE_PUBLIC_KEY;
    const secretKey = process.env.LANGFUSE_SECRET_KEY;
    // Support both LANGFUSE_BASE_URL (SDK standard) and LANGFUSE_HOST (legacy)
    const baseUrl = process.env.LANGFUSE_BASE_URL || process.env.LANGFUSE_HOST;

    if (!publicKey || !secretKey) {
      // In dev/test environments without credentials, use no-op mode
      // This allows the app to run without Langfuse being configured
      if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        console.warn(
          'Langfuse credentials not configured. Running in no-op mode. ' +
            'Set LANGFUSE_PUBLIC_KEY and LANGFUSE_SECRET_KEY for observability.'
        );
        noOpMode = true;
        langfuseClient = noOpLangfuse;
        return langfuseClient;
      }

      throw new Error(
        'Langfuse credentials not configured. Set LANGFUSE_PUBLIC_KEY and LANGFUSE_SECRET_KEY environment variables.'
      );
    }

    langfuseClient = new Langfuse({
      publicKey,
      secretKey,
      baseUrl: baseUrl || undefined,
      // Flush events immediately in serverless environments
      flushAt: 1,
      flushInterval: 0,
    });
  }

  return langfuseClient;
}

/**
 * Shutdown the Langfuse client
 * Call this during graceful shutdown to flush pending events
 */
export async function shutdownLangfuse(): Promise<void> {
  if (langfuseClient && !noOpMode) {
    await langfuseClient.shutdownAsync();
  }
  langfuseClient = null;
  noOpMode = false;
}

// ============================================================================
// Trace Wrapper Functions
// ============================================================================

/**
 * Trace an LLM generation call
 *
 * @param name - Name for the generation (e.g., 'chat-completion', 'summarize')
 * @param fn - Async function that performs the LLM call
 * @param options - Optional trace configuration
 * @returns The result of the function
 *
 * @example
 * ```typescript
 * const result = await traceLLMCall('summarize', async (generation) => {
 *   const response = await anthropic.messages.create({ ... });
 *   generation.update({
 *     output: response.content[0].text,
 *     usage: { input: response.usage.input_tokens, output: response.usage.output_tokens },
 *     model: 'claude-sonnet-4-20250514',
 *   });
 *   return response;
 * });
 * ```
 */
export async function traceLLMCall<T>(
  name: string,
  fn: (generation: GenerationContext) => Promise<T>,
  options?: {
    input?: unknown;
    metadata?: Record<string, unknown>;
    userId?: string;
    sessionId?: string;
    tags?: string[];
  }
): Promise<T> {
  const langfuse = getLangfuseClient();

  // Create a trace for this LLM call
  const trace = langfuse.trace({
    name,
    userId: options?.userId,
    sessionId: options?.sessionId,
    tags: options?.tags,
    metadata: options?.metadata,
    input: options?.input,
  });

  // Create a generation within the trace
  const generation = trace.generation({
    name: `${name}-generation`,
    input: options?.input,
    metadata: options?.metadata,
  });

  const generationContext: GenerationContext = {
    update: (data: GenerationUpdate) => {
      const updateData: Record<string, unknown> = {};

      if (data.output !== undefined) updateData['output'] = data.output;
      if (data.statusMessage) updateData['statusMessage'] = data.statusMessage;
      if (data.metadata) updateData['metadata'] = data.metadata;
      if (data.model) updateData['model'] = data.model;

      if (data.usage) {
        updateData['usage'] = {
          promptTokens: data.usage.input,
          completionTokens: data.usage.output,
          totalTokens: data.usage.total ?? data.usage.input + data.usage.output,
        };

        // Calculate and add cost if model is provided
        if (data.model) {
          const cost = calculateCost(data.model, data.usage);
          updateData['costDetails'] = {
            inputCost: cost.inputCost,
            outputCost: cost.outputCost,
            totalCost: cost.totalCost,
            currency: 'USD',
          };
        }
      }

      generation.update(updateData);
    },
    end: () => generation.end(),
  };

  try {
    const result = await fn(generationContext);
    generation.end();
    trace.update({ output: result });
    return result;
  } catch (error) {
    generation.update({
      statusMessage: error instanceof Error ? error.message : String(error),
      level: 'ERROR',
    });
    generation.end();
    throw error;
  }
}

/**
 * Trace an agent run
 *
 * @param name - Name for the agent (e.g., 'bond', 'wendy', 'morgan')
 * @param fn - Async function that performs the agent run
 * @param options - Optional trace configuration
 * @returns The result of the function
 *
 * @example
 * ```typescript
 * const result = await traceAgentRun('bond', async (span) => {
 *   const response = await executeAgent(agentId, input);
 *   span.update({ output: response });
 *   return response;
 * });
 * ```
 */
export async function traceAgentRun<T>(
  name: string,
  fn: (span: SpanContext) => Promise<T>,
  options?: {
    input?: unknown;
    metadata?: Record<string, unknown>;
    userId?: string;
    sessionId?: string;
    tags?: string[];
  }
): Promise<T> {
  const langfuse = getLangfuseClient();

  // Create a trace for this agent run
  const trace = langfuse.trace({
    name: `agent-${name}`,
    userId: options?.userId,
    sessionId: options?.sessionId,
    tags: ['agent', name, ...(options?.tags ?? [])],
    metadata: options?.metadata,
    input: options?.input,
  });

  // Create a span for the agent execution
  const span = trace.span({
    name: `${name}-execution`,
    input: options?.input,
    metadata: { ...options?.metadata, agentName: name },
  });

  const spanContext: SpanContext = {
    update: (data: SpanUpdate) => {
      span.update({
        output: data.output,
        statusMessage: data.statusMessage,
        metadata: data.metadata,
      });
    },
    end: () => span.end(),
  };

  try {
    const result = await fn(spanContext);
    span.end();
    trace.update({ output: result });
    return result;
  } catch (error) {
    span.update({
      statusMessage: error instanceof Error ? error.message : String(error),
      level: 'ERROR',
    });
    span.end();
    throw error;
  }
}

/**
 * Trace a tool execution
 *
 * @param name - Name of the tool (e.g., 'web_search', 'file_read')
 * @param fn - Async function that executes the tool
 * @param options - Optional trace configuration
 * @returns The result of the function
 *
 * @example
 * ```typescript
 * const result = await traceToolExecution('web_search', async (span) => {
 *   const searchResults = await search(query);
 *   span.update({ output: searchResults });
 *   return searchResults;
 * });
 * ```
 */
export async function traceToolExecution<T>(
  name: string,
  fn: (span: SpanContext) => Promise<T>,
  options?: {
    input?: unknown;
    metadata?: Record<string, unknown>;
    parentTraceId?: string;
  }
): Promise<T> {
  const langfuse = getLangfuseClient();

  // Create a trace for this tool execution
  const trace = langfuse.trace({
    name: `tool-${name}`,
    tags: ['tool', name],
    metadata: options?.metadata,
    input: options?.input,
  });

  // Create a span for the tool execution
  const span = trace.span({
    name: `${name}-execution`,
    input: options?.input,
    metadata: { ...options?.metadata, toolName: name },
  });

  const spanContext: SpanContext = {
    update: (data: SpanUpdate) => {
      span.update({
        output: data.output,
        statusMessage: data.statusMessage,
        metadata: data.metadata,
      });
    },
    end: () => span.end(),
  };

  try {
    const result = await fn(spanContext);
    span.end();
    trace.update({ output: result });
    return result;
  } catch (error) {
    span.update({
      statusMessage: error instanceof Error ? error.message : String(error),
      level: 'ERROR',
    });
    span.end();
    throw error;
  }
}

/**
 * Create a trace for a workflow execution
 * Useful for tracing multi-step workflows that include multiple LLM calls and tool executions
 *
 * @param name - Name for the workflow
 * @param options - Trace configuration
 * @returns Trace object for manual span/generation creation
 */
export function createWorkflowTrace(
  name: string,
  options?: {
    input?: unknown;
    metadata?: Record<string, unknown>;
    userId?: string;
    sessionId?: string;
    tags?: string[];
  }
) {
  const langfuse = getLangfuseClient();

  return langfuse.trace({
    name: `workflow-${name}`,
    userId: options?.userId,
    sessionId: options?.sessionId,
    tags: ['workflow', name, ...(options?.tags ?? [])],
    metadata: options?.metadata,
    input: options?.input,
  });
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Flush all pending events to Langfuse
 * Useful before serverless function termination
 */
export async function flushLangfuse(): Promise<void> {
  if (langfuseClient && !noOpMode) {
    await langfuseClient.flushAsync();
  }
}

/**
 * Check if Langfuse is configured (has credentials)
 */
export function isLangfuseConfigured(): boolean {
  return !!(process.env.LANGFUSE_PUBLIC_KEY && process.env.LANGFUSE_SECRET_KEY);
}

/**
 * Check if Langfuse is running in no-op mode
 */
export function isLangfuseNoOp(): boolean {
  return noOpMode;
}
