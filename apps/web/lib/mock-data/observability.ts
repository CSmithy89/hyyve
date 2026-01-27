/**
 * Observability Mock Data
 *
 * Story: 0-2-14 Implement Observability Dashboard UI
 *
 * Mock data for execution metrics, charts, and trace logs.
 */

// =============================================================================
// TYPES
// =============================================================================

export interface Metric {
  id: string;
  label: string;
  value: string;
  trend: number;
  trendLabel: string;
  icon: string;
  iconColor: string;
}

export interface Execution {
  id: string;
  pipelineName: string;
  status: 'pass' | 'running' | 'fail';
  duration: string;
  startedAt: string;
}

export interface ChartDataPoint {
  time: string;
  value: number;
}

export interface TraceStep {
  id: string;
  name: string;
  type: 'trigger' | 'retrieve' | 'llm' | 'output';
  status: 'success' | 'running' | 'failed' | 'pending';
  duration?: string;
  details?: string;
}

// =============================================================================
// METRICS
// =============================================================================

export const METRICS: Metric[] = [
  {
    id: 'total-executions',
    label: 'Total Executions',
    value: '2,341',
    trend: 5.2,
    trendLabel: 'vs. previous 24h',
    icon: 'play_circle',
    iconColor: 'text-primary',
  },
  {
    id: 'success-rate',
    label: 'Success Rate',
    value: '98.7%',
    trend: 0.3,
    trendLabel: 'Optimal range > 98%',
    icon: 'check_circle',
    iconColor: 'text-emerald-500',
  },
  {
    id: 'avg-latency',
    label: 'Avg Latency',
    value: '234ms',
    trend: -12,
    trendLabel: 'vs. previous 24h',
    icon: 'speed',
    iconColor: 'text-orange-500',
  },
];

// =============================================================================
// EXECUTIONS
// =============================================================================

export const EXECUTIONS: Execution[] = [
  {
    id: 'ex-8921-a',
    pipelineName: 'NLP-Sentiment-V3',
    status: 'pass',
    duration: '240ms',
    startedAt: '2026-01-27T14:32:01Z',
  },
  {
    id: 'ex-8921-b',
    pipelineName: 'Image-ResNet-50',
    status: 'running',
    duration: '12s (Active)',
    startedAt: '2026-01-27T14:31:45Z',
  },
  {
    id: 'ex-8920-f',
    pipelineName: 'Fraud-Detection-Core',
    status: 'fail',
    duration: '45ms',
    startedAt: '2026-01-27T14:28:12Z',
  },
  {
    id: 'ex-8919-x',
    pipelineName: 'Recommendation-Engine-A',
    status: 'pass',
    duration: '112ms',
    startedAt: '2026-01-27T14:25:33Z',
  },
  {
    id: 'ex-8918-c',
    pipelineName: 'Data-Ingest-Stream',
    status: 'pass',
    duration: '890ms',
    startedAt: '2026-01-27T14:22:10Z',
  },
  {
    id: 'ex-8917-d',
    pipelineName: 'Customer-Support-Bot',
    status: 'pass',
    duration: '1.2s',
    startedAt: '2026-01-27T14:18:45Z',
  },
  {
    id: 'ex-8916-e',
    pipelineName: 'Document-Summarizer',
    status: 'pass',
    duration: '3.4s',
    startedAt: '2026-01-27T14:15:22Z',
  },
];

// =============================================================================
// CHART DATA
// =============================================================================

export const CHART_DATA: ChartDataPoint[] = [
  { time: '00:00', value: 45 },
  { time: '01:00', value: 32 },
  { time: '02:00', value: 28 },
  { time: '03:00', value: 22 },
  { time: '04:00', value: 18 },
  { time: '05:00', value: 25 },
  { time: '06:00', value: 48 },
  { time: '07:00', value: 78 },
  { time: '08:00', value: 124 },
  { time: '09:00', value: 156 },
  { time: '10:00', value: 189 },
  { time: '11:00', value: 210 },
  { time: '12:00', value: 198 },
  { time: '13:00', value: 175 },
  { time: '14:00', value: 245 },
  { time: '15:00', value: 268 },
  { time: '16:00', value: 284 },
  { time: '17:00', value: 256 },
  { time: '18:00', value: 198 },
  { time: '19:00', value: 145 },
  { time: '20:00', value: 112 },
  { time: '21:00', value: 89 },
  { time: '22:00', value: 67 },
  { time: '23:00', value: 52 },
];

// =============================================================================
// TRACE STEPS
// =============================================================================

export const TRACE_STEPS: TraceStep[] = [
  {
    id: 'step-1',
    name: 'Incoming Webhook',
    type: 'trigger',
    status: 'success',
    duration: '2ms',
    details: 'POST /v1/chat',
  },
  {
    id: 'step-2',
    name: 'Retrieve Context',
    type: 'retrieve',
    status: 'success',
    duration: '45ms',
    details: 'Knowledge Base: product-docs',
  },
  {
    id: 'step-3',
    name: 'LLM Processing',
    type: 'llm',
    status: 'failed',
    duration: '1.2s',
    details: 'Model: GPT-4-Turbo, Error: Rate limit exceeded',
  },
  {
    id: 'step-4',
    name: 'Send Response',
    type: 'output',
    status: 'pending',
    details: 'Slack: #support-channel',
  },
];
