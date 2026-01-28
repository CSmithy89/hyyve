/**
 * SMS MFA Setup E2E Tests
 *
 * Story: 1-1-10 MFA SMS Verification
 * Wireframe: mfa_method_selection, account_&_security_settings_2
 *
 * Tests verify acceptance criteria from story 1-1-10:
 * - AC1: Navigate from method selection
 * - AC2: Display phone number input
 * - AC3: Country code selector
 * - AC4: Phone number validation
 * - AC5: Send verification code
 * - AC6: Display SMS code input
 * - AC7: Resend code with cooldown
 * - AC8: Verify SMS code
 * - AC11: Skip/cancel setup
 * - AC12: Information boxes
 * - AC14: Responsive design
 * - AC15: Accessibility requirements
 */

import { test, expect } from '../../support/fixtures';

/**
 * SMS MFA Setup Page Object
 */
class SmsMfaSetupPage {
  constructor(private page: import('@playwright/test').Page) {}

  // Navigation
  async goto() {
    await this.page.goto('/auth/mfa-setup/sms');
    await this.page.waitForLoadState('networkidle');
  }

  async gotoFromMethodSelection() {
    await this.page.goto('/auth/mfa-setup');
    await this.page.waitForLoadState('networkidle');
    await this.smsMethodOption.click();
    await this.continueButton.click();
    await this.page.waitForURL(/\/auth\/mfa-setup\/sms/);
  }

  // Page elements
  get heading() {
    return this.page.getByRole('heading', { name: /setup sms verification/i });
  }

  get description() {
    return this.page.getByText(/receive verification codes via text message/i);
  }

  get backLink() {
    return this.page.getByRole('link', { name: /back to method selection/i });
  }

  // Step 1: Phone Entry
  get step1Indicator() {
    return this.page.getByText('1');
  }

  get step1Label() {
    return this.page.getByText(/enter phone number/i);
  }

  get phoneInput() {
    return this.page.getByRole('textbox', { name: /phone number/i });
  }

  get countryCodeSelector() {
    return this.page.getByRole('combobox', { name: /country code/i });
  }

  get sendCodeButton() {
    return this.page.getByRole('button', { name: /send.*code/i });
  }

  // Step 2: Verification
  get step2Indicator() {
    return this.page.getByText('2');
  }

  get step2Label() {
    return this.page.getByText(/enter verification code/i);
  }

  get otpInputs() {
    return this.page.locator('input[maxlength="1"]');
  }

  get verifyButton() {
    return this.page.getByRole('button', { name: /verify/i });
  }

  get resendButton() {
    return this.page.getByRole('button', { name: /resend/i });
  }

  get cooldownTimer() {
    return this.page.getByText(/\d+s/);
  }

  // Skip/Cancel
  get skipButton() {
    return this.page.getByRole('button', { name: /i'll do this later/i });
  }

  get warningDialog() {
    return this.page.getByRole('dialog');
  }

  get returnToSetupButton() {
    return this.page.getByRole('button', { name: /return to setup|go back/i });
  }

  get confirmSkipButton() {
    return this.page.getByRole('button', { name: /skip|continue without/i });
  }

  // Info boxes
  get whySmsInfoBox() {
    return this.page.getByText(/why sms verification\?/i);
  }

  get helpInfoBox() {
    return this.page.getByText(/didn't receive|having trouble/i);
  }

  // From method selection page
  get smsMethodOption() {
    return this.page.getByRole('radio', { name: /sms verification/i });
  }

  get continueButton() {
    return this.page.getByRole('button', { name: /continue setup/i });
  }

  // Actions
  async enterPhoneNumber(phone: string) {
    await this.phoneInput.fill(phone);
  }

  async selectCountry(country: string) {
    await this.countryCodeSelector.click();
    await this.page.getByText(new RegExp(country, 'i')).click();
  }

  async clickSendCode() {
    await this.sendCodeButton.click();
  }

  async enterVerificationCode(code: string) {
    for (let i = 0; i < code.length; i++) {
      await this.otpInputs.nth(i).fill(code[i]);
    }
  }

  async clickVerify() {
    await this.verifyButton.click();
  }

  async clickSkip() {
    await this.skipButton.click();
  }
}

test.describe('SMS MFA Setup - Story 1-1-10', () => {
  test.describe('AC1: Navigate from Method Selection', () => {
    test('navigates to SMS setup from method selection', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.gotoFromMethodSelection();

      await expect(page).toHaveURL(/\/auth\/mfa-setup\/sms/);
      await expect(smsSetup.heading).toBeVisible();
    });

    test('SMS setup page loads at /auth/mfa-setup/sms', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await expect(page).toHaveURL(/\/auth\/mfa-setup\/sms/);
      await expect(smsSetup.heading).toBeVisible();
    });

    test('redirects unauthenticated users to sign-in', async ({ page }) => {
      await page.goto('/auth/mfa-setup/sms');
      await expect(page).toHaveURL(/sign-in/);
    });
  });

  test.describe('AC2: Display Phone Number Input', () => {
    test('displays phone number input field', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await expect(smsSetup.phoneInput).toBeVisible();
    });

    test('displays country code selector', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await expect(smsSetup.countryCodeSelector).toBeVisible();
    });

    test('displays step 1 indicator', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await expect(smsSetup.step1Indicator).toBeVisible();
      await expect(smsSetup.step1Label).toBeVisible();
    });

    test('defaults to US country code', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await expect(page.getByText('+1')).toBeVisible();
    });
  });

  test.describe('AC3: Country Code Selector', () => {
    test('opens dropdown when clicked', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await smsSetup.countryCodeSelector.click();
      await expect(page.getByRole('listbox')).toBeVisible();
    });

    test('shows common countries', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await smsSetup.countryCodeSelector.click();
      await expect(page.getByText(/united states/i)).toBeVisible();
      await expect(page.getByText(/united kingdom/i)).toBeVisible();
    });

    test('updates code when country selected', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await smsSetup.selectCountry('united kingdom');
      await expect(page.getByText('+44')).toBeVisible();
    });
  });

  test.describe('AC4: Phone Number Validation', () => {
    test('Send Code button disabled with empty phone', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await expect(smsSetup.sendCodeButton).toBeDisabled();
    });

    test('Send Code button enabled with valid phone', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await smsSetup.enterPhoneNumber('5551234567');
      await expect(smsSetup.sendCodeButton).toBeEnabled();
    });

    test('only accepts numeric input', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await smsSetup.phoneInput.type('abc123def');
      await expect(smsSetup.phoneInput).toHaveValue(/^\d*$/);
    });
  });

  test.describe('AC5: Send Verification Code', () => {
    test('shows loading state when sending', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await smsSetup.enterPhoneNumber('5551234567');
      await smsSetup.clickSendCode();

      // Should show loading or transition to step 2
      await expect(page.getByText(/sending|enter verification/i)).toBeVisible();
    });

    test('transitions to verification step', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await smsSetup.enterPhoneNumber('5551234567');
      await smsSetup.clickSendCode();

      // Wait for transition
      await page.waitForTimeout(1000);

      await expect(smsSetup.step2Indicator).toBeVisible();
      await expect(smsSetup.step2Label).toBeVisible();
    });
  });

  test.describe('AC6: SMS Code Input', () => {
    test('displays 6 OTP input boxes', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await smsSetup.enterPhoneNumber('5551234567');
      await smsSetup.clickSendCode();
      await page.waitForTimeout(1000);

      const inputs = smsSetup.otpInputs;
      await expect(inputs).toHaveCount(6);
    });

    test('displays masked phone number', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await smsSetup.enterPhoneNumber('5551234567');
      await smsSetup.clickSendCode();
      await page.waitForTimeout(1000);

      await expect(page.getByText(/\*\*\*.*4567/)).toBeVisible();
    });
  });

  test.describe('AC7: Resend Code with Cooldown', () => {
    test('displays Resend button', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await smsSetup.enterPhoneNumber('5551234567');
      await smsSetup.clickSendCode();
      await page.waitForTimeout(1000);

      await expect(smsSetup.resendButton).toBeVisible();
    });

    test('Resend button disabled with countdown', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await smsSetup.enterPhoneNumber('5551234567');
      await smsSetup.clickSendCode();
      await page.waitForTimeout(1000);

      await expect(smsSetup.resendButton).toBeDisabled();
      await expect(smsSetup.cooldownTimer).toBeVisible();
    });
  });

  test.describe('AC8: Verify SMS Code', () => {
    test('Verify button disabled when incomplete', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await smsSetup.enterPhoneNumber('5551234567');
      await smsSetup.clickSendCode();
      await page.waitForTimeout(1000);

      await expect(smsSetup.verifyButton).toBeDisabled();
    });

    test('Verify button enabled when code complete', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await smsSetup.enterPhoneNumber('5551234567');
      await smsSetup.clickSendCode();
      await page.waitForTimeout(1000);

      await smsSetup.enterVerificationCode('123456');
      await expect(smsSetup.verifyButton).toBeEnabled();
    });

    test.skip('navigates to backup codes on success', async ({ authenticatedPage: _page }) => {
      // This test requires mocking the Clerk Phone API
      // or using a test account with known phone number
    });
  });

  test.describe('AC11: Skip/Cancel Setup', () => {
    test('clicking skip shows warning dialog', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await smsSetup.clickSkip();
      await expect(smsSetup.warningDialog).toBeVisible();
    });

    test('can return to setup from warning', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await smsSetup.clickSkip();
      await smsSetup.returnToSetupButton.click();

      await expect(smsSetup.warningDialog).not.toBeVisible();
      await expect(page).toHaveURL(/\/auth\/mfa-setup\/sms/);
    });

    test('confirming skip navigates away', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await smsSetup.clickSkip();
      await smsSetup.confirmSkipButton.click();

      await expect(page).not.toHaveURL(/\/auth\/mfa-setup\/sms$/);
    });
  });

  test.describe('AC12: Information Boxes', () => {
    test('displays "Why SMS verification?" info box', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await expect(smsSetup.whySmsInfoBox).toBeVisible();
    });

    test('displays help info box', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await expect(smsSetup.helpInfoBox).toBeVisible();
    });
  });

  test.describe('AC14: Responsive Design', () => {
    test('renders correctly on mobile', async ({ authenticatedPage: page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await expect(smsSetup.heading).toBeVisible();
      await expect(smsSetup.phoneInput).toBeVisible();
      await expect(smsSetup.sendCodeButton).toBeVisible();
    });

    test('renders correctly on tablet', async ({ authenticatedPage: page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await expect(smsSetup.heading).toBeVisible();
      await expect(smsSetup.whySmsInfoBox).toBeVisible();
    });

    test('renders correctly on desktop', async ({ authenticatedPage: page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await expect(smsSetup.heading).toBeVisible();
    });
  });

  test.describe('AC15: Accessibility', () => {
    test('phone input has accessible label', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await expect(smsSetup.phoneInput).toHaveAttribute('aria-label', /.+/);
    });

    test('country selector has accessible label', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await expect(smsSetup.countryCodeSelector).toHaveAttribute('aria-label', /.+/);
    });

    test('supports keyboard navigation', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await page.keyboard.press('Tab');

      // Should be able to tab through interactive elements
      const focused = page.locator(':focus');
      await expect(focused).toBeVisible();
    });

    test('buttons have visible focus indicators', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await smsSetup.sendCodeButton.focus();
      await expect(smsSetup.sendCodeButton).toHaveClass(/focus:ring/);
    });
  });

  test.describe('Complete SMS Setup Flow', () => {
    test('user can complete phone entry step', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      // Enter phone number
      await smsSetup.enterPhoneNumber('5551234567');
      await expect(smsSetup.sendCodeButton).toBeEnabled();

      // Click send code
      await smsSetup.clickSendCode();

      // Should transition to verification step
      await page.waitForTimeout(1000);
      await expect(smsSetup.step2Indicator).toBeVisible();
    });

    test('user can navigate back to method selection', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await smsSetup.backLink.click();
      await expect(page).toHaveURL(/\/auth\/mfa-setup$/);
    });

    test('user can skip and return to setup', async ({ authenticatedPage: page }) => {
      const smsSetup = new SmsMfaSetupPage(page);
      await smsSetup.goto();

      await smsSetup.clickSkip();
      await expect(smsSetup.warningDialog).toBeVisible();

      await smsSetup.returnToSetupButton.click();
      await expect(page).toHaveURL(/\/auth\/mfa-setup\/sms/);
      await expect(smsSetup.phoneInput).toBeVisible();
    });
  });
});
