import { test as base, expect, Page } from '@playwright/test';

/**
 * Hyyve Base Test Fixtures
 *
 * Provides common fixtures and utilities for all E2E tests.
 * Extend this for builder-specific fixtures.
 */

// Custom fixture types
export interface HyyveFixtures {
  /** Authenticated page with logged-in user */
  authenticatedPage: Page;
  /** Test user credentials */
  testUser: {
    email: string;
    password: string;
  };
}

/**
 * Extended test with Hyyve-specific fixtures
 */
export const test = base.extend<HyyveFixtures>({
  // Test user credentials
  testUser: async (_, use) => {
    await use({
      email: process.env.TEST_USER_EMAIL ?? 'test@hyyve.dev',
      password: process.env.TEST_USER_PASSWORD ?? 'testpassword123',
    });
  },

  // Authenticated page fixture
  authenticatedPage: async ({ page, testUser }, use) => {
    // Navigate to login
    await page.goto('/sign-in');

    // Fill credentials (Clerk auth)
    await page.getByLabel('Email').fill(testUser.email);
    await page.getByRole('button', { name: /continue/i }).click();

    // Enter password
    await page.getByLabel('Password').fill(testUser.password);
    await page.getByRole('button', { name: /continue/i }).click();

    // Wait for redirect to dashboard
    await page.waitForURL(/\/(dashboard|workspace)/);

    await use(page);
  },
});

export { expect };

/**
 * Page Object Model base class
 */
export abstract class BasePage {
  constructor(protected page: Page) {}

  /** Navigate to this page */
  abstract goto(): Promise<void>;

  /** Check if page is loaded */
  abstract isLoaded(): Promise<boolean>;

  /** Wait for page to be ready */
  async waitForReady(timeout = 30000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }
}

/**
 * Common test utilities
 */
export const testUtils = {
  /** Generate unique test identifier */
  uniqueId: (prefix = 'test') => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,

  /** Wait for API response */
  waitForApi: async (page: Page, urlPattern: string | RegExp) => {
    return page.waitForResponse((response) =>
      typeof urlPattern === 'string'
        ? response.url().includes(urlPattern)
        : urlPattern.test(response.url())
    );
  },

  /** Check for no console errors */
  assertNoConsoleErrors: async (page: Page) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    return errors;
  },
};
