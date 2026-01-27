/**
 * Settings Pages - ATDD Tests
 *
 * Story: 0-2-10 Implement Settings Pages
 *
 * Tests the settings pages per acceptance criteria:
 * - AC1: Settings at /settings with tabbed navigation
 * - AC2: Profile & Preferences tab
 * - AC3: Account & Security tab
 * - AC4: API Keys tab
 * - AC5: Workspace Settings tab
 * - AC6: Design consistency
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// FILE EXISTENCE TESTS
// =============================================================================

describe('Story 0-2-10: Settings Pages - File Structure', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  describe('Settings Page Files', () => {
    it('should have settings page at app/(app)/settings/page.tsx', () => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/settings/page.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have settings layout at app/(app)/settings/layout.tsx', () => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/settings/layout.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have settings loading state', () => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/settings/loading.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have settings error boundary', () => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/settings/error.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  describe('Settings Component Files', () => {
    it('should have SettingsSidebar component', () => {
      const filePath = path.join(WEB_APP_PATH, 'components/settings/SettingsSidebar.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have ProfileForm component', () => {
      const filePath = path.join(WEB_APP_PATH, 'components/settings/ProfileForm.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have SecuritySection component', () => {
      const filePath = path.join(WEB_APP_PATH, 'components/settings/SecuritySection.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have ApiKeysSection component', () => {
      const filePath = path.join(WEB_APP_PATH, 'components/settings/ApiKeysSection.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have WorkspaceSection component', () => {
      const filePath = path.join(WEB_APP_PATH, 'components/settings/WorkspaceSection.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have component index for barrel exports', () => {
      const filePath = path.join(WEB_APP_PATH, 'components/settings/index.ts');
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  describe('Mock Data Files', () => {
    it('should have settings mock data', () => {
      const filePath = path.join(WEB_APP_PATH, 'lib/mock-data/settings.ts');
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
});

// =============================================================================
// SETTINGS PAGE CONTENT TESTS
// =============================================================================

describe('Story 0-2-10: Settings Page Content', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  describe('AC1: Settings with tabbed navigation', () => {
    let settingsContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/settings/page.tsx');
      if (fs.existsSync(filePath)) {
        settingsContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should render settings page', () => {
      expect(settingsContent).toBeDefined();
    });

    it('should have tab or section navigation', () => {
      expect(settingsContent).toMatch(/tab|section|profile|security|api|workspace/i);
    });
  });

  describe('AC2: Profile & Preferences', () => {
    let profileContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'components/settings/ProfileForm.tsx');
      if (fs.existsSync(filePath)) {
        profileContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should have identity/profile section', () => {
      expect(profileContent).toMatch(/identity|profile|avatar|name|email/i);
    });

    it('should have theme settings', () => {
      expect(profileContent).toMatch(/theme|dark|light|system/i);
    });
  });

  describe('AC3: Account & Security', () => {
    let securityContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'components/settings/SecuritySection.tsx');
      if (fs.existsSync(filePath)) {
        securityContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should have authentication section', () => {
      expect(securityContent).toMatch(/authentication|password|email/i);
    });

    it('should have MFA/2FA section', () => {
      expect(securityContent).toMatch(/mfa|2fa|two.?factor|authenticator/i);
    });

    it('should have active sessions', () => {
      expect(securityContent).toMatch(/session|device|active/i);
    });
  });

  describe('AC4: API Keys', () => {
    let apiKeysContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'components/settings/ApiKeysSection.tsx');
      if (fs.existsSync(filePath)) {
        apiKeysContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should have security warning', () => {
      expect(apiKeysContent).toMatch(/warning|security|alert/i);
    });

    it('should have key listing', () => {
      expect(apiKeysContent).toMatch(/key|token|sk-/i);
    });

    it('should have create key functionality', () => {
      expect(apiKeysContent).toMatch(/create|generate|new/i);
    });

    it('should have copy functionality', () => {
      expect(apiKeysContent).toMatch(/copy|clipboard/i);
    });
  });

  describe('AC5: Workspace Settings', () => {
    let workspaceContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'components/settings/WorkspaceSection.tsx');
      if (fs.existsSync(filePath)) {
        workspaceContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should have general information section', () => {
      expect(workspaceContent).toMatch(/general|name|url|icon/i);
    });

    it('should have AI settings', () => {
      expect(workspaceContent).toMatch(/ai|provider|model|temperature/i);
    });

    it('should have security policies', () => {
      expect(workspaceContent).toMatch(/security|policy|audit|pii|2fa/i);
    });

    it('should have integrations', () => {
      expect(workspaceContent).toMatch(/integration|slack|github/i);
    });
  });
});

// =============================================================================
// COMPONENT CONTENT TESTS
// =============================================================================

describe('Story 0-2-10: Settings Components', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  describe('SettingsSidebar Component', () => {
    let componentContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'components/settings/SettingsSidebar.tsx');
      if (fs.existsSync(filePath)) {
        componentContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should export SettingsSidebar component', () => {
      expect(componentContent).toMatch(/export\s+(function|const)\s+SettingsSidebar/);
    });

    it('should have navigation links', () => {
      expect(componentContent).toMatch(/profile|security|api|workspace/i);
    });

    it('should have active state styling', () => {
      expect(componentContent).toMatch(/active|selected|current/i);
    });
  });

  describe('ProfileForm Component', () => {
    let componentContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'components/settings/ProfileForm.tsx');
      if (fs.existsSync(filePath)) {
        componentContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should export ProfileForm component', () => {
      expect(componentContent).toMatch(/export\s+(function|const)\s+ProfileForm/);
    });

    it('should have form inputs', () => {
      expect(componentContent).toMatch(/input|Input|firstName|lastName/i);
    });
  });

  describe('SecuritySection Component', () => {
    let componentContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'components/settings/SecuritySection.tsx');
      if (fs.existsSync(filePath)) {
        componentContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should export SecuritySection component', () => {
      expect(componentContent).toMatch(/export\s+(function|const)\s+SecuritySection/);
    });

    it('should have danger zone', () => {
      expect(componentContent).toMatch(/danger|delete|export/i);
    });
  });

  describe('ApiKeysSection Component', () => {
    let componentContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'components/settings/ApiKeysSection.tsx');
      if (fs.existsSync(filePath)) {
        componentContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should export ApiKeysSection component', () => {
      expect(componentContent).toMatch(/export\s+(function|const)\s+ApiKeysSection/);
    });

    it('should have masked key display', () => {
      expect(componentContent).toMatch(/mask|••••|hidden|\*\*\*\*/i);
    });
  });

  describe('WorkspaceSection Component', () => {
    let componentContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'components/settings/WorkspaceSection.tsx');
      if (fs.existsSync(filePath)) {
        componentContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should export WorkspaceSection component', () => {
      expect(componentContent).toMatch(/export\s+(function|const)\s+WorkspaceSection/);
    });

    it('should have toggle/switch controls', () => {
      expect(componentContent).toMatch(/switch|toggle|checkbox/i);
    });
  });
});

// =============================================================================
// MOCK DATA TESTS
// =============================================================================

describe('Story 0-2-10: Mock Data', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  describe('Settings Mock Data', () => {
    let mockDataContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'lib/mock-data/settings.ts');
      if (fs.existsSync(filePath)) {
        mockDataContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should export user profile data', () => {
      expect(mockDataContent).toMatch(/user|profile|USER_PROFILE/i);
    });

    it('should export API keys data', () => {
      expect(mockDataContent).toMatch(/apiKey|API_KEY|keys/i);
    });

    it('should export workspace data', () => {
      expect(mockDataContent).toMatch(/workspace|WORKSPACE/i);
    });

    it('should export sessions data', () => {
      expect(mockDataContent).toMatch(/session|SESSIONS/i);
    });
  });
});

// =============================================================================
// DESIGN CONSISTENCY TESTS
// =============================================================================

describe('Story 0-2-10: Design Consistency (AC6)', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  it('should use Hyyve design tokens in settings page', () => {
    const filePath = path.join(WEB_APP_PATH, 'app/(app)/settings/page.tsx');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      // Check for Tailwind classes matching Hyyve tokens
      expect(content).toMatch(/bg-|text-|border-|rounded-/);
    }
  });

  it('should use Material Symbols or lucide icons', () => {
    const filePath = path.join(WEB_APP_PATH, 'components/settings/SettingsSidebar.tsx');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toMatch(/material-symbols|lucide|icon/i);
    }
  });
});

// =============================================================================
// LOADING AND ERROR STATE TESTS
// =============================================================================

describe('Story 0-2-10: Loading and Error States', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  describe('Settings Loading State', () => {
    it('should have skeleton components in loading state', () => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/settings/loading.tsx');
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        expect(content).toMatch(/Skeleton/);
      }
    });
  });

  describe('Settings Error State', () => {
    it('should be a client component for error boundary', () => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/settings/error.tsx');
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        expect(content).toMatch(/['"]use client['"]/);
      }
    });

    it('should have reset functionality', () => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/settings/error.tsx');
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        expect(content).toMatch(/reset/);
      }
    });
  });
});

// =============================================================================
// BARREL EXPORT TESTS
// =============================================================================

describe('Story 0-2-10: Component Exports', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  it('should export all settings components from index', () => {
    const filePath = path.join(WEB_APP_PATH, 'components/settings/index.ts');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toMatch(/export.*SettingsSidebar/);
      expect(content).toMatch(/export.*ProfileForm/);
      expect(content).toMatch(/export.*SecuritySection/);
      expect(content).toMatch(/export.*ApiKeysSection/);
      expect(content).toMatch(/export.*WorkspaceSection/);
    }
  });
});
