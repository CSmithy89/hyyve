# Google Stitch Prompts - Group 2 (Screens 11-20)

**Project:** Hyyve Platform
**Screens:** Node Configuration Details + Chatbot Builder Start
**Design System:** shadcn/ui + Tailwind CSS (Dark Theme Primary)

---

## Screen 1.2.2a: LLM Node - Advanced Configuration

### Stitch Prompt

```
Create an advanced LLM node configuration modal/panel for a workflow builder.

PANEL STRUCTURE:
- Slide-in panel from right (480px width) OR modal (640px width)
- Background: #1E293B (slate-800)
- Border-left: 1px solid #334155
- Full height of viewport

HEADER:
- Icon: brain/AI icon (24px, #8B5CF6 purple)
- Title: "LLM Node: Advanced Configuration" 18px Inter Semibold
- Close button (X) on right
- Background: #0F172A
- Padding: 16px 20px
- Border-bottom: 1px solid #334155

TAB NAVIGATION:
- 4 tabs: "Basic" | "Advanced" | "Prompts" | "Testing"
- Tab bar background: #0F172A
- Active tab: text #F8FAFC, underline 2px #4F46E5
- Inactive tab: text #64748B, hover #94A3B8
- Tab padding: 12px 16px

ADVANCED TAB CONTENT (scrollable):

Section 1 - Model Selection:
- Section header: "Model Selection" 14px Inter Semibold, #F8FAFC
- Margin-bottom: 16px

Provider Dropdown:
- Label: "Provider" 12px #94A3B8
- Dropdown: 44px height, full width
- Current: "Anthropic" with logo icon
- Options: OpenAI, Anthropic, Google, Azure, Custom

Model Dropdown:
- Label: "Model" 12px #94A3B8
- Dropdown with rich options showing:
  - Model name
  - Pricing info (input/output per 1M tokens)
  - Checkmark on selected
  - Example options:
    - "Claude Opus 4" - "$15/M input, $75/M output"
    - "Claude Sonnet 4" - "$3/M input, $15/M output" ✓
    - "Claude Haiku 3.5" - "$0.25/M input, $1.25/M output"

Fallback Toggle:
- Checkbox: "Enable model fallback"
- When checked, show fallback model dropdown below
- Helper text: "Use fallback if primary model fails" 12px #64748B

Section 2 - Generation Parameters:
- Section header: "Generation Parameters"
- Card container: background #0F172A, border #334155, radius 8px, padding 16px

Temperature Slider:
- Label: "Temperature" with value display "0.7"
- Slider track: #334155, filled portion #4F46E5
- Thumb: 16px circle, white, shadow
- Range: 0.0 to 2.0
- Marks at 0, 0.5, 1.0, 1.5, 2.0
- Helper labels below: "Precise" (left) ←→ "Creative" (right)
- 12px #64748B

Top P Slider:
- Same styling as temperature
- Label: "Top P"
- Range: 0.0 to 1.0
- Default: 0.95

Max Tokens Input:
- Label: "Max Tokens"
- Number input with +/- stepper buttons
- Current value: "4096"
- Helper: "(Model max: 8192)" in #64748B
- Validation: cannot exceed model max

Stop Sequences:
- Label: "Stop Sequences"
- Tag/chip input field
- Current tags: "Human:" and "Assistant:" as removable chips
- Each chip: background #334155, text #F8FAFC, X button
- "+ Add" button to add new sequence
- Input appears when + clicked

Section 3 - Advanced Options:
- Section header: "Advanced Options"
- Card container same styling

Checkboxes with descriptions:
1. "Enable streaming response"
   - Checked by default
   - Helper: "Show response as it generates"

2. "Cache responses"
   - When checked, show TTL input: "TTL: [300] seconds"
   - Helper: "Cache identical prompts"

3. "Enable extended thinking (Claude 3.5+)"
   - When checked, show budget tokens input: "[16000]"
   - Helper: "Allow model to reason before responding"

4. "Include previous messages"
   - When checked, show context slider: "Context: [10] messages"
   - Helper: "Include conversation history"

Timeout/Retry Row:
- Two dropdowns side by side
- "Timeout: [30 ▼] seconds"
- "Retry on error: [3 ▼] times"
- Helper: "Backoff: exponential"

Section 4 - Cost Estimation:
- Card with gradient border (purple tint)
- Icon: calculator/dollar (20px)
- Title: "Cost Estimation"
- Line 1: "Est. per call: ~$0.0023" 16px #F8FAFC
- Line 2: "(avg 500 input + 800 output tokens)" 12px #64748B
- Line 3: "Est. monthly (1000 calls/day): ~$69/month" 14px #94A3B8

FOOTER:
- Sticky at bottom
- Background: #1E293B
- Border-top: 1px solid #334155
- Padding: 16px 20px
- Two buttons right-aligned:
  - "Cancel" - ghost style, #94A3B8
  - "Save Configuration" - primary style, #4F46E5

STATES:
- Form validation on save
- Unsaved changes indicator (dot in tab)
- Loading state for model list fetch
- Error state for invalid values

ACCESSIBILITY:
- All inputs have labels
- Sliders have aria-valuemin/max/now
- Focus trap in modal
- Escape to close
```

---

## Screen 1.2.2b: RAG Node Configuration

### Stitch Prompt

```
Create a RAG (Retrieval-Augmented Generation) node configuration panel for connecting to knowledge bases.

PANEL LAYOUT:
- Same structure as LLM node (480px slide-in panel)
- Header icon: database/book icon (24px, #10B981 green)
- Title: "RAG Node Configuration"

CONTENT SECTIONS:

Section 1 - Node Identity:
- Text input: "Node Name"
- Default: "Knowledge Retrieval"
- Full width, 44px height

Section 2 - Knowledge Base Selection:
- Section header: "Knowledge Base Selection"
- Multi-select list with checkboxes

Each KB item is a row:
- Checkbox (24px)
- KB name (14px #F8FAFC)
- Metadata: "(2,341 chunks, updated 2h ago)" 12px #64748B
- Status indicator dot (green = healthy, yellow = syncing)
- Hover: background #334155

Example items:
- ☑ Product Documentation (2,341 chunks, updated 2h)
- ☑ Support FAQ (456 chunks, updated 1d)
- ☐ Marketing Content (892 chunks, updated 3d)
- ☐ Technical Specs (1,203 chunks, updated 5d)

Footer: "+ Connect New KB" button (ghost style)

Section 3 - Retrieval Settings:
- Card container styling

Search Type Dropdown:
- Label: "Search Type"
- Options with descriptions:
  - "Semantic Only" - "Vector similarity search"
  - "Keyword Only" - "Traditional BM25 search"
  - "Hybrid (Recommended)" ✓ - "Combines semantic + keyword"
- Selected shows checkmark

Top K Results:
- Label: "Top K Results"
- Dropdown: [3, 5, 10, 15, 20]
- Default: 5
- Helper: "Number of chunks to retrieve"

Similarity Threshold Slider:
- Label: "Similarity Threshold"
- Range: 0.0 to 1.0
- Default: 0.75
- Current value display
- Helper labels: "Broad" ←→ "Strict"

Reranking Toggle:
- Checkbox: "Enable reranking"
- Helper: "(improves relevance, adds latency)"
- When checked, show reranker dropdown:
  - "Cohere Rerank v3"
  - "BGE Reranker"
  - "Custom model..."

Section 4 - Query Configuration:
- Card container

Query Source:
- Label: "Query Source"
- Dropdown: "Input variable", "Static text", "Previous node output"
- When "Input variable" selected:
  - Text input for variable path
  - Example: "{{trigger.body.question}}"
  - Variable picker button with autocomplete

Query Expansion:
- Checkbox: "Enable query expansion"
- When checked, show method dropdown:
  - "HyDE (Hypothetical Doc Embedding)" - recommended
  - "Query rewriting"
  - "Multi-query generation"

Metadata Filters:
- Checkbox: "Apply metadata filters"
- When checked, show JSON input:
  - Monaco editor style textarea
  - Placeholder: '{"category": "support", "lang": "en"}'
  - Syntax highlighting for JSON

Section 5 - Output Format:
- Radio button group (card-style options)

Option 1: "Concatenated text"
- Description: "Combined context string"
- Icon: document-text

Option 2: "Structured array" (selected)
- Description: "Individual chunk objects"
- Icon: list-bullet

Option 3: "Formatted markdown"
- Description: "With sources cited"
- Icon: document

Metadata Inclusion:
- Checkbox group horizontal:
  - ☑ source
  - ☑ score
  - ☐ chunk_id
  - ☐ metadata

FOOTER:
- "Test Query" button - secondary style (left)
- "Cancel" - ghost (right)
- "Save Configuration" - primary (right)

TEST QUERY MODAL (when clicked):
- Small modal overlay
- Input: "Test query" textarea
- "Run Test" button
- Results area showing:
  - Retrieved chunks with scores
  - Source attribution
  - Latency metric
```

---

## Screen 1.2.2c: Conditional/Branch Node Configuration

### Stitch Prompt

```
Create a branch/conditional node configuration panel for routing workflow execution.

HEADER:
- Icon: git-branch icon (24px, #F59E0B orange)
- Title: "Branch Node Configuration"

CONTENT:

Section 1 - Node Name:
- Text input: "Intent Router"

Section 2 - Branch Type:
- Radio button group with descriptions

Option 1: "Condition-based" (selected)
- Description: "if/else logic"
- Icon: code-branch

Option 2: "Switch/Case"
- Description: "Multiple exact matches"
- Icon: menu

Option 3: "AI Classification"
- Description: "LLM-powered routing"
- Icon: sparkles/AI
- Badge: "Pro feature"

Option 4: "Percentage Split"
- Description: "A/B testing"
- Icon: chart-pie

Section 3 - Conditions Builder:
- Main content area for condition rules
- Expandable/collapsible branches

Branch Card Structure:
- Card background: #0F172A
- Border: 1px solid #334155
- Border-left: 3px solid (color varies by branch)
- Padding: 16px

Branch 1 (blue accent):
- Header row:
  - Drag handle (6 dots)
  - Title: "Branch 1: Support Request" (editable)
  - [Edit] button - ghost
  - [×] delete button
- Condition preview box:
  - Background: #1E293B
  - Monospace font
  - "IF {{intent.category}} equals 'support'"
  - "OR {{message}} contains 'help'"
  - "OR {{message}} contains 'problem'"
- Route dropdown:
  - "→ Routes to: [Support Handler ▼]"
  - Dropdown shows available downstream nodes

Branch 2 (green accent):
- Same structure
- Conditions for sales inquiry

Branch 3 (gray accent):
- "ELSE (default fallback)"
- Cannot be deleted
- Routes to fallback handler

Add Branch Button:
- "+ Add Branch" - ghost style, full width
- Dashed border

Section 4 - Condition Builder (Inline Editor):
- Appears when "Edit" clicked on a branch
- Expandable panel

Condition Row:
- Variable dropdown: "{{intent.category}}" with autocomplete
- Operator dropdown:
  - equals
  - not equals
  - contains
  - starts with
  - ends with
  - regex matches
  - greater than
  - less than
  - is empty
  - is not empty
- Value input: "support"

Add Condition Buttons:
- "+ Add AND condition" - secondary style
- "+ Add OR condition" - secondary style

Visual connector:
- "AND" / "OR" badges between conditions
- Different colors (AND = blue, OR = orange)

Section 5 - Evaluation Order:
- Radio buttons:
  - "First match wins (stop at first true condition)" - default
  - "Evaluate all (can trigger multiple branches)"

FOOTER:
- "Test Conditions" button with play icon
- Standard Cancel/Save buttons

TEST MODE (when clicked):
- Modal with test input JSON editor
- Run button
- Shows which branch would be selected
- Highlights matching conditions in green
```

---

## Screen 1.2.2d: API Call Node Configuration

### Stitch Prompt

```
Create an HTTP/API call node configuration panel for making external requests.

HEADER:
- Icon: globe/API icon (24px, #3B82F6 blue)
- Title: "API Call Node Configuration"

CONTENT:

Section 1 - Node Name:
- Text input: "Fetch Customer Data"

Section 2 - Request Configuration:
- Card with prominent styling

Method + URL Row:
- HTTP method dropdown (compact):
  - GET (green badge)
  - POST (blue badge)
  - PUT (yellow badge)
  - PATCH (orange badge)
  - DELETE (red badge)
- Width: 100px
- Selected method has colored background

URL Input:
- Full width minus method dropdown
- Monospace font
- Placeholder: "https://api.example.com/endpoint"
- Variable highlighting ({{variables}} in purple)
- Height: 44px

Saved Connection Toggle:
- Checkbox: "Use saved connection"
- When checked, show connection dropdown:
  - "Salesforce Production" with status dot
  - "Stripe API" with status dot
  - etc.
- "+ Create New Connection" link

Section 3 - Headers:
- Expandable section (expanded by default)
- Table layout:

Header | Key (input) | Value (input) | Delete
-------|-------------|---------------|-------
row 1  | Authorization | Bearer {{secrets.api_key}} | [×]
row 2  | Content-Type | application/json | [×]
row 3  | X-Request-ID | {{execution.id}} | [×]

- Variable syntax highlighted in value column
- "+ Add Header" button below

Section 4 - Request Body (conditional):
- Only visible for POST/PUT/PATCH
- Content Type tabs: "JSON" | "Form" | "Raw"

JSON Tab:
- Monaco editor with syntax highlighting
- Line numbers
- Height: 200px (resizable)
- Example content:
```json
{
  "user_id": "{{input.user_id}}",
  "action": "{{input.action}}",
  "timestamp": "{{now()}}"
}
```
- Toolbar below:
  - "Format JSON" button
  - "Insert Variable" dropdown

Section 5 - Response Handling:
- Card container

Expected Status:
- Dropdown: "200-299 (success range)", "200 only", "Any", "Custom..."

Response Mapping Table:
| Output Variable | JSON Path |
|-----------------|-----------|
| customer_name | $.data.name |
| customer_email | $.data.email |
| order_history | $.data.orders[*] |
| [+ Add Mapping] | |

- Each row has delete button
- JSON path input with syntax validation
- Helper tooltip: "Use JSONPath syntax ($.path.to.field)"

Store Full Response:
- Checkbox: "Store full response as:"
- Text input for variable name: "api_response"

Section 6 - Error Handling:
- Card container

On Error Dropdown:
- "Retry then fail" (default)
- "Fail immediately"
- "Continue with error"
- "Use fallback value"

Settings Row:
- "Retries: [3 ▼]"
- "Timeout: [30 ▼] seconds"

4xx Handling:
- Checkbox: "Continue on 4xx errors (output error details)"

FOOTER:
- "Test Request" button (shows loading, then response preview)
- Cancel/Save buttons

TEST RESPONSE PANEL:
- Slide-up panel when test completes
- Status code badge (green 200, red 4xx/5xx)
- Response time: "234ms"
- Response body (JSON viewer, collapsible)
- Headers viewer
- "Use as Sample Data" button
```

---

## Screen 1.2.2e: Custom Code Node Configuration

### Stitch Prompt

```
Create a custom code/script node configuration panel with code editor.

HEADER:
- Icon: code/terminal icon (24px, #EC4899 pink)
- Title: "Code Node Configuration"

HEADER ROW:
- Node name input: "Data Transformer"
- Language dropdown: JavaScript, Python 3.11, TypeScript
- Runtime dropdown: "Node.js 20", "Python 3.11"

MAIN CONTENT - Code Editor:
- Monaco-style code editor
- Full width, height: 400px (resizable via drag handle)
- Features:
  - Line numbers
  - Syntax highlighting (language-specific)
  - Autocomplete for available variables
  - Error indicators (red squiggly underlines)
  - Minimap on right (optional toggle)

Editor Toolbar:
- "Format" button - auto-format code
- "Insert Snippet ▼" dropdown:
  - "Try/Catch block"
  - "Async/Await pattern"
  - "JSON parse"
  - "API call"
- "AI Assist ✨" button - opens AI code helper

Default Code Template:
```javascript
// Available: input, context, secrets
// Return value becomes node output

async function transform(input, context) {
  const { customerData, orderHistory } = input;

  // Your transformation logic here

  return {
    // Output data
  };
}
```

Section - Available Inputs:
- Collapsible section below editor
- Table showing available variables:

| Variable | Type | From Node |
|----------|------|-----------|
| customerData | object | API Call Node |
| orderHistory | array | API Call Node |
| context.userId | string | Trigger |
| secrets.api_key | string | Secrets vault |

- Click variable to insert at cursor

Section - Execution Settings:
- Card container
- Grid layout (2 columns)

Timeout:
- "Timeout: [10 ▼] seconds"
- Options: 5, 10, 30, 60

Memory:
- "Memory: [256 ▼] MB"
- Options: 128, 256, 512, 1024

Checkboxes:
- "Enable console.log capture" - shows logs in execution
- "Allow network requests (fetch/http)"
- "Allow file system access (sandboxed)"

Section - Test Execution:
- Expandable panel

Test Input:
- JSON editor (smaller, 100px height)
- Placeholder: '{"customerData": {}, "orderHistory": []}'

Run Test Button:
- "Run Test" with play icon
- Loading state: spinner

Output Area:
- Only visible after test
- Success: green border, JSON output display
- Error: red border, error message + stack trace
- Execution time: "Completed in 45ms"
- Console output (if enabled): collapsible

FOOTER:
- Standard Cancel/Save buttons

AI ASSIST MODAL (when clicked):
- Overlay modal
- Input: "Describe what you want the code to do"
- Textarea for description
- "Generate Code" button
- Output: suggested code with "Insert" button
- "Explain Current Code" option
```

---

## Screen 1.2.2f: Trigger Node Configuration

### Stitch Prompt

```
Create a trigger/start node configuration panel for workflow initiation.

HEADER:
- Icon: play-circle/lightning icon (24px, #10B981 green)
- Title: "Trigger Node Configuration"

CONTENT:

Section 1 - Trigger Type:
- Large card-style radio buttons (2x2 grid)

Card 1 - Webhook (selected):
- Icon: globe-alt (32px)
- Title: "Webhook" 16px Semibold
- Description: "HTTP endpoint trigger" 12px #94A3B8
- Badge: "Most used"
- Selected state: border #4F46E5, bg #4F46E5/10

Card 2 - Schedule:
- Icon: clock (32px)
- Title: "Schedule"
- Description: "Cron-based timing"

Card 3 - Event:
- Icon: bell (32px)
- Title: "Event"
- Description: "Platform events"

Card 4 - Manual:
- Icon: hand-raised (32px)
- Title: "Manual"
- Description: "Run on demand"

Section 2 - Webhook Configuration (conditional on selection):

Webhook URL Display:
- Read-only input showing endpoint
- "https://api.hyyve.com/v1/hooks/abc123def"
- Copy button on right
- "Regenerate" link below

HTTP Method:
- Checkbox group: ☑ POST  ☑ PUT  ☐ GET  ☐ PATCH

Authentication:
- Dropdown: "None", "API Key", "Bearer Token", "Basic Auth", "Custom Header"
- When "API Key" selected:
  - Show generated API key (masked)
  - "Regenerate Key" button

Request Validation:
- Checkbox: "Validate request schema"
- When checked, show JSON schema editor:
```json
{
  "type": "object",
  "required": ["user_id", "message"],
  "properties": {
    "user_id": { "type": "string" },
    "message": { "type": "string" }
  }
}
```

Section 2 - Schedule Configuration (conditional):
- Only visible when "Schedule" selected

Frequency Presets:
- Button group: "Hourly" | "Daily" | "Weekly" | "Monthly" | "Custom"

Custom Cron (when Custom selected):
- Input: "0 9 * * 1-5" (cron expression)
- Helper: "Runs at 9 AM, Monday-Friday"
- Visual cron builder link

Timezone:
- Dropdown: "UTC", user's timezone, all timezones
- Default: Organization timezone

Next Runs Preview:
- List of next 5 scheduled runs
- "Mon Jan 27, 9:00 AM"
- "Tue Jan 28, 9:00 AM"
- etc.

Section 3 - Output Schema:
- Define what data this trigger outputs
- Table editor:

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| user_id | string | ✓ | User identifier |
| message | string | ✓ | Input message |
| metadata | object | | Additional data |
| [+ Add Field] | | | |

Sample Payload:
- JSON viewer showing example output
- "Copy as Test Data" button

FOOTER:
- "Test Trigger" button (simulates trigger)
- Cancel/Save buttons

TEST RESULTS MODAL:
- Shows simulated trigger data
- Validates schema
- "Use for Testing" button to save as test fixture
```

---

## Screen 1.3.1: Chatbot Builder - Main View

### Stitch Prompt

```
Create the main Chatbot Builder interface with a 3-panel layout similar to Module Builder.

OVERALL LAYOUT:
- Same 3-panel structure as Module Builder
- Header bar at top (56px)

HEADER BAR:
- Hamburger menu
- Breadcrumb: "Projects / Customer Support / Chatbot Builder"
- Right actions:
  - "Preview" button (secondary)
  - "Deploy" button (primary, green accent)
  - Settings gear icon

LEFT PANEL - KB & Training (240px):
- Two main sections

Section 1 - Knowledge Base:
- Same as Module Builder KB panel
- Sources list
- Entities list

Section 2 - Intents & Training:
- Section header: "Intents" with train button

Intent List:
- Searchable list
- Each intent row:
  - Intent name (14px)
  - Example count badge
  - Confidence indicator (colored bar)
  - Click to edit

Example intents:
- greeting (12 examples) ████████ 95%
- order_status (8 examples) ██████ 82%
- support (15 examples) █████████ 91%
- billing (6 examples) ████ 71%

- "+ Add Intent" button
- "Train Model" button (bottom, primary)
- Training status: "Last trained: 2h ago"

CENTER PANEL - Dialog Flow Designer (flex-1):
- Canvas similar to Module Builder but for conversation flows

Canvas Header:
- Flow name: "Support Bot"
- Zoom controls
- Grid toggle
- "Auto-layout" button

Dialog Flow Nodes:
- Different visual style from Module Builder (softer, more rounded)
- Node types:
  - Start (green, rounded pill)
  - Message (blue, speech bubble shape)
  - Intent Router (orange, diamond)
  - KB Query (purple, database icon)
  - Human Handoff (yellow, person icon)
  - End (gray, rounded pill)

Example Flow:
```
[Start: Welcome]
    │
    ▼
[Intent Router]
    │
    ├─ FAQ ──► [KB Query] ──► [Response]
    │
    ├─ Sales ──► [Sales Flow]
    │
    └─ Support ──► [Human Handoff]
```

Node Styling:
- Background: #1E293B
- Border: 2px solid (varies by type)
- Rounded corners (12px, more than Module)
- Speech bubble tail for message nodes

Bottom Template Bar:
- "Flow Templates" label
- Horizontal scroll of template cards:
  - "FAQ Bot"
  - "CSAT Survey"
  - "Lead Capture"
  - "Appointment Booking"

RIGHT PANEL - Chat Agent (320px):
- Header: "Wendy" avatar (pink/magenta theme)
- Status: "online"

Chat Interface:
- Agent personality: friendly, conversational expert
- Example message: "Let's design your chatbot! What's the main purpose?"

[AGENT_CONTENT_ZONE]:
- Dynamic content area for:
  - Intent suggestions
  - Flow recommendations
  - Template previews
  - Training phrase generators

Quick Actions:
- Radio options below agent message:
  - "Customer support"
  - "Sales assistant"
  - "FAQ bot"
  - "Other"

Input Area:
- Same as Module Builder
- Placeholder: "Tell Wendy about your chatbot..."
```

---

## Screen 1.3.2: Intent Training Interface

### Stitch Prompt

```
Create an intent training modal/panel for defining chatbot intents and training phrases.

MODAL LAYOUT:
- Centered modal (640px width)
- Max height 80vh (scrollable)
- Background: #1E293B
- Border radius: 12px
- Shadow: xl

HEADER:
- Title: "Train Intent: order_status"
- Close button (X)
- Status badge: "Published" or "Draft"

CONTENT:

Section 1 - Basic Info:
- Intent Name:
  - Input: "order_status"
  - Validation: lowercase, underscores only

- Description:
  - Textarea: "User wants to check their order status"
  - Helper: "Helps agents understand intent purpose"

Section 2 - Training Phrases:
- Header: "Training Phrases" with count badge "(12)"
- Actions: "+ Add" button, "✨ Generate" AI button

Phrase List:
- Scrollable list (max 300px height)
- Each phrase is a row:
  - Bullet point
  - Phrase text with entity highlighting
  - Delete (X) button on hover
  - Edit on click

Example phrases:
- "Where is my order?"
- "Track my package"
- "What's the status of order [order_id]?" (entity highlighted in purple)
- "When will my order arrive?"
- "I want to track [order_id]"
- "Check order status"

Entity Highlighting:
- Entities in brackets: [order_id]
- Background: #8B5CF6/20 (purple tint)
- Border: 1px solid #8B5CF6
- Click to edit entity type

Add Phrase Input:
- Text input at bottom of list
- Placeholder: "Type a new training phrase..."
- Enter to add

AI Generation Panel (when ✨ clicked):
- Expands below button
- "Generate similar phrases based on existing ones"
- Number input: "Generate [10] more phrases"
- "Generate" button
- Shows generated phrases with checkboxes
- "Add Selected" button

Section 3 - Entity Extraction:
- Header: "Entities to Extract"
- Table with add capability

| Entity | Type | Example |
|--------|------|---------|
| order_id | @sys.number | "order 12345" |
| email | @sys.email | "john@example.com" |
| [+ Add Entity] | | |

Entity Type Dropdown Options:
- @sys.number
- @sys.email
- @sys.date
- @sys.phone
- @sys.any
- Custom entity...

Section 4 - Response Template:
- Header: "Default Response"
- Rich text editor
- Variable insertion for entities
- Example: "Let me check on order {{order_id}} for you..."

FOOTER:
- "Cancel" button (ghost)
- "Save as Draft" button (secondary)
- "Save & Train" button (primary)
- Training indicator: spinner when training

SUCCESS STATE:
- Toast notification: "Intent trained successfully"
- Confidence score preview
```

---

## Screen 1.3.3: Widget Customization

### Stitch Prompt

```
Create a chatbot widget customization panel with live preview.

LAYOUT:
- Two-column layout
- Left: Settings (50%)
- Right: Live Preview (50%)
- Full modal or page view

HEADER:
- Title: "Widget Settings"
- Close button

LEFT COLUMN - Settings:

Section 1 - Appearance:
- Section header with collapse

Primary Color:
- Color picker input
- Current: #4F46E5 with color swatch
- Click opens full color picker
- Hex input field

Position:
- Radio buttons:
  - Bottom Right (default)
  - Bottom Left

Launcher Style:
- Radio images (3 options):
  - Circle with chat icon
  - Rounded rectangle with text
  - Custom image upload

Avatar:
- Current avatar preview (48px circle)
- Actions:
  - "Upload" button
  - "AI Generate" button (creates avatar from description)
  - "Remove" link

Section 2 - Content:
- Welcome Message:
  - Textarea
  - Default: "Hi! How can I help you today?"
  - Character counter

- Bot Name:
  - Input: "Support Bot"

- Placeholder Text:
  - Input: "Type your message..."

Section 3 - Behavior:
- Auto-open toggle:
  - "Open widget automatically"
  - Delay input: "After [5] seconds"

- Typing indicator toggle

- Sound notification toggle

Section 4 - Advanced Settings (collapsed):
- Custom CSS textarea
- Z-index input
- Mobile settings
- Allowed domains list

RIGHT COLUMN - Live Preview:

Preview Frame:
- Mock website background (light gray)
- Simple website wireframe:
  - Nav bar placeholder
  - Hero section placeholder
  - Content area

Widget Preview:
- Positioned bottom-right (or left based on setting)
- Shows current customization in real-time

Launcher Button:
- Circular button with chat icon
- Primary color from settings
- Subtle bounce animation

Open Widget View:
- Chat window (320px width)
- Header with avatar and bot name
- Welcome message displayed
- Input field at bottom
- "Powered by Hyyve" footer

Device Toggle:
- Tab buttons: "Desktop" | "Tablet" | "Mobile"
- Preview adjusts to device size

EMBED CODE SECTION:
- Below preview
- Header: "Embed Code"
- Code block:
```html
<script src="https://cdn.hyyve.ai/widget.js"
  data-project-id="abc123"
  data-position="bottom-right"
  data-color="#4F46E5">
</script>
```
- Copy button
- "View Documentation" link

FOOTER:
- "Cancel" button
- "Save Changes" button (primary)
```

---

## AG-UI/A2UI Integration Markers

For Group 2 screens, the following areas require dynamic agent content:

| Screen | Zone | AG-UI/A2UI Component |
|--------|------|---------------------|
| 1.2.2a-f | Test Results | Dynamic JSON viewer, streaming test output |
| 1.3.1 | Chat Agent Panel | Full conversation UI, intent suggestions |
| 1.3.2 | AI Generation | Generated training phrases list |
| 1.3.3 | Widget Preview | Live widget with test responses |

---

**End of Group 2 (Screens 11-20)**

*Next: Group 3 will cover screens 1.3.4-1.4.7 (Chatbot Builder Details + Knowledge Base)*
