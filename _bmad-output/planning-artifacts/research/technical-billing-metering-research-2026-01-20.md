# Technical Research: Billing & Metering Systems for Hyyve Platform

**Research Date**: January 20, 2026
**Status**: ✅ Verified (January 21, 2026)
**Research Focus**: Usage-based billing, metering, subscription management, and marketplace revenue share
**Target Platform**: Hyyve Platform with AI agents, workflows, marketplace modules, and agency billing

---

## Executive Summary

This research document provides comprehensive analysis of billing and metering systems suitable for an Hyyve platform. The platform requires sophisticated billing capabilities to handle:

- **User billing**: Usage-based charging for agent executions, tokens, storage
- **Marketplace**: Revenue share with module creators
- **Agency billing**: White-label billing for agencies serving their clients

Key findings:
1. **Stripe Billing** remains the most mature option for subscription + usage-based billing with excellent webhook support
2. **Orb** excels at complex usage-based scenarios with SQL-defined metrics and late-arriving data handling
3. **Lago** provides a viable self-hosted option with strong event-based metering
4. **Hybrid pricing models** (base subscription + usage) are becoming the standard for AI platforms in 2026

---

## Table of Contents

1. [Stripe Billing Deep Dive](#1-stripe-billing-deep-dive)
2. [Orb Billing Platform](#2-orb-billing-platform)
3. [Lago Open-Source Billing](#3-lago-open-source-billing)
4. [Platform Comparison Matrix](#4-platform-comparison-matrix)
5. [Usage Metering Patterns for AI Platforms](#5-usage-metering-patterns-for-ai-platforms)
6. [Pricing Model Analysis](#6-pricing-model-analysis)
7. [Multi-Tenant Billing Architecture](#7-multi-tenant-billing-architecture)
8. [Marketplace Revenue Share Implementation](#8-marketplace-revenue-share-implementation)
9. [Enterprise Billing Features](#9-enterprise-billing-features)
10. [Cost Tracking & Attribution](#10-cost-tracking--attribution)
11. [Implementation Patterns](#11-implementation-patterns)
12. [Architecture Recommendations](#12-architecture-recommendations)

---

## 1. Stripe Billing Deep Dive

### 1.1 Subscription Lifecycle Management

Stripe manages subscriptions through eight distinct statuses:

| Status | Description | Action Required |
|--------|-------------|-----------------|
| `trialing` | Free trial period active | Safe to provision access |
| `active` | Subscription in good standing | Normal operation |
| `incomplete` | Awaiting initial payment (23-hour window) | Show payment UI |
| `incomplete_expired` | Initial payment failed | Prompt re-subscription |
| `past_due` | Latest invoice payment failed | Revenue recovery needed |
| `unpaid` | Invoice unpaid, retries exhausted | Revoke access |
| `canceled` | Terminal state | Revoke access immediately |
| `paused` | Trial ended without a payment method on file; invoices aren’t generated until a payment method is added | Collect payment method to resume |

**State Transition Diagram**:

```
                    +-----------+
                    |  Created  |
                    +-----+-----+
                          |
               +----------v-----------+
               |      trialing        |
               +----------+-----------+
                          |
            +-------------v-------------+
            |        incomplete         |<----+
            +-------------+-------------+     |
                          |                   |
           +--------------+---------------+   |
           |                              |   |
  +--------v--------+          +----------v---+------+
  |     active      |          | incomplete_expired  |
  +--------+--------+          +---------------------+
           |
    +------+------+
    |             |
+---v---+         |
|past_due|        |
+---+---+         |
    |            |
+---v---+        |
| unpaid |        |
+---+---+        |
    |            |
+---v-----+      |
| canceled |     |
+---------+      |
                  |
        (trial ends w/o PM)
                  |
             +----v----+
             | paused  |
             +----+----+
                  |
        (payment method added)
                  |
               +--v--+
               |active|
               +-----+
```

**Sources**:
- Stripe subscription status definitions: https://docs.stripe.com/billing/subscriptions/overview#subscription-statuses
- Pause collection behavior: https://docs.stripe.com/billing/subscriptions/pause-payment-collection

### 1.2 Usage-Based Billing with Billing Meters

Stripe removed legacy usage-based billing; metered prices now require Billing Meters (as of 2025-03-31).

**Core Concepts**:
- **Meter**: Defines how to aggregate events over a billing period
- **Meter Events**: Raw usage data records
- **Aggregation Types**: `sum`, `count`, `last` (the `last` formula is supported as of the 2025-03-31 API version)

**Creating a Meter** (Node.js):

```javascript
const stripe = require('stripe')('sk_test_...');

// Create a meter for tracking agent executions
const meter = await stripe.billing.meters.create({
  display_name: 'Agent Executions',
  event_name: 'agent_execution',
  default_aggregation: {
    formula: 'sum'
  },
  customer_mapping: {
    event_payload_key: 'stripe_customer_id',
    type: 'by_id',
  },
  value_settings: {
    event_payload_key: 'value'
  },
});

console.log('Created meter:', meter.id);
```

**Sending Meter Events** (Node.js):

```javascript
// Record an agent execution event
const meterEvent = await stripe.billing.meterEvents.create({
  event_name: 'agent_execution',
  payload: {
    stripe_customer_id: 'cus_xxx',
    value: '1',  // 1 execution (string per API examples)
  },
  timestamp: Math.floor(Date.now() / 1000),
  identifier: `exec_${uuidv4()}`, // Unique within a rolling 24h window
});
```

**High-Throughput Event Streaming** (for >1000 events/sec):

```javascript
// Step 1: Create a meter event session (short-lived; see expires_at)
const session = await stripe.v2.billing.meterEventSession.create();

// Step 2: Use the session token for streaming
const streamClient = new Stripe(session.authentication_token);
const eventStream = await streamClient.v2.billing.meterEventStream.create({
  events: [
    {
      event_name: 'token_usage',
      payload: {
        stripe_customer_id: 'cus_xxx',
        value: '1500', // tokens used
        model: 'claude-opus-4.5',
        type: 'output',
      },
      identifier: `token_${uuidv4()}`,
      timestamp: new Date().toISOString(),
    },
    // ... more events (up to 10,000/sec)
  ],
});
```

**Rate Limits**:
- Meter Event Stream (API v2): Up to 10,000 events/second
- Stripe documents up to 100,000 events/second for a single business via the v2 stream; contact sales for higher limits

**Sources**:
- Stripe Billing meters API: https://docs.stripe.com/api/billing/meter
- Stripe Billing meter event stream (v2): https://docs.stripe.com/api/billing/meter_event_stream
- Stripe Billing meter events (create/list): https://docs.stripe.com/api/billing/meter_event
- Stripe Billing meter event session (v2): https://docs.stripe.com/api/billing/meter_event_session
- Stripe Billing meters changelog (usage-based billing deprecation, limits): https://docs.stripe.com/changelog/billing-meters

### 1.3 Pricing Models

Stripe supports multiple pricing structures:

**Per-Unit Pricing**:
```javascript
const price = await stripe.prices.create({
  currency: 'usd',
  unit_amount: 1, // $0.01 per unit
  billing_scheme: 'per_unit',
  recurring: {
    usage_type: 'metered',
    interval: 'month',
    meter: meter.id,
  },
  product_data: { name: 'Agent Executions' },
});
```

**Tiered Pricing**:
```javascript
const tieredPrice = await stripe.prices.create({
  currency: 'usd',
  billing_scheme: 'tiered',
  tiers_mode: 'graduated', // or 'volume'
  tiers: [
    { up_to: 1000, unit_amount: 10 },      // $0.10 for first 1000
    { up_to: 10000, unit_amount: 8 },      // $0.08 for 1001-10000
    { up_to: 'inf', unit_amount: 5 },      // $0.05 for 10001+
  ],
  recurring: {
    usage_type: 'metered',
    interval: 'month',
    meter: meter.id,
  },
  product_data: { name: 'Token Usage' },
});
```

**Package Pricing** (transform quantity):
```javascript
const packagePrice = await stripe.prices.create({
  currency: 'usd',
  unit_amount: 100, // $1.00 per package
  billing_scheme: 'per_unit',
  transform_quantity: {
    divide_by: 1000,  // 1000 tokens = 1 package
    round: 'up',
  },
  recurring: {
    usage_type: 'metered',
    interval: 'month',
    meter: meter.id,
  },
  product_data: { name: 'Token Packages (1K)' },
});
```

### 1.4 Billing Credits

Stripe supports prepaid and promotional credits for usage-based billing.

**Credit Grant Types**:
- **Prepaid Credits**: Customer purchases credits upfront
- **Promotional Credits**: Free credits for trials/promotions

**Creating a Credit Grant**:
```javascript
const creditGrant = await stripe.billing.creditGrants.create({
  customer: 'cus_xxx',
  category: 'promotional', // or 'paid'
  amount: {
    type: 'monetary',
    value: {
      currency: 'usd',
      amount: 5000, // $50.00 in credits
    },
  },
  effective_at: Math.floor(Date.now() / 1000),
  expires_at: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
});
```

**Limitations**:
- Max 100 unused credit grants per customer (Stripe docs: limit enforced on unused grants)
- Credits only apply to metered prices using Billing Meters
- Credits apply after discounts, before taxes

**Sources**:
- Stripe credit grants API: https://docs.stripe.com/api/credits
- Stripe credits for usage-based billing: https://stripe.com/blog/introducing-credits-for-usage-based-billing

### 1.5 Webhook Event Handling

**Critical Subscription Events**:

```javascript
// webhook-handler.js
const express = require('express');
const stripe = require('stripe')('sk_test_...');

app.post('/webhooks/stripe', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

  switch (event.type) {
    // Subscription Lifecycle
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await revokeAccess(event.data.object.customer);
      break;
    case 'customer.subscription.trial_will_end':
      // Sent 3 days before trial ends
      await sendTrialEndingEmail(event.data.object);
      break;

    // Invoice Events
    case 'invoice.created':
      // Respond within 72 hours to finalize
      await prepareInvoice(event.data.object);
      break;
    case 'invoice.finalized':
      await recordInvoice(event.data.object);
      break;
    case 'invoice.paid':
      await provisionAccess(event.data.object);
      break;
    case 'invoice.payment_failed':
      await initiateRecovery(event.data.object);
      break;
    case 'invoice.payment_action_required':
      // 3DS authentication needed
      await request3DSAuth(event.data.object);
      break;

    // Meter Errors
    case 'v1.billing.meter.error_report_triggered':
      await handleMeterErrors(event.data.object);
      break;
  }

  res.json({ received: true });
});
```

**Sources**:
- Stripe event types (invoice/subscription webhooks): https://docs.stripe.com/api/events/types
- Stripe invoice lifecycle and finalization timing: https://docs.stripe.com/billing/invoices/overview
- Stripe trial_will_end timing: https://docs.stripe.com/billing/subscriptions/overview#trial

### 1.6 Customer Portal

Stripe's customer portal enables self-service billing management.

**Portal Session Creation**:
```javascript
const portalSession = await stripe.billingPortal.sessions.create({
  customer: 'cus_xxx',
  return_url: 'https://app.example.com/billing',
  configuration: 'bpc_xxx', // Optional: custom configuration
});

// Redirect customer to: portalSession.url
```

**Portal Capabilities**:
- View and download invoices
- Update payment methods
- Manage subscriptions (upgrade/downgrade)
- View billing history
- Cancel subscription

### 1.7 Proration Handling

```javascript
// Preview proration before making changes
const preview = await stripe.invoices.upcoming({
  customer: 'cus_xxx',
  subscription: 'sub_xxx',
  subscription_items: [{
    id: 'si_xxx',
    price: 'price_new_plan',
  }],
  subscription_proration_date: Math.floor(Date.now() / 1000),
});

console.log('Proration preview:', preview.amount_due);

// Apply the change with specific proration behavior
const subscription = await stripe.subscriptions.update('sub_xxx', {
  items: [{
    id: 'si_xxx',
    price: 'price_new_plan',
  }],
  proration_behavior: 'create_prorations', // or 'always_invoice' or 'none'
});
```

**Proration Behavior Options**:
- `create_prorations`: Creates proration items, invoiced on next billing
- `always_invoice`: Creates and immediately invoices prorations
- `none`: No prorations; full new price on next invoice

---

## 2. Orb Billing Platform

### 2.1 Overview and Differentiation

[Orb](https://www.withorb.com/) is a revenue design platform built specifically for usage-based billing, used by companies like Vercel, Perplexity, and Replit.

**Key Differentiators from Stripe**:

| Feature | Stripe | Orb |
|---------|--------|-----|
| Architecture | Pre-aggregated usage records | Raw event storage with query-time computation |
| Late-arriving data | Event adjustments required; no automatic recomputation | Automatic recalculation at any time |
| Metric definition | Limited aggregations | Full SQL control |
| Event volume | 10K/sec v2 stream (up to 100K/sec per business) | 1,000+ events/sec native; hosted rollups stress-tested to hundreds of thousands/sec |
| Pricing experiments | Manual A/B testing | Built-in simulation and backtesting |
| Backfilling | Complex, limited | Native support |

**Sources**:
- Stripe meter event stream throughput and adjustments: https://docs.stripe.com/api/billing/meter_event_stream
- Stripe meter event adjustments (v2): https://docs.stripe.com/api/v2/billing-meter-adjustment
- Orb ingestion limits and rollups: https://docs.withorb.com/reference/ingest, https://docs.withorb.com/reference/hosted-rollups

### 2.2 Event-Based Architecture

Orb's query-based architecture stores raw events and computes metrics at query time:

```
Events → Raw Storage → SQL Metrics → Invoice Calculation
              ↑
         Corrections/Backfills automatically recalculate
```

**Event Structure**:
```json
{
  "event_name": "agent_execution",
  "timestamp": "2026-01-20T10:30:00Z",
  "external_customer_id": "customer_123",
  "idempotency_key": "exec_uuid_12345",
  "properties": {
    "agent_id": "agent_abc",
    "tokens_input": 1500,
    "tokens_output": 2000,
    "duration_ms": 3500,
    "model": "claude-opus-4.5"
  }
}
```

### 2.3 SQL-Based Billable Metrics

Orb allows defining complex billing metrics using SQL:

```sql
-- Token usage with model-based pricing
SELECT
  external_customer_id,
  SUM(CASE
    WHEN properties->>'model' = 'claude-opus-4.5' THEN
      (properties->>'tokens_input')::int * 0.005 +
      (properties->>'tokens_output')::int * 0.025
    WHEN properties->>'model' = 'claude-sonnet-4' THEN
      (properties->>'tokens_input')::int * 0.003 +
      (properties->>'tokens_output')::int * 0.015
    ELSE 0
  END) as total_cost
FROM events
WHERE event_name = 'llm_call'
  AND timestamp BETWEEN :period_start AND :period_end
GROUP BY external_customer_id
```

### 2.4 Pricing Model Flexibility

Orb supports complex pricing structures:

```yaml
# Example: Hybrid AI Platform Pricing
plan:
  name: "Pro Plan"
  base_price:
    amount: 49.00
    currency: USD
    cadence: monthly

  usage_components:
    - metric: agent_executions
      pricing:
        type: tiered
        tiers:
          - up_to: 100
            price: 0  # Included in base
          - up_to: 1000
            unit_price: 0.10
          - up_to: unlimited
            unit_price: 0.05

    - metric: token_usage
      pricing:
        type: per_unit
        unit_price: 0.00001  # Per token

    - metric: storage_gb
      pricing:
        type: graduated
        tiers:
          - up_to: 5
            price: 0  # 5GB included
          - up_to: unlimited
            unit_price: 0.10  # Per GB
```

### 2.5 Real-Time Features

**Usage Alerting**:
```javascript
// Configure usage threshold alerts
const alert = await orb.alerts.create({
  customer_id: 'customer_123',
  metric: 'agent_executions',
  threshold: {
    type: 'percentage_of_quota',
    value: 80,
  },
  webhook_url: 'https://api.example.com/alerts/usage',
});
```

**Pricing Simulations**:
```javascript
// Test new pricing against historical data
const simulation = await orb.simulations.create({
  plan_id: 'plan_new_pricing',
  customer_ids: ['customer_123', 'customer_456'],
  period: {
    start: '2025-01-01',
    end: '2025-12-31',
  },
});

// Compare revenue impact
console.log('Revenue change:', simulation.revenue_delta);
```

### 2.6 When to Use Orb vs Stripe

**Choose Orb when**:
- Complex, multi-dimensional usage metrics
- Need SQL control over billing logic
- Late-arriving data is common
- High event volumes beyond Stripe's 10K/sec stream or need rollups for very high scale
- Pricing experimentation is critical
- Enterprise contracts with custom terms

**Choose Stripe when**:
- Simpler usage patterns
- Already using Stripe for payments
- Need integrated payment processing
- Event volumes within Stripe's v2 stream limits (<=10K events/sec)
- Customer portal requirements
- Global payment method support

---

## 3. Lago Open-Source Billing

### 3.1 Overview

[Lago](https://www.getlago.com/) is an open-source billing platform that can be self-hosted, offering an alternative to commercial solutions.

**Deployment Options**:
- **Self-hosted**: Docker deployment, AGPL-3.0 license
- **Cloud**: Managed SaaS offering

**GitHub**: [getlago/lago](https://github.com/getlago/lago)

### 3.2 Event Ingestion

Lago's event API supports event ingestion (single and batch):

```bash
# Single event
curl -X POST "https://api.getlago.com/api/v1/events" \
  -H "Authorization: Bearer $LAGO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "event": {
      "transaction_id": "exec_12345",
      "external_subscription_id": "sub_123",
      "code": "agent_execution",
      "timestamp": 1705756200,
      "properties": {
        "tokens": 1500,
        "model": "claude-opus-4.5"
      }
    }
  }'
```

```bash
# Batch events
curl -X POST "https://api.getlago.com/api/v1/events/batch" \
  -H "Authorization: Bearer $LAGO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "events": [
      {
        "transaction_id": "exec_12345",
        "external_subscription_id": "sub_123",
        "code": "agent_execution",
        "timestamp": 1705756200,
        "properties": { "tokens": 1500 }
      },
      {
        "transaction_id": "exec_12346",
        "external_subscription_id": "sub_123",
        "code": "agent_execution",
        "timestamp": 1705756300,
        "properties": { "tokens": 2000 }
      }
    ]
  }'
```

**Idempotency**:
- Each event requires a unique `transaction_id`
- Duplicate `transaction_id` returns 422 Unprocessable Entity
- Batch endpoint accepts up to 100 events per request
- Best practice: Use `{code}_{timestamp}` or UUID

### 3.3 Aggregation Types

| Type | Description | Use Case |
|------|-------------|----------|
| `COUNT` | Count of events | Agent executions |
| `COUNT UNIQUE` | Unique values count | Active agents |
| `SUM` | Sum of property values | Token usage |
| `MAX` | Maximum value | Peak concurrent users |
| `LATEST` | Most recent value | Current storage size |
| `WEIGHTED SUM` | Weighted calculations | Time-weighted compute |
| `CUSTOM` | SQL expressions | Complex calculations |

**Sources**:
- Lago events API and batch limits: https://doc.getlago.com/api-reference/events/event
- Lago billable metrics and aggregation types: https://doc.getlago.com/guide/billable-metrics

### 3.4 Billable Metrics Configuration

```javascript
// Create a billable metric via API
const metric = await lago.billableMetrics.create({
  name: 'Token Usage',
  code: 'token_usage',
  description: 'LLM tokens consumed',
  aggregation_type: 'sum',
  field_name: 'tokens',
  recurring: false, // Metered, not recurring
  filters: [
    {
      key: 'model',
      values: ['claude-opus-4.5', 'claude-sonnet-4', 'claude-haiku-3.5']
    }
  ]
});
```

### 3.5 Pricing Plans

```javascript
// Create a plan with usage-based charges
const plan = await lago.plans.create({
  name: 'Pro Plan',
  code: 'pro_plan',
  interval: 'monthly',
  amount_cents: 4900, // $49.00 base
  amount_currency: 'USD',
  charges: [
    {
      billable_metric_code: 'agent_execution',
      charge_model: 'graduated',
      graduated_ranges: [
        { from_value: 0, to_value: 100, per_unit_amount: '0', flat_amount: '0' },
        { from_value: 101, to_value: 1000, per_unit_amount: '0.10', flat_amount: '0' },
        { from_value: 1001, to_value: null, per_unit_amount: '0.05', flat_amount: '0' },
      ],
    },
    {
      billable_metric_code: 'token_usage',
      charge_model: 'standard',
      properties: {
        amount: '0.00001', // Per token
      },
    },
  ],
});
```

### 3.6 Self-Hosted Deployment

```yaml
# docker-compose.yml
version: '3.8'
services:
  lago-api:
    image: getlago/api:v1.0.0
    environment:
      DATABASE_URL: postgresql://lago:password@db:5432/lago
      REDIS_URL: redis://redis:6379
      LAGO_API_URL: https://api.billing.example.com
      SECRET_KEY_BASE: ${SECRET_KEY_BASE}
    depends_on:
      - db
      - redis

  lago-front:
    image: getlago/front:v1.0.0
    environment:
      API_URL: https://api.billing.example.com

  db:
    image: postgres:15
    volumes:
      - lago_db:/var/lib/postgresql/data

  redis:
    image: redis:7

volumes:
  lago_db:
```

### 3.7 When to Choose Lago

**Advantages**:
- Free self-hosted option
- Full data ownership
- No per-event costs
- OpenAPI specification
- AGPL-3.0 license

**Considerations**:
- Requires infrastructure management
- Smaller ecosystem than Stripe
- No built-in payment processing (integrates with Stripe, GoCardless)
- Limited enterprise support on free tier

---

## 4. Platform Comparison Matrix

| Feature | Stripe Billing | Orb | Lago |
|---------|----------------|-----|------|
| **Pricing** | 0.7% of billing volume (includes 100M meter events/month) | Custom/Enterprise | Free (self-hosted) / Usage-based (cloud) |
| **Event Throughput** | 10K/sec v2 stream (up to 100K/sec per business) | 1,000+ events/sec native; hosted rollups stress-tested to hundreds of thousands/sec | Not specified; batch endpoint supports 100 events/request |
| **Late Data Handling** | Event adjustments supported; no automatic recomputation | Automatic recomputation from raw events | Manual adjustment |
| **Metric Definition** | Limited aggregations | Full SQL | SQL + built-in aggregations |
| **Payment Processing** | Native | Via Stripe | Via integrations |
| **Self-Hosting** | No | No | Yes (AGPL-3.0) |
| **Customer Portal** | Yes | No (build your own) | Basic |
| **Multi-Currency** | Yes | Yes | Yes |
| **Webhooks** | Comprehensive | Comprehensive | Basic |
| **Ideal Scale** | Small-Medium | Medium-Enterprise | Small-Medium |
| **Implementation Effort** | Low | Medium | Medium-High |

**Sources**:
- Stripe Billing pricing: https://stripe.com/billing/pricing
- Stripe meter event stream limits: https://docs.stripe.com/api/billing/meter_event_stream
- Orb ingestion and rollups: https://docs.withorb.com/reference/ingest, https://docs.withorb.com/reference/hosted-rollups
- Lago events API: https://doc.getlago.com/api-reference/events/event

**Recommendation for Hyyve Platform**:
- **Primary**: Stripe Billing for payments + subscriptions
- **Consider**: Orb for complex usage metering at scale
- **Alternative**: Lago for cost-sensitive or data-sovereignty requirements

---

## 5. Usage Metering Patterns for AI Platforms

### 5.1 What to Meter

For an Hyyve platform, track these billable dimensions:

| Dimension | Unit | Aggregation | Billing Model |
|-----------|------|-------------|---------------|
| Agent Executions | count | sum | Per-execution or tiered |
| Token Usage (Input) | tokens | sum | Per-1K tokens |
| Token Usage (Output) | tokens | sum | Per-1K tokens |
| API Calls | count | sum | Per-1K calls or tiered |
| Document Storage | bytes | max | Per-GB/month |
| Embedding Storage | vectors | max | Per-1M vectors/month |
| Compute Time | seconds | sum | Per-hour |
| Workflow Steps | count | sum | Per-1K steps |
| Knowledge Base Queries | count | sum | Tiered |

### 5.2 Event Schema Design

**Standard Event Schema**:

```typescript
interface BillingEvent {
  // Required fields
  event_type: string;           // e.g., 'agent_execution', 'token_usage'
  timestamp: string;            // ISO 8601
  customer_id: string;          // External customer identifier
  idempotency_key: string;      // Unique event identifier

  // Common properties
  properties: {
    workspace_id?: string;      // Multi-tenant workspace
    project_id?: string;        // Project within workspace
    agent_id?: string;          // Specific agent
    workflow_id?: string;       // Workflow identifier
    module_id?: string;         // Marketplace module (for revenue share)

    // Usage-specific
    value: number;              // Primary billable value
    unit: string;               // Unit of measurement

    // Cost attribution
    model?: string;             // LLM model used
    provider?: string;          // AI provider (openai, anthropic)
    region?: string;            // Compute region

    // Metadata
    metadata?: Record<string, any>;
  };
}
```

**Example Events**:

```json
// Agent Execution Event
{
  "event_type": "agent_execution",
  "timestamp": "2026-01-20T10:30:00.000Z",
  "customer_id": "cust_abc123",
  "idempotency_key": "exec_550e8400-e29b-41d4-a716-446655440000",
  "properties": {
    "workspace_id": "ws_123",
    "project_id": "proj_456",
    "agent_id": "agent_789",
    "value": 1,
    "unit": "execution",
    "duration_ms": 3500,
    "status": "success"
  }
}

// Token Usage Event
{
  "event_type": "token_usage",
  "timestamp": "2026-01-20T10:30:01.000Z",
  "customer_id": "cust_abc123",
  "idempotency_key": "token_550e8400-e29b-41d4-a716-446655440001",
  "properties": {
    "workspace_id": "ws_123",
    "agent_id": "agent_789",
    "value": 3500,
    "unit": "tokens",
    "model": "claude-opus-4.5",
    "provider": "anthropic",
    "token_type": "output",
    "module_id": "mod_marketplace_123"
  }
}

// Storage Event (periodic snapshot)
{
  "event_type": "storage_snapshot",
  "timestamp": "2026-01-20T00:00:00.000Z",
  "customer_id": "cust_abc123",
  "idempotency_key": "storage_20260120_ws_123",
  "properties": {
    "workspace_id": "ws_123",
    "value": 5368709120,
    "unit": "bytes",
    "storage_type": "documents"
  }
}
```

### 5.3 Real-Time vs Batch Metering

**Architecture Options**:

```
Option A: Real-Time Streaming
┌─────────────┐     ┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   App API   │────▶│   Kafka/    │────▶│   Metering   │────▶│   Billing   │
│             │     │   Redis     │     │   Service    │     │   Provider  │
└─────────────┘     └─────────────┘     └──────────────┘     └─────────────┘
                                              │
                                              ▼
                                        ┌──────────────┐
                                        │   Time-     │
                                        │   Series DB │
                                        └──────────────┘

Option B: Batch Aggregation
┌─────────────┐     ┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   App API   │────▶│   Event     │────▶│   Data       │────▶│   Billing   │
│             │     │   Log (S3)  │     │   Warehouse  │     │   Provider  │
└─────────────┘     └─────────────┘     └──────────────┘     └─────────────┘
                                              │
                                              │ (Hourly aggregation jobs)
                                              ▼

Option C: Hybrid (Recommended)
┌─────────────┐
│   App API   │
└──────┬──────┘
       │
       ├───────────────────────────────────┐
       │                                   │
       ▼                                   ▼
┌─────────────┐                    ┌─────────────────┐
│   Kafka     │                    │   Event Log     │
│   (Real-    │                    │   (Durable      │
│   time)     │                    │   Storage)      │
└──────┬──────┘                    └────────┬────────┘
       │                                    │
       ▼                                    ▼
┌─────────────────┐              ┌─────────────────┐
│   Real-time     │              │   Batch         │
│   Dashboard &   │              │   Invoicing     │
│   Alerts        │              │   (Source of    │
└─────────────────┘              │   Truth)        │
                                 └─────────────────┘
```

### 5.4 Idempotency Implementation

```typescript
// Redis-based idempotency check
class MeteringService {
  private redis: Redis;
  private idempotencyTTL = 24 * 60 * 60; // 24 hours

  async processEvent(event: BillingEvent): Promise<boolean> {
    const key = `billing:idempotency:${event.idempotency_key}`;

    // SETNX returns 1 if key was set, 0 if it existed
    const isNew = await this.redis.setnx(key, '1');

    if (!isNew) {
      console.log(`Duplicate event ignored: ${event.idempotency_key}`);
      return false;
    }

    // Set expiration
    await this.redis.expire(key, this.idempotencyTTL);

    // Process the event
    await this.recordUsage(event);
    return true;
  }

  private async recordUsage(event: BillingEvent): Promise<void> {
    // Send to billing provider with retry logic
    await retry(
      () => this.billingProvider.recordUsage(event),
      { retries: 3, backoff: 'exponential' }
    );
  }
}
```

### 5.5 Cost Attribution per Tenant

```typescript
// Multi-dimensional cost tracking
interface CostAllocation {
  total_cost: number;
  breakdown: {
    by_workspace: Record<string, number>;
    by_project: Record<string, number>;
    by_agent: Record<string, number>;
    by_module: Record<string, {
      usage_cost: number;
      revenue_share: number; // For marketplace modules
    }>;
    by_model: Record<string, number>;
  };
}

class CostAttributionService {
  async calculatePeriodCosts(
    customerId: string,
    periodStart: Date,
    periodEnd: Date
  ): Promise<CostAllocation> {
    // Query aggregated usage
    const usage = await this.queryUsage(customerId, periodStart, periodEnd);

    const allocation: CostAllocation = {
      total_cost: 0,
      breakdown: {
        by_workspace: {},
        by_project: {},
        by_agent: {},
        by_module: {},
        by_model: {},
      },
    };

    for (const event of usage) {
      const cost = this.calculateEventCost(event);
      allocation.total_cost += cost;

      // Attribute to dimensions
      if (event.workspace_id) {
        allocation.breakdown.by_workspace[event.workspace_id] =
          (allocation.breakdown.by_workspace[event.workspace_id] || 0) + cost;
      }

      // Track marketplace module revenue
      if (event.module_id) {
        const module = allocation.breakdown.by_module[event.module_id] || {
          usage_cost: 0,
          revenue_share: 0,
        };
        module.usage_cost += cost;
        module.revenue_share = cost * this.getModuleRevenueShare(event.module_id);
        allocation.breakdown.by_module[event.module_id] = module;
      }
    }

    return allocation;
  }
}
```

---

## 6. Pricing Model Analysis

### 6.1 Pricing Model Comparison

| Model | Pros | Cons | Best For |
|-------|------|------|----------|
| **Per-Seat** | Predictable revenue, simple to understand | Doesn't scale with value, discourages adoption | Traditional SaaS, team collaboration tools |
| **Per-Execution** | Direct value alignment, transparent | Unpredictable costs for users, discourages usage | Simple automation, batch processing |
| **Token-Based** | Precise cost alignment, industry standard for AI | Complex to predict, requires user education | AI/LLM platforms, API services |
| **Tiered Usage** | Encourages growth, predictable tiers | Complex pricing pages, tier anxiety | Growing startups, freemium models |
| **Hybrid (Base + Usage)** | Revenue stability + growth capture, best of both | More complex billing, requires explanation | Enterprise SaaS, AI platforms (recommended) |

### 6.2 Recommended Pricing Structure for Hyyve Platform

**Tier Structure**:

```
FREE TIER ($0/month)
├── 100 agent executions/month
├── 10,000 tokens (input + output)
├── 100MB document storage
├── 1 workspace, 1 project
├── Community modules only
└── Email support

PRO TIER ($49/month base)
├── 1,000 agent executions included
│   └── +$0.05/execution overage
├── 100,000 tokens included
│   └── +$0.01/1K tokens overage
├── 5GB document storage included
│   └── +$0.10/GB overage
├── 5 workspaces, unlimited projects
├── Access to marketplace modules
└── Priority email support

TEAM TIER ($199/month base)
├── 10,000 agent executions included
│   └── +$0.03/execution overage
├── 1,000,000 tokens included
│   └── +$0.008/1K tokens overage
├── 50GB document storage included
│   └── +$0.08/GB overage
├── Unlimited workspaces/projects
├── SSO, audit logs
├── Custom modules
└── Slack support

ENTERPRISE (Custom)
├── Volume discounts on usage
├── Committed spend agreements
├── Custom contracts (NET 30/60/90)
├── Dedicated support
├── On-premise deployment option
└── SLA guarantees
```

### 6.3 Credit-Based Pricing Alternative

Many AI platforms adopt prepaid credits for predictability:

```
CREDIT PACKAGES
├── Starter Pack: $20 → 2,500 credits (no expiration)
├── Growth Pack: $100 → 15,000 credits (20% bonus)
├── Pro Pack: $500 → 85,000 credits (30% bonus)
└── Enterprise: Custom committed spend

CREDIT USAGE
├── Agent Execution: 10 credits
├── Input Tokens: 1 credit per 1K tokens
├── Output Tokens: 3 credits per 1K tokens (Opus)
├── Document Upload: 1 credit per MB
└── Knowledge Query: 2 credits
```

**Credit System Benefits**:
- Revenue predictability (prepaid)
- Budget control for users
- Simpler unit economics
- Reduces billing disputes

---

## 7. Multi-Tenant Billing Architecture

### 7.1 Billing Hierarchy

```
Organization (Billing Entity)
└── Workspaces (Cost Centers)
    └── Projects (Usage Tracking)
        ├── Agents
        ├── Workflows
        └── Knowledge Bases
```

### 7.2 Data Model

```typescript
// Prisma schema for billing hierarchy
model Organization {
  id                String   @id @default(cuid())
  name              String
  stripeCustomerId  String?  @unique
  billingEmail      String

  // Billing settings
  billingMode       BillingMode @default(POSTPAID)
  creditBalance     Decimal  @default(0)
  spendLimit        Decimal?

  // Relationships
  workspaces        Workspace[]
  invoices          Invoice[]
  creditGrants      CreditGrant[]

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model Workspace {
  id              String   @id @default(cuid())
  name            String
  organizationId  String
  organization    Organization @relation(fields: [organizationId], references: [id])

  // Cost allocation
  costCenterId    String?
  budgetLimit     Decimal?

  // Relationships
  projects        Project[]
  usageRecords    UsageRecord[]

  createdAt       DateTime @default(now())
}

model Project {
  id            String    @id @default(cuid())
  name          String
  workspaceId   String
  workspace     Workspace @relation(fields: [workspaceId], references: [id])

  // Usage tracking
  agents        Agent[]
  workflows     Workflow[]

  createdAt     DateTime  @default(now())
}

model UsageRecord {
  id              String   @id @default(cuid())
  organizationId  String
  workspaceId     String?
  projectId       String?
  agentId         String?
  moduleId        String?  // For marketplace revenue share

  eventType       String
  value           Decimal
  unit            String

  // Cost calculation
  unitCost        Decimal
  totalCost       Decimal

  // Billing sync
  stripeMeterId   String?
  syncedAt        DateTime?

  timestamp       DateTime @default(now())

  @@index([organizationId, timestamp])
  @@index([workspaceId, timestamp])
}

enum BillingMode {
  PREPAID   // Credit-based
  POSTPAID  // Invoice at period end
  HYBRID    // Base subscription + usage
}
```

### 7.3 Workspace-Level Billing

```typescript
// Calculate workspace-level usage for cost allocation
async function calculateWorkspaceCosts(
  organizationId: string,
  billingPeriod: { start: Date; end: Date }
): Promise<WorkspaceCost[]> {
  const usageByWorkspace = await prisma.usageRecord.groupBy({
    by: ['workspaceId'],
    where: {
      organizationId,
      timestamp: {
        gte: billingPeriod.start,
        lt: billingPeriod.end,
      },
    },
    _sum: {
      totalCost: true,
    },
  });

  return usageByWorkspace.map(ws => ({
    workspaceId: ws.workspaceId,
    totalCost: ws._sum.totalCost || 0,
  }));
}

// Budget enforcement
async function checkBudgetLimit(workspaceId: string): Promise<BudgetStatus> {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: { organization: true },
  });

  if (!workspace.budgetLimit) {
    return { allowed: true };
  }

  const currentPeriodUsage = await getCurrentPeriodUsage(workspaceId);

  if (currentPeriodUsage >= workspace.budgetLimit) {
    return {
      allowed: false,
      reason: 'WORKSPACE_BUDGET_EXCEEDED',
      limit: workspace.budgetLimit,
      current: currentPeriodUsage,
    };
  }

  // Check org-level spend limit
  if (workspace.organization.spendLimit) {
    const orgUsage = await getOrgCurrentPeriodUsage(workspace.organizationId);
    if (orgUsage >= workspace.organization.spendLimit) {
      return {
        allowed: false,
        reason: 'ORGANIZATION_SPEND_LIMIT',
        limit: workspace.organization.spendLimit,
        current: orgUsage,
      };
    }
  }

  return { allowed: true };
}
```

### 7.4 Prepaid Credits vs Postpaid

**Prepaid (Credits)**:
```typescript
// Deduct credits before execution
async function deductCredits(
  organizationId: string,
  amount: number,
  description: string
): Promise<CreditDeduction> {
  return await prisma.$transaction(async (tx) => {
    const org = await tx.organization.findUnique({
      where: { id: organizationId },
    });

    if (org.creditBalance < amount) {
      throw new InsufficientCreditsError(org.creditBalance, amount);
    }

    // Deduct credits
    await tx.organization.update({
      where: { id: organizationId },
      data: {
        creditBalance: { decrement: amount },
      },
    });

    // Record transaction
    return await tx.creditTransaction.create({
      data: {
        organizationId,
        type: 'DEDUCTION',
        amount: -amount,
        description,
        balanceAfter: org.creditBalance - amount,
      },
    });
  });
}
```

**Postpaid (Invoice)**:
```typescript
// Record usage for end-of-period invoicing
async function recordPostpaidUsage(
  organizationId: string,
  event: BillingEvent
): Promise<void> {
  // Calculate cost
  const cost = calculateEventCost(event);

  // Record locally
  await prisma.usageRecord.create({
    data: {
      organizationId,
      workspaceId: event.properties.workspace_id,
      projectId: event.properties.project_id,
      agentId: event.properties.agent_id,
      moduleId: event.properties.module_id,
      eventType: event.event_type,
      value: event.properties.value,
      unit: event.properties.unit,
      unitCost: getUnitCost(event.event_type),
      totalCost: cost,
      timestamp: new Date(event.timestamp),
    },
  });

  // Sync to billing provider (async)
  await meteringQueue.add('sync-usage', {
    organizationId,
    event,
  });
}
```

---

## 8. Marketplace Revenue Share Implementation

### 8.1 Revenue Share Model

```
Module Sale Revenue Flow
┌─────────────────────────────────────────────────────────────┐
│                    Customer Payment ($10)                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Platform Processes                        │
│                                                              │
│  1. Payment Processing Fee (Stripe): $0.59 (2.9% + $0.30)   │
│  2. Platform Fee (20%): $2.00                                │
│  3. Creator Payout (80% - fees): $7.41                       │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Tracking Module-Specific Revenue

```typescript
// Track usage by marketplace module
interface ModuleUsageEvent extends BillingEvent {
  properties: BillingEvent['properties'] & {
    module_id: string;
    module_creator_id: string;
    module_version: string;
  };
}

// Calculate creator earnings
async function calculateCreatorEarnings(
  creatorId: string,
  period: { start: Date; end: Date }
): Promise<CreatorEarnings> {
  // Get all usage of creator's modules
  const moduleUsage = await prisma.usageRecord.groupBy({
    by: ['moduleId'],
    where: {
      timestamp: { gte: period.start, lt: period.end },
      moduleId: { not: null },
      module: { creatorId },
    },
    _sum: { totalCost: true },
  });

  const platformFeeRate = 0.20; // 20% platform fee

  const earnings: CreatorEarnings = {
    creatorId,
    period,
    modules: [],
    totalRevenue: 0,
    platformFee: 0,
    netEarnings: 0,
  };

  for (const usage of moduleUsage) {
    const moduleRevenue = usage._sum.totalCost || 0;
    const platformFee = moduleRevenue * platformFeeRate;
    const creatorShare = moduleRevenue - platformFee;

    earnings.modules.push({
      moduleId: usage.moduleId,
      revenue: moduleRevenue,
      platformFee,
      creatorShare,
    });

    earnings.totalRevenue += moduleRevenue;
    earnings.platformFee += platformFee;
    earnings.netEarnings += creatorShare;
  }

  return earnings;
}
```

### 8.3 Stripe Connect Integration

```typescript
// Setup connected account for creator
async function setupCreatorAccount(creatorId: string): Promise<string> {
  // Create Stripe Connect Express account
  const account = await stripe.accounts.create({
    type: 'express',
    country: 'US',
    capabilities: {
      transfers: { requested: true },
    },
    business_type: 'individual',
    metadata: {
      creator_id: creatorId,
    },
  });

  // Generate onboarding link
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `https://app.example.com/creator/onboarding?refresh=true`,
    return_url: `https://app.example.com/creator/onboarding/complete`,
    type: 'account_onboarding',
  });

  // Store account ID
  await prisma.creator.update({
    where: { id: creatorId },
    data: { stripeConnectId: account.id },
  });

  return accountLink.url;
}

// Process creator payout
async function processCreatorPayout(
  creatorId: string,
  amount: number,
  description: string
): Promise<Payout> {
  const creator = await prisma.creator.findUnique({
    where: { id: creatorId },
  });

  if (!creator.stripeConnectId) {
    throw new Error('Creator not set up for payouts');
  }

  // Create transfer to connected account
  const transfer = await stripe.transfers.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'usd',
    destination: creator.stripeConnectId,
    description,
    metadata: {
      creator_id: creatorId,
      payout_type: 'module_revenue_share',
    },
  });

  // Record payout
  return await prisma.payout.create({
    data: {
      creatorId,
      amount,
      stripeTransferId: transfer.id,
      status: 'PENDING',
    },
  });
}
```

### 8.4 Creator Earnings Dashboard Data

```typescript
// API endpoint for creator dashboard
app.get('/api/creator/earnings', auth, async (req, res) => {
  const creatorId = req.user.creatorId;

  // Current period earnings
  const currentPeriod = getCurrentBillingPeriod();
  const earnings = await calculateCreatorEarnings(creatorId, currentPeriod);

  // Historical earnings
  const history = await prisma.payout.findMany({
    where: { creatorId },
    orderBy: { createdAt: 'desc' },
    take: 12,
  });

  // Module performance
  const moduleStats = await prisma.usageRecord.groupBy({
    by: ['moduleId'],
    where: {
      module: { creatorId },
      timestamp: { gte: subMonths(new Date(), 6) },
    },
    _count: { id: true },
    _sum: { totalCost: true },
  });

  res.json({
    currentPeriod: earnings,
    payoutHistory: history,
    modulePerformance: moduleStats,
    pendingPayout: earnings.netEarnings,
    nextPayoutDate: getNextPayoutDate(),
  });
});
```

---

## 9. Enterprise Billing Features

### 9.1 Committed Use Discounts

```typescript
// Committed spend agreement
interface CommittedSpendAgreement {
  organizationId: string;
  commitmentAmount: number;       // Annual committed spend
  discountRate: number;           // e.g., 0.20 for 20% discount
  term: {
    start: Date;
    end: Date;
  };
  usageThresholds: {
    minMonthlySpend: number;      // Minimum to maintain discount
    maxCarryover: number;         // Max unused credits to carry forward
  };
}

// Apply committed discount to pricing
function applyCommittedDiscount(
  unitPrice: number,
  agreement: CommittedSpendAgreement | null
): number {
  if (!agreement) return unitPrice;

  // Check if agreement is active
  const now = new Date();
  if (now < agreement.term.start || now > agreement.term.end) {
    return unitPrice;
  }

  return unitPrice * (1 - agreement.discountRate);
}
```

### 9.2 Volume Pricing Tiers

```typescript
// Volume-based pricing for enterprise
const volumePricing = {
  agent_execution: [
    { upTo: 10000, unitPrice: 0.10 },
    { upTo: 100000, unitPrice: 0.08 },
    { upTo: 1000000, unitPrice: 0.05 },
    { upTo: Infinity, unitPrice: 0.03 },
  ],
  token_usage: [
    { upTo: 1000000, unitPrice: 0.00001 },
    { upTo: 10000000, unitPrice: 0.000008 },
    { upTo: 100000000, unitPrice: 0.000005 },
    { upTo: Infinity, unitPrice: 0.000003 },
  ],
};

function calculateTieredCost(
  usage: number,
  tiers: { upTo: number; unitPrice: number }[]
): number {
  let remainingUsage = usage;
  let totalCost = 0;
  let previousThreshold = 0;

  for (const tier of tiers) {
    const tierUsage = Math.min(
      remainingUsage,
      tier.upTo - previousThreshold
    );

    if (tierUsage <= 0) break;

    totalCost += tierUsage * tier.unitPrice;
    remainingUsage -= tierUsage;
    previousThreshold = tier.upTo;
  }

  return totalCost;
}
```

### 9.3 NET 30/60/90 Invoice Terms

```typescript
// Create invoice with payment terms
async function createEnterpriseInvoice(
  organizationId: string,
  lineItems: InvoiceLineItem[],
  paymentTerms: 'NET_30' | 'NET_60' | 'NET_90' = 'NET_30'
): Promise<Invoice> {
  const daysUntilDue = {
    NET_30: 30,
    NET_60: 60,
    NET_90: 90,
  };

  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
  });

  // Create Stripe invoice
  const stripeInvoice = await stripe.invoices.create({
    customer: org.stripeCustomerId,
    collection_method: 'send_invoice', // Don't auto-charge
    days_until_due: daysUntilDue[paymentTerms],
    auto_advance: true,
  });

  // Add line items
  for (const item of lineItems) {
    await stripe.invoiceItems.create({
      customer: org.stripeCustomerId,
      invoice: stripeInvoice.id,
      amount: Math.round(item.amount * 100),
      currency: 'usd',
      description: item.description,
    });
  }

  // Finalize and send
  const finalizedInvoice = await stripe.invoices.finalizeInvoice(
    stripeInvoice.id
  );

  await stripe.invoices.sendInvoice(stripeInvoice.id);

  return await prisma.invoice.create({
    data: {
      organizationId,
      stripeInvoiceId: finalizedInvoice.id,
      amount: finalizedInvoice.amount_due / 100,
      status: 'SENT',
      paymentTerms,
      dueDate: new Date(finalizedInvoice.due_date * 1000),
    },
  });
}
```

### 9.4 Multiple Payment Methods

```typescript
// Enterprise payment method configuration
interface EnterprisePaymentConfig {
  primaryMethod: 'card' | 'ach' | 'wire' | 'invoice';
  backupMethod?: 'card' | 'ach';
  autoPayEnabled: boolean;
  autoPayThreshold?: number;  // Auto-pay invoices under this amount
  approvalRequired?: number;  // Require approval for invoices over this
}

// Configure payment methods
async function configureEnterprisePayment(
  organizationId: string,
  config: EnterprisePaymentConfig
): Promise<void> {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
  });

  // Update Stripe customer
  await stripe.customers.update(org.stripeCustomerId, {
    invoice_settings: {
      default_payment_method: config.autoPayEnabled
        ? await getDefaultPaymentMethod(org.stripeCustomerId)
        : null,
    },
    metadata: {
      payment_config: JSON.stringify(config),
    },
  });

  // Store config locally
  await prisma.organization.update({
    where: { id: organizationId },
    data: {
      paymentConfig: config,
    },
  });
}
```

---

## 10. Cost Tracking & Attribution

### 10.1 LLM API Cost Passthrough

```typescript
// LLM pricing configuration (January 2026)
const llmPricing = {
  anthropic: {
    'claude-opus-4.5': {
      input: 0.005,   // Per 1K tokens (converted from per 1M pricing)
      output: 0.025,
      cached_input: 0.0005, // Cache hits
    },
    'claude-sonnet-4': {
      input: 0.003,
      output: 0.015,
      cached_input: 0.0003,
    },
    'claude-haiku-3.5': {
      input: 0.001,
      output: 0.005,
      cached_input: 0.0001,
    },
  },
  openai: {
    'gpt-4o': {
      input: 0.0025,
      output: 0.01,
      cached_input: 0.00125,
    },
    'gpt-4o-mini': {
      input: 0.00015,
      output: 0.0006,
      cached_input: 0.000075,
    },
  },
};

**Sources**:
- Anthropic pricing: https://docs.anthropic.com/en/docs/about-claude/models
- OpenAI API pricing: https://openai.com/api/pricing

// Calculate LLM cost with margin
function calculateLLMCostWithMargin(
  provider: string,
  model: string,
  inputTokens: number,
  outputTokens: number,
  cachedInputTokens: number = 0,
  marginPercent: number = 0.20 // 20% margin
): { cost: number; margin: number; price: number } {
  const pricing = llmPricing[provider]?.[model];
  if (!pricing) {
    throw new Error(`Unknown model: ${provider}/${model}`);
  }

  const inputCost = (inputTokens / 1000) * pricing.input;
  const outputCost = (outputTokens / 1000) * pricing.output;
  const cachedCost = pricing.cached_input
    ? (cachedInputTokens / 1000) * pricing.cached_input
    : 0;

  const baseCost = inputCost + outputCost + cachedCost;
  const margin = baseCost * marginPercent;
  const price = baseCost + margin;

  return { cost: baseCost, margin, price };
}
```

### 10.2 Real-Time Cost Dashboard

```typescript
// Cost dashboard data aggregation
interface CostDashboardData {
  period: { start: Date; end: Date };
  summary: {
    totalCost: number;
    llmCost: number;
    platformCost: number;
    projectedMonthEnd: number;
  };
  byDimension: {
    workspace: Record<string, number>;
    model: Record<string, number>;
    agent: Record<string, number>;
  };
  timeSeries: {
    timestamp: Date;
    cost: number;
  }[];
  topCostDrivers: {
    type: string;
    id: string;
    name: string;
    cost: number;
    percentage: number;
  }[];
}

async function getCostDashboard(
  organizationId: string,
  period: { start: Date; end: Date }
): Promise<CostDashboardData> {
  // Aggregate usage costs
  const usage = await prisma.usageRecord.findMany({
    where: {
      organizationId,
      timestamp: { gte: period.start, lt: period.end },
    },
  });

  const data: CostDashboardData = {
    period,
    summary: { totalCost: 0, llmCost: 0, platformCost: 0, projectedMonthEnd: 0 },
    byDimension: { workspace: {}, model: {}, agent: {} },
    timeSeries: [],
    topCostDrivers: [],
  };

  // Calculate aggregations
  for (const record of usage) {
    const cost = Number(record.totalCost);
    data.summary.totalCost += cost;

    if (record.eventType === 'token_usage') {
      data.summary.llmCost += cost;
    } else {
      data.summary.platformCost += cost;
    }

    // Dimension breakdowns
    if (record.workspaceId) {
      data.byDimension.workspace[record.workspaceId] =
        (data.byDimension.workspace[record.workspaceId] || 0) + cost;
    }
  }

  // Project month-end based on current run rate
  const daysInPeriod = differenceInDays(period.end, period.start);
  const daysElapsed = differenceInDays(new Date(), period.start);
  if (daysElapsed > 0) {
    const dailyAverage = data.summary.totalCost / daysElapsed;
    data.summary.projectedMonthEnd = dailyAverage * daysInPeriod;
  }

  return data;
}
```

### 10.3 Budget Alerts and Limits

```typescript
// Budget alert configuration
interface BudgetConfig {
  organizationId: string;
  limits: {
    monthly?: number;
    workspace?: Record<string, number>;
  };
  alerts: {
    thresholds: number[];  // e.g., [0.5, 0.75, 0.9, 1.0]
    channels: ('email' | 'slack' | 'webhook')[];
  };
  actions: {
    onLimitReached: 'notify' | 'throttle' | 'block';
  };
}

// Check and enforce budget
async function enforceBudget(
  organizationId: string,
  proposedCost: number
): Promise<{ allowed: boolean; reason?: string }> {
  const config = await getBudgetConfig(organizationId);
  const currentSpend = await getCurrentPeriodSpend(organizationId);
  const projectedSpend = currentSpend + proposedCost;

  // Check monthly limit
  if (config.limits.monthly && projectedSpend > config.limits.monthly) {
    switch (config.actions.onLimitReached) {
      case 'block':
        return {
          allowed: false,
          reason: `Monthly budget limit of $${config.limits.monthly} exceeded`
        };
      case 'throttle':
        // Queue for later execution
        await queueForLater(organizationId, proposedCost);
        return { allowed: false, reason: 'Request queued due to budget' };
      case 'notify':
        await sendBudgetAlert(organizationId, 'limit_exceeded');
        return { allowed: true };
    }
  }

  // Check alert thresholds
  for (const threshold of config.alerts.thresholds.sort((a, b) => b - a)) {
    const thresholdAmount = config.limits.monthly * threshold;
    if (projectedSpend >= thresholdAmount && currentSpend < thresholdAmount) {
      await sendBudgetAlert(organizationId, 'threshold_reached', {
        threshold: threshold * 100,
        currentSpend,
        limit: config.limits.monthly,
      });
      break;
    }
  }

  return { allowed: true };
}
```

### 10.4 Per-Customer Profitability

```typescript
// Calculate customer profitability
interface CustomerProfitability {
  customerId: string;
  period: { start: Date; end: Date };
  revenue: {
    subscription: number;
    usage: number;
    total: number;
  };
  costs: {
    llm: number;
    infrastructure: number;
    support: number;
    total: number;
  };
  margin: {
    gross: number;
    percentage: number;
  };
  metrics: {
    revenuePerExecution: number;
    costPerExecution: number;
    ltv: number;
  };
}

async function calculateCustomerProfitability(
  customerId: string,
  period: { start: Date; end: Date }
): Promise<CustomerProfitability> {
  // Get revenue (from Stripe)
  const invoices = await stripe.invoices.list({
    customer: customerId,
    created: {
      gte: Math.floor(period.start.getTime() / 1000),
      lt: Math.floor(period.end.getTime() / 1000),
    },
  });

  const revenue = {
    subscription: 0,
    usage: 0,
    total: 0,
  };

  for (const invoice of invoices.data) {
    for (const line of invoice.lines.data) {
      if (line.price?.recurring) {
        revenue.subscription += line.amount / 100;
      } else {
        revenue.usage += line.amount / 100;
      }
    }
  }
  revenue.total = revenue.subscription + revenue.usage;

  // Get costs (from usage records)
  const usageRecords = await prisma.usageRecord.findMany({
    where: {
      organization: { stripeCustomerId: customerId },
      timestamp: { gte: period.start, lt: period.end },
    },
  });

  const costs = {
    llm: 0,
    infrastructure: 0,
    support: 0,
    total: 0,
  };

  for (const record of usageRecords) {
    if (record.eventType === 'token_usage') {
      costs.llm += Number(record.unitCost) * Number(record.value);
    } else {
      costs.infrastructure += Number(record.unitCost) * Number(record.value) * 0.3; // 30% infra cost
    }
  }
  costs.total = costs.llm + costs.infrastructure + costs.support;

  // Calculate margins
  const grossMargin = revenue.total - costs.total;
  const marginPercentage = revenue.total > 0
    ? (grossMargin / revenue.total) * 100
    : 0;

  // Calculate metrics
  const totalExecutions = usageRecords.filter(
    r => r.eventType === 'agent_execution'
  ).length;

  return {
    customerId,
    period,
    revenue,
    costs,
    margin: {
      gross: grossMargin,
      percentage: marginPercentage,
    },
    metrics: {
      revenuePerExecution: totalExecutions > 0
        ? revenue.usage / totalExecutions
        : 0,
      costPerExecution: totalExecutions > 0
        ? costs.total / totalExecutions
        : 0,
      ltv: grossMargin * 12, // Simplified annual projection
    },
  };
}
```

---

## 11. Implementation Patterns

### 11.1 Metering Service Architecture

```
                                   ┌─────────────────────────────────────┐
                                   │         Application Layer           │
                                   │  (Agents, Workflows, Knowledge)     │
                                   └───────────────┬─────────────────────┘
                                                   │
                                                   │ Billing Events
                                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Metering Service                                   │
│                                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   Event     │───▶│  Idempotency│───▶│  Enrichment │───▶│   Buffer    │  │
│  │   Ingress   │    │   Check     │    │   (Pricing) │    │   Queue     │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └──────┬──────┘  │
│                                                                   │         │
│                                                                   ▼         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   Local     │◀───│  Aggregation│◀───│   Cost      │◀───│   Batch     │  │
│  │   Storage   │    │   (Hourly)  │    │   Calc      │    │   Processor │  │
│  └──────┬──────┘    └─────────────┘    └─────────────┘    └─────────────┘  │
│         │                                                                   │
└─────────┼───────────────────────────────────────────────────────────────────┘
          │
          │ Sync (Periodic)
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Billing Provider (Stripe)                             │
│                                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   Meter     │    │   Invoice   │    │   Customer  │    │   Payment   │  │
│  │   Events    │    │   Generator │    │   Portal    │    │   Processor │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 11.2 Event Processing Pipeline

```typescript
// Metering service implementation
class MeteringService {
  private eventQueue: Queue;
  private redis: Redis;
  private billingProvider: BillingProvider;

  constructor(config: MeteringConfig) {
    this.eventQueue = new Queue('billing-events', {
      connection: config.redis,
    });
    this.setupProcessors();
  }

  // Ingest event (non-blocking)
  async ingestEvent(event: BillingEvent): Promise<void> {
    // Validate event
    this.validateEvent(event);

    // Add to queue for processing
    await this.eventQueue.add('process-event', event, {
      removeOnComplete: true,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  }

  private setupProcessors(): void {
    const worker = new Worker('billing-events', async (job) => {
      const event = job.data as BillingEvent;

      // Idempotency check
      const isNew = await this.checkIdempotency(event.idempotency_key);
      if (!isNew) {
        return { status: 'duplicate', skipped: true };
      }

      // Enrich with pricing
      const enrichedEvent = await this.enrichEvent(event);

      // Store locally
      await this.storeEvent(enrichedEvent);

      // Budget check
      const budgetOk = await this.checkBudget(enrichedEvent);
      if (!budgetOk.allowed) {
        await this.handleBudgetExceeded(enrichedEvent, budgetOk.reason);
      }

      // Real-time sync to billing provider (if configured)
      if (this.config.realtimeSync) {
        await this.syncToBillingProvider(enrichedEvent);
      }

      return { status: 'processed', event: enrichedEvent };
    }, {
      connection: this.config.redis,
      concurrency: 10,
    });
  }

  // Batch sync job (runs hourly)
  async syncBatchToBillingProvider(): Promise<SyncResult> {
    const pendingEvents = await this.getPendingEvents();
    const aggregated = this.aggregateEvents(pendingEvents);

    const results: SyncResult = {
      synced: 0,
      failed: 0,
      errors: [],
    };

    for (const [customerId, usage] of Object.entries(aggregated)) {
      try {
        await this.billingProvider.reportUsage(customerId, usage);
        await this.markEventsSynced(usage.eventIds);
        results.synced += usage.eventIds.length;
      } catch (error) {
        results.failed += usage.eventIds.length;
        results.errors.push({ customerId, error: error.message });
      }
    }

    return results;
  }
}
```

### 11.3 Dunning and Grace Periods

```typescript
// Dunning configuration
interface DunningConfig {
  gracePeriodDays: number;        // Days before service suspension
  retrySchedule: number[];        // Days to retry payment [1, 3, 5, 7]
  reminderSchedule: number[];     // Days to send reminders [1, 3, 5]
  finalWarningDays: number;       // Days before final warning
  smartRetries: boolean;          // Use ML-optimized retry timing
}

const defaultDunningConfig: DunningConfig = {
  gracePeriodDays: 7,
  retrySchedule: [1, 3, 5, 7],
  reminderSchedule: [1, 3, 5],
  finalWarningDays: 1,
  smartRetries: true,
};

// Dunning workflow
class DunningService {
  async handlePaymentFailed(invoice: Invoice): Promise<void> {
    const config = await this.getConfig(invoice.organizationId);

    // Record failure
    await prisma.paymentAttempt.create({
      data: {
        invoiceId: invoice.id,
        status: 'FAILED',
        attemptNumber: invoice.attemptCount + 1,
      },
    });

    // Check if within retry window
    const daysSinceFailure = differenceInDays(new Date(), invoice.failedAt);

    if (daysSinceFailure < config.gracePeriodDays) {
      // Schedule retry
      const nextRetryDay = config.retrySchedule.find(d => d > daysSinceFailure);
      if (nextRetryDay) {
        await this.scheduleRetry(invoice, nextRetryDay - daysSinceFailure);
      }

      // Send reminder if scheduled
      if (config.reminderSchedule.includes(daysSinceFailure)) {
        await this.sendPaymentReminder(invoice, {
          daysRemaining: config.gracePeriodDays - daysSinceFailure,
        });
      }
    } else {
      // Grace period expired
      await this.suspendService(invoice.organizationId);
      await this.sendSuspensionNotice(invoice);
    }
  }

  async handlePaymentSucceeded(invoice: Invoice): Promise<void> {
    // Restore service if suspended
    const org = await prisma.organization.findUnique({
      where: { id: invoice.organizationId },
    });

    if (org.status === 'SUSPENDED') {
      await prisma.organization.update({
        where: { id: invoice.organizationId },
        data: { status: 'ACTIVE' },
      });

      await this.sendServiceRestoredNotice(invoice);
    }
  }

  private async scheduleRetry(invoice: Invoice, daysFromNow: number): Promise<void> {
    let retryTime: Date;

    if (this.config.smartRetries) {
      // Use Stripe's Smart Retries or calculate optimal time
      retryTime = await this.calculateOptimalRetryTime(invoice, daysFromNow);
    } else {
      retryTime = addDays(new Date(), daysFromNow);
    }

    await this.jobQueue.add('retry-payment', {
      invoiceId: invoice.id,
    }, {
      delay: retryTime.getTime() - Date.now(),
    });
  }
}
```

### 11.4 Billing Sync Patterns

```typescript
// Webhook-based sync (preferred for accuracy)
app.post('/webhooks/internal/billing-sync', async (req, res) => {
  const event = req.body;

  switch (event.type) {
    case 'invoice.created':
      // Add pending usage to draft invoice
      await syncUsageToInvoice(event.data.invoice_id);
      break;

    case 'invoice.finalized':
      // Mark usage as billed
      await markUsageBilled(event.data.invoice_id);
      break;

    case 'subscription.updated':
      // Handle plan changes, sync new pricing
      await syncSubscriptionChanges(event.data.subscription);
      break;
  }

  res.json({ received: true });
});

// Inject usage into Stripe invoice via webhook
async function syncUsageToInvoice(stripeInvoiceId: string): Promise<void> {
  // Get invoice details
  const stripeInvoice = await stripe.invoices.retrieve(stripeInvoiceId);
  const customerId = stripeInvoice.customer as string;

  // Get organization
  const org = await prisma.organization.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!org) return;

  // Get unbilled usage
  const unbilledUsage = await prisma.usageRecord.findMany({
    where: {
      organizationId: org.id,
      billedInvoiceId: null,
      timestamp: {
        gte: new Date(stripeInvoice.period_start * 1000),
        lt: new Date(stripeInvoice.period_end * 1000),
      },
    },
  });

  // Aggregate by meter type
  const aggregated = aggregateUsageByMeter(unbilledUsage);

  // Report to Stripe meters (if not already synced in real-time)
  for (const [meterName, usage] of Object.entries(aggregated)) {
    const meter = await getMeterByName(meterName);

    await stripe.billing.meterEvents.create({
      event_name: meter.event_name,
      payload: {
        stripe_customer_id: customerId,
        value: usage.total,
      },
    });
  }

  // Mark as pending billing
  await prisma.usageRecord.updateMany({
    where: {
      id: { in: unbilledUsage.map(u => u.id) },
    },
    data: {
      pendingInvoiceId: stripeInvoiceId,
    },
  });
}
```

---

## 12. Architecture Recommendations

### 12.1 Recommended Architecture for Hyyve Platform

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Application Layer                               │
│                                                                              │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│   │    Agent     │  │   Workflow   │  │  Knowledge   │  │  Marketplace │   │
│   │   Runtime    │  │   Engine     │  │    Base      │  │    Module    │   │
│   └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
│          │                 │                 │                 │            │
│          └─────────────────┼─────────────────┼─────────────────┘            │
│                            │                 │                              │
│                            ▼                 ▼                              │
│                     ┌─────────────────────────────┐                         │
│                     │    Usage Event Emitter      │                         │
│                     │    (Async, Non-blocking)    │                         │
│                     └──────────────┬──────────────┘                         │
│                                    │                                        │
└────────────────────────────────────┼────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            Metering Layer                                    │
│                                                                              │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │                        Event Ingestion API                            │  │
│   │   • Validation  • Idempotency  • Enrichment  • Budget Check          │  │
│   └──────────────────────────────────┬───────────────────────────────────┘  │
│                                      │                                       │
│   ┌──────────────────────────────────┼───────────────────────────────────┐  │
│   │                             Kafka/Redis                               │  │
│   │                        (Event Buffer/Queue)                           │  │
│   └──────────────────────────────────┬───────────────────────────────────┘  │
│                                      │                                       │
│   ┌──────────────┐    ┌──────────────┼──────────────┐    ┌──────────────┐  │
│   │  Real-time   │◀───│   Event Processing Workers   │───▶│    Batch     │  │
│   │  Dashboard   │    │   • Aggregation              │    │   Sync Job   │  │
│   │  (WebSocket) │    │   • Cost Calculation         │    │   (Hourly)   │  │
│   └──────────────┘    │   • Alert Evaluation         │    └──────┬───────┘  │
│                       └──────────────────────────────┘           │          │
│                                                                  │          │
│   ┌──────────────────────────────────────────────────────────────┘          │
│   │                                                                          │
│   │   ┌────────────────┐    ┌────────────────┐    ┌────────────────┐       │
│   │   │   PostgreSQL   │    │   TimescaleDB  │    │     Redis      │       │
│   │   │   (Billing     │    │   (Usage       │    │   (Real-time   │       │
│   │   │    Records)    │    │    Time Series)│    │    Counters)   │       │
│   │   └────────────────┘    └────────────────┘    └────────────────┘       │
│   │                                                                          │
└───┼──────────────────────────────────────────────────────────────────────────┘
    │
    │ Sync
    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Billing Provider Layer                               │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                        Stripe Billing                                │   │
│   │   • Subscriptions  • Usage Meters  • Invoicing  • Customer Portal   │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                        Stripe Connect                                │   │
│   │   • Creator Payouts  • Platform Fees  • Revenue Share               │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 12.2 Technology Stack Recommendations

| Component | Recommended | Alternative | Notes |
|-----------|-------------|-------------|-------|
| **Primary Billing** | Stripe Billing | - | Best-in-class for payments + subscriptions |
| **Usage Metering** | Stripe Billing Meters | Orb (at scale) | Built-in, good for <=10K events/sec via v2 stream |
| **Event Queue** | Redis + Bull | Kafka | Simpler for medium scale |
| **Time-Series DB** | TimescaleDB | InfluxDB | Usage analytics, dashboards |
| **Relational DB** | PostgreSQL | - | Billing records, customer data |
| **Real-time Cache** | Redis | - | Counters, idempotency, rate limits |
| **Marketplace Payouts** | Stripe Connect | - | Express accounts for creators |
| **Customer Portal** | Stripe Portal | Custom build | Start with Stripe, customize later |

### 12.3 Implementation Phases

**Phase 1: Foundation (Weeks 1-4)**
- Set up Stripe Billing with subscription plans
- Implement basic usage metering (agent executions)
- Create billing event pipeline
- Build simple usage dashboard

**Phase 2: Usage-Based Billing (Weeks 5-8)**
- Implement all billable metrics (tokens, storage, etc.)
- Add tiered pricing
- Create budget alerts
- Build cost attribution by workspace/project

**Phase 3: Marketplace (Weeks 9-12)**
- Set up Stripe Connect for creators
- Implement revenue share tracking
- Build creator earnings dashboard
- Add module-specific billing

**Phase 4: Enterprise (Weeks 13-16)**
- Add NET 30/60/90 invoice terms
- Implement committed use discounts
- Build volume pricing tiers
- Create enterprise billing portal

**Phase 5: Optimization (Ongoing)**
- Implement prepaid credits
- Add advanced analytics
- Optimize for profitability
- Build dunning automation

### 12.4 Key Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Billing accuracy | 99.99% | Events processed vs billed |
| Event processing latency | <100ms p99 | Time from event to storage |
| Invoice accuracy | 100% | Zero billing disputes from errors |
| Dunning recovery rate | >70% | Failed payments recovered |
| Gross margin | >60% | Revenue minus COGS |
| Customer LTV/CAC | >3x | Unit economics |

---

## 13. Gaps / Missing Considerations (Validated)

### 13.1 Tax Calculation, Compliance, and Rounding
- Taxes/VAT/GST handling is not addressed. If you use Stripe Tax, it can calculate and collect tax, but you still need to define tax codes, jurisdictions, and rounding behavior (line-item vs invoice-level).  
**Sources**: https://docs.stripe.com/tax, https://docs.stripe.com/invoicing/taxes/tax-rates#rounding

### 13.2 Disputes, Chargebacks, and Dispute Fees
- Dispute workflows and dispute fees are missing. Disputes can trigger immediate fees and negative balances, which affects payout timing and marketplace revenue share.  
**Source**: https://docs.stripe.com/disputes/how-disputes-work

### 13.3 Currency Constraints and Minimum Charge Amounts
- The matrix states multi-currency support, but does not address per-currency minimum/maximum charge amounts, zero-decimal currencies, and FX conversion impacts on rounding and revenue recognition.  
**Source**: https://docs.stripe.com/currencies#minimum-and-maximum-charge-amounts

### 13.4 Invoice Finalization Windows and Late Usage
- Usage sync pipelines must respect invoice finalization windows (draft invoices are expected to be finalized within Stripe’s timing constraints). Late usage must be corrected via meter event adjustments, not by modifying finalized invoices.  
**Sources**: https://docs.stripe.com/api/invoices/object#invoice_object-status_transitions, https://docs.stripe.com/api/v2/billing-meter-adjustment

### 13.5 Dunning vs Stripe Smart Retries
- Custom dunning logic must be coordinated with Stripe Smart Retries to avoid conflicting retry schedules and duplicate customer communications.  
**Source**: https://docs.stripe.com/billing/revenue-recovery/smart-retries

### 13.6 Marketplace Liability and Connect Charge Types
- Marketplace payouts require explicit choice of Connect charge type (destination vs separate charges) and fee liability. This affects refunds, chargebacks, and tax handling.  
**Source**: https://docs.stripe.com/connect/destination-charges

## References and Sources

### Official Documentation
- [Stripe Billing Documentation](https://docs.stripe.com/billing)
- [Stripe Billing Pricing](https://stripe.com/billing/pricing)
- [Stripe Billing Meter API](https://docs.stripe.com/api/billing/meter)
- [Stripe Billing Meter Events](https://docs.stripe.com/api/billing/meter_event)
- [Stripe Billing Meter Event Stream (v2)](https://docs.stripe.com/api/billing/meter_event_stream)
- [Stripe Billing Meter Event Session (v2)](https://docs.stripe.com/api/billing/meter_event_session)
- [Stripe Billing Meter Event Adjustments (v2)](https://docs.stripe.com/api/v2/billing-meter-adjustment)
- [Stripe Billing Meters Changelog](https://docs.stripe.com/changelog/billing-meters)
- [Stripe Credits API](https://docs.stripe.com/api/credits)
- [Stripe Usage-Based Billing](https://docs.stripe.com/billing/subscriptions/usage-based)
- [Stripe Subscription Statuses](https://docs.stripe.com/billing/subscriptions/overview#subscription-statuses)
- [Stripe Pause Payment Collection](https://docs.stripe.com/billing/subscriptions/pause-payment-collection)
- [Stripe Connect](https://docs.stripe.com/connect)
- [Stripe Connect Destination Charges](https://docs.stripe.com/connect/destination-charges)
- [Stripe Tax](https://docs.stripe.com/tax)
- [Stripe Tax Rounding](https://docs.stripe.com/invoicing/taxes/tax-rates#rounding)
- [Stripe Disputes](https://docs.stripe.com/disputes/how-disputes-work)
- [Stripe Smart Retries](https://docs.stripe.com/billing/revenue-recovery/smart-retries)
- [Stripe Currencies (Min/Max Amounts)](https://docs.stripe.com/currencies#minimum-and-maximum-charge-amounts)
- [Orb Documentation](https://docs.withorb.com/overview)
- [Orb Ingestion API](https://docs.withorb.com/reference/ingest)
- [Orb Hosted Rollups](https://docs.withorb.com/reference/hosted-rollups)
- [Lago Documentation](https://docs.getlago.com/guide/introduction/welcome-to-lago)
- [Lago Events API](https://doc.getlago.com/api-reference/events/event)
- [Lago Billable Metrics](https://doc.getlago.com/guide/billable-metrics)

### Platform References
- [Vercel Pricing](https://vercel.com/pricing)
- [Supabase Pricing](https://supabase.com/pricing)
- [Anthropic API Pricing](https://docs.anthropic.com/en/docs/about-claude/models)
- [OpenAI API Pricing](https://openai.com/api/pricing)

### Industry Resources
- [Orb Blog: Building Metered Billing](https://www.withorb.com/blog/building-it-yourself-how-to-implement-metered-billing)
- [Lago Blog: Usage-Based Pricing Models](https://www.getlago.com/blog/the-full-playbook-how-to-design-usage-based-pricing-models)
- [Stripe Blog: Credits for Usage-Based Billing](https://stripe.com/blog/introducing-credits-for-usage-based-billing)
- [Kinde: Multi-Tenant Billing Architecture](https://kinde.com/learn/billing/billing-infrastructure/multi-tenant-billing-architecture-scaling-b2b-saas-across-enterprise-hierarchies/)
- [Drivetrain: Unit Economics for AI SaaS](https://www.drivetrain.ai/post/unit-economics-of-ai-saas-companies-cfo-guide-for-managing-token-based-costs-and-margins)

### Research and Analysis
- [SaaS 3.0: The Shift to Usage-Based AI Billing (2026)](https://editorialge.com/saas-3-0-ai-billing-shift-analysis/)
- [LLM API Pricing Comparison 2026](https://pricepertoken.com/)
- [Best Practices for Dunning Management](https://churnbuster.io/dunning-best-practices)

---

*Document generated: January 20, 2026*
*For the Hyyve Platform project*
