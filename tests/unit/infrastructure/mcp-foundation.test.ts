/**
 * ATDD Tests for Story 0.1.20: Configure MCP (Model Context Protocol) Foundation
 *
 * Validates MCP infrastructure for standardized tool integration.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Get project root
const projectRoot = join(__dirname, '../../..');
const mcpPackagePath = join(projectRoot, 'packages/@platform/mcp');

describe('Story 0.1.20: Configure MCP (Model Context Protocol) Foundation', () => {
  describe('MCP Package Structure', () => {
    it('should have packages/@platform/mcp directory', () => {
      expect(existsSync(mcpPackagePath)).toBe(true);
    });

    it('should have package.json with @platform/mcp name', () => {
      const packagePath = join(mcpPackagePath, 'package.json');
      expect(existsSync(packagePath)).toBe(true);

      const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
      expect(packageJson.name).toBe('@platform/mcp');
    });

    it('should have src/server directory', () => {
      expect(existsSync(join(mcpPackagePath, 'src/server'))).toBe(true);
    });

    it('should have src/client directory', () => {
      expect(existsSync(join(mcpPackagePath, 'src/client'))).toBe(true);
    });

    it('should have src/registry directory', () => {
      expect(existsSync(join(mcpPackagePath, 'src/registry'))).toBe(true);
    });

    it('should have src/types directory', () => {
      expect(existsSync(join(mcpPackagePath, 'src/types'))).toBe(true);
    });
  });

  describe('MCP Types', () => {
    let typesContent: string;

    beforeAll(() => {
      const typesPath = join(mcpPackagePath, 'src/types/index.ts');
      if (existsSync(typesPath)) {
        typesContent = readFileSync(typesPath, 'utf-8');
      }
    });

    it('should have types/index.ts file', () => {
      expect(existsSync(join(mcpPackagePath, 'src/types/index.ts'))).toBe(true);
    });

    it('should define Tool interface', () => {
      expect(typesContent).toMatch(/interface.*Tool|type.*Tool/);
    });

    it('should define ToolResult interface', () => {
      expect(typesContent).toMatch(/ToolResult/);
    });

    it('should support JSON Schema for parameters', () => {
      expect(typesContent).toMatch(/inputSchema|parameters.*schema|JSONSchema/i);
    });
  });

  describe('MCP Server', () => {
    let serverContent: string;

    beforeAll(() => {
      const serverPath = join(mcpPackagePath, 'src/server/index.ts');
      if (existsSync(serverPath)) {
        serverContent = readFileSync(serverPath, 'utf-8');
      }
    });

    it('should have server/index.ts file', () => {
      expect(existsSync(join(mcpPackagePath, 'src/server/index.ts'))).toBe(true);
    });

    it('should support tool registration', () => {
      expect(serverContent).toMatch(/register.*Tool|addTool|registerTool/i);
    });

    it('should support tool execution', () => {
      expect(serverContent).toMatch(/execute|invoke|callTool|runTool/i);
    });

    it('should have error handling', () => {
      expect(serverContent).toMatch(/error|catch|throw|MCPError/i);
    });
  });

  describe('MCP Client', () => {
    let clientContent: string;

    beforeAll(() => {
      const clientPath = join(mcpPackagePath, 'src/client/index.ts');
      if (existsSync(clientPath)) {
        clientContent = readFileSync(clientPath, 'utf-8');
      }
    });

    it('should have client/index.ts file', () => {
      expect(existsSync(join(mcpPackagePath, 'src/client/index.ts'))).toBe(true);
    });

    it('should support tool discovery', () => {
      expect(clientContent).toMatch(/discover|list.*Tool|getTools|availableTools/i);
    });

    it('should support tool calling', () => {
      expect(clientContent).toMatch(/call.*Tool|execute|invoke/i);
    });
  });

  describe('Tool Registry', () => {
    let registryContent: string;

    beforeAll(() => {
      const registryPath = join(mcpPackagePath, 'src/registry/index.ts');
      if (existsSync(registryPath)) {
        registryContent = readFileSync(registryPath, 'utf-8');
      }
    });

    it('should have registry/index.ts file', () => {
      expect(existsSync(join(mcpPackagePath, 'src/registry/index.ts'))).toBe(
        true
      );
    });

    it('should manage tool registration', () => {
      expect(registryContent).toMatch(/register|add|set/i);
    });

    it('should support tool lookup', () => {
      expect(registryContent).toMatch(/get|find|lookup|has/i);
    });
  });

  describe('Built-in Tools', () => {
    it('should have HTTP request tool', () => {
      const httpToolPath = join(mcpPackagePath, 'src/tools/http.ts');
      expect(existsSync(httpToolPath)).toBe(true);

      const content = readFileSync(httpToolPath, 'utf-8');
      expect(content).toMatch(/http|fetch|request/i);
    });

    it('should have database query tool', () => {
      const dbToolPath = join(mcpPackagePath, 'src/tools/database.ts');
      expect(existsSync(dbToolPath)).toBe(true);

      const content = readFileSync(dbToolPath, 'utf-8');
      expect(content).toMatch(/query|database|sql/i);
    });

    it('should have file operation tool', () => {
      const fileToolPath = join(mcpPackagePath, 'src/tools/file.ts');
      expect(existsSync(fileToolPath)).toBe(true);

      const content = readFileSync(fileToolPath, 'utf-8');
      expect(content).toMatch(/file|read|write/i);
    });

    it('should have tools index exporting all tools', () => {
      const toolsIndexPath = join(mcpPackagePath, 'src/tools/index.ts');
      expect(existsSync(toolsIndexPath)).toBe(true);
    });
  });

  describe('Streaming Support', () => {
    let serverContent: string;

    beforeAll(() => {
      const serverPath = join(mcpPackagePath, 'src/server/index.ts');
      if (existsSync(serverPath)) {
        serverContent = readFileSync(serverPath, 'utf-8');
      }
    });

    it('should support streaming results', () => {
      expect(serverContent).toMatch(
        /stream|async.*generator|yield|AsyncIterable/i
      );
    });
  });

  describe('Package Exports', () => {
    it('should have main index.ts exporting all modules', () => {
      const indexPath = join(mcpPackagePath, 'src/index.ts');
      expect(existsSync(indexPath)).toBe(true);

      const content = readFileSync(indexPath, 'utf-8');
      expect(content).toMatch(/export.*from.*server/);
      expect(content).toMatch(/export.*from.*client/);
      expect(content).toMatch(/export.*from.*registry/);
      expect(content).toMatch(/export.*from.*types/);
    });

    it('should have tsconfig.json', () => {
      expect(existsSync(join(mcpPackagePath, 'tsconfig.json'))).toBe(true);
    });
  });

  describe('Error Handling', () => {
    let typesContent: string;

    beforeAll(() => {
      const typesPath = join(mcpPackagePath, 'src/types/index.ts');
      if (existsSync(typesPath)) {
        typesContent = readFileSync(typesPath, 'utf-8');
      }
    });

    it('should define MCP error types', () => {
      expect(typesContent).toMatch(/Error|ErrorCode|MCPError/i);
    });
  });
});
