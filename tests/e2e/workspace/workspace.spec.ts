import { test, expect, testUtils } from '../../support/fixtures';

/**
 * Workspace Tests
 *
 * Tests for workspace management and organization features.
 */

test.describe('Workspace', () => {
  test.describe('Dashboard', () => {
    test('displays workspace overview', async ({ authenticatedPage: page }) => {
      await page.goto('/dashboard');

      // Check for main dashboard sections
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

      // Should show quick actions or recent projects
      await expect(
        page.getByRole('region', { name: /recent|projects|quick/i }).or(page.locator('[data-testid="dashboard-content"]'))
      ).toBeVisible();
    });

    test('shows builder shortcuts', async ({ authenticatedPage: page }) => {
      await page.goto('/dashboard');

      // Should have links to all 4 builders
      const builders = ['module', 'chatbot', 'voice', 'canvas'];

      for (const builder of builders) {
        await expect(
          page.getByRole('link', { name: new RegExp(builder, 'i') })
        ).toBeVisible();
      }
    });
  });

  test.describe('Project Management', () => {
    test('can create a new project', async ({ authenticatedPage: page }) => {
      await page.goto('/dashboard');

      await page.getByRole('button', { name: /new project|create project/i }).click();

      const projectName = testUtils.uniqueId('test-project');
      await page.getByLabel(/project name/i).fill(projectName);
      await page.getByRole('button', { name: /create/i }).click();

      // Should see new project in list
      await expect(page.getByText(projectName)).toBeVisible();
    });

    test('can rename a project', async ({ authenticatedPage: page }) => {
      await page.goto('/dashboard');

      // Open project menu
      const projectCard = page.locator('[data-testid="project-card"]').first();
      await projectCard.getByRole('button', { name: /more|options|menu/i }).click();

      // Click rename
      await page.getByRole('menuitem', { name: /rename/i }).click();

      // Enter new name
      const newName = testUtils.uniqueId('renamed-project');
      await page.getByLabel(/name/i).fill(newName);
      await page.getByRole('button', { name: /save|confirm/i }).click();

      await expect(page.getByText(newName)).toBeVisible();
    });

    test('can delete a project', async ({ authenticatedPage: page }) => {
      await page.goto('/dashboard');

      // Get initial project count
      const initialCount = await page.locator('[data-testid="project-card"]').count();

      // Open project menu
      const projectCard = page.locator('[data-testid="project-card"]').first();
      const projectName = await projectCard.getByRole('heading').textContent();

      await projectCard.getByRole('button', { name: /more|options|menu/i }).click();
      await page.getByRole('menuitem', { name: /delete/i }).click();

      // Confirm deletion
      await page.getByRole('button', { name: /delete|confirm/i }).click();

      // Project should be removed
      if (projectName) {
        await expect(page.getByText(projectName)).not.toBeVisible();
      }

      // Count should decrease
      await expect(page.locator('[data-testid="project-card"]')).toHaveCount(initialCount - 1);
    });
  });

  test.describe('Settings', () => {
    test('can access workspace settings', async ({ authenticatedPage: page }) => {
      await page.goto('/dashboard');

      await page.getByRole('link', { name: /settings/i }).click();

      await expect(page).toHaveURL(/\/settings/);
    });
  });
});
