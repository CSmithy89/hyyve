/**
 * ATDD Tests for Story 0.1.22: Configure OpenTelemetry Distributed Tracing
 *
 * Validates OpenTelemetry configuration for distributed tracing.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Get project root
const projectRoot = join(__dirname, '../../..');
const webAppPath = join(projectRoot, 'apps/web');

describe('Story 0.1.22: Configure OpenTelemetry Distributed Tracing', () => {
  let webPackageJson: Record<string, unknown>;

  beforeAll(() => {
    const webPackagePath = join(webAppPath, 'package.json');
    if (existsSync(webPackagePath)) {
      webPackageJson = JSON.parse(readFileSync(webPackagePath, 'utf-8'));
    }
  });

  describe('OpenTelemetry Packages', () => {
    it('should have @opentelemetry/api dependency', () => {
      const deps = {
        ...(webPackageJson?.dependencies as Record<string, string>),
        ...(webPackageJson?.devDependencies as Record<string, string>),
      };
      expect('@opentelemetry/api' in deps).toBe(true);
    });

    it('should have @opentelemetry/sdk-node dependency', () => {
      const deps = {
        ...(webPackageJson?.dependencies as Record<string, string>),
        ...(webPackageJson?.devDependencies as Record<string, string>),
      };
      expect('@opentelemetry/sdk-node' in deps).toBe(true);
    });

    it('should have @opentelemetry/auto-instrumentations-node dependency', () => {
      const deps = {
        ...(webPackageJson?.dependencies as Record<string, string>),
        ...(webPackageJson?.devDependencies as Record<string, string>),
      };
      expect('@opentelemetry/auto-instrumentations-node' in deps).toBe(true);
    });

    it('should have @opentelemetry/exporter-trace-otlp-http dependency', () => {
      const deps = {
        ...(webPackageJson?.dependencies as Record<string, string>),
        ...(webPackageJson?.devDependencies as Record<string, string>),
      };
      expect('@opentelemetry/exporter-trace-otlp-http' in deps).toBe(true);
    });
  });

  describe('Instrumentation File', () => {
    let instrumentationContent: string;

    beforeAll(() => {
      const instrumentationPath = join(webAppPath, 'instrumentation.ts');
      if (existsSync(instrumentationPath)) {
        instrumentationContent = readFileSync(instrumentationPath, 'utf-8');
      }
    });

    it('should have instrumentation.ts in apps/web', () => {
      expect(existsSync(join(webAppPath, 'instrumentation.ts'))).toBe(true);
    });

    it('should export register function', () => {
      expect(instrumentationContent).toMatch(/export.*register|register.*function/);
    });

    it('should initialize OpenTelemetry', () => {
      expect(instrumentationContent).toMatch(/opentelemetry|NodeSDK|otel/i);
    });
  });

  describe('Tracing Utility', () => {
    let tracingContent: string;

    beforeAll(() => {
      const tracingPath = join(webAppPath, 'lib/observability/tracing.ts');
      if (existsSync(tracingPath)) {
        tracingContent = readFileSync(tracingPath, 'utf-8');
      }
    });

    it('should have lib/observability directory', () => {
      expect(existsSync(join(webAppPath, 'lib/observability'))).toBe(true);
    });

    it('should have tracing.ts file', () => {
      expect(
        existsSync(join(webAppPath, 'lib/observability/tracing.ts'))
      ).toBe(true);
    });

    it('should import from @opentelemetry/api', () => {
      expect(tracingContent).toMatch(/@opentelemetry\/api/);
    });

    it('should provide span helpers for API routes', () => {
      expect(tracingContent).toMatch(/api|route|handler/i);
    });

    it('should provide span helpers for database queries', () => {
      expect(tracingContent).toMatch(/database|query|db/i);
    });

    it('should provide span helpers for LLM calls', () => {
      expect(tracingContent).toMatch(/llm|ai|model|completion/i);
    });

    it('should provide span helpers for external service calls', () => {
      expect(tracingContent).toMatch(/external|service|http|fetch/i);
    });
  });

  describe('Trace Context Propagation', () => {
    let tracingContent: string;

    beforeAll(() => {
      const tracingPath = join(webAppPath, 'lib/observability/tracing.ts');
      if (existsSync(tracingPath)) {
        tracingContent = readFileSync(tracingPath, 'utf-8');
      }
    });

    it('should support trace context propagation', () => {
      expect(tracingContent).toMatch(/propagat|context|trace.*id|span.*id/i);
    });
  });

  describe('Environment Variables', () => {
    let envExampleContent: string;

    beforeAll(() => {
      const envPath = join(projectRoot, '.env.example');
      if (existsSync(envPath)) {
        envExampleContent = readFileSync(envPath, 'utf-8');
      }
    });

    it('should document OTEL_EXPORTER_OTLP_ENDPOINT', () => {
      expect(envExampleContent).toMatch(/OTEL_EXPORTER_OTLP_ENDPOINT/);
    });

    it('should document OTEL_SERVICE_NAME', () => {
      expect(envExampleContent).toMatch(/OTEL_SERVICE_NAME/);
    });
  });

  describe('Langfuse Integration', () => {
    let instrumentationContent: string;

    beforeAll(() => {
      const instrumentationPath = join(webAppPath, 'instrumentation.ts');
      if (existsSync(instrumentationPath)) {
        instrumentationContent = readFileSync(instrumentationPath, 'utf-8');
      }
    });

    it('should configure OTLP exporter for Langfuse', () => {
      expect(instrumentationContent).toMatch(/OTLPTraceExporter|otlp|exporter/i);
    });
  });
});
