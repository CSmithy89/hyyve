# Story 0.2.17: Create Theme Toggle Component

## Story

As a **user**,
I want **a theme toggle that switches between light, dark, and system modes**,
So that **I can choose my preferred color scheme and have it persist across sessions**.

## Acceptance Criteria

- **AC1:** Theme Provider:
  - ThemeProvider from next-themes integrated
  - System preference auto-detection
  - Dark mode as default per ADR-023

- **AC2:** Theme Toggle Component:
  - Three modes: light, dark, system
  - Icon changes based on current theme
  - Dropdown menu for mode selection
  - Accessible with keyboard navigation

- **AC3:** Persistence:
  - Theme choice saved to localStorage
  - Remembered across sessions
  - Smooth CSS transition on theme change

## Technical Notes

- Uses next-themes (already a dependency)
- Pattern from UX Spec section 22.16
- Theme toggle appears in navigation header

## Reference

- UX Spec: Section 22.16 Dark Mode Patterns

## Implementation Tasks

- [x] Add ThemeProvider to providers.tsx
- [x] Create ThemeToggle component
- [x] Add suppressHydrationWarning to html element
- [x] Create ATDD tests
- [x] Export from components/theme/index.ts

## Dev Agent Record

### File List

| File | Action | Description |
|------|--------|-------------|
| apps/web/app/providers.tsx | modified | Added ThemeProvider with dark default |
| apps/web/app/layout.tsx | modified | Added suppressHydrationWarning |
| apps/web/components/theme/ThemeToggle.tsx | created | Theme toggle with dropdown menu |
| apps/web/components/theme/index.ts | created | Barrel export for theme components |
| apps/web/__tests__/theme/theme-toggle.test.ts | created | ATDD tests for theme toggle |

### Change Log

- 2026-01-27: Story file created
- 2026-01-27: Implemented ThemeProvider with next-themes
- 2026-01-27: Created ThemeToggle dropdown component
- 2026-01-27: All ATDD tests passing (14 tests)

## Status

done
