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
import {
  Plus,
  Copy,
  MoreVertical,
  AlertTriangle,
  History,
  Check,
  Loader2,
  KeyRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { API_KEYS, type ApiKey } from '@/lib/mock-data/settings';

const SCOPE_OPTIONS = [
  {
    label: 'Chatbot: Invoke (Execute workflows)',
    value: 'chatbot:invoke',
  },
  { label: 'Chatbot: Read', value: 'chatbot:read' },
  { label: 'Chatbot: Write', value: 'chatbot:write' },
  { label: 'Module: Invoke', value: 'module:invoke' },
  { label: 'Module: Read', value: 'module:read' },
  { label: 'Module: Write', value: 'module:write' },
  { label: 'Voice: Invoke', value: 'voice:invoke' },
  { label: 'Voice: Read', value: 'voice:read' },
  { label: 'Voice: Write', value: 'voice:write' },
  { label: 'Analytics: Read', value: 'analytics:read' },
  { label: 'Webhook: Manage', value: 'webhook:manage' },
];

const ENVIRONMENTS = [
  { label: 'Development', value: 'development', description: 'Sandbox access' },
  { label: 'Staging', value: 'staging', description: 'Pre-prod validation' },
  { label: 'Production', value: 'production', description: 'Live data access' },
];

export function ApiKeysSection() {
  const [keys, setKeys] = useState<ApiKey[]>(API_KEYS);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [createdKey, setCreatedKey] = useState<{
    fullKey: string;
    name: string;
  } | null>(null);
  const [keyName, setKeyName] = useState('');
  const [environment, setEnvironment] =
    useState<ApiKey['environment']>('development');
  const [selectedScopes, setSelectedScopes] = useState<string[]>([
    'chatbot:invoke',
  ]);
  const [expirationMode, setExpirationMode] = useState<'never' | 'days'>(
    'never'
  );
  const [expirationDays, setExpirationDays] = useState(30);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const handleCopyKey = (keyId: string, maskedKey: string) => {
    navigator.clipboard.writeText(maskedKey);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyFullKey = async (fullKey: string) => {
    await navigator.clipboard.writeText(fullKey);
  };

  const toggleScope = (scope: string) => {
    setSelectedScopes((current) =>
      current.includes(scope)
        ? current.filter((item) => item !== scope)
        : [...current, scope]
    );
  };

  const maskKey = (fullKey: string) => {
    const visible = fullKey.slice(-4);
    return `${fullKey.slice(0, 8)}••••••••••••••${visible}`;
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

  const handleCreateKey = async () => {
    if (!keyName.trim() || selectedScopes.length === 0) {
      setCreateError('Please provide a key name and at least one scope.');
      return;
    }

    setIsCreating(true);
    setCreateError(null);

    try {
      const response = await fetch('/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: keyName.trim(),
          environment,
          scopes: selectedScopes,
          expiresInDays: expirationMode === 'days' ? expirationDays : null,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody?.error || 'Failed to create API key.');
      }

      const result = await response.json();
      const apiKey = result.apiKey as {
        id: string;
        name: string;
        key_prefix: string;
        scopes: string[];
        environment: ApiKey['environment'];
        created_at: string;
      };

      setCreatedKey({ fullKey: result.fullKey, name: apiKey.name });
      setKeys((current) => [
        {
          id: apiKey.id,
          name: apiKey.name,
          maskedKey: maskKey(result.fullKey),
          status: 'active',
          createdAt: formatDate(apiKey.created_at),
          lastUsed: 'Just now',
          scopes: apiKey.scopes,
          environment: apiKey.environment,
        },
        ...current,
      ]);

      setKeyName('');
      setSelectedScopes(['chatbot:invoke']);
      setExpirationMode('never');
      setExpirationDays(30);
    } catch (error) {
      setCreateError(
        error instanceof Error ? error.message : 'Failed to create API key.'
      );
    } finally {
      setIsCreating(false);
    }
  };

  const getEnvironmentColor = (env: ApiKey['environment']) => {
    switch (env) {
      case 'production':
        return 'bg-purple-500';
      case 'development':
        return 'bg-blue-500';
      case 'staging':
        return 'bg-amber-500';
      default:
        return 'bg-muted';
    }
  };

  const getScopeLabel = (scope: string) =>
    SCOPE_OPTIONS.find((option) => option.value === scope)?.label ?? scope;

  const getEnvironmentLabel = (env: ApiKey['environment']) =>
    ENVIRONMENTS.find((option) => option.value === env)?.label ?? env;

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

      {createdKey && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/20 text-emerald-500 rounded-full p-2">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-200">
                  New key created: {createdKey.name}
                </p>
                <p className="text-xs text-emerald-200/80">
                  Save this key now. You will only see it once.
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="text-emerald-200 hover:text-emerald-100"
              onClick={() => setCreatedKey(null)}
            >
              Dismiss
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex-1 w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg px-3 py-2 font-mono text-sm text-emerald-100 break-all">
              {createdKey.fullKey}
            </div>
            <Button
              className="gap-2"
              onClick={() => handleCopyFullKey(createdKey.fullKey)}
            >
              <Copy className="h-4 w-4" />
              Copy Key
            </Button>
          </div>
        </div>
      )}

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
                  <span
                    data-testid="api-key-environment"
                    className="text-xs font-semibold px-2 py-0.5 rounded-full border border-border bg-muted text-muted-foreground"
                  >
                    {getEnvironmentLabel(key.environment)}
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
                  {key.scopes.map((scope) => (
                    <span
                      key={scope}
                      className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded border border-border"
                    >
                      {getScopeLabel(scope)}
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
              value={keyName}
              onChange={(event) => setKeyName(event.target.value)}
              placeholder="e.g., CI/CD Pipeline Key"
              className="max-w-md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Environment */}
            <div className="flex flex-col gap-3">
              <Label className="text-sm font-semibold">Environment</Label>
              <div className="flex flex-col gap-3">
                {ENVIRONMENTS.map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      'relative flex cursor-pointer rounded-lg border p-3 transition-colors',
                      environment === option.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-muted/50'
                    )}
                  >
                    <input
                      type="radio"
                      name="environment"
                      className="sr-only"
                      value={option.value}
                      checked={environment === option.value}
                      onChange={() =>
                        setEnvironment(option.value as ApiKey['environment'])
                      }
                    />
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'h-4 w-4 rounded-full border flex items-center justify-center',
                          environment === option.value
                            ? 'border-primary bg-primary'
                            : 'border-muted-foreground'
                        )}
                      >
                        <div
                          className={cn(
                            'h-2 w-2 rounded-full bg-white',
                            environment === option.value ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {option.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Expiration */}
            <div className="flex flex-col gap-3">
              <Label className="text-sm font-semibold">Expiration</Label>
              <div className="flex flex-col gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="expiration"
                    checked={expirationMode === 'never'}
                    onChange={() => setExpirationMode('never')}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                  />
                  <span className="text-sm text-muted-foreground">
                    Never expires
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="expiration"
                    checked={expirationMode === 'days'}
                    onChange={() => setExpirationMode('days')}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                  />
                  <span className="text-sm text-muted-foreground">
                    Expire after N days
                  </span>
                </label>
                {expirationMode === 'days' && (
                  <Input
                    type="number"
                    min={1}
                    max={3650}
                    value={expirationDays}
                    onChange={(event) =>
                      setExpirationDays(Number(event.target.value))
                    }
                    className="max-w-[160px]"
                    placeholder="30"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="flex flex-col gap-3">
            <Label className="text-sm font-semibold">Permissions Scope</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-muted/50 rounded-lg border border-border">
              {SCOPE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedScopes.includes(option.value)}
                    onChange={() => toggleScope(option.value)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {createError && (
            <div className="text-sm text-destructive">{createError}</div>
          )}

          <div className="pt-4 border-t border-border flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setKeyName('')}>
              Cancel
            </Button>
            <Button onClick={handleCreateKey} disabled={isCreating}>
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Secret Key
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApiKeysSection;
