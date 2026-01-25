import { test, expect, testUtils } from '../../support/fixtures';
import { CanvasBuilderPage } from '../../support/fixtures/builder.fixture';

/**
 * Canvas Builder Tests
 *
 * Tests for the visual node-based canvas builder.
 * Tests node creation, connections, and workflow execution.
 */

test.describe('Canvas Builder', () => {
  test.describe('Navigation', () => {
    test('can access canvas builder from dashboard', async ({ authenticatedPage: page }) => {
      await page.goto('/dashboard');

      await page.getByRole('link', { name: /canvas builder/i }).click();

      await expect(page).toHaveURL(/\/builders\/canvas/);
    });
  });

  test.describe('Canvas Creation', () => {
    test('can create a new canvas', async ({ authenticatedPage: page }) => {
      const canvasBuilder = new CanvasBuilderPage(page);
      await canvasBuilder.goto();

      await page.getByRole('button', { name: /create|new canvas/i }).click();

      const canvasName = testUtils.uniqueId('test-canvas');
      await page.getByLabel(/name/i).fill(canvasName);
      await page.getByRole('button', { name: /create/i }).click();

      await expect(page).toHaveURL(/\/builders\/canvas\/[a-z0-9-]+/);
    });
  });

  test.describe('Node Editor', () => {
    test('displays node editor interface', async ({ authenticatedPage: page }) => {
      const canvasBuilder = new CanvasBuilderPage(page);
      await canvasBuilder.goto();

      await expect(canvasBuilder.nodeEditor).toBeVisible();
      await expect(canvasBuilder.nodeLibrary).toBeVisible();
      await expect(canvasBuilder.toolbar).toBeVisible();
    });

    test('can drag node from library to canvas', async ({ authenticatedPage: page }) => {
      const canvasBuilder = new CanvasBuilderPage(page);
      await canvasBuilder.goto();

      // Find a node type in library
      const nodeItem = canvasBuilder.nodeLibrary.getByRole('button', { name: /input/i }).first();

      // Drag to canvas
      await nodeItem.dragTo(canvasBuilder.nodeEditor);

      // Verify node was added
      const nodes = canvasBuilder.nodeEditor.locator('[data-node-id]');
      await expect(nodes).toHaveCount(1);
    });
  });

  test.describe('Node Connections', () => {
    test('can connect two nodes', async ({ authenticatedPage: page }) => {
      const canvasBuilder = new CanvasBuilderPage(page);
      await canvasBuilder.goto();

      // Add two nodes
      await canvasBuilder.addNode('Input');
      await canvasBuilder.addNode('Output');

      // Get node IDs
      const nodes = canvasBuilder.nodeEditor.locator('[data-node-id]');
      const firstNodeId = await nodes.first().getAttribute('data-node-id');
      const lastNodeId = await nodes.last().getAttribute('data-node-id');

      if (firstNodeId && lastNodeId) {
        await canvasBuilder.connectNodes(firstNodeId, lastNodeId);
      }

      // Verify connection exists
      const connections = canvasBuilder.nodeEditor.locator('[data-connection]');
      await expect(connections).toHaveCount(1);
    });
  });
});
