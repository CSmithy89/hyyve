/**
 * Database Query Tool
 *
 * Built-in MCP tool for read-only database queries.
 */

import {
  type Tool,
  type ToolHandler,
  type ToolRegistration,
} from '../types';

/**
 * Database query input parameters
 */
interface DatabaseQueryInput {
  query: string;
  params?: unknown[];
  database?: string;
  timeout?: number;
}

/**
 * Database query output
 */
interface DatabaseQueryResult {
  rows: unknown[];
  rowCount: number;
  fields: string[];
}

/**
 * Database query tool definition
 */
export const databaseTool: Tool = {
  name: 'database_query',
  description:
    'Execute read-only SQL queries against the configured database. Only SELECT statements are allowed for safety.',
  category: 'data',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'SQL query to execute (SELECT only)',
      },
      params: {
        type: 'array',
        description: 'Query parameters for parameterized queries',
      },
      database: {
        type: 'string',
        description: 'Database name to query (uses default if not specified)',
      },
      timeout: {
        type: 'number',
        description: 'Query timeout in milliseconds',
        default: 30000,
      },
    },
    required: ['query'],
  },
};

/**
 * Validate that query is read-only
 */
function isReadOnlyQuery(query: string): boolean {
  const trimmed = query.trim().toUpperCase();

  // Only allow SELECT, WITH (for CTEs), and EXPLAIN
  const allowedPrefixes = ['SELECT', 'WITH', 'EXPLAIN'];
  const startsWithAllowed = allowedPrefixes.some((prefix) =>
    trimmed.startsWith(prefix)
  );

  // Block dangerous keywords even in subqueries
  const dangerousKeywords = [
    'INSERT',
    'UPDATE',
    'DELETE',
    'DROP',
    'CREATE',
    'ALTER',
    'TRUNCATE',
    'GRANT',
    'REVOKE',
    'EXEC',
    'EXECUTE',
  ];
  const containsDangerous = dangerousKeywords.some((keyword) =>
    trimmed.includes(keyword)
  );

  return startsWithAllowed && !containsDangerous;
}

/**
 * Database query handler
 *
 * Note: This is a scaffold. Actual database connection should be injected.
 */
export const databaseHandler: ToolHandler<
  DatabaseQueryInput,
  DatabaseQueryResult
> = async (input) => {
  const { query, params = [], timeout = 30000 } = input;

  // Validate read-only
  if (!isReadOnlyQuery(query)) {
    throw new Error(
      'Only read-only queries (SELECT, WITH, EXPLAIN) are allowed'
    );
  }

  // This is a scaffold - actual implementation would use a database client
  // For now, return a placeholder response
  console.warn(
    '[MCP Database Tool] Query execution not implemented. Query:',
    query,
    'Params:',
    params,
    'Timeout:',
    timeout
  );

  return {
    rows: [],
    rowCount: 0,
    fields: [],
  };
};

/**
 * Database tool registration
 */
export const databaseToolRegistration: ToolRegistration = {
  tool: databaseTool,
  handler: databaseHandler as ToolHandler,
};
