import type { Metadata } from 'next';
import { BuilderLayout } from '@/components/layouts';

/**
 * Builders Route Group Layout
 *
 * Story: 0-2-3 Create Layout Shells
 * AC4.4: (app)/builders/layout.tsx uses BuilderLayout
 *
 * This layout wraps all builder pages (Module Builder, Chatbot Builder, Voice Builder, Canvas Builder)
 * with the three-panel layout featuring left sidebar, center canvas, and right chat panel.
 */
export const metadata: Metadata = {
  title: 'Builder - Hyyve',
  description: 'Hyyve AI Platform Builder',
};

interface BuildersRouteLayoutProps {
  children: React.ReactNode;
}

export default function BuildersRouteLayout({
  children,
}: BuildersRouteLayoutProps) {
  return (
    <BuilderLayout
      headerActions={
        <div className="flex items-center gap-3">
          {/* Placeholder for header actions - will be populated by page-specific components */}
        </div>
      }
    >
      {children}
    </BuilderLayout>
  );
}
