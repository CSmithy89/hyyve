/**
 * Billing Module Exports
 *
 * This module exports all billing-related utilities and types.
 */

// Stripe client and helpers
export {
  stripe,
  createCustomer,
  getOrCreateCustomer,
  createCheckoutSession,
  createPortalSession,
  getSubscription,
  cancelSubscription,
  resumeSubscription,
  constructWebhookEvent,
  getWebhookSecret,
} from './stripe';

// Types
export {
  StripeEventType,
  SubscriptionStatus,
  BillingPlan,
  UsageMetric,
} from './types';

export type {
  StripeEventTypeValue,
  SubscriptionEventData,
  InvoiceEventData,
  CustomerEventData,
  CheckoutSessionEventData,
  PaymentIntentEventData,
  WebhookHandlerResult,
  WebhookEventHandler,
  SubscriptionStatusValue,
  BillingPlanValue,
  BillingPlanConfig,
  UsageMetricValue,
  UsageRecord,
  CustomerBillingInfo,
} from './types';
