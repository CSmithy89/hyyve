/**
 * Resend Email Service
 *
 * Provides transactional email sending via Resend.
 */

import { Resend } from 'resend';
import type { CreateEmailResponse } from 'resend';

/**
 * Email sending options
 */
export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  react?: React.ReactElement;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
  tags?: Array<{
    name: string;
    value: string;
  }>;
}

/**
 * Email send result
 */
export interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Singleton Resend client instance
 */
let clientInstance: Resend | null = null;

/**
 * Get or create the Resend client instance
 */
export function getResendClient(): Resend {
  if (!clientInstance) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      throw new Error(
        'RESEND_API_KEY environment variable is not set. ' +
          'Please set it in your .env.local file.'
      );
    }

    clientInstance = new Resend(apiKey);
  }

  return clientInstance;
}

/**
 * Reset the client instance (for testing)
 */
export function resetResendClient(): void {
  clientInstance = null;
}

/**
 * Get the default from email address
 */
export function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL || 'noreply@hyyve.com';
}

/**
 * Send an email via Resend
 */
export async function sendEmail(
  options: SendEmailOptions
): Promise<EmailResult> {
  const client = getResendClient();
  const from = getFromEmail();

  try {
    const response: CreateEmailResponse = await client.emails.send({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      react: options.react,
      replyTo: options.replyTo,
      cc: options.cc,
      bcc: options.bcc,
      attachments: options.attachments,
      tags: options.tags,
    });

    if (response.error) {
      return {
        success: false,
        error: response.error.message,
      };
    }

    return {
      success: true,
      id: response.data?.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Send verification email
 */
export async function sendVerificationEmail(
  to: string,
  verificationUrl: string,
  userName?: string
): Promise<EmailResult> {
  return sendEmail({
    to,
    subject: 'Verify your Hyyve account',
    html: `
      <h1>Welcome to Hyyve${userName ? `, ${userName}` : ''}!</h1>
      <p>Please verify your email address by clicking the link below:</p>
      <p><a href="${verificationUrl}">Verify Email</a></p>
      <p>This link expires in 24 hours.</p>
      <p>If you didn't create a Hyyve account, you can safely ignore this email.</p>
    `,
    tags: [{ name: 'email_type', value: 'verification' }],
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
  userName?: string
): Promise<EmailResult> {
  return sendEmail({
    to,
    subject: 'Reset your Hyyve password',
    html: `
      <h1>Password Reset Request</h1>
      <p>Hi${userName ? ` ${userName}` : ''},</p>
      <p>We received a request to reset your password. Click the link below to set a new password:</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
    `,
    tags: [{ name: 'email_type', value: 'password_reset' }],
  });
}

/**
 * Send team invitation email
 */
export async function sendTeamInvitationEmail(
  to: string,
  inviteUrl: string,
  teamName: string,
  inviterName: string
): Promise<EmailResult> {
  return sendEmail({
    to,
    subject: `You've been invited to join ${teamName} on Hyyve`,
    html: `
      <h1>Team Invitation</h1>
      <p>${inviterName} has invited you to join <strong>${teamName}</strong> on Hyyve.</p>
      <p>Click the link below to accept the invitation:</p>
      <p><a href="${inviteUrl}">Join Team</a></p>
      <p>This invitation expires in 7 days.</p>
    `,
    tags: [{ name: 'email_type', value: 'team_invitation' }],
  });
}

/**
 * Send workflow completion notification
 */
export async function sendWorkflowCompletionEmail(
  to: string,
  workflowName: string,
  status: 'success' | 'failed',
  detailsUrl: string
): Promise<EmailResult> {
  const statusEmoji = status === 'success' ? '✅' : '❌';
  const statusText = status === 'success' ? 'completed successfully' : 'failed';

  return sendEmail({
    to,
    subject: `${statusEmoji} Workflow "${workflowName}" ${statusText}`,
    html: `
      <h1>Workflow ${status === 'success' ? 'Completed' : 'Failed'}</h1>
      <p>Your workflow <strong>${workflowName}</strong> has ${statusText}.</p>
      <p><a href="${detailsUrl}">View Details</a></p>
    `,
    tags: [
      { name: 'email_type', value: 'workflow_completion' },
      { name: 'workflow_status', value: status },
    ],
  });
}

/**
 * Send budget alert notification
 */
export async function sendBudgetAlertEmail(
  to: string,
  percentage: number,
  currentUsage: number,
  budgetLimit: number,
  dashboardUrl: string
): Promise<EmailResult> {
  const isWarning = percentage < 100;
  const subject = isWarning
    ? `⚠️ Budget Alert: ${percentage}% of your limit reached`
    : `🚨 Budget Exceeded: ${percentage}% of your limit`;

  return sendEmail({
    to,
    subject,
    html: `
      <h1>Budget Alert</h1>
      <p>You have used <strong>${percentage}%</strong> of your budget.</p>
      <p>Current usage: $${currentUsage.toFixed(2)} / $${budgetLimit.toFixed(2)}</p>
      <p><a href="${dashboardUrl}">View Usage Dashboard</a></p>
      ${isWarning ? '<p>Consider upgrading your plan or reviewing your usage to avoid interruptions.</p>' : '<p>Your services may be affected. Please review your usage immediately.</p>'}
    `,
    tags: [
      { name: 'email_type', value: 'budget_alert' },
      { name: 'alert_percentage', value: String(percentage) },
    ],
  });
}

/**
 * Check if Resend is configured
 */
export function isResendConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}
