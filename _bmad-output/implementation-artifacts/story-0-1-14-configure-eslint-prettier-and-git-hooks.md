# Story 0.1.14: Configure ESLint, Prettier, and Git Hooks

## Status

**done**

## Epic

**0.1 - Project Foundation & Infrastructure Setup**

## User Story

As a **developer**,
I want **code quality tools configured**,
So that **code style is consistent across the team**.

## Acceptance Criteria

### AC1: ESLint Configuration

- **Given** the monorepo exists
- **When** I check ESLint configuration
- **Then** `eslint.config.mjs` exists at project root
- **And** TypeScript ESLint plugin is configured
- **And** custom rules for unused variables are set

### AC2: Prettier Configuration

- **Given** ESLint is configured
- **When** I check Prettier configuration
- **Then** `.prettierrc` exists at project root
- **And** consistent style settings are defined

### AC3: Husky Git Hooks

- **Given** code quality tools are configured
- **When** I check Husky setup
- **Then** Husky is installed
- **And** `.husky/pre-commit` runs lint-staged
- **And** `.husky/commit-msg` validates conventional commits

### AC4: lint-staged Configuration

- **Given** Husky hooks exist
- **When** I check lint-staged
- **Then** lint-staged configuration exists in package.json
- **And** TypeScript files run ESLint and typecheck
- **And** JSON/MD/YAML files run Prettier

### AC5: Commitlint Configuration

- **Given** commit-msg hook exists
- **When** I check commitlint
- **Then** commitlint.config.js exists
- **And** conventional commits format is enforced

## Technical Notes

### Conventional Commit Format

```
type(scope): subject

feat     - New feature
fix      - Bug fix
docs     - Documentation
style    - Code style (formatting)
refactor - Refactoring
test     - Adding tests
chore    - Maintenance
```

### lint-staged Configuration (in package.json)

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "bash -c 'pnpm typecheck'"],
    "*.{json,md,yml,yaml}": ["prettier --write --ignore-unknown"]
  }
}
```

## Files to Create

| File | Purpose |
|------|---------|
| `commitlint.config.js` | Conventional commits configuration |
| `.husky/commit-msg` | Commit message validation hook |

## Files to Modify

| File | Changes |
|------|---------|
| `package.json` | Add commitlint dependencies |

## Dependencies

### Story Dependencies

- **Story 0.1.1** (Scaffold Turborepo) - Package structure must exist

### Package Dependencies

- `@commitlint/cli@^19.0.0` - Commit message linter
- `@commitlint/config-conventional@^19.0.0` - Conventional commits config

## Test Strategy

### Unit Tests

1. **File Existence:**
   - Verify eslint.config.mjs exists
   - Verify .prettierrc exists
   - Verify .husky/pre-commit exists
   - Verify .husky/commit-msg exists
   - Verify commitlint.config.js exists

2. **Configuration Content:**
   - Verify ESLint TypeScript plugin configured
   - Verify Prettier settings defined
   - Verify lint-staged configuration exists
   - Verify commitlint uses conventional config

## Definition of Done

- [x] ESLint configured with TypeScript plugin
- [x] Prettier configured with consistent style
- [x] Husky pre-commit hook runs lint-staged
- [x] Husky commit-msg hook validates conventional commits
- [x] commitlint configured with conventional commits
- [x] lint-staged runs ESLint, Prettier, and typecheck
- [x] `pnpm build` succeeds
- [x] `pnpm typecheck` passes

---

## Code Review

**Date:** 2026-01-26
**Reviewer:** Claude (Automated)
**Verdict:** APPROVED

### Summary

| Severity | Count |
|----------|-------|
| HIGH | 0 |
| MEDIUM | 0 |
| LOW | 0 |
| INFO | 2 |

### Findings

#### INFO-1: Most Infrastructure Pre-Existed
- **Issue:** ESLint, Prettier, Husky, and lint-staged were already configured
- **Recommendation:** Story completed the setup by adding commitlint

#### INFO-2: CommonJS Module Style
- **File:** `commitlint.config.js`
- **Issue:** Uses CommonJS module.exports (required by commitlint)
- **Recommendation:** Keep as-is; commitlint requires CommonJS config

### Files Created

| File | Lines | Purpose |
|------|-------|---------|
| `commitlint.config.js` | 44 | Conventional commits config |
| `.husky/commit-msg` | 1 | Commit message validation hook |

### Files Modified

| File | Changes |
|------|---------|
| `package.json` | Added @commitlint/cli, @commitlint/config-conventional |

### Test Results

- **ATDD Tests:** 17/17 passed
- **TypeScript:** No errors
- **Build:** Successful

---

*Created: 2026-01-26*
*Epic: E0.1 - Project Foundation & Infrastructure Setup*
