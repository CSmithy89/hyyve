# Story 0.2.16: Implement Light Mode Theme Variables

## Story

As a **user**,
I want **proper light mode styling with Hyyve brand colors**,
So that **I can use the app in light mode with consistent visual design**.

## Acceptance Criteria

- **AC1:** Light Mode Colors:
  - Background #FFFFFF with surface #F9FAFB
  - Primary indigo #4F46E5 with dark #3730A3 and light #C7D2FE
  - Text primary #111827, secondary #6B7280, muted #9CA3AF
  - Border color #E5E7EB

- **AC2:** Semantic Colors:
  - Success #10B981
  - Warning #F59E0B
  - Error #EF4444
  - Info #0EA5E9

- **AC3:** CSS Variables:
  - All shadcn/ui variables updated for light mode
  - Hyyve-specific variables for light mode
  - OKLCH color format for Tailwind 4 compatibility

## Technical Notes

- Updates globals.css :root selector
- Maintains existing dark mode variables unchanged
- Uses UX spec section 18.1 color system
- Converts hex to OKLCH for Tailwind 4

## Reference

- UX Spec: Section 18.1 Color System
- UX Spec: Section 18.6 Theming Architecture

## Implementation Tasks

- [x] Create ATDD tests for light mode variables
- [x] Update :root CSS variables with Hyyve light mode colors
- [x] Add Hyyve-specific light mode variables
- [x] Add semantic color variables
- [x] Verify all components render correctly in light mode

## Dev Agent Record

### File List

| File | Action | Description |
|------|--------|-------------|
| apps/web/app/globals.css | modified | Updated :root with Hyyve light mode colors |
| apps/web/__tests__/theme/light-mode.test.ts | created | ATDD tests for light mode theme |

### Change Log

- 2026-01-27: Story file created
- 2026-01-27: Implemented light mode theme variables from UX Spec 18.1
- 2026-01-27: Added Hyyve-specific CSS variables for light mode
- 2026-01-27: All ATDD tests passing (16 tests)

## Status

done
