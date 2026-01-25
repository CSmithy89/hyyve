# Google Stitch Prompts - Group 8 (Screens 71-80)

**Project:** Hyyve Platform
**Screens:** Testing Framework + Module Export + API Gateway + Webhooks
**Design System:** shadcn/ui + Tailwind CSS (Dark Theme Primary)

---

## Screen 2.8.1: Test Suite Manager

### Stitch Prompt

```
Create a test suite manager dashboard with coverage summary, test suites table, and recent test runs.

LAYOUT:
- Full page dashboard
- Max-width: 1000px centered
- Background: #0F172A
- Padding: 24px

HEADER:
- Title: "Test Suites" 20px Semibold
- Actions: "[▶ Run All]" primary button, "[+ New Suite]" outline button
- Right-aligned

COVERAGE SUMMARY SECTION:
- Card background: #1E293B
- Border-radius: 12px
- Padding: 20px

Coverage Bar:
- Full width progress bar
- Height: 16px
- Background: #334155
- Fill: #4F46E5 at 87%
- Border-radius: 8px
- "87% Coverage" text right of bar

Coverage Details:
- Below bar, horizontal layout
- "Flows: 45/52 covered | Intents: 89/95 | Nodes: 156/178"
- Pipe-separated, #94A3B8 text

TEST SUITES TABLE:
- Card background: #1E293B
- Border-radius: 12px
- Padding: 20px
- Margin-top: 24px

Table Header:
- "Test Suites" 16px Semibold

Table Columns:
- Suite | Tests | Last Run | Status | Action
- Header row: #64748B text

Table Rows (5):
1. 📁 Smoke Tests | 12 | 2h ago | ✅ Pass | [▶]
2. 📁 Regression | 156 | 6h ago | ⚠️ 2 fail | [▶]
3. 📁 Intent Coverage | 95 | 1d ago | ✅ Pass | [▶]
4. 📁 Edge Cases | 34 | 3d ago | ✅ Pass | [▶]
5. 📁 Performance | 8 | 1w ago | ✅ Pass | [▶]

Status Badges:
- ✅ Pass: green text
- ⚠️ X fail: amber text
- ❌ Failed: red text

Folder icon: 📁 (or folder emoji)
Run button: [▶] icon button

Row hover: background #0F172A

RECENT TEST RUNS SECTION:
- Card background: #1E293B
- Border-radius: 12px
- Padding: 20px
- Margin-top: 24px

Section Header:
- "Recent Test Runs"

Test Run Items:
- Expandable card format

Run Item 1 (with failures):
- "⚠️ Regression Suite - 2h ago - 154/156 passed"
- Details: "Failed: 'Refund flow timeout', 'Edge case #23'"
- Actions: "[View Details]" "[Re-run Failed]" text buttons

Run Item 2 (success):
- "✅ Smoke Tests - 2h ago - 12/12 passed"
- Details: "Duration: 45s"
- Actions: "[View Details]"

Item spacing: 12px gap
Border between items: 1px solid #334155

DESIGN TOKENS:
- Background: #0F172A
- Card: #1E293B
- Progress bar: #4F46E5
- Success: #10B981
- Warning: #F59E0B
- Error: #EF4444

STATES:
- Running: spinner on row
- Expandable items: chevron indicator
- Run all: sequential execution indicator
- New suite: opens builder modal

ANIMATIONS:
- Progress bar: fill animation on load
- Test running: pulse on active row
```

---

## Screen 2.8.2: Test Case Builder

### Stitch Prompt

```
Create a test case builder interface with test configuration, step builder, and assertions summary.

LAYOUT:
- Full page or large modal
- Max-width: 800px centered
- Background: #1E293B
- Border-radius: 16px (if modal)

HEADER:
- Title: "Edit Test: Refund Request Flow"
- Action: "[Save]" primary button
- Padding: 20px 24px
- Border-bottom: 1px solid #334155

TEST CONFIGURATION SECTION:
- Padding: 24px

Config Card:
- Background: #0F172A
- Border-radius: 8px
- Padding: 16px

Config Fields:
1. Name Input:
   - Label: "Name:"
   - Input: "Refund Request Flow"
   - Full width

2. Suite Dropdown:
   - Label: "Suite:"
   - Dropdown: "Regression Tests"

3. Tags:
   - Label: "Tags:"
   - Tag chips: [refund] [critical] [+]
   - Chip styling: background #4F46E5/20, text #4F46E5
   - [+] button adds new tag

TEST STEPS SECTION:
- Section header: "Test Steps" with "[+ Add Step]" button
- Margin-top: 24px

Step Cards (4 steps, connected vertically):
- Vertical flow with arrows between
- Each step is a card

Step Card Structure:
- Background: #0F172A
- Border: 1px solid #334155
- Border-left: 3px solid #4F46E5 (colored by type)
- Border-radius: 8px
- Padding: 12px

Step 1 - User Input:
- Header: "Step 1: User Input"
- Content:
  - "Input: 'I want a refund for order #12345'"
  - "Variables: { order_id: '12345' }"
- Code font for values

Connector Arrow:
- ↓ symbol between steps
- Color: #475569

Step 2 - Assert Intent:
- Header: "Step 2: Assert Intent"
- Content:
  - "Expected Intent: refund_request"
  - "Confidence: >= 0.85"
  - "Extracted Entities: { order_id: '12345' }"

Step 3 - Assert Response Contains:
- Header: "Step 3: Assert Response Contains"
- Content:
  - "Must contain: 'refund', 'order #12345'"
  - "Must NOT contain: 'error', 'sorry'"

Step 4 - Assert State:
- Header: "Step 4: Assert State"
- Content:
  - "Context variable: refund_status = 'initiated'"
  - "Node reached: 'process_refund'"

ASSERTIONS SUMMARY SECTION:
- Card background: #0F172A
- Border-radius: 8px
- Padding: 16px
- Margin-top: 24px

Summary Header:
- "Assertions Summary"

Summary List:
- Bulleted list:
  - • Intent matches: refund_request (≥0.85)
  - • Entity extracted: order_id = "12345"
  - • Response contains required text
  - • Final state: refund_status = "initiated"

FOOTER ACTIONS:
- Border-top: 1px solid #334155
- Padding: 16px 24px
- "[Cancel]" ghost button
- "[▶ Run Test]" outline button with play icon
- "[Save & Close]" primary button

DESIGN TOKENS:
- Background: #1E293B
- Card: #0F172A
- Step border: varies by type
- Input type: #4F46E5
- Assert type: #10B981
- Error type: #EF4444

STATES:
- Step hover: edit controls appear
- Drag handle: reorder steps
- Run test: live results inline
- Validation error: red border on step

ANIMATIONS:
- Add step: slide in new card
- Remove step: slide out
- Run test: progress through steps
```

---

## Screen 2.8.3: Test Results & Coverage Report

### Stitch Prompt

```
Create a test results page with run summary cards, failed tests detail, coverage report, and test history chart.

LAYOUT:
- Full page report
- Max-width: 1000px centered
- Background: #0F172A
- Padding: 24px

HEADER:
- Title: "Test Results: Regression Suite"
- Action: "[Export]" outline button
- Padding-bottom: 24px

RUN SUMMARY CARDS:
- 3 cards in row
- Equal width
- Gap: 16px

Summary Card Structure:
- Background: #1E293B
- Border-radius: 12px
- Padding: 20px
- Height: 100px
- Text-center

Cards (3):
1. Pass Count:
   - Value: "154/156" (24px Semibold)
   - Label: "Passed"
   - Status: "✅ 98.7%" green text

2. Fail Count:
   - Value: "2 Failed"
   - Label: ""
   - Status: "⚠️ 1.3%" amber text

3. Duration:
   - Value: "3m 24s"
   - Label: "Duration"

FAILED TESTS SECTION:
- Card background: #1E293B
- Border-radius: 12px
- Padding: 20px
- Margin-top: 24px

Header Row:
- "Failed Tests" 16px Semibold
- "[Re-run]" button right-aligned

Failed Test Items (2):

Failed Item 1:
- "❌ Refund flow timeout"
- "Step 3 failed: Response took 5.2s (max: 3s)"
- Details:
  - "Expected: Response within 3000ms"
  - "Actual: 5234ms"
- Actions: "[View Details]" "[Debug]" "[Skip for Now]"

Failed Item 2:
- "❌ Edge case #23: Empty order ID"
- "Step 2 failed: Intent not matched"
- Details:
  - "Expected: refund_request (≥0.85)"
  - "Actual: unclear_intent (0.42)"
- Actions: "[View Details]" "[Debug]" "[Skip for Now]"

Error icon: ❌ red

COVERAGE REPORT SECTION:
- Card background: #1E293B
- Border-radius: 12px
- Padding: 20px
- Margin-top: 24px

Section Header:
- "Coverage Report"

Coverage Bars (4):
- Horizontal bar for each category
- Label | Bar | Percentage

Coverage Items:
1. Flows: [████████████████░░░░] 87% (45/52)
2. Intents: [█████████████████░░░] 94% (89/95)
3. Nodes: [████████████████░░░░] 88% (156/178)
4. Edge Cases: [████████████░░░░░░░░] 67% (34/51)

Bar styling:
- Width: 200px
- Height: 8px
- Background: #334155
- Fill: #4F46E5
- Border-radius: 4px

Uncovered Section:
- "Uncovered:" label
- Bulleted list:
  - • 7 flows: [payment_dispute] [subscription_cancel]...
  - • 22 nodes: [error_handler_3] [fallback_loop]...
- Items as clickable links

Generate Button:
- "[Generate Tests for Uncovered]" primary button

TEST HISTORY CHART:
- Card background: #1E293B
- Border-radius: 12px
- Padding: 20px
- Margin-top: 24px
- Height: 200px

Chart Header:
- "Test History"

Line Chart:
- X-axis: Date labels (Jan 1, Jan 8, Jan 15, Jan 22)
- Y-axis: Pass rate 80% to 100%
- Line color: #4F46E5
- Area fill: #4F46E5/10
- Data points with hover tooltips

Chart shows pass rate trend over time

DESIGN TOKENS:
- Background: #0F172A
- Card: #1E293B
- Pass: #10B981
- Fail: #EF4444
- Warning: #F59E0B
- Chart: #4F46E5

STATES:
- Failed test expanded: shows full error
- Debug: opens debug view
- Re-run: runs selected failures
- Export: downloads PDF/CSV

ANIMATIONS:
- Coverage bars: fill animation
- Chart: draw line animation
- Failed items: expandable
```

---

## Screen 2.9.1: Export Wizard

### Stitch Prompt

```
Create step 1 of the module export wizard with format selection cards.

LAYOUT:
- Centered modal or page
- Width: 720px
- Background: #1E293B
- Border radius: 16px

HEADER:
- Title: "Export Module: Customer Support Bot"
- Step indicator: "Step 1/3"
- Padding: 20px 24px
- Border-bottom: 1px solid #334155

MAIN CONTENT:
- Padding: 24px

Section Label:
- "Select Export Format" 16px Semibold

FORMAT SELECTION GRID:
- 3x2 grid of format cards
- Gap: 16px

Format Card Structure:
- Width: ~200px
- Height: ~140px
- Background: #0F172A
- Border: 1px solid #334155
- Border-radius: 12px
- Padding: 16px
- Text-center
- Selectable (radio behavior)

Format Cards (6):

Row 1:
1. Claude SDK:
   - Icon: 🤖 (or Anthropic logo)
   - Name: "Claude SDK"
   - Description: "Native Claude Code workflow format"
   - Selection indicator: "[● Selected]" or "[○]"

2. LangGraph:
   - Icon: 🦜 (or LangChain logo)
   - Name: "LangGraph"
   - Description: "LangChain's graph orchestration"
   - Selection indicator: "[○]"

Row 2:
3. Agno Framework:
   - Icon: 🧬
   - Name: "Agno Framework"
   - Description: "Model-agnostic agent framework"

4. CrewAI:
   - Icon: 👥
   - Name: "CrewAI"
   - Description: "Multi-agent orchestration"

Row 3:
5. JSON Schema:
   - Icon: 📦
   - Name: "JSON Schema"
   - Description: "Portable workflow definition"

6. Python SDK:
   - Icon: 🐍
   - Name: "Python SDK"
   - Description: "Native Python implementation"

Selected State:
- Border: 2px solid #4F46E5
- Background: #4F46E5/10
- Radio filled

Unselected State:
- Border: 1px solid #334155
- Radio empty

FOOTER ACTIONS:
- Border-top: 1px solid #334155
- Padding: 16px 24px
- "[Cancel]" ghost button
- "[Next: Options]" primary button

DESIGN TOKENS:
- Background: #1E293B
- Card: #0F172A
- Border: #334155
- Selected: #4F46E5
- Text: #F8FAFC
- Description: #94A3B8

STATES:
- Card hover: border color change
- Card selected: blue border + background tint
- Next disabled: until format selected

ANIMATIONS:
- Card hover: subtle lift
- Selection: border transition
```

---

## Screen 2.9.2: Export Configuration & Download

### Stitch Prompt

```
Create step 3 of export wizard with export options, dependencies analysis, file preview, and download action.

LAYOUT:
- Same modal structure
- Width: 720px
- Background: #1E293B

HEADER:
- Title: "Export Module: Customer Support Bot"
- Step indicator: "Step 3/3"
- Progress bar: 100% filled

MAIN CONTENT:
- Padding: 24px

EXPORT OPTIONS SECTION:
- Label: "Export Options" 14px Semibold
- Card container

Include Checkboxes:
- "Include:" label
- Checkbox list:
  - ☑️ Workflow definition
  - ☑️ Node configurations
  - ☑️ Prompt templates
  - ☑️ Environment variables template
  - ☐ Knowledge Base (embeddings)
    - Warning: "⚠️ Large file: ~234MB"
  - ☑️ Test suite
  - ☐ Deployment scripts (Docker/K8s)

Warning styling: amber icon and text

DEPENDENCIES ANALYSIS SECTION:
- Label: "Dependencies Analysis" 14px Semibold
- Card container
- Margin-top: 20px

Dependency Lists:
- "Required packages (auto-detected):" subheader

Package List (monospace):
- • @anthropic-ai/sdk: ^0.25.0
- • langchain: ^0.2.0
- • @langchain/anthropic: ^0.2.0
- • zod: ^3.22.0

MCP Tools Section:
- "MCP Tools Required:" subheader
- • filesystem-tools (local install)
- • web-search (API key required)

EXPORT PREVIEW SECTION:
- Label: "Export Preview" 14px Semibold
- Code block container

File Tree Display:
- Background: #0F172A
- Font: JetBrains Mono, 12px
- Padding: 16px
- Border-radius: 8px

File Tree:
```
customer-support-bot/
├── workflow.claude.md
├── nodes/
│   ├── classify-intent.ts
│   ├── generate-response.ts
│   └── escalate-human.ts
├── prompts/
│   └── system-prompt.md
├── tests/
│   └── workflow.test.ts
├── .env.example
└── README.md
```

Tree styling:
- Folder: bold or different color
- File: normal weight
- Indent lines: │ and ├──

FOOTER ACTIONS:
- Border-top: 1px solid #334155
- Padding: 16px 24px
- "[← Back]" ghost button
- "[Preview Code]" outline button
- "[📥 Download ZIP]" primary button with icon

Download button emphasized (larger or different styling)

DESIGN TOKENS:
- Background: #1E293B
- Code block: #0F172A
- Border: #334155
- Primary: #4F46E5
- Warning: #F59E0B
- Font code: JetBrains Mono

STATES:
- KB selected: warning appears
- Preview code: opens code viewer modal
- Download: starts ZIP download
- Large export: shows progress

ANIMATIONS:
- Download: progress indicator
- Preview: modal slide in
```

---

## Screen 2.10.1: API Endpoint Manager

### Stitch Prompt

```
Create an API endpoint manager showing base URL, endpoints table, quick stats, and documentation links.

LAYOUT:
- Full page dashboard
- Max-width: 1000px centered
- Background: #0F172A
- Padding: 24px

HEADER:
- Title: "API Endpoints" 20px Semibold
- Action: "[+ New Endpoint]" primary button

BASE URL ROW:
- "Base URL:" label
- URL display: "https://api.mycompany.com/v1"
- Actions: "[Copy]" "[Edit]" text buttons
- Background: #1E293B
- Padding: 12px 16px
- Border-radius: 8px
- Margin-top: 24px

ENDPOINTS TABLE:
- Card background: #1E293B
- Border-radius: 12px
- Padding: 20px
- Margin-top: 24px

Table Header:
- "Endpoints" implied by context

Table Columns:
- Method | Path | Module | Status
- Column widths: 70px | flex | 120px | 100px

Table Rows (6):
1. POST | /chat | Support Bot | 🟢 Active
2. POST | /classify | Intent Class | 🟢 Active
3. POST | /search | KB Search | 🟢 Active
4. GET | /health | System | 🟢 Active
5. POST | /voice/call | Voice Agent | 🟡 Testing
6. POST | /generate/image | Canvas | 🔴 Disabled

Method Badges:
- POST: blue badge (#3B82F6)
- GET: green badge (#10B981)
- PUT: amber badge (#F59E0B)
- DELETE: red badge (#EF4444)

Status Indicators:
- 🟢 Active: green dot + text
- 🟡 Testing: amber dot + text
- 🔴 Disabled: red dot + text

Row click: opens endpoint details

QUICK STATS CARDS:
- 3 cards in row
- Gap: 16px
- Margin-top: 24px

Stats Cards (3):
1. Requests:
   - Value: "45.2K"
   - Label: "Requests"
   - Subtitle: "(Last 24h)"

2. Average Latency:
   - Value: "234ms"
   - Label: "Avg Lat"

3. Error Rate:
   - Value: "0.12%"
   - Label: "Error Rate"

Card styling:
- Background: #1E293B
- Border-radius: 12px
- Padding: 16px
- Text-center

API DOCUMENTATION SECTION:
- Card background: #1E293B
- Border-radius: 12px
- Padding: 20px
- Margin-top: 24px

Doc Items:
1. "📄 OpenAPI Spec" with "[View]" "[Download]" buttons
2. "🌐 Interactive Docs" with URL link
3. "📚 SDK Downloads" with "[Python]" "[TypeScript]" "[cURL]" buttons

Each item on own row with actions right-aligned

DESIGN TOKENS:
- Background: #0F172A
- Card: #1E293B
- POST: #3B82F6
- GET: #10B981
- Active: #10B981
- Testing: #F59E0B
- Disabled: #EF4444

STATES:
- Endpoint hover: row highlight
- Copy: success toast
- New endpoint: opens config modal
- SDK download: initiates download

ANIMATIONS:
- Table hover: row background
- Stats: count up animation
```

---

## Screen 2.10.2: Rate Limiting Configuration

### Stitch Prompt

```
Create a rate limiting configuration page for an API endpoint with global limits, tier-based limits, and response configuration.

LAYOUT:
- Full page or modal
- Max-width: 720px centered
- Background: #1E293B
- Border-radius: 16px (if modal)

HEADER:
- Title: "Rate Limiting: /chat Endpoint"
- Action: "[Save]" primary button
- Padding: 20px 24px
- Border-bottom: 1px solid #334155

GLOBAL LIMITS SECTION:
- Label: "Global Limits" 14px Semibold
- Card container
- Padding: 24px

Global Inputs (5):
- Row format: Label | Input | Unit

1. "Requests per minute: [100] (per API key)"
2. "Requests per day: [10000] (per API key)"
3. "Concurrent requests: [10] (per API key)"
4. "Burst allowance: [20] requests"
5. "Burst window: [10] seconds"

Input styling:
- Width: 80px
- Background: #0F172A
- Border: 1px solid #334155
- Text-align: right

TIER-BASED LIMITS SECTION:
- Label: "Tier-Based Limits" 14px Semibold
- Card container
- Margin-top: 24px

Tier Table:
- Columns: Tier | Req/min | Req/day | Concurrent | Burst
- Editable cells

Tier Rows (4):
1. Free | 10 | 100 | 2 | 5
2. Pro | 100 | 10,000 | 10 | 20
3. Enterprise | 1,000 | 100,000 | 50 | 100
4. Unlimited | ∞ | ∞ | 100 | ∞

Infinity symbol: ∞ for unlimited
Row styling: alternating backgrounds

RATE LIMIT RESPONSE SECTION:
- Label: "Rate Limit Response" 14px Semibold
- Card container
- Margin-top: 24px

Response Config:
1. HTTP Status Dropdown:
   - "HTTP Status: [▼ 429 Too Many Requests]"

2. Response Body Preview:
   - Code block:
```json
{
  "error": "rate_limit_exceeded",
  "retry_after": 60,
  "limit": 100,
  "remaining": 0
}
```
   - Background: #0F172A
   - Font: JetBrains Mono

3. Headers Info:
   - "Headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset"
   - Monospace styling

FOOTER ACTIONS:
- Border-top: 1px solid #334155
- Padding: 16px 24px
- "[Cancel]" ghost button
- "[Save Configuration]" primary button

DESIGN TOKENS:
- Background: #1E293B
- Input bg: #0F172A
- Border: #334155
- Primary: #4F46E5
- Code font: JetBrains Mono

STATES:
- Input validation: error for invalid numbers
- Unlimited toggle: shows ∞
- Save: validates all fields
- Tier edit: inline editing
```

---

## Screen 2.10.3: API Key Management

### Stitch Prompt

```
Create an API key management page with active keys table and key generation form.

LAYOUT:
- Full page dashboard
- Max-width: 900px centered
- Background: #0F172A
- Padding: 24px

HEADER:
- Title: "API Keys" 20px Semibold
- Action: "[+ Generate Key]" primary button

ACTIVE KEYS TABLE:
- Card background: #1E293B
- Border-radius: 12px
- Padding: 20px
- Margin-top: 24px

Section Header:
- "Active Keys"

Table Columns:
- Name | Key Prefix | Created | Last Used | Actions

Key Rows (3):

Row 1:
- Name: "Production App"
- Key Prefix: "sk_live_*4j" (masked)
- Created: "Jan 1, 2025"
- Last Used: "2 min ago" + "45K req/day"
- Actions: [Revoke] [Edit] [Stats]

Row 2:
- Name: "Mobile App"
- Key Prefix: "sk_live_*8x"
- Created: "Dec 15"
- Last Used: "1 hour ago" + "12K req/day"
- Actions: [Revoke] [Edit] [Stats]

Row 3:
- Name: "Test Key"
- Key Prefix: "sk_test_*2m"
- Created: "Dec 1"
- Last Used: "3 days ago" + "234 req/day"
- Actions: [Revoke] [Edit] [Stats]

Key prefix styling: monospace, masked with asterisks
Actions: text buttons, Revoke in red on hover

GENERATE NEW KEY SECTION:
- Card background: #1E293B
- Border-radius: 12px
- Padding: 24px
- Margin-top: 24px

Section Header:
- "Generate New Key"

Form Fields:
1. Name Input:
   - Label: "Name:"
   - Input placeholder

2. Environment Radio:
   - "Environment:"
   - Options: ○ Production  ● Test

3. Expiration Radio:
   - "Expiration:"
   - Options: ○ Never  ● After [30] days

4. Permissions Checkboxes:
   - "Permissions:"
   - Grid layout (2 columns):
     - ☑️ /chat      ☑️ /classify   ☐ /admin
     - ☑️ /search    ☐ /voice       ☐ /billing

5. IP Restrictions:
   - Label: "IP Restrictions (optional):"
   - Input: "192.168.1.0/24, 10.0.0.0/8"

Submit Button:
- "[Generate API Key]" primary button
- Right-aligned

SECURITY WARNING:
- Full width alert
- Icon: ⚠️
- Text: "API keys grant full access to your modules. Keep them secure and never expose in client-side code."
- Background: #F59E0B/10
- Border-left: 4px solid #F59E0B
- Margin-top: 24px

DESIGN TOKENS:
- Background: #0F172A
- Card: #1E293B
- Border: #334155
- Primary: #4F46E5
- Warning: #F59E0B
- Danger: #EF4444
- Code font: JetBrains Mono

STATES:
- Generate: shows new key (copy immediately warning)
- Revoke: confirmation modal
- Edit: inline permission changes
- Stats: opens usage analytics

ANIMATIONS:
- New key reveal: fade in with copy button
- Revoke: row slides out
```

---

## Screen 2.11.1: Webhook Configuration

### Stitch Prompt

```
Create a webhook configuration page with active webhooks table and new webhook form.

LAYOUT:
- Full page dashboard
- Max-width: 900px centered
- Background: #0F172A
- Padding: 24px

HEADER:
- Title: "Webhooks" 20px Semibold
- Action: "[+ New Webhook]" primary button

ACTIVE WEBHOOKS TABLE:
- Card background: #1E293B
- Border-radius: 12px
- Padding: 20px
- Margin-top: 24px

Section Header:
- "Active Webhooks"

Table Columns:
- Endpoint | Events | Status | Actions
- Column widths: flex | 100px | 100px | 50px

Webhook Rows (3):

Row 1:
- Endpoint: "https://myapp.com/webhook"
- Subtext: "Last delivery: 2 min ago"
- Events: "5 events"
- Status: "🟢 Active" + "99.8%"
- Actions: [⚙️] icon button

Row 2:
- Endpoint: "https://slack.com/hooks/..."
- Subtext: "Last delivery: 1 hour ago"
- Events: "2 events"
- Status: "🟢 Active" + "100%"
- Actions: [⚙️]

Row 3:
- Endpoint: "https://old.api.com/hook"
- Subtext: "Last delivery: Failed 3x"
- Events: "3 events"
- Status: "🔴 Failing" + "45%"
- Actions: [⚙️]

Status Indicators:
- 🟢 Active: green dot + success rate
- 🔴 Failing: red dot + failure rate

ADD NEW WEBHOOK SECTION:
- Card background: #1E293B
- Border-radius: 12px
- Padding: 24px
- Margin-top: 24px

Section Header:
- "Add New Webhook"

Form Fields:
1. Endpoint URL:
   - Label: "Endpoint URL:"
   - Input: "https://" placeholder
   - Full width

2. Events to Subscribe:
   - Label: "Events to Subscribe:"
   - Checkbox grid (2 columns):
     - ☑️ conversation.started    ☐ conversation.ended
     - ☑️ message.received        ☑️ message.sent
     - ☐ intent.detected          ☑️ handoff.triggered
     - ☐ execution.started        ☐ execution.completed
     - ☐ error.occurred           ☐ deployment.completed

3. Secret:
   - Label: "Secret (for signature verification):"
   - Input: "whsec_************************" (masked)
   - "[Generate New Secret]" text button

Actions:
- "[Test Webhook]" outline button
- "[Save]" primary button

DESIGN TOKENS:
- Background: #0F172A
- Card: #1E293B
- Border: #334155
- Primary: #4F46E5
- Success: #10B981
- Failing: #EF4444

STATES:
- Test webhook: sends test event
- Generate secret: creates new secret
- Failing webhook: alert styling
- Edit mode: expands config

ANIMATIONS:
- Test success: green flash
- Test failure: red flash with error
- New webhook: slides in
```

---

## Screen 2.11.2: Webhook Delivery Logs

### Stitch Prompt

```
Create a webhook delivery logs page with stats cards, delivery history table, and failed delivery detail panel.

LAYOUT:
- Full page
- Max-width: 1000px centered
- Background: #0F172A
- Padding: 24px

HEADER:
- Title: "Webhook Logs: https://myapp.com/webhook"
- Action: "[Export]" outline button

DELIVERY STATS CARDS:
- 3 cards in row
- Gap: 16px
- Margin-top: 24px

Stats Cards (3):
1. Deliveries:
   - Value: "1,234"
   - Label: "Deliveries"

2. Success Rate:
   - Value: "99.8%"
   - Label: "Success Rate"

3. Average Latency:
   - Value: "145ms"
   - Label: "Avg Latency"

RECENT DELIVERIES TABLE:
- Card background: #1E293B
- Border-radius: 12px
- Padding: 20px
- Margin-top: 24px

Header Row:
- "Recent Deliveries" + "[Filter ▼]" dropdown

Table Columns:
- Time | Event | Status | Duration

Delivery Rows (5):
1. 14:23:45 | message.received | ✓ 200 | 134ms
2. 14:23:12 | message.sent | ✓ 200 | 98ms
3. 14:22:56 | conversation.start | ✓ 200 | 156ms
4. 14:20:34 | handoff.triggered | ✗ 500 | 2345ms
   - Subrow: "Retry 1/3 scheduled in 60s"
5. 14:18:23 | message.received | ✓ 200 | 112ms

Status Indicators:
- ✓ 200: green text
- ✗ 500: red text

Failed row: expanded with retry info

FAILED DELIVERY DETAIL PANEL:
- Card background: #1E293B
- Border-radius: 12px
- Padding: 20px
- Margin-top: 24px

Header:
- "Failed Delivery Detail"

Detail Fields:
- "Event: handoff.triggered"
- "Time: 14:20:34"
- "Status: 500 Internal Server Error"

Request Section:
- "Request:" subheader
- Code block:
```
POST /webhook HTTP/1.1
X-Webhook-Signature: sha256=abc123...
{ "event": "handoff.triggered", "data": {...} }
```

Response Section:
- "Response:" subheader
- Code block:
```
{ "error": "Database connection failed" }
```

Retry Info:
- "Retry Settings: 3 attempts, exponential backoff"
- "Next retry: In 45 seconds"

Actions:
- "[Retry Now]" primary button
- "[Skip Retries]" outline button
- "[View Full]" text button

DESIGN TOKENS:
- Background: #0F172A
- Card: #1E293B
- Success: #10B981
- Error: #EF4444
- Code bg: #0F172A
- Code font: JetBrains Mono

STATES:
- Retry now: immediate retry attempt
- Skip: cancels pending retries
- Filter: by status/event type
- Export: downloads CSV

ANIMATIONS:
- Retry countdown: updates in real-time
- New delivery: slides in at top
- Retry success: status updates
```

---

## Design System Reference (Group 8)

### Testing & API Components

```
TEST STATUS:
- Pass: #10B981 (green) ✅
- Fail: #EF4444 (red) ❌
- Warning: #F59E0B (amber) ⚠️
- Skipped: #64748B (gray)

COVERAGE BARS:
- Background: #334155
- Fill: #4F46E5
- Low coverage (< 70%): #F59E0B
- Critical (< 50%): #EF4444
- Height: 8px

API METHOD BADGES:
- GET: #10B981
- POST: #3B82F6
- PUT: #F59E0B
- DELETE: #EF4444
- Badge padding: 4px 8px
- Border-radius: 4px
- Font-weight: 600

HTTP STATUS:
- 2xx: #10B981 (green)
- 4xx: #F59E0B (amber)
- 5xx: #EF4444 (red)

WEBHOOK STATUS:
- Active: green dot + percentage
- Failing: red dot + percentage
- Disabled: gray dot

CODE BLOCKS:
- Background: #0F172A
- Font: JetBrains Mono, 12px
- Padding: 16px
- Border-radius: 8px
- Syntax highlighting enabled
```

---

## Group 8 Cross-References

| Screen | PRD Reference | Architecture Reference | Components |
|--------|--------------|----------------------|------------|
| 2.8.1 Test Suite Manager | FR176-FR185 | Test Service | CoverageBar, SuiteTable, RunHistory |
| 2.8.2 Test Case Builder | FR176-FR185 | Test Service | StepCard, AssertionConfig, FlowConnector |
| 2.8.3 Test Results | FR176-FR185 | Test Service | SummaryCards, FailedList, CoverageReport |
| 2.9.1 Export Wizard | FR186-FR190 | Export Service | FormatCard, WizardProgress |
| 2.9.2 Export Config | FR186-FR190 | Export Service | OptionsCheckbox, DependencyList, FileTree |
| 2.10.1 API Endpoints | FR191-FR196 | API Gateway | EndpointTable, MethodBadge, QuickStats |
| 2.10.2 Rate Limiting | FR191-FR196 | API Gateway | TierTable, LimitInput, ResponsePreview |
| 2.10.3 API Key Mgmt | FR191-FR196 | API Gateway | KeyTable, PermissionGrid, GenerateForm |
| 2.11.1 Webhook Config | FR233-FR238 | Webhook Service | WebhookTable, EventCheckbox, SecretInput |
| 2.11.2 Webhook Logs | FR233-FR238 | Webhook Service | DeliveryTable, FailedDetail, RetryControls |

---

## AG-UI/A2UI Integration Points (Group 8)

| Screen | Zone | Integration Type | Notes |
|--------|------|-----------------|-------|
| 2.8.2 Test Case Builder | Test Results | AG-UI Streaming | Real-time test execution results |
| 2.8.3 Test Results | History Chart | AG-UI Charts | Live test history updates |
| 2.11.2 Webhook Logs | Log Stream | AG-UI Streaming | Real-time delivery log updates |
