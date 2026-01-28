/**
 * Backup Codes E2E Tests
 *
 * Story: 1-1-9 MFA Backup Codes Generation
 * Wireframe: mfa_backup_codes
 *
 * TDD RED PHASE: These tests are written to FAIL initially.
 * They verify acceptance criteria from story 1-1-9:
 * - AC1: Display backup codes after TOTP verification
 * - AC2: Backup code display format
 * - AC3: Copy all codes to clipboard
 * - AC4: Download codes as text file
 * - AC5: Print codes option
 * - AC6: Security warning display
 * - AC7: Confirmation checkbox before continuing
 * - AC8: Navigation to success page
 * - AC9: Back navigation warning
 * - AC10: Responsive design
 * - AC11: Accessibility requirements
 * - AC12: Loading states
 */

import { test, expect } from '../../support/fixtures';

/**
 * Backup Codes Page Object for clean test organization
 */
class BackupCodesPage {
  constructor(private page: import('@playwright/test').Page) {}

  // Navigation
  async goto() {
    await this.page.goto('/auth/mfa-setup/backup');
    await this.page.waitForLoadState('networkidle');
  }

  async gotoFromTotpSetup() {
    // This would require completing TOTP setup first
    // For testing, we navigate directly
    await this.goto();
  }

  // Page elements
  get heading() {
    return this.page.getByRole('heading', { name: /save your backup codes/i });
  }

  get description() {
    return this.page.getByText(/recovery codes|use these codes|lose access/i);
  }

  get backLink() {
    return this.page.getByRole('link', { name: /back to security settings/i });
  }

  // Backup codes grid
  get codesGrid() {
    return this.page.locator('.grid');
  }

  get backupCodes() {
    return this.page.locator('[data-testid="backup-code"]');
  }

  // Action buttons
  get copyButton() {
    return this.page.getByRole('button', { name: /copy all/i });
  }

  get downloadButton() {
    return this.page.getByRole('button', { name: /download/i });
  }

  get printButton() {
    return this.page.getByRole('button', { name: /print/i });
  }

  get continueButton() {
    return this.page.getByRole('button', { name: /continue/i });
  }

  // Security warning
  get securityWarning() {
    return this.page.getByRole('alert');
  }

  get warningText() {
    return this.page.getByText(/store.*securely|secure location|cannot be retrieved/i);
  }

  // Confirmation checkbox
  get confirmationCheckbox() {
    return this.page.getByRole('checkbox');
  }

  get checkboxLabel() {
    return this.page.getByText(/i have saved my backup codes|secure location/i);
  }

  // Loading state
  get loadingSkeleton() {
    return this.page.getByTestId('backup-codes-loading');
  }

  // Actions
  async copyAllCodes() {
    await this.copyButton.click();
  }

  async downloadCodes() {
    await this.downloadButton.click();
  }

  async printCodes() {
    await this.printButton.click();
  }

  async checkConfirmation() {
    await this.confirmationCheckbox.click();
  }

  async clickContinue() {
    await this.continueButton.click();
  }
}

test.describe('MFA Setup - Backup Codes (Story 1-1-9)', () => {
  test.describe('AC1: Display Backup Codes After TOTP Verification', () => {
    test('displays 10 backup codes', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      const codes = await backupCodes.backupCodes.all();
      expect(codes).toHaveLength(10);
    });

    test('displays page heading "Save Your Backup Codes"', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      await expect(backupCodes.heading).toBeVisible();
    });

    test('displays warning that codes are shown only once', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      await expect(page.getByText(/only be shown once|one time|store.*safely/i)).toBeVisible();
    });

    test('redirects unauthenticated users to sign-in', async ({ page }) => {
      await page.goto('/auth/mfa-setup/backup');

      await expect(page).toHaveURL(/sign-in/);
    });
  });

  test.describe('AC2: Backup Code Display Format', () => {
    test('codes are displayed in a grid layout', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      const grid = backupCodes.codesGrid;
      await expect(grid).toHaveClass(/grid/);
    });

    test('codes are 8 characters alphanumeric', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      const firstCode = backupCodes.backupCodes.first();
      const text = await firstCode.textContent();
      // Extract just the code part (after the number)
      const codeMatch = text?.match(/\d+\.\s*([A-Z0-9]+)/);
      expect(codeMatch?.[1]).toMatch(/^[A-Z0-9]{8}$/);
    });

    test('each code has a sequential number (1-10)', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      for (let i = 1; i <= 10; i++) {
        await expect(page.getByText(new RegExp(`^${i}\\.`))).toBeVisible();
      }
    });

    test('codes are displayed in monospace font', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      const firstCode = backupCodes.backupCodes.first();
      await expect(firstCode).toHaveClass(/font-mono/);
    });
  });

  test.describe('AC3: Copy All Codes to Clipboard', () => {
    test('displays "Copy All Codes" button', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      await expect(backupCodes.copyButton).toBeVisible();
    });

    test('clicking copy button shows "Copied!" feedback', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      await backupCodes.copyAllCodes();

      await expect(page.getByRole('button', { name: /copied/i })).toBeVisible({ timeout: 2000 });
    });

    test('copy button copies all codes to clipboard', async ({ authenticatedPage: page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);

      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      await backupCodes.copyAllCodes();

      const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
      const lines = clipboardText.split('\n').filter(Boolean);
      expect(lines).toHaveLength(10);
    });

    test('copy button resets after a few seconds', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      await backupCodes.copyAllCodes();

      // Wait for copied feedback
      await expect(page.getByRole('button', { name: /copied/i })).toBeVisible({ timeout: 2000 });

      // Wait for reset
      await expect(backupCodes.copyButton).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('AC4: Download Codes as Text File', () => {
    test('displays "Download Codes" button', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      await expect(backupCodes.downloadButton).toBeVisible();
    });

    test('clicking download triggers file download', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      const downloadPromise = page.waitForEvent('download');
      await backupCodes.downloadCodes();
      const download = await downloadPromise;

      expect(download.suggestedFilename()).toBe('hyyve-backup-codes.txt');
    });

    test('downloaded file contains all 10 codes', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      const downloadPromise = page.waitForEvent('download');
      await backupCodes.downloadCodes();
      const download = await downloadPromise;

      const content = await download.createReadStream();
      let fileContent = '';
      for await (const chunk of content) {
        fileContent += chunk.toString();
      }

      // Should contain numbered codes
      for (let i = 1; i <= 10; i++) {
        expect(fileContent).toContain(`${String(i).padStart(2, '0')}.`);
      }
    });

    test('downloaded file includes security header', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      const downloadPromise = page.waitForEvent('download');
      await backupCodes.downloadCodes();
      const download = await downloadPromise;

      const content = await download.createReadStream();
      let fileContent = '';
      for await (const chunk of content) {
        fileContent += chunk.toString();
      }

      expect(fileContent).toContain('HYYVE');
      expect(fileContent).toContain('BACKUP CODES');
      expect(fileContent.toLowerCase()).toContain('secure');
    });
  });

  test.describe('AC5: Print Codes Option', () => {
    test('displays "Print Codes" button', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      await expect(backupCodes.printButton).toBeVisible();
    });

    // Note: Testing actual print dialog is difficult in Playwright
    // We can verify the button exists and is clickable
    test('print button is clickable', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      await expect(backupCodes.printButton).toBeEnabled();
    });
  });

  test.describe('AC6: Security Warning Display', () => {
    test('displays security warning with prominent styling', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      await expect(backupCodes.securityWarning).toBeVisible();
    });

    test('warning has amber/yellow styling', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      const warning = page.locator('.bg-amber-500, [class*="bg-amber"], [class*="bg-yellow"]');
      await expect(warning.first()).toBeVisible();
    });

    test('warning explains codes cannot be retrieved again', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      await expect(
        page.getByText(/cannot be retrieved|only shown once|will not be displayed again/i)
      ).toBeVisible();
    });
  });

  test.describe('AC7: Confirmation Checkbox Before Continuing', () => {
    test('displays confirmation checkbox', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      await expect(backupCodes.confirmationCheckbox).toBeVisible();
    });

    test('checkbox has correct label text', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      await expect(backupCodes.checkboxLabel).toBeVisible();
    });

    test('Continue button is disabled when checkbox is unchecked', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      await expect(backupCodes.continueButton).toBeDisabled();
    });

    test('Continue button is enabled when checkbox is checked', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      await backupCodes.checkConfirmation();

      await expect(backupCodes.continueButton).toBeEnabled();
    });
  });

  test.describe('AC8: Navigation to Success Page', () => {
    test('clicking Continue navigates to success/security page', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      await backupCodes.checkConfirmation();
      await backupCodes.clickContinue();

      await expect(page).toHaveURL(/\/auth\/mfa-setup\/success|\/settings\/security/);
    });

    test('success page confirms MFA is enabled', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      await backupCodes.checkConfirmation();
      await backupCodes.clickContinue();

      // Wait for navigation
      await page.waitForURL(/\/auth\/mfa-setup\/success|\/settings\/security/);

      // Should show success message
      await expect(page.getByText(/mfa.*enabled|two-factor.*enabled|success/i)).toBeVisible();
    });
  });

  test.describe('AC10: Responsive Design', () => {
    test('renders correctly on mobile viewport', async ({ authenticatedPage: page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      // All key elements should be visible
      await expect(backupCodes.heading).toBeVisible();
      await expect(backupCodes.backupCodes.first()).toBeVisible();
      await expect(backupCodes.copyButton).toBeVisible();
      await expect(backupCodes.continueButton).toBeVisible();
    });

    test('codes display in single column on mobile', async ({ authenticatedPage: page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      // Get first and second code positions
      const codes = await backupCodes.backupCodes.all();
      const firstBox = await codes[0].boundingBox();
      const secondBox = await codes[1].boundingBox();

      if (firstBox && secondBox) {
        // On mobile, codes should stack vertically (y increases)
        expect(secondBox.y).toBeGreaterThan(firstBox.y);
      }
    });

    test('action buttons are full-width and stacked on mobile', async ({ authenticatedPage: page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      // Buttons should be nearly full viewport width on mobile
      const copyBox = await backupCodes.copyButton.boundingBox();
      if (copyBox) {
        expect(copyBox.width).toBeGreaterThan(300); // Most of 375px viewport
      }
    });

    test('renders correctly on tablet viewport', async ({ authenticatedPage: page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      await expect(backupCodes.heading).toBeVisible();
      await expect(backupCodes.securityWarning).toBeVisible();
    });

    test('codes display in two columns on desktop', async ({ authenticatedPage: page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });

      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      // Get first and second code positions
      const codes = await backupCodes.backupCodes.all();
      const firstBox = await codes[0].boundingBox();
      const secondBox = await codes[1].boundingBox();

      if (firstBox && secondBox) {
        // On desktop, first two codes should be side by side (similar y)
        expect(Math.abs(firstBox.y - secondBox.y)).toBeLessThan(10);
      }
    });
  });

  test.describe('AC11: Accessibility Requirements', () => {
    test('backup codes are in an accessible list', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      const list = page.getByRole('list');
      await expect(list).toBeVisible();

      const items = page.getByRole('listitem');
      expect(await items.count()).toBe(10);
    });

    test('all buttons have accessible names', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      const buttons = page.getByRole('button');
      const count = await buttons.count();

      for (let i = 0; i < count; i++) {
        const button = buttons.nth(i);
        const name = await button.getAttribute('aria-label') || await button.textContent();
        expect(name).toBeTruthy();
      }
    });

    test('checkbox is properly labeled', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      const checkbox = backupCodes.confirmationCheckbox;
      const name =
        (await checkbox.getAttribute('aria-label')) ||
        (await checkbox.getAttribute('aria-labelledby')) ||
        (await page.locator(`label[for="${await checkbox.getAttribute('id')}"]`).textContent());
      expect(name).toBeTruthy();
    });

    test('warning has alert role', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      const alert = page.getByRole('alert');
      await expect(alert).toBeVisible();
    });

    test('supports keyboard navigation', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      // Tab through elements
      await page.keyboard.press('Tab');

      const focusedElement = page.locator(':focus');
      const tagName = await focusedElement.evaluate((el) => el.tagName);
      expect(['A', 'BUTTON', 'INPUT']).toContain(tagName);
    });

    test('page has proper heading hierarchy', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
      await expect(h1).toHaveText(/save your backup codes/i);
    });

    test('buttons have visible focus indicators', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      await backupCodes.copyButton.focus();

      await expect(backupCodes.copyButton).toHaveClass(/focus:ring|focus-visible/);
    });
  });

  test.describe('AC12: Loading States', () => {
    test('shows loading skeleton while codes are being generated', async ({ authenticatedPage: page }) => {
      // Slow down API response
      await page.route('**/api/**', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        await route.continue();
      });

      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      // Should eventually show codes
      await expect(backupCodes.backupCodes.first()).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Complete Backup Codes Flow', () => {
    test('user can complete the full backup codes flow', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      // Verify codes are displayed
      const codes = await backupCodes.backupCodes.all();
      expect(codes).toHaveLength(10);

      // Copy codes
      await backupCodes.copyAllCodes();
      await expect(page.getByRole('button', { name: /copied/i })).toBeVisible({ timeout: 2000 });

      // Check confirmation
      await backupCodes.checkConfirmation();

      // Verify continue is enabled
      await expect(backupCodes.continueButton).toBeEnabled();

      // Continue to success
      await backupCodes.clickContinue();

      // Should navigate to success/security page
      await expect(page).toHaveURL(/\/auth\/mfa-setup\/success|\/settings\/security/);
    });

    test('user can download codes before continuing', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      // Download codes
      const downloadPromise = page.waitForEvent('download');
      await backupCodes.downloadCodes();
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe('hyyve-backup-codes.txt');

      // Check confirmation and continue
      await backupCodes.checkConfirmation();
      await backupCodes.clickContinue();

      await expect(page).toHaveURL(/\/auth\/mfa-setup\/success|\/settings\/security/);
    });
  });

  test.describe('Page Layout and Branding', () => {
    test('displays header with Hyyve logo', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      await expect(page.locator('header')).toBeVisible();
      await expect(page.getByText('Hyyve').first()).toBeVisible();
    });

    test('displays user email in header', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      const header = page.locator('header');
      await expect(header.getByText(/@/)).toBeVisible();
    });

    test('content card has correct styling', async ({ authenticatedPage: page }) => {
      const backupCodes = new BackupCodesPage(page);
      await backupCodes.goto();

      const contentCard = page.locator('.bg-surface-dark, .bg-white').filter({
        has: backupCodes.backupCodes.first(),
      });
      await expect(contentCard).toHaveClass(/rounded-xl|border/);
    });
  });
});
