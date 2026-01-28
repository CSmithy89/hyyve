/**
 * SettingsSidebar Component
 *
 * Story: 0-2-10 Implement Settings Pages
 * AC1: Settings with tabbed navigation
 *
 * Sidebar navigation for settings pages with active state.
 * Matches wireframe design from user_profile_&_preferences/code.html.
 */

'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { User, Shield, Key, Building2, CreditCard, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const SETTINGS_LINKS = [
  {
    id: 'profile',
    label: 'Profile & Preferences',
    icon: User,
    href: '/settings?tab=profile',
  },
  {
    id: 'security',
    label: 'Account & Security',
    icon: Shield,
    href: '/settings?tab=security',
  },
  {
    id: 'api-keys',
    label: 'API Keys',
    icon: Key,
    href: '/settings?tab=api-keys',
  },
  {
    id: 'workspace',
    label: 'Workspace Settings',
    icon: Building2,
    href: '/settings?tab=workspace',
  },
  {
    id: 'billing',
    label: 'Billing & Usage',
    icon: CreditCard,
    href: '/settings?tab=billing',
  },
];

export function SettingsSidebar() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'profile';

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-background">
      <div className="flex flex-col h-full p-4">
        {/* Navigation Links */}
        <nav className="flex flex-col gap-1">
          <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Settings
          </p>
          {SETTINGS_LINKS.map((link) => {
            const isActive = currentTab === link.id;
            const Icon = link.icon;

            return (
              <Link
                key={link.id}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="mt-auto pt-4 border-t border-border">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full">
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default SettingsSidebar;
