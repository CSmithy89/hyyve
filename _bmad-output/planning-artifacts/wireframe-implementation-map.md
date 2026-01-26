# Hyyve Wireframe Implementation Map

**Purpose:** Comprehensive mapping of 146 Stitch wireframes to routes, epics, and stories
**Ensures:** Every wireframe is implemented exactly as designed with correct routing
**Last Updated:** 2026-01-26

---

## How to Use This Document

1. **Find your wireframe** in the table below
2. **Check the route** - this is the Next.js App Router path
3. **Find the epic/story** - this tells you when it gets implemented
4. **Open the HTML** - `_bmad-output/planning-artifacts/Stitch Hyyve/{folder}/code.html`

---

## Implementation Status Legend

| Status | Meaning |
|--------|---------|
| **E0.2** | Covered in Epic 0.2 (Frontend Foundation) - Build shell with mock data |
| **E1.x** | Phase 1 Foundation - Full implementation with backend |
| **E2.x** | Phase 2 Builder Suite |
| **E3.x** | Phase 3 Marketplace |
| **E4.x** | Phase 4 Enterprise |
| **E5.x** | Phase 5 Collaboration |
| **E6.x** | Phase 6 Future |

---

## Complete Wireframe Mapping (146 Screens)

### Authentication & Onboarding (9 screens)

| Wireframe Folder | Route Path | Screen ID | Epic | Story | Agent |
|------------------|------------|-----------|------|-------|-------|
| `hyyve_login_page` | `/auth/login` | 1.1.1 | E0.2, E1.1 | 0.2.8, 1.1.4 | - |
| `hyyve_registration_-_step_1` | `/auth/register` | 1.1.2 | E0.2, E1.1 | 0.2.8, 1.1.1 | - |
| `hyyve_registration_-_step_2` | `/auth/register/org` | 1.1.2 | E1.1 | 1.1.3 | - |
| `hyyve_registration_-_step_3` | `/auth/register/personalize` | 1.1.3 | E1.1 | 1.1.3 | - |
| `mfa_method_selection` | `/auth/mfa-setup` | 1.1.5 | E1.1 | 1.1.7 | - |
| `mfa_authenticator_setup` | `/auth/mfa-setup/authenticator` | 1.1.6 | E1.1 | 1.1.8 | - |
| `mfa_backup_codes` | `/auth/mfa-setup/backup` | 1.1.7 | E1.1 | 1.1.9 | - |
| `onboarding_wizard` | `/onboarding` | 1.9.1 | E1.3 | 1.3.13 | Bond |
| `learning_center_dashboard` | `/learn` | 1.9.3 | E1.3 | 1.3.13 | - |

### Dashboard & Navigation (5 screens)

| Wireframe Folder | Route Path | Screen ID | Epic | Story | Agent |
|------------------|------------|-----------|------|-------|-------|
| `hyyve_home_dashboard` | `/dashboard` | 1.5.1 | E0.2, E1.3 | 0.2.9, 1.3.13 | Bond |
| `project_browser_&_folders` | `/workspaces/:wid/projects` | 1.5.2 | E0.2, E1.3 | 0.2.9, 1.3.2 | - |
| `hyyve_pricing_plans` | `/pricing` | 1.6.1 | E3.7 | 3.7.1 | - |
| `contextual_help_panel` | `/help` (overlay) | 1.9.2 | E1.3 | 1.3.13 | Bond |
| `notification_center_hub` | `/notifications` | 4.9.1 | E4.4 | 4.4.1 | - |

### Module Builder (15 screens)

| Wireframe Folder | Route Path | Screen ID | Epic | Story | Agent |
|------------------|------------|-----------|------|-------|-------|
| `hyyve_module_builder` | `/builders/module/:id` | 1.2.1 | E0.2, E1.4 | 0.2.11, 1.4.1 | **Bond** |
| `node_configuration_panel` | `/builders/module/:id/nodes/:nid` | 1.2.2 | E1.4 | 1.4.9 | Bond |
| `llm_advanced_config` | `/builders/module/:id/nodes/:nid/llm` | 1.2.2a | E1.5 | 1.5.1 | Bond |
| `rag_node_config` | `/builders/module/:id/nodes/:nid/rag` | 1.2.2b | E1.5 | 1.5.1 | Bond |
| `branch_node_config` | `/builders/module/:id/nodes/:nid/branch` | 1.2.2c | E1.5 | 1.5.5 | Bond |
| `api_call_node_config` | `/builders/module/:id/nodes/:nid/api` | 1.2.2d | E1.5 | 1.5.3 | Bond |
| `code_node_config` | `/builders/module/:id/nodes/:nid/code` | 1.2.2e | E1.5 | 1.5.3 | Bond |
| `trigger_node_config` | `/builders/module/:id/nodes/:nid/trigger` | 1.2.2f | E1.5 | 1.5.1 | Bond |
| `workflow_execution_monitor` | `/builders/module/:id/executions` | 1.2.3 | E1.12 | 1.12.3 | Bond |
| `execution_detail_view` | `/builders/module/:id/executions/:runId` | 1.2.3 | E1.15 | 1.15.1 | - |
| `module_export_wizard_-_step_1` | `/builders/module/:id/export` | 1.2.4 | E6.1 | 6.1.1 | - |
| `framework_selection_configuration` | `/builders/module/:id/export/config` | 1.2.5 | E6.1 | 6.1.1 | - |
| `generated_code_viewer` | `/builders/module/:id/export/viewer` | 1.2.6 | E6.1 | 6.1.1 | - |
| `mcp_tool_node_selector` | `/builders/module/:id/tools` | 2.1.4 | E2.8 | 2.8.6 | Bond |
| `mcp_parameter_binding` | `/builders/module/:id/tools/:tid/params` | 2.1.5 | E2.8 | 2.8.7 | Bond |

### Chatbot Builder (10 screens)

| Wireframe Folder | Route Path | Screen ID | Epic | Story | Agent |
|------------------|------------|-----------|------|-------|-------|
| `chatbot_builder_main` | `/builders/chatbot/:id` | 1.3.1 | E0.2, E1.7 | 0.2.12, 1.7.1 | **Wendy** |
| `intent_training_modal` | `/builders/chatbot/:id/intents` | 1.3.2 | E1.8 | 1.8.1 | Wendy |
| `widget_customization` | `/builders/chatbot/:id/widget` | 1.3.3 | E1.7 | 1.7.1 | Wendy |
| `conversation_flow_designer` | `/builders/chatbot/:id/flows` | 1.3.4 | E1.7 | 1.7.2 | Wendy |
| `response_template_editor` | `/builders/chatbot/:id/templates` | 1.3.5 | E1.7 | 1.7.5 | Wendy |
| `widget_preview_&_testing` | `/builders/chatbot/:id/preview` | 1.3.6 | E1.7 | 1.7.1 | Wendy |
| `chatbot_analytics_dashboard` | `/builders/chatbot/:id/analytics` | 1.3.7 | E2.13 | 2.13.7 | - |
| `handoff_rules_configuration` | `/builders/chatbot/:id/handoff` | 1.3.4 | E1.8 | 1.8.7 | Wendy |
| `chatwoot_deployment_-_step_1` | `/integrations/chatwoot/deploy` | 2.6.1 | E2.13 | 2.13.1 | Wendy |
| `chatwoot_inbox_&_behavior_config` | `/integrations/chatwoot/inboxes` | 2.6.2 | E2.13 | 2.13.1 | Wendy |

### Knowledge Base (8 screens)

| Wireframe Folder | Route Path | Screen ID | Epic | Story | Agent |
|------------------|------------|-----------|------|-------|-------|
| `knowledge_base_dashboard` | `/workspaces/:wid/projects/:pid/knowledge` | 1.4.1 | E0.2, E1.9 | 0.2.13, 1.9.1 | - |
| `source_upload_modal` | `/knowledge/sources/new` | 1.4.2 | E1.9 | 1.9.2 | - |
| `kb_query_testing` | `/knowledge/query` | 1.4.3 | E1.10 | 1.10.4 | - |
| `rag_pipeline_config` | `/knowledge/config` | 1.4.4 | E1.10 | 1.10.1 | - |
| `embedding_model_config` | `/knowledge/config/embedding` | 1.4.5 | E1.10 | 1.10.2 | - |
| `chunking_strategy_config` | `/knowledge/config/chunking` | 1.4.6 | E1.10 | 1.10.1 | - |
| `mcp_server_specification_view` | `/knowledge/config/query` | 1.4.7 | E1.10 | 1.10.4 | - |
| `chatwoot_widget_&_deploy_final` | `/integrations/chatwoot/widget` | 2.6.4 | E2.13 | 2.13.8 | - |

### Voice Builder (8 screens)

| Wireframe Folder | Route Path | Screen ID | Epic | Story | Agent |
|------------------|------------|-----------|------|-------|-------|
| `voice_builder_workspace` | `/builders/voice/:id` | 2.2.1 | E2.1 | 2.1.1 | **Morgan** |
| `voice_configuration_panel` | `/builders/voice/:id/config` | 2.2.2 | E2.2 | 2.2.7 | Morgan |
| `live_call_monitor` | `/builders/voice/:id/calls/:callId` | 2.2.3 | E2.2 | 2.2.8 | Morgan |
| `advanced_voice_settings` | `/builders/voice/:id/config/advanced` | 2.2.4 | E2.2 | 2.2.1 | Morgan |
| `voice_analytics_dashboard` | `/builders/voice/:id/analytics` | 2.2.5 | E2.2 | 2.2.8 | - |
| `call_recording_playback` | `/builders/voice/:id/recordings/:rid` | 2.2.6 | E2.2 | 2.2.8 | - |
| `alert_rule_configuration` | `/builders/voice/:id/alerts` | 2.2.4 | E2.2 | 2.2.5 | - |
| `handoff_rules_configuration` | `/builders/voice/:id/handoff` | 2.2.3 | E2.3 | 2.3.1 | Morgan |

### Canvas Builder (10 screens)

| Wireframe Folder | Route Path | Screen ID | Epic | Story | Agent |
|------------------|------------|-----------|------|-------|-------|
| `canvas_builder_workspace` | `/builders/canvas/:id` | 2.1.1 | E2.4 | 2.4.1 | **Artie** |
| `ai_ui_generator_canvas` | `/builders/canvas/:id` | 2.1.1 | E2.4 | 2.4.1 | Artie |
| `component_inspector_panel` | `/builders/canvas/:id/components/:cid` | 2.1.2 | E2.4 | 2.4.1 | Artie |
| `ai_generation_modal` | `/builders/canvas/:id/generate` | 2.1.3 | E2.5 | 2.5.1 | Artie |
| `mcp_tool_consent_dialog` | `/builders/canvas/:id/tools/:tid/consent` | 2.1.6 | E2.8 | 2.8.9 | Artie |
| `canvas_asset_library` | `/builders/canvas/:id/assets` | 2.1.7 | E2.5 | 2.5.4 | Artie |
| `batch_processing_queue` | `/builders/canvas/:id/batch` | 2.1.8 | E2.5 | 2.5.6 | - |
| `cost_estimation_panel` | `/builders/canvas/:id/costs` | 2.1.9 | E2.5 | 2.5.5 | - |
| `component_library_browser` | `/components` | 2.14.5 | E2.12 | 2.12.7 | - |
| `drag_&_drop_form_builder` | `/builders/ui/:id/forms/:fid` | 2.14.2 | E2.12 | 2.12.2 | Artie |

### MCP & Skills Marketplace (14 screens)

| Wireframe Folder | Route Path | Screen ID | Epic | Story | Agent |
|------------------|------------|-----------|------|-------|-------|
| `marketplace_home_library` | `/marketplace` | 3.1.1 | E3.1 | 3.1.1 | - |
| `marketplace_item_detail_view` | `/marketplace/items/:id` | 3.1.2 | E3.1 | 3.1.2 | - |
| `skills_directory_browser` | `/marketplace/skills` | 3.1.3 | E2.10 | 2.10.1 | - |
| `skill_detail_specification_modal` | `/marketplace/skills/:id` | 3.1.4 | E2.10 | 2.10.5 | - |
| `mcp_server_registry_browser` | `/marketplace/mcp` | 3.2.1 | E2.8 | 2.8.1 | - |
| `mcp_server_specification_view` | `/marketplace/mcp/:id` | 3.2.2 | E2.8 | 2.8.5 | - |
| `mcp_server_install_wizard` | `/marketplace/mcp/:id/install` | 3.2.3 | E2.8 | 2.8.6 | - |
| `mcp_server_usage_dashboard` | `/marketplace/mcp/usage` | 3.2.4 | E2.9 | 2.9.3 | - |
| `creator_marketplace_dashboard` | `/creator` | 3.3.1 | E3.5 | 3.5.1 | - |
| `marketplace_listing_editor` | `/creator/listings/:id` | 3.3.2 | E3.3 | 3.3.1 | - |
| `mcp_server_pricing_configuration` | `/creator/mcp/:id/pricing` | 3.3.3 | E3.6 | 3.6.2 | - |
| `creator_revenue_share_explainer` | `/creator/revenue` | 3.3.4 | E3.4 | 3.4.2 | - |
| `creator_payout_dashboard` | `/creator/payouts` | 3.3.5 | E3.5 | 3.5.1 | - |
| `creator_payout_settings_modal` | `/creator/payouts/settings` | 3.3.6 | E3.5 | 3.5.1 | - |

### Templates & Bundles (6 screens)

| Wireframe Folder | Route Path | Screen ID | Epic | Story | Agent |
|------------------|------------|-----------|------|-------|-------|
| `workflow_templates_browser` | `/marketplace/templates` | 3.5.1 | E3.1 | 3.1.1 | - |
| `marketplace_bundle_creator_interface` | `/creator/bundles/new` | 3.5.2 | E3.5 | 3.5.2 | - |
| `onboarding_wizard_builder_interface` | `/creator/wizards/:id` | 3.5.3 | E3.5 | 3.5.2 | - |
| `marketplace_reviews_management_dashboard` | `/creator/reviews` | 3.5.4 | E3.1 | 3.1.2 | - |
| `template_library_browser` | `/templates` | 2.12.1 | E3.1 | 3.1.1 | - |
| `template_workflow_preview` | `/templates/:id` | 2.12.2 | E3.2 | 3.2.1 | - |

### Settings (10 screens)

| Wireframe Folder | Route Path | Screen ID | Epic | Story | Agent |
|------------------|------------|-----------|------|-------|-------|
| `user_profile_&_preferences` | `/settings/profile` | 1.10.1 | E0.2 | 0.2.10 | - |
| `account_&_security_settings_1` | `/settings/account` | 1.10.2 | E0.2, E1.1 | 0.2.10, 1.1.7 | - |
| `account_&_security_settings_2` | `/settings/account` | 1.10.2 | E1.1 | 1.1.8 | - |
| `api_keys_management` | `/settings/api-keys` | 1.10.3 | E0.2, E1.2 | 0.2.10, 1.2.1 | - |
| `api_key_management_page` | `/settings/api-keys` | 1.10.3 | E1.2 | 1.2.6 | - |
| `api_keys_&_providers` | `/settings/api-keys/providers` | 1.10.3 | E1.2 | 1.2.2 | - |
| `workspace_settings_dashboard` | `/settings/workspace` | 1.10.4 | E0.2, E1.3 | 0.2.10, 1.3.10 | - |
| `billing_&_usage_dashboard` | `/settings/billing` | 1.6.2 | E3.7 | 3.7.2 | - |
| `api_rate_limiting_settings` | `/settings/api-keys/rate-limits` | 1.10.3 | E1.2 | 1.2.3 | - |
| `integration_hub` | `/settings/integrations` | 4.9.4 | E4.4 | 4.4.4 | - |

### Observability & Monitoring (8 screens)

| Wireframe Folder | Route Path | Screen ID | Epic | Story | Agent |
|------------------|------------|-----------|------|-------|-------|
| `observability_dashboard` | `/observability` | 1.8.1 | E0.2, E1.15 | 0.2.14, 1.15.1 | - |
| `execution_detail_view` | `/observability/executions/:id` | 1.8.2 | E1.15 | 1.15.1 | - |
| `command_center_overview` | `/command-center` | 2.3.1 | E3.9 | 3.9.1 | - |
| `hitl_review_queue` | `/hitl` | 2.4.1 | E1.17 | 1.17.3 | - |
| `review_interface_(decision_support)` | `/hitl/reviews/:id` | 2.4.2 | E1.17 | 1.17.4 | - |
| `test_suite_manager_dashboard` | `/testing/suites` | 2.8.1 | E2.12 | 2.12.1 | - |
| `test_case_builder_interface` | `/testing/suites/:id/cases/new` | 2.8.2 | E2.12 | 2.12.1 | - |
| `test_results_&_coverage_report` | `/testing/results` | 2.8.3 | E2.12 | 2.12.1 | - |

### Deployment & Environment (10 screens)

| Wireframe Folder | Route Path | Screen ID | Epic | Story | Agent |
|------------------|------------|-----------|------|-------|-------|
| `environment_manager_dashboard` | `/environments` | 2.7.1 | E5.6 | 5.6.1 | - |
| `version_rollout_manager` | `/environments/:id/rollout` | 2.7.2 | E5.6 | 5.6.1 | - |
| `deployment_health_dashboard` | `/environments/health` | 2.7.3 | E5.6 | 5.6.1 | - |
| `environment_configuration_settings` | `/environments/:id/config` | 2.7.4 | E5.6 | 5.6.1 | - |
| `webhook_configuration` | `/webhooks` | 2.11.1 | E1.13 | 1.13.2 | - |
| `webhook_configuration_dashboard` | `/webhooks` | 2.11.1 | E1.13 | 1.13.2 | - |
| `webhook_delivery_logs_dashboard` | `/webhooks/logs` | 2.11.2 | E1.13 | 1.13.2 | - |
| `api_endpoint_manager_dashboard` | `/api-management` | 2.10.1 | E6.4 | 6.4.1 | - |
| `api_testing_playground` | `/developer/playground` | 6.2.4 | E6.4 | 6.4.1 | - |
| `export_config_&_download_final` | `/export/config` | 2.9.2 | E6.1 | 6.1.1 | - |

### UI Generation (6 screens)

| Wireframe Folder | Route Path | Screen ID | Epic | Story | Agent |
|------------------|------------|-----------|------|-------|-------|
| `ai_ui_generator_canvas` | `/builders/ui/:id` | 2.14.1 | E2.12 | 2.12.1 | Artie |
| `drag_&_drop_form_builder` | `/builders/ui/:id/forms/:fid` | 2.14.2 | E2.12 | 2.12.2 | Artie |
| `theme_customizer_interface` | `/builders/ui/:id/theme` | 2.14.3 | E2.12 | 2.12.4 | - |
| `component_embed_configuration` | `/builders/ui/:id/embed` | 2.14.4 | E2.12 | 2.12.5 | - |
| `template_customization_wizard` | `/templates/:id/customize` | 2.12.3 | E3.2 | 3.2.3 | - |
| `component_library_browser` | `/components` | 2.14.5 | E2.12 | 2.12.7 | - |

### Agency & Enterprise (16 screens)

| Wireframe Folder | Route Path | Screen ID | Epic | Story | Agent |
|------------------|------------|-----------|------|-------|-------|
| `agency_management_portal_dashboard` | `/agency` | 4.1.1 | E4.4 | 4.4.1 | - |
| `agency_client_workspace_detail_view` | `/agency/clients/:id` | 4.1.2 | E4.4 | 4.4.2 | - |
| `white-label_branding_wizard` | `/agency/branding` | 4.1.3 | E4.5 | 4.5.2 | - |
| `custom_domain_configuration` | `/agency/domains` | 4.1.4 | E4.5 | 4.5.1 | - |
| `agency_client_onboarding_wizard` | `/agency/clients/:id/onboard` | 4.1.5 | E4.4 | 4.4.1 | - |
| `agency_billing_management_dashboard` | `/agency/billing` | 4.1.6 | E4.4 | 4.4.3 | - |
| `sub-account_management_dashboard` | `/agency/sub-accounts` | 4.1.7 | E4.4 | 4.4.1 | - |
| `enterprise_sso_configuration` | `/admin/sso` | 4.4.1 | E1.1 | 1.1.12 | - |
| `team_&_permissions_management` | `/admin/teams` | 4.4.2 | E1.3 | 1.3.3 | - |
| `support_console_account_lookup` | `/admin/support/users` | 4.6.1 | E3.9 | 3.9.2 | - |
| `execution_history_viewer` | `/admin/support/executions` | 4.6.2 | E1.15 | 1.15.4 | - |
| `integration_health_dashboard` | `/admin/integrations/health` | 4.6.3 | E4.2 | 4.2.2 | - |
| `security_oversight_dashboard` | `/admin/security` | 4.7.1 | E4.1 | 4.1.1 | - |
| `compliance_&_certifications_hub` | `/admin/compliance` | 4.7.2 | E4.3 | 4.3.1 | - |
| `audit_log_event_viewer` | `/admin/audit-logs` | 4.7.3 | E3.9 | 3.9.5 | - |
| `data_residency_settings` | `/admin/data-residency` | 4.7.4 | E4.3 | 4.3.3 | - |

### Platform Admin (4 screens)

| Wireframe Folder | Route Path | Screen ID | Epic | Story | Agent |
|------------------|------------|-----------|------|-------|-------|
| `org_hierarchy_manager` | `/admin/organizations` | 4.8.1 | E4.4 | 4.4.1 | - |
| `rbac_permission_editor` | `/admin/rbac` | 4.8.2 | E4.4 | 4.4.2 | - |
| `platform_tenant_registry` | `/admin/tenants` | 4.8.3 | E4.4 | 4.4.1 | - |
| `rate_limiting_control_center` | `/admin/rate-limits` | 4.8.4 | E4.2 | 4.2.2 | - |

### Collaboration (5 screens)

| Wireframe Folder | Route Path | Screen ID | Epic | Story | Agent |
|------------------|------------|-----------|------|-------|-------|
| `collaborative_editor` | `/collab/:type/:id` | 5.1.1 | E5.1 | 5.1.1 | - |
| `share_permissions_modal` | `/collab/:type/:id/share` | 5.1.2 | E5.1 | 5.1.2 | - |
| `real-time_sync_panel` | `/collab/:type/:id/sync` | 5.1.3 | E5.1 | 5.1.1 | - |
| `version_history_timeline` | `/collab/:type/:id/versions` | 5.2.1 | E5.3 | 5.3.1 | - |
| `workflow_diff_viewer` | `/collab/:type/:id/versions/:vid/diff` | 5.2.2 | E5.4 | 5.4.1 | - |

### Developer Portal (5 screens)

| Wireframe Folder | Route Path | Screen ID | Epic | Story | Agent |
|------------------|------------|-----------|------|-------|-------|
| `api_key_management_page` | `/developer/api-keys` | 6.1.1 | E1.2 | 1.2.1 | - |
| `developer_portal_home` | `/developer` | 6.2.1 | E6.4 | 6.4.1 | - |
| `api_documentation_browser` | `/developer/docs` | 6.2.2 | E6.4 | 6.4.1 | - |
| `sdk_downloads_&_quickstart` | `/developer/sdks` | 6.2.3 | E6.5 | 6.5.1 | - |
| `self-hosted_setup_wizard` | `/self-hosted/setup` | 6.3.1 | E4.6 | 4.6.1 | - |

### Mobile & Tenant (3 screens)

| Wireframe Folder | Route Path | Screen ID | Epic | Story | Agent |
|------------------|------------|-----------|------|-------|-------|
| `mobile_app_dashboard` | `/m/dashboard` | 6.5.1 | E6.5 | 6.5.1 | - |
| `organization_tenant_switcher` | `/tenant-switcher` | 2.13.1 | E1.3 | 1.3.4 | - |
| `tenant_isolation_settings` | `/admin/tenant-isolation` | 2.13.2 | E1.3 | 1.3.8 | - |

---

## Implementation Priority by Epic

### Epic 0.2: Frontend Foundation (15 stories, ~29 screens)
**Purpose:** Build UI shells with mock data for parallel development

| Story | Screens Covered | Primary Wireframes |
|-------|-----------------|-------------------|
| 0.2.8 | Auth pages | `hyyve_login_page`, `hyyve_registration_-_step_1` |
| 0.2.9 | Dashboard | `hyyve_home_dashboard`, `project_browser_&_folders` |
| 0.2.10 | Settings | `user_profile_*`, `account_*`, `api_keys_*`, `workspace_*` |
| 0.2.11 | Module Builder | `hyyve_module_builder`, `node_configuration_panel` |
| 0.2.12 | Chatbot Builder | `chatbot_builder_main`, `conversation_flow_designer` |
| 0.2.13 | Knowledge Base | `knowledge_base_dashboard`, `rag_pipeline_config` |
| 0.2.14 | Observability | `observability_dashboard`, `execution_detail_view` |

### Remaining Screens by Phase

| Phase | Epics | Remaining Screens | Key Wireframes |
|-------|-------|-------------------|----------------|
| Phase 1 | E1.1-E1.17 | ~45 screens | MFA, Workspace, KB config, HITL |
| Phase 2 | E2.1-E2.13 | ~40 screens | Voice, Canvas, MCP, Chat deploy |
| Phase 3 | E3.1-E3.9 | ~18 screens | Marketplace, Creator, Billing |
| Phase 4 | E4.1-E4.7 | ~20 screens | Agency, Enterprise, Security |
| Phase 5 | E5.1-E5.6 | ~5 screens | Collab, Versions, Diffs |
| Phase 6 | E6.1-E6.5 | ~8 screens | Developer portal, Mobile, Self-hosted |

---

## Visual Fidelity Checklist

When implementing each wireframe, ensure:

### 1. Design Token Match
```typescript
// Extract from wireframe <script> tag
// Verify these match tailwind.config.ts
colors: {
  "primary": "#5048e5",         // Button backgrounds, active states
  "primary-dark": "#3e38b3",    // Hover states
  "background-dark": "#131221", // Page backgrounds
  "panel-dark": "#1c1a2e",      // Sidebars, cards
  "canvas-dark": "#0f1115",     // Builder canvas
  "border-dark": "#272546",     // All borders
  "text-secondary": "#9795c6"   // Muted text
}
```

### 2. Layout Dimensions
```css
/* From wireframes - verify these match */
header { height: 64px; /* h-16 */ }
.sidebar { width: 288px; /* w-72 */ }
.chat-panel { width: 320px; /* w-80 */ }
```

### 3. Component Classes
```html
<!-- Copy exact Tailwind classes from wireframe -->
<button class="group flex items-center justify-center gap-2 rounded-lg h-9 px-4 bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-all shadow-[0_0_15px_rgba(80,72,229,0.3)]">
```

### 4. Icon Consistency
```html
<!-- Wireframes use Material Symbols Outlined -->
<span class="material-symbols-outlined text-[20px]">play_arrow</span>
<!-- Convert to lucide-react or keep Material Symbols -->
```

---

## Routing Connection Pattern

### Next.js App Router Structure

```
apps/web/app/
├── (auth)/
│   ├── sign-in/[[...sign-in]]/page.tsx    → hyyve_login_page
│   ├── sign-up/[[...sign-up]]/page.tsx    → hyyve_registration_*
│   └── mfa-setup/page.tsx                  → mfa_*
├── (app)/
│   ├── dashboard/page.tsx                  → hyyve_home_dashboard
│   ├── workspaces/[wid]/
│   │   └── projects/page.tsx               → project_browser_&_folders
│   ├── builders/
│   │   ├── module/[id]/page.tsx            → hyyve_module_builder
│   │   ├── chatbot/[id]/page.tsx           → chatbot_builder_main
│   │   ├── voice/[id]/page.tsx             → voice_builder_workspace
│   │   └── canvas/[id]/page.tsx            → canvas_builder_workspace
│   ├── knowledge/page.tsx                  → knowledge_base_dashboard
│   ├── marketplace/page.tsx                → marketplace_home_library
│   ├── settings/
│   │   ├── profile/page.tsx                → user_profile_&_preferences
│   │   ├── account/page.tsx                → account_&_security_settings_*
│   │   └── billing/page.tsx                → billing_&_usage_dashboard
│   └── observability/page.tsx              → observability_dashboard
├── (admin)/
│   ├── agency/page.tsx                     → agency_management_portal_dashboard
│   └── admin/[...slug]/page.tsx            → various admin screens
└── (developer)/
    └── developer/page.tsx                  → developer_portal_home
```

---

_This document ensures 100% wireframe coverage with exact route mapping_
_Last Updated: 2026-01-26_
