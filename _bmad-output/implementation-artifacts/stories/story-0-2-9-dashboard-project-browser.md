# Story 0.2.9: Implement Dashboard and Project Browser

## Story

As a **developer**,
I want **the main dashboard and project browser pages**,
So that **users can see their workspaces and projects**.

## Acceptance Criteria

- **AC1:** Dashboard at `/dashboard`:
  - Welcome message with user name
  - Quick action cards (Module Builder, Chatbot Builder, Voice Agent, Canvas Builder)
  - Recent projects list with project cards
  - Usage summary widget (API calls, cost estimate)
  - Activity feed with timeline

- **AC2:** Project Browser at `/dashboard/projects`:
  - Sidebar with workspace selector, search, folder tree
  - Project grid/list view toggle
  - Search and filter controls
  - Project cards with status, last edited, version, owner
  - Create new project button

- **AC3:** Design consistency:
  - Colors match Hyyve tokens (primary #5048e5, background-dark #131221)
  - Dark theme as default
  - Material Symbols Outlined icons
  - Border radius matching design system (rounded-xl)

- **AC4:** Responsiveness:
  - Mobile-friendly layout
  - Collapsible sidebar on smaller screens
  - Grid adjusts for different screen sizes

## Technical Notes

- Uses mock data initially (no API integration)
- AppShell layout provides header and sidebar structure
- Quick action cards link to builder routes
- Project cards show status badges (Active, Training, etc.)
- Usage widget shows progress bars with limits

## Source Reference

Wireframes 1.5.1, 1.5.2, `hyyve_home_dashboard/code.html`, `project_browser_&_folders/code.html`

## Creates

- app/(app)/dashboard/page.tsx
- app/(app)/dashboard/loading.tsx
- app/(app)/dashboard/error.tsx
- app/(app)/dashboard/projects/page.tsx
- app/(app)/dashboard/projects/loading.tsx
- app/(app)/dashboard/projects/error.tsx
- components/dashboard/quick-action-card.tsx
- components/dashboard/project-card.tsx
- components/dashboard/usage-widget.tsx
- components/dashboard/activity-feed.tsx
- lib/mock-data/dashboard.ts

## Implementation Tasks

- [x] Create mock data for dashboard and projects
- [x] Create QuickActionCard component
- [x] Create ProjectCard component
- [x] Create UsageWidget component
- [x] Create ActivityFeed component
- [x] Create dashboard page with welcome message
- [x] Create projects page with grid/list view
- [x] Add loading and error states
- [x] Add unit tests for components and pages

## Dev Agent Record

### File List

| File | Action | Description |
|------|--------|-------------|
| `apps/web/lib/mock-data/dashboard.ts` | Created | Mock data for dashboard (quick actions, projects, activities, usage stats) |
| `apps/web/components/dashboard/QuickActionCard.tsx` | Created | Quick action card component with icon and color variants |
| `apps/web/components/dashboard/ProjectCard.tsx` | Created | Project card with thumbnail, status badge, and menu |
| `apps/web/components/dashboard/UsageWidget.tsx` | Created | Usage metrics with progress bars and upgrade CTA |
| `apps/web/components/dashboard/ActivityFeed.tsx` | Created | Activity timeline with status indicators |
| `apps/web/components/dashboard/index.ts` | Created | Barrel export for dashboard components |
| `apps/web/app/(app)/dashboard/page.tsx` | Created | Main dashboard page with welcome message, quick actions, projects |
| `apps/web/app/(app)/dashboard/loading.tsx` | Created | Loading skeleton for dashboard |
| `apps/web/app/(app)/dashboard/error.tsx` | Created | Error boundary for dashboard |
| `apps/web/app/(app)/dashboard/projects/page.tsx` | Created | Projects page with grid/list view toggle and search |
| `apps/web/app/(app)/dashboard/projects/loading.tsx` | Created | Loading skeleton for projects page |
| `apps/web/app/(app)/dashboard/projects/error.tsx` | Created | Error boundary for projects page |
| `apps/web/__tests__/dashboard/dashboard-pages.test.ts` | Created | ATDD tests for dashboard pages (45 tests) |
| `apps/web/app/(app)/layout.tsx` | Modified | Added dynamic export for Clerk context |
| `apps/web/app/sign-in/` | Deleted | Removed duplicate auth page (conflicts with (auth)/sign-in) |
| `apps/web/app/sign-up/` | Deleted | Removed duplicate auth page (conflicts with (auth)/sign-up) |

### Change Log

- 2026-01-27: Initial implementation of dashboard and project browser pages
- 2026-01-27: Added loading and error states per project-context.md requirements
- 2026-01-27: Removed duplicate sign-in/sign-up pages at root level
- 2026-01-27: Added dynamic exports to (app) layout for Clerk context compatibility
- 2026-01-27: Code review: Fixed invalid dynamic export in client component, removed unused import

## Status

done
