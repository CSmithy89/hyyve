/**
 * AG-UI Mock Library - Barrel exports
 *
 * Story: 0-2-7 Create AG-UI Mock Provider
 *
 * Exports:
 * - MockAGUIProvider - React context provider
 * - useMockAGUI - Context hook
 * - useAgentStream - Stream agent responses
 * - useMockToolCall - Simulate tool calls
 * - Type definitions
 * - Fixture utilities
 */

// =============================================================================
// PROVIDER EXPORTS
// =============================================================================

export {
  MockAGUIProvider,
  useMockAGUI,
  useOptionalMockAGUI,
  useMock,
  type MockAGUIProviderProps,
  type MockAGUIContextValue,
} from './ag-ui-provider';

// =============================================================================
// TYPE EXPORTS
// =============================================================================

// export type AGUIEvent from types (event types)
export type { AGUIEventType, AGUIEvent, RunStartedPayload, RunFinishedPayload, RunErrorPayload, StepStartedPayload, StepFinishedPayload, TextMessageStartPayload, TextMessageContentPayload, TextMessageEndPayload, TextMessageChunkPayload, ToolCallStartPayload, ToolCallArgsPayload, ToolCallEndPayload, ToolCallResultPayload, StateSnapshotPayload, StateDeltaPayload, StateDeltaOperation, MessagesSnapshotPayload, Activity, ActivitySnapshotPayload, ActivityDeltaPayload, RawEventPayload, CustomEventPayload, MockScenario, MockScenarioConfig, AgentMessage, ToolCallState } from './ag-ui-types';

export { AGUIEventTypes } from './ag-ui-types';

// =============================================================================
// HOOK EXPORTS
// =============================================================================

export { useAgentStream, type UseAgentStreamOptions, type UseAgentStreamReturn } from '@/hooks/useAgentStream';
export { useMockToolCall, type UseMockToolCallOptions, type ToolCallConfig, type UseMockToolCallReturn } from '@/hooks/useMockToolCall';

// =============================================================================
// FIXTURE UTILITIES
// =============================================================================

import type { MockScenario } from './ag-ui-types';

// Import fixture JSON files
import basicConversation from './fixtures/basic-conversation.json';
import toolCallScenario from './fixtures/tool-call-scenario.json';

/**
 * Pre-loaded fixtures for convenience
 */
export const fixtures = {
  basicConversation: basicConversation as unknown as MockScenario,
  toolCallScenario: toolCallScenario as unknown as MockScenario,
};

/**
 * Load a scenario from fixtures by name
 */
export function loadScenario(name: keyof typeof fixtures): MockScenario {
  return fixtures[name];
}

/**
 * Load a custom scenario from JSON
 */
export function loadCustomScenario(json: unknown): MockScenario {
  return json as MockScenario;
}
