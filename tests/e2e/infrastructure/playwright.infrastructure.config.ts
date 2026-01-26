import { defineConfig } from '@playwright/test';
import path from 'path';

/**
 * Playwright Configuration for Infrastructure Tests
 *
 * These tests verify project structure and configuration files.
 * They do NOT require a running web server.
 */

export default defineConfig({
  // Test directory - only infrastructure tests
  testDir: path.resolve(__dirname),

  // Output directories
  outputDir: '../../../tests/results/infrastructure',

  // Run tests in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // No retries for deterministic file system checks
  retries: 0,

  // Single worker is enough for file checks
  workers: 1,

  // Reporter to use
  reporter: process.env.CI
    ? [
        ['github'],
        ['html', { outputFolder: '../../../tests/reports/infrastructure' }],
      ]
    : [['list']],

  // Timeout for each test - file checks should be fast
  timeout: 10000,

  // NO web server - these are file system tests only
  // webServer: undefined,

  // Configure single project for infrastructure tests
  projects: [
    {
      name: 'infrastructure',
      testMatch: /.*\.spec\.ts/,
    },
  ],
});
