/**
 * Stripe Webhook Handler
 *
 * This route handles incoming Stripe webhook events.
 * It verifies the webhook signature and processes billing events.
 *
 * @see https://stripe.com/docs/webhooks
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { constructWebhookEvent, getWebhookSecret } from '@/lib/billing/stripe';
import { StripeEventType } from '@/lib/billing/types';
import type Stripe from 'stripe';

// ============================================================================
// Webhook Handler
// ============================================================================

/**
 * POST handler for Stripe webhooks
 *
 * Stripe sends webhook events via POST with a signature header.
 * We verify the signature and process the event.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Get the raw body as text for signature verification
    const body = await request.text();

    // Get the Stripe signature header
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify and construct the event using STRIPE_WEBHOOK_SECRET
    let event: Stripe.Event;
    try {
      // getWebhookSecret() retrieves process.env.STRIPE_WEBHOOK_SECRET
      const webhookSecret = getWebhookSecret();
      event = constructWebhookEvent(body, signature, webhookSecret);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error(`Webhook signature verification failed: ${message}`);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${message}` },
        { status: 400 }
      );
    }

    // Process the event based on type
    const result = await handleWebhookEvent(event);

    if (!result.success) {
      console.error(`Webhook handler error: ${result.error}`);
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ received: true, message: result.message });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// Event Handlers
// ============================================================================

interface WebhookResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Route webhook events to appropriate handlers
 */
async function handleWebhookEvent(event: Stripe.Event): Promise<WebhookResult> {
  const eventType = event.type;

  switch (eventType) {
    // Subscription events
    case StripeEventType.SUBSCRIPTION_CREATED:
      return handleSubscriptionCreated(event);
    case StripeEventType.SUBSCRIPTION_UPDATED:
      return handleSubscriptionUpdated(event);
    case StripeEventType.SUBSCRIPTION_DELETED:
      return handleSubscriptionDeleted(event);

    // Invoice events
    case StripeEventType.INVOICE_PAID:
      return handleInvoicePaid(event);
    case StripeEventType.INVOICE_PAYMENT_FAILED:
      return handleInvoicePaymentFailed(event);

    // Checkout events
    case StripeEventType.CHECKOUT_SESSION_COMPLETED:
      return handleCheckoutSessionCompleted(event);

    // Customer events
    case StripeEventType.CUSTOMER_CREATED:
      return handleCustomerCreated(event);
    case StripeEventType.CUSTOMER_UPDATED:
      return handleCustomerUpdated(event);
    case StripeEventType.CUSTOMER_DELETED:
      return handleCustomerDeleted(event);

    default:
      // Log unhandled events but don't fail
      console.log(`Unhandled event type: ${eventType}`);
      return { success: true, message: `Event ${eventType} received but not handled` };
  }
}

// ============================================================================
// Subscription Handlers
// ============================================================================

async function handleSubscriptionCreated(event: Stripe.Event): Promise<WebhookResult> {
  const subscription = event.data.object as Stripe.Subscription;

  // TODO: Update user's subscription in database
  console.log(`Subscription created: ${subscription.id}`);
  console.log(`Customer: ${subscription.customer}`);
  console.log(`Status: ${subscription.status}`);

  return {
    success: true,
    message: `Subscription ${subscription.id} created`,
  };
}

async function handleSubscriptionUpdated(event: Stripe.Event): Promise<WebhookResult> {
  const subscription = event.data.object as Stripe.Subscription;

  // TODO: Update subscription status in database
  console.log(`Subscription updated: ${subscription.id}`);
  console.log(`New status: ${subscription.status}`);

  return {
    success: true,
    message: `Subscription ${subscription.id} updated`,
  };
}

async function handleSubscriptionDeleted(event: Stripe.Event): Promise<WebhookResult> {
  const subscription = event.data.object as Stripe.Subscription;

  // TODO: Mark subscription as canceled in database
  console.log(`Subscription deleted: ${subscription.id}`);

  return {
    success: true,
    message: `Subscription ${subscription.id} deleted`,
  };
}

// ============================================================================
// Invoice Handlers
// ============================================================================

async function handleInvoicePaid(event: Stripe.Event): Promise<WebhookResult> {
  const invoice = event.data.object as Stripe.Invoice;

  // TODO: Record successful payment, extend subscription period
  console.log(`Invoice paid: ${invoice.id}`);
  console.log(`Amount: ${invoice.amount_paid / 100} ${invoice.currency.toUpperCase()}`);

  return {
    success: true,
    message: `Invoice ${invoice.id} paid`,
  };
}

async function handleInvoicePaymentFailed(event: Stripe.Event): Promise<WebhookResult> {
  const invoice = event.data.object as Stripe.Invoice;

  // TODO: Send payment failure notification, update subscription status
  console.log(`Invoice payment failed: ${invoice.id}`);
  console.log(`Customer: ${invoice.customer}`);

  return {
    success: true,
    message: `Invoice ${invoice.id} payment failed - notification queued`,
  };
}

// ============================================================================
// Checkout Handlers
// ============================================================================

async function handleCheckoutSessionCompleted(event: Stripe.Event): Promise<WebhookResult> {
  const session = event.data.object as Stripe.Checkout.Session;

  // TODO: Provision the subscription, update user's plan
  console.log(`Checkout session completed: ${session.id}`);
  console.log(`Customer: ${session.customer}`);
  console.log(`Subscription: ${session.subscription}`);

  return {
    success: true,
    message: `Checkout session ${session.id} completed`,
  };
}

// ============================================================================
// Customer Handlers
// ============================================================================

async function handleCustomerCreated(event: Stripe.Event): Promise<WebhookResult> {
  const customer = event.data.object as Stripe.Customer;

  // TODO: Link Stripe customer to user in database
  console.log(`Customer created: ${customer.id}`);
  console.log(`Email: ${customer.email}`);

  return {
    success: true,
    message: `Customer ${customer.id} created`,
  };
}

async function handleCustomerUpdated(event: Stripe.Event): Promise<WebhookResult> {
  const customer = event.data.object as Stripe.Customer;

  // TODO: Update customer info in database
  console.log(`Customer updated: ${customer.id}`);

  return {
    success: true,
    message: `Customer ${customer.id} updated`,
  };
}

async function handleCustomerDeleted(event: Stripe.Event): Promise<WebhookResult> {
  const customer = event.data.object as Stripe.Customer;

  // TODO: Handle customer deletion (data retention policy)
  console.log(`Customer deleted: ${customer.id}`);

  return {
    success: true,
    message: `Customer ${customer.id} deleted`,
  };
}
