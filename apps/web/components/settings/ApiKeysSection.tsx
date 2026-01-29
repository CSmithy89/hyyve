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

import { useCallback, useMemo, useState } from 'react';
import { z } from 'zod';
import {
  Plus,
  Copy,
  MoreVertical,
  AlertTriangle,
  History,
  Check,
  Loader2,
  KeyRound,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { API_KEYS, type ApiKey } from '@/lib/mock-data/settings';
import { ApiKeyEnvironmentSchema } from '@/lib/validations/api-keys';

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

const USAGE_SNAPSHOT = {
  requestsToday: 128,
  requestsThisMonth: 4820,
  errorRate: '0.8%',
  averageResponseTime: '210ms',
  topEndpoints: [
    { path: '/api/v1/ingest', count: 2140 },
    { path: '/api/v1/query', count: 1430 },
    { path: '/api/v1/metrics', count: 980 },
  ],
  trend: [12, 24, 18, 32, 28, 40, 35],
};

const ApiKeyResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  key_prefix: z.string(),
  scopes: z.array(z.string()),
  environment: ApiKeyEnvironmentSchema,
  created_at: z.string(),
  expires_at: z.string().nullable().optional(),
  rate_limit_per_minute: z.number(),
  rate_limit_per_day: z.number(),
  allowed_origins: z.array(z.string()).optional(),
  allowed_ips: z.array(z.string()).optional(),
});

const ApiKeyCreateResponseSchema = z.object({
  apiKey: ApiKeyResponseSchema,
  fullKey: z.string(),
});

const ApiKeyRevokeResponseSchema = z.object({
  apiKey: z.object({
    id: z.string(),
    revoked_at: z.string().nullable().optional(),
  }),
});

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
  const [searchQuery, setSearchQuery] = useState('');
  const [environmentFilter, setEnvironmentFilter] = useState<
    ApiKey['environment'] | 'all'
  >('all');
  const [statusFilter, setStatusFilter] = useState<
    ApiKey['status'] | 'all'
  >('all');
  const [rotationGraceHours, setRotationGraceHours] = useState(1);
  const [revokeOldOnRotate, setRevokeOldOnRotate] = useState(false);
  const [rotatingKeyId, setRotatingKeyId] = useState<string | null>(null);
  const [rotationError, setRotationError] = useState<string | null>(null);
  const [revokingKeyId, setRevokingKeyId] = useState<string | null>(null);
  const [revokeError, setRevokeError] = useState<string | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [pendingRevokeKey, setPendingRevokeKey] = useState<ApiKey | null>(null);
  const [selectedScopes, setSelectedScopes] = useState<string[]>([
    'chatbot:invoke',
  ]);
  const [expirationMode, setExpirationMode] = useState<'never' | 'days'>(
    'never'
  );
  const [expirationDays, setExpirationDays] = useState(30);
  const [rateLimitPerMinute, setRateLimitPerMinute] = useState(60);
  const [rateLimitPerDay, setRateLimitPerDay] = useState(10000);
  const [allowedOrigins, setAllowedOrigins] = useState<string[]>([]);
  const [newOrigin, setNewOrigin] = useState('');
  const [allowedIps, setAllowedIps] = useState<string[]>([]);
  const [newIp, setNewIp] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const handleCopyKey = async (keyId: string, maskedKey: string) => {
    try {
      await navigator.clipboard.writeText(maskedKey);
      setCopyError(null);
      setCopiedKey(keyId);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      setCopyError('Unable to copy key. Please try again.');
      setTimeout(() => setCopyError(null), 3000);
    }
  };

  const handleCopyFullKey = async (fullKey: string) => {
    try {
      await navigator.clipboard.writeText(fullKey);
      setCopyError(null);
    } catch {
      setCopyError('Unable to copy key. Please try again.');
      setTimeout(() => setCopyError(null), 3000);
    }
  };

  const handleAddOrigin = () => {
    const trimmed = newOrigin.trim();
    if (!trimmed || allowedOrigins.includes(trimmed)) {
      return;
    }
    setAllowedOrigins((current) => [...current, trimmed]);
    setNewOrigin('');
  };

  const handleRemoveOrigin = (origin: string) => {
    setAllowedOrigins((current) => current.filter((item) => item !== origin));
  };

  const handleAddIp = () => {
    const trimmed = newIp.trim();
    if (!trimmed || allowedIps.includes(trimmed)) {
      return;
    }
    setAllowedIps((current) => [...current, trimmed]);
    setNewIp('');
  };

  const handleRemoveIp = (ip: string) => {
    setAllowedIps((current) => current.filter((item) => item !== ip));
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
          rateLimitPerMinute,
          rateLimitPerDay,
          allowedOrigins,
          allowedIps,
          expiresInDays: expirationMode === 'days' ? expirationDays : null,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody?.error || 'Failed to create API key.');
      }

      const result = await response.json();
      const parsedResponse = ApiKeyCreateResponseSchema.safeParse(result);
      if (!parsedResponse.success) {
        throw new Error('Unexpected response from server.');
      }
      const { apiKey, fullKey } = parsedResponse.data;

      setCreatedKey({ fullKey, name: apiKey.name });
      setKeys((current) => [
        {
          id: apiKey.id,
          name: apiKey.name,
          maskedKey: maskKey(fullKey),
          status: 'active',
          createdAt: formatDate(apiKey.created_at),
          lastUsed: 'Just now',
          scopes: apiKey.scopes,
          environment: apiKey.environment,
          rateLimitPerMinute: apiKey.rate_limit_per_minute,
          rateLimitPerDay: apiKey.rate_limit_per_day,
          allowedOrigins: apiKey.allowed_origins ?? [],
          allowedIps: apiKey.allowed_ips ?? [],
          expiresAt: apiKey.expires_at ?? null,
        },
        ...current,
      ]);

      setKeyName('');
      setSelectedScopes(['chatbot:invoke']);
      setExpirationMode('never');
      setExpirationDays(30);
      setRateLimitPerMinute(60);
      setRateLimitPerDay(10000);
      setNewOrigin('');
      setAllowedOrigins([]);
      setNewIp('');
      setAllowedIps([]);
    } catch (error) {
      setCreateError(
        error instanceof Error ? error.message : 'Failed to create API key.'
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleRotateKey = async (key: ApiKey) => {
    setRotatingKeyId(key.id);
    setRotationError(null);

    try {
      const response = await fetch(`/api-keys/${key.id}/rotate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          graceHours: rotationGraceHours,
          revokeOld: revokeOldOnRotate,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody?.error || 'Failed to rotate API key.');
      }

      const result = await response.json();
      const parsedResponse = ApiKeyCreateResponseSchema.safeParse(result);
      if (!parsedResponse.success) {
        throw new Error('Unexpected response from server.');
      }
      const { apiKey, fullKey } = parsedResponse.data;

      setCreatedKey({ fullKey, name: apiKey.name });
      const rotatedKey: ApiKey = {
        id: apiKey.id,
        name: apiKey.name,
        maskedKey: maskKey(fullKey),
        status: 'active',
        createdAt: formatDate(apiKey.created_at),
        lastUsed: 'Just now',
        scopes: apiKey.scopes,
        environment: apiKey.environment,
        rateLimitPerMinute: apiKey.rate_limit_per_minute,
        rateLimitPerDay: apiKey.rate_limit_per_day,
        allowedOrigins: apiKey.allowed_origins ?? [],
        allowedIps: apiKey.allowed_ips ?? [],
        expiresAt: apiKey.expires_at ?? null,
      };

      setKeys((current) => [
        rotatedKey,
        ...current.map((item) =>
          item.id === key.id && revokeOldOnRotate
            ? { ...item, status: 'revoked' as ApiKey['status'] }
            : item
        ),
      ]);
    } catch (error) {
      setRotationError(
        error instanceof Error ? error.message : 'Failed to rotate API key.'
      );
    } finally {
      setRotatingKeyId(null);
    }
  };

  const handleRevokeKey = async (key: ApiKey) => {
    setRevokingKeyId(key.id);
    setRevokeError(null);

    try {
      const response = await fetch(`/api-keys/${key.id}/revoke`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody?.error || 'Failed to revoke API key.');
      }

      const result = await response.json();
      const parsedResponse = ApiKeyRevokeResponseSchema.safeParse(result);
      if (!parsedResponse.success) {
        throw new Error('Unexpected response from server.');
      }

      setKeys((current) =>
        current.map((item) =>
          item.id === key.id
            ? { ...item, status: 'revoked' as ApiKey['status'] }
            : item
        )
      );
    } catch (error) {
      setRevokeError(
        error instanceof Error ? error.message : 'Failed to revoke API key.'
      );
    } finally {
      setRevokingKeyId(null);
    }
  };

  const confirmRevokeKey = async () => {
    if (!pendingRevokeKey) {
      return;
    }
    const key = pendingRevokeKey;
    setPendingRevokeKey(null);
    await handleRevokeKey(key);
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

  const getComputedStatus = useCallback((key: ApiKey) => {
    if (key.status === 'revoked') {
      return 'revoked';
    }

    if (key.expiresAt && new Date(key.expiresAt) <= new Date()) {
      return 'expired';
    }

    return 'active';
  }, []);

  const getExpiresInDays = useCallback((key: ApiKey) => {
    if (!key.expiresAt) {
      return null;
    }
    const diffMs = new Date(key.expiresAt).getTime() - Date.now();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }, []);

  const expiringSoonKeys = useMemo(
    () =>
      keys
        .map((key) => ({
          key,
          daysLeft: getExpiresInDays(key),
          status: getComputedStatus(key),
        }))
        .filter(
          ({ daysLeft, status }) =>
            status === 'active' &&
            daysLeft !== null &&
            daysLeft <= 7 &&
            daysLeft >= 0
        ),
    [keys, getExpiresInDays, getComputedStatus]
  );

  const filteredKeys = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return keys.filter((key) => {
      const computedStatus = getComputedStatus(key);
      const matchesSearch =
        normalizedSearch.length === 0 ||
        key.name.toLowerCase().includes(normalizedSearch);
      const matchesEnvironment =
        environmentFilter === 'all' || key.environment === environmentFilter;
      const matchesStatus =
        statusFilter === 'all' || computedStatus === statusFilter;

      return matchesSearch && matchesEnvironment && matchesStatus;
    });
  }, [keys, searchQuery, environmentFilter, statusFilter, getComputedStatus]);

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

        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
          <div className="flex-1 w-full">
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search keys..."
              aria-label="Search keys"
              className="max-w-lg"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-[220px]">
              <select
                value={environmentFilter}
                onChange={(event) =>
                  setEnvironmentFilter(
                    event.target.value as ApiKey['environment'] | 'all'
                  )
                }
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground appearance-none focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer"
                aria-label="Filter by environment"
              >
                <option value="all">Filter by environment</option>
                {ENVIRONMENTS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                expand_more
              </span>
            </div>
            <div className="relative w-full sm:w-[200px]">
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as ApiKey['status'] | 'all'
                  )
                }
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground appearance-none focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer"
                aria-label="Filter by status"
              >
                <option value="all">Filter by status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="revoked">Revoked</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center rounded-xl border border-border bg-muted/30 p-4">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold">Rotation grace period</Label>
            <select
              value={rotationGraceHours}
              onChange={(event) =>
                setRotationGraceHours(Number(event.target.value))
              }
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground appearance-none focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer"
              aria-label="Rotation grace period"
            >
              <option value={1}>1 hour</option>
              <option value={2}>2 hours</option>
              <option value={4}>4 hours</option>
              <option value={8}>8 hours</option>
              <option value={12}>12 hours</option>
              <option value={24}>24 hours</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={revokeOldOnRotate}
              onChange={(event) => setRevokeOldOnRotate(event.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
            />
            Revoke old key immediately after rotation
          </label>
        </div>

        {rotationError && (
          <div className="text-sm text-destructive">{rotationError}</div>
        )}
        {revokeError && (
          <div className="text-sm text-destructive">{revokeError}</div>
        )}
        {copyError && (
          <div className="text-sm text-destructive">{copyError}</div>
        )}
        <Dialog
          open={Boolean(pendingRevokeKey)}
          onOpenChange={(open) => {
            if (!open) {
              setPendingRevokeKey(null);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Revoke API key</DialogTitle>
              <DialogDescription>
                {pendingRevokeKey
                  ? `Revoke ${pendingRevokeKey.name}? This action cannot be undone.`
                  : 'Revoke this API key?'}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setPendingRevokeKey(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmRevokeKey}
                disabled={
                  !pendingRevokeKey ||
                  revokingKeyId === pendingRevokeKey.id
                }
              >
                {revokingKeyId === pendingRevokeKey?.id && (
                  <Loader2 className="h-3 w-3 animate-spin" />
                )}
                Revoke Key
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {expiringSoonKeys.length > 0 && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <p className="text-sm font-semibold text-amber-300">
              Expiration alert
            </p>
            <div className="mt-2 space-y-1 text-xs text-amber-200/90">
              {expiringSoonKeys.map(({ key, daysLeft }) => (
                <div key={`expiring-${key.id}`}>
                  {key.name} expires in {daysLeft} days
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredKeys.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No keys match your filters.
          </div>
        ) : (
          filteredKeys.map((key) => {
            const status = getComputedStatus(key);
            const expiresInDays = getExpiresInDays(key);

            return (
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
                        status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : status === 'expired'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : 'bg-muted text-muted-foreground border-border'
                      )}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
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
                  <span
                    className={cn(
                      'text-xs flex items-center gap-1',
                      status === 'expired'
                        ? 'text-rose-400'
                        : 'text-muted-foreground'
                    )}
                  >
                    {key.expiresAt
                      ? status === 'expired'
                        ? `Expired on ${formatDate(key.expiresAt)}`
                        : `Expires on ${formatDate(key.expiresAt)}`
                      : 'Never expires'}
                  </span>
                  {expiresInDays !== null && status === 'active' && expiresInDays <= 7 && (
                    <span className="text-xs text-amber-300">
                      Expires in {expiresInDays} days
                    </span>
                  )}
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
                  <div className="mt-2 text-xs text-muted-foreground">
                    Rate limits: {key.rateLimitPerMinute} req/min ·{' '}
                    {key.rateLimitPerDay.toLocaleString()} req/day
                  </div>
                </div>

                {/* Permissions & Actions */}
                <div className="flex items-center gap-4 self-end md:self-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRotateKey(key)}
                    disabled={rotatingKeyId === key.id}
                  >
                    {rotatingKeyId === key.id && (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    )}
                    Rotate Key
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setPendingRevokeKey(key)}
                    disabled={
                      revokingKeyId === key.id || status === 'revoked'
                    }
                  >
                    {revokingKeyId === key.id && (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    )}
                    Revoke Key
                  </Button>
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

              <div className="mt-4 border-t border-border pt-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Usage analytics
                  </p>
                  <span className="text-xs text-muted-foreground">
                    Sample data
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="rounded-lg border border-border bg-muted/40 p-3">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Requests today
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      {USAGE_SNAPSHOT.requestsToday.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/40 p-3">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Requests this month
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      {USAGE_SNAPSHOT.requestsThisMonth.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/40 p-3">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Error rate
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      {USAGE_SNAPSHOT.errorRate}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/40 p-3">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Average response time
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      {USAGE_SNAPSHOT.averageResponseTime}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="rounded-lg border border-border bg-muted/30 p-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-3">
                      Usage trend
                    </p>
                    <div className="flex items-end gap-2 h-16">
                      {USAGE_SNAPSHOT.trend.map((value, index) => {
                        const max = Math.max(...USAGE_SNAPSHOT.trend);
                        const height = Math.max(6, (value / max) * 100);
                        return (
                          <div
                            key={`${key.id}-trend-${index}`}
                            className="flex-1 rounded-full bg-primary/40"
                            style={{ height: `${height}%` }}
                          />
                        );
                      })}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-3">
                      Top endpoints
                    </p>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      {USAGE_SNAPSHOT.topEndpoints.map((endpoint) => (
                        <div
                          key={`${key.id}-${endpoint.path}`}
                          className="flex items-center justify-between gap-2"
                        >
                          <span className="font-mono text-foreground">
                            {endpoint.path}
                          </span>
                          <span>{endpoint.count.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
          })
        )}
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

          {/* Rate Limits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold">Requests per minute</Label>
              <Input
                type="number"
                min={1}
                value={rateLimitPerMinute}
                onChange={(event) =>
                  setRateLimitPerMinute(Number(event.target.value))
                }
                className="max-w-[220px]"
              />
              <p className="text-xs text-muted-foreground">
                Defaults to 60 requests per minute.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold">Requests per day</Label>
              <Input
                type="number"
                min={1}
                value={rateLimitPerDay}
                onChange={(event) =>
                  setRateLimitPerDay(Number(event.target.value))
                }
                className="max-w-[220px]"
              />
              <p className="text-xs text-muted-foreground">
                Defaults to 10,000 requests per day.
              </p>
            </div>
          </div>

          {/* Origin Restrictions */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <Label className="text-sm font-semibold">Allowed Origins</Label>
              <span className="text-xs text-muted-foreground">
                CORS origin restrictions
              </span>
            </div>
            <div className="flex gap-2">
              <Input
                value={newOrigin}
                onChange={(event) => setNewOrigin(event.target.value)}
                placeholder="https://client.com"
                className="flex-1 font-mono"
              />
              <Button variant="secondary" onClick={handleAddOrigin}>
                Add
              </Button>
            </div>
            {allowedOrigins.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {allowedOrigins.map((origin) => (
                  <div
                    key={origin}
                    className="bg-primary/10 border border-primary/20 text-primary text-xs font-mono px-2 py-1 rounded flex items-center gap-1"
                  >
                    {origin}
                    <button
                      type="button"
                      onClick={() => handleRemoveOrigin(origin)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* IP Restrictions */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <Label className="text-sm font-semibold">IP Restrictions</Label>
              <span className="text-xs text-muted-foreground">
                IPv4/IPv6 supported
              </span>
            </div>
            <div className="flex gap-2">
              <Input
                value={newIp}
                onChange={(event) => setNewIp(event.target.value)}
                placeholder="203.0.113.10 or 2001:db8::1"
                className="flex-1 font-mono"
              />
              <Button variant="secondary" onClick={handleAddIp}>
                Add
              </Button>
            </div>
            {allowedIps.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {allowedIps.map((ip) => (
                  <div
                    key={ip}
                    className="bg-primary/10 border border-primary/20 text-primary text-xs font-mono px-2 py-1 rounded flex items-center gap-1"
                  >
                    {ip}
                    <button
                      type="button"
                      onClick={() => handleRemoveIp(ip)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
