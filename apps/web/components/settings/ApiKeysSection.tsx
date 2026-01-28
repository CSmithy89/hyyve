/**
 * ApiKeysSection Component
 *
 * Story: 0-2-10 Implement Settings Pages
 * AC4: API Keys tab
 *
 * API key management with security warning, key listing, and create form.
 * Matches wireframe design from api_keys_management/code.html.
 */

'use client';

import { useState } from 'react';
import { Plus, Copy, MoreVertical, AlertTriangle, History, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { API_KEYS, type ApiKey } from '@/lib/mock-data/settings';

export function ApiKeysSection() {
  const [keys] = useState<ApiKey[]>(API_KEYS);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [ipWhitelist, setIpWhitelist] = useState<string[]>(['10.0.0.45']);
  const [newIp, setNewIp] = useState('');

  const handleCopyKey = (keyId: string, maskedKey: string) => {
    navigator.clipboard.writeText(maskedKey);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAddIp = () => {
    if (newIp && !ipWhitelist.includes(newIp)) {
      setIpWhitelist([...ipWhitelist, newIp]);
      setNewIp('');
    }
  };

  const handleRemoveIp = (ip: string) => {
    setIpWhitelist(ipWhitelist.filter((i) => i !== ip));
  };

  const getEnvironmentColor = (env: ApiKey['environment']) => {
    switch (env) {
      case 'production':
        return 'bg-purple-500';
      case 'development':
        return 'bg-blue-500';
      case 'test':
        return 'bg-amber-500';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="space-y-10">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black leading-tight tracking-tight text-foreground">
            API Keys Management
          </h1>
          <p className="text-muted-foreground text-base">
            Manage access tokens for the Hyyve AI Engine.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Key
        </Button>
      </div>

      {/* Security Warning Banner */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex gap-4 items-start">
        <div className="bg-amber-500/20 text-amber-500 rounded-full p-2 shrink-0">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-amber-500 font-bold text-sm">Security Alert</h3>
          <p className="text-amber-200/80 text-sm">
            Your secret API keys are sensitive credentials. Treat them like
            passwords. Do not commit them to version control. We only display
            your secret key once upon creation.
          </p>
        </div>
      </div>

      {/* Active Keys List */}
      <div className="flex flex-col gap-6">
        <h3 className="text-foreground text-lg font-bold">Active Keys</h3>

        {keys.map((key) => (
          <div
            key={key.id}
            className="group bg-card border border-border rounded-xl p-6 shadow-sm hover:border-primary/50 transition-all relative overflow-hidden"
          >
            {/* Environment indicator */}
            <div
              className={cn(
                'absolute top-0 left-0 w-1 h-full',
                getEnvironmentColor(key.environment)
              )}
            />

            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              {/* Key Info */}
              <div className="flex flex-col gap-1 min-w-[200px]">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-foreground text-lg">
                    {key.name}
                  </span>
                  <span
                    className={cn(
                      'text-xs font-bold px-2 py-0.5 rounded-full border',
                      key.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-muted text-muted-foreground border-border'
                    )}
                  >
                    {key.status.charAt(0).toUpperCase() + key.status.slice(1)}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  Created on {key.createdAt}
                </span>
              </div>

              {/* Masked Key */}
              <div className="flex-1 w-full md:w-auto">
                <div className="flex items-center gap-2 bg-muted border border-border rounded-lg p-2 max-w-md w-full">
                  <span className="font-mono text-muted-foreground text-sm truncate select-all px-2 flex-1">
                    {key.maskedKey}
                  </span>
                  <button
                    onClick={() => handleCopyKey(key.id, key.maskedKey)}
                    className={cn(
                      'transition-colors p-1',
                      copiedKey === key.id
                        ? 'text-emerald-500'
                        : 'text-muted-foreground hover:text-primary'
                    )}
                    title={copiedKey === key.id ? 'Copied!' : 'Copy Key'}
                  >
                    {copiedKey === key.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                  <History className="h-3 w-3" />
                  Last used: {key.lastUsed}
                </div>
              </div>

              {/* Permissions & Actions */}
              <div className="flex items-center gap-4 self-end md:self-center">
                <div className="flex gap-2 flex-wrap">
                  {key.permissions.map((perm) => (
                    <span
                      key={perm}
                      className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded border border-border"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
                <button className="text-muted-foreground hover:text-destructive transition-colors p-2 rounded-full hover:bg-muted">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create New Key Form */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <h3 className="text-foreground text-lg font-bold">
            Generate New API Key
          </h3>
        </div>
        <div className="p-6 flex flex-col gap-6">
          {/* Name Input */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold">Key Name</Label>
            <Input
              placeholder="e.g., CI/CD Pipeline Key"
              className="max-w-md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Permissions */}
            <div className="flex flex-col gap-3">
              <Label className="text-sm font-semibold">Permissions Scope</Label>
              <div className="flex flex-col gap-2 p-4 bg-muted/50 rounded-lg border border-border">
                {[
                  'Models (Read/Write)',
                  'Fine-tuning',
                  'Analytics Data',
                  'Billing & Usage',
                ].map((perm) => (
                  <label
                    key={perm}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={perm === 'Models (Read/Write)'}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                    />
                    <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                      {perm}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* IP Restriction */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-semibold">
                  IP Whitelist (Optional)
                </Label>
                <span className="text-xs text-muted-foreground">
                  CIDR notation supported
                </span>
              </div>
              <div className="flex gap-2">
                <Input
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  placeholder="192.168.1.1/32"
                  className="flex-1 font-mono"
                />
                <Button variant="secondary" onClick={handleAddIp}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {ipWhitelist.map((ip) => (
                  <div
                    key={ip}
                    className="bg-primary/10 border border-primary/20 text-primary text-xs font-mono px-2 py-1 rounded flex items-center gap-1"
                  >
                    {ip}
                    <button
                      onClick={() => handleRemoveIp(ip)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-3">
            <Button variant="ghost">Cancel</Button>
            <Button>Generate Key</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApiKeysSection;
