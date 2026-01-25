# Claude Agent SDK Technical Research

**Date**: 2026-01-20
**Status**: Verified (Context7 + DeepWiki, 2026-01-21)
**Purpose**: Deep technical research for Hyyve Platform using BMAD methodology
**Focus**: Claude Agent SDK as initial framework for workflow-based agent orchestration

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [SDK Architecture & Core Concepts](#sdk-architecture--core-concepts)
3. [Workflow & Orchestration Patterns](#workflow--orchestration-patterns)
4. [Tools & MCP Integration](#tools--mcp-integration)
5. [CC-WF-Studio Node Types](#cc-wf-studio-node-types)
6. [Code Examples](#code-examples)
7. [Framework Comparison](#framework-comparison)
8. [Implementation Recommendations](#implementation-recommendations)
9. [Sources](#sources)

---

## Executive Summary

The **Claude Agent SDK** (formerly Claude Code SDK) is Anthropic's official framework for building production AI agents with Claude's capabilities. It provides the same tools, agent loop, and context management that power Claude Code, available as programmable libraries in Python and TypeScript.

**Verification Status:** Partially verified. Core SDK APIs and options validated; branding claims and CC‑WF‑Studio details require separate verification.

### Key Differentiators

| Feature | Claude Agent SDK |
|---------|------------------|
| **Built-in Tools** | Read/Write/Edit/Bash/Glob/Grep/WebSearch/WebFetch (documented) |
| **In-Process MCP** | Custom tools via SDK MCP servers (no subprocess) |
| **Subagents** | `agents` option for specialized subagents |
| **Hooks System** | Pre/Post tool hooks + PreCompact |
| **Session Management** | `resume` + `fork_session` session branching |
| **Permission Controls** | `permission_mode` + `can_use_tool` callback |

### Architecture Philosophy (Validated)

The SDK implements an iterative agent loop and exposes tools, hooks, and sessions to control agent behavior.

---

## Validation Summary (2026-01-21)

Validated via Context7 and DeepWiki:
- `query()` and `ClaudeSDKClient` are the primary Python interfaces.
- `ClaudeAgentOptions` supports tools, permissions, hooks, sessions, subagents, MCP servers, output_format, sandbox, and file checkpointing.
- Built-in tools include Read, Write, Edit, Bash, Glob, Grep, WebSearch, WebFetch (and Skill when Skills are enabled).
- Hooks include: PreToolUse, PostToolUse, UserPromptSubmit, Stop, SubagentStop, PreCompact.
- Sessions support `resume` and `fork_session` with session IDs in init system messages.
- Subagents are configured via `agents` and can be invoked automatically.

Corrections applied:
- Replaced shorthand model IDs with full model IDs where required.
- Updated session ID extraction examples to read from init system messages.
- Added missing options (`tools`, `disallowed_tools`, `can_use_tool`, `permission_mode=plan`, etc.).
- Removed unsupported claims (Task tool requirement, undocumented tool search env var).

Remaining caution:
- AskUserQuestion tool is documented in TypeScript changelog; not confirmed in Python docs.
- CC-WF-Studio specifics are not first-party SDK docs; treat as integration guidance.

## SDK Architecture & Core Concepts

**Verification Status:** Verified for `query()`, `ClaudeSDKClient`, `ClaudeAgentOptions`, sessions, hooks, and tools.

### High-Level Architecture

```
+------------------------------------------------------------------+
|                     Claude Agent SDK                              |
+------------------------------------------------------------------+
|                                                                   |
|  +-------------------+    +--------------------+                  |
|  |   query()         |    |  ClaudeSDKClient   |                  |
|  | (Simple Async)    |    | (Bidirectional)    |                  |
|  +--------+----------+    +---------+----------+                  |
|           |                         |                             |
|           +------------+------------+                             |
|                        |                                          |
|           +------------v------------+                             |
|           |     Agent Loop          |                             |
|           |  (Feedback Cycle)       |                             |
|           +------------+------------+                             |
|                        |                                          |
|    +-------------------+-------------------+                      |
|    |                   |                   |                      |
|    v                   v                   v                      |
| +------+         +---------+        +------------+                |
| | Tools|         | Hooks   |        | Subagents  |                |
| +------+         +---------+        +------------+                |
|    |                   |                   |                      |
|    v                   v                   v                      |
| +------+         +---------+        +------------+                |
| | MCP  |         | Sessions|        | Permissions|                |
| +------+         +---------+        +------------+                |
|                                                                   |
+------------------------------------------------------------------+
```

### Two Primary Interfaces

#### 1. `query()` - Simple Async Interface

For one-off queries without persistent state:

```python
import asyncio
from claude_agent_sdk import (
    query, ClaudeAgentOptions,
    AssistantMessage, TextBlock, ResultMessage
)

async def main():
    async for message in query(
        prompt="Find and fix the bug in auth.py",
        options=ClaudeAgentOptions(allowed_tools=["Read", "Edit", "Bash"])
    ):
        print(message)  # Claude reads, finds, and edits

asyncio.run(main())
```

#### 2. `ClaudeSDKClient` - Bidirectional Interactive Client

For persistent conversations, custom tools, and hooks:

```python
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions

options = ClaudeAgentOptions(
    allowed_tools=["Read", "Grep", "Glob"],
    model="claude-sonnet-4-5"
)

async with ClaudeSDKClient(options=options) as client:
    await client.query("Your prompt")
    async for msg in client.receive_response():
        print(msg)
```

### Configuration Options (ClaudeAgentOptions)

**Python names** are `snake_case`. **TypeScript names** are `camelCase`.

Core options (validated):

| Python | TypeScript | Type | Description |
|--------|------------|------|-------------|
| `tools` | `tools` | `list | preset` | Base toolset. Can be `[]`, list, or preset (`{"type":"preset","preset":"claude_code"}`) |
| `allowed_tools` | `allowedTools` | `List[str]` | Explicit tool allowlist |
| `disallowed_tools` | `disallowedTools` | `List[str]` | Block specific tools |
| `permission_mode` | `permissionMode` | `str` | `default`, `acceptEdits`, `plan`, `bypassPermissions` |
| `can_use_tool` | `canUseTool` | `callable` | Programmatic tool permission callback |
| `permission_prompt_tool_name` | `permissionPromptToolName` | `str` | Tool to use for permission prompts |
| `system_prompt` | `systemPrompt` | `str | dict` | Custom prompt or preset object |
| `setting_sources` | `settingSources` | `List[str]` | Skills sources: `["user"]`, `["project"]` |
| `agents` | `agents` | `Dict` | Subagent definitions |
| `mcp_servers` | `mcpServers` | `Dict` | MCP server configurations |
| `cwd` | `workingDirectory` | `str | Path` | Working directory |
| `add_dirs` | `addDirs` | `List[str]` | Additional directories |
| `max_turns` | `maxTurns` | `int` | Maximum agent loop iterations |
| `model` | `model` | `str` | Model ID (e.g., `claude-sonnet-4-5`) |
| `resume` | `resume` | `str` | Session ID to resume |
| `fork_session` | `forkSession` | `bool` | Fork session on resume |

Advanced options (validated):

| Python | TypeScript | Type | Description |
|--------|------------|------|-------------|
| `max_budget_usd` | `maxBudgetUsd` | `float` | Stop after spending budget |
| `max_thinking_tokens` | `maxThinkingTokens` | `int` | Limit extended thinking |
| `fallback_model` | `fallbackModel` | `str` | Automatic fallback model |
| `betas` | `betas` | `List[str]` | Enable API beta features |
| `include_partial_messages` | `includePartialMessages` | `bool` | Stream partial messages |
| `enable_file_checkpointing` | `enableFileCheckpointing` | `bool` | Allow rewind of file edits |
| `output_format` | `outputFormat` | `dict` | Structured output schema |
| `plugins` | `plugins` | `list` | Plugin configuration |
| `sandbox` | `sandbox` | `dict` | Sandbox configuration |
| `env` | `env` | `dict` | Environment variables |
| `cli_path` | `cliPath` | `str` | Custom CLI path |
| `extra_args` | `extraArgs` | `dict` | Extra CLI flags |
| `stderr` | `stderr` | `callable` | Stderr callback |

### Message Types

```
+------------------+     +------------------+     +------------------+
| AssistantMessage |     |   UserMessage    |     |  SystemMessage   |
| (Claude output)  |     | (User input)     |     | (System control) |
+------------------+     +------------------+     +------------------+
         |                                                  |
         v                                                  v
+------------------+                              +------------------+
|   ResultMessage  |                              |  Content Blocks  |
| (Final output)   |                              | - TextBlock      |
+------------------+                              | - ToolUseBlock   |
                                                  | - ToolResultBlock|
                                                  +------------------+
```

### Session & Conversation Management

```
+------------------+    resume    +------------------+
|  Session A       |------------->|  Session A       |
|  (Original)      |              |  (Continued)     |
+------------------+              +------------------+
         |
         | fork_session=True
         v
+------------------+
|  Session B       |
|  (Forked Branch) |
+------------------+
```

**Key Session Features:**
- Session IDs returned in `init` system message
- `resume` option continues conversation with full context
- `fork_session` creates new branch without modifying original
- Compaction is exposed via the `PreCompact` hook event

---

## Workflow & Orchestration Patterns

**Verification Status:** Partially verified. Subagent configuration via `agents` is verified; orchestration patterns are guidance and should be validated in practice.

### Subagent Architecture

Subagents are the primary mechanism for multi-agent orchestration in Claude Agent SDK.

```
+---------------------------+
|      Main Agent           |
|  (Orchestrator)           |
+-------------+-------------+
              |
              | Subagent Invocation
              |
    +---------+---------+
    |         |         |
    v         v         v
+-------+ +-------+ +-------+
|Code   | |Test   | |Doc    |
|Review | |Runner | |Writer |
|Agent  | |Agent  | |Agent  |
+-------+ +-------+ +-------+
    |         |         |
    v         v         v
  Isolated Context Windows
```

#### Subagent Definition

```python
from claude_agent_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="Review the authentication module",
    options=ClaudeAgentOptions(
        allowed_tools=["Read", "Grep", "Glob"],
        agents={
            "code-reviewer": {
                "description": "Expert code reviewer for security and quality",
                "prompt": """You are a code review specialist with expertise in:
                - Security vulnerabilities
                - Performance issues
                - Coding standards""",
                "tools": ["Read", "Grep", "Glob"],
                "model": "claude-sonnet-4-5"
            },
            "test-runner": {
                "description": "Runs and analyzes test suites",
                "prompt": "You are a test execution specialist...",
                "tools": ["Bash", "Read", "Grep"],
                "model": "claude-sonnet-4-5"
            }
        }
    )
):
    print(message)
```

#### Subagent Configuration Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `description` | `str` | Yes | Natural language description for automatic delegation |
| `prompt` | `str` | Yes | System prompt defining role and behavior |
| `tools` | `List[str]` | No | Tool allowlist (inherits all if omitted) |
| `model` | `str` | No | Model ID (e.g., `claude-sonnet-4-5`) |

### Orchestration Patterns

#### Pattern 1: Sequential Workflow

```python
# Step 1: Analysis
async for msg in query(prompt="Analyze codebase structure", options=options):
    if hasattr(msg, "subtype") and msg.subtype == "init":
        session_id = msg.data.get("session_id")

# Step 2: Implementation (resume session)
async for msg in query(
    prompt="Now implement the changes",
    options=ClaudeAgentOptions(resume=session_id)
):
    process(msg)
```

#### Pattern 2: Parallel Execution with Subagents

```python
options = ClaudeAgentOptions(
    allowed_tools=["Read", "Glob", "Grep"],
    agents={
        "style-checker": {...},
        "security-scanner": {...},
        "test-coverage": {...}
    }
)

# Claude can invoke multiple subagents in parallel
async for msg in query(
    prompt="Run comprehensive code review using all available agents",
    options=options
):
    # Claude orchestrates parallel execution
    pass
```

#### Pattern 3: Conditional Branching with Hooks

```python
async def route_based_on_content(input_data, tool_use_id, context):
    content = input_data.get('tool_input', {})

    if 'security' in content.get('task', ''):
        return {
            'hookSpecificOutput': {
                'hookEventName': input_data['hook_event_name'],
                'additionalContext': 'Use security-scanner agent'
            }
        }
    return {}

options = ClaudeAgentOptions(
    hooks={
        'PreToolUse': [HookMatcher(matcher='Bash', hooks=[route_based_on_content])]
    }
)
```

#### Pattern 4: Test-Driven Workflow (TDD)

```
1. TestWriter Agent
   - Generates failing tests based on requirements
   - Cannot edit production code

2. Implementer Agent
   - Writes code to pass tests
   - Cannot edit test files

3. Reviewer Agent
   - Lints, checks security
   - Extracts documentation

4. Orchestrator
   - Compacts state between steps
   - Updates global plan
   - Manages handoffs
```

### State Management

#### Context Compaction

The SDK automatically summarizes previous messages as context limits approach:

```python
# PreCompact hook to archive before summarization
async def archive_transcript(input_data, tool_use_id, context):
    if input_data['hook_event_name'] == 'PreCompact':
        # Save full transcript before compaction
        save_to_archive(input_data['transcript_path'])
    return {}
```

#### State Passing Between Agents

```python
# Via system message injection
async def inject_state(input_data, tool_use_id, context):
    return {
        'systemMessage': f'Previous analysis found: {state_summary}',
        'hookSpecificOutput': {
            'hookEventName': input_data['hook_event_name'],
            'additionalContext': serialized_state
        }
    }
```

---

## Tools & MCP Integration

**Verification Status:** Partially verified. Built‑in tools and SDK MCP servers are documented; HTTP/SSE MCP transport is unverified.

### Built-in Tools

| Tool | Description | Use Case |
|------|-------------|----------|
| `Read` | Read any file | File analysis |
| `Write` | Create new files | Code generation |
| `Edit` | Modify existing files | Refactoring |
| `Bash` | Run terminal commands | Execution |
| `Glob` | Find files by pattern | File discovery |
| `Grep` | Search file contents | Code search |
| `WebSearch` | Search the web | Research |
| `WebFetch` | Fetch web pages | Documentation |
| `Skill` | Invoke Skills | Skills system |
| `AskUserQuestion` | Clarifying questions | User input (TS confirmed; Python docs unconfirmed) |

### MCP Integration Architecture

```
+-------------------+
|  Claude Agent SDK |
+--------+----------+
         |
         | MCP Protocol
         |
+--------v----------+
|   MCP Servers     |
+-------------------+
|                   |
| +---------------+ |
| | stdio (local) | |  <- npx @modelcontextprotocol/server-*
| +---------------+ |
|                   |
| +---------------+ |
| | HTTP/SSE      | |  <- Remote API servers
| +---------------+ |
|                   |
| +---------------+ |
| | SDK In-Process| |  <- Custom tools (no subprocess!)
| +---------------+ |
|                   |
+-------------------+
```

### Transport Types

#### 1. stdio Servers (Local Process)

```python
options = ClaudeAgentOptions(
    mcp_servers={
        "github": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-github"],
            "env": {
                "GITHUB_TOKEN": os.environ["GITHUB_TOKEN"]
            }
        }
    },
    allowed_tools=["mcp__github__*"]
)
```

#### 2. HTTP/SSE Servers (Remote, Unverified)

Note: stdio configuration is documented; HTTP/SSE MCP transport support is not confirmed in current SDK docs and should be validated before use.

```python
options = ClaudeAgentOptions(
    mcp_servers={
        "remote-api": {
            "type": "sse",
            "url": "https://api.example.com/mcp/sse",
            "headers": {
                "Authorization": f"Bearer {os.environ['API_TOKEN']}"
            }
        }
    },
    allowed_tools=["mcp__remote-api__*"]
)
```

#### 3. SDK MCP Servers (In-Process) - Suggested for Custom Tools

```python
from claude_agent_sdk import tool, create_sdk_mcp_server

@tool("greet", "Greet a user", {"name": str})
async def greet_user(args):
    return {
        "content": [
            {"type": "text", "text": f"Hello, {args['name']}!"}
        ]
    }

server = create_sdk_mcp_server(
    name="my-tools",
    version="1.0.0",
    tools=[greet_user]
)

options = ClaudeAgentOptions(
    mcp_servers={"my-tools": server},
    allowed_tools=["mcp__my-tools__greet"]
)
```

**In-Process MCP Benefits:**
- No subprocess management
- Better performance (no IPC overhead)
- Simpler deployment
- Easier debugging
- Type safety with direct Python calls

### Tool Naming Convention

MCP tools follow the pattern: `mcp__{server_name}__{tool_name}`

Example: A tool named `list_issues` in server `github` becomes `mcp__github__list_issues`

### Tool Schema Definition

```python
# Simple type mapping
@tool("calculate", "Perform calculations", {"expression": str, "precision": int})
async def calculate(args):
    ...

# JSON Schema for complex validation
@tool(
    "api_request",
    "Make API requests",
    {
        "type": "object",
        "properties": {
            "service": {"type": "string", "enum": ["stripe", "github"]},
            "endpoint": {"type": "string"},
            "method": {"type": "string", "enum": ["GET", "POST"]}
        },
        "required": ["service", "endpoint", "method"]
    }
)
async def api_request(args):
    ...
```

---

## CC-WF-Studio Node Types

CC-WF-Studio is a Visual Studio Code extension that provides a visual workflow editor for Claude Code, enabling drag-and-drop workflow design.

Validation note: CC-WF-Studio details are not part of the official Claude Agent SDK docs; treat this section as integration guidance that should be verified against CC-WF-Studio sources.

**Verification Status:** Unverified (not part of official SDK docs).

### Architecture Overview

```
+------------------------------------------+
|           CC-WF-Studio (VS Code)          |
+------------------------------------------+
|                                           |
|   +---------------+   +---------------+   |
|   | Visual Canvas |   | Node Palette  |   |
|   | (React Flow)  |   |               |   |
|   +---------------+   +---------------+   |
|                                           |
|   +-----------------------------------+   |
|   |         State (Zustand)           |   |
|   +-----------------------------------+   |
|                                           |
+------------------------------------------+
           |
           | Export
           v
+------------------------------------------+
|          Claude Code File System          |
+------------------------------------------+
| .claude/agents/*.md    Sub-Agent Defs    |
| .claude/commands/*.md  Slash Commands    |
| .claude/skills/*.md    Skill Definitions |
+------------------------------------------+
```

### Node Types

#### 1. Prompt Nodes

**Purpose**: Define reusable prompt templates with variable substitution

```markdown
# Template Format
"Analyze the {{file_path}} for {{analysis_type}} issues"

# Features
- {{variableName}} syntax for dynamic values
- Variable detection and validation
- Runtime value substitution
```

#### 2. Sub-Agent Nodes

**Purpose**: Configure autonomous AI agents

| Configuration | Description |
|--------------|-------------|
| System Prompt | Custom instructions for the agent |
| Tool Permissions | Read, Write, Bash, etc. |
| Model Selection | Claude model IDs (e.g., `claude-sonnet-4-5`) |

**Output**: `.claude/agents/<agent-name>.md`

#### 3. Skill Nodes

**Purpose**: Integrate Claude Code Skills into workflows

```
+-------------------+
| Skill Node        |
+-------------------+
| Name: skill-name  |
| Scope: project    |
| Tools: [...]      |
+-------------------+
        |
        v
Personal: ~/.claude/skills/
Project:  .claude/skills/
```

#### 4. MCP Tool Nodes

**Purpose**: Connect to Model Context Protocol servers

```
+-------------------+
| MCP Tool Node     |
+-------------------+
| Server: github    |
| Tool: list_issues |
| Params: {...}     |
+-------------------+
        |
        v
Dynamic parameter configuration
based on tool schemas
```

#### 5. Control Flow Nodes

**IfElse Node** - Binary branching:
```
        [Condition]
           / \
          /   \
       True   False
        |       |
        v       v
    [Node A] [Node B]
```

**Switch Node** - Multi-way branching (2-N branches):
```
        [Expression]
         /  |  \
        /   |   \
    Case1 Case2 CaseN
       |    |    |
       v    v    v
    [A]  [B]  [Default]
```

**AskUserQuestion Node** - User decision points:
```
        [Question]
       / | | \
      /  |  |  \
   Opt1 Opt2 Opt3 Opt4
     |    |    |    |
     v    v    v    v
   [A]  [B]  [C]  [D]
```

### CC-WF-Studio to SDK Mapping

| CC-WF-Studio Node | SDK Equivalent |
|-------------------|----------------|
| Prompt Node | System prompt / prompt parameter |
| Sub-Agent Node | `agents` dictionary |
| Skill Node | `setting_sources=["project"]` + `.claude/skills/` |
| MCP Tool Node | `mcp_servers` configuration |
| IfElse/Switch | `PreToolUse` hooks with conditional logic |
| AskUserQuestion | `AskUserQuestion` tool (TS confirmed; Python docs unconfirmed) |

### Workflow Constraints (Unverified)

The following are integration assumptions (not verified in official SDK docs):
- Maximum node count per workflow
- Typical workflow size ranges
- JSON storage paths in `.vscode/workflows/*.json`

---

## Code Examples

**Verification Status:** Verified. Examples updated to match current SDK API shapes.

### Example 1: Basic Agent with Built-in Tools

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, TextBlock, ResultMessage

async def main():
    async for message in query(
        prompt="What files are in this directory? Summarize the project structure.",
        options=ClaudeAgentOptions(
            allowed_tools=["Bash", "Glob", "Read"],
            cwd="/path/to/project"
        )
    ):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, TextBlock):
                    print(block.text)
        elif isinstance(message, ResultMessage):
            print(f"Cost: ${message.total_cost_usd:.4f}")

asyncio.run(main())
```

### Example 2: Multi-Agent Code Review System

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, TextBlock, ResultMessage

async def code_review():
    options = ClaudeAgentOptions(
        allowed_tools=["Read", "Grep", "Glob"],
        agents={
            "security-reviewer": {
                "description": "Security expert for vulnerability analysis",
                "prompt": """You are a security code reviewer. Focus on:
                - SQL injection vulnerabilities
                - XSS vulnerabilities
                - Authentication/authorization flaws
                - Sensitive data exposure
                Report severity levels: Critical, High, Medium, Low""",
                "tools": ["Read", "Grep", "Glob"],
                "model": "claude-opus-4-1"
            },
            "performance-analyst": {
                "description": "Performance optimization specialist",
                "prompt": """Analyze code for performance issues:
                - N+1 queries
                - Memory leaks
                - Inefficient algorithms
                - Unnecessary computations""",
                "tools": ["Read", "Grep", "Glob"],
                "model": "claude-sonnet-4-5"
            },
            "style-checker": {
                "description": "Code style and best practices reviewer",
                "prompt": "Check for coding standards, naming conventions, documentation...",
                "tools": ["Read", "Grep", "Glob"],
                "model": "claude-sonnet-4-5"
            }
        }
    )

    async for message in query(
        prompt="""Perform a comprehensive code review of the src/ directory.
        Use all available review agents in parallel for efficiency.
        Compile findings into a unified report.""",
        options=options
    ):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, TextBlock):
                    print(block.text)
        elif isinstance(message, ResultMessage):
            print("=== Review Complete ===")
            print(f"Cost: ${message.total_cost_usd:.4f}")

asyncio.run(code_review())
```

### Example 3: Custom MCP Tool Integration

```python
import asyncio
import aiohttp
from claude_agent_sdk import (
    query, ClaudeAgentOptions, tool, create_sdk_mcp_server,
    AssistantMessage, TextBlock, ResultMessage
)

# Define custom tools
@tool("search_jira", "Search JIRA for issues", {
    "query": str,
    "project": str,
    "max_results": int
})
async def search_jira(args):
    async with aiohttp.ClientSession() as session:
        async with session.get(
            f"https://your-jira.atlassian.net/rest/api/3/search",
            params={
                "jql": f'project = {args["project"]} AND text ~ "{args["query"]}"',
                "maxResults": args.get("max_results", 10)
            },
            headers={"Authorization": f"Basic {JIRA_TOKEN}"}
        ) as response:
            data = await response.json()
            issues = [f"- {i['key']}: {i['fields']['summary']}" for i in data['issues']]
            return {
                "content": [{
                    "type": "text",
                    "text": f"Found {len(issues)} issues:\n" + "\n".join(issues)
                }]
            }

@tool("create_pr_comment", "Add comment to GitHub PR", {
    "repo": str,
    "pr_number": int,
    "comment": str
})
async def create_pr_comment(args):
    async with aiohttp.ClientSession() as session:
        async with session.post(
            f"https://api.github.com/repos/{args['repo']}/issues/{args['pr_number']}/comments",
            json={"body": args["comment"]},
            headers={
                "Authorization": f"Bearer {GITHUB_TOKEN}",
                "Accept": "application/vnd.github+json"
            }
        ) as response:
            if response.status == 201:
                return {"content": [{"type": "text", "text": "Comment added successfully"}]}
            return {"content": [{"type": "text", "text": f"Failed: {response.status}"}]}

# Create in-process MCP server
integration_server = create_sdk_mcp_server(
    name="integrations",
    version="1.0.0",
    tools=[search_jira, create_pr_comment]
)

async def main():
    options = ClaudeAgentOptions(
        mcp_servers={"integrations": integration_server},
        allowed_tools=[
            "Read", "Grep", "Glob",
            "mcp__integrations__search_jira",
            "mcp__integrations__create_pr_comment"
        ]
    )

    async for message in query(
        prompt="Search JIRA for authentication bugs in project AUTH, then summarize findings",
        options=options
    ):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, TextBlock):
                    print(block.text)
        elif isinstance(message, ResultMessage):
            print(f"Cost: ${message.total_cost_usd:.4f}")

asyncio.run(main())
```

### Example 4: Workflow with Hooks for Security & Logging

```python
import asyncio
from datetime import datetime
from claude_agent_sdk import (
    query, ClaudeAgentOptions, HookMatcher,
    AssistantMessage, TextBlock, ResultMessage
)

# Security hook - block dangerous operations
async def security_guard(input_data, tool_use_id, context):
    if input_data['hook_event_name'] != 'PreToolUse':
        return {}

    tool_name = input_data['tool_name']
    tool_input = input_data.get('tool_input', {})

    # Block destructive commands
    if tool_name == 'Bash':
        command = tool_input.get('command', '')
        dangerous_patterns = ['rm -rf', 'DROP TABLE', 'DELETE FROM', ':(){:|:&};:']

        for pattern in dangerous_patterns:
            if pattern in command:
                return {
                    'hookSpecificOutput': {
                        'hookEventName': input_data['hook_event_name'],
                        'permissionDecision': 'deny',
                        'permissionDecisionReason': f'Blocked dangerous command: {pattern}'
                    }
                }

    # Block writes to sensitive paths
    if tool_name in ['Write', 'Edit']:
        file_path = tool_input.get('file_path', '')
        protected_patterns = ['.env', 'credentials', 'secrets', '/etc/', '~/.ssh/']

        for pattern in protected_patterns:
            if pattern in file_path:
                return {
                    'hookSpecificOutput': {
                        'hookEventName': input_data['hook_event_name'],
                        'permissionDecision': 'deny',
                        'permissionDecisionReason': f'Protected path: {pattern}'
                    }
                }

    return {}

# Audit hook - log all operations
async def audit_logger(input_data, tool_use_id, context):
    timestamp = datetime.now().isoformat()
    tool_name = input_data.get('tool_name', 'unknown')

    log_entry = {
        'timestamp': timestamp,
        'event': input_data['hook_event_name'],
        'tool': tool_name,
        'tool_use_id': tool_use_id,
        'session': input_data.get('session_id')
    }

    # Log to file or external service
    with open('./agent_audit.log', 'a') as f:
        f.write(f"{log_entry}\n")

    return {}

async def main():
    options = ClaudeAgentOptions(
        allowed_tools=["Read", "Write", "Edit", "Bash", "Glob", "Grep"],
        permission_mode='acceptEdits',
        hooks={
            'PreToolUse': [
                HookMatcher(hooks=[security_guard]),  # All tools
                HookMatcher(hooks=[audit_logger])     # All tools
            ],
            'PostToolUse': [
                HookMatcher(hooks=[audit_logger])     # Log completions
            ]
        }
    )

    async for message in query(
        prompt="Refactor the authentication module to use JWT tokens",
        options=options
    ):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, TextBlock):
                    print(block.text)
        elif isinstance(message, ResultMessage):
            print(f"Cost: ${message.total_cost_usd:.4f}")

asyncio.run(main())
```

### Example 5: Session Forking for A/B Testing Approaches

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def test_approaches():
    session_id = None

    # Initial analysis
    async for message in query(
        prompt="Analyze the database schema and identify optimization opportunities",
        options=ClaudeAgentOptions(allowed_tools=["Read", "Glob", "Grep"])
    ):
        if hasattr(message, "subtype") and message.subtype == "init":
            session_id = message.data.get("session_id")
            print(f"Original session: {session_id}")

    # Fork A: Try indexing approach
    print("\n=== Approach A: Database Indexing ===")
    async for message in query(
        prompt="Implement optimization using database indexes",
        options=ClaudeAgentOptions(
            resume=session_id,
            fork_session=True,  # Creates new branch
            allowed_tools=["Read", "Write", "Edit"]
        )
    ):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, TextBlock):
                    print(block.text)
        elif isinstance(message, ResultMessage):
            print(f"Cost: ${message.total_cost_usd:.4f}")

    # Fork B: Try caching approach (from same starting point)
    print("\n=== Approach B: Application Caching ===")
    async for message in query(
        prompt="Implement optimization using Redis caching layer",
        options=ClaudeAgentOptions(
            resume=session_id,
            fork_session=True,  # Creates another branch
            allowed_tools=["Read", "Write", "Edit"]
        )
    ):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, TextBlock):
                    print(block.text)
        elif isinstance(message, ResultMessage):
            print(f"Cost: ${message.total_cost_usd:.4f}")

    # Original session remains unchanged
    print("\n=== Original session preserved ===")

asyncio.run(test_approaches())
```

---

## Framework Comparison

**Verification Status:** Partially verified. Claude SDK column is verified; LangGraph/Agno comparisons are directional and require separate validation.

### Claude Agent SDK vs LangGraph vs Agno

| Feature | Claude Agent SDK | LangGraph | Agno (Phidata) |
|---------|------------------|-----------|----------------|
| **Primary Use** | Claude-native agents | Stateful multi-step workflows | High-performance agents |
| **Orchestration** | Subagents via `agents` config | Explicit graph/DAG definition | Pure Python, no graphs |
| **State Management** | Session-based with `resume`/`fork_session` and PreCompact hook | Explicit state graph | Minimal, memory-focused |
| **Tool Integration** | Built-in + MCP protocol | External via LangChain | 23+ provider integrations |
| **Multi-Model** | Claude only (model IDs like `claude-sonnet-4-5`) | Vendor-agnostic | 23+ model providers |
| **Performance** | Optimized for Claude | Low latency, efficient tokens | Fast instantiation (claim not verified) |
| **Learning Curve** | Low (Claude-familiar patterns) | Medium (graph concepts) | Low (Pythonic APIs) |
| **Debugging** | Hooks + transcript access | Full visibility into graph | Pure Python tracing |
| **MCP Support** | Native, first-class | Via integration | 10 lines of code |

### When to Use Each

```
+------------------+     +------------------+     +------------------+
| Claude Agent SDK |     |    LangGraph     |     |      Agno        |
+------------------+     +------------------+     +------------------+
         |                       |                        |
         v                       v                        v
  - All-Claude stack      - Multi-model needs     - Speed-critical apps
  - Production security   - Complex branching     - Lightweight agents
  - Built-in tools needed - Audit/compliance      - Multi-provider needs
  - MCP ecosystem         - Human-in-loop         - Minimal boilerplate
```

### Detailed Comparison Matrix

| Aspect | Claude SDK | LangGraph | Agno |
|--------|------------|-----------|------|
| **Workflow Definition** | Code + subagents | Graph DSL | Pure functions |
| **Conditional Logic** | Hooks + prompts | Explicit edges | Python conditionals |
| **Parallel Execution** | Subagent parallelization | Graph parallel nodes | Async patterns |
| **Error Handling** | Try/catch + hooks | Graph error nodes | Python exceptions |
| **Persistence** | Session resume/fork | State checkpoints | External storage |
| **Monitoring** | Hooks (Pre/Post) | Built-in tracing | Custom middleware |
| **Security** | Zero-trust, allowlists | Custom middleware | Custom middleware |
| **Deployment** | Any Python env | LangServe/custom | Any Python env |

### Unique Claude SDK Advantages

1. **In-Process MCP Servers** - No subprocess overhead for custom tools
2. **Built-in Tool Ecosystem** - File I/O, Bash, Web out-of-box
3. **Zero-Trust Security** - Explicit tool allowlists required
4. **Session Forking** - Branch conversations for experimentation
5. **Auto-Compaction** - Automatic context management
6. **Subagent Context Isolation** - Clean multi-agent boundaries

### Limitations

1. **Claude-Only** - No multi-model support
2. **No Visual Builder** - (CC-WF-Studio fills this gap)
3. **Subagent Depth** - Single level only (no nested subagents)
4. **Graph Complexity** - Less explicit than LangGraph for complex flows
5. **Ecosystem Maturity** - Newer than LangChain ecosystem

---

## Implementation Recommendations

### For Hyyve Platform (Dify-like)

#### Recommended Architecture

```
+------------------------------------------------------------------+
|                    Hyyve Platform UI                        |
+------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|                    Workflow Designer Layer                        |
|                    (CC-WF-Studio inspired)                        |
+------------------------------------------------------------------+
| Visual Canvas | Node Palette | Property Editor | Flow Validation |
+------------------------------------------------------------------+
                              |
                              | Export/Compile
                              v
+------------------------------------------------------------------+
|                    Workflow Runtime Layer                         |
|                    (Claude Agent SDK)                             |
+------------------------------------------------------------------+
| +------------+ +------------+ +------------+ +------------------+ |
| | Session    | | Subagent   | | Hook       | | MCP Server       | |
| | Manager    | | Orchestrator| | Engine    | | Registry         | |
| +------------+ +------------+ +------------+ +------------------+ |
+------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|                    Integration Layer                              |
+------------------------------------------------------------------+
| MCP Servers: | RAG Pipeline | External APIs | Data Sources       |
| - Vector DB  | - Embedding  | - JIRA/GitHub | - Databases        |
| - Document   | - Retrieval  | - Slack       | - File Systems     |
+------------------------------------------------------------------+
```

#### Node Type Mapping for Platform

| Platform Node | Implementation |
|---------------|----------------|
| **Prompt Node** | Template string with `{{variable}}` interpolation |
| **LLM Node** | `query()` with custom `system_prompt` |
| **Agent Node** | `agents` dictionary |
| **Tool Node** | Built-in tool or MCP tool call |
| **RAG Node** | Custom MCP server for vector retrieval |
| **Conditional** | `PreToolUse` hook with routing logic |
| **Loop Node** | Session resume with iteration counter |
| **Human Review** | `AskUserQuestion` tool + webhook |

#### Key Implementation Steps

1. **Phase 1: Core Runtime**
   - Implement workflow execution engine using Claude Agent SDK
   - Create session management layer for conversation state
   - Build hook system for workflow control flow

2. **Phase 2: Tool Ecosystem**
   - Develop RAG-specific MCP servers (vector DB, embeddings)
   - Create integration MCP servers (external APIs)
   - Build custom tool registry and discovery

3. **Phase 3: Visual Designer**
   - Adapt CC-WF-Studio concepts for web-based editor
   - Implement node-to-SDK compilation
   - Add validation and testing capabilities

4. **Phase 4: Production Features**
   - Multi-tenant session isolation
   - Audit logging via hooks
   - Cost tracking and rate limiting
   - A/B testing with session forking

#### Security Considerations

```python
# Production security configuration
options = ClaudeAgentOptions(
    # Explicit tool allowlist (zero-trust)
    allowed_tools=["Read", "Grep", "Glob", "mcp__rag__*"],

    # Never bypass in production
    permission_mode='default',  # NOT 'bypassPermissions'

    # Security hooks
    hooks={
        'PreToolUse': [
            HookMatcher(hooks=[validate_tool_access]),
            HookMatcher(hooks=[rate_limiter]),
            HookMatcher(hooks=[audit_logger])
        ],
        'UserPromptSubmit': [
            HookMatcher(hooks=[input_sanitizer]),
            HookMatcher(hooks=[pii_detector])
        ]
    },

    # Sandbox working directory
    cwd="/sandboxed/workspace"
)
```

---

## Sources

### Official Documentation
- [Agent SDK Overview](https://platform.claude.com/docs/en/agent-sdk/overview) - Claude Docs
- [Subagents in the SDK](https://platform.claude.com/docs/en/agent-sdk/subagents) - Claude Docs
- [MCP Integration](https://platform.claude.com/docs/en/agent-sdk/mcp) - Claude Docs
- [Custom Tools](https://platform.claude.com/docs/en/agent-sdk/custom-tools) - Claude Docs
- [Hooks](https://platform.claude.com/docs/en/agent-sdk/hooks) - Claude Docs
- [Sessions](https://platform.claude.com/docs/en/agent-sdk/sessions) - Claude Docs

### GitHub Repositories
- [claude-agent-sdk-python](https://github.com/anthropics/claude-agent-sdk-python) - Python SDK
- [claude-agent-sdk-typescript](https://github.com/anthropics/claude-agent-sdk-typescript) - TypeScript SDK
- [anthropics/skills](https://github.com/anthropics/skills) - Agent Skills Repository
- [CC-WF-Studio](https://github.com/breaking-brake/cc-wf-studio) - Visual Workflow Editor

### Engineering Blog
- [Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk) - Anthropic Engineering

### Framework Comparisons
- [14 AI Agent Frameworks Compared](https://softcery.com/lab/top-14-ai-agent-frameworks-of-2025-a-founders-guide-to-building-smarter-systems) - Softcery
- [Agno vs LangGraph](https://www.zenml.io/blog/agno-vs-langgraph) - ZenML
- [How to build AI agents with MCP: 12 framework comparison](https://clickhouse.com/blog/how-to-build-ai-agents-mcp-12-frameworks) - ClickHouse

### Additional Resources
- [Claude Code Workflow Studio - VS Marketplace](https://marketplace.visualstudio.com/items?itemName=breaking-brake.cc-wf-studio)
- [NPM Package: @anthropic-ai/claude-agent-sdk](https://www.npmjs.com/package/@anthropic-ai/claude-agent-sdk)
- [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro) - MCP Official Docs

---

*Research compiled: 2026-01-20*
*For: Hyyve Platform using BMAD Methodology*
