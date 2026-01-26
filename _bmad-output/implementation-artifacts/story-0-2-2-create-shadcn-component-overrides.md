# Story 0-2-2: Create shadcn Component Overrides

**Epic:** 0.2 - Frontend Foundation & Design System
**Status:** done
**Priority:** High
**Estimated Effort:** 5-8 hours

## Description

Customize shadcn/ui components to match the Hyyve Stitch wireframe design system. This story builds upon Story 0-2-1 (Design Tokens) to apply the extracted colors, shadows, and styling patterns directly to the component variants and defaults.

The goal is to ensure all shadcn/ui components render with the correct Hyyve visual style by default, particularly in dark mode. This includes customizing Button variants with the signature primary glow effect, Card components with panel-dark backgrounds, Input components with dark styling, and Dialog/Sheet components with the proper modal appearance.

Components should consume the CSS custom properties defined in `globals.css` (Story 0-2-1) and extend/override the default shadcn/ui styling to match the Stitch wireframes exactly.

## Acceptance Criteria

- [x] AC1: **Button Component** - Primary variant uses Hyyve primary color (#5048e5) with glow shadow (`0 0 15px rgba(80, 72, 229, 0.3)`)
  - [x] Default variant uses primary background with hover state using primary-dark (#3e38b3)
  - [x] Secondary variant uses panel-dark background with border
  - [x] Ghost variant has transparent background with hover highlight
  - [x] Destructive variant maintains red coloring with appropriate contrast
  - [x] All variants have proper focus ring using primary color

- [x] AC2: **Card Component** - Uses panel-dark (#1c1a2e) background with border-dark (#272546) border in dark mode
  - [x] Card has rounded-xl border radius
  - [x] CardHeader, CardContent, CardFooter have consistent padding
  - [x] Card supports elevated variant with shadow

- [x] AC3: **Input Component** - Dark input styling with focus:border-primary
  - [x] Background uses input-dark or panel-dark (#1c1a2e)
  - [x] Border uses border-dark (#272546)
  - [x] Focus state shows primary border color
  - [x] Placeholder text uses text-secondary (#9795c6)

- [x] AC4: **Dialog Component** - Modal uses panel-dark background
  - [x] DialogContent uses panel-dark background
  - [x] DialogOverlay has proper backdrop opacity
  - [x] DialogTitle and DialogDescription have correct text colors
  - [x] Close button uses appropriate styling

- [x] AC5: **Sheet Component** - Slide-out panel uses panel-dark background
  - [x] Same dark styling as Dialog
  - [x] Proper border on the sliding edge

- [x] AC6: **Badge Component** - Status colors match wireframe palette
  - [x] Default variant uses primary color
  - [x] Success variant uses emerald (#10b981)
  - [x] Warning variant uses amber (#f59e0b)
  - [x] Error/Destructive variant uses red (#ef4444)
  - [x] Outline variant has border-dark border

- [x] AC7: **Tabs Component** - Builder UI tab styling
  - [x] Tab list uses panel-dark background
  - [x] Active tab has primary indicator/underline
  - [x] Tab content area has proper background

- [x] AC8: **Tooltip Component** - Dark tooltip styling
  - [x] Tooltip uses panel-dark background
  - [x] Border uses border-dark
  - [x] Arrow has matching colors

- [x] AC9: **DropdownMenu Component** - Dark dropdown styling
  - [x] Menu content uses panel-dark background
  - [x] Menu items have proper hover states
  - [x] Separator uses border-dark color
  - [x] Checkbox and radio items styled consistently

- [x] AC10: **Avatar Component** - Proper dark mode styling
  - [x] Fallback background uses primary or panel-dark
  - [x] Border uses border-dark when shown

- [x] AC11: **Theme Utilities File** - Create shared style utilities
  - [x] Create `components/ui/theme.ts` for shared style constants
  - [x] Export reusable Tailwind class combinations
  - [x] Document usage patterns

- [x] AC12: **Dark Mode Default** - All components support dark mode as default
  - [x] Components use CSS variables that resolve correctly in dark mode
  - [x] No hardcoded light-mode colors in component files

## Technical Notes

### Implementation Strategy

The implementation follows the "NEVER modify files in @/components/ui directly" rule from project-context.md by:
1. **Leveraging CSS custom properties** - The design tokens from Story 0-2-1 already define the correct CSS variables in `globals.css`. Components using `bg-card`, `border-border`, `text-primary`, etc. will automatically get Hyyve colors.
2. **Creating variant extensions** - For Button glow and other special effects not covered by CSS variables, we modify the component's variant definitions.
3. **Creating theme.ts utilities** - Shared style patterns that can be composed with `cn()`.

### CSS Variable Mapping (from globals.css)

The following CSS variables are already configured for dark mode:
```css
--background: oklch(0.15 0.025 280);  /* #131221 - Hyyve background-dark */
--card: oklch(0.19 0.03 280);          /* #1c1a2e - Hyyve panel-dark */
--primary: oklch(0.52 0.21 275);       /* #5048e5 - Hyyve primary purple */
--border: oklch(0.24 0.05 275);        /* #272546 - Hyyve border-dark */
--input: oklch(0.19 0.03 280);         /* #1c1a2e - Hyyve panel-dark */
--muted-foreground: oklch(0.68 0.06 280); /* #9795c6 - Hyyve text-secondary */
--accent: oklch(0.42 0.18 275);        /* #3e38b3 - Hyyve primary-dark */
```

### Component-Specific Notes

**Button:**
- Add primary glow shadow to default variant
- Use `shadow-[0_0_15px_rgba(80,72,229,0.3)]` for glow effect
- Hover state should use `primary-dark` (#3e38b3)

**Card:**
- Already uses `bg-card` which maps to panel-dark in dark mode
- Add `border-border` explicitly for consistency
- Consider adding elevated variant with `shadow-card` from design tokens

**Input:**
- Uses `bg-input` CSS variable (already panel-dark in dark mode)
- Focus ring should use `ring-primary`
- Ensure placeholder uses `text-muted-foreground`

**Dialog/Sheet:**
- Uses `bg-popover` which maps to panel-dark in dark mode
- Overlay should have appropriate backdrop blur

**Badge:**
- Create additional semantic variants (success, warning, info)
- Map to status colors from design tokens

**Tabs:**
- Active tab should have primary color indicator
- Consider underline style from wireframes

### Files to Create/Modify

| File | Action |
|------|--------|
| `apps/web/components/ui/button.tsx` | Modify - Add glow shadow, update hover states |
| `apps/web/components/ui/card.tsx` | Modify - Add elevated variant, verify border |
| `apps/web/components/ui/input.tsx` | Modify - Verify dark styling, focus states |
| `apps/web/components/ui/dialog.tsx` | Modify - Verify overlay and content styling |
| `apps/web/components/ui/sheet.tsx` | Modify - Verify panel styling |
| `apps/web/components/ui/badge.tsx` | Modify - Add success, warning, info variants |
| `apps/web/components/ui/tabs.tsx` | Modify - Update active indicator styling |
| `apps/web/components/ui/tooltip.tsx` | Modify - Verify dark styling |
| `apps/web/components/ui/dropdown-menu.tsx` | Modify - Verify dark styling |
| `apps/web/components/ui/avatar.tsx` | Modify - Verify fallback styling |
| `apps/web/components/ui/theme.ts` | **Create** - Shared style utilities |
| `apps/web/__tests__/design-system/component-overrides.test.ts` | **Create** - Test coverage |

### Wireframe Reference Classes

From `hyyve_module_builder/code.html`:
```html
<!-- Primary Button Pattern -->
<button class="group flex items-center justify-center gap-2 rounded-lg h-9 px-4 bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-all shadow-[0_0_15px_rgba(80,72,229,0.3)]">

<!-- Panel/Card Pattern -->
<div class="bg-[#1c1a2e] border border-[#272546] rounded-xl">

<!-- Input Pattern -->
<input class="bg-[#1c1a2e] border border-[#272546] rounded-md focus:border-primary focus:ring-primary">

<!-- Badge Pattern -->
<span class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">Active</span>
```

### Design Token Imports

```typescript
import {
  HYYVE_COLORS,
  HYYVE_SHADOWS,
  HYYVE_BORDER_RADIUS,
} from '@/lib/design-tokens';
```

## Dependencies

- **Story 0-2-1: Extract Design System from Wireframes** - **COMPLETED**
  - Design tokens in `apps/web/lib/design-tokens.ts`
  - CSS variables in `apps/web/app/globals.css`
  - Tailwind config in `apps/web/tailwind.config.ts`
- **Story 0-1-4: Initialize shadcn/ui Component Library** - **COMPLETED**
  - shadcn/ui installed and configured
  - Base components exist in `apps/web/components/ui/`

## Related FRs

| FR | Requirement | Connection |
|----|-------------|------------|
| FR185 | Generated UIs render using shadcn/ui | Components must match brand styling |
| FR182 | Users can customize UI themes (CSS variables) | Theme system must be extensible |

**NFRs:**
- NFR-MAINT-01: Consistent visual language across platform
- NFR-MAINT-02: Maintainable design system with reusable components
- NFR-ACC-01: WCAG 2.1 AA accessibility (shadcn/ui provides this baseline)

## Implementation Tasks

1. [ ] **Create theme utilities file** - Create `components/ui/theme.ts` with shared style constants and helper functions
   - Export reusable Tailwind class combinations for Hyyve patterns
   - Define shadow utilities including primary glow
   - Document usage patterns with JSDoc comments

2. [ ] **Update Button component** - Add Hyyve-specific styling
   - Add primary glow shadow to default variant (`shadow-[0_0_15px_rgba(80,72,229,0.3)]`)
   - Update hover state to use `hover:bg-accent` (primary-dark)
   - Verify all variants use correct CSS variables
   - Add `hyyve` variant with full wireframe styling (optional)

3. [ ] **Update Card component** - Verify and enhance dark styling
   - Confirm `bg-card` resolves to panel-dark in dark mode
   - Ensure `border-border` is applied
   - Add `elevated` variant with `shadow-card` from design tokens

4. [ ] **Update Input component** - Verify dark mode styling
   - Confirm background uses input/panel-dark
   - Verify focus ring uses primary color
   - Ensure placeholder uses muted-foreground

5. [ ] **Update Dialog component** - Verify modal styling
   - Confirm DialogContent uses popover (panel-dark) background
   - Verify overlay has proper backdrop
   - Test DialogTitle and DialogDescription colors

6. [ ] **Update Sheet component** - Verify slide-out panel styling
   - Same verifications as Dialog
   - Ensure proper border on sliding edge

7. [ ] **Update Badge component** - Add semantic variants
   - Add `success` variant (emerald green)
   - Add `warning` variant (amber)
   - Add `info` variant (blue)
   - Verify existing variants use correct colors

8. [ ] **Update Tabs component** - Style tab indicators
   - Update active tab styling with primary indicator
   - Verify tab list background
   - Consider underline vs highlight style per wireframes

9. [ ] **Update Tooltip component** - Verify dark styling
   - Confirm uses popover background (panel-dark)
   - Verify border and arrow colors

10. [ ] **Update DropdownMenu component** - Verify dark styling
    - Confirm menu content uses popover background
    - Verify hover states on menu items
    - Check separator color

11. [ ] **Update Avatar component** - Verify dark styling
    - Confirm fallback background uses appropriate color
    - Verify border when shown

12. [ ] **Create component override tests** - Test coverage for AC1-AC12
    - Test that components render with correct CSS classes
    - Test that variants exist and have expected styling
    - Test dark mode support

13. [ ] **Visual verification** - Compare rendered components against wireframes
    - Create a Storybook story or test page showing all overridden components
    - Screenshot comparison with wireframe patterns

## Verification Checklist

After implementation, verify:

- [ ] `pnpm build` succeeds without errors
- [ ] Primary Button renders with purple (#5048e5) background and glow shadow
- [ ] Card renders with panel-dark background and border-dark border
- [ ] Input shows focus ring with primary color
- [ ] Dialog/Sheet modals have dark background
- [ ] Badge success variant is emerald green
- [ ] All components support dark mode (no hardcoded light colors)
- [ ] `theme.ts` exports are importable and documented
- [ ] Tests pass for all acceptance criteria

## Test Coverage Requirements

Each acceptance criterion should have corresponding test coverage:

```typescript
describe('Story 0-2-2: shadcn Component Overrides', () => {
  describe('AC1: Button Component', () => {
    it('should have primary glow shadow on default variant', () => {});
    it('should have primary-dark hover state', () => {});
    it('should have proper focus ring', () => {});
  });

  describe('AC2: Card Component', () => {
    it('should use panel-dark background in dark mode', () => {});
    it('should have border-dark border', () => {});
    it('should have elevated variant with shadow', () => {});
  });

  // ... tests for AC3-AC12
});
```

---

**Source:** Epic file `epics.md`, Story 0.2.2: Create shadcn Component Overrides
**Depends On:** Story 0-2-1: Extract Design System from Wireframes (COMPLETED)
**Creates:** Updated `components/ui/*.tsx`, new `components/ui/theme.ts`, test file
**Wireframe Sources:** `hyyve_module_builder/code.html`, `hyyve_home_dashboard/code.html`

---

## Senior Developer Review

**Reviewer:** Claude Opus 4.5 (Adversarial Code Review)
**Date:** 2026-01-27
**Review Type:** ADVERSARIAL - finding 3-10 specific issues

### Summary

The implementation successfully customizes shadcn/ui components to match Hyyve Stitch wireframe design tokens. All 78 tests pass, TypeScript compiles without errors, and the core acceptance criteria are met. However, this adversarial review identified **7 issues** that should be addressed.

---

### Issues Found

#### Issue #1: Tooltip Uses Wrong Background Color (MAJOR)

**File:** `/home/chris/projects/work/Agentic Rag/apps/web/components/ui/tooltip.tsx` (line 23)
**Severity:** MAJOR
**AC Affected:** AC8 - Tooltip Component

**Problem:** The TooltipContent uses `bg-primary` which makes the tooltip purple (#5048e5), but AC8 specifies tooltips should use "panel-dark background" (#1c1a2e). The wireframe pattern shows dark tooltips, not primary-colored ones.

**Current Code:**
```tsx
className={cn(
  "z-50 overflow-hidden rounded-md border border-border bg-primary px-3 py-1.5 text-xs text-primary-foreground ..."
)}
```

**Expected:** Should use `bg-popover` or `bg-card` (which map to panel-dark in dark mode) instead of `bg-primary`.

**Impact:** Tooltips will appear as purple boxes instead of dark grey panels, breaking visual consistency with wireframes.

---

#### Issue #2: Card Missing Explicit Border Class (MINOR)

**File:** `/home/chris/projects/work/Agentic Rag/apps/web/components/ui/card.tsx` (line 7)
**Severity:** MINOR
**AC Affected:** AC2 - Card Component

**Problem:** The Card component uses just `border` without explicitly specifying `border-border`. While this works due to the base layer styles in globals.css (`* { @apply border-border }`), it's fragile and relies on implicit styling.

**Current Code:**
```tsx
const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground",
```

**Recommendation:** Add explicit `border-border` for clarity and resilience:
```tsx
"rounded-xl border border-border bg-card text-card-foreground"
```

---

#### Issue #3: DropdownMenu Separator Uses Wrong Color Class (MINOR)

**File:** `/home/chris/projects/work/Agentic Rag/apps/web/components/ui/dropdown-menu.tsx` (line 166)
**Severity:** MINOR
**AC Affected:** AC9 - DropdownMenu Component

**Problem:** The DropdownMenuSeparator uses `bg-muted` instead of the border color. Per AC9, the "Separator uses border-dark color."

**Current Code:**
```tsx
className={cn("-mx-1 my-1 h-px bg-muted", className)}
```

**Expected:** Should use `bg-border` to match the border-dark color defined in CSS variables.

---

#### Issue #4: Avatar Fallback Missing Primary Color Option (MINOR)

**File:** `/home/chris/projects/work/Agentic Rag/apps/web/components/ui/avatar.tsx` (line 42)
**Severity:** MINOR
**AC Affected:** AC10 - Avatar Component

**Problem:** AC10 states "Fallback background uses primary OR panel-dark", but the Avatar only uses `bg-muted`. The implementation should offer a way to use primary color for avatar fallbacks (common pattern for user initials).

**Current Code:**
```tsx
className={cn(
  "flex h-full w-full items-center justify-center rounded-full bg-muted",
  className
)}
```

**Suggestion:** Add variant support via cva to allow `primary` and `muted` fallback backgrounds.

---

#### Issue #5: theme.ts Does Not Import or Reference Design Tokens (SUGGESTION)

**File:** `/home/chris/projects/work/Agentic Rag/apps/web/components/ui/theme.ts`
**Severity:** SUGGESTION
**AC Affected:** AC11 - Theme Utilities File

**Problem:** The theme.ts file duplicates color values as inline Tailwind classes (e.g., `shadow-[0_0_15px_rgba(80,72,229,0.3)]`) rather than importing from the centralized `design-tokens.ts`. This creates a maintenance burden - if the primary glow color changes, it must be updated in multiple places.

**Current Code:**
```typescript
export const primaryGlow = "shadow-[0_0_15px_rgba(80,72,229,0.3)]";
```

**Recommendation:** Consider referencing design tokens or CSS variables:
```typescript
import { HYYVE_SHADOWS } from '@/lib/design-tokens';
// Document that these match HYYVE_SHADOWS.primaryGlow
```

---

#### Issue #6: Tabs Component Missing Primary Indicator Color (MINOR)

**File:** `/home/chris/projects/work/Agentic Rag/apps/web/components/ui/tabs.tsx` (line 32)
**Severity:** MINOR
**AC Affected:** AC7 - Tabs Component

**Problem:** AC7 states "Active tab has primary indicator/underline", but the current implementation uses `data-[state=active]:bg-background data-[state=active]:text-foreground` without any primary color indicator. The active tab blends with the content area rather than showing Hyyve primary branding.

**Current Code:**
```tsx
"data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
```

**Expected:** Should include primary color indicator, such as:
```tsx
"data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-[inset_0_-2px_0_hsl(var(--primary))]"
```

---

#### Issue #7: Test File Uses File System Checks Instead of Component Rendering (SUGGESTION)

**File:** `/home/chris/projects/work/Agentic Rag/apps/web/__tests__/design-system/component-overrides.test.ts`
**Severity:** SUGGESTION
**AC Affected:** AC1-AC12

**Problem:** The tests verify component overrides by reading file contents and checking for string patterns, rather than rendering components and asserting on actual CSS classes. This approach:
1. Cannot catch runtime issues (e.g., `cn()` merging class names incorrectly)
2. May have false positives if class strings appear in comments
3. Doesn't verify CSS variables resolve correctly in dark mode

**Current Approach:**
```typescript
function readComponentFile(componentName: string): string | null {
  const filePath = path.join(COMPONENTS_DIR, `${componentName}.tsx`);
  return fs.readFileSync(filePath, 'utf-8');
}
```

**Recommendation:** Consider adding render-based tests using `@testing-library/react`:
```typescript
import { render } from '@testing-library/react';
import { Button } from '@/components/ui/button';

it('should render with primary glow shadow', () => {
  const { container } = render(<Button>Test</Button>);
  expect(container.firstChild).toHaveClass('shadow-[0_0_15px_rgba(80,72,229,0.3)]');
});
```

---

### Review Checklist Results

| Criteria | Status | Notes |
|----------|--------|-------|
| **Code Quality** | PASS | Changes are focused and minimal |
| **TypeScript** | PASS | No `any` types, proper interfaces |
| **Test Coverage** | PASS with concern | 78/78 tests pass, but testing approach is fragile |
| **Consistency** | PARTIAL | Most components consistent, some gaps noted |
| **API Compatibility** | PASS | No breaking changes to component APIs |
| **Accessibility** | PASS | No a11y regressions detected |

---

### Decision

**CHANGES REQUESTED**

**Rationale:** Issue #1 (Tooltip wrong background) is a MAJOR issue that causes visual inconsistency with the wireframe specification. The tooltip will appear purple instead of dark grey, which is clearly incorrect per AC8.

**Required Before Merge:**
1. Fix Issue #1 - Change tooltip background from `bg-primary` to `bg-popover`

**Recommended Fixes (Should Fix):**
2. Issue #3 - DropdownMenu separator color
3. Issue #6 - Tabs active indicator should use primary color

**Optional Improvements:**
4. Issue #2 - Explicit border class (low risk)
5. Issue #4 - Avatar fallback variants
6. Issue #5 - Reference design tokens in theme.ts
7. Issue #7 - Add render-based tests

---

### Auto-Fix Commands

If approved, run these commands to fix the MAJOR issue:

```bash
# Fix Issue #1: Tooltip background
sed -i 's/bg-primary px-3 py-1.5 text-xs text-primary-foreground/bg-popover px-3 py-1.5 text-xs text-popover-foreground/' apps/web/components/ui/tooltip.tsx
```

---

**Review Status:** CHANGES REQUESTED
**Blocking Issues:** 1 MAJOR
**Non-Blocking Issues:** 3 MINOR, 3 SUGGESTIONS

---

### Follow-up Review (Retry 1)

**Reviewer:** Claude Opus 4.5
**Date:** 2026-01-27
**Purpose:** Verify fixes for 5 issues claimed resolved by developer

#### Issue Verification Table

| Issue # | Severity | Component | Expected Fix | Status | Verification |
|---------|----------|-----------|--------------|--------|--------------|
| #1 | **MAJOR** | Tooltip | `bg-popover text-popover-foreground` | **FIXED** | Line 23: `bg-popover px-3 py-1.5 text-xs text-popover-foreground` |
| #2 | MINOR | Card | Add `border-border` class | **FIXED** | Line 7: `rounded-xl border border-border bg-card` |
| #3 | MINOR | DropdownMenu | Separator uses `bg-border` | **FIXED** | Line 166: `cn("-mx-1 my-1 h-px bg-border", className)` |
| #4 | MINOR | Avatar | Add variant support | **FIXED** | Lines 36-49: `avatarFallbackVariants` with `primary` variant using cva |
| #6 | MINOR | Tabs | Primary indicator on active tab | **FIXED** | Line 32: `data-[state=active]:text-primary data-[state=active]:shadow-[inset_0_-2px_0_hsl(var(--primary))]` |

#### Test Results

```
npx vitest run apps/web/__tests__/design-system/component-overrides.test.ts

 RUN  v4.0.1 /home/chris/projects/work/Agentic Rag

 PASS  apps/web/__tests__/design-system/component-overrides.test.ts (78 tests) 16ms

 Test Files  1 passed (1)
      Tests  78 passed (78)
   Duration  898ms
```

All 78 tests pass.

#### Remaining Issues (Not Fixed - As Expected)

| Issue # | Severity | Description | Status |
|---------|----------|-------------|--------|
| #5 | SUGGESTION | theme.ts should reference design-tokens.ts | Not addressed (optional) |
| #7 | SUGGESTION | Tests use file reads instead of component rendering | Not addressed (optional) |

These are SUGGESTION-level issues and do not block approval.

#### New Issues Found

**None** - No new CRITICAL or MAJOR issues identified during follow-up review.

---

### Final Outcome

**APPROVED**

**Rationale:**
- All 5 claimed fixes have been verified as correctly implemented
- The 1 MAJOR issue (#1 Tooltip background) is now resolved
- All 4 MINOR issues (#2, #3, #4, #6) are now resolved
- 78/78 tests pass
- No new CRITICAL or MAJOR issues found
- 2 remaining SUGGESTION-level issues are optional improvements and do not affect functionality

**Story Status:** Ready for merge

---

**Follow-up Review Status:** APPROVED
**Issues Resolved:** 1 MAJOR, 4 MINOR
**Remaining Issues:** 2 SUGGESTIONS (non-blocking)
