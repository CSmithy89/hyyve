# Story 0.1.21: Configure Resend Email Service

## Story

As a **developer**,
I want **Resend configured for transactional emails**,
So that **the platform can send verification, notification, and system emails**.

## Acceptance Criteria

- **Given** the API layer is configured
- **When** I configure Resend
- **Then** `resend` package is installed
- **And** Email service is created at `lib/email/resend.ts`
- **And** Email templates are configured for:
  - Email verification
  - Password reset
  - Team invitation
  - Workflow completion notification
  - Budget alert notification
- **And** React Email templates are set up in `packages/@platform/email-templates/`
- **And** Webhook handler for delivery status at `app/api/webhooks/resend/route.ts`

## Technical Notes

- Resend provides reliable transactional email
- Use React Email for template components
- Track delivery status via webhooks

## Environment Variables

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` (e.g., noreply@hyyve.com)

## Creates

- lib/email/resend.ts
- packages/@platform/email-templates/
- app/api/webhooks/resend/route.ts

## Implementation Tasks

1. Install `resend` package in apps/web
2. Create email service at lib/email/resend.ts
3. Create @platform/email-templates package
4. Create React Email templates for each email type
5. Create Resend webhook handler route
6. Add environment variables to .env.example
