import type { Metadata } from 'next';
import { AuthLayout } from '@/components/layouts';

/**
 * Auth Route Group Layout
 *
 * Story: 0-2-3 Create Layout Shells
 * AC4.2: (auth)/layout.tsx uses AuthLayout
 *
 * This layout wraps all authentication pages (sign-in, sign-up, password reset)
 * with the centered card layout from AuthLayout.
 */
export const metadata: Metadata = {
  title: 'Authentication - Hyyve',
  description: 'Sign in or create an account to access Hyyve AI Platform',
};

interface AuthRouteLayoutProps {
  children: React.ReactNode;
}

export default function AuthRouteLayout({ children }: AuthRouteLayoutProps) {
  return (
    <AuthLayout
      footer={
        <p className="text-xs text-muted-foreground">
          Need help?{' '}
          <a
            href="/support"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Contact support
          </a>
        </p>
      }
    >
      {children}
    </AuthLayout>
  );
}
