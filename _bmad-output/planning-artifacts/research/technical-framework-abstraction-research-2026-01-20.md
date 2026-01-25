# Agent Framework Abstraction Layer: Technical Research Document

**Date**: 2026-01-20
**Verification Status**: Verified (2026-01-21)
**Research Topic**: Creating a Portable Intermediate Representation (IR) for Multi-Framework Agent Export
**Target Frameworks**: Claude Agent SDK, Agno, LangGraph, CrewAI

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Framework Comparison Deep Dive](#framework-comparison-deep-dive)
3. [Common Abstractions Matrix](#common-abstractions-matrix)
4. [Intermediate Representation (IR) Design](#intermediate-representation-ir-design)
5. [Code Generation Patterns](#code-generation-patterns)
6. [Framework-Specific Adapters](#framework-specific-adapters)
7. [Existing Multi-Framework Tools](#existing-multi-framework-tools)
8. [BMB to Framework Mapping](#bmb-to-framework-mapping)
9. [Validation and Testing](#validation-and-testing)
10. [Architecture Diagrams](#architecture-diagrams)
11. [Recommendations](#recommendations)
12. [Sources](#sources)

---

## Executive Summary

This research document provides a comprehensive analysis of agent framework abstractions to inform the design of a portable Intermediate Representation (IR) for the Hyyve platform. The goal is to enable users to create agents/workflows visually and export them to multiple agent frameworks.

### Key Findings

1. **Open Agent Specification (Agent Spec)** - A 2025 open-source spec (Oracle) that directly targets framework portability. It provides a JSON/YAML declarative format plus a Python SDK (PyAgentSpec), a reference runtime (WayFlow), and adapters for LangGraph and AutoGen. It is distinct from the unrelated agent-spec.org communication spec.

2. **Framework Convergence** - Despite different philosophies, all frameworks share common core concepts:
   - Agent definition (role, instructions, model)
   - Tool registration (function-based with JSON schema)
   - State/Memory management (persistence backends)
   - Workflow orchestration (sequential, parallel, conditional)

3. **Code Generation Maturity** - OpenAPI Generator and Prisma provide battle-tested patterns:
   - Template-based generation (Mustache/Handlebars)
   - Schema-first design with JSON Schema validation
   - Provider/adapter pattern for target-specific code

4. **LiteLLM Pattern** - Demonstrates successful multi-provider abstraction:
   - Unified interface with provider-specific transformers
   - `transform_request()` / `transform_response()` pattern
   - Feature detection and graceful degradation

---

## Framework Comparison Deep Dive

### 1. Claude Agent SDK (Anthropic Python SDK)

**Philosophy**: Tools-first, model-as-agent approach. The Claude model itself acts as the agent, extended through tools.

#### Core Abstractions

| Concept | Implementation | Notes |
|---------|----------------|-------|
| Agent | No explicit class | Model is the agent; capabilities via `tools` parameter |
| Tool | `@beta_tool` decorator or JSON schema dict | Function-based with automatic schema inference |
| Memory | Context Management (beta) | `context_management` parameter controls conversation pruning |
| State | Implicit via `messages` history | No explicit state object; managed through conversation |
| Orchestration | `tool_runner` method | Iterative tool execution loop |

#### Tool Definition Example

```python
# Function decorator approach
@beta_tool
def get_weather(location: str, units: Literal["c", "f"]) -> str:
    """Lookup the weather for a given city.

    Args:
        location: The city and state, e.g. San Francisco, CA
        units: Unit for the output, either 'c' for celsius or 'f' for fahrenheit
    """
    return json.dumps({"location": location, "temperature": "68F", "condition": "Sunny"})

# JSON schema approach
tool_definition = {
    "name": "get_stock_price",
    "description": "Get the current stock price for a ticker symbol.",
    "input_schema": {
        "type": "object",
        "properties": {
            "ticker": {"type": "string", "description": "Stock ticker symbol"}
        },
        "required": ["ticker"]
    }
}
```

#### Tool Runner Workflow

```python
runner = client.beta.messages.tool_runner(
    max_tokens=1024,
    messages=[{"role": "user", "content": "What's the weather in SF?"}],
    model="claude-3-7-sonnet-latest",
    tools=[get_weather]
)

for response in runner:
    # Automatic tool execution and result feeding
    print(response)
```

#### Context Management (Memory)

```python
response = client.beta.messages.create(
    model="claude-3-7-sonnet-latest",
    messages=messages,
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {"type": "input_tokens", "value": 50000},
                "keep": {"type": "tool_uses", "value": 0}
            }
        ]
    }
)
```

Sources: [Anthropic SDK Python tools](https://github.com/anthropics/anthropic-sdk-python/blob/main/tools.md), [Anthropic SDK Python API reference](https://github.com/anthropics/anthropic-sdk-python/blob/main/api.md)

#### Multi-Agent Orchestration

Claude SDK does not have first-class multi-agent support. Multi-agent patterns must be implemented manually:
- Separate tool_runner instances per "agent"
- Hand-off via explicit message passing
- No built-in coordination primitives

---

### 2. Agno Framework

**Philosophy**: Comprehensive agent framework with first-class Teams, Workflows, and persistent memory.

#### Core Abstractions

| Concept | Implementation | Notes |
|---------|----------------|-------|
| Agent | `Agent` class | Rich configuration: model, tools, db, instructions |
| Tool | `@tool` decorator or `Function.from_callable()` | Schema inferred from signature/docstring |
| Memory | DB-backed session/history + knowledge | Persistent storage across runs |
| State | Session state + database | Structured data persistence across runs |
| Orchestration | `Team` and `Workflow` classes | Native multi-agent support |

#### Agent Definition Example

```python
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.db.sqlite import SqliteDb
from agno.tools.decorator import tool

@tool
def get_weather(city: str) -> str:
    """Get the current weather for a city.

    Args:
        city: The name of the city
    """
    return f"The weather in {city} is sunny"

agent = Agent(
    name="Weather Agent",
    model=OpenAIChat(id="gpt-4o"),
    db=SqliteDb(db_file="agent.db"),
    tools=[get_weather],
    instructions="You are a helpful weather assistant",
    add_history_to_context=True,
    markdown=True
)

# Run with session persistence
agent.print_response("What's the weather in Paris?", session_id="user_123")
```

#### Multi-Agent Teams

```python
from agno.agent import Agent
from agno.team import Team

researcher = Agent(
    name="Researcher",
    role="Research specialist",
    model=OpenAIChat(id="gpt-4o"),
    tools=[DuckDuckGoTools()]
)

writer = Agent(
    name="Writer",
    role="Content writer",
    model=OpenAIChat(id="gpt-4o")
)

team = Team(
    name="Research Team",
    members=[researcher, writer],
    model=OpenAIChat(id="gpt-4o")  # Team lead model
)

team.print_response("Write an article about AI trends")
```

#### Workflow Definition

```python
from agno.workflow import Workflow

workflow = Workflow(
    name="Content Pipeline",
    steps=[
        research_team,       # Team
        data_preprocessor,   # Function
        content_agent,       # Agent
    ]
)

result = workflow.run(input="Create blog about AI")
```

#### Database Backends

- SQLite: `SqliteDb(db_file="path.db")`
- PostgreSQL: `PostgresDb(...)`
- MongoDB: `MongoDb(...)`
- Redis: `RedisDb(...)`
- DynamoDB: `DynamoDb(...)`
- Additional integrations exist (e.g., MySQL/SingleStore/Firestore/GCS JSON) depending on installed extras

Sources: [Agno Docs](https://docs.agno.com/), [Agno SQLite for Workflow](https://docs.agno.com/integrations/database/sqlite/usage/sqlite-for-workflow), [Agno Postgres for Team](https://docs.agno.com/integrations/database/postgres/usage/postgres-for-team)

---

### 3. LangGraph

**Philosophy**: Stateful workflow graphs with fine-grained control flow. Inspired by DAGs but with cycles.

#### Core Abstractions

| Concept | Implementation | Notes |
|---------|----------------|-------|
| Agent | Nodes in `StateGraph` | Functions or Runnables |
| Tool | `@tool` decorator + `ToolNode` | Executes tool calls with error handling and state injection |
| Memory | Graph state via checkpointing | Durable, resumable execution |
| State | `TypedDict` or Pydantic model | Explicit state schema |
| Orchestration | `StateGraph` with edges | Conditional routing, loops |

#### State Definition

```python
from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    current_step: str
    results: dict
```

#### Tool Definition

```python
from langchain_core.tools import tool
from langgraph.prebuilt import ToolNode, InjectedState

@tool
def calculator(a: int, b: int) -> int:
    """Add two numbers."""
    return a + b

@tool
def search_api(query: str) -> str:
    """Search the web for information."""
    return f"Results for: {query}"

# Tools with state injection
@tool
def context_tool(query: str, state: Annotated[dict, InjectedState]) -> str:
    """Tool that uses current state."""
    return f"Query: {query}, Messages: {len(state['messages'])}"

tool_node = ToolNode([calculator, search_api, context_tool])
```

#### StateGraph Definition

```python
from langgraph.graph import StateGraph, END

workflow = StateGraph(AgentState)

# Add nodes
workflow.add_node("agent", call_model)
workflow.add_node("tools", tool_node)

# Set entry point
workflow.set_entry_point("agent")

# Add conditional edges
def should_continue(state: AgentState) -> str:
    last_message = state["messages"][-1]
    if last_message.tool_calls:
        return "tools"
    return END

workflow.add_conditional_edges("agent", should_continue, {
    "tools": "tools",
    END: END
})

workflow.add_edge("tools", "agent")

# Compile and run
app = workflow.compile()
result = app.invoke({"messages": [HumanMessage("Calculate 2+3")]})
```

#### Pre-built ReAct Agent

```python
from langgraph.prebuilt import create_react_agent

graph = create_react_agent(
    "anthropic:claude-3-7-sonnet-latest",
    tools=[calculator, search_api],
    prompt="You are a helpful assistant"
)

result = graph.invoke({"messages": [("user", "What is 2+2?")]})
```

> Note: `create_react_agent` is provided in LangGraph prebuilt utilities and has been marked as deprecated/moved in recent LangGraph releases. Prefer the current LangGraph prebuilt APIs per the official docs when implementing adapters.

#### Checkpointing Options

```python
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.checkpoint.postgres import PostgresSaver

# In-memory (development)
memory_saver = InMemorySaver()
app = workflow.compile(checkpointer=memory_saver)

# PostgreSQL (production)
# Note: PostgresSaver is provided by the langgraph-checkpoint-postgres package.
postgres_saver = PostgresSaver.from_conn_string("postgresql://...")
postgres_saver.setup()  # Creates tables
app = workflow.compile(checkpointer=postgres_saver)
```

Sources: [LangGraph Docs](https://langchain-ai.github.io/langgraph/), [LangGraph Checkpoint Postgres](https://github.com/langchain-ai/langgraph/tree/main/libs/checkpoint-postgres)

---

### 4. CrewAI

**Philosophy**: Role-based collaboration with human-like agent organization. Emphasis on developer experience.

#### Core Abstractions

| Concept | Implementation | Notes |
|---------|----------------|-------|
| Agent | `Agent` class with role/goal/backstory | Human-readable configuration |
| Tool | `BaseTool` subclass or `@tool` decorator | Pydantic schema validation |
| Memory | Short/Long/Entity/External memory | ChromaDB + SQLite backed |
| State | Managed by `Crew` and `Flows` | Implicit state management |
| Orchestration | `Crew` with sequential/hierarchical process | Manager agent coordination |

#### Agent Definition

```python
from crewai import Agent
from crewai_tools import SerperDevTool

search_tool = SerperDevTool()

researcher = Agent(
    role='Research Analyst',
    goal='Provide up-to-date market analysis',
    backstory='An expert analyst with keen eye for market trends.',
    tools=[search_tool],
    memory=True,
    verbose=True,
    llm="gpt-4o",
    max_iter=25
)
```

#### YAML-Based Configuration

```yaml
# agents.yaml
researcher:
  role: Research Analyst
  goal: Provide up-to-date market analysis
  backstory: An expert analyst with keen eye for market trends.
  tools:
    - search_tool
  memory: true

writer:
  role: Content Writer
  goal: Create compelling content from research
  backstory: Experienced writer who transforms data into stories.
```

#### Tool Definition

```python
from crewai.tools import BaseTool, tool
from pydantic import BaseModel, Field
from typing import Type

# Decorator approach
@tool("Search Tool")
def search_web(query: str) -> str:
    """Search the web for information."""
    return f"Results for: {query}"

# Class-based approach
class CalculatorInput(BaseModel):
    a: int = Field(..., description="First number")
    b: int = Field(..., description="Second number")

class CalculatorTool(BaseTool):
    name: str = "Calculator"
    description: str = "Performs arithmetic operations"
    args_schema: Type[BaseModel] = CalculatorInput

    def _run(self, a: int, b: int) -> int:
        return a + b
```

#### Crew Definition

```python
from crewai import Crew, Task, Process

# Define tasks
research_task = Task(
    description="Research AI trends for 2026",
    expected_output="Comprehensive research report",
    agent=researcher
)

writing_task = Task(
    description="Write article based on research",
    expected_output="Polished article ready for publication",
    agent=writer
)

# Create crew
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task],
    process=Process.sequential,  # or Process.hierarchical
    memory=True,
    verbose=True
)

result = crew.kickoff()
```

#### Hierarchical Process

```python
from crewai import Crew, Process

crew = Crew(
    agents=[researcher, writer, editor],
    tasks=[research_task, writing_task, editing_task],
    process=Process.hierarchical,
    manager_llm="gpt-4o",  # Manager coordinates
    memory=True
)
```

#### Memory Types

```python
from crewai import Crew
from crewai.memory import ShortTermMemory, LongTermMemory, EntityMemory

crew = Crew(
    agents=[...],
    tasks=[...],
    memory=True,  # Enables default memory
    # Or explicit configuration:
    short_term_memory=ShortTermMemory(),  # RAG for current execution
    long_term_memory=LongTermMemory(),    # SQLite persistence
    entity_memory=EntityMemory()          # Entity tracking
)
```

Sources: [CrewAI Docs](https://docs.crewai.com/), [CrewAI Concepts: Tools](https://docs.crewai.com/concepts/tools), [CrewAI Concepts: Memory](https://docs.crewai.com/concepts/memory)

---

## Common Abstractions Matrix

### Agent Definition Comparison

| Feature | Claude SDK | Agno | LangGraph | CrewAI |
|---------|------------|------|-----------|--------|
| **Agent class** | None (model is agent) | `Agent` | Node function/Runnable | `Agent` |
| **Role/persona** | System prompt | `instructions` | Prompt template | `role` + `backstory` |
| **Goal specification** | System prompt | `instructions` | Prompt template | `goal` attribute |
| **Model selection** | `model` parameter | `model` object | Model object | `llm` parameter |
| **Tool assignment** | `tools` list | `tools` list | `ToolNode` | `tools` list |
| **Memory toggle** | `context_management` | `db` + flags | Checkpointer | `memory=True` |

### Tool Registration Comparison

| Feature | Claude SDK | Agno | LangGraph | CrewAI |
|---------|------------|------|-----------|--------|
| **Decorator** | `@beta_tool` | `@tool` | `@tool` | `@tool` |
| **Class-based** | JSON schema dict | `Function.from_callable()` | `BaseTool` | `BaseTool` subclass |
| **Schema format** | JSON Schema | Docstring-inferred | Docstring-inferred | Pydantic BaseModel |
| **Async support** | `@beta_async_tool` | Auto-detected | Supported | `async def _arun()` |
| **State injection** | N/A | N/A | `InjectedState` | N/A |

### Memory/State Comparison

| Feature | Claude SDK | Agno | LangGraph | CrewAI |
|---------|------------|------|-----------|--------|
| **State model** | Messages list | Session state | TypedDict/Pydantic | Implicit |
| **Persistence** | Manual | Database backends | Checkpointers | ChromaDB + SQLite |
| **Memory types** | Context window | Session/history + knowledge | Graph checkpoints | Short/Long/Entity/External |
| **Backends** | None built-in | SQLite, Postgres, Mongo, Redis, DynamoDB (plus optional extras) | Memory, Postgres | ChromaDB, SQLite |

### Orchestration Comparison

| Feature | Claude SDK | Agno | LangGraph | CrewAI |
|---------|------------|------|-----------|--------|
| **Sequential** | Manual loop | `Workflow.steps` | Linear edges | `Process.sequential` |
| **Parallel** | Manual async | Team execution | Fork nodes | Task dependencies |
| **Conditional** | Manual logic | Workflow logic | `add_conditional_edges` | Manager delegation |
| **Hierarchical** | N/A | Team with lead | Graph composition | `Process.hierarchical` |
| **Human-in-loop** | Manual | Supported | Built-in | Supported |

---

## Intermediate Representation (IR) Design

### Existing Standard: Open Agent Specification (Agent Spec)

A critical discovery in this research is the **Open Agent Specification (Agent Spec)**, an Oracle-led open-source spec published in 2025. It directly addresses the framework portability problem and should be seriously considered as the foundation for our IR.

#### Agent Spec Overview

- **Format**: JSON/YAML with JSON Schema validation
- **Philosophy**: Declarative, framework-agnostic configuration
- **Adapters**: LangGraph, WayFlow, and AutoGen (reference implementations)
- **SDKs/Runtimes**: PyAgentSpec (Python SDK) and WayFlow (reference runtime)
- **Note**: This is distinct from the separate agent-spec.org communication specification
- **Schema**: Use the versioned JSON Schema URL published in the official docs

#### Core Components

```
+------------------+
|   Agent Spec     |
+------------------+
        |
        v
+------------------+     +------------------+
|  Base Component  |---->|  Input/Output    |
|  (foundation)    |     |  JSON Schemas    |
+------------------+     +------------------+
        |
        +---> Agent Component (entry point, shared resources)
        |
        +---> LLM Component (model config, generation params)
        |
        +---> Tool Component (ServerTool, ClientTool, RemoteTool)
        |
        +---> Flow Component (workflow graph)
```

#### Agent Spec Schema Structure

```json
{
  "version": "1.0",
  "agent": {
    "id": "research-assistant",
    "name": "Research Assistant",
    "description": "An agent that researches topics",

    "llm": {
      "component_type": "llm",
      "model_id": "claude-3-7-sonnet-latest",
      "provider": "anthropic",
      "generation_params": {
        "temperature": 0.7,
        "max_tokens": 4096
      }
    },

    "tools": [
      {
        "component_type": "server_tool",
        "id": "web_search",
        "name": "Web Search",
        "description": "Search the web for information",
        "input_schema": {
          "type": "object",
          "properties": {
            "query": {"type": "string", "description": "Search query"}
          },
          "required": ["query"]
        },
        "output_schema": {
          "type": "object",
          "properties": {
            "results": {"type": "array", "items": {"type": "string"}}
          }
        }
      }
    ],

    "flow": {
      "component_type": "flow",
      "nodes": [
        {"id": "start", "type": "StartNode", "outputs": ["request"]},
        {"id": "agent", "type": "AgentNode", "llm_ref": "$component_ref:llm"},
        {"id": "tools", "type": "ToolNode", "tools": ["$component_ref:web_search"]},
        {"id": "end", "type": "EndNode"}
      ],
      "edges": [
        {"from": "start", "to": "agent", "type": "control"},
        {"from": "agent", "to": "tools", "type": "control", "condition": "has_tool_calls"},
        {"from": "tools", "to": "agent", "type": "control"},
        {"from": "agent", "to": "end", "type": "control", "condition": "no_tool_calls"}
      ]
    }
  }
}
```

Sources: [Open Agent Specification (Oracle GitHub)](https://github.com/oracle/agent-spec), [Open Agent Specification Docs](https://oracle.github.io/agent-spec/), [Open Agent Specification Technical Report](https://arxiv.org/html/2510.04173v1)

### Proposed Custom IR (if not using Agent Spec)

If Agent Spec doesn't meet all requirements, here's a proposed custom IR design:

#### IR Node Types

```typescript
// Core IR Types
interface IRDocument {
  version: string;
  metadata: IRMetadata;
  agents: IRAgent[];
  tools: IRTool[];
  workflows: IRWorkflow[];
  memory: IRMemoryConfig;
}

interface IRAgent {
  id: string;
  name: string;
  persona: {
    role: string;
    goal: string;
    backstory?: string;
    instructions: string;
  };
  model: IRModelConfig;
  tools: string[];  // Tool IDs
  memory: IRAgentMemory;
  capabilities: IRCapabilities;
}

interface IRTool {
  id: string;
  name: string;
  description: string;
  inputSchema: JSONSchema;
  outputSchema: JSONSchema;
  implementation: IRToolImplementation;
}

interface IRWorkflow {
  id: string;
  name: string;
  type: 'sequential' | 'parallel' | 'conditional' | 'graph';
  nodes: IRWorkflowNode[];
  edges: IRWorkflowEdge[];
  state: IRStateSchema;
}

interface IRWorkflowNode {
  id: string;
  type: 'agent' | 'tool' | 'condition' | 'fork' | 'join' | 'human';
  agentRef?: string;
  toolRef?: string;
  config: Record<string, unknown>;
}

interface IRWorkflowEdge {
  from: string;
  to: string;
  type: 'control' | 'data';
  condition?: IRCondition;
  dataMapping?: IRDataMapping;
}
```

#### IR Format Comparison

| Format | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| **JSON Schema** | Widely supported, validation tooling, human-readable | Verbose, limited expressiveness | **Recommended** |
| **Protocol Buffers** | Fast, compact, strong typing | Binary format, learning curve | For high-performance needs |
| **Custom AST** | Maximum flexibility | Maintenance burden, no tooling | Only if necessary |
| **YAML** | Human-friendly, JSON superset | Parsing quirks | JSON with YAML option |

### IR Schema Design Principles

1. **Minimal Core, Extensible Extensions**
   ```json
   {
     "core": { /* Required fields */ },
     "extensions": {
       "claude_sdk": { /* Claude-specific options */ },
       "langgraph": { /* LangGraph-specific options */ }
     }
   }
   ```

2. **Escape Hatches for Custom Code**
   ```json
   {
     "tool": {
       "id": "custom_tool",
       "implementation": {
         "type": "inline_code",
         "language": "python",
         "code": "def execute(input): return process(input)"
       }
     }
   }
   ```

3. **Version Compatibility**
   ```json
   {
     "version": "1.0",
     "minFrameworkVersions": {
       "claude_sdk": "0.30.0",
       "agno": "1.2.0",
       "langgraph": "0.3.0",
       "crewai": "0.80.0"
     }
   }
   ```

---

## Code Generation Patterns

### Pattern 1: Template-Based Generation (OpenAPI Generator Style)

**Architecture**:
```
IR Document --> Parser --> Data Model --> Template Engine --> Generated Code
                              |
                              v
                         Transformers
                         (per-framework)
```

**Implementation using Jinja2**:

```python
# Template: claude_agent.py.jinja2
from anthropic import Anthropic
from anthropic.beta.tools import beta_tool

client = Anthropic()

{% for tool in agent.tools %}
@beta_tool
def {{ tool.name }}({{ tool.parameters | format_params }}) -> str:
    """{{ tool.description }}

    Args:
        {% for param in tool.parameters %}
        {{ param.name }}: {{ param.description }}
        {% endfor %}
    """
    # TODO: Implement tool logic
    raise NotImplementedError()

{% endfor %}

def run_agent(user_message: str):
    runner = client.beta.messages.tool_runner(
        max_tokens={{ agent.model.max_tokens }},
        messages=[{"role": "user", "content": user_message}],
        model="{{ agent.model.id }}",
        tools=[{{ agent.tools | map(attribute='name') | join(', ') }}]
    )

    for response in runner:
        yield response
```

**Generator Implementation**:

```python
from jinja2 import Environment, FileSystemLoader
from pathlib import Path

class CodeGenerator:
    def __init__(self, template_dir: Path):
        self.env = Environment(loader=FileSystemLoader(template_dir))
        self.env.filters['format_params'] = self._format_params

    def generate(self, ir_document: IRDocument, target: str) -> dict[str, str]:
        """Generate code for target framework."""
        template = self.env.get_template(f"{target}/agent.py.jinja2")

        # Transform IR to framework-specific data model
        transformer = self._get_transformer(target)
        data_model = transformer.transform(ir_document)

        # Render template
        code = template.render(**data_model)

        return {"agent.py": code}

    def _get_transformer(self, target: str) -> IRTransformer:
        transformers = {
            "claude_sdk": ClaudeSDKTransformer(),
            "agno": AgnoTransformer(),
            "langgraph": LangGraphTransformer(),
            "crewai": CrewAITransformer(),
        }
        return transformers[target]
```

### Pattern 2: Prisma-Style Programmatic Generation

**Architecture**:
```
IR Document --> DMMF (Data Model Meta Format) --> Generator Classes --> Files
```

**Implementation**:

```python
class AgentFileGenerator:
    """Generates agent files programmatically (no templates)."""

    def __init__(self, ir: IRDocument):
        self.ir = ir

    def generate_claude_sdk(self) -> FileMap:
        files = FileMap()

        # Generate main agent file
        agent_code = self._generate_agent_class()
        files["agent.py"] = agent_code

        # Generate tool files
        for tool in self.ir.tools:
            tool_code = self._generate_tool(tool)
            files[f"tools/{tool.id}.py"] = tool_code

        return files

    def _generate_agent_class(self) -> str:
        lines = []
        lines.append("from anthropic import Anthropic")
        lines.append("from anthropic.beta.tools import beta_tool")
        lines.append("")
        lines.append("client = Anthropic()")
        lines.append("")

        # Generate tool imports
        for tool in self.ir.tools:
            lines.append(f"from tools.{tool.id} import {tool.name}")

        # Generate run function
        lines.append("")
        lines.append("def run_agent(message: str):")
        lines.append("    runner = client.beta.messages.tool_runner(")
        lines.append(f"        model=\"{self.ir.agents[0].model.id}\",")
        lines.append("        messages=[{\"role\": \"user\", \"content\": message}],")
        lines.append(f"        tools=[{', '.join(t.name for t in self.ir.tools)}]")
        lines.append("    )")
        lines.append("    return list(runner)")

        return "\n".join(lines)
```

### Pattern 3: Hybrid Approach (Recommended)

Combine templates for structure with programmatic generation for complex logic:

```python
class HybridGenerator:
    def __init__(self):
        self.template_engine = TemplateEngine()
        self.code_builder = CodeBuilder()

    def generate(self, ir: IRDocument, target: str) -> FileMap:
        # Use templates for boilerplate
        main_file = self.template_engine.render(
            f"{target}/main.py.jinja2",
            ir.to_dict()
        )

        # Use programmatic generation for complex logic
        workflow_code = self.code_builder.build_workflow(
            ir.workflows[0],
            target
        )

        return FileMap({
            "main.py": main_file,
            "workflow.py": workflow_code
        })
```

---

## Framework-Specific Adapters

### Adapter Pattern Implementation

```python
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import TypeVar, Generic

T = TypeVar('T')

@dataclass
class AdapterCapabilities:
    """Declares what features an adapter supports."""
    multi_agent: bool = False
    persistent_memory: bool = False
    streaming: bool = False
    human_in_loop: bool = False
    conditional_routing: bool = False
    parallel_execution: bool = False
    hierarchical_orchestration: bool = False

class FrameworkAdapter(ABC, Generic[T]):
    """Base adapter for framework code generation."""

    @property
    @abstractmethod
    def name(self) -> str:
        """Framework name."""
        pass

    @property
    @abstractmethod
    def capabilities(self) -> AdapterCapabilities:
        """Declare supported capabilities."""
        pass

    @abstractmethod
    def transform_agent(self, ir_agent: IRAgent) -> T:
        """Transform IR agent to framework-specific representation."""
        pass

    @abstractmethod
    def transform_tool(self, ir_tool: IRTool) -> T:
        """Transform IR tool to framework-specific representation."""
        pass

    @abstractmethod
    def transform_workflow(self, ir_workflow: IRWorkflow) -> T:
        """Transform IR workflow to framework-specific representation."""
        pass

    @abstractmethod
    def generate_code(self, ir: IRDocument) -> FileMap:
        """Generate complete code for the framework."""
        pass

    def validate_ir(self, ir: IRDocument) -> list[str]:
        """Validate IR against adapter capabilities."""
        warnings = []

        if ir.has_multi_agent and not self.capabilities.multi_agent:
            warnings.append(f"{self.name} does not support multi-agent. Will flatten to single agent.")

        if ir.has_persistent_memory and not self.capabilities.persistent_memory:
            warnings.append(f"{self.name} does not support persistent memory. Memory will be ephemeral.")

        return warnings
```

### Claude SDK Adapter

```python
class ClaudeSDKAdapter(FrameworkAdapter[dict]):
    @property
    def name(self) -> str:
        return "claude_sdk"

    @property
    def capabilities(self) -> AdapterCapabilities:
        return AdapterCapabilities(
            multi_agent=False,  # Must be implemented manually
            persistent_memory=False,  # Context management only
            streaming=True,
            human_in_loop=False,  # Manual implementation
            conditional_routing=False,  # Manual in tool_runner
            parallel_execution=False,
            hierarchical_orchestration=False
        )

    def transform_agent(self, ir_agent: IRAgent) -> dict:
        return {
            "system_prompt": self._build_system_prompt(ir_agent),
            "model": ir_agent.model.id,
            "max_tokens": ir_agent.model.max_tokens,
            "tools": [self.transform_tool(t) for t in ir_agent.tools]
        }

    def transform_tool(self, ir_tool: IRTool) -> dict:
        return {
            "name": ir_tool.name,
            "description": ir_tool.description,
            "input_schema": ir_tool.inputSchema
        }

    def generate_code(self, ir: IRDocument) -> FileMap:
        # Generate using templates
        return self.template_engine.render_all(ir, "claude_sdk")
```

### LangGraph Adapter

```python
class LangGraphAdapter(FrameworkAdapter[dict]):
    @property
    def name(self) -> str:
        return "langgraph"

    @property
    def capabilities(self) -> AdapterCapabilities:
        return AdapterCapabilities(
            multi_agent=True,
            persistent_memory=True,
            streaming=True,
            human_in_loop=True,
            conditional_routing=True,
            parallel_execution=True,
            hierarchical_orchestration=True
        )

    def transform_workflow(self, ir_workflow: IRWorkflow) -> dict:
        """Transform IR workflow to StateGraph definition."""
        state_schema = self._build_state_schema(ir_workflow.state)
        nodes = [self._transform_node(n) for n in ir_workflow.nodes]
        edges = [self._transform_edge(e) for e in ir_workflow.edges]

        return {
            "state_schema": state_schema,
            "nodes": nodes,
            "edges": edges,
            "entry_point": ir_workflow.nodes[0].id
        }

    def _transform_edge(self, edge: IRWorkflowEdge) -> dict:
        if edge.condition:
            return {
                "type": "conditional",
                "from": edge.from_node,
                "condition": self._build_condition(edge.condition),
                "mapping": edge.dataMapping
            }
        return {
            "type": "direct",
            "from": edge.from_node,
            "to": edge.to_node
        }
```

### Capability Matrix

| Capability | Claude SDK | Agno | LangGraph | CrewAI |
|------------|------------|------|-----------|--------|
| Multi-agent | Manual | Native | Native | Native |
| Persistent memory | Degraded | Native | Native | Native |
| Streaming | Native | Native | Native | Limited |
| Human-in-loop | Manual | Native | Native | Native |
| Conditional routing | Manual | Native | Native | Limited |
| Parallel execution | Manual | Native | Native | Native |
| Hierarchical | N/A | Native | Native | Native |

### Graceful Degradation Strategies

```python
class DegradationStrategy:
    """Handles missing capabilities."""

    @staticmethod
    def flatten_multi_agent(ir: IRDocument, target: str) -> IRDocument:
        """Flatten multi-agent workflow to single agent with tools."""
        if len(ir.agents) <= 1:
            return ir

        # Merge all agents into primary agent
        primary = ir.agents[0]
        for agent in ir.agents[1:]:
            # Convert secondary agents to tools
            agent_tool = IRTool(
                id=f"delegate_to_{agent.id}",
                name=f"delegate_to_{agent.name}",
                description=f"Delegate task to {agent.name}: {agent.persona.goal}",
                inputSchema={"type": "object", "properties": {"task": {"type": "string"}}},
                outputSchema={"type": "object", "properties": {"result": {"type": "string"}}}
            )
            primary.tools.append(agent_tool.id)
            ir.tools.append(agent_tool)

        ir.agents = [primary]
        return ir

    @staticmethod
    def replace_persistent_memory(ir: IRDocument) -> IRDocument:
        """Replace persistent memory with in-memory alternative."""
        ir.memory.type = "ephemeral"
        ir.memory.backend = "in_memory"
        ir.add_warning("Persistent memory downgraded to ephemeral")
        return ir
```

---

## Existing Multi-Framework Tools

### 1. Open Agent Specification (Agent Spec)

**Status**: Open-source specification and reference implementation (2025)
**Docs/GitHub**: [oracle/agent-spec](https://github.com/oracle/agent-spec) · [oracle.github.io/agent-spec](https://oracle.github.io/agent-spec/)
**Adapters**: LangGraph, WayFlow, AutoGen (reference implementations)

**Key Features**:
- JSON/YAML based declarative format
- JSON Schema validation
- Component-based architecture
- Control flow and data flow separation
- Reference runtime (WayFlow)
 - Not related to agent-spec.org (agent communication spec)

**Relevance**: Very high. Strong candidate for IR foundation; extend via `extensions` rather than inventing a parallel schema.

### 2. LiteLLM (Model Abstraction)

**Status**: Production ready
**GitHub**: [BerriAI/litellm](https://github.com/BerriAI/litellm)

**Architecture Pattern**:
```
User Request (OpenAI format)
        |
        v
+------------------+
| LiteLLM Router   |
+------------------+
        |
        v
+------------------+
| get_llm_provider |
| (parse model ID) |
+------------------+
        |
        v
+------------------+
| Provider Handler |
| - transform_request()
| - make_api_call()
| - transform_response()
+------------------+
        |
        v
Unified Response (OpenAI format)
```

**Lessons for Agent IR**:
1. Unified input/output format (like OpenAI's)
2. Provider-specific Config classes with transform methods
3. Model ID parsing pattern (e.g., "anthropic/claude-3-7-sonnet-latest")
4. Custom provider registration via plugin map

Sources: [LiteLLM Docs](https://docs.litellm.ai/), [LiteLLM Provider Registration](https://docs.litellm.ai/docs/provider_registration/)

### 3. Microsoft Agent Framework

**Status**: Public preview (as of late 2025)
**Features**:
- Open-source SDK for .NET and Python
- Unifies and extends Semantic Kernel + AutoGen
- Agents with tool/MCP integration
- Graph-based workflows with checkpointing and human-in-the-loop patterns

**Relevance**: Medium-high. Strong signal for convergence; monitor for IR compatibility.

Sources: [Microsoft Agent Framework Overview](https://learn.microsoft.com/en-us/agent-framework/overview/agent-framework-overview), [Microsoft Agent Framework GitHub](https://github.com/microsoft/agentframework)

### 4. Serverless Workflow DSL

**Status**: v1.0.0
**Website**: [serverlessworkflow.io](https://serverlessworkflow.io)

**Useful Patterns**:
- Control flow primitives (for, switch, fork, try-catch)
- Event-driven execution
- CRON expressions
- Multi-language SDKs

**Relevance**: Medium. Good workflow patterns, but not agent-specific.

Sources: [Serverless Workflow Specification](https://serverlessworkflow.io/)

---

## BMB to Framework Mapping

### BMB Core Concepts

Based on the BMAD system in this project, here's how BMB concepts map to portable IR and frameworks:

| BMB Concept | Portable IR | Claude SDK | Agno | LangGraph | CrewAI |
|-------------|-------------|------------|------|-----------|--------|
| **Persona** | `agent.persona.role` | System prompt | `instructions` | Prompt template | `role` + `backstory` |
| **Principles** | `agent.persona.principles[]` | System prompt section | `instructions` section | State constraints | `goal` definition |
| **Workflow Step** | `workflow.nodes[]` | Manual function | `Workflow.steps[]` | `StateGraph.add_node()` | `Task` |
| **Memory/Context** | `memory.config` | Context management | `db` backend | Checkpointer | Memory types |
| **Agent Type** | `agent.type` enum | N/A | `Agent` config | Node type | `Agent` role |
| **Tools** | `tools[]` | `@beta_tool` | `@tool` | `@tool` + ToolNode | `BaseTool` |
| **Activation** | `agent.activation` | System prompt | Trigger config | Entry point | Crew kickoff |
| **Menu/Commands** | `agent.commands[]` | Tool definitions | Tool registry | Tool mapping | Task definitions |

### Proposed BMB-to-IR Mapping

```json
{
  "bmb_agent": {
    "metadata": {
      "name": "Research Analyst",
      "slug": "research-analyst",
      "type": "expert",
      "tags": ["research", "analysis"]
    },
    "persona": {
      "identity": "I am a thorough research analyst...",
      "principles": [
        "Always verify sources",
        "Present balanced viewpoints"
      ],
      "communication_style": "Professional and detailed"
    },
    "activation": {
      "triggers": ["research", "analyze"],
      "context_requirements": ["topic", "scope"]
    },
    "menu": {
      "commands": [
        {"name": "deep-dive", "description": "Comprehensive research"},
        {"name": "quick-scan", "description": "Brief overview"}
      ]
    },
    "workflow": {
      "type": "sequential",
      "steps": [
        {"name": "gather", "tool": "web_search"},
        {"name": "analyze", "tool": "data_analysis"},
        {"name": "report", "tool": "document_generator"}
      ]
    }
  }
}
```

**Mapped to Portable IR**:

```json
{
  "version": "1.0",
  "agent": {
    "id": "research-analyst",
    "name": "Research Analyst",
    "persona": {
      "role": "Research Analyst",
      "goal": "Conduct thorough research and analysis",
      "instructions": "I am a thorough research analyst...\n\nPrinciples:\n- Always verify sources\n- Present balanced viewpoints",
      "communication_style": "Professional and detailed"
    },
    "model": {
      "provider": "anthropic",
      "id": "claude-3-7-sonnet-latest",
      "max_tokens": 4096
    },
    "tools": ["web_search", "data_analysis", "document_generator"]
  },
  "workflow": {
    "id": "research-workflow",
    "type": "sequential",
    "nodes": [
      {"id": "gather", "type": "tool", "toolRef": "web_search"},
      {"id": "analyze", "type": "tool", "toolRef": "data_analysis"},
      {"id": "report", "type": "tool", "toolRef": "document_generator"}
    ],
    "edges": [
      {"from": "START", "to": "gather"},
      {"from": "gather", "to": "analyze"},
      {"from": "analyze", "to": "report"},
      {"from": "report", "to": "END"}
    ]
  }
}
```

---

## Validation and Testing

### IR Validation Pipeline

```
IR Document
    |
    v
+-------------------+
| Schema Validation |  <-- JSON Schema validation
+-------------------+
    |
    v
+-------------------+
| Semantic Checks   |  <-- Reference integrity, required fields
+-------------------+
    |
    v
+-------------------+
| Capability Check  |  <-- Framework compatibility
+-------------------+
    |
    v
+-------------------+
| Generation        |
+-------------------+
    |
    v
+-------------------+
| Code Validation   |  <-- Syntax, imports, type checks
+-------------------+
    |
    v
+-------------------+
| Runtime Tests     |  <-- Execution verification
+-------------------+
```

### Validation Strategies

#### 1. Schema Validation

```python
import jsonschema

def validate_ir(ir_doc: dict) -> list[str]:
    """Validate IR document against schema."""
    errors = []

    # Load IR schema
    with open("schemas/ir-v1.json") as f:
        schema = json.load(f)

    # Validate
    validator = jsonschema.Draft202012Validator(schema)
    for error in validator.iter_errors(ir_doc):
        errors.append(f"{error.path}: {error.message}")

    return errors
```

#### 2. Semantic Validation

```python
def validate_references(ir_doc: IRDocument) -> list[str]:
    """Validate all internal references resolve."""
    errors = []

    tool_ids = {t.id for t in ir_doc.tools}
    agent_ids = {a.id for a in ir_doc.agents}

    for agent in ir_doc.agents:
        for tool_ref in agent.tools:
            if tool_ref not in tool_ids:
                errors.append(f"Agent {agent.id} references unknown tool: {tool_ref}")

    for workflow in ir_doc.workflows:
        for node in workflow.nodes:
            if node.agentRef and node.agentRef not in agent_ids:
                errors.append(f"Workflow node {node.id} references unknown agent: {node.agentRef}")

    return errors
```

#### 3. Generated Code Validation

```python
import ast
import subprocess

def validate_generated_code(code: str, language: str = "python") -> list[str]:
    """Validate generated code is syntactically correct."""
    errors = []

    if language == "python":
        try:
            ast.parse(code)
        except SyntaxError as e:
            errors.append(f"Syntax error at line {e.lineno}: {e.msg}")

        # Type check with mypy
        result = subprocess.run(
            ["mypy", "--ignore-missing-imports", "-"],
            input=code,
            capture_output=True,
            text=True
        )
        if result.returncode != 0:
            errors.extend(result.stdout.splitlines())

    return errors
```

### Equivalence Testing

```python
class EquivalenceTest:
    """Test that generated code produces equivalent results across frameworks."""

    def __init__(self, ir: IRDocument):
        self.ir = ir
        self.test_cases = self._generate_test_cases()

    def run_equivalence_tests(self) -> dict[str, TestResult]:
        results = {}

        for framework in ["claude_sdk", "agno", "langgraph", "crewai"]:
            # Generate code
            generator = CodeGenerator(framework)
            code = generator.generate(self.ir)

            # Run test cases
            framework_results = []
            for test_case in self.test_cases:
                result = self._execute_test(code, test_case, framework)
                framework_results.append(result)

            results[framework] = framework_results

        # Compare results across frameworks
        return self._compare_results(results)

    def _compare_results(self, results: dict) -> EquivalenceReport:
        """Check if all frameworks produce equivalent outputs."""
        report = EquivalenceReport()

        for test_idx, test_case in enumerate(self.test_cases):
            outputs = [results[fw][test_idx].output for fw in results]

            if not self._outputs_equivalent(outputs):
                report.add_divergence(test_case, outputs)

        return report
```

### Performance Benchmarking

```python
@dataclass
class BenchmarkResult:
    framework: str
    latency_ms: float
    tokens_used: int
    memory_mb: float
    success: bool

def benchmark_frameworks(ir: IRDocument, test_input: str) -> list[BenchmarkResult]:
    """Benchmark generated code across frameworks."""
    results = []

    for framework in ["claude_sdk", "agno", "langgraph", "crewai"]:
        generator = CodeGenerator(framework)
        code = generator.generate(ir)

        # Measure performance
        start = time.perf_counter()
        memory_before = get_memory_usage()

        output = execute_code(code, test_input)

        elapsed = (time.perf_counter() - start) * 1000
        memory_used = get_memory_usage() - memory_before

        results.append(BenchmarkResult(
            framework=framework,
            latency_ms=elapsed,
            tokens_used=output.token_count,
            memory_mb=memory_used,
            success=output.success
        ))

    return results
```

---

## Architecture Diagrams

### High-Level System Architecture

```
+------------------------------------------------------------------+
|                    Visual Agent Builder (UI)                      |
|  +--------------------+  +--------------------+  +-------------+  |
|  | Agent Editor       |  | Workflow Editor    |  | Tool Editor |  |
|  | - Persona          |  | - Node placement   |  | - Schema    |  |
|  | - Principles       |  | - Edge connections |  | - Impl      |  |
|  +--------------------+  +--------------------+  +-------------+  |
+------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|                    Intermediate Representation                    |
|  +------------------------------------------------------------+  |
|  | IR Document (JSON/YAML)                                     |  |
|  | - agents[], tools[], workflows[], memory                    |  |
|  | - JSON Schema validated                                     |  |
|  | - Framework-agnostic                                        |  |
|  +------------------------------------------------------------+  |
+------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|                    Code Generation Engine                         |
|  +----------------+  +------------------+  +------------------+   |
|  | IR Parser      |  | Transformers     |  | Template Engine |   |
|  +----------------+  +------------------+  +------------------+   |
|           |                  |                      |             |
|           v                  v                      v             |
|  +----------------+  +------------------+  +------------------+   |
|  | Validation     |  | Adapter Registry |  | Code Builder    |   |
|  +----------------+  +------------------+  +------------------+   |
+------------------------------------------------------------------+
                              |
            +-----------------+------------------+
            |                 |                  |
            v                 v                  v
    +-------------+   +-------------+   +-------------+
    | Claude SDK  |   | LangGraph   |   | CrewAI      |
    | Adapter     |   | Adapter     |   | Adapter     |
    +-------------+   +-------------+   +-------------+
            |                 |                  |
            v                 v                  v
    +-------------+   +-------------+   +-------------+
    | Generated   |   | Generated   |   | Generated   |
    | Python Code |   | Python Code |   | Python Code |
    +-------------+   +-------------+   +-------------+
```

### IR Document Structure

```
+------------------------------------------+
|              IR Document                  |
+------------------------------------------+
| version: "1.0"                           |
| metadata: { name, description, tags }    |
+------------------------------------------+
|                                          |
| +--------------------------------------+ |
| |             Agents []                | |
| | +----------------------------------+ | |
| | | id, name, persona                | | |
| | | model: { provider, id, params }  | | |
| | | tools: [tool_refs]               | | |
| | | memory: { type, config }         | | |
| | +----------------------------------+ | |
| +--------------------------------------+ |
|                                          |
| +--------------------------------------+ |
| |             Tools []                 | |
| | +----------------------------------+ | |
| | | id, name, description            | | |
| | | inputSchema (JSON Schema)        | | |
| | | outputSchema (JSON Schema)       | | |
| | | implementation: { type, code }   | | |
| | +----------------------------------+ | |
| +--------------------------------------+ |
|                                          |
| +--------------------------------------+ |
| |           Workflows []               | |
| | +----------------------------------+ | |
| | | id, name, type                   | | |
| | | state: (TypedDict schema)        | | |
| | | nodes: [{ id, type, ref }]       | | |
| | | edges: [{ from, to, condition }] | | |
| | +----------------------------------+ | |
| +--------------------------------------+ |
|                                          |
| +--------------------------------------+ |
| |           Memory Config              | |
| | +----------------------------------+ | |
| | | type: persistent | ephemeral     | | |
| | | backend: sqlite | postgres | ... | | |
| | | options: { ... }                 | | |
| | +----------------------------------+ | |
| +--------------------------------------+ |
|                                          |
| +--------------------------------------+ |
| |           Extensions                 | |
| | +----------------------------------+ | |
| | | claude_sdk: { ... }              | | |
| | | langgraph: { ... }               | | |
| | | crewai: { ... }                  | | |
| | +----------------------------------+ | |
| +--------------------------------------+ |
+------------------------------------------+
```

### Code Generation Flow

```
                    +------------------+
                    |   IR Document    |
                    +------------------+
                            |
                            v
                    +------------------+
                    |    Validate IR   |
                    | - Schema check   |
                    | - Reference check|
                    +------------------+
                            |
                            v
                    +------------------+
                    | Select Adapter   |
                    +------------------+
                            |
            +---------------+---------------+
            |               |               |
            v               v               v
    +-------------+ +-------------+ +-------------+
    | Claude SDK  | | LangGraph   | | CrewAI      |
    | Transformer | | Transformer | | Transformer |
    +-------------+ +-------------+ +-------------+
            |               |               |
            v               v               v
    +-------------+ +-------------+ +-------------+
    | IR -> Claude| | IR -> Graph | | IR -> Crew  |
    | Data Model  | | Data Model  | | Data Model  |
    +-------------+ +-------------+ +-------------+
            |               |               |
            v               v               v
    +-------------+ +-------------+ +-------------+
    | Template    | | Template    | | Template    |
    | Rendering   | | Rendering   | | Rendering   |
    +-------------+ +-------------+ +-------------+
            |               |               |
            v               v               v
    +-------------+ +-------------+ +-------------+
    | Code        | | Code        | | Code        |
    | Validation  | | Validation  | | Validation  |
    +-------------+ +-------------+ +-------------+
            |               |               |
            v               v               v
    +-------------+ +-------------+ +-------------+
    | agent.py    | | graph.py    | | crew.py     |
    | tools/*.py  | | nodes/*.py  | | agents/*.py |
    +-------------+ +-------------+ +-------------+
```

### Adapter Pattern Architecture

```
+----------------------------------------------------------+
|                    Adapter Interface                      |
+----------------------------------------------------------+
| + name: str                                               |
| + capabilities: AdapterCapabilities                       |
| + transform_agent(IRAgent) -> FrameworkAgent             |
| + transform_tool(IRTool) -> FrameworkTool                |
| + transform_workflow(IRWorkflow) -> FrameworkWorkflow    |
| + generate_code(IRDocument) -> FileMap                   |
| + validate_ir(IRDocument) -> list[Warning]               |
+----------------------------------------------------------+
                            ^
                            |
        +-------------------+-------------------+
        |                   |                   |
+---------------+   +---------------+   +---------------+
| ClaudeAdapter |   | LangGraph     |   | CrewAI        |
|               |   | Adapter       |   | Adapter       |
+---------------+   +---------------+   +---------------+
| capabilities: |   | capabilities: |   | capabilities: |
| - streaming   |   | - multi_agent |   | - multi_agent |
| - (limited)   |   | - memory      |   | - memory      |
|               |   | - conditional |   | - hierarchical|
|               |   | - parallel    |   |               |
+---------------+   +---------------+   +---------------+
        |                   |                   |
        v                   v                   v
+---------------+   +---------------+   +---------------+
| Claude SDK    |   | LangGraph     |   | CrewAI        |
| Templates     |   | Templates     |   | Templates     |
+---------------+   +---------------+   +---------------+
```

---

## Recommendations

### 1. Adopt Open Agent Specification as Foundation

**Rationale**: Agent Spec directly solves the portability problem we're addressing. Rather than reinventing, we should:

- Adopt Agent Spec's JSON/YAML schema as our IR base
- Extend with BMB-specific fields in `extensions`
- Contribute back to the standard

**Action Items**:
1. Evaluate Agent Spec SDK (PyAgentSpec)
2. Test existing LangGraph/AutoGen adapters
3. Develop Claude SDK adapter (contribution opportunity)
4. Extend schema for BMB-specific concepts

### 2. Implement LiteLLM-Style Provider Pattern

**Rationale**: LiteLLM's architecture is proven at scale for multi-provider abstraction.

**Apply Pattern**:
```python
class AgentProvider:
    def transform_request(self, ir: IRDocument) -> FrameworkConfig:
        pass

    def transform_response(self, output: FrameworkOutput) -> StandardOutput:
        pass
```

### 3. Prioritize Framework Support Order

Based on capabilities and market adoption:

1. **LangGraph** (highest capability, growing adoption)
2. **CrewAI** (developer-friendly, strong ecosystem)
3. **Agno** (comprehensive features)
4. **Claude SDK** (simpler but limited)

### 4. Design for Graceful Degradation

Not all frameworks support all features. Design IR with:
- Core required fields
- Optional capability-specific sections
- Clear degradation paths documented
- User warnings for feature loss

### 5. Invest in Testing Infrastructure

Critical for multi-framework generation:
- Schema validation suite
- Generated code syntax checking
- Equivalence testing across frameworks
- Performance benchmarking
- Regression testing

### 6. Template + Programmatic Hybrid Generation

Use templates for:
- Boilerplate code
- Import statements
- Configuration files

Use programmatic generation for:
- Complex workflow logic
- Conditional code paths
- Dynamic tool registration

---

## Sources

### Official / Primary Docs
- [Anthropic SDK Python](https://github.com/anthropics/anthropic-sdk-python)
- [Anthropic SDK Python API reference (api.md)](https://github.com/anthropics/anthropic-sdk-python/blob/main/api.md)
- [Anthropic SDK Python Tools (tools.md)](https://github.com/anthropics/anthropic-sdk-python/blob/main/tools.md)
- [Agno Docs](https://docs.agno.com/)
- [LangGraph Docs](https://langchain-ai.github.io/langgraph/)
- [LangGraph Checkpoint Postgres](https://github.com/langchain-ai/langgraph/tree/main/libs/checkpoint-postgres)
- [CrewAI Docs](https://docs.crewai.com/)
- [LiteLLM Docs](https://docs.litellm.ai/)
- [LiteLLM Provider Registration](https://docs.litellm.ai/docs/provider_registration/)
- [Open Agent Specification (Oracle GitHub)](https://github.com/oracle/agent-spec)
- [Open Agent Specification Docs](https://oracle.github.io/agent-spec/)
- [Open Agent Specification Technical Report](https://arxiv.org/html/2510.04173v1)
- [Microsoft Agent Framework Overview](https://learn.microsoft.com/en-us/agent-framework/overview/agent-framework-overview)
- [Microsoft Agent Framework GitHub](https://github.com/microsoft/agentframework)
- [Serverless Workflow Specification](https://serverlessworkflow.io/)
- [JSON Schema Specification](https://json-schema.org/specification)

### Secondary / Community References
- [Anthropic SDK Python (DeepWiki)](https://deepwiki.com/anthropics/anthropic-sdk-python)
- [Agno Framework (DeepWiki)](https://deepwiki.com/agno-agi/agno)
- [LangGraph (DeepWiki)](https://deepwiki.com/langchain-ai/langgraph)
- [CrewAI (DeepWiki)](https://deepwiki.com/crewAIInc/crewAI)
- [LiteLLM (DeepWiki)](https://deepwiki.com/BerriAI/litellm)
- [Agent Spec Overview (Emergent Mind)](https://www.emergentmind.com/topics/open-agent-specification-agent-spec)

### Code Generation
- [OpenAPI Generator](https://openapi-generator.tech/)
- [OpenAPI Generator Templating](https://openapi-generator.tech/docs/templating/)
- [OpenAPI Generator Customization](https://openapi-generator.tech/docs/customization/)
- [Prisma Documentation](https://www.prisma.io/docs)

### Multi-Framework Comparison (Non-Authoritative)
- [Agent Orchestration 2026: LangGraph, CrewAI & AutoGen Guide](https://iterathon.tech/blog/ai-agent-orchestration-frameworks-2026)
- [CrewAI vs LangGraph vs AutoGen (DataCamp)](https://www.datacamp.com/tutorial/crewai-vs-langgraph-vs-autogen)
- [Agentic AI Frameworks: Top 8 Options in 2026](https://www.instaclustr.com/education/agentic-ai/agentic-ai-frameworks-top-8-options-in-2026/)

### Design Patterns
- [MLIR: Multi-Level Intermediate Representation](https://www.emergentmind.com/topics/multilevel-intermediate-representation-mlir)
- [MLIR-Forge: A Modular Framework for Language Smiths](https://arxiv.org/html/2601.09583)
- [Intermediate Representation (Wikipedia)](https://en.wikipedia.org/wiki/Intermediate_representation)

---

## Appendix A: Complete IR JSON Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://hyyve.dev/schemas/ir/v1",
  "title": "Agent IR Document",
  "type": "object",
  "required": ["version", "agents"],
  "properties": {
    "version": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+$"
    },
    "metadata": {
      "type": "object",
      "properties": {
        "name": {"type": "string"},
        "description": {"type": "string"},
        "tags": {"type": "array", "items": {"type": "string"}},
        "created": {"type": "string", "format": "date-time"},
        "modified": {"type": "string", "format": "date-time"}
      }
    },
    "agents": {
      "type": "array",
      "minItems": 1,
      "items": {"$ref": "#/$defs/Agent"}
    },
    "tools": {
      "type": "array",
      "items": {"$ref": "#/$defs/Tool"}
    },
    "workflows": {
      "type": "array",
      "items": {"$ref": "#/$defs/Workflow"}
    },
    "memory": {"$ref": "#/$defs/MemoryConfig"},
    "extensions": {
      "type": "object",
      "additionalProperties": true
    }
  },
  "$defs": {
    "Agent": {
      "type": "object",
      "required": ["id", "name", "model"],
      "properties": {
        "id": {"type": "string"},
        "name": {"type": "string"},
        "persona": {
          "type": "object",
          "properties": {
            "role": {"type": "string"},
            "goal": {"type": "string"},
            "backstory": {"type": "string"},
            "instructions": {"type": "string"},
            "principles": {"type": "array", "items": {"type": "string"}}
          }
        },
        "model": {
          "type": "object",
          "required": ["provider", "id"],
          "properties": {
            "provider": {"type": "string"},
            "id": {"type": "string"},
            "max_tokens": {"type": "integer"},
            "temperature": {"type": "number"}
          }
        },
        "tools": {"type": "array", "items": {"type": "string"}},
        "memory": {"$ref": "#/$defs/AgentMemory"}
      }
    },
    "Tool": {
      "type": "object",
      "required": ["id", "name", "inputSchema"],
      "properties": {
        "id": {"type": "string"},
        "name": {"type": "string"},
        "description": {"type": "string"},
        "inputSchema": {"type": "object"},
        "outputSchema": {"type": "object"},
        "implementation": {
          "type": "object",
          "properties": {
            "type": {"enum": ["inline", "module", "external"]},
            "language": {"type": "string"},
            "code": {"type": "string"},
            "module": {"type": "string"},
            "endpoint": {"type": "string"}
          }
        }
      }
    },
    "Workflow": {
      "type": "object",
      "required": ["id", "nodes", "edges"],
      "properties": {
        "id": {"type": "string"},
        "name": {"type": "string"},
        "type": {"enum": ["sequential", "parallel", "conditional", "graph"]},
        "state": {"type": "object"},
        "nodes": {
          "type": "array",
          "items": {"$ref": "#/$defs/WorkflowNode"}
        },
        "edges": {
          "type": "array",
          "items": {"$ref": "#/$defs/WorkflowEdge"}
        }
      }
    },
    "WorkflowNode": {
      "type": "object",
      "required": ["id", "type"],
      "properties": {
        "id": {"type": "string"},
        "type": {"enum": ["start", "end", "agent", "tool", "condition", "fork", "join", "human"]},
        "agentRef": {"type": "string"},
        "toolRef": {"type": "string"},
        "config": {"type": "object"}
      }
    },
    "WorkflowEdge": {
      "type": "object",
      "required": ["from", "to"],
      "properties": {
        "from": {"type": "string"},
        "to": {"type": "string"},
        "type": {"enum": ["control", "data"]},
        "condition": {"type": "string"},
        "dataMapping": {"type": "object"}
      }
    },
    "MemoryConfig": {
      "type": "object",
      "properties": {
        "type": {"enum": ["persistent", "ephemeral"]},
        "backend": {"enum": ["sqlite", "postgres", "redis", "mongodb", "memory"]},
        "options": {"type": "object"}
      }
    },
    "AgentMemory": {
      "type": "object",
      "properties": {
        "enabled": {"type": "boolean"},
        "types": {
          "type": "array",
          "items": {"enum": ["short_term", "long_term", "entity", "external"]}
        }
      }
    }
  }
}
```

---

## Appendix B: Example Generated Code

### Claude SDK Output

```python
# Generated by Hyyve Platform
# Target: Claude Agent SDK
# IR Version: 1.0

from anthropic import Anthropic
from anthropic.beta.tools import beta_tool
import json

client = Anthropic()

# --- Tools ---

@beta_tool
def web_search(query: str) -> str:
    """Search the web for information.

    Args:
        query: The search query string

    Returns:
        Search results as JSON string
    """
    # TODO: Implement actual search logic
    return json.dumps({"results": [f"Result for: {query}"]})


@beta_tool
def document_generator(content: str, format: str = "markdown") -> str:
    """Generate a formatted document.

    Args:
        content: The content to format
        format: Output format (markdown, html, pdf)

    Returns:
        Formatted document string
    """
    # TODO: Implement document generation
    return f"# Document\n\n{content}"


# --- Agent Runner ---

SYSTEM_PROMPT = """You are a Research Analyst.

Goal: Conduct thorough research and analysis

Instructions:
I am a thorough research analyst who verifies sources and presents balanced viewpoints.

Principles:
- Always verify sources
- Present balanced viewpoints

Communication Style: Professional and detailed
"""

def run_research_agent(user_message: str):
    """Run the research agent with the given message."""
    runner = client.beta.messages.tool_runner(
        max_tokens=4096,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message}
        ],
        model="claude-3-7-sonnet-latest",
        tools=[web_search, document_generator]
    )

    responses = []
    for response in runner:
        responses.append(response)

    return responses


if __name__ == "__main__":
    result = run_research_agent("Research AI trends for 2026")
    print(result[-1].content)
```

### LangGraph Output

```python
# Generated by Hyyve Platform
# Target: LangGraph
# IR Version: 1.0

from typing import TypedDict, Annotated, Literal
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import InMemorySaver
from langchain_core.tools import tool
from langchain_core.messages import HumanMessage, AIMessage
from langchain_anthropic import ChatAnthropic

# --- State Definition ---

class ResearchState(TypedDict):
    messages: Annotated[list, "add_messages"]
    current_step: str
    research_results: dict


# --- Tools ---

@tool
def web_search(query: str) -> str:
    """Search the web for information.

    Args:
        query: The search query string

    Returns:
        Search results as JSON string
    """
    # TODO: Implement actual search logic
    return f"Results for: {query}"


@tool
def document_generator(content: str, format: str = "markdown") -> str:
    """Generate a formatted document.

    Args:
        content: The content to format
        format: Output format (markdown, html, pdf)

    Returns:
        Formatted document string
    """
    return f"# Document\n\n{content}"


tools = [web_search, document_generator]
tool_node = ToolNode(tools)


# --- Model Configuration ---

model = ChatAnthropic(
    model="claude-3-7-sonnet-latest",
    max_tokens=4096
).bind_tools(tools)

SYSTEM_PROMPT = """You are a Research Analyst.

Goal: Conduct thorough research and analysis

Principles:
- Always verify sources
- Present balanced viewpoints
"""


# --- Node Functions ---

def agent_node(state: ResearchState) -> dict:
    """Process messages and decide on tool usage."""
    messages = state["messages"]

    # Add system prompt if first message
    if len(messages) == 1:
        messages = [{"role": "system", "content": SYSTEM_PROMPT}] + messages

    response = model.invoke(messages)
    return {"messages": [response]}


def should_continue(state: ResearchState) -> Literal["tools", "__end__"]:
    """Determine if we should continue to tools or end."""
    last_message = state["messages"][-1]

    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"
    return END


# --- Graph Definition ---

workflow = StateGraph(ResearchState)

# Add nodes
workflow.add_node("agent", agent_node)
workflow.add_node("tools", tool_node)

# Set entry point
workflow.set_entry_point("agent")

# Add edges
workflow.add_conditional_edges(
    "agent",
    should_continue,
    {"tools": "tools", END: END}
)
workflow.add_edge("tools", "agent")

# Compile with checkpointing
memory = InMemorySaver()
app = workflow.compile(checkpointer=memory)


# --- Entry Point ---

def run_research_agent(user_message: str, thread_id: str = "default"):
    """Run the research agent with the given message."""
    config = {"configurable": {"thread_id": thread_id}}

    result = app.invoke(
        {"messages": [HumanMessage(content=user_message)]},
        config=config
    )

    return result


if __name__ == "__main__":
    result = run_research_agent("Research AI trends for 2026")
    print(result["messages"][-1].content)
```

### CrewAI Output

```python
# Generated by Hyyve Platform
# Target: CrewAI
# IR Version: 1.0

from crewai import Agent, Task, Crew, Process
from crewai.tools import tool

# --- Tools ---

@tool("Web Search")
def web_search(query: str) -> str:
    """Search the web for information.

    Args:
        query: The search query string

    Returns:
        Search results
    """
    # TODO: Implement actual search logic
    return f"Results for: {query}"


@tool("Document Generator")
def document_generator(content: str, format: str = "markdown") -> str:
    """Generate a formatted document.

    Args:
        content: The content to format
        format: Output format (markdown, html, pdf)

    Returns:
        Formatted document string
    """
    return f"# Document\n\n{content}"


# --- Agent Definition ---

research_analyst = Agent(
    role="Research Analyst",
    goal="Conduct thorough research and analysis",
    backstory="""I am a thorough research analyst who verifies sources
    and presents balanced viewpoints. I always maintain a professional
    and detailed communication style.""",
    tools=[web_search, document_generator],
    memory=True,
    verbose=True,
    llm="anthropic/claude-3-7-sonnet-latest",
    max_iter=25
)


# --- Task Definition ---

research_task = Task(
    description="Research the given topic thoroughly, verify sources, and present balanced viewpoints.",
    expected_output="Comprehensive research report with verified sources",
    agent=research_analyst
)


# --- Crew Definition ---

research_crew = Crew(
    agents=[research_analyst],
    tasks=[research_task],
    process=Process.sequential,
    memory=True,
    verbose=True
)


# --- Entry Point ---

def run_research_agent(user_message: str):
    """Run the research crew with the given message."""
    research_task.description = f"Research the following topic: {user_message}"
    result = research_crew.kickoff()
    return result


if __name__ == "__main__":
    result = run_research_agent("Research AI trends for 2026")
    print(result)
```

---

*Document generated: 2026-01-20*
*Research conducted for: Hyyve Platform*
