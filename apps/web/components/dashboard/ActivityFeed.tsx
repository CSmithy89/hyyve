/**
 * ActivityFeed Component
 *
 * Story: 0-2-9 Implement Dashboard and Project Browser
 * AC1: Activity feed with timeline
 *
 * Displays recent activity with timeline visualization.
 * Matches wireframe design from hyyve_home_dashboard/code.html lines 234-274.
 */

import { cn } from '@/lib/utils';
import type { ActivityItem } from '@/lib/mock-data/dashboard';

export interface ActivityFeedProps {
  /** Activity items to display */
  activities: ActivityItem[];
  /** Additional CSS classes */
  className?: string;
}

const activityStyles = {
  success: {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    border: 'border-card',
  },
  error: {
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    border: 'border-card',
  },
  info: {
    bg: 'bg-primary/20',
    text: 'text-primary',
    border: 'border-card',
  },
  warning: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border-card',
  },
};

export function ActivityFeed({ activities, className }: ActivityFeedProps) {
  return (
    <section className={className}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Activity Feed</h2>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="relative flex flex-col gap-6">
          {/* Timeline Line */}
          <div className="absolute left-[19px] top-2 h-[calc(100%-1rem)] w-0.5 bg-border" />

          {activities.map((activity) => {
            const style = activityStyles[activity.type];

            return (
              <div key={activity.id} className="relative flex items-start gap-4">
                {/* Icon Circle */}
                <div
                  className={cn(
                    'z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4',
                    style.bg,
                    style.text,
                    style.border
                  )}
                >
                  <span className="material-symbols-outlined text-sm font-bold">
                    {activity.icon}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col pt-0.5">
                  <p className="text-sm font-medium text-foreground">
                    {activity.title}
                    {activity.subtitle && (
                      <span className={cn('ml-1', style.text)}>
                        {activity.subtitle.split('•')[0]}
                      </span>
                    )}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {activity.timestamp}
                    {activity.subtitle?.includes('•') && (
                      <span> • {activity.subtitle.split('•')[1]?.trim()}</span>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ActivityFeed;
