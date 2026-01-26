/**
 * Resend Webhook Handler
 *
 * Handles email delivery status events from Resend.
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Resend webhook event types
 */
type ResendEventType =
  | 'email.sent'
  | 'email.delivered'
  | 'email.delivery_delayed'
  | 'email.complained'
  | 'email.bounced'
  | 'email.opened'
  | 'email.clicked';

/**
 * Resend webhook payload
 */
interface ResendWebhookPayload {
  type: ResendEventType;
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    tags?: Array<{ name: string; value: string }>;
    // Additional fields for specific events
    bounce_type?: string;
    complaint_type?: string;
    opened_at?: string;
    clicked_at?: string;
    link?: string;
  };
}

/**
 * Handle email delivery status updates
 */
async function handleDeliveryStatus(
  event: ResendWebhookPayload
): Promise<void> {
  const { type, data } = event;
  const emailId = data.email_id;
  const emailType = data.tags?.find((t) => t.name === 'email_type')?.value;

  switch (type) {
    case 'email.delivered':
      console.warn(`Email ${emailId} delivered successfully`, {
        to: data.to,
        emailType,
      });
      // TODO: Update delivery status in database
      break;

    case 'email.bounced':
      console.warn(`Email ${emailId} bounced`, {
        to: data.to,
        bounceType: data.bounce_type,
        emailType,
      });
      // TODO: Handle bounce - mark email as invalid, notify admin
      break;

    case 'email.complained':
      console.warn(`Email ${emailId} marked as spam`, {
        to: data.to,
        complaintType: data.complaint_type,
        emailType,
      });
      // TODO: Handle complaint - add to suppression list
      break;

    case 'email.delivery_delayed':
      console.warn(`Email ${emailId} delivery delayed`, {
        to: data.to,
        emailType,
      });
      break;

    case 'email.opened':
      console.warn(`Email ${emailId} opened`, {
        to: data.to,
        openedAt: data.opened_at,
        emailType,
      });
      // TODO: Track email opens for analytics
      break;

    case 'email.clicked':
      console.warn(`Email ${emailId} link clicked`, {
        to: data.to,
        link: data.link,
        emailType,
      });
      // TODO: Track link clicks for analytics
      break;

    case 'email.sent':
      console.warn(`Email ${emailId} sent`, {
        to: data.to,
        emailType,
      });
      break;

    default:
      console.warn(`Unknown email event: ${type}`, { emailId });
  }
}

/**
 * Verify webhook signature (optional but recommended)
 */
function verifyWebhookSignature(
  _payload: string,
  _signature: string | null
): boolean {
  // TODO: Implement signature verification using RESEND_WEBHOOK_SECRET
  // const secret = process.env.RESEND_WEBHOOK_SECRET;
  // if (!secret || !signature) return false;
  // Verify HMAC signature
  return true; // Placeholder - implement actual verification
}

/**
 * POST handler for Resend webhooks
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.text();
    const signature = request.headers.get('resend-signature');

    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const payload: ResendWebhookPayload = JSON.parse(body);

    // Handle the delivery status event
    await handleDeliveryStatus(payload);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Resend webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
