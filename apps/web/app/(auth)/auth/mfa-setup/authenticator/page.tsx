/**
 * TOTP Authenticator Setup Page
 *
 * Story: 1-1-8 MFA Setup - TOTP Authenticator
 * Route: /auth/mfa-setup/authenticator
 * Wireframe: mfa_authenticator_setup
 *
 * Server component that renders the TotpSetupForm client component.
 * Protected route - requires authentication.
 */

import type { Metadata } from 'next';
import { TotpSetupForm } from '@/components/auth/totp-setup-form';

export const metadata: Metadata = {
  title: 'Setup Authenticator App - Hyyve',
  description: 'Configure two-factor authentication with your authenticator app',
};

export default function TotpAuthenticatorSetupPage() {
  return <TotpSetupForm />;
}
