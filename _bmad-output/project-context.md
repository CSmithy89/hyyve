---
project_name: 'Agentic RAG Platform'
user_name: 'Chris'
date: '2026-01-26'
status: 'complete'
sections_completed: ['technology_stack', 'typescript_rules', 'nextjs_rules', 'react_rules', 'state_management', 'reactflow', 'yjs', 'trpc', 'supabase', 'dcrl', 'circuit_breaker', 'realtime_channels', 'protocol_stack', 'ag_ui_patterns', 'testing', 'code_quality', 'performance', 'security', 'directory_structure', 'critical_rules', 'usage_guidelines']
rule_count: 91
optimized_for_llm: true
existing_patterns_found: 118
validated_via: ['Context7', 'DeepWiki', '37 research documents', 'PRD (248 FRs, 70 NFRs)', 'Architecture (8 ADRs)', 'UX Specification', 'AG-UI Integration Guide']
sources:
  - PRD: '/home/chris/projects/work/Agentic Rag/_bmad-output/planning-artifacts/prd.md'
  - Architecture: '/home/chris/projects/work/Agentic Rag/_bmad-output/planning-artifacts/architecture.md'
  - UX_Spec: '/home/chris/projects/work/Agentic Rag/_bmad-output/planning-artifacts/ux-design-specification.md'
  - AG_UI_Guide: '/home/chris/projects/work/Agentic Rag/_bmad-output/planning-artifacts/ag-ui-integration-guide.md'
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

### Core Frontend
| Package | Version | Install |
|---------|---------|---------|
| `next` | 15.5.8 | `npm install next@latest` |
| `react` | 19.x | `npm install react@latest react-dom@latest` |
| `typescript` | 5.x | `npm install -D typescript` |
| `@xyflow/react` | 12.10.0 | `npm install @xyflow/react` |
| `zustand` | 5.0.8 | `npm install zustand` |
| `tailwindcss` | 4.x | `npm install tailwindcss` |
| `zod` | 4.0.1 | `npm install zod` |

### Collaborative Editing
| Package | Version | Install |
|---------|---------|---------|
| `yjs` | 14.0.0 | `npm install yjs` |
| `y-websocket` | latest | `npm install y-websocket` |
| `y-indexeddb` | latest | `npm install y-indexeddb` |

### CopilotKit + AG-UI Protocol Stack
| Package | Install |
|---------|---------|
| `@copilotkit/react-ui` | `npm install @copilotkit/react-ui` |
| `@copilotkit/react-core` | `npm install @copilotkit/react-core` |
| `@copilotkit/runtime` | `npm install @copilotkit/runtime` |
| `@ag-ui/client` | `npm install @ag-ui/client` |
| `@ag-ui/agno` | `npm install @ag-ui/agno` |

### UI Components
| Package | Version | Install |
|---------|---------|---------|
| `shadcn` | 3.5.0 | `npx shadcn@latest init` |
| `@radix-ui/*` | latest | Via shadcn |

### Authentication
| Package | Version | Install |
|---------|---------|---------|
| `@clerk/nextjs` | 6.35.5 | `npm install @clerk/nextjs` |

### Database & Backend
| Package | Version | Install |
|---------|---------|---------|
| `@supabase/supabase-js` | 2.87.0 | `npm install @supabase/supabase-js` |
| `@supabase/ssr` | latest | `npm install @supabase/ssr` |
| `redis` | latest | `npm install redis` |

### Agent Runtime (AgentOS - Python Backend)
| Package | Version | Install |
|---------|---------|---------|
| `agno` | 2.4.0+ | `pip install agno` |
| `fastapi` | latest | Via agno |
| `anthropic` | latest | `pip install anthropic` |

**AgentOS Architecture:**
- Provides 50+ API endpoints for agents, sessions, memory, knowledge
- SSE streaming for real-time agent responses
- A2A (Agent-to-Agent) protocol for inter-agent communication
- Memory scopes: user, agent, team
- FastAPI foundation - extend with custom Hyyve routes
- See: `agentos-integration-spec.md` for full endpoint reference

### Payments
| Package | Version | Install |
|---------|---------|---------|
| `stripe` | 20.0.0 | `npm install stripe` |

### API Layer
| Package | Version | Install |
|---------|---------|---------|
| `@trpc/server` | 11.8.0 | `npm install @trpc/server` |
| `@trpc/client` | 11.8.0 | `npm install @trpc/client` |
| `@trpc/react-query` | 11.8.0 | `npm install @trpc/react-query` |
| `@trpc/next` | 11.8.0 | `npm install @trpc/next` |
| `@tanstack/react-query` | latest | `npm install @tanstack/react-query` |

### Observability
| Package | Version | Install |
|---------|---------|---------|
| `langfuse` | 3.148.0 | `npm install langfuse` |
| `@langfuse/core` | 4.4.0 | `npm install @langfuse/core` |

### Workflow Orchestration
| Package | Install |
|---------|---------|
| `@temporalio/client` | `npm install @temporalio/client` |
| `@temporalio/worker` | `npm install @temporalio/worker` |
| `@temporalio/workflow` | `npm install @temporalio/workflow` |

### Testing
| Package | Version | Install |
|---------|---------|---------|
| `vitest` | 4.0.x | `npm install -D vitest` |
| `@playwright/test` | 1.51.0 | `npm install -D @playwright/test` |

### Build & Monorepo
| Package | Install |
|---------|---------|
| `turbo` | `npm install -D turbo` |
| `pnpm` | `npm install -g pnpm` |

### External Services (API integrations)
- **Supabase** - PostgreSQL + RLS + Realtime
- **Clerk** - Consumer authentication
- **WorkOS** - Enterprise SSO/SCIM
- **Stripe** - Billing + Connect marketplace payouts
- **Chatwoot** - Contact center backend
- **Langfuse** - Agent observability & cost tracking
- **Resend** - Transactional email
- **Twilio** - Voice/SMS telephony
- **fal.ai** - AI generation gateway (images, video, 3D)

---

## Critical Implementation Rules

### 1. TypeScript Rules

```typescript
// ALWAYS use strict mode - configured in tsconfig.json
"strict": true,
"noUncheckedIndexedAccess": true,
"noImplicitReturns": true

// ALWAYS validate external data with Zod at boundaries
import { z } from 'zod';
const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  workspaceId: z.string().uuid(),
});
type User = z.infer<typeof UserSchema>;

// NEVER use `any` - use `unknown` and narrow with type guards
function processData(data: unknown): ProcessedData {
  if (!isValidData(data)) throw new ValidationError();
  return transform(data);
}

// ALWAYS use discriminated unions for state
type AgentState =
  | { status: 'idle' }
  | { status: 'thinking'; startedAt: number }
  | { status: 'streaming'; chunks: string[] }
  | { status: 'complete'; result: AgentResult }
  | { status: 'error'; error: AgentError };
```

### 2. Next.js 15 App Router Rules

```typescript
// ALWAYS use Server Components by default
// Only add 'use client' when you need:
// - useState, useEffect, or other hooks
// - Event handlers (onClick, onChange)
// - Browser APIs (localStorage, window)

// CORRECT: Server Component (default)
async function AgentList() {
  const agents = await db.agents.findMany();
  return <ul>{agents.map(a => <li key={a.id}>{a.name}</li>)}</ul>;
}

// CORRECT: Client Component when needed
'use client';
function AgentToggle({ agentId }: { agentId: string }) {
  const [enabled, setEnabled] = useState(false);
  return <Switch checked={enabled} onCheckedChange={setEnabled} />;
}

// ALWAYS use Next.js file conventions
// app/
//   (dashboard)/           # Route group - no URL impact
//     workflows/
//       page.tsx           # /workflows
//       [id]/page.tsx      # /workflows/:id
//       loading.tsx        # Suspense boundary
//       error.tsx          # Error boundary
//   api/
//     trpc/[trpc]/route.ts # tRPC handler

// ALWAYS use next/navigation, NEVER next/router
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

// ALWAYS handle loading and error states
// loading.tsx provides automatic Suspense
// error.tsx provides automatic error boundary
```

### 3. React 19 Patterns

```typescript
// ALWAYS use React 19 `use` for promises in render
function AgentDetails({ agentPromise }: { agentPromise: Promise<Agent> }) {
  const agent = use(agentPromise);
  return <div>{agent.name}</div>;
}

// ALWAYS use useTransition for non-blocking updates
function SaveButton({ onSave }: { onSave: () => Promise<void> }) {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      disabled={isPending}
      onClick={() => startTransition(onSave)}
    >
      {isPending ? 'Saving...' : 'Save'}
    </Button>
  );
}

// ALWAYS use useOptimistic for instant feedback
function LikeButton({ likes, onLike }: Props) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    (current, _) => current + 1
  );
  return (
    <Button onClick={() => {
      addOptimisticLike(null);
      onLike();
    }}>
      ♥ {optimisticLikes}
    </Button>
  );
}
```

### 4. State Management (Zustand 5.x)

```typescript
// ALWAYS create typed stores with slices
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface WorkflowSlice {
  nodes: Node[];
  edges: Edge[];
  addNode: (node: Node) => void;
  updateNode: (id: string, data: Partial<Node>) => void;
}

export const useWorkflowStore = create<WorkflowSlice>()(
  immer((set) => ({
    nodes: [],
    edges: [],
    addNode: (node) => set((state) => { state.nodes.push(node); }),
    updateNode: (id, data) => set((state) => {
      const node = state.nodes.find(n => n.id === id);
      if (node) Object.assign(node, data);
    }),
  }))
);

// ALWAYS use selectors to prevent unnecessary re-renders
const nodes = useWorkflowStore((state) => state.nodes);
const addNode = useWorkflowStore((state) => state.addNode);

// NEVER select the entire store
// BAD: const store = useWorkflowStore();
// GOOD: const nodes = useWorkflowStore(state => state.nodes);
```

### 5. ReactFlow (@xyflow/react 12.x)

```typescript
// ALWAYS use typed nodes and edges
import { Node, Edge, NodeTypes } from '@xyflow/react';

type AgentNode = Node<{ label: string; agentType: string }>;
type ToolNode = Node<{ toolId: string; config: ToolConfig }>;
type WorkflowNode = AgentNode | ToolNode;

// ALWAYS define nodeTypes outside component to prevent recreation
const nodeTypes: NodeTypes = {
  agent: AgentNodeComponent,
  tool: ToolNodeComponent,
  condition: ConditionNodeComponent,
} satisfies NodeTypes;

// ALWAYS use useNodesState and useEdgesState for controlled flow
function WorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView
    />
  );
}
```

### 6. Yjs Collaborative Editing

```typescript
// ALWAYS initialize Yjs document with proper structure
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const ydoc = new Y.Doc();
const yNodes = ydoc.getArray<YNode>('nodes');
const yEdges = ydoc.getArray<YEdge>('edges');
const yMetadata = ydoc.getMap('metadata');

// ALWAYS use awareness for presence
const provider = new WebsocketProvider(wsUrl, roomId, ydoc);
provider.awareness.setLocalStateField('user', {
  name: user.name,
  color: user.color,
  cursor: null,
});

// ALWAYS wrap mutations in transactions for atomicity
ydoc.transact(() => {
  yNodes.push([newNode]);
  yEdges.push([newEdge]);
});

// ALWAYS clean up on unmount
useEffect(() => {
  return () => {
    provider.disconnect();
    ydoc.destroy();
  };
}, []);
```

### 7. tRPC API Layer

```typescript
// ALWAYS define procedures with Zod validation
import { z } from 'zod';
import { router, protectedProcedure } from './trpc';

export const workflowRouter = router({
  list: protectedProcedure
    .input(z.object({
      workspaceId: z.string().uuid(),
      limit: z.number().min(1).max(100).default(20),
      cursor: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.db.workflow.findMany({
        where: { workspaceId: input.workspaceId },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
      });
    }),

  create: protectedProcedure
    .input(WorkflowCreateSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.workflow.create({ data: input });
    }),
});

// ALWAYS use React Query patterns on client
const { data, isLoading } = trpc.workflow.list.useQuery({ workspaceId });
const createMutation = trpc.workflow.create.useMutation({
  onSuccess: () => utils.workflow.list.invalidate(),
});
```

### 8. Supabase + RLS

```sql
-- ALWAYS enable RLS on all tables
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;

-- ALWAYS create policies for CRUD operations
CREATE POLICY "Users can view own workspace workflows"
  ON workflows FOR SELECT
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members
    WHERE user_id = auth.uid()
  ));

-- ALWAYS use workspace_id for multi-tenancy isolation
CREATE POLICY "Users can insert into own workspace"
  ON workflows FOR INSERT
  WITH CHECK (workspace_id IN (
    SELECT workspace_id FROM workspace_members
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'member')
  ));
```

```typescript
// ALWAYS use @supabase/ssr for Next.js
import { createServerClient } from '@supabase/ssr';

export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { /* Next.js cookie handling */ } }
  );
}
```

### 9. DCRL Pattern (Detect-Clarify-Resolve-Learn)

```typescript
// ALWAYS implement DCRL for agent interactions
interface DCRLResponse {
  confidence: number;  // 0.0 to 1.0
  action: 'execute' | 'clarify' | 'suggest';
  message: string;
  options?: ClarificationOption[];
}

// Confidence thresholds from ADR-004
const THRESHOLDS = {
  AUTO_EXECUTE: 0.85,  // High confidence - proceed automatically
  CLARIFY: 0.60,       // Medium confidence - ask for clarification
  SUGGEST: 0.0,        // Low confidence - only suggest, don't act
};

function handleAgentResponse(response: DCRLResponse) {
  if (response.confidence >= THRESHOLDS.AUTO_EXECUTE) {
    return executeAction(response);
  } else if (response.confidence >= THRESHOLDS.CLARIFY) {
    return requestClarification(response.options);
  } else {
    return showSuggestions(response);
  }
}
```

### 10. Circuit Breaker Pattern

```typescript
// ALWAYS implement circuit breakers for external services
interface CircuitBreakerConfig {
  maxRetries: 3;
  baseDelayMs: 1000;
  backoffMultiplier: 2;
  maxDelayMs: 30000;
  failureThreshold: 5;
  recoveryTimeMs: 60000;
}

type CircuitState = 'closed' | 'open' | 'half-open';

class CircuitBreaker {
  private state: CircuitState = 'closed';
  private failures = 0;
  private lastFailure?: Date;

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (this.shouldAttemptRecovery()) {
        this.state = 'half-open';
      } else {
        throw new CircuitOpenError();
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
}
```

### 11. Real-Time Channels

```typescript
// 5 Real-Time Channels - use the right one for the job

// 1. Yjs WebSocket - Collaborative editing (CRDT)
// Use for: Document co-editing, workflow canvas sync
const ydoc = new Y.Doc();
const provider = new WebsocketProvider(url, roomId, ydoc);

// 2. AG-UI SSE - Agent streaming responses
// Use for: LLM token streaming, agent status updates
const agClient = new AGUIClient({ endpoint: '/api/ag-ui' });
await agClient.stream(agentId, { onToken: handleToken });

// 3. PostgreSQL NOTIFY - Database change events (<10ms)
// Use for: Workflow state changes, entity updates
await supabase
  .channel('workflow-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'workflows'
  }, handleChange)
  .subscribe();

// 4. Redis Pub/Sub - Cross-service events (<200ms)
// Use for: Agent coordination, cache invalidation
await redis.subscribe('agent:events', handleAgentEvent);

// 5. gRPC Streaming - High-throughput inter-service (<50ms)
// Use for: Internal service communication, bulk operations
```

### 12. Protocol Stack (A2UI + AG-UI + MCP + A2A)

```typescript
// ALWAYS use the correct protocol for each layer

// A2UI v0.8 - Agent-to-UI rendering
// Renders agent responses into React components
import { A2UIRenderer } from '@copilotkit/a2ui-renderer';

// AG-UI - Server-Sent Events for streaming
// Handles real-time token streaming from agents
import { AGUIClient } from '@ag-ui/client';

// MCP - Model Context Protocol for tool integration
// Defines how agents access external tools
interface MCPTool {
  name: string;
  description: string;
  parameters: JSONSchema;
  execute: (params: unknown) => Promise<unknown>;
}

// A2A v0.3.0 - Agent-to-Agent communication
// Orchestrates multi-agent workflows
interface A2AMessage {
  from: AgentId;
  to: AgentId;
  type: 'request' | 'response' | 'event';
  payload: unknown;
}
```

### 13. AG-UI/A2UI Implementation Patterns

#### AGENT_CONTENT_ZONE Marker Pattern

```html
<!-- ALWAYS use this pattern for dynamic agent content areas -->
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

**Key Zones by Screen:**
| Zone ID | Screen | Content Type |
|---------|--------|--------------|
| `module-builder-chat` | Module Builder | `conversation` |
| `execution-output` | Execution Monitor | `stream-viewer` |
| `chatbot-preview` | Chatbot Builder | `chat-widget` |
| `kb-query-results` | KB Query Testing | `search-results` |
| `call-transcription` | Live Call Monitor | `transcription-stream` |
| `collab-activity-feed` | Multi-user Editor | `activity-stream` |

#### A2UI Component Schema

```typescript
// ALWAYS use this interface for A2UI components
interface A2UIComponent {
  id: string;                    // Unique component identifier
  type: string;                  // Component type (e.g., "ChatMessage")
  parentId: string | null;       // Parent ID (null for root)
  props: Record<string, unknown>;
  children?: string[];           // Child IDs (adjacency list)
  meta?: {
    timestamp: number;
    source: 'agent' | 'user' | 'system';
    streamIndex?: number;
  };
}

interface A2UIDocument {
  version: string;
  rootIds: string[];
  components: Map<string, A2UIComponent>;
  pendingComponents?: string[];  // Components being generated
  streamCursor?: string;
}
```

#### Component Primitives Library

| Category | Primitives |
|----------|------------|
| **Chat** | `ChatMessage`, `ToolCall`, `ToolResult`, `ThinkingIndicator`, `QuickReply` |
| **Content** | `TextChunk`, `CodeBlock`, `MarkdownBlock`, `Table`, `Image` |
| **Form** | `FormField`, `Suggestion`, `FileUpload`, `SelectField` |
| **Visualization** | `ProgressBar`, `MetricCard`, `Chart`, `Timeline` |
| **Status** | `LoadingSpinner`, `ErrorDisplay`, `SuccessBanner`, `WarningAlert` |

#### React Streaming Integration

```typescript
// ALWAYS use useA2UIStream for agent content zones
import { A2UIRenderer, useA2UIStream } from '@hyyve/ag-ui';

function ChatInterface({ workflowId }: { workflowId: string }) {
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

#### Streaming Handler Pattern

```typescript
// ALWAYS use A2UIStreamHandler for SSE connections
import { A2UIStreamHandler } from '@hyyve/ag-ui';

const handler = new A2UIStreamHandler({
  onComponentAdd: (component) => renderComponent(component),
  onComponentUpdate: (id, props) => updateComponent(id, props),
  onStreamComplete: () => finalizeRender(),
});

const eventSource = new EventSource('/api/execute?stream=true');
eventSource.onmessage = (event) => {
  handler.processChunk(JSON.parse(event.data));
};
```

#### AG-UI Performance Patterns

```typescript
// ALWAYS virtualize long lists (chat histories, activity feeds)
import { VirtualList } from 'react-window';

function VirtualizedChat({ messages }: { messages: A2UIComponent[] }) {
  return (
    <VirtualList
      height={600}
      itemCount={messages.length}
      itemSize={getMessageHeight}
    >
      {({ index, style }) => (
        <ChatMessage message={messages[index]} style={style} />
      )}
    </VirtualList>
  );
}

// ALWAYS debounce high-frequency streams (transcription)
const debouncedUpdate = debounce((text: string) => {
  updateTranscription(text);
}, 50);

// ALWAYS limit stored messages to prevent memory leaks
const MAX_MESSAGES = 500;
function addMessage(message: A2UIComponent) {
  messages.push(message);
  if (messages.length > MAX_MESSAGES) {
    const removed = messages.splice(0, messages.length - MAX_MESSAGES);
    removed.forEach(m => componentRegistry.delete(m.id));
  }
}
```

#### Optimistic UI Pattern

```typescript
// ALWAYS use optimistic updates for responsive feel
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

---

## Testing Rules

### Unit Tests (Vitest)

```typescript
// ALWAYS co-locate tests with source files
// src/components/AgentCard.tsx
// src/components/AgentCard.test.tsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('AgentCard', () => {
  it('displays agent name and status', () => {
    render(<AgentCard agent={mockAgent} />);
    expect(screen.getByText('Bond')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Active');
  });
});

// ALWAYS mock external dependencies
vi.mock('@/lib/supabase', () => ({
  createClient: () => mockSupabaseClient,
}));
```

### E2E Tests (Playwright)

```typescript
// ALWAYS use data-testid for E2E selectors
<Button data-testid="create-workflow-btn">Create</Button>

// Test file
test('can create a new workflow', async ({ page }) => {
  await page.goto('/workflows');
  await page.getByTestId('create-workflow-btn').click();
  await page.getByLabel('Workflow Name').fill('My Workflow');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('My Workflow')).toBeVisible();
});

// ALWAYS test critical user journeys
// - Authentication flow
// - Workflow creation and editing
// - Agent configuration
// - Real-time collaboration
```

---

## Code Quality & Style

### Naming Conventions

```typescript
// Agent personalities - use these names consistently
type AgentPersonality = 'Bond' | 'Wendy' | 'Morgan' | 'Artie';
// Bond - Concierge/orchestrator, polished and confident
// Wendy - Workflow assistant, warm and helpful
// Morgan - Data analyst, precise and methodical
// Artie - Creative/design, enthusiastic and imaginative

// Package naming
// @platform/* - Core platform packages
// @agents/* - Agent-specific packages
// @tools/* - Tool integrations

// File naming
// components/AgentCard.tsx (PascalCase for components)
// hooks/useWorkflow.ts (camelCase with use prefix)
// utils/format-date.ts (kebab-case for utilities)
// types/workflow.types.ts (kebab-case with .types suffix)
```

### Component Structure

```typescript
// ALWAYS follow this component structure
import { type ComponentProps } from 'react';
import { cn } from '@/lib/utils';

// 1. Types first
interface AgentCardProps extends ComponentProps<'div'> {
  agent: Agent;
  onSelect?: (agent: Agent) => void;
}

// 2. Component definition
export function AgentCard({
  agent,
  onSelect,
  className,
  ...props
}: AgentCardProps) {
  // 3. Hooks at top
  const { data: status } = useAgentStatus(agent.id);

  // 4. Event handlers
  const handleClick = () => onSelect?.(agent);

  // 5. Render
  return (
    <div
      className={cn('rounded-lg border p-4', className)}
      onClick={handleClick}
      {...props}
    >
      {/* content */}
    </div>
  );
}
```

### shadcn/ui Usage

```typescript
// ALWAYS use shadcn components from @/components/ui
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// ALWAYS use the cn() utility for conditional classes
import { cn } from '@/lib/utils';

<Button
  className={cn(
    'w-full',
    isLoading && 'opacity-50 cursor-not-allowed'
  )}
  disabled={isLoading}
>
  {isLoading ? 'Saving...' : 'Save'}
</Button>

// NEVER modify files in @/components/ui directly
// Instead, extend or wrap components
```

---

## Performance Requirements (from NFRs)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Voice interaction latency | <500ms | Time to first agent response |
| API response (p95) | <100ms | Server-side processing |
| React Flow render | <16ms | Frame time for 100+ nodes |
| Yjs sync latency | <50ms | Peer-to-peer CRDT sync |
| PostgreSQL NOTIFY | <10ms | Database event propagation |
| Redis Pub/Sub | <200ms | Cross-service messaging |
| gRPC streaming | <50ms | Inter-service communication |

---

## Security Requirements

- **Authentication**: Clerk for consumer, WorkOS for enterprise SSO/SCIM
- **Authorization**: Supabase RLS for row-level security
- **Multi-tenancy**: 3 levels (Workspace, Client sub-account, Enterprise)
- **Compliance**: SOC 2 Type II, GDPR, CCPA ready
- **Secrets**: Never commit to git, use environment variables
- **API Keys**: Rotate every 90 days, scope to minimum permissions

---

## Directory Structure

```
apps/
  web/                    # Next.js 15 frontend
    app/                  # App Router pages
    components/           # React components
      ui/                 # shadcn/ui components
    hooks/                # Custom React hooks
    lib/                  # Utilities and clients
    stores/               # Zustand stores

packages/
  @platform/
    agents/               # Agent definitions
    tools/                # MCP tool implementations
    protocols/            # A2UI, AG-UI, A2A, MCP
    db/                   # Supabase client & types

infrastructure/
  temporal/               # Workflow orchestration
  redis/                  # Caching & pub/sub
```

---

## Critical Don't-Miss Rules

1. **NEVER skip Zod validation** at API boundaries - all external data must be validated
2. **NEVER use `'use client'` unnecessarily** - Server Components are the default
3. **NEVER select entire Zustand store** - always use selectors
4. **NEVER modify shadcn/ui files directly** - extend or wrap instead
5. **ALWAYS implement DCRL** for agent interactions with confidence thresholds
6. **ALWAYS use RLS policies** - never bypass Supabase row-level security
7. **ALWAYS clean up subscriptions** - Yjs, Supabase realtime, etc.
8. **ALWAYS use circuit breakers** for external service calls
9. **ALWAYS use the correct real-time channel** for the use case
10. **ALWAYS handle loading and error states** - use Next.js conventions
11. **ALWAYS use AGENT_CONTENT_ZONE markers** for dynamic agent content areas
12. **ALWAYS use useA2UIStream hook** for streaming agent responses
13. **ALWAYS virtualize long lists** (chat histories >100 messages)
14. **ALWAYS debounce high-frequency streams** (transcription: 50ms)
15. **ALWAYS limit stored messages** (MAX_MESSAGES=500) to prevent memory leaks
16. **ALWAYS use optimistic UI updates** for responsive agent interactions

---

## Usage Guidelines

**For AI Agents:**
- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Reference specific sections when making implementation decisions

**For Humans:**
- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

---

_Last Updated: 2026-01-26_
