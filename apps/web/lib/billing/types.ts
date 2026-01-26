/**
 * Stripe Billing Type Definitions
 *
 * This module defines types for Stripe webhook events and billing operations.
 * These types provide type safety when handling Stripe events.
 */

import type Stripe from 'stripe';

// ============================================================================
// Webhook Event Types
// ============================================================================

/**
 * Stripe webhook event types we handle
 */
export const StripeEventType = {
  // Subscription lifecycle events
  SUBSCRIPTION_CREATED: 'customer.subscription.created',
  SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
  SUBSCRIPTION_PAUSED: 'customer.subscription.paused',
  SUBSCRIPTION_RESUMED: 'customer.subscription.resumed',
  SUBSCRIPTION_TRIAL_WILL_END: 'customer.subscription.trial_will_end',

  // Invoice events
  INVOICE_PAID: 'invoice.paid',
  INVOICE_PAYMENT_FAILED: 'invoice.payment_failed',
  INVOICE_PAYMENT_ACTION_REQUIRED: 'invoice.payment_action_required',
  INVOICE_UPCOMING: 'invoice.upcoming',
  INVOICE_CREATED: 'invoice.created',
  INVOICE_FINALIZED: 'invoice.finalized',

  // Customer events
  CUSTOMER_CREATED: 'customer.created',
  CUSTOMER_UPDATED: 'customer.updated',
  CUSTOMER_DELETED: 'customer.deleted',

  // Checkout events
  CHECKOUT_SESSION_COMPLETED: 'checkout.session.completed',
  CHECKOUT_SESSION_EXPIRED: 'checkout.session.expired',
  CHECKOUT_SESSION_ASYNC_PAYMENT_SUCCEEDED: 'checkout.session.async_payment_succeeded',
  CHECKOUT_SESSION_ASYNC_PAYMENT_FAILED: 'checkout.session.async_payment_failed',

  // Payment intent events
  PAYMENT_INTENT_SUCCEEDED: 'payment_intent.succeeded',
  PAYMENT_INTENT_PAYMENT_FAILED: 'payment_intent.payment_failed',
  PAYMENT_INTENT_CANCELED: 'payment_intent.canceled',

  // Payment method events
  PAYMENT_METHOD_ATTACHED: 'payment_method.attached',
  PAYMENT_METHOD_DETACHED: 'payment_method.detached',

  // Billing meter events (for usage-based billing)
  BILLING_METER_USAGE_REPORTED: 'billing.meter.usage_reported',
} as const;

export type StripeEventTypeValue = (typeof StripeEventType)[keyof typeof StripeEventType];

// ============================================================================
// Event Data Types
// ============================================================================

/**
 * Subscription event data
 */
export interface SubscriptionEventData {
  subscription: Stripe.Subscription;
  previousAttributes?: Partial<Stripe.Subscription>;
}

/**
 * Invoice event data
 */
export interface InvoiceEventData {
  invoice: Stripe.Invoice;
}

/**
 * Customer event data
 */
export interface CustomerEventData {
  customer: Stripe.Customer;
  previousAttributes?: Partial<Stripe.Customer>;
}

/**
 * Checkout session event data
 */
export interface CheckoutSessionEventData {
  session: Stripe.Checkout.Session;
}

/**
 * Payment intent event data
 */
export interface PaymentIntentEventData {
  paymentIntent: Stripe.PaymentIntent;
}

// ============================================================================
// Webhook Handler Types
// ============================================================================

/**
 * Result of processing a webhook event
 */
export interface WebhookHandlerResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Webhook event handler function type
 */
export type WebhookEventHandler<T = unknown> = (
  event: Stripe.Event,
  data: T
) => Promise<WebhookHandlerResult>;

// ============================================================================
// Subscription Status Types
// ============================================================================

/**
 * Subscription status enum matching Stripe's statuses
 */
export const SubscriptionStatus = {
  ACTIVE: 'active',
  CANCELED: 'canceled',
  INCOMPLETE: 'incomplete',
  INCOMPLETE_EXPIRED: 'incomplete_expired',
  PAST_DUE: 'past_due',
  PAUSED: 'paused',
  TRIALING: 'trialing',
  UNPAID: 'unpaid',
} as const;

export type SubscriptionStatusValue =
  (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

// ============================================================================
// Billing Plan Types
// ============================================================================

/**
 * Billing plan tiers
 */
export const BillingPlan = {
  FREE: 'free',
  STARTER: 'starter',
  PRO: 'pro',
  ENTERPRISE: 'enterprise',
} as const;

export type BillingPlanValue = (typeof BillingPlan)[keyof typeof BillingPlan];

/**
 * Billing plan configuration
 */
export interface BillingPlanConfig {
  id: BillingPlanValue;
  name: string;
  description: string;
  priceId?: string; // Stripe Price ID
  monthlyPrice: number;
  annualPrice?: number;
  features: string[];
  limits: {
    agents?: number;
    workflows?: number;
    executions?: number;
    storage?: number; // in GB
    teamMembers?: number;
  };
}

// ============================================================================
// Usage Tracking Types
// ============================================================================

/**
 * Usage metric types for billing meters
 */
export const UsageMetric = {
  LLM_TOKENS: 'llm_tokens',
  AGENT_EXECUTIONS: 'agent_executions',
  STORAGE_GB: 'storage_gb',
  API_CALLS: 'api_calls',
} as const;

export type UsageMetricValue = (typeof UsageMetric)[keyof typeof UsageMetric];

/**
 * Usage record for billing
 */
export interface UsageRecord {
  metric: UsageMetricValue;
  quantity: number;
  timestamp: Date;
  metadata?: Record<string, string>;
}

// ============================================================================
// Customer Types
// ============================================================================

/**
 * Customer billing info stored in our database
 */
export interface CustomerBillingInfo {
  userId: string;
  stripeCustomerId: string;
  subscriptionId?: string;
  subscriptionStatus?: SubscriptionStatusValue;
  plan: BillingPlanValue;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
}
