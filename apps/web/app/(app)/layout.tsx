import type { Metadata } from 'next';
import { AppShell } from '@/components/layouts';

/**
 * App Route Group Layout
 *
 * Story: 0-2-3 Create Layout Shells
 * AC4.3: (app)/layout.tsx uses AppShell
 *
 * This layout wraps all authenticated application pages (dashboard, settings, projects)
 * with the main app shell featuring header and sidebar navigation.
 */
export const metadata: Metadata = {
  title: 'Dashboard - Hyyve',
  description: 'Hyyve AI Platform Dashboard',
};

interface AppRouteLayoutProps {
  children: React.ReactNode;
}

export default function AppRouteLayout({ children }: AppRouteLayoutProps) {
  return (
    <AppShell
      headerRight={
        <div className="flex items-center gap-4">
          {/* Placeholder for header actions - will be populated by page-specific components */}
        </div>
      }
    >
      {children}
    </AppShell>
  );
}
