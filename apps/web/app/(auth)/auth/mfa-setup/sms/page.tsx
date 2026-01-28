/**
 * SMS MFA Setup Page
 *
 * Story: 1-1-10 MFA SMS Verification
 * Route: /auth/mfa-setup/sms
 *
 * Server component that renders the SmsMfaSetupForm client component.
 * Protected route - requires authentication.
 */

import type { Metadata } from 'next';
import { SmsMfaSetupForm } from '@/components/auth/sms-mfa-setup-form';

export const metadata: Metadata = {
  title: 'Setup SMS Verification - Hyyve',
  description: 'Configure two-factor authentication with SMS verification codes',
};

export default function SmsMfaSetupPage() {
  return <SmsMfaSetupForm />;
}
