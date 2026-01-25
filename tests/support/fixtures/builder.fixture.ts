import { Page, Locator } from '@playwright/test';
import { test as base, expect, BasePage } from './base.fixture';

/**
 * Builder-specific test fixtures for Hyyve
 *
 * Provides fixtures for testing the 4 builders:
 * - Module Builder
 * - Chatbot Builder
 * - Voice Agent Builder
 * - Canvas Builder
 */

// Builder types
export type BuilderType = 'module' | 'chatbot' | 'voice' | 'canvas';

export interface BuilderFixtures {
  /** Create a new module in Module Builder */
  createModule: (name: string) => Promise<string>;
  /** Create a new chatbot in Chatbot Builder */
  createChatbot: (name: string) => Promise<string>;
  /** Create a new voice agent in Voice Agent Builder */
  createVoiceAgent: (name: string) => Promise<string>;
  /** Create a new canvas in Canvas Builder */
  createCanvas: (name: string) => Promise<string>;
}

/**
 * Extended test with builder fixtures
 */
export const test = base.extend<BuilderFixtures>({
  createModule: async ({ authenticatedPage: page }, use) => {
    const createFn = async (name: string): Promise<string> => {
      // Navigate to Module Builder
      await page.goto('/builders/module');
      await page.waitForLoadState('networkidle');

      // Click create new module
      await page.getByRole('button', { name: /create module/i }).click();

      // Fill module name
      await page.getByLabel(/module name/i).fill(name);

      // Submit
      await page.getByRole('button', { name: /create/i }).click();

      // Wait for navigation to new module
      await page.waitForURL(/\/builders\/module\/[a-z0-9-]+/);

      // Return module ID from URL
      return page.url().split('/').pop() ?? '';
    };
    await use(createFn);
  },

  createChatbot: async ({ authenticatedPage: page }, use) => {
    const createFn = async (name: string): Promise<string> => {
      await page.goto('/builders/chatbot');
      await page.waitForLoadState('networkidle');

      await page.getByRole('button', { name: /create chatbot/i }).click();
      await page.getByLabel(/chatbot name/i).fill(name);
      await page.getByRole('button', { name: /create/i }).click();

      await page.waitForURL(/\/builders\/chatbot\/[a-z0-9-]+/);
      return page.url().split('/').pop() ?? '';
    };
    await use(createFn);
  },

  createVoiceAgent: async ({ authenticatedPage: page }, use) => {
    const createFn = async (name: string): Promise<string> => {
      await page.goto('/builders/voice');
      await page.waitForLoadState('networkidle');

      await page.getByRole('button', { name: /create voice agent/i }).click();
      await page.getByLabel(/agent name/i).fill(name);
      await page.getByRole('button', { name: /create/i }).click();

      await page.waitForURL(/\/builders\/voice\/[a-z0-9-]+/);
      return page.url().split('/').pop() ?? '';
    };
    await use(createFn);
  },

  createCanvas: async ({ authenticatedPage: page }, use) => {
    const createFn = async (name: string): Promise<string> => {
      await page.goto('/builders/canvas');
      await page.waitForLoadState('networkidle');

      await page.getByRole('button', { name: /create canvas/i }).click();
      await page.getByLabel(/canvas name/i).fill(name);
      await page.getByRole('button', { name: /create/i }).click();

      await page.waitForURL(/\/builders\/canvas\/[a-z0-9-]+/);
      return page.url().split('/').pop() ?? '';
    };
    await use(createFn);
  },
});

export { expect };

/**
 * Page Object: Module Builder
 */
export class ModuleBuilderPage extends BasePage {
  // Locators
  readonly conversationalPane: Locator;
  readonly detailPane: Locator;
  readonly nodeCanvas: Locator;
  readonly saveButton: Locator;
  readonly testButton: Locator;

  constructor(page: Page) {
    super(page);
    this.conversationalPane = page.locator('[data-testid="conversational-pane"]');
    this.detailPane = page.locator('[data-testid="detail-pane"]');
    this.nodeCanvas = page.locator('[data-testid="node-canvas"]');
    this.saveButton = page.getByRole('button', { name: /save/i });
    this.testButton = page.getByRole('button', { name: /test/i });
  }

  async goto(moduleId?: string): Promise<void> {
    const url = moduleId ? `/builders/module/${moduleId}` : '/builders/module';
    await this.page.goto(url);
  }

  async isLoaded(): Promise<boolean> {
    await this.page.waitForLoadState('networkidle');
    return this.conversationalPane.isVisible();
  }

  async sendMessage(message: string): Promise<void> {
    const input = this.conversationalPane.getByRole('textbox');
    await input.fill(message);
    await input.press('Enter');
  }

  async waitForResponse(): Promise<string> {
    const response = this.conversationalPane.locator('[data-testid="assistant-message"]').last();
    await response.waitFor({ state: 'visible' });
    return (await response.textContent()) ?? '';
  }
}

/**
 * Page Object: Canvas Builder
 */
export class CanvasBuilderPage extends BasePage {
  readonly nodeEditor: Locator;
  readonly nodeLibrary: Locator;
  readonly propertiesPanel: Locator;
  readonly toolbar: Locator;

  constructor(page: Page) {
    super(page);
    this.nodeEditor = page.locator('[data-testid="node-editor"]');
    this.nodeLibrary = page.locator('[data-testid="node-library"]');
    this.propertiesPanel = page.locator('[data-testid="properties-panel"]');
    this.toolbar = page.locator('[data-testid="canvas-toolbar"]');
  }

  async goto(canvasId?: string): Promise<void> {
    const url = canvasId ? `/builders/canvas/${canvasId}` : '/builders/canvas';
    await this.page.goto(url);
  }

  async isLoaded(): Promise<boolean> {
    await this.page.waitForLoadState('networkidle');
    return this.nodeEditor.isVisible();
  }

  async addNode(nodeType: string): Promise<void> {
    // Open node library
    await this.nodeLibrary.getByRole('button', { name: nodeType }).click();
  }

  async connectNodes(sourceId: string, targetId: string): Promise<void> {
    const source = this.nodeEditor.locator(`[data-node-id="${sourceId}"] [data-handle="output"]`);
    const target = this.nodeEditor.locator(`[data-node-id="${targetId}"] [data-handle="input"]`);

    await source.dragTo(target);
  }
}
