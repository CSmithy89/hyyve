# Hyyve Platform - Development Guidelines

## Critical Planning Artifacts

**ALWAYS reference these documents before implementing features:**

| Document              | Path                                                                              | When to Use                                    |
| --------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------- |
| **Project Context**   | `_bmad-output/project-context.md`                                                 | Tech stack, coding patterns, 91 critical rules |
| **PRD**               | `_bmad-output/planning-artifacts/prd.md`                                          | Verifying feature requirements (248 FRs)       |
| **Architecture**      | `_bmad-output/planning-artifacts/architecture.md`                                 | System design decisions (8 ADRs)               |
| **Epics & Stories**   | `_bmad-output/planning-artifacts/epics.md`                                        | Implementation tasks (59 epics, 308 stories)   |
| **UX Design**         | `_bmad-output/planning-artifacts/ux-design-specification.md`                      | UI component specs, 146 wireframes             |
| **Sprint Status**     | `_bmad-output/implementation-artifacts/sprint-status.yaml`                        | Current sprint tracking                        |
| **API Endpoints**     | `_bmad-output/planning-artifacts/api-endpoints.md`                                | All endpoints with FR mappings, payloads       |
| **OpenAPI Spec**      | `_bmad-output/planning-artifacts/openapi.yaml`                                    | Formal API spec for SDK/type generation        |
| **Protocol Events**   | `_bmad-output/planning-artifacts/protocol-events.yaml`                            | AG-UI, A2A, A2UI, DCRL event definitions       |
| **Protocol Stack**    | `_bmad-output/planning-artifacts/protocol-stack-specification.md`                 | Protocol integration details, validation       |
| **AG-UI Guide**       | `_bmad-output/planning-artifacts/ag-ui-integration-guide.md`                      | AGENT_CONTENT_ZONE, A2UI schema, streaming     |
| **AgentOS Spec**      | `_bmad-output/planning-artifacts/agentos-integration-spec.md`                     | 50+ AgentOS endpoints, memory, sessions        |
| **Cost Service**      | `_bmad-output/planning-artifacts/unified-cost-service-architecture-2026-01-23.md` | Token tracking, billing, cost estimation       |
| **Cross-Reference**   | `_bmad-output/planning-artifacts/cross-reference-matrix.md`                       | FR↔Screen↔API↔Protocol traceability            |
| **Routing Spec**      | `_bmad-output/planning-artifacts/routing-specification.md`                        | URL paths, route guards, navigation flows      |
| **Wireframe Map**     | `_bmad-output/planning-artifacts/wireframe-implementation-map.md`                 | 146 wireframes→routes→stories mapping          |
| **Stitch Wireframes** | `_bmad-output/planning-artifacts/Stitch Hyyve/`                                   | HTML/CSS reference wireframes (source files)   |
| **Arch Synthesis**    | `_bmad-output/planning-artifacts/architecture-synthesis-2026-01-23.md`            | Research summaries with code snippets          |

---

## Testing Infrastructure

### Test Stack

| Tool           | Version | Purpose             |
| -------------- | ------- | ------------------- |
| **Playwright** | 1.51.0  | E2E browser testing |
| **Vitest**     | 4.0.x   | Unit testing        |
| **ESLint**     | 9.x     | Code linting        |
| **Prettier**   | 3.x     | Code formatting     |

### Test Commands

```bash
# Run all tests
pnpm test

# Unit tests
pnpm test:unit              # Run once
pnpm test:unit:watch        # Watch mode
pnpm test:unit:coverage     # With coverage

# E2E tests
pnpm test:e2e               # Run all E2E
pnpm test:e2e:ui            # Interactive UI
pnpm test:e2e:headed        # See browser
pnpm test:e2e:debug         # Debug mode
pnpm test:e2e:report        # View HTML report
```

### Test File Locations

```
tests/
├── e2e/
│   ├── auth.setup.ts              # Clerk auth state setup
│   ├── smoke.spec.ts              # Smoke tests (run first)
│   ├── auth/
│   │   └── login.spec.ts          # Authentication flows
│   ├── builders/
│   │   ├── module-builder.spec.ts # Module Builder tests
│   │   └── canvas-builder.spec.ts # Canvas Builder tests
│   └── workspace/
│       └── workspace.spec.ts      # Workspace management
└── support/
    ├── fixtures/
    │   ├── index.ts               # Export all fixtures
    │   ├── base.fixture.ts        # Core fixtures (auth, utils)
    │   └── builder.fixture.ts     # Page objects for builders
    ├── global-setup.ts            # Pre-test setup
    ├── global-teardown.ts         # Post-test cleanup
    └── vitest-setup.ts            # Unit test setup
```

### Writing Tests

**E2E Tests (Playwright):**

```typescript
import { test, expect, testUtils } from '../../support/fixtures';
import { ModuleBuilderPage } from '../../support/fixtures/builder.fixture';

test('can create a new module', async ({ authenticatedPage: page }) => {
  const moduleBuilder = new ModuleBuilderPage(page);
  await moduleBuilder.goto();

  const moduleName = testUtils.uniqueId('test-module');
  await page.getByRole('button', { name: /create/i }).click();
  await page.getByLabel(/name/i).fill(moduleName);

  await expect(page).toHaveURL(/\/builders\/module\/[a-z0-9-]+/);
});
```

**Unit Tests (Vitest):**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('AgentCard', () => {
  it('displays agent name', () => {
    render(<AgentCard agent={mockAgent} />);
    expect(screen.getByText('Bond')).toBeInTheDocument();
  });
});
```

---

## CI/CD Pipelines

### GitHub Actions Workflows

| Workflow          | File                     | Triggers                 | Jobs                   |
| ----------------- | ------------------------ | ------------------------ | ---------------------- |
| **CI**            | `ci.yml`                 | Push/PR to main, develop | Lint, Unit, Build, E2E |
| **E2E Tests**     | `e2e-tests.yml`          | Push/PR + manual         | Multi-browser E2E      |
| **Claude Code**   | `claude.yml`             | @claude mention          | AI assistance          |
| **Claude Review** | `claude-code-review.yml` | PR open                  | Auto code review       |

### Required GitHub Secrets

| Secret                              | Purpose                    |
| ----------------------------------- | -------------------------- |
| `TEST_USER_EMAIL`                   | E2E test user email        |
| `TEST_USER_PASSWORD`                | E2E test user password     |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key           |
| `CLERK_SECRET_KEY`                  | Clerk secret key           |
| `CODECOV_TOKEN`                     | Coverage upload (optional) |

---

## MCP (Model Context Protocol)

### MCP in Hyyve Architecture

MCP defines how agents access external tools. Hyyve implements MCP for:

1. **Tool Registry** - Central catalog of available tools
2. **Skill Marketplace** - User-installable agent capabilities
3. **MCP Server Aggregation** - Combine multiple MCP servers

### MCP Tool Structure

```typescript
interface MCPTool {
  name: string;
  description: string;
  parameters: JSONSchema;
  execute: (params: unknown) => Promise<unknown>;
}

// Example tool definition
const searchTool: MCPTool = {
  name: 'web_search',
  description: 'Search the web for information',
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search query' },
    },
    required: ['query'],
  },
  execute: async ({ query }) => {
    return await performSearch(query);
  },
};
```

### MCP Endpoints (Hyyve Custom)

```
/api/v1/mcp/registry/*     # Tool registry management
/api/v1/mcp/servers/*      # MCP server aggregation
/api/v1/skills/*           # Skill marketplace
```

---

## Protocol Stack Reference

### Four Protocols

| Protocol  | Purpose                      | Transport        |
| --------- | ---------------------------- | ---------------- |
| **A2UI**  | Agent-to-UI rendering        | React components |
| **AG-UI** | Agent streaming responses    | SSE              |
| **MCP**   | Tool integration             | JSON-RPC         |
| **A2A**   | Agent-to-Agent communication | JSON-RPC         |

### Usage Patterns

```typescript
// AG-UI - Streaming agent responses
import { AGUIClient } from '@ag-ui/client';
const client = new AGUIClient({ endpoint: '/api/ag-ui' });
await client.stream(agentId, { onToken: handleToken });

// A2UI - Rendering agent output
import { A2UIRenderer } from '@copilotkit/a2ui-renderer';
<A2UIRenderer response={agentResponse} />

// MCP - Tool execution
const result = await mcpClient.executeTool('web_search', { query });

// A2A - Agent coordination
await a2aClient.send({
  from: 'bond',
  to: 'wendy',
  type: 'request',
  payload: { task: 'analyze_data' }
});
```

---

## Development Workflow

### Before Writing Code

1. **Identify the FR number** - Check PRD for the functional requirement
2. **Find the story** - Look up in `epics.md`
3. **Review UX spec** - Match the wireframe design
4. **Check project-context.md** - Follow the 91 implementation rules

### UI Implementation Workflow (MANDATORY for all screens)

1. **Find the wireframe** - Look up screen in `wireframe-implementation-map.md`
2. **Open the HTML source** - Read the exact wireframe from `Stitch Hyyve/[category]/code.html`
3. **Extract design tokens** - Use colors, spacing, typography from the wireframe's Tailwind config
4. **Match pixel-perfect** - Implement UI to match the wireframe exactly (layout, components, styling)
5. **Verify route mapping** - Ensure component is at correct route per `routing-specification.md`
6. **Mark completion** - Update story status in `sprint-status.yaml`

**Visual Fidelity Checklist (from wireframe-implementation-map.md):**

- [ ] Colors match design tokens (primary: #5048e5, bg-dark: #131221, panel-dark: #1c1a2e)
- [ ] Typography uses Inter font family with correct weights
- [ ] Spacing follows 4px grid system
- [ ] Components use shadcn/ui with Hyyve overrides
- [ ] Dark theme is default, light theme supported
- [ ] Responsive breakpoints: mobile (640px), tablet (768px), desktop (1024px+)

### API Implementation Rules

**AgentOS Endpoints (Use Directly - Don't Reimplement):**

- `/agents/*` - Agent execution, runs
- `/sessions/*` - Session management
- `/memories/*` - User/agent memory
- `/knowledge/*` - Knowledge base/RAG
- `/a2a/*` - Agent-to-agent communication
- `/agui` - AG-UI streaming interface

**Hyyve Custom Endpoints (Implement These):**

- `/api/v1/workspaces/*` - Multi-tenant structure
- `/api/v1/projects/*` - Project organization
- `/api/v1/workflows/*` - Module builder workflows
- `/api/v1/dcrl/*` - DCRL confidence routing
- `/api/v1/checkpoints/*` - Undo/redo service
- `/api/v1/mcp/registry/*` - MCP aggregation

### DCRL Pattern (Confidence Thresholds)

| Confidence | Action                    |
| ---------- | ------------------------- |
| >0.85      | Execute immediately       |
| 0.6-0.85   | Execute with confirmation |
| <0.6       | Request clarification     |

---

## AI Code Review Tools

This repository has multiple AI assistants:

| Tool            | Trigger             | Usage                           |
| --------------- | ------------------- | ------------------------------- |
| **Claude Code** | @claude in comments | Ask questions, request changes  |
| **CodeRabbit**  | Auto on PR          | Reviews, summaries, walkthrough |
| **CodeAnt AI**  | Auto on PR          | Code quality analysis           |
| **Gemini**      | Auto on PR          | Google AI assistance            |

### Interacting with AI Reviewers

```markdown
# Ask Claude a question

@claude How should I implement the DCRL pattern here?

# Ask CodeRabbit

@coderabbitai explain this function

# Record team preference with CodeAnt

@codeant-ai: Always use explicit return types
```

---

## Development MCP Servers

Claude Code has access to the following MCP servers for development assistance:

| MCP Server              | Purpose                                       | Key Tools                                                    |
| ----------------------- | --------------------------------------------- | ------------------------------------------------------------ |
| **Context7**            | Up-to-date library documentation              | `resolve-library-id`, `query-docs`                           |
| **Serena**              | Semantic code analysis & symbol-level editing | `find_symbol`, `replace_symbol_body`, `get_symbols_overview` |
| **DeepWiki**            | GitHub repository documentation               | `read_wiki_structure`, `read_wiki_contents`, `ask_question`  |
| **Playwright**          | Browser automation for E2E testing            | `browser_navigate`, `browser_click`, `browser_snapshot`      |
| **Sequential Thinking** | Structured problem-solving for complex tasks  | `sequentialthinking`                                         |
| **21st Magic**          | AI-powered UI component generation            | `21st_magic_component_builder`, `logo_search`                |
| **shadcn**              | Component registry access                     | `search_items_in_registries`, `view_items_in_registries`     |

### When to Use Each MCP

- **Context7**: Looking up current API docs for libraries (React, Next.js, Playwright, etc.)
- **Serena**: Navigating large codebases, finding symbol references, precise code edits
- **DeepWiki**: Understanding open-source projects on GitHub
- **Playwright**: Automating browser interactions, debugging E2E tests visually
- **Sequential Thinking**: Breaking down complex multi-step problems
- **21st Magic**: Generating UI components, finding logos
- **shadcn**: Adding shadcn/ui components to the project

---

## Quick Reference

### Tech Stack

- **Frontend:** Next.js 15.5.8, React 19, TypeScript 5.x
- **State:** Zustand 5.0.8 (NOT Redux)
- **Flow Editor:** @xyflow/react 12.10.0
- **Collab:** Yjs 14.0.0
- **Agent Protocol:** AG-UI (SSE), A2A (JSON-RPC), MCP
- **Backend:** AgentOS (FastAPI) + Supabase
- **Auth:** Clerk (consumer), WorkOS (enterprise)

### Agent Personalities

| Agent      | Role                   | Personality               |
| ---------- | ---------------------- | ------------------------- |
| **Bond**   | Concierge/Orchestrator | Polished, confident       |
| **Wendy**  | Workflow Assistant     | Warm, helpful             |
| **Morgan** | Data Analyst           | Precise, methodical       |
| **Artie**  | Creative/Design        | Enthusiastic, imaginative |

### Common Mistakes to Avoid

1. **Don't rebuild AgentOS endpoints** - They're already provided
2. **Don't use REST for agent chat** - Use AG-UI SSE streaming
3. **Don't skip FR validation** - Every feature maps to a PRD requirement
4. **Don't ignore confidence thresholds** - DCRL pattern is mandatory
5. **Don't hardcode agent IDs** - Use bond/wendy/morgan/artie consistently
6. **Don't skip Zod validation** - All external data must be validated
7. **Don't use 'use client' unnecessarily** - Server Components are default
8. **Don't freestyle UI designs** - Match Stitch wireframes exactly (146 screens mapped)
9. **Don't guess routes** - Verify against wireframe-implementation-map.md and routing-specification.md

---

## Research Documents

35+ research documents in `_bmad-output/planning-artifacts/research/` covering:

- Agentic protocols (AG-UI, A2A, MCP)
- MCP marketplace patterns
- Conversational builder UX
- Visual diff engine
- Voice agent integration (LiveKit, Rasa)
- Security sandboxing
- Enterprise SSO/SCIM

**Quick Access:** Use `architecture-synthesis-2026-01-23.md` for consolidated research summaries with code snippets - references all individual research docs.

---

_Last Updated: 2026-01-26_
