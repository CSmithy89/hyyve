/**
 * Layout Shells - Acceptance Tests
 *
 * Story: 0-2-3 Create Layout Shells (App, Builder, Auth)
 *
 * These tests verify that layout shell components are properly created
 * with correct structure, styling, and TypeScript interfaces.
 *
 * TDD RED PHASE: These tests MUST fail initially as layout components
 * do not exist yet. The green phase will implement the components.
 *
 * Acceptance Criteria Coverage:
 * - AC1: AppShell Layout (h-16 header, w-64 sidebar, slots)
 * - AC2: BuilderLayout (w-72 left, flex-1 canvas, w-80 right)
 * - AC3: AuthLayout (max-w-[440px] card, centered, gradient background)
 * - AC7: Slot pattern implementation with TypeScript interfaces
 *
 * Test Strategy:
 * 1. File existence tests - verify component files are created
 * 2. Export tests - verify components are properly exported
 * 3. Structure tests - verify correct Tailwind classes for dimensions
 * 4. Interface tests - verify TypeScript types are exported
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// PATH CONSTANTS
// =============================================================================

const LAYOUTS_DIR = path.resolve(__dirname, '../../components/layouts');
const APP_SHELL_PATH = path.join(LAYOUTS_DIR, 'AppShell.tsx');
const BUILDER_LAYOUT_PATH = path.join(LAYOUTS_DIR, 'BuilderLayout.tsx');
const AUTH_LAYOUT_PATH = path.join(LAYOUTS_DIR, 'AuthLayout.tsx');
const INDEX_PATH = path.join(LAYOUTS_DIR, 'index.ts');

// Route group layout paths
const AUTH_ROUTE_LAYOUT_PATH = path.resolve(__dirname, '../../app/(auth)/layout.tsx');
const APP_ROUTE_LAYOUT_PATH = path.resolve(__dirname, '../../app/(app)/layout.tsx');
const BUILDERS_ROUTE_LAYOUT_PATH = path.resolve(__dirname, '../../app/(app)/builders/layout.tsx');

// =============================================================================
// EXPECTED VALUES FROM STORY ACCEPTANCE CRITERIA
// =============================================================================

const EXPECTED_DIMENSIONS = {
  // Header height
  headerHeight: 'h-16', // 64px
  headerHeightPx: 64,

  // AppShell sidebar
  appSidebarWidth: 'w-64', // 256px
  appSidebarWidthPx: 256,

  // BuilderLayout panels
  builderLeftPanelWidth: 'w-72', // 288px
  builderLeftPanelWidthPx: 288,
  builderRightPanelWidth: 'w-80', // 320px
  builderRightPanelWidthPx: 320,

  // AuthLayout card
  authCardMaxWidth: 'max-w-[440px]',
  authCardMaxWidthPx: 440,
} as const;

const EXPECTED_COLORS = {
  backgroundDark: 'bg-background-dark', // #131221
  backgroundDarkHex: '#131221',
  borderDark: 'border-border-dark', // #272546
  borderDarkHex: '#272546',
  canvasDark: 'bg-canvas-dark', // #0f1115
  canvasDarkHex: '#0f1115',
  cardDark: 'bg-card-dark', // #1e293b
  cardDarkHex: '#1e293b',
} as const;

// =============================================================================
// FILE EXISTENCE TESTS
// =============================================================================

describe('Story 0-2-3: Layout Shells', () => {
  describe('File Structure', () => {
    describe('layouts directory', () => {
      it('should have layouts directory at apps/web/components/layouts/', () => {
        const dirExists = fs.existsSync(LAYOUTS_DIR);
        expect(dirExists).toBe(true);
      });

      it('should have index.ts barrel export file', () => {
        const fileExists = fs.existsSync(INDEX_PATH);
        expect(fileExists).toBe(true);
      });
    });

    describe('component files', () => {
      it('should have AppShell.tsx component file', () => {
        const fileExists = fs.existsSync(APP_SHELL_PATH);
        expect(fileExists).toBe(true);
      });

      it('should have BuilderLayout.tsx component file', () => {
        const fileExists = fs.existsSync(BUILDER_LAYOUT_PATH);
        expect(fileExists).toBe(true);
      });

      it('should have AuthLayout.tsx component file', () => {
        const fileExists = fs.existsSync(AUTH_LAYOUT_PATH);
        expect(fileExists).toBe(true);
      });
    });

    describe('route group layouts (AC4)', () => {
      it('should have (auth)/layout.tsx for auth pages', () => {
        const fileExists = fs.existsSync(AUTH_ROUTE_LAYOUT_PATH);
        expect(fileExists).toBe(true);
      });

      it('should have (app)/layout.tsx for authenticated pages', () => {
        const fileExists = fs.existsSync(APP_ROUTE_LAYOUT_PATH);
        expect(fileExists).toBe(true);
      });

      it('should have (app)/builders/layout.tsx for builder pages', () => {
        const fileExists = fs.existsSync(BUILDERS_ROUTE_LAYOUT_PATH);
        expect(fileExists).toBe(true);
      });
    });
  });

  // ===========================================================================
  // AC1: APPSHELL LAYOUT TESTS
  // ===========================================================================

  describe('AC1: AppShell Layout', () => {
    let appShellContent: string | null = null;

    beforeAll(() => {
      try {
        appShellContent = fs.readFileSync(APP_SHELL_PATH, 'utf-8');
      } catch {
        appShellContent = null;
      }
    });

    describe('Component Export', () => {
      it('should export AppShell component', () => {
        expect(appShellContent).not.toBeNull();
        expect(appShellContent).toMatch(/export\s+(default\s+)?function\s+AppShell|export\s+const\s+AppShell/);
      });

      it('should export AppShellProps interface', () => {
        expect(appShellContent).not.toBeNull();
        expect(appShellContent).toMatch(/export\s+(interface|type)\s+AppShellProps/);
      });
    });

    describe('AC1.2: Header Styling', () => {
      it('should have header element or container', () => {
        expect(appShellContent).not.toBeNull();
        expect(appShellContent).toMatch(/<header|role="banner"|aria-label/i);
      });

      it('should have header with h-16 class for 64px height', () => {
        expect(appShellContent).not.toBeNull();
        expect(appShellContent).toContain(EXPECTED_DIMENSIONS.headerHeight);
      });

      it('should have fixed or sticky header positioning', () => {
        expect(appShellContent).not.toBeNull();
        expect(appShellContent).toMatch(/fixed|sticky/);
      });
    });

    describe('AC1.3: Sidebar Styling', () => {
      it('should have aside element or sidebar container', () => {
        expect(appShellContent).not.toBeNull();
        expect(appShellContent).toMatch(/<aside|role="complementary"|sidebar/i);
      });

      it('should have sidebar with w-64 class for 256px width', () => {
        expect(appShellContent).not.toBeNull();
        expect(appShellContent).toContain(EXPECTED_DIMENSIONS.appSidebarWidth);
      });
    });

    describe('AC1.4: Mobile Responsive', () => {
      it('should hide sidebar on mobile with md: breakpoint', () => {
        expect(appShellContent).not.toBeNull();
        expect(appShellContent).toMatch(/hidden.*md:|md:flex|md:block/);
      });

      it('should have hamburger menu or Sheet component for mobile', () => {
        expect(appShellContent).not.toBeNull();
        expect(appShellContent).toMatch(/Sheet|Menu|hamburger|mobile-nav/i);
      });
    });

    describe('AC1.5: Main Content Area', () => {
      it('should have main element', () => {
        expect(appShellContent).not.toBeNull();
        expect(appShellContent).toMatch(/<main|role="main"/i);
      });

      it('should have scrollable content area', () => {
        expect(appShellContent).not.toBeNull();
        expect(appShellContent).toMatch(/overflow-auto|overflow-y-auto|overflow-scroll/);
      });

      it('should have flex-1 for remaining space', () => {
        expect(appShellContent).not.toBeNull();
        expect(appShellContent).toContain('flex-1');
      });
    });

    describe('AC1.6 & AC1.7: Dark Mode Styling', () => {
      it('should use dark background color', () => {
        expect(appShellContent).not.toBeNull();
        const hasDarkBg =
          appShellContent!.includes(EXPECTED_COLORS.backgroundDark) ||
          appShellContent!.includes('bg-background') ||
          appShellContent!.includes(EXPECTED_COLORS.backgroundDarkHex);
        expect(hasDarkBg).toBe(true);
      });

      it('should use dark border color for separators', () => {
        expect(appShellContent).not.toBeNull();
        const hasDarkBorder =
          appShellContent!.includes(EXPECTED_COLORS.borderDark) ||
          appShellContent!.includes('border-border') ||
          appShellContent!.includes('border-card-border');
        expect(hasDarkBorder).toBe(true);
      });
    });

    describe('AC1.8, AC1.9, AC1.10: Slot Props', () => {
      it('should accept children prop', () => {
        expect(appShellContent).not.toBeNull();
        expect(appShellContent).toContain('children');
      });

      it('should accept sidebarContent slot prop', () => {
        expect(appShellContent).not.toBeNull();
        expect(appShellContent).toContain('sidebarContent');
      });

      it('should accept headerRight slot prop', () => {
        expect(appShellContent).not.toBeNull();
        expect(appShellContent).toContain('headerRight');
      });
    });

    describe('TypeScript Interface', () => {
      it('should define children as React.ReactNode', () => {
        expect(appShellContent).not.toBeNull();
        expect(appShellContent).toMatch(/children.*:.*React\.ReactNode|children.*:.*ReactNode/);
      });

      it('should define optional slot props with React.ReactNode type', () => {
        expect(appShellContent).not.toBeNull();
        expect(appShellContent).toMatch(/sidebarContent\??:\s*(React\.)?ReactNode/);
        expect(appShellContent).toMatch(/headerRight\??:\s*(React\.)?ReactNode/);
      });
    });
  });

  // ===========================================================================
  // AC2: BUILDERLAYOUT TESTS
  // ===========================================================================

  describe('AC2: BuilderLayout', () => {
    let builderLayoutContent: string | null = null;

    beforeAll(() => {
      try {
        builderLayoutContent = fs.readFileSync(BUILDER_LAYOUT_PATH, 'utf-8');
      } catch {
        builderLayoutContent = null;
      }
    });

    describe('Component Export', () => {
      it('should export BuilderLayout component', () => {
        expect(builderLayoutContent).not.toBeNull();
        expect(builderLayoutContent).toMatch(/export\s+(default\s+)?function\s+BuilderLayout|export\s+const\s+BuilderLayout/);
      });

      it('should export BuilderLayoutProps interface', () => {
        expect(builderLayoutContent).not.toBeNull();
        expect(builderLayoutContent).toMatch(/export\s+(interface|type)\s+BuilderLayoutProps/);
      });
    });

    describe('AC2.2: Three-Panel Structure', () => {
      it('should have left panel with w-72 class for 288px width', () => {
        expect(builderLayoutContent).not.toBeNull();
        expect(builderLayoutContent).toContain(EXPECTED_DIMENSIONS.builderLeftPanelWidth);
      });

      it('should have center canvas with flex-1 for remaining space', () => {
        expect(builderLayoutContent).not.toBeNull();
        expect(builderLayoutContent).toContain('flex-1');
      });

      it('should have right panel with w-80 class for 320px width', () => {
        expect(builderLayoutContent).not.toBeNull();
        expect(builderLayoutContent).toContain(EXPECTED_DIMENSIONS.builderRightPanelWidth);
      });

      it('should have flex container for three-panel layout', () => {
        expect(builderLayoutContent).not.toBeNull();
        expect(builderLayoutContent).toMatch(/className.*flex/);
      });
    });

    describe('AC2.3: Header Styling', () => {
      it('should have header with h-16 class for 64px height', () => {
        expect(builderLayoutContent).not.toBeNull();
        expect(builderLayoutContent).toContain(EXPECTED_DIMENSIONS.headerHeight);
      });
    });

    describe('AC2.4: Canvas Area Styling', () => {
      it('should use canvas-dark background for center panel', () => {
        expect(builderLayoutContent).not.toBeNull();
        const hasCanvasBg =
          builderLayoutContent!.includes(EXPECTED_COLORS.canvasDark) ||
          builderLayoutContent!.includes('bg-canvas') ||
          builderLayoutContent!.includes(EXPECTED_COLORS.canvasDarkHex);
        expect(hasCanvasBg).toBe(true);
      });

      it('should have dot-grid pattern class or background', () => {
        expect(builderLayoutContent).not.toBeNull();
        expect(builderLayoutContent).toMatch(/bg-dot-grid|dot-grid|dotGrid/);
      });

      it('should have overflow-hidden for infinite canvas', () => {
        expect(builderLayoutContent).not.toBeNull();
        expect(builderLayoutContent).toContain('overflow-hidden');
      });

      it('should have cursor-grab for canvas drag interaction', () => {
        expect(builderLayoutContent).not.toBeNull();
        expect(builderLayoutContent).toMatch(/cursor-grab|cursor:\s*grab/);
      });
    });

    describe('AC2.5: Panel Background Styling', () => {
      it('should use dark background for left panel', () => {
        expect(builderLayoutContent).not.toBeNull();
        const hasDarkBg =
          builderLayoutContent!.includes(EXPECTED_COLORS.backgroundDark) ||
          builderLayoutContent!.includes('bg-background') ||
          builderLayoutContent!.includes(EXPECTED_COLORS.backgroundDarkHex);
        expect(hasDarkBg).toBe(true);
      });
    });

    describe('AC2.6: Border Styling', () => {
      it('should have border-r for left panel right border', () => {
        expect(builderLayoutContent).not.toBeNull();
        expect(builderLayoutContent).toContain('border-r');
      });

      it('should have border-l for right panel left border', () => {
        expect(builderLayoutContent).not.toBeNull();
        expect(builderLayoutContent).toContain('border-l');
      });

      it('should use dark border color', () => {
        expect(builderLayoutContent).not.toBeNull();
        const hasDarkBorder =
          builderLayoutContent!.includes(EXPECTED_COLORS.borderDark) ||
          builderLayoutContent!.includes('border-border');
        expect(hasDarkBorder).toBe(true);
      });
    });

    describe('AC2.7: Zoom Controls', () => {
      it('should have zoom controls container', () => {
        expect(builderLayoutContent).not.toBeNull();
        expect(builderLayoutContent).toMatch(/zoom|ZoomControls|zoom-controls/i);
      });

      it('should position zoom controls at bottom-left or similar', () => {
        expect(builderLayoutContent).not.toBeNull();
        expect(builderLayoutContent).toMatch(/absolute|fixed|bottom|left/);
      });
    });

    describe('AC2.9: Fullscreen Mode Support', () => {
      it('should have fullscreen or collapse toggle capability', () => {
        expect(builderLayoutContent).not.toBeNull();
        expect(builderLayoutContent).toMatch(/fullscreen|collapse|toggle|expand/i);
      });
    });

    describe('AC2.10: Slot Props', () => {
      it('should accept children prop', () => {
        expect(builderLayoutContent).not.toBeNull();
        expect(builderLayoutContent).toContain('children');
      });

      it('should accept leftPanel slot prop', () => {
        expect(builderLayoutContent).not.toBeNull();
        expect(builderLayoutContent).toContain('leftPanel');
      });

      it('should accept rightPanel slot prop', () => {
        expect(builderLayoutContent).not.toBeNull();
        expect(builderLayoutContent).toContain('rightPanel');
      });
    });

    describe('TypeScript Interface', () => {
      it('should define children as React.ReactNode', () => {
        expect(builderLayoutContent).not.toBeNull();
        expect(builderLayoutContent).toMatch(/children.*:.*React\.ReactNode|children.*:.*ReactNode/);
      });

      it('should define leftPanel as optional React.ReactNode', () => {
        expect(builderLayoutContent).not.toBeNull();
        expect(builderLayoutContent).toMatch(/leftPanel\??:\s*(React\.)?ReactNode/);
      });

      it('should define rightPanel as optional React.ReactNode', () => {
        expect(builderLayoutContent).not.toBeNull();
        expect(builderLayoutContent).toMatch(/rightPanel\??:\s*(React\.)?ReactNode/);
      });

      it('should define headerActions as optional React.ReactNode', () => {
        expect(builderLayoutContent).not.toBeNull();
        expect(builderLayoutContent).toMatch(/headerActions\??:\s*(React\.)?ReactNode/);
      });
    });
  });

  // ===========================================================================
  // AC3: AUTHLAYOUT TESTS
  // ===========================================================================

  describe('AC3: AuthLayout', () => {
    let authLayoutContent: string | null = null;

    beforeAll(() => {
      try {
        authLayoutContent = fs.readFileSync(AUTH_LAYOUT_PATH, 'utf-8');
      } catch {
        authLayoutContent = null;
      }
    });

    describe('Component Export', () => {
      it('should export AuthLayout component', () => {
        expect(authLayoutContent).not.toBeNull();
        expect(authLayoutContent).toMatch(/export\s+(default\s+)?function\s+AuthLayout|export\s+const\s+AuthLayout/);
      });

      it('should export AuthLayoutProps interface', () => {
        expect(authLayoutContent).not.toBeNull();
        expect(authLayoutContent).toMatch(/export\s+(interface|type)\s+AuthLayoutProps/);
      });
    });

    describe('AC3.2: Card Width Constraint', () => {
      it('should have card with max-w-[440px] constraint', () => {
        expect(authLayoutContent).not.toBeNull();
        expect(authLayoutContent).toContain(EXPECTED_DIMENSIONS.authCardMaxWidth);
      });
    });

    describe('AC3.3: Card Styling', () => {
      it('should use dark card background', () => {
        expect(authLayoutContent).not.toBeNull();
        const hasCardBg =
          authLayoutContent!.includes(EXPECTED_COLORS.cardDark) ||
          authLayoutContent!.includes('bg-card') ||
          authLayoutContent!.includes(EXPECTED_COLORS.cardDarkHex);
        expect(hasCardBg).toBe(true);
      });

      it('should have border on card', () => {
        expect(authLayoutContent).not.toBeNull();
        expect(authLayoutContent).toMatch(/border-border|border-slate|border-card/);
      });
    });

    describe('AC3.4: Card Border Radius and Shadow', () => {
      it('should have rounded-xl border radius', () => {
        expect(authLayoutContent).not.toBeNull();
        expect(authLayoutContent).toContain('rounded-xl');
      });

      it('should have shadow-2xl for elevation', () => {
        expect(authLayoutContent).not.toBeNull();
        expect(authLayoutContent).toContain('shadow-2xl');
      });
    });

    describe('AC3.5: Background Gradient Effects', () => {
      it('should have gradient background effect', () => {
        expect(authLayoutContent).not.toBeNull();
        expect(authLayoutContent).toMatch(/gradient|bg-gradient/);
      });

      it('should use primary color in gradient (purple/indigo)', () => {
        expect(authLayoutContent).not.toBeNull();
        expect(authLayoutContent).toMatch(/primary|purple|indigo|violet/i);
      });

      it('should have blur effect for ambient glow', () => {
        expect(authLayoutContent).not.toBeNull();
        expect(authLayoutContent).toMatch(/blur|blur-\[?\d+/);
      });
    });

    describe('AC3.6: Grid Pattern Overlay', () => {
      it('should have grid pattern background', () => {
        expect(authLayoutContent).not.toBeNull();
        expect(authLayoutContent).toMatch(/grid-pattern|bg-grid/);
      });

      it('should have pointer-events-none on background elements', () => {
        expect(authLayoutContent).not.toBeNull();
        expect(authLayoutContent).toContain('pointer-events-none');
      });
    });

    describe('AC3.7: Branding', () => {
      it('should have Hyyve logo or branding reference', () => {
        expect(authLayoutContent).not.toBeNull();
        expect(authLayoutContent).toMatch(/logo|Hyyve|brand/i);
      });
    });

    describe('AC3.8: Viewport Centering', () => {
      it('should have min-h-screen or h-screen for full viewport height', () => {
        expect(authLayoutContent).not.toBeNull();
        expect(authLayoutContent).toMatch(/min-h-screen|h-screen|100vh/);
      });

      it('should have flex centering classes', () => {
        expect(authLayoutContent).not.toBeNull();
        expect(authLayoutContent).toMatch(/flex.*items-center|items-center.*flex/);
        expect(authLayoutContent).toMatch(/flex.*justify-center|justify-center.*flex/);
      });
    });

    describe('AC3.9 & AC3.10: Slot Props', () => {
      it('should accept children prop for form content', () => {
        expect(authLayoutContent).not.toBeNull();
        expect(authLayoutContent).toContain('children');
      });

      it('should accept optional footer slot prop', () => {
        expect(authLayoutContent).not.toBeNull();
        expect(authLayoutContent).toContain('footer');
      });
    });

    describe('AC5.3: Responsive Padding', () => {
      it('should have p-8 padding', () => {
        expect(authLayoutContent).not.toBeNull();
        expect(authLayoutContent).toContain('p-8');
      });

      it('should have sm:p-10 responsive padding', () => {
        expect(authLayoutContent).not.toBeNull();
        expect(authLayoutContent).toContain('sm:p-10');
      });
    });

    describe('TypeScript Interface', () => {
      it('should define children as React.ReactNode', () => {
        expect(authLayoutContent).not.toBeNull();
        expect(authLayoutContent).toMatch(/children.*:.*React\.ReactNode|children.*:.*ReactNode/);
      });

      it('should define footer as optional React.ReactNode', () => {
        expect(authLayoutContent).not.toBeNull();
        expect(authLayoutContent).toMatch(/footer\??:\s*(React\.)?ReactNode/);
      });
    });
  });

  // ===========================================================================
  // INDEX BARREL EXPORT TESTS
  // ===========================================================================

  describe('Barrel Export (index.ts)', () => {
    let indexContent: string | null = null;

    beforeAll(() => {
      try {
        indexContent = fs.readFileSync(INDEX_PATH, 'utf-8');
      } catch {
        indexContent = null;
      }
    });

    it('should export AppShell component', () => {
      expect(indexContent).not.toBeNull();
      expect(indexContent).toMatch(/export.*AppShell|AppShell.*export/);
    });

    it('should export BuilderLayout component', () => {
      expect(indexContent).not.toBeNull();
      expect(indexContent).toMatch(/export.*BuilderLayout|BuilderLayout.*export/);
    });

    it('should export AuthLayout component', () => {
      expect(indexContent).not.toBeNull();
      expect(indexContent).toMatch(/export.*AuthLayout|AuthLayout.*export/);
    });

    it('should export TypeScript interfaces', () => {
      expect(indexContent).not.toBeNull();
      expect(indexContent).toMatch(/export.*AppShellProps|AppShellProps.*export/);
      expect(indexContent).toMatch(/export.*BuilderLayoutProps|BuilderLayoutProps.*export/);
      expect(indexContent).toMatch(/export.*AuthLayoutProps|AuthLayoutProps.*export/);
    });
  });

  // ===========================================================================
  // AC4: ROUTE GROUP LAYOUT INTEGRATION TESTS
  // ===========================================================================

  describe('AC4: Route Group Layout Integration', () => {
    describe('Auth Route Layout', () => {
      let authRouteLayoutContent: string | null = null;

      beforeAll(() => {
        try {
          authRouteLayoutContent = fs.readFileSync(AUTH_ROUTE_LAYOUT_PATH, 'utf-8');
        } catch {
          authRouteLayoutContent = null;
        }
      });

      it('should import AuthLayout component', () => {
        expect(authRouteLayoutContent).not.toBeNull();
        expect(authRouteLayoutContent).toMatch(/import.*AuthLayout/);
      });

      it('should use AuthLayout in the layout', () => {
        expect(authRouteLayoutContent).not.toBeNull();
        expect(authRouteLayoutContent).toMatch(/<AuthLayout|AuthLayout\(/);
      });

      it('should have metadata export', () => {
        expect(authRouteLayoutContent).not.toBeNull();
        expect(authRouteLayoutContent).toMatch(/export.*metadata/);
      });
    });

    describe('App Route Layout', () => {
      let appRouteLayoutContent: string | null = null;

      beforeAll(() => {
        try {
          appRouteLayoutContent = fs.readFileSync(APP_ROUTE_LAYOUT_PATH, 'utf-8');
        } catch {
          appRouteLayoutContent = null;
        }
      });

      it('should import AppShell component', () => {
        expect(appRouteLayoutContent).not.toBeNull();
        expect(appRouteLayoutContent).toMatch(/import.*AppShell/);
      });

      it('should use AppShell in the layout', () => {
        expect(appRouteLayoutContent).not.toBeNull();
        expect(appRouteLayoutContent).toMatch(/<AppShell|AppShell\(/);
      });
    });

    describe('Builders Route Layout', () => {
      let buildersRouteLayoutContent: string | null = null;

      beforeAll(() => {
        try {
          buildersRouteLayoutContent = fs.readFileSync(BUILDERS_ROUTE_LAYOUT_PATH, 'utf-8');
        } catch {
          buildersRouteLayoutContent = null;
        }
      });

      it('should import BuilderLayout component', () => {
        expect(buildersRouteLayoutContent).not.toBeNull();
        expect(buildersRouteLayoutContent).toMatch(/import.*BuilderLayout/);
      });

      it('should use BuilderLayout in the layout', () => {
        expect(buildersRouteLayoutContent).not.toBeNull();
        expect(buildersRouteLayoutContent).toMatch(/<BuilderLayout|BuilderLayout\(/);
      });
    });
  });

  // ===========================================================================
  // AC5: RESPONSIVE DESIGN TESTS
  // ===========================================================================

  describe('AC5: Responsive Design', () => {
    describe('AC5.1: AppShell Mobile Sidebar', () => {
      let appShellContent: string | null = null;

      beforeAll(() => {
        try {
          appShellContent = fs.readFileSync(APP_SHELL_PATH, 'utf-8');
        } catch {
          appShellContent = null;
        }
      });

      it('should import Sheet component for mobile navigation', () => {
        expect(appShellContent).not.toBeNull();
        expect(appShellContent).toMatch(/import.*Sheet|Sheet.*from/);
      });

      it('should have responsive breakpoint for 768px (md:)', () => {
        expect(appShellContent).not.toBeNull();
        expect(appShellContent).toMatch(/md:/);
      });
    });

    describe('AC5.2: BuilderLayout Responsive', () => {
      let builderLayoutContent: string | null = null;

      beforeAll(() => {
        try {
          builderLayoutContent = fs.readFileSync(BUILDER_LAYOUT_PATH, 'utf-8');
        } catch {
          builderLayoutContent = null;
        }
      });

      it('should have responsive breakpoint for 1024px (lg:)', () => {
        expect(builderLayoutContent).not.toBeNull();
        expect(builderLayoutContent).toMatch(/lg:/);
      });
    });
  });

  // ===========================================================================
  // AC6: THEME AND DARK MODE SUPPORT
  // ===========================================================================

  describe('AC6: Theme and Dark Mode Support', () => {
    it('should use CSS custom properties (not hardcoded colors) in AppShell', () => {
      let appShellContent: string | null = null;
      try {
        appShellContent = fs.readFileSync(APP_SHELL_PATH, 'utf-8');
      } catch {
        appShellContent = null;
      }

      expect(appShellContent).not.toBeNull();
      // Check that it uses CSS variable references through Tailwind classes
      // rather than hardcoded hex values in className
      const hasVariableColors =
        appShellContent!.includes('bg-background') ||
        appShellContent!.includes('border-border') ||
        appShellContent!.includes('bg-card');
      expect(hasVariableColors).toBe(true);
    });

    it('should use CSS custom properties (not hardcoded colors) in BuilderLayout', () => {
      let builderLayoutContent: string | null = null;
      try {
        builderLayoutContent = fs.readFileSync(BUILDER_LAYOUT_PATH, 'utf-8');
      } catch {
        builderLayoutContent = null;
      }

      expect(builderLayoutContent).not.toBeNull();
      const hasVariableColors =
        builderLayoutContent!.includes('bg-background') ||
        builderLayoutContent!.includes('border-border') ||
        builderLayoutContent!.includes('bg-canvas');
      expect(hasVariableColors).toBe(true);
    });

    it('should use CSS custom properties (not hardcoded colors) in AuthLayout', () => {
      let authLayoutContent: string | null = null;
      try {
        authLayoutContent = fs.readFileSync(AUTH_LAYOUT_PATH, 'utf-8');
      } catch {
        authLayoutContent = null;
      }

      expect(authLayoutContent).not.toBeNull();
      const hasVariableColors =
        authLayoutContent!.includes('bg-background') ||
        authLayoutContent!.includes('bg-card') ||
        authLayoutContent!.includes('border-border');
      expect(hasVariableColors).toBe(true);
    });
  });

  // ===========================================================================
  // ACCESSIBILITY TESTS
  // ===========================================================================

  describe('Accessibility', () => {
    it('should use semantic HTML in AppShell', () => {
      let appShellContent: string | null = null;
      try {
        appShellContent = fs.readFileSync(APP_SHELL_PATH, 'utf-8');
      } catch {
        appShellContent = null;
      }

      expect(appShellContent).not.toBeNull();
      expect(appShellContent).toMatch(/<header|<main|<aside|<nav/);
    });

    it('should use semantic HTML in BuilderLayout', () => {
      let builderLayoutContent: string | null = null;
      try {
        builderLayoutContent = fs.readFileSync(BUILDER_LAYOUT_PATH, 'utf-8');
      } catch {
        builderLayoutContent = null;
      }

      expect(builderLayoutContent).not.toBeNull();
      expect(builderLayoutContent).toMatch(/<header|<main|<aside/);
    });

    it('should have skip-to-main link in AppShell', () => {
      let appShellContent: string | null = null;
      try {
        appShellContent = fs.readFileSync(APP_SHELL_PATH, 'utf-8');
      } catch {
        appShellContent = null;
      }

      expect(appShellContent).not.toBeNull();
      expect(appShellContent).toMatch(/skip.*main|#main|href="#main/i);
    });
  });
});
