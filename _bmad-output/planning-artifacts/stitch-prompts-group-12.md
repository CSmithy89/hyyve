# Google Stitch Prompts - Group 12

**Project:** Hyyve Platform
**Group:** 12 of 15
**Screens:** 111-120 (Phase 4 Enterprise - Agency & Admin)
**Design System:** Refer to Group 01 for complete design tokens

---

## Screen 111: White-Label Branding Wizard (4.1.3)

### Stitch Prompt

```
Create a white-label branding wizard with dark theme (#0F172A background).

**Layout:**
- Header with "White-Label Branding: [Client Name]" and Save button
- Brand Identity section (logo uploads)
- Color Theme configuration
- Typography settings
- Live Preview panel
- Action buttons: Cancel, Save & Apply

**Brand Identity Section:**
- "Brand Identity" header
- bg-slate-800 rounded-lg p-4 container
- Two upload areas side by side:

**Logo Upload:**
- Preview box showing current logo
- "Primary Logo" label
- "[Upload PNG/SVG]" button with "[Remove]" option
- Recommendation text: "Recommended: 200x50px"

**Favicon Upload:**
- Small preview box for icon
- "Favicon" label
- "[Upload ICO/PNG]" button with "[Remove]" option
- Size hint: "32x32px or 64x64px"

**Color Theme Section:**
- "Color Theme" header
- bg-slate-800 rounded-lg p-4 container
- 2x3 grid of color pickers:
  - Primary Color: [#2563EB] [🎨]
  - Accent Color: [#10B981] [🎨]
  - Background: [#FFFFFF] [🎨]
  - Text Color: [#111827] [🎨]
  - Error Color: [#EF4444] [🎨]
  - Success Color: [#10B981] [🎨]
- Action buttons: "[Load from Logo Colors]" "[Reset to Defaults]"

**Typography Section:**
- "Typography" header
- bg-slate-800 rounded-lg p-4 container
- Dropdown fields:
  - "Heading Font: [▼ Inter]"
  - "Body Font: [▼ Inter]"
- Checkbox: "☐ Use custom fonts (requires font upload)"

**Live Preview Panel:**
- "Live Preview" header
- bg-slate-900 rounded-lg container showing chat widget preview:
  - Client logo in header
  - Chat conversation area
  - Message input with send button
  - Theme colors applied
- "[Toggle Dark Mode]" button below preview

**Action Buttons:**
- "[Cancel]": outline button
- "[Save & Apply]": primary button bg-indigo-600
- Right-aligned in footer
```

---

## Screen 112: Custom Domain Configuration (4.1.4)

### Stitch Prompt

```
Create a custom domain configuration screen with dark theme (#0F172A background).

**Layout:**
- Header with "Custom Domain: [Client Name]" and Save button
- Domain Configuration section with input and status
- DNS Configuration Required section with records
- SSL Certificate section
- Email Configuration section
- Action buttons: Cancel, Save Configuration

**Domain Configuration Section:**
- "Domain Configuration" header
- bg-slate-800 rounded-lg p-4 container
- Domain input field: "[support.acme.com]"
- Status indicator: "Status: 🟡 Pending DNS Configuration"
- Status colors: 🟢 Configured, 🟡 Pending, 🔴 Error

**DNS Configuration Section:**
- "DNS Configuration Required" header
- bg-slate-800 rounded-lg p-4 container
- Instruction text: "Add the following DNS records to your domain:"

**Record 1 (CNAME):**
- bg-slate-900 rounded-lg p-3 sub-container
- Fields: Host, Points to, TTL
- Copy button [📋] for each value
- Example: "Host: support | Points to: acme-corp.hyyve.ai | TTL: 3600"

**Record 2 (TXT):**
- bg-slate-900 rounded-lg p-3 sub-container
- Fields: Host, Value, TTL
- Copy button [📋] for value
- Example: "Host: _acme-challenge.support | Value: [base64 string]"

- "[Check DNS Configuration]" button below records

**SSL Certificate Section:**
- "SSL Certificate" header
- bg-slate-800 rounded-lg p-4 container
- Status: "Status: ⏳ Waiting for DNS verification"
- Radio options:
  - "● Auto-provision (Let's Encrypt)" - "Free, auto-renewal"
  - "○ Custom Certificate" - "Upload your own certificate"
    - "[Upload Certificate]" "[Upload Private Key]" buttons

**Email Configuration Section:**
- "Email Configuration" header
- bg-slate-800 rounded-lg p-4 container
- Email input: "From Email: [noreply@acme.com]"
- Verification status: "Email Verification: 🟡 Pending"
- TXT record for email verification with copy button
- "[Verify Email Domain]" button

**Action Buttons:**
- "[Cancel]": outline button
- "[Save Configuration]": primary button bg-indigo-600
```

---

## Screen 113: Client Onboarding Flow (4.1.5)

### Stitch Prompt

```
Create a client onboarding wizard step with dark theme (#0F172A background).

**Layout:**
- Header with "Onboard New Client" and step indicator "Step 2/4"
- Client Information form section
- Subscription Plan selection with pricing cards
- Initial Setup checklist
- Navigation buttons: Back, Save Draft, Create Client

**Step Indicator:**
- "Step 2/4" badge in header
- Progress dots or bar below header

**Client Information Section:**
- "Client Information" header
- bg-slate-800 rounded-lg p-4 container
- Form fields:
  - Company Name: text input
  - Primary Contact section:
    - Name: text input
    - Email: email input
    - Phone: text input "(optional)"

**Subscription Plan Section:**
- "Subscription Plan" header
- bg-slate-800 rounded-lg p-4 container
- 3-column grid of plan cards:

**Plan Card Structure:**
- Plan name (Starter, Professional, Enterprise)
- Radio selector (●/○)
- Price: "$500/mo", "$1,500/mo", "$4,500/mo"
- Feature list:
  - Project limits
  - Execution limits
  - Support level
  - Additional features
- bg-slate-700 rounded-lg p-4 for each card
- Selected state: border-indigo-500 bg-indigo-500/10

**Billing Options:**
- Two dropdowns:
  - "Billing: [▼ Monthly]"
  - "[▼ Client pays directly]"
- Margin calculation: "Your margin: 30% ($450/mo on Professional plan)"

**Initial Setup Checklist:**
- "Initial Setup" header
- bg-slate-800 rounded-lg p-4 container
- Checkbox list:
  - "☑️ Create welcome email template"
  - "☑️ Set up sandbox project for onboarding"
  - "☐ Schedule kickoff call"
  - "☐ Import existing data (if migrating)"

**Navigation Buttons:**
- "[← Back]": outline button
- "[Save Draft]": outline button
- "[Create Client]": primary button bg-indigo-600
- Right-aligned row
```

---

## Screen 114: Agency Billing Management (4.1.6)

### Stitch Prompt

```
Create an agency billing management dashboard with dark theme (#0F172A background).

**Layout:**
- Header with "Agency Billing" and Export Report button
- Revenue Overview stats cards (3 cards) with time selector
- Client Billing Status table
- Payment Methods configuration
- Upcoming Renewals list
- Your Agency Subscription card

**Revenue Overview Cards:**
- Time selector: "[This Month ▼]" dropdown
- 3-column row of stat cards:
  1. Gross Revenue: "$45,200" with "↑ 18%" trend
  2. Platform Fee: "$13,560" with "(30%)" label
  3. Your Revenue: "$31,640" with "↑ 18%" trend
- Each card: bg-slate-800 rounded-xl p-4

**Client Billing Status Table:**
- "Client Billing Status" header
- bg-slate-800 rounded-lg container
- Table columns: Client | Plan | MRR | Status | Action
- Sample rows:
  - "Acme Corp | Enterprise | $4,500 | ✓ Paid | [→]"
  - "NewClient | Professional | $1,500 | ⚠️ Due | [→]"
- Status indicators:
  - ✓ Paid (green)
  - ○ Trial (gray)
  - ⚠️ Due (yellow warning)
  - ✗ Overdue (red)

**Payment Methods Section:**
- "Payment Methods" header
- bg-slate-800 rounded-lg p-4 container
- Radio options:
  - "● Clients pay you directly (you bill and collect)"
    - "Margin: 100% of markup"
  - "○ Platform collects on your behalf"
    - "Automatic billing, we handle disputes"
    - "Margin: 85% (15% processing fee)"

**Upcoming Renewals Section:**
- "Upcoming Renewals" header
- bg-slate-800 rounded-lg p-4 container
- List format:
  - "Jan 28: Acme Corp Enterprise renewal ($4,500)"
  - "Feb 1: TechStart Professional renewal ($1,500)"
  - "Feb 5: StartupXYZ trial ends (conversion pending)"

**Agency Subscription Card:**
- "Your Agency Subscription" header
- bg-slate-800 rounded-lg p-4 container
- Plan info: "Plan: Agency Pro ($299/month)"
- Includes: "Unlimited clients, white-label, priority"
- Next billing date
- "[Manage Subscription]" button
```

---

## Screen 115: Sub-Account Management (4.1.7)

### Stitch Prompt

```
Create a sub-account management dashboard with dark theme (#0F172A background).

**Layout:**
- Header with "Sub-Account Management" and "+ New Sub-Account" button
- Sub-Accounts Overview summary
- Sub-Account List table with filters
- Account Types reference
- Permissions Matrix configuration
- Bulk Actions toolbar

**Sub-Accounts Overview:**
- bg-slate-800 rounded-lg p-4 container
- Summary text: "Your agency has 12 active sub-accounts"
- Plan limit: "Plan allows: Unlimited"

**Sub-Account List Table:**
- "Sub-Account List" header with "[Filter ▼]" and "[🔍]"
- bg-slate-800 rounded-lg container
- Table columns: Account | Type | Projects | Users | Actions
- Sample rows:
  - "🏢 Acme Corp | Client | 5 | 8 | [⚙️]"
  - "🏢 TechStart | Client | 3 | 3 | [⚙️]"
  - "🏢 GlobalFin | Enterprise | 8 | 25 | [⚙️]"
  - "🏢 Internal Dev | Internal | 12 | 5 | [⚙️]"
  - "🏢 Demo Account | Demo | 2 | 1 | [⚙️]"
- Building icon 🏢 for each row
- Type badges with different colors

**Account Types Reference:**
- "Account Types" header
- bg-slate-800 rounded-lg p-4 container
- Bullet list with descriptions:
  - "• Client: Full-service client with billing"
  - "• Enterprise: Large client with custom SLA"
  - "• Internal: Your team's development/staging"
  - "• Demo: Showcase account for prospects"
  - "• Partner: Reseller or integration partner"

**Permissions Matrix Section:**
- "Permissions Matrix" header
- bg-slate-800 rounded-lg p-4 container
- "What can sub-accounts access?" label
- Checkbox list:
  - "☑️ View and edit their own projects"
  - "☑️ Create new projects (within limits)"
  - "☐ Access shared template library"
  - "☐ View usage analytics"
  - "☑️ Manage their own team members"
  - "☐ Access billing information"
- "[Configure Default Permissions]" button

**Bulk Actions Toolbar:**
- Horizontal row of action buttons:
  - "[Select All]"
  - "[Export List]"
  - "[Send Announcement]"
  - "[Suspend]"
- Left-aligned at bottom
```

---

## Screen 116: Enterprise SSO Configuration (4.4.1)

### Stitch Prompt

```
Create an enterprise SSO configuration screen with dark theme (#0F172A background).

**Layout:**
- Header with "Enterprise Settings > SSO Configuration" and Save button
- Single Sign-On status toggle
- Identity Provider selection grid
- Provider-specific configuration fields
- Attribute Mapping section
- Test and Save buttons

**SSO Status Section:**
- "Single Sign-On" header
- bg-slate-800 rounded-lg p-4 container
- Status with toggle: "SSO Status: ● Enabled [Disable]"
- Green dot for enabled, gray for disabled

**Identity Provider Selection:**
- "Identity Provider" header
- bg-slate-800 rounded-lg p-4 container
- "Provider Type" label
- 4-column grid of provider buttons:
  - Okta (● selected)
  - Azure AD
  - Google OIDC
  - Custom SAML
- Each: bg-slate-700 rounded-lg p-3, selected has border-indigo-500

**Provider Configuration:**
- Header changes based on selection (e.g., "Okta Configuration")
- Form fields in bg-slate-900:
  - Domain: "[acme.okta.com]"
  - Client ID: "[masked ****]"
  - Client Secret: "[masked ****]"
- Password field styling for secrets

**Attribute Mapping Section:**
- "Attribute Mapping" header
- bg-slate-800 rounded-lg p-4 container
- Mapping rows:
  - "Email → user.email"
  - "Name → user.firstName + user.lastName"
  - "Role → user.groups[0]"
- "[+ Add Mapping]" button
- Arrow (→) indicates direction of mapping

**Action Buttons:**
- "[Test Connection]": outline button, tests SSO config
- "[Save Settings]": primary button bg-indigo-600
- Test shows success/failure feedback
```

---

## Screen 117: Team & Permissions Management (4.4.2)

### Stitch Prompt

```
Create a team management screen with dark theme (#0F172A background).

**Layout:**
- Header with "Team Management" and "+ Invite User" button
- Teams section with expandable team cards
- All Members table with search and filter
- Pending Invites section

**Teams Section:**
- "Teams (4)" header with "[+ New Team]" button
- bg-slate-800 rounded-lg p-4 container
- Expandable team cards:

**Team Card Structure:**
- Header: "┌─ Engineering (8 members)" with "[Edit]" button
- Indented details:
  - "Permissions: Full Builder Access, Deploy, Admin"
  - "Projects: All"
- Collapsible with expand/collapse animation
- Multiple teams stacked

**Sample Teams:**
- Engineering (8 members): Full access
- Marketing (5 members): Chatbot Builder, Canvas Builder
- Support (12 members): View Only, HITL Queue

**All Members Table:**
- "All Members (25)" header with "[Filter ▼]" and "[🔍 Search]"
- bg-slate-800 rounded-lg container
- Table columns: User | Email | Team | Role
- Sample rows:
  - "[👤] John Smith | john@acme.com | Eng | Admin"
  - "[👤] Sarah Jones | sarah@acme.com | Eng | Editor"
  - "[👤] Mike Brown | mike@acme.com | Marketing | Editor"
  - "[👤] Lisa Chen | lisa@acme.com | Support | Viewer"
- Avatar placeholder [👤] for each user
- Role badges with colors

**Pending Invites Section:**
- "Pending Invites (3)" header
- bg-slate-800 rounded-lg p-4 container
- Bullet list:
  - "• alex@acme.com (Engineering) - Sent 2d ago [Resend]"
  - "• pat@acme.com (Marketing) - Sent 1d ago [Resend]"
- "[Resend]" action link for each
```

---

## Screen 118: Support Console - User Lookup (4.6.1)

### Stitch Prompt

```
Create a support console user lookup screen with dark theme (#0F172A background).

**Layout:**
- Header with "Support Console" and "View as User" button
- User/Account Lookup search bar
- Organization details card with quick actions
- Projects table
- Recent Support Tickets list
- Footer actions: Impersonate, Audit Log, Contact

**Search Bar:**
- "User/Account Lookup" header
- bg-slate-800 rounded-lg p-4 container
- Search input: "🔍 [Search by email, org name, or user ID...]"
- Dropdown filter: "[Email ▼]"

**Organization Details Card:**
- "User: [Org Name]" header with plan badge "[Pro Plan]"
- bg-slate-800 rounded-lg p-4 container
- Two-column key-value table:
  - Org ID | org_rp_7f8a9b2c
  - Owner | jennifer@retailplus.com
  - Plan | Pro ($99/mo)
  - Status | ● Active
  - Created | 2025-08-15
  - Members | 12
  - Projects | 8
  - MRR | $99.00
  - Last Activity | 2 hours ago

**Quick Actions:**
- "Quick Actions" label
- Button row:
  - "[Extend Trial]" "[Add Credits]" "[Upgrade Plan]"
  - "[Reset Password]" "[Disable MFA]" "[View as User]"
- All outline style buttons

**Projects Table:**
- "Projects (8)" header
- bg-slate-800 rounded-lg container
- Table columns: Project | Type | Status | Last Run | Errors
- Sample rows:
  - "Support Bot | Chatbot | ● Live | 5 min ago | 0"
  - "Lead Qualifier | Module | ● Live | 1 hr ago | 3"
  - "Voice Agent | Voice | ○ Draft | - | -"
- Error count highlighted if > 0

**Recent Support Tickets:**
- "Recent Support Tickets" header
- bg-slate-800 rounded-lg p-4 container
- List format:
  - "#4521 - 'Chatbot broken' - RESOLVED - 2 days ago"
  - "#4489 - 'Can't deploy' - RESOLVED - 1 week ago"
- Status badges: RESOLVED (green), OPEN (yellow)

**Footer Actions:**
- "[Impersonate User]" "[View Full Audit Log]" "[Contact User]"
- Left-aligned row
```

---

## Screen 119: Execution History Viewer (4.6.2)

### Stitch Prompt

```
Create an execution history viewer with dark theme (#0F172A background).

**Layout:**
- Header with account name and Export CSV button
- Multi-filter bar (project, status, time, search)
- Execution Timeline visualization
- Executions table with pagination
- Selected execution details panel
- Suggested Fix card (AI-powered)

**Filter Bar:**
- "Filters" header
- bg-slate-800 rounded-lg p-3 container
- Row of filters:
  - "Project: [All Projects ▼]"
  - "Status: [All ▼]"
  - "Time: [24h ▼]"
- Search input: "[🔍 Search execution ID or error message...]"

**Execution Timeline:**
- "Execution Timeline (Last 24 Hours)" header
- bg-slate-800 rounded-lg p-4 container
- Horizontal bar chart showing activity over time:
  - X-axis: 12AM → 6AM → 12PM → 6PM → Now
  - Filled blocks (▓) for activity, empty (░) for quiet periods
- Summary: "Success: 2,847 Errors: 23 Timeouts: 5"
- Color coding: green for success, red for errors

**Executions Table:**
- "Executions (2,875)" header with "Page 1 of 58"
- bg-slate-800 rounded-lg container
- Table columns: Execution ID | Project | Status | Duration | Time
- Sample rows:
  - "exec_7f8a9b2c | Support Bot | ✅ OK | 1.2s | Now"
  - "exec_5c4b3a09 ◄── | Lead Qual | ❌ ERR | 0.3s | 5m"
  - "exec_3a291807 | Marketing | ⏱ TOUT | 30.0s | 12m"
- Arrow indicator (◄──) for selected row
- Status icons: ✅ OK, ❌ ERR, ⏱ TOUT

**Selected Execution Details:**
- "Selected: exec_5c4b3a09 (Error)" header
- bg-slate-800 rounded-lg p-4 container
- Error Details box:
  - Type, Message, Node, Time
  - bg-slate-900 rounded-lg for code block
- Stack Trace box:
  - Code lines in JetBrains Mono
  - bg-slate-950 rounded-lg
- Actions: "[View in Langfuse]" "[Replay Execution]" "[Copy Error]"

**Suggested Fix Card:**
- "Suggested Fix" header
- bg-slate-800 rounded-lg p-4 container with amber/yellow left border
- Light bulb icon "💡"
- AI-generated explanation of error
- Recommendation text
- Buttons: "[Apply Suggested Fix]" "[Dismiss]"
```

---

## Screen 120: Integration Health Dashboard (4.6.3)

### Stitch Prompt

```
Create an integration health dashboard with dark theme (#0F172A background).

**Layout:**
- Header with "Integration Health" and Refresh/Settings buttons
- Overall Status indicator
- External Services table
- Internal Services table
- Recent Incidents timeline
- Health Check Endpoints info

**Overall Status:**
- Large indicator: "Overall Status: ● 98.7% Healthy"
- Green dot for healthy, yellow for degraded, red for down

**External Services Table:**
- "External Services" header
- bg-slate-800 rounded-lg container
- Table columns: Service | Status | Latency | Uptime | Last
- Sample rows:
  - "Anthropic API | ● UP | 234ms | 99.9% | 30s ago"
  - "OpenAI API | ● UP | 312ms | 99.8% | 30s ago"
  - "Deepgram STT | ● UP | 89ms | 99.7% | 1m ago"
  - "Cartesia TTS | ● UP | 156ms | 99.9% | 1m ago"
  - "fal.ai | ● UP | 445ms | 99.5% | 30s ago"
  - "Stripe | ● UP | 78ms | 100% | 2m ago"
  - "Twilio | ○ WARN | 890ms | 98.2% | 30s ago"
  - "Resend | ● UP | 45ms | 99.9% | 5m ago"
- Status indicators: ● UP (green), ○ WARN (yellow), ✗ DOWN (red)

**Internal Services Table:**
- "Internal Services" header
- bg-slate-800 rounded-lg container
- Table columns: Service | Status | CPU | Memory | Queue
- Sample rows:
  - "API Gateway | ● UP | 23% | 45% | -"
  - "Module Service | ● UP | 67% | 72% | 234"
  - "RAG Service | ● UP | 78% | 85% | 567"
- Progress bar styling for CPU/Memory percentages
- Queue numbers for services with job queues

**Recent Incidents Section:**
- "Recent Incidents (Last 7 Days)" header
- bg-slate-800 rounded-lg p-4 container
- Incident cards:

**Active Incident:**
- "⚠️ Twilio - High Latency"
- "Started: 2026-01-25 10:15 | Duration: Ongoing"
- "Impact: Voice calls experiencing 2-3s delay"
- Actions: "[View Details]" "[Subscribe to Updates]"
- Yellow/amber left border

**Resolved Incident:**
- "✅ Anthropic API - Degraded Performance (RESOLVED)"
- "2026-01-23 14:00 - 2026-01-23 15:30 (1.5h)"
- "Impact: Increased latency for Claude calls"
- Action: "[View Post-Mortem]"
- Green left border

**Health Check Endpoints:**
- "Health Check Endpoints" header
- bg-slate-800 rounded-lg p-4 container
- URL displays:
  - "Platform Status: https://status.hyyve.com"
  - "API Health: https://api.hyyve.com/health"
- Button: "[Run Webhook Diagnostic]"
```

---

## Design System Reference (Group 12)

All screens in this group use the established design tokens:

| Token | Value | Usage |
|-------|-------|-------|
| Background | #0F172A | Page background |
| Surface | #1E293B | Cards, containers |
| Surface Elevated | #334155 | Nested containers |
| Border | #475569 | Dividers, card borders |
| Primary | #4F46E5 | Buttons, active states |
| Text Primary | #F8FAFC | Headings, body text |
| Text Secondary | #94A3B8 | Descriptions, metadata |
| Success | #10B981 | UP status, paid, healthy |
| Warning | #F59E0B | Pending, warning states |
| Error | #EF4444 | Down, errors, overdue |

**Status Indicators:**
- ● UP/Active/Paid: #10B981 (solid green)
- ○ WARN/Pending: #F59E0B (outline yellow)
- ✗ DOWN/Error: #EF4444 (red)
- ⏳ Waiting: #F59E0B (hourglass)

**Typography:**
- Font Family: Inter (UI), JetBrains Mono (code/errors)
- Base size: 14px

**Spacing:**
- Base unit: 8px
- Card padding: 16-24px

---

## Cross-References

| Screen | PRD Requirement | Architecture Component | UX Component Count |
|--------|-----------------|----------------------|-------------------|
| 4.1.3 | FR206-FR208 | WhiteLabelBranding | 10 components |
| 4.1.4 | FR209-FR210 | CustomDomain | 9 components |
| 4.1.5 | FR211-FR212 | ClientOnboarding | 9 components |
| 4.1.6 | FR213 | AgencyBilling | 10 components |
| 4.1.7 | FR206 | SubAccountManagement | 8 components |
| 4.4.1 | FR271-FR280 | SSOConfiguration | 7 components |
| 4.4.2 | FR271-FR280 | TeamManagement | 8 components |
| 4.6.1 | FR241-FR244 | SupportConsole | 11 components |
| 4.6.2 | FR245-FR247 | ExecutionHistory | 12 components |
| 4.6.3 | FR248-FR250 | IntegrationHealth | 10 components |

---

## AG-UI/A2UI Integration Points

| Screen | Dynamic Zone | Integration Type |
|--------|-------------|------------------|
| 4.1.3 | Live preview panel | Real-time theme application |
| 4.1.4 | DNS status checks | Async verification polling |
| 4.1.6 | Revenue calculations | Real-time billing data |
| 4.6.1 | Organization data | AGENT_CONTENT_ZONE - Support tools |
| 4.6.2 | Execution timeline | Streaming log updates |
| 4.6.2 | Suggested fixes | AI-generated recommendations |
| 4.6.3 | Service status | Real-time health monitoring |
