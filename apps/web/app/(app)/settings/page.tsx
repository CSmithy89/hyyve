/**
 * Settings Page
 *
 * Story: 0-2-10 Implement Settings Pages
 * AC1: Settings with tabbed navigation
 *
 * Main settings page that renders different sections based on tab param.
 */

'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import {
  ProfileForm,
  SecuritySection,
  ApiKeysSection,
  WorkspaceSection,
} from '@/components/settings';
import { Skeleton } from '@/components/ui/skeleton';

function SettingsContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'profile';

  switch (tab) {
    case 'profile':
      return <ProfileForm />;
    case 'security':
      return <SecuritySection />;
    case 'api-keys':
      return <ApiKeysSection />;
    case 'workspace':
      return <WorkspaceSection />;
    case 'billing':
      return (
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-foreground">
            Billing & Usage
          </h1>
          <p className="text-muted-foreground">
            Billing settings coming soon...
          </p>
        </div>
      );
    default:
      return <ProfileForm />;
  }
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
