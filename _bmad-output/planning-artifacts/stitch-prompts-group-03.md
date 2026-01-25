# Google Stitch Prompts - Group 3 (Screens 21-30)

**Project:** Hyyve Platform
**Screens:** Chatbot Builder Details + Knowledge Base Dashboard
**Design System:** shadcn/ui + Tailwind CSS (Dark Theme Primary)

---

## Screen 1.3.4: Conversation Flow Designer

### Stitch Prompt

```
Create a visual conversation flow designer for building chatbot dialog trees.

LAYOUT:
- Full page view (replaces main builder area)
- Two columns: Flow Library sidebar (200px) + Canvas (flex)
- Properties panel appears when node selected

HEADER:
- Title: "Conversation Flow: Support Bot"
- Actions: "Test" button, "Save" button
- Breadcrumb back to Chatbot Builder

LEFT SIDEBAR - Flow Library:
- Section header: "Flow Library"
- Vertical list of draggable node types

Node Type Cards (each 170px x 48px):
- Icon (24px) + Label
- Drag handle on left

Available nodes:
1. Greet (speech bubble icon, blue)
2. Intent (question mark icon, orange)
3. KB Query (database icon, purple)
4. LLM Response (brain icon, indigo)
5. Email (envelope icon, gray)
6. Branch (git-branch icon, yellow)
7. Human Handoff (person icon, green)
8. End (stop icon, gray)

Footer: "+ Create Custom Node" button

CENTER - Conversation Canvas:
- Background: #0F172A with subtle dot grid
- Smooth bezier connections between nodes
- Auto-layout capability

Example Flow Structure:
```
[START: Greeting] - rounded pill, green border
    │
    │ (smooth bezier curve)
    ▼
[Intent Classify] - diamond shape, orange border
    │
    ├────────────────┬────────────────┐
    │                │                │
    ▼                ▼                ▼
[FAQ Flow]      [Sales Flow]     [Support Flow]
 rectangle       rectangle         rectangle
    │                │                │
    ▼                ▼                ▼
[KB Query]      [Human Handoff]  [Ticket Create]
    │
    ▼
[Response]
    │
    ▼
[END]
```

Node Visual Style:
- Background: #1E293B
- Border: 2px solid (color by type)
- Border radius: 12px (softer than module builder)
- Shadow: sm
- Header: icon + title
- Preview text (truncated): "Hi! How can I..."
- Input handle: top center
- Output handle(s): bottom (multiple for branches)

Connection Lines:
- Smooth bezier curves
- Color: #475569 default
- Animated dash when dragging
- Arrow at end point

Canvas Controls (top-right floating):
- Zoom in/out buttons
- Fit view button
- Auto-layout button
- Minimap toggle

PROPERTIES PANEL (right side, 320px):
- Appears when node selected
- Slides in from right

Selected Node: "Intent Classify"
- Node name input
- Intent configuration table:

| Intent | Examples | Route To |
|--------|----------|----------|
| faq | "how to", "what is" | FAQ Flow |
| sales | "pricing", "demo" | Sales Flow |
| support | "help", "problem" | Support Flow |
| fallback | (no match) | LLM Response |

- "+ Add Intent" button
- Delete node button (danger)

NODE TYPES DETAIL:

Greeting Node:
- Message textarea
- Quick reply buttons configuration
- Delay setting (typing indicator)

Intent Classify Node:
- Intent table as shown above
- Confidence threshold slider
- Fallback behavior

KB Query Node:
- KB selection (multi-select)
- Query variable mapping
- Top K results setting

Human Handoff Node:
- Handoff message
- Target queue/agent selection
- Context passing options

INTERACTIONS:
- Drag from library to canvas to add
- Click connection handle, drag to target to connect
- Double-click node to edit properties
- Delete key removes selected
- Multi-select with shift-click
- Canvas pan with middle-mouse or space+drag
```

---

## Screen 1.3.5: Response Template Editor

### Stitch Prompt

```
Create a response template management and editor interface.

LAYOUT:
- Split view: Template list (left 40%) + Editor (right 60%)
- Full page within chatbot builder

LEFT PANEL - Template List:
- Header: "Response Templates" with search input
- "+ New Template" button (primary)

Template Card List (scrollable):
Each card:
- Icon based on type (emoji/icon)
- Template name (16px semibold)
- Preview text (14px, truncated, #94A3B8)
- "Used in: [Node name]" badge
- Edit button on hover

Example templates:
1. Welcome Message (👋)
   - "Hi! I'm here to help..."
   - Used in: Greeting Node

2. Order Status (📦)
   - "Your order {{order_id}} is {{status}}..."
   - Used in: Order Lookup Flow

3. Fallback Response (❌)
   - "I'm not sure I understand..."
   - Used in: Default Fallback

4. Handoff Message (🤝)
   - "Let me connect you with a human..."
   - Used in: Human Handoff Node

RIGHT PANEL - Template Editor:
- Header: "Edit Template: Order Status"

Form Fields:

1. Template Name:
   - Input: "Order Status Response"

2. Response Type (Tab/Button Group):
   - Text (selected)
   - Rich Card
   - Carousel
   - Custom HTML

3. Message Editor (when Text selected):
   - Rich text editor with formatting toolbar
   - Bold, italic, bullet list buttons
   - Variable insertion dropdown
   - Emoji picker
   - Code block button

   Editor Content:
   ```
   📦 Here's your order status:

   Order: **{{order_id}}**
   Status: {{status}}
   Estimated delivery: {{delivery_date}}

   Need more help? Just ask!
   ```

4. Variable Insertion Panel:
   - Button: "Insert Variable"
   - Dropdown shows available: {{order_id}}, {{status}}, {{delivery_date}}, {{customer_name}}
   - Click to insert at cursor

5. Quick Replies Section:
   - Header: "Quick Replies (optional)"
   - Horizontal row of editable buttons
   - Each button: text input + remove (X)
   - "+ Add Reply" button
   - Examples: "Track Package", "Contact Support"

6. Conditional Display:
   - Checkbox: "Only show when conditions met"
   - When checked, condition builder appears:
     - IF {{status}} equals "shipped"

PREVIEW PANEL (collapsible):
- Header: "Preview"
- Mock chat bubble showing rendered template
- Sample data applied:
  - order_id: "ORD-12345"
  - status: "Shipped"
  - delivery_date: "Jan 27, 2026"
- Preview shows formatted output

FOOTER:
- "Preview" button (toggle preview panel)
- "Save Template" button (primary)

RICH CARD EDITOR (when Rich Card type selected):
- Card title input
- Card image upload/URL
- Card body text
- Action buttons (up to 3)
- Layout preview

CAROUSEL EDITOR (when Carousel type selected):
- Add/remove cards
- Each card same as rich card
- Horizontal scroll preview
```

---

## Screen 1.3.6: Widget Preview & Testing

### Stitch Prompt

```
Create a chatbot widget preview and testing interface with live conversation simulation.

LAYOUT:
- Two main columns: Test Conversation (left) + Widget Preview (right)
- Test scenarios panel below

LEFT COLUMN - Test Conversation:
- Header: "Test Conversation"
- Full-height chat interface

Chat Interface:
- Dark background (#0F172A)
- Message bubbles

Bot Message (left-aligned):
- Avatar: robot icon in circle
- Background: #334155
- Border radius: 12px (except bottom-left: 4px)
- Max width: 80%

User Message (right-aligned):
- Background: #4F46E5
- Border radius: 12px (except bottom-right: 4px)
- Max width: 80%

Example Conversation:
```
🤖: Hi! I'm Support Bot. How can I help today?

👤: What's my order status?

🤖: I'd be happy to help! Please provide your order number.

👤: ORD-12345

🤖: 📦 Here's your order:
    Order: ORD-12345
    Status: Shipped
    ETA: Jan 27

    [Track Package] [Contact Support]
```

Quick Reply Buttons:
- Horizontal row of buttons
- Click to send as user message

Input Area:
- Text input with placeholder
- Send button
- Reset conversation button

RIGHT COLUMN - Widget Preview:
- Header: "Widget Preview"
- Device selector: "Desktop" | "Tablet" | "Mobile" tabs

Preview Container:
- Mock website frame
- Light background with grid pattern
- Simple website wireframe:
  - Nav bar placeholder
  - Hero section placeholder
  - Content area placeholder

Widget Position:
- Bottom-right of preview area
- Shows actual widget appearance

Widget States:
1. Launcher (closed):
   - Circular button with chat icon
   - Subtle pulse animation
   - "Chat with us" tooltip

2. Open Widget:
   - 320px width (desktop)
   - Header with bot name + minimize
   - Chat area with current conversation
   - Input field at bottom
   - "Powered by Hyyve" footer

Device Previews:
- Desktop: Full widget, side position
- Tablet: Slightly smaller, same position
- Mobile: Full-width bottom sheet style

BOTTOM PANEL - Test Scenarios:
- Header: "Test Scenarios"
- Table layout

| Scenario | Status | Last Run | Actions |
|----------|--------|----------|---------|
| Order Lookup | ✅ Pass | 5min ago | [Run] |
| Product FAQ | ✅ Pass | 5min ago | [Run] |
| Human Handoff | ⚠️ Warning | 1hr ago | [Run] |
| Edge: Empty Input | ✅ Pass | 1hr ago | [Run] |
| Edge: Long Message | ✅ Pass | 1hr ago | [Run] |

Status Badges:
- Pass: green background, checkmark
- Warning: yellow background, warning icon
- Fail: red background, X icon

Actions:
- "+ Add Scenario" button
- "Run All Tests" button (primary)

METRICS BAR:
- Horizontal bar with key metrics
- "Avg Response Time: 1.2s"
- "Intent Accuracy: 94%"
- "Fallback Rate: 8%"
- "Handoff Rate: 12%"

HEADER ACTIONS:
- "Deploy Live" button (primary, green)
- Warning if tests failing
```

---

## Screen 1.3.7: Chatbot Analytics Dashboard

### Stitch Prompt

```
Create a chatbot analytics dashboard with conversation metrics and insights.

HEADER:
- Title: "Chatbot Analytics: Support Bot"
- Date range selector: "Last 30 days" dropdown
- Compare toggle: "vs Previous Period"
- Export button

KEY METRICS ROW:
- 4 metric cards, equal width

Card 1 - Total Conversations:
- Large number: "12,456"
- Label: "Total Conversations"
- Trend: "↑ 15%" in green
- Sparkline chart (mini)

Card 2 - Average Rating:
- Large number: "4.2" with star icon
- Label: "Avg Rating"
- Trend: "↑ 0.3" in green
- Star visualization (4.2/5 stars)

Card 3 - Auto-Resolved:
- Large number: "89%"
- Label: "Auto-Resolved"
- Trend: "↑ 5%" in green
- Progress ring visualization

Card 4 - Handoff Rate:
- Large number: "23%"
- Label: "Handoff Rate"
- Trend: "↓ 2%" in green (down is good)
- Progress ring visualization

CONVERSATION VOLUME CHART:
- Section: "Conversation Volume"
- Line chart with area fill
- X-axis: dates (30 days)
- Y-axis: conversation count
- Hover tooltip with exact values
- Gradient fill under line (#4F46E5 to transparent)

INTENT DISTRIBUTION:
- Section: "Intent Distribution"
- Horizontal bar chart or donut chart

Top Intents:
1. Product FAQ - 34% ████████████████
2. Order Status - 28% █████████████
3. Support - 18% ████████
4. Sales Inquiry - 12% ██████
5. Other - 8% ████

Click intent to filter conversations

RESOLUTION BREAKDOWN:
- Section: "Resolution Breakdown"
- Stacked bar or donut chart

Categories:
- Auto-resolved (KB): 45% - purple
- Auto-resolved (LLM): 32% - indigo
- Human handoff: 18% - orange
- Abandoned: 5% - gray

RESPONSE TIME DISTRIBUTION:
- Section: "Response Time"
- Histogram or area chart
- X-axis: time ranges (0-1s, 1-2s, 2-5s, 5s+)
- Target line at 2s
- 95th percentile indicator

SATISFACTION SCORES:
- Section: "Customer Satisfaction"
- Star rating distribution bar chart
- 5 stars: ███████████ 45%
- 4 stars: ████████ 32%
- 3 stars: ████ 15%
- 2 stars: ██ 5%
- 1 star: █ 3%

RECENT CONVERSATIONS TABLE:
- Section: "Recent Conversations"
- Filterable table

| Time | User | Intent | Resolution | Rating | Actions |
|------|------|--------|------------|--------|---------|
| 2h ago | user@email.com | Order Status | ✅ Auto | ⭐⭐⭐⭐⭐ | [View] |
| 3h ago | anonymous | Product FAQ | ✅ Auto | ⭐⭐⭐⭐ | [View] |
| 4h ago | john@co.com | Support | 🤝 Handoff | ⭐⭐⭐ | [View] |

Pagination controls at bottom

EXPORT OPTIONS:
- "Export to CSV" button
- "Schedule Report" button
- "Share Dashboard" button
```

---

## Screen 1.4.1: Knowledge Base Dashboard

### Stitch Prompt

```
Create a Knowledge Base management dashboard showing sources, entities, and graph.

HEADER:
- Title: "Knowledge Base: Customer Support"
- "+ Add Source" button (primary)
- Settings gear icon

OVERVIEW METRICS:
- 4 metric cards in a row

| 124 | 45K | 892 | 98% |
| Sources | Chunks | Entities | Coverage |

Each card:
- Large number (32px bold)
- Label below (14px #94A3B8)
- Background: #1E293B
- Subtle hover effect

SOURCES TABLE:
- Section header: "Sources"
- Filter tabs: "📁 Files" | "🔗 URLs" | "🔌 APIs" | "All"

Table columns:
| Name | Type | Status | Chunks | Last Sync | Actions |

Example rows:
| 📄 Product FAQ.pdf | PDF | ● Ready | 234 | 2h ago | [...] |
| 📄 Support Docs.docx | DOCX | ● Ready | 567 | 1d ago | [...] |
| 🔗 Help Center | URL | ◐ Syncing | - | Now... | [...] |
| 🔌 CRM API | API | ● Ready | 89 | 5m ago | [...] |
| 📄 Returns Policy.md | MD | ● Ready | 12 | 3d ago | [...] |

Status Indicators:
- ● Ready: green dot
- ◐ Syncing: yellow animated dot
- ● Error: red dot

Actions menu: View, Edit, Resync, Delete

ENTITY GRAPH PREVIEW:
- Section header: "Entity Graph" with "View Full Graph" link
- Mini graph visualization (300px height)
- Sample nodes: Product, Price, Feature connected
- Zoom/pan disabled (just preview)
- Click opens full graph modal

RECENT ACTIVITY:
- Section header: "Recent Activity"
- Timeline list:
  - "23 new chunks added from Product FAQ.pdf" - 2h ago
  - "Help Center sync started" - Now
  - "Embedding generation complete" - 4h ago

QUICK ACTIONS:
- "Query Testing" button
- "Pipeline Settings" button
- "Export Knowledge" button
```

---

## Screen 1.4.2: Source Upload Modal

### Stitch Prompt

```
Create a modal for uploading knowledge base sources with multiple input methods.

MODAL:
- Width: 600px
- Max height: 80vh
- Centered overlay
- Background: #1E293B
- Border radius: 12px

HEADER:
- Title: "Add Knowledge Source"
- Close button (X)

SOURCE TYPE TABS:
- 4 tabs as large clickable cards (horizontal)
- Each 130px x 80px

Tab 1 - Upload Files (selected):
- Icon: folder/upload (32px)
- Label: "Upload Files"
- Selected state: border #4F46E5, bg #4F46E5/10

Tab 2 - URL Crawl:
- Icon: link/globe (32px)
- Label: "URL Crawl"

Tab 3 - API Connect:
- Icon: plug (32px)
- Label: "API Connect"

Tab 4 - Text Input:
- Icon: document-text (32px)
- Label: "Text Input"

UPLOAD FILES CONTENT:

Drop Zone:
- Dashed border (#475569)
- Border radius: 8px
- Height: 150px
- Center content:
  - Upload cloud icon (48px, #64748B)
  - "Drop files here"
  - "or click to browse"
  - Supported formats list (12px #64748B)
  - "PDF, DOCX, MD, TXT, CSV, JSON, HTML"

Drag-over state:
- Border: solid #4F46E5
- Background: #4F46E5/10
- Icon animates

Selected Files List:
- Header: "Selected Files (3)"
- Scrollable list (max 150px)

Each file row:
- File icon based on type
- Filename (truncated if long)
- File size "(2.3 MB)"
- Remove button (X)

Example:
- 📄 FAQ.pdf (2.3 MB) [×]
- 📄 Guide.docx (1.1 MB) [×]
- 📄 Policy.md (45 KB) [×]

PROCESSING OPTIONS:
- Section with checkboxes
- ☑ Auto-extract entities
- ☑ Generate embeddings
- ☐ Enable scheduled sync

When scheduled sync checked:
- Frequency dropdown: Daily, Weekly, Monthly

FOOTER:
- "Cancel" button (ghost)
- "Upload & Process" button (primary)
- Processing indicator when uploading

URL CRAWL TAB CONTENT:
- URL input field
- "Add URL" button
- URL list (similar to files)
- Crawl depth selector: [1, 2, 3, All]
- Include/exclude patterns

API CONNECT TAB CONTENT:
- API endpoint URL
- Authentication type dropdown
- API key/token input
- Test connection button
- Sync schedule configuration

TEXT INPUT TAB CONTENT:
- Large textarea for pasting content
- Title/name input
- Format selector: Plain text, Markdown, HTML
```

---

## Screen 1.4.3: KB Query Testing

### Stitch Prompt

```
Create a Knowledge Base query testing interface for validating retrieval quality.

MODAL/PANEL:
- Width: 800px (or full panel)
- Title: "Query Testing"

QUERY INPUT SECTION:
- Label: "Test Query"
- Large textarea (100px height)
- Placeholder: "Enter a question to test retrieval..."
- Example: "What is the return policy for electronics?"
- "🔍 Search" button below

SEARCH SETTINGS (collapsible):
- Top K results: [5 ▼]
- Search type: [Hybrid ▼]
- KB filter: checkboxes for each KB
- Similarity threshold slider

RESULTS SECTION:
- Header: "Results (5 chunks)" with sort dropdown: "Relevance ▼"

Result Cards (stacked):
Each result card:
- Source badge: "📄 Returns Policy.md" with relevance score "[0.94]"
- Score visualization: progress bar or colored badge
- Chunk content preview (3-4 lines, truncated)
- Expand button to see full chunk
- Metadata: page number, section header, etc.

Example cards:
```
┌─────────────────────────────────────────────────────────┐
│ 📄 Returns Policy.md                           [0.94]  │
│ "Electronics may be returned within 30 days of         │
│ purchase with original packaging. Items must be        │
│ unopened or defective to qualify for full refund..."   │
│                                        [Show More]     │
│ Section: Return Policy > Electronics                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 📄 FAQ.pdf                                     [0.87]  │
│ "Q: Can I return my laptop? A: Yes, within our         │
│ standard 30-day return window. The laptop must be      │
│ in original condition with all accessories..."         │
│                                        [Show More]     │
│ Page: 12 | Section: Frequently Asked Questions         │
└─────────────────────────────────────────────────────────┘
```

GENERATED ANSWER SECTION:
- Header: "Generated Answer"
- Collapsible (expanded by default)

Answer display:
- Background: #0F172A with left border accent
- Generated text with citations [1], [2]
- Source links at bottom
- Confidence indicator

Example:
```
Based on the knowledge base, electronics can be returned
within 30 days of purchase. The item must be in original
packaging with all accessories included. [1][2]

Sources:
[1] Returns Policy.md - Section: Electronics
[2] FAQ.pdf - Page 12
```

METRICS PANEL:
- Retrieval time: "234ms"
- Generation time: "1.2s"
- Total tokens: "847"
- Estimated cost: "$0.002"

ACTIONS:
- "Save as Test Case" button
- "Adjust Settings" button
- "Try Another Query" button
```

---

## Screen 1.4.4: RAG Pipeline Configuration

### Stitch Prompt

```
Create a RAG pipeline configuration page with visual flow and settings.

HEADER:
- Title: "RAG Pipeline: Product Documentation"
- "Save" button (primary)
- Status: "Last saved: 2 min ago"

PIPELINE VISUALIZATION:
- Horizontal flow diagram
- Background: #0F172A
- Border: 1px #334155
- Padding: 24px

Flow nodes (left to right):
```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌────────┐
│ Sources  │──▶│ Chunking │──▶│Embedding │──▶│ Index  │
│   23     │   │ 512 tok  │   │ OpenAI   │   │Pinecone│
└──────────┘   └──────────┘   └──────────┘   └────────┘
```

Each node:
- Background: #1E293B
- Border: 2px solid (color by type)
- Icon at top
- Title
- Key metric/setting below
- Click to configure

Connection arrows:
- Animated dots flowing left to right
- Color: #4F46E5

Status bar below diagram:
- "Last processed: 2 hours ago"
- "2,341 chunks indexed"
- "Refresh" link

PROCESSING STATUS TABLE:
- Section: "Processing Status"

Table:
| Source | Status | Chunks | Updated |
|--------|--------|--------|---------|
| product-docs/ | ✅ Synced | 1,234 | 2h ago |
| api-reference.md | ✅ Synced | 456 | 2h ago |
| release-notes/ | ✅ Synced | 234 | 2h ago |
| tutorials/ | ⏳ Processing | 412/500 | Now |
| legacy-docs.pdf | ⚠️ Warning | 5 | Failed |

Status icons with colors:
- ✅ Synced: green
- ⏳ Processing: blue with animation
- ⚠️ Warning: yellow

Actions: "Reprocess All", "View Errors" buttons

RETRIEVAL SETTINGS CARD:
- Section: "Retrieval Settings"

Search Method:
- Dropdown: "Hybrid (Semantic + BM25)"

Weight Sliders:
- Semantic Weight: 0.7 slider with value display
- Keyword Weight: 0.3 slider (linked inverse)

Default Top K:
- Dropdown: [3, 5, 10, 15, 20]

Similarity Threshold:
- Number input: 0.75

MMR Toggle:
- Checkbox: "Enable MMR (Maximal Marginal Relevance)"
- When checked, diversity slider appears

Reranking Toggle:
- Checkbox: "Enable reranking"
- When checked, model dropdown: "Cohere Rerank v3"

INDEX CONFIGURATION CARD:
- Section: "Index Configuration"

Display fields:
- Vector Database: "Pinecone" with logo
- Index Name: "prod-docs-index"
- Dimensions: "1536 (text-embedding-3-small)"
- Metric: "Cosine similarity"
- Pods: "1 (p1.x1) | Replicas: 1"

Actions: "View Index Stats", "Rebuild Index" buttons

FOOTER:
- "Test Pipeline" button (opens query tester)
```

---

## Screen 1.4.5: Embedding Model Configuration

### Stitch Prompt

```
Create an embedding model configuration page for the knowledge base.

HEADER:
- Title: "Embedding Configuration"
- "Save" button

EMBEDDING MODEL SECTION:
- Card container

Provider Dropdown:
- "Provider: [OpenAI ▼]"
- Options: OpenAI, Cohere, Voyage AI, HuggingFace, Custom

Model Dropdown:
- Rich options with details:
  - Model name
  - Dimensions
  - Price per 1M tokens
  - Checkmark on selected

Example:
```
├── text-embedding-3-large (3072 dim, $0.13/1M)
├── text-embedding-3-small (1536 dim, $0.02/1M) ✓
└── text-embedding-ada-002 (1536 dim, $0.10/1M)
```

Model Info Display:
- Dimensions: 1536
- Max tokens: 8191

ALTERNATIVE PROVIDERS:
- Section showing other options
- 3 provider cards side by side

Each card:
- Provider logo/name
- Model name
- Dimensions
- Price
- "Select" button

Cards: Cohere, Voyage AI, HuggingFace (self-hosted)

BATCH PROCESSING SETTINGS:
- Card container

Fields:
- Batch size: dropdown [50, 100, 200, 500]
- Concurrent batches: dropdown [1, 3, 5, 10]
- Rate limiting: input with "tokens/minute" label
- Checkbox: "Auto-retry on rate limit"

Estimates:
- "Est. time for 1000 chunks: ~2 minutes"
- "Est. cost for 1000 chunks: ~$0.04"

QUALITY SETTINGS:
- Card container

Checkboxes:
- "Enable dimensionality reduction"
  - When checked: target dimensions dropdown, method dropdown (PCA, UMAP)
- "Normalize embeddings (L2 normalization)"
- "Enable embedding cache"
  - When checked: TTL dropdown (1 day, 7 days, 30 days)

TEST EMBEDDING PANEL:
- Section: "Test Embedding"
- Input field: "What is the return policy?"
- "Generate Embedding" button
- Output area (collapsed until generated):
  - First 10 dimensions displayed
  - Tokens used
  - Cost estimate
```

---

## Screen 1.4.6: Chunking Strategy Configuration

### Stitch Prompt

```
Create a chunking strategy configuration page for document processing.

HEADER:
- Title: "Chunking Strategy"
- "Save" button

CHUNKING METHOD:
- Radio button group with descriptions

Options:
1. Recursive Character Splitting (Recommended) ✓
   - "Splits by paragraphs, then sentences, then characters"

2. Sentence-based Splitting
   - "Splits at sentence boundaries"

3. Semantic Chunking (AI-powered)
   - "Uses AI to find natural breakpoints"
   - Badge: "Slower, +cost"

4. Fixed Size (by tokens)
   - "Splits at exact token count"

5. Custom (regex separators)
   - "Define your own split patterns"

CHUNK PARAMETERS CARD:
- Two sliders with value displays

Chunk Size Slider:
- Label: "Chunk Size"
- Range: 128 to 2048 tokens
- Current: 512
- Marks at key values

Chunk Overlap Slider:
- Label: "Chunk Overlap"
- Range: 0 to 200 tokens
- Current: 50
- Warning if overlap > 20% of chunk size

Separators List:
- Reorderable list with drag handles
- Priority order (top = highest priority)

1. \n\n (paragraph) [↑][↓]
2. \n (newline) [↑][↓]
3. . (sentence end) [↑][↓]
4. (space - fallback) [↑][↓]

"+ Add Custom Separator" button

CONTENT TYPE RULES TABLE:
- Table for file-type specific settings

| File Type | Chunk Size | Special Handling |
|-----------|------------|------------------|
| .md | 512 | Split by headers |
| .pdf | 1024 | Preserve page boundaries |
| .html | 512 | Strip tags, keep structure |
| .json | 256 | Split by objects |
| .csv | 100 rows | Include headers per chunk |

"+ Add Rule" button

METADATA ENRICHMENT:
- Checkboxes for what to include in chunk metadata

- ☑ Include source file name
- ☑ Include chunk position (start/end)
- ☑ Include section headers
- ☐ Include page number (PDF only)
- ☑ Include creation/modification date
- ☐ Extract named entities
- ☐ Generate chunk summary (uses LLM, +cost)

PREVIEW PANEL:
- Sample document selector
- Current settings preview:
  - Estimated chunks: 8
  - Avg chunk size: 293 words
  - Total overlap: 350 tokens
- "Preview Chunks" button (opens chunk preview modal)
```

---

## Screen 1.4.7: Query Pipeline Configuration

### Stitch Prompt

```
Create a query pipeline configuration page with processing stages.

HEADER:
- Title: "Query Pipeline"
- "Save" button

PIPELINE FLOW DIAGRAM:
- Horizontal flow with stages
- Visual connectors between stages

```
┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────┐
│ Input  │─▶│Preproc │─▶│Expansion│─▶│Retrieval│─▶│Rank│
│ Query  │  │        │  │ (opt)  │  │        │  │    │
└────────┘  └────────┘  └────────┘  └────────┘  └────┘
                                       │
                                       ▼
                              ┌────────────────┐
                              │ Response Gen   │
                              │ (LLM + Context)│
                              └────────────────┘
```

Click each stage to configure

QUERY PREPROCESSING CARD:
- Checkboxes:
  - ☑ Lowercase normalization
  - ☑ Remove stop words
  - ☐ Spelling correction
  - ☑ Query length limit: [500] tokens

Intent Classification (optional):
- ☐ Enable intent classification
- When checked: intent list input

QUERY EXPANSION CARD:
- ☑ Enable query expansion

Method Dropdown:
- HyDE (Hypothetical Document Embedding) ✓
- Multi-query (generates related queries)
- Step-back (generalizes query)
- RAG Fusion (combines strategies)

LLM Selection:
- Dropdown: "Claude Haiku 3.5"

Temperature:
- Slider: 0.3

Cache Toggle:
- ☐ Cache expanded queries (TTL: [1 hour])

RETRIEVAL STRATEGY CARD:
- Primary retrieval: Top [10] candidates

Metadata Filters:
- ☑ Apply metadata filters
- JSON input: {"status": "published"}

Cross-KB Search:
- ☑ Enable cross-KB search
- KB checkboxes: ☑ Product Docs ☑ FAQ ☐ Internal

RERANKING CARD:
- ☑ Enable reranking
- Reranker dropdown: "Cohere Rerank v3"
- Return top: [5] after reranking
- ☐ Score threshold: [0.5]

RESPONSE GENERATION CARD:
- ☑ Generate synthesized response
- LLM dropdown: "Claude Sonnet 4"

System Prompt Editor:
- Textarea with default prompt
- Variable helpers: {{context}}, {{query}}

Options:
- ☑ Include source citations
- ☐ Return raw chunks alongside

FOOTER:
- "Test Query Pipeline" button (opens tester)
```

---

## AG-UI/A2UI Integration Markers - Group 3

| Screen | Zone | Dynamic Content |
|--------|------|-----------------|
| 1.3.4 | Node Properties Panel | Dynamic form based on node type |
| 1.3.5 | Template Preview | Live rendered template with data |
| 1.3.6 | Test Conversation | Full chat interface with streaming |
| 1.3.7 | All Charts | Real-time updating analytics |
| 1.4.3 | Generated Answer | LLM streaming response |
| 1.4.4-1.4.7 | Test Panels | Dynamic test results |

---

**End of Group 3 (Screens 21-30)**

*Next: Group 4 will cover screens 1.5.1-2.1.3 (Dashboard, Voice Builder, Canvas Builder)*
