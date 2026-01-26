/**
 * Email Templates
 *
 * Exports all React Email templates for the Hyyve platform.
 */

// Verification email
export { VerificationEmail } from './verification';
export type { VerificationEmailProps } from './verification';

// Password reset
export { PasswordResetEmail } from './password-reset';
export type { PasswordResetEmailProps } from './password-reset';

// Team invitation
export { TeamInvitationEmail } from './team-invitation';
export type { TeamInvitationEmailProps } from './team-invitation';

// Workflow completion
export { WorkflowCompletionEmail } from './workflow-completion';
export type { WorkflowCompletionEmailProps } from './workflow-completion';

// Budget alert
export { BudgetAlertEmail } from './budget-alert';
export type { BudgetAlertEmailProps } from './budget-alert';
