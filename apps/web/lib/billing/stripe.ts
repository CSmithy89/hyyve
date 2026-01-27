/**
 * Stripe Client Configuration
 *
 * This module provides the Stripe client for billing operations.
 * It should only be used server-side (never expose secret key to browser).
 *
 * Uses lazy instantiation to avoid issues with missing env vars at import time.
 *
 * NOTE: This module is server-only and will throw a build error
 * if imported in a client component.
 *
 * @example
 * ```typescript
 * import { getStripeClient } from '@/lib/billing/stripe';
 *
 * // Create a checkout session
 * const stripe = getStripeClient();
 * const session = await stripe.checkout.sessions.create({
 *   mode: 'subscription',
 *   payment_method_types: ['card'],
 *   line_items: [{ price: 'price_xxx', quantity: 1 }],
 *   success_url: 'https://example.com/success',
 *   cancel_url: 'https://example.com/cancel',
 * });
 * ```
 */

import 'server-only';
import Stripe from 'stripe';

// ============================================================================
// Stripe Client (Lazy Instantiation)
// ============================================================================

/**
 * Stripe client singleton for server-side operations.
 * Uses lazy instantiation to avoid issues with missing env vars at import time.
 *
 * Note: This client should ONLY be used server-side.
 * Never import this in client components.
 */
let stripeInstance: Stripe | null = null;

/**
 * Get the Stripe client singleton.
 * Throws if STRIPE_SECRET_KEY is not configured.
 */
export function getStripeClient(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      throw new Error(
        'STRIPE_SECRET_KEY is not configured. ' +
          'Please set it in your environment variables.'
      );
    }

    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
      appInfo: {
        name: 'Hyyve Platform',
        version: '0.0.1',
      },
    });
  }

  return stripeInstance;
}

/**
 * Legacy export for backwards compatibility.
 * @deprecated Use getStripeClient() instead for lazy initialization.
 */
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return Reflect.get(getStripeClient(), prop);
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
  return getStripeClient().customers.create({
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
  const existingCustomers = await getStripeClient().customers.list({
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
  return getStripeClient().checkout.sessions.create({
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
  return getStripeClient().billingPortal.sessions.create({
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
  return getStripeClient().subscriptions.retrieve(subscriptionId);
}

/**
 * Cancel subscription at period end
 */
export async function cancelSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return getStripeClient().subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

/**
 * Resume a canceled subscription
 */
export async function resumeSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return getStripeClient().subscriptions.update(subscriptionId, {
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
  return getStripeClient().webhooks.constructEvent(payload, signature, webhookSecret);
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
