# Story 0.1.20: Configure MCP (Model Context Protocol) Foundation

## Story

As a **developer**,
I want **MCP configured for standardized tool integration**,
So that **agents can use external tools through a unified protocol**.

## Acceptance Criteria

- **Given** the Agno backend exists
- **When** I configure MCP
- **Then** MCP server infrastructure is created:
  ```
  packages/@platform/mcp/
    server/           # MCP server implementation
    client/           # MCP client for tool calls
    registry/         # Tool registration
    types/            # TypeScript types for MCP
  ```
- **And** MCP server supports:
  - Tool registration with JSON Schema parameters
  - Tool execution with validation
  - Streaming results
  - Error handling
- **And** Built-in tools are scaffolded:
  - HTTP request tool
  - Database query tool (read-only)
  - File operation tool (sandboxed)
- **And** MCP client can discover and call tools

## Technical Notes

- MCP is the standard for LLM tool integration
- Follow MCP 2025-11-25 specification
- This enables Module Builder MCP Tool nodes

## Creates

- packages/@platform/mcp/

## Implementation Tasks

1. Create @platform/mcp package structure
2. Implement MCP types following specification
3. Implement MCP server with tool registration
4. Implement MCP client for tool discovery/execution
5. Create tool registry for managing available tools
6. Scaffold HTTP request, database query, and file operation tools
7. Add streaming support for tool results
8. Add error handling with proper MCP error codes
