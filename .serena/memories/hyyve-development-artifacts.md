# Hyyve Development Artifacts Reference

## Key Planning Documents

When implementing features for the Hyyve platform, reference these documents:

### API Development

- **api-endpoints.md** - Complete endpoint reference with FR mappings
- **agentos-integration-spec.md** - AgentOS provides 50+ endpoints (agents, sessions, memory, knowledge, A2A)
- **protocol-stack-specification.md** - AG-UI (25 events), A2UI (generative UI), A2A protocol

### Feature Requirements

- **prd.md** - 248 functional requirements, 70 non-functional requirements
- **epics.md** - User stories organized by epic with acceptance criteria
- **architecture.md** - 8 ADRs including DCRL, Checkpoint, Memory patterns

### UI Implementation

- **ux-design-specification.md** - 146 wireframe screens
- **stitch-prompts-\*.md** - Google Stitch prompts for UI generation

## AgentOS vs Hyyve Custom

**AgentOS Provides:**

- /agents/_, /sessions/_, /memories/_, /knowledge/_, /a2a/\*, /agui

**Hyyve Must Implement:**

- /api/v1/dcrl/\* - Confidence routing (ADR-004)
- /api/v1/checkpoints/\* - Undo service (ADR-003)
- /api/v1/mcp/registry/\* - MCP aggregation
- /api/v1/workspaces/_, /api/v1/projects/_, /api/v1/workflows/\*

## Agents

Four agents: Bond (modules), Wendy (chatbots), Morgan (voice), Artie (canvas)
All use DCRL pattern with confidence thresholds: >0.85 execute, 0.6-0.85 confirm, <0.6 clarify
