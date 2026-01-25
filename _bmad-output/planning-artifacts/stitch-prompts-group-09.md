# Google Stitch Prompts - Group 09

**Project:** Hyyve Platform
**Group:** 9 of 15
**Screens:** 81-90 (Templates + Tenant Management + UI Generation)
**Design System:** Refer to Group 01 for complete design tokens

---

## Screen 81: Template Browser (2.12.1)

### Stitch Prompt

```
Create a template browser library screen with dark theme (#0F172A background).

**Layout:**
- Full-width header with "Template Library" title and search input (placeholder: "Search templates...")
- Horizontal category pills row: All (156), Chatbot (45), Module (68), Voice (23), Canvas (20)
- Filter dropdowns row: "Industry" and "Complexity" with chevron indicators
- "Featured Templates" section header with "View All" link
- 3-column grid of featured template cards
- "Recently Used" section with compact list view
- "My Templates" section with count badge and "+ Save New" button

**Category Pills:**
- Pill container with horizontal scroll on mobile
- Each pill: rounded-full bg-slate-800, px-4 py-2
- Active state: bg-indigo-600 with white text
- Icon + label + count in parentheses format
- Icons: 💬 Chatbot, 🔧 Module, 🎙️ Voice, 🎨 Canvas

**Featured Template Cards:**
- bg-slate-800 rounded-xl border border-slate-700
- Star badge "⭐" for featured items in top-left
- Template name as bold header
- Type badge with icon (e.g., "💬 Chatbot")
- Star rating display (★★★★☆ format) with review count
- Two action buttons: "Preview" (outline) and "Use Template" (primary)
- Subtle hover: border-indigo-500/50, transform scale-[1.02]

**Recently Used Section:**
- Compact list with bullet points
- Template name + relative time ("used 3 days ago")
- Subtle text-slate-400 for timestamps

**My Templates Section:**
- Header with count badge and action button
- List items with template name and action links: [Edit] [Share]
- "(Custom)" badge for user-modified templates

**Filter Dropdowns:**
- bg-slate-800 border border-slate-600 rounded-lg
- Chevron down icon on right
- Full dropdown with options on click

**Design Tokens:**
- Surface: #1E293B
- Border: #334155
- Primary: #4F46E5
- Text primary: #F8FAFC
- Text secondary: #94A3B8
- Star color: #FBBF24
```

---

## Screen 82: Template Preview (2.12.2)

### Stitch Prompt

```
Create a template preview modal/panel with dark theme (#0F172A background).

**Layout:**
- Modal header with template name and close button (×)
- Large diagram visualization area showing template workflow
- "Description" section with feature bullet list
- "What's Included" checklist section
- "Requirements" section with prerequisites
- Footer with two action buttons: "Preview Live Demo" and "Use This Template"

**Template Diagram Area:**
- Large preview container with bg-slate-900 rounded-xl
- Workflow visualization showing connected nodes:
  - Trigger → Classify → Respond → End
  - Branch from Classify → Escalate
- Nodes as rounded rectangles with connecting arrows
- Clean flowchart style with directional arrows (────►)

**Description Section:**
- "Description" header in text-sm font-medium text-slate-400
- bg-slate-800 rounded-lg p-4 container
- Bullet list with features:
  - "Intent classification for 50+ common queries"
  - "RAG-powered knowledge base integration"
  - "Automatic escalation to human agents"
  - "Chatwoot integration ready"
- "Best for:" and "Setup time:" metadata lines

**What's Included Section:**
- Checklist format with ✓ checkmarks in green
- Items: modules, intents, templates, workflows, sample docs, test cases
- Count indicators (e.g., "5 flows", "50+ pre-trained intents")

**Requirements Section:**
- bg-slate-800 rounded-lg container
- Bullet list with prerequisites
- Mix of required and optional items with labels

**Action Buttons:**
- "Preview Live Demo": outline button, border-slate-600
- "Use This Template": primary button, bg-indigo-600
- Both: px-6 py-3, rounded-lg, font-medium

**Modal Container:**
- Max-width: 800px
- bg-slate-900 rounded-2xl border border-slate-700
- Shadow-xl for depth
- Scrollable content area if needed
```

---

## Screen 83: Template Customization (2.12.3)

### Stitch Prompt

```
Create a template customization wizard step with dark theme (#0F172A background).

**Layout:**
- Header with template name and step indicator "Step 2/3"
- "Project Settings" section with name and folder inputs
- "Template Configuration" section with business details
- "Features to Include" checklist with requirement indicators
- "Knowledge Base" section with radio options
- Footer with navigation: Back, Preview, Create Project

**Step Indicator:**
- "Step 2/3" badge in text-slate-400
- Optional progress dots or bar showing current position

**Project Settings Section:**
- Section header: "Project Settings" in font-medium
- bg-slate-800 rounded-lg p-4 container
- Two form fields:
  - "Project Name": text input with placeholder
  - "Folder": dropdown select with path display

**Template Configuration Section:**
- bg-slate-800 rounded-lg p-4 container
- Form fields:
  - Business Name: text input
  - Industry: dropdown select
  - Support Email: email input
- "Tone of Voice" radio group: Professional, Friendly (selected), Casual
- Response Language: dropdown with language options
- "Enable multi-language support" checkbox

**Features to Include Section:**
- bg-slate-800 rounded-lg p-4 container
- Checklist items with toggle checkboxes
- Each item has:
  - Checkbox (☑️ or ☐)
  - Feature name (bold)
  - "Requires:" sub-text in text-slate-400 italic
- Features: Order Status Lookup, Refund Request Handling, FAQ Auto-Response, Appointment Scheduling, Human Escalation

**Knowledge Base Section:**
- bg-slate-800 rounded-lg p-4 container
- Dropdown: "Select KB to use"
- Radio options:
  - "Use existing: [KB name] (doc count)"
  - "Create new KB and import sample docs" (selected ●)

**Navigation Buttons:**
- "← Back": outline button with left arrow
- "Preview": outline button
- "Create Project": primary button bg-indigo-600
- Right-aligned button group

**Form Styling:**
- All inputs: bg-slate-900 border border-slate-600 rounded-lg px-4 py-2
- Labels: text-sm font-medium text-slate-300
- Radio buttons: custom styled with indigo-500 when selected
- Checkboxes: rounded with indigo-600 fill when checked
```

---

## Screen 84: Tenant Switcher (2.13.1)

### Stitch Prompt

```
Create an organization/tenant switcher modal with dark theme (#0F172A background).

**Layout:**
- Modal header with building icon "🏢 Organizations" and close button
- "Current Organization" section with selected org details
- "Your Organizations" list showing all accessible orgs
- Footer actions: "Create Organization" and "Join Organization with Code"

**Modal Container:**
- Max-width: 480px
- bg-slate-900 rounded-2xl border border-slate-700
- Shadow-xl for depth

**Current Organization Section:**
- Section label: "Current Organization" in text-sm text-slate-400
- bg-slate-800 rounded-lg p-4 container
- Checkmark indicator "✓" in green for selected
- Organization name as bold header
- Metadata row: "Role: Admin | Plan: Enterprise"
- Stats row: "12 members | 45 projects" in text-slate-400

**Your Organizations List:**
- Section label: "Your Organizations"
- bg-slate-800 rounded-lg container
- List of organization items with radio selection (○ / ●)
- Each item shows:
  - Radio button (unselected ○)
  - Organization name
  - Role and Plan badges
  - Member and project counts
- Divider lines between items
- Hover state: bg-slate-700/50

**Organization Types:**
- Personal Workspace (single member, smaller plans)
- Team organizations (multiple members)
- Agency client accounts (prefixed "Agency Client:")

**Footer Actions:**
- Two buttons side by side
- "[+ Create Organization]": primary outline button
- "[Join Organization with Code]": secondary outline button
- Both: rounded-lg, border-slate-600

**Selection Interaction:**
- Click organization to select and switch context
- Visual feedback: checkmark appears, bg-indigo-500/10 highlight
- Closing modal confirms the switch
```

---

## Screen 85: Tenant Isolation Configuration (2.13.2)

### Stitch Prompt

```
Create a tenant isolation settings screen with dark theme (#0F172A background).

**Layout:**
- Header with "Organization Settings: [Org Name]" and Save button
- "Data Isolation" section with isolation level options
- "Resource Limits" section with usage metrics
- "Cross-Organization Sharing" section with permission toggles
- "Compliance" section with audit and security settings
- Footer with Cancel and Save Configuration buttons

**Data Isolation Section:**
- bg-slate-800 rounded-lg p-4 container
- Dropdown: "Isolation Level" with chevron
- Radio options with descriptions:
  - "● Full Isolation" (selected): "Separate database schema, no data mixing" + "Best for: Enterprise, regulated industries"
  - "○ Logical Isolation": "Shared database with row-level security" + "Best for: Standard organizations"
- Status indicator: "✅ Full Isolation Active" in green
- "Data Region: US-East-1" metadata

**Resource Limits Section:**
- bg-slate-800 rounded-lg p-4 container
- Grid/table of limit metrics:
  - Max Projects: value + plan badge
  - Max Members: value + plan badge
  - Max API Requests: "1M/month"
  - Storage: "500 GB" with usage "(234 GB used)"
  - KB Documents: "Unlimited" with count
- Progress bars for usage metrics (storage shows 47% filled)

**Cross-Organization Sharing Section:**
- bg-slate-800 rounded-lg p-4 container
- Toggle checkboxes with descriptions:
  - "☐ Allow sharing projects with other organizations" + warning "⚠️ Requires explicit approval"
  - "☐ Allow importing templates from marketplace" + note about isolation
  - "☑️ Allow members to belong to multiple organizations" (checked)
- Each option has explanatory sub-text

**Compliance Section:**
- bg-slate-800 rounded-lg p-4 container
- Toggle checkboxes:
  - "☑️ Enable audit logging (all actions logged)"
  - "☑️ Enforce 2FA for all members"
  - "☑️ Data retention policy: [90] days" with number input
  - "☐ Enable data export requests"

**Action Buttons:**
- "Cancel": outline button
- "Save Configuration": primary button bg-indigo-600
- Right-aligned in footer

**Visual Indicators:**
- Checkmarks in green (#10B981) for enabled features
- Warning icons in amber (#F59E0B) for cautionary notes
- "(Enterprise)" badges for plan-specific features
```

---

## Screen 86: UI Generation Canvas (2.14.1)

### Stitch Prompt

```
Create an AI-powered UI generation canvas with dark theme (#0F172A background).

**Layout:**
- Header with "UI Generator" title and Preview/Export buttons
- AI prompt input area at top
- Two-column main area: Component Library (left) and Live Preview (right)
- Generated Code panel at bottom

**AI Prompt Area:**
- bg-slate-800 rounded-xl p-4 container
- Chat bubble icon "💬" label: "Describe what you want to build:"
- Textarea input with placeholder text about dashboard creation
- "🎨 Generate" button (primary) right-aligned

**Component Library Panel (Left):**
- "Component Library" header
- Collapsible category sections:
  - "📦 Layout": Grid, Stack, Card
  - "📦 Data Display": Table, Chart, Stat Card
  - "📦 Forms": Input, Select, Button
  - "📦 Navigation": Tabs, Sidebar, Breadcrumb
- Each item: text-sm, hover:bg-slate-700 rounded px-2 py-1
- Draggable indicator on hover

**Live Preview Panel (Right):**
- "Live Preview" header
- bg-slate-900 rounded-xl border border-slate-700 preview container
- AGENT_CONTENT_ZONE for dynamically generated UI preview
- Sample preview showing:
  - Dashboard header with title
  - 3-column stat cards (Users, Sales, Revenue)
  - Chart placeholder
  - Recent Orders table
- Device selector dropdown: "Desktop ▼"
- Theme toggle: "Light ▼" dropdown

**Generated Code Panel:**
- "Generated Code" header with Copy and Save buttons
- bg-slate-900 rounded-lg code container
- Syntax highlighted TSX code:
  - Import statements
  - Function component
  - JSX return with components
- JetBrains Mono font for code
- Line numbers in gutter (text-slate-600)
- Copy button with clipboard icon

**Generate Button States:**
- Default: bg-indigo-600 text-white
- Hover: bg-indigo-500
- Loading: spinner animation with "Generating..."
- Success: brief checkmark animation

**Responsive Behavior:**
- On mobile: single column, components library hidden in drawer
- Preview maintains aspect ratio at smaller sizes
```

---

## Screen 87: Form Builder Interface (2.14.2)

### Stitch Prompt

```
Create a drag-and-drop form builder with dark theme (#0F172A background).

**Layout:**
- Header with form name "Form Builder: Contact Form" and Preview/Save buttons
- Two-column layout: Form Fields palette (left) and Form Preview (right)
- Selected Field configuration panel below preview
- Form Settings panel at bottom

**Form Fields Palette (Left):**
- "Form Fields" header
- "Drag to add:" instruction text
- Draggable field components:
  - "📝 Text Input"
  - "📧 Email Input"
  - "📝 Textarea"
  - "▼ Select"
  - "☐ Checkbox"
  - "📅 Date Picker"
  - "📁 File Upload"
- Each: bg-slate-800 rounded-lg px-4 py-3, border border-slate-600
- Drag handle icon on left
- Hover: border-indigo-500/50, cursor-grab

**Form Preview Panel (Right):**
- "Form Preview" header
- bg-slate-900 rounded-xl border border-slate-700 container
- Live form preview:
  - "Contact Us" form title
  - Name field (text input)
  - Email field with asterisk (*) for required
  - Message field (textarea, larger)
  - Checkbox: "Subscribe to news"
  - Submit button centered
- All fields show actual form controls
- Drop zones highlight when dragging (border-dashed border-indigo-500)

**Selected Field Configuration:**
- "Selected Field: Email Input" header
- bg-slate-800 rounded-lg p-4 container
- Inline form fields:
  - Label: text input
  - Required: checkbox toggle
  - Placeholder: text input
  - Validation: dropdown select
  - Error Message: text input
- Changes reflect immediately in preview

**Form Settings Panel:**
- "Form Settings" header
- bg-slate-800 rounded-lg p-4 container
- Fields:
  - Submit Action: dropdown (Send to webhook, Save to DB, etc.)
  - Success Message: text input
  - Checkboxes: "Show loading state", "Enable recaptcha"

**Drag and Drop Interactions:**
- Drag from palette: ghost element follows cursor
- Drop zone highlight: bg-indigo-500/10 with dashed border
- Reorder within form: smooth animation
- Delete: hover reveals × button or drag out of bounds
```

---

## Screen 88: Theme Customizer (2.14.3)

### Stitch Prompt

```
Create a theme customization interface with dark theme (#0F172A background).

**Layout:**
- Header with "Theme Customizer" title and Reset/Save buttons
- Two-column layout: Design Tokens panel (left) and Preview (right)
- Mode toggle and Presets selection below preview
- Export options at bottom

**Design Tokens Panel (Left):**
- "Design Tokens" header
- Collapsible sections:

**Colors Section:**
- Each color token shows:
  - Label (Primary, Secondary, Background, etc.)
  - Hex input with color swatch
  - Color picker button [🎨]
- Tokens: Primary (#4F46E5), Secondary (#6B7280), Background (#F9FAFB)
- Success/Error/Warning color swatches in a row [🟢][🔴][🟡]

**Typography Section:**
- Font Family: dropdown select (Inter, etc.)
- Base Size: number input with stepper [16px] [↕]

**Spacing Section:**
- Border Radius: number input with stepper [8px] [↕]

**Preview Panel (Right):**
- "Preview" header
- bg-slate-900 rounded-xl border border-slate-700 container
- Sample components showing theme application:
  - "Sample Dashboard" header
  - Primary Button (filled with primary color)
  - Secondary Button (outline style)
  - Sample Card with body text
  - Input field
  - Radio button and Checkbox
- All components update in real-time with token changes

**Mode Toggle:**
- Radio group: "○ Light ● Dark"
- Changes preview background and adapts all colors

**Theme Presets:**
- Horizontal row of preset buttons:
  - "Corp" - corporate blue
  - "Soft" - soft pastels
  - "Bold" - vibrant colors
  - "Dark" - dark theme
- Each: small card with color sample, clickable

**Export Options:**
- Dropdown: "Export As" with options (Tailwind CSS, CSS Variables, JSON)
- "Export" button (primary)

**Color Picker Interaction:**
- Click swatch opens color picker popover
- Hex input for direct value entry
- Recent colors history
- Contrast checker for accessibility (WCAG AA/AAA indicators)
```

---

## Screen 89: Component Embed Configuration (2.14.4)

### Stitch Prompt

```
Create a component embed configuration modal with dark theme (#0F172A background).

**Layout:**
- Modal header with "Embed Component: [Component Name]" and close button
- "Embed Type" radio selection section
- Code snippet section (dynamic based on embed type)
- "Configuration Options" form section
- Footer with Preview and Copy Code buttons

**Modal Container:**
- Max-width: 640px
- bg-slate-900 rounded-2xl border border-slate-700
- Shadow-xl for depth

**Embed Type Section:**
- "Embed Type" header
- bg-slate-800 rounded-lg p-4 container
- Radio options with descriptions:
  - "○ iFrame Embed": "Simple embed, works everywhere, isolated styles"
  - "● React Component" (selected): "Native integration, full control, requires React"
  - "○ Web Component": "Framework-agnostic, custom element"
  - "○ Standalone HTML": "Self-contained, no dependencies"
- Each option: radio button + label + description line

**Code Snippet Section:**
- Header showing selected type: "React Component Code"
- Two code blocks:

**Installation Block:**
- "```bash" header with copy button [📋]
- npm install command
- bg-slate-950 rounded-lg

**Usage Block:**
- "```tsx" header with copy button [📋]
- Import statement
- Component usage with props
- bg-slate-950 rounded-lg
- Syntax highlighting with JetBrains Mono
- Line numbers in gutter

**Configuration Options Section:**
- "Configuration Options" header
- bg-slate-800 rounded-lg p-4 container
- Form fields:
  - API Key: masked input with Regenerate button
  - Webhook URL: URL input
  - Theme: dropdown (Auto, Light, Dark)
  - Language: dropdown (language options)
- Toggle checkboxes:
  - "Enable form validation"
  - "Show success message"
  - "Redirect after submit" with URL input

**Footer Actions:**
- "Preview" button: outline style
- "Copy Code" button: primary bg-indigo-600
- Both: rounded-lg px-6 py-2

**Copy Interaction:**
- Click copy button: brief "Copied!" tooltip
- Icon changes to checkmark temporarily
```

---

## Screen 90: Component Library Browser (2.14.5)

### Stitch Prompt

```
Create a component library browser with dark theme (#0F172A background).

**Layout:**
- Header with "Component Library" title and search input
- Horizontal category filter pills
- View toggle: Grid/List
- 3-column grid of component cards

**Search Header:**
- "Component Library" title left-aligned
- Search input right-aligned: "🔍 Search components..."
- bg-slate-800 rounded-lg border border-slate-600

**Category Pills:**
- Horizontal scroll container
- Categories: All (156), Layout (23), Forms (34), Data (45), Nav (18)
- Active pill: bg-indigo-600 text-white
- Inactive: bg-slate-800 text-slate-300
- Each: rounded-full px-4 py-2

**View Toggle:**
- Right side above grid: "[Grid][List]"
- Toggle buttons: active shows filled, inactive shows outline
- Icons: grid-dots and list-bars

**Component Cards Grid:**
- 3 columns on desktop, 2 on tablet, 1 on mobile
- Each card: bg-slate-800 rounded-xl border border-slate-700

**Component Card Structure:**
- Preview area at top (fixed aspect ratio)
  - Shows visual representation of component
  - Examples: Button preview, Input field, Checkbox group, etc.
- Component name (bold)
- Variant count: "12 variants" in text-slate-400
- "[Preview]" action link/button

**Component Previews:**
Row 1:
- Button: shows filled button shape
- Input: shows text input field [═══]
- Checkbox: shows checkmark icons ☐ ☑️ ☐

Row 2:
- Dropdown: shows menu with chevron ▼ Menu
- Card: shows card outline [Card]
- Table: shows horizontal lines ═══════

Row 3:
- Modal: shows modal outline [Modal]
- Tabs: shows tab buttons [Tab1]
- Skeleton: shows loading placeholder ░░░░░░░

**Card Interactions:**
- Hover: border-indigo-500/50, subtle shadow
- Click "Preview": opens component detail modal
- Shows all variants, code samples, props documentation

**Grid Spacing:**
- Gap: 24px (6 in Tailwind)
- Padding: 24px around container

**Empty State:**
- If search has no results: "No components found" message
- Suggestion to try different search terms
```

---

## Design System Reference (Group 09)

All screens in this group use the established design tokens:

| Token | Value | Usage |
|-------|-------|-------|
| Background | #0F172A | Page background |
| Surface | #1E293B | Cards, modals |
| Surface Elevated | #334155 | Hover states, dropdowns |
| Border | #475569 | Dividers, card borders |
| Primary | #4F46E5 | Buttons, active states |
| Primary Hover | #4338CA | Button hover |
| Text Primary | #F8FAFC | Headings, body text |
| Text Secondary | #94A3B8 | Descriptions, metadata |
| Text Muted | #64748B | Placeholders, disabled |
| Success | #10B981 | Checkmarks, positive states |
| Warning | #F59E0B | Caution indicators |
| Error | #EF4444 | Validation errors |
| Star Rating | #FBBF24 | Rating stars |

**Typography:**
- Font Family: Inter (UI), JetBrains Mono (code)
- Headings: font-semibold
- Body: font-normal
- Base size: 14px (UI), 13px (code)

**Spacing:**
- Base unit: 8px
- Card padding: 16-24px
- Section gaps: 24-32px

**Border Radius:**
- Buttons: 8px
- Cards: 12px
- Modals: 16px
- Pills: 9999px (full)

---

## Cross-References

| Screen | PRD Requirement | Architecture Component | UX Component Count |
|--------|-----------------|----------------------|-------------------|
| 2.12.1 | FR243-FR245 | TemplateLibrary | 8 components |
| 2.12.2 | FR243-FR245 | TemplatePreview | 6 components |
| 2.12.3 | FR243-FR245 | TemplateCustomizer | 9 components |
| 2.13.1 | FR246-FR248 | TenantSwitcher | 5 components |
| 2.13.2 | FR246-FR248 | TenantSettings | 10 components |
| 2.14.1 | FR179-FR186 | UIGenerationCanvas | 11 components |
| 2.14.2 | FR179-FR186 | FormBuilder | 9 components |
| 2.14.3 | FR179-FR186 | ThemeCustomizer | 10 components |
| 2.14.4 | FR179-FR186 | ComponentEmbed | 7 components |
| 2.14.5 | FR179-FR186 | ComponentBrowser | 6 components |

---

## AG-UI/A2UI Integration Points

| Screen | Dynamic Zone | Integration Type |
|--------|-------------|------------------|
| 2.12.2 | Template diagram | Pre-rendered visualization |
| 2.14.1 | Live preview panel | AGENT_CONTENT_ZONE - AI-generated UI |
| 2.14.2 | Form preview | Dynamic form rendering |
| 2.14.3 | Theme preview | Live token application |
| 2.14.4 | Code snippets | Dynamic code generation |
| 2.14.5 | Component previews | Interactive component rendering |
