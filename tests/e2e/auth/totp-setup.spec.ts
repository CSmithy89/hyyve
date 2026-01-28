/**
 * TOTP Setup E2E Tests
 *
 * Story: 1-1-8 MFA Setup - TOTP Authenticator
 * Wireframe: mfa_authenticator_setup
 *
 * TDD RED PHASE: These tests are written to FAIL initially.
 * They verify acceptance criteria from story 1-1-8:
 * - AC1: Navigate from Method Selection
 * - AC2: Display QR Code for Scanning
 * - AC3: Display Manual Entry Key
 * - AC4: Display TOTP Verification Input
 * - AC5: Auto-Focus and Keyboard Navigation
 * - AC6: Verify and Enable MFA
 * - AC7: Handle Invalid Code
 * - AC8: Display Setup Timer
 * - AC9: Skip/Cancel Setup
 * - AC10: Information Boxes
 * - AC11: Back Navigation
 * - AC12: Loading States
 * - AC13: Responsive Design
 * - AC14: Accessibility Requirements
 */

import { test, expect } from '../../support/fixtures';

/**
 * TOTP Setup Page Object for clean test organization
 */
class TotpSetupPage {
  constructor(private page: import('@playwright/test').Page) {}

  // Navigation
  async goto() {
    await this.page.goto('/auth/mfa-setup/authenticator');
    await this.page.waitForLoadState('networkidle');
  }

  async gotoFromMethodSelection() {
    await this.page.goto('/auth/mfa-setup');
    await this.page.waitForLoadState('networkidle');
    // Select Authenticator App (default) and click Continue
    await this.page.getByRole('radio', { name: /authenticator app/i }).click();
    await this.page.getByRole('button', { name: /continue setup/i }).click();
    await this.page.waitForURL(/\/auth\/mfa-setup\/authenticator/);
  }

  // Page elements based on wireframe: mfa_authenticator_setup/code.html
  get heading() {
    return this.page.getByRole('heading', { name: /enable two-factor authentication/i });
  }

  get description() {
    return this.page.getByText(/secure your account by setting up an authenticator app/i);
  }

  get backLink() {
    return this.page.getByRole('link', { name: /back to security settings/i });
  }

  // Step indicators (wireframe lines 76-77, 96-97)
  get stepOneIndicator() {
    return this.page.locator('.rounded-full').filter({ hasText: '1' });
  }

  get stepTwoIndicator() {
    return this.page.locator('.rounded-full').filter({ hasText: '2' });
  }

  get stepOneTitle() {
    return this.page.getByRole('heading', { name: /scan qr code/i });
  }

  get stepTwoTitle() {
    return this.page.getByRole('heading', { name: /verify code/i });
  }

  // QR Code section (wireframe lines 79-83)
  get qrCode() {
    return this.page.getByAltText(/qr code for mfa setup/i);
  }

  get qrCodeContainer() {
    return this.page.locator('.bg-white.p-4.rounded-lg');
  }

  get scanInstructions() {
    return this.page.getByText(/open your authenticator app and scan the image below/i);
  }

  // Manual key section (wireframe lines 84-91)
  get manualKeyLabel() {
    return this.page.getByText(/unable to scan\? use this setup key:/i);
  }

  get manualKeyInput() {
    return this.page.locator('input[readonly]').filter({ has: this.page.locator('[class*="font-mono"]') });
  }

  get copyButton() {
    return this.page.getByRole('button', { name: /copy/i });
  }

  // OTP Input section (wireframe lines 101-110)
  get otpInputs() {
    return this.page.locator('input[maxlength="1"]');
  }

  get verificationInstructions() {
    return this.page.getByText(/enter the 6-digit verification code/i);
  }

  // Action buttons (wireframe lines 111-124)
  get verifyButton() {
    return this.page.getByRole('button', { name: /verify & enable/i });
  }

  get skipButton() {
    return this.page.getByRole('button', { name: /i'll do this later/i });
  }

  // Timer (wireframe lines 120-123)
  get timer() {
    return this.page.locator('.bg-primary\\/10, [class*="bg-primary"]').filter({ hasText: /\d+:\d+/ });
  }

  get timerIcon() {
    return this.page.locator('.material-symbols-outlined').filter({ hasText: 'timer' });
  }

  // Info boxes (wireframe lines 129-144)
  get whyNeededInfoBox() {
    return this.page.locator('.bg-primary\\/5, [class*="bg-primary"]').filter({ hasText: /why do i need this/i });
  }

  get helpInfoBox() {
    return this.page.locator('[class*="bg-surface-dark"], [class*="bg-white"]').filter({ hasText: /having trouble/i });
  }

  get supportLink() {
    return this.page.getByRole('link', { name: /support/i });
  }

  // Skip warning dialog
  get warningDialog() {
    return this.page.getByRole('dialog');
  }

  get warningMessage() {
    return this.page.getByText(/security|risk|recommend|protect/i);
  }

  get confirmSkipButton() {
    return this.page.getByRole('button', { name: /skip|continue without/i });
  }

  get returnToSetupButton() {
    return this.page.getByRole('button', { name: /return|go back/i });
  }

  // Error message
  get errorMessage() {
    return this.page.getByRole('alert');
  }

  // Actions
  async enterOtpCode(code: string) {
    const inputs = await this.otpInputs.all();
    for (let i = 0; i < code.length && i < 6; i++) {
      await inputs[i].fill(code[i]);
    }
  }

  async pasteOtpCode(code: string) {
    const firstInput = this.otpInputs.first();
    await firstInput.focus();
    await this.page.keyboard.insertText(code);
  }

  async clearOtpInputs() {
    const inputs = await this.otpInputs.all();
    for (const input of inputs) {
      await input.clear();
    }
  }

  async clickVerify() {
    await this.verifyButton.click();
  }

  async clickSkip() {
    await this.skipButton.click();
  }

  async clickCopy() {
    await this.copyButton.click();
  }

  async confirmSkip() {
    await this.confirmSkipButton.click();
  }

  async cancelSkip() {
    await this.returnToSetupButton.click();
  }
}

test.describe('MFA Setup - TOTP Authenticator (Story 1-1-8)', () => {
  test.describe('AC1: Navigate from Method Selection', () => {
    test('navigates to /auth/mfa-setup/authenticator when Authenticator App is selected', async ({
      authenticatedPage: page,
    }) => {
      await page.goto('/auth/mfa-setup');
      await page.waitForLoadState('networkidle');

      // Select Authenticator App (should be default)
      await expect(page.getByRole('radio', { name: /authenticator app/i })).toBeChecked();

      // Click Continue
      await page.getByRole('button', { name: /continue setup/i }).click();

      // Should navigate to authenticator setup
      await expect(page).toHaveURL(/\/auth\/mfa-setup\/authenticator/);
    });

    test('displays "Enable Two-Factor Authentication" heading', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await expect(totpSetup.heading).toBeVisible();
    });

    test('redirects unauthenticated users to sign-in', async ({ page }) => {
      await page.goto('/auth/mfa-setup/authenticator');

      await expect(page).toHaveURL(/sign-in/);
    });
  });

  test.describe('AC2: Display QR Code for Scanning', () => {
    test('displays QR code image', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await expect(totpSetup.qrCode).toBeVisible();
    });

    test('QR code is sized appropriately', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await expect(totpSetup.qrCode).toHaveClass(/size-36|md:size-40/);
    });

    test('displays step indicator "1. Scan QR Code"', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await expect(totpSetup.stepOneIndicator).toBeVisible();
      await expect(totpSetup.stepOneTitle).toBeVisible();
    });

    test('displays scanning instructions', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await expect(totpSetup.scanInstructions).toBeVisible();
    });

    test('QR code container has white background', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      const qrContainer = page.locator('.bg-white').filter({ has: totpSetup.qrCode });
      await expect(qrContainer).toBeVisible();
    });
  });

  test.describe('AC3: Display Manual Entry Key', () => {
    test('displays "Unable to scan?" label', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await expect(totpSetup.manualKeyLabel).toBeVisible();
    });

    test('displays setup key in Base32 format with monospace font', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      const keyInput = page.locator('input[readonly].font-mono, input[readonly][class*="font-mono"]');
      await expect(keyInput).toBeVisible();
    });

    test('setup key is displayed in 4-character groups', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      const keyInput = page.locator('input[readonly]').first();
      const value = await keyInput.inputValue();
      // Should match pattern like "JBSW Y3DP EHPK 3PXP"
      expect(value).toMatch(/^[A-Z2-7]{4}(\s[A-Z2-7]{4})+$/);
    });

    test('copy button is visible', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await expect(totpSetup.copyButton).toBeVisible();
    });

    test('clicking copy button shows visual feedback', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await totpSetup.clickCopy();

      // Should show "Copied" or checkmark feedback
      await expect(page.getByRole('button', { name: /copied/i })).toBeVisible({ timeout: 2000 });
    });

    test('copy button copies key to clipboard', async ({ authenticatedPage: page, context }) => {
      // Grant clipboard permissions
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);

      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await totpSetup.clickCopy();

      // Verify clipboard contains the key (without spaces)
      const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipboardText).toMatch(/^[A-Z2-7]+$/);
    });
  });

  test.describe('AC4: Display TOTP Verification Input', () => {
    test('displays step indicator "2. Verify Code"', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await expect(totpSetup.stepTwoIndicator).toBeVisible();
      await expect(totpSetup.stepTwoTitle).toBeVisible();
    });

    test('displays 6 individual input boxes', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      const inputs = await totpSetup.otpInputs.all();
      expect(inputs).toHaveLength(6);
    });

    test('inputs are separated by a dash in the middle (3 - 3 format)', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      // There should be a dash separator visible
      await expect(page.locator('text=-').first()).toBeVisible();
    });

    test('each input accepts only 1 numeric digit', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      const inputs = await totpSetup.otpInputs.all();

      // Each input should have maxlength="1"
      for (const input of inputs) {
        await expect(input).toHaveAttribute('maxlength', '1');
      }
    });

    test('displays verification instructions', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await expect(totpSetup.verificationInstructions).toBeVisible();
    });
  });

  test.describe('AC5: Auto-Focus and Keyboard Navigation', () => {
    test('focus automatically moves to next input after entering digit', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      const inputs = await totpSetup.otpInputs.all();

      await inputs[0].focus();
      await page.keyboard.type('1');

      // Focus should now be on second input
      await expect(inputs[1]).toBeFocused();
    });

    test('pressing Backspace on empty input moves focus to previous', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      const inputs = await totpSetup.otpInputs.all();

      // Fill first two inputs
      await inputs[0].fill('1');
      await inputs[1].fill('2');

      // Clear second and press backspace
      await inputs[1].clear();
      await inputs[1].focus();
      await page.keyboard.press('Backspace');

      // Focus should be on first input
      await expect(inputs[0]).toBeFocused();
    });

    test('pasting 6-digit code fills all inputs', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await totpSetup.pasteOtpCode('123456');

      const inputs = await totpSetup.otpInputs.all();
      await expect(inputs[0]).toHaveValue('1');
      await expect(inputs[1]).toHaveValue('2');
      await expect(inputs[2]).toHaveValue('3');
      await expect(inputs[3]).toHaveValue('4');
      await expect(inputs[4]).toHaveValue('5');
      await expect(inputs[5]).toHaveValue('6');
    });
  });

  test.describe('AC6: Verify and Enable MFA', () => {
    test('displays "Verify & Enable" button', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await expect(totpSetup.verifyButton).toBeVisible();
    });

    test('Verify button is disabled when code is incomplete', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      // Enter only 3 digits
      await totpSetup.enterOtpCode('123');

      await expect(totpSetup.verifyButton).toBeDisabled();
    });

    test('Verify button is enabled when all 6 digits are entered', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await totpSetup.enterOtpCode('123456');

      await expect(totpSetup.verifyButton).toBeEnabled();
    });

    // Note: Full verification requires actual TOTP code from authenticator
    test.skip('successful verification navigates to backup codes page', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      // This would require a valid TOTP code from the secret
      await totpSetup.enterOtpCode('123456'); // Would need real code
      await totpSetup.clickVerify();

      await expect(page).toHaveURL(/\/auth\/mfa-setup\/backup/);
    });
  });

  test.describe('AC7: Handle Invalid Code', () => {
    test('shows error message when verification fails', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      // Enter invalid code
      await totpSetup.enterOtpCode('000000');
      await totpSetup.clickVerify();

      // Error message should appear
      await expect(page.getByText(/invalid|incorrect/i)).toBeVisible();
    });

    test('input fields are cleared after error', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await totpSetup.enterOtpCode('000000');
      await totpSetup.clickVerify();

      // Wait for error
      await expect(page.getByText(/invalid|incorrect/i)).toBeVisible();

      // Inputs should be cleared
      const inputs = await totpSetup.otpInputs.all();
      for (const input of inputs) {
        await expect(input).toHaveValue('');
      }
    });

    test('first input is re-focused after error', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await totpSetup.enterOtpCode('000000');
      await totpSetup.clickVerify();

      // Wait for error
      await expect(page.getByText(/invalid|incorrect/i)).toBeVisible();

      // First input should be focused
      const firstInput = totpSetup.otpInputs.first();
      await expect(firstInput).toBeFocused();
    });

    test('user can retry with a new code after error', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      // First attempt with invalid code
      await totpSetup.enterOtpCode('000000');
      await totpSetup.clickVerify();

      await expect(page.getByText(/invalid|incorrect/i)).toBeVisible();

      // Should be able to enter a new code
      await totpSetup.enterOtpCode('123456');
      await expect(totpSetup.verifyButton).toBeEnabled();
    });
  });

  test.describe('AC8: Display Setup Timer', () => {
    test('displays countdown timer', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await expect(totpSetup.timer).toBeVisible();
    });

    test('timer shows time in MM:SS format', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      const timerText = await totpSetup.timer.textContent();
      expect(timerText).toMatch(/\d+:\d{2}/);
    });

    test('timer updates over time', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      const initialTime = await totpSetup.timer.textContent();

      // Wait a few seconds
      await page.waitForTimeout(3000);

      const newTime = await totpSetup.timer.textContent();
      expect(newTime).not.toBe(initialTime);
    });

    test('timer has timer icon', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      // Timer icon should be visible (material icon or similar)
      await expect(page.locator('[class*="timer"], .material-symbols-outlined:has-text("timer")').first()).toBeVisible();
    });
  });

  test.describe('AC9: Skip/Cancel Setup', () => {
    test('displays "I\'ll do this later" button', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await expect(totpSetup.skipButton).toBeVisible();
    });

    test('clicking skip button shows confirmation warning', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await totpSetup.clickSkip();

      await expect(totpSetup.warningDialog).toBeVisible();
    });

    test('warning dialog shows security risk message', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await totpSetup.clickSkip();

      await expect(totpSetup.warningMessage).toBeVisible();
    });

    test('can return to setup from warning dialog', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await totpSetup.clickSkip();
      await expect(totpSetup.warningDialog).toBeVisible();

      await totpSetup.cancelSkip();

      await expect(totpSetup.warningDialog).not.toBeVisible();
      await expect(page).toHaveURL(/\/auth\/mfa-setup\/authenticator/);
    });

    test('confirming skip navigates to /settings/security', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await totpSetup.clickSkip();
      await totpSetup.confirmSkip();

      await expect(page).toHaveURL(/\/settings\/security/);
    });

    test('warning dialog can be closed with Escape key', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await totpSetup.clickSkip();
      await expect(totpSetup.warningDialog).toBeVisible();

      await page.keyboard.press('Escape');

      await expect(totpSetup.warningDialog).not.toBeVisible();
    });
  });

  test.describe('AC10: Information Boxes', () => {
    test('displays "Why do I need this?" info box', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await expect(totpSetup.whyNeededInfoBox).toBeVisible();
    });

    test('"Why do I need this?" explains MFA benefits', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await expect(page.getByText(/mfa adds|layer of protection|secure/i)).toBeVisible();
    });

    test('displays "Having trouble?" help box', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await expect(totpSetup.helpInfoBox).toBeVisible();
    });

    test('"Having trouble?" contains support link', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await expect(totpSetup.supportLink).toBeVisible();
      await expect(totpSetup.supportLink).toHaveAttribute('href', /.+/);
    });
  });

  test.describe('AC11: Back Navigation', () => {
    test('displays "Back to Security Settings" link', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await expect(totpSetup.backLink).toBeVisible();
    });

    test('clicking back link navigates to /settings/security', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await totpSetup.backLink.click();

      await expect(page).toHaveURL(/\/settings\/security/);
    });
  });

  test.describe('AC12: Loading States', () => {
    test('shows loading state while generating QR code', async ({ authenticatedPage: page }) => {
      // Navigate with slow network to catch loading state
      await page.route('**/api/**', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        await route.continue();
      });

      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      // Should eventually show QR code after loading
      await expect(totpSetup.qrCode).toBeVisible({ timeout: 5000 });
    });

    test('Verify button shows loading spinner during verification', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await totpSetup.enterOtpCode('000000');

      // Click verify but don't await - we want to catch the loading state
      const verifyPromise = totpSetup.clickVerify();

      // Button should show loading state
      await expect(totpSetup.verifyButton).toHaveAttribute('aria-busy', 'true', { timeout: 500 });

      await verifyPromise;
    });

    test('Verify button is disabled during verification', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await totpSetup.enterOtpCode('000000');

      const verifyPromise = totpSetup.clickVerify();

      // Button should be disabled during verification
      await expect(totpSetup.verifyButton).toBeDisabled({ timeout: 500 });

      await verifyPromise;
    });
  });

  test.describe('AC13: Responsive Design', () => {
    test('renders correctly on mobile viewport', async ({ authenticatedPage: page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      // All key elements should be visible
      await expect(totpSetup.heading).toBeVisible();
      await expect(totpSetup.qrCode).toBeVisible();
      await expect(totpSetup.otpInputs.first()).toBeVisible();
      await expect(totpSetup.verifyButton).toBeVisible();
    });

    test('layout stacks vertically on mobile (< 768px)', async ({ authenticatedPage: page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      // QR code section should be above verification section
      const qrBox = await totpSetup.stepOneTitle.boundingBox();
      const verifyBox = await totpSetup.stepTwoTitle.boundingBox();

      if (qrBox && verifyBox) {
        expect(qrBox.y).toBeLessThan(verifyBox.y);
      }
    });

    test('OTP inputs are appropriately sized on mobile', async ({ authenticatedPage: page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      // Inputs should have mobile sizing classes
      const firstInput = totpSetup.otpInputs.first();
      await expect(firstInput).toHaveClass(/w-10 h-12|sm:w-12 sm:h-14/);
    });

    test('renders correctly on tablet viewport', async ({ authenticatedPage: page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await expect(totpSetup.heading).toBeVisible();
      await expect(totpSetup.qrCode).toBeVisible();
      await expect(totpSetup.whyNeededInfoBox).toBeVisible();
      await expect(totpSetup.helpInfoBox).toBeVisible();
    });

    test('renders correctly on desktop viewport', async ({ authenticatedPage: page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });

      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      // On desktop, QR and verify sections should be side by side
      const qrBox = await totpSetup.stepOneTitle.boundingBox();
      const verifyBox = await totpSetup.stepTwoTitle.boundingBox();

      if (qrBox && verifyBox) {
        // Y positions should be similar on desktop (side by side)
        expect(Math.abs(qrBox.y - verifyBox.y)).toBeLessThan(50);
      }
    });
  });

  test.describe('AC14: Accessibility Requirements', () => {
    test('OTP inputs have proper aria-label', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      const inputs = await totpSetup.otpInputs.all();
      for (let i = 0; i < inputs.length; i++) {
        await expect(inputs[i]).toHaveAttribute('aria-label', new RegExp(`digit ${i + 1}`, 'i'));
      }
    });

    test('QR code has appropriate alt text', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await expect(totpSetup.qrCode).toHaveAttribute('alt', /qr code/i);
    });

    test('copy button has proper aria-label', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await expect(totpSetup.copyButton).toHaveAttribute('aria-label', /copy/i);
    });

    test('supports keyboard navigation with Tab', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      // Tab through the page
      await page.keyboard.press('Tab');

      // Should be able to tab to interactive elements
      const focusedElement = page.locator(':focus');
      const tagName = await focusedElement.evaluate((el) => el.tagName);
      expect(['A', 'BUTTON', 'INPUT']).toContain(tagName);
    });

    test('page has proper heading hierarchy', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      // Main heading should be h1
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
      await expect(h1).toHaveText(/enable two-factor authentication/i);
    });

    test('buttons have visible focus indicators', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await totpSetup.verifyButton.focus();

      // Should have focus ring class
      await expect(totpSetup.verifyButton).toHaveClass(/focus:ring|focus-visible/);
    });

    test('warning dialog traps focus', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await totpSetup.clickSkip();

      // Focus should be inside the dialog
      const focusedElement = page.locator(':focus');
      const isInsideDialog = await focusedElement.evaluate(
        (el) => el.closest('[role="dialog"]') !== null
      );
      expect(isInsideDialog).toBeTruthy();
    });

    test('dialog has proper accessibility attributes', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await totpSetup.clickSkip();

      const dialog = totpSetup.warningDialog;
      await expect(dialog).toHaveAttribute('aria-modal', 'true');
      await expect(dialog).toHaveAttribute('aria-labelledby', /.+/);
    });
  });

  test.describe('Complete TOTP Setup Flow', () => {
    test('user can navigate through entire setup flow', async ({ authenticatedPage: page }) => {
      // Start from method selection
      await page.goto('/auth/mfa-setup');
      await page.waitForLoadState('networkidle');

      // Verify Authenticator App is selected by default
      await expect(page.getByRole('radio', { name: /authenticator app/i })).toBeChecked();

      // Continue to TOTP setup
      await page.getByRole('button', { name: /continue setup/i }).click();
      await expect(page).toHaveURL(/\/auth\/mfa-setup\/authenticator/);

      // Verify QR code and manual key are displayed
      const totpSetup = new TotpSetupPage(page);
      await expect(totpSetup.qrCode).toBeVisible();
      await expect(totpSetup.manualKeyLabel).toBeVisible();

      // Verify OTP inputs are available
      await expect(totpSetup.otpInputs.first()).toBeVisible();
    });

    test('user can copy setup key', async ({ authenticatedPage: page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);

      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await totpSetup.clickCopy();

      // Visual feedback should appear
      await expect(page.getByRole('button', { name: /copied/i })).toBeVisible({ timeout: 2000 });
    });

    test('user can skip setup with warning', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      // Click skip
      await totpSetup.clickSkip();

      // Warning appears
      await expect(totpSetup.warningDialog).toBeVisible();

      // Confirm skip
      await totpSetup.confirmSkip();

      // Navigate to security settings
      await expect(page).toHaveURL(/\/settings\/security/);
    });

    test('user can dismiss skip warning and stay on page', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await totpSetup.clickSkip();
      await expect(totpSetup.warningDialog).toBeVisible();

      await totpSetup.cancelSkip();

      await expect(totpSetup.warningDialog).not.toBeVisible();
      await expect(page).toHaveURL(/\/auth\/mfa-setup\/authenticator/);
      await expect(totpSetup.qrCode).toBeVisible();
    });
  });

  test.describe('Page Layout and Branding', () => {
    test('displays header with Hyyve logo', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      await expect(page.locator('header')).toBeVisible();
      await expect(page.getByText('Hyyve').first()).toBeVisible();
    });

    test('displays user email in header', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      // User email should be visible in header
      const header = page.locator('header');
      await expect(header.getByText(/@/)).toBeVisible();
    });

    test('displays Settings nav item as active', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      const settingsLink = page.locator('header').getByText('Settings');
      await expect(settingsLink).toBeVisible();
      // Should have active styling
      await expect(settingsLink).toHaveClass(/text-primary|text-white/);
    });

    test('content card has correct styling', async ({ authenticatedPage: page }) => {
      const totpSetup = new TotpSetupPage(page);
      await totpSetup.goto();

      const contentCard = page.locator('.bg-surface-dark, .bg-white').filter({
        has: totpSetup.stepOneTitle,
      });
      await expect(contentCard).toHaveClass(/rounded-xl|border/);
    });
  });
});
