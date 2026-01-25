# Unified Cost Service Architecture

**Date:** 2026-01-23
**Status:** Draft
**Priority:** High
**Source:** Redundancy Validation Report - Section 5 (Cost Tracking)

---

## Executive Summary

This document defines the architecture for a **Unified Cost Service** that consolidates cost tracking across three previously separate systems:

| Current System | Tier | Purpose | Problem |
|----------------|------|---------|---------|
| Stripe Billing Meters | Tier 3 | Customer billing | No provider cost visibility |
| Langfuse/Helicone | Tier 4 | Observability | Not connected to billing |
| Provider APIs | Tier 8 | Actual costs | No attribution to customers |

**Solution:** A single cost capture point that fans out to billing, observability, and analytics.

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         UNIFIED COST ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                        ┌─────────────────────────┐                          │
│                        │    PROVIDER GATEWAY     │                          │
│                        │                         │                          │
│                        │  ┌─────┐ ┌─────┐ ┌───┐ │                          │
│                        │  │OpenAI│ │fal.ai│ │11L│ │                          │
│                        │  └──┬──┘ └──┬──┘ └─┬─┘ │                          │
│                        │     └───────┼──────┘   │                          │
│                        └─────────────┼──────────┘                          │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                      COST CAPTURE MIDDLEWARE                          │ │
│  │                                                                        │ │
│  │   Before Call:                    After Call:                         │ │
│  │   • Generate executionId          • Capture response metrics          │ │
│  │   • Start timer                   • Calculate provider cost           │ │
│  │   • Extract context               • Apply markup                      │ │
│  │                                   • Emit CostEvent                    │ │
│  │                                                                        │ │
│  └───────────────────────────────────┬───────────────────────────────────┘ │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                      UNIFIED COST SERVICE                              │ │
│  │                                                                        │ │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                   │ │
│  │   │  Ingest API │  │Cost Calculator│  │Event Store │                   │ │
│  │   │  (HTTP/gRPC)│──│  (pricing)   │──│(TimescaleDB)│                   │ │
│  │   └─────────────┘  └─────────────┘  └─────────────┘                   │ │
│  │                                                                        │ │
│  └────────────┬───────────────────┬───────────────────┬──────────────────┘ │
│               │                   │                   │                    │
│               ▼                   ▼                   ▼                    │
│  ┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐        │
│  │      BILLING      │ │   OBSERVABILITY   │ │    ANALYTICS      │        │
│  │                   │ │                   │ │                   │        │
│  │  Stripe Meters    │ │  Langfuse Traces  │ │  Dashboards       │        │
│  │  (aggregate by    │ │  (trace_id link)  │ │  Margin reports   │        │
│  │   customer/day)   │ │                   │ │  Provider costs   │        │
│  │                   │ │                   │ │                   │        │
│  └───────────────────┘ └───────────────────┘ └───────────────────┘        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Data Model

### 2.1 CostEvent Interface

```typescript
/**
 * Core cost event - single source of truth for all cost tracking
 */
interface CostEvent {
  // Identity
  id: string;                    // UUID v7 (time-sortable)
  timestamp: Date;               // When the cost was incurred

  // Attribution (who pays)
  workspaceId: string;           // Tenant workspace
  customerId: string;            // Stripe customer ID
  userId?: string;               // User who triggered (optional)

  // Execution context (what happened)
  agentId?: string;              // Agent that made the call
  executionId: string;           // Unique execution/trace ID
  traceId?: string;              // Langfuse trace ID for correlation
  workflowId?: string;           // Workflow that triggered this
  nodeId?: string;               // Specific node in workflow

  // Provider details (where the cost came from)
  provider: CostProvider;
  model: string;                 // e.g., 'claude-3-opus', 'flux-2-pro'
  operation: CostOperation;

  // Usage metrics (what was consumed)
  inputTokens?: number;          // LLM input tokens
  outputTokens?: number;         // LLM output tokens
  totalTokens?: number;          // Convenience field
  durationMs?: number;           // For time-based billing (video, TTS)
  units?: number;                // Generic units (images, 3D models)

  // Cost calculations (how much)
  providerCostUsd: number;       // Actual cost from provider
  markupPercent: number;         // Our margin (e.g., 20 = 20%)
  billedAmountUsd: number;       // What customer pays

  // Metadata
  metadata?: Record<string, string>;  // Custom attributes
  environment: 'production' | 'staging' | 'development';
}

type CostProvider =
  | 'openai'
  | 'anthropic'
  | 'fal'
  | 'elevenlabs'
  | 'deepgram'
  | 'kling'
  | 'suno'
  | 'meshy'
  | 'replicate';

type CostOperation =
  | 'llm_completion'
  | 'llm_chat'
  | 'embedding'
  | 'image_generation'
  | 'image_edit'
  | 'video_generation'
  | 'tts'
  | 'stt'
  | 'music_generation'
  | '3d_model';
```

### 2.2 Database Schema (TimescaleDB)

```sql
-- Enable TimescaleDB extension (already available in Supabase)
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Main cost events table
CREATE TABLE cost_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Attribution
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  customer_id TEXT NOT NULL,  -- Stripe customer ID
  user_id UUID REFERENCES users(id),

  -- Execution context
  agent_id UUID REFERENCES agents(id),
  execution_id UUID NOT NULL,
  trace_id TEXT,  -- Langfuse trace correlation
  workflow_id UUID REFERENCES workflows(id),
  node_id TEXT,

  -- Provider
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  operation TEXT NOT NULL,

  -- Usage
  input_tokens INTEGER,
  output_tokens INTEGER,
  total_tokens INTEGER GENERATED ALWAYS AS (COALESCE(input_tokens, 0) + COALESCE(output_tokens, 0)) STORED,
  duration_ms INTEGER,
  units NUMERIC(10, 4),

  -- Costs (stored as cents for precision)
  provider_cost_cents INTEGER NOT NULL,
  markup_percent NUMERIC(5, 2) NOT NULL DEFAULT 20.00,
  billed_amount_cents INTEGER NOT NULL,

  -- Metadata
  metadata JSONB,
  environment TEXT NOT NULL DEFAULT 'production',

  -- Indexing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Convert to hypertable for time-series optimization
SELECT create_hypertable('cost_events', 'timestamp');

-- Indexes for common queries
CREATE INDEX idx_cost_events_workspace ON cost_events (workspace_id, timestamp DESC);
CREATE INDEX idx_cost_events_customer ON cost_events (customer_id, timestamp DESC);
CREATE INDEX idx_cost_events_execution ON cost_events (execution_id);
CREATE INDEX idx_cost_events_trace ON cost_events (trace_id) WHERE trace_id IS NOT NULL;
CREATE INDEX idx_cost_events_provider ON cost_events (provider, timestamp DESC);

-- Continuous aggregate for daily summaries (auto-refreshed)
CREATE MATERIALIZED VIEW cost_daily_summary
WITH (timescaledb.continuous) AS
SELECT
  time_bucket('1 day', timestamp) AS day,
  workspace_id,
  customer_id,
  provider,
  operation,
  COUNT(*) AS event_count,
  SUM(total_tokens) AS total_tokens,
  SUM(provider_cost_cents) AS total_provider_cost_cents,
  SUM(billed_amount_cents) AS total_billed_cents,
  SUM(billed_amount_cents) - SUM(provider_cost_cents) AS margin_cents
FROM cost_events
GROUP BY day, workspace_id, customer_id, provider, operation;

-- Refresh policy (every hour)
SELECT add_continuous_aggregate_policy('cost_daily_summary',
  start_offset => INTERVAL '3 days',
  end_offset => INTERVAL '1 hour',
  schedule_interval => INTERVAL '1 hour'
);
```

---

## 3. Cost Capture Middleware

### 3.1 Provider Gateway Wrapper

```typescript
import { CostEvent, CostProvider, CostOperation } from './types';
import { costService } from './cost-service';
import { pricingRegistry } from './pricing-registry';

interface ProviderCallContext {
  workspaceId: string;
  customerId: string;
  userId?: string;
  agentId?: string;
  workflowId?: string;
  nodeId?: string;
  traceId?: string;
  markupPercent?: number;
}

/**
 * Wraps any provider call with automatic cost tracking
 */
export function withCostTracking<T>(
  provider: CostProvider,
  operation: CostOperation,
  model: string,
  context: ProviderCallContext,
  providerCall: () => Promise<T & { usage?: ProviderUsage }>
): Promise<T> {
  const executionId = crypto.randomUUID();
  const startTime = Date.now();

  return providerCall()
    .then(async (result) => {
      const durationMs = Date.now() - startTime;
      const usage = extractUsage(result, operation);

      // Calculate costs
      const providerCostUsd = pricingRegistry.calculate(provider, model, usage);
      const markupPercent = context.markupPercent ?? 20;
      const billedAmountUsd = providerCostUsd * (1 + markupPercent / 100);

      // Emit cost event (fire-and-forget, don't block response)
      const costEvent: CostEvent = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        ...context,
        executionId,
        provider,
        model,
        operation,
        ...usage,
        durationMs,
        providerCostUsd,
        markupPercent,
        billedAmountUsd,
        environment: process.env.NODE_ENV as any ?? 'production',
      };

      // Async emit - don't await
      costService.emit(costEvent).catch(console.error);

      return result;
    });
}

// Usage example with fal.ai
import * as fal from '@fal-ai/serverless-client';

export async function generateImage(
  prompt: string,
  context: ProviderCallContext
) {
  return withCostTracking(
    'fal',
    'image_generation',
    'flux-2-pro',
    context,
    () => fal.run('fal-ai/flux-2-pro', { input: { prompt } })
  );
}

// Usage example with Anthropic
import Anthropic from '@anthropic-ai/sdk';

export async function chatCompletion(
  messages: Message[],
  context: ProviderCallContext
) {
  const anthropic = new Anthropic();

  return withCostTracking(
    'anthropic',
    'llm_chat',
    'claude-3-opus-20240229',
    context,
    () => anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      messages,
      max_tokens: 4096,
    })
  );
}
```

### 3.2 Pricing Registry

```typescript
interface PricingRule {
  provider: CostProvider;
  model: string;
  pricing: {
    inputTokenPer1k?: number;   // USD per 1K input tokens
    outputTokenPer1k?: number;  // USD per 1K output tokens
    perSecond?: number;         // USD per second (video, TTS)
    perUnit?: number;           // USD per unit (images, 3D)
    perMegapixel?: number;      // USD per megapixel (Flux)
  };
}

class PricingRegistry {
  private rules: Map<string, PricingRule> = new Map();

  constructor() {
    // Initialize with current pricing (2026-01)
    this.register({
      provider: 'anthropic',
      model: 'claude-3-opus-20240229',
      pricing: { inputTokenPer1k: 0.015, outputTokenPer1k: 0.075 }
    });
    this.register({
      provider: 'anthropic',
      model: 'claude-3-5-sonnet-20241022',
      pricing: { inputTokenPer1k: 0.003, outputTokenPer1k: 0.015 }
    });
    this.register({
      provider: 'openai',
      model: 'gpt-4o',
      pricing: { inputTokenPer1k: 0.0025, outputTokenPer1k: 0.01 }
    });
    this.register({
      provider: 'fal',
      model: 'flux-2-pro',
      pricing: { perMegapixel: 0.05 }
    });
    this.register({
      provider: 'fal',
      model: 'flux-2-turbo',
      pricing: { perMegapixel: 0.008 }
    });
    this.register({
      provider: 'elevenlabs',
      model: 'eleven_multilingual_v2',
      pricing: { perSecond: 0.003 }  // ~$0.18/min
    });
    this.register({
      provider: 'kling',
      model: 'kling-2.6',
      pricing: { perSecond: 0.07 }
    });
    // ... more providers
  }

  private key(provider: string, model: string): string {
    return `${provider}:${model}`;
  }

  register(rule: PricingRule): void {
    this.rules.set(this.key(rule.provider, rule.model), rule);
  }

  calculate(provider: CostProvider, model: string, usage: ProviderUsage): number {
    const rule = this.rules.get(this.key(provider, model));
    if (!rule) {
      console.warn(`No pricing rule for ${provider}:${model}, using zero cost`);
      return 0;
    }

    const { pricing } = rule;
    let cost = 0;

    if (pricing.inputTokenPer1k && usage.inputTokens) {
      cost += (usage.inputTokens / 1000) * pricing.inputTokenPer1k;
    }
    if (pricing.outputTokenPer1k && usage.outputTokens) {
      cost += (usage.outputTokens / 1000) * pricing.outputTokenPer1k;
    }
    if (pricing.perSecond && usage.durationMs) {
      cost += (usage.durationMs / 1000) * pricing.perSecond;
    }
    if (pricing.perUnit && usage.units) {
      cost += usage.units * pricing.perUnit;
    }
    if (pricing.perMegapixel && usage.megapixels) {
      cost += usage.megapixels * pricing.perMegapixel;
    }

    return cost;
  }

  // Admin API to update pricing at runtime
  async syncFromDatabase(): Promise<void> {
    const rules = await db.select().from(pricingRulesTable);
    rules.forEach(r => this.register(r));
  }
}

export const pricingRegistry = new PricingRegistry();
```

---

## 4. Fan-Out Consumers

### 4.1 Billing Consumer (Stripe)

```typescript
import Stripe from 'stripe';
import { CostEvent } from './types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * Aggregates cost events and sends to Stripe Billing Meters
 * Runs on a schedule (every 5 minutes) to batch events
 */
export async function syncToStripeBilling(): Promise<void> {
  // Get unsync'd events from last 5 minutes
  const events = await db
    .select()
    .from(costEventsTable)
    .where(
      and(
        gt(costEventsTable.timestamp, sql`NOW() - INTERVAL '5 minutes'`),
        isNull(costEventsTable.stripeSyncedAt)
      )
    );

  // Group by customer
  const byCustomer = groupBy(events, 'customerId');

  for (const [customerId, customerEvents] of Object.entries(byCustomer)) {
    // Aggregate tokens
    const totalTokens = customerEvents.reduce(
      (sum, e) => sum + (e.totalTokens ?? 0),
      0
    );

    if (totalTokens > 0) {
      await stripe.billing.meterEvents.create({
        event_name: 'token_usage',
        payload: {
          stripe_customer_id: customerId,
          value: totalTokens.toString(),
        },
      });
    }

    // Aggregate by operation type for detailed metering
    const byOperation = groupBy(customerEvents, 'operation');
    for (const [operation, opEvents] of Object.entries(byOperation)) {
      const totalBilledCents = opEvents.reduce(
        (sum, e) => sum + e.billedAmountCents,
        0
      );

      await stripe.billing.meterEvents.create({
        event_name: `${operation}_usage`,
        payload: {
          stripe_customer_id: customerId,
          value: totalBilledCents.toString(),
        },
      });
    }
  }

  // Mark events as synced
  await db
    .update(costEventsTable)
    .set({ stripeSyncedAt: new Date() })
    .where(
      inArray(costEventsTable.id, events.map(e => e.id))
    );
}
```

### 4.2 Observability Consumer (Langfuse)

```typescript
import { Langfuse } from 'langfuse';
import { CostEvent } from './types';

const langfuse = new Langfuse();

/**
 * Forwards cost events to Langfuse for trace correlation
 * Called immediately for real-time observability
 */
export async function forwardToLangfuse(event: CostEvent): Promise<void> {
  if (!event.traceId) {
    // No trace correlation, skip Langfuse
    return;
  }

  // Update the existing trace with cost information
  await langfuse.score({
    traceId: event.traceId,
    name: 'cost',
    value: event.providerCostUsd,
    dataType: 'NUMERIC',
  });

  // Also record as an observation
  langfuse.generation({
    traceId: event.traceId,
    name: `${event.provider}:${event.model}`,
    model: event.model,
    modelParameters: { operation: event.operation },
    usage: {
      input: event.inputTokens,
      output: event.outputTokens,
      total: event.totalTokens,
    },
    metadata: {
      executionId: event.executionId,
      workspaceId: event.workspaceId,
      providerCostUsd: event.providerCostUsd,
      billedAmountUsd: event.billedAmountUsd,
      marginPercent: event.markupPercent,
    },
  });

  await langfuse.flush();
}
```

### 4.3 Analytics Queries

```sql
-- Margin report by workspace (last 30 days)
SELECT
  w.name AS workspace_name,
  SUM(c.billed_amount_cents) / 100.0 AS revenue_usd,
  SUM(c.provider_cost_cents) / 100.0 AS cost_usd,
  (SUM(c.billed_amount_cents) - SUM(c.provider_cost_cents)) / 100.0 AS margin_usd,
  ROUND(
    (SUM(c.billed_amount_cents) - SUM(c.provider_cost_cents))::numeric
    / NULLIF(SUM(c.billed_amount_cents), 0) * 100,
    2
  ) AS margin_percent
FROM cost_events c
JOIN workspaces w ON c.workspace_id = w.id
WHERE c.timestamp > NOW() - INTERVAL '30 days'
GROUP BY w.id, w.name
ORDER BY revenue_usd DESC;

-- Provider cost breakdown
SELECT
  provider,
  model,
  operation,
  COUNT(*) AS call_count,
  SUM(total_tokens) AS total_tokens,
  SUM(provider_cost_cents) / 100.0 AS total_cost_usd,
  AVG(provider_cost_cents) / 100.0 AS avg_cost_per_call
FROM cost_events
WHERE timestamp > NOW() - INTERVAL '7 days'
GROUP BY provider, model, operation
ORDER BY total_cost_usd DESC;

-- Cost anomaly detection (calls exceeding 2x average)
WITH avg_costs AS (
  SELECT
    provider,
    model,
    AVG(provider_cost_cents) AS avg_cost,
    STDDEV(provider_cost_cents) AS stddev_cost
  FROM cost_events
  WHERE timestamp > NOW() - INTERVAL '7 days'
  GROUP BY provider, model
)
SELECT
  c.id,
  c.timestamp,
  c.workspace_id,
  c.provider,
  c.model,
  c.provider_cost_cents / 100.0 AS cost_usd,
  a.avg_cost / 100.0 AS avg_cost_usd
FROM cost_events c
JOIN avg_costs a ON c.provider = a.provider AND c.model = a.model
WHERE c.timestamp > NOW() - INTERVAL '1 day'
  AND c.provider_cost_cents > a.avg_cost + (2 * a.stddev_cost)
ORDER BY c.provider_cost_cents DESC;
```

---

## 5. API Endpoints

### 5.1 Cost Ingest API

```typescript
// POST /api/v1/costs
// Internal API for cost capture middleware

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const costEventSchema = z.object({
  workspaceId: z.string().uuid(),
  customerId: z.string(),
  userId: z.string().uuid().optional(),
  executionId: z.string().uuid(),
  traceId: z.string().optional(),
  agentId: z.string().uuid().optional(),
  workflowId: z.string().uuid().optional(),
  nodeId: z.string().optional(),
  provider: z.enum(['openai', 'anthropic', 'fal', 'elevenlabs', 'deepgram', 'kling', 'suno', 'meshy', 'replicate']),
  model: z.string(),
  operation: z.enum(['llm_completion', 'llm_chat', 'embedding', 'image_generation', 'image_edit', 'video_generation', 'tts', 'stt', 'music_generation', '3d_model']),
  inputTokens: z.number().int().optional(),
  outputTokens: z.number().int().optional(),
  durationMs: z.number().int().optional(),
  units: z.number().optional(),
  providerCostUsd: z.number(),
  markupPercent: z.number().default(20),
  billedAmountUsd: z.number(),
  metadata: z.record(z.string()).optional(),
});

const app = new Hono();

app.post('/api/v1/costs',
  zValidator('json', costEventSchema),
  async (c) => {
    const event = c.req.valid('json');

    // Insert into TimescaleDB
    await db.insert(costEventsTable).values({
      ...event,
      providerCostCents: Math.round(event.providerCostUsd * 100),
      billedAmountCents: Math.round(event.billedAmountUsd * 100),
    });

    // Forward to Langfuse (async)
    forwardToLangfuse(event).catch(console.error);

    return c.json({ success: true });
  }
);
```

### 5.2 Cost Query API

```typescript
// GET /api/v1/costs/summary
// Dashboard API for cost summaries

app.get('/api/v1/costs/summary',
  authMiddleware,
  async (c) => {
    const { workspaceId } = c.get('workspace');
    const { period = '30d' } = c.req.query();

    const interval = periodToInterval(period);

    const summary = await db
      .select({
        totalRevenue: sql<number>`SUM(billed_amount_cents) / 100.0`,
        totalCost: sql<number>`SUM(provider_cost_cents) / 100.0`,
        totalMargin: sql<number>`(SUM(billed_amount_cents) - SUM(provider_cost_cents)) / 100.0`,
        eventCount: sql<number>`COUNT(*)`,
        totalTokens: sql<number>`SUM(total_tokens)`,
      })
      .from(costEventsTable)
      .where(
        and(
          eq(costEventsTable.workspaceId, workspaceId),
          gt(costEventsTable.timestamp, sql`NOW() - ${interval}`)
        )
      );

    const byProvider = await db
      .select({
        provider: costEventsTable.provider,
        cost: sql<number>`SUM(provider_cost_cents) / 100.0`,
        count: sql<number>`COUNT(*)`,
      })
      .from(costEventsTable)
      .where(
        and(
          eq(costEventsTable.workspaceId, workspaceId),
          gt(costEventsTable.timestamp, sql`NOW() - ${interval}`)
        )
      )
      .groupBy(costEventsTable.provider);

    return c.json({
      period,
      summary: summary[0],
      byProvider,
    });
  }
);
```

---

## 6. Alerting & Reconciliation

### 6.1 Cost Alerts

```typescript
// Scheduled job: Check for cost anomalies
export async function checkCostAlerts(): Promise<void> {
  // Get workspaces with budgets
  const workspaces = await db
    .select()
    .from(workspacesTable)
    .where(isNotNull(workspacesTable.monthlyBudgetUsd));

  for (const workspace of workspaces) {
    const currentMonthCost = await db
      .select({
        total: sql<number>`SUM(billed_amount_cents) / 100.0`,
      })
      .from(costEventsTable)
      .where(
        and(
          eq(costEventsTable.workspaceId, workspace.id),
          gte(costEventsTable.timestamp, sql`DATE_TRUNC('month', NOW())`)
        )
      );

    const totalCost = currentMonthCost[0]?.total ?? 0;
    const budgetPercent = (totalCost / workspace.monthlyBudgetUsd) * 100;

    // Alert at 80% and 100%
    if (budgetPercent >= 100 && !workspace.alertedAt100) {
      await sendAlert(workspace, 'budget_exceeded', { totalCost, budget: workspace.monthlyBudgetUsd });
      await db.update(workspacesTable).set({ alertedAt100: new Date() }).where(eq(workspacesTable.id, workspace.id));
    } else if (budgetPercent >= 80 && !workspace.alertedAt80) {
      await sendAlert(workspace, 'budget_warning', { totalCost, budget: workspace.monthlyBudgetUsd });
      await db.update(workspacesTable).set({ alertedAt80: new Date() }).where(eq(workspacesTable.id, workspace.id));
    }
  }
}
```

### 6.2 Provider Invoice Reconciliation

```typescript
// Monthly reconciliation job
export async function reconcileProviderInvoices(): Promise<void> {
  const lastMonth = sql`DATE_TRUNC('month', NOW() - INTERVAL '1 month')`;
  const thisMonth = sql`DATE_TRUNC('month', NOW())`;

  // Get our tracked costs by provider
  const trackedCosts = await db
    .select({
      provider: costEventsTable.provider,
      totalCost: sql<number>`SUM(provider_cost_cents) / 100.0`,
    })
    .from(costEventsTable)
    .where(
      and(
        gte(costEventsTable.timestamp, lastMonth),
        lt(costEventsTable.timestamp, thisMonth)
      )
    )
    .groupBy(costEventsTable.provider);

  // Compare with actual invoices (fetched from provider APIs or manually entered)
  const invoices = await db.select().from(providerInvoicesTable).where(
    and(
      gte(providerInvoicesTable.periodStart, lastMonth),
      lt(providerInvoicesTable.periodEnd, thisMonth)
    )
  );

  for (const invoice of invoices) {
    const tracked = trackedCosts.find(t => t.provider === invoice.provider);
    const variance = tracked
      ? Math.abs(tracked.totalCost - invoice.amountUsd) / invoice.amountUsd * 100
      : 100;

    if (variance > 5) {
      await createReconciliationAlert({
        provider: invoice.provider,
        trackedCost: tracked?.totalCost ?? 0,
        invoiceAmount: invoice.amountUsd,
        variancePercent: variance,
      });
    }
  }
}
```

---

## 7. Migration Plan

### Phase 1: Deploy Core Service (Week 1)

1. Create TimescaleDB hypertable in Supabase
2. Deploy Cost Ingest API
3. Deploy pricing registry with initial provider data

### Phase 2: Instrument Providers (Week 2)

1. Wrap fal.ai calls with cost middleware
2. Wrap Anthropic/OpenAI calls
3. Wrap ElevenLabs/Deepgram calls
4. Verify cost capture in staging

### Phase 3: Connect Consumers (Week 3)

1. Deploy Stripe billing sync job
2. Deploy Langfuse forwarding
3. Build analytics dashboard queries

### Phase 4: Alerting & Reconciliation (Week 4)

1. Implement budget alerts
2. Build reconciliation job
3. Create admin dashboard for cost management

---

## 8. Success Metrics

| Metric | Target |
|--------|--------|
| Cost capture coverage | 100% of provider calls |
| Stripe sync latency | < 5 minutes |
| Invoice reconciliation variance | < 2% |
| Alert false positive rate | < 5% |

---

*Document created: 2026-01-23*
*Author: Architecture Team*
