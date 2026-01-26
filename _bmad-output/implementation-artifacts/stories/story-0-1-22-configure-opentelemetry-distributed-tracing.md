# Story 0.1.22: Configure OpenTelemetry Distributed Tracing

## Story

As a **developer**,
I want **OpenTelemetry configured for distributed tracing**,
So that **requests can be traced across all services**.

## Acceptance Criteria

- **Given** Langfuse is configured
- **When** I configure OpenTelemetry
- **Then** the following are installed:
  - `@opentelemetry/api`
  - `@opentelemetry/sdk-node`
  - `@opentelemetry/auto-instrumentations-node`
  - `@opentelemetry/exporter-trace-otlp-http`
- **And** OpenTelemetry is initialized in `instrumentation.ts` (Next.js)
- **And** Traces are exported to Langfuse
- **And** Custom spans are created for:
  - API route handlers
  - Database queries
  - LLM calls
  - External service calls
- **And** Trace context propagates across services

## Technical Notes

- OpenTelemetry provides vendor-neutral tracing
- Langfuse accepts OTLP traces
- Enable automatic instrumentation for common libraries

## Environment Variables

- `OTEL_EXPORTER_OTLP_ENDPOINT`
- `OTEL_SERVICE_NAME`

## Creates

- instrumentation.ts
- lib/observability/tracing.ts

## Implementation Tasks

1. Install OpenTelemetry packages
2. Create instrumentation.ts for Next.js
3. Create tracing utility at lib/observability/tracing.ts
4. Add custom span helpers for different operation types
5. Configure trace context propagation
6. Add environment variables to .env.example
