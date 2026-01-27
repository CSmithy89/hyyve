/**
 * Sign-In Page
 *
 * Story: 0-2-8 Implement Auth Pages (Clerk UI)
 * AC1: Sign-in page at /sign-in
 *
 * Features:
 * - Clerk SignIn component with custom appearance
 * - Social OAuth providers (Google, SSO)
 * - Responsive layout via AuthLayout
 * - Dark theme matching Hyyve design tokens
 *
 * @see hyyve_login_page/code.html for wireframe
 */

import { SignIn } from '@clerk/nextjs';
import { clerkAppearance } from '@/lib/clerk-appearance';

/**
 * SignInPage Component
 *
 * Renders Clerk's SignIn component with Hyyve styling.
 * The AuthLayout wrapper is provided by the parent (auth) layout.
 */
export default function SignInPage() {
  return (
    <SignIn
      appearance={clerkAppearance}
      routing="path"
      path="/sign-in"
      signUpUrl="/sign-up"
      fallbackRedirectUrl="/dashboard"
    />
  );
}
