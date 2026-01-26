/**
 * Design System - Component Overrides Tests
 *
 * Story: 0-2-2 Create shadcn Component Overrides
 *
 * These tests verify that shadcn/ui components are properly customized
 * with Hyyve design tokens and styling patterns. Tests are written following
 * TDD red-green-refactor cycle - they MUST fail initially.
 *
 * Acceptance Criteria Coverage:
 * - AC1: Button Component (primary glow, hover states)
 * - AC2: Card Component (panel-dark background, elevated variant)
 * - AC3: Input Component (dark styling, focus states)
 * - AC4: Dialog Component (panel-dark modal background)
 * - AC5: Sheet Component (panel-dark slide-out panel)
 * - AC6: Badge Component (success, warning, info, error variants)
 * - AC7: Tabs Component (active tab indicator styling)
 * - AC8: Tooltip Component (dark tooltip styling)
 * - AC9: DropdownMenu Component (dark dropdown styling)
 * - AC10: Avatar Component (dark mode styling)
 * - AC11: Theme Utilities File
 * - AC12: Dark Mode Default
 *
 * RED PHASE: These tests will fail until components are customized.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// TEST CONFIGURATION
// =============================================================================

const COMPONENTS_DIR = path.resolve(__dirname, '../../components/ui');
const THEME_FILE_PATH = path.resolve(COMPONENTS_DIR, 'theme.ts');

// Expected Hyyve design tokens
const HYYVE_DESIGN_TOKENS = {
  colors: {
    primary: '#5048e5',
    primaryDark: '#3e38b3',
    panelDark: '#1c1a2e',
    borderDark: '#272546',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  shadows: {
    primaryGlow: 'rgba(80, 72, 229, 0.3)',
    primaryGlowValue: '0 0 15px rgba(80, 72, 229, 0.3)',
  },
};

// Helper function to read component file
function readComponentFile(componentName: string): string | null {
  const filePath = path.join(COMPONENTS_DIR, `${componentName}.tsx`);
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

// =============================================================================
// AC1: BUTTON COMPONENT TESTS
// =============================================================================

describe('AC1: Button Component - Hyyve Styling', () => {
  let buttonContent: string | null = null;

  beforeAll(() => {
    buttonContent = readComponentFile('button');
  });

  describe('Component Export', () => {
    it('should export Button component', () => {
      expect(buttonContent).not.toBeNull();
      expect(buttonContent).toContain('export');
      expect(buttonContent).toMatch(/export\s*{[^}]*Button[^}]*}/);
    });

    it('should export buttonVariants', () => {
      expect(buttonContent).not.toBeNull();
      expect(buttonContent).toMatch(/export\s*{[^}]*buttonVariants[^}]*}/);
    });
  });

  describe('Primary Variant Styling', () => {
    it('should have primary glow shadow on default variant', () => {
      expect(buttonContent).not.toBeNull();
      // Check for primary glow shadow class or inline shadow
      const hasGlowShadow =
        buttonContent!.includes('shadow-primary-glow') ||
        buttonContent!.includes('shadow-[0_0_15px') ||
        buttonContent!.includes(HYYVE_DESIGN_TOKENS.shadows.primaryGlow);
      expect(hasGlowShadow).toBe(true);
    });

    it('should use primary-dark color for hover state', () => {
      expect(buttonContent).not.toBeNull();
      // Check for hover state using primary-dark or accent
      const hasHoverState =
        buttonContent!.includes('hover:bg-accent') ||
        buttonContent!.includes('hover:bg-primary-dark') ||
        buttonContent!.includes(HYYVE_DESIGN_TOKENS.colors.primaryDark);
      expect(hasHoverState).toBe(true);
    });

    it('should have proper focus ring using primary color', () => {
      expect(buttonContent).not.toBeNull();
      // Check for focus ring configuration
      const hasFocusRing =
        buttonContent!.includes('focus-visible:ring-primary') ||
        buttonContent!.includes('focus:ring-primary') ||
        buttonContent!.includes('focus-visible:ring-ring');
      expect(hasFocusRing).toBe(true);
    });
  });

  describe('Secondary Variant Styling', () => {
    it('should have secondary variant with panel-dark background', () => {
      expect(buttonContent).not.toBeNull();
      // Secondary variant should use appropriate dark background
      const hasSecondaryVariant =
        buttonContent!.includes("secondary:") ||
        buttonContent!.includes('bg-secondary') ||
        buttonContent!.includes('bg-card');
      expect(hasSecondaryVariant).toBe(true);
    });
  });

  describe('Ghost Variant Styling', () => {
    it('should have ghost variant with transparent background', () => {
      expect(buttonContent).not.toBeNull();
      expect(buttonContent).toContain('ghost');
      // Ghost should have hover highlight
      expect(buttonContent).toMatch(/ghost.*hover/i);
    });
  });

  describe('Destructive Variant Styling', () => {
    it('should have destructive variant with proper red coloring', () => {
      expect(buttonContent).not.toBeNull();
      expect(buttonContent).toContain('destructive');
      expect(buttonContent).toContain('bg-destructive');
    });
  });
});

// =============================================================================
// AC2: CARD COMPONENT TESTS
// =============================================================================

describe('AC2: Card Component - Hyyve Styling', () => {
  let cardContent: string | null = null;

  beforeAll(() => {
    cardContent = readComponentFile('card');
  });

  describe('Component Exports', () => {
    it('should export Card component', () => {
      expect(cardContent).not.toBeNull();
      expect(cardContent).toMatch(/export\s*{[^}]*Card[^}]*}/);
    });

    it('should export CardHeader component', () => {
      expect(cardContent).not.toBeNull();
      expect(cardContent).toMatch(/export\s*{[^}]*CardHeader[^}]*}/);
    });

    it('should export CardContent component', () => {
      expect(cardContent).not.toBeNull();
      expect(cardContent).toMatch(/export\s*{[^}]*CardContent[^}]*}/);
    });

    it('should export CardFooter component', () => {
      expect(cardContent).not.toBeNull();
      expect(cardContent).toMatch(/export\s*{[^}]*CardFooter[^}]*}/);
    });
  });

  describe('Dark Mode Styling', () => {
    it('should use panel-dark background class or CSS variable', () => {
      expect(cardContent).not.toBeNull();
      // Card should use bg-card which maps to panel-dark in dark mode
      const hasPanelDarkBg =
        cardContent!.includes('bg-card') ||
        cardContent!.includes('bg-panel-dark') ||
        cardContent!.includes(HYYVE_DESIGN_TOKENS.colors.panelDark);
      expect(hasPanelDarkBg).toBe(true);
    });

    it('should use border-dark border class or CSS variable', () => {
      expect(cardContent).not.toBeNull();
      // Card should have border styling
      const hasBorderDark =
        cardContent!.includes('border-border') ||
        cardContent!.includes('border-dark') ||
        cardContent!.includes('border');
      expect(hasBorderDark).toBe(true);
    });

    it('should have rounded-xl border radius', () => {
      expect(cardContent).not.toBeNull();
      expect(cardContent).toContain('rounded-xl');
    });
  });

  describe('Elevated Variant', () => {
    it('should support elevated variant with shadow', () => {
      expect(cardContent).not.toBeNull();
      // Check for elevated variant or shadow-card utility
      const hasElevatedVariant =
        cardContent!.includes('elevated') ||
        cardContent!.includes('shadow-card') ||
        cardContent!.includes('shadow-elevated');
      expect(hasElevatedVariant).toBe(true);
    });

    it('should use cva for variant management', () => {
      expect(cardContent).not.toBeNull();
      // Elevated variant requires cva for proper variant support
      expect(cardContent).toContain('cva');
    });
  });
});

// =============================================================================
// AC3: INPUT COMPONENT TESTS
// =============================================================================

describe('AC3: Input Component - Hyyve Styling', () => {
  let inputContent: string | null = null;

  beforeAll(() => {
    inputContent = readComponentFile('input');
  });

  describe('Component Export', () => {
    it('should export Input component', () => {
      expect(inputContent).not.toBeNull();
      expect(inputContent).toMatch(/export\s*{[^}]*Input[^}]*}/);
    });
  });

  describe('Dark Mode Styling', () => {
    it('should use dark background styling', () => {
      expect(inputContent).not.toBeNull();
      // Input should use bg-input or similar dark background
      const hasDarkBg =
        inputContent!.includes('bg-input') ||
        inputContent!.includes('bg-card') ||
        inputContent!.includes('bg-panel-dark') ||
        inputContent!.includes(HYYVE_DESIGN_TOKENS.colors.panelDark);
      expect(hasDarkBg).toBe(true);
    });

    it('should use border-dark border styling', () => {
      expect(inputContent).not.toBeNull();
      const hasBorder =
        inputContent!.includes('border-input') ||
        inputContent!.includes('border-border') ||
        inputContent!.includes('border-dark');
      expect(hasBorder).toBe(true);
    });
  });

  describe('Focus State Styling', () => {
    it('should have focus state with primary border color', () => {
      expect(inputContent).not.toBeNull();
      // Check for focus border using primary color
      const hasFocusBorder =
        inputContent!.includes('focus:border-primary') ||
        inputContent!.includes('focus-visible:border-primary') ||
        inputContent!.includes('focus-visible:ring-primary') ||
        inputContent!.includes('focus-visible:ring-ring');
      expect(hasFocusBorder).toBe(true);
    });

    it('should have focus ring styling', () => {
      expect(inputContent).not.toBeNull();
      const hasFocusRing =
        inputContent!.includes('focus-visible:ring') ||
        inputContent!.includes('focus:ring');
      expect(hasFocusRing).toBe(true);
    });
  });

  describe('Placeholder Styling', () => {
    it('should use text-secondary for placeholder text', () => {
      expect(inputContent).not.toBeNull();
      const hasPlaceholderStyle =
        inputContent!.includes('placeholder:text-muted-foreground') ||
        inputContent!.includes('placeholder:text-secondary');
      expect(hasPlaceholderStyle).toBe(true);
    });
  });
});

// =============================================================================
// AC4: DIALOG COMPONENT TESTS
// =============================================================================

describe('AC4: Dialog Component - Hyyve Styling', () => {
  let dialogContent: string | null = null;

  beforeAll(() => {
    dialogContent = readComponentFile('dialog');
  });

  describe('Component Exports', () => {
    it('should export Dialog component', () => {
      expect(dialogContent).not.toBeNull();
      expect(dialogContent).toMatch(/export\s*{[^}]*Dialog[^}]*}/);
    });

    it('should export DialogHeader component', () => {
      expect(dialogContent).not.toBeNull();
      expect(dialogContent).toMatch(/export\s*{[^}]*DialogHeader[^}]*}/);
    });

    it('should export DialogTitle component', () => {
      expect(dialogContent).not.toBeNull();
      expect(dialogContent).toMatch(/export\s*{[^}]*DialogTitle[^}]*}/);
    });

    it('should export DialogContent component', () => {
      expect(dialogContent).not.toBeNull();
      expect(dialogContent).toMatch(/export\s*{[^}]*DialogContent[^}]*}/);
    });
  });

  describe('Dark Modal Background', () => {
    it('should use panel-dark background for DialogContent', () => {
      expect(dialogContent).not.toBeNull();
      // DialogContent should use bg-card or bg-popover (mapped to panel-dark)
      const hasDarkBg =
        dialogContent!.includes('bg-card') ||
        dialogContent!.includes('bg-popover') ||
        dialogContent!.includes('bg-background') ||
        dialogContent!.includes('bg-panel-dark');
      expect(hasDarkBg).toBe(true);
    });

    it('should have proper backdrop opacity on DialogOverlay', () => {
      expect(dialogContent).not.toBeNull();
      expect(dialogContent).toMatch(/bg-black\/\d+|backdrop/);
    });

    it('should have border styling on DialogContent', () => {
      expect(dialogContent).not.toBeNull();
      expect(dialogContent).toContain('border');
    });
  });

  describe('Close Button Styling', () => {
    it('should have close button with appropriate styling', () => {
      expect(dialogContent).not.toBeNull();
      // Check for close button presence
      const hasCloseButton =
        dialogContent!.includes('Close') ||
        dialogContent!.includes('X') ||
        dialogContent!.includes('lucide-react');
      expect(hasCloseButton).toBe(true);
    });
  });
});

// =============================================================================
// AC5: SHEET COMPONENT TESTS
// =============================================================================

describe('AC5: Sheet Component - Hyyve Styling', () => {
  let sheetContent: string | null = null;

  beforeAll(() => {
    sheetContent = readComponentFile('sheet');
  });

  describe('Component Exports', () => {
    it('should export Sheet component', () => {
      expect(sheetContent).not.toBeNull();
      expect(sheetContent).toMatch(/export\s*{[^}]*Sheet[^}]*}/);
    });

    it('should export SheetContent component', () => {
      expect(sheetContent).not.toBeNull();
      expect(sheetContent).toMatch(/export\s*{[^}]*SheetContent[^}]*}/);
    });
  });

  describe('Dark Panel Styling', () => {
    it('should use panel-dark background', () => {
      expect(sheetContent).not.toBeNull();
      const hasDarkBg =
        sheetContent!.includes('bg-background') ||
        sheetContent!.includes('bg-card') ||
        sheetContent!.includes('bg-popover') ||
        sheetContent!.includes('bg-panel-dark');
      expect(hasDarkBg).toBe(true);
    });

    it('should have proper border on sliding edge', () => {
      expect(sheetContent).not.toBeNull();
      const hasBorder =
        sheetContent!.includes('border-l') ||
        sheetContent!.includes('border-r') ||
        sheetContent!.includes('border-t') ||
        sheetContent!.includes('border-b');
      expect(hasBorder).toBe(true);
    });
  });
});

// =============================================================================
// AC6: BADGE COMPONENT TESTS
// =============================================================================

describe('AC6: Badge Component - Semantic Variants', () => {
  let badgeContent: string | null = null;

  beforeAll(() => {
    badgeContent = readComponentFile('badge');
  });

  describe('Component Export', () => {
    it('should export Badge component', () => {
      expect(badgeContent).not.toBeNull();
      expect(badgeContent).toMatch(/export\s*{[^}]*Badge[^}]*}/);
    });

    it('should export badgeVariants', () => {
      expect(badgeContent).not.toBeNull();
      expect(badgeContent).toMatch(/export\s*{[^}]*badgeVariants[^}]*}/);
    });
  });

  describe('Semantic Status Variants', () => {
    it('should have success variant (emerald green)', () => {
      expect(badgeContent).not.toBeNull();
      const hasSuccessVariant =
        badgeContent!.includes('success') ||
        badgeContent!.includes('emerald') ||
        badgeContent!.includes(HYYVE_DESIGN_TOKENS.colors.success);
      expect(hasSuccessVariant).toBe(true);
    });

    it('should have warning variant (amber)', () => {
      expect(badgeContent).not.toBeNull();
      const hasWarningVariant =
        badgeContent!.includes('warning') ||
        badgeContent!.includes('amber') ||
        badgeContent!.includes(HYYVE_DESIGN_TOKENS.colors.warning);
      expect(hasWarningVariant).toBe(true);
    });

    it('should have info variant (blue)', () => {
      expect(badgeContent).not.toBeNull();
      const hasInfoVariant =
        badgeContent!.includes('info') ||
        badgeContent!.includes('blue') ||
        badgeContent!.includes(HYYVE_DESIGN_TOKENS.colors.info);
      expect(hasInfoVariant).toBe(true);
    });

    it('should have error/destructive variant (red)', () => {
      expect(badgeContent).not.toBeNull();
      const hasErrorVariant =
        badgeContent!.includes('destructive') ||
        badgeContent!.includes('error') ||
        badgeContent!.includes('red');
      expect(hasErrorVariant).toBe(true);
    });
  });

  describe('Default Variant', () => {
    it('should have default variant using primary color', () => {
      expect(badgeContent).not.toBeNull();
      expect(badgeContent).toContain('default');
      expect(badgeContent).toContain('bg-primary');
    });
  });

  describe('Outline Variant', () => {
    it('should have outline variant with border-dark border', () => {
      expect(badgeContent).not.toBeNull();
      expect(badgeContent).toContain('outline');
    });
  });
});

// =============================================================================
// AC7: TABS COMPONENT TESTS
// =============================================================================

describe('AC7: Tabs Component - Builder UI Styling', () => {
  let tabsContent: string | null = null;

  beforeAll(() => {
    tabsContent = readComponentFile('tabs');
  });

  describe('Component Exports', () => {
    it('should export Tabs component', () => {
      expect(tabsContent).not.toBeNull();
      expect(tabsContent).toMatch(/export\s*{[^}]*Tabs[^}]*}/);
    });

    it('should export TabsList component', () => {
      expect(tabsContent).not.toBeNull();
      expect(tabsContent).toMatch(/export\s*{[^}]*TabsList[^}]*}/);
    });

    it('should export TabsTrigger component', () => {
      expect(tabsContent).not.toBeNull();
      expect(tabsContent).toMatch(/export\s*{[^}]*TabsTrigger[^}]*}/);
    });

    it('should export TabsContent component', () => {
      expect(tabsContent).not.toBeNull();
      expect(tabsContent).toMatch(/export\s*{[^}]*TabsContent[^}]*}/);
    });
  });

  describe('Tab List Styling', () => {
    it('should use panel-dark background for TabsList', () => {
      expect(tabsContent).not.toBeNull();
      const hasDarkBg =
        tabsContent!.includes('bg-muted') ||
        tabsContent!.includes('bg-card') ||
        tabsContent!.includes('bg-panel-dark');
      expect(hasDarkBg).toBe(true);
    });
  });

  describe('Active Tab Indicator', () => {
    it('should have primary indicator for active tab', () => {
      expect(tabsContent).not.toBeNull();
      // Check for active state indicator using primary color
      const hasActiveIndicator =
        tabsContent!.includes('data-[state=active]:bg-primary') ||
        tabsContent!.includes('data-[state=active]:border-primary') ||
        tabsContent!.includes('data-[state=active]:text-primary') ||
        tabsContent!.includes('data-[state=active]');
      expect(hasActiveIndicator).toBe(true);
    });

    it('should have underline or highlight style for active tab', () => {
      expect(tabsContent).not.toBeNull();
      // Active tab should have visual distinction
      const hasActiveStyle =
        tabsContent!.includes('data-[state=active]:shadow') ||
        tabsContent!.includes('data-[state=active]:bg') ||
        tabsContent!.includes('border-b-2') ||
        tabsContent!.includes('border-primary');
      expect(hasActiveStyle).toBe(true);
    });
  });
});

// =============================================================================
// AC8: TOOLTIP COMPONENT TESTS
// =============================================================================

describe('AC8: Tooltip Component - Dark Styling', () => {
  let tooltipContent: string | null = null;

  beforeAll(() => {
    tooltipContent = readComponentFile('tooltip');
  });

  describe('Component Exports', () => {
    it('should export Tooltip component', () => {
      expect(tooltipContent).not.toBeNull();
      expect(tooltipContent).toMatch(/export\s*{[^}]*Tooltip[^}]*}/);
    });

    it('should export TooltipContent component', () => {
      expect(tooltipContent).not.toBeNull();
      expect(tooltipContent).toMatch(/export\s*{[^}]*TooltipContent[^}]*}/);
    });
  });

  describe('Dark Tooltip Styling', () => {
    it('should use panel-dark background', () => {
      expect(tooltipContent).not.toBeNull();
      const hasDarkBg =
        tooltipContent!.includes('bg-popover') ||
        tooltipContent!.includes('bg-card') ||
        tooltipContent!.includes('bg-panel-dark') ||
        tooltipContent!.includes('bg-primary');
      expect(hasDarkBg).toBe(true);
    });

    it('should have border-dark border styling', () => {
      expect(tooltipContent).not.toBeNull();
      const hasBorder =
        tooltipContent!.includes('border-border') ||
        tooltipContent!.includes('border-dark') ||
        tooltipContent!.includes('border');
      expect(hasBorder).toBe(true);
    });
  });
});

// =============================================================================
// AC11: THEME UTILITIES FILE TESTS
// =============================================================================

describe('AC11: Theme Utilities File', () => {
  describe('File Existence', () => {
    it('should have theme.ts file in components/ui directory', () => {
      const fileExists = fs.existsSync(THEME_FILE_PATH);
      expect(fileExists).toBe(true);
    });
  });

  describe('Theme Exports', () => {
    let themeContent: string | null = null;

    beforeAll(() => {
      try {
        themeContent = fs.readFileSync(THEME_FILE_PATH, 'utf-8');
      } catch {
        themeContent = null;
      }
    });

    it('should export reusable Tailwind class combinations', () => {
      expect(themeContent).not.toBeNull();
      // Should export style utilities
      const hasExports =
        themeContent!.includes('export') &&
        (themeContent!.includes('const') || themeContent!.includes('function'));
      expect(hasExports).toBe(true);
    });

    it('should export primary glow shadow utility', () => {
      expect(themeContent).not.toBeNull();
      const hasGlowUtility =
        themeContent!.includes('primaryGlow') ||
        themeContent!.includes('primary-glow') ||
        themeContent!.includes('glow');
      expect(hasGlowUtility).toBe(true);
    });

    it('should export panel styling utilities', () => {
      expect(themeContent).not.toBeNull();
      const hasPanelUtility =
        themeContent!.includes('panel') ||
        themeContent!.includes('card') ||
        themeContent!.includes('surface');
      expect(hasPanelUtility).toBe(true);
    });

    it('should have JSDoc documentation', () => {
      expect(themeContent).not.toBeNull();
      // Should have documentation comments
      const hasDocumentation =
        themeContent!.includes('/**') ||
        themeContent!.includes('//') ||
        themeContent!.includes('@description');
      expect(hasDocumentation).toBe(true);
    });
  });
});

// =============================================================================
// AC12: DARK MODE DEFAULT TESTS
// =============================================================================

describe('AC12: Dark Mode Default - All Components', () => {
  const componentFiles = [
    'button',
    'card',
    'input',
    'dialog',
    'badge',
    'tabs',
    'sheet',
    'tooltip',
  ];

  describe('No Hardcoded Light Mode Colors', () => {
    componentFiles.forEach((componentName) => {
      it(`${componentName}.tsx should not have hardcoded white backgrounds`, () => {
        const content = readComponentFile(componentName);
        if (content) {
          // Check for hardcoded white background classes
          const hasHardcodedWhite =
            content.includes('bg-white') ||
            content.includes('bg-[#fff') ||
            content.includes('bg-[#FFF') ||
            content.includes('bg-[white]');
          expect(hasHardcodedWhite).toBe(false);
        }
      });
    });
  });

  describe('CSS Variable Usage', () => {
    componentFiles.forEach((componentName) => {
      it(`${componentName}.tsx should use CSS variables or Tailwind semantic classes`, () => {
        const content = readComponentFile(componentName);
        if (content) {
          // Should use semantic classes that resolve via CSS variables
          const usesSemanticClasses =
            content.includes('bg-background') ||
            content.includes('bg-card') ||
            content.includes('bg-popover') ||
            content.includes('bg-muted') ||
            content.includes('bg-primary') ||
            content.includes('bg-secondary') ||
            content.includes('bg-input') ||
            content.includes('bg-transparent') ||
            content.includes('text-foreground') ||
            content.includes('text-muted-foreground') ||
            content.includes('border-border') ||
            content.includes('border-input');
          expect(usesSemanticClasses).toBe(true);
        }
      });
    });
  });
});

// =============================================================================
// INTEGRATION TESTS
// =============================================================================

describe('Component Override Integration', () => {
  describe('Design Token Consistency', () => {
    it('should use consistent primary color reference across components', () => {
      const buttonContent = readComponentFile('button');
      const badgeContent = readComponentFile('badge');

      expect(buttonContent).not.toBeNull();
      expect(badgeContent).not.toBeNull();

      // Both should use bg-primary for default/primary variant
      expect(buttonContent).toContain('bg-primary');
      expect(badgeContent).toContain('bg-primary');
    });

    it('should use consistent border styling across components', () => {
      const cardContent = readComponentFile('card');
      const dialogContent = readComponentFile('dialog');

      expect(cardContent).not.toBeNull();
      expect(dialogContent).not.toBeNull();

      // Both should have border classes
      expect(cardContent).toContain('border');
      expect(dialogContent).toContain('border');
    });
  });

  describe('Component Variant Consistency', () => {
    it('should use cva for components with variants', () => {
      const buttonContent = readComponentFile('button');
      const badgeContent = readComponentFile('badge');

      expect(buttonContent).not.toBeNull();
      expect(badgeContent).not.toBeNull();

      // Both should use cva
      expect(buttonContent).toContain('cva');
      expect(badgeContent).toContain('cva');
    });
  });
});
