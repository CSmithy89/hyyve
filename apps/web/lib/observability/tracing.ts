/**
 * Tracing Utilities
 *
 * Custom span helpers for different operation types.
 * Uses OpenTelemetry API for creating and managing spans.
 */

import {
  trace,
  context,
  SpanKind,
  SpanStatusCode,
  type Span,
  type Tracer,
  type Context,
  propagation,
} from '@opentelemetry/api';

/**
 * Get the tracer for custom spans
 */
function getTracer(name = 'hyyve-web'): Tracer {
  return trace.getTracer(name);
}

/**
 * Span attributes for different operation types
 */
export interface SpanAttributes {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Options for creating a span
 */
export interface SpanOptions {
  name: string;
  kind?: SpanKind;
  attributes?: SpanAttributes;
  parentContext?: Context;
}

/**
 * Create a span and execute a function within it
 */
export async function withSpan<T>(
  options: SpanOptions,
  fn: (span: Span) => Promise<T>
): Promise<T> {
  const tracer = getTracer();
  const parentCtx = options.parentContext || context.active();

  return tracer.startActiveSpan(
    options.name,
    {
      kind: options.kind || SpanKind.INTERNAL,
      attributes: options.attributes,
    },
    parentCtx,
    async (span) => {
      try {
        const result = await fn(span);
        span.setStatus({ code: SpanStatusCode.OK });
        return result;
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error instanceof Error ? error.message : String(error),
        });
        span.recordException(error instanceof Error ? error : new Error(String(error)));
        throw error;
      } finally {
        span.end();
      }
    }
  );
}

/**
 * Trace an API route handler
 */
export async function traceApiRoute<T>(
  routeName: string,
  method: string,
  fn: (span: Span) => Promise<T>
): Promise<T> {
  return withSpan(
    {
      name: `api.route.${routeName}`,
      kind: SpanKind.SERVER,
      attributes: {
        'http.route': routeName,
        'http.method': method,
        'span.type': 'api_handler',
      },
    },
    fn
  );
}

/**
 * Trace a database query
 */
export async function traceDatabaseQuery<T>(
  operation: string,
  table: string,
  fn: (span: Span) => Promise<T>
): Promise<T> {
  return withSpan(
    {
      name: `db.query.${table}.${operation}`,
      kind: SpanKind.CLIENT,
      attributes: {
        'db.operation': operation,
        'db.table': table,
        'span.type': 'database_query',
      },
    },
    fn
  );
}

/**
 * Trace an LLM call
 */
export async function traceLLMCall<T>(
  model: string,
  operation: string,
  fn: (span: Span) => Promise<T>
): Promise<T> {
  return withSpan(
    {
      name: `llm.${operation}`,
      kind: SpanKind.CLIENT,
      attributes: {
        'llm.model': model,
        'llm.operation': operation,
        'span.type': 'llm_completion',
        'ai.model.provider': 'anthropic',
      },
    },
    fn
  );
}

/**
 * Trace an external service call (HTTP, fetch)
 */
export async function traceExternalService<T>(
  serviceName: string,
  operation: string,
  url: string,
  fn: (span: Span) => Promise<T>
): Promise<T> {
  return withSpan(
    {
      name: `external.${serviceName}.${operation}`,
      kind: SpanKind.CLIENT,
      attributes: {
        'http.url': url,
        'service.name': serviceName,
        'span.type': 'external_http',
      },
    },
    fn
  );
}

/**
 * Extract trace context from headers for propagation
 */
export function extractTraceContext(
  headers: Record<string, string | undefined>
): Context {
  return propagation.extract(context.active(), headers);
}

/**
 * Inject trace context into headers for propagation
 */
export function injectTraceContext(
  headers: Record<string, string>
): Record<string, string> {
  propagation.inject(context.active(), headers);
  return headers;
}

/**
 * Get the current trace ID
 */
export function getCurrentTraceId(): string | undefined {
  const span = trace.getActiveSpan();
  if (!span) return undefined;
  return span.spanContext().traceId;
}

/**
 * Get the current span ID
 */
export function getCurrentSpanId(): string | undefined {
  const span = trace.getActiveSpan();
  if (!span) return undefined;
  return span.spanContext().spanId;
}

/**
 * Add attributes to the current span
 */
export function addSpanAttributes(attributes: SpanAttributes): void {
  const span = trace.getActiveSpan();
  if (span) {
    Object.entries(attributes).forEach(([key, value]) => {
      if (value !== undefined) {
        span.setAttribute(key, value);
      }
    });
  }
}

/**
 * Record an event on the current span
 */
export function recordSpanEvent(
  name: string,
  attributes?: SpanAttributes
): void {
  const span = trace.getActiveSpan();
  if (span) {
    span.addEvent(name, attributes);
  }
}

/**
 * Set error status on the current span
 */
export function setSpanError(error: Error): void {
  const span = trace.getActiveSpan();
  if (span) {
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error.message,
    });
    span.recordException(error);
  }
}
