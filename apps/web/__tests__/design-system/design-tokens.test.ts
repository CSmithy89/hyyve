/**
 * Design System - Design Tokens Tests
 *
 * Story: 0-2-1 Extract Design System from Wireframes
 *
 * These tests verify that Hyyve design tokens are properly configured
 * and exported for programmatic access. Tests are written following
 * TDD red-green-refactor cycle - they MUST fail initially.
 *
 * Acceptance Criteria Coverage:
 * - AC1: Color tokens (primary, background-dark, panel-dark, etc.)
 * - AC2: Typography (Inter font family)
 * - AC3: Border radius values
 * - AC4: Shadow definitions
 * - AC5: Dark mode as default
 * - AC6: CSS custom properties
 * - AC9: Spacing system (4px grid)
 *
 * RED PHASE: These tests will fail until design-tokens.ts is implemented.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// Path to the design tokens file
const DESIGN_TOKENS_PATH = path.resolve(__dirname, '../../lib/design-tokens.ts');
const TAILWIND_CONFIG_PATH = path.resolve(__dirname, '../../tailwind.config.ts');

// Expected values from story acceptance criteria
const EXPECTED_COLORS = {
  primary: '#5048e5',
  primaryDark: '#3e38b3',
  backgroundLight: '#f6f6f8',
  backgroundDark: '#131221',
  panelDark: '#1c1a2e',
  canvasDark: '#0f1115',
  borderDark: '#272546',
  textSecondary: '#9795c6',
  cardDark: '#1c1b2e',
  cardBorder: '#272546',
  inputDark: '#0f172a',
};

const EXPECTED_BORDER_RADIUS = {
  DEFAULT: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  full: '9999px',
};

// Reference values - used for documentation and future test assertions
const _EXPECTED_SHADOWS = {
  primaryGlow: '0 0 15px rgba(80, 72, 229, 0.3)',
  card: '0 4px 20px rgba(0, 0, 0, 0.5)',
};

const _EXPECTED_SPACING = {
  base: 4,
  headerHeight: '4rem',
  sidebarWidth: '18rem',
  chatPanelWidth: '20rem',
};

// Suppress unused variable warnings
void _EXPECTED_SHADOWS;
void _EXPECTED_SPACING;

describe('Design System - Design Tokens File', () => {
  describe('File Existence', () => {
    it('should have design-tokens.ts file in lib directory', () => {
      const fileExists = fs.existsSync(DESIGN_TOKENS_PATH);
      expect(fileExists).toBe(true);
    });

    it('should have tailwind.config.ts file in web app root', () => {
      const fileExists = fs.existsSync(TAILWIND_CONFIG_PATH);
      expect(fileExists).toBe(true);
    });
  });
});

describe('Design System - Design Tokens Content', () => {
  let designTokensContent: string | null = null;

  beforeAll(() => {
    try {
      designTokensContent = fs.readFileSync(DESIGN_TOKENS_PATH, 'utf-8');
    } catch {
      designTokensContent = null;
    }
  });

  describe('AC1: Color Tokens', () => {
    describe('Primary Colors', () => {
      it('should define Hyyve primary color (#5048e5)', () => {
        expect(designTokensContent).not.toBeNull();
        expect(designTokensContent).toContain(EXPECTED_COLORS.primary);
      });

      it('should define Hyyve primary dark color (#3e38b3) for hover states', () => {
        expect(designTokensContent).not.toBeNull();
        expect(designTokensContent).toContain(EXPECTED_COLORS.primaryDark);
      });
    });

    describe('Background Colors', () => {
      it('should define background-light color (#f6f6f8)', () => {
        expect(designTokensContent).not.toBeNull();
        expect(designTokensContent).toContain(EXPECTED_COLORS.backgroundLight);
      });

      it('should define background-dark color (#131221)', () => {
        expect(designTokensContent).not.toBeNull();
        expect(designTokensContent).toContain(EXPECTED_COLORS.backgroundDark);
      });

      it('should define canvas-dark color (#0f1115) for builder canvas', () => {
        expect(designTokensContent).not.toBeNull();
        expect(designTokensContent).toContain(EXPECTED_COLORS.canvasDark);
      });
    });

    describe('Panel & Card Colors', () => {
      it('should define panel-dark color (#1c1a2e) for sidebars and cards', () => {
        expect(designTokensContent).not.toBeNull();
        expect(designTokensContent).toContain(EXPECTED_COLORS.panelDark);
      });

      it('should define card-dark color (#1c1b2e) for dashboard cards', () => {
        expect(designTokensContent).not.toBeNull();
        expect(designTokensContent).toContain(EXPECTED_COLORS.cardDark);
      });

      it('should define card-border color (#272546)', () => {
        expect(designTokensContent).not.toBeNull();
        expect(designTokensContent).toContain(EXPECTED_COLORS.cardBorder);
      });
    });

    describe('Border & Input Colors', () => {
      it('should define border-dark color (#272546)', () => {
        expect(designTokensContent).not.toBeNull();
        expect(designTokensContent).toContain(EXPECTED_COLORS.borderDark);
      });

      it('should define input-dark color (#0f172a) for form inputs', () => {
        expect(designTokensContent).not.toBeNull();
        expect(designTokensContent).toContain(EXPECTED_COLORS.inputDark);
      });
    });

    describe('Text Colors', () => {
      it('should define text-secondary color (#9795c6)', () => {
        expect(designTokensContent).not.toBeNull();
        expect(designTokensContent).toContain(EXPECTED_COLORS.textSecondary);
      });
    });

    describe('Color Exports', () => {
      it('should export HYYVE_COLORS constant', () => {
        expect(designTokensContent).not.toBeNull();
        expect(designTokensContent).toContain('HYYVE_COLORS');
        expect(designTokensContent).toMatch(/export\s+(const|{[^}]*HYYVE_COLORS)/);
      });

      it('should export colors object with nested structure', () => {
        expect(designTokensContent).not.toBeNull();
        expect(designTokensContent).toMatch(/export\s+(const|{[^}]*colors)/);
      });
    });
  });

  describe('AC2: Typography', () => {
    describe('Font Families', () => {
      it('should configure Inter as primary font family', () => {
        expect(designTokensContent).not.toBeNull();
        expect(designTokensContent).toContain('Inter');
      });

      it('should include Noto Sans as fallback font', () => {
        expect(designTokensContent).not.toBeNull();
        expect(designTokensContent).toContain('Noto Sans');
      });

      it('should configure system monospace fonts', () => {
        expect(designTokensContent).not.toBeNull();
        // Check for common monospace font names
        expect(designTokensContent).toMatch(/mono|monospace|Menlo|Monaco|Consolas/i);
      });
    });

    describe('Font Weights', () => {
      it('should define font weights 300, 400, 500, 600, 700, 900', () => {
        expect(designTokensContent).not.toBeNull();
        expect(designTokensContent).toMatch(/300|light/i);
        expect(designTokensContent).toMatch(/400|normal/i);
        expect(designTokensContent).toMatch(/500|medium/i);
        expect(designTokensContent).toMatch(/600|semibold/i);
        expect(designTokensContent).toMatch(/700|bold/i);
        expect(designTokensContent).toMatch(/900|black/i);
      });
    });

    describe('Typography Exports', () => {
      it('should export HYYVE_TYPOGRAPHY constant', () => {
        expect(designTokensContent).not.toBeNull();
        expect(designTokensContent).toContain('HYYVE_TYPOGRAPHY');
      });

      it('should export typography object', () => {
        expect(designTokensContent).not.toBeNull();
        expect(designTokensContent).toMatch(/export\s+(const|{[^}]*typography)/);
      });
    });
  });

  describe('AC3: Border Radius', () => {
    it('should define DEFAULT radius as 0.25rem (4px)', () => {
      expect(designTokensContent).not.toBeNull();
      expect(designTokensContent).toContain(EXPECTED_BORDER_RADIUS.DEFAULT);
    });

    it('should define md radius as 0.375rem (6px)', () => {
      expect(designTokensContent).not.toBeNull();
      expect(designTokensContent).toContain(EXPECTED_BORDER_RADIUS.md);
    });

    it('should define lg radius as 0.5rem (8px)', () => {
      expect(designTokensContent).not.toBeNull();
      expect(designTokensContent).toContain(EXPECTED_BORDER_RADIUS.lg);
    });

    it('should define xl radius as 0.75rem (12px)', () => {
      expect(designTokensContent).not.toBeNull();
      expect(designTokensContent).toContain(EXPECTED_BORDER_RADIUS.xl);
    });

    it('should define 2xl radius as 1rem (16px)', () => {
      expect(designTokensContent).not.toBeNull();
      expect(designTokensContent).toContain(EXPECTED_BORDER_RADIUS['2xl']);
    });

    it('should define full radius as 9999px', () => {
      expect(designTokensContent).not.toBeNull();
      expect(designTokensContent).toContain(EXPECTED_BORDER_RADIUS.full);
    });

    it('should export HYYVE_BORDER_RADIUS constant', () => {
      expect(designTokensContent).not.toBeNull();
      expect(designTokensContent).toContain('HYYVE_BORDER_RADIUS');
    });
  });

  describe('AC4: Shadow Definitions', () => {
    it('should define primary-glow shadow for primary buttons', () => {
      expect(designTokensContent).not.toBeNull();
      // Check for the shadow value or key name
      expect(designTokensContent).toMatch(/primaryGlow|primary-glow/);
      expect(designTokensContent).toContain('rgba(80, 72, 229');
    });

    it('should define card-shadow for workflow nodes', () => {
      expect(designTokensContent).not.toBeNull();
      expect(designTokensContent).toMatch(/card.*shadow|shadow.*card/i);
      expect(designTokensContent).toContain('rgba(0, 0, 0');
    });

    it('should define elevated shadow with primary tint', () => {
      expect(designTokensContent).not.toBeNull();
      expect(designTokensContent).toMatch(/elevated/i);
    });

    it('should export HYYVE_SHADOWS constant', () => {
      expect(designTokensContent).not.toBeNull();
      expect(designTokensContent).toContain('HYYVE_SHADOWS');
    });
  });

  describe('AC5: Dark Mode Configuration', () => {
    it('should indicate dark mode as the default configuration', () => {
      expect(designTokensContent).not.toBeNull();
      expect(designTokensContent).toMatch(/defaultMode.*dark|dark.*default/i);
    });

    it('should have dark mode specific color variations', () => {
      expect(designTokensContent).not.toBeNull();
      // Check for dark-specific color naming
      expect(designTokensContent).toMatch(/dark/i);
      expect(designTokensContent).toContain(EXPECTED_COLORS.backgroundDark);
      expect(designTokensContent).toContain(EXPECTED_COLORS.panelDark);
    });
  });

  describe('AC9: Spacing System (4px Grid)', () => {
    describe('Base Spacing', () => {
      it('should define 4px base grid system', () => {
        expect(designTokensContent).not.toBeNull();
        expect(designTokensContent).toMatch(/base.*4|4.*base/);
      });

      it('should define spacing scale values', () => {
        expect(designTokensContent).not.toBeNull();
        expect(designTokensContent).toContain('0.25rem'); // 4px
        expect(designTokensContent).toContain('0.5rem'); // 8px
        expect(designTokensContent).toContain('1rem'); // 16px
        expect(designTokensContent).toContain('2rem'); // 32px
      });
    });

    describe('Layout Dimensions', () => {
      it('should define header height as 64px (4rem)', () => {
        expect(designTokensContent).not.toBeNull();
        expect(designTokensContent).toMatch(/headerHeight.*4rem|header.*64px/i);
      });

      it('should define sidebar width as 288px (18rem)', () => {
        expect(designTokensContent).not.toBeNull();
        expect(designTokensContent).toMatch(/sidebarWidth.*18rem|sidebar.*288px/i);
      });

      it('should define chat panel width as 320px (20rem)', () => {
        expect(designTokensContent).not.toBeNull();
        expect(designTokensContent).toMatch(/chatPanelWidth.*20rem|chat.*320px/i);
      });
    });

    it('should export HYYVE_SPACING constant', () => {
      expect(designTokensContent).not.toBeNull();
      expect(designTokensContent).toContain('HYYVE_SPACING');
    });
  });

  describe('Export Structure', () => {
    it('should be a TypeScript file with proper exports', () => {
      expect(designTokensContent).not.toBeNull();
      // Check for export statements
      expect(designTokensContent).toMatch(/export\s+/);
    });

    it('should export design tokens as both nested objects and flat constants', () => {
      expect(designTokensContent).not.toBeNull();
      // Nested structure exports
      expect(designTokensContent).toMatch(/export\s+(const|{[^}]*colors)/);
      expect(designTokensContent).toMatch(/export\s+(const|{[^}]*typography)/);
      expect(designTokensContent).toMatch(/export\s+(const|{[^}]*borderRadius)/);
      expect(designTokensContent).toMatch(/export\s+(const|{[^}]*shadows)/);
      expect(designTokensContent).toMatch(/export\s+(const|{[^}]*spacing)/);

      // Flat constant exports
      expect(designTokensContent).toContain('HYYVE_COLORS');
      expect(designTokensContent).toContain('HYYVE_TYPOGRAPHY');
      expect(designTokensContent).toContain('HYYVE_BORDER_RADIUS');
      expect(designTokensContent).toContain('HYYVE_SHADOWS');
      expect(designTokensContent).toContain('HYYVE_SPACING');
    });
  });
});

// Path to globals.css for AC6, AC7, AC8 tests
const GLOBALS_CSS_PATH = path.resolve(__dirname, '../../app/globals.css');

describe('Design System - CSS Custom Properties (AC6)', () => {
  let globalsCssContent: string | null = null;

  beforeAll(() => {
    try {
      globalsCssContent = fs.readFileSync(GLOBALS_CSS_PATH, 'utf-8');
    } catch {
      globalsCssContent = null;
    }
  });

  describe('CSS Custom Properties Existence', () => {
    it('should have globals.css file', () => {
      expect(globalsCssContent).not.toBeNull();
    });

    it('should define --background CSS variable', () => {
      expect(globalsCssContent).not.toBeNull();
      expect(globalsCssContent).toContain('--background:');
    });

    it('should define --primary CSS variable', () => {
      expect(globalsCssContent).not.toBeNull();
      expect(globalsCssContent).toContain('--primary:');
    });

    it('should define --card CSS variable', () => {
      expect(globalsCssContent).not.toBeNull();
      expect(globalsCssContent).toContain('--card:');
    });

    it('should define --border CSS variable', () => {
      expect(globalsCssContent).not.toBeNull();
      expect(globalsCssContent).toContain('--border:');
    });

    it('should define --muted-foreground CSS variable', () => {
      expect(globalsCssContent).not.toBeNull();
      expect(globalsCssContent).toContain('--muted-foreground:');
    });
  });

  describe('Hyyve Brand Color Mappings', () => {
    it('should have Hyyve-specific CSS variables defined in .dark block', () => {
      expect(globalsCssContent).not.toBeNull();
      expect(globalsCssContent).toContain('--hyyve-primary:');
      expect(globalsCssContent).toContain('--hyyve-background-dark:');
      expect(globalsCssContent).toContain('--hyyve-panel-dark:');
      expect(globalsCssContent).toContain('--hyyve-border-dark:');
    });

    it('should map --hyyve-primary to Hyyve purple (#5048e5)', () => {
      expect(globalsCssContent).not.toBeNull();
      expect(globalsCssContent).toContain('#5048e5');
    });

    it('should map --hyyve-background-dark to Hyyve dark background (#131221)', () => {
      expect(globalsCssContent).not.toBeNull();
      expect(globalsCssContent).toContain('#131221');
    });

    it('should use oklch color space for primary colors in .dark block', () => {
      expect(globalsCssContent).not.toBeNull();
      expect(globalsCssContent).toMatch(/\.dark\s*\{[\s\S]*oklch/);
    });
  });
});

describe('Design System - Custom Scrollbar Styles (AC7)', () => {
  let globalsCssContent: string | null = null;

  beforeAll(() => {
    try {
      globalsCssContent = fs.readFileSync(GLOBALS_CSS_PATH, 'utf-8');
    } catch {
      globalsCssContent = null;
    }
  });

  it('should define webkit scrollbar base styles', () => {
    expect(globalsCssContent).not.toBeNull();
    expect(globalsCssContent).toContain('::-webkit-scrollbar');
  });

  it('should define scrollbar width of 8px', () => {
    expect(globalsCssContent).not.toBeNull();
    expect(globalsCssContent).toMatch(/width:\s*8px/);
  });

  it('should define scrollbar height of 8px', () => {
    expect(globalsCssContent).not.toBeNull();
    expect(globalsCssContent).toMatch(/height:\s*8px/);
  });

  it('should define scrollbar-track styles', () => {
    expect(globalsCssContent).not.toBeNull();
    expect(globalsCssContent).toContain('::-webkit-scrollbar-track');
  });

  it('should define scrollbar-thumb styles', () => {
    expect(globalsCssContent).not.toBeNull();
    expect(globalsCssContent).toContain('::-webkit-scrollbar-thumb');
  });

  it('should define scrollbar-thumb:hover styles', () => {
    expect(globalsCssContent).not.toBeNull();
    expect(globalsCssContent).toContain('::-webkit-scrollbar-thumb:hover');
  });

  it('should use Hyyve colors for scrollbar styling', () => {
    expect(globalsCssContent).not.toBeNull();
    // Check that scrollbar uses Hyyve CSS variables or hex colors
    const usesHyyveColors =
      globalsCssContent!.includes('--hyyve-background-dark') ||
      globalsCssContent!.includes('--hyyve-border-dark') ||
      globalsCssContent!.includes('--hyyve-primary') ||
      globalsCssContent!.includes('#131221') ||
      globalsCssContent!.includes('#272546') ||
      globalsCssContent!.includes('#5048e5');
    expect(usesHyyveColors).toBe(true);
  });
});

describe('Design System - Canvas Utilities (AC8)', () => {
  let globalsCssContent: string | null = null;

  beforeAll(() => {
    try {
      globalsCssContent = fs.readFileSync(GLOBALS_CSS_PATH, 'utf-8');
    } catch {
      globalsCssContent = null;
    }
  });

  describe('Dot Grid Pattern', () => {
    it('should define .bg-dot-grid class', () => {
      expect(globalsCssContent).not.toBeNull();
      expect(globalsCssContent).toContain('.bg-dot-grid');
    });

    it('should use radial-gradient for dot pattern', () => {
      expect(globalsCssContent).not.toBeNull();
      expect(globalsCssContent).toMatch(/radial-gradient/);
    });

    it('should define background-size for dot grid spacing', () => {
      expect(globalsCssContent).not.toBeNull();
      expect(globalsCssContent).toMatch(/background-size:\s*24px\s*24px/);
    });
  });

  describe('Connection Line Animation', () => {
    it('should define .connection-line class', () => {
      expect(globalsCssContent).not.toBeNull();
      expect(globalsCssContent).toContain('.connection-line');
    });

    it('should have stroke property for connection lines', () => {
      expect(globalsCssContent).not.toBeNull();
      expect(globalsCssContent).toMatch(/stroke:/);
    });

    it('should define @keyframes dash animation', () => {
      expect(globalsCssContent).not.toBeNull();
      expect(globalsCssContent).toContain('@keyframes dash');
    });

    it('should use Hyyve primary color for connection lines', () => {
      expect(globalsCssContent).not.toBeNull();
      // Check for Hyyve primary color reference
      const usesHyyvePrimary =
        globalsCssContent!.includes('--hyyve-primary') ||
        globalsCssContent!.includes('#5048e5') ||
        globalsCssContent!.includes('80, 72, 229'); // rgba value
      expect(usesHyyvePrimary).toBe(true);
    });
  });

  describe('Typing Indicator Animation', () => {
    it('should define @keyframes bounce-delayed animation', () => {
      expect(globalsCssContent).not.toBeNull();
      expect(globalsCssContent).toContain('@keyframes bounce-delayed');
    });

    it('should define .animate-bounce-delayed-1 class', () => {
      expect(globalsCssContent).not.toBeNull();
      expect(globalsCssContent).toContain('.animate-bounce-delayed-1');
    });

    it('should define .animate-bounce-delayed-2 class', () => {
      expect(globalsCssContent).not.toBeNull();
      expect(globalsCssContent).toContain('.animate-bounce-delayed-2');
    });

    it('should define .animate-bounce-delayed-3 class', () => {
      expect(globalsCssContent).not.toBeNull();
      expect(globalsCssContent).toContain('.animate-bounce-delayed-3');
    });

    it('should have staggered animation delays', () => {
      expect(globalsCssContent).not.toBeNull();
      expect(globalsCssContent).toMatch(/animation-delay:\s*0s/);
      expect(globalsCssContent).toMatch(/animation-delay:\s*0\.2s/);
      expect(globalsCssContent).toMatch(/animation-delay:\s*0\.4s/);
    });
  });
});

describe('Design System - Tailwind Config Integration', () => {
  let tailwindConfigContent: string | null = null;

  beforeAll(() => {
    try {
      tailwindConfigContent = fs.readFileSync(TAILWIND_CONFIG_PATH, 'utf-8');
    } catch {
      tailwindConfigContent = null;
    }
  });

  it('should be a valid TypeScript file', () => {
    expect(tailwindConfigContent).not.toBeNull();
    expect(tailwindConfigContent).toMatch(/import|export/);
  });

  it('should have darkMode set to "class"', () => {
    expect(tailwindConfigContent).not.toBeNull();
    expect(tailwindConfigContent).toContain("darkMode: 'class'");
  });

  it('should extend theme with Hyyve-specific colors', () => {
    expect(tailwindConfigContent).not.toBeNull();
    // Check for Hyyve color extensions in the config
    const hasHyyveColors =
      tailwindConfigContent!.includes('hyyve') ||
      tailwindConfigContent!.includes('background-dark') ||
      tailwindConfigContent!.includes('panel-dark') ||
      tailwindConfigContent!.includes('canvas-dark') ||
      tailwindConfigContent!.includes('#5048e5') ||
      tailwindConfigContent!.includes('#131221');

    expect(hasHyyveColors).toBe(true);
  });

  it('should include Hyyve-specific boxShadow definitions', () => {
    expect(tailwindConfigContent).not.toBeNull();
    // Check for custom shadow definitions
    const hasCustomShadows =
      tailwindConfigContent!.includes('primary-glow') ||
      tailwindConfigContent!.includes('primaryGlow') ||
      tailwindConfigContent!.includes('boxShadow');

    expect(hasCustomShadows).toBe(true);
  });

  it('should include Inter font family configuration', () => {
    expect(tailwindConfigContent).not.toBeNull();
    // Check for font family configuration with Inter
    const hasFontConfig =
      tailwindConfigContent!.includes('fontFamily') && tailwindConfigContent!.includes('Inter');

    expect(hasFontConfig).toBe(true);
  });

  it('should include Hyyve border radius values', () => {
    expect(tailwindConfigContent).not.toBeNull();
    expect(tailwindConfigContent).toContain('borderRadius');
  });

  it('should import or reference design-tokens for Hyyve colors', () => {
    expect(tailwindConfigContent).not.toBeNull();
    // The config should either import design-tokens or contain the Hyyve color values directly
    const referencesDesignTokens =
      tailwindConfigContent!.includes('design-tokens') ||
      tailwindConfigContent!.includes(EXPECTED_COLORS.primary) ||
      tailwindConfigContent!.includes(EXPECTED_COLORS.backgroundDark);

    expect(referencesDesignTokens).toBe(true);
  });
});
