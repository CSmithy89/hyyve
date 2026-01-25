import { test, expect } from '@playwright/test';

/**
 * Smoke Tests
 *
 * Basic tests to verify the application is running and accessible.
 * These tests run first to catch fundamental issues early.
 */

test.describe('Smoke Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');

    // Verify page loaded
    await expect(page).toHaveTitle(/Hyyve/i);

    // Check for main content
    await expect(page.locator('main')).toBeVisible();
  });

  test('sign-in page is accessible', async ({ page }) => {
    await page.goto('/sign-in');

    // Verify Clerk sign-in component or redirect
    const hasClerkComponent = await page
      .locator('[data-clerk-component="SignIn"]')
      .isVisible()
      .catch(() => false);

    const hasSignInForm = await page
      .getByRole('heading', { name: /sign in/i })
      .isVisible()
      .catch(() => false);

    expect(hasClerkComponent || hasSignInForm).toBeTruthy();
  });

  test('no console errors on homepage', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out known acceptable errors
    const criticalErrors = consoleErrors.filter(
      (error) =>
        !error.includes('favicon') &&
        !error.includes('Third-party') &&
        !error.includes('hydration')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('API health check', async ({ request }) => {
    const response = await request.get('/api/health');

    // API should respond (even if it returns 404 for non-existent endpoint)
    expect(response.status()).toBeLessThan(500);
  });
});
