/**
 * AG-UI Mock Types - Type definitions for AG-UI protocol events
 *
 * Story: 0-2-7 Create AG-UI Mock Provider
 *
 * Defines all AG-UI event types matching protocol-events.yaml:
 * - Lifecycle events (RUN_STARTED, RUN_FINISHED, RUN_ERROR)
 * - Text message events (START, CONTENT, END)
 * - Tool call events (START, ARGS, END, RESULT)
 * - State events (SNAPSHOT, DELTA)
 * - Activity events (SNAPSHOT, DELTA)
 *
 * @see protocol-events.yaml lines 1-212
 */

// =============================================================================
// AG-UI EVENT TYPE ENUM
// =============================================================================

/**
 * All AG-UI event types as defined in protocol-events.yaml
 */
export const AGUIEventTypes = {
  // Lifecycle events
  RUN_STARTED: 'RUN_STARTED',
  RUN_FINISHED: 'RUN_FINISHED',
  RUN_ERROR: 'RUN_ERROR',
  STEP_STARTED: 'STEP_STARTED',
  STEP_FINISHED: 'STEP_FINISHED',

  // Text message events
  TEXT_MESSAGE_START: 'TEXT_MESSAGE_START',
  TEXT_MESSAGE_CONTENT: 'TEXT_MESSAGE_CONTENT',
  TEXT_MESSAGE_END: 'TEXT_MESSAGE_END',
  TEXT_MESSAGE_CHUNK: 'TEXT_MESSAGE_CHUNK',

  // Tool call events
  TOOL_CALL_START: 'TOOL_CALL_START',
  TOOL_CALL_ARGS: 'TOOL_CALL_ARGS',
  TOOL_CALL_END: 'TOOL_CALL_END',
  TOOL_CALL_RESULT: 'TOOL_CALL_RESULT',

  // State events
  STATE_SNAPSHOT: 'STATE_SNAPSHOT',
  STATE_DELTA: 'STATE_DELTA',
  MESSAGES_SNAPSHOT: 'MESSAGES_SNAPSHOT',

  // Activity events
  ACTIVITY_SNAPSHOT: 'ACTIVITY_SNAPSHOT',
  ACTIVITY_DELTA: 'ACTIVITY_DELTA',

  // Special events
  RAW_EVENT: 'RAW_EVENT',
  CUSTOM_EVENT: 'CUSTOM_EVENT',
} as const;

export type AGUIEventType = (typeof AGUIEventTypes)[keyof typeof AGUIEventTypes];

// =============================================================================
// LIFECYCLE EVENT PAYLOADS
// =============================================================================

export interface RunStartedPayload {
  runId: string;
  agentId: string;
  timestamp: string;
}

export interface RunFinishedPayload {
  runId: string;
  timestamp: string;
  durationMs?: number;
}

// error payload with error code and message
export interface RunErrorPayload {
  runId: string;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
}

export interface StepStartedPayload {
  runId: string;
  stepId: string;
  stepName?: string;
}

export interface StepFinishedPayload {
  runId: string;
  stepId: string;
  result?: Record<string, unknown>;
}

// =============================================================================
// TEXT MESSAGE EVENT PAYLOADS
// =============================================================================

export interface TextMessageStartPayload {
  messageId: string;
  role: 'assistant' | 'system';
}

export interface TextMessageContentPayload {
  messageId: string;
  delta: string;
}

export interface TextMessageEndPayload {
  messageId: string;
}

export interface TextMessageChunkPayload {
  messageId: string;
  content: string;
}

// =============================================================================
// TOOL CALL EVENT PAYLOADS
// =============================================================================

export interface ToolCallStartPayload {
  toolCallId: string;
  toolName: string;
  messageId?: string;
}

export interface ToolCallArgsPayload {
  toolCallId: string;
  args?: Record<string, unknown>;
  argsDelta?: string;
}

export interface ToolCallEndPayload {
  toolCallId: string;
}

export interface ToolCallResultPayload {
  toolCallId: string;
  result?: unknown;
  error?: string;
}

// =============================================================================
// STATE EVENT PAYLOADS
// =============================================================================

export interface StateSnapshotPayload {
  state: Record<string, unknown>;
}

export interface StateDeltaOperation {
  op: 'add' | 'remove' | 'replace';
  path: string;
  value?: unknown;
}

export interface StateDeltaPayload {
  delta: StateDeltaOperation[];
}

export interface MessagesSnapshotPayload {
  messages: Array<{
    role: string;
    content: string;
    timestamp?: string;
  }>;
}

// =============================================================================
// ACTIVITY EVENT PAYLOADS
// =============================================================================

export interface Activity {
  id: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress?: number;
}

export interface ActivitySnapshotPayload {
  activities: Activity[];
}

export interface ActivityDeltaPayload {
  activityId: string;
  status?: Activity['status'];
  progress?: number;
}

// =============================================================================
// SPECIAL EVENT PAYLOADS
// =============================================================================

export interface RawEventPayload {
  data: unknown;
}

export interface CustomEventPayload {
  eventType: string;
  data?: Record<string, unknown>;
}

// =============================================================================
// AG-UI EVENT UNION
// =============================================================================

export type AGUIEvent =
  | { type: 'RUN_STARTED' } & RunStartedPayload
  | { type: 'RUN_FINISHED' } & RunFinishedPayload
  | { type: 'RUN_ERROR' } & RunErrorPayload
  | { type: 'STEP_STARTED' } & StepStartedPayload
  | { type: 'STEP_FINISHED' } & StepFinishedPayload
  | { type: 'TEXT_MESSAGE_START' } & TextMessageStartPayload
  | { type: 'TEXT_MESSAGE_CONTENT' } & TextMessageContentPayload
  | { type: 'TEXT_MESSAGE_END' } & TextMessageEndPayload
  | { type: 'TEXT_MESSAGE_CHUNK' } & TextMessageChunkPayload
  | { type: 'TOOL_CALL_START' } & ToolCallStartPayload
  | { type: 'TOOL_CALL_ARGS' } & ToolCallArgsPayload
  | { type: 'TOOL_CALL_END' } & ToolCallEndPayload
  | { type: 'TOOL_CALL_RESULT' } & ToolCallResultPayload
  | { type: 'STATE_SNAPSHOT' } & StateSnapshotPayload
  | { type: 'STATE_DELTA' } & StateDeltaPayload
  | { type: 'MESSAGES_SNAPSHOT' } & MessagesSnapshotPayload
  | { type: 'ACTIVITY_SNAPSHOT' } & ActivitySnapshotPayload
  | { type: 'ACTIVITY_DELTA' } & ActivityDeltaPayload
  | { type: 'RAW_EVENT' } & RawEventPayload
  | { type: 'CUSTOM_EVENT' } & CustomEventPayload;

// =============================================================================
// MOCK SCENARIO TYPES
// =============================================================================

/**
 * Configuration for mock scenario timing
 */
export interface MockScenarioConfig {
  /** Delay between events in ms (default: 50) */
  streamDelay?: number;
  /** Delay for text message content chunks */
  chunkDelay?: number;
  /** Whether to loop the scenario */
  loop?: boolean;
}

/**
 * Mock scenario definition for JSON fixtures
 */
export interface MockScenario {
  /** Scenario name */
  name: string;
  /** Scenario description */
  description: string;
  /** Events to emit */
  events: AGUIEvent[];
  /** Timing configuration */
  config: MockScenarioConfig;
}

// =============================================================================
// MESSAGE TYPES (for hook returns)
// =============================================================================

/**
 * Message type for hook state
 */
export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

/**
 * Tool call state for tracking
 */
export interface ToolCallState {
  id: string;
  name: string;
  args?: Record<string, unknown>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: unknown;
  error?: string;
}
