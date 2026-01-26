/**
 * Next.js Instrumentation
 *
 * Initializes OpenTelemetry for distributed tracing.
 * This file is automatically loaded by Next.js.
 */

/**
 * Register OpenTelemetry instrumentation
 *
 * This is called by Next.js when the server starts.
 * Uses dynamic imports to avoid bundling issues with Edge runtime.
 */
export async function register(): Promise<void> {
  // Only initialize in Node.js runtime (not Edge)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { NodeSDK } = await import('@opentelemetry/sdk-node');
    const { OTLPTraceExporter } = await import(
      '@opentelemetry/exporter-trace-otlp-http'
    );
    const { resourceFromAttributes } = await import('@opentelemetry/resources');
    const {
      ATTR_SERVICE_NAME,
      ATTR_SERVICE_VERSION,
    } = await import('@opentelemetry/semantic-conventions');
    const { getNodeAutoInstrumentations } = await import(
      '@opentelemetry/auto-instrumentations-node'
    );

    const serviceName = process.env.OTEL_SERVICE_NAME || 'hyyve-web';
    const serviceVersion = process.env.npm_package_version || '0.0.1';

    // Configure the OTLP exporter
    // Langfuse accepts OTLP traces at /api/public/traces
    const otlpExporter = new OTLPTraceExporter({
      url:
        process.env.OTEL_EXPORTER_OTLP_ENDPOINT ||
        'http://localhost:3001/api/public/traces',
      headers: {
        // Langfuse uses public key for OTLP authentication
        Authorization: `Basic ${Buffer.from(
          `${process.env.LANGFUSE_PUBLIC_KEY}:${process.env.LANGFUSE_SECRET_KEY}`
        ).toString('base64')}`,
      },
    });

    // Create the SDK with auto-instrumentation
    const sdk = new NodeSDK({
      resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: serviceName,
        [ATTR_SERVICE_VERSION]: serviceVersion,
      }),
      traceExporter: otlpExporter,
      instrumentations: [
        getNodeAutoInstrumentations({
          // Disable fs instrumentation to reduce noise
          '@opentelemetry/instrumentation-fs': {
            enabled: false,
          },
          // Configure HTTP instrumentation
          '@opentelemetry/instrumentation-http': {
            ignoreIncomingRequestHook: (request) => {
              // Ignore health checks and static assets
              const url = request.url || '';
              return (
                url.includes('/_next/') ||
                url.includes('/health') ||
                url.includes('/favicon')
              );
            },
          },
        }),
      ],
    });

    // Start the SDK
    sdk.start();

    // Graceful shutdown
    process.on('SIGTERM', () => {
      sdk
        .shutdown()
        .then(() => console.warn('OpenTelemetry SDK shut down successfully'))
        .catch((error) => console.error('Error shutting down OpenTelemetry SDK', error));
    });

    console.warn(`OpenTelemetry initialized for service: ${serviceName}`);
  }
}
