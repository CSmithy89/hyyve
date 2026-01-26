/**
 * File Operation Tool
 *
 * Built-in MCP tool for sandboxed file operations.
 */

import {
  type Tool,
  type ToolHandler,
  type ToolRegistration,
} from '../types';

/**
 * File operation input parameters
 */
interface FileOperationInput {
  operation: 'read' | 'write' | 'list' | 'exists' | 'stat';
  path: string;
  content?: string;
  encoding?: 'utf-8' | 'base64' | 'binary';
}

/**
 * File operation output
 */
interface FileOperationResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

/**
 * File stat information
 */
interface FileStat {
  size: number;
  isFile: boolean;
  isDirectory: boolean;
  created: string;
  modified: string;
}

/**
 * File operation tool definition
 */
export const fileTool: Tool = {
  name: 'file_operation',
  description:
    'Perform sandboxed file operations including read, write, list, and stat. All operations are restricted to allowed directories.',
  category: 'filesystem',
  inputSchema: {
    type: 'object',
    properties: {
      operation: {
        type: 'string',
        description: 'File operation to perform',
        enum: ['read', 'write', 'list', 'exists', 'stat'],
      },
      path: {
        type: 'string',
        description: 'File or directory path (relative to sandbox root)',
      },
      content: {
        type: 'string',
        description: 'Content to write (for write operation)',
      },
      encoding: {
        type: 'string',
        description: 'File encoding',
        enum: ['utf-8', 'base64', 'binary'],
        default: 'utf-8',
      },
    },
    required: ['operation', 'path'],
  },
};

/**
 * Allowed sandbox directories (configurable)
 */
const SANDBOX_ROOTS = ['/tmp/mcp-sandbox', '/var/mcp/files'];

/**
 * Validate path is within sandbox
 */
function isPathInSandbox(filePath: string): boolean {
  // Normalize path to prevent directory traversal
  const normalizedPath = filePath.replace(/\\/g, '/');

  // Check for directory traversal attempts
  if (normalizedPath.includes('..')) {
    return false;
  }

  // Check if path starts with an allowed root
  return SANDBOX_ROOTS.some((root) => normalizedPath.startsWith(root));
}

/**
 * File operation handler
 *
 * Note: This is a scaffold. Actual file system access requires Node.js fs module.
 */
export const fileHandler: ToolHandler<
  FileOperationInput,
  FileOperationResult
> = async (input) => {
  const { operation, path, content, encoding = 'utf-8' } = input;

  // Validate sandbox
  if (!isPathInSandbox(path)) {
    throw new Error(
      `Access denied: Path must be within sandbox directories: ${SANDBOX_ROOTS.join(', ')}`
    );
  }

  // This is a scaffold - actual implementation would use fs module
  console.warn(
    '[MCP File Tool] File operation not implemented. Operation:',
    operation,
    'Path:',
    path,
    'Content length:',
    content?.length,
    'Encoding:',
    encoding
  );

  switch (operation) {
    case 'read':
      return {
        success: true,
        data: '', // Would return file contents
      };

    case 'write':
      return {
        success: true,
        data: { bytesWritten: content?.length || 0 },
      };

    case 'list':
      return {
        success: true,
        data: [], // Would return directory listing
      };

    case 'exists':
      return {
        success: true,
        data: false, // Would check if file exists
      };

    case 'stat': {
      const stat: FileStat = {
        size: 0,
        isFile: true,
        isDirectory: false,
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      };
      return {
        success: true,
        data: stat,
      };
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
};

/**
 * File tool registration
 */
export const fileToolRegistration: ToolRegistration = {
  tool: fileTool,
  handler: fileHandler as ToolHandler,
};
