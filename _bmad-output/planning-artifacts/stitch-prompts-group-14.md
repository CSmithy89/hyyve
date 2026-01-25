# Google Stitch Prompts - Group 14

**Screens 131-140:** Notifications, Collaboration, Version Control, Developer Tools

---

## Screen 131: Webhook Triggers Setup (4.9.3)

### Stitch Prompt

```
Create a comprehensive webhook management interface for a dark-themed enterprise SaaS platform.

**Layout Structure:**
- Full-width page with sidebar navigation (240px collapsed)
- Header: "Webhook Configuration" title with primary "+ New Webhook" button (right-aligned)
- Main content divided into 4 vertical sections with 24px gaps

**Section 1: Outgoing Webhooks Table**
- Card container with #1E293B background, 8px border-radius
- Section header: "Outgoing Webhooks" in 16px Inter semibold, #F1F5F9
- Data table with columns:
  - Name (text, 200px width)
  - URL (truncated with ellipsis, 300px width)
  - Events (badge showing event type, 120px)
  - Status toggle (green dot for active, gray for inactive)
- 4 sample rows: "PagerDuty", "Slack Notifier", "Analytics Sync", "CRM Update"
- Hover state: row background #334155, cursor pointer
- Status toggle: 40px pill switch with #4F46E5 active color

**Section 2: Webhook Editor Panel**
- Expanded card when webhook selected, #1E293B background
- Header: "Edit Webhook: 'PagerDuty'" in 14px Inter medium
- Form fields:
  1. Webhook URL: Full-width text input with https:// prefix
  2. Authentication dropdown: "Bearer Token", "Basic Auth", "API Key", "None"
  3. Token field: Password input with [Show] and [Regenerate] buttons
  4. Trigger Events: Checkbox list with 6 event types
     - workflow.execution.failed (checked)
     - workflow.execution.timeout (checked)
     - workflow.execution.completed
     - module.published
     - user.login
     - system.error (checked)
  5. [Select All] [Select None] links below checkboxes
  6. Payload Format: Monaco editor (dark theme) showing JSON template with mustache variables
  7. "Use Template" dropdown below editor
  8. Retry Policy: Max Retries dropdown (1-5), Backoff dropdown (Linear/Exponential)
- Action buttons: [Test Webhook] secondary, [Save] primary #4F46E5, [Delete] ghost red

**Section 3: Incoming Webhooks Table**
- Card with "Incoming Webhooks (Triggers)" header
- 3-column table: Workflow, Trigger URL, Secret
- Secret shown as masked dots with copy button
- [+ Generate Incoming Webhook] button below table

**Section 4: Recent Deliveries Log**
- Card with "Recent Deliveries" header
- 5-column table: Time, Webhook, Event, Status, HTTP Code
- Status indicators: checkmark green for "Sent", X red for "Fail"
- [View All Deliveries] link at bottom

**Design Tokens:**
- Background: #0F172A
- Surface: #1E293B
- Primary: #4F46E5
- Success: #10B981
- Error: #EF4444
- Border: #334155
- Text primary: #F1F5F9
- Text secondary: #94A3B8
- Font: Inter for UI, JetBrains Mono for code/JSON
- Border radius: 8px cards, 6px inputs, 4px badges
- All inputs 40px height with #0F172A background
```

**Component Inventory:**
| Component | Variant | Count |
|-----------|---------|-------|
| DataTable | Sortable with actions | 3 |
| Input | Text, Password, URL | 4 |
| Select | Dropdown | 3 |
| Checkbox | Grouped | 6 |
| Button | Primary, Secondary, Ghost, Danger | 6 |
| Toggle | Pill switch | 4 |
| CodeEditor | Monaco JSON | 1 |
| Badge | Status | 4 |
| Card | Container | 4 |

**States:**
- Webhook list: loading skeleton, empty state
- Editor: collapsed, expanded, saving, saved confirmation
- Test webhook: testing spinner, success toast, failure error
- Delivery log: live updating indicator

**Interactions:**
- Click row to expand editor panel with animation
- Toggle webhooks active/inactive inline
- Copy secret/URL to clipboard with toast
- Test webhook shows response preview in modal
- Real-time delivery log updates via WebSocket

---

## Screen 132: Integration Connectors (4.9.4)

### Stitch Prompt

```
Create an integration hub interface for connecting third-party services in a dark-themed SaaS platform.

**Layout Structure:**
- Full-width page with standard sidebar
- Header: "Integration Hub" with [Browse Gallery] button
- 4 main sections stacked vertically with 32px gaps

**Section 1: Connected Integrations Grid**
- Card with "Connected Integrations" header
- Horizontal grid of integration cards (4 per row on desktop)
- Each integration card (120px x 120px):
  - Icon placeholder (48px, centered)
  - Service name below icon
  - Status badge: checkmark green "Connected" or warning yellow "Needs Reauth"
  - Click to select/expand details
- 4 sample integrations: Slack, Teams, Salesforce, HubSpot

**Section 2: Integration Details Panel**
- Expanded detail card when integration selected
- Header: "Integration Details: Salesforce"
- Status line: "Status: Connected" with green indicator
- Metadata: Account name, Connected date, Last Sync timestamp
- Permissions section:
  - Checkbox list with 6 permissions
  - Read Contacts, Read Leads, Write Leads (checked)
  - Read Opportunities (checked), Write Opportunities, Delete Records (unchecked)
- Data Mapping table:
  - 4 columns: Hyyve Field, Salesforce Field, Sync Direction
  - Sync direction badges: "Bi-dir" blue, "Push" green, "Pull" yellow
  - [Edit Mapping] button
- Action buttons: [Test Connection], [Sync Now], [Disconnect]

**Section 3: Available Integrations Gallery**
- Card with "Available Integrations" header
- Category tabs or grouped sections:
  - Communication: Gmail, Twilio icons with [Add] buttons
  - CRM: Zoho, Pipedrive with [Add] buttons
  - Analytics: Google Analytics with [Add] button
  - Databases: MongoDB, PostgreSQL with [Add] buttons
  - Storage: S3, GCS with [Add] buttons
  - Custom: Custom OAuth with [Add] button
- Grid layout, 6 items per row, 80px square cards

**Section 4: Integration Health Panel**
- Card with "Integration Health" header
- Overall status: "3/4 Healthy" in large text
- Horizontal progress bars for each connected integration:
  - Service name on left
  - Percentage bar (full width) with color gradient:
    - 100%: #10B981 green
    - 32%: #F59E0B yellow (partial, warning)
  - Percentage text on right

**Design Tokens:**
- Same as Screen 131
- Integration icons: 48px with #1E293B circular backgrounds
- Health bars: 8px height, rounded ends
- Category headers: 12px uppercase, #64748B, letter-spacing 0.05em
```

**Component Inventory:**
| Component | Variant | Count |
|-----------|---------|-------|
| IntegrationCard | Connected, Available | 10 |
| DataTable | Data mapping | 1 |
| Checkbox | Permission list | 6 |
| Button | Primary, Secondary, Ghost | 8 |
| Badge | Status, Direction | 8 |
| ProgressBar | Health indicator | 4 |
| Card | Section container | 4 |
| Icon | Service logos | 10 |

**States:**
- Integration cards: default, hover, selected, connecting, error
- Detail panel: collapsed, expanded, syncing
- Test connection: testing, success, failure
- OAuth flow: popup trigger, callback handling

**Interactions:**
- Click integration card to show details panel
- OAuth popup for new integration connection
- Drag-and-drop field mapping (optional)
- Real-time sync status updates
- Disconnect confirmation modal

---

## Screen 133: Multi-user Editor with Presence (5.1.1)

### Stitch Prompt

```
Create a collaborative workflow editor with real-time presence indicators for multiple users.

**Layout Structure:**
- Full-width canvas editor with minimal chrome
- Header bar: Module name "Support Flow" on left, presence avatars center, [Share] button right
- Main canvas area (full remaining height)
- Activity sidebar (320px, right side, collapsible)

**Header Bar:**
- Height: 56px, #1E293B background
- Module name: 18px Inter semibold, #F1F5F9
- Presence avatars: Circular stack showing 3 users
  - Avatar circles 32px with colored borders matching cursor colors
  - Names on hover tooltip: "Sarah", "Mike", "You"
  - Overflow indicator "+2" if more than 4
- [Share] button: Primary style with share icon

**Canvas Area:**
- Dark canvas background #0F172A with subtle dot grid
- Workflow nodes connected with bezier curves
- 5 sample nodes: Start, LLM, Branch, Email, Slack, End
- Presence cursors showing collaborator positions:
  - Sarah's cursor: Pink highlight on LLM node with name label
  - Mike's cursor: Blue highlight on Branch node, selection outline
  - Your cursor: Standard editing state on End node
- Node selection: 2px dashed border with user's assigned color
- Multi-select: Shift+click for multiple node selection

**Activity Sidebar:**
- Section 1: "Activity" header
  - Live activity feed showing:
    - "Sarah is editing 'LLM Node'" with pink dot
    - "Mike selected 'Branch Node'" with blue dot
    - Chat bubble: "Sarah: 'Should we add error handling here?'"
- Section 2: "Comments [3]" header with [+ Add Comment] button
  - Comment threads attached to nodes
  - Each comment: avatar, name, timestamp, text

**Presence Cursor Component:**
- Colored arrow cursor (12px)
- Name label pill: 24px height, user color background, white text
- Smooth position interpolation for movement
- Selection highlight: colored dashed border on selected elements

**Design Tokens:**
- Canvas background: #0F172A
- Node background: #1E293B
- Node border: #334155
- User colors: Array of 8 distinct colors for collaborators
  - Sarah: #EC4899 (pink)
  - Mike: #3B82F6 (blue)
  - Alex: #10B981 (green)
  - etc.
- Cursor label: 12px Inter medium, white text
- Activity feed: 14px Inter, #94A3B8 secondary text
```

**Component Inventory:**
| Component | Variant | Count |
|-----------|---------|-------|
| PresenceAvatar | Stack, Individual | 3 |
| PresenceCursor | With label | 3 |
| WorkflowNode | Editable with selection | 6 |
| ActivityFeed | Item | 3 |
| CommentThread | Collapsed, Expanded | 3 |
| Button | Primary, Ghost | 2 |
| Sidebar | Collapsible right | 1 |
| Canvas | Infinite with grid | 1 |

**States:**
- Presence: active, idle, away, offline
- Node: default, hover, selected by self, selected by other, editing by other
- Cursor: visible, fading (idle), hidden (offline)
- Activity: new item highlight animation

**Interactions:**
- Real-time cursor position sync via WebSocket/Yjs CRDT
- Click node to select, double-click to edit
- Drag to move with conflict prevention
- Right-click context menu
- @ mention in comments to notify users
- Cursor smoothly interpolates between positions

**AG-UI Integration:**
```
<!-- AGENT_CONTENT_ZONE: collaborative-activity-feed -->
<div id="collab-activity-zone" data-ag-ui="activity-stream">
  <!-- Real-time activity updates rendered here -->
  <!-- Supports: user-action, chat-message, system-event types -->
</div>
```

---

## Screen 134: Share & Permissions Modal (5.1.2)

### Stitch Prompt

```
Create a share and permissions modal dialog for collaboration access control.

**Modal Structure:**
- Centered modal, 520px width, auto height
- Dark background overlay at 60% opacity
- Modal background: #1E293B with 12px border-radius
- Header: 'Share "Support Flow"' with X close button
- Content sections with 24px padding

**Section 1: Invite Input**
- Label: "Invite People"
- Full-width email input with placeholder "Enter email addresses..."
- [Invite] primary button inline on right (80px width)
- Input accepts multiple emails comma-separated
- Autocomplete dropdown for existing team members

**Section 2: People with Access List**
- Label: "People with Access"
- Scrollable list container, max-height 240px
- Each row (56px height):
  - Avatar circle (36px) with initials or image
  - Name and email stacked vertically
  - Permission dropdown: "Owner", "Can Edit", "Can View"
  - Remove button (X) for non-owners
- Sample entries:
  - You (chris@example.com) - Owner (no dropdown, just label)
  - Sarah (sarah@example.com) - Can Edit dropdown
  - Mike (mike@example.com) - Can View dropdown
  - Engineering Team - Can Edit dropdown (team icon instead of avatar)

**Permission Dropdown Options:**
- "Can Edit" - Full editing access
- "Can View" - Read-only access
- "Can Comment" - View + comment only
- Divider
- "Remove" - Red text option

**Section 3: Link Sharing**
- Label: "Link Sharing"
- Radio options:
  - "Restricted - Only people added above can access"
  - "Anyone with link - [permission dropdown]"
- When "Anyone with link" selected:
  - Show link URL in readonly input
  - Copy button with clipboard icon
  - Permission dropdown for link access level

**Footer:**
- [Done] primary button, right-aligned

**Design Tokens:**
- Modal background: #1E293B
- Overlay: rgba(0, 0, 0, 0.6)
- Input background: #0F172A
- Avatar backgrounds: Gradient based on user initials
- Dropdown: #0F172A background, #334155 border
- Remove text: #EF4444
- Copy button hover: #334155 background
```

**Component Inventory:**
| Component | Variant | Count |
|-----------|---------|-------|
| Modal | Medium centered | 1 |
| Input | Email with autocomplete | 1 |
| Avatar | User, Team | 4 |
| Select | Permission dropdown | 4 |
| RadioGroup | Link sharing options | 1 |
| Button | Primary, Ghost, Icon | 4 |
| IconButton | Close, Copy, Remove | 3 |
| List | Scrollable with items | 1 |

**States:**
- Invite: typing, autocomplete open, inviting, sent confirmation
- Permission dropdown: closed, open, changing
- Link: generating, copied toast
- Remove: confirm prompt

**Interactions:**
- Autocomplete shows matching team members on type
- Permission changes save immediately (optimistic update)
- Copy link shows toast "Link copied to clipboard"
- Remove user shows confirmation or instant remove
- Press Enter in email field to invite
- Click outside to close dropdown

---

## Screen 135: Real-time Sync Status (5.1.3)

### Stitch Prompt

```
Create a connection and sync status panel showing real-time collaboration state.

**Layout Structure:**
- Slide-out panel from right edge, 400px width
- Can be triggered from sync indicator in header
- Header: "Connection Status" with settings gear icon
- 3 main sections vertically stacked

**Section 1: Sync Status Summary**
- Status indicator with icon and text:
  - Connected: Green dot "Connected" with checkmark
  - Syncing: Yellow dot "Syncing..." with spinner
  - Offline: Red dot "Offline" with X icon
- Detail card below:
  - "All changes synced" with "Last: 2s ago"
  - Technical details (collapsible):
    - "PostgreSQL NOTIFY: <10ms latency"
    - "Yjs CRDT: 3 active peers"
  - Progress indicator if syncing

**Section 2: Active Collaborators List**
- Header: "Active Collaborators"
- List of users currently in document:
  - Status dot (green = active, yellow = reconnecting, gray = away)
  - Avatar + Name + Email
  - Current action: "Editing LLM Node", "Viewing", "Reconnecting..."
- Sample entries:
  - Sarah - green dot - "Editing LLM Node"
  - Mike - green dot - "Viewing"
  - Alex - yellow dot - "Reconnecting..."

**Section 3: Recent Sync Events Log**
- Header: "Recent Sync Events"
- Scrollable event list with timestamps:
  - "12:34:56 Sarah updated 'LLM Node' config"
  - "12:34:52 Mike joined session"
  - "12:34:48 Your changes synced"
  - "12:34:45 Connection restored after 2s offline"
- Each entry: timestamp (fixed width), event description
- Auto-scrolls to show newest events

**Header Bar Sync Indicator (Compact):**
- Small component for main header bar showing current state
- Connected: "Synced" with green check and collaborator count badge
- Syncing: Spinner animation with "Syncing..."
- Offline: Red indicator with [Reconnect] button
- Click to open full status panel

**Conflict Resolution Banner (Conditional):**
- Appears at top when conflict detected
- Yellow warning background
- Text: "Conflict detected with Sarah's changes"
- [Resolve] button to open conflict modal

**Design Tokens:**
- Panel background: #1E293B
- Status green: #10B981
- Status yellow: #F59E0B
- Status red: #EF4444
- Status gray: #64748B
- Event timestamp: #64748B, 12px JetBrains Mono
- Event text: #94A3B8, 14px Inter
```

**Component Inventory:**
| Component | Variant | Count |
|-----------|---------|-------|
| SlidePanel | Right-aligned | 1 |
| StatusIndicator | Connected, Syncing, Offline | 3 |
| CollaboratorListItem | Active, Away, Reconnecting | 3 |
| EventLogItem | Timestamped | 4 |
| Badge | Collaborator count | 1 |
| Button | Icon, Text | 2 |
| Spinner | Sync animation | 1 |

**States:**
- Panel: closed, opening, open, closing
- Connection: connected, syncing, offline, reconnecting
- Collaborator: active, idle, away, disconnected
- Conflict: none, detected, resolving

**Interactions:**
- Click header indicator to toggle panel
- Real-time updates to collaborator list via WebSocket
- Event log auto-scrolls as new events arrive
- Offline state shows queued changes count
- Manual reconnect button when offline
- Conflict resolution opens dedicated modal

---

## Screen 136: Version History (5.2.1)

### Stitch Prompt

```
Create a version history timeline interface showing workflow revision history.

**Modal/Panel Structure:**
- Slide-out panel from right, 480px width
- Or modal dialog, 600px width
- Header: "Version History: Support Flow" with X close button
- Scrollable content area

**Version Timeline:**
- Vertical timeline with connected nodes
- Current version at top, oldest at bottom
- Each version entry:
  - Timeline dot (filled for current, hollow for past)
  - Connecting line to next version
  - Version card content:
    - Version number and commit message
    - Author avatar + name + "• X hours/days ago"
    - Action buttons: [View] [Restore] [Compare]
    - Optional [Tag] badge for important versions

**Sample Version Entries:**
1. Current Version (filled dot, no restore button)
   - v2.3 - "Added error handling"
   - by Sarah • 2 hours ago
   - [View] [Compare]

2. v2.2 - "Fixed branch logic"
   - by Mike • 5 hours ago
   - [View] [Restore] [Compare]

3. v2.1 - "Added Slack integration"
   - by You • 1 day ago
   - [View] [Restore] [Compare]

4. v2.0 - "Major refactor" [Tag: Release]
   - by Sarah • 3 days ago
   - [View] [Restore] [Compare]

5. v1.5 - "Initial release" [Tag: Release]
   - by You • 1 week ago
   - [View] [Restore] [Compare]

**Footer Actions:**
- [Create Tag] - Opens tag naming dialog
- [Export History] - Downloads version history as JSON

**Version Card States:**
- Default: #1E293B background
- Hover: #334155 background
- Current: Left border accent #4F46E5
- Tagged: Badge pill with tag name

**Design Tokens:**
- Timeline line: #334155, 2px width
- Timeline dot current: #4F46E5 filled, 12px diameter
- Timeline dot past: #334155 stroke, 12px diameter
- Version card padding: 16px
- Author text: #94A3B8, 14px
- Tag badge: #4F46E5/20 background, #4F46E5 text
```

**Component Inventory:**
| Component | Variant | Count |
|-----------|---------|-------|
| SlidePanel | Right | 1 |
| Timeline | Vertical with cards | 1 |
| TimelineNode | Current, Past | 5 |
| VersionCard | Standard, Tagged | 5 |
| Avatar | Small (24px) | 5 |
| Button | Ghost small | 15 |
| Badge | Tag | 2 |

**States:**
- Version: current, past, restoring, restored
- Compare: selecting first version, selecting second
- Tag: creating, editing
- Restore: confirming, in progress, complete

**Interactions:**
- Click [View] to preview version in read-only mode
- Click [Restore] shows confirmation dialog
- Click [Compare] enables version selection mode
- Selecting two versions opens diff viewer
- Hover shows full timestamp in tooltip
- Create Tag opens inline name input

---

## Screen 137: Diff Viewer (5.2.2)

### Stitch Prompt

```
Create a visual diff viewer comparing two workflow versions side-by-side.

**Modal Structure:**
- Large modal or full-screen overlay
- Header: "Compare: v2.2 → v2.3" with X close button
- Summary bar below header
- Split-pane main content
- Footer with actions

**Summary Bar:**
- Change statistics: "+2 nodes, -0 nodes, ~3 modified"
- Badges for additions (green), deletions (red), modifications (yellow)
- Filter toggles: [Show All] [Additions] [Deletions] [Modifications]

**Split-Pane View:**
- Left side: "v2.2 (Previous)" label
- Right side: "v2.3 (Current)" label
- Each pane shows workflow canvas

**Left Pane (Previous Version):**
- Workflow nodes in original state
- Nodes that were removed: Red dashed border, 50% opacity
- Nodes that were modified: Yellow border

**Right Pane (Current Version):**
- Workflow nodes in current state
- New nodes: Green border with [NEW] badge
- Modified nodes: Yellow border
- Visual arrows showing connection changes

**Sample Diff Content:**
- Previous: Start → LLM → Branch → Email
- Current: Start → LLM → Error Handler (NEW) → Branch → multiple outputs
- New node highlighted with green glow effect
- Modified connections shown with dashed lines

**Change Details Section:**
- Below canvas comparison
- "Modified Nodes:" header
- Bulleted list of changes:
  - "LLM Node: Updated prompt template"
  - "Branch Node: Added new condition"
  - "Email Node: Changed recipient"
- Click item to highlight in canvas view

**Footer:**
- [Revert to v2.2] danger button (red)
- [Close] secondary button

**Diff Highlight Colors:**
- Addition: #10B981 (green) border, #10B981/10 background
- Deletion: #EF4444 (red) border, dashed, #EF4444/10 background
- Modification: #F59E0B (yellow) border
- Unchanged: Standard #334155 border
```

**Component Inventory:**
| Component | Variant | Count |
|-----------|---------|-------|
| Modal | Fullscreen | 1 |
| SplitPane | Horizontal | 1 |
| Canvas | Read-only comparison | 2 |
| WorkflowNode | Added, Removed, Modified, Unchanged | 8 |
| Badge | NEW, Change stats | 4 |
| ChangeList | Clickable items | 1 |
| Button | Danger, Secondary | 2 |
| FilterToggle | Change type | 4 |

**States:**
- Node: unchanged, added, removed, modified
- Filter: all, additions only, deletions only, modifications only
- Highlight: none, selected from change list
- Revert: confirming, reverting, complete

**Interactions:**
- Synchronized scrolling/panning between panes
- Click change list item to highlight in both canvases
- Hover node shows detailed property diff
- Toggle filters to show/hide change types
- Revert shows confirmation modal
- Zoom controls for canvas detail

---

## Screen 138: API Key Management External (6.1.1)

### Stitch Prompt

```
Create an API key and provider management interface for BYOK (Bring Your Own Key) functionality.

**Layout Structure:**
- Full-width page with standard sidebar
- Header: "API Keys & Providers" with [+ Add Provider] button
- 3 main sections vertically stacked

**Section 1: Your API Keys Table**
- Card with "Your API Keys" header
- Data table with columns:
  - Provider: Icon + name (OpenAI, Anthropic, Cohere, Groq)
  - Status: Dot indicator "Valid" green or "Invalid" red
  - Usage: Monthly spend "$234/mo"
  - Actions: [Edit] [Delete] buttons
- Provider icons: Colored circles or logos
  - OpenAI: Blue
  - Anthropic: Purple
  - Cohere: Red
  - Groq: Green
- Status dot: 8px circle, green for valid, red for invalid
- Invalid row: subtle red background tint

**Section 2: Default Provider Settings**
- Card with "Default Provider Settings" header
- Form with dropdowns for each capability:
  - LLM Requests: dropdown with current model name
  - Embeddings: dropdown with embedding model
  - Speech-to-Text: dropdown with STT provider
  - Text-to-Speech: dropdown with TTS provider
- Each dropdown shows provider icon + model name
- Options grouped by provider in dropdown

**Section 3: Fallback Configuration**
- Card with "Fallback Configuration" header
- Toggle: "Enable automatic failover" checkbox
- Fallback chain display:
  - "Primary: OpenAI → Fallback: Anthropic → Groq"
  - Arrow indicators between providers
  - Provider icons inline
- [Configure Failover Rules] button to open detailed modal

**Add Provider Modal (triggered by header button):**
- Provider selection grid (logos)
- API key input field
- Test connection button
- Advanced settings collapsible

**Design Tokens:**
- Provider colors: OpenAI #00A67E, Anthropic #D97706, etc.
- Status valid: #10B981
- Status invalid: #EF4444
- Usage text: #94A3B8
- Dropdown icon size: 20px
- Row height: 64px
```

**Component Inventory:**
| Component | Variant | Count |
|-----------|---------|-------|
| DataTable | With icons and status | 1 |
| ProviderIcon | Colored circle/logo | 8 |
| StatusDot | Valid, Invalid | 4 |
| Select | With icons | 4 |
| Checkbox | Toggle | 1 |
| Button | Primary, Secondary, Ghost | 6 |
| Card | Section container | 3 |
| Modal | Add provider | 1 |
| FallbackChain | Visual display | 1 |

**States:**
- API key: valid, invalid, checking, not configured
- Provider: selected, available, unavailable
- Fallback: enabled, disabled
- Test connection: testing, success, failure

**Interactions:**
- Click [Edit] to open key editing modal
- Test connection validates API key
- Drag to reorder fallback priority
- Toggle failover enables/disables feature
- Delete shows confirmation modal
- Invalid key shows troubleshooting guidance

---

## Screen 139: Self-Hosted Setup Wizard (6.3.1)

### Stitch Prompt

```
Create a multi-step setup wizard for self-hosted deployment configuration.

**Layout Structure:**
- Centered card layout, 800px max-width
- Progress stepper at top showing 4 steps
- Current step content area
- Navigation buttons at bottom

**Progress Stepper:**
- Horizontal stepper: "Step 2 of 4"
- 4 steps: Requirements, Infrastructure, License, Deploy
- Visual progress bar below steps
- Completed steps: filled circles with checkmarks
- Current step: filled circle, highlighted
- Future steps: hollow circles

**Step 2: Infrastructure Configuration**

**Deployment Type Section:**
- Radio group with 3 options:
  - Docker Compose (Recommended for < 10 users) - selected
  - Kubernetes (Helm charts for production)
  - Manual Installation
- Each option: radio + label + description text

**Database Section:**
- Radio group:
  - Bundled PostgreSQL (Included in Docker) - selected
  - External PostgreSQL
    - When selected, shows connection string input field

**Vector Store Section:**
- Radio group:
  - Bundled pgvector - selected
  - External Qdrant
  - External Pinecone
- When external selected, shows connection config inputs

**Generated Configuration Preview:**
- Code block with header "Generated Configuration"
- [Copy] button in top-right corner
- Docker compose YAML content:
  ```yaml
  # docker-compose.yml
  version: '3.8'
  services:
    app:
      image: hyyve/platform:latest
      ...
  ```
- Syntax highlighted YAML
- Scrollable if content is long

**Navigation Footer:**
- [Back] secondary button on left
- [Next: License] primary button on right

**Design Tokens:**
- Stepper completed: #10B981
- Stepper current: #4F46E5
- Stepper future: #334155
- Radio selected: #4F46E5
- Code block background: #0F172A
- Code block border: #334155
- Code font: JetBrains Mono 13px
```

**Component Inventory:**
| Component | Variant | Count |
|-----------|---------|-------|
| Stepper | Horizontal progress | 1 |
| StepperItem | Complete, Current, Future | 4 |
| RadioGroup | With descriptions | 3 |
| RadioOption | Standard, With nested content | 7 |
| Input | Connection string | 1 |
| CodeBlock | YAML syntax highlighted | 1 |
| Button | Primary, Secondary | 2 |
| Card | Centered wizard container | 1 |

**States:**
- Step: incomplete, current, complete
- Radio: unselected, selected, disabled
- Config: generating, generated, error
- Validation: checking requirements, passed, failed

**Interactions:**
- Select radio option updates generated config in real-time
- External database selection reveals connection input
- Copy button copies full config to clipboard
- Back/Next navigation with validation
- Config validates on step change
- Requirements check runs automatically

---

## Screen 140: Mobile Dashboard Responsive (6.5.1)

### Stitch Prompt

```
Create a responsive mobile dashboard design for smartphones (375px width).

**Layout Structure:**
- Single column layout, full width
- Fixed header with navigation
- Scrollable content area
- Fixed bottom navigation bar

**Header (Fixed):**
- Height: 56px
- Hamburger menu icon (left)
- "Hyyve" logo/text (center)
- Notification bell icon with badge (right)
- User avatar (right)

**Welcome Section:**
- Greeting: "Good morning, Chris" in 20px Inter semibold
- Subtle background gradient or simple padding

**Quick Stats Card:**
- Card with "Quick Stats" header
- 2x2 grid of stat tiles:
  - "2.3K" with "Today" label (executions)
  - "98.7%" with "Up" label (uptime)
  - Compact display, 80px x 60px each
- Card background: #1E293B

**Recent Projects List:**
- Section header: "Recent Projects"
- List of project cards (full width):
  - Project icon (emoji or type icon)
  - Project name
  - "Updated X ago" subtitle
  - Chevron right for navigation
- 3 sample projects:
  - Support Bot - Updated 2h ago
  - Lead Qualifier - Updated 1d ago
  - Voice Agent - Updated 3d ago

**Active Alerts Section:**
- Section header: "Active Alerts (2)"
- Alert cards with warning styling:
  - Warning icon
  - Alert title
  - Compact layout
- 2 sample alerts:
  - High latency detected
  - Queue threshold exceeded

**Bottom Navigation Bar (Fixed):**
- Height: 64px with safe area padding
- 4 navigation items:
  - Home (house icon) - active/selected
  - Projects (folder icon)
  - Observability (chart icon)
  - Settings (gear icon)
- Active item: #4F46E5 color, filled icon
- Inactive: #64748B color, outline icon
- Labels below icons

**Responsive Breakpoints:**
- Mobile: 375px (this design)
- Tablet: 768px (2-column layout)
- Desktop: 1024px+ (full sidebar)

**Touch Targets:**
- All interactive elements minimum 44px x 44px
- Adequate spacing between tap targets
- Visual feedback on touch

**Design Tokens (Mobile):**
- Header background: #0F172A
- Content background: #0F172A
- Card background: #1E293B
- Bottom nav background: #1E293B
- Bottom nav border-top: #334155
- Touch highlight: rgba(79, 70, 229, 0.2)
- All text optimized for mobile readability
```

**Component Inventory:**
| Component | Variant | Count |
|-----------|---------|-------|
| MobileHeader | Fixed | 1 |
| StatCard | Compact grid | 4 |
| ProjectListItem | With icon | 3 |
| AlertCard | Warning compact | 2 |
| BottomNav | Fixed 4-item | 1 |
| BottomNavItem | Active, Inactive | 4 |
| IconButton | Touch-optimized | 3 |
| Badge | Notification count | 1 |

**States:**
- Navigation item: inactive, active, pressed
- List item: default, pressed, navigating
- Alert: new (unread), acknowledged
- Pull-to-refresh: pulling, refreshing, complete

**Interactions:**
- Tap project to navigate to detail
- Pull down to refresh dashboard data
- Swipe alert to dismiss or acknowledge
- Bottom nav switches main sections
- Hamburger opens side drawer menu
- Bell icon shows notification panel

---

## Group 14 Summary

| Screen | ID | Component Count | Key Interactions |
|--------|-----|-----------------|------------------|
| Webhook Triggers Setup | 4.9.3 | 29 | Webhook CRUD, payload editing, delivery logs |
| Integration Connectors | 4.9.4 | 31 | OAuth flows, data mapping, health monitoring |
| Multi-user Editor | 5.1.1 | 16 | Real-time presence, cursor sync, activity feed |
| Share & Permissions | 5.1.2 | 13 | Invite users, permission dropdowns, link sharing |
| Real-time Sync Status | 5.1.3 | 11 | Connection state, collaborator list, event log |
| Version History | 5.2.1 | 13 | Timeline navigation, restore, tag creation |
| Diff Viewer | 5.2.2 | 15 | Side-by-side comparison, change highlighting |
| API Key Management | 6.1.1 | 21 | BYOK config, provider fallback, key validation |
| Self-Hosted Setup | 6.3.1 | 15 | Multi-step wizard, config generation |
| Mobile Dashboard | 6.5.1 | 14 | Touch-optimized responsive design |

**Total Components in Group 14:** 178
**AG-UI Integration Points:** Screen 133 (collaborative activity feed)
