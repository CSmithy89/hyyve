# Multi-Tenant SaaS Architecture Research
## Hyyve Platform - Technical Deep Dive

**Date:** January 20, 2026
**Status:** Verified (2026-01-21)
**Research Focus:** Multi-tenancy patterns for Workspace -> Project -> Module -> Agent hierarchy
**Target Use Case:** Platform with client access granting, billing, marketplace module sales, and per-project RAG knowledge bases

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Multi-Tenancy Database Strategies](#multi-tenancy-database-strategies)
3. [Supabase Multi-Tenancy Patterns](#supabase-multi-tenancy-patterns)
4. [Neon Database Patterns](#neon-database-patterns)
5. [Authentication & Authorization](#authentication--authorization)
6. [Data Isolation Patterns](#data-isolation-patterns)
7. [Resource Isolation](#resource-isolation)
8. [Tenant Provisioning](#tenant-provisioning)
9. [Hierarchical Structure Implementation](#hierarchical-structure-implementation)
10. [Marketplace & Module Licensing](#marketplace--module-licensing)
11. [Recommendations for Hyyve Platform](#recommendations-for-hyyve-platform)
12. [Sources](#sources)

---

## Executive Summary

This research document provides comprehensive analysis of multi-tenant SaaS architecture patterns specifically tailored for an Hyyve platform with the following hierarchy:

```
Workspace (Organization/User)
    └── Project (Application)
        └── Module (Feature Bundle)
            └── Agent/Workflow (Execution Unit)
```

### Key Findings

| Aspect | Recommendation | Rationale |
|--------|----------------|-----------|
| **Database Strategy** | Hybrid: Shared DB + RLS with optional dedicated for enterprise | Cost-effective while allowing premium isolation |
| **Auth Provider** | Clerk Organizations + WorkOS for enterprise SSO | Supports organizations, SSO, and directory sync/SCIM |
| **Data Isolation** | Row-Level Security (RLS) as primary + cryptographic isolation for sensitive data | Defense-in-depth approach |
| **Resource Isolation** | Kubernetes namespaces + per-tenant rate limiting | Prevents noisy neighbor issues |
| **Tenant Provisioning** | API-driven automation with webhook notifications | Enables instant onboarding at scale |

---

## Multi-Tenancy Database Strategies

### Strategy Comparison Matrix

| Strategy | Isolation Level | Cost | Complexity | Best For |
|----------|----------------|------|------------|----------|
| **Shared DB + Row-Level Security** | Low-Medium | Low | Low | Startups, SMB customers |
| **Schema Per Tenant** | Medium | Medium | Medium | B2B with compliance needs |
| **Database Per Tenant** | High | High | High | Enterprise, regulated industries |
| **Hybrid Approach** | Variable | Variable | Medium-High | SaaS with tiered offerings |

### 1. Shared Database with Row-Level Security (Pool Model)

All tenants share the same database and tables. Data segregation is enforced via `tenant_id` columns and RLS policies.

```
┌─────────────────────────────────────────────────────────────┐
│                    SHARED DATABASE                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              workspaces table                        │    │
│  │  id | name      | owner_id | created_at              │    │
│  │  1  | Acme Corp | user_123 | 2026-01-01              │    │
│  │  2  | Globex    | user_456 | 2026-01-02              │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              projects table                          │    │
│  │  id | workspace_id | name        | rag_config        │    │
│  │  1  | 1            | Customer AI | {...}             │    │
│  │  2  | 2            | Sales Bot   | {...}             │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  RLS Policy: WHERE workspace_id = current_tenant()           │
└─────────────────────────────────────────────────────────────┘
```

**Advantages:**
- Lowest operational overhead
- Single schema to maintain
- Easy cross-tenant analytics
- Fast time-to-market

**Disadvantages:**
- Risk of data leakage if RLS misconfigured
- Noisy neighbor performance issues
- Limited per-tenant customization
- Complex backup/restore for individual tenants

**When to Use:**
- Early-stage SaaS products
- SMB-focused offerings
- Cost-sensitive environments
- Applications without strict compliance requirements

### 2. Schema Per Tenant

Each tenant gets a dedicated PostgreSQL schema within the same database instance.

```
┌─────────────────────────────────────────────────────────────┐
│                    SHARED DATABASE                           │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │   tenant_acme       │  │   tenant_globex     │          │
│  │  ├─ workspaces      │  │  ├─ workspaces      │          │
│  │  ├─ projects        │  │  ├─ projects        │          │
│  │  ├─ modules         │  │  ├─ modules         │          │
│  │  └─ agents          │  │  └─ agents          │          │
│  └─────────────────────┘  └─────────────────────┘          │
│                                                              │
│  search_path = 'tenant_acme' (set per connection)           │
└─────────────────────────────────────────────────────────────┘
```

**Advantages:**
- Stronger logical isolation
- Easier per-tenant backups
- Native PostgreSQL feature
- Simplified RLS (no tenant_id needed per row)

**Disadvantages:**
- Schema migrations across N tenants
- Connection management complexity
- Higher memory footprint
- Limited horizontal scaling

**When to Use:**
- B2B SaaS with compliance requirements
- Mid-market customers
- Need for tenant-specific schema customization
- HIPAA/SOC2 environments

### 3. Database Per Tenant (Silo Model)

Each tenant receives a completely isolated database instance.

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   DATABASE      │  │   DATABASE      │  │   DATABASE      │
│   tenant_acme   │  │   tenant_globex │  │   tenant_xyz    │
│  ├─ workspaces  │  │  ├─ workspaces  │  │  ├─ workspaces  │
│  ├─ projects    │  │  ├─ projects    │  │  ├─ projects    │
│  ├─ modules     │  │  ├─ modules     │  │  ├─ modules     │
│  └─ agents      │  │  └─ agents      │  │  └─ agents      │
└─────────────────┘  └─────────────────┘  └─────────────────┘
        │                    │                    │
        └────────────────────┴────────────────────┘
                    Tenant Registry DB
```

**Advantages:**
- Maximum isolation and security
- Independent scaling per tenant
- Per-tenant compliance configurations
- Easy data portability
- Simplified disaster recovery

**Disadvantages:**
- Highest infrastructure cost
- Complex deployment automation
- Cross-tenant queries require federation
- Schema migration across databases

**When to Use:**
- Enterprise customers with strict SLAs
- Regulated industries (healthcare, finance)
- Customers requiring data residency
- Premium tier offerings

### 4. Hybrid Approach (Recommended for Hyyve)

Combine strategies based on tenant tier and requirements.

```
┌─────────────────────────────────────────────────────────────────────┐
│                     HYBRID ARCHITECTURE                              │
│                                                                      │
│  ┌─────────────────────────────────────────┐  ┌──────────────────┐ │
│  │         SHARED POOL (Free/Pro)          │  │   ENTERPRISE     │ │
│  │  ┌─────────────────────────────────┐    │  │   DEDICATED      │ │
│  │  │  Shared DB with RLS             │    │  │                  │ │
│  │  │  - workspace_id in all tables   │    │  │  ┌────────────┐ │ │
│  │  │  - RLS policies enforce isolation│    │  │  │ Customer A │ │ │
│  │  │  - Shared connection pool       │    │  │  │   DB       │ │ │
│  │  └─────────────────────────────────┘    │  │  └────────────┘ │ │
│  │                                          │  │                  │ │
│  │  Example: Free/Pro/Team tiers           │  │  ┌────────────┐ │ │
│  │  (shared pool)                          │  │  │ Customer B │ │ │
│  └─────────────────────────────────────────┘  │  │   DB       │ │ │
│                                               │  └────────────┘ │ │
│                                               │                  │ │
│                                               │  Example: Enterprise│ │
│                                               │  (dedicated DBs) │ │
│                                               └──────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

**Decision Matrix:**

| Tier | Strategy | Features |
|------|----------|----------|
| Free | Shared DB + RLS | Basic isolation, shared resources |
| Pro | Shared DB + RLS | Enhanced RLS, dedicated connection pool |
| Team | Schema per tenant | Per-team schema, custom indexes |
| Enterprise | Database per tenant | Full isolation, custom SLAs, data residency |

---

## Supabase Multi-Tenancy Patterns

### Row Level Security (RLS) Implementation

Supabase provides native PostgreSQL RLS with convenient auth helpers. This is the foundation for multi-tenant data isolation.

#### Core RLS Concepts

```sql
-- Enable RLS on all tenant-scoped tables
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_bases ENABLE ROW LEVEL SECURITY;
```

#### Key Helper Functions

| Function | Returns | Usage |
|----------|---------|-------|
| `auth.uid()` | UUID | Current authenticated user's ID |
| `auth.jwt()` | JSON | Full JWT claims including custom data |
| `auth.role()` | TEXT | Current role (anon/authenticated) |

#### Workspace Membership Pattern

```sql
-- Create workspace membership table
CREATE TABLE workspace_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
    invited_by UUID REFERENCES auth.users(id),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(workspace_id, user_id)
);

-- Index for performance
CREATE INDEX idx_workspace_members_user ON workspace_members(user_id);
CREATE INDEX idx_workspace_members_workspace ON workspace_members(workspace_id);
```

#### Complete RLS Policy Examples

**Workspaces Table:**

```sql
-- Users can view workspaces they belong to
CREATE POLICY "workspace_select_policy"
ON workspaces FOR SELECT
TO authenticated
USING (
    id IN (
        SELECT workspace_id
        FROM workspace_members
        WHERE user_id = (SELECT auth.uid())
    )
);

-- Only workspace owners can update workspace settings
CREATE POLICY "workspace_update_policy"
ON workspaces FOR UPDATE
TO authenticated
USING (
    id IN (
        SELECT workspace_id
        FROM workspace_members
        WHERE user_id = (SELECT auth.uid())
        AND role = 'owner'
    )
)
WITH CHECK (
    id IN (
        SELECT workspace_id
        FROM workspace_members
        WHERE user_id = (SELECT auth.uid())
        AND role = 'owner'
    )
);

-- Authenticated users can create workspaces
CREATE POLICY "workspace_insert_policy"
ON workspaces FOR INSERT
TO authenticated
WITH CHECK (
    (SELECT auth.uid()) IS NOT NULL
);

-- Only owners can delete workspaces
CREATE POLICY "workspace_delete_policy"
ON workspaces FOR DELETE
TO authenticated
USING (
    id IN (
        SELECT workspace_id
        FROM workspace_members
        WHERE user_id = (SELECT auth.uid())
        AND role = 'owner'
    )
);
```

**Projects Table (Hierarchical):**

```sql
-- Projects inherit access from workspace membership
CREATE POLICY "project_select_policy"
ON projects FOR SELECT
TO authenticated
USING (
    workspace_id IN (
        SELECT workspace_id
        FROM workspace_members
        WHERE user_id = (SELECT auth.uid())
    )
);

-- Only admins and owners can create projects
CREATE POLICY "project_insert_policy"
ON projects FOR INSERT
TO authenticated
WITH CHECK (
    workspace_id IN (
        SELECT workspace_id
        FROM workspace_members
        WHERE user_id = (SELECT auth.uid())
        AND role IN ('owner', 'admin')
    )
);

-- Project-level access for updates (could have project-specific roles)
CREATE POLICY "project_update_policy"
ON projects FOR UPDATE
TO authenticated
USING (
    workspace_id IN (
        SELECT workspace_id
        FROM workspace_members
        WHERE user_id = (SELECT auth.uid())
        AND role IN ('owner', 'admin', 'member')
    )
)
WITH CHECK (
    workspace_id IN (
        SELECT workspace_id
        FROM workspace_members
        WHERE user_id = (SELECT auth.uid())
        AND role IN ('owner', 'admin', 'member')
    )
);
```

**Modules Table:**

```sql
-- Module access through project -> workspace chain
CREATE POLICY "module_select_policy"
ON modules FOR SELECT
TO authenticated
USING (
    project_id IN (
        SELECT p.id
        FROM projects p
        JOIN workspace_members wm ON p.workspace_id = wm.workspace_id
        WHERE wm.user_id = (SELECT auth.uid())
    )
);

-- Insert modules if user has project access
CREATE POLICY "module_insert_policy"
ON modules FOR INSERT
TO authenticated
WITH CHECK (
    project_id IN (
        SELECT p.id
        FROM projects p
        JOIN workspace_members wm ON p.workspace_id = wm.workspace_id
        WHERE wm.user_id = (SELECT auth.uid())
        AND wm.role IN ('owner', 'admin', 'member')
    )
);
```

#### Using JWT Claims for Performance

Use **custom JWT claims** for authorization context only if they are injected
server-side (Auth Hooks) into `app_metadata`. Do **not** rely on
`user_metadata` for RLS because it is user-editable.

```sql
-- Create function to get workspace_id from JWT (server-issued claim)
CREATE OR REPLACE FUNCTION get_current_workspace_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT (auth.jwt() -> 'app_metadata' ->> 'workspace_id')::UUID
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optimized RLS using JWT claim + membership check (defense-in-depth)
CREATE POLICY "fast_project_select"
ON projects FOR SELECT
TO authenticated
USING (
    workspace_id = get_current_workspace_id()
    AND workspace_id IN (
        SELECT workspace_id
        FROM workspace_members
        WHERE user_id = (SELECT auth.uid())
    )
);
```

#### Client Access (External Users) Pattern

```sql
-- Table for granting client access to specific projects
CREATE TABLE client_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    client_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    granted_by UUID NOT NULL REFERENCES auth.users(id),
    permissions JSONB DEFAULT '{"read": true, "execute": false}'::JSONB,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, client_user_id)
);

-- Clients can view projects they have access to
CREATE POLICY "client_project_access"
ON projects FOR SELECT
TO authenticated
USING (
    -- Direct workspace member access
    workspace_id IN (
        SELECT workspace_id FROM workspace_members
        WHERE user_id = (SELECT auth.uid())
    )
    OR
    -- Client access grant
    id IN (
        SELECT project_id FROM client_access
        WHERE client_user_id = (SELECT auth.uid())
        AND (expires_at IS NULL OR expires_at > NOW())
    )
);
```

### Supabase Auth Integration

```typescript
// Example: Set workspace context after login
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// After user logs in, store active workspace for UX (not for RLS)
async function setActiveWorkspace(workspaceId: string) {
  const { error } = await supabase.auth.updateUser({
    data: {
      active_workspace_id: workspaceId
    }
  });

  if (error) throw error;

  // Refresh session to update client state
  await supabase.auth.refreshSession();
}

// Query projects - RLS automatically filters
async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*');

  return data; // Only returns projects user has access to
}
```

> **Important:** If you want JWT-based RLS optimization, inject a **custom claim**
> via Supabase Auth Hooks into `app_metadata` (not user metadata),
> and keep a membership-table check for defense-in-depth.

### RLS Performance & Safety Notes (Supabase)

- **Never trust user metadata for RLS.** Only `app_metadata` (server-set) or Auth Hook custom claims should be used in policies.
- **Index policy columns** (e.g., `workspace_id`, `project_id`) to reduce policy overhead on large tables.
- **Keep policies explicit** by operation (`SELECT/INSERT/UPDATE/DELETE`) and role (`TO authenticated`).

---

## Neon Database Patterns

### Database Branching for Multi-Tenancy

Neon's architecture separates storage and compute, enabling unique multi-tenant patterns.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    NEON ARCHITECTURE                                 │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    STORAGE LAYER                             │   │
│  │  Multi-tenant, durable storage with copy-on-write           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│         ┌────────────────────┼────────────────────┐                 │
│         ▼                    ▼                    ▼                 │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐          │
│  │  Compute    │     │  Compute    │     │  Compute    │          │
│  │  Tenant A   │     │  Tenant B   │     │  Tenant C   │          │
│  │  (scales    │     │  (scales    │     │  (scale to  │          │
│  │   up/down)  │     │   up/down)  │     │   zero)     │          │
│  └─────────────┘     └─────────────┘     └─────────────┘          │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Project-Per-Tenant Model

Neon's database-per-tenant guidance maps naturally to a project-per-tenant approach:

```typescript
import { createApiClient } from '@neondatabase/api-client';

const neonClient = createApiClient({
  apiKey: process.env.NEON_API_KEY!
});

interface TenantDatabaseConfig {
  tenantId: string;
  region: 'aws-us-east-1' | 'aws-eu-west-1';
}

async function provisionTenantDatabase(config: TenantDatabaseConfig) {
  // Create a new Neon project for the tenant
  const { data: project } = await neonClient.createProject({
    project: {
      name: `tenant-${config.tenantId}`,
      region_id: config.region
    }
  });

  // Optional: configure endpoint autoscaling/suspend settings after creation
  // (use Neon API/SDK endpoint update calls with autoscaling and suspend settings)

  // Get connection string
  const connectionUri = project.connection_uris[0].connection_uri;

  // Store in tenant registry
  await saveTenantConnection(config.tenantId, {
    projectId: project.id,
    connectionUri,
    region: config.region
  });

  return project;
}

// Run migrations on new tenant database
async function initializeTenantSchema(connectionUri: string) {
  const { Client } = require('pg');
  const client = new Client({ connectionString: connectionUri });

  await client.connect();

  // Apply base schema
  await client.query(`
    CREATE TABLE workspaces (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      settings JSONB DEFAULT '{}'::JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE projects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      rag_config JSONB DEFAULT '{}'::JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE modules (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      config JSONB DEFAULT '{}'::JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE agents (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      definition JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await client.end();
}
```

### Branching for Dev/Test Environments

```typescript
async function createTenantDevBranch(tenantId: string) {
  const tenantConfig = await getTenantConnection(tenantId);

  // Create a branch for development
  const { data: branch } = await neonClient.createProjectBranch(
    tenantConfig.projectId,
    {
      branch: {
        name: `dev-${Date.now()}`,
        parent_id: tenantConfig.mainBranchId // store main branch ID at provision time
      },
      endpoints: [{
        type: 'read_write',
        autoscaling_limit_min_cu: 0.25,
        autoscaling_limit_max_cu: 1
      }]
    }
  );

  return {
    branchId: branch.id,
    connectionUri: branch.endpoints[0].connection_uri
  };
}

// Delete branch when done
async function deleteTenantDevBranch(tenantId: string, branchId: string) {
  const tenantConfig = await getTenantConnection(tenantId);
  await neonClient.deleteProjectBranch(tenantConfig.projectId, branchId);
}
```

### Cost Optimization

| Feature | Benefit | Implementation |
|---------|---------|----------------|
| **Scale to Zero** | Autosuspend compute when idle (storage still billed) | Set `suspend_timeout_seconds` |
| **Branch Storage** | Copy-on-write storage (only deltas) | Use branches for dev/test |
| **Autoscaling** | Match compute to actual load | Set min/max compute units |
| **Cold Start** | Resume in a few hundred ms (varies) | Acceptable for most use cases |

### Neon vs Supabase (Operational Differences)

| Aspect | Neon | Supabase |
|--------|------|----------|
| **Recommended multi-tenant pattern** | Database/project per tenant | Shared DB with RLS |
| **Autosuspend / scale-to-zero** | Supported, configurable | Free plan auto-pauses after inactivity; paid plans remain active |

### Hybrid Approach: Neon + Supabase

For the Hyyve platform, consider:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    HYBRID ARCHITECTURE                               │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    SUPABASE (Shared)                         │   │
│  │  - User authentication (Supabase Auth)                       │   │
│  │  - Workspace/Project metadata                                │   │
│  │  - Billing & subscription data                               │   │
│  │  - Marketplace catalog                                       │   │
│  │  - Audit logs                                                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    NEON (Per Tenant)                         │   │
│  │  - RAG knowledge base vectors (pgvector)                     │   │
│  │  - Agent execution history                                   │   │
│  │  - Module-specific data                                      │   │
│  │  - Workflow state                                            │   │
│  │  - Customer-specific configurations                          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Authentication & Authorization

### Clerk Organizations Pattern

Clerk provides first-class support for multi-tenant B2B applications with Organizations.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CLERK ORGANIZATION MODEL                          │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    APPLICATION                               │   │
│  │  ├── Organization: Acme Corp                                 │   │
│  │  │   ├── Member: alice@acme.com (Admin)                     │   │
│  │  │   ├── Member: bob@acme.com (Developer)                   │   │
│  │  │   └── Member: charlie@acme.com (Viewer)                  │   │
│  │  │                                                           │   │
│  │  ├── Organization: Globex Inc                                │   │
│  │  │   ├── Member: alice@acme.com (Member) -- same user!      │   │
│  │  │   └── Member: dana@globex.com (Admin)                    │   │
│  │  │                                                           │   │
│  │  └── Personal Account: eve@gmail.com                         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

#### Clerk Implementation

```typescript
// clerk-config.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/workspaces(.*)',
  '/api/projects(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

// Using organization context
import { auth } from '@clerk/nextjs/server';

export async function getWorkspaceData() {
  const { userId, orgId, orgRole } = await auth();

  if (!orgId) {
    throw new Error('Organization context required');
  }

  // orgId is the Clerk organization ID
  // Map this to your workspace_id in the database
  const workspace = await db.workspace.findUnique({
    where: { clerk_org_id: orgId }
  });

  // Check permissions based on orgRole
  if (orgRole === 'org:admin') {
    // Full access
  } else if (orgRole === 'org:member') {
    // Limited access
  }

  return workspace;
}
```

#### Custom Roles and Permissions

```typescript
// Define custom roles in Clerk Dashboard
// org:owner - Full control
// org:admin - Manage members, projects
// org:developer - Create/edit modules, agents
// org:viewer - Read-only access

// Permission checking
import { auth } from '@clerk/nextjs/server';

export async function createProject(data: ProjectData) {
  const { has } = await auth();

  // Check for project creation permission
  if (!has({ permission: 'org:project:create' })) {
    throw new Error('Insufficient permissions');
  }

  // Proceed with creation
  return await db.project.create({ data });
}
```

### WorkOS Directory Sync & SSO

For enterprise customers requiring SAML/OIDC SSO and SCIM provisioning:

```typescript
// workos-integration.ts
import { WorkOS } from '@workos-inc/node';

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

// SSO Authentication
// Use a connection ID (or organization ID if you map that in WorkOS)
export async function initiateSSO(connectionId: string) {
  const authorizationUrl = workos.sso.getAuthorizationUrl({
    connection: connectionId,
    clientId: process.env.WORKOS_CLIENT_ID!,
    redirectUri: `${process.env.APP_URL}/api/auth/callback`,
    state: generateState()
  });

  return authorizationUrl;
}

// Handle SSO callback
export async function handleSSOCallback(code: string) {
  const { profile, accessToken, organizationId } = await workos.sso.getProfileAndToken({
    code,
    clientId: process.env.WORKOS_CLIENT_ID!
  });

  // profile contains user info from IdP
  return {
    email: profile.email,
    firstName: profile.firstName,
    lastName: profile.lastName,
    organizationId,
    accessToken
  };
}

// Directory Sync webhook handler
export async function handleDirectoryWebhook(payload: any) {
  const { event, data } = payload;

  switch (event) {
    case 'dsync.user.created':
      await createUserFromDirectory(data);
      break;
    case 'dsync.user.updated':
      await updateUserFromDirectory(data);
      break;
    case 'dsync.user.deleted':
      await deactivateUserFromDirectory(data);
      break;
    case 'dsync.group.created':
      await syncGroupToWorkspace(data);
      break;
    case 'dsync.group.updated':
      await syncGroupToWorkspace(data);
      break;
    case 'dsync.group.deleted':
      await removeGroupFromWorkspace(data);
      break;
    case 'dsync.group.user_added':
      await syncGroupToWorkspace(data);
      break;
    case 'dsync.group.user_removed':
      await syncGroupToWorkspace(data);
      break;
    case 'dsync.activated':
    case 'dsync.deleted':
      await handleDirectoryConnectionLifecycle(event, data);
      break;
  }
}

async function createUserFromDirectory(userData: any) {
  // Map directory user to your system
  const user = await db.user.create({
    data: {
      email: userData.email,
      firstName: userData.first_name ?? userData.firstName,
      lastName: userData.last_name ?? userData.lastName,
      workos_directory_user_id: userData.id,
      workspace_id: await getWorkspaceForDirectory(userData.directory_id)
    }
  });

  // Send welcome email
  await sendWelcomeEmail(user);
}

async function removeGroupFromWorkspace(groupData: any) {
  // Remove or deactivate group mappings on deletion
  await deleteGroupMapping(groupData.id);
}

async function handleDirectoryConnectionLifecycle(event: string, data: any) {
  // React to directory connection activation/deletion
  await auditDirectoryEvent(event, data);
}
```

### RBAC Database Schema

```sql
-- Roles table (application-defined templates)
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB NOT NULL DEFAULT '[]'::JSONB,
    is_system BOOLEAN DEFAULT FALSE, -- Built-in roles can't be deleted
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default system roles
INSERT INTO roles (name, description, permissions, is_system) VALUES
('owner', 'Full workspace control', '["*"]', true),
('admin', 'Manage workspace settings and members', '["workspace:read", "workspace:update", "member:*", "project:*", "module:*", "agent:*"]', true),
('developer', 'Create and manage projects', '["workspace:read", "project:*", "module:*", "agent:*"]', true),
('operator', 'Run agents and view data', '["workspace:read", "project:read", "module:read", "agent:read", "agent:execute"]', true),
('viewer', 'Read-only access', '["workspace:read", "project:read", "module:read", "agent:read"]', true);

-- Workspace member roles
CREATE TABLE workspace_member_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role_id UUID NOT NULL REFERENCES roles(id),
    assigned_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(workspace_id, user_id, role_id)
);

-- Project-level role overrides (optional granularity)
CREATE TABLE project_member_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role_id UUID NOT NULL REFERENCES roles(id),
    assigned_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, user_id, role_id)
);

-- Permission check function
CREATE OR REPLACE FUNCTION check_permission(
    p_user_id UUID,
    p_workspace_id UUID,
    p_project_id UUID,
    p_permission TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    user_permissions JSONB;
BEGIN
    -- Get all permissions for user in workspace
    SELECT COALESCE(
        jsonb_agg(DISTINCT perm),
        '[]'::JSONB
    ) INTO user_permissions
    FROM (
        -- Workspace-level permissions
        SELECT jsonb_array_elements(r.permissions) as perm
        FROM workspace_member_roles wmr
        JOIN roles r ON wmr.role_id = r.id
        WHERE wmr.workspace_id = p_workspace_id
        AND wmr.user_id = p_user_id

        UNION ALL

        -- Project-level permissions (if project specified)
        SELECT jsonb_array_elements(r.permissions) as perm
        FROM project_member_roles pmr
        JOIN roles r ON pmr.role_id = r.id
        WHERE pmr.project_id = p_project_id
        AND pmr.user_id = p_user_id
    ) perms;

    -- Check for wildcard or specific permission
    RETURN user_permissions ? '*'
        OR user_permissions ? p_permission
        OR user_permissions ? (split_part(p_permission, ':', 1) || ':*');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Invitation Flow

```sql
-- Invitations table
CREATE TABLE workspace_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role_id UUID NOT NULL REFERENCES roles(id),
    token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
    invited_by UUID NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '7 days',
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for token lookup
CREATE INDEX idx_invitations_token ON workspace_invitations(token) WHERE accepted_at IS NULL;
```

```typescript
// invitation-service.ts
export async function sendInvitation(
  workspaceId: string,
  email: string,
  roleId: string,
  invitedBy: string
) {
  // Create invitation
  const invitation = await db.workspace_invitations.create({
    data: {
      workspace_id: workspaceId,
      email,
      role_id: roleId,
      invited_by: invitedBy
    }
  });

  // Send email with invitation link
  await sendEmail({
    to: email,
    subject: 'You\'ve been invited to join a workspace',
    template: 'invitation',
    data: {
      inviteUrl: `${APP_URL}/invite/${invitation.token}`,
      workspaceName: await getWorkspaceName(workspaceId)
    }
  });

  return invitation;
}

export async function acceptInvitation(token: string, userId: string) {
  const invitation = await db.workspace_invitations.findFirst({
    where: {
      token,
      expires_at: { gt: new Date() },
      accepted_at: null
    }
  });

  if (!invitation) {
    throw new Error('Invalid or expired invitation');
  }

  // Create membership
  await db.workspace_member_roles.create({
    data: {
      workspace_id: invitation.workspace_id,
      user_id: userId,
      role_id: invitation.role_id,
      assigned_by: invitation.invited_by
    }
  });

  // Mark invitation as accepted
  await db.workspace_invitations.update({
    where: { id: invitation.id },
    data: { accepted_at: new Date() }
  });

  return invitation.workspace_id;
}
```

---

## Data Isolation Patterns

### Defense in Depth Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DATA ISOLATION LAYERS                             │
│                                                                      │
│  Layer 1: API Gateway                                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  - Rate limiting per tenant                                  │   │
│  │  - API key validation                                        │   │
│  │  - Request/response logging                                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│  Layer 2: Application                                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  - Tenant context middleware                                 │   │
│  │  - Permission checks                                         │   │
│  │  - Input validation                                          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│  Layer 3: Database (RLS)                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  - Row-level security policies                               │   │
│  │  - Automatic query filtering                                 │   │
│  │  - Audit triggers                                            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│  Layer 4: Encryption                                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  - Encryption at rest (per-tenant keys)                      │   │
│  │  - Encryption in transit (TLS)                               │   │
│  │  - Column-level encryption for sensitive data                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Tenant Context Middleware

```typescript
// tenant-middleware.ts
import { NextRequest, NextResponse } from 'next/server';

interface TenantContext {
  userId: string;
  workspaceId: string;
  projectId?: string;
  permissions: string[];
}

export async function tenantMiddleware(req: NextRequest) {
  // Extract tenant info from auth
  const { userId, orgId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get workspace from Clerk org ID
  const workspace = await db.workspace.findUnique({
    where: { clerk_org_id: orgId }
  });

  if (!workspace && orgId) {
    return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
  }

  // Load permissions
  const permissions = await getUserPermissions(userId, workspace?.id);

  // Build tenant context (pass explicitly; avoid globals in serverless/edge)
  const context: TenantContext = {
    userId,
    workspaceId: workspace?.id,
    permissions
  };

  // Add to request headers for downstream services
  const headers = new Headers(req.headers);
  headers.set('x-tenant-id', context.workspaceId || '');
  headers.set('x-user-id', context.userId);

  return NextResponse.next({ headers });
}

// Utility to reconstruct tenant context from request (edge-safe)
export function getTenantContextFromRequest(req: NextRequest): TenantContext {
  const userId = req.headers.get('x-user-id');
  const workspaceId = req.headers.get('x-tenant-id');

  if (!userId || !workspaceId) {
    throw new Error('Tenant context missing');
  }

  return {
    userId,
    workspaceId,
    permissions: [] // Load permissions per-request in handlers/services
  };
}
```

### Query Isolation Patterns

```typescript
// repository-pattern.ts
import { getTenantContextFromRequest } from './tenant-middleware';

class ProjectRepository {
  constructor(private context: TenantContext) {}

  async findAll() {
    // Workspace ID automatically applied
    return db.project.findMany({
      where: { workspace_id: this.context.workspaceId }
    });
  }

  async findById(id: string) {
    const project = await db.project.findFirst({
      where: {
        id,
        workspace_id: this.context.workspaceId // Always include tenant scope
      }
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    return project;
  }

  async create(data: ProjectCreateInput) {
    return db.project.create({
      data: {
        ...data,
        workspace_id: this.context.workspaceId // Force tenant ownership
      }
    });
  }

  async update(id: string, data: ProjectUpdateInput) {
    // First verify ownership
    await this.findById(id);

    return db.project.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    // Verify ownership before delete
    await this.findById(id);

    return db.project.delete({
      where: { id }
    });
  }
}
```

### Audit Logging

```sql
-- Audit log table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id),
    user_id UUID,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partition by month for performance
CREATE TABLE audit_logs_2026_01 PARTITION OF audit_logs
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

-- Index for querying
CREATE INDEX idx_audit_workspace_time
    ON audit_logs(workspace_id, created_at DESC);

-- Trigger function for automatic auditing
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    audit_workspace_id UUID;
BEGIN
    -- Get workspace_id from the row
    IF TG_OP = 'DELETE' THEN
        audit_workspace_id := OLD.workspace_id;
    ELSE
        audit_workspace_id := NEW.workspace_id;
    END IF;

    INSERT INTO audit_logs (
        workspace_id,
        user_id,
        action,
        resource_type,
        resource_id,
        old_values,
        new_values
    ) VALUES (
        audit_workspace_id,
        (SELECT auth.uid()),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) END
    );

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit trigger to tables
CREATE TRIGGER audit_projects
    AFTER INSERT OR UPDATE OR DELETE ON projects
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_modules
    AFTER INSERT OR UPDATE OR DELETE ON modules
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_agents
    AFTER INSERT OR UPDATE OR DELETE ON agents
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
```

### Per-Tenant Backup/Restore

```typescript
// backup-service.ts
export class TenantBackupService {
  async createBackup(workspaceId: string): Promise<string> {
    const timestamp = new Date().toISOString();
    const backupId = `backup-${workspaceId}-${timestamp}`;

    // Export tenant data
    const data = await this.exportTenantData(workspaceId);

    // Upload to S3 with tenant-specific path
    await s3.putObject({
      Bucket: BACKUP_BUCKET,
      Key: `tenants/${workspaceId}/${backupId}.json`,
      Body: JSON.stringify(data),
      ServerSideEncryption: 'aws:kms',
      SSEKMSKeyId: await getTenantKmsKey(workspaceId)
    });

    // Record backup metadata
    await db.backups.create({
      data: {
        id: backupId,
        workspace_id: workspaceId,
        size_bytes: JSON.stringify(data).length,
        status: 'completed'
      }
    });

    return backupId;
  }

  async exportTenantData(workspaceId: string) {
    return {
      workspace: await db.workspace.findUnique({
        where: { id: workspaceId }
      }),
      projects: await db.project.findMany({
        where: { workspace_id: workspaceId },
        include: {
          modules: {
            include: { agents: true }
          }
        }
      }),
      members: await db.workspace_member_roles.findMany({
        where: { workspace_id: workspaceId }
      }),
      // ... other tenant data
      exportedAt: new Date().toISOString()
    };
  }

  async restoreBackup(workspaceId: string, backupId: string) {
    // Download backup
    const response = await s3.getObject({
      Bucket: BACKUP_BUCKET,
      Key: `tenants/${workspaceId}/${backupId}.json`
    });

    const data = JSON.parse(await response.Body.transformToString());

    // Restore in transaction
    await db.$transaction(async (tx) => {
      // Clear existing data
      await tx.agent.deleteMany({
        where: { module: { project: { workspace_id: workspaceId } } }
      });
      await tx.module.deleteMany({
        where: { project: { workspace_id: workspaceId } }
      });
      await tx.project.deleteMany({
        where: { workspace_id: workspaceId }
      });

      // Restore data
      for (const project of data.projects) {
        await tx.project.create({
          data: {
            ...project,
            modules: {
              create: project.modules.map(m => ({
                ...m,
                agents: { create: m.agents }
              }))
            }
          }
        });
      }
    });
  }
}
```

---

## Resource Isolation

### Compute Isolation Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    COMPUTE ISOLATION                                 │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    KUBERNETES CLUSTER                        │   │
│  │                                                               │   │
│  │  ┌─────────────────┐  ┌─────────────────┐                   │   │
│  │  │  Namespace:     │  │  Namespace:     │                   │   │
│  │  │  tenant-acme    │  │  tenant-globex  │                   │   │
│  │  │                 │  │                 │                   │   │
│  │  │  ┌───────────┐  │  │  ┌───────────┐  │                   │   │
│  │  │  │ Agent Pod │  │  │  │ Agent Pod │  │                   │   │
│  │  │  │ CPU: 0.5  │  │  │  │ CPU: 1.0  │  │  (Premium tier)  │   │
│  │  │  │ Mem: 512Mi│  │  │  │ Mem: 2Gi  │  │                   │   │
│  │  │  └───────────┘  │  │  └───────────┘  │                   │   │
│  │  │                 │  │                 │                   │   │
│  │  │  ResourceQuota: │  │  ResourceQuota: │                   │   │
│  │  │  cpu: 2        │  │  cpu: 8         │                   │   │
│  │  │  memory: 4Gi   │  │  memory: 16Gi   │                   │   │
│  │  └─────────────────┘  └─────────────────┘                   │   │
│  │                                                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Kubernetes Resource Quotas

```yaml
# tenant-namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: tenant-${TENANT_ID}
  labels:
    tenant: ${TENANT_ID}
    tier: ${TIER}

---
apiVersion: v1
kind: ResourceQuota
metadata:
  name: tenant-quota
  namespace: tenant-${TENANT_ID}
spec:
  hard:
    requests.cpu: "${CPU_LIMIT}"
    requests.memory: "${MEMORY_LIMIT}"
    limits.cpu: "${CPU_LIMIT}"
    limits.memory: "${MEMORY_LIMIT}"
    persistentvolumeclaims: "5"
    pods: "10"

---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: tenant-isolation
  namespace: tenant-${TENANT_ID}
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: api-gateway
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              name: shared-services
    - to:
        - ipBlock:
            cidr: 0.0.0.0/0  # Allow external API calls
```

### RAG Knowledge Base Storage Isolation

```
┌─────────────────────────────────────────────────────────────────────┐
│                    STORAGE ISOLATION                                 │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    OBJECT STORAGE (S3)                       │   │
│  │                                                               │   │
│  │  Bucket: hyyve-knowledge-bases                         │   │
│  │  ├── tenants/                                                │   │
│  │  │   ├── workspace-uuid-1/                                   │   │
│  │  │   │   ├── project-a/                                      │   │
│  │  │   │   │   ├── documents/                                  │   │
│  │  │   │   │   │   ├── doc-1.pdf                               │   │
│  │  │   │   │   │   └── doc-2.txt                               │   │
│  │  │   │   │   └── chunks/                                     │   │
│  │  │   │   │       └── embeddings.parquet                      │   │
│  │  │   │   └── project-b/                                      │   │
│  │  │   └── workspace-uuid-2/                                   │   │
│  │  │       └── ...                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    VECTOR DATABASE (pgvector)                │   │
│  │                                                               │   │
│  │  embeddings table                                            │   │
│  │  ├── id: uuid                                                │   │
│  │  ├── workspace_id: uuid (RLS filtered)                       │   │
│  │  ├── project_id: uuid                                        │   │
│  │  ├── document_id: uuid                                       │   │
│  │  ├── chunk_text: text                                        │   │
│  │  ├── embedding: vector(1536)                                 │   │
│  │  └── metadata: jsonb                                         │   │
│  │                                                               │   │
│  │  RLS: workspace_id = current_workspace()                     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### API Rate Limiting

```typescript
// rate-limiter.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

// Tier-based rate limits
const rateLimits: Record<string, { requests: number; window: string }> = {
  free: { requests: 100, window: '1h' },
  pro: { requests: 1000, window: '1h' },
  team: { requests: 5000, window: '1h' },
  enterprise: { requests: 50000, window: '1h' }
};

export function createTenantRateLimiter(tenantId: string, tier: string) {
  const config = rateLimits[tier] || rateLimits.free;

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.requests, config.window),
    prefix: `ratelimit:${tenantId}`
  });
}

// Middleware
export async function rateLimitMiddleware(req: NextRequest) {
  const { workspaceId, tier } = getTenantContext();
  const limiter = createTenantRateLimiter(workspaceId, tier);

  const { success, limit, remaining, reset } = await limiter.limit(workspaceId);

  if (!success) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        retryAfter: reset
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': reset.toString()
        }
      }
    );
  }

  // Add rate limit headers
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', limit.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', reset.toString());

  return response;
}
```

### Cost Attribution

```sql
-- Usage tracking table
CREATE TABLE usage_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id),
    project_id UUID REFERENCES projects(id),
    metric_type TEXT NOT NULL, -- 'api_call', 'agent_execution', 'storage', 'embedding'
    quantity DECIMAL NOT NULL,
    unit TEXT NOT NULL, -- 'count', 'seconds', 'bytes', 'tokens'
    cost_cents INTEGER,
    metadata JSONB,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partition by month
CREATE TABLE usage_metrics_2026_01 PARTITION OF usage_metrics
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

-- Index for billing queries
CREATE INDEX idx_usage_workspace_time
    ON usage_metrics(workspace_id, recorded_at);

-- Function to record usage
CREATE OR REPLACE FUNCTION record_usage(
    p_workspace_id UUID,
    p_project_id UUID,
    p_metric_type TEXT,
    p_quantity DECIMAL,
    p_unit TEXT,
    p_metadata JSONB DEFAULT '{}'::JSONB
) RETURNS UUID AS $$
DECLARE
    v_cost_cents INTEGER;
    v_usage_id UUID;
BEGIN
    -- Calculate cost based on metric type and tier
    v_cost_cents := calculate_cost(p_workspace_id, p_metric_type, p_quantity, p_unit);

    INSERT INTO usage_metrics (
        workspace_id, project_id, metric_type,
        quantity, unit, cost_cents, metadata
    ) VALUES (
        p_workspace_id, p_project_id, p_metric_type,
        p_quantity, p_unit, v_cost_cents, p_metadata
    ) RETURNING id INTO v_usage_id;

    RETURN v_usage_id;
END;
$$ LANGUAGE plpgsql;

-- Billing summary view
CREATE VIEW workspace_billing_summary AS
SELECT
    workspace_id,
    DATE_TRUNC('month', recorded_at) as billing_month,
    metric_type,
    SUM(quantity) as total_quantity,
    unit,
    SUM(cost_cents) as total_cost_cents
FROM usage_metrics
GROUP BY workspace_id, DATE_TRUNC('month', recorded_at), metric_type, unit;
```

```typescript
// usage-tracking.ts
export class UsageTracker {
  async trackApiCall(workspaceId: string, projectId: string, endpoint: string) {
    await db.query(
      `SELECT record_usage($1, $2, 'api_call', 1, 'count', $3)`,
      [workspaceId, projectId, JSON.stringify({ endpoint })]
    );
  }

  async trackAgentExecution(
    workspaceId: string,
    projectId: string,
    agentId: string,
    durationMs: number,
    tokensUsed: number
  ) {
    await db.query(
      `SELECT record_usage($1, $2, 'agent_execution', $3, 'seconds', $4)`,
      [
        workspaceId,
        projectId,
        durationMs / 1000,
        JSON.stringify({ agentId, tokensUsed })
      ]
    );

    // Also track token usage separately
    await db.query(
      `SELECT record_usage($1, $2, 'llm_tokens', $3, 'tokens', $4)`,
      [workspaceId, projectId, tokensUsed, JSON.stringify({ agentId })]
    );
  }

  async trackStorageUsage(workspaceId: string, projectId: string, bytes: number) {
    await db.query(
      `SELECT record_usage($1, $2, 'storage', $3, 'bytes', $4)`,
      [workspaceId, projectId, bytes, '{}']
    );
  }

  async getMonthlyBill(workspaceId: string, month: Date) {
    return db.query(`
      SELECT * FROM workspace_billing_summary
      WHERE workspace_id = $1
      AND billing_month = DATE_TRUNC('month', $2::DATE)
    `, [workspaceId, month]);
  }
}
```

---

## Tenant Provisioning

### Automated Workspace Creation Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TENANT PROVISIONING FLOW                          │
│                                                                      │
│  User Signs Up                                                       │
│       │                                                              │
│       ▼                                                              │
│  ┌─────────────┐                                                    │
│  │ Clerk Auth  │ ──► Create user account                            │
│  └─────────────┘                                                    │
│       │                                                              │
│       ▼                                                              │
│  ┌─────────────┐                                                    │
│  │ Create Org  │ ──► Clerk Organization                             │
│  └─────────────┘                                                    │
│       │                                                              │
│       ▼                                                              │
│  ┌─────────────┐     ┌──────────────────────────┐                  │
│  │  Webhook   │ ──► │ Provisioning Service     │                  │
│  └─────────────┘     │                          │                  │
│                      │ 1. Create workspace row  │                  │
│                      │ 2. Set up default roles  │                  │
│                      │ 3. Create S3 folder      │                  │
│                      │ 4. Initialize k8s NS     │                  │
│                      │ 5. Create Stripe customer│                  │
│                      │ 6. Send welcome email    │                  │
│                      └──────────────────────────┘                  │
│                              │                                       │
│                              ▼                                       │
│                      ┌──────────────────────────┐                  │
│                      │   Workspace Ready!       │                  │
│                      └──────────────────────────┘                  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Webhook Handler Implementation

```typescript
// webhooks/clerk.ts
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;

  const headers = {
    'svix-id': req.headers.get('svix-id')!,
    'svix-timestamp': req.headers.get('svix-timestamp')!,
    'svix-signature': req.headers.get('svix-signature')!,
  };

  const body = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);
  let event: WebhookEvent;

  try {
    event = wh.verify(body, headers) as WebhookEvent;
  } catch (err) {
    return new Response('Invalid signature', { status: 400 });
  }

  switch (event.type) {
    case 'organization.created':
      await provisionWorkspace(event.data);
      break;
    case 'organization.deleted':
      await deprovisionWorkspace(event.data.id);
      break;
    case 'organizationMembership.created':
      await addWorkspaceMember(event.data);
      break;
    case 'organizationMembership.deleted':
      await removeWorkspaceMember(event.data);
      break;
  }

  return new Response('OK', { status: 200 });
}

async function provisionWorkspace(orgData: any) {
  const workspaceId = crypto.randomUUID();

  // 1. Create workspace in database
  await db.workspace.create({
    data: {
      id: workspaceId,
      clerk_org_id: orgData.id,
      name: orgData.name,
      slug: orgData.slug,
      settings: {
        tier: 'free',
        features: defaultFeatures
      }
    }
  });

  // 2. Add owner membership
  await db.workspace_member_roles.create({
    data: {
      workspace_id: workspaceId,
      user_id: orgData.created_by,
      role_id: await getRoleId('owner')
    }
  });

  // 3. Create S3 folder structure
  await createS3FolderStructure(workspaceId);

  // 4. Create Kubernetes namespace (if needed)
  if (await shouldHaveOwnNamespace(workspaceId)) {
    await createTenantNamespace(workspaceId);
  }

  // 5. Create Stripe customer
  const customer = await stripe.customers.create({
    name: orgData.name,
    metadata: {
      workspace_id: workspaceId,
      clerk_org_id: orgData.id
    }
  });

  await db.workspace.update({
    where: { id: workspaceId },
    data: { stripe_customer_id: customer.id }
  });

  // 6. Send welcome email
  await sendWelcomeEmail(orgData.created_by, workspaceId);

  // 7. Emit provisioning complete event
  await emitEvent('workspace.provisioned', {
    workspaceId,
    clerkOrgId: orgData.id
  });
}

async function createS3FolderStructure(workspaceId: string) {
  const folders = [
    `tenants/${workspaceId}/`,
    `tenants/${workspaceId}/documents/`,
    `tenants/${workspaceId}/exports/`,
    `tenants/${workspaceId}/backups/`
  ];

  for (const folder of folders) {
    await s3.putObject({
      Bucket: STORAGE_BUCKET,
      Key: folder,
      Body: ''
    });
  }
}
```

### Database Seeding

```typescript
// seed-service.ts
export async function seedNewWorkspace(workspaceId: string, tier: string) {
  // Create default project
  const defaultProject = await db.project.create({
    data: {
      workspace_id: workspaceId,
      name: 'My First Project',
      description: 'Getting started with Hyyve',
      rag_config: getDefaultRagConfig()
    }
  });

  // Create sample module based on tier
  if (tier !== 'free') {
    await db.module.create({
      data: {
        project_id: defaultProject.id,
        name: 'Customer Support',
        type: 'workflow',
        config: getSampleWorkflowConfig()
      }
    });
  }

  // Create sample knowledge base document
  await db.knowledge_document.create({
    data: {
      project_id: defaultProject.id,
      name: 'Getting Started Guide',
      type: 'markdown',
      content: getGettingStartedContent(),
      status: 'processed'
    }
  });
}

function getDefaultRagConfig() {
  return {
    embeddingModel: 'text-embedding-3-small',
    chunkSize: 512,
    chunkOverlap: 50,
    topK: 5,
    similarityThreshold: 0.7
  };
}
```

### Neon Database Provisioning (Enterprise Tier)

```typescript
// neon-provisioning.ts
export async function provisionDedicatedDatabase(workspaceId: string) {
  const neonClient = createApiClient({ apiKey: NEON_API_KEY });

  // Create dedicated Neon project
  const { data: project } = await neonClient.createProject({
    project: {
      name: `workspace-${workspaceId}`,
      region_id: 'aws-us-east-1'
    }
  });

  // Optional: configure endpoint autoscaling/suspend settings after creation

  // Run migrations
  const connectionUri = project.connection_uris[0].connection_uri;
  await runMigrations(connectionUri);

  // Store connection info (encrypted)
  await db.workspace.update({
    where: { id: workspaceId },
    data: {
      neon_project_id: project.id,
      database_connection_encrypted: await encrypt(connectionUri)
    }
  });

  return project;
}
```

---

## Hierarchical Structure Implementation

### Complete Database Schema

```sql
-- =====================================================
-- HYYVE MULTI-TENANT SCHEMA
-- Hierarchy: Workspace -> Project -> Module -> Agent
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- =====================================================
-- CORE ENTITIES
-- =====================================================

-- Workspaces (top-level tenant)
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_org_id TEXT UNIQUE, -- Clerk organization ID
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    logo_url TEXT,
    settings JSONB DEFAULT '{}'::JSONB,
    tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'team', 'enterprise')),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    neon_project_id TEXT, -- For enterprise dedicated DB
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects (within workspace)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    rag_config JSONB DEFAULT '{
        "embeddingModel": "text-embedding-3-small",
        "chunkSize": 512,
        "chunkOverlap": 50,
        "topK": 5,
        "similarityThreshold": 0.7
    }'::JSONB,
    settings JSONB DEFAULT '{}'::JSONB,
    is_public BOOLEAN DEFAULT FALSE, -- For marketplace
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(workspace_id, slug)
);

-- Modules (within project)
CREATE TABLE modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('agent', 'workflow', 'tool', 'integration')),
    version TEXT DEFAULT '1.0.0',
    config JSONB DEFAULT '{}'::JSONB,
    is_published BOOLEAN DEFAULT FALSE, -- For marketplace
    marketplace_listing_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, slug)
);

-- Agents (within module)
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    system_prompt TEXT,
    model_config JSONB DEFAULT '{
        "model": "gpt-4-turbo",
        "temperature": 0.7,
        "maxTokens": 4096
    }'::JSONB,
    tools JSONB DEFAULT '[]'::JSONB,
    knowledge_base_ids UUID[] DEFAULT '{}',
    definition JSONB NOT NULL DEFAULT '{}'::JSONB, -- Full agent definition
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(module_id, slug)
);

-- Workflows (within module)
CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    definition JSONB NOT NULL, -- Workflow graph definition
    trigger_config JSONB DEFAULT '{}'::JSONB,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(module_id, slug)
);

-- =====================================================
-- KNOWLEDGE BASE (RAG)
-- =====================================================

-- Knowledge base collections (per project)
CREATE TABLE knowledge_bases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    embedding_model TEXT DEFAULT 'text-embedding-3-small',
    vector_dimension INTEGER DEFAULT 1536,
    settings JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents in knowledge base
CREATE TABLE knowledge_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    knowledge_base_id UUID NOT NULL REFERENCES knowledge_bases(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    source_type TEXT NOT NULL, -- 'file', 'url', 'text', 'api'
    source_url TEXT,
    storage_path TEXT, -- S3 path
    content_hash TEXT,
    mime_type TEXT,
    size_bytes INTEGER,
    metadata JSONB DEFAULT '{}'::JSONB,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'processed', 'failed')),
    error_message TEXT,
    chunk_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vector embeddings
CREATE TABLE embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    knowledge_base_id UUID NOT NULL REFERENCES knowledge_bases(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES knowledge_documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    chunk_text TEXT NOT NULL,
    embedding vector(1536), -- Adjust dimension based on model
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for vector similarity search
CREATE INDEX idx_embeddings_vector ON embeddings
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

-- =====================================================
-- ACCESS CONTROL
-- =====================================================

-- Workspace members
CREATE TABLE workspace_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    clerk_user_id TEXT,
    email TEXT,
    display_name TEXT,
    avatar_url TEXT,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(workspace_id, user_id)
);

-- Roles (system-defined + custom)
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE, -- NULL = system role
    name TEXT NOT NULL,
    description TEXT,
    permissions TEXT[] NOT NULL DEFAULT '{}',
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default system roles
INSERT INTO roles (name, description, permissions, is_system) VALUES
('owner', 'Full workspace control', ARRAY['*'], true),
('admin', 'Manage workspace and members', ARRAY[
    'workspace:read', 'workspace:update',
    'member:*', 'project:*', 'module:*', 'agent:*', 'workflow:*',
    'knowledge:*', 'billing:read'
], true),
('developer', 'Create and manage projects', ARRAY[
    'workspace:read', 'project:*', 'module:*', 'agent:*', 'workflow:*', 'knowledge:*'
], true),
('operator', 'Execute agents and workflows', ARRAY[
    'workspace:read', 'project:read', 'module:read',
    'agent:read', 'agent:execute',
    'workflow:read', 'workflow:execute',
    'knowledge:read'
], true),
('viewer', 'Read-only access', ARRAY[
    'workspace:read', 'project:read', 'module:read',
    'agent:read', 'workflow:read', 'knowledge:read'
], true);

-- Member role assignments
CREATE TABLE member_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES workspace_members(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE, -- NULL = workspace-wide
    assigned_by UUID,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(member_id, role_id, project_id)
);

-- Client access (external users with limited access)
CREATE TABLE client_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    client_user_id UUID NOT NULL,
    client_email TEXT NOT NULL,
    granted_by UUID NOT NULL,
    permissions JSONB DEFAULT '{"read": true, "execute": false}'::JSONB,
    expires_at TIMESTAMPTZ,
    last_accessed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, client_user_id)
);

-- Invitations
CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role_id UUID NOT NULL REFERENCES roles(id),
    token TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
    invited_by UUID NOT NULL,
    expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- MARKETPLACE
-- =====================================================

-- Marketplace listings
CREATE TABLE marketplace_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    seller_workspace_id UUID NOT NULL REFERENCES workspaces(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    pricing_type TEXT NOT NULL CHECK (pricing_type IN ('free', 'one_time', 'subscription')),
    price_cents INTEGER DEFAULT 0,
    currency TEXT DEFAULT 'usd',
    stripe_price_id TEXT,
    preview_images TEXT[] DEFAULT '{}',
    demo_url TEXT,
    documentation_url TEXT,
    support_email TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'published', 'rejected', 'archived')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Marketplace purchases/installations
CREATE TABLE marketplace_installations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES marketplace_listings(id),
    buyer_workspace_id UUID NOT NULL REFERENCES workspaces(id),
    installed_project_id UUID NOT NULL REFERENCES projects(id),
    stripe_subscription_id TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
    installed_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    UNIQUE(listing_id, installed_project_id)
);

-- =====================================================
-- EXECUTION & HISTORY
-- =====================================================

-- Agent executions
CREATE TABLE agent_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id), -- Denormalized for queries
    triggered_by UUID,
    trigger_type TEXT NOT NULL, -- 'manual', 'api', 'workflow', 'schedule'
    input JSONB NOT NULL,
    output JSONB,
    status TEXT DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
    error_message TEXT,
    tokens_used INTEGER DEFAULT 0,
    duration_ms INTEGER,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Workflow executions
CREATE TABLE workflow_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id),
    triggered_by UUID,
    trigger_type TEXT NOT NULL,
    input JSONB NOT NULL,
    output JSONB,
    current_step TEXT,
    step_history JSONB DEFAULT '[]'::JSONB,
    status TEXT DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled', 'paused')),
    error_message TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Workspace lookups
CREATE INDEX idx_workspaces_clerk_org ON workspaces(clerk_org_id);
CREATE INDEX idx_workspaces_slug ON workspaces(slug);

-- Project lookups
CREATE INDEX idx_projects_workspace ON projects(workspace_id);
CREATE INDEX idx_projects_slug ON projects(workspace_id, slug);

-- Module lookups
CREATE INDEX idx_modules_project ON modules(project_id);
CREATE INDEX idx_modules_marketplace ON modules(is_published) WHERE is_published = TRUE;

-- Agent/Workflow lookups
CREATE INDEX idx_agents_module ON agents(module_id);
CREATE INDEX idx_workflows_module ON workflows(module_id);

-- Knowledge base lookups
CREATE INDEX idx_kb_project ON knowledge_bases(project_id);
CREATE INDEX idx_docs_kb ON knowledge_documents(knowledge_base_id);
CREATE INDEX idx_embeddings_kb ON embeddings(knowledge_base_id);
CREATE INDEX idx_embeddings_doc ON embeddings(document_id);

-- Access control
CREATE INDEX idx_members_workspace ON workspace_members(workspace_id);
CREATE INDEX idx_members_user ON workspace_members(user_id);
CREATE INDEX idx_member_roles_member ON member_roles(member_id);
CREATE INDEX idx_client_access_user ON client_access(client_user_id);

-- Executions (partitioned by time in production)
CREATE INDEX idx_agent_exec_workspace_time ON agent_executions(workspace_id, started_at DESC);
CREATE INDEX idx_workflow_exec_workspace_time ON workflow_executions(workspace_id, started_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_bases ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;

-- Helper function: Get user's workspace IDs
CREATE OR REPLACE FUNCTION get_user_workspace_ids()
RETURNS SETOF UUID AS $$
BEGIN
    RETURN QUERY
    SELECT workspace_id FROM workspace_members
    WHERE user_id = (SELECT auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Workspaces: Users see workspaces they belong to
CREATE POLICY "workspace_access" ON workspaces
    FOR ALL TO authenticated
    USING (id IN (SELECT get_user_workspace_ids()))
    WITH CHECK (id IN (SELECT get_user_workspace_ids()));

-- Projects: Access through workspace membership or client access
CREATE POLICY "project_access" ON projects
    FOR SELECT TO authenticated
    USING (
        workspace_id IN (SELECT get_user_workspace_ids())
        OR id IN (
            SELECT project_id FROM client_access
            WHERE client_user_id = (SELECT auth.uid())
            AND (expires_at IS NULL OR expires_at > NOW())
        )
    );

CREATE POLICY "project_modify" ON projects
    FOR ALL TO authenticated
    USING (workspace_id IN (SELECT get_user_workspace_ids()))
    WITH CHECK (workspace_id IN (SELECT get_user_workspace_ids()));

-- Modules: Access through project
CREATE POLICY "module_access" ON modules
    FOR SELECT TO authenticated
    USING (
        project_id IN (
            SELECT id FROM projects WHERE workspace_id IN (SELECT get_user_workspace_ids())
        )
        OR project_id IN (
            SELECT project_id FROM client_access
            WHERE client_user_id = (SELECT auth.uid())
        )
        OR is_published = TRUE -- Public marketplace modules
    );

CREATE POLICY "module_modify" ON modules
    FOR ALL TO authenticated
    USING (
        project_id IN (
            SELECT id FROM projects WHERE workspace_id IN (SELECT get_user_workspace_ids())
        )
    )
    WITH CHECK (
        project_id IN (
            SELECT id FROM projects WHERE workspace_id IN (SELECT get_user_workspace_ids())
        )
    );

-- Similar policies for agents, workflows, knowledge bases...
-- (Following the same hierarchical pattern)

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER workspaces_updated_at
    BEFORE UPDATE ON workspaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER modules_updated_at
    BEFORE UPDATE ON modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER agents_updated_at
    BEFORE UPDATE ON agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create owner membership when workspace created
CREATE OR REPLACE FUNCTION auto_add_workspace_owner()
RETURNS TRIGGER AS $$
BEGIN
    -- This would be called from application code after getting user ID
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Entity Relationship Diagram (ASCII)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           ENTITY RELATIONSHIPS                                   │
│                                                                                  │
│  ┌─────────────┐         ┌─────────────────┐                                    │
│  │  WORKSPACE  │─────────│ workspace_      │                                    │
│  │             │    1:N  │ members         │                                    │
│  │ - id        │         │ - workspace_id  │                                    │
│  │ - name      │         │ - user_id       │                                    │
│  │ - tier      │         │ - email         │                                    │
│  │ - settings  │         └────────┬────────┘                                    │
│  └──────┬──────┘                  │                                             │
│         │                         │ 1:N                                         │
│         │ 1:N                     ▼                                             │
│         │                  ┌─────────────────┐      ┌─────────────┐             │
│         │                  │ member_roles    │──────│   roles     │             │
│         │                  │ - member_id     │ N:1  │ - id        │             │
│         │                  │ - role_id       │      │ - name      │             │
│         │                  │ - project_id    │      │ - perms[]   │             │
│         │                  └─────────────────┘      └─────────────┘             │
│         │                                                                        │
│         ▼                                                                        │
│  ┌─────────────┐         ┌─────────────────┐                                    │
│  │   PROJECT   │─────────│  knowledge_     │                                    │
│  │             │    1:N  │  bases          │                                    │
│  │ - id        │         │ - project_id    │──────┐                             │
│  │ - workspace │         │ - name          │      │                             │
│  │ - rag_config│         │ - settings      │      │ 1:N                         │
│  │ - settings  │         └─────────────────┘      │                             │
│  └──────┬──────┘                                  ▼                             │
│         │                                  ┌─────────────────┐                  │
│         │ 1:N                              │  knowledge_     │                  │
│         │                                  │  documents      │──────┐           │
│         ▼                                  │ - kb_id         │      │           │
│  ┌─────────────┐                          │ - content       │      │ 1:N       │
│  │   MODULE    │                          │ - status        │      │           │
│  │             │                          └─────────────────┘      │           │
│  │ - id        │                                                   ▼           │
│  │ - project_id│         ┌────────────────────────────────────────────┐        │
│  │ - type      │         │                 embeddings                 │        │
│  │ - config    │         │ - document_id                              │        │
│  │ - published │         │ - chunk_text                               │        │
│  └──────┬──────┘         │ - embedding (vector)                       │        │
│         │                │ - metadata                                 │        │
│         │ 1:N            └────────────────────────────────────────────┘        │
│         │                                                                        │
│    ┌────┴─────┐                                                                 │
│    │          │                                                                 │
│    ▼          ▼                                                                 │
│ ┌────────┐ ┌────────────┐        ┌─────────────────┐                           │
│ │ AGENT  │ │  WORKFLOW  │        │ marketplace_    │                           │
│ │        │ │            │        │ listings        │                           │
│ │ - id   │ │ - id       │ ◄──────│ - module_id     │                           │
│ │ -module│ │ - module_id│        │ - title         │                           │
│ │ -prompt│ │ - definition│       │ - price         │                           │
│ │ -tools │ │ - trigger   │       │ - status        │                           │
│ └────┬───┘ └─────┬──────┘        └────────┬────────┘                           │
│      │           │                        │                                     │
│      │ 1:N       │ 1:N                    │ 1:N                                 │
│      ▼           ▼                        ▼                                     │
│ ┌────────────┐ ┌────────────────┐  ┌─────────────────┐                         │
│ │ agent_     │ │ workflow_      │  │ marketplace_    │                         │
│ │ executions │ │ executions     │  │ installations   │                         │
│ │ - agent_id │ │ - workflow_id  │  │ - listing_id    │                         │
│ │ - input    │ │ - input        │  │ - buyer_ws_id   │                         │
│ │ - output   │ │ - output       │  │ - installed_at  │                         │
│ │ - status   │ │ - status       │  └─────────────────┘                         │
│ └────────────┘ └────────────────┘                                               │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Cascading Permission Logic

```typescript
// permission-service.ts
type Resource = 'workspace' | 'project' | 'module' | 'agent' | 'workflow' | 'knowledge';
type Action = 'read' | 'create' | 'update' | 'delete' | 'execute' | '*';

interface PermissionCheck {
  userId: string;
  workspaceId: string;
  resource: Resource;
  action: Action;
  resourceId?: string;
}

export class PermissionService {
  async checkPermission(check: PermissionCheck): Promise<boolean> {
    // 1. Get all user's permissions in workspace
    const permissions = await this.getUserPermissions(
      check.userId,
      check.workspaceId
    );

    // 2. Check for wildcard
    if (permissions.includes('*')) return true;

    // 3. Check for resource wildcard (e.g., 'project:*')
    if (permissions.includes(`${check.resource}:*`)) return true;

    // 4. Check for specific permission
    if (permissions.includes(`${check.resource}:${check.action}`)) return true;

    // 5. Check for project-level override if resource is below project
    if (check.resourceId && ['module', 'agent', 'workflow', 'knowledge'].includes(check.resource)) {
      const projectId = await this.getProjectIdForResource(check.resource, check.resourceId);
      if (projectId) {
        const projectPermissions = await this.getProjectPermissions(
          check.userId,
          projectId
        );
        if (this.matchPermission(projectPermissions, check.resource, check.action)) {
          return true;
        }
      }
    }

    return false;
  }

  private async getUserPermissions(userId: string, workspaceId: string): Promise<string[]> {
    const result = await db.query(`
      SELECT DISTINCT unnest(r.permissions) as permission
      FROM member_roles mr
      JOIN roles r ON mr.role_id = r.id
      JOIN workspace_members wm ON mr.member_id = wm.id
      WHERE wm.user_id = $1
      AND mr.workspace_id = $2
      AND mr.project_id IS NULL
    `, [userId, workspaceId]);

    return result.rows.map(r => r.permission);
  }

  private async getProjectPermissions(userId: string, projectId: string): Promise<string[]> {
    const result = await db.query(`
      SELECT DISTINCT unnest(r.permissions) as permission
      FROM member_roles mr
      JOIN roles r ON mr.role_id = r.id
      JOIN workspace_members wm ON mr.member_id = wm.id
      WHERE wm.user_id = $1
      AND mr.project_id = $2
    `, [userId, projectId]);

    return result.rows.map(r => r.permission);
  }

  private matchPermission(permissions: string[], resource: string, action: string): boolean {
    return permissions.includes('*') ||
           permissions.includes(`${resource}:*`) ||
           permissions.includes(`${resource}:${action}`);
  }

  private async getProjectIdForResource(resource: string, resourceId: string): Promise<string | null> {
    const tableMap: Record<string, string> = {
      module: 'modules',
      agent: 'agents',
      workflow: 'workflows',
      knowledge: 'knowledge_bases'
    };

    if (resource === 'agent' || resource === 'workflow') {
      const result = await db.query(`
        SELECT p.id as project_id
        FROM ${tableMap[resource]} r
        JOIN modules m ON r.module_id = m.id
        JOIN projects p ON m.project_id = p.id
        WHERE r.id = $1
      `, [resourceId]);
      return result.rows[0]?.project_id;
    }

    const result = await db.query(`
      SELECT project_id FROM ${tableMap[resource]} WHERE id = $1
    `, [resourceId]);
    return result.rows[0]?.project_id;
  }
}
```

---

## Marketplace & Module Licensing

### Cross-Workspace Module Sharing

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           MARKETPLACE ARCHITECTURE                               │
│                                                                                  │
│  SELLER WORKSPACE                          BUYER WORKSPACE                       │
│  ┌─────────────────────────┐              ┌─────────────────────────┐           │
│  │ Project: AI Tools       │              │ Project: Support Bot    │           │
│  │                         │              │                         │           │
│  │  Module: Smart FAQ      │              │  Module: Smart FAQ      │◄──────┐  │
│  │  (Original)             │              │  (Installed Copy)       │       │  │
│  │  ┌───────────────┐      │              │  ┌───────────────┐      │       │  │
│  │  │ Agent: FAQ Bot │     │              │  │ Agent: FAQ Bot │     │       │  │
│  │  └───────────────┘      │              │  └───────────────┘      │       │  │
│  │                         │              │                         │       │  │
│  └───────────┬─────────────┘              └─────────────────────────┘       │  │
│              │                                                               │  │
│              │ publish                                                       │  │
│              ▼                                                               │  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │  │
│  │                         MARKETPLACE                                  │   │  │
│  │                                                                      │   │  │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │  │
│  │  │  Listing: Smart FAQ Module                                   │   │   │  │
│  │  │  - Price: $29/month                                          │   │   │  │
│  │  │  - Category: Customer Support                                │───┼───┘  │
│  │  │  - Installs: 150                                             │   │      │
│  │  │  - Rating: 4.8/5                                             │   │      │
│  │  └─────────────────────────────────────────────────────────────┘   │      │
│  │                                                                      │      │
│  └─────────────────────────────────────────────────────────────────────┘      │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Module Installation Service

```typescript
// marketplace-service.ts
export class MarketplaceService {
  async installModule(
    listingId: string,
    buyerWorkspaceId: string,
    targetProjectId: string
  ) {
    // 1. Verify listing is published
    const listing = await db.marketplace_listings.findUnique({
      where: { id: listingId, status: 'published' },
      include: { module: { include: { agents: true, workflows: true } } }
    });

    if (!listing) {
      throw new Error('Listing not found or not available');
    }

    // 2. Check if already installed
    const existing = await db.marketplace_installations.findFirst({
      where: {
        listing_id: listingId,
        buyer_workspace_id: buyerWorkspaceId,
        status: 'active'
      }
    });

    if (existing) {
      throw new Error('Module already installed');
    }

    // 3. Handle payment if not free
    let stripeSubscriptionId: string | undefined;
    if (listing.pricing_type !== 'free') {
      stripeSubscriptionId = await this.createSubscription(
        buyerWorkspaceId,
        listing
      );
    }

    // 4. Clone module to buyer's project
    const installedModule = await this.cloneModule(
      listing.module,
      targetProjectId,
      listingId
    );

    // 5. Create installation record
    const installation = await db.marketplace_installations.create({
      data: {
        listing_id: listingId,
        buyer_workspace_id: buyerWorkspaceId,
        installed_project_id: targetProjectId,
        stripe_subscription_id: stripeSubscriptionId,
        status: 'active'
      }
    });

    // 6. Send notification to seller
    await this.notifySeller(listing.seller_workspace_id, installation);

    return installation;
  }

  private async cloneModule(
    sourceModule: any,
    targetProjectId: string,
    listingId: string
  ) {
    // Create a copy of the module in buyer's project
    const clonedModule = await db.module.create({
      data: {
        project_id: targetProjectId,
        name: sourceModule.name,
        slug: `${sourceModule.slug}-${Date.now()}`,
        description: sourceModule.description,
        type: sourceModule.type,
        config: sourceModule.config,
        marketplace_listing_id: listingId,
        is_published: false
      }
    });

    // Clone agents
    for (const agent of sourceModule.agents) {
      await db.agent.create({
        data: {
          module_id: clonedModule.id,
          name: agent.name,
          slug: agent.slug,
          description: agent.description,
          system_prompt: agent.system_prompt,
          model_config: agent.model_config,
          tools: agent.tools,
          definition: agent.definition,
          status: 'active'
        }
      });
    }

    // Clone workflows
    for (const workflow of sourceModule.workflows) {
      await db.workflow.create({
        data: {
          module_id: clonedModule.id,
          name: workflow.name,
          slug: workflow.slug,
          description: workflow.description,
          definition: workflow.definition,
          trigger_config: workflow.trigger_config,
          status: 'active'
        }
      });
    }

    return clonedModule;
  }

  private async createSubscription(workspaceId: string, listing: any) {
    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId }
    });

    const subscription = await stripe.subscriptions.create({
      customer: workspace.stripe_customer_id,
      items: [{ price: listing.stripe_price_id }],
      metadata: {
        listing_id: listing.id,
        workspace_id: workspaceId
      }
    });

    return subscription.id;
  }
}
```

### License Verification

```typescript
// license-middleware.ts
export async function verifyModuleLicense(
  moduleId: string,
  workspaceId: string
): Promise<boolean> {
  const module = await db.module.findUnique({
    where: { id: moduleId }
  });

  // No license needed if owned by workspace
  const project = await db.project.findUnique({
    where: { id: module.project_id }
  });

  if (project.workspace_id === workspaceId) {
    return true;
  }

  // Check for active marketplace installation
  if (module.marketplace_listing_id) {
    const installation = await db.marketplace_installations.findFirst({
      where: {
        listing_id: module.marketplace_listing_id,
        buyer_workspace_id: workspaceId,
        installed_project_id: module.project_id,
        status: 'active',
        OR: [
          { expires_at: null },
          { expires_at: { gt: new Date() } }
        ]
      }
    });

    return !!installation;
  }

  return false;
}
```

---

## Recommendations for Hyyve Platform

### Recommended Architecture

Based on the research, here is the recommended architecture for the Hyyve platform:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    RECOMMENDED ARCHITECTURE                                      │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                          AUTH LAYER                                      │   │
│  │  Clerk (primary)  +  WorkOS (enterprise SSO/SCIM)                       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                      │                                          │
│                                      ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                         API GATEWAY                                      │   │
│  │  - Per-tenant rate limiting                                              │   │
│  │  - Request routing based on tenant tier                                  │   │
│  │  - API key validation                                                    │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                      │                                          │
│         ┌────────────────────────────┼────────────────────────────┐            │
│         ▼                            ▼                            ▼            │
│  ┌─────────────┐            ┌─────────────┐            ┌─────────────┐        │
│  │   FREE/PRO  │            │    TEAM     │            │ ENTERPRISE  │        │
│  │   TENANTS   │            │   TENANTS   │            │  TENANTS    │        │
│  │             │            │             │            │             │        │
│  │  Supabase   │            │  Supabase   │            │    Neon     │        │
│  │  Shared DB  │            │  Shared DB  │            │  Dedicated  │        │
│  │  + RLS      │            │  + RLS      │            │  Project    │        │
│  │             │            │  + Schema   │            │             │        │
│  └─────────────┘            └─────────────┘            └─────────────┘        │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                     SHARED SERVICES                                      │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐               │   │
│  │  │ Billing  │  │Marketplace│  │ Storage  │  │Analytics │               │   │
│  │  │ (Stripe) │  │ Catalog  │  │  (S3)    │  │(PostHog) │               │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘               │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                    COMPUTE LAYER (Kubernetes)                            │   │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │   │
│  │  │  Shared Pool (Free/Pro)      │  Premium Pool (Team/Enterprise)   │  │   │
│  │  │  - Resource quotas           │  - Dedicated namespaces           │  │   │
│  │  │  - Shared workers            │  - Higher limits                  │  │   │
│  │  └──────────────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Implementation Phases

| Phase | Focus | Timeline |
|-------|-------|----------|
| **Phase 1** | Shared DB + RLS, Clerk Auth, Basic RBAC | 2-3 weeks |
| **Phase 2** | Tenant provisioning automation, billing integration | 2 weeks |
| **Phase 3** | Resource isolation, rate limiting, usage tracking | 2 weeks |
| **Phase 4** | Marketplace foundation, module licensing | 3 weeks |
| **Phase 5** | Enterprise features (dedicated DB, SSO, SCIM) | 3 weeks |

> Timelines are estimates; adjust based on scope and team capacity.

### Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Primary Database** | Supabase | Built-in RLS and Auth with Postgres |
| **Enterprise Database** | Neon | Database-per-tenant pattern, scale-to-zero, branching |
| **Auth Provider** | Clerk + WorkOS | Organizations + enterprise SSO/Directory Sync |
| **Storage** | S3 with per-tenant paths | Cost-effective, scalable |
| **Compute** | Kubernetes | Namespace isolation, resource quotas |
| **Billing** | Stripe | Industry standard, usage-based support |

### Security Checklist

- [ ] RLS enabled on all tenant-scoped tables
- [ ] Tenant context validated in middleware before business logic
- [ ] API keys scoped to workspace/project
- [ ] Rate limiting per tenant and tier
- [ ] Audit logging for all data access
- [ ] Per-tenant encryption keys for sensitive data
- [ ] Regular security testing for cross-tenant access
- [ ] Backup/restore tested per tenant

---

## Sources

### Official Docs / Primary References
- [Multitenant SaaS Patterns - Azure SQL Database](https://learn.microsoft.com/en-us/azure/azure-sql/database/saas-tenancy-app-design-patterns)
- [Row Level Security | Supabase Docs](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [auth.jwt() and app_metadata fields (Supabase RLS)](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Custom Access Token Auth Hook (Supabase)](https://supabase.com/docs/guides/auth/auth-hooks/custom-access-token-hook)
- [Auth Hooks Overview (Supabase)](https://supabase.com/docs/guides/auth/auth-hooks)
- [Custom Claims & RBAC (Supabase)](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac)
- [Production Checklist (Supabase auto-pause behavior)](https://supabase.com/docs/guides/going-into-prod/production-checklist)
- [SSO API Reference (WorkOS)](https://workos.com/docs/reference/sso)
- [Directory Sync: Understanding Events (WorkOS)](https://workos.com/docs/directory-sync/understanding-events)
- [Events & Webhooks (WorkOS)](https://workos.com/docs/events)
- [Auth Object Reference (Clerk)](https://clerk.com/docs/references/nextjs/auth)
- [Organizations Overview (Clerk)](https://clerk.com/docs/guides/organizations/overview)
- [Scale to Zero (Neon)](https://neon.com/docs/manage/scaling#scale-to-zero)
- [Branching (Neon)](https://neon.com/docs/introduction/branching)
- [Database-per-tenant Guide (Neon)](https://neon.com/docs/use-cases/database-per-tenant)
- [TypeScript SDK (Neon)](https://neon.tech/docs/guides/typescript-sdk)
- [Multi-Tenant Template - Vercel](https://vercel.com/platforms/docs/examples/multi-tenant-template)
- [Build a multi-tenant app with Next.js and Vercel](https://vercel.com/guides/nextjs-multi-tenant-application)
- [Platforms Starter Kit - GitHub](https://github.com/vercel/platforms)
- [PostgreSQL Foreign Key Documentation](https://www.postgresql.org/docs/current/ddl-constraints.html)

### Community / Blog Sources (Non-Authoritative)
- [The developer's guide to SaaS multi-tenant architecture - WorkOS](https://workos.com/blog/developers-guide-saas-multi-tenant-architecture)
- [How to Design a Multi-Tenant SaaS Architecture - Clerk](https://clerk.com/blog/how-to-design-multitenant-saas-architecture)
- [Multi-Tenant Database Architecture Patterns Explained - Bytebase](https://www.bytebase.com/blog/multi-tenant-database-architecture-patterns-explained/)
- [Multi-Tenant Architecture - SaaS App Design Best Practices](https://relevant.software/blog/multi-tenant-architecture/)
- [10 Real-World RLS Patterns for Supabase](https://supaexplorer.com/dev-notes/10-real-world-rls-patterns-for-supabase-with-policy-snippets.html)
- [Supabase Multi-Tenancy CRM Integration Guide](https://www.stacksync.com/blog/supabase-multi-tenancy-crm-integration)
- [Fairness in multi-tenant systems - AWS](https://aws.amazon.com/builders-library/fairness-in-multi-tenant-systems/)
- [Throttling a tiered, multi-tenant REST API at scale using API Gateway](https://aws.amazon.com/blogs/architecture/throttling-a-tiered-multi-tenant-rest-api-at-scale-using-api-gateway-part-1/)
- [Authorization 101: Multi-tenant RBAC - Aserto](https://www.aserto.com/blog/authorization-101-multi-tenant-rbac)
- [How to design an RBAC model for multi-tenant SaaS - WorkOS](https://workos.com/blog/how-to-design-multi-tenant-rbac-saas)
- [Best Practices for Multi-Tenant Authorization - Permit.io](https://www.permit.io/blog/best-practices-for-multi-tenant-authorization)
- [Hierarchical Structures in PostgreSQL](https://hoverbear.org/blog/postgresql-hierarchical-structures/)
- [Understanding Foreign Keys in PostgreSQL](https://www.tigerdata.com/learn/understanding-foreign-keys-in-postgresql)

---

*Document generated: January 20, 2026*
*Research conducted for Hyyve Platform multi-tenant SaaS architecture*
