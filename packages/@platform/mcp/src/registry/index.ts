/**
 * MCP Tool Registry
 *
 * Manages tool registration, lookup, and organization.
 */

import { type Tool, MCPError, MCPErrorCode, toolSchema } from '../types';

/**
 * Tool Registry class
 *
 * Provides centralized management of available tools.
 */
export class ToolRegistry {
  private tools: Map<string, Tool> = new Map();
  private toolsByCategory: Map<string, Set<string>> = new Map();

  /**
   * Register a new tool
   */
  register(tool: Tool): void {
    // Validate tool definition
    const parseResult = toolSchema.safeParse(tool);
    if (!parseResult.success) {
      throw new MCPError(
        `Invalid tool definition: ${parseResult.error.message}`,
        MCPErrorCode.ValidationError
      );
    }

    // Check for duplicate
    if (this.tools.has(tool.name)) {
      throw new MCPError(
        `Tool already registered: ${tool.name}`,
        MCPErrorCode.InvalidRequest
      );
    }

    // Add to registry
    this.tools.set(tool.name, tool);

    // Add to category index
    const category = tool.category || 'uncategorized';
    if (!this.toolsByCategory.has(category)) {
      this.toolsByCategory.set(category, new Set());
    }
    this.toolsByCategory.get(category)!.add(tool.name);
  }

  /**
   * Add a tool (alias for register)
   */
  add(tool: Tool): void {
    this.register(tool);
  }

  /**
   * Set a tool (register or replace)
   */
  set(tool: Tool): void {
    // Validate tool definition
    const parseResult = toolSchema.safeParse(tool);
    if (!parseResult.success) {
      throw new MCPError(
        `Invalid tool definition: ${parseResult.error.message}`,
        MCPErrorCode.ValidationError
      );
    }

    // Remove from old category if exists
    const existingTool = this.tools.get(tool.name);
    if (existingTool) {
      const oldCategory = existingTool.category || 'uncategorized';
      this.toolsByCategory.get(oldCategory)?.delete(tool.name);
    }

    // Add to registry
    this.tools.set(tool.name, tool);

    // Add to category index
    const category = tool.category || 'uncategorized';
    if (!this.toolsByCategory.has(category)) {
      this.toolsByCategory.set(category, new Set());
    }
    this.toolsByCategory.get(category)!.add(tool.name);
  }

  /**
   * Unregister a tool
   */
  unregister(name: string): boolean {
    const tool = this.tools.get(name);
    if (!tool) {
      return false;
    }

    // Remove from category index
    const category = tool.category || 'uncategorized';
    this.toolsByCategory.get(category)?.delete(name);

    // Remove from registry
    return this.tools.delete(name);
  }

  /**
   * Get a tool by name
   */
  get(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  /**
   * Find a tool by name (alias for get)
   */
  find(name: string): Tool | undefined {
    return this.get(name);
  }

  /**
   * Lookup a tool by name (alias for get)
   */
  lookup(name: string): Tool | undefined {
    return this.get(name);
  }

  /**
   * Check if a tool exists
   */
  has(name: string): boolean {
    return this.tools.has(name);
  }

  /**
   * List all registered tools
   */
  list(): Tool[] {
    return Array.from(this.tools.values());
  }

  /**
   * List tools by category
   */
  listByCategory(category: string): Tool[] {
    const toolNames = this.toolsByCategory.get(category);
    if (!toolNames) {
      return [];
    }
    return Array.from(toolNames)
      .map((name) => this.tools.get(name)!)
      .filter(Boolean);
  }

  /**
   * Get all categories
   */
  getCategories(): string[] {
    return Array.from(this.toolsByCategory.keys());
  }

  /**
   * Search tools by name or description
   */
  search(query: string): Tool[] {
    const lowerQuery = query.toLowerCase();
    return this.list().filter(
      (tool) =>
        tool.name.toLowerCase().includes(lowerQuery) ||
        tool.description.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get the number of registered tools
   */
  get size(): number {
    return this.tools.size;
  }

  /**
   * Clear all registered tools
   */
  clear(): void {
    this.tools.clear();
    this.toolsByCategory.clear();
  }
}

/**
 * Create a new tool registry instance
 */
export function createToolRegistry(): ToolRegistry {
  return new ToolRegistry();
}

export { ToolRegistry as default };
