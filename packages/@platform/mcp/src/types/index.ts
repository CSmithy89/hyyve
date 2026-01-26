/**
 * MCP Type Definitions
 *
 * Types for Model Context Protocol following MCP 2025-11-25 specification.
 */

import { z } from 'zod';

/**
 * JSON Schema type for tool parameters
 */
export interface JSONSchema {
  type: 'object';
  properties: Record<
    string,
    {
      type: string;
      description?: string;
      enum?: unknown[];
      default?: unknown;
    }
  >;
  required?: string[];
  additionalProperties?: boolean;
}

/**
 * MCP Tool definition
 */
export interface Tool {
  /** Unique tool identifier */
  name: string;
  /** Human-readable description */
  description: string;
  /** JSON Schema for input parameters */
  inputSchema: JSONSchema;
  /** Tool category for organization */
  category?: string;
  /** Whether tool supports streaming results */
  supportsStreaming?: boolean;
}

/**
 * Tool execution input
 */
export interface ToolInput {
  /** Tool name to execute */
  name: string;
  /** Input arguments matching tool's inputSchema */
  arguments: Record<string, unknown>;
}

/**
 * Tool execution result
 */
export interface ToolResult {
  /** Result content */
  content: unknown;
  /** Whether execution was successful */
  isError: boolean;
  /** Error message if isError is true */
  errorMessage?: string;
  /** Error code following MCP spec */
  errorCode?: MCPErrorCode;
}

/**
 * Streaming tool result chunk
 */
export interface ToolResultChunk {
  /** Partial content */
  content: string;
  /** Whether this is the final chunk */
  done: boolean;
  /** Index of this chunk */
  index: number;
}

/**
 * MCP Error codes following specification
 */
export enum MCPErrorCode {
  /** Invalid request format */
  InvalidRequest = -32600,
  /** Method not found */
  MethodNotFound = -32601,
  /** Invalid method parameters */
  InvalidParams = -32602,
  /** Internal server error */
  InternalError = -32603,
  /** Tool not found */
  ToolNotFound = -32000,
  /** Tool execution failed */
  ToolExecutionError = -32001,
  /** Permission denied */
  PermissionDenied = -32002,
  /** Rate limit exceeded */
  RateLimitExceeded = -32003,
  /** Validation error */
  ValidationError = -32004,
}

/**
 * MCP Error class for standardized error handling
 */
export class MCPError extends Error {
  constructor(
    message: string,
    public code: MCPErrorCode,
    public data?: unknown
  ) {
    super(message);
    this.name = 'MCPError';
  }
}

/**
 * Tool handler function type
 */
export type ToolHandler<TInput = unknown, TOutput = unknown> = (
  input: TInput
) => Promise<TOutput>;

/**
 * Streaming tool handler function type
 */
export type StreamingToolHandler<TInput = unknown> = (
  input: TInput
) => AsyncIterable<ToolResultChunk>;

/**
 * Tool registration options
 */
export interface ToolRegistration {
  tool: Tool;
  handler: ToolHandler;
  streamingHandler?: StreamingToolHandler;
}

/**
 * MCP Server configuration
 */
export interface MCPServerConfig {
  /** Server name */
  name: string;
  /** Server version */
  version: string;
  /** Maximum concurrent tool executions */
  maxConcurrent?: number;
  /** Default timeout for tool execution in ms */
  defaultTimeout?: number;
}

/**
 * MCP Client configuration
 */
export interface MCPClientConfig {
  /** Server URL to connect to */
  serverUrl?: string;
  /** Request timeout in ms */
  timeout?: number;
  /** Retry attempts on failure */
  retries?: number;
}

/**
 * Tool discovery response
 */
export interface ToolListResponse {
  tools: Tool[];
  nextCursor?: string;
}

/**
 * Zod schema for validating tool input
 */
export const toolInputSchema = z.object({
  name: z.string().min(1),
  arguments: z.record(z.unknown()),
});

/**
 * Zod schema for validating tool definition
 */
export const toolSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  inputSchema: z.object({
    type: z.literal('object'),
    properties: z.record(z.unknown()),
    required: z.array(z.string()).optional(),
  }),
  category: z.string().optional(),
  supportsStreaming: z.boolean().optional(),
});
