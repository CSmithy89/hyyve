/**
 * SecuritySection Component
 *
 * Story: 0-2-10 Implement Settings Pages
 * AC3: Account & Security tab
 *
 * Security settings with authentication, MFA, sessions, and danger zone.
 * Matches wireframe design from account_&_security_settings_1/code.html.
 */

'use client';

import { Laptop, Smartphone, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { SESSIONS, SECURITY_INFO, MFA_STATUS } from '@/lib/mock-data/settings';

export function SecuritySection() {
  return (
    <div className="space-y-10">
      {/* Page Heading */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
          Account & Security
        </h1>
        <p className="text-muted-foreground text-base max-w-2xl">
          Manage your access credentials, enable 2FA, and monitor your active
          sessions to keep your account secure.
        </p>
      </div>

      {/* Authentication Section */}
      <section className="flex flex-col gap-5">
        <div className="border-b border-border pb-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">key</span>
            Authentication
          </h2>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold">Email Address</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-muted-foreground text-[20px]">
                    mail
                  </span>
                </span>
                <Input
                  type="email"
                  value="alex@hyyve.ai"
                  disabled
                  className="pl-10 opacity-75"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold">Password</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-muted-foreground text-[20px]">
                    lock
                  </span>
                </span>
                <Input
                  type="password"
                  value="••••••••••••"
                  className="pl-10"
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Last changed{' '}
              <span className="font-medium text-foreground">
                {SECURITY_INFO.passwordLastChanged}
              </span>
            </p>
            <Button className="gap-2">
              <span className="material-symbols-outlined text-[18px]">
                lock_reset
              </span>
              Change Password
            </Button>
          </div>
        </div>
      </section>

      {/* MFA/2FA Section */}
      <section className="flex flex-col gap-5">
        <div className="border-b border-border pb-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              verified_user
            </span>
            Two-Factor Authentication
          </h2>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-lg font-semibold text-foreground">
                Authenticator App
              </h3>
              {MFA_STATUS.enabled ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-500 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Enabled
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-muted-foreground border border-border">
                  Disabled
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground max-w-lg">
              Use an authenticator app like Google Authenticator or 1Password
              to generate one-time codes for extra security.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-muted-foreground hover:text-foreground text-sm font-medium px-4 py-2 transition-colors">
              View Backup Codes
            </button>
            <Button variant="outline">Configure</Button>
          </div>
        </div>
      </section>

      {/* Active Sessions */}
      <section className="flex flex-col gap-5">
        <div className="border-b border-border pb-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              devices
            </span>
            Active Sessions
          </h2>
        </div>
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border text-xs uppercase font-semibold text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Device</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Last Active</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {SESSIONS.map((session) => (
                  <tr
                    key={session.id}
                    className="group hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-10 h-10 rounded-lg flex items-center justify-center',
                            session.isCurrent
                              ? 'bg-primary/10 text-primary'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {session.device.includes('Macbook') ||
                          session.device.includes('laptop') ? (
                            <Laptop className="h-5 w-5" />
                          ) : (
                            <Smartphone className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {session.device}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {session.browser} • {session.os}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-foreground">
                          {session.location}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {session.ipAddress}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {session.isCurrent ? (
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-emerald-500 font-medium">
                            Active now
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          {session.lastActive}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {session.isCurrent ? (
                        <span className="text-xs text-muted-foreground italic">
                          Current Session
                        </span>
                      ) : (
                        <button className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="flex flex-col gap-5 pt-8">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-destructive/20 bg-destructive/10">
            <h2 className="text-lg font-bold text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </h2>
          </div>
          <div className="p-6 divide-y divide-destructive/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 first:pt-0">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-foreground">
                  Export Personal Data
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Download all your account data, projects, and logs in JSON
                  format.
                </p>
              </div>
              <Button variant="outline">Export Data</Button>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 last:pb-0">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-foreground">
                  Delete Account
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </p>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SecuritySection;
