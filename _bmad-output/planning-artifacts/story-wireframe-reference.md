# Story-to-Wireframe Reference Matrix

**Purpose:** Comprehensive lookup table mapping every UI story to its wireframe sources
**Last Updated:** 2026-01-27

> **CRITICAL FOR DEVELOPMENT:** Before implementing ANY story listed below, you MUST:
> 1. Open the wireframe HTML at `_bmad-output/planning-artifacts/Stitch Hyyve/{folder}/code.html`
> 2. Extract exact Tailwind classes, dimensions, and design tokens
> 3. Match the implementation pixel-perfect to the wireframe

---

## Quick Reference Format

```
Story ID | Wireframe Folder(s) | Screen ID(s) | Route Path
```

---

## Phase 0: Infrastructure & Foundation

### Epic E0.1: Project Foundation (No Wireframes - Backend Infrastructure)

Stories 0.1.1 - 0.1.23 are backend infrastructure stories with no wireframe requirements.

---

### Epic E0.2: Frontend Foundation & Design System

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **0.2.1** | ALL (design tokens) | - | - | - |
| **0.2.2** | ALL (component styles) | - | - | - |
| **0.2.3** | `hyyve_home_dashboard`, `hyyve_module_builder`, `hyyve_login_page`, `chatbot_builder_main` | - | Layouts | - |
| **0.2.4** | `hyyve_module_builder` (lines 83-129) | - | Navigation | - |
| **0.2.5** | `hyyve_module_builder` (lines 346-427) | - | Chat panel | Bond |
| **0.2.6** | `hyyve_module_builder` (lines 207-343) | - | Canvas | - |
| **0.2.7** | - | - | Mock provider | - |
| **0.2.8** | `hyyve_login_page`, `hyyve_registration_-_step_1` | 1.1.1, 1.1.2 | `/auth/login`, `/auth/register` | - |
| **0.2.9** | `hyyve_home_dashboard`, `project_browser_&_folders` | 1.5.1, 1.5.2 | `/dashboard`, `/workspaces/:wid/projects` | Bond |
| **0.2.10** | `user_profile_&_preferences`, `account_&_security_settings_1`, `api_keys_management`, `workspace_settings_dashboard` | 1.10.1, 1.10.2, 1.10.3, 1.10.4 | `/settings/*` | - |
| **0.2.11** | `hyyve_module_builder` | 1.2.1 | `/builders/module/:id` | **Bond** |
| **0.2.12** | `chatbot_builder_main` | 1.3.1 | `/builders/chatbot/:id` | **Wendy** |
| **0.2.13** | `knowledge_base_dashboard`, `source_upload_modal`, `rag_pipeline_config` | 1.4.1, 1.4.2, 1.4.4 | `/knowledge/*` | - |
| **0.2.14** | `observability_dashboard`, `execution_detail_view` | 1.8.1, 1.8.2 | `/observability/*` | - |
| **0.2.15** | ALL (Storybook) | - | - | - |
| **0.2.16** | UX Spec 18.1, 18.6 | - | Light theme | - |
| **0.2.17** | UX Spec 22.16 | - | Theme toggle | - |

---

## Phase 1: Foundation

### Epic E1.1: User Authentication & Identity

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **1.1.1** | `hyyve_registration_-_step_1` | 1.1.2 | `/auth/register` | - |
| **1.1.2** | `hyyve_registration_-_step_1` | 1.1.2 | `/auth/register` | - |
| **1.1.3** | `hyyve_registration_-_step_2`, `hyyve_registration_-_step_3` | 1.1.2, 1.1.3 | `/auth/register/org`, `/auth/register/personalize` | - |
| **1.1.4** | `hyyve_login_page` | 1.1.1 | `/auth/login` | - |
| **1.1.5** | - | - | - | - |
| **1.1.6** | `hyyve_login_page` | 1.1.1 | `/auth/login` | - |
| **1.1.7** | `mfa_method_selection` | 1.1.5 | `/auth/mfa-setup` | - |
| **1.1.8** | `mfa_authenticator_setup` | 1.1.6 | `/auth/mfa-setup/authenticator` | - |
| **1.1.9** | `mfa_backup_codes` | 1.1.7 | `/auth/mfa-setup/backup` | - |
| **1.1.10** | `mfa_method_selection`, `account_&_security_settings_2` | 1.1.5, 1.10.2 | `/auth/mfa-setup`, `/settings/account` | - |
| **1.1.11** | `hyyve_login_page` | 1.1.1 | `/auth/login` | - |
| **1.1.12** | `enterprise_sso_configuration` | 4.4.1 | `/admin/sso` | - |
| **1.1.13** | `enterprise_sso_configuration` | 4.4.1 | `/admin/sso` | - |
| **1.1.14** | `team_&_permissions_management`, `org_hierarchy_manager` | 4.4.2, 4.8.1 | `/admin/teams`, `/admin/organizations` | - |

---

### Epic E1.2: API Key Management

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **1.2.1** | `api_keys_management`, `api_key_management_page` | 1.10.3, 6.1.1 | `/settings/api-keys`, `/developer/api-keys` | - |
| **1.2.2** | `api_keys_management` | 1.10.3 | `/settings/api-keys` | - |
| **1.2.3** | `api_rate_limiting_settings` | 1.10.3 | `/settings/api-keys/rate-limits` | - |
| **1.2.4** | `api_keys_management` | 1.10.3 | `/settings/api-keys` | - |
| **1.2.5** | `api_keys_management` | 1.10.3 | `/settings/api-keys` | - |
| **1.2.6** | `api_keys_management` | 1.10.3 | `/settings/api-keys` | - |
| **1.2.7** | `api_keys_management` | 1.10.3 | `/settings/api-keys` | - |
| **1.2.8** | `api_keys_management` | 1.10.3 | `/settings/api-keys` | - |
| **1.2.9** | `api_keys_management` | 1.10.3 | `/settings/api-keys` | - |
| **1.2.10** | `api_keys_management` | 1.10.3 | `/settings/api-keys` | - |

---

### Epic E1.3: Workspace & Project Management

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **1.3.1** | `hyyve_home_dashboard`, `workspace_settings_dashboard` | 1.5.1, 1.10.4 | `/dashboard`, `/settings/workspace` | - |
| **1.3.2** | `project_browser_&_folders` | 1.5.2 | `/workspaces/:wid/projects` | - |
| **1.3.3** | `team_&_permissions_management`, `share_permissions_modal` | 4.4.2, 5.1.2 | `/admin/teams`, `/collab/:type/:id/share` | - |
| **1.3.4** | `organization_tenant_switcher` | 2.13.1 | `/tenant-switcher` | - |
| **1.3.5** | `project_browser_&_folders` | 1.5.2 | `/workspaces/:wid/projects` | - |
| **1.3.6** | `project_browser_&_folders` | 1.5.2 | `/workspaces/:wid/projects` | - |
| **1.3.7** | `project_browser_&_folders` | 1.5.2 | `/workspaces/:wid/projects` | - |
| **1.3.8** | `tenant_isolation_settings` | 2.13.2 | `/admin/tenant-isolation` | - |
| **1.3.9** | `security_oversight_dashboard` | 4.7.1 | `/admin/security` | - |
| **1.3.10** | `workspace_settings_dashboard` | 1.10.4 | `/settings/workspace` | - |
| **1.3.11** | `share_permissions_modal` | 5.1.2 | `/collab/:type/:id/share` | - |
| **1.3.12** | `platform_tenant_registry` | 4.8.3 | `/admin/tenants` | - |
| **1.3.13** | `onboarding_wizard`, `contextual_help_panel`, `learning_center_dashboard` | 1.9.1, 1.9.2, 1.9.3 | `/onboarding`, `/help`, `/learn` | Bond |

---

### Epic E1.4: Module Builder - Core Canvas

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **1.4.1** | `hyyve_module_builder` | 1.2.1 | `/builders/module/:id` | **Bond** |
| **1.4.2** | `hyyve_module_builder` | 1.2.1 | `/builders/module/:id` | Bond |
| **1.4.3** | `hyyve_module_builder` | 1.2.1 | `/builders/module/:id` | Bond |
| **1.4.4** | `hyyve_module_builder` | 1.2.1 | `/builders/module/:id` | Bond |
| **1.4.5** | `hyyve_module_builder` | 1.2.1 | `/builders/module/:id` | Bond |
| **1.4.6** | `module_export_wizard_-_step_1`, `generated_code_viewer` | 1.2.4, 1.2.6 | `/builders/module/:id/export` | Bond |
| **1.4.7** | `hyyve_module_builder` | 1.2.1 | `/builders/module/:id` | Bond |
| **1.4.8** | `workflow_execution_monitor` | 1.2.3 | `/builders/module/:id/executions` | Bond |
| **1.4.9** | `node_configuration_panel` | 1.2.2 | `/builders/module/:id/nodes/:nid` | Bond |

---

### Epic E1.5: Module Builder - Node Types

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **1.5.1** | `llm_advanced_config`, `rag_node_config`, `trigger_node_config` | 1.2.2a, 1.2.2b, 1.2.2f | `/builders/module/:id/nodes/:nid/*` | Bond |
| **1.5.2** | `node_configuration_panel` | 1.2.2 | `/builders/module/:id/nodes/:nid` | Bond |
| **1.5.3** | `api_call_node_config`, `code_node_config` | 1.2.2d, 1.2.2e | `/builders/module/:id/nodes/:nid/*` | Bond |
| **1.5.4** | `mcp_tool_node_selector`, `mcp_parameter_binding` | 2.1.4, 2.1.5 | `/builders/module/:id/tools/*` | Bond |
| **1.5.5** | `branch_node_config` | 1.2.2c | `/builders/module/:id/nodes/:nid/branch` | Bond |
| **1.5.6** | `node_configuration_panel` | 1.2.2 | `/builders/module/:id/nodes/:nid` | Bond |
| **1.5.7** | `node_configuration_panel` | 1.2.2 | `/builders/module/:id/nodes/:nid` | Bond |
| **1.5.8** | `hyyve_module_builder` | 1.2.1 | `/builders/module/:id` | Bond |

---

### Epic E1.6: Conversational Building

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **1.6.1** | `hyyve_module_builder` (chat panel) | 1.2.1 | `/builders/module/:id` | **Bond** |
| **1.6.2** | `hyyve_module_builder` (chat panel) | 1.2.1 | `/builders/module/:id` | Bond |
| **1.6.3** | `hyyve_module_builder` (chat panel) | 1.2.1 | `/builders/module/:id` | Bond |
| **1.6.4** | `hyyve_module_builder` (chat panel) | 1.2.1 | `/builders/module/:id` | Bond |
| **1.6.5** | `hyyve_module_builder` (chat panel) | 1.2.1 | `/builders/module/:id` | Bond |
| **1.6.6** | `hyyve_module_builder` (chat panel) | 1.2.1 | `/builders/module/:id` | Bond |
| **1.6.7** | `hyyve_module_builder` (chat panel) | 1.2.1 | `/builders/module/:id` | Bond |

---

### Epic E1.7: Chatbot Builder - Core Editor

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **1.7.1** | `chatbot_builder_main`, `widget_customization`, `widget_preview_&_testing` | 1.3.1, 1.3.3, 1.3.6 | `/builders/chatbot/:id/*` | **Wendy** |
| **1.7.2** | `conversation_flow_designer` | 1.3.4 | `/builders/chatbot/:id/flows` | Wendy |
| **1.7.3** | `conversation_flow_designer` | 1.3.4 | `/builders/chatbot/:id/flows` | Wendy |
| **1.7.4** | `conversation_flow_designer` | 1.3.4 | `/builders/chatbot/:id/flows` | Wendy |
| **1.7.5** | `response_template_editor` | 1.3.5 | `/builders/chatbot/:id/templates` | Wendy |
| **1.7.6** | `mcp_tool_node_selector` | 2.1.4 | `/builders/chatbot/:id/tools` | Wendy |
| **1.7.7** | `skill_detail_specification_modal` | 3.1.4 | `/marketplace/skills/:id` | Wendy |
| **1.7.8** | `conversation_flow_designer` | 1.3.4 | `/builders/chatbot/:id/flows` | Wendy |

---

### Epic E1.8: Chatbot Builder - NLU & Policies

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **1.8.1** | `intent_training_modal` | 1.3.2 | `/builders/chatbot/:id/intents` | Wendy |
| **1.8.2** | `conversation_flow_designer` | 1.3.4 | `/builders/chatbot/:id/flows` | Wendy |
| **1.8.3** | `chatbot_builder_main` | 1.3.1 | `/builders/chatbot/:id` | Wendy |
| **1.8.4** | `chatbot_analytics_dashboard` | 1.3.7 | `/builders/chatbot/:id/analytics` | - |
| **1.8.5** | `intent_training_modal`, `response_template_editor` | 1.3.2, 1.3.5 | `/builders/chatbot/:id/*` | Wendy |
| **1.8.6** | `conversation_flow_designer` | 1.3.4 | `/builders/chatbot/:id/flows` | Wendy |
| **1.8.7** | `handoff_rules_configuration` | 1.3.4 | `/builders/chatbot/:id/handoff` | Wendy |

---

### Epic E1.9: Knowledge Base - Document Ingestion

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **1.9.1** | `knowledge_base_dashboard` | 1.4.1 | `/workspaces/:wid/projects/:pid/knowledge` | - |
| **1.9.2** | `source_upload_modal` | 1.4.2 | `/knowledge/sources/new` | - |
| **1.9.3** | `source_upload_modal` | 1.4.3 | `/knowledge/sources/new` (URL input) | - |

---

### Epic E1.10: Knowledge Base - Search & Retrieval

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **1.10.1** | `chunking_strategy_config` | 1.4.6 | `/knowledge/config/chunking` | - |
| **1.10.2** | `embedding_model_config` | 1.4.5 | `/knowledge/config/embedding` | - |
| **1.10.3** | `rag_pipeline_config` | 1.4.4 | `/knowledge/config` | - |
| **1.10.4** | `kb_query_testing`, `mcp_server_specification_view` | 1.4.3, 1.4.7 | `/knowledge/query` | - |
| **1.10.5** | `embedding_model_config` | 1.4.5 | `/knowledge/config/embedding` | - |
| **1.10.6** | `rag_pipeline_config` | 1.4.4 | `/knowledge/config` | - |

---

### Epic E1.11: Knowledge Base - Advanced Retrieval

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **1.11.1** | `mcp_server_specification_view` | 1.4.7 | `/knowledge/config/query` | - |
| **1.11.2** | `mcp_server_specification_view` | 1.4.7 | `/knowledge/config/query` | - |
| **1.11.3** | - | 1.4.8 | - | - |
| **1.11.4** | `knowledge_base_dashboard` | 1.4.1 | `/knowledge` | - |
| **1.11.5** | `api_keys_management` | 1.10.3 | `/settings/api-keys` | - |

---

### Epic E1.12: Agent Execution Runtime

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **1.12.1** | `workflow_execution_monitor` | 1.6.1 | `/builders/module/:id/executions` | - |
| **1.12.2** | `hyyve_module_builder` | 1.6.2 | `/builders/module/:id` | Bond |
| **1.12.3** | `workflow_execution_monitor` | 1.6.3 | `/builders/module/:id/executions` | - |
| **1.12.4** | `workflow_execution_monitor` | 1.6.1 | `/builders/module/:id/executions` | - |
| **1.12.5** | `workflow_execution_monitor` | 1.6.4 | `/builders/module/:id/executions` | - |
| **1.12.6** | `workflow_execution_monitor` | 1.6.5 | `/builders/module/:id/executions` | - |
| **1.12.7** | `workflow_execution_monitor` | 1.6.6 | `/builders/module/:id/executions` | - |

---

### Epic E1.13: Execution Triggers

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **1.13.1** | `trigger_node_config` | 1.6.7 | `/builders/module/:id/nodes/:nid/trigger` | Bond |
| **1.13.2** | `webhook_configuration`, `webhook_configuration_dashboard`, `webhook_delivery_logs_dashboard` | 1.6.8, 2.11.1, 2.11.2 | `/webhooks/*` | - |
| **1.13.3** | - | 1.6.1 | - | - |
| **1.13.4** | - | 1.6.1 | - | - |

---

### Epic E1.14: Sandbox Execution

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **1.14.1** | - | 1.6.9 | - | - |
| **1.14.2** | `response_template_editor` | 1.3.5 | `/builders/chatbot/:id/templates` | Wendy |

---

### Epic E1.15: Execution Traces & Observability

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **1.15.1** | `observability_dashboard`, `execution_detail_view` | 1.7.1, 1.8.2 | `/observability/*` | - |
| **1.15.2** | `observability_dashboard` | 1.7.2 | `/observability` | - |
| **1.15.3** | `observability_dashboard` | 1.7.3 | `/observability` | - |
| **1.15.4** | `execution_history_viewer` | 1.7.5, 4.6.2 | `/observability/export`, `/admin/support/executions` | - |

---

### Epic E1.16: Budget Alerts & Cost Tracking

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **1.16.1** | `observability_dashboard` | 1.7.4 | `/observability` | - |
| **1.16.2** | `user_profile_&_preferences` | 1.10.1 | `/settings/profile` | - |
| **1.16.3** | `billing_&_usage_dashboard` | 1.10.2 | `/settings/billing` | - |
| **1.16.4** | `command_center_overview` | 1.10.3 | `/command-center` | - |

---

### Epic E1.17: Human-in-the-Loop (HITL)

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **1.17.1** | `hyyve_module_builder` | 1.8.1 | `/builders/module/:id` | Bond |
| **1.17.2** | `hitl_review_queue` | 1.8.2 | `/hitl` | - |
| **1.17.3** | `hitl_review_queue` | 1.8.3 | `/hitl` | - |
| **1.17.4** | `review_interface_(decision_support)` | 1.8.4 | `/hitl/reviews/:id` | - |
| **1.17.5** | `hitl_review_queue` | 1.8.2 | `/hitl` | - |
| **1.17.6** | `alert_rule_configuration` | 1.8.5 | `/builders/voice/:id/alerts` | - |

---

## Phase 2: Builder Suite

### Epic E2.1: Voice Agent - Core Editor

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **2.1.1** | `voice_builder_workspace` | 2.2.1 | `/builders/voice/:id` | **Morgan** |
| **2.1.2** | `voice_builder_workspace` | 2.2.1 | `/builders/voice/:id` | Morgan |
| **2.1.3** | `voice_builder_workspace` | 2.2.1 | `/builders/voice/:id` | Morgan |
| **2.1.4** | `voice_builder_workspace` | 2.2.1 | `/builders/voice/:id` | Morgan |
| **2.1.5** | `mcp_tool_node_selector` | 2.1.4 | `/builders/voice/:id/tools` | Morgan |

---

### Epic E2.2: Voice Agent - Speech Processing

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **2.2.1** | `advanced_voice_settings` | 2.2.4 | `/builders/voice/:id/config/advanced` | Morgan |
| **2.2.2** | `advanced_voice_settings` | 2.2.4 | `/builders/voice/:id/config/advanced` | Morgan |
| **2.2.3** | `advanced_voice_settings` | 2.2.4 | `/builders/voice/:id/config/advanced` | Morgan |
| **2.2.4** | `advanced_voice_settings` | 2.2.4 | `/builders/voice/:id/config/advanced` | Morgan |
| **2.2.5** | `alert_rule_configuration` | 2.2.4 | `/builders/voice/:id/alerts` | Morgan |
| **2.2.6** | `voice_configuration_panel` | 2.2.2 | `/builders/voice/:id/config` | Morgan |
| **2.2.7** | `voice_configuration_panel` | 2.2.2 | `/builders/voice/:id/config` | Morgan |
| **2.2.8** | `live_call_monitor`, `voice_analytics_dashboard`, `call_recording_playback` | 2.2.3, 2.2.5, 2.2.6 | `/builders/voice/:id/calls/*`, `/builders/voice/:id/analytics` | Morgan |

---

### Epic E2.3: Voice Agent - Telephony Integration

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **2.3.1** | `handoff_rules_configuration` | 2.2.3 | `/builders/voice/:id/handoff` | Morgan |
| **2.3.2** | `voice_builder_workspace` | 2.2.1 | `/builders/voice/:id` | Morgan |

---

### Epic E2.4: Canvas Builder - Core Editor

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **2.4.1** | `canvas_builder_workspace`, `ai_ui_generator_canvas`, `component_inspector_panel` | 2.1.1, 2.1.2 | `/builders/canvas/:id/*` | **Artie** |
| **2.4.2** | `canvas_builder_workspace` | 2.1.1 | `/builders/canvas/:id` | Artie |
| **2.4.3** | `canvas_builder_workspace` | 2.1.1 | `/builders/canvas/:id` | Artie |
| **2.4.4** | `canvas_builder_workspace` (chat panel) | 2.1.1 | `/builders/canvas/:id` | Artie |
| **2.4.5** | `batch_processing_queue` | 2.1.8 | `/builders/canvas/:id/batch` | Artie |
| **2.4.6** | `canvas_builder_workspace` | 2.1.1 | `/builders/canvas/:id` | Artie |

---

### Epic E2.5: Canvas Builder - Generation & Enhancement Nodes

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **2.5.1** | `ai_generation_modal` | 2.1.3 | `/builders/canvas/:id/generate` | Artie |
| **2.5.2** | `ai_generation_modal` | 2.1.3 | `/builders/canvas/:id/generate` | Artie |
| **2.5.3** | `mcp_tool_node_selector` | 2.1.4 | `/builders/canvas/:id/tools` | Artie |
| **2.5.4** | `canvas_asset_library` | 2.1.7 | `/builders/canvas/:id/assets` | Artie |
| **2.5.5** | `cost_estimation_panel` | 2.1.9 | `/builders/canvas/:id/costs` | Artie |
| **2.5.6** | `batch_processing_queue` | 2.1.8 | `/builders/canvas/:id/batch` | - |

---

### Epic E2.6: Canvas Builder - Brand RAG & Providers

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **2.6.1** | `canvas_builder_workspace` | 2.1.1 | `/builders/canvas/:id` | Artie |
| **2.6.2** | `canvas_builder_workspace` | 2.1.1 | `/builders/canvas/:id` | Artie |
| **2.6.3** | `ai_generation_modal` | 2.1.3 | `/builders/canvas/:id/generate` | Artie |
| **2.6.4** | `component_library_browser` | 2.14.5 | `/components` | - |

---

### Epic E2.7: Cross-Builder Integration

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **2.7.1** | `response_template_editor` | 1.3.5 | `/builders/chatbot/:id/templates` | - |
| **2.7.2** | - | 1.5.5 | - | - |
| **2.7.3** | `canvas_builder_workspace` | 2.1.1 | `/builders/canvas/:id` | Artie |
| **2.7.4** | `knowledge_base_dashboard` | 1.4.1 | `/knowledge` | - |
| **2.7.5** | - | 1.6.1 | - | - |
| **2.7.6** | - | 1.6.1 | - | - |

---

### Epic E2.8: MCP Server Installation

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **2.8.1** | `mcp_server_registry_browser` | 3.2.1 | `/marketplace/mcp` | - |
| **2.8.2** | `mcp_server_registry_browser` | 3.2.1 | `/marketplace/mcp` | - |
| **2.8.3** | `mcp_server_registry_browser` | 3.2.2 | `/marketplace/mcp` | - |
| **2.8.4** | `mcp_server_registry_browser` | 3.2.2 | `/marketplace/mcp` | - |
| **2.8.5** | `mcp_server_specification_view` | 3.2.2 | `/marketplace/mcp/:id` | - |
| **2.8.6** | `mcp_server_install_wizard`, `mcp_tool_node_selector` | 3.2.3, 2.1.4 | `/marketplace/mcp/:id/install`, `/builders/module/:id/tools` | Bond |
| **2.8.7** | `mcp_parameter_binding` | 2.1.5 | `/builders/module/:id/tools/:tid/params` | Bond |
| **2.8.8** | `mcp_server_install_wizard` | 3.2.5 | `/marketplace/mcp/:id/install` | - |
| **2.8.9** | `mcp_tool_consent_dialog` | 2.1.6 | `/builders/canvas/:id/tools/:tid/consent` | Artie |

---

### Epic E2.9: MCP Registry Aggregation

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **2.9.1** | `mcp_server_registry_browser` | 3.2.1 | `/marketplace/mcp` | - |
| **2.9.2** | `mcp_server_registry_browser` | 3.2.1 | `/marketplace/mcp` | - |
| **2.9.3** | `mcp_server_usage_dashboard` | 3.2.4 | `/marketplace/mcp/usage` | - |

---

### Epic E2.10: Skills Installation

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **2.10.1** | `skills_directory_browser` | 3.4.1 | `/marketplace/skills` | - |
| **2.10.2** | `skills_directory_browser` | 3.4.2 | `/marketplace/skills` | - |
| **2.10.3** | `skills_directory_browser` | 3.4.1 | `/marketplace/skills` | - |
| **2.10.4** | `skills_directory_browser` | 3.4.1 | `/marketplace/skills` | - |
| **2.10.5** | `skill_detail_specification_modal` | 3.4.3 | `/marketplace/skills/:id` | - |
| **2.10.6** | `skill_detail_specification_modal` | 3.4.4 | `/marketplace/skills/:id` | - |
| **2.10.7** | `chatbot_builder_main`, `intent_training_modal` | 1.3.1, 1.3.2 | `/builders/chatbot/:id/*` | Wendy |
| **2.10.8** | `skill_detail_specification_modal` | 3.4.5 | `/marketplace/skills/:id` | - |
| **2.10.9** | `workflow_execution_monitor` | 1.6.1 | `/builders/module/:id/executions` | - |

---

### Epic E2.11: Skills Creation & Publishing

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **2.11.1** | `skill_detail_specification_modal` | 3.4.6 | `/marketplace/skills/:id` | - |
| **2.11.2** | `marketplace_listing_editor` | 3.4.7 | `/creator/listings/:id` | - |
| **2.11.3** | `mcp_server_pricing_configuration` | 3.4.8 | `/creator/skills/:id/pricing` | - |
| **2.11.4** | `skill_detail_specification_modal` | 3.4.9 | `/marketplace/skills/:id` | - |

---

### Epic E2.12: UI Generation

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **2.12.1** | `ai_ui_generator_canvas`, `test_suite_manager_dashboard`, `test_case_builder_interface`, `test_results_&_coverage_report` | 2.14.1, 2.8.1, 2.8.2, 2.8.3 | `/builders/ui/:id`, `/testing/*` | Artie |
| **2.12.2** | `drag_&_drop_form_builder` | 2.14.2 | `/builders/ui/:id/forms/:fid` | Artie |
| **2.12.3** | `template_customization_wizard` | 2.12.3 | `/templates/:id/customize` | - |
| **2.12.4** | `theme_customizer_interface` | 2.14.3 | `/builders/ui/:id/theme` | - |
| **2.12.5** | `component_embed_configuration` | 2.14.4 | `/builders/ui/:id/embed` | - |
| **2.12.6** | `component_embed_configuration` | 2.14.4 | `/builders/ui/:id/embed` | - |
| **2.12.7** | `component_library_browser` | 2.14.5 | `/components` | - |
| **2.12.8** | `api_endpoint_manager_dashboard` | 2.10.1 | `/api-management` | - |

---

### Epic E2.13: Customer Interaction - Chat Deployment

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **2.13.1** | `chatwoot_deployment_-_step_1`, `chatwoot_inbox_&_behavior_config` | 2.6.1, 2.6.2 | `/integrations/chatwoot/*` | Wendy |
| **2.13.2** | `chatwoot_inbox_&_behavior_config` | 2.6.2 | `/integrations/chatwoot/inboxes` | Wendy |
| **2.13.3** | - | 1.9.3 | - | - |
| **2.13.4** | `chatwoot_inbox_&_behavior_config` | 1.9.4 | `/integrations/chatwoot/inboxes` | Wendy |
| **2.13.5** | `chatwoot_inbox_&_behavior_config` | 1.9.5 | `/integrations/chatwoot/inboxes` | Wendy |
| **2.13.6** | `chatwoot_inbox_&_behavior_config` | 1.9.6 | `/integrations/chatwoot/inboxes` | Wendy |
| **2.13.7** | `chatbot_analytics_dashboard` | 1.3.7, 1.9.3 | `/builders/chatbot/:id/analytics` | - |
| **2.13.8** | `chatwoot_widget_&_deploy_final` | 1.9.7, 2.6.4 | `/integrations/chatwoot/widget` | - |
| **2.13.9** | `chatwoot_inbox_&_behavior_config` | 1.9.2 | `/integrations/chatwoot/inboxes` | - |
| **2.13.10** | `chatwoot_inbox_&_behavior_config` | 1.9.8 | `/integrations/chatwoot/inboxes` | - |

---

## Phase 3: Marketplace

### Epic E3.1: Module Marketplace - Browse & Search

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **3.1.1** | `marketplace_home_library`, `workflow_templates_browser`, `template_library_browser` | 3.1.1, 3.5.1, 2.12.1 | `/marketplace`, `/marketplace/templates`, `/templates` | - |
| **3.1.2** | `marketplace_item_detail_view`, `marketplace_reviews_management_dashboard` | 3.1.2, 3.5.4 | `/marketplace/items/:id`, `/creator/reviews` | - |

---

### Epic E3.2: Module Marketplace - Installation

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **3.2.1** | `marketplace_item_detail_view`, `template_workflow_preview` | 3.1.6, 2.12.2 | `/marketplace/items/:id`, `/templates/:id` | - |
| **3.2.2** | `marketplace_item_detail_view` | 3.1.7 | `/marketplace/items/:id` | - |
| **3.2.3** | `template_customization_wizard` | 3.1.11 | `/templates/:id/customize` | - |

---

### Epic E3.3: Module Publishing

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **3.3.1** | `marketplace_listing_editor` | 3.1.1 | `/creator/listings/:id` | - |
| **3.3.2** | `marketplace_listing_editor` | 3.1.3 | `/creator/listings/:id` | - |

---

### Epic E3.4: Module Pricing & Revenue

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **3.4.1** | `marketplace_listing_editor` | 3.1.2 | `/creator/listings/:id` | - |
| **3.4.2** | `creator_revenue_share_explainer` | 3.1.8, 3.3.4 | `/creator/revenue` | - |
| **3.4.3** | `marketplace_listing_editor` | 3.1.10 | `/creator/listings/:id` | - |
| **3.4.4** | `creator_payout_dashboard` | 3.1.8, 3.3.5 | `/creator/payouts` | - |

---

### Epic E3.5: Creator Analytics

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **3.5.1** | `creator_marketplace_dashboard`, `creator_payout_dashboard`, `creator_payout_settings_modal` | 3.3.1, 3.3.5, 3.3.6 | `/creator`, `/creator/payouts/*` | - |
| **3.5.2** | `marketplace_bundle_creator_interface`, `onboarding_wizard_builder_interface` | 3.5.2, 3.5.3 | `/creator/bundles/new`, `/creator/wizards/:id` | - |

---

### Epic E3.6: MCP Server Publishing

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **3.6.1** | `marketplace_listing_editor` | 3.3.1 | `/creator/listings/:id` | - |
| **3.6.2** | `mcp_server_pricing_configuration` | 3.3.2, 3.3.3 | `/creator/mcp/:id/pricing` | - |

---

### Epic E3.7: Billing - Subscription Plans

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **3.7.1** | `hyyve_pricing_plans` | 1.6.1 | `/pricing` | - |
| **3.7.2** | `billing_&_usage_dashboard` | 1.10.7 | `/settings/billing` | - |
| **3.7.3** | `billing_&_usage_dashboard` | 1.10.8 | `/settings/billing` | - |
| **3.7.4** | `billing_&_usage_dashboard` | 1.10.1 | `/settings/billing` | - |

---

### Epic E3.8: Billing - Usage Management

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **3.8.1** | `billing_&_usage_dashboard` | 1.10.5 | `/settings/billing` | - |
| **3.8.2** | `billing_&_usage_dashboard` | 1.10.5 | `/settings/billing` | - |
| **3.8.3** | `billing_&_usage_dashboard` | 1.10.6 | `/settings/billing` | - |

---

### Epic E3.9: Platform Command Center

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **3.9.1** | `command_center_overview` | 4.1.1, 2.3.1 | `/command-center` | - |
| **3.9.2** | `support_console_account_lookup` | 4.1.2, 4.6.1 | `/admin/support/users` | - |
| **3.9.3** | `rate_limiting_control_center` | 4.1.3 | `/admin/rate-limits` | - |
| **3.9.4** | `command_center_overview` | 4.1.4 | `/command-center` | - |
| **3.9.5** | `audit_log_event_viewer` | 4.1.5, 4.7.3 | `/admin/audit-logs` | - |

---

## Phase 4: Enterprise

### Epic E4.1: Security Guardrails

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **4.1.1** | `security_oversight_dashboard` | 4.3.4, 4.7.1 | `/admin/security` | - |
| **4.1.2** | `security_oversight_dashboard` | 4.3.4 | `/admin/security` | - |
| **4.1.3** | `security_oversight_dashboard` | 4.3.5 | `/admin/security` | - |
| **4.1.4** | - | 1.4.8 | - | - |

---

### Epic E4.2: Enterprise Security Hardening

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **4.2.1** | `security_oversight_dashboard` | 4.3.6 | `/admin/security` | - |
| **4.2.2** | `rate_limiting_control_center`, `integration_health_dashboard` | 4.3.7, 4.6.3, 4.8.4 | `/admin/rate-limits`, `/admin/integrations/health` | - |
| **4.2.3** | `rate_limiting_control_center` | 4.3.7 | `/admin/rate-limits` | - |
| **4.2.4** | `voice_builder_workspace` | 1.5.7 | `/builders/voice/:id` | Morgan |

---

### Epic E4.3: SOC 2 & Compliance

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **4.3.1** | `compliance_&_certifications_hub` | 4.3.1, 4.7.2 | `/admin/compliance` | - |
| **4.3.2** | `compliance_&_certifications_hub` | 4.3.2 | `/admin/compliance` | - |
| **4.3.3** | `data_residency_settings` | 4.3.3, 4.7.4 | `/admin/data-residency` | - |

---

### Epic E4.4: White-Label - Sub-Accounts

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **4.4.1** | `agency_management_portal_dashboard`, `agency_client_onboarding_wizard`, `sub-account_management_dashboard`, `org_hierarchy_manager`, `platform_tenant_registry`, `notification_center_hub` | 4.1.1, 4.1.5, 4.1.7, 4.8.1, 4.8.3, 4.9.1 | `/agency/*`, `/admin/organizations`, `/admin/tenants` | - |
| **4.4.2** | `agency_client_workspace_detail_view`, `team_&_permissions_management`, `rbac_permission_editor` | 4.1.2, 4.4.2, 4.8.2 | `/agency/clients/:id`, `/admin/teams`, `/admin/rbac` | - |
| **4.4.3** | `agency_billing_management_dashboard` | 4.2.3 | `/agency/billing` | - |
| **4.4.4** | `integration_hub` | 4.9.4, 4.2.4 | `/settings/integrations` | - |

---

### Epic E4.5: White-Label - Branding

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **4.5.1** | `custom_domain_configuration` | 4.2.5, 4.1.4 | `/agency/domains` | - |
| **4.5.2** | `white-label_branding_wizard` | 4.2.6, 4.1.3 | `/agency/branding` | - |
| **4.5.3** | `white-label_branding_wizard` | 4.2.7 | `/agency/branding` | - |
| **4.5.4** | `enterprise_sso_configuration` | 4.2.8 | `/admin/sso` | - |

---

### Epic E4.6: Self-Hosted - Docker Deployment

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **4.6.1** | `self-hosted_setup_wizard` | 4.4.1, 6.3.1 | `/self-hosted/setup` | - |
| **4.6.2** | `self-hosted_setup_wizard` | 4.4.3 | `/self-hosted/setup` | - |
| **4.6.3** | `self-hosted_setup_wizard` | 4.4.3 | `/self-hosted/setup` | - |

---

### Epic E4.7: Self-Hosted - Kubernetes

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **4.7.1** | `self-hosted_setup_wizard` | 4.4.2 | `/self-hosted/setup` | - |
| **4.7.2** | `self-hosted_setup_wizard` | 4.4.4 | `/self-hosted/setup` | - |
| **4.7.3** | `self-hosted_setup_wizard` | 4.4.5 | `/self-hosted/setup` | - |
| **4.7.4** | `enterprise_sso_configuration` | 4.4.6 | `/admin/sso` | - |
| **4.7.5** | `self-hosted_setup_wizard` | 4.4.7 | `/self-hosted/setup` | - |

---

## Phase 5: Collaboration

### Epic E5.1: Real-Time Collaboration

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **5.1.1** | `collaborative_editor`, `real-time_sync_panel` | 5.1.1, 5.1.3 | `/collab/:type/:id/*` | - |
| **5.1.2** | `share_permissions_modal` | 5.1.2 | `/collab/:type/:id/share` | - |

---

### Epic E5.2: Comments & Discussion

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **5.2.1** | `collaborative_editor` | 5.1.3 | `/collab/:type/:id` | - |

---

### Epic E5.3: Version History & Rollback

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **5.3.1** | `version_history_timeline` | 5.2.1 | `/collab/:type/:id/versions` | - |
| **5.3.2** | `version_history_timeline` | 5.2.3 | `/collab/:type/:id/versions` | - |

---

### Epic E5.4: Visual Diffs

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **5.4.1** | `workflow_diff_viewer` | 5.2.2 | `/collab/:type/:id/versions/:vid/diff` | - |

---

### Epic E5.5: A/B Testing

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **5.5.1** | `environment_manager_dashboard` | 5.2.4 | `/environments` | - |

---

### Epic E5.6: Promotion Pipelines & Feature Flags

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **5.6.1** | `environment_manager_dashboard`, `version_rollout_manager`, `deployment_health_dashboard`, `environment_configuration_settings` | 2.7.1, 2.7.2, 2.7.3, 2.7.4 | `/environments/*` | - |
| **5.6.2** | `environment_manager_dashboard` | 5.2.6 | `/environments` | - |

---

## Phase 6: Future

### Epic E6.1: SDK Export - Claude Agent SDK

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **6.1.1** | `module_export_wizard_-_step_1`, `framework_selection_configuration`, `generated_code_viewer`, `export_config_&_download_final` | 1.2.4, 1.2.5, 1.2.6, 2.9.2 | `/builders/module/:id/export/*` | - |

---

### Epic E6.2: SDK Export - Agno Framework

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **6.2.1** | `module_export_wizard_-_step_1` | 2.3.2 | `/builders/module/:id/export` | - |

---

### Epic E6.3: SDK Export - LangGraph/CrewAI

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **6.3.1** | `module_export_wizard_-_step_1` | 2.3.3 | `/builders/module/:id/export` | - |
| **6.3.2** | `module_export_wizard_-_step_1` | 2.3.4 | `/builders/module/:id/export` | - |

---

### Epic E6.4: API Endpoints

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **6.4.1** | `developer_portal_home`, `api_documentation_browser`, `api_testing_playground`, `api_endpoint_manager_dashboard` | 6.2.1, 6.2.2, 6.2.4, 2.10.1 | `/developer/*`, `/api-management` | - |
| **6.4.2** | `developer_portal_home` | 2.3.5 | `/developer` | - |
| **6.4.3** | `developer_portal_home` | 2.3.6 | `/developer` | - |
| **6.4.4** | `developer_portal_home` | 2.3.5 | `/developer` | - |

---

### Epic E6.5: Mobile SDKs

| Story | Wireframe Folder | Screen ID | Route Path | Agent |
|-------|-----------------|-----------|------------|-------|
| **6.5.1** | `sdk_downloads_&_quickstart`, `mobile_app_dashboard` | 6.2.3, 6.5.1 | `/developer/sdks`, `/m/dashboard` | - |
| **6.5.2** | `api_keys_management` | 1.10.9 | `/settings/api-keys` | - |

---

## Summary Statistics

| Phase | Total Stories | Stories with Wireframes | Coverage |
|-------|---------------|------------------------|----------|
| Phase 0 | 40 | 17 (E0.2 only) | 43% (E0.1 is backend-only) |
| Phase 1 | ~90 | ~85 | 94% |
| Phase 2 | ~70 | ~70 | 100% |
| Phase 3 | ~25 | ~25 | 100% |
| Phase 4 | ~30 | ~30 | 100% |
| Phase 5 | ~12 | ~12 | 100% |
| Phase 6 | ~12 | ~12 | 100% |

**Total Wireframes:** 146
**Total UI Stories:** ~250
**Wireframe Coverage:** 100% (all UI screens mapped)

---

## Usage Instructions

### When Starting a UI Story:

1. **Find your story** in the table above
2. **Note the wireframe folder(s)** - these are in `_bmad-output/planning-artifacts/Stitch Hyyve/`
3. **Open the HTML file** at `Stitch Hyyve/{folder}/code.html`
4. **Extract**:
   - Tailwind classes (copy exactly)
   - Dimensions (h-16, w-72, etc.)
   - Colors (must match design tokens)
   - Component structure
5. **Implement** matching the wireframe pixel-perfect
6. **Verify** against the Visual Fidelity Checklist in wireframe-implementation-map.md

### Design Token Quick Reference

```css
--color-primary: #5048e5
--color-primary-dark: #3e38b3
--color-background-dark: #131221
--color-panel-dark: #1c1a2e
--color-canvas-dark: #0f1115
--color-border-dark: #272546
--color-text-secondary: #9795c6
```

### Agent Assignment Quick Reference

| Builder | Agent | Color Accent |
|---------|-------|--------------|
| Module Builder | **Bond** | Purple (#5048e5) |
| Chatbot Builder | **Wendy** | Teal (#14b8a6) |
| Voice Builder | **Morgan** | Blue (#3b82f6) |
| Canvas Builder | **Artie** | Orange (#f97316) |

---

_This document is auto-generated from wireframe-implementation-map.md and epics.md_
_Last Updated: 2026-01-27_
