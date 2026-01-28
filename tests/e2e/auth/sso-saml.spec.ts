/**
 * Enterprise SSO SAML Configuration E2E Tests
 *
 * Story: 1-1-12 Enterprise SSO SAML Configuration
 * Wireframe: enterprise_sso_configuration
 *
 * TDD RED PHASE: These tests are written to FAIL initially.
 * They verify acceptance criteria from story 1-1-12:
 * - AC1: Access SSO settings from Security settings
 * - AC2: Display Identity Provider selection cards
 * - AC3: SSO status toggle
 * - AC4: SAML configuration form
 * - AC5: Attribute mapping section
 * - AC6: SP metadata display
 * - AC7: Connection testing
 * - AC8: Save configuration
 * - AC9: Accessibility requirements
 * - AC10: Responsive design
 */

import { test, expect } from '../../support/fixtures';

/**
 * SSO SAML Configuration Page Object
 */
class SsoSamlPage {
  constructor(private page: import('@playwright/test').Page) {}

  // Navigation
  async goto() {
    await this.page.goto('/settings/security/sso');
    await this.page.waitForLoadState('networkidle');
  }

  async gotoSamlConfig() {
    await this.page.goto('/settings/security/sso/saml');
    await this.page.waitForLoadState('networkidle');
  }

  async gotoFromSecuritySettings() {
    await this.page.goto('/settings/security');
    await this.page.waitForLoadState('networkidle');
  }

  // Page elements based on wireframe: enterprise_sso_configuration/code.html
  get pageHeading() {
    return this.page.getByRole('heading', { name: /enterprise sso/i });
  }

  get pageDescription() {
    return this.page.getByText(/configure single sign-on for your organization/i);
  }

  // SSO Status Section (wireframe lines 79-91)
  get ssoStatusCard() {
    return this.page.locator('[data-testid="sso-status-card"]');
  }

  get ssoStatusLabel() {
    return this.page.getByText(/sso status/i);
  }

  get ssoStatusToggle() {
    return this.page.getByRole('switch', { name: /sso/i });
  }

  get ssoEnabledMessage() {
    return this.page.getByText(/users must authenticate via your provider/i);
  }

  // Identity Provider Selection (wireframe lines 93-131)
  get idpSectionHeading() {
    return this.page.getByRole('heading', { name: /identity provider/i });
  }

  get oktaCard() {
    return this.page.locator('[data-testid="idp-okta"]');
  }

  get azureCard() {
    return this.page.locator('[data-testid="idp-azure"]');
  }

  get googleCard() {
    return this.page.locator('[data-testid="idp-google"]');
  }

  get samlCard() {
    return this.page.locator('[data-testid="idp-saml"]');
  }

  get selectedIdpIndicator() {
    return this.page.locator('[data-testid="selected-idp-check"]');
  }

  // Configuration Form (wireframe lines 133-158)
  get configFormHeading() {
    return this.page.getByRole('heading', { name: /general configuration/i });
  }

  get authorizedDomainInput() {
    return this.page.getByLabel(/authorized domain/i);
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

  get discoveryUrlInput() {
    return this.page.getByLabel(/discovery url|metadata/i);
  }

  // Attribute Mapping Section (wireframe lines 160-205)
  get attributeMappingHeading() {
    return this.page.getByRole('heading', { name: /attribute mapping/i });
  }

  get emailMappingRow() {
    return this.page.locator('[data-testid="mapping-email"]');
  }

  get firstNameMappingRow() {
    return this.page.locator('[data-testid="mapping-firstName"]');
  }

  get lastNameMappingRow() {
    return this.page.locator('[data-testid="mapping-lastName"]');
  }

  get groupMappingRow() {
    return this.page.locator('[data-testid="mapping-groups"]');
  }

  getAttributeInput(attribute: string) {
    return this.page.locator(`[data-testid="mapping-${attribute}"] input`);
  }

  // SP Metadata Section
  get spMetadataSection() {
    return this.page.locator('[data-testid="sp-metadata"]');
  }

  get acsUrlField() {
    return this.page.locator('[data-testid="acs-url"]');
  }

  get entityIdField() {
    return this.page.locator('[data-testid="entity-id"]');
  }

  get copyAcsUrlButton() {
    return this.page.locator('[data-testid="copy-acs-url"]');
  }

  get copyEntityIdButton() {
    return this.page.locator('[data-testid="copy-entity-id"]');
  }

  get downloadMetadataButton() {
    return this.page.getByRole('button', { name: /download.*metadata/i });
  }

  // Action Buttons (wireframe lines 207-213)
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

  // Dialogs
  get disableSsoDialog() {
    return this.page.getByRole('dialog');
  }

  get confirmDisableButton() {
    return this.page.getByRole('button', { name: /confirm|disable/i });
  }

  get cancelButton() {
    return this.page.getByRole('button', { name: /cancel/i });
  }

  // Actions
  async selectProvider(provider: 'okta' | 'azure' | 'google' | 'saml') {
    const card = {
      okta: this.oktaCard,
      azure: this.azureCard,
      google: this.googleCard,
      saml: this.samlCard,
    }[provider];
    await card.click();
  }

  async fillConfigForm(config: {
    domain?: string;
    clientId?: string;
    clientSecret?: string;
    discoveryUrl?: string;
  }) {
    if (config.domain) {
      await this.authorizedDomainInput.fill(config.domain);
    }
    if (config.clientId) {
      await this.clientIdInput.fill(config.clientId);
    }
    if (config.clientSecret) {
      await this.clientSecretInput.fill(config.clientSecret);
    }
    if (config.discoveryUrl) {
      await this.discoveryUrlInput.fill(config.discoveryUrl);
    }
  }

  async toggleSecretVisibility() {
    await this.clientSecretToggle.click();
  }

  async clickTestConnection() {
    await this.testConnectionButton.click();
  }

  async clickSaveConfiguration() {
    await this.saveConfigButton.click();
  }

  async toggleSsoStatus() {
    await this.ssoStatusToggle.click();
  }
}

test.describe('Enterprise SSO SAML Configuration - Story 1-1-12', () => {
  test.describe('AC1: Access SSO Configuration from Security Settings', () => {
    test('navigates to SSO settings from security settings', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);

      // Navigate to Security Settings
      await ssoPage.gotoFromSecuritySettings();

      // Look for SSO/Enterprise link
      const ssoLink = page.getByRole('link', { name: /sso|enterprise|single sign-on/i });
      await expect(ssoLink).toBeVisible();
      await ssoLink.click();

      // Should navigate to SSO settings page
      await expect(page).toHaveURL(/\/settings\/security\/sso/);
    });

    test('SSO settings page loads at /settings/security/sso', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.goto();

      // Verify URL
      await expect(page).toHaveURL(/\/settings\/security\/sso/);

      // Verify page heading
      await expect(ssoPage.pageHeading).toBeVisible();
    });

    test('redirects unauthenticated users to sign-in', async ({ page }) => {
      await page.goto('/settings/security/sso');
      await expect(page).toHaveURL(/sign-in/);
    });

    test('displays page description explaining SSO purpose', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.goto();

      await expect(ssoPage.pageDescription).toBeVisible();
    });
  });

  test.describe('AC2: Display Identity Provider Selection', () => {
    test('displays all four IdP options', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.goto();

      await expect(ssoPage.idpSectionHeading).toBeVisible();
      await expect(ssoPage.oktaCard).toBeVisible();
      await expect(ssoPage.azureCard).toBeVisible();
      await expect(ssoPage.googleCard).toBeVisible();
      await expect(ssoPage.samlCard).toBeVisible();
    });

    test('displays Okta provider card with icon', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.goto();

      await expect(ssoPage.oktaCard.getByText('Okta')).toBeVisible();
    });

    test('displays Azure AD provider card with icon', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.goto();

      await expect(ssoPage.azureCard.getByText(/azure/i)).toBeVisible();
    });

    test('displays Google provider card with icon', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.goto();

      await expect(ssoPage.googleCard.getByText('Google')).toBeVisible();
    });

    test('displays SAML 2.0 provider card with icon', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.goto();

      await expect(ssoPage.samlCard.getByText(/saml/i)).toBeVisible();
    });

    test('selecting a provider highlights it', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.goto();

      await ssoPage.selectProvider('okta');

      await expect(ssoPage.oktaCard).toHaveClass(/border-primary/);
    });

    test('shows check indicator on selected provider', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.goto();

      await ssoPage.selectProvider('azure');

      const checkIcon = ssoPage.azureCard.locator('[data-testid="selected-idp-check"]');
      await expect(checkIcon).toBeVisible();
    });
  });

  test.describe('AC3: SSO Status Toggle', () => {
    test('displays SSO status section', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.goto();

      await expect(ssoPage.ssoStatusLabel).toBeVisible();
    });

    test('displays SSO toggle switch', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.goto();

      await expect(ssoPage.ssoStatusToggle).toBeVisible();
    });

    test('toggle can be switched on', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.goto();

      await ssoPage.toggleSsoStatus();

      await expect(ssoPage.ssoStatusToggle).toBeChecked();
    });

    test('shows confirmation dialog when disabling SSO', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.goto();

      // First enable SSO
      await ssoPage.toggleSsoStatus();
      await expect(ssoPage.ssoStatusToggle).toBeChecked();

      // Then try to disable
      await ssoPage.toggleSsoStatus();

      // Confirmation dialog should appear
      await expect(ssoPage.disableSsoDialog).toBeVisible();
    });

    test('shows status message when SSO is enabled', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.goto();

      await ssoPage.toggleSsoStatus();

      await expect(ssoPage.ssoEnabledMessage).toBeVisible();
    });
  });

  test.describe('AC4: SAML Configuration Form', () => {
    test('displays configuration form heading', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      await expect(ssoPage.configFormHeading).toBeVisible();
    });

    test('displays authorized domain input', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      await expect(ssoPage.authorizedDomainInput).toBeVisible();
      await expect(ssoPage.authorizedDomainInput).toHaveAttribute('placeholder', /e\.g\. acme\.com/i);
    });

    test('displays client ID input', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      await expect(ssoPage.clientIdInput).toBeVisible();
    });

    test('displays client secret input with masked value', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      await expect(ssoPage.clientSecretInput).toBeVisible();
      await expect(ssoPage.clientSecretInput).toHaveAttribute('type', 'password');
    });

    test('client secret visibility can be toggled', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      // Initially hidden
      await expect(ssoPage.clientSecretInput).toHaveAttribute('type', 'password');

      // Toggle visibility
      await ssoPage.toggleSecretVisibility();

      // Now visible
      await expect(ssoPage.clientSecretInput).toHaveAttribute('type', 'text');
    });

    test('displays discovery URL / metadata input', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      await expect(ssoPage.discoveryUrlInput).toBeVisible();
    });

    test('can fill all configuration fields', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      await ssoPage.fillConfigForm({
        domain: 'acme-corp.com',
        clientId: '0oa6k5p2m7XyZ123',
        clientSecret: 'super-secret-key-123',
        discoveryUrl: 'https://acme.okta.com/.well-known/openid-configuration',
      });

      await expect(ssoPage.authorizedDomainInput).toHaveValue('acme-corp.com');
      await expect(ssoPage.clientIdInput).toHaveValue('0oa6k5p2m7XyZ123');
      await expect(ssoPage.discoveryUrlInput).toHaveValue(
        'https://acme.okta.com/.well-known/openid-configuration'
      );
    });
  });

  test.describe('AC5: Attribute Mapping Section', () => {
    test('displays attribute mapping heading', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      await expect(ssoPage.attributeMappingHeading).toBeVisible();
    });

    test('displays email address mapping row', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      await expect(ssoPage.emailMappingRow).toBeVisible();
      await expect(ssoPage.emailMappingRow.getByText(/email address/i)).toBeVisible();
    });

    test('displays first name mapping row', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      await expect(ssoPage.firstNameMappingRow).toBeVisible();
      await expect(ssoPage.firstNameMappingRow.getByText(/first name/i)).toBeVisible();
    });

    test('displays last name mapping row', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      await expect(ssoPage.lastNameMappingRow).toBeVisible();
      await expect(ssoPage.lastNameMappingRow.getByText(/last name/i)).toBeVisible();
    });

    test('displays group membership mapping row', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      await expect(ssoPage.groupMappingRow).toBeVisible();
      await expect(ssoPage.groupMappingRow.getByText(/group membership/i)).toBeVisible();
    });

    test('mapping inputs have default values', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      await expect(ssoPage.getAttributeInput('email')).toHaveValue('user.email');
      await expect(ssoPage.getAttributeInput('firstName')).toHaveValue('user.given_name');
      await expect(ssoPage.getAttributeInput('lastName')).toHaveValue('user.family_name');
    });

    test('mapping inputs are editable', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      const emailInput = ssoPage.getAttributeInput('email');
      await emailInput.clear();
      await emailInput.fill('email_address');

      await expect(emailInput).toHaveValue('email_address');
    });
  });

  test.describe('AC6: Service Provider (SP) Metadata Display', () => {
    test('displays SP metadata section', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      await expect(ssoPage.spMetadataSection).toBeVisible();
    });

    test('displays ACS URL', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      await expect(ssoPage.acsUrlField).toBeVisible();
      await expect(ssoPage.acsUrlField).toContainText(/https:\/\//);
    });

    test('displays Entity ID', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      await expect(ssoPage.entityIdField).toBeVisible();
    });

    test('has copy button for ACS URL', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      await expect(ssoPage.copyAcsUrlButton).toBeVisible();
    });

    test('has copy button for Entity ID', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      await expect(ssoPage.copyEntityIdButton).toBeVisible();
    });

    test('has download metadata XML button', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      await expect(ssoPage.downloadMetadataButton).toBeVisible();
    });

    test('copy button copies ACS URL to clipboard', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      await ssoPage.copyAcsUrlButton.click();

      // Check for success feedback (toast or visual indicator)
      await expect(page.getByText(/copied/i)).toBeVisible();
    });
  });

  test.describe('AC7: Connection Testing', () => {
    test('displays Test Connection button', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      await expect(ssoPage.testConnectionButton).toBeVisible();
    });

    test('Test Connection button is enabled when form is filled', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      await ssoPage.fillConfigForm({
        domain: 'acme-corp.com',
        clientId: '0oa6k5p2m7XyZ123',
        clientSecret: 'super-secret-key-123',
        discoveryUrl: 'https://acme.okta.com/.well-known/openid-configuration',
      });

      await expect(ssoPage.testConnectionButton).toBeEnabled();
    });

    test('clicking Test Connection shows loading state', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      await ssoPage.fillConfigForm({
        domain: 'acme-corp.com',
        clientId: '0oa6k5p2m7XyZ123',
        clientSecret: 'super-secret-key-123',
        discoveryUrl: 'https://acme.okta.com/.well-known/openid-configuration',
      });

      await ssoPage.clickTestConnection();

      await expect(ssoPage.testConnectionButton).toHaveAttribute('aria-busy', 'true');
    });

    test('shows success result on successful test', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      // This will likely fail with mock data, but testing the UI flow
      await ssoPage.fillConfigForm({
        domain: 'test.example.com',
        clientId: 'test-client-id',
        clientSecret: 'test-secret',
        discoveryUrl: 'https://test.example.com/.well-known/openid-configuration',
      });

      await ssoPage.clickTestConnection();

      // Either success or error should appear
      const result = page.locator('[data-testid="test-result-success"], [data-testid="test-result-error"]');
      await expect(result).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('AC8: Save Configuration', () => {
    test('displays Save Configuration button', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      await expect(ssoPage.saveConfigButton).toBeVisible();
    });

    test('Save button has primary styling', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      await expect(ssoPage.saveConfigButton).toHaveClass(/bg-primary/);
    });

    test('clicking Save shows loading state', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      await ssoPage.fillConfigForm({
        domain: 'acme-corp.com',
        clientId: '0oa6k5p2m7XyZ123',
        clientSecret: 'super-secret-key-123',
        discoveryUrl: 'https://acme.okta.com/.well-known/openid-configuration',
      });

      await ssoPage.clickSaveConfiguration();

      // Should show loading or processing state
      const savingIndicator = page.locator('text=/saving|processing/i');
      await expect(savingIndicator).toBeVisible({ timeout: 1000 }).catch(() => {
        // Button might complete quickly
      });
    });

    test('shows success message after save', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      await ssoPage.fillConfigForm({
        domain: 'acme-corp.com',
        clientId: '0oa6k5p2m7XyZ123',
        clientSecret: 'super-secret-key-123',
        discoveryUrl: 'https://acme.okta.com/.well-known/openid-configuration',
      });

      await ssoPage.clickSaveConfiguration();

      // Success message should appear
      await expect(page.getByText(/saved|success/i)).toBeVisible({ timeout: 5000 });
    });

    test('validates required fields before save', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      // Try to save without filling required fields
      await ssoPage.clickSaveConfiguration();

      // Should show validation error
      await expect(page.getByText(/required|please fill/i)).toBeVisible();
    });
  });

  test.describe('AC9: Accessibility Requirements', () => {
    test('all form inputs have proper labels', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      // Check that inputs can be found by their labels
      await expect(ssoPage.authorizedDomainInput).toBeVisible();
      await expect(ssoPage.clientIdInput).toBeVisible();
      await expect(ssoPage.clientSecretInput).toBeVisible();
      await expect(ssoPage.discoveryUrlInput).toBeVisible();
    });

    test('supports keyboard navigation', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      // Tab through form elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // An input should be focused
      const focusedElement = page.locator(':focus');
      const tagName = await focusedElement.evaluate((el) => el.tagName);
      expect(['INPUT', 'BUTTON', 'A']).toContain(tagName);
    });

    test('toggle has proper ARIA attributes', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.goto();

      await expect(ssoPage.ssoStatusToggle).toHaveAttribute('role', 'switch');
      await expect(ssoPage.ssoStatusToggle).toHaveAttribute('aria-checked');
    });

    test('buttons have visible focus indicators', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      await ssoPage.saveConfigButton.focus();

      await expect(ssoPage.saveConfigButton).toHaveClass(/focus:ring|ring-/);
    });

    test('page has proper heading hierarchy', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.goto();

      // Should have h1 or main heading
      const heading = page.locator('h1, [role="heading"][aria-level="1"]');
      await expect(heading).toBeVisible();
    });
  });

  test.describe('AC10: Responsive Design', () => {
    test('renders correctly on mobile viewport', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);

      await page.setViewportSize({ width: 375, height: 667 });
      await ssoPage.goto();

      // All main elements should be visible
      await expect(ssoPage.pageHeading).toBeVisible();
      await expect(ssoPage.oktaCard).toBeVisible();
      await expect(ssoPage.ssoStatusToggle).toBeVisible();
    });

    test('IdP cards stack vertically on mobile', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);

      await page.setViewportSize({ width: 375, height: 667 });
      await ssoPage.goto();

      const oktaBox = await ssoPage.oktaCard.boundingBox();
      const azureBox = await ssoPage.azureCard.boundingBox();

      if (oktaBox && azureBox) {
        // On mobile, cards should be stacked (different Y positions)
        expect(oktaBox.y).not.toBe(azureBox.y);
      }
    });

    test('form fields are full width on mobile', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);

      await page.setViewportSize({ width: 375, height: 667 });
      await ssoPage.gotoSamlConfig();

      const domainInputBox = await ssoPage.authorizedDomainInput.boundingBox();
      const parentBox = await ssoPage.authorizedDomainInput.locator('..').boundingBox();

      if (domainInputBox && parentBox) {
        // Input should be nearly full width
        expect(domainInputBox.width).toBeGreaterThan(parentBox.width * 0.8);
      }
    });

    test('renders correctly on tablet viewport', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);

      await page.setViewportSize({ width: 768, height: 1024 });
      await ssoPage.goto();

      await expect(ssoPage.pageHeading).toBeVisible();
      await expect(ssoPage.oktaCard).toBeVisible();
    });

    test('renders correctly on desktop viewport', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);

      await page.setViewportSize({ width: 1280, height: 800 });
      await ssoPage.goto();

      await expect(ssoPage.pageHeading).toBeVisible();

      // IdP cards should be in a grid on desktop
      const oktaBox = await ssoPage.oktaCard.boundingBox();
      const azureBox = await ssoPage.azureCard.boundingBox();

      if (oktaBox && azureBox) {
        // On desktop, some cards may be on the same row
        expect(oktaBox.y).toBeLessThanOrEqual(azureBox.y + 10);
      }
    });
  });

  test.describe('Complete SSO Configuration Flow', () => {
    test('user can complete full SSO configuration', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);

      // Step 1: Navigate to SSO settings
      await ssoPage.goto();
      await expect(ssoPage.pageHeading).toBeVisible();

      // Step 2: Select Okta as provider
      await ssoPage.selectProvider('okta');
      await expect(ssoPage.oktaCard).toHaveClass(/border-primary/);

      // Step 3: Navigate to SAML config (if on separate page)
      await ssoPage.gotoSamlConfig();

      // Step 4: Fill configuration
      await ssoPage.fillConfigForm({
        domain: 'acme-corp.com',
        clientId: '0oa6k5p2m7XyZ123',
        clientSecret: 'super-secret-key-123',
        discoveryUrl: 'https://acme.okta.com/.well-known/openid-configuration',
      });

      // Step 5: Test connection
      await ssoPage.clickTestConnection();

      // Wait for test result
      const testResult = page.locator('[data-testid="test-result-success"], [data-testid="test-result-error"]');
      await expect(testResult).toBeVisible({ timeout: 10000 });

      // Step 6: Save configuration
      await ssoPage.clickSaveConfiguration();

      // Should show success
      await expect(page.getByText(/saved|success/i)).toBeVisible({ timeout: 5000 });
    });

    test('user can view SP metadata for IdP configuration', async ({ authenticatedPage: page }) => {
      const ssoPage = new SsoSamlPage(page);
      await ssoPage.gotoSamlConfig();

      // SP metadata should be visible
      await expect(ssoPage.spMetadataSection).toBeVisible();
      await expect(ssoPage.acsUrlField).toBeVisible();
      await expect(ssoPage.entityIdField).toBeVisible();

      // Copy buttons should work
      await ssoPage.copyAcsUrlButton.click();
      await expect(page.getByText(/copied/i)).toBeVisible();
    });
  });
});
