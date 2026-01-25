# Google Stitch Prompts - Group 15

**Screens 141-146:** Developer Portal & Code Generation

---

## Screen 141: Developer Portal Home (6.2.1)

### Stitch Prompt

```
Create a developer portal landing page with API documentation entry points and usage overview.

**Layout Structure:**
- Full-width page with minimal navigation header
- Hero section with quick start guide
- 3-card grid for main documentation areas
- API endpoints overview table
- Usage metrics section
- Footer navigation

**Header:**
- Height: 64px, #0F172A background
- "Developer Portal" title (left)
- API Status indicator: Green dot "Online" (right)
- Navigation links: Docs, SDKs, Playground, Support

**Hero/Welcome Section:**
- Headline: "Welcome to the Hyyve API"
- Subtext: "Build powerful AI applications with our REST and streaming APIs."
- Light background treatment or subtle gradient

**Quick Start Card:**
- Card with "Quick Start" header
- 3-step numbered list:
  1. "Get your API key" with [Go to API Keys] link arrow
  2. "Install the SDK" with [View SDKs] link arrow
  3. "Make your first call" with [Try Playground] link arrow
- Clean layout with adequate spacing between steps

**Documentation Cards Grid (3 columns):**

Card 1: API Reference
- Icon: Book/document icon
- Title: "API Reference"
- Description: "Full REST API documentation"
- [View Docs] link button

Card 2: SDKs
- Icon: Package/box icon
- Title: "SDKs"
- Description: "Python, Node.js, iOS, Android"
- [Download] link button

Card 3: Playground
- Icon: Game controller/terminal icon
- Title: "Playground"
- Description: "Try API in browser"
- [Open] link button

**API Endpoints Overview Table:**
- Section header: "API Endpoints Overview"
- Table columns: Endpoint, Method, Description
- 6 sample endpoints:
  - /v1/execute | POST | Execute workflow
  - /v1/stream | SSE | Stream execution
  - /v1/workflows | GET | List workflows
  - /v1/chatbots | GET | List chatbots
  - /v1/voice-agents | GET | List voice agents
  - /v1/knowledge-bases | GET | List KBs
- Method badges: POST (green), GET (blue), SSE (purple)

**Usage Metrics Section:**
- Section header: "Your API Usage This Month"
- Progress bars with labels:
  - Requests: 12,847 / 50,000 (26%) - progress bar
  - Tokens: 890K / 5M (18%) - progress bar
- Clean progress bar styling with percentage labels

**Footer Navigation:**
- [API Keys] [Webhooks] [Usage & Billing] [Support] links
- Horizontal layout, centered

**Design Tokens:**
- Background: #0F172A
- Card background: #1E293B
- Card hover: #334155
- Primary: #4F46E5
- Status online: #10B981
- Method POST: #10B981
- Method GET: #3B82F6
- Method SSE: #8B5CF6
- Progress bar track: #334155
- Progress bar fill: #4F46E5
- Link text: #4F46E5
- Link hover: #6366F1
```

**Component Inventory:**
| Component | Variant | Count |
|-----------|---------|-------|
| Header | Portal navigation | 1 |
| StatusIndicator | API online/offline | 1 |
| Card | Documentation entry | 4 |
| Icon | Category icons | 3 |
| DataTable | Endpoint list | 1 |
| Badge | HTTP method | 6 |
| ProgressBar | Usage meter | 2 |
| Link | Inline navigation | 10 |
| Button | Link style | 4 |

**States:**
- API status: online (green), degraded (yellow), offline (red)
- Cards: default, hover with subtle lift
- Usage: normal, warning (>80%), critical (>95%)
- Links: default, hover, active

**Interactions:**
- Click card to navigate to respective section
- Status indicator links to status page
- Progress bars show detailed breakdown on hover
- Quick start steps have hover highlight
- Responsive: stack cards on mobile

---

## Screen 142: API Documentation Browser (6.2.2)

### Stitch Prompt

```
Create an interactive API documentation browser with navigation sidebar and detailed endpoint documentation.

**Layout Structure:**
- 3-column layout:
  - Left sidebar: Navigation (280px)
  - Main content: Endpoint documentation (flex)
  - Version selector in header
- Full-height, scrollable independently

**Header:**
- "API Reference" title
- Version dropdown: [v2.1] selector
- [OpenAPI] download button for spec file

**Left Sidebar Navigation:**
- Collapsible tree structure:
  - Getting Started (section header)
    - Auth (link)
    - Rate Limits (link)
    - Errors (link)
  - Workflows (section header)
    - Execute (link, selected state)
    - Stream (link)
    - List (link)
    - Get (link)
  - Chatbots (section header)
    - Execute, Converse, List
  - Voice Agents (section header)
    - Initiate, Transfer
  - Knowledge Base (section header)
    - Query, Upload, List
  - Webhooks (section header)
    - Create, List
- [Try in Playground] button at bottom of sidebar
- Scroll independently, sticky header

**Main Content - Endpoint Documentation:**

Endpoint Header:
- "POST /v1/execute" - method badge + path
- Description: "Execute a workflow with the specified inputs."

Authentication Section:
- Card: "Authentication"
- Content: Bearer Token header format
- Code block: `Authorization: Bearer <your-api-key>`

Request Body Section:
- Card: "Request Body"
- JSON schema example in code block:
```json
{
  "workflow_id": "string",
  "inputs": {
    "query": "string",
    "context": {}
  },
  "options": {
    "stream": false,
    "timeout": 30000
  }
}
```

Parameters Table:
- "Parameters" section
- Table: Name | Type | Required
- Rows: workflow_id (string, Yes), inputs (object, Yes), options (object, No)
- Type badges styled

Response Section:
- Card: "Response"
- Status badge: "200 OK"
- JSON response example:
```json
{
  "execution_id": "exec_abc123",
  "status": "completed",
  "output": {...},
  "usage": {
    "tokens": 1247,
    "cost": 0.0124
  }
}
```

Code Examples Section:
- "Code Examples" header
- Language tabs: [Python] [Node.js] [cURL] [Go]
- Active tab shows code:
```python
import hyyve as ar

client = ar.Client(api_key)
result = client.execute(
  workflow_id="wf_123",
  inputs={"query": "Hello"}
)
```
- Syntax highlighted with copy button

**Design Tokens:**
- Sidebar background: #0F172A
- Sidebar selected: #4F46E5/20 background, #4F46E5 left border
- Main content background: #1E293B
- Code block background: #0F172A
- Code text: #E2E8F0, JetBrains Mono 13px
- Method POST badge: #10B981 bg, white text
- Type badges: #334155 bg, #94A3B8 text
- Tab active: #4F46E5 underline
- Tab inactive: #64748B text
```

**Component Inventory:**
| Component | Variant | Count |
|-----------|---------|-------|
| Sidebar | Documentation nav | 1 |
| NavTree | Collapsible sections | 6 |
| NavItem | Selected, Default | 15 |
| Select | Version dropdown | 1 |
| Badge | HTTP method, Type | 8 |
| CodeBlock | JSON, Python, cURL | 5 |
| Table | Parameters | 1 |
| Tabs | Language selector | 1 |
| TabItem | Active, Inactive | 4 |
| Card | Content section | 4 |
| Button | Icon (copy) | 3 |

**States:**
- Navigation item: default, hover, selected
- Tab: inactive, active
- Code block: collapsed (long content), expanded
- Copy button: default, copied (success feedback)

**Interactions:**
- Click navigation to scroll to endpoint
- Tab switches update code example language
- Copy button copies code with toast notification
- Collapse/expand navigation sections
- Deep linking to specific endpoints via URL
- Responsive: sidebar collapses to hamburger menu on mobile

**AG-UI Integration:**
```
<!-- AGENT_CONTENT_ZONE: api-playground-inline -->
<div id="inline-playground-zone" data-ag-ui="api-tester">
  <!-- Embedded API testing widget can be inserted here -->
</div>
```

---

## Screen 143: SDK Downloads & Quickstart (6.2.3)

### Stitch Prompt

```
Create an SDK downloads page with installation instructions and quickstart code examples.

**Layout Structure:**
- Full-width page with standard header
- Hero section with page title
- Official SDKs grid (2 large + 2 small cards)
- Quick Start guide with code steps
- Community libraries section
- Footer

**Page Header:**
- "SDKs & Libraries" title
- Version badge: [v2.1 Latest]

**Official SDKs - Large Cards (2):**

Python SDK Card:
- Python logo/icon
- "Python SDK" title with [v2.1.0] version badge
- Install command block: `pip install hyyve`
- Features list (bullet points):
  - Async/sync support
  - Streaming
  - Type hints
  - Retry logic
  - Rate limiting
  - Connection pooling
- Action links: [View on PyPI] [GitHub] [Documentation]

Node.js SDK Card:
- Node.js logo/icon
- "Node.js SDK" title with [v2.1.0] badge
- Install command: `npm install @hyyve/sdk`
- Features list:
  - Promise-based
  - TypeScript types
  - Streaming
  - Browser support
  - React hooks
  - Next.js ready
- Action links: [View on npm] [GitHub] [Documentation]

**Official SDKs - Small Cards (2-column grid):**

iOS SDK Card:
- Apple logo
- "iOS SDK" title
- "Swift Package" subtitle
- [v2.0.3] badge
- [Download] [Docs] buttons

Android SDK Card:
- Android logo
- "Android SDK" title
- "Gradle dependency" subtitle
- [v2.0.3] badge
- [Download] [Docs] buttons

**Quick Start Guide Section:**
- "Quick Start Guide" header
- 3-step numbered guide with code blocks:

Step 1: Install
```
pip install hyyve
```

Step 2: Initialize
```python
from hyyve import Client

client = Client(
    api_key="ar_xxx",
    base_url="https://api.hyyve.com"
)
```

Step 3: Execute
```python
# Sync execution
result = client.workflows.execute(
    workflow_id="wf_abc123",
    inputs={"query": "What is RAG?"}
)
print(result.output)

# Async streaming
async for chunk in client.workflows.stream(...):
    print(chunk.text, end="")
```

**Community Libraries Section:**
- Card with "Community Libraries (Unofficial)" header
- Inline list: Go SDK, Ruby SDK, Rust SDK, PHP SDK
- [View Community Libraries] link button

**Design Tokens:**
- SDK card large: 100% width, stacked vertically on mobile
- SDK card small: 50% width each, side by side
- Install command bg: #0F172A with copy button
- Feature list: checkmark icons, #94A3B8 text
- Version badge: #4F46E5/20 bg, #4F46E5 text
- Step number: 32px circle, #4F46E5 bg, white number
- Code block: JetBrains Mono, syntax highlighted
```

**Component Inventory:**
| Component | Variant | Count |
|-----------|---------|-------|
| Card | SDK large, SDK small | 4 |
| Icon | Platform logos | 4 |
| Badge | Version | 4 |
| CodeBlock | Install command, Python | 4 |
| Button | Link, Download | 10 |
| FeatureList | With checkmarks | 2 |
| StepIndicator | Numbered circle | 3 |
| Link | External | 8 |

**States:**
- Install command: default, copied
- Card: default, hover (subtle shadow lift)
- Download button: default, downloading, complete
- Code block: collapsed, expanded

**Interactions:**
- Click install command to copy with toast
- Expand code blocks if truncated
- Platform cards link to detailed documentation
- Community libraries link to external repos
- Responsive: cards stack on mobile

---

## Screen 144: API Playground (6.2.4)

### Stitch Prompt

```
Create an interactive API testing playground with request/response editors.

**Layout Structure:**
- Full-width with toolbar header
- Endpoint selector bar
- Split-pane: Request (left) / Response (right)
- Request history panel at bottom
- Footer with export options

**Header Toolbar:**
- "API Playground" title
- [Save] [Share] [Settings gear] buttons on right

**Endpoint Selector Bar:**
- Method dropdown: [POST] with color indicator
- Endpoint path dropdown: [/v1/execute] with autocomplete
- Full-width bar, #1E293B background

**Split Pane - Request Side:**
- "Request" label header
- Headers section:
  - Collapsible accordion
  - Key-value pairs:
    - Authorization: Bearer ar_test_xxx
    - Content-Type: application/json
  - [+ Add Header] button

- Body section:
  - JSON editor (Monaco or CodeMirror)
  - Dark theme syntax highlighting
  - Full JSON request body:
```json
{
  "workflow_id": "wf_lead_qual",
  "inputs": {
    "query": "What is RAG?",
    "context": {
      "user_id": "usr_123"
    }
  },
  "options": {
    "stream": false
  }
}
```
  - [Format JSON] button below editor

**Split Pane - Response Side:**
- "Response" label header
- Status line: "Status: 200 OK (234ms)"
  - Status code badge (green for 2xx, red for 4xx/5xx)
  - Response time
- Response body JSON viewer:
```json
{
  "execution_id": "exec_7f8a9b2c",
  "status": "completed",
  "output": {
    "response": "RAG stands for Retrieval-Augmented Generation...",
    "sources": [
      {"doc": "kb_1", "score": 0.94}
    ]
  },
  "usage": {
    "tokens": 847,
    "cost": 0.0084
  }
}
```
- Response Headers section (collapsible):
  - X-Request-ID: req_xyz
  - X-RateLimit-Remaining: 49847
  - X-Cost-Tokens: 847

**Send Button Section:**
- Large [Send Request] primary button with play icon
- API Key selector: dropdown for test keys
- Environment selector: [Sandbox] / [Production]

**Request History Panel:**
- "History" section header
- Table/list of recent requests:
  - Method + Path | Status | Time | When
  - POST /v1/execute | 200 | 234ms | Just now
  - POST /v1/execute | 200 | 189ms | 2 minutes ago
  - GET /v1/workflows | 200 | 45ms | 5 minutes ago
  - POST /v1/execute | 400 | 12ms | 10 minutes ago
- Click to reload request into editor

**Export Footer:**
- [Copy as cURL] [Copy as Python] [Copy as Node.js] buttons

**Design Tokens:**
- Editor background: #0F172A
- Editor text: #E2E8F0
- Status 200: #10B981
- Status 400: #F59E0B
- Status 500: #EF4444
- Response time: #94A3B8
- Send button: #4F46E5, full width in section
- History row hover: #334155
- Split divider: 1px #334155, draggable
```

**Component Inventory:**
| Component | Variant | Count |
|-----------|---------|-------|
| Select | Method dropdown, Endpoint | 2 |
| CodeEditor | Request body, Response body | 2 |
| Accordion | Headers, Response headers | 2 |
| KeyValueEditor | Header pairs | 1 |
| Button | Primary (send), Secondary (export) | 5 |
| Badge | Status code | 1 |
| Select | API key, Environment | 2 |
| DataTable | Request history | 1 |
| SplitPane | Horizontal draggable | 1 |
| IconButton | Format, Copy | 4 |

**States:**
- Request: editing, sending (spinner), complete
- Response: empty, loading, success, error
- History item: default, selected/active, hover
- Split pane: resizing

**Interactions:**
- Type in editor with JSON validation
- Click Send executes request with loading state
- Response streams in for SSE endpoints
- Click history item loads request/response
- Drag split divider to resize panes
- Format JSON button prettifies code
- Export buttons copy to clipboard with toast
- Environment switch shows confirmation

**AG-UI Integration:**
```
<!-- AGENT_CONTENT_ZONE: streaming-response -->
<div id="streaming-response-zone" data-ag-ui="stream-viewer">
  <!-- For SSE endpoints, tokens stream here in real-time -->
  <!-- AG-UI renders incremental response chunks -->
</div>
```

---

## Screen 145: Framework Selection & Configuration (1.2.5)

### Stitch Prompt

```
Create a framework selection and code export configuration interface for the Module Builder.

**Layout Structure:**
- Modal or slide-out panel from Module Builder
- Header with title and close button
- Framework selection section
- Configuration options section
- Preview/summary section
- Action buttons footer

**Header:**
- "Export Configuration" title
- X close button
- Breadcrumb: Module Builder > Export

**Framework Selection Section:**
- Section header: "Target Framework"
- Radio card grid (2x2):

LangChain Card (selected):
- LangChain logo/icon
- "LangChain" title
- "Python framework for LLM applications"
- Radio indicator selected

LlamaIndex Card:
- LlamaIndex logo
- "LlamaIndex"
- "Data framework for LLM applications"
- Radio indicator unselected

CrewAI Card:
- CrewAI logo
- "CrewAI"
- "Framework for AI agent orchestration"
- Radio indicator

Custom/Vanilla Card:
- Code icon
- "Vanilla Python"
- "Pure Python with direct API calls"
- Radio indicator

**Configuration Options Section:**
- Section header: "Export Options"

Language Selection:
- Label: "Language"
- Toggle buttons: [Python] [TypeScript] (Python selected)

Package Manager:
- Label: "Package Manager"
- Dropdown: [pip] [poetry] [conda]

Include Options (Checkboxes):
- Include type hints / type annotations
- Generate requirements.txt / package.json
- Include example .env file
- Add Docker configuration
- Include unit tests (basic)

**Advanced Settings (Collapsible):**
- LLM Provider: dropdown [OpenAI, Anthropic, Custom]
- Embedding Provider: dropdown
- Vector Store: dropdown
- API Style: [Sync] [Async] toggle

**Preview Section:**
- Section header: "Generated Files Preview"
- File tree showing what will be generated:
  ```
  /exported_module/
  ├── main.py
  ├── nodes/
  │   ├── llm_node.py
  │   ├── rag_node.py
  │   └── branch_node.py
  ├── requirements.txt
  ├── .env.example
  └── README.md
  ```
- File count: "7 files will be generated"

**Footer Actions:**
- [Cancel] secondary button
- [Preview Code] secondary button
- [Export] primary button with download icon

**Design Tokens:**
- Modal width: 640px
- Radio card: 140px x 140px
- Radio card selected: #4F46E5 border, #4F46E5/10 background
- Radio card hover: #334155 background
- Toggle active: #4F46E5 background
- Toggle inactive: #334155 background
- Checkbox checked: #4F46E5
- File tree: JetBrains Mono 13px, #94A3B8 text
- Folder icon: folder emoji or icon, #F59E0B
- File icon: document icon, #64748B
```

**Component Inventory:**
| Component | Variant | Count |
|-----------|---------|-------|
| Modal | Large centered | 1 |
| RadioCard | Framework selector | 4 |
| ToggleButton | Language selector | 2 |
| Select | Dropdown | 4 |
| Checkbox | Option list | 5 |
| Accordion | Advanced settings | 1 |
| FileTree | Generated preview | 1 |
| Button | Primary, Secondary | 3 |
| Icon | Framework logos | 4 |

**States:**
- Framework card: unselected, hover, selected
- Toggle: active, inactive
- Checkbox: unchecked, checked, disabled
- Export: idle, exporting, complete, error

**Interactions:**
- Click framework card to select (radio behavior)
- Toggle language updates file extensions in preview
- Checkboxes add/remove files from preview
- Preview Code opens generated code viewer
- Export downloads zip file or opens in browser
- Cancel closes modal without action

---

## Screen 146: Generated Code Viewer (1.2.6)

### Stitch Prompt

```
Create a code viewer interface showing generated code files with syntax highlighting and file navigation.

**Layout Structure:**
- Full-screen modal or dedicated page
- Header with title and actions
- Split view: File tree (left) / Code viewer (right)
- Footer with download actions

**Header:**
- "Generated Code: Support Flow" title
- Framework badge: [LangChain] [Python]
- [Copy All] button
- [Download ZIP] primary button
- X close button (if modal)

**Left Panel - File Tree (240px width):**
- Expandable folder structure
- Current selection highlighted
- File icons by type (.py, .txt, .md, .env)

File structure:
```
support_flow/
├── main.py (selected)
├── nodes/
│   ├── __init__.py
│   ├── llm_node.py
│   ├── rag_node.py
│   └── branch_node.py
├── utils/
│   └── helpers.py
├── requirements.txt
├── .env.example
├── Dockerfile
└── README.md
```

**Right Panel - Code Viewer:**
- Tab bar showing open files (optional)
- File path breadcrumb: support_flow / main.py
- Code editor (read-only) with:
  - Line numbers
  - Syntax highlighting (Python)
  - Horizontal scroll for long lines
  - Copy button in top-right corner

Sample generated code for main.py:
```python
"""
Support Flow - Generated LangChain Application
Auto-generated by Hyyve Platform
"""

from langchain.llms import OpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate

from nodes.llm_node import process_llm
from nodes.rag_node import retrieve_context
from nodes.branch_node import route_decision

def main(query: str, context: dict = None) -> dict:
    """
    Execute the Support Flow workflow.

    Args:
        query: User input query
        context: Optional context dictionary

    Returns:
        Workflow execution result
    """
    # Step 1: Retrieve relevant context
    rag_result = retrieve_context(query)

    # Step 2: Process with LLM
    llm_response = process_llm(
        query=query,
        context=rag_result
    )

    # Step 3: Route based on response
    final_output = route_decision(llm_response)

    return {
        "status": "completed",
        "output": final_output,
        "sources": rag_result.sources
    }

if __name__ == "__main__":
    result = main("How do I reset my password?")
    print(result)
```

**Code Viewer Features:**
- Line numbers: #64748B, right-aligned
- Code: JetBrains Mono 14px
- Syntax colors:
  - Keywords: #C792EA (purple)
  - Strings: #C3E88D (green)
  - Comments: #546E7A (gray)
  - Functions: #82AAFF (blue)
  - Decorators: #F78C6C (orange)
- Current line highlight: #1E293B

**Footer (Optional):**
- Total lines count
- Language indicator
- [Download This File] [Download All] buttons

**Design Tokens:**
- File tree background: #0F172A
- File tree item hover: #1E293B
- File tree selected: #4F46E5/20 bg, #4F46E5 left border
- Code viewer background: #0F172A
- Line number gutter: #1E293B background
- Scrollbar: #334155 thumb, #0F172A track
- Copy button: ghost style, top-right fixed position
```

**Component Inventory:**
| Component | Variant | Count |
|-----------|---------|-------|
| Modal | Full-screen | 1 |
| FileTree | Navigable | 1 |
| FileTreeItem | Folder, File types | 11 |
| CodeViewer | Read-only with highlighting | 1 |
| TabBar | Open files (optional) | 1 |
| Badge | Framework, Language | 2 |
| Button | Primary, Secondary, Ghost | 4 |
| Breadcrumb | File path | 1 |
| IconButton | Copy | 2 |

**States:**
- File tree item: default, hover, selected, expanded, collapsed
- Code viewer: loading (skeleton), loaded, error
- Copy: default, copying, copied (checkmark)
- Download: default, downloading, complete

**Interactions:**
- Click file in tree to view its contents
- Click folder to expand/collapse
- Copy button copies current file to clipboard
- Download ZIP creates and downloads archive
- Syntax highlighting automatic based on file type
- Cmd/Ctrl+F opens search within code
- Responsive: file tree becomes drawer on mobile

---

## Group 15 Summary

| Screen | ID | Component Count | Key Interactions |
|--------|-----|-----------------|------------------|
| Developer Portal Home | 6.2.1 | 22 | Navigation to docs, SDKs, playground |
| API Documentation Browser | 6.2.2 | 38 | Sidebar nav, code examples, language tabs |
| SDK Downloads & Quickstart | 6.2.3 | 25 | Install commands, quick start steps |
| API Playground | 6.2.4 | 30 | Request editing, API testing, history |
| Framework Selection | 1.2.5 | 22 | Framework cards, export options |
| Generated Code Viewer | 1.2.6 | 19 | File tree navigation, syntax highlighting |

**Total Components in Group 15:** 156
**AG-UI Integration Points:** Screens 142, 144 (inline API testing, streaming responses)

---

## Project Completion Summary

### All 146 Screens Complete

| Group | Screens | Theme | Components |
|-------|---------|-------|------------|
| Group 01 | 1-10 | Auth & Module Builder Core | ~180 |
| Group 02 | 11-20 | Node Configuration + Chatbot | ~190 |
| Group 03 | 21-30 | Chatbot Builder + KB | ~185 |
| Group 04 | 31-40 | KB + Dashboard + Phase 2 | ~175 |
| Group 05 | 41-50 | Settings + Canvas | ~165 |
| Group 06 | 51-60 | Canvas + Voice Builder | ~170 |
| Group 07 | 61-70 | HITL + Deployment | ~160 |
| Group 08 | 71-80 | Testing + Export + API | ~155 |
| Group 09 | 81-90 | Templates + Tenant + UI | ~175 |
| Group 10 | 91-100 | Marketplace Core | ~185 |
| Group 11 | 101-110 | Creator Economy | ~170 |
| Group 12 | 111-120 | Enterprise Agency | ~165 |
| Group 13 | 121-130 | Security + RBAC | ~175 |
| Group 14 | 131-140 | Collaboration + Dev Tools | ~178 |
| Group 15 | 141-146 | Developer Portal + Code Gen | ~156 |

**Total Estimated Components:** ~2,584 across 146 screens

### Design System Consistency

All screens use unified design tokens:
- **Background:** #0F172A (base), #1E293B (surface)
- **Primary:** #4F46E5 (indigo)
- **Typography:** Inter (UI), JetBrains Mono (code)
- **Spacing:** 8px base unit
- **Border Radius:** 4-12px
- **Component Library:** shadcn/ui + Tailwind CSS

### AG-UI/A2UI Integration Points

Screens with dynamic agent content zones:
1. Module Builder (1.2.1) - Chat interface
2. Chatbot Builder (1.3.1) - Conversation preview
3. KB Query Testing (1.4.3) - Results streaming
4. Canvas AI Generation (2.1.3) - Generative forms
5. Voice Live Monitor (2.2.3) - Real-time transcription
6. Chatbot Analytics (1.3.7) - Real-time charts
7. Multi-user Editor (5.1.1) - Activity feed
8. API Doc Browser (6.2.2) - Inline playground
9. API Playground (6.2.4) - Streaming responses

### Export Ready Checklist

- [x] All 146 screens documented with detailed prompts
- [x] Component inventories for each screen
- [x] State definitions for interactive elements
- [x] Interaction specifications
- [x] AG-UI integration markers
- [x] Design tokens consistent across all groups
- [x] Responsive considerations noted
- [x] Accessibility requirements implicit in component design
