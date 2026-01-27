import { test, expect } from '../../support/fixtures';

/**
 * Registration Flow Tests
 * Story 1-1-1: User Registration with Email/Password
 */

test.describe('Registration (Story 1-1-1)', () => {
  test('renders registration page', async ({ page }) => {
    await page.goto('/auth/register');

    await expect(page).toHaveURL(/\/auth\/register/);
    await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible();
    await expect(page.getByLabel(/full name/i)).toBeVisible();
    await expect(page.getByLabel(/work email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });
});
