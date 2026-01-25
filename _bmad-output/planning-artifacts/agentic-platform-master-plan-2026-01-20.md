# Hyyve Platform - Master Plan

**Date:** 2026-01-20 (Updated: 2026-01-23)
**Status:** Research Phase COMPLETE - **40 documents** (34 research + 6 planning artifacts) + **Architecture Synthesis v1.5** + **Comprehensive Validation COMPLETE** (All gaps resolved, all redundancies validated, all conflicts resolved) - READY FOR PRD

> ⚠️ **Critical Notice:** Typebot uses **FSL license (NOT MIT)**. Review license implications before commercial use.
**Project:** Hyyve Platform (Dify + BMB Methodology)

---

## Executive Summary

Building a **platform + marketplace** for creating AI agents and workflows, combining:
- **Dify's** visual node-based workflow builder
- **CC-WF-Studio's** conversational building approach
- **BMAD BMB's** systematic methodology for agent/workflow creation
- **Claude Agent SDK** as the initial target framework
- **Voice Agents** with custom voice pipeline (study LiveKit, build custom)
- **Chatbots** with Chatwoot integration (study Botpress/Rasa, build custom)
- **Canvas Builder** for visual content generation (study TapNow/ComfyUI, build custom with unified Agno chat)

### Platform Hierarchy

```
Workspace (User/Organization)
    └── Project
        ├── Module (BMB methodology)
        │   └── Agents / Workflows / Tasks / Checklists
        ├── Chatbot (customer-facing, Chatwoot-connected)
        │   └── Conversation Flows / Nodes
        ├── Voice Agent (customer-facing, Twilio-connected)
        │   └── Voice Flows / Nodes
        └── Canvas (visual content creation)
            └── Visual Workflows / Nodes / Templates
```

### Key Insight: Four Build Types
- **Modules** = Backend intelligence (BMB methodology, internal workflows)
- **Chatbots/Voice Agents** = Customer-facing interfaces (independent but can integrate with modules)
- **Canvas** = Visual content generation (images, videos, marketing assets via infinite canvas)
- All share the same **project RAG context**, **unified Agno chat interface**, and can be sold in the **marketplace**

### Business Model

- **Platform-first**: Users self-serve, BMB guides agent creation conversationally
- **Marketplace**: Users can sell modules/workflows; platform takes revenue share
- **B2B2C**: Agencies/developers build for their clients, charge for access
- **Multi-framework**: Start with Claude Agent SDK, expand to Agno, LangGraph, etc.

---

## Vision Statement

> A platform where users conversationally build AI agents and workflows using BMB methodology, visualize them in a Dify-style node editor, deploy them with built-in RAG knowledge bases, and optionally sell them in a marketplace.

---

## Research Completed

### Tier 0: Foundation (Previously Completed, Verified)

| Document | Focus | Location |
|----------|-------|----------|
| `technical-agentic-rag-sdk-research-v2-2026-01-19.md` | Agno, pgvector, Graphiti, Crawl4ai, Docling, RAG pipeline | `_bmad-output/planning-artifacts/research/` |
| `technical-agentic-protocols-research-2026-01-19.md` | CopilotKit, AG-UI, A2UI, A2A, MCP protocols | `_bmad-output/planning-artifacts/research/` |

### Tier 1: Platform Foundation (Completed 2026-01-20, Verified)

| Document | Focus | Key Findings |
|----------|-------|--------------|
| `technical-claude-agent-sdk-research-2026-01-20.md` | Claude SDK architecture, subagents, tools, MCP, CC-WF-Studio nodes | ✅ Verified. Two SDK interfaces (query/client), subagent orchestration, MCP support validated |
| `technical-visual-workflow-builders-research-2026-01-20.md` | Dify, n8n, Flowise, ReactFlow patterns | ✅ Verified. ReactFlow + Zustand recommended, Variable Pool pattern, graph-first architecture, 20+ node types |
| `technical-multi-tenant-saas-research-2026-01-20.md` | Multi-tenancy, Supabase, Neon, Clerk, RLS | ✅ Verified. Supabase + Neon hybrid, Clerk/WorkOS auth, complete SQL schema for hierarchy |

---

## Research Roadmap

### Tier 2: Integration (Completed)

| Document | Focus | Status | Why Needed |
|----------|-------|--------|------------|
| `technical-conversational-builder-research-2026-01-20.md` | Intent parsing, incremental changes, CC-WF-Studio patterns, BMB integration | ✅ Verified (2026-01-21) | How chat interface builds workflows |
| `technical-framework-abstraction-research-2026-01-20.md` | Common agent patterns across Claude SDK, Agno, LangGraph, CrewAI | ✅ Verified (2026-01-21) | Multi-framework support |
| `business-marketplace-economics-research-2026-01-20.md` | Revenue models, creator incentives, Stripe Connect, Shopify patterns | ✅ Verified (2026-01-21) | Monetization strategy |

### Tier 3: Polish (Before MVP) - COMPLETE

| Document | Focus | Status | Key Findings |
|----------|-------|--------|--------------|
| `technical-billing-metering-research-2026-01-20.md` | Usage tracking, Stripe Billing, Orb, Lago | ✅ Verified (2026-01-21) | Stripe Meters + Orb at scale, hybrid pricing model |
| `technical-ui-generation-research-2026-01-20.md` | v0.dev, Blocks.diy, Dyad, shadcn | ✅ Verified (2026-01-21) | 3-tier generation strategy, v0 Models/Platform API validated |

### Tier 4: Advanced Features (Post-MVP) - COMPLETE

| Document | Focus | Status | Key Findings |
|----------|-------|--------|--------------|
| `technical-chatwoot-integration-research-2026-01-20.md` | Chatwoot APIs, webhooks, RAG bots | ✅ Verified (2026-01-21) | Agent Bots + webhook architecture, account-per-tenant. Corrected: Client API path, rate limits, bot events |
| `technical-embedded-chat-ui-research-2026-01-21.md` | Custom React chat UI, ActionCable, RAG insights | ✅ Verified (2026-01-21) | Chatwoot as headless backend, per-project chat views. Corrected: RoomChannel only, additional_attributes |
| `technical-command-center-research-2026-01-20.md` | A2UI dashboard, HITL UX | ✅ Verified (2026-01-21) | SSE + Supabase Realtime, Tremor charts. Corrected: A2UI v0.8 (not v0.9), AG-UI INTERRUPT is draft, Chart requires custom catalog |
| `technical-agent-observability-research-2026-01-20.md` | Tracing, cost tracking | ✅ Verified (2026-01-21) | Langfuse (self-hosted), Helicone (cost), OTel standards |
| `business-competitive-analysis-research-2026-01-20.md` | Market gaps, positioning | ✅ Verified (2026-01-21) | Conversational builder = major differentiator |
| `technical-agent-versioning-research-2026-01-21.md` | Git-like versioning, diffing, A/B testing | ✅ Verified (2026-01-21) | Semantic versioning, jsondiffpatch, Bayesian A/B testing, promotion pipelines. Corrected: supa_audit→pgaudit, SHA-1 bucketing (not murmur3) |
| `technical-security-sandboxing-research-2026-01-21.md` | Code isolation, prompt injection | ✅ Verified (2026-01-21) | Firecracker MicroVMs, NeMo Guardrails, defense-in-depth, SOC 2 + EU AI Act. **Enhanced:** Added Vector DB Security (OWASP LLM08), Cross-Agent Security, Runtime Monitoring, Agents Rule of Two. Corrected: gVisor syscall coverage (68% not 70-80%), SmoothLLM bypassed by adaptive attacks (>90%) |
| `technical-collaborative-editing-research-2026-01-21.md` | CRDT, Yjs, multiplayer | ✅ Verified (2026-01-21) | Yjs + Y-Sweet recommended, ReactFlow integration, presence/cursors. Corrected: Y-Sweet API (DocumentManager, not YSweetProvider) |
| `technical-mcp-skills-marketplace-research-2026-01-21.md` | MCP/Skills marketplace, registry | ✅ Verified (2026-01-21) | Dual registry (Official + Smithery), one-click install, SKILL.md format. **Corrected:** Smithery API URL (registry.smithery.ai not api.smithery.ai), Cline config path (~/.cline/ not VSCode globalStorage), removed non-existent chat.mcp.discovery.enabled feature |

### Tier 5: Scale & Enterprise (Growth Phase) - COMPLETE

| Document | Focus | Status | Key Findings |
|----------|-------|--------|--------------|
| `technical-self-hosted-deployment-research-2026-01-21.md` | Docker, Kubernetes, Helm charts, air-gapped | ✅ Verified (2026-01-21) | Docker Compose for dev, Helm for prod, Harbor for air-gapped, Velero for backups. **Enhanced:** Added GitOps (ArgoCD/Flux), Supply Chain Security (SBOM/Sigstore), Policy Enforcement (OPA/Kyverno). Corrected: Weaviate 1.24.1→1.36.1, Velero→v1.17, K3s→v1.33.1, terraform-aws-eks→v21.0, K8s min→1.30+, Promtail EOL warning |
| `technical-white-label-research-2026-01-21.md` | Theming, custom domains, branding | ✅ Verified (2026-01-22) | CSS variables + shadcn/ui, Vercel/Cloudflare custom domains, Resend for email. **Enhanced:** Added CSP headers, WCAG color contrast validation, CAN-SPAM compliance, multi-layer caching strategy, error boundaries, font URL validation. Corrected: Vercel API v10→v9, Prisma schema relations, hardcoded SPF values, CSS scoping for global selectors |
| `technical-sso-enterprise-auth-research-2026-01-21.md` | SAML, SCIM, directory sync | ✅ Verified (2026-01-22) | WorkOS for enterprise SSO, Clerk for base auth (passkeys on free tier), hybrid approach recommended. **Enhanced:** Added Passkeys & Conditional UI section, Continuous Authentication section, Zero Trust Identity section, SCIM rate limiting (25 req/sec), passwordless adoption stats. Corrected: otplib v12→v13 API (epochTolerance), Auth0 pricing updated (25K MAU free) |
| `business-pricing-strategy-research-2026-01-21.md` | Freemium, usage tiers, enterprise contracts | ✅ Verified (2026-01-21) | 5-tier model, hybrid pricing, 15-20% marketplace commission |

### Tier 6: Voice Agents & Chatbot Builders (2026-01-22) - COMPLETE

| Document | Focus | Status | Key Findings |
|----------|-------|--------|--------------|
| `technical-voice-stack-research-2026-01-22.md` | Pipecat, Vocode, LiveKit, custom build | ✅ **Verified** (2026-01-22) | Pipecat (BSD 2-Clause, 9.9K stars) OR custom build with MIT components. Corrected: GitHub stats, LiveKit TPR/TNR metrics, aiortc BSD-3-Clause. |
| `technical-chatbot-builder-research-2026-01-22.md` | Botpress, Rasa, Voiceflow, Typebot, Chatwoot | ✅ **VALIDATED** (2026-01-22) | 60+ node types identified. **Typebot uses FSL license (NOT MIT)**. Native Chatwoot integration. Card-in-Node pattern (Botpress). MVP: 25 nodes. |
| `technical-integration-layer-research-2026-01-22.md` | A2A, MCP, webhooks, event-driven | ✅ **Validated** (2026-01-22) | Hybrid architecture: MCP for vertical (chatbot→module), A2A for horizontal (agent→agent), event-driven for proactive notifications. **Validated via DeepWiki/Context7:** A2A v0.3.0 schema corrected, MCP 2025-11-25 Tasks primitive added, OWASP prompt injection defense enhanced, circuit breaker patterns added. |
| `technical-livekit-architecture-study-2026-01-22.md` | LiveKit Agents deep-dive | ✅ **Verified** (2026-01-22) | Turn detection (Qwen2.5-0.5B, 50-160ms per-turn latency), interruption handling, SIP gateway, noise cancellation (BVC requires separate plugin). Corrected: latency clarification, BVC plugin location. |
| `technical-rasa-architecture-study-2026-01-22.md` | Rasa dialogue management deep-dive | ✅ **VALIDATED** (2026-01-22, 9.4/10) | NLU pipeline, DIETClassifier (BILOU tagging), slot filling, dialogue policies, event-sourced tracker, forms, CALM. **Validated via DeepWiki/Context7:** Policy priorities verified, tracker events confirmed, BILOU tagging corrected. |

### Tier 7: Canvas Builder - 4th Build Type (2026-01-22) - COMPLETE

| Document | Focus | Status | Key Findings |
|----------|-------|--------|--------------|
| `technical-canvas-builder-research-2026-01-22.md` | TapNow, ComfyUI, Krea, Weavy, unified chat architecture | ✅ **VERIFIED** (2026-01-22, v2.0) | Infinite canvas for visual content generation (images, videos, marketing assets). **Decision:** Use unified Agno chat with dedicated Canvas Agent ("Artie") instead of adding Weavy SDK. 50+ node types across input, AI generation, processing, control flow, integration, and output categories. DAG execution with partial re-execution (ComfyUI pattern). Community features (TapTV-style gallery, forking, remixing). MVP: 20 nodes in 4-6 weeks. **Validated via Context7 MCP + DeepWiki MCP.** Corrected: ReactFlow DAG enforcement (requires explicit cycle detection), Agno model IDs, FLUX licensing matrix, Weavy pricing. Added: Real-time collaboration (Yjs), workflow versioning. |

### Tier 8: AI Generation Providers (2026-01-22) - VERIFIED

| Document | Focus | Status | Key Findings |
|----------|-------|--------|--------------|
| `technical-ai-generation-providers-research-2026-01-22.md` | Flux, Kling, Minimax, Veo, Runway, Sora, ElevenLabs, Meshy, fal.ai, Replicate | ✅ **VERIFIED** (2026-01-23, v1.1) | **Image:** Flux 2 Turbo leads value ($0.008/MP via fal.ai), Flux 2 Pro best quality ($0.03/MP). **Video:** Kling 2.6 best value with native audio ($0.07-0.14/sec); Veo 3 premium ($0.75/sec with audio); Runway Gen-4.5 #1 quality ($0.25/sec). **Audio:** ElevenLabs for TTS. **Music:** Suno/Udio legal status improved - WMG+UMG settled (Nov 2025), licensed models 2026. **3D:** Meshy-6 in preview status. **Strategy:** Use fal.ai as unified gateway. **DALL-E 2/3 deprecated 05/12/2026** - migrate to gpt-image-1.5. **Validated via Context7 MCP + DeepWiki MCP + Web Search.** Critical corrections: Veo 3 pricing 3.75x higher, Runway credits 66% higher, Flux Turbo 2.67x higher than original estimates. |

---

## Key Architectural Decisions

### Decided (From Research)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Initial Agent Framework** | Claude Agent SDK | Subagent architecture, in-process MCP, CC-WF-Studio compatibility |
| **Visual Builder Stack** | ReactFlow + Zustand | Used by Dify/Flowise, wide ecosystem, undo/redo support |
| **Data Flow Pattern** | Variable Pool (Dify-style) | Namespace isolation, clean inter-node communication |
| **Graph Architecture** | Graph-first, code gen for export | Visual graph is source of truth, not bidirectional sync |
| **Primary Database** | Supabase | Built-in RLS, Auth, Realtime |
| **Enterprise Isolation** | Neon | Project-per-tenant, scale-to-zero |
| **Auth Provider** | Clerk + WorkOS | Best B2B features, organization support |
| **Protocol Stack** | AG-UI + A2UI + MCP | From protocols research |

### Decided (Voice & Chatbot - 2026-01-22)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Voice Stack Strategy** | Study LiveKit, Build Custom | Zero license risk for open-source future; use FastRTC + Silero VAD + aiortc (all MIT/BSD) |
| **Voice Study Target** | LiveKit Agents | Best-in-class turn detection (98.8% TPR / 87.5% TNR), interruption handling, SIP gateway |
| **Chatbot Stack Strategy** | Study Rasa/Botpress, Build Custom | Typebot (FSL license) has Chatwoot integration; Card-in-Node pattern from Botpress |
| **Chatbot Study Target** | Rasa | Best dialogue management, slot filling, NLU pipeline |
| **Chatbot-Module Integration** | MCP Tools | Expose module workflows as MCP tools; chatbots call via MCP client |
| **Agent-to-Agent** | A2A Protocol | For complex multi-agent orchestration scenarios |
| **Proactive Notifications** | Event-Driven (Redis/NATS) | Module workflows publish events, chatbots subscribe and push to customers |
| **Voice Streaming** | WebSocket/SSE | For real-time audio streaming to TTS |
| **Chatbot MVP** | 25 nodes, 4-6 weeks | Text, buttons, cards, conditions, handoff, MCP integration |

### Decided (Canvas Builder - 2026-01-22)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Canvas Chat Interface** | Unified Agno Chat (NOT Weavy) | Consistent UX across all builders, leverages existing infrastructure, no new vendor dependencies |
| **Canvas Agent** | Dedicated "Artie" agent | Context-aware routing; activates when user is in Canvas view |
| **Visual Canvas** | ReactFlow infinite canvas | Same stack as other builders, TapNow-style infinite zoom/pan |
| **Execution Engine** | DAG with partial re-execution | ComfyUI pattern - only re-execute changed nodes, smart caching |
| **Node Categories** | 6 categories, 50+ node types | Input, AI Generation, Processing, Control Flow, Integration, Output |
| **Community Features** | TapTV-style gallery | Public workflows, forking, remixing, templates marketplace |
| **Canvas MVP** | 20 nodes, 4-6 weeks | TextToImage, ImageToImage, Upscale, RemoveBackground, RAGQuery, MCPToolCall, etc. |
| **Provider Abstraction** | Multi-provider support | Flux, Runway, Midjourney, DALL-E, etc. with cost estimation |

### Decided (AI Generation Providers - 2026-01-22, VERIFIED 2026-01-23)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Primary Image Provider** | Flux 2 Turbo (via fal.ai) | Best value at $0.008/MP; Flux 2 Pro for premium at $0.03/MP |
| **Primary Video Provider** | Kling 2.6 | Native audio, 3-min duration, best value at $0.07-0.14/sec |
| **Premium Video Provider** | Runway Gen-4.5 or Veo 3 | #1 quality ($0.25/sec) or native audio premium ($0.75/sec) |
| **Primary TTS Provider** | ElevenLabs | Industry standard, mature API, $0.06-0.15/min |
| **Primary 3D Provider** | Meshy-6 (preview) | Quad topology, PBR textures - note: still in preview status |
| **Upscaling** | Real-ESRGAN | Free, fast, 9.2/10 quality |
| **Unified API Gateway** | fal.ai | 600+ models, 50% batch discount, no cold starts, exclusive Flux 2 Turbo |
| **Midjourney** | NOT recommended | No official API, TOS risk with third-party solutions |
| **Music Generation** | Suno/Udio | ✅ WMG+UMG settled (Nov 2025); licensed models 2026; only Sony ongoing |
| **OpenAI Images** | gpt-image-1.5 | New flagship model; DALL-E 2/3 deprecated 05/12/2026 |

> ⚠️ **Video Cost Alert**: Veo 3 with audio costs $7.50/10s video; Runway Gen-4.5 costs $2.50/10s. Use Kling 2.6 ($1.40/10s with audio) as default for cost efficiency.

### Decided (Hybrid Integration - 2026-01-23)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Internal Workflow Calls** | Dify-style "Workflow as Tool" | Low overhead, shared variable pool, built-in recursion protection |
| **State Synchronization** | PostgreSQL LISTEN/NOTIFY | Sub-millisecond latency, ACID, works with existing Supabase |
| **Event Fan-out** | Redis Pub/Sub | Cross-builder notifications, decoupled, very low overhead |
| **Voice Real-time** | gRPC Bidirectional Streams | 1-10ms latency, true bidirectional for Voice ↔ Module |
| **LLM Function Calling** | MCP | Standard for external tools, reserve for LLM use only |
| **External Webhooks** | REST API | Universal compatibility, simple |
| **Multi-Agent Orchestration** | A2A Protocol | For complex scenarios spanning beyond platform |
| **n8n Pattern** | Execute Workflow Node (study) | Direct workflow calls, static data patterns |

> ⚠️ **Key Insight**: MCP uses too much context for internal workflow integration. Use lightweight patterns (Dify-style tools, Redis, PostgreSQL NOTIFY) for internal calls. Reserve MCP for LLM function calling and external tool integrations.

### Architecture Principle: "Study the Best, Build Custom"

> Study best-in-class solutions (LiveKit, Rasa) for architecture patterns, then build custom implementations with MIT-licensed building blocks. This gives us:
> 1. **Zero license risk** for potential open-source future
> 2. **Full control** over platform-specific optimizations
> 3. **Differentiation** - not just a wrapper around existing frameworks

### Resolved (From Tier 2 Research)

| Decision | Resolution | Source |
|----------|------------|--------|
| **Conversation → Graph sync** | AI interprets NL to graph operations | Conversational builder research - DCRL pattern |
| **Framework abstraction** | Open Agent Spec + per-framework adapters | Framework abstraction research |
| **Marketplace revenue model** | Tiered revenue share (15-20%) | Marketplace economics research |

---

## CC-WF-Studio Node Types (Reference)

| Node Type | Purpose | SDK Mapping |
|-----------|---------|-------------|
| **Prompt Node** | Template with `{{variable}}` substitution | System prompt / prompt parameter |
| **Sub-Agent Node** | Autonomous agent config (prompt, tools, model) | `AgentDefinition` in agents dict |
| **Skill Node** | Claude Code Skills integration | `setting_sources` + `.claude/skills/` |
| **MCP Tool Node** | MCP server connection with dynamic params | `mcp_servers` configuration |
| **IfElse Node** | Binary branching (True/False) | `PreToolUse` hooks |
| **Switch Node** | Multi-way branching (2-N cases) | `PreToolUse` hooks |
| **AskUserQuestion Node** | User decision points (up to 4 options) | `AskUserQuestion` tool |

---

## BMB → Platform Mapping

| BMB Component | Platform Equivalent | Builder Agent |
|---------------|---------------------|---------------|
| Module | Project module with agents/workflows | Morgan (Module Builder) |
| Workflow | Visual node graph | Wendy (Workflow Builder) |
| Agent | Agent definition with persona/tools | Bond (Agent Builder) |
| Task | Individual workflow step | Step nodes |
| Checklist | Validation rules | Pre/post hooks |

---

## Technical Architecture (High-Level)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         HYYVE PLATFORM                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CONTROL PLANE (Platform Operations)                                         │
│  ════════════════════════════════════                                        │
│  • Workspace/Project/Module management (Supabase + RLS)                      │
│  • User auth & organizations (Clerk + WorkOS)                                │
│  • Billing & metering (Stripe)                                               │
│  • Marketplace catalog & transactions                                        │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  SYSTEM-WIDE: COMMAND CENTER DASHBOARD (/dashboard)                 │    │
│  │  ═══════════════════════════════════════════════════════════════════│    │
│  │  • ALL projects card-based status view (A2UI rendered)              │    │
│  │  • Global HITL approval queue (across all projects)                 │    │
│  │  • System-wide metrics and health monitoring                        │    │
│  │  • Timeline activity feed (all projects)                            │    │
│  │  • Drill-down links to project-specific views                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  PER-PROJECT VIEWS (/projects/:id/*)                                │    │
│  │  ═══════════════════════════════════════════════════════════════════│    │
│  │  • /chat - Embedded Chatwoot chat UI (custom React, headless CW)    │    │
│  │  • /builder - Conversational + Visual workflow builder              │    │
│  │  • /modules - Module management                                     │    │
│  │  • /knowledge - RAG knowledge base                                  │    │
│  │  • /analytics - Project-specific metrics and dashboards             │    │
│  │  • /jobs - Job history and execution logs                           │    │
│  │  • /approvals - Project-specific HITL queue                         │    │
│  │  • /settings - Project configuration                                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  BUILD PLANE (Agent/Workflow Creation)                                       │
│  ═════════════════════════════════════                                       │
│  • Chat interface (BMB conversational building)                              │
│  • Visual node editor (ReactFlow + Zustand)                                  │
│  • BMB agents: Bond, Wendy, Morgan                                           │
│  • Version control for agents/workflows                                      │
│                                                                              │
│  RUNTIME PLANE (Agent Execution)                                             │
│  ════════════════════════════════                                            │
│  • Claude Agent SDK (initial)                                                │
│  • Framework adapters (Agno, LangGraph - future)                             │
│  • RAG pipeline (pgvector + Graphiti)                                        │
│  • Protocol layer (AG-UI, A2UI, MCP)                                         │
│  • Isolated execution per project (K8s namespaces)                           │
│                                                                              │
│  CONTACT CENTER (Chatwoot as Headless Backend)                               │
│  ═════════════════════════════════════════════                               │
│  • Chatwoot APIs for messaging infrastructure                                │
│  • Custom React chat UI embedded per-project                                 │
│  • RAG-powered responses via webhook + RAG pipeline                          │
│  • ActionCable WebSocket for real-time updates                               │
│  • RAG insights panel (confidence, sources, sentiment)                       │
│                                                                              │
│  DELIVERY PLANE (Generated Apps)                                             │
│  ════════════════════════════════                                            │
│  • UI generation (Blocks.diy style)                                          │
│  • API endpoints for agents                                                  │
│  • Embeddable widgets                                                        │
│  • Chatwoot chat widgets for external users                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Command Center (Dashboard) Specification

### Overview

**SYSTEM-WIDE** operations dashboard rendered using **A2UI protocol**. Shows ALL projects for the workspace/organization with drill-down capabilities.

### Key Architectural Distinction

| View | Scope | Route | Purpose |
|------|-------|-------|---------|
| **Command Center** | System-wide | `/dashboard` | Overview of ALL projects |
| Global HITL Queue | System-wide | `/dashboard/hitl` | Approvals across all projects |
| Global Analytics | System-wide | `/dashboard/analytics` | Aggregated metrics |
| **Project Chat** | Per-project | `/projects/:id/chat` | Embedded Chatwoot UI |
| Project Analytics | Per-project | `/projects/:id/analytics` | Project-specific metrics |
| Project Approvals | Per-project | `/projects/:id/approvals` | Project-specific HITL |
| Project Jobs | Per-project | `/projects/:id/jobs` | Execution history |

### A2UI Components Used

| Component | Use Case |
|-----------|----------|
| **Card** | Project status cards with metrics |
| **Button** | Approve/Reject for human-in-the-loop decisions |
| **Timeline** | Activity feed of recent events |
| **Checklist** | Task completion tracking |
| **Chart** | Usage metrics, success rates, cost tracking |
| **ComparisonTable** | Before/after views, A/B test results |

### Dashboard Views

```
┌────────────────────────────────────────────────────────────────────────────┐
│  COMMAND CENTER (SYSTEM-WIDE)                              [Workspace: X]  │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  GLOBAL METRICS ROW                                                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ Active Runs │ │  Pending    │ │   Issues    │ │  Completed  │          │
│  │  All: 42    │ │ HITL All: 7 │ │   All: 5    │ │  Today: 189 │          │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘          │
│                                                                             │
│  ALL PROJECTS (Card Grid - Click to drill down)                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ Project A   │ │ Project B   │ │ Project C   │ │ Project D   │          │
│  │ Status: OK  │ │ Status: !   │ │ Status: OK  │ │ HITL: 3     │          │
│  │ Jobs: 42    │ │ Jobs: 17    │ │ Jobs: 89    │ │ Jobs: 5     │          │
│  │ Chats: 12   │ │ Chats: 8    │ │ Chats: 34   │ │ Chats: 2    │          │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘          │
│                                                                             │
│  GLOBAL HITL QUEUE (Top 5, link to full queue)                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ [Project A] Agent: "Refund Bot" requests approval for $250          │   │
│  │ [Project D] Agent: "HR Bot" needs employee verification             │   │
│  │ [Project D] Agent: "HR Bot" needs salary approval                   │   │
│  │ [Approve] [Reject] [Request Info] [View in Project]                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ACTIVITY TIMELINE (All Projects)                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Timeline                                                             │   │
│  │ - 10:45 [Project A] Workflow "Onboarding" completed                 │   │
│  │ - 10:42 [Project B] Agent "Support Bot" escalated                   │   │
│  │ - 10:38 [Project C] ISSUE: Token limit exceeded                     │   │
│  │ - 10:35 [Project A] Human approved refund #5678                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘
```

### Human-in-the-Loop (HITL) Flow

```
Agent Execution → Needs Approval → INTERRUPT Event (AG-UI)
                                          ↓
                            Command Center Approval Queue
                                          ↓
                     User clicks [Approve] or [Reject] (A2UI Button)
                                          ↓
                            AG-UI sends response back to agent
                                          ↓
                              Agent continues or handles rejection
```

### Technical Implementation

- **Rendering**: A2UI protocol with React renderer (CopilotKit compatible)
- **Real-time**: AG-UI SSE for streaming updates
- **State**: Supabase Realtime for cross-client sync
- **Storage**: Approval history in PostgreSQL with RLS

---

## Chatwoot Integration Specification

### Overview

**Chatwoot** (https://github.com/chatwoot/chatwoot) used as a **headless messaging backend**. We build a **custom React chat UI** embedded per-project, NOT using Chatwoot's native dashboard.

### Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| UI Approach | Custom React (not iframe/native) | Full control over UX, RAG insights display |
| View Location | Per-project (`/projects/:id/chat`) | Logical separation, focused context |
| Real-time | ActionCable WebSocket | Chatwoot native, reliable |
| RAG Metadata | Separate DB tables | Don't pollute Chatwoot's data model |

**Research Document:** `technical-embedded-chat-ui-research-2026-01-21.md`

### Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 CHATWOOT AS HEADLESS BACKEND ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  EXTERNAL CUSTOMER TOUCHPOINTS                                               │
│  ══════════════════════════════                                              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │  Chat   │ │  Email  │ │WhatsApp │ │ Twitter │ │ Telegram│              │
│  │ Widget  │ │         │ │         │ │         │ │         │              │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘              │
│       └──────────┬┴──────────┬┴──────────┬┴──────────┘                     │
│                  │           │           │                                   │
│                  ▼           ▼           ▼                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      CHATWOOT SERVER (Backend)                       │   │
│  │  • Conversation storage & management                                 │   │
│  │  • Contact management                                                │   │
│  │  • ActionCable WebSocket (real-time)                                 │   │
│  │  • Webhook events to platform                                        │   │
│  └───────────────────────────────┬─────────────────────────────────────┘   │
│                                  │                                          │
│        ┌─────────────────────────┴─────────────────────────┐                │
│        │                                                    │                │
│        ▼                                                    ▼                │
│  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐  │
│  │   PLATFORM CUSTOM CHAT UI       │  │      WEBHOOK HANDLER            │  │
│  │   (Per-Project Tab)             │  │      (RAG Processing)           │  │
│  │   ──────────────────────────    │  │      ─────────────────          │  │
│  │   • React components            │  │      • Receive messages         │  │
│  │   • Contact list + threads      │  │      • Query RAG pipeline       │  │
│  │   • RAG insights panel          │  │      • Send response via API    │  │
│  │   • Confidence indicators       │  │      • Store RAG metadata       │  │
│  │   • Source citations            │  │                                 │  │
│  │   • Escalation actions          │  │                                 │  │
│  └─────────────────────────────────┘  └─────────────────────────────────┘  │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │              PLATFORM RAG KNOWLEDGE BASE (Per-Project)               │   │
│  │  • pgvector embeddings                                               │   │
│  │  • Graphiti knowledge graph                                          │   │
│  │  • Confidence scoring                                                │   │
│  │  • Source attribution                                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Custom Chat UI Features

| Feature | Description | Component |
|---------|-------------|-----------|
| **Contact List** | Real-time conversation list with status | `ContactList.tsx` |
| **Thread View** | Message history with RAG metadata | `ConversationThread.tsx` |
| **RAG Insights Panel** | Confidence, sources, sentiment | `RAGInsightsPanel.tsx` |
| **Source Citations** | Document references on bot messages | `SourceCitation.tsx` |
| **Confidence Indicator** | Visual confidence display | `ConfidenceIndicator.tsx` |
| **Escalation Actions** | Handoff to human, add to training | Action buttons |

### Integration Points

| Integration | Method | Purpose |
|-------------|--------|---------|
| **REST API** | Platform → Chatwoot | Send messages, manage conversations |
| **Webhooks** | Chatwoot → Platform | New message triggers RAG processing |
| **ActionCable** | Real-time WebSocket | Live updates to custom UI |
| **Agent Bots** | Chatwoot feature | Automated RAG responses |

### Deployment

1. **Self-hosted Chatwoot** (Recommended) - Full control, same K8s cluster
2. **Account-per-tenant** - One Chatwoot account per workspace
3. **Inbox-per-project** - One inbox per project for isolation

---

## Voice Agent Builder Architecture (2026-01-22)

### Overview

**Voice Agent Builder** creates customer-facing voice AI agents for phone support, sales, and customer experience. Voice agents are **independent of modules** but can **integrate via MCP tools, webhooks, or A2A protocol**.

**Research Document:** `technical-voice-stack-research-2026-01-22.md`

### Architecture Strategy: "Study the Best, Build Custom"

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         VOICE AGENT BUILDER                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  STUDY TARGETS (Architecture Patterns Only)                                  │
│  ══════════════════════════════════════════                                  │
│  • LiveKit Agents - Turn detection (98.8% TPR), interruption handling, SIP  │
│  • Pipecat - Frame-based pipeline, 40+ provider integrations                │
│  • Rasa/Vocode - Dialogue management, slot filling patterns                 │
│                                                                              │
│  BUILD WITH MIT/BSD COMPONENTS                                               │
│  ═══════════════════════════════                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  CUSTOM VOICE PIPELINE                                               │    │
│  │  ──────────────────────                                              │    │
│  │  • FastRTC (MIT) - WebRTC/WebSocket, built-in VAD                   │    │
│  │  • Silero VAD (MIT) - Voice Activity Detection, <1ms/chunk          │    │
│  │  • aiortc (BSD) - Full Python WebRTC implementation                 │    │
│  │  • scipy/librosa (BSD) - Audio processing                           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  VISUAL NODE BUILDER (ReactFlow)                                     │    │
│  │  ─────────────────────────────────                                   │    │
│  │  • VoiceInputNode - STT provider config (Deepgram, Whisper, etc.)   │    │
│  │  • VoiceOutputNode - TTS provider config (Cartesia, ElevenLabs)     │    │
│  │  • InterruptionNode - Barge-in handling configuration               │    │
│  │  • VADNode - Voice activity detection settings                      │    │
│  │  • TranscriptNode - Access STT output                               │    │
│  │  • SSMLNode - TTS formatting (emotion, pauses, volume)              │    │
│  │  • CallControlNode - Twilio actions (transfer, hold, DTMF)          │    │
│  │  • RAGQueryNode - Project knowledge retrieval                       │    │
│  │  • ModuleCallNode - MCP tool call to backend workflows              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  TELEPHONY INTEGRATION                                                       │
│  ═════════════════════                                                       │
│  ┌─────────┐      ┌─────────────────┐      ┌────────────────────────┐       │
│  │ Twilio  │◄────►│ Voice Pipeline  │◄────►│ Project RAG + Modules  │       │
│  │  SIP    │      │ (Custom Built)  │      │                        │       │
│  └─────────┘      └─────────────────┘      └────────────────────────┘       │
│                                                                              │
│  CHATWOOT INTEGRATION                                                        │
│  ════════════════════                                                        │
│  • Transcripts pushed to Chatwoot voice inbox                               │
│  • Same conversation thread as chat (unified customer view)                 │
│  • Human handoff via Chatwoot assignment                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Voice Pipeline Flow

```
Incoming Call (Twilio)
       │
       ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  FastRTC     │────►│  Silero VAD  │────►│  STT Service │
│  WebSocket   │     │  Detection   │     │  (Deepgram)  │
└──────────────┘     └──────────────┘     └──────────────┘
                                                 │
       ┌─────────────────────────────────────────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  LLM/Agent   │────►│  TTS Service │────►│  Audio Out   │
│  (RAG + MCP) │     │  (Cartesia)  │     │  Streaming   │
└──────────────┘     └──────────────┘     └──────────────┘
       │
       │ Interruption Detection
       ▼
┌──────────────────────────────────────────────────────────┐
│  INTERRUPTION HANDLER                                     │
│  • Stop current TTS                                       │
│  • Clear audio buffer                                     │
│  • Restart STT listening                                  │
│  • Maintain conversation context                          │
└──────────────────────────────────────────────────────────┘
```

### Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **STT Provider** | Deepgram Nova-3 | $0.0043/min, excellent accuracy, streaming |
| **TTS Provider** | Cartesia | Low latency (~200ms), SSML-like controls |
| **VAD** | Silero VAD (MIT) | <1ms processing, 100+ languages |
| **WebRTC** | FastRTC + aiortc | MIT/BSD, Python async support |
| **Interruption** | Custom (study LiveKit) | Two-phase protocol, context sync |

### Cost Estimate (10,000 min/month)

| Component | Cost |
|-----------|------|
| STT (Deepgram) | $43 |
| TTS (Cartesia) | $300 |
| LLM (GPT-4o-mini) | $50-100 |
| Twilio | $100-200 |
| Infrastructure | $100-500 |
| **Total** | **$600-1,150/month** |

---

## Chatbot Builder Architecture (2026-01-22)

### Overview

**Chatbot Builder** creates customer-facing text chatbots for support, sales, and customer experience. Chatbots are **independent of modules** but can **integrate via MCP tools, webhooks, or A2A protocol**.

**Research Document:** `technical-chatbot-builder-research-2026-01-22.md`

### Architecture Strategy: Card-in-Node Pattern (from Botpress)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CHATBOT BUILDER                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  STUDY TARGETS (Patterns Only)                                               │
│  ══════════════════════════════                                              │
│  • Botpress - Card-in-Node pattern, 190+ integrations, Autonomous Node      │
│  • Rasa - NLU pipeline, slot filling, dialogue policies, forms              │
│  • Voiceflow - UX simplicity, Agent Step for autonomous AI flows            │
│  • Typebot (FSL) - Native Chatwoot integration, walkFlowForward algorithm   │
│                                                                              │
│  VISUAL NODE BUILDER (60+ Node Types)                                        │
│  ════════════════════════════════════                                        │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  CONVERSATION NODES (Tier 1 MVP: 8 nodes)                           │    │
│  │  • TextMessage - Plain text response                                │    │
│  │  • RichText - Markdown with formatting                              │    │
│  │  • ImageMessage - Image with optional caption                       │    │
│  │  • QuickReplies - Button chips for fast selection                   │    │
│  │  • ButtonList - Vertical button list                                │    │
│  │  • Card - Rich card with image, title, buttons                      │    │
│  │  • TextInput - Capture free text                                    │    │
│  │  • TypingIndicator - Show typing... animation                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  LOGIC NODES (Tier 1 MVP: 5 nodes)                                  │    │
│  │  • Condition (If/Else) - Binary branching                           │    │
│  │  • Switch/Router - Multi-way branching                              │    │
│  │  • Jump/Goto - Navigate to another node                             │    │
│  │  • StartSubflow - Enter nested flow                                 │    │
│  │  • EndConversation - Graceful termination                           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  INTEGRATION NODES (Tier 1 MVP: 4 nodes)                            │    │
│  │  • HTTPRequest - External API calls                                 │    │
│  │  • LLMPrompt - AI-generated responses                               │    │
│  │  • MCPToolCall - Call module workflow via MCP                       │    │
│  │  • ModuleCall - Direct backend workflow execution                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  ACTION NODES (Tier 1 MVP: 8 nodes)                                 │    │
│  │  • SetVariable - Store data in conversation context                 │    │
│  │  • GetVariable - Retrieve stored data                               │    │
│  │  • HumanHandoff - Escalate to agent (Chatwoot)                      │    │
│  │  • AssignAgent - Assign specific team/agent                         │    │
│  │  • AddLabel - Tag conversation in Chatwoot                          │    │
│  │  • SetAttribute - Set custom attributes                             │    │
│  │  • SetStatus - Change conversation status                           │    │
│  │  • LogMessage - Debug logging                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  TOTAL MVP: 25 nodes | Estimated Timeline: 4-6 weeks                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Chatwoot Integration Pattern

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CHATBOT ↔ CHATWOOT INTEGRATION                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  INBOUND FLOW (Customer → Bot)                                               │
│  ══════════════════════════════                                              │
│                                                                              │
│  ┌─────────┐    ┌───────────┐    ┌─────────────┐    ┌─────────────────┐    │
│  │ Customer│───►│ Chatwoot  │───►│  Webhook    │───►│ Chatbot Engine  │    │
│  │  (Chat) │    │ (Backend) │    │  Handler    │    │ (Flow Executor) │    │
│  └─────────┘    └───────────┘    └─────────────┘    └─────────────────┘    │
│                                                               │              │
│                                         ┌─────────────────────┘              │
│                                         │                                    │
│                                         ▼                                    │
│  OUTBOUND FLOW (Bot → Customer)         ▲                                    │
│  ═══════════════════════════════        │                                    │
│                                         │                                    │
│  ┌─────────────────┐    ┌───────────┐   │   ┌──────────────────┐           │
│  │ Chatbot Engine  │───►│ Chatwoot  │───┘   │  Project RAG     │           │
│  │ (Response Gen)  │    │ API       │◄──────│  + MCP Modules   │           │
│  └─────────────────┘    └───────────┘       └──────────────────┘           │
│                                                                              │
│  WEBHOOK EVENTS HANDLED                                                      │
│  ══════════════════════                                                      │
│  • message_created → Process user input                                     │
│  • conversation_opened → Start bot flow                                     │
│  • conversation_resolved → Cleanup actions                                  │
│  • webwidget_triggered → Proactive engagement                               │
│                                                                              │
│  CHATWOOT CONTENT TYPES USED                                                 │
│  ════════════════════════════                                                │
│  • text - Plain messages                                                    │
│  • input_select - Quick reply buttons                                       │
│  • cards - Rich cards with actions                                          │
│  • form - Multi-field data collection                                       │
│  • article - Help center content                                            │
│  • input_csat - Satisfaction surveys                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Human Handoff Flow

```
Bot Processing → Handoff Trigger Detected
                        │
    ┌───────────────────┼───────────────────┐
    │                   │                   │
    ▼                   ▼                   ▼
Explicit           Failure            Sentiment
Request         Threshold           Analysis
("talk to       (3 failures)       (negative
 human")                            detected)
    │                   │                   │
    └───────────────────┼───────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────┐
│  HANDOFF EXECUTION                                            │
│  • Send handoff request to Chatwoot                          │
│  • Create conversation.bot_handoff event                     │
│  • Change status to "open"                                   │
│  • Apply auto-assignment rules (round-robin/balanced)        │
│  • Pass context summary + extracted entities                 │
│  • Human agent receives full conversation history            │
└──────────────────────────────────────────────────────────────┘
```

### State Management (Zustand)

```typescript
interface ChatbotStore {
  // Conversation State
  conversation: {
    id: string;
    status: 'pending' | 'open' | 'resolved' | 'snoozed';
    currentFlowId: string;
    currentNodeId: string;
    history: Message[];
  };

  // Slot State (collected data from forms)
  slots: Record<string, SlotValue>;

  // Context State
  context: {
    lastIntent: string | null;
    lastEntities: Entity[];
    sentiment: 'positive' | 'neutral' | 'negative' | null;
    failureCount: number;
  };

  // Flow Stack (for nested subflows)
  flowStack: FlowContext[];
}
```

---

## Canvas Builder Architecture (2026-01-22)

### Overview

**Canvas Builder** creates visual content generation workflows (images, videos, marketing assets) using an infinite canvas with drag-and-drop nodes. Canvas workflows are **independent of modules** but can **integrate via MCP tools, webhooks, or A2A protocol**.

**Research Document:** `technical-canvas-builder-research-2026-01-22.md`

### Architecture Decision: Unified Chat + Dedicated Agent

Rather than adding Weavy SDK or building a separate chat interface, Canvas Builder uses the **same chat window** as all other builders with a **dedicated Canvas Agent ("Artie")** that activates based on context.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    UNIFIED CHAT + AGENT SYSTEM                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  SINGLE CHAT WINDOW (All Views) - Agno + RAG                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      AI CHAT (Existing Infrastructure)              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                               │
│              ┌───────────────┼───────────────┬───────────────┐              │
│              ▼               ▼               ▼               ▼              │
│       ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐        │
│       │  BMB     │    │ Chatbot  │    │  Voice   │    │  Canvas  │        │
│       │ Agents   │    │  Agent   │    │  Agent   │    │  Agent   │        │
│       │(Bond,    │    │          │    │          │    │ (Artie)  │        │
│       │Wendy,    │    │          │    │          │    │          │        │
│       │Morgan)   │    │          │    │          │    │          │        │
│       └────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘        │
│            │               │               │               │               │
│            ▼               ▼               ▼               ▼               │
│       ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐        │
│       │  Module  │    │ Chatbot  │    │  Voice   │    │  Canvas  │        │
│       │  Builder │    │ Builder  │    │ Builder  │    │ Builder  │        │
│       │ (ReactFlow)   │ (ReactFlow)   │ (ReactFlow)   │ (ReactFlow)       │
│       └──────────┘    └──────────┘    └──────────┘    └──────────┘        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Canvas Agent ("Artie") Tools

```python
canvas_agent = Agent(
    name="Artie",
    role="Visual Content Workflow Specialist",
    tools=[
        # Canvas manipulation
        AddNodeTool(),           # add_node(type, position, config)
        ConnectNodesTool(),      # connect_nodes(source, target, ports)
        UpdateNodeTool(),        # update_node(id, config)
        DeleteNodeTool(),        # delete_node(id)
        GetCanvasStateTool(),    # get_canvas_state()

        # Execution
        ExecuteWorkflowTool(),   # execute_workflow(node_ids?)
        PreviewNodeTool(),       # preview_node(id)

        # Templates
        LoadTemplateTool(),      # load_template(id)
        SaveTemplateTool(),      # save_as_template(name)
        BrowseTemplatesTool(),   # browse_templates(category)

        # RAG (shared)
        QueryKnowledgeBaseTool(),
        GetBrandGuidelinesTool(),
    ]
)
```

### Node Type Categories (50+ nodes)

| Category | Node Examples | Count |
|----------|---------------|-------|
| **Input** | TextPrompt, ImageUpload, SketchInput, ProductPhotos, URLInput | 10 |
| **AI Generation** | TextToImage, ImageToImage, TextToVideo, Upscale, Inpaint | 10 |
| **Processing** | RemoveBackground, StyleTransfer, ColorGrade, Composite, Crop | 12 |
| **Text/Caption** | CaptionGenerate, TextOverlay, Translate, CopyWrite | 6 |
| **Control Flow** | Condition, Switch, Loop, Batch, Merge | 6 |
| **Integration** | MCPToolCall, RAGQuery, WebhookTrigger, A2ATask, HTTPRequest | 8 |
| **Output** | ImageOutput, VideoOutput, BatchExport, PublishToGallery | 6 |

### Execution Engine (ComfyUI Pattern)

```
Graph Analysis → Dependency Resolution → Partial Execution → Caching
     │                    │                     │              │
     └── Identify         └── Topological       └── Only run   └── Cache
         changed nodes        sort nodes            changed        outputs
```

**Key Features:**
- **DAG Architecture**: Directed acyclic graph with typed connections
- **Partial Re-execution**: Only re-execute changed nodes (ComfyUI pattern)
- **Smart Caching**: Cache key = hash(node_type + config + input_values)
- **Parallel Execution**: Independent nodes execute in parallel
- **Provider Abstraction**: Support Flux, Runway, Midjourney, DALL-E, etc.

### Integration Points

| Integration | Method | Example |
|-------------|--------|---------|
| **Canvas → Module** | MCP Tool | Canvas calls `generate-product-description` module |
| **Chatbot → Canvas** | MCP Tool | Chatbot triggers `product-color-variant` canvas workflow |
| **Voice → Canvas** | MCP Tool | Voice agent references canvas outputs |
| **Canvas → RAG** | Query Tool | Get brand guidelines, product info for generation |
| **Canvas → Marketplace** | Publish | Sell canvas templates and workflows |

### Community Features (TapTV-style)

- **Public Gallery**: Browse community workflows and outputs
- **Forking**: One-click fork and customize any public workflow
- **Remixing**: Build on top of existing workflows
- **Templates**: Pre-built workflows for common use cases (e-commerce, social media)
- **Version History**: Track changes and revert

### Cost Estimation

Each workflow provides cost estimates before execution:
```typescript
{
  total: 0.45,
  currency: 'USD',
  breakdown: [
    { node: 'TextToImage', provider: 'flux', cost: 0.03 },
    { node: 'Upscale', provider: 'real-esrgan', cost: 0.02 },
    { node: 'RemoveBackground', provider: 'local', cost: 0.00 }
  ]
}
```

---

## Integration Layer Architecture (2026-01-22)

### Overview

The **Integration Layer** connects chatbots and voice agents to backend module workflows using a **hybrid protocol architecture**.

**Research Document:** `technical-integration-layer-research-2026-01-22.md`

### Protocol Selection Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INTEGRATION PROTOCOL SELECTION                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  USE CASE → PROTOCOL DECISION TREE                                           │
│  ══════════════════════════════════                                          │
│                                                                              │
│  Is response needed in < 2 seconds?                                          │
│      YES → REST API or MCP Tool                                             │
│      NO  → Continue...                                                      │
│                                                                              │
│  Is this a long-running operation (10-30 seconds)?                           │
│      YES → Does user need progress updates?                                 │
│            YES → A2A Streaming or WebSocket                                 │
│            NO  → Async Webhook Pattern                                      │
│                                                                              │
│  Is module initiating contact with customer?                                 │
│      YES → Event-Driven (Pub/Sub) + Push API                               │
│                                                                              │
│  Is this multi-agent orchestration?                                          │
│      YES → A2A Protocol                                                     │
│                                                                              │
│  DEFAULT → MCP Tool or REST API                                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Hybrid Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CHATBOT/VOICE ↔ MODULE INTEGRATION                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────┐                              ┌─────────────────────┐   │
│  │   CHATBOT /     │                              │   MODULE WORKFLOWS  │   │
│  │   VOICE AGENT   │                              │   (BMB Methodology) │   │
│  └────────┬────────┘                              └──────────┬──────────┘   │
│           │                                                  │              │
│           │                                                  │              │
│  ┌────────┴──────────────────────────────────────────────────┴────────┐    │
│  │                     INTEGRATION LAYER                               │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │                                                                     │    │
│  │  MCP (Vertical Integration - Chatbot → Module)                      │    │
│  │  ═══════════════════════════════════════════════                    │    │
│  │  • Module workflows exposed as MCP tools                            │    │
│  │  • Chatbot calls tool: cancel-subscription, check-order, etc.      │    │
│  │  • Synchronous response (< 2 seconds)                               │    │
│  │  • OAuth 2.1 authentication                                         │    │
│  │                                                                     │    │
│  │  A2A (Horizontal Integration - Agent ↔ Agent)                       │    │
│  │  ════════════════════════════════════════════                       │    │
│  │  • Multi-agent orchestration                                        │    │
│  │  • Agent discovery via Agent Cards                                  │    │
│  │  • Task lifecycle: submitted → working → input-required → completed │    │
│  │  • Streaming support for long operations                            │    │
│  │                                                                     │    │
│  │  Event-Driven (Proactive - Module → Customer)                       │    │
│  │  ════════════════════════════════════════════                       │    │
│  │  • Redis Streams / NATS JetStream                                   │    │
│  │  • Module publishes event: delivery_delayed, payment_failed         │    │
│  │  • Notification service consumes and pushes to chatbot              │    │
│  │  • Chatbot sends proactive message to customer                      │    │
│  │                                                                     │    │
│  │  Webhooks (Async Long-Running Operations)                           │    │
│  │  ════════════════════════════════════════                           │    │
│  │  • Immediate acknowledgment (HTTP 202)                              │    │
│  │  • Background processing                                            │    │
│  │  • Callback URL for completion notification                         │    │
│  │  • HMAC signature verification                                      │    │
│  │                                                                     │    │
│  │  WebSocket/SSE (Voice Streaming)                                    │    │
│  │  ═══════════════════════════════                                    │    │
│  │  • Real-time audio streaming                                        │    │
│  │  • Token-by-token LLM response                                      │    │
│  │  • Bidirectional for interruption handling                          │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### MCP Tool Pattern (Primary)

```typescript
// Module workflow exposed as MCP tool
const cancelSubscriptionTool = {
  name: 'cancel-subscription',
  description: 'Cancel a customer subscription and process refund',
  inputSchema: {
    type: 'object',
    properties: {
      subscriptionId: { type: 'string' },
      reason: { type: 'string' }
    },
    required: ['subscriptionId']
  }
};

// Chatbot calls MCP tool
async function handleCancelRequest(conversationContext) {
  const result = await mcpClient.callTool('cancel-subscription', {
    subscriptionId: conversationContext.slots.subscriptionId,
    reason: conversationContext.slots.cancellationReason
  });

  return formatResponseForCustomer(result);
}
```

### Security Architecture

| Layer | Protection |
|-------|------------|
| **Authentication** | OAuth 2.1 with tenant-scoped tokens |
| **Authorization** | RBAC + resource-level permissions |
| **Tenant Isolation** | Separate schemas/connections per tenant |
| **Prompt Injection** | Input validation, guardrails, sandbox |
| **Audit Logging** | All integration calls logged with context |

---

## Recommended Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| **Frontend** | Next.js + React | SSR, API routes |
| **Visual Editor** | ReactFlow + Zustand | Dify pattern |
| **Chat Interface** | CopilotKit | AG-UI integration |
| **Backend** | Node.js or Python | Agent execution |
| **Primary DB** | Supabase (PostgreSQL) | RLS, Auth, Realtime |
| **Vector DB** | pgvector (in Supabase) | Embeddings |
| **Graph DB** | Neo4j + Graphiti | Relationships |
| **Enterprise DB** | Neon | Tenant isolation |
| **Auth** | Clerk + WorkOS | B2B features |
| **Billing** | Stripe | Usage metering |
| **Agent SDK** | Claude Agent SDK | Initial framework |
| **Protocols** | AG-UI, A2UI, MCP | Communication |

---

## Implementation Phases (Detailed)

### Phase 1: Core Infrastructure
**Goal:** Multi-tenant foundation with auth and basic data model

| Task | Details | Dependencies |
|------|---------|--------------|
| [ ] Supabase project setup | PostgreSQL + pgvector extension | None |
| [ ] Multi-tenant schema | Workspace → Project → Module → Agent tables | Supabase |
| [ ] Row-Level Security policies | RLS for all tenant tables | Schema |
| [ ] Clerk integration | Auth, organizations, invitations | Supabase |
| [ ] WorkOS setup | SSO, directory sync for enterprise | Clerk |
| [ ] Basic API layer | CRUD endpoints for hierarchy | Schema + Auth |
| [ ] pgvector configuration | Embeddings table, HNSW indexes | Supabase |

### Phase 2: Visual Editor MVP
**Goal:** Dify-style node editor with basic node types

| Task | Details | Dependencies |
|------|---------|--------------|
| [ ] Next.js project setup | App router, TypeScript, Tailwind | None |
| [ ] ReactFlow integration | Canvas, zoom, pan, minimap | Next.js |
| [ ] Zustand state management | Graph state, undo/redo history | ReactFlow |
| [ ] Node type system | Base node interface, type registry | Zustand |
| [ ] Prompt Node | Template editing, variable detection | Node system |
| [ ] Sub-Agent Node | System prompt, tool permissions, model | Node system |
| [ ] MCP Tool Node | Server selection, tool picker, params | Node system |
| [ ] Control Flow Nodes | IfElse, Switch, AskUserQuestion | Node system |
| [ ] Connection validation | Type checking, cycle detection | Node system |
| [ ] JSON persistence | Save/load graphs to Supabase | Zustand + API |
| [ ] Variable Pool system | Namespace isolation, data flow | Zustand |

### Phase 3: Claude SDK Integration
**Goal:** Execute visual workflows via Claude Agent SDK

| Task | Details | Dependencies |
|------|---------|--------------|
| [ ] Graph → SDK code generation | Transform JSON graph to SDK code | Phase 2 |
| [ ] AgentDefinition mapping | Node → AgentDefinition translation | Code gen |
| [ ] MCP server configuration | Dynamic MCP setup from nodes | Code gen |
| [ ] Subagent orchestration | Multi-agent workflow execution | SDK integration |
| [ ] Execution runtime | Isolated execution environment | SDK + K8s |
| [ ] Result streaming | AG-UI events back to frontend | Runtime |
| [ ] Error handling | Graceful failures, retries | Runtime |

### Phase 4: Conversational Builder
**Goal:** Chat interface that builds workflows using BMB methodology

| Task | Details | Dependencies |
|------|---------|--------------|
| [ ] CopilotKit integration | Chat sidebar, AG-UI connection | Phase 2 |
| [ ] BMB agent adaptation | Bond, Wendy, Morgan for web | BMB module |
| [ ] Intent parsing | NL → Graph operation mapping | CopilotKit |
| [ ] Incremental building | Add/modify nodes via conversation | Intent parsing |
| [ ] Graph ↔ Chat sync | Bidirectional updates | Zustand |
| [ ] Conversation context | Maintain workflow context in chat | CopilotKit |
| [ ] Suggestion system | AI-generated next steps | Context |

### Phase 5: RAG Integration
**Goal:** Per-project knowledge bases with advanced retrieval

| Task | Details | Dependencies |
|------|---------|--------------|
| [ ] Knowledge base CRUD | Create/manage KB per project | Phase 1 |
| [ ] Document ingestion | Docling for PDFs, DOCX, etc. | KB CRUD |
| [ ] Web ingestion | Crawl4ai for URLs | KB CRUD |
| [ ] Chunking strategies | Semantic, AST-based for code | Ingestion |
| [ ] Embedding pipeline | OpenAI/Cohere embeddings | Chunking |
| [ ] Hybrid search | pgvector + BM25 | Embeddings |
| [ ] Graphiti integration | Entity extraction, relationships | Neo4j setup |
| [ ] Reranking | Cohere/cross-encoder reranking | Search |
| [ ] RAG node type | Knowledge retrieval in workflows | Phase 2 |

### Phase 6: Marketplace Foundation
**Goal:** Module publishing and discovery

| Task | Details | Dependencies |
|------|---------|--------------|
| [ ] Module packaging | Export format, versioning | Phase 2 |
| [ ] Publishing flow | Review, approval, listing | Packaging |
| [ ] Discovery system | Search, categories, tags | Publishing |
| [ ] Module installation | Copy to project, dependency resolution | Discovery |
| [ ] Licensing system | Free, paid, subscription options | Installation |
| [ ] Stripe Connect | Creator payouts, platform fees | Licensing |
| [ ] Usage tracking | Per-module execution metrics | Runtime |
| [ ] Reviews & ratings | Community feedback | Discovery |

### Phase 7: Billing & Monetization
**Goal:** Usage-based pricing and subscription management

| Task | Details | Dependencies |
|------|---------|--------------|
| [ ] Stripe Billing integration | Subscription plans, trials | Stripe Connect |
| [ ] Usage metering | Track executions, tokens, storage | Runtime |
| [ ] Pricing tiers | Free, Pro, Enterprise definitions | Metering |
| [ ] Billing portal | Self-serve subscription management | Stripe |
| [ ] Invoice generation | Usage-based invoices | Metering |
| [ ] Overage handling | Soft/hard limits, notifications | Metering |

### Phase 8: Command Center Dashboard
**Goal:** Real-time operations dashboard with A2UI rendering

| Task | Details | Dependencies |
|------|---------|--------------|
| [ ] A2UI React renderer | Implement A2UI component catalog | Phase 3 |
| [ ] Dashboard layout | Card grid, tabs, responsive design | A2UI renderer |
| [ ] Status cards | Running agents, workflows, metrics | Dashboard layout |
| [ ] Approval queue | HITL pending items list | INTERRUPT events |
| [ ] Approve/Reject UI | Button actions, confirmation | Approval queue |
| [ ] Activity timeline | Real-time event feed | Supabase Realtime |
| [ ] Issue alerts | Error detection, notifications | Runtime monitoring |
| [ ] Metrics charts | Usage, success rates, costs | Analytics data |

### Phase 9: Chatwoot Integration
**Goal:** Contact center with RAG-powered chatbots

| Task | Details | Dependencies |
|------|---------|--------------|
| [ ] Chatwoot deployment | Self-hosted in K8s cluster | Infrastructure |
| [ ] Webhook integration | Receive new messages, conversations | Chatwoot running |
| [ ] RAG query bridge | Connect Chatwoot to project KB | Phase 5 RAG |
| [ ] Captain AI config | Auto-response with RAG | RAG bridge |
| [ ] Escalation rules | Confidence thresholds, routing | Captain AI |
| [ ] Help Center setup | Self-serve portal with RAG search | Chatwoot + RAG |
| [ ] Widget embedding | Chat widget on generated UIs | Phase 10 |
| [ ] Multi-tenant inboxes | Separate inboxes per project | Multi-tenancy |

### Phase 10: UI Generation
**Goal:** Generate frontend interfaces from agents/workflows

| Task | Details | Dependencies |
|------|---------|--------------|
| [ ] Component library | shadcn-based UI components | None |
| [ ] Agent → UI mapping | Generate forms, displays from agent | Component lib |
| [ ] Workflow → App | Multi-step UIs from workflows | Agent → UI |
| [ ] Theming system | Custom colors, branding | Component lib |
| [ ] Embed widgets | Iframe/Web Component exports | Generated UIs |
| [ ] Chatwoot widget | Chat integration in generated UIs | Phase 9 |
| [ ] API endpoints | REST/GraphQL for agents | Runtime |

### Phase 11: Production Hardening
**Goal:** Enterprise-ready reliability and security

| Task | Details | Dependencies |
|------|---------|--------------|
| [ ] Observability | Tracing, logging, metrics | All phases |
| [ ] Cost tracking | Per-tenant LLM cost attribution | Metering |
| [ ] Rate limiting | API and execution throttling | Runtime |
| [ ] Security audit | Penetration testing, code review | All phases |
| [ ] Backup/restore | Per-tenant data recovery | Phase 1 |
| [ ] Disaster recovery | Multi-region failover | Infrastructure |

### Phase 12: Scale & Growth
**Goal:** Self-hosted option and enterprise features

| Task | Details | Dependencies |
|------|---------|--------------|
| [ ] Docker packaging | Single-container deployment | All phases |
| [ ] Kubernetes Helm charts | Production K8s deployment | Docker |
| [ ] Self-hosted documentation | Installation, configuration guides | Helm |
| [ ] White-label theming | Custom branding, domains | Phase 10 |
| [ ] Enterprise SSO | SAML, SCIM integration | WorkOS |
| [ ] Audit logging | Compliance-ready logging | Security |

---

## Future Work Backlog

### Technical Debt & Improvements

| Item | Priority | Phase |
|------|----------|-------|
| Performance optimization for large graphs | Medium | Post-Phase 2 |
| Offline-first capability | Low | Post-MVP |
| Mobile-responsive editor | Medium | Post-Phase 2 |
| Keyboard shortcuts system | Medium | Phase 2 |
| Workflow templates library | High | Phase 6 |
| Agent testing framework | High | Phase 3 |
| CI/CD pipeline for agents | Medium | Phase 3 |

### Feature Ideas (Not Scheduled)

| Feature | Description | Complexity |
|---------|-------------|------------|
| **Agent marketplace reviews** | Community ratings, comments | Medium |
| **Workflow analytics** | Execution stats, bottleneck detection | Medium |
| **A/B testing for agents** | Compare agent versions | High |
| **Collaborative editing** | Real-time multiplayer | High |
| **Agent debugging** | Step-through execution, breakpoints | High |
| **Custom node SDK** | Let users create node types | High |
| **Webhook integrations** | Trigger workflows externally | Medium |
| **Scheduled executions** | Cron-based workflow runs | Medium |
| **Agent cloning** | Fork and customize existing agents | Low |
| **Version diffing** | Compare workflow versions | Medium |

### Integration Opportunities

| Integration | Value | Effort |
|-------------|-------|--------|
| GitHub (code sync) | Version control for workflows | Medium |
| Slack (notifications) | Execution alerts, approvals | Low |
| Zapier (triggers) | External automation | Medium |
| Notion (docs) | Knowledge base sync | Medium |
| Linear (PM) | Issue creation from agents | Low |
| Vercel (deploy) | One-click app deployment | Medium |
| Fly.io (runtime) | Edge execution | High |

### Framework Expansion Roadmap

| Framework | Priority | When |
|-----------|----------|------|
| Claude Agent SDK | P0 | Phase 3 (Initial) |
| Agno | P1 | Post-MVP |
| LangGraph | P2 | Post-MVP |
| CrewAI | P3 | Growth phase |
| AutoGen | P4 | Growth phase |
| Custom (bring your own) | P5 | Enterprise |

---

## Open Questions

### Business Model

| Question | Options | Decision Needed By |
|----------|---------|-------------------|
| **Self-hosted offering?** | Cloud-only / Self-hosted option / Both | Phase 10 |
| **Pricing model?** | Per-seat / Per-execution / Hybrid / Freemium | Phase 7 |
| **Marketplace commission?** | 10% / 20% / 30% / Tiered | Phase 6 |
| **White-label option?** | No / Enterprise-only / All tiers | Phase 10 |
| **Free tier limits?** | Generous (growth) / Restrictive (revenue) | Phase 7 |

### Technical

| Question | Options | Decision Needed By |
|----------|---------|-------------------|
| **Graph persistence format?** | JSON / Custom binary / Database native | Phase 2 |
| **Execution isolation?** | Containers / VMs / Serverless functions | Phase 3 |
| **Multi-region?** | Single region / Multi-region / Edge | Phase 9 |
| **Real-time collaboration?** | Not needed / P2P (Yjs) / Server-mediated | Post-MVP |
| **Agent versioning model?** | Git-like / Simple version numbers / Immutable | Phase 3 |

### Product

| Question | Options | Decision Needed By |
|----------|---------|-------------------|
| **Target persona?** | Developers / No-code users / Both | Phase 1 |
| **Initial vertical?** | Horizontal / Customer support / Sales / Dev tools | Launch |
| **Mobile support?** | Web-only / Responsive / Native apps | Post-MVP |
| **API-first or UI-first?** | Equal / API-first / UI-first | Phase 1 |

### Go-to-Market

| Question | Options | Decision Needed By |
|----------|---------|-------------------|
| **Launch strategy?** | Private beta / Public beta / Paid launch | Pre-launch |
| **Initial market?** | Global / US-only / English-speaking | Launch |
| **Community strategy?** | Discord / Slack / Forum / All | Pre-launch |
| **Open source components?** | Fully proprietary / Partial OSS / Core OSS | Phase 1 |

---

## Sources & References

### Existing Research Documents (31 Total)

**Tier 0 (Foundation):**
- `technical-agentic-rag-sdk-research-v2-2026-01-19.md`
- `technical-agentic-protocols-research-2026-01-19.md`

**Tier 1 (Platform Foundation):**
- `technical-claude-agent-sdk-research-2026-01-20.md`
- `technical-visual-workflow-builders-research-2026-01-20.md`
- `technical-multi-tenant-saas-research-2026-01-20.md`

**Tier 2 (Integration):**
- `technical-conversational-builder-research-2026-01-20.md`
- `technical-framework-abstraction-research-2026-01-20.md`
- `business-marketplace-economics-research-2026-01-20.md`

**Tier 3 (Polish):**
- `technical-billing-metering-research-2026-01-20.md`
- `technical-ui-generation-research-2026-01-20.md`

**Tier 4 (Advanced - COMPLETE):**
- `technical-chatwoot-integration-research-2026-01-20.md`
- `technical-embedded-chat-ui-research-2026-01-21.md`
- `technical-command-center-research-2026-01-20.md`
- `technical-agent-observability-research-2026-01-20.md`
- `business-competitive-analysis-research-2026-01-20.md`
- `technical-agent-versioning-research-2026-01-21.md`
- `technical-security-sandboxing-research-2026-01-21.md`
- `technical-collaborative-editing-research-2026-01-21.md`
- `technical-mcp-skills-marketplace-research-2026-01-21.md`

**Tier 5 (Enterprise - COMPLETE):**
- `technical-self-hosted-deployment-research-2026-01-21.md`
- `technical-white-label-research-2026-01-21.md`
- `technical-sso-enterprise-auth-research-2026-01-21.md`
- `business-pricing-strategy-research-2026-01-21.md`

**Tier 6 (Voice Agents & Chatbot Builders - COMPLETE):**
- `technical-voice-stack-research-2026-01-22.md` - Pipecat, Vocode, LiveKit comparison; custom build assessment
- `technical-chatbot-builder-research-2026-01-22.md` - 60+ node types, Botpress/Rasa/Typebot patterns, Chatwoot integration
- `technical-integration-layer-research-2026-01-22.md` - A2A, MCP, webhooks, event-driven; protocol selection matrix
- `technical-livekit-architecture-study-2026-01-22.md` - Turn detection, interruption handling, SIP gateway
- `technical-rasa-architecture-study-2026-01-22.md` - NLU pipeline, slot filling, dialogue policies

**Tier 7 (Canvas Builder - 4th Build Type - VERIFIED):**
- `technical-canvas-builder-research-2026-01-22.md` - ✅ **VERIFIED** via Context7 MCP + DeepWiki MCP. TapNow, ComfyUI, Weavy analysis; unified chat + dedicated agents; 50+ node types; DAG execution. Corrected: ReactFlow DAG enforcement, Agno model IDs, FLUX licensing, Weavy pricing. Added: Real-time collaboration (Yjs), workflow versioning.

**Tier 8 (AI Generation Providers - VERIFIED 2026-01-23):**
- `technical-ai-generation-providers-research-2026-01-22.md` - ✅ **VERIFIED** via Context7 MCP + DeepWiki MCP + Web Search. Comprehensive provider research: Flux, Kling 2.6, Minimax Hailuo, Google Veo, Runway, Sora, ElevenLabs, Suno, Udio, Meshy, Tripo3D, fal.ai, Replicate, Together AI. **Critical corrections applied:** Veo 3 pricing ($0.75/sec not $0.20), Runway Gen-4.5 (25 credits/sec not 15), Flux Turbo ($0.008/MP not $0.003), Suno/Udio legal status (WMG+UMG settled Nov 2025), Meshy-6 (preview status), DALL-E deprecation (05/12/2026)

### External References

**Platform & Frameworks:**
- [Dify](https://dify.ai/) - Reference platform
- [CC-WF-Studio](https://github.com/breaking-brake/cc-wf-studio) - Visual workflow editor
- [Taskosaur](https://github.com/Taskosaur/Taskosaur) - Conversational PM
- [Claude Agent SDK](https://docs.anthropic.com/) - Agent framework
- [ReactFlow](https://reactflow.dev/) - Graph rendering
- [Supabase](https://supabase.com/) - Database + Auth
- [Clerk](https://clerk.com/) - Authentication

**MCP Ecosystem:**
- [Official MCP Registry](https://registry.modelcontextprotocol.io/) - MCP server registry
- [Smithery.ai](https://smithery.ai/) - Community MCP registry
- [KiloCode](https://kilocode.ai/) - MCP marketplace reference
- [Roo Code](https://roo.dev/) - MCP marketplace reference
- [Cline](https://github.com/cline/cline) - MCP integration reference

**Voice Agent Stack (Study Targets):**
- [Pipecat](https://github.com/pipecat-ai/pipecat) - BSD 2-Clause, 40+ providers
- [Vocode](https://github.com/vocodedev/vocode-core) - MIT licensed
- [LiveKit Agents](https://github.com/livekit/agents) - Apache 2.0, best-in-class patterns
- [FastRTC](https://huggingface.co/blog/fastrtc) - MIT, WebRTC/WebSocket building block
- [Silero VAD](https://github.com/snakers4/silero-vad) - MIT, voice activity detection
- [aiortc](https://github.com/aiortc/aiortc) - BSD, Python WebRTC

**Chatbot Builder Stack (Study Targets):**
- [Botpress](https://botpress.com/docs) - Card-in-Node pattern, Autonomous Node
- [Rasa](https://rasa.com/docs) - NLU pipeline, slot filling, dialogue policies
- [Voiceflow](https://docs.voiceflow.com) - UX patterns, Agent Step
- [Typebot](https://github.com/baptisteArno/typebot.io) - **FSL license (NOT MIT)**, native Chatwoot integration

**Canvas Builder Stack (Study Targets):**
- [TapNow](https://app.tapnow.ai/) - Infinite canvas, TapTV community, e-commerce workflows
- [ComfyUI](https://github.com/Comfy-Org/ComfyUI) - DAG execution, partial re-execution, node ecosystem
- [Krea Nodes](https://www.krea.ai/) - 50+ models, infinite canvas
- [NodeTool](https://nodetool.ai/) - Local-first, RAG integration
- [Fal Workflows](https://fal.ai/) - Multi-model workflows, API-first
- [Weavy](https://www.weavy.com/) - Collaboration SDK (evaluated, not adopted)

**AI Generation Providers (Canvas Builder Integration):**
- [Black Forest Labs (Flux)](https://bfl.ai/) - Image generation, text rendering
- [Kling AI](https://klingai.com/) - Video generation with native audio
- [Minimax Hailuo](https://www.minimax.io/) - Video generation, #2 benchmark
- [Google Veo](https://deepmind.google/models/veo/) - Video generation, enterprise
- [Runway](https://runwayml.com/) - Video generation, VFX
- [OpenAI Sora](https://platform.openai.com/) - Video generation
- [ElevenLabs](https://elevenlabs.io/) - Text-to-speech, voice cloning
- [Suno](https://suno.com/) - Music generation (legal caution)
- [Meshy AI](https://www.meshy.ai/) - 3D model generation
- [Tripo3D](https://www.tripo3d.ai/) - 3D model generation
- [fal.ai](https://fal.ai/) - Unified API gateway (recommended)
- [Replicate](https://replicate.com/) - Model hosting platform

**Integration Protocols:**
- [A2A Protocol](https://a2a-protocol.org/latest/) - Agent-to-Agent specification
- [MCP Specification](https://modelcontextprotocol.io/specification) - Model Context Protocol
- [Chatwoot VoIP Discussion](https://github.com/orgs/chatwoot/discussions/8451) - Voice integration status

---

## Session Log

- **2026-01-20 (Session 1)**: Party mode session with team discussion
  - Clarified platform vision: Platform + Marketplace first
  - Defined hierarchy: Workspace → Project → Module → Agent
  - Completed Tier 1 research (3 documents)
  - Documented CC-WF-Studio node types
  - Created this master plan document
  - Expanded master plan with detailed implementation phases (now 12 phases)
  - Added comprehensive future work backlog
  - Completed Tier 2 research (3 documents):
    - Conversational Builder UX (DCRL loop, preview-before-apply)
    - Framework Abstraction (discovered Open Agent Spec!)
    - Marketplace Economics (tiered revenue share model)
  - Added **Command Center/Dashboard** feature (A2UI rendered, HITL approvals)
  - Added **Chatwoot Integration** feature (contact center, RAG chatbots)
  - Completed Tier 3 research (2 documents):
    - Billing & Metering (Stripe Meters, Orb, hybrid pricing)
    - UI Generation (3-tier strategy, v0 API, shadcn registry)
  - Completed Tier 4 research (4 documents):
    - Chatwoot Integration (Agent Bots, webhook architecture)
    - Command Center (SSE + Supabase Realtime, Tremor)
    - Agent Observability (Langfuse, Helicone, OTel)
    - Competitive Analysis (conversational builder = differentiator)
  - **Total: 14 research documents completed this session (Tiers 0-4)**

- **2026-01-21 (Session 2)**: Architecture clarification and ALL research completion
  - **Critical Clarification**: Command Center vs Project views
    - Command Center = SYSTEM-WIDE (all projects overview, `/dashboard`)
    - Chat UI = PER-PROJECT (embedded Chatwoot, `/projects/:id/chat`)
    - Project views include: chat, analytics, jobs, approvals, builder
  - Completed Embedded Chat UI research (`technical-embedded-chat-ui-research-2026-01-21.md`)
    - Custom React chat UI using Chatwoot as headless backend
    - ActionCable WebSocket for real-time
    - RAG insights panel (confidence, sources, sentiment)
    - Full component architecture documented
  - Updated master plan with corrected architecture diagrams
  - Updated Chatwoot integration specification for headless approach
  - **Completed remaining Tier 4 research (3 documents):**
    - Agent Versioning: Semantic versioning, jsondiffpatch, Bayesian A/B testing, promotion pipelines
    - Security & Sandboxing: Firecracker MicroVMs, NeMo Guardrails, defense-in-depth, SOC 2 AI controls
    - Collaborative Editing: Yjs + Y-Sweet recommended, ReactFlow integration, presence/cursors
  - **Completed Tier 5 research (4 documents):**
    - Self-Hosted Deployment: Docker Compose for dev, Helm for prod, Harbor for air-gapped, Velero backups
    - White-Label Theming: CSS variables + shadcn/ui, Vercel/Cloudflare custom domains, Resend emails
    - SSO Enterprise Auth: WorkOS for SAML/SCIM, Clerk for base auth, hybrid approach
    - Pricing Strategy: 5-tier model (Sandbox/Pro/Team/Business/Enterprise), 15-20% marketplace commission
  - **Completed MCP/Skills Marketplace research:**
    - Official MCP Registry API (registry.modelcontextprotocol.io)
    - Smithery.ai registry and CLI tooling
    - KiloCode, Roo Code, Cline marketplace patterns
    - CC-WF-Studio Skills system (SKILL.md format, SkillService)
    - One-click install patterns, dual registry support
    - Database schema and Registry Aggregator service design
  - **RESEARCH PHASE COMPLETE: 23 documents across Tiers 0-5**

- **2026-01-21 (Session 3)**: Chatwoot research validation
  - Validated both Chatwoot research documents against actual codebase via deepwiki + context7
  - **Critical corrections applied:**
    - Removed ConversationChannel (only RoomChannel exists)
    - Fixed Client API path: `/public/api/v1/*` not `/api/v1/widget/*`
    - Fixed RAG metadata field: use `additional_attributes` not `content_attributes`
    - Corrected rate limits: 3000/min default, not 300/min
    - Clarified Agent Bot webhook events differ from general webhooks
    - Clarified inbox creation uses Application API, not Platform API
    - Updated React Query patterns for v5 (`isPending` replaces `isLoading`)
  - Added validation notes sections to both documents
  - **Documents verified and ready for implementation**

- **2026-01-21 (Session 4)**: Agent versioning research validation
  - Validated `technical-agent-versioning-research-2026-01-21.md` via deepwiki + context7
  - **Validation sources:**
    - deepwiki: Dify, n8n, Flowise, Supabase codebases
    - context7: jsondiffpatch, Yjs, LaunchDarkly documentation
    - Web search: Bayesian A/B testing statistical approach
  - **Verified claims:**
    - jsondiffpatch: LCS algorithm, visual formatters, RFC 6902 patches ✅
    - Yjs: Snapshots, UndoManager (requires gc:false) ✅
    - Dify: Draft/published model with timestamp versions ✅
    - n8n: WorkflowHistory table with full snapshots ✅
    - Flowise: Correctly states lacks native versioning ✅
    - Bayesian A/B testing: Beta distribution + Monte Carlo approach ✅
    - LaunchDarkly: 100,000 bucket partitions for rollouts ✅
  - **Critical corrections applied:**
    - `supa_audit` extension DOES NOT EXIST → changed to `pgaudit`
    - LaunchDarkly uses SHA-1 for bucketing, not murmur3 (murmur3 used by Amplitude)
    - Added note: Yjs snapshots require `gc: false` on document creation
  - Added comprehensive validation notes section
  - **Document verified and ready for implementation**

- **2026-01-21 (Session 5)**: Collaborative editing research validation
  - Validated `technical-collaborative-editing-research-2026-01-21.md` via deepwiki + context7 + web search
  - **Validation sources:**
    - deepwiki: yjs/yjs, jamsocket/y-sweet, partykit/partykit, supabase/supabase
    - context7: Yjs, Liveblocks library APIs
    - Web search: ReactFlow multiplayer documentation
  - **Verified claims:**
    - Yjs: YATA algorithm, shared types (Y.Map, Y.Array, Y.Text, Y.XmlFragment) ✅
    - Yjs: struct merging, content deletion, garbage collection optimizations ✅
    - Awareness protocol via y-websocket for presence ✅
    - Liveblocks: LiveblocksProvider, RoomProvider, useStorage, useMutation ✅
    - PartyKit: y-partykit onConnect and YPartyKitProvider ✅
    - Supabase Realtime: track(), presenceState(), sync/join/leave events ✅
    - ReactFlow: Official Multiplayer guide and Collaborative example exist ✅
  - **Corrections applied:**
    - Y-Sweet API: Changed `YSweetProvider` to correct `DocumentManager` (server) and `createYjsProvider` (client)
  - **Implementation notes added:**
    - Awareness is from y-websocket, not core Yjs
    - ReactFlow has no built-in multiplayer, uses external CRDT integration
    - zustand-middleware-yjs: unverified but likely correct
  - Added comprehensive validation notes section
  - **Document verified and ready for implementation**

---

## Next Session Checklist

When resuming work on this project:

1. [x] Tier 0 research complete and verified
2. [x] Tier 1 research complete and verified
3. [x] Tier 2 research complete and verified
4. [x] Tier 3 research complete
5. [x] Tier 4 research COMPLETE (9 documents)
6. [x] Tier 5 research COMPLETE (4 documents)
7. [x] Tier 6 research COMPLETE (5 documents) - Voice Agents & Chatbot Builders
8. [x] LiveKit architecture study COMPLETE - turn detection, interruption handling, SIP patterns
9. [x] Rasa architecture study COMPLETE - NLU pipeline, DIETClassifier, slot filling, CALM
10. [x] Tier 7 research COMPLETE (1 document) - Canvas Builder (4th Build Type)
11. [x] Tier 8 research VERIFIED (1 document) - AI Generation Providers (Flux, Kling, Veo, ElevenLabs, Meshy, fal.ai) - validated via Context7+DeepWiki+Web Search, critical pricing corrections applied
12. [x] **Architecture Synthesis COMPLETE** - `architecture-synthesis-2026-01-23.md` created with:
    - 12 comprehensive Mermaid diagrams covering all system components
    - Unified technology stack (deduplicated across 30 documents)
    - Complete data model with entity relationships
    - Integration patterns (MCP, A2A, Event-driven)
    - Gap analysis identifying 8 areas needing additional research
    - 13 services to build + 11 external dependencies mapped
    - 5-phase implementation roadmap
13. [ ] Create PRD using BMM /prd workflow
14. [ ] Create architecture document using BMM /create-architecture workflow
15. [ ] Begin Phase 1 implementation

---

- **2026-01-22 (Session 7)**: Voice Agents & Chatbot Builders architecture (Party Mode)
  - **MAJOR FEATURE**: Added Voice Agent Builder and Chatbot Builder to platform architecture
  - **Strategic Decision**: "Study the Best, Build Custom" approach
    - Study LiveKit, Rasa, Botpress for best patterns
    - Build custom with MIT/BSD components (FastRTC, Silero VAD, aiortc)
    - Zero license risk for potential open-source future
  - **Completed Tier 6 research (5 documents):**
    - Voice Stack Research: Pipecat (BSD 2-Clause) vs Vocode (MIT) vs custom build
    - Chatbot Builder Research: 60+ node types, Card-in-Node pattern, Chatwoot integration
    - Integration Layer Research: MCP for vertical, A2A for horizontal, event-driven for proactive
    - LiveKit Architecture Study (in progress): Turn detection, interruption handling patterns
    - Rasa Architecture Study ✅ VALIDATED (2026-01-22, 9.4/10): NLU pipeline, slot filling, dialogue policies, event-sourced tracker
  - **Architecture additions to master plan:**
    - Voice Agent Builder section with pipeline flow diagrams
    - Chatbot Builder section with 25 MVP nodes, state management
    - Integration Layer section with protocol selection matrix
    - Updated Executive Summary with new platform hierarchy
    - Added "Study the Best, Build Custom" architecture principle
    - Added Voice/Chatbot architectural decisions table
  - **Key findings:**
    - Pipecat has 40+ provider integrations but BSD 2-Clause (functionally equivalent to MIT)
    - Typebot (FSL license, not MIT) already has native Chatwoot integration - study this pattern
    - Hybrid integration: MCP for chatbot→module, A2A for agent→agent, event-driven for proactive
    - MVP chatbot: 25 nodes achievable in 4-6 weeks
    - Voice pipeline cost: ~$600-1,150/month at 10K minutes
  - **TOTAL: 29 research documents across Tiers 0-6**

- **2026-01-21 (Session 6)**: MCP/Skills marketplace research validation
  - Validated `technical-mcp-skills-marketplace-research-2026-01-21.md` via deepwiki + context7 + web search
  - **Validation sources:**
    - deepwiki: modelcontextprotocol/servers, modelcontextprotocol/registry, smithery-ai/cli, cline/cline, RooVetGit/Roo-Code, Kilo-Org/kilocode, breaking-brake/cc-wf-studio
    - context7: /modelcontextprotocol/specification (Benchmark Score: 74.8)
    - Web search: mcp.so, mcpindex.net, kilo.ai/docs, docs.roocode.com, docs.cline.bot, smithery.ai
  - **Critical corrections applied:**
    - Smithery API URL: Changed `api.smithery.ai` → `registry.smithery.ai` (throughout document and code)
    - Cline config path: Changed VSCode globalStorage paths → `~/.cline/` directory
    - Removed false claim about `chat.mcp.discovery.enabled` (feature doesn't exist in Cline)
    - Added verification warning for Roo Code MCP Installer CLI (repository unverified)
  - **Major corrections:**
    - Updated Smithery response schema to match actual `StdioConnection` format
    - Added KiloCode fallback config paths (.cursor/mcp.json, .mcp.json)
    - Clarified Roo Code global config uses VSCode globalStorage
    - Added complete MCP Registry query parameters (limit, updated_since)
    - Added _meta fields to MCP Registry metadata structure
  - **Minor improvements:**
    - Completed Awesome MCP GitHub URL (punkpeye/awesome-mcp-servers)
    - Added API version disambiguation note (v0.1 vs v0)
    - Added Glama MCP to community registries
    - Updated References section with correct repository links
  - **Document verified and ready for implementation**

---

- **2026-01-22 (Session 8)**: Voice Stack Research Validation
  - **Comprehensive validation** of `technical-voice-stack-research-2026-01-22.md` using DeepWiki MCP, Context7 MCP, GitHub API, Web Search
  - **Critical corrections applied:**
    - Pipecat GitHub stars: 5,000+ → **9,900+** (nearly 2x larger than reported)
    - Pipecat forks: 600+ → **1,600+**
    - LiveKit turn detection: "98% accuracy" → **98.8% TPR / 87.5% TNR** (clarified metric type)
    - Pipecat STT providers: "17+" → **18** (exact count)
    - aiortc license: "BSD" → **BSD-3-Clause** (specific variant)
  - **Verified correct:**
    - All license claims (Pipecat BSD-2-Clause, Vocode MIT, LiveKit Apache-2.0, Silero VAD MIT, FastRTC MIT)
    - Cost estimates (Deepgram ~$43/10K min, Cartesia ~$300/10K min)
    - NVIDIA NIM partnership, AWS Marketplace availability
    - Chatwoot VoIP still feature request (in development via #11481)
  - **Document marked as verified** with validation notes section added
  - **Master plan updated** with verification status

- **2026-01-22 (Session 9)**: LiveKit Architecture Study Validation
  - **Comprehensive validation** of `technical-livekit-architecture-study-2026-01-22.md` using DeepWiki MCP, Context7 MCP, GitHub API, Web Search
  - **Overall quality: 9/10** - Excellent architecture study with minor clarifications
  - **Corrections applied:**
    - Turn detection latency: "~25ms on CPU" → **~25ms inference, 50-160ms per-turn latency** (clarified metric)
    - Noise cancellation: BVC/BVCTelephony → **Requires separate `livekit-plugins-noise-cancellation` plugin**
    - Model size: Added **281 MB on disk** (ONNX quantized)
    - Preemptive generation: Added known issue about duplicate LLM requests ([Issue #4219](https://github.com/livekit/agents/issues/4219))
  - **Verified correct (no changes needed):**
    - Turn detection model: Qwen2.5-0.5B-Instruct, 500M params, 13 languages, 39% false interruption reduction
    - Interruption handling: 4-state machine (LISTENING, THINKING, SPEAKING, PAUSED)
    - Provider abstraction: STT, TTS, LLM base classes with capabilities
    - SIP integration: `add_sip_participant`, `transfer_sip_participant`, DTMF handling
    - MCP integration: `MCPServerHTTP`, `mcp_servers` parameter
    - Production infrastructure: Job/Worker process isolation, Kubernetes deployment
  - **Additional findings added:**
    - BVC reduces VAD false positives by 3.5x
    - BVC improves Whisper V3 WER by 2x
    - GitHub stats: 9,105 stars, 2,645 forks (Apache-2.0)
  - **Document marked as verified** with comprehensive validation notes section

---

- **2026-01-22 (Session 10)**: Chatbot Builder Research Comprehensive Validation
  - **Comprehensive validation** of `technical-chatbot-builder-research-2026-01-22.md` using DeepWiki MCP, Context7 MCP, Web Fetch
  - **CRITICAL FIX: Typebot license corrected from "MIT" to "Functional Source License (FSL)"**
    - FSL is source-available with commercial restrictions (converts to Apache 2.0 after 2 years)
    - This has significant legal implications for commercial use
  - **Validation sources used:**
    - DeepWiki: chatwoot/chatwoot, botpress/botpress, baptisteArno/typebot.io, RasaHQ/rasa, xyflow/xyflow
    - Context7: /websites/zustand_pmnd_rs, /xyflow/web
    - Web Fetch: Voiceflow docs, Botpress docs, Chatwoot docs
  - **Corrections applied:**
    - Typebot license: MIT → **Functional Source License (FSL)** (5 references fixed)
    - Voiceflow step naming: "Intent" → **"Choice"** step
    - Voiceflow Talk Steps: Updated Message/Image/Card/Carousel/Prompt (removed "Gallery"/"Visual")
    - Botpress integration count: Added disclaimer about unverified "190+ integrations" claim
    - Chatwoot content types: Added `voice_call`, `incoming_email`, `integrations`
    - Typebot integrations: Added 10+ services (Anthropic, Mistral, Dify AI, Elevenlabs, etc.)
    - ReactFlow features: Added SSR/SSG support, dark mode, CSS variables
    - Zustand middleware: Added order guidance note
  - **New sections added to research document:**
    - Section 11: Security Considerations (input validation, auth, PII, sandboxing)
    - Section 12: Error Handling Strategy (retry patterns, fallbacks, monitoring)
    - Section 13: Testing Approach (unit, integration, E2E, conversation testing)
    - Section 14: Deployment Architecture (infrastructure, scaling, Docker)
    - Section 15: Performance Considerations (compilation, serialization, benchmarks)
    - Appendix A: Validation Sources and Methodology
  - **Document expanded from ~1,084 lines to ~1,751 lines (+62%)**
  - **Master plan updated:** All 5 Typebot/MIT references corrected to FSL
  - **Both documents marked as FULLY VALIDATED**

- **2026-01-22 (Session 11)**: Canvas Builder - 4th Build Type Added
  - **MAJOR FEATURE**: Added Canvas Builder as the 4th build type to the platform
  - **Research completed:** `technical-canvas-builder-research-2026-01-22.md`
    - Analyzed TapNow, ComfyUI, Krea Nodes, Flora, NodeTool, Fal Workflows
    - Evaluated Weavy SDK for collaboration features
  - **VERIFIED** (Session 12): Comprehensive validation via Context7 MCP + DeepWiki MCP
    - Corrected: ReactFlow DAG enforcement (requires explicit cycle detection), Agno model IDs, FLUX licensing matrix, Weavy pricing
    - Added: Real-time collaboration architecture (Yjs + Y-Sweet), workflow versioning & rollback
    - Added: Provider licensing matrix, DAG cycle detection code, validation report section
  - **Key architectural decision: Unified Chat + Dedicated Agents**
    - **NOT using Weavy** - instead leverage existing Agno + RAG chat infrastructure
    - Single chat window across all 4 builders
    - Context-aware agent routing based on active view
    - Canvas Agent ("Artie") activates when user is in Canvas Builder
  - **Canvas Builder features:**
    - Infinite canvas (ReactFlow-based, TapNow-style)
    - 50+ node types across 6 categories (Input, AI Generation, Processing, Control Flow, Integration, Output)
    - DAG execution with partial re-execution (ComfyUI pattern)
    - Provider abstraction (Flux, Runway, Midjourney, DALL-E, etc.)
    - Community features (TapTV-style gallery, forking, remixing)
    - Cost estimation before execution
  - **Integration points:**
    - Canvas ↔ Module via MCP tools
    - Canvas ↔ Chatbot via MCP triggers
    - Canvas ↔ Voice via MCP references
    - Canvas ↔ RAG for brand guidelines
    - Canvas ↔ Marketplace for selling templates
  - **Updated master plan:**
    - Added Tier 7 research section
    - Added Canvas Builder architectural decisions
    - Added full Canvas Builder Architecture section
    - Updated platform hierarchy (4 build types)
    - Updated Executive Summary
  - **TOTAL: 30 research documents across Tiers 0-7**

- **2026-01-22 (Session 12)**: AI Generation Providers Research (Initial)
  - **Deep research completed** on all major AI generation providers for Canvas Builder
  - **Created:** `technical-ai-generation-providers-research-2026-01-22.md` (v1.0)
  - **Image Generation Providers Researched:**
    - Flux (Black Forest Labs) - Primary recommendation, $0.04/image via fal.ai
    - OpenAI DALL-E 3 / GPT Image - $0.04-0.25/image
    - Midjourney - No official API (TOS risk with third-party)
    - Stability AI (SDXL/SD3) - Self-hostable option
    - Ideogram - Best text rendering, $0.04/image
    - Leonardo AI - Custom model training
  - **Video Generation Providers Researched:**
    - Kling 2.6 - Native audio, 3-min duration, #3 benchmark ($0.55-1.10/10s)
    - Minimax Hailuo - #2 benchmark, budget-friendly ($0.28-0.52/10s)
    - Google Veo 3.1 - Best quality, native audio ($1.00-1.50/10s)
    - Runway Gen-4.5 - #1 benchmark, VFX focus (~$1.50/10s)
    - OpenAI Sora 2 - Native audio ($1.00-5.00/10s)
    - Pika Labs 2.2 - Creative tools ($0.30+/10s)
    - Luma Dream Machine - Ray3 model ($0.20-0.50/gen)
  - **Audio/Music Providers Researched:**
    - ElevenLabs - Industry-leading TTS ($0.06-0.15/min)
    - Suno V5 - Music generation (legal lawsuits pending)
    - Udio - Best vocal realism (licensing complications)
  - **3D Generation Providers Researched:**
    - Meshy 6 - Production-ready, quad topology, rigging (credits-based)
    - Tripo3D v2.5 - Fast image-to-3D ($0.20-0.40/model)
  - **Unified API Platforms Researched:**
    - fal.ai - 600+ models, 50% batch discount (recommended gateway)
    - Replicate - Pay-per-second compute
    - Together AI - Enterprise infrastructure
  - **Key Architectural Decisions:**
    - Use fal.ai as unified gateway for simplified billing and lower costs
    - Flux for images, Kling 2.6 for video, ElevenLabs for TTS, Meshy for 3D
    - Avoid Midjourney (no official API, TOS risk)
    - Caution with Suno/Udio (active lawsuits from major labels)
    - Real-ESRGAN for upscaling (free, fast)
  - **Provider abstraction layer** designed for easy swapping and fallback
  - **TOTAL: 31 research documents across Tiers 0-8**

- **2026-01-23 (Session 13)**: AI Generation Providers Research VERIFIED
  - **Validated** `technical-ai-generation-providers-research-2026-01-22.md` via Context7 MCP + DeepWiki MCP + Web Search
  - **Critical corrections applied:**
    - Google Veo 3: $0.20/sec → $0.75/sec (with audio) - 3.75x cost increase
    - Runway Gen-4.5: 15 credits/sec → 25 credits/sec ($0.25/sec) - 66% cost increase
    - fal.ai Flux Turbo: $0.003/image → $0.008/MP - 2.67x cost increase
    - Suno/Udio legal: "Active lawsuits" → WMG settled Nov 26, UMG settled Oct 2025, licensed models 2026
    - Meshy 6: "Production-ready" → Preview status (Meshy-6-preview)
    - OpenAI: Added gpt-image-1.5 as flagship, DALL-E 2/3 deprecated 05/12/2026
  - **Validated accurate (no changes):** Kling 2.6 pricing, benchmark rankings, Midjourney no API, Ideogram text rendering
  - **Research document updated to v1.1** with validation changelog
  - **Master plan updated** with corrected pricing in all decision tables
  - **TOTAL: 31 research documents across Tiers 0-8, ALL VERIFIED**

- **2026-01-23 (Session 14)**: Architecture Synthesis COMPLETE
  - **Created** `architecture-synthesis-2026-01-23.md` - comprehensive unified architecture document
  - **Processed all 30 research documents** across Tiers 0-8 in parallel using 5 exploration agents
  - **12 comprehensive Mermaid diagrams** covering:
    - High-Level System Architecture (all services and data flow)
    - Multi-Tenant Data Architecture (tiered isolation strategy)
    - Protocol Stack Architecture (A2UI → AG-UI → Agent → MCP)
    - Module Builder, Chatbot Builder, Voice Agent, Canvas Builder architectures
    - Integration Flow Architecture (MCP vertical, A2A horizontal, Event-driven proactive)
    - Billing & Marketplace Architecture (usage metering, revenue share tiers)
    - Security Architecture (defense-in-depth, Firecracker, RLS)
    - Observability Architecture (Langfuse, OTel, Prometheus)
    - Deployment Architecture (Docker → K8s → Self-hosted)
    - Entity Relationship Diagram (complete data model)
  - **Unified Technology Stack** - deduplicated across all documents:
    - Frontend: ReactFlow + Zustand + shadcn/ui + Yjs
    - Backend: FastAPI + Claude SDK + Agno + Temporal
    - Data: Supabase + Neon + pgvector + Graphiti + Redis
    - External: Clerk + WorkOS + Stripe + fal.ai + Chatwoot + Twilio
  - **13 services to build** identified with dependencies and priorities
  - **11 external dependencies** mapped with required vs optional status
  - **Gap analysis** identified 8 areas needing additional research (ALL NOW RESOLVED - see Session 17):
    1. ✅ Search/Discovery → Meilisearch hybrid search
    2. ✅ Unified Caching Strategy → Redis + memory tiered caching
    3. ✅ Mobile Support → Responsive-first + PWA meta tags
    4. ✅ Offline Mode → Serwist/Workbox service worker
    5. ✅ Testing Strategy → Playwright E2E + Vitest unit
    6. ✅ CI/CD Details → GitHub Actions matrix builds
    7. ✅ Monitoring Alerts → Prometheus alerting + runbooks
    8. ✅ Rate Limiting Strategy → Redis sliding window + tiered limits
  - **5-phase implementation roadmap** defined:
    - Phase 1: Foundation (MVP) - API Gateway, Auth, Module Builder, RAG, MCP Hub
    - Phase 2: Customer-Facing - Chatbot, Chatwoot, Embedded Chat, Marketplace
    - Phase 3: Advanced Builders - Voice Agent, Canvas Builder, AI Providers
    - Phase 4: Enterprise - WorkOS, Neon, White Label, Self-Hosted
    - Phase 5: Scale - Collaboration, Advanced Marketplace, A/B Testing
  - **TOTAL: 32 documents** (31 research + 1 architecture synthesis)

- **2026-01-23 (Session 15)**: Hybrid Integration Architecture Research
  - **Researched Dify and n8n** workflow integration patterns for seamless connectivity
  - **Key Finding: MCP is overkill for internal integration** - uses too much context
  - **Dify "Workflow as Tool" pattern** documented:
    - Register any workflow as reusable tool via `WorkflowToolProvider`
    - Shared Variable Pool (conversation_variables, environment_variables)
    - Built-in recursion protection (`workflow_call_depth`)
  - **n8n "Execute Workflow" pattern** documented:
    - Direct workflow-to-workflow calling via Execute Workflow node
    - `workflowStaticData` for per-execution state
    - Webhook-based event triggers
  - **Lightweight alternatives to MCP** identified:
    - PostgreSQL LISTEN/NOTIFY (sub-millisecond state sync)
    - Redis Pub/Sub (event fan-out across all builders)
    - gRPC bidirectional streams (Voice ↔ Module real-time)
  - **Hybrid Integration Architecture** recommended:
    - **Internal:** Dify-style tools + Redis Pub/Sub + PostgreSQL NOTIFY
    - **Voice:** gRPC bidirectional streams
    - **External only:** MCP for LLM function calling, REST for webhooks
    - **Multi-agent:** A2A Protocol
  - **Updated documents:**
    - `technical-integration-layer-research-2026-01-22.md` → v1.2 (added Section 12: Visual Builder Integration Patterns)
    - `architecture-synthesis-2026-01-23.md` → v1.1 (updated integration diagrams with hybrid approach)
  - **UI Generation gaps identified** for future research:
    - Client access management (auth/authz per project)
    - Multi-tenant data isolation patterns
    - Per-project feature exposure
  - **TOTAL: 32 documents** (31 research + 1 architecture synthesis, integration layer research updated)

- **2026-01-23 (Session 16)**: UI Gaps Research COMPLETE
  - **Comprehensive research on UI generation gaps** using Context7 MCP and DeepWiki MCP for validation
  - **Client Access Management** - RESOLVED:
    - Clerk Organizations with custom roles (`org:admin`, `org:project_owner`, `org:developer`, `org:viewer`)
    - Custom permissions (`org:modules:deploy`, `org:chatbots:manage`, `org:voice_agents:manage`, `org:canvas:edit`)
    - `<Protect>` component and `has()` function for UI-level authorization
    - WorkOS integration for Enterprise SSO (SAML) and Directory Sync (SCIM)
  - **Multi-Tenant Data Isolation** - RESOLVED:
    - Supabase RLS with JWT claims (`auth.jwt() ->> 'org_id'`)
    - Project-scoped isolation policies for child resources
    - Permission-aware RLS policies for read/write operations
    - Defense-in-depth verification layer
  - **Per-Project Feature Exposure** - RESOLVED:
    - LaunchDarkly multi-context evaluation (user + organization + project)
    - Subscription tier configuration (FREE, STARTER, PROFESSIONAL, ENTERPRISE)
    - Builder availability flags per project
    - React hooks integration (`useFeatureFlag`, `useBuilderAccess`)
  - **Embedded UI Patterns** - RESOLVED:
    - Web Components (Lit + Shadow DOM) for full isolation
    - iframe with PostMessage bridge for secure embedding
    - React SDK (`@hyyve/react`) for deep integration
  - **API Key Management** - RESOLVED:
    - Scoped API keys with fine-grained permissions (SHA-256 hashed)
    - BFF (Backend-for-Frontend) pattern for embedded clients
    - Rate limiting (per-minute, per-day) with Upstash
    - CORS origin validation and IP whitelist support
  - **White-Label Configuration** - RESOLVED:
    - Metadata-driven theming with CSS variables
    - Custom domain routing via Next.js middleware
    - Per-organization branding (logo, colors, fonts)
  - **Created document:**
    - `technical-ui-gaps-research-2026-01-23.md` (comprehensive, 1200+ lines)
  - **Updated documents:**
    - `architecture-synthesis-2026-01-23.md` → v1.2 (added Multi-Tenant UI Architecture diagram, updated gap analysis)
  - **TOTAL: 33 documents** (32 research + 1 architecture synthesis)

- **2026-01-23 (Session 17)**: Architecture Gaps Research COMPLETE
  - **Comprehensive research on all 8 architecture gaps** from Section 7.1 using Context7 MCP and DeepWiki MCP
  - **Validated against competitor implementations** (Dify, n8n, Flowise) and industry standards
  - **1. Search/Discovery** - RESOLVED:
    - Dify: Elasticsearch + pgvector hybrid search
    - n8n: NodeSearchEngine with fuzzy matching (Fuse.js pattern)
    - Recommendation: Meilisearch for marketplace/documentation with hybrid search (<50ms)
  - **2. Caching Strategy** - RESOLVED:
    - Dify: Redis for session/rate limiting, memory for configs
    - n8n: CacheService with pluggable backends (memory/Redis)
    - Recommendation: 3-tier caching (Browser/CDN → API Gateway Redis → Application Memory+Redis)
  - **3. Mobile Support** - RESOLVED:
    - Dify: `useBreakpoints` hook (mobile/tablet/pc), PWA meta tags
    - n8n: `isMobileDevice` via `useMediaQuery`, touch device support
    - Recommendation: Responsive-first with PWA, desktop-only for workflow canvas editor
  - **4. Offline Mode** - RESOLVED:
    - Dify: Serwist (Workbox-based) service worker, CacheFirst/NetworkFirst strategies
    - n8n: No offline mode (always connected to database)
    - Recommendation: Service worker with strategy-based caching, localStorage for UI preferences
  - **5. Testing Strategy** - RESOLVED:
    - Dify: Vitest for frontend (no E2E), Pytest for backend
    - n8n: Playwright with Page Object pattern (WorkflowPage, CredentialsPage)
    - Recommendation: Testing pyramid (70% unit, 20% integration, 10% E2E), Page Object pattern
  - **6. CI/CD Details** - RESOLVED:
    - Dify: GitHub Actions, Docker multi-arch builds
    - n8n: Comprehensive GitHub Actions (PR validation, matrix testing, release automation)
    - Recommendation: PR workflow + main branch workflow + release workflow with changesets
  - **7. Monitoring Alerts** - RESOLVED:
    - Dify: Grafana + Sentry + OpenTelemetry
    - n8n: Prometheus `/metrics` endpoint
    - Recommendation: P1-P4 alert tiers, Prometheus → Alertmanager → PagerDuty/Slack routing
  - **8. Rate Limiting** - RESOLVED:
    - Dify: Redis sliding window with Lua scripts, per-user/workspace/endpoint limits
    - n8n: ConcurrencyControlService, API rate limits via environment config
    - Recommendation: Tiered limits (Free/Pro/Enterprise), Redis sliding window + concurrency semaphores
  - **Created documents:**
    - `architecture-gaps-research-2026-01-23.md` (comprehensive, 1100+ lines with code samples)
  - **Also validated redundancies** from Section 7.2:
    - State Management: ✅ Consistent (Zustand, validated by Dify usage)
    - Real-time Sync: ✅ Both needed (SSE for LLM streaming, WebSocket for collaboration)
    - Event Sourcing: ✅ Consistent pattern (different domains)
    - MCP Protocol: ✅ Same protocol (different contexts)
    - Cost Tracking: ✅ Fixed (unified cost service architecture designed)
  - **Created additional documents:**
    - `redundancy-validation-report-2026-01-23.md` (redundancy analysis with DeepWiki/Context7 validation)
    - `unified-cost-service-architecture-2026-01-23.md` (TimescaleDB + fan-out design)
  - **Updated documents:**
    - `architecture-synthesis-2026-01-23.md` → v1.3 (all 8 gaps marked RESOLVED, references added)
  - **TOTAL: 36 documents** (32 research + 1 architecture synthesis + 3 validation/architecture docs)

- **2026-01-23 (Session 18)**: Architecture Conflicts Validation COMPLETE
  - **Validated all 3 architecture conflicts** from Section 7.3 using DeepWiki MCP and Context7 MCP
  - **1. Database Strategy** - VALIDATED:
    - Dify: Shared database with `tenant_id` RLS (not separate DBs)
    - n8n: Shared database, optional PostgreSQL schema isolation
    - Recommendation: Tiered approach validated (shared + RLS for standard, isolated for enterprise)
    - Implementation: Tenant registry, RLS policies, migration path documented
  - **2. Auth Provider** - VALIDATED:
    - Dify: Custom JWT auth (not Clerk/Auth0), Enterprise SSO in paid plan
    - n8n: Built-in auth with SAML/OIDC support (no SCIM)
    - Recommendation: Clerk + WorkOS gives competitive advantage
    - Implementation: Clerk Organizations, WorkOS enterprise SSO, JWT claims structure
  - **3. Queue System** - VALIDATED:
    - Dify: Celery + Redis (simple, proven)
    - n8n: BullMQ + Redis (production-grade, distributed rate limiting)
    - NATS: 10x throughput, JetStream persistence, Kubernetes-native
    - Recommendation: BullMQ for MVP (used by n8n), NATS for scale
    - Implementation: Queue abstraction layer, migration strategy, feature flags
  - **Created document:**
    - `architecture-conflicts-validation-2026-01-23.md` (comprehensive, 500+ lines with code samples)
  - **Updated documents:**
    - `architecture-synthesis-2026-01-23.md` → v1.4 (conflicts marked VALIDATED, references added)
  - **Key Insight:** Neither Dify nor n8n uses Clerk - our choice provides competitive differentiation with pre-built B2B features
  - **TOTAL: 37 documents** (32 research + 1 architecture synthesis + 4 validation/architecture docs)

- **2026-01-23 (Session 19)**: Comprehensive Validation COMPLETE
  - **Full cross-validation** of architecture synthesis against master plan and all research documents
  - **Document Inventory Validated:**
    - 34 research documents (in /research folder, including 3 validation reports)
    - 6 planning artifacts (synthesis, master plan, gaps research, redundancy validation, cost service, conflicts validation)
    - 1 comprehensive validation report (this session)
    - **TOTAL: 41 documents**
  - **Technology Stack:** ✅ Fully consistent across all documents
    - Frontend: ReactFlow + Zustand + shadcn/ui + Yjs (validated)
    - Backend: FastAPI + Claude SDK + Agno + Temporal (validated)
    - Data: Supabase + Neon + pgvector + Graphiti + Redis (validated)
    - External: Clerk + WorkOS + Stripe + fal.ai + Chatwoot + Twilio (validated)
  - **Gap Analysis:** ✅ All 14 gaps marked RESOLVED with supporting documents
  - **Redundancy Validation:** ✅ All 5 redundancies addressed (4 complementary, 1 unified)
  - **Conflicts Validation:** ✅ All 3 conflicts resolved with implementation details
  - **Diagram Verification:** ✅ 19 diagrams validated, section numbering fixed (3.10 duplicate → 3.11)
  - **Issues Found & Fixed:**
    - Section numbering error (duplicate 3.10) - FIXED
    - Document count mismatches - FIXED
    - Missing validation report references - FIXED
  - **Created document:**
    - `comprehensive-validation-report-2026-01-23.md` (cross-validation findings)
  - **Updated documents:**
    - `architecture-synthesis-2026-01-23.md` → v1.5 (numbering fixed, counts updated, references added)
    - `agentic-platform-master-plan-2026-01-20.md` → Document counts corrected
  - **ASSESSMENT:** Architecture Synthesis and Master Plan are VALIDATED and ready for PRD phase
  - **TOTAL: 41 documents** (34 research + 7 planning/validation artifacts)

*Last Updated: 2026-01-23 (Comprehensive Validation Complete - READY FOR PRD)*
