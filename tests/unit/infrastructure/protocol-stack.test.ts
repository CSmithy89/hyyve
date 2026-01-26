import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Story 0.1.10: Configure Protocol Stack (CopilotKit + AG-UI)
 *
 * ATDD Tests for Protocol Stack Configuration
 *
 * These tests validate the acceptance criteria for:
 * - AC1: Protocol Packages Installed
 * - AC2: CopilotKit Provider Configured
 * - AC3: AG-UI SSE Endpoint Created
 * - AC4: AG-UI Client Configured
 * - AC5: AG-UI Event Types Defined
 *
 * @see _bmad-output/implementation-artifacts/story-0-1-10-configure-protocol-stack-copilotkit-ag-ui.md
 */

const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..');
const WEB_APP_PATH = path.join(PROJECT_ROOT, 'apps', 'web');

describe('Story 0.1.10: Configure Protocol Stack (CopilotKit + AG-UI)', () => {
  describe('AC1: Protocol Packages Installed', () => {
    let packageJson: {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      [key: string]: unknown;
    };

    beforeAll(() => {
      const packagePath = path.join(WEB_APP_PATH, 'package.json');
      const content = fs.readFileSync(packagePath, 'utf-8');
      packageJson = JSON.parse(content);
    });

    it('should have @copilotkit/react-ui installed', () => {
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      expect(deps['@copilotkit/react-ui']).toBeDefined();
    });

    it('should have @copilotkit/react-core installed', () => {
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      expect(deps['@copilotkit/react-core']).toBeDefined();
    });

    it('should have @copilotkit/runtime installed', () => {
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      expect(deps['@copilotkit/runtime']).toBeDefined();
    });

    it('should have @ag-ui/client installed', () => {
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      expect(deps['@ag-ui/client']).toBeDefined();
    });
  });

  describe('AC2: CopilotKit Provider Configured', () => {
    it('should have copilotkit.tsx file', () => {
      const copilotKitPath = path.join(WEB_APP_PATH, 'lib', 'protocols', 'copilotkit.tsx');
      expect(fs.existsSync(copilotKitPath)).toBe(true);
    });

    describe('copilotkit.tsx content', () => {
      let copilotKitContent: string;

      beforeAll(() => {
        const copilotKitPath = path.join(WEB_APP_PATH, 'lib', 'protocols', 'copilotkit.tsx');
        if (fs.existsSync(copilotKitPath)) {
          copilotKitContent = fs.readFileSync(copilotKitPath, 'utf-8');
        } else {
          copilotKitContent = '';
        }
      });

      it('should import from @copilotkit/react-core', () => {
        const hasImport =
          copilotKitContent.includes('@copilotkit/react-core') ||
          copilotKitContent.includes('@copilotkit/react-ui');
        expect(hasImport).toBe(true);
      });

      it('should export a CopilotKit provider component', () => {
        const hasProvider =
          copilotKitContent.includes('CopilotKit') &&
          (copilotKitContent.includes('export function') ||
            copilotKitContent.includes('export const'));
        expect(hasProvider).toBe(true);
      });

      it('should configure runtime URL', () => {
        const hasRuntimeUrl =
          copilotKitContent.includes('runtimeUrl') ||
          copilotKitContent.includes('/api/copilotkit');
        expect(hasRuntimeUrl).toBe(true);
      });
    });
  });

  describe('AC3: AG-UI SSE Endpoint Created', () => {
    it('should have ag-ui route.ts file', () => {
      const routePath = path.join(WEB_APP_PATH, 'app', 'api', 'ag-ui', 'route.ts');
      expect(fs.existsSync(routePath)).toBe(true);
    });

    describe('ag-ui route.ts content', () => {
      let routeContent: string;

      beforeAll(() => {
        const routePath = path.join(WEB_APP_PATH, 'app', 'api', 'ag-ui', 'route.ts');
        if (fs.existsSync(routePath)) {
          routeContent = fs.readFileSync(routePath, 'utf-8');
        } else {
          routeContent = '';
        }
      });

      it('should export GET handler for SSE', () => {
        expect(routeContent).toContain('export');
        const hasGet = routeContent.includes('GET') || routeContent.includes('get');
        expect(hasGet).toBe(true);
      });

      it('should set text/event-stream content type', () => {
        const hasSSE =
          routeContent.includes('text/event-stream') ||
          routeContent.includes('EventStream') ||
          routeContent.includes('ReadableStream');
        expect(hasSSE).toBe(true);
      });
    });
  });

  describe('AC4: AG-UI Client Configured', () => {
    it('should have ag-ui.ts file', () => {
      const agUiPath = path.join(WEB_APP_PATH, 'lib', 'protocols', 'ag-ui.ts');
      expect(fs.existsSync(agUiPath)).toBe(true);
    });

    describe('ag-ui.ts content', () => {
      let agUiContent: string;

      beforeAll(() => {
        const agUiPath = path.join(WEB_APP_PATH, 'lib', 'protocols', 'ag-ui.ts');
        if (fs.existsSync(agUiPath)) {
          agUiContent = fs.readFileSync(agUiPath, 'utf-8');
        } else {
          agUiContent = '';
        }
      });

      it('should export AG-UI client or factory function', () => {
        const hasClient =
          agUiContent.includes('createAGUIClient') ||
          agUiContent.includes('AGUIClient') ||
          agUiContent.includes('EventSource') ||
          agUiContent.includes('useAGUI');
        expect(hasClient).toBe(true);
      });

      it('should support streaming', () => {
        const hasStreaming =
          agUiContent.includes('stream') ||
          agUiContent.includes('EventSource') ||
          agUiContent.includes('SSE') ||
          agUiContent.includes('onmessage');
        expect(hasStreaming).toBe(true);
      });
    });
  });

  describe('AC5: AG-UI Event Types Defined', () => {
    let typesContent: string;

    beforeAll(() => {
      // Check both possible locations for types
      const typesPath = path.join(WEB_APP_PATH, 'lib', 'protocols', 'types.ts');
      const agUiPath = path.join(WEB_APP_PATH, 'lib', 'protocols', 'ag-ui.ts');

      if (fs.existsSync(typesPath)) {
        typesContent = fs.readFileSync(typesPath, 'utf-8');
      } else if (fs.existsSync(agUiPath)) {
        typesContent = fs.readFileSync(agUiPath, 'utf-8');
      } else {
        typesContent = '';
      }
    });

    it('should define RUN_STARTED event type', () => {
      expect(typesContent).toContain('RUN_STARTED');
    });

    it('should define RUN_FINISHED event type', () => {
      expect(typesContent).toContain('RUN_FINISHED');
    });

    it('should define RUN_ERROR event type', () => {
      expect(typesContent).toContain('RUN_ERROR');
    });

    it('should define TEXT_MESSAGE_START event type', () => {
      expect(typesContent).toContain('TEXT_MESSAGE_START');
    });

    it('should define TEXT_MESSAGE_CONTENT event type', () => {
      expect(typesContent).toContain('TEXT_MESSAGE_CONTENT');
    });

    it('should define TEXT_MESSAGE_END event type', () => {
      expect(typesContent).toContain('TEXT_MESSAGE_END');
    });

    it('should define TOOL_CALL_START event type', () => {
      expect(typesContent).toContain('TOOL_CALL_START');
    });

    it('should define TOOL_CALL_END event type', () => {
      expect(typesContent).toContain('TOOL_CALL_END');
    });

    it('should define STATE_SNAPSHOT event type', () => {
      expect(typesContent).toContain('STATE_SNAPSHOT');
    });

    it('should define STATE_DELTA event type', () => {
      expect(typesContent).toContain('STATE_DELTA');
    });
  });

  describe('Package Exports', () => {
    it('should have protocols index.ts file', () => {
      const indexPath = path.join(WEB_APP_PATH, 'lib', 'protocols', 'index.ts');
      expect(fs.existsSync(indexPath)).toBe(true);
    });

    describe('index.ts exports', () => {
      let indexContent: string;

      beforeAll(() => {
        const indexPath = path.join(WEB_APP_PATH, 'lib', 'protocols', 'index.ts');
        if (fs.existsSync(indexPath)) {
          indexContent = fs.readFileSync(indexPath, 'utf-8');
        } else {
          indexContent = '';
        }
      });

      it('should export from copilotkit module', () => {
        expect(indexContent).toContain('./copilotkit');
      });

      it('should export from ag-ui module', () => {
        expect(indexContent).toContain('./ag-ui');
      });
    });
  });

  describe('CopilotKit Runtime Endpoint', () => {
    it('should have copilotkit route.ts file', () => {
      const routePath = path.join(WEB_APP_PATH, 'app', 'api', 'copilotkit', 'route.ts');
      expect(fs.existsSync(routePath)).toBe(true);
    });
  });
});
