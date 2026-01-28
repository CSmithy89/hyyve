/**
 * SSO Settings Page
 *
 * Story: 1-1-12 Enterprise SSO SAML Configuration
 * Route: /settings/security/sso
 * Wireframe: enterprise_sso_configuration
 *
 * Features:
 * - SSO status toggle
 * - Identity Provider selection
 * - Navigation to SAML/OIDC configuration
 *
 * AC1: Access SSO Configuration from Security Settings
 * AC2: Display Identity Provider Selection
 * AC3: SSO Status Toggle
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  SsoConnectionCard,
  IdpProviderCard,
  type IdpProvider,
} from '@/components/auth';

/**
 * Identity Provider configurations
 */
const IDP_PROVIDERS = [
  { provider: 'okta' as IdpProvider, name: 'Okta', icon: 'verified_user' },
  { provider: 'azure' as IdpProvider, name: 'Azure AD', icon: 'cloud' },
  { provider: 'google' as IdpProvider, name: 'Google', icon: 'account_circle' },
  { provider: 'saml' as IdpProvider, name: 'SAML 2.0', icon: 'vpn_key' },
];

/**
 * SSO Settings Page Component
 */
export default function SsoSettingsPage() {
  const router = useRouter();

  // State
  const [ssoEnabled, setSsoEnabled] = React.useState(false);
  const [selectedProvider, setSelectedProvider] = React.useState<IdpProvider | null>(
    null
  );

  /**
   * Handle SSO toggle
   */
  const handleSsoToggle = (enabled: boolean) => {
    setSsoEnabled(enabled);
  };

  /**
   * Handle provider selection
   */
  const handleProviderSelect = (provider: IdpProvider) => {
    setSelectedProvider(provider);
    // Navigate to SAML configuration (all providers use SAML in this implementation)
    router.push('/settings/security/sso/saml');
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
                Enterprise SSO
              </h1>
              <p className="text-base font-normal leading-normal text-text-secondary">
                Configure Single Sign-On for your organization to manage access at
                scale.
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
            <span className="text-white" aria-current="page">
              SSO
            </span>
          </nav>

          {/* SSO Status Card */}
          <div className="mb-8">
            <SsoConnectionCard enabled={ssoEnabled} onToggle={handleSsoToggle} />
          </div>

          {/* Identity Provider Selection */}
          <h2 className="mb-4 text-xl font-bold leading-tight tracking-tight text-white">
            Identity Provider
          </h2>
          <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {IDP_PROVIDERS.map((idp) => (
              <IdpProviderCard
                key={idp.provider}
                provider={idp.provider}
                name={idp.name}
                icon={idp.icon}
                selected={selectedProvider === idp.provider}
                onSelect={handleProviderSelect}
              />
            ))}
          </div>

          {/* Info Box */}
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-6">
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-blue-400">info</span>
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-semibold text-white">
                  Getting Started with SSO
                </h3>
                <p className="text-sm text-text-secondary">
                  Enterprise SSO allows your team members to authenticate using your
                  organization&apos;s identity provider. Select a provider above to
                  begin configuration. You&apos;ll need administrator access to your
                  IdP to complete the setup.
                </p>
                <ul className="mt-2 flex flex-col gap-1 text-sm text-text-secondary">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-primary">
                      check_circle
                    </span>
                    Centralized access control
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-primary">
                      check_circle
                    </span>
                    Automatic user provisioning (with SCIM)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-primary">
                      check_circle
                    </span>
                    Enhanced security compliance
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
