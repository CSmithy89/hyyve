---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional']
inputDocuments:
  - path: '_bmad-output/planning-artifacts/architecture-synthesis-2026-01-23.md'
    type: 'architecture'
    version: 'v1.5'
  - path: '_bmad-output/planning-artifacts/agentic-platform-master-plan-2026-01-20.md'
    type: 'master-plan'
  - path: '_bmad-output/planning-artifacts/comprehensive-validation-report-2026-01-23.md'
    type: 'validation'
  - path: '_bmad-output/planning-artifacts/research/technical-agentic-rag-sdk-research-v2-2026-01-19.md'
    type: 'research'
    focus: 'Agno framework, pgvector, Graphiti, RAG pipeline'
  - path: '_bmad-output/planning-artifacts/research/technical-claude-agent-sdk-research-2026-01-20.md'
    type: 'research'
    focus: 'Claude Agent SDK - first Module Builder export target'
documentCounts:
  briefs: 0
  research: 34
  architecture: 1
  validation: 1
  masterPlan: 1
  keyResearchLoaded: 2
workflowType: 'prd'

# Project Classification (Step 2)
classification:
  projectType: 'SaaS B2B Platform + Marketplace + Developer Tool + App Generator'
  domain: 'AI/ML Platform (Agent Orchestration, RAG, Visual Content, UI Generation)'
  complexity: 'very-high'
  projectContext: 'greenfield'

  # Four Build Types
  buildTypes:
    - name: 'Module Builder'
      purpose: 'Backend intelligence (BMB methodology)'
      nodeTypes: 'Prompt, Sub-Agent, MCP Tool, Control Flow'
      features: 'Code generation, framework export, Variable Pool'
    - name: 'Chatbot Builder'
      purpose: 'Customer-facing text'
      nodeTypes: '60+ nodes (25 MVP)'
      features: 'Rasa-style NLU, DIETClassifier, event-sourced tracker'
    - name: 'Voice Agent Builder'
      purpose: 'Customer-facing voice'
      nodeTypes: 'VoiceInput, VoiceOutput, VAD, Interruption, SSML'
      features: 'Turn detection (Qwen2.5-0.5B), 98.8% TPR'
    - name: 'Canvas Builder'
      purpose: 'Visual content generation'
      nodeTypes: '50+ nodes across 6 categories'
      features: 'DAG execution, partial re-execution, ComfyUI pattern'

  # Services to Build
  servicesToBuild: 13
  services:
    p0: ['API Gateway', 'Auth Service', 'Module Service', 'Chatbot Service', 'RAG Service', 'MCP Hub', 'Billing Service', 'Observability Service']
    p1: ['Voice Service', 'Canvas Service', 'Marketplace Service', 'Notification Service']
    p2: ['Collaboration Service']

  # External Dependencies
  externalDependencies: 11
  dependencies:
    required: ['Supabase', 'Redis', 'Clerk', 'Stripe', 'Chatwoot', 'Langfuse', 'Resend']
    enterpriseOnly: ['Neon', 'WorkOS']
    featureSpecific: ['Twilio (voice)', 'fal.ai (canvas)']

  # Protocol Stack
  protocolStack:
    ui: 'A2UI v0.8'
    transport: 'AG-UI (SSE + HTTP POST)'
    agent: 'Claude SDK + Agno'
    integration: 'MCP + A2A'

  # Integration Patterns
  integrationPatterns:
    internal: ['Dify-style Workflow as Tool', 'PostgreSQL LISTEN/NOTIFY', 'Redis Pub/Sub', 'gRPC Bidirectional']
    external: ['MCP (LLM tools only)', 'A2A (multi-agent)', 'REST Webhooks']

  # Technology Stack
  techStack:
    frontend: ['Next.js', 'React', 'ReactFlow', 'Zustand', 'CopilotKit', 'shadcn/ui', 'Yjs']
    backend: ['FastAPI/Node.js', 'Agno 2.4.0', 'Temporal', 'Redis Streams/NATS']
    data: ['Supabase (PostgreSQL+RLS)', 'Neon', 'pgvector', 'Graphiti', 'Redis', 'TimescaleDB', 'S3']
    auth: ['Clerk (consumer)', 'WorkOS (enterprise SSO)']
    payments: ['Stripe Billing', 'Stripe Connect']
    voice: ['FastRTC', 'Silero VAD', 'aiortc', 'Deepgram', 'Cartesia', 'Twilio']
    aiProviders: ['fal.ai gateway', 'Flux 2', 'Kling 2.6', 'ElevenLabs', 'Meshy 6']
    observability: ['Langfuse', 'Prometheus', 'OpenTelemetry']
    deployment: ['Docker', 'Kubernetes', 'Helm', 'Harbor', 'ArgoCD', 'Velero']

  # UI Generation
  uiGeneration:
    capabilities: ['Agent → UI', 'Workflow → App', 'White-Label', 'Embeds']
    tech: ['shadcn/ui', 'v0.dev', 'Web Components', 'tRPC', 'BFF Pattern']

  # Security
  security:
    sandbox: ['Firecracker MicroVMs', 'gVisor']
    promptProtection: 'NeMo Guardrails'
    compliance: ['SOC 2', 'GDPR', 'EU AI Act']

  # Marketplace
  marketplace:
    revenueShare: ['0% (new)', '15% (growing)', '12% (established)', '10% (premium)']
    payouts: 'Stripe Connect'

  # Framework Export
  frameworkExport:
    p0: 'Claude Agent SDK'
    p1: 'Agno'
    p2: 'LangGraph'
    p3: 'CrewAI'
    p4: 'AutoGen'
    p5: 'Custom (BYOF)'

  # Implementation Phases
  phases: 5
  phaseNames: ['Foundation (MVP)', 'Customer-Facing', 'Advanced Builders', 'Enterprise', 'Scale']

platformFramework: 'agno'
firstExportTarget: 'claude-agent-sdk'
ragStack:
  vector: 'pgvector'
  graph: 'graphiti'
  ingestion:
    web: 'crawl4ai'
    documents: 'docling'
---

# Product Requirements Document - Hyyve Platform

**Author:** Chris
**Date:** 2026-01-23
**Version:** 1.0
**Status:** In Progress

---

## Success Criteria

### User Success

**The "Aha!" Moment:**
- A solo entrepreneur realizes they can run their entire business from one platform - modules handling operations, chatbots/voice agents handling customer service, canvas workflows powering their media campaigns - all using their own data
- A creator realizes they can build ANY workflow through conversation, see it visualized in nodes, adjust it themselves or with chat, then run it immediately
- A user goes from "I need to buy an app for this" to "I'll just build it myself in 5 minutes"
- Users see their workflows generate UIs through natural language, making their creations accessible to others

**What "Done" Feels Like:**
- **Speed & Ease**: Users feel empowered by how quickly and easily they can create complex workflows
- **Ownership**: They can adjust and change anything themselves - no vendor lock-in
- **Creation to Monetization**: Build enough → Create UI → Show off → Sell access → Enjoy recurring revenue

**Time-to-Value Targets:**
- Sign-up to first running workflow: **< 5 minutes** (guided onboarding)
- First meaningful agent/chatbot deployed: **< 30 minutes**
- First UI generated from workflow: **< 1 hour**

### Business Success

**Market Context:**
- AI Agent Market: $7.84B (2025) → $52.62B by 2030 (46.3% CAGR)
- No-code AI: $4.77B (2025) → $37.96B by 2033 (29.6% CAGR)
- 80% of low-code users will be outside IT by 2026

**Competitive Differentiation:**
1. **Conversational Builder**: No competitor offers true conversational (non-visual) building
2. **Built-in Contact Center**: Chatwoot integration is unique in market
3. **Multi-Framework Export**: Most platforms locked to single framework
4. **BMB Methodology**: Structured approach vs. drag-and-drop chaos
5. **Four Integrated Builders**: Module + Chatbot + Voice + Canvas in one platform

**3-Month Success Indicators:**
- Beta users actively building workflows
- First marketplace listings published
- Positive feedback on conversational builder UX
- Platform stability proven

**12-Month Success Indicators:**
- Active paying customers
- Healthy marketplace with creators earning revenue
- Multiple framework exports working (Claude SDK + Agno)
- Enterprise pilot customers

**Marketplace Health Indicators:**
- Creator sign-ups and active sellers
- Gross Merchandise Value (GMV) growth
- Module/workflow install velocity
- Creator retention rate

**Pricing Model:**
- Hybrid: Base platform fee + usage components (executions, tokens, storage)
- Tiered marketplace commission: 0% (new) → 10-15% (established)
- Freemium target conversion: 5-10%

### Technical Success

**Performance Targets:**
- Conversational builder response: **Real-time** (matching CopilotKit/AG-UI benchmarks)
- Workflow execution start: **< 500ms**
- Voice agent latency: **< 200ms** end-to-end (STT → LLM → TTS)
- Canvas DAG node execution: **Real-time preview** with streaming

**Reliability:**
- **Uptime target: 99%** (99.9% for enterprise tier)
- Zero data loss (event-sourced, audit logged)
- Graceful degradation on AI provider failures (fallback providers)

**Scale (MVP → Year 1):**
- MVP: 100 concurrent users, 1,000 daily workflow executions
- Year 1: 10,000+ concurrent users, 100,000+ daily executions

### Measurable Outcomes

| Metric | MVP Target | Year 1 Target |
|--------|------------|---------------|
| Time to first workflow | < 5 min | < 3 min |
| Freemium → Paid conversion | 3% | 7% |
| Monthly Active Users | 500 | 10,000 |
| Marketplace Creators | 50 | 500 |
| Marketplace GMV | $10K/mo | $100K/mo |
| Platform Uptime | 99% | 99.5% |
| NPS Score | > 30 | > 50 |

---

## Product Scope

### Phase 1: Foundation (MVP)

#### Core Infrastructure
- API Gateway (Kong/Tyk) with auth middleware, rate limiting
- Auth Service: Clerk integration with Organizations
- Multi-tenant hierarchy: Organization → Workspace → Project
- Supabase (PostgreSQL + RLS) for shared tenants
- Redis for caching, pub/sub, sessions

#### Module Builder (Core)
- ReactFlow visual editor + Zustand state
- Conversational interface (CopilotKit + AG-UI)
- BMB Agents: Bond, Wendy, Morgan (see UI Agent Assignments below)
  - Note: For UI-level builder-to-agent mapping, see UX Design Specification Section 17.3
- Variable Pool (Dify-style pattern)
- Core node types: Prompt, LLM, Sub-Agent, Condition, Loop, HTTP
- Code generation for Claude Agent SDK (first export target)
- Workflow execution engine

#### Agno Framework Integration
- Agent orchestration (create, configure, run agents)
- Tools integration (function calling, MCP)
- Memory system (short-term conversation, long-term persistent)
- Model support (Claude, GPT-4, open-source via model IDs)
- Structured outputs and streaming

#### Protocol Stack
- **A2UI v0.8**: Declarative UI specification, agent → UI mapping
- **AG-UI**: SSE streaming + HTTP POST, 25 event types
- **CopilotKit**: Chat components, sidebar, actions, readable context

#### RAG Service
- **Vector Storage**: pgvector (embeddings, HNSW indexing, hybrid search)
- **Graph Storage**: Graphiti (entity relationships, temporal memory, knowledge graphs)
- **Document Ingestion**: Docling (PDF, DOCX, images, audio/ASR)
- **Web Ingestion**: Crawl4ai (JS rendering, adaptive crawling)
- Per-project knowledge bases (vector + graph combined)
- Hybrid retrieval: vector similarity + graph relationships

#### MCP Hub
- Tool registry
- MCP client/server implementation
- External tool integrations

#### Billing Service (Basic)
- Stripe integration
- Usage metering foundation
- Subscription management

#### Observability Service
- Langfuse (self-hosted) integration
- OpenTelemetry instrumentation
- Basic tracing and cost tracking

#### Shared Libraries
- `@platform/ui` (shadcn/ui components)
- `@platform/flow-editor` (ReactFlow wrapper)
- `@platform/auth` (Auth helpers, RLS)
- `@platform/mcp` (MCP client/server)

#### Chatbot Builder (E1.12)
- ReactFlow editor with 25 MVP node types
- Conversation, Logic, Integration, Action nodes
- Rasa-style NLU pipeline (Tokenizer, Featurizer, DIETClassifier)
- Event-sourced conversation tracker
- Slot system and form handling
- Dialogue policies

#### Chatwoot Integration (E1.13)
- Self-hosted Chatwoot deployment
- Webhook integration for messages
- RAG query bridge (chatbot → knowledge base)
- Captain AI auto-response configuration
- Escalation rules and human handoff
- Account-per-tenant, inbox-per-project

### Phase 2: Full Builder Suite

#### Canvas Builder (E2.1)
- ReactFlow editor for generative AI workflows
- Image generation nodes (Replicate, fal.ai, ComfyUI)
- Node types: Image Generate, Text-to-Image, Image-to-Image, Upscale
- DAG execution engine for generation pipelines
- Cost estimation and batch processing

#### Voice Agent Builder (E2.4)
- ReactFlow editor for voice flows
- Twilio integration (inbound/outbound calls)
- Speech-to-text and text-to-speech nodes
- VXML generation for IVR systems
- Voice-specific conversation handling

#### Embedded Chat UI (E2.11)
- Custom React chat component
- ActionCable WebSocket real-time
- RAG insights panel (confidence, sources, sentiment)
- Widget embedding (iframe, Web Components)

#### Skills & MCP Marketplace Foundation
- MCP Registry integration (official + Smithery.ai)
- Skills system (SKILL.md format)
- One-click install from marketplace
- Registry Aggregator service
- Basic discovery and search

#### Marketplace Foundation
- Module/workflow listings
- Stripe Connect for creator payouts
- Tiered revenue share (0% → 15%)

#### UI Generation (Basic)
- Agent → UI mapping (forms, displays)
- shadcn/ui component library
- Basic theming system

#### Notification Service
- Resend email integration
- Webhook notifications

### Phase 3: Marketplace & Ecosystem

#### Advanced Voice Features (E3.7)
- Custom pipeline: FastRTC + Silero VAD + aiortc
- STT: Deepgram Nova-3 integration
- TTS: ElevenLabs/Cartesia integration
- Turn detection (Qwen2.5-0.5B model, 98.8% TPR)
- Interruption handling (4-state machine)
- gRPC bidirectional streaming
- Twilio SIP integration
- Chatwoot transcript sync

#### Advanced Canvas Features (E3.8)
- Expand to 50+ node types across 6 categories
- Partial re-execution (ComfyUI pattern)
- Cache check and result caching
- Unified chat with "Artie" agent
- ComfyUI parity feature set

#### AI Provider Integration (via fal.ai)
- Images: Flux 2 Pro, Ideogram 3
- Videos: Kling 2.6, Minimax Hailuo
- TTS: ElevenLabs V3, Cartesia
- STT: Deepgram, Whisper
- 3D: Meshy 6, Tripo v2.5
- Cost estimation before execution

#### Advanced Agno Features
- Teams (multi-agent collaboration)
- Subagent orchestration
- Agno code export

#### Framework Export Expansion
- Agno export (P1)
- LangGraph export (P2)
- Open Agent Spec abstraction

#### Command Center Dashboard
- A2UI protocol rendering
- System-wide metrics (all projects)
- HITL approval queue
- Activity timeline feed
- AG-UI SSE for real-time updates

#### Integration Patterns (Full)
- Dify-style "Workflow as Tool" (internal)
- PostgreSQL LISTEN/NOTIFY (state sync)
- Redis Pub/Sub (event fan-out)
- gRPC bidirectional (voice)
- A2A Protocol (multi-agent)

### Phase 4: Enterprise

#### Enterprise Auth (WorkOS)
- SAML SSO integration
- SCIM directory sync
- Custom roles and permissions

#### Database Isolation (Neon)
- Per-tenant database provisioning
- Tenant registry and connection pooling
- Migration tools

#### White-Label
- CSS variables theming
- Custom domain support (Vercel/Cloudflare)
- Custom branding (logos, colors)
- Resend custom email domains

#### Self-Hosted Deployment
- Docker Compose (development)
- Kubernetes Helm charts (production)
- Harbor registry (air-gapped)
- ArgoCD GitOps
- Velero backups
- Installation documentation

#### Security Hardening
- Firecracker MicroVMs for code execution
- gVisor (runsc) alternative
- NeMo Guardrails for prompt injection
- WAF integration
- Audit logging (pgaudit)
- SOC 2 compliance preparation

#### Advanced Billing
- Stripe Billing Meters
- TimescaleDB for usage time series
- Unified Cost Service
- Per-tenant cost attribution

### Phase 5: Scale

#### Collaborative Editing
- Yjs + Y-Sweet integration
- Real-time presence and cursors
- Conflict resolution
- `@platform/collab` library

#### Advanced Skills Marketplace
- Publish custom MCP servers
- Revenue share for skill creators
- Ratings and reviews
- Usage-based pricing for premium skills
- Skill bundles and collections

#### Advanced Marketplace
- Reviews and ratings
- Creator tiers and badges
- Advanced discovery (Meilisearch)
- A/B testing for modules
- Version diffing

#### Agent Versioning
- Semantic versioning
- jsondiffpatch for changes
- Bayesian A/B testing
- Promotion pipelines (dev → staging → prod)
- LaunchDarkly feature flags

#### Framework Export Expansion
- CrewAI export (P3)
- AutoGen export (P4)
- Custom BYOF (P5)

#### Advanced Observability
- Prometheus alerting
- Grafana dashboards
- PagerDuty/Slack notifications
- Runbook automation

#### Scale Infrastructure
- NATS JetStream (replace Redis Streams)
- Multi-region deployment
- Horizontal Pod Autoscaler
- CDN optimization

#### Mobile & Offline
- Responsive-first design
- PWA support (Serwist/Workbox)
- Offline workflow viewing
- Mobile-optimized builders

#### Testing Infrastructure
- Playwright E2E tests
- Vitest unit tests
- GitHub Actions CI/CD matrix
- Agent testing framework

### Feature Inventory Summary

| Category | MVP | Phase 2 | Phase 3 | Phase 4 | Phase 5 |
|----------|-----|---------|---------|---------|---------|
| **Builders** | Module | Chatbot | Voice, Canvas | - | - |
| **Node Types** | 20 | +25 (45) | +60 (105) | - | +10 (115) |
| **Framework Export** | Claude SDK | - | Agno, LangGraph | - | CrewAI, AutoGen, BYOF |
| **Auth** | Clerk | - | - | WorkOS SSO | - |
| **Database** | Supabase | - | - | Neon isolation | - |
| **AI Providers** | LLM only | - | fal.ai (all) | - | - |
| **Marketplace** | - | Basic + Skills | - | - | Advanced |
| **Collaboration** | - | - | - | - | Yjs real-time |
| **Deployment** | Cloud | - | - | Self-hosted | Multi-region |
| **Agno** | Core | - | Teams, Subagents | - | Advanced |
| **Protocols** | A2UI, AG-UI, CopilotKit | - | A2A | - | - |
| **RAG** | pgvector + Graphiti | Enhanced | - | - | - |

---

## User Journeys

### Primary Builders

#### Journey 1: Solo Entrepreneur - "Maya Chen"

**Demographics:** 32, San Francisco, runs "Chen Digital Consulting" from home

**Current Pain:** $178/month across 6 SaaS tools + 15 hours/week manual work connecting them

**Journey Arc:**

| Stage | Experience | Emotion |
|-------|------------|---------|
| **Opening** | 11 PM, manually copying lead data between tools, exhausted | Frustrated |
| **Discovery** | Types "I want to automate lead intake" in conversational builder | Hopeful |
| **Rising Action** | Sees workflow nodes appear as she describes her process | Amazed |
| **Climax** | First lead processed at 2 AM while sleeping - auto-qualified, emailed, booked | Liberated |
| **Resolution** | 15→3 hrs/week admin, $178→$49/month, 4→7 clients | Empowered |

**Evolution Path:** Month 2: Adds chatbot → Month 4: Discovers Canvas → Month 6: Publishes to marketplace ($228/mo passive income)

**Requirements Revealed:** Conversational building, webhook triggers, integrations (email, calendar, CRM), workflow templates, marketplace publishing

---

#### Journey 2: Developer - "Marcus Thompson"

**Demographics:** 28, Austin, Senior Developer, freelances weekends

**Current Pain:** Builds same chatbot patterns repeatedly, no passive income, code trapped in client repos

**Journey Arc:**

| Stage | Experience | Emotion |
|-------|------------|---------|
| **Opening** | Third identical customer service bot this quarter | Frustrated |
| **Discovery** | Sees "Export to Claude Agent SDK" - real code, no lock-in | Intrigued |
| **Rising Action** | Builds module in 2 hours, exports 847 lines of clean TypeScript | Validated |
| **Climax** | Publishes "Universal Support Bot" - strangers start buying | Transformed |
| **Resolution** | $2,100 MRR from modules while working less | Entrepreneurial |

**Requirements Revealed:** Claude SDK export, Agno/LangGraph export, clean generated code, marketplace publishing, creator analytics, module versioning

---

#### Journey 3: Business User - "Dana Rodriguez"

**Demographics:** 41, Chicago, Customer Success Manager at B2B SaaS (150 employees)

**Current Pain:** Answers same 50 questions weekly, Jira ticket for FAQ bot in backlog 97 days

**Journey Arc:**

| Stage | Experience | Emotion |
|-------|------------|---------|
| **Opening** | 47 unread tickets, 30 are password resets | Overwhelmed |
| **Discovery** | Types "I need a bot that handles password resets" - Bond asks clarifying questions | Understood |
| **Rising Action** | Nodes appear automatically as she describes process | Empowered |
| **Climax** | Presents to leadership: 847 conversations resolved, zero engineering hours | Victorious |
| **Resolution** | 100%→32% tickets requiring humans, 4hrs→11min resolution time | Champion |

**Requirements Revealed:** CopilotKit conversational builder, natural language → nodes, Chatwoot integration, slot filling, error handling, no-code testing

---

#### Journey 4: Content Creator - "Jade Okonkwo"

**Demographics:** 26, London, Social Media Manager, 3 clients

**Current Pain:** 47 browser tabs, 25-30 hrs/week on production, 4 hrs on actual creative thinking

**Journey Arc:**

| Stage | Experience | Emotion |
|-------|------------|---------|
| **Opening** | 11 PM, CapCut rendering, 3 more videos to make | Exhausted |
| **Discovery** | Types "Create Instagram carousel for product launch" - sees workflow appear | Curious |
| **Rising Action** | Clicks Run: 9 images (3 variants × 3 sizes) in 2 minutes | Amazed |
| **Climax** | Client brief at 4 PM, 23 assets delivered by 6:30 PM, at gym by 7 PM | Liberated |
| **Resolution** | 28→6 hrs/week production, 3→7 clients, £4,200→£9,100/month | Thriving |

**Requirements Revealed:** Canvas Builder, real-time streaming, DAG execution, partial re-execution, template saving, batch export, cost estimation

---

### Secondary Users

#### Journey 5: End Customer - "Carlos Mendez"

**Demographics:** 45, Miami, small business owner, customer of SaaS using the platform

**Context:** Has billing issue at 11 PM, doesn't know he's talking to AI

**Journey Arc:**

| Stage | Experience | Emotion |
|-------|------------|---------|
| **Opening** | Double charge on credit card, expects to wait until morning | Resigned |
| **Interaction** | Types problem, bot asks email, finds account, explains issue | Surprised |
| **Resolution** | Bot initiates refund, sends confirmation email - 47 seconds total | Impressed |
| **Outcome** | Tells friends "their support is amazing" | Loyal |

**Requirements Revealed:** Seamless embed widget, intent classification, account lookup, action execution (refunds), human handoff, context transfer

---

#### Journey 6: Agency/Consultant - "Rebekah Oyelaran"

**Demographics:** 38, Toronto, Founder of 5-person digital consultancy

**Current Pain:** Hourly billing ($150/hr), rebuilding same solutions per client, revenue ceiling = available hours

**Journey Arc:**

| Stage | Experience | Emotion |
|-------|------------|---------|
| **Opening** | Q4: $180K revenue, $42K profit, 400 personal hours | Trapped |
| **Discovery** | Builds once, deploys to Client A with their branding, then B, then C | Strategic |
| **Climax** | Shifts pricing: $500/month subscription vs $15K project | Transformed |
| **Resolution** | 12 clients on subscriptions, $6,000 MRR while she sleeps | Liberated |

**Requirements Revealed:** Multi-tenant deployment, white-label branding, custom domains, per-client billing, usage analytics per client

---

#### Journey 7: Marketplace Creator - "Diego Fernández"

**Demographics:** 31, Mexico City, full-stack developer specializing in AI tools

**Pattern:** Built same e-commerce support bot for 5 clients - same architecture, same problems solved

**Journey Arc:**

| Stage | Experience | Emotion |
|-------|------------|---------|
| **Opening** | Finishes $8K project, opens folder with 5 identical codebases | Realization |
| **Action** | Abstracts patterns, adds setup wizard, writes docs, publishes at $49/mo | Strategic |
| **Growth** | First stranger purchase, 4.7 stars, featured in Staff Picks | Validated |
| **Resolution** | 127 subscribers, $5,290/month net (after 15% fee) | Established |

**Requirements Revealed:** One-click publish, pricing tiers, Stripe Connect, creator dashboard, reviews/ratings, versioning, bundle creation

---

### Operational Users

#### Journey 8: Platform Admin - "Priya Sharma"

**Demographics:** 34, Bangalore, Senior DevOps Engineer, manages platform for 500+ tenants

**Scenario:** 3:47 AM alert - execution queue depth exceeding threshold

**Journey Arc:**

| Stage | Tool Used | Finding |
|-------|-----------|---------|
| **Alert** | PagerDuty | Queue: 1,247 pending (threshold: 500) |
| **Investigation** | Command Center | One tenant consuming 72% of queue |
| **Root Cause** | Workflow inspector | Infinite loop in workflow design (accidental) |
| **Resolution** | Dynamic rate limiting | Apply 50/min limit, queue drains |
| **Follow-up** | Notification system | Contact tenant, offer fix help |

**Resolution:** Zero user impact, tenant relationship strengthened, runbook updated

**Requirements Revealed:** Command Center, per-tenant metrics, dynamic rate limiting, Prometheus alerting, tenant directory, audit logging

---

#### Journey 9: Support Staff - "Tomás Andrade"

**Demographics:** 27, Lisbon, Customer Support Specialist

**Scenario:** Ticket arrives: "URGENT - Chatbot completely broken, losing sales"

**Journey Arc:**

| Step | Tool | Finding |
|------|------|---------|
| Look up account | Support console | RetailPlus Inc, Pro plan |
| View executions | Execution history | Last success: 18 hours ago |
| Check trace | Langfuse | Error: "Connection refused: CRM API" |
| Investigate | Integration dashboard | CRM vendor had maintenance (external) |
| Verify | Quick test | CRM back up, workflow works |

**Resolution:** 15-minute response with root cause, recommendation for fallback config, customer impressed

**Requirements Revealed:** Support console, execution history, Langfuse traces, integration health, view-as-user mode, suggested fixes

---

#### Journey 10: Enterprise Admin - "Jennifer Walsh"

**Demographics:** 47, Boston, IT Director at 500-person financial services company

**Context:** Evaluating AI platforms for 3 departments, must pass security review

**Journey Arc:**

| Week | Action | Stakeholder | Outcome |
|------|--------|-------------|---------|
| 1-2 | Security questionnaire | Security team | SOC 2 report provided in 24 hrs |
| 3 | Technical POC | Engineering | SSO integration works |
| 4-6 | Pilot (3 departments) | Marketing, Sales, Support | All building successfully |
| 7 | Full rollout approved | Executive sponsor | 500 users provisioned via SCIM |

**Resolution:** Under budget, ahead of schedule, CEO: "This is what digital transformation should look like"

**Requirements Revealed:** WorkOS SSO/SCIM, org hierarchy, RBAC, audit logs, SOC 2, data residency, enterprise SLA

---

### Technical Users

#### Journey 11: API Consumer - "Raj Patel"

**Demographics:** 29, Hyderabad, Senior Mobile Developer at fintech startup

**Project:** Mobile banking app needs AI-powered transaction insights

**Journey Arc:**

| Step | API Feature | Outcome |
|------|-------------|---------|
| Review docs | OpenAPI spec | Clear, well-documented |
| Get API key | Developer portal | Scoped key in 2 minutes |
| Test execution | REST endpoint | Structured JSON response |
| Test streaming | SSE endpoint | Real-time tokens work |
| Implement | iOS/Android SDKs | SDKs available, saves 2 weeks |
| Ship | Production | AI features live in 3 weeks (vs 3 months DIY) |

**Requirements Revealed:** REST/GraphQL APIs, SSE streaming, OpenAPI docs, scoped API keys, iOS/Android/JS/Python SDKs, rate limit headers

---

#### Journey 12: Self-Hosted Admin - "Viktor Schneider"

**Demographics:** 42, Frankfurt, Infrastructure Architect at German insurance company

**Constraint:** BaFin regulations require all customer data processing on-premises

**Journey Arc:**

| Step | Deployment Feature | Outcome |
|------|-------------------|---------|
| Download Helm charts | Helm repository | Clean, well-structured |
| Configure internal LLM | BYOM config | Points to internal Llama 3 |
| Configure database | PostgreSQL values | Uses existing internal Postgres |
| Deploy to staging | helm install | Comes up clean |
| Security scan | Internal tools | Passes vulnerability check |
| Production deploy | ArgoCD GitOps | Live in datacenter |

**Resolution:** Zero external data transmission, BaFin audit: COMPLIANT, same features as cloud

**Requirements Revealed:** Helm charts, Docker images, external DB/Redis support, BYOM (bring your own model), air-gapped support, internal SSO, Velero backups

---

### Journey Requirements Summary

| User Type | Category | Key Requirements |
|-----------|----------|------------------|
| Solo Entrepreneur | Primary | Cross-builder orchestration, integrations, templates, marketplace |
| Developer | Primary | Code export (Claude SDK, Agno), marketplace, framework abstraction |
| Business User | Primary | Conversational building, no-code, Chatwoot integration |
| Content Creator | Primary | Real-time generation, DAG execution, partial re-execution, batch |
| End Customer | Secondary | Seamless widget, actions, handoff, context transfer |
| Agency/Consultant | Secondary | Multi-tenant, white-label, custom domains, client billing |
| Marketplace Creator | Secondary | Publishing, pricing, Stripe Connect, analytics, reviews |
| Platform Admin | Operational | Command Center, per-tenant metrics, rate limiting, alerting |
| Support Staff | Operational | User lookup, traces, integration health, suggested fixes |
| Enterprise Admin | Operational | SSO/SCIM, RBAC, audit logs, compliance, data residency |
| API Consumer | Technical | REST/SSE APIs, SDKs, documentation, rate limits |
| Self-Hosted Admin | Technical | Helm, BYOM, air-gapped, internal integrations, backups |

---

## Domain-Specific Requirements

### Compliance & Regulatory

| Requirement | Priority | Phase | Notes |
|-------------|----------|-------|-------|
| **SOC 2 Type II** | P1 | Phase 4 | Primary enterprise requirement |
| **GDPR** | P2 | Phase 2 | EU market access |
| **EU AI Act** | P2 | Phase 4 | AI transparency requirements |
| **Data Residency** | P2 | Phase 4 | Regulated industries requirement |
| **CCPA** | P3 | Phase 4 | California users |

### AI Safety & Content Moderation

| Control | Implementation | Priority |
|---------|----------------|----------|
| **No NSFW Generation** | Content filtering at Canvas Builder level | P0 |
| **Prompt Injection Protection** | NeMo Guardrails + input sanitization + output filtering | P0 |
| **AI Hallucination Mitigation** | RAG grounding, confidence scoring, source attribution | P1 |
| **Marketplace Content Review** | Automated scan + manual review before publish | P1 |

### Cost Control Strategy

| Tier | Approach | Limits |
|------|----------|--------|
| **Free/Sandbox** | Hard cap | $5/month |
| **Pro** | Soft warning (80%) + Hard cap (150%) | Per plan limits |
| **Team/Business** | Soft warning + Admin alerts | No hard cap |
| **Enterprise** | Custom per contract | Negotiated SLAs |

### Model Flexibility (Cloud + Self-Hosted)

| Category | Providers |
|----------|-----------|
| **Cloud LLM** | Anthropic (Claude), OpenAI (GPT-4), Google (Gemini) |
| **Cloud AI** | fal.ai (images, video, audio, 3D) |
| **Self-Hosted LLM** | Llama 3, Mistral, custom endpoints (BYOM) |
| **Configuration** | Open Agent Spec abstraction for provider swapping |

### Security Architecture (Enhanced via Red/Blue Team Analysis)

| Component | Requirement | Priority |
|-----------|-------------|----------|
| **Tenant Isolation** | RLS + tenant_id in every query, no shared context | P0 |
| **Prompt Security** | NeMo Guardrails + input sanitization + output filtering | P0 |
| **Execution Sandbox** | Firecracker MicroVM for all user code, no raw network | P0 |
| **API Security** | Short-lived tokens, rate limiting, IP allowlisting (enterprise) | P0 |
| **Marketplace Security** | Code review, sandboxed testing, reputation system | P0 |
| **Voice Security** | No sensitive ops via voice, consent recording, transcript logging | P1 |
| **Audit Logging** | Immutable logs, full trace IDs, exportable for compliance | P0 |
| **Incident Response** | Alerting, runbooks, 24hr response SLA (enterprise) | P1 |

### Identified Attack Vectors & Mitigations

| Attack | Mitigation |
|--------|------------|
| Cross-Tenant RAG Poisoning | Tenant ID embedded in every query, RLS enforced at DB level |
| Marketplace Trojan Module | Sandboxed execution (Firecracker), no network except whitelist |
| Voice Social Engineering | Voice agents limited to pre-approved actions only |
| Infinite Execution Bomb | DAG cycle detection, max node count, execution timeout |
| Credential Theft | API keys never in browser, short-lived tokens, rotation |

### SOC 2 Readiness Checklist

- [ ] CC6.1: Access control documentation
- [ ] CC6.6: System boundary diagrams
- [ ] CC6.7: Encryption standards documented
- [ ] CC7.1: Threat detection and alerting
- [ ] CC7.2: Audit log retention policy
- [ ] CC8.1: Change management process
- [ ] PI1.1: Privacy policy and consent flows

## Innovation Discovery (Step 6)

### Key Learnings from Elicitation

1. **Focus Beats Breadth**: Nail 3 core innovations (Conversational Building, Multi-Framework Export, Hybrid RAG) before expanding to others.
2. **Moat Hierarchy Matters**: Protocol Stack, BMB Methodology, and Multi-Framework Export take 12+ months to copy - these are our strongest differentiators.
3. **Competitor Response Windows**: ~6-12 months before serious copying. Must establish user habits and network effects in that window.
4. **Hybrid Mode is Insurance**: Conversational building at <85% accuracy kills adoption. Default to hybrid (chat suggests, visual confirms).
5. **Protocol Abstraction is Critical**: Users should NEVER see "A2UI" or "AG-UI" - these are implementation details behind a simple SDK.

### Priority Innovation Stack

**Tier 1 - Core Differentiation (must nail in MVP):**
1. Conversational Building (DCRL pattern)
2. Multi-Framework Export (Claude SDK first)
3. Hybrid RAG (pgvector + Graphiti)

**Tier 2 - Platform Expansion:**
4. Four Integrated Builders
5. BMB Methodology
6. Marketplace with network effects

**Tier 3 - Advanced (can follow):**
7-10. Protocol stack, Voice, Canvas, Contact Center

### Innovation Areas (10 Total)

#### 1. Hybrid RAG Architecture (Vector + Graph + Temporal)
No platform combines pgvector (vector), Graphiti (graph), AND temporal memory in a unified retrieval system.

| Component | Innovation | Competitor Approach |
|-----------|------------|---------------------|
| **pgvector** | HNSW indexing, hybrid search | Most use cloud-only Pinecone |
| **Graphiti** | Entity relationships, temporal memory, episode-based learning | None have graph RAG |
| **Combined Retrieval** | Vector similarity + graph relationships + recency | Industry first |

#### 2. Unified Protocol Stack (A2UI + AG-UI + CopilotKit)
First platform to integrate all three emerging protocols into a coherent stack.
- USER LAYER: A2UI v0.8 (Declarative UI Spec)
- TRANSPORT LAYER: AG-UI (SSE + HTTP POST, 25 Event Types)
- AGENT LAYER: Agno + Claude SDK
- INTEGRATION: MCP (tools) + A2A (multi-agent)

#### 3. Conversational Building (DCRL Pattern)
True chat-to-nodes building with AI intent parsing. Users describe what they want, nodes appear.
- **Detect** - Parse natural language intent
- **Clarify** - Ask clarifying questions if confidence < 0.6
- **Resolve** - Execute graph operations
- **Learn** - Incorporate feedback for future

#### 4. Four Integrated Builders with Shared Context
Module + Chatbot + Voice + Canvas in ONE platform, sharing the SAME project RAG context.

| Scenario | Pattern | Latency |
|----------|---------|---------|
| Module → Chatbot | Dify-style Tool | <500ms |
| Voice ↔ Module | gRPC Bidirectional | <50ms |
| Any → Any state | PostgreSQL NOTIFY | <10ms |
| Event fan-out | Redis Pub/Sub | <200ms |

#### 5. Canvas Builder (Beat ComfyUI)

| Our Innovation | How We Win |
|----------------|------------|
| Chat with "Artie" to build workflows | "Add upscaler after this node" vs drag-and-drop hunting |
| MIT building blocks | Enterprises can deploy without GPL legal risk |
| Yjs real-time collaboration | Teams build together, see cursors |
| Cloud + self-hosted | No GPU? No problem |
| TapTV-style community | Fork/remix public workflows, monetize |
| Native project RAG | "Use my brand guidelines" in prompts |
| BMB methodology (guided) | Artie guides beginners through first workflow |

**Canvas Killer Features:**
- Conversational Canvas Building via "Artie" agent
- Brand RAG Integration (upload guidelines, every generation uses them)
- Smart Template Marketplace (workflow + training data + RAG context)
- Cross-Builder Integration (Canvas triggered by Chatbot, output to Voice)

#### 6. Voice Agent Architecture (Beat Voiceflow)

| Our Innovation | How We Win |
|----------------|------------|
| Export to Claude SDK, Agno, etc | Build once, deploy anywhere |
| Native Hybrid RAG | Voice agent knows your entire knowledge base |
| Four builders share context | Start on chat, escalate to voice, same context |
| 98.8% TPR turn detection | Fewer interruptions, better UX |
| Native Chatwoot integration | Voice → ticket → human handoff seamless |
| Self-hosted option | Enterprise/regulated industries |

**Voice Killer Features:**
- Conversational Voice Building via BMB methodology
- Graph RAG for Voice ("What did we discuss last week?" works)
- Seamless Channel Switching (voice → chat with full context)
- Human Handoff with Context (Chatwoot agent sees everything)
- Voice-to-Module Integration (<50ms gRPC latency)

#### 7. Multi-Framework Export
Build once, deploy anywhere. Most platforms lock you to their runtime.

| Phase | Framework | Status |
|-------|-----------|--------|
| P0 | Claude Agent SDK | First class |
| P1 | Agno | Native |
| P2 | LangGraph | Adapter |
| P3 | CrewAI | Adapter |
| P4 | AutoGen | Adapter |
| P5 | BYOF (Custom) | Open Agent Spec |

#### 8. BMB Methodology (Structured Agent Creation)
10-step structured methodology with specialized AI agents guiding each phase.

**Methodological Roles** (abstract BMB methodology phases - applies within any builder):
| Agent | BMB Methodology Phase |
|-------|----------------------|
| **Bond** | Agent definition phase (persona, tools, capabilities) |
| **Wendy** | Workflow design phase (node connections, logic) |
| **Morgan** | Module packaging phase (deployment, export) |
| **Artie** | UI/Visual design phase (interfaces, components) |

> Note: These are abstract methodology phases. Each agent specializes in one phase of the BMB 10-step process, regardless of which builder they're assigned to.

**UI Builder Assignments** (which agent guides each builder UI):
| Builder | Assigned Agent | Primary Focus |
|---------|----------------|---------------|
| **Module Builder** | Bond | Workflow orchestration, RAG pipelines |
| **Chatbot Builder** | Wendy | Conversational flows, dialog management |
| **Voice Agent Builder** | Morgan | Voice interactions, speech patterns |
| **Canvas Builder** | Artie | Visual content generation, UI design |

> Note: Each builder has a dedicated BMB Agent that guides users through conversational building via AG-UI protocol.

#### 9. Lightweight Integration Architecture
MCP reserved for LLM tools ONLY. Internal integration uses ultra-lightweight patterns.

| Scenario | Pattern | Why NOT MCP |
|----------|---------|-------------|
| Module ↔ Chatbot | Dify-style Tool | MCP context overhead too high |
| State sync | PostgreSQL NOTIFY | Sub-millisecond, ACID |
| Events | Redis Pub/Sub | Decoupled fan-out |
| Voice streaming | gRPC | True bidirectional |
| External APIs | MCP | Correct use - LLM tools |

#### 10. Built-in Contact Center (Chatwoot as Headless Backend)
Custom React chat UI with RAG insights panel - confidence scores, source citations, intelligent handoff.

| Feature | What's Different |
|---------|------------------|
| **RAG Insights Panel** | Show confidence %, source docs, sentiment |
| **Source Citations** | Clickable references on bot messages |
| **Human Handoff** | Seamless escalation with full context |
| **Multi-Channel** | Email, WhatsApp, Twitter, Telegram via Chatwoot |

### Competitive Vulnerability Map

| Innovation | Moat Strength | Time to Copy |
|------------|---------------|--------------|
| Protocol Stack | Very High | 18+ months |
| BMB Methodology | Very High | 12+ months |
| Multi-Framework Export | High | 12 months |
| Conversational Building | Medium-High | 9 months |
| Hybrid RAG | Medium | 6 months |
| Canvas/Voice | Low | Already exists |

### Pre-mortem Mitigations

| Risk | Mitigation | Owner |
|------|------------|-------|
| Scope creep | Phase 1 = Module + Conversational + RAG ONLY | PM |
| Protocol complexity | Abstract behind simple SDK | Engineering |
| Empty marketplace | Seed 50+ internal modules, 0% starter tier | Growth |
| Enterprise gaps | SOC 2 Type I in Phase 2, audit logs in MVP | Security |
| Conversational accuracy | Hybrid mode default, 85% target | ML |

### What-If Contingency Plans

| Scenario | Trigger | Response Plan |
|----------|---------|---------------|
| Competitor copies conversational | Dify announces chat builder | Accelerate BMB certification program |
| AG-UI adoption fails | <500 GitHub stars by Q3 | Fall back to pure CopilotKit |
| Graph RAG commoditized | Pinecone launches graph | Patent temporal memory, pivot to enterprise |

### Innovation Validation Approach

| Innovation | Validation Method | Success Metric |
|------------|-------------------|----------------|
| Hybrid RAG | Query benchmark | Graph queries outperform pure vector by 40% |
| Protocol Stack | Integration test | All 25 AG-UI events work end-to-end |
| Conversational Building | User testing | 80%+ first-time success rate |
| Four Builders | Cross-builder demo | Single workflow uses all 4 builders |
| Canvas Partial Execution | Performance test | <2s iteration vs 30s+ full run |
| Voice Turn Detection | Accuracy test | 95%+ TPR in production |
| Framework Export | Compilation test | Generated code runs in target framework |
| Conversational Canvas | User builds 3-node workflow via chat | <2 minutes, 80% success |
| Brand RAG in Canvas | Generated images match brand guidelines | Human eval 8/10+ |
| Voice Graph RAG | "What did we discuss?" recall | Correct answer 90%+ |
| Channel switching | Voice→Chat handoff | Context preserved 100% |

## SaaS B2B Platform + Marketplace + Developer Tool Specific Requirements (Step 7)

### Project-Type Overview

A multi-faceted platform combining:
- **SaaS B2B**: Multi-tenant workspaces with tiered subscriptions
- **Marketplace**: Creator economy with revenue sharing (85% creator / 15% platform)
- **Developer Tool**: SDK exports, API access
- **App Generator**: White-label deployments for agencies and their clients

### Multi-Tenancy Model

| Level | Isolation | Use Case |
|-------|-----------|----------|
| **Workspace** | Supabase RLS (tenant_id) | Standard users |
| **Enterprise Tenant** | Neon database branch | Regulated/large enterprise |
| **Client Sub-Account** | Workspace partition | Agency → Client billing |

### Permission Model (RBAC)

| Role | Module | Chatbot | Voice | Canvas | Marketplace | Billing | Settings |
|------|--------|---------|-------|--------|-------------|---------|----------|
| Owner | Full | Full | Full | Full | Publish/Earn | Full | Full |
| Admin | Full | Full | Full | Full | Publish/Earn | View | Full |
| Builder | Create/Edit | Create/Edit | Create/Edit | Create/Edit | Publish | None | Limited |
| Viewer | View | View | View | View | Browse | None | None |
| API Consumer | Execute | Execute | Execute | Execute | None | None | None |

### Billing Architecture (Credit-Based)

**Model:** All AI usage billed through platform credits (20% margin on provider costs)

| Tier | Base Fee | Included Credits | Overage |
|------|----------|------------------|---------|
| Free | $0 | $5/month | Hard cap |
| Pro | $49/mo | $20/month | Pay-as-you-go |
| Team | $149/mo | $100/month | Pay-as-you-go |
| Business | $399/mo | $500/month | Discounted rates |
| Enterprise | Custom | Negotiated | Committed use |

**Credit Categories:**

| Category | What's Metered | Example Rate |
|----------|---------------|--------------|
| LLM Tokens | Input/output by model | 1.8 credits/1K (Opus input) |
| RAG Queries | Vector + graph retrieval | 0.5 credits/query |
| Image Generation | Per megapixel | 6 credits/MP (Flux Pro) |
| Video Generation | Per second | 8.4 credits/sec (Kling) |
| Voice STT/TTS | Per second | 0.5 credits/sec |
| Executions | Workflow runs | 0.12 credits/run |
| Storage | GB-months | 2 credits/GB |

### Billing UX Enhancements (from Cross-Functional Analysis)

| Feature | Description | Priority |
|---------|-------------|----------|
| Dollar Display | Show usage in $ not credits | P0 |
| Real-Time Widget | Dashboard usage tracker | P0 |
| Multi-Channel Alerts | In-app + SMS + push options | P0 |
| Hard Cap Option | Stop service vs. overage choice | P1 |
| Usage Forecast | "At this rate, you'll spend ~$X" | P1 |

### Marketplace Economics

| Transaction Type | Platform Fee | Creator Receives |
|------------------|--------------|------------------|
| One-time purchase | 15% + Stripe fees | ~82% |
| Subscription | 15%/month | 85% |
| Usage passthrough | 10% margin | Creator sets price |

### Marketplace Safety (from Support Theater Analysis)

| Feature | Description | Priority |
|---------|-------------|----------|
| 24hr Auto-Refund | Refund if module crashes on first run | P0 |
| Creator Response SLA | 48hr response or auto-refund | P1 |
| Sandbox Testing | Require passing tests before publish | P0 |
| Payment Escrow | 7-day hold before creator payout | P1 |

### Agency / White-Label Model

| Feature | Description | Priority |
|---------|-------------|----------|
| Client Sub-Accounts | Create unlimited client workspaces | P0 |
| Per-Client Export | CSV with client breakdown | P0 |
| Billing Passthrough | Bill clients directly via Stripe | P1 |
| Margin Control | Agency sets client markup % | P1 |
| White-Label Invoices | Agency branding on bills | P2 |
| Client Usage Alerts | Per-client threshold notifications | P1 |

### SDK & Developer Experience

| Export Target | Status | Language |
|---------------|--------|----------|
| Claude Agent SDK | P0 (First class) | TypeScript/Python |
| Agno | P1 (Native) | Python |
| LangGraph | P2 (Adapter) | Python |
| CrewAI | P3 (Adapter) | Python |
| REST API | P0 | Any |

### Real-Time Requirements

| Feature | Technology | Latency Target |
|---------|------------|----------------|
| Collaborative editing | Yjs + Supabase Realtime | <100ms |
| Agent execution status | AG-UI SSE | <200ms |
| Dashboard updates | Supabase Realtime | <500ms |
| Voice streaming | gRPC bidirectional | <50ms |
| Cost updates | PostgreSQL NOTIFY | <10ms |

### Failure Prevention (from Failure Mode Analysis)

| System | Mitigation | Priority |
|--------|------------|----------|
| Cost Capture | Durable queue + dead letter + replay | P0 |
| RLS Enforcement | CI/CD checks, no bypass | P0 |
| Stripe Sync | Retry queue + manual dashboard | P0 |
| Reconciliation | Daily automated checks, alerts | P1 |

### Implementation Phases

**Phase 1 (MVP):**
- Credit-based billing via Stripe Billing Meters
- Basic RBAC (Owner, Builder, Viewer)
- Claude SDK export only
- Single-tenant workspaces
- Dollar-based usage display
- Multi-channel alerts

**Phase 2:**
- Marketplace with Stripe Connect
- Agency sub-accounts with per-client billing
- Multi-framework export (Agno, LangGraph)
- Creator analytics dashboard

**Phase 3:**
- Enterprise tenant isolation (Neon)
- Advanced RBAC with custom roles
- White-label deployments
- Reseller billing with margin control

**Future:**
- BYOK (Bring Your Own Key) for cost-conscious users

## Project Scoping & Epic Roadmap (Step 8)

### Scoping Philosophy

**Approach:** Full Platform Vision with Epic-Based Incremental Testing
- Plan everything upfront across all phases
- Validate between each epic before proceeding
- Go/No-Go gates ensure quality before expansion

### MVP Strategy

**Philosophy:** Platform MVP - build complete infrastructure with all 4 builders, staged by depth.

**Serial, Not Parallel Development:**
- Module Builder → Chatbot Builder → Canvas Builder → Voice Builder
- Each builder reaches "done" before next starts major work
- 80/20 effort split: Module+Chatbot get 70%, Canvas+Voice get 30%

### Complete Epic Roadmap

#### Phase 1: Foundation & Core Builders (14 weeks)

| Epic | Name | Deliverables | Test Gate |
|------|------|--------------|-----------|
| E1.1 | Infrastructure | Supabase, Redis, Docker, CI/CD | Deploy to staging |
| E1.2 | Auth & Tenancy | Clerk, RLS, workspace model | User can sign up, create workspace |
| E1.3 | API Gateway | Routing, rate limiting, CORS | External API call succeeds |
| E1.4 | Shared Libraries | @platform/ui, @platform/flow-editor, @platform/auth, @platform/mcp | Libraries published to monorepo |
| E1.5 | Protocol Stack | AG-UI SSE handler, CopilotKit integration, 25 event types | Chat interface streams updates |
| E1.6 | Module Builder Core | ReactFlow editor, 10 core nodes | Can build 3-node workflow |
| E1.7 | Conversational Building | DCRL pattern, BMB agents (Bond/Wendy/Morgan), intent parsing | NL → nodes works at 80%+ |
| E1.8 | MCP Hub Service | Tool registry, MCP client/server, external tools | Can call external MCP tool |
| E1.9 | Module Execution | Agno runtime, variable pool, Dify-style tools | Workflow executes successfully |
| E1.10 | Claude SDK Export | Code generation, download | Generated code runs locally |
| E1.11 | RAG Vector | pgvector, Crawl4ai, Docling | Can query uploaded docs |
| E1.12 | Chatbot Builder | Flow editor, 25 MVP nodes | Can build conversation flow |
| E1.13 | Chatwoot Integration | Headless API, deployment | Chatbot answers in Chatwoot |
| E1.14 | Cross-Builder Integration | Module ↔ Chatbot, PostgreSQL NOTIFY | Chatbot calls module |
| E1.15 | Billing Core | Credits, Stripe meters, tiers | Can charge for usage |
| E1.16 | Observability | Langfuse, cost tracking | Can see traces and costs |
| E1.17 | Testing Infrastructure | Playwright E2E, Vitest unit, CI/CD matrix | All tests pass in CI |

#### Phase 2: Full Builder Suite (10 weeks)

| Epic | Name | Deliverables | Test Gate |
|------|------|--------------|-----------|
| E2.1 | Canvas Builder Core | Node editor, 20 nodes, "Artie" agent | Can build image workflow via chat |
| E2.2 | Canvas Providers | fal.ai, Flux, Kling, cost estimation | Image generation works |
| E2.3 | Canvas DAG Execution | Partial re-execution, caching | <2s re-run on change |
| E2.4 | Voice Builder Core | Flow editor, 15 nodes | Can build voice flow |
| E2.5 | Voice Pipeline | FastRTC, Silero VAD, STT/TTS | Can answer phone call |
| E2.6 | Voice Twilio | Inbound/outbound calls | Live phone test works |
| E2.7 | RAG Graph | Graphiti integration | Temporal queries work |
| E2.8 | Agno Export | Multi-framework export | Agno code runs |
| E2.9 | Command Center Dashboard | System-wide metrics, A2UI rendering, Tremor charts | Dashboard shows all projects |
| E2.10 | HITL Approval Queue | Global + per-project, AG-UI INTERRUPT | Approvals work end-to-end |
| E2.11 | Embedded Chat UI | Custom React chat, RAG insights panel, source citations | Chat widget works in iframe |
| E2.12 | UI Generation (A2UI) | Agent→UI mapping, form generation, shadcn components | Can generate UI from workflow |
| E2.13 | Search & Discovery | Meilisearch, hybrid search, categories | Users can find modules |

#### Phase 3: Marketplace & Ecosystem (10 weeks)

| Epic | Name | Deliverables | Test Gate |
|------|------|--------------|-----------|
| E3.1 | Marketplace Core | Listing, search, categories | Can browse modules |
| E3.2 | Stripe Connect | Creator payouts, 85/15 split | Creator receives payment |
| E3.3 | Module Publishing | Versioning, review, sandbox | Published module works |
| E3.4 | Marketplace Safety | 24hr refund, escrow, sandbox testing | Refund flow works |
| E3.5 | Creator Dashboard | Analytics, earnings, reviews | Creator sees stats |
| E3.6 | Skills Marketplace | MCP Registry integration, SKILL.md format, one-click install | Can install skill from registry |
| E3.7 | Registry Aggregator | Official + Smithery.ai, semantic search | Can discover skills |
| E3.8 | LangGraph Export | Framework adapter | LangGraph code runs |
| E3.9 | CrewAI Export | Framework adapter | CrewAI code runs |
| E3.10 | Notification Service | Multi-channel alerts (email, SMS, push) | Alerts delivered |

#### Phase 4: Agency & Enterprise (10 weeks)

| Epic | Name | Deliverables | Test Gate |
|------|------|--------------|-----------|
| E4.1 | Agency Sub-Accounts | Client workspaces | Agency creates client |
| E4.2 | Per-Client Billing | Usage attribution, export | Client breakdown works |
| E4.3 | White-Label UI | Custom domain, branding, CSS variables | Branded chat works |
| E4.4 | Reseller Margin | Markup configuration | Agency profit calculated |
| E4.5 | Enterprise Tenancy | Neon isolation, connection pooling | Isolated DB works |
| E4.6 | WorkOS SSO | SAML, OIDC, SCIM directory sync | SSO login works |
| E4.7 | Advanced RBAC | Custom roles, permissions, API consumer | Role restrictions work |
| E4.8 | Audit Logging | Immutable logs, pgaudit, export | Audit trail complete |
| E4.9 | Security Sandboxing | Firecracker MicroVMs, gVisor, resource limits | User code isolated |
| E4.10 | Prompt Security | NeMo Guardrails, input sanitization, output filtering | Prompt injection blocked |
| E4.11 | WAF Integration | Rate limiting, IP allowlisting, DDoS protection | WAF rules applied |

#### Phase 5: Collaboration & Scale (6 weeks)

| Epic | Name | Deliverables | Test Gate |
|------|------|--------------|-----------|
| E5.1 | Real-Time Collab | Yjs, cursors, presence | 2 users edit together |
| E5.2 | Version Control | Workflow versioning, rollback | Can restore previous |
| E5.3 | Team Workflows | Comments, approvals | Approval flow works |
| E5.4 | Advanced Voice | Turn detection, interrupts | <500ms latency |
| E5.5 | Advanced Canvas | 50+ nodes, ComfyUI parity | Complex workflow runs |
| E5.6 | AutoGen Export | Framework adapter | AutoGen code runs |

#### Phase 6: Future Vision (Ongoing)

| Epic | Name | Deliverables | Test Gate |
|------|------|--------------|-----------|
| E6.1 | BYOK | Bring Your Own Keys | BYOK user pays less |
| E6.2 | Self-Hosted | Helm charts, docs | Customer deploys |
| E6.3 | A2A Protocol | Multi-agent orchestration | Agents collaborate |
| E6.4 | Mobile Companion | React Native app | Mobile monitoring works |
| E6.5 | AI Copilot v2 | Proactive suggestions | Copilot helps unprompted |
| E6.6 | Vertical Templates | Industry-specific starters | Template deploys |

### Epic Summary

| Phase | Epics | Duration | Cumulative |
|-------|-------|----------|------------|
| Phase 1 | 17 | 14 weeks | 14 weeks |
| Phase 2 | 13 | 10 weeks | 24 weeks |
| Phase 3 | 10 | 10 weeks | 34 weeks |
| Phase 4 | 11 | 10 weeks | 44 weeks |
| Phase 5 | 6 | 6 weeks | 50 weeks |
| Phase 6 | 6+ | Ongoing | - |

**Total: 57 planned epics across 50 weeks (~12 months) to full vision**

### Gap Analysis Audit (2026-01-23)

The following critical gaps were identified and resolved in this update:

| Gap | Resolution | Epic Added |
|-----|------------|------------|
| UI Generation / A2UI missing | Added UI Generation epic | E2.12 |
| Conversational Building infrastructure | Added DCRL/BMB epic | E1.7 |
| Protocol Stack not implemented | Added AG-UI/CopilotKit epic | E1.5 |
| MCP Hub missing | Added dedicated MCP Hub epic | E1.8 |
| Skills Marketplace missing | Added Skills + Registry epics | E3.6, E3.7 |
| Command Center Dashboard missing | Added dashboard epic | E2.9 |
| HITL Approval Queue missing | Added HITL epic | E2.10 |
| Embedded Chat UI missing | Added chat UI epic | E2.11 |
| Shared Libraries missing | Added libraries epic | E1.4 |
| Security Sandboxing missing | Added Firecracker/NeMo epics | E4.9, E4.10, E4.11 |
| Testing Infrastructure missing | Added testing epic | E1.17 |
| Search/Discovery missing | Added Meilisearch epic | E2.13 |

### Test Gate Criteria

| Gate Type | What's Tested | Pass Criteria |
|-----------|---------------|---------------|
| Unit | Functions work | 80%+ coverage |
| Integration | Services talk | Cross-service calls succeed |
| E2E | User journey works | Happy path completes |
| User Test | Real user feedback | 3 users complete task |

### Go/No-Go Between Epics

After each epic:
1. Run automated test suite
2. Demo to stakeholder
3. Collect user tests (if applicable)
4. **Decide:** Proceed / Fix issues / Pivot

### Risk Mitigations

| Risk | Mitigation |
|------|------------|
| Paralysis by breadth | Serial builder development |
| Integration hell | Integration-first contracts |
| RAG complexity | pgvector first, Graphiti Phase 2 |
| Voice black hole | Time-box 2 weeks, accept 1s latency |

### Minimum Viable Team

| Role | Count | Focus |
|------|-------|-------|
| Senior Full-Stack | 2 | Builders + services |
| AI/ML Engineer | 1 | RAG, agents, Claude SDK |
| DevOps | 1 | Infrastructure, deployment |
| **Total** | **4** | 3 months to Phase 1 |

---

## Functional Requirement

**Total: 248 FRs | 23 Capability Areas | 100% Research Coverage (38 source documents)**

### Research Document References
| Code | Document |
|------|----------|
| T0-RAG | technical-agentic-rag-sdk-research-v2-2026-01-19.md |
| T0-PROT | technical-agentic-protocols-research-2026-01-19.md |
| T1-VWB | technical-visual-workflow-builders-research-2026-01-20.md |
| T1-SAAS | technical-multi-tenant-saas-research-2026-01-20.md |
| T1-CLAUDE | technical-claude-agent-sdk-research-2026-01-20.md |
| T1-FRAME | technical-framework-abstraction-research-2026-01-20.md |
| T2-CONV | technical-conversational-builder-research-2026-01-20.md |
| B2-MARKET | business-marketplace-economics-research-2026-01-20.md |
| T3-UIGEN | technical-ui-generation-research-2026-01-20.md |
| T3-BILL | technical-billing-metering-research-2026-01-20.md |
| T4-CHAT | technical-chatwoot-integration-research-2026-01-20.md |
| T4-EMBED | technical-embedded-chat-ui-research-2026-01-21.md |
| T4-CMD | technical-command-center-research-2026-01-20.md |
| T4-OBS | technical-agent-observability-research-2026-01-20.md |
| T4-VER | technical-agent-versioning-research-2026-01-21.md |
| T4-COLLAB | technical-collaborative-editing-research-2026-01-21.md |
| T4-SEC | technical-security-sandboxing-research-2026-01-21.md |
| T5-DEPLOY | technical-self-hosted-deployment-research-2026-01-21.md |
| T5-SSO | technical-sso-enterprise-auth-research-2026-01-21.md |
| T5-WHITE | technical-white-label-research-2026-01-21.md |
| T5-MCP | technical-mcp-skills-marketplace-research-2026-01-21.md |
| T6-VOICE | technical-voice-stack-research-2026-01-22.md |
| T6-LIVEKIT | technical-livekit-architecture-study-2026-01-22.md |
| T6-CHATBOT | technical-chatbot-builder-research-2026-01-22.md |
| T6-RASA | technical-rasa-architecture-study-2026-01-22.md |
| T7-CANVAS | technical-canvas-builder-research-2026-01-22.md |
| T8-AIGEN | technical-ai-generation-providers-research-2026-01-22.md |
| T6-INTEG | technical-integration-layer-research-2026-01-22.md |
| T8-UI | technical-ui-gaps-research-2026-01-23.md |
| T8-GAPS | technical-supplementary-gaps-research-2026-01-23.md |
| B1-COMP | business-competitive-analysis-research-2026-01-20.md |
| B3-PRICE | business-pricing-strategy-research-2026-01-21.md |
| T9-EMOT | technical-agent-emotional-intelligence-research-2026-01-25.md |
| T9-DIFF | technical-visual-diff-engine-research-2026-01-25.md |
| T9-REC | technical-conversation-recording-research-2026-01-25.md |

### 1. Account & Identity Management (7 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR1 | Users can create account via email/password or social providers | T5-SSO, T1-SAAS | 1.1.1, 1.1.2 | `/auth/register`, `/auth/login`, `/auth/logout`, `/auth/refresh`, `/auth/me` | — |
| FR2 | Users can enable multi-factor authentication | T5-SSO §4 | 1.1.5, 1.1.6, 1.1.7, 1.10.2 | `/auth/mfa/setup`, `/auth/mfa/verify`, `/auth/mfa/backup-codes` | — |
| FR3 | Enterprise users can authenticate via SAML SSO or OIDC | T5-SSO §1-2 | 1.1.1, 4.4.1 | `/auth/sso/saml`, `/auth/sso/oidc` | — |
| FR4 | Enterprise admins can provision/deprovision users via SCIM | T5-SSO §3 | 4.4.2, 4.8.1 | `/scim/v2/Users`, `/scim/v2/Groups` | — |
| FR5 | Users can manage API keys with custom scopes and expiration | T8-UI §5 | 1.10.3, 6.1.1 | `/api-keys` (GET, POST, DELETE) | — |
| FR6 | Users can rotate API keys without service interruption | T8-UI §5 | 1.10.3 | `/api-keys/{id}/rotate` | — |
| FR7 | System can enforce IP allowlisting for enterprise | T5-SSO §9 | 1.10.3, 4.8.4 | `/admin/security/ip-allowlist` | — |

### 2. Workspace & Project Management (9 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR8 | Users can create workspaces to organize work | T1-SAAS §9 | 1.5.1, 1.10.4 | `/workspaces` (GET, POST, PUT, DELETE) | — |
| FR9 | Users can create multiple projects within workspace | T1-SAAS §9 | 1.5.2 | `/workspaces/{wsId}/projects` | — |
| FR10 | Workspace owners can invite members with role-based permissions | T8-UI §1 | 1.10.4, 4.4.2, 5.1.2 | `/workspaces/{id}/members` | — |
| FR11 | Users can switch between workspaces without logging out | T5-SSO §8 | 1.5.2, 2.13.1 | `/workspaces` (frontend state) | — |
| FR12 | Projects can be organized into folders or categories | T8-GAPS §1 | 1.5.2 | `/workspaces/{wsId}/folders` | — |
| FR13 | Users can duplicate projects as templates | T1-VWB §8 | 1.5.2, 2.12.1 | `/projects/{id}/duplicate` | — |
| FR14 | Users can archive and restore projects | T4-VER §5 | 1.5.2 | `/projects/{id}/archive`, `/projects/{id}/restore` | — |
| FR15 | System enforces tenant isolation via Row-Level Security | T1-SAAS §3-6 | 2.13.2, 4.7.1 | (DB-level RLS) | — |
| FR16 | Enterprise tenants can have dedicated database isolation | T1-SAAS §4 | 2.13.2, 4.8.3 | (Neon provisioning) | — |

### 3. Module Builder (15 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR17 | Users can create visual workflows using node-based editor | T1-VWB §2-5 | 1.2.1 | `/projects/{id}/workflows`, `/workflows/{id}` | AG-UI: `STATE_SNAPSHOT` |
| FR18 | Users can add Prompt nodes with variable interpolation | T1-VWB §6 | 1.2.2, 1.2.2a | `/workflows/{id}/nodes` (POST) | AG-UI: `STATE_DELTA` |
| FR19 | Users can add Sub-Agent nodes with system prompts, tools, model | T1-CLAUDE §2-4 | 1.2.2a | `/workflows/{id}/nodes` (POST) | AG-UI: `STATE_DELTA` |
| FR20 | Users can add MCP Tool nodes to call installed MCP servers | T5-MCP | 2.1.4, 2.1.5, 2.1.6 | `/workflows/{id}/nodes` (POST) | AG-UI: `TOOL_CALL_*` |
| FR21 | Users can add Skill nodes to execute installed Skills | T5-MCP §5 | 3.1.3, 3.1.4, 1.2.2 | `/workflows/{id}/nodes` (POST) | AG-UI: `TOOL_CALL_*` |
| FR22 | Users can add Control Flow nodes (If/Else, Switch, Loop) | T1-VWB §6 | 1.2.2c | `/workflows/{id}/nodes` (POST) | AG-UI: `STATE_DELTA` |
| FR23 | Users can add AskUserQuestion nodes for HITL | T1-CLAUDE §3 | 1.2.2, 2.4.1, 2.4.2 | `/workflows/{id}/nodes` (POST), `/hitl/*` | AG-UI: `CUSTOM_EVENT` (HITL) |
| FR24 | Users can connect nodes with validated type-checking | T1-VWB §5 | 1.2.1 | `/workflows/{id}/connections` | AG-UI: `STATE_DELTA` |
| FR25 | Users can define variables in namespace-isolated Variable Pool | T1-VWB §7 | 1.2.2, 1.2.2d | `/workflows/{id}/variables` | AG-UI: `STATE_DELTA` |
| FR26 | System provides undo/redo history for workflow editing | T1-VWB §2 | 1.2.1 | `/workflows/{id}/checkpoints`, `/checkpoints/{id}/rewind` | (Yjs UndoManager) |
| FR27 | Users can save and load workflow configurations as JSON | T1-VWB §8 | 1.2.4, 1.2.6 | `/workflows/{id}/export`, `/workflows/import` | — |
| FR28 | Users can zoom, pan, and use minimap for navigation | T1-VWB §5 | 1.2.1 | (frontend ReactFlow) | — |
| FR29 | Users can group nodes into reusable sub-workflows | T1-VWB §6 | 1.2.1, 2.12.1 | `/workflows/{id}/nodes` | AG-UI: `STATE_DELTA` |
| FR30 | Users can add comment annotations to nodes | T1-VWB §8 | 1.2.1 | (frontend annotation) | — |
| FR31 | System validates workflows before execution (DAG check) | T7-CANVAS §8.1 | 1.2.1, 1.2.3, 1.2.5 | `/workflows/{id}/validate` | — |

### 4. Conversational Building (7 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR32 | Users can build workflows by describing requirements in NL | T2-CONV §1-3 | 1.2.1 (Chat panel) | `/dcrl/state/{sessionId}`, `/dcrl/detect` | DCRL: `INTENT_DETECTED` |
| FR33 | System parses natural language intent and generates nodes | T2-CONV §3 | 1.2.1 (DCRL §2.1.1) | `/dcrl/detect` | DCRL: `INTENT_DETECTED`, AG-UI: `STATE_DELTA` |
| FR34 | System asks clarifying questions when confidence < 60% | T2-CONV §3 | DCRL §2.1.1 | `/dcrl/clarify`, `/dcrl/clarify/{sessionId}/response` | DCRL: `CLARIFICATION_NEEDED`, `CLARIFICATION_RECEIVED` |
| FR35 | BMB agents (Bond, Wendy, Morgan) guide structured creation | T2-CONV §5 | 1.2.1, 1.3.1, 2.2.1, 2.1.1 | `/dcrl/resolve` | DCRL: `ACTION_RESOLVED`, AG-UI: `TEXT_MESSAGE_*` |
| FR36 | Users can switch between conversational and visual modes | T2-CONV §7 | 1.2.1 (split pane) | (frontend state) | — |
| FR37 | System provides preview-before-apply for changes | T2-CONV §1 | DCRL §2.1.1 | `/dcrl/history/{sessionId}` | AG-UI: `STATE_SNAPSHOT` |
| FR38 | System learns from user feedback to improve parsing | T2-CONV §4 | DCRL §2.1.1 | `/dcrl/learn` | DCRL: `LEARNING_RECORDED` |

### 5. Chatbot Builder (15 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR39 | Users can create conversational flows using visual editor | T6-CHATBOT §1-3 | 1.3.1, 1.3.4 | `/projects/{id}/chatbots`, `/chatbots/{id}` | AG-UI: `STATE_SNAPSHOT` |
| FR40 | Users can add Conversation nodes (Start, Message, Question) | T6-CHATBOT §3 | 1.3.4 | `/chatbots/{id}/flows` | AG-UI: `STATE_DELTA` |
| FR41 | Users can add Logic nodes (Condition, Set Variable, Switch) | T6-CHATBOT §3 | 1.3.4, 1.3.1 | `/chatbots/{id}/flows` | AG-UI: `STATE_DELTA` |
| FR42 | Users can add Integration nodes (API Call, Module Trigger) | T6-INTEG | 1.3.4, 1.2.2d | `/chatbots/{id}/flows` | AG-UI: `TOOL_CALL_*` |
| FR43 | Users can add Action nodes (Send Email, Create Ticket) | T6-CHATBOT §3 | 1.3.4 | `/chatbots/{id}/flows` | AG-UI: `STATE_DELTA` |
| FR44 | Users can add NLU nodes (Intent Classification, Entity) | T6-RASA §1 | 1.3.2, 1.3.4 | `/chatbots/{id}/intents` | — |
| FR45 | Users can add MCP Tool nodes | T5-MCP | 2.1.4 | `/chatbots/{id}/flows` | AG-UI: `TOOL_CALL_*` |
| FR46 | Users can add Skill nodes | T5-MCP §5 | 3.1.3, 3.1.4 | `/chatbots/{id}/flows` | AG-UI: `TOOL_CALL_*` |
| FR47 | System provides tokenizer, featurizer, DIETClassifier | T6-RASA §1 | 1.3.2 | `/chatbots/{id}/train`, `/chatbots/{id}/training-status` | — |
| FR48 | Users can define slots for form filling with validation | T6-RASA §3-4 | 1.3.4, 1.3.2 | `/chatbots/{id}/flows` (slots config) | — |
| FR49 | Users can configure dialogue policies for state management | T6-RASA §5 | 1.3.1, 1.3.4 | `/chatbots/{id}/flows` (policies config) | — |
| FR50 | System maintains event-sourced conversation tracker | T6-RASA §2 | 1.3.6, 1.3.7 | (internal event store) | AG-UI: `MESSAGES_SNAPSHOT` |
| FR51 | Users can define fallback handlers for unrecognized intents | T6-RASA §5 | 1.3.2, 1.3.5 | `/chatbots/{id}/widget` | — |
| FR52 | Users can configure max retry attempts for slot filling | T6-RASA §4 | 1.3.4 | `/chatbots/{id}/embed-code` | — |
| FR53 | Chatbots can escalate to human agents with context | T4-CHAT §5-6 | 1.3.4, 2.6.3, 2.4.1 | `/deployments/chatwoot` | AG-UI: `CUSTOM_EVENT` (escalation) |

### 6. Voice Agent Builder (15 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR54 | Users can create voice flows using visual editor | T6-VOICE | 2.2.1 | `/projects/{id}/voice-agents`, `/voice-agents/{id}` | AG-UI: `STATE_SNAPSHOT` |
| FR55 | Users can add Voice Input nodes (Listen, DTMF, STT) | T6-VOICE §1.1 | 2.2.1, 2.2.4 | `/voice-agents/{id}/config` | AG-UI: `STATE_DELTA` |
| FR56 | Users can add Voice Output nodes (Speak, Audio, SSML) | T6-VOICE §1.1 | 2.2.1, 2.2.2, 2.2.4 | `/voice-agents/{id}/config` | AG-UI: `STATE_DELTA` |
| FR57 | Users can add Voice Control nodes (Transfer, Hold, Hang Up) | T6-LIVEKIT §7 | 2.2.1, 2.2.3 | `/voice-agents/{id}/config` | AG-UI: `STATE_DELTA` |
| FR58 | Users can add Voice Integration nodes (Module, MCP, Skill) | T6-INTEG | 2.2.1, 2.1.4 | `/voice-agents/{id}/config` | AG-UI: `TOOL_CALL_*` |
| FR59 | System provides STT via configurable providers (Deepgram) | T6-VOICE §1.1 | 2.2.4 | `/voice-providers` | — |
| FR60 | System provides TTS via configurable providers (Cartesia) | T6-VOICE §1.1 | 2.2.4, 2.2.2 | `/voice-providers` | — |
| FR61 | System performs VAD with 98.8% TPR (Silero VAD) | T6-LIVEKIT §3 | 2.2.4 | (Silero VAD processing) | — |
| FR62 | System handles turn detection (Qwen2.5-0.5B) | T6-LIVEKIT §3 | 2.2.4 | (turn detection model) | — |
| FR63 | System supports interruption handling (4-state machine) | T6-LIVEKIT §4 | 2.2.4 | (interruption state machine) | — |
| FR64 | Users can configure SSML for prosody, emphasis | T6-VOICE §1.1 | 2.2.2, 2.2.4 | `/calls/{id}/transcript` | AG-UI: `TEXT_MESSAGE_*` |
| FR65 | System supports inbound/outbound calls via Twilio SIP | T6-LIVEKIT §7 | 2.2.1, 2.2.3 | `/voice-agents/{id}/test-call` | — |
| FR66 | Voice agents can access same project RAG context | T6-INTEG | 2.2.1, 1.4.1 | AgentOS: `/knowledge/*` | — |
| FR67 | Users can configure voice personas | T8-AIGEN §4 | 2.2.2 | `/voice-agents/{id}/config` | — |
| FR68 | System performs real-time audio via WebRTC/gRPC | T6-VOICE | 2.2.3, 2.2.5, 2.2.6 | WebSocket: `/ws/voice/{agentId}` | — |

### 7. Canvas Builder (17 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR69 | Users can create AI generation workflows using canvas | T7-CANVAS §1-2 | 2.1.1 | `/projects/{id}/canvas`, `/canvas/{id}` | AG-UI: `STATE_SNAPSHOT` |
| FR70 | Users can add Generation nodes (Image, Video, Audio, 3D) | T7-CANVAS §5 | 2.1.3, 2.1.7 | `/canvas/{id}/nodes` | AG-UI: `STATE_DELTA` |
| FR71 | Users can add Control nodes (Merge, Split, Switch, Loop) | T7-CANVAS §5 | 2.1.1 | `/canvas/{id}/nodes` | AG-UI: `STATE_DELTA` |
| FR72 | Users can add Enhancement nodes (Upscale, Denoise) | T8-AIGEN §7 | 2.1.3, 2.1.7 | `/canvas/{id}/nodes` | AG-UI: `STATE_DELTA` |
| FR73 | Users can add I/O nodes (Upload, Download, URL) | T7-CANVAS §5 | 2.1.7, 2.1.1 | `/canvas/{id}/nodes` | AG-UI: `STATE_DELTA` |
| FR74 | Users can add MCP Tool nodes | T5-MCP | 2.1.4, 2.1.5, 2.1.6 | `/canvas/{id}/nodes` | AG-UI: `TOOL_CALL_*` |
| FR75 | Users can add Skill nodes | T5-MCP §5 | 3.1.3, 3.1.4 | `/canvas/{id}/nodes` | AG-UI: `TOOL_CALL_*` |
| FR76 | Users can converse with "Artie" agent for NL building | T7-CANVAS §6 | 2.1.1 (Artie chat) | `/dcrl/*` (Artie), AgentOS `/agents/artie/runs` | DCRL: `*`, AG-UI: `TEXT_MESSAGE_*` |
| FR77 | System executes DAGs with topological sort | T7-CANVAS §8.1, §9 | 2.1.8, 1.2.3 | `/canvas/{id}/execute` | AG-UI: `RUN_*`, `STEP_*` |
| FR78 | System supports partial re-execution (changed nodes only) | T7-CANVAS §9 | 2.1.1, 1.2.3 | `/canvas/{id}/execute/stream` | AG-UI: `STEP_STARTED`, `STEP_FINISHED` |
| FR79 | System caches intermediate node outputs | T7-CANVAS §13 | 2.1.7, 2.1.8 | `/canvas/{id}/preview` | AG-UI: `STATE_SNAPSHOT` |
| FR80 | Users can configure Brand RAG for guidelines | T7-CANVAS §11 | 2.1.1, 2.1.3 | AgentOS: `/knowledge/*` | — |
| FR81 | System provides cost estimation before execution | T8-AIGEN §10 | 2.1.9, 2.1.3 | `/canvas/{id}/cost-estimate` | — |
| FR82 | Users can queue batch jobs | T7-CANVAS §9 | 2.1.8 | `/canvas/{id}/batch` | — |
| FR83 | Canvas can be triggered by Chatbot/Voice events | T6-INTEG | 2.1.1, 1.3.4 | (trigger integration) | — |
| FR84 | Users can configure AI providers (fal.ai) | T8-AIGEN §6 | 2.1.3, 1.10.4 | (provider config) | — |
| FR85 | System supports 50+ node types (ComfyUI parity) | T7-CANVAS §5 | 2.1.1, 2.14.5 | `/canvas/{id}/nodes` | AG-UI: `STATE_DELTA` |

### 8. Knowledge Base / RAG (14 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR86 | Users can create knowledge bases scoped to projects | T0-RAG | 1.4.1 | `/projects/{id}/knowledge-bases` | — |
| FR87 | Users can upload documents (PDF, DOCX, TXT, MD, HTML) | T0-RAG | 1.4.2 | `/knowledge-bases/{id}/documents`, AgentOS: `/knowledge/content` | — |
| FR88 | Users can ingest web content via URL crawling | T0-RAG | 1.4.3 | `/knowledge-bases/{id}/crawl` | — |
| FR89 | System performs intelligent chunking (semantic, AST) | T0-RAG | 1.4.4 | AgentOS: `/knowledge/content/{id}/status` | — |
| FR90 | System generates embeddings via configurable providers | T0-RAG | 1.4.5 | AgentOS: `/knowledge/config` | — |
| FR91 | System supports vector search via pgvector HNSW | T0-RAG | 1.4.6 | `/knowledge-bases/{id}/query`, AgentOS: `/knowledge/search` | — |
| FR92 | System supports hybrid search (vector + BM25) | T0-RAG | 1.4.6 | `/knowledge-bases/{id}/query` | — |
| FR93 | System supports graph-based retrieval (Graphiti) | T0-RAG | 1.4.7 | `/knowledge-bases/{id}/query` (graph mode) | — |
| FR94 | System supports temporal memory queries | T0-RAG | 1.4.7 | AgentOS: `/memories` | — |
| FR95 | System performs reranking (Cohere, cross-encoder) | T0-RAG | 1.4.5 | `/knowledge-bases/{id}/config` | — |
| FR96 | Users can view source citations and confidence | T4-EMBED | 1.4.8, 1.3.3 | (query response includes citations) | — |
| FR97 | RAG context shared across all builders in project | T6-INTEG | 1.4.1 | AgentOS: `/knowledge/*` (project scoped) | — |
| FR98 | Users can configure retrieval parameters | T0-RAG | 1.4.5 | `/knowledge-bases/{id}/config` | — |
| FR99 | System prevents cross-tenant RAG poisoning | T4-SEC §5 | 1.10.3 | (DB-level RLS on knowledge_bases) | — |

### 9. MCP Server Marketplace (14 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR100 | Users can browse MCP servers from Official Registry | T5-MCP §1 | 3.2.1 | `/mcp/servers`, `/mcp/registry/sync` | — |
| FR101 | Users can browse MCP servers from Smithery.ai | T5-MCP §1.2 | 3.2.1 | `/mcp/registry/sources` | — |
| FR102 | Users can search with semantic search | T5-MCP §7.1 | 3.2.2 | `/mcp/servers/search` | — |
| FR103 | Users can filter by category, verified, popularity | T5-MCP §7.1 | 3.2.2 | `/mcp/servers/search` (query params) | — |
| FR104 | Users can view MCP server details | T5-MCP §1.1 | 3.2.3 | `/mcp/servers/{id}` | — |
| FR105 | Users can install MCP servers with one-click | T5-MCP §2-3 | 3.2.4 | `/projects/{id}/mcp/install` | — |
| FR106 | Users can configure installed MCP server settings | T5-MCP §6.1 | 3.2.5 | `/projects/{id}/mcp/{serverId}/config` | — |
| FR107 | Users can enable/disable MCP servers | T5-MCP §2.2 | 3.2.5 | `/projects/{id}/mcp/{serverId}/toggle` | — |
| FR108 | Users can set auto-approval rules for tools | T5-MCP §2.2 | 3.2.6 | `/projects/{id}/mcp/{serverId}/config` (auto-approval) | — |
| FR109 | System aggregates from multiple registries | T5-MCP §7.3 | 3.2.1 | `/mcp/registry/sources` | — |
| FR110 | System caches registry metadata | T5-MCP §7.3 | 3.2.1 | `/mcp/registry/status` | — |
| FR111 | Creators can publish custom MCP servers | T5-MCP §7.1 | 3.3.1 | `/mcp/servers` (POST) | — |
| FR112 | Creators can set pricing for MCP servers | B2-MARKET §8 | 3.3.2 | `/mcp/servers/{id}/pricing` | — |
| FR113 | System tracks MCP server usage and success rates | T4-OBS §5 | 3.3.3 | `/observability/traces` (MCP tool traces) | — |

### 10. Skills Marketplace (13 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR114 | Users can browse Skills from platform marketplace | T5-MCP §7.1 | 3.4.1 | `/skills` | — |
| FR115 | Users can browse Skills from project/user directories | T5-MCP §5.1 | 3.4.2 | `/skills` (filter by scope) | — |
| FR116 | Users can search Skills with semantic search | T5-MCP §7.1 | 3.4.1 | `/skills/search` | — |
| FR117 | Users can filter Skills by category, ratings, creator | T5-MCP §7.1 | 3.4.1 | `/skills/search` (query params) | — |
| FR118 | Users can view Skill details | T5-MCP §5.2 | 3.4.3 | `/skills/{id}` | — |
| FR119 | Users can install Skills with one-click | T5-MCP §5.1 | 3.4.4 | `/projects/{id}/skills/install` | — |
| FR120 | Users can add Skill nodes to workflows | T5-MCP §5.3 | 1.3.1, 1.3.2 | `/workflows/{id}/nodes` (Skill node type) | AG-UI: `STATE_DELTA` |
| FR121 | System validates Skill frontmatter (SKILL.md YAML) | T5-MCP §6.2 | 3.4.5 | (validation at publish time) | — |
| FR122 | System resolves Skill paths during execution | T5-MCP §5.3 | 1.6.1 | (runtime resolution) | AG-UI: `TOOL_CALL_*` |
| FR123 | Users can create custom Skills (SKILL.md format) | T5-MCP §5.2 | 3.4.6 | `/skills` (POST) | — |
| FR124 | Creators can publish Skills to marketplace | B2-MARKET | 3.4.7 | `/skills` (POST with publish flag) | — |
| FR125 | Creators can set pricing for Skills | B2-MARKET §8 | 3.4.8 | `/skills/{id}/pricing` | — |
| FR126 | System provides AI-assisted skill discovery | T5-MCP §5.4 | 3.4.9 | `/skills/search` (AI-powered) | — |

### 11. Agent Execution & Runtime (13 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR127 | System executes via Agno runtime with Claude | T0-RAG, T1-CLAUDE | 1.6.1 | AgentOS: `/agents/{id}/runs`, `/workflows/{id}/execute` | AG-UI: `RUN_*`, `STEP_*`, `TOOL_CALL_*` |
| FR128 | System manages variable pools with namespace isolation | T1-VWB §7 | 1.6.2 | `/workflows/{id}/variables` | AG-UI: `STATE_DELTA` |
| FR129 | System supports streaming via AG-UI (25 events) | T0-PROT | 1.6.3 | AgentOS: `/agui`, SSE: `/sse/*` | AG-UI: all 25 event types |
| FR130 | System supports sync and async execution | T1-VWB §8 | 1.6.1 | AgentOS: `/agents/{id}/runs` | AG-UI: `RUN_STARTED`, `RUN_FINISHED` |
| FR131 | Users can pause and resume workflows | T4-CMD §4 | 1.6.4 | `/executions/{id}/pause`, `/executions/{id}/resume` | AG-UI: `RUN_*` |
| FR132 | System enforces execution timeouts | T4-SEC §1 | 1.6.5 | (timeout config per workflow) | AG-UI: `RUN_ERROR` |
| FR133 | System detects and prevents infinite loops | T7-CANVAS §8.1 | 1.6.6 | `/workflows/{id}/validate` | AG-UI: `RUN_ERROR` |
| FR134 | System supports scheduled/cron-based triggers | T8-GAPS §2 | 1.6.7 | (trigger config) | — |
| FR135 | System supports webhook-triggered execution (HMAC) | T6-INTEG §4 | 1.6.8 | (webhook endpoints) | — |
| FR136 | System provides event fan-out via Redis Pub/Sub | T6-INTEG §6 | 1.6.1 | (internal Redis Pub/Sub) | — |
| FR137 | System uses PostgreSQL LISTEN/NOTIFY for sync | T6-INTEG §6 | 1.6.1 | (internal PostgreSQL NOTIFY) | — |
| FR138 | User code executes in sandboxed Firecracker MicroVMs | T4-SEC §1 | 1.6.9 | (Firecracker isolation) | — |
| FR139 | System supports Dify-style "Workflow as Tool" | T6-INTEG §12 | 1.3.5 | (workflow-as-tool integration) | AG-UI: `TOOL_CALL_*` |

### 12. Observability & Monitoring (10 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR140 | Users can view detailed execution traces (Langfuse) | T4-OBS §2.3 | 1.7.1 | `/observability/traces`, `/observability/traces/{id}` | — |
| FR141 | Users can view LLM token usage and costs | T4-OBS §4 | 1.7.2 | `/usage/summary` | — |
| FR142 | Users can view aggregated cost analytics | T4-OBS §4 | 1.7.3 | `/usage/breakdown` | — |
| FR143 | Users can configure budget alerts (80%, 100%) | T3-BILL §6 | 1.7.4 | `/alerts` (CRUD) | — |
| FR144 | Platform admins can view Command Center dashboard | T4-CMD §1-2 | 4.1.1 | (Command Center UI) | — |
| FR145 | Platform admins can view per-tenant consumption | T4-OBS §9 | 4.1.2 | `/usage/summary` (admin view) | — |
| FR146 | Platform admins can apply dynamic rate limiting | T4-SEC §3 | 4.1.3 | (rate limiting config) | — |
| FR147 | System generates Prometheus-compatible metrics | T4-OBS §6 | 4.1.4 | `/metrics` (Prometheus scrape) | — |
| FR148 | System maintains immutable audit logs (pgaudit) | T4-SEC §8 | 4.1.5 | `/admin/security/audit-logs` | — |
| FR149 | Users can export execution history | T4-OBS §8 | 1.7.5 | `/observability/traces/export` | — |

### 13. Human-in-the-Loop (6 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR150 | Users can configure approval gates | T4-CMD §3 | 1.8.1 | `/workflows/{id}/hitl-config` | — |
| FR151 | System queues HITL with AG-UI INTERRUPT events | T4-CMD §4 | 1.8.2 | `/hitl/pending` | AG-UI: `CUSTOM_EVENT` (HITL interrupt) |
| FR152 | Users can view pending approvals | T4-CMD §3 | 1.8.3 | `/hitl/pending`, `/hitl/{id}` | — |
| FR153 | Users can approve/reject/modify HITL requests | T4-CMD §3 | 1.8.4 | `/hitl/{id}/approve`, `/hitl/{id}/reject`, `/hitl/{id}/modify` | AG-UI: `CUSTOM_EVENT` (HITL response) |
| FR154 | System resumes workflow upon resolution | T4-CMD §4 | 1.8.2 | (automatic resume after HITL) | AG-UI: `RUN_STARTED` |
| FR155 | Users can configure escalation rules and timeouts | T4-CMD §3 | 1.8.5 | `/workflows/{id}/escalation` | — |

### 14. Customer Interaction (10 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR156 | Users can deploy chatbots to Chatwoot inboxes | T4-CHAT §6 | 1.9.1 | `/deployments/chatwoot` (CRUD) | — |
| FR157 | System receives messages via Agent Bot webhooks | T4-CHAT §4 | 1.9.2 | (Chatwoot webhook receiver) | — |
| FR158 | System queries project RAG for responses | T4-CHAT §11 | 1.9.3 | AgentOS: `/knowledge/search` | — |
| FR159 | Users can configure confidence thresholds | T4-CHAT §6 | 1.9.4 | `/deployments/chatwoot/{id}` (config) | — |
| FR160 | System transfers context during human handoff | T4-CHAT §6 | 1.9.5 | (Chatwoot handoff integration) | — |
| FR161 | Users can configure multi-channel support | T4-CHAT §2 | 1.9.6 | `/deployments/chatwoot/{id}` (channels) | — |
| FR162 | System displays RAG confidence and citations | T4-EMBED §1 | 1.9.3 | (query response includes citations) | — |
| FR163 | Users can embed custom React chat widgets | T4-EMBED §1-3 | 1.9.7 | `/embeds`, `/embeds/{id}/code` | — |
| FR164 | System uses ActionCable WebSocket for real-time | T4-CHAT §2 | 1.9.2 | WebSocket: `/ws/chat/{sessionId}` | — |
| FR165 | Users can configure proactive outbound messaging | T6-INTEG §6 | 1.9.8 | (outbound messaging config) | — |

### 15. Module/Workflow Marketplace (13 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR166 | Users can publish modules with versioning | B2-MARKET §8 | 3.1.1 | `/marketplace/modules` (POST), `/marketplace/modules/{id}/version` | — |
| FR167 | Users can set pricing (free, one-time, subscription) | B2-MARKET §3 | 3.1.2 | `/marketplace/modules/{id}/pricing` | — |
| FR168 | System reviews and sandbox-tests before publishing | B2-MARKET §6 | 3.1.3 | (sandbox testing pipeline) | — |
| FR169 | Users can browse with search, categories, filters | B2-MARKET §7 | 3.1.4 | `/marketplace/modules`, `/marketplace/modules/search` | — |
| FR170 | Users can view ratings, reviews, usage statistics | B2-MARKET §6 | 3.1.5 | `/marketplace/modules/{id}`, `/marketplace/modules/{id}/reviews` | — |
| FR171 | Users can install modules with one-click | B2-MARKET §7 | 3.1.6 | `/projects/{id}/marketplace/install` | — |
| FR172 | System resolves module dependencies | B2-MARKET §8 | 3.1.7 | (dependency resolution at install) | — |
| FR173 | Creators receive 85% revenue (15% platform fee) | B2-MARKET §2 | 3.1.8 | (Stripe Connect payout) | — |
| FR174 | Creators can view earnings and analytics | B2-MARKET §6 | 3.1.9 | (creator dashboard) | — |
| FR175 | System provides 24-hour auto-refund for crashes | B2-MARKET §6 | 3.1.10 | (auto-refund trigger) | — |
| FR176 | System holds payments in 7-day escrow | B2-MARKET §4 | 3.1.8 | (Stripe Connect escrow) | — |
| FR177 | Users can fork and remix public modules | T7-CANVAS §10 | 3.1.11 | `/workflows/{id}/fork` | — |
| FR178 | Users can create module bundles | B2-MARKET §8 | 3.1.12 | (bundle management) | — |

### 16. UI Generation (8 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR179 | System generates UIs from workflow definitions | T3-UIGEN §6-7 | 2.2.1 | (UI generation engine) | A2UI: `BEGIN_RENDERING` |
| FR180 | System maps agent inputs to form components | T3-UIGEN §6 | 2.2.2 | (form mapping) | A2UI: `SURFACE_UPDATE` |
| FR181 | System generates multi-step wizards | T3-UIGEN §7 | 2.2.3 | (wizard generation) | A2UI: `SURFACE_UPDATE` |
| FR182 | Users can customize UI themes (CSS variables) | T5-WHITE §1 | 2.2.4 | (theme config) | — |
| FR183 | Users can embed UIs via iframe or Web Component | T3-UIGEN §10 | 2.2.5 | `/embeds/{id}/code` | — |
| FR184 | Generated UIs include embedded chat widgets | T4-EMBED | 2.2.6 | (chat widget injection) | A2UI: `SURFACE_UPDATE` |
| FR185 | Generated UIs render using shadcn/ui | T3-UIGEN §4 | 2.2.1 | (component rendering) | A2UI: `BEGIN_RENDERING`, `SURFACE_UPDATE` |
| FR186 | System provides REST/GraphQL API endpoints | T3-UIGEN §12 | 2.2.7 | `/api/*` (REST), `/graphql` (GraphQL) | — |

### 17. Billing & Usage (10 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR187 | System meters all AI usage to platform credits | T3-BILL §5 | 1.10.1 | `/billing/usage` | — |
| FR188 | Users can view usage in dollar amounts | B3-PRICE §3 | 1.10.2 | `/billing/usage` | — |
| FR189 | Users can view real-time usage widget | T4-CMD | 1.10.3 | `/billing/usage` (real-time) | — |
| FR190 | System supports tiered subscription plans | B3-PRICE §4 | 1.10.4 | `/billing/subscription` (CRUD) | — |
| FR191 | System enforces soft warnings (80%) and hard caps (150%) | T3-BILL §6 | 1.10.5 | (usage limit enforcement) | — |
| FR192 | Users can configure hard cap vs. overage | T3-BILL §6 | 1.10.5 | `/billing/subscription` (config) | — |
| FR193 | Users can view usage forecasts | T3-BILL §10 | 1.10.6 | `/usage/forecast` | — |
| FR194 | Users can access self-serve billing portal | T3-BILL §1 | 1.10.7 | `/billing/portal` | — |
| FR195 | System generates usage-based invoices | T3-BILL §1 | 1.10.8 | `/billing/invoices` | — |
| FR196 | System supports Stripe Billing Meters | T3-BILL §1.4 | 1.10.1 | (Stripe Billing Meters API) | — |

### 18. Collaboration & Versioning (9 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR197 | Multiple users can edit simultaneously (Yjs CRDT) | T4-COLLAB §2 | 5.1.1 | WebSocket: `/workflows/{id}/collaborate` | (Yjs protocol) |
| FR198 | Users can see collaborator cursors and presence | T4-COLLAB §5 | 5.1.2 | `/workflows/{id}/presence` | (Yjs awareness) |
| FR199 | System maintains workflow version history | T4-VER §2 | 5.2.1 | `/workflows/{id}/versions`, `/workflows/{id}/checkpoints` | — |
| FR200 | Users can view visual diffs (jsondiffpatch) | T4-VER §3 | 5.2.2 | `/workflows/{id}/versions/diff`, `/workflows/{id}/checkpoint-diff` | — |
| FR201 | Users can rollback to any previous version | T4-VER §2 | 5.2.3 | `/workflows/{id}/versions/{versionId}/rollback`, `/checkpoints/{id}/rewind` | — |
| FR202 | Users can add comments for discussion | T4-COLLAB §4 | 5.1.3 | `/workflows/{id}/comments` (CRUD) | — |
| FR203 | Users can configure A/B testing (Bayesian) | T4-VER §4 | 5.2.4 | (A/B testing config) | — |
| FR204 | Users can set up promotion pipelines | T4-VER §6 | 5.2.5 | (promotion pipeline config) | — |
| FR205 | Users can configure feature flags (LaunchDarkly) | T4-VER §6 | 5.2.6 | (LaunchDarkly integration) | — |

### 19. White-Label & Agency (8 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR206 | Agencies can create sub-accounts for clients | T8-UI §1 | 4.2.1 | `/agency/clients` (CRUD) | — |
| FR207 | Agencies can view per-client usage breakdown | T5-WHITE §5 | 4.2.2 | `/agency/clients/{id}/usage` | — |
| FR208 | Agencies can configure markup margins | T3-BILL §7 | 4.2.3 | (agency billing config) | — |
| FR209 | Agencies can white-label invoices | T5-WHITE §4 | 4.2.4 | (white-label invoice config) | — |
| FR210 | Users can configure custom domains | T5-WHITE §3 | 4.2.5 | `/agency/branding/domain` | — |
| FR211 | Users can customize branding (logo, colors, fonts) | T5-WHITE §2 | 4.2.6 | `/agency/branding` | — |
| FR212 | Users can configure custom email domains | T5-WHITE §4 | 4.2.7 | `/agency/branding/email` | — |
| FR213 | White-label supports custom SSO | T5-SSO | 4.2.8 | `/admin/sso/*` (white-label SSO) | — |

### 20. Enterprise & Security (11 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR214 | System provides SOC 2 Type II documentation | T4-SEC §8 | 4.3.1 | (compliance documentation) | — |
| FR215 | System supports GDPR data subject requests | T4-SEC §8 | 4.3.2 | (GDPR data export/deletion) | — |
| FR216 | System supports data residency requirements | T4-SEC §8 | 4.3.3 | (region-specific deployment) | — |
| FR217 | System applies NeMo Guardrails for prompt injection | T4-SEC §2 | 4.3.4 | (guardrails processing) | — |
| FR218 | System sanitizes inputs and filters outputs | T4-SEC §2 | 4.3.4 | (input/output filtering) | — |
| FR219 | System enforces content moderation (no NSFW) | T4-SEC §2 | 4.3.5 | (content moderation) | — |
| FR220 | System provides AI hallucination mitigation via RAG | T0-RAG | 1.4.8 | AgentOS: `/knowledge/search` | — |
| FR221 | All user code executes in Firecracker MicroVMs | T4-SEC §1 | 4.3.6 | (Firecracker isolation) | — |
| FR222 | System enforces rate limiting at API gateway | T4-SEC §3 | 4.3.7 | (API gateway rate limiting) | — |
| FR223 | System provides DDoS protection via WAF | T4-SEC §3 | 4.3.7 | (WAF integration) | — |
| FR224 | Voice agents limited to pre-approved actions | T4-SEC §6 | 1.5.7 | (voice action allowlist) | — |

### 21. Self-Hosted Deployment (8 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR225 | Users can deploy via Docker Compose | T5-DEPLOY §1 | 4.4.1 | (deployment docs) | — |
| FR226 | Users can deploy via Helm charts for K8s | T5-DEPLOY §2 | 4.4.2 | (deployment docs) | — |
| FR227 | Users can configure external PostgreSQL | T5-DEPLOY §1-2 | 4.4.3 | (deployment config) | — |
| FR228 | Users can configure external Redis | T5-DEPLOY §1-2 | 4.4.3 | (deployment config) | — |
| FR229 | Users can configure custom LLM endpoints (BYOM) | T5-DEPLOY §8 | 4.4.4 | (BYOM config) | — |
| FR230 | Self-hosted supports air-gapped installation | T5-DEPLOY §3 | 4.4.5 | (Harbor registry) | — |
| FR231 | Self-hosted supports internal SSO providers | T5-SSO | 4.4.6 | (internal SSO config) | — |
| FR232 | Users can configure Velero for backup/DR | T5-DEPLOY §8 | 4.4.7 | (backup config) | — |

### 22. API & SDK Export (10 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR233 | Users can export as Claude Agent SDK code | T1-FRAME §5-6 | 2.3.1 | `/workflows/{id}/export?format=claude-sdk` | — |
| FR234 | Users can export as Agno framework code | T1-FRAME §5-6 | 2.3.2 | `/workflows/{id}/export?format=agno` | — |
| FR235 | Users can export as LangGraph adapter code | T1-FRAME §5-6 | 2.3.3 | `/workflows/{id}/export?format=langgraph` | — |
| FR236 | Users can export as CrewAI adapter code | T1-FRAME §5-6 | 2.3.4 | `/workflows/{id}/export?format=crewai` | — |
| FR237 | System provides REST API with OpenAPI spec | T3-UIGEN §12 | 2.3.5 | `/api/*` (OpenAPI at `/openapi.yaml`) | — |
| FR238 | System provides GraphQL API | T3-UIGEN §12 | 2.3.5 | `/graphql` | — |
| FR239 | System provides SSE streaming endpoints | T0-PROT | 2.3.6 | `/sse/*`, AgentOS: `/agui` | AG-UI: all 25 event types |
| FR240 | System provides iOS, Android, JS, Python SDKs | T8-GAPS §3 | 2.3.7 | (SDK documentation) | — |
| FR241 | API responses include rate limit headers | T4-SEC §3 | 2.3.5 | (X-RateLimit-* headers) | — |
| FR242 | Users can configure scoped API keys | T8-UI §5 | 1.10.9 | `/api-keys` | — |

### 23. Cross-Builder Integration (6 FRs)
| FR# | Requirement | Source | UX Screen | API Endpoint | Protocol Event |
|-----|-------------|--------|-----------|--------------|----------------|
| FR243 | Module workflows callable from Chatbots (<500ms) | T6-INTEG §11-12 | 1.3.5 | AgentOS: `/a2a/agents/{id}/v1/message:send` | A2A: agent discovery, messaging |
| FR244 | Voice agents can call Modules via gRPC (<50ms) | T6-INTEG §6 | 1.5.5 | (gRPC bidirectional stream) | A2A: agent messaging |
| FR245 | Canvas can be triggered by Chatbot/Voice events | T6-INTEG, T7-CANVAS §7 | 2.1.1 | (event trigger integration) | A2A: agent messaging |
| FR246 | All builders share same project RAG context | T0-RAG | 1.4.1 | AgentOS: `/knowledge/*` (project scoped) | — |
| FR247 | State changes propagate via PostgreSQL NOTIFY (<10ms) | T6-INTEG §6 | 1.6.1 | (PostgreSQL LISTEN/NOTIFY) | — |
| FR248 | Events fan out via Redis Pub/Sub (<200ms) | T6-INTEG §6 | 1.6.1 | (Redis Pub/Sub) | — |

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

**Coverage: 100%** (248/248 FRs have validated research source documents across 35 research files)

**UX Traceability: 100%** (248/248 FRs mapped to 146 wireframes from UX Design Specification)

---

## Non-Functional Requirements

**Total: 70 NFRs | 9 Categories | 100% Research Coverage**

### NFR-PERF: Performance Requirements

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

### NFR-SEC: Security Requirements

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

### NFR-SCALE: Scalability Requirements

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

### NFR-REL: Reliability Requirements

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

### NFR-ACC: Accessibility Requirements

| ID | Requirement | Target | Source | API Endpoint | Protocol Event |
|----|-------------|--------|--------|--------------|----------------|
| NFR-ACC-01 | WCAG compliance | Level AA for all platform UI | T8-UI | (frontend implementation) | — |
| NFR-ACC-02 | Color contrast validation | Automated WCAG contrast checks in theme system | T5-WHITE | `/api/v1/white-label/themes` | — |
| NFR-ACC-03 | Keyboard navigation | Full keyboard accessibility for visual builders | T1-VWB | (frontend implementation) | — |
| NFR-ACC-04 | Screen reader support | ARIA labels for ReactFlow nodes and controls | T1-VWB | (frontend implementation) | — |
| NFR-ACC-05 | Voice agent accessibility | Visual feedback for voice status and transcripts | T6-VOICE | (frontend) | AG-UI: `TEXT_MESSAGE_*`, `ACTIVITY_*` |

### NFR-INT: Integration Requirements

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

### NFR-OBS: Observability Requirements

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

### NFR-MAINT: Maintainability Requirements

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

### NFR-COMP: Compliance Requirements

| ID | Requirement | Target | Source | API Endpoint | Protocol Event |
|----|-------------|--------|--------|--------------|----------------|
| NFR-COMP-01 | SOC 2 Type II | Full compliance by Year 2 | T4-SEC | `/api/v1/audit/logs` | — |
| NFR-COMP-02 | GDPR | Data residency, right to deletion, DPA | T4-SEC | `/api/v1/users/me/data-export`, `/api/v1/users/me/delete` | — |
| NFR-COMP-03 | EU AI Act | Compliance by August 2026 enforcement | T4-SEC | (AI transparency documentation) | — |
| NFR-COMP-04 | HIPAA | BAA available for healthcare customers | T4-SEC | (BAA contract process) | — |
| NFR-COMP-05 | Air-gapped deployment | Harbor registry for isolated environments | T5-DEPLOY | (self-hosted installation) | — |
| NFR-COMP-06 | Data sovereignty | Region-specific deployment options | T5-DEPLOY | `/api/v1/settings/data-residency` | — |
| NFR-COMP-07 | Audit trail retention | 7 years for compliance logs | T4-SEC | `/api/v1/audit/logs` | — |

### Non-Functional Requirements Summary

| Category | NFR Count |
|----------|-----------|
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

**NFR Source Key:**
- ARCH = architecture-synthesis-2026-01-23.md
- MP = agentic-platform-master-plan-2026-01-20.md
- T0-T8 = Research documents (see FR Source Key)
- B1-B3 = Business research documents

---

## UX Traceability Matrix

**Reference:** UX Design Specification (`ux-design-specification.md`)
**Total Screens:** 146 wireframes across 6 phases
**Total Components:** 156+ shadcn/ui components
**Coverage:** 100% (248/248 FRs mapped to screens)

### Screen ID Reference

| Phase | Screen ID Range | Description |
|-------|-----------------|-------------|
| Phase 1 | 1.1.x - 1.10.x | Foundation Platform (49 screens) |
| Phase 2 | 2.1.x - 2.14.x | Full Builder Suite (46 screens) |
| Phase 3 | 3.1.x - 3.5.x | Marketplace & Economy (18 screens) |
| Phase 4 | 4.1.x - 4.9.x | Enterprise & Agency (26 screens) |
| Phase 5 | 5.1.x - 5.2.x | Collaboration (5 screens) |
| Phase 6 | 6.1.x - 6.5.x | Future Capabilities (7 screens) |

### Key UX Patterns

| Pattern | Description | FR Coverage |
|---------|-------------|-------------|
| **DCRL (Detect-Clarify-Resolve-Learn)** | Conversational building with intent parsing, clarification at <60% confidence, preview-before-apply | FR32-FR38, all builder screens |
| **Split-Pane Layout** | KB Panel (240px) + Canvas (flex-1) + Chat Agent (320px) | 1.2.1, 1.3.1, 2.1.1, 2.2.1 |
| **Agent Personalities** | Bond (Module), Wendy (Chatbot), Morgan (Voice), Artie (Canvas) | FR35, all builder screens |
| **Node Configuration Panel** | Slide-out/modal for node settings | 1.2.2, 1.2.2a-f, 2.1.2 |
| **Consent Dialog** | Explicit approval for sensitive operations | 2.1.6 (MCP Tool Consent) |

### Component Library Reference

| Category | Components | Usage |
|----------|------------|-------|
| **Forms** | Input, Select, Checkbox, RadioGroup, Switch, Slider, Textarea | All configuration screens |
| **Data Display** | Table, Card, Badge, Avatar, Progress | Dashboards, lists, status |
| **Feedback** | Alert, AlertDialog, Toast, Tooltip | Validation, errors, success |
| **Navigation** | Tabs, Breadcrumb, Sidebar | Multi-step flows, settings |
| **Overlay** | Dialog, Sheet, Popover | Modals, panels, tooltips |
| **Canvas** | ReactFlow, Minimap, Controls | All builder canvases |
| **Collaboration** | Yjs awareness, cursors, presence | 5.1.x screens |

### FR-to-Screen Quick Reference

#### Account & Identity (FR1-FR7) → Screens: 1.1.x, 1.10.x, 4.4.x
#### Workspace & Project (FR8-FR16) → Screens: 1.5.x, 1.10.4, 2.13.x, 4.4.2
#### Module Builder (FR17-FR31) → Screens: 1.2.x
#### Conversational Building (FR32-FR38) → Screens: 1.2.1, 1.3.1, 2.1.1, 2.2.1 (DCRL pattern)
#### Chatbot Builder (FR39-FR53) → Screens: 1.3.x, 2.4.x, 2.6.x
#### Voice Agent Builder (FR54-FR68) → Screens: 2.2.x
#### Canvas Builder (FR69-FR85) → Screens: 2.1.x
#### Knowledge Base / RAG (FR86-FR99) → Screens: 1.4.x
#### MCP Server Marketplace (FR100-FR113) → Screens: 3.2.x, 3.3.x
#### Skills Marketplace (FR114-FR126) → Screens: 3.1.x, 3.3.x
#### Agent Execution & Runtime (FR127-FR139) → Screens: 1.2.3, 1.8.2, 2.3.1
#### Observability & Monitoring (FR140-FR149) → Screens: 1.8.x, 2.3.1, 4.7.3
#### Human-in-the-Loop (FR150-FR155) → Screens: 2.4.x
#### Customer Interaction (FR156-FR165) → Screens: 2.6.x
#### Module/Workflow Marketplace (FR166-FR178) → Screens: 3.1.x, 3.3.x, 3.5.x
#### UI Generation (FR179-FR186) → Screens: 2.14.x, 6.2.x
#### Billing & Usage (FR187-FR196) → Screens: 1.6.x, 2.1.9, 2.3.1
#### Collaboration & Versioning (FR197-FR205) → Screens: 5.1.x, 5.2.x, 2.7.x
#### White-Label & Agency (FR206-FR213) → Screens: 4.1.x, 4.4.1
#### Enterprise & Security (FR214-FR224) → Screens: 4.7.x, 4.8.x
#### Self-Hosted Deployment (FR225-FR232) → Screens: 6.3.1
#### API & SDK Export (FR233-FR242) → Screens: 1.2.4-1.2.6, 2.9.x, 6.1.x, 6.2.x
#### Cross-Builder Integration (FR243-FR248) → Screens: 1.4.1, 5.1.3, all builder screens

---

## Implementation Guides Reference

| Document | Purpose | FR Coverage |
|----------|---------|-------------|
| `ag-ui-integration-guide.md` | AGENT_CONTENT_ZONE specs, A2UI schema, streaming patterns, screen-level zones | FR179-FR186 (UI Generation), all streaming screens |
| `protocol-stack-specification.md` | AG-UI events, A2A messages, MCP tool calls, DCRL integration | All protocol-related FRs |
| `project-context.md` | 91 implementation rules, TypeScript patterns, React hooks, testing | All implementation |

_See `planning-artifacts/` for full documentation set._
