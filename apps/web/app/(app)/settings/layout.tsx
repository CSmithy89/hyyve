/**
 * Settings Layout
 *
 * Story: 0-2-10 Implement Settings Pages
 * AC1: Settings with tabbed navigation
 *
 * Layout with sidebar navigation for settings pages.
 */

import { SettingsSidebar } from '@/components/settings';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="flex h-full">
      <SettingsSidebar />
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="max-w-[1000px] mx-auto px-6 py-8 md:px-12 md:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
