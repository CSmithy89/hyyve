/**
 * MCP Built-in Tools
 *
 * Exports all built-in MCP tools for the Hyyve platform.
 */

// HTTP Request Tool
export {
  httpTool,
  httpHandler,
  httpToolRegistration,
} from './http';

// Database Query Tool
export {
  databaseTool,
  databaseHandler,
  databaseToolRegistration,
} from './database';

// File Operation Tool
export {
  fileTool,
  fileHandler,
  fileToolRegistration,
} from './file';

// Re-export all tool registrations as an array
import { httpToolRegistration } from './http';
import { databaseToolRegistration } from './database';
import { fileToolRegistration } from './file';

/**
 * All built-in tool registrations
 */
export const builtInTools = [
  httpToolRegistration,
  databaseToolRegistration,
  fileToolRegistration,
];
