# Story 0.1.17: Configure Agno Agent Framework (Python Backend)

## Status

**done**

## Epic

**0.1 - Project Foundation & Infrastructure Setup**

## User Story

As a **developer**,
I want **Agno 2.4.0 configured as the agent execution framework**,
So that **agents can be orchestrated with memory, tools, and LLM integration**.

## Acceptance Criteria

### AC1: Python Service Directory Structure

- **Given** the monorepo structure exists
- **When** I check the agent service location
- **Then** `apps/agent-service/` exists with:
  - `src/agents/` directory for agent definitions
  - `src/tools/` directory for MCP tool implementations
  - `src/memory/` directory for memory service
  - `src/workflows/` directory for Agno workflows
  - `pyproject.toml` for Python dependencies
  - `Dockerfile` for containerization

### AC2: Python Dependencies

- **Given** the agent service exists
- **When** I check dependencies
- **Then** `agno>=2.4.0` is specified
- **And** `fastapi` is specified for HTTP API
- **And** `uvicorn` is specified for ASGI server
- **And** `psycopg[binary]` is specified for PostgreSQL
- **And** `redis` is specified for session memory

### AC3: Agno Configuration

- **Given** Agno is installed
- **When** I check agent configuration
- **Then** `add_history_to_context=True` is configured
- **And** `add_memories_to_context=True` is configured
- **And** `enable_agentic_memory=True` is configured
- **And** PostgreSQL database is configured for memory

### AC4: FastAPI Application

- **Given** dependencies are installed
- **When** I check the FastAPI application
- **Then** main application exists at `src/main.py`
- **And** agent router is configured
- **And** health check endpoint exists at `/health`

### AC5: Agent Definitions

- **Given** the agents directory exists
- **When** I check agent files
- **Then** base agent class exists
- **And** agent personality system is defined

### AC6: Dockerfile

- **Given** the service is configured
- **When** I check the Dockerfile
- **Then** Python 3.11+ base image is used
- **And** dependencies are installed via pip/uv
- **And** uvicorn is configured as entrypoint

## Technical Notes

### Agno Configuration Pattern

```python
from agno import Agent, PostgresDb

agent = Agent(
    name="bond",
    add_history_to_context=True,
    add_memories_to_context=True,
    enable_agentic_memory=True,
    db=PostgresDb(db_url=DATABASE_URL)
)
```

### Environment Variables Required

- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection for sessions
- `ANTHROPIC_API_KEY` - Claude API access

## Files to Create

| File | Purpose |
|------|---------|
| `apps/agent-service/pyproject.toml` | Python dependencies |
| `apps/agent-service/Dockerfile` | Container configuration |
| `apps/agent-service/src/__init__.py` | Package initialization |
| `apps/agent-service/src/main.py` | FastAPI application |
| `apps/agent-service/src/config.py` | Configuration management |
| `apps/agent-service/src/agents/__init__.py` | Agents package |
| `apps/agent-service/src/agents/base.py` | Base agent class |
| `apps/agent-service/src/tools/__init__.py` | Tools package |
| `apps/agent-service/src/memory/__init__.py` | Memory package |
| `apps/agent-service/src/workflows/__init__.py` | Workflows package |
| `apps/agent-service/src/routers/__init__.py` | Routers package |
| `apps/agent-service/src/routers/health.py` | Health check router |
| `apps/agent-service/src/routers/agents.py` | Agent execution router |

## Dependencies

### Story Dependencies

- **Story 0.1.5** (Supabase) - Database connection required
- **Story 0.1.8** (Redis) - Session memory required

## Test Strategy

### Unit Tests

1. **Directory Structure:**
   - Verify apps/agent-service exists
   - Verify all required directories exist
   - Verify pyproject.toml exists
   - Verify Dockerfile exists

2. **Dependencies:**
   - Parse pyproject.toml
   - Verify agno version
   - Verify fastapi, uvicorn, psycopg, redis

3. **Application Structure:**
   - Verify main.py exists
   - Verify routers exist
   - Verify health endpoint defined

## Definition of Done

- [x] `apps/agent-service/` directory structure created
- [x] `pyproject.toml` with all dependencies
- [x] `Dockerfile` for containerization
- [x] FastAPI application with health endpoint
- [x] Base agent class with Agno configuration
- [x] All ATDD tests pass

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
| LOW | 0 |
| INFO | 2 |

### Findings

#### INFO-1: Placeholder Agent Execution

- **File:** `src/routers/agents.py`
- **Issue:** Agent execution returns placeholder response
- **Recommendation:** Implement actual Agno agent execution in future story

#### INFO-2: Dependency Health Checks

- **File:** `src/routers/health.py`
- **Issue:** Database/Redis health checks return placeholder status
- **Recommendation:** Implement actual connectivity checks when services available

### Files Created

| File | Lines | Purpose |
|------|-------|---------|
| `apps/agent-service/pyproject.toml` | 90 | Python dependencies |
| `apps/agent-service/Dockerfile` | 56 | Container configuration |
| `apps/agent-service/src/__init__.py` | 7 | Package initialization |
| `apps/agent-service/src/main.py` | 74 | FastAPI application |
| `apps/agent-service/src/config.py` | 72 | Configuration management |
| `apps/agent-service/src/agents/__init__.py` | 9 | Agents package |
| `apps/agent-service/src/agents/base.py` | 158 | Base agent with Agno config |
| `apps/agent-service/src/routers/__init__.py` | 9 | Routers package |
| `apps/agent-service/src/routers/health.py` | 96 | Health check endpoints |
| `apps/agent-service/src/routers/agents.py` | 128 | Agent execution endpoints |
| `apps/agent-service/src/tools/__init__.py` | 9 | Tools package |
| `apps/agent-service/src/memory/__init__.py` | 12 | Memory package |
| `apps/agent-service/src/workflows/__init__.py` | 12 | Workflows package |

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| agno | >=2.4.0 | Agent framework |
| fastapi | >=0.115.0 | HTTP API |
| uvicorn | >=0.32.0 | ASGI server |
| psycopg | >=3.2.0 | PostgreSQL driver |
| redis | >=5.0.0 | Session cache |
| anthropic | >=0.40.0 | Claude LLM provider |

### Test Results

- **ATDD Tests:** 42/42 passed
- **TypeScript:** No errors
- **Build:** N/A (Python service)

---

*Created: 2026-01-26*
*Epic: E0.1 - Project Foundation & Infrastructure Setup*
