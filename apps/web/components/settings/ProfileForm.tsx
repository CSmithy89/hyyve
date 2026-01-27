/**
 * ProfileForm Component
 *
 * Story: 0-2-10 Implement Settings Pages
 * AC2: Profile & Preferences tab
 *
 * Profile form with identity, theme, accessibility, and notification settings.
 * Matches wireframe design from user_profile_&_preferences/code.html.
 */

'use client';

import { useState } from 'react';
import { Save, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  USER_PROFILE,
  NOTIFICATION_PREFERENCES,
  type UserProfile,
} from '@/lib/mock-data/settings';

type Theme = 'light' | 'dark' | 'system';

export function ProfileForm() {
  const [profile, setProfile] = useState<UserProfile>(USER_PROFILE);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(profile.theme);

  return (
    <div className="space-y-8">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Profile & Preferences
          </h1>
          <p className="text-muted-foreground">
            Manage your personal details and application settings.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Cancel</Button>
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Identity Section */}
      <section className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <h3 className="text-foreground font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              badge
            </span>
            Identity
          </h3>
        </div>
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
          {/* Avatar Column */}
          <div className="flex flex-col items-center gap-4 w-full md:w-1/4">
            <div className="relative group cursor-pointer">
              <div
                className="size-32 rounded-full bg-cover bg-center ring-4 ring-background shadow-2xl"
                style={{ backgroundImage: `url('${profile.avatarUrl}')` }}
              />
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </div>
            <button className="text-sm text-primary font-medium hover:text-primary/80">
              Change Avatar
            </button>
            <p className="text-xs text-muted-foreground text-center px-4">
              Allowed *.jpeg, *.jpg, *.png, *.gif
              <br />
              Max size of 3 MB
            </p>
          </div>

          {/* Form Column */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                First Name
              </Label>
              <Input
                type="text"
                value={profile.firstName}
                onChange={(e) =>
                  setProfile({ ...profile, firstName: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Last Name
              </Label>
              <Input
                type="text"
                value={profile.lastName}
                onChange={(e) =>
                  setProfile({ ...profile, lastName: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email Address
              </Label>
              <Input type="email" value={profile.email} disabled />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Job Title
              </Label>
              <Input
                type="text"
                value={profile.jobTitle}
                onChange={(e) =>
                  setProfile({ ...profile, jobTitle: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Organization
              </Label>
              <Input
                type="text"
                value={profile.organization}
                disabled
                className="opacity-50"
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Bio
              </Label>
              <textarea
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                rows={3}
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* Theme & Accessibility Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Theme Settings */}
        <section className="bg-card rounded-xl border border-border flex flex-col">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <h3 className="text-foreground font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">
                palette
              </span>
              Interface Theme
            </h3>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center gap-6">
            <div className="grid grid-cols-3 gap-4">
              {(['light', 'dark', 'system'] as Theme[]).map((theme) => (
                <label key={theme} className="cursor-pointer group">
                  <input
                    type="radio"
                    name="theme"
                    value={theme}
                    checked={selectedTheme === theme}
                    onChange={() => setSelectedTheme(theme)}
                    className="peer sr-only"
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className={cn(
                        'w-full aspect-video rounded-lg border relative overflow-hidden transition-all',
                        theme === 'light' && 'bg-slate-100',
                        theme === 'dark' && 'bg-background-dark',
                        theme === 'system' &&
                          'bg-gradient-to-br from-background-dark to-slate-100',
                        selectedTheme === theme
                          ? 'border-2 border-primary shadow-[0_0_15px_rgba(80,72,229,0.3)]'
                          : 'border-border opacity-50 hover:opacity-100'
                      )}
                    >
                      {theme !== 'system' && (
                        <>
                          <div
                            className={cn(
                              'absolute top-2 left-2 w-16 h-2 rounded',
                              theme === 'light' ? 'bg-slate-300' : 'bg-muted'
                            )}
                          />
                          <div
                            className={cn(
                              'absolute top-6 left-2 w-8 h-8 rounded-full',
                              theme === 'light' ? 'bg-slate-300' : 'bg-muted'
                            )}
                          />
                        </>
                      )}
                    </div>
                    <span
                      className={cn(
                        'text-sm font-medium capitalize',
                        selectedTheme === theme
                          ? 'text-primary'
                          : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    >
                      {theme}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* Accessibility Settings */}
        <section className="bg-card rounded-xl border border-border flex flex-col">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <h3 className="text-foreground font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">
                accessibility_new
              </span>
              Accessibility
            </h3>
          </div>
          <div className="p-6 flex-1 flex flex-col gap-6 justify-center">
            {/* Font Size */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">
                  Font Size
                </span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  Default (14px)
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-muted-foreground text-sm">
                  text_decrease
                </span>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="1"
                  defaultValue="1"
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <span className="material-symbols-outlined text-foreground text-lg">
                  text_increase
                </span>
              </div>
            </div>

            <div className="h-px bg-border w-full" />

            {/* Reduce Motion */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                  Reduce Motion
                </span>
                <span className="text-xs text-muted-foreground">
                  Minimize interface animations
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                  High Contrast
                </span>
                <span className="text-xs text-muted-foreground">
                  Increase color distinction
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>
          </div>
        </section>
      </div>

      {/* Notification Preferences */}
      <section className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/30 flex justify-between items-center">
          <h3 className="text-foreground font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              notifications_active
            </span>
            Notification Preferences
          </h3>
          <button className="text-xs text-primary font-medium hover:underline">
            Reset to defaults
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                <th className="px-6 py-4">Event Type</th>
                <th className="px-6 py-4 text-center">In-App</th>
                <th className="px-6 py-4 text-center">Email</th>
                <th className="px-6 py-4 text-center">Push</th>
                <th className="px-6 py-4 text-center">Slack</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {NOTIFICATION_PREFERENCES.map((pref) => (
                <tr
                  key={pref.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {pref.eventType}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {pref.description}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={pref.inApp}
                      disabled={pref.inAppLocked}
                      className={cn(
                        'rounded border-border text-primary focus:ring-primary/50',
                        pref.inAppLocked && 'cursor-not-allowed opacity-50'
                      )}
                      readOnly
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={pref.email}
                      disabled={pref.emailLocked}
                      className={cn(
                        'rounded border-border text-primary focus:ring-primary/50',
                        pref.emailLocked && 'cursor-not-allowed opacity-50'
                      )}
                      readOnly
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={pref.push}
                      className="rounded border-border text-primary focus:ring-primary/50"
                      readOnly
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={pref.slack}
                      className="rounded border-border text-primary focus:ring-primary/50"
                      readOnly
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default ProfileForm;
