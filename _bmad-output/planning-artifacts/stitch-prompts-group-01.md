# Google Stitch Prompts - Group 1 (Screens 1-10)

**Project:** Hyyve Platform
**Design System:** shadcn/ui + Tailwind CSS
**Theme:** Dark mode primary, light mode secondary
**Target:** React + TypeScript export

---

## Design System Foundation (Apply to ALL Screens)

```
GLOBAL DESIGN TOKENS:
- Primary: #4F46E5 (indigo-600)
- Primary Hover: #4338CA (indigo-700)
- Success: #10B981 (emerald-500)
- Warning: #F59E0B (amber-500)
- Error: #EF4444 (red-500)
- Surface: #FFFFFF (white)
- Background: #F9FAFB (gray-50)
- Border: #E5E7EB (gray-200)
- Text Primary: #111827 (gray-900)
- Text Secondary: #6B7280 (gray-500)

DARK THEME TOKENS:
- Background: #0F172A (slate-900)
- Surface: #1E293B (slate-800)
- Surface Elevated: #334155 (slate-700)
- Border: #475569 (slate-600)
- Text Primary: #F8FAFC (slate-50)
- Text Secondary: #94A3B8 (slate-400)

TYPOGRAPHY:
- Font Family: Inter (UI), JetBrains Mono (code)
- H1: 32px/40px Bold
- H2: 24px/32px Semibold
- H3: 18px/28px Semibold
- Body: 14px/20px Regular
- Caption: 12px/16px Regular

SPACING (8px base):
- space-1: 4px
- space-2: 8px
- space-3: 12px
- space-4: 16px
- space-6: 24px
- space-8: 32px

BORDER RADIUS:
- sm: 4px (tags, small inputs)
- md: 6px (buttons, inputs)
- lg: 8px (cards, modals)
- xl: 12px (feature cards)
- full: 9999px (avatars, pills)

SHADOWS:
- sm: 0 1px 2px rgba(0,0,0,0.05)
- md: 0 4px 6px rgba(0,0,0,0.1)
- lg: 0 10px 15px rgba(0,0,0,0.1)
- xl: 0 20px 25px rgba(0,0,0,0.15)
```

---

## Screen 1.1.1: Login Page

### Stitch Prompt

```
Create a login page for an AI development platform called "Hyyve".

LAYOUT:
- Full viewport height (100vh)
- Centered card layout
- Dark background (#0F172A slate-900) with subtle gradient overlay
- Optional: animated gradient background with slow-moving purple/blue hues

HEADER SECTION:
- Logo: Text "Hyyve" with a small AI/robot icon (24x24px) to the left
- Logo font: Inter Bold 24px, color #F8FAFC
- Positioned 80px from top of card
- Tagline below logo: "Build intelligent AI agents" in 14px Inter Regular, #94A3B8

LOGIN CARD:
- Width: 400px
- Background: #1E293B (slate-800)
- Border: 1px solid #334155 (slate-700)
- Border radius: 12px (radius-xl)
- Padding: 32px (space-8)
- Shadow: lg shadow with slight purple tint

FORM FIELDS:
1. Email Input:
   - Label: "Email address" in 14px Inter Medium, #F8FAFC
   - Input field: height 44px, background #0F172A, border 1px #475569
   - Placeholder: "you@company.com" in #64748B
   - Border radius: 6px (radius-md)
   - Focus state: border #4F46E5 with ring-2 ring-indigo-500/20
   - Icon: envelope icon (16px) inside left padding

2. Password Input:
   - Label: "Password" in 14px Inter Medium, #F8FAFC
   - Input field: same styling as email
   - Placeholder: "Enter your password"
   - Eye icon button on right for show/hide toggle (20px, #94A3B8)
   - Icon: lock icon (16px) inside left padding

3. Remember Me + Forgot Password Row:
   - Checkbox with label "Remember me" (14px, #94A3B8)
   - "Forgot password?" link aligned right, #4F46E5 with hover underline

4. Sign In Button:
   - Full width
   - Height: 44px
   - Background: #4F46E5 (primary)
   - Hover: #4338CA
   - Text: "Sign In" 14px Inter Semibold, white
   - Border radius: 6px
   - Transition: all 150ms ease

DIVIDER:
- Horizontal line with "or" text centered
- Line: 1px #334155
- "or" text: 12px Inter Regular, #64748B, background #1E293B padding 0 12px

SOCIAL LOGIN BUTTONS:
1. Google Button:
   - Full width, height 44px
   - Background: transparent
   - Border: 1px solid #475569
   - Border radius: 6px
   - Google "G" icon (20px) + text "Continue with Google" 14px Inter Medium
   - Hover: background #334155

2. SSO Button:
   - Same styling as Google button
   - Lock/shield icon + text "Continue with SSO"
   - Only visible if organization has SSO configured (add data attribute for conditional)

FOOTER LINKS:
- Below card, centered
- "Don't have an account? Sign up"
- "Sign up" is link in #4F46E5
- 14px Inter Regular, #94A3B8

STATES TO INCLUDE:
- Default state (empty form)
- Focus state (field focused with ring)
- Error state (invalid email, wrong password with red border and error message)
- Loading state (button shows spinner, disabled)
- Success state (brief green checkmark before redirect)

ACCESSIBILITY:
- All inputs have associated labels
- Focus visible indicators
- Error messages linked with aria-describedby
- Skip to main content link (hidden until focused)
- Color contrast minimum 4.5:1

ANIMATIONS:
- Card entrance: fade-in + slide-up 300ms ease-out
- Button press: scale(0.98) on active
- Input focus: ring animation 150ms
- Error shake: horizontal shake 300ms on invalid submit

RESPONSIVE:
- Mobile (<640px): Card width 100%, padding 24px, margins 16px
- Tablet (640-1024px): Card width 400px centered
- Desktop (>1024px): Card width 400px, can add illustration on side
```

---

## Screen 1.1.2: Registration Flow - Step 1 (Account)

### Stitch Prompt

```
Create registration step 1 of 3 for creating an account on "Hyyve" platform.

LAYOUT:
- Same background as login (#0F172A with gradient)
- Centered card, wider than login: 480px
- Progress indicator at top

PROGRESS INDICATOR:
- Horizontal stepper with 3 steps
- Step 1: "Account" - ACTIVE (filled circle #4F46E5, bold text)
- Step 2: "Organization" - UPCOMING (empty circle #475569, muted text)
- Step 3: "Personalize" - UPCOMING (empty circle #475569, muted text)
- Connecting lines between circles: active #4F46E5, inactive #475569
- Circle size: 32px diameter with step number inside
- Text below each circle: 12px Inter Medium

CARD:
- Same styling as login card but width 480px
- Title: "Create your account" H2 style (24px Inter Semibold, #F8FAFC)
- Subtitle: "Start building AI agents in minutes" 14px #94A3B8

FORM FIELDS:
1. Full Name:
   - Label: "Full name"
   - Input height 44px
   - Placeholder: "John Smith"
   - Icon: user icon left

2. Work Email:
   - Label: "Work email"
   - Input height 44px
   - Placeholder: "you@company.com"
   - Icon: envelope icon left
   - Validation: real-time email format check
   - Error state: "Please enter a valid email address" in #EF4444

3. Password:
   - Label: "Password"
   - Input height 44px
   - Show/hide toggle icon right
   - Icon: lock icon left

4. Password Strength Indicator:
   - Horizontal bar below password field
   - 4 segments showing strength
   - Colors: red (weak) → orange → yellow → green (strong)
   - Text label: "Weak" / "Fair" / "Good" / "Strong" 12px
   - Requirements checklist below:
     - "At least 8 characters" with check/x icon
     - "One uppercase letter" with check/x icon
     - "One number" with check/x icon
     - "One special character" with check/x icon

5. Terms Checkbox:
   - Small checkbox with label:
   - "I agree to the Terms of Service and Privacy Policy"
   - Links in #4F46E5

BUTTONS:
- "Continue" button: primary style, full width, height 44px
- Below: "Already have an account? Sign in" link

STATES:
- Field validation on blur
- Real-time password strength
- Button disabled until all valid
- Loading state on submit

ANIMATIONS:
- Fields validate with subtle green checkmark appear
- Password strength bar fills smoothly
- Continue button enables with fade-in

ACCESSIBILITY:
- aria-live for password strength announcements
- Error messages associated with inputs
- Keyboard navigation through all fields
```

---

## Screen 1.1.3: Registration Flow - Step 2 (Organization)

### Stitch Prompt

```
Create registration step 2 of 3 for organization setup on "Hyyve" platform.

PROGRESS INDICATOR:
- Step 1: "Account" - COMPLETED (checkmark in circle, green #10B981)
- Step 2: "Organization" - ACTIVE (filled circle #4F46E5)
- Step 3: "Personalize" - UPCOMING (empty circle)
- Connecting line 1→2: green filled
- Connecting line 2→3: gray inactive

CARD CONTENT:
- Title: "Set up your organization" H2
- Subtitle: "Tell us about your team" 14px #94A3B8

FORM FIELDS:
1. Organization Name:
   - Label: "Organization name"
   - Input height 44px
   - Placeholder: "Acme Corp"
   - Icon: building icon left
   - Helper text: "This will be your workspace name" 12px #64748B

2. Organization Type (Dropdown):
   - Label: "Organization type"
   - Select dropdown, height 44px
   - Placeholder: "Select type..."
   - Options:
     - Startup
     - Small/Medium Business
     - Enterprise
     - Agency
     - Individual/Freelancer
   - Chevron-down icon right

3. Team Size (Radio Button Group):
   - Label: "How big is your team?"
   - Horizontal radio group with card-style options
   - Options as selectable cards (80px x 60px each):
     - "Just me" with single person icon
     - "2-10" with small team icon
     - "11-50" with medium team icon
     - "50+" with large team icon
   - Selected state: border #4F46E5, background #4F46E5/10

4. Primary Use Case (Optional multi-select):
   - Label: "What will you build? (optional)"
   - Checkbox group:
     - "Customer support bots"
     - "Internal automation"
     - "Data processing pipelines"
     - "Voice agents"
     - "Other"

BUTTONS:
- Row with two buttons:
  - "Back" button: ghost style, left aligned
  - "Continue" button: primary style, right aligned
- Both height 44px

SKIP OPTION:
- "Skip for now" link below buttons, centered, 14px #64748B

VALIDATION:
- Organization name required (minimum 2 characters)
- Organization type required
- Team size required
- Use cases optional
```

---

## Screen 1.1.4: Registration Flow - Step 3 (Personalize)

### Stitch Prompt

```
Create registration step 3 of 3 for personalization/onboarding quiz on "Hyyve" platform.

PROGRESS INDICATOR:
- Step 1: "Account" - COMPLETED (green checkmark)
- Step 2: "Organization" - COMPLETED (green checkmark)
- Step 3: "Personalize" - ACTIVE (filled #4F46E5)
- All connecting lines: green filled

CARD CONTENT:
- Title: "What do you want to build first?" H2
- Subtitle: "We'll customize your experience" 14px #94A3B8
- Card width: 640px (wider to accommodate grid)

BUILDER SELECTION GRID:
- 2x2 grid of large selectable cards
- Each card: 280px x 180px
- Gap: 16px between cards
- Single select (radio behavior)

Card 1 - Module Builder:
- Icon: workflow/nodes icon (48px, #4F46E5)
- Title: "Module Builder" 18px Inter Semibold
- Description: "Create AI workflows & automations" 14px #94A3B8
- Tag: "Most Popular" pill badge top-right, #10B981 background

Card 2 - Chatbot Builder:
- Icon: chat bubble icon (48px, #4F46E5)
- Title: "Chatbot Builder" 18px Inter Semibold
- Description: "Build customer support bots" 14px #94A3B8

Card 3 - Voice Agent:
- Icon: microphone icon (48px, #4F46E5)
- Title: "Voice Agent" 18px Inter Semibold
- Description: "Create phone/IVR systems" 14px #94A3B8

Card 4 - Canvas Builder:
- Icon: paintbrush/design icon (48px, #4F46E5)
- Title: "Canvas Builder" 18px Inter Semibold
- Description: "AI-generated user interfaces" 14px #94A3B8
- Tag: "New" pill badge top-right, #8B5CF6 background

CARD STATES:
- Default: border #334155, background #1E293B
- Hover: border #475569, background #334155
- Selected: border #4F46E5, background #4F46E5/10, shadow-md with purple tint
- Selected also shows checkmark in top-left corner

GUIDED TOUR OPTION:
- Below grid, checkbox with label
- "I want a guided tour of the platform"
- Checked by default
- 14px Inter Regular, #F8FAFC

BUTTONS:
- Single "Get Started" button, primary style, full width
- Height 48px (slightly larger for final step emphasis)
- Icon: arrow-right after text

CELEBRATION ELEMENT:
- On submit, brief confetti animation
- Then redirect to selected builder
```

---

## Screen 1.1.5: MFA Setup - Method Selection

### Stitch Prompt

```
Create MFA setup screen for selecting authentication method on "Hyyve" platform.

LAYOUT:
- Not a centered card - this is a settings-style page
- Full page with navigation header
- Content area max-width 600px centered

HEADER:
- Back arrow button (left) - navigates to previous page
- Title: "Secure Your Account" H2 centered
- "Skip" text link (right) #64748B

MAIN CONTENT:
- Lock/shield icon at top: 64px, #4F46E5
- Heading: "Enable Two-Factor Authentication" H3
- Description: "Add an extra layer of security to your account" 14px #94A3B8
- Margin-top: 32px

MFA METHOD OPTIONS:
- Vertical stack of 3 selectable cards
- Gap: 12px between cards
- Each card full width of content area

Card 1 - Authenticator App (Recommended):
- Height: 80px
- Left: radio button (24px)
- Icon: smartphone icon (40px, #4F46E5)
- Title: "Authenticator App" 16px Inter Semibold
- Subtitle: "Use Google Authenticator, Authy, or 1Password" 14px #94A3B8
- Badge: "Recommended" pill, #10B981 background, right side
- Default selected state

Card 2 - SMS Verification:
- Same structure
- Icon: message/SMS icon (40px, #F59E0B)
- Title: "SMS Verification"
- Subtitle: "Receive codes via text message"
- No badge

Card 3 - Email Verification:
- Same structure
- Icon: envelope icon (40px, #64748B)
- Title: "Email Verification"
- Subtitle: "Receive codes via email"
- No badge

CARD STATES:
- Default: border #334155, background #1E293B
- Hover: border #475569
- Selected: border #4F46E5, background #4F46E5/10

SECURITY INFO BOX:
- Below cards, info/tip box
- Background: #1E293B with left border 3px #4F46E5
- Icon: info circle
- Text: "Two-factor authentication helps protect your account even if your password is compromised."
- 14px #94A3B8

BUTTON:
- "Continue Setup" primary button
- Full width, height 48px
- Margin-top: 32px

FOOTER TEXT:
- "You can change this later in Settings → Security"
- 12px #64748B, centered
```

---

## Screen 1.1.6: MFA Setup - Authenticator App

### Stitch Prompt

```
Create MFA authenticator app setup screen for "Hyyve" platform.

HEADER:
- Back arrow (left)
- Title: "Authenticator App Setup" H2 centered
- Help icon button (right) - opens help modal

MAIN CONTENT:
- Two-step process with clear visual separation
- Max-width 500px centered

STEP 1 SECTION:
- Step indicator: Circle with "1" inside, #4F46E5 background
- Label: "Scan QR Code" 16px Inter Semibold
- Instruction: "Open your authenticator app and scan this QR code" 14px #94A3B8

QR CODE AREA:
- White background container: 200px x 200px
- Border radius: 12px
- Centered QR code: 180px x 180px
- Shadow: md
- Margin: 24px auto

MANUAL ENTRY FALLBACK:
- Text: "Can't scan? Enter this code manually:" 14px #94A3B8
- Code display box:
  - Background: #0F172A
  - Border: 1px dashed #475569
  - Border radius: 8px
  - Padding: 16px
  - Code: "JBSW Y3DP EHPK 3PXP" in JetBrains Mono 16px, #F8FAFC
  - Letter spacing: 2px
  - Copy button: icon button right side, clipboard icon
  - On copy: tooltip "Copied!" with checkmark

DIVIDER:
- Horizontal line, margin 32px 0

STEP 2 SECTION:
- Step indicator: Circle with "2" inside, #4F46E5 background
- Label: "Enter Verification Code" 16px Inter Semibold
- Instruction: "Enter the 6-digit code from your authenticator app" 14px #94A3B8

OTP INPUT:
- 6 individual digit boxes in a row
- Each box: 48px x 56px
- Gap: 8px between boxes (12px gap after 3rd box for visual grouping)
- Background: #0F172A
- Border: 2px solid #475569
- Border radius: 8px
- Font: JetBrains Mono 24px Bold, #F8FAFC
- Center aligned text
- Focus state: border #4F46E5, ring
- Auto-advance on digit entry
- Backspace returns to previous box

OTP STATES:
- Empty: dashed border
- Focused: solid border #4F46E5
- Filled: solid border #475569
- Error (wrong code): all boxes border #EF4444, shake animation
- Success: all boxes border #10B981 briefly

ERROR MESSAGE:
- Below OTP boxes
- "Invalid code. Please try again." #EF4444
- Only visible on error

BUTTON:
- "Verify & Enable" primary button
- Full width, height 48px
- Disabled until all 6 digits entered
- Loading state: spinner replacing text

TIMER/RESEND:
- "Code expires in 0:30" countdown timer
- When expired: "Code expired. Generate new QR code" link
```

---

## Screen 1.1.7: MFA Setup - Backup Codes

### Stitch Prompt

```
Create MFA backup codes screen for "Hyyve" platform.

HEADER:
- Back arrow (left)
- Title: "Backup Recovery Codes" H2 centered
- "Done" button (right) - primary text button

SUCCESS BANNER:
- Full width of content area
- Background: #10B981/10
- Border: 1px solid #10B981
- Border radius: 8px
- Icon: checkmark circle (24px, #10B981) left
- Text: "Two-Factor Authentication Enabled!" 16px Inter Semibold, #10B981
- Padding: 16px

WARNING SECTION:
- Margin-top: 24px
- Icon: warning triangle (24px, #F59E0B)
- Text: "Save these backup codes in a safe place" 16px Inter Semibold, #F8FAFC
- Subtext: "Each code can only be used once. If you lose access to your authenticator, use these codes to sign in." 14px #94A3B8

BACKUP CODES GRID:
- Container: background #0F172A, border 1px #334155, radius 12px
- Padding: 24px
- 2-column grid of 10 codes (5 rows x 2 columns)
- Gap: 8px vertical, 48px horizontal

Each code:
- Number prefix: "1." through "10." in #64748B
- Code: "ABCD-EFGH-1234" format in JetBrains Mono 14px, #F8FAFC
- Slight background on hover for individual code

ACTION BUTTONS ROW:
- Below codes container
- 3 buttons in a row, equal width
- Gap: 12px

Button 1 - Copy All:
- Icon: clipboard
- Text: "Copy All"
- Ghost style, height 40px

Button 2 - Download:
- Icon: download
- Text: "Download"
- Ghost style, height 40px

Button 3 - Print:
- Icon: printer
- Text: "Print"
- Ghost style, height 40px

CONFIRMATION CHECKBOX:
- Margin-top: 24px
- Checkbox with label:
- "I have saved my backup codes securely"
- Required to enable Complete button
- 14px Inter Regular

COMPLETE BUTTON:
- "Complete Setup" primary button
- Full width, height 48px
- Disabled until checkbox checked
- On click: redirect to dashboard with success toast

INFO TIP:
- Below button
- Small text: "You can regenerate backup codes anytime in Settings → Security"
- 12px #64748B, centered
```

---

## Screen 1.2.1: Module Builder - Main View

### Stitch Prompt

```
Create the main Module Builder interface for "Hyyve" platform. This is a complex 3-panel layout with workflow canvas.

OVERALL LAYOUT:
- Full viewport height (100vh)
- 3-column layout with resizable panels
- Header bar at top (56px height)

HEADER BAR:
- Background: #1E293B
- Border-bottom: 1px solid #334155
- Left section:
  - Hamburger menu icon (24px)
  - Breadcrumb: "Projects / Customer Support / Module Builder"
  - Project name editable on click (inline edit)
- Center section:
  - Run button: green #10B981 background, play icon + "Run"
  - Stop button: ghost style, square icon (only visible when running)
- Right section:
  - Save button: ghost style, floppy disk icon
  - Export button: ghost style, external link icon + "Export"
  - Status indicator: "Saved" with checkmark or "Unsaved" dot

LEFT PANEL - Knowledge Base (240px width, resizable):
- Header: "Knowledge Base" with collapse arrow
- Background: #1E293B
- Tabs: "Sources" | "Entities" | "Graph"

Sources Tab Content:
- Search input at top
- List of sources with icons:
  - Document icon + "FAQ.pdf" + file size
  - Document icon + "Product Docs.md"
  - Link icon + "api.company.com"
- Each item: hover highlight, click to preview
- Add button at bottom: "+ Add Source"

Entities Tab Content:
- Entity type filter dropdown
- List of extracted entities with type badges
- Click to view in graph

Graph Tab Content:
- Mini knowledge graph visualization
- Zoom controls
- "Open Full View" button

CENTER PANEL - Canvas (flex-1, minimum 400px):
- Background: #0F172A with subtle dot grid pattern (dots #334155)
- This is the ReactFlow canvas area

Canvas Header:
- Zoom controls: -, percentage, +
- Fit view button
- Minimap toggle
- Grid toggle

Canvas Content:
- Workflow nodes connected by edges
- Example workflow shown:
  - Start node (rounded, green border)
  - LLM node (rectangular, purple accent)
  - Branch node (diamond shape, orange accent)
  - Email node, Slack node, End node

Node Styling:
- Background: #1E293B
- Border: 2px solid (color varies by type)
- Border radius: 8px
- Header: node type icon + name
- Body: brief config summary
- Handles: circles on edges for connections

Node Toolbar (appears on node selection):
- Floating above selected node
- Buttons: Edit, Duplicate, Delete
- Background: #334155, radius 6px

Canvas Bottom Bar:
- Node Library label
- Search input
- Horizontal scrollable list of node type cards:
  - LLM, Tool, Condition, Email, Slack, HTTP, Code, etc.
- Each card: 80px x 60px, icon + name
- Drag to add to canvas

RIGHT PANEL - Chat Agent (320px width, resizable):
- Header: "Bond" with avatar (robot icon, purple) + status dot (green = online)
- Background: #1E293B

Chat Messages Area:
- Scrollable message list
- Agent messages: left-aligned, avatar, bubble background #334155
- User messages: right-aligned, bubble background #4F46E5
- Typing indicator: 3 animated dots

[AGENT_CONTENT_ZONE] - Mark this area:
- This is where AG-UI/A2UI will render dynamic content
- Agent can generate:
  - Proposed node configurations
  - Clarifying questions with radio/checkbox options
  - Code snippets
  - Preview cards
- Placeholder: dashed border box with text "Agent-generated content appears here"

Current Agent Message Example:
- "Hi! I see you're building a support flow."
- "What triggers this workflow?"
- Radio options: Webhook, Schedule, Manual, Event

Chat Input:
- Text input at bottom
- Placeholder: "Ask Bond anything..."
- Send button (arrow icon)
- Voice input button (microphone icon)
- Attachment button (paperclip)

PANEL RESIZERS:
- Vertical resize handles between panels
- Cursor: col-resize
- Visual indicator on hover

KEYBOARD SHORTCUTS HINT:
- Bottom-right corner floating
- "⌘K for commands" small text
- Dismissible
```

---

## Screen 1.2.2: Node Configuration Panel

### Stitch Prompt

```
Create the Node Configuration side panel that appears when editing a node in the Module Builder.

TRIGGER:
- Opens when user double-clicks a node on canvas
- Slides in from the right, overlaying the Chat Agent panel
- Or can be docked as replacement for Chat Agent panel

PANEL LAYOUT:
- Width: 400px
- Full height of content area
- Background: #1E293B
- Border-left: 1px solid #334155

HEADER:
- Node type icon (24px) + Node name (editable)
- Node type badge: "LLM Node" pill
- Close button (X) right side
- Drag handle for reordering (6 dots icon)

TABS:
- "Configure" | "Test" | "History"
- Active tab: underline #4F46E5
- Tab content below

CONFIGURE TAB:

Section 1 - Basic Settings:
- Section header: "Basic Settings" with collapse arrow
- Fields:
  - Name: text input (current node name)
  - Description: textarea (optional, for documentation)

Section 2 - LLM Configuration:
- Section header: "Model Settings"
- Model dropdown:
  - Label: "Model"
  - Options: GPT-4, GPT-3.5, Claude 3, Gemini Pro, etc.
  - Selected shows model icon + name
- Temperature slider:
  - Label: "Temperature"
  - Range: 0.0 to 2.0
  - Current value display
  - Marks at 0, 0.5, 1.0, 1.5, 2.0
- Max Tokens input:
  - Label: "Max Tokens"
  - Number input with +/- buttons
  - Helper: "Maximum response length"

Section 3 - Prompt Template:
- Section header: "Prompt"
- Code editor area:
  - Monaco editor or similar
  - Syntax highlighting for template variables
  - Line numbers
  - Height: 200px (resizable)
- Variable insertion:
  - Button: "+ Insert Variable"
  - Dropdown: {{input}}, {{context}}, {{kb_results}}, custom
- Template preview:
  - Collapsible section
  - Shows resolved template with sample data

Section 4 - Input/Output:
- Section header: "Data Mapping"
- Input mapping:
  - "Input from" dropdown (previous node outputs)
  - JSONPath expression input for nested data
- Output schema:
  - Define output structure
  - Add field button

Section 5 - Advanced (Collapsed by default):
- Section header: "Advanced Settings"
- Retry configuration
- Timeout setting
- Fallback behavior

FOOTER:
- Sticky at bottom
- "Apply" primary button
- "Reset" ghost button
- "Delete Node" danger text button

TEST TAB:
- Input textarea: "Test Input"
- "Run Test" button
- Output display area
- Execution time shown
- Token usage shown

HISTORY TAB:
- List of recent executions for this node
- Each row: timestamp, status badge, duration
- Click to expand and see input/output

ANIMATIONS:
- Panel slides in from right (300ms ease-out)
- Sections collapse/expand smoothly
- Tab content fades on switch
```

---

## Screen 1.2.3: Execution Monitor

### Stitch Prompt

```
Create the Execution Monitor view for watching workflow runs in real-time.

LAYOUT:
- Replaces main canvas area when execution starts
- Or can be split view (canvas top, monitor bottom)
- Toggle between views with tab/button

HEADER:
- "Execution Monitor" title
- Run ID: "run_abc123" with copy button
- Status badge: "Running" (animated pulse), "Completed" (green), "Failed" (red)
- Time elapsed: "00:01:23"
- Stop button (if running)
- Close button (return to canvas)

EXECUTION TIMELINE:
- Vertical timeline on left side
- Each node execution as a timeline entry

Timeline Entry (for each node):
- Timestamp: "00:00:00" format
- Node icon + name
- Status indicator:
  - Pending: gray circle
  - Running: blue animated spinner
  - Completed: green checkmark
  - Failed: red X
  - Skipped: gray dash
- Duration badge: "1.2s"
- Expand arrow for details

Expanded Entry Details:
- Input data (JSON viewer, collapsible)
- Output data (JSON viewer, collapsible)
- Token usage (if LLM node)
- Cost (if applicable)
- Error message (if failed, red background)

LIVE VISUALIZATION:
- Miniature canvas view showing current execution
- Active node highlighted with glow effect
- Completed nodes have checkmarks
- Edges animate to show data flow direction

LOG STREAM:
- Right panel or bottom panel
- Real-time log entries streaming
- Log levels: DEBUG (gray), INFO (blue), WARN (yellow), ERROR (red)
- Filter by level
- Search logs
- Auto-scroll toggle
- Download logs button

METRICS SUMMARY:
- Bottom bar with execution metrics
- Total duration
- Total tokens used
- Total cost
- Nodes executed: "5/7"
- Success rate percentage

EXECUTION STATES:

Running State:
- Pulsing status badge
- Active node highlighted on canvas
- Logs streaming
- Stop button enabled

Completed State:
- Static "Completed" badge (green)
- Full timeline visible
- Summary metrics shown
- "Run Again" button appears

Failed State:
- "Failed" badge (red)
- Failed node highlighted in red
- Error details expanded by default
- "View Error" button prominent
- "Retry" button
- Option to retry from failed node

ACTIONS:
- Stop execution (if running)
- Download full execution log
- Share execution link
- View raw JSON
- Re-run execution
- Clone as new execution (with modified inputs)
```

---

## Responsive Behavior (All Screens)

```
MOBILE (<640px):
- Login/Registration: Full width cards, reduced padding
- Module Builder: Single panel view with bottom tab navigation
- Stack panels vertically, swipe to switch
- Chat agent becomes bottom sheet
- Simplified canvas with touch gestures

TABLET (640-1024px):
- Login/Registration: Centered cards
- Module Builder: 2-panel layout (canvas + one side panel)
- Side panel toggles with buttons
- Chat agent as overlay

DESKTOP (1024-1280px):
- Full 3-panel layout
- All features visible
- Keyboard shortcuts active

WIDE (>1280px):
- Comfortable spacing
- Optional 4th panel for execution monitor
- Side-by-side execution view
```

---

## Export Notes for Stitch

```
EXPORT SETTINGS:
- Framework: React
- TypeScript: Yes
- Styling: Tailwind CSS
- Component Library: shadcn/ui compatible
- State Management: Hooks ready
- Accessibility: WCAG 2.1 AA

FILE STRUCTURE:
- Each screen as separate component
- Shared components extracted
- Design tokens as CSS variables
- Icons from Lucide React

NAMING CONVENTION:
- Components: PascalCase
- Files: kebab-case
- CSS classes: Tailwind utilities
```

---

**End of Group 1 (Screens 1-10)**

*Next: Group 2 will cover screens 1.2.2a through 1.3.3 (Node Configuration Details + Chatbot Builder)*
