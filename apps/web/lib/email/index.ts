/**
 * Email Module
 *
 * Exports email service and utilities.
 */

export {
  getResendClient,
  resetResendClient,
  getFromEmail,
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendTeamInvitationEmail,
  sendWorkflowCompletionEmail,
  sendBudgetAlertEmail,
  isResendConfigured,
} from './resend';

export type { SendEmailOptions, EmailResult } from './resend';
