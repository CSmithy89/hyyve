/**
 * OIDC Configuration Page
 *
 * Story: 1-1-13 Enterprise SSO OIDC Configuration
 * Route: /settings/security/sso/oidc
 * Wireframe: enterprise_sso_configuration
 *
 * Features:
 * - OIDC configuration form
 * - Discovery URL with auto-discover
 * - Scopes configuration
 * - Redirect URI display
 * - Connection testing
 * - Save configuration
 *
 * AC1: Access OIDC Configuration from SSO Settings
 * AC2: OIDC Configuration Form
 * AC3: Auto-Discovery Feature
 * AC4: Scopes Configuration
 * AC5: Redirect URI Display
 * AC6: Connection Testing
 * AC7: Save Configuration
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { OidcConfigForm, type OidcConfig } from '@/components/auth';

/**
 * Mock Redirect URIs
 * In production, these would come from Clerk/WorkOS
 */
const REDIRECT_URIS = {
  redirectUri: 'https://hyyve.app/api/oidc/callback',
  callbackUrl: 'https://hyyve.app/api/oidc/callback',
};

/**
 * OIDC Configuration Page Component
 */
export default function OidcConfigPage() {
  const router = useRouter();

  /**
   * Handle test connection
   */
  const handleTestConnection = async (
    _config: OidcConfig
  ): Promise<{ success: boolean; message?: string }> => {
    // In production, this would call Clerk/WorkOS API to validate OIDC connection

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock success (in production, would validate with IdP)
    return {
      success: true,
      message:
        'Connection successful! Your OIDC provider is correctly configured.',
    };
  };

  /**
   * Handle save configuration
   */
  const handleSave = async (
    _config: OidcConfig
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
                OIDC Configuration
              </h1>
              <p className="text-base font-normal leading-normal text-text-secondary">
                Configure OpenID Connect Single Sign-On for your organization.
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
              OIDC
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

          {/* Info Box */}
          <div className="mb-8 rounded-xl border border-primary/30 bg-primary/10 p-6">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-2xl text-primary">info</span>
              <div>
                <h3 className="mb-1 font-bold text-white">OpenID Connect (OIDC)</h3>
                <p className="text-sm text-text-secondary">
                  OIDC is built on top of OAuth 2.0 and provides identity verification.
                  Most modern identity providers support OIDC, including Google, Microsoft,
                  Okta, Auth0, and many others. Use the discovery URL to automatically
                  configure your connection.
                </p>
              </div>
            </div>
          </div>

          {/* OIDC Configuration Form */}
          <OidcConfigForm
            redirectUri={REDIRECT_URIS.redirectUri}
            callbackUrl={REDIRECT_URIS.callbackUrl}
            onTestConnection={handleTestConnection}
            onSave={handleSave}
          />
        </div>
      </main>
    </div>
  );
}
