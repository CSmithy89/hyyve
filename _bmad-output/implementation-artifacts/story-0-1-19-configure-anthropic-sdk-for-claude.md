# Story 0.1.19: Configure Anthropic SDK for Claude

## Status

**in-progress**

## Epic

**0.1 - Project Foundation & Infrastructure Setup**

## User Story

As a **developer**,
I want **the Anthropic SDK configured for Claude API calls**,
So that **the platform can use Claude as the primary LLM**.

## Acceptance Criteria

### AC1: TypeScript Anthropic SDK

- **Given** the Next.js application exists
- **When** I check dependencies
- **Then** `@anthropic-ai/sdk` is installed in apps/web
- **And** TypeScript types are available

### AC2: Python Anthropic SDK

- **Given** the agent-service exists
- **When** I check Python dependencies
- **Then** `anthropic` is installed (already present from Story 0.1.17)

### AC3: Claude Client Configuration

- **Given** the Anthropic SDK is installed
- **When** I check the client configuration
- **Then** Claude client is initialized with API key from environment
- **And** Default model is `claude-sonnet-4-20250514`
- **And** Retry configuration is present
- **And** Request timeout handling is configured

### AC4: Streaming Support

- **Given** the Claude client exists
- **When** I check streaming configuration
- **Then** Token-by-token streaming is supported
- **And** Stream event handlers are defined

### AC5: Tool Use Support

- **Given** the Claude client exists
- **When** I check tool configuration
- **Then** Tool use (function calling) is supported
- **And** Tool definitions follow MCP patterns

### AC6: Cost Tracking Integration

- **Given** the Claude client exists
- **When** I make an API call
- **Then** Token usage is tracked
- **And** Langfuse integration captures costs

## Technical Notes

### Supported Models

| Model | ID | Use Case |
|-------|-----|----------|
| Claude Sonnet 4 | claude-sonnet-4-20250514 | Default, balanced |
| Claude Opus 4 | claude-opus-4-20250514 | Advanced reasoning |
| Claude Haiku 4 | claude-haiku-4-20250514 | Fast, efficient |

### Client Configuration

```typescript
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  timeout: 60000, // 60 second timeout
  maxRetries: 3,
});
```

## Files to Create

| File | Purpose |
|------|---------|
| `apps/web/lib/llm/anthropic.ts` | TypeScript Claude client |
| `apps/web/lib/llm/types.ts` | LLM type definitions |
| `apps/web/lib/llm/index.ts` | LLM barrel exports |
| `apps/agent-service/src/llm/claude.py` | Python Claude client |
| `apps/agent-service/src/llm/__init__.py` | LLM module init |

## Dependencies

### Story Dependencies

- **Story 0.1.17** (Agno) - Agent service must exist (anthropic already installed)
- **Story 0.1.9** (Langfuse) - Cost tracking integration

## Test Strategy

### Unit Tests

1. **Package Installation:**
   - Verify @anthropic-ai/sdk in apps/web
   - Verify anthropic in agent-service (already present)

2. **Client Configuration:**
   - Verify client files exist
   - Verify environment variable documentation
   - Verify model constants defined

3. **Streaming Support:**
   - Verify streaming helpers exist
   - Verify stream event type definitions

## Definition of Done

- [ ] TypeScript Anthropic SDK installed
- [ ] Python SDK already present (from Story 0.1.17)
- [ ] Claude client with retry and timeout
- [ ] Streaming support configured
- [ ] Tool use support configured
- [ ] Langfuse cost tracking integration
- [ ] All ATDD tests pass

---

*Created: 2026-01-26*
*Epic: E0.1 - Project Foundation & Infrastructure Setup*
