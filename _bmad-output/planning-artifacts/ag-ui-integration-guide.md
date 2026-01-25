# AG-UI/A2UI Integration Guide

**Project:** Hyyve Platform
**Version:** 1.0
**Last Updated:** January 2026

---

## 1. Overview

This guide documents the integration of AG-UI (Agent-Generated UI) and A2UI (Adjacency List Model for Agent-to-UI) patterns across the Hyyve Platform. These patterns enable AI agents to dynamically render UI components at runtime, creating responsive and context-aware user experiences.

### 1.1 What is AG-UI?

AG-UI (Generative UI) is a framework where AI agents can dynamically generate and stream UI components during execution. Instead of returning plain text, agents return structured UI primitives that render as interactive components.

### 1.2 What is A2UI?

A2UI (Adjacency List Model) is a flat data structure that represents UI component hierarchies in an LLM-friendly format. It enables:
- Streaming UI generation (components render as they're generated)
- Incremental updates without full re-renders
- Type-safe component contracts between agent and frontend

---

## 2. Screens Requiring AG-UI Integration

### 2.1 Primary Integration Points

| Screen ID | Screen Name | Integration Type | Priority |
|-----------|-------------|------------------|----------|
| 1.2.1 | Module Builder - Main View | Full chat interface | P0 |
| 1.2.3 | Execution Monitor | Streaming output | P0 |
| 1.3.1 | Chatbot Builder - Main View | Conversation preview | P0 |
| 1.4.3 | KB Query Testing | Results streaming | P1 |
| 2.1.3 | AI Generation Modal | Generative forms | P1 |
| 2.2.3 | Live Call Monitor | Real-time transcription | P0 |
| 5.1.1 | Multi-user Editor | Activity feed | P1 |
| 6.2.2 | API Documentation Browser | Inline playground | P2 |
| 6.2.4 | API Playground | Streaming responses | P1 |

### 2.2 Secondary Integration Points

| Screen ID | Screen Name | Integration Type | Priority |
|-----------|-------------|------------------|----------|
| 1.3.7 | Chatbot Analytics | Real-time charts | P2 |
| 2.2.5 | Voice Analytics | Real-time metrics | P2 |
| 3.2.4 | MCP Server Usage | Live statistics | P2 |
| 1.2.2a-f | Node Configurations | Dynamic form schemas | P2 |
| 1.3.2 | Intent Training | Sample generation | P2 |

---

## 3. AGENT_CONTENT_ZONE Specifications

### 3.1 Zone Marker Pattern

Each dynamic content area uses a standardized marker:

```html
<!-- AGENT_CONTENT_ZONE: {zone-id} -->
<div
  id="{zone-id}-zone"
  data-ag-ui="{content-type}"
  data-ag-ui-stream="{true|false}"
  data-ag-ui-schema="{schema-ref}"
>
  <!-- Agent-generated content renders here -->
</div>
```

### 3.2 Zone Definitions by Screen

#### Screen 1.2.1: Module Builder - Main View

**Zone ID:** `module-builder-chat`
**Content Type:** `conversation`
**Streaming:** true

```html
<!-- AGENT_CONTENT_ZONE: module-builder-chat -->
<div
  id="module-builder-chat-zone"
  data-ag-ui="conversation"
  data-ag-ui-stream="true"
  data-ag-ui-schema="ChatMessage"
>
  <!-- Supports: user-message, assistant-message, tool-call, tool-result -->
</div>
```

**Supported Primitives:**
- `ChatMessage` - User and assistant messages
- `ToolCall` - Display of tool invocations
- `ToolResult` - Results from tool executions
- `CodeBlock` - Syntax-highlighted code
- `LoadingIndicator` - Typing/thinking states

---

#### Screen 1.2.3: Execution Monitor

**Zone ID:** `execution-output`
**Content Type:** `stream-viewer`
**Streaming:** true

```html
<!-- AGENT_CONTENT_ZONE: execution-output -->
<div
  id="execution-output-zone"
  data-ag-ui="stream-viewer"
  data-ag-ui-stream="true"
  data-ag-ui-schema="ExecutionEvent"
>
  <!-- Real-time execution events stream here -->
</div>
```

**Supported Primitives:**
- `ExecutionStep` - Individual node executions
- `LogEntry` - Debug/info/error logs
- `MetricUpdate` - Token counts, latency updates
- `ProgressBar` - Execution progress
- `ErrorDisplay` - Error messages with stack traces

---

#### Screen 1.3.1: Chatbot Builder - Main View

**Zone ID:** `chatbot-preview`
**Content Type:** `chat-widget`
**Streaming:** true

```html
<!-- AGENT_CONTENT_ZONE: chatbot-preview -->
<div
  id="chatbot-preview-zone"
  data-ag-ui="chat-widget"
  data-ag-ui-stream="true"
  data-ag-ui-schema="WidgetMessage"
>
  <!-- Live chatbot preview renders here -->
</div>
```

**Supported Primitives:**
- `WidgetMessage` - Chat bubble messages
- `QuickReply` - Suggested response buttons
- `Card` - Rich content cards
- `Carousel` - Horizontal scrolling cards
- `Form` - Inline form collection

---

#### Screen 1.4.3: KB Query Testing

**Zone ID:** `kb-query-results`
**Content Type:** `search-results`
**Streaming:** true

```html
<!-- AGENT_CONTENT_ZONE: kb-query-results -->
<div
  id="kb-query-results-zone"
  data-ag-ui="search-results"
  data-ag-ui-stream="true"
  data-ag-ui-schema="SearchResult"
>
  <!-- RAG query results stream here -->
</div>
```

**Supported Primitives:**
- `SearchResult` - Individual document matches
- `SourceCitation` - Source references
- `RelevanceScore` - Similarity scores
- `ChunkPreview` - Document chunk previews
- `SynthesizedAnswer` - AI-generated answer

---

#### Screen 2.1.3: AI Generation Modal

**Zone ID:** `ai-generation-form`
**Content Type:** `generative-form`
**Streaming:** true

```html
<!-- AGENT_CONTENT_ZONE: ai-generation-form -->
<div
  id="ai-generation-form-zone"
  data-ag-ui="generative-form"
  data-ag-ui-stream="true"
  data-ag-ui-schema="DynamicForm"
>
  <!-- AI generates form fields based on context -->
</div>
```

**Supported Primitives:**
- `FormField` - Dynamic input fields
- `Suggestion` - AI-suggested values
- `Validation` - Real-time validation feedback
- `Preview` - Generated content preview
- `ActionButton` - Context-aware actions

---

#### Screen 2.2.3: Live Call Monitor

**Zone ID:** `call-transcription`
**Content Type:** `transcription-stream`
**Streaming:** true

```html
<!-- AGENT_CONTENT_ZONE: call-transcription -->
<div
  id="call-transcription-zone"
  data-ag-ui="transcription-stream"
  data-ag-ui-stream="true"
  data-ag-ui-schema="TranscriptionEvent"
>
  <!-- Real-time voice transcription renders here -->
</div>
```

**Supported Primitives:**
- `TranscriptionSegment` - Speaker-labeled text
- `SentimentIndicator` - Real-time sentiment
- `IntentDetection` - Detected intents
- `SuggestedResponse` - Agent response suggestions
- `CallMetric` - Duration, sentiment trends

---

#### Screen 5.1.1: Multi-user Editor

**Zone ID:** `collab-activity-feed`
**Content Type:** `activity-stream`
**Streaming:** true

```html
<!-- AGENT_CONTENT_ZONE: collab-activity-feed -->
<div
  id="collab-activity-zone"
  data-ag-ui="activity-stream"
  data-ag-ui-stream="true"
  data-ag-ui-schema="ActivityEvent"
>
  <!-- Real-time collaboration events -->
</div>
```

**Supported Primitives:**
- `UserAction` - Edit, select, move events
- `ChatMessage` - Inline collaboration chat
- `SystemEvent` - Join, leave, sync events
- `PresenceUpdate` - Cursor positions

---

#### Screen 6.2.4: API Playground

**Zone ID:** `streaming-response`
**Content Type:** `api-response-stream`
**Streaming:** true

```html
<!-- AGENT_CONTENT_ZONE: streaming-response -->
<div
  id="streaming-response-zone"
  data-ag-ui="api-response-stream"
  data-ag-ui-stream="true"
  data-ag-ui-schema="APIResponse"
>
  <!-- SSE/streaming API responses render here -->
</div>
```

**Supported Primitives:**
- `StreamChunk` - Incremental response text
- `TokenCounter` - Live token accumulation
- `JSONViewer` - Formatted JSON display
- `ErrorResponse` - Error formatting

---

## 4. A2UI Component Schema

### 4.1 Base Component Interface

```typescript
interface A2UIComponent {
  id: string;                    // Unique component identifier
  type: string;                  // Component type (e.g., "ChatMessage")
  parentId: string | null;       // Parent component ID (null for root)
  props: Record<string, any>;    // Component-specific properties
  children?: string[];           // Child component IDs (adjacency list)
  meta?: {
    timestamp: number;
    source: 'agent' | 'user' | 'system';
    streamIndex?: number;
  };
}
```

### 4.2 Adjacency List Structure

```typescript
interface A2UIDocument {
  version: string;
  rootIds: string[];              // Top-level component IDs
  components: Map<string, A2UIComponent>;

  // Streaming support
  pendingComponents?: string[];   // Components being generated
  streamCursor?: string;          // Current streaming position
}
```

### 4.3 Example: Chat Conversation

```json
{
  "version": "1.0",
  "rootIds": ["msg-1", "msg-2", "msg-3"],
  "components": {
    "msg-1": {
      "id": "msg-1",
      "type": "ChatMessage",
      "parentId": null,
      "props": {
        "role": "user",
        "content": "How do I configure RAG?",
        "timestamp": 1706200000000
      }
    },
    "msg-2": {
      "id": "msg-2",
      "type": "ChatMessage",
      "parentId": null,
      "props": {
        "role": "assistant",
        "content": "",
        "streaming": true
      },
      "children": ["msg-2-chunk-1", "msg-2-chunk-2"]
    },
    "msg-2-chunk-1": {
      "id": "msg-2-chunk-1",
      "type": "TextChunk",
      "parentId": "msg-2",
      "props": {
        "text": "To configure RAG, you'll need to: "
      }
    },
    "msg-2-chunk-2": {
      "id": "msg-2-chunk-2",
      "type": "TextChunk",
      "parentId": "msg-2",
      "props": {
        "text": "1. Upload your documents..."
      },
      "meta": {
        "streamIndex": 1,
        "source": "agent"
      }
    }
  }
}
```

---

## 5. Component Primitives Library

### 5.1 Chat Components

| Primitive | Description | Props |
|-----------|-------------|-------|
| `ChatMessage` | User/assistant message bubble | `role`, `content`, `timestamp`, `streaming` |
| `ToolCall` | Tool invocation display | `toolName`, `args`, `status` |
| `ToolResult` | Tool execution result | `toolName`, `result`, `error` |
| `ThinkingIndicator` | Agent processing state | `duration`, `stage` |
| `QuickReply` | Suggested response buttons | `options[]`, `onSelect` |

### 5.2 Content Components

| Primitive | Description | Props |
|-----------|-------------|-------|
| `TextChunk` | Streaming text fragment | `text`, `format` |
| `CodeBlock` | Syntax-highlighted code | `language`, `code`, `copyable` |
| `MarkdownBlock` | Rendered markdown | `content` |
| `Table` | Data table | `headers[]`, `rows[][]` |
| `Image` | Inline image | `src`, `alt`, `width` |

### 5.3 Form Components

| Primitive | Description | Props |
|-----------|-------------|-------|
| `FormField` | Dynamic input field | `type`, `label`, `value`, `validation` |
| `Suggestion` | AI-suggested value | `value`, `confidence`, `onAccept` |
| `FileUpload` | File upload zone | `accept`, `maxSize`, `onUpload` |
| `SelectField` | Dropdown with options | `options[]`, `selected` |

### 5.4 Visualization Components

| Primitive | Description | Props |
|-----------|-------------|-------|
| `ProgressBar` | Progress indicator | `value`, `max`, `label` |
| `MetricCard` | Single metric display | `label`, `value`, `trend` |
| `Chart` | Data visualization | `type`, `data`, `config` |
| `Timeline` | Event timeline | `events[]` |

### 5.5 Status Components

| Primitive | Description | Props |
|-----------|-------------|-------|
| `LoadingSpinner` | Loading state | `size`, `label` |
| `ErrorDisplay` | Error message | `message`, `code`, `stack` |
| `SuccessBanner` | Success notification | `message`, `action` |
| `WarningAlert` | Warning message | `message`, `dismissable` |

---

## 6. Integration Patterns

### 6.1 React Integration

```tsx
import { A2UIRenderer, useA2UIStream } from '@hyyve/ag-ui';

function ChatInterface({ workflowId }) {
  const { document, isStreaming, error } = useA2UIStream({
    endpoint: `/api/workflows/${workflowId}/execute`,
    onChunk: (chunk) => console.log('Received:', chunk),
  });

  return (
    <div data-ag-ui="conversation">
      <A2UIRenderer
        document={document}
        components={{
          ChatMessage: CustomChatMessage,
          CodeBlock: SyntaxHighlighter,
          ToolCall: ToolCallDisplay,
        }}
        isStreaming={isStreaming}
      />
      {isStreaming && <ThinkingIndicator />}
      {error && <ErrorDisplay error={error} />}
    </div>
  );
}
```

### 6.2 Streaming Handler

```typescript
import { A2UIStreamHandler } from '@hyyve/ag-ui';

const handler = new A2UIStreamHandler({
  onComponentAdd: (component) => {
    // New component received
    renderComponent(component);
  },
  onComponentUpdate: (id, props) => {
    // Existing component updated
    updateComponent(id, props);
  },
  onStreamComplete: () => {
    // Stream finished
    finalizeRender();
  },
});

// Connect to SSE endpoint
const eventSource = new EventSource('/api/execute?stream=true');
eventSource.onmessage = (event) => {
  handler.processChunk(JSON.parse(event.data));
};
```

### 6.3 Server-Side Generation (Python)

```python
from hyyve.ag_ui import A2UIBuilder, stream_response

def execute_with_ui(workflow_id: str, inputs: dict):
    builder = A2UIBuilder()

    # Add user message
    builder.add_component(
        type="ChatMessage",
        props={"role": "user", "content": inputs["query"]}
    )

    # Start streaming response
    response_id = builder.add_component(
        type="ChatMessage",
        props={"role": "assistant", "streaming": True}
    )

    async for token in execute_workflow(workflow_id, inputs):
        builder.append_to_component(
            response_id,
            type="TextChunk",
            props={"text": token}
        )
        yield builder.get_delta()

    builder.complete_component(response_id)
    yield builder.get_final()
```

### 6.4 WebSocket Real-time Updates

```typescript
// For collaboration features (Screen 5.1.1)
const ws = new WebSocket('wss://app.hyyve.ai/collab/ws');

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);

  switch (update.type) {
    case 'presence':
      updatePresenceCursors(update.cursors);
      break;
    case 'activity':
      appendActivityFeed(update.event);
      break;
    case 'sync':
      mergeDocumentChanges(update.changes);
      break;
  }
};
```

---

## 7. Design Patterns

### 7.1 Optimistic UI Updates

For responsive feel, render optimistically then reconcile:

```typescript
function sendMessage(content: string) {
  // 1. Optimistically add user message
  const tempId = addOptimisticMessage({
    role: 'user',
    content,
    status: 'sending'
  });

  // 2. Send to server
  const response = await api.sendMessage(content);

  // 3. Reconcile with server response
  reconcileMessage(tempId, response.messageId);
}
```

### 7.2 Graceful Degradation

Provide fallbacks when streaming fails:

```typescript
function ChatZone({ workflowId }) {
  const { isStreaming, error, fallbackContent } = useA2UIStream({
    endpoint: `/api/execute`,
    fallback: async () => {
      // Non-streaming fallback
      const result = await api.execute(workflowId);
      return convertToA2UI(result);
    },
  });

  if (error && fallbackContent) {
    return <StaticRenderer content={fallbackContent} />;
  }

  return <StreamingRenderer />;
}
```

### 7.3 Partial Rendering

Render components as they arrive:

```typescript
const componentRegistry = new Map();

function processStreamChunk(chunk: A2UIChunk) {
  for (const component of chunk.components) {
    if (component.meta?.streaming) {
      // Append to existing component
      appendToComponent(component.parentId, component);
    } else {
      // Render complete component
      componentRegistry.set(component.id, component);
      renderComponent(component);
    }
  }
}
```

---

## 8. Performance Considerations

### 8.1 Virtualization for Long Lists

For activity feeds and chat histories with many messages:

```tsx
import { VirtualList } from 'react-window';

function VirtualizedChat({ messages }) {
  return (
    <VirtualList
      height={600}
      itemCount={messages.length}
      itemSize={getMessageHeight}
    >
      {({ index, style }) => (
        <ChatMessage
          message={messages[index]}
          style={style}
        />
      )}
    </VirtualList>
  );
}
```

### 8.2 Debounced Updates

For high-frequency streams (transcription):

```typescript
const debouncedUpdate = debounce((text) => {
  updateTranscription(text);
}, 50); // 50ms debounce

streamHandler.onTextChunk = (chunk) => {
  buffer += chunk.text;
  debouncedUpdate(buffer);
};
```

### 8.3 Memory Management

Clear old components to prevent memory leaks:

```typescript
const MAX_MESSAGES = 500;

function addMessage(message: A2UIComponent) {
  messages.push(message);

  // Trim old messages
  if (messages.length > MAX_MESSAGES) {
    const removed = messages.splice(0, messages.length - MAX_MESSAGES);
    removed.forEach(m => componentRegistry.delete(m.id));
  }
}
```

---

## 9. Testing AG-UI Components

### 9.1 Unit Testing Primitives

```typescript
import { render, screen } from '@testing-library/react';
import { ChatMessage } from '@hyyve/ag-ui';

test('renders user message correctly', () => {
  render(
    <ChatMessage
      role="user"
      content="Hello, world!"
      timestamp={Date.now()}
    />
  );

  expect(screen.getByText('Hello, world!')).toBeInTheDocument();
  expect(screen.getByRole('article')).toHaveClass('user-message');
});
```

### 9.2 Integration Testing Streams

```typescript
import { MockStreamServer } from '@hyyve/ag-ui/testing';

test('renders streaming response', async () => {
  const mockServer = new MockStreamServer();
  mockServer.queueChunks([
    { type: 'TextChunk', props: { text: 'Hello ' } },
    { type: 'TextChunk', props: { text: 'world!' } },
  ]);

  render(<ChatInterface endpoint={mockServer.url} />);

  await mockServer.sendAllChunks();

  expect(screen.getByText('Hello world!')).toBeInTheDocument();
});
```

---

## 10. Migration Path

### 10.1 From Static UI to AG-UI

1. **Identify dynamic zones** - Mark areas that will receive agent content
2. **Add zone markers** - Insert `AGENT_CONTENT_ZONE` comments
3. **Create component mappings** - Map AG-UI primitives to existing components
4. **Implement stream handlers** - Add SSE/WebSocket connections
5. **Test with mock streams** - Verify rendering with test data
6. **Connect to live agents** - Switch to production endpoints

### 10.2 Incremental Adoption

Start with high-value screens:
1. **Phase 1:** Chat interfaces (1.2.1, 1.3.1)
2. **Phase 2:** Execution monitoring (1.2.3, 2.2.3)
3. **Phase 3:** Query testing (1.4.3, 6.2.4)
4. **Phase 4:** Collaboration (5.1.1)
5. **Phase 5:** Analytics and forms

---

## 11. Appendix: Screen-Component Matrix

| Screen | ChatMessage | CodeBlock | ToolCall | FormField | Chart | Timeline |
|--------|-------------|-----------|----------|-----------|-------|----------|
| 1.2.1 Module Builder | ✅ | ✅ | ✅ | - | - | - |
| 1.2.3 Execution Monitor | ✅ | ✅ | ✅ | - | - | ✅ |
| 1.3.1 Chatbot Builder | ✅ | - | - | - | - | - |
| 1.4.3 KB Query Testing | ✅ | ✅ | - | - | - | - |
| 2.1.3 AI Generation | - | ✅ | - | ✅ | - | - |
| 2.2.3 Live Call | ✅ | - | - | - | ✅ | ✅ |
| 5.1.1 Multi-user Editor | ✅ | - | - | - | - | ✅ |
| 6.2.4 API Playground | - | ✅ | - | - | - | - |

---

## 12. References

- **AG-UI Protocol Specification:** [Internal Doc]
- **A2UI Data Model RFC:** [Internal Doc]
- **Streaming UI Best Practices:** [Internal Doc]
- **Component Library Storybook:** [Internal Link]
- **PRD Section 3.2.6:** AG-UI Integration Requirements (FR179-FR186)
