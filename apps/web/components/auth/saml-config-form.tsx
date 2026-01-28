/**
 * SAML Configuration Form Component
 *
 * Story: 1-1-12 Enterprise SSO SAML Configuration
 * Wireframe: enterprise_sso_configuration/code.html (lines 133-213)
 *
 * Features:
 * - General configuration inputs (domain, client ID, secret, discovery URL)
 * - Client secret visibility toggle
 * - Attribute mapping section
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
import { AttributeMappingRow } from './attribute-mapping-row';
import { SamlMetadataDisplay } from './saml-metadata-display';

/**
 * SAML Configuration data structure
 */
export interface SamlConfig {
  authorizedDomain: string;
  clientId: string;
  clientSecret: string;
  discoveryUrl: string;
  attributeMappings: Record<string, string>;
}

/**
 * Validation error structure
 */
interface ValidationErrors {
  authorizedDomain?: string;
  clientId?: string;
  clientSecret?: string;
  discoveryUrl?: string;
}

/**
 * Test connection result
 */
interface TestResult {
  success: boolean;
  message?: string;
}

/**
 * Props for SamlConfigForm component
 */
export interface SamlConfigFormProps {
  /** Initial configuration values */
  initialConfig?: Partial<SamlConfig>;
  /** SP metadata for IdP configuration */
  spMetadata?: {
    acsUrl: string;
    entityId: string;
    metadataUrl?: string;
  };
  /** Callback when testing connection */
  onTestConnection?: (config: SamlConfig) => Promise<TestResult>;
  /** Callback when test succeeds */
  onTestSuccess?: () => void;
  /** Callback when saving configuration */
  onSave?: (config: SamlConfig) => Promise<{ success: boolean; message?: string }>;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Default attribute mappings
 */
const DEFAULT_ATTRIBUTE_MAPPINGS = {
  email: 'user.email',
  firstName: 'user.given_name',
  lastName: 'user.family_name',
  groups: 'user.groups',
};

/**
 * Attribute mapping configuration
 */
const ATTRIBUTE_FIELDS = [
  { attribute: 'email', label: 'Email Address', required: true },
  { attribute: 'firstName', label: 'First Name', required: true },
  { attribute: 'lastName', label: 'Last Name', required: true },
  { attribute: 'groups', label: 'Group Membership', required: false },
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
 * Validate domain format
 */
function isValidDomain(domain: string): boolean {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
}

/**
 * SamlConfigForm Component
 *
 * Main form for configuring SAML-based SSO.
 */
export function SamlConfigForm({
  initialConfig,
  spMetadata,
  onTestConnection,
  onTestSuccess,
  onSave,
  className,
}: SamlConfigFormProps) {
  // Form state
  const [authorizedDomain, setAuthorizedDomain] = React.useState(
    initialConfig?.authorizedDomain ?? ''
  );
  const [clientId, setClientId] = React.useState(initialConfig?.clientId ?? '');
  const [clientSecret, setClientSecret] = React.useState(
    initialConfig?.clientSecret ?? ''
  );
  const [discoveryUrl, setDiscoveryUrl] = React.useState(
    initialConfig?.discoveryUrl ?? ''
  );
  const [attributeMappings, setAttributeMappings] = React.useState<
    Record<string, string>
  >(initialConfig?.attributeMappings ?? DEFAULT_ATTRIBUTE_MAPPINGS);

  // UI state
  const [showSecret, setShowSecret] = React.useState(false);
  const [errors, setErrors] = React.useState<ValidationErrors>({});
  const [isTesting, setIsTesting] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [testResult, setTestResult] = React.useState<TestResult | null>(null);
  const [saveMessage, setSaveMessage] = React.useState<string | null>(null);

  /**
   * Get current config object
   */
  const getConfig = (): SamlConfig => ({
    authorizedDomain,
    clientId,
    clientSecret,
    discoveryUrl,
    attributeMappings,
  });

  /**
   * Validate form
   */
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!authorizedDomain.trim()) {
      newErrors.authorizedDomain = 'Authorized domain is required';
    } else if (!isValidDomain(authorizedDomain)) {
      newErrors.authorizedDomain = 'Please enter a valid domain (e.g., acme.com)';
    }

    if (!clientId.trim()) {
      newErrors.clientId = 'Client ID is required';
    }

    if (!clientSecret.trim()) {
      newErrors.clientSecret = 'Client secret is required';
    }

    if (!discoveryUrl.trim()) {
      newErrors.discoveryUrl = 'Discovery URL is required';
    } else if (!isValidUrl(discoveryUrl)) {
      newErrors.discoveryUrl = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle attribute mapping change
   */
  const handleMappingChange = (attribute: string, value: string) => {
    setAttributeMappings((prev) => ({
      ...prev,
      [attribute]: value,
    }));
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
          message: 'Connection successful! Your IdP configuration is valid.',
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

  return (
    <div className={cn('flex flex-col gap-8', className)}>
      {/* General Configuration Section */}
      <div className="rounded-xl border border-border-dark bg-surface-dark p-8">
        <h3 className="mb-6 text-lg font-bold text-white">General Configuration</h3>

        <div className="flex flex-col gap-6">
          {/* Domain and Client ID Row */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Authorized Domain */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="authorized-domain"
                className="text-sm font-semibold text-text-secondary"
              >
                Authorized Domain
              </label>
              <input
                id="authorized-domain"
                type="text"
                value={authorizedDomain}
                onChange={(e) => setAuthorizedDomain(e.target.value)}
                placeholder="e.g. acme.com"
                className={cn(
                  'rounded-lg border bg-background-dark px-4 py-2.5',
                  'text-white placeholder:text-text-secondary',
                  'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
                  errors.authorizedDomain ? 'border-red-500' : 'border-border-dark'
                )}
              />
              {errors.authorizedDomain && (
                <span className="text-xs text-red-400">
                  {errors.authorizedDomain}
                </span>
              )}
            </div>

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

          {/* Discovery URL */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="discovery-url"
              className="text-sm font-semibold text-text-secondary"
            >
              Discovery URL / Metadata
            </label>
            <input
              id="discovery-url"
              type="text"
              value={discoveryUrl}
              onChange={(e) => setDiscoveryUrl(e.target.value)}
              placeholder="https://example.com/.well-known/openid-configuration"
              className={cn(
                'rounded-lg border bg-background-dark px-4 py-2.5',
                'text-white placeholder:text-text-secondary',
                'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
                errors.discoveryUrl ? 'border-red-500' : 'border-border-dark'
              )}
            />
            {errors.discoveryUrl && (
              <span className="text-xs text-red-400">{errors.discoveryUrl}</span>
            )}
          </div>
        </div>
      </div>

      {/* Attribute Mapping Section */}
      <div className="overflow-hidden rounded-xl border border-border-dark bg-surface-dark">
        <div className="border-b border-border-dark p-6">
          <h3 className="text-lg font-bold text-white">Attribute Mapping</h3>
          <p className="text-sm text-text-secondary">
            Map Identity Provider attributes to Hyyve user fields.
          </p>
        </div>
        <div className="p-0">
          {ATTRIBUTE_FIELDS.map((field) => (
            <AttributeMappingRow
              key={field.attribute}
              attribute={field.attribute}
              label={field.label}
              value={attributeMappings[field.attribute] ?? ''}
              onChange={handleMappingChange}
              required={field.required}
            />
          ))}
        </div>
      </div>

      {/* SP Metadata Display */}
      {spMetadata && (
        <SamlMetadataDisplay
          acsUrl={spMetadata.acsUrl}
          entityId={spMetadata.entityId}
          metadataUrl={spMetadata.metadataUrl}
        />
      )}

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

export default SamlConfigForm;
