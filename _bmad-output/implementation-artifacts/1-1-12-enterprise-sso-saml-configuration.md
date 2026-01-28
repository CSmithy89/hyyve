# Story 1-1-12: Enterprise SSO SAML Configuration

**Epic:** E1.1 User Authentication & Identity
**Status:** In Progress
**Priority:** High
**Estimated Points:** 8

## Story Description

As an enterprise administrator, I want to configure SAML-based Single Sign-On (SSO) for my organization so that users can authenticate through our corporate identity provider (IdP) like Okta, Azure AD, or Google Workspace.

## Wireframe Reference

- **Folder:** `enterprise_sso_configuration`
- **Screen ID:** 4.4.1
- **Route:** `/admin/sso` (alternative: `/settings/security/sso` for settings flow)

## Acceptance Criteria

### AC1: Access SSO Configuration from Security Settings
- [ ] Navigate to SSO settings from Security settings page
- [ ] Page loads at `/settings/security/sso`
- [ ] Only enterprise tier users can access SSO configuration
- [ ] Non-enterprise users see upgrade prompt

### AC2: Display Identity Provider Selection
- [ ] Display provider cards for Okta, Azure AD, Google, and custom SAML 2.0
- [ ] Show currently selected/configured provider with visual indicator
- [ ] Allow switching between providers

### AC3: SSO Status Toggle
- [ ] Display SSO enabled/disabled status
- [ ] Toggle to enable/disable SSO for the organization
- [ ] Show confirmation dialog before disabling SSO
- [ ] Display status message (e.g., "Users must authenticate via your provider")

### AC4: SAML Configuration Form
- [ ] Input field for Authorized Domain (e.g., acme-corp.com)
- [ ] Input field for Client ID / Entity ID
- [ ] Secure input field for Client Secret with show/hide toggle
- [ ] Input field for Discovery URL / Metadata URL
- [ ] Support for metadata XML upload as alternative to URL

### AC5: Attribute Mapping Section
- [ ] Display mapping interface for IdP attributes to Hyyve fields
- [ ] Required mappings: Email Address, First Name, Last Name
- [ ] Optional mapping: Group Membership for RBAC
- [ ] Editable mapping values (e.g., user.email, user.given_name)

### AC6: Service Provider (SP) Metadata Display
- [ ] Show Hyyve SP metadata for IdP configuration
- [ ] Display ACS URL (Assertion Consumer Service URL)
- [ ] Display SP Entity ID
- [ ] Copy-to-clipboard functionality for each value
- [ ] Download SP metadata XML button

### AC7: Connection Testing
- [ ] "Test Connection" button to validate configuration
- [ ] Display test results (success/failure with details)
- [ ] Show specific error messages for common issues
- [ ] Validate certificate expiration dates

### AC8: Save Configuration
- [ ] "Save Configuration" button to persist settings
- [ ] Validation before save (required fields, URL format)
- [ ] Success confirmation message
- [ ] Error handling with specific messages

### AC9: Accessibility Requirements
- [ ] All form inputs have proper labels
- [ ] Keyboard navigation support
- [ ] Screen reader compatible
- [ ] Focus management for modals and dialogs

### AC10: Responsive Design
- [ ] Mobile-friendly layout
- [ ] Form fields stack on small screens
- [ ] Action buttons remain accessible

## Technical Approach

### Clerk WorkOS Integration
Clerk Enterprise SSO uses WorkOS under the hood. The implementation will:

1. **Use Clerk Dashboard** for actual SAML configuration (Clerk manages WorkOS)
2. **Display configuration UI** that guides admins to set up SSO
3. **Show SP metadata** from Clerk for IdP configuration
4. **Test connection** via Clerk's SSO verification endpoints

### API Endpoints (via Clerk/WorkOS)
- WorkOS handles SAML configuration internally
- Clerk exposes organization SSO settings via Organization API
- SP metadata available at `https://{clerk-domain}/v1/saml/metadata/{org_id}`

### Key Clerk APIs
```typescript
// Check if organization has SSO enabled
const org = await clerkClient.organizations.getOrganization({ organizationId });
const ssoConnections = await clerkClient.organizations.getSAMLConnections({ organizationId });

// For WorkOS direct integration (if needed)
import WorkOS from '@workos-inc/node';
const workos = new WorkOS(process.env.WORKOS_API_KEY);
```

### Design Tokens (from wireframe)
- Primary: #5048e5
- Background Dark: #121121
- Surface Dark: #1b1a31
- Border Dark: #272546
- Text Secondary: #9795c6

## Components to Create

1. **SamlConfigForm** - Main SAML configuration form
2. **SamlMetadataDisplay** - Display SP metadata for IdP setup
3. **SsoConnectionCard** - Card showing SSO connection status
4. **IdpProviderCard** - Selectable provider card (Okta, Azure, etc.)
5. **AttributeMappingRow** - Single attribute mapping row
6. **ConnectionTestResult** - Test connection result display

## Route Structure

```
/settings/security/sso          - SSO settings main page
/settings/security/sso/saml     - SAML configuration page
```

## Dependencies

- @clerk/nextjs (already installed)
- WorkOS SDK (optional, Clerk handles WorkOS internally)

## Testing Requirements

### Unit Tests
- SamlConfigForm component
- Metadata display and copy functionality
- Form validation
- Connection test states

### E2E Tests
- Navigation to SSO settings
- Provider selection
- Form field interactions
- Test connection flow
- Save configuration flow
- Accessibility checks

## Notes

- Enterprise SSO is typically a paid feature
- Real SAML configuration requires Clerk Dashboard access
- This UI guides users and displays necessary metadata
- Actual IdP configuration is done in Clerk Dashboard or via API

## Related Stories

- 1-1-13: Enterprise SSO OIDC Configuration
- 1-1-14: SCIM User Provisioning

---

**Created:** 2026-01-28
**Last Updated:** 2026-01-28
