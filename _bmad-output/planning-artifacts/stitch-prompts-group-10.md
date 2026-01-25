# Google Stitch Prompts - Group 10

**Project:** Hyyve Platform
**Group:** 10 of 15
**Screens:** 91-100 (Phase 3 Marketplace Core)
**Design System:** Refer to Group 01 for complete design tokens

---

## Screen 91: Marketplace Home (3.1.1)

### Stitch Prompt

```
Create a marketplace home page with dark theme (#0F172A background).

**Layout:**
- Header with "Marketplace" title and search input (placeholder: "Search marketplace...")
- Horizontal category pills row with icons
- "Featured" section with horizontal scroll of large item cards
- "Trending This Week" section with numbered list
- "New Releases" section with smaller cards grid

**Category Pills:**
- Horizontal row with equal-width cards
- Categories: Modules 🔧, Chatbots 💬, Voice 🎙️, Canvas 🎨, All 📦
- Each pill: bg-slate-800 rounded-lg p-4, hover:border-indigo-500
- Icon centered above label
- Active state: bg-indigo-600/20 border-indigo-500

**Featured Section:**
- "Featured" header with "View All ▶" link right-aligned
- Horizontal scrollable container
- 3 visible cards, scroll for more
- Each featured card:
  - ⭐ Featured badge in top-left corner
  - Large thumbnail/preview area
  - Item title (bold)
  - Creator name subtitle
  - Star rating with review count (★★★★★ format)
  - Price badge ("$49/mo" or "Free")
  - bg-slate-800 rounded-xl border border-slate-700
  - Shadow and hover effects

**Trending Section:**
- "Trending This Week" header with "View All ▶"
- bg-slate-800 rounded-lg container
- Numbered list with trend indicators:
  - "1. AI Email Responder ↑3"
  - Arrow indicators in green (#10B981) for upward trend
- 2-column layout on desktop, single column mobile

**New Releases Section:**
- "New Releases" header
- 3-column grid of smaller cards
- Each card:
  - Item title
  - Star rating or "New!" badge for brand new items
  - Category indicator
  - bg-slate-800 rounded-xl

**Interactions:**
- Category click: filters entire page
- Card click: navigates to item detail
- Search: live filtering with suggestions dropdown
```

---

## Screen 92: Marketplace Item Detail (3.1.2)

### Stitch Prompt

```
Create a marketplace item detail page with dark theme (#0F172A background).

**Layout:**
- Back navigation: "← Back to Marketplace"
- Two-column layout: screenshots (left), item info (right)
- Tab navigation: Overview | Docs | Reviews
- Item description below tabs
- "From the Creator" section at bottom

**Screenshot Gallery (Left Column):**
- Large main screenshot display
- Navigation controls: [◄] 1/5 [►]
- Thumbnail dots or strip below
- Click to enlarge to lightbox
- bg-slate-800 rounded-xl container

**Item Info Panel (Right Column):**
- Item title (large, bold)
- "by [Creator Name]" subtitle
- Star rating: ★★★★★ 4.9 with review count "(234 reviews)"
- Pricing box:
  - bg-slate-800 rounded-lg p-4 border border-slate-600
  - Main price: "$49/month" (large)
  - Annual option: "or $470/year (save 20%)"
  - Primary CTA: "Install Now" button (bg-indigo-600)
  - Secondary CTA: "Try Free 14 Days" button (outline)

**Includes List:**
- Bullet list with checkmarks:
  - "• FAQ Chatbot"
  - "• Ticket Workflow"
  - "• CSAT Survey"
  - "• Analytics Dashboard"

**Requirements Section:**
- "Requirements:" header
- Bullet list of prerequisites:
  - "Pro plan or higher"
  - "Chatwoot integration"

**Tab Navigation:**
- Horizontal tabs: Overview | Docs | Reviews
- Underline indicator for active tab
- Content area below tabs

**From the Creator Section:**
- bg-slate-800 rounded-lg p-4 container
- Creator avatar (circular)
- Creator name with star rating and item count
- "Verified Creator" badge (green checkmark)
- Creator bio quote in italics
- Click to view creator profile

**Price Display:**
- Large price in white
- Discount badge for annual pricing
- Clear call-to-action buttons
```

---

## Screen 93: Skills Directory Browser (3.1.3)

### Stitch Prompt

```
Create a skills directory browser with dark theme (#0F172A background).

**Layout:**
- Header with "Skills Directory" title and search input
- Two-column layout: Filters panel (left), Skills grid (right)
- Project Skills section with create button
- Platform Skills section with view all link

**Filters Panel (Left):**
- "Filters" header
- bg-slate-800 rounded-lg p-4 container
- Filter sections:

**Source Filter:**
- Radio group:
  - "○ All Skills"
  - "● My Project" (selected)
  - "○ My Account"
  - "○ Platform"

**Category Filter:**
- Checkbox list:
  - "☐ RAG"
  - "☑️ Chatbot" (checked)
  - "☑️ Integration" (checked)
  - "☐ Voice"
  - "☐ Canvas"

**Compatibility Filter:**
- Checkbox list:
  - "☑️ Module"
  - "☑️ Chatbot"
  - "☐ Voice"

**Rating Filter:**
- "★★★★+ only" toggle checkbox

**Skills Grid (Right):**

**Project Skills Section:**
- Header: "Project Skills (12)" with "[+ Create]" button
- 3-column grid of skill cards
- Each card:
  - Package icon "📦"
  - Skill name (e.g., "support-handler")
  - Version number (v1.2.0)
  - "Local" badge
  - bg-slate-800 rounded-lg border border-slate-700

**Platform Skills Section:**
- Header: "Platform Skills (156)" with "[View All]" link
- 3-column grid of skill cards
- Each card:
  - Package icon "📦" with optional ⭐ for featured
  - Skill name
  - Star rating (★★★★★ format)
  - Badge: "Official", "Verified", or "Free"
  - bg-slate-800 rounded-lg border border-slate-700

**Card Interactions:**
- Hover: border-indigo-500/50, slight lift
- Click: opens skill detail modal
```

---

## Screen 94: Skill Detail Modal (3.1.4)

### Stitch Prompt

```
Create a skill detail modal with dark theme (#0F172A background).

**Layout:**
- Modal header with "Skill: [name]" and close button
- Skill summary card with badges
- Tab navigation: Overview | SKILL.md | Versions | Usage
- Skill documentation content
- Version selector and action buttons at bottom

**Modal Container:**
- Max-width: 720px
- bg-slate-900 rounded-2xl border border-slate-700
- Shadow-xl for depth

**Skill Summary Card:**
- bg-slate-800 rounded-lg p-4 container
- Package icon "📦" with skill name
- "[⭐ Official]" badge (gold/amber) if applicable
- Description text
- Metadata row: "By: [team] | ★★★★★ 4.9 (234 uses)"
- Version and update info: "Version: 2.3.1 | Updated: 2 days ago"
- License info: "License: MIT"

**Tab Navigation:**
- Horizontal tabs: Overview | SKILL.md | Versions | Usage
- Underline indicator for active tab
- Content area adapts to selected tab

**Overview Tab Content:**
- Description paragraph
- **Inputs:** section with parameter definitions:
  - Parameter name (code font)
  - Type in parentheses
  - Description
- **Outputs:** section with return value definitions
- **Requirements:** section with prerequisites

**Parameter Format:**
- Each parameter:
  - `name` (type): description
  - Optional parameters marked with "(optional)"

**Version Selector:**
- Dropdown: "[▼ 2.3.1 (latest)]"
- Shows available versions with "latest" indicator

**Action Buttons:**
- "[View SKILL.md]": outline button
- "[Cancel]": outline button
- "[+ Add to Project]": primary button bg-indigo-600
- Right-aligned in footer

**Code Styling:**
- Parameter names and code in JetBrains Mono
- bg-slate-950 for inline code blocks
```

---

## Screen 95: MCP Registry Browser (3.2.1)

### Stitch Prompt

```
Create an MCP server registry browser with dark theme (#0F172A background).

**Layout:**
- Header with "MCP Server Registry" title and search input
- Two rows of category pills with icons
- "Featured MCP Servers" section with cards
- "Recently Added" compact list
- "Your Installed Servers" status bar at bottom

**Category Pills:**
- Two rows of category buttons
- Row 1: All (234), 📁 Filesys (45), 🌐 Web (67), 🗄️ Database (34), 🔧 DevOps (28)
- Row 2: 🤖 AI (56), 📊 Analytics (23), 🔐 Security (18), 📧 Comms (31)
- Each pill: bg-slate-800 rounded-lg p-3
- Icon centered, label below, count in parentheses
- Active state: bg-indigo-600 with white text

**Featured MCP Servers Section:**
- "Featured MCP Servers" header with "[View All ▶]" link
- 3-column grid of server cards
- Each card:
  - "⭐ Official" badge if applicable
  - Server name (e.g., "filesystem")
  - Description subtitle
  - Category icon and label (📁 Files)
  - "Tools: 12" and "Resources: 3" counts
  - Star rating with review count
  - Price indicator ("Free" or "$0.001/query")
  - "[Install]" button
  - bg-slate-800 rounded-xl border border-slate-700

**Recently Added Section:**
- "Recently Added" header
- bg-slate-800 rounded-lg container
- Compact list format:
  - Bullet point • with server name
  - Relative time "(3 days ago)"
  - Brief description after dash
- 3 most recent items shown

**Installed Servers Bar:**
- "Your Installed Servers (8)" with "[Manage ▶]" link
- bg-slate-800 rounded-lg p-3 container
- Horizontal row of status indicators:
  - "🟢 filesystem (active)"
  - "🟢 web-search"
  - "🟡 slack (needs reauth)" - warning state
  - "3 more..." overflow indicator
- Status dots: 🟢 active, 🟡 warning, 🔴 stopped

**Card Hover Effects:**
- border-indigo-500/50
- Slight scale transform
- Shadow increase
```

---

## Screen 96: MCP Server Detail & Install (3.2.2)

### Stitch Prompt

```
Create an MCP server detail page with dark theme (#0F172A background).

**Layout:**
- Back navigation: "← Back to Registry"
- Server header card with badges
- Tab navigation: Overview | Tools (12) | Resources (3) | Reviews | Versions
- Tools table listing
- Resources list
- Requirements checklist
- Action buttons footer

**Server Header Card:**
- bg-slate-800 rounded-lg p-4 container
- Category icon (📁) with server name
- "⭐ Official" badge right-aligned
- Description text
- Metadata: "By: [creator] | ★★★★★ 4.9 (567 reviews)"
- Update info: "Last Updated: 2 days ago | v2.3.1"

**Tab Navigation:**
- Horizontal tabs with counts: Overview | Tools (12) | Resources (3) | Reviews | Versions
- Active tab: underline indicator

**Tools Table:**
- "Available Tools" header
- bg-slate-800 rounded-lg container
- Table format:
  - Headers: Tool Name | Description | Pricing
  - Rows with tool details:
    - read_file | Read file contents | Free
    - write_file | Write content to file | Free
    - (etc.)
  - "... 4 more tools" overflow indicator
- Alternate row shading for readability

**Resources Section:**
- "Resources Provided" header
- bg-slate-800 rounded-lg container
- Bullet list of resource URIs:
  - "• file:// - Access files by path"
  - "• directory:// - Access directory listings"
  - "• search:// - Search results as resource"

**Requirements Checklist:**
- "Requirements" header
- bg-slate-800 rounded-lg container
- Checklist format:
  - "☑️ Node.js 18+ (detected: v20.10.0)" - green check for met
  - "☑️ File system access permissions"
  - "⚠️ Configure allowed directories before use" - warning indicator

**Action Buttons:**
- bg-slate-800 rounded-lg p-4 footer
- "[View Documentation]": outline button
- "[🔧 Install Server]": primary button bg-indigo-600
- Centered alignment
```

---

## Screen 97: MCP Server Install Wizard (3.2.3)

### Stitch Prompt

```
Create an MCP server installation wizard step with dark theme (#0F172A background).

**Layout:**
- Header with server name and step indicator "Step 2/3"
- Configuration section with server name and directories
- Permission level radio selection
- Environment variables section (optional)
- Auto-start settings section
- Navigation buttons: Back, Test Connection, Install

**Step Indicator:**
- "Step 2/3" badge in header
- Progress indication (dots or bar)

**Configuration Section:**
- "Configuration" header
- bg-slate-800 rounded-lg p-4 container
- Form fields:

**Server Name Field:**
- Label: "Server Name (for reference):"
- Text input with default value
- bg-slate-900 border border-slate-600 rounded-lg

**Allowed Directories Field:**
- Label: "Allowed Directories:"
- Multi-line input or list of paths
- Each path on separate line
- "[+ Add Directory]" button below
- Warning text: "⚠️ The server will only access files in these paths"

**Permission Level:**
- "Permission Level:" label
- Radio group:
  - "○ Read Only - Can only read files"
  - "● Read/Write - Can read and modify files" (selected)
  - "○ Full Access - Can read, write, and delete files"
- Clear descriptions for each level

**Environment Variables Section:**
- "Environment Variables (Optional)" header
- bg-slate-800 rounded-lg p-4 container
- Key-value pair inputs:
  - [Key input] [Value input]
  - Example: MAX_FILE_SIZE | 10485760
- "[+ Add Variable]" button

**Auto-Start Settings:**
- bg-slate-800 rounded-lg p-4 container
- Checkboxes:
  - "☑️ Start server automatically when platform loads"
  - "☐ Enable for all projects (otherwise project-specific)"

**Navigation Buttons:**
- "[← Back]": outline button
- "[Test Connection]": secondary button
- "[Install]": primary button bg-indigo-600
- Right-aligned group

**Test Connection Interaction:**
- Click shows loading state
- Success: green checkmark with "Connection successful"
- Failure: red error message with details
```

---

## Screen 98: MCP Server Usage Dashboard (3.2.4)

### Stitch Prompt

```
Create an MCP server usage dashboard with dark theme (#0F172A background).

**Layout:**
- Header with "MCP Server Usage" title and time period dropdown
- Overview stats cards row (3 cards)
- "Usage by Server" table
- "Cost Breakdown" horizontal bar chart
- "Recent Tool Calls" activity log
- Footer actions: Add Server, Manage Budget, Export Report

**Time Period Dropdown:**
- "[This Month ▼]" dropdown in header
- Options: Today, This Week, This Month, This Year, Custom

**Overview Stats Cards:**
- 3-column row of stat cards
- Each card: bg-slate-800 rounded-xl p-4
- Cards:
  1. Tool Calls: "12,456" with "↑ 23%" trend (green)
  2. Cost: "$23.45" with "↑ 15%" trend
  3. Servers: "8 Active"
- Large number, label below, trend indicator

**Usage by Server Table:**
- "Usage by Server" header
- bg-slate-800 rounded-lg container
- Table columns: Server | Calls | Cost | Status | Actions
- Server rows with icons:
  - "📁 filesystem | 5,234 | $0.00 | 🟢 Active | [⚙️]"
  - "🌐 playwright | 3,456 | $0.00 | 🟢 Active | [⚙️]"
  - "🗄️ postgres | 2,345 | $11.73 | 🟢 Active | [⚙️]"
  - etc.
- Status indicators: 🟢 Active, 🟡 Reauth needed, 🔴 Stopped
- Settings gear icon for actions

**Cost Breakdown Chart:**
- "Cost Breakdown" header
- bg-slate-800 rounded-lg p-4 container
- Horizontal bar chart showing cost per server:
  - postgres: $11.73 (longest bar)
  - web-search: $6.17
  - github: $4.61
  - slack: $0.94
- Progress bar style with server name and amount
- Budget indicator: "Budget: $50.00/month | Used: $23.45 (47%)"
- Alert setting: "⚠️ Alert when reaching: [80%] of budget"

**Recent Tool Calls Log:**
- "Recent Tool Calls" header
- bg-slate-800 rounded-lg container
- Table format: Time | Server | Tool | Cost | Status
- Rows with recent activity:
  - "14:23:45 | filesystem | read_file | Free | ✓"
  - "14:23:42 | postgres | query | $0.005 | ✓"
- Checkmark ✓ for successful calls
- × for failed calls with error link

**Footer Actions:**
- "[+ Add Server]": outline button
- "[Manage Budget]": outline button
- "[Export Usage Report]": outline button
- Horizontal row, left-aligned
```

---

## Screen 99: Creator Dashboard (3.3.1)

### Stitch Prompt

```
Create a creator/publisher dashboard with dark theme (#0F172A background).

**Layout:**
- Header with "Creator Dashboard" title and "+ New Listing" button
- Earnings stats cards row (3 cards) with time period selector
- Revenue chart (line graph)
- "My Listings" table

**Header:**
- "Creator Dashboard" title left-aligned
- "[+ New Listing]" primary button right-aligned (bg-indigo-600)

**Time Period Selector:**
- "Earnings" label with "[This Month ▼]" dropdown
- Right-aligned above stats cards

**Earnings Stats Cards:**
- 3-column row of stat cards
- Each card: bg-slate-800 rounded-xl p-4
- Cards:
  1. Revenue: "$4,234" with "↑ 23%" trend (green)
  2. Installs: "892" with "↑ 15%" trend
  3. Avg Rating: "4.8★" with "↑ 0.1" trend
- Large value, label below, trend indicator with arrow

**Revenue Chart:**
- "Revenue Chart" header
- bg-slate-800 rounded-lg p-4 container
- Line chart showing monthly revenue:
  - X-axis: Jan, Feb, Mar, Apr, May, Jun, Jul
  - Y-axis: $0, $2k, $5k scale
  - Smooth line with data points
  - Fill gradient below line (indigo)
- Hover tooltips for exact values

**My Listings Table:**
- "My Listings (12)" header with "[Manage All ▶]" link
- bg-slate-800 rounded-lg container
- Table columns: Item | Status | Installs | Revenue
- Status indicators:
  - "● Live" (green dot)
  - "◐ Review" (half circle, yellow)
  - "○ Draft" (empty circle, gray)
- Draft items show "[Draft]" prefix in title
- Revenue and install counts; "-" for non-live items

**Table Rows:**
- Hover: bg-slate-700/50
- Click row to edit listing
- Status badges with appropriate colors

**Chart Styling:**
- Primary line color: #4F46E5
- Grid lines: #334155
- Axis labels: text-slate-400
```

---

## Screen 100: Listing Editor (3.3.2)

### Stitch Prompt

```
Create a marketplace listing editor with dark theme (#0F172A background).

**Layout:**
- Header with listing title and Preview/Save buttons
- "Basic Info" section with title, category, description
- "Pricing" section with pricing model options
- "Media" section for screenshots
- Footer actions: Save Draft, Submit for Review

**Header:**
- "Edit Listing: [title]" left-aligned
- "[Preview]" and "[Save]" buttons right-aligned

**Basic Info Section:**
- "Basic Info" header
- bg-slate-800 rounded-lg p-4 container
- Form fields:

**Title Field:**
- Label: "Title"
- Full-width text input
- bg-slate-900 border border-slate-600 rounded-lg

**Category Field:**
- Label: "Category:"
- Dropdown select "[▼ Chatbot Templates]"
- bg-slate-900 border border-slate-600 rounded-lg

**Description Field:**
- Label: "Short Description (160 chars)"
- Textarea with character count
- Hint text showing remaining characters
- bg-slate-900 border border-slate-600 rounded-lg

**Pricing Section:**
- "Pricing" header
- bg-slate-800 rounded-lg p-4 container
- Pricing model radio group:
  - "○ Free"
  - "● Paid" (selected)
  - "○ Freemium"
- Conditional fields for Paid:
  - "Monthly Price: [$49.00]" number input
  - "☑️ Offer annual discount (20% off)" checkbox
  - "☑️ Enable 14-day free trial" checkbox

**Media Section:**
- "Media" header
- bg-slate-800 rounded-lg p-4 container
- "Screenshots (up to 5)" label
- Horizontal row of thumbnail slots:
  - Filled slots show image preview with × to remove
  - Empty slot: "+ Add Image" with dashed border
- Drag to reorder functionality

**Screenshot Thumbnails:**
- Fixed aspect ratio (16:9 or 4:3)
- Numbered badges (1, 2, 3)
- bg-slate-700 for placeholder
- border-dashed border-slate-500 for empty slots

**Footer Actions:**
- "[Save Draft]": outline button
- "[Submit for Review]": primary button bg-indigo-600
- Right-aligned

**Form Validation:**
- Required fields marked with asterisk
- Inline error messages in red below fields
- Character count for description
```

---

## Design System Reference (Group 10)

All screens in this group use the established design tokens:

| Token | Value | Usage |
|-------|-------|-------|
| Background | #0F172A | Page background |
| Surface | #1E293B | Cards, containers |
| Surface Elevated | #334155 | Hover states, dropdowns |
| Border | #475569 | Dividers, card borders |
| Primary | #4F46E5 | Buttons, active states |
| Primary Hover | #4338CA | Button hover |
| Text Primary | #F8FAFC | Headings, body text |
| Text Secondary | #94A3B8 | Descriptions, metadata |
| Text Muted | #64748B | Placeholders, disabled |
| Success | #10B981 | Active status, positive trends |
| Warning | #F59E0B | Reauth needed, caution |
| Error | #EF4444 | Stopped status, errors |
| Star Rating | #FBBF24 | Rating stars |
| Official Badge | #F59E0B | Gold/amber for official items |

**Status Indicators:**
- 🟢 Active/Live: #10B981
- 🟡 Warning/Review: #F59E0B
- 🔴 Stopped/Error: #EF4444
- ○ Draft: #64748B (gray outline)

**Typography:**
- Font Family: Inter (UI), JetBrains Mono (code)
- Base size: 14px

**Spacing:**
- Base unit: 8px
- Card padding: 16-24px
- Section gaps: 24-32px

---

## Cross-References

| Screen | PRD Requirement | Architecture Component | UX Component Count |
|--------|-----------------|----------------------|-------------------|
| 3.1.1 | FR216-FR235 | MarketplaceHome | 9 components |
| 3.1.2 | FR216-FR235 | MarketplaceDetail | 11 components |
| 3.1.3 | FR115 | SkillsDirectory | 8 components |
| 3.1.4 | FR115 | SkillDetailModal | 7 components |
| 3.2.1 | FR100-FR113 | MCPRegistry | 10 components |
| 3.2.2 | FR100-FR113 | MCPServerDetail | 9 components |
| 3.2.3 | FR100-FR113 | MCPInstallWizard | 8 components |
| 3.2.4 | FR100-FR113 | MCPUsageDashboard | 11 components |
| 3.3.1 | FR236-FR250 | CreatorDashboard | 7 components |
| 3.3.2 | FR236-FR250 | ListingEditor | 9 components |

---

## AG-UI/A2UI Integration Points

| Screen | Dynamic Zone | Integration Type |
|--------|-------------|------------------|
| 3.1.1 | Featured/Trending sections | Dynamic content loading |
| 3.1.2 | Item details, reviews | Server-rendered with hydration |
| 3.1.4 | Skill documentation | Markdown rendering (SKILL.md) |
| 3.2.2 | Tools and resources lists | Dynamic data from MCP discovery |
| 3.2.4 | Usage charts, recent calls | Real-time streaming updates |
| 3.3.1 | Revenue chart, listings | AGENT_CONTENT_ZONE for analytics |
