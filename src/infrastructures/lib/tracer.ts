import {
  BasicTracerProvider,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { W3CTraceContextPropagator } from '@opentelemetry/core';

export const initTelemetry = (config: {
  service: string;
  traceExporterUrl: string;
}): void => {
  const exporter = new OTLPTraceExporter({
    url: config.traceExporterUrl, //todo : Set URL of trace collector
  });

  const provider = new BasicTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: config.service,
    }),
  });
  // export spans to console (useful for debugging)
  // provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
  // export spans to opentelemetry collector
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

  provider.register({ propagator: new W3CTraceContextPropagator() });
  const sdk = new NodeSDK({
    traceExporter: exporter,
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk
    .start()
    .then(() => {
      console.log('Tracing initialized');
    })
    .catch((error) => console.log('Error initializing tracing', error));

  process.on('SIGTERM', () => {
    sdk
      .shutdown()
      .then(() => console.log('Tracing terminated'))
      .catch((error) => console.log('Error terminating tracing', error))
      .finally(() => process.exit(0));
  });
};
