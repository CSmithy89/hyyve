import type { Config } from 'tailwindcss';
import {
  HYYVE_COLORS,
  HYYVE_TYPOGRAPHY,
  HYYVE_BORDER_RADIUS,
  HYYVE_SHADOWS,
} from './lib/design-tokens';

/**
 * Hyyve Tailwind Configuration
 *
 * Extends the base Tailwind config with Hyyve-specific design tokens
 * extracted from the Stitch wireframes.
 *
 * Story: 0-2-1 Extract Design System from Wireframes
 */
const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/@platform/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // =================================================================
      // COLORS
      // =================================================================
      colors: {
        // shadcn/ui CSS variable-based colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // Hyyve-specific colors from design tokens
        hyyve: {
          // Primary brand colors
          primary: HYYVE_COLORS.primary,
          'primary-dark': HYYVE_COLORS.primaryDark,
          'primary-light': HYYVE_COLORS.primaryLight,

          // Background colors
          'background-light': HYYVE_COLORS.backgroundLight,
          'background-dark': HYYVE_COLORS.backgroundDark,

          // Panel and surface colors
          'panel-dark': HYYVE_COLORS.panelDark,
          'card-dark': HYYVE_COLORS.cardDark,
          'canvas-dark': HYYVE_COLORS.canvasDark,
          'input-dark': HYYVE_COLORS.inputDark,

          // Border colors
          'border-dark': HYYVE_COLORS.borderDark,
          'card-border': HYYVE_COLORS.cardBorder,

          // Text colors
          'text-primary': HYYVE_COLORS.textPrimary,
          'text-secondary': HYYVE_COLORS.textSecondary,
          'text-muted': HYYVE_COLORS.textMuted,

          // State colors
          success: HYYVE_COLORS.success,
          warning: HYYVE_COLORS.warning,
          error: HYYVE_COLORS.error,
          info: HYYVE_COLORS.info,
        },

        // Direct color aliases for wireframe compatibility
        'background-dark': HYYVE_COLORS.backgroundDark,
        'panel-dark': HYYVE_COLORS.panelDark,
        'canvas-dark': HYYVE_COLORS.canvasDark,
        'border-dark': HYYVE_COLORS.borderDark,
        'text-secondary': HYYVE_COLORS.textSecondary,
      },

      // =================================================================
      // FONT FAMILY
      // Primary font: Inter (display and sans)
      // Fallback: Noto Sans, system-ui, sans-serif
      // =================================================================
      fontFamily: {
        display: [
          "var(--font-inter)",
          ...HYYVE_TYPOGRAPHY.fontFamily.display.filter((font) => font !== "Inter"),
        ], // ['var(--font-inter)', 'Noto Sans', 'system-ui', 'sans-serif']
        sans: [
          "var(--font-inter)",
          ...HYYVE_TYPOGRAPHY.fontFamily.sans.filter((font) => font !== "Inter"),
        ], // ['var(--font-inter)', 'Noto Sans', 'system-ui', 'sans-serif']
        mono: HYYVE_TYPOGRAPHY.fontFamily.mono, // ['Menlo', 'Monaco', 'Consolas', ...]
      },

      // =================================================================
      // BORDER RADIUS
      // =================================================================
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        // Hyyve-specific radius values
        hyyve: HYYVE_BORDER_RADIUS.DEFAULT,
        'hyyve-md': HYYVE_BORDER_RADIUS.md,
        'hyyve-lg': HYYVE_BORDER_RADIUS.lg,
        'hyyve-xl': HYYVE_BORDER_RADIUS.xl,
        'hyyve-2xl': HYYVE_BORDER_RADIUS['2xl'],
      },

      // =================================================================
      // BOX SHADOW
      // =================================================================
      boxShadow: {
        // Hyyve-specific shadows
        'primary-glow': HYYVE_SHADOWS.primaryGlow,
        'primary-glow-lg': HYYVE_SHADOWS.primaryGlowLg,
        'hyyve-card': HYYVE_SHADOWS.card,
        'hyyve-card-sm': HYYVE_SHADOWS.cardSm,
        'hyyve-elevated': HYYVE_SHADOWS.elevated,
        'hyyve-elevated-lg': HYYVE_SHADOWS.elevatedLg,
        'hyyve-inset': HYYVE_SHADOWS.inset,
      },

      // =================================================================
      // KEYFRAMES & ANIMATIONS
      // =================================================================
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        // Connection line animation for workflow canvas
        dash: {
          to: { strokeDashoffset: '-1000' },
        },
        // Typing indicator bounce
        'bounce-delayed': {
          '0%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        dash: 'dash 5s linear infinite',
        'bounce-delayed-1': 'bounce-delayed 1.4s ease-in-out infinite',
        'bounce-delayed-2': 'bounce-delayed 1.4s ease-in-out 0.2s infinite',
        'bounce-delayed-3': 'bounce-delayed 1.4s ease-in-out 0.4s infinite',
      },

      // =================================================================
      // LAYOUT DIMENSIONS
      // =================================================================
      spacing: {
        header: '4rem', // 64px - header height
        sidebar: '18rem', // 288px - sidebar width
        'sidebar-collapsed': '4rem', // 64px
        'chat-panel': '20rem', // 320px
      },
      width: {
        sidebar: '18rem',
        'sidebar-collapsed': '4rem',
        'chat-panel': '20rem',
      },
      height: {
        header: '4rem',
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
};

export default config;
