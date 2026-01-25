# Technical Research: Visual Workflow Builder Patterns for Hyyve Platform

**Research Date:** 2026-01-20
**Status:** Verified (2026-01-21)
**Research Focus:** Visual node-based workflow editors for AI agent orchestration
**Target:** Dify-style visual clarity + conversational building (CC-WF-Studio approach)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Dify Workflow Builder Deep Dive](#dify-workflow-builder-deep-dive)
3. [n8n Workflow Patterns](#n8n-workflow-patterns)
4. [Flowise Patterns (LLM-Specific)](#flowise-patterns-llm-specific)
5. [Graph Rendering Libraries](#graph-rendering-libraries)
6. [Node Type Taxonomy for AI Workflows](#node-type-taxonomy-for-ai-workflows)
7. [Data Flow Patterns](#data-flow-patterns)
8. [Bidirectional Sync Patterns](#bidirectional-sync-patterns)
9. [Platform Comparison Matrix](#platform-comparison-matrix)
10. [Architecture Recommendations](#architecture-recommendations)
11. [References](#references)

---

## Executive Summary

This research examines leading visual workflow builder platforms (Dify, n8n, Flowise) and graph rendering libraries (ReactFlow/XYFlow) to inform the architecture of an Hyyve platform with visual workflow capabilities.

### Key Findings

| Aspect | Recommendation |
|--------|----------------|
| **Graph Library** | ReactFlow in Dify/Flowise; Vue Flow in n8n (validated via repo inspection) |
| **State Management** | Dify uses Zustand; n8n uses Pinia; Flowise uses React state/context (validated for Dify/n8n, Flowise UI stack) |
| **Node Architecture** | Platform-specific type systems: Dify `NodeType/BlockEnum`, n8n `INodeType`, Flowise `INode` classes (validated) |
| **Data Flow** | Dify backend uses a `VariablePool`; n8n uses item-based execution; Flowise uses per-flow execution context (validated at high level) |
| **Execution Model** | Dify uses a queue-based graph engine; Flowise splits chatflow vs agentflow executors (validated); n8n runs item-based `execute()` pipelines |
| **Bidirectional Sync** | Recommendation: graph-first with code export; true bidirectional sync remains complex (design guidance) |

### Validation Notes (2026-01-21)

Validated using DeepWiki (repo-level indexing) and Context7 (XYFlow/React Flow docs).

- **Validated**: Dify UI path (`web/app/components/workflow/`), ReactFlow usage, Zustand stores; Dify backend `GraphEngine` + `VariablePool`; Dify `NodeType/BlockEnum`.
- **Validated**: n8n editor uses Vue Flow (`@vue-flow/core`) and Pinia stores.
- **Validated**: Flowise UI uses ReactFlow and Material-UI; Flowise executors are `executeFlow` (chatflow) and `executeAgentFlow` (agentflow).
- **Validated**: React Flow APIs (`useReactFlow`, `fitView`, `setViewport`, `setCenter`), `isValidConnection`, and `connectionMode="loose"` example.
- **Validated**: Dify variable selector syntax (`VariablePool.get` / `convert_template`) and variable pool fields.
- **Validated**: n8n `INodeExecutionData` structure and expression syntax via `WorkflowDataProxy` and tutorials.
- **Unverified/Adjusted**: Exact node counts, execution pause/resume channels, and several UI/engine internals were removed.

---

## Dify Workflow Builder Deep Dive

**Validated anchors (DeepWiki):**
- UI workflow builder lives under `web/app/components/workflow/` and uses ReactFlow with Zustand stores.
- Backend workflow execution uses a queue-driven `GraphEngine` and a `VariablePool`.
- `VariablePool` fields and selector syntax (`{{#node.var#}}`) live in `api/core/workflow/runtime/variable_pool.py`.
- Node types are defined in backend `NodeType` and mirrored in frontend `BlockEnum`.

### Architecture Overview

Dify implements a graph-based workflow system using ReactFlow for the visual canvas with a queue-based backend graph engine (ready queue + worker pool).

```
┌─────────────────────────────────────────────────────────────────┐
│                        DIFY ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   ReactFlow  │    │   Zustand    │    │ Workflow API │      │
│  │    Canvas    │◄──►│    Stores    │◄──►│  Persistence │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         │                   │                    │              │
│         ▼                   ▼                    ▼              │
│  ┌─────────────────────────────────────────────────────┐       │
│  │              WORKFLOW STATE MANAGEMENT              │       │
│  │  • Workflow store (app, variables, draft state)     │       │
│  │  • UI store (canvas dimensions, panels)             │       │
│  │  • History store/provider (undo/redo)               │       │
│  └─────────────────────────────────────────────────────┘       │
│                            │                                    │
│                            ▼                                    │
│  ┌─────────────────────────────────────────────────────┐       │
│  │                 BACKEND EXECUTION                    │       │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐             │       │
│  │  │  Graph  │  │Variable │  │  Event  │             │       │
│  │  │ Engine  │  │  Pool   │  │ Queue   │             │       │
│  │  └────┬────┘  └────┬────┘  └────┬────┘             │       │
│  │       │            │            │                   │       │
│  │       ▼            ▼            ▼                   │       │
│  │  ┌─────────────────────────────────────────┐       │       │
│  │  │           WORKER RUNTIME                │       │       │
│  │  │  • Node execution                       │       │       │
│  │  │  • Worker pool (queue-driven)           │       │       │
│  │  │  • Event dispatch                       │       │       │
│  │  └─────────────────────────────────────────┘       │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Node Types Available

Based on Dify's backend `NodeType` enum and frontend `BlockEnum` (non-exhaustive, grouped for readability):

#### Trigger/Input Nodes
| Node Type | Description | Key Properties |
|-----------|-------------|----------------|
| **Start** | Initial workflow parameters | Input variables definition |
| **Plugin Trigger** | External plugin activation | Plugin configuration |
| **Schedule Trigger** | Time-based execution | Cron expression, timezone |
| **Webhook Trigger** | HTTP endpoint trigger | URL, authentication |
| **Human Input** | Wait for user input | Prompt, validation |

#### Processing Nodes
| Node Type | Description | Key Properties |
|-----------|-------------|----------------|
| **LLM** | Large language model invocation | Model selection, prompt, temperature |
| **Agent** | Autonomous LLM with tools | Tools, memory, reasoning mode |
| **Knowledge Retrieval** | RAG query execution | Knowledge base, query, top-k |
| **Knowledge Index** | Index/build KB | Source, chunking |
| **Datasource** | Connect external data | Source config |
| **Code** | Python/NodeJS execution | Language, code, dependencies |
| **Template Transform** | Template rendering | Template string, variables |
| **HTTP Request** | External API calls | Method, URL, headers, body |
| **Doc Extractor** | Document parsing | File input, output format |
| **Parameter Extractor** | LLM-based structured extraction | Schema definition |
| **Tool** | External tool invocation | Tool definition, parameters |

#### Logic/Control Nodes
| Node Type | Description | Key Properties |
|-----------|-------------|----------------|
| **If/Else** | Conditional branching | Conditions, comparison operators |
| **Question Classifier** | LLM-based classification | Categories, routing rules |
| **Iteration** | Loop over array items | Input array, item variable |
| **Loop** | Condition-based looping | Max iterations, exit condition |
| **Variable Assigner** | Variable mutation | Target variable, operation |
| **Variable Aggregator** | Multi-branch merge | Input variables, aggregation |
| **List Operator** | Array manipulation | Filter, sort, transform |

#### Output Nodes
| Node Type | Description | Key Properties |
|-----------|-------------|----------------|
| **End** | Workflow completion | Output variables, result type |
| **Answer** | Chat response generation | Response content, streaming |

### Custom Node Component Structure (Illustrative)

The actual node components live under `web/app/components/workflow/nodes/`, and the workflow entry registers custom node types with ReactFlow. The exact prop shape varies by node; the sketch below is conceptual and should be confirmed against the current codebase.

```typescript
// Illustrative pattern (confirm exact types in repo)
interface CustomNodeProps {
  id: string;
  data: {
    type: BlockEnum;   // Node type identifier
    title: string;
    desc?: string;
    [key: string]: any;
  };
}

const nodeTypes = {
  custom: CustomNode,
  // ...other custom node variants
};

const CustomNode: FC<CustomNodeProps> = ({ id, data }) => {
  const NodeComponent = NodeComponentMap[data.type];
  return <NodeComponent id={id} data={data} />;
};
```

### Variable System

Dify's backend uses a `VariablePool` (`api/core/workflow/runtime/variable_pool.py`) as the central variable store. It maintains a `variable_dictionary` keyed by node id and variable name, plus explicit fields for user/system/environment/conversation/RAG pipeline variables.

```typescript
// Validated fields (VariablePool BaseModel)
interface VariablePool {
  variable_dictionary: Map<string, Map<string, Variable>>;
  user_inputs: Record<string, unknown>;
  system_variables: SystemVariable;
  environment_variables: Variable[];
  conversation_variables: Variable[];
  rag_pipeline_variables: RAGPipelineVariableInput[];
}
```

**Selector syntax (validated in `VariablePool.get` + `convert_template`):**

- Base selector: `[node_id, variable_name]`
- Nested selector: `[node_id, variable_name, attr, ...]`
- Template form: `{{#node.variable#}}` or `{{#node.object.key#}}` (dot-separated)

### Execution Model (Queue-Based Graph Engine)

```
┌─────────────────────────────────────────────────────────────┐
│                    EXECUTION FLOW                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. GRAPH PARSING                                           │
│     ┌─────────┐                                             │
│     │  START  │──► Parse DAG ──► Build execution order      │
│     └─────────┘                                             │
│                                                             │
│  2. VARIABLE INITIALIZATION                                 │
│     • System variables injected                             │
│     • User inputs mapped to variable pool                   │
│     • Environment variables loaded                          │
│                                                             │
│  3. NODE EXECUTION (Ready Queue + Workers)                  │
│     ┌────────────────────────────────────────────┐         │
│     │  while (pending_nodes) {                   │         │
│     │    node = queue.dequeue();                 │         │
│     │    inputs = resolve_variables(node);       │         │
│     │    outputs = execute_node(node, inputs);   │         │
│     │    variable_pool.set(node.id, outputs);    │         │
│     │    emit_event(node_completed);             │         │
│     │    enqueue_successors(node);               │         │
│     │  }                                         │         │
│     └────────────────────────────────────────────┘         │
│                                                             │
│  4. PARALLEL EXECUTION                                      │
│     • Independent branches execute concurrently             │
│     • Variable Aggregator merges parallel outputs           │
│                                                             │
│  5. EVENT DISPATCH                                           │
│     • Emit node-completed events                            │
│     • Update execution state                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## n8n Workflow Patterns

**Validated anchors (DeepWiki):**
- Canvas uses Vue Flow (`@vue-flow/core`) in `packages/frontend/editor-ui/src/app/workflow/Canvas.vue`.
- Pinia stores live under `packages/frontend/editor-ui/src/app/stores/`.
- Node types implement `INodeType` in `n8n-workflow`; node implementations live in `n8n-nodes-base` and `@n8n/nodes-langchain`.
- Connection validation uses `useNodeConnections.ts` and `useCanvasOperations.ts`.

### Architecture Overview

n8n uses Vue.js with Vue Flow for canvas rendering and Pinia for state management.

```
┌─────────────────────────────────────────────────────────────────┐
│                        N8N ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  Vue Flow    │    │    Pinia     │    │   History    │      │
│  │   Canvas     │◄──►│    Stores    │◄──►│    Store     │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────────────┐       │
│  │              NODE TYPE SYSTEM                        │       │
│  │  ┌─────────────────┐  ┌─────────────────┐           │       │
│  │  │ n8n-nodes-base  │  │ @n8n/nodes-     │           │       │
│  │  │  (core nodes)   │  │   langchain     │           │       │
│  │  └─────────────────┘  └─────────────────┘           │       │
│  └─────────────────────────────────────────────────────┘       │
│                            │                                    │
│                            ▼                                    │
│  ┌─────────────────────────────────────────────────────┐       │
│  │              EXECUTION ENGINE                        │       │
│  │  • IExecuteFunctions context                         │       │
│  │  • Credential resolution at runtime                  │       │
│  │  • Expression evaluation {{ }}                       │       │
│  │  • Item-based data flow                              │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Node Architecture

```typescript
// n8n Node Interface
interface INodeType {
  description: INodeTypeDescription;
  execute?(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
  supplyData?(this: ISupplyDataFunctions): Promise<SupplyData>;
}

interface INodeTypeDescription {
  displayName: string;
  name: string;
  group: string[];
  version: number;
  description: string;
  defaults: {
    name: string;
    color?: string;
  };
  inputs: string[];
  outputs: string[];
  properties: INodeProperties[];
  credentials?: INodeCredentialDescription[];
}

// Example node definition
const HttpRequestNode: INodeType = {
  description: {
    displayName: 'HTTP Request',
    name: 'httpRequest',
    group: ['input'],
    version: 1,
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'Method',
        name: 'method',
        type: 'options',
        options: [
          { name: 'GET', value: 'GET' },
          { name: 'POST', value: 'POST' },
          // ...
        ],
        default: 'GET',
      },
      {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        default: '',
        required: true,
      },
    ],
  },
  async execute() {
    const items = this.getInputData();
    // Process each item
    return [processedItems];
  },
};
```

### Execution Modes

Common in n8n, but specific trigger nodes and labels should be verified against current node catalog.

| Mode | Trigger | Use Case |
|------|---------|----------|
| **Manual** | User click in UI | Testing, one-off runs |
| **Webhook** | HTTP request to endpoint | API integrations, real-time |
| **Schedule** | Cron expression | Batch processing, reports |
| **Trigger Node** | External event | Email, file change, etc. |

### Branching and Merging

```
┌─────────────────────────────────────────────────────────────┐
│                 BRANCHING WITH SWITCH NODE                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    ┌─────────┐                              │
│                    │ Switch  │                              │
│                    │  Node   │                              │
│                    └────┬────┘                              │
│           ┌─────────────┼─────────────┐                     │
│           ▼             ▼             ▼                     │
│     ┌─────────┐   ┌─────────┐   ┌─────────┐                │
│     │ Case A  │   │ Case B  │   │ Default │                │
│     └────┬────┘   └────┬────┘   └────┬────┘                │
│          │             │             │                      │
│          └─────────────┼─────────────┘                      │
│                        ▼                                    │
│                  ┌─────────┐                                │
│                  │  Merge  │                                │
│                  │  Node   │                                │
│                  └─────────┘                                │
│                                                             │
│  Merge Modes:                                               │
│  • Append: Combine all items from branches                  │
│  • Merge by Index: Match items by position                  │
│  • Merge by Key: Match items by field value                 │
│  • Keep Matches: Only items that match across branches      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow Between Nodes

Execution is item-based: each node receives an array of `INodeExecutionData` and returns an array of items.

```typescript
// Validated structure (n8n-workflow interfaces)
interface INodeExecutionData {
  json: Record<string, any>;
  binary?: Record<string, N8nBinary>;
  pairedItem?: { item: number };
}
```

**Expression syntax (validated in `expressions_tutorial.json` + `WorkflowDataProxy`):**
- `{{ $json.field }}` for the current item’s JSON.
- `{{ $('Node Name').item.json.field }}` for a specific node’s current item.
- `{{ $('Node Name').all() }}` for all items from a node.

### Connection Validation (n8n Editor)

Canvas connection validation is implemented in the editor UI:

- `useNodeConnections.ts` provides `isValidConnection` (handle type/mode checks).
- `useCanvasOperations.ts` provides `isConnectionAllowed` (node existence, connection filters, etc.).
- `CanvasHandleRenderer.vue` uses these checks when drawing connections.

---

## Flowise Patterns (LLM-Specific)

**Validated anchors (DeepWiki):**
- ReactFlow used in `packages/ui/src/views/canvas/index.jsx` and agentflow canvases (e.g., `packages/ui/src/views/agentflowsv2/Canvas.jsx`).
- Material-UI (`@mui/*`) is the primary UI component library in `packages/ui/package.json`.
- Execution entry points include `executeFlow` (chatflows) and `executeAgentFlow` (agentflows) in server utils.

### Architecture Overview

Flowise is purpose-built for LLM workflows and uses ReactFlow for its canvas along with Material-UI for UI components.

```
┌─────────────────────────────────────────────────────────────────┐
│                     FLOWISE ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    CANVAS LAYER                          │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │  │
│  │  │  ReactFlow  │  │ Material-UI │  │  Node Types │      │  │
│  │  │   Canvas    │  │  Components │  │   Mapping   │      │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  EXECUTION ENGINES                       │  │
│  │                                                          │  │
│  │  ┌─────────────────────┐  ┌─────────────────────┐       │  │
│  │  │      CHATFLOW       │  │     AGENTFLOW       │       │  │
│  │  │  executeFlow()      │  │ executeAgentFlow()  │       │  │
│  │  │                     │  │                     │       │  │
│  │  │  • Standard flows   │  │  • Agentic flows    │       │  │
│  │  │  • Single-path      │  │  • Branch/loop      │       │  │
│  │  │  • UI-driven        │  │  • State handling   │       │  │
│  │  └─────────────────────┘  └─────────────────────┘       │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                 LLM/AGENT INTEGRATION                    │  │
│  │  • Node abstractions map to LLM tools/agents             │  │
│  │  • Execution context flows through node runtime          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Chatflow vs Agentflow Distinction (Validated at High Level)

- Flowise uses `executeFlow` (chatflow) for standard flows and `executeAgentFlow` (agentflow) for more complex/agentic flows.
- The exact type field values and runtime state shapes should be verified in current Flowise metadata schemas.

### Visual Node Categories (Illustrative)

The following category map is a conceptual taxonomy for LLM workflow builders and is not a verified list of Flowise nodes.

```
┌─────────────────────────────────────────────────────────────┐
│              FLOWISE NODE CATEGORIES                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  CHAT MODELS                    EMBEDDINGS                  │
│  ├─ OpenAI                      ├─ OpenAI Embeddings        │
│  ├─ Azure OpenAI                ├─ Cohere Embeddings        │
│  ├─ Anthropic Claude            ├─ HuggingFace              │
│  ├─ Google Gemini               └─ Local Embeddings         │
│  ├─ Ollama                                                  │
│  └─ Custom LLM                  VECTOR STORES               │
│                                 ├─ Pinecone                 │
│  AGENTS                         ├─ Weaviate                 │
│  ├─ Conversational Agent        ├─ Chroma                   │
│  ├─ OpenAI Functions Agent      ├─ Qdrant                   │
│  ├─ ReAct Agent                 └─ In-Memory                │
│  ├─ Plan-and-Execute                                        │
│  └─ Custom Agent                TOOLS                       │
│                                 ├─ Calculator               │
│  CHAINS                         ├─ Web Search               │
│  ├─ LLM Chain                   ├─ Code Interpreter         │
│  ├─ Conversation Chain          ├─ API Request              │
│  ├─ Retrieval QA Chain          ├─ Database Query           │
│  └─ SQL Database Chain          └─ Custom Tool              │
│                                                             │
│  MEMORY                         DOCUMENT LOADERS            │
│  ├─ Buffer Memory               ├─ PDF Loader               │
│  ├─ Buffer Window Memory        ├─ Web Scraper              │
│  ├─ Conversation Summary        ├─ File Loader              │
│  └─ Vector Store Memory         └─ API Loader               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Graph Rendering Libraries

**Validated anchors (Context7):**
- `@xyflow/react` exposes `useReactFlow` with viewport controls (`fitView`, `setViewport`, `setCenter`, `zoomTo`) and connection validation via `isValidConnection`.
- Custom nodes use `Handle` components and `NodeProps`.
- Core utilities are available in `@xyflow/system`.
- `connectionMode` prop is supported; docs show example usage with `connectionMode="loose"`.

### ReactFlow / XYFlow Architecture (Validated Summary)

XYFlow provides a framework-agnostic core (`@xyflow/system`) with shared helpers (pan/zoom, edge paths, dragging) used by React Flow and Svelte Flow.

### Node and Edge Types (Minimum Fields in Examples)

The docs show `Node` and `Edge` usage with minimal required fields. Additional optional fields exist but should be confirmed against the current type definitions.

```typescript
import type { Node, Edge } from '@xyflow/react';

const nodes: Node[] = [
  { id: '1', position: { x: 0, y: 0 }, data: {} },
];

const edges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
];
```

### Custom Node Implementation

```typescript
// Custom Node Component
interface NodeProps<T = any> {
  id: string;
  data: T;
  type?: string;
  selected?: boolean;
  isConnectable?: boolean;
  xPos: number;
  yPos: number;
  dragging: boolean;
  zIndex: number;
  positionAbsoluteX: number;
  positionAbsoluteY: number;
}

// Example custom node
const LLMNode: FC<NodeProps<LLMNodeData>> = ({ id, data, selected }) => {
  return (
    <div className={`llm-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} />

      <div className="node-header">
        <Icon name="brain" />
        <span>{data.label}</span>
      </div>

      <div className="node-content">
        <div className="model">{data.model}</div>
        <div className="temperature">T: {data.temperature}</div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

// Register custom nodes
const nodeTypes = {
  llm: LLMNode,
  code: CodeNode,
  condition: ConditionNode,
  // ...
};

// Usage
<ReactFlow
  nodes={nodes}
  edges={edges}
  nodeTypes={nodeTypes}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  onConnect={onConnect}
/>
```

### Handle System

```typescript
// Handle Component
<Handle
  type="source" | "target"
  position={Position.Top | Position.Right | Position.Bottom | Position.Left}
  id="optional-handle-id"
  isConnectable={true}
  isValidConnection={(connection) => {
    // Custom validation logic
    return connection.source !== connection.target;
  }}
  style={{ background: '#555' }}
/>

// Connection Validation (global)
const isValidConnection = useCallback((connection: Connection) => {
  // Prevent self-connections
  if (connection.source === connection.target) return false;

  // Type checking
  const sourceNode = nodes.find(n => n.id === connection.source);
  const targetNode = nodes.find(n => n.id === connection.target);

  return isCompatibleTypes(
    sourceNode?.data.outputType,
    targetNode?.data.inputType
  );
}, [nodes]);

// Docs show `connectionMode` prop; examples use "loose".
```

### Viewport and Pan/Zoom

The following illustrates typical React Flow viewport props and `useReactFlow` helpers; confirm availability in your installed version.

```typescript
// Viewport Control
interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

// ReactFlow viewport props
<ReactFlow
  // Initial viewport
  defaultViewport={{ x: 0, y: 0, zoom: 1 }}

  // Controlled viewport
  viewport={viewport}
  onViewportChange={setViewport}

  // Zoom constraints
  minZoom={0.1}
  maxZoom={4}

  // Pan constraints
  translateExtent={[[-1000, -1000], [1000, 1000]]}

  // Interaction controls
  zoomOnScroll={true}
  zoomOnPinch={true}
  zoomOnDoubleClick={true}
  panOnScroll={false}
  panOnDrag={true}

  // Fit view on init
  fitView
  fitViewOptions={{ padding: 0.2 }}
/>

// Programmatic control
const { zoomIn, zoomOut, fitView, setViewport, getViewport } = useReactFlow();

const centerOnNode = (nodeId: string) => {
  const node = getNode(nodeId);
  if (node) {
    setViewport({
      x: -node.position.x + window.innerWidth / 2,
      y: -node.position.y + window.innerHeight / 2,
      zoom: 1.5,
    }, { duration: 800 });
  }
};
```

### Undo/Redo (Validated Implementations)

- **Dify**: `useWorkflowHistory` hook + `useWorkflowHistoryStore` in `web/app/components/workflow/hooks/use-workflow-history.ts`. Integrated via `useNodesInteractions` and keyboard shortcuts in `use-shortcuts.ts`.
- **n8n**: `useHistoryStore` Pinia store in `packages/frontend/editor-ui/src/app/stores/` with command classes in `packages/frontend/editor-ui/src/app/models/history.ts`. Wired through `useCanvasOperations.ts` and `NodeView.vue` event bindings.

### Performance Optimization (Common Patterns)

These optimizations are typical for large graphs; confirm current React Flow API support in your version.

```typescript
// Large Graph Optimizations

// 1. Only render visible elements
<ReactFlow
  onlyRenderVisibleElements={true}  // Critical for large graphs
/>

// 2. Use lookup maps for O(1) access
const nodeLookup = useMemo(
  () => new Map(nodes.map(n => [n.id, n])),
  [nodes]
);

// 3. Memoize custom node components
const MemoizedLLMNode = memo(LLMNode, (prev, next) => {
  return prev.data === next.data && prev.selected === next.selected;
});

// 4. Batch state updates
const updateMultipleNodes = useCallback((updates: NodeUpdate[]) => {
  setNodes(nodes => {
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    updates.forEach(({ id, changes }) => {
      const node = nodeMap.get(id);
      if (node) {
        nodeMap.set(id, { ...node, ...changes });
      }
    });
    return Array.from(nodeMap.values());
  });
}, [setNodes]);

// 5. Virtualization for node lists in panels
import { FixedSizeList } from 'react-window';

const NodeList = ({ nodes }) => (
  <FixedSizeList
    height={400}
    itemCount={nodes.length}
    itemSize={50}
  >
    {({ index, style }) => (
      <div style={style}>{nodes[index].data.label}</div>
    )}
  </FixedSizeList>
);
```

---

## Node Type Taxonomy for AI Workflows

This section proposes a cross-platform taxonomy and is not a direct extraction from any single product.

### Complete Node Classification

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI WORKFLOW NODE TAXONOMY                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ══════════════════════════════════════════════════════════    │
│  TRIGGER / INPUT NODES                                          │
│  ══════════════════════════════════════════════════════════    │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Manual    │  │   Webhook   │  │  Schedule   │             │
│  │   Trigger   │  │   Trigger   │  │   Trigger   │             │
│  │             │  │             │  │             │             │
│  │ • UI button │  │ • HTTP POST │  │ • Cron expr │             │
│  │ • Test runs │  │ • API calls │  │ • Intervals │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │    User     │  │    File     │  │   Event     │             │
│  │   Input     │  │   Upload    │  │   Stream    │             │
│  │             │  │             │  │             │             │
│  │ • Text form │  │ • Documents │  │ • Kafka     │             │
│  │ • Variables │  │ • Images    │  │ • Websocket │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ══════════════════════════════════════════════════════════    │
│  AI / LLM PROCESSING NODES                                      │
│  ══════════════════════════════════════════════════════════    │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │     LLM     │  │    Agent    │  │    RAG      │             │
│  │   Invoke    │  │   Execute   │  │   Query     │             │
│  │             │  │             │  │             │             │
│  │ • Prompt    │  │ • Tools     │  │ • Retrieval │             │
│  │ • Model cfg │  │ • Memory    │  │ • Reranking │             │
│  │ • Streaming │  │ • Reasoning │  │ • Context   │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  Embedding  │  │  Classifier │  │  Extractor  │             │
│  │  Generate   │  │  (LLM-based)│  │  (Struct)   │             │
│  │             │  │             │  │             │             │
│  │ • Text→Vec  │  │ • Intent    │  │ • Entities  │             │
│  │ • Batch     │  │ • Sentiment │  │ • Schema    │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ══════════════════════════════════════════════════════════    │
│  DATA PROCESSING NODES                                          │
│  ══════════════════════════════════════════════════════════    │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │    Code     │  │  Template   │  │ Transform   │             │
│  │  Execution  │  │  Render     │  │   (JSON)    │             │
│  │             │  │             │  │             │             │
│  │ • Python    │  │ • Jinja2    │  │ • JMESPath  │             │
│  │ • Node.js   │  │ • Mustache  │  │ • JSONata   │             │
│  │ • Sandbox   │  │ • Variables │  │ • Mapping   │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  Document   │  │    List     │  │   Filter    │             │
│  │   Parser    │  │  Operator   │  │   / Sort    │             │
│  │             │  │             │  │             │             │
│  │ • PDF       │  │ • Map       │  │ • Conditions│             │
│  │ • HTML      │  │ • Reduce    │  │ • Order by  │             │
│  │ • Markdown  │  │ • Flatten   │  │ • Limit     │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ══════════════════════════════════════════════════════════    │
│  LOGIC / CONTROL FLOW NODES                                     │
│  ══════════════════════════════════════════════════════════    │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   If/Else   │  │   Switch    │  │   Router    │             │
│  │ Condition   │  │  (Multi)    │  │  (Dynamic)  │             │
│  │             │  │             │  │             │             │
│  │ • Binary    │  │ • Cases     │  │ • Rules     │             │
│  │ • Operators │  │ • Default   │  │ • LLM-based │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  Iteration  │  │    Loop     │  │  Parallel   │             │
│  │  (ForEach)  │  │   (While)   │  │   Branch    │             │
│  │             │  │             │  │             │             │
│  │ • Array in  │  │ • Condition │  │ • Fan-out   │             │
│  │ • Item var  │  │ • Max iters │  │ • Fan-in    │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Merge     │  │    Wait     │  │   Error     │             │
│  │  Branches   │  │   / Delay   │  │   Handler   │             │
│  │             │  │             │  │             │             │
│  │ • Combine   │  │ • Timeout   │  │ • Retry     │             │
│  │ • Aggregate │  │ • Condition │  │ • Fallback  │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ══════════════════════════════════════════════════════════    │
│  INTEGRATION NODES                                              │
│  ══════════════════════════════════════════════════════════    │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │    HTTP     │  │    MCP      │  │  Database   │             │
│  │   Request   │  │    Tool     │  │   Query     │             │
│  │             │  │             │  │             │             │
│  │ • REST API  │  │ • Protocol  │  │ • SQL       │             │
│  │ • GraphQL   │  │ • Tools     │  │ • NoSQL     │             │
│  │ • Headers   │  │ • Resources │  │ • Vector DB │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Storage   │  │   Queue     │  │  External   │             │
│  │   (Files)   │  │  Publish    │  │   Service   │             │
│  │             │  │             │  │             │             │
│  │ • S3        │  │ • Kafka     │  │ • Slack     │             │
│  │ • GCS       │  │ • RabbitMQ  │  │ • Email     │             │
│  │ • Local     │  │ • Redis     │  │ • SMS       │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ══════════════════════════════════════════════════════════    │
│  OUTPUT NODES                                                   │
│  ══════════════════════════════════════════════════════════    │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Answer    │  │    End      │  │   Webhook   │             │
│  │  Response   │  │   Output    │  │   Response  │             │
│  │             │  │             │  │             │             │
│  │ • Streaming │  │ • Variables │  │ • Status    │             │
│  │ • Chat      │  │ • Files     │  │ • Body      │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ══════════════════════════════════════════════════════════    │
│  MEMORY / STATE NODES                                           │
│  ══════════════════════════════════════════════════════════    │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  Variable   │  │  Variable   │  │   Memory    │             │
│  │  Assigner   │  │ Aggregator  │  │   Store     │             │
│  │             │  │             │  │             │             │
│  │ • Set       │  │ • Merge     │  │ • Buffer    │             │
│  │ • Append    │  │ • Branches  │  │ • Summary   │             │
│  │ • Clear     │  │ • Reduce    │  │ • Vector    │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Node Interface Specification

```typescript
// Universal Node Interface
interface WorkflowNode {
  // Identity
  id: string;
  type: NodeType;
  name: string;
  description?: string;

  // Position
  position: { x: number; y: number };

  // Configuration
  config: NodeConfig;

  // I/O Definition
  inputs: InputDefinition[];
  outputs: OutputDefinition[];

  // Execution metadata
  timeout?: number;
  retryPolicy?: RetryPolicy;

  // Visual
  icon?: string;
  color?: string;
}

interface InputDefinition {
  id: string;
  name: string;
  type: DataType;
  required: boolean;
  default?: any;
  description?: string;

  // For handle rendering
  position?: 'top' | 'left';
  maxConnections?: number;
}

interface OutputDefinition {
  id: string;
  name: string;
  type: DataType;
  description?: string;

  // For handle rendering
  position?: 'bottom' | 'right';
}

type DataType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array'
  | 'file'
  | 'embedding'
  | 'message'
  | 'any';
```

---

## Data Flow Patterns

Patterns below are synthesized from platform behaviors. Dify variable selectors and n8n item-based flow are validated; message-based flow is a generic LLM pattern.

### Pattern 1: Variable Pool (Dify)

```
┌─────────────────────────────────────────────────────────────┐
│                    VARIABLE POOL PATTERN                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  VARIABLE POOL                       │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │   │
│  │  │   System    │ │ Environment │ │ Conversation│    │   │
│  │  │  Variables  │ │  Variables  │ │  Variables  │    │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘    │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │            NODE OUTPUT VARIABLES             │   │   │
│  │  │  node_1: { text: "...", tokens: 150 }        │   │   │
│  │  │  node_2: { items: [...], count: 10 }         │   │   │
│  │  │  node_3: { result: {...} }                   │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                              │                              │
│         ┌────────────────────┼────────────────────┐        │
│         ▼                    ▼                    ▼        │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐ │
│  │   Node A    │      │   Node B    │      │   Node C    │ │
│  │             │      │             │      │             │ │
│  │ Reads:      │      │ Reads:      │      │ Reads:      │ │
│  │ • sys.user  │      │ • node_1.txt│      │ • node_2.*  │ │
│  │ • env.key   │      │ • env.model │      │ • conv.hist │ │
│  │             │      │             │      │             │ │
│  │ Writes:     │      │ Writes:     │      │ Writes:     │ │
│  │ → pool[A]   │      │ → pool[B]   │      │ → pool[C]   │ │
│  └─────────────┘      └─────────────┘      └─────────────┘ │
│                                                             │
│  Variable Reference Syntax (validated in Dify):            │
│  • Base selector: [node_id, variable_name]                 │
│  • Nested: [node_id, variable_name, attr, ...]             │
│  • Template: {{#node.variable#}} / {{#node.obj.key#}}       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Pattern 2: Item-Based Flow (n8n)

```
┌─────────────────────────────────────────────────────────────┐
│                   ITEM-BASED FLOW PATTERN                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Node A outputs:                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  [                                                    │  │
│  │    { json: { id: 1, name: "Alice" }, pairedItem: 0 }, │  │
│  │    { json: { id: 2, name: "Bob" }, pairedItem: 1 },   │  │
│  │    { json: { id: 3, name: "Carol" }, pairedItem: 2 }  │  │
│  │  ]                                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                              │                              │
│                              ▼                              │
│  Node B processes each item:                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  items.forEach(item => {                              │  │
│  │    const name = item.json.name;                       │  │
│  │    const result = await processName(name);            │  │
│  │    return { json: { ...item.json, result } };         │  │
│  │  });                                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                              │                              │
│                              ▼                              │
│  Expression access (validated in n8n):                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  {{ $json.name }}              → Current item's name  │  │
│  │  {{ $('Node A').item.json.id }} → Previous node item  │  │
│  │  {{ $('Node A').all() }}       → All items from node  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Key Characteristics:                                       │
│  • Each node processes array of items                       │
│  • Items maintain identity via pairedItem                   │
│  • Binary data attached per item                            │
│  • Expression language for dynamic access                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Pattern 3: Message-Based Flow (LLM Frameworks)

```
┌─────────────────────────────────────────────────────────────┐
│                  MESSAGE-BASED FLOW PATTERN                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    MESSAGE HISTORY                    │  │
│  │  [                                                    │  │
│  │    { role: 'system', content: 'You are...' },        │  │
│  │    { role: 'user', content: 'Hello' },               │  │
│  │    { role: 'assistant', content: 'Hi there!' },      │  │
│  │    { role: 'user', content: 'New question' }         │  │
│  │  ]                                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                              │                              │
│         ┌────────────────────┴────────────────────┐        │
│         ▼                                         ▼        │
│  ┌─────────────┐                          ┌─────────────┐  │
│  │   Memory    │                          │     LLM     │  │
│  │   Node      │                          │    Node     │  │
│  │             │                          │             │  │
│  │ • Stores    │                          │ Receives:   │  │
│  │   messages  │                          │ • Messages  │  │
│  │ • Retrieves │                          │ • Context   │  │
│  │   context   │                          │             │  │
│  │             │                          │ Outputs:    │  │
│  │ Types:      │                          │ • AIMessage │  │
│  │ • Buffer    │                          │ • Tokens    │  │
│  │ • Window    │                          │ • Metadata  │  │
│  │ • Summary   │                          │             │  │
│  └─────────────┘                          └─────────────┘  │
│                                                             │
│  Message schema varies by framework; confirm per SDK.        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Proposed Connection Type System (Internal Design)

The following is a proposed schema for our platform, not a reverse-engineered model from Dify/n8n/Flowise.

```typescript
// Connection Type Compatibility Matrix
const typeCompatibility: Record<DataType, DataType[]> = {
  'string': ['string', 'any'],
  'number': ['number', 'any'],
  'boolean': ['boolean', 'any'],
  'object': ['object', 'any'],
  'array': ['array', 'any'],
  'file': ['file', 'any'],
  'embedding': ['embedding', 'array', 'any'],
  'message': ['message', 'object', 'any'],
  'any': ['string', 'number', 'boolean', 'object', 'array', 'file', 'embedding', 'message', 'any'],
};

// Validation function
function validateConnection(
  sourceType: DataType,
  targetType: DataType
): { valid: boolean; coercion?: string } {
  if (typeCompatibility[sourceType].includes(targetType)) {
    return { valid: true };
  }

  // Check for coercible types
  if (sourceType === 'number' && targetType === 'string') {
    return { valid: true, coercion: 'toString()' };
  }

  return { valid: false };
}

// Handle-level validation
interface HandleDefinition {
  id: string;
  type: DataType;
  acceptsTypes?: DataType[];  // Override default compatibility
  maxConnections?: number;

  // Runtime validation
  validate?: (value: any) => boolean;
}
```

---

## Bidirectional Sync Patterns

### The Challenge

Maintaining consistency between three representations:
1. **Visual Graph** - Node positions, edges, visual state
2. **Configuration/State** - Node configs, variables, execution state
3. **Generated Code** - Executable workflow definition

### Pattern 1: Graph-First with Code Generation

```
┌─────────────────────────────────────────────────────────────┐
│              GRAPH-FIRST ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │               VISUAL CANVAS (Source of Truth)        │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │  Nodes: [{id, type, position, config}...]   │    │   │
│  │  │  Edges: [{source, target, handles}...]      │    │   │
│  │  │  Viewport: {x, y, zoom}                     │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
│                              │                              │
│              ┌───────────────┴───────────────┐             │
│              ▼                               ▼             │
│  ┌─────────────────────┐       ┌─────────────────────┐    │
│  │   Workflow JSON     │       │   Generated Code    │    │
│  │   (Persistence)     │       │   (Export/Debug)    │    │
│  │                     │       │                     │    │
│  │ {                   │       │ async function      │    │
│  │   nodes: [...],     │       │ workflow() {        │    │
│  │   edges: [...],     │       │   const start =     │    │
│  │   variables: {...}  │       │     await input();  │    │
│  │ }                   │       │   // ...            │    │
│  └─────────────────────┘       │ }                   │    │
│                                └─────────────────────┘    │
│                                                             │
│  Characteristics:                                           │
│  • Graph edits immediately reflected in JSON                │
│  • Code generation is one-way (read-only export)            │
│  • No code → graph reverse sync                             │
│  • Simpler to implement and maintain                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Pattern 2: True Bidirectional Sync

```
┌─────────────────────────────────────────────────────────────┐
│              BIDIRECTIONAL SYNC ARCHITECTURE                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────────┐        ┌────────────────┐              │
│  │  Visual Graph  │◄──────►│  Code Editor   │              │
│  │    (Canvas)    │        │    (Monaco)    │              │
│  └───────┬────────┘        └───────┬────────┘              │
│          │                         │                        │
│          └──────────┬──────────────┘                        │
│                     ▼                                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              ABSTRACT SYNTAX TREE (AST)              │   │
│  │         (Shared Canonical Representation)            │   │
│  │                                                      │   │
│  │  {                                                   │   │
│  │    type: 'Workflow',                                 │   │
│  │    nodes: [                                          │   │
│  │      { type: 'LLMNode', id: 'llm_1', config: {...} } │   │
│  │    ],                                                │   │
│  │    edges: [                                          │   │
│  │      { from: 'start', to: 'llm_1', ... }             │   │
│  │    ]                                                 │   │
│  │  }                                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                     │                                       │
│         ┌───────────┴───────────┐                          │
│         ▼                       ▼                          │
│  ┌─────────────┐         ┌─────────────┐                   │
│  │   Graph     │         │    Code     │                   │
│  │  Renderer   │         │  Generator  │                   │
│  │             │         │             │                   │
│  │ AST → Nodes │         │ AST → Code  │                   │
│  └─────────────┘         └─────────────┘                   │
│                                                             │
│  Sync Operations:                                           │
│  1. Graph Edit → Update AST → Regenerate Code              │
│  2. Code Edit → Parse to AST → Update Graph positions      │
│                                                             │
│  Challenges:                                                │
│  • Preserving layout when code changes                      │
│  • Handling syntax errors during code edit                  │
│  • Merge conflicts between representations                  │
│  • Performance of continuous parsing                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Pattern 3: Conversation-Driven with Visual Feedback

```
┌─────────────────────────────────────────────────────────────┐
│           CONVERSATIONAL WORKFLOW BUILDING                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  User: "Add an LLM node that summarizes the input"          │
│                     │                                       │
│                     ▼                                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  AI INTERPRETER                      │   │
│  │                                                      │   │
│  │  1. Parse intent: ADD_NODE                           │   │
│  │  2. Extract params:                                  │   │
│  │     - type: LLM                                      │   │
│  │     - purpose: summarization                         │   │
│  │     - connection: from input                         │   │
│  │  3. Generate operation:                              │   │
│  │     {                                                │   │
│  │       action: 'addNode',                             │   │
│  │       node: { type: 'llm', config: {...} },          │   │
│  │       connectFrom: 'input_node'                      │   │
│  │     }                                                │   │
│  └─────────────────────────────────────────────────────┘   │
│                     │                                       │
│                     ▼                                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │               OPERATION EXECUTOR                     │   │
│  │                                                      │   │
│  │  • Apply operation to graph state                    │   │
│  │  • Auto-layout new node                              │   │
│  │  • Create edge connections                           │   │
│  │  • Update visual canvas                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                     │                                       │
│                     ▼                                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              VISUAL CANVAS UPDATE                    │   │
│  │                                                      │   │
│  │  ┌─────────┐         ┌─────────┐                    │   │
│  │  │  Input  │────────►│   LLM   │ (NEW)              │   │
│  │  │  Node   │         │Summarize│                    │   │
│  │  └─────────┘         └─────────┘                    │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                     │                                       │
│                     ▼                                       │
│  AI: "I've added an LLM node configured for                 │
│       summarization, connected to your input."              │
│                                                             │
│  Bidirectional: User can also drag/edit in canvas,          │
│  and AI describes the changes conversationally              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Implementation: Vercel Workflow Builder Pattern

```typescript
// Workflow Definition (DSL)
interface WorkflowDefinition {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  variables: Record<string, VariableDefinition>;
}

// Code Generation API
// GET /api/workflows/{id}/generate-code
async function generateCode(workflow: WorkflowDefinition): Promise<string> {
  const imports = generateImports(workflow);
  const nodeCode = workflow.nodes.map(generateNodeCode).join('\n\n');
  const flowCode = generateFlowCode(workflow.edges);

  return `
"use workflow";

${imports}

export async function ${workflow.name}(input: WorkflowInput) {
  ${nodeCode}

  ${flowCode}
}
`;
}

// Generated code example
`
"use workflow";

import { llm, httpRequest, condition } from '@workflow/nodes';

export async function summarizeAndNotify(input: WorkflowInput) {
  // Node: llm_1
  const summary = await llm({
    model: 'gpt-4',
    prompt: \`Summarize: \${input.text}\`,
    temperature: 0.7,
  });

  // Node: condition_1
  if (summary.tokens > 100) {
    // Node: http_1
    await httpRequest({
      url: 'https://api.slack.com/notify',
      method: 'POST',
      body: { text: summary.text },
    });
  }

  return { summary: summary.text };
}
`;
```

---

## Platform Comparison Matrix (Validated Subset)

Only items validated via DeepWiki/Context7 are included here. All other cross-platform comparisons were removed to avoid unverified claims.

| Feature | Dify | n8n | Flowise |
|---------|------|-----|---------|
| **Graph Library** | ReactFlow | Vue Flow | ReactFlow |
| **State Management** | Zustand stores | Pinia stores | React state/context |
| **Node System** | `NodeType/BlockEnum` | `INodeType` interface | `INode` classes |

---

## Architecture Recommendations

### Recommended Stack for Hyyve Platform

```
┌─────────────────────────────────────────────────────────────────┐
│                RECOMMENDED ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRONTEND LAYER                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  React + TypeScript + TailwindCSS                        │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │   │
│  │  │  ReactFlow  │  │   Zustand   │  │   Monaco    │      │   │
│  │  │   Canvas    │  │   Stores    │  │   Editor    │      │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘      │   │
│  │                                                          │   │
│  │  Key Components:                                         │   │
│  │  • WorkflowCanvas - Main graph editor                    │   │
│  │  • NodePalette - Drag-and-drop node library              │   │
│  │  • PropertyPanel - Selected node configuration           │   │
│  │  • ConversationPanel - AI-assisted building              │   │
│  │  • VariableInspector - Variable pool visualization       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  STATE MANAGEMENT                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Zustand Stores (with Immer for immutability)            │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │   │
│  │  │  workflow-   │ │   ui-store   │ │  history-    │     │   │
│  │  │    store     │ │              │ │    store     │     │   │
│  │  │              │ │ • Panels     │ │              │     │   │
│  │  │ • Nodes      │ │ • Selection  │ │ • Undo stack │     │   │
│  │  │ • Edges      │ │ • Viewport   │ │ • Redo stack │     │   │
│  │  │ • Variables  │ │ • Modals     │ │ • Snapshots  │     │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  BACKEND LAYER                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Node.js/TypeScript (or Python for AI-heavy ops)         │   │
│  │                                                          │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │   │
│  │  │  Workflow    │ │  Execution   │ │  Integration │     │   │
│  │  │   Service    │ │   Engine     │ │   Layer      │     │   │
│  │  │              │ │              │ │              │     │   │
│  │  │ • CRUD       │ │ • Queue      │ │ • MCP Client │     │   │
│  │  │ • Validation │ │ • Workers    │ │ • LLM APIs   │     │   │
│  │  │ • Versioning │ │ • Events     │ │ • Vector DBs │     │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Node Registration System

```typescript
// Node Type Registry
interface NodeTypeDefinition {
  type: string;
  category: NodeCategory;
  displayName: string;
  description: string;
  icon: string | ReactComponent;
  color: string;

  // Schema definitions
  configSchema: JSONSchema;
  inputSchema: HandleSchema[];
  outputSchema: HandleSchema[];

  // Component references
  nodeComponent: ReactComponent;
  configComponent: ReactComponent;

  // Execution
  executor: NodeExecutor;

  // Validation
  validate?: (config: any) => ValidationResult;
}

// Registry
class NodeRegistry {
  private nodes: Map<string, NodeTypeDefinition> = new Map();

  register(definition: NodeTypeDefinition) {
    this.nodes.set(definition.type, definition);
  }

  get(type: string): NodeTypeDefinition | undefined {
    return this.nodes.get(type);
  }

  getByCategory(category: NodeCategory): NodeTypeDefinition[] {
    return Array.from(this.nodes.values())
      .filter(n => n.category === category);
  }
}

// Plugin system for custom nodes
interface NodePlugin {
  name: string;
  version: string;
  nodes: NodeTypeDefinition[];

  // Lifecycle hooks
  onRegister?: () => void;
  onUnregister?: () => void;
}

// Register built-in nodes
nodeRegistry.register({
  type: 'llm',
  category: 'ai',
  displayName: 'LLM',
  description: 'Invoke a large language model',
  icon: BrainIcon,
  color: '#8B5CF6',
  configSchema: {
    type: 'object',
    properties: {
      model: { type: 'string', enum: ['gpt-4', 'claude-3', 'gemini'] },
      prompt: { type: 'string' },
      temperature: { type: 'number', minimum: 0, maximum: 2 },
      maxTokens: { type: 'integer', minimum: 1 },
    },
    required: ['model', 'prompt'],
  },
  inputSchema: [
    { id: 'input', name: 'Input', type: 'string', required: true },
    { id: 'context', name: 'Context', type: 'object', required: false },
  ],
  outputSchema: [
    { id: 'text', name: 'Text', type: 'string' },
    { id: 'usage', name: 'Usage', type: 'object' },
  ],
  nodeComponent: LLMNodeComponent,
  configComponent: LLMConfigPanel,
  executor: llmExecutor,
});
```

### Conversational Building Integration

```typescript
// AI Workflow Assistant
interface WorkflowAssistant {
  // Interpret user intent
  interpretIntent(message: string, context: WorkflowContext): Promise<WorkflowOperation[]>;

  // Generate explanation of changes
  explainChanges(operations: WorkflowOperation[]): string;

  // Suggest next steps
  suggestNextSteps(workflow: Workflow): Suggestion[];
}

// Operation types
type WorkflowOperation =
  | { type: 'ADD_NODE'; node: Partial<WorkflowNode>; connectTo?: string }
  | { type: 'REMOVE_NODE'; nodeId: string }
  | { type: 'UPDATE_NODE'; nodeId: string; changes: Partial<NodeConfig> }
  | { type: 'ADD_EDGE'; edge: WorkflowEdge }
  | { type: 'REMOVE_EDGE'; edgeId: string }
  | { type: 'SET_VARIABLE'; name: string; value: any };

// Example conversation flow
const conversationFlow = `
User: "I want to build a RAG workflow"

AI: Interprets → [
  { type: 'ADD_NODE', node: { type: 'input', name: 'User Query' } },
  { type: 'ADD_NODE', node: { type: 'knowledge_retrieval', name: 'Search Docs' }, connectTo: 'input' },
  { type: 'ADD_NODE', node: { type: 'llm', name: 'Generate Answer' }, connectTo: 'knowledge_retrieval' },
  { type: 'ADD_NODE', node: { type: 'output', name: 'Response' }, connectTo: 'llm' }
]

AI: "I've created a basic RAG workflow with:
     1. User Query input
     2. Knowledge Retrieval from your docs
     3. LLM to generate an answer
     4. Response output

     Would you like to configure the knowledge base or customize the prompt?"
`;
```

### Key Implementation Guidelines

1. **Start with Graph-First Architecture**
   - Visual canvas as primary interface
   - JSON serialization for persistence
   - Code generation for export/debugging (not bidirectional)

2. **Use ReactFlow with Custom Node System**
   - Type-based node rendering
   - Plugin architecture for extensibility
   - Zustand for state management with undo/redo

3. **Implement Variable Pool Pattern**
   - Namespace-isolated variable storage
   - Type-safe variable references
   - Real-time variable inspection

4. **Queue-Based Execution Engine**
   - Distributed worker model
   - Event-driven progress updates
   - Command channel for control (pause/resume/stop)

5. **AI-Native Node Types**
   - First-class LLM, Agent, RAG nodes
   - Memory and context management built-in
   - MCP integration for tool access

6. **Conversational Building as Enhancement**
   - AI interprets natural language to operations
   - Visual canvas remains source of truth
   - Bidirectional: visual changes described conversationally

---

## References

### Primary Sources (Validated via DeepWiki/Context7)

- [Dify GitHub Repository](https://github.com/langgenius/dify) - Workflow builder implementation
- [n8n GitHub Repository](https://github.com/n8n-io/n8n) - Node system and execution engine
- [Flowise GitHub Repository](https://github.com/FlowiseAI/Flowise) - LLM workflow builder
- [ReactFlow Documentation](https://reactflow.dev) - Graph rendering library
- [XYFlow GitHub](https://github.com/xyflow/xyflow) - Core system architecture

---

*Document generated for Hyyve Platform development - Visual Workflow Builder research phase*
