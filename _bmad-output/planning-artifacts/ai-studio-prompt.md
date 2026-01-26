# Hyyve Platform - Google AI Studio Master Prompt

**Purpose:** Consolidated prompt for generating full frontend from Stitch designs
**Screens:** 146 total across 6 phases
**Last Updated:** 2026-01-26

---

## TECH STACK (STRICT REQUIREMENTS)

```
Framework:     Next.js 15.5.8 (App Router ONLY - NOT pages router)
React:         React 19 with TypeScript 5.x strict mode
Styling:       Tailwind CSS 4.x
Components:    shadcn/ui 3.5.0 (Radix UI primitives)
State:         Zustand 5.0.8 (NOT Redux)
Flow Editor:   @xyflow/react 12.10.0
Collab:        Yjs 14.0.0 for real-time sync
Validation:    Zod 4.0.1 for all external data
Auth:          @clerk/nextjs 6.35.5
Icons:         Lucide React
```

### TypeScript Rules
- ALWAYS use `strict: true` in tsconfig
- NEVER use `any` - use `unknown` and narrow with type guards
- ALWAYS validate external data with Zod at API boundaries
- Use discriminated unions for state machines

### React/Next.js Rules
- Server Components by DEFAULT
- Only add `'use client'` when needed (hooks, event handlers, browser APIs)
- Use `next/navigation` (NOT `next/router`)
- Always handle loading.tsx and error.tsx

---

## DESIGN SYSTEM

```
Theme:           Dark mode primary
Background:      #0F172A (slate-900)
Surface:         #1E293B (slate-800)
Primary:         #4F46E5 (indigo-600)
Primary Hover:   #4338CA (indigo-700)
Text Primary:    #F8FAFC (slate-50)
Text Secondary:  #94A3B8 (slate-400)
Border:          #334155 (slate-700)
Success:         #10B981 (emerald-500)
Warning:         #F59E0B (amber-500)
Error:           #EF4444 (red-500)

Typography:      Inter (UI), JetBrains Mono (code)
Base Spacing:    8px unit system
Border Radius:   4px (sm), 8px (md), 12px (lg)
```

---

## FILE STRUCTURE

```
apps/web/
  app/
    (auth)/                          # Auth route group
      login/page.tsx                 # /login
      register/page.tsx              # /register
      forgot-password/page.tsx       # /forgot-password
      reset-password/page.tsx        # /reset-password
      mfa-setup/page.tsx             # /mfa-setup

    (dashboard)/                     # Main authenticated area
      workspace/page.tsx             # /workspace (home)
      workspace/[id]/page.tsx        # /workspace/:id

      builders/
        module/[id]/page.tsx         # /builders/module/:id
        chatbot/[id]/page.tsx        # /builders/chatbot/:id
        voice/[id]/page.tsx          # /builders/voice/:id
        canvas/[id]/page.tsx         # /builders/canvas/:id

      knowledge/
        page.tsx                     # /knowledge
        [id]/page.tsx                # /knowledge/:id

      marketplace/
        page.tsx                     # /marketplace
        mcp/page.tsx                 # /marketplace/mcp
        mcp/[id]/page.tsx            # /marketplace/mcp/:id
        skills/page.tsx              # /marketplace/skills
        skills/[id]/page.tsx         # /marketplace/skills/:id

      settings/
        page.tsx                     # /settings
        profile/page.tsx             # /settings/profile
        workspace/page.tsx           # /settings/workspace
        api-keys/page.tsx            # /settings/api-keys
        billing/page.tsx             # /settings/billing

      observability/
        page.tsx                     # /observability
        [executionId]/page.tsx       # /observability/:executionId

    api/
      trpc/[trpc]/route.ts           # tRPC handler

  components/
    ui/                              # shadcn/ui (DO NOT MODIFY)
    features/                        # Feature-specific components
      module-builder/
      chatbot-builder/
      voice-builder/
      canvas-builder/
      marketplace/

  hooks/                             # Custom React hooks
  lib/                               # Utilities and clients
  stores/                            # Zustand stores
```

---

## AGENT CONTENT ZONES (CRITICAL)

All screens with agent interaction MUST include these markers:

```html
<!-- AGENT_CONTENT_ZONE: {zone-id} -->
<div
  id="{zone-id}-zone"
  data-ag-ui="{content-type}"
  data-ag-ui-stream="true"
>
  <!-- Agent-generated content renders here -->
</div>
```

### Zone Mappings

| Screen | Zone ID | Content Type | Events |
|--------|---------|--------------|--------|
| Module Builder (1.2.1) | `module-builder-chat` | `conversation` | TEXT_MESSAGE_*, TOOL_CALL_*, STATE_* |
| Execution Monitor (1.2.3) | `execution-output` | `stream-viewer` | RUN_*, STEP_*, ACTIVITY_* |
| Chatbot Preview (1.3.6) | `chatbot-preview` | `chat-widget` | TEXT_MESSAGE_*, TOOL_CALL_* |
| KB Query Testing (1.4.3) | `kb-query-results` | `search-results` | TOOL_CALL_RESULT |
| AI Generation Modal (2.1.3) | `ai-generation-form` | `generative-form` | A2UI: SURFACE_UPDATE |
| Live Call Monitor (2.2.3) | `call-transcription` | `transcription-stream` | TEXT_MESSAGE_*, ACTIVITY_* |
| Multi-user Editor (5.1.1) | `collab-activity-feed` | `activity-stream` | STATE_DELTA, MESSAGES_SNAPSHOT |
| API Playground (6.2.4) | `streaming-response` | `api-response-stream` | TEXT_MESSAGE_CONTENT |

---

## AG-UI STREAMING (SSE)

### Event Types (25 Total)

**Lifecycle Events:**
```typescript
type LifecycleEvent =
  | { type: 'RUN_STARTED'; runId: string; agentId: string; timestamp: string }
  | { type: 'RUN_FINISHED'; runId: string; timestamp: string; duration_ms: number }
  | { type: 'RUN_ERROR'; runId: string; error: { code: string; message: string } }
  | { type: 'STEP_STARTED'; runId: string; stepId: string; stepName: string }
  | { type: 'STEP_FINISHED'; runId: string; stepId: string; result: object };
```

**Text Message Events:**
```typescript
type TextMessageEvent =
  | { type: 'TEXT_MESSAGE_START'; messageId: string; role: 'assistant' | 'system' }
  | { type: 'TEXT_MESSAGE_CONTENT'; messageId: string; delta: string }
  | { type: 'TEXT_MESSAGE_END'; messageId: string };
```

**Tool Call Events:**
```typescript
type ToolCallEvent =
  | { type: 'TOOL_CALL_START'; toolCallId: string; toolName: string }
  | { type: 'TOOL_CALL_ARGS'; toolCallId: string; args: object }
  | { type: 'TOOL_CALL_END'; toolCallId: string }
  | { type: 'TOOL_CALL_RESULT'; toolCallId: string; result: unknown };
```

**State Events:**
```typescript
type StateEvent =
  | { type: 'STATE_SNAPSHOT'; state: object }
  | { type: 'STATE_DELTA'; delta: Array<{ op: 'add'|'remove'|'replace'; path: string; value: unknown }> }
  | { type: 'MESSAGES_SNAPSHOT'; messages: Array<{ role: string; content: string }> };
```

### SSE Implementation Pattern

```typescript
// hooks/useAgentStream.ts
export function useAgentStream(endpoint: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const startStream = useCallback(async (payload: object) => {
    setIsStreaming(true);
    const eventSource = new EventSource(`${endpoint}?${new URLSearchParams(payload)}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'TEXT_MESSAGE_START':
          setMessages(prev => [...prev, { id: data.messageId, content: '', role: 'assistant' }]);
          break;
        case 'TEXT_MESSAGE_CONTENT':
          setMessages(prev => prev.map(m =>
            m.id === data.messageId ? { ...m, content: m.content + data.delta } : m
          ));
          break;
        case 'TEXT_MESSAGE_END':
          break;
        case 'RUN_FINISHED':
          setIsStreaming(false);
          eventSource.close();
          break;
      }
    };

    return () => eventSource.close();
  }, [endpoint]);

  return { messages, isStreaming, startStream };
}
```

---

## DCRL PATTERN (Confidence Routing)

The DCRL (Detect→Clarify→Resolve→Learn) pattern routes agent actions based on confidence:

| Confidence | Threshold | Action |
|------------|-----------|--------|
| High | > 0.85 | Execute immediately |
| Medium | 0.60 - 0.85 | Execute with confirmation UI |
| Low | < 0.60 | Show clarification dialog |

### DCRL State Machine

```typescript
type DCRLState = {
  sessionId: string;
  state: 'DETECT' | 'CLARIFY' | 'RESOLVE' | 'LEARN';
  confidence: number; // 0.0 to 1.0
  intent: {
    detected: string;
    alternatives: Array<{ intent: string; confidence: number }>;
  };
  clarification?: {
    question: string;
    options: string[];
    required: boolean;
  };
  action?: {
    type: string;
    parameters: object;
  };
};
```

### DCRL UI Implementation

```tsx
// Module Builder chat must show confidence and handle clarification
function DCRLChatInterface({ sessionId }: { sessionId: string }) {
  const { state, submitClarification } = useDCRL(sessionId);

  return (
    <div>
      {state.confidence < 0.6 && state.clarification && (
        <ClarificationDialog
          question={state.clarification.question}
          options={state.clarification.options}
          onSelect={submitClarification}
        />
      )}
      {state.confidence >= 0.6 && state.confidence < 0.85 && (
        <ConfirmationBanner
          action={state.action}
          onConfirm={() => resolve(state.action)}
          onCancel={() => cancel()}
        />
      )}
      {/* Chat messages render here */}
    </div>
  );
}
```

---

## API ENDPOINTS

### AgentOS (Use Directly - DO NOT REIMPLEMENT)

| Category | Endpoints |
|----------|-----------|
| Agents | GET `/agents`, GET `/agents/{id}`, POST `/agents/{id}/runs` (SSE) |
| Sessions | GET/POST/PATCH/DELETE `/sessions/*` |
| Memory | GET/POST/PATCH/DELETE `/memories/*` |
| Knowledge | GET/POST `/knowledge/*`, POST `/knowledge/search` |
| AG-UI | POST `/agui` (SSE streaming) |
| A2A | GET `/.well-known/agent-card.json`, POST `/a2a/agents/{id}/v1/message:send` |

### Hyyve Custom (Implement These)

| Category | Base Path | Key Endpoints |
|----------|-----------|---------------|
| Auth | `/api/v1/auth` | `/login`, `/register`, `/mfa/*` |
| Workspaces | `/api/v1/workspaces` | CRUD + `/members` |
| Projects | `/api/v1/projects` | CRUD + `/duplicate`, `/archive` |
| Workflows | `/api/v1/workflows` | CRUD + `/nodes`, `/execute`, `/validate` |
| DCRL | `/api/v1/dcrl` | `/detect`, `/clarify`, `/resolve`, `/learn` |
| Checkpoints | `/api/v1/checkpoints` | CRUD + `/rewind` |
| MCP Registry | `/api/v1/mcp` | `/servers`, `/install`, `/registry/sync` |
| Billing | `/api/v1/billing` | `/subscription`, `/usage`, `/invoices` |

### Response Format

```typescript
// Success
interface SuccessResponse<T> {
  data: T;
  meta: {
    requestId: string;
    timestamp: string;
  };
}

// Error
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: object;
  };
  meta: {
    requestId: string;
    timestamp: string;
  };
}

// Pagination
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}
```

---

## AGENT PERSONALITIES

| Agent | Role | Personality |
|-------|------|-------------|
| **Bond** | Module Builder Orchestrator | Polished, confident, efficient |
| **Wendy** | Workflow Assistant | Warm, helpful, patient |
| **Morgan** | Data Analyst | Precise, methodical, data-driven |
| **Artie** | Creative/Design | Enthusiastic, imaginative, visual |

---

## SCREEN GROUPS (146 Screens)

### Phase 1: Foundation (49 screens)
- 1.1.x: Authentication (7 screens)
- 1.2.x: Module Builder (9 screens) **← Has AGENT_CONTENT_ZONE**
- 1.3.x: Chatbot Builder (7 screens) **← Has AGENT_CONTENT_ZONE**
- 1.4.x: Knowledge Base (7 screens) **← Has AGENT_CONTENT_ZONE**
- 1.5.x: Workspace (2 screens)
- 1.6.x: Billing (2 screens)
- 1.8.x: Observability (2 screens)
- 1.9.x: Onboarding (3 screens)
- 1.10.x: Settings (4 screens)

### Phase 2: Full Builder Suite (46 screens)
- 2.1.x: Canvas Builder (9 screens) **← Has AGENT_CONTENT_ZONE**
- 2.2.x: Voice Builder (6 screens) **← Has AGENT_CONTENT_ZONE**
- 2.3.x: Command Center (1 screen)
- 2.4.x: HITL (2 screens)
- 2.6.x: Chatwoot Integration (4 screens)
- 2.7.x: Environment Management (4 screens)
- 2.8.x: Testing (3 screens)
- 2.9.x: Export (2 screens)
- 2.10.x: API Management (3 screens)
- 2.11.x: Webhooks (2 screens)
- 2.12.x: Templates (3 screens)
- 2.13.x: Tenants (2 screens)
- 2.14.x: UI Generation (5 screens) **← Has A2UI**

### Phase 3: Marketplace (18 screens)
- 3.1.x: Marketplace Home (4 screens)
- 3.2.x: MCP Registry (4 screens)
- 3.3.x: Creator Dashboard (6 screens)
- 3.5.x: Workflow Templates (4 screens)

### Phase 4: Enterprise (26 screens)
- 4.1.x: Agency (7 screens)
- 4.4.x: Enterprise Admin (2 screens)
- 4.6.x: Support Console (3 screens)
- 4.7.x: Security (4 screens)
- 4.8.x: Organization (4 screens)
- 4.9.x: Notifications (4 screens)

### Phase 5: Collaboration (5 screens)
- 5.1.x: Multi-user Editor (3 screens) **← Has AGENT_CONTENT_ZONE + Yjs**
- 5.2.x: Versioning (2 screens)

### Phase 6: Future (7 screens)
- 6.1.x: API Keys (1 screen)
- 6.2.x: Developer Portal (4 screens) **← Has AGENT_CONTENT_ZONE**
- 6.3.x: Self-Hosted (1 screen)
- 6.5.x: Mobile (1 screen)

---

## CRITICAL IMPLEMENTATION RULES

1. **Server Components Default** - Only use `'use client'` when hooks/events needed
2. **Zod Validation** - All API responses must be validated with Zod
3. **Zustand Selectors** - Never select entire store, use `(state) => state.field`
4. **shadcn/ui** - Never modify files in `/components/ui`
5. **AGENT_CONTENT_ZONE** - Include markers on all 9 agent-interactive screens
6. **SSE Cleanup** - Always close EventSource on component unmount
7. **DCRL Thresholds** - Implement confidence-based routing on Module Builder
8. **Error Boundaries** - Use Next.js error.tsx for graceful failures
9. **Loading States** - Use Next.js loading.tsx for Suspense boundaries
10. **Accessibility** - WCAG 2.1 AA compliance, proper ARIA labels

---

## STITCH IMPORT INSTRUCTIONS

When importing Stitch screens:

1. **Upload all screenshots** from Stitch export
2. **Paste HTML/React code** from Stitch export
3. **Reference this document** for tech stack and patterns
4. **Map screens to routes** using the File Structure section above
5. **Add AGENT_CONTENT_ZONE markers** for the 9 screens listed
6. **Implement SSE hooks** for streaming screens
7. **Wire DCRL pattern** for Module Builder chat

---

## POST-GENERATION CHECKLIST

After AI Studio generates code:

- [ ] Verify `'use client'` only where needed
- [ ] Check all AGENT_CONTENT_ZONE markers present
- [ ] Validate Zod schemas for API responses
- [ ] Confirm SSE event handlers for streaming screens
- [ ] Test DCRL confidence thresholds in Module Builder
- [ ] Verify shadcn/ui components used correctly
- [ ] Check route structure matches specification
- [ ] Confirm Zustand stores use proper selectors
- [ ] Test loading and error states
- [ ] Validate accessibility (ARIA labels, focus management)

---

_Document generated for Google AI Studio import - 2026-01-26_
