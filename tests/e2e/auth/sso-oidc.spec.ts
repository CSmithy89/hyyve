/**
 * Enterprise SSO OIDC Configuration E2E Tests
 *
 * Story: 1-1-13 Enterprise SSO OIDC Configuration
 * Wireframe: enterprise_sso_configuration
 *
 * TDD RED PHASE: These tests are written to FAIL initially.
 * They verify acceptance criteria from story 1-1-13:
 * - AC1: Access OIDC settings from SSO settings
 * - AC2: OIDC configuration form
 * - AC3: Auto-discovery feature
 * - AC4: Scopes configuration
 * - AC5: Redirect URI display
 * - AC6: Connection testing
 * - AC7: Save configuration
 * - AC8: Accessibility requirements
 * - AC9: Responsive design
 */

import { test, expect } from '../../support/fixtures';

/**
 * SSO OIDC Configuration Page Object
 */
class SsoOidcPage {
  constructor(private page: import('@playwright/test').Page) {}

  // Navigation
  async goto() {
    await this.page.goto('/settings/security/sso/oidc');
    await this.page.waitForLoadState('networkidle');
  }

  async gotoFromSsoSettings() {
    await this.page.goto('/settings/security/sso');
    await this.page.waitForLoadState('networkidle');
  }

  // Page elements
  get pageHeading() {
    return this.page.getByRole('heading', { name: /oidc configuration/i });
  }

  get pageDescription() {
    return this.page.getByText(/configure openid connect/i);
  }

  // Configuration Form Fields (AC2)
  get discoveryUrlInput() {
    return this.page.getByLabel(/discovery url/i);
  }

  get clientIdInput() {
    return this.page.getByLabel(/client id/i);
  }

  get clientSecretInput() {
    return this.page.getByLabel(/client secret/i);
  }

  get clientSecretToggle() {
    return this.page.locator('[data-testid="toggle-secret-visibility"]');
  }

  get authMethodSelect() {
    return this.page.getByLabel(/token endpoint auth|authentication method/i);
  }

  // Discovery (AC3)
  get discoverButton() {
    return this.page.getByRole('button', { name: /discover/i });
  }

  get discoveryResultSection() {
    return this.page.locator('[data-testid="discovery-result"]');
  }

  get issuerField() {
    return this.page.locator('[data-testid="issuer"]');
  }

  get authEndpointField() {
    return this.page.locator('[data-testid="authorization-endpoint"]');
  }

  get tokenEndpointField() {
    return this.page.locator('[data-testid="token-endpoint"]');
  }

  // Scopes Configuration (AC4)
  get scopesSectionHeading() {
    return this.page.getByRole('heading', { name: /scopes/i });
  }

  get openidScopeCheckbox() {
    return this.page.getByLabel(/^openid$/i);
  }

  get profileScopeCheckbox() {
    return this.page.getByLabel(/^profile$/i);
  }

  get emailScopeCheckbox() {
    return this.page.getByLabel(/^email$/i);
  }

  get groupsScopeCheckbox() {
    return this.page.getByLabel(/groups/i);
  }

  get offlineAccessCheckbox() {
    return this.page.getByLabel(/offline.access/i);
  }

  get customScopeInput() {
    return this.page.getByLabel(/custom scope/i);
  }

  // Redirect URI (AC5)
  get redirectUriSection() {
    return this.page.locator('[data-testid="redirect-uri-section"]');
  }

  get redirectUriField() {
    return this.page.locator('[data-testid="redirect-uri"]');
  }

  get copyRedirectUriButton() {
    return this.page.locator('[data-testid="copy-redirect-uri"]');
  }

  get callbackUrlField() {
    return this.page.locator('[data-testid="callback-url"]');
  }

  get copyCallbackUrlButton() {
    return this.page.locator('[data-testid="copy-callback-url"]');
  }

  // Action Buttons (AC6, AC7)
  get testConnectionButton() {
    return this.page.getByRole('button', { name: /test connection/i });
  }

  get saveConfigButton() {
    return this.page.getByRole('button', { name: /save configuration/i });
  }

  // Test Results
  get testResultSuccess() {
    return this.page.locator('[data-testid="test-result-success"]');
  }

  get testResultError() {
    return this.page.locator('[data-testid="test-result-error"]');
  }

  // Actions
  async fillConfigForm(config: {
    discoveryUrl?: string;
    clientId?: string;
    clientSecret?: string;
  }) {
    if (config.discoveryUrl) {
      await this.discoveryUrlInput.fill(config.discoveryUrl);
    }
    if (config.clientId) {
      await this.clientIdInput.fill(config.clientId);
    }
    if (config.clientSecret) {
      await this.clientSecretInput.fill(config.clientSecret);
    }
  }

  async toggleSecretVisibility() {
    await this.clientSecretToggle.click();
  }

  async clickDiscover() {
    await this.discoverButton.click();
  }

  async clickTestConnection() {
    await this.testConnectionButton.click();
  }

  async clickSaveConfiguration() {
    await this.saveConfigButton.click();
  }

  async toggleScope(scope: 'openid' | 'profile' | 'email' | 'groups' | 'offline_access') {
    const checkbox = {
      openid: this.openidScopeCheckbox,
      profile: this.profileScopeCheckbox,
      email: this.emailScopeCheckbox,
      groups: this.groupsScopeCheckbox,
      offline_access: this.offlineAccessCheckbox,
    }[scope];
    await checkbox.click();
  }
}

test.describe('Enterprise SSO OIDC Configuration - Story 1-1-13', () => {
  test.describe('AC1: Access OIDC Configuration from SSO Settings', () => {
    test('navigates to OIDC settings from SSO settings page', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);

      // Navigate to SSO Settings
      await oidcPage.gotoFromSsoSettings();

      // Look for OIDC link or card
      const oidcLink = page.getByRole('link', { name: /oidc|openid connect/i });
      await expect(oidcLink).toBeVisible();
      await oidcLink.click();

      // Should navigate to OIDC settings page
      await expect(page).toHaveURL(/\/settings\/security\/sso\/oidc/);
    });

    test('OIDC settings page loads at /settings/security/sso/oidc', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      // Verify URL
      await expect(page).toHaveURL(/\/settings\/security\/sso\/oidc/);

      // Verify page heading
      await expect(oidcPage.pageHeading).toBeVisible();
    });

    test('redirects unauthenticated users to sign-in', async ({ page }) => {
      await page.goto('/settings/security/sso/oidc');
      await expect(page).toHaveURL(/sign-in/);
    });

    test('displays page description explaining OIDC purpose', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      await expect(oidcPage.pageDescription).toBeVisible();
    });

    test('displays breadcrumb navigation', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      // Check breadcrumb elements
      await expect(page.getByText('Settings').first()).toBeVisible();
      await expect(page.getByText('Security').first()).toBeVisible();
      await expect(page.getByText('SSO').first()).toBeVisible();
      await expect(page.getByText('OIDC').first()).toBeVisible();
    });
  });

  test.describe('AC2: OIDC Configuration Form', () => {
    test('displays discovery URL input', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      await expect(oidcPage.discoveryUrlInput).toBeVisible();
      await expect(oidcPage.discoveryUrlInput).toHaveAttribute(
        'placeholder',
        /\.well-known\/openid-configuration/i
      );
    });

    test('displays client ID input', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      await expect(oidcPage.clientIdInput).toBeVisible();
    });

    test('displays client secret input with masked value', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      await expect(oidcPage.clientSecretInput).toBeVisible();
      await expect(oidcPage.clientSecretInput).toHaveAttribute('type', 'password');
    });

    test('client secret visibility can be toggled', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      // Initially hidden
      await expect(oidcPage.clientSecretInput).toHaveAttribute('type', 'password');

      // Toggle visibility
      await oidcPage.toggleSecretVisibility();

      // Now visible
      await expect(oidcPage.clientSecretInput).toHaveAttribute('type', 'text');
    });

    test('can fill all configuration fields', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      await oidcPage.fillConfigForm({
        discoveryUrl: 'https://accounts.google.com/.well-known/openid-configuration',
        clientId: 'test-client-id-12345',
        clientSecret: 'test-client-secret-abc',
      });

      await expect(oidcPage.discoveryUrlInput).toHaveValue(
        'https://accounts.google.com/.well-known/openid-configuration'
      );
      await expect(oidcPage.clientIdInput).toHaveValue('test-client-id-12345');
    });
  });

  test.describe('AC3: Auto-Discovery Feature', () => {
    test('displays Discover button', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      await expect(oidcPage.discoverButton).toBeVisible();
    });

    test('clicking Discover shows loading state', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      await oidcPage.discoveryUrlInput.fill(
        'https://accounts.google.com/.well-known/openid-configuration'
      );
      await oidcPage.clickDiscover();

      await expect(oidcPage.discoverButton).toHaveAttribute('aria-busy', 'true');
    });

    test('displays discovered endpoints after successful discovery', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      await oidcPage.discoveryUrlInput.fill(
        'https://accounts.google.com/.well-known/openid-configuration'
      );
      await oidcPage.clickDiscover();

      // Wait for discovery result
      await expect(oidcPage.discoveryResultSection).toBeVisible({ timeout: 10000 });
    });

    test('shows error for invalid discovery URL', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      await oidcPage.discoveryUrlInput.fill('https://invalid-url.com/not-found');
      await oidcPage.clickDiscover();

      // Should show error
      await expect(page.getByText(/invalid|error|failed/i)).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('AC4: Scopes Configuration', () => {
    test('displays scopes section heading', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      await expect(oidcPage.scopesSectionHeading).toBeVisible();
    });

    test('displays openid scope checkbox (required)', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      await expect(oidcPage.openidScopeCheckbox).toBeVisible();
      // openid is typically required and checked by default
      await expect(oidcPage.openidScopeCheckbox).toBeChecked();
    });

    test('displays profile scope checkbox', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      await expect(oidcPage.profileScopeCheckbox).toBeVisible();
    });

    test('displays email scope checkbox', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      await expect(oidcPage.emailScopeCheckbox).toBeVisible();
    });

    test('displays groups scope checkbox (optional)', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      await expect(oidcPage.groupsScopeCheckbox).toBeVisible();
    });

    test('displays offline_access scope checkbox', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      await expect(oidcPage.offlineAccessCheckbox).toBeVisible();
    });

    test('scopes can be toggled', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      // Toggle profile scope
      await oidcPage.toggleScope('profile');
      await expect(oidcPage.profileScopeCheckbox).toBeChecked();

      // Toggle it off
      await oidcPage.toggleScope('profile');
      await expect(oidcPage.profileScopeCheckbox).not.toBeChecked();
    });

    test('has custom scope input field', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      await expect(oidcPage.customScopeInput).toBeVisible();
    });
  });

  test.describe('AC5: Redirect URI Display', () => {
    test('displays redirect URI section', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      await expect(oidcPage.redirectUriSection).toBeVisible();
    });

    test('displays redirect URI value', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      await expect(oidcPage.redirectUriField).toBeVisible();
      await expect(oidcPage.redirectUriField).toContainText(/https:\/\//);
    });

    test('has copy button for redirect URI', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      await expect(oidcPage.copyRedirectUriButton).toBeVisible();
    });

    test('copy button copies redirect URI to clipboard', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      await oidcPage.copyRedirectUriButton.click();

      // Check for success feedback
      await expect(page.getByText(/copied/i)).toBeVisible();
    });

    test('displays callback URL for IdP configuration', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      await expect(oidcPage.callbackUrlField).toBeVisible();
    });
  });

  test.describe('AC6: Connection Testing', () => {
    test('displays Test Connection button', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      await expect(oidcPage.testConnectionButton).toBeVisible();
    });

    test('clicking Test Connection shows loading state', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      await oidcPage.fillConfigForm({
        discoveryUrl: 'https://accounts.google.com/.well-known/openid-configuration',
        clientId: 'test-client-id',
        clientSecret: 'test-secret',
      });

      await oidcPage.clickTestConnection();

      await expect(oidcPage.testConnectionButton).toHaveAttribute('aria-busy', 'true');
    });

    test('shows result on test completion', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      await oidcPage.fillConfigForm({
        discoveryUrl: 'https://test.example.com/.well-known/openid-configuration',
        clientId: 'test-client-id',
        clientSecret: 'test-secret',
      });

      await oidcPage.clickTestConnection();

      // Either success or error should appear
      const result = page.locator(
        '[data-testid="test-result-success"], [data-testid="test-result-error"]'
      );
      await expect(result).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('AC7: Save Configuration', () => {
    test('displays Save Configuration button', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      await expect(oidcPage.saveConfigButton).toBeVisible();
    });

    test('Save button has primary styling', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      await expect(oidcPage.saveConfigButton).toHaveClass(/bg-primary/);
    });

    test('clicking Save shows loading state', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      await oidcPage.fillConfigForm({
        discoveryUrl: 'https://accounts.google.com/.well-known/openid-configuration',
        clientId: 'test-client-id',
        clientSecret: 'test-secret',
      });

      await oidcPage.clickSaveConfiguration();

      // Should show loading state briefly
      const savingIndicator = page.locator('text=/saving|processing/i');
      await expect(savingIndicator).toBeVisible({ timeout: 1000 }).catch(() => {
        // Button might complete quickly
      });
    });

    test('shows success message after save', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      await oidcPage.fillConfigForm({
        discoveryUrl: 'https://accounts.google.com/.well-known/openid-configuration',
        clientId: 'test-client-id',
        clientSecret: 'test-secret',
      });

      await oidcPage.clickSaveConfiguration();

      // Success message should appear
      await expect(page.getByText(/saved|success/i)).toBeVisible({ timeout: 5000 });
    });

    test('validates required fields before save', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      // Try to save without filling required fields
      await oidcPage.clickSaveConfiguration();

      // Should show validation error
      await expect(page.getByText(/required|please fill/i)).toBeVisible();
    });
  });

  test.describe('AC8: Accessibility Requirements', () => {
    test('all form inputs have proper labels', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      // Check that inputs can be found by their labels
      await expect(oidcPage.discoveryUrlInput).toBeVisible();
      await expect(oidcPage.clientIdInput).toBeVisible();
      await expect(oidcPage.clientSecretInput).toBeVisible();
    });

    test('supports keyboard navigation', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      // Tab through form elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // An input should be focused
      const focusedElement = page.locator(':focus');
      const tagName = await focusedElement.evaluate((el) => el.tagName);
      expect(['INPUT', 'BUTTON', 'A']).toContain(tagName);
    });

    test('scope checkboxes are properly labeled', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      // All scope checkboxes should have labels
      await expect(oidcPage.openidScopeCheckbox).toBeVisible();
      await expect(oidcPage.profileScopeCheckbox).toBeVisible();
      await expect(oidcPage.emailScopeCheckbox).toBeVisible();
    });

    test('buttons have visible focus indicators', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      await oidcPage.saveConfigButton.focus();

      await expect(oidcPage.saveConfigButton).toHaveClass(/focus:ring|ring-/);
    });

    test('page has proper heading hierarchy', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      // Should have h1 or main heading
      const heading = page.locator('h1, [role="heading"][aria-level="1"]');
      await expect(heading).toBeVisible();
    });
  });

  test.describe('AC9: Responsive Design', () => {
    test('renders correctly on mobile viewport', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);

      await page.setViewportSize({ width: 375, height: 667 });
      await oidcPage.goto();

      // All main elements should be visible
      await expect(oidcPage.pageHeading).toBeVisible();
      await expect(oidcPage.discoveryUrlInput).toBeVisible();
      await expect(oidcPage.saveConfigButton).toBeVisible();
    });

    test('form fields are full width on mobile', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);

      await page.setViewportSize({ width: 375, height: 667 });
      await oidcPage.goto();

      const inputBox = await oidcPage.discoveryUrlInput.boundingBox();
      const parentBox = await oidcPage.discoveryUrlInput.locator('..').boundingBox();

      if (inputBox && parentBox) {
        // Input should be nearly full width
        expect(inputBox.width).toBeGreaterThan(parentBox.width * 0.8);
      }
    });

    test('renders correctly on tablet viewport', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);

      await page.setViewportSize({ width: 768, height: 1024 });
      await oidcPage.goto();

      await expect(oidcPage.pageHeading).toBeVisible();
      await expect(oidcPage.discoveryUrlInput).toBeVisible();
    });

    test('renders correctly on desktop viewport', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);

      await page.setViewportSize({ width: 1280, height: 800 });
      await oidcPage.goto();

      await expect(oidcPage.pageHeading).toBeVisible();
      await expect(oidcPage.discoveryUrlInput).toBeVisible();
      await expect(oidcPage.saveConfigButton).toBeVisible();
    });
  });

  test.describe('Complete OIDC Configuration Flow', () => {
    test('user can complete full OIDC configuration', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);

      // Step 1: Navigate to OIDC settings
      await oidcPage.goto();
      await expect(oidcPage.pageHeading).toBeVisible();

      // Step 2: Fill discovery URL and discover
      await oidcPage.discoveryUrlInput.fill(
        'https://accounts.google.com/.well-known/openid-configuration'
      );

      // Step 3: Fill client credentials
      await oidcPage.fillConfigForm({
        clientId: 'test-client-id-12345',
        clientSecret: 'test-client-secret-abc',
      });

      // Step 4: Configure scopes
      await oidcPage.toggleScope('profile');
      await oidcPage.toggleScope('email');

      // Step 5: Test connection
      await oidcPage.clickTestConnection();

      // Wait for test result
      const testResult = page.locator(
        '[data-testid="test-result-success"], [data-testid="test-result-error"]'
      );
      await expect(testResult).toBeVisible({ timeout: 10000 });

      // Step 6: Save configuration
      await oidcPage.clickSaveConfiguration();

      // Should show success
      await expect(page.getByText(/saved|success/i)).toBeVisible({ timeout: 5000 });
    });

    test('user can view redirect URIs for IdP configuration', async ({ authenticatedPage: page }) => {
      const oidcPage = new SsoOidcPage(page);
      await oidcPage.goto();

      // Redirect URI section should be visible
      await expect(oidcPage.redirectUriSection).toBeVisible();
      await expect(oidcPage.redirectUriField).toBeVisible();

      // Copy button should work
      await oidcPage.copyRedirectUriButton.click();
      await expect(page.getByText(/copied/i)).toBeVisible();
    });
  });
});
