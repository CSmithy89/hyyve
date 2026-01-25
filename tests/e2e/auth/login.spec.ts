import { test, expect } from '../../support/fixtures';

/**
 * Authentication Tests
 *
 * Tests for user authentication flows via Clerk.
 */

test.describe('Authentication', () => {
  test.describe('Sign In', () => {
    test('displays sign-in form', async ({ page }) => {
      await page.goto('/sign-in');

      // Check for email input
      await expect(page.getByLabel(/email/i)).toBeVisible();
    });

    test('shows error for invalid email format', async ({ page }) => {
      await page.goto('/sign-in');

      // Enter invalid email
      await page.getByLabel(/email/i).fill('invalid-email');
      await page.getByRole('button', { name: /continue/i }).click();

      // Should show validation error
      await expect(page.getByText(/invalid|email/i)).toBeVisible();
    });

    test('redirects to dashboard after successful login', async ({ authenticatedPage }) => {
      // authenticatedPage fixture handles login
      await expect(authenticatedPage).toHaveURL(/\/(dashboard|workspace)/);
    });
  });

  test.describe('Sign Out', () => {
    test('can sign out from dashboard', async ({ authenticatedPage: page }) => {
      // Look for user menu or sign out button
      const userMenu = page.getByRole('button', { name: /account|profile|user/i });

      if (await userMenu.isVisible()) {
        await userMenu.click();
      }

      // Click sign out
      await page.getByRole('button', { name: /sign out|logout/i }).click();

      // Should redirect to home or sign-in
      await expect(page).toHaveURL(/\/(sign-in)?$/);
    });
  });

  test.describe('Protected Routes', () => {
    test('redirects unauthenticated users from dashboard', async ({ page }) => {
      // Try to access dashboard without auth
      await page.goto('/dashboard');

      // Should redirect to sign-in
      await expect(page).toHaveURL(/sign-in/);
    });

    test('redirects unauthenticated users from builders', async ({ page }) => {
      await page.goto('/builders/module');

      await expect(page).toHaveURL(/sign-in/);
    });
  });
});
