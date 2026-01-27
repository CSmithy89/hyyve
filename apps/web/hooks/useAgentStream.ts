'use client';

/**
 * useAgentStream Hook - Stream agent responses
 *
 * Story: 0-2-7 Create AG-UI Mock Provider
 * AC7: useMockAgentStream() hook
 *
 * Features:
 * - Returns messages array
 * - Returns isStreaming boolean
 * - Returns error state
 * - startRun() action
 * - stopRun() action
 *
 * @see protocol-events.yaml
 */

import * as React from 'react';
import type { AgentMessage, AGUIEvent, MockScenario } from '@/lib/mock/ag-ui-types';
import { useMock, useOptionalMockAGUI } from '@/lib/mock/ag-ui-provider';

// =============================================================================
// HOOK OPTIONS
// =============================================================================

export interface UseAgentStreamOptions {
  /** Agent ID to stream from */
  agentId: string;
  /** Mock scenario to use (for development) */
  scenario?: MockScenario;
  /** Streaming delay in ms */
  streamDelay?: number;
  /** Callback when run starts */
  onRunStart?: (runId: string) => void;
  /** Callback when run finishes */
  onRunFinish?: (runId: string) => void;
  /** Callback when error occurs */
  onError?: (error: Error) => void;
}

// =============================================================================
// HOOK RETURN TYPE
// =============================================================================

export interface UseAgentStreamReturn {
  /** Accumulated messages */
  messages: AgentMessage[];
  /** Whether currently streaming */
  isStreaming: boolean;
  /** Current error, if any */
  error: Error | null;
  /** Current run ID */
  runId: string | null;
  /** Start a new run */
  startRun: (input?: string) => void;
  /** Stop the current run */
  stopRun: () => void;
  /** Clear all messages */
  clearMessages: () => void;
  /** Add a user message */
  addUserMessage: (content: string) => void;
}

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

/**
 * useAgentStream Hook
 *
 * Provides streaming agent response functionality.
 * In development, uses mock scenarios. In production,
 * connects to real AG-UI endpoint.
 */
export function useAgentStream({
  agentId,
  scenario,
  streamDelay = 50,
  onRunStart,
  onRunFinish,
  onError,
}: UseAgentStreamOptions): UseAgentStreamReturn {
  const mockAGUI = useOptionalMockAGUI();
  const shouldUseMock = Boolean(useMock && mockAGUI);

  const [messages, setMessages] = React.useState<AgentMessage[]>([]);
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [runId, setRunId] = React.useState<string | null>(null);

  const abortRef = React.useRef<AbortController | null>(null);
  const currentMessageRef = React.useRef<{
    id: string;
    content: string;
  } | null>(null);

  // Process an event
  const processEvent = React.useCallback(
    (event: AGUIEvent) => {
      switch (event.type) {
        case 'RUN_STARTED':
          setRunId(event.runId);
          setIsStreaming(true);
          setError(null);
          onRunStart?.(event.runId);
          break;

        case 'RUN_FINISHED':
          setIsStreaming(false);
          onRunFinish?.(event.runId);
          break;

        case 'RUN_ERROR': {
          const err = new Error(event.error.message);
          setError(err);
          setIsStreaming(false);
          onError?.(err);
          break;
        }

        case 'TEXT_MESSAGE_START':
          currentMessageRef.current = { id: event.messageId, content: '' };
          setMessages((prev) => [
            ...prev,
            {
              id: event.messageId,
              role: event.role === 'system' ? 'system' : 'assistant',
              content: '',
              timestamp: new Date(),
              isStreaming: true,
            },
          ]);
          break;

        case 'TEXT_MESSAGE_CONTENT':
          if (currentMessageRef.current?.id === event.messageId) {
            currentMessageRef.current.content += event.delta;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === event.messageId
                  ? { ...m, content: m.content + event.delta }
                  : m
              )
            );
          }
          break;

        case 'TEXT_MESSAGE_END':
          setMessages((prev) =>
            prev.map((m) =>
              m.id === event.messageId ? { ...m, isStreaming: false } : m
            )
          );
          currentMessageRef.current = null;
          break;

        default:
          break;
      }
    },
    [onRunStart, onRunFinish, onError]
  );

  // Start a run
  const startRun = React.useCallback(
    async (input?: string) => {
      if (shouldUseMock && mockAGUI) {
        if (input) {
          mockAGUI.addUserMessage(input);
        }
        if (scenario) {
          mockAGUI.loadScenario(scenario);
          mockAGUI.startScenario(scenario.name);
        } else {
          mockAGUI.startScenario();
        }
        return;
      }

      if (isStreaming) return;

      // Add user message if provided
      if (input) {
        const userMessage: AgentMessage = {
          id: `user_${Date.now()}`,
          role: 'user',
          content: input,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
      }

      abortRef.current = new AbortController();

      // Use scenario if provided (mock mode)
      if (scenario) {
        try {
          for (const event of scenario.events) {
            if (abortRef.current.signal.aborted) break;
            processEvent(event);
            await new Promise((resolve) =>
              setTimeout(resolve, scenario.config.streamDelay ?? streamDelay)
            );
          }
        } catch (err) {
          if (err instanceof Error && err.name !== 'AbortError') {
            setError(err);
            onError?.(err);
          }
        }
      } else {
        // In production, would connect to real AG-UI endpoint
        // For now, emit a simple greeting
        processEvent({
          type: 'RUN_STARTED',
          runId: `run_${Date.now()}`,
          agentId,
          timestamp: new Date().toISOString(),
        });

        await new Promise((resolve) => setTimeout(resolve, streamDelay));

        processEvent({
          type: 'TEXT_MESSAGE_START',
          messageId: `msg_${Date.now()}`,
          role: 'assistant',
        });

        await new Promise((resolve) => setTimeout(resolve, streamDelay));

        processEvent({
          type: 'TEXT_MESSAGE_CONTENT',
          messageId: `msg_${Date.now()}`,
          delta: `Hello! I'm ${agentId}. How can I help?`,
        });

        await new Promise((resolve) => setTimeout(resolve, streamDelay));

        processEvent({
          type: 'TEXT_MESSAGE_END',
          messageId: `msg_${Date.now()}`,
        });

        processEvent({
          type: 'RUN_FINISHED',
          runId: runId || `run_${Date.now()}`,
          timestamp: new Date().toISOString(),
        });
      }
    },
    [
      agentId,
      isStreaming,
      scenario,
      streamDelay,
      processEvent,
      onError,
      runId,
      shouldUseMock,
      mockAGUI,
    ]
  );

  // Stop the current run
  const stopRun = React.useCallback(() => {
    if (shouldUseMock && mockAGUI) {
      mockAGUI.stopScenario();
      return;
    }
    abortRef.current?.abort();
    setIsStreaming(false);
  }, [shouldUseMock, mockAGUI]);

  // Clear all messages
  const clearMessages = React.useCallback(() => {
    if (shouldUseMock && mockAGUI) {
      mockAGUI.reset();
      return;
    }
    setMessages([]);
    setError(null);
    setRunId(null);
    currentMessageRef.current = null;
  }, [shouldUseMock, mockAGUI]);

  // Add a user message
  const addUserMessage = React.useCallback((content: string) => {
    if (shouldUseMock && mockAGUI) {
      mockAGUI.addUserMessage(content);
      return;
    }
    const userMessage: AgentMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
  }, [shouldUseMock, mockAGUI]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  return {
    messages: shouldUseMock && mockAGUI ? mockAGUI.messages : messages,
    isStreaming: shouldUseMock && mockAGUI ? mockAGUI.isRunning : isStreaming,
    error: shouldUseMock && mockAGUI ? mockAGUI.error : error,
    runId: shouldUseMock && mockAGUI ? mockAGUI.currentRunId : runId,
    startRun,
    stopRun,
    clearMessages,
    addUserMessage,
  };
}

export default useAgentStream;
