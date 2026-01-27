# Story 0.2.10: Implement Settings Pages

## Story

As a **developer**,
I want **the settings pages structure**,
So that **users can manage their account and workspace settings**.

## Acceptance Criteria

- **AC1:** Settings at `/settings` with tabbed navigation:
  - Profile & Preferences tab (default)
  - Account & Security tab
  - API Keys tab
  - Workspace Settings tab

- **AC2:** Profile & Preferences tab:
  - Identity section with avatar, name, email, job title, bio
  - Interface Theme selector (Light/Dark/System)
  - Accessibility settings (font size, reduce motion, high contrast)
  - Notification preferences matrix

- **AC3:** Account & Security tab:
  - Authentication section (email, password change)
  - Two-Factor Authentication section with status badge
  - Active Sessions table with device info
  - Danger Zone (export data, delete account)

- **AC4:** API Keys tab:
  - Security warning banner
  - Active keys list with masked values and copy button
  - Create new key form with name, permissions, IP whitelist

- **AC5:** Workspace Settings tab:
  - General information (icon, name, URL)
  - Default AI Settings (provider, model, temperature)
  - Security policies toggles
  - Integrations cards (Slack, GitHub)
  - Danger Zone (delete workspace)

- **AC6:** Design consistency:
  - Colors match Hyyve tokens (primary #5048e5, background-dark #121121)
  - Dark theme as default
  - Material Symbols Outlined icons
  - Forms use shadcn/ui components

## Technical Notes

- Uses mock data initially (no API integration)
- Forms use react-hook-form + zod validation
- API key values are masked with copy functionality
- Tab navigation uses URL params for deep linking
- Settings sidebar for navigation between tabs

## Source Reference

Wireframes 1.10.1-1.10.4:
- `user_profile_&_preferences/code.html`
- `account_&_security_settings_1/code.html`
- `api_keys_management/code.html`
- `workspace_settings_dashboard/code.html`

## Creates

- app/(app)/settings/page.tsx
- app/(app)/settings/loading.tsx
- app/(app)/settings/error.tsx
- app/(app)/settings/layout.tsx
- components/settings/settings-sidebar.tsx
- components/settings/profile-form.tsx
- components/settings/security-section.tsx
- components/settings/api-keys-section.tsx
- components/settings/workspace-section.tsx
- lib/mock-data/settings.ts

## Implementation Tasks

- [x] Create mock data for settings
- [x] Create SettingsSidebar component
- [x] Create ProfileForm component
- [x] Create SecuritySection component
- [x] Create ApiKeysSection component
- [x] Create WorkspaceSection component
- [x] Create settings layout with sidebar
- [x] Create settings page with tab routing
- [x] Add loading and error states
- [x] Add unit tests for components and pages

## Dev Agent Record

### File List

| File | Action | Description |
|------|--------|-------------|
| apps/web/lib/mock-data/settings.ts | Created | Mock data for user profile, API keys, sessions, workspace, integrations |
| apps/web/components/settings/SettingsSidebar.tsx | Created | Sidebar navigation with active state for settings tabs |
| apps/web/components/settings/ProfileForm.tsx | Created | Profile & preferences form with identity, theme, accessibility, notifications |
| apps/web/components/settings/SecuritySection.tsx | Created | Account & security with auth, 2FA, sessions, danger zone |
| apps/web/components/settings/ApiKeysSection.tsx | Created | API key management with security warning, key listing, create form |
| apps/web/components/settings/WorkspaceSection.tsx | Created | Workspace settings with general info, AI settings, security policies, integrations |
| apps/web/components/settings/index.ts | Created | Barrel export for all settings components |
| apps/web/app/(app)/settings/layout.tsx | Created | Settings layout with sidebar navigation |
| apps/web/app/(app)/settings/page.tsx | Created | Main settings page with tab routing via URL params |
| apps/web/app/(app)/settings/loading.tsx | Created | Loading skeleton for settings page |
| apps/web/app/(app)/settings/error.tsx | Created | Error boundary with reset functionality |
| apps/web/__tests__/settings/settings-pages.test.ts | Created | ATDD tests for all settings pages (47 tests) |

### Change Log

- 2026-01-27: Story file created
- 2026-01-27: Implemented all settings pages matching wireframes
- 2026-01-27: All 47 tests passing, build verified

## Status

done
