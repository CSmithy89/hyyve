# Story 1-1-13: Enterprise SSO OIDC Configuration

**Epic:** E1.1 User Authentication & Identity
**Status:** In Progress
**Priority:** High
**Estimated Points:** 8

## Story Description

As an enterprise administrator, I want to configure OpenID Connect (OIDC) based Single Sign-On (SSO) for my organization so that users can authenticate through our corporate identity provider using standard OAuth 2.0 / OIDC protocols.

## Wireframe Reference

- **Folder:** `enterprise_sso_configuration`
- **Screen ID:** 4.4.1
- **Route:** `/settings/security/sso/oidc`

## Acceptance Criteria

### AC1: Access OIDC Configuration from SSO Settings
- [ ] Navigate to OIDC settings from SSO settings page
- [ ] Page loads at `/settings/security/sso/oidc`
- [ ] Only enterprise tier users can access OIDC configuration
- [ ] Breadcrumb navigation includes Settings > Security > SSO > OIDC

### AC2: OIDC Configuration Form
- [ ] Input field for Discovery URL (.well-known/openid-configuration)
- [ ] Input field for Client ID
- [ ] Secure input field for Client Secret with show/hide toggle
- [ ] Scopes configuration section (openid, profile, email, groups)
- [ ] Token endpoint auth method selector (client_secret_basic, client_secret_post)

### AC3: Auto-Discovery Feature
- [ ] "Discover" button to auto-populate settings from discovery URL
- [ ] Display discovered issuer, authorization endpoint, token endpoint
- [ ] Show loading state during discovery
- [ ] Display error if discovery URL is invalid

### AC4: Scopes Configuration
- [ ] Checkboxes for standard OIDC scopes (openid, profile, email)
- [ ] Optional scopes (groups, offline_access)
- [ ] Custom scope input field
- [ ] Scope description tooltips

### AC5: Redirect URI Display
- [ ] Display auto-generated redirect URI
- [ ] Copy-to-clipboard functionality for redirect URI
- [ ] Display callback URL for IdP configuration

### AC6: Connection Testing
- [ ] "Test Connection" button to validate OIDC configuration
- [ ] Display test results (success/failure with details)
- [ ] Validate token exchange flow
- [ ] Show specific error messages for common issues

### AC7: Save Configuration
- [ ] "Save Configuration" button to persist settings
- [ ] Validation before save (required fields, URL format)
- [ ] Success confirmation message
- [ ] Error handling with specific messages

### AC8: Accessibility Requirements
- [ ] All form inputs have proper labels
- [ ] Keyboard navigation support
- [ ] Screen reader compatible
- [ ] Focus management for modals and dialogs

### AC9: Responsive Design
- [ ] Mobile-friendly layout
- [ ] Form fields stack on small screens
- [ ] Action buttons remain accessible

## Technical Approach

### Clerk WorkOS Integration
Clerk Enterprise SSO uses WorkOS under the hood. The implementation will:

1. **Use Clerk Dashboard** for actual OIDC configuration (Clerk manages WorkOS)
2. **Display configuration UI** that guides admins to set up OIDC
3. **Show redirect URIs** from Clerk for IdP configuration
4. **Test connection** via Clerk's SSO verification endpoints

### API Endpoints (via Clerk/WorkOS)
- WorkOS handles OIDC configuration internally
- Clerk exposes organization SSO settings via Organization API
- Redirect URI available at Clerk endpoints

### Key Differences from SAML
- Uses OAuth 2.0 / OpenID Connect instead of SAML assertions
- Discovery URL for auto-configuration
- Scopes instead of attribute mappings
- JWT tokens instead of XML assertions

### Design Tokens (from wireframe)
- Primary: #5048e5
- Background Dark: #121121
- Surface Dark: #1b1a31
- Border Dark: #272546
- Text Secondary: #9795c6

## Components to Create

1. **OidcConfigForm** - Main OIDC configuration form
2. Reuse existing components:
   - SsoConnectionCard - SSO status toggle
   - IdpProviderCard - Provider selection
   - AttributeMappingRow - For claim mappings if needed

## Route Structure

```
/settings/security/sso          - SSO settings main page
/settings/security/sso/oidc     - OIDC configuration page
```

## Dependencies

- @clerk/nextjs (already installed)
- WorkOS SDK (optional, Clerk handles WorkOS internally)
- Story 1-1-12 components (SsoConnectionCard, IdpProviderCard, etc.)

## Testing Requirements

### Unit Tests
- OidcConfigForm component
- Discovery URL validation
- Scopes configuration
- Connection test states

### E2E Tests
- Navigation to OIDC settings
- Form field interactions
- Discovery flow
- Test connection flow
- Save configuration flow
- Accessibility checks

## Notes

- Enterprise SSO is typically a paid feature
- Real OIDC configuration requires Clerk Dashboard access
- This UI guides users and displays necessary redirect URIs
- Actual IdP configuration is done in Clerk Dashboard or via API

## Related Stories

- 1-1-12: Enterprise SSO SAML Configuration
- 1-1-14: SCIM User Provisioning

---

**Created:** 2026-01-28
**Last Updated:** 2026-01-28
