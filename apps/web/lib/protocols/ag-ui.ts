/**
 * AG-UI Client Module
 *
 * This module provides the AG-UI streaming client for agent-to-UI communication.
 * It uses Server-Sent Events (SSE) to stream agent responses in real-time.
 *
 * @example
 * ```typescript
 * import { createAGUIClient, useAGUI } from '@/lib/protocols/ag-ui';
 *
 * // Using the client directly
 * const client = createAGUIClient({
 *   endpoint: '/api/ag-ui',
 *   onEvent: (event) => console.log('Event:', event),
 * });
 * await client.stream({ agentId: 'bond', input: 'Hello' });
 *
 * // Using the React hook
 * const { stream, events, isStreaming } = useAGUI();
 * await stream({ agentId: 'bond', input: 'Hello' });
 * ```
 */

import { useState, useCallback, useRef } from 'react';
import type {
  AGUIEvent,
  AGUIClientOptions,
  AGUIStreamOptions,
  AGUIEventTypeValue,
} from './types';

// Re-export types for convenience
export type { AGUIEvent, AGUIClientOptions, AGUIStreamOptions } from './types';
export { AGUIEventType } from './types';

// ============================================================================
// AG-UI Client
// ============================================================================

export interface AGUIClient {
  stream: (options: AGUIStreamOptions) => Promise<void>;
  close: () => void;
  isConnected: () => boolean;
}

/**
 * Create an AG-UI streaming client
 *
 * @param options - Client configuration options
 * @returns AG-UI client instance
 */
export function createAGUIClient(options: AGUIClientOptions = {}): AGUIClient {
  const { endpoint = '/api/ag-ui', onEvent, onError, onClose } = options;

  let eventSource: EventSource | null = null;

  const stream = async (streamOptions: AGUIStreamOptions): Promise<void> => {
    // Close any existing connection
    if (eventSource) {
      eventSource.close();
    }

    // Build query params
    const params = new URLSearchParams();
    if (streamOptions.agentId) params.set('agentId', streamOptions.agentId);
    if (streamOptions.threadId) params.set('threadId', streamOptions.threadId);
    if (streamOptions.input) params.set('input', JSON.stringify(streamOptions.input));
    if (streamOptions.metadata) params.set('metadata', JSON.stringify(streamOptions.metadata));

    const url = `${endpoint}?${params.toString()}`;

    return new Promise((resolve, reject) => {
      eventSource = new EventSource(url);

      eventSource.onopen = () => {
        // Connection established
      };

      eventSource.onmessage = (messageEvent) => {
        try {
          const event = JSON.parse(messageEvent.data) as AGUIEvent;
          onEvent?.(event);

          // Check for terminal events
          if (event.type === 'RUN_FINISHED' || event.type === 'RUN_ERROR') {
            eventSource?.close();
            eventSource = null;
            resolve();
          }
        } catch (error) {
          onError?.(error instanceof Error ? error : new Error(String(error)));
        }
      };

      eventSource.onerror = () => {
        const err = new Error('SSE connection error');
        onError?.(err);
        eventSource?.close();
        eventSource = null;
        onClose?.();
        reject(err);
      };
    });
  };

  const close = () => {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
      onClose?.();
    }
  };

  const isConnected = () => {
    return eventSource !== null && eventSource.readyState === EventSource.OPEN;
  };

  return { stream, close, isConnected };
}

// ============================================================================
// React Hook
// ============================================================================

export interface UseAGUIOptions {
  endpoint?: string;
  onEvent?: (event: AGUIEvent) => void;
  onError?: (error: Error) => void;
}

export interface UseAGUIReturn {
  stream: (options: AGUIStreamOptions) => Promise<void>;
  close: () => void;
  events: AGUIEvent[];
  lastEvent: AGUIEvent | null;
  isStreaming: boolean;
  error: Error | null;
  clearEvents: () => void;
}

/**
 * React hook for AG-UI streaming
 *
 * @param options - Hook configuration options
 * @returns AG-UI hook state and methods
 */
export function useAGUI(options: UseAGUIOptions = {}): UseAGUIReturn {
  const { endpoint = '/api/ag-ui', onEvent, onError } = options;

  const [events, setEvents] = useState<AGUIEvent[]>([]);
  const [lastEvent, setLastEvent] = useState<AGUIEvent | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const clientRef = useRef<AGUIClient | null>(null);

  const handleEvent = useCallback(
    (event: AGUIEvent) => {
      setEvents((prev) => [...prev, event]);
      setLastEvent(event);
      onEvent?.(event);
    },
    [onEvent]
  );

  const handleError = useCallback(
    (err: Error) => {
      setError(err);
      setIsStreaming(false);
      onError?.(err);
    },
    [onError]
  );

  const stream = useCallback(
    async (streamOptions: AGUIStreamOptions) => {
      setIsStreaming(true);
      setError(null);

      clientRef.current = createAGUIClient({
        endpoint,
        onEvent: handleEvent,
        onError: handleError,
        onClose: () => setIsStreaming(false),
      });

      try {
        await clientRef.current.stream(streamOptions);
      } finally {
        setIsStreaming(false);
      }
    },
    [endpoint, handleEvent, handleError]
  );

  const close = useCallback(() => {
    clientRef.current?.close();
    setIsStreaming(false);
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
    setLastEvent(null);
    setError(null);
  }, []);

  return {
    stream,
    close,
    events,
    lastEvent,
    isStreaming,
    error,
    clearEvents,
  };
}

// ============================================================================
// Event Helpers
// ============================================================================

/**
 * Filter events by type
 */
export function filterEventsByType<T extends AGUIEvent>(
  events: AGUIEvent[],
  type: AGUIEventTypeValue
): T[] {
  return events.filter((event) => event.type === type) as T[];
}

/**
 * Get the latest text content from events
 */
export function getTextContent(events: AGUIEvent[]): string {
  return events
    .filter((event) => event.type === 'TEXT_MESSAGE_CONTENT')
    .map((event) => (event as { content: string }).content)
    .join('');
}

/**
 * Check if a run is complete
 */
export function isRunComplete(events: AGUIEvent[]): boolean {
  return events.some((event) => event.type === 'RUN_FINISHED' || event.type === 'RUN_ERROR');
}

/**
 * Get run error if any
 */
export function getRunError(events: AGUIEvent[]): Error | null {
  const errorEvent = events.find((event) => event.type === 'RUN_ERROR');
  if (errorEvent && 'error' in errorEvent) {
    return new Error((errorEvent as { error: { message: string } }).error.message);
  }
  return null;
}
