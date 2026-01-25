# Google Stitch Prompts - Group 5 (Screens 41-50)

**Project:** Hyyve Platform
**Screens:** Settings (Profile, Account, API Keys, Workspace) + Canvas Builder Core (MCP Tools)
**Design System:** shadcn/ui + Tailwind CSS (Dark Theme Primary)

---

## Screen 1.10.1: User Profile & Preferences

### Stitch Prompt

```
Create a comprehensive user profile and preferences settings page with personal info, notifications matrix, and accessibility options.

LAYOUT:
- Full page with navigation sidebar (established pattern)
- Single column settings form, max-width 800px centered
- Sticky "Save All" button in header

PAGE HEADER:
- Title: "Profile & Preferences"
- Right side: "Save All" primary button (#4F46E5)
- Border-bottom: 1px solid #334155

PROFILE CARD SECTION (Top):
- Two-column layout at top
- Left column: Avatar section (240px wide)
- Right column: Personal information form

Left Column - Avatar Area:
- Card background: #1E293B
- Border radius: 12px
- Padding: 24px
- Centered content

Avatar Display:
- 120px x 120px circular avatar
- Border: 3px solid #4F46E5
- Placeholder: User initials on gradient background
- Below avatar: "Change Photo" button (outline style)
- User name below: "Chris Johnson" 18px Semibold
- Role badge: "Admin" pill (#4F46E5/20 background, #4F46E5 text)
- "Member since Jan 2024" 12px #64748B

Right Column - Personal Information:
- Card background: #1E293B
- Section header: "Personal Information" 16px Semibold
- Padding: 24px
- Border radius: 12px

Form Fields (4 fields, vertical stack):
1. Full Name
   - Label: "Full Name" 14px #94A3B8
   - Input: "Chris Johnson"
   - Standard text input styling

2. Email
   - Label: "Email"
   - Input: "chris@example.com"
   - Verification badge: green checkmark icon inline

3. Display Name
   - Label: "Display Name"
   - Input: "Chris J."
   - Helper text: "Shown to other users" 12px #64748B

4. Job Title
   - Label: "Job Title"
   - Input: "Product Manager"

NOTIFICATION PREFERENCES SECTION:
- Card background: #1E293B
- Section header: "Notification Preferences" 16px Semibold
- Full-width matrix table

Matrix Table:
- Header row: "" | "In-App" | "Email" | "Push" | "Slack"
- Header styling: 12px uppercase #64748B
- Column width: 80px each except first column (flexible)

Notification Rows (7 rows):
1. Execution Failures: [✓] [✓] [ ] [✓]
2. Workflow Completed: [✓] [ ] [ ] [ ]
3. Comments & Mentions: [✓] [✓] [✓] [✓]
4. Usage Alerts: [✓] [✓] [ ] [ ]
5. Security Events: [✓] [✓] [✓] [✓]
6. Product Updates: [ ] [✓] [ ] [ ]
7. Weekly Digest: [ ] [✓] [ ] [ ]

Checkbox styling:
- Unchecked: border #475569
- Checked: filled #4F46E5 with white checkmark
- Hover: border #4F46E5

Row styling:
- Alternating row backgrounds: #1E293B / #1E293B (subtle)
- Divider lines: 1px solid #334155
- Row height: 48px
- Vertical alignment: center

INTERFACE PREFERENCES SECTION:
- Card background: #1E293B
- Padding: 24px
- Section header: "Interface Preferences"

Theme Toggle:
- Label: "Theme"
- Radio button group (horizontal):
  - ○ Light
  - ● Dark (selected - filled #4F46E5)
  - ○ System
- Spacing: 16px between options

Dropdown Selectors (3):
1. Language: "English (US)" dropdown
2. Timezone: "America/New_York (EST)" dropdown
3. Date Format: "MM/DD/YYYY" dropdown + Time: "12-hour" dropdown (inline)

Toggle Checkboxes (3):
- ☑ Show keyboard shortcuts hints
- ☐ Enable compact mode
- ☑ Auto-save drafts every 30 seconds

Checkbox styling: square with rounded corners

ACCESSIBILITY SECTION:
- Card background: #1E293B
- Padding: 24px
- Section header: "Accessibility"

Accessibility Options (4):
- ☐ Reduce motion animations
- ☐ High contrast mode
- ☐ Screen reader optimizations
- Font size: "Normal" dropdown selector

DESIGN TOKENS:
- Background: #0F172A
- Card backgrounds: #1E293B
- Input backgrounds: #0F172A
- Border color: #334155
- Text primary: #F8FAFC
- Text secondary: #94A3B8
- Text muted: #64748B
- Primary accent: #4F46E5

STATES:
- Input focus: border #4F46E5, ring 2px #4F46E5/20
- Save button: hover darken 10%
- Unsaved changes indicator: dot badge on Save button

ACCESSIBILITY:
- Form field labels associated with inputs
- Logical tab order through sections
- Checkbox states announced by screen readers
- Color not sole indicator of state
```

---

## Screen 1.10.2: Account Settings

### Stitch Prompt

```
Create an account settings page with authentication management, connected accounts, active sessions, and danger zone actions.

LAYOUT:
- Full page with navigation sidebar
- Single column, max-width 800px centered
- Sections stacked vertically with 24px gaps

PAGE HEADER:
- Title: "Account Settings"
- No right-side actions (section-specific buttons)

AUTHENTICATION SECTION:
- Card background: #1E293B
- Section header: "Authentication" 16px Semibold
- Padding: 24px
- Border radius: 12px

Basic Auth Row Items:
1. Email Row:
   - Label: "Email:" #94A3B8
   - Value: "chris@example.com"
   - Action: "[Change]" text button right-aligned

2. Password Row:
   - Label: "Password:" #94A3B8
   - Value: "Last changed 45 days ago"
   - Action: "[Change]" text button right-aligned
   - Divider below: 1px solid #334155

Two-Factor Authentication Subsection:
- Nested card with lighter border
- Header: "Two-Factor Authentication"
- Status badge: "✅ Enabled" green pill

MFA Configuration Items:
1. Authenticator App:
   - Icon: shield icon
   - Status: "✓ Configured (Google Auth)"
   - Actions: "[Reconfigure]" "[Remove]" text buttons

2. Backup Codes:
   - Icon: key icon
   - Status: "7 of 10 remaining"
   - Actions: "[View Codes]" "[Regenerate]" text buttons

3. Recovery Email:
   - Icon: mail icon
   - Value: "c***@backup.com" (masked)
   - Action: "[Update Recovery Email]" text button

CONNECTED ACCOUNTS SECTION:
- Card background: #1E293B
- Section header: "Connected Accounts"
- Padding: 24px

Connected Account Cards (2):
Card Structure:
- Horizontal layout
- Provider icon (32px): Google icon / GitHub icon
- Provider name: "Google" / "GitHub"
- Account identifier: "chris@gmail.com" / "chrisjohnson"
- Connection date: "Connected Jan 15, 2024" #64748B
- Action: "[Disconnect]" text button (red on hover)

Add Connection Buttons:
- Row of outline buttons:
  - "[+ Connect Microsoft]"
  - "[+ Connect Slack]"
- Button styling: border #475569, hover border #4F46E5

ACTIVE SESSIONS SECTION:
- Card background: #1E293B
- Section header: "Active Sessions"
- Padding: 24px

Sessions Table:
- Columns: Device | Location | Last Active | Action
- Column widths: flex | 100px | 100px | 80px

Session Rows (3):
1. Current Session (highlighted):
   - Device: "🖥️ Chrome/Mac"
   - Location: "New York"
   - Last Active: "Now (this)" with green dot
   - No revoke button for current

2. Second Session:
   - Device: "📱 iOS App"
   - Location: "New York"
   - Last Active: "2 hours ago"
   - Action: "[Revoke]" text button

3. Third Session:
   - Device: "🖥️ Firefox/Win"
   - Location: "Boston"
   - Last Active: "3 days ago"
   - Action: "[Revoke]" text button

Bottom Action:
- "[Revoke All Other Sessions]" destructive outline button
- Full width, centered
- Red border, red text on hover

ACCOUNT ACTIONS (DANGER ZONE):
- Card background: #1E293B
- Red left border: 4px solid #EF4444
- Section header: "Account Actions" with warning icon
- Padding: 24px

Danger Actions (2):
1. Export Data:
   - Icon: download icon
   - Title: "Export Data" 16px Semibold
   - Description: "Download all your data including workflows, KBs, and settings." #94A3B8
   - Action: "[Request Export]" outline button
   - Divider below

2. Delete Account:
   - Icon: trash icon (#EF4444)
   - Title: "Delete Account" 16px Semibold #EF4444
   - Description: "Permanently delete your account and all associated data. This action cannot be undone."
   - Action: "[Delete Account]" destructive button
   - Button: background #EF4444, white text

DESIGN TOKENS:
- Primary: #4F46E5
- Success: #10B981
- Danger: #EF4444
- Background: #0F172A
- Card: #1E293B
- Border: #334155

STATES:
- Revoke hover: red text
- Disconnect hover: red text
- Delete button hover: darken background
- Current session: subtle green background tint

RESPONSIVE:
- Mobile: Stack connected accounts vertically
- Sessions table: horizontal scroll on mobile
- Danger zone: full width actions
```

---

## Screen 1.10.3: API Keys Management

### Stitch Prompt

```
Create an API keys management interface with key cards, permission controls, and usage statistics.

LAYOUT:
- Full page with navigation sidebar
- Single column, max-width 900px centered
- Sections stacked with 24px gaps

PAGE HEADER:
- Title: "API Keys"
- Right side: "+ Create Key" primary button (#4F46E5)

SECURITY WARNING BANNER:
- Full width alert
- Background: #FEF3C7 (amber-100)
- Border-left: 4px solid #F59E0B
- Icon: warning triangle
- Text: "Keep your API keys secure. Never share them publicly."
- Text color: #92400E (amber-800)

YOUR API KEYS SECTION:
- Section header: "Your API Keys"
- Vertical stack of key cards

API Key Card Structure (repeated for each key):
- Card background: #1E293B
- Border radius: 12px
- Padding: 20px
- Border: 1px solid #334155
- Margin-bottom: 16px

Card 1 - Production Key:
Header Row:
- Badge: "Production" pill (green background #10B981/20, green text)
- Name: "Production API Key" 16px Semibold
- Status indicator: green dot

Key Display Row:
- Label: "Key:"
- Masked value: "sk_live_••••••••••••••••••••••8f4a"
- Font: JetBrains Mono, 14px
- Background: #0F172A (darker)
- Padding: 8px 12px
- Border radius: 6px
- "[Copy]" icon button right-side

Metadata Row:
- "Created: Jan 15, 2024 by chris@example.com" #64748B
- "Last used: 5 minutes ago" #64748B

Permissions Grid:
- Label: "Permissions:" #94A3B8
- Checkbox display (read-only view):
  - ☑ Execute workflows  ☑ Read KBs  ☐ Write KBs
  - ☑ Read modules       ☐ Write modules
- Smaller text, inline layout

Restrictions Row:
- "IP Restrictions: None"
- "Rate Limit: 1000 req/min"

Actions Row:
- "[Edit Permissions]" text button
- "[Rotate Key]" text button (amber color)
- "[Delete]" text button (red color)

Card 2 - Development Key:
- Badge: "Development" pill (blue background #3B82F6/20)
- Name: "Development/Testing"
- Key: "sk_test_••••••••••••••••••••••2b1c"
- Created/Last used metadata
- Permissions: "Full access (dev environment)"
- IP Restrictions: "192.168.1.0/24" (highlighted)
- Expiration: "Feb 20, 2024 (30 days)" with warning icon if soon
- Actions: "[Edit]" "[Extend Expiry]" "[Delete]"

CREATE NEW API KEY FORM:
- Card background: #1E293B
- Section header: "Create New API Key"
- Padding: 24px
- Collapsible or always visible

Form Fields:
1. Name Input:
   - Label: "Name"
   - Input: placeholder "Integration Key"
   - Full width

2. Environment Radio:
   - Label: "Environment"
   - Options: ○ Production  ● Development
   - Horizontal layout

3. Permissions Checkboxes:
   - Label: "Permissions"
   - Grid layout (2 columns):
     - ☑ Execute workflows (run modules, chatbots)
     - ☑ Read knowledge bases
     - ☐ Write knowledge bases (upload, modify)
     - ☐ Manage modules (create, edit, delete)
     - ☐ Admin access (billing, team management)
   - Each with descriptive helper text

4. Restrictions Section:
   - Label: "Restrictions (optional)"
   - IP Allowlist: text input, placeholder "192.168.1.0/24"
   - Expiration: ○ Never  ● After [30 ▼] days
   - Dropdown for days selection

5. Submit Button:
   - "[Create Key]" primary button
   - Full width or right-aligned

API USAGE SECTION:
- Card background: #1E293B
- Section header: "API Usage"
- Padding: 24px

Usage Display:
- Text: "This Month: 45,234 / 100,000 requests"
- Progress bar below:
  - Width: 100%
  - Height: 8px
  - Background: #334155
  - Fill: #4F46E5 at 45%
  - Border radius: 4px
- Percentage: "45%" right-aligned
- Link: "[View Detailed Usage →]" text button

DESIGN TOKENS:
- Primary: #4F46E5
- Success/Production: #10B981
- Development: #3B82F6
- Warning: #F59E0B
- Danger: #EF4444
- Code font: JetBrains Mono

STATES:
- Copy button: tooltip "Copied!" on click
- Key rotation: confirmation modal
- Delete: confirmation modal with key name typing
- Hover on cards: subtle border color change

ACCESSIBILITY:
- Keys never fully displayed for security
- Copy action provides screen reader feedback
- Delete requires explicit confirmation
```

---

## Screen 1.10.4: Workspace Settings

### Stitch Prompt

```
Create a workspace settings page with organization details, default configurations, security policies, integrations, and danger zone.

LAYOUT:
- Full page with navigation sidebar
- Single column, max-width 800px centered
- Sections stacked with 24px gaps

PAGE HEADER:
- Title: "Workspace Settings"
- Right side: "Save All" primary button

GENERAL SECTION:
- Card background: #1E293B
- Section header: "General"
- Padding: 24px
- Border radius: 12px

General Form Fields:
1. Workspace Name:
   - Label: "Workspace Name"
   - Input: "Acme Corp AI Team"
   - Full width

2. Workspace URL:
   - Label: "Workspace URL"
   - Prefix: "https://app.hyyve.ai/" (non-editable, #64748B)
   - Input: "acme-corp" (editable slug)
   - Inline layout

3. Description:
   - Label: "Description (optional)"
   - Textarea: "AI automation team for customer support and sales"
   - 3 rows height

4. Workspace Icon:
   - Label: "Workspace Icon"
   - Current icon display: 64x64 square with letter "A"
   - "[Upload new icon]" button
   - Helper: "Recommended: 256x256px, PNG or SVG"

DEFAULT SETTINGS SECTION:
- Card background: #1E293B
- Section header: "Default Settings"
- Padding: 24px

Default Configuration Fields:
1. Default LLM Provider:
   - Label: "Default LLM Provider"
   - Dropdown: "Anthropic" selected
   - Options: Anthropic, OpenAI, Google, Azure OpenAI

2. Default Model:
   - Label: "Default Model"
   - Dropdown: "Claude Sonnet 4" selected
   - Depends on provider selection

3. Default Embedding Model:
   - Label: "Default Embedding Model"
   - Dropdown: "text-embedding-3-small"

Toggle Options (3):
- ☑ Enable cost tracking for all executions
- ☑ Auto-archive unused modules after [90 ▼] days
- ☐ Require approval for module publishing

Each toggle on its own row with descriptive label

SECURITY POLICIES SECTION:
- Card background: #1E293B
- Section header: "Security Policies"
- Icon: shield icon next to header
- Padding: 24px

Security Checkboxes:
- ☑ Require MFA for all team members
- ☑ Enforce SSO login (when configured)
- ☐ Restrict API access to allowlisted IPs only

Security Dropdowns:
1. Session timeout: [8 hours ▼]
   - Options: 1 hour, 2 hours, 4 hours, 8 hours, 24 hours, 1 week

2. Password policy: [Strong (12+ chars, mixed) ▼]
   - Options: Basic, Standard, Strong, Custom

3. Data retention: [365 ▼] days
   - Numeric input with "days" suffix

Audit Toggle:
- ☑ Enable audit logging
- Helper text: "Track all user actions for compliance"

INTEGRATIONS SECTION:
- Card background: #1E293B
- Section header: "Integrations"
- Padding: 24px

Integration Cards (2):

Slack Integration Card:
- Provider icon: Slack logo (32px)
- Name: "Slack Workspace"
- Status: "✅ Connected to #hyyve-notifications" (green text)
- Actions: "[Configure Channels]" "[Disconnect]" buttons
- Background: slightly elevated #0F172A

GitHub Integration Card:
- Provider icon: GitHub logo (32px)
- Name: "GitHub Organization"
- Status: "⚠️ Not connected" (amber text)
- Action: "[Connect GitHub]" primary button

DANGER ZONE SECTION:
- Card background: #1E293B
- Red left border: 4px solid #EF4444
- Section header: "Danger Zone" with warning icon
- Padding: 24px

Danger Actions (2):

1. Transfer Ownership:
   - Icon: user-switch icon
   - Title: "Transfer Ownership" 16px Semibold
   - Description: "Transfer this workspace to another admin."
   - Action: "[Transfer Workspace]" outline button

2. Delete Workspace:
   - Icon: trash icon (#EF4444)
   - Title: "Delete Workspace" 16px Semibold #EF4444
   - Description: "Permanently delete this workspace and all data. This cannot be undone."
   - Action: "[Delete Workspace]" destructive button (red background)

DESIGN TOKENS:
- Primary: #4F46E5
- Success: #10B981
- Warning: #F59E0B
- Danger: #EF4444
- Card: #1E293B
- Border: #334155

STATES:
- Unsaved changes: indicator on Save button
- Integration disconnect: confirmation required
- Delete workspace: type workspace name to confirm
- Dropdown focus: border #4F46E5

RESPONSIVE:
- Mobile: Stack all fields vertically
- Integration cards: full width on mobile
```

---

## Screen 2.1.1: Canvas Builder - Main View

### Stitch Prompt

```
Create the main Canvas Builder interface with three-panel layout: knowledge base sidebar, central canvas workspace, and AI assistant chat panel.

LAYOUT:
- Full viewport height (calc(100vh - navbar height))
- Three-column layout:
  - Left sidebar: 240px (collapsible)
  - Center canvas: flexible (remaining space)
  - Right panel: 320px (collapsible)
- No outer padding (edge-to-edge)

HEADER BAR:
- Height: 48px
- Background: #1E293B
- Border-bottom: 1px solid #334155

Header Left:
- Hamburger menu icon (collapse sidebar)
- Canvas name: "Canvas: Landing Page" (editable on click)
- Breadcrumb or project context

Header Right:
- "[Preview]" outline button
- "[Export]" primary button
- "⚙️" settings icon button

LEFT SIDEBAR - KNOWLEDGE BASE:
- Width: 240px
- Background: #0F172A
- Border-right: 1px solid #334155
- Scrollable content

Sidebar Sections:

1. Brand Assets Section:
   - Collapsible header: "KB" with expand arrow
   - Nested card: "Brand Guide"
   - Sub-items: "Colors", "Fonts" (indented)
   - Each item has icon + label

2. Components Library:
   - Collapsible header: "Comps"
   - List items: "Button", "Card", "Input"
   - Each draggable to canvas

3. Add Section:
   - "[+] Add" button at bottom
   - Opens KB source picker

Drag indicator: grab cursor on hover

CENTER CANVAS WORKSPACE:
- Background: #0F172A
- Grid pattern: subtle dots or lines (#1E293B)
- Scrollable and zoomable

Canvas Content Example:
- Hero Section container (outlined when selected)
  - Logo placeholder (80px)
  - Nav placeholder (horizontal)
  - Headline text block
  - "[Call to Action]" button component

- Features Grid container below
  - 3 feature cards in row
  - Each card: icon + text placeholder

Selection States:
- Selected element: blue border (#4F46E5), resize handles
- Hover: dashed border preview
- Multi-select: shift+click, selection box

Canvas Footer:
- Layers panel (horizontal, bottom)
- Layer chips: "Hero", "Features", "CTA"
- Zoom control: magnifier icon + percentage
- Currently: "Layers [🔍]"

RIGHT SIDEBAR - ARTIE AI ASSISTANT:
- Width: 320px
- Background: #1E293B
- Border-left: 1px solid #334155

Chat Header:
- "ARTIE" title with bot icon
- "(Chat Agent)" subtitle
- Collapse button

Chat Content Area:
- Scrollable message list
- Background: #0F172A within

AI Message Bubble:
- Background: #1E293B
- Border-radius: 12px
- Padding: 12px
- "Artie: Let's create your landing page!"

Style Selection UI:
- "What style are you going for?"
- Radio options (vertical):
  - ○ Minimal
  - ○ Bold
  - ○ Playful
  - ○ Corporate

Chat Input:
- Position: bottom of panel
- Input field with placeholder: "Describe it"
- Send button (arrow icon)
- Background: #0F172A

INTERACTIONS:
- Drag from KB sidebar to canvas
- Click canvas element to select
- Artie generates components from text
- Real-time preview updates
- Double-click text to edit inline

RESPONSIVE:
- Below 1200px: collapse right panel by default
- Below 900px: collapse left sidebar
- Touch: pinch to zoom canvas

ACCESSIBILITY:
- Keyboard navigation through canvas layers
- Screen reader announces selected element
- Focus trap in chat input

AGENT_CONTENT_ZONE:
- Chat message area: AG-UI streaming zone
- AI-suggested components could use A2UI adjacency list
```

---

## Screen 2.1.2: Component Inspector

### Stitch Prompt

```
Create a component inspector panel that appears when a canvas element is selected, showing content, style, and interaction properties.

LAYOUT:
- Slide-in panel from right (or replace AI chat panel)
- Width: 320px
- Height: 100% of canvas area
- Background: #1E293B

PANEL HEADER:
- Title: "Component: Hero Button" (dynamic based on selection)
- Close button: [×] top-right
- Padding: 16px
- Border-bottom: 1px solid #334155

CONTENT SECTION:
- Collapsible section header: "Content" with chevron
- Background: #0F172A when expanded
- Border radius: 8px
- Padding: 16px
- Margin: 16px

Content Fields:
1. Text Input:
   - Label: "Text"
   - Input: "Get Started"
   - Full width

2. Link Input:
   - Label: "Link"
   - Input: "/signup"
   - Full width

STYLE SECTION:
- Collapsible section header: "Style"
- Same card styling as Content section

Style Controls:

1. Variant Selector:
   - Label: "Variant"
   - Dropdown: "Primary" selected
   - Options: Primary, Secondary, Outline, Ghost, Link

2. Size Selector:
   - Label: "Size"
   - Dropdown: "Large"
   - Options: Small, Medium, Large

3. Background Color:
   - Label: "Background"
   - Color swatch: filled square showing #4F46E5
   - Hex input: "#4F46E5"
   - "[From Brand]" text button to pick from KB

4. Text Color:
   - Label: "Text Color"
   - Color swatch: white
   - Hex input: "#FFFFFF"

5. Border Radius Slider:
   - Label: "Border Radius"
   - Slider: range 0-24px
   - Current value display: "8px"
   - Slider track: #334155
   - Slider thumb: #4F46E5

6. Shadow Selector:
   - Label: "Shadow"
   - Dropdown: "Medium"
   - Options: None, Small, Medium, Large

INTERACTIONS SECTION:
- Collapsible section header: "Interactions"
- Same card styling

Interaction Controls:
1. On Hover:
   - Label: "On Hover"
   - Dropdown: "Scale Up"
   - Options: None, Scale Up, Lift, Glow, Color Change

2. On Click:
   - Label: "On Click"
   - Dropdown: "Navigate"
   - Options: Navigate, Open Modal, Submit Form, Custom Action

PANEL FOOTER:
- Sticky at bottom
- "[✨ Suggest Improvements]" AI-powered button
- "[Reset]" text button
- "[Apply]" primary button
- Padding: 16px
- Background: #1E293B
- Border-top: 1px solid #334155

DESIGN TOKENS:
- Panel background: #1E293B
- Section background: #0F172A
- Input background: #0F172A
- Border: #334155
- Slider track: #334155
- Slider fill: #4F46E5
- Primary button: #4F46E5

STATES:
- Section collapsed: chevron rotated
- Color picker: opens popover
- Slider dragging: real-time preview
- Apply: validates and closes
- Unsaved changes: dot indicator

ANIMATIONS:
- Panel slide-in: 200ms ease-out
- Section expand/collapse: 150ms
- Color picker: fade in
```

---

## Screen 2.1.3: AI Generation Modal

### Stitch Prompt

```
Create a modal dialog for AI-powered component generation with text prompt, KB references, style presets, and live preview.

LAYOUT:
- Centered modal overlay
- Modal width: 640px
- Background overlay: #0F172A/80
- Modal background: #1E293B
- Border radius: 16px
- Padding: 24px

MODAL HEADER:
- Title: "Generate with AI" 20px Semibold
- Close button: [×] top-right
- Border-bottom: 1px solid #334155
- Padding-bottom: 16px

PROMPT INPUT SECTION:
- Label: "Describe what you want:" 14px #94A3B8
- Textarea input:
  - Height: 120px
  - Background: #0F172A
  - Border: 1px solid #334155
  - Border radius: 8px
  - Padding: 12px
  - Placeholder text example:
    "Create a pricing section with 3 tiers:
    - Basic ($29/mo)
    - Pro ($79/mo) - highlighted
    - Enterprise (Contact us)
    Use our brand colors and include feature lists"
  - Font: 14px

KNOWLEDGE BASE REFERENCES:
- Label: "Reference from KB:" 14px #94A3B8
- Checkbox row (horizontal):
  - ☑️ Brand Guidelines
  - ☑️ Pricing Data
  - ☐ Testimonials
- Checkboxes use pill/chip styling
- Checked: background #4F46E5/20, border #4F46E5

STYLE PRESET SELECTOR:
- Label: "Style Preset:" 14px #94A3B8
- Dropdown: "Match Current Page" selected
- Options:
  - Match Current Page (default)
  - Minimal & Clean
  - Bold & Colorful
  - Corporate Professional
  - Custom (configure)

PREVIEW SECTION:
- Label: "PREVIEW" 12px uppercase #64748B
- Preview container:
  - Background: #0F172A
  - Border: 1px dashed #334155
  - Border radius: 8px
  - Min-height: 200px
  - Padding: 24px
  - Centered content

Preview Content Example (Pricing Cards):
- 3 pricing cards side by side
- Basic card: "$29/mo" header, "[Start]" button
- Pro card: starred/highlighted, "$79/mo", "[Upgrade]" button
- Enterprise card: "Contact" header, "[Contact]" button
- Cards simplified/schematic representation

Loading State:
- Shimmer animation on preview area
- "Generating..." text with spinner

MODAL FOOTER:
- Border-top: 1px solid #334155
- Padding-top: 16px
- Button row (right-aligned):
  - "[Regenerate]" outline button with refresh icon
  - "[Cancel]" ghost button
  - "[Insert to Canvas]" primary button

DESIGN TOKENS:
- Modal background: #1E293B
- Preview background: #0F172A
- Border: #334155
- Primary: #4F46E5
- Textarea: monospace hint for prompt

STATES:
- Empty prompt: Insert button disabled
- Generating: spinner, buttons disabled
- Generated: preview visible, all buttons enabled
- Error: error message below preview, retry option

ANIMATIONS:
- Modal entrance: scale from 95% + fade
- Preview generation: shimmer then fade-in
- Regenerate: pulse effect on preview

ACCESSIBILITY:
- Focus trap within modal
- Escape key closes
- Announce generation completion
- Preview described for screen readers

AGENT_CONTENT_ZONE:
- Preview area: A2UI component for streaming generation
- Real-time updates as AI generates
```

---

## Screen 2.1.4: MCP Tool Node Configuration

### Stitch Prompt

```
Create a modal for adding MCP (Model Context Protocol) tool nodes to the canvas, with server selection and available tools listing.

LAYOUT:
- Centered modal
- Width: 560px
- Background: #1E293B
- Border radius: 16px
- Padding: 0 (sections have own padding)

MODAL HEADER:
- Title: "Add MCP Tool Node" 18px Semibold
- Close button: [×]
- Padding: 20px 24px
- Border-bottom: 1px solid #334155

SERVER SELECTION SECTION:
- Section label: "Select MCP Server" 14px Semibold
- Padding: 16px 24px
- Background: #0F172A

Server List (Radio Group):
- Scrollable if many servers
- Max-height: 160px

Server Item Structure:
- Radio button (●/○)
- Status indicator: colored dot (green/red)
- Server name + transport type in parentheses
- Tool count badge: "[12 tools]"

Server Items (4):
1. ● 🟢 filesystem (stdio)     [12 tools]  ← selected
2. ○ 🟢 github (http)          [8 tools]
3. ○ 🟢 slack (http)           [5 tools]
4. ○ 🔴 database (offline)     - (grayed out, not selectable)

Status Colors:
- 🟢 Connected: #10B981
- 🔴 Offline: #EF4444
- 🟡 Connecting: #F59E0B

AVAILABLE TOOLS SECTION:
- Section label: "Available Tools from 'filesystem'" 14px Semibold
- Dynamic based on selected server
- Padding: 16px 24px
- Scrollable list

Tool Item Structure:
- Card-like appearance per tool
- Border: 1px solid #334155
- Border radius: 8px
- Padding: 12px
- Margin-bottom: 8px
- Hover: border #4F46E5

Tool Item Content:
1. Tool Header Row:
   - Icon: 🔧 wrench icon
   - Tool name: "read_file" monospace font

2. Description Row:
   - "Read content from a file path" #94A3B8

3. Params Row:
   - "Params: path (string, required)" 12px #64748B
   - Italicized parameter info

4. Warning Badge (conditional):
   - For sensitive operations: "⚠️ Requires explicit consent"
   - Background: #F59E0B/20
   - Text: #F59E0B

5. Add Button:
   - "[+ Add Node]" button right-aligned
   - Outline style, primary on hover

Tool Items (3 examples):
1. read_file:
   - "Read content from a file path"
   - "Params: path (string, required)"

2. write_file:
   - "Write content to a file path"
   - "Params: path (string), content (string)"
   - ⚠️ Requires explicit consent

3. list_directory:
   - "List files in a directory"
   - "Params: path (string, optional)"

MODAL FOOTER:
- Padding: 16px 24px
- Border-top: 1px solid #334155

Footer Content:
- "[🔍 Search Tools]" text button with search icon (left)
- "[Cancel]" ghost button (right)

Search Expansion:
- When clicked, shows search input inline
- Filters tools by name or description

DESIGN TOKENS:
- Modal bg: #1E293B
- Section bg: #0F172A
- Connected: #10B981
- Offline: #EF4444
- Warning: #F59E0B
- Code font: JetBrains Mono

STATES:
- Server selected: radio filled, tools load
- Offline server: grayed, not selectable
- Tool hover: elevated, border color change
- Add clicked: node added, brief success indicator

ACCESSIBILITY:
- Radio group keyboard navigation
- Tool descriptions read by screen readers
- Warning icons have aria-label
```

---

## Screen 2.1.5: MCP Tool Parameter Binding

### Stitch Prompt

```
Create a configuration panel for binding parameters to an MCP tool node, with documentation, parameter mapping, output naming, and error handling.

LAYOUT:
- Modal or slide-out panel
- Width: 520px
- Background: #1E293B
- Border radius: 16px (if modal)

PANEL HEADER:
- Title: "Configure: read_file" (tool name in monospace)
- Close button: [×]
- Padding: 20px 24px
- Border-bottom: 1px solid #334155

TOOL DOCUMENTATION SECTION:
- Card background: #0F172A
- Border: 1px solid #334155
- Border radius: 8px
- Padding: 16px
- Margin: 16px 24px

Documentation Content:
- Description paragraph:
  "Reads the content of a file at the specified path.
   Returns the file content as a string."

- Input Schema:
  - "Input Schema:" label, bold
  - "path: string (required) - Absolute file path"
  - Monospace font for types

- Output:
  - "Output: string - File contents"

PARAMETER MAPPING SECTION:
- Section label: "Parameter Mapping" 14px Semibold
- Padding: 0 24px
- Card container for each parameter

Parameter Card:
- Background: #0F172A
- Border radius: 8px
- Padding: 16px

Parameter Name:
- "path (required)" 14px Semibold
- Required badge styling

Mapping Options (Radio Group):
1. ○ Static Value:
   - Text input: "/data/config.json"
   - Full width when selected

2. ● From Variable: (selected)
   - Dropdown: "{{input.file_path}}"
   - Shows available variables from context
   - Mustache syntax hint

3. ○ From Previous Node:
   - Dropdown: "Select output..."
   - Lists outputs from prior nodes

Visual Indicator:
- Selected option expanded
- Others collapsed to single line

OUTPUT VARIABLE NAME SECTION:
- Label: "Output Variable Name"
- Text input: "file_content"
- Helper text: "Reference this output in later nodes as {{file_content}}"
- Padding: 0 24px
- Margin-top: 16px

ERROR HANDLING SECTION:
- Label: "Error Handling"
- Padding: 0 24px
- Margin-top: 16px

Error Dropdown:
- Label: "On Error:"
- Dropdown: "Stop execution" selected

Error Options (Expanded):
- ○ Stop execution (halt workflow)
- ○ Use fallback value: [text input appears when selected]
- ○ Skip and continue (proceed to next node)

PANEL FOOTER:
- Sticky bottom
- Padding: 16px 24px
- Border-top: 1px solid #334155
- Button row:
  - "[Cancel]" ghost button
  - "[Add to Canvas]" primary button

DESIGN TOKENS:
- Background: #1E293B
- Card bg: #0F172A
- Border: #334155
- Primary: #4F46E5
- Required badge: #F59E0B
- Code font: JetBrains Mono

STATES:
- Required param empty: validation error shown
- Variable dropdown: autocomplete suggestions
- Add button: disabled if required params missing
- Success: node added confirmation

ANIMATIONS:
- Radio option expand: smooth height transition
- Validation error: shake + red border
```

---

## Screen 2.1.6: MCP Tool Consent Dialog

### Stitch Prompt

```
Create a permission consent dialog for sensitive MCP tool operations requiring user approval.

LAYOUT:
- Centered modal
- Width: 480px
- Background: #1E293B
- Border radius: 16px
- Padding: 24px

MODAL HEADER:
- Warning icon: ⚠️ (amber/yellow, 24px)
- Title: "Tool Permission Required" 18px Semibold
- Close button: [×] top-right
- Amber accent on header (subtle top border or icon color)

TOOL IDENTIFICATION:
- Text: "The canvas wants to use:" 14px #94A3B8
- Tool name: "write_file" 16px Semibold monospace
- Margin-bottom: 16px

TOOL DETAILS CARD:
- Background: #0F172A
- Border: 1px solid #334155
- Border-radius: 8px
- Padding: 16px

Card Content:
- Header row:
  - 🔧 icon
  - "write_file from filesystem" 14px Semibold

- Divider: 1px solid #334155

- "This tool will:" label 12px #64748B
- Action items (bulleted):
  - • Write content to: /output/generated.json
  - • Content size: ~2.4 KB

- Server Info:
  - "Server: filesystem (stdio)" #64748B
  - "Permissions: write access to /output/*" #64748B

CONSENT OPTIONS:
- Margin-top: 16px
- Two checkboxes:

1. ☐ Allow this tool for the rest of this session
   - Unchecked by default
   - Helper: grants permission until tab close

2. ☐ Always allow this tool (can revoke in settings)
   - Unchecked by default
   - Helper: permanent permission, manageable later

Checkbox styling:
- Square with rounded corners
- Unchecked: border #475569
- Checked: filled #4F46E5

MODAL FOOTER:
- Margin-top: 24px
- Two buttons, full width, stacked or side-by-side:

Button Layout (side-by-side):
- "[Deny]" - outline/ghost button, left
- "[Allow Once]" - primary button, right

Alternative (if checkboxes selected):
- "Allow Once" changes to "Allow" based on checkbox state

DESIGN TOKENS:
- Background: #1E293B
- Card bg: #0F172A
- Warning: #F59E0B
- Danger/Deny: #EF4444
- Primary/Allow: #4F46E5
- Border: #334155

STATES:
- No checkbox: "Allow Once" shown
- Session checkbox: button text unchanged
- Always checkbox: shows additional warning text
- Deny hover: red border
- Allow hover: darken

SECURITY INDICATORS:
- Warning banner if tool can modify/delete
- Show exact file paths being accessed
- Display content preview if available

ANIMATIONS:
- Modal entrance: scale from 95% + fade
- Button hover: subtle lift
- Checkbox: check animation

ACCESSIBILITY:
- Focus on "Deny" button by default (safe option)
- Clear button labels
- Warning announced to screen readers
- Escape key = deny
```

---

## Design System Reference (Group 5)

### Common Elements

```
COLOR PALETTE:
- Background: #0F172A (slate-900)
- Surface/Card: #1E293B (slate-800)
- Border: #334155 (slate-700)
- Text Primary: #F8FAFC (slate-50)
- Text Secondary: #94A3B8 (slate-400)
- Text Muted: #64748B (slate-500)
- Primary: #4F46E5 (indigo-600)
- Success: #10B981 (emerald-500)
- Warning: #F59E0B (amber-500)
- Danger: #EF4444 (red-500)
- Info: #3B82F6 (blue-500)

TYPOGRAPHY:
- UI Font: Inter
- Code Font: JetBrains Mono
- H1: 24px Semibold
- H2: 20px Semibold
- H3: 18px Semibold
- Body: 14px Regular
- Small: 12px Regular
- Caption: 12px Regular #64748B

SPACING:
- Base unit: 8px
- Card padding: 16px-24px
- Section gaps: 24px
- Form field spacing: 16px

BORDERS:
- Default: 1px solid #334155
- Focus: 2px solid #4F46E5
- Danger zone: 4px left solid #EF4444
- Border radius: 4px (small), 8px (medium), 12px (large), 16px (modal)

SHADOWS:
- sm: 0 1px 2px rgba(0,0,0,0.05)
- md: 0 4px 6px rgba(0,0,0,0.1)
- lg: 0 10px 15px rgba(0,0,0,0.1)

FORM CONTROLS:
- Input height: 40px
- Button height: 40px (default), 36px (small), 48px (large)
- Checkbox size: 18px
- Radio size: 18px
- Slider thumb: 16px
```

---

## Group 5 Cross-References

| Screen | PRD Reference | Architecture Reference | Components |
|--------|--------------|----------------------|------------|
| 1.10.1 User Profile | FR5, FR6, FR37 | User Service | Avatar, Form, NotificationMatrix, ThemeToggle |
| 1.10.2 Account Settings | FR2, FR3, FR4 | Auth Service | MFAPanel, SessionTable, ConnectedAccounts |
| 1.10.3 API Keys | FR14, FR15, FR7 | API Gateway | KeyCard, PermissionGrid, UsageBar |
| 1.10.4 Workspace Settings | FR16, FR17, FR18 | Tenant Service | IntegrationCard, SecurityPolicy, DangerZone |
| 2.1.1 Canvas Builder | FR74, FR146-165 | Canvas Engine | ThreeColumnLayout, ArtieChat, CanvasWorkspace |
| 2.1.2 Component Inspector | FR150 | Canvas Engine | PropertyPanel, StyleControls, SliderInput |
| 2.1.3 AI Generation Modal | FR151, FR152 | AI Service | PromptInput, PreviewPane, KBSelector |
| 2.1.4 MCP Tool Node | FR74 | MCP Integration | ServerList, ToolCard, StatusIndicator |
| 2.1.5 MCP Parameter Binding | FR74 | MCP Integration | ParamMapper, VariableDropdown, ErrorConfig |
| 2.1.6 MCP Consent Dialog | FR74 | MCP Integration | ConsentModal, PermissionCheckbox, ActionButtons |

---

## AG-UI/A2UI Integration Points (Group 5)

| Screen | Zone | Integration Type | Notes |
|--------|------|-----------------|-------|
| 2.1.1 Canvas Builder | Artie Chat Panel | AG-UI Full Chat | Streaming AI responses, style suggestions |
| 2.1.3 AI Generation Modal | Preview Area | A2UI Streaming | Real-time component generation preview |
| 2.1.2 Component Inspector | AI Suggestions | AG-UI Action | "Suggest Improvements" uses AI generation |
