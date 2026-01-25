# Hyyve Protocol Stack Specification

**Version:** 1.0.0
**Date:** 2026-01-26

---

## Protocol Overview

Hyyve uses a unified protocol stack for agent-to-user and agent-to-agent communication:

```
┌─────────────────────────────────────────────────────────────────┐
│                       Frontend (Next.js)                        │
├─────────────────────────────────────────────────────────────────┤
│  CopilotKit Provider  │  A2UI Renderer  │  AG-UI Client        │
└───────────┬───────────┴────────┬────────┴─────────┬────────────┘
            │                    │                  │
            ▼                    ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AG-UI Protocol (SSE)                         │
│              25 Event Types + Binary Protobuf                   │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                  AgentOS Runtime (FastAPI)                      │
├─────────────────────────────────────────────────────────────────┤
│  /agui endpoint  │  /agents/{id}/runs  │  /a2a/* endpoints     │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    A2A Protocol (Agent-to-Agent)                │
│              /.well-known/agent-card.json Discovery             │
└─────────────────────────────────────────────────────────────────┘
```

---

## AG-UI Protocol (Agent-to-User Interface)

### Event Types (25 Total)

#### Lifecycle Events
| Event | Description |
|-------|-------------|
| `RunStartedEvent` | Agent run begins |
| `RunFinishedEvent` | Run completed successfully |
| `RunErrorEvent` | Error during run |
| `StepStartedEvent` | Step within run begins |
| `StepFinishedEvent` | Step completed |

#### Text Message Events
| Event | Description |
|-------|-------------|
| `TextMessageStartEvent` | Start of streamed message |
| `TextMessageContentEvent` | Incremental content chunk (`delta`) |
| `TextMessageEndEvent` | End of message |
| `TextMessageChunkEvent` | Auto-converted to start/content/end |

#### Tool Call Events
| Event | Description |
|-------|-------------|
| `ToolCallStartEvent` | Tool call initiated |
| `ToolCallArgsEvent` | Tool arguments |
| `ToolCallEndEvent` | Tool call completed |
| `ToolCallResultEvent` | Tool execution result |

#### State Management Events
| Event | Description |
|-------|-------------|
| `StateSnapshotEvent` | Complete agent state |
| `StateDeltaEvent` | Incremental state change |
| `MessagesSnapshotEvent` | Full conversation history |

#### Activity Events
| Event | Description |
|-------|-------------|
| `ActivitySnapshotEvent` | Activity state snapshot |
| `ActivityDeltaEvent` | Activity change |

#### Special Events
| Event | Description |
|-------|-------------|
| `RawEvent` | Raw payload passthrough |
| `CustomEvent` | Application-specific events |

### SSE Streaming Format

```
POST /agui
Content-Type: application/json
Accept: text/event-stream

{
  "threadId": "thread_123",
  "runId": "run_456",
  "messages": [...],
  "state": {...},
  "tools": [...],
  "context": {...}
}

Response (SSE):
data: {"type":"RUN_STARTED","runId":"run_456","timestamp":"2026-01-26T12:00:00Z"}

data: {"type":"TEXT_MESSAGE_START","messageId":"msg_789"}

data: {"type":"TEXT_MESSAGE_CONTENT","messageId":"msg_789","delta":"Hello"}

data: {"type":"TEXT_MESSAGE_CONTENT","messageId":"msg_789","delta":" from Bond!"}

data: {"type":"TEXT_MESSAGE_END","messageId":"msg_789"}

data: {"type":"RUN_FINISHED","runId":"run_456"}
```

### Binary Protocol (Alternative)

For efficiency, AG-UI supports Protocol Buffers:
```
Accept: application/x-ag-ui-protobuf
```

---

## A2UI Protocol (Generative UI)

A2UI is Google's declarative, LLM-friendly specification for agents to generate dynamic UIs.

### Message Types

| Type | Description |
|------|-------------|
| `beginRendering` | Initiate rendering for surface with root component |
| `surfaceUpdate` | Update components on surface |
| `dataModelUpdate` | Update data model for dynamic content |

### User Action Events

| Event | Description |
|-------|-------------|
| `a2ui.action` | User interacted with A2UI component (button click, etc.) |

### Integration with CopilotKit

```typescript
// Frontend setup
import { createA2UIMessageRenderer } from '@copilotkit/a2ui-renderer';

const a2uiRenderer = createA2UIMessageRenderer({
  // Component mappings
});

<CopilotKitProvider
  runtimeUrl="/api/copilot"
  messageRenderer={a2uiRenderer}
>
  {children}
</CopilotKitProvider>
```

### A2UI JSONL Format

```jsonl
{"type":"beginRendering","surface":"main","root":{"component":"Card","props":{"title":"Results"}}}
{"type":"surfaceUpdate","surface":"main","components":[{"id":"btn1","component":"Button","props":{"label":"Continue"}}]}
{"type":"dataModelUpdate","surface":"main","data":{"results":[...]}}
```

---

## A2A Protocol (Agent-to-Agent)

### Agent Discovery

Each agent exposes a discovery endpoint:

```
GET /a2a/agents/{agent_id}/.well-known/agent-card.json

Response:
{
  "protocolVersion": "0.3.0",
  "name": "Bond",
  "description": "Module Builder specialist",
  "capabilities": {
    "streaming": true,
    "tools": true,
    "memory": true
  },
  "skills": [
    { "id": "createWorkflow", "name": "Create Workflow" },
    { "id": "addNode", "name": "Add Node" },
    { "id": "validateDAG", "name": "Validate DAG" }
  ],
  "endpoints": {
    "send": "/a2a/agents/bond/v1/message:send",
    "stream": "/a2a/agents/bond/v1/message:stream"
  }
}
```

### Inter-Agent Communication

**Non-Streaming:**
```
POST /a2a/agents/{agent_id}/v1/message:send

{
  "from": "artie",
  "to": "bond",
  "message": "Create a workflow that processes the images from my canvas",
  "context": {
    "canvasId": "canvas_123",
    "outputNodes": ["img_001", "img_002"]
  }
}

Response:
{
  "messageId": "msg_456",
  "response": "I've created a workflow with 3 nodes...",
  "artifacts": {
    "workflowId": "wf_789"
  }
}
```

**Streaming:**
```
POST /a2a/agents/{agent_id}/v1/message:stream
Accept: text/event-stream

(Returns AG-UI event stream)
```

---

## Hyyve Agent Endpoints Summary

### AgentOS Provided (Use Directly)

| Protocol | Endpoint | Purpose |
|----------|----------|---------|
| AG-UI | `POST /agui` | Primary chat interface |
| AG-UI | `GET /agui/status` | Interface status |
| AG-UI | `POST /agents/{id}/runs` | Agent execution (SSE) |
| A2A | `GET /a2a/agents/{id}/.well-known/agent-card.json` | Agent discovery |
| A2A | `POST /a2a/agents/{id}/v1/message:send` | Non-streaming message |
| A2A | `POST /a2a/agents/{id}/v1/message:stream` | Streaming message |
| A2A | `GET /a2a/teams/{id}/.well-known/agent-card.json` | Team discovery |
| A2A | `POST /a2a/teams/{id}/v1/message:send` | Send to team |
| A2A | `POST /a2a/teams/{id}/v1/message:stream` | Stream to team |

### Hyyve Custom (Implement)

| Protocol | Endpoint | Purpose |
|----------|----------|---------|
| DCRL | `GET /api/v1/dcrl/state/{sessionId}` | Get current DCRL state |
| DCRL | `POST /api/v1/dcrl/detect` | Analyze intent, return confidence |
| DCRL | `POST /api/v1/dcrl/clarify` | Submit clarification question |
| DCRL | `POST /api/v1/dcrl/resolve` | Execute resolved action |
| DCRL | `POST /api/v1/dcrl/learn` | Record learning feedback |
| Checkpoint | `GET /api/v1/workflows/{id}/checkpoints` | List checkpoints |
| Checkpoint | `POST /api/v1/workflows/{id}/checkpoint` | Create checkpoint |
| Checkpoint | `POST /api/v1/checkpoints/{id}/rewind` | Rewind to checkpoint |
| MCP Registry | `GET /api/v1/mcp/registry/sync` | Sync from upstream |
| MCP Registry | `GET /api/v1/mcp/registry/sources` | List registry sources |
| MCP Registry | `GET /api/v1/mcp/upstream/v0.1/servers` | Proxy official MCP API |

---

## Frontend Integration Example

```typescript
// app/providers.tsx
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotKitCSSProperties } from '@copilotkit/react-ui';
import { createA2UIMessageRenderer } from '@copilotkit/a2ui-renderer';
import { AgUiClient } from '@ag-ui/client';

const a2uiRenderer = createA2UIMessageRenderer({
  components: {
    Card: MyCardComponent,
    Button: MyButtonComponent,
    Form: MyFormComponent,
  }
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit
      runtimeUrl={process.env.NEXT_PUBLIC_AGENTOS_URL}
      messageRenderer={a2uiRenderer}
    >
      {children}
    </CopilotKit>
  );
}
```

```typescript
// hooks/useAgentChat.ts
import { useCopilotChat } from '@copilotkit/react-core';

export function useAgentChat(agentId: string) {
  const {
    messages,
    sendMessage,
    isLoading,
    state
  } = useCopilotChat({
    agentId,
    // AG-UI events handled automatically
  });

  return { messages, sendMessage, isLoading, state };
}
```

---

## Package Dependencies

```json
{
  "dependencies": {
    "@copilotkit/react-core": "^1.51.2",
    "@copilotkit/react-ui": "^1.51.2",
    "@copilotkit/a2ui-renderer": "^1.51.2",
    "@ag-ui/client": "^0.0.43"
  }
}
```

---

## Validation Status

| Issue from Report | Resolution |
|-------------------|------------|
| Protocol Mismatch (REST vs tRPC) | ✅ AgentOS uses FastAPI REST - aligned |
| Agent Memory System Missing | ✅ AgentOS `/memories/*` endpoints |
| Cross-Agent Handoff | ✅ AgentOS `/a2a/*` endpoints |
| Async Execution Model | ✅ AgentOS SSE streaming |
| A2A Discovery Missing | ✅ `/.well-known/agent-card.json` |
| MCP Registry Versioning | ✅ Custom `/api/v1/mcp/registry/*` endpoints (see api-endpoints.md) |
| DCRL Pattern Backend | ✅ Custom `/api/v1/dcrl/*` endpoints (see api-endpoints.md) |
| Checkpoint/Undo | ✅ Custom `/api/v1/workflows/{id}/checkpoint` + `/checkpoints/*` (see api-endpoints.md) |

**8 of 8 critical issues resolved.**
- 5 provided by AgentOS runtime
- 3 specified as Hyyve custom endpoints in `api-endpoints.md`
