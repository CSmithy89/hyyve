# Google Stitch Prompts - Group 11

**Project:** Hyyve Platform
**Group:** 11 of 15
**Screens:** 101-110 (Creator Economy + Templates + Agency Start)
**Design System:** Refer to Group 01 for complete design tokens

---

## Screen 101: MCP Server Pricing Configuration (3.3.3)

### Stitch Prompt

```
Create an MCP server pricing configuration modal with dark theme (#0F172A background).

**Layout:**
- Modal header with "Configure MCP Server Pricing" and close button
- Server info summary card
- Pricing strategy radio selection
- Per-call pricing table (conditional)
- Revenue preview calculator
- Trial configuration section
- Action buttons: Cancel, Save Pricing

**Modal Container:**
- Max-width: 640px
- bg-slate-900 rounded-2xl border border-slate-700

**Server Info Card:**
- "MCP Server: [name]" header
- bg-slate-800 rounded-lg p-3 container
- Stats row: "Tools: 12 | Resources: 3 | Prompts: 0"
- Status row: "Status: ● Published | Installs: 1,234"
- Green dot for published status

**Pricing Strategy Section:**
- "Pricing Strategy" header
- bg-slate-800 rounded-lg p-4 container
- Radio options with descriptions:
  - "○ Free (Open Source)" - "No revenue, maximum adoption"
  - "● Per-Call Pricing" (selected) - "Charge per tool invocation"
  - "○ Monthly Subscription" - "Flat monthly fee, unlimited usage"
  - "○ Tiered Usage" - "Free tier + paid overages"

**Per-Call Pricing Table:**
- "Per-Call Pricing Configuration" header
- bg-slate-800 rounded-lg container
- Table columns: Tool | Price/Call | Free Tier
- Rows for each tool with editable price inputs:
  - read_file | $0.001 | 100/month
  - write_file | $0.005 | 50/month
  - list_directory | $0.0005 | 200/month
- Footer actions: "[Apply to all: $0.002]" "[Reset to defaults]"

**Revenue Preview Section:**
- "Revenue Preview (based on current usage)" header
- bg-slate-800 rounded-lg p-4 container
- Calculation breakdown:
  - "Estimated Monthly Revenue: $234.50"
  - "Platform Fee (15%): -$35.18"
  - "Your Earnings: $199.32" (bold, green)
- Link: "📊 View detailed earnings projection"

**Trial Configuration Section:**
- "Trial Configuration" header
- bg-slate-800 rounded-lg p-4 container
- Checkbox: "☑️ Enable free trial period"
- Dropdown: "Trial Duration: [▼ 14 days]"
- Number input: "Trial Calls Limit: [1000] per trial"

**Action Buttons:**
- "[Cancel]": outline button
- "[Save Pricing]": primary button bg-indigo-600
- Right-aligned in footer
```

---

## Screen 102: Revenue Share Explainer (3.3.4)

### Stitch Prompt

```
Create a revenue share explainer modal with dark theme (#0F172A background).

**Layout:**
- Modal header with money icon "💰 How Creator Earnings Work" and close button
- Large earnings highlight card (85% split)
- Visual flow diagram showing payment split
- Fee breakdown bullet list
- Interactive revenue calculator
- "Got It" button footer

**Modal Container:**
- Max-width: 560px
- bg-slate-900 rounded-2xl border border-slate-700

**Earnings Highlight Card:**
- bg-slate-800 rounded-xl p-6 container
- Large centered headline: "Your Earnings: 85% of Every Sale"
- Visual representation:
  - Two columns connected by arrow (→)
  - "Customer Pays $100" → "You Receive $85"
  - "Platform Fee: $15 (15%)" below arrow

**Fee Breakdown Section:**
- "The 15% platform fee covers:" header
- Bullet list with explanations:
  - "• Payment processing (Stripe fees)"
  - "• Hosting and infrastructure"
  - "• Marketplace discovery and promotion"
  - "• Support and dispute resolution"
  - "• Fraud protection and chargebacks"

**Revenue Calculator Section:**
- "Revenue Calculator" header
- bg-slate-800 rounded-lg p-4 container
- Interactive input: "If you sell at: [$49.00]/month"
- Calculation breakdown:
  - "Per sale: $49.00"
  - "Platform fee: -$7.35 (15%)"
  - "Your earnings: $41.65" (green, bold)
- Projections:
  - "Monthly (est. 100 customers): $4,165.00"
  - "Annual (est. 100 customers): $49,980.00"

**Calculator Interaction:**
- Update price input to recalculate all values
- Customer count slider or input (optional)
- Real-time updates as values change

**Action Button:**
- "[Got It]": primary button bg-indigo-600
- Centered, full-width on mobile

**Visual Styling:**
- Green color for positive earnings (#10B981)
- Red color for deductions (#EF4444)
- Large typography for key numbers
```

---

## Screen 103: Payout Dashboard (3.3.5)

### Stitch Prompt

```
Create a creator payout dashboard with dark theme (#0F172A background).

**Layout:**
- Header with "Payouts" title and "Payout Settings" button
- Current Balance card with payout request button
- Payout History table
- Earnings Breakdown card for current month
- View Statement action

**Current Balance Card:**
- "Current Balance" header
- bg-slate-800 rounded-xl p-6 container
- Large balance display: "Available for Payout: $2,847.32"
- "[Request Payout]" primary button
- Min threshold: "Min: $50 | Next auto: Feb 1"
- Additional balances:
  - "Pending (in escrow): $456.78" with info icon "ⓘ 7-day hold"
  - "Processing: $234.00" with "Est. arrival: Jan 28"

**Payout History Table:**
- "Payout History" header with "[Export CSV]" action
- bg-slate-800 rounded-lg container
- Table columns: Date | Amount | Method | Status | ID
- Sample rows:
  - "Jan 15 | $3,245.67 | Bank ****4521 | ✓ Completed | #1234"
- Status indicators:
  - ✓ Completed (green checkmark)
  - ⏳ Processing (yellow)
  - ✗ Failed (red)
- Masked payment method (****4521)
- Clickable ID for details

**Earnings Breakdown Card:**
- "Earnings Breakdown (January)" header with "[View Statement]" action
- bg-slate-800 rounded-lg p-4 container
- Line items:
  - "Gross Sales: $4,234.00"
  - "Platform Fee (15%): -$635.10" (red)
  - "Refunds: -$98.00" (red)
  - "Adjustments: +$12.50" (green)
  - Divider line "────────────────"
  - "Net Earnings: $3,513.40" (bold, large)

**Info Tooltips:**
- Hover on escrow info shows hold explanation
- Hover on processing shows expected timeline

**Table Interactions:**
- Sort by date (default newest first)
- Filter by status
- Pagination for long history
```

---

## Screen 104: Payout Settings (3.3.6)

### Stitch Prompt

```
Create a payout settings modal with dark theme (#0F172A background).

**Layout:**
- Modal header with "Payout Settings" and close button
- Payout Method selection with radio options
- Payout Schedule configuration
- Tax Information section
- Action buttons: Cancel, Save Settings

**Modal Container:**
- Max-width: 560px
- bg-slate-900 rounded-2xl border border-slate-700

**Payout Method Section:**
- "Payout Method" header
- bg-slate-800 rounded-lg p-4 container
- Radio options with icons:
  - "● 🏦 Bank Account" (selected)
    - Sub-text: "Chase Bank ****4521" with "[Edit]" link
  - "○ 💳 Debit Card"
    - Sub-text: "Faster deposits (1-2 days)" with "[Add]" link
  - "○ 🔗 Stripe Express"
    - Sub-text: "Manage payouts in Stripe dashboard" with "[Connect]" link

**Payout Schedule Section:**
- "Payout Schedule" header
- bg-slate-800 rounded-lg p-4 container
- Dropdown: "Frequency: [▼ Bi-weekly (1st & 15th)]"
- Radio options with details:
  - "○ Daily (available balance > $50)"
  - "○ Weekly (every Monday)"
  - "● Bi-weekly (1st and 15th of month)" (selected)
  - "○ Monthly (1st of month)"
  - "○ Manual only (request each payout)"

**Tax Information Section:**
- "Tax Information" header
- bg-slate-800 rounded-lg p-4 container
- Tax form info: "Tax Form: W-9 (US Individual)" with "[Update]" link
- Masked TIN: "TIN: ***-**-4321"
- Tax documents section "📄 2024 Tax Documents":
  - "1099-K (if > $600 in 2024)" with "[Download when ready]"
  - "Annual Earnings Summary" with "[Download]" button

**Action Buttons:**
- "[Cancel]": outline button
- "[Save Settings]": primary button bg-indigo-600
- Right-aligned in footer

**Validation:**
- Require at least one payout method
- Show warning if changing schedule mid-cycle
```

---

## Screen 105: Workflow Templates Browser (3.5.1)

### Stitch Prompt

```
Create a workflow templates browser with dark theme (#0F172A background).

**Layout:**
- Header with "Templates" title and Filter/Search/New buttons
- Horizontal category filter chips
- Featured Templates carousel (3 highlighted cards)
- All Templates data table with pagination

**Header Actions:**
- "[Filter ▼]" dropdown button
- "[🔍 Search]" search input
- "[+ New]" primary button

**Category Filter Chips:**
- Horizontal scrollable row
- Categories: [All] [Customer Service] [Sales] [Marketing] [Operations] [Developer Tools] [Content] [Analytics] [Custom]
- Active chip: bg-indigo-600 text-white
- Inactive: bg-slate-800 text-slate-300

**Featured Templates Carousel:**
- "Featured Templates" header
- 3-column grid of featured cards
- Each card has badge type:
  - "🏆 STAFF PICK" (gold badge)
  - "🔥 TRENDING" (orange badge)
  - "⭐ NEW" (blue badge)
- Card structure:
  - Badge at top
  - Icon area (📧 Email, 🤖 Support, 📊 Lead)
  - Template name
  - Short description (2 lines)
  - Star rating "⭐ 4.8 (234)"
  - "[Use Template]" button
- bg-slate-800 rounded-xl border border-slate-700

**All Templates Table:**
- "All Templates (47)" header with "Sort: Popular" dropdown
- bg-slate-800 rounded-lg container
- Table columns: Template | Category | Rating | Uses | Author
- Sample rows:
  - Customer Feedback | Service | ⭐ 4.8 | 1,234 | Team
  - Lead Enrichment | Sales | ⭐ 4.7 | 892 | Team
- Hover: bg-slate-700/50
- Click row to preview/use template

**Pagination:**
- "[← Previous] Page 1 of 5 [Next →]"
- Page numbers: 1 2 3 ... 5
- 10 items per page
```

---

## Screen 106: Bundle Creation Interface (3.5.2)

### Stitch Prompt

```
Create a bundle creation modal/screen with dark theme (#0F172A background).

**Layout:**
- Modal header with "Create Bundle" and close button
- Bundle Details form (name, description, category)
- Included Items list with drag-to-reorder
- Bundle Pricing calculator
- Bundle Preview section
- Action buttons: Cancel, Save Draft, Publish Bundle

**Bundle Details Section:**
- "Bundle Details" header
- bg-slate-800 rounded-lg p-4 container
- Form fields:
  - Name: text input "[E-Commerce Starter Kit]"
  - Description: textarea (multi-line)
  - Category: dropdown "[E-Commerce ▼]"
  - Tags: tag input "customer, support, ..."

**Included Items Section:**
- "Included Items (4)" header with "[+ Add Item]" button
- bg-slate-800 rounded-lg p-4 container
- Draggable item list:
  - Each item has:
    - Drag handle [≡]
    - Icon (💬, 📦, 💰, ⭐)
    - Item name (bold)
    - Description subtitle
    - Price badge ($29/mo, FREE)
    - Delete button [🗑️]
- Items stack vertically
- Drag to reorder

**Bundle Pricing Calculator:**
- "Bundle Pricing" header
- bg-slate-800 rounded-lg p-4 container
- Calculation breakdown:
  - "Individual Total: $72/mo"
  - "Bundle Discount: [20% ▼] -$14.40" (dropdown for discount %)
  - Divider line
  - "Bundle Price: $57.60/mo" (large, bold)
  - "Your Earnings (85%): $48.96/mo" (green)
- "[📊 View Pricing Calculator]" link

**Bundle Preview Section:**
- "Bundle Preview" header
- bg-slate-800 rounded-lg p-4 container
- Preview placeholder: "[Preview how your bundle will appear in marketplace]"
- Click to expand full preview modal

**Action Buttons:**
- "[Cancel]": outline button
- "[Save Draft]": outline button
- "[Publish Bundle]": primary button bg-indigo-600
- Right-aligned row
```

---

## Screen 107: Module Setup Wizard Builder (3.5.3)

### Stitch Prompt

```
Create a setup wizard builder interface with dark theme (#0F172A background).

**Layout:**
- Header with "Setup Wizard Builder" title and Preview/Save buttons
- Instruction text explaining purpose
- Draggable wizard steps list
- Each step is expandable/collapsible
- Wizard preview panel at bottom

**Header:**
- "Setup Wizard Builder" title
- "[Preview]" and "[Save]" buttons right-aligned

**Instruction Text:**
- "Configure the onboarding wizard buyers see after purchase"
- text-slate-400, below header

**Wizard Steps List:**
- "Wizard Steps (4)" header with "[+ Add Step]" button
- bg-slate-800 rounded-lg p-4 container
- Collapsible step cards:

**Step Card Structure:**
- Header row: "Step 1: Welcome" with drag handle [≡] and delete [🗑️]
- Expandable content panel:
  - Type dropdown: "[Information ▼]"
  - Title input: text field
  - Content area (markdown editor for Information type)
  - Fields builder (for Form Input type)

**Step Types:**
1. **Information**: Title + Markdown content
2. **Form Input**: Field list with types (Dropdown, Password, URL, etc.)
3. **Validation**: Success/Failure message configuration
4. **Summary**: Display collected values, trigger action

**Form Fields Builder (for Form Input type):**
- Field list with:
  - Field name
  - Type dropdown (Dropdown, Password, URL, Text, etc.)
  - Required checkbox
  - Validation rules
- "[+ Add Field]" button

**Wizard Preview Panel:**
- "Wizard Preview" header
- bg-slate-900 rounded-lg container
- Live preview showing:
  - Progress dots: ○───○───○───○ (1 2 3 4)
  - Current step content
  - Navigation hint

**Drag and Drop:**
- Drag handle on each step
- Reorder steps by dragging
- Visual feedback during drag
```

---

## Screen 108: Ratings & Reviews Management (3.5.4)

### Stitch Prompt

```
Create a ratings and reviews management dashboard with dark theme (#0F172A background).

**Layout:**
- Header with product name and Export/Filter buttons
- Overall Rating summary with distribution chart
- Reviews list with filters
- Featured Reviews management section

**Header:**
- "Reviews: [Product Name]" title
- "[Export]" and "[Filter]" buttons right-aligned

**Overall Rating Card:**
- "Overall Rating" header
- bg-slate-800 rounded-xl p-6 container
- Large star display: "⭐⭐⭐⭐⭐ 4.8"
- "Based on 234 reviews" subtitle
- Rating distribution bars:
  - "5 ⭐ ████████████████████████████████████░░ 78% (182)"
  - "4 ⭐ ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 15% (35)"
  - "3 ⭐ ███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 5% (12)"
  - "2 ⭐ █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 1% (3)"
  - "1 ⭐ █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 1% (2)"
- Bars: filled portion bg-amber-500, empty bg-slate-700

**Reviews List:**
- "Reviews (234)" header with sort/filter dropdowns
- Filters: "[Newest ▼]" "[Needs Reply ▼]"
- Review cards:

**Review Card Structure:**
- Star rating with quote preview: "⭐⭐⭐⭐⭐ 'Saved us 20 hours/week!'"
- Metadata: "by [Name] • Verified Purchase • [time ago]"
- Review text (full or truncated)
- Action buttons: [Reply] [Mark as Featured] [Report]
- "[NEW!]" badge for unreplied reviews

**Reply Composer (inline):**
- "Your Reply:" label
- Textarea with reply text
- "[Post Reply]" button
- After posting: "[Delete Reply]" "[Edit Reply]" actions

**Flagged Review Indicator:**
- "🚩 Flagged for review" badge
- Additional actions: [Request More Info] [Offer Refund]

**Featured Reviews Section:**
- "Featured Reviews (shown on listing)" header
- bg-slate-800 rounded-lg p-4 container
- List of featured reviews with [Unfeature] action
- "[+ Add Featured Review]" button

**Review Card Styling:**
- Divider between reviews
- bg-slate-800/50 for new/unreplied
- Hover for action reveal
```

---

## Screen 109: Agency Dashboard (4.1.1)

### Stitch Prompt

```
Create an agency portal dashboard with dark theme (#0F172A background).

**Layout:**
- Header with "Agency Portal" title and "+ New Client" button
- Overview stats cards row (4 cards) with time period selector
- Clients data table
- Recent Activity feed

**Header:**
- "Agency Portal" title left-aligned
- "[+ New Client]" primary button right-aligned (bg-indigo-600)

**Time Period Selector:**
- "Overview" label with "[This Month ▼]" dropdown
- Right-aligned above stats cards

**Overview Stats Cards:**
- 4-column row of stat cards
- Each card: bg-slate-800 rounded-xl p-4
- Cards:
  1. Clients: "12"
  2. MRR: "$45K"
  3. Retention: "89%"
  4. Projects: "23"
- Large number centered, label below

**Clients Table:**
- "Clients" header with "[Filter ▼]" and "[🔍]" search
- bg-slate-800 rounded-lg container
- Table columns: Client | Projects | Status | MRR | Actions
- Sample rows:
  - "🏢 Acme Corp | 5 | ● Active | $4,500 | [→]"
  - "🏢 TechStart | 3 | ● Active | $2,200 | [→]"
  - "🏢 GlobalFin | 8 | ● Active | $12,000 | [→]"
  - "🏢 StartupXYZ | 2 | ○ Trial | $0 | [→]"
- Status indicators:
  - "● Active" (green)
  - "○ Trial" (gray outline)
  - "◐ Onboarding" (half-filled)
- Building icon 🏢 for each client
- Arrow → for navigation to client workspace

**Recent Activity Feed:**
- "Recent Activity" header
- bg-slate-800 rounded-lg p-4 container
- Activity list:
  - "• Acme Corp: Chatbot deployed to production (2h ago)"
  - "• TechStart: New project created (5h ago)"
  - "• GlobalFin: Monthly report generated (1d ago)"
- Bullet points with client name, action, relative time
- Hover to see full details

**Table Interactions:**
- Click row to view client workspace
- Sort by any column
- Filter by status
```

---

## Screen 110: Client Workspace View (4.1.2)

### Stitch Prompt

```
Create an agency client workspace view with dark theme (#0F172A background).

**Layout:**
- Back navigation to Agency with client name and Settings button
- Client Overview card with contact info
- Projects grid (3 columns)
- White-Label Settings summary card
- Footer actions: View as Client, Generate Report, Manage Billing

**Header:**
- "← Back to Agency" back link
- "Client: [Client Name]" center title
- "[Settings]" button right-aligned

**Client Overview Card:**
- bg-slate-800 rounded-lg p-4 container
- Building icon "🏢" with client name (large)
- Contact info: "Contact: [Name] ([email])"
- Metadata row: "Plan: Enterprise | Since: Jan 2025 | MRR: $4,500"

**Projects Grid:**
- "Projects (5)" header with "[+ New Project]" button
- bg-slate-800 rounded-lg p-4 container
- 3-column grid of project cards
- Each project card:
  - Project name (bold)
  - Type badge with icon (💬 Chatbot, 🔧 Module)
  - Environment status: "● Production" or "◐ Staging"
  - bg-slate-700 rounded-lg p-3
- Status indicators:
  - "● Production" (green dot)
  - "◐ Staging" (half-filled yellow)
  - "○ Development" (empty outline)

**White-Label Settings Card:**
- "White-Label Settings" header
- bg-slate-800 rounded-lg p-4 container
- Setting rows with actions:
  - "Custom Domain: support.acme.com" with "[Configure]" link
  - "Branding: Acme Logo + Colors" with "[Edit]" link
  - "Email From: noreply@acme.com" with "[Verify]" link
- Status indicators for each (verified ✓, pending ⏳)

**Footer Actions:**
- Horizontal button row
- "[View as Client]": outline button - switches to client view mode
- "[Generate Report]": outline button
- "[Manage Billing]": outline button
- Left-aligned

**Project Card Interactions:**
- Click to open project in builder
- Hover shows quick actions (Edit, Deploy, Delete)
```

---

## Design System Reference (Group 11)

All screens in this group use the established design tokens:

| Token | Value | Usage |
|-------|-------|-------|
| Background | #0F172A | Page background |
| Surface | #1E293B | Cards, containers |
| Surface Elevated | #334155 | Hover states |
| Border | #475569 | Dividers, card borders |
| Primary | #4F46E5 | Buttons, active states |
| Text Primary | #F8FAFC | Headings, body text |
| Text Secondary | #94A3B8 | Descriptions, metadata |
| Success | #10B981 | Earnings, positive values |
| Warning | #F59E0B | Pending, escrow |
| Error | #EF4444 | Deductions, refunds |
| Star Rating | #FBBF24 | Rating stars, featured badges |

**Status Indicators:**
- ● Active/Live: #10B981 (solid green)
- ○ Trial/Draft: #64748B (gray outline)
- ◐ Staging/Onboarding: #F59E0B (half-filled yellow)
- ✓ Completed/Verified: #10B981

**Typography:**
- Font Family: Inter (UI), JetBrains Mono (code)
- Large numbers: font-bold text-3xl
- Labels: text-sm font-medium text-slate-400

**Spacing:**
- Base unit: 8px
- Card padding: 16-24px
- Section gaps: 24-32px

---

## Cross-References

| Screen | PRD Requirement | Architecture Component | UX Component Count |
|--------|-----------------|----------------------|-------------------|
| 3.3.3 | FR112 | MCPPricingConfig | 8 components |
| 3.3.4 | FR173 | RevenueShareExplainer | 5 components |
| 3.3.5 | FR173 | PayoutDashboard | 9 components |
| 3.3.6 | FR173 | PayoutSettings | 8 components |
| 3.5.1 | FR118-FR120 | TemplatesBrowser | 10 components |
| 3.5.2 | FR121-FR123 | BundleCreator | 9 components |
| 3.5.3 | FR124-FR126 | SetupWizardBuilder | 11 components |
| 3.5.4 | FR127-FR130 | ReviewsManagement | 10 components |
| 4.1.1 | FR251-FR270 | AgencyDashboard | 8 components |
| 4.1.2 | FR251-FR270 | ClientWorkspace | 9 components |

---

## AG-UI/A2UI Integration Points

| Screen | Dynamic Zone | Integration Type |
|--------|-------------|------------------|
| 3.3.3 | Revenue preview | Real-time calculation |
| 3.3.4 | Revenue calculator | Interactive computation |
| 3.3.5 | Balance and history | Live data updates |
| 3.5.3 | Wizard preview | AGENT_CONTENT_ZONE - Live form preview |
| 3.5.4 | Reviews list | Streaming review updates |
| 4.1.1 | Client stats, activity | Real-time dashboard data |
