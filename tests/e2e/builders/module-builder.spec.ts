import { test, expect, testUtils } from '../../support/fixtures';
import { ModuleBuilderPage } from '../../support/fixtures/builder.fixture';

/**
 * Module Builder Tests
 *
 * Tests for the conversational module builder interface.
 * Uses the DCRL pattern (Discover, Capture, Refine, Lock).
 */

test.describe('Module Builder', () => {
  test.describe('Navigation', () => {
    test('can access module builder from dashboard', async ({ authenticatedPage: page }) => {
      await page.goto('/dashboard');

      // Navigate to Module Builder
      await page.getByRole('link', { name: /module builder/i }).click();

      await expect(page).toHaveURL(/\/builders\/module/);
    });
  });

  test.describe('Module Creation', () => {
    test('can create a new module', async ({ authenticatedPage: page }) => {
      const moduleBuilder = new ModuleBuilderPage(page);
      await moduleBuilder.goto();

      // Click create new
      await page.getByRole('button', { name: /create|new module/i }).click();

      // Fill module details
      const moduleName = testUtils.uniqueId('test-module');
      await page.getByLabel(/name/i).fill(moduleName);
      await page.getByRole('button', { name: /create/i }).click();

      // Should navigate to new module
      await expect(page).toHaveURL(/\/builders\/module\/[a-z0-9-]+/);
    });
  });

  test.describe('Conversational Interface', () => {
    test('displays split-pane layout', async ({ authenticatedPage: page }) => {
      const moduleBuilder = new ModuleBuilderPage(page);
      await moduleBuilder.goto();

      // Verify DCRL split-pane layout
      await expect(moduleBuilder.conversationalPane).toBeVisible();
      await expect(moduleBuilder.detailPane).toBeVisible();
    });

    test('can send message in conversational pane', async ({ authenticatedPage: page }) => {
      const moduleBuilder = new ModuleBuilderPage(page);
      await moduleBuilder.goto();

      // Send a test message
      await moduleBuilder.sendMessage('Create a simple greeting module');

      // Wait for response
      const response = await moduleBuilder.waitForResponse();
      expect(response).toBeTruthy();
    });
  });

  test.describe('Module Saving', () => {
    test('save button is enabled after changes', async ({ authenticatedPage: page }) => {
      const moduleBuilder = new ModuleBuilderPage(page);
      await moduleBuilder.goto();

      // Make a change
      await moduleBuilder.sendMessage('Add a new input field');
      await moduleBuilder.waitForResponse();

      // Save button should be clickable
      await expect(moduleBuilder.saveButton).toBeEnabled();
    });
  });
});
