# Story 1-1-14: SCIM User Provisioning

## Story Information

- **Epic**: 1.1 User Authentication & Identity
- **Sprint**: Phase 1 - Foundation
- **Status**: Done
- **Wireframe References**: `team_&_permissions_management`, `org_hierarchy_manager`
- **Route**: `/settings/security/sso/scim`
- **Screen IDs**: 4.4.2, 4.8.1

## Story Description

As an enterprise administrator, I want to configure SCIM (System for Cross-domain Identity Management) user provisioning so that users are automatically synced from our identity provider to Hyyve, eliminating manual user management.

## Acceptance Criteria

- [x] AC1: SCIM settings page accessible from SSO configuration at `/settings/security/sso/scim`
- [x] AC2: Display SCIM endpoint URL with copy-to-clipboard functionality
- [x] AC3: Bearer token generation with show/hide toggle
- [x] AC4: Token regeneration with confirmation dialog (warns about breaking existing integrations)
- [x] AC5: Enable/disable SCIM toggle with confirmation
- [x] AC6: Display list of SCIM-provisioned users with:
  - User name and email
  - Provisioning status (active/suspended/pending)
  - Last synced timestamp
  - Manual resync button
- [x] AC7: Accessibility requirements (proper labels, keyboard navigation, ARIA attributes)
- [x] AC8: Responsive design (mobile, tablet, desktop)

## Technical Notes

### SCIM Protocol Overview

SCIM 2.0 is an HTTP-based protocol for automating user provisioning:
- **Endpoint**: `https://api.hyyve.com/scim/v2`
- **Authentication**: Bearer token
- **Operations**: Create, Read, Update, Delete (CRUD) users/groups

### Clerk/WorkOS Integration

- WorkOS provides SCIM directory sync functionality
- SCIM endpoint and bearer token are configured in WorkOS dashboard
- Hyyve displays these values for IdP configuration
- Real provisioning operations happen via WorkOS webhook callbacks

### Components Implemented

1. **ScimConfigPanel** (`apps/web/components/auth/scim-config-panel.tsx`)
   - Enable/disable SCIM toggle
   - SCIM endpoint URL display
   - Bearer token display with visibility toggle
   - Generate new token button with confirmation
   - Copy-to-clipboard functionality

2. **ScimUsersList** (`apps/web/components/auth/scim-users-list.tsx`)
   - List of provisioned users
   - User status badges (active/suspended/pending)
   - Last synced timestamp
   - Manual resync button

3. **SCIM Settings Page** (`apps/web/app/(app)/settings/security/sso/scim/page.tsx`)
   - Main SCIM configuration page
   - Loading skeleton for async data

### Design Tokens (from wireframes)

```css
--color-primary: #5048e5
--color-background-dark: #131221
--color-surface-dark: #1f2937
--color-border-dark: #272546
--color-text-secondary: #9795c6
```

### Test Coverage

- **E2E Tests**: `tests/e2e/auth/scim-provisioning.spec.ts`
- **Unit Tests**: `apps/web/components/auth/__tests__/scim-provisioning.test.tsx`

## Implementation Checklist

- [x] Create story file
- [x] Create E2E tests (TDD Red Phase)
- [x] Create unit tests (TDD Red Phase)
- [x] Implement ScimConfigPanel component
- [x] Implement ScimUsersList component
- [x] Create SCIM settings page and route
- [x] Create loading skeleton
- [x] Update component exports
- [x] Update sprint status (story + epic)
- [x] Update CHANGELOG

## Dependencies

- Story 1-1-12: Enterprise SSO SAML Configuration (Done)
- Story 1-1-13: Enterprise SSO OIDC Configuration (Done)
- Clerk/WorkOS Enterprise SSO integration
