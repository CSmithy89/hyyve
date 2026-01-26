# Hyyve Platform - Routing Specification

**Project:** Hyyve Platform
**Purpose:** Technical routing map for frontend implementation
**Total Routes:** 146 screens + supporting routes
**Last Updated:** 2026-01-26

---

## 1. Routing Architecture Overview

### 1.1 URL Structure Convention

```
/{area}/{resource}/{id?}/{sub-resource?}/{action?}

Examples:
/auth/login
/dashboard
/workspaces/:workspaceId/projects/:projectId
/builders/module/:moduleId
/builders/module/:moduleId/nodes/:nodeId/config
/marketplace/mcp/:serverId/install
```

### 1.2 Route Groups

| Group | Base Path | Auth Required | Description |
|-------|-----------|---------------|-------------|
| Public | `/` | No | Landing, pricing, docs |
| Auth | `/auth/*` | No | Login, register, MFA |
| Dashboard | `/dashboard` | Yes | Home, projects |
| Builders | `/builders/*` | Yes | Module, Chatbot, Voice, Canvas |
| Knowledge | `/knowledge/*` | Yes | KB management |
| Marketplace | `/marketplace/*` | Yes | MCP, Skills, Modules |
| Settings | `/settings/*` | Yes | User, workspace, billing |
| Admin | `/admin/*` | Yes + Role | Enterprise admin |
| Agency | `/agency/*` | Yes + Role | Agency management |

---

## 2. Authentication Routes (Screens 1.1.1 - 1.1.7)

### 2.1 Route Table

| Screen ID | Route Path | Component | Guards | Redirects |
|-----------|------------|-----------|--------|-----------|
| 1.1.1 | `/auth/login` | LoginPage | guest | → `/dashboard` if authenticated |
| 1.1.2 | `/auth/register` | RegisterFlow | guest | → `/auth/register/org` on step 2 |
| 1.1.2 | `/auth/register/org` | OrgSetupStep | guest | → `/auth/register/personalize` on step 3 |
| 1.1.3 | `/auth/register/personalize` | PersonalizeStep | guest | → `/auth/mfa-setup` or `/onboarding` |
| 1.1.5 | `/auth/mfa-setup` | MFASetup | auth | → `/auth/mfa-setup/authenticator` |
| 1.1.6 | `/auth/mfa-setup/authenticator` | AuthenticatorSetup | auth | → `/auth/mfa-setup/backup` |
| 1.1.7 | `/auth/mfa-setup/backup` | BackupCodes | auth | → `/onboarding` or `/dashboard` |
| - | `/auth/forgot-password` | ForgotPassword | guest | - |
| - | `/auth/reset-password/:token` | ResetPassword | guest | → `/auth/login` |
| - | `/auth/verify-email/:token` | VerifyEmail | guest | → `/auth/login` |
| - | `/auth/sso/:provider` | SSOCallback | guest | → `/dashboard` |

### 2.2 Auth Flow Diagram

```
Landing (/)
    │
    ├── [Sign In] ──→ /auth/login
    │                     │
    │                     ├── [Success] ──→ /dashboard
    │                     ├── [MFA Required] ──→ /auth/mfa-verify
    │                     └── [SSO] ──→ /auth/sso/:provider
    │
    └── [Sign Up] ──→ /auth/register
                          │
                          ├── Step 1: Account ──→ /auth/register
                          ├── Step 2: Organization ──→ /auth/register/org
                          ├── Step 3: Personalize ──→ /auth/register/personalize
                          │
                          └── [Complete] ──→ /onboarding/welcome
                                              OR /auth/mfa-setup (if enterprise)
```

---

## 3. Onboarding Routes (Screens 1.9.1 - 1.9.3)

| Screen ID | Route Path | Component | Guards | Entry Condition |
|-----------|------------|-----------|--------|-----------------|
| 1.9.1 | `/onboarding` | OnboardingWizard | auth | New user, !onboarding_complete |
| 1.9.1 | `/onboarding/welcome` | WelcomeStep | auth | First login |
| 1.9.1 | `/onboarding/use-case` | UseCaseSelection | auth | After welcome |
| 1.9.1 | `/onboarding/guided/:path` | GuidedPath | auth | Selected guided flow |
| 1.9.2 | `/help` | HelpPanel | auth | Global overlay |
| 1.9.3 | `/learn` | LearningCenter | auth | - |

### 3.1 Onboarding Flow Paths

```
/onboarding/welcome
    │
    ├── [Guide Me] ──→ /onboarding/guided/chatbot
    │                       └── Wendy-guided chatbot creation
    │
    ├── [Templates] ──→ /templates
    │
    ├── [Demo] ──→ /onboarding/demo
    │
    └── [Skip] ──→ /dashboard
```

---

## 4. Dashboard & Navigation Routes (Screens 1.5.1 - 1.5.2)

| Screen ID | Route Path | Component | Guards | Default |
|-----------|------------|-----------|--------|---------|
| 1.5.1 | `/dashboard` | HomeDashboard | auth | Yes (after login) |
| 1.5.2 | `/workspaces/:workspaceId` | WorkspaceView | auth, workspace_member | - |
| 1.5.2 | `/workspaces/:workspaceId/projects` | ProjectBrowser | auth, workspace_member | - |
| 1.5.2 | `/workspaces/:workspaceId/folders/:folderId` | FolderView | auth, workspace_member | - |
| - | `/workspaces/:workspaceId/projects/:projectId` | ProjectDashboard | auth, project_access | - |

### 4.1 Workspace Navigation Structure

```
/dashboard (Home)
    │
    ├── /workspaces/:workspaceId
    │       │
    │       ├── /projects (Project Browser)
    │       │       │
    │       │       └── /projects/:projectId (Project Dashboard)
    │       │               │
    │       │               ├── /knowledge (KB Dashboard)
    │       │               ├── /builders/module/:moduleId
    │       │               ├── /builders/chatbot/:chatbotId
    │       │               ├── /builders/voice/:voiceId
    │       │               └── /builders/canvas/:canvasId
    │       │
    │       └── /folders/:folderId (Folder View)
    │               └── [nested folders up to 5 levels]
    │
    └── /settings (Global Settings)
```

---

## 5. Module Builder Routes (Screens 1.2.1 - 1.2.6)

| Screen ID | Route Path | Component | Guards | Context |
|-----------|------------|-----------|--------|---------|
| 1.2.1 | `/builders/module/:moduleId` | ModuleBuilderMain | auth, module_access | Bond agent |
| 1.2.2 | `/builders/module/:moduleId/nodes/:nodeId` | NodeConfigPanel | auth, module_access | Slide-over panel |
| 1.2.2a | `/builders/module/:moduleId/nodes/:nodeId/llm` | LLMNodeConfig | auth, module_access | LLM node type |
| 1.2.2b | `/builders/module/:moduleId/nodes/:nodeId/rag` | RAGNodeConfig | auth, module_access | RAG node type |
| 1.2.2c | `/builders/module/:moduleId/nodes/:nodeId/branch` | BranchNodeConfig | auth, module_access | Branch node type |
| 1.2.2d | `/builders/module/:moduleId/nodes/:nodeId/api` | APINodeConfig | auth, module_access | API node type |
| 1.2.2e | `/builders/module/:moduleId/nodes/:nodeId/code` | CodeNodeConfig | auth, module_access | Code node type |
| 1.2.2f | `/builders/module/:moduleId/nodes/:nodeId/trigger` | TriggerNodeConfig | auth, module_access | Trigger node type |
| 1.2.3 | `/builders/module/:moduleId/executions` | ExecutionMonitor | auth, module_access | - |
| 1.2.3 | `/builders/module/:moduleId/executions/:runId` | ExecutionDetail | auth, module_access | - |
| 1.2.4 | `/builders/module/:moduleId/export` | CodeExportPreview | auth, module_access | - |
| 1.2.5 | `/builders/module/:moduleId/export/config` | FrameworkSelection | auth, module_access | - |
| 1.2.6 | `/builders/module/:moduleId/export/viewer` | GeneratedCodeViewer | auth, module_access | - |

### 5.1 Module Builder Flow

```
/workspaces/:wid/projects/:pid
    │
    └── [Open Module] ──→ /builders/module/:moduleId
                              │
                              ├── [Select Node] ──→ /builders/module/:mid/nodes/:nid
                              │                         │
                              │                         └── [Node Type Config]
                              │                               ├── /llm
                              │                               ├── /rag
                              │                               ├── /branch
                              │                               ├── /api
                              │                               ├── /code
                              │                               └── /trigger
                              │
                              ├── [Run] ──→ /builders/module/:mid/executions/:runId
                              │
                              └── [Export] ──→ /builders/module/:mid/export
                                                  │
                                                  ├── /config (Framework Selection)
                                                  └── /viewer (Generated Code)
```

---

## 6. Chatbot Builder Routes (Screens 1.3.1 - 1.3.7)

| Screen ID | Route Path | Component | Guards | Context |
|-----------|------------|-----------|--------|---------|
| 1.3.1 | `/builders/chatbot/:chatbotId` | ChatbotBuilderMain | auth, chatbot_access | Wendy agent |
| 1.3.2 | `/builders/chatbot/:chatbotId/intents` | IntentTraining | auth, chatbot_access | - |
| 1.3.2 | `/builders/chatbot/:chatbotId/intents/:intentId` | IntentDetail | auth, chatbot_access | - |
| 1.3.3 | `/builders/chatbot/:chatbotId/widget` | WidgetCustomization | auth, chatbot_access | - |
| 1.3.4 | `/builders/chatbot/:chatbotId/flows` | ConversationFlowDesigner | auth, chatbot_access | - |
| 1.3.5 | `/builders/chatbot/:chatbotId/templates` | ResponseTemplateEditor | auth, chatbot_access | - |
| 1.3.6 | `/builders/chatbot/:chatbotId/preview` | WidgetPreview | auth, chatbot_access | - |
| 1.3.7 | `/builders/chatbot/:chatbotId/analytics` | ChatbotAnalytics | auth, chatbot_access | - |

### 6.1 Chatbot Builder Tabs

```
/builders/chatbot/:chatbotId
    │
    ├── Tab: Canvas (default) ──→ /builders/chatbot/:cid
    ├── Tab: Intents ──→ /builders/chatbot/:cid/intents
    ├── Tab: Flows ──→ /builders/chatbot/:cid/flows
    ├── Tab: Templates ──→ /builders/chatbot/:cid/templates
    ├── Tab: Widget ──→ /builders/chatbot/:cid/widget
    ├── Tab: Preview ──→ /builders/chatbot/:cid/preview
    └── Tab: Analytics ──→ /builders/chatbot/:cid/analytics
```

---

## 7. Knowledge Base Routes (Screens 1.4.1 - 1.4.7)

| Screen ID | Route Path | Component | Guards |
|-----------|------------|-----------|--------|
| 1.4.1 | `/workspaces/:wid/projects/:pid/knowledge` | KBDashboard | auth, project_access |
| 1.4.2 | `/workspaces/:wid/projects/:pid/knowledge/sources/new` | SourceUploadModal | auth, project_access |
| 1.4.3 | `/workspaces/:wid/projects/:pid/knowledge/query` | KBQueryTesting | auth, project_access |
| 1.4.4 | `/workspaces/:wid/projects/:pid/knowledge/config` | RAGPipelineConfig | auth, project_access |
| 1.4.5 | `/workspaces/:wid/projects/:pid/knowledge/config/embedding` | EmbeddingModelConfig | auth, project_access |
| 1.4.6 | `/workspaces/:wid/projects/:pid/knowledge/config/chunking` | ChunkingStrategyConfig | auth, project_access |
| 1.4.7 | `/workspaces/:wid/projects/:pid/knowledge/config/query` | QueryPipelineConfig | auth, project_access |

---

## 8. Canvas Builder Routes (Screens 2.1.1 - 2.1.9)

| Screen ID | Route Path | Component | Guards | Context |
|-----------|------------|-----------|--------|---------|
| 2.1.1 | `/builders/canvas/:canvasId` | CanvasBuilderMain | auth, canvas_access | Artie agent |
| 2.1.2 | `/builders/canvas/:canvasId/components/:componentId` | ComponentInspector | auth, canvas_access | Panel |
| 2.1.3 | `/builders/canvas/:canvasId/generate` | AIGenerationModal | auth, canvas_access | Modal |
| 2.1.4 | `/builders/canvas/:canvasId/tools/:toolId` | MCPToolNodeConfig | auth, canvas_access | - |
| 2.1.5 | `/builders/canvas/:canvasId/tools/:toolId/params` | MCPToolParamBinding | auth, canvas_access | - |
| 2.1.6 | `/builders/canvas/:canvasId/tools/:toolId/consent` | MCPToolConsent | auth, canvas_access | Modal |
| 2.1.7 | `/builders/canvas/:canvasId/assets` | CanvasAssetLibrary | auth, canvas_access | Panel |
| 2.1.8 | `/builders/canvas/:canvasId/batch` | BatchProcessingQueue | auth, canvas_access | - |
| 2.1.9 | `/builders/canvas/:canvasId/costs` | CostEstimationPanel | auth, canvas_access | Panel |

---

## 9. Voice Builder Routes (Screens 2.2.1 - 2.2.6)

| Screen ID | Route Path | Component | Guards | Context |
|-----------|------------|-----------|--------|---------|
| 2.2.1 | `/builders/voice/:voiceId` | VoiceBuilderMain | auth, voice_access | Morgan agent |
| 2.2.2 | `/builders/voice/:voiceId/config` | VoiceConfigPanel | auth, voice_access | - |
| 2.2.3 | `/builders/voice/:voiceId/calls/:callId` | LiveCallMonitor | auth, voice_access | Real-time |
| 2.2.4 | `/builders/voice/:voiceId/config/advanced` | AdvancedVoiceConfig | auth, voice_access | - |
| 2.2.5 | `/builders/voice/:voiceId/analytics` | VoiceAnalytics | auth, voice_access | - |
| 2.2.6 | `/builders/voice/:voiceId/recordings/:recordingId` | CallRecordingPlayback | auth, voice_access | - |

---

## 10. Marketplace Routes (Screens 3.1.1 - 3.5.4)

| Screen ID | Route Path | Component | Guards |
|-----------|------------|-----------|--------|
| 3.1.1 | `/marketplace` | MarketplaceHome | auth |
| 3.1.2 | `/marketplace/items/:itemId` | MarketplaceItemDetail | auth |
| 3.1.3 | `/marketplace/skills` | SkillsDirectoryBrowser | auth |
| 3.1.4 | `/marketplace/skills/:skillId` | SkillDetailModal | auth |
| 3.2.1 | `/marketplace/mcp` | MCPRegistryBrowser | auth |
| 3.2.2 | `/marketplace/mcp/:serverId` | MCPServerDetail | auth |
| 3.2.3 | `/marketplace/mcp/:serverId/install` | MCPServerInstallWizard | auth |
| 3.2.4 | `/marketplace/mcp/usage` | MCPServerUsageDashboard | auth |
| 3.3.1 | `/creator` | CreatorDashboard | auth, creator_role |
| 3.3.2 | `/creator/listings/:listingId` | ListingEditor | auth, creator_role |
| 3.3.3 | `/creator/mcp/:serverId/pricing` | MCPServerPricingConfig | auth, creator_role |
| 3.3.4 | `/creator/revenue` | RevenueShareExplainer | auth, creator_role |
| 3.3.5 | `/creator/payouts` | PayoutDashboard | auth, creator_role |
| 3.3.6 | `/creator/payouts/settings` | PayoutSettings | auth, creator_role |
| 3.5.1 | `/marketplace/templates` | WorkflowTemplatesBrowser | auth |
| 3.5.2 | `/creator/bundles/new` | BundleCreation | auth, creator_role |
| 3.5.3 | `/creator/wizards/:wizardId` | ModuleSetupWizardBuilder | auth, creator_role |
| 3.5.4 | `/creator/reviews` | RatingsReviewsManagement | auth, creator_role |

---

## 11. Settings Routes (Screens 1.10.1 - 1.10.4, 1.6.1 - 1.6.2)

| Screen ID | Route Path | Component | Guards |
|-----------|------------|-----------|--------|
| 1.10.1 | `/settings/profile` | UserProfilePreferences | auth |
| 1.10.2 | `/settings/account` | AccountSettings | auth |
| 1.10.3 | `/settings/api-keys` | APIKeysManagement | auth |
| 1.10.4 | `/settings/workspace` | WorkspaceSettings | auth, workspace_admin |
| 1.6.1 | `/pricing` | PricingPage | - |
| 1.6.2 | `/settings/billing` | BillingDashboard | auth, billing_access |

### 11.1 Settings Navigation

```
/settings
    │
    ├── /profile (User Profile)
    ├── /account (Account Settings, MFA)
    ├── /api-keys (API Key Management)
    ├── /workspace (Workspace Settings) [workspace_admin]
    ├── /billing (Billing Dashboard) [billing_access]
    └── /notifications (Notification Preferences)
```

---

## 12. Observability Routes (Screens 1.8.1 - 1.8.2)

| Screen ID | Route Path | Component | Guards |
|-----------|------------|-----------|--------|
| 1.8.1 | `/observability` | ObservabilityDashboard | auth |
| 1.8.2 | `/observability/executions/:runId` | ExecutionDetailView | auth |

---

## 13. Command Center & HITL Routes (Screens 2.3.1 - 2.4.2)

| Screen ID | Route Path | Component | Guards |
|-----------|------------|-----------|--------|
| 2.3.1 | `/command-center` | CommandCenterOverview | auth |
| 2.4.1 | `/hitl` | HITLQueueDashboard | auth, hitl_access |
| 2.4.2 | `/hitl/reviews/:reviewId` | ReviewInterface | auth, hitl_access |

---

## 14. Deployment & Environment Routes (Screens 2.6.1 - 2.7.4)

| Screen ID | Route Path | Component | Guards |
|-----------|------------|-----------|--------|
| 2.6.1 | `/integrations/chatwoot/deploy` | ChatwootDeploymentWizard | auth |
| 2.6.2 | `/integrations/chatwoot/inboxes` | InboxSelectionConfig | auth |
| 2.6.3 | `/integrations/chatwoot/handoff` | HumanHandoffConfig | auth |
| 2.6.4 | `/integrations/chatwoot/widget` | ChatwootWidgetEmbed | auth |
| 2.7.1 | `/environments` | EnvironmentManager | auth |
| 2.7.2 | `/environments/:envId/rollout` | VersionRolloutManager | auth |
| 2.7.3 | `/environments/health` | DeploymentHealthDashboard | auth |
| 2.7.4 | `/environments/:envId/config` | EnvironmentConfiguration | auth |

---

## 15. Testing Routes (Screens 2.8.1 - 2.8.3)

| Screen ID | Route Path | Component | Guards |
|-----------|------------|-----------|--------|
| 2.8.1 | `/testing/suites` | TestSuiteManager | auth |
| 2.8.2 | `/testing/suites/:suiteId/cases/new` | TestCaseBuilder | auth |
| 2.8.3 | `/testing/results` | TestResultsCoverageReport | auth |

---

## 16. Export & API Routes (Screens 2.9.1 - 2.11.2)

| Screen ID | Route Path | Component | Guards |
|-----------|------------|-----------|--------|
| 2.9.1 | `/export` | ExportWizard | auth |
| 2.9.2 | `/export/config` | ExportConfigDownload | auth |
| 2.10.1 | `/api-management` | APIEndpointManager | auth |
| 2.10.2 | `/api-management/rate-limits` | RateLimitingConfig | auth |
| 2.10.3 | `/api-management/keys` | APIKeyManagement | auth |
| 2.11.1 | `/webhooks` | WebhookConfiguration | auth |
| 2.11.2 | `/webhooks/logs` | WebhookDeliveryLogs | auth |

---

## 17. UI Generation Routes (Screens 2.14.1 - 2.14.5)

| Screen ID | Route Path | Component | Guards |
|-----------|------------|-----------|--------|
| 2.14.1 | `/builders/ui/:uiId` | UIGenerationCanvas | auth |
| 2.14.2 | `/builders/ui/:uiId/forms/:formId` | FormBuilderInterface | auth |
| 2.14.3 | `/builders/ui/:uiId/theme` | ThemeCustomizer | auth |
| 2.14.4 | `/builders/ui/:uiId/embed` | ComponentEmbedConfig | auth |
| 2.14.5 | `/components` | ComponentLibraryBrowser | auth |

---

## 18. Enterprise & Agency Routes (Screens 4.1.1 - 4.9.4)

### 18.1 Agency Routes

| Screen ID | Route Path | Component | Guards |
|-----------|------------|-----------|--------|
| 4.1.1 | `/agency` | AgencyDashboard | auth, agency_role |
| 4.1.2 | `/agency/clients/:clientId` | ClientWorkspaceView | auth, agency_role |
| 4.1.3 | `/agency/branding` | WhiteLabelBrandingWizard | auth, agency_role |
| 4.1.4 | `/agency/domains` | CustomDomainConfiguration | auth, agency_role |
| 4.1.5 | `/agency/clients/:clientId/onboard` | ClientOnboardingFlow | auth, agency_role |
| 4.1.6 | `/agency/billing` | AgencyBillingManagement | auth, agency_role |
| 4.1.7 | `/agency/sub-accounts` | SubAccountManagement | auth, agency_role |

### 18.2 Enterprise Admin Routes

| Screen ID | Route Path | Component | Guards |
|-----------|------------|-----------|--------|
| 4.4.1 | `/admin/sso` | SSOConfiguration | auth, enterprise_admin |
| 4.4.2 | `/admin/teams` | TeamPermissionsManagement | auth, enterprise_admin |
| 4.6.1 | `/admin/support/users` | SupportConsoleUserLookup | auth, support_role |
| 4.6.2 | `/admin/support/executions` | ExecutionHistoryViewer | auth, support_role |
| 4.6.3 | `/admin/integrations/health` | IntegrationHealthDashboard | auth, support_role |

### 18.3 Security & Compliance Routes

| Screen ID | Route Path | Component | Guards |
|-----------|------------|-----------|--------|
| 4.7.1 | `/admin/security` | SecurityDashboard | auth, security_admin |
| 4.7.2 | `/admin/compliance` | ComplianceDocuments | auth, security_admin |
| 4.7.3 | `/admin/audit-logs` | AuditLogViewer | auth, security_admin |
| 4.7.4 | `/admin/data-residency` | DataResidencyConfig | auth, security_admin |

### 18.4 Platform Admin Routes

| Screen ID | Route Path | Component | Guards |
|-----------|------------|-----------|--------|
| 4.8.1 | `/admin/organizations` | OrgHierarchyManagement | auth, platform_admin |
| 4.8.2 | `/admin/rbac` | RBACPermissionEditor | auth, platform_admin |
| 4.8.3 | `/admin/tenants` | TenantRegistry | auth, platform_admin |
| 4.8.4 | `/admin/rate-limits` | DynamicRateLimitingPanel | auth, platform_admin |

### 18.5 Notification Routes

| Screen ID | Route Path | Component | Guards |
|-----------|------------|-----------|--------|
| 4.9.1 | `/notifications` | NotificationCenter | auth |
| 4.9.2 | `/settings/alerts` | AlertConfiguration | auth |
| 4.9.3 | `/webhooks/triggers` | WebhookTriggersSetup | auth |
| 4.9.4 | `/integrations` | IntegrationConnectors | auth |

---

## 19. Collaboration Routes (Screens 5.1.1 - 5.2.2)

| Screen ID | Route Path | Component | Guards |
|-----------|------------|-----------|--------|
| 5.1.1 | `/collab/:resourceType/:resourceId` | MultiUserEditor | auth, resource_access |
| 5.1.2 | `/collab/:resourceType/:resourceId/share` | SharePermissionsModal | auth, resource_owner |
| 5.1.3 | `/collab/:resourceType/:resourceId/sync` | RealtimeSyncStatus | auth, resource_access |
| 5.2.1 | `/collab/:resourceType/:resourceId/versions` | VersionHistory | auth, resource_access |
| 5.2.2 | `/collab/:resourceType/:resourceId/versions/:versionId/diff` | DiffViewer | auth, resource_access |

---

## 20. Developer Portal Routes (Screens 6.1.1 - 6.5.1)

| Screen ID | Route Path | Component | Guards |
|-----------|------------|-----------|--------|
| 6.1.1 | `/developer/api-keys` | APIKeyManagementExternal | auth |
| 6.2.1 | `/developer` | DeveloperPortalHome | auth |
| 6.2.2 | `/developer/docs` | APIDocumentationBrowser | auth |
| 6.2.3 | `/developer/sdks` | SDKDownloadsQuickstart | auth |
| 6.2.4 | `/developer/playground` | APIPlayground | auth |
| 6.3.1 | `/self-hosted/setup` | SelfHostedSetupWizard | auth, self_hosted_license |
| 6.5.1 | `/m/dashboard` | MobileDashboard | auth |

---

## 21. Template & Tenant Routes (Screens 2.12.1 - 2.13.2)

| Screen ID | Route Path | Component | Guards |
|-----------|------------|-----------|--------|
| 2.12.1 | `/templates` | TemplateBrowser | auth |
| 2.12.2 | `/templates/:templateId` | TemplatePreview | auth |
| 2.12.3 | `/templates/:templateId/customize` | TemplateCustomization | auth |
| 2.13.1 | `/tenant-switcher` | TenantSwitcher | auth, multi_tenant |
| 2.13.2 | `/admin/tenant-isolation` | TenantIsolationConfig | auth, platform_admin |

---

## 22. Route Guards Reference

### 22.1 Guard Types

| Guard | Description | Redirect On Fail |
|-------|-------------|------------------|
| `guest` | Not authenticated | → `/dashboard` |
| `auth` | Authenticated user | → `/auth/login` |
| `workspace_member` | Member of workspace | → `/dashboard` |
| `workspace_admin` | Admin of workspace | → `/dashboard` |
| `project_access` | Has project access | → workspace view |
| `module_access` | Has module access | → project view |
| `chatbot_access` | Has chatbot access | → project view |
| `voice_access` | Has voice agent access | → project view |
| `canvas_access` | Has canvas access | → project view |
| `creator_role` | Has creator/publisher role | → `/marketplace` |
| `agency_role` | Has agency tier | → `/dashboard` |
| `enterprise_admin` | Enterprise admin role | → `/dashboard` |
| `platform_admin` | Platform admin role | → `/dashboard` |
| `support_role` | Support staff role | → `/dashboard` |
| `security_admin` | Security admin role | → `/dashboard` |
| `hitl_access` | Has HITL reviewer access | → `/dashboard` |
| `billing_access` | Has billing access | → `/settings` |
| `self_hosted_license` | Has self-hosted license | → `/pricing` |
| `multi_tenant` | User belongs to multiple tenants | - |

### 22.2 Guard Implementation Pattern

```typescript
// Next.js middleware pattern
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Auth routes - redirect to dashboard if authenticated
  if (pathname.startsWith('/auth/') && isAuthenticated(request)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Protected routes - redirect to login if not authenticated
  if (PROTECTED_ROUTES.some(r => pathname.startsWith(r)) && !isAuthenticated(request)) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Role-based routes
  if (pathname.startsWith('/admin/') && !hasRole(request, 'admin')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}
```

---

## 23. Default Entry Points by User Role

| Role | Default Route | Fallback |
|------|---------------|----------|
| New User (no onboarding) | `/onboarding` | - |
| Standard User | `/dashboard` | - |
| Creator | `/creator` | `/dashboard` |
| Agency User | `/agency` | `/dashboard` |
| Enterprise Admin | `/admin/teams` | `/dashboard` |
| Platform Admin | `/admin/tenants` | `/dashboard` |
| Support Staff | `/admin/support/users` | `/dashboard` |
| Self-Hosted Admin | `/self-hosted/setup` | `/dashboard` |

---

## 24. Breadcrumb Patterns

### 24.1 Standard Breadcrumb Structure

```
Home > Workspace > Project > Builder > Resource
```

### 24.2 Examples

```
Dashboard > Acme Corp > Customer Service Bot > Module Builder
Dashboard > Acme Corp > FAQ Bot > Chatbot Builder > Intents
Marketplace > MCP Servers > Slack Integration > Install
Settings > Workspace > Members
Admin > Security > Audit Logs
```

---

## 25. Deep Link Patterns

### 25.1 Resource Deep Links

```
/builders/module/:moduleId                    # Open module builder
/builders/module/:moduleId/nodes/:nodeId      # Open specific node config
/builders/chatbot/:chatbotId/intents/:intentId # Open specific intent
/marketplace/mcp/:serverId/install            # Start MCP install flow
/collab/:resourceType/:resourceId/versions/:versionId/diff  # View specific diff
```

### 25.2 Action Deep Links

```
/workspaces/:wid/projects/new                 # Create new project
/builders/module/new?workspace=:wid&project=:pid  # Create new module
/marketplace/mcp/:serverId/install?auto=true  # Auto-start install
```

---

## 26. Navigation State Management

### 26.1 URL Query Parameters

| Parameter | Purpose | Example |
|-----------|---------|---------|
| `tab` | Active tab in tabbed views | `?tab=intents` |
| `panel` | Open side panel | `?panel=config` |
| `modal` | Open modal | `?modal=share` |
| `filter` | Applied filters | `?filter=active` |
| `search` | Search query | `?search=customer` |
| `page` | Pagination | `?page=2` |
| `sort` | Sort order | `?sort=created_desc` |

### 26.2 Navigation State Persistence

```typescript
// Zustand store for navigation state
interface NavigationState {
  lastWorkspace: string | null;
  lastProject: string | null;
  builderStates: Record<string, BuilderState>;
  expandedFolders: string[];
}
```

---

## 27. Error Routes

| Route | Component | Trigger |
|-------|-----------|---------|
| `/404` | NotFoundPage | Unknown route |
| `/403` | ForbiddenPage | Access denied |
| `/500` | ErrorPage | Server error |
| `/maintenance` | MaintenancePage | Scheduled maintenance |
| `/offline` | OfflinePage | No connection |

---

## 28. API Route Mapping

For each frontend route, the corresponding API endpoints:

| Frontend Route Pattern | Primary API Endpoints |
|------------------------|----------------------|
| `/builders/module/:id` | `GET /agents/:id/config`, `SSE /agui` |
| `/builders/chatbot/:id` | `GET /agents/:id/config`, `SSE /agui` |
| `/builders/voice/:id` | `GET /agents/:id/config`, `SSE /agui` |
| `/builders/canvas/:id` | `GET /agents/:id/config`, `SSE /agui`, `POST /api/v1/a2ui/*` |
| `/knowledge/*` | `GET/POST /knowledge/*` |
| `/marketplace/mcp/*` | `GET /mcp/*`, `GET/POST /api/v1/mcp/registry/*` |
| `/hitl/*` | `GET/POST /api/v1/hitl/*` |
| `/collab/*` | `WebSocket /api/v1/collab/*` (Yjs) |

---

_Last Updated: 2026-01-26_
