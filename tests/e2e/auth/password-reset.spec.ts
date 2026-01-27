import { test, expect } from '../../support/fixtures';

/**
 * Password Reset Flow Tests
 * Story 1-1-5: Password Reset Flow
 */

test.describe('Password Reset (Story 1-1-5)', () => {
  test('renders forgot password page', async ({ page }) => {
    await page.goto('/auth/forgot-password');

    await expect(page).toHaveURL(/\/auth\/forgot-password/);
    await expect(page.getByRole('heading', { name: /forgot your password/i })).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
  });

  test('shows validation error for invalid email', async ({ page }) => {
    await page.goto('/auth/forgot-password');

    await page.getByLabel(/email address/i).fill('invalid-email');
    await page.getByRole('button', { name: /send reset link/i }).click();

    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('renders reset password page with token', async ({ page }) => {
    await page.goto('/auth/reset-password/test-token');

    await expect(page).toHaveURL(/\/auth\/reset-password\/test-token/);
    await expect(page.getByRole('heading', { name: /reset your password/i })).toBeVisible();
    await expect(page.getByLabel(/new password/i)).toBeVisible();
    await expect(page.getByLabel(/confirm password/i)).toBeVisible();
  });
});
