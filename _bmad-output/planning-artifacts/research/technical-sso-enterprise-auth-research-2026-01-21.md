# SSO and Enterprise Authentication Research

**Date:** 2026-01-21
**Researcher:** Claude (Opus 4.5)
**Status:** Complete
**Category:** Technical Architecture - Enterprise Features
**Version:** 1.1 (Validated & Enhanced)

> **Validation Status:** ✅ Validated on 2026-01-22
> **Changes in v1.1:** Updated otplib to v13 API, corrected Auth0 pricing, added Passkey Conditional UI section, added Continuous Authentication section, added Zero Trust Identity principles, added synced vs device-bound passkeys, added SCIM rate limiting requirements, added 2026 passwordless adoption statistics.

---

## Executive Summary

This research document covers SSO (Single Sign-On) and enterprise authentication requirements for the Hyyve Platform. Enterprise customers require SAML 2.0, OIDC, SCIM directory sync, MFA, and compliance features. We evaluate implementation options using Clerk, WorkOS, and custom solutions.

**Key Recommendations:**
- **WorkOS** for enterprise SSO (best SAML/SCIM support, purpose-built for B2B)
- **Clerk** for consumer/prosumer authentication (excellent DX, organizations feature, passkeys on free tier)
- **Hybrid approach:** Clerk for base auth + WorkOS for enterprise SSO upgrades
- **SCIM 2.0** for directory sync with major IdPs (Okta, Azure AD, Google Workspace)
- **NEW:** Implement Passkey Conditional UI for modern passwordless UX
- **NEW:** Adopt Zero Trust identity-first principles for enterprise deployments
- **NEW:** Consider continuous authentication for high-security environments

---

## Table of Contents

1. [SAML 2.0 Integration](#1-saml-20-integration)
2. [OIDC (OpenID Connect)](#2-oidc-openid-connect)
3. [SCIM Directory Sync](#3-scim-directory-sync)
4. [Multi-Factor Authentication](#4-multi-factor-authentication)
5. [Passkeys and WebAuthn](#5-passkeys-and-webauthn) *(NEW)*
6. [Continuous Authentication](#6-continuous-authentication) *(NEW)*
7. [Zero Trust Identity](#7-zero-trust-identity) *(NEW)*
8. [Session Management](#8-session-management)
9. [Compliance Features](#9-compliance-features)
10. [Implementation Recommendations](#10-implementation-recommendations)

---

## 1. SAML 2.0 Integration

### 1.1 SAML Concepts

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SAML 2.0 FLOW                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌────────────┐         ┌────────────┐         ┌────────────┐             │
│   │   User     │         │    SP      │         │    IdP     │             │
│   │  Browser   │         │ (Platform) │         │ (Okta/AAD) │             │
│   └─────┬──────┘         └─────┬──────┘         └─────┬──────┘             │
│         │                      │                      │                     │
│         │  1. Access app       │                      │                     │
│         │─────────────────────>│                      │                     │
│         │                      │                      │                     │
│         │  2. Redirect to IdP (SAML AuthnRequest)    │                     │
│         │<─────────────────────│                      │                     │
│         │──────────────────────────────────────────>│                     │
│         │                      │                      │                     │
│         │  3. User authenticates at IdP              │                     │
│         │                      │                      │                     │
│         │  4. IdP sends SAML Response (POST)         │                     │
│         │<──────────────────────────────────────────│                     │
│         │─────────────────────>│                      │                     │
│         │                      │                      │                     │
│         │  5. Validate assertion, create session     │                     │
│         │                      │                      │                     │
│         │  6. Access granted   │                      │                     │
│         │<─────────────────────│                      │                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Key SAML Components

| Component | Description |
|-----------|-------------|
| **Service Provider (SP)** | Your application (Hyyve Platform) |
| **Identity Provider (IdP)** | Customer's auth system (Okta, Azure AD, etc.) |
| **SAML Assertion** | XML document with user identity claims |
| **ACS URL** | Assertion Consumer Service - where IdP posts responses |
| **Entity ID** | Unique identifier for SP/IdP |
| **X.509 Certificate** | Used to sign/verify assertions |

### 1.3 WorkOS SAML Implementation

```typescript
// src/lib/auth/workos-sso.ts
import { WorkOS } from '@workos-inc/node';

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

// Get SSO authorization URL
export async function getSSOAuthorizationURL(
  organizationId: string,
  redirectUri: string,
  state?: string
): Promise<string> {
  // Get the organization's SSO connection
  const connections = await workos.sso.listConnections({
    organizationId,
  });

  if (connections.data.length === 0) {
    throw new Error('No SSO connection configured for this organization');
  }

  const connection = connections.data[0];

  return workos.sso.getAuthorizationUrl({
    connection: connection.id,
    redirectUri,
    state,
  });
}

// Handle SSO callback
export async function handleSSOCallback(code: string): Promise<{
  user: SSOUser;
  organizationId: string;
}> {
  const { profile } = await workos.sso.getProfileAndToken({
    code,
    clientId: process.env.WORKOS_CLIENT_ID!,
  });

  return {
    user: {
      id: profile.id,
      email: profile.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
      rawAttributes: profile.raw_attributes,
    },
    organizationId: profile.organization_id,
  };
}

interface SSOUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  rawAttributes: Record<string, unknown>;
}
```

### 1.4 Major IdP Configurations

#### Okta Setup

```yaml
# Okta SAML Configuration
name_id_format: "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress"
acs_url: "https://api.workos.com/sso/saml/acs/{connection_id}"
entity_id: "https://api.workos.com/sso/saml/metadata/{connection_id}"
attributes:
  - name: "email"
    value: "user.email"
  - name: "firstName"
    value: "user.firstName"
  - name: "lastName"
    value: "user.lastName"
  - name: "groups"
    value: "user.groups"
```

#### Azure AD Setup

```yaml
# Azure AD Enterprise Application
identifier: "https://api.workos.com/sso/saml/metadata/{connection_id}"
reply_url: "https://api.workos.com/sso/saml/acs/{connection_id}"
sign_on_url: "https://yourapp.com/sso/{organization_slug}"
user_attributes:
  - claim: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
    source: "user.mail"
  - claim: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"
    source: "user.givenname"
  - claim: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"
    source: "user.surname"
```

#### Google Workspace Setup

```yaml
# Google Workspace SAML App
acs_url: "https://api.workos.com/sso/saml/acs/{connection_id}"
entity_id: "https://api.workos.com/sso/saml/metadata/{connection_id}"
name_id:
  format: "EMAIL"
  source: "Basic Information > Primary email"
attributes:
  - app_attribute: "firstName"
    source: "Basic Information > First name"
  - app_attribute: "lastName"
    source: "Basic Information > Last name"
```

### 1.5 Just-in-Time (JIT) Provisioning

```typescript
// src/lib/auth/jit-provisioning.ts
import { supabase } from '@/lib/supabase';

interface JITProvisioningResult {
  user: User;
  isNewUser: boolean;
  organization: Organization;
}

export async function jitProvision(
  ssoProfile: SSOProfile,
  organizationId: string
): Promise<JITProvisioningResult> {
  // Check if user exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('email', ssoProfile.email)
    .single();

  if (existingUser) {
    // Update user attributes from IdP
    const { data: updatedUser } = await supabase
      .from('users')
      .update({
        first_name: ssoProfile.firstName,
        last_name: ssoProfile.lastName,
        last_sso_login: new Date().toISOString(),
        idp_attributes: ssoProfile.rawAttributes,
      })
      .eq('id', existingUser.id)
      .select()
      .single();

    // Ensure user is member of organization
    await ensureOrganizationMembership(updatedUser.id, organizationId, ssoProfile);

    return {
      user: updatedUser,
      isNewUser: false,
      organization: await getOrganization(organizationId),
    };
  }

  // Create new user
  const { data: newUser } = await supabase
    .from('users')
    .insert({
      email: ssoProfile.email,
      first_name: ssoProfile.firstName,
      last_name: ssoProfile.lastName,
      auth_provider: 'sso',
      idp_id: ssoProfile.id,
      idp_attributes: ssoProfile.rawAttributes,
      email_verified: true, // SSO implies verified
    })
    .select()
    .single();

  // Add to organization with default role
  await addOrganizationMembership(newUser.id, organizationId, ssoProfile);

  return {
    user: newUser,
    isNewUser: true,
    organization: await getOrganization(organizationId),
  };
}

async function ensureOrganizationMembership(
  userId: string,
  organizationId: string,
  ssoProfile: SSOProfile
) {
  const { data: membership } = await supabase
    .from('organization_members')
    .select('*')
    .eq('user_id', userId)
    .eq('organization_id', organizationId)
    .single();

  if (!membership) {
    await addOrganizationMembership(userId, organizationId, ssoProfile);
  } else {
    // Update role based on IdP groups if configured
    const role = mapIdPGroupsToRole(ssoProfile.groups);
    if (role && role !== membership.role) {
      await supabase
        .from('organization_members')
        .update({ role })
        .eq('user_id', userId)
        .eq('organization_id', organizationId);
    }
  }
}
```

### 1.6 Attribute Mapping and Role Assignment

```typescript
// src/lib/auth/attribute-mapping.ts

interface AttributeMappingConfig {
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  groups?: string;
  department?: string;
  jobTitle?: string;
}

// Default mappings for common IdPs
const DEFAULT_MAPPINGS: Record<string, AttributeMappingConfig> = {
  okta: {
    email: 'email',
    firstName: 'firstName',
    lastName: 'lastName',
    groups: 'groups',
  },
  azure_ad: {
    email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
    firstName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname',
    lastName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname',
    groups: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/groups',
  },
  google: {
    email: 'email',
    firstName: 'firstName',
    lastName: 'lastName',
  },
};

// Role mapping from IdP groups
interface RoleMappingRule {
  idpGroupPattern: string; // Regex pattern
  platformRole: 'admin' | 'member' | 'viewer';
}

const DEFAULT_ROLE_MAPPINGS: RoleMappingRule[] = [
  { idpGroupPattern: '.*admin.*', platformRole: 'admin' },
  { idpGroupPattern: '.*developer.*', platformRole: 'member' },
  { idpGroupPattern: '.*viewer.*', platformRole: 'viewer' },
];

export function mapIdPGroupsToRole(
  groups: string[] = [],
  customMappings?: RoleMappingRule[]
): 'admin' | 'member' | 'viewer' {
  const mappings = customMappings ?? DEFAULT_ROLE_MAPPINGS;

  for (const group of groups) {
    for (const mapping of mappings) {
      if (new RegExp(mapping.idpGroupPattern, 'i').test(group)) {
        return mapping.platformRole;
      }
    }
  }

  return 'member'; // Default role
}
```

---

## 2. OIDC (OpenID Connect)

### 2.1 OIDC vs SAML Comparison

| Feature | OIDC | SAML 2.0 |
|---------|------|----------|
| **Format** | JSON (JWT) | XML |
| **Transport** | REST/OAuth 2.0 | HTTP POST/Redirect |
| **Token Size** | Smaller (~1KB) | Larger (~5-10KB) |
| **Mobile Support** | Excellent | Poor |
| **Modern Apps** | Designed for | Retrofitted |
| **Enterprise Adoption** | Growing | Dominant |
| **Setup Complexity** | Lower | Higher |
| **Standard** | 2014 | 2005 |

### 2.2 When to Use OIDC vs SAML

**Use OIDC when:**
- Building modern web/mobile applications
- Customer uses Google Workspace, Auth0, or modern IdPs
- Need API access tokens (OAuth 2.0)
- Simpler setup is preferred

**Use SAML when:**
- Enterprise customer requires it (often mandated by IT)
- Customer uses Okta, Azure AD, or legacy IdPs
- Need to integrate with existing SAML infrastructure
- Compliance requires SAML specifically

### 2.3 WorkOS OIDC Implementation

```typescript
// src/lib/auth/workos-oidc.ts
import { WorkOS } from '@workos-inc/node';

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

export async function getOIDCAuthorizationURL(
  connectionId: string,
  redirectUri: string,
  state: string
): Promise<string> {
  return workos.sso.getAuthorizationUrl({
    connection: connectionId,
    redirectUri,
    state,
    // OIDC-specific scopes
    scope: 'openid profile email',
  });
}

// OIDC tokens include id_token
export async function handleOIDCCallback(code: string): Promise<{
  profile: Profile;
  accessToken: string;
  idToken: string;
}> {
  const result = await workos.sso.getProfileAndToken({
    code,
    clientId: process.env.WORKOS_CLIENT_ID!,
  });

  return {
    profile: result.profile,
    accessToken: result.access_token,
    idToken: result.id_token!, // Available for OIDC connections
  };
}
```

### 2.4 Custom OIDC Provider Integration

```typescript
// src/lib/auth/custom-oidc.ts
import { jwtVerify, createRemoteJWKSet } from 'jose';

interface OIDCProviderConfig {
  issuer: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  userinfoEndpoint: string;
  jwksUri: string;
  clientId: string;
  clientSecret: string;
}

export class CustomOIDCProvider {
  private config: OIDCProviderConfig;
  private jwks: ReturnType<typeof createRemoteJWKSet>;

  constructor(config: OIDCProviderConfig) {
    this.config = config;
    this.jwks = createRemoteJWKSet(new URL(config.jwksUri));
  }

  getAuthorizationUrl(redirectUri: string, state: string, nonce: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: redirectUri,
      scope: 'openid profile email',
      state,
      nonce,
    });

    return `${this.config.authorizationEndpoint}?${params}`;
  }

  async exchangeCode(code: string, redirectUri: string): Promise<TokenResponse> {
    const response = await fetch(this.config.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
      }),
    });

    return response.json();
  }

  async verifyIdToken(idToken: string, nonce: string): Promise<IdTokenClaims> {
    const { payload } = await jwtVerify(idToken, this.jwks, {
      issuer: this.config.issuer,
      audience: this.config.clientId,
    });

    if (payload.nonce !== nonce) {
      throw new Error('Invalid nonce');
    }

    return payload as IdTokenClaims;
  }
}
```

---

## 3. SCIM Directory Sync

### 3.1 SCIM 2.0 Overview

SCIM (System for Cross-domain Identity Management) enables automatic user provisioning and deprovisioning between IdPs and applications.

> **⚠️ Updated (v1.1):** Added rate limiting and performance requirements from Microsoft Entra 2025 guidance.

**SCIM Implementation Requirements (RFC 7644):**

| Requirement | Value | Source |
|-------------|-------|--------|
| **Minimum throughput** | 25 requests/second per tenant | Microsoft Entra 2025 |
| **Rate limiting** | HTTP 429 with Retry-After header | RFC 7644 |
| **PATCH response** | HTTP 204 No Content | RFC 7644 Sec 3.5.2 |
| **OAuth grant** | Client Credentials (Authorization Code deprecated) | Microsoft 2025 |

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SCIM DIRECTORY SYNC                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌────────────────┐                    ┌────────────────┐                  │
│   │  Identity      │                    │   Hyyve  │                  │
│   │  Provider      │                    │   Platform     │                  │
│   │  (Okta/AAD)    │                    │   (SCIM Server)│                  │
│   └───────┬────────┘                    └───────┬────────┘                  │
│           │                                      │                           │
│           │  User Created in IdP                │                           │
│           │──────────────────────────────────>│                           │
│           │  POST /scim/v2/Users               │                           │
│           │                                      │                           │
│           │  User Updated in IdP                │                           │
│           │──────────────────────────────────>│                           │
│           │  PATCH /scim/v2/Users/{id}         │                           │
│           │                                      │                           │
│           │  User Deactivated in IdP            │                           │
│           │──────────────────────────────────>│                           │
│           │  PATCH /scim/v2/Users/{id}         │                           │
│           │  { "active": false }                │                           │
│           │                                      │                           │
│           │  Group Membership Changed           │                           │
│           │──────────────────────────────────>│                           │
│           │  PATCH /scim/v2/Groups/{id}        │                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 WorkOS Directory Sync

```typescript
// src/lib/auth/directory-sync.ts
import { WorkOS } from '@workos-inc/node';

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

// List directory users
export async function listDirectoryUsers(directoryId: string) {
  const users = await workos.directorySync.listUsers({
    directory: directoryId,
  });

  return users.data.map((user) => ({
    id: user.id,
    email: user.emails[0]?.value,
    firstName: user.first_name,
    lastName: user.last_name,
    state: user.state, // 'active' | 'inactive'
    groups: user.groups.map((g) => g.name),
    rawAttributes: user.raw_attributes,
  }));
}

// List directory groups
export async function listDirectoryGroups(directoryId: string) {
  const groups = await workos.directorySync.listGroups({
    directory: directoryId,
  });

  return groups.data.map((group) => ({
    id: group.id,
    name: group.name,
    rawAttributes: group.raw_attributes,
  }));
}

// Get group members
export async function getGroupMembers(groupId: string) {
  const users = await workos.directorySync.listUsers({
    group: groupId,
  });

  return users.data;
}
```

### 3.3 SCIM Webhook Handler

```typescript
// src/app/api/webhooks/workos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { WorkOS } from '@workos-inc/node';
import { supabase } from '@/lib/supabase';

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get('workos-signature');

  // Verify webhook signature
  const event = workos.webhooks.constructEvent({
    payload,
    sigHeader: signature!,
    secret: process.env.WORKOS_WEBHOOK_SECRET!,
  });

  switch (event.event) {
    case 'dsync.user.created':
      await handleUserCreated(event.data);
      break;

    case 'dsync.user.updated':
      await handleUserUpdated(event.data);
      break;

    case 'dsync.user.deleted':
      await handleUserDeleted(event.data);
      break;

    case 'dsync.group.created':
      await handleGroupCreated(event.data);
      break;

    case 'dsync.group.updated':
      await handleGroupUpdated(event.data);
      break;

    case 'dsync.group.deleted':
      await handleGroupDeleted(event.data);
      break;

    case 'dsync.group.user_added':
      await handleGroupMemberAdded(event.data);
      break;

    case 'dsync.group.user_removed':
      await handleGroupMemberRemoved(event.data);
      break;
  }

  return NextResponse.json({ received: true });
}

async function handleUserCreated(data: DirectoryUserEvent) {
  const { directory_id, user } = data;

  // Get organization from directory
  const org = await getOrganizationByDirectoryId(directory_id);

  // Create or update user
  await supabase.from('users').upsert({
    idp_id: user.id,
    email: user.emails[0]?.value,
    first_name: user.first_name,
    last_name: user.last_name,
    auth_provider: 'directory_sync',
    email_verified: true,
  });

  // Add to organization
  const dbUser = await getUserByIdpId(user.id);
  await supabase.from('organization_members').upsert({
    user_id: dbUser.id,
    organization_id: org.id,
    role: 'member',
    provisioned_by: 'scim',
  });

  console.log(`User provisioned: ${user.emails[0]?.value}`);
}

async function handleUserDeleted(data: DirectoryUserEvent) {
  const { user } = data;

  // Deactivate user (don't delete to preserve audit trail)
  await supabase
    .from('users')
    .update({
      status: 'deactivated',
      deactivated_at: new Date().toISOString(),
    })
    .eq('idp_id', user.id);

  // Remove from all organizations
  const dbUser = await getUserByIdpId(user.id);
  await supabase
    .from('organization_members')
    .delete()
    .eq('user_id', dbUser.id)
    .eq('provisioned_by', 'scim');

  console.log(`User deprovisioned: ${user.emails[0]?.value}`);
}

async function handleGroupMemberAdded(data: GroupMembershipEvent) {
  const { group, user } = data;

  // Map IdP group to platform role
  const role = mapGroupToRole(group.name);

  const dbUser = await getUserByIdpId(user.id);
  const org = await getOrganizationByGroupId(group.id);

  // Update membership role
  await supabase
    .from('organization_members')
    .update({ role })
    .eq('user_id', dbUser.id)
    .eq('organization_id', org.id);

  console.log(`User ${user.emails[0]?.value} added to group ${group.name}`);
}
```

### 3.4 Group Sync and Role Mapping

```typescript
// src/lib/auth/group-role-mapping.ts

interface GroupRoleMapping {
  groupNamePattern: string;
  role: 'admin' | 'member' | 'viewer';
  projectAccess?: 'all' | 'assigned' | 'none';
}

// Configurable per organization
interface OrganizationGroupConfig {
  organizationId: string;
  mappings: GroupRoleMapping[];
  defaultRole: 'member' | 'viewer';
  autoProvisionProjects: boolean;
}

const DEFAULT_GROUP_MAPPINGS: GroupRoleMapping[] = [
  {
    groupNamePattern: '^Platform[- ]?Admins?$',
    role: 'admin',
    projectAccess: 'all',
  },
  {
    groupNamePattern: '^Platform[- ]?Developers?$',
    role: 'member',
    projectAccess: 'assigned',
  },
  {
    groupNamePattern: '^Platform[- ]?Viewers?$',
    role: 'viewer',
    projectAccess: 'assigned',
  },
];

export function mapGroupToRole(
  groupName: string,
  customMappings?: GroupRoleMapping[]
): 'admin' | 'member' | 'viewer' {
  const mappings = customMappings ?? DEFAULT_GROUP_MAPPINGS;

  for (const mapping of mappings) {
    if (new RegExp(mapping.groupNamePattern, 'i').test(groupName)) {
      return mapping.role;
    }
  }

  return 'viewer';
}
```

---

## 4. Multi-Factor Authentication

### 4.1 MFA Methods

| Method | Security | UX | Implementation |
|--------|----------|----|--------------------|
| **TOTP** | High | Good | Google/Microsoft Authenticator |
| **WebAuthn/Passkeys** | Very High | Excellent | Hardware keys, biometrics |
| **SMS** | Low | Good | Fallback only (SIM swap risk) |
| **Email** | Medium | Good | Magic links |
| **Push** | High | Excellent | Dedicated app required |

### 4.2 TOTP Implementation

> **⚠️ Updated (v1.1):** This code uses the otplib v13 API. The previous `window` option has been replaced with `epochTolerance` for clearer semantics.

```typescript
// src/lib/auth/mfa/totp.ts
// Using otplib v13+ API with functional approach
import { generate, verify, createURI } from '@otplib/totp';
import { NodeCryptoPlugin } from '@otplib/plugin-crypto-node';
import { Base32Plugin } from '@otplib/plugin-base32-enc-dec';
import QRCode from 'qrcode';
import crypto from 'crypto';

// TOTP configuration
const TOTP_CONFIG = {
  period: 30,        // 30-second intervals
  digits: 6,         // 6-digit codes
  algorithm: 'sha1', // SHA-1 (Google Authenticator compatible)
  crypto: new NodeCryptoPlugin(),
  base32: new Base32Plugin(),
};

export async function generateTOTPSecret(
  userId: string,
  email: string
): Promise<{ secret: string; qrCodeUrl: string }> {
  // Generate a cryptographically secure secret (20 bytes = 160 bits)
  const secretBytes = crypto.randomBytes(20);
  const secret = TOTP_CONFIG.base32.encode(secretBytes);

  // Generate OTPAuth URI for QR code
  const otpauthUri = createURI({
    secret,
    issuer: 'Hyyve Platform',
    label: email,
    ...TOTP_CONFIG,
  });

  const qrCodeUrl = await QRCode.toDataURL(otpauthUri);

  // Store encrypted secret temporarily (user must verify before persisting)
  await storePendingMFASecret(userId, secret);

  return { secret, qrCodeUrl };
}

export async function verifyTOTPSetup(
  userId: string,
  token: string
): Promise<boolean> {
  const pendingSecret = await getPendingMFASecret(userId);

  if (!pendingSecret) {
    throw new Error('No pending MFA setup');
  }

  // v13 API: Use epochTolerance instead of window
  // epochTolerance: 30 = ±30 seconds (one step before/after)
  const result = await verify({
    secret: pendingSecret,
    token,
    epochTolerance: 30, // ±30 seconds tolerance for clock drift
    ...TOTP_CONFIG,
  });

  if (result.valid) {
    // Persist the secret and generate recovery codes
    await persistMFASecret(userId, pendingSecret);
    await generateRecoveryCodes(userId);
    await clearPendingMFASecret(userId);
  }

  return result.valid;
}

export async function verifyTOTPToken(
  secret: string,
  token: string
): Promise<boolean> {
  const result = await verify({
    secret,
    token,
    epochTolerance: 30, // ±30 seconds tolerance
    ...TOTP_CONFIG,
  });
  return result.valid;
}
```

**Migration Note (v12 → v13):**
| v12 API | v13 API | Description |
|---------|---------|-------------|
| `authenticator.options = { window: 1 }` | `epochTolerance: 30` | Tolerance in seconds (not steps) |
| `authenticator.generateSecret()` | `crypto.randomBytes()` + base32 encode | More secure secret generation |
| `authenticator.verify({ token, secret })` | `verify({ secret, token, epochTolerance })` | Functional API |

### 4.3 WebAuthn/Passkeys Implementation

```typescript
// src/lib/auth/mfa/webauthn.ts
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';

const rpName = 'Hyyve Platform';
const rpID = process.env.WEBAUTHN_RP_ID!; // e.g., 'yourapp.com'
const origin = process.env.WEBAUTHN_ORIGIN!; // e.g., 'https://yourapp.com'

export async function generateWebAuthnRegistration(
  userId: string,
  userEmail: string,
  existingCredentials: Credential[]
) {
  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: userId,
    userName: userEmail,
    attestationType: 'none',
    excludeCredentials: existingCredentials.map((cred) => ({
      id: cred.credentialId,
      type: 'public-key',
      transports: cred.transports,
    })),
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
    },
  });

  // Store challenge for verification
  await storeWebAuthnChallenge(userId, options.challenge);

  return options;
}

export async function verifyWebAuthnRegistration(
  userId: string,
  response: RegistrationResponseJSON
) {
  const expectedChallenge = await getWebAuthnChallenge(userId);

  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
  });

  if (verification.verified && verification.registrationInfo) {
    // Store credential
    await storeWebAuthnCredential(userId, {
      credentialId: Buffer.from(
        verification.registrationInfo.credentialID
      ).toString('base64url'),
      publicKey: Buffer.from(
        verification.registrationInfo.credentialPublicKey
      ).toString('base64url'),
      counter: verification.registrationInfo.counter,
      transports: response.response.transports,
    });
  }

  return verification.verified;
}
```

### 4.4 MFA Enforcement Policies

```typescript
// src/lib/auth/mfa/policies.ts

interface MFAPolicy {
  required: boolean;
  allowedMethods: ('totp' | 'webauthn' | 'sms')[];
  gracePeriodDays?: number;
  bypassForSSO?: boolean;
  trustedDeviceDays?: number;
}

// Organization-level MFA policies
const DEFAULT_MFA_POLICY: MFAPolicy = {
  required: false,
  allowedMethods: ['totp', 'webauthn'],
  gracePeriodDays: 7,
  bypassForSSO: true,
  trustedDeviceDays: 30,
};

const ENTERPRISE_MFA_POLICY: MFAPolicy = {
  required: true,
  allowedMethods: ['totp', 'webauthn'],
  gracePeriodDays: 0,
  bypassForSSO: false, // Require platform MFA even with SSO
  trustedDeviceDays: 0, // Always require MFA
};

export async function checkMFARequired(
  userId: string,
  organizationId: string,
  authMethod: 'password' | 'sso'
): Promise<{
  required: boolean;
  reason?: string;
  gracePeriodEnds?: Date;
}> {
  const policy = await getOrganizationMFAPolicy(organizationId);
  const userMFA = await getUserMFAStatus(userId);

  // SSO bypass check
  if (authMethod === 'sso' && policy.bypassForSSO) {
    return { required: false };
  }

  // Check trusted device
  if (policy.trustedDeviceDays > 0 && userMFA.hasTrustedDevice) {
    const deviceTrustedUntil = new Date(userMFA.deviceTrustedAt);
    deviceTrustedUntil.setDate(
      deviceTrustedUntil.getDate() + policy.trustedDeviceDays
    );
    if (deviceTrustedUntil > new Date()) {
      return { required: false };
    }
  }

  // MFA required but not set up - check grace period
  if (policy.required && !userMFA.enabled) {
    if (policy.gracePeriodDays > 0) {
      const gracePeriodEnds = new Date(userMFA.createdAt);
      gracePeriodEnds.setDate(
        gracePeriodEnds.getDate() + policy.gracePeriodDays
      );

      if (gracePeriodEnds > new Date()) {
        return {
          required: false,
          reason: 'grace_period',
          gracePeriodEnds,
        };
      }
    }

    return {
      required: true,
      reason: 'policy_requires_setup',
    };
  }

  return {
    required: policy.required && userMFA.enabled,
    reason: policy.required ? 'policy' : undefined,
  };
}
```

---

## 5. Passkeys and WebAuthn *(NEW)*

> **Added in v1.1:** Comprehensive passkey implementation guidance for modern passwordless authentication.

### 5.1 Passwordless Adoption Statistics (2026)

The passwordless authentication landscape has evolved significantly:

| Metric | Value | Source |
|--------|-------|--------|
| US enterprises with passwordless | 50% | JumpCloud 2025 |
| Global consumers aware of passkeys | 75% | FIDO Alliance 2025 |
| Consumers with passkeys enabled | 69% | FIDO Alliance 2025 |
| Microsoft auth cost reduction | 87% | Microsoft 2025 |
| Passkey vs password+MFA speed | 14x faster | Microsoft 2025 |
| Sign-in success rate with passkeys | 95% vs 30% | Microsoft 2025 |

### 5.2 Synced vs Device-Bound Passkeys

Understanding the two categories of passkeys is critical for security policy decisions:

| Type | Synced Passkeys | Device-Bound Passkeys |
|------|-----------------|----------------------|
| **Storage** | Cloud (Apple, Google, Microsoft) | Hardware (security key, TPM) |
| **Cross-device** | Yes | No |
| **Recovery** | Cloud backup | Must register multiple keys |
| **Security level** | High | Very High |
| **Attestation** | Not supported | Supported |
| **Use case** | Consumer, convenience | Enterprise, high-security |

**Important:** If attestation is enabled, only device-bound passkeys are allowed; synced passkeys are excluded.

```typescript
// src/lib/auth/passkey-policy.ts
interface PasskeyPolicy {
  allowSyncedPasskeys: boolean;      // Allow cloud-synced passkeys
  requireAttestation: boolean;       // Require hardware attestation
  allowedAAGUIDs?: string[];         // Specific authenticator models
  requireUserVerification: boolean;  // Require biometric/PIN
}

const CONSUMER_PASSKEY_POLICY: PasskeyPolicy = {
  allowSyncedPasskeys: true,
  requireAttestation: false,
  requireUserVerification: false, // Passkeys are already phishing-resistant
};

const ENTERPRISE_PASSKEY_POLICY: PasskeyPolicy = {
  allowSyncedPasskeys: false,       // Device-bound only
  requireAttestation: true,         // Hardware verification
  allowedAAGUIDs: [
    'ee882879-721c-4913-9775-3dfcce97072a', // YubiKey 5
    // Add other approved security keys
  ],
  requireUserVerification: true,    // Require PIN/biometric
};
```

### 5.3 Conditional UI (Passkey Autofill)

> **⚠️ CRITICAL:** Conditional UI is essential for modern passkey UX. It allows the browser to suggest passkeys via the native autofill API.

Conditional UI enables:
- Passkeys appear in browser autofill dropdown
- Users select passkey alongside saved passwords
- Seamless upgrade path from passwords to passkeys
- Works only with **resident keys (discoverable credentials)**

```typescript
// src/lib/auth/passkey-conditional-ui.ts
import {
  startAuthentication,
  browserSupportsWebAuthnAutofill,
} from '@simplewebauthn/browser';

// Check browser support for conditional UI
export async function supportsConditionalUI(): Promise<boolean> {
  return await browserSupportsWebAuthnAutofill();
}

// Start conditional UI authentication (call on page load)
export async function startConditionalAuthentication(
  optionsEndpoint: string
): Promise<void> {
  if (!(await supportsConditionalUI())) {
    console.log('Conditional UI not supported');
    return;
  }

  try {
    // Get authentication options from server
    const optionsResponse = await fetch(optionsEndpoint);
    const options = await optionsResponse.json();

    // Start authentication with conditional UI
    const credential = await startAuthentication({
      optionsJSON: options,
      useBrowserAutofill: true, // Enable conditional UI
    });

    // Send credential to server for verification
    await verifyCredential(credential);
  } catch (error) {
    // User cancelled or no passkey available - this is normal
    console.log('Conditional UI authentication not completed:', error);
  }
}
```

**Server-side for Conditional UI:**

```typescript
// src/lib/auth/passkey-server.ts
import { generateAuthenticationOptions } from '@simplewebauthn/server';

export async function getConditionalAuthOptions(
  rpID: string
): Promise<PublicKeyCredentialRequestOptionsJSON> {
  // For conditional UI, don't specify allowCredentials
  // This allows any discoverable credential for this RP
  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: 'preferred',
    // NO allowCredentials - enables conditional UI discovery
  });

  return options;
}
```

**HTML Integration:**

```html
<!-- Add autocomplete="webauthn" to enable conditional UI -->
<input
  type="text"
  id="username"
  name="username"
  autocomplete="username webauthn"
  placeholder="Email or username"
/>

<script>
  // Start conditional UI on page load
  import { startConditionalAuthentication } from './passkey-conditional-ui';
  startConditionalAuthentication('/api/auth/passkey/options');
</script>
```

### 5.4 WebAuthn Registration with Discoverable Credentials

```typescript
// Updated registration for conditional UI support
export async function generateWebAuthnRegistration(
  userId: string,
  userEmail: string,
  existingCredentials: Credential[],
  policy: PasskeyPolicy
) {
  const options = await generateRegistrationOptions({
    rpName: 'Hyyve Platform',
    rpID,
    userID: new TextEncoder().encode(userId),
    userName: userEmail,
    userDisplayName: userEmail,
    attestationType: policy.requireAttestation ? 'direct' : 'none',
    excludeCredentials: existingCredentials.map((cred) => ({
      id: cred.credentialId,
      type: 'public-key',
      transports: cred.transports,
    })),
    authenticatorSelection: {
      // CRITICAL: 'required' for conditional UI support
      residentKey: 'required',
      userVerification: policy.requireUserVerification ? 'required' : 'preferred',
      // For enterprise: platform authenticators only (no security keys)
      // authenticatorAttachment: 'platform',
    },
    // Supported algorithms (ES256 preferred)
    supportedAlgorithmIDs: [-7, -257], // ES256, RS256
  });

  // Store challenge for verification
  await storeWebAuthnChallenge(userId, options.challenge);

  return options;
}
```

---

## 6. Continuous Authentication *(NEW)*

> **Added in v1.1:** Zero-trust continuous verification using behavioral signals.

### 6.1 Overview

Continuous authentication monitors user behavior throughout a session, not just at login. This aligns with Zero Trust principles where trust is continuously verified.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CONTINUOUS AUTHENTICATION FLOW                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Login ──► Session Start ──► Continuous Monitoring ──► Risk Score          │
│                                      │                        │              │
│                                      ▼                        ▼              │
│                              ┌──────────────┐          ┌──────────────┐     │
│                              │  Behavioral  │          │   Step-up    │     │
│                              │   Signals    │          │     Auth     │     │
│                              │              │          │              │     │
│                              │ - Typing     │          │ If risk >    │     │
│                              │ - Mouse      │          │ threshold:   │     │
│                              │ - Navigation │          │ - Re-auth    │     │
│                              │ - Device     │          │ - MFA        │     │
│                              │ - Location   │          │ - Block      │     │
│                              └──────────────┘          └──────────────┘     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Behavioral Signals

| Signal | Description | Risk Indicator |
|--------|-------------|----------------|
| **Typing patterns** | Keystroke dynamics, speed | Significant deviation |
| **Mouse movement** | Trajectory, speed, clicks | Bot-like patterns |
| **Navigation** | Page visit patterns | Unusual access patterns |
| **Device health** | OS, browser, plugins | Compromised indicators |
| **Network** | IP, geolocation, VPN | Impossible travel |
| **Time** | Access hours, duration | Outside normal hours |

### 6.3 Implementation

```typescript
// src/lib/auth/continuous-auth.ts

interface BehavioralSignals {
  typingSpeed: number;           // Characters per minute
  mouseVelocity: number;         // Pixels per second average
  navigationPattern: string[];   // Recent page visits
  deviceFingerprint: string;
  ipAddress: string;
  geoLocation: { lat: number; lon: number };
  timestamp: Date;
}

interface RiskAssessment {
  score: number;           // 0-100 (0 = low risk, 100 = high risk)
  factors: string[];       // Contributing factors
  action: 'allow' | 'step_up' | 'block';
}

export async function assessSessionRisk(
  userId: string,
  sessionId: string,
  signals: BehavioralSignals
): Promise<RiskAssessment> {
  const baseline = await getUserBaseline(userId);
  const factors: string[] = [];
  let score = 0;

  // Impossible travel detection
  const lastLocation = await getLastKnownLocation(userId);
  if (lastLocation) {
    const timeDiff = signals.timestamp.getTime() - lastLocation.timestamp.getTime();
    const distance = calculateDistance(lastLocation.geo, signals.geoLocation);
    const maxPossibleDistance = timeDiff / 3600000 * 900; // 900 km/h max

    if (distance > maxPossibleDistance) {
      score += 50;
      factors.push('impossible_travel');
    }
  }

  // Device change detection
  if (baseline.deviceFingerprint !== signals.deviceFingerprint) {
    score += 20;
    factors.push('new_device');
  }

  // Typing pattern deviation
  const typingDeviation = Math.abs(
    baseline.avgTypingSpeed - signals.typingSpeed
  ) / baseline.avgTypingSpeed;
  if (typingDeviation > 0.5) { // >50% deviation
    score += 15;
    factors.push('typing_anomaly');
  }

  // Determine action
  let action: 'allow' | 'step_up' | 'block';
  if (score >= 70) {
    action = 'block';
  } else if (score >= 40) {
    action = 'step_up';
  } else {
    action = 'allow';
  }

  // Log for audit
  await logRiskAssessment(userId, sessionId, { score, factors, action });

  return { score, factors, action };
}

// Step-up authentication trigger
export async function triggerStepUpAuth(
  sessionId: string,
  reason: string
): Promise<void> {
  await supabase
    .from('user_sessions')
    .update({
      requires_step_up: true,
      step_up_reason: reason,
      step_up_requested_at: new Date().toISOString(),
    })
    .eq('id', sessionId);
}
```

### 6.4 Privacy Considerations

> **Important:** Behavioral biometrics processing must comply with GDPR, CCPA, and other privacy regulations.

- Obtain explicit consent before collecting behavioral data
- Provide opt-out mechanism for continuous monitoring
- Store behavioral baselines encrypted
- Define retention periods (e.g., 90 days)
- Allow users to view and delete their behavioral profiles

---

## 7. Zero Trust Identity *(NEW)*

> **Added in v1.1:** Identity-first security architecture for enterprise deployments.

### 7.1 Zero Trust Principles

> "In a Zero Trust approach, identity is the main signal of trust, not IP addresses or physical location. Every access request must be verified."

| Principle | Implementation |
|-----------|----------------|
| **Never trust, always verify** | Authenticate every request |
| **Assume breach** | Minimize blast radius with least privilege |
| **Verify explicitly** | Use all available signals (identity, device, location, behavior) |
| **Least privilege access** | Just-in-time, just-enough access |
| **Continuous verification** | Monitor throughout session, not just at login |

### 7.2 Identity-First Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ZERO TRUST IDENTITY ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   IDENTITY  │    │   DEVICE    │    │  CONTEXT    │    │   ACCESS    │  │
│  │   SIGNALS   │    │   SIGNALS   │    │  SIGNALS    │    │  DECISION   │  │
│  │             │    │             │    │             │    │             │  │
│  │ - User ID   │ +  │ - Managed?  │ +  │ - Location  │ =  │ - Allow     │  │
│  │ - MFA       │    │ - Compliant │    │ - Time      │    │ - Deny      │  │
│  │ - Risk      │    │ - Encrypted │    │ - Network   │    │ - Step-up   │  │
│  │ - Behavior  │    │ - Up-to-date│    │ - Resource  │    │ - Limit     │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.3 Implementation

```typescript
// src/lib/auth/zero-trust.ts

interface ZeroTrustContext {
  identity: {
    userId: string;
    authMethod: 'password' | 'sso' | 'passkey';
    mfaVerified: boolean;
    riskScore: number;
  };
  device: {
    managed: boolean;
    compliant: boolean;
    encrypted: boolean;
    osUpdated: boolean;
    fingerprint: string;
  };
  context: {
    ipAddress: string;
    geoLocation: { country: string; city: string };
    networkType: 'corporate' | 'vpn' | 'public';
    accessTime: Date;
    resourceSensitivity: 'low' | 'medium' | 'high' | 'critical';
  };
}

interface AccessDecision {
  allowed: boolean;
  conditions?: string[];   // e.g., ['require_mfa', 'read_only']
  reason: string;
}

export async function evaluateZeroTrustPolicy(
  ctx: ZeroTrustContext
): Promise<AccessDecision> {
  // Critical resources require strongest verification
  if (ctx.context.resourceSensitivity === 'critical') {
    if (!ctx.identity.mfaVerified) {
      return { allowed: false, reason: 'MFA required for critical resources' };
    }
    if (!ctx.device.managed || !ctx.device.compliant) {
      return { allowed: false, reason: 'Managed compliant device required' };
    }
    if (ctx.context.networkType === 'public') {
      return { allowed: false, reason: 'VPN or corporate network required' };
    }
  }

  // High-risk identity scores trigger additional verification
  if (ctx.identity.riskScore > 50) {
    if (!ctx.identity.mfaVerified) {
      return {
        allowed: true,
        conditions: ['require_mfa'],
        reason: 'Elevated risk - MFA verification needed',
      };
    }
  }

  // Unmanaged devices get read-only access
  if (!ctx.device.managed && ctx.context.resourceSensitivity !== 'low') {
    return {
      allowed: true,
      conditions: ['read_only'],
      reason: 'Unmanaged device - read-only access',
    };
  }

  // Default allow with standard monitoring
  return {
    allowed: true,
    reason: 'All zero trust checks passed',
  };
}
```

### 7.4 Policy Configuration

```typescript
// src/lib/auth/zero-trust-policies.ts

interface ZeroTrustPolicy {
  name: string;
  resourcePattern: string;   // e.g., '/api/admin/*', '/api/billing/*'
  conditions: PolicyCondition[];
}

interface PolicyCondition {
  type: 'identity' | 'device' | 'context';
  attribute: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'in' | 'not_in';
  value: unknown;
  action: 'deny' | 'require_mfa' | 'read_only' | 'audit';
}

const ZERO_TRUST_POLICIES: ZeroTrustPolicy[] = [
  {
    name: 'Admin API Protection',
    resourcePattern: '/api/admin/*',
    conditions: [
      { type: 'identity', attribute: 'mfaVerified', operator: 'equals', value: true, action: 'deny' },
      { type: 'device', attribute: 'managed', operator: 'equals', value: true, action: 'deny' },
      { type: 'context', attribute: 'networkType', operator: 'in', value: ['corporate', 'vpn'], action: 'deny' },
    ],
  },
  {
    name: 'Billing Access',
    resourcePattern: '/api/billing/*',
    conditions: [
      { type: 'identity', attribute: 'riskScore', operator: 'greater_than', value: 30, action: 'require_mfa' },
    ],
  },
  {
    name: 'Public Network Restriction',
    resourcePattern: '/api/*',
    conditions: [
      { type: 'context', attribute: 'networkType', operator: 'equals', value: 'public', action: 'read_only' },
    ],
  },
];
```

---

## 8. Session Management

### 8.1 Session Configuration

```typescript
// src/lib/auth/session-config.ts

interface SessionConfig {
  maxAge: number;              // Maximum session lifetime (seconds)
  idleTimeout: number;         // Inactivity timeout (seconds)
  absoluteTimeout: number;     // Force re-auth after this time
  refreshThreshold: number;    // Refresh token when this close to expiry
  maxConcurrentSessions: number;
  singleLogoutEnabled: boolean;
}

const DEFAULT_SESSION_CONFIG: SessionConfig = {
  maxAge: 7 * 24 * 60 * 60,        // 7 days
  idleTimeout: 30 * 60,            // 30 minutes
  absoluteTimeout: 24 * 60 * 60,   // 24 hours
  refreshThreshold: 5 * 60,        // 5 minutes
  maxConcurrentSessions: 5,
  singleLogoutEnabled: true,
};

const ENTERPRISE_SESSION_CONFIG: SessionConfig = {
  maxAge: 8 * 60 * 60,             // 8 hours
  idleTimeout: 15 * 60,            // 15 minutes
  absoluteTimeout: 8 * 60 * 60,    // 8 hours
  refreshThreshold: 5 * 60,        // 5 minutes
  maxConcurrentSessions: 3,
  singleLogoutEnabled: true,
};
```

### 8.2 Session Database Schema

```sql
-- Session management tables
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id),

  -- Session tokens
  access_token_hash TEXT NOT NULL,
  refresh_token_hash TEXT,

  -- Device info
  device_fingerprint TEXT,
  user_agent TEXT,
  ip_address INET,
  geo_location JSONB,

  -- Session state
  is_active BOOLEAN DEFAULT true,
  last_activity_at TIMESTAMPTZ DEFAULT now(),
  mfa_verified_at TIMESTAMPTZ,
  trusted_device BOOLEAN DEFAULT false,

  -- Auth context
  auth_method TEXT NOT NULL, -- 'password', 'sso', 'magic_link'
  idp_session_id TEXT, -- For SSO SLO

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  revoked_reason TEXT,

  -- Constraints
  CONSTRAINT valid_session CHECK (expires_at > created_at)
);

-- Indexes for session lookups
CREATE INDEX idx_sessions_user ON user_sessions(user_id) WHERE is_active = true;
CREATE INDEX idx_sessions_token ON user_sessions(access_token_hash) WHERE is_active = true;
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at) WHERE is_active = true;
CREATE INDEX idx_sessions_idp ON user_sessions(idp_session_id) WHERE idp_session_id IS NOT NULL;

-- Session audit log
CREATE TABLE session_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES user_sessions(id),
  user_id UUID NOT NULL REFERENCES users(id),
  event_type TEXT NOT NULL, -- 'created', 'refreshed', 'revoked', 'expired', 'mfa_verified'
  event_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 8.3 Single Logout (SLO)

```typescript
// src/lib/auth/single-logout.ts
import { WorkOS } from '@workos-inc/node';

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

export async function performSingleLogout(
  userId: string,
  currentSessionId: string,
  options: {
    revokeAllSessions?: boolean;
    notifyIdP?: boolean;
  } = {}
) {
  const { revokeAllSessions = false, notifyIdP = true } = options;

  // Get user's SSO connection if any
  const user = await getUserWithSSO(userId);

  // Revoke sessions
  if (revokeAllSessions) {
    await supabase
      .from('user_sessions')
      .update({
        is_active: false,
        revoked_at: new Date().toISOString(),
        revoked_reason: 'user_logout_all',
      })
      .eq('user_id', userId)
      .eq('is_active', true);
  } else {
    await supabase
      .from('user_sessions')
      .update({
        is_active: false,
        revoked_at: new Date().toISOString(),
        revoked_reason: 'user_logout',
      })
      .eq('id', currentSessionId);
  }

  // Notify IdP for SLO (if SAML)
  if (notifyIdP && user.ssoConnection) {
    // WorkOS handles SLO automatically for supported IdPs
    // For custom SAML, send LogoutRequest
    if (user.ssoConnection.type === 'saml') {
      await sendSAMLLogoutRequest(user);
    }
  }

  // Log the event
  await logSessionEvent(currentSessionId, userId, 'revoked', {
    revokeAllSessions,
    notifyIdP,
  });
}

// Handle IdP-initiated SLO
export async function handleIdPLogout(
  idpSessionId: string
): Promise<void> {
  // Find and revoke all sessions with this IdP session
  await supabase
    .from('user_sessions')
    .update({
      is_active: false,
      revoked_at: new Date().toISOString(),
      revoked_reason: 'idp_logout',
    })
    .eq('idp_session_id', idpSessionId)
    .eq('is_active', true);
}
```

### 8.4 Device Management

```typescript
// src/lib/auth/device-management.ts

interface UserDevice {
  id: string;
  userId: string;
  deviceFingerprint: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  lastUsedAt: Date;
  lastIpAddress: string;
  isTrusted: boolean;
  trustedUntil?: Date;
}

export async function getDeviceFingerprint(
  request: NextRequest
): Promise<string> {
  const userAgent = request.headers.get('user-agent') ?? '';
  const acceptLanguage = request.headers.get('accept-language') ?? '';
  const ip = getClientIP(request);

  // Create a stable fingerprint
  const components = [
    userAgent,
    acceptLanguage,
    // Add more stable signals
  ];

  return createHash('sha256')
    .update(components.join('|'))
    .digest('hex');
}

export async function listUserDevices(userId: string): Promise<UserDevice[]> {
  const { data: sessions } = await supabase
    .from('user_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('last_activity_at', { ascending: false });

  // Group by device fingerprint
  const deviceMap = new Map<string, UserDevice>();

  for (const session of sessions ?? []) {
    if (!deviceMap.has(session.device_fingerprint)) {
      deviceMap.set(session.device_fingerprint, {
        id: session.device_fingerprint,
        userId,
        deviceFingerprint: session.device_fingerprint,
        deviceName: parseDeviceName(session.user_agent),
        deviceType: parseDeviceType(session.user_agent),
        browser: parseBrowser(session.user_agent),
        os: parseOS(session.user_agent),
        lastUsedAt: new Date(session.last_activity_at),
        lastIpAddress: session.ip_address,
        isTrusted: session.trusted_device,
        trustedUntil: session.trusted_until,
      });
    }
  }

  return Array.from(deviceMap.values());
}

export async function revokeDevice(
  userId: string,
  deviceFingerprint: string
): Promise<void> {
  await supabase
    .from('user_sessions')
    .update({
      is_active: false,
      revoked_at: new Date().toISOString(),
      revoked_reason: 'device_revoked',
    })
    .eq('user_id', userId)
    .eq('device_fingerprint', deviceFingerprint)
    .eq('is_active', true);
}
```

---

## 9. Compliance Features

### 9.1 Audit Logging

```typescript
// src/lib/audit/logger.ts

type AuditEventType =
  | 'auth.login'
  | 'auth.logout'
  | 'auth.login_failed'
  | 'auth.mfa_enabled'
  | 'auth.mfa_disabled'
  | 'auth.password_changed'
  | 'auth.password_reset'
  | 'user.created'
  | 'user.updated'
  | 'user.deleted'
  | 'user.role_changed'
  | 'org.member_added'
  | 'org.member_removed'
  | 'org.settings_changed'
  | 'sso.connection_created'
  | 'sso.connection_deleted'
  | 'api_key.created'
  | 'api_key.revoked';

interface AuditEvent {
  id: string;
  eventType: AuditEventType;
  actorId: string;
  actorType: 'user' | 'system' | 'api_key';
  actorEmail?: string;
  targetId?: string;
  targetType?: string;
  organizationId?: string;
  ipAddress: string;
  userAgent: string;
  geoLocation?: {
    country: string;
    city: string;
  };
  metadata: Record<string, unknown>;
  timestamp: Date;
}

export async function logAuditEvent(
  event: Omit<AuditEvent, 'id' | 'timestamp'>
): Promise<void> {
  await supabase.from('audit_logs').insert({
    ...event,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  });

  // Also send to external SIEM if configured
  if (process.env.SIEM_WEBHOOK_URL) {
    await sendToSIEM(event);
  }
}

// Audit log retention and export
export async function exportAuditLogs(
  organizationId: string,
  startDate: Date,
  endDate: Date,
  format: 'json' | 'csv'
): Promise<string> {
  const { data: logs } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('organization_id', organizationId)
    .gte('timestamp', startDate.toISOString())
    .lte('timestamp', endDate.toISOString())
    .order('timestamp', { ascending: true });

  if (format === 'csv') {
    return convertToCSV(logs);
  }

  return JSON.stringify(logs, null, 2);
}
```

### 9.2 Password Policies

```typescript
// src/lib/auth/password-policy.ts
import { zxcvbn } from '@zxcvbn-ts/core';

interface PasswordPolicy {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  minStrengthScore: number; // 0-4 (zxcvbn)
  preventCommonPasswords: boolean;
  preventUserInfoInPassword: boolean;
  historyCount: number; // Prevent reuse of last N passwords
  maxAgeDays: number; // Force password change after N days
}

const DEFAULT_PASSWORD_POLICY: PasswordPolicy = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false,
  minStrengthScore: 3,
  preventCommonPasswords: true,
  preventUserInfoInPassword: true,
  historyCount: 5,
  maxAgeDays: 90,
};

export function validatePassword(
  password: string,
  userInfo: { email: string; firstName?: string; lastName?: string },
  policy: PasswordPolicy = DEFAULT_PASSWORD_POLICY
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Length checks
  if (password.length < policy.minLength) {
    errors.push(`Password must be at least ${policy.minLength} characters`);
  }
  if (password.length > policy.maxLength) {
    errors.push(`Password must be at most ${policy.maxLength} characters`);
  }

  // Character requirements
  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (policy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (policy.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Strength check
  const strength = zxcvbn(password, [
    userInfo.email,
    userInfo.firstName,
    userInfo.lastName,
  ].filter(Boolean));

  if (strength.score < policy.minStrengthScore) {
    errors.push(`Password is too weak. ${strength.feedback.suggestions.join(' ')}`);
  }

  // User info check
  if (policy.preventUserInfoInPassword) {
    const lowerPassword = password.toLowerCase();
    if (
      lowerPassword.includes(userInfo.email.split('@')[0].toLowerCase()) ||
      (userInfo.firstName && lowerPassword.includes(userInfo.firstName.toLowerCase())) ||
      (userInfo.lastName && lowerPassword.includes(userInfo.lastName.toLowerCase()))
    ) {
      errors.push('Password cannot contain your name or email');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
```

### 9.3 IP Allowlisting

```typescript
// src/lib/auth/ip-allowlist.ts
import { isIP, isIPv4, isIPv6 } from 'net';

interface IPAllowlistConfig {
  enabled: boolean;
  allowedIPs: string[]; // Individual IPs
  allowedCIDRs: string[]; // CIDR ranges
  bypassForAdmins: boolean;
  logBlockedAttempts: boolean;
}

export function isIPAllowed(
  clientIP: string,
  config: IPAllowlistConfig
): boolean {
  if (!config.enabled) return true;

  // Check individual IPs
  if (config.allowedIPs.includes(clientIP)) {
    return true;
  }

  // Check CIDR ranges
  for (const cidr of config.allowedCIDRs) {
    if (isIPInCIDR(clientIP, cidr)) {
      return true;
    }
  }

  return false;
}

function isIPInCIDR(ip: string, cidr: string): boolean {
  const [range, bits] = cidr.split('/');
  const mask = parseInt(bits, 10);

  const ipNum = ipToNumber(ip);
  const rangeNum = ipToNumber(range);
  const maskNum = ~(2 ** (32 - mask) - 1);

  return (ipNum & maskNum) === (rangeNum & maskNum);
}

function ipToNumber(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}
```

---

## 7. Implementation Recommendations

### 10.1 Provider Comparison

> **⚠️ Updated (v1.1):** Pricing and features verified January 2026.

| Feature | Clerk | WorkOS | Auth0 |
|---------|-------|--------|-------|
| **SSO (SAML/OIDC)** | EASIE + SAML ($50/conn) | Excellent | Good |
| **SCIM Directory Sync** | No | Yes | Yes |
| **MFA** | Yes | Via SSO | Yes |
| **Passkeys** | Yes (free tier) | Via SSO | Yes |
| **Organizations** | Yes | Yes | Yes |
| **Pricing** | $0.02/MAU (10K free) | $125/connection/mo | See below |
| **Self-hosted** | No | No | Yes |
| **Developer Experience** | Excellent | Good | Good |
| **B2B Focus** | Growing | Primary | CIAM |
| **React Components** | Excellent | Basic | Good |

**Detailed Pricing (January 2026):**

| Provider | Tier | Price | Notes |
|----------|------|-------|-------|
| **Clerk** | Pro | $25/mo + $0.02/MAU | First 10K MAU free |
| **Clerk** | SAML Add-on | $50/connection/mo | Per enterprise connection |
| **Clerk** | Enhanced Auth | $100/mo | MFA, advanced features |
| **WorkOS** | SSO | $125/connection/mo | Volume discounts at 16+ connections |
| **WorkOS** | Directory Sync | $125/connection/mo | SCIM support |
| **Auth0** | Free | $0 | Up to 25K MAU |
| **Auth0** | B2C Essentials | $35/mo | 500 MAU included |
| **Auth0** | B2B Essentials | $150/mo | 500 MAU included |
| **Auth0** | B2B Professional | $16,500/year | Up to 5K MAU |

**WorkOS Volume Discounts:**
- 16-30 connections: $100/mo each
- 31-50 connections: $80/mo each
- 51-100 connections: $65/mo each
- 101+ connections: Custom pricing

### 10.2 Recommended Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ENTERPRISE AUTH ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    AUTHENTICATION LAYER                              │   │
│  │                                                                       │   │
│  │  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │   │
│  │  │    Clerk     │    │   WorkOS     │    │   Custom     │          │   │
│  │  │  (Base Auth) │    │ (Enterprise) │    │  (Fallback)  │          │   │
│  │  │              │    │              │    │              │          │   │
│  │  │ - Email/Pass │    │ - SAML SSO   │    │ - API Keys   │          │   │
│  │  │ - Social     │    │ - OIDC       │    │ - Service    │          │   │
│  │  │ - Magic Link │    │ - SCIM Sync  │    │   Accounts   │          │   │
│  │  │ - MFA        │    │ - Directory  │    │              │          │   │
│  │  └──────────────┘    └──────────────┘    └──────────────┘          │   │
│  │                                                                       │   │
│  └───────────────────────────────┬─────────────────────────────────────┘   │
│                                  │                                          │
│  ┌───────────────────────────────▼─────────────────────────────────────┐   │
│  │                    SESSION MANAGEMENT                                │   │
│  │                                                                       │   │
│  │  • JWT + Refresh tokens                                              │   │
│  │  • Redis for session state                                           │   │
│  │  • Device fingerprinting                                             │   │
│  │  • Concurrent session limits                                         │   │
│  └───────────────────────────────┬─────────────────────────────────────┘   │
│                                  │                                          │
│  ┌───────────────────────────────▼─────────────────────────────────────┐   │
│  │                    AUTHORIZATION LAYER                               │   │
│  │                                                                       │   │
│  │  • Role-based access control (RBAC)                                  │   │
│  │  • Organization-scoped permissions                                   │   │
│  │  • Project-level access                                              │   │
│  │  • Row-Level Security (Supabase RLS)                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 10.3 Database Schema

```sql
-- Enterprise auth tables
CREATE TABLE sso_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- 'okta', 'azure_ad', 'google', 'custom_saml', 'custom_oidc'
  connection_id TEXT NOT NULL, -- WorkOS connection ID
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'active', 'inactive'

  -- Connection config (stored encrypted)
  config_encrypted BYTEA,

  -- Domain enforcement
  domains TEXT[] DEFAULT '{}',
  require_sso_for_domains BOOLEAN DEFAULT false,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES users(id),

  CONSTRAINT unique_org_connection UNIQUE (organization_id, provider)
);

CREATE TABLE directory_syncs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  directory_id TEXT NOT NULL, -- WorkOS directory ID
  provider TEXT NOT NULL, -- 'okta', 'azure_ad', 'google', 'generic_scim'
  status TEXT NOT NULL DEFAULT 'pending',

  -- Sync config
  group_mappings JSONB DEFAULT '[]',
  default_role TEXT DEFAULT 'member',
  auto_provision_users BOOLEAN DEFAULT true,
  auto_deprovision_users BOOLEAN DEFAULT true,

  -- Sync state
  last_sync_at TIMESTAMPTZ,
  last_sync_status TEXT,
  users_synced INTEGER DEFAULT 0,
  groups_synced INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE mfa_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'totp', 'webauthn', 'recovery_codes'

  -- TOTP
  totp_secret_encrypted BYTEA,

  -- WebAuthn
  webauthn_credential_id TEXT,
  webauthn_public_key BYTEA,
  webauthn_counter INTEGER DEFAULT 0,
  webauthn_transports TEXT[],

  -- Recovery codes
  recovery_codes_hash TEXT[],
  recovery_codes_used INTEGER DEFAULT 0,

  -- Metadata
  name TEXT, -- User-provided name for credential
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),

  CONSTRAINT unique_user_credential UNIQUE (user_id, type, webauthn_credential_id)
);

-- Indexes
CREATE INDEX idx_sso_org ON sso_connections(organization_id);
CREATE INDEX idx_sso_domains ON sso_connections USING GIN (domains);
CREATE INDEX idx_directory_org ON directory_syncs(organization_id);
CREATE INDEX idx_mfa_user ON mfa_credentials(user_id);
```

### 10.4 Admin UI for SSO Configuration

```typescript
// src/features/admin/components/SSOConfigPage.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function SSOConfigPage({ organizationId }: { organizationId: string }) {
  const { data: connection, isLoading } = useSSOConnection(organizationId);
  const [provider, setProvider] = useState<'okta' | 'azure_ad' | 'google' | 'custom'>('okta');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Single Sign-On</h1>
        <p className="text-muted-foreground">
          Configure SSO to allow your team to sign in with your identity provider
        </p>
      </div>

      {connection ? (
        <SSOConnectionStatus connection={connection} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Set Up SSO</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={provider} onValueChange={(v) => setProvider(v as any)}>
              <TabsList>
                <TabsTrigger value="okta">Okta</TabsTrigger>
                <TabsTrigger value="azure_ad">Azure AD</TabsTrigger>
                <TabsTrigger value="google">Google Workspace</TabsTrigger>
                <TabsTrigger value="custom">Custom SAML</TabsTrigger>
              </TabsList>

              <TabsContent value="okta">
                <OktaSetupWizard organizationId={organizationId} />
              </TabsContent>

              <TabsContent value="azure_ad">
                <AzureADSetupWizard organizationId={organizationId} />
              </TabsContent>

              <TabsContent value="google">
                <GoogleWorkspaceSetupWizard organizationId={organizationId} />
              </TabsContent>

              <TabsContent value="custom">
                <CustomSAMLSetupWizard organizationId={organizationId} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Domain Enforcement</CardTitle>
        </CardHeader>
        <CardContent>
          <DomainEnforcementSettings organizationId={organizationId} />
        </CardContent>
      </Card>
    </div>
  );
}
```

### 10.5 Implementation Phases

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| **Phase 1: Foundation** | 2 weeks | Clerk integration, basic session management |
| **Phase 2: WorkOS SSO** | 2 weeks | SAML/OIDC via WorkOS, JIT provisioning |
| **Phase 3: Directory Sync** | 2 weeks | SCIM integration, group mapping |
| **Phase 4: MFA & Passkeys** | 2 weeks | TOTP, WebAuthn, Conditional UI support |
| **Phase 5: Compliance** | 2 weeks | Audit logging, password policies, IP allowlist |
| **Phase 6: Admin UI** | 2 weeks | SSO config wizard, MFA management |
| **Phase 7: Zero Trust** | 2 weeks | Continuous auth, risk-based policies *(NEW)*

---

## 11. References

### Core Standards
- [SAML 2.0 Specification](https://docs.oasis-open.org/security/saml/v2.0/)
- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
- [SCIM 2.0 Protocol (RFC 7644)](https://datatracker.ietf.org/doc/html/rfc7644)
- [SCIM 2.0 Core Schema (RFC 7643)](https://datatracker.ietf.org/doc/html/rfc7643)
- [WebAuthn Level 3](https://www.w3.org/TR/webauthn-3/)
- [FIDO2 Specifications](https://fidoalliance.org/specifications/)

### Provider Documentation
- [WorkOS Documentation](https://workos.com/docs)
- [WorkOS Pricing](https://workos.com/pricing)
- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Pricing](https://clerk.com/pricing)
- [Auth0 by Okta](https://auth0.com/docs)

### Implementation Guides
- [SimpleWebAuthn Documentation](https://simplewebauthn.dev/docs)
- [jose JWT Library](https://github.com/panva/jose)
- [otplib v13 Documentation](https://otplib.yeojz.dev)
- [Microsoft Entra SCIM Guide](https://learn.microsoft.com/en-us/entra/identity/app-provisioning/use-scim-to-provision-users-and-groups)

### Security & Compliance
- [NIST Digital Identity Guidelines (SP 800-63)](https://pages.nist.gov/800-63-3/)
- [FIDO Alliance 2025 Report](https://fidoalliance.org/fido-alliance-publishes-2025-online-authentication-barometer/)
- [Zero Trust Architecture (NIST SP 800-207)](https://csrc.nist.gov/pubs/sp/800/207/final)

### Industry Research *(NEW)*
- [JumpCloud Passwordless Adoption Trends 2025](https://jumpcloud.com/blog/passwordless-authentication-adoption-trends)
- [OLOID MFA Trends 2026](https://www.oloid.com/blog/future-trends-in-multi-factor-authentication-what-to-expect)
- [Scalefusion IAM Trends 2026](https://blog.scalefusion.com/iam-trends/)
- [CSA Passwordless Security](https://cloudsecurityalliance.org/blog/2025/10/29/passwordless-authentication-a-digital-trust-transformation-in-combating-credential-based-attacks)

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-21 | Claude (Opus 4.5) | Initial research document |
| 1.1 | 2026-01-22 | Claude (Opus 4.5) | **Validated & Enhanced:** Updated otplib to v13 API, corrected Auth0 pricing, added Passkeys section with Conditional UI, added Continuous Authentication section, added Zero Trust Identity section, added SCIM rate limiting requirements, added 2026 passwordless statistics, updated section numbering |
