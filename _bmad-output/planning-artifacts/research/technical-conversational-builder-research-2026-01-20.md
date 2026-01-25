# Technical Research: Conversational Builder UX Patterns

**Date**: January 20, 2026
**Research Focus**: Conversational workflow building patterns for Hyyve Platform
**Author**: AI Research Assistant
**Status**: ✅ Verified (2026-01-21)

---

## Executive Summary

This research document focuses on conversational builder UX patterns for an Hyyve platform. Validation in this pass relies on DeepWiki (repo indexing), Context7 (LangGraph docs), and official vendor documentation/blogs for commercial tools. Only claims backed by those sources are treated as factual; everything else is positioned as internal design proposals.

### Key Findings (Validated)

1. **CC-WF-Studio** supports AI-assisted workflow refinement with structured schemas and a defined set of node types.
2. **BMAD/BMB** provides a tri‑modal (Create/Edit/Validate) workflow method with strict step processing rules.
3. **LangGraph** provides stateful agent graphs with reducer-based state updates and checkpointing (e.g., `InMemorySaver`).
4. **Commercial builders** demonstrate spec/plan/diff approval (Copilot Workspace), multi‑agent review (Cursor), and NL workflow building (n8n). citeturn0search1turn0search2turn0search3turn0search4

### Validation Notes (2026-01-21)

- **Validated via DeepWiki**: CC-WF-Studio refinement pipeline, node types, workflow storage/export paths.
- **Validated via DeepWiki**: BMAD/BMB workflow structure, tri‑modal flows, step processing rules.
- **Validated via Context7**: LangGraph `StateGraph`, `add_messages` reducer, `InMemorySaver` checkpointer.
- **Validated via vendor sources**: Cursor 2.0 (changelog), Copilot Workspace (GitHub Next), Vercel v0 (Vercel blog), n8n AI Workflow Builder (docs).

---

## Table of Contents

1. [CC-WF-Studio Deep Dive](#1-cc-wf-studio-deep-dive)
2. [Commercial Builder Patterns (Validated)](#2-commercial-builder-patterns-validated)
3. [Intent Parsing for Graph Operations (Proposed)](#3-intent-parsing-for-graph-operations-proposed)
4. [Incremental Building Patterns (Proposed)](#4-incremental-building-patterns-proposed)
5. [BMB Integration Approach](#5-bmb-integration-approach)
6. [State Synchronization (LangGraph + Design)](#6-state-synchronization-langgraph--design)
7. [UX Patterns for Conversational Building](#7-ux-patterns-for-conversational-building)
8. [Technical Implementation (Proposed)](#8-technical-implementation-proposed)
9. [Architecture Recommendations (Proposed)](#9-architecture-recommendations-proposed)
10. [Sources (Validated)](#10-sources-validated)

---

## 1. CC-WF-Studio Deep Dive

### Overview

[CC-WF-Studio](https://github.com/breaking-brake/cc-wf-studio) (ClaudeCode Workflow Studio) is a VS Code extension that provides a visual workflow editor for Claude Code Slash Commands, Sub Agents, Agent Skills, and MCP Tools.

**Validated anchors (DeepWiki):**
- Conversational refinement UI: `RefinementChatPanel.tsx`
- Refinement logic: `refinement-service.ts`
- Workflow schema: `resources/workflow-schema.json` and `resources/workflow-schema.toon`
- Node type definitions: `src/shared/types/workflow-definition.ts`
- Workflow storage: `.vscode/workflows/*.json`
- Export targets: `.claude/agents/*.md` and `.claude/commands/*.md`

### "Edit with AI" Feature Architecture

```
+-------------------+     +--------------------+     +------------------+
|   User Message    | --> |   Intent Parser    | --> |  Graph Operation |
| "Add error node"  |     | (LLM + Schema)     |     |   Generator      |
+-------------------+     +--------------------+     +------------------+
                                   |                         |
                                   v                         v
                          +----------------+         +----------------+
                          | Conversation   |         | Workflow JSON  |
                          | History Store  |         | Validator      |
                          +----------------+         +----------------+
                                                            |
                                                            v
                                                    +----------------+
                                                    | Visual Canvas  |
                                                    | Update         |
                                                    +----------------+
```

### How It Works (Validated Highlights)

1. **Refinement panel** sends user requests with the current workflow state.
2. **Schema-driven validation** uses JSON/TOON schemas for structured refinement outputs.
3. **Conversation continuity** uses a session id (`conversationHistory.sessionId`) and streams progress.
4. **Prompt optimization** uses TOON schema and skill relevance filtering to reduce token usage.

### Supported Operations

The refinement feature supports iterative changes to workflow graphs. Specific operation types are defined by the workflow schema and node definitions rather than a fixed hard‑coded list.

### Conversation Context Management (Validated)

- **History maintained** via `conversationHistory.sessionId`
- **Validation errors passed back** for retries
- **Incremental edits** applied over the current workflow JSON

### Node Types Supported (Validated)

```yaml
Node Types:
  - Prompt
  - Sub-Agent
  - AskUserQuestion
  - IfElse
  - Switch
  - Skill
  - MCP
  - SubAgentFlow
  - Start
  - End
```

### Workflow Storage Format

```
.vscode/workflows/          # JSON storage
  ├── workflow-1.json
  └── workflow-2.json

.claude/agents/             # Exported markdown
  └── agent.md

.claude/commands/           # Exported commands
  └── command.md
```

---

## 2. Commercial Builder Patterns (Validated)

### Cursor 2.0 (Changelog 2.0, Oct 29, 2025)

- **Multi‑agent parallelism**: run up to eight agents in parallel on one prompt, using git worktrees or remote machines to isolate changes.
- **Composer model**: agentic coding model described as 4x faster than similarly intelligent models.
- **Improved code review**: view all agent changes across multiple files in one place.
- **Embedded browser**: browser for Agent is GA and can be embedded in‑editor to select elements and forward DOM info.
- **Sandboxed terminals**: GA on macOS, with default sandboxing for agent shell commands.

Sources: https://cursor.com/changelog/2-0 , https://cursor.com/en/changelog

### GitHub Copilot Workspace (GitHub Next)

- **Technical preview sunset**: preview ended May 30, 2025.
- **Spec step**: generates an editable spec with two bullet lists (current state vs desired state).
- **Plan step**: lists every file to create/modify/delete, with editable bullet actions per file.
- **Editable diff**: generated diff is directly editable; editing spec/plan regenerates downstream.

Source: https://githubnext.com/projects/copilot-workspace

### Vercel v0 (Jan 7, 2026 blog)

- **Reliability pipeline**: dynamic system prompt + streaming manipulation (“LLM Suspense”) + deterministic/model‑driven autofixers.
- **Intent detection**: embeddings + keyword matching for AI‑related intent to inject targeted SDK knowledge.
- **Autofixer examples**: adding `QueryClientProvider`, updating `package.json` deps, fixing JSX/TS errors.

Source: https://vercel.com/blog/how-we-made-v0-an-effective-coding-agent

### n8n AI Workflow Builder (Docs)

- **Natural‑language workflow creation** with automated node selection, placement, and configuration.
- **Build loop**: describe → monitor build phases → review/refine.
- **/clear** command resets LLM context.

Source: https://docs.n8n.io/advanced-ai/ai-workflow-builder/

---

## 3. Intent Parsing for Graph Operations (Proposed)

### NL to Structured Operation Translation (Proposed)

```
+------------------+
|  Natural Language|
|  User Input      |
+------------------+
         |
         v
+------------------+     +------------------+
| Intent Detection | --> | Embedding Match  |
| (Keywords +      |     | (Semantic)       |
|  Embeddings)     |     |                  |
+------------------+     +------------------+
         |
         v
+------------------+
| Schema Mapping   |
| (Operation Type) |
+------------------+
         |
         v
+------------------+
| Parameter        |
| Extraction       |
+------------------+
         |
         v
+------------------+
| Structured       |
| Operation JSON   |
+------------------+
```

### Operation Schema Design

```typescript
// Graph Operation Schema
interface GraphOperation {
  type: 'create' | 'connect' | 'modify' | 'delete' | 'rearrange';
  target: {
    nodeType?: NodeType;
    nodeId?: string;
    edgeId?: string;
  };
  parameters: {
    // Type-specific parameters
    [key: string]: unknown;
  };
  confidence: number;  // 0-1 confidence score
}

// Example Operations
type CreateNodeOp = {
  type: 'create';
  target: { nodeType: 'LLM' | 'Tool' | 'Conditional' | ... };
  parameters: {
    name: string;
    config: NodeConfig;
    position?: { x: number; y: number };
    connectTo?: string[];  // Auto-connect to these nodes
  };
  confidence: number;
};

type ConnectOp = {
  type: 'connect';
  target: {
    sourceNodeId: string;
    targetNodeId: string;
  };
  parameters: {
    edgeType: 'default' | 'conditional' | 'error';
    label?: string;
  };
  confidence: number;
};
```

### Ambiguity Resolution Strategies (Proposed)

**Research anchors (validated):**
- ECLAIR (Adobe Research, IAAI 2025) proposes an interactive clarification framework for ambiguous queries. citeturn7search1
- ArXiv 2501.15167 studies ambiguous prompts and proposes human‑machine co‑adaptation strategies. citeturn5view0

```
+------------------+
| Detect Ambiguity |
| (Confidence < T) |
+------------------+
         |
    +----+----+
    |         |
    v         v
+--------+ +--------+
| Infer  | | Ask    |
| Intent | | User   |
+--------+ +--------+
    |         |
    v         v
+------------------+
| Clarification    |
| Question Gen     |
+------------------+
```

**Strategies**:

1. **Confidence Thresholds**
   - High (>0.85): Execute immediately
   - Medium (0.6-0.85): Execute with confirmation
   - Low (<0.6): Request clarification

2. **Clarification Prompt Templates**
```
"I want to make sure I understand correctly. Did you mean:
A) [Interpretation 1 - most likely]
B) [Interpretation 2]
C) Something else (please clarify)"
```

3. **Context-Based Inference**
   - Use conversation history
   - Consider current graph state
   - Apply domain knowledge

### Detect-Clarify-Resolve-Learn (DCRL) Loop

```
+----------+     +----------+     +----------+     +----------+
|  DETECT  | --> | CLARIFY  | --> | RESOLVE  | --> |  LEARN   |
| Ambiguity|     | Question |     | Execute  |     | Feedback |
+----------+     +----------+     +----------+     +----------+
      ^                                                  |
      |                                                  |
      +--------------------------------------------------+
```

---

## 4. Incremental Building Patterns (Proposed)

### Scaffold-to-Detail Pattern

```
Phase 1: High-Level Scaffold
+-------------+     +-------------+     +-------------+
|   Start     | --> |   Process   | --> |    End      |
+-------------+     +-------------+     +-------------+

Phase 2: Expand Details
+-------------+     +-------------+     +-------------+
|   Start     | --> |  Validate   | --> |    End      |
+-------------+     +-------------+     +-------------+
                          |
                          v
                    +-------------+
                    |   Process   |
                    +-------------+

Phase 3: Add Error Handling
+-------------+     +-------------+     +-------------+
|   Start     | --> |  Validate   | --> |    End      |
+-------------+     +------+------+     +-------------+
                          |                    ^
                          v                    |
                    +-------------+     +------+------+
                    |   Process   | --> |   Handle    |
                    +-------------+     |   Error     |
                                        +-------------+
```

### Conversation Flow for Incremental Building

```
User: "Create a workflow that processes customer feedback"

AI: "I'll create a basic feedback processing workflow. Here's the scaffold:

     [Start] --> [Receive Feedback] --> [Analyze] --> [End]

     Would you like me to:
     A) Add sentiment analysis
     B) Add categorization
     C) Add notification routing
     D) Continue with this basic structure"

User: "Add sentiment analysis and categorization"

AI: "Updated workflow:

     [Start] --> [Receive Feedback] --> [Sentiment Analysis]
                                              |
                        +--------------------+--------------------+
                        |                    |                    |
                        v                    v                    v
                   [Positive]          [Neutral]           [Negative]
                        |                    |                    |
                        +--------------------+--------------------+
                                             |
                                             v
                                      [Categorize]
                                             |
                                             v
                                          [End]

     Added 5 nodes. Shall I add email notifications for negative feedback?"
```

### Undo/Redo via Conversation (Proposed)

**External reference (validated):** Replit Agent checkpoints provide workspace‑level rollback/roll‑forward via a checkpoint timeline. citeturn1search1

```typescript
// Checkpoint-based State Management
interface WorkflowCheckpoint {
  id: string;
  timestamp: Date;
  conversationTurnId: string;
  graphState: GraphState;
  description: string;
}

class CheckpointManager {
  checkpoints: WorkflowCheckpoint[] = [];

  createCheckpoint(turn: ConversationTurn, graph: GraphState): void {
    this.checkpoints.push({
      id: generateId(),
      timestamp: new Date(),
      conversationTurnId: turn.id,
      graphState: deepClone(graph),
      description: summarize(turn.changes)
    });
  }

  rewindTo(checkpointId: string): { graph: GraphState; trimmedHistory: string[] } {
    const checkpoint = this.checkpoints.find(c => c.id === checkpointId);
    const laterCheckpoints = this.checkpoints.filter(
      c => c.timestamp > checkpoint.timestamp
    );

    // Remove later checkpoints
    this.checkpoints = this.checkpoints.filter(
      c => c.timestamp <= checkpoint.timestamp
    );

    return {
      graph: checkpoint.graphState,
      trimmedHistory: laterCheckpoints.map(c => c.conversationTurnId)
    };
  }
}
```

### Natural Language Undo Commands

| User Says | Action |
|-----------|--------|
| "Undo that" | Revert last change |
| "Go back" | Revert last change |
| "Go back 3 steps" | Revert to 3 checkpoints ago |
| "Undo the error handling addition" | Find and revert specific change |
| "Start over" | Reset to initial state |
| "Try a different approach" | Branch from current state |

### Branching Conversations (Alternative Approaches)

```
                          [Main Branch]
                               |
    User: "Add error handling" |
                               v
                          Checkpoint A
                               |
    +------ "Try both approaches" ------+
    |                                   |
    v                                   v
[Branch A: Try-Catch]           [Branch B: Result Type]
    |                                   |
    v                                   v
[AI implements]                 [AI implements]
    |                                   |
    +-----------------------------------+
                    |
    User: "Compare them"
                    |
                    v
            [Side-by-side view]
                    |
    User: "Use Branch B"
                    |
                    v
            [Merge Branch B]
```

---

## 5. BMB Integration Approach

### BMAD Method Overview

The [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD) (Breakthrough Method for Agile AI-Driven Development) provides structured workflows for agent creation.

**Validated anchors (DeepWiki):**
- BMB workflows live under `src/modules/bmb/workflows/`
- Tri‑modal Create/Edit/Validate structure with `steps-c/`, `steps-e/`, `steps-v/`
- Step processing rules documented in `src/modules/bmb/workflows/workflow/data/step-file-rules.md`

### Core Components

```
+-------------+
| BMAD-CORE   |  <-- Agent coordination, workflow execution
+-------------+
       |
+------+------+------+
|      |      |      |
v      v      v      v
+-----+ +----+ +----+ +----+
| BMM | |BMB | |BMGD| |CIS |
+-----+ +----+ +----+ +----+
   |      |      |      |
   v      v      v      v
Dev    Builder  Game  Creative
Method Toolkit  Dev   Suite
```

### BMB (BMad Builder) for Conversational Building

BMB workflows follow a tri-modal pattern that maps well to visual workflow building:

| Mode | Visual Equivalent | Entry Point |
|------|------------------|-------------|
| Create | Build new workflow | Chat: "Create a new workflow for..." |
| Edit | Modify existing | Chat: "Update the validation step to..." |
| Validate | Review/test | Chat: "Check if this workflow handles..." |

### Agent Workflow Step Architecture (Validated)

```yaml
Workflow Architecture:
  principles:
    - Micro-file Design
    - Just-In-Time Loading
    - Sequential Enforcement
    - State Tracking (stepsCompleted)
    - Mode-Aware Routing (Create/Edit/Validate)

  step_processing:
    1. READ COMPLETELY
    2. FOLLOW SEQUENCE
    3. WAIT FOR INPUT
    4. CHECK CONTINUATION
    5. SAVE STATE
    6. LOAD NEXT
```

### Mapping BMB Artifacts to Visual Nodes

```
BMB Artifact              Visual Node Type
--------------            ----------------
Agent Definition    -->   [Agent Node]
Workflow Step       -->   [Process Node]
Decision Point      -->   [Conditional Node]
User Input          -->   [User Question Node]
Tool/Skill Use      -->   [MCP/Tool Node]
Output Generation   -->   [Output Node]
```

### Conversational Workflow Example (BMB Style)

```
BMAD-MASTER: "Welcome to the Agent Workflow Builder! What would you like to do?

[C]reate - Build a new agent workflow
[E]dit - Modify an existing workflow
[V]alidate - Review and test a workflow"

User: "Create"

BMAD-MASTER: "Let's start with discovery. What problem should this workflow solve?

Consider:
- Who will use this workflow?
- What inputs does it need?
- What outputs should it produce?
- What decisions need to be made along the way?"

User: "I need a workflow that reviews code changes and generates PR descriptions"

BMAD-MASTER: "Excellent! I'll create a Code Review Workflow. Here's my understanding:

**Inputs**: Code diff, commit messages
**Process**: Analyze changes, identify patterns, generate description
**Output**: PR description with summary, changes, testing notes

Starting scaffold:
+--------+     +-----------+     +----------+     +--------+
| Input  | --> | Analyze   | --> | Generate | --> | Output |
| Diff   |     | Changes   |     | PR Desc  |     | Review |
+--------+     +-----------+     +----------+     +--------+

Shall I:
A) Add more analysis steps (security, performance)?
B) Add approval workflow?
C) Add template customization?
D) Continue with this structure?"
```

### BMB Validation Integration

```typescript
// Validation rules from BMB can be applied to visual workflows
interface WorkflowValidation {
  metadata: MetadataValidation;
  structure: StructureValidation;
  connections: ConnectionValidation;
  completeness: CompletenessValidation;
}

const validateWorkflow = async (workflow: Workflow): Promise<ValidationReport> => {
  const results = await Promise.all([
    validateMetadata(workflow),    // Name, description, version
    validateStructure(workflow),   // Node types, hierarchy
    validateConnections(workflow), // Edge validity, no orphans
    validateCompleteness(workflow) // All required fields filled
  ]);

  return {
    passed: results.every(r => r.passed),
    issues: results.flatMap(r => r.issues),
    suggestions: generateSuggestions(results)
  };
};
```

---

## 6. State Synchronization (LangGraph + Design)

### Conversation Context ↔ Graph State

**Validated LangGraph constructs (Context7 + DeepWiki):**
- `StateGraph` defines a typed state schema.
- Reducers like `add_messages` append/update message history.
- Checkpointing via `InMemorySaver` preserves state across invocations.

```python
from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import InMemorySaver

class ChatState(TypedDict):
    messages: Annotated[list, add_messages]

builder = StateGraph(ChatState)
builder.add_edge(START, "chatbot")
builder.add_edge("chatbot", END)
graph = builder.compile(checkpointer=InMemorySaver())
```

```
+-------------------+          +-------------------+
|   Conversation    |  <---->  |    Graph State    |
|   Context Store   |   sync   |    Store          |
+-------------------+          +-------------------+
         |                              |
         v                              v
+-------------------+          +-------------------+
| - Message history |          | - Nodes           |
| - User preferences|          | - Edges           |
| - Current focus   |          | - Positions       |
| - Undo stack      |          | - Node configs    |
+-------------------+          +-------------------+
```

### Bidirectional Sync Architecture

```typescript
// State Synchronization Manager
class StateSyncManager {
  private conversationStore: ConversationStore;
  private graphStore: GraphStore;
  private eventBus: EventEmitter;

  constructor() {
    // Listen for graph changes (manual edits)
    this.eventBus.on('graph:changed', this.handleGraphChange);

    // Listen for conversation changes (AI edits)
    this.eventBus.on('conversation:command', this.handleConversationCommand);
  }

  // Graph change reflects in conversation
  handleGraphChange(change: GraphChange) {
    const description = this.describeChange(change);
    this.conversationStore.addSystemMessage(
      `[Graph Updated] ${description}`
    );
    this.conversationStore.updateContext({
      lastManualEdit: change,
      graphSnapshot: this.graphStore.getSnapshot()
    });
  }

  // Conversation command reflects in graph
  async handleConversationCommand(command: ParsedCommand) {
    const operations = this.translateToGraphOps(command);

    // Preview mode
    if (command.preview) {
      this.graphStore.showPreview(operations);
      return;
    }

    // Apply with checkpoint
    const checkpoint = this.graphStore.createCheckpoint();
    try {
      await this.graphStore.applyOperations(operations);
      this.conversationStore.recordAppliedChanges(operations, checkpoint);
    } catch (error) {
      this.graphStore.restoreCheckpoint(checkpoint);
      this.conversationStore.addErrorMessage(error);
    }
  }

  // Keep chat aware of current graph
  getContextForLLM(): LLMContext {
    return {
      graphSummary: this.graphStore.getSummary(),
      recentChanges: this.conversationStore.getRecentChanges(5),
      currentFocus: this.conversationStore.getCurrentFocus(),
      availableNodes: this.graphStore.getSelectedNodes()
    };
  }
}
```

### Conflict Resolution (Manual vs AI Edits)

```
                    [User makes manual edit]
                             |
                             v
                    [Detect concurrent state]
                             |
            +----------------+----------------+
            |                                 |
            v                                 v
    [AI was editing]                  [AI was idle]
            |                                 |
            v                                 v
    +---------------+                 [Apply normally]
    | Conflict      |
    | Resolution    |
    +---------------+
            |
    +-------+-------+-------+
    |       |       |       |
    v       v       v       v
[Merge] [User   [AI     [Ask
        wins]   wins]   User]
```

**Resolution Strategies**:

1. **Merge**: Combine non-conflicting changes
2. **User Priority**: Manual edits always win
3. **AI Priority**: Complete AI operation first
4. **Interactive**: Show conflict, ask user to resolve

### Real-Time Context Injection

```typescript
// System prompt augmentation with graph context
function buildSystemPrompt(basePrompt: string, graphState: GraphState): string {
  const nodesSummary = graphState.nodes.map(n =>
    `- ${n.id}: ${n.type} (${n.name})`
  ).join('\n');

  const edgesSummary = graphState.edges.map(e =>
    `- ${e.source} --> ${e.target}`
  ).join('\n');

  return `${basePrompt}

## Current Workflow State

### Nodes (${graphState.nodes.length})
${nodesSummary}

### Connections (${graphState.edges.length})
${edgesSummary}

### Selected Nodes
${graphState.selectedNodes.join(', ') || 'None'}

When the user asks to modify the workflow, reference nodes by their IDs.
`;
}
```

---

## 7. UX Patterns for Conversational Building

### Split View Layout (Chat + Canvas)

```
+------------------------------------------------------------------+
|  [Logo]  Workflow Builder          [Save] [Export] [Settings]     |
+------------------------------------------------------------------+
|                        |                                          |
|     CHAT PANEL         |              CANVAS PANEL                |
|     (40% width)        |              (60% width)                 |
|                        |                                          |
| +--------------------+ |  +------------------------------------+  |
| | AI: What workflow  | |  |                                    |  |
| | would you like to  | |  |    +-------+     +--------+        |  |
| | build today?       | |  |    | Start | --> | Process|        |  |
| +--------------------+ |  |    +-------+     +--------+        |  |
|                        |  |                       |             |  |
| +--------------------+ |  |                       v             |  |
| | User: Create a     | |  |                  +--------+         |  |
| | feedback analyzer  | |  |                  |  End   |         |  |
| +--------------------+ |  |                  +--------+         |  |
|                        |  |                                    |  |
| +--------------------+ |  +------------------------------------+  |
| | AI: I'll create... | |                                          |
| |                    | |  +------------------------------------+  |
| | [Preview] [Apply]  | |  |  Node Inspector (collapsible)      |  |
| +--------------------+ |  |  - Name: Process                    |  |
|                        |  |  - Type: LLM                        |  |
| +--------------------+ |  |  - Model: gpt-4                     |  |
| | Suggestions:       | |  +------------------------------------+  |
| | [Add validation]   | |                                          |
| | [Add error handling| |                                          |
| +--------------------+ |                                          |
|                        |                                          |
| +--------------------+ |                                          |
| | [Type message...]  | |                                          |
| +--------------------+ |                                          |
+------------------------------------------------------------------+
```

**Canvas precedent (validated):** OpenAI’s ChatGPT Canvas provides a split‑view editor with inline edits, selection‑based help, and version history for text/code. citeturn0search0

### Alternative Layouts

**Overlay Mode** (for focused editing):
```
+------------------------------------------------------------------+
|                        CANVAS (100%)                              |
|                                                                   |
|  +-------+     +--------+     +-------+                          |
|  | Start | --> | Process| --> |  End  |                          |
|  +-------+     +--------+     +-------+                          |
|                                                                   |
|  +------------------------------------------+                     |
|  |  AI: "What would you like to modify?"    |                    |
|  |  [x]                                      |                    |
|  |  [Add error handling] [Modify process]   |                    |
|  |  [________________________] [Send]       |                    |
|  +------------------------------------------+                     |
+------------------------------------------------------------------+
```

**Bottom Panel Mode** (terminal-style):
```
+------------------------------------------------------------------+
|                        CANVAS (70% height)                        |
|                                                                   |
|  +-------+     +--------+     +-------+                          |
|  | Start | --> | Process| --> |  End  |                          |
|  +-------+     +--------+     +-------+                          |
+------------------------------------------------------------------+
|  CONVERSATION (30% height, scrollable)                            |
|  AI: Created workflow with 3 nodes...                             |
|  User: Add error handling                                         |
|  AI: Adding error handler... [Preview] [Apply]                    |
|  [______________________________________] [Send]                  |
+------------------------------------------------------------------+
```

### Highlighting Affected Nodes

```
Before AI Operation:
+-------+     +--------+     +-------+
| Start | --> | Process| --> |  End  |
+-------+     +--------+     +-------+
  gray          gray          gray

During Preview (affected nodes highlighted):
+-------+     +--------+     +-------+
| Start | --> | Process| --> |  End  |
+-------+     +--------+     +-------+
  gray        [YELLOW]         gray
                 |
                 v
              +--------+
              | [NEW]  |  <-- Green dashed border
              | Error  |
              +--------+
                 |
                 v
              +-------+
              | [NEW] |
              | Alert |
              +-------+

Legend:
- Gray: Unchanged
- Yellow border: Modified
- Green dashed: New node (preview)
- Red dashed: Will be deleted
```

### Progressive Disclosure

**Level 1: Basic Mode** (for beginners)
```
+----------------------------------+
| What do you want to build?       |
|                                  |
| [ Customer feedback analyzer   ] |
|                                  |
| [Create Workflow]                |
+----------------------------------+
```

**Level 2: Guided Mode** (intermediate)
```
+----------------------------------+
| Workflow Builder                 |
|                                  |
| Templates:                       |
| [Feedback Analysis] [Data ETL]   |
| [API Integration] [Custom]       |
|                                  |
| Or describe in chat:             |
| [________________________] [Go]  |
+----------------------------------+
```

**Level 3: Expert Mode** (advanced)
```
+----------------------------------+
| [Full chat interface]            |
| [Visual canvas with all tools]   |
| [JSON editor tab]                |
| [Debug console]                  |
| [Version history]                |
+----------------------------------+
```

**Progressive disclosure guideline (validated):** NN/g recommends revealing advanced or rarely used features progressively to reduce complexity and errors for novices. citeturn4view0

**Prompt‑guidance patterns (validated):** The Shape of AI catalog includes wayfinders, example galleries, prompt details, and suggestions to reduce blank‑prompt friction. citeturn1search2

**AI interface patterns (validated):** Smashing Magazine emphasizes reducing prompt burden (pre‑prompts, prompt extensions, query builders) and presenting outputs in richer visual forms. citeturn0search1

### Suggestion Chips and Quick Actions

```
+------------------------------------------------------------------+
|  AI: I've created a basic feedback workflow.                      |
|                                                                   |
|  Suggested next steps:                                            |
|  +------------------+ +------------------+ +------------------+   |
|  | Add sentiment    | | Add email        | | Add database     |   |
|  | analysis         | | notification     | | storage          |   |
|  +------------------+ +------------------+ +------------------+   |
|                                                                   |
|  Quick actions for selected node:                                 |
|  [Configure] [Duplicate] [Delete] [Connect to...] [Add condition] |
+------------------------------------------------------------------+
```

### Error State and Recovery

```
+------------------------------------------------------------------+
|  [!] Error: Could not complete operation                          |
|                                                                   |
|  The "Connect nodes" operation failed because:                    |
|  - Node "Validator" output type (string) doesn't match            |
|    Node "Processor" input type (object)                           |
|                                                                   |
|  Suggestions:                                                     |
|  +---------------------------+  +---------------------------+     |
|  | Add type converter        |  | Change Validator output   |     |
|  +---------------------------+  +---------------------------+     |
|  +---------------------------+                                    |
|  | Undo last change          |                                    |
|  +---------------------------+                                    |
+------------------------------------------------------------------+
```

---

## 8. Technical Implementation (Proposed)

### LLM Prompting Strategies for Graph Manipulation

**System Prompt Structure**:

```markdown
# Workflow Builder Assistant

You are an AI assistant specialized in building visual workflows. You help users create, modify, and validate node-based workflows through conversation.

## Capabilities
- Create new workflow nodes (LLM, Tool, Conditional, Input, Output)
- Connect nodes with edges
- Modify node configurations
- Delete nodes and edges
- Rearrange layout
- Validate workflows

## Response Format
Always respond with:
1. A natural language explanation of what you'll do
2. A JSON operation block (when making changes)
3. A preview description
4. Suggested next steps

## Current Workflow State
{DYNAMIC_GRAPH_CONTEXT}

## Operation Schema
When making changes, output valid JSON:
\```json
{
  "operations": [
    {
      "type": "create|connect|modify|delete|rearrange",
      "target": { ... },
      "parameters": { ... }
    }
  ],
  "explanation": "What this change does",
  "preview": true
}
\```

## Rules
- Always confirm destructive operations before executing
- Suggest improvements when workflow has issues
- Keep explanations concise but informative
- Reference nodes by their IDs when discussing specific elements
```

### Structured Output Schema

```typescript
// Complete operation schema
const WorkflowOperationSchema = z.object({
  operations: z.array(z.discriminatedUnion('type', [
    // Create Node
    z.object({
      type: z.literal('create'),
      nodeType: z.enum(['llm', 'tool', 'conditional', 'input', 'output', 'mcp', 'subagent']),
      name: z.string(),
      config: z.record(z.unknown()),
      position: z.object({ x: z.number(), y: z.number() }).optional(),
      connectFrom: z.array(z.string()).optional(),
      connectTo: z.array(z.string()).optional()
    }),

    // Connect Nodes
    z.object({
      type: z.literal('connect'),
      sourceId: z.string(),
      targetId: z.string(),
      sourceHandle: z.string().optional(),
      targetHandle: z.string().optional(),
      label: z.string().optional()
    }),

    // Modify Node
    z.object({
      type: z.literal('modify'),
      nodeId: z.string(),
      changes: z.record(z.unknown())
    }),

    // Delete
    z.object({
      type: z.literal('delete'),
      targetType: z.enum(['node', 'edge']),
      targetId: z.string()
    }),

    // Rearrange
    z.object({
      type: z.literal('rearrange'),
      layout: z.enum(['auto', 'horizontal', 'vertical', 'tree']).optional(),
      nodePositions: z.array(z.object({
        nodeId: z.string(),
        position: z.object({ x: z.number(), y: z.number() })
      })).optional()
    })
  ])),

  explanation: z.string(),
  preview: z.boolean().default(true),
  confidence: z.number().min(0).max(1)
});
```

### Real-Time Preview Implementation

```typescript
// Preview Manager
class PreviewManager {
  private canvas: WorkflowCanvas;
  private previewLayer: OverlayLayer;

  async showPreview(operations: WorkflowOperation[]): Promise<void> {
    // Create preview overlay
    const previewState = this.computePreviewState(operations);

    // Render preview elements with distinct styling
    previewState.newNodes.forEach(node => {
      this.previewLayer.addNode(node, {
        border: '2px dashed #22c55e',  // Green dashed
        opacity: 0.7,
        label: '(Preview)'
      });
    });

    previewState.modifiedNodes.forEach(node => {
      this.previewLayer.highlightNode(node.id, {
        border: '2px solid #eab308',  // Yellow
        pulse: true
      });
      this.previewLayer.showDiff(node.id, node.changes);
    });

    previewState.deletedNodes.forEach(nodeId => {
      this.previewLayer.highlightNode(nodeId, {
        border: '2px dashed #ef4444',  // Red dashed
        opacity: 0.5,
        strikethrough: true
      });
    });

    // Add preview controls
    this.previewLayer.showControls({
      onApply: () => this.applyPreview(operations),
      onCancel: () => this.cancelPreview(),
      onModify: () => this.openModifyDialog(operations)
    });
  }

  async applyPreview(operations: WorkflowOperation[]): Promise<void> {
    // Create checkpoint
    const checkpoint = this.canvas.createCheckpoint();

    try {
      // Apply operations
      for (const op of operations) {
        await this.canvas.executeOperation(op);
      }

      // Clear preview
      this.previewLayer.clear();

      // Animate success
      this.canvas.animateSuccess();
    } catch (error) {
      // Rollback
      this.canvas.restoreCheckpoint(checkpoint);
      this.showError(error);
    }
  }
}
```

### Rollback Mechanisms

```typescript
// Comprehensive rollback system
interface RollbackSystem {
  // Checkpoint management
  checkpoints: Checkpoint[];
  maxCheckpoints: number;

  // Operations
  createCheckpoint(): Checkpoint;
  restoreCheckpoint(checkpoint: Checkpoint): void;
  getCheckpointDiff(from: Checkpoint, to: Checkpoint): Diff;

  // Undo/Redo stack
  undoStack: Operation[];
  redoStack: Operation[];

  undo(): void;
  redo(): void;

  // Named savepoints (user-created)
  savepoints: Map<string, Checkpoint>;
  createSavepoint(name: string): void;
  restoreSavepoint(name: string): void;
}

class RollbackSystemImpl implements RollbackSystem {
  checkpoints: Checkpoint[] = [];
  maxCheckpoints = 50;
  undoStack: Operation[] = [];
  redoStack: Operation[] = [];
  savepoints = new Map<string, Checkpoint>();

  createCheckpoint(): Checkpoint {
    const checkpoint: Checkpoint = {
      id: generateId(),
      timestamp: Date.now(),
      graphState: deepClone(this.getGraphState()),
      conversationState: deepClone(this.getConversationState()),
      metadata: {
        trigger: 'auto' | 'manual',
        description: this.getCurrentOperationDescription()
      }
    };

    this.checkpoints.push(checkpoint);

    // Prune old checkpoints
    if (this.checkpoints.length > this.maxCheckpoints) {
      this.checkpoints = this.checkpoints.slice(-this.maxCheckpoints);
    }

    return checkpoint;
  }

  undo(): void {
    if (this.undoStack.length === 0) return;

    const operation = this.undoStack.pop()!;
    const reverseOp = this.computeReverseOperation(operation);

    this.executeWithoutTracking(reverseOp);
    this.redoStack.push(operation);
  }

  redo(): void {
    if (this.redoStack.length === 0) return;

    const operation = this.redoStack.pop()!;
    this.executeWithoutTracking(operation);
    this.undoStack.push(operation);
  }
}
```

### Event-Driven Architecture

```typescript
// Event types for state synchronization
type WorkflowEvent =
  | { type: 'node:created'; payload: Node }
  | { type: 'node:updated'; payload: { nodeId: string; changes: Partial<Node> } }
  | { type: 'node:deleted'; payload: { nodeId: string } }
  | { type: 'edge:created'; payload: Edge }
  | { type: 'edge:deleted'; payload: { edgeId: string } }
  | { type: 'layout:changed'; payload: { positions: Map<string, Position> } }
  | { type: 'selection:changed'; payload: { nodeIds: string[] } }
  | { type: 'conversation:message'; payload: Message }
  | { type: 'checkpoint:created'; payload: Checkpoint }
  | { type: 'preview:started'; payload: Operation[] }
  | { type: 'preview:applied'; payload: Operation[] }
  | { type: 'preview:cancelled'; payload: void };

// Event bus for decoupled communication
class WorkflowEventBus {
  private handlers = new Map<string, Set<Function>>();

  emit<T extends WorkflowEvent>(event: T): void {
    const eventHandlers = this.handlers.get(event.type);
    eventHandlers?.forEach(handler => handler(event.payload));

    // Also emit to 'all' listeners
    const allHandlers = this.handlers.get('*');
    allHandlers?.forEach(handler => handler(event));
  }

  on<T extends WorkflowEvent['type']>(
    eventType: T,
    handler: (payload: Extract<WorkflowEvent, { type: T }>['payload']) => void
  ): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);

    return () => this.handlers.get(eventType)!.delete(handler);
  }
}
```

---

## 9. Architecture Recommendations (Proposed)

### Recommended System Architecture

```
+------------------------------------------------------------------+
|                        CLIENT (React/Next.js)                     |
+------------------------------------------------------------------+
|                                                                   |
|  +-------------------+    +-------------------+                   |
|  |  Chat Interface   |    |  Canvas Editor    |                   |
|  |  (Conversation)   |    |  (React Flow)     |                   |
|  +--------+----------+    +--------+----------+                   |
|           |                        |                              |
|           +------------------------+                              |
|                        |                                          |
|              +---------+---------+                                |
|              |   State Manager   |                                |
|              |   (Zustand/Redux) |                                |
|              +---------+---------+                                |
|                        |                                          |
+------------------------------------------------------------------+
                         |
                         | WebSocket / SSE
                         |
+------------------------------------------------------------------+
|                        SERVER (Node.js/Python)                    |
+------------------------------------------------------------------+
|                                                                   |
|  +-------------------+    +-------------------+                   |
|  |  Conversation     |    |  Workflow Engine  |                   |
|  |  Manager          |    |  (Graph Ops)      |                   |
|  +--------+----------+    +--------+----------+                   |
|           |                        |                              |
|           +------------------------+                              |
|                        |                                          |
|              +---------+---------+                                |
|              |   LLM Gateway     |                                |
|              |   (Structured Out)|                                |
|              +---------+---------+                                |
|                        |                                          |
|  +-------------------+ | +-------------------+                    |
|  |  Checkpoint Store | | |  Workflow Store   |                    |
|  |  (State History)  | | |  (Persistence)    |                    |
|  +-------------------+ | +-------------------+                    |
|                        |                                          |
+------------------------------------------------------------------+
                         |
                         | LLM API
                         |
+------------------------------------------------------------------+
|                    LLM PROVIDERS                                  |
|  +---------------+  +---------------+  +---------------+          |
|  | OpenAI        |  | Anthropic     |  | Local (Ollama)|          |
|  +---------------+  +---------------+  +---------------+          |
+------------------------------------------------------------------+
```

### Key Technology Choices

| Component | Recommended Technology | Rationale |
|-----------|----------------------|-----------|
| Canvas | React Flow | Mature, performant, customizable |
| State Management | Zustand | Simple, TypeScript-friendly |
| Real-time Sync | WebSocket/SSE | Low-latency bidirectional |
| LLM Integration | LangChain or custom SDK | Structured output support |
| Persistence | PostgreSQL + Redis | Reliable + fast caching |
| Checkpoints | Event Sourcing | Complete history, replay |

### Data Flow

```
User Input (Chat)
      |
      v
Intent Parser (LLM)
      |
      v
Operation Generator (Structured Output)
      |
      v
Validator (Schema + Business Rules)
      |
      v
Preview Renderer (Overlay Layer)
      |
      v
User Approval
      |
      v
Checkpoint Creation
      |
      v
Operation Executor
      |
      v
State Synchronizer
      |
      v
UI Update (Canvas + Chat)
```

### Security Considerations

1. **Input Sanitization**: Validate all user inputs before LLM processing
2. **Output Validation**: Schema validation on all LLM outputs
3. **Rate Limiting**: Prevent abuse of LLM API calls
4. **Checkpoint Access**: User-scoped checkpoint access only
5. **Operation Limits**: Max nodes/edges per workflow
6. **Audit Logging**: Track all operations for debugging

---

## 10. Sources (Validated)

### Primary Sources (Validated)

1. [CC-WF-Studio GitHub](https://github.com/breaking-brake/cc-wf-studio) - Conversational workflow refinement, node types, and storage format
2. [BMAD Method GitHub](https://github.com/bmad-code-org/BMAD-METHOD) - BMB workflow structure and step processing rules
3. [LangGraph GitHub](https://github.com/langchain-ai/langgraph) - State graph primitives and checkpointing
4. [Cursor Changelog 2.0](https://cursor.com/changelog/2-0) - Multi‑agent editor features and code review improvements
5. [GitHub Copilot Workspace](https://githubnext.com/projects/copilot-workspace) - Spec/plan/implement workflow and preview sunset notice
6. [Vercel v0 Blog](https://vercel.com/blog/how-we-made-v0-an-effective-coding-agent) - Agentic pipeline, autofixers, and intent detection
7. [n8n AI Workflow Builder Docs](https://docs.n8n.io/advanced-ai/ai-workflow-builder/) - Natural‑language workflow creation/refinement

### Documentation (Validated via Context7)

8. [LangGraph Documentation](https://www.langchain.com/langgraph) - StateGraph, reducers, and checkpointing (e.g., `InMemorySaver`)

### UX Pattern Resources (Validated)

9. [NN/g: Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/) - Progressive disclosure guideline
10. [The Shape of AI](https://www.shapeof.ai/) - AI UX pattern catalog (wayfinders, examples, suggestions)
11. [Smashing Magazine: AI Interface Patterns](https://www.smashingmagazine.com/2025/07/design-patterns-ai-interfaces/) - Prompt guidance and output presentation patterns
12. [OpenAI: ChatGPT Canvas](https://help.openai.com/en/articles/9930697-what-is-the-canvas-feature-in-chatgpt-and-how-do-i-use-it) - Split‑view canvas interaction model

### State Management and Rollback (Validated)

13. [Replit Agent Checkpoints](https://docs.replit.com/replitai/checkpoints-and-rollbacks) - Workspace checkpoint and rollback

### Research Papers (Validated)

14. [ECLAIR (Adobe Research)](https://research.adobe.com/publication/eclair-enhancing-clarification-for-interactive-responses-to-ambiguous-user-requests/) - Clarification for ambiguous queries
15. [ArXiv 2501.15167](http://arxiv.org/abs/2501.15167v1) - Ambiguous prompt understanding and co‑adaptation

---

## Appendix A: Prompt Engineering Examples

### Example 1: Node Creation Prompt

```markdown
Create a new LLM node that:
- Analyzes customer sentiment
- Takes text input
- Outputs: positive, negative, or neutral
- Connect it after the "Input" node
```

**Expected Structured Output:**

```json
{
  "operations": [
    {
      "type": "create",
      "nodeType": "llm",
      "name": "Sentiment Analyzer",
      "config": {
        "model": "gpt-4",
        "systemPrompt": "Analyze the sentiment of the following text...",
        "outputSchema": {
          "type": "enum",
          "values": ["positive", "negative", "neutral"]
        }
      },
      "connectFrom": ["input-node-id"]
    }
  ],
  "explanation": "Creating a sentiment analysis LLM node...",
  "preview": true,
  "confidence": 0.92
}
```

### Example 2: Conditional Logic Prompt

```markdown
Add error handling: if the API call fails, retry 3 times, then send alert
```

**Expected Structured Output:**

```json
{
  "operations": [
    {
      "type": "modify",
      "nodeId": "api-call-node",
      "changes": {
        "errorHandling": {
          "retry": { "count": 3, "delay": 1000 }
        }
      }
    },
    {
      "type": "create",
      "nodeType": "conditional",
      "name": "Check API Success",
      "config": {
        "condition": "{{api-call-node.success}} === false && {{api-call-node.retryCount}} >= 3"
      },
      "connectFrom": ["api-call-node"]
    },
    {
      "type": "create",
      "nodeType": "tool",
      "name": "Send Alert",
      "config": {
        "tool": "slack-notification",
        "params": { "channel": "#alerts", "message": "API failed after 3 retries" }
      },
      "connectFrom": ["check-api-success:false"]
    }
  ],
  "explanation": "Adding retry logic and failure alerting...",
  "preview": true,
  "confidence": 0.88
}
```

---

## Appendix B: ASCII Wireframes

### Main Interface Layout

```
+============================================================================+
|  [Logo] Hyyve Workflow Builder                [Save] [Run] [Export]  |
+============================================================================+
|                           |                                                |
|  CONVERSATION PANEL       |  VISUAL CANVAS                                 |
|  +-----------------------+|  +------------------------------------------+  |
|  | System: Welcome!      ||  |                                          |  |
|  | What would you like   ||  |    +--------+                            |  |
|  | to build today?       ||  |    | START  |                            |  |
|  +-----------------------+|  |    +---+----+                            |  |
|  +-----------------------+|  |        |                                 |  |
|  | User: Create a        ||  |        v                                 |  |
|  | customer feedback     ||  |    +--------+     +--------+             |  |
|  | analysis workflow     ||  |    | INPUT  |---->| LLM    |             |  |
|  +-----------------------+|  |    +--------+     +---+----+             |  |
|  +-----------------------+|  |                       |                  |  |
|  | AI: I'll create a     ||  |        +--------------+                  |  |
|  | workflow with these   ||  |        |              |                  |  |
|  | components:           ||  |        v              v                  |  |
|  | 1. Input collector    ||  |   +---------+   +---------+              |  |
|  | 2. Sentiment analyzer ||  |   |POSITIVE |   |NEGATIVE |              |  |
|  | 3. Categorizer        ||  |   +----+----+   +----+----+              |  |
|  | 4. Output router      ||  |        |              |                  |  |
|  |                       ||  |        +------+-------+                  |  |
|  | [Preview] [Apply]     ||  |               |                          |  |
|  +-----------------------+|  |               v                          |  |
|  +-----------------------+|  |          +--------+                      |  |
|  | Suggestions:          ||  |          | OUTPUT |                      |  |
|  | [+Error handling]     ||  |          +--------+                      |  |
|  | [+Notifications]      ||  |                                          |  |
|  | [+Data storage]       ||  +------------------------------------------+  |
|  +-----------------------+|                                                |
|  +-----------------------+|  NODE INSPECTOR                                |
|  | Type your message...  ||  +------------------------------------------+  |
|  | [_______________][Go] ||  | Selected: LLM Node                       |  |
|  +-----------------------+|  | Model: gpt-4          [Change]           |  |
|                           |  | Prompt: Analyze...    [Edit]             |  |
|                           |  | Temperature: 0.7      [====o===]         |  |
|                           |  +------------------------------------------+  |
+============================================================================+
```

### Preview Mode

```
+============================================================================+
|  PREVIEW MODE - Review changes before applying                             |
+============================================================================+
|                                                                            |
|  Changes to apply:                                                         |
|  +------------------------------------------------------------------------+
|  | 1. [CREATE] Error Handler node                                         |
|  |    - Type: Conditional                                                 |
|  |    - Connected after: API Call                                         |
|  +------------------------------------------------------------------------+
|  | 2. [CREATE] Alert Sender node                                          |
|  |    - Type: Tool (Slack)                                                |
|  |    - Connected to: Error Handler (false branch)                        |
|  +------------------------------------------------------------------------+
|  | 3. [MODIFY] API Call node                                              |
|  |    - Added: retry logic (3 attempts)                                   |
|  +------------------------------------------------------------------------+
|                                                                            |
|  Visual Preview:                                                           |
|  +------------------------------------------------------------------------+
|  |                                                                        |
|  |      +----------+          +-------------+                             |
|  |      | API Call |--------->| [NEW]       |                             |
|  |      | [MOD]    |   +----->| Error Check |                             |
|  |      +----------+   |      +------+------+                             |
|  |         retry: 3    |             |                                    |
|  |                     |      +------+------+                             |
|  |                     |      |             |                             |
|  |                     |      v             v                             |
|  |                     | +--------+   +--------+                          |
|  |                     | |Continue|   | [NEW]  |                          |
|  |                     | +--------+   | Alert  |                          |
|  |                     |              +--------+                          |
|  +------------------------------------------------------------------------+
|                                                                            |
|  [Apply Changes]  [Modify]  [Cancel]                                       |
+============================================================================+
```

---

*Document generated: January 20, 2026*
*Research conducted for: Hyyve Platform Development*
