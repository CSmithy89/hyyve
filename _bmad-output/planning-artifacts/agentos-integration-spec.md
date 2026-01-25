# AgentOS Integration Specification

**Version:** 1.0.0
**Date:** 2026-01-26
**Source:** https://docs.agno.com/agent-os/introduction + agno-agi/agno repository

---

## Overview

AgentOS is a **runtime and control plane for multi-agent systems** that transforms agents into production-ready APIs. It provides:

- **50+ API endpoints** with SSE-compatible streaming
- **Request-level isolation** (no state bleed between users/agents/sessions)
- **JWT-based RBAC** with hierarchical scopes
- **FastAPI foundation** (add middleware, custom routes, background tasks)
- **Private-by-design** (all data stays in your infrastructure)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Control Plane                           │
│                      (os.agno.com - Web UI)                     │
│                   Connects directly to runtime                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AgentOS Runtime                            │
│                  (FastAPI + SSE Streaming)                      │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌─────────────────┐   │
│  │ Agents  │  │  Teams  │  │ Workflows│  │ Knowledge Bases │   │
│  └─────────┘  └─────────┘  └──────────┘  └─────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐     │
│  │   Memory    │  │   Sessions   │  │  A2A Interface     │     │
│  │  Manager    │  │   Manager    │  │ (Agent-to-Agent)   │     │
│  └─────────────┘  └──────────────┘  └────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Your Database                            │
│    (Postgres/SQLite/MongoDB - Sessions, Memory, Knowledge)      │
└─────────────────────────────────────────────────────────────────┘
```

---

## AgentOS API Endpoints (Complete Reference)

### Core Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/config` | Complete AgentOS configuration (models, databases, agents, teams) |
| GET | `/models` | List all unique models used by agents/teams |
| GET | `/health` | Health status check |

### Agent Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/agents` | List all configured agents |
| GET | `/agents/{agent_id}` | Get agent configuration and capabilities |
| POST | `/agents/{agent_id}/runs` | Execute agent with message + media (streaming/non-streaming) |
| POST | `/agents/{agent_id}/runs/{run_id}/cancel` | Cancel executing run |
| POST | `/agents/{agent_id}/runs/{run_id}/continue` | Continue paused run |

### Team Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/teams` | List all teams |
| GET | `/teams/{team_id}` | Get team details |
| POST | `/teams/{team_id}/runs` | Execute team run |

### Workflow Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/workflows` | List all workflows |
| GET | `/workflows/{workflow_id}` | Get workflow details |
| POST | `/workflows/{workflow_id}/runs` | Execute workflow |
| POST | `/workflows/{workflow_id}/runs/{run_id}/cancel` | Cancel workflow run |
| WS | `/workflows/ws` | WebSocket for real-time workflow events |

### Session Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/sessions` | List sessions (paginated) |
| POST | `/sessions` | Create new session |
| GET | `/sessions/{session_id}` | Get session by ID |
| GET | `/sessions/{session_id}/runs` | Get runs for session |
| GET | `/sessions/{session_id}/runs/{run_id}` | Get specific run |
| POST | `/sessions/{session_id}/rename` | Rename session |
| PATCH | `/sessions/{session_id}` | Update session |
| DELETE | `/sessions/{session_id}` | Delete session |
| DELETE | `/sessions` | Bulk delete sessions |

### Memory Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/memories` | Create memory |
| GET | `/memories` | List memories |
| GET | `/memories/{memory_id}` | Get memory by ID |
| PATCH | `/memories/{memory_id}` | Update memory |
| DELETE | `/memories/{memory_id}` | Delete memory |
| DELETE | `/memories` | Bulk delete memories |
| GET | `/memory_topics` | Get memory topics |
| GET | `/user_memory_stats` | Get user memory statistics |
| POST | `/optimize-memories` | Optimize memories |

### Knowledge Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/knowledge/content` | Upload content to KB |
| GET | `/knowledge/content` | List KB content |
| GET | `/knowledge/content/{content_id}` | Get content by ID |
| PATCH | `/knowledge/content/{content_id}` | Update content |
| DELETE | `/knowledge/content/{content_id}` | Delete content |
| DELETE | `/knowledge/content` | Clear all content |
| GET | `/knowledge/content/{content_id}/status` | Get content processing status |
| POST | `/knowledge/search` | Search knowledge base |
| GET | `/knowledge/config` | Get KB configuration |

### A2A (Agent-to-Agent) Interface
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/a2a/agents/{id}/.well-known/agent-card.json` | Agent discovery card |
| POST | `/a2a/agents/{id}/v1/message:send` | Send message (non-streaming) |
| POST | `/a2a/agents/{id}/v1/message:stream` | Stream messages |
| GET | `/a2a/teams/{id}/.well-known/agent-card.json` | Team discovery card |
| POST | `/a2a/teams/{id}/v1/message:send` | Send to team (non-streaming) |
| POST | `/a2a/teams/{id}/v1/message:stream` | Stream to team |

### AG-UI Interface
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/agui` | Execute via AG-UI interface |
| GET | `/agui/status` | AG-UI interface status |

---

## Memory System

### Memory Scopes

AgentOS uses a unified `UserMemory` object with scope fields:

```python
class UserMemory:
    memory_id: str          # Unique identifier (PK)
    memory: str             # Content
    input: str              # Triggering input
    user_id: str            # User scope
    agent_id: str           # Agent scope
    team_id: str            # Team scope
    topics: List[str]       # Keywords/topics
    feedback: Optional[str] # User feedback
    created_at: datetime
    updated_at: datetime
```

### Memory Modes

1. **Automatic Memory** (`update_memory_on_run=True`)
   - Agent auto-extracts and stores facts
   - Best for: Customer support, conversational apps

2. **Agentic Memory** (`enable_agentic_memory=True`)
   - Agent decides what to remember via tools
   - Best for: Complex multi-turn workflows

### MemoryManager API

```python
from agno.memory.manager import MemoryManager

manager = MemoryManager(model=Claude(), db=PostgresDb())

# Add memory
manager.add_user_memory(user_id="123", memory="Prefers email", topics=["contact"])

# Get memories
memories = manager.get_user_memories(user_id="123", topics=["contact"])

# Agentic search (LLM-powered)
relevant = manager.search_memories(query="How should I contact this user?")
```

---

## Team Coordination Patterns

### Team Class

```python
from agno.team import Team
from agno.agent import Agent

support_team = Team(
    name="Customer Support",
    model=Claude(id="claude-sonnet-4-5"),
    members=[
        doc_researcher_agent,
        escalation_manager_agent,
        feedback_collector_agent,
    ],
    instructions=[
        "Route technical questions to doc_researcher",
        "Escalate complaints to escalation_manager",
        "Collect feedback after resolution",
    ],
    enable_user_memories=True,
    add_memories_to_context=True,
    share_member_interactions=True,
)
```

### Coordination Patterns

| Pattern | Configuration | Use Case |
|---------|---------------|----------|
| **Routing** | Instructions define routing rules | Query classification |
| **Collaboration** | `delegate_to_all_members=True` | Brainstorming |
| **Concurrent** | `arun()` async execution | Parallel research |
| **Sequential** | Default behavior | Step-by-step workflows |

### Memory Sharing in Teams

```python
team = Team(
    members=[agent1, agent2],
    enable_user_memories=True,        # Store user facts
    add_memories_to_context=True,     # Include in prompts
    enable_agentic_culture=True,      # Shared org knowledge
    add_culture_to_context=True,      # Include culture in prompts
    share_member_interactions=True,   # Agents see each other's work
)
```

---

## Hyyve Platform Integration

### Agent Architecture for Hyyve

Based on UX design, Hyyve uses 4 primary agents (Bond, Wendy, Morgan, Artie):

```python
from agno.os import AgentOS
from agno.agent import Agent
from agno.team import Team
from agno.models.anthropic import Claude
from agno.db.postgres import PostgresDb

# Database with multi-tenant isolation
db = PostgresDb(
    db_url=os.getenv("DATABASE_URL"),
    memory_table="agno_memories",
    session_table="agno_sessions",
)

# Bond - Module Builder Agent
bond = Agent(
    name="Bond",
    agent_id="bond",
    model=Claude(id="claude-sonnet-4-5"),
    db=db,
    instructions=[
        "You are Bond, the Module Builder specialist.",
        "Help users create workflow modules using the visual editor.",
        "Use DCRL pattern: Detect intent, Clarify if <60% confidence, Resolve, Learn.",
    ],
    tools=[workflow_tools, node_tools, validation_tools],
    enable_user_memories=True,
    add_memories_to_context=True,
    markdown=True,
)

# Wendy - Chatbot Builder Agent
wendy = Agent(
    name="Wendy",
    agent_id="wendy",
    model=Claude(id="claude-sonnet-4-5"),
    db=db,
    instructions=["You are Wendy, the Chatbot Builder specialist..."],
    tools=[chatbot_tools, intent_tools, flow_tools],
    enable_user_memories=True,
)

# Morgan - Voice Agent Builder
morgan = Agent(
    name="Morgan",
    agent_id="morgan",
    model=Claude(id="claude-sonnet-4-5"),
    db=db,
    instructions=["You are Morgan, the Voice Agent specialist..."],
    tools=[voice_tools, stt_tools, tts_tools],
    enable_user_memories=True,
)

# Artie - Canvas Builder Agent
artie = Agent(
    name="Artie",
    agent_id="artie",
    model=Claude(id="claude-sonnet-4-5"),
    db=db,
    instructions=["You are Artie, the Canvas Builder specialist..."],
    tools=[canvas_tools, generation_tools, media_tools],
    enable_user_memories=True,
)

# Builder Team - Coordinates all agents
builder_team = Team(
    name="Hyyve Builders",
    team_id="hyyve-builders",
    members=[bond, wendy, morgan, artie],
    instructions=[
        "Route workflow/module questions to Bond",
        "Route chatbot questions to Wendy",
        "Route voice agent questions to Morgan",
        "Route canvas/media questions to Artie",
        "For cross-builder questions, coordinate between relevant agents",
    ],
    enable_user_memories=True,
    share_member_interactions=True,
    enable_agentic_culture=True,
)

# Initialize AgentOS
agent_os = AgentOS(
    agents=[bond, wendy, morgan, artie],
    teams=[builder_team],
    db=db,
)

# Get FastAPI app
app = agent_os.get_app()

# Add custom Hyyve routes
from hyyve.api import hyyve_router
app.include_router(hyyve_router, prefix="/api/v1")
```

---

## API Endpoint Mapping: AgentOS → Hyyve

### What AgentOS Provides (Use Directly)

| Hyyve Feature | AgentOS Endpoint | Notes |
|---------------|------------------|-------|
| Chat with Bond/Wendy/Morgan/Artie | `POST /agents/{id}/runs` | SSE streaming |
| Team coordination | `POST /teams/{id}/runs` | Multi-agent routing |
| Session management | `/sessions/*` | Conversation history |
| User memories | `/memories/*` | Cross-session context |
| Knowledge base (RAG) | `/knowledge/*` | Document ingestion |
| Agent discovery (A2A) | `/a2a/agents/{id}/.well-known/agent-card.json` | Inter-agent comms |
| Health check | `GET /health` | Monitoring |

### What Hyyve Must Add (Custom Routes)

| Feature | Custom Endpoint | Rationale |
|---------|-----------------|-----------|
| Workspaces | `/api/v1/workspaces/*` | Multi-tenant structure |
| Projects | `/api/v1/projects/*` | Project organization |
| Workflow CRUD | `/api/v1/workflows/*` | Visual editor state |
| Node configuration | `/api/v1/nodes/*` | Builder-specific |
| Chatbot flows | `/api/v1/chatbots/*` | Chatbot builder |
| Voice agents | `/api/v1/voice-agents/*` | Voice builder |
| Canvas pipelines | `/api/v1/canvas/*` | Canvas builder |
| MCP marketplace | `/api/v1/mcp/*` | Skills/tools |
| Billing | `/api/v1/billing/*` | Stripe integration |
| Deployments | `/api/v1/deployments/*` | Chatwoot, embeds |

---

## Setup Example

```python
# main.py
from agno.os import AgentOS
from agno.db.postgres import PostgresDb
from fastapi import FastAPI
from hyyve.agents import bond, wendy, morgan, artie, builder_team
from hyyve.api import (
    workspaces_router,
    projects_router,
    workflows_router,
    chatbots_router,
    voice_router,
    canvas_router,
    mcp_router,
    billing_router,
)

# Initialize database
db = PostgresDb(db_url=os.getenv("DATABASE_URL"))

# Initialize AgentOS
agent_os = AgentOS(
    agents=[bond, wendy, morgan, artie],
    teams=[builder_team],
    db=db,
)

# Get base FastAPI app with AgentOS endpoints
app = agent_os.get_app()

# Add Hyyve-specific routes
app.include_router(workspaces_router, prefix="/api/v1")
app.include_router(projects_router, prefix="/api/v1")
app.include_router(workflows_router, prefix="/api/v1")
app.include_router(chatbots_router, prefix="/api/v1")
app.include_router(voice_router, prefix="/api/v1")
app.include_router(canvas_router, prefix="/api/v1")
app.include_router(mcp_router, prefix="/api/v1")
app.include_router(billing_router, prefix="/api/v1")

# Run with: uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## Key Differences from Original api-endpoints.md

| Original Design | AgentOS Reality | Action |
|-----------------|-----------------|--------|
| REST for agent execution | AgentOS `/agents/{id}/runs` with SSE | Use AgentOS |
| Custom memory endpoints | AgentOS `/memories/*` | Use AgentOS |
| Custom session management | AgentOS `/sessions/*` | Use AgentOS |
| Custom knowledge endpoints | AgentOS `/knowledge/*` | Use AgentOS |
| No A2A support | AgentOS `/a2a/*` | Use AgentOS |
| tRPC for internal APIs | AgentOS uses FastAPI REST | Align with FastAPI |

---

## Summary

**AgentOS provides:**
- All agent execution, memory, session, and knowledge APIs
- A2A protocol for agent-to-agent communication
- SSE streaming for real-time responses
- FastAPI foundation for custom extensions

**Hyyve adds:**
- Multi-tenant workspace/project structure
- Builder-specific APIs (workflows, chatbots, voice, canvas)
- Marketplace and billing
- Deployment management

This separation keeps the agent runtime clean while allowing full customization of the platform features.
