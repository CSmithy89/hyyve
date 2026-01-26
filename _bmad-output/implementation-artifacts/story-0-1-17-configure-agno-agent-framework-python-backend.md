# Story 0.1.17: Configure Agno Agent Framework (Python Backend)

## Status

**in-progress**

## Epic

**0.1 - Project Foundation & Infrastructure Setup**

## User Story

As a **developer**,
I want **AgentOS configured as the agent runtime with Agno agents**,
So that **agents have 50+ production-ready API endpoints including SSE streaming, sessions, memory, and A2A**.

## Acceptance Criteria

### AC1: Python Service Directory Structure

- **Given** the monorepo structure exists
- **When** I check the agent service location
- **Then** `apps/agent-service/` exists with:
  - `src/agents/` directory for agent definitions (Bond, Wendy, Morgan, Artie)
  - `src/tools/` directory for MCP tool implementations
  - `src/memory/` directory for memory service extensions
  - `src/workflows/` directory for Agno workflows
  - `pyproject.toml` for Python dependencies
  - `Dockerfile` for containerization

### AC2: Python Dependencies

- **Given** the agent service exists
- **When** I check dependencies
- **Then** `agno>=2.4.0` is specified (includes AgentOS)
- **And** `uvicorn` is specified for ASGI server
- **And** `psycopg[binary]` is specified for PostgreSQL
- **And** `redis` is specified for session memory
- **And** `anthropic` is specified for Claude

### AC3: AgentOS Configuration

- **Given** AgentOS is configured
- **When** I check the main application
- **Then** AgentOS wraps the Agno agents
- **And** `AgentOS(agents=[...], teams=[...])` pattern is used
- **And** `agent_os.get_app()` provides the FastAPI application
- **And** PostgreSQL database is configured for memory

### AC4: Agent Definitions

- **Given** the agents directory exists
- **When** I check agent configuration
- **Then** Bond, Wendy, Morgan, Artie agents are defined
- **And** Each agent has `add_history_to_context=True`
- **And** Each agent has `add_memories_to_context=True`
- **And** Each agent has `enable_agentic_memory=True`

### AC5: AgentOS-Provided Endpoints

- **Given** AgentOS is initialized
- **When** the application starts
- **Then** the following endpoints are automatically available:
  - `GET /health` - Health check
  - `GET /config` - AgentOS configuration
  - `GET /agents` - List agents
  - `POST /agents/{id}/runs` - Execute agent (SSE)
  - `GET/POST/DELETE /sessions/*` - Session management
  - `GET/POST/DELETE /memories/*` - Memory management
  - `GET/POST /a2a/*` - Agent-to-Agent protocol
  - `POST /agui` - AG-UI interface

### AC6: Dockerfile

- **Given** the service is configured
- **When** I check the Dockerfile
- **Then** Python 3.11+ base image is used
- **And** dependencies are installed via pip/uv
- **And** uvicorn is configured as entrypoint

## Technical Notes

### AgentOS Configuration Pattern

```python
from agno.os import AgentOS
from agno.agent import Agent
from agno.team import Team
from agno.models.anthropic import Claude
from agno.storage.postgres import PostgresStorage

# Define agents
bond = Agent(
    name="Bond",
    agent_id="bond",
    model=Claude(id="claude-sonnet-4-5"),
    instructions=["You are Bond, the concierge agent..."],
    add_history_to_context=True,
    add_memories_to_context=True,
    enable_agentic_memory=True,
    storage=PostgresStorage(db_url=DATABASE_URL),
)

# Create team
builder_team = Team(
    name="Hyyve Builders",
    team_id="hyyve-builders",
    members=[bond, wendy, morgan, artie],
    enable_user_memories=True,
    share_member_interactions=True,
)

# Initialize AgentOS
agent_os = AgentOS(
    agents=[bond, wendy, morgan, artie],
    teams=[builder_team],
)

# Get FastAPI app with 50+ endpoints
app = agent_os.get_app()
```

### Environment Variables Required

- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection for sessions
- `ANTHROPIC_API_KEY` - Claude API access

### What AgentOS Provides (DO NOT REIMPLEMENT)

| Endpoint Group | Endpoints |
|----------------|-----------|
| Core | `/health`, `/config`, `/models` |
| Agents | `/agents`, `/agents/{id}`, `/agents/{id}/runs` |
| Sessions | `/sessions/*` |
| Memory | `/memories/*` |
| Knowledge | `/knowledge/*` |
| A2A | `/a2a/agents/{id}/*` |
| AG-UI | `/agui`, `/agui/status` |

## Files to Create/Update

| File | Purpose |
|------|---------|
| `apps/agent-service/pyproject.toml` | Python dependencies |
| `apps/agent-service/Dockerfile` | Container configuration |
| `apps/agent-service/src/__init__.py` | Package initialization |
| `apps/agent-service/src/main.py` | AgentOS application |
| `apps/agent-service/src/config.py` | Configuration management |
| `apps/agent-service/src/agents/__init__.py` | Agents package |
| `apps/agent-service/src/agents/definitions.py` | Agent definitions |
| `apps/agent-service/src/tools/__init__.py` | Tools package |
| `apps/agent-service/src/memory/__init__.py` | Memory package |
| `apps/agent-service/src/workflows/__init__.py` | Workflows package |

## Files to Remove (Redundant)

| File | Reason |
|------|--------|
| `apps/agent-service/src/routers/health.py` | AgentOS provides `/health` |
| `apps/agent-service/src/routers/agents.py` | AgentOS provides `/agents/*` |
| `apps/agent-service/src/routers/__init__.py` | No custom routers needed |
| `apps/agent-service/src/agents/base.py` | Replaced by definitions.py |

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
   - Verify uvicorn, psycopg, redis, anthropic

3. **AgentOS Configuration:**
   - Verify main.py imports AgentOS
   - Verify agents are defined with memory config
   - Verify AgentOS.get_app() is used

4. **No Redundant Routers:**
   - Verify src/routers/ does not exist or is empty
   - Verify no custom /health endpoint defined
   - Verify no custom /agents endpoint defined

## Definition of Done

- [ ] `apps/agent-service/` directory structure created
- [ ] `pyproject.toml` with all dependencies
- [ ] `Dockerfile` for containerization
- [ ] AgentOS application with 4 agents (Bond, Wendy, Morgan, Artie)
- [ ] Team configuration for agent coordination
- [ ] Redundant routers removed
- [ ] All ATDD tests pass

---

*Updated: 2026-01-26*
*Epic: E0.1 - Project Foundation & Infrastructure Setup*
*Changed: Migrated from raw Agno+FastAPI to AgentOS wrapper pattern per architecture spec*
