/**
 * SAML Metadata Display Component
 *
 * Story: 1-1-12 Enterprise SSO SAML Configuration
 *
 * Features:
 * - Display Service Provider (SP) metadata for IdP configuration
 * - ACS URL display with copy functionality
 * - Entity ID display with copy functionality
 * - Download metadata XML button
 *
 * Design tokens from wireframe:
 * - Surface: bg-surface-dark (#1b1a31)
 * - Border: border-border-dark (#272546)
 * - Primary: #5048e5
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for SamlMetadataDisplay component
 */
export interface SamlMetadataDisplayProps {
  /** Assertion Consumer Service URL */
  acsUrl: string;
  /** SP Entity ID */
  entityId: string;
  /** URL to download metadata XML */
  metadataUrl?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * MetadataField Component
 *
 * Individual field display with copy functionality.
 */
function MetadataField({
  label,
  value,
  testId,
}: {
  label: string;
  value: string;
  testId: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-text-secondary">{label}</label>
      <div className="flex items-center gap-2">
        <div
          data-testid={testId}
          className={cn(
            'flex-1 overflow-hidden rounded-lg border border-border-dark bg-background-dark px-4 py-2.5',
            'text-sm text-white'
          )}
        >
          <span className="block truncate">{value}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          data-testid={`copy-${testId.replace('-url', '-url').replace('-id', '-id')}`}
          className={cn(
            'flex size-10 items-center justify-center rounded-lg',
            'border border-border-dark bg-surface-dark',
            'transition-all hover:bg-border-dark',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark'
          )}
          aria-label={`Copy ${label}`}
        >
          <span className="material-symbols-outlined text-lg text-text-secondary">
            {copied ? 'check' : 'content_copy'}
          </span>
        </button>
      </div>
      {copied && (
        <span className="text-xs text-green-400">Copied to clipboard!</span>
      )}
    </div>
  );
}

/**
 * SamlMetadataDisplay Component
 *
 * Displays Service Provider (SP) metadata that enterprise
 * administrators need to configure in their Identity Provider.
 */
export function SamlMetadataDisplay({
  acsUrl,
  entityId,
  metadataUrl,
  className,
}: SamlMetadataDisplayProps) {
  const handleDownloadMetadata = () => {
    if (metadataUrl) {
      window.open(metadataUrl, '_blank');
    }
  };

  return (
    <div
      data-testid="sp-metadata"
      className={cn(
        'rounded-xl border border-border-dark bg-surface-dark p-6',
        className
      )}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">
            Service Provider Metadata
          </h3>
          <p className="text-sm text-text-secondary">
            Use these values to configure Hyyve in your Identity Provider.
          </p>
        </div>

        {metadataUrl && (
          <button
            type="button"
            onClick={handleDownloadMetadata}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2',
              'border border-border-dark bg-background-dark text-sm font-medium text-white',
              'transition-all hover:bg-border-dark',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark'
            )}
          >
            <span className="material-symbols-outlined text-lg">download</span>
            Download Metadata XML
          </button>
        )}
      </div>

      {/* Metadata Fields */}
      <div className="flex flex-col gap-6">
        <MetadataField
          label="ACS URL (Assertion Consumer Service)"
          value={acsUrl}
          testId="acs-url"
        />
        <MetadataField
          label="Entity ID (Audience URI)"
          value={entityId}
          testId="entity-id"
        />
      </div>

      {/* Info Box */}
      <div className="mt-6 flex items-start gap-3 rounded-lg bg-blue-500/10 p-4">
        <span className="material-symbols-outlined text-blue-400">info</span>
        <div className="flex-1">
          <p className="text-sm text-blue-200">
            Copy these values and paste them into your Identity Provider&apos;s
            SAML application configuration. The ACS URL is where SAML assertions
            will be sent, and the Entity ID uniquely identifies Hyyve as a
            Service Provider.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SamlMetadataDisplay;
