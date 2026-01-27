# Story 0.2.7: Create AG-UI Mock Provider

## Story

As a **developer**,
I want **a mock AG-UI event provider for frontend development**,
So that **I can build and test UI without requiring the real backend**.

## Acceptance Criteria

- **AC1:** MockAGUIProvider React context provider:
  - Wraps application or component tree
  - Manages mock agent connections
  - Configurable mock scenarios

- **AC2:** Lifecycle event simulation:
  - RUN_STARTED with runId, agentId, timestamp
  - RUN_FINISHED with duration_ms
  - RUN_ERROR with error code and message

- **AC3:** Text message streaming:
  - TEXT_MESSAGE_START with messageId
  - TEXT_MESSAGE_CONTENT with delta chunks
  - TEXT_MESSAGE_END completion marker
  - Configurable streaming delays (default 50ms)

- **AC4:** Tool call sequence:
  - TOOL_CALL_START with toolCallId, toolName
  - TOOL_CALL_ARGS with arguments
  - TOOL_CALL_END completion
  - TOOL_CALL_RESULT with result or error

- **AC5:** State management events:
  - STATE_SNAPSHOT for complete state
  - STATE_DELTA with JSON Patch operations

- **AC6:** Activity tracking events:
  - ACTIVITY_SNAPSHOT with activities array
  - ACTIVITY_DELTA with status/progress updates

- **AC7:** useMockAgentStream() hook:
  - Returns messages array
  - Returns isStreaming boolean
  - Returns error state
  - startRun() action
  - stopRun() action

- **AC8:** useMockToolCall() hook:
  - Tracks active tool calls
  - Returns tool call results
  - simulateToolCall() action

- **AC9:** JSON fixture format:
  - Scenario name and description
  - Event sequence array
  - Timing configuration

- **AC10:** Production swap capability:
  - Export real AG-UI client interface
  - Environment-based provider selection
  - Same hook API for mock and real

## Technical Notes

- Uses React Context for provider pattern
- Event stream simulates SSE behavior
- Compatible with @copilotkit/react-core when connected
- TypeScript types match protocol-events.yaml exactly

## Source Reference

`protocol-events.yaml` lines 1-212

## Creates

- lib/mock/ag-ui-provider.tsx
- lib/mock/ag-ui-types.ts
- lib/mock/fixtures/basic-conversation.json
- lib/mock/fixtures/tool-call-scenario.json
- hooks/useAgentStream.ts
- hooks/useMockToolCall.ts
- lib/mock/index.ts

## Implementation Tasks

1. Create ag-ui-types.ts with all event type definitions
2. Create MockAGUIProvider context provider
3. Create basic-conversation.json fixture
4. Create tool-call-scenario.json fixture
5. Create useAgentStream.ts hook
6. Create useMockToolCall.ts hook
7. Create barrel export lib/mock/index.ts
8. Add unit tests for all components
9. Update hooks/index.ts with new exports
