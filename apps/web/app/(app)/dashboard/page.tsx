/**
 * Dashboard Page
 *
 * Story: 0-2-9 Implement Dashboard and Project Browser
 * AC1: Dashboard at /dashboard
 *
 * Main dashboard featuring:
 * - Welcome message with user name
 * - Quick action cards (Module Builder, Chatbot Builder, Voice Agent, Canvas Builder)
 * - Recent projects list
 * - Usage summary widget
 * - Activity feed
 *
 * @see hyyve_home_dashboard/code.html for wireframe reference
 */

// Force dynamic rendering - uses Clerk auth context
export const dynamic = 'force-dynamic';

import { currentUser } from '@clerk/nextjs/server';
import {
  QuickActionCard,
  ProjectCard,
  NewProjectCard,
  UsageWidget,
  ActivityFeed,
} from '@/components/dashboard';
import {
  QUICK_ACTIONS,
  RECENT_PROJECTS,
  ACTIVITIES,
  USAGE_STATS,
} from '@/lib/mock-data/dashboard';

export default async function DashboardPage() {
  // Get current user for personalized welcome message
  const user = await currentUser();
  const firstName = user?.firstName || 'there';

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 pb-10">
        {/* Welcome Heading */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
            Welcome back, {firstName}
          </h1>
          <p className="text-muted-foreground">
            Ready to build the next generation of AI?
          </p>
        </div>

        {/* Quick Action Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map((action) => (
            <QuickActionCard
              key={action.id}
              icon={action.icon}
              title={action.title}
              description={action.description}
              href={action.href}
              color={action.color}
            />
          ))}
        </div>

        {/* Layout: Left (Projects & Activity) / Right (Usage) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Column (2/3 width) */}
          <div className="flex flex-col gap-8 lg:col-span-2">
            {/* Recent Projects */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Recent Projects</h2>
                <a
                  href="/dashboard/projects"
                  className="text-sm font-medium text-primary hover:text-primary/80"
                >
                  View All
                </a>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {RECENT_PROJECTS.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
                <NewProjectCard />
              </div>
            </section>

            {/* Activity Feed */}
            <ActivityFeed activities={ACTIVITIES} />
          </div>

          {/* Right Column (1/3 width) - Usage Stats */}
          <UsageWidget stats={USAGE_STATS} />
        </div>
      </div>
    </div>
  );
}
