# Repository Guidelines

## Project Structure & Module Organization

- `apps/web/` (if present) is the Next.js app root; shared packages live under `packages/`.
- Tests live in `tests/` with E2E specs under `tests/e2e/` and shared fixtures/utilities under `tests/support/`.
- Planning and product artifacts live in `_bmad-output/` (PRD, architecture, UX specs, API docs). Use these as source-of-truth before building features.

## Key Planning Documents

| Document        | Path                                                         | Purpose                             |
| --------------- | ------------------------------------------------------------ | ----------------------------------- |
| PRD             | `_bmad-output/planning-artifacts/prd.md`                     | 248 functional requirements         |
| UX Design       | `_bmad-output/planning-artifacts/ux-design-specification.md` | 146 screen wireframes               |
| Routing Spec    | `_bmad-output/planning-artifacts/routing-specification.md`   | URL paths, guards, navigation flows |
| OpenAPI         | `_bmad-output/planning-artifacts/openapi.yaml`               | API endpoint definitions            |
| Protocol Events | `_bmad-output/planning-artifacts/protocol-events.yaml`       | AG-UI, A2A, DCRL events             |

## Build, Test, and Development Commands

- `pnpm dev`: run the Next.js dev server.
- `pnpm build`: production build; `pnpm start` serves the built app.
- `pnpm lint`: run ESLint across the repo; `pnpm lint:fix` auto-fixes where possible.
- `pnpm typecheck`: TypeScript type-checking only.
- `pnpm test`: runs unit tests then E2E tests.
- `pnpm test:unit` / `pnpm test:unit:watch` / `pnpm test:unit:coverage`: Vitest flows.
- `pnpm test:e2e` plus `:ui`, `:headed`, `:debug`, `:report` for Playwright.

## Coding Style & Naming Conventions

- TypeScript + React (Next.js). Use 2-space indentation and match existing file conventions.
- Linting: ESLint (`eslint.config.mjs`). Formatting: Prettier (`.prettierrc`).
- Tests follow `*.spec.ts` naming, e.g. `tests/e2e/smoke.spec.ts`.

## Testing Guidelines

- Unit tests: Vitest. E2E: Playwright (`playwright.config.ts`).
- Prefer adding/adjusting fixtures in `tests/support/fixtures/` when expanding E2E coverage.
- Run focused suites before full `pnpm test` to keep feedback fast.

## Commit & Pull Request Guidelines

- No explicit commit-message convention found; use short, imperative summaries (e.g., “Add e2e auth fixture”).
- PRs should reference the relevant Functional Requirement (FR) from `_bmad-output/planning-artifacts/prd.md` and the sprint status in `_bmad-output/implementation-artifacts/sprint-status.yaml`.
- Expect automated AI reviews on PRs (Claude, CodeRabbit, CodeAnt, Gemini). Keep descriptions clear and link related artifacts.

## Agent-Specific Instructions

- Before implementing features, consult `_bmad-output/project-context.md`, PRD, architecture, and UX specs as directed in `CLAUDE.md`.
- Validate that changes map to a documented requirement and update tests accordingly.
