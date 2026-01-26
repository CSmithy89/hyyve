/**
 * Protocol Stack Exports
 *
 * This module exports all protocol-related components and utilities
 * for CopilotKit and AG-UI integration.
 */

// CopilotKit exports
export { CopilotKitProvider, CopilotKit } from './copilotkit';
export type { CopilotKitProviderProps } from './copilotkit';

// AG-UI exports
export {
  createAGUIClient,
  useAGUI,
  filterEventsByType,
  getTextContent,
  isRunComplete,
  getRunError,
  AGUIEventType,
} from './ag-ui';
export type {
  AGUIClient,
  UseAGUIOptions,
  UseAGUIReturn,
  AGUIEvent,
  AGUIClientOptions,
  AGUIStreamOptions,
} from './ag-ui';

// Type exports
export type {
  AGUIEventTypeValue,
  BaseAGUIEvent,
  RunStartedEvent,
  RunFinishedEvent,
  RunErrorEvent,
  StepStartedEvent,
  StepFinishedEvent,
  StepErrorEvent,
  TextMessageStartEvent,
  TextMessageContentEvent,
  TextMessageEndEvent,
  ToolCallStartEvent,
  ToolCallArgsEvent,
  ToolCallEndEvent,
  ToolCallResultEvent,
  StateSnapshotEvent,
  StateDeltaEvent,
  ActivityStartEvent,
  ActivityDeltaEvent,
  ActivityEndEvent,
  MessagesSnapshotEvent,
  RawEvent,
  CustomEvent,
  ThoughtStartEvent,
  ThoughtContentEvent,
  ThoughtEndEvent,
  MetadataEvent,
} from './types';
