/**
 * MFA Setup Page
 *
 * Story: 1-1-7 MFA Setup - Method Selection
 * Route: /auth/mfa-setup
 * Screen ID: 1.1.5
 * Wireframe: mfa_method_selection
 *
 * This page allows authenticated users to select their preferred
 * MFA method (Authenticator App, SMS, or Email) before proceeding
 * to the method-specific setup flow.
 *
 * Route Protection:
 * - Requires authentication (handled by Clerk middleware)
 * - Redirects unauthenticated users to sign-in
 */

import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { MfaMethodSelection } from '@/components/auth';

/**
 * Page metadata
 */
export const metadata: Metadata = {
  title: 'MFA Setup - Hyyve',
  description: 'Choose your preferred two-factor authentication method',
};

/**
 * MFA Setup Page Component
 *
 * Server component that protects the MFA setup page and renders
 * the MfaMethodSelection client component.
 */
export default async function MfaSetupPage() {
  // Check authentication
  const { userId } = await auth();

  // Redirect to sign-in if not authenticated
  if (!userId) {
    redirect('/sign-in?redirect_url=/auth/mfa-setup');
  }

  return <MfaMethodSelection />;
}
