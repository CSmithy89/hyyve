# Hyyve Platform - Code Style & Conventions

## TypeScript

- Strict mode enabled
- Use explicit return types for functions
- Prefer `type` over `interface` unless extending
- Use Zod for runtime validation

## React/Next.js

- Functional components only (no class components)
- Use React 19 `use` hook patterns
- Server Components by default, 'use client' only when needed
- File-based routing in /app directory

## State Management

- **Zustand** for global state (NOT Redux)
- Local state with useState/useReducer
- Server state with React Query

## Naming Conventions

- Components: PascalCase (`ModuleBuilder.tsx`)
- Hooks: camelCase with `use` prefix (`useWorkflow.ts`)
- Utils: camelCase (`formatDate.ts`)
- Types: PascalCase (`WorkflowNode`)
- Constants: SCREAMING_SNAKE_CASE

## File Organization

- Co-locate tests with source files (`*.test.ts`)
- Group by feature, not by type
- Keep components small and focused

## Agent Development

- Use DCRL pattern (Detect-Clarify-Resolve-Learn)
- Confidence thresholds: >0.85 execute, 0.6-0.85 confirm, <0.6 clarify
- Agent IDs: bond, wendy, morgan, artie (lowercase)

## API Patterns

- AgentOS endpoints: Use directly, don't reimplement
- Hyyve custom: `/api/v1/*` prefix
- Use SSE for agent responses, not REST polling

## Imports

- Absolute imports from project root
- Group: external packages, internal modules, types
- Sort alphabetically within groups
