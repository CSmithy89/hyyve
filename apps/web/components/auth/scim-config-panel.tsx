/**
 * SCIM Configuration Panel Component
 *
 * Story: 1-1-14 SCIM User Provisioning
 * Wireframe: team_&_permissions_management, org_hierarchy_manager
 *
 * Features:
 * - Enable/disable SCIM toggle
 * - SCIM endpoint URL display with copy
 * - Bearer token display with show/hide toggle
 * - Token regeneration with confirmation dialog
 * - Copy-to-clipboard functionality
 *
 * Design tokens: bg-background-dark (#131221), border-[#272546], text-[#9795c6]
 */

'use client';

import * as React from 'react';

/**
 * ScimConfigPanel Props
 */
export interface ScimConfigPanelProps {
  /** Whether SCIM is enabled */
  enabled?: boolean;
  /** SCIM endpoint URL */
  scimEndpoint?: string;
  /** Bearer token for SCIM authentication */
  bearerToken?: string;
  /** Callback when toggle is changed */
  onToggle?: (enabled: boolean) => void;
  /** Callback when token regeneration is requested */
  onRegenerateToken?: () => Promise<{ token: string }>;
  /** Additional class names */
  className?: string;
}

/**
 * SCIM Configuration Panel Component
 *
 * Provides SCIM provisioning configuration interface for enterprise admins.
 */
export function ScimConfigPanel({
  enabled = false,
  scimEndpoint = 'https://api.hyyve.com/scim/v2',
  bearerToken = '',
  onToggle,
  onRegenerateToken,
  className = '',
}: ScimConfigPanelProps) {
  // State
  const [isEnabled, setIsEnabled] = React.useState(enabled);
  const [tokenVisible, setTokenVisible] = React.useState(false);
  const [showRegenerateDialog, setShowRegenerateDialog] = React.useState(false);
  const [isRegenerating, setIsRegenerating] = React.useState(false);
  const [copyFeedback, setCopyFeedback] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  // Update internal state when prop changes
  React.useEffect(() => {
    setIsEnabled(enabled);
  }, [enabled]);

  /**
   * Handle SCIM toggle
   */
  const handleToggle = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    onToggle?.(newValue);
  };

  /**
   * Copy text to clipboard
   */
  const copyToClipboard = async (text: string, type: 'endpoint' | 'token') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(type);
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  /**
   * Handle token regeneration
   */
  const handleRegenerateConfirm = async () => {
    setIsRegenerating(true);
    try {
      await onRegenerateToken?.();
      setSuccessMessage('Token regenerated successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to regenerate token:', err);
    } finally {
      setIsRegenerating(false);
      setShowRegenerateDialog(false);
    }
  };

  /**
   * Mask token for display
   */
  const getMaskedToken = () => {
    if (!bearerToken) return '';
    if (tokenVisible) return bearerToken;
    // Show first 8 chars and mask the rest
    const prefix = bearerToken.slice(0, 8);
    return `${prefix}${'•'.repeat(Math.max(0, bearerToken.length - 8))}`;
  };

  return (
    <div
      data-testid="scim-config-panel"
      className={`flex flex-col gap-8 bg-background-dark ${className}`}
    >
      {/* Success Message */}
      {successMessage && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-400 text-sm">
          {successMessage}
        </div>
      )}

      {/* SCIM Status Card */}
      <div
        data-testid="scim-status-card"
        className="rounded-xl border border-[#383663] bg-[#1e1c36] p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/20 p-3 text-primary">
              <span className="material-symbols-outlined">sync</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">SCIM Provisioning</h2>
              <p className="text-sm text-[#9795c6]">
                {isEnabled
                  ? 'Users are automatically synced from your identity provider'
                  : 'Enable to automatically sync users from your IdP'}
              </p>
            </div>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              role="switch"
              aria-label="Enable SCIM provisioning"
              aria-checked={isEnabled}
              checked={isEnabled}
              onChange={handleToggle}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-[#383663] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rtl:peer-checked:after:-translate-x-full"></div>
          </label>
        </div>
      </div>

      {/* SCIM Endpoint Section */}
      <div data-testid="scim-endpoint-section" className="flex flex-col gap-3">
        <div className="flex items-center gap-2 px-1">
          <span className="material-symbols-outlined text-primary">link</span>
          <h3 className="text-lg font-bold text-white">SCIM Endpoint</h3>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-[#383663] bg-[#131221] p-4">
          <code
            data-testid="scim-endpoint-url"
            className="flex-1 truncate font-mono text-sm text-[#9795c6]"
          >
            {scimEndpoint}
          </code>
          <button
            type="button"
            data-testid="copy-scim-endpoint"
            aria-label="Copy SCIM endpoint URL"
            onClick={() => copyToClipboard(scimEndpoint, 'endpoint')}
            className="flex items-center gap-2 rounded-lg border border-[#383663] px-3 py-1.5 text-sm font-medium text-[#9795c6] transition-colors hover:bg-[#272546] hover:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <span className="material-symbols-outlined text-lg">
              {copyFeedback === 'endpoint' ? 'check' : 'content_copy'}
            </span>
            {copyFeedback === 'endpoint' ? 'Copied' : 'Copy'}
          </button>
        </div>
        <p className="px-1 text-xs text-[#9795c6]">
          Configure this endpoint in your identity provider&apos;s SCIM settings.
        </p>
      </div>

      {/* Bearer Token Section */}
      <div data-testid="scim-token-section" className="flex flex-col gap-3">
        <div className="flex items-center gap-2 px-1">
          <span className="material-symbols-outlined text-primary">key</span>
          <h3 className="text-lg font-bold text-white">Bearer Token</h3>
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-[#383663] bg-[#131221] p-4">
          <div className="flex items-center gap-3">
            <code
              data-testid="scim-bearer-token"
              data-masked={!tokenVisible}
              className="flex-1 truncate font-mono text-sm text-[#9795c6]"
            >
              {getMaskedToken()}
            </code>
            <button
              type="button"
              aria-label={tokenVisible ? 'Hide token' : 'Show token'}
              onClick={() => setTokenVisible(!tokenVisible)}
              className="flex items-center justify-center rounded-lg border border-[#383663] p-1.5 text-[#9795c6] transition-colors hover:bg-[#272546] hover:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <span className="material-symbols-outlined text-lg">
                {tokenVisible ? 'visibility_off' : 'visibility'}
              </span>
            </button>
            <button
              type="button"
              data-testid="copy-scim-token"
              aria-label="Copy bearer token"
              onClick={() => copyToClipboard(bearerToken, 'token')}
              className="flex items-center gap-2 rounded-lg border border-[#383663] px-3 py-1.5 text-sm font-medium text-[#9795c6] transition-colors hover:bg-[#272546] hover:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <span className="material-symbols-outlined text-lg">
                {copyFeedback === 'token' ? 'check' : 'content_copy'}
              </span>
              {copyFeedback === 'token' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="flex items-center justify-between border-t border-[#383663] pt-3">
            <p className="text-xs text-[#9795c6]">
              Use this token to authenticate SCIM requests from your IdP.
            </p>
            <button
              type="button"
              onClick={() => setShowRegenerateDialog(true)}
              className="flex items-center gap-2 rounded-lg border border-amber-500/30 px-3 py-1.5 text-sm font-medium text-amber-400 transition-colors hover:bg-amber-500/10 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              <span className="material-symbols-outlined text-lg">refresh</span>
              Regenerate Token
            </button>
          </div>
        </div>
      </div>

      {/* Regenerate Token Confirmation Dialog */}
      {showRegenerateDialog && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="regenerate-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        >
          <div className="w-full max-w-md rounded-xl border border-[#383663] bg-[#1e1c36] p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-amber-500/20 p-2 text-amber-400">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <h3
                id="regenerate-dialog-title"
                className="text-lg font-bold text-white"
              >
                Regenerate Token
              </h3>
            </div>
            <p className="mb-6 text-sm text-[#9795c6]">
              This will invalidate the current token and break any existing SCIM
              integrations. You&apos;ll need to update your identity provider with
              the new token.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowRegenerateDialog(false)}
                disabled={isRegenerating}
                className="rounded-lg border border-[#383663] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#272546] focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRegenerateConfirm}
                disabled={isRegenerating}
                aria-busy={isRegenerating}
                className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50"
              >
                {isRegenerating ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-lg">
                      progress_activity
                    </span>
                    Regenerating...
                  </>
                ) : (
                  'Confirm Regenerate'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
