import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../.auth/user.json');

/**
 * Authentication Setup
 *
 * This setup test runs before all other tests to:
 * 1. Authenticate a test user via Clerk
 * 2. Save the authentication state for reuse
 *
 * Other tests can then use this stored auth state.
 */
setup('authenticate', async ({ page }) => {
  // Skip auth setup if no credentials provided
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    console.log('No test credentials provided, skipping auth setup');
    console.log('Set TEST_USER_EMAIL and TEST_USER_PASSWORD to enable authenticated tests');
    return;
  }

  // Navigate to sign-in page
  await page.goto('/sign-in');

  // Wait for Clerk to load
  await page.waitForSelector('[data-clerk-component="SignIn"]', { timeout: 10000 }).catch(() => {
    // Clerk component might not be visible if already authenticated
    console.log('Clerk component not found, checking if already authenticated...');
  });

  // Check if already authenticated
  if (page.url().includes('/dashboard') || page.url().includes('/workspace')) {
    console.log('Already authenticated');
    await page.context().storageState({ path: authFile });
    return;
  }

  // Enter email
  await page.getByLabel('Email address').fill(email);
  await page.getByRole('button', { name: /continue/i }).click();

  // Enter password
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: /continue/i }).click();

  // Wait for successful authentication
  await expect(page).toHaveURL(/\/(dashboard|workspace)/, { timeout: 30000 });

  // Save authentication state
  await page.context().storageState({ path: authFile });

  console.log('Authentication state saved');
});
