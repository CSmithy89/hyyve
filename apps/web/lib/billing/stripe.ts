/**
 * Stripe Client Configuration
 *
 * This module provides the Stripe client for billing operations.
 * It should only be used server-side (never expose secret key to browser).
 *
 * @example
 * ```typescript
 * import { stripe } from '@/lib/billing/stripe';
 *
 * // Create a checkout session
 * const session = await stripe.checkout.sessions.create({
 *   mode: 'subscription',
 *   payment_method_types: ['card'],
 *   line_items: [{ price: 'price_xxx', quantity: 1 }],
 *   success_url: 'https://example.com/success',
 *   cancel_url: 'https://example.com/cancel',
 * });
 * ```
 */

import Stripe from 'stripe';

// ============================================================================
// Environment Validation
// ============================================================================

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// Note: We don't throw at module load time to allow builds without env vars
// The check happens at runtime when the stripe client is actually used

// ============================================================================
// Stripe Client
// ============================================================================

/**
 * Stripe client singleton for server-side operations
 *
 * Note: This client should ONLY be used server-side.
 * Never import this in client components.
 */
export const stripe = new Stripe(STRIPE_SECRET_KEY ?? 'sk_test_placeholder', {
  apiVersion: '2025-12-15.clover',
  typescript: true,
  appInfo: {
    name: 'Hyyve Platform',
    version: '0.0.1',
  },
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Create a Stripe customer for a user
 */
export async function createCustomer(params: {
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Customer> {
  return stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: params.metadata,
  });
}

/**
 * Get or create a Stripe customer by email
 */
export async function getOrCreateCustomer(params: {
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Customer> {
  // Search for existing customer
  const existingCustomers = await stripe.customers.list({
    email: params.email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0]!;
  }

  // Create new customer
  return createCustomer(params);
}

/**
 * Create a checkout session for subscription
 */
export async function createCheckoutSession(params: {
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.create({
    customer: params.customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata,
  });
}

/**
 * Create a billing portal session
 */
export async function createPortalSession(params: {
  customerId: string;
  returnUrl: string;
}): Promise<Stripe.BillingPortal.Session> {
  return stripe.billingPortal.sessions.create({
    customer: params.customerId,
    return_url: params.returnUrl,
  });
}

/**
 * Get subscription by ID
 */
export async function getSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.retrieve(subscriptionId);
}

/**
 * Cancel subscription at period end
 */
export async function cancelSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

/**
 * Resume a canceled subscription
 */
export async function resumeSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}

// ============================================================================
// Webhook Verification
// ============================================================================

/**
 * Verify and construct a Stripe webhook event
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

/**
 * Get the webhook secret from environment
 */
export function getWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
  }
  return secret;
}
