# Story 0.2.8: Implement Auth Pages (Clerk UI)

## Story

As a **developer**,
I want **authentication pages using Clerk's pre-built components**,
So that **users can sign in/up with the Hyyve visual style**.

## Acceptance Criteria

- **AC1:** Sign-in page at `/sign-in`:
  - Uses Clerk `<SignIn />` component
  - Custom appearance matching Hyyve design tokens
  - Social provider buttons configured
  - Link to sign-up page
  - Wrapped in existing AuthLayout

- **AC2:** Sign-up page at `/sign-up`:
  - Uses Clerk `<SignUp />` component
  - Custom appearance matching Hyyve design tokens
  - Social provider buttons configured
  - Link to sign-in page
  - Wrapped in existing AuthLayout

- **AC3:** Clerk appearance customization:
  - Colors match Hyyve tokens (primary #5048e5)
  - Dark theme as default
  - Border radius matches card styling (rounded-xl)
  - Button and input styling consistent with design system

- **AC4:** Accessibility and responsiveness:
  - Pages are keyboard navigable
  - Proper focus states
  - Responsive on mobile/tablet/desktop

## Technical Notes

- Uses @clerk/nextjs components
- Clerk appearance API for styling customization
- Auth pages use catch-all routes [[...sign-in]] and [[...sign-up]]
- AuthLayout provides card wrapper and branding
- Clerk handles OAuth flows (Google, GitHub) internally

## Source Reference

Wireframes 1.1.1, 1.1.2

## Creates

- app/(auth)/sign-in/[[...sign-in]]/page.tsx
- app/(auth)/sign-up/[[...sign-up]]/page.tsx
- lib/clerk-appearance.ts (shared appearance config)

## Implementation Tasks

- [x] Create shared Clerk appearance configuration
- [x] Create sign-in page with Clerk SignIn component
- [x] Create sign-up page with Clerk SignUp component
- [x] Verify social providers render correctly (via appearance config)
- [x] Test responsive behavior (via AuthLayout)
- [x] Add unit tests for page components

## Dev Agent Record

### File List

| File | Action | Description |
|------|--------|-------------|
| `apps/web/lib/clerk-appearance.ts` | Created | Shared Clerk appearance configuration with Hyyve design tokens |
| `apps/web/app/(auth)/sign-in/[[...sign-in]]/page.tsx` | Created | Sign-in page with Clerk SignIn component |
| `apps/web/app/(auth)/sign-in/[[...sign-in]]/loading.tsx` | Created | Loading skeleton for sign-in page |
| `apps/web/app/(auth)/sign-in/[[...sign-in]]/error.tsx` | Created | Error boundary for sign-in page |
| `apps/web/app/(auth)/sign-up/[[...sign-up]]/page.tsx` | Created | Sign-up page with Clerk SignUp component |
| `apps/web/app/(auth)/sign-up/[[...sign-up]]/loading.tsx` | Created | Loading skeleton for sign-up page |
| `apps/web/app/(auth)/sign-up/[[...sign-up]]/error.tsx` | Created | Error boundary for sign-up page |
| `apps/web/__tests__/auth/auth-pages.test.ts` | Created | ATDD tests for auth pages (29 tests) |
| `apps/web/components/ui/skeleton.tsx` | Created | shadcn Skeleton component (via npx shadcn add) |
| `apps/web/package.json` | Modified | Added @clerk/types dev dependency |

### Change Log

- 2026-01-27: Initial implementation of auth pages with Clerk components
- 2026-01-27: Added loading and error states per project-context.md requirements
- 2026-01-27: Exported hyyveTokens for reuse by other components

## Status

done
