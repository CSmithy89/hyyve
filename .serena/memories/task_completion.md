# Hyyve Platform - Task Completion Checklist

## Before Marking Task Complete

### 1. Code Quality

- [ ] Run `pnpm lint` - no errors
- [ ] Run `pnpm typecheck` - no type errors
- [ ] Code follows style conventions (see style_conventions.md)

### 2. Testing

- [ ] Unit tests written for new logic (`pnpm test:unit`)
- [ ] E2E tests for new UI flows (`pnpm test:e2e`)
- [ ] All tests pass

### 3. Documentation

- [ ] Update relevant planning artifacts if specs changed
- [ ] Add JSDoc comments for public functions
- [ ] Update CLAUDE.md if new patterns introduced

### 4. Planning Alignment

- [ ] Feature maps to a PRD requirement (FR number)
- [ ] API endpoints match `api-endpoints.md`
- [ ] UI matches `ux-design-specification.md`

### 5. Git

- [ ] Changes committed with descriptive message
- [ ] No unrelated changes included
- [ ] Branch up to date with main

## Quick Validation Commands

```bash
pnpm lint && pnpm typecheck && pnpm test:unit
```

## Common Issues to Check

- AgentOS endpoints not reimplemented
- DCRL confidence thresholds respected
- SSE used for agent communication (not REST)
- Zustand used for state (not Redux)
