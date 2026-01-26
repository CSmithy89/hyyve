# Story 0.1.11: Configure Stripe Billing

## Status

**done**

## Epic

**0.1 - Project Foundation & Infrastructure Setup**

## User Story

As a **developer**,
I want **Stripe SDK configured for billing**,
So that **payment processing infrastructure is ready**.

## Acceptance Criteria

### AC1: Stripe Package Installed

- **Given** the core dependencies are installed
- **When** I configure Stripe billing
- **Then** `stripe@20.0.0` or later is installed

### AC2: Stripe Client Configured

- **Given** Stripe package is installed
- **When** I configure the client
- **Then** Stripe client is initialized server-side only
- **And** client uses secret key from environment

### AC3: Webhook Handler Created

- **Given** Stripe client is configured
- **When** I create the webhook handler
- **Then** webhook handler is created at `app/api/webhooks/stripe/route.ts`
- **And** handler supports POST method

### AC4: Webhook Signature Verification

- **Given** webhook handler is created
- **When** I implement signature verification
- **Then** webhook signature is verified using `STRIPE_WEBHOOK_SECRET`
- **And** invalid signatures are rejected

### AC5: Event Types Defined

- **Given** webhook handler is working
- **When** I define event types
- **Then** types are created for common Stripe events
- **And** types are exported for use in handlers

## Technical Notes

### Stripe Webhook Events to Handle

```typescript
// Subscription lifecycle events
| 'customer.subscription.created'
| 'customer.subscription.updated'
| 'customer.subscription.deleted'
| 'customer.subscription.paused'
| 'customer.subscription.resumed'

// Payment events
| 'invoice.paid'
| 'invoice.payment_failed'
| 'invoice.payment_action_required'

// Customer events
| 'customer.created'
| 'customer.updated'
| 'customer.deleted'

// Checkout events
| 'checkout.session.completed'
| 'checkout.session.expired'
```

### Stripe Client Configuration

```typescript
// apps/web/lib/billing/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});
```

### Webhook Handler Pattern

```typescript
// apps/web/app/api/webhooks/stripe/route.ts
import { stripe } from '@/lib/billing/stripe';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature')!;

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  // Handle event...
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Stripe secret key (sk_test_* or sk_live_*) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (whsec_*) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Public key for client-side (pk_test_* or pk_live_*) |

## Files to Create

| File | Purpose |
|------|---------|
| `apps/web/lib/billing/stripe.ts` | Stripe client singleton |
| `apps/web/lib/billing/types.ts` | Billing type definitions |
| `apps/web/lib/billing/index.ts` | Barrel exports |
| `apps/web/app/api/webhooks/stripe/route.ts` | Stripe webhook handler |

## Files to Modify

| File | Changes |
|------|---------|
| `apps/web/package.json` | Add stripe package |
| `.env.example` | Add Stripe environment variables |

## Dependencies

### Story Dependencies

- **Story 0.1.1** (Scaffold Turborepo) - Package structure must exist

### Package Dependencies

- `stripe@^20.0.0` - Stripe SDK for Node.js

## Test Strategy

### Unit Tests

1. **Package Verification:**
   - Verify stripe package is installed with version >= 20.0.0

2. **File Structure:**
   - Verify stripe.ts exists
   - Verify types.ts exists
   - Verify webhook route exists

3. **Content Verification:**
   - Verify Stripe client initialization
   - Verify webhook signature verification
   - Verify event type exports

### Build Verification

```bash
pnpm install
pnpm build
pnpm typecheck
```

## Definition of Done

- [x] Stripe package installed (>= 20.0.0)
- [x] Stripe client configured server-side only
- [x] Webhook handler created
- [x] Webhook signature verification implemented
- [x] Event types defined and exported
- [x] Environment variables documented
- [x] `pnpm build` succeeds
- [x] `pnpm typecheck` passes

---

## Code Review

**Date:** 2026-01-26
**Reviewer:** Claude (Automated)
**Verdict:** APPROVED

### Summary

| Severity | Count |
|----------|-------|
| HIGH | 0 |
| MEDIUM | 0 |
| LOW | 2 |
| INFO | 2 |

### Findings

#### LOW-1: Console Logging in Webhook Handlers
- **File:** `apps/web/app/api/webhooks/stripe/route.ts`
- **Issue:** Uses console.log for event logging instead of structured logging
- **Recommendation:** Replace with Langfuse or structured logger when available

#### LOW-2: Placeholder Event Handlers
- **File:** `apps/web/app/api/webhooks/stripe/route.ts`
- **Issue:** Event handlers have TODO comments instead of database updates
- **Recommendation:** Expected for infrastructure story - actual handlers in billing epics

#### INFO-1: Stripe API Version
- **File:** `apps/web/lib/billing/stripe.ts`
- **Issue:** Using API version 2025-12-15.clover (latest)
- **Recommendation:** Monitor for breaking changes in future upgrades

#### INFO-2: Build-Time Env Check Removed
- **File:** `apps/web/lib/billing/stripe.ts`
- **Issue:** Removed production env check to allow builds without secrets
- **Recommendation:** Runtime errors will occur if STRIPE_SECRET_KEY not set

### Files Created

| File | Lines | Purpose |
|------|-------|---------|
| `apps/web/lib/billing/stripe.ts` | 165 | Stripe client and helper functions |
| `apps/web/lib/billing/types.ts` | 186 | Billing type definitions |
| `apps/web/lib/billing/index.ts` | 39 | Barrel exports |
| `apps/web/app/api/webhooks/stripe/route.ts` | 253 | Webhook handler |

### Test Results

- **ATDD Tests:** 23/23 passed
- **TypeScript:** No errors
- **Build:** Successful

---

*Created: 2026-01-26*
*Epic: E0.1 - Project Foundation & Infrastructure Setup*
