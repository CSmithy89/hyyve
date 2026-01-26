/**
 * AG-UI Protocol Event Types
 *
 * This module defines all 25 AG-UI event types for agent-to-UI communication.
 * These events are used for streaming agent responses via Server-Sent Events (SSE).
 *
 * @see https://docs.ag-ui.com/concepts/events
 */

// ============================================================================
// AG-UI Event Type Enum
// ============================================================================

/**
 * All 25 AG-UI event types
 */
export const AGUIEventType = {
  // Agent Lifecycle Events (3)
  RUN_STARTED: 'RUN_STARTED',
  RUN_FINISHED: 'RUN_FINISHED',
  RUN_ERROR: 'RUN_ERROR',

  // Step/Execution Events (3)
  STEP_STARTED: 'STEP_STARTED',
  STEP_FINISHED: 'STEP_FINISHED',
  STEP_ERROR: 'STEP_ERROR',

  // Text Streaming Events (3)
  TEXT_MESSAGE_START: 'TEXT_MESSAGE_START',
  TEXT_MESSAGE_CONTENT: 'TEXT_MESSAGE_CONTENT',
  TEXT_MESSAGE_END: 'TEXT_MESSAGE_END',

  // Tool Execution Events (4)
  TOOL_CALL_START: 'TOOL_CALL_START',
  TOOL_CALL_ARGS: 'TOOL_CALL_ARGS',
  TOOL_CALL_END: 'TOOL_CALL_END',
  TOOL_CALL_RESULT: 'TOOL_CALL_RESULT',

  // State Management Events (2)
  STATE_SNAPSHOT: 'STATE_SNAPSHOT',
  STATE_DELTA: 'STATE_DELTA',

  // Activity Events (3)
  ACTIVITY_START: 'ACTIVITY_START',
  ACTIVITY_DELTA: 'ACTIVITY_DELTA',
  ACTIVITY_END: 'ACTIVITY_END',

  // Message Events (1)
  MESSAGES_SNAPSHOT: 'MESSAGES_SNAPSHOT',

  // Raw Events (2)
  RAW: 'RAW',
  CUSTOM: 'CUSTOM',

  // Additional Events (4)
  THOUGHT_START: 'THOUGHT_START',
  THOUGHT_CONTENT: 'THOUGHT_CONTENT',
  THOUGHT_END: 'THOUGHT_END',
  METADATA: 'METADATA',
} as const;

export type AGUIEventTypeValue = (typeof AGUIEventType)[keyof typeof AGUIEventType];

// ============================================================================
// Base Event Interface
// ============================================================================

export interface BaseAGUIEvent {
  type: AGUIEventTypeValue;
  timestamp?: number;
  runId?: string;
}

// ============================================================================
// Agent Lifecycle Events
// ============================================================================

export interface RunStartedEvent extends BaseAGUIEvent {
  type: typeof AGUIEventType.RUN_STARTED;
  runId: string;
  threadId?: string;
  agentId?: string;
  metadata?: Record<string, unknown>;
}

export interface RunFinishedEvent extends BaseAGUIEvent {
  type: typeof AGUIEventType.RUN_FINISHED;
  runId: string;
  output?: unknown;
}

export interface RunErrorEvent extends BaseAGUIEvent {
  type: typeof AGUIEventType.RUN_ERROR;
  runId: string;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

// ============================================================================
// Step/Execution Events
// ============================================================================

export interface StepStartedEvent extends BaseAGUIEvent {
  type: typeof AGUIEventType.STEP_STARTED;
  stepId: string;
  name?: string;
}

export interface StepFinishedEvent extends BaseAGUIEvent {
  type: typeof AGUIEventType.STEP_FINISHED;
  stepId: string;
  output?: unknown;
}

export interface StepErrorEvent extends BaseAGUIEvent {
  type: typeof AGUIEventType.STEP_ERROR;
  stepId: string;
  error: {
    message: string;
    code?: string;
  };
}

// ============================================================================
// Text Streaming Events
// ============================================================================

export interface TextMessageStartEvent extends BaseAGUIEvent {
  type: typeof AGUIEventType.TEXT_MESSAGE_START;
  messageId: string;
  role?: 'assistant' | 'system';
}

export interface TextMessageContentEvent extends BaseAGUIEvent {
  type: typeof AGUIEventType.TEXT_MESSAGE_CONTENT;
  messageId: string;
  content: string;
}

export interface TextMessageEndEvent extends BaseAGUIEvent {
  type: typeof AGUIEventType.TEXT_MESSAGE_END;
  messageId: string;
}

// ============================================================================
// Tool Execution Events
// ============================================================================

export interface ToolCallStartEvent extends BaseAGUIEvent {
  type: typeof AGUIEventType.TOOL_CALL_START;
  toolCallId: string;
  toolName: string;
}

export interface ToolCallArgsEvent extends BaseAGUIEvent {
  type: typeof AGUIEventType.TOOL_CALL_ARGS;
  toolCallId: string;
  args: string; // JSON string of arguments
}

export interface ToolCallEndEvent extends BaseAGUIEvent {
  type: typeof AGUIEventType.TOOL_CALL_END;
  toolCallId: string;
}

export interface ToolCallResultEvent extends BaseAGUIEvent {
  type: typeof AGUIEventType.TOOL_CALL_RESULT;
  toolCallId: string;
  result: unknown;
}

// ============================================================================
// State Management Events
// ============================================================================

export interface StateSnapshotEvent extends BaseAGUIEvent {
  type: typeof AGUIEventType.STATE_SNAPSHOT;
  state: Record<string, unknown>;
}

export interface StateDeltaEvent extends BaseAGUIEvent {
  type: typeof AGUIEventType.STATE_DELTA;
  delta: Array<{
    op: 'add' | 'remove' | 'replace';
    path: string;
    value?: unknown;
  }>;
}

// ============================================================================
// Activity Events
// ============================================================================

export interface ActivityStartEvent extends BaseAGUIEvent {
  type: typeof AGUIEventType.ACTIVITY_START;
  activityId: string;
  activityType: string;
  title?: string;
}

export interface ActivityDeltaEvent extends BaseAGUIEvent {
  type: typeof AGUIEventType.ACTIVITY_DELTA;
  activityId: string;
  progress?: number;
  message?: string;
}

export interface ActivityEndEvent extends BaseAGUIEvent {
  type: typeof AGUIEventType.ACTIVITY_END;
  activityId: string;
  status: 'success' | 'error' | 'cancelled';
}

// ============================================================================
// Message Events
// ============================================================================

export interface MessagesSnapshotEvent extends BaseAGUIEvent {
  type: typeof AGUIEventType.MESSAGES_SNAPSHOT;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
}

// ============================================================================
// Raw/Custom Events
// ============================================================================

export interface RawEvent extends BaseAGUIEvent {
  type: typeof AGUIEventType.RAW;
  data: unknown;
}

export interface CustomEvent extends BaseAGUIEvent {
  type: typeof AGUIEventType.CUSTOM;
  name: string;
  payload: unknown;
}

// ============================================================================
// Thought Events
// ============================================================================

export interface ThoughtStartEvent extends BaseAGUIEvent {
  type: typeof AGUIEventType.THOUGHT_START;
  thoughtId: string;
}

export interface ThoughtContentEvent extends BaseAGUIEvent {
  type: typeof AGUIEventType.THOUGHT_CONTENT;
  thoughtId: string;
  content: string;
}

export interface ThoughtEndEvent extends BaseAGUIEvent {
  type: typeof AGUIEventType.THOUGHT_END;
  thoughtId: string;
}

// ============================================================================
// Metadata Event
// ============================================================================

export interface MetadataEvent extends BaseAGUIEvent {
  type: typeof AGUIEventType.METADATA;
  metadata: Record<string, unknown>;
}

// ============================================================================
// Union Type
// ============================================================================

export type AGUIEvent =
  | RunStartedEvent
  | RunFinishedEvent
  | RunErrorEvent
  | StepStartedEvent
  | StepFinishedEvent
  | StepErrorEvent
  | TextMessageStartEvent
  | TextMessageContentEvent
  | TextMessageEndEvent
  | ToolCallStartEvent
  | ToolCallArgsEvent
  | ToolCallEndEvent
  | ToolCallResultEvent
  | StateSnapshotEvent
  | StateDeltaEvent
  | ActivityStartEvent
  | ActivityDeltaEvent
  | ActivityEndEvent
  | MessagesSnapshotEvent
  | RawEvent
  | CustomEvent
  | ThoughtStartEvent
  | ThoughtContentEvent
  | ThoughtEndEvent
  | MetadataEvent;

// ============================================================================
// Utility Types
// ============================================================================

export interface AGUIClientOptions {
  endpoint?: string;
  headers?: Record<string, string>;
  onEvent?: (event: AGUIEvent) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
}

export interface AGUIStreamOptions {
  agentId?: string;
  threadId?: string;
  input?: unknown;
  metadata?: Record<string, unknown>;
}
