/**
 * Sign-Up Page
 *
 * Story: 0-2-8 Implement Auth Pages (Clerk UI)
 * AC2: Sign-up page at /sign-up
 *
 * Features:
 * - Clerk SignUp component with custom appearance
 * - Social OAuth providers (Google, SSO)
 * - Responsive layout via AuthLayout
 * - Dark theme matching Hyyve design tokens
 *
 * @see hyyve_registration_-_step_1/code.html for wireframe
 */

import { SignUp } from '@clerk/nextjs';
import { clerkAppearance } from '@/lib/clerk-appearance';

/**
 * SignUpPage Component
 *
 * Renders Clerk's SignUp component with Hyyve styling.
 * The AuthLayout wrapper is provided by the parent (auth) layout.
 */
export default function SignUpPage() {
  return (
    <SignUp
      appearance={clerkAppearance}
      routing="path"
      path="/sign-up"
      signInUrl="/sign-in"
      fallbackRedirectUrl="/dashboard"
    />
  );
}
