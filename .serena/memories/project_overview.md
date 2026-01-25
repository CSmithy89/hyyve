# Hyyve Platform - Project Overview

## Purpose

Hyyve is an agentic RAG platform for building AI-powered workflows, chatbots, voice agents, and canvas-based media pipelines. It features four primary AI agents (Bond, Wendy, Morgan, Artie) that assist users in building automation tools through conversational interfaces.

## Tech Stack

- **Frontend:** Next.js 16.x, React 19.x, TypeScript 5.x
- **State Management:** Zustand 5.x (NOT Redux)
- **Flow Editor:** @xyflow/react 12.x
- **Collaboration:** Yjs 14.x
- **UI Components:** shadcn/ui, Radix UI, Tailwind CSS
- **Agent Protocol:** AG-UI (SSE streaming), A2A (Agent-to-Agent)
- **Backend:** AgentOS (Agno/FastAPI) + Supabase
- **Auth:** Clerk
- **Testing:** Vitest (unit), Playwright (e2e)

## Project Structure

```
/
├── _bmad-output/          # Planning artifacts (PRD, architecture, epics, UX)
│   ├── planning-artifacts/
│   │   ├── api-endpoints.md      # API reference
│   │   ├── prd.md                # 248 functional requirements
│   │   ├── architecture.md       # 8 ADRs
│   │   ├── epics.md              # User stories
│   │   └── research/             # 35+ research docs
│   └── project-context.md        # Tech stack & patterns
├── tests/                 # Test files
├── CLAUDE.md             # AI development guidelines
└── package.json          # Dependencies & scripts
```

## Key Agents

- **Bond** - Module Builder (workflows, nodes)
- **Wendy** - Chatbot Builder (intents, flows)
- **Morgan** - Voice Agent Builder (STT/TTS)
- **Artie** - Canvas Builder (media generation)

## Planning Artifacts

All features trace to PRD requirements (FR1-FR248). Always check:

- `api-endpoints.md` before building APIs
- `agentos-integration-spec.md` for agent work
- `ux-design-specification.md` for UI components
