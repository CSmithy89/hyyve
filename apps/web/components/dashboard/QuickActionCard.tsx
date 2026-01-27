/**
 * QuickActionCard Component
 *
 * Story: 0-2-9 Implement Dashboard and Project Browser
 * AC1: Quick action cards (Module Builder, Chatbot Builder, Voice Agent, Canvas Builder)
 *
 * Displays a clickable card for quick access to builder tools.
 * Matches wireframe design from hyyve_home_dashboard/code.html lines 132-172.
 */

import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface QuickActionCardProps {
  /** Material Symbols icon name */
  icon: string;
  /** Card title */
  title: string;
  /** Card description */
  description: string;
  /** Navigation target */
  href: string;
  /** Color variant for the icon background */
  color?: 'primary' | 'blue' | 'purple' | 'emerald';
  /** Additional CSS classes */
  className?: string;
}

const colorVariants = {
  primary: {
    bg: 'bg-primary/20',
    text: 'text-primary',
    hoverBg: 'group-hover:bg-primary',
    hoverText: 'group-hover:text-white',
  },
  blue: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    hoverBg: 'group-hover:bg-blue-500',
    hoverText: 'group-hover:text-white',
  },
  purple: {
    bg: 'bg-purple-500/20',
    text: 'text-purple-400',
    hoverBg: 'group-hover:bg-purple-500',
    hoverText: 'group-hover:text-white',
  },
  emerald: {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    hoverBg: 'group-hover:bg-emerald-500',
    hoverText: 'group-hover:text-white',
  },
};

export function QuickActionCard({
  icon,
  title,
  description,
  href,
  color = 'primary',
  className,
}: QuickActionCardProps) {
  const colorClasses = colorVariants[color];

  return (
    <Link
      href={href}
      className={cn(
        'group flex cursor-pointer flex-col gap-4 rounded-xl border border-border bg-card p-5',
        'transition-all hover:border-primary/50 hover:bg-muted/50',
        className
      )}
    >
      {/* Icon Container */}
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-lg transition-colors',
          colorClasses.bg,
          colorClasses.text,
          colorClasses.hoverBg,
          colorClasses.hoverText
        )}
      >
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>

      {/* Content */}
      <div>
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}

export default QuickActionCard;
