# Hyyve Platform - Development Commands

## Package Manager

This project uses **pnpm** (not npm or yarn).

## Development

```bash
pnpm dev          # Start Next.js dev server
pnpm build        # Production build
pnpm start        # Start production server
```

## Testing

```bash
pnpm test              # Run all tests (unit + e2e)
pnpm test:unit         # Run Vitest unit tests
pnpm test:unit:watch   # Watch mode for unit tests
pnpm test:unit:coverage # Unit tests with coverage
pnpm test:e2e          # Run Playwright e2e tests
pnpm test:e2e:ui       # Playwright with UI
pnpm test:e2e:headed   # Playwright in headed browser
pnpm test:e2e:debug    # Debug Playwright tests
pnpm test:e2e:report   # View Playwright HTML report
```

## Code Quality

```bash
pnpm lint         # Run ESLint
pnpm lint:fix     # Auto-fix lint errors
pnpm typecheck    # Run TypeScript type checking
```

## Git Hooks (via Husky + lint-staged)

On commit, automatically runs:

- ESLint + typecheck on .ts/.tsx files
- Prettier on .json/.md/.yml/.yaml files

## Python Backend (AgentOS)

```bash
pip install agno anthropic
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Utility Commands

```bash
git status        # Check uncommitted changes
git log --oneline -10  # Recent commits
ls -la            # List files
```
