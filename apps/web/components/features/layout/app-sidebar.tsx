'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  FolderOpen,
  Settings,
  BookOpen,
  ChevronDown,
  Blocks,
  Bot,
  Mic,
  Palette,
  Database,
  Store,
  BarChart3,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const mainNav: NavItem[] = [
  { label: 'Home', href: '/workspace', icon: Home },
  { label: 'Projects', href: '/workspace/projects', icon: FolderOpen },
];

const builderNav: NavItem[] = [
  { label: 'Module Builder', href: '/builders/module', icon: Blocks },
  { label: 'Chatbot Builder', href: '/builders/chatbot', icon: Bot },
  { label: 'Voice Builder', href: '/builders/voice', icon: Mic },
  { label: 'Canvas Builder', href: '/builders/canvas', icon: Palette },
];

const resourceNav: NavItem[] = [
  { label: 'Knowledge Base', href: '/knowledge', icon: Database },
  { label: 'Marketplace', href: '/marketplace', icon: Store },
  { label: 'Observability', href: '/observability', icon: BarChart3 },
];

const bottomNav: NavItem[] = [
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Documentation', href: '/docs', icon: BookOpen },
];

interface AppSidebarProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    plan?: string;
  };
  collapsed?: boolean;
}

export function AppSidebar({ user, collapsed = false }: AppSidebarProps) {
  const pathname = usePathname();

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
    const Icon = item.icon;

    return (
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors group',
          isActive
            ? 'bg-muted text-foreground'
            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
        )}
      >
        <Icon className={cn('h-5 w-5', isActive ? 'text-primary' : 'group-hover:text-primary')} />
        {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
        {item.badge && !collapsed && (
          <span className="ml-auto rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  const NavSection = ({ title, items }: { title?: string; items: NavItem[] }) => (
    <div className="flex flex-col gap-1">
      {title && !collapsed && (
        <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
      )}
      {items.map((item) => (
        <NavLink key={item.href} item={item} />
      ))}
    </div>
  );

  return (
    <aside
      className={cn(
        'hidden flex-col justify-between border-r border-border bg-background p-4 md:flex',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex flex-col gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
            <Blocks className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <h1 className="text-lg font-bold leading-none tracking-tight">Hyyve</h1>
              <p className="text-xs font-medium text-muted-foreground">AI Platform</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4">
          <NavSection items={mainNav} />
          <NavSection title="Builders" items={builderNav} />
          <NavSection title="Resources" items={resourceNav} />
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-4">
        <NavSection items={bottomNav} />

        {/* User Profile */}
        {user && (
          <div
            className={cn(
              'flex items-center gap-3 rounded-lg border border-border bg-card p-3',
              collapsed && 'justify-center p-2'
            )}
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <>
                <div className="flex flex-1 flex-col overflow-hidden">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.plan || 'Free Plan'}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
