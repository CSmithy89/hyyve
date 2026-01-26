/**
 * HTTP Request Tool
 *
 * Built-in MCP tool for making HTTP requests.
 */

import {
  type Tool,
  type ToolHandler,
  type ToolRegistration,
} from '../types';

/**
 * HTTP request input parameters
 */
interface HttpRequestInput {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
}

/**
 * HTTP response output
 */
interface HttpResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: unknown;
}

/**
 * HTTP request tool definition
 */
export const httpTool: Tool = {
  name: 'http_request',
  description:
    'Make HTTP requests to external APIs and services. Supports GET, POST, PUT, PATCH, DELETE methods with custom headers and body.',
  category: 'network',
  inputSchema: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: 'The URL to send the request to',
      },
      method: {
        type: 'string',
        description: 'HTTP method (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS)',
        enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
        default: 'GET',
      },
      headers: {
        type: 'object',
        description: 'Request headers as key-value pairs',
      },
      body: {
        type: 'object',
        description: 'Request body (for POST, PUT, PATCH)',
      },
      timeout: {
        type: 'number',
        description: 'Request timeout in milliseconds',
        default: 30000,
      },
    },
    required: ['url'],
  },
};

/**
 * HTTP request handler
 */
export const httpHandler: ToolHandler<HttpRequestInput, HttpResponse> = async (
  input
) => {
  const {
    url,
    method = 'GET',
    headers = {},
    body,
    timeout = 30000,
  } = input;

  // Validate URL
  try {
    new URL(url);
  } catch {
    throw new Error(`Invalid URL: ${url}`);
  }

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse response headers
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    // Parse response body
    let responseBody: unknown;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      responseBody = await response.json();
    } else {
      responseBody = await response.text();
    }

    return {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseBody,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeout}ms`);
    }
    throw error;
  }
};

/**
 * HTTP tool registration
 */
export const httpToolRegistration: ToolRegistration = {
  tool: httpTool,
  handler: httpHandler as ToolHandler,
};
