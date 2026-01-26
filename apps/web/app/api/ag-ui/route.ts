/**
 * AG-UI SSE Endpoint
 *
 * This route handles Server-Sent Events (SSE) for AG-UI protocol communication.
 * It provides real-time streaming of agent responses to the frontend.
 *
 * @see https://docs.ag-ui.com/concepts/events
 */

import { NextRequest } from 'next/server';
import { AGUIEventType } from '@/lib/protocols/types';

// ============================================================================
// Types
// ============================================================================

interface AGUIRequestParams {
  agentId?: string;
  threadId?: string;
  input?: unknown;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// SSE Helper Functions
// ============================================================================

/**
 * Create an SSE message string
 */
function createSSEMessage(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

/**
 * Create a standard SSE event
 */
function createEvent(type: string, payload: Record<string, unknown> = {}): string {
  return createSSEMessage('message', {
    type,
    timestamp: Date.now(),
    ...payload,
  });
}

// ============================================================================
// Route Handler
// ============================================================================

/**
 * GET handler for AG-UI SSE endpoint
 *
 * Establishes an SSE connection and streams agent events to the client.
 * This is a placeholder implementation that demonstrates the SSE pattern.
 * In production, this will connect to AgentOS backend for real agent execution.
 */
export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url);

  // Parse request parameters
  const params: AGUIRequestParams = {
    agentId: searchParams.get('agentId') ?? undefined,
    threadId: searchParams.get('threadId') ?? undefined,
    input: searchParams.get('input') ? JSON.parse(searchParams.get('input')!) : undefined,
    metadata: searchParams.get('metadata')
      ? JSON.parse(searchParams.get('metadata')!)
      : undefined,
  };

  // Generate a unique run ID
  const runId = crypto.randomUUID();

  // Create a ReadableStream for SSE
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      // Helper to send events
      const sendEvent = (type: string, payload: Record<string, unknown> = {}) => {
        controller.enqueue(encoder.encode(createEvent(type, { runId, ...payload })));
      };

      try {
        // Send RUN_STARTED event
        sendEvent(AGUIEventType.RUN_STARTED, {
          agentId: params.agentId,
          threadId: params.threadId,
          metadata: params.metadata,
        });

        // Placeholder: In production, this connects to AgentOS
        // For now, send a simple acknowledgment message

        // Send TEXT_MESSAGE_START
        const messageId = crypto.randomUUID();
        sendEvent(AGUIEventType.TEXT_MESSAGE_START, {
          messageId,
          role: 'assistant',
        });

        // Send placeholder content
        const content = `AG-UI endpoint ready. Agent: ${params.agentId ?? 'default'}`;
        sendEvent(AGUIEventType.TEXT_MESSAGE_CONTENT, {
          messageId,
          content,
        });

        // Send TEXT_MESSAGE_END
        sendEvent(AGUIEventType.TEXT_MESSAGE_END, {
          messageId,
        });

        // Send STATE_SNAPSHOT with current state
        sendEvent(AGUIEventType.STATE_SNAPSHOT, {
          state: {
            agentId: params.agentId,
            threadId: params.threadId,
            status: 'ready',
          },
        });

        // Send RUN_FINISHED event
        sendEvent(AGUIEventType.RUN_FINISHED, {
          output: { message: content },
        });
      } catch (error) {
        // Send RUN_ERROR event
        sendEvent(AGUIEventType.RUN_ERROR, {
          error: {
            message: error instanceof Error ? error.message : 'Unknown error',
            code: 'INTERNAL_ERROR',
          },
        });
      } finally {
        controller.close();
      }
    },
  });

  // Return SSE response
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}

/**
 * POST handler for AG-UI SSE endpoint
 *
 * Alternative entry point that accepts JSON body instead of query params.
 */
export async function POST(request: NextRequest): Promise<Response> {
  const body = await request.json();

  // Convert body to query params and delegate to GET handler
  const url = new URL(request.url);
  if (body.agentId) url.searchParams.set('agentId', body.agentId);
  if (body.threadId) url.searchParams.set('threadId', body.threadId);
  if (body.input) url.searchParams.set('input', JSON.stringify(body.input));
  if (body.metadata) url.searchParams.set('metadata', JSON.stringify(body.metadata));

  const newRequest = new NextRequest(url, {
    method: 'GET',
    headers: request.headers,
  });

  return GET(newRequest);
}
