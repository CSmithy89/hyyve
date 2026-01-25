# Hyyve Platform - Development Guidelines

## Critical Planning Artifacts

**ALWAYS reference these documents before implementing features:**

| Document                | Path                                                              | When to Use                                    |
| ----------------------- | ----------------------------------------------------------------- | ---------------------------------------------- |
| **API Endpoints**       | `_bmad-output/planning-artifacts/api-endpoints.md`                | Building any API route or frontend API call    |
| **AgentOS Integration** | `_bmad-output/planning-artifacts/agentos-integration-spec.md`     | Working with agents, memory, sessions, teams   |
| **Protocol Stack**      | `_bmad-output/planning-artifacts/protocol-stack-specification.md` | AG-UI events, A2A communication, SSE streaming |
| **PRD**                 | `_bmad-output/planning-artifacts/prd.md`                          | Verifying feature requirements (248 FRs)       |
| **Architecture**        | `_bmad-output/planning-artifacts/architecture.md`                 | System design decisions (8 ADRs)               |
| **UX Design**           | `_bmad-output/planning-artifacts/ux-design-specification.md`      | UI component specs, screen layouts             |
| **Project Context**     | `_bmad-output/project-context.md`                                 | Tech stack, coding patterns, critical rules    |

## Development Workflow

### Before Writing Code

1. **Identify the FR number** - Check PRD for the functional requirement
2. **Find the API endpoint** - Look up in `api-endpoints.md`
3. **Check if AgentOS provides it** - Many endpoints are built-in to AgentOS
4. **Review UX screen spec** - Match the wireframe design

### API Implementation Rules

**AgentOS Endpoints (Use Directly - Don't Reimplement):**

- `/agents/*` - Agent execution, runs
- `/sessions/*` - Session management
- `/memories/*` - User/agent memory
- `/knowledge/*` - Knowledge base/RAG
- `/a2a/*` - Agent-to-agent communication
- `/agui` - AG-UI interface

**Hyyve Custom Endpoints (Implement These):**

- `/api/v1/workspaces/*` - Multi-tenant structure
- `/api/v1/projects/*` - Project organization
- `/api/v1/workflows/*` - Module builder workflows
- `/api/v1/dcrl/*` - DCRL confidence routing
- `/api/v1/checkpoints/*` - Undo/redo service
- `/api/v1/mcp/registry/*` - MCP aggregation

### Agent Development

Four primary agents (Bond, Wendy, Morgan, Artie) run on AgentOS:

```python
# See agentos-integration-spec.md for full setup
from agno.os import AgentOS
from agno.agent import Agent

bond = Agent(
    name="Bond",
    agent_id="bond",
    model=Claude(id="claude-sonnet-4-5"),
    enable_user_memories=True,
)
```

### DCRL Pattern (Confidence Thresholds)

| Confidence | Action                    |
| ---------- | ------------------------- |
| >0.85      | Execute immediately       |
| 0.6-0.85   | Execute with confirmation |
| <0.6       | Request clarification     |

## Tech Stack Quick Reference

- **Frontend:** Next.js 15.5.8, React 19, TypeScript 5.x
- **State:** Zustand 5.0.8 (NOT Redux)
- **Flow Editor:** @xyflow/react 12.10.0
- **Collab:** Yjs 14.0.0
- **Agent Protocol:** AG-UI (SSE), A2A (JSON-RPC)
- **Backend:** AgentOS (FastAPI) + Supabase
- **Auth:** Clerk

## Common Mistakes to Avoid

1. **Don't rebuild AgentOS endpoints** - They're already provided
2. **Don't use REST for agent chat** - Use AG-UI SSE streaming
3. **Don't skip FR validation** - Every feature maps to a PRD requirement
4. **Don't ignore confidence thresholds** - DCRL pattern is mandatory
5. **Don't hardcode agent IDs** - Use bond/wendy/morgan/artie consistently

## Epics & Stories

For implementation tasks, reference:

- `_bmad-output/planning-artifacts/epics.md` - All epics and user stories
- Stories are organized by epic with acceptance criteria

## Research Documents

35+ research documents in `_bmad-output/planning-artifacts/research/` covering:

- Agentic protocols (AG-UI, A2A)
- MCP marketplace patterns
- Conversational builder UX
- Visual diff engine
- Voice agent integration
