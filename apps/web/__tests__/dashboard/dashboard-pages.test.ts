/**
 * Dashboard Pages - ATDD Tests
 *
 * Story: 0-2-9 Implement Dashboard and Project Browser
 *
 * Tests the dashboard and project browser pages per acceptance criteria:
 * - AC1: Dashboard at /dashboard with welcome, quick actions, projects, usage
 * - AC2: Project browser at /dashboard/projects with grid/list, search, filters
 * - AC3: Design consistency with Hyyve tokens
 * - AC4: Responsive design
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// FILE EXISTENCE TESTS
// =============================================================================

describe('Story 0-2-9: Dashboard Pages - File Structure', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  describe('Dashboard Page Files', () => {
    it('should have dashboard page at app/(app)/dashboard/page.tsx', () => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/dashboard/page.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have dashboard loading state', () => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/dashboard/loading.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have dashboard error boundary', () => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/dashboard/error.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  describe('Projects Page Files', () => {
    it('should have projects page at app/(app)/dashboard/projects/page.tsx', () => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/dashboard/projects/page.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have projects loading state', () => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/dashboard/projects/loading.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have projects error boundary', () => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/dashboard/projects/error.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  describe('Dashboard Component Files', () => {
    it('should have QuickActionCard component', () => {
      const filePath = path.join(WEB_APP_PATH, 'components/dashboard/QuickActionCard.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have ProjectCard component', () => {
      const filePath = path.join(WEB_APP_PATH, 'components/dashboard/ProjectCard.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have UsageWidget component', () => {
      const filePath = path.join(WEB_APP_PATH, 'components/dashboard/UsageWidget.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have ActivityFeed component', () => {
      const filePath = path.join(WEB_APP_PATH, 'components/dashboard/ActivityFeed.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should have component index for barrel exports', () => {
      const filePath = path.join(WEB_APP_PATH, 'components/dashboard/index.ts');
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  describe('Mock Data Files', () => {
    it('should have dashboard mock data', () => {
      const filePath = path.join(WEB_APP_PATH, 'lib/mock-data/dashboard.ts');
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
});

// =============================================================================
// DASHBOARD PAGE CONTENT TESTS
// =============================================================================

describe('Story 0-2-9: Dashboard Page Content', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  describe('AC1: Dashboard at /dashboard', () => {
    let dashboardContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/dashboard/page.tsx');
      if (fs.existsSync(filePath)) {
        dashboardContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should include welcome message component', () => {
      expect(dashboardContent).toMatch(/Welcome|welcome/);
    });

    it('should render QuickActionCard components', () => {
      expect(dashboardContent).toMatch(/QuickActionCard/);
    });

    it('should include recent projects section', () => {
      expect(dashboardContent).toMatch(/Recent\s*Projects|recentProjects|ProjectCard/i);
    });

    it('should include UsageWidget component', () => {
      expect(dashboardContent).toMatch(/UsageWidget/);
    });

    it('should include ActivityFeed component', () => {
      expect(dashboardContent).toMatch(/ActivityFeed/);
    });
  });

  describe('AC2: Project Browser at /dashboard/projects', () => {
    let projectsContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/dashboard/projects/page.tsx');
      if (fs.existsSync(filePath)) {
        projectsContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should have grid/list view toggle', () => {
      expect(projectsContent).toMatch(/grid|list|viewMode|GridView|ListView/i);
    });

    it('should have search functionality', () => {
      expect(projectsContent).toMatch(/search|filter|query/i);
    });

    it('should render project cards', () => {
      expect(projectsContent).toMatch(/ProjectCard|project/i);
    });

    it('should have create project button', () => {
      expect(projectsContent).toMatch(/create|new|add/i);
    });
  });
});

// =============================================================================
// COMPONENT CONTENT TESTS
// =============================================================================

describe('Story 0-2-9: Dashboard Components', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  describe('QuickActionCard Component', () => {
    let componentContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'components/dashboard/QuickActionCard.tsx');
      if (fs.existsSync(filePath)) {
        componentContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should export QuickActionCard component', () => {
      expect(componentContent).toMatch(/export\s+(function|const)\s+QuickActionCard/);
    });

    it('should have icon prop', () => {
      expect(componentContent).toMatch(/icon/i);
    });

    it('should have title and description props', () => {
      expect(componentContent).toMatch(/title|description/i);
    });

    it('should have hover styles', () => {
      expect(componentContent).toMatch(/hover:|group-hover/);
    });
  });

  describe('ProjectCard Component', () => {
    let componentContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'components/dashboard/ProjectCard.tsx');
      if (fs.existsSync(filePath)) {
        componentContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should export ProjectCard component', () => {
      expect(componentContent).toMatch(/export\s+(function|const)\s+ProjectCard/);
    });

    it('should have status badge', () => {
      expect(componentContent).toMatch(/status|badge/i);
    });

    it('should show last modified time', () => {
      expect(componentContent).toMatch(/lastModified|edited|modified/i);
    });
  });

  describe('UsageWidget Component', () => {
    let componentContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'components/dashboard/UsageWidget.tsx');
      if (fs.existsSync(filePath)) {
        componentContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should export UsageWidget component', () => {
      expect(componentContent).toMatch(/export\s+(function|const)\s+UsageWidget/);
    });

    it('should show API calls metric', () => {
      expect(componentContent).toMatch(/api|calls|usage/i);
    });

    it('should show cost estimate', () => {
      expect(componentContent).toMatch(/cost|estimate|\$/i);
    });

    it('should have progress bar', () => {
      expect(componentContent).toMatch(/progress|width.*%/i);
    });
  });

  describe('ActivityFeed Component', () => {
    let componentContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'components/dashboard/ActivityFeed.tsx');
      if (fs.existsSync(filePath)) {
        componentContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should export ActivityFeed component', () => {
      expect(componentContent).toMatch(/export\s+(function|const)\s+ActivityFeed/);
    });

    it('should have timeline items', () => {
      expect(componentContent).toMatch(/activity|timeline|item/i);
    });

    it('should show timestamps', () => {
      expect(componentContent).toMatch(/time|ago|date/i);
    });
  });
});

// =============================================================================
// MOCK DATA TESTS
// =============================================================================

describe('Story 0-2-9: Mock Data', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  describe('Dashboard Mock Data', () => {
    let mockDataContent: string;

    beforeEach(() => {
      const filePath = path.join(WEB_APP_PATH, 'lib/mock-data/dashboard.ts');
      if (fs.existsSync(filePath)) {
        mockDataContent = fs.readFileSync(filePath, 'utf-8');
      }
    });

    it('should export quick actions data', () => {
      expect(mockDataContent).toMatch(/quickActions|QUICK_ACTIONS/);
    });

    it('should export recent projects data', () => {
      expect(mockDataContent).toMatch(/recentProjects|RECENT_PROJECTS|projects/i);
    });

    it('should export activity feed data', () => {
      expect(mockDataContent).toMatch(/activity|activities|ACTIVITIES/i);
    });

    it('should export usage stats data', () => {
      expect(mockDataContent).toMatch(/usage|stats|USAGE/i);
    });
  });
});

// =============================================================================
// DESIGN CONSISTENCY TESTS
// =============================================================================

describe('Story 0-2-9: Design Consistency (AC3)', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  it('should use Hyyve design tokens in dashboard page', () => {
    const filePath = path.join(WEB_APP_PATH, 'app/(app)/dashboard/page.tsx');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      // Check for Tailwind classes matching Hyyve tokens
      expect(content).toMatch(/bg-|text-|border-|rounded-/);
    }
  });

  it('should use Material Symbols icons', () => {
    const filePath = path.join(WEB_APP_PATH, 'components/dashboard/QuickActionCard.tsx');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      // Check for Material Symbols or lucide icons
      expect(content).toMatch(/material-symbols|lucide|icon/i);
    }
  });
});

// =============================================================================
// LOADING AND ERROR STATE TESTS
// =============================================================================

describe('Story 0-2-9: Loading and Error States', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  describe('Dashboard Loading State', () => {
    it('should have skeleton components in loading state', () => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/dashboard/loading.tsx');
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        expect(content).toMatch(/Skeleton/);
      }
    });
  });

  describe('Dashboard Error State', () => {
    it('should be a client component for error boundary', () => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/dashboard/error.tsx');
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        expect(content).toMatch(/['"]use client['"]/);
      }
    });

    it('should have reset functionality', () => {
      const filePath = path.join(WEB_APP_PATH, 'app/(app)/dashboard/error.tsx');
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

describe('Story 0-2-9: Component Exports', () => {
  const WEB_APP_PATH = path.join(process.cwd(), 'apps/web');

  it('should export all dashboard components from index', () => {
    const filePath = path.join(WEB_APP_PATH, 'components/dashboard/index.ts');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toMatch(/export.*QuickActionCard/);
      expect(content).toMatch(/export.*ProjectCard/);
      expect(content).toMatch(/export.*UsageWidget/);
      expect(content).toMatch(/export.*ActivityFeed/);
    }
  });
});
