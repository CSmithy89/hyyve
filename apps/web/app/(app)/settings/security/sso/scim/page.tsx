/**
 * SCIM User Provisioning Settings Page
 *
 * Story: 1-1-14 SCIM User Provisioning
 * Route: /settings/security/sso/scim
 * Wireframe: team_&_permissions_management, org_hierarchy_manager
 *
 * Features:
 * - SCIM configuration panel with enable/disable toggle
 * - SCIM endpoint URL display
 * - Bearer token management
 * - Provisioned users list with sync status
 *
 * AC1: Access SCIM settings from SSO configuration
 * AC2-AC6: SCIM configuration and user management features
 * AC7: Accessibility requirements
 * AC8: Responsive design
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { ScimConfigPanel, ScimUsersList, type ScimUser } from '@/components/auth';

/**
 * Mock SCIM users data for development
 * In production, this would come from the API
 */
const mockScimUsers: ScimUser[] = [
  {
    id: 'user_1',
    name: 'Alex Chen',
    email: 'alex.chen@acme-corp.com',
    status: 'active',
    lastSynced: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 min ago
  },
  {
    id: 'user_2',
    name: 'Sarah Smith',
    email: 'sarah.smith@acme-corp.com',
    status: 'active',
    lastSynced: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
  },
  {
    id: 'user_3',
    name: 'Jordan Lee',
    email: 'jordan.lee@acme-corp.com',
    status: 'suspended',
    lastSynced: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
  },
  {
    id: 'user_4',
    name: 'David Miller',
    email: 'david.miller@acme-corp.com',
    status: 'pending',
    lastSynced: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
];

/**
 * SCIM Settings Page Component
 */
export default function ScimSettingsPage() {
  // State
  const [scimEnabled, setScimEnabled] = React.useState(true);
  const [users, setUsers] = React.useState<ScimUser[]>(mockScimUsers);

  // Mock SCIM configuration
  const scimEndpoint = 'https://api.hyyve.com/scim/v2';
  const bearerToken = 'hv_scim_live_sk_abc123xyz789def456ghi012jkl345mno';

  /**
   * Handle SCIM toggle
   */
  const handleToggle = (enabled: boolean) => {
    setScimEnabled(enabled);
    // In production: API call to update SCIM status
  };

  /**
   * Handle token regeneration
   */
  const handleRegenerateToken = async () => {
    // In production: API call to regenerate token
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { token: 'hv_scim_live_sk_new123token456here789abc' };
  };

  /**
   * Handle user resync
   */
  const handleResync = async (userId: string) => {
    // In production: API call to resync user
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Update last synced time for the user
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, lastSynced: new Date().toISOString() }
          : user
      )
    );

    return { success: true };
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-dark font-display text-white">
      {/* Main Content */}
      <main className="flex flex-1 justify-center py-8">
        <div className="flex w-full max-w-[960px] flex-col px-4 md:px-6">
          {/* Page Heading */}
          <div className="mb-6 flex flex-wrap justify-between gap-3">
            <div className="flex min-w-72 flex-col gap-1">
              <h1 className="text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
                SCIM User Provisioning
              </h1>
              <p className="text-base font-normal leading-normal text-text-secondary">
                Automatically sync users from your identity provider using SCIM 2.0.
              </p>
            </div>
          </div>

          {/* Breadcrumbs */}
          <nav
            className="mb-8 flex flex-wrap items-center gap-2 text-sm"
            aria-label="Breadcrumb"
          >
            <Link
              href="/settings"
              className="text-text-secondary transition-colors hover:text-white"
            >
              Settings
            </Link>
            <span className="text-border-dark">/</span>
            <Link
              href="/settings/security"
              className="text-text-secondary transition-colors hover:text-white"
            >
              Security
            </Link>
            <span className="text-border-dark">/</span>
            <Link
              href="/settings/security/sso"
              className="text-text-secondary transition-colors hover:text-white"
            >
              SSO
            </Link>
            <span className="text-border-dark">/</span>
            <span className="text-white" aria-current="page">
              SCIM
            </span>
          </nav>

          {/* Back Link */}
          <Link
            href="/settings/security/sso"
            className="mb-6 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-white"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to SSO Settings
          </Link>

          {/* SCIM Configuration Panel */}
          <ScimConfigPanel
            enabled={scimEnabled}
            scimEndpoint={scimEndpoint}
            bearerToken={bearerToken}
            onToggle={handleToggle}
            onRegenerateToken={handleRegenerateToken}
            className="mb-10"
          />

          {/* Provisioned Users Section */}
          <ScimUsersList
            users={scimEnabled ? users : []}
            onResync={handleResync}
            className="mb-10"
          />

          {/* Info Box */}
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-6">
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-blue-400">info</span>
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-semibold text-white">
                  About SCIM Provisioning
                </h3>
                <p className="text-sm text-text-secondary">
                  SCIM (System for Cross-domain Identity Management) enables automatic
                  user provisioning from your identity provider to Hyyve. When users
                  are added, updated, or removed in your IdP, those changes sync
                  automatically.
                </p>
                <ul className="mt-2 flex flex-col gap-1 text-sm text-text-secondary">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-primary">
                      check_circle
                    </span>
                    Automatic user creation and deactivation
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-primary">
                      check_circle
                    </span>
                    Profile attribute synchronization
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-primary">
                      check_circle
                    </span>
                    Group membership sync (coming soon)
                  </li>
                </ul>
                <div className="mt-3 flex gap-3">
                  <a
                    href="https://docs.hyyve.com/enterprise/scim"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    View Documentation
                    <span className="material-symbols-outlined text-sm">
                      open_in_new
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Context */}
          <div className="mt-10 flex items-center justify-center border-t border-[#272546] p-8">
            <p className="max-w-lg text-center text-xs text-slate-400">
              SCIM provisioning requires an enterprise plan. Contact{' '}
              <a
                href="mailto:sales@hyyve.com"
                className="text-primary hover:underline"
              >
                sales@hyyve.com
              </a>{' '}
              to upgrade your organization.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
