/**
 * Observability Module
 *
 * This module provides observability utilities for the Hyyve platform.
 *
 * @example
 * ```typescript
 * import {
 *   traceLLMCall,
 *   traceAgentRun,
 *   traceToolExecution,
 *   flushLangfuse,
 * } from '@/lib/observability';
 * ```
 */

// Langfuse tracing utilities
export {
  // Client management
  getLangfuseClient,
  shutdownLangfuse,
  flushLangfuse,
  isLangfuseConfigured,
  // Trace wrappers
  traceLLMCall,
  traceAgentRun,
  traceToolExecution,
  createWorkflowTrace,
  // Cost tracking
  MODEL_COSTS,
  calculateCost,
  // Types
  type LLMUsage,
  type GenerationUpdate,
  type SpanUpdate,
  type GenerationContext,
  type SpanContext,
} from './langfuse';
