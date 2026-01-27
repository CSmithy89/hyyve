'use client';

/**
 * AG-UI Mock Provider - Mock provider for AG-UI protocol events
 *
 * Story: 0-2-7 Create AG-UI Mock Provider
 * AC1: MockAGUIProvider context provider
 *
 * Features:
 * - React context for mock AG-UI state
 * - Scenario-based event simulation
 * - Configurable streaming delays
 * - Production swap capability via environment
 *
 * @see protocol-events.yaml lines 1-212
 */

import * as React from 'react';
import type {
  AGUIEvent,
  MockScenario,
  AgentMessage,
  ToolCallState,
  Activity,
} from './ag-ui-types';

// =============================================================================
// CONTEXT TYPES
// =============================================================================

/**
 * Mock AG-UI context state
 */
interface MockAGUIContextState {
  /** Currently loaded scenarios */
  scenarios: MockScenario[];
  /** Active scenario being played */
  activeScenario: MockScenario | null;
  /** Whether a scenario is currently running */
  isRunning: boolean;
  /** Current run ID */
  currentRunId: string | null;
  /** Messages accumulated from scenarios */
  messages: AgentMessage[];
  /** Active tool calls */
  toolCalls: ToolCallState[];
  /** Active activities */
  activities: Activity[];
  /** Current agent state */
  agentState: Record<string, unknown>;
  /** Last error */
  error: Error | null;
}

/**
 * Mock AG-UI context actions
 */
interface MockAGUIContextActions {
  /** Load a scenario */
  loadScenario: (scenario: MockScenario) => void;
  /** Start playing the active scenario */
  startScenario: (scenarioName?: string) => void;
  /** Stop the current scenario */
  stopScenario: () => void;
  /** Emit a single event manually */
  emitEvent: (event: AGUIEvent) => void;
  /** Clear all state */
  reset: () => void;
  /** Add a user message manually */
  addUserMessage: (content: string) => void;
}

type MockAGUIContextValue = MockAGUIContextState & MockAGUIContextActions;

// =============================================================================
// CONTEXT
// =============================================================================

const MockAGUIContext = React.createContext<MockAGUIContextValue | null>(null);

// =============================================================================
// PROVIDER PROPS
// =============================================================================

export interface MockAGUIProviderProps {
  /** Child components */
  children: React.ReactNode;
  /** Initial scenarios to load */
  scenarios?: MockScenario[];
  /** Default streaming delay in ms */
  defaultDelay?: number;
}

// =============================================================================
// ENVIRONMENT CHECK
// =============================================================================

/**
 * Check if we should use mock provider
 * In production with real AG-UI, this would return false
 */
const useMock = process.env.NODE_ENV !== 'production' ||
  process.env.NEXT_PUBLIC_USE_MOCK_AGUI === 'true';

// =============================================================================
// PROVIDER IMPLEMENTATION
// =============================================================================

/**
 * MockAGUIProvider Component
 *
 * Provides mock AG-UI functionality for development and testing.
 * Can be swapped for real AG-UI client in production.
 */
export function MockAGUIProvider({
  children,
  scenarios: initialScenarios = [],
  defaultDelay = 50,
}: MockAGUIProviderProps) {
  // State
  const [scenarios, setScenarios] = React.useState<MockScenario[]>(initialScenarios);
  const [activeScenario, setActiveScenario] = React.useState<MockScenario | null>(null);
  const [isRunning, setIsRunning] = React.useState(false);
  const [currentRunId, setCurrentRunId] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<AgentMessage[]>([]);
  const [toolCalls, setToolCalls] = React.useState<ToolCallState[]>([]);
  const [activities, setActivities] = React.useState<Activity[]>([]);
  const [agentState, setAgentState] = React.useState<Record<string, unknown>>({});
  const [error, setError] = React.useState<Error | null>(null);

  // Abort controller for stopping scenarios
  const abortRef = React.useRef<AbortController | null>(null);

  // Current message being streamed
  const currentMessageRef = React.useRef<{
    id: string;
    content: string;
  } | null>(null);

  // Load scenario
  const loadScenario = React.useCallback((scenario: MockScenario) => {
    setScenarios((prev) => {
      const existing = prev.findIndex((s) => s.name === scenario.name);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = scenario;
        return updated;
      }
      return [...prev, scenario];
    });
  }, []);

  // Process a single event
  const processEvent = React.useCallback((event: AGUIEvent) => {
    switch (event.type) {
      case 'RUN_STARTED':
        setCurrentRunId(event.runId);
        setIsRunning(true);
        setError(null);
        break;

      case 'RUN_FINISHED':
        setIsRunning(false);
        break;

      case 'RUN_ERROR':
        setError(new Error(event.error.message));
        setIsRunning(false);
        break;

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

      case 'TOOL_CALL_START':
        setToolCalls((prev) => [
          ...prev,
          {
            id: event.toolCallId,
            name: event.toolName,
            status: 'running',
          },
        ]);
        break;

      case 'TOOL_CALL_ARGS':
        setToolCalls((prev) =>
          prev.map((tc) =>
            tc.id === event.toolCallId ? { ...tc, args: event.args } : tc
          )
        );
        break;

      case 'TOOL_CALL_END':
        setToolCalls((prev) =>
          prev.map((tc) =>
            tc.id === event.toolCallId ? { ...tc, status: 'pending' } : tc
          )
        );
        break;

      case 'TOOL_CALL_RESULT':
        setToolCalls((prev) =>
          prev.map((tc) =>
            tc.id === event.toolCallId
              ? {
                  ...tc,
                  status: event.error ? 'failed' : 'completed',
                  result: event.result,
                  error: event.error,
                }
              : tc
          )
        );
        break;

      case 'STATE_SNAPSHOT':
        setAgentState(event.state);
        break;

      case 'STATE_DELTA':
        setAgentState((prev) => {
          const updated = { ...prev };
          for (const op of event.delta) {
            const pathParts = op.path.split('/').filter(Boolean);
            if (op.op === 'replace' || op.op === 'add') {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              let current: any = updated;
              for (let i = 0; i < pathParts.length - 1; i++) {
                current = current[pathParts[i]!];
              }
              const lastKey = pathParts[pathParts.length - 1];
              if (lastKey) current[lastKey] = op.value;
            }
          }
          return updated;
        });
        break;

      case 'ACTIVITY_SNAPSHOT':
        setActivities(event.activities);
        break;

      case 'ACTIVITY_DELTA':
        setActivities((prev) =>
          prev.map((activity) =>
            activity.id === event.activityId
              ? {
                  ...activity,
                  status: event.status ?? activity.status,
                  progress: event.progress ?? activity.progress,
                }
              : activity
          )
        );
        break;

      default:
        // Handle unknown events gracefully
        break;
    }
  }, []);

  // Emit event manually
  const emitEvent = React.useCallback(
    (event: AGUIEvent) => {
      processEvent(event);
    },
    [processEvent]
  );

  // Start scenario
  const startScenario = React.useCallback(
    async (scenarioName?: string) => {
      // Find scenario
      const scenario = scenarioName
        ? scenarios.find((s) => s.name === scenarioName)
        : activeScenario || scenarios[0];

      if (!scenario) {
        setError(new Error('No scenario available'));
        return;
      }

      setActiveScenario(scenario);
      abortRef.current = new AbortController();

      const delay = scenario.config.streamDelay ?? defaultDelay;

      try {
        for (const event of scenario.events) {
          if (abortRef.current.signal.aborted) break;

          processEvent(event);

          // Add delay between events
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err);
        }
      }
    },
    [scenarios, activeScenario, defaultDelay, processEvent]
  );

  // Stop scenario
  const stopScenario = React.useCallback(() => {
    abortRef.current?.abort();
    setIsRunning(false);
  }, []);

  // Reset state
  const reset = React.useCallback(() => {
    abortRef.current?.abort();
    setActiveScenario(null);
    setIsRunning(false);
    setCurrentRunId(null);
    setMessages([]);
    setToolCalls([]);
    setActivities([]);
    setAgentState({});
    setError(null);
    currentMessageRef.current = null;
  }, []);

  const addUserMessage = React.useCallback((content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `user_${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Context value
  const value = React.useMemo<MockAGUIContextValue>(
    () => ({
      scenarios,
      activeScenario,
      isRunning,
      currentRunId,
      messages,
      toolCalls,
      activities,
      agentState,
      error,
      loadScenario,
      startScenario,
      stopScenario,
      emitEvent,
      reset,
      addUserMessage,
    }),
    [
      scenarios,
      activeScenario,
      isRunning,
      currentRunId,
      messages,
      toolCalls,
      activities,
      agentState,
      error,
      loadScenario,
      startScenario,
      stopScenario,
      emitEvent,
      reset,
      addUserMessage,
    ]
  );

  return (
    <MockAGUIContext.Provider value={value}>
      {children}
    </MockAGUIContext.Provider>
  );
}

// =============================================================================
// CONTEXT HOOK
// =============================================================================

/**
 * Hook to access mock AG-UI context
 */
export function useMockAGUI(): MockAGUIContextValue {
  const context = React.useContext(MockAGUIContext);
  if (!context) {
    throw new Error('useMockAGUI must be used within MockAGUIProvider');
  }
  return context;
}

/**
 * Optional hook to access mock AG-UI context
 */
export function useOptionalMockAGUI(): MockAGUIContextValue | null {
  return React.useContext(MockAGUIContext);
}

// =============================================================================
// EXPORTS
// =============================================================================

export { useMock };
export type { MockAGUIContextValue };
