/**
 * Navigation Components - Acceptance Tests
 *
 * Story: 0-2-4 Create Navigation Components
 *
 * These tests verify that navigation components are properly created
 * with correct structure, styling, and TypeScript interfaces.
 *
 * TDD RED PHASE: These tests MUST fail initially as navigation components
 * do not exist yet. The green phase will implement the components.
 *
 * Acceptance Criteria Coverage:
 * - AC1: AppHeader (h-16 header, sticky, search, mobile menu)
 * - AC2: AppSidebar (w-64 sidebar, nav items, logo, active states)
 * - AC3: BuilderHeader (breadcrumbs, action buttons, glow shadow)
 * - AC4: Breadcrumbs (items, separators, links)
 * - AC5: UserMenu (dropdown, avatar, sign out)
 * - AC6: MobileNav (Sheet, navigation items)
 * - AC7: Integration with Layout Shells
 * - AC9: Accessibility
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

const NAV_DIR = path.resolve(__dirname, '../../components/nav');
const APP_HEADER_PATH = path.join(NAV_DIR, 'AppHeader.tsx');
const APP_SIDEBAR_PATH = path.join(NAV_DIR, 'AppSidebar.tsx');
const BUILDER_HEADER_PATH = path.join(NAV_DIR, 'BuilderHeader.tsx');
const BREADCRUMBS_PATH = path.join(NAV_DIR, 'Breadcrumbs.tsx');
const USER_MENU_PATH = path.join(NAV_DIR, 'UserMenu.tsx');
const MOBILE_NAV_PATH = path.join(NAV_DIR, 'MobileNav.tsx');
const NAV_LINK_PATH = path.join(NAV_DIR, 'NavLink.tsx');
const HYYVE_LOGO_PATH = path.join(NAV_DIR, 'HyyveLogo.tsx');
const INDEX_PATH = path.join(NAV_DIR, 'index.ts');
const CONSTANTS_PATH = path.join(NAV_DIR, 'constants.ts');

// =============================================================================
// EXPECTED VALUES FROM STORY ACCEPTANCE CRITERIA
// =============================================================================

const EXPECTED_DIMENSIONS = {
  // Header height
  headerHeight: 'h-16', // 64px
  headerHeightPx: 64,

  // Sidebar width
  sidebarWidth: 'w-64', // 256px
  sidebarWidthPx: 256,
} as const;

const EXPECTED_CLASSES = {
  // Positioning
  sticky: 'sticky',
  topZero: 'top-0',
  zTen: 'z-10',

  // Run button glow
  runButtonGlow: 'shadow-[0_0_15px_rgba(80,72,229,0.3)]',

  // Responsive
  hiddenMobile: 'hidden',
  mdFlex: 'md:flex',
  mdBlock: 'md:block',
} as const;

// =============================================================================
// FILE STRUCTURE TESTS
// =============================================================================

describe('Story 0-2-4: Navigation Components', () => {
  describe('File Structure', () => {
    describe('navigation directory', () => {
      it('should have navigation directory at apps/web/components/nav/', () => {
        const dirExists = fs.existsSync(NAV_DIR);
        expect(dirExists).toBe(true);
      });

      it('should have index.ts barrel export file', () => {
        const fileExists = fs.existsSync(INDEX_PATH);
        expect(fileExists).toBe(true);
      });
    });

    describe('component files', () => {
      it('should have AppHeader.tsx component file', () => {
        const fileExists = fs.existsSync(APP_HEADER_PATH);
        expect(fileExists).toBe(true);
      });

      it('should have AppSidebar.tsx component file', () => {
        const fileExists = fs.existsSync(APP_SIDEBAR_PATH);
        expect(fileExists).toBe(true);
      });

      it('should have BuilderHeader.tsx component file', () => {
        const fileExists = fs.existsSync(BUILDER_HEADER_PATH);
        expect(fileExists).toBe(true);
      });

      it('should have Breadcrumbs.tsx component file', () => {
        const fileExists = fs.existsSync(BREADCRUMBS_PATH);
        expect(fileExists).toBe(true);
      });

      it('should have UserMenu.tsx component file', () => {
        const fileExists = fs.existsSync(USER_MENU_PATH);
        expect(fileExists).toBe(true);
      });

      it('should have MobileNav.tsx component file', () => {
        const fileExists = fs.existsSync(MOBILE_NAV_PATH);
        expect(fileExists).toBe(true);
      });

      it('should have NavLink.tsx component file', () => {
        const fileExists = fs.existsSync(NAV_LINK_PATH);
        expect(fileExists).toBe(true);
      });

      it('should have HyyveLogo.tsx component file', () => {
        const fileExists = fs.existsSync(HYYVE_LOGO_PATH);
        expect(fileExists).toBe(true);
      });
    });
  });

  // ===========================================================================
  // AC1: APPHEADER LAYOUT TESTS
  // ===========================================================================

  describe('AC1: AppHeader Component', () => {
    let appHeaderContent: string | null = null;

    beforeAll(() => {
      try {
        appHeaderContent = fs.readFileSync(APP_HEADER_PATH, 'utf-8');
      } catch {
        appHeaderContent = null;
      }
    });

    describe('Component Export', () => {
      it('should export AppHeader component', () => {
        expect(appHeaderContent).not.toBeNull();
        expect(appHeaderContent).toMatch(/export\s+(default\s+)?function\s+AppHeader|export\s+const\s+AppHeader/);
      });

      it('should export AppHeaderProps interface', () => {
        expect(appHeaderContent).not.toBeNull();
        expect(appHeaderContent).toMatch(/export\s+(interface|type)\s+AppHeaderProps/);
      });
    });

    describe('AC1.2: Height Styling', () => {
      it('should have h-16 class for 64px height', () => {
        expect(appHeaderContent).not.toBeNull();
        expect(appHeaderContent).toContain(EXPECTED_DIMENSIONS.headerHeight);
      });
    });

    describe('AC1.12: Sticky Positioning', () => {
      it('should have sticky positioning', () => {
        expect(appHeaderContent).not.toBeNull();
        expect(appHeaderContent).toContain(EXPECTED_CLASSES.sticky);
      });

      it('should have top-0 class', () => {
        expect(appHeaderContent).not.toBeNull();
        expect(appHeaderContent).toContain(EXPECTED_CLASSES.topZero);
      });

      it('should have z-10 or higher z-index', () => {
        expect(appHeaderContent).not.toBeNull();
        expect(appHeaderContent).toMatch(/z-10|z-20|z-30|z-40|z-50/);
      });
    });

    describe('AC1.3: Background Styling', () => {
      it('should have backdrop blur for translucency', () => {
        expect(appHeaderContent).not.toBeNull();
        expect(appHeaderContent).toMatch(/backdrop-blur/);
      });
    });

    describe('AC1.6: Search Input (Desktop)', () => {
      it('should have search input element', () => {
        expect(appHeaderContent).not.toBeNull();
        expect(appHeaderContent).toMatch(/<input|Search|search/);
      });

      it('should have search input hidden on mobile', () => {
        expect(appHeaderContent).not.toBeNull();
        expect(appHeaderContent).toMatch(/hidden.*md:|md:flex|md:block/);
      });
    });

    describe('AC1.5: Mobile Menu Trigger', () => {
      it('should have hamburger menu or menu button', () => {
        expect(appHeaderContent).not.toBeNull();
        expect(appHeaderContent).toMatch(/Menu|hamburger|menu.*button|onMenuClick/i);
      });
    });

    describe('AC1.10: onMenuClick Prop', () => {
      it('should accept onMenuClick prop for mobile sidebar toggle', () => {
        expect(appHeaderContent).not.toBeNull();
        expect(appHeaderContent).toContain('onMenuClick');
      });
    });

    describe('AC1.11: rightContent Slot', () => {
      it('should accept rightContent slot prop', () => {
        expect(appHeaderContent).not.toBeNull();
        expect(appHeaderContent).toContain('rightContent');
      });
    });

    describe('AC1.7: Notification Button', () => {
      it('should have notification button or bell icon reference', () => {
        expect(appHeaderContent).not.toBeNull();
        expect(appHeaderContent).toMatch(/notification|bell|Badge/i);
      });
    });

    describe('TypeScript Interface', () => {
      it('should define onMenuClick as optional callback', () => {
        expect(appHeaderContent).not.toBeNull();
        expect(appHeaderContent).toMatch(/onMenuClick\??:\s*\(\)\s*=>\s*void/);
      });

      it('should define rightContent as optional React.ReactNode', () => {
        expect(appHeaderContent).not.toBeNull();
        expect(appHeaderContent).toMatch(/rightContent\??:\s*(React\.)?ReactNode/);
      });
    });
  });

  // ===========================================================================
  // AC2: APPSIDEBAR TESTS
  // ===========================================================================

  describe('AC2: AppSidebar Component', () => {
    let appSidebarContent: string | null = null;

    beforeAll(() => {
      try {
        appSidebarContent = fs.readFileSync(APP_SIDEBAR_PATH, 'utf-8');
      } catch {
        appSidebarContent = null;
      }
    });

    describe('Component Export', () => {
      it('should export AppSidebar component', () => {
        expect(appSidebarContent).not.toBeNull();
        expect(appSidebarContent).toMatch(/export\s+(default\s+)?function\s+AppSidebar|export\s+const\s+AppSidebar/);
      });

      it('should export AppSidebarProps interface', () => {
        expect(appSidebarContent).not.toBeNull();
        expect(appSidebarContent).toMatch(/export\s+(interface|type)\s+AppSidebarProps/);
      });
    });

    describe('AC2.2: Width Styling', () => {
      it('should have w-64 class for 256px width', () => {
        expect(appSidebarContent).not.toBeNull();
        expect(appSidebarContent).toContain(EXPECTED_DIMENSIONS.sidebarWidth);
      });
    });

    describe('AC2.5: Hyyve Logo', () => {
      it('should have Hyyve logo reference', () => {
        expect(appSidebarContent).not.toBeNull();
        expect(appSidebarContent).toMatch(/Hyyve|hive|HyyveLogo|Logo/i);
      });
    });

    describe('AC2.6 & AC2.7: Navigation Items', () => {
      it('should have navigation items structure', () => {
        expect(appSidebarContent).not.toBeNull();
        expect(appSidebarContent).toMatch(/nav|navigation|NavItem|items/i);
      });

      it('should have Home navigation item', () => {
        expect(appSidebarContent).not.toBeNull();
        expect(appSidebarContent).toMatch(/Home|home/);
      });

      it('should have Projects navigation item', () => {
        // Navigation items can be in AppSidebar directly or imported from constants
        const constantsContent = fs.existsSync(CONSTANTS_PATH)
          ? fs.readFileSync(CONSTANTS_PATH, 'utf-8')
          : '';
        const hasProjects =
          appSidebarContent?.match(/Projects|projects/) ||
          constantsContent.match(/Projects|projects/);
        expect(hasProjects).toBeTruthy();
      });

      it('should have Settings navigation item', () => {
        // Navigation items can be in AppSidebar directly or imported from constants
        const constantsContent = fs.existsSync(CONSTANTS_PATH)
          ? fs.readFileSync(CONSTANTS_PATH, 'utf-8')
          : '';
        const hasSettings =
          appSidebarContent?.match(/Settings|settings/) ||
          constantsContent.match(/Settings|settings/);
        expect(hasSettings).toBeTruthy();
      });

      it('should have Documentation navigation item', () => {
        // Navigation items can be in AppSidebar directly or imported from constants
        const constantsContent = fs.existsSync(CONSTANTS_PATH)
          ? fs.readFileSync(CONSTANTS_PATH, 'utf-8')
          : '';
        const hasDocumentation =
          appSidebarContent?.match(/Documentation|Docs|docs/) ||
          constantsContent.match(/Documentation|Docs|docs/);
        expect(hasDocumentation).toBeTruthy();
      });
    });

    describe('AC2.8: Active State Styling', () => {
      it('should have active state classes', () => {
        expect(appSidebarContent).not.toBeNull();
        expect(appSidebarContent).toMatch(/active|isActive|activePath/i);
      });

      it('should have bg-card-border for active state', () => {
        expect(appSidebarContent).not.toBeNull();
        expect(appSidebarContent).toMatch(/bg-card-border|card-border/);
      });
    });

    describe('AC2.10: UserMenu at Bottom', () => {
      it('should include UserMenu component', () => {
        expect(appSidebarContent).not.toBeNull();
        expect(appSidebarContent).toMatch(/UserMenu|user-menu/i);
      });
    });

    describe('AC2.11: Mobile Responsive', () => {
      it('should hide sidebar on mobile with md: breakpoint', () => {
        expect(appSidebarContent).not.toBeNull();
        expect(appSidebarContent).toMatch(/hidden.*md:flex|hidden md:flex|md:flex.*hidden/);
      });
    });

    describe('AC2.12: Flex Layout', () => {
      it('should use flex flex-col for vertical layout', () => {
        expect(appSidebarContent).not.toBeNull();
        expect(appSidebarContent).toContain('flex-col');
      });

      it('should use justify-between for sticky footer', () => {
        expect(appSidebarContent).not.toBeNull();
        expect(appSidebarContent).toContain('justify-between');
      });
    });

    describe('AC2.13: activePath Prop', () => {
      it('should accept activePath prop', () => {
        expect(appSidebarContent).not.toBeNull();
        expect(appSidebarContent).toContain('activePath');
      });
    });

    describe('AC2.14: Next.js Link Usage', () => {
      it('should import Next.js Link component', () => {
        expect(appSidebarContent).not.toBeNull();
        expect(appSidebarContent).toMatch(/import.*Link.*from.*next\/link/);
      });
    });

    describe('TypeScript Interface', () => {
      it('should define activePath as optional string', () => {
        expect(appSidebarContent).not.toBeNull();
        expect(appSidebarContent).toMatch(/activePath\??:\s*string/);
      });

      it('should define items as optional NavItem array', () => {
        expect(appSidebarContent).not.toBeNull();
        expect(appSidebarContent).toMatch(/items\??:\s*NavItem\[\]/);
      });
    });
  });

  // ===========================================================================
  // AC3: BUILDERHEADER TESTS
  // ===========================================================================

  describe('AC3: BuilderHeader Component', () => {
    let builderHeaderContent: string | null = null;

    beforeAll(() => {
      try {
        builderHeaderContent = fs.readFileSync(BUILDER_HEADER_PATH, 'utf-8');
      } catch {
        builderHeaderContent = null;
      }
    });

    describe('Component Export', () => {
      it('should export BuilderHeader component', () => {
        expect(builderHeaderContent).not.toBeNull();
        expect(builderHeaderContent).toMatch(/export\s+(default\s+)?function\s+BuilderHeader|export\s+const\s+BuilderHeader/);
      });

      it('should export BuilderHeaderProps interface', () => {
        expect(builderHeaderContent).not.toBeNull();
        expect(builderHeaderContent).toMatch(/export\s+(interface|type)\s+BuilderHeaderProps/);
      });
    });

    describe('AC3.2: Height Styling', () => {
      it('should have h-16 class for 64px height', () => {
        expect(builderHeaderContent).not.toBeNull();
        expect(builderHeaderContent).toContain(EXPECTED_DIMENSIONS.headerHeight);
      });
    });

    describe('AC3.5: Left Section with Breadcrumbs', () => {
      it('should include Breadcrumbs component', () => {
        expect(builderHeaderContent).not.toBeNull();
        expect(builderHeaderContent).toMatch(/Breadcrumbs|breadcrumbs/);
      });

      it('should have logo reference', () => {
        expect(builderHeaderContent).not.toBeNull();
        expect(builderHeaderContent).toMatch(/Hyyve|hive|HyyveLogo|Logo|svg/i);
      });

      it('should have vertical separator', () => {
        expect(builderHeaderContent).not.toBeNull();
        expect(builderHeaderContent).toMatch(/separator|h-6.*w-px|w-px.*h-6/i);
      });
    });

    describe('AC3.6: Action Buttons', () => {
      it('should have Run button', () => {
        expect(builderHeaderContent).not.toBeNull();
        expect(builderHeaderContent).toMatch(/Run|run|play/i);
      });

      it('should have Save button', () => {
        expect(builderHeaderContent).not.toBeNull();
        expect(builderHeaderContent).toMatch(/Save|save/i);
      });

      it('should have Export button', () => {
        expect(builderHeaderContent).not.toBeNull();
        expect(builderHeaderContent).toMatch(/Export|export|share/i);
      });

      it('should have Settings button', () => {
        expect(builderHeaderContent).not.toBeNull();
        expect(builderHeaderContent).toMatch(/Settings|settings|gear/i);
      });
    });

    describe('AC3.7: Run Button Glow Effect', () => {
      it('should have glow shadow on Run button', () => {
        expect(builderHeaderContent).not.toBeNull();
        expect(builderHeaderContent).toContain(EXPECTED_CLASSES.runButtonGlow);
      });
    });

    describe('AC3.8: Breadcrumbs Prop', () => {
      it('should accept breadcrumbs array prop', () => {
        expect(builderHeaderContent).not.toBeNull();
        expect(builderHeaderContent).toMatch(/breadcrumbs:\s*BreadcrumbItem\[\]/);
      });
    });

    describe('AC3.9: Callback Props', () => {
      it('should accept onRun callback prop', () => {
        expect(builderHeaderContent).not.toBeNull();
        expect(builderHeaderContent).toContain('onRun');
      });

      it('should accept onSave callback prop', () => {
        expect(builderHeaderContent).not.toBeNull();
        expect(builderHeaderContent).toContain('onSave');
      });

      it('should accept onExport callback prop', () => {
        expect(builderHeaderContent).not.toBeNull();
        expect(builderHeaderContent).toContain('onExport');
      });

      it('should accept onSettings callback prop', () => {
        expect(builderHeaderContent).not.toBeNull();
        expect(builderHeaderContent).toContain('onSettings');
      });
    });

    describe('AC3.10: Loading States', () => {
      it('should accept isRunning prop for loading state', () => {
        expect(builderHeaderContent).not.toBeNull();
        expect(builderHeaderContent).toContain('isRunning');
      });

      it('should accept isSaving prop for loading state', () => {
        expect(builderHeaderContent).not.toBeNull();
        expect(builderHeaderContent).toContain('isSaving');
      });
    });

    describe('User Avatar', () => {
      it('should have user avatar with gradient border', () => {
        expect(builderHeaderContent).not.toBeNull();
        expect(builderHeaderContent).toMatch(/gradient|avatar|UserAvatar/i);
      });
    });
  });

  // ===========================================================================
  // AC4: BREADCRUMBS TESTS
  // ===========================================================================

  describe('AC4: Breadcrumbs Component', () => {
    let breadcrumbsContent: string | null = null;

    beforeAll(() => {
      try {
        breadcrumbsContent = fs.readFileSync(BREADCRUMBS_PATH, 'utf-8');
      } catch {
        breadcrumbsContent = null;
      }
    });

    describe('Component Export', () => {
      it('should export Breadcrumbs component', () => {
        expect(breadcrumbsContent).not.toBeNull();
        expect(breadcrumbsContent).toMatch(/export\s+(default\s+)?function\s+Breadcrumbs|export\s+const\s+Breadcrumbs/);
      });

      it('should export BreadcrumbsProps interface', () => {
        expect(breadcrumbsContent).not.toBeNull();
        expect(breadcrumbsContent).toMatch(/export\s+(interface|type)\s+BreadcrumbsProps/);
      });

      it('should export BreadcrumbItem interface', () => {
        expect(breadcrumbsContent).not.toBeNull();
        expect(breadcrumbsContent).toMatch(/export\s+(interface|type)\s+BreadcrumbItem/);
      });
    });

    describe('AC4.8: Items Prop', () => {
      it('should accept items array prop', () => {
        expect(breadcrumbsContent).not.toBeNull();
        expect(breadcrumbsContent).toMatch(/items:\s*BreadcrumbItem\[\]/);
      });
    });

    describe('AC4.2 & AC4.3: Separator Elements', () => {
      it('should have chevron separator reference', () => {
        expect(breadcrumbsContent).not.toBeNull();
        expect(breadcrumbsContent).toMatch(/chevron|ChevronRight|separator/i);
      });
    });

    describe('AC4.4: Link Usage for Navigation', () => {
      it('should import Next.js Link component', () => {
        expect(breadcrumbsContent).not.toBeNull();
        expect(breadcrumbsContent).toMatch(/import.*Link.*from.*next\/link/);
      });

      it('should render Link for items with href', () => {
        expect(breadcrumbsContent).not.toBeNull();
        expect(breadcrumbsContent).toMatch(/<Link|Link\s+href/);
      });
    });

    describe('AC4.6: Current Item Styling', () => {
      it('should have badge styling for current item', () => {
        expect(breadcrumbsContent).not.toBeNull();
        expect(breadcrumbsContent).toMatch(/bg-\[#272546\]|badge|rounded/);
      });
    });

    describe('AC4.11: Accessibility', () => {
      it('should have aria-label on navigation', () => {
        expect(breadcrumbsContent).not.toBeNull();
        expect(breadcrumbsContent).toMatch(/aria-label.*[Bb]readcrumb/);
      });

      it('should have aria-current for current page', () => {
        expect(breadcrumbsContent).not.toBeNull();
        expect(breadcrumbsContent).toContain('aria-current');
      });
    });

    describe('TypeScript Interface', () => {
      it('should define BreadcrumbItem with label string', () => {
        expect(breadcrumbsContent).not.toBeNull();
        expect(breadcrumbsContent).toMatch(/label:\s*string/);
      });

      it('should define BreadcrumbItem with optional href', () => {
        expect(breadcrumbsContent).not.toBeNull();
        expect(breadcrumbsContent).toMatch(/href\??:\s*string/);
      });
    });
  });

  // ===========================================================================
  // AC5: USERMENU TESTS
  // ===========================================================================

  describe('AC5: UserMenu Component', () => {
    let userMenuContent: string | null = null;

    beforeAll(() => {
      try {
        userMenuContent = fs.readFileSync(USER_MENU_PATH, 'utf-8');
      } catch {
        userMenuContent = null;
      }
    });

    describe('Component Export', () => {
      it('should export UserMenu component', () => {
        expect(userMenuContent).not.toBeNull();
        expect(userMenuContent).toMatch(/export\s+(default\s+)?function\s+UserMenu|export\s+const\s+UserMenu/);
      });

      it('should export UserMenuProps interface', () => {
        expect(userMenuContent).not.toBeNull();
        expect(userMenuContent).toMatch(/export\s+(interface|type)\s+UserMenuProps/);
      });
    });

    describe('AC5.2: Clerk Integration', () => {
      it('should import useUser from Clerk', () => {
        expect(userMenuContent).not.toBeNull();
        expect(userMenuContent).toMatch(/import.*useUser.*from.*@clerk/);
      });

      it('should import useClerk for signOut', () => {
        expect(userMenuContent).not.toBeNull();
        expect(userMenuContent).toMatch(/import.*useClerk.*from.*@clerk/);
      });
    });

    describe('AC5.3: Avatar Presence', () => {
      it('should have avatar element', () => {
        expect(userMenuContent).not.toBeNull();
        expect(userMenuContent).toMatch(/avatar|Avatar|imageUrl|rounded-full/i);
      });
    });

    describe('AC5.7: Dropdown Structure', () => {
      it('should use DropdownMenu component', () => {
        expect(userMenuContent).not.toBeNull();
        expect(userMenuContent).toMatch(/DropdownMenu|Dropdown/);
      });
    });

    describe('AC5.8: Menu Items', () => {
      it('should have Profile menu item', () => {
        expect(userMenuContent).not.toBeNull();
        expect(userMenuContent).toMatch(/Profile|profile/);
      });

      it('should have Settings menu item', () => {
        expect(userMenuContent).not.toBeNull();
        expect(userMenuContent).toMatch(/Settings|settings/);
      });

      it('should have Sign Out menu item', () => {
        expect(userMenuContent).not.toBeNull();
        expect(userMenuContent).toMatch(/Sign\s*Out|signOut|Sign Out|Logout|logout/i);
      });
    });

    describe('AC5.11: Sign Out Functionality', () => {
      it('should call signOut function', () => {
        expect(userMenuContent).not.toBeNull();
        // Accept signOut() with or without options (e.g., signOut({ redirectUrl: '/' }))
        expect(userMenuContent).toMatch(/signOut\s*\(/);
      });
    });

    describe('AC5.13: Variant Prop', () => {
      it('should accept variant prop', () => {
        expect(userMenuContent).not.toBeNull();
        expect(userMenuContent).toContain('variant');
      });

      it('should support sidebar and header variants', () => {
        expect(userMenuContent).not.toBeNull();
        expect(userMenuContent).toMatch(/sidebar.*header|header.*sidebar|'sidebar'|'header'/);
      });
    });

    describe('TypeScript Interface', () => {
      it('should define variant as optional union type', () => {
        expect(userMenuContent).not.toBeNull();
        expect(userMenuContent).toMatch(/variant\??:\s*['"]sidebar['"].*\|.*['"]header['"]|variant\??:\s*['"]header['"].*\|.*['"]sidebar['"]/);
      });
    });
  });

  // ===========================================================================
  // AC6: MOBILENAV TESTS
  // ===========================================================================

  describe('AC6: MobileNav Component', () => {
    let mobileNavContent: string | null = null;

    beforeAll(() => {
      try {
        mobileNavContent = fs.readFileSync(MOBILE_NAV_PATH, 'utf-8');
      } catch {
        mobileNavContent = null;
      }
    });

    describe('Component Export', () => {
      it('should export MobileNav component', () => {
        expect(mobileNavContent).not.toBeNull();
        expect(mobileNavContent).toMatch(/export\s+(default\s+)?function\s+MobileNav|export\s+const\s+MobileNav/);
      });

      it('should export MobileNavProps interface', () => {
        expect(mobileNavContent).not.toBeNull();
        expect(mobileNavContent).toMatch(/export\s+(interface|type)\s+MobileNavProps/);
      });
    });

    describe('AC6.2: Sheet Component Usage', () => {
      it('should import Sheet component from shadcn/ui', () => {
        expect(mobileNavContent).not.toBeNull();
        expect(mobileNavContent).toMatch(/import.*Sheet.*from/);
      });

      it('should use Sheet with side="left"', () => {
        expect(mobileNavContent).not.toBeNull();
        expect(mobileNavContent).toMatch(/side.*left|side=["']left["']/);
      });
    });

    describe('AC6.3: Width Matching Sidebar', () => {
      it('should have w-64 width matching sidebar', () => {
        expect(mobileNavContent).not.toBeNull();
        expect(mobileNavContent).toContain(EXPECTED_DIMENSIONS.sidebarWidth);
      });
    });

    describe('AC6.4: Navigation Items', () => {
      it('should contain navigation items', () => {
        expect(mobileNavContent).not.toBeNull();
        expect(mobileNavContent).toMatch(/NavItem|items|navigation/i);
      });
    });

    describe('AC6.5: UserMenu Inclusion', () => {
      it('should include UserMenu component', () => {
        expect(mobileNavContent).not.toBeNull();
        expect(mobileNavContent).toMatch(/UserMenu|user-menu/i);
      });
    });

    describe('AC6.6: Controlled State Props', () => {
      it('should accept open prop', () => {
        expect(mobileNavContent).not.toBeNull();
        expect(mobileNavContent).toContain('open');
      });

      it('should accept onOpenChange prop', () => {
        expect(mobileNavContent).not.toBeNull();
        expect(mobileNavContent).toContain('onOpenChange');
      });
    });

    describe('TypeScript Interface', () => {
      it('should define open as boolean', () => {
        expect(mobileNavContent).not.toBeNull();
        expect(mobileNavContent).toMatch(/open:\s*boolean/);
      });

      it('should define onOpenChange as callback', () => {
        expect(mobileNavContent).not.toBeNull();
        expect(mobileNavContent).toMatch(/onOpenChange:\s*\(open:\s*boolean\)\s*=>\s*void/);
      });
    });
  });

  // ===========================================================================
  // NAVLINK INTERNAL COMPONENT TESTS
  // ===========================================================================

  describe('NavLink Internal Component', () => {
    let navLinkContent: string | null = null;

    beforeAll(() => {
      try {
        navLinkContent = fs.readFileSync(NAV_LINK_PATH, 'utf-8');
      } catch {
        navLinkContent = null;
      }
    });

    describe('Component Export', () => {
      it('should export NavLink component', () => {
        expect(navLinkContent).not.toBeNull();
        expect(navLinkContent).toMatch(/export\s+(default\s+)?function\s+NavLink|export\s+const\s+NavLink/);
      });

      it('should export NavLinkProps interface', () => {
        expect(navLinkContent).not.toBeNull();
        expect(navLinkContent).toMatch(/export\s+(interface|type)\s+NavLinkProps/);
      });
    });

    describe('Props', () => {
      it('should accept href prop', () => {
        expect(navLinkContent).not.toBeNull();
        expect(navLinkContent).toContain('href');
      });

      it('should accept icon prop', () => {
        expect(navLinkContent).not.toBeNull();
        expect(navLinkContent).toContain('icon');
      });

      it('should accept label prop', () => {
        expect(navLinkContent).not.toBeNull();
        expect(navLinkContent).toContain('label');
      });

      it('should accept isActive prop', () => {
        expect(navLinkContent).not.toBeNull();
        expect(navLinkContent).toContain('isActive');
      });
    });

    describe('Next.js Link Usage', () => {
      it('should import Next.js Link component', () => {
        expect(navLinkContent).not.toBeNull();
        expect(navLinkContent).toMatch(/import.*Link.*from.*next\/link/);
      });
    });
  });

  // ===========================================================================
  // HYYVELOGO COMPONENT TESTS
  // ===========================================================================

  describe('HyyveLogo Component', () => {
    let hyyveLogoContent: string | null = null;

    beforeAll(() => {
      try {
        hyyveLogoContent = fs.readFileSync(HYYVE_LOGO_PATH, 'utf-8');
      } catch {
        hyyveLogoContent = null;
      }
    });

    describe('Component Export', () => {
      it('should export HyyveLogo component', () => {
        expect(hyyveLogoContent).not.toBeNull();
        expect(hyyveLogoContent).toMatch(/export\s+(default\s+)?function\s+HyyveLogo|export\s+const\s+HyyveLogo/);
      });
    });

    describe('SVG Content', () => {
      it('should have SVG element', () => {
        expect(hyyveLogoContent).not.toBeNull();
        expect(hyyveLogoContent).toMatch(/<svg|SVG/);
      });
    });

    describe('Variants', () => {
      it('should support icon-only or full variant', () => {
        expect(hyyveLogoContent).not.toBeNull();
        expect(hyyveLogoContent).toMatch(/variant|showText|iconOnly/i);
      });
    });
  });

  // ===========================================================================
  // BARREL EXPORT TESTS
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

    it('should export AppHeader component', () => {
      expect(indexContent).not.toBeNull();
      expect(indexContent).toMatch(/export.*AppHeader/);
    });

    it('should export AppSidebar component', () => {
      expect(indexContent).not.toBeNull();
      expect(indexContent).toMatch(/export.*AppSidebar/);
    });

    it('should export BuilderHeader component', () => {
      expect(indexContent).not.toBeNull();
      expect(indexContent).toMatch(/export.*BuilderHeader/);
    });

    it('should export Breadcrumbs component', () => {
      expect(indexContent).not.toBeNull();
      expect(indexContent).toMatch(/export.*Breadcrumbs/);
    });

    it('should export UserMenu component', () => {
      expect(indexContent).not.toBeNull();
      expect(indexContent).toMatch(/export.*UserMenu/);
    });

    it('should export MobileNav component', () => {
      expect(indexContent).not.toBeNull();
      expect(indexContent).toMatch(/export.*MobileNav/);
    });

    it('should export TypeScript interfaces', () => {
      expect(indexContent).not.toBeNull();
      expect(indexContent).toMatch(/export.*type.*AppHeaderProps|AppHeaderProps.*export/);
      expect(indexContent).toMatch(/export.*type.*AppSidebarProps|AppSidebarProps.*export/);
      expect(indexContent).toMatch(/export.*type.*BuilderHeaderProps|BuilderHeaderProps.*export/);
      expect(indexContent).toMatch(/export.*type.*BreadcrumbsProps|BreadcrumbsProps.*export/);
      expect(indexContent).toMatch(/export.*type.*UserMenuProps|UserMenuProps.*export/);
      expect(indexContent).toMatch(/export.*type.*MobileNavProps|MobileNavProps.*export/);
    });

    it('should export NavItem interface', () => {
      expect(indexContent).not.toBeNull();
      expect(indexContent).toMatch(/export.*type.*NavItem|NavItem.*export/);
    });

    it('should export BreadcrumbItem interface', () => {
      expect(indexContent).not.toBeNull();
      expect(indexContent).toMatch(/export.*type.*BreadcrumbItem|BreadcrumbItem.*export/);
    });
  });

  // ===========================================================================
  // AC9: ACCESSIBILITY TESTS
  // ===========================================================================

  describe('AC9: Accessibility', () => {
    describe('AC9.1: Semantic Navigation Elements', () => {
      it('should use semantic nav element in AppSidebar', () => {
        let content: string | null = null;
        try {
          content = fs.readFileSync(APP_SIDEBAR_PATH, 'utf-8');
        } catch {
          content = null;
        }
        expect(content).not.toBeNull();
        expect(content).toMatch(/<nav|role="navigation"/);
      });
    });

    describe('AC9.2: Navigation aria-label', () => {
      it('should have aria-label on AppSidebar navigation', () => {
        let content: string | null = null;
        try {
          content = fs.readFileSync(APP_SIDEBAR_PATH, 'utf-8');
        } catch {
          content = null;
        }
        expect(content).not.toBeNull();
        expect(content).toMatch(/aria-label/);
      });
    });

    describe('AC9.3: Current Page Indicator', () => {
      it('should have aria-current for active navigation item', () => {
        let content: string | null = null;
        try {
          content = fs.readFileSync(NAV_LINK_PATH, 'utf-8');
        } catch {
          content = null;
        }
        expect(content).not.toBeNull();
        expect(content).toMatch(/aria-current/);
      });
    });

    describe('AC9.5: Focus Visible Indicators', () => {
      it('should have focus-visible styling in NavLink', () => {
        let content: string | null = null;
        try {
          content = fs.readFileSync(NAV_LINK_PATH, 'utf-8');
        } catch {
          content = null;
        }
        expect(content).not.toBeNull();
        expect(content).toMatch(/focus-visible|focus:|focus-ring/);
      });
    });
  });

  // ===========================================================================
  // AC7: INTEGRATION WITH LAYOUT SHELLS
  // ===========================================================================

  describe('AC7: Integration with Layout Shells', () => {
    const APP_SHELL_PATH = path.resolve(__dirname, '../../components/layouts/AppShell.tsx');
    const BUILDER_LAYOUT_PATH = path.resolve(__dirname, '../../components/layouts/BuilderLayout.tsx');

    describe('AC7.1: AppShell uses navigation components', () => {
      it('should import AppHeader in AppShell', () => {
        let content: string | null = null;
        try {
          content = fs.readFileSync(APP_SHELL_PATH, 'utf-8');
        } catch {
          content = null;
        }
        expect(content).not.toBeNull();
        expect(content).toMatch(/import.*AppHeader|AppHeader.*from/);
      });

      it('should import AppSidebar in AppShell', () => {
        let content: string | null = null;
        try {
          content = fs.readFileSync(APP_SHELL_PATH, 'utf-8');
        } catch {
          content = null;
        }
        expect(content).not.toBeNull();
        expect(content).toMatch(/import.*AppSidebar|AppSidebar.*from/);
      });
    });

    describe('AC7.2: BuilderLayout uses BuilderHeader', () => {
      it('should import BuilderHeader in BuilderLayout', () => {
        let content: string | null = null;
        try {
          content = fs.readFileSync(BUILDER_LAYOUT_PATH, 'utf-8');
        } catch {
          content = null;
        }
        expect(content).not.toBeNull();
        expect(content).toMatch(/import.*BuilderHeader|BuilderHeader.*from/);
      });
    });

    describe('AC7.3: Navigation exports from index', () => {
      it('should have index.ts exporting all navigation components', () => {
        const fileExists = fs.existsSync(INDEX_PATH);
        expect(fileExists).toBe(true);
      });
    });
  });
});
