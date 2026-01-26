# Story 0.1.9: Configure Langfuse Observability

## Status

**ready-for-dev**

## Epic

**0.1 - Project Foundation & Infrastructure Setup**

## User Story

As a **developer**,
I want **Langfuse configured for agent tracing**,
So that **LLM calls are observable and costs are tracked**.

## Acceptance Criteria

### AC1: Langfuse Packages Installed

- **Given** Langfuse instance is available (self-hosted)
- **When** I configure Langfuse
- **Then** the following are installed:
  - `langfuse@3.148.0`
  - `@langfuse/core@4.4.0`

### AC2: Langfuse Client Initialized

- **Given** Langfuse packages are installed
- **When** I initialize the client
- **Then** Langfuse client is initialized with environment variables
- **And** connection uses `LANGFUSE_HOST`, `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY`

### AC3: Trace Wrapper Functions

- **Given** Langfuse client is configured
- **When** I create observability utilities
- **Then** trace wrapper functions are created for:
  - LLM calls
  - Agent runs
  - Tool executions
- **And** wrappers support async/await patterns

### AC4: Cost Tracking Configuration

- **Given** trace wrappers are created
- **When** cost tracking is configured
- **Then** cost tracking is configured per model
- **And** token counts are captured (input/output)
- **And** model pricing is configurable

### AC5: Observability Package Exports

- **Given** all Langfuse utilities are created
- **When** I export from the package
- **Then** utilities are exported from `apps/web/lib/observability/`
- **And** can be imported as `@/lib/observability/langfuse`

## Technical Notes

### Langfuse Client Setup

```typescript
// apps/web/lib/observability/langfuse.ts
import { Langfuse } from 'langfuse';

const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY!,
  secretKey: process.env.LANGFUSE_SECRET_KEY!,
  baseUrl: process.env.LANGFUSE_HOST,
});

// Trace wrapper for LLM calls
export async function traceLLMCall<T>(
  name: string,
  fn: () => Promise<T>,
  metadata?: Record<string, unknown>
): Promise<T> {
  const trace = langfuse.trace({ name, metadata });
  const generation = trace.generation({ name: `${name}-generation` });

  try {
    const result = await fn();
    generation.end({ output: result });
    return result;
  } catch (error) {
    generation.end({ statusMessage: String(error) });
    throw error;
  }
}
```

### Model Cost Configuration

```typescript
// Cost per 1M tokens (Claude models)
const MODEL_COSTS = {
  'claude-sonnet-4-20250514': { input: 3.00, output: 15.00 },
  'claude-opus-4-20250514': { input: 15.00, output: 75.00 },
  'claude-haiku-4-20250514': { input: 0.25, output: 1.25 },
};
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `LANGFUSE_PUBLIC_KEY` | Langfuse project public key | Yes |
| `LANGFUSE_SECRET_KEY` | Langfuse project secret key | Yes |
| `LANGFUSE_HOST` | Langfuse host URL (self-hosted) | Yes |

## Files to Create

| File | Purpose |
|------|---------|
| `apps/web/lib/observability/langfuse.ts` | Langfuse client and trace wrappers |
| `apps/web/lib/observability/index.ts` | Barrel exports |

## Files to Modify

| File | Changes |
|------|---------|
| `apps/web/package.json` | Add langfuse dependencies |
| `.env.example` | Add Langfuse variables |

## Dependencies

### Story Dependencies

- **Story 0.1.1** (Scaffold Turborepo) - Package structure must exist
- **Story 0.1.3** (Core Dependencies) - TypeScript setup

### Package Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `langfuse` | ^3.148.0 | Langfuse client SDK |
| `@langfuse/core` | ^4.4.0 | Core Langfuse types |

## Test Strategy

### Unit Tests

1. **Package Verification:**
   - Verify langfuse package is installed
   - Verify @langfuse/core package is installed

2. **File Structure:**
   - Verify langfuse.ts exists
   - Verify exports from index.ts

3. **Function Exports:**
   - Verify trace wrapper functions exist
   - Verify Langfuse client initialization

### Build Verification

```bash
pnpm install
pnpm build
pnpm typecheck
```

## Definition of Done

- [ ] `langfuse@3.148.0` installed
- [ ] `@langfuse/core@4.4.0` installed
- [ ] Langfuse client initialized with environment variables
- [ ] Trace wrapper for LLM calls
- [ ] Trace wrapper for agent runs
- [ ] Trace wrapper for tool executions
- [ ] Cost tracking configured per model
- [ ] Environment variables documented in `.env.example`
- [ ] `pnpm build` succeeds
- [ ] `pnpm typecheck` passes

---

## Code Review

**Reviewer:** Senior Developer (AI)
**Date:** 2026-01-26
**Decision:** ✅ APPROVED

### Acceptance Criteria Validation

| AC | Description | Status | Evidence |
|----|-------------|--------|----------|
| AC1 | Langfuse packages installed | ✅ IMPLEMENTED | `langfuse@^3.38.6`, `@langfuse/core@^4.5.1` in package.json |
| AC2 | Langfuse client initialized | ✅ IMPLEMENTED | `getLangfuseClient()` singleton in langfuse.ts |
| AC3 | Trace wrapper functions | ✅ IMPLEMENTED | `traceLLMCall`, `traceAgentRun`, `traceToolExecution` |
| AC4 | Cost tracking configuration | ✅ IMPLEMENTED | `MODEL_COSTS` object, `calculateCost()` function |
| AC5 | Observability package exports | ✅ IMPLEMENTED | `apps/web/lib/observability/index.ts` barrel exports |

### Findings Summary

- **0 HIGH** | **0 MEDIUM** | **2 LOW** | **2 INFO**

### Low Issues

1. Version in story spec (`3.148.0`) doesn't exist - used `3.38.6` (latest stable)
2. Functions throw when Langfuse not configured (could provide no-op fallback)

### Library Validation (Context7)

- ✅ Implementation follows Langfuse JS SDK best practices
- ✅ Serverless-compatible flush settings
- ✅ Proper trace/generation/span hierarchy

---

*Created: 2026-01-26*
*Epic: E0.1 - Project Foundation & Infrastructure Setup*
