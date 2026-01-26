# Story 0.1.1: Scaffold Turborepo Monorepo with Next.js 15

## Status

**Status:** done

## Epic

**Epic 0.1:** Project Foundation & Infrastructure Setup

## User Story

As a **developer**,
I want **a properly structured Turborepo monorepo with Next.js 15 App Router**,
So that **I have a scalable foundation for the multi-package Hyyve platform**.

## Acceptance Criteria

### AC1: Project Structure Created

- **Given** I am starting the Hyyve project
- **When** I run the scaffold commands
- **Then** the following structure is created:
  ```
  apps/
    web/                    # Next.js 15 frontend
      app/                  # App Router pages
      components/           # React components
      hooks/                # Custom React hooks
      lib/                  # Utilities and clients
      stores/               # Zustand stores
  packages/
    @platform/
      ui/                   # Shared UI components
      db/                   # Supabase client & types
      auth/                 # Auth helpers
    tsconfig/               # Shared TypeScript configs
  ```

### AC2: Package Manager Configuration

- **And** `pnpm` is configured as the package manager

### AC3: Turbo Pipeline Configuration

- **And** `turbo.json` defines build, lint, and test pipelines

### AC4: Workspace Configuration

- **And** root `package.json` has workspace configuration

### AC5: Node Version Specification

- **And** `.nvmrc` specifies Node.js 20.x

## Technical Notes

- Use `pnpm create turbo@latest` as starting point
- Configure `next@15.5.8` and `react@19.x`
- Set up path aliases in tsconfig (`@/`, `@platform/`)

## Files to Create

| File/Directory | Purpose |
|----------------|---------|
| `apps/web/` | Next.js 15 frontend application |
| `apps/web/app/` | App Router pages directory |
| `apps/web/components/` | React components directory |
| `apps/web/hooks/` | Custom React hooks directory |
| `apps/web/lib/` | Utilities and clients directory |
| `apps/web/stores/` | Zustand stores directory |
| `packages/@platform/ui/` | Shared UI components package |
| `packages/@platform/db/` | Supabase client & types package |
| `packages/@platform/auth/` | Auth helpers package |
| `packages/tsconfig/` | Shared TypeScript configs package |
| `turbo.json` | Turborepo pipeline configuration |
| `package.json` | Root workspace configuration |
| `.nvmrc` | Node.js version specification |
| `pnpm-workspace.yaml` | pnpm workspace configuration |

## Dependencies

**Story Dependencies:** None (this is the first story)

**External Dependencies:**
- Node.js 20.x installed
- pnpm installed globally (`npm install -g pnpm`)

## Test Strategy

### Unit Tests

- Verify package.json has correct workspace configuration
- Verify turbo.json has required pipelines (build, lint, test)

### Integration Tests

- `pnpm install` completes successfully
- `pnpm build` runs without errors
- `pnpm lint` runs without errors
- `pnpm dev` starts the Next.js development server

### Manual Verification

1. Clone the repository fresh
2. Run `nvm use` to verify Node version is set
3. Run `pnpm install` to verify dependencies install
4. Run `pnpm dev` to verify development server starts
5. Navigate to `http://localhost:3000` to verify app loads

## Definition of Done

- [ ] All directories in the structure exist
- [ ] `pnpm install` succeeds without errors
- [ ] `pnpm build` succeeds without errors
- [ ] `pnpm dev` starts Next.js development server
- [ ] Path aliases (`@/`, `@platform/`) resolve correctly
- [ ] All packages are linked via workspace protocol
- [ ] `.nvmrc` contains `20` or specific 20.x version

## Notes

This is the foundational story for the entire Hyyve platform. All subsequent stories depend on this infrastructure being in place. Take care to follow the exact structure specified as other stories will reference these paths.

---

*Created: 2026-01-26*
*Epic: E0.1 - Project Foundation & Infrastructure Setup*
*PRD Reference: Infrastructure prerequisite (no direct FRs)*

---

## Senior Developer Review

### Initial Review: 2026-01-26

**Reviewer:** Senior Developer (Code Review Workflow)

**Verdict:** Changes Requested

Found 3 critical/medium issues:
1. CRITICAL - Missing zod@4.0.1 and @xyflow/react@12.10.0 in apps/web/package.json
2. MEDIUM - Tailwind CSS not installed despite being used in globals.css
3. MEDIUM - Missing `typecheck` task in turbo.json

Plus 3 low-severity recommendations for future improvement.

---

### Re-Review: 2026-01-26

**Reviewer:** Senior Developer (Code Review Workflow)

**Context:** Re-review after fixes were applied. Build verified successful.

#### Verification of Fixes

| Issue | Status | Evidence |
|-------|--------|----------|
| Missing zod@4.0.1 | **FIXED** | `apps/web/package.json` line 23: `"zod": "4.0.1"` |
| Missing @xyflow/react@12.10.0 | **FIXED** | `apps/web/package.json` line 19: `"@xyflow/react": "12.10.0"` |
| Tailwind CSS not installed | **FIXED** | `tailwindcss@4.1.8`, `postcss@8.5.4`, `autoprefixer@10.4.21` in devDependencies |
| Tailwind config missing | **FIXED** | `apps/web/tailwind.config.ts` exists with proper content paths including `../../packages/ui/src/**/*` |
| PostCSS config missing | **FIXED** | `apps/web/postcss.config.js` exists with tailwindcss and autoprefixer plugins |
| Missing typecheck task | **FIXED** | `turbo.json` lines 11-13: `"typecheck": { "dependsOn": ["^typecheck"] }` |

#### Remaining Low-Severity Issues (Deferred)

The following low-severity issues remain but are acceptable for story completion:

1. **Next.js lockfile warning** - Can be addressed in future infrastructure story
2. **Deprecated `next lint` command** - Will need update before Next.js 16
3. **Path alias documentation** - Minor documentation improvement

These do not block story completion and can be tracked as technical debt for future stories.

#### Build Verification

- `pnpm build` - **PASSES**
- All acceptance criteria met
- Directory structure correct
- Dependencies properly versioned

---

### Verdict

**APPROVED**

All critical and medium issues from the initial review have been resolved:

- zod@4.0.1 and @xyflow/react@12.10.0 are now in apps/web/package.json
- Tailwind CSS is properly installed with tailwind.config.ts and postcss.config.js
- turbo.json includes the typecheck task

The story meets all acceptance criteria and the build succeeds. The remaining low-severity issues are acceptable technical debt for future stories.

**Status Change:** `review` -> `done`

---

*Initial review: 2026-01-26*
*Re-review completed: 2026-01-26*
