/**
 * SCIM Users List Component
 *
 * Story: 1-1-14 SCIM User Provisioning
 * Wireframe: team_&_permissions_management
 *
 * Features:
 * - List of SCIM-provisioned users
 * - User status badges (active/suspended/pending)
 * - Last synced timestamp
 * - Manual resync button per user
 *
 * Design tokens: bg-background-dark (#131221), border-[#383663], text-[#9795c6]
 */

'use client';

import * as React from 'react';

/**
 * SCIM User type
 */
export interface ScimUser {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'suspended' | 'pending';
  lastSynced: string;
  avatar?: string;
}

/**
 * ScimUsersList Props
 */
export interface ScimUsersListProps {
  /** List of SCIM-provisioned users */
  users: ScimUser[];
  /** Callback when resync is requested for a user */
  onResync?: (userId: string) => Promise<{ success: boolean }>;
  /** Additional class names */
  className?: string;
}

/**
 * Format relative time from ISO date string
 */
function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: diffDays > 365 ? 'numeric' : undefined,
  });
}

/**
 * Get status badge styling based on user status
 */
function getStatusBadgeClass(status: ScimUser['status']): string {
  switch (status) {
    case 'active':
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    case 'suspended':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    case 'pending':
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
}

/**
 * SCIM Users List Component
 *
 * Displays a list of users provisioned via SCIM with their sync status.
 */
export function ScimUsersList({
  users,
  onResync,
  className = '',
}: ScimUsersListProps) {
  const [syncingUsers, setSyncingUsers] = React.useState<Set<string>>(new Set());
  const [syncSuccess, setSyncSuccess] = React.useState<string | null>(null);

  /**
   * Handle resync for a user
   */
  const handleResync = async (userId: string) => {
    setSyncingUsers((prev) => new Set(prev).add(userId));
    try {
      await onResync?.(userId);
      setSyncSuccess(userId);
      setTimeout(() => setSyncSuccess(null), 2000);
    } catch (err) {
      console.error('Failed to resync user:', err);
    } finally {
      setSyncingUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  return (
    <div
      data-testid="scim-users-section"
      className={`flex flex-col gap-4 ${className}`}
    >
      {/* Section Heading */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">group</span>
          <h3 className="text-lg font-bold text-white">Provisioned Users</h3>
        </div>
        <span className="text-sm text-[#9795c6]">
          {users.length} {users.length === 1 ? 'user' : 'users'} synced
        </span>
      </div>

      {/* Success Message */}
      {syncSuccess && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-emerald-400 text-sm">
          User synced successfully
        </div>
      )}

      {/* Empty State */}
      {users.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#383663] bg-[#131221] px-6 py-12 text-center">
          <div className="mb-4 rounded-full bg-[#272546] p-4 text-[#9795c6]">
            <span className="material-symbols-outlined text-3xl">group_off</span>
          </div>
          <h4 className="mb-2 text-lg font-semibold text-white">
            No Users Provisioned
          </h4>
          <p className="max-w-sm text-sm text-[#9795c6]">
            Users will appear here once your identity provider syncs them via SCIM.
            Enable SCIM and configure your IdP to get started.
          </p>
        </div>
      )}

      {/* Users Table */}
      {users.length > 0 && (
        <div
          data-testid="scim-users-table-container"
          className="overflow-x-auto rounded-xl border border-[#383663]"
        >
          <table
            data-testid="scim-users-table"
            className="w-full min-w-[600px] border-collapse text-left"
          >
            <thead>
              <tr className="border-b border-[#383663] bg-[#1e1c36]">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#9795c6]">
                  Member
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#9795c6]">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#9795c6]">
                  Last Synced
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[#9795c6]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#383663] bg-[#131221]">
              {users.map((user) => (
                <tr
                  key={user.id}
                  data-testid="scim-user-row"
                  data-email={user.email}
                  className="transition-colors hover:bg-white/5"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <div
                          className="h-9 w-9 rounded-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${user.avatar})` }}
                          aria-hidden="true"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary">
                          <span className="text-sm font-bold">
                            {user.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 2)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p
                          data-testid="user-name"
                          className="text-sm font-semibold text-white"
                        >
                          {user.name}
                        </p>
                        <p
                          data-testid="user-email"
                          className="text-xs text-[#9795c6]"
                        >
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      data-testid="user-status-badge"
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${getStatusBadgeClass(
                        user.status
                      )}`}
                    >
                      {user.status === 'active' && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      )}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      data-testid="last-synced"
                      className="text-sm text-[#9795c6]"
                    >
                      {formatRelativeTime(user.lastSynced)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      data-testid="resync-user-button"
                      aria-label={`Resync ${user.name}`}
                      aria-busy={syncingUsers.has(user.id)}
                      disabled={syncingUsers.has(user.id)}
                      onClick={() => handleResync(user.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#383663] px-3 py-1.5 text-xs font-medium text-[#9795c6] transition-colors hover:bg-[#272546] hover:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                    >
                      {syncingUsers.has(user.id) ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-sm">
                            progress_activity
                          </span>
                          Syncing...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm">
                            sync
                          </span>
                          Resync
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
