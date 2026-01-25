# Technical UI Gaps Research - Hyyve Platform
**Version:** 1.0
**Date:** 2026-01-23
**Tier:** 8 (Cross-Cutting UI Concerns)
**Status:** Complete

## Executive Summary

This research addresses critical UI generation gaps identified during architecture synthesis. The platform requires sophisticated multi-tenant UI capabilities to support B2B SaaS delivery, embedded client portals, per-project feature exposure, and white-label configurations. Research was validated using Context7 MCP and DeepWiki MCP for production-grade pattern verification.

---

## Table of Contents

1. [Client Access Management](#1-client-access-management)
2. [Multi-Tenant Data Isolation for UI](#2-multi-tenant-data-isolation-for-ui)
3. [Per-Project Feature Exposure](#3-per-project-feature-exposure)
4. [Embedded UI Patterns](#4-embedded-ui-patterns)
5. [API Key Management for Clients](#5-api-key-management-for-clients)
6. [White-Label Configuration](#6-white-label-configuration)
7. [Architecture Patterns](#7-architecture-patterns)
8. [Implementation Recommendations](#8-implementation-recommendations)

---

## 1. Client Access Management

### 1.1 Research Question
How do we implement per-project authorization where agency clients can only access their assigned projects with role-appropriate permissions?

### 1.2 Validated Solution: Clerk Organizations

**Source:** DeepWiki (clerk/javascript), Context7 (/vercel/next.js)

Clerk Organizations provide B2B multi-tenant RBAC with the following capabilities:

#### Core Architecture
```typescript
// Organization Membership Structure
interface OrganizationMembership {
  id: string;
  orgId: string;
  userId: string;
  role: OrganizationCustomRoleKey;
  permissions: OrganizationCustomPermissionKey[];
  publicMetadata: Record<string, unknown>;
  publicUserData: {
    userId: string;
    identifier: string;
    firstName: string | null;
    lastName: string | null;
  };
}

// Custom Role Definition
type OrganizationCustomRoleKey =
  | 'org:admin'           // Full organization access
  | 'org:member'          // Standard member
  | 'org:project_owner'   // Project-level admin (custom)
  | 'org:viewer'          // Read-only access (custom)
  | 'org:developer';      // Build access, no billing (custom)

// Custom Permission Keys
type OrganizationCustomPermissionKey =
  | 'org:projects:read'
  | 'org:projects:write'
  | 'org:projects:delete'
  | 'org:modules:deploy'
  | 'org:chatbots:manage'
  | 'org:voice_agents:manage'
  | 'org:canvas:edit'
  | 'org:billing:view'
  | 'org:billing:manage';
```

#### Authorization Patterns

**Server-Side Protection (Next.js Middleware):**
```typescript
// middleware.ts
import { clerkMiddleware, auth } from '@clerk/nextjs/server';

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId, has } = await auth();

  // Protect project routes
  if (req.nextUrl.pathname.startsWith('/projects/')) {
    const projectId = req.nextUrl.pathname.split('/')[2];

    // Verify organization membership
    if (!orgId) {
      return Response.redirect(new URL('/select-org', req.url));
    }

    // Verify project access
    const hasProjectAccess = await verifyProjectAccess(orgId, projectId);
    if (!hasProjectAccess) {
      return Response.redirect(new URL('/unauthorized', req.url));
    }
  }

  // Role-based route protection
  if (req.nextUrl.pathname.startsWith('/admin')) {
    auth.protect({ role: 'org:admin' });
  }

  if (req.nextUrl.pathname.startsWith('/billing')) {
    auth.protect({ permission: 'org:billing:view' });
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

**Client-Side Protection (React Components):**
```tsx
import { Protect, useAuth, useOrganization } from '@clerk/nextjs';

function ProjectDashboard({ projectId }: { projectId: string }) {
  const { has } = useAuth();
  const { organization } = useOrganization();

  const canEditModules = has({ permission: 'org:modules:deploy' });
  const canManageBilling = has({ permission: 'org:billing:manage' });

  return (
    <div>
      {/* Visible to all org members */}
      <ProjectOverview projectId={projectId} />

      {/* Conditional based on permission */}
      <Protect permission="org:modules:deploy">
        <ModuleBuilder projectId={projectId} />
      </Protect>

      <Protect permission="org:chatbots:manage">
        <ChatbotBuilder projectId={projectId} />
      </Protect>

      {/* Role-based protection */}
      <Protect role="org:admin">
        <TeamManagement organizationId={organization?.id} />
      </Protect>

      {/* Complex condition */}
      <Protect
        condition={(has) =>
          has({ permission: 'org:billing:view' }) ||
          has({ role: 'org:admin' })
        }
      >
        <BillingDashboard />
      </Protect>
    </div>
  );
}
```

### 1.3 Enterprise SSO Integration (WorkOS)

For enterprise clients requiring SAML/OIDC SSO:

```typescript
// WorkOS Organization SSO Setup
import WorkOS from '@workos-inc/node';

const workos = new WorkOS(process.env.WORKOS_API_KEY);

// Create SSO connection for enterprise org
async function setupEnterpriseSSO(organizationId: string, domain: string) {
  const connection = await workos.sso.createConnection({
    organization_id: organizationId,
    connection_type: 'SAML',
    name: `${domain} SAML`,
    domains: [domain],
  });

  // Store connection metadata
  await db.organizations.update({
    where: { id: organizationId },
    data: { ssoConnectionId: connection.id },
  });

  return connection;
}

// Directory Sync (SCIM) for automatic user provisioning
async function setupDirectorySync(organizationId: string) {
  const directory = await workos.directorySync.createDirectory({
    organization_id: organizationId,
    name: 'Employee Directory',
    type: 'azure_scim_v2_0',
  });

  // Map directory groups to platform roles
  await mapDirectoryGroupsToRoles(directory.id, {
    'Platform Admins': 'org:admin',
    'Developers': 'org:developer',
    'Viewers': 'org:viewer',
  });

  return directory;
}
```

### 1.4 Decision Matrix

| Requirement | Clerk | WorkOS | Auth0 | Recommendation |
|-------------|-------|--------|-------|----------------|
| B2B Organizations | ✅ Native | ✅ Native | ⚠️ Add-on | Clerk |
| Custom Roles/Permissions | ✅ | ✅ | ✅ | Any |
| Enterprise SSO (SAML) | ⚠️ Enterprise | ✅ | ✅ | WorkOS for enterprise |
| Directory Sync (SCIM) | ⚠️ Enterprise | ✅ | ✅ | WorkOS |
| React Components | ✅ Excellent | ❌ API only | ⚠️ Basic | Clerk |
| Pricing (up to 10k MAU) | Free | $125/mo | $240/mo | Clerk |

**Recommendation:** Clerk for primary auth with WorkOS SSO bridge for enterprise SAML/SCIM requirements.

---

## 2. Multi-Tenant Data Isolation for UI

### 2.1 Research Question
How do we ensure UI components only render data belonging to the current tenant/project with cryptographic isolation guarantees?

### 2.2 Validated Solution: Supabase RLS with JWT Claims

**Source:** DeepWiki (supabase/supabase)

#### Row Level Security Architecture

```sql
-- Enable RLS on all tenant-scoped tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbots ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE canvas_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_bases ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Base tenant isolation policy pattern
CREATE POLICY "tenant_isolation" ON projects
FOR ALL TO authenticated
USING (
  organization_id = (auth.jwt() ->> 'org_id')::uuid
);

-- Project-scoped isolation for child resources
CREATE POLICY "project_tenant_isolation" ON modules
FOR ALL TO authenticated
USING (
  project_id IN (
    SELECT id FROM projects
    WHERE organization_id = (auth.jwt() ->> 'org_id')::uuid
  )
);

-- Permission-aware policies
CREATE POLICY "module_read_policy" ON modules
FOR SELECT TO authenticated
USING (
  project_id IN (
    SELECT id FROM projects
    WHERE organization_id = (auth.jwt() ->> 'org_id')::uuid
  )
  AND (
    (auth.jwt() -> 'permissions') ? 'org:modules:read'
    OR (auth.jwt() ->> 'org_role') = 'org:admin'
  )
);

CREATE POLICY "module_write_policy" ON modules
FOR INSERT TO authenticated
WITH CHECK (
  project_id IN (
    SELECT id FROM projects
    WHERE organization_id = (auth.jwt() ->> 'org_id')::uuid
  )
  AND (
    (auth.jwt() -> 'permissions') ? 'org:modules:deploy'
    OR (auth.jwt() ->> 'org_role') = 'org:admin'
  )
);

-- Index for RLS performance
CREATE INDEX idx_projects_org_id ON projects(organization_id);
CREATE INDEX idx_modules_project_id ON modules(project_id);
CREATE INDEX idx_chatbots_project_id ON chatbots(project_id);
CREATE INDEX idx_voice_agents_project_id ON voice_agents(project_id);
```

#### JWT Claim Injection (Clerk + Supabase Bridge)

```typescript
// lib/supabase-client.ts
import { createClient } from '@supabase/supabase-js';
import { useAuth, useOrganization } from '@clerk/nextjs';

export function useSupabaseClient() {
  const { getToken } = useAuth();
  const { organization } = useOrganization();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: async () => {
          const token = await getToken({ template: 'supabase' });
          return {
            Authorization: `Bearer ${token}`,
          };
        },
      },
    }
  );

  return supabase;
}

// Clerk JWT template for Supabase (configured in Clerk Dashboard)
// Claims automatically injected:
// {
//   "sub": "user_xxx",
//   "org_id": "org_xxx",
//   "org_role": "org:admin",
//   "permissions": ["org:modules:deploy", "org:chatbots:manage"]
// }
```

#### React Query Integration with RLS

```typescript
// hooks/useProjects.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSupabaseClient } from '@/lib/supabase-client';
import { useOrganization } from '@clerk/nextjs';

export function useProjects() {
  const supabase = useSupabaseClient();
  const { organization } = useOrganization();

  return useQuery({
    queryKey: ['projects', organization?.id],
    queryFn: async () => {
      // RLS automatically filters to current org
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          description,
          created_at,
          modules:modules(count),
          chatbots:chatbots(count),
          voice_agents:voice_agents(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!organization?.id,
  });
}

export function useModules(projectId: string) {
  const supabase = useSupabaseClient();

  return useQuery({
    queryKey: ['modules', projectId],
    queryFn: async () => {
      // Double isolation: RLS + explicit project filter
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('project_id', projectId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });
}
```

### 2.3 Data Isolation Verification

```typescript
// middleware/verify-isolation.ts
// Server-side verification layer for defense in depth

import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export async function verifyDataIsolation(
  resourceType: 'project' | 'module' | 'chatbot' | 'voice_agent',
  resourceId: string
) {
  const { orgId } = await auth();
  if (!orgId) throw new Error('No organization context');

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY! // Service key for verification
  );

  const tableName = resourceType === 'project' ? 'projects' : `${resourceType}s`;

  if (resourceType === 'project') {
    const { data } = await supabase
      .from('projects')
      .select('organization_id')
      .eq('id', resourceId)
      .single();

    if (data?.organization_id !== orgId) {
      throw new Error('Access denied: Resource belongs to different organization');
    }
  } else {
    const { data } = await supabase
      .from(tableName)
      .select('project:projects(organization_id)')
      .eq('id', resourceId)
      .single();

    if (data?.project?.organization_id !== orgId) {
      throw new Error('Access denied: Resource belongs to different organization');
    }
  }

  return true;
}
```

---

## 3. Per-Project Feature Exposure

### 3.1 Research Question
How do we enable/disable specific builders (Module, Chatbot, Voice, Canvas) per project based on subscription tier or custom configuration?

### 3.2 Validated Solution: LaunchDarkly with Organization Context

**Source:** Web research, validated patterns

#### Feature Flag Architecture

```typescript
// lib/feature-flags.ts
import * as LaunchDarkly from '@launchdarkly/node-server-sdk';
import { auth } from '@clerk/nextjs/server';

const ldClient = LaunchDarkly.init(process.env.LAUNCHDARKLY_SDK_KEY!);

// Multi-context evaluation for organization + user + project
export async function evaluateFeatureFlag(
  flagKey: string,
  projectId?: string
): Promise<boolean> {
  const { userId, orgId, orgRole } = await auth();

  await ldClient.waitForInitialization();

  // Build multi-context for precise targeting
  const context: LaunchDarkly.LDContext = {
    kind: 'multi',
    user: {
      key: userId!,
      anonymous: false,
    },
    organization: {
      key: orgId!,
      // Custom attributes for targeting
      plan: await getOrgPlan(orgId!),
      createdAt: await getOrgCreatedDate(orgId!),
    },
    ...(projectId && {
      project: {
        key: projectId,
        // Project-specific attributes
        tier: await getProjectTier(projectId),
        customFeatures: await getProjectCustomFeatures(projectId),
      },
    }),
  };

  return ldClient.variation(flagKey, context, false);
}

// Feature flags for builder access
export const FEATURE_FLAGS = {
  // Builder availability
  MODULE_BUILDER: 'module-builder-enabled',
  CHATBOT_BUILDER: 'chatbot-builder-enabled',
  VOICE_AGENT_BUILDER: 'voice-agent-builder-enabled',
  CANVAS_BUILDER: 'canvas-builder-enabled',

  // Feature tiers
  ADVANCED_ANALYTICS: 'advanced-analytics',
  CUSTOM_BRANDING: 'custom-branding',
  API_ACCESS: 'api-access',
  WEBHOOK_INTEGRATIONS: 'webhook-integrations',

  // Beta features
  AI_SUGGESTIONS: 'ai-suggestions-beta',
  COLLABORATIVE_EDITING: 'collaborative-editing-beta',
} as const;
```

#### React Hook Integration

```tsx
// hooks/useFeatureFlags.ts
import { useQuery } from '@tanstack/react-query';
import { useAuth, useOrganization } from '@clerk/nextjs';
import { FEATURE_FLAGS } from '@/lib/feature-flags';

export function useFeatureFlag(flagKey: string, projectId?: string) {
  const { isLoaded, userId } = useAuth();
  const { organization } = useOrganization();

  return useQuery({
    queryKey: ['feature-flag', flagKey, organization?.id, projectId],
    queryFn: async () => {
      const response = await fetch('/api/feature-flags/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flagKey, projectId }),
      });
      return response.json();
    },
    enabled: isLoaded && !!userId && !!organization?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useBuilderAccess(projectId: string) {
  const moduleBuilder = useFeatureFlag(FEATURE_FLAGS.MODULE_BUILDER, projectId);
  const chatbotBuilder = useFeatureFlag(FEATURE_FLAGS.CHATBOT_BUILDER, projectId);
  const voiceBuilder = useFeatureFlag(FEATURE_FLAGS.VOICE_AGENT_BUILDER, projectId);
  const canvasBuilder = useFeatureFlag(FEATURE_FLAGS.CANVAS_BUILDER, projectId);

  return {
    moduleBuilder: moduleBuilder.data?.enabled ?? false,
    chatbotBuilder: chatbotBuilder.data?.enabled ?? false,
    voiceBuilder: voiceBuilder.data?.enabled ?? false,
    canvasBuilder: canvasBuilder.data?.enabled ?? false,
    isLoading: moduleBuilder.isLoading || chatbotBuilder.isLoading ||
               voiceBuilder.isLoading || canvasBuilder.isLoading,
  };
}
```

#### Builder Selection UI with Feature Gates

```tsx
// components/BuilderSelector.tsx
import { useBuilderAccess } from '@/hooks/useFeatureFlags';
import { Protect } from '@clerk/nextjs';
import { Lock } from 'lucide-react';

interface BuilderSelectorProps {
  projectId: string;
  onSelect: (builder: string) => void;
}

export function BuilderSelector({ projectId, onSelect }: BuilderSelectorProps) {
  const {
    moduleBuilder,
    chatbotBuilder,
    voiceBuilder,
    canvasBuilder,
    isLoading
  } = useBuilderAccess(projectId);

  const builders = [
    {
      id: 'module',
      name: 'Module Builder',
      description: 'Create reusable AI modules',
      icon: '🧩',
      enabled: moduleBuilder,
      permission: 'org:modules:deploy',
    },
    {
      id: 'chatbot',
      name: 'Chatbot Builder',
      description: 'Build conversational AI',
      icon: '💬',
      enabled: chatbotBuilder,
      permission: 'org:chatbots:manage',
    },
    {
      id: 'voice',
      name: 'Voice Agent Builder',
      description: 'Create voice AI agents',
      icon: '🎙️',
      enabled: voiceBuilder,
      permission: 'org:voice_agents:manage',
    },
    {
      id: 'canvas',
      name: 'Canvas Builder',
      description: 'Visual workflow designer',
      icon: '🎨',
      enabled: canvasBuilder,
      permission: 'org:canvas:edit',
    },
  ];

  if (isLoading) {
    return <BuilderSelectorSkeleton />;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {builders.map((builder) => (
        <Protect
          key={builder.id}
          permission={builder.permission}
          fallback={
            <BuilderCard
              {...builder}
              disabled
              reason="Insufficient permissions"
            />
          }
        >
          <BuilderCard
            {...builder}
            disabled={!builder.enabled}
            reason={!builder.enabled ? 'Not available on current plan' : undefined}
            onClick={() => builder.enabled && onSelect(builder.id)}
          />
        </Protect>
      ))}
    </div>
  );
}

function BuilderCard({
  name,
  description,
  icon,
  disabled,
  reason,
  onClick
}: {
  name: string;
  description: string;
  icon: string;
  disabled?: boolean;
  reason?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        p-6 rounded-lg border text-left transition-all
        ${disabled
          ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
          : 'bg-white border-gray-200 hover:border-blue-500 hover:shadow-md cursor-pointer'
        }
      `}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <h3 className="font-semibold">{name}</h3>
        {disabled && <Lock className="w-4 h-4 text-gray-400" />}
      </div>
      <p className="text-sm text-gray-600">{description}</p>
      {disabled && reason && (
        <p className="text-xs text-amber-600 mt-2">{reason}</p>
      )}
    </button>
  );
}
```

### 3.3 Subscription Tier Configuration

```typescript
// config/subscription-tiers.ts
export const SUBSCRIPTION_TIERS = {
  FREE: {
    name: 'Free',
    features: {
      [FEATURE_FLAGS.MODULE_BUILDER]: true,
      [FEATURE_FLAGS.CHATBOT_BUILDER]: false,
      [FEATURE_FLAGS.VOICE_AGENT_BUILDER]: false,
      [FEATURE_FLAGS.CANVAS_BUILDER]: false,
      [FEATURE_FLAGS.ADVANCED_ANALYTICS]: false,
      [FEATURE_FLAGS.CUSTOM_BRANDING]: false,
      [FEATURE_FLAGS.API_ACCESS]: false,
    },
    limits: {
      projects: 1,
      modulesPerProject: 3,
      apiCallsPerMonth: 1000,
    },
  },
  STARTER: {
    name: 'Starter',
    features: {
      [FEATURE_FLAGS.MODULE_BUILDER]: true,
      [FEATURE_FLAGS.CHATBOT_BUILDER]: true,
      [FEATURE_FLAGS.VOICE_AGENT_BUILDER]: false,
      [FEATURE_FLAGS.CANVAS_BUILDER]: false,
      [FEATURE_FLAGS.ADVANCED_ANALYTICS]: true,
      [FEATURE_FLAGS.CUSTOM_BRANDING]: false,
      [FEATURE_FLAGS.API_ACCESS]: true,
    },
    limits: {
      projects: 5,
      modulesPerProject: 10,
      apiCallsPerMonth: 10000,
    },
  },
  PROFESSIONAL: {
    name: 'Professional',
    features: {
      [FEATURE_FLAGS.MODULE_BUILDER]: true,
      [FEATURE_FLAGS.CHATBOT_BUILDER]: true,
      [FEATURE_FLAGS.VOICE_AGENT_BUILDER]: true,
      [FEATURE_FLAGS.CANVAS_BUILDER]: true,
      [FEATURE_FLAGS.ADVANCED_ANALYTICS]: true,
      [FEATURE_FLAGS.CUSTOM_BRANDING]: true,
      [FEATURE_FLAGS.API_ACCESS]: true,
    },
    limits: {
      projects: 20,
      modulesPerProject: 50,
      apiCallsPerMonth: 100000,
    },
  },
  ENTERPRISE: {
    name: 'Enterprise',
    features: {
      // All features enabled
      [FEATURE_FLAGS.MODULE_BUILDER]: true,
      [FEATURE_FLAGS.CHATBOT_BUILDER]: true,
      [FEATURE_FLAGS.VOICE_AGENT_BUILDER]: true,
      [FEATURE_FLAGS.CANVAS_BUILDER]: true,
      [FEATURE_FLAGS.ADVANCED_ANALYTICS]: true,
      [FEATURE_FLAGS.CUSTOM_BRANDING]: true,
      [FEATURE_FLAGS.API_ACCESS]: true,
    },
    limits: {
      projects: Infinity,
      modulesPerProject: Infinity,
      apiCallsPerMonth: Infinity,
    },
  },
} as const;
```

---

## 4. Embedded UI Patterns

### 4.1 Research Question
How do we provide embeddable UI components for agency clients to integrate into their own applications?

### 4.2 Validated Solution: Multi-Strategy Embedding

#### Strategy 1: Web Components (Shadow DOM Isolation)

```typescript
// packages/embed/src/agentic-chatbot.ts
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('agentic-chatbot')
export class AgenticChatbot extends LitElement {
  @property({ type: String }) projectId = '';
  @property({ type: String }) apiKey = '';
  @property({ type: String }) theme = 'light';
  @property({ type: Object }) config = {};

  @state() private messages: Message[] = [];
  @state() private isLoading = false;

  static styles = css`
    :host {
      display: block;
      font-family: var(--agentic-font-family, system-ui);
      --primary-color: var(--agentic-primary, #3b82f6);
      --bg-color: var(--agentic-bg, #ffffff);
      --text-color: var(--agentic-text, #1f2937);
    }

    .container {
      border: 1px solid var(--agentic-border, #e5e7eb);
      border-radius: var(--agentic-radius, 12px);
      overflow: hidden;
      height: var(--agentic-height, 500px);
      display: flex;
      flex-direction: column;
    }

    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }

    .input-area {
      border-top: 1px solid var(--agentic-border, #e5e7eb);
      padding: 12px;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.initializeChat();
  }

  private async initializeChat() {
    const response = await fetch(
      `https://api.agentic-platform.com/v1/chatbots/${this.projectId}/init`,
      {
        headers: {
          'X-API-Key': this.apiKey,
        },
      }
    );
    const config = await response.json();
    this.config = { ...this.config, ...config };
  }

  render() {
    return html`
      <div class="container" data-theme=${this.theme}>
        <div class="messages">
          ${this.messages.map(msg => html`
            <chat-message
              .message=${msg}
              .isBot=${msg.role === 'assistant'}
            ></chat-message>
          `)}
        </div>
        <div class="input-area">
          <chat-input
            @send=${this.handleSend}
            ?disabled=${this.isLoading}
          ></chat-input>
        </div>
      </div>
    `;
  }
}
```

**Embed Script:**
```html
<!-- Client Integration -->
<script
  src="https://cdn.agentic-platform.com/embed/v1/chatbot.js"
  defer
></script>

<agentic-chatbot
  project-id="proj_xxx"
  api-key="ak_xxx"
  theme="light"
  style="
    --agentic-primary: #8b5cf6;
    --agentic-height: 600px;
    --agentic-radius: 16px;
  "
></agentic-chatbot>
```

#### Strategy 2: iframe with PostMessage Bridge

```typescript
// packages/embed/src/iframe-embed.ts
export class AgenticIframeEmbed {
  private iframe: HTMLIFrameElement;
  private messageHandlers: Map<string, Function> = new Map();

  constructor(config: EmbedConfig) {
    this.iframe = document.createElement('iframe');
    this.iframe.src = this.buildEmbedUrl(config);
    this.iframe.style.cssText = `
      border: none;
      width: 100%;
      height: ${config.height || '500px'};
    `;

    window.addEventListener('message', this.handleMessage.bind(this));
  }

  private buildEmbedUrl(config: EmbedConfig): string {
    const params = new URLSearchParams({
      projectId: config.projectId,
      embed: 'true',
      theme: config.theme || 'light',
    });

    return `https://embed.agentic-platform.com/chatbot?${params}`;
  }

  private handleMessage(event: MessageEvent) {
    if (event.origin !== 'https://embed.agentic-platform.com') return;

    const { type, payload } = event.data;
    const handler = this.messageHandlers.get(type);
    if (handler) handler(payload);
  }

  public on(event: string, handler: Function) {
    this.messageHandlers.set(event, handler);
    return this;
  }

  public send(type: string, payload: any) {
    this.iframe.contentWindow?.postMessage({ type, payload }, '*');
  }

  public mount(container: HTMLElement) {
    container.appendChild(this.iframe);
    return this;
  }
}

// Usage
const chatbot = new AgenticIframeEmbed({
  projectId: 'proj_xxx',
  apiKey: 'ak_xxx',
  theme: 'light',
  height: '500px',
});

chatbot
  .on('message', (msg) => console.log('New message:', msg))
  .on('ready', () => console.log('Chatbot ready'))
  .mount(document.getElementById('chatbot-container'));
```

#### Strategy 3: React SDK for Deep Integration

```tsx
// @agentic/react
import { AgenticProvider, Chatbot, useAgentic } from '@agentic/react';

// Provider setup
function App() {
  return (
    <AgenticProvider
      projectId="proj_xxx"
      apiKey="ak_xxx"
      config={{
        theme: 'light',
        locale: 'en',
      }}
    >
      <YourApp />
    </AgenticProvider>
  );
}

// Chatbot component
function ChatPage() {
  return (
    <Chatbot
      chatbotId="cb_xxx"
      style={{ height: '100%' }}
      onMessage={(msg) => trackEvent('chat_message', msg)}
      onError={(err) => captureException(err)}
      renderMessage={(msg) => <CustomMessage message={msg} />}
      renderInput={(props) => <CustomInput {...props} />}
    />
  );
}

// Programmatic access
function CustomIntegration() {
  const { chat, isReady } = useAgentic();

  const handleButtonClick = async () => {
    const response = await chat.send('Help me with my order');
    console.log(response);
  };

  return (
    <button onClick={handleButtonClick} disabled={!isReady}>
      Get Help
    </button>
  );
}
```

---

## 5. API Key Management for Clients

### 5.1 Research Question
How do we securely provision and manage API keys for embedded client integrations?

### 5.2 Validated Solution: Scoped API Keys with BFF Pattern

#### API Key Schema

```sql
-- API Keys with fine-grained scopes
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  project_id UUID REFERENCES projects(id), -- NULL = org-wide

  -- Key identification
  name VARCHAR(255) NOT NULL,
  key_prefix VARCHAR(8) NOT NULL, -- e.g., "ak_live_"
  key_hash VARCHAR(64) NOT NULL, -- SHA-256 hash of full key

  -- Scopes and permissions
  scopes TEXT[] NOT NULL DEFAULT '{}',
  -- Possible scopes:
  -- 'chatbot:invoke', 'chatbot:read', 'chatbot:write'
  -- 'module:invoke', 'module:read', 'module:write'
  -- 'voice:invoke', 'voice:read', 'voice:write'
  -- 'analytics:read', 'webhook:manage'

  -- Rate limiting
  rate_limit_per_minute INTEGER DEFAULT 60,
  rate_limit_per_day INTEGER DEFAULT 10000,

  -- Restrictions
  allowed_origins TEXT[] DEFAULT '{}', -- CORS origins
  allowed_ips TEXT[] DEFAULT '{}', -- IP whitelist (empty = all)

  -- Metadata
  environment VARCHAR(20) DEFAULT 'production', -- 'development', 'staging', 'production'
  expires_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,

  CONSTRAINT unique_key_hash UNIQUE (key_hash)
);

-- Usage tracking
CREATE TABLE api_key_usage (
  id BIGSERIAL PRIMARY KEY,
  api_key_id UUID NOT NULL REFERENCES api_keys(id),
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  status_code INTEGER NOT NULL,
  response_time_ms INTEGER,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partitioned by month for efficient querying
CREATE INDEX idx_api_key_usage_created ON api_key_usage(created_at);
CREATE INDEX idx_api_key_usage_key ON api_key_usage(api_key_id);
```

#### API Key Generation Service

```typescript
// services/api-keys.ts
import { createHash, randomBytes } from 'crypto';
import { db } from '@/lib/db';

const KEY_PREFIXES = {
  development: 'ak_dev_',
  staging: 'ak_stg_',
  production: 'ak_live_',
} as const;

export async function generateApiKey(params: {
  organizationId: string;
  projectId?: string;
  name: string;
  scopes: string[];
  environment: 'development' | 'staging' | 'production';
  rateLimitPerMinute?: number;
  rateLimitPerDay?: number;
  allowedOrigins?: string[];
  expiresAt?: Date;
}): Promise<{ key: string; keyId: string }> {
  const prefix = KEY_PREFIXES[params.environment];
  const randomPart = randomBytes(24).toString('base64url');
  const fullKey = `${prefix}${randomPart}`;

  const keyHash = createHash('sha256').update(fullKey).digest('hex');

  const apiKey = await db.apiKeys.create({
    data: {
      organizationId: params.organizationId,
      projectId: params.projectId,
      name: params.name,
      keyPrefix: prefix,
      keyHash,
      scopes: params.scopes,
      environment: params.environment,
      rateLimitPerMinute: params.rateLimitPerMinute ?? 60,
      rateLimitPerDay: params.rateLimitPerDay ?? 10000,
      allowedOrigins: params.allowedOrigins ?? [],
      expiresAt: params.expiresAt,
    },
  });

  // Return full key only once - never stored
  return {
    key: fullKey,
    keyId: apiKey.id,
  };
}

export async function validateApiKey(key: string): Promise<ValidatedKey | null> {
  const keyHash = createHash('sha256').update(key).digest('hex');

  const apiKey = await db.apiKeys.findFirst({
    where: {
      keyHash,
      revokedAt: null,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    },
    include: {
      organization: true,
      project: true,
    },
  });

  if (!apiKey) return null;

  // Update last used
  await db.apiKeys.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  });

  return {
    id: apiKey.id,
    organizationId: apiKey.organizationId,
    projectId: apiKey.projectId,
    scopes: apiKey.scopes,
    rateLimits: {
      perMinute: apiKey.rateLimitPerMinute,
      perDay: apiKey.rateLimitPerDay,
    },
    allowedOrigins: apiKey.allowedOrigins,
  };
}
```

#### BFF Pattern for Embedded Clients

```typescript
// pages/api/embed/[...path].ts
// Backend-for-Frontend proxy for embedded clients

import { NextApiRequest, NextApiResponse } from 'next';
import { validateApiKey } from '@/services/api-keys';
import { checkRateLimit } from '@/services/rate-limiter';
import { logUsage } from '@/services/analytics';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const startTime = Date.now();

  // Extract API key
  const apiKey = req.headers['x-api-key'] as string;
  if (!apiKey) {
    return res.status(401).json({ error: 'Missing API key' });
  }

  // Validate key
  const validatedKey = await validateApiKey(apiKey);
  if (!validatedKey) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  // Check CORS origin
  const origin = req.headers.origin;
  if (validatedKey.allowedOrigins.length > 0 && origin) {
    if (!validatedKey.allowedOrigins.includes(origin)) {
      return res.status(403).json({ error: 'Origin not allowed' });
    }
  }

  // Rate limiting
  const rateLimitResult = await checkRateLimit(validatedKey.id, validatedKey.rateLimits);
  if (!rateLimitResult.allowed) {
    res.setHeader('X-RateLimit-Limit', rateLimitResult.limit);
    res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining);
    res.setHeader('X-RateLimit-Reset', rateLimitResult.resetAt);
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }

  // Check scope
  const path = (req.query.path as string[]).join('/');
  const requiredScope = getRequiredScope(req.method, path);
  if (!validatedKey.scopes.includes(requiredScope)) {
    return res.status(403).json({ error: 'Insufficient scope' });
  }

  try {
    // Forward to internal service
    const response = await forwardRequest(req, validatedKey);

    // Log usage
    await logUsage({
      apiKeyId: validatedKey.id,
      endpoint: path,
      method: req.method,
      statusCode: response.status,
      responseTimeMs: Date.now() - startTime,
      ipAddress: req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function getRequiredScope(method: string, path: string): string {
  if (path.startsWith('chatbot')) {
    if (method === 'POST') return 'chatbot:invoke';
    if (method === 'GET') return 'chatbot:read';
    return 'chatbot:write';
  }
  // ... other resource types
}
```

---

## 6. White-Label Configuration

### 6.1 Research Question
How do we support per-organization branding and customization for white-label deployments?

### 6.2 Validated Solution: Metadata-Driven Theming

#### White-Label Configuration Schema

```typescript
// types/white-label.ts
export interface WhiteLabelConfig {
  // Branding
  branding: {
    logoUrl: string;
    logoAltText: string;
    faviconUrl: string;
    companyName: string;
    supportEmail: string;
    supportUrl?: string;
  };

  // Theme
  theme: {
    mode: 'light' | 'dark' | 'system';
    colors: {
      primary: string;
      primaryForeground: string;
      secondary: string;
      secondaryForeground: string;
      accent: string;
      accentForeground: string;
      background: string;
      foreground: string;
      muted: string;
      mutedForeground: string;
      border: string;
      destructive: string;
      success: string;
      warning: string;
    };
    borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
    fontFamily?: string;
  };

  // Features visibility
  features: {
    showPoweredBy: boolean;
    showDocumentation: boolean;
    showChangelog: boolean;
    customFooterHtml?: string;
    customCss?: string;
  };

  // Custom domains
  domains: {
    primary: string; // e.g., "app.clientdomain.com"
    embed?: string;  // e.g., "embed.clientdomain.com"
  };
}
```

#### Theme Provider Implementation

```tsx
// providers/WhiteLabelProvider.tsx
import { createContext, useContext, useEffect } from 'react';
import { useOrganization } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';

const WhiteLabelContext = createContext<WhiteLabelConfig | null>(null);

export function WhiteLabelProvider({ children }: { children: React.ReactNode }) {
  const { organization } = useOrganization();

  const { data: config } = useQuery({
    queryKey: ['white-label', organization?.id],
    queryFn: async () => {
      const response = await fetch(`/api/organizations/${organization?.id}/white-label`);
      return response.json();
    },
    enabled: !!organization?.id,
  });

  // Apply CSS variables
  useEffect(() => {
    if (!config?.theme) return;

    const root = document.documentElement;
    const { colors, borderRadius, fontFamily } = config.theme;

    // Set color variables
    Object.entries(colors).forEach(([key, value]) => {
      const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVar, value as string);
    });

    // Set radius
    const radiusMap = { none: '0', sm: '0.25rem', md: '0.5rem', lg: '1rem', full: '9999px' };
    root.style.setProperty('--radius', radiusMap[borderRadius] || '0.5rem');

    // Set font
    if (fontFamily) {
      root.style.setProperty('--font-family', fontFamily);
    }

    // Apply custom CSS
    if (config.features?.customCss) {
      const styleEl = document.createElement('style');
      styleEl.id = 'white-label-custom-css';
      styleEl.textContent = config.features.customCss;
      document.head.appendChild(styleEl);

      return () => styleEl.remove();
    }
  }, [config]);

  return (
    <WhiteLabelContext.Provider value={config}>
      {children}
    </WhiteLabelContext.Provider>
  );
}

export const useWhiteLabel = () => useContext(WhiteLabelContext);
```

#### CSS Variables Foundation (Tailwind)

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Default theme - overridden by WhiteLabelProvider */
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --border: 214.3 31.8% 91.4%;
    --destructive: 0 84.2% 60.2%;
    --success: 142.1 76.2% 36.3%;
    --warning: 38 92% 50%;
    --radius: 0.5rem;
    --font-family: system-ui, -apple-system, sans-serif;
  }

  .dark {
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode colors */
  }
}

body {
  font-family: var(--font-family);
}
```

#### Custom Domain Routing (Middleware)

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { clerkMiddleware } from '@clerk/nextjs/server';

async function customDomainMiddleware(req: NextRequest) {
  const hostname = req.headers.get('host') || '';

  // Skip for main domain
  if (hostname === process.env.MAIN_DOMAIN) {
    return null;
  }

  // Look up organization by custom domain
  const orgMapping = await getOrgByDomain(hostname);

  if (orgMapping) {
    // Rewrite to org-specific path
    const url = req.nextUrl.clone();
    url.pathname = `/org/${orgMapping.orgId}${url.pathname}`;

    // Set org context header
    const response = NextResponse.rewrite(url);
    response.headers.set('x-org-id', orgMapping.orgId);
    response.headers.set('x-white-label', 'true');

    return response;
  }

  return null;
}

export default clerkMiddleware(async (auth, req) => {
  // Check custom domain first
  const customDomainResponse = await customDomainMiddleware(req);
  if (customDomainResponse) return customDomainResponse;

  // Continue with normal auth middleware
  // ...
});
```

---

## 7. Architecture Patterns

### 7.1 Complete Multi-Tenant UI Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT BROWSER                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────────┐   │
│  │   Main App (SPA)  │  │  Embedded Widget  │  │   White-Label App     │   │
│  │   app.platform.com│  │  <agentic-chatbot>│  │   app.client.com      │   │
│  └─────────┬─────────┘  └─────────┬─────────┘  └───────────┬───────────┘   │
│            │                      │                        │               │
│            │      All use React + TanStack Query + Clerk   │               │
│            └──────────────────────┼────────────────────────┘               │
└───────────────────────────────────┼─────────────────────────────────────────┘
                                    │
┌───────────────────────────────────┼─────────────────────────────────────────┐
│                           EDGE / CDN LAYER                                   │
├───────────────────────────────────┼─────────────────────────────────────────┤
│  ┌────────────────────────────────┴────────────────────────────────────┐   │
│  │                    Next.js Middleware                                │   │
│  │  • Custom domain routing (white-label)                              │   │
│  │  • Clerk auth verification                                          │   │
│  │  • Organization context injection                                   │   │
│  │  • Rate limiting (edge)                                             │   │
│  └─────────────────────────────────┬───────────────────────────────────┘   │
└────────────────────────────────────┼────────────────────────────────────────┘
                                     │
┌────────────────────────────────────┼────────────────────────────────────────┐
│                           API LAYER                                          │
├────────────────────────────────────┼────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┴──────────────┐  ┌──────────────────┐   │
│  │  Internal    │  │      BFF (Embed API)        │  │   GraphQL API    │   │
│  │  REST API    │  │  /api/embed/[...path].ts    │  │  (Future)        │   │
│  │  (tRPC)      │  │  • API Key validation       │  │                  │   │
│  │              │  │  • Scope enforcement        │  │                  │   │
│  │              │  │  • Rate limiting            │  │                  │   │
│  │              │  │  • Usage tracking           │  │                  │   │
│  └──────┬───────┘  └─────────────┬───────────────┘  └────────┬─────────┘   │
│         │                        │                           │             │
│         └────────────────────────┼───────────────────────────┘             │
│                                  │                                          │
│  ┌───────────────────────────────┴───────────────────────────────────────┐ │
│  │                    Authorization Layer                                 │ │
│  │  • Clerk Organization membership check                                │ │
│  │  • Permission verification (has({ permission: '...' }))              │ │
│  │  • Feature flag evaluation (LaunchDarkly)                            │ │
│  └───────────────────────────────┬───────────────────────────────────────┘ │
└──────────────────────────────────┼──────────────────────────────────────────┘
                                   │
┌──────────────────────────────────┼──────────────────────────────────────────┐
│                           DATA LAYER                                         │
├──────────────────────────────────┼──────────────────────────────────────────┤
│  ┌───────────────────────────────┴───────────────────────────────────────┐ │
│  │                    Supabase PostgreSQL                                 │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │ │
│  │  │                   Row Level Security (RLS)                       │ │ │
│  │  │  • Tenant isolation via JWT claims (auth.jwt() ->> 'org_id')    │ │ │
│  │  │  • Project-scoped data access                                    │ │ │
│  │  │  • Permission-aware policies                                     │ │ │
│  │  └─────────────────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                   │
│  │    Redis      │  │   Qdrant      │  │  Upstash      │                   │
│  │   (Session)   │  │  (Vectors)    │  │  (Rate Limit) │                   │
│  └───────────────┘  └───────────────┘  └───────────────┘                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Data Flow for Embedded Client

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      EMBEDDED CLIENT DATA FLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

  Client Website                    Platform                      Database
  ─────────────                    ────────                      ────────

  ┌──────────────┐
  │ <agentic-   │
  │  chatbot>   │
  └──────┬───────┘
         │
         │ 1. POST /api/embed/chatbot/invoke
         │    Headers: X-API-Key: ak_live_xxx
         │    Body: { message: "Hello" }
         │
         ▼
  ┌──────────────────────────────────────────────────────────────┐
  │                    BFF Embed API Layer                        │
  │                                                               │
  │  2. Validate API Key                                          │
  │     └─ SELECT * FROM api_keys WHERE key_hash = sha256(key)   │
  │                                                               │
  │  3. Check CORS origin                                         │
  │     └─ api_key.allowed_origins.includes(origin)              │
  │                                                               │
  │  4. Verify rate limits                                        │
  │     └─ Redis: INCR rate_limit:{key_id}:{minute}              │
  │                                                               │
  │  5. Verify scope                                              │
  │     └─ api_key.scopes.includes('chatbot:invoke')             │
  └──────────────────────────────────┬───────────────────────────┘
                                     │
                                     │ 6. Forward to Chatbot Service
                                     │    with organization context
                                     ▼
  ┌──────────────────────────────────────────────────────────────┐
  │                    Chatbot Service                            │
  │                                                               │
  │  7. Load chatbot config (RLS enforced)                       │
  │     └─ SELECT * FROM chatbots                                │
  │        WHERE id = :chatbot_id                                │
  │        -- RLS: organization_id = jwt.org_id                  │
  │                                                               │
  │  8. Process with LLM                                          │
  │     └─ Anthropic Claude / OpenAI GPT                         │
  │                                                               │
  │  9. Store conversation (RLS enforced)                        │
  │     └─ INSERT INTO conversations                             │
  │        -- RLS: organization_id from chatbot                  │
  └──────────────────────────────────┬───────────────────────────┘
                                     │
                                     │ 10. Return response
                                     ▼
  ┌──────────────┐
  │ Response     │◄──────────────────┘
  │ displayed    │
  └──────────────┘
```

---

## 8. Implementation Recommendations

### 8.1 Priority Order

| Priority | Component | Effort | Impact | Dependencies |
|----------|-----------|--------|--------|--------------|
| P0 | Clerk Organizations Setup | Medium | Critical | None |
| P0 | Supabase RLS Policies | Medium | Critical | Clerk |
| P1 | API Key Management | Medium | High | Clerk, RLS |
| P1 | Feature Flags (LaunchDarkly) | Low | High | Clerk |
| P2 | White-Label Theming | Medium | Medium | Clerk |
| P2 | Embedded Web Components | High | Medium | API Keys |
| P3 | Custom Domain Routing | Medium | Low | White-Label |
| P3 | React SDK Package | High | Low | API Keys |

### 8.2 Security Checklist

- [ ] All tenant data queries use RLS-enabled tables
- [ ] JWT claims include `org_id` and `permissions`
- [ ] API keys are hashed before storage (never stored plaintext)
- [ ] Rate limiting enforced at edge and API layers
- [ ] CORS origins validated for embedded clients
- [ ] Custom CSS sanitized before injection (prevent XSS)
- [ ] Audit logging for all administrative actions

### 8.3 Performance Considerations

1. **RLS Performance**
   - Add indexes on `organization_id` and `project_id` columns
   - Use `auth.jwt()` caching (Supabase handles this)
   - Avoid complex subqueries in RLS policies

2. **Feature Flag Performance**
   - Cache flag evaluations for 5 minutes
   - Use `staleTime` in React Query
   - Batch flag requests where possible

3. **White-Label Performance**
   - Cache organization config at edge (1 hour)
   - Lazy-load custom fonts
   - Inline critical CSS

### 8.4 Migration Strategy

```typescript
// Phase 1: Add org_id to existing tables
ALTER TABLE modules ADD COLUMN organization_id UUID;
UPDATE modules m SET organization_id = (
  SELECT p.organization_id FROM projects p WHERE p.id = m.project_id
);
ALTER TABLE modules ALTER COLUMN organization_id SET NOT NULL;

// Phase 2: Enable RLS
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

// Phase 3: Create policies
CREATE POLICY "tenant_isolation" ON modules
FOR ALL TO authenticated
USING (organization_id = (auth.jwt() ->> 'org_id')::uuid);

// Phase 4: Test extensively before production
```

---

## 9. Validation Summary

### 9.1 Sources Validated

| Topic | Source | Validation Method |
|-------|--------|-------------------|
| Clerk Organizations RBAC | DeepWiki (clerk/javascript) | Direct API query |
| Supabase RLS + JWT | DeepWiki (supabase/supabase) | Direct API query |
| Next.js Middleware Patterns | Context7 (/vercel/next.js) | Documentation query |
| LaunchDarkly Multi-Context | Web Research | Feature documentation |
| WorkOS Enterprise SSO | Web Research | API documentation |
| Web Components (Lit) | Web Research | Framework documentation |

### 9.2 Confidence Levels

| Pattern | Confidence | Notes |
|---------|------------|-------|
| Clerk Organizations | High | Production-proven, excellent docs |
| Supabase RLS | High | Core feature, extensively documented |
| LaunchDarkly Multi-Context | Medium | Newer feature, limited examples |
| White-Label Theming | High | Standard CSS variables approach |
| Embedded Web Components | Medium | Requires custom implementation |
| BFF Pattern | High | Well-established architecture |

---

## Appendix A: Complete Type Definitions

```typescript
// types/multi-tenant.ts

export interface Organization {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  publicMetadata: {
    plan: SubscriptionTier;
    whiteLabelConfig?: WhiteLabelConfig;
    customFeatures?: string[];
  };
}

export interface Project {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  status: 'active' | 'archived' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiKey {
  id: string;
  organizationId: string;
  projectId?: string;
  name: string;
  keyPrefix: string;
  scopes: ApiKeyScope[];
  environment: 'development' | 'staging' | 'production';
  rateLimitPerMinute: number;
  rateLimitPerDay: number;
  allowedOrigins: string[];
  allowedIps: string[];
  expiresAt?: Date;
  lastUsedAt?: Date;
  createdAt: Date;
  revokedAt?: Date;
}

export type ApiKeyScope =
  | 'chatbot:invoke'
  | 'chatbot:read'
  | 'chatbot:write'
  | 'module:invoke'
  | 'module:read'
  | 'module:write'
  | 'voice:invoke'
  | 'voice:read'
  | 'voice:write'
  | 'analytics:read'
  | 'webhook:manage';

export type SubscriptionTier = 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
```

---

**Document Status:** Complete
**Next Steps:** Update architecture synthesis and master plan with these findings
