# Google Stitch Prompts - Group 6 (Screens 51-60)

**Project:** Hyyve Platform
**Screens:** Canvas Advanced Features + Voice Builder + Command Center
**Design System:** shadcn/ui + Tailwind CSS (Dark Theme Primary)

---

## Screen 2.1.7: Canvas Asset Library

### Stitch Prompt

```
Create an asset library panel for managing generated and uploaded media assets used in the canvas builder.

LAYOUT:
- Full-height panel or modal
- Width: 640px (or fill available space)
- Background: #1E293B
- Border radius: 16px (if modal)

HEADER:
- Title: "Asset Library" 18px Semibold
- Actions: "[Upload]" primary button, "[Organize]" outline button
- Padding: 20px 24px
- Border-bottom: 1px solid #334155

FILTER TABS:
- Horizontal tab row
- Pill/chip style filters:
  - [All] (selected - filled #4F46E5)
  - [Images]
  - [Videos]
  - [Audio]
  - [3D]
  - [Documents]
  - [Generated]
- Gap: 8px between chips
- Padding: 16px 24px

SEARCH AND SORT ROW:
- Search input: "[🔍 Search assets...]" placeholder
- Width: flex-1
- Sort dropdown: "Sort: [Recent ▼]"
- Options: Recent, Name A-Z, Size, Type

GENERATED ASSETS SECTION:
- Section header: "Generated Assets (This Project)" 14px Semibold
- Padding: 0 24px

Asset Grid:
- 4 columns on desktop
- Gap: 16px
- Responsive: 3 columns tablet, 2 columns mobile

Asset Card Structure (each 140px x 140px + metadata):
- Square thumbnail container
- Rounded corners: 8px
- Border: 1px solid #334155
- Hover: border #4F46E5, lift effect

Thumbnail Content:
- Image preview fills container
- Type icon overlay (bottom-left):
  - 🖼️ for images
  - 🎬 for videos
  - 🎵 for audio
  - 🧊 for 3D

Card Metadata (below thumbnail):
- Asset name: "hero_v3" 13px truncated
- Dimensions/duration: "2048x" or "15s"
- "✓ Used" badge if referenced in canvas
- Badge: green dot + "Used" text

Example Generated Assets (8 cards):
Row 1:
- hero_v3 (2048x, ✓ Used)
- hero_v2 (2048x)
- banner (1200x, ✓ Used)
- logo (512x, ✓ Used)

Row 2:
- social (1080x)
- promo video (15s, ✓ Used)
- voice (0:32)
- product 3D (GLB)

UPLOADED ASSETS SECTION:
- Section header: "Uploaded Assets"
- Same grid layout

Example Uploaded Assets (3 cards):
- brand (PDF document icon)
- ref_1 (JPG)
- ref_2 (PNG)

SELECTED ASSET DETAIL PANEL:
- Appears when asset selected
- Card at bottom or slide-out
- Background: #0F172A
- Padding: 16px
- Border-top: 1px solid #334155

Detail Content:
- "Selected: hero_v3.png" 14px Semibold
- Metadata list:
  - Created: Jan 25, 2026 2:34 PM
  - Size: 2048 × 2048 (4.2 MB)
  - Generator: Flux 2 Pro
  - Prompt: "Modern hero image for e-commerce..." (truncated)
  - Cost: $0.04

Detail Actions:
- "[Use in Canvas]" primary button
- "[Download]" outline button
- "[Regenerate]" outline button
- "[Delete]" text button (red on hover)

STORAGE INDICATOR (Footer):
- Full width bar
- "Storage Used: 127 MB / 5 GB"
- Progress bar: thin, shows usage percentage

DESIGN TOKENS:
- Background: #1E293B
- Grid bg: #0F172A
- Border: #334155
- Primary: #4F46E5
- Used badge: #10B981

STATES:
- Asset selected: blue border, detail panel shown
- Multi-select: checkboxes appear
- Drag to canvas: ghost preview
- Upload: progress overlay

ANIMATIONS:
- Grid items: staggered fade-in
- Selection: border color transition
- Detail panel: slide up
```

---

## Screen 2.1.8: Batch Processing Queue

### Stitch Prompt

```
Create a batch processing queue interface showing active jobs, queued items, and completed batches with progress tracking.

LAYOUT:
- Full page or large modal
- Width: 800px
- Background: #1E293B
- Border radius: 16px

HEADER:
- Title: "Batch Processing" 18px Semibold
- Actions: "[Pause All]" outline button, "[Clear]" ghost button
- Padding: 20px 24px
- Border-bottom: 1px solid #334155

QUEUE SUMMARY CARDS:
- 4 cards in a row
- Card size: equal width, ~120px height
- Background: #0F172A
- Border radius: 8px
- Padding: 16px
- Text-center

Summary Cards:
1. "12" large number (24px Semibold)
   "Queued" label (12px #64748B)

2. "5" large number
   "Running" label

3. "2" large number
   "Complete" label

4. "$2.34" large number
   "Est Cost" label

ACTIVE JOBS SECTION:
- Section header: "Active Jobs" 14px Semibold
- Padding: 16px 24px

Active Job Card Structure:
- Background: #0F172A
- Border: 1px solid #334155
- Border-radius: 8px
- Padding: 16px
- Margin-bottom: 12px

Job Card Content:

Job #1:
- Title row: "Job #1: Product Hero Images (3 variants)"
- Progress bar:
  - Full width
  - Height: 8px
  - Background: #334155
  - Fill: #4F46E5 at 67%
  - Border radius: 4px
- Progress text: "2/3 variants complete • ETA: 45s"
- Provider info: "Provider: Flux 2 Pro • Cost: $0.12 so far"
- Actions: "[Pause]" "[Cancel]" "[View Results]" text buttons

Job #2:
- Title: "Job #2: Social Media Batch (9 sizes)"
- Progress: 44% (4/9 complete)
- ETA: 2m 15s
- Provider: Ideogram 3 • Cost: $0.36

QUEUED JOBS SECTION:
- Section header: "Queued Jobs (12)" with count
- Table layout

Queue Table Headers:
- # | Job Name | Items | Est Cost | Priority
- Column widths: 40px | flex | 60px | 80px | 80px

Queue Table Rows:
1. #3 | Video Thumbnails | 6 | $0.18 | ⬆ High (red/amber text)
2. #4 | Email Headers | 4 | $0.12 | Normal
3. #5 | Blog Featured Images | 8 | $0.24 | Normal
4. #6 | Product Backgrounds | 12 | $0.48 | ⬇ Low (gray text)
5. ... | ... | | |

Priority Indicators:
- ⬆ High: #F59E0B (amber)
- Normal: #94A3B8 (gray)
- ⬇ Low: #64748B (muted)

Row hover: background #1E293B

COMPLETED SECTION:
- Section header: "Completed (2)"
- Collapsed view by default

Completed Items:
- List format (not cards)
- "✅ Landing Page Hero - 3/3 variants • $0.12 • 3m ago"
- Actions: "[View]" "[Download All]" "[Regenerate]"
- Green checkmark icon

BUDGET ALERT (Footer):
- Full width alert bar
- Background: #F59E0B/10
- Border-left: 4px solid #F59E0B
- Text: "Budget Alert: $2.34 of $10.00 daily budget used"
- Icon: warning icon

DESIGN TOKENS:
- Background: #1E293B
- Card/Table bg: #0F172A
- Progress fill: #4F46E5
- Success: #10B981
- Warning: #F59E0B
- High priority: #F59E0B
- Low priority: #64748B

STATES:
- Pause: icon changes to play
- Cancel: confirmation required
- Job complete: moves to completed section
- Budget exceeded: alert turns red

ANIMATIONS:
- Progress bars: smooth fill animation
- Job completion: slide to completed
- ETA countdown: updates in real-time
```

---

## Screen 2.1.9: Cost Estimation Panel

### Stitch Prompt

```
Create a cost estimation panel showing per-node costs, provider breakdown, cost comparison, and budget status before running a workflow.

LAYOUT:
- Slide-out panel or modal
- Width: 560px
- Background: #1E293B
- Border radius: 16px

HEADER:
- Title: "Cost Estimation" 18px Semibold
- Badge: "[Before Run]" label pill
- Close button: [×]
- Padding: 20px 24px
- Border-bottom: 1px solid #334155

WORKFLOW IDENTIFIER:
- "Workflow: Product Launch Campaign" 14px
- Padding: 16px 24px
- Background: #0F172A

ESTIMATED COSTS TABLE:
- Section header: "Estimated Costs" 14px Semibold
- Card container

Table Structure:
- Columns: Node | Provider | Est Cost
- Column widths: flex | 120px | 80px
- Header row: #64748B text, 12px

Cost Rows (6 items):
1. 🖼️ Hero Image Gen | Flux 2 Pro | $0.04
2. 🖼️ Resize (3 variants) | Internal | $0.00
3. 🖼️ Social Variants (6x) | Flux 2 Pro | $0.24
4. 🤖 Copy Generation | Claude 3.5 | $0.02
5. 🎬 Video Preview (15s) | Kling 2.6 | $0.50
6. 🎵 Voiceover (30s) | ElevenLabs | $0.15

Total Row:
- Divider above: 1px solid #334155
- "" | TOTAL | $0.95
- Bold text, slightly larger

Icon styling:
- Each node type has emoji icon
- 🖼️ Image, 🤖 LLM, 🎬 Video, 🎵 Audio

COST BREAKDOWN BY PROVIDER:
- Section header: "Cost Breakdown by Provider"
- Card container

Provider Table:
- Columns: Provider | Nodes | Cost | % of Total
- Last column includes visual bar

Provider Rows:
1. Flux 2 Pro | 2 | $0.28 | ████████░░░ 29%
2. Kling 2.6 | 1 | $0.50 | ███████████████ 53%
3. ElevenLabs | 1 | $0.15 | █████░░░░░░ 16%
4. Claude 3.5 | 1 | $0.02 | █░░░░░░░░░░ 2%

Visual bars:
- Inline horizontal bars
- Fill color: #4F46E5
- Background: #334155
- Width proportional to percentage

COST COMPARISON SECTION:
- Section header: "Cost Comparison"
- Card with alternative suggestions

Alternative Cards:

Card 1 - Video Alternative:
- "🎬 Video: Switch to Minimax Hailuo"
- Current: "Kling 2.6: $0.50"
- Alternative: "→ Minimax: $0.25 (-$0.25)"
- Savings highlighted in green
- Warning: "⚠️ May have different style/quality"
- Action: "[Switch Provider]" text button

Card 2 - Image Alternative:
- "🖼️ Images: Use Ideogram 3 instead"
- Current: "Flux 2 Pro: $0.28"
- Alternative: "→ Ideogram: $0.18 (-$0.10)"
- Action: "[Switch Provider]" text button

Summary Line:
- "Potential Savings: $0.35 (37% reduction)"
- Green text, bold

BUDGET STATUS SECTION:
- Section header: "Budget Status"
- Card container

Budget Display:
- "Daily Budget: $10.00"
- "Used Today: $3.42" with progress bar
  - Progress: 34% fill
- "This Run: $0.95" with progress bar
  - Progress: 10% fill (different color - amber)
- "Remaining: $5.63"
- Status badge: "✅ Within budget" (green)

If over budget:
- Status: "⚠️ Exceeds remaining budget"
- Red text and icon

FOOTER ACTIONS:
- Padding: 16px 24px
- Border-top: 1px solid #334155
- Button row:
  - "[Cancel]" ghost button
  - "[Adjust Budget]" outline button
  - "[Run Workflow]" primary button

DESIGN TOKENS:
- Background: #1E293B
- Section bg: #0F172A
- Savings: #10B981
- Warning: #F59E0B
- Over budget: #EF4444
- Primary: #4F46E5

STATES:
- Provider switched: table updates
- Over budget: run button disabled or warning
- Calculating: shimmer on totals
```

---

## Screen 2.2.1: Voice Builder - Main View

### Stitch Prompt

```
Create the Voice Builder main interface with three-panel layout: knowledge base, call flow designer, and AI assistant chat.

LAYOUT:
- Full viewport height
- Three-column layout:
  - Left sidebar: 240px (KB and Voice Config)
  - Center: flexible (Call Flow Designer)
  - Right panel: 320px (Voice Agent Chat)

HEADER BAR:
- Height: 48px
- Background: #1E293B
- Border-bottom: 1px solid #334155

Header Content:
- Left: Hamburger menu, "Voice Agent: Support Line" title
- Right: "[Test Call]" outline button, "[Deploy]" primary button

LEFT SIDEBAR:
- Width: 240px
- Background: #0F172A
- Border-right: 1px solid #334155
- Two collapsible sections

Section 1 - KB Scripts:
- Header: "KB" with expand arrow
- Collapsible card

Script Items:
- "Scripts" folder
- Sub-items (indented): "Greet", "Hours", "FAQ"
- Each has document icon
- Draggable to flow

Section 2 - Voice Config:
- Header: "Voice Config"
- Collapsible card

Config Items:
- "Speed" with value preview
- "Pitch" with value preview
- "Accent" selector
- Click opens configuration panel

CENTER - CALL FLOW DESIGNER:
- Background: #0F172A
- Grid pattern: subtle dots (#1E293B)
- Pan and zoom enabled

Flow Node Styles:
- Node width: ~180px
- Background: #1E293B
- Border: 1px solid #334155
- Border-radius: 8px
- Padding: 12px
- Shadow: sm

Entry Node:
- "📞 Incoming Call"
- Green border accent
- Connection point at bottom

Step Nodes:
- Icon + Label format
- "🎙️ Welcome" with preview text
- "Thank you for calling..."

Router Node:
- "🔀 Menu Router"
- "Press 1 for..." preview
- Multiple output connections
- Diamond shape indicator

Terminal Nodes (4):
- Row of smaller nodes
- "Sales", "Support", "FAQ Bot", "Human"
- Color-coded by type

Flow Connections:
- Curved bezier lines
- Arrow indicators
- Color: #475569
- Selected: #4F46E5

Active Node Indicator:
- Pulsing border
- "Speaking..." label with audio wave

RIGHT SIDEBAR - VOICE AGENT CHAT:
- Width: 320px
- Background: #1E293B
- Border-left: 1px solid #334155

Chat Header:
- "VOICE AGENT" title
- "(Chat)" subtitle
- Microphone icon

Chat Content:
- AI message: "Agent: I'll help you design your voice flow."
- Follow-up: "What happens when someone calls?"

Style Options (in chat):
- Radio button list:
  - ○ Greeting first
  - ○ IVR Menu
  - ○ Direct to agent

Chat Input:
- Bottom position
- Input: "Type here..."
- Send button

INTERACTIONS:
- Drag nodes from sidebar to canvas
- Click node to configure
- Connect nodes by dragging from output to input
- Right-click for context menu
- Test Call opens phone simulator

AGENT_CONTENT_ZONE:
- Chat panel: AG-UI streaming for AI assistance
- Flow suggestions: A2UI for node recommendations

RESPONSIVE:
- Collapse right panel below 1200px
- Collapse left sidebar below 900px
```

---

## Screen 2.2.2: Voice Configuration Panel

### Stitch Prompt

```
Create a voice settings configuration panel with voice selection, parameter sliders, speech recognition options, and test playback.

LAYOUT:
- Slide-out panel or modal
- Width: 480px
- Background: #1E293B
- Border radius: 16px

HEADER:
- Title: "Voice Settings" 18px Semibold
- Close button: [×]
- Padding: 20px 24px
- Border-bottom: 1px solid #334155

VOICE SELECTION SECTION:
- Section label: "Voice Selection" 14px Semibold
- Card container
- Padding: 16px

Voice Options (Radio List):
- Each option is a card-like row
- Height: 56px per row
- Border: 1px solid #334155
- Hover: border #4F46E5

Voice Items (4):
1. ○ 🔊 Allison (Female, American)     [▶ Preview]
2. ● 🔊 James (Male, British)          [▶ Preview]  ← selected
3. ○ 🔊 Sofia (Female, Spanish)        [▶ Preview]
4. ○ 🔊 Custom Clone...                [Upload]

Selected styling:
- Radio filled #4F46E5
- Border: 1px solid #4F46E5
- Background: #4F46E5/10

Preview Button:
- Play icon
- On click: plays sample voice

VOICE PARAMETERS SECTION:
- Section label: "Voice Parameters" 14px Semibold
- Padding: 16px

Parameter Sliders (3):

1. Speed Slider:
   - Label row: "Speed:" left, "1.0x" value right
   - Range labels: "Slow" (left) "Fast" (right)
   - Slider: track #334155, thumb #4F46E5
   - Fill: #4F46E5 from left to thumb

2. Pitch Slider:
   - Label: "Pitch:" value "0"
   - Range: "Low" to "High"
   - Center position default

3. Emphasis Slider:
   - Label: "Emphasis:" value "50%"
   - Range: "Flat" to "Expressive"

Slider Styling:
- Track height: 4px
- Thumb: 16px circle
- Thumb hover: scale 1.1
- Focus: ring around thumb

SPEECH RECOGNITION SECTION:
- Section label: "Speech Recognition" 14px Semibold
- Card container
- Padding: 16px

Recognition Options:
1. Language dropdown:
   - Label: "Language:"
   - Dropdown: "English (US)"
   - Full width

2. Checkboxes:
   - ☑️ Enable noise cancellation
   - ☑️ Interrupt detection

3. Silence Timeout:
   - Label: "Silence timeout:"
   - Input: "2.5" with "seconds" suffix
   - Small number input

TEST VOICE SECTION:
- Section label: "Test Voice"
- Padding: 16px

Test Input:
- Textarea with sample text:
  "Hello! Thank you for calling Acme Support..."
- Height: 80px
- Border: 1px solid #334155
- Editable

Play Button:
- "[▶ Play Sample]" outline button
- On click: plays TTS with current settings

FOOTER ACTIONS:
- Padding: 16px 24px
- Border-top: 1px solid #334155
- Buttons: "[Cancel]" ghost, "[Save Settings]" primary

DESIGN TOKENS:
- Background: #1E293B
- Card bg: #0F172A
- Slider track: #334155
- Slider fill: #4F46E5
- Primary: #4F46E5

STATES:
- Voice preview playing: button shows pause icon
- Slider dragging: value updates in real-time
- Saving: button shows loading spinner
- Audio playing: visual waveform indicator

ANIMATIONS:
- Slider thumb: smooth transition
- Preview audio: waveform animation
- Section expand: smooth height
```

---

## Screen 2.2.3: Live Call Monitor

### Stitch Prompt

```
Create a live call monitoring interface with real-time call flow position, live transcript, sentiment analysis, and call controls.

LAYOUT:
- Full page or large panel
- Two-column layout below header
- Background: #0F172A

HEADER:
- Background: #1E293B
- Height: 56px
- Padding: 16px 24px

Header Content:
- Left: "Active Call: +1 (555) 123-4567" with phone icon
- Right: "Duration: 02:34" with live updating timer
- Timer: green dot indicator (pulsing)

MAIN CONTENT - TWO COLUMNS:
- Gap: 24px
- Padding: 24px

LEFT COLUMN - CALL FLOW POSITION:
- Width: 50%
- Card background: #1E293B
- Border radius: 12px
- Padding: 20px

Section Header:
- "CALL FLOW POSITION" 12px uppercase #64748B

Flow Visualization (Vertical):
- Vertical node list showing call progress
- Completed nodes: ✓ checkmark, dimmed
- Active node: highlighted, animated

Flow Nodes:
1. 📞 Incoming ✓ (completed - green check)
2. 🎙️ Welcome ✓ (completed)
3. 🔀 Menu ✓ (completed)
4. 💬 Support ← ACTIVE (highlighted)

Active Node Styling:
- Background: #4F46E5/20
- Border-left: 3px solid #4F46E5
- "← ACTIVE" label

Speaking Indicator (inside active node):
- Audio level visualization
- Progress bar showing speaking
- "Speaking..." label
- Animated bars: ████████████░░░░

RIGHT COLUMN - LIVE TRANSCRIPT:
- Width: 50%
- Card background: #1E293B
- Border radius: 12px
- Padding: 20px
- Max-height with scroll

Section Header:
- "LIVE TRANSCRIPT" 12px uppercase #64748B

Transcript Messages:
- Alternating speakers
- Real-time appearance

Message Format:
- Speaker icon: 🤖 (bot) or 👤 (caller)
- Message text
- New messages fade in from bottom

Transcript Content:
```
🤖 "Thank you for calling Acme."

👤 "I need help with my order."

🤖 "I'd be happy to help. Can I have your order num..."

👤 "It's 12345"
```

Active message:
- Partial text with cursor blink
- "..." if still processing

SENTIMENT AND INTENT ROW:
- Below main columns
- Full width
- Background: #1E293B
- Padding: 16px 24px
- Border radius: 8px

Content:
- "Caller Sentiment: 😊 Positive" with emoji
- "Intent: order_status" as code badge
- Horizontal layout with divider

Sentiment Indicators:
- 😊 Positive: green text
- 😐 Neutral: gray text
- 😞 Negative: red text

CALL CONTROL BUTTONS:
- Bottom row
- Center aligned
- Button group styling

Control Buttons (4):
1. [🔇 Mute] - outline button
2. [⏸️ Hold] - outline button
3. [📞 Transfer] - outline button
4. [🔴 End Call] - destructive button (red)

Button spacing: 12px gap

DESIGN TOKENS:
- Background: #0F172A
- Card: #1E293B
- Active: #4F46E5
- Completed: #10B981
- Danger: #EF4444

STATES:
- Mute active: icon filled, button highlighted
- Hold: timer paused, indicator shown
- Transfer: opens agent selector modal
- End call: confirmation required

ANIMATIONS:
- Speaking bars: continuous animation
- Transcript: smooth scroll, fade-in messages
- Duration timer: real-time update
- Sentiment: smooth transition between states

AGENT_CONTENT_ZONE:
- Transcript area: AG-UI streaming zone
- Real-time updates from speech-to-text
```

---

## Screen 2.2.4: Advanced Voice Configuration

### Stitch Prompt

```
Create an advanced voice configuration page with STT provider settings, TTS controls, VAD configuration, and latency optimization.

LAYOUT:
- Full page settings view
- Single column, max-width 800px centered
- Sections stacked with 24px gaps

HEADER:
- Title: "Advanced Voice Settings" 20px Semibold
- Action: "[Save]" primary button
- Border-bottom: 1px solid #334155

SPEECH-TO-TEXT (STT) SECTION:
- Card background: #1E293B
- Section header: "Speech-to-Text (STT)" with microphone icon
- Padding: 24px
- Border radius: 12px

STT Controls:
1. Provider Dropdown:
   - Label: "Provider:"
   - Dropdown: "Deepgram Nova-3"
   - Full width

2. Model and Language Row:
   - Model: "nova-2-general" dropdown
   - Language: "en-US" dropdown
   - Side by side, 50% each

3. Advanced Settings (Collapsible):
   - Header: "Advanced Settings:" with expand arrow

Advanced Options (Checkboxes):
- • Punctuation: [✓] Enabled
- • Smart Formatting: [✓] Enabled (numbers, dates, etc.)
- • Profanity Filter: [✓] Enabled
- • Diarization: [○] Disabled (single speaker calls)

Keywords Boost:
- Label: "Keywords Boost:"
- Helper: "Add keywords for better accuracy"
- Textarea: "AcmeCorp, OrderID, SKU123, refund"
- Chip-style display of keywords
- Height: 60px

TEXT-TO-SPEECH (TTS) SECTION:
- Card background: #1E293B
- Section header: "Text-to-Speech (TTS)" with speaker icon
- Padding: 24px

TTS Controls:
1. Provider Dropdown:
   - Label: "Provider:"
   - Dropdown: "Cartesia Sonic"

2. Voice Selection:
   - Label: "Voice:"
   - Dropdown: "Jessica - Warm, Professional"
   - Preview button: "[Preview ▶]"

3. Voice Parameters Card:
   - Nested card background: #0F172A
   - Three sliders:

   Speed Slider:
   - Range: 0.5x to 2.0x
   - Current: 1.0x
   - Visual: [──────●────]

   Pitch Slider:
   - Range: -10 to +10
   - Current: +2
   - Visual: [────●──────]

   Stability Slider:
   - Range: 0 to 1
   - Current: 0.7
   - Label: "(more expressive)"
   - Visual: [──────●──]

4. SSML Support:
   - Checkbox: "[✓] SSML Support: Enabled"
   - Link: "[View SSML Examples]"

VOICE ACTIVITY DETECTION (VAD) SECTION:
- Card background: #1E293B
- Section header: "Voice Activity Detection (VAD)"
- Padding: 24px

VAD Controls:
1. Engine Info:
   - "Engine: Silero VAD (98.8% TPR)"
   - Green checkmark for accuracy

2. Sensitivity Slider:
   - Label: "Sensitivity:"
   - Range: Low to High
   - Helper: "High (fewer missed utterances)"

3. Interruption Handling (Radio):
   - Label: "Interruption Handling:"
   - Options:
     - ○ Ignore (complete response before listening)
     - ● Pause & Resume (pause on speech, resume if brief)
     - ○ Immediate Stop (stop speaking on any interruption)

4. Turn Detection:
   - Label: "Turn Detection:"
   - Value: "Qwen2.5-0.5B"
   - Dropdown

5. End-of-Turn Delay:
   - Label: "End-of-Turn Delay:"
   - Dropdown: "300ms"
   - Helper: "(wait before responding)"

LATENCY OPTIMIZATION SECTION:
- Card background: #1E293B
- Section header: "Latency Optimization"
- Padding: 24px

Target Display:
- "Target End-to-End Latency: < 200ms"
- Bold, green if meeting target

Latency Breakdown:
- Visual bar chart (horizontal)

Breakdown Items:
- STT: ~45ms   [████░░░░░░░░░░░░░░░░]
- LLM: ~120ms  [████████████░░░░░░░░]
- TTS: ~35ms   [███░░░░░░░░░░░░░░░░░]
- Total: ~200ms [████████████████████] ✅ On Target

Bar colors:
- Individual: #4F46E5
- Total: gradient or different shade
- On target: green checkmark

DESIGN TOKENS:
- Background: #0F172A
- Card: #1E293B
- Nested card: #0F172A
- Slider: #4F46E5
- Success: #10B981

STATES:
- Provider changed: dependent fields update
- Out of target: yellow/red warning
- Saving: loading spinner
```

---

## Screen 2.2.5: Voice Analytics Dashboard

### Stitch Prompt

```
Create a voice analytics dashboard with KPI cards, call volume trends, intent resolution table, and sentiment analysis.

LAYOUT:
- Full page dashboard
- Max-width: 1200px centered
- Background: #0F172A

HEADER:
- Title: "Voice Analytics" 20px Semibold
- Time range: "[Last 30 days ▼]" dropdown
- Export: "[Export]" outline button
- Padding: 24px

KPI OVERVIEW CARDS:
- 4 cards in row
- Equal width
- Gap: 16px

KPI Card Structure:
- Background: #1E293B
- Border radius: 12px
- Padding: 20px
- Height: 100px

KPI Cards (4):
1. Total Calls:
   - Value: "12,847" (24px Semibold)
   - Label: "Calls"
   - Trend: "↑ 23%" (green, up arrow)

2. Average Duration:
   - Value: "3:42"
   - Label: "Avg Dur"
   - Trend: "↓ 12%" (green, down is good)

3. Resolution Rate:
   - Value: "94.2%"
   - Label: "Resolved"
   - Trend: "↑ 8%" (green)

4. Sentiment Score:
   - Value: "4.6/5"
   - Label: "Sentiment"
   - Trend: "↑ 0.3" (green)

CALL VOLUME TREND CHART:
- Card background: #1E293B
- Border radius: 12px
- Padding: 24px
- Height: 280px

Chart Header:
- "Call Volume Trend" 16px Semibold

Line Chart:
- X-axis: Date labels (Jan 1, Jan 8, Jan 15, Jan 22)
- Y-axis: 0, 250, 500 scale
- Multiple lines:
  - Total Calls: #4F46E5 (primary)
  - Resolved by Bot: #10B981 (green)
  - Transferred: #F59E0B (amber)

Legend (below chart):
- [—] Total Calls
- [—] Resolved by Bot
- [—] Transferred
- Clickable to toggle lines

TOP INTENTS TABLE:
- Card background: #1E293B
- Border radius: 12px
- Padding: 24px

Table Header:
- "Top Intents" left, "Resolution Rate" right

Table Columns:
- Intent | Calls | Resolution | Avg Duration

Table Rows (5):
1. order_status | 3,421 | ████████░░ 98% | 2:15
2. return_request | 2,187 | ███████░░░ 89% | 4:32
3. billing_inquiry | 1,923 | ██████░░░░ 76% | 5:47
4. technical_support | 1,456 | █████░░░░░ 62% | 8:23
5. general_inquiry | 1,234 | ████████░░ 94% | 1:45

Resolution bars:
- Inline horizontal bars
- Width proportional to percentage
- Fill: #4F46E5
- Background: #334155

SENTIMENT ANALYSIS SECTION:
- Card background: #1E293B
- Border radius: 12px
- Padding: 24px

Sentiment Distribution:
- Horizontal bar chart

Sentiment Bars:
- 😊 Positive: 67% [████████████████████████████░░░░░]
- 😐 Neutral: 24%  [████████░░░░░░░░░░░░░░░░░░░░░░░░]
- 😞 Negative: 9%  [███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]

Colors:
- Positive: #10B981
- Neutral: #64748B
- Negative: #EF4444

Common Negative Triggers:
- Subheader: "Common Negative Triggers:"
- Bulleted list:
  - • Long hold times (42%)
  - • Repeated questions (28%)
  - • Transfer without context (18%)
  - • Unresolved issues (12%)

FOOTER ACTIONS:
- "[View All Calls]" text button
- "[Download Report]" outline button
- "[Set Up Alerts]" outline button
- Centered, gap: 16px

DESIGN TOKENS:
- Background: #0F172A
- Card: #1E293B
- Primary chart: #4F46E5
- Success: #10B981
- Warning: #F59E0B
- Negative: #EF4444

RESPONSIVE:
- Mobile: KPIs in 2x2 grid
- Tablet: Chart full width
- Tables: horizontal scroll
```

---

## Screen 2.2.6: Call Recording Playback

### Stitch Prompt

```
Create a call recording playback interface with audio player, synchronized transcript, call metadata, and analysis summary.

LAYOUT:
- Modal or full page
- Width: 720px (if modal)
- Background: #1E293B
- Border radius: 16px

HEADER:
- Title: "Call Recording: #12847"
- Actions: "[Download]" outline button, "[×]" close
- Padding: 20px 24px
- Border-bottom: 1px solid #334155

CALL DETAILS CARD:
- Background: #0F172A
- Border radius: 8px
- Padding: 16px
- Margin: 16px 24px
- Two-column grid

Detail Fields (8):
Left Column:
- Caller: +1 (555) 123-4567
- Time: Jan 25, 2026 2:34 PM
- Agent: Support Bot
- Intent: order_status (code badge)

Right Column:
- Duration: 4:32
- Outcome: Resolved (green badge)
- Sentiment: 😊 Positive
- Transfers: 0

Badge Styling:
- Resolved: #10B981 background
- Intent: monospace, #4F46E5 background

AUDIO PLAYER:
- Card background: #0F172A
- Border radius: 8px
- Padding: 16px
- Margin: 0 24px

Player Controls Row:
- Rewind: ◄◄ button
- Play/Pause: ▶ button (larger, primary)
- Forward: ►► button
- Progress bar: full width below
- Time: "2:15 / 4:32" right side

Progress Bar:
- Height: 8px
- Background: #334155
- Fill: #4F46E5
- Thumb: circular, draggable
- Clickable to seek

Additional Controls:
- Speed: [1x ▼] dropdown
- Volume: [🔊 Volume] with slider
- Transcript toggle: [📝 Transcript] button

TRANSCRIPT SECTION:
- Section header: "Transcript" with "[Show Timing]" toggle
- Scrollable area
- Max-height: 300px
- Padding: 0 24px

Transcript Format:
- Timestamp | Speaker | Message
- Alternating backgrounds for readability

Transcript Content:
```
0:00 🤖 Thank you for calling Acme Support. How can I
        help you today?

0:05 👤 Hi, I want to check on my order status.

0:08 🤖 I'd be happy to help with that. Can I have your
        order number or the email address on your account?

0:15 👤 It's order 12345.                              ◄─

0:18 🤖 Thank you. I found order 12345. It was shipped
        yesterday and is currently in transit...

0:32 👤 Yes please.

0:35 🤖 Done! I've sent the tracking link to your email...

0:45 👤 No, that's all. Thanks!

0:47 🤖 You're welcome! Have a great day. Goodbye.
```

Current Position Indicator:
- Arrow (◄─) points to current playback position
- Highlighted row background

Click Behavior:
- Click timestamp to jump to that position

CALL ANALYSIS SECTION:
- Card background: #0F172A
- Border radius: 8px
- Padding: 16px
- Margin: 16px 24px

Analysis Content:
- "Detected Entities:" subheader
- Bulleted list:
  - • Order ID: 12345
  - • Email: john@example.com
  - • Tracking: 1Z999AA10123456784

- "Actions Taken:" subheader
- Bulleted list:
  - • Order lookup (Success) ✓
  - • Send tracking email (Success) ✓

FOOTER ACTIONS:
- Padding: 16px 24px
- Border-top: 1px solid #334155
- Buttons:
  - "[Add Note]" outline button
  - "[Flag for Review]" outline button
  - "[Share Recording]" outline button

DESIGN TOKENS:
- Background: #1E293B
- Card: #0F172A
- Player fill: #4F46E5
- Bot messages: slight blue tint
- User messages: default
- Success: #10B981

STATES:
- Playing: play icon changes to pause
- Seeking: real-time position update
- Transcript sync: auto-scroll to current position
- Flagged: badge appears

ANIMATIONS:
- Progress bar: smooth fill
- Transcript highlight: fade transition
- Auto-scroll: smooth scroll behavior
```

---

## Screen 2.3.1: Command Center Overview

### Stitch Prompt

```
Create a command center dashboard showing system health, active conversations, system metrics, and alerts.

LAYOUT:
- Full page dashboard
- Max-width: 1200px centered
- Background: #0F172A

HEADER:
- Title: "Command Center" 20px Semibold
- Time range: "[Last 24h ▼]" dropdown
- Live toggle: "[⟳ Live]" button (active state pulsing)
- Padding: 24px

SYSTEM HEALTH CARDS:
- 4 cards in row
- Equal width
- Gap: 16px

Health Card Structure:
- Background: #1E293B
- Border radius: 12px
- Padding: 16px
- Height: 80px

Health Cards (4):
1. Uptime:
   - Status dot: ● green
   - Value: "99.9%"
   - Label: "Uptime"

2. Latency:
   - Status dot: ● green
   - Value: "145ms"
   - Label: "Latency"

3. Alerts:
   - Status dot: ○ amber (hollow if issues)
   - Value: "3"
   - Label: "Alerts"

4. Active:
   - Status dot: ● green
   - Value: "12.4K"
   - Label: "Active"

Status Dot Colors:
- ● Green: healthy
- ○ Amber: warning
- ● Red: critical

TWO-COLUMN LAYOUT:
- Below health cards
- Gap: 24px

LEFT COLUMN - ACTIVE CONVERSATIONS:
- Card background: #1E293B
- Border radius: 12px
- Padding: 20px
- Width: 50%

Header: "ACTIVE CONVERSATIONS" 12px uppercase #64748B

Conversation Breakdown:
- Tree-view style list

Items:
```
💬 Chatbots: 847
   ├ Support: 623
   ├ Sales: 189
   └ Other: 35

🎙️ Voice Calls: 23
   ├ Active: 18
   └ Queue: 5

🔧 Workflows: 156
```

Styling:
- Parent items: larger text
- Child items: indented, smaller
- Numbers right-aligned
- Tree lines: #334155

RIGHT COLUMN - SYSTEM METRICS:
- Card background: #1E293B
- Border radius: 12px
- Padding: 20px
- Width: 50%

Header: "SYSTEM METRICS" 12px uppercase #64748B

Resource Bars (4):
1. CPU: [████████░░] 78%
2. MEM: [█████░░░░░] 52%
3. GPU: [██████████] 95% (warning color)
4. I/O: [████░░░░░░] 38%

Bar Styling:
- Full width
- Height: 8px
- Label left, percentage right
- Fill color based on usage:
  - < 70%: #4F46E5
  - 70-85%: #F59E0B
  - > 85%: #EF4444

Request Volume Sparkline:
- Label: "Request Volume (1h)"
- Mini bar chart: ▂▃▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█
- Height: 40px
- Fill: #4F46E5

Error Rate:
- "Error Rate: 0.3%"
- Green if < 1%, amber if 1-5%, red if > 5%

ACTIVE ALERTS SECTION:
- Card background: #1E293B
- Border radius: 12px
- Padding: 20px
- Full width below columns

Header: "Active Alerts"

Alert Items:
1. ⚠️ High latency on LLM calls (>500ms)    2 min ago [→]
2. ⚠️ Voice queue exceeds threshold (5)     5 min ago [→]
3. ✓ Resolved: DB connection spike          15 min ago

Alert Styling:
- Warning: ⚠️ amber icon
- Resolved: ✓ green icon
- Time: right-aligned, #64748B
- Arrow: navigation to detail
- Hover: background #0F172A

DESIGN TOKENS:
- Background: #0F172A
- Card: #1E293B
- Healthy: #10B981
- Warning: #F59E0B
- Critical: #EF4444
- Primary: #4F46E5

STATES:
- Live mode: pulse animation on header
- High resource: warning colors
- Alert new: badge/pulse
- Metric update: subtle flash

ANIMATIONS:
- Sparkline: real-time updates
- Resource bars: smooth transitions
- Alert arrival: slide in from top

RESPONSIVE:
- Mobile: stack columns
- Tablet: 2 columns maintained
- Health cards: 2x2 on mobile
```

---

## Design System Reference (Group 6)

### Voice & Media Components

```
AUDIO PLAYER:
- Background: #0F172A
- Progress track: #334155
- Progress fill: #4F46E5
- Controls: icon buttons, 32px
- Time display: JetBrains Mono

VOICE WAVEFORM:
- Active bars: #4F46E5
- Inactive bars: #334155
- Animation: height oscillation
- Bar count: 12-16 bars

SENTIMENT INDICATORS:
- 😊 Positive: #10B981 (green)
- 😐 Neutral: #64748B (gray)
- 😞 Negative: #EF4444 (red)

FLOW NODES:
- Background: #1E293B
- Border: #334155
- Selected: #4F46E5 border
- Active: pulsing animation
- Connection lines: #475569
- Arrow heads: same as lines

TRANSCRIPT:
- Bot messages: 🤖 icon, slight blue tint bg
- User messages: 👤 icon, default bg
- Timestamp: #64748B, monospace
- Current position: highlighted row

REAL-TIME INDICATORS:
- Live dot: pulsing green
- Updating: subtle flash
- Streaming: shimmer effect
```

---

## Group 6 Cross-References

| Screen | PRD Reference | Architecture Reference | Components |
|--------|--------------|----------------------|------------|
| 2.1.7 Asset Library | FR146, FR147 | Asset Service | AssetGrid, TypeFilter, DetailPanel |
| 2.1.8 Batch Processing | FR148, FR149 | Job Queue | ProgressCard, JobTable, BudgetAlert |
| 2.1.9 Cost Estimation | FR150-FR152 | Billing Service | CostTable, ProviderChart, BudgetBar |
| 2.2.1 Voice Builder | FR166-FR185 | Voice Engine | FlowDesigner, VoiceChat, KBSidebar |
| 2.2.2 Voice Config | FR54-FR58 | Voice Engine | VoiceSelector, ParamSliders, TestPlay |
| 2.2.3 Live Call Monitor | FR64-FR68 | Voice Engine | FlowPosition, LiveTranscript, CallControls |
| 2.2.4 Advanced Voice | FR59-FR63 | Voice Engine | STTConfig, TTSConfig, VADConfig, LatencyChart |
| 2.2.5 Voice Analytics | FR64-FR68 | Analytics Service | KPICards, TrendChart, IntentTable, SentimentBars |
| 2.2.6 Call Recording | FR64, FR68 | Voice Engine | AudioPlayer, SyncTranscript, EntityExtraction |
| 2.3.1 Command Center | FR186-FR200 | Monitoring Service | HealthCards, MetricsBars, AlertsList |

---

## AG-UI/A2UI Integration Points (Group 6)

| Screen | Zone | Integration Type | Notes |
|--------|------|-----------------|-------|
| 2.2.1 Voice Builder | Voice Agent Chat | AG-UI Full Chat | AI assistance for flow design |
| 2.2.3 Live Call Monitor | Live Transcript | AG-UI Streaming | Real-time STT streaming |
| 2.2.5 Voice Analytics | Trend Charts | AG-UI Charts | Real-time metric updates |
| 2.3.1 Command Center | All Metrics | AG-UI Dashboard | Live system metrics streaming |
