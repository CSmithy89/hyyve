# Google Stitch Prompts - Group 7 (Screens 61-70)

**Project:** Hyyve Platform
**Screens:** Human-in-the-Loop (HITL) + Chatwoot Deployment + Environment Management
**Design System:** shadcn/ui + Tailwind CSS (Dark Theme Primary)

---

## Screen 2.4.1: HITL Queue Dashboard

### Stitch Prompt

```
Create a human-in-the-loop review queue dashboard with KPI cards, pending reviews list, and assigned items section.

LAYOUT:
- Full page dashboard
- Max-width: 1000px centered
- Background: #0F172A
- Padding: 24px

HEADER:
- Title: "Human Review Queue" 20px Semibold
- Actions: "[Auto-Assign]" primary button, "[⚙️]" settings icon button
- Right-aligned actions

KPI SUMMARY CARDS:
- 4 cards in row
- Equal width
- Gap: 16px

KPI Card Structure:
- Background: #1E293B
- Border radius: 12px
- Padding: 20px
- Height: 80px
- Text-center

KPI Cards (4):
1. Pending:
   - Value: "12" (24px Semibold)
   - Label: "Pending"

2. Urgent:
   - Value: "3"
   - Label: "Urgent"
   - Value color: #EF4444 (red)

3. Assigned:
   - Value: "8"
   - Label: "Assigned"

4. Average Wait:
   - Value: "45s"
   - Label: "Avg Wait"

PENDING REVIEWS SECTION:
- Section header row:
  - Title: "Pending Reviews"
  - Filter dropdown: "[Filter ▼]"
  - Sort dropdown: "[Sort ▼]"
- Vertical stack of review cards

Review Card Structure:
- Background: #1E293B
- Border: 1px solid #334155
- Border-radius: 12px
- Padding: 16px
- Margin-bottom: 12px
- Hover: border #4F46E5

Review Card 1 (Urgent):
- Priority badge: "🔴 URGENT" red pill badge
- Type: "| Refund Request > $500"
- Row 2: "Customer: John D. | Workflow: Refund Processing"
- Row 3: "Waiting: 2m 34s | Confidence: 67%"
- Actions row: "[View]" "[Assign to Me]" "[Escalate]" text buttons

Urgent styling:
- Left border: 3px solid #EF4444
- Badge: background #EF4444, white text

Review Card 2 (Normal):
- Priority badge: "🟡 NORMAL" amber pill badge
- Type: "| Account Verification"
- Customer: Sarah M. | Workflow: KYC Check
- Waiting: 45s | Confidence: 82%
- Actions: "[View]" "[Assign to Me]" "[Auto-Approve]"

Normal styling:
- Badge: background #F59E0B, dark text

Confidence Display:
- Low confidence (< 70%): red text
- Medium (70-85%): amber text
- High (> 85%): green text

MY ASSIGNED SECTION:
- Section header: "My Assigned (3)"
- Collapsed list format

Assigned Items:
- List rows, not cards
- Each row:
  - Bullet point
  - Title
  - Status badge
  - Action button

Assigned Items (3):
1. • Contract Review - TechCorp    [In Progress]  [Resume]
2. • Data Export Request           [Not Started]  [Start]
3. • Custom Pricing Approval       [In Progress]  [Resume]

Status Badges:
- In Progress: blue badge
- Not Started: gray badge

DESIGN TOKENS:
- Background: #0F172A
- Card: #1E293B
- Urgent: #EF4444
- Warning: #F59E0B
- Primary: #4F46E5
- Success: #10B981

STATES:
- Assign to me: button changes to "Assigned ✓"
- Auto-assign: distributes based on workload
- Card hover: elevated, border highlight
- New items: subtle pulse animation

RESPONSIVE:
- Mobile: KPIs in 2x2 grid
- Cards stack vertically
- Actions collapse to dropdown on small screens
```

---

## Screen 2.4.2: Review Interface

### Stitch Prompt

```
Create a split-view review interface with context panel, AI recommendation, and decision controls.

LAYOUT:
- Full page view
- Two-column layout (50/50)
- Background: #0F172A

HEADER:
- Title: "Review: Refund Request #RF-2345"
- Back button: "[← Back to Q]" text button
- Padding: 16px 24px
- Border-bottom: 1px solid #334155

MAIN CONTENT - TWO COLUMNS:
- Gap: 24px
- Padding: 24px

LEFT COLUMN - CONTEXT:
- Card background: #1E293B
- Border radius: 12px
- Padding: 20px
- Height: fit-content

Context Section Header:
- "CONTEXT" 12px uppercase #64748B

Customer Information:
- "Customer: John Doe"
- "Email: john@example.com"
- "Account Age: 2 years"
- "Lifetime Value: $2,340"
- Each on own line, label: #94A3B8, value: #F8FAFC

Request Details Card (Nested):
- Background: #0F172A
- Border: 1px solid #334155
- Border-radius: 8px
- Padding: 12px
- Margin: 16px 0

Request Details Content:
- "Amount: $547.00" (emphasized, larger)
- "Order: #ORD-98765"
- "Reason: Changed mind"
- "Product: Widget Pro"

Conversation History:
- Label: "Conversation History:"
- Link: "[View Full Thread]" text button
- Opens modal or expands

RIGHT COLUMN - AI RECOMMENDATION:
- Card background: #1E293B
- Border radius: 12px
- Padding: 20px

Section Header:
- "AI RECOMMENDATION" 12px uppercase #64748B

Suggested Action Card:
- Background: #0F172A
- Border: 2px solid #4F46E5
- Border-radius: 8px
- Padding: 16px
- Text-center

Action Content:
- "● APPROVE REFUND" (filled dot, text)
- "Confidence: 67%" below
- Confidence color: amber (medium)

Reasoning Section:
- Label: "Reasoning:"
- Bulleted list:
  - - Customer in good standing
  - - Product unopened
  - - Within return window
  - - Similar cases approved

Similar Past Decisions:
- Label: "Similar Past Decisions:"
- "• Approved: 89%"
- "• Denied: 11%"
- Mini pie chart optional

YOUR DECISION SECTION:
- Full width below columns
- Card background: #1E293B
- Border radius: 12px
- Padding: 24px
- Margin-top: 24px

Decision Radio Buttons:
- Horizontal layout:
  - ○ Approve Refund
  - ○ Partial Refund
  - ○ Deny
- Radio styling: 20px, primary when selected

Notes Field:
- Label: "Notes (optional):"
- Textarea:
  - Height: 80px
  - Background: #0F172A
  - Border: 1px solid #334155
  - Placeholder: "Add any notes for this decision..."

FOOTER ACTIONS:
- Full width
- Right-aligned buttons
- Padding: 16px 24px
- "[Skip for Now]" ghost button
- "[Submit Decision]" primary button

DESIGN TOKENS:
- Background: #0F172A
- Card: #1E293B
- Nested card: #0F172A
- Primary: #4F46E5
- Confidence high: #10B981
- Confidence medium: #F59E0B
- Confidence low: #EF4444

STATES:
- Radio selected: filled primary color
- Submit disabled: until decision selected
- Skip: moves to next item
- Notes typing: auto-save indicator

ANIMATIONS:
- Panel slide-in from right
- Decision submit: success animation
- Skip: slide to next review
```

---

## Screen 2.6.1: Chatwoot Deployment Wizard

### Stitch Prompt

```
Create step 1 of the Chatwoot deployment wizard for selecting or connecting a Chatwoot instance.

LAYOUT:
- Centered modal or full page
- Width: 640px
- Background: #1E293B
- Border radius: 16px

HEADER:
- Title: "Deploy to Chatwoot"
- Step indicator: "Step 1 of 4"
- Progress bar below title:
  - 25% filled (step 1 of 4)
  - Track: #334155
  - Fill: #4F46E5
  - Height: 4px
- Padding: 20px 24px
- Border-bottom: 1px solid #334155

MAIN CONTENT:
- Padding: 24px

Section Label:
- "Select Chatwoot Instance" 16px Semibold

CONNECTED INSTANCES:
- Radio group
- Section label: "● Connected Instances"

Instance Cards (2):
Card Structure:
- Background: #0F172A
- Border: 1px solid #334155
- Border-radius: 8px
- Padding: 16px
- Margin: 8px 0
- Selectable (radio behavior)

Instance 1 (Production):
- Status: "🟢" green dot
- Name: "Production (chat.mycompany.com)"
- Stats: "12 inboxes | 45 agents | Connected"
- Selected state: border #4F46E5

Instance 2 (Staging):
- Status: "🟡" amber dot
- Name: "Staging (staging-chat.mycompany.com)"
- Stats: "3 inboxes | 5 agents | Connected"

Status Indicators:
- 🟢 Green: healthy, connected
- 🟡 Amber: connected but limited
- 🔴 Red: disconnected/error

CONNECT NEW INSTANCE:
- Radio option: "○ Connect New Instance"
- Expanded form when selected:

New Connection Form:
- URL Input:
  - Label: "Chatwoot URL:"
  - Prefix: "https://"
  - Placeholder in input area
  - Full width

- API Key Input:
  - Label: "API Key:"
  - Masked input: "********"
  - "[Show]" toggle button
  - Full width

- Test Button:
  - "[Test Connection]" outline button
  - Below inputs
  - Shows success/error after test

FOOTER ACTIONS:
- Border-top: 1px solid #334155
- Padding: 16px 24px
- Buttons:
  - "[Cancel]" ghost button (left)
  - "[Next: Inbox →]" primary button (right)
- Next disabled if no instance selected

DESIGN TOKENS:
- Background: #1E293B
- Card: #0F172A
- Border: #334155
- Primary: #4F46E5
- Connected: #10B981
- Warning: #F59E0B
- Error: #EF4444

STATES:
- Instance selected: border highlight
- Testing connection: spinner on button
- Connection success: green check
- Connection error: red message
- Form validation: inline errors

ANIMATIONS:
- Form expand: smooth height
- Test result: fade in
- Step transition: slide left
```

---

## Screen 2.6.2: Inbox Selection & Channel Config

### Stitch Prompt

```
Create step 2 of Chatwoot deployment wizard for selecting inboxes and configuring agent behavior.

LAYOUT:
- Same modal/page structure as step 1
- Width: 640px
- Background: #1E293B

HEADER:
- Title: "Deploy to Chatwoot"
- Step indicator: "Step 2 of 4"
- Progress bar: 50% filled
- Padding: 20px 24px

MAIN CONTENT:
- Padding: 24px

SELECT TARGET INBOX SECTION:
- Label: "Select Target Inbox" 16px Semibold
- Card container

Instance Context:
- "Available Inboxes on Production" 14px #94A3B8

Inbox Checkbox List:
- Scrollable if many inboxes
- Max-height: 280px

Inbox Item Structure:
- Checkbox + Icon + Name + Details
- Full width row
- Padding: 12px
- Border-bottom: 1px solid #334155

Inbox Items (5):
1. ☐ 💬 Website Widget (support.mycompany.com)
      Channels: Web | 234 conversations/day

2. ☑️ 📱 WhatsApp Business (+1-555-0123)
      Channels: WhatsApp | 89 conversations/day

3. ☑️ 📧 Email Support (support@mycompany.com)
      Channels: Email | 156 conversations/day

4. ☐ 📲 Telegram Bot (@mycompanybot)
      Channels: Telegram | 23 conversations/day

5. ☐ 💼 Facebook Messenger
      Channels: Messenger | 45 conversations/day

Icon meanings:
- 💬 Web widget
- 📱 WhatsApp
- 📧 Email
- 📲 Telegram
- 💼 Facebook

Checkbox styling:
- Size: 20px
- Checked: #4F46E5 fill with white checkmark
- Unchecked: border #475569

AGENT BEHAVIOR CONFIGURATION:
- Section label: "Agent Behavior Configuration" 16px Semibold
- Card container
- Margin-top: 24px

Initial Message:
- Label: "Initial Message:"
- Textarea:
  - Height: 60px
  - Content: "Hi! I'm your AI assistant. How can I help?"
  - Background: #0F172A
  - Border: 1px solid #334155

Response Mode:
- Label: "Response Mode:"
- Radio group (vertical):

Radio Options:
1. ● Auto-respond to all messages
   - Selected default
   - Helper: "AI responds immediately to every message"

2. ○ Respond only when tagged @bot
   - Helper: "AI only engages when explicitly mentioned"

3. ○ Suggest responses (agent approves)
   - Helper: "AI drafts response, human agent sends"

Radio styling:
- 18px circles
- Selected: #4F46E5 fill
- Helper text: 12px #64748B, indented

FOOTER ACTIONS:
- "[← Back]" ghost button
- "[Next: Handoff Rules →]" primary button

DESIGN TOKENS:
- Background: #1E293B
- Input bg: #0F172A
- Border: #334155
- Primary: #4F46E5
- Helper text: #64748B

STATES:
- No inbox selected: Next disabled
- Multiple inboxes: all receive same config
- Response mode: updates helper text
```

---

## Screen 2.6.3: Human Handoff Configuration

### Stitch Prompt

```
Create step 3 of Chatwoot deployment wizard for configuring human handoff rules and behavior.

LAYOUT:
- Same modal structure
- Width: 640px
- Background: #1E293B

HEADER:
- Title: "Deploy to Chatwoot"
- Step indicator: "Step 3 of 4"
- Progress bar: 75% filled

MAIN CONTENT:
- Padding: 24px

HANDOFF RULES SECTION:
- Label: "Human Handoff Rules (FR160-FR162)" 16px Semibold
- Subheader: "When should the AI hand off to a human?" #94A3B8
- Card container

Handoff Rule Items (5):
Each rule structure:
- Checkbox
- Rule title
- Configuration input (when relevant)
- Helper text

Rule 1:
- ☑️ Confidence Score Below Threshold
- Input: "Threshold: [0.7] (0.0-1.0)"
- Helper: "When AI is less than 70% confident"

Rule 2:
- ☑️ Customer Explicitly Requests Human
- Helper: "Trigger phrases: 'speak to human', 'real person'..."
- Link: "[Edit Phrases]"

Rule 3:
- ☑️ Conversation Exceeds Turn Limit
- Input: "Max turns without resolution: [5]"

Rule 4:
- ☑️ Sentiment Drops Below Threshold
- Input: "Negative sentiment score: [-0.5]"

Rule 5:
- ☐ Specific Intent Detected
- Dropdown: "[Select intents...]"
- Disabled appearance when unchecked

Input styling:
- Small inputs: 60-80px width
- Inline with text
- Background: #0F172A
- Border: 1px solid #334155

HANDOFF BEHAVIOR SECTION:
- Label: "Handoff Behavior" 16px Semibold
- Card container
- Margin-top: 24px

Handoff Message:
- Label: "Handoff Message:"
- Textarea:
  - Content: "I'm connecting you with a human agent. Please hold for a moment - average wait time is 2 min."
  - Height: 60px

After Handoff (Radio Group):
- Label: "After Handoff:"
- Options:

1. ● AI stays silent until agent closes conversation
2. ○ AI provides suggested responses to agent
3. ○ AI continues if agent doesn't respond in [5] min
   - Inline input for minutes

Agent Assignment:
- Label: "Agent Assignment:"
- Dropdown: "[▼ Round Robin (default)]"
- Options below (as reference):
  - ○ Round Robin
  - ○ Least Busy
  - ○ Specific Team

FOOTER ACTIONS:
- "[← Back]" ghost button
- "[Next: Review →]" primary button

DESIGN TOKENS:
- Background: #1E293B
- Input bg: #0F172A
- Border: #334155
- Primary: #4F46E5
- Checked: #4F46E5

STATES:
- Rule unchecked: inputs disabled/grayed
- Edit phrases: opens modal
- Validation: threshold ranges
```

---

## Screen 2.6.4: Chatwoot Widget Embed & Deploy

### Stitch Prompt

```
Create step 4 of Chatwoot deployment wizard showing deployment summary, embed code, webhook URL, and final deploy action.

LAYOUT:
- Same modal structure
- Width: 640px
- Background: #1E293B

HEADER:
- Title: "Deploy to Chatwoot"
- Step indicator: "Step 4 of 4"
- Progress bar: 100% filled (complete)

MAIN CONTENT:
- Padding: 24px

SUCCESS INDICATOR:
- "✅ Deployment Ready" 18px Semibold
- Green checkmark icon
- Margin-bottom: 16px

DEPLOYMENT SUMMARY CARD:
- Background: #0F172A
- Border: 1px solid #334155
- Border-radius: 8px
- Padding: 16px

Summary Content:
- "Summary:" label
- Bulleted list:
  - • Instance: Production (chat.mycompany.com)
  - • Inboxes: WhatsApp Business, Email Support
  - • Response Mode: Auto-respond
  - • Handoff: Confidence < 0.7, explicit request

WIDGET EMBED CODE SECTION:
- Label: "Widget Embed Code (for website inbox)" 14px Semibold
- Code block:

Code Block Styling:
- Background: #0F172A
- Border: 1px solid #334155
- Border-radius: 8px
- Padding: 16px
- Font: JetBrains Mono, 12px
- Syntax highlighting

Copy Button:
- "[📋]" icon button top-right of code block
- Tooltip: "Copy to clipboard"

Code Content:
```html
<script>
  window.chatwootSettings = {
    hideMessageComposer: false,
    position: 'right',
    locale: 'en',
    darkMode: 'auto',
    agentBotId: 'ag_abc123xyz'
  };
</script>
<script src="https://chat.mycompany.com/packs/js/
  sdk.js" defer></script>
```

WEBHOOK URL SECTION:
- Label: "Webhook URL (for API integrations)" 14px Semibold
- URL display:
  - Background: #0F172A
  - Padding: 12px
  - Border-radius: 8px
  - Font: monospace

URL Content:
- "https://api.hyyve.ai/v1/chatwoot/webhook/abc123"
- "[📋]" copy button
- Helper text: "Configure this URL in Chatwoot → Settings → Webhooks"
- "Events: message_created, conversation_status_changed"

CONFIDENCE DISPLAY SETTINGS:
- Label: "Confidence Display Settings (FR163)" 14px Semibold
- Card container

Settings:
1. ☑️ Show confidence indicator to human agents
   - Dropdown: "Display: [▼ Badge next to message]"
   - Helper: "• Badge: '🟢 95%' next to each AI response"
   - Helper: "• Tooltip: Detailed confidence breakdown on hover"

2. ☐ Show confidence to end customers
   - Unchecked by default

FOOTER ACTIONS:
- "[← Back]" ghost button
- "[Save as Draft]" outline button
- "[🚀 Deploy]" primary button with rocket icon

Primary button emphasized (larger, prominent)

DESIGN TOKENS:
- Background: #1E293B
- Code bg: #0F172A
- Border: #334155
- Primary: #4F46E5
- Success: #10B981
- Code syntax: various colors

STATES:
- Copy success: button shows checkmark briefly
- Deploy loading: button shows spinner
- Deploy success: redirect to dashboard
- Draft saved: confirmation toast

ANIMATIONS:
- Deploy: rocket animation or confetti
- Success transition: fade to success state
```

---

## Screen 2.7.1: Environment Manager

### Stitch Prompt

```
Create an environment manager showing production, staging, and development environments with deployment flow visualization.

LAYOUT:
- Full page dashboard
- Max-width: 1100px centered
- Background: #0F172A
- Padding: 24px

HEADER:
- Title: "Environments" 20px Semibold
- Action: "[+ New Environment]" primary button
- Right-aligned

ENVIRONMENT CARDS ROW:
- 3 cards in row
- Equal width
- Gap: 20px

Environment Card Structure:
- Background: #1E293B
- Border-radius: 12px
- Padding: 20px
- Height: ~200px

Card 1 - Production:
- Status badge: "🟢 Production" (green dot + text)
- Divider line
- "Version: v2.4.1"
- "Status: Healthy" (green text)
- "Traffic: 100%"
- Spacer
- "Last Deploy:"
- "3 days ago"
- Actions: "[View]" "[Config]" text buttons

Card 2 - Staging:
- Status badge: "🟡 Staging" (amber dot)
- "Version: v2.5.0"
- "Status: Testing" (amber text)
- "Traffic: 10%"
- "Last Deploy: 2 hours ago"
- Actions: "[View]" "[Promote]"

Card 3 - Development:
- Status badge: "🔵 Development" (blue dot)
- "Version: v2.5.1"
- "Status: Active" (blue text)
- "Traffic: 0%"
- "Last Deploy: 15 min ago"
- Actions: "[View]" "[Test]"

Status Colors:
- Production: #10B981 (green)
- Staging: #F59E0B (amber)
- Development: #3B82F6 (blue)

DEPLOYMENT FLOW SECTION:
- Card background: #1E293B
- Border-radius: 12px
- Padding: 24px
- Margin-top: 24px

Flow Diagram:
- Horizontal arrow flow
- "Development ──► Staging ──► Production"
- Labels below: "[Dev]    [QA]    [Live]"

Promotion Rules:
- "Promotion Rules:" label
- Bulleted list:
  - • Dev → Staging: Manual or auto on commit
  - • Staging → Prod: Requires approval + passing tests

Arrow styling:
- Color: #475569
- Arrow heads pointing right
- Dashed or solid lines

RECENT DEPLOYMENTS SECTION:
- Card background: #1E293B
- Border-radius: 12px
- Padding: 24px
- Margin-top: 24px

Table Structure:
- Columns: Time | Version | Env | Status | By
- Header row: #64748B text

Deployment Rows (3):
1. 15m ago | v2.5.1 | Dev | ✓ Done | Sarah
2. 2h ago | v2.5.0 | Staging | ✓ Done | CI/CD
3. 3d ago | v2.4.1 | Prod | ✓ Done | Mike (appr)

Status indicators:
- ✓ Done: green check
- In Progress: spinner
- Failed: red X

DESIGN TOKENS:
- Background: #0F172A
- Card: #1E293B
- Production: #10B981
- Staging: #F59E0B
- Development: #3B82F6
- Border: #334155

STATES:
- Card hover: subtle border highlight
- Promote: opens confirmation modal
- New environment: opens config form
```

---

## Screen 2.7.2: Version Rollout Manager

### Stitch Prompt

```
Create a version promotion modal with pre-flight checks, rollout strategy options, and approval workflow.

LAYOUT:
- Centered modal
- Width: 600px
- Background: #1E293B
- Border radius: 16px

HEADER:
- Title: "Promote to Production" 18px Semibold
- Close button: [×]
- Padding: 20px 24px
- Border-bottom: 1px solid #334155

MAIN CONTENT:
- Padding: 24px

VERSION INFO:
- "Promoting: v2.5.0 → Production"
- Arrow icon between version numbers
- Margin-bottom: 20px

PRE-FLIGHT CHECKS SECTION:
- Label: "Pre-flight Checks" 14px Semibold
- Card container

Check Items (5):
- Each item: icon + text
- ✅ All tests passing (156/156)
- ✅ Staging validation complete (24h soak)
- ✅ No breaking API changes detected
- ✅ Performance within baseline (+/- 10%)
- ⚠️ 2 new dependencies added (review recommended)

Icon styling:
- ✅ Green checkmark
- ⚠️ Amber warning
- ❌ Red X (if failing)

Warning item: amber text color

ROLLOUT STRATEGY SECTION:
- Label: "Rollout Strategy" 14px Semibold
- Card container
- Radio group

Strategy Options (3):

1. ○ Immediate (100% traffic switch)
   - Warning: "⚠️ Higher risk, faster deployment"
   - Warning in amber

2. ● Canary Release (Recommended)
   - Badge: "(Recommended)" primary color
   - Helper: "Gradual traffic increase with monitoring"

   Canary Steps Visualization:
   - Horizontal step indicator
   - [Step 1: 10% | Step 2: 25% | Step 3: 50% | 100%]
   - [  5 min    |   15 min    |   30 min    | Done]
   - Background: #0F172A
   - Border radius: 8px
   - Padding: 12px

   Auto-rollback Input:
   - "Auto-rollback if error rate > [1%]"
   - Inline input

3. ○ Blue-Green
   - Helper: "Full parallel deployment with instant switch"

APPROVAL REQUIRED SECTION:
- Label: "Approval Required" 14px Semibold
- Card container

Approval Items:
- ☑️ @tech-lead (Mike) - Pending
- ☐ @product-owner (Lisa) - Not requested

Checkbox with mention styling (@name)
Status badges: "Pending", "Approved", "Not requested"

Request Button:
- "[Request Approval]" outline button

FOOTER ACTIONS:
- Border-top: 1px solid #334155
- Padding: 16px 24px
- "[Cancel]" ghost button
- "[Schedule]" outline button (schedule for later)
- "[Deploy]" primary button

Deploy disabled until approvals complete

DESIGN TOKENS:
- Background: #1E293B
- Card: #0F172A
- Primary: #4F46E5
- Success: #10B981
- Warning: #F59E0B
- Border: #334155

STATES:
- All checks pass: Deploy enabled
- Checks failing: Deploy disabled, warning shown
- Waiting approval: Deploy shows "Awaiting Approval"
- Scheduled: shows date/time picker
```

---

## Screen 2.7.3: Deployment Health Dashboard

### Stitch Prompt

```
Create a real-time deployment health dashboard showing rollout progress, metrics, traffic split, and deployment logs.

LAYOUT:
- Full page or large modal
- Max-width: 900px
- Background: #0F172A
- Padding: 24px

HEADER:
- Title: "Deployment Health: v2.5.0 → Production"
- Action: "[⟳ Refresh]" icon button (or auto-refresh indicator)
- Padding: 16px 24px

ROLLOUT PROGRESS SECTION:
- Card background: #1E293B
- Border-radius: 12px
- Padding: 20px

Header Row:
- "Rollout Progress"
- Actions: "[Pause]" "[Stop]" buttons (outline, right-aligned)

Progress Bar:
- Full width
- Height: 12px
- Background: #334155
- Fill: #4F46E5 at 50%
- Border-radius: 6px
- "50% Complete" label right of bar

Progress Details:
- "Current Phase: Step 3 (50% traffic)"
- "Time in phase: 12:34 / 30:00"
- "Next phase: 100% in 17:26"

Timer: countdown format, updates in real-time

REAL-TIME METRICS SECTION:
- 3 metric cards in row
- Gap: 16px
- Margin-top: 24px

Metric Card Structure:
- Background: #1E293B
- Border-radius: 12px
- Padding: 20px
- Height: 120px

Metric Card 1 - Error Rate:
- Label: "Error Rate"
- Value: "0.3%" (large, 24px)
- Status: "✅ < 1%" (green text)
- Sparkline: mini chart showing trend
- Trend: "↑ Trend" (direction indicator)

Metric Card 2 - Latency P95:
- Label: "Latency P95"
- Value: "234ms"
- Status: "✅ < 500ms"
- Trend: "↓ Improving"

Metric Card 3 - Throughput:
- Label: "Throughput"
- Value: "1.2K/min"
- Status: "✅ Normal"
- Trend: "→ Stable"

Sparkline styling:
- Width: 80px
- Height: 24px
- Line color: #4F46E5

TRAFFIC SPLIT SECTION:
- Card background: #1E293B
- Border-radius: 12px
- Padding: 20px
- Margin-top: 24px

Traffic Bars:
- Two horizontal bars
- "v2.4.1 (current): ██████████░░░░░░░░░░ 50%"
- "v2.5.0 (new):     ██████████░░░░░░░░░░ 50%"

Bar styling:
- Current version: #64748B (gray)
- New version: #4F46E5 (primary)
- Height: 8px per bar
- Label includes percentage

DEPLOYMENT LOG SECTION:
- Card background: #1E293B
- Border-radius: 12px
- Padding: 20px
- Margin-top: 24px
- Max-height: 200px, scrollable

Log Entries:
- Timestamp + message format
- Newest first or streaming

Log Items:
- 14:23:45 Canary step 3 started (50% traffic)
- 14:23:44 Health checks passed: 10/10 instances
- 14:08:45 Canary step 2 completed successfully
- 14:08:44 Error rate stable at 0.2% (threshold: 1%)
- 13:53:45 Canary step 2 started (25% traffic)

Timestamp: #64748B
Message: #F8FAFC

FOOTER ACTIONS:
- Full width
- Right-aligned
- "[Rollback Now]" destructive outline button
- "[Skip to 100%]" primary button

Rollback: red text/border

DESIGN TOKENS:
- Background: #0F172A
- Card: #1E293B
- Primary: #4F46E5
- Success: #10B981
- Warning: #F59E0B
- Danger: #EF4444

STATES:
- Paused: progress bar pulsing
- Error threshold exceeded: auto-rollback warning
- Complete: success state, buttons change
- Rollback: confirmation required

ANIMATIONS:
- Progress bar: smooth fill
- Metrics: real-time updates with subtle flash
- Log: new entries slide in
- Auto-refresh: subtle indicator
```

---

## Screen 2.7.4: Environment Configuration

### Stitch Prompt

```
Create an environment configuration page with general settings, environment variables, scaling configuration, and deployment rules.

LAYOUT:
- Full page settings view
- Max-width: 800px centered
- Background: #0F172A
- Padding: 24px

HEADER:
- Title: "Environment: Production" 20px Semibold
- Action: "[Save]" primary button
- Border-bottom: 1px solid #334155

GENERAL SETTINGS SECTION:
- Card background: #1E293B
- Section header: "General Settings" 16px Semibold
- Padding: 24px
- Border-radius: 12px

General Fields:
1. Name Input:
   - Label: "Name:"
   - Input: "Production"

2. URL Input:
   - Label: "URL:"
   - Input: "https://api.mycompany.com"

3. Region Dropdown:
   - Label: "Region:"
   - Dropdown: "US East (us-east-1)"

ENVIRONMENT VARIABLES SECTION:
- Card background: #1E293B
- Section header: "Environment Variables" with "[+ Add Variable]" button
- Padding: 24px
- Margin-top: 24px

Variables Table:
- Columns: Key | Value | Secret | Actions
- Header row styling

Variable Rows (5):
1. OPENAI_API_KEY | ************ | 🔒 Yes | [Edit][Delete]
2. DATABASE_URL | ************ | 🔒 Yes | [Edit][Delete]
3. LOG_LEVEL | info | No | [Edit][Delete]
4. FEATURE_NEW_UI | true | No | [Edit][Delete]
5. RATE_LIMIT_PER_MIN | 100 | No | [Edit][Delete]

Secret indicator: 🔒 padlock icon
Masked values: asterisks for secrets
Actions: icon buttons on hover

SCALING CONFIGURATION SECTION:
- Card background: #1E293B
- Section header: "Scaling Configuration"
- Padding: 24px
- Margin-top: 24px

Scaling Inputs:
- Row layout: "Instances: Min [2] | Max [10] | Target CPU: [70%]"
- Small number inputs
- Label | input | label | input format

Current Status:
- "Current: 4 instances running"
- Green indicator dot

Auto-scale Toggle:
- "☑️ Auto-scale based on traffic"

DEPLOYMENT RULES SECTION:
- Card background: #1E293B
- Section header: "Deployment Rules"
- Padding: 24px
- Margin-top: 24px

Rule Checkboxes:
1. ☑️ Require approval for deployments
   - Nested: "Approvers: [@tech-lead, @product-owner]"
   - Tag/chip styling for approvers

2. ☑️ Require all tests passing

3. ☑️ Require staging soak period: [24] hours
   - Inline input

4. ☐ Allow hotfixes without approval

FOOTER ACTIONS:
- Full width
- Right-aligned
- "[Cancel]" ghost button
- "[Save Changes]" primary button
- Padding: 16px 24px

DESIGN TOKENS:
- Background: #0F172A
- Card: #1E293B
- Input bg: #0F172A
- Border: #334155
- Primary: #4F46E5
- Secret: #F59E0B

STATES:
- Unsaved changes: indicator on Save
- Add variable: inline form or modal
- Edit variable: expands to edit mode
- Delete: confirmation required
- Secret toggle: show/hide value

ANIMATIONS:
- Add variable: slide in new row
- Delete: fade out
- Save: success indicator
```

---

## Design System Reference (Group 7)

### Deployment & DevOps Components

```
STATUS INDICATORS:
- Production: #10B981 (green)
- Staging: #F59E0B (amber)
- Development: #3B82F6 (blue)
- Healthy: green dot
- Warning: amber dot
- Error: red dot

PROGRESS BARS:
- Track: #334155
- Fill: #4F46E5
- Height: 4px (header), 8px (content), 12px (prominent)
- Border radius: rounded

METRIC CARDS:
- Background: #1E293B
- Value: 24px Semibold
- Label: 12px #64748B
- Status badge: colored text
- Sparklines: 80px × 24px

DEPLOYMENT FLOW:
- Arrow color: #475569
- Node backgrounds: environment colors
- Connection style: bezier curves

LOG ENTRIES:
- Timestamp: #64748B, monospace
- Message: #F8FAFC
- Separator: 1px solid #334155

APPROVAL BADGES:
- Pending: #F59E0B background
- Approved: #10B981 background
- Rejected: #EF4444 background
- Not requested: #64748B text

WIZARD PROGRESS:
- Track: #334155
- Fill: #4F46E5
- Steps: circles with numbers
- Current: filled primary
- Completed: green check
- Pending: hollow
```

---

## Group 7 Cross-References

| Screen | PRD Reference | Architecture Reference | Components |
|--------|--------------|----------------------|------------|
| 2.4.1 HITL Queue | FR201-FR215 | HITL Service | QueueCard, PriorityBadge, AssignButton |
| 2.4.2 Review Interface | FR201-FR215 | HITL Service | SplitView, AIRecommendation, DecisionRadio |
| 2.6.1 Chatwoot Wizard | FR156-FR165 | Integration Service | InstanceSelector, WizardProgress |
| 2.6.2 Inbox Selection | FR156-FR165 | Integration Service | InboxCheckbox, ResponseModeRadio |
| 2.6.3 Handoff Config | FR160-FR162 | Integration Service | RuleCheckbox, ThresholdInput |
| 2.6.4 Widget Embed | FR163 | Integration Service | CodeBlock, WebhookDisplay, ConfidenceSettings |
| 2.7.1 Environment Manager | FR166-FR175 | Deployment Service | EnvCard, FlowDiagram, DeploymentTable |
| 2.7.2 Version Rollout | FR166-FR175 | Deployment Service | PreflightChecks, StrategySelector, ApprovalList |
| 2.7.3 Deployment Health | FR166-FR175 | Deployment Service | RolloutProgress, MetricCard, TrafficSplit |
| 2.7.4 Environment Config | FR166-FR175 | Deployment Service | EnvVarsTable, ScalingInputs, RuleToggles |

---

## AG-UI/A2UI Integration Points (Group 7)

| Screen | Zone | Integration Type | Notes |
|--------|------|-----------------|-------|
| 2.4.2 Review Interface | AI Recommendation | AG-UI Dynamic | Real-time confidence updates |
| 2.7.3 Deployment Health | Metrics & Logs | AG-UI Streaming | Live metric updates, log streaming |
