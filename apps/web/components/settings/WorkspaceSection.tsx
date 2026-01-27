/**
 * WorkspaceSection Component
 *
 * Story: 0-2-10 Implement Settings Pages
 * AC5: Workspace Settings tab
 *
 * Workspace settings with general info, AI settings, security policies, and integrations.
 * Matches wireframe design from workspace_settings_dashboard/code.html.
 */

'use client';

import { useState } from 'react';
import { Save, Upload, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  WORKSPACE,
  INTEGRATIONS,
  type Workspace,
  type Integration,
} from '@/lib/mock-data/settings';

export function WorkspaceSection() {
  const [workspace, setWorkspace] = useState<Workspace>(WORKSPACE);
  const [integrations] = useState<Integration[]>(INTEGRATIONS);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-4 border-b border-border pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-foreground text-3xl font-bold leading-tight tracking-tight">
            Workspace Settings
          </h1>
          <p className="text-muted-foreground text-base max-w-xl">
            Manage your organization profile, default AI configurations, and
            security policies.
          </p>
        </div>
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* General Information */}
      <section className="flex flex-col gap-6">
        <h2 className="text-foreground text-xl font-bold">
          General Information
        </h2>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Icon Upload */}
            <div className="flex flex-col gap-3 shrink-0">
              <Label className="text-sm font-medium text-muted-foreground">
                Workspace Icon
              </Label>
              <div className="group relative size-24 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden">
                {workspace.iconUrl ? (
                  <div
                    className="absolute inset-0 bg-center bg-cover opacity-50 group-hover:opacity-30 transition-opacity"
                    style={{ backgroundImage: `url('${workspace.iconUrl}')` }}
                  />
                ) : null}
                <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary z-10" />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Rec. 64x64px
              </p>
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-5 flex-1 max-w-2xl">
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-foreground">
                  Workspace Name
                </Label>
                <Input
                  type="text"
                  value={workspace.name}
                  onChange={(e) =>
                    setWorkspace({ ...workspace, name: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-foreground">
                  Workspace URL
                </Label>
                <div className="flex items-center w-full bg-background border border-border rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                  <span className="pl-4 pr-1 py-2.5 text-muted-foreground bg-muted border-r border-border text-sm select-none">
                    hyyve.ai/
                  </span>
                  <Input
                    type="text"
                    value={workspace.slug}
                    onChange={(e) =>
                      setWorkspace({ ...workspace, slug: e.target.value })
                    }
                    className="border-none focus:ring-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Default AI Settings */}
      <section className="flex flex-col gap-6">
        <h2 className="text-foreground text-xl font-bold">
          Default AI Settings
        </h2>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-foreground">
              Default LLM Provider
            </Label>
            <div className="relative">
              <select
                value={workspace.defaultProvider}
                onChange={(e) =>
                  setWorkspace({ ...workspace, defaultProvider: e.target.value })
                }
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground appearance-none focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer"
              >
                <option>OpenAI</option>
                <option>Anthropic</option>
                <option>Google Vertex AI</option>
                <option>Cohere</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-foreground">
              Default Model
            </Label>
            <div className="relative">
              <select
                value={workspace.defaultModel}
                onChange={(e) =>
                  setWorkspace({ ...workspace, defaultModel: e.target.value })
                }
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground appearance-none focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer"
              >
                <option>GPT-4 Turbo</option>
                <option>GPT-4</option>
                <option>GPT-3.5 Turbo</option>
                <option>Claude 3 Opus</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:col-span-2 mt-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium text-foreground">
                Temperature
              </Label>
              <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                {workspace.temperature}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={workspace.temperature}
              onChange={(e) =>
                setWorkspace({
                  ...workspace,
                  temperature: parseFloat(e.target.value),
                })
              }
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <p className="text-xs text-muted-foreground">
              Controls randomness: Lowering results in less random completions.
              As the temperature approaches zero, the model will become
              deterministic and repetitive.
            </p>
          </div>
        </div>
      </section>

      {/* Security Policies */}
      <section className="flex flex-col gap-6">
        <h2 className="text-foreground text-xl font-bold">Security Policies</h2>
        <div className="bg-card border border-border rounded-xl shadow-sm divide-y divide-border">
          {/* Audit Logging Toggle */}
          <div className="p-5 flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-foreground text-sm font-medium">
                Audit Logging
              </h3>
              <p className="text-muted-foreground text-sm">
                Log all prompts and completions for compliance review.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={workspace.auditLogging}
                onChange={(e) =>
                  setWorkspace({ ...workspace, auditLogging: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-border" />
            </label>
          </div>

          {/* PII Redaction Toggle */}
          <div className="p-5 flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-foreground text-sm font-medium">
                PII Redaction
              </h3>
              <p className="text-muted-foreground text-sm">
                Automatically detect and redact personally identifiable
                information.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={workspace.piiRedaction}
                onChange={(e) =>
                  setWorkspace({ ...workspace, piiRedaction: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-border" />
            </label>
          </div>

          {/* Enforce 2FA Toggle */}
          <div className="p-5 flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-foreground text-sm font-medium">
                Enforce 2FA
              </h3>
              <p className="text-muted-foreground text-sm">
                Require two-factor authentication for all workspace members.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={workspace.enforce2fa}
                onChange={(e) =>
                  setWorkspace({ ...workspace, enforce2fa: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-border" />
            </label>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="flex flex-col gap-6">
        <h2 className="text-foreground text-xl font-bold">Integrations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className={cn(
                'bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between h-full gap-4',
                integration.status === 'disconnected' && 'opacity-75'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-muted p-2 rounded-lg flex items-center justify-center size-10">
                    <span className="material-symbols-outlined text-foreground">
                      {integration.icon}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-foreground text-base font-semibold">
                      {integration.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={cn(
                          'size-2 rounded-full',
                          integration.status === 'connected'
                            ? 'bg-emerald-500'
                            : 'bg-muted-foreground'
                        )}
                      />
                      <span
                        className={cn(
                          'text-xs font-medium capitalize',
                          integration.status === 'connected'
                            ? 'text-emerald-500'
                            : 'text-muted-foreground'
                        )}
                      >
                        {integration.status}
                      </span>
                    </div>
                  </div>
                </div>
                {integration.status === 'connected' ? (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary border border-border" />
                  </label>
                ) : (
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                )}
              </div>
              <p className="text-muted-foreground text-sm">
                {integration.description}
                {integration.channel && (
                  <span className="text-foreground font-mono bg-muted px-1.5 py-0.5 rounded text-xs ml-1">
                    {integration.channel}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Danger Zone */}
      <section className="flex flex-col gap-6 pb-12">
        <h2 className="text-destructive text-xl font-bold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </h2>
        <div className="border border-destructive/30 bg-destructive/5 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <h3 className="text-foreground text-base font-semibold">
              Delete this workspace
            </h3>
            <p className="text-muted-foreground text-sm">
              Once you delete a workspace, there is no going back. Please be
              certain.
            </p>
          </div>
          <Button variant="destructive">Delete Workspace</Button>
        </div>
      </section>
    </div>
  );
}

export default WorkspaceSection;
