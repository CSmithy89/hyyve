/**
 * MCP (Model Context Protocol) Package
 *
 * Provides MCP server, client, and tool registry for the Hyyve platform.
 * Follows MCP 2025-11-25 specification for standardized tool integration.
 */

// Server exports
export { MCPServer, createMCPServer } from './server';

// Client exports
export { MCPClient, createMCPClient } from './client';

// Registry exports
export { ToolRegistry, createToolRegistry } from './registry';

// Type exports
export type {
  Tool,
  ToolInput,
  ToolResult,
  ToolResultChunk,
  ToolHandler,
  StreamingToolHandler,
  ToolRegistration,
  MCPServerConfig,
  MCPClientConfig,
  ToolListResponse,
  JSONSchema,
} from './types';

export { MCPError, MCPErrorCode, toolInputSchema, toolSchema } from './types';

// Built-in tools
export {
  httpTool,
  httpHandler,
  httpToolRegistration,
  databaseTool,
  databaseHandler,
  databaseToolRegistration,
  fileTool,
  fileHandler,
  fileToolRegistration,
  builtInTools,
} from './tools';
