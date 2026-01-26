---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-generate-stories', 'step-04-final-validation']
inputDocuments:
  - path: '_bmad-output/planning-artifacts/prd.md'
    type: 'prd'
    version: '1.0'
  - path: '_bmad-output/planning-artifacts/architecture.md'
    type: 'architecture'
    version: '1.0'
  - path: '_bmad-output/planning-artifacts/ux-design-specification.md'
    type: 'ux'
    version: '1.0'
  - path: '_bmad-output/planning-artifacts/cross-reference-matrix.md'
    type: 'traceability'
  - path: '_bmad-output/project-context.md'
    type: 'implementation-rules'
    rule_count: 91
  - path: '_bmad-output/planning-artifacts/ag-ui-integration-guide.md'
    type: 'implementation-guide'
    topics: ['AGENT_CONTENT_ZONE', 'A2UI schema', 'streaming patterns']
  - path: '_bmad-output/planning-artifacts/protocol-stack-specification.md'
    type: 'implementation-guide'
    topics: ['AG-UI events', 'A2A messages', 'MCP', 'DCRL']
project_name: 'Hyyve'
user_name: 'Chris'
date: '2026-01-25'
status: 'complete'
---

# Hyyve - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Hyyve, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

**Platform Summary:**
- **4 Builder Paradigms**: Module, Chatbot, Voice, Canvas
- **248 Functional Requirements** across 23 capability areas
- **70 Non-Functional Requirements** across 9 categories
- **146 UX Screens** across 6 phases
- **~2,584 UI Components**
- **Unified Protocol Stack**: A2UI + AG-UI + CopilotKit + MCP + A2A

## Requirements Inventory

### Functional Requirements (248 Total)

#### 1. Account & Identity Management (7 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR1 | Users can create account via email/password or social providers | T5-SSO, T1-SAAS | 1.1.1, 1.1.2 | Clerk: `/v1/users`, `/v1/sign_ups` | — |
| FR2 | Users can enable multi-factor authentication | T5-SSO §4 | 1.1.5, 1.1.6, 1.1.7, 1.10.2 | Clerk: `/v1/users/{id}/totp`, `/v1/users/{id}/backup_codes` | — |
| FR3 | Enterprise users can authenticate via SAML SSO or OIDC | T5-SSO §1-2 | 1.1.1, 4.4.1 | WorkOS: `/sso/authorize`, `/sso/token` | — |
| FR4 | Enterprise admins can provision/deprovision users via SCIM | T5-SSO §3 | 4.4.2, 4.8.1 | WorkOS: `/scim/v2/Users`, `/scim/v2/Groups` | — |
| FR5 | Users can manage API keys with custom scopes and expiration | T8-UI §5 | 1.10.3, 6.1.1 | `/api/v1/settings/api-keys` | — |
| FR6 | Users can rotate API keys without service interruption | T8-UI §5 | 1.10.3 | `/api/v1/settings/api-keys/{id}/rotate` | — |
| FR7 | System can enforce IP allowlisting for enterprise | T5-SSO §9 | 1.10.3, 4.8.4 | `/api/v1/settings/security/ip-allowlist` | — |

#### 2. Workspace & Project Management (9 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR8 | Users can create workspaces to organize work | T1-SAAS §9 | 1.5.1, 1.10.4 | `/api/v1/workspaces` | — |
| FR9 | Users can create multiple projects within workspace | T1-SAAS §9 | 1.5.2 | `/api/v1/workspaces/{id}/projects` | — |
| FR10 | Workspace owners can invite members with role-based permissions | T8-UI §1 | 1.10.4, 4.4.2, 5.1.2 | `/api/v1/workspaces/{id}/members` | — |
| FR11 | Users can switch between workspaces without logging out | T5-SSO §8 | 1.5.2, 2.13.1 | `/api/v1/workspaces/switch` | — |
| FR12 | Projects can be organized into folders or categories | T8-GAPS §1 | 1.5.2 | `/api/v1/projects/{id}/folders` | — |
| FR13 | Users can duplicate projects as templates | T1-VWB §8 | 1.5.2, 2.12.1 | `/api/v1/projects/{id}/duplicate` | — |
| FR14 | Users can archive and restore projects | T4-VER §5 | 1.5.2 | `/api/v1/projects/{id}/archive`, `/restore` | — |
| FR15 | System enforces tenant isolation via Row-Level Security | T1-SAAS §3-6 | 2.13.2, 4.7.1 | (all endpoints via RLS policies) | — |
| FR16 | Enterprise tenants can have dedicated database isolation | T1-SAAS §4 | 2.13.2, 4.8.3 | `/api/v1/enterprise/database-isolation` | — |

#### 3. Module Builder (15 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR17 | Users can create visual workflows using node-based editor | T1-VWB §2-5 | 1.2.1 | `/api/v1/workflows`, AgentOS: `/agents/{id}/config` | AG-UI: `STATE_SNAPSHOT` |
| FR18 | Users can add Prompt nodes with variable interpolation | T1-VWB §6 | 1.2.2, 1.2.2a | `/api/v1/workflows/{id}/nodes` | AG-UI: `STATE_DELTA` |
| FR19 | Users can add Sub-Agent nodes with system prompts, tools, model | T1-CLAUDE §2-4 | 1.2.2a | `/api/v1/workflows/{id}/nodes`, AgentOS: `/agents` | AG-UI: `STATE_DELTA` |
| FR20 | Users can add MCP Tool nodes to call installed MCP servers | T5-MCP | 2.1.4, 2.1.5, 2.1.6 | `/api/v1/mcp/registry/tools`, AgentOS: `/mcp/tools/{id}/execute` | AG-UI: `TOOL_CALL_*` |
| FR21 | Users can add Skill nodes to execute installed Skills | T5-MCP §5 | 3.1.3, 3.1.4, 1.2.2 | `/api/v1/skills/{id}` | AG-UI: `TOOL_CALL_*` |
| FR22 | Users can add Control Flow nodes (If/Else, Switch, Loop) | T1-VWB §6 | 1.2.2c | `/api/v1/workflows/{id}/nodes` | AG-UI: `STATE_DELTA` |
| FR23 | Users can add AskUserQuestion nodes for HITL | T1-CLAUDE §3 | 1.2.2, 2.4.1, 2.4.2 | `/api/v1/hitl/questions` | AG-UI: `TOOL_CALL_START`, `TOOL_CALL_RESULT` |
| FR24 | Users can connect nodes with validated type-checking | T1-VWB §5 | 1.2.1 | `/api/v1/workflows/{id}/edges` | AG-UI: `STATE_DELTA` |
| FR25 | Users can define variables in namespace-isolated Variable Pool | T1-VWB §7 | 1.2.2, 1.2.2d | `/api/v1/workflows/{id}/variables` | AG-UI: `STATE_DELTA` |
| FR26 | System provides undo/redo history for workflow editing | T1-VWB §2 | 1.2.1 | `/api/v1/checkpoints/{sessionId}/undo`, `/redo` | AG-UI: `STATE_SNAPSHOT` |
| FR27 | Users can save and load workflow configurations as JSON | T1-VWB §8 | 1.2.4, 1.2.6 | `/api/v1/workflows/{id}/export`, `/import` | — |
| FR28 | Users can zoom, pan, and use minimap for navigation | T1-VWB §5 | 1.2.1 | (frontend state) | — |
| FR29 | Users can group nodes into reusable sub-workflows | T1-VWB §6 | 1.2.1, 2.12.1 | `/api/v1/workflows/{id}/subworkflows` | AG-UI: `STATE_DELTA` |
| FR30 | Users can add comment annotations to nodes | T1-VWB §8 | 1.2.1 | `/api/v1/workflows/{id}/annotations` | AG-UI: `STATE_DELTA` |
| FR31 | System validates workflows before execution (DAG check) | T7-CANVAS §8.1 | 1.2.1, 1.2.3, 1.2.5 | `/api/v1/workflows/{id}/validate` | — |

#### 4. Conversational Building (7 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR32 | Users can build workflows by describing requirements in NL | T2-CONV §1-3 | 1.2.1 (Chat panel) | `/dcrl/state/{sessionId}`, `/dcrl/detect` | DCRL: `INTENT_DETECTED` |
| FR33 | System parses natural language intent and generates nodes | T2-CONV §3 | 1.2.1 (DCRL §2.1.1) | `/dcrl/detect` | DCRL: `INTENT_DETECTED`, AG-UI: `STATE_DELTA` |
| FR34 | System asks clarifying questions when confidence < 60% | T2-CONV §3 | DCRL §2.1.1 | `/dcrl/clarify`, `/dcrl/clarify/{sessionId}/response` | DCRL: `CLARIFICATION_NEEDED`, `CLARIFICATION_RECEIVED` |
| FR35 | BMB agents (Bond, Wendy, Morgan) guide structured creation | T2-CONV §5 | 1.2.1, 1.3.1, 2.2.1, 2.1.1 | `/dcrl/resolve` | DCRL: `ACTION_RESOLVED`, AG-UI: `TEXT_MESSAGE_*` |
| FR36 | Users can switch between conversational and visual modes | T2-CONV §7 | 1.2.1 (split pane) | (frontend state) | — |
| FR37 | System provides preview-before-apply for changes | T2-CONV §1 | DCRL §2.1.1 | `/dcrl/history/{sessionId}` | AG-UI: `STATE_SNAPSHOT` |
| FR38 | System learns from user feedback to improve parsing | T2-CONV §4 | DCRL §2.1.1 | `/dcrl/learn` | DCRL: `LEARNING_RECORDED` |

#### 5. Chatbot Builder (15 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR39 | Users can create conversational flows using visual editor | T6-CHATBOT §1-3 | 1.3.1, 1.3.4 | `/api/v1/chatbots`, AgentOS: `/agents/{id}/config` | AG-UI: `STATE_SNAPSHOT` |
| FR40 | Users can add Conversation nodes (Start, Message, Question) | T6-CHATBOT §3 | 1.3.4 | `/api/v1/chatbots/{id}/nodes` | AG-UI: `STATE_DELTA` |
| FR41 | Users can add Logic nodes (Condition, Set Variable, Switch) | T6-CHATBOT §3 | 1.3.4, 1.3.1 | `/api/v1/chatbots/{id}/nodes` | AG-UI: `STATE_DELTA` |
| FR42 | Users can add Integration nodes (API Call, Module Trigger) | T6-INTEG | 1.3.4, 1.2.2d | `/api/v1/chatbots/{id}/nodes` | AG-UI: `TOOL_CALL_*` |
| FR43 | Users can add Action nodes (Send Email, Create Ticket) | T6-CHATBOT §3 | 1.3.4 | `/api/v1/chatbots/{id}/nodes` | AG-UI: `TOOL_CALL_*` |
| FR44 | Users can add NLU nodes (Intent Classification, Entity) | T6-RASA §1 | 1.3.2, 1.3.4 | `/api/v1/chatbots/{id}/nlu` | AG-UI: `STATE_DELTA` |
| FR45 | Users can add MCP Tool nodes | T5-MCP | 2.1.4 | `/api/v1/mcp/registry/tools` | AG-UI: `TOOL_CALL_*` |
| FR46 | Users can add Skill nodes | T5-MCP §5 | 3.1.3, 3.1.4 | `/api/v1/skills/{id}` | AG-UI: `TOOL_CALL_*` |
| FR47 | System provides tokenizer, featurizer, DIETClassifier | T6-RASA §1 | 1.3.2 | AgentOS: `/agents/{id}/nlu/train` | — |
| FR48 | Users can define slots for form filling with validation | T6-RASA §3-4 | 1.3.4, 1.3.2 | `/api/v1/chatbots/{id}/slots` | AG-UI: `STATE_DELTA` |
| FR49 | Users can configure dialogue policies for state management | T6-RASA §5 | 1.3.1, 1.3.4 | `/api/v1/chatbots/{id}/policies` | — |
| FR50 | System maintains event-sourced conversation tracker | T6-RASA §2 | 1.3.6, 1.3.7 | AgentOS: `/sessions/{id}/events` | AG-UI: `MESSAGES_SNAPSHOT` |
| FR51 | Users can define fallback handlers for unrecognized intents | T6-RASA §5 | 1.3.2, 1.3.5 | `/api/v1/chatbots/{id}/fallbacks` | AG-UI: `TEXT_MESSAGE_*` |
| FR52 | Users can configure max retry attempts for slot filling | T6-RASA §4 | 1.3.4 | `/api/v1/chatbots/{id}/slots/{slotId}` | — |
| FR53 | Chatbots can escalate to human agents with context | T4-CHAT §5-6 | 1.3.4, 2.6.3, 2.4.1 | `/api/v1/integrations/chatwoot/handoff` | AG-UI: `RUN_FINISHED` |

#### 6. Voice Agent Builder (15 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR54 | Users can create voice flows using visual editor | T6-VOICE | 2.2.1 | `/api/v1/voice-agents`, AgentOS: `/agents/{id}/config` | AG-UI: `STATE_SNAPSHOT` |
| FR55 | Users can add Voice Input nodes (Listen, DTMF, STT) | T6-VOICE §1.1 | 2.2.1, 2.2.4 | `/api/v1/voice-agents/{id}/nodes` | AG-UI: `STATE_DELTA`, `TEXT_MESSAGE_*` |
| FR56 | Users can add Voice Output nodes (Speak, Audio, SSML) | T6-VOICE §1.1 | 2.2.1, 2.2.2, 2.2.4 | `/api/v1/voice-agents/{id}/nodes` | AG-UI: `TEXT_MESSAGE_*` |
| FR57 | Users can add Voice Control nodes (Transfer, Hold, Hang Up) | T6-LIVEKIT §7 | 2.2.1, 2.2.3 | `/api/v1/voice-agents/{id}/nodes` | AG-UI: `RUN_FINISHED` |
| FR58 | Users can add Voice Integration nodes (Module, MCP, Skill) | T6-INTEG | 2.2.1, 2.1.4 | `/api/v1/voice-agents/{id}/nodes` | AG-UI: `TOOL_CALL_*` |
| FR59 | System provides STT via configurable providers (Deepgram) | T6-VOICE §1.1 | 2.2.4 | `/api/v1/voice-agents/{id}/stt-config` | AG-UI: `TEXT_MESSAGE_*` |
| FR60 | System provides TTS via configurable providers (Cartesia) | T6-VOICE §1.1 | 2.2.4, 2.2.2 | `/api/v1/voice-agents/{id}/tts-config` | AG-UI: `TEXT_MESSAGE_*` |
| FR61 | System performs VAD with 98.8% TPR (Silero VAD) | T6-LIVEKIT §3 | 2.2.4 | (gRPC audio stream) | AG-UI: `ACTIVITY_DELTA` |
| FR62 | System handles turn detection (Qwen2.5-0.5B) | T6-LIVEKIT §3 | 2.2.4 | (gRPC audio stream) | AG-UI: `ACTIVITY_DELTA` |
| FR63 | System supports interruption handling (4-state machine) | T6-LIVEKIT §4 | 2.2.4 | (gRPC audio stream) | AG-UI: `ACTIVITY_DELTA` |
| FR64 | Users can configure SSML for prosody, emphasis | T6-VOICE §1.1 | 2.2.2, 2.2.4 | `/api/v1/voice-agents/{id}/ssml` | — |
| FR65 | System supports inbound/outbound calls via Twilio SIP | T6-LIVEKIT §7 | 2.2.1, 2.2.3 | `/api/v1/voice-agents/{id}/telephony` | AG-UI: `RUN_STARTED`, `RUN_FINISHED` |
| FR66 | Voice agents can access same project RAG context | T6-INTEG | 2.2.1, 1.4.1 | AgentOS: `/knowledge/search` | — |
| FR67 | Users can configure voice personas | T8-AIGEN §4 | 2.2.2 | `/api/v1/voice-agents/{id}/persona` | — |
| FR68 | System performs real-time audio via WebRTC/gRPC | T6-VOICE | 2.2.3, 2.2.5, 2.2.6 | (gRPC bidirectional stream) | AG-UI: `TEXT_MESSAGE_*`, `ACTIVITY_*` |

#### 7. Canvas Builder (17 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR69 | Users can create AI generation workflows using canvas | T7-CANVAS §1-2 | 2.1.1 | `/api/v1/canvas`, AgentOS: `/agents/{id}/config` | AG-UI: `STATE_SNAPSHOT` |
| FR70 | Users can add Generation nodes (Image, Video, Audio, 3D) | T7-CANVAS §5 | 2.1.3, 2.1.7 | `/api/v1/canvas/{id}/nodes` | AG-UI: `STATE_DELTA`, `STEP_*` |
| FR71 | Users can add Control nodes (Merge, Split, Switch, Loop) | T7-CANVAS §5 | 2.1.1 | `/api/v1/canvas/{id}/nodes` | AG-UI: `STATE_DELTA` |
| FR72 | Users can add Enhancement nodes (Upscale, Denoise) | T8-AIGEN §7 | 2.1.3, 2.1.7 | `/api/v1/canvas/{id}/nodes` | AG-UI: `STEP_*` |
| FR73 | Users can add I/O nodes (Upload, Download, URL) | T7-CANVAS §5 | 2.1.7, 2.1.1 | `/api/v1/canvas/{id}/nodes`, `/api/v1/assets` | AG-UI: `STATE_DELTA` |
| FR74 | Users can add MCP Tool nodes | T5-MCP | 2.1.4, 2.1.5, 2.1.6 | `/api/v1/mcp/registry/tools` | AG-UI: `TOOL_CALL_*` |
| FR75 | Users can add Skill nodes | T5-MCP §5 | 3.1.3, 3.1.4 | `/api/v1/skills/{id}` | AG-UI: `TOOL_CALL_*` |
| FR76 | Users can converse with "Artie" agent for NL building | T7-CANVAS §6 | 2.1.1 (Artie chat) | AgentOS: `/agui` (SSE) | AG-UI: `TEXT_MESSAGE_*`, DCRL events |
| FR77 | System executes DAGs with topological sort | T7-CANVAS §8.1, §9 | 2.1.8, 1.2.3 | AgentOS: `/agents/{id}/runs` | AG-UI: `RUN_*`, `STEP_*` |
| FR78 | System supports partial re-execution (changed nodes only) | T7-CANVAS §9 | 2.1.1, 1.2.3 | AgentOS: `/agents/{id}/runs`, `/api/v1/canvas/{id}/delta-execute` | AG-UI: `STEP_*` |
| FR79 | System caches intermediate node outputs | T7-CANVAS §13 | 2.1.7, 2.1.8 | `/api/v1/canvas/{id}/cache` | — |
| FR80 | Users can configure Brand RAG for guidelines | T7-CANVAS §11 | 2.1.1, 2.1.3 | AgentOS: `/knowledge/search`, `/api/v1/canvas/{id}/brand-rag` | — |
| FR81 | System provides cost estimation before execution | T8-AIGEN §10 | 2.1.9, 2.1.3 | `/api/v1/canvas/{id}/estimate-cost` | — |
| FR82 | Users can queue batch jobs | T7-CANVAS §9 | 2.1.8 | `/api/v1/canvas/{id}/batch` | AG-UI: `RUN_STARTED`, `ACTIVITY_*` |
| FR83 | Canvas can be triggered by Chatbot/Voice events | T6-INTEG | 2.1.1, 1.3.4 | AgentOS: `/a2a/agents/{id}/v1/message:send` | A2A: agent messaging |
| FR84 | Users can configure AI providers (fal.ai) | T8-AIGEN §6 | 2.1.3, 1.10.4 | `/api/v1/settings/ai-providers` | — |
| FR85 | System supports 50+ node types (ComfyUI parity) | T7-CANVAS §5 | 2.1.1, 2.14.5 | `/api/v1/canvas/node-types` | — |

#### 8. Knowledge Base / RAG (14 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR86 | Users can create knowledge bases scoped to projects | T0-RAG | 1.4.1 | AgentOS: `/knowledge/bases` | — |
| FR87 | Users can upload documents (PDF, DOCX, TXT, MD, HTML) | T0-RAG | 1.4.2 | AgentOS: `/knowledge/bases/{id}/documents` | — |
| FR88 | Users can ingest web content via URL crawling | T0-RAG | 1.4.3 | AgentOS: `/knowledge/bases/{id}/crawl` | — |
| FR89 | System performs intelligent chunking (semantic, AST) | T0-RAG | 1.4.4 | AgentOS: `/knowledge/bases/{id}/chunk` | — |
| FR90 | System generates embeddings via configurable providers | T0-RAG | 1.4.5 | AgentOS: `/knowledge/bases/{id}/embed` | — |
| FR91 | System supports vector search via pgvector HNSW | T0-RAG | 1.4.6 | AgentOS: `/knowledge/search` | — |
| FR92 | System supports hybrid search (vector + BM25) | T0-RAG | 1.4.6 | AgentOS: `/knowledge/search?mode=hybrid` | — |
| FR93 | System supports graph-based retrieval (Graphiti) | T0-RAG | 1.4.7 | AgentOS: `/knowledge/graph/query` | — |
| FR94 | System supports temporal memory queries | T0-RAG | 1.4.7 | AgentOS: `/memories/search?temporal=true` | — |
| FR95 | System performs reranking (Cohere, cross-encoder) | T0-RAG | 1.4.5 | AgentOS: `/knowledge/search?rerank=true` | — |
| FR96 | Users can view source citations and confidence | T4-EMBED | 1.4.8, 1.3.3 | AgentOS: `/knowledge/search` (returns citations) | — |
| FR97 | RAG context shared across all builders in project | T6-INTEG | 1.4.1 | AgentOS: `/knowledge/bases/{id}` (project-scoped) | — |
| FR98 | Users can configure retrieval parameters | T0-RAG | 1.4.5 | `/api/v1/projects/{id}/rag-config` | — |
| FR99 | System prevents cross-tenant RAG poisoning | T4-SEC §5 | 1.10.3 | (RLS policies on knowledge tables) | — |

#### 9. MCP Server Marketplace (14 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR100 | Users can browse MCP servers from Official Registry | T5-MCP §1 | 3.2.1 | `/api/v1/mcp/registry/servers?source=official` | — |
| FR101 | Users can browse MCP servers from Smithery.ai | T5-MCP §1.2 | 3.2.1 | `/api/v1/mcp/registry/servers?source=smithery` | — |
| FR102 | Users can search with semantic search | T5-MCP §7.1 | 3.2.2 | `/api/v1/mcp/registry/servers/search` | — |
| FR103 | Users can filter by category, verified, popularity | T5-MCP §7.1 | 3.2.2 | `/api/v1/mcp/registry/servers?category=...&verified=true` | — |
| FR104 | Users can view MCP server details | T5-MCP §1.1 | 3.2.3 | `/api/v1/mcp/registry/servers/{id}` | — |
| FR105 | Users can install MCP servers with one-click | T5-MCP §2-3 | 3.2.4 | `/api/v1/mcp/registry/servers/{id}/install` | — |
| FR106 | Users can configure installed MCP server settings | T5-MCP §6.1 | 3.2.5 | `/api/v1/mcp/installed/{id}/config` | — |
| FR107 | Users can enable/disable MCP servers | T5-MCP §2.2 | 3.2.5 | `/api/v1/mcp/installed/{id}/toggle` | — |
| FR108 | Users can set auto-approval rules for tools | T5-MCP §2.2 | 3.2.6 | `/api/v1/mcp/registry/tools/{id}/consent` | — |
| FR109 | System aggregates from multiple registries | T5-MCP §7.3 | 3.2.1 | `/api/v1/mcp/registry/aggregate` | — |
| FR110 | System caches registry metadata | T5-MCP §7.3 | 3.2.1 | `/api/v1/mcp/registry/cache` | — |
| FR111 | Creators can publish custom MCP servers | T5-MCP §7.1 | 3.3.1 | `/api/v1/mcp/registry/servers` (POST) | — |
| FR112 | Creators can set pricing for MCP servers | B2-MARKET §8 | 3.3.2 | `/api/v1/mcp/registry/servers/{id}/pricing` | — |
| FR113 | System tracks MCP server usage and success rates | T4-OBS §5 | 3.3.3 | `/api/v1/mcp/registry/servers/{id}/analytics` | — |

#### 10. Skills Marketplace (13 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR114 | Users can browse Skills from platform marketplace | T5-MCP §7.1 | 3.4.1 | `/api/v1/skills/marketplace` | — |
| FR115 | Users can browse Skills from project/user directories | T5-MCP §5.1 | 3.4.2 | `/api/v1/skills?scope=project,user` | — |
| FR116 | Users can search Skills with semantic search | T5-MCP §7.1 | 3.4.1 | `/api/v1/skills/search` | — |
| FR117 | Users can filter Skills by category, ratings, creator | T5-MCP §7.1 | 3.4.1 | `/api/v1/skills?category=...&rating=...` | — |
| FR118 | Users can view Skill details | T5-MCP §5.2 | 3.4.3 | `/api/v1/skills/{id}` | — |
| FR119 | Users can install Skills with one-click | T5-MCP §5.1 | 3.4.4 | `/api/v1/skills/{id}/install` | — |
| FR120 | Users can add Skill nodes to workflows | T5-MCP §5.3 | 1.3.1, 1.3.2 | `/api/v1/workflows/{id}/nodes` (type: skill) | AG-UI: `STATE_DELTA` |
| FR121 | System validates Skill frontmatter (SKILL.md YAML) | T5-MCP §6.2 | 3.4.5 | `/api/v1/skills/validate` | — |
| FR122 | System resolves Skill paths during execution | T5-MCP §5.3 | 1.6.1 | AgentOS: `/agents/{id}/runs` (skill resolution) | AG-UI: `TOOL_CALL_*` |
| FR123 | Users can create custom Skills (SKILL.md format) | T5-MCP §5.2 | 3.4.6 | `/api/v1/skills` (POST) | — |
| FR124 | Creators can publish Skills to marketplace | B2-MARKET | 3.4.7 | `/api/v1/skills/{id}/publish` | — |
| FR125 | Creators can set pricing for Skills | B2-MARKET §8 | 3.4.8 | `/api/v1/skills/{id}/pricing` | — |
| FR126 | System provides AI-assisted skill discovery | T5-MCP §5.4 | 3.4.9 | `/api/v1/skills/ai-suggest` | AG-UI: `TEXT_MESSAGE_*` |

#### 11. Agent Execution & Runtime (13 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR127 | System executes via Agno runtime with Claude | T0-RAG, T1-CLAUDE | 1.6.1 | AgentOS: `/agents/{id}/runs` | AG-UI: `RUN_*`, `STEP_*`, `TEXT_MESSAGE_*` |
| FR128 | System manages variable pools with namespace isolation | T1-VWB §7 | 1.6.2 | AgentOS: `/agents/{id}/runs/{runId}/variables` | AG-UI: `STATE_DELTA` |
| FR129 | System supports streaming via AG-UI (25 events) | T0-PROT | 1.6.3 | AgentOS: `/agui` (SSE) | AG-UI: all 25 event types |
| FR130 | System supports sync and async execution | T1-VWB §8 | 1.6.1 | AgentOS: `/agents/{id}/runs?async=true` | AG-UI: `RUN_*` |
| FR131 | Users can pause and resume workflows | T4-CMD §4 | 1.6.4 | AgentOS: `/agents/{id}/runs/{runId}/pause`, `/resume` | AG-UI: `ACTIVITY_DELTA` |
| FR132 | System enforces execution timeouts | T4-SEC §1 | 1.6.5 | AgentOS: `/agents/{id}/config` (timeout settings) | AG-UI: `RUN_ERROR` |
| FR133 | System detects and prevents infinite loops | T7-CANVAS §8.1 | 1.6.6 | AgentOS: `/agents/{id}/runs` (loop detection) | AG-UI: `RUN_ERROR` |
| FR134 | System supports scheduled/cron-based triggers | T8-GAPS §2 | 1.6.7 | `/api/v1/triggers/schedules` | AG-UI: `RUN_STARTED` |
| FR135 | System supports webhook-triggered execution (HMAC) | T6-INTEG §4 | 1.6.8 | `/api/v1/triggers/webhooks/{id}` | AG-UI: `RUN_STARTED` |
| FR136 | System provides event fan-out via Redis Pub/Sub | T6-INTEG §6 | 1.6.1 | (internal Redis Pub/Sub) | AG-UI: all events |
| FR137 | System uses PostgreSQL LISTEN/NOTIFY for sync | T6-INTEG §6 | 1.6.1 | (internal PostgreSQL NOTIFY) | — |
| FR138 | User code executes in sandboxed Firecracker MicroVMs | T4-SEC §1 | 1.6.9 | (internal execution engine) | AG-UI: `TOOL_CALL_*` |
| FR139 | System supports Dify-style "Workflow as Tool" | T6-INTEG §12 | 1.3.5 | AgentOS: `/a2a/agents/{id}/v1/message:send` | A2A: agent messaging |

#### 12. Observability & Monitoring (10 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR140 | Users can view detailed execution traces (Langfuse) | T4-OBS §2.3 | 1.7.1 | `/api/v1/observability/traces` | — |
| FR141 | Users can view LLM token usage and costs | T4-OBS §4 | 1.7.2 | `/api/v1/observability/llm-usage` | — |
| FR142 | Users can view aggregated cost analytics | T4-OBS §4 | 1.7.3 | `/api/v1/observability/costs` | — |
| FR143 | Users can configure budget alerts (80%, 100%) | T3-BILL §6 | 1.7.4 | `/api/v1/billing/alerts` | — |
| FR144 | Platform admins can view Command Center dashboard | T4-CMD §1-2 | 4.1.1 | `/api/v1/admin/command-center` | — |
| FR145 | Platform admins can view per-tenant consumption | T4-OBS §9 | 4.1.2 | `/api/v1/admin/tenants/{id}/usage` | — |
| FR146 | Platform admins can apply dynamic rate limiting | T4-SEC §3 | 4.1.3 | `/api/v1/admin/rate-limits` | — |
| FR147 | System generates Prometheus-compatible metrics | T4-OBS §6 | 4.1.4 | `/metrics` (Prometheus format) | — |
| FR148 | System maintains immutable audit logs (pgaudit) | T4-SEC §8 | 4.1.5 | `/api/v1/audit/logs` | — |
| FR149 | Users can export execution history | T4-OBS §8 | 1.7.5 | `/api/v1/observability/traces/export` | — |

#### 13. Human-in-the-Loop (6 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR150 | Users can configure approval gates | T4-CMD §3 | 1.8.1 | `/api/v1/hitl/gates` | — |
| FR151 | System queues HITL with AG-UI INTERRUPT events | T4-CMD §4 | 1.8.2 | `/api/v1/hitl/questions`, AgentOS: `/agui` | AG-UI: `TOOL_CALL_START` (AskUserQuestion) |
| FR152 | Users can view pending approvals | T4-CMD §3 | 1.8.3 | `/api/v1/hitl/pending` | — |
| FR153 | Users can approve/reject/modify HITL requests | T4-CMD §3 | 1.8.4 | `/api/v1/hitl/questions/{id}/respond` | AG-UI: `TOOL_CALL_RESULT` |
| FR154 | System resumes workflow upon resolution | T4-CMD §4 | 1.8.2 | AgentOS: `/agents/{id}/runs/{runId}/resume` | AG-UI: `STEP_STARTED` |
| FR155 | Users can configure escalation rules and timeouts | T4-CMD §3 | 1.8.5 | `/api/v1/hitl/escalation-rules` | — |

#### 14. Customer Interaction (10 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR156 | Users can deploy chatbots to Chatwoot inboxes | T4-CHAT §6 | 1.9.1 | `/api/v1/integrations/chatwoot/deploy` | — |
| FR157 | System receives messages via Agent Bot webhooks | T4-CHAT §4 | 1.9.2 | `/api/v1/integrations/webhooks/{channelId}` | AG-UI: `TEXT_MESSAGE_*` |
| FR158 | System queries project RAG for responses | T4-CHAT §11 | 1.9.3 | AgentOS: `/knowledge/search` | — |
| FR159 | Users can configure confidence thresholds | T4-CHAT §6 | 1.9.4 | `/api/v1/chatbots/{id}/confidence-config` | — |
| FR160 | System transfers context during human handoff | T4-CHAT §6 | 1.9.5 | `/api/v1/integrations/chatwoot/handoff` | — |
| FR161 | Users can configure multi-channel support | T4-CHAT §2 | 1.9.6 | `/api/v1/integrations/channels` | — |
| FR162 | System displays RAG confidence and citations | T4-EMBED §1 | 1.9.3 | AgentOS: `/knowledge/search` (citations in response) | — |
| FR163 | Users can embed custom React chat widgets | T4-EMBED §1-3 | 1.9.7 | `/api/v1/embed/chat-widget` | AG-UI: `TEXT_MESSAGE_*` |
| FR164 | System uses ActionCable WebSocket for real-time | T4-CHAT §2 | 1.9.2 | (ActionCable WebSocket) | — |
| FR165 | Users can configure proactive outbound messaging | T6-INTEG §6 | 1.9.8 | `/api/v1/chatbots/{id}/outbound` | — |

#### 15. Module/Workflow Marketplace (13 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR166 | Users can publish modules with versioning | B2-MARKET §8 | 3.1.1 | `/api/v1/marketplace/modules/{id}/publish` | — |
| FR167 | Users can set pricing (free, one-time, subscription) | B2-MARKET §3 | 3.1.2 | `/api/v1/marketplace/modules/{id}/pricing` | — |
| FR168 | System reviews and sandbox-tests before publishing | B2-MARKET §6 | 3.1.3 | `/api/v1/marketplace/modules/{id}/review` | — |
| FR169 | Users can browse with search, categories, filters | B2-MARKET §7 | 3.1.4 | `/api/v1/marketplace/modules` | — |
| FR170 | Users can view ratings, reviews, usage statistics | B2-MARKET §6 | 3.1.5 | `/api/v1/marketplace/modules/{id}/reviews` | — |
| FR171 | Users can install modules with one-click | B2-MARKET §7 | 3.1.6 | `/api/v1/marketplace/modules/{id}/install` | — |
| FR172 | System resolves module dependencies | B2-MARKET §8 | 3.1.7 | `/api/v1/marketplace/modules/{id}/dependencies` | — |
| FR173 | Creators receive 85% revenue (15% platform fee) | B2-MARKET §2 | 3.1.8 | `/api/v1/marketplace/payouts` | — |
| FR174 | Creators can view earnings and analytics | B2-MARKET §6 | 3.1.9 | `/api/v1/marketplace/creator/analytics` | — |
| FR175 | System provides 24-hour auto-refund for crashes | B2-MARKET §6 | 3.1.10 | `/api/v1/marketplace/refunds` | — |
| FR176 | System holds payments in 7-day escrow | B2-MARKET §4 | 3.1.8 | `/api/v1/marketplace/escrow` | — |
| FR177 | Users can fork and remix public modules | T7-CANVAS §10 | 3.1.11 | `/api/v1/marketplace/modules/{id}/fork` | — |
| FR178 | Users can create module bundles | B2-MARKET §8 | 3.1.12 | `/api/v1/marketplace/bundles` | — |

#### 16. UI Generation (8 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR179 | System generates UIs from workflow definitions | T3-UIGEN §6-7 | 2.2.1 | `/api/v1/ui-gen/generate` | A2UI: `BEGIN_RENDERING` |
| FR180 | System maps agent inputs to form components | T3-UIGEN §6 | 2.2.2 | `/api/v1/ui-gen/form-mapping` | A2UI: `SURFACE_UPDATE` |
| FR181 | System generates multi-step wizards | T3-UIGEN §7 | 2.2.3 | `/api/v1/ui-gen/wizard` | A2UI: `SURFACE_UPDATE` |
| FR182 | Users can customize UI themes (CSS variables) | T5-WHITE §1 | 2.2.4 | `/api/v1/ui-gen/themes` | — |
| FR183 | Users can embed UIs via iframe or Web Component | T3-UIGEN §10 | 2.2.5 | `/api/v1/embed/{workflowId}` | A2UI: `BEGIN_RENDERING` |
| FR184 | Generated UIs include embedded chat widgets | T4-EMBED | 2.2.6 | `/api/v1/embed/chat-widget` | AG-UI: `TEXT_MESSAGE_*` |
| FR185 | Generated UIs render using shadcn/ui | T3-UIGEN §4 | 2.2.1 | `/api/v1/ui-gen/components` | A2UI: `SURFACE_UPDATE` |
| FR186 | System provides REST/GraphQL API endpoints | T3-UIGEN §12 | 2.2.7 | `/api/v1/graphql`, `/api/v1/rest/*` | — |

#### 17. Billing & Usage (10 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR187 | System meters all AI usage to platform credits | T3-BILL §5 | 1.10.1 | `/api/v1/billing/usage/record` | — |
| FR188 | Users can view usage in dollar amounts | B3-PRICE §3 | 1.10.2 | `/api/v1/billing/usage` | — |
| FR189 | Users can view real-time usage widget | T4-CMD | 1.10.3 | `/api/v1/billing/usage/realtime` | — |
| FR190 | System supports tiered subscription plans | B3-PRICE §4 | 1.10.4 | `/api/v1/billing/subscriptions` | — |
| FR191 | System enforces soft warnings (80%) and hard caps (150%) | T3-BILL §6 | 1.10.5 | `/api/v1/billing/alerts` | — |
| FR192 | Users can configure hard cap vs. overage | T3-BILL §6 | 1.10.5 | `/api/v1/billing/settings` | — |
| FR193 | Users can view usage forecasts | T3-BILL §10 | 1.10.6 | `/api/v1/billing/forecast` | — |
| FR194 | Users can access self-serve billing portal | T3-BILL §1 | 1.10.7 | Stripe: Customer Portal | — |
| FR195 | System generates usage-based invoices | T3-BILL §1 | 1.10.8 | Stripe: `/v1/invoices` | — |
| FR196 | System supports Stripe Billing Meters | T3-BILL §1.4 | 1.10.1 | Stripe: `/v1/billing/meters` | — |

#### 18. Collaboration & Versioning (9 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR197 | Multiple users can edit simultaneously (Yjs CRDT) | T4-COLLAB §2 | 5.1.1 | `/api/v1/collab/sessions/{id}` (WebSocket) | (Yjs sync protocol) |
| FR198 | Users can see collaborator cursors and presence | T4-COLLAB §5 | 5.1.2 | `/api/v1/collab/sessions/{id}/presence` | (Yjs awareness) |
| FR199 | System maintains workflow version history | T4-VER §2 | 5.2.1 | `/api/v1/workflows/{id}/versions` | — |
| FR200 | Users can view visual diffs (jsondiffpatch) | T4-VER §3 | 5.2.2 | `/api/v1/workflows/{id}/versions/diff` | — |
| FR201 | Users can rollback to any previous version | T4-VER §2 | 5.2.3 | `/api/v1/workflows/{id}/versions/{versionId}/rollback` | — |
| FR202 | Users can add comments for discussion | T4-COLLAB §4 | 5.1.3 | `/api/v1/workflows/{id}/comments` | — |
| FR203 | Users can configure A/B testing (Bayesian) | T4-VER §4 | 5.2.4 | `/api/v1/workflows/{id}/ab-tests` | — |
| FR204 | Users can set up promotion pipelines | T4-VER §6 | 5.2.5 | `/api/v1/workflows/{id}/promotions` | — |
| FR205 | Users can configure feature flags (LaunchDarkly) | T4-VER §6 | 5.2.6 | `/api/v1/settings/feature-flags` | — |

#### 19. White-Label & Agency (8 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR206 | Agencies can create sub-accounts for clients | T8-UI §1 | 4.2.1 | `/api/v1/agency/clients` | — |
| FR207 | Agencies can view per-client usage breakdown | T5-WHITE §5 | 4.2.2 | `/api/v1/agency/clients/{id}/usage` | — |
| FR208 | Agencies can configure markup margins | T3-BILL §7 | 4.2.3 | `/api/v1/agency/billing/markup` | — |
| FR209 | Agencies can white-label invoices | T5-WHITE §4 | 4.2.4 | `/api/v1/agency/billing/invoice-branding` | — |
| FR210 | Users can configure custom domains | T5-WHITE §3 | 4.2.5 | `/api/v1/white-label/domains` | — |
| FR211 | Users can customize branding (logo, colors, fonts) | T5-WHITE §2 | 4.2.6 | `/api/v1/white-label/themes` | — |
| FR212 | Users can configure custom email domains | T5-WHITE §4 | 4.2.7 | `/api/v1/white-label/email-domains` | — |
| FR213 | White-label supports custom SSO | T5-SSO | 4.2.8 | `/api/v1/white-label/sso` | — |

#### 20. Enterprise & Security (11 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR214 | System provides SOC 2 Type II documentation | T4-SEC §8 | 4.3.1 | `/api/v1/compliance/soc2` | — |
| FR215 | System supports GDPR data subject requests | T4-SEC §8 | 4.3.2 | `/api/v1/users/me/data-export`, `/delete` | — |
| FR216 | System supports data residency requirements | T4-SEC §8 | 4.3.3 | `/api/v1/settings/data-residency` | — |
| FR217 | System applies NeMo Guardrails for prompt injection | T4-SEC §2 | 4.3.4 | AgentOS: `/agents/{id}/config` (guardrails) | — |
| FR218 | System sanitizes inputs and filters outputs | T4-SEC §2 | 4.3.4 | (input/output middleware) | — |
| FR219 | System enforces content moderation (no NSFW) | T4-SEC §2 | 4.3.5 | `/api/v1/moderation/check` | — |
| FR220 | System provides AI hallucination mitigation via RAG | T0-RAG | 1.4.8 | AgentOS: `/knowledge/search` (grounding) | — |
| FR221 | All user code executes in Firecracker MicroVMs | T4-SEC §1 | 4.3.6 | (internal execution engine) | — |
| FR222 | System enforces rate limiting at API gateway | T4-SEC §3 | 4.3.7 | (API gateway middleware) | — |
| FR223 | System provides DDoS protection via WAF | T4-SEC §3 | 4.3.7 | (WAF infrastructure) | — |
| FR224 | Voice agents limited to pre-approved actions | T4-SEC §6 | 1.5.7 | `/api/v1/voice-agents/{id}/allowed-actions` | — |

#### 21. Self-Hosted Deployment (8 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR225 | Users can deploy via Docker Compose | T5-DEPLOY §1 | 4.4.1 | (Docker Compose config) | — |
| FR226 | Users can deploy via Helm charts for K8s | T5-DEPLOY §2 | 4.4.2 | (Helm chart values) | — |
| FR227 | Users can configure external PostgreSQL | T5-DEPLOY §1-2 | 4.4.3 | (environment variables) | — |
| FR228 | Users can configure external Redis | T5-DEPLOY §1-2 | 4.4.3 | (environment variables) | — |
| FR229 | Users can configure custom LLM endpoints (BYOM) | T5-DEPLOY §8 | 4.4.4 | `/api/v1/settings/llm-providers` | — |
| FR230 | Self-hosted supports air-gapped installation | T5-DEPLOY §3 | 4.4.5 | (Harbor registry) | — |
| FR231 | Self-hosted supports internal SSO providers | T5-SSO | 4.4.6 | `/api/v1/auth/sso/custom` | — |
| FR232 | Users can configure Velero for backup/DR | T5-DEPLOY §8 | 4.4.7 | (Velero schedule config) | — |

#### 22. API & SDK Export (10 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR233 | Users can export as Claude Agent SDK code | T1-FRAME §5-6 | 2.3.1 | `/api/v1/workflows/{id}/export?format=claude-sdk` | — |
| FR234 | Users can export as Agno framework code | T1-FRAME §5-6 | 2.3.2 | `/api/v1/workflows/{id}/export?format=agno` | — |
| FR235 | Users can export as LangGraph adapter code | T1-FRAME §5-6 | 2.3.3 | `/api/v1/workflows/{id}/export?format=langgraph` | — |
| FR236 | Users can export as CrewAI adapter code | T1-FRAME §5-6 | 2.3.4 | `/api/v1/workflows/{id}/export?format=crewai` | — |
| FR237 | System provides REST API with OpenAPI spec | T3-UIGEN §12 | 2.3.5 | `/api/docs`, `openapi.yaml` | — |
| FR238 | System provides GraphQL API | T3-UIGEN §12 | 2.3.5 | `/api/v1/graphql` | — |
| FR239 | System provides SSE streaming endpoints | T0-PROT | 2.3.6 | AgentOS: `/agui` (SSE) | AG-UI: all 25 event types |
| FR240 | System provides iOS, Android, JS, Python SDKs | T8-GAPS §3 | 2.3.7 | `/api/v1/sdk/*` | — |
| FR241 | API responses include rate limit headers | T4-SEC §3 | 2.3.5 | (all endpoints via headers) | — |
| FR242 | Users can configure scoped API keys | T8-UI §5 | 1.10.9 | `/api/v1/settings/api-keys` | — |

#### 23. Cross-Builder Integration (6 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR243 | Module workflows callable from Chatbots (<500ms) | T6-INTEG §11-12 | 1.3.5 | AgentOS: `/a2a/agents/{id}/v1/message:send` | A2A: agent discovery, messaging |
| FR244 | Voice agents can call Modules via gRPC (<50ms) | T6-INTEG §6 | 1.5.5 | (gRPC bidirectional stream) | A2A: agent messaging |
| FR245 | Canvas can be triggered by Chatbot/Voice events | T6-INTEG, T7-CANVAS §7 | 2.1.1 | AgentOS: `/a2a/agents/{id}/v1/message:send` | A2A: agent messaging |
| FR246 | All builders share same project RAG context | T0-RAG | 1.4.1 | AgentOS: `/knowledge/bases/{id}` (project-scoped) | — |
| FR247 | State changes propagate via PostgreSQL NOTIFY (<10ms) | T6-INTEG §6 | 1.6.1 | (internal PostgreSQL NOTIFY) | — |
| FR248 | Events fan out via Redis Pub/Sub (<200ms) | T6-INTEG §6 | 1.6.1 | (internal Redis Pub/Sub) | AG-UI: all events |

### Functional Requirements Summary

| Capability Area | FR Count |
|-----------------|----------|
| Account & Identity | 7 |
| Workspace & Project | 9 |
| Module Builder | 15 |
| Conversational Building | 7 |
| Chatbot Builder | 15 |
| Voice Agent Builder | 15 |
| Canvas Builder | 17 |
| Knowledge Base (RAG) | 14 |
| MCP Server Marketplace | 14 |
| Skills Marketplace | 13 |
| Execution & Runtime | 13 |
| Observability | 10 |
| HITL | 6 |
| Customer Interaction | 10 |
| Module Marketplace | 13 |
| UI Generation | 8 |
| Billing & Usage | 10 |
| Collaboration & Versioning | 9 |
| White-Label & Agency | 8 |
| Enterprise & Security | 11 |
| Self-Hosted | 8 |
| API & SDK Export | 10 |
| Cross-Builder Integration | 6 |
| **TOTAL** | **248** |

---

### Non-Functional Requirements (70 Total)

#### NFR-PERF: Performance Requirements (13)
| ID | Requirement | Target | Source | API Endpoint | Protocol Event |
|----|-------------|--------|--------|--------------|----------------|
| NFR-PERF-01 | Voice agent end-to-end latency (STT → LLM → TTS) | < 500ms | T6-VOICE, ARCH | (gRPC bidirectional stream) | AG-UI: `TEXT_MESSAGE_*` |
| NFR-PERF-02 | API response time for synchronous requests | < 100ms p95 | ARCH, T6-INTEG | All `/api/v1/*` endpoints | — |
| NFR-PERF-03 | PostgreSQL LISTEN/NOTIFY propagation | < 10ms | ARCH | (internal backend) | — |
| NFR-PERF-04 | Redis Pub/Sub event delivery | < 200ms | ARCH | (internal backend) | — |
| NFR-PERF-05 | gRPC bidirectional stream latency (Voice ↔ Module) | < 50ms | ARCH, T6-INTEG | AgentOS: `/a2a/agents/{id}/v1/message:stream` | A2A: agent messaging |
| NFR-PERF-06 | Module workflow internal call latency | < 500ms | ARCH | AgentOS: `/a2a/agents/{id}/v1/message:send` | A2A: agent messaging |
| NFR-PERF-07 | Firecracker MicroVM cold start | < 125ms | T4-SEC | (internal execution engine) | — |
| NFR-PERF-08 | ReactFlow canvas interaction responsiveness | < 50ms input lag | T1-VWB | (frontend state) | — |
| NFR-PERF-09 | Knowledge base vector search (pgvector) | < 100ms for 1M vectors | T0-RAG | AgentOS: `/knowledge/search` | — |
| NFR-PERF-10 | Chatbot webhook processing | < 2 seconds round-trip | T6-INTEG | `/api/v1/integrations/webhooks/{channelId}` | AG-UI: `RUN_STARTED`, `RUN_FINISHED` |
| NFR-PERF-11 | Canvas DAG execution overhead per node | < 50ms | T7-CANVAS | AgentOS: `/agents/{id}/runs` | AG-UI: `STEP_STARTED`, `STEP_FINISHED` |
| NFR-PERF-12 | Real-time collaboration sync (Yjs) | < 100ms for cursor updates | T4-COLLAB | `/api/v1/collab/sessions/{id}` (WebSocket) | (Yjs awareness protocol) |
| NFR-PERF-13 | VAD (Silero) processing latency | < 1ms per audio chunk | T6-VOICE | (internal audio processing) | — |

#### NFR-SEC: Security Requirements (14)
| ID | Requirement | Target | Source | API Endpoint | Protocol Event |
|----|-------------|--------|--------|--------------|----------------|
| NFR-SEC-01 | Code execution isolation for untrusted code | Firecracker MicroVMs with hardware-level KVM isolation | T4-SEC | (internal execution engine) | — |
| NFR-SEC-02 | Multi-tenant data isolation | Row-Level Security (RLS) with JWT org_id claims | T1-SAAS, ARCH | (all endpoints via JWT claims) | — |
| NFR-SEC-03 | Enterprise database isolation | Neon per-tenant databases for Enterprise tier | T1-SAAS | (internal DB routing) | — |
| NFR-SEC-04 | AI safety guardrails | NeMo Guardrails for prompt injection prevention | T4-SEC | AgentOS: `/agents/{id}/config` | — |
| NFR-SEC-05 | Encryption at rest | AES-256 for all stored data | T4-SEC | (infrastructure) | — |
| NFR-SEC-06 | Encryption in transit | TLS 1.3 minimum | T4-SEC | (infrastructure) | — |
| NFR-SEC-07 | Secrets management | Infisical or HashiCorp Vault integration | T5-DEPLOY | `/api/v1/settings/secrets` | — |
| NFR-SEC-08 | MCP tool allowlisting | Human-in-the-loop approval for sensitive tools | T4-SEC, T5-MCP | `/api/v1/mcp/registry/tools/{id}/consent` | AG-UI: `TOOL_CALL_START`, `TOOL_CALL_RESULT` |
| NFR-SEC-09 | API key scoping | Per-project, per-capability scoped API keys | T8-UI | `/api/v1/settings/api-keys` | — |
| NFR-SEC-10 | Container security | gVisor (runsc) for medium-risk code, Docker hardening for low-risk | T4-SEC | (internal execution engine) | — |
| NFR-SEC-11 | Supply chain security | SBOM generation, Sigstore image signing | T5-DEPLOY | (CI/CD pipeline) | — |
| NFR-SEC-12 | Audit logging | Immutable audit trail for all sensitive operations | T4-SEC | `/api/v1/audit/logs` | — |
| NFR-SEC-13 | Vector database security | OWASP LLM08 controls for embedding protection | T4-SEC | AgentOS: `/knowledge/*` | — |
| NFR-SEC-14 | Cross-agent security | Trust boundary enforcement between agents | T4-SEC | AgentOS: `/a2a/agents/{id}/v1/message:send` | A2A: agent messaging with trust claims |

#### NFR-SCALE: Scalability Requirements (9)
| ID | Requirement | Target | Source | API Endpoint | Protocol Event |
|----|-------------|--------|--------|--------------|----------------|
| NFR-SCALE-01 | Tenant capacity Year 1 | 10,000 active tenants | MP | (infrastructure capacity) | — |
| NFR-SCALE-02 | Tenant capacity Year 3 | 100,000 active tenants | MP | (infrastructure capacity) | — |
| NFR-SCALE-03 | Horizontal pod autoscaling | 10x traffic spikes within 2 minutes | T5-DEPLOY | (Kubernetes HPA) | — |
| NFR-SCALE-04 | Database connection pooling | 1,000 concurrent connections via PgBouncer | T1-SAAS | (infrastructure) | — |
| NFR-SCALE-05 | Message queue throughput | 100,000 events/second (Redis Streams → NATS at scale) | ARCH | (internal event bus) | AG-UI: all event types |
| NFR-SCALE-06 | Vector database scaling | HNSW indexes for billion-scale embeddings | T0-RAG | AgentOS: `/knowledge/search` | — |
| NFR-SCALE-07 | CDN edge caching | 95% cache hit rate for static assets | T8-GAPS | (CDN infrastructure) | — |
| NFR-SCALE-08 | API rate limiting | Tiered limits (Free: 60/min, Pro: 600/min, Enterprise: custom) | T8-GAPS | All `/api/v1/*` endpoints | — |
| NFR-SCALE-09 | Workflow concurrent executions | 1,000 per tenant for Enterprise tier | ARCH | AgentOS: `/agents/{id}/runs` | AG-UI: `RUN_STARTED`, `RUN_FINISHED` |

#### NFR-REL: Reliability Requirements (8)
| ID | Requirement | Target | Source | API Endpoint | Protocol Event |
|----|-------------|--------|--------|--------------|----------------|
| NFR-REL-01 | Platform uptime SLA | 99.9% (Free/Pro), 99.95% (Enterprise) | B3-PRICE | All endpoints | — |
| NFR-REL-02 | Recovery Time Objective (RTO) | 4 hours (standard), 1 hour (Enterprise) | T5-DEPLOY | (infrastructure/DR) | — |
| NFR-REL-03 | Recovery Point Objective (RPO) | 1 hour (standard), 15 minutes (Enterprise) | T5-DEPLOY | (infrastructure/DR) | — |
| NFR-REL-04 | Database backup frequency | Continuous WAL streaming + daily snapshots | T5-DEPLOY | (infrastructure) | — |
| NFR-REL-05 | Multi-region failover | Active-passive with 15-minute failover | T5-DEPLOY | (infrastructure/DR) | — |
| NFR-REL-06 | Circuit breaker patterns | Resilience4j for external service calls | T6-INTEG | All external API calls | AG-UI: `RUN_ERROR` |
| NFR-REL-07 | Graceful degradation | Core functionality during partial outages | ARCH | All endpoints (fallback mode) | AG-UI: `RUN_ERROR` |
| NFR-REL-08 | Data durability | 99.999999999% (11 nines) for S3-stored assets | T5-DEPLOY | `/api/v1/assets/*` | — |

#### NFR-ACC: Accessibility Requirements (5)
| ID | Requirement | Target | Source | API Endpoint | Protocol Event |
|----|-------------|--------|--------|--------------|----------------|
| NFR-ACC-01 | WCAG compliance | Level AA for all platform UI | T8-UI | (frontend implementation) | — |
| NFR-ACC-02 | Color contrast validation | Automated WCAG contrast checks in theme system | T5-WHITE | `/api/v1/white-label/themes` | — |
| NFR-ACC-03 | Keyboard navigation | Full keyboard accessibility for visual builders | T1-VWB | (frontend implementation) | — |
| NFR-ACC-04 | Screen reader support | ARIA labels for ReactFlow nodes and controls | T1-VWB | (frontend implementation) | — |
| NFR-ACC-05 | Voice agent accessibility | Visual feedback for voice status and transcripts | T6-VOICE | (frontend) | AG-UI: `TEXT_MESSAGE_*`, `ACTIVITY_*` |

#### NFR-INT: Integration Requirements (10)
| ID | Requirement | Target | Source | API Endpoint | Protocol Event |
|----|-------------|--------|--------|--------------|----------------|
| NFR-INT-01 | A2UI protocol compliance | v0.8 full implementation | T0-PROT | AgentOS: `/agui` (SSE) | A2UI: `BEGIN_RENDERING`, `SURFACE_UPDATE`, `DATA_MODEL_UPDATE` |
| NFR-INT-02 | AG-UI protocol compliance | 25 event types, SSE + HTTP POST | T0-PROT | AgentOS: `/agui` (SSE) | AG-UI: all 25 event types |
| NFR-INT-03 | MCP protocol compliance | 2025-11-25 spec with Tasks primitive | T5-MCP | `/api/v1/mcp/registry/*`, AgentOS: `/mcp/*` | AG-UI: `TOOL_CALL_*` |
| NFR-INT-04 | A2A protocol compliance | v0.3.0 schema for multi-agent | T6-INTEG | AgentOS: `/a2a/agents/{id}/.well-known/agent-card.json`, `/a2a/agents/{id}/v1/message:*` | A2A: discovery + messaging |
| NFR-INT-05 | OAuth 2.1 compliance | For all external integrations | T5-SSO | `/api/v1/integrations/oauth/authorize`, `/callback`, `/token` | — |
| NFR-INT-06 | OpenAPI specification | 3.1.0 for all REST endpoints | ARCH | `/api/docs` (Swagger UI) | — |
| NFR-INT-07 | Webhook signature verification | HMAC-SHA256 for all webhooks | T6-INTEG | `/api/v1/integrations/webhooks/{channelId}` | — |
| NFR-INT-08 | SAML 2.0 support | For Enterprise SSO via WorkOS | T5-SSO | `/api/v1/auth/saml/*` (via WorkOS) | — |
| NFR-INT-09 | SCIM 2.0 support | For directory sync via WorkOS | T5-SSO | `/api/v1/auth/scim/*` (via WorkOS) | — |
| NFR-INT-10 | Chatwoot API compatibility | v1 API with Agent Bots | T4-CHAT | `/api/v1/integrations/chatwoot/*` | AG-UI: `TEXT_MESSAGE_*` |

#### NFR-OBS: Observability Requirements (9)
| ID | Requirement | Target | Source | API Endpoint | Protocol Event |
|----|-------------|--------|--------|--------------|----------------|
| NFR-OBS-01 | Distributed tracing | OpenTelemetry + Langfuse (self-hosted) | T4-OBS | `/api/v1/observability/traces` | AG-UI: `RUN_*`, `STEP_*` (trace IDs) |
| NFR-OBS-02 | Trace retention | 14 days (standard), 400 days (Enterprise) | T4-OBS | `/api/v1/observability/traces` | — |
| NFR-OBS-03 | Cost attribution | Per-tenant, per-workflow token tracking | T4-OBS, T3-BILL | `/api/v1/billing/usage`, `/api/v1/observability/costs` | — |
| NFR-OBS-04 | Metrics collection | Prometheus with Grafana dashboards | T4-OBS | `/metrics` (Prometheus format) | — |
| NFR-OBS-05 | Log aggregation | Loki or ELK stack with tenant isolation | T4-OBS | `/api/v1/observability/logs` | — |
| NFR-OBS-06 | Alerting | PagerDuty/Slack integration for critical alerts | T4-OBS | `/api/v1/observability/alerts` | — |
| NFR-OBS-07 | LLM-specific monitoring | Latency, token usage, error rates per model | T4-OBS | `/api/v1/observability/llm-metrics` | AG-UI: `TOOL_CALL_*` (LLM calls) |
| NFR-OBS-08 | Agent replay capability | Full execution replay for debugging | T4-OBS | AgentOS: `/agents/{id}/runs/{runId}/replay` | AG-UI: all events (stored for replay) |
| NFR-OBS-09 | Real-time cost tracking | Dashboard with usage alerts at 80%/100% thresholds | T3-BILL | `/api/v1/billing/usage/realtime` | — |

#### NFR-MAINT: Maintainability Requirements (9)
| ID | Requirement | Target | Source | API Endpoint | Protocol Event |
|----|-------------|--------|--------|--------------|----------------|
| NFR-MAINT-01 | CI/CD pipeline | GitHub Actions with matrix builds for multi-arch | T8-GAPS | (CI/CD infrastructure) | — |
| NFR-MAINT-02 | Test coverage | 80% unit test coverage, E2E for critical paths | T8-GAPS | (testing infrastructure) | — |
| NFR-MAINT-03 | E2E testing framework | Playwright for cross-browser testing | T8-GAPS | (testing infrastructure) | — |
| NFR-MAINT-04 | GitOps deployment | ArgoCD or Flux for Kubernetes deployments | T5-DEPLOY | (deployment infrastructure) | — |
| NFR-MAINT-05 | Infrastructure as Code | Terraform modules for AWS/GCP/Azure | T5-DEPLOY | (IaC infrastructure) | — |
| NFR-MAINT-06 | Container image updates | Automated security patching via Renovate | T5-DEPLOY | (CI/CD infrastructure) | — |
| NFR-MAINT-07 | API versioning | Semantic versioning with 12-month deprecation notice | ARCH | All `/api/v1/*` endpoints | — |
| NFR-MAINT-08 | Feature flags | LaunchDarkly for per-tenant feature control | T8-UI | `/api/v1/settings/feature-flags` | — |
| NFR-MAINT-09 | Documentation | OpenAPI docs, architecture decision records | ARCH | `/api/docs` (Swagger), `openapi.yaml` | — |

#### NFR-COMP: Compliance Requirements (7)
| ID | Requirement | Target | Source | API Endpoint | Protocol Event |
|----|-------------|--------|--------|--------------|----------------|
| NFR-COMP-01 | SOC 2 Type II | Full compliance by Year 2 | T4-SEC | `/api/v1/audit/logs` | — |
| NFR-COMP-02 | GDPR | Data residency, right to deletion, DPA | T4-SEC | `/api/v1/users/me/data-export`, `/api/v1/users/me/delete` | — |
| NFR-COMP-03 | EU AI Act | Compliance by August 2026 enforcement | T4-SEC | (AI transparency documentation) | — |
| NFR-COMP-04 | HIPAA | BAA available for healthcare customers | T4-SEC | (BAA contract process) | — |
| NFR-COMP-05 | Air-gapped deployment | Harbor registry for isolated environments | T5-DEPLOY | (self-hosted installation) | — |
| NFR-COMP-06 | Data sovereignty | Region-specific deployment options | T5-DEPLOY | `/api/v1/settings/data-residency` | — |
| NFR-COMP-07 | Audit trail retention | 7 years for compliance logs | T4-SEC | `/api/v1/audit/logs` | — |

### NFR Summary

| Category | Count |
|----------|-------|
| Performance (NFR-PERF) | 13 |
| Security (NFR-SEC) | 14 |
| Scalability (NFR-SCALE) | 9 |
| Reliability (NFR-REL) | 8 |
| Accessibility (NFR-ACC) | 5 |
| Integration (NFR-INT) | 10 |
| Observability (NFR-OBS) | 9 |
| Maintainability (NFR-MAINT) | 9 |
| Compliance (NFR-COMP) | 7 |
| **TOTAL** | **70** |

---

### Additional Requirements (from Architecture & UX)

#### Architecture Decision Records (ADRs)
| ADR | Title | Status | Impact |
|-----|-------|--------|--------|
| ADR-001 | Agent Memory Architecture | VALIDATED | Tiered memory (Redis session + PostgreSQL persistent) |
| ADR-002 | Cross-Agent Context Sharing | VALIDATED | A2A Protocol + shared context table |
| ADR-003 | Undo/Redo Service | VALIDATED | CheckpointManager + Yjs UndoManager |
| ADR-004 | DCRL Pattern Backend | VALIDATED | State machine in agent orchestration |

#### Technical Requirements from Architecture
- **Starter Template**: Next.js 15 + React 19 + TypeScript (greenfield project)
- **Protocol Stack Implementation**: A2UI v0.8, AG-UI (25 events), MCP 2025-11-25, A2A v0.3.0
- **5 Real-Time Channels**: Yjs WebSocket, AG-UI SSE, PostgreSQL NOTIFY, Redis Pub/Sub, gRPC
- **Multi-tenancy Model**: 3 levels (Workspace, Client sub-account, Enterprise isolation)
- **Circuit Breaker Configuration**: maxRetries=3, baseDelayMs=1000, backoffMultiplier=2, failureThreshold=5

#### UX Implementation Requirements
- **146 Screens** across 6 phases with full wireframe specifications
- **9 AG-UI Integration Screens** with dynamic AGENT_CONTENT_ZONE markers
- **4 BMB Agents**: Bond (Module), Wendy (Chatbot), Morgan (Voice), Artie (Canvas)
- **DCRL Confidence Thresholds**: AUTO_EXECUTE=0.85, CLARIFY=0.60, SUGGEST=0.0
- **Agent Emotional Intelligence**: Personality engine with tone adaptation

#### Project Context Implementation Rules (85 Rules)
- Strict TypeScript with Zod validation at boundaries
- Server Components by default, 'use client' only when needed
- Zustand with selectors (never select entire store)
- shadcn/ui components from @/components/ui
- tRPC for API layer with React Query patterns
- Supabase RLS for all multi-tenant queries
- Circuit breakers for all external service calls
- Co-located tests with source files

---

### FR Coverage Map

| FR Range | Epic | Capability Area |
|----------|------|-----------------|
| FR1-FR4 | E1.1 | Account & Identity |
| FR5-FR7 | E1.2 | API Key Management |
| FR8-FR16 | E1.3 | Workspace & Project |
| FR17, FR24, FR26-FR28, FR30-FR31 | E1.4 | Module Builder Core |
| FR18-FR23, FR25, FR29 | E1.5 | Module Builder Nodes |
| FR32-FR38 | E1.6 | Conversational Building |
| FR39-FR46 | E1.7 | Chatbot Builder Core |
| FR47-FR53 | E1.8 | Chatbot NLU & Policies |
| FR86-FR88 | E1.9 | KB Document Ingestion |
| FR89-FR92, FR95, FR98 | E1.10 | KB Search & Retrieval |
| FR93-FR94, FR96-FR97, FR99 | E1.11 | KB Advanced Retrieval |
| FR127-FR133 | E1.12 | Execution Runtime |
| FR134-FR137 | E1.13 | Execution Triggers |
| FR138-FR139 | E1.14 | Sandbox Execution |
| FR140-FR142, FR149 | E1.15 | Observability |
| FR143, FR187-FR189 | E1.16 | Budget & Cost |
| FR150-FR155 | E1.17 | HITL |
| FR54-FR58 | E2.1 | Voice Core Editor |
| FR59-FR64, FR67-FR68 | E2.2 | Voice Speech Processing |
| FR65-FR66 | E2.3 | Voice Telephony |
| FR69, FR71, FR73, FR76-FR78 | E2.4 | Canvas Core Editor |
| FR70, FR72, FR74-FR75, FR79, FR81-FR82 | E2.5 | Canvas Generation Nodes |
| FR80, FR83-FR85 | E2.6 | Canvas Brand & Providers |
| FR243-FR248 | E2.7 | Cross-Builder Integration |
| FR100-FR108 | E2.8 | MCP Installation |
| FR109-FR110, FR113 | E2.9 | MCP Registry |
| FR114-FR122 | E2.10 | Skills Installation |
| FR123-FR126 | E2.11 | Skills Creation |
| FR179-FR186 | E2.12 | UI Generation |
| FR156-FR165 | E2.13 | Customer Interaction |
| FR169-FR170 | E3.1 | Marketplace Browse |
| FR171-FR172, FR177 | E3.2 | Marketplace Install |
| FR166, FR168 | E3.3 | Module Publishing |
| FR167, FR173, FR175-FR176 | E3.4 | Module Pricing |
| FR174, FR178 | E3.5 | Creator Analytics |
| FR111-FR112 | E3.6 | MCP Publishing |
| FR190, FR194-FR196 | E3.7 | Subscription Plans |
| FR191-FR193 | E3.8 | Usage Management |
| FR144-FR148 | E3.9 | Command Center |
| FR217-FR220 | E4.1 | Security Guardrails |
| FR221-FR224 | E4.2 | Enterprise Security |
| FR214-FR216 | E4.3 | SOC 2 & Compliance |
| FR206-FR209 | E4.4 | White-Label Sub-Accounts |
| FR210-FR213 | E4.5 | White-Label Branding |
| FR225, FR227-FR228 | E4.6 | Self-Hosted Docker |
| FR226, FR229-FR232 | E4.7 | Self-Hosted K8s |
| FR197-FR198 | E5.1 | Real-Time Collaboration |
| FR202 | E5.2 | Comments & Discussion |
| FR199, FR201 | E5.3 | Version History |
| FR200 | E5.4 | Visual Diffs |
| FR203 | E5.5 | A/B Testing |
| FR204-FR205 | E5.6 | Promotion Pipelines |
| FR233 | E6.1 | SDK Export Claude |
| FR234 | E6.2 | SDK Export Agno |
| FR235-FR236 | E6.3 | SDK Export LangGraph/CrewAI |
| FR237-FR239, FR241 | E6.4 | API Endpoints |
| FR240, FR242 | E6.5 | Mobile SDKs |

---

## Epic List

**58 Epics across 7 Phases** - All 248 FRs mapped with screen references and research sources.

---

### PHASE 0: PROJECT INFRASTRUCTURE (2 Epics) - Foundation Setup

#### Epic E0.1: Project Foundation & Infrastructure Setup (Backend)
**User Outcome:** Development team has a fully configured monorepo with all dependencies, services, and tooling ready for feature development

**Why This Epic First:**
- All other epics assume project infrastructure exists
- Dependencies must be installed before any feature code
- Database schemas, auth, and API layer are prerequisites for all Phase 1 stories
- Establishes project patterns and conventions that all agents must follow

**Technology Stack (from project-context.md & Architecture):**

| Category | Packages | Purpose |
|----------|----------|---------|
| **Core Framework** | next@15.5.8, react@19.x, typescript@5.x | App foundation |
| **Build & Monorepo** | turbo, pnpm | Workspace management |
| **Styling** | tailwindcss@4.x | Utility-first CSS |
| **Validation** | zod@4.0.1 | Schema validation |
| **State Management** | zustand@5.0.8, immer | Client state |
| **UI Components** | shadcn@3.5.0, @radix-ui/* | Design system |
| **Visual Builder** | @xyflow/react@12.10.0 | Node-based canvas |
| **Authentication** | @clerk/nextjs@6.35.5 | Consumer auth |
| **Database** | @supabase/supabase-js@2.87.0, @supabase/ssr | PostgreSQL + RLS |
| **Caching** | redis | Session & pub/sub |
| **API Layer** | @trpc/server@11.8.0, @trpc/client, @trpc/react-query, @trpc/next, @tanstack/react-query | Type-safe API |
| **Protocol Stack** | @copilotkit/react-ui, @copilotkit/react-core, @copilotkit/runtime, @ag-ui/client, @ag-ui/agno | Agent protocols |
| **Agent Framework** | agno@2.4.0, fastapi, uvicorn | Python agent backend |
| **LLM Integration** | @anthropic-ai/sdk, anthropic (Python) | Claude API |
| **Tool Protocol** | MCP SDK (@platform/mcp) | Model Context Protocol |
| **Collaboration** | yjs@14.0.0, y-websocket, y-indexeddb | Real-time CRDT |
| **Observability** | langfuse@3.148.0, @langfuse/core@4.4.0, @opentelemetry/* | Tracing & monitoring |
| **Payments** | stripe@20.0.0 | Billing |
| **Email** | resend, @react-email/* | Transactional email |
| **Workflows** | @temporalio/client, @temporalio/worker, @temporalio/workflow, temporalio (Python) | Orchestration |
| **Testing** | vitest@4.0.x, @playwright/test@1.51.0, @testing-library/react | Quality assurance |
| **Dev Environment** | docker-compose, supabase CLI | Local development |

**External Services Required:**
- Supabase project (PostgreSQL + Auth + Realtime + Storage)
- Clerk application (consumer auth)
- Redis instance (Upstash or self-hosted)
- Stripe account (billing)
- Langfuse instance (self-hosted for observability)
- Resend account (transactional email)
- Temporal Cloud or self-hosted (workflow orchestration)
- Anthropic API key (Claude LLM)

**NFRs:** NFR-MAINT-01, NFR-MAINT-02, NFR-MAINT-03, NFR-SEC-07

---

#### Epic E0.2: Frontend Foundation & Design System
**User Outcome:** Complete UI layer built from 146 Stitch wireframes, enabling parallel frontend development while backend infrastructure completes

**Why This Epic:**
- Enables parallel frontend development while backend infrastructure (0-1-17 through 0-1-23) completes
- 146 wireframes are ready with complete HTML/Tailwind CSS in `Stitch Hyyve/`
- Frontend can use mock data and AG-UI event mocks
- Reduces integration time when backend is ready
- Design system extraction ensures visual consistency

**Key Deliverables:**
| Story | Deliverable | Wireframe Source |
|-------|-------------|------------------|
| 0.2.1 | Design tokens in Tailwind config | All wireframes (common theme) |
| 0.2.2 | shadcn/ui component overrides | All wireframes |
| 0.2.3 | Layout shells (App, Builder, Auth) | Module Builder, Login |
| 0.2.4 | Navigation components | Module Builder header/sidebar |
| 0.2.5 | Agent chat component | Module Builder right panel |
| 0.2.6 | Flow canvas base (@xyflow) | Module Builder center canvas |
| 0.2.7 | AG-UI mock provider | protocol-events.yaml |
| 0.2.8 | Auth pages (Clerk UI) | 1.1.1, 1.1.2 |
| 0.2.9 | Dashboard & project browser | 1.5.1, 1.5.2 |
| 0.2.10 | Settings pages | 1.10.1-1.10.4 |
| 0.2.11 | Module Builder UI shell | hyyve_module_builder |
| 0.2.12 | Chatbot Builder UI shell | chatbot_builder_main |
| 0.2.13 | Knowledge Base UI | 1.4.1-1.4.8 |
| 0.2.14 | Observability dashboard UI | 1.7.1-1.7.5 |
| 0.2.15 | Storybook visual regression | All components |

**NFRs:** NFR-MAINT-01, NFR-MAINT-02, NFR-PERF-01

---

### PHASE 1: FOUNDATION (17 Epics) - 127 FRs

#### Epic E1.1: User Authentication & Identity
**User Outcome:** Users can create accounts, login securely, and enable multi-factor authentication

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR1 | Account creation via email/password or social | 1.1.1, 1.1.2 | T5-SSO, T1-SAAS |
| FR2 | Multi-factor authentication | 1.1.5, 1.1.6, 1.1.7, 1.10.2 | T5-SSO §4 |
| FR3 | Enterprise SAML SSO / OIDC | 1.1.1, 4.4.1 | T5-SSO §1-2 |
| FR4 | SCIM provisioning/deprovisioning | 4.4.2, 4.8.1 | T5-SSO §3 |

**NFRs:** NFR-SEC-01, NFR-SEC-05, NFR-SEC-06, NFR-INT-05, NFR-INT-08, NFR-INT-09

---

#### Epic E1.2: API Key Management
**User Outcome:** Users can create and manage API keys with custom scopes and expiration

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR5 | API keys with custom scopes and expiration | 1.10.3, 6.1.1 | T8-UI §5 |
| FR6 | API key rotation without interruption | 1.10.3 | T8-UI §5 |
| FR7 | IP allowlisting for enterprise | 1.10.3, 4.8.4 | T5-SSO §9 |

**NFRs:** NFR-SEC-09, NFR-SCALE-08

---

#### Epic E1.3: Workspace & Project Management
**User Outcome:** Users can organize work into workspaces and projects with team permissions

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR8 | Create workspaces | 1.5.1, 1.10.4 | T1-SAAS §9 |
| FR9 | Create multiple projects | 1.5.2 | T1-SAAS §9 |
| FR10 | Invite members with role-based permissions | 1.10.4, 4.4.2, 5.1.2 | T8-UI §1 |
| FR11 | Switch workspaces without logout | 1.5.2, 2.13.1 | T5-SSO §8 |
| FR12 | Organize projects into folders | 1.5.2 | T8-GAPS §1 |
| FR13 | Duplicate projects as templates | 1.5.2, 2.12.1 | T1-VWB §8 |
| FR14 | Archive and restore projects | 1.5.2 | T4-VER §5 |
| FR15 | Row-Level Security tenant isolation | 2.13.2, 4.7.1 | T1-SAAS §3-6 |
| FR16 | Dedicated database isolation (Enterprise) | 2.13.2, 4.8.3 | T1-SAAS §4 |

**NFRs:** NFR-SEC-02, NFR-SEC-03, NFR-SCALE-01, NFR-SCALE-02, NFR-SCALE-04

---

#### Epic E1.4: Module Builder - Core Canvas
**User Outcome:** Users can create visual workflows using a node-based editor

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR17 | Visual workflows using node-based editor | 1.2.1 | T1-VWB §2-5 |
| FR24 | Connect nodes with validated type-checking | 1.2.1 | T1-VWB §5 |
| FR26 | Undo/redo history | 1.2.1 | T1-VWB §2 |
| FR27 | Save/load workflow configurations as JSON | 1.2.4, 1.2.6 | T1-VWB §8 |
| FR28 | Zoom, pan, minimap navigation | 1.2.1 | T1-VWB §5 |
| FR30 | Comment annotations | 1.2.1 | T1-VWB §8 |
| FR31 | Workflow validation (DAG check) | 1.2.1, 1.2.3, 1.2.5 | T7-CANVAS §8.1 |

**NFRs:** NFR-PERF-08, NFR-ACC-03, NFR-ACC-04

---

#### Epic E1.5: Module Builder - Node Types
**User Outcome:** Users can add various node types including Prompt, Sub-Agent, MCP, Skills, Control Flow

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR18 | Prompt nodes with variable interpolation | 1.2.2, 1.2.2a | T1-VWB §6 |
| FR19 | Sub-Agent nodes (system prompts, tools, model) | 1.2.2a | T1-CLAUDE §2-4 |
| FR20 | MCP Tool nodes | 2.1.4, 2.1.5, 2.1.6 | T5-MCP |
| FR21 | Skill nodes | 3.1.3, 3.1.4, 1.2.2 | T5-MCP §5 |
| FR22 | Control Flow nodes (If/Else, Switch, Loop) | 1.2.2c | T1-VWB §6 |
| FR23 | AskUserQuestion nodes for HITL | 1.2.2, 2.4.1, 2.4.2 | T1-CLAUDE §3 |
| FR25 | Variables in namespace-isolated Variable Pool | 1.2.2, 1.2.2d | T1-VWB §7 |
| FR29 | Group nodes into reusable sub-workflows | 1.2.1, 2.12.1 | T1-VWB §6 |

**NFRs:** NFR-INT-03, NFR-SEC-08

---

#### Epic E1.6: Conversational Building
**User Outcome:** Users can build workflows by describing requirements in natural language

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR32 | Build workflows via natural language | 1.2.1 (Chat panel) | T2-CONV §1-3 |
| FR33 | Parse NL intent and generate nodes | 1.2.1 (DCRL §2.1.1) | T2-CONV §3 |
| FR34 | Clarifying questions when confidence < 60% | DCRL §2.1.1 | T2-CONV §3 |
| FR35 | BMB agents guide structured creation | 1.2.1, 1.3.1, 2.2.1, 2.1.1 | T2-CONV §5 |
| FR36 | Switch between conversational and visual modes | 1.2.1 (split pane) | T2-CONV §7 |
| FR37 | Preview-before-apply for changes | DCRL §2.1.1 | T2-CONV §1 |
| FR38 | System learns from user feedback | DCRL §2.1.1 | T2-CONV §4 |

**NFRs:** NFR-INT-01

---

#### Epic E1.7: Chatbot Builder - Core Editor
**User Outcome:** Users can create conversational flows using a visual editor

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR39 | Create conversational flows | 1.3.1, 1.3.4 | T6-CHATBOT §1-3 |
| FR40 | Conversation nodes (Start, Message, Question) | 1.3.4 | T6-CHATBOT §3 |
| FR41 | Logic nodes (Condition, Set Variable, Switch) | 1.3.4, 1.3.1 | T6-CHATBOT §3 |
| FR42 | Integration nodes (API Call, Module Trigger) | 1.3.4, 1.2.2d | T6-INTEG |
| FR43 | Action nodes (Send Email, Create Ticket) | 1.3.4 | T6-CHATBOT §3 |
| FR44 | NLU nodes (Intent Classification, Entity) | 1.3.2, 1.3.4 | T6-RASA §1 |
| FR45 | MCP Tool nodes | 2.1.4 | T5-MCP |
| FR46 | Skill nodes | 3.1.3, 3.1.4 | T5-MCP §5 |

**NFRs:** NFR-PERF-10

---

#### Epic E1.8: Chatbot Builder - NLU & Policies
**User Outcome:** Users can configure intent classification, form filling, and dialogue policies

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR47 | Tokenizer, featurizer, DIETClassifier | 1.3.2 | T6-RASA §1 |
| FR48 | Slots for form filling with validation | 1.3.4, 1.3.2 | T6-RASA §3-4 |
| FR49 | Dialogue policies for state management | 1.3.1, 1.3.4 | T6-RASA §5 |
| FR50 | Event-sourced conversation tracker | 1.3.6, 1.3.7 | T6-RASA §2 |
| FR51 | Fallback handlers for unrecognized intents | 1.3.2, 1.3.5 | T6-RASA §5 |
| FR52 | Max retry attempts for slot filling | 1.3.4 | T6-RASA §4 |
| FR53 | Escalate to human agents with context | 1.3.4, 2.6.3, 2.4.1 | T4-CHAT §5-6 |

**NFRs:** NFR-REL-06, NFR-REL-07

---

#### Epic E1.9: Knowledge Base - Document Ingestion
**User Outcome:** Users can create knowledge bases and upload documents

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR86 | Create knowledge bases scoped to projects | 1.4.1 | T0-RAG |
| FR87 | Upload documents (PDF, DOCX, TXT, MD, HTML) | 1.4.2 | T0-RAG |
| FR88 | Ingest web content via URL crawling | 1.4.3 | T0-RAG |

**NFRs:** NFR-REL-08

---

#### Epic E1.10: Knowledge Base - Search & Retrieval
**User Outcome:** Users can search knowledge bases with vector and hybrid search

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR89 | Intelligent chunking (semantic, AST) | 1.4.4 | T0-RAG |
| FR90 | Embeddings via configurable providers | 1.4.5 | T0-RAG |
| FR91 | Vector search via pgvector HNSW | 1.4.6 | T0-RAG |
| FR92 | Hybrid search (vector + BM25) | 1.4.6 | T0-RAG |
| FR95 | Reranking (Cohere, cross-encoder) | 1.4.5 | T0-RAG |
| FR98 | Configure retrieval parameters | 1.4.5 | T0-RAG |

**NFRs:** NFR-PERF-09, NFR-SCALE-06

---

#### Epic E1.11: Knowledge Base - Advanced Retrieval
**User Outcome:** RAG context shared across all builders with graph retrieval and citations

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR93 | Graph-based retrieval (Graphiti) | 1.4.7 | T0-RAG |
| FR94 | Temporal memory queries | 1.4.7 | T0-RAG |
| FR96 | View source citations and confidence | 1.4.8, 1.3.3 | T4-EMBED |
| FR97 | RAG context shared across all builders | 1.4.1 | T6-INTEG |
| FR99 | Prevent cross-tenant RAG poisoning | 1.10.3 | T4-SEC §5 |

**NFRs:** NFR-SEC-13

---

#### Epic E1.12: Agent Execution Runtime
**User Outcome:** System can execute workflows with streaming and variable management

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR127 | Execute via Agno runtime with Claude | 1.6.1 | T0-RAG, T1-CLAUDE |
| FR128 | Manage variable pools with namespace isolation | 1.6.2 | T1-VWB §7 |
| FR129 | Streaming via AG-UI (25 events) | 1.6.3 | T0-PROT |
| FR130 | Sync and async execution | 1.6.1 | T1-VWB §8 |
| FR131 | Pause and resume workflows | 1.6.4 | T4-CMD §4 |
| FR132 | Execution timeouts | 1.6.5 | T4-SEC §1 |
| FR133 | Detect and prevent infinite loops | 1.6.6 | T7-CANVAS §8.1 |

**NFRs:** NFR-PERF-02, NFR-INT-02

---

#### Epic E1.13: Execution Triggers
**User Outcome:** Users can trigger workflows via schedule, webhook, or events

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR134 | Scheduled/cron-based triggers | 1.6.7 | T8-GAPS §2 |
| FR135 | Webhook-triggered execution (HMAC) | 1.6.8 | T6-INTEG §4 |
| FR136 | Event fan-out via Redis Pub/Sub | 1.6.1 | T6-INTEG §6 |
| FR137 | PostgreSQL LISTEN/NOTIFY for sync | 1.6.1 | T6-INTEG §6 |

**NFRs:** NFR-PERF-03, NFR-PERF-04, NFR-INT-07

---

#### Epic E1.14: Sandbox Execution
**User Outcome:** User code runs securely in isolated environments

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR138 | User code in sandboxed Firecracker MicroVMs | 1.6.9 | T4-SEC §1 |
| FR139 | Dify-style "Workflow as Tool" | 1.3.5 | T6-INTEG §12 |

**NFRs:** NFR-PERF-07, NFR-SEC-01, NFR-SEC-10

---

#### Epic E1.15: Execution Traces & Observability
**User Outcome:** Users can view detailed execution traces and history

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR140 | Detailed execution traces (Langfuse) | 1.7.1 | T4-OBS §2.3 |
| FR141 | LLM token usage and costs | 1.7.2 | T4-OBS §4 |
| FR142 | Aggregated cost analytics | 1.7.3 | T4-OBS §4 |
| FR149 | Export execution history | 1.7.5 | T4-OBS §8 |

**NFRs:** NFR-OBS-01, NFR-OBS-02, NFR-OBS-03, NFR-OBS-07, NFR-OBS-08

---

#### Epic E1.16: Budget Alerts & Cost Tracking
**User Outcome:** Users can set budget alerts and view real-time usage

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR143 | Budget alerts (80%, 100%) | 1.7.4 | T3-BILL §6 |
| FR187 | Meter all AI usage to platform credits | 1.10.1 | T3-BILL §5 |
| FR188 | View usage in dollar amounts | 1.10.2 | B3-PRICE §3 |
| FR189 | Real-time usage widget | 1.10.3 | T4-CMD |

**NFRs:** NFR-OBS-09

---

#### Epic E1.17: Human-in-the-Loop (HITL)
**User Outcome:** Users can configure approval gates for agent actions

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR150 | Configure approval gates | 1.8.1 | T4-CMD §3 |
| FR151 | Queue HITL with AG-UI INTERRUPT events | 1.8.2 | T4-CMD §4 |
| FR152 | View pending approvals | 1.8.3 | T4-CMD §3 |
| FR153 | Approve/reject/modify HITL requests | 1.8.4 | T4-CMD §3 |
| FR154 | Resume workflow upon resolution | 1.8.2 | T4-CMD §4 |
| FR155 | Configure escalation rules and timeouts | 1.8.5 | T4-CMD §3 |

**NFRs:** NFR-SEC-08

---

### PHASE 2: BUILDER SUITE (13 Epics) - 70 FRs

#### Epic E2.1: Voice Agent - Core Editor
**User Outcome:** Users can create voice flows using a visual editor

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR54 | Create voice flows using visual editor | 2.2.1 | T6-VOICE |
| FR55 | Voice Input nodes (Listen, DTMF, STT) | 2.2.1, 2.2.4 | T6-VOICE §1.1 |
| FR56 | Voice Output nodes (Speak, Audio, SSML) | 2.2.1, 2.2.2, 2.2.4 | T6-VOICE §1.1 |
| FR57 | Voice Control nodes (Transfer, Hold, Hang Up) | 2.2.1, 2.2.3 | T6-LIVEKIT §7 |
| FR58 | Voice Integration nodes (Module, MCP, Skill) | 2.2.1, 2.1.4 | T6-INTEG |

**NFRs:** NFR-ACC-05

---

#### Epic E2.2: Voice Agent - Speech Processing
**User Outcome:** Users can configure STT, TTS, VAD, and voice personas

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR59 | STT via configurable providers (Deepgram) | 2.2.4 | T6-VOICE §1.1 |
| FR60 | TTS via configurable providers (Cartesia) | 2.2.4, 2.2.2 | T6-VOICE §1.1 |
| FR61 | VAD with 98.8% TPR (Silero VAD) | 2.2.4 | T6-LIVEKIT §3 |
| FR62 | Turn detection (Qwen2.5-0.5B) | 2.2.4 | T6-LIVEKIT §3 |
| FR63 | Interruption handling (4-state machine) | 2.2.4 | T6-LIVEKIT §4 |
| FR64 | SSML for prosody, emphasis | 2.2.2, 2.2.4 | T6-VOICE §1.1 |
| FR67 | Configure voice personas | 2.2.2 | T8-AIGEN §4 |
| FR68 | Real-time audio via WebRTC/gRPC | 2.2.3, 2.2.5, 2.2.6 | T6-VOICE |

**NFRs:** NFR-PERF-01, NFR-PERF-05, NFR-PERF-13

---

#### Epic E2.3: Voice Agent - Telephony Integration
**User Outcome:** Users can handle inbound/outbound calls with RAG context

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR65 | Inbound/outbound calls via Twilio SIP | 2.2.1, 2.2.3 | T6-LIVEKIT §7 |
| FR66 | Voice agents access same project RAG context | 2.2.1, 1.4.1 | T6-INTEG |

**NFRs:** NFR-REL-06

---

#### Epic E2.4: Canvas Builder - Core Editor
**User Outcome:** Users can create AI generation workflows using canvas

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR69 | Create AI generation workflows | 2.1.1 | T7-CANVAS §1-2 |
| FR71 | Control nodes (Merge, Split, Switch, Loop) | 2.1.1 | T7-CANVAS §5 |
| FR73 | I/O nodes (Upload, Download, URL) | 2.1.7, 2.1.1 | T7-CANVAS §5 |
| FR76 | Converse with "Artie" agent for NL building | 2.1.1 (Artie chat) | T7-CANVAS §6 |
| FR77 | Execute DAGs with topological sort | 2.1.8, 1.2.3 | T7-CANVAS §8.1, §9 |
| FR78 | Partial re-execution (changed nodes only) | 2.1.1, 1.2.3 | T7-CANVAS §9 |

**NFRs:** NFR-PERF-11

---

#### Epic E2.5: Canvas Builder - Generation & Enhancement Nodes
**User Outcome:** Users can add generation, enhancement, and MCP nodes

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR70 | Generation nodes (Image, Video, Audio, 3D) | 2.1.3, 2.1.7 | T7-CANVAS §5 |
| FR72 | Enhancement nodes (Upscale, Denoise) | 2.1.3, 2.1.7 | T8-AIGEN §7 |
| FR74 | MCP Tool nodes | 2.1.4, 2.1.5, 2.1.6 | T5-MCP |
| FR75 | Skill nodes | 3.1.3, 3.1.4 | T5-MCP §5 |
| FR79 | Cache intermediate node outputs | 2.1.7, 2.1.8 | T7-CANVAS §13 |
| FR81 | Cost estimation before execution | 2.1.9, 2.1.3 | T8-AIGEN §10 |
| FR82 | Queue batch jobs | 2.1.8 | T7-CANVAS §9 |

**NFRs:** NFR-SCALE-07

---

#### Epic E2.6: Canvas Builder - Brand RAG & Providers
**User Outcome:** Users can configure brand guidelines and AI providers

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR80 | Configure Brand RAG for guidelines | 2.1.1, 2.1.3 | T7-CANVAS §11 |
| FR83 | Canvas triggered by Chatbot/Voice events | 2.1.1, 1.3.4 | T6-INTEG |
| FR84 | Configure AI providers (fal.ai) | 2.1.3, 1.10.4 | T8-AIGEN §6 |
| FR85 | 50+ node types (ComfyUI parity) | 2.1.1, 2.14.5 | T7-CANVAS §5 |

---

#### Epic E2.7: Cross-Builder Integration
**User Outcome:** Workflows are callable across all builders with low latency

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR243 | Module workflows callable from Chatbots (<500ms) | 1.3.5 | T6-INTEG §11-12 |
| FR244 | Voice agents call Modules via gRPC (<50ms) | 1.5.5 | T6-INTEG §6 |
| FR245 | Canvas triggered by Chatbot/Voice events | 2.1.1 | T6-INTEG, T7-CANVAS §7 |
| FR246 | All builders share same project RAG context | 1.4.1 | T0-RAG |
| FR247 | State changes propagate via PostgreSQL NOTIFY | 1.6.1 | T6-INTEG §6 |
| FR248 | Events fan out via Redis Pub/Sub (<200ms) | 1.6.1 | T6-INTEG §6 |

**NFRs:** NFR-PERF-03, NFR-PERF-04, NFR-PERF-05, NFR-PERF-06, NFR-INT-04

---

#### Epic E2.8: MCP Server Installation
**User Outcome:** Users can browse and install MCP servers from marketplace

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR100 | Browse MCP servers from Official Registry | 3.2.1 | T5-MCP §1 |
| FR101 | Browse MCP servers from Smithery.ai | 3.2.1 | T5-MCP §1.2 |
| FR102 | Search with semantic search | 3.2.2 | T5-MCP §7.1 |
| FR103 | Filter by category, verified, popularity | 3.2.2 | T5-MCP §7.1 |
| FR104 | View MCP server details | 3.2.3 | T5-MCP §1.1 |
| FR105 | Install MCP servers with one-click | 3.2.4 | T5-MCP §2-3 |
| FR106 | Configure installed MCP server settings | 3.2.5 | T5-MCP §6.1 |
| FR107 | Enable/disable MCP servers | 3.2.5 | T5-MCP §2.2 |
| FR108 | Set auto-approval rules for tools | 3.2.6 | T5-MCP §2.2 |

**NFRs:** NFR-INT-03

---

#### Epic E2.9: MCP Registry Aggregation
**User Outcome:** System aggregates from multiple registries with usage tracking

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR109 | Aggregates from multiple registries | 3.2.1 | T5-MCP §7.3 |
| FR110 | Caches registry metadata | 3.2.1 | T5-MCP §7.3 |
| FR113 | Tracks MCP server usage and success rates | 3.3.3 | T4-OBS §5 |

---

#### Epic E2.10: Skills Installation
**User Outcome:** Users can browse and install Skills

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR114 | Browse Skills from platform marketplace | 3.4.1 | T5-MCP §7.1 |
| FR115 | Browse Skills from project/user directories | 3.4.2 | T5-MCP §5.1 |
| FR116 | Search Skills with semantic search | 3.4.1 | T5-MCP §7.1 |
| FR117 | Filter Skills by category, ratings, creator | 3.4.1 | T5-MCP §7.1 |
| FR118 | View Skill details | 3.4.3 | T5-MCP §5.2 |
| FR119 | Install Skills with one-click | 3.4.4 | T5-MCP §5.1 |
| FR120 | Add Skill nodes to workflows | 1.3.1, 1.3.2 | T5-MCP §5.3 |
| FR121 | Validate Skill frontmatter (SKILL.md YAML) | 3.4.5 | T5-MCP §6.2 |
| FR122 | Resolve Skill paths during execution | 1.6.1 | T5-MCP §5.3 |

---

#### Epic E2.11: Skills Creation & Publishing
**User Outcome:** Users can create custom Skills with AI-assisted discovery

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR123 | Create custom Skills (SKILL.md format) | 3.4.6 | T5-MCP §5.2 |
| FR124 | Publish Skills to marketplace | 3.4.7 | B2-MARKET |
| FR125 | Set pricing for Skills | 3.4.8 | B2-MARKET §8 |
| FR126 | AI-assisted skill discovery | 3.4.9 | T5-MCP §5.4 |

---

#### Epic E2.12: UI Generation
**User Outcome:** System generates UIs from workflow definitions

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR179 | Generate UIs from workflow definitions | 2.2.1 | T3-UIGEN §6-7 |
| FR180 | Map agent inputs to form components | 2.2.2 | T3-UIGEN §6 |
| FR181 | Generate multi-step wizards | 2.2.3 | T3-UIGEN §7 |
| FR182 | Customize UI themes (CSS variables) | 2.2.4 | T5-WHITE §1 |
| FR183 | Embed UIs via iframe or Web Component | 2.2.5 | T3-UIGEN §10 |
| FR184 | Generated UIs include embedded chat widgets | 2.2.6 | T4-EMBED |
| FR185 | Generated UIs render using shadcn/ui | 2.2.1 | T3-UIGEN §4 |
| FR186 | REST/GraphQL API endpoints | 2.2.7 | T3-UIGEN §12 |

**NFRs:** NFR-ACC-01, NFR-ACC-02

---

#### Epic E2.13: Customer Interaction - Chat Deployment
**User Outcome:** Users can deploy chatbots to customer channels

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR156 | Deploy chatbots to Chatwoot inboxes | 1.9.1 | T4-CHAT §6 |
| FR157 | Receive messages via Agent Bot webhooks | 1.9.2 | T4-CHAT §4 |
| FR158 | Query project RAG for responses | 1.9.3 | T4-CHAT §11 |
| FR159 | Configure confidence thresholds | 1.9.4 | T4-CHAT §6 |
| FR160 | Transfer context during human handoff | 1.9.5 | T4-CHAT §6 |
| FR161 | Configure multi-channel support | 1.9.6 | T4-CHAT §2 |
| FR162 | Display RAG confidence and citations | 1.9.3 | T4-EMBED §1 |
| FR163 | Embed custom React chat widgets | 1.9.7 | T4-EMBED §1-3 |
| FR164 | ActionCable WebSocket for real-time | 1.9.2 | T4-CHAT §2 |
| FR165 | Configure proactive outbound messaging | 1.9.8 | T6-INTEG §6 |

**NFRs:** NFR-INT-10

---

### PHASE 3: MARKETPLACE (10 Epics) - 23 FRs

#### Epic E3.1: Module Marketplace - Browse & Search
**User Outcome:** Users can discover modules with search and filters

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR169 | Browse with search, categories, filters | 3.1.4 | B2-MARKET §7 |
| FR170 | View ratings, reviews, usage statistics | 3.1.5 | B2-MARKET §6 |

---

#### Epic E3.2: Module Marketplace - Installation
**User Outcome:** Users can install modules with dependency resolution

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR171 | Install modules with one-click | 3.1.6 | B2-MARKET §7 |
| FR172 | Resolve module dependencies | 3.1.7 | B2-MARKET §8 |
| FR177 | Fork and remix public modules | 3.1.11 | T7-CANVAS §10 |

---

#### Epic E3.3: Module Publishing
**User Outcome:** Creators can publish modules with versioning

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR166 | Publish modules with versioning | 3.1.1 | B2-MARKET §8 |
| FR168 | Review and sandbox-test before publishing | 3.1.3 | B2-MARKET §6 |

**NFRs:** NFR-SEC-11

---

#### Epic E3.4: Module Pricing & Revenue
**User Outcome:** Creators can set pricing and receive revenue

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR167 | Set pricing (free, one-time, subscription) | 3.1.2 | B2-MARKET §3 |
| FR173 | Receive 85% revenue (15% platform fee) | 3.1.8 | B2-MARKET §2 |
| FR175 | 24-hour auto-refund for crashes | 3.1.10 | B2-MARKET §6 |
| FR176 | 7-day escrow for payments | 3.1.8 | B2-MARKET §4 |

---

#### Epic E3.5: Creator Analytics
**User Outcome:** Creators can view earnings and performance

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR174 | View earnings and analytics | 3.1.9 | B2-MARKET §6 |
| FR178 | Create module bundles | 3.1.12 | B2-MARKET §8 |

---

#### Epic E3.6: MCP Server Publishing
**User Outcome:** Creators can publish custom MCP servers with pricing

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR111 | Publish custom MCP servers | 3.3.1 | T5-MCP §7.1 |
| FR112 | Set pricing for MCP servers | 3.3.2 | B2-MARKET §8 |

---

#### Epic E3.7: Billing - Subscription Plans
**User Outcome:** Users can subscribe to tiered plans

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR190 | Tiered subscription plans | 1.10.4 | B3-PRICE §4 |
| FR194 | Self-serve billing portal | 1.10.7 | T3-BILL §1 |
| FR195 | Usage-based invoices | 1.10.8 | T3-BILL §1 |
| FR196 | Stripe Billing Meters | 1.10.1 | T3-BILL §1.4 |

---

#### Epic E3.8: Billing - Usage Management
**User Outcome:** Users can manage usage caps and overages

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR191 | Soft warnings (80%) and hard caps (150%) | 1.10.5 | T3-BILL §6 |
| FR192 | Configure hard cap vs. overage | 1.10.5 | T3-BILL §6 |
| FR193 | View usage forecasts | 1.10.6 | T3-BILL §10 |

**NFRs:** NFR-OBS-09

---

#### Epic E3.9: Platform Command Center
**User Outcome:** Admins can view consumption and apply rate limits

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR144 | Command Center dashboard | 4.1.1 | T4-CMD §1-2 |
| FR145 | Per-tenant consumption | 4.1.2 | T4-OBS §9 |
| FR146 | Dynamic rate limiting | 4.1.3 | T4-SEC §3 |
| FR147 | Prometheus-compatible metrics | 4.1.4 | T4-OBS §6 |
| FR148 | Immutable audit logs (pgaudit) | 4.1.5 | T4-SEC §8 |

**NFRs:** NFR-OBS-04, NFR-OBS-05, NFR-OBS-06, NFR-SEC-12

---

### PHASE 4: ENTERPRISE (7 Epics) - 28 FRs

#### Epic E4.1: Security Guardrails
**User Outcome:** System applies AI safety guardrails and content moderation

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR217 | NeMo Guardrails for prompt injection | 4.3.4 | T4-SEC §2 |
| FR218 | Sanitize inputs and filter outputs | 4.3.4 | T4-SEC §2 |
| FR219 | Content moderation (no NSFW) | 4.3.5 | T4-SEC §2 |
| FR220 | AI hallucination mitigation via RAG | 1.4.8 | T0-RAG |

**NFRs:** NFR-SEC-04

---

#### Epic E4.2: Enterprise Security Hardening
**User Outcome:** System enforces rate limiting, sandbox execution, DDoS protection

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR221 | All user code executes in Firecracker MicroVMs | 4.3.6 | T4-SEC §1 |
| FR222 | Rate limiting at API gateway | 4.3.7 | T4-SEC §3 |
| FR223 | DDoS protection via WAF | 4.3.7 | T4-SEC §3 |
| FR224 | Voice agents limited to pre-approved actions | 1.5.7 | T4-SEC §6 |

**NFRs:** NFR-SEC-01, NFR-SEC-10, NFR-SEC-14, NFR-SCALE-08

---

#### Epic E4.3: SOC 2 & Compliance
**User Outcome:** System provides compliance documentation

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR214 | SOC 2 Type II documentation | 4.3.1 | T4-SEC §8 |
| FR215 | GDPR data subject requests | 4.3.2 | T4-SEC §8 |
| FR216 | Data residency requirements | 4.3.3 | T4-SEC §8 |

**NFRs:** NFR-COMP-01, NFR-COMP-02, NFR-COMP-03, NFR-COMP-04, NFR-COMP-06, NFR-COMP-07

---

#### Epic E4.4: White-Label - Sub-Accounts
**User Outcome:** Agencies can create client sub-accounts with usage breakdown

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR206 | Create sub-accounts for clients | 4.2.1 | T8-UI §1 |
| FR207 | Per-client usage breakdown | 4.2.2 | T5-WHITE §5 |
| FR208 | Configure markup margins | 4.2.3 | T3-BILL §7 |
| FR209 | White-label invoices | 4.2.4 | T5-WHITE §4 |

---

#### Epic E4.5: White-Label - Branding
**User Outcome:** Users can customize branding and domains

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR210 | Custom domains | 4.2.5 | T5-WHITE §3 |
| FR211 | Customize branding (logo, colors, fonts) | 4.2.6 | T5-WHITE §2 |
| FR212 | Custom email domains | 4.2.7 | T5-WHITE §4 |
| FR213 | White-label supports custom SSO | 4.2.8 | T5-SSO |

**NFRs:** NFR-ACC-02

---

#### Epic E4.6: Self-Hosted - Docker Deployment
**User Outcome:** Users can deploy via Docker Compose

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR225 | Deploy via Docker Compose | 4.4.1 | T5-DEPLOY §1 |
| FR227 | Configure external PostgreSQL | 4.4.3 | T5-DEPLOY §1-2 |
| FR228 | Configure external Redis | 4.4.3 | T5-DEPLOY §1-2 |

**NFRs:** NFR-MAINT-04, NFR-MAINT-05

---

#### Epic E4.7: Self-Hosted - Kubernetes
**User Outcome:** Users can deploy via Helm charts

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR226 | Deploy via Helm charts for K8s | 4.4.2 | T5-DEPLOY §2 |
| FR229 | Configure custom LLM endpoints (BYOM) | 4.4.4 | T5-DEPLOY §8 |
| FR230 | Air-gapped installation | 4.4.5 | T5-DEPLOY §3 |
| FR231 | Internal SSO providers | 4.4.6 | T5-SSO |
| FR232 | Velero for backup/DR | 4.4.7 | T5-DEPLOY §8 |

**NFRs:** NFR-COMP-05, NFR-REL-02, NFR-REL-03, NFR-REL-04, NFR-REL-05

---

### PHASE 5: COLLABORATION (6 Epics) - 9 FRs

#### Epic E5.1: Real-Time Collaboration
**User Outcome:** Multiple users can edit simultaneously

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR197 | Multiple users edit simultaneously (Yjs CRDT) | 5.1.1 | T4-COLLAB §2 |
| FR198 | See collaborator cursors and presence | 5.1.2 | T4-COLLAB §5 |

**NFRs:** NFR-PERF-12

---

#### Epic E5.2: Comments & Discussion
**User Outcome:** Users can add comments for discussion

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR202 | Add comments for discussion | 5.1.3 | T4-COLLAB §4 |

---

#### Epic E5.3: Version History & Rollback
**User Outcome:** Users can view history and rollback versions

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR199 | Maintain workflow version history | 5.2.1 | T4-VER §2 |
| FR201 | Rollback to any previous version | 5.2.3 | T4-VER §2 |

**NFRs:** NFR-MAINT-07

---

#### Epic E5.4: Visual Diffs
**User Outcome:** Users can see visual diffs between versions

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR200 | Visual diffs (jsondiffpatch) | 5.2.2 | T4-VER §3 |

---

#### Epic E5.5: A/B Testing
**User Outcome:** Users can configure A/B testing for workflows

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR203 | Configure A/B testing (Bayesian) | 5.2.4 | T4-VER §4 |

---

#### Epic E5.6: Promotion Pipelines & Feature Flags
**User Outcome:** Users can set up promotion workflows

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR204 | Set up promotion pipelines | 5.2.5 | T4-VER §6 |
| FR205 | Configure feature flags (LaunchDarkly) | 5.2.6 | T4-VER §6 |

**NFRs:** NFR-MAINT-08

---

### PHASE 6: FUTURE (5 Epics) - 10 FRs

#### Epic E6.1: SDK Export - Claude Agent SDK
**User Outcome:** Users can export workflows as Claude SDK code

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR233 | Export as Claude Agent SDK code | 2.3.1 | T1-FRAME §5-6 |

---

#### Epic E6.2: SDK Export - Agno Framework
**User Outcome:** Users can export as Agno framework code

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR234 | Export as Agno framework code | 2.3.2 | T1-FRAME §5-6 |

---

#### Epic E6.3: SDK Export - LangGraph/CrewAI
**User Outcome:** Users can export as adapter code

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR235 | Export as LangGraph adapter code | 2.3.3 | T1-FRAME §5-6 |
| FR236 | Export as CrewAI adapter code | 2.3.4 | T1-FRAME §5-6 |

---

#### Epic E6.4: API Endpoints
**User Outcome:** System provides REST/GraphQL APIs

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR237 | REST API with OpenAPI spec | 2.3.5 | T3-UIGEN §12 |
| FR238 | GraphQL API | 2.3.5 | T3-UIGEN §12 |
| FR239 | SSE streaming endpoints | 2.3.6 | T0-PROT |
| FR241 | Rate limit headers | 2.3.5 | T4-SEC §3 |

**NFRs:** NFR-INT-06, NFR-MAINT-09

---

#### Epic E6.5: Mobile SDKs
**User Outcome:** System provides iOS, Android, JS, Python SDKs

| FR | Requirement | Screens | Research Source |
|----|-------------|---------|-----------------|
| FR240 | iOS, Android, JS, Python SDKs | 2.3.7 | T8-GAPS §3 |
| FR242 | Configure scoped API keys | 1.10.9 | T8-UI §5 |

---

## NFR Coverage Summary

| NFR Category | Count | Epics Addressing |
|--------------|-------|------------------|
| NFR-PERF (Performance) | 13 | E1.4, E1.10, E1.12, E1.13, E2.2, E2.4, E2.7, E5.1 |
| NFR-SEC (Security) | 14 | E1.1, E1.2, E1.3, E1.5, E1.11, E1.14, E1.17, E2.8, E3.3, E3.9, E4.1, E4.2 |
| NFR-SCALE (Scalability) | 9 | E1.2, E1.3, E1.10, E2.5, E4.2 |
| NFR-REL (Reliability) | 8 | E1.8, E1.9, E2.3, E4.7 |
| NFR-ACC (Accessibility) | 5 | E1.4, E2.1, E2.12, E4.5 |
| NFR-INT (Integration) | 10 | E1.6, E1.12, E1.13, E2.7, E2.8, E2.13, E6.4 |
| NFR-OBS (Observability) | 9 | E1.15, E1.16, E3.8, E3.9 |
| NFR-MAINT (Maintainability) | 9 | E4.6, E5.3, E5.6, E6.4 |
| NFR-COMP (Compliance) | 7 | E4.3, E4.7 |
| **TOTAL** | **70** | ✅ All addressed |

---

## Verification Summary

| Metric | Count | Status |
|--------|-------|--------|
| Total FRs | 248 | ✅ All mapped |
| Total NFRs | 70 | ✅ All addressed |
| Total Epics | 58 | ✅ Complete |
| Total Screens Referenced | 146 | ✅ All linked |
| Research Sources | 25+ T-codes | ✅ All referenced |

---

## Stories by Epic

### Epic E0.1: Project Foundation & Infrastructure Setup

**Epic Goal:** Development team has a fully configured monorepo with all dependencies, services, and tooling ready for feature development
**FRs Covered:** None (Infrastructure prerequisite)
**NFRs:** NFR-MAINT-01, NFR-MAINT-02, NFR-MAINT-03, NFR-SEC-07
**Research:** project-context.md, Architecture Document

---

#### Story 0.1.1: Scaffold Turborepo Monorepo with Next.js 15

As a **developer**,
I want **a properly structured Turborepo monorepo with Next.js 15 App Router**,
So that **I have a scalable foundation for the multi-package Hyyve platform**.

**Acceptance Criteria:**

- **Given** I am starting the Hyyve project
- **When** I run the scaffold commands
- **Then** the following structure is created:
  ```
  apps/
    web/                    # Next.js 15 frontend
      app/                  # App Router pages
      components/           # React components
      hooks/                # Custom React hooks
      lib/                  # Utilities and clients
      stores/               # Zustand stores
  packages/
    @platform/
      ui/                   # Shared UI components
      db/                   # Supabase client & types
      auth/                 # Auth helpers
    tsconfig/               # Shared TypeScript configs
  ```
- **And** `pnpm` is configured as the package manager
- **And** `turbo.json` defines build, lint, and test pipelines
- **And** root `package.json` has workspace configuration
- **And** `.nvmrc` specifies Node.js 20.x

**Technical Notes:**
- Use `pnpm create turbo@latest` as starting point
- Configure `next@15.5.8` and `react@19.x`
- Set up path aliases in tsconfig (`@/`, `@platform/`)

**Creates:** Project structure, turbo.json, root package.json, .nvmrc

---

#### Story 0.1.2: Configure TypeScript with Strict Mode

As a **developer**,
I want **TypeScript configured with strict mode and shared configs**,
So that **type safety is enforced across all packages**.

**Acceptance Criteria:**

- **Given** the monorepo structure exists
- **When** I configure TypeScript
- **Then** `packages/tsconfig/base.json` includes:
  ```json
  {
    "compilerOptions": {
      "strict": true,
      "noUncheckedIndexedAccess": true,
      "noImplicitReturns": true,
      "esModuleInterop": true,
      "moduleResolution": "bundler",
      "target": "ES2022"
    }
  }
  ```
- **And** each app/package extends the base config
- **And** path aliases are configured for `@/` and `@platform/*`
- **And** TypeScript 5.x is installed

**Creates:** packages/tsconfig/base.json, packages/tsconfig/nextjs.json, packages/tsconfig/react-library.json

---

#### Story 0.1.3: Install Core Frontend Dependencies

As a **developer**,
I want **all core frontend dependencies installed and configured**,
So that **I can build the visual builder and UI components**.

**Acceptance Criteria:**

- **Given** the monorepo is scaffolded
- **When** I install frontend dependencies
- **Then** the following are installed in `apps/web`:
  - `tailwindcss@4.x` with PostCSS config
  - `zustand@5.0.8` with immer middleware
  - `zod@4.0.1` for runtime validation
  - `@xyflow/react@12.10.0` for visual builder
  - `clsx` and `tailwind-merge` for className utilities
- **And** Tailwind CSS is configured with custom theme extending shadcn defaults
- **And** `globals.css` includes Tailwind directives and CSS variables
- **And** `cn()` utility function is created in `lib/utils.ts`

**Technical Notes:**
- Configure Tailwind 4.x CSS-first config
- Set up CSS variables for theming per shadcn conventions

**Creates:** tailwind.config.ts, postcss.config.js, globals.css, lib/utils.ts

---

#### Story 0.1.4: Initialize shadcn/ui Component Library

As a **developer**,
I want **shadcn/ui initialized with essential components**,
So that **I have a consistent design system for all UI**.

**Acceptance Criteria:**

- **Given** Tailwind CSS is configured
- **When** I run `npx shadcn@latest init`
- **Then** shadcn is configured with:
  - Style: New York
  - Base color: Neutral
  - CSS variables: Yes
  - Path: `@/components/ui`
- **And** the following essential components are added:
  - Button, Input, Label, Card
  - Dialog, Sheet, Dropdown Menu
  - Form (with react-hook-form + zod)
  - Tabs, Accordion, Tooltip
  - Table, Badge, Avatar
  - Toast (Sonner), Alert
  - Command (cmdk), Popover
- **And** `components.json` is configured correctly
- **And** all components use the `cn()` utility

**Technical Notes:**
- Run `npx shadcn@latest add [component]` for each
- Ensure @radix-ui/* primitives are installed

**Creates:** components.json, components/ui/*.tsx

---

#### Story 0.1.5: Configure Supabase Database Client

As a **developer**,
I want **Supabase client configured with SSR support**,
So that **I can interact with PostgreSQL using RLS**.

**Acceptance Criteria:**

- **Given** a Supabase project is created
- **When** I configure the client in `packages/@platform/db`
- **Then** the following are installed:
  - `@supabase/supabase-js@2.87.0`
  - `@supabase/ssr` for Next.js SSR support
- **And** server client is created using `createServerClient()`
- **And** browser client is created using `createBrowserClient()`
- **And** middleware handles auth cookie refresh
- **And** TypeScript types are generated from database schema
- **And** RLS is enabled on all tables by default

**Technical Notes:**
- Use `@supabase/ssr` cookie handling for Next.js App Router
- Generate types with `supabase gen types typescript`
- Store `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in env

**Environment Variables:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)

**Creates:** packages/@platform/db/client.ts, packages/@platform/db/types.ts, middleware.ts

---

#### Story 0.1.6: Configure Clerk Authentication

As a **developer**,
I want **Clerk authentication integrated with Next.js**,
So that **user authentication is handled before feature development**.

**Acceptance Criteria:**

- **Given** a Clerk application is created
- **When** I configure Clerk in `packages/@platform/auth`
- **Then** `@clerk/nextjs@6.35.5` is installed
- **And** `ClerkProvider` wraps the application in root layout
- **And** middleware protects routes requiring auth
- **And** `auth()` helper is available in Server Components
- **And** `useUser()` and `useAuth()` hooks work in Client Components
- **And** sign-in and sign-up pages are configured at `/sign-in` and `/sign-up`
- **And** Clerk + Supabase integration syncs user IDs

**Technical Notes:**
- Configure `clerkMiddleware()` with public routes
- Set up Clerk webhook to sync users to Supabase `users` table
- Use Clerk's `getToken({ template: 'supabase' })` for RLS

**Environment Variables:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`

**Creates:** packages/@platform/auth/index.ts, app/sign-in/[[...sign-in]]/page.tsx, app/sign-up/[[...sign-up]]/page.tsx

---

#### Story 0.1.7: Configure tRPC API Layer

As a **developer**,
I want **tRPC configured for type-safe API calls**,
So that **frontend and backend share types without code generation**.

**Acceptance Criteria:**

- **Given** authentication is configured
- **When** I set up tRPC
- **Then** the following packages are installed:
  - `@trpc/server@11.8.0`
  - `@trpc/client@11.8.0`
  - `@trpc/react-query@11.8.0`
  - `@trpc/next@11.8.0`
  - `@tanstack/react-query`
- **And** tRPC router is created at `app/api/trpc/[trpc]/route.ts`
- **And** `protectedProcedure` validates Clerk auth
- **And** context includes `db` (Supabase) and `user` (Clerk)
- **And** React Query provider is configured
- **And** client hooks (`trpc.useQuery`, `trpc.useMutation`) work

**Technical Notes:**
- Use App Router route handler pattern
- Configure `superjson` for Date/BigInt serialization
- Set up React Query devtools in development

**Creates:** lib/trpc/server.ts, lib/trpc/client.ts, lib/trpc/react.tsx, app/api/trpc/[trpc]/route.ts

---

#### Story 0.1.8: Configure Redis Client

As a **developer**,
I want **Redis configured for caching and pub/sub**,
So that **real-time features and session management are supported**.

**Acceptance Criteria:**

- **Given** a Redis instance is available (Upstash or self-hosted)
- **When** I configure the Redis client
- **Then** `redis` package is installed
- **And** Redis client is exported from `packages/@platform/db/redis.ts`
- **And** connection uses `REDIS_URL` environment variable
- **And** utility functions are created for:
  - Cache get/set with TTL
  - Pub/Sub publish/subscribe
  - Rate limiting helpers
- **And** connection pooling is configured for serverless

**Environment Variables:**
- `REDIS_URL`

**Creates:** packages/@platform/db/redis.ts

---

#### Story 0.1.9: Configure Langfuse Observability

As a **developer**,
I want **Langfuse configured for agent tracing**,
So that **LLM calls are observable and costs are tracked**.

**Acceptance Criteria:**

- **Given** Langfuse instance is available (self-hosted)
- **When** I configure Langfuse
- **Then** the following are installed:
  - `langfuse@3.148.0`
  - `@langfuse/core@4.4.0`
- **And** Langfuse client is initialized with environment variables
- **And** trace wrapper functions are created for:
  - LLM calls
  - Agent runs
  - Tool executions
- **And** cost tracking is configured per model

**Environment Variables:**
- `LANGFUSE_PUBLIC_KEY`
- `LANGFUSE_SECRET_KEY`
- `LANGFUSE_HOST`

**Creates:** lib/observability/langfuse.ts

---

#### Story 0.1.10: Configure Protocol Stack (CopilotKit + AG-UI)

As a **developer**,
I want **CopilotKit and AG-UI protocols configured**,
So that **agent-to-UI communication is standardized**.

**Acceptance Criteria:**

- **Given** the core dependencies are installed
- **When** I configure the protocol stack
- **Then** the following are installed:
  - `@copilotkit/react-ui`
  - `@copilotkit/react-core`
  - `@copilotkit/runtime`
  - `@ag-ui/client`
  - `@ag-ui/agno`
- **And** `CopilotKit` provider is added to root layout
- **And** AG-UI SSE endpoint is created at `app/api/ag-ui/route.ts`
- **And** AG-UI client is configured for streaming
- **And** 25 AG-UI event types are typed

**Technical Notes:**
- CopilotKit handles chat UI components
- AG-UI handles SSE streaming for agent responses
- Both integrate with the same agent backend

**Creates:** lib/protocols/copilotkit.tsx, lib/protocols/ag-ui.ts, app/api/ag-ui/route.ts

---

#### Story 0.1.11: Configure Stripe Billing

As a **developer**,
I want **Stripe SDK configured for billing**,
So that **payment processing infrastructure is ready**.

**Acceptance Criteria:**

- **Given** a Stripe account is created
- **When** I configure Stripe
- **Then** `stripe@20.0.0` is installed
- **And** Stripe client is initialized server-side only
- **And** webhook handler is created at `app/api/webhooks/stripe/route.ts`
- **And** webhook signature verification is implemented
- **And** types are generated for Stripe events

**Environment Variables:**
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**Creates:** lib/billing/stripe.ts, app/api/webhooks/stripe/route.ts

---

#### Story 0.1.12: Configure Testing Infrastructure

As a **developer**,
I want **testing infrastructure configured**,
So that **code quality is ensured from the start**.

**Acceptance Criteria:**

- **Given** the monorepo is set up
- **When** I configure testing
- **Then** the following are installed:
  - `vitest@4.0.x` for unit tests
  - `@playwright/test@1.51.0` for E2E tests
  - `@testing-library/react` for component tests
  - `@testing-library/jest-dom` for matchers
- **And** Vitest config supports React and TypeScript
- **And** Playwright config targets Chromium, Firefox, WebKit
- **And** test scripts are added to turbo pipeline
- **And** coverage reporting is configured

**Technical Notes:**
- Co-locate tests with source files (`*.test.tsx`)
- E2E tests in `e2e/` directory
- Configure `data-testid` convention

**Creates:** vitest.config.ts, playwright.config.ts, vitest.setup.ts

---

#### Story 0.1.13: Configure Environment Variables & Secrets

As a **developer**,
I want **environment variables properly configured across environments**,
So that **secrets are managed securely**.

**Acceptance Criteria:**

- **Given** all services are configured
- **When** I set up environment management
- **Then** the following files exist:
  - `.env.example` with all required variables (no values)
  - `.env.local` for local development (gitignored)
- **And** environment variables are validated at startup using Zod
- **And** server-only variables are not exposed to client
- **And** `.gitignore` includes all `.env*` files except `.env.example`

**Environment Variables Required:**
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Redis
REDIS_URL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Langfuse
LANGFUSE_PUBLIC_KEY=
LANGFUSE_SECRET_KEY=
LANGFUSE_HOST=

# App
NEXT_PUBLIC_APP_URL=
```

**Creates:** .env.example, lib/env.ts (Zod validation)

---

#### Story 0.1.14: Configure ESLint, Prettier, and Git Hooks

As a **developer**,
I want **code quality tools configured**,
So that **code style is consistent across the team**.

**Acceptance Criteria:**

- **Given** the monorepo exists
- **When** I configure linting and formatting
- **Then** ESLint is configured with:
  - `eslint-config-next`
  - `@typescript-eslint/eslint-plugin`
  - Custom rules for React hooks
- **And** Prettier is configured with consistent style
- **And** Husky is installed for git hooks
- **And** lint-staged runs ESLint and Prettier on staged files
- **And** commit-msg hook validates conventional commits

**Creates:** .eslintrc.js, .prettierrc, .husky/pre-commit, .husky/commit-msg, commitlint.config.js

---

#### Story 0.1.15: Configure CI/CD Pipeline

As a **developer**,
I want **GitHub Actions CI/CD pipeline configured**,
So that **code is automatically tested and validated**.

**Acceptance Criteria:**

- **Given** testing and linting are configured
- **When** I set up CI/CD
- **Then** `.github/workflows/ci.yml` includes:
  - Lint check on all PRs
  - Unit tests on all PRs
  - E2E tests on all PRs (Playwright)
  - TypeScript type checking
  - Build verification
- **And** workflows use pnpm caching
- **And** Matrix builds test Node 20.x
- **And** PR checks must pass before merge

**Creates:** .github/workflows/ci.yml, .github/workflows/e2e.yml

---

#### Story 0.1.16: Create Initial Database Schema

As a **developer**,
I want **the initial database schema created with RLS**,
So that **multi-tenancy is enforced from the start**.

**Acceptance Criteria:**

- **Given** Supabase is configured
- **When** I create the initial schema
- **Then** the following tables exist:
  - `organizations` (id, name, slug, created_at)
  - `organization_members` (org_id, user_id, role, created_at)
  - `workspaces` (id, org_id, name, created_at)
  - `projects` (id, workspace_id, name, type, created_at)
- **And** RLS is enabled on all tables
- **And** RLS policies enforce:
  - Users can only see orgs they belong to
  - Users can only see workspaces in their orgs
  - Users can only see projects in their workspaces
- **And** Supabase migrations are created in `supabase/migrations/`

**Technical Notes:**
- Use Clerk `user_id` in `organization_members`
- Configure Clerk JWT template for Supabase with `org_id` claim

**Creates:** supabase/migrations/00001_initial_schema.sql

---

#### Story 0.1.17: Configure Agno Agent Framework (Python Backend)

As a **developer**,
I want **Agno 2.4.0 configured as the agent execution framework**,
So that **agents can be orchestrated with memory, tools, and LLM integration**.

**Acceptance Criteria:**

- **Given** the monorepo structure exists
- **When** I configure the Agno backend
- **Then** a Python service is created at `apps/agent-service/`:
  ```
  apps/agent-service/
    src/
      agents/           # Agent definitions (Bond, Wendy, Morgan, Artie)
      tools/            # MCP tool implementations
      memory/           # Memory service integration
      workflows/        # Agno workflow definitions
    pyproject.toml      # Python dependencies
    Dockerfile          # Container config
  ```
- **And** `agno==2.4.0` is installed with dependencies:
  - `fastapi` for HTTP API
  - `uvicorn` for ASGI server
  - `psycopg[binary]` for PostgreSQL
  - `redis` for session memory
- **And** Agno is configured with:
  - `add_history_to_context=True`
  - `add_memories_to_context=True`
  - `enable_agentic_memory=True`
  - `db=PostgresDb()` for persistent memory
- **And** FastAPI endpoints expose agent execution
- **And** Health check endpoint at `/health`

**Technical Notes:**
- Agno provides context management, memory, and LLM orchestration
- This is the Python backend that Next.js frontend communicates with
- Use Poetry or uv for Python dependency management

**Environment Variables:**
- `DATABASE_URL` (PostgreSQL connection)
- `REDIS_URL` (session memory)
- `ANTHROPIC_API_KEY` (Claude access)

**Creates:** apps/agent-service/, pyproject.toml, Dockerfile

---

#### Story 0.1.18: Configure Temporal Workflow Orchestration

As a **developer**,
I want **Temporal configured for durable workflow execution**,
So that **long-running agent workflows can survive failures and be resumed**.

**Acceptance Criteria:**

- **Given** the Agno backend exists
- **When** I configure Temporal
- **Then** the following packages are installed:
  - `@temporalio/client` (Node.js client)
  - `@temporalio/worker` (Node.js worker)
  - `@temporalio/workflow` (workflow definitions)
  - `temporalio` (Python client for agent-service)
- **And** Temporal worker is configured in `apps/temporal-worker/`
- **And** Workflow definitions support:
  - Agent execution workflows
  - Scheduled workflow triggers
  - Human-in-the-loop approval waits
  - Retry policies with exponential backoff
- **And** Temporal client is exported from `packages/@platform/temporal`
- **And** Temporal dev server config for local development

**Technical Notes:**
- Temporal provides durable execution for workflows
- Workflows can pause for HITL and resume
- Use Temporal Cloud or self-hosted for production

**Environment Variables:**
- `TEMPORAL_ADDRESS`
- `TEMPORAL_NAMESPACE`
- `TEMPORAL_TASK_QUEUE`

**Creates:** apps/temporal-worker/, packages/@platform/temporal/

---

#### Story 0.1.19: Configure Anthropic SDK for Claude

As a **developer**,
I want **the Anthropic SDK configured for Claude API calls**,
So that **the platform can use Claude as the primary LLM**.

**Acceptance Criteria:**

- **Given** the backend services exist
- **When** I configure the Anthropic SDK
- **Then** the following are installed:
  - `@anthropic-ai/sdk` (TypeScript - for Next.js API routes)
  - `anthropic` (Python - for Agno agent-service)
- **And** Claude client is initialized with:
  - API key from environment
  - Default model: `claude-sonnet-4-20250514`
  - Retry configuration
  - Request timeout handling
- **And** Streaming support is configured for token-by-token responses
- **And** Tool use (function calling) is supported
- **And** Cost tracking integration with Langfuse

**Technical Notes:**
- Claude is the primary LLM for all agent interactions
- Support claude-sonnet-4 (default), claude-opus-4 (advanced), claude-haiku-4 (fast)
- Integrate with Langfuse for cost tracking per call

**Environment Variables:**
- `ANTHROPIC_API_KEY`

**Creates:** lib/llm/anthropic.ts, apps/agent-service/src/llm/claude.py

---

#### Story 0.1.20: Configure MCP (Model Context Protocol) Foundation

As a **developer**,
I want **MCP configured for standardized tool integration**,
So that **agents can use external tools through a unified protocol**.

**Acceptance Criteria:**

- **Given** the Agno backend exists
- **When** I configure MCP
- **Then** MCP server infrastructure is created:
  ```
  packages/@platform/mcp/
    server/           # MCP server implementation
    client/           # MCP client for tool calls
    registry/         # Tool registration
    types/            # TypeScript types for MCP
  ```
- **And** MCP server supports:
  - Tool registration with JSON Schema parameters
  - Tool execution with validation
  - Streaming results
  - Error handling
- **And** Built-in tools are scaffolded:
  - HTTP request tool
  - Database query tool (read-only)
  - File operation tool (sandboxed)
- **And** MCP client can discover and call tools

**Technical Notes:**
- MCP is the standard for LLM tool integration
- Follow MCP 2025-11-25 specification
- This enables Module Builder MCP Tool nodes

**Creates:** packages/@platform/mcp/

---

#### Story 0.1.21: Configure Resend Email Service

As a **developer**,
I want **Resend configured for transactional emails**,
So that **the platform can send verification, notification, and system emails**.

**Acceptance Criteria:**

- **Given** the API layer is configured
- **When** I configure Resend
- **Then** `resend` package is installed
- **And** Email service is created at `lib/email/resend.ts`
- **And** Email templates are configured for:
  - Email verification
  - Password reset
  - Team invitation
  - Workflow completion notification
  - Budget alert notification
- **And** React Email templates are set up in `packages/@platform/email-templates/`
- **And** Webhook handler for delivery status at `app/api/webhooks/resend/route.ts`

**Technical Notes:**
- Resend provides reliable transactional email
- Use React Email for template components
- Track delivery status via webhooks

**Environment Variables:**
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` (e.g., noreply@hyyve.com)

**Creates:** lib/email/resend.ts, packages/@platform/email-templates/, app/api/webhooks/resend/route.ts

---

#### Story 0.1.22: Configure OpenTelemetry Distributed Tracing

As a **developer**,
I want **OpenTelemetry configured for distributed tracing**,
So that **requests can be traced across all services**.

**Acceptance Criteria:**

- **Given** Langfuse is configured
- **When** I configure OpenTelemetry
- **Then** the following are installed:
  - `@opentelemetry/api`
  - `@opentelemetry/sdk-node`
  - `@opentelemetry/auto-instrumentations-node`
  - `@opentelemetry/exporter-trace-otlp-http`
- **And** OpenTelemetry is initialized in `instrumentation.ts` (Next.js)
- **And** Traces are exported to Langfuse
- **And** Custom spans are created for:
  - API route handlers
  - Database queries
  - LLM calls
  - External service calls
- **And** Trace context propagates across services

**Technical Notes:**
- OpenTelemetry provides vendor-neutral tracing
- Langfuse accepts OTLP traces
- Enable automatic instrumentation for common libraries

**Environment Variables:**
- `OTEL_EXPORTER_OTLP_ENDPOINT`
- `OTEL_SERVICE_NAME`

**Creates:** instrumentation.ts, lib/observability/tracing.ts

---

#### Story 0.1.23: Configure Docker Compose for Local Development

As a **developer**,
I want **Docker Compose configured for local development**,
So that **all services can be run locally with a single command**.

**Acceptance Criteria:**

- **Given** all service configurations exist
- **When** I configure Docker Compose
- **Then** `docker-compose.yml` includes:
  ```yaml
  services:
    web:              # Next.js frontend
    agent-service:    # Agno Python backend
    temporal-worker:  # Temporal worker
    postgres:         # PostgreSQL (Supabase local)
    redis:            # Redis for caching/pubsub
    temporal:         # Temporal server
    langfuse:         # Langfuse (self-hosted)
  ```
- **And** `docker-compose.override.yml` for dev-specific config
- **And** `.env.docker` with container-specific environment
- **And** Volume mounts for hot reload
- **And** Health checks for all services
- **And** `pnpm docker:up` script starts all services
- **And** Supabase local development is configured

**Technical Notes:**
- Use Supabase CLI for local PostgreSQL + Auth emulation
- Temporal dev server for local workflow testing
- Mount source code for hot reload in development

**Creates:** docker-compose.yml, docker-compose.override.yml, .env.docker, scripts/docker-up.sh

---

**Epic E0.1 Complete: 23 stories**

---

### Epic E0.2: Frontend Foundation & Design System

**Epic Goal:** Build the complete UI layer from Stitch wireframes, establishing design system, layouts, and page shells that can be developed in parallel with backend infrastructure
**FRs Covered:** None (Frontend foundation - enables parallel development)
**Screens:** All 146 wireframes in `_bmad-output/planning-artifacts/Stitch Hyyve/`
**NFRs:** NFR-MAINT-01, NFR-MAINT-02, NFR-PERF-01
**Research:** stitch-prompts-index.md, routing-specification.md, cross-reference-matrix.md

**Why This Epic:**
- Enables parallel frontend development while backend infrastructure (0-1-17 through 0-1-23) completes
- 146 wireframes are ready with complete HTML/Tailwind CSS
- Frontend can use mock data and AG-UI event mocks
- Reduces integration time when backend is ready

---

#### Story 0.2.1: Extract Design System from Wireframes

As a **developer**,
I want **the design tokens extracted from Stitch wireframes into Tailwind config**,
So that **all UI components match the established visual language**.

**Acceptance Criteria:**

- **Given** the Stitch wireframes use custom Tailwind config
- **When** I extract the design system
- **Then** `tailwind.config.ts` includes:
  ```typescript
  colors: {
    "primary": "#5048e5",
    "primary-dark": "#3e38b3",
    "background-light": "#f6f6f8",
    "background-dark": "#131221",
    "panel-dark": "#1c1a2e",
    "canvas-dark": "#0f1115",
    "border-dark": "#272546",
    "text-secondary": "#9795c6"
  }
  ```
- **And** custom font family "Inter" and "Noto Sans" are configured
- **And** custom border-radius values match wireframes
- **And** dark mode is the default (`class` strategy)
- **And** CSS custom properties are defined in `globals.css`
- **And** custom scrollbar styles are extracted

**Source:** `hyyve_module_builder/code.html` lines 16-79
**Creates:** Updated tailwind.config.ts, globals.css with custom properties

---

#### Story 0.2.2: Create shadcn Component Overrides

As a **developer**,
I want **shadcn/ui components customized to match Stitch design**,
So that **all UI components have the correct Hyyve visual style**.

**Acceptance Criteria:**

- **Given** shadcn/ui is installed with default styles
- **When** I override component styles
- **Then** Button component uses primary (#5048e5) with glow shadow
- **And** Card component uses panel-dark background with border-dark border
- **And** Input component has dark background with focus:border-primary
- **And** Dialog/Sheet components use panel-dark background
- **And** All components support dark mode as default
- **And** Component CSS variables match extracted design tokens

**Technical Notes:**
- Override via components.json and component file edits
- Create `components/ui/theme.ts` for shared style utilities

**Creates:** Updated components/ui/*.tsx, components/ui/theme.ts

---

#### Story 0.2.3: Create Layout Shells (App, Builder, Auth)

As a **developer**,
I want **reusable layout shells for different page types**,
So that **all pages share consistent structure and navigation**.

**Acceptance Criteria:**

- **Given** the routing specification defines layout groups
- **When** I create the layout shells
- **Then** `AppShell` provides:
  - Top navigation bar (h-16, logo, breadcrumbs, user avatar)
  - Collapsible sidebar navigation
  - Main content area
- **And** `BuilderLayout` provides:
  - Three-panel layout (left sidebar, center canvas, right chat)
  - Resizable panels
  - Canvas toolbar and zoom controls
- **And** `AuthLayout` provides:
  - Centered card layout
  - Hyyve branding
  - Social login buttons area
- **And** All layouts are responsive
- **And** Layouts use CSS Grid/Flexbox matching wireframes

**Source:** `hyyve_module_builder/code.html`, `hyyve_login_screen/code.html`
**Creates:** components/layouts/AppShell.tsx, BuilderLayout.tsx, AuthLayout.tsx

---

#### Story 0.2.4: Create Navigation Components

As a **developer**,
I want **navigation components matching wireframe patterns**,
So that **users can navigate the platform consistently**.

**Acceptance Criteria:**

- **Given** wireframes show consistent navigation patterns
- **When** I implement navigation components
- **Then** `TopNav` includes:
  - Hyyve logo with SVG
  - Breadcrumb navigation
  - Action buttons (Run, Save, Export)
  - Settings and user avatar
- **And** `Sidebar` includes:
  - Collapsible sections with icons
  - Active state highlighting
  - Hover transitions
- **And** `Breadcrumbs` shows current path with links
- **And** All navigation uses Next.js Link component
- **And** Mobile navigation with Sheet component

**Source:** `hyyve_module_builder/code.html` lines 83-129
**Creates:** components/nav/TopNav.tsx, Sidebar.tsx, Breadcrumbs.tsx, MobileNav.tsx

---

#### Story 0.2.5: Create Agent Chat Component

As a **developer**,
I want **a reusable agent chat interface component**,
So that **Bond, Wendy, Morgan, and Artie can interact with users consistently**.

**Acceptance Criteria:**

- **Given** wireframes show agent chat panels (right sidebar in builders)
- **When** I implement the chat component
- **Then** `AgentChat` includes:
  - Agent header with status indicator (online/offline)
  - Message list with agent and user message bubbles
  - Date dividers between message groups
  - Typing indicator (bouncing dots animation)
  - Quick action buttons in agent messages
  - Input area with attachment button and send
- **And** Component accepts `agentId` prop (bond|wendy|morgan|artie)
- **And** Agent avatar and colors vary by agent personality
- **And** Component has `onSendMessage` callback
- **And** Component accepts `messages` array for controlled mode

**Source:** `hyyve_module_builder/code.html` lines 346-427
**Creates:** components/chat/AgentChat.tsx, AgentMessage.tsx, UserMessage.tsx, ChatInput.tsx

---

#### Story 0.2.6: Create Flow Canvas Base (xyflow)

As a **developer**,
I want **a base flow canvas component using @xyflow/react**,
So that **Module Builder, Chatbot Builder, and Canvas Builder share a foundation**.

**Acceptance Criteria:**

- **Given** @xyflow/react is installed
- **When** I create the base canvas
- **Then** `FlowCanvas` includes:
  - Dot grid background pattern (matching wireframes)
  - Zoom controls (zoom in/out/fit)
  - Minimap component
  - Pan and zoom interactions
  - SVG connection lines with animation
- **And** Custom node wrapper with colored top border
- **And** Custom edge with animated dash pattern
- **And** Handle components for node connections
- **And** Canvas state management with Zustand
- **And** Undo/redo hook integration ready

**Source:** `hyyve_module_builder/code.html` lines 207-343
**Creates:** components/canvas/FlowCanvas.tsx, CanvasControls.tsx, NodeWrapper.tsx, CustomEdge.tsx

---

#### Story 0.2.7: Create AG-UI Mock Provider

As a **developer**,
I want **a mock AG-UI event provider for frontend development**,
So that **I can build and test UI without requiring the real backend**.

**Acceptance Criteria:**

- **Given** the protocol-events.yaml defines 25 AG-UI event types
- **When** I create the mock provider
- **Then** `MockAGUIProvider` can:
  - Simulate RUN_STARTED, RUN_FINISHED, RUN_ERROR events
  - Stream TEXT_MESSAGE_CONTENT with configurable delays
  - Emit TOOL_CALL_START/ARGS/END/RESULT sequences
  - Send STATE_SNAPSHOT and STATE_DELTA events
  - Track ACTIVITY_SNAPSHOT and ACTIVITY_DELTA
- **And** Provider has hooks: `useMockAgentStream()`, `useMockToolCall()`
- **And** Mock scenarios can be defined in JSON fixtures
- **And** Provider can be swapped for real AG-UI client in production

**Source:** protocol-events.yaml lines 1-212
**Creates:** lib/mock/ag-ui-provider.tsx, lib/mock/fixtures/*.json, hooks/useAgentStream.ts

---

#### Story 0.2.8: Implement Auth Pages (Clerk UI)

As a **developer**,
I want **authentication pages using Clerk's pre-built components**,
So that **users can sign in/up with the Hyyve visual style**.

**Acceptance Criteria:**

- **Given** Clerk is configured and AuthLayout exists
- **When** I implement auth pages
- **Then** `/sign-in` page renders with:
  - Hyyve branding and logo
  - Clerk `<SignIn />` component with custom appearance
  - Social provider buttons (Google, GitHub)
  - Link to sign-up
- **And** `/sign-up` page renders with:
  - Hyyve branding and logo
  - Clerk `<SignUp />` component with custom appearance
  - Social provider buttons
  - Link to sign-in
- **And** Clerk appearance is customized to match design tokens
- **And** Pages are accessible and responsive

**Source:** Wireframes 1.1.1, 1.1.2
**Creates:** app/(auth)/sign-in/[[...sign-in]]/page.tsx, app/(auth)/sign-up/[[...sign-up]]/page.tsx

---

#### Story 0.2.9: Implement Dashboard and Project Browser

As a **developer**,
I want **the main dashboard and project browser pages**,
So that **users can see their workspaces and projects**.

**Acceptance Criteria:**

- **Given** AppShell layout exists
- **When** I implement dashboard pages
- **Then** `/dashboard` shows:
  - Welcome message with user name
  - Quick action cards (Create Module, Create Chatbot, etc.)
  - Recent projects list
  - Usage summary widget
- **And** `/dashboard/projects` shows:
  - Project grid/list view toggle
  - Search and filter controls
  - Project cards with thumbnail, name, last modified
  - Create new project button
- **And** Pages use mock data initially
- **And** Pages are responsive (mobile-friendly)

**Source:** Wireframes 1.5.1, 1.5.2, `hyyve_home_dashboard/code.html`
**Creates:** app/(app)/dashboard/page.tsx, app/(app)/dashboard/projects/page.tsx

---

#### Story 0.2.10: Implement Settings Pages

As a **developer**,
I want **the settings pages structure**,
So that **users can manage their account and workspace settings**.

**Acceptance Criteria:**

- **Given** AppShell layout exists
- **When** I implement settings pages
- **Then** `/settings` has tabbed navigation:
  - Profile & Preferences
  - Account & Security
  - API Keys
  - Workspace Settings
  - Billing & Usage
- **And** Each tab renders appropriate form fields
- **And** Forms use react-hook-form + zod validation
- **And** API key management shows masked keys with copy button
- **And** Pages use mock data initially

**Source:** Wireframes 1.10.1-1.10.4, `user_profile_&_preferences/code.html`, `account_&_security_settings_1/code.html`
**Creates:** app/(app)/settings/page.tsx, app/(app)/settings/[tab]/page.tsx

---

#### Story 0.2.11: Implement Module Builder UI Shell

As a **developer**,
I want **the Module Builder page with three-panel layout**,
So that **users can see the visual workflow editor structure**.

**Acceptance Criteria:**

- **Given** BuilderLayout and FlowCanvas exist
- **When** I implement the Module Builder shell
- **Then** `/builders/module/[id]` shows:
  - Left panel: Knowledge Base file browser
  - Center: Flow canvas with sample nodes
  - Right panel: Agent Bond chat interface
- **And** Panels are resizable with drag handles
- **And** Sample workflow nodes are displayed (Input, LLM, Branch, Slack)
- **And** Node selection shows configuration in side panel
- **And** Page works with mock workflow data

**Source:** `hyyve_module_builder/code.html`
**Creates:** app/(app)/builders/module/[id]/page.tsx, components/builders/module/*.tsx

---

#### Story 0.2.12: Implement Chatbot Builder UI Shell

As a **developer**,
I want **the Chatbot Builder page structure**,
So that **users can see the conversation flow editor**.

**Acceptance Criteria:**

- **Given** BuilderLayout and FlowCanvas exist
- **When** I implement the Chatbot Builder shell
- **Then** `/builders/chatbot/[id]` shows:
  - Left panel: Intent/Entity management
  - Center: Conversation flow canvas
  - Right panel: Agent Wendy chat interface
  - Bottom panel: Chat preview/simulator
- **And** Sample conversation nodes displayed
- **And** Chat preview shows mock conversation
- **And** Page works with mock chatbot data

**Source:** `chatbot_builder_main/code.html`
**Creates:** app/(app)/builders/chatbot/[id]/page.tsx, components/builders/chatbot/*.tsx

---

#### Story 0.2.13: Implement Knowledge Base UI

As a **developer**,
I want **the Knowledge Base management pages**,
So that **users can view and manage their document collections**.

**Acceptance Criteria:**

- **Given** AppShell layout exists
- **When** I implement Knowledge Base pages
- **Then** `/knowledge` shows:
  - Knowledge base list with search
  - Create new KB button
  - KB cards with document count and size
- **And** `/knowledge/[id]` shows:
  - Document list (files uploaded)
  - Upload dropzone
  - Document details panel
  - Chunking and embedding status
- **And** Pages use mock document data
- **And** File upload component with progress

**Source:** Wireframes 1.4.1-1.4.8, `rag_pipeline_config/code.html`
**Creates:** app/(app)/knowledge/page.tsx, app/(app)/knowledge/[id]/page.tsx

---

#### Story 0.2.14: Implement Observability Dashboard UI

As a **developer**,
I want **the observability and analytics dashboard**,
So that **users can view execution traces and costs**.

**Acceptance Criteria:**

- **Given** AppShell layout exists
- **When** I implement observability pages
- **Then** `/observability` shows:
  - Execution trace list with filters
  - Cost summary cards
  - Usage graphs (mock data)
  - Recent errors panel
- **And** `/observability/traces/[id]` shows:
  - Trace timeline visualization
  - Node execution details
  - Token usage breakdown
  - Cost attribution
- **And** Charts use recharts or similar library
- **And** Pages use mock trace data

**Source:** Wireframes 1.7.1-1.7.5, `observability_dashboard/code.html`
**Creates:** app/(app)/observability/page.tsx, app/(app)/observability/traces/[id]/page.tsx

---

#### Story 0.2.15: Create Storybook Visual Regression Baseline

As a **developer**,
I want **Storybook configured with stories for all major components**,
So that **I can develop components in isolation and catch visual regressions**.

**Acceptance Criteria:**

- **Given** all UI components from stories 0.2.1-0.2.14 exist
- **When** I set up Storybook
- **Then** Storybook 8.x is installed and configured
- **And** Stories exist for:
  - All shadcn/ui component overrides
  - Layout shells (AppShell, BuilderLayout, AuthLayout)
  - Navigation components
  - AgentChat component with different agents
  - FlowCanvas with sample workflows
- **And** Chromatic or Percy integration is configured (optional)
- **And** Stories include dark mode decorator
- **And** Stories reference corresponding Stitch wireframes

**Creates:** .storybook/*, stories/*.stories.tsx, Storybook configuration

---

**Epic E0.2 Complete: 15 stories**

---

### Epic E1.1: User Authentication & Identity

**Epic Goal:** Users can create accounts, login securely, and enable multi-factor authentication
**FRs Covered:** FR1, FR2, FR3, FR4
**Screens:** 1.1.1, 1.1.2, 1.1.3, 1.1.4, 1.1.5, 1.1.6, 1.1.7, 1.10.2, 4.4.1, 4.4.2, 4.8.1
**NFRs:** NFR-SEC-01, NFR-SEC-05, NFR-SEC-06, NFR-INT-05, NFR-INT-08, NFR-INT-09
**Research:** T5-SSO (technical-sso-enterprise-auth-research-2026-01-21.md)

---

#### Story 1.1.1: User Registration with Email/Password

As a **new user**,
I want **to create an account using my email and password**,
So that **I can access the Hyyve platform**.

**Acceptance Criteria:**

- **Given** I am on the registration page (1.1.2)
- **When** I enter a valid email and password meeting complexity requirements
- **Then** my account is created and I receive a verification email
- **And** I cannot access protected features until email is verified
- **And** passwords are hashed using bcrypt with cost factor 12
- **And** the system validates email format and password strength client-side and server-side

**Implements:** FR1 (partial)
**Creates:** users table, email_verifications table

---

#### Story 1.1.2: User Registration with Social Providers

As a **new user**,
I want **to create an account using Google or GitHub OAuth**,
So that **I can sign up quickly without creating a new password**.

**Acceptance Criteria:**

- **Given** I am on the registration page
- **When** I click "Sign up with Google" or "Sign up with GitHub"
- **Then** I am redirected to the OAuth provider
- **And** upon successful authorization, my account is created
- **And** my profile is populated with provider data (name, email, avatar)
- **And** I can link additional social providers to my account later

**Implements:** FR1 (partial)
**Creates:** oauth_accounts table

---

#### Story 1.1.3: Organization & Onboarding Setup

As a **new user completing registration**,
I want **to set up my organization and personalize my experience**,
So that **the platform is configured for my team size and primary use case**.

**Acceptance Criteria:**

- **Given** I have verified my email (Screen 1.1.3)
- **When** I complete the organization setup wizard
- **Then** I provide organization name, type (Startup/SMB/Enterprise/Agency), and team size
- **And** I can select my primary builder interest (Module/Chatbot/Voice/Canvas)
- **And** I can opt into a guided tour
- **And** organization is created with me as owner
- **And** default workspace is created within the organization

**Implements:** FR8 (partial)
**Screens:** 1.1.3, 1.1.4
**Creates:** organizations table, onboarding_preferences table

---

#### Story 1.1.4: User Login with Email/Password

As a **registered user**,
I want **to log in with my email and password**,
So that **I can access my workspaces and projects**.

**Acceptance Criteria:**

- **Given** I am on the login page (1.1.1)
- **When** I enter valid credentials
- **Then** I am authenticated and redirected to my dashboard
- **And** JWT access token (15min) and refresh token (7d) are issued
- **And** tokens stored in httpOnly secure cookies
- **And** failed login attempts are rate-limited (5 per 15 minutes per IP)
- **And** account locks after 10 failed attempts (30 minute lockout)

**Implements:** FR1
**Research Reference:** T5-SSO §8 (Session Management)

---

#### Story 1.1.5: Password Reset Flow

As a **user who forgot my password**,
I want **to reset my password via email**,
So that **I can regain access to my account**.

**Acceptance Criteria:**

- **Given** I am on the forgot password page
- **When** I enter my registered email
- **Then** a password reset link is sent (valid for 1 hour)
- **And** the link is single-use and invalidated after use
- **And** I can set a new password meeting complexity requirements
- **And** all existing sessions are invalidated upon reset
- **And** rate limiting prevents abuse (3 reset requests per hour)

**Implements:** FR1 (account recovery)

---

#### Story 1.1.6: User Login with Social Providers

As a **registered user**,
I want **to log in using my linked social account**,
So that **I can access the platform without remembering a password**.

**Acceptance Criteria:**

- **Given** I have a linked social account
- **When** I click "Sign in with Google/GitHub"
- **Then** I am authenticated after OAuth flow
- **And** my session is created identically to email/password login
- **And** if the social account is not linked, I see an error message

**Implements:** FR1 (social login)

---

#### Story 1.1.7: MFA Setup - Method Selection

As a **security-conscious user**,
I want **to choose my preferred MFA method**,
So that **I can enable two-factor authentication that fits my workflow**.

**Acceptance Criteria:**

- **Given** I am in account security settings (Screen 1.1.5)
- **When** I click "Enable Two-Factor Authentication"
- **Then** I see options: Authenticator App (recommended), SMS, Email
- **And** I can select my preferred method
- **And** I can skip setup if desired (with warning)

**Implements:** FR2 (MFA method selection)
**Screens:** 1.1.5

---

#### Story 1.1.8: MFA Setup - TOTP Authenticator

As a **user who selected Authenticator App MFA**,
I want **to configure TOTP with my authenticator app**,
So that **I have strong two-factor authentication**.

**Acceptance Criteria:**

- **Given** I selected Authenticator App (Screen 1.1.6)
- **When** I scan the QR code with Google/Microsoft Authenticator
- **Then** a 160-bit secret is generated using crypto.randomBytes
- **And** QR code displays OTPAuth URI with issuer "Hyyve Platform"
- **And** manual entry code is available if scanning fails
- **And** I must verify with valid TOTP code before activation
- **And** secret is encrypted at rest (AES-256)

**Implements:** FR2 (TOTP setup)
**Research Reference:** T5-SSO §4.2 (otplib v13 implementation)
**Screens:** 1.1.6
**Creates:** mfa_settings table

---

#### Story 1.1.9: MFA - Backup Codes Generation

As a **user with MFA enabled**,
I want **to generate backup recovery codes**,
So that **I can recover my account if I lose my authenticator**.

**Acceptance Criteria:**

- **Given** I have enabled MFA (Screen 1.1.7)
- **When** MFA is activated
- **Then** 10 single-use backup codes are generated
- **And** codes are displayed once (not retrievable again)
- **And** codes are hashed (bcrypt) before storage
- **And** I can download/print codes
- **And** I can regenerate codes (invalidates previous)
- **And** each code is 8 characters (alphanumeric)

**Implements:** FR2 (backup codes)
**Research Reference:** T5-SSO §4.3
**Screens:** 1.1.7

---

#### Story 1.1.10: MFA - SMS Verification

As a **user who prefers SMS-based MFA**,
I want **to receive verification codes via text message**,
So that **I can use MFA without an authenticator app**.

**Acceptance Criteria:**

- **Given** I selected SMS Verification in MFA setup
- **When** I enter my phone number
- **Then** a verification code is sent via SMS
- **And** I must verify my phone number before activation
- **And** codes are 6 digits, valid for 5 minutes
- **And** rate limited to 5 SMS per hour
- **And** warning displayed about SIM swap risks

**Implements:** FR2 (SMS MFA)
**Screens:** 1.1.5, 1.10.2

---

#### Story 1.1.11: MFA - Login Verification

As a **user with MFA enabled**,
I want **to verify my identity during login**,
So that **my account remains secure**.

**Acceptance Criteria:**

- **Given** I entered valid credentials and have MFA enabled
- **When** I am prompted for MFA verification
- **Then** I can enter TOTP code, SMS code, or backup code
- **And** backup codes are marked used after consumption
- **And** failed MFA attempts rate-limited (5 per 15 minutes)
- **And** "Lost access?" link shows recovery options
- **And** successful verification completes login

**Implements:** FR2 (MFA verification)
**Research Reference:** T5-SSO §4.5

---

#### Story 1.1.12: Enterprise SSO - SAML Configuration

As an **enterprise admin**,
I want **to configure SAML 2.0 SSO for my organization**,
So that **my team authenticates via our corporate IdP**.

**Acceptance Criteria:**

- **Given** I am an organization admin (Screen 4.4.1)
- **When** I configure SAML settings
- **Then** I can enter IdP metadata (URL or upload XML)
- **And** I can configure attribute mappings (email, firstName, lastName, groups)
- **And** system generates SP metadata for IdP configuration
- **And** I can test SSO connection before enabling
- **And** JIT provisioning creates users on first login
- **And** users from my domain are redirected to IdP

**Implements:** FR3 (SAML)
**Research Reference:** T5-SSO §1 (SAML 2.0 Integration)
**Screens:** 4.4.1
**Creates:** sso_configurations table, idp_attribute_mappings table

---

#### Story 1.1.13: Enterprise SSO - OIDC Configuration

As an **enterprise admin**,
I want **to configure OIDC SSO for my organization**,
So that **my team can use OAuth 2.0/OIDC-compatible IdPs**.

**Acceptance Criteria:**

- **Given** I am an organization admin (Screen 4.4.1)
- **When** I configure OIDC settings
- **Then** I can enter client ID, client secret, issuer URL
- **And** system discovers endpoints via .well-known/openid-configuration
- **And** I can configure scopes (openid, profile, email)
- **And** ID tokens are validated per OIDC spec (signature, audience, expiry)
- **And** I can test connection before enabling

**Implements:** FR3 (OIDC)
**Research Reference:** T5-SSO §2 (OIDC Implementation)
**Screens:** 4.4.1

---

#### Story 1.1.14: SCIM User Provisioning

As an **enterprise admin**,
I want **users automatically provisioned/deprovisioned via SCIM**,
So that **user lifecycle is managed by our corporate directory**.

**Acceptance Criteria:**

- **Given** SCIM is enabled for my organization (Screens 4.4.2, 4.8.1)
- **When** my directory syncs changes
- **Then** POST /scim/v2/Users creates new users
- **And** PATCH /scim/v2/Users/{id} updates user attributes
- **And** PATCH with {"active": false} deactivates users (not deletes)
- **And** SCIM endpoints support 25 req/sec throughput
- **And** Rate limiting returns HTTP 429 with Retry-After header
- **And** Bearer token authentication secures endpoints
- **And** Groups resource syncs team memberships

**Implements:** FR4
**Research Reference:** T5-SSO §3 (SCIM 2.0), RFC 7644
**Screens:** 4.4.2, 4.8.1
**Creates:** scim_tokens table, scim_sync_logs table

---

**Epic E1.1 Complete: 14 stories**

---

### Epic E1.2: API Key Management

**Research:** T8-UI (technical-ui-gaps-research-2026-01-23.md - Section 5)
**UX Screens:** 1.10.3 (API Keys Management)
**Implements:** FR5, FR6, FR7

---

#### Story 1.2.1: API Key Creation with Scopes

As an **organization admin**,
I want **to create API keys with specific scopes and permissions**,
So that **I can provide secure, least-privilege access to external integrations**.

**Acceptance Criteria:**

- **Given** I am on the API Keys Management page (1.10.3)
- **When** I click "Create API Key"
- **Then** I can:
  - Enter a descriptive key name
  - Select environment (Development/Staging/Production)
  - Choose scopes via checkboxes (Execute workflows, Read KBs, Write KBs, Read modules, Write modules, Admin access)
  - Set expiration (Never or After N days)
  - Confirm creation
- **And** the full key is displayed ONLY ONCE with copy button
- **And** key is stored as SHA-256 hash (never plaintext)
- **And** key has appropriate prefix (ak_dev_, ak_stg_, ak_live_)

**Technical Notes:**
- Use `randomBytes(24).toString('base64url')` for key generation
- Store key_hash, key_prefix, never the full key
- Map UI scopes to: chatbot:invoke, chatbot:read, chatbot:write, module:invoke, module:read, module:write, voice:invoke, voice:read, voice:write, analytics:read, webhook:manage

**Implements:** FR5 (partial)
**Creates:** api_keys table

---

#### Story 1.2.2: API Key Environment Configuration

As an **organization admin**,
I want **to create separate API keys for different environments**,
So that **I can safely test integrations without affecting production data**.

**Acceptance Criteria:**

- **Given** I am creating an API key
- **When** I select the Environment toggle (1.10.3)
- **Then** I can choose between Development, Staging, and Production
- **And** each environment has a distinct key prefix:
  - Development: `ak_dev_`
  - Staging: `ak_stg_`
  - Production: `ak_live_`
- **And** environment is displayed on the key card after creation

**Implements:** FR5 (partial)

---

#### Story 1.2.3: API Key Rate Limiting

As an **organization admin**,
I want **to set rate limits on API keys**,
So that **I can prevent abuse and control API usage costs**.

**Acceptance Criteria:**

- **Given** I am creating or editing an API key
- **When** I configure rate limits
- **Then** I can set:
  - Requests per minute (default: 60)
  - Requests per day (default: 10,000)
- **And** the key card displays current rate limit (e.g., "1000 req/min")
- **And** API returns 429 with X-RateLimit-* headers when exceeded

**Technical Notes:**
- Use Redis for rate limit tracking: `INCR rate_limit:{key_id}:{minute}`
- Return headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset

**Implements:** FR6

---

#### Story 1.2.4: Enterprise IP Allowlisting

As an **enterprise organization admin**,
I want **to restrict API key usage to specific IP addresses**,
So that **my API keys can only be used from authorized locations**.

**Acceptance Criteria:**

- **Given** I am on the API Key configuration screen (1.10.3)
- **When** I enter IP addresses in the IP Restrictions field
- **Then** I can add multiple IP addresses (IPv4/IPv6)
- **And** requests from non-allowed IPs receive 403 Forbidden
- **And** empty allowlist means all IPs are permitted

**Implements:** FR7

---

#### Story 1.2.5: CORS Origin Restrictions

As an **organization admin**,
I want **to restrict API key usage to specific domains**,
So that **my embedded widgets only work on authorized websites**.

**Acceptance Criteria:**

- **Given** I am configuring an API key for embedded use
- **When** I add allowed origins
- **Then** I can specify multiple domain origins (e.g., `https://client.com`)
- **And** requests with non-matching Origin headers receive 403
- **And** the BFF layer validates origin before processing

**Technical Notes:**
- Store as `allowed_origins TEXT[]` in api_keys table
- Validate in BFF embed API layer before forwarding requests

**Implements:** FR7 (partial)

---

#### Story 1.2.6: API Key Listing & Management

As an **organization admin**,
I want **to view and manage all my organization's API keys**,
So that **I can maintain security oversight**.

**Acceptance Criteria:**

- **Given** I am on the API Keys Management page (1.10.3)
- **When** the page loads
- **Then** I see a list of all keys with:
  - Key name
  - Masked key display (showing prefix + last 4 chars)
  - Environment badge
  - Scopes/permissions summary
  - Created date
  - Last used date
  - Status (Active/Expired/Revoked)
- **And** I can search/filter by name, environment, or status

**Implements:** FR5 (partial)

---

#### Story 1.2.7: API Key Rotation

As an **organization admin**,
I want **to rotate API keys without service interruption**,
So that **I can maintain security without downtime**.

**Acceptance Criteria:**

- **Given** I have an existing API key
- **When** I click "Rotate Key"
- **Then** a new key is generated with the same scopes/settings
- **And** both old and new keys work for a grace period (configurable: 1-24 hours)
- **And** I can manually revoke the old key immediately if needed
- **And** the new key is displayed ONLY ONCE

**Implements:** FR6

---

#### Story 1.2.8: API Key Revocation

As an **organization admin**,
I want **to immediately revoke compromised API keys**,
So that **I can prevent unauthorized access**.

**Acceptance Criteria:**

- **Given** I am viewing an API key's details
- **When** I click "Revoke Key" and confirm
- **Then** the key is immediately invalidated
- **And** `revoked_at` timestamp is recorded
- **And** all subsequent requests using that key receive 401 Unauthorized
- **And** the key card shows "Revoked" status

**Implements:** FR5 (partial)

---

#### Story 1.2.9: API Key Usage Analytics

As an **organization admin**,
I want **to view usage statistics for each API key**,
So that **I can monitor consumption and identify issues**.

**Acceptance Criteria:**

- **Given** I am viewing an API key's details (1.10.3 - usage bar)
- **When** I view usage statistics
- **Then** I see:
  - Requests today/this month
  - Usage trend graph
  - Top endpoints by request count
  - Error rate (4xx/5xx responses)
  - Average response time
- **And** data is available from the api_key_usage table

**Technical Notes:**
- Log to `api_key_usage` table: endpoint, method, status_code, response_time_ms, ip_address, user_agent
- Partition by month for efficient querying

**Implements:** FR6 (partial)
**Creates:** api_key_usage table

---

#### Story 1.2.10: API Key Expiration Management

As an **organization admin**,
I want **to set expiration dates on API keys**,
So that **temporary integrations automatically lose access**.

**Acceptance Criteria:**

- **Given** I am creating an API key (1.10.3 - Expiration field)
- **When** I set expiration to "After N days"
- **Then** the key automatically becomes invalid after that period
- **And** expired keys are flagged in the listing
- **And** I receive notification 7 days before expiration
- **And** I can set "Never" for keys that shouldn't expire

**Implements:** FR5 (partial)

---

**Epic E1.2 Complete: 10 stories**

---

### Epic E1.3: Workspace & Project Management

**Research:** T1-SAAS (technical-multi-tenant-saas-research-2026-01-20.md), T8-UI §1
**UX Screens:** 1.5.1 (Home Dashboard), 1.5.2 (Project Browser), 1.10.4 (Workspace Settings), 2.13.1 (Tenant Switcher), 2.13.2 (Tenant Isolation Config), 4.4.2, 4.7.1, 4.8.3, 5.1.2
**Implements:** FR8, FR9, FR10, FR11, FR12, FR13, FR14, FR15, FR16

---

#### Story 1.3.1: Workspace Creation

As a **user**,
I want **to create workspaces to organize my work**,
So that **I can separate projects for different teams or purposes**.

**Acceptance Criteria:**

- **Given** I am logged in
- **When** I create a new workspace
- **Then** I can enter:
  - Workspace name
  - Workspace URL slug (e.g., acme-corp)
  - Description (optional)
  - Workspace icon (256x256px, PNG/SVG)
- **And** the workspace is created with me as owner
- **And** I am redirected to the workspace home dashboard (1.5.1)

**Implements:** FR8
**Screens:** 1.5.1, 1.10.4
**Creates:** workspaces table

---

#### Story 1.3.2: Project Creation within Workspace

As a **workspace member**,
I want **to create multiple projects within my workspace**,
So that **I can organize work by application or use case**.

**Acceptance Criteria:**

- **Given** I am in a workspace with create permissions (1.5.2)
- **When** I click "+ New Project"
- **Then** I can enter:
  - Project name
  - Project description
  - Builder type(s) (Module, Chatbot, Voice, Canvas)
- **And** the project is created under my current workspace
- **And** the project appears in the Project Browser

**Implements:** FR9
**Screens:** 1.5.1, 1.5.2
**Creates:** projects table

---

#### Story 1.3.3: Team Member Invitation with Roles

As a **workspace owner or admin**,
I want **to invite team members with role-based permissions**,
So that **I can control who can access and modify resources**.

**Acceptance Criteria:**

- **Given** I am on Workspace Settings → Team (1.10.4)
- **When** I invite a new member
- **Then** I can:
  - Enter email address
  - Select role: Owner, Admin, Member, Viewer
  - Optionally restrict to specific projects
- **And** an invitation email is sent
- **And** upon acceptance, the user is added with the assigned role
- **And** permissions are enforced via Clerk Organizations RBAC

**Role Permissions:**
- Owner: All permissions, can delete workspace
- Admin: Manage members, settings, all projects
- Member: Create/edit projects, cannot manage settings
- Viewer: Read-only access

**Implements:** FR10
**Screens:** 1.10.4, 4.4.2, 5.1.2
**Research Reference:** T8-UI §1 (Clerk Organizations)

---

#### Story 1.3.4: Workspace Switching

As a **user with multiple workspace memberships**,
I want **to switch between workspaces without logging out**,
So that **I can work across different organizations seamlessly**.

**Acceptance Criteria:**

- **Given** I am logged in and belong to multiple workspaces (2.13.1)
- **When** I click the workspace switcher
- **Then** I see a list of all my workspaces with:
  - Workspace icon
  - Workspace name
  - My role in each
- **And** I can select a different workspace
- **And** the context switches immediately (JWT claims updated)
- **And** I can create or join new organizations

**Implements:** FR11
**Screens:** 1.5.2, 2.13.1
**Research Reference:** T5-SSO §8

---

#### Story 1.3.5: Project Folder Organization

As a **workspace member**,
I want **to organize projects into folders or categories**,
So that **I can maintain structure as the number of projects grows**.

**Acceptance Criteria:**

- **Given** I am in the Project Browser (1.5.2)
- **When** I click "+ New Folder"
- **Then** I can create a named folder
- **And** I can drag projects into folders
- **And** I can nest folders up to 3 levels deep
- **And** I can expand/collapse folder trees
- **And** search works across all folders

**Implements:** FR12
**Screens:** 1.5.2
**Creates:** project_folders table, project_folder_memberships junction table

---

#### Story 1.3.6: Project Duplication as Template

As a **workspace member**,
I want **to duplicate existing projects as templates**,
So that **I can reuse successful configurations**.

**Acceptance Criteria:**

- **Given** I am viewing a project in Project Browser (1.5.2)
- **When** I select "Duplicate as Template" from context menu
- **Then** I can:
  - Enter new project name
  - Choose what to include (workflows, settings, KB config, not data)
  - Select target folder
- **And** a new project is created with copied configuration
- **And** the original project is unchanged

**Implements:** FR13
**Screens:** 1.5.2, 2.12.1
**Research Reference:** T1-VWB §8

---

#### Story 1.3.7: Project Archive and Restore

As a **workspace admin**,
I want **to archive and restore projects**,
So that **I can declutter without permanently losing work**.

**Acceptance Criteria:**

- **Given** I am viewing a project
- **When** I select "Archive Project"
- **Then** the project is marked as archived
- **And** it no longer appears in the main project list
- **And** it appears in "Archived Projects" view
- **And** archived projects can be restored
- **And** archived projects can be permanently deleted after 30 days

**Implements:** FR14
**Screens:** 1.5.2
**Research Reference:** T4-VER §5

---

#### Story 1.3.8: Row-Level Security Tenant Isolation

As a **platform operator**,
I want **tenant data isolated via Row-Level Security**,
So that **no user can access another tenant's data**.

**Acceptance Criteria:**

- **Given** the database schema is configured
- **When** any query is executed
- **Then** RLS policies automatically filter by workspace_id
- **And** workspace_id is extracted from JWT claims (auth.jwt() ->> 'org_id')
- **And** all tables with tenant data have RLS enabled
- **And** cross-tenant queries return no results (not errors)
- **And** RLS cannot be bypassed via SQL injection

**Technical Notes:**
- Use Supabase RLS with Clerk JWT template
- Include org_id, org_role, permissions in JWT claims
- Add indexes on workspace_id for performance

**Implements:** FR15
**Screens:** 2.13.2, 4.7.1
**Research Reference:** T1-SAAS §3-6 (Hybrid RLS approach)

---

#### Story 1.3.9: Enterprise Dedicated Database Isolation

As an **enterprise customer**,
I want **dedicated database isolation for my organization**,
So that **my data is physically separated from other tenants**.

**Acceptance Criteria:**

- **Given** I am on an Enterprise plan (Screen 4.8.3)
- **When** my organization is provisioned
- **Then** a dedicated PostgreSQL database is created
- **And** connection routing directs my traffic to the dedicated instance
- **And** I can configure data residency (region selection)
- **And** backups are tenant-specific
- **And** I have independent scaling

**Technical Notes:**
- Use Neon branch-per-tenant or dedicated instances
- Maintain tenant registry in shared control plane
- Connection pooling via PgBouncer per tenant

**Implements:** FR16
**Screens:** 2.13.2, 4.8.3
**Research Reference:** T1-SAAS §4 (Database Per Tenant)

---

#### Story 1.3.10: Workspace Settings Management

As a **workspace owner**,
I want **to configure workspace-wide settings**,
So that **I can enforce policies across all projects**.

**Acceptance Criteria:**

- **Given** I am on Workspace Settings (1.10.4)
- **When** I configure settings
- **Then** I can set:
  - Default LLM provider and model
  - Default embedding model
  - Cost tracking enabled/disabled
  - Auto-archive period for unused modules
  - Module publishing approval requirement
- **And** these defaults apply to new projects
- **And** individual projects can override if permitted

**Implements:** FR8 (partial)
**Screens:** 1.10.4

---

#### Story 1.3.11: Workspace Security Policies

As a **workspace owner**,
I want **to configure security policies for my workspace**,
So that **I can enforce organizational security requirements**.

**Acceptance Criteria:**

- **Given** I am on Workspace Settings → Security (1.10.4)
- **When** I configure security policies
- **Then** I can set:
  - Require MFA for all team members (checkbox)
  - Enforce SSO login when configured (checkbox)
  - Restrict API access to allowlisted IPs (checkbox)
  - Session timeout (hours)
  - Password policy strength
  - Data retention period (days)
  - Enable audit logging (checkbox)
- **And** policies are enforced on next login
- **And** audit logs record policy changes

**Implements:** FR8 (partial)
**Screens:** 1.10.4, 2.13.2
**NFRs:** NFR-SEC-02, NFR-SEC-03

---

#### Story 1.3.12: Workspace Integrations

As a **workspace admin**,
I want **to connect external integrations to my workspace**,
So that **I can receive notifications and sync data**.

**Acceptance Criteria:**

- **Given** I am on Workspace Settings → Integrations (1.10.4)
- **When** I configure integrations
- **Then** I can:
  - Connect Slack workspace and select notification channel
  - Connect GitHub organization
  - View connection status for each integration
  - Disconnect integrations
- **And** integration OAuth flows are secure
- **And** connection status shows as connected/not connected

**Implements:** FR8 (partial)
**Screens:** 1.10.4

---

#### Story 1.3.13: Home Dashboard with Quick Actions

As a **workspace member**,
I want **to see a home dashboard with quick actions and activity**,
So that **I can quickly navigate to common tasks**.

**Acceptance Criteria:**

- **Given** I enter a workspace (1.5.1)
- **When** the home dashboard loads
- **Then** I see:
  - Greeting with my name
  - Quick action cards (Module Builder, Chatbot Builder, Voice Agent, Canvas Builder)
  - Recent projects (last 3, with type icons and last edited time)
  - Activity feed (recent events)
  - Usage this month (API calls, cost, quota percentage)
- **And** clicking quick actions opens the respective builder
- **And** clicking recent projects opens them

**Implements:** FR8, FR9 (partial)
**Screens:** 1.5.1

---

**Epic E1.3 Complete: 13 stories**

---

### Epic E1.4: Module Builder - Core Canvas

**Research:** T1-VWB (technical-visual-workflow-builders-research-2026-01-20.md)
**UX Screens:** 1.2.1 (Module Builder Main View), 1.2.2 (Node Configuration), 1.2.3 (Execution Monitor), 1.2.4 (Code Export), 1.2.5 (Framework Selection), 1.2.6 (Generated Code Viewer)
**Implements:** FR17, FR24, FR26, FR27, FR28, FR30, FR31

---

#### Story 1.4.1: Visual Node-Based Workflow Editor

As a **module builder user**,
I want **to create visual workflows using a node-based editor**,
So that **I can design agent orchestration without writing code**.

**Acceptance Criteria:**

- **Given** I am in the Module Builder (1.2.1)
- **When** I open a new or existing module
- **Then** I see a ReactFlow canvas with:
  - Left panel: Knowledge Base sources and Entity Graph
  - Center: Node canvas with connectable nodes
  - Right panel: Chat agent (Bond) for conversational building
  - Bottom: Node library with drag-and-drop nodes
- **And** I can drag nodes from library onto canvas
- **And** nodes snap to grid for alignment
- **And** canvas renders smoothly at 60fps

**Technical Notes:**
- Use ReactFlow with Zustand for state management
- Implement node types per T1-VWB architecture

**Implements:** FR17
**Screens:** 1.2.1
**Research Reference:** T1-VWB §2-5 (Dify Architecture)

---

#### Story 1.4.2: Node Connection with Type Validation

As a **module builder user**,
I want **to connect nodes with validated type-checking**,
So that **incompatible connections are prevented**.

**Acceptance Criteria:**

- **Given** I have nodes on the canvas
- **When** I drag from an output handle to an input handle
- **Then** connection is created if types are compatible
- **And** incompatible connections show visual feedback (red line, tooltip)
- **And** valid connections show green preview while dragging
- **And** connection validation uses ReactFlow `isValidConnection` callback
- **And** connected edges are styled based on data type (string, array, object)

**Type Compatibility Rules:**
- String → String, Any
- Array → Array, Any
- Object → Object, Any
- Any → All types accepted

**Implements:** FR24
**Screens:** 1.2.1
**Research Reference:** T1-VWB §5 (Connection validation)

---

#### Story 1.4.3: Undo/Redo History

As a **module builder user**,
I want **undo/redo functionality for workflow editing**,
So that **I can recover from mistakes**.

**Acceptance Criteria:**

- **Given** I am editing a workflow
- **When** I make changes (add node, delete, move, connect)
- **Then** each change is recorded in history
- **And** Cmd/Ctrl+Z undoes the last action
- **And** Cmd/Ctrl+Shift+Z redoes the last undone action
- **And** history maintains up to 50 states
- **And** undo/redo buttons are available in toolbar

**Technical Notes:**
- Use Zustand history store pattern per T1-VWB
- Track node positions, connections, configurations

**Implements:** FR26
**Screens:** 1.2.1
**Research Reference:** T1-VWB §2 (History provider)

---

#### Story 1.4.4: Workflow Save and Load as JSON

As a **module builder user**,
I want **to save and load workflow configurations as JSON**,
So that **I can persist my work and share configurations**.

**Acceptance Criteria:**

- **Given** I have a workflow on canvas
- **When** I click Save (💾) or Cmd/Ctrl+S
- **Then** workflow is saved to database as JSON
- **And** save includes: nodes, edges, positions, configurations
- **And** I can load previous versions
- **And** I can export workflow as downloadable JSON file
- **And** I can import JSON files to create workflows

**JSON Schema:**
```json
{
  "version": "1.0",
  "nodes": [...],
  "edges": [...],
  "variables": [...],
  "metadata": {...}
}
```

**Implements:** FR27
**Screens:** 1.2.4, 1.2.6
**Research Reference:** T1-VWB §8

---

#### Story 1.4.5: Canvas Navigation (Zoom, Pan, Minimap)

As a **module builder user**,
I want **to zoom, pan, and use a minimap for navigation**,
So that **I can work with large workflows efficiently**.

**Acceptance Criteria:**

- **Given** I have a workflow on canvas
- **When** I interact with the canvas
- **Then** I can:
  - Zoom with scroll wheel (10%-200% range)
  - Pan by dragging empty canvas area
  - Use minimap to see overview and click to navigate
  - Fit view to show all nodes (keyboard: F)
  - Reset zoom to 100% (keyboard: 0)
- **And** zoom level is displayed in corner
- **And** minimap shows node positions and current viewport

**Implements:** FR28
**Screens:** 1.2.1
**Research Reference:** T1-VWB §5 (ReactFlow fitView, setViewport)

---

#### Story 1.4.6: Comment Annotations on Nodes

As a **module builder user**,
I want **to add comment annotations to nodes**,
So that **I can document my workflow for myself and others**.

**Acceptance Criteria:**

- **Given** I have nodes on canvas
- **When** I right-click a node and select "Add Comment"
- **Then** a comment box appears attached to the node
- **And** I can type text in the comment
- **And** comments can be collapsed/expanded
- **And** comments are saved with the workflow
- **And** I can add standalone comment nodes (not attached to any node)

**Implements:** FR30
**Screens:** 1.2.1
**Research Reference:** T1-VWB §8

---

#### Story 1.4.7: Workflow Validation (DAG Check)

As a **module builder user**,
I want **the system to validate my workflow before execution**,
So that **I catch errors before running**.

**Acceptance Criteria:**

- **Given** I have a workflow
- **When** I click Run (▶) or explicit Validate
- **Then** system checks:
  - DAG structure (no cycles)
  - All required inputs are connected
  - All node configurations are complete
  - Start node exists
  - End node or output exists
- **And** validation errors show inline on affected nodes
- **And** error panel shows summary with links to problem nodes
- **And** workflow cannot execute if validation fails

**Implements:** FR31
**Screens:** 1.2.1, 1.2.3, 1.2.5
**Research Reference:** T7-CANVAS §8.1 (DAG validation)

---

#### Story 1.4.8: Node Library and Search

As a **module builder user**,
I want **a searchable node library with categorized nodes**,
So that **I can quickly find and add the nodes I need**.

**Acceptance Criteria:**

- **Given** I am in Module Builder (1.2.1)
- **When** I view the Node Library (bottom panel)
- **Then** I see categorized nodes:
  - LLM nodes (Prompt, Sub-Agent)
  - Tool nodes (MCP, Skill, API Call)
  - Control nodes (Branch, Switch, Loop)
  - Action nodes (Email, Slack, Webhook)
- **And** I can search nodes by name
- **And** I can drag nodes to canvas
- **And** hovering shows node description tooltip

**Implements:** FR17 (partial)
**Screens:** 1.2.1

---

#### Story 1.4.9: Node Configuration Panel

As a **module builder user**,
I want **to configure nodes via a detail panel**,
So that **I can set parameters for each node**.

**Acceptance Criteria:**

- **Given** I have a node on canvas
- **When** I double-click or select the node
- **Then** configuration panel opens (1.2.2)
- **And** I can configure:
  - Node name
  - Model selection (for LLM nodes)
  - System prompt with AI improvement option
  - Temperature and other parameters
  - Input/output mappings with variable syntax
- **And** changes are reflected immediately on canvas
- **And** panel has Cancel/Save buttons

**Implements:** FR17 (partial)
**Screens:** 1.2.2, 1.2.2a

---

#### Story 1.4.10: Context Menu Operations

As a **module builder user**,
I want **context menu operations on nodes**,
So that **I can quickly perform common actions**.

**Acceptance Criteria:**

- **Given** I have nodes on canvas
- **When** I right-click a node
- **Then** context menu shows:
  - Edit (opens config panel)
  - Duplicate (creates copy with offset)
  - Copy (to clipboard)
  - Delete (with confirmation for connected nodes)
  - Add Comment
  - Group (if multiple selected)
- **And** keyboard shortcuts work (Delete, Cmd+D, Cmd+C)
- **And** multi-select works with Shift+Click or drag selection

**Implements:** FR17 (partial)
**Screens:** 1.2.1

---

**Epic E1.4 Complete: 10 stories**

---

### Epic E1.5: Module Builder - Node Types

**Research:** T1-VWB §6-7, T1-CLAUDE §2-4, T5-MCP §5
**UX Screens:** 1.2.2, 1.2.2a, 1.2.2c, 1.2.2d, 2.1.4-2.1.6, 2.4.1-2.4.2, 3.1.3-3.1.4
**Implements:** FR18, FR19, FR20, FR21, FR22, FR23, FR25, FR29

---

#### Story 1.5.1: Prompt Nodes with Variable Interpolation

As a **module builder user**,
I want **to add Prompt nodes with variable interpolation**,
So that **I can create dynamic prompts using workflow data**.

**Acceptance Criteria:**

- **Given** I drag a Prompt node to canvas
- **When** I configure the prompt (1.2.2a)
- **Then** I can:
  - Enter prompt text with `{{variable}}` syntax
  - Use autocomplete to select from available variables
  - Preview interpolated values in real-time
  - Attach KB context with `{{kb.search(query)}}`
- **And** variables are validated to exist in VariablePool
- **And** type mismatches show warnings

**Variable Syntax:** `{{#node_id.output_field#}}` (Dify-style)

**Implements:** FR18
**Screens:** 1.2.2, 1.2.2a
**Research Reference:** T1-VWB §6 (VariablePool)

---

#### Story 1.5.2: Sub-Agent Nodes

As a **module builder user**,
I want **to add Sub-Agent nodes with system prompts, tools, and model selection**,
So that **I can orchestrate specialized AI agents within my workflow**.

**Acceptance Criteria:**

- **Given** I drag a Sub-Agent node to canvas
- **When** I configure it
- **Then** I can:
  - Define system prompt for agent persona
  - Select model (Claude Opus/Sonnet/Haiku)
  - Attach tools (MCP servers, Skills)
  - Set max iterations for agentic loops
  - Configure memory/context settings
- **And** agent execution follows ReAct pattern
- **And** tool calls are logged in execution trace

**Implements:** FR19
**Screens:** 1.2.2a
**Research Reference:** T1-CLAUDE §2-4 (Claude Agent SDK)

---

#### Story 1.5.3: MCP Tool Nodes

As a **module builder user**,
I want **to add MCP Tool nodes to call installed MCP servers**,
So that **I can integrate external capabilities into workflows**.

**Acceptance Criteria:**

- **Given** I have MCP servers installed
- **When** I drag an MCP Tool node to canvas
- **Then** I can:
  - Select from installed MCP servers
  - Choose specific tool from server's toolset
  - Map inputs from workflow variables
  - Configure timeout and retry settings
- **And** tool schema is displayed for reference
- **And** execution respects MCP protocol

**Implements:** FR20
**Screens:** 2.1.4, 2.1.5, 2.1.6
**Research Reference:** T5-MCP

---

#### Story 1.5.4: Skill Nodes

As a **module builder user**,
I want **to add Skill nodes to execute installed Skills**,
So that **I can use reusable prompt templates and workflows**.

**Acceptance Criteria:**

- **Given** I have Skills installed
- **When** I drag a Skill node to canvas
- **Then** I can:
  - Browse installed Skills
  - Select Skill from list with description
  - Map arguments per SKILL.md frontmatter
  - Configure execution parameters
- **And** Skill frontmatter is validated (YAML)
- **And** Skill paths are resolved during execution

**Implements:** FR21
**Screens:** 3.1.3, 3.1.4, 1.2.2
**Research Reference:** T5-MCP §5 (Skills format)

---

#### Story 1.5.5: Control Flow Nodes (If/Else, Switch, Loop)

As a **module builder user**,
I want **to add Control Flow nodes**,
So that **I can create conditional and iterative workflows**.

**Acceptance Criteria:**

- **Given** I need conditional logic
- **When** I add Control Flow nodes (1.2.2c)
- **Then** I can use:
  - **If/Else**: Branch based on condition expression
  - **Switch**: Multi-way branch on value matching
  - **Loop**: Iterate over array with configurable max iterations
  - **Merge**: Combine branches back together
- **And** conditions support JavaScript expressions
- **And** loop prevents infinite iteration (max 1000)

**Implements:** FR22
**Screens:** 1.2.2c
**Research Reference:** T1-VWB §6

---

#### Story 1.5.6: AskUserQuestion Nodes (HITL)

As a **module builder user**,
I want **to add AskUserQuestion nodes for human-in-the-loop**,
So that **workflows can pause for human input**.

**Acceptance Criteria:**

- **Given** I need human intervention
- **When** I add an AskUserQuestion node
- **Then** I can configure:
  - Question text (supports variable interpolation)
  - Input type (text, select, multi-select, file)
  - Options (for select types)
  - Timeout (auto-continue or fail)
  - Notification channel (email, Slack, in-app)
- **And** workflow pauses at this node
- **And** AG-UI INTERRUPT event is emitted
- **And** workflow resumes when user responds

**Implements:** FR23
**Screens:** 1.2.2, 2.4.1, 2.4.2
**Research Reference:** T1-CLAUDE §3 (AskUserQuestion tool)

---

#### Story 1.5.7: Variable Pool Management

As a **module builder user**,
I want **to define variables in a namespace-isolated Variable Pool**,
So that **I can manage workflow state cleanly**.

**Acceptance Criteria:**

- **Given** I am building a workflow (1.2.2d)
- **When** I manage variables
- **Then** I can:
  - Create workflow-scoped variables
  - Set default values and types
  - View all available variables in panel
  - See variable sources (inputs, node outputs, constants)
- **And** variables are namespace-isolated per workflow
- **And** variable selector provides autocomplete
- **And** type validation warns on mismatches

**Implements:** FR25
**Screens:** 1.2.2, 1.2.2d
**Research Reference:** T1-VWB §7 (VariablePool)

---

#### Story 1.5.8: Group Nodes into Sub-Workflows

As a **module builder user**,
I want **to group nodes into reusable sub-workflows**,
So that **I can modularize complex workflows**.

**Acceptance Criteria:**

- **Given** I have multiple nodes selected
- **When** I click "Group" or Cmd+G
- **Then** nodes are collapsed into a single group node
- **And** I can name the group
- **And** group exposes input/output handles based on external connections
- **And** I can double-click to expand and edit internals
- **And** groups can be saved as templates for reuse

**Implements:** FR29
**Screens:** 1.2.1, 2.12.1
**Research Reference:** T1-VWB §6

---

**Epic E1.5 Complete: 8 stories**

---

### Epic E1.6: Conversational Building

**Research:** T2-CONV (Conversational Building Research)
**UX Screens:** 1.2.1 (Chat panel), 1.3.1, 2.1.1, 2.2.1
**Implements:** FR32, FR33, FR34, FR35, FR36, FR37, FR38

---

#### Story 1.6.1: Natural Language Workflow Building

As a **module builder user**,
I want **to build workflows by describing requirements in natural language**,
So that **I can create without knowing visual editor mechanics**.

**Acceptance Criteria:**

- **Given** I am in Module Builder with chat panel open (1.2.1)
- **When** I describe what I want in natural language
- **Then** the system:
  - Parses my intent
  - Generates appropriate nodes
  - Places them on canvas with connections
  - Explains what was created
- **And** I can refine with follow-up messages
- **And** changes appear in real-time on canvas

**Example:** "Create a workflow that takes a customer question, searches our FAQ, and responds with a helpful answer"

**Implements:** FR32
**Screens:** 1.2.1 (Chat panel)
**Research Reference:** T2-CONV §1-3

---

#### Story 1.6.2: Intent Parsing and Node Generation

As a **system**,
I want **to parse natural language intent and generate appropriate nodes**,
So that **conversational building produces valid workflows**.

**Acceptance Criteria:**

- **Given** user describes a workflow step
- **When** intent is parsed
- **Then** system:
  - Identifies action type (LLM, search, condition, action)
  - Maps to appropriate node types
  - Infers connections based on data flow
  - Generates configurations from context
- **And** parsing uses Claude with specialized prompt
- **And** uncertain parses are flagged

**Implements:** FR33
**Screens:** 1.2.1 (DCRL §2.1.1)
**Research Reference:** T2-CONV §3

---

#### Story 1.6.3: Clarifying Questions on Low Confidence

As a **system**,
I want **to ask clarifying questions when confidence is below 60%**,
So that **I don't generate incorrect workflows**.

**Acceptance Criteria:**

- **Given** user intent is ambiguous
- **When** parsing confidence < 60%
- **Then** system:
  - Presents clarifying question
  - Offers options when possible
  - Explains what's unclear
  - Waits for user response before proceeding
- **And** confidence threshold is configurable
- **And** user can force generation despite low confidence

**Implements:** FR34
**Screens:** DCRL §2.1.1
**Research Reference:** T2-CONV §3

---

#### Story 1.6.4: BMB Agent Guidance (Bond, Wendy, Morgan)

As a **builder user**,
I want **BMB agents to guide me through structured creation**,
So that **I have expert assistance for each builder type**.

**Acceptance Criteria:**

- **Given** I am in a builder
- **When** the chat agent activates
- **Then** I interact with the appropriate persona:
  - **Bond**: Module Builder - workflow orchestration expert
  - **Wendy**: Voice Agent Builder - conversational voice expert
  - **Morgan**: Chatbot Builder - NLU and dialogue expert
  - **Artie**: Canvas Builder - AI generation expert
- **And** each agent has domain-specific knowledge
- **And** agents suggest best practices for their domain

**Implements:** FR35
**Screens:** 1.2.1, 1.3.1, 2.2.1, 2.1.1
**Research Reference:** T2-CONV §5 (BMB agents)

---

#### Story 1.6.5: Switch Between Conversational and Visual Modes

As a **builder user**,
I want **to switch between conversational and visual modes**,
So that **I can use whichever is most efficient**.

**Acceptance Criteria:**

- **Given** I am in a builder
- **When** I toggle mode
- **Then** I can switch between:
  - **Visual mode**: Full canvas, collapsed chat
  - **Conversational mode**: Expanded chat, minimized canvas
  - **Split mode**: Both visible side-by-side
- **And** changes in one mode reflect in the other
- **And** keyboard shortcut toggles modes (Cmd+Shift+C)

**Implements:** FR36
**Screens:** 1.2.1 (split pane)
**Research Reference:** T2-CONV §7

---

#### Story 1.6.6: Preview Before Apply

As a **builder user**,
I want **to preview changes before they're applied**,
So that **I can confirm the AI understood correctly**.

**Acceptance Criteria:**

- **Given** the system generates workflow changes from NL
- **When** changes are ready
- **Then** system shows:
  - Visual diff of what will change
  - List of nodes to add/modify/remove
  - Preview of new connections
  - "Apply" and "Cancel" buttons
- **And** I can request modifications before applying
- **And** preview renders on canvas with ghost styling

**Implements:** FR37
**Screens:** DCRL §2.1.1
**Research Reference:** T2-CONV §1

---

#### Story 1.6.7: Learning from User Feedback

As a **system**,
I want **to learn from user feedback to improve parsing**,
So that **conversational building gets better over time**.

**Acceptance Criteria:**

- **Given** user corrects or modifies generated output
- **When** feedback is captured
- **Then** system:
  - Records original intent + correction
  - Stores feedback for analysis
  - Improves future parsing for similar intents
- **And** learning respects privacy (anonymized)
- **And** per-user preferences are tracked

**Implements:** FR38
**Screens:** DCRL §2.1.1
**Research Reference:** T2-CONV §4

---

**Epic E1.6 Complete: 7 stories**

---

### Epic E1.7: Chatbot Builder - Core Editor

**Research:** T6-CHATBOT §1-3, T6-RASA §1, T5-MCP §5
**UX Screens:** 1.3.1, 1.3.2, 1.3.4
**Implements:** FR39, FR40, FR41, FR42, FR43, FR44, FR45, FR46

---

#### Story 1.7.1: Chatbot Visual Flow Editor

As a **chatbot builder user**,
I want **to create conversational flows using a visual editor**,
So that **I can design chat interactions without code**.

**Acceptance Criteria:**

- **Given** I am in Chatbot Builder (1.3.1)
- **When** I open a new or existing chatbot
- **Then** I see:
  - Flow canvas with conversation nodes
  - Node palette with conversation, logic, action nodes
  - Chat preview panel for testing
  - "Wendy" agent for assistance
- **And** flows execute top-to-bottom by default
- **And** I can simulate conversations in preview

**Implements:** FR39
**Screens:** 1.3.1, 1.3.4
**Research Reference:** T6-CHATBOT §1-3

---

#### Story 1.7.2: Conversation Nodes (Start, Message, Question)

As a **chatbot builder user**,
I want **to add Conversation nodes**,
So that **I can define the chat flow structure**.

**Acceptance Criteria:**

- **Given** I am building a chatbot flow
- **When** I add Conversation nodes
- **Then** I can use:
  - **Start**: Entry point, configurable triggers
  - **Message**: Bot sends text/rich content
  - **Question**: Bot asks question, captures response to slot
  - **End**: Conversation termination
- **And** Message nodes support markdown, buttons, cards
- **And** Question nodes specify expected response type

**Implements:** FR40
**Screens:** 1.3.4
**Research Reference:** T6-CHATBOT §3

---

#### Story 1.7.3: Logic Nodes (Condition, Set Variable, Switch)

As a **chatbot builder user**,
I want **to add Logic nodes**,
So that **I can create dynamic conversation paths**.

**Acceptance Criteria:**

- **Given** I need conditional logic in chat
- **When** I add Logic nodes
- **Then** I can use:
  - **Condition**: Branch based on slot values or expressions
  - **Set Variable**: Assign values to slots
  - **Switch**: Multi-way branch on intent or value
- **And** conditions can reference slots, intents, entities
- **And** expressions support basic operators

**Implements:** FR41
**Screens:** 1.3.4, 1.3.1
**Research Reference:** T6-CHATBOT §3

---

#### Story 1.7.4: Integration Nodes (API Call, Module Trigger)

As a **chatbot builder user**,
I want **to add Integration nodes**,
So that **I can connect chatbots to external systems and modules**.

**Acceptance Criteria:**

- **Given** I need external integration
- **When** I add Integration nodes
- **Then** I can use:
  - **API Call**: HTTP request with auth, headers, body
  - **Module Trigger**: Execute a Module workflow
  - **Webhook**: Send data to external endpoint
- **And** responses can be stored in slots
- **And** error handling is configurable (retry, fallback)

**Implements:** FR42
**Screens:** 1.3.4, 1.2.2d
**Research Reference:** T6-INTEG

---

#### Story 1.7.5: Action Nodes (Send Email, Create Ticket)

As a **chatbot builder user**,
I want **to add Action nodes**,
So that **chatbots can perform real-world actions**.

**Acceptance Criteria:**

- **Given** I need the chatbot to take action
- **When** I add Action nodes
- **Then** I can use:
  - **Send Email**: Email with templates, attachments
  - **Create Ticket**: Zendesk, Freshdesk, etc.
  - **Send Notification**: Slack, Teams, SMS
  - **Update CRM**: Salesforce, HubSpot
- **And** actions use pre-configured integrations
- **And** action results stored in slots

**Implements:** FR43
**Screens:** 1.3.4
**Research Reference:** T6-CHATBOT §3

---

#### Story 1.7.6: NLU Nodes (Intent Classification, Entity Extraction)

As a **chatbot builder user**,
I want **to add NLU nodes for intent and entity detection**,
So that **chatbots understand natural language input**.

**Acceptance Criteria:**

- **Given** I need NLU processing (1.3.2)
- **When** I add NLU nodes
- **Then** I can use:
  - **Intent Classifier**: Detect user intent from text
  - **Entity Extractor**: Extract entities (dates, names, etc.)
  - **Sentiment Analyzer**: Detect emotion/tone
- **And** I can define custom intents with examples
- **And** DIETClassifier architecture is used
- **And** confidence scores are available for routing

**Implements:** FR44
**Screens:** 1.3.2, 1.3.4
**Research Reference:** T6-RASA §1 (DIETClassifier)

---

#### Story 1.7.7: MCP and Skill Nodes in Chatbot

As a **chatbot builder user**,
I want **to add MCP Tool and Skill nodes to chatbots**,
So that **chatbots can leverage external tools and reusable prompts**.

**Acceptance Criteria:**

- **Given** I have MCP servers and Skills installed
- **When** I add MCP/Skill nodes to chatbot flow
- **Then** I can:
  - Select from available MCP tools
  - Select from installed Skills
  - Map conversation slots to tool inputs
  - Store tool outputs in slots
- **And** tools execute within conversation context
- **And** tool errors handled gracefully

**Implements:** FR45, FR46
**Screens:** 2.1.4, 3.1.3, 3.1.4
**Research Reference:** T5-MCP, T5-MCP §5

---

**Epic E1.7 Complete: 7 stories**

---

### Epic E1.8: Chatbot Builder - NLU & Policies

**Research:** T6-RASA §1-5, T4-CHAT §5-6
**UX Screens:** 1.3.2, 1.3.4, 1.3.5, 1.3.6, 1.3.7, 2.4.1, 2.6.3
**Implements:** FR47, FR48, FR49, FR50, FR51, FR52, FR53

---

#### Story 1.8.1: NLU Pipeline Configuration (Tokenizer, Featurizer, Classifier)

As a **chatbot builder user**,
I want **to configure NLU pipeline components**,
So that **I can optimize intent classification for my domain**.

**Acceptance Criteria:**

- **Given** I am configuring chatbot NLU (1.3.2)
- **When** I set up the NLU pipeline
- **Then** I can configure:
  - Tokenizer (whitespace, language-specific)
  - Featurizer (sparse, dense, transformer)
  - DIETClassifier (epochs, embedding dimension)
- **And** default pipeline works out-of-box
- **And** advanced users can customize each component

**Implements:** FR47
**Screens:** 1.3.2
**Research Reference:** T6-RASA §1 (DIET architecture)

---

#### Story 1.8.2: Slot-Based Form Filling with Validation

As a **chatbot builder user**,
I want **to configure slots for form filling with validation**,
So that **chatbots can collect structured data from users**.

**Acceptance Criteria:**

- **Given** I need to collect user information
- **When** I configure slots (1.3.4)
- **Then** I can define:
  - Slot name and type (text, number, date, categorical)
  - Required vs optional
  - Validation rules (regex, range, custom)
  - Prompt to ask if missing
  - Extraction method (from entity, from intent, ask)
- **And** form validates before proceeding
- **And** invalid input triggers re-prompt

**Implements:** FR48
**Screens:** 1.3.4, 1.3.2
**Research Reference:** T6-RASA §3-4 (Forms)

---

#### Story 1.8.3: Dialogue Policies for State Management

As a **chatbot builder user**,
I want **to configure dialogue policies**,
So that **conversation state is managed properly**.

**Acceptance Criteria:**

- **Given** I am building a complex chatbot
- **When** I configure policies (1.3.1)
- **Then** I can set:
  - Rule-based policy (deterministic flows)
  - Memoization policy (remember successful paths)
  - TED policy (ML-based prediction)
  - Policy priority order
- **And** policies determine next action based on history
- **And** policy conflicts resolved by priority

**Implements:** FR49
**Screens:** 1.3.1, 1.3.4
**Research Reference:** T6-RASA §5 (Policies)

---

#### Story 1.8.4: Event-Sourced Conversation Tracker

As a **system**,
I want **to track conversations using event sourcing**,
So that **conversation history is complete and replayable**.

**Acceptance Criteria:**

- **Given** a conversation is active
- **When** events occur (user message, bot action, slot set)
- **Then** system:
  - Records each event with timestamp
  - Maintains ordered event log
  - Supports replay from any point
  - Enables conversation branching
- **And** events include: UserUttered, BotUttered, SlotSet, ActionExecuted
- **And** conversation can be exported for analysis

**Implements:** FR50
**Screens:** 1.3.6, 1.3.7
**Research Reference:** T6-RASA §2 (Tracker)

---

#### Story 1.8.5: Fallback Handler for Unrecognized Intents

As a **chatbot builder user**,
I want **to configure fallback handlers**,
So that **unrecognized inputs are handled gracefully**.

**Acceptance Criteria:**

- **Given** user input is not recognized
- **When** intent confidence is below threshold
- **Then** fallback handler:
  - Sends configured fallback message
  - Optionally asks for clarification
  - Can trigger human handoff after N failures
- **And** threshold is configurable (default: 0.4)
- **And** fallback can vary by context

**Implements:** FR51
**Screens:** 1.3.2, 1.3.5
**Research Reference:** T6-RASA §5 (Fallback)

---

#### Story 1.8.6: Max Retry Configuration for Slot Filling

As a **chatbot builder user**,
I want **to set maximum retry attempts for slot filling**,
So that **users aren't stuck in infinite loops**.

**Acceptance Criteria:**

- **Given** I configure a form with required slots
- **When** user fails to provide valid input
- **Then** system:
  - Re-prompts with helpful guidance
  - Tracks retry count per slot
  - After max retries, triggers fallback action
- **And** max retries configurable (default: 3)
- **And** can configure different fallback per form

**Implements:** FR52
**Screens:** 1.3.4
**Research Reference:** T6-RASA §4

---

#### Story 1.8.7: Human Agent Escalation with Context

As a **chatbot builder user**,
I want **to escalate to human agents with full context**,
So that **handoffs are seamless for customers**.

**Acceptance Criteria:**

- **Given** escalation is triggered
- **When** handoff occurs (1.3.4, 2.6.3)
- **Then** human agent receives:
  - Full conversation transcript
  - All collected slot values
  - Intent history and confidence scores
  - Customer sentiment analysis
  - Recommended actions
- **And** escalation routes to correct queue (Chatwoot inbox)
- **And** bot disengages gracefully

**Implements:** FR53
**Screens:** 1.3.4, 2.6.3, 2.4.1
**Research Reference:** T4-CHAT §5-6 (Handoff)

---

**Epic E1.8 Complete: 7 stories**

---

### Epic E1.9: Knowledge Base - Document Ingestion

**Research:** T0-RAG
**UX Screens:** 1.4.1, 1.4.2, 1.4.3
**Implements:** FR86, FR87, FR88

---

#### Story 1.9.1: Create Knowledge Base Scoped to Project

As a **project user**,
I want **to create knowledge bases scoped to my project**,
So that **each project has its own isolated knowledge**.

**Acceptance Criteria:**

- **Given** I am in a project
- **When** I create a new Knowledge Base (1.4.1)
- **Then** I can:
  - Name the KB
  - Set description
  - Configure default retrieval settings
  - Choose embedding model
- **And** KB is scoped to current project (RLS enforced)
- **And** KB appears in left panel of builders

**Implements:** FR86
**Screens:** 1.4.1
**Creates:** knowledge_bases table

---

#### Story 1.9.2: Document Upload (PDF, DOCX, TXT, MD, HTML)

As a **knowledge base user**,
I want **to upload documents in various formats**,
So that **I can ingest existing content**.

**Acceptance Criteria:**

- **Given** I have a Knowledge Base
- **When** I upload documents (1.4.2)
- **Then** I can:
  - Drag and drop files
  - Select multiple files
  - See upload progress
  - View processing status
- **And** supported formats: PDF, DOCX, TXT, MD, HTML
- **And** max file size: 50MB per file
- **And** documents are queued for async processing

**Implements:** FR87
**Screens:** 1.4.2
**Creates:** kb_documents table

---

#### Story 1.9.3: Web Content Ingestion via URL Crawling

As a **knowledge base user**,
I want **to ingest web content via URL crawling**,
So that **I can include web documentation in my KB**.

**Acceptance Criteria:**

- **Given** I have a Knowledge Base
- **When** I add a URL for crawling (1.4.3)
- **Then** I can:
  - Enter single URL or sitemap
  - Set crawl depth (1-5 levels)
  - Include/exclude URL patterns
  - Schedule recurring sync
- **And** crawler respects robots.txt
- **And** content is extracted and chunked
- **And** updates detected via content hash

**Implements:** FR88
**Screens:** 1.4.3

---

**Epic E1.9 Complete: 3 stories**

---

### Epic E1.10: Knowledge Base - Search & Retrieval

**Research:** T0-RAG
**UX Screens:** 1.4.4, 1.4.5, 1.4.6
**Implements:** FR89, FR90, FR91, FR92, FR95, FR98

---

#### Story 1.10.1: Intelligent Document Chunking

As a **system**,
I want **to perform intelligent chunking of documents**,
So that **retrieval returns coherent, relevant passages**.

**Acceptance Criteria:**

- **Given** a document is uploaded
- **When** chunking is performed (1.4.4)
- **Then** system uses:
  - Semantic chunking (sentence boundaries)
  - AST-aware chunking for code
  - Configurable chunk size (512-2048 tokens)
  - Overlap between chunks (10-20%)
- **And** chunk metadata preserved (source, page, section)
- **And** tables/images handled specially

**Implements:** FR89
**Screens:** 1.4.4

---

#### Story 1.10.2: Embedding Generation via Configurable Providers

As a **knowledge base user**,
I want **to generate embeddings via configurable providers**,
So that **I can choose the best model for my use case**.

**Acceptance Criteria:**

- **Given** I configure KB settings (1.4.5)
- **When** I select embedding provider
- **Then** I can choose:
  - OpenAI (text-embedding-3-small/large)
  - Cohere (embed-english-v3.0)
  - Voyage AI (voyage-large-2)
  - Local (sentence-transformers)
- **And** embeddings are generated for all chunks
- **And** dimension configurable (256-3072)

**Implements:** FR90
**Screens:** 1.4.5

---

#### Story 1.10.3: Vector Search via pgvector HNSW

As a **system**,
I want **to perform vector search using pgvector HNSW**,
So that **retrieval is fast and accurate**.

**Acceptance Criteria:**

- **Given** query embeddings are generated
- **When** vector search is performed (1.4.6)
- **Then** system:
  - Uses HNSW index for approximate NN search
  - Supports cosine similarity, inner product, L2 distance
  - Returns top-k results (configurable)
  - Includes similarity scores
- **And** index parameters tuned for latency/recall tradeoff
- **And** search completes in <100ms for 1M vectors

**Implements:** FR91
**Screens:** 1.4.6

---

#### Story 1.10.4: Hybrid Search (Vector + BM25)

As a **knowledge base user**,
I want **hybrid search combining vector and BM25**,
So that **I get best of semantic and keyword matching**.

**Acceptance Criteria:**

- **Given** user queries the KB
- **When** hybrid search executes
- **Then** system:
  - Performs vector search for semantic similarity
  - Performs BM25 for keyword matching
  - Fuses results using RRF (Reciprocal Rank Fusion)
  - Weights configurable (default: 0.5/0.5)
- **And** hybrid typically improves recall by 15-20%

**Implements:** FR92
**Screens:** 1.4.6

---

#### Story 1.10.5: Reranking (Cohere, Cross-Encoder)

As a **knowledge base user**,
I want **to rerank search results for better precision**,
So that **top results are most relevant**.

**Acceptance Criteria:**

- **Given** initial retrieval returns candidates
- **When** reranking is enabled (1.4.5)
- **Then** system:
  - Runs reranker on top-k candidates
  - Reorders by relevance score
  - Supports Cohere Rerank, cross-encoder models
- **And** reranking is optional (adds latency)
- **And** improves precision@10 by ~20%

**Implements:** FR95
**Screens:** 1.4.5

---

#### Story 1.10.6: Configurable Retrieval Parameters

As a **knowledge base user**,
I want **to configure retrieval parameters**,
So that **I can optimize for my use case**.

**Acceptance Criteria:**

- **Given** I am configuring KB retrieval (1.4.5)
- **When** I set parameters
- **Then** I can configure:
  - Top-k results (1-50)
  - Similarity threshold (0-1)
  - Hybrid weight
  - Reranking enabled/disabled
  - Context window size
- **And** settings saved per KB
- **And** can override at query time

**Implements:** FR98
**Screens:** 1.4.5

---

**Epic E1.10 Complete: 6 stories**

---

### Epic E1.11: Knowledge Base - Advanced Retrieval

**Research:** T0-RAG, T4-EMBED, T6-INTEG, T4-SEC §5
**UX Screens:** 1.4.7, 1.4.8, 1.3.3, 1.10.3
**Implements:** FR93, FR94, FR96, FR97, FR99

---

#### Story 1.11.1: Graph-Based Retrieval (Graphiti)

As a **knowledge base user**,
I want **graph-based retrieval using Graphiti**,
So that **I can query relationships between entities**.

**Acceptance Criteria:**

- **Given** documents contain entity relationships
- **When** I use graph retrieval (1.4.7)
- **Then** system:
  - Extracts entities and relationships during ingestion
  - Stores in knowledge graph (Graphiti)
  - Supports path queries between entities
  - Combines graph context with vector retrieval
- **And** graph visualized in Entity Graph panel
- **And** queries like "What products does Company X sell?"

**Implements:** FR93
**Screens:** 1.4.7

---

#### Story 1.11.2: Temporal Memory Queries

As a **knowledge base user**,
I want **to query with temporal context**,
So that **I can ask about recent changes or historical data**.

**Acceptance Criteria:**

- **Given** documents have timestamps
- **When** I query with temporal context
- **Then** system:
  - Supports "What changed in the last week?"
  - Filters by date ranges
  - Prioritizes recent content when relevant
  - Tracks document version history
- **And** Graphiti temporal memory enables this
- **And** combines with entity queries

**Implements:** FR94
**Screens:** 1.4.7

---

#### Story 1.11.3: Source Citations and Confidence Display

As a **end user of chatbot/agent**,
I want **to view source citations and confidence scores**,
So that **I can verify information accuracy**.

**Acceptance Criteria:**

- **Given** RAG provides an answer
- **When** response is displayed (1.4.8, 1.3.3)
- **Then** UI shows:
  - Inline citation markers [1], [2]
  - Expandable source list with document names
  - Confidence score for each citation
  - Link to original source when available
- **And** low confidence (<0.5) shows warning
- **And** "Show sources" toggle available

**Implements:** FR96
**Screens:** 1.4.8, 1.3.3
**Research Reference:** T4-EMBED

---

#### Story 1.11.4: Shared RAG Context Across Builders

As a **project user**,
I want **RAG context shared across all builders in my project**,
So that **Module, Chatbot, Voice, and Canvas all access the same knowledge**.

**Acceptance Criteria:**

- **Given** I have a Knowledge Base in my project
- **When** I build with any builder
- **Then** all builders:
  - Can attach KB context to LLM nodes
  - Use same retrieval settings
  - Share entity graph
  - See same sources in KB panel
- **And** RAG node type available in all builders
- **And** retrieval permissions respect user role

**Implements:** FR97
**Screens:** 1.4.1
**Research Reference:** T6-INTEG

---

#### Story 1.11.5: Cross-Tenant RAG Poisoning Prevention

As a **platform operator**,
I want **to prevent cross-tenant RAG poisoning**,
So that **malicious content cannot affect other tenants**.

**Acceptance Criteria:**

- **Given** multi-tenant environment
- **When** RAG retrieval occurs
- **Then** system:
  - RLS ensures only current tenant's KB is queried
  - Embedding storage is tenant-isolated
  - Vector indexes scoped by workspace_id
  - No cross-tenant similarity matches possible
- **And** poisoning attempts logged and alerted
- **And** regular security audits verify isolation

**Implements:** FR99
**Screens:** 1.10.3
**Research Reference:** T4-SEC §5
**NFRs:** NFR-SEC-13

---

**Epic E1.11 Complete: 5 stories**

---

### Epic E1.12: Agent Execution Runtime

**Research:** T0-RAG, T1-CLAUDE, T0-PROT, T1-VWB §7-8, T4-CMD §4, T4-SEC §1, T7-CANVAS §8.1
**UX Screens:** 1.6.1, 1.6.2, 1.6.3, 1.6.4, 1.6.5, 1.6.6
**Implements:** FR127, FR128, FR129, FR130, FR131, FR132, FR133

---

#### Story 1.12.1: Agno Runtime Execution with Claude

As a **system**,
I want **to execute workflows via Agno runtime with Claude**,
So that **agents run efficiently with proper orchestration**.

**Acceptance Criteria:**

- **Given** a workflow is triggered
- **When** execution begins (1.6.1)
- **Then** system:
  - Initializes Agno runtime
  - Creates Claude agent with configured model
  - Executes nodes in topological order
  - Handles tool calls via ReAct pattern
- **And** execution uses connection pooling
- **And** model selection per-node supported

**Implements:** FR127
**Screens:** 1.6.1
**Research Reference:** T0-RAG, T1-CLAUDE

---

#### Story 1.12.2: Variable Pool with Namespace Isolation

As a **system**,
I want **to manage variable pools with namespace isolation**,
So that **workflow data is isolated and accessible**.

**Acceptance Criteria:**

- **Given** workflow is executing
- **When** variables are accessed/modified (1.6.2)
- **Then** system:
  - Maintains VariablePool per execution
  - Supports namespaced variables (node.output)
  - Provides get/set with type checking
  - Supports variable scoping (global, node, loop)
- **And** variable changes logged for debugging
- **And** no cross-execution variable leakage

**Implements:** FR128
**Screens:** 1.6.2
**Research Reference:** T1-VWB §7 (VariablePool)

---

#### Story 1.12.3: AG-UI Streaming (25 Event Types)

As a **system**,
I want **to stream execution via AG-UI protocol**,
So that **UI updates in real-time during execution**.

**Acceptance Criteria:**

- **Given** workflow is executing
- **When** events occur
- **Then** system streams via SSE:
  - TEXT_MESSAGE_START/CONTENT/END
  - TOOL_CALL_START/ARGS/END
  - STATE_SNAPSHOT, STATE_DELTA
  - STEP_START/END, RUN_START/END
  - INTERRUPT, ERROR
- **And** 25 AG-UI event types supported
- **And** client renders updates progressively

**Implements:** FR129
**Screens:** 1.6.3
**Research Reference:** T0-PROT (AG-UI protocol)

---

#### Story 1.12.4: Synchronous and Asynchronous Execution

As a **module user**,
I want **both sync and async execution modes**,
So that **I can choose based on use case**.

**Acceptance Criteria:**

- **Given** I trigger a workflow
- **When** I choose execution mode
- **Then** system supports:
  - **Sync**: Wait for result, return inline
  - **Async**: Return job ID, poll for result
  - **Fire-and-forget**: No result needed
- **And** sync has timeout (default: 30s)
- **And** async supports webhooks for completion

**Implements:** FR130
**Screens:** 1.6.1
**Research Reference:** T1-VWB §8

---

#### Story 1.12.5: Pause and Resume Workflows

As a **module user**,
I want **to pause and resume workflow execution**,
So that **long-running workflows can be interrupted safely**.

**Acceptance Criteria:**

- **Given** a workflow is executing
- **When** I click Pause (1.6.4)
- **Then** system:
  - Completes current node execution
  - Saves execution state to database
  - Releases compute resources
  - Shows "Paused" status
- **And** Resume restores state and continues
- **And** paused workflows can be cancelled

**Implements:** FR131
**Screens:** 1.6.4
**Research Reference:** T4-CMD §4

---

#### Story 1.12.6: Execution Timeouts

As a **system**,
I want **to enforce execution timeouts**,
So that **runaway workflows don't consume resources**.

**Acceptance Criteria:**

- **Given** workflow is executing
- **When** timeout is reached (1.6.5)
- **Then** system:
  - Terminates execution gracefully
  - Logs timeout event with context
  - Returns timeout error to caller
  - Releases all resources
- **And** timeout configurable per workflow (default: 5 min)
- **And** per-node timeout also supported

**Implements:** FR132
**Screens:** 1.6.5
**Research Reference:** T4-SEC §1

---

#### Story 1.12.7: Infinite Loop Detection and Prevention

As a **system**,
I want **to detect and prevent infinite loops**,
So that **circular dependencies don't hang execution**.

**Acceptance Criteria:**

- **Given** workflow is executing
- **When** loop detected (1.6.6)
- **Then** system:
  - Tracks node visit counts
  - Fails if same node visited > max iterations
  - DAG validation catches cycles at design time
  - Runtime detection as safety net
- **And** max iterations configurable (default: 1000)
- **And** clear error message with loop path

**Implements:** FR133
**Screens:** 1.6.6
**Research Reference:** T7-CANVAS §8.1

---

**Epic E1.12 Complete: 7 stories**

---

### Epic E1.13: Execution Triggers

**Research:** T8-GAPS §2, T6-INTEG §4, §6
**UX Screens:** 1.6.7, 1.6.8, 1.6.1
**Implements:** FR134, FR135, FR136, FR137

---

#### Story 1.13.1: Scheduled/Cron-Based Triggers

As a **module user**,
I want **to trigger workflows on a schedule**,
So that **workflows run automatically at specified times**.

**Acceptance Criteria:**

- **Given** I configure a workflow trigger (1.6.7)
- **When** I set up scheduled trigger
- **Then** I can:
  - Use cron expression (standard 5-field)
  - Use friendly presets (hourly, daily, weekly)
  - Set timezone
  - Configure start/end dates
- **And** scheduled jobs managed by job queue
- **And** missed jobs can be configured to run or skip

**Implements:** FR134
**Screens:** 1.6.7
**Research Reference:** T8-GAPS §2

---

#### Story 1.13.2: Webhook-Triggered Execution (HMAC)

As a **module user**,
I want **to trigger workflows via webhooks with HMAC verification**,
So that **external systems can invoke my workflows securely**.

**Acceptance Criteria:**

- **Given** I configure a webhook trigger (1.6.8)
- **When** I enable webhook
- **Then** I receive:
  - Unique webhook URL
  - HMAC secret key for signing
  - Sample code snippets for calling
- **And** incoming requests verified via HMAC-SHA256
- **And** payload passed to workflow as input
- **And** response configurable (sync/async)

**Implements:** FR135
**Screens:** 1.6.8
**Research Reference:** T6-INTEG §4

---

#### Story 1.13.3: Event Fan-Out via Redis Pub/Sub

As a **system**,
I want **to fan-out events via Redis Pub/Sub**,
So that **multiple subscribers can react to workflow events**.

**Acceptance Criteria:**

- **Given** workflow events occur
- **When** events are published
- **Then** system:
  - Publishes to Redis Pub/Sub channels
  - Supports topic-based subscriptions
  - Delivers to all subscribers (<200ms)
  - Handles subscriber failures gracefully
- **And** event format follows AG-UI spec
- **And** channels namespaced by workspace

**Implements:** FR136
**Screens:** 1.6.1
**Research Reference:** T6-INTEG §6

---

#### Story 1.13.4: PostgreSQL LISTEN/NOTIFY for Sync

As a **system**,
I want **to use PostgreSQL LISTEN/NOTIFY for synchronous updates**,
So that **state changes propagate reliably**.

**Acceptance Criteria:**

- **Given** database state changes
- **When** notifications are needed
- **Then** system:
  - Uses NOTIFY to broadcast changes
  - Listeners receive via LISTEN
  - Payload includes change details
  - Works with RLS context
- **And** used for critical sync operations
- **And** combined with Redis for scale

**Implements:** FR137
**Screens:** 1.6.1
**Research Reference:** T6-INTEG §6

---

**Epic E1.13 Complete: 4 stories**

---

### Epic E1.14: Sandbox Execution

**Research:** T4-SEC §1, T6-INTEG §12
**UX Screens:** 1.6.9, 1.3.5
**Implements:** FR138, FR139

---

#### Story 1.14.1: Sandboxed Firecracker MicroVM Execution

As a **system**,
I want **to run user code in sandboxed Firecracker MicroVMs**,
So that **untrusted code cannot compromise the platform**.

**Acceptance Criteria:**

- **Given** user code needs to execute
- **When** execution is triggered (1.6.9)
- **Then** system:
  - Spins up Firecracker MicroVM (<125ms cold start)
  - Executes code with resource limits (CPU, memory, time)
  - Isolates network access (configurable)
  - Captures stdout/stderr
  - Terminates VM after execution
- **And** no persistent state between executions
- **And** supports Python, JavaScript, bash

**Implements:** FR138
**Screens:** 1.6.9
**Research Reference:** T4-SEC §1
**NFRs:** NFR-SEC-01, NFR-SEC-10

---

#### Story 1.14.2: Dify-Style Workflow as Tool

As a **module user**,
I want **to expose workflows as callable tools**,
So that **other agents can invoke my workflows**.

**Acceptance Criteria:**

- **Given** I have a workflow
- **When** I enable "Workflow as Tool" (1.3.5)
- **Then** workflow:
  - Exposes as MCP-compatible tool
  - Has defined input/output schema
  - Can be discovered by agents
  - Executes with caller's context
- **And** nested workflow calls tracked
- **And** recursion depth limited (max 10)

**Implements:** FR139
**Screens:** 1.3.5
**Research Reference:** T6-INTEG §12

---

**Epic E1.14 Complete: 2 stories**

---

### Epic E1.15: Execution Traces & Observability

**Research:** T4-OBS §2.3, §4, §8
**UX Screens:** 1.7.1, 1.7.2, 1.7.3, 1.7.5
**Implements:** FR140, FR141, FR142, FR149

---

#### Story 1.15.1: Detailed Execution Traces (Langfuse)

As a **module user**,
I want **to view detailed execution traces**,
So that **I can debug and optimize my workflows**.

**Acceptance Criteria:**

- **Given** a workflow has executed
- **When** I view execution trace (1.7.1)
- **Then** I see:
  - Timeline of all node executions
  - Input/output for each node
  - LLM prompts and responses
  - Tool calls and results
  - Timing for each step
- **And** traces stored in Langfuse
- **And** can export traces for analysis

**Implements:** FR140
**Screens:** 1.7.1
**Research Reference:** T4-OBS §2.3 (Langfuse)

---

#### Story 1.15.2: LLM Token Usage and Cost Tracking

As a **module user**,
I want **to view LLM token usage and costs per execution**,
So that **I can understand and optimize spending**.

**Acceptance Criteria:**

- **Given** execution used LLM models
- **When** I view execution details (1.7.2)
- **Then** I see:
  - Input tokens per LLM call
  - Output tokens per LLM call
  - Cost per call (based on model pricing)
  - Total cost for execution
- **And** costs calculated in real-time
- **And** model pricing kept up-to-date

**Implements:** FR141
**Screens:** 1.7.2
**Research Reference:** T4-OBS §4

---

#### Story 1.15.3: Aggregated Cost Analytics

As a **workspace admin**,
I want **to view aggregated cost analytics**,
So that **I can monitor spend across all projects**.

**Acceptance Criteria:**

- **Given** multiple workflows have executed
- **When** I view analytics dashboard (1.7.3)
- **Then** I see:
  - Cost by day/week/month
  - Cost by project
  - Cost by workflow
  - Cost by model
  - Trend charts
- **And** can filter by date range
- **And** can export reports

**Implements:** FR142
**Screens:** 1.7.3
**Research Reference:** T4-OBS §4

---

#### Story 1.15.4: Export Execution History

As a **module user**,
I want **to export execution history**,
So that **I can analyze offline or integrate with other tools**.

**Acceptance Criteria:**

- **Given** I have execution history
- **When** I export (1.7.5)
- **Then** I can:
  - Select date range
  - Choose format (JSON, CSV)
  - Include/exclude trace details
  - Download or send to S3/GCS
- **And** large exports run as background jobs
- **And** export respects data retention policies

**Implements:** FR149
**Screens:** 1.7.5
**Research Reference:** T4-OBS §8

---

**Epic E1.15 Complete: 4 stories**

---

### Epic E1.16: Budget Alerts & Cost Tracking

**Research:** T3-BILL §5-6, B3-PRICE §3, T4-CMD
**UX Screens:** 1.7.4, 1.10.1, 1.10.2, 1.10.3
**Implements:** FR143, FR187, FR188, FR189

---

#### Story 1.16.1: Budget Alerts (80%, 100%)

As a **workspace admin**,
I want **to configure budget alerts**,
So that **I'm notified before overspending**.

**Acceptance Criteria:**

- **Given** I configure budget settings (1.7.4)
- **When** usage approaches budget
- **Then** system:
  - Alerts at 80% of budget (email, in-app)
  - Alerts at 100% of budget (urgent)
  - Can configure hard cap (block at limit)
  - Can configure soft cap (warn but allow)
- **And** alerts customizable per threshold
- **And** alert history viewable

**Implements:** FR143
**Screens:** 1.7.4
**Research Reference:** T3-BILL §6

---

#### Story 1.16.2: Platform Credits Metering

As a **system**,
I want **to meter all AI usage to platform credits**,
So that **billing is accurate and unified**.

**Acceptance Criteria:**

- **Given** AI operations occur
- **When** usage is metered (1.10.1)
- **Then** system:
  - Converts LLM tokens to credits
  - Converts RAG operations to credits
  - Converts voice minutes to credits
  - Converts canvas generations to credits
- **And** credit rates per operation type defined
- **And** real-time credit balance tracking

**Implements:** FR187
**Screens:** 1.10.1
**Research Reference:** T3-BILL §5

---

#### Story 1.16.3: Dollar Amount Usage Display

As a **user**,
I want **to view my usage in dollar amounts**,
So that **I understand actual cost impact**.

**Acceptance Criteria:**

- **Given** I have usage
- **When** I view billing page (1.10.2)
- **Then** I see:
  - Current month spend in dollars
  - Breakdown by category
  - Comparison to previous month
  - Projected month-end cost
- **And** currency based on account settings
- **And** detailed line items available

**Implements:** FR188
**Screens:** 1.10.2
**Research Reference:** B3-PRICE §3

---

#### Story 1.16.4: Real-Time Usage Widget

As a **user**,
I want **a real-time usage widget**,
So that **I can monitor spend while working**.

**Acceptance Criteria:**

- **Given** I am in a builder
- **When** I view usage widget (1.10.3)
- **Then** I see:
  - Current session usage
  - Today's total usage
  - Usage vs. quota percentage
  - Quick link to full billing page
- **And** widget updates in real-time
- **And** can be collapsed/expanded

**Implements:** FR189
**Screens:** 1.10.3
**Research Reference:** T4-CMD

---

**Epic E1.16 Complete: 4 stories**

---

### Epic E1.17: Human-in-the-Loop (HITL)

**Research:** T4-CMD §3-4
**UX Screens:** 1.8.1, 1.8.2, 1.8.3, 1.8.4, 1.8.5
**Implements:** FR150, FR151, FR152, FR153, FR154, FR155

---

#### Story 1.17.1: Configure Approval Gates

As a **module user**,
I want **to configure approval gates in my workflow**,
So that **sensitive actions require human approval**.

**Acceptance Criteria:**

- **Given** I have a workflow
- **When** I configure approval gate (1.8.1)
- **Then** I can:
  - Mark specific nodes as requiring approval
  - Define approval conditions (always, above threshold)
  - Set approver roles/users
  - Configure approval timeout
- **And** approval gates visualized on canvas
- **And** multiple approval levels supported

**Implements:** FR150
**Screens:** 1.8.1
**Research Reference:** T4-CMD §3

---

#### Story 1.17.2: HITL Queue with AG-UI INTERRUPT

As a **system**,
I want **to queue HITL requests using AG-UI INTERRUPT events**,
So that **workflows pause cleanly for human input**.

**Acceptance Criteria:**

- **Given** workflow reaches approval gate
- **When** HITL is triggered (1.8.2)
- **Then** system:
  - Emits AG-UI INTERRUPT event
  - Saves execution state
  - Creates pending approval record
  - Notifies designated approvers
  - Holds execution at gate
- **And** workflow can be cancelled while waiting
- **And** timeout triggers configured action

**Implements:** FR151
**Screens:** 1.8.2
**Research Reference:** T4-CMD §4 (AG-UI INTERRUPT)

---

#### Story 1.17.3: View Pending Approvals

As an **approver**,
I want **to view all pending approvals**,
So that **I can act on waiting requests**.

**Acceptance Criteria:**

- **Given** I am an approver
- **When** I view approvals inbox (1.8.3)
- **Then** I see:
  - List of pending approvals
  - Request context and details
  - Requester information
  - Time waiting
  - Priority/urgency indicator
- **And** can filter by workflow, project, status
- **And** notifications for new approvals

**Implements:** FR152
**Screens:** 1.8.3
**Research Reference:** T4-CMD §3

---

#### Story 1.17.4: Approve/Reject/Modify HITL Requests

As an **approver**,
I want **to approve, reject, or modify HITL requests**,
So that **I have full control over sensitive actions**.

**Acceptance Criteria:**

- **Given** I have a pending approval (1.8.4)
- **When** I review the request
- **Then** I can:
  - **Approve**: Continue workflow as-is
  - **Reject**: Stop workflow with rejection reason
  - **Modify**: Edit parameters before continuing
- **And** decision is logged with timestamp and approver
- **And** modification shows diff of changes

**Implements:** FR153
**Screens:** 1.8.4
**Research Reference:** T4-CMD §3

---

#### Story 1.17.5: Resume Workflow Upon Resolution

As a **system**,
I want **to resume workflow upon HITL resolution**,
So that **execution continues after approval**.

**Acceptance Criteria:**

- **Given** HITL request is resolved
- **When** approval/rejection processed (1.8.2)
- **Then** system:
  - Restores execution state
  - Applies any modifications
  - Continues or terminates based on decision
  - Logs resolution in execution trace
- **And** resume happens within seconds
- **And** state integrity verified

**Implements:** FR154
**Screens:** 1.8.2
**Research Reference:** T4-CMD §4

---

#### Story 1.17.6: Escalation Rules and Timeouts

As a **module user**,
I want **to configure escalation rules and timeouts for HITL**,
So that **approvals don't block workflows indefinitely**.

**Acceptance Criteria:**

- **Given** I configure HITL settings (1.8.5)
- **When** I set escalation rules
- **Then** I can:
  - Set primary approver
  - Set escalation chain (after N hours)
  - Configure timeout action (auto-approve, auto-reject, fail)
  - Set maximum wait time
- **And** escalation notifications sent
- **And** timeout reason logged

**Implements:** FR155
**Screens:** 1.8.5
**Research Reference:** T4-CMD §3

---

**Epic E1.17 Complete: 6 stories**

---

## Phase 1 Complete: 117 Stories across 17 Epics

---

## PHASE 2: BUILDER SUITE

### Epic E2.1: Voice Agent - Core Editor

**Research:** T6-VOICE, T6-LIVEKIT §7
**UX Screens:** 2.2.1, 2.2.2, 2.2.3, 2.2.4
**Implements:** FR54, FR55, FR56, FR57, FR58

---

#### Story 2.1.1: Voice Flow Visual Editor

As a **voice agent builder user**,
I want **to create voice flows using a visual editor**,
So that **I can design voice interactions visually**.

**Acceptance Criteria:**

- **Given** I am in Voice Agent Builder (2.2.1)
- **When** I open a new or existing voice agent
- **Then** I see:
  - Voice flow canvas (similar to Module Builder)
  - Voice-specific node palette
  - "Wendy" agent for assistance
  - Voice preview/test panel
- **And** flows execute based on voice events
- **And** can simulate voice interactions

**Implements:** FR54
**Screens:** 2.2.1

---

#### Story 2.1.2: Voice Input Nodes (Listen, DTMF, STT)

As a **voice agent builder user**,
I want **to add Voice Input nodes**,
So that **I can capture voice and DTMF input**.

**Acceptance Criteria:**

- **Given** I am building a voice flow
- **When** I add Voice Input nodes (2.2.4)
- **Then** I can use:
  - **Listen**: Capture speech with configurable timeout
  - **DTMF**: Capture keypad input (digits, *, #)
  - **STT Node**: Convert speech to text with provider selection
- **And** can configure silence detection, max duration
- **And** results stored in voice flow variables

**Implements:** FR55
**Screens:** 2.2.1, 2.2.4
**Research Reference:** T6-VOICE §1.1

---

#### Story 2.1.3: Voice Output Nodes (Speak, Audio, SSML)

As a **voice agent builder user**,
I want **to add Voice Output nodes**,
So that **I can play audio and synthesize speech**.

**Acceptance Criteria:**

- **Given** I am building a voice flow
- **When** I add Voice Output nodes (2.2.2)
- **Then** I can use:
  - **Speak**: TTS with configurable voice persona
  - **Audio**: Play pre-recorded audio files
  - **SSML**: Advanced speech markup with prosody
- **And** can configure voice, speed, pitch
- **And** supports variable interpolation in text

**Implements:** FR56
**Screens:** 2.2.1, 2.2.2, 2.2.4
**Research Reference:** T6-VOICE §1.1

---

#### Story 2.1.4: Voice Control Nodes (Transfer, Hold, Hang Up)

As a **voice agent builder user**,
I want **to add Voice Control nodes**,
So that **I can manage call flow**.

**Acceptance Criteria:**

- **Given** I am building a voice flow
- **When** I add Voice Control nodes (2.2.3)
- **Then** I can use:
  - **Transfer**: Transfer to another number/agent
  - **Hold**: Place caller on hold with music
  - **Hang Up**: End call gracefully
  - **Conference**: Add participants
- **And** transfer supports warm/cold options
- **And** hold music configurable

**Implements:** FR57
**Screens:** 2.2.1, 2.2.3
**Research Reference:** T6-LIVEKIT §7

---

#### Story 2.1.5: Voice Integration Nodes (Module, MCP, Skill)

As a **voice agent builder user**,
I want **to add integration nodes to voice flows**,
So that **voice agents can leverage existing capabilities**.

**Acceptance Criteria:**

- **Given** I am building a voice flow
- **When** I add integration nodes
- **Then** I can use:
  - **Module Trigger**: Execute a Module workflow
  - **MCP Tool**: Call MCP server tools
  - **Skill**: Execute installed Skills
- **And** can map voice context to inputs
- **And** results spoken or used in logic

**Implements:** FR58
**Screens:** 2.2.1, 2.1.4
**Research Reference:** T6-INTEG

---

**Epic E2.1 Complete: 5 stories**

---

### Epic E2.2: Voice Agent - Speech Processing

**Research:** T6-VOICE §1.1, T6-LIVEKIT §3-4, T8-AIGEN §4
**UX Screens:** 2.2.2, 2.2.4, 2.2.5, 2.2.6
**Implements:** FR59, FR60, FR61, FR62, FR63, FR64, FR67, FR68

---

#### Story 2.2.1: STT via Configurable Providers

As a **voice agent builder user**,
I want **to configure STT providers**,
So that **I can choose the best speech recognition for my use case**.

**Acceptance Criteria:**

- **Given** I configure voice settings (2.2.4)
- **When** I select STT provider
- **Then** I can choose:
  - Deepgram (Nova-2, Whisper)
  - Google Cloud STT
  - Azure Speech
  - OpenAI Whisper
- **And** can configure language, model variant
- **And** real-time streaming supported

**Implements:** FR59
**Screens:** 2.2.4
**Research Reference:** T6-VOICE §1.1

---

#### Story 2.2.2: TTS via Configurable Providers

As a **voice agent builder user**,
I want **to configure TTS providers**,
So that **I can choose voice quality and style**.

**Acceptance Criteria:**

- **Given** I configure voice settings (2.2.4)
- **When** I select TTS provider
- **Then** I can choose:
  - Cartesia (Sonic)
  - ElevenLabs
  - Google Cloud TTS
  - Azure Neural Voices
- **And** can preview voices before selection
- **And** can configure speed, pitch, style

**Implements:** FR60
**Screens:** 2.2.4, 2.2.2
**Research Reference:** T6-VOICE §1.1

---

#### Story 2.2.3: Voice Activity Detection (Silero VAD)

As a **system**,
I want **high-accuracy voice activity detection**,
So that **voice agents respond at the right time**.

**Acceptance Criteria:**

- **Given** voice input is streaming
- **When** VAD analyzes audio
- **Then** system:
  - Detects speech start/end with 98.8% TPR
  - Uses Silero VAD model
  - Configurable silence threshold
  - Sub-100ms latency
- **And** VAD parameters tunable
- **And** works across noise levels

**Implements:** FR61
**Screens:** 2.2.4
**Research Reference:** T6-LIVEKIT §3

---

#### Story 2.2.4: Turn Detection (Qwen2.5-0.5B)

As a **system**,
I want **intelligent turn detection**,
So that **voice agents know when user has finished speaking**.

**Acceptance Criteria:**

- **Given** user is speaking
- **When** turn detection runs
- **Then** system:
  - Uses Qwen2.5-0.5B for end-of-turn prediction
  - Considers context and prosody
  - Avoids premature interruption
  - Handles mid-sentence pauses
- **And** more accurate than silence-only detection
- **And** configurable confidence threshold

**Implements:** FR62
**Screens:** 2.2.4
**Research Reference:** T6-LIVEKIT §3

---

#### Story 2.2.5: Interruption Handling (4-State Machine)

As a **system**,
I want **proper interruption handling**,
So that **users can interrupt the voice agent naturally**.

**Acceptance Criteria:**

- **Given** voice agent is speaking
- **When** user interrupts
- **Then** system uses 4-state machine:
  - **Speaking**: Agent is talking
  - **Listening**: Agent heard interruption
  - **Processing**: Analyzing interruption
  - **Responding**: Addressing interruption
- **And** partial responses can be discarded
- **And** context preserved during interruption

**Implements:** FR63
**Screens:** 2.2.4
**Research Reference:** T6-LIVEKIT §4

---

#### Story 2.2.6: SSML for Prosody and Emphasis

As a **voice agent builder user**,
I want **SSML support for advanced speech control**,
So that **voice output sounds natural**.

**Acceptance Criteria:**

- **Given** I configure TTS output
- **When** I use SSML (2.2.2)
- **Then** I can use:
  - `<prosody>` for rate, pitch, volume
  - `<emphasis>` for stress
  - `<break>` for pauses
  - `<say-as>` for interpretation (date, currency)
- **And** SSML validation on save
- **And** preview with SSML rendering

**Implements:** FR64
**Screens:** 2.2.2, 2.2.4
**Research Reference:** T6-VOICE §1.1

---

#### Story 2.2.7: Voice Persona Configuration

As a **voice agent builder user**,
I want **to configure voice personas**,
So that **voice agents have consistent personalities**.

**Acceptance Criteria:**

- **Given** I configure voice settings (2.2.2)
- **When** I set up persona
- **Then** I can:
  - Select base voice
  - Configure personality traits
  - Set speaking style (formal, casual, etc.)
  - Define catchphrases or speech patterns
- **And** persona applied consistently
- **And** can clone/customize existing personas

**Implements:** FR67
**Screens:** 2.2.2
**Research Reference:** T8-AIGEN §4

---

#### Story 2.2.8: Real-Time Audio via WebRTC/gRPC

As a **system**,
I want **real-time audio streaming via WebRTC/gRPC**,
So that **voice conversations have low latency**.

**Acceptance Criteria:**

- **Given** voice call is active
- **When** audio streams
- **Then** system:
  - Uses WebRTC for browser clients
  - Uses gRPC for server-to-server
  - Achieves <200ms round-trip latency
  - Handles packet loss gracefully
- **And** audio quality adapts to bandwidth
- **And** encryption for all streams

**Implements:** FR68
**Screens:** 2.2.3, 2.2.5, 2.2.6
**Research Reference:** T6-VOICE

---

**Epic E2.2 Complete: 8 stories**

---

### Epic E2.3: Voice Agent - Telephony Integration

**Research:** T6-LIVEKIT §7, T6-INTEG
**UX Screens:** 2.2.1, 2.2.3, 1.4.1
**Implements:** FR65, FR66

---

#### Story 2.3.1: Inbound/Outbound Calls via Twilio SIP

As a **voice agent builder user**,
I want **to handle phone calls via Twilio SIP**,
So that **voice agents can interact over PSTN**.

**Acceptance Criteria:**

- **Given** I configure telephony (2.2.3)
- **When** I set up Twilio integration
- **Then** I can:
  - Configure inbound number (receive calls)
  - Configure outbound calling (make calls)
  - Set up SIP trunk connection
  - Configure call routing rules
- **And** calls connect to voice agent
- **And** call metadata available in flow

**Implements:** FR65
**Screens:** 2.2.1, 2.2.3
**Research Reference:** T6-LIVEKIT §7

---

#### Story 2.3.2: Voice Agents Access Project RAG

As a **voice agent builder user**,
I want **voice agents to access the same project RAG context**,
So that **voice agents have knowledge base support**.

**Acceptance Criteria:**

- **Given** I have a Knowledge Base in my project
- **When** I build a voice agent (2.2.1)
- **Then** voice agent can:
  - Query KB during conversation
  - Use RAG for answers
  - Cite sources verbally
  - Access same KB as other builders
- **And** RAG context passed to LLM nodes
- **And** retrieval happens during conversation

**Implements:** FR66
**Screens:** 2.2.1, 1.4.1
**Research Reference:** T6-INTEG

---

**Epic E2.3 Complete: 2 stories**

---

### Epic E2.4: Canvas Builder - Core Editor

**Research:** T7-CANVAS §1-2, §5-6, §8.1, §9
**UX Screens:** 2.1.1, 2.1.7, 2.1.8
**Implements:** FR69, FR71, FR73, FR76, FR77, FR78

---

#### Story 2.4.1: Canvas AI Generation Workflow Editor

As a **canvas builder user**,
I want **to create AI generation workflows using canvas**,
So that **I can design image/video/audio generation pipelines**.

**Acceptance Criteria:**

- **Given** I am in Canvas Builder (2.1.1)
- **When** I open a new or existing canvas
- **Then** I see:
  - Generation flow canvas
  - Node palette (generation, enhancement, control)
  - "Artie" agent for assistance
  - Preview panel for outputs
- **And** flows optimized for media generation
- **And** can preview intermediate results

**Implements:** FR69
**Screens:** 2.1.1
**Research Reference:** T7-CANVAS §1-2

---

#### Story 2.4.2: Canvas Control Nodes (Merge, Split, Switch, Loop)

As a **canvas builder user**,
I want **control flow nodes for canvas**,
So that **I can build complex generation pipelines**.

**Acceptance Criteria:**

- **Given** I am building a canvas flow
- **When** I add control nodes
- **Then** I can use:
  - **Merge**: Combine multiple inputs
  - **Split**: Branch to multiple outputs
  - **Switch**: Conditional routing
  - **Loop**: Iterate over batch inputs
- **And** similar to Module Builder controls
- **And** optimized for media pipeline patterns

**Implements:** FR71
**Screens:** 2.1.1
**Research Reference:** T7-CANVAS §5

---

#### Story 2.4.3: Canvas I/O Nodes (Upload, Download, URL)

As a **canvas builder user**,
I want **I/O nodes for file handling**,
So that **I can input and output media files**.

**Acceptance Criteria:**

- **Given** I am building a canvas flow
- **When** I add I/O nodes (2.1.7)
- **Then** I can use:
  - **Upload**: Accept files as input
  - **Download**: Output files for download
  - **URL Input**: Load from URL
  - **Gallery**: Display multiple outputs
- **And** supports images, video, audio, 3D
- **And** file size limits configurable

**Implements:** FR73
**Screens:** 2.1.7, 2.1.1
**Research Reference:** T7-CANVAS §5

---

#### Story 2.4.4: Artie Agent for NL Canvas Building

As a **canvas builder user**,
I want **to converse with "Artie" agent for NL building**,
So that **I can describe what I want to generate**.

**Acceptance Criteria:**

- **Given** I am in Canvas Builder
- **When** I chat with Artie
- **Then** I can:
  - Describe desired generation pipeline
  - Get node suggestions
  - Have Artie create/modify flows
  - Ask questions about generation techniques
- **And** Artie has AI generation expertise
- **And** understands ComfyUI patterns

**Implements:** FR76
**Screens:** 2.1.1 (Artie chat)
**Research Reference:** T7-CANVAS §6

---

#### Story 2.4.5: DAG Execution with Topological Sort

As a **system**,
I want **to execute canvas DAGs with topological sort**,
So that **nodes execute in correct dependency order**.

**Acceptance Criteria:**

- **Given** canvas flow is triggered
- **When** execution begins (2.1.8)
- **Then** system:
  - Performs topological sort of DAG
  - Executes nodes in dependency order
  - Parallelizes independent branches
  - Handles errors at each node
- **And** cycle detection prevents invalid graphs
- **And** execution order visualized in UI

**Implements:** FR77
**Screens:** 2.1.8, 1.2.3
**Research Reference:** T7-CANVAS §8.1, §9

---

#### Story 2.4.6: Partial Re-Execution (Changed Nodes Only)

As a **canvas builder user**,
I want **partial re-execution of changed nodes only**,
So that **iteration is fast when tweaking parameters**.

**Acceptance Criteria:**

- **Given** I've run a canvas flow before
- **When** I change a node and re-run
- **Then** system:
  - Detects which nodes changed
  - Re-uses cached outputs for unchanged nodes
  - Only re-executes changed nodes and descendants
  - Shows cache hits in execution trace
- **And** significantly faster than full re-run
- **And** cache can be manually invalidated

**Implements:** FR78
**Screens:** 2.1.1, 1.2.3
**Research Reference:** T7-CANVAS §9

---

**Epic E2.4 Complete: 6 stories**

---

### Epic E2.5: Canvas Builder - Generation & Enhancement Nodes

**Research:** T7-CANVAS §5, §13, T8-AIGEN §7, §10, T5-MCP
**UX Screens:** 2.1.3, 2.1.7, 2.1.8, 2.1.9, 3.1.3, 3.1.4
**Implements:** FR70, FR72, FR74, FR75, FR79, FR81, FR82

---

#### Story 2.5.1: Generation Nodes (Image, Video, Audio, 3D)

As a **canvas builder user**,
I want **generation nodes for various media types**,
So that **I can create diverse AI-generated content**.

**Acceptance Criteria:**

- **Given** I am building a canvas flow
- **When** I add generation nodes (2.1.3)
- **Then** I can use:
  - **Image Gen**: Stable Diffusion, DALL-E, Midjourney API
  - **Video Gen**: Runway, Pika, Sora (when available)
  - **Audio Gen**: Music, speech, sound effects
  - **3D Gen**: Mesh generation, texture creation
- **And** each node has model/provider selection
- **And** parameters configurable per model

**Implements:** FR70
**Screens:** 2.1.3, 2.1.7
**Research Reference:** T7-CANVAS §5

---

#### Story 2.5.2: Enhancement Nodes (Upscale, Denoise)

As a **canvas builder user**,
I want **enhancement nodes for improving outputs**,
So that **I can refine generated content**.

**Acceptance Criteria:**

- **Given** I have generated content
- **When** I add enhancement nodes (2.1.7)
- **Then** I can use:
  - **Upscale**: Increase resolution (2x, 4x)
  - **Denoise**: Remove noise/artifacts
  - **Color Correct**: Adjust colors
  - **Background Remove**: Extract foreground
- **And** supports chaining multiple enhancements
- **And** preview before/after comparison

**Implements:** FR72
**Screens:** 2.1.3, 2.1.7
**Research Reference:** T8-AIGEN §7

---

#### Story 2.5.3: MCP and Skill Nodes in Canvas

As a **canvas builder user**,
I want **MCP Tool and Skill nodes in canvas**,
So that **I can extend generation capabilities**.

**Acceptance Criteria:**

- **Given** I have MCP servers/Skills installed
- **When** I add to canvas flow (2.1.4)
- **Then** I can use:
  - MCP tools for custom processing
  - Skills for specialized generation prompts
- **And** tool outputs can feed into generation
- **And** integrates with canvas variable system

**Implements:** FR74, FR75
**Screens:** 2.1.4, 3.1.3, 3.1.4
**Research Reference:** T5-MCP

---

#### Story 2.5.4: Cache Intermediate Node Outputs

As a **system**,
I want **to cache intermediate node outputs**,
So that **re-runs are faster and cost-effective**.

**Acceptance Criteria:**

- **Given** canvas execution produces outputs
- **When** nodes complete
- **Then** system:
  - Caches output based on input hash
  - Stores in object storage (S3/GCS)
  - Respects cache TTL (configurable)
  - Shows cache status per node
- **And** cache hits skip expensive operations
- **And** cache can be shared across users (same inputs)

**Implements:** FR79
**Screens:** 2.1.7, 2.1.8
**Research Reference:** T7-CANVAS §13

---

#### Story 2.5.5: Cost Estimation Before Execution

As a **canvas builder user**,
I want **cost estimation before execution**,
So that **I know what I'll spend before running**.

**Acceptance Criteria:**

- **Given** I have a canvas flow ready
- **When** I click estimate (2.1.9)
- **Then** system shows:
  - Estimated cost per node
  - Total estimated cost
  - Credits/dollars breakdown
  - Comparison with cached vs. fresh run
- **And** estimation based on input sizes
- **And** actual cost tracked after run

**Implements:** FR81
**Screens:** 2.1.9, 2.1.3
**Research Reference:** T8-AIGEN §10

---

#### Story 2.5.6: Queue Batch Jobs

As a **canvas builder user**,
I want **to queue batch jobs for processing**,
So that **I can run many generations efficiently**.

**Acceptance Criteria:**

- **Given** I have multiple inputs to process
- **When** I configure batch job (2.1.8)
- **Then** I can:
  - Upload batch inputs (CSV, folder)
  - Configure parallelism
  - Set priority level
  - Monitor batch progress
- **And** jobs queued and processed by workers
- **And** results available for download

**Implements:** FR82
**Screens:** 2.1.8
**Research Reference:** T7-CANVAS §9

---

**Epic E2.5 Complete: 6 stories**

---

### Epic E2.6: Canvas Builder - Brand RAG & Providers

**Research:** T7-CANVAS §11, T6-INTEG, T8-AIGEN §6
**UX Screens:** 2.1.1, 2.1.3, 1.3.4, 1.10.4, 2.14.5
**Implements:** FR80, FR83, FR84, FR85

---

#### Story 2.6.1: Brand RAG for Style Guidelines

As a **canvas builder user**,
I want **to configure Brand RAG for style guidelines**,
So that **generations match my brand aesthetic**.

**Acceptance Criteria:**

- **Given** I have brand guidelines documents
- **When** I configure Brand RAG (2.1.1, 2.1.3)
- **Then** I can:
  - Upload brand guidelines (colors, fonts, style)
  - Upload reference images
  - Define brand voice/tone
  - Set default prompts with brand context
- **And** Brand RAG automatically included in prompts
- **And** generations stay on-brand

**Implements:** FR80
**Screens:** 2.1.1, 2.1.3
**Research Reference:** T7-CANVAS §11

---

#### Story 2.6.2: Canvas Triggered by Chatbot/Voice Events

As a **canvas builder user**,
I want **canvas flows triggered by chatbot/voice events**,
So that **generation happens based on conversation**.

**Acceptance Criteria:**

- **Given** I have chatbot/voice agent
- **When** trigger event occurs (1.3.4)
- **Then** canvas flow can:
  - Receive trigger from chatbot node
  - Receive trigger from voice agent node
  - Access conversation context
  - Return generated content
- **And** cross-builder integration seamless
- **And** results sent back to conversation

**Implements:** FR83
**Screens:** 2.1.1, 1.3.4
**Research Reference:** T6-INTEG

---

#### Story 2.6.3: Configure AI Providers (fal.ai)

As a **canvas builder user**,
I want **to configure AI generation providers**,
So that **I can choose providers based on needs**.

**Acceptance Criteria:**

- **Given** I configure provider settings (1.10.4)
- **When** I set up providers
- **Then** I can configure:
  - fal.ai (serverless GPU)
  - Replicate
  - RunPod
  - Self-hosted (ComfyUI)
- **And** API keys stored securely
- **And** can set default provider per node type

**Implements:** FR84
**Screens:** 2.1.3, 1.10.4
**Research Reference:** T8-AIGEN §6

---

#### Story 2.6.4: 50+ Node Types (ComfyUI Parity)

As a **canvas builder user**,
I want **50+ node types matching ComfyUI capabilities**,
So that **I have full generation power**.

**Acceptance Criteria:**

- **Given** I am building a canvas flow (2.14.5)
- **When** I browse node library
- **Then** I see 50+ node types including:
  - Samplers (Euler, DPM++, etc.)
  - Schedulers (Karras, exponential)
  - ControlNet, LoRA, IP-Adapter
  - Inpainting, outpainting
  - Face restoration, upscaling
- **And** node types organized by category
- **And** compatible with ComfyUI workflows

**Implements:** FR85
**Screens:** 2.1.1, 2.14.5
**Research Reference:** T7-CANVAS §5

---

**Epic E2.6 Complete: 4 stories**

---

### Epic E2.7: Cross-Builder Integration

**Research:** T6-INTEG §6, §11-12, T0-RAG, T7-CANVAS §7
**UX Screens:** 1.3.5, 1.5.5, 2.1.1, 1.4.1, 1.6.1
**Implements:** FR243, FR244, FR245, FR246, FR247, FR248

---

#### Story 2.7.1: Module Callable from Chatbots (<500ms)

As a **chatbot builder user**,
I want **to call Module workflows from chatbots with low latency**,
So that **conversations can leverage complex workflows**.

**Acceptance Criteria:**

- **Given** I have a Module workflow
- **When** chatbot calls it (1.3.5)
- **Then**:
  - Call completes in <500ms for simple modules
  - Conversation context passed to module
  - Module output returned to chatbot
  - Error handling shows user-friendly message
- **And** gRPC used for internal calls
- **And** latency monitored and alerted

**Implements:** FR243
**Screens:** 1.3.5
**Research Reference:** T6-INTEG §11-12

---

#### Story 2.7.2: Voice Agents Call Modules via gRPC (<50ms)

As a **voice agent builder user**,
I want **voice agents to call Modules via gRPC with minimal latency**,
So that **voice conversations remain natural**.

**Acceptance Criteria:**

- **Given** voice agent needs module functionality
- **When** module is called (1.5.5)
- **Then**:
  - Internal call via gRPC
  - Latency overhead <50ms
  - Voice context preserved
  - Streaming responses supported
- **And** critical for real-time voice
- **And** connection pooling for efficiency

**Implements:** FR244
**Screens:** 1.5.5
**Research Reference:** T6-INTEG §6

---

#### Story 2.7.3: Canvas Triggered by Chatbot/Voice

As a **system**,
I want **canvas flows triggerable by chatbot/voice events**,
So that **media generation integrates with conversations**.

**Acceptance Criteria:**

- **Given** chatbot or voice agent
- **When** generation is needed
- **Then**:
  - Canvas flow triggered with context
  - Generation runs asynchronously
  - Result URL returned to conversation
  - Progress updates via AG-UI events
- **And** supports "generate me an image of X" commands
- **And** handles generation timeouts gracefully

**Implements:** FR245
**Screens:** 2.1.1
**Research Reference:** T6-INTEG, T7-CANVAS §7

---

#### Story 2.7.4: Shared RAG Context Across All Builders

As a **project user**,
I want **all builders to share the same project RAG context**,
So that **knowledge is consistent across all interactions**.

**Acceptance Criteria:**

- **Given** project has Knowledge Base
- **When** any builder queries RAG (1.4.1)
- **Then**:
  - Same KB accessible from Module, Chatbot, Voice, Canvas
  - Same retrieval settings apply
  - Same entity graph available
  - Consistent citations
- **And** RAG permissions follow user role
- **And** KB panel visible in all builders

**Implements:** FR246
**Screens:** 1.4.1
**Research Reference:** T0-RAG

---

#### Story 2.7.5: State Propagation via PostgreSQL NOTIFY

As a **system**,
I want **state changes to propagate via PostgreSQL NOTIFY**,
So that **cross-builder state is synchronized**.

**Acceptance Criteria:**

- **Given** state changes in one component
- **When** change needs propagation
- **Then**:
  - NOTIFY sent with change payload
  - Listeners receive via LISTEN
  - State updated across builders
  - Transaction consistency maintained
- **And** used for critical sync operations
- **And** complements Redis for scale

**Implements:** FR247
**Screens:** 1.6.1
**Research Reference:** T6-INTEG §6

---

#### Story 2.7.6: Event Fan-Out via Redis Pub/Sub (<200ms)

As a **system**,
I want **events to fan-out via Redis Pub/Sub**,
So that **multiple subscribers receive updates quickly**.

**Acceptance Criteria:**

- **Given** event occurs
- **When** published to Redis
- **Then**:
  - All subscribers receive in <200ms
  - Topics namespaced by workspace
  - Subscriber failures don't block others
  - Message ordering preserved per topic
- **And** used for real-time UI updates
- **And** combined with PostgreSQL for reliability

**Implements:** FR248
**Screens:** 1.6.1
**Research Reference:** T6-INTEG §6

---

**Epic E2.7 Complete: 6 stories**

---

### Epic E2.8: MCP Server Installation

**Research:** T5-MCP §1-3, §6-7
**UX Screens:** 3.2.1, 3.2.2, 3.2.3, 3.2.4, 3.2.5, 3.2.6
**Implements:** FR100, FR101, FR102, FR103, FR104, FR105, FR106, FR107, FR108

---

#### Story 2.8.1: Browse MCP Servers from Official Registry

As a **user**,
I want **to browse MCP servers from the Official Registry**,
So that **I can discover available tools**.

**Acceptance Criteria:**

- **Given** I am in MCP marketplace (3.2.1)
- **When** I browse servers
- **Then** I see:
  - List of servers from Official MCP Registry
  - Server icons and descriptions
  - Verified badge for official servers
  - Install counts and ratings
- **And** data fetched from official registry API
- **And** cached for performance

**Implements:** FR100
**Screens:** 3.2.1
**Research Reference:** T5-MCP §1

---

#### Story 2.8.2: Browse MCP Servers from Smithery.ai

As a **user**,
I want **to browse MCP servers from Smithery.ai**,
So that **I have access to community servers**.

**Acceptance Criteria:**

- **Given** I am in MCP marketplace
- **When** I filter by source
- **Then** I can see servers from:
  - Official MCP Registry
  - Smithery.ai marketplace
  - Both combined
- **And** source badge displayed per server
- **And** can sort by source

**Implements:** FR101
**Screens:** 3.2.1
**Research Reference:** T5-MCP §1.2

---

#### Story 2.8.3: Semantic Search for MCP Servers

As a **user**,
I want **to search MCP servers with semantic search**,
So that **I can find servers by describing what I need**.

**Acceptance Criteria:**

- **Given** I am in MCP marketplace
- **When** I search (3.2.2)
- **Then** I can:
  - Enter natural language query
  - Get semantically relevant results
  - See relevance scores
- **And** search indexes names, descriptions, capabilities
- **And** "file operations" finds file-related servers

**Implements:** FR102
**Screens:** 3.2.2
**Research Reference:** T5-MCP §7.1

---

#### Story 2.8.4: Filter by Category, Verified, Popularity

As a **user**,
I want **to filter MCP servers by various criteria**,
So that **I can narrow down options**.

**Acceptance Criteria:**

- **Given** I am browsing MCP servers (3.2.2)
- **When** I apply filters
- **Then** I can filter by:
  - Category (file, web, database, AI, etc.)
  - Verified status
  - Popularity (install count)
  - Ratings
- **And** filters combinable
- **And** filter counts shown

**Implements:** FR103
**Screens:** 3.2.2
**Research Reference:** T5-MCP §7.1

---

#### Story 2.8.5: View MCP Server Details

As a **user**,
I want **to view detailed MCP server information**,
So that **I can evaluate before installing**.

**Acceptance Criteria:**

- **Given** I select an MCP server
- **When** details page loads (3.2.3)
- **Then** I see:
  - Full description
  - Available tools with schemas
  - Resource types
  - Configuration requirements
  - Version history
  - User reviews
- **And** can copy tool schemas
- **And** documentation links included

**Implements:** FR104
**Screens:** 3.2.3
**Research Reference:** T5-MCP §1.1

---

#### Story 2.8.6: One-Click MCP Server Installation

As a **user**,
I want **to install MCP servers with one click**,
So that **setup is simple**.

**Acceptance Criteria:**

- **Given** I want to install an MCP server
- **When** I click Install (3.2.4)
- **Then**:
  - Server is added to my workspace
  - Required configuration prompt shown
  - Dependencies installed automatically
  - Server registered for use in builders
- **And** install progress shown
- **And** can uninstall later

**Implements:** FR105
**Screens:** 3.2.4
**Research Reference:** T5-MCP §2-3

---

#### Story 2.8.7: Configure Installed MCP Server Settings

As a **user**,
I want **to configure installed MCP server settings**,
So that **I can customize behavior**.

**Acceptance Criteria:**

- **Given** I have an installed MCP server
- **When** I open settings (3.2.5)
- **Then** I can configure:
  - API keys and credentials
  - Server-specific parameters
  - Resource limits
  - Default values
- **And** settings validated before save
- **And** sensitive values encrypted

**Implements:** FR106
**Screens:** 3.2.5
**Research Reference:** T5-MCP §6.1

---

#### Story 2.8.8: Enable/Disable MCP Servers

As a **user**,
I want **to enable or disable installed MCP servers**,
So that **I can control which are active**.

**Acceptance Criteria:**

- **Given** I have installed MCP servers
- **When** I toggle enable/disable (3.2.5)
- **Then**:
  - Disabled servers not available in builders
  - Can re-enable anytime
  - Settings preserved when disabled
  - Per-project override available
- **And** status visible in server list

**Implements:** FR107
**Screens:** 3.2.5
**Research Reference:** T5-MCP §2.2

---

#### Story 2.8.9: Auto-Approval Rules for MCP Tools

As a **user**,
I want **to set auto-approval rules for MCP tools**,
So that **trusted tools don't require confirmation**.

**Acceptance Criteria:**

- **Given** I use MCP tools frequently
- **When** I configure rules (3.2.6)
- **Then** I can set:
  - Always approve (specific tools)
  - Always ask (specific tools)
  - Auto-approve read operations
  - Require approval for writes
- **And** rules apply during agent execution
- **And** audit log tracks approvals

**Implements:** FR108
**Screens:** 3.2.6
**Research Reference:** T5-MCP §2.2

---

**Epic E2.8 Complete: 9 stories**

---

### Epic E2.9: MCP Registry Aggregation

**Research:** T5-MCP §7.3, T4-OBS §5
**UX Screens:** 3.2.1, 3.3.3
**Implements:** FR109, FR110, FR113

---

#### Story 2.9.1: Aggregate from Multiple Registries

As a **system**,
I want **to aggregate MCP servers from multiple registries**,
So that **users have a unified marketplace**.

**Acceptance Criteria:**

- **Given** multiple registries exist
- **When** marketplace loads
- **Then** system:
  - Fetches from Official Registry
  - Fetches from Smithery.ai
  - Merges into unified listing
  - Deduplicates by server ID
- **And** source attribution preserved
- **And** priority order configurable

**Implements:** FR109
**Screens:** 3.2.1
**Research Reference:** T5-MCP §7.3

---

#### Story 2.9.2: Cache Registry Metadata

As a **system**,
I want **to cache registry metadata**,
So that **browsing is fast and reduces API calls**.

**Acceptance Criteria:**

- **Given** registries are fetched
- **When** caching applied
- **Then**:
  - Metadata cached for 1 hour
  - Cache invalidated on registry webhook
  - Stale-while-revalidate pattern used
  - Cache stored in Redis
- **And** cache hit rate monitored
- **And** manual refresh available

**Implements:** FR110
**Screens:** 3.2.1
**Research Reference:** T5-MCP §7.3

---

#### Story 2.9.3: Track MCP Server Usage and Success Rates

As a **system**,
I want **to track MCP server usage and success rates**,
So that **quality metrics inform discovery**.

**Acceptance Criteria:**

- **Given** MCP tools are used
- **When** execution completes
- **Then** system tracks:
  - Call count per server
  - Success/failure rates
  - Average latency
  - Error types
- **And** metrics displayed in marketplace (3.3.3)
- **And** low success rates flagged

**Implements:** FR113
**Screens:** 3.3.3
**Research Reference:** T4-OBS §5

---

**Epic E2.9 Complete: 3 stories**

---

### Epic E2.10: Skills Installation

**Research:** T5-MCP §5, §7.1
**UX Screens:** 3.4.1, 3.4.2, 3.4.3, 3.4.4, 3.4.5, 1.3.1, 1.3.2, 1.6.1
**Implements:** FR114, FR115, FR116, FR117, FR118, FR119, FR120, FR121, FR122

---

#### Story 2.10.1: Browse Skills from Platform Marketplace

As a **user**,
I want **to browse Skills from the platform marketplace**,
So that **I can find reusable prompt templates**.

**Acceptance Criteria:**

- **Given** I am in Skills marketplace (3.4.1)
- **When** I browse Skills
- **Then** I see:
  - List of available Skills
  - Skill icons and descriptions
  - Creator information
  - Install counts and ratings
- **And** Skills organized by category
- **And** featured Skills highlighted

**Implements:** FR114
**Screens:** 3.4.1
**Research Reference:** T5-MCP §7.1

---

#### Story 2.10.2: Browse Skills from Project/User Directories

As a **user**,
I want **to browse Skills from my project/user directories**,
So that **I can use custom Skills**.

**Acceptance Criteria:**

- **Given** I have local Skills
- **When** I browse (3.4.2)
- **Then** I can see:
  - Project-level Skills
  - User-level Skills
  - Workspace-shared Skills
- **And** local Skills distinguished from marketplace
- **And** can edit local Skills

**Implements:** FR115
**Screens:** 3.4.2
**Research Reference:** T5-MCP §5.1

---

#### Story 2.10.3: Semantic Search for Skills

As a **user**,
I want **to search Skills with semantic search**,
So that **I can find Skills by describing needs**.

**Acceptance Criteria:**

- **Given** I am in Skills marketplace
- **When** I search (3.4.1)
- **Then** results include:
  - Semantically similar Skills
  - Keyword matches
  - Relevance ranking
- **And** search covers name, description, args

**Implements:** FR116
**Screens:** 3.4.1
**Research Reference:** T5-MCP §7.1

---

#### Story 2.10.4: Filter Skills by Category, Ratings, Creator

As a **user**,
I want **to filter Skills by various criteria**,
So that **I can find relevant Skills quickly**.

**Acceptance Criteria:**

- **Given** I am browsing Skills
- **When** I apply filters
- **Then** I can filter by:
  - Category (writing, coding, analysis, etc.)
  - Ratings
  - Creator
  - Free/paid
- **And** filters combinable

**Implements:** FR117
**Screens:** 3.4.1
**Research Reference:** T5-MCP §7.1

---

#### Story 2.10.5: View Skill Details

As a **user**,
I want **to view Skill details before installing**,
So that **I can evaluate suitability**.

**Acceptance Criteria:**

- **Given** I select a Skill
- **When** details load (3.4.3)
- **Then** I see:
  - Full description
  - Input arguments with types
  - Example usage
  - User reviews
  - Version history
- **And** can preview Skill execution

**Implements:** FR118
**Screens:** 3.4.3
**Research Reference:** T5-MCP §5.2

---

#### Story 2.10.6: One-Click Skill Installation

As a **user**,
I want **to install Skills with one click**,
So that **I can quickly add capabilities**.

**Acceptance Criteria:**

- **Given** I find a Skill I want
- **When** I click Install (3.4.4)
- **Then**:
  - Skill added to my workspace
  - Available in all builders
  - Dependencies noted
- **And** paid Skills handled via billing
- **And** can uninstall later

**Implements:** FR119
**Screens:** 3.4.4
**Research Reference:** T5-MCP §5.1

---

#### Story 2.10.7: Add Skill Nodes to Workflows

As a **user**,
I want **to add Skill nodes to my workflows**,
So that **I can use installed Skills**.

**Acceptance Criteria:**

- **Given** I have Skills installed
- **When** I build workflow (1.3.1, 1.3.2)
- **Then** I can:
  - Drag Skill node from library
  - Select from installed Skills
  - Map arguments from variables
  - Configure execution options
- **And** Skill output available downstream

**Implements:** FR120
**Screens:** 1.3.1, 1.3.2
**Research Reference:** T5-MCP §5.3

---

#### Story 2.10.8: Validate Skill Frontmatter (SKILL.md YAML)

As a **system**,
I want **to validate Skill frontmatter**,
So that **only valid Skills are loaded**.

**Acceptance Criteria:**

- **Given** Skill is loaded
- **When** frontmatter parsed
- **Then** system validates:
  - Required fields present (name, description)
  - Args schema valid
  - Types supported
  - No syntax errors
- **And** validation errors shown to creator
- **And** invalid Skills not executable

**Implements:** FR121
**Screens:** 3.4.5
**Research Reference:** T5-MCP §6.2

---

#### Story 2.10.9: Resolve Skill Paths During Execution

As a **system**,
I want **to resolve Skill paths during execution**,
So that **Skills are found and loaded correctly**.

**Acceptance Criteria:**

- **Given** workflow uses Skill
- **When** execution reaches Skill node
- **Then** system:
  - Resolves Skill path (project, user, marketplace)
  - Loads SKILL.md content
  - Parses and validates
  - Executes with context
- **And** path resolution order defined
- **And** missing Skills error clearly

**Implements:** FR122
**Screens:** 1.6.1
**Research Reference:** T5-MCP §5.3

---

**Epic E2.10 Complete: 9 stories**

---

### Epic E2.11: Skills Creation & Publishing

**Research:** T5-MCP §5.2, §5.4, B2-MARKET §8
**UX Screens:** 3.4.6, 3.4.7, 3.4.8, 3.4.9
**Implements:** FR123, FR124, FR125, FR126

---

#### Story 2.11.1: Create Custom Skills (SKILL.md Format)

As a **creator**,
I want **to create custom Skills using SKILL.md format**,
So that **I can build reusable prompts**.

**Acceptance Criteria:**

- **Given** I am creating a Skill (3.4.6)
- **When** I define the Skill
- **Then** I can:
  - Write prompt template in markdown
  - Define YAML frontmatter (name, description, args)
  - Specify argument types and defaults
  - Add usage examples
- **And** live preview shows execution result
- **And** validation errors highlighted

**Implements:** FR123
**Screens:** 3.4.6
**Research Reference:** T5-MCP §5.2

---

#### Story 2.11.2: Publish Skills to Marketplace

As a **creator**,
I want **to publish Skills to the marketplace**,
So that **others can use my work**.

**Acceptance Criteria:**

- **Given** I have a valid Skill
- **When** I publish (3.4.7)
- **Then** I can:
  - Add detailed description
  - Select category
  - Add screenshots/examples
  - Set visibility (public/private)
  - Submit for review
- **And** review process ensures quality
- **And** versioning supported

**Implements:** FR124
**Screens:** 3.4.7
**Research Reference:** B2-MARKET

---

#### Story 2.11.3: Set Pricing for Skills

As a **creator**,
I want **to set pricing for my Skills**,
So that **I can monetize my work**.

**Acceptance Criteria:**

- **Given** I am publishing a Skill
- **When** I set pricing (3.4.8)
- **Then** I can choose:
  - Free
  - One-time purchase
  - Subscription (monthly/yearly)
  - Per-use pricing
- **And** platform takes 15% fee
- **And** pricing displayed to buyers

**Implements:** FR125
**Screens:** 3.4.8
**Research Reference:** B2-MARKET §8

---

#### Story 2.11.4: AI-Assisted Skill Discovery

As a **user**,
I want **AI to assist in discovering relevant Skills**,
So that **I find the right Skills for my task**.

**Acceptance Criteria:**

- **Given** I am building a workflow
- **When** AI suggests Skills (3.4.9)
- **Then** system:
  - Analyzes current workflow context
  - Suggests relevant Skills
  - Explains why each is relevant
  - One-click to add
- **And** suggestions improve with usage
- **And** can disable suggestions

**Implements:** FR126
**Screens:** 3.4.9
**Research Reference:** T5-MCP §5.4

---

**Epic E2.11 Complete: 4 stories**

---

### Epic E2.12: UI Generation

**Research:** T3-UIGEN §4, §6-7, §10, §12, T5-WHITE §1, T4-EMBED
**UX Screens:** 2.2.1, 2.2.2, 2.2.3, 2.2.4, 2.2.5, 2.2.6, 2.2.7
**Implements:** FR179, FR180, FR181, FR182, FR183, FR184, FR185, FR186

---

#### Story 2.12.1: Generate UIs from Workflow Definitions

As a **module user**,
I want **UIs auto-generated from my workflow definitions**,
So that **I can create user interfaces without coding**.

**Acceptance Criteria:**

- **Given** I have a workflow with inputs/outputs
- **When** I generate UI (2.2.1)
- **Then** system:
  - Analyzes workflow schema
  - Generates appropriate form components
  - Creates result display area
  - Wires up execution
- **And** UI matches workflow inputs
- **And** customizable after generation

**Implements:** FR179
**Screens:** 2.2.1
**Research Reference:** T3-UIGEN §6-7

---

#### Story 2.12.2: Map Agent Inputs to Form Components

As a **system**,
I want **to map agent inputs to form components**,
So that **forms match input types**.

**Acceptance Criteria:**

- **Given** workflow inputs are defined
- **When** UI generates (2.2.2)
- **Then** mappings include:
  - String → Text input
  - Number → Number input with validation
  - Boolean → Checkbox/toggle
  - Enum → Dropdown/radio
  - File → File upload
  - Array → Multi-value input
- **And** custom mappings configurable

**Implements:** FR180
**Screens:** 2.2.2
**Research Reference:** T3-UIGEN §6

---

#### Story 2.12.3: Generate Multi-Step Wizards

As a **module user**,
I want **multi-step wizards for complex workflows**,
So that **users aren't overwhelmed**.

**Acceptance Criteria:**

- **Given** workflow has many inputs
- **When** wizard mode enabled (2.2.3)
- **Then** UI:
  - Splits into logical steps
  - Shows progress indicator
  - Validates each step before proceeding
  - Allows back navigation
- **And** step grouping customizable
- **And** conditional steps supported

**Implements:** FR181
**Screens:** 2.2.3
**Research Reference:** T3-UIGEN §7

---

#### Story 2.12.4: Customize UI Themes (CSS Variables)

As a **user**,
I want **to customize UI themes via CSS variables**,
So that **generated UIs match my brand**.

**Acceptance Criteria:**

- **Given** I have a generated UI
- **When** I customize theme (2.2.4)
- **Then** I can set:
  - Primary/secondary colors
  - Font family
  - Border radius
  - Spacing scale
- **And** changes preview in real-time
- **And** themes can be saved and reused

**Implements:** FR182
**Screens:** 2.2.4
**Research Reference:** T5-WHITE §1

---

#### Story 2.12.5: Embed UIs via iframe or Web Component

As a **user**,
I want **to embed generated UIs via iframe or Web Component**,
So that **I can integrate into other applications**.

**Acceptance Criteria:**

- **Given** I have a generated UI
- **When** I get embed code (2.2.5)
- **Then** I receive:
  - iframe embed code
  - Web Component embed code
  - React SDK usage example
- **And** authentication configurable
- **And** custom domains supported

**Implements:** FR183
**Screens:** 2.2.5
**Research Reference:** T3-UIGEN §10

---

#### Story 2.12.6: Embedded Chat Widgets in Generated UIs

As a **user**,
I want **generated UIs to include embedded chat widgets**,
So that **users can interact conversationally**.

**Acceptance Criteria:**

- **Given** workflow has chatbot component
- **When** UI generates (2.2.6)
- **Then** UI includes:
  - Embedded chat widget
  - Floating chat button option
  - Full-page chat option
- **And** chat connected to project chatbot
- **And** chat history persisted

**Implements:** FR184
**Screens:** 2.2.6
**Research Reference:** T4-EMBED

---

#### Story 2.12.7: Render Using shadcn/ui Components

As a **system**,
I want **to render generated UIs using shadcn/ui**,
So that **UIs are high-quality and accessible**.

**Acceptance Criteria:**

- **Given** UI is generated
- **When** components render
- **Then** system uses:
  - shadcn/ui component library
  - Tailwind CSS for styling
  - Radix UI primitives
  - WCAG 2.1 AA accessibility
- **And** components consistent across UIs
- **And** dark mode supported

**Implements:** FR185
**Screens:** 2.2.1
**Research Reference:** T3-UIGEN §4

---

#### Story 2.12.8: REST/GraphQL API Endpoints for UIs

As a **user**,
I want **REST and GraphQL API endpoints for my workflows**,
So that **I can integrate programmatically**.

**Acceptance Criteria:**

- **Given** I have a workflow
- **When** I enable API access (2.2.7)
- **Then** I get:
  - REST endpoint with OpenAPI spec
  - GraphQL endpoint with schema
  - Authentication via API keys
  - Rate limiting applied
- **And** auto-generated documentation
- **And** SDK code samples provided

**Implements:** FR186
**Screens:** 2.2.7
**Research Reference:** T3-UIGEN §12

---

**Epic E2.12 Complete: 8 stories**

---

### Epic E2.13: Customer Interaction - Chat Deployment

**Research:** T4-CHAT §2, §4, §6, §11, T4-EMBED §1-3
**UX Screens:** 1.9.1, 1.9.2, 1.9.3, 1.9.4, 1.9.5, 1.9.6, 1.9.7, 1.9.8
**Implements:** FR156, FR157, FR158, FR159, FR160, FR161, FR162, FR163, FR164, FR165

---

#### Story 2.13.1: Deploy Chatbots to Chatwoot Inboxes

As a **chatbot builder user**,
I want **to deploy chatbots to Chatwoot inboxes**,
So that **chatbots serve customers on website**.

**Acceptance Criteria:**

- **Given** I have a chatbot
- **When** I deploy (1.9.1)
- **Then** I can:
  - Connect to Chatwoot instance
  - Select or create inbox
  - Configure bot assignment rules
  - Set working hours
- **And** chatbot handles incoming messages
- **And** can manage multiple inboxes

**Implements:** FR156
**Screens:** 1.9.1
**Research Reference:** T4-CHAT §6

---

#### Story 2.13.2: Receive Messages via Agent Bot Webhooks

As a **system**,
I want **to receive messages via Chatwoot Agent Bot webhooks**,
So that **chatbot processes customer messages**.

**Acceptance Criteria:**

- **Given** chatbot deployed
- **When** customer messages arrive
- **Then** system:
  - Receives webhook from Chatwoot
  - Parses message content
  - Routes to correct chatbot
  - Queues for processing
- **And** webhook secured with verification
- **And** handles high message volume

**Implements:** FR157
**Screens:** 1.9.2
**Research Reference:** T4-CHAT §4

---

#### Story 2.13.3: Query Project RAG for Responses

As a **system**,
I want **chatbot to query project RAG for responses**,
So that **answers are grounded in knowledge base**.

**Acceptance Criteria:**

- **Given** customer asks question
- **When** chatbot processes (1.9.3)
- **Then** system:
  - Searches project Knowledge Base
  - Retrieves relevant documents
  - Includes context in LLM prompt
  - Generates grounded response
- **And** RAG configuration respected
- **And** fallback if no relevant docs

**Implements:** FR158
**Screens:** 1.9.3
**Research Reference:** T4-CHAT §11

---

#### Story 2.13.4: Configure Confidence Thresholds

As a **chatbot builder user**,
I want **to configure confidence thresholds**,
So that **uncertain responses are handled appropriately**.

**Acceptance Criteria:**

- **Given** I configure chatbot (1.9.4)
- **When** I set thresholds
- **Then** I can configure:
  - RAG confidence threshold
  - Intent confidence threshold
  - Action at low confidence (ask clarification, escalate)
- **And** thresholds shown in monitoring
- **And** can tune based on metrics

**Implements:** FR159
**Screens:** 1.9.4
**Research Reference:** T4-CHAT §6

---

#### Story 2.13.5: Context Transfer During Human Handoff

As a **system**,
I want **to transfer context during human handoff**,
So that **agents have full conversation history**.

**Acceptance Criteria:**

- **Given** escalation to human
- **When** handoff occurs (1.9.5)
- **Then** agent receives:
  - Complete conversation transcript
  - Collected slot values
  - Customer sentiment
  - Recommended next steps
  - RAG sources used
- **And** handoff is seamless for customer
- **And** agent can view in Chatwoot

**Implements:** FR160
**Screens:** 1.9.5
**Research Reference:** T4-CHAT §6

---

#### Story 2.13.6: Multi-Channel Support Configuration

As a **chatbot builder user**,
I want **to configure multi-channel support**,
So that **one chatbot serves multiple channels**.

**Acceptance Criteria:**

- **Given** I have a chatbot
- **When** I configure channels (1.9.6)
- **Then** I can enable:
  - Website widget
  - Facebook Messenger
  - WhatsApp
  - SMS
  - Email
- **And** consistent experience across channels
- **And** channel-specific customization available

**Implements:** FR161
**Screens:** 1.9.6
**Research Reference:** T4-CHAT §2

---

#### Story 2.13.7: Display RAG Confidence and Citations

As a **customer**,
I want **to see confidence indicators and citations**,
So that **I can trust the information**.

**Acceptance Criteria:**

- **Given** chatbot provides answer
- **When** displayed to customer (1.9.3)
- **Then** UI shows:
  - Confidence indicator (optional)
  - "Based on..." source references
  - Links to full documents (if allowed)
- **And** low confidence shows disclaimer
- **And** configurable per chatbot

**Implements:** FR162
**Screens:** 1.9.3
**Research Reference:** T4-EMBED §1

---

#### Story 2.13.8: Embed Custom React Chat Widgets

As a **developer**,
I want **to embed custom React chat widgets**,
So that **I have full control over chat UI**.

**Acceptance Criteria:**

- **Given** I want custom chat integration
- **When** I use React SDK (1.9.7)
- **Then** I can:
  - Import @hyyve/chat-widget
  - Customize all UI components
  - Handle events programmatically
  - Style with my own CSS
- **And** TypeScript types provided
- **And** examples in documentation

**Implements:** FR163
**Screens:** 1.9.7
**Research Reference:** T4-EMBED §1-3

---

#### Story 2.13.9: ActionCable WebSocket for Real-Time

As a **system**,
I want **real-time updates via ActionCable WebSocket**,
So that **chat is responsive**.

**Acceptance Criteria:**

- **Given** chat is active
- **When** messages exchanged
- **Then** system:
  - Uses ActionCable (Chatwoot protocol)
  - Delivers messages in real-time
  - Shows typing indicators
  - Handles reconnection
- **And** latency <100ms typically
- **And** fallback to polling if needed

**Implements:** FR164
**Screens:** 1.9.2
**Research Reference:** T4-CHAT §2

---

#### Story 2.13.10: Proactive Outbound Messaging

As a **chatbot builder user**,
I want **to configure proactive outbound messaging**,
So that **chatbots can initiate conversations**.

**Acceptance Criteria:**

- **Given** I configure proactive messaging (1.9.8)
- **When** trigger conditions met
- **Then** chatbot can:
  - Send welcome message on page visit
  - Follow up on abandoned forms
  - Send scheduled check-ins
  - Trigger based on user behavior
- **And** respects user preferences
- **And** throttling prevents spam

**Implements:** FR165
**Screens:** 1.9.8
**Research Reference:** T6-INTEG §6

---

**Epic E2.13 Complete: 10 stories**

---

## Phase 2 Complete: 80 Stories across 13 Epics

---

## PHASE 3: MARKETPLACE

### Epic E3.1: Module Marketplace - Browse & Search

**Research:** B2-MARKET §6-7
**UX Screens:** 3.1.4, 3.1.5
**Implements:** FR169, FR170

---

#### Story 3.1.1: Browse Modules with Search and Filters

As a **user**,
I want **to browse modules with search, categories, and filters**,
So that **I can discover useful modules**.

**Acceptance Criteria:**

- **Given** I am in Module Marketplace (3.1.4)
- **When** I browse
- **Then** I see:
  - Search bar with semantic search
  - Category filters (automation, AI, integrations)
  - Sort options (popular, recent, rating)
  - Grid/list view toggle
- **And** results paginated
- **And** filters combinable

**Implements:** FR169
**Screens:** 3.1.4
**Research Reference:** B2-MARKET §7

---

#### Story 3.1.2: View Ratings, Reviews, Usage Statistics

As a **user**,
I want **to view ratings, reviews, and usage statistics**,
So that **I can evaluate module quality**.

**Acceptance Criteria:**

- **Given** I view a module (3.1.5)
- **When** details load
- **Then** I see:
  - Star rating (1-5)
  - Number of reviews
  - Written reviews with responses
  - Install count
  - Active user count
  - Success rate metrics
- **And** can sort reviews
- **And** can report inappropriate reviews

**Implements:** FR170
**Screens:** 3.1.5
**Research Reference:** B2-MARKET §6

---

**Epic E3.1 Complete: 2 stories**

---

### Epic E3.2: Module Marketplace - Installation

**Research:** B2-MARKET §7-8, T7-CANVAS §10
**UX Screens:** 3.1.6, 3.1.7, 3.1.11
**Implements:** FR171, FR172, FR177

---

#### Story 3.2.1: One-Click Module Installation

As a **user**,
I want **to install modules with one click**,
So that **I can quickly add capabilities**.

**Acceptance Criteria:**

- **Given** I find a module I want
- **When** I click Install (3.1.6)
- **Then**:
  - Module added to my project
  - Dependencies installed automatically
  - Configuration prompt if needed
  - Available in Module Builder
- **And** paid modules use billing flow
- **And** install tracked for analytics

**Implements:** FR171
**Screens:** 3.1.6
**Research Reference:** B2-MARKET §7

---

#### Story 3.2.2: Resolve Module Dependencies

As a **system**,
I want **to resolve module dependencies**,
So that **modules work correctly together**.

**Acceptance Criteria:**

- **Given** module has dependencies
- **When** installing (3.1.7)
- **Then** system:
  - Identifies required dependencies
  - Checks for conflicts
  - Installs missing dependencies
  - Handles version compatibility
- **And** dependency tree shown to user
- **And** conflicts require resolution

**Implements:** FR172
**Screens:** 3.1.7
**Research Reference:** B2-MARKET §8

---

#### Story 3.2.3: Fork and Remix Public Modules

As a **user**,
I want **to fork and remix public modules**,
So that **I can customize existing work**.

**Acceptance Criteria:**

- **Given** a public module
- **When** I fork (3.1.11)
- **Then**:
  - Copy created in my workspace
  - Attribution to original preserved
  - Can modify freely
  - Can publish as derivative
- **And** fork count tracked
- **And** license requirements shown

**Implements:** FR177
**Screens:** 3.1.11
**Research Reference:** T7-CANVAS §10

---

**Epic E3.2 Complete: 3 stories**

---

### Epic E3.3: Module Publishing

**Research:** B2-MARKET §6, §8
**UX Screens:** 3.1.1, 3.1.3
**Implements:** FR166, FR168

---

#### Story 3.3.1: Publish Modules with Versioning

As a **creator**,
I want **to publish modules with semantic versioning**,
So that **users can manage updates**.

**Acceptance Criteria:**

- **Given** I have a module to publish
- **When** I publish (3.1.1)
- **Then** I can:
  - Set version number (semver)
  - Write release notes
  - Mark breaking changes
  - Set minimum platform version
- **And** previous versions available
- **And** users notified of updates

**Implements:** FR166
**Screens:** 3.1.1
**Research Reference:** B2-MARKET §8

---

#### Story 3.3.2: Review and Sandbox Test Before Publishing

As a **system**,
I want **to review and sandbox-test modules before publishing**,
So that **marketplace quality is maintained**.

**Acceptance Criteria:**

- **Given** module submitted for publishing
- **When** review process runs (3.1.3)
- **Then** system:
  - Runs automated security scan
  - Executes in sandbox environment
  - Checks for malicious patterns
  - Validates metadata completeness
- **And** review status shown to creator
- **And** rejection includes feedback

**Implements:** FR168
**Screens:** 3.1.3
**Research Reference:** B2-MARKET §6
**NFRs:** NFR-SEC-11

---

**Epic E3.3 Complete: 2 stories**

---

### Epic E3.4: Module Pricing & Revenue

**Research:** B2-MARKET §2-4, §6, §8
**UX Screens:** 3.1.2, 3.1.8, 3.1.10
**Implements:** FR167, FR173, FR175, FR176

---

#### Story 3.4.1: Set Module Pricing (Free, One-Time, Subscription)

As a **creator**,
I want **to set pricing for my modules**,
So that **I can monetize my work**.

**Acceptance Criteria:**

- **Given** I am publishing a module
- **When** I set pricing (3.1.2)
- **Then** I can choose:
  - Free
  - One-time purchase
  - Monthly subscription
  - Yearly subscription
  - Per-execution pricing
- **And** currency in USD
- **And** pricing displayed to buyers

**Implements:** FR167
**Screens:** 3.1.2
**Research Reference:** B2-MARKET §3

---

#### Story 3.4.2: Creator Revenue Split (85%)

As a **creator**,
I want **to receive 85% of sales revenue**,
So that **I am fairly compensated**.

**Acceptance Criteria:**

- **Given** my module is purchased
- **When** payment processed (3.1.8)
- **Then**:
  - I receive 85% of sale
  - Platform retains 15%
  - Payouts processed monthly
  - Minimum payout threshold $50
- **And** earnings dashboard shows details
- **And** tax documents generated

**Implements:** FR173
**Screens:** 3.1.8
**Research Reference:** B2-MARKET §2

---

#### Story 3.4.3: 24-Hour Auto-Refund for Crashes

As a **buyer**,
I want **automatic refund if module crashes within 24 hours**,
So that **I'm protected from faulty modules**.

**Acceptance Criteria:**

- **Given** I purchased a module
- **When** it crashes within 24 hours (3.1.10)
- **Then**:
  - Automatic refund triggered
  - Creator notified
  - Crash logged for review
  - Refund credited immediately
- **And** repeated crashes flag module
- **And** can opt-out of auto-refund

**Implements:** FR175
**Screens:** 3.1.10
**Research Reference:** B2-MARKET §6

---

#### Story 3.4.4: 7-Day Payment Escrow

As a **system**,
I want **7-day escrow for marketplace payments**,
So that **buyers are protected**.

**Acceptance Criteria:**

- **Given** purchase is made
- **When** payment processed
- **Then**:
  - Funds held in escrow 7 days
  - Released to creator after period
  - Refunds deducted from escrow
  - Creator sees pending balance
- **And** escrow protects against fraud
- **And** dispute resolution available

**Implements:** FR176
**Screens:** 3.1.8
**Research Reference:** B2-MARKET §4

---

**Epic E3.4 Complete: 4 stories**

---

### Epic E3.5: Creator Analytics

**Research:** B2-MARKET §6, §8
**UX Screens:** 3.1.9, 3.1.12
**Implements:** FR174, FR178

---

#### Story 3.5.1: View Earnings and Analytics

As a **creator**,
I want **to view earnings and analytics**,
So that **I can track my marketplace performance**.

**Acceptance Criteria:**

- **Given** I have published modules
- **When** I view analytics (3.1.9)
- **Then** I see:
  - Total earnings (all-time, this month)
  - Sales by module
  - Install trends
  - Rating trends
  - Geographic distribution
- **And** can export data
- **And** comparison periods available

**Implements:** FR174
**Screens:** 3.1.9
**Research Reference:** B2-MARKET §6

---

#### Story 3.5.2: Create Module Bundles

As a **creator**,
I want **to create module bundles**,
So that **I can offer discounted packages**.

**Acceptance Criteria:**

- **Given** I have multiple modules
- **When** I create bundle (3.1.12)
- **Then** I can:
  - Select modules to include
  - Set bundle price (discount from individual)
  - Add bundle description
  - Set bundle availability
- **And** buyers get all modules
- **And** bundle updates include new versions

**Implements:** FR178
**Screens:** 3.1.12
**Research Reference:** B2-MARKET §8

---

**Epic E3.5 Complete: 2 stories**

---

### Epic E3.6: MCP Server Publishing

**Research:** T5-MCP §7.1, B2-MARKET §8
**UX Screens:** 3.3.1, 3.3.2
**Implements:** FR111, FR112

---

#### Story 3.6.1: Publish Custom MCP Servers

As a **creator**,
I want **to publish custom MCP servers**,
So that **others can use my tools**.

**Acceptance Criteria:**

- **Given** I have an MCP server
- **When** I publish (3.3.1)
- **Then** I can:
  - Upload server package
  - Define tools and resources
  - Write documentation
  - Set up configuration schema
- **And** server reviewed for security
- **And** versioning supported

**Implements:** FR111
**Screens:** 3.3.1
**Research Reference:** T5-MCP §7.1

---

#### Story 3.6.2: Set Pricing for MCP Servers

As a **creator**,
I want **to set pricing for MCP servers**,
So that **I can monetize my tools**.

**Acceptance Criteria:**

- **Given** I am publishing MCP server
- **When** I set pricing (3.3.2)
- **Then** I can choose:
  - Free
  - One-time purchase
  - Subscription
  - Per-call pricing
- **And** same revenue split as modules (85%)
- **And** usage metering for per-call

**Implements:** FR112
**Screens:** 3.3.2
**Research Reference:** B2-MARKET §8

---

**Epic E3.6 Complete: 2 stories**

---

### Epic E3.7: Billing - Subscription Plans

**Research:** T3-BILL §1, §1.4, B3-PRICE §4
**UX Screens:** 1.10.4, 1.10.7, 1.10.8, 1.10.1
**Implements:** FR190, FR194, FR195, FR196

---

#### Story 3.7.1: Tiered Subscription Plans

As a **user**,
I want **tiered subscription plans**,
So that **I can choose based on my needs**.

**Acceptance Criteria:**

- **Given** I am selecting a plan (1.10.4)
- **When** I view options
- **Then** I see:
  - Free tier (limited features)
  - Starter ($29/mo)
  - Pro ($99/mo)
  - Enterprise (custom)
- **And** feature comparison shown
- **And** annual discount available (20%)

**Implements:** FR190
**Screens:** 1.10.4
**Research Reference:** B3-PRICE §4

---

#### Story 3.7.2: Self-Serve Billing Portal

As a **user**,
I want **a self-serve billing portal**,
So that **I can manage my subscription**.

**Acceptance Criteria:**

- **Given** I have a subscription
- **When** I access billing portal (1.10.7)
- **Then** I can:
  - Update payment method
  - Change plan
  - View invoices
  - Download receipts
  - Cancel subscription
- **And** Stripe Customer Portal used
- **And** changes effective immediately

**Implements:** FR194
**Screens:** 1.10.7
**Research Reference:** T3-BILL §1

---

#### Story 3.7.3: Usage-Based Invoices

As a **user**,
I want **usage-based invoices**,
So that **I understand my charges**.

**Acceptance Criteria:**

- **Given** billing period ends
- **When** invoice generated (1.10.8)
- **Then** I see:
  - Base subscription fee
  - Overage charges (if any)
  - Marketplace purchases
  - Line-item breakdown
  - Tax calculations
- **And** invoice downloadable as PDF
- **And** email notification sent

**Implements:** FR195
**Screens:** 1.10.8
**Research Reference:** T3-BILL §1

---

#### Story 3.7.4: Stripe Billing Meters Integration

As a **system**,
I want **Stripe Billing Meters for usage tracking**,
So that **usage-based billing is accurate**.

**Acceptance Criteria:**

- **Given** usage events occur
- **When** metered (1.10.1)
- **Then** system:
  - Sends events to Stripe Billing Meters
  - Tracks by meter type (API, tokens, etc.)
  - Aggregates per billing period
  - Handles high event volume
- **And** real-time meter values available
- **And** reconciliation runs daily

**Implements:** FR196
**Screens:** 1.10.1
**Research Reference:** T3-BILL §1.4

---

**Epic E3.7 Complete: 4 stories**

---

### Epic E3.8: Billing - Usage Management

**Research:** T3-BILL §6, §10
**UX Screens:** 1.10.5, 1.10.6
**Implements:** FR191, FR192, FR193

---

#### Story 3.8.1: Soft Warnings and Hard Caps

As a **user**,
I want **soft warnings and hard caps on usage**,
So that **I don't get unexpected bills**.

**Acceptance Criteria:**

- **Given** I have a subscription
- **When** usage approaches limits (1.10.5)
- **Then**:
  - 80% warning notification
  - 100% warning notification
  - 150% hard cap option
- **And** can configure action at each threshold
- **And** notification channels customizable

**Implements:** FR191
**Screens:** 1.10.5
**Research Reference:** T3-BILL §6

---

#### Story 3.8.2: Configure Hard Cap vs. Overage

As a **user**,
I want **to choose hard cap or overage billing**,
So that **I control cost vs. availability**.

**Acceptance Criteria:**

- **Given** I configure billing settings (1.10.5)
- **When** I set cap behavior
- **Then** I can choose:
  - Hard cap: Stop at limit
  - Soft cap: Allow overage, bill extra
  - Warning only: No enforcement
- **And** overage rates shown clearly
- **And** can change at any time

**Implements:** FR192
**Screens:** 1.10.5
**Research Reference:** T3-BILL §6

---

#### Story 3.8.3: View Usage Forecasts

As a **user**,
I want **to view usage forecasts**,
So that **I can predict costs**.

**Acceptance Criteria:**

- **Given** I have usage history
- **When** I view forecasts (1.10.6)
- **Then** I see:
  - Projected month-end usage
  - Projected month-end cost
  - Trend compared to last month
  - Alert if exceeding budget
- **And** forecast updates daily
- **And** can adjust assumptions

**Implements:** FR193
**Screens:** 1.10.6
**Research Reference:** T3-BILL §10

---

**Epic E3.8 Complete: 3 stories**

---

### Epic E3.9: Platform Command Center

**Research:** T4-CMD §1-2, T4-OBS §6, §9, T4-SEC §3, §8
**UX Screens:** 4.1.1, 4.1.2, 4.1.3, 4.1.4, 4.1.5
**Implements:** FR144, FR145, FR146, FR147, FR148

---

#### Story 3.9.1: Command Center Dashboard

As a **platform admin**,
I want **a Command Center dashboard**,
So that **I can monitor platform health**.

**Acceptance Criteria:**

- **Given** I am a platform admin
- **When** I access Command Center (4.1.1)
- **Then** I see:
  - Active users/sessions
  - Execution volume
  - Error rates
  - Revenue metrics
  - System health indicators
- **And** real-time updates
- **And** customizable widgets

**Implements:** FR144
**Screens:** 4.1.1
**Research Reference:** T4-CMD §1-2

---

#### Story 3.9.2: Per-Tenant Consumption View

As a **platform admin**,
I want **to view per-tenant consumption**,
So that **I can identify heavy users**.

**Acceptance Criteria:**

- **Given** I am in Command Center
- **When** I view tenant metrics (4.1.2)
- **Then** I see:
  - Usage by workspace
  - Cost by workspace
  - Execution counts
  - Storage usage
  - Top consumers
- **And** can drill down per tenant
- **And** export reports

**Implements:** FR145
**Screens:** 4.1.2
**Research Reference:** T4-OBS §9

---

#### Story 3.9.3: Dynamic Rate Limiting

As a **platform admin**,
I want **to apply dynamic rate limiting**,
So that **I can protect platform resources**.

**Acceptance Criteria:**

- **Given** I identify abuse
- **When** I apply rate limits (4.1.3)
- **Then** I can:
  - Set limits per tenant
  - Set limits per endpoint
  - Apply temporary restrictions
  - Configure automatic throttling rules
- **And** limits enforced immediately
- **And** tenants notified

**Implements:** FR146
**Screens:** 4.1.3
**Research Reference:** T4-SEC §3

---

#### Story 3.9.4: Prometheus-Compatible Metrics

As a **system**,
I want **to expose Prometheus-compatible metrics**,
So that **standard monitoring tools work**.

**Acceptance Criteria:**

- **Given** platform is running
- **When** metrics scraped (4.1.4)
- **Then** system exposes:
  - /metrics endpoint
  - Standard Prometheus format
  - All key platform metrics
  - Custom application metrics
- **And** Grafana dashboards provided
- **And** alerting rules included

**Implements:** FR147
**Screens:** 4.1.4
**Research Reference:** T4-OBS §6

---

#### Story 3.9.5: Immutable Audit Logs (pgaudit)

As a **platform admin**,
I want **immutable audit logs**,
So that **I have security compliance evidence**.

**Acceptance Criteria:**

- **Given** actions occur on platform
- **When** logged (4.1.5)
- **Then** system:
  - Records all administrative actions
  - Records all data access
  - Uses pgaudit for database
  - Logs are append-only
- **And** logs retained per policy
- **And** searchable audit UI

**Implements:** FR148
**Screens:** 4.1.5
**Research Reference:** T4-SEC §8
**NFRs:** NFR-SEC-12

---

**Epic E3.9 Complete: 5 stories**

---

## Phase 3 Complete: 27 Stories across 9 Epics

---

## PHASE 4: ENTERPRISE

### Epic E4.1: Security Guardrails

**Research:** T4-SEC §2, T0-RAG
**UX Screens:** 4.3.4, 4.3.5, 1.4.8
**Implements:** FR217, FR218, FR219, FR220

---

#### Story 4.1.1: NeMo Guardrails for Prompt Injection

As a **system**,
I want **NeMo Guardrails for prompt injection protection**,
So that **AI agents are protected from manipulation**.

**Acceptance Criteria:**

- **Given** user input is received
- **When** processed (4.3.4)
- **Then** system:
  - Scans for injection patterns
  - Applies NeMo Guardrails checks
  - Blocks malicious prompts
  - Logs attempts
- **And** configurable sensitivity
- **And** false positive handling

**Implements:** FR217
**Screens:** 4.3.4
**Research Reference:** T4-SEC §2

---

#### Story 4.1.2: Input Sanitization and Output Filtering

As a **system**,
I want **input sanitization and output filtering**,
So that **harmful content is blocked**.

**Acceptance Criteria:**

- **Given** data flows through agents
- **When** processed
- **Then** system:
  - Sanitizes user inputs
  - Filters AI outputs
  - Removes sensitive patterns (PII, secrets)
  - Validates against schemas
- **And** configurable filter rules
- **And** violations logged

**Implements:** FR218
**Screens:** 4.3.4
**Research Reference:** T4-SEC §2

---

#### Story 4.1.3: Content Moderation (No NSFW)

As a **system**,
I want **content moderation to block NSFW content**,
So that **platform remains professional**.

**Acceptance Criteria:**

- **Given** content is generated
- **When** checked (4.3.5)
- **Then** system:
  - Runs content through moderation
  - Blocks NSFW/harmful content
  - Flags for review if uncertain
  - Provides reason for blocks
- **And** moderation configurable
- **And** appeals process available

**Implements:** FR219
**Screens:** 4.3.5
**Research Reference:** T4-SEC §2

---

#### Story 4.1.4: AI Hallucination Mitigation via RAG

As a **system**,
I want **AI hallucination mitigation via RAG**,
So that **responses are grounded in facts**.

**Acceptance Criteria:**

- **Given** AI generates response
- **When** RAG is available (1.4.8)
- **Then** system:
  - Grounds responses in KB content
  - Shows confidence scores
  - Flags uncertain responses
  - Requires citations for factual claims
- **And** hallucination rate tracked
- **And** configurable strictness

**Implements:** FR220
**Screens:** 1.4.8
**Research Reference:** T0-RAG
**NFRs:** NFR-SEC-04

---

**Epic E4.1 Complete: 4 stories**

---

### Epic E4.2: Enterprise Security Hardening

**Research:** T4-SEC §1, §3, §6
**UX Screens:** 4.3.6, 4.3.7, 1.5.7
**Implements:** FR221, FR222, FR223, FR224

---

#### Story 4.2.1: Firecracker MicroVM for All User Code

As a **system**,
I want **all user code to execute in Firecracker MicroVMs**,
So that **untrusted code is fully isolated**.

**Acceptance Criteria:**

- **Given** user code needs execution
- **When** triggered (4.3.6)
- **Then** system:
  - Always uses Firecracker MicroVM
  - No code runs on host
  - Resource limits strictly enforced
  - Network isolated by default
- **And** applies to all execution paths
- **And** audit trail for executions

**Implements:** FR221
**Screens:** 4.3.6
**Research Reference:** T4-SEC §1
**NFRs:** NFR-SEC-01, NFR-SEC-10

---

#### Story 4.2.2: API Gateway Rate Limiting

As a **system**,
I want **rate limiting at API gateway**,
So that **abuse is prevented**.

**Acceptance Criteria:**

- **Given** API requests arrive
- **When** processed (4.3.7)
- **Then** system:
  - Applies rate limits per API key
  - Applies rate limits per IP
  - Returns 429 with Retry-After
  - Configurable per tier
- **And** rate limits at edge
- **And** monitoring for abuse patterns

**Implements:** FR222
**Screens:** 4.3.7
**Research Reference:** T4-SEC §3

---

#### Story 4.2.3: DDoS Protection via WAF

As a **system**,
I want **DDoS protection via WAF**,
So that **platform remains available**.

**Acceptance Criteria:**

- **Given** traffic flows to platform
- **When** filtered
- **Then** system:
  - WAF rules block known attack patterns
  - DDoS mitigation at edge
  - Geo-blocking available
  - Bot detection enabled
- **And** legitimate traffic unaffected
- **And** attack alerts generated

**Implements:** FR223
**Screens:** 4.3.7
**Research Reference:** T4-SEC §3
**NFRs:** NFR-SEC-14

---

#### Story 4.2.4: Voice Agent Action Restrictions

As a **system**,
I want **voice agents limited to pre-approved actions**,
So that **voice AI cannot perform dangerous operations**.

**Acceptance Criteria:**

- **Given** voice agent executes
- **When** actions taken (1.5.7)
- **Then** system:
  - Only allows approved tool calls
  - Blocks destructive operations by default
  - Requires HITL for sensitive actions
  - Logs all voice agent actions
- **And** action whitelist configurable
- **And** violations alerted

**Implements:** FR224
**Screens:** 1.5.7
**Research Reference:** T4-SEC §6

---

**Epic E4.2 Complete: 4 stories**

---

### Epic E4.3: SOC 2 & Compliance

**Research:** T4-SEC §8
**UX Screens:** 4.3.1, 4.3.2, 4.3.3
**Implements:** FR214, FR215, FR216

---

#### Story 4.3.1: SOC 2 Type II Documentation

As a **enterprise customer**,
I want **SOC 2 Type II documentation**,
So that **I can meet compliance requirements**.

**Acceptance Criteria:**

- **Given** compliance documentation needed
- **When** requested (4.3.1)
- **Then** I can access:
  - SOC 2 Type II report
  - Security policies
  - Data handling procedures
  - Penetration test summaries
- **And** documentation updated annually
- **And** NDA for sensitive docs

**Implements:** FR214
**Screens:** 4.3.1
**Research Reference:** T4-SEC §8
**NFRs:** NFR-COMP-01

---

#### Story 4.3.2: GDPR Data Subject Requests

As an **EU user**,
I want **to exercise GDPR data subject rights**,
So that **I control my data**.

**Acceptance Criteria:**

- **Given** I am EU data subject
- **When** I submit request (4.3.2)
- **Then** I can:
  - Request data export (Right of Access)
  - Request data deletion (Right to Erasure)
  - Request data correction
  - Object to processing
- **And** requests fulfilled within 30 days
- **And** verification required

**Implements:** FR215
**Screens:** 4.3.2
**Research Reference:** T4-SEC §8
**NFRs:** NFR-COMP-02, NFR-COMP-03

---

#### Story 4.3.3: Data Residency Requirements

As an **enterprise customer**,
I want **to configure data residency**,
So that **data stays in required regions**.

**Acceptance Criteria:**

- **Given** I have regulatory requirements
- **When** I configure residency (4.3.3)
- **Then** I can:
  - Select data region (US, EU, APAC)
  - Ensure data stays in region
  - Get compliance attestation
  - Configure backup regions
- **And** cross-region transfers blocked
- **And** residency auditable

**Implements:** FR216
**Screens:** 4.3.3
**Research Reference:** T4-SEC §8
**NFRs:** NFR-COMP-04

---

**Epic E4.3 Complete: 3 stories**

---

### Epic E4.4: White-Label - Sub-Accounts

**Research:** T8-UI §1, T5-WHITE §4-5, T3-BILL §7
**UX Screens:** 4.2.1, 4.2.2, 4.2.3, 4.2.4
**Implements:** FR206, FR207, FR208, FR209

---

#### Story 4.4.1: Create Client Sub-Accounts

As an **agency user**,
I want **to create sub-accounts for my clients**,
So that **I can manage multiple clients**.

**Acceptance Criteria:**

- **Given** I am an agency account
- **When** I create sub-account (4.2.1)
- **Then** I can:
  - Create client workspace
  - Set client-specific limits
  - Assign projects to client
  - Configure client permissions
- **And** sub-accounts isolated
- **And** agency retains oversight

**Implements:** FR206
**Screens:** 4.2.1
**Research Reference:** T8-UI §1

---

#### Story 4.4.2: Per-Client Usage Breakdown

As an **agency user**,
I want **per-client usage breakdown**,
So that **I can bill clients accurately**.

**Acceptance Criteria:**

- **Given** I have sub-accounts
- **When** I view usage (4.2.2)
- **Then** I see:
  - Usage by client
  - Cost by client
  - Breakdown by resource type
  - Historical trends
- **And** can export for invoicing
- **And** allocation configurable

**Implements:** FR207
**Screens:** 4.2.2
**Research Reference:** T5-WHITE §5

---

#### Story 4.4.3: Configure Markup Margins

As an **agency user**,
I want **to configure markup margins**,
So that **I can profit from reselling**.

**Acceptance Criteria:**

- **Given** I bill clients
- **When** I set markup (4.2.3)
- **Then** I can:
  - Set % markup on platform costs
  - Set per-client markups
  - Configure different rates per service
  - Preview client invoice
- **And** markup applied automatically
- **And** agency invoice shows actual costs

**Implements:** FR208
**Screens:** 4.2.3
**Research Reference:** T3-BILL §7

---

#### Story 4.4.4: White-Label Invoices

As an **agency user**,
I want **white-label invoices for clients**,
So that **clients see my brand**.

**Acceptance Criteria:**

- **Given** I bill clients
- **When** invoice generated (4.2.4)
- **Then** invoice shows:
  - My company branding
  - My company details
  - No Hyyve branding
  - Custom terms and notes
- **And** PDF and email templates
- **And** automated invoice delivery

**Implements:** FR209
**Screens:** 4.2.4
**Research Reference:** T5-WHITE §4

---

**Epic E4.4 Complete: 4 stories**

---

### Epic E4.5: White-Label - Branding

**Research:** T5-WHITE §2-4, T5-SSO
**UX Screens:** 4.2.5, 4.2.6, 4.2.7, 4.2.8
**Implements:** FR210, FR211, FR212, FR213

---

#### Story 4.5.1: Custom Domains

As a **white-label user**,
I want **custom domains**,
So that **users see my URL**.

**Acceptance Criteria:**

- **Given** I configure white-label
- **When** I set domain (4.2.5)
- **Then** I can:
  - Configure custom domain
  - Automatic SSL provisioning
  - DNS verification
  - Multiple domains supported
- **And** platform redirects appropriately
- **And** old URLs redirect

**Implements:** FR210
**Screens:** 4.2.5
**Research Reference:** T5-WHITE §3

---

#### Story 4.5.2: Customize Branding (Logo, Colors, Fonts)

As a **white-label user**,
I want **to customize branding**,
So that **platform matches my brand**.

**Acceptance Criteria:**

- **Given** I configure white-label
- **When** I set branding (4.2.6)
- **Then** I can:
  - Upload logo
  - Set color scheme
  - Choose fonts
  - Configure favicon
  - Preview changes
- **And** branding applies globally
- **And** CSS variables used

**Implements:** FR211
**Screens:** 4.2.6
**Research Reference:** T5-WHITE §2

---

#### Story 4.5.3: Custom Email Domains

As a **white-label user**,
I want **custom email domains**,
So that **notifications come from my domain**.

**Acceptance Criteria:**

- **Given** I configure white-label
- **When** I set email domain (4.2.7)
- **Then** I can:
  - Configure sending domain
  - Set up SPF/DKIM/DMARC
  - Customize email templates
  - Set reply-to addresses
- **And** email deliverability verified
- **And** fallback if misconfigured

**Implements:** FR212
**Screens:** 4.2.7
**Research Reference:** T5-WHITE §4

---

#### Story 4.5.4: White-Label SSO Support

As a **white-label user**,
I want **custom SSO for my white-label**,
So that **my clients use my IdP**.

**Acceptance Criteria:**

- **Given** I have white-label domain
- **When** I configure SSO (4.2.8)
- **Then** I can:
  - Connect my SAML/OIDC IdP
  - Map attributes
  - Configure for my domain only
  - Test SSO flow
- **And** separate from platform SSO
- **And** works with custom domain

**Implements:** FR213
**Screens:** 4.2.8
**Research Reference:** T5-SSO
**NFRs:** NFR-ACC-02

---

**Epic E4.5 Complete: 4 stories**

---

### Epic E4.6: Self-Hosted - Docker Deployment

**Research:** T5-DEPLOY §1-2
**UX Screens:** 4.4.1, 4.4.3
**Implements:** FR225, FR227, FR228

---

#### Story 4.6.1: Docker Compose Deployment

As a **self-hosted user**,
I want **to deploy via Docker Compose**,
So that **I can run on my infrastructure**.

**Acceptance Criteria:**

- **Given** I want self-hosted
- **When** I deploy (4.4.1)
- **Then** I can:
  - Clone repository
  - Run docker-compose up
  - Access platform locally
  - Configure via env vars
- **And** single-node deployment works
- **And** documentation provided

**Implements:** FR225
**Screens:** 4.4.1
**Research Reference:** T5-DEPLOY §1
**NFRs:** NFR-MAINT-04

---

#### Story 4.6.2: Configure External PostgreSQL

As a **self-hosted user**,
I want **to use external PostgreSQL**,
So that **I can use managed databases**.

**Acceptance Criteria:**

- **Given** I self-host
- **When** I configure database (4.4.3)
- **Then** I can:
  - Point to external PostgreSQL
  - Configure connection string
  - Run migrations automatically
  - Verify connection
- **And** works with RDS, Cloud SQL, etc.
- **And** schema created automatically

**Implements:** FR227
**Screens:** 4.4.3
**Research Reference:** T5-DEPLOY §1-2

---

#### Story 4.6.3: Configure External Redis

As a **self-hosted user**,
I want **to use external Redis**,
So that **I can use managed caching**.

**Acceptance Criteria:**

- **Given** I self-host
- **When** I configure Redis (4.4.3)
- **Then** I can:
  - Point to external Redis
  - Configure connection
  - Support Redis Cluster
  - Verify connection
- **And** works with ElastiCache, etc.
- **And** TLS supported

**Implements:** FR228
**Screens:** 4.4.3
**Research Reference:** T5-DEPLOY §1-2
**NFRs:** NFR-MAINT-05

---

**Epic E4.6 Complete: 3 stories**

---

### Epic E4.7: Self-Hosted - Kubernetes

**Research:** T5-DEPLOY §2-3, §8, T5-SSO
**UX Screens:** 4.4.2, 4.4.4, 4.4.5, 4.4.6, 4.4.7
**Implements:** FR226, FR229, FR230, FR231, FR232

---

#### Story 4.7.1: Helm Chart Deployment

As a **self-hosted user**,
I want **to deploy via Helm charts**,
So that **I can run on Kubernetes**.

**Acceptance Criteria:**

- **Given** I have K8s cluster
- **When** I deploy (4.4.2)
- **Then** I can:
  - helm install hyyve
  - Configure via values.yaml
  - Scale replicas
  - Use ingress
- **And** production-ready defaults
- **And** upgrade path documented

**Implements:** FR226
**Screens:** 4.4.2
**Research Reference:** T5-DEPLOY §2

---

#### Story 4.7.2: Custom LLM Endpoints (BYOM)

As a **self-hosted user**,
I want **to configure custom LLM endpoints**,
So that **I can bring my own model**.

**Acceptance Criteria:**

- **Given** I self-host
- **When** I configure LLM (4.4.4)
- **Then** I can:
  - Point to OpenAI-compatible endpoint
  - Use vLLM, Ollama, etc.
  - Configure multiple providers
  - Set default per workspace
- **And** authentication supported
- **And** model mapping configurable

**Implements:** FR229
**Screens:** 4.4.4
**Research Reference:** T5-DEPLOY §8

---

#### Story 4.7.3: Air-Gapped Installation

As a **self-hosted user**,
I want **air-gapped installation**,
So that **I can run without internet**.

**Acceptance Criteria:**

- **Given** no internet access
- **When** I deploy (4.4.5)
- **Then** I can:
  - Use offline container images
  - Bundle all dependencies
  - Configure local registries
  - Skip telemetry
- **And** license validation offline
- **And** update packages manually

**Implements:** FR230
**Screens:** 4.4.5
**Research Reference:** T5-DEPLOY §3
**NFRs:** NFR-COMP-05

---

#### Story 4.7.4: Internal SSO Providers

As a **self-hosted user**,
I want **to use internal SSO providers**,
So that **authentication uses my IdP**.

**Acceptance Criteria:**

- **Given** I self-host
- **When** I configure auth (4.4.6)
- **Then** I can:
  - Connect internal SAML IdP
  - Connect internal OIDC provider
  - No external auth required
  - Map user attributes
- **And** works air-gapped
- **And** local user fallback

**Implements:** FR231
**Screens:** 4.4.6
**Research Reference:** T5-SSO

---

#### Story 4.7.5: Velero for Backup/DR

As a **self-hosted user**,
I want **backup/DR via Velero**,
So that **I can recover from disasters**.

**Acceptance Criteria:**

- **Given** I run on K8s
- **When** I configure backup (4.4.7)
- **Then** I can:
  - Use Velero for cluster backup
  - Schedule regular backups
  - Backup to S3/GCS/Azure
  - Restore to different cluster
- **And** database included
- **And** tested restore procedure

**Implements:** FR232
**Screens:** 4.4.7
**Research Reference:** T5-DEPLOY §8
**NFRs:** NFR-REL-02, NFR-REL-03, NFR-REL-04, NFR-REL-05

---

**Epic E4.7 Complete: 5 stories**

---

## Phase 4 Complete: 27 Stories across 7 Epics

---

## PHASE 5: COLLABORATION

### Epic E5.1: Real-Time Collaboration

**Research:** T4-COLLAB §2, §5
**UX Screens:** 5.1.1, 5.1.2
**Implements:** FR197, FR198

---

#### Story 5.1.1: Multi-User Simultaneous Editing (Yjs CRDT)

As a **team member**,
I want **multiple users to edit simultaneously**,
So that **we can collaborate in real-time**.

**Acceptance Criteria:**

- **Given** multiple users open same workflow
- **When** editing simultaneously (5.1.1)
- **Then**:
  - All changes sync in real-time
  - Yjs CRDT handles conflicts
  - No data loss on concurrent edits
  - Offline changes merge on reconnect
- **And** latency <100ms typical
- **And** works across all builders

**Implements:** FR197
**Screens:** 5.1.1
**Research Reference:** T4-COLLAB §2
**NFRs:** NFR-PERF-12

---

#### Story 5.1.2: Collaborator Cursors and Presence

As a **team member**,
I want **to see collaborator cursors and presence**,
So that **I know who's working where**.

**Acceptance Criteria:**

- **Given** multiple collaborators
- **When** editing (5.1.2)
- **Then** I see:
  - Collaborator cursors with names
  - Different colors per user
  - Selection highlights
  - Presence indicators (who's online)
- **And** cursors update in real-time
- **And** can hide cursors if desired

**Implements:** FR198
**Screens:** 5.1.2
**Research Reference:** T4-COLLAB §5

---

**Epic E5.1 Complete: 2 stories**

---

### Epic E5.2: Comments & Discussion

**Research:** T4-COLLAB §4
**UX Screens:** 5.1.3
**Implements:** FR202

---

#### Story 5.2.1: Add Comments for Discussion

As a **team member**,
I want **to add comments for discussion**,
So that **we can communicate about specific elements**.

**Acceptance Criteria:**

- **Given** I select a node or area
- **When** I add comment (5.1.3)
- **Then** I can:
  - Write comment text
  - Mention team members
  - Attach to specific element
  - Start threaded replies
- **And** comments visible to all
- **And** notifications sent to mentioned

**Implements:** FR202
**Screens:** 5.1.3
**Research Reference:** T4-COLLAB §4

---

**Epic E5.2 Complete: 1 story**

---

### Epic E5.3: Version History & Rollback

**Research:** T4-VER §2
**UX Screens:** 5.2.1, 5.2.3
**Implements:** FR199, FR201

---

#### Story 5.3.1: Workflow Version History

As a **module user**,
I want **to maintain workflow version history**,
So that **I can track changes over time**.

**Acceptance Criteria:**

- **Given** I make changes to workflow
- **When** saving
- **Then** system:
  - Creates new version automatically
  - Stores complete workflow state
  - Records author and timestamp
  - Keeps configurable version count
- **And** versions listed in UI (5.2.1)
- **And** can name important versions

**Implements:** FR199
**Screens:** 5.2.1
**Research Reference:** T4-VER §2
**NFRs:** NFR-MAINT-07

---

#### Story 5.3.2: Rollback to Previous Version

As a **module user**,
I want **to rollback to any previous version**,
So that **I can recover from mistakes**.

**Acceptance Criteria:**

- **Given** I have version history
- **When** I rollback (5.2.3)
- **Then** I can:
  - Select any previous version
  - Preview before rollback
  - Rollback creates new version
  - Original versions preserved
- **And** rollback is instant
- **And** can rollback in production

**Implements:** FR201
**Screens:** 5.2.3
**Research Reference:** T4-VER §2

---

**Epic E5.3 Complete: 2 stories**

---

### Epic E5.4: Visual Diffs

**Research:** T4-VER §3
**UX Screens:** 5.2.2
**Implements:** FR200

---

#### Story 5.4.1: Visual Diffs Between Versions

As a **module user**,
I want **visual diffs between versions**,
So that **I can see what changed**.

**Acceptance Criteria:**

- **Given** I compare versions
- **When** diff shown (5.2.2)
- **Then** I see:
  - Added nodes (green)
  - Removed nodes (red)
  - Modified nodes (yellow)
  - Connection changes
- **And** uses jsondiffpatch
- **And** side-by-side view available

**Implements:** FR200
**Screens:** 5.2.2
**Research Reference:** T4-VER §3

---

**Epic E5.4 Complete: 1 story**

---

### Epic E5.5: A/B Testing

**Research:** T4-VER §4
**UX Screens:** 5.2.4
**Implements:** FR203

---

#### Story 5.5.1: A/B Testing for Workflows (Bayesian)

As a **module user**,
I want **to configure A/B testing**,
So that **I can optimize workflow performance**.

**Acceptance Criteria:**

- **Given** I have workflow variants
- **When** I configure A/B test (5.2.4)
- **Then** I can:
  - Select variants to test
  - Set traffic allocation
  - Define success metrics
  - Set statistical significance
- **And** Bayesian analysis determines winner
- **And** auto-promote winner option

**Implements:** FR203
**Screens:** 5.2.4
**Research Reference:** T4-VER §4

---

**Epic E5.5 Complete: 1 story**

---

### Epic E5.6: Promotion Pipelines & Feature Flags

**Research:** T4-VER §6
**UX Screens:** 5.2.5, 5.2.6
**Implements:** FR204, FR205

---

#### Story 5.6.1: Promotion Pipelines

As a **module user**,
I want **to set up promotion pipelines**,
So that **changes flow through environments**.

**Acceptance Criteria:**

- **Given** I have environments (dev, staging, prod)
- **When** I configure pipeline (5.2.5)
- **Then** I can:
  - Define promotion stages
  - Require approvals
  - Run tests at each stage
  - Automatic vs. manual promotion
- **And** rollback at any stage
- **And** audit trail for promotions

**Implements:** FR204
**Screens:** 5.2.5
**Research Reference:** T4-VER §6
**NFRs:** NFR-MAINT-08

---

#### Story 5.6.2: Feature Flags (LaunchDarkly)

As a **module user**,
I want **feature flags for gradual rollouts**,
So that **I can control feature exposure**.

**Acceptance Criteria:**

- **Given** I deploy changes
- **When** I use feature flags (5.2.6)
- **Then** I can:
  - Create feature flags
  - Target by user segment
  - Percentage rollouts
  - Kill switch for instant disable
- **And** LaunchDarkly integration
- **And** flags in workflow conditions

**Implements:** FR205
**Screens:** 5.2.6
**Research Reference:** T4-VER §6

---

**Epic E5.6 Complete: 2 stories**

---

## Phase 5 Complete: 9 Stories across 6 Epics

---

## PHASE 6: FUTURE

### Epic E6.1: SDK Export - Claude Agent SDK

**Research:** T1-FRAME §5-6
**UX Screens:** 2.3.1
**Implements:** FR233

---

#### Story 6.1.1: Export as Claude Agent SDK Code

As a **developer**,
I want **to export workflows as Claude Agent SDK code**,
So that **I can run agents locally**.

**Acceptance Criteria:**

- **Given** I have a workflow
- **When** I export to Claude SDK (2.3.1)
- **Then** I receive:
  - Python code using Claude Agent SDK
  - Requirements.txt
  - README with setup instructions
  - All prompts and configurations
- **And** code runs standalone
- **And** maintains workflow logic

**Implements:** FR233
**Screens:** 2.3.1
**Research Reference:** T1-FRAME §5-6

---

**Epic E6.1 Complete: 1 story**

---

### Epic E6.2: SDK Export - Agno Framework

**Research:** T1-FRAME §5-6
**UX Screens:** 2.3.2
**Implements:** FR234

---

#### Story 6.2.1: Export as Agno Framework Code

As a **developer**,
I want **to export as Agno framework code**,
So that **I can use our runtime directly**.

**Acceptance Criteria:**

- **Given** I have a workflow
- **When** I export to Agno (2.3.2)
- **Then** I receive:
  - Python code using Agno SDK
  - All agents and tools defined
  - Configuration files
  - Test scaffolding
- **And** native Agno format
- **And** full feature parity

**Implements:** FR234
**Screens:** 2.3.2
**Research Reference:** T1-FRAME §5-6

---

**Epic E6.2 Complete: 1 story**

---

### Epic E6.3: SDK Export - LangGraph/CrewAI

**Research:** T1-FRAME §5-6
**UX Screens:** 2.3.3, 2.3.4
**Implements:** FR235, FR236

---

#### Story 6.3.1: Export as LangGraph Adapter

As a **developer**,
I want **to export as LangGraph adapter code**,
So that **I can use LangChain ecosystem**.

**Acceptance Criteria:**

- **Given** I have a workflow
- **When** I export to LangGraph (2.3.3)
- **Then** I receive:
  - Python code with LangGraph
  - State machine definition
  - Tool wrappers
  - Example usage
- **And** compatible with LangChain tools
- **And** graph visualization included

**Implements:** FR235
**Screens:** 2.3.3
**Research Reference:** T1-FRAME §5-6

---

#### Story 6.3.2: Export as CrewAI Adapter

As a **developer**,
I want **to export as CrewAI adapter code**,
So that **I can use multi-agent patterns**.

**Acceptance Criteria:**

- **Given** I have a multi-agent workflow
- **When** I export to CrewAI (2.3.4)
- **Then** I receive:
  - Python code with CrewAI
  - Agent definitions
  - Task configurations
  - Crew setup
- **And** maps to CrewAI patterns
- **And** preserves agent relationships

**Implements:** FR236
**Screens:** 2.3.4
**Research Reference:** T1-FRAME §5-6

---

**Epic E6.3 Complete: 2 stories**

---

### Epic E6.4: API Endpoints

**Research:** T3-UIGEN §12, T0-PROT, T4-SEC §3
**UX Screens:** 2.3.5, 2.3.6
**Implements:** FR237, FR238, FR239, FR241

---

#### Story 6.4.1: REST API with OpenAPI Spec

As a **developer**,
I want **REST API with OpenAPI specification**,
So that **I can integrate programmatically**.

**Acceptance Criteria:**

- **Given** I want API access
- **When** I use REST API (2.3.5)
- **Then** I get:
  - Full REST API
  - OpenAPI 3.0 spec
  - Swagger UI documentation
  - Client SDK generation
- **And** all features accessible
- **And** versioned endpoints

**Implements:** FR237
**Screens:** 2.3.5
**Research Reference:** T3-UIGEN §12
**NFRs:** NFR-INT-06, NFR-MAINT-09

---

#### Story 6.4.2: GraphQL API

As a **developer**,
I want **GraphQL API**,
So that **I can query efficiently**.

**Acceptance Criteria:**

- **Given** I want flexible queries
- **When** I use GraphQL (2.3.5)
- **Then** I get:
  - Full GraphQL schema
  - Introspection enabled
  - Playground UI
  - Subscriptions for real-time
- **And** N+1 query prevention
- **And** Complexity limiting

**Implements:** FR238
**Screens:** 2.3.5
**Research Reference:** T3-UIGEN §12

---

#### Story 6.4.3: SSE Streaming Endpoints

As a **developer**,
I want **SSE streaming endpoints**,
So that **I can receive real-time updates**.

**Acceptance Criteria:**

- **Given** I execute workflows
- **When** I use streaming (2.3.6)
- **Then** I receive:
  - Server-Sent Events stream
  - AG-UI compatible events
  - Execution progress
  - Token-by-token output
- **And** connection resilient
- **And** reconnection handled

**Implements:** FR239
**Screens:** 2.3.6
**Research Reference:** T0-PROT

---

#### Story 6.4.4: Rate Limit Headers

As a **developer**,
I want **rate limit headers on API responses**,
So that **I can manage my usage**.

**Acceptance Criteria:**

- **Given** I make API calls
- **When** response returns
- **Then** headers include:
  - X-RateLimit-Limit
  - X-RateLimit-Remaining
  - X-RateLimit-Reset
  - Retry-After (on 429)
- **And** consistent across endpoints
- **And** documented in spec

**Implements:** FR241
**Screens:** 2.3.5
**Research Reference:** T4-SEC §3

---

**Epic E6.4 Complete: 4 stories**

---

### Epic E6.5: Mobile SDKs

**Research:** T8-GAPS §3, T8-UI §5
**UX Screens:** 2.3.7, 1.10.9
**Implements:** FR240, FR242

---

#### Story 6.5.1: iOS, Android, JS, Python SDKs

As a **developer**,
I want **native SDKs for multiple platforms**,
So that **I can integrate from any environment**.

**Acceptance Criteria:**

- **Given** I develop apps
- **When** I use SDKs (2.3.7)
- **Then** I have:
  - iOS SDK (Swift)
  - Android SDK (Kotlin)
  - JavaScript SDK (TypeScript)
  - Python SDK
- **And** consistent API across SDKs
- **And** auto-generated from spec

**Implements:** FR240
**Screens:** 2.3.7
**Research Reference:** T8-GAPS §3

---

#### Story 6.5.2: Configure Scoped API Keys in SDKs

As a **developer**,
I want **to configure scoped API keys in SDKs**,
So that **mobile apps have limited permissions**.

**Acceptance Criteria:**

- **Given** I embed SDK in app
- **When** I configure keys (1.10.9)
- **Then** I can:
  - Create mobile-scoped API key
  - Limit to specific operations
  - Set short expiration
  - Restrict to specific endpoints
- **And** keys rotatable
- **And** device binding optional

**Implements:** FR242
**Screens:** 1.10.9
**Research Reference:** T8-UI §5

---

**Epic E6.5 Complete: 2 stories**

---

## Phase 6 Complete: 10 Stories across 5 Epics

---

## COMPLETE SUMMARY

| Phase | Epics | Stories |
|-------|-------|---------|
| Phase 0: Project Infrastructure | 2 | 38 |
| Phase 1: Foundation | 17 | 117 |
| Phase 2: Builder Suite | 13 | 80 |
| Phase 3: Marketplace | 9 | 27 |
| Phase 4: Enterprise | 7 | 27 |
| Phase 5: Collaboration | 6 | 9 |
| Phase 6: Future | 5 | 10 |
| **TOTAL** | **58** | **293** |

---

---

## Implementation Guides Reference

| Document | Purpose | Stories Impacted |
|----------|---------|------------------|
| `routing-specification.md` | URL paths, route guards, navigation flows for all 146 screens | All stories with screen implementations |
| `ag-ui-integration-guide.md` | AGENT_CONTENT_ZONE specs, A2UI schema, streaming patterns | All stories with `AG-UI` protocol events |
| `protocol-stack-specification.md` | AG-UI events, A2A messages, MCP tool calls, DCRL integration | All protocol-related stories |
| `project-context.md` | 91 implementation rules, TypeScript patterns, React hooks, testing | All implementation stories |

---

_Document initialized: 2026-01-25_
_Step 1 Complete: Prerequisites validated, requirements extracted_
_Step 2 Complete: Epics designed and approved_
_Step 3 Complete: All 270 stories generated with cross-references_
_Step 4 Complete: Final validation passed - Ready for development_
_Step 4.1 Complete: Added Epic E0.1 (Project Foundation) with 23 comprehensive infrastructure setup stories - Total: 293 stories across 58 epics_
_Step 4.2 Complete: Added Epic E0.2 (Frontend Foundation) with 15 stories for parallel UI development - Total: 308 stories across 59 epics_
_Updated: 2026-01-26 - Added AG-UI integration guide and protocol stack references_
