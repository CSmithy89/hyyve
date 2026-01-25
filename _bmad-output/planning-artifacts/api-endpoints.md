# Hyyve Platform - API Endpoints Reference

**Version:** 2.0.0
**Updated:** 2026-01-26
**Architecture:** AgentOS (Agno) + Hyyve Custom Routes

---

## Architecture Overview

Hyyve uses **AgentOS** (from Agno) as the core agent runtime. This provides:
- Agent execution with SSE streaming
- Session management
- Memory system (user/agent/team scopes)
- Knowledge base (RAG)
- A2A (Agent-to-Agent) protocol

**Endpoint Sources:**
- 🤖 **AgentOS** - Provided by Agno runtime (use directly)
- 🏗️ **Hyyve** - Custom routes we implement

---

## AgentOS Endpoints (Provided by Agno Runtime) 🤖

### Core
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/config` | AgentOS configuration |
| GET | `/models` | Available LLM models |
| GET | `/health` | Health check |

### Agents (Bond, Wendy, Morgan, Artie)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/agents` | List all agents |
| GET | `/agents/{agent_id}` | Get agent config |
| POST | `/agents/{agent_id}/runs` | Execute agent (SSE streaming) |
| POST | `/agents/{agent_id}/runs/{run_id}/cancel` | Cancel run |
| POST | `/agents/{agent_id}/runs/{run_id}/continue` | Continue paused run |

### Teams
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/teams` | List teams |
| GET | `/teams/{team_id}` | Get team details |
| POST | `/teams/{team_id}/runs` | Execute team |

### Sessions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/sessions` | List sessions (paginated) |
| POST | `/sessions` | Create session |
| GET | `/sessions/{session_id}` | Get session |
| GET | `/sessions/{session_id}/runs` | Get session runs |
| GET | `/sessions/{session_id}/runs/{run_id}` | Get specific run |
| POST | `/sessions/{session_id}/rename` | Rename session |
| PATCH | `/sessions/{session_id}` | Update session |
| DELETE | `/sessions/{session_id}` | Delete session |
| DELETE | `/sessions` | Bulk delete |

### Memory
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/memories` | Create memory |
| GET | `/memories` | List memories |
| GET | `/memories/{memory_id}` | Get memory |
| PATCH | `/memories/{memory_id}` | Update memory |
| DELETE | `/memories/{memory_id}` | Delete memory |
| DELETE | `/memories` | Bulk delete |
| GET | `/memory_topics` | Get topics |
| GET | `/user_memory_stats` | Memory statistics |
| POST | `/optimize-memories` | Optimize memories |

### Knowledge Base
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/knowledge/content` | Upload content |
| GET | `/knowledge/content` | List content |
| GET | `/knowledge/content/{content_id}` | Get content |
| PATCH | `/knowledge/content/{content_id}` | Update content |
| DELETE | `/knowledge/content/{content_id}` | Delete content |
| DELETE | `/knowledge/content` | Clear all |
| GET | `/knowledge/content/{content_id}/status` | Processing status |
| POST | `/knowledge/search` | Search KB |
| GET | `/knowledge/config` | KB configuration |

### A2A (Agent-to-Agent)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/a2a/agents/{id}/.well-known/agent-card.json` | Agent discovery |
| POST | `/a2a/agents/{id}/v1/message:send` | Send message |
| POST | `/a2a/agents/{id}/v1/message:stream` | Stream messages |
| GET | `/a2a/teams/{id}/.well-known/agent-card.json` | Team discovery |
| POST | `/a2a/teams/{id}/v1/message:send` | Send to team |
| POST | `/a2a/teams/{id}/v1/message:stream` | Stream to team |

### AG-UI Interface
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/agui` | Execute via AG-UI |
| GET | `/agui/status` | AG-UI status |

### Workflows (AgentOS)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/workflows` | List workflows |
| GET | `/workflows/{workflow_id}` | Get workflow |
| POST | `/workflows/{workflow_id}/runs` | Execute workflow |
| POST | `/workflows/{workflow_id}/runs/{run_id}/cancel` | Cancel |
| WS | `/workflows/ws` | WebSocket events |

---

## Hyyve Custom Endpoints 🏗️

**Base URL:** `/api/v1`

---

## Authentication & Identity

### Auth Endpoints
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| POST | `/auth/register` | Create new account | FR1 |
| POST | `/auth/login` | Email/password login | FR1 |
| POST | `/auth/logout` | End session | FR1 |
| POST | `/auth/refresh` | Refresh access token | FR1 |
| POST | `/auth/mfa/setup` | Initialize MFA | FR2 |
| POST | `/auth/mfa/verify` | Verify MFA code | FR2 |
| GET | `/auth/mfa/backup-codes` | Get backup codes | FR2 |
| POST | `/auth/sso/saml` | SAML SSO callback | FR3 |
| POST | `/auth/sso/oidc` | OIDC callback | FR3 |
| GET | `/auth/me` | Get current user | FR1 |

### API Keys
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/api-keys` | List user's API keys | FR5 |
| POST | `/api-keys` | Create new API key | FR5 |
| DELETE | `/api-keys/{id}` | Revoke API key | FR5 |
| POST | `/api-keys/{id}/rotate` | Rotate key without downtime | FR6 |

---

## Workspaces & Projects

### Workspaces
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/workspaces` | List user's workspaces | FR8 |
| POST | `/workspaces` | Create workspace | FR8 |
| GET | `/workspaces/{id}` | Get workspace details | FR8 |
| PUT | `/workspaces/{id}` | Update workspace | FR8 |
| DELETE | `/workspaces/{id}` | Delete workspace | FR8 |
| GET | `/workspaces/{id}/members` | List members | FR10 |
| POST | `/workspaces/{id}/members` | Invite member | FR10 |
| PUT | `/workspaces/{id}/members/{userId}` | Update member role | FR10 |
| DELETE | `/workspaces/{id}/members/{userId}` | Remove member | FR10 |

### Projects
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/workspaces/{wsId}/projects` | List projects | FR9 |
| POST | `/workspaces/{wsId}/projects` | Create project | FR9 |
| GET | `/projects/{id}` | Get project details | FR9 |
| PUT | `/projects/{id}` | Update project | FR9 |
| DELETE | `/projects/{id}` | Delete project | FR14 |
| POST | `/projects/{id}/duplicate` | Duplicate as template | FR13 |
| POST | `/projects/{id}/archive` | Archive project | FR14 |
| POST | `/projects/{id}/restore` | Restore project | FR14 |

### Folders
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/workspaces/{wsId}/folders` | List folders | FR12 |
| POST | `/workspaces/{wsId}/folders` | Create folder | FR12 |
| PUT | `/folders/{id}` | Update folder | FR12 |
| DELETE | `/folders/{id}` | Delete folder | FR12 |
| PUT | `/projects/{id}/folder` | Move project to folder | FR12 |

---

## Module Builder

### Workflows
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/projects/{id}/workflows` | List workflows | FR17 |
| POST | `/projects/{id}/workflows` | Create workflow | FR17 |
| GET | `/workflows/{id}` | Get workflow | FR17 |
| PUT | `/workflows/{id}` | Update workflow | FR17 |
| DELETE | `/workflows/{id}` | Delete workflow | FR17 |
| POST | `/workflows/{id}/validate` | Validate DAG | FR31 |
| GET | `/workflows/{id}/export` | Export as JSON | FR27 |
| POST | `/workflows/import` | Import from JSON | FR27 |

### Nodes
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/workflows/{id}/nodes` | List nodes | FR17 |
| POST | `/workflows/{id}/nodes` | Add node | FR17-23 |
| PUT | `/nodes/{id}` | Update node config | FR18-23 |
| DELETE | `/nodes/{id}` | Remove node | FR17 |
| POST | `/workflows/{id}/connections` | Connect nodes | FR24 |
| DELETE | `/connections/{id}` | Remove connection | FR24 |

### Variables
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/workflows/{id}/variables` | List variables | FR25 |
| POST | `/workflows/{id}/variables` | Create variable | FR25 |
| PUT | `/variables/{id}` | Update variable | FR25 |
| DELETE | `/variables/{id}` | Delete variable | FR25 |

### Execution
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| POST | `/workflows/{id}/execute` | Execute workflow | FR127 |
| GET | `/executions/{id}` | Get execution status | FR140 |
| POST | `/executions/{id}/pause` | Pause execution | FR131 |
| POST | `/executions/{id}/resume` | Resume execution | FR131 |
| POST | `/executions/{id}/cancel` | Cancel execution | FR131 |
| GET | `/executions/{id}/stream` | SSE stream for updates | FR129 |

---

## Chatbot Builder

### Chatbots
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/projects/{id}/chatbots` | List chatbots | FR39 |
| POST | `/projects/{id}/chatbots` | Create chatbot | FR39 |
| GET | `/chatbots/{id}` | Get chatbot | FR39 |
| PUT | `/chatbots/{id}` | Update chatbot | FR39 |
| DELETE | `/chatbots/{id}` | Delete chatbot | FR39 |

### Intents & Training
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/chatbots/{id}/intents` | List intents | FR43 |
| POST | `/chatbots/{id}/intents` | Create intent | FR43 |
| PUT | `/intents/{id}` | Update intent | FR43 |
| DELETE | `/intents/{id}` | Delete intent | FR43 |
| POST | `/chatbots/{id}/train` | Train NLU model | FR44 |
| GET | `/chatbots/{id}/training-status` | Get training status | FR44 |

### Conversation Flows
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/chatbots/{id}/flows` | List flows | FR39 |
| POST | `/chatbots/{id}/flows` | Create flow | FR39 |
| PUT | `/flows/{id}` | Update flow | FR39 |
| DELETE | `/flows/{id}` | Delete flow | FR39 |

### Widget
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/chatbots/{id}/widget` | Get widget config | FR51 |
| PUT | `/chatbots/{id}/widget` | Update widget config | FR51 |
| GET | `/chatbots/{id}/embed-code` | Get embed code | FR52 |

---

## Voice Agent Builder

### Voice Agents
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/projects/{id}/voice-agents` | List voice agents | FR54 |
| POST | `/projects/{id}/voice-agents` | Create voice agent | FR54 |
| GET | `/voice-agents/{id}` | Get voice agent | FR54 |
| PUT | `/voice-agents/{id}` | Update voice agent | FR54 |
| DELETE | `/voice-agents/{id}` | Delete voice agent | FR54 |

### Voice Configuration
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/voice-agents/{id}/config` | Get voice config | FR55-59 |
| PUT | `/voice-agents/{id}/config` | Update voice config | FR55-59 |
| GET | `/voice-providers` | List STT/TTS providers | FR55-57 |
| POST | `/voice-agents/{id}/test-call` | Initiate test call | FR65 |

### Call Management
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/voice-agents/{id}/calls` | List calls | FR64 |
| GET | `/calls/{id}` | Get call details | FR64 |
| GET | `/calls/{id}/transcript` | Get transcript | FR64 |
| GET | `/calls/{id}/recording` | Get recording URL | FR64 |

---

## Canvas Builder

### Canvas Workflows
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/projects/{id}/canvas` | List canvas workflows | FR69 |
| POST | `/projects/{id}/canvas` | Create canvas | FR69 |
| GET | `/canvas/{id}` | Get canvas | FR69 |
| PUT | `/canvas/{id}` | Update canvas | FR69 |
| DELETE | `/canvas/{id}` | Delete canvas | FR69 |

### Canvas Nodes (Media Generation)
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/canvas/{id}/nodes` | List nodes | FR70 |
| POST | `/canvas/{id}/nodes` | Add node | FR70-76 |
| PUT | `/canvas/nodes/{id}` | Update node | FR70-76 |
| DELETE | `/canvas/nodes/{id}` | Remove node | FR70 |

### Execution & Preview
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| POST | `/canvas/{id}/execute` | Execute DAG | FR77 |
| GET | `/canvas/{id}/execute/stream` | SSE for progress | FR78 |
| POST | `/canvas/{id}/preview` | Generate preview | FR79 |
| GET | `/canvas/{id}/cost-estimate` | Estimate cost | FR80 |

### Batch Processing
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| POST | `/canvas/{id}/batch` | Queue batch job | FR82 |
| GET | `/canvas/{id}/batch/{jobId}` | Get batch status | FR82 |

---

## Knowledge Base / RAG

### Knowledge Bases
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/projects/{id}/knowledge-bases` | List KBs | FR86 |
| POST | `/projects/{id}/knowledge-bases` | Create KB | FR86 |
| GET | `/knowledge-bases/{id}` | Get KB | FR86 |
| PUT | `/knowledge-bases/{id}` | Update KB | FR86 |
| DELETE | `/knowledge-bases/{id}` | Delete KB | FR86 |

### Documents
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/knowledge-bases/{id}/documents` | List documents | FR87 |
| POST | `/knowledge-bases/{id}/documents` | Upload document | FR87 |
| DELETE | `/documents/{id}` | Delete document | FR87 |
| POST | `/knowledge-bases/{id}/crawl` | Crawl URL | FR88 |

### Retrieval
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| POST | `/knowledge-bases/{id}/query` | Query KB | FR91-95 |
| GET | `/knowledge-bases/{id}/config` | Get RAG config | FR98 |
| PUT | `/knowledge-bases/{id}/config` | Update RAG config | FR98 |

---

## MCP Server Marketplace

### Registry
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/mcp/servers` | Browse MCP servers | FR100-101 |
| GET | `/mcp/servers/search` | Search servers | FR102 |
| GET | `/mcp/servers/{id}` | Get server details | FR104 |

### Installation
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/projects/{id}/mcp/installed` | List installed | FR105 |
| POST | `/projects/{id}/mcp/install` | Install server | FR105 |
| PUT | `/projects/{id}/mcp/{serverId}/config` | Configure server | FR106 |
| POST | `/projects/{id}/mcp/{serverId}/toggle` | Enable/disable | FR107 |
| DELETE | `/projects/{id}/mcp/{serverId}` | Uninstall | FR105 |

### Publishing
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| POST | `/mcp/servers` | Publish MCP server | FR111 |
| PUT | `/mcp/servers/{id}` | Update listing | FR111 |
| PUT | `/mcp/servers/{id}/pricing` | Set pricing | FR112 |

---

## Skills Marketplace

### Skills
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/skills` | Browse skills | FR114 |
| GET | `/skills/search` | Search skills | FR116 |
| GET | `/skills/{id}` | Get skill details | FR118 |

### Installation
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/projects/{id}/skills/installed` | List installed | FR119 |
| POST | `/projects/{id}/skills/install` | Install skill | FR119 |
| DELETE | `/projects/{id}/skills/{skillId}` | Uninstall | FR119 |

### Publishing
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| POST | `/skills` | Publish skill | FR124 |
| PUT | `/skills/{id}` | Update listing | FR124 |
| PUT | `/skills/{id}/pricing` | Set pricing | FR125 |

---

## Module Marketplace

### Listings
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/marketplace/modules` | Browse modules | FR169 |
| GET | `/marketplace/modules/search` | Search modules | FR169 |
| GET | `/marketplace/modules/{id}` | Get module details | FR170 |
| GET | `/marketplace/modules/{id}/reviews` | Get reviews | FR170 |

### Publishing
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| POST | `/marketplace/modules` | Publish module | FR166 |
| PUT | `/marketplace/modules/{id}` | Update listing | FR166 |
| PUT | `/marketplace/modules/{id}/pricing` | Set pricing | FR167 |
| POST | `/marketplace/modules/{id}/version` | Publish new version | FR166 |

### Installation
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| POST | `/projects/{id}/marketplace/install` | Install module | FR171 |
| POST | `/workflows/{id}/fork` | Fork public module | FR177 |

---

## Observability

### Traces
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/observability/traces` | List traces | FR140 |
| GET | `/observability/traces/{id}` | Get trace detail | FR140 |
| GET | `/observability/traces/export` | Export traces | FR149 |

### Usage & Costs
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/usage/summary` | Get usage summary | FR141 |
| GET | `/usage/breakdown` | Get cost breakdown | FR142 |
| GET | `/usage/forecast` | Get usage forecast | FR193 |

### Alerts
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/alerts` | List alerts | FR143 |
| POST | `/alerts` | Create alert | FR143 |
| PUT | `/alerts/{id}` | Update alert | FR143 |
| DELETE | `/alerts/{id}` | Delete alert | FR143 |

---

## Human-in-the-Loop

### Approvals
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/hitl/pending` | List pending approvals | FR152 |
| GET | `/hitl/{id}` | Get approval request | FR152 |
| POST | `/hitl/{id}/approve` | Approve request | FR153 |
| POST | `/hitl/{id}/reject` | Reject request | FR153 |
| POST | `/hitl/{id}/modify` | Modify and approve | FR153 |

### Configuration
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/workflows/{id}/hitl-config` | Get HITL config | FR150 |
| PUT | `/workflows/{id}/hitl-config` | Update HITL config | FR150 |
| PUT | `/workflows/{id}/escalation` | Configure escalation | FR155 |

---

## Deployments

### Chatwoot
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/deployments/chatwoot` | List deployments | FR156 |
| POST | `/deployments/chatwoot` | Deploy to Chatwoot | FR156 |
| PUT | `/deployments/chatwoot/{id}` | Update deployment | FR156 |
| DELETE | `/deployments/chatwoot/{id}` | Remove deployment | FR156 |

### Embeds
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/embeds` | List embeds | FR163 |
| POST | `/embeds` | Create embed | FR163 |
| GET | `/embeds/{id}/code` | Get embed code | FR163 |

---

## Billing & Usage

### Subscriptions
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/billing/subscription` | Get subscription | FR190 |
| POST | `/billing/subscription` | Create subscription | FR190 |
| PUT | `/billing/subscription` | Update plan | FR190 |
| DELETE | `/billing/subscription` | Cancel subscription | FR190 |

### Usage
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/billing/usage` | Get current usage | FR187-189 |
| GET | `/billing/invoices` | List invoices | FR195 |
| GET | `/billing/invoices/{id}` | Get invoice | FR195 |

### Portal
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| POST | `/billing/portal` | Get Stripe portal URL | FR194 |

---

## Collaboration

### Presence
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/workflows/{id}/presence` | Get active users | FR198 |
| WS | `/workflows/{id}/collaborate` | WebSocket for Yjs | FR197 |

### Comments
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/workflows/{id}/comments` | List comments | FR202 |
| POST | `/workflows/{id}/comments` | Add comment | FR202 |
| PUT | `/comments/{id}` | Update comment | FR202 |
| DELETE | `/comments/{id}` | Delete comment | FR202 |

### Versions
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/workflows/{id}/versions` | List versions | FR199 |
| GET | `/workflows/{id}/versions/{versionId}` | Get version | FR199 |
| POST | `/workflows/{id}/versions/{versionId}/rollback` | Rollback | FR201 |
| GET | `/workflows/{id}/versions/diff` | Compare versions | FR200 |

---

## White-Label & Agency

### Clients
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/agency/clients` | List clients | FR206 |
| POST | `/agency/clients` | Create client | FR206 |
| GET | `/agency/clients/{id}` | Get client | FR206 |
| PUT | `/agency/clients/{id}` | Update client | FR206 |
| DELETE | `/agency/clients/{id}` | Remove client | FR206 |
| GET | `/agency/clients/{id}/usage` | Get client usage | FR207 |

### Branding
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/agency/branding` | Get branding config | FR211 |
| PUT | `/agency/branding` | Update branding | FR211 |
| PUT | `/agency/branding/domain` | Configure domain | FR210 |
| PUT | `/agency/branding/email` | Configure email domain | FR212 |

---

## Enterprise Admin

### SSO
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/admin/sso` | Get SSO config | FR3 |
| PUT | `/admin/sso/saml` | Configure SAML | FR3 |
| PUT | `/admin/sso/oidc` | Configure OIDC | FR3 |

### SCIM
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/scim/v2/Users` | List users | FR4 |
| POST | `/scim/v2/Users` | Create user | FR4 |
| PUT | `/scim/v2/Users/{id}` | Update user | FR4 |
| DELETE | `/scim/v2/Users/{id}` | Delete user | FR4 |
| GET | `/scim/v2/Groups` | List groups | FR4 |

### Security
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/admin/security/audit-logs` | Get audit logs | FR148 |
| GET | `/admin/security/ip-allowlist` | Get IP allowlist | FR7 |
| PUT | `/admin/security/ip-allowlist` | Update IP allowlist | FR7 |

---

## DCRL Pattern Backend (ADR-004)

**Reference:** Architecture ADR-004, PRD FR32-FR38, UX Screen 1.2.1 (Module Builder)

The DCRL (Detect→Clarify→Resolve→Learn) pattern provides confidence-based routing for conversational building. When intent confidence is below threshold, the system requests clarification before proceeding.

### Confidence Thresholds
| Level | Range | Behavior |
|-------|-------|----------|
| High | >0.85 | Execute immediately |
| Medium | 0.6-0.85 | Execute with confirmation |
| Low | <0.6 | Request clarification |

### DCRL Endpoints
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/dcrl/state/{sessionId}` | Get current DCRL state for session | FR32 |
| POST | `/dcrl/detect` | Analyze user intent, return confidence score | FR33 |
| POST | `/dcrl/clarify` | Submit clarification question | FR34 |
| POST | `/dcrl/clarify/{sessionId}/response` | Record user's clarification response | FR34 |
| POST | `/dcrl/resolve` | Execute resolved action | FR35 |
| POST | `/dcrl/learn` | Record learning feedback for model improvement | FR36 |
| GET | `/dcrl/history/{sessionId}` | Get DCRL interaction history | FR37 |
| PUT | `/dcrl/config/{agentId}` | Update agent's DCRL configuration | FR38 |

### DCRL State Machine Payload

```json
{
  "sessionId": "string",
  "state": "DETECT | CLARIFY | RESOLVE | LEARN",
  "confidence": 0.0-1.0,
  "intent": {
    "detected": "string",
    "alternatives": [{ "intent": "string", "confidence": 0.0-1.0 }]
  },
  "clarification": {
    "question": "string",
    "options": ["string"],
    "required": true
  },
  "action": {
    "type": "string",
    "parameters": {}
  }
}
```

---

## Checkpoint/Undo Service (ADR-003)

**Reference:** Architecture ADR-003, UX Screen 1.2.1 (Module Builder - Undo button)

The checkpoint system enables conversation-level undo by storing workflow state at each agent interaction. Uses `CheckpointManager` pattern with Yjs UndoManager for collaborative editing.

### Checkpoint Endpoints
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/workflows/{id}/checkpoints` | List all checkpoints for workflow | FR199 |
| GET | `/checkpoints/{checkpointId}` | Get checkpoint details | FR199 |
| POST | `/workflows/{id}/checkpoint` | Create checkpoint (auto on agent action) | FR199 |
| POST | `/checkpoints/{checkpointId}/rewind` | Rewind to checkpoint, restore graph state | FR201 |
| DELETE | `/checkpoints/{checkpointId}` | Delete checkpoint | FR199 |
| GET | `/workflows/{id}/checkpoint-diff` | Diff between checkpoints | FR200 |

### Checkpoint Payload (WorkflowCheckpoint Interface)

```json
{
  "id": "string",
  "workflowId": "string",
  "timestamp": "ISO8601",
  "conversationTurnId": "string",
  "graphState": {
    "nodes": [],
    "edges": [],
    "variables": {}
  },
  "description": "Added LLM node via Bond",
  "metadata": {
    "agentId": "bond",
    "action": "ADD_NODE",
    "userMessage": "string"
  }
}
```

### Rewind Response

```json
{
  "graph": {
    "nodes": [],
    "edges": [],
    "variables": {}
  },
  "trimmedHistory": ["turn_5", "turn_6"],
  "restoredToTurn": "turn_4"
}
```

---

## MCP Registry Aggregation

**Reference:** PRD FR100-FR113, UX Screens 3.2.1-3.2.4 (MCP Registry Browser)

Hyyve aggregates from the official MCP Registry (`registry.modelcontextprotocol.io/v0.1/`) and Smithery.ai for a unified marketplace experience.

### Registry Aggregation Endpoints
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/mcp/registry/sync` | Trigger sync from upstream registries | FR100 |
| GET | `/mcp/registry/status` | Get sync status and last update time | FR100 |
| GET | `/mcp/registry/sources` | List configured registry sources | FR101 |
| POST | `/mcp/registry/sources` | Add new registry source | FR101 |
| PUT | `/mcp/registry/sources/{id}` | Update registry source config | FR101 |
| DELETE | `/mcp/registry/sources/{id}` | Remove registry source | FR101 |

### Upstream API Proxies (Optional - for direct passthrough)
| Method | Endpoint | Description | FR |
|--------|----------|-------------|-----|
| GET | `/mcp/upstream/v0.1/servers` | Proxy to official MCP registry | FR100 |
| GET | `/mcp/upstream/v0.1/servers/{name}/versions` | Get versions from official | FR104 |
| GET | `/mcp/upstream/v0.1/servers/{name}/versions/{version}` | Get specific version | FR104 |

### Registry Source Configuration

```json
{
  "id": "string",
  "name": "Official MCP Registry",
  "type": "MCP_OFFICIAL | SMITHERY | CUSTOM",
  "baseUrl": "https://registry.modelcontextprotocol.io",
  "apiVersion": "v0.1",
  "enabled": true,
  "syncInterval": "1h",
  "lastSync": "ISO8601",
  "priority": 1,
  "auth": {
    "type": "none | api_key | oauth",
    "credentials": "encrypted"
  }
}
```

### Aggregated Server Response (Unified Format)

```json
{
  "id": "string",
  "name": "string",
  "source": "MCP_OFFICIAL | SMITHERY | HYYVE",
  "version": "string",
  "description": "string",
  "author": "string",
  "license": "string",
  "categories": ["database", "ai"],
  "tools": [{ "name": "query", "description": "..." }],
  "prompts": [],
  "resources": [],
  "installCount": 1234,
  "rating": 4.5,
  "pricing": {
    "model": "free | paid | freemium",
    "price": 0
  },
  "links": {
    "repository": "string",
    "documentation": "string",
    "registry": "string"
  }
}
```

---

## WebSocket Endpoints

| Endpoint | Protocol | Description |
|----------|----------|-------------|
| `/ws/workflows/{id}` | WebSocket | Real-time workflow collaboration (Yjs) |
| `/ws/executions/{id}` | WebSocket | Execution updates |
| `/ws/voice/{agentId}` | WebSocket | Voice agent audio stream |
| `/ws/chat/{sessionId}` | WebSocket | Chat session |

---

## SSE Endpoints

| Endpoint | Description |
|----------|-------------|
| `/sse/executions/{id}` | Execution progress stream |
| `/sse/canvas/{id}` | Canvas generation progress |
| `/sse/chat/{sessionId}` | Chat response stream |

---

## Rate Limits

| Tier | Limit | Burst |
|------|-------|-------|
| Free | 60/min | 10 |
| Pro | 600/min | 100 |
| Business | 3000/min | 500 |
| Enterprise | Custom | Custom |

All responses include headers:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

---

## Response Format

### Success
```json
{
  "data": { ... },
  "meta": {
    "requestId": "uuid",
    "timestamp": "ISO8601"
  }
}
```

### Error
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { ... }
  },
  "meta": {
    "requestId": "uuid",
    "timestamp": "ISO8601"
  }
}
```

### Pagination
```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "perPage": 20,
    "totalPages": 5
  }
}
```
