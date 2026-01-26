# Story 0.1.15: Configure CI/CD Pipeline

## Status

**done**

## Epic

**0.1 - Project Foundation & Infrastructure Setup**

## User Story

As a **developer**,
I want **GitHub Actions CI/CD pipeline configured**,
So that **code is automatically tested and validated**.

## Acceptance Criteria

### AC1: CI Workflow Exists

- **Given** the repository is configured
- **When** I check `.github/workflows/`
- **Then** `ci.yml` exists with proper structure
- **And** it triggers on push to main/develop
- **And** it triggers on pull requests to main/develop

### AC2: Lint and Type Check Job

- **Given** CI workflow exists
- **When** I check the lint job
- **Then** it runs ESLint via `pnpm lint`
- **And** it runs TypeScript check via `pnpm typecheck`
- **And** it uses pnpm caching

### AC3: Unit Tests Job

- **Given** CI workflow exists
- **When** I check the unit tests job
- **Then** it runs `pnpm test:unit --coverage`
- **And** it uploads coverage to Codecov
- **And** it uses Node 20.x

### AC4: Build Job

- **Given** lint and unit tests pass
- **When** I check the build job
- **Then** it depends on lint and unit-tests jobs
- **And** it runs `pnpm build`
- **And** it uploads build artifacts

### AC5: E2E Tests Job

- **Given** build is successful
- **When** I check E2E tests
- **Then** it runs Playwright tests
- **And** it uses chromium browser
- **And** it uploads test reports

### AC6: Dedicated E2E Workflow

- **Given** E2E testing is critical
- **When** I check workflows
- **Then** `e2e-tests.yml` exists
- **And** it supports manual dispatch
- **And** it has matrix browser support structure

## Technical Notes

### CI Jobs Dependency Chain

```
lint ──┐
       ├── build ── e2e-tests
unit ──┘
```

### Required GitHub Secrets

- `CODECOV_TOKEN` - Coverage upload
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Build time env
- `TEST_USER_EMAIL` - E2E test credentials
- `TEST_USER_PASSWORD` - E2E test credentials
- `CLERK_SECRET_KEY` - Auth runtime

## Files to Verify

| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | Main CI pipeline |
| `.github/workflows/e2e-tests.yml` | Dedicated E2E tests |

## Dependencies

### Story Dependencies

- **Story 0.1.12** (Configure Testing) - Test commands must work
- **Story 0.1.14** (ESLint, Prettier) - Lint commands must work

## Test Strategy

### Unit Tests

1. **Workflow File Existence:**
   - Verify ci.yml exists
   - Verify e2e-tests.yml exists

2. **CI Workflow Content:**
   - Verify push triggers on main/develop
   - Verify PR triggers on main/develop
   - Verify lint job runs ESLint and typecheck
   - Verify unit-tests job runs with coverage
   - Verify build job has dependencies
   - Verify e2e-tests job configuration

3. **E2E Workflow Content:**
   - Verify workflow_dispatch input
   - Verify matrix browser support
   - Verify artifact uploads

## Definition of Done

- [x] `.github/workflows/ci.yml` exists and is valid
- [x] `.github/workflows/e2e-tests.yml` exists and is valid
- [x] CI has lint, unit tests, build, and E2E jobs
- [x] pnpm caching is configured
- [x] Node 20.x is used
- [x] Codecov integration configured
- [x] Build artifacts uploaded
- [x] Test reports uploaded
- [x] All ATDD tests pass

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

#### INFO-1: CI/CD Infrastructure Pre-Existed

- **Issue:** Both `ci.yml` and `e2e-tests.yml` were already configured
- **Recommendation:** Story verified existing infrastructure meets requirements

#### INFO-2: yaml Package Added

- **File:** `package.json`
- **Issue:** Added `yaml` dev dependency for ATDD test parsing
- **Recommendation:** Reasonable addition for testing YAML config files

### Files Created

| File | Lines | Purpose |
|------|-------|---------|
| `tests/unit/infrastructure/ci-cd-pipeline.test.ts` | 261 | ATDD tests for CI/CD |

### Files Verified (Pre-existing)

| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | Main CI pipeline |
| `.github/workflows/e2e-tests.yml` | Dedicated E2E tests |

### Test Results

- **ATDD Tests:** 29/29 passed
- **TypeScript:** No errors
- **Build:** Successful

---

*Created: 2026-01-26*
*Epic: E0.1 - Project Foundation & Infrastructure Setup*
