# Technical Research: Agentic UI & Communication Protocols

**Date:** 2026-01-19
**Status:** Verified
**Project:** Hyyve
**Research Type:** Technical Protocol Deep Dive

---

## Executive Summary

This research analyzes the complete ecosystem of agentic UI and communication protocols that can be incorporated into our Hyyve system:

1. **CopilotKit** - The Agentic Application Platform for building AI-powered UIs
2. **AG-UI** - Agent-User Interaction Protocol (transport layer)
3. **A2UI** - Agent-to-User Interface Protocol (UI specification layer)
4. **A2A** - Agent-to-Agent Protocol (agent interoperability)
5. **MCP** - Model Context Protocol (agent-to-tool communication)

### Protocol Relationship Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    AGENTIC PROTOCOL ECOSYSTEM                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         USER LAYER                                   │    │
│  │                                                                      │    │
│  │  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │    │
│  │  │  CopilotKit  │    │    A2UI      │    │   Custom     │          │    │
│  │  │   (React)    │    │ (Declarative │    │    UIs       │          │    │
│  │  │              │    │    JSON UI)  │    │              │          │    │
│  │  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘          │    │
│  │         │                   │                   │                   │    │
│  │         └───────────────────┼───────────────────┘                   │    │
│  │                             │                                       │    │
│  └─────────────────────────────┼───────────────────────────────────────┘    │
│                                │                                             │
│                                ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      TRANSPORT LAYER                                 │    │
│  │                                                                      │    │
│  │                    ┌──────────────────┐                             │    │
│  │                    │      AG-UI       │                             │    │
│  │                    │                  │                             │    │
│  │                    │  • 25 Event Types│                             │    │
│  │                    │  • HTTP POST + SSE│                            │    │
│  │                    │  • Bidirectional │                             │    │
│  │                    └────────┬─────────┘                             │    │
│  │                             │                                       │    │
│  └─────────────────────────────┼───────────────────────────────────────┘    │
│                                │                                             │
│                                ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                       AGENT LAYER                                    │    │
│  │                                                                      │    │
│  │  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │    │
│  │  │     Agno     │◄──►│     A2A      │◄──►│ Other Agents │          │    │
│  │  │   (Agent     │    │  (Agent-to-  │    │  (LangGraph, │          │    │
│  │  │  Framework)  │    │   Agent)     │    │   CrewAI)    │          │    │
│  │  └──────┬───────┘    └──────────────┘    └──────────────┘          │    │
│  │         │                                                           │    │
│  └─────────┼───────────────────────────────────────────────────────────┘    │
│            │                                                                 │
│            ▼                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                       TOOLS LAYER                                    │    │
│  │                                                                      │    │
│  │                    ┌──────────────────┐                             │    │
│  │                    │       MCP        │                             │    │
│  │                    │                  │                             │    │
│  │                    │  • Tools         │                             │    │
│  │                    │  • Resources     │                             │    │
│  │                    │  • Prompts       │                             │    │
│  │                    └──────────────────┘                             │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: CopilotKit - The Agentic Application Platform

**Source:** [CopilotKit Documentation](https://docs.copilotkit.ai/)

### Overview

CopilotKit is an **open-source framework and cloud/self-hosted services** for building AI-powered agentic applications. It bridges AI agents with user interfaces through standardized protocols and pre-built components.

### Core UI Components

| Component | Description | Use Case |
|-----------|-------------|----------|
| **CopilotChat** | Chat interface for copilot interactions | Full conversation UI |
| **CopilotSidebar** | Sidebar-positioned chat | Persistent assistant panel |
| **CopilotPopup** | Popup-based chat interface | On-demand assistant |
| **CopilotTextarea** | AI-powered textarea replacement | In-line AI text generation |

### CopilotTextarea Features

Built on **Slate.js** editor framework:
- **Autocompletions** - AI-generated text suggestions
- **AI Editing** - Context-aware text modifications
- **Generate from Scratch** - Full text generation
- **Hovering Toolbar** - Quick AI actions
- **Debounced Suggestions** - Performance-optimized

### React Hooks

**Versioning note:** CopilotKit v1 and v2 use different package names and hook sets. v2 commonly uses `@copilotkitnext/react` for agent state + frontend tools; v1 hooks (e.g., `useCopilotAction`) are legacy. Do not mix v1/v2 packages in a single app.

#### Context Hooks
| Hook | Purpose |
|------|---------|
| **useCopilotReadable** | Provides real-time user-specific context |
| **useMakeCopilotDocumentReadable** | Gives document state to copilot |

#### Action Hooks
| Hook | Purpose |
|------|---------|
| **useAgent** | v2 agent state, messaging, and synchronization |
| **useFrontendTool** | Frontend tools with handlers (v2) |
| **useCopilotAction** | Custom actions callable by AI (legacy v1) |
| **useRenderToolCall** | Renders backend tool calls (v2 available) |
| **useHumanInTheLoop** | HITL flows (verify per target version) |

#### State Hooks
| Hook | Purpose |
|------|---------|
| **useCoAgentStateRender** | Streams agent state to UI |
| **useLangGraphInterrupt** | Handles agent execution pauses |

### Key Capabilities

#### 1. Agentic Chat UI
Intelligent chat interfaces powered by AI agents that execute tools and maintain context.

#### 2. Frontend & Backend Actions
Agents can execute operations across frontend and server-side systems:

```javascript
// Frontend Tool Example
useFrontendTool({
  name: "updateUI",
  description: "Updates the user interface",
  handler: async (params) => {
    // Execute in browser
    return result;
  }
});
```

#### 3. Shared State (Bidirectional)

```
┌─────────────┐          ┌─────────────┐
│   Frontend  │◄────────►│    Agent    │
│    State    │  sync    │    State    │
└─────────────┘          └─────────────┘
```

- **State Reading**: Agents access frontend application state
- **State Writing**: Agents modify application state from backend
- **Predictive Updates**: Stream in-progress state before completion

#### 4. Generative UI
Renders dynamic, AI-driven interfaces that adapt to agent behavior:

| Type | Description |
|------|-------------|
| **Backend Tool Rendering** | Custom UI for tool results |
| **Frontend Tool Rendering** | Agent-triggered frontend operations |
| **Agent State Rendering** | Live agent state as UI |

**Supported Specifications (verify against current CopilotKit docs):**
- A2UI (Google) - confirmed in docs examples
- Open-JSON-UI (OpenAI) - verify
- MCP Apps - verify

#### 5. Human-in-the-Loop (HITL)
Facilitates collaboration between agents and users:

```python
# Agent pauses for approval
if action.requires_approval:
    emit INTERRUPT event
    wait for user_approval
    continue execution
```

#### 6. Copilot Suggestions
Auto-generates suggestions based on real-time application state.

### Agent Framework Integrations

| Framework | Integration Type |
|-----------|-----------------|
| **Agno** | Native via AG-UI |
| **LangGraph** | Native partnership |
| **Microsoft Agent Framework** | Native via AG-UI |
| **AWS Strands** | Native via AG-UI |
| **CrewAI** | Partnership |
| **Mastra** | Native |
| **Pydantic AI** | Native |
| **LlamaIndex** | Native |

### Protocol Support

- **AG-UI** - Agent-to-user communication (transport)
- **A2UI** - Declarative UI specification (content)
- **MCP** - Agent-to-tool connectivity
- **A2A** - Agent-to-agent interactions

### Backend Runtime

```javascript
// @copilotkit/runtime package
import { CopilotRuntime } from '@copilotkit/runtime';

// Service Adapters:
// - OpenAI
// - Anthropic
// - Groq
// - Google GenAI
// - AWS Bedrock
```

---

## Phase 2: CopilotKit + Agno Integration

**Source:** [CopilotKit Agno Integration](https://www.copilotkit.ai/blog/introducing-agno-integration-with-copilotkit)

### Overview

CopilotKit has **native integration with Agno** via AG-UI, enabling Agno agents and teams to be exposed as AG-UI-compatible applications.

### Installation

```bash
pip install agno ag-ui-protocol
```

### Backend Implementation

```python
from agno.agent.agent import Agent
from agno.app.agui.app import AGUIApp
from agno.models.openai import OpenAIChat

# Create Agno Agent
chat_agent = Agent(
    name="Assistant",
    model=OpenAIChat(id="gpt-4o"),
    instructions="You are a helpful AI assistant.",
    add_datetime_to_instructions=True,
    markdown=True,
)

# Wrap in AGUIApp
agui_app = AGUIApp(
    agent=chat_agent,
    name="Basic AG-UI Agent",
    app_id="basic_agui_agent",
    description="A basic agent that demonstrates AG-UI protocol integration.",
)

app = agui_app.get_app()

if __name__ == "__main__":
    agui_app.serve(app="basic:app", port=8000, reload=True)
```

### Frontend Implementation (CopilotKit)

```javascript
import { CopilotKitProvider, CopilotChat } from "@copilotkit/react-ui";
import { HttpAgent } from "@ag-ui/client";

// Connect to Agno backend
const agent = new HttpAgent({
  url: "http://localhost:8000"
});

function App() {
  return (
    <CopilotKitProvider agent={agent}>
      <CopilotChat />
    </CopilotKitProvider>
  );
}
```

### Key Integration Features

| Feature | Description |
|---------|-------------|
| **Real-time Streaming** | Token-by-token response streaming |
| **Team Support** | Connect to Agno multi-agent teams |
| **Tool Execution** | Render tool calls in UI |
| **State Sync** | Bidirectional state between Agno and CopilotKit |
| **HITL** | Human approval workflows |

### Architecture Pattern

```
┌─────────────────┐     AG-UI Protocol     ┌─────────────────┐
│   CopilotKit    │◄─────────────────────►│      Agno       │
│   (React UI)    │    HTTP POST + SSE     │  (Agent/Team)   │
│                 │                        │                 │
│ • CopilotChat   │    Events:             │ • Agents        │
│ • State hooks   │    • TEXT_MESSAGE_*    │ • Teams         │
│ • Tool render   │    • TOOL_CALL_*       │ • Knowledge     │
│ • HITL hooks    │    • STATE_*           │ • Tools         │
└─────────────────┘    • INTERRUPT         └─────────────────┘
```

---

## Phase 3: AG-UI Protocol (Agent-User Interaction)

**Source:** [AG-UI Documentation](https://docs.ag-ui.com/)

### Overview

AG-UI is an **open, lightweight, event-based protocol** that standardizes how AI agents connect to user-facing applications. Developed by CopilotKit.

### Why AG-UI Exists

Traditional REST/GraphQL APIs break with agentic applications because:
- Agents are **long-running** and stream intermediate work
- Agents operate across **multi-turn sessions**
- Agents need **bidirectional communication**
- Agents require **real-time state synchronization**

### Transport Mechanisms (Validated)

| Transport | Notes |
|-----------|------|
| **HTTP POST + SSE** | Primary pattern: client sends `RunAgentInput` via POST, server streams events via SSE. This is how bidirectional flow is achieved. |
| **Binary Encodings (e.g., Protobuf)** | Supported for efficient transport when both sides agree. |
| **Other Streaming Transports** | Protocol is transport-agnostic, but avoid assuming Webhooks or HTTP/2 streams unless the SDK explicitly supports them. |

**Bidirectional Clarification:** SSE is server→client only. AG-UI achieves bidirectional flow by pairing a client POST request with a server-side SSE response stream.

### Event Types (Current SDK Defines 25)

**Validation note:** The SDK enumerates 25 event types across message, tool, state, lifecycle, and additional "thinking"/trace-style events. The tables below list the core subset commonly used in UIs; do not assume this is exhaustive.

#### Lifecycle Events (5)

| Event | Description | Payload |
|-------|-------------|---------|
| **RunStarted** | Initiates agent execution | `runId`, `threadId` |
| **RunFinished** | Signals successful completion | Optional result data |
| **RunError** | Indicates failure | Error message, code |
| **StepStarted** | Marks subtask beginning | `stepName` |
| **StepFinished** | Completes step context | `stepName` |

#### Text Message Events (4)

| Event | Description | Payload |
|-------|-------------|---------|
| **TextMessageStart** | Initializes streaming message | `messageId`, `role` |
| **TextMessageContent** | Delivers text chunks | `delta` (token) |
| **TextMessageEnd** | Finalizes message | `messageId` |
| **TextMessageChunk** | Convenience auto-expand | Start→Content→End |

#### Tool Call Events (5)

| Event | Description | Payload |
|-------|-------------|---------|
| **ToolCallStart** | Initiates tool invocation | `toolCallId`, `toolCallName` |
| **ToolCallArgs** | Streams argument fragments | `delta` (JSON segments) |
| **ToolCallEnd** | Completes argument phase | `toolCallId` |
| **ToolCallResult** | Delivers tool output | Complete result |
| **ToolCallChunk** | Convenience auto-expand | Start→Args→End |

#### State Management Events (3)

| Event | Description | Payload |
|-------|-------------|---------|
| **StateSnapshot** | Complete state for init/resync | Full state JSON |
| **StateDelta** | Incremental updates (RFC 6902) | JSON Patch operations |
| **MessagesSnapshot** | Complete conversation history | Message array |

### Event Flow Example

```
Agent Backend                    Frontend UI
     │                               │
     │──── RunStarted ──────────────►│ Initialize loading state
     │                               │
     │──── TextMessageStart ────────►│ Create message container
     │──── TextMessageContent ──────►│ Append "Hello"
     │──── TextMessageContent ──────►│ Append " world"
     │──── TextMessageEnd ──────────►│ Finalize message
     │                               │
     │──── ToolCallStart ───────────►│ Show tool loading
     │──── ToolCallArgs ────────────►│ Display arguments
     │──── ToolCallEnd ─────────────►│ Execute tool
     │──── ToolCallResult ──────────►│ Display result
     │                               │
     │──── StateDelta ──────────────►│ Apply state patch
     │                               │
     │──── RunFinished ─────────────►│ Hide loading, show result
     │                               │
```

### INTERRUPT Event (Human-in-the-Loop)

```python
# Agent emits interrupt for sensitive action
if action == "delete_database":
    emit(InterruptEvent(
        reason="Confirm destructive action",
        action=action
    ))
    # Flow pauses

# User approves
approval = await wait_for_approval()

if approval:
    execute(action)
```

### SDK Support

| Language | Status |
|----------|--------|
| TypeScript | Official |
| Python | Official |
| Kotlin | Community |
| Go | Community |
| Dart | Community |
| Java | Community |
| Rust | Community |
| .NET | In Development |
| Nim | In Development |

### 1st-Party Framework Integrations

- Microsoft Agent Framework
- AWS Strands
- Mastra
- Pydantic AI
- **Agno**
- LlamaIndex
- LangGraph (Partnership)
- CrewAI (Partnership)

---

## Phase 4: A2UI Protocol (Agent-to-User Interface)

**Source:** [A2UI.org](https://a2ui.org/)

### Overview

A2UI (Agent-to-User Interface) is a **declarative, JSON-based protocol** developed by Google that enables AI agents to generate rich, interactive UIs that render natively across platforms **without executing arbitrary code**.

**Current Version:** v0.8 (Stable), v0.9 (Draft in progress).  
**Policy (most up-to-date):** Target v0.9 draft for new builds, but retain a fallback path to v0.8 if stability is required.

### Key Distinction: A2UI vs AG-UI

| Protocol | Role | Created By |
|----------|------|------------|
| **A2UI** | Defines UI structure (the "what") | Google |
| **AG-UI** | Defines transport layer (the "how") | CopilotKit |

They work together: A2UI describes the UI intent, AG-UI streams it to the client.

### Core Design Principles

#### 1. Security First
- **Declarative data format**, not executable code
- **Trusted component catalog** - agents can only use pre-approved widgets
- **No UI injection** - prevents XSS and arbitrary script execution

#### 2. LLM-Friendly
- **Flat JSON structure** - easy for LLMs to generate
- **Streaming-compatible** - incremental UI updates
- **ID references** - simple component addressing

#### 3. Cross-Platform
- **Framework-agnostic** - same spec works on:
  - Angular
  - Flutter
  - React
  - Web Components
  - Native platforms

### Architecture Layers

```
┌─────────────────────────────────────────────────┐
│                A2UI ARCHITECTURE                 │
├─────────────────────────────────────────────────┤
│                                                  │
│  Layer 1: UI STRUCTURE                          │
│  ────────────────────                           │
│  updateComponents messages define components     │
│  • Card, Button, TextField, Chart, etc.         │
│                                                  │
│  Layer 2: APPLICATION STATE                     │
│  ──────────────────────                         │
│  updateDataModel messages define data            │
│  • Form values, selection state, etc.           │
│                                                  │
│  Layer 3: CLIENT RENDERING                      │
│  ─────────────────────                          │
│  Native component mapping                        │
│  • React → React components                      │
│  • Flutter → Flutter widgets                     │
│  • Angular → Angular components                  │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Component Catalog (Trusted Widgets)

**Note:** The canonical component list is defined by the catalog referenced in `catalogId` (e.g., standard catalog JSON). The list below is a representative subset, not an authoritative inventory.

| Component | Description |
|-----------|-------------|
| **Card** | Container with title, content |
| **Button** | Interactive action trigger |
| **TextField** | Text input field |
| **Form** | Data collection container |
| **DatePicker** | Date selection widget |
| **TimePicker** | Time selection widget |
| **ComparisonTable** | Side-by-side data display |
| **Chart** | Data visualization |
| **Timeline** | Sequential event display |
| **Checklist** | Task list with checkboxes |
| **Custom** | Client-registered custom widgets |

### Message Types (v0.9 Draft - Most Up-to-Date)

**Server → Client:**
- `createSurface` - Initialize a surface with a component catalog.
- `updateComponents` - Define/update UI components (adjacency list).
- `updateDataModel` - Patch state using JSON Pointer operations.
- `deleteSurface` - Remove a surface.

**v0.8 Stable Note:** v0.8 uses `surfaceUpdate`, `dataModelUpdate`, `beginRendering`, `deleteSurface`. Do not mix v0.8 and v0.9 message names in the same implementation.

#### createSurface (Initialize Surface)
```json
{
  "createSurface": {
    "surfaceId": "weather_surface",
    "catalogId": "https://a2ui.dev/specification/0.9/standard_catalog_definition.json"
  }
}
```

#### updateComponents (UI Structure)
```json
{
  "updateComponents": {
    "surfaceId": "weather_surface",
    "components": [
      {
        "id": "root",
        "component": "Column",
        "children": ["title", "forecast", "refresh_button"]
      },
      {
        "id": "title",
        "component": "Text",
        "text": "Weather Forecast"
      },
      {
        "id": "forecast",
        "component": "Text",
        "text": { "path": "/weather/description" }
      },
      {
        "id": "refresh_button",
        "component": "Button",
        "child": "refresh_label",
        "action": {
          "name": "refreshWeather",
          "context": {}
        }
      },
      {
        "id": "refresh_label",
        "component": "Text",
        "text": "Refresh"
      }
    ]
  }
}
```

#### updateDataModel (State)
```json
{
  "updateDataModel": {
    "surfaceId": "weather_surface",
    "path": "/weather",
    "op": "replace",
    "value": {
      "description": "Sunny, 72F",
      "lastUpdated": "2026-01-19T10:30:00Z"
    }
  }
}
```

**User Interaction:** A2UI defines `action` metadata on components; the actual action invocation is sent over the host transport (e.g., AG-UI or app-defined API) and is not a separate A2UI message type.

### Interaction Loop: Emit-Render-Signal-Reason

```
┌────────────────────────────────────────────────────────────┐
│                   A2UI INTERACTION LOOP                     │
├────────────────────────────────────────────────────────────┤
│                                                             │
│   1. EMIT: Agent sends A2UI JSON messages                  │
│            (updateComponents + updateDataModel)            │
│                         │                                   │
│                         ▼                                   │
│   2. RENDER: Client maps JSON → native widgets             │
│              (React, Flutter, Angular, etc.)               │
│                         │                                   │
│                         ▼                                   │
│   3. INTERACT: User engages with rendered UI               │
│                (clicks, inputs, selections)                │
│                         │                                   │
│                         ▼                                   │
│   4. SIGNAL: Client sends action invocation                │
│              (transport-defined; NOT free-form text)       │
│                         │                                   │
│                         ▼                                   │
│   5. REASON: Agent processes structured event              │
│              and updates UI accordingly                    │
│                         │                                   │
│                         └───────────► Back to 1            │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### A2UI + AG-UI Integration (Validated Pattern)

```python
# Backend: stream A2UI JSON messages (JSONL) over AG-UI transport
# Example shown with v0.9 draft message names
a2ui_messages = [
  {"createSurface": {"surfaceId": "weather_surface", "catalogId": "https://a2ui.dev/specification/0.9/standard_catalog_definition.json"}},
  {"updateComponents": {"surfaceId": "weather_surface", "components": [ ... ]}},
  {"updateDataModel": {"surfaceId": "weather_surface", "path": "/weather", "op": "replace", "value": { ... }}}
]

# Emit these as part of your agent response stream
```

```javascript
// Frontend: CopilotKit renders A2UI
const A2UIMessageRenderer = createA2UIMessageRenderer({ theme });

<CopilotKitProvider
  runtimeUrl="/api/copilotkit"
  renderActivityMessages={[A2UIMessageRenderer]}
>
```

### Transport Compatibility

| Transport | Notes |
|----------|------|
| **AG-UI** | Common pairing for streaming A2UI messages |
| **A2A / HTTP+JSON** | Possible if you embed A2UI payloads in message parts |
| **Other Transports** | A2UI is transport-agnostic; compatibility depends on your host protocol |

### Client Libraries

| Platform | Library |
|----------|---------|
| Flutter | GenUI SDK |
| Web | Web Components |
| Angular | Angular Components |
| Lit | Lit Elements |

---

## Phase 5: A2A Protocol (Agent-to-Agent)

**Source:** [A2A Protocol](https://a2a-protocol.org/latest/)

### Overview

The **Agent2Agent (A2A) Protocol** is an open standard designed to enable seamless communication and collaboration between AI agents. Originally developed by Google, now donated to the **Linux Foundation**.

**Key Milestones (verify with official sources):**
- April 2025: Google unveils spec at Cloud Next
- June 2025: Linux Foundation launches A2A project
- Published supporter counts should be confirmed before use

### Founding Members

AWS, Cisco, Google, Microsoft, Salesforce, SAP, ServiceNow

### Core Concepts

#### Agent Cards (Discovery)

An **Agent Card** is a JSON metadata document describing an agent's identity, capabilities, and how to communicate with it.

**Discovery URL:** `/.well-known/agent-card.json`

```json
{
  "protocolVersion": "0.3.0",
  "name": "Weather Agent",
  "description": "Provides weather information worldwide",
  "url": "https://api.weather-agent.com/a2a/v1",
  "preferredTransport": "JSONRPC",
  "additionalInterfaces": [
    { "url": "https://api.weather-agent.com/a2a/v1", "transport": "JSONRPC" },
    { "url": "https://api.weather-agent.com/a2a/grpc", "transport": "GRPC" },
    { "url": "https://api.weather-agent.com/a2a/json", "transport": "HTTP+JSON" }
  ],
  "capabilities": {
    "streaming": true,
    "pushNotifications": true
  },
  "skills": [
    {
      "id": "getCurrentWeather",
      "name": "Get Current Weather",
      "description": "Get current weather for a location",
      "inputModes": ["application/json", "text/plain"],
      "outputModes": ["application/json"]
    }
  ],
  "securitySchemes": {
    "oauth": {
      "type": "openIdConnect",
      "openIdConnectUrl": "https://auth.weather-agent.com/.well-known/openid-configuration"
    }
  },
  "security": [{ "oauth": ["openid", "profile"] }]
}
```

#### Tasks (Unit of Work)

A **Task** is the fundamental unit of work managed by A2A.

**Task Lifecycle:**
```
submitted → working → [input-required] → completed
                 ↓
              failed
```

| State | Description |
|-------|-------------|
| **submitted** | Task received, not yet started |
| **working** | Agent actively processing |
| **input-required** | Agent needs additional info |
| **completed** | Task finished successfully |
| **failed** | Task encountered error |

#### Messages (Communication Turns)

A **Message** is a communication turn between client and remote agent.

| Role | Description |
|------|-------------|
| **user** | From client agent |
| **agent** | From remote agent |

#### Parts (Content Units)

**Parts** are the smallest content units within messages or artifacts:

| Part Type | Description |
|-----------|-------------|
| **TextPart** | Plain textual content |
| **FilePart** | File (inline Base64 or URI) |
| **DataPart** | Structured JSON data |

```json
{
  "role": "agent",
  "parts": [
    {
      "type": "text",
      "text": "Here's the weather forecast"
    },
    {
      "type": "data",
      "mimeType": "application/json",
      "data": {
        "temperature": 72,
        "condition": "sunny"
      }
    }
  ]
}
```

#### Artifacts (Task Outputs)

An **Artifact** is output generated by an agent as a result of a task:

```json
{
  "artifactId": "forecast-123",
  "name": "5-Day Weather Forecast",
  "parts": [
    {
      "type": "file",
      "name": "forecast.pdf",
      "mimeType": "application/pdf",
      "uri": "https://..."
    }
  ]
}
```

### Communication Patterns

| Pattern | Description | Use Case |
|---------|-------------|----------|
| **Request/Response** | Client sends, server responds | Simple queries |
| **Polling** | Periodic status checks | Long-running tasks |
| **Streaming** | Real-time incremental updates | SSE/gRPC |
| **Push Notifications** | Server-initiated webhooks | Async workflows |

### Technical Foundation

| Aspect | Specification |
|--------|---------------|
| **Transport** | JSON-RPC over HTTPS, HTTP+JSON, and gRPC |
| **Payload Format** | JSON-RPC 2.0 (for JSON-RPC transport) |
| **Streaming** | SSE for JSON-RPC/HTTP+JSON; gRPC server streaming for gRPC |
| **Authentication** | HTTP-layer auth (e.g., OAuth/OpenID Connect, API keys in headers) |

### Protocol Bindings

| Binding | Description | Recommendation |
|---------|-------------|----------------|
| **JSON-RPC 2.0** | HTTP POST + SSE streaming | Primary |
| **HTTP+JSON** | REST-style HTTP with SSE streaming | Secondary |
| **gRPC** | Protocol Buffers over HTTP/2 | High-performance |

### A2A vs MCP

| Protocol | Purpose |
|----------|---------|
| **A2A** | Agent-to-Agent communication |
| **MCP** | Agent-to-Tool communication |

They are **complementary**:
- MCP connects agents to tools, APIs, resources
- A2A connects agents to other agents

### SDK Support

| Language | Status |
|----------|--------|
| Python | Official |
| JavaScript | Official |
| Java | Official |
| .NET | Official |
| Go | Official |

---

## Phase 6: MCP (Model Context Protocol)

**Source:** [MCP Specification](https://modelcontextprotocol.io/specification/2025-11-25)

### Overview

The **Model Context Protocol (MCP)** is an open standard introduced by Anthropic in November 2024 to standardize how AI systems integrate with external tools, data sources, and resources.

**Key Milestones (verify with official sources):**
- November 2024: Anthropic introduces MCP
- Governance/donation milestones should be confirmed before relying on them for planning

### Core Primitives

| Primitive | Control | Description |
|-----------|---------|-------------|
| **Tools** | Model-controlled | Functions for AI model execution |
| **Resources** | App-controlled | Context and data sources |
| **Prompts** | User-controlled | Templated messages and workflows |

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    MCP ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐   │
│  │    HOST     │     │   CLIENT    │     │   SERVER    │   │
│  │ (LLM App)   │────►│ (Connector) │────►│ (Provider)  │   │
│  │             │     │             │     │             │   │
│  │ e.g. Claude │     │ MCP Client  │     │ MCP Server  │   │
│  │     Code    │     │             │     │             │   │
│  └─────────────┘     └─────────────┘     └─────────────┘   │
│                                                              │
│  Communication: JSON-RPC 2.0 over STDIO or HTTP             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Server Features (What Servers Expose)

#### 1. Tools
Functions available for AI model execution:

```json
{
  "name": "search_database",
  "description": "Search the product database",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": { "type": "string" },
      "limit": { "type": "integer", "default": 10 }
    },
    "required": ["query"]
  }
}
```

#### 2. Resources
Context and data available to users or AI models:

```json
{
  "uri": "file:///data/products.json",
  "name": "Product Catalog",
  "mimeType": "application/json"
}
```

#### 3. Prompts
Templated messages and workflows:

```json
{
  "name": "code_review",
  "description": "Review code for quality",
  "arguments": [
    {
      "name": "code",
      "description": "Code to review",
      "required": true
    }
  ]
}
```

### Client Features (What Clients Can Request)

| Feature | Description |
|---------|-------------|
| **Roots** | URI/filesystem boundaries |
| **Sampling** | Server-initiated LLM interactions |
| **Elicitation** | Request additional user info |

### Additional Utilities

| Utility | Description |
|---------|-------------|
| **Configuration** | Settings management |
| **Progress** | Long-running operation tracking |
| **Cancellation** | Request cancellation support |
| **Error Reporting** | Standardized error handling |
| **Logging** | Debug and audit logging |
| **Completion** | Autocomplete for server utilities |
| **Pagination** | Large result set handling |
| **Tasks** | Complex workflow management |

### Security & Trust Framework

#### Key Principles

| Principle | Description |
|-----------|-------------|
| **User Consent** | Explicit consent for all data access |
| **Data Privacy** | No unauthorized data transmission |
| **Tool Safety** | Explicit consent before tool invocation |
| **LLM Sampling Controls** | Users approve all sampling requests |

#### Security Guidelines

1. Tool descriptions treated as **untrusted** unless from trusted servers
2. Tools represent **arbitrary code execution**
3. Build robust **consent and authorization flows**
4. Provide clear **security documentation**

#### Authorization (HTTP Transport)
MCP specifies an OAuth 2.1-based authorization framework for HTTP servers. Authorization is optional but recommended; stdio transport typically relies on local process boundaries rather than OAuth.

### Protocol Details

| Aspect | Specification |
|--------|---------------|
| **Message Format** | JSON-RPC 2.0 |
| **Transports** | STDIO, Streamable HTTP (SSE) |
| **Connection** | Stateful |
| **Negotiation** | Capability-based |

### MCP Adoption (Verify Before Use)

| Platform | Support Level |
|----------|---------------|
| Claude Desktop | Native |
| Claude Code | Native |
| VS Code | Extension |
| Cursor | Native |
| ChatGPT | Supported |
| Other IDEs | Growing |

---

## Integration Architecture for Hyyve

### Complete Protocol Stack

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HYYVE + PROTOCOL INTEGRATION                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  USER INTERFACE LAYER                                                        │
│  ═══════════════════                                                         │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        CopilotKit                                    │    │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐        │    │
│  │  │CopilotChat│  │CopilotSide│  │  A2UI     │  │Generative │        │    │
│  │  │           │  │   bar     │  │ Renderer  │  │    UI     │        │    │
│  │  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘        │    │
│  │        │              │              │              │               │    │
│  │        └──────────────┼──────────────┼──────────────┘               │    │
│  │                       │              │                              │    │
│  └───────────────────────┼──────────────┼──────────────────────────────┘    │
│                          │              │                                    │
│  TRANSPORT LAYER         │              │                                    │
│  ═══════════════         ▼              ▼                                    │
│                    ┌─────────────────────────┐                              │
│                    │         AG-UI           │                              │
│                    │  • 25 Event Types       │                              │
│                    │  • HTTP POST + SSE      │                              │
│                    │  • State Sync           │                              │
│                    └───────────┬─────────────┘                              │
│                                │                                             │
│  AGENT LAYER                   │                                             │
│  ═══════════                   ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                           Agno                                       │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │    │
│  │  │   Agent     │  │    Team     │  │  AGUIApp    │                  │    │
│  │  │             │  │             │  │  Wrapper    │                  │    │
│  │  │• RAG KB     │  │• Retriever  │  │             │                  │    │
│  │  │• Memory     │  │• Analyzer   │  │• Streaming  │                  │    │
│  │  │• Tools      │  │• Expert     │  │• Events     │                  │    │
│  │  └──────┬──────┘  └──────┬──────┘  └─────────────┘                  │    │
│  │         │                │                                           │    │
│  │         └────────┬───────┘                                           │    │
│  │                  │                                                   │    │
│  │                  ▼                                                   │    │
│  │         ┌────────────────┐                                          │    │
│  │         │  A2A Client    │◄────────► External Agents                │    │
│  │         │  (Optional)    │          (LangGraph, CrewAI, etc.)       │    │
│  │         └────────────────┘                                          │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                │                                             │
│  TOOLS & KNOWLEDGE LAYER       │                                             │
│  ═══════════════════════       ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                           MCP                                        │    │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐        │    │
│  │  │ pgvector  │  │ Graphiti  │  │  GitHub   │  │  Docling  │        │    │
│  │  │  Server   │  │  Server   │  │  Server   │  │  Server   │        │    │
│  │  └───────────┘  └───────────┘  └───────────┘  └───────────┘        │    │
│  │                                                                      │    │
│  │  Tools exposed:                                                      │    │
│  │  • vector_search       • entity_search      • repo_search           │    │
│  │  • add_document        • add_episode        • file_content          │    │
│  │  • hybrid_search       • graph_traverse     • code_analysis         │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Runnable Reference: AG-UI Server + CopilotKit Client (v2)

This reference uses Agno's AGUI interface (AgentOS) for a working baseline.

**Backend dependencies (pinned):**
```bash
pip install agno==2.4.0
```

```python
# backend/main.py - Runnable AG-UI server (Agno AgentOS + AGUI)

from agno.agent.agent import Agent
from agno.models.openai import OpenAIChat
from agno.os import AgentOS
from agno.os.interfaces.agui import AGUI

# Configure provider credentials per Agno docs
# Example: export OPENAI_API_KEY=...

chat_agent = Agent(
    model=OpenAIChat(id="gpt-4o"),
    instructions=(
        "You are a helpful assistant. When asked for a UI, return A2UI v0.9 JSON "
        "messages (createSurface, updateComponents, updateDataModel) as JSONL."
    ),
)

agent_os = AgentOS(
    agents=[chat_agent],
    interfaces=[AGUI(agent=chat_agent)],
)

app = agent_os.get_app()

if __name__ == "__main__":
    agent_os.serve(app="main:app", reload=True)
```

**Frontend dependencies (pinned):**
```bash
npm install @copilotkit/react-ui@1.51.2 @copilotkit/a2ui-renderer@1.51.2 @ag-ui/client@0.0.43 react@19.2.3 react-dom@19.2.3
```

```tsx
// frontend/App.tsx - Runnable CopilotKit client with A2UI renderer

import { CopilotKitProvider, CopilotChat } from "@copilotkit/react-ui";
import { HttpAgent } from "@ag-ui/client";
import { createA2UIMessageRenderer } from "@copilotkit/a2ui-renderer";

const agent = new HttpAgent({ url: "http://localhost:8000/agui" });
const A2UIRenderer = createA2UIMessageRenderer({ theme: "light" });

export default function App() {
  return (
    <CopilotKitProvider agent={agent} renderActivityMessages={[A2UIRenderer]}>
      <CopilotChat />
    </CopilotKitProvider>
  );
}
```

---

## Implementation Contract (One-Page, Version-Pinned)

**Verification Date:** 2026-01-19  
**Policy:** Use the most up-to-date stable releases at implementation time; record exact versions/commit SHAs in lockfiles and update this table on upgrade.

### Version Targets (Latest as of Verification Date)
| Layer | Target | Notes |
|------|--------|------|
| **CopilotKit** | v2 (`@copilotkitnext/react@1.51.2`, `@copilotkit/react-ui@1.51.2`, `@copilotkit/runtime@1.51.2`) | v1 hooks (`useCopilotAction`) are legacy; avoid mixing v1/v2. |
| **Agno** | `agno==2.4.0` (AgentOS + AGUI) | `AGUIApp` is deprecated in v2; use `AgentOS` + `AGUI` interface. |
| **AG-UI** | `@ag-ui/client@0.0.43` (TS) / `ag-ui-protocol` (Python) | Use `@ag-ui/core`, `@ag-ui/client`, `@ag-ui/encoder` (TS) or `ag_ui.core`, `ag_ui.encoder` (Python). |
| **A2UI** | v0.9 draft (most up-to-date) | If stability is required, fall back to v0.8 stable. |
| **A2A** | Protocol `0.3.0` | Discovery via `/.well-known/agent-card.json`. |
| **MCP** | Spec `2025-11-25` | Transports: stdio + streamable HTTP (SSE). |

### Transport & Payload Contracts
| Protocol | Client → Server | Server → Client |
|----------|-----------------|-----------------|
| **AG-UI** | HTTP POST with `RunAgentInput` | SSE stream of AG-UI events |
| **A2UI** | Action invocation via host transport | JSONL stream of A2UI messages |
| **A2A** | JSON-RPC or HTTP+JSON | SSE (for streaming) or standard responses |
| **MCP** | stdio or HTTP POST | stdio or SSE (streamable HTTP) |

### Auth, Consent, and Security
- **A2A:** Auth is defined in the Agent Card `securitySchemes` and enforced at HTTP layer.
- **MCP:** OAuth 2.1-based authorization for HTTP; explicit user consent for tools/resources/sampling.
- **AG-UI/A2UI:** No built-in auth; must be enforced by the hosting app/gateway.

### Implementation Checklist (Blocking Items)
- Pin exact package versions and record commit SHAs.
- Validate AG-UI event set against SDK enum (25 types) and handle unknown events safely.
- Align A2UI message names strictly to chosen version (v0.9 or v0.8); no mixing.
- Implement explicit user consent for MCP tools/resources and A2A sensitive actions.
- Define an app-level contract for A2UI action invocation payloads.

### Local Dependency Audit
Added pinned dependency manifests:
- `requirements.txt` and `requirements.lock` (Python)
- `package.json` (Node)

**Note:** `package-lock.json` generation timed out in this environment; run `npm install --package-lock-only` to lock transitive dependencies.

---

## Feature Comparison Matrix

### Protocol Capabilities

| Feature | CopilotKit | AG-UI | A2UI | A2A | MCP |
|---------|------------|-------|------|-----|-----|
| UI Components | ✅ | ❌ | ✅ | ❌ | ❌ |
| Streaming | ✅ | ✅ | ✅ | ✅ | ✅ |
| State Sync | ✅ | ✅ | ✅ (data model) | ❌ | ❌ |
| Tool Calls | ✅ | ✅ | ❌ | ❌ | ✅ |
| HITL | ✅ | App-defined | App-defined | ✅ (input-required) | ✅ (elicitation) |
| Agent-to-Agent | ❌ | ❌ | ❌ | ✅ | ❌ |
| Resources | ❌ | ❌ | ❌ | ❌ | ✅ |
| Cross-Platform | React | Any | Any | Any | Any |

### When to Use Each Protocol

| Protocol | Primary Use Case |
|----------|-----------------|
| **CopilotKit** | React-based agentic UIs |
| **AG-UI** | Agent-to-frontend transport |
| **A2UI** | Cross-platform generative UI |
| **A2A** | Multi-agent collaboration |
| **MCP** | Tool/resource integration |

---

## Recommendations for Hyyve Integration

### 1. UI Layer
- Use **CopilotKit** for React frontend
- Implement **A2UI** renderer for rich, generative components (v0.9 draft target; v0.8 fallback)
- Use **CopilotSidebar** for persistent assistant

### 2. Transport Layer
- Use **AG-UI** via Agno's `AGUIApp` wrapper (HTTP POST + SSE streaming)
- Leverage the full AG-UI event set (25 types per SDK) for rich interaction
- Implement INTERRUPT events for human approval

### 3. Agent Layer
- Continue using **Agno** as primary framework
- Consider **A2A** for external agent integration
- Use multi-agent teams for complex workflows

### 4. Tools Layer
- Expose existing tools via **MCP** for broader compatibility
- Package pgvector, Graphiti, GitHub tools as MCP servers
- Enable other MCP clients to access your RAG system

### Implementation Priority

| Priority | Component | Rationale |
|----------|-----------|-----------|
| **P0** | AG-UI + CopilotKit | Core UI connectivity |
| **P1** | A2UI Renderer | Rich generative UI |
| **P2** | MCP Servers | Tool interoperability |
| **P3** | A2A Integration | External agent collaboration |

---

## Sources

- [CopilotKit Documentation](https://docs.copilotkit.ai/)
- [CopilotKit Agno Integration](https://www.copilotkit.ai/blog/introducing-agno-integration-with-copilotkit)
- [AG-UI Documentation](https://docs.ag-ui.com/introduction)
- [AG-UI GitHub](https://github.com/ag-ui-protocol/ag-ui)
- [A2UI.org](https://a2ui.org/)
- [A2UI Protocol v0.9 Draft](https://github.com/google/a2ui/blob/main/specification/0.9/docs/a2ui_protocol.md)
- [A2UI Roadmap](https://github.com/google/a2ui/blob/main/docs/roadmap.md)
- [A2UI Google Blog](https://developers.googleblog.com/introducing-a2ui-an-open-project-for-agent-driven-interfaces/)
- [A2UI + AG-UI Integration](https://www.copilotkit.ai/blog/build-with-googles-new-a2ui-spec-agent-user-interfaces-with-a2ui-ag-ui)
- [A2A Protocol](https://a2a-protocol.org/latest/)
- [A2A Specification](https://github.com/google/a2a/blob/main/docs/specification.md)
- [A2A Google Blog](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/)
- [A2A Linux Foundation](https://www.linuxfoundation.org/press/linux-foundation-launches-the-agent2agent-protocol-project-to-enable-secure-intelligent-communication-between-ai-agents)
- [MCP Specification](https://modelcontextprotocol.io/specification/2025-11-25)
- [MCP Authorization and Security](https://github.com/modelcontextprotocol/modelcontextprotocol)
- [MCP Anthropic Introduction](https://www.anthropic.com/news/model-context-protocol)
- [MCP GitHub](https://github.com/modelcontextprotocol/modelcontextprotocol)
