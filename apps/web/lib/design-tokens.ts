/**
 * Hyyve Design System - Design Tokens
 *
 * Story: 0-2-1 Extract Design System from Wireframes
 *
 * This file contains all design tokens extracted from the Stitch wireframes.
 * It serves as the single source of truth for the Hyyve visual design system.
 *
 * Source Wireframes:
 * - hyyve_module_builder/code.html (lines 16-79)
 * - hyyve_home_dashboard/code.html
 * - hyyve_login_page/code.html
 *
 * Usage:
 * - Import specific tokens: import { HYYVE_COLORS, HYYVE_TYPOGRAPHY } from '@/lib/design-tokens'
 * - Import all tokens: import * as designTokens from '@/lib/design-tokens'
 * - Use in Tailwind config for consistency
 */

// =============================================================================
// COLORS (AC1)
// =============================================================================

/**
 * Hyyve Color Palette
 *
 * Extracted from wireframe Tailwind configurations.
 * All colors include their hex values and CSS variable mappings.
 */
export const HYYVE_COLORS = {
  // Primary Colors
  primary: '#5048e5', // Hyyve purple - main brand color
  primaryDark: '#3e38b3', // Darker purple for hover states
  primaryLight: '#6c63ff', // Lighter purple for highlights

  // Background Colors
  backgroundLight: '#f6f6f8', // Light mode background
  backgroundDark: '#131221', // Main dark background (from module_builder)
  backgroundDarkAlt: '#121121', // Alternate dark background (from dashboard)

  // Panel & Surface Colors
  panelDark: '#1c1a2e', // Sidebars, cards, panels
  cardDark: '#1c1b2e', // Dashboard cards (slight variation)
  canvasDark: '#0f1115', // Builder canvas background
  inputDark: '#0f172a', // Form inputs in dark mode

  // Border Colors
  borderDark: '#272546', // Primary border color in dark mode
  cardBorder: '#272546', // Card borders (same as borderDark)

  // Text Colors
  textPrimary: '#ffffff', // Primary text on dark backgrounds
  textSecondary: '#9795c6', // Secondary/muted text
  textMuted: '#6b6992', // More muted text
  textLight: '#e2e8f0', // Light text on dark backgrounds

  // State Colors
  success: '#10b981', // Emerald green for success states
  warning: '#f59e0b', // Amber for warnings
  error: '#ef4444', // Red for errors
  info: '#3b82f6', // Blue for info

  // Activity Indicator Colors (from dashboard)
  activityActive: '#10b981', // Emerald for active
  activityPaused: '#f59e0b', // Amber for paused
  activityError: '#ef4444', // Red for error
} as const;

/**
 * Nested color structure for easier access in components
 */
export const colors = {
  primary: {
    DEFAULT: HYYVE_COLORS.primary,
    dark: HYYVE_COLORS.primaryDark,
    light: HYYVE_COLORS.primaryLight,
  },
  background: {
    light: HYYVE_COLORS.backgroundLight,
    dark: HYYVE_COLORS.backgroundDark,
    darkAlt: HYYVE_COLORS.backgroundDarkAlt,
  },
  panel: {
    dark: HYYVE_COLORS.panelDark,
  },
  card: {
    dark: HYYVE_COLORS.cardDark,
    border: HYYVE_COLORS.cardBorder,
  },
  canvas: {
    dark: HYYVE_COLORS.canvasDark,
  },
  input: {
    dark: HYYVE_COLORS.inputDark,
  },
  border: {
    dark: HYYVE_COLORS.borderDark,
  },
  text: {
    primary: HYYVE_COLORS.textPrimary,
    secondary: HYYVE_COLORS.textSecondary,
    muted: HYYVE_COLORS.textMuted,
    light: HYYVE_COLORS.textLight,
  },
  status: {
    success: HYYVE_COLORS.success,
    warning: HYYVE_COLORS.warning,
    error: HYYVE_COLORS.error,
    info: HYYVE_COLORS.info,
  },
} as const;

// =============================================================================
// TYPOGRAPHY (AC2)
// =============================================================================

/**
 * Typography Configuration
 *
 * Font families and weights extracted from wireframes.
 * Inter is the primary display font with Noto Sans as fallback.
 */
export const HYYVE_TYPOGRAPHY = {
  fontFamily: {
    display: ['Inter', 'Noto Sans', 'system-ui', 'sans-serif'],
    sans: ['Inter', 'Noto Sans', 'system-ui', 'sans-serif'],
    mono: ['Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
} as const;

/**
 * Typography nested structure for components
 */
export const typography = {
  fontFamily: HYYVE_TYPOGRAPHY.fontFamily,
  fontWeight: HYYVE_TYPOGRAPHY.fontWeight,
  fontSize: HYYVE_TYPOGRAPHY.fontSize,
  lineHeight: HYYVE_TYPOGRAPHY.lineHeight,
} as const;

// =============================================================================
// BORDER RADIUS (AC3)
// =============================================================================

/**
 * Border Radius Values
 *
 * Custom radius values matching wireframe designs.
 */
export const HYYVE_BORDER_RADIUS = {
  none: '0',
  xs: '0.125rem', // 2px
  DEFAULT: '0.25rem', // 4px
  sm: '0.25rem', // 4px (alias)
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px', // Circular
} as const;

/**
 * Border radius nested structure
 */
export const borderRadius = HYYVE_BORDER_RADIUS;

// =============================================================================
// SHADOWS (AC4)
// =============================================================================

/**
 * Shadow Definitions
 *
 * Custom shadows including the signature primary glow effect.
 */
export const HYYVE_SHADOWS = {
  // Primary glow for buttons and focused elements
  primaryGlow: '0 0 15px rgba(80, 72, 229, 0.3)',
  primaryGlowLg: '0 0 20px rgba(80, 72, 229, 0.4)',

  // Card and panel shadows
  card: '0 4px 20px rgba(0, 0, 0, 0.5)',
  cardSm: '0 2px 10px rgba(0, 0, 0, 0.3)',

  // Elevated elements
  elevated: '0 10px 30px rgba(0, 0, 0, 0.4)',
  elevatedLg: '0 20px 40px rgba(0, 0, 0, 0.5)',

  // Subtle shadows for depth
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.15)',

  // Inset shadows for inputs
  inset: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',

  // None
  none: 'none',
} as const;

/**
 * Shadows nested structure
 */
export const shadows = HYYVE_SHADOWS;

// =============================================================================
// SPACING (AC9)
// =============================================================================

/**
 * Spacing System
 *
 * 4px base grid system with layout-specific dimensions.
 */
export const HYYVE_SPACING = {
  // Base grid unit
  base: 4,

  // Spacing scale (multiples of 4px)
  scale: {
    0: '0',
    px: '1px',
    0.5: '0.125rem', // 2px
    1: '0.25rem', // 4px
    1.5: '0.375rem', // 6px
    2: '0.5rem', // 8px
    2.5: '0.625rem', // 10px
    3: '0.75rem', // 12px
    3.5: '0.875rem', // 14px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    7: '1.75rem', // 28px
    8: '2rem', // 32px
    9: '2.25rem', // 36px
    10: '2.5rem', // 40px
    12: '3rem', // 48px
    14: '3.5rem', // 56px
    16: '4rem', // 64px
    20: '5rem', // 80px
    24: '6rem', // 96px
    28: '7rem', // 112px
    32: '8rem', // 128px
  },

  // Layout dimensions
  layout: {
    headerHeight: '4rem', // 64px (h-16)
    sidebarWidth: '18rem', // 288px (w-72)
    sidebarWidthCollapsed: '4rem', // 64px
    chatPanelWidth: '20rem', // 320px (w-80)
    maxContentWidth: '1200px',
    containerPadding: '1.5rem', // 24px (p-6)
  },
} as const;

/**
 * Spacing nested structure
 */
export const spacing = {
  base: HYYVE_SPACING.base,
  scale: HYYVE_SPACING.scale,
  layout: HYYVE_SPACING.layout,
  // Layout dimension shortcuts
  headerHeight: HYYVE_SPACING.layout.headerHeight,
  sidebarWidth: HYYVE_SPACING.layout.sidebarWidth,
  chatPanelWidth: HYYVE_SPACING.layout.chatPanelWidth,
} as const;

// =============================================================================
// LAYOUT (Additional layout tokens)
// =============================================================================

/**
 * Layout Configuration
 *
 * Additional layout tokens for consistent UI structure.
 */
export const HYYVE_LAYOUT = {
  // Header
  headerHeight: '4rem', // 64px
  headerHeightPx: 64,

  // Sidebar
  sidebarWidth: '18rem', // 288px
  sidebarWidthPx: 288,
  sidebarWidthCollapsed: '4rem', // 64px
  sidebarWidthCollapsedPx: 64,

  // Chat Panel
  chatPanelWidth: '20rem', // 320px
  chatPanelWidthPx: 320,

  // Content
  maxContentWidth: '1200px',
  maxContentWidthPx: 1200,

  // Z-index scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
} as const;

export const layout = HYYVE_LAYOUT;

// =============================================================================
// DARK MODE CONFIGURATION (AC5)
// =============================================================================

/**
 * Theme Configuration
 *
 * Dark mode is the default for Hyyve platform.
 */
export const HYYVE_THEME = {
  defaultMode: 'dark' as const,
  modes: ['light', 'dark'] as const,
  darkModeClass: 'dark',
} as const;

// =============================================================================
// TYPE EXPORTS (AC4 - Issue #4 fix)
// =============================================================================

/**
 * Theme mode type for type-safe theme switching
 * Usage: const mode: ThemeMode = 'dark';
 */
export type ThemeMode = (typeof HYYVE_THEME.modes)[number];

/**
 * Color token keys type
 */
export type HyyveColorKey = keyof typeof HYYVE_COLORS;

/**
 * Typography token keys type
 */
export type HyyveTypographyKey = keyof typeof HYYVE_TYPOGRAPHY;

/**
 * Border radius token keys type
 */
export type HyyveBorderRadiusKey = keyof typeof HYYVE_BORDER_RADIUS;

/**
 * Shadow token keys type
 */
export type HyyveShadowKey = keyof typeof HYYVE_SHADOWS;

/**
 * Spacing scale keys type
 */
export type HyyveSpacingScaleKey = keyof typeof HYYVE_SPACING.scale;

// =============================================================================
// ANIMATION (Utility tokens)
// =============================================================================

/**
 * Animation Durations
 */
export const HYYVE_ANIMATION = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  easing: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// =============================================================================
// EXPORTS
// =============================================================================

/**
 * Default theme mode
 */
export const defaultMode = HYYVE_THEME.defaultMode;

/**
 * Combined design tokens export
 */
export const designTokens = {
  colors: HYYVE_COLORS,
  typography: HYYVE_TYPOGRAPHY,
  borderRadius: HYYVE_BORDER_RADIUS,
  shadows: HYYVE_SHADOWS,
  spacing: HYYVE_SPACING,
  layout: HYYVE_LAYOUT,
  theme: HYYVE_THEME,
  animation: HYYVE_ANIMATION,
} as const;

export default designTokens;
