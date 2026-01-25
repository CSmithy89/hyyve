# Google Stitch Prompts - Group 13

**Project:** Hyyve Platform
**Group:** 13 of 15
**Screens:** 121-130 (Security + RBAC + Notifications)
**Design System:** Refer to Group 01 for complete design tokens

---

## Screen 121: Security Dashboard (4.7.1)

### Stitch Prompt

```
Create a security dashboard with dark theme (#0F172A background).

**Layout:**
- Header with "Security Dashboard" title and Export Report/Settings buttons
- Security Score section with progress bar and category breakdown
- Security Alerts section with actionable items
- Authentication Overview table
- Recent Security Events timeline
- Footer actions: View Audit Log, Settings, Run Scan

**Security Score Section:**
- "Security Score: 94/100" header with "Last Scan: 2h ago"
- bg-slate-800 rounded-xl p-6 container
- Large progress bar showing 94% filled (green to amber gradient)
- Category status row with checkmarks:
  - "✅ Authentication"
  - "✅ Authorization"
  - "✅ Encryption"
  - "✅ API Security"
  - "⚠️ 2 Warnings" (amber)
  - "✅ Compliance"

**Security Alerts Section:**
- "Security Alerts (2 Active)" header
- bg-slate-800 rounded-lg p-4 container
- Alert cards:

**HIGH Alert:**
- "⚠️ HIGH: Unused API key detected"
- Description: Key hasn't been used in 90 days
- Recommendation text
- Actions: "[Revoke Key]" "[Snooze 7 Days]" "[Dismiss]"
- Red/amber left border

**MEDIUM Alert:**
- "⚠️ MEDIUM: MFA not enabled for admin user"
- User details
- Recommendation text
- Actions: "[Send MFA Reminder]" "[Enforce MFA]" "[Dismiss]"
- Yellow left border

**Authentication Overview Table:**
- "Authentication Overview" header
- bg-slate-800 rounded-lg container
- Table columns: Method | Users | Status | Last Login
- Sample rows:
  - "Email/Password | 45 | ● Active | 5 minutes ago"
  - "Google OAuth | 23 | ● Active | 1 hour ago"
  - "SAML SSO (Okta) | 127 | ● Active | 2 minutes ago"
  - "API Key | 12 | ● Active | 30 seconds ago"

**Recent Security Events:**
- "Recent Security Events" header
- bg-slate-800 rounded-lg p-4 container
- Event list with icons:
  - "🔒 Login from new device - sarah@acme.com - 10m ago"
  - "🔑 API key created - jenkins-ci - 1h ago"
  - "⚠️ Failed login attempt (3x) - unknown@test.com - 2h ago"
  - "🔒 MFA enabled - mike@acme.com - 3h ago"

**Footer Actions:**
- "[View Full Audit Log]" "[Security Settings]" "[Run Full Scan]"
- Horizontal row, left-aligned
```

---

## Screen 122: Compliance Documents (4.7.2)

### Stitch Prompt

```
Create a compliance documents page with dark theme (#0F172A background).

**Layout:**
- Header with "Compliance & Certifications" and settings button
- Compliance Status grid with certification cards
- Available Documents table
- Security Questionnaire section

**Compliance Status Grid:**
- "Compliance Status" header
- bg-slate-800 rounded-xl p-4 container
- Two rows of certification cards (3 per row):

**Row 1:**
- "✅ SOC 2 Type II" - "Certified | Valid: 2026"
- "✅ GDPR" - "Compliant since 2025"
- "🔄 EU AI Act (In Progress)" - "Est. Q2 2026"

**Row 2:**
- "✅ CCPA" - "Compliant"
- "✅ HIPAA Ready (Add-on)" - "Available"
- "⏸️ ISO 27001 (Planned)" - "Est. 2027"

**Card Styling:**
- Each card: bg-slate-700 rounded-lg p-4
- Status icon prominently displayed
- Certification name bold
- Status/validity text below

**Available Documents Table:**
- "Available Documents" header with "[🔍 Search]"
- bg-slate-800 rounded-lg container
- Table columns: Document | Type | Updated | Action
- Sample rows:
  - "SOC 2 Type II Report | PDF | Jan 2026 | [Download]"
  - "GDPR Data Processing Agreement | PDF | Dec 2025 | [Download]"
  - "Security Whitepaper | PDF | Jan 2026 | [Download]"
  - "Penetration Test Summary | PDF | Jan 2026 | [Download]"
  - "Privacy Policy | Link | Jan 2026 | [View]"
  - "Terms of Service | Link | Jan 2026 | [View]"
  - "Sub-Processor List | PDF | Jan 2026 | [Download]"
  - "Data Retention Policy | PDF | Dec 2025 | [Download]"

**Security Questionnaire Section:**
- "Security Questionnaire" header
- bg-slate-800 rounded-lg p-4 container
- Informational text: "Need to complete a vendor security questionnaire?"
- Supported formats: "SIG, CAIQ, VSA, HECVAT, custom formats"
- Response time: "Typical response time: < 24 hours"
- CTA button: "[Request Questionnaire Response]"
```

---

## Screen 123: Audit Log Viewer (4.7.3)

### Stitch Prompt

```
Create an audit log viewer with dark theme (#0F172A background).

**Layout:**
- Header with "Audit Log" and Export/Configure buttons
- Multi-filter bar (time, user, action, resource, search)
- Paginated audit events table
- Selected event detail panel with payload
- Pagination controls

**Filter Bar:**
- "Filters" header
- bg-slate-800 rounded-lg p-3 container
- Filter dropdowns:
  - "Time: [Last 7 days ▼]"
  - "User: [All users ▼]"
  - "Action: [All actions ▼]"
  - "Resource: [All ▼]"
- Search input: "[🔍 Search by event ID, user, or resource...]"

**Audit Events Table:**
- "Audit Events (12,847)" header with "Page 1 of 1285"
- bg-slate-800 rounded-lg container
- Table columns: Timestamp | User | Action | Resource
- Sample rows:
  - "2026-01-25 14:32 | sarah@acme | workflow.run | wf_123"
  - "2026-01-25 14:30 | system | api.call | /v1/exec"
  - "2026-01-25 14:28 | mike@acme | project.edit | proj_456"
  - "2026-01-25 14:25 | sarah@acme | kb.upload | kb_789"
- Action column shows dot notation (workflow.run, api.call, etc.)
- Selectable rows with hover highlight

**Selected Event Detail Panel:**
- "Selected Event: workflow.run - wf_123" header
- bg-slate-800 rounded-lg p-4 container
- Key-value details:
  - Event ID, Timestamp, User (with ID)
  - IP Address, User Agent
  - Action, Resource (with ID)
  - Result: success/failure

**Request Payload Section:**
- "Request Payload:" label
- bg-slate-950 rounded-lg code container
- JSON formatted payload with syntax highlighting
- JetBrains Mono font
- Example showing workflow_id, inputs, environment

**Event Actions:**
- "[View Full Event]" "[Export Event]" "[Create Alert Rule]"

**Pagination:**
- "[← Previous] Page 1 of 1285 [Next →]"
```

---

## Screen 124: Data Residency Configuration (4.7.4)

### Stitch Prompt

```
Create a data residency configuration screen with dark theme (#0F172A background).

**Layout:**
- Header with "Data Residency" and [Enterprise] badge
- Current Data Region info card
- Available Regions selection grid
- Data Residency Policy options
- AI Provider Data Processing disclosure
- Action buttons: Cancel, Save Settings

**Current Data Region Card:**
- "Current Data Region" header
- bg-slate-800 rounded-lg p-4 container
- Globe icon "🌍" with region name: "Primary Region: EU-WEST-1 (Frankfurt)"
- Description: "All customer data is stored and processed exclusively within the European Union."
- "Data Types in Region:" list:
  - User data & credentials
  - Project configurations
  - Knowledge base content
  - Execution logs
  - Conversation history
  - Generated outputs

**Available Regions Grid:**
- "Available Regions" header with "[Enterprise +]" badge
- bg-slate-800 rounded-lg p-4 container
- Two rows of region cards:

**Row 1:**
- "🇺🇸 US-EAST-1 Virginia" - "○ Select"
- "🇪🇺 EU-WEST-1 Frankfurt" - "● Selected CURRENT"
- "🇦🇺 AP-SOUTHEAST Sydney" - "○ Select"

**Row 2:**
- "🇨🇦 CA-CENTRAL Montreal" - "○ Select"
- "🇬🇧 EU-WEST-2 London" - "○ Select"
- "+ More regions coming 2026"

**Card Styling:**
- Flag emoji + region code + city name
- Radio selection indicator
- Current region highlighted with "CURRENT" badge

**Data Residency Policy:**
- "Data Residency Policy" header
- bg-slate-800 rounded-lg p-4 container

**Cross-Border Transfer Options:**
- "Cross-Border Data Transfer" label
- Radio group:
  - "● Disabled (No data leaves selected region)"
  - "○ Enabled with SCCs (Standard Contractual Clauses)"
  - "○ Enabled (Customer accepts transfer risks)"

**AI Provider Data Processing Table:**
- "AI Provider Data Processing" label
- Table: Provider | Region | Data Processed
- Rows:
  - "Anthropic | US | Prompts, Responses"
  - "Deepgram | US | Audio (Voice)"
  - "fal.ai | US | Image prompts"
- Warning note: "⚠️ Note: AI providers may process data outside your selected region. Review provider DPAs for details."
- Link: "[View Provider Data Processing Agreements]"

**Action Buttons:**
- "[Cancel]": outline button
- "[Save Data Residency Settings]": primary button
```

---

## Screen 125: Organization Hierarchy Management (4.8.1)

### Stitch Prompt

```
Create an organization hierarchy management screen with dark theme (#0F172A background).

**Layout:**
- Header with "Organization Hierarchy" and "+ Add Unit"/Settings buttons
- Organization tree view with edit/settings buttons
- Tree visualization showing divisions, offices, teams
- Selected unit detail panel

**Organization Tree:**
- Organization name header with "[Edit]" "[Settings]" actions
- bg-slate-800 rounded-lg p-4 container
- Collapsible tree structure:

**Tree Structure Example:**
```
🏢 Acme Corporation (Root)
├── 🏛️ North America Division
│   ├── 🏬 US Operations
│   │   ├── 👥 Sales Team (12 members)
│   │   ├── 👥 Support Team (8 members)
│   │   └── 👥 Marketing (5 members)
│   └── 🏬 Canada Operations
│       └── 👥 All Teams (15 members)
├── 🏛️ Europe Division
│   ├── 🏬 UK Office
│   │   └── 👥 All Teams (20 members)
│   └── 🏬 Germany Office
│       └── 👥 All Teams (18 members)
└── 🏛️ Asia Pacific Division
    └── 🏬 Singapore Office
        └── 👥 All Teams (10 members)
```

**Tree Icons:**
- 🏢 Root organization
- 🏛️ Division
- 🏬 Business Unit/Office
- 👥 Team

- Summary: "Total: 88 members across 5 offices"
- Expand/collapse controls on each parent node
- Click to select unit

**Selected Unit Detail Panel:**
- "Selected: US Operations" header
- bg-slate-800 rounded-lg p-4 container
- Details:
  - Unit Type: Business Unit
  - Parent: North America Division
  - Members: 25
  - Projects: 12
  - Data Region: US-EAST-1

**Permissions Inheritance:**
- Radio options:
  - "● Inherit from parent (North America Division)"
  - "○ Custom permissions for this unit"

**Unit Actions:**
- "[Edit Unit]" "[Move Unit]" "[Add Sub-Unit]" "[Delete]"
```

---

## Screen 126: RBAC Permission Editor (4.8.2)

### Stitch Prompt

```
Create an RBAC permission editor with dark theme (#0F172A background).

**Layout:**
- Header with "Permissions: [Team Name]" and Save button
- Role selector dropdown
- Permission Matrix table
- Custom Permissions toggles
- Project Scope selector
- Predefined role shortcuts
- Action buttons: Cancel, Save Permissions

**Role Selector:**
- "Role: [Engineering Admin ▼]" dropdown at top

**Permission Matrix:**
- "Permission Matrix" header
- bg-slate-800 rounded-lg container
- Table with checkboxes:
  - Columns: Resource | View | Create | Edit | Delete | Admin
  - Rows for each resource type:
    - Projects ✅ ✅ ✅ ✅ ✅
    - Modules ✅ ✅ ✅ ✅ ✅
    - Chatbots ✅ ✅ ✅ ✅ ✅
    - Voice Agents ✅ ✅ ✅ ⬜ ⬜
    - Canvas ✅ ✅ ✅ ⬜ ⬜
    - Knowledge Bases ✅ ✅ ✅ ⬜ ⬜
    - Deployments ✅ ✅ ✅ ✅ ✅
    - Team Members ✅ ⬜ ⬜ ⬜ ⬜
    - Billing ⬜ ⬜ ⬜ ⬜ ⬜
    - Audit Logs ✅ ⬜ ⬜ ⬜ ⬜
- ✅ = granted (green checkmark)
- ⬜ = not granted (empty box)

**Custom Permissions Section:**
- "Custom Permissions" header
- bg-slate-800 rounded-lg p-4 container
- Checkbox list:
  - "✅ Can deploy to production"
  - "✅ Can view execution logs"
  - "✅ Can create API keys (scoped to projects)"
  - "⬜ Can invite team members"
  - "⬜ Can access billing information"
  - "⬜ Can configure SSO settings"

**Project Scope Section:**
- "Project Scope" header
- bg-slate-800 rounded-lg p-4 container
- Radio options:
  - "● All projects in organization"
  - "○ Specific projects only:"
    - Nested checkboxes for project list

**Predefined Roles:**
- Horizontal button row: "[Viewer]" "[Editor]" "[Admin]" "[Custom]"
- Click to apply preset permissions

**Action Buttons:**
- "[Cancel]": outline button
- "[Save Permissions]": primary button
```

---

## Screen 127: Tenant Registry (Platform Admin) (4.8.3)

### Stitch Prompt

```
Create a platform admin tenant registry with dark theme (#0F172A background).

**Layout:**
- Header with "Tenant Registry" and "+ Add Tenant"/Export buttons
- Filter chips for tenant plans
- Search input
- Paginated tenants table with sort
- Selected tenant detail panel with resource usage
- Platform summary metrics

**Filter Chips:**
- Horizontal row: "[All]" "[Enterprise]" "[Pro]" "[Starter]" "[Trial]" "[Suspended]"
- Active chip: bg-indigo-600
- Search: "[🔍 Search by name, domain, or admin email...]"

**Tenants Table:**
- "Tenants (2,847)" header with "Sort: [MRR ▼]" dropdown
- bg-slate-800 rounded-lg container
- Table columns: Tenant | Plan | MRR | Users | Status
- Sample rows:
  - "Acme Corp | Enterprise | $2,499 | 127 | ● Active"
  - "TechStart Inc | Pro | $199 | 15 | ● Active"
  - "NewCo | Trial | $0 | 3 | ○ Trial"
  - "OldBiz | Pro | $0 | 8 | ⊘ Suspend"
- Status indicators: ● Active, ○ Trial, ⊘ Suspended

**Selected Tenant Panel:**
- "Selected: Acme Corp" header
- bg-slate-800 rounded-lg p-4 container
- "Tenant Details" sub-header
- Two-column key-value table:
  - Tenant ID, Created, Admin, Plan
  - MRR, Users (with limit), Projects
  - Data Region, Database, SSO

**Resource Usage Section:**
- "Resource Usage (This Month)" header
- Progress bars with labels:
  - "Executions: 45,234 |████████████████░░░░| 75% of limit"
  - "Tokens: 12.3M |████████████░░░░░░░░| 62% of limit"
  - "Storage: 2.1 GB |█████░░░░░░░░░░░░░░░| 21% of limit"

**Tenant Actions:**
- "[View Details]" "[Impersonate]" "[Suspend]" "[Delete]"

**Platform Summary Footer:**
- "Platform Summary" row
- "Total MRR: $127,456 | Active Tenants: 2,456 | Churn: 2.3%"
```

---

## Screen 128: Dynamic Rate Limiting Panel (4.8.4)

### Stitch Prompt

```
Create a rate limiting configuration panel with dark theme (#0F172A background).

**Layout:**
- Header with "Rate Limiting" and Save Rules button
- Current Rate Limit Status cards (4 stats)
- Rate Limit Rules table
- Active Overrides list
- Apply Temporary Override form
- Recent Throttle Events log

**Status Cards:**
- 4-column row of stat cards:
  1. "12,847 Req/min" - current request rate
  2. "234 Throttled" - throttled requests
  3. "3 Blocked" - blocked requests
  4. "99.7% Pass Rate" - success rate
- Each card: bg-slate-800 rounded-xl p-4

**Rate Limit Rules Table:**
- "Rate Limit Rules" header with "[+ Add Rule]" button
- bg-slate-800 rounded-lg container
- Table columns: Rule | Scope | Limit | Window
- Sample rows:
  - "Global API | Platform | 10,000/m | 1 minute"
  - "Per-Tenant Default | Tenant | 1,000/m | 1 minute"
  - "Enterprise Override | Tenant | 5,000/m | 1 minute"
  - "Burst Protection | IP | 100/s | 1 second"
  - "Auth Endpoints | Endpoint | 10/m | 1 minute"

**Active Overrides Section:**
- "Active Overrides" header
- bg-slate-800 rounded-lg p-4 container
- Override cards:
  - Tenant name
  - Override limit details
  - Expiration info
  - Actions: "[Edit]" "[Remove Override]" or "[Extend]"

**Temporary Override Form:**
- "Apply Temporary Override" header
- bg-slate-800 rounded-lg p-4 container
- Form fields:
  - "Tenant: [Select tenant... ▼]"
  - "New Limit: [2000] requests per [minute ▼]"
  - "Duration: [24 hours ▼]"
  - "Reason: [Load testing, marketing campaign, etc.]"
- "[Apply Override]" button

**Recent Throttle Events:**
- "Recent Throttle Events" header
- bg-slate-800 rounded-lg container
- Log format: "Time | Tenant/IP | Actual/Limit | Action"
- Sample rows:
  - "14:32:17 | tenant_xyz | 1,234/1,000 | Throttled 234 req"
  - "14:28:12 | ip_blocked | 150/100 | IP blocked 60s"
```

---

## Screen 129: Notification Center (4.9.1)

### Stitch Prompt

```
Create a notification center with dark theme (#0F172A background).

**Layout:**
- Header with "Notification Center" and Settings/Clear buttons
- Filter controls (type, read status, time)
- Notification list grouped by date
- Quick actions toolbar

**Filter Controls:**
- "Filter: [All ▼] [Unread ▼] [Last 7 days ▼] 🔍 Search"
- Horizontal row of filter dropdowns and search

**Notification List:**
- bg-slate-800 rounded-lg container
- Date group headers: "TODAY", "YESTERDAY"
- Notification items with severity indicators:

**Notification Item Structure:**
- Read indicator: ● (unread) or ○ (read)
- Severity icon and color:
  - 🔴 CRITICAL (red)
  - 🟡 WARNING (amber)
  - ✅ SUCCESS (green)
  - 💬 COLLABORATION (blue)
  - 📊 ANALYTICS (purple)
  - 🔔 SYSTEM (gray)
- Title text
- Timestamp (right-aligned)
- Description text
- Action buttons per notification

**Sample Notifications:**
- "● 🔴 CRITICAL - Workflow 'Customer Support' execution failed - 2:34 PM"
  - "Error: RAG retrieval timeout after 30s"
  - Actions: "[View Details]" "[Restart]" "[Mute Similar]"
- "○ 🟡 WARNING - API usage at 85% of monthly limit - 1:15 PM"
  - "1,700/2,000 requests used"
  - Actions: "[View Usage]" "[Upgrade Plan]"
- "○ ✅ SUCCESS - Module 'Lead Qualifier' published successfully - 11:30 AM"
  - Actions: "[View Module]" "[Share]"
- "○ 💬 COLLABORATION - Sarah Chen commented on 'Support Flow' - 10:45 AM"
  - Actions: "[View Comment]" "[Reply]"
- "○ 🔔 SYSTEM - Platform maintenance scheduled - 2:00 PM"
  - Actions: "[Add to Calendar]"

**Quick Actions Toolbar:**
- "Quick Actions" header
- bg-slate-800 rounded-lg p-3 container
- Buttons: "[Mark All Read]" "[Export]" "[Configure Channels]"
```

---

## Screen 130: Alert Configuration (4.9.2)

### Stitch Prompt

```
Create an alert configuration screen with dark theme (#0F172A background).

**Layout:**
- Header with "Alert Configuration" and "+ New Alert" button
- Alert Rules table with status toggles
- Selected alert editor panel
- Quiet Hours configuration

**Alert Rules Table:**
- "Alert Rules" header
- bg-slate-800 rounded-lg container
- Table columns: Rule | Trigger | Channels | Status (●/○)
- Sample rows:
  - "Execution Failed | Any failure | 📧🔔 | ●"
  - "High Latency | > 5s response | 🔔 | ●"
  - "API Limit Warning | > 80% usage | 📧🔔💬 | ●"
  - "Security Event | Auth failure | 📧🔔📱 | ●"
  - "Cost Threshold | > $100/day | 📧 | ○" (disabled)
  - "New Comment | Any mention | 🔔💬 | ●"
- Channel icons: 📧 Email, 🔔 In-app, 💬 Slack, 📱 SMS

**Alert Editor Panel:**
- "Edit Alert: 'Execution Failed'" header
- bg-slate-800 rounded-lg p-4 container

**Trigger Conditions Section:**
- bg-slate-900 rounded-lg p-3 sub-container
- Dropdown fields:
  - "When: [Workflow Execution ▼]"
  - "Condition: [Fails ▼]"
  - "Scope: [All Workflows ▼] or [Specific...]"
  - "Threshold: [1 ▼] occurrence in [1 hour ▼]"

**Notification Channels:**
- Checkbox list:
  - "☑ In-App Notification"
  - "☑ Email: chris@example.com"
  - "☐ Slack: #hyyve-alerts"
  - "☐ SMS: +1 (555) 123-4567"
  - "☑ Webhook: https://api.pagerduty.com/..."

**Alert Message Template:**
- Textarea with template variables:
  - "🔴 Workflow Failed: {{workflow_name}}"
  - "Error: {{error_message}}"
  - "Time: {{timestamp}}"
  - "[View: {{execution_url}}]"
- bg-slate-950 rounded-lg for code styling

**Schedule Section:**
- Radio options:
  - "○ Always active"
  - "● Active hours: [9:00 AM] to [6:00 PM] [EST ▼]"

**Alert Actions:**
- "[Test Alert]" "[Save Rule]" "[Delete]"

**Quiet Hours Configuration:**
- "Quiet Hours" header
- bg-slate-800 rounded-lg p-4 container
- Checkbox: "☑ Enable quiet hours: [10:00 PM] to [7:00 AM]"
- Checkbox: "☐ Allow critical alerts during quiet hours"
```

---

## Design System Reference (Group 13)

All screens in this group use the established design tokens:

| Token | Value | Usage |
|-------|-------|-------|
| Background | #0F172A | Page background |
| Surface | #1E293B | Cards, containers |
| Surface Elevated | #334155 | Tables, nested containers |
| Border | #475569 | Dividers, card borders |
| Primary | #4F46E5 | Buttons, active states |
| Text Primary | #F8FAFC | Headings, body text |
| Text Secondary | #94A3B8 | Descriptions, metadata |
| Success | #10B981 | Checkmarks, passed, enabled |
| Warning | #F59E0B | Warnings, pending |
| Error | #EF4444 | Critical, failed, high severity |

**Severity Colors:**
- CRITICAL: #EF4444 (red)
- WARNING: #F59E0B (amber)
- SUCCESS: #10B981 (green)
- INFO: #3B82F6 (blue)
- SYSTEM: #6B7280 (gray)

**Permission Matrix:**
- ✅ Granted: #10B981 (green checkmark)
- ⬜ Not Granted: #475569 (empty outline)

**Typography:**
- Font Family: Inter (UI), JetBrains Mono (code/logs)
- Base size: 14px

---

## Cross-References

| Screen | PRD Requirement | Architecture Component | UX Component Count |
|--------|-----------------|----------------------|-------------------|
| 4.7.1 | FR221-FR223 | SecurityDashboard | 11 components |
| 4.7.2 | FR224-FR226 | ComplianceDocs | 8 components |
| 4.7.3 | FR227-FR229 | AuditLogViewer | 9 components |
| 4.7.4 | FR230, FR16 | DataResidency | 8 components |
| 4.8.1 | FR7-FR8, FR16 | OrgHierarchy | 7 components |
| 4.8.2 | FR10, FR15 | RBACEditor | 10 components |
| 4.8.3 | FR15-FR16 | TenantRegistry | 12 components |
| 4.8.4 | FR7, FR15 | RateLimiting | 9 components |
| 4.9.1 | FR37, FR174 | NotificationCenter | 8 components |
| 4.9.2 | FR37, FR174 | AlertConfig | 11 components |

---

## AG-UI/A2UI Integration Points

| Screen | Dynamic Zone | Integration Type |
|--------|-------------|------------------|
| 4.7.1 | Security events | Real-time event streaming |
| 4.7.3 | Audit log table | Paginated data loading |
| 4.8.1 | Organization tree | Interactive tree component |
| 4.8.3 | Tenant list | Real-time status updates |
| 4.8.4 | Throttle events | Live log streaming |
| 4.9.1 | Notification list | AGENT_CONTENT_ZONE - Real-time notifications |
| 4.9.2 | Alert editor | Dynamic form rendering |
