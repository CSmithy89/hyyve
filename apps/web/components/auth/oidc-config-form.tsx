/**
 * OIDC Configuration Form Component
 *
 * Story: 1-1-13 Enterprise SSO OIDC Configuration
 * Wireframe: enterprise_sso_configuration
 *
 * Features:
 * - Discovery URL input with auto-discover functionality
 * - Client ID and Client Secret inputs
 * - Scopes configuration (openid, profile, email, groups)
 * - Redirect URI display with copy functionality
 * - Test Connection functionality
 * - Save Configuration functionality
 * - Form validation
 *
 * Design tokens from wireframe:
 * - Background: bg-background-dark (#121121)
 * - Surface: bg-surface-dark (#1b1a31)
 * - Border: border-border-dark (#272546)
 * - Primary: #5048e5
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * OIDC Configuration data structure
 */
export interface OidcConfig {
  discoveryUrl: string;
  clientId: string;
  clientSecret: string;
  scopes: string[];
  customScopes: string;
  tokenEndpointAuthMethod: 'client_secret_basic' | 'client_secret_post';
}

/**
 * Discovery result from OIDC provider
 */
interface DiscoveryResult {
  issuer?: string;
  authorization_endpoint?: string;
  token_endpoint?: string;
  userinfo_endpoint?: string;
  jwks_uri?: string;
}

/**
 * Validation error structure
 */
interface ValidationErrors {
  discoveryUrl?: string;
  clientId?: string;
  clientSecret?: string;
}

/**
 * Test connection result
 */
interface TestResult {
  success: boolean;
  message?: string;
}

/**
 * Props for OidcConfigForm component
 */
export interface OidcConfigFormProps {
  /** Initial configuration values */
  initialConfig?: Partial<OidcConfig>;
  /** Redirect URI for IdP configuration */
  redirectUri?: string;
  /** Callback URL for IdP configuration */
  callbackUrl?: string;
  /** Callback when testing connection */
  onTestConnection?: (config: OidcConfig) => Promise<TestResult>;
  /** Callback when test succeeds */
  onTestSuccess?: () => void;
  /** Callback when saving configuration */
  onSave?: (config: OidcConfig) => Promise<{ success: boolean; message?: string }>;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Standard OIDC scopes
 */
const STANDARD_SCOPES = [
  { id: 'openid', label: 'openid', description: 'Required for OIDC', required: true },
  { id: 'profile', label: 'profile', description: 'User profile information' },
  { id: 'email', label: 'email', description: 'User email address' },
  { id: 'groups', label: 'groups', description: 'Group membership (if supported)' },
  { id: 'offline_access', label: 'offline_access', description: 'Refresh token access' },
];

/**
 * Token endpoint auth methods
 */
const AUTH_METHODS = [
  { value: 'client_secret_basic', label: 'Client Secret Basic (HTTP Basic Auth)' },
  { value: 'client_secret_post', label: 'Client Secret Post (Form Body)' },
];

/**
 * Validate URL format
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * OidcConfigForm Component
 *
 * Main form for configuring OIDC-based SSO.
 */
export function OidcConfigForm({
  initialConfig,
  redirectUri = 'https://hyyve.app/api/oidc/callback',
  callbackUrl = 'https://hyyve.app/api/oidc/callback',
  onTestConnection,
  onTestSuccess,
  onSave,
  className,
}: OidcConfigFormProps) {
  // Form state
  const [discoveryUrl, setDiscoveryUrl] = React.useState(
    initialConfig?.discoveryUrl ?? ''
  );
  const [clientId, setClientId] = React.useState(initialConfig?.clientId ?? '');
  const [clientSecret, setClientSecret] = React.useState(
    initialConfig?.clientSecret ?? ''
  );
  const [scopes, setScopes] = React.useState<string[]>(
    initialConfig?.scopes ?? ['openid']
  );
  const [customScopes, setCustomScopes] = React.useState(
    initialConfig?.customScopes ?? ''
  );
  const [authMethod, setAuthMethod] = React.useState<'client_secret_basic' | 'client_secret_post'>(
    initialConfig?.tokenEndpointAuthMethod ?? 'client_secret_basic'
  );

  // UI state
  const [showSecret, setShowSecret] = React.useState(false);
  const [errors, setErrors] = React.useState<ValidationErrors>({});
  const [isDiscovering, setIsDiscovering] = React.useState(false);
  const [discoveryResult, setDiscoveryResult] = React.useState<DiscoveryResult | null>(null);
  const [discoveryError, setDiscoveryError] = React.useState<string | null>(null);
  const [isTesting, setIsTesting] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [testResult, setTestResult] = React.useState<TestResult | null>(null);
  const [saveMessage, setSaveMessage] = React.useState<string | null>(null);
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  /**
   * Get current config object
   */
  const getConfig = (): OidcConfig => ({
    discoveryUrl,
    clientId,
    clientSecret,
    scopes,
    customScopes,
    tokenEndpointAuthMethod: authMethod,
  });

  /**
   * Validate form
   */
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!discoveryUrl.trim()) {
      newErrors.discoveryUrl = 'Discovery URL is required';
    } else if (!isValidUrl(discoveryUrl)) {
      newErrors.discoveryUrl = 'Please enter a valid URL';
    }

    if (!clientId.trim()) {
      newErrors.clientId = 'Client ID is required';
    }

    if (!clientSecret.trim()) {
      newErrors.clientSecret = 'Client secret is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle scope toggle
   */
  const handleScopeToggle = (scopeId: string) => {
    setScopes((prev) =>
      prev.includes(scopeId)
        ? prev.filter((s) => s !== scopeId)
        : [...prev, scopeId]
    );
  };

  /**
   * Handle discovery
   */
  const handleDiscover = async () => {
    if (!discoveryUrl.trim()) {
      setDiscoveryError('Please enter a discovery URL');
      return;
    }

    if (!isValidUrl(discoveryUrl)) {
      setDiscoveryError('Please enter a valid URL');
      return;
    }

    setIsDiscovering(true);
    setDiscoveryError(null);
    setDiscoveryResult(null);

    try {
      const response = await fetch(discoveryUrl);

      if (!response.ok) {
        throw new Error(`Discovery failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setDiscoveryResult(result);
    } catch (error) {
      setDiscoveryError(
        error instanceof Error
          ? error.message
          : 'Failed to fetch discovery document. Please check the URL.'
      );
    } finally {
      setIsDiscovering(false);
    }
  };

  /**
   * Handle test connection
   */
  const handleTestConnection = async () => {
    if (!validateForm()) return;

    setIsTesting(true);
    setTestResult(null);

    try {
      if (onTestConnection) {
        const result = await onTestConnection(getConfig());
        setTestResult(result);
        if (result.success) {
          onTestSuccess?.();
        }
      } else {
        // Mock test for demo
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setTestResult({
          success: true,
          message: 'Connection successful! Your OIDC configuration is valid.',
        });
        onTestSuccess?.();
      }
    } catch (error) {
      setTestResult({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Connection failed. Please check your configuration.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  /**
   * Handle save configuration
   */
  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      if (onSave) {
        const result = await onSave(getConfig());
        if (result.success) {
          setSaveMessage('Configuration saved successfully!');
        } else {
          setSaveMessage(result.message ?? 'Failed to save configuration.');
        }
      } else {
        // Mock save for demo
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSaveMessage('Configuration saved successfully!');
      }
    } catch (error) {
      setSaveMessage(
        error instanceof Error
          ? error.message
          : 'Failed to save configuration. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Handle copy to clipboard
   */
  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Silent fail
    }
  };

  return (
    <div className={cn('flex flex-col gap-8', className)}>
      {/* General Configuration Section */}
      <div className="rounded-xl border border-border-dark bg-surface-dark p-8">
        <h3 className="mb-6 text-lg font-bold text-white">OIDC Configuration</h3>

        <div className="flex flex-col gap-6">
          {/* Discovery URL with Discover Button */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="discovery-url"
              className="text-sm font-semibold text-text-secondary"
            >
              Discovery URL
            </label>
            <div className="flex gap-2">
              <input
                id="discovery-url"
                type="text"
                value={discoveryUrl}
                onChange={(e) => setDiscoveryUrl(e.target.value)}
                placeholder="https://example.com/.well-known/openid-configuration"
                className={cn(
                  'flex-1 rounded-lg border bg-background-dark px-4 py-2.5',
                  'text-white placeholder:text-text-secondary',
                  'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
                  errors.discoveryUrl ? 'border-red-500' : 'border-border-dark'
                )}
              />
              <button
                type="button"
                onClick={handleDiscover}
                disabled={isDiscovering}
                aria-busy={isDiscovering}
                className={cn(
                  'flex items-center gap-2 rounded-lg border border-border-dark px-4 py-2.5',
                  'font-semibold text-white transition-all hover:bg-white/5',
                  'focus:outline-none focus:ring-2 focus:ring-border-dark',
                  isDiscovering && 'cursor-not-allowed opacity-70'
                )}
              >
                {isDiscovering ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-lg">
                      progress_activity
                    </span>
                    Discovering...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">search</span>
                    Discover
                  </>
                )}
              </button>
            </div>
            {errors.discoveryUrl && (
              <span className="text-xs text-red-400">{errors.discoveryUrl}</span>
            )}
            {discoveryError && (
              <span className="text-xs text-red-400">{discoveryError}</span>
            )}
          </div>

          {/* Discovery Result */}
          {discoveryResult && (
            <div
              data-testid="discovery-result"
              className="rounded-lg border border-green-500/30 bg-green-500/10 p-4"
            >
              <div className="mb-2 flex items-center gap-2 text-green-400">
                <span className="material-symbols-outlined text-lg">check_circle</span>
                <span className="font-semibold">Discovery Successful</span>
              </div>
              <div className="grid gap-2 text-sm">
                {discoveryResult.issuer && (
                  <div data-testid="issuer" className="flex justify-between">
                    <span className="text-text-secondary">Issuer:</span>
                    <span className="text-white">{discoveryResult.issuer}</span>
                  </div>
                )}
                {discoveryResult.authorization_endpoint && (
                  <div data-testid="authorization-endpoint" className="flex justify-between">
                    <span className="text-text-secondary">Auth Endpoint:</span>
                    <span className="truncate text-white">
                      {discoveryResult.authorization_endpoint}
                    </span>
                  </div>
                )}
                {discoveryResult.token_endpoint && (
                  <div data-testid="token-endpoint" className="flex justify-between">
                    <span className="text-text-secondary">Token Endpoint:</span>
                    <span className="truncate text-white">
                      {discoveryResult.token_endpoint}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Client ID and Secret Row */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Client ID */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="client-id"
                className="text-sm font-semibold text-text-secondary"
              >
                Client ID
              </label>
              <input
                id="client-id"
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Enter provider Client ID"
                className={cn(
                  'rounded-lg border bg-background-dark px-4 py-2.5',
                  'text-white placeholder:text-text-secondary',
                  'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
                  errors.clientId ? 'border-red-500' : 'border-border-dark'
                )}
              />
              {errors.clientId && (
                <span className="text-xs text-red-400">{errors.clientId}</span>
              )}
            </div>

            {/* Client Secret */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="client-secret"
                className="text-sm font-semibold text-text-secondary"
              >
                Client Secret
              </label>
              <div className="relative flex items-center">
                <input
                  id="client-secret"
                  type={showSecret ? 'text' : 'password'}
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  placeholder="Enter provider Client Secret"
                  className={cn(
                    'w-full rounded-lg border bg-background-dark px-4 py-2.5 pr-12',
                    'text-white placeholder:text-text-secondary',
                    'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
                    errors.clientSecret ? 'border-red-500' : 'border-border-dark'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  data-testid="toggle-secret-visibility"
                  className="absolute right-4 text-text-secondary transition-colors hover:text-white"
                  aria-label={showSecret ? 'Hide secret' : 'Show secret'}
                >
                  <span className="material-symbols-outlined">
                    {showSecret ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {errors.clientSecret && (
                <span className="text-xs text-red-400">{errors.clientSecret}</span>
              )}
            </div>
          </div>

          {/* Token Endpoint Auth Method */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="auth-method"
              className="text-sm font-semibold text-text-secondary"
            >
              Token Endpoint Authentication Method
            </label>
            <select
              id="auth-method"
              value={authMethod}
              onChange={(e) =>
                setAuthMethod(e.target.value as 'client_secret_basic' | 'client_secret_post')
              }
              className={cn(
                'rounded-lg border border-border-dark bg-background-dark px-4 py-2.5',
                'text-white',
                'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
              )}
            >
              {AUTH_METHODS.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Scopes Section */}
      <div className="rounded-xl border border-border-dark bg-surface-dark p-8">
        <h3 className="mb-2 text-lg font-bold text-white">Scopes</h3>
        <p className="mb-6 text-sm text-text-secondary">
          Select the OIDC scopes to request from the identity provider.
        </p>

        <div className="flex flex-col gap-4">
          {STANDARD_SCOPES.map((scope) => (
            <label
              key={scope.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-white/5"
            >
              <input
                type="checkbox"
                checked={scopes.includes(scope.id)}
                onChange={() => handleScopeToggle(scope.id)}
                disabled={scope.required}
                className={cn(
                  'size-5 rounded border-2 border-border-dark bg-background-dark',
                  'checked:border-primary checked:bg-primary',
                  'focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark',
                  scope.required && 'cursor-not-allowed opacity-70'
                )}
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">
                  {scope.label}
                  {scope.required && (
                    <span className="ml-2 text-xs text-primary">(required)</span>
                  )}
                </span>
                <span className="text-xs text-text-secondary">{scope.description}</span>
              </div>
            </label>
          ))}

          {/* Custom Scopes */}
          <div className="mt-4 flex flex-col gap-2">
            <label
              htmlFor="custom-scopes"
              className="text-sm font-semibold text-text-secondary"
            >
              Custom Scopes
            </label>
            <input
              id="custom-scopes"
              type="text"
              value={customScopes}
              onChange={(e) => setCustomScopes(e.target.value)}
              placeholder="Enter custom scopes (space-separated)"
              className={cn(
                'rounded-lg border border-border-dark bg-background-dark px-4 py-2.5',
                'text-white placeholder:text-text-secondary',
                'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
              )}
            />
            <span className="text-xs text-text-secondary">
              Add any additional scopes required by your identity provider.
            </span>
          </div>
        </div>
      </div>

      {/* Redirect URI Section */}
      <div
        data-testid="redirect-uri-section"
        className="rounded-xl border border-border-dark bg-surface-dark p-8"
      >
        <h3 className="mb-2 text-lg font-bold text-white">Redirect URIs</h3>
        <p className="mb-6 text-sm text-text-secondary">
          Configure these URIs in your identity provider.
        </p>

        <div className="flex flex-col gap-4">
          {/* Redirect URI */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-text-secondary">Redirect URI</span>
            <div className="flex items-center gap-2">
              <div
                data-testid="redirect-uri"
                className="flex-1 rounded-lg border border-border-dark bg-background-dark px-4 py-2.5 font-mono text-sm text-white"
              >
                {redirectUri}
              </div>
              <button
                type="button"
                data-testid="copy-redirect-uri"
                onClick={() => handleCopy(redirectUri, 'redirect')}
                className={cn(
                  'flex items-center gap-2 rounded-lg border border-border-dark px-3 py-2.5',
                  'text-text-secondary transition-all hover:bg-white/5 hover:text-white'
                )}
              >
                <span className="material-symbols-outlined text-lg">
                  {copiedField === 'redirect' ? 'check' : 'content_copy'}
                </span>
                {copiedField === 'redirect' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Callback URL */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-text-secondary">Callback URL</span>
            <div className="flex items-center gap-2">
              <div
                data-testid="callback-url"
                className="flex-1 rounded-lg border border-border-dark bg-background-dark px-4 py-2.5 font-mono text-sm text-white"
              >
                {callbackUrl}
              </div>
              <button
                type="button"
                data-testid="copy-callback-url"
                onClick={() => handleCopy(callbackUrl, 'callback')}
                className={cn(
                  'flex items-center gap-2 rounded-lg border border-border-dark px-3 py-2.5',
                  'text-text-secondary transition-all hover:bg-white/5 hover:text-white'
                )}
              >
                <span className="material-symbols-outlined text-lg">
                  {copiedField === 'callback' ? 'check' : 'content_copy'}
                </span>
                {copiedField === 'callback' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Test Result */}
      {testResult && (
        <div
          data-testid={testResult.success ? 'test-result-success' : 'test-result-error'}
          className={cn(
            'flex items-center gap-3 rounded-lg p-4',
            testResult.success
              ? 'bg-green-500/10 text-green-400'
              : 'bg-red-500/10 text-red-400'
          )}
        >
          <span className="material-symbols-outlined">
            {testResult.success ? 'check_circle' : 'error'}
          </span>
          <span className="text-sm">{testResult.message}</span>
        </div>
      )}

      {/* Save Message */}
      {saveMessage && (
        <div
          className={cn(
            'flex items-center gap-3 rounded-lg p-4',
            saveMessage.includes('success')
              ? 'bg-green-500/10 text-green-400'
              : 'bg-red-500/10 text-red-400'
          )}
        >
          <span className="material-symbols-outlined">
            {saveMessage.includes('success') ? 'check_circle' : 'error'}
          </span>
          <span className="text-sm">{saveMessage}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 pb-12">
        <button
          type="button"
          onClick={handleTestConnection}
          disabled={isTesting}
          aria-busy={isTesting}
          className={cn(
            'flex items-center gap-2 rounded-lg border border-border-dark px-6 py-2.5',
            'font-semibold text-white transition-all hover:bg-white/5',
            'focus:outline-none focus:ring-2 focus:ring-border-dark focus:ring-offset-2 focus:ring-offset-background-dark',
            isTesting && 'cursor-not-allowed opacity-70'
          )}
        >
          {isTesting ? (
            <>
              <span className="material-symbols-outlined animate-spin text-lg">
                progress_activity
              </span>
              Testing...
            </>
          ) : (
            'Test Connection'
          )}
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          aria-busy={isSaving}
          className={cn(
            'flex items-center gap-2 rounded-lg bg-primary px-8 py-2.5',
            'font-bold text-white shadow-lg shadow-primary/20 transition-all',
            'hover:bg-primary/90',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark',
            isSaving && 'cursor-not-allowed opacity-70'
          )}
        >
          {isSaving ? (
            <>
              <span className="material-symbols-outlined animate-spin text-lg">
                progress_activity
              </span>
              Saving...
            </>
          ) : (
            'Save Configuration'
          )}
        </button>
      </div>
    </div>
  );
}

export default OidcConfigForm;
