/**
 * MFA Setup E2E Tests
 *
 * Story: 1-1-7 MFA Setup - Method Selection
 * Wireframe: mfa_method_selection
 *
 * TDD RED PHASE: These tests are written to FAIL initially.
 * They verify acceptance criteria from story 1-1-7:
 * - AC1: Access MFA setup from security settings
 * - AC2: Display MFA method options (Authenticator App, SMS, Email)
 * - AC3: Method selection visual feedback
 * - AC4: Skip option with security warning
 * - AC5: Continue to method-specific setup
 * - AC6: Informational content (Why enable 2FA?)
 * - AC7: Accessibility requirements
 * - AC8: Responsive design
 */

import { test, expect } from '../../support/fixtures';

/**
 * MFA Setup Page Object for clean test organization
 */
class MfaSetupPage {
  constructor(private page: import('@playwright/test').Page) {}

  // Navigation
  async goto() {
    await this.page.goto('/auth/mfa-setup');
    await this.page.waitForLoadState('networkidle');
  }

  async gotoFromSecuritySettings() {
    await this.page.goto('/settings/security');
    await this.page.waitForLoadState('networkidle');
  }

  // Page elements based on wireframe: mfa_method_selection/code.html
  get heading() {
    return this.page.getByRole('heading', { name: /choose authentication method/i });
  }

  get subheading() {
    return this.page.getByText(/add an extra layer of security to your hyyve workspace/i);
  }

  // Breadcrumbs (wireframe lines 88-94)
  get breadcrumbs() {
    return this.page.locator('nav').filter({ hasText: /settings.*security.*mfa setup/i });
  }

  get settingsLink() {
    return this.page.getByRole('link', { name: /settings/i });
  }

  get securityLink() {
    return this.page.getByRole('link', { name: /security/i });
  }

  // Radiogroup container (wireframe lines 101-150)
  get radioGroup() {
    return this.page.getByRole('radiogroup', { name: /mfa methods/i });
  }

  // MFA Method Options (wireframe lines 102-149)
  get authenticatorAppOption() {
    return this.page.getByRole('radio', { name: /authenticator app/i });
  }

  get smsOption() {
    return this.page.getByRole('radio', { name: /sms verification/i });
  }

  get emailOption() {
    return this.page.getByRole('radio', { name: /email verification/i });
  }

  // Method cards
  get authenticatorCard() {
    return this.page.locator('label').filter({ hasText: /authenticator app/i });
  }

  get smsCard() {
    return this.page.locator('label').filter({ hasText: /sms verification/i });
  }

  get emailCard() {
    return this.page.locator('label').filter({ hasText: /email verification/i });
  }

  // Recommended badge (wireframe line 114)
  get recommendedBadge() {
    return this.page.locator('text=Recommended');
  }

  // Method descriptions (wireframe lines 116, 131, 146)
  get authenticatorDescription() {
    return this.page.getByText(/use google authenticator, authy, or 1password/i);
  }

  get smsDescription() {
    return this.page.getByText(/receive a unique one-time code via text message/i);
  }

  get emailDescription() {
    return this.page.getByText(/receive a unique one-time code via your registered email/i);
  }

  // Info box (wireframe lines 152-158)
  get infoBox() {
    return this.page.locator('.bg-blue-500\\/10, [class*="bg-blue"]').filter({ hasText: /why enable 2fa/i });
  }

  get infoBoxTitle() {
    return this.page.getByRole('heading', { name: /why enable 2fa/i, level: 4 });
  }

  get infoBoxContent() {
    return this.page.getByText(/two-factor authentication adds an extra layer of security/i);
  }

  // Action buttons (wireframe lines 160-168)
  get cancelButton() {
    return this.page.getByRole('button', { name: /cancel/i });
  }

  get continueButton() {
    return this.page.getByRole('button', { name: /continue setup/i });
  }

  // Security warning dialog (for AC4)
  get securityWarningDialog() {
    return this.page.getByRole('dialog');
  }

  get securityWarningTitle() {
    return this.page.getByRole('heading', { name: /skip mfa setup|security warning/i });
  }

  get skipAnywayButton() {
    return this.page.getByRole('button', { name: /skip|continue without mfa/i });
  }

  get returnToSetupButton() {
    return this.page.getByRole('button', { name: /return to setup|go back/i });
  }

  // Header elements (wireframe lines 66-83)
  get logo() {
    return this.page.locator('[data-testid="hyyve-logo"], .text-primary svg').first();
  }

  get supportButton() {
    return this.page.getByRole('button', { name: /support/i });
  }

  get userAvatar() {
    return this.page.locator('[data-alt="User profile avatar"], [aria-label*="profile"], [aria-label*="avatar"]');
  }

  // Actions
  async selectAuthenticatorApp() {
    await this.authenticatorCard.click();
  }

  async selectSms() {
    await this.smsCard.click();
  }

  async selectEmail() {
    await this.emailCard.click();
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }
}

test.describe('MFA Setup - Story 1-1-7', () => {
  test.describe('AC1: Access MFA Setup from Security Settings', () => {
    test('navigates to MFA setup from security settings', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);

      // Navigate to Security Settings
      await mfaSetup.gotoFromSecuritySettings();

      // Click "Enable Two-Factor Authentication" button
      const enableMfaButton = page.getByRole('button', { name: /enable two-factor authentication/i });
      await expect(enableMfaButton).toBeVisible();
      await enableMfaButton.click();

      // Should navigate to MFA setup page
      await expect(page).toHaveURL(/\/auth\/mfa-setup/);
    });

    test('MFA setup page loads at /auth/mfa-setup', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // Verify URL
      await expect(page).toHaveURL(/\/auth\/mfa-setup/);

      // Verify page heading
      await expect(mfaSetup.heading).toBeVisible();
    });

    test('redirects unauthenticated users to sign-in', async ({ page }) => {
      // Try to access MFA setup without authentication
      await page.goto('/auth/mfa-setup');

      // Should redirect to sign-in
      await expect(page).toHaveURL(/sign-in/);
    });
  });

  test.describe('AC2: Display MFA Method Options', () => {
    test('displays all three MFA method options', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // All three options should be visible
      await expect(mfaSetup.authenticatorAppOption).toBeVisible();
      await expect(mfaSetup.smsOption).toBeVisible();
      await expect(mfaSetup.emailOption).toBeVisible();
    });

    test('shows "Recommended" badge on Authenticator App option', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // Recommended badge should be visible
      await expect(mfaSetup.recommendedBadge).toBeVisible();

      // Badge should be within the Authenticator App card
      const badgeContainer = mfaSetup.authenticatorCard;
      await expect(badgeContainer.locator('text=Recommended')).toBeVisible();
    });

    test('Authenticator App is pre-selected by default', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // Authenticator App radio should be checked by default
      await expect(mfaSetup.authenticatorAppOption).toBeChecked();
    });

    test('displays descriptions for each MFA method', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // Each option should have a description
      await expect(mfaSetup.authenticatorDescription).toBeVisible();
      await expect(mfaSetup.smsDescription).toBeVisible();
      await expect(mfaSetup.emailDescription).toBeVisible();
    });

    test('method options are displayed as radio button cards', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // Verify radiogroup exists with proper label
      await expect(mfaSetup.radioGroup).toBeVisible();
      await expect(mfaSetup.radioGroup).toHaveAttribute('aria-label', /mfa methods/i);

      // Each option should be within a label element (card)
      await expect(mfaSetup.authenticatorCard).toBeVisible();
      await expect(mfaSetup.smsCard).toBeVisible();
      await expect(mfaSetup.emailCard).toBeVisible();
    });
  });

  test.describe('AC3: Method Selection Visual Feedback', () => {
    test('changes selection when clicking SMS option', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // Click SMS option
      await mfaSetup.selectSms();

      // SMS should be checked, Authenticator should not
      await expect(mfaSetup.smsOption).toBeChecked();
      await expect(mfaSetup.authenticatorAppOption).not.toBeChecked();
    });

    test('changes selection when clicking Email option', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // Click Email option
      await mfaSetup.selectEmail();

      // Email should be checked, Authenticator should not
      await expect(mfaSetup.emailOption).toBeChecked();
      await expect(mfaSetup.authenticatorAppOption).not.toBeChecked();
    });

    test('selected card shows primary border styling', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // Initially, Authenticator App should have primary border
      await expect(mfaSetup.authenticatorCard).toHaveClass(/border-primary/);

      // Select SMS
      await mfaSetup.selectSms();

      // SMS should now have primary border, Authenticator should not
      await expect(mfaSetup.smsCard).toHaveClass(/border-primary/);
      await expect(mfaSetup.authenticatorCard).not.toHaveClass(/border-primary/);
    });

    test('selected card shows primary background tint', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // Initially, Authenticator App should have primary background
      await expect(mfaSetup.authenticatorCard).toHaveClass(/bg-primary/);

      // Select Email
      await mfaSetup.selectEmail();

      // Email should now have primary background
      await expect(mfaSetup.emailCard).toHaveClass(/bg-primary/);
    });

    test('only one option can be selected at a time', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // Select SMS
      await mfaSetup.selectSms();
      await expect(mfaSetup.smsOption).toBeChecked();

      // Select Email
      await mfaSetup.selectEmail();

      // Only Email should be checked
      await expect(mfaSetup.emailOption).toBeChecked();
      await expect(mfaSetup.smsOption).not.toBeChecked();
      await expect(mfaSetup.authenticatorAppOption).not.toBeChecked();
    });
  });

  test.describe('AC4: Skip Option with Warning', () => {
    test('clicking Cancel shows security warning dialog', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // Click Cancel button
      await mfaSetup.clickCancel();

      // Security warning dialog should appear
      await expect(mfaSetup.securityWarningDialog).toBeVisible();
    });

    test('security warning dialog has warning message', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      await mfaSetup.clickCancel();

      // Dialog should contain warning about security risks
      await expect(page.getByText(/security|risk|recommend|protect/i)).toBeVisible();
    });

    test('can continue without MFA from warning dialog', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      await mfaSetup.clickCancel();
      await expect(mfaSetup.securityWarningDialog).toBeVisible();

      // Click skip/continue without MFA
      await mfaSetup.skipAnywayButton.click();

      // Should navigate away from MFA setup
      await expect(page).not.toHaveURL(/\/auth\/mfa-setup$/);
    });

    test('can return to setup from warning dialog', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      await mfaSetup.clickCancel();
      await expect(mfaSetup.securityWarningDialog).toBeVisible();

      // Click return to setup
      await mfaSetup.returnToSetupButton.click();

      // Dialog should close, still on MFA setup page
      await expect(mfaSetup.securityWarningDialog).not.toBeVisible();
      await expect(page).toHaveURL(/\/auth\/mfa-setup/);
    });

    test('can close warning dialog by clicking outside', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      await mfaSetup.clickCancel();
      await expect(mfaSetup.securityWarningDialog).toBeVisible();

      // Press Escape to close dialog
      await page.keyboard.press('Escape');

      // Dialog should close
      await expect(mfaSetup.securityWarningDialog).not.toBeVisible();
    });
  });

  test.describe('AC5: Continue to Method-Specific Setup', () => {
    test('navigates to authenticator setup when Authenticator App is selected', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // Authenticator App is selected by default
      await expect(mfaSetup.authenticatorAppOption).toBeChecked();

      // Click Continue
      await mfaSetup.clickContinue();

      // Should navigate to authenticator setup
      await expect(page).toHaveURL(/\/auth\/mfa-setup\/authenticator/);
    });

    test('navigates to SMS setup when SMS Verification is selected', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // Select SMS
      await mfaSetup.selectSms();

      // Click Continue
      await mfaSetup.clickContinue();

      // Should navigate to SMS setup
      await expect(page).toHaveURL(/\/auth\/mfa-setup\/sms/);
    });

    test('navigates to email setup when Email Verification is selected', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // Select Email
      await mfaSetup.selectEmail();

      // Click Continue
      await mfaSetup.clickContinue();

      // Should navigate to email setup
      await expect(page).toHaveURL(/\/auth\/mfa-setup\/email/);
    });

    test('Continue button is enabled when a method is selected', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // Continue button should be enabled (Authenticator is selected by default)
      await expect(mfaSetup.continueButton).toBeEnabled();
    });
  });

  test.describe('AC6: Informational Content', () => {
    test('displays "Why enable 2FA?" info box', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // Info box should be visible
      await expect(mfaSetup.infoBox).toBeVisible();
    });

    test('info box has correct title', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      await expect(page.getByText(/why enable 2fa\?/i)).toBeVisible();
    });

    test('info box explains security benefits', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // Info box content should mention security benefits
      await expect(mfaSetup.infoBoxContent).toBeVisible();
      await expect(page.getByText(/extra layer of security/i)).toBeVisible();
    });
  });

  test.describe('AC7: Accessibility Requirements', () => {
    test('radiogroup has proper ARIA label', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // Radiogroup should have aria-label
      const radiogroup = page.locator('[role="radiogroup"]');
      await expect(radiogroup).toHaveAttribute('aria-label', /mfa methods/i);
    });

    test('radio buttons have aria-labelledby', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // Each radio should have aria-labelledby referencing its label
      const authenticatorRadio = page.locator('input[type="radio"][value="app"]');
      await expect(authenticatorRadio).toHaveAttribute('aria-labelledby', /option-app-label/i);
    });

    test('radio buttons have aria-describedby', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // Each radio should have aria-describedby referencing its description
      const authenticatorRadio = page.locator('input[type="radio"][value="app"]');
      await expect(authenticatorRadio).toHaveAttribute('aria-describedby', /option-app-desc/i);
    });

    test('supports keyboard navigation with Tab', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // Focus on the page
      await page.keyboard.press('Tab');

      // Should be able to tab to the radiogroup
      await page.keyboard.press('Tab');

      // One of the radio buttons should be focused
      const focusedElement = page.locator(':focus');
      const isRadioFocused = await focusedElement.evaluate((el) => el.tagName === 'INPUT' && el.getAttribute('type') === 'radio');
      expect(isRadioFocused || await focusedElement.evaluate((el) => el.closest('[role="radiogroup"]') !== null)).toBeTruthy();
    });

    test('supports keyboard selection with Enter/Space', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // Focus on SMS radio using Arrow keys within radiogroup
      await mfaSetup.authenticatorAppOption.focus();
      await page.keyboard.press('ArrowDown');

      // Press Space to select
      await page.keyboard.press('Space');

      // SMS should be selected
      await expect(mfaSetup.smsOption).toBeChecked();
    });

    test('supports navigation with Arrow keys', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // Focus on first radio
      await mfaSetup.authenticatorAppOption.focus();

      // Press ArrowDown to move to SMS
      await page.keyboard.press('ArrowDown');
      await expect(mfaSetup.smsOption).toBeChecked();

      // Press ArrowDown to move to Email
      await page.keyboard.press('ArrowDown');
      await expect(mfaSetup.emailOption).toBeChecked();

      // Press ArrowUp to go back to SMS
      await page.keyboard.press('ArrowUp');
      await expect(mfaSetup.smsOption).toBeChecked();
    });

    test('page has proper heading hierarchy', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // Main heading should be h1
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
      await expect(h1).toHaveText(/choose authentication method/i);

      // Info box heading should be h4
      const h4 = page.locator('h4');
      await expect(h4).toBeVisible();
      await expect(h4).toHaveText(/why enable 2fa/i);
    });

    test('buttons have visible focus indicators', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // Focus on Continue button
      await mfaSetup.continueButton.focus();

      // Should have focus ring
      await expect(mfaSetup.continueButton).toHaveClass(/focus:ring/);
    });
  });

  test.describe('AC8: Responsive Design', () => {
    test('renders correctly on mobile viewport', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);

      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await mfaSetup.goto();

      // All elements should be visible
      await expect(mfaSetup.heading).toBeVisible();
      await expect(mfaSetup.authenticatorAppOption).toBeVisible();
      await expect(mfaSetup.smsOption).toBeVisible();
      await expect(mfaSetup.emailOption).toBeVisible();
      await expect(mfaSetup.continueButton).toBeVisible();
    });

    test('buttons stack vertically on mobile', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);

      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await mfaSetup.goto();

      // Get button positions
      const cancelBox = await mfaSetup.cancelButton.boundingBox();
      const continueBox = await mfaSetup.continueButton.boundingBox();

      // On mobile, buttons should be stacked (different Y positions)
      if (cancelBox && continueBox) {
        expect(cancelBox.y).not.toBe(continueBox.y);
      }
    });

    test('heading uses smaller font on mobile', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);

      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await mfaSetup.goto();

      // Heading should have text-3xl class (or equivalent mobile class)
      await expect(mfaSetup.heading).toHaveClass(/text-3xl|md:text-4xl/);
    });

    test('renders correctly on tablet viewport', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);

      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await mfaSetup.goto();

      // All elements should be visible
      await expect(mfaSetup.heading).toBeVisible();
      await expect(mfaSetup.breadcrumbs).toBeVisible();
      await expect(mfaSetup.infoBox).toBeVisible();
    });

    test('renders correctly on desktop viewport', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);

      // Set desktop viewport
      await page.setViewportSize({ width: 1280, height: 800 });
      await mfaSetup.goto();

      // All elements should be visible
      await expect(mfaSetup.heading).toBeVisible();

      // Content should be centered with max-width
      const main = page.locator('main');
      const mainBox = await main.boundingBox();
      if (mainBox) {
        expect(mainBox.width).toBeLessThanOrEqual(1280);
      }
    });
  });

  test.describe('Page Layout and Branding', () => {
    test('displays header with Hyyve logo', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // Logo should be visible in header
      await expect(page.locator('header')).toBeVisible();
      await expect(page.getByText('Hyyve').first()).toBeVisible();
    });

    test('displays Support link in header', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      await expect(mfaSetup.supportButton).toBeVisible();
    });

    test('displays user avatar in header', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // User avatar or profile indicator should be visible
      const header = page.locator('header');
      const avatarOrProfile = header.locator('[data-alt*="avatar"], [data-alt*="profile"], [aria-label*="avatar"], [aria-label*="profile"], .rounded-full');
      await expect(avatarOrProfile.first()).toBeVisible();
    });

    test('displays breadcrumb navigation', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // Breadcrumb should show: Settings / Security / MFA Setup
      await expect(page.getByText('Settings').first()).toBeVisible();
      await expect(page.getByText('Security').first()).toBeVisible();
      await expect(page.getByText('MFA Setup')).toBeVisible();
    });

    test('Settings breadcrumb is a link', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      await expect(mfaSetup.settingsLink).toHaveAttribute('href', /.+/);
    });

    test('Security breadcrumb is a link', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      await expect(mfaSetup.securityLink).toHaveAttribute('href', /.+/);
    });
  });

  test.describe('Complete MFA Setup Flow', () => {
    test('user can complete full authenticator app selection flow', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // Verify page loaded
      await expect(mfaSetup.heading).toBeVisible();

      // Authenticator should be pre-selected
      await expect(mfaSetup.authenticatorAppOption).toBeChecked();

      // Continue to next step
      await mfaSetup.clickContinue();

      // Should navigate to authenticator setup
      await expect(page).toHaveURL(/\/auth\/mfa-setup\/authenticator/);
    });

    test('user can select different method and continue', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // Select SMS
      await mfaSetup.selectSms();
      await expect(mfaSetup.smsOption).toBeChecked();

      // Continue to next step
      await mfaSetup.clickContinue();

      // Should navigate to SMS setup
      await expect(page).toHaveURL(/\/auth\/mfa-setup\/sms/);
    });

    test('user can cancel and dismiss warning to stay on page', async ({ authenticatedPage: page }) => {
      const mfaSetup = new MfaSetupPage(page);
      await mfaSetup.goto();

      // Click cancel
      await mfaSetup.clickCancel();

      // Warning dialog appears
      await expect(mfaSetup.securityWarningDialog).toBeVisible();

      // Return to setup
      await mfaSetup.returnToSetupButton.click();

      // Still on MFA setup, options still visible
      await expect(page).toHaveURL(/\/auth\/mfa-setup/);
      await expect(mfaSetup.authenticatorAppOption).toBeVisible();
    });
  });
});
