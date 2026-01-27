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
import { fileExists, safeReadFile } from '../support/file-helpers';

// =============================================================================
// FILE EXISTENCE TESTS
// =============================================================================

describe('Story 0-2-9: Dashboard Pages - File Structure', () => {
  describe('Dashboard Page Files', () => {
    it('should have dashboard page at app/(app)/dashboard/page.tsx', () => {
      expect(fileExists('app/(app)/dashboard/page.tsx')).toBe(true);
    });

    it('should have dashboard loading state', () => {
      expect(fileExists('app/(app)/dashboard/loading.tsx')).toBe(true);
    });

    it('should have dashboard error boundary', () => {
      expect(fileExists('app/(app)/dashboard/error.tsx')).toBe(true);
    });
  });

  describe('Projects Page Files', () => {
    it('should have projects page at app/(app)/dashboard/projects/page.tsx', () => {
      expect(fileExists('app/(app)/dashboard/projects/page.tsx')).toBe(true);
    });

    it('should have projects loading state', () => {
      expect(fileExists('app/(app)/dashboard/projects/loading.tsx')).toBe(true);
    });

    it('should have projects error boundary', () => {
      expect(fileExists('app/(app)/dashboard/projects/error.tsx')).toBe(true);
    });
  });

  describe('Dashboard Component Files', () => {
    it('should have QuickActionCard component', () => {
      expect(fileExists('components/dashboard/QuickActionCard.tsx')).toBe(true);
    });

    it('should have ProjectCard component', () => {
      expect(fileExists('components/dashboard/ProjectCard.tsx')).toBe(true);
    });

    it('should have UsageWidget component', () => {
      expect(fileExists('components/dashboard/UsageWidget.tsx')).toBe(true);
    });

    it('should have ActivityFeed component', () => {
      expect(fileExists('components/dashboard/ActivityFeed.tsx')).toBe(true);
    });

    it('should have component index for barrel exports', () => {
      expect(fileExists('components/dashboard/index.ts')).toBe(true);
    });
  });

  describe('Mock Data Files', () => {
    it('should have dashboard mock data', () => {
      expect(fileExists('lib/mock-data/dashboard.ts')).toBe(true);
    });
  });
});

// =============================================================================
// DASHBOARD PAGE CONTENT TESTS
// =============================================================================

describe('Story 0-2-9: Dashboard Page Content', () => {
  describe('AC1: Dashboard at /dashboard', () => {
    let dashboardContent = '';

    beforeEach(() => {
      dashboardContent = safeReadFile('app/(app)/dashboard/page.tsx');
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
    let projectsContent = '';

    beforeEach(() => {
      projectsContent = safeReadFile('app/(app)/dashboard/projects/page.tsx');
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
  describe('QuickActionCard Component', () => {
    let componentContent = '';

    beforeEach(() => {
      componentContent = safeReadFile('components/dashboard/QuickActionCard.tsx');
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
    let componentContent = '';

    beforeEach(() => {
      componentContent = safeReadFile('components/dashboard/ProjectCard.tsx');
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
    let componentContent = '';

    beforeEach(() => {
      componentContent = safeReadFile('components/dashboard/UsageWidget.tsx');
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
    let componentContent = '';

    beforeEach(() => {
      componentContent = safeReadFile('components/dashboard/ActivityFeed.tsx');
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
  describe('Dashboard Mock Data', () => {
    let mockDataContent = '';

    beforeEach(() => {
      mockDataContent = safeReadFile('lib/mock-data/dashboard.ts');
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
  it('should use Hyyve design tokens in dashboard page', () => {
    const content = safeReadFile('app/(app)/dashboard/page.tsx');
    expect(content).toMatch(/bg-|text-|border-|rounded-/);
  });

  it('should use Material Symbols icons', () => {
    const content = safeReadFile('components/dashboard/QuickActionCard.tsx');
    expect(content).toMatch(/material-symbols|lucide|icon/i);
  });
});

// =============================================================================
// LOADING AND ERROR STATE TESTS
// =============================================================================

describe('Story 0-2-9: Loading and Error States', () => {
  describe('Dashboard Loading State', () => {
    it('should have skeleton components in loading state', () => {
      const content = safeReadFile('app/(app)/dashboard/loading.tsx');
      expect(content).toMatch(/Skeleton/);
    });
  });

  describe('Dashboard Error State', () => {
    it('should be a client component for error boundary', () => {
      const content = safeReadFile('app/(app)/dashboard/error.tsx');
      expect(content).toMatch(/['"]use client['"]/);
    });

    it('should have reset functionality', () => {
      const content = safeReadFile('app/(app)/dashboard/error.tsx');
      expect(content).toMatch(/reset/);
    });
  });
});

// =============================================================================
// BARREL EXPORT TESTS
// =============================================================================

describe('Story 0-2-9: Component Exports', () => {
  it('should export all dashboard components from index', () => {
    const content = safeReadFile('components/dashboard/index.ts');
    expect(content).toMatch(/export.*QuickActionCard/);
    expect(content).toMatch(/export.*ProjectCard/);
    expect(content).toMatch(/export.*UsageWidget/);
    expect(content).toMatch(/export.*ActivityFeed/);
  });
});
