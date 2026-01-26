# Story 0.1.18: Configure Temporal Workflow Orchestration

## Status

**in-progress**

## Epic

**0.1 - Project Foundation & Infrastructure Setup**

## User Story

As a **developer**,
I want **Temporal configured for durable workflow execution**,
So that **long-running agent workflows can survive failures and be resumed**.

## Acceptance Criteria

### AC1: Node.js Temporal Packages

- **Given** the monorepo exists
- **When** I check dependencies
- **Then** `@temporalio/client` is installed
- **And** `@temporalio/worker` is installed
- **And** `@temporalio/workflow` is installed
- **And** `@temporalio/activity` is installed

### AC2: Python Temporal Package

- **Given** the agent-service exists
- **When** I check Python dependencies
- **Then** `temporalio` is installed in agent-service

### AC3: Temporal Worker Application

- **Given** Temporal packages are installed
- **When** I check the apps directory
- **Then** `apps/temporal-worker/` exists
- **And** `src/worker.ts` defines the worker
- **And** `src/workflows/` contains workflow definitions
- **And** `src/activities/` contains activity definitions

### AC4: Temporal Client Package

- **Given** the packages directory exists
- **When** I check platform packages
- **Then** `packages/@platform/temporal/` exists
- **And** exports Temporal client utilities
- **And** exports workflow helper functions

### AC5: Workflow Definitions

- **Given** the temporal-worker exists
- **When** I check workflow definitions
- **Then** agent execution workflow is defined
- **And** retry policies with exponential backoff are configured
- **And** HITL signal handling is supported

### AC6: Environment Configuration

- **Given** Temporal is configured
- **When** I check environment variables
- **Then** `TEMPORAL_ADDRESS` is documented
- **And** `TEMPORAL_NAMESPACE` is documented
- **And** `TEMPORAL_TASK_QUEUE` is documented

## Technical Notes

### Temporal Architecture

```
┌─────────────────┐     ┌─────────────────┐
│  Next.js App    │────▶│  Temporal       │
│  (client)       │     │  Server         │
└─────────────────┘     └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │  Temporal       │
                        │  Worker         │
                        └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │  Agent Service  │
                        │  (activities)   │
                        └─────────────────┘
```

### Workflow Patterns

1. **Agent Execution Workflow**
   - Start agent with context
   - Execute agent activities
   - Handle HITL signals
   - Return results

2. **Retry Policy**
   - Initial interval: 1s
   - Backoff coefficient: 2
   - Maximum attempts: 5
   - Maximum interval: 30s

## Files to Create

| File | Purpose |
|------|---------|
| `apps/temporal-worker/package.json` | Worker dependencies |
| `apps/temporal-worker/tsconfig.json` | TypeScript config |
| `apps/temporal-worker/src/worker.ts` | Worker entry point |
| `apps/temporal-worker/src/workflows/index.ts` | Workflow exports |
| `apps/temporal-worker/src/workflows/agent.ts` | Agent workflow |
| `apps/temporal-worker/src/activities/index.ts` | Activity exports |
| `apps/temporal-worker/src/activities/agent.ts` | Agent activities |
| `packages/@platform/temporal/package.json` | Package config |
| `packages/@platform/temporal/src/index.ts` | Client exports |
| `packages/@platform/temporal/src/client.ts` | Temporal client |

## Dependencies

### Story Dependencies

- **Story 0.1.17** (Agno) - Agent service must exist for activities

## Test Strategy

### Unit Tests

1. **Package Installation:**
   - Verify Temporal packages in root package.json
   - Verify temporalio in agent-service pyproject.toml

2. **Directory Structure:**
   - Verify apps/temporal-worker exists
   - Verify packages/@platform/temporal exists
   - Verify required files exist

3. **Workflow Configuration:**
   - Verify workflow definitions exist
   - Verify activity definitions exist
   - Verify worker configuration

## Definition of Done

- [ ] Node.js Temporal packages installed
- [ ] Python temporalio package installed
- [ ] Temporal worker application created
- [ ] Temporal client package created
- [ ] Workflow definitions with retry policies
- [ ] Environment variables documented
- [ ] All ATDD tests pass

---

*Created: 2026-01-26*
*Epic: E0.1 - Project Foundation & Infrastructure Setup*
