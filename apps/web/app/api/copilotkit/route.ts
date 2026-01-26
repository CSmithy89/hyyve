/**
 * CopilotKit Runtime Endpoint
 *
 * This route handles CopilotKit runtime communication for the chat UI.
 * It provides the backend interface for CopilotKit's React components.
 *
 * @see https://docs.copilotkit.ai/reference/classes/CopilotRuntime
 */

import { NextRequest } from 'next/server';

// ============================================================================
// Types
// ============================================================================

interface CopilotKitMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface CopilotKitRequest {
  messages: CopilotKitMessage[];
  threadId?: string;
  properties?: Record<string, unknown>;
}

// ============================================================================
// Route Handler
// ============================================================================

/**
 * POST handler for CopilotKit runtime endpoint
 *
 * This is a placeholder implementation that demonstrates the CopilotKit runtime pattern.
 * In production, this will connect to AgentOS backend for real agent execution.
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body: CopilotKitRequest = await request.json();
    const { messages, threadId, properties } = body;

    // Get the last user message
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    const userInput = lastUserMessage?.content ?? '';

    // Placeholder response
    // In production, this connects to AgentOS and returns streaming response
    const response = {
      id: crypto.randomUUID(),
      threadId: threadId ?? crypto.randomUUID(),
      messages: [
        ...messages,
        {
          role: 'assistant' as const,
          content: `CopilotKit runtime ready. Received: "${userInput.slice(0, 50)}${userInput.length > 50 ? '...' : ''}"`,
        },
      ],
      properties,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: {
          message: error instanceof Error ? error.message : 'Internal server error',
          code: 'INTERNAL_ERROR',
        },
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

/**
 * GET handler for health check
 */
export async function GET(): Promise<Response> {
  return new Response(
    JSON.stringify({
      status: 'ok',
      service: 'copilotkit-runtime',
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
