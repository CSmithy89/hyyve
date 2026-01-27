/**
 * Module Builder Layout
 *
 * Story: 0-2-11 Implement Module Builder UI Shell
 * AC1: Three-panel layout
 *
 * Layout with header and full-height workspace.
 */

import { ModuleBuilderHeader } from '@/components/builders/module';

interface ModuleBuilderLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function ModuleBuilderLayout({
  children,
}: ModuleBuilderLayoutProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background-dark">
      <ModuleBuilderHeader />
      {children}
    </div>
  );
}
