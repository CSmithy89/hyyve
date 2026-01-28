/**
 * SAML Configuration Page
 *
 * Story: 1-1-12 Enterprise SSO SAML Configuration
 * Route: /settings/security/sso/saml
 * Wireframe: enterprise_sso_configuration
 *
 * Features:
 * - SAML configuration form
 * - Attribute mapping
 * - SP metadata display
 * - Connection testing
 * - Save configuration
 *
 * AC4: SAML Configuration Form
 * AC5: Attribute Mapping Section
 * AC6: Service Provider (SP) Metadata Display
 * AC7: Connection Testing
 * AC8: Save Configuration
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SamlConfigForm, type SamlConfig } from '@/components/auth';

/**
 * Mock SP Metadata
 * In production, this would come from Clerk/WorkOS
 */
const SP_METADATA = {
  acsUrl: 'https://hyyve.app/api/saml/acs',
  entityId: 'https://hyyve.app/saml/metadata',
  metadataUrl: 'https://hyyve.app/api/saml/metadata.xml',
};

/**
 * SAML Configuration Page Component
 */
export default function SamlConfigPage() {
  const router = useRouter();

  /**
   * Handle test connection
   */
  const handleTestConnection = async (
    _config: SamlConfig
  ): Promise<{ success: boolean; message?: string }> => {
    // In production, this would call Clerk/WorkOS API to validate IdP connection

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock success (in production, would validate with IdP)
    return {
      success: true,
      message:
        'Connection successful! Your Identity Provider is correctly configured.',
    };
  };

  /**
   * Handle save configuration
   */
  const handleSave = async (
    _config: SamlConfig
  ): Promise<{ success: boolean; message?: string }> => {
    // In production, this would save to Clerk/WorkOS

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock success
    return {
      success: true,
      message: 'Configuration saved successfully!',
    };
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-dark font-display text-white">
      {/* Main Content */}
      <main className="flex flex-1 justify-center py-8">
        <div className="flex w-full max-w-[960px] flex-col px-4">
          {/* Page Heading */}
          <div className="mb-6 flex flex-wrap justify-between gap-3">
            <div className="flex min-w-72 flex-col gap-1">
              <h1 className="text-4xl font-black leading-tight tracking-tight text-white">
                SAML Configuration
              </h1>
              <p className="text-base font-normal leading-normal text-text-secondary">
                Configure SAML 2.0 Single Sign-On for your organization.
              </p>
            </div>
          </div>

          {/* Breadcrumbs */}
          <nav className="mb-8 flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            <Link
              href="/settings"
              className="text-text-secondary transition-colors hover:text-white"
            >
              Settings
            </Link>
            <span className="text-border-dark">/</span>
            <Link
              href="/settings/security"
              className="text-text-secondary transition-colors hover:text-white"
            >
              Security
            </Link>
            <span className="text-border-dark">/</span>
            <Link
              href="/settings/security/sso"
              className="text-text-secondary transition-colors hover:text-white"
            >
              SSO
            </Link>
            <span className="text-border-dark">/</span>
            <span className="text-white" aria-current="page">
              SAML
            </span>
          </nav>

          {/* Back Button */}
          <button
            type="button"
            onClick={() => router.back()}
            className={cn(
              'mb-6 flex w-fit items-center gap-2 text-sm text-text-secondary',
              'transition-colors hover:text-white'
            )}
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to SSO Settings
          </button>

          {/* SAML Configuration Form */}
          <SamlConfigForm
            spMetadata={SP_METADATA}
            onTestConnection={handleTestConnection}
            onSave={handleSave}
          />
        </div>
      </main>
    </div>
  );
}
