'use client';

/**
 * useMockToolCall Hook - Simulate tool calls
 *
 * Story: 0-2-7 Create AG-UI Mock Provider
 * AC8: useMockToolCall() hook
 *
 * Features:
 * - Track active tool calls
 * - Return tool call results
 * - simulateToolCall() action
 *
 * @see protocol-events.yaml
 */

import * as React from 'react';
import type { ToolCallState } from '@/lib/mock/ag-ui-types';

// =============================================================================
// HOOK OPTIONS
// =============================================================================

export interface UseMockToolCallOptions {
  /** Delay before returning result (ms) */
  executionDelay?: number;
  /** Callback when tool starts */
  onToolStart?: (toolName: string, toolCallId: string) => void;
  /** Callback when tool completes */
  onToolComplete?: (toolCallId: string, result: unknown) => void;
  /** Callback when tool fails */
  onToolError?: (toolCallId: string, error: string) => void;
}

// =============================================================================
// TOOL CALL CONFIG
// =============================================================================

export interface ToolCallConfig {
  /** Tool name */
  name: string;
  /** Tool arguments */
  args?: Record<string, unknown>;
  /** Mock result to return */
  mockResult?: unknown;
  /** Mock error to throw */
  mockError?: string;
  /** Execution delay override */
  delay?: number;
}

// =============================================================================
// HOOK RETURN TYPE
// =============================================================================

export interface UseMockToolCallReturn {
  /** Active tool calls */
  activeToolCalls: ToolCallState[];
  /** Completed tool results by ID */
  toolResults: Map<string, unknown>;
  /** Whether any tool is running */
  isExecuting: boolean;
  /** Simulate a tool call */
  simulateToolCall: (config: ToolCallConfig) => Promise<unknown>;
  /** Clear all tool call state */
  clearToolCalls: () => void;
  /** Get result for a specific tool call */
  getResult: (toolCallId: string) => unknown | undefined;
}

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

/**
 * useMockToolCall Hook
 *
 * Provides mock tool call functionality for testing
 * tool-related UI components.
 */
export function useMockToolCall({
  executionDelay = 1000,
  onToolStart,
  onToolComplete,
  onToolError,
}: UseMockToolCallOptions = {}): UseMockToolCallReturn {
  const [toolCalls, setToolCalls] = React.useState<ToolCallState[]>([]);
  const [results, setResults] = React.useState<Map<string, unknown>>(new Map());

  // Track active tool calls
  const activeToolCalls = React.useMemo(
    () => toolCalls.filter((tc) => tc.status === 'running' || tc.status === 'pending'),
    [toolCalls]
  );

  const isExecuting = activeToolCalls.length > 0;

  // Simulate a tool call
  const simulateToolCall = React.useCallback(
    async (config: ToolCallConfig): Promise<unknown> => {
      const toolCallId = `tc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const delay = config.delay ?? executionDelay;

      // Add to active tool calls
      const newToolCall: ToolCallState = {
        id: toolCallId,
        name: config.name,
        args: config.args,
        status: 'running',
      };

      setToolCalls((prev) => [...prev, newToolCall]);
      onToolStart?.(config.name, toolCallId);

      // Simulate execution delay
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Handle error case
      if (config.mockError) {
        setToolCalls((prev) =>
          prev.map((tc) =>
            tc.id === toolCallId
              ? { ...tc, status: 'failed', error: config.mockError }
              : tc
          )
        );
        onToolError?.(toolCallId, config.mockError);
        throw new Error(config.mockError);
      }

      // Success case
      const result = config.mockResult ?? { success: true };

      setToolCalls((prev) =>
        prev.map((tc) =>
          tc.id === toolCallId
            ? { ...tc, status: 'completed', result }
            : tc
        )
      );

      setResults((prev) => new Map(prev).set(toolCallId, result));
      onToolComplete?.(toolCallId, result);

      return result;
    },
    [executionDelay, onToolStart, onToolComplete, onToolError]
  );

  // Clear all tool calls
  const clearToolCalls = React.useCallback(() => {
    setToolCalls([]);
    setResults(new Map());
  }, []);

  // Get result for specific tool call
  const getResult = React.useCallback(
    (toolCallId: string) => results.get(toolCallId),
    [results]
  );

  return {
    activeToolCalls,
    toolResults: results,
    isExecuting,
    simulateToolCall,
    clearToolCalls,
    getResult,
  };
}

export default useMockToolCall;
