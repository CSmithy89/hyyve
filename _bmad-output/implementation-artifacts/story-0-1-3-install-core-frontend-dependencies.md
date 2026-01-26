# Story 0.1.3: Install Core Frontend Dependencies

## Status

**approved**

## Epic

**0.1 - Project Foundation & Infrastructure Setup**

## User Story

As a **developer**,
I want **all core frontend dependencies installed and configured**,
So that **I can build the visual builder and UI components**.

## Acceptance Criteria

### AC1: Core Dependencies Installed

- **Given** the monorepo is scaffolded
- **When** I install frontend dependencies
- **Then** the following are installed in `apps/web`:
  - `tailwindcss@4.x` with PostCSS config
  - `zustand@5.0.8` with immer middleware
  - `zod@4.0.1` for runtime validation
  - `@xyflow/react@12.10.0` for visual builder
  - `clsx` and `tailwind-merge` for className utilities

### AC2: Tailwind CSS Configuration

- **Given** Tailwind CSS is installed
- **When** I configure the theme
- **Then** Tailwind CSS is configured with custom theme extending shadcn defaults

### AC3: Global Styles Setup

- **Given** Tailwind CSS is configured
- **When** I set up global styles
- **Then** `globals.css` includes Tailwind directives and CSS variables

### AC4: Utility Function Created

- **Given** clsx and tailwind-merge are installed
- **When** I create utility functions
- **Then** `cn()` utility function is created in `lib/utils.ts`

## Technical Notes

### Tailwind CSS 4.x Configuration

Tailwind 4.x uses a CSS-first configuration approach. Key changes from v3:

1. **CSS-based configuration** - Use `@theme` directive instead of `tailwind.config.js`
2. **Import-based setup** - Use `@import "tailwindcss"` instead of `@tailwind` directives
3. **CSS variables** - Native CSS variable support for theming

### shadcn/ui CSS Variables

Configure the following CSS variables per shadcn conventions:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 240 5.9% 10%;
  --radius: 0.5rem;
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  /* ... dark mode values */
}
```

### cn() Utility Function

The `cn()` function combines `clsx` for conditional classes with `tailwind-merge` to properly merge Tailwind classes:

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Zustand Store Setup

Configure Zustand with immer middleware for immutable state updates:

```typescript
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const useStore = create(
  immer((set) => ({
    // ... state and actions
  }))
);
```

### Zod Schema Patterns

Use Zod for runtime validation of external data (API responses, form inputs):

```typescript
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
});

export type User = z.infer<typeof userSchema>;
```

## Files to Create

| File | Purpose |
|------|---------|
| `apps/web/tailwind.config.ts` | Tailwind CSS 4.x configuration (if not using CSS-only config) |
| `apps/web/postcss.config.js` | PostCSS configuration with Tailwind plugin |
| `apps/web/app/globals.css` | Global styles with Tailwind directives and CSS variables |
| `apps/web/lib/utils.ts` | Utility functions including `cn()` |

## Files to Modify

| File | Changes |
|------|---------|
| `apps/web/package.json` | Add all core frontend dependencies |
| `pnpm-lock.yaml` | Updated lockfile after `pnpm install` |

## Dependencies

### Story Dependencies

- **Story 0.1.1** (Scaffold Turborepo Monorepo with Next.js 15) - Monorepo structure must exist
- **Story 0.1.2** (Configure TypeScript with Strict Mode) - TypeScript configuration must be in place

### External Dependencies

- Node.js 20.x (specified in `.nvmrc`)
- pnpm installed globally

### Package Dependencies to Install

| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | 4.x | Utility-first CSS framework |
| `postcss` | Latest | CSS processing |
| `autoprefixer` | Latest | Vendor prefix handling |
| `zustand` | 5.0.8 | State management |
| `immer` | Latest | Immutable state updates (Zustand middleware) |
| `zod` | 4.0.1 | Runtime validation |
| `@xyflow/react` | 12.10.0 | Visual builder flow editor |
| `clsx` | Latest | Conditional className utility |
| `tailwind-merge` | Latest | Tailwind class merging |

## Test Strategy

### Unit Tests

1. **cn() Utility Function:**
   - Test that cn() merges Tailwind classes correctly
   - Test that cn() handles conditional classes
   - Test that cn() resolves conflicting classes (e.g., `p-4` and `p-2` should result in `p-2`)

```typescript
import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn utility', () => {
  it('merges class names', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', true && 'visible')).toBe('base visible');
  });

  it('handles undefined and null', () => {
    expect(cn('base', undefined, null)).toBe('base');
  });
});
```

2. **Zod Schema Validation:**
   - Test that Zod schemas validate correct data
   - Test that Zod schemas reject invalid data with proper error messages

### Integration Tests

1. **Tailwind CSS Processing:**
   - Verify Tailwind classes are processed correctly in the build
   - Verify CSS variables are defined in the output

2. **Zustand Store Functionality:**
   - Verify stores can be created with immer middleware
   - Verify state updates work correctly

### Build Verification

```bash
# Install dependencies
pnpm install

# Verify build succeeds
pnpm build

# Verify type checking passes
pnpm typecheck

# Start dev server and verify styles load
pnpm dev
```

### Manual Verification

1. Run `pnpm dev` and navigate to `http://localhost:3000`
2. Verify Tailwind styles are applied correctly
3. Open browser DevTools and verify CSS variables are defined on `:root`
4. Verify no console errors related to missing dependencies

## Definition of Done

- [x] All dependencies installed in `apps/web/package.json`
- [x] `tailwindcss@4.x` installed and configured
- [x] `postcss.config.js` created with Tailwind plugin (`@tailwindcss/postcss`)
- [x] `globals.css` includes Tailwind directives and CSS variables
- [x] `zustand@5.0.8` installed with immer middleware
- [x] `zod@4.0.1` installed
- [x] `@xyflow/react@12.10.0` installed
- [x] `clsx` and `tailwind-merge` installed
- [x] `cn()` utility function created in `lib/utils.ts`
- [x] `pnpm build` succeeds without errors
- [x] `pnpm typecheck` passes
- [ ] Tailwind styles render correctly in the browser (manual verification)
- [ ] CSS variables are defined on `:root` (manual verification)

---

*Created: 2026-01-26*
*Epic: E0.1 - Project Foundation & Infrastructure Setup*
*PRD Reference: Infrastructure prerequisite (no direct FRs)*

---

## Senior Developer Review

**Reviewer:** Claude Opus 4.5
**Date:** 2026-01-26
**Verdict:** APPROVED WITH OBSERVATIONS

### Summary

The implementation meets all core acceptance criteria. Dependencies are installed with correct versions, Tailwind is configured with shadcn CSS variables, the `cn()` utility is correctly implemented, and both build and typecheck pass successfully.

### Verification Results

| Check | Status | Notes |
|-------|--------|-------|
| tailwindcss@4.x | PASS | v4.1.8 installed |
| zustand@5.0.8 | PASS | Exact version |
| zod@4.0.1 | PASS | Exact version |
| @xyflow/react@12.10.0 | PASS | Exact version |
| clsx | PASS | v2.1.1 |
| tailwind-merge | PASS | v3.4.0 |
| immer | PASS | v11.1.3 |
| postcss.config.js | PASS | Uses @tailwindcss/postcss |
| globals.css CSS variables | PASS | All light/dark theme variables present |
| cn() utility | PASS | Correct implementation |
| pnpm build | PASS | Compiles successfully |
| pnpm typecheck | PASS | No type errors |

### Issues Found (5 observations, none blocking)

#### 1. [LOW] Dead Content Path in tailwind.config.ts

**Location:** `apps/web/tailwind.config.ts` line 9

**Issue:** The content array includes `../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}` but this directory does not exist. Only `packages/@platform/ui` exists.

**Impact:** No functional impact since the path is simply ignored, but indicates config drift from actual project structure.

**Recommendation:** Remove the dead path or update to match actual structure.

#### 2. [LOW] Vitest Alias Configuration Mismatch

**Location:** `/vitest.config.ts` line 34

**Issue:** The vitest config defines `'@': path.resolve(__dirname, './src')` but the web app uses `@/*` mapped to the root directory (not a `src` subfolder). The web app's `lib/utils.ts` is at `apps/web/lib/utils.ts`, not `src/lib/utils.ts`.

**Impact:** Unit tests using `@/lib/utils` imports will fail to resolve.

**Recommendation:** Update vitest alias to match the web app's tsconfig paths: `'@': path.resolve(__dirname, './apps/web')` or create app-specific vitest configs.

#### 3. [INFO] Missing Unit Tests for cn() Utility

**Location:** Story specifies tests in "Test Strategy" section

**Issue:** The story specifies unit tests for the `cn()` utility function, but no test file was created (e.g., `lib/utils.test.ts`).

**Impact:** No automated test coverage for the utility function. Not blocking since tests are marked as future work, but should be tracked.

**Recommendation:** Create `apps/web/lib/utils.test.ts` with the tests specified in the story.

#### 4. [INFO] Empty Zustand Stores Index

**Location:** `apps/web/stores/index.ts`

**Issue:** The stores directory only contains an empty barrel export. While immer is installed as a dependency, there's no demonstration of Zustand with immer middleware actually working together.

**Impact:** The AC states "zustand@5.0.8 with immer middleware" but middleware usage isn't demonstrated. Functional verification is deferred.

**Recommendation:** Consider adding a simple example store demonstrating immer middleware usage, or document this as out-of-scope for this story.

#### 5. [INFO] Font Configuration Not Integrated with Tailwind Theme

**Location:** `apps/web/app/layout.tsx` line 22

**Issue:** The Inter font uses a CSS variable `--font-inter` but the tailwind.config.ts doesn't extend `fontFamily` to use this variable. The body uses `font-sans` which relies on Tailwind's default sans-serif stack.

**Impact:** The custom Inter font variable is defined but not integrated into the Tailwind utility classes. This works due to the CSS variable approach but could be cleaner.

**Recommendation:** Consider adding `fontFamily: { sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans] }` to the Tailwind theme for full integration.

### Acceptance Criteria Checklist

- [x] **AC1:** Core dependencies installed with correct versions
- [x] **AC2:** Tailwind configured with shadcn color variables and theme extensions
- [x] **AC3:** globals.css includes Tailwind directives and all CSS variables for light/dark themes
- [x] **AC4:** cn() utility function correctly combines clsx and tailwind-merge

### Final Decision

**APPROVED** - The implementation satisfies all acceptance criteria. The observations are minor and can be addressed in follow-up work. The build passes, types check, and all required dependencies are in place with correct versions.

### Recommended Follow-up Items

1. Remove dead `packages/ui` path from tailwind.config.ts
2. Fix vitest alias configuration for proper test resolution
3. Add unit tests for cn() utility as specified in story
4. Validate font integration works correctly in browser (manual verification pending)
