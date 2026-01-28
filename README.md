# Hyyve Platform

An AI-powered platform for building, deploying, and managing intelligent agents with conversational interfaces.

## Overview

Hyyve provides four specialized builders for creating AI-powered applications:

| Builder                 | Purpose                                     | Agent Personality          |
| ----------------------- | ------------------------------------------- | -------------------------- |
| **Module Builder**      | Create reusable AI modules via conversation | Bond (Concierge)           |
| **Chatbot Builder**     | Build conversational chatbots               | Wendy (Workflow Assistant) |
| **Voice Agent Builder** | Design voice-enabled AI agents              | Morgan (Data Analyst)      |
| **Canvas Builder**      | Visual node-based workflow editor           | Artie (Creative Designer)  |

## Tech Stack

### Frontend

- **Next.js 15.5.8** - React framework with App Router
- **React 19** - UI library with new `use` API
- **TypeScript 5.x** - Type safety
- **Tailwind CSS 4.x** - Styling
- **shadcn/ui** - UI components
- **Zustand 5.0.8** - State management
- **@xyflow/react 12.10.0** - Visual workflow editor

### Backend & Infrastructure

- **AgentOS (Agno 2.4.0+)** - Agent runtime with FastAPI
- **Supabase** - PostgreSQL + RLS + Realtime
- **Redis** - Caching and pub/sub
- **Temporal** - Workflow orchestration

### AI & Protocols

- **AG-UI** - Agent-to-UI streaming (SSE)
- **A2A** - Agent-to-Agent communication
- **MCP** - Model Context Protocol for tools
- **CopilotKit** - AI copilot integration

### Authentication & Payments

- **Clerk** - Consumer authentication
- **WorkOS** - Enterprise SSO/SCIM
- **Stripe** - Billing and marketplace payouts

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Python 3.11+ (for AgentOS)

### Installation

```bash
# Clone the repository
git clone https://github.com/CSmithy89/hyyve.git
cd hyyve

# Install dependencies
pnpm install

# Install Playwright browsers (for E2E tests)
pnpm exec playwright install chromium

# Set up environment variables
cp .env.test.example .env.local
# Edit .env.local with your credentials
```

### Development

```bash
# Start development server
pnpm dev

# Run linting
pnpm lint

# Run type checking
pnpm typecheck

# Run unit tests
pnpm test:unit

# Run E2E tests
pnpm test:e2e
```

## Project Structure

```
├── apps/
│   └── web/                    # Next.js frontend
├── packages/
│   └── @platform/              # Shared platform packages
├── tests/
│   ├── e2e/                    # Playwright E2E tests
│   └── support/                # Test fixtures and utilities
├── _bmad-output/
│   └── planning-artifacts/     # PRD, Architecture, Epics
└── infrastructure/             # Temporal, Redis configs
```

## Testing

| Type  | Tool              | Command          |
| ----- | ----------------- | ---------------- |
| Unit  | Vitest 4.0.x      | `pnpm test:unit` |
| E2E   | Playwright 1.51.0 | `pnpm test:e2e`  |
| Lint  | ESLint 9.x        | `pnpm lint`      |
| Types | TypeScript        | `pnpm typecheck` |

### E2E Test Structure

```
tests/
├── e2e/
│   ├── smoke.spec.ts           # Basic smoke tests
│   ├── auth/                   # Authentication flows
│   ├── builders/               # Builder-specific tests
│   └── workspace/              # Workspace management
└── support/
    └── fixtures/               # Reusable test fixtures
```

## CI/CD

GitHub Actions workflows automatically run on push and PR:

| Workflow                 | Trigger         | Purpose                      |
| ------------------------ | --------------- | ---------------------------- |
| `ci.yml`                 | Push/PR         | Lint, Unit tests, Build, E2E |
| `e2e-tests.yml`          | Push/PR         | Dedicated E2E testing        |
| `claude.yml`             | @claude mention | AI code assistance           |
| `claude-code-review.yml` | PR open         | Automated code review        |

## Documentation

| Document        | Location                                                     | Description                 |
| --------------- | ------------------------------------------------------------ | --------------------------- |
| PRD             | `_bmad-output/planning-artifacts/prd.md`                     | 248 functional requirements |
| Architecture    | `_bmad-output/planning-artifacts/architecture.md`            | 8 ADRs, system design       |
| Epics           | `_bmad-output/planning-artifacts/epics.md`                   | 58 epics, 293 stories       |
| UX Design       | `_bmad-output/planning-artifacts/ux-design-specification.md` | 146 wireframes              |
| Project Context | `_bmad-output/project-context.md`                            | 85 implementation rules     |

## AI Code Review

This repository has multiple AI review tools installed:

- **Claude Code** - @claude mentions in PRs/issues
- **CodeRabbit** - Automated PR summaries and reviews
- **CodeAnt AI** - Code quality analysis
- **Gemini Code Assist** - Google AI code assistance

## Contributing

1. Check the sprint status: `_bmad-output/implementation-artifacts/sprint-status.yaml`
2. Pick a story from the current sprint
3. Follow the development workflow in `CLAUDE.md`
4. Submit a PR - AI reviewers will automatically analyze it

## License

Private - All rights reserved.
