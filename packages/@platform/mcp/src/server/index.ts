/**
 * MCP Server Implementation
 *
 * Provides tool registration, execution, and streaming support.
 */

import {
  type Tool,
  type ToolInput,
  type ToolResult,
  type ToolResultChunk,
  type ToolHandler,
  type StreamingToolHandler,
  type ToolRegistration,
  type MCPServerConfig,
  MCPError,
  MCPErrorCode,
  toolInputSchema,
} from '../types';
import { ToolRegistry } from '../registry';

/**
 * Default server configuration
 */
const DEFAULT_CONFIG: Required<MCPServerConfig> = {
  name: 'hyyve-mcp-server',
  version: '1.0.0',
  maxConcurrent: 10,
  defaultTimeout: 30000,
};

/**
 * MCP Server class
 *
 * Manages tool registration and execution following MCP specification.
 */
export class MCPServer {
  private config: Required<MCPServerConfig>;
  private registry: ToolRegistry;
  private handlers: Map<string, ToolHandler> = new Map();
  private streamingHandlers: Map<string, StreamingToolHandler> = new Map();
  private activeExecutions = 0;

  constructor(config: MCPServerConfig = { name: 'mcp-server', version: '1.0.0' }) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.registry = new ToolRegistry();
  }

  /**
   * Register a tool with its handler
   */
  registerTool(registration: ToolRegistration): void {
    const { tool, handler, streamingHandler } = registration;

    // Register tool in registry
    this.registry.register(tool);

    // Store handlers
    this.handlers.set(tool.name, handler);
    if (streamingHandler) {
      this.streamingHandlers.set(tool.name, streamingHandler);
    }
  }

  /**
   * Register multiple tools at once
   */
  registerTools(registrations: ToolRegistration[]): void {
    for (const registration of registrations) {
      this.registerTool(registration);
    }
  }

  /**
   * Unregister a tool
   */
  unregisterTool(name: string): boolean {
    const removed = this.registry.unregister(name);
    if (removed) {
      this.handlers.delete(name);
      this.streamingHandlers.delete(name);
    }
    return removed;
  }

  /**
   * Execute a tool with the given input
   */
  async executeTool(input: ToolInput): Promise<ToolResult> {
    // Validate input
    const parseResult = toolInputSchema.safeParse(input);
    if (!parseResult.success) {
      throw new MCPError(
        `Invalid tool input: ${parseResult.error.message}`,
        MCPErrorCode.InvalidParams
      );
    }

    // Check concurrent execution limit
    if (this.activeExecutions >= this.config.maxConcurrent) {
      throw new MCPError(
        'Maximum concurrent executions reached',
        MCPErrorCode.RateLimitExceeded
      );
    }

    // Get tool and handler
    const tool = this.registry.get(input.name);
    if (!tool) {
      throw new MCPError(
        `Tool not found: ${input.name}`,
        MCPErrorCode.ToolNotFound
      );
    }

    const handler = this.handlers.get(input.name);
    if (!handler) {
      throw new MCPError(
        `Handler not found for tool: ${input.name}`,
        MCPErrorCode.InternalError
      );
    }

    // Execute with timeout
    this.activeExecutions++;
    try {
      const result = await Promise.race([
        handler(input.arguments),
        this.createTimeout(this.config.defaultTimeout, input.name),
      ]);

      return {
        content: result,
        isError: false,
      };
    } catch (error) {
      if (error instanceof MCPError) {
        return {
          content: null,
          isError: true,
          errorMessage: error.message,
          errorCode: error.code,
        };
      }

      return {
        content: null,
        isError: true,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorCode: MCPErrorCode.ToolExecutionError,
      };
    } finally {
      this.activeExecutions--;
    }
  }

  /**
   * Execute a tool with streaming results
   */
  async *executeToolStreaming(
    input: ToolInput
  ): AsyncGenerator<ToolResultChunk> {
    // Validate input
    const parseResult = toolInputSchema.safeParse(input);
    if (!parseResult.success) {
      throw new MCPError(
        `Invalid tool input: ${parseResult.error.message}`,
        MCPErrorCode.InvalidParams
      );
    }

    // Get tool and streaming handler
    const tool = this.registry.get(input.name);
    if (!tool) {
      throw new MCPError(
        `Tool not found: ${input.name}`,
        MCPErrorCode.ToolNotFound
      );
    }

    const streamingHandler = this.streamingHandlers.get(input.name);
    if (!streamingHandler) {
      // Fall back to regular execution
      const result = await this.executeTool(input);
      yield {
        content: JSON.stringify(result.content),
        done: true,
        index: 0,
      };
      return;
    }

    // Stream results
    let index = 0;
    for await (const chunk of streamingHandler(input.arguments)) {
      yield { ...chunk, index: index++ };
    }
  }

  /**
   * List all registered tools
   */
  listTools(): Tool[] {
    return this.registry.list();
  }

  /**
   * Get server info
   */
  getInfo(): { name: string; version: string; toolCount: number } {
    return {
      name: this.config.name,
      version: this.config.version,
      toolCount: this.registry.list().length,
    };
  }

  /**
   * Create a timeout promise
   */
  private createTimeout(ms: number, toolName: string): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(
          new MCPError(
            `Tool execution timed out: ${toolName}`,
            MCPErrorCode.ToolExecutionError
          )
        );
      }, ms);
    });
  }
}

/**
 * Create a new MCP server instance
 */
export function createMCPServer(config?: MCPServerConfig): MCPServer {
  return new MCPServer(config);
}

export { MCPServer as default };
