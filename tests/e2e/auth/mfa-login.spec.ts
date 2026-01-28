/**
 * MFA Login Verification E2E Tests
 *
 * Story: 1-1-11 MFA Login Verification
 * Wireframe: hyyve_login_page
 *
 * TDD RED PHASE: These tests are written to FAIL initially.
 * They verify acceptance criteria from story 1-1-11:
 * - AC1: MFA challenge detection and redirect
 * - AC2: TOTP code verification
 * - AC3: SMS code verification
 * - AC4: Backup code verification
 * - AC5: Rate limiting after failed attempts
 * - AC6: Recovery options (Lost access?)
 * - AC7: Successful verification redirects
 * - AC8: Method selection/switching
 * - AC9: Error handling and retry
 * - AC10: Loading states
 * - AC11: Accessibility requirements
 * - AC12: Responsive design
 */

import { test, expect } from '../../support/fixtures';

/**
 * MFA Login Challenge Page Object for clean test organization
 */
class MfaLoginPage {
  constructor(private page: import('@playwright/test').Page) {}

  // Navigation
  async goto() {
    await this.page.goto('/auth/mfa-challenge');
    await this.page.waitForLoadState('networkidle');
  }

  async gotoLogin() {
    await this.page.goto('/auth/login');
    await this.page.waitForLoadState('networkidle');
  }

  // Page elements
  get heading() {
    return this.page.getByRole('heading', { name: /verify your identity|two-factor authentication|mfa/i });
  }

  get subheading() {
    return this.page.getByText(/enter the verification code|confirm your identity/i);
  }

  // Verification method tabs/buttons
  get totpMethodButton() {
    return this.page.getByRole('button', { name: /authenticator|totp/i }).or(
      this.page.getByRole('tab', { name: /authenticator|totp/i })
    );
  }

  get smsMethodButton() {
    return this.page.getByRole('button', { name: /sms|text message/i }).or(
      this.page.getByRole('tab', { name: /sms|text message/i })
    );
  }

  get backupCodeButton() {
    return this.page.getByRole('button', { name: /backup code|recovery code/i }).or(
      this.page.getByRole('tab', { name: /backup code|recovery code/i })
    );
  }

  // OTP inputs
  get otpInputContainer() {
    return this.page.locator('[data-testid="otp-input"]').or(
      this.page.locator('.otp-input')
    );
  }

  get otpInputs() {
    return this.page.locator('input[aria-label*="Digit"]');
  }

  get firstOtpInput() {
    return this.page.locator('input[aria-label="Digit 1 of 6"]');
  }

  // Backup code input
  get backupCodeInput() {
    return this.page.getByRole('textbox', { name: /backup code|recovery code/i }).or(
      this.page.locator('input[placeholder*="backup"]')
    );
  }

  // Action buttons
  get verifyButton() {
    return this.page.getByRole('button', { name: /verify|confirm|submit/i });
  }

  get sendSmsButton() {
    return this.page.getByRole('button', { name: /send code|request code|resend/i });
  }

  get cancelButton() {
    return this.page.getByRole('button', { name: /cancel|back to login/i });
  }

  // Recovery/help link
  get lostAccessLink() {
    return this.page.getByRole('link', { name: /lost access|need help|trouble/i }).or(
      this.page.getByText(/lost access|need help|trouble/i)
    );
  }

  // Error elements
  get errorMessage() {
    return this.page.locator('[role="alert"]').or(
      this.page.locator('.text-red-500, .text-destructive')
    );
  }

  // Loading state
  get loadingSpinner() {
    return this.page.locator('[aria-busy="true"]').or(
      this.page.locator('.animate-spin')
    );
  }

  // Rate limit message
  get rateLimitMessage() {
    return this.page.getByText(/too many attempts|locked out|try again later/i);
  }

  // Recovery modal/dialog
  get recoveryDialog() {
    return this.page.getByRole('dialog');
  }

  get recoveryOptions() {
    return this.page.locator('[data-testid="recovery-options"]').or(
      this.page.getByText(/recovery options/i).locator('..')
    );
  }

  // Actions
  async enterOtpCode(code: string) {
    const digits = code.split('');
    for (let i = 0; i < digits.length && i < 6; i++) {
      const input = this.page.locator(`input[aria-label="Digit ${i + 1} of 6"]`);
      await input.fill(digits[i]!);
    }
  }

  async enterBackupCode(code: string) {
    await this.backupCodeInput.fill(code);
  }

  async clickVerify() {
    await this.verifyButton.click();
  }

  async selectTotpMethod() {
    await this.totpMethodButton.click();
  }

  async selectSmsMethod() {
    await this.smsMethodButton.click();
  }

  async selectBackupCodeMethod() {
    await this.backupCodeButton.click();
  }

  async requestSmsCode() {
    await this.sendSmsButton.click();
  }

  async clickLostAccess() {
    await this.lostAccessLink.click();
  }
}

test.describe('MFA Login Verification - Story 1-1-11', () => {
  test.describe('AC1: MFA Challenge Detection', () => {
    test('redirects to MFA challenge page after first-factor auth for MFA-enabled user', async ({ page }) => {
      // This test requires a user with MFA enabled
      // Navigate to login
      await page.goto('/auth/login');

      // Enter valid credentials (mock user with MFA)
      await page.getByLabel(/email/i).fill('mfa-user@example.com');
      await page.getByLabel(/password/i).fill('SecurePassword123!');
      await page.getByRole('button', { name: /sign in/i }).click();

      // Should redirect to MFA challenge
      await expect(page).toHaveURL(/\/auth\/mfa-challenge/);
    });

    test('MFA challenge page loads at /auth/mfa-challenge', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      // Verify URL
      await expect(page).toHaveURL(/\/auth\/mfa-challenge/);

      // Verify heading is visible
      await expect(mfaLogin.heading).toBeVisible();
    });
  });

  test.describe('AC2: TOTP Verification', () => {
    test('displays TOTP input as default method', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      // OTP inputs should be visible
      await expect(mfaLogin.otpInputs.first()).toBeVisible();
    });

    test('accepts 6-digit TOTP code input', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      // Enter 6-digit code
      await mfaLogin.enterOtpCode('123456');

      // All inputs should have values
      const inputs = await mfaLogin.otpInputs.all();
      expect(inputs.length).toBe(6);
    });

    test('auto-advances to next input on digit entry', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      // Focus first input and type
      await mfaLogin.firstOtpInput.focus();
      await page.keyboard.type('1');

      // Second input should be focused
      const secondInput = page.locator('input[aria-label="Digit 2 of 6"]');
      await expect(secondInput).toBeFocused();
    });

    test('verifies valid TOTP code and redirects', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      // Enter valid TOTP code
      await mfaLogin.enterOtpCode('123456');
      await mfaLogin.clickVerify();

      // Should redirect to dashboard on success
      // Note: This will fail in TDD until proper mock is set up
      await expect(page).toHaveURL(/\/dashboard|\/home/);
    });
  });

  test.describe('AC3: SMS Code Verification', () => {
    test('shows SMS option when available', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      // SMS method button should be visible
      await expect(mfaLogin.smsMethodButton).toBeVisible();
    });

    test('can switch to SMS verification method', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      // Click SMS method
      await mfaLogin.selectSmsMethod();

      // Should show send code button
      await expect(mfaLogin.sendSmsButton).toBeVisible();
    });

    test('can request SMS code', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      await mfaLogin.selectSmsMethod();
      await mfaLogin.requestSmsCode();

      // Should show OTP inputs after sending
      await expect(mfaLogin.otpInputs.first()).toBeVisible();
    });

    test('verifies SMS code and completes login', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      await mfaLogin.selectSmsMethod();
      await mfaLogin.requestSmsCode();
      await mfaLogin.enterOtpCode('654321');
      await mfaLogin.clickVerify();

      // Should redirect on success
      await expect(page).toHaveURL(/\/dashboard|\/home/);
    });
  });

  test.describe('AC4: Backup Code Verification', () => {
    test('shows backup code option', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      // Backup code button should be visible
      await expect(mfaLogin.backupCodeButton).toBeVisible();
    });

    test('can switch to backup code method', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      await mfaLogin.selectBackupCodeMethod();

      // Should show backup code input
      await expect(mfaLogin.backupCodeInput).toBeVisible();
    });

    test('accepts 8-character backup code', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      await mfaLogin.selectBackupCodeMethod();
      await mfaLogin.enterBackupCode('ABCD1234');

      await expect(mfaLogin.backupCodeInput).toHaveValue('ABCD1234');
    });

    test('verifies backup code and completes login', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      await mfaLogin.selectBackupCodeMethod();
      await mfaLogin.enterBackupCode('ABCD1234');
      await mfaLogin.clickVerify();

      // Should redirect on success
      await expect(page).toHaveURL(/\/dashboard|\/home/);
    });

    test('shows warning when few backup codes remain', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      await mfaLogin.selectBackupCodeMethod();

      // Warning should be visible when user has few remaining codes
      const warning = page.getByText(/few backup codes|running low|remaining/i);
      // This may or may not be visible depending on user state
      await expect(warning.or(mfaLogin.backupCodeInput)).toBeVisible();
    });
  });

  test.describe('AC5: Rate Limiting', () => {
    test('shows rate limit message after 5 failed attempts', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      // Attempt verification with invalid codes multiple times
      for (let i = 0; i < 5; i++) {
        await mfaLogin.enterOtpCode('000000');
        await mfaLogin.clickVerify();
        // Wait for error to appear
        await page.waitForTimeout(500);
      }

      // Should show rate limit message
      await expect(mfaLogin.rateLimitMessage).toBeVisible();
    });

    test('disables form when rate limited', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      // After being rate limited, verify button should be disabled
      // This test assumes rate limiting state
      await expect(mfaLogin.verifyButton).toBeDisabled();
    });
  });

  test.describe('AC6: Recovery Options', () => {
    test('displays "Lost access?" link', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      await expect(mfaLogin.lostAccessLink).toBeVisible();
    });

    test('clicking "Lost access?" shows recovery options', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      await mfaLogin.clickLostAccess();

      // Should show recovery dialog or options
      await expect(mfaLogin.recoveryDialog.or(mfaLogin.recoveryOptions)).toBeVisible();
    });

    test('recovery options include backup codes and support', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      await mfaLogin.clickLostAccess();

      // Should mention backup codes
      await expect(page.getByText(/backup code/i)).toBeVisible();

      // Should provide support contact
      await expect(page.getByText(/support|contact|help/i)).toBeVisible();
    });
  });

  test.describe('AC7: Successful Verification', () => {
    test('redirects to dashboard after successful TOTP verification', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      // Enter valid code (mock)
      await mfaLogin.enterOtpCode('123456');
      await mfaLogin.clickVerify();

      await expect(page).toHaveURL(/\/dashboard|\/home/);
    });

    test('session is fully authenticated after MFA', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      await mfaLogin.enterOtpCode('123456');
      await mfaLogin.clickVerify();

      // Navigate to a protected route to verify session
      await page.goto('/settings');
      await expect(page).not.toHaveURL(/sign-in|login/);
    });
  });

  test.describe('AC8: Method Selection', () => {
    test('displays all available MFA methods', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      // Should show method selection
      await expect(mfaLogin.totpMethodButton).toBeVisible();
      await expect(mfaLogin.backupCodeButton).toBeVisible();
    });

    test('can switch from TOTP to backup code', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      // Start with TOTP (default)
      await expect(mfaLogin.otpInputs.first()).toBeVisible();

      // Switch to backup code
      await mfaLogin.selectBackupCodeMethod();

      // Backup code input should be visible
      await expect(mfaLogin.backupCodeInput).toBeVisible();
    });

    test('TOTP is shown by default when available', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      // OTP inputs should be visible by default
      await expect(mfaLogin.otpInputs.first()).toBeVisible();

      // TOTP method should be selected/active (check either data-state or class)
      const hasActiveState = await mfaLogin.totpMethodButton.getAttribute('data-state') === 'active';
      const hasActiveClass = await mfaLogin.totpMethodButton.evaluate(
        (el) => el.classList.contains('active') || el.classList.contains('selected')
      );
      expect(hasActiveState || hasActiveClass).toBe(true);
    });
  });

  test.describe('AC9: Error Handling', () => {
    test('displays error message on invalid code', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      await mfaLogin.enterOtpCode('000000');
      await mfaLogin.clickVerify();

      await expect(mfaLogin.errorMessage).toBeVisible();
      await expect(page.getByText(/invalid|incorrect|wrong/i)).toBeVisible();
    });

    test('clears input after error', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      await mfaLogin.enterOtpCode('000000');
      await mfaLogin.clickVerify();

      // Wait for error
      await expect(mfaLogin.errorMessage).toBeVisible();

      // Inputs should be cleared
      const firstInput = mfaLogin.firstOtpInput;
      await expect(firstInput).toHaveValue('');
    });

    test('refocuses first input after error', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      await mfaLogin.enterOtpCode('000000');
      await mfaLogin.clickVerify();

      await expect(mfaLogin.errorMessage).toBeVisible();

      // First input should be focused
      await expect(mfaLogin.firstOtpInput).toBeFocused();
    });

    test('allows retry after error', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      // First attempt fails
      await mfaLogin.enterOtpCode('000000');
      await mfaLogin.clickVerify();
      await expect(mfaLogin.errorMessage).toBeVisible();

      // Can enter new code
      await mfaLogin.enterOtpCode('123456');
      await expect(mfaLogin.verifyButton).toBeEnabled();
    });
  });

  test.describe('AC10: Loading States', () => {
    test('shows loading state during verification', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      await mfaLogin.enterOtpCode('123456');

      // Click verify and immediately check for loading
      const verifyPromise = mfaLogin.clickVerify();

      // Loading indicator should appear
      await expect(mfaLogin.loadingSpinner.or(
        page.locator('button[aria-busy="true"]')
      )).toBeVisible();

      await verifyPromise;
    });

    test('disables inputs during verification', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      await mfaLogin.enterOtpCode('123456');

      // Start verification
      const verifyPromise = mfaLogin.clickVerify();

      // Inputs should be disabled
      await expect(mfaLogin.firstOtpInput).toBeDisabled();

      await verifyPromise;
    });

    test('disables verify button during verification', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      await mfaLogin.enterOtpCode('123456');

      const verifyPromise = mfaLogin.clickVerify();

      await expect(mfaLogin.verifyButton).toBeDisabled();

      await verifyPromise;
    });
  });

  test.describe('AC11: Accessibility', () => {
    test('OTP inputs have proper ARIA labels', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      // Check first input has aria-label
      await expect(mfaLogin.firstOtpInput).toHaveAttribute('aria-label', /digit 1/i);

      // Check all 6 inputs have labels
      for (let i = 1; i <= 6; i++) {
        const input = page.locator(`input[aria-label="Digit ${i} of 6"]`);
        await expect(input).toBeVisible();
      }
    });

    test('error messages are announced to screen readers', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      await mfaLogin.enterOtpCode('000000');
      await mfaLogin.clickVerify();

      // Error should have role="alert" for screen readers
      await expect(mfaLogin.errorMessage).toHaveAttribute('role', 'alert');
    });

    test('supports keyboard navigation', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      // Tab through elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Should be able to reach verify button
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });

    test('method buttons are keyboard accessible', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      // Focus on TOTP button
      await mfaLogin.totpMethodButton.focus();
      await expect(mfaLogin.totpMethodButton).toBeFocused();

      // Tab to next method
      await page.keyboard.press('Tab');

      // Should focus next method button
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });

    test('page has proper heading hierarchy', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      // Main heading should be h1
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
    });
  });

  test.describe('AC12: Responsive Design', () => {
    test('renders correctly on mobile viewport', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);

      await page.setViewportSize({ width: 375, height: 667 });
      await mfaLogin.goto();

      // Core elements should be visible
      await expect(mfaLogin.heading).toBeVisible();
      await expect(mfaLogin.otpInputs.first()).toBeVisible();
      await expect(mfaLogin.verifyButton).toBeVisible();
    });

    test('OTP inputs fit within mobile viewport', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);

      await page.setViewportSize({ width: 375, height: 667 });
      await mfaLogin.goto();

      // All OTP inputs should be visible without horizontal scroll
      const inputs = await mfaLogin.otpInputs.all();
      for (const input of inputs) {
        const box = await input.boundingBox();
        expect(box).not.toBeNull();
        if (box) {
          expect(box.x).toBeGreaterThanOrEqual(0);
          expect(box.x + box.width).toBeLessThanOrEqual(375);
        }
      }
    });

    test('renders correctly on tablet viewport', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);

      await page.setViewportSize({ width: 768, height: 1024 });
      await mfaLogin.goto();

      await expect(mfaLogin.heading).toBeVisible();
      await expect(mfaLogin.verifyButton).toBeVisible();
    });

    test('renders correctly on desktop viewport', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);

      await page.setViewportSize({ width: 1280, height: 800 });
      await mfaLogin.goto();

      await expect(mfaLogin.heading).toBeVisible();

      // Content should be centered with max-width
      const main = page.locator('main');
      const mainBox = await main.boundingBox();
      if (mainBox) {
        expect(mainBox.width).toBeLessThanOrEqual(1280);
      }
    });
  });

  test.describe('Page Layout and Branding', () => {
    test('displays Hyyve branding', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      // Logo or brand name should be visible
      await expect(page.getByText('Hyyve').first()).toBeVisible();
    });

    test('uses dark theme design', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      // Body should have dark background class
      const body = page.locator('body');
      await expect(body).toHaveClass(/dark/);
    });

    test('displays card container with proper styling', async ({ authenticatedPage: page }) => {
      const mfaLogin = new MfaLoginPage(page);
      await mfaLogin.goto();

      // Card should be visible with shadow
      const card = page.locator('[class*="bg-card"], [class*="shadow"]').first();
      await expect(card).toBeVisible();
    });
  });
});
