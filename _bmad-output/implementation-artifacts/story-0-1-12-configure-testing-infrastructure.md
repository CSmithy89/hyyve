# Story 0.1.12: Configure Testing Infrastructure

## Status

**done**

## Epic

**0.1 - Project Foundation & Infrastructure Setup**

## User Story

As a **developer**,
I want **testing infrastructure configured**,
So that **code quality is ensured from the start**.

## Acceptance Criteria

### AC1: Unit Testing Framework Installed

- **Given** the monorepo is set up
- **When** I configure testing
- **Then** `vitest@4.0.x` is installed
- **And** `@vitest/coverage-v8` is installed for coverage

### AC2: E2E Testing Framework Installed

- **Given** the unit testing framework is installed
- **When** I configure E2E testing
- **Then** `@playwright/test@1.51.0` is installed
- **And** browsers can be installed via `pnpm exec playwright install`

### AC3: Component Testing Libraries Installed

- **Given** the testing frameworks are installed
- **When** I configure component testing
- **Then** `@testing-library/react` is installed
- **And** `@testing-library/jest-dom` is installed

### AC4: Vitest Configuration

- **Given** Vitest is installed
- **When** I check the configuration
- **Then** `vitest.config.ts` exists at project root
- **And** it supports React with jsdom environment
- **And** it supports TypeScript path aliases
- **And** setup file is configured

### AC5: Playwright Configuration

- **Given** Playwright is installed
- **When** I check the configuration
- **Then** `playwright.config.ts` exists at project root
- **And** it targets Chromium, Firefox, and WebKit browsers
- **And** it configures parallel execution
- **And** it configures screenshot/video on failure

### AC6: Test Scripts in Pipeline

- **Given** testing is configured
- **When** I check the package.json
- **Then** `test:unit` script runs Vitest
- **And** `test:e2e` script runs Playwright
- **And** `test:unit:coverage` script runs coverage
- **And** Turbo pipeline includes test task

### AC7: Coverage Reporting

- **Given** tests can run
- **When** I run coverage
- **Then** v8 coverage provider is configured
- **And** reporters include text, json, html, lcov

## Technical Notes

### Testing Library Setup

```typescript
// tests/support/vitest-setup.ts
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Clean up after each test
afterEach(() => {
  cleanup();
});
```

### Test File Patterns

- Unit tests: `**/*.test.{ts,tsx}` (co-located with source)
- E2E tests: `tests/e2e/**/*.spec.ts`
- Infrastructure tests: `tests/unit/infrastructure/**/*.test.ts`

### Coverage Thresholds (Future)

```typescript
coverage: {
  thresholds: {
    statements: 80,
    branches: 80,
    functions: 80,
    lines: 80,
  }
}
```

## Files to Create

| File | Purpose |
|------|---------|
| None | Testing setup already exists |

## Files to Modify

| File | Changes |
|------|---------|
| `package.json` | Add @testing-library packages |
| `tests/support/vitest-setup.ts` | Enable jest-dom matchers |

## Dependencies

### Story Dependencies

- **Story 0.1.1** (Scaffold Turborepo) - Package structure must exist

### Package Dependencies

- `@testing-library/react@^16.3.0` - Component testing utilities
- `@testing-library/jest-dom@^6.6.0` - Custom Jest/Vitest matchers

## Test Strategy

### Unit Tests

1. **Package Verification:**
   - Verify vitest version >= 4.0.0
   - Verify @playwright/test version 1.51.0
   - Verify @testing-library/react is installed
   - Verify @testing-library/jest-dom is installed

2. **Configuration Verification:**
   - Verify vitest.config.ts exists with jsdom environment
   - Verify playwright.config.ts exists with multi-browser config
   - Verify test scripts exist in package.json
   - Verify turbo.json includes test task

3. **Coverage Verification:**
   - Verify v8 coverage provider configured
   - Verify coverage reporters configured

### Integration Tests

```bash
pnpm test:unit
pnpm test:e2e --list
```

## Definition of Done

- [x] Vitest 4.0.x installed and configured
- [x] Playwright 1.51.0 installed and configured
- [x] @testing-library/react installed
- [x] @testing-library/jest-dom installed
- [x] Vitest config supports React + TypeScript
- [x] Playwright targets Chromium, Firefox, WebKit
- [x] Test scripts in package.json
- [x] Coverage reporting configured
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

#### INFO-1: Testing Infrastructure Mostly Pre-Existed
- **Issue:** Most testing infrastructure was already configured (vitest, playwright, configs)
- **Recommendation:** This story completed the setup by adding @testing-library packages

#### INFO-2: Jest-DOM Matchers Enabled
- **File:** `tests/support/vitest-setup.ts`
- **Issue:** Uncommented the jest-dom import to enable matchers
- **Recommendation:** Tests can now use matchers like `toBeInTheDocument()`, `toHaveClass()`

### Files Modified

| File | Lines Changed | Purpose |
|------|---------------|---------|
| `package.json` | +2 | Added @testing-library/react, @testing-library/jest-dom |
| `pnpm-lock.yaml` | +many | Package lock updates |
| `tests/support/vitest-setup.ts` | 1 | Enable jest-dom matchers import |

### Test Results

- **ATDD Tests:** 24/24 passed
- **TypeScript:** No errors
- **Build:** Successful

---

*Created: 2026-01-26*
*Epic: E0.1 - Project Foundation & Infrastructure Setup*
