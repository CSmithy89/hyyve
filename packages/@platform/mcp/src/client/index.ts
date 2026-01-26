/**
 * MCP Client Implementation
 *
 * Provides tool discovery and execution against MCP servers.
 */

import {
  type Tool,
  type ToolInput,
  type ToolResult,
  type ToolResultChunk,
  type MCPClientConfig,
  type ToolListResponse,
  MCPError,
  MCPErrorCode,
} from '../types';

/**
 * Default client configuration
 */
const DEFAULT_CONFIG: Required<MCPClientConfig> = {
  serverUrl: 'http://localhost:3001/mcp',
  timeout: 30000,
  retries: 3,
};

/**
 * MCP Client class
 *
 * Connects to MCP servers for tool discovery and execution.
 */
export class MCPClient {
  private config: Required<MCPClientConfig>;
  private cachedTools: Tool[] | null = null;

  constructor(config: MCPClientConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Discover available tools from the server
   */
  async discoverTools(): Promise<Tool[]> {
    if (this.cachedTools) {
      return this.cachedTools;
    }

    const response = await this.request<ToolListResponse>('tools/list', {});
    this.cachedTools = response.tools;
    return response.tools;
  }

  /**
   * List all available tools (alias for discoverTools)
   */
  async listTools(): Promise<Tool[]> {
    return this.discoverTools();
  }

  /**
   * Get available tools (synchronous if cached)
   */
  getAvailableTools(): Tool[] | null {
    return this.cachedTools;
  }

  /**
   * Refresh the tool cache
   */
  async refreshTools(): Promise<Tool[]> {
    this.cachedTools = null;
    return this.discoverTools();
  }

  /**
   * Check if a specific tool is available
   */
  async hasTools(name: string): Promise<boolean> {
    const tools = await this.discoverTools();
    return tools.some((tool) => tool.name === name);
  }

  /**
   * Get a specific tool by name
   */
  async getTool(name: string): Promise<Tool | null> {
    const tools = await this.discoverTools();
    return tools.find((tool) => tool.name === name) || null;
  }

  /**
   * Call a tool with the given arguments
   */
  async callTool(name: string, args: Record<string, unknown>): Promise<ToolResult> {
    const input: ToolInput = { name, arguments: args };
    return this.executeTool(input);
  }

  /**
   * Execute a tool with full input object
   */
  async executeTool(input: ToolInput): Promise<ToolResult> {
    return this.request<ToolResult>('tools/call', input);
  }

  /**
   * Execute a tool with streaming results
   */
  async *executeToolStreaming(
    input: ToolInput
  ): AsyncGenerator<ToolResultChunk> {
    const response = await this.streamRequest('tools/call/stream', input);

    const reader = response.body?.getReader();
    if (!reader) {
      throw new MCPError(
        'Streaming not supported',
        MCPErrorCode.InternalError
      );
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let index = 0;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const chunk = JSON.parse(line) as ToolResultChunk;
              yield { ...chunk, index: index++ };
            } catch {
              // Skip invalid JSON lines
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Invoke a tool (alias for callTool)
   */
  async invoke(name: string, args: Record<string, unknown>): Promise<ToolResult> {
    return this.callTool(name, args);
  }

  /**
   * Make a request to the MCP server
   */
  private async request<T>(method: string, params: unknown): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.config.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          this.config.timeout
        );

        const response = await fetch(`${this.config.serverUrl}/${method}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new MCPError(
            (error as { message?: string }).message || `Request failed: ${response.status}`,
            (error as { code?: MCPErrorCode }).code || MCPErrorCode.InternalError
          );
        }

        return (await response.json()) as T;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < this.config.retries - 1) {
          // Exponential backoff
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          );
        }
      }
    }

    throw lastError || new MCPError('Request failed', MCPErrorCode.InternalError);
  }

  /**
   * Make a streaming request to the MCP server
   */
  private async streamRequest(method: string, params: unknown): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.config.timeout
    );

    const response = await fetch(`${this.config.serverUrl}/${method}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify(params),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new MCPError(
        (error as { message?: string }).message || `Request failed: ${response.status}`,
        (error as { code?: MCPErrorCode }).code || MCPErrorCode.InternalError
      );
    }

    return response;
  }
}

/**
 * Create a new MCP client instance
 */
export function createMCPClient(config?: MCPClientConfig): MCPClient {
  return new MCPClient(config);
}

export { MCPClient as default };
