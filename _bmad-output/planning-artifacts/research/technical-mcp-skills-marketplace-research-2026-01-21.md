# MCP & Skills Marketplace Research

**Date:** 2026-01-21
**Researcher:** Claude (Opus 4.5)
**Status:** ✅ Verified (2026-01-21)
**Category:** Technical Architecture - Marketplace Integration
**Validation:** Comprehensive audit via DeepWiki + Context7 MCP tools

## Executive Summary

This research document analyzes how leading AI coding assistants (KiloCode, Roo Code, Cline, CC-WF-Studio) implement MCP server and Skills marketplaces. These patterns will inform the Hyyve Platform's workflow builder marketplace for quickly adding MCPs and Skills.

**Key Recommendations:**
- **Dual Registry Support**: Integrate with Official MCP Registry + Smithery.ai
- **One-Click Install**: Follow Roo Code/KiloCode pattern for marketplace UI
- **Configuration Scopes**: Support both global and project-level MCP configs
- **Skills Format**: Adopt CC-WF-Studio's SKILL.md format with YAML frontmatter
- **Search**: Implement semantic search like Smithery for discovery

---

## Table of Contents

1. [MCP Registry Ecosystem](#1-mcp-registry-ecosystem)
2. [KiloCode MCP Marketplace](#2-kilocode-mcp-marketplace)
3. [Roo Code Marketplace](#3-roo-code-marketplace)
4. [Cline MCP Integration](#4-cline-mcp-integration)
5. [CC-WF-Studio Skills System](#5-cc-wf-studio-skills-system)
6. [Configuration Formats](#6-configuration-formats)
7. [Implementation Recommendations](#7-implementation-recommendations)

---

## 1. MCP Registry Ecosystem

### 1.1 Official MCP Registry

**URL:** https://registry.modelcontextprotocol.io/

The official Anthropic-maintained registry for MCP servers.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     OFFICIAL MCP REGISTRY ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      registry.modelcontextprotocol.io                │   │
│  │                                                                       │   │
│  │  GET /v0.1/servers                                                   │   │
│  │    ?search=query           (case-insensitive substring search)       │   │
│  │    ?version=latest         (filter to latest versions only)          │   │
│  │    ?cursor=xxx             (opaque pagination cursor)                │   │
│  │    ?limit=30               (1-100, default 30)                       │   │
│  │    ?updated_since=RFC3339  (filter by update timestamp)              │   │
│  │                                                                       │   │
│  │  GET /v0.1/servers/{name}/versions                                   │   │
│  │    → Returns all available versions for a server                     │   │
│  │                                                                       │   │
│  │  GET /v0.1/servers/{name}/versions/{version}                         │   │
│  │    → Returns full metadata (use "latest" for most recent)            │   │
│  │                                                                       │   │
│  │  POST /v0.1/publish        (authenticated, publish new server)       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Server Metadata Structure (ServerResponse):                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  {                                                                   │   │
│  │    "server": {                                                       │   │
│  │      "name": "server-name",                                          │   │
│  │      "version": "1.0.0",                                             │   │
│  │      "description": "...",                                           │   │
│  │      "repository": "https://github.com/...",                         │   │
│  │      "packages": [                                                   │   │
│  │        { "registry": "npm", "name": "@org/mcp-server" }              │   │
│  │      ],                                                              │   │
│  │      "remotes": [                                                    │   │
│  │        { "type": "sse", "url": "https://..." }                       │   │
│  │      ],                                                              │   │
│  │      "_meta": { /* publisher-provided extension metadata */ }        │   │
│  │    },                                                                │   │
│  │    "_meta": {                                                        │   │
│  │      "io.modelcontextprotocol.registry/official": {                  │   │
│  │        "status": "active",       // active|deprecated|deleted        │   │
│  │        "publishedAt": "2026-01-01T00:00:00Z",                        │   │
│  │        "updatedAt": "2026-01-15T00:00:00Z",                          │   │
│  │        "isLatest": true                                              │   │
│  │      }                                                               │   │
│  │    }                                                                 │   │
│  │  }                                                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Pagination Response (ServerList):                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  {                                                                   │   │
│  │    "servers": [ /* array of ServerResponse */ ],                     │   │
│  │    "metadata": {                                                     │   │
│  │      "nextCursor": "...",   // null if no more results               │   │
│  │      "count": 30            // items in current page                 │   │
│  │    }                                                                 │   │
│  │  }                                                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

> **API Version Note:** The official MCP Registry uses `/v0.1/` in API paths (e.g., `/v0.1/servers`).
> Some documentation and OpenAPI specs may reference `/v0/` - for production use, prefer `/v0.1/`.
> The registry is still in preview status and API versions may evolve.

### 1.2 Smithery.ai Registry

**URL:** https://smithery.ai/

Community-maintained registry with CLI tooling and hosted deployment options.

**Key Features:**
- Semantic search for server discovery
- Hosted and local deployment options
- CLI for cross-client installation
- API key authentication for programmatic access

```typescript
// Smithery Registry API Examples
// Base URL: https://registry.smithery.ai (NOT api.smithery.ai)

// Search servers (with semantic search)
GET https://registry.smithery.ai/servers?q=database&page=1&pageSize=10

// Get server details by qualified name
GET https://registry.smithery.ai/servers/{qualifiedName}

// Fetch connection details for installation (POST request)
POST https://registry.smithery.ai/servers/{qualifiedName}
Content-Type: application/json
Authorization: Bearer <SMITHERY_API_KEY>
{
  "connectionType": "stdio",
  "config": { /* server-specific config */ }
}

// Response structure (StdioConnection)
{
  "name": "mcp-server-sqlite",
  "qualifiedName": "anthropics/mcp-server-sqlite",
  "description": "SQLite database access",
  "version": "1.0.0",
  "owner": "anthropics",
  "repository": "https://github.com/anthropics/mcp-server-sqlite",
  // Connection details returned from POST request:
  "command": "npx",
  "args": ["-y", "@anthropic/mcp-server-sqlite"],
  "env": {}
}

// Search filters supported:
// - q: Semantic search query
// - page: Page number (default: 1)
// - pageSize: Items per page (default: 10)
// - owner:username - Filter by owner
// - repo:repository-name - Filter by repository
// - is:deployed - Filter deployed servers only

// Authentication: Bearer token required
// Get API key at: https://smithery.ai/account/api-keys
// Or set SMITHERY_BEARER_AUTH environment variable
```

### 1.3 Community Registries

| Registry | URL | Focus | Status |
|----------|-----|-------|--------|
| **MCP.so** | [mcp.so](https://mcp.so) | Server and client directory (17,400+ servers) | Active |
| **MCP Index** | [mcpindex.net](https://mcpindex.net) | Curated directory with categories | Active |
| **MCP Market** | [mcpmarket.com](https://mcpmarket.com) | Curated list with categories | Unverified |
| **Awesome MCP Servers** | [github.com/punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) | GitHub-based curated list | Active |
| **Glama MCP** | [glama.ai/mcp/servers](https://glama.ai/mcp/servers) | Directory with AI integration | Active |

> **Note:** Community registries are independently maintained and listings are not officially
> endorsed by Anthropic. Evaluate servers based on your specific requirements and security needs.

---

## 2. KiloCode MCP Marketplace

**Source:** [KiloCode Docs](https://kilo.ai/docs/features/mcp/overview)

### 2.1 Marketplace Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     KILOCODE MCP MARKETPLACE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      VSCode Extension UI                             │   │
│  │                                                                       │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │   │
│  │  │  Installed  │  │ Marketplace │  │  Configure  │                  │   │
│  │  │    Tab      │  │    Tab      │  │    Tab      │                  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                  │   │
│  │                                                                       │   │
│  │  Marketplace Tab:                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐│   │
│  │  │  [Search MCP Servers...]                                        ││   │
│  │  │                                                                  ││   │
│  │  │  Popular:                                                        ││   │
│  │  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            ││   │
│  │  │  │ 📦 SQLite    │ │ 📦 GitHub    │ │ 📦 Postgres  │            ││   │
│  │  │  │ Database     │ │ API          │ │ Database     │            ││   │
│  │  │  │ [Install]    │ │ [Install]    │ │ [Install]    │            ││   │
│  │  │  └──────────────┘ └──────────────┘ └──────────────┘            ││   │
│  │  └─────────────────────────────────────────────────────────────────┘│   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Configuration Storage:                                                      │
│  • Global: ~/.kilocode/mcp_settings.json                                    │
│  • Project: .kilocode/mcp.json (primary)                                    │
│  • Fallback: .cursor/mcp.json (Cursor compatibility)                        │
│  • Fallback: .mcp.json (root-level universal config)                        │
│                                                                              │
│  Note: Project configs checked in order: .kilocode/ → .cursor/ → .mcp.json │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Installation Flow

```typescript
// KiloCode MCP installation process
interface MCPServerConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
  disabled?: boolean;
  alwaysAllow?: string[]; // Auto-approved tools
  timeout?: number;
}

// mcp_settings.json format
interface MCPSettings {
  mcpServers: {
    [serverName: string]: MCPServerConfig;
  };
}

// Example: Installing SQLite MCP
const sqliteConfig: MCPServerConfig = {
  command: "npx",
  args: ["-y", "@anthropic/mcp-server-sqlite", "--db-path", "./data.db"],
  alwaysAllow: ["read_query", "list_tables"],
};
```

### 2.3 Key Features

| Feature | Implementation |
|---------|----------------|
| **One-Click Install** | Click "Install" → Auto-adds to config |
| **Dual Scope** | Global (all projects) or Project-level |
| **Auto-Detection** | Kilo auto-selects MCPs based on task |
| **Transport Support** | STDIO and SSE transports |
| **Tool Permissions** | `alwaysAllow` for auto-approval |

---

## 3. Roo Code Marketplace

**Source:** [Roo Code Docs](https://docs.roocode.com/features/marketplace)

### 3.1 Marketplace UI

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     ROO CODE MARKETPLACE                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [🏪 Marketplace Icon]  ← Click in top menu bar                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Roo Code Marketplace                                                │   │
│  │                                                                       │   │
│  │  Categories:                                                          │   │
│  │  [All] [MCP Servers] [Modes] [Prompts]                               │   │
│  │                                                                       │   │
│  │  ┌───────────────────────────────────────────────────────────────┐  │   │
│  │  │  Context7                                    ⭐ Recommended    │  │   │
│  │  │  General-purpose MCP server with search tools                 │  │   │
│  │  │                                                               │  │   │
│  │  │  [Install Global] [Install Project]                           │  │   │
│  │  └───────────────────────────────────────────────────────────────┘  │   │
│  │                                                                       │   │
│  │  ┌───────────────────────────────────────────────────────────────┐  │   │
│  │  │  Brave Search                                                  │  │   │
│  │  │  Web search capabilities via Brave API                        │  │   │
│  │  │                                                               │  │   │
│  │  │  [Install Global] [Install Project]                           │  │   │
│  │  └───────────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Installation Scopes:                                                        │
│  • Global: Managed via VSCode extension globalStorage                       │
│    (typically in Code/User/globalStorage/roo-coder.roo-coder/)              │
│    Accessible via "Edit Global MCP Settings" in UI                          │
│  • Project: .roo/mcp.json (commit to version control)                       │
│    Project-level configs take precedence over global for same server name  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Configuration Format

```json
// .roo/mcp.json (project-level)
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "${POSTGRES_URL}"
      }
    }
  }
}
```

### 3.3 MCP Server Installation Methods

Roo Code provides multiple ways to install MCP servers:

#### Built-in Marketplace Installation (Recommended)
The primary method is through Roo Code's built-in marketplace UI, which handles:
- One-click installation with automatic config updates
- Scope selection (global vs project)
- Dependency management

#### Manual Configuration
Add servers directly to configuration files:

```json
// .roo/mcp.json (project-level) or global mcp_settings.json
{
  "mcpServers": {
    "my-server": {
      "command": "npx",
      "args": ["-y", "@scope/mcp-server-name"]
    }
  }
}
```

#### AI-Assisted Server Creation
Enable "MCP Server Creation" in settings to let Roo Code build custom servers:
1. Check "Enable MCP Server Creation" in MCP settings panel
2. Describe the tool/capability you need
3. Roo Code generates and installs the server

> **Note:** A third-party CLI tool (`roo-mcp`) at `github.com/robertheadley/Roo-Code-MCP-installer`
> has been referenced in some documentation, but its availability and maintenance status
> could not be verified. Use the built-in marketplace for reliable installation.

---

## 4. Cline MCP Integration

**Source:** [Cline Docs](https://docs.cline.bot/mcp/configuring-mcp-servers)

### 4.1 Configuration UI

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CLINE MCP CONFIGURATION                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Top Navigation: [MCP Servers Icon]                                          │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Tabs: [Installed] [Marketplace] [Configure]                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Installed Tab:                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ┌───────────────────────────────────────────────────────────────┐  │   │
│  │  │  📦 filesystem                                    [🔄] [⚙️]   │  │   │
│  │  │  Status: ● Running                               [Toggle On]  │  │   │
│  │  │  Tools: read_file, write_file, list_directory                 │  │   │
│  │  │  Network Timeout: [1 minute ▼]                                │  │   │
│  │  └───────────────────────────────────────────────────────────────┘  │   │
│  │                                                                       │   │
│  │  [Advanced MCP Settings] → Opens cline_mcp_settings.json             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Marketplace Tab:                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Search: [Search MCP servers...]                                     │   │
│  │                                                                       │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                 │   │
│  │  │ sqlite       │ │ brave-search │ │ puppeteer    │                 │   │
│  │  │ [Install]    │ │ [Install]    │ │ [Install]    │                 │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Configuration Storage

```typescript
// cline_mcp_settings.json location
// Cline uses the ~/.cline/ directory (NOT VSCode globalStorage)
//
// Platform-specific paths:
// macOS:   /Users/<username>/.cline/cline_mcp_settings.json
// Linux:   /home/<username>/.cline/cline_mcp_settings.json
// Windows: C:\Users\<username>\.cline\cline_mcp_settings.json
//
// The settings directory is created by getClineHomePath() function
// which uses the user's home directory + ".cline" subdirectory

interface ClineMCPSettings {
  mcpServers: {
    [name: string]: {
      command: string;
      args: string[];
      env?: Record<string, string>;
      disabled?: boolean;
      autoApprove?: string[];  // Auto-approved tools
      timeout?: number;        // Network timeout (ms)
    };
  };
}
```

### 4.3 Configuration Management

> **Note:** Cline does NOT support the `chat.mcp.discovery.enabled` setting for cross-tool
> configuration sharing. Each tool (Cline, Claude Desktop, Copilot) maintains its own
> separate MCP configuration files.

Cline's `McpHub` service manages MCP server configurations with:
- File watching for automatic reconnection on config changes
- `isUpdatingClineSettings` flag to prevent unnecessary reconnections
- Support for remote configuration synchronization via `isUpdatingFromRemoteConfig`

```typescript
// McpHub manages the settings file lifecycle
class McpHub {
  private async getMcpSettingsFilePath(): Promise<string> {
    const homePath = getClineHomePath(); // ~/.cline/
    return path.join(homePath, 'cline_mcp_settings.json');
  }
}
```

---

## 5. CC-WF-Studio Skills System

**Source:** [CC-WF-Studio GitHub](https://github.com/breaking-brake/cc-wf-studio)

### 5.1 Skills Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CC-WF-STUDIO SKILLS SYSTEM                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Skill Discovery Locations:                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ~/.claude/skills/          → User skills (personal)                │   │
│  │  .claude/skills/            → Project skills (team-shared)          │   │
│  │  plugins/*/skills/          → Plugin skills (installed extensions)  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  SkillService (Extension Host):                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  scanAllSkills()                                                     │   │
│  │    ├── scanUserSkills()     → ~/.claude/skills/                     │   │
│  │    ├── scanProjectSkills()  → .claude/skills/                       │   │
│  │    └── scanPluginSkills()   → plugins/*/skills/                     │   │
│  │                                                                       │   │
│  │  Returns: SkillMetadata[]                                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Skill Browser Dialog (Webview):                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Tabs: [User] [Project] [Local]                                      │   │
│  │                                                                       │   │
│  │  [🔍 Filter skills...]                                               │   │
│  │                                                                       │   │
│  │  ┌───────────────────────────────────────────────────────────────┐  │   │
│  │  │  📄 api-docs                                                   │  │   │
│  │  │  Launch the API documentation specialist for OpenAPI specs    │  │   │
│  │  │  Allowed tools: Read, Grep, WebFetch                          │  │   │
│  │  │  [Add to Workflow]                                             │  │   │
│  │  └───────────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 SKILL.md Format

```markdown
---
name: api-docs
description: Launch the API documentation specialist for OpenAPI specs
allowed-tools: Read, Grep, WebFetch
---

# API Documentation Skill

## Instructions

When the user wants to work with API documentation:

1. Look for OpenAPI/Swagger files (openapi.yaml, swagger.json, etc.)
2. Parse the specification using appropriate tools
3. Generate documentation based on the spec

## Examples

- "Generate docs for my API"
- "What endpoints does the auth service have?"

## Output Format

Return documentation in markdown format with:
- Endpoint descriptions
- Request/response examples
- Authentication requirements
```

### 5.3 Skill Node in Workflows

```typescript
// workflow-schema.json - Skill Node Definition
interface SkillNode {
  id: string;
  type: 'skill';
  data: {
    name: string;
    description: string;
    scope: 'user' | 'project' | 'local';
    skillPath: string;
    allowedTools: string[];
    validationStatus: 'valid' | 'invalid' | 'not_found';
    outputPorts: OutputPort[];
  };
  position: { x: number; y: number };
}

// When added to workflow, resolves path
function resolveSkillPaths(nodes: Node[]): Node[] {
  return nodes.map(node => {
    if (node.type === 'skill') {
      const resolved = findSkillByName(node.data.name);
      return {
        ...node,
        data: {
          ...node.data,
          skillPath: resolved?.path ?? '',
          validationStatus: resolved ? 'valid' : 'not_found'
        }
      };
    }
    return node;
  });
}
```

### 5.4 AI-Assisted Skill Discovery

CC-WF-Studio uses AI to suggest relevant skills during workflow refinement:

```typescript
// refinement-service.ts
async function refineWorkflow(userMessage: string, currentWorkflow: Workflow) {
  // Scan available skills
  const allSkills = await skillService.scanAllSkills();

  // Filter by relevance to user message
  const relevantSkills = allSkills.filter(skill =>
    isRelevantToMessage(skill, userMessage)
  );

  // Include in AI prompt
  const prompt = buildRefinementPrompt({
    userMessage,
    currentWorkflow,
    availableSkills: relevantSkills.map(s => ({
      name: s.name,
      description: s.description,
      allowedTools: s.allowedTools
    }))
  });

  // AI can suggest adding skill nodes
  return await generateWorkflowChanges(prompt);
}
```

---

## 6. Configuration Formats

### 6.1 Unified MCP Configuration

```typescript
// Common format across tools
interface MCPServerConfig {
  // Required
  command: string;           // Executable (npx, node, python, etc.)
  args: string[];            // Command arguments

  // Optional
  env?: Record<string, string>;  // Environment variables
  disabled?: boolean;            // Enable/disable toggle
  alwaysAllow?: string[];        // Auto-approved tools
  timeout?: number;              // Network timeout (ms)

  // Metadata (for marketplace)
  displayName?: string;
  description?: string;
  repository?: string;
  version?: string;
}

// Configuration file format
interface MCPSettingsFile {
  mcpServers: {
    [serverName: string]: MCPServerConfig;
  };
}
```

### 6.2 Skill Configuration

```typescript
// SKILL.md frontmatter schema
interface SkillFrontmatter {
  name: string;          // ^[a-z0-9-]+$ pattern, 1-64 chars
  description: string;   // 1-1024 chars
  'allowed-tools'?: string;  // Comma-separated tool names
}

// Full skill metadata
interface SkillMetadata extends SkillFrontmatter {
  // Computed
  path: string;          // Absolute path to SKILL.md
  scope: 'user' | 'project' | 'plugin';
  instructions: string;  // Markdown content after frontmatter

  // Validation
  isValid: boolean;
  errors?: string[];
}
```

### 6.3 Marketplace Entry Format

```typescript
// Registry entry for MCP or Skill
interface MarketplaceEntry {
  // Identity
  id: string;
  name: string;
  qualifiedName: string;  // org/name format
  version: string;

  // Display
  displayName: string;
  description: string;
  icon?: string;

  // Categorization
  type: 'mcp' | 'skill' | 'mode' | 'prompt';
  categories: string[];
  tags: string[];

  // Source
  repository: string;
  homepage?: string;
  author: {
    name: string;
    url?: string;
  };

  // Stats
  downloads: number;
  rating?: number;
  featured: boolean;
  verified: boolean;

  // Installation
  installation: {
    command: string;
    args: string[];
    env?: Record<string, string>;
    configTemplate?: Record<string, any>;
  };

  // Timestamps
  publishedAt: string;
  updatedAt: string;
}
```

---

## 7. Implementation Recommendations

### 7.1 Platform Marketplace Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 HYYVE PLATFORM - MCP/SKILLS MARKETPLACE                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      MARKETPLACE UI (React)                          │   │
│  │                                                                       │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐│   │
│  │  │  Tabs: [MCP Servers] [Skills] [Templates] [Community]           ││   │
│  │  └─────────────────────────────────────────────────────────────────┘│   │
│  │                                                                       │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐│   │
│  │  │  [🔍 Search...]  [Category ▼]  [Sort: Popular ▼]               ││   │
│  │  └─────────────────────────────────────────────────────────────────┘│   │
│  │                                                                       │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │ 📦 sqlite   │ │ 📦 postgres │ │ 📦 github   │ │ 📦 brave    │   │   │
│  │  │ ⭐ 4.8 (200)│ │ ⭐ 4.9 (150)│ │ ⭐ 4.7 (180)│ │ ⭐ 4.6 (90) │   │   │
│  │  │ [+ Add]     │ │ [+ Add]     │ │ [+ Add]     │ │ [+ Add]     │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      REGISTRY AGGREGATOR                             │   │
│  │                                                                       │   │
│  │  Sources:                                                             │   │
│  │  ├── Official MCP Registry (registry.modelcontextprotocol.io)        │   │
│  │  ├── Smithery Registry (registry.smithery.ai)                        │   │
│  │  ├── Platform Registry (internal marketplace)                         │   │
│  │  └── Project Skills (.claude/skills/, ~/.claude/skills/)             │   │
│  │                                                                       │   │
│  │  Caching: Redis + Supabase for metadata                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      INSTALLATION MANAGER                            │   │
│  │                                                                       │   │
│  │  Scopes:                                                              │   │
│  │  ├── Global (workspace-wide, all projects)                           │   │
│  │  ├── Project (specific project only)                                 │   │
│  │  └── Workflow (specific workflow config)                             │   │
│  │                                                                       │   │
│  │  Storage:                                                             │   │
│  │  ├── Global: workspace.mcp_settings in Supabase                      │   │
│  │  ├── Project: project.mcp_config in Supabase                         │   │
│  │  └── Workflow: workflow.nodes[type=mcp] in workflow JSON             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Database Schema

```sql
-- Marketplace items (cached from registries + internal)
CREATE TABLE marketplace_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity
  qualified_name TEXT NOT NULL UNIQUE,  -- org/name
  name TEXT NOT NULL,
  version TEXT NOT NULL,

  -- Type
  item_type TEXT NOT NULL CHECK (item_type IN ('mcp', 'skill', 'template', 'mode')),

  -- Display
  display_name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,

  -- Categorization
  categories TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',

  -- Source
  source_registry TEXT NOT NULL,  -- 'official', 'smithery', 'internal'
  repository_url TEXT,
  homepage_url TEXT,
  author_name TEXT,
  author_url TEXT,

  -- Stats
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(3,2),
  rating_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,

  -- Installation config (JSONB)
  installation_config JSONB NOT NULL,

  -- Timestamps
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  synced_at TIMESTAMPTZ DEFAULT now(),

  created_at TIMESTAMPTZ DEFAULT now()
);

-- User/project installations
CREATE TABLE installed_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Scope
  workspace_id UUID REFERENCES workspaces(id),
  project_id UUID REFERENCES projects(id),

  -- Item reference
  marketplace_item_id UUID REFERENCES marketplace_items(id),
  installed_version TEXT NOT NULL,

  -- Configuration overrides
  config_overrides JSONB DEFAULT '{}',

  -- State
  is_enabled BOOLEAN DEFAULT true,

  -- Timestamps
  installed_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Constraints
  CONSTRAINT scope_check CHECK (
    (workspace_id IS NOT NULL AND project_id IS NULL) OR
    (workspace_id IS NULL AND project_id IS NOT NULL)
  )
);

-- Indexes
CREATE INDEX idx_marketplace_type ON marketplace_items(item_type);
CREATE INDEX idx_marketplace_categories ON marketplace_items USING GIN (categories);
CREATE INDEX idx_marketplace_tags ON marketplace_items USING GIN (tags);
CREATE INDEX idx_installed_workspace ON installed_items(workspace_id);
CREATE INDEX idx_installed_project ON installed_items(project_id);
```

### 7.3 Registry Aggregator Service

```typescript
// src/services/marketplace/registry-aggregator.ts
import { Redis } from 'ioredis';

interface RegistrySource {
  name: string;
  baseUrl: string;
  apiKey?: string;
  fetchServers(): Promise<MarketplaceEntry[]>;
}

class RegistryAggregator {
  private sources: RegistrySource[];
  private cache: Redis;
  private cacheTTL = 3600; // 1 hour

  constructor(sources: RegistrySource[], cache: Redis) {
    this.sources = sources;
    this.cache = cache;
  }

  async search(query: string, filters?: {
    type?: 'mcp' | 'skill';
    categories?: string[];
    verified?: boolean;
  }): Promise<MarketplaceEntry[]> {
    // Check cache first
    const cacheKey = `marketplace:search:${JSON.stringify({ query, filters })}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // Fetch from all sources in parallel
    const results = await Promise.all(
      this.sources.map(source => this.fetchFromSource(source, query, filters))
    );

    // Merge and deduplicate
    const merged = this.mergeResults(results.flat());

    // Sort by relevance + popularity
    const sorted = this.sortByRelevance(merged, query);

    // Cache results
    await this.cache.setex(cacheKey, this.cacheTTL, JSON.stringify(sorted));

    return sorted;
  }

  async getItem(qualifiedName: string): Promise<MarketplaceEntry | null> {
    const cacheKey = `marketplace:item:${qualifiedName}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // Try each source
    for (const source of this.sources) {
      try {
        const item = await source.fetchItem(qualifiedName);
        if (item) {
          await this.cache.setex(cacheKey, this.cacheTTL, JSON.stringify(item));
          return item;
        }
      } catch (error) {
        console.warn(`Failed to fetch from ${source.name}:`, error);
      }
    }

    return null;
  }

  private mergeResults(results: MarketplaceEntry[]): MarketplaceEntry[] {
    const seen = new Map<string, MarketplaceEntry>();

    for (const item of results) {
      const existing = seen.get(item.qualifiedName);
      if (!existing || item.updatedAt > existing.updatedAt) {
        seen.set(item.qualifiedName, item);
      }
    }

    return Array.from(seen.values());
  }
}

// Registry source implementations
class OfficialMCPRegistry implements RegistrySource {
  name = 'official';
  baseUrl = 'https://registry.modelcontextprotocol.io';

  async fetchServers(query?: string): Promise<MarketplaceEntry[]> {
    const params = new URLSearchParams({
      version: 'latest',
      ...(query && { search: query })
    });

    const response = await fetch(`${this.baseUrl}/v0.1/servers?${params}`);
    const data = await response.json();

    return data.servers.map(this.mapToMarketplaceEntry);
  }

  private mapToMarketplaceEntry(server: any): MarketplaceEntry {
    return {
      id: server.name,
      name: server.name,
      qualifiedName: server.name,
      version: server.version,
      displayName: server.name,
      description: server.description,
      type: 'mcp',
      categories: [],
      tags: [],
      repository: server.repository_url,
      author: { name: server.author || 'Unknown' },
      downloads: 0,
      featured: false,
      verified: true, // Official registry
      installation: {
        command: 'npx',
        args: server.packages?.[0]?.name
          ? ['-y', server.packages[0].name]
          : [],
      },
      publishedAt: server.published_at,
      updatedAt: server.updated_at,
    };
  }
}

class SmitheryRegistry implements RegistrySource {
  name = 'smithery';
  // IMPORTANT: Use registry.smithery.ai, NOT api.smithery.ai
  baseUrl = 'https://registry.smithery.ai';
  apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async fetchServers(query?: string): Promise<MarketplaceEntry[]> {
    // Smithery uses semantic search via 'q' parameter
    const params = new URLSearchParams({
      ...(query && { q: query }),
      page: '1',
      pageSize: '50',
    });

    const response = await fetch(
      `${this.baseUrl}/servers?${params}`,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );

    const data = await response.json();
    return data.servers.map(this.mapToMarketplaceEntry);
  }

  // Fetch connection details for a specific server (requires POST)
  async fetchConnectionDetails(qualifiedName: string, config: Record<string, any> = {}): Promise<{
    command: string;
    args: string[];
    env: Record<string, string>;
  }> {
    const response = await fetch(
      `${this.baseUrl}/servers/${qualifiedName}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          connectionType: 'stdio',
          config,
        }),
      }
    );

    const data = await response.json();
    // Returns StdioConnection schema
    return {
      command: data.command,
      args: data.args || [],
      env: data.env || {},
    };
  }

  private mapToMarketplaceEntry(server: any): MarketplaceEntry {
    // Map Smithery response format to our format
    return {
      id: server.qualifiedName,
      name: server.name,
      qualifiedName: server.qualifiedName,
      version: server.version || 'latest',
      displayName: server.displayName || server.name,
      description: server.description,
      type: 'mcp',
      categories: server.categories || [],
      tags: server.tags || [],
      repository: server.repository,
      author: { name: server.owner },
      downloads: server.installs || 0,
      featured: server.featured || false,
      verified: server.verified || false,
      // Note: Installation details require a separate POST request
      // to /servers/{qualifiedName} with connectionType: "stdio"
      installation: {
        command: 'npx',  // Placeholder - fetch actual via fetchConnectionDetails()
        args: [],
      },
      publishedAt: server.publishedAt,
      updatedAt: server.updatedAt,
    };
  }
}
```

### 7.4 Marketplace UI Component

```tsx
// src/features/marketplace/components/MarketplaceBrowser.tsx
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MarketplaceBrowserProps {
  projectId: string;
  onItemSelected?: (item: MarketplaceEntry) => void;
  mode: 'browse' | 'select'; // Browse for management, select for workflow builder
}

export function MarketplaceBrowser({
  projectId,
  onItemSelected,
  mode
}: MarketplaceBrowserProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [itemType, setItemType] = useState<'all' | 'mcp' | 'skill'>('all');

  const { data: items, isLoading } = useQuery({
    queryKey: ['marketplace', search, category, itemType],
    queryFn: () => marketplaceApi.search({
      query: search,
      category: category !== 'all' ? category : undefined,
      type: itemType !== 'all' ? itemType : undefined,
    }),
    debounce: 300,
  });

  const installMutation = useMutation({
    mutationFn: (item: MarketplaceEntry) =>
      marketplaceApi.install(projectId, item.qualifiedName),
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {mode === 'browse' ? 'Marketplace' : 'Add MCP/Skill to Workflow'}
        </h2>
      </div>

      {/* Tabs */}
      <Tabs value={itemType} onValueChange={(v) => setItemType(v as any)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="mcp">MCP Servers</TabsTrigger>
          <TabsTrigger value="skill">Skills</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search and Filters */}
      <div className="flex gap-2">
        <Input
          placeholder="Search marketplace..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="database">Database</SelectItem>
            <SelectItem value="search">Search</SelectItem>
            <SelectItem value="api">API</SelectItem>
            <SelectItem value="file">File System</SelectItem>
            <SelectItem value="ai">AI/ML</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center py-8">Loading...</div>
        ) : items?.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No items found
          </div>
        ) : (
          items?.map((item) => (
            <MarketplaceItemCard
              key={item.qualifiedName}
              item={item}
              mode={mode}
              onInstall={() => installMutation.mutate(item)}
              onSelect={() => onItemSelected?.(item)}
              isInstalling={installMutation.isLoading}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface MarketplaceItemCardProps {
  item: MarketplaceEntry;
  mode: 'browse' | 'select';
  onInstall: () => void;
  onSelect: () => void;
  isInstalling: boolean;
}

function MarketplaceItemCard({
  item,
  mode,
  onInstall,
  onSelect,
  isInstalling
}: MarketplaceItemCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {item.icon && (
              <img src={item.icon} alt="" className="w-8 h-8 rounded" />
            )}
            <div>
              <CardTitle className="text-base">{item.displayName}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {item.qualifiedName}
              </p>
            </div>
          </div>
          <Badge variant={item.type === 'mcp' ? 'default' : 'secondary'}>
            {item.type.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {item.rating && (
              <span>⭐ {item.rating.toFixed(1)}</span>
            )}
            <span>{item.downloads.toLocaleString()} installs</span>
          </div>

          {mode === 'browse' ? (
            <Button
              size="sm"
              onClick={onInstall}
              disabled={isInstalling}
            >
              {isInstalling ? 'Installing...' : 'Install'}
            </Button>
          ) : (
            <Button size="sm" onClick={onSelect}>
              + Add
            </Button>
          )}
        </div>

        {item.verified && (
          <Badge variant="outline" className="mt-2">
            ✓ Verified
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
```

### 7.5 Workflow Builder Integration

```tsx
// src/features/workflow-builder/components/AddNodeDialog.tsx
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarketplaceBrowser } from '@/features/marketplace/components/MarketplaceBrowser';

interface AddNodeDialogProps {
  open: boolean;
  onClose: () => void;
  onAddNode: (nodeType: string, data: any) => void;
  projectId: string;
}

export function AddNodeDialog({
  open,
  onClose,
  onAddNode,
  projectId
}: AddNodeDialogProps) {
  const [tab, setTab] = useState<'basic' | 'mcp' | 'skill'>('basic');

  const handleAddMCP = (item: MarketplaceEntry) => {
    onAddNode('mcp-tool', {
      serverId: item.qualifiedName,
      serverName: item.displayName,
      installation: item.installation,
      description: item.description,
    });
    onClose();
  };

  const handleAddSkill = (item: MarketplaceEntry) => {
    onAddNode('skill', {
      skillId: item.qualifiedName,
      skillName: item.displayName,
      skillPath: item.installation.path,
      allowedTools: item.allowedTools || [],
      description: item.description,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Node to Workflow</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList>
            <TabsTrigger value="basic">Basic Nodes</TabsTrigger>
            <TabsTrigger value="mcp">MCP Servers</TabsTrigger>
            <TabsTrigger value="skill">Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <BasicNodePicker onSelect={(type) => {
              onAddNode(type, {});
              onClose();
            }} />
          </TabsContent>

          <TabsContent value="mcp">
            <MarketplaceBrowser
              projectId={projectId}
              mode="select"
              onItemSelected={handleAddMCP}
            />
          </TabsContent>

          <TabsContent value="skill">
            <MarketplaceBrowser
              projectId={projectId}
              mode="select"
              onItemSelected={handleAddSkill}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
```

### 7.6 Implementation Phases

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| **Phase 1: Registry Integration** | 2 weeks | Official MCP + Smithery API clients, caching |
| **Phase 2: Database & API** | 1 week | Schema, CRUD endpoints, search |
| **Phase 3: Marketplace UI** | 2 weeks | Browse, search, install flows |
| **Phase 4: Workflow Integration** | 1 week | MCP/Skill nodes, "Add from Marketplace" |
| **Phase 5: Skills System** | 2 weeks | SKILL.md parser, browser, validation |
| **Phase 6: Internal Registry** | 2 weeks | Platform marketplace for user submissions |

---

## 8. References

### Documentation
- [KiloCode MCP Overview](https://kilo.ai/docs/features/mcp/overview)
- [Roo Code Marketplace](https://docs.roocode.com/features/marketplace)
- [Cline MCP Configuration](https://docs.cline.bot/mcp/configuring-mcp-servers)
- [Smithery Registry API](https://smithery.ai/docs/use/registry)
- [Official MCP Registry](https://registry.modelcontextprotocol.io/)

### Source Code
- [CC-WF-Studio Skills System](https://github.com/breaking-brake/cc-wf-studio)
- [Smithery CLI](https://github.com/smithery-ai/cli)
- [Roo Code](https://github.com/RooVetGit/Roo-Code) - Main repository with MCP marketplace
- [KiloCode](https://github.com/Kilo-Org/kilocode) - MCP marketplace implementation
- [Cline](https://github.com/cline/cline) - MCP integration with ~/.cline/ config
- [MCP Registry](https://github.com/modelcontextprotocol/registry) - Official registry source

### Community Resources
- [MCP Market](https://mcpmarket.com/)
- [MCP Index](https://mcpindex.net/)
- [MCP.so](https://mcp.so/)
