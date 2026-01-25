import { FullConfig } from '@playwright/test';

/**
 * Global setup for Playwright tests
 *
 * Runs once before all tests to:
 * - Set up test database state
 * - Create test users
 * - Initialize any global test resources
 */
async function globalSetup(config: FullConfig): Promise<void> {
  console.log('Starting global test setup...');

  // Environment validation
  const requiredEnvVars = ['PLAYWRIGHT_TEST_BASE_URL'];
  const missingVars = requiredEnvVars.filter((v) => !process.env[v]);

  if (missingVars.length > 0 && process.env.CI) {
    console.warn(`Missing optional env vars: ${missingVars.join(', ')}`);
  }

  // Set default base URL if not provided
  if (!process.env.PLAYWRIGHT_TEST_BASE_URL) {
    process.env.PLAYWRIGHT_TEST_BASE_URL = 'http://localhost:3000';
  }

  console.log(`Base URL: ${process.env.PLAYWRIGHT_TEST_BASE_URL}`);
  console.log(`Projects: ${config.projects.map((p) => p.name).join(', ')}`);

  // Additional setup tasks can be added here:
  // - Seed test database
  // - Create test organization/workspace
  // - Set up mock services

  console.log('Global setup complete');
}

export default globalSetup;
