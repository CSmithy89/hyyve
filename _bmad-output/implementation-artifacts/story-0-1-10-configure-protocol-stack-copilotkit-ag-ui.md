# Story 0.1.10: Configure Protocol Stack (CopilotKit + AG-UI)

## Status

**done**

## Epic

**0.1 - Project Foundation & Infrastructure Setup**

## User Story

As a **developer**,
I want **CopilotKit and AG-UI protocols configured**,
So that **agent-to-UI communication is standardized**.

## Acceptance Criteria

### AC1: Protocol Packages Installed

- **Given** the core dependencies are installed
- **When** I configure the protocol stack
- **Then** the following are installed:
  - `@copilotkit/react-ui`
  - `@copilotkit/react-core`
  - `@copilotkit/runtime`
  - `@ag-ui/client`

### AC2: CopilotKit Provider Configured

- **Given** CopilotKit packages are installed
- **When** I configure the provider
- **Then** `CopilotKit` provider is added to root layout
- **And** runtime endpoint is configured

### AC3: AG-UI SSE Endpoint Created

- **Given** AG-UI packages are installed
- **When** I create the SSE endpoint
- **Then** AG-UI SSE endpoint is created at `app/api/ag-ui/route.ts`
- **And** endpoint supports Server-Sent Events

### AC4: AG-UI Client Configured

- **Given** AG-UI endpoint is created
- **When** I configure the client
- **Then** AG-UI client is configured for streaming
- **And** client supports all 25 AG-UI event types

### AC5: AG-UI Event Types Defined

- **Given** AG-UI client is configured
- **When** I define event types
- **Then** all 25 AG-UI event types are typed
- **And** types are exported for use in components

## Technical Notes

### Protocol Stack Overview

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React)                  │
├─────────────────────────────────────────────────────┤
│  CopilotKit (Chat UI)  │  AG-UI (Streaming)         │
│  - Chat panel          │  - SSE connection          │
│  - Message rendering   │  - 25 event types          │
│  - Tool UI             │  - Real-time updates       │
├─────────────────────────────────────────────────────┤
│                   API Routes                         │
│  /api/copilotkit  │  /api/ag-ui                     │
├─────────────────────────────────────────────────────┤
│                 AgentOS Backend                      │
└─────────────────────────────────────────────────────┘
```

### AG-UI 25 Event Types

```typescript
// Agent Lifecycle Events
| 'RUN_STARTED' | 'RUN_FINISHED' | 'RUN_ERROR'

// Step/Execution Events
| 'STEP_STARTED' | 'STEP_FINISHED' | 'STEP_ERROR'

// Text Streaming Events
| 'TEXT_MESSAGE_START' | 'TEXT_MESSAGE_CONTENT' | 'TEXT_MESSAGE_END'

// Tool Execution Events
| 'TOOL_CALL_START' | 'TOOL_CALL_ARGS' | 'TOOL_CALL_END'
| 'TOOL_CALL_RESULT'

// State Management Events
| 'STATE_SNAPSHOT' | 'STATE_DELTA'

// Activity Events
| 'ACTIVITY_START' | 'ACTIVITY_DELTA' | 'ACTIVITY_END'

// Message Events
| 'MESSAGES_SNAPSHOT'

// Raw Events
| 'RAW' | 'CUSTOM'
```

### CopilotKit Configuration

```typescript
// apps/web/lib/protocols/copilotkit.tsx
import { CopilotKit } from '@copilotkit/react-core';

export function CopilotKitProvider({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      {children}
    </CopilotKit>
  );
}
```

### AG-UI Client Configuration

```typescript
// apps/web/lib/protocols/ag-ui.ts
export function createAGUIClient(options: AGUIClientOptions) {
  return new EventSource(`/api/ag-ui?${params}`);
}
```

## Environment Variables

No additional environment variables required.

## Files to Create

| File | Purpose |
|------|---------|
| `apps/web/lib/protocols/copilotkit.tsx` | CopilotKit provider component |
| `apps/web/lib/protocols/ag-ui.ts` | AG-UI client and types |
| `apps/web/lib/protocols/types.ts` | Protocol type definitions |
| `apps/web/lib/protocols/index.ts` | Barrel exports |
| `apps/web/app/api/ag-ui/route.ts` | AG-UI SSE endpoint |
| `apps/web/app/api/copilotkit/route.ts` | CopilotKit runtime endpoint |

## Files to Modify

| File | Changes |
|------|---------|
| `apps/web/app/providers.tsx` | Add CopilotKitProvider |
| `apps/web/package.json` | Verify protocol packages |

## Dependencies

### Story Dependencies

- **Story 0.1.1** (Scaffold Turborepo) - Package structure must exist
- **Story 0.1.3** (Core Dependencies) - React Query, Zustand

### Package Dependencies

Already installed in Story 0.1.1:
- `@copilotkit/react-ui` - Chat UI components
- `@copilotkit/react-core` - Core CopilotKit hooks
- `@copilotkit/runtime` - Runtime for agent communication
- `@ag-ui/client` - AG-UI streaming client

## Test Strategy

### Unit Tests

1. **Package Verification:**
   - Verify all protocol packages are installed

2. **File Structure:**
   - Verify copilotkit.tsx exists
   - Verify ag-ui.ts exists
   - Verify types.ts exists
   - Verify API routes exist

3. **Type Definitions:**
   - Verify 25 AG-UI event types are defined
   - Verify exports from index.ts

### Build Verification

```bash
pnpm install
pnpm build
pnpm typecheck
```

## Definition of Done

- [x] All CopilotKit packages verified/installed
- [x] All AG-UI packages verified/installed
- [x] CopilotKit provider added to layout
- [x] CopilotKit runtime endpoint created
- [x] AG-UI SSE endpoint created
- [x] AG-UI client configured
- [x] All 25 AG-UI event types typed
- [x] `pnpm build` succeeds
- [x] `pnpm typecheck` passes

---

## Code Review

**Date:** 2026-01-26
**Reviewer:** Claude (Automated)
**Verdict:** APPROVED

### Summary

| Severity | Count |
|----------|-------|
| HIGH | 0 |
| MEDIUM | 0 |
| LOW | 2 |
| INFO | 2 |

### Library Validation (Context7)

**CopilotKit (@copilotkit/react-core, @copilotkit/runtime):**
- ✅ Provider pattern matches official documentation
- ✅ `runtimeUrl` prop configuration is correct
- ✅ Component wrapping pattern follows best practices

**AG-UI (@ag-ui/client):**
- ✅ Event types match AG-UI protocol specification
- ✅ SSE streaming pattern follows documented approach
- ✅ Event type enumeration covers all 25 protocol events

### Findings

#### LOW-1: Placeholder Implementation in API Routes
- **File:** `apps/web/app/api/ag-ui/route.ts`, `apps/web/app/api/copilotkit/route.ts`
- **Issue:** Routes contain placeholder implementations that will need to connect to AgentOS backend
- **Recommendation:** Expected for this story - real backend integration comes in later stories

#### LOW-2: Event Types Include Extensions Beyond Core 25
- **File:** `apps/web/lib/protocols/types.ts`
- **Issue:** Added THOUGHT_START, THOUGHT_CONTENT, THOUGHT_END, METADATA events (29 total)
- **Recommendation:** Additional types are forward-compatible and documented in AG-UI spec extensions

#### INFO-1: Peer Dependency Warnings
- **Issue:** Some peer dependency mismatches (openai, @ag-ui/core versions)
- **Recommendation:** Monitor for issues; current versions are functional

#### INFO-2: Console Warnings in Module Builder Page
- **File:** `apps/web/app/(dashboard)/builders/module/[id]/page.tsx`
- **Issue:** Pre-existing console.log statements from prior stories
- **Recommendation:** Clean up in future maintenance task

### Files Created

| File | Lines | Purpose |
|------|-------|---------|
| `apps/web/lib/protocols/types.ts` | 258 | AG-UI event type definitions |
| `apps/web/lib/protocols/ag-ui.ts` | 259 | AG-UI client and React hook |
| `apps/web/lib/protocols/copilotkit.tsx` | 65 | CopilotKit provider component |
| `apps/web/lib/protocols/index.ts` | 47 | Barrel exports |
| `apps/web/app/api/ag-ui/route.ts` | 147 | AG-UI SSE endpoint |
| `apps/web/app/api/copilotkit/route.ts` | 90 | CopilotKit runtime endpoint |

### Test Results

- **ATDD Tests:** 28/28 passed
- **TypeScript:** No errors
- **Build:** Successful

---

*Created: 2026-01-26*
*Epic: E0.1 - Project Foundation & Infrastructure Setup*
