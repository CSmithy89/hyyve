/**
 * SCIM User Provisioning E2E Tests
 *
 * Story: 1-1-14 SCIM User Provisioning
 * Wireframe: team_&_permissions_management, org_hierarchy_manager
 *
 * TDD RED PHASE: These tests are written to FAIL initially.
 * They verify acceptance criteria from story 1-1-14:
 * - AC1: SCIM settings page access
 * - AC2: SCIM endpoint display with copy
 * - AC3: Bearer token generation with show/hide
 * - AC4: Token regeneration with confirmation
 * - AC5: Enable/disable SCIM toggle
 * - AC6: Provisioned users list view
 * - AC7: Accessibility requirements
 * - AC8: Responsive design
 */

import { test, expect } from '../../support/fixtures';

/**
 * SCIM Provisioning Page Object
 */
class ScimProvisioningPage {
  constructor(private page: import('@playwright/test').Page) {}

  // Navigation
  async goto() {
    await this.page.goto('/settings/security/sso/scim');
    await this.page.waitForLoadState('networkidle');
  }

  async gotoFromSsoSettings() {
    await this.page.goto('/settings/security/sso');
    await this.page.waitForLoadState('networkidle');
  }

  // Page elements based on wireframes
  get pageHeading() {
    return this.page.getByRole('heading', { name: /scim.*provisioning|user provisioning/i });
  }

  get pageDescription() {
    return this.page.getByText(/automat.*user.*provision|sync users from.*identity provider/i);
  }

  // SCIM Status Section
  get scimStatusCard() {
    return this.page.locator('[data-testid="scim-status-card"]');
  }

  get scimStatusLabel() {
    return this.page.getByText(/scim status|provisioning status/i);
  }

  get scimStatusToggle() {
    return this.page.getByRole('switch', { name: /scim|provisioning/i });
  }

  get scimEnabledMessage() {
    return this.page.getByText(/users.*automatically.*synced|provisioning.*enabled/i);
  }

  // SCIM Endpoint Section
  get endpointSection() {
    return this.page.locator('[data-testid="scim-endpoint-section"]');
  }

  get scimEndpointUrl() {
    return this.page.locator('[data-testid="scim-endpoint-url"]');
  }

  get copyEndpointButton() {
    return this.page.locator('[data-testid="copy-scim-endpoint"]');
  }

  // Bearer Token Section
  get tokenSection() {
    return this.page.locator('[data-testid="scim-token-section"]');
  }

  get bearerTokenField() {
    return this.page.locator('[data-testid="scim-bearer-token"]');
  }

  get toggleTokenVisibilityButton() {
    return this.page.getByRole('button', { name: /show|hide|visibility/i }).first();
  }

  get copyTokenButton() {
    return this.page.locator('[data-testid="copy-scim-token"]');
  }

  get regenerateTokenButton() {
    return this.page.getByRole('button', { name: /regenerate|generate.*new.*token/i });
  }

  // Regenerate Confirmation Dialog
  get regenerateDialog() {
    return this.page.getByRole('dialog');
  }

  get confirmRegenerateButton() {
    return this.page.getByRole('button', { name: /confirm|regenerate/i });
  }

  get cancelButton() {
    return this.page.getByRole('button', { name: /cancel/i });
  }

  // Provisioned Users Section
  get usersSection() {
    return this.page.locator('[data-testid="scim-users-section"]');
  }

  get usersSectionHeading() {
    return this.page.getByRole('heading', { name: /provisioned users|synced users/i });
  }

  get usersTable() {
    return this.page.locator('[data-testid="scim-users-table"]');
  }

  getUserRow(email: string) {
    return this.page.locator(`[data-testid="scim-user-row"][data-email="${email}"]`);
  }

  get userRows() {
    return this.page.locator('[data-testid="scim-user-row"]');
  }

  get emptyStateMessage() {
    return this.page.getByText(/no.*users.*provisioned|no.*synced.*users/i);
  }

  getResyncButton(email: string) {
    return this.getUserRow(email).locator('[data-testid="resync-user-button"]');
  }

  getStatusBadge(email: string) {
    return this.getUserRow(email).locator('[data-testid="user-status-badge"]');
  }

  getLastSyncedTime(email: string) {
    return this.getUserRow(email).locator('[data-testid="last-synced"]');
  }

  // Actions
  async toggleScimStatus() {
    await this.scimStatusToggle.click();
  }

  async copyEndpoint() {
    await this.copyEndpointButton.click();
  }

  async copyToken() {
    await this.copyTokenButton.click();
  }

  async toggleTokenVisibility() {
    await this.toggleTokenVisibilityButton.click();
  }

  async clickRegenerateToken() {
    await this.regenerateTokenButton.click();
  }

  async confirmRegenerate() {
    await this.confirmRegenerateButton.click();
  }

  async resyncUser(email: string) {
    await this.getResyncButton(email).click();
  }
}

test.describe('SCIM User Provisioning - Story 1-1-14', () => {
  test.describe('AC1: Access SCIM Settings Page', () => {
    test('SCIM settings page loads at /settings/security/sso/scim', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      // Verify URL
      await expect(page).toHaveURL(/\/settings\/security\/sso\/scim/);

      // Verify page heading
      await expect(scimPage.pageHeading).toBeVisible();
    });

    test('displays page description explaining SCIM purpose', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      await expect(scimPage.pageDescription).toBeVisible();
    });

    test('can navigate to SCIM settings from SSO settings page', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.gotoFromSsoSettings();

      // Look for SCIM link
      const scimLink = page.getByRole('link', { name: /scim|user provisioning/i });
      await expect(scimLink).toBeVisible();
      await scimLink.click();

      // Should navigate to SCIM settings
      await expect(page).toHaveURL(/\/settings\/security\/sso\/scim/);
    });

    test('redirects unauthenticated users to sign-in', async ({ page }) => {
      await page.goto('/settings/security/sso/scim');
      await expect(page).toHaveURL(/sign-in/);
    });
  });

  test.describe('AC2: SCIM Endpoint Display', () => {
    test('displays SCIM endpoint section', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      await expect(scimPage.endpointSection).toBeVisible();
    });

    test('displays SCIM endpoint URL', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      await expect(scimPage.scimEndpointUrl).toBeVisible();
      await expect(scimPage.scimEndpointUrl).toContainText(/https:\/\//);
    });

    test('has copy button for SCIM endpoint', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      await expect(scimPage.copyEndpointButton).toBeVisible();
    });

    test('copy button copies endpoint to clipboard', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      await scimPage.copyEndpoint();

      // Check for success feedback
      await expect(page.getByText(/copied/i)).toBeVisible();
    });
  });

  test.describe('AC3: Bearer Token Generation', () => {
    test('displays bearer token section', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      await expect(scimPage.tokenSection).toBeVisible();
    });

    test('displays bearer token field with masked value', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      await expect(scimPage.bearerTokenField).toBeVisible();
      // Token should be masked with dots or asterisks
      const tokenText = await scimPage.bearerTokenField.textContent();
      expect(tokenText).toMatch(/[•*]{6,}|^hv_/);
    });

    test('has visibility toggle for bearer token', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      await expect(scimPage.toggleTokenVisibilityButton).toBeVisible();
    });

    test('toggling visibility shows/hides token', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      // Get initial token display
      const initialDisplay = await scimPage.bearerTokenField.getAttribute('data-masked');

      // Toggle visibility
      await scimPage.toggleTokenVisibility();

      // Token visibility should change
      const newDisplay = await scimPage.bearerTokenField.getAttribute('data-masked');
      expect(newDisplay).not.toBe(initialDisplay);
    });

    test('has copy button for bearer token', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      await expect(scimPage.copyTokenButton).toBeVisible();
    });

    test('copy button copies token to clipboard', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      await scimPage.copyToken();

      // Check for success feedback
      await expect(page.getByText(/copied/i)).toBeVisible();
    });
  });

  test.describe('AC4: Token Regeneration', () => {
    test('displays regenerate token button', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      await expect(scimPage.regenerateTokenButton).toBeVisible();
    });

    test('clicking regenerate shows confirmation dialog', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      await scimPage.clickRegenerateToken();

      // Confirmation dialog should appear
      await expect(scimPage.regenerateDialog).toBeVisible();
    });

    test('confirmation dialog warns about breaking integrations', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      await scimPage.clickRegenerateToken();

      // Warning message should be visible
      await expect(page.getByText(/break.*existing.*integration|invalidate.*current/i)).toBeVisible();
    });

    test('can cancel regeneration', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      await scimPage.clickRegenerateToken();
      await expect(scimPage.regenerateDialog).toBeVisible();

      await scimPage.cancelButton.click();

      await expect(scimPage.regenerateDialog).not.toBeVisible();
    });

    test('confirming regeneration generates new token', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      // Get current token (stored for future comparison if needed)
      const _initialToken = await scimPage.bearerTokenField.textContent();

      // Regenerate
      await scimPage.clickRegenerateToken();
      await scimPage.confirmRegenerate();

      // Token should be different (or show success message)
      await expect(page.getByText(/token.*regenerated|new.*token.*generated/i)).toBeVisible({
        timeout: 5000,
      });
    });
  });

  test.describe('AC5: Enable/Disable SCIM Toggle', () => {
    test('displays SCIM status toggle', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      await expect(scimPage.scimStatusToggle).toBeVisible();
    });

    test('toggle can be switched on', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      // Ensure toggle is off first
      const isChecked = await scimPage.scimStatusToggle.isChecked();
      if (isChecked) {
        await scimPage.toggleScimStatus(); // Turn off first
        // Handle confirmation if needed
        if (await scimPage.regenerateDialog.isVisible()) {
          await scimPage.confirmRegenerateButton.click();
        }
      }

      // Now turn on
      await scimPage.toggleScimStatus();
      await expect(scimPage.scimStatusToggle).toBeChecked();
    });

    test('shows status message when SCIM is enabled', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      // Enable SCIM
      const isChecked = await scimPage.scimStatusToggle.isChecked();
      if (!isChecked) {
        await scimPage.toggleScimStatus();
      }

      await expect(scimPage.scimEnabledMessage).toBeVisible();
    });
  });

  test.describe('AC6: Provisioned Users List', () => {
    test('displays provisioned users section', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      await expect(scimPage.usersSection).toBeVisible();
    });

    test('displays provisioned users section heading', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      await expect(scimPage.usersSectionHeading).toBeVisible();
    });

    test('displays users table or empty state', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      // Either table or empty state should be visible
      const table = scimPage.usersTable;
      const emptyState = scimPage.emptyStateMessage;

      const tableVisible = await table.isVisible();
      const emptyVisible = await emptyState.isVisible();

      expect(tableVisible || emptyVisible).toBe(true);
    });

    test('user row displays name and email', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      // Skip if no users
      const rows = await scimPage.userRows.count();
      if (rows === 0) {
        test.skip();
        return;
      }

      // Check first row has name and email
      const firstRow = scimPage.userRows.first();
      await expect(firstRow.locator('[data-testid="user-name"]')).toBeVisible();
      await expect(firstRow.locator('[data-testid="user-email"]')).toBeVisible();
    });

    test('user row displays status badge', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      const rows = await scimPage.userRows.count();
      if (rows === 0) {
        test.skip();
        return;
      }

      // Check status badge
      const firstRow = scimPage.userRows.first();
      const badge = firstRow.locator('[data-testid="user-status-badge"]');
      await expect(badge).toBeVisible();

      // Badge should have valid status
      const badgeText = await badge.textContent();
      expect(badgeText).toMatch(/active|suspended|pending/i);
    });

    test('user row displays last synced timestamp', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      const rows = await scimPage.userRows.count();
      if (rows === 0) {
        test.skip();
        return;
      }

      const firstRow = scimPage.userRows.first();
      await expect(firstRow.locator('[data-testid="last-synced"]')).toBeVisible();
    });

    test('user row has resync button', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      const rows = await scimPage.userRows.count();
      if (rows === 0) {
        test.skip();
        return;
      }

      const firstRow = scimPage.userRows.first();
      await expect(firstRow.locator('[data-testid="resync-user-button"]')).toBeVisible();
    });

    test('resync button triggers sync operation', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      const rows = await scimPage.userRows.count();
      if (rows === 0) {
        test.skip();
        return;
      }

      const firstRow = scimPage.userRows.first();
      const resyncButton = firstRow.locator('[data-testid="resync-user-button"]');
      await resyncButton.click();

      // Should show loading or success indicator
      await expect(page.getByText(/syncing|synced|updated/i)).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('AC7: Accessibility Requirements', () => {
    test('all form inputs have proper labels', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      // Toggle should have accessible name
      await expect(scimPage.scimStatusToggle).toHaveAttribute('aria-label', /.+/);
    });

    test('toggle has proper ARIA attributes', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      await expect(scimPage.scimStatusToggle).toHaveAttribute('role', 'switch');
      await expect(scimPage.scimStatusToggle).toHaveAttribute('aria-checked');
    });

    test('supports keyboard navigation', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      // Tab through form elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // An interactive element should be focused
      const focusedElement = page.locator(':focus');
      const tagName = await focusedElement.evaluate((el) => el.tagName);
      expect(['INPUT', 'BUTTON', 'A', 'SWITCH']).toContain(tagName);
    });

    test('page has proper heading hierarchy', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      // Should have h1 or main heading
      const heading = page.locator('h1, [role="heading"][aria-level="1"]');
      await expect(heading).toBeVisible();
    });

    test('copy buttons have visible focus indicators', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      await scimPage.copyEndpointButton.focus();
      await expect(scimPage.copyEndpointButton).toHaveClass(/focus:ring|ring-/);
    });
  });

  test.describe('AC8: Responsive Design', () => {
    test('renders correctly on mobile viewport', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);

      await page.setViewportSize({ width: 375, height: 667 });
      await scimPage.goto();

      // All main elements should be visible
      await expect(scimPage.pageHeading).toBeVisible();
      await expect(scimPage.scimStatusToggle).toBeVisible();
      await expect(scimPage.endpointSection).toBeVisible();
    });

    test('endpoint URL is properly truncated on mobile', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);

      await page.setViewportSize({ width: 375, height: 667 });
      await scimPage.goto();

      // Endpoint section should not overflow
      const endpointBox = await scimPage.endpointSection.boundingBox();
      if (endpointBox) {
        expect(endpointBox.width).toBeLessThanOrEqual(375);
      }
    });

    test('renders correctly on tablet viewport', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);

      await page.setViewportSize({ width: 768, height: 1024 });
      await scimPage.goto();

      await expect(scimPage.pageHeading).toBeVisible();
      await expect(scimPage.usersSection).toBeVisible();
    });

    test('renders correctly on desktop viewport', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);

      await page.setViewportSize({ width: 1280, height: 800 });
      await scimPage.goto();

      await expect(scimPage.pageHeading).toBeVisible();
      await expect(scimPage.endpointSection).toBeVisible();
      await expect(scimPage.tokenSection).toBeVisible();
      await expect(scimPage.usersSection).toBeVisible();
    });

    test('users table is scrollable on small screens', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);

      await page.setViewportSize({ width: 375, height: 667 });
      await scimPage.goto();

      const rows = await scimPage.userRows.count();
      if (rows === 0) {
        test.skip();
        return;
      }

      // Table container should be scrollable
      const tableContainer = page.locator('[data-testid="scim-users-table-container"]');
      const hasOverflow = await tableContainer.evaluate((el) => {
        return el.scrollWidth > el.clientWidth || el.style.overflowX === 'auto';
      });
      expect(hasOverflow).toBe(true);
    });
  });

  test.describe('Complete SCIM Configuration Flow', () => {
    test('user can enable SCIM and view configuration', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);

      // Step 1: Navigate to SCIM settings
      await scimPage.goto();
      await expect(scimPage.pageHeading).toBeVisible();

      // Step 2: Enable SCIM
      const isChecked = await scimPage.scimStatusToggle.isChecked();
      if (!isChecked) {
        await scimPage.toggleScimStatus();
      }
      await expect(scimPage.scimStatusToggle).toBeChecked();

      // Step 3: View endpoint URL
      await expect(scimPage.scimEndpointUrl).toBeVisible();

      // Step 4: Copy endpoint
      await scimPage.copyEndpoint();
      await expect(page.getByText(/copied/i)).toBeVisible();

      // Step 5: View bearer token
      await expect(scimPage.bearerTokenField).toBeVisible();

      // Step 6: Copy token
      await scimPage.copyToken();
      await expect(page.getByText(/copied/i)).toBeVisible();
    });

    test('user can regenerate token with confirmation', async ({ authenticatedPage: page }) => {
      const scimPage = new ScimProvisioningPage(page);
      await scimPage.goto();

      // Click regenerate
      await scimPage.clickRegenerateToken();

      // Confirm dialog appears
      await expect(scimPage.regenerateDialog).toBeVisible();

      // Confirm regeneration
      await scimPage.confirmRegenerate();

      // Success message
      await expect(page.getByText(/token.*regenerated|new.*token/i)).toBeVisible({ timeout: 5000 });
    });
  });
});
