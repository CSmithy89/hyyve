/**
 * Hyyve Design System - Theme Utilities
 *
 * Story: 0-2-2 Create shadcn Component Overrides
 *
 * This file contains reusable Tailwind class combinations and style utilities
 * for the Hyyve design system. These utilities help maintain consistency
 * across components and make it easier to apply common styling patterns.
 *
 * @description Shared style utilities for Hyyve UI components
 * @module components/ui/theme
 */

// =============================================================================
// SHADOW UTILITIES
// =============================================================================

/**
 * Primary glow shadow effect
 * Used for primary buttons and focused elements
 *
 * @example
 * ```tsx
 * <button className={cn(primaryGlow, "bg-primary")}>Click me</button>
 * ```
 */
export const primaryGlow = "shadow-[0_0_15px_rgba(80,72,229,0.3)]";

/**
 * Large primary glow shadow effect
 * Used for emphasized interactive elements
 */
export const primaryGlowLg = "shadow-[0_0_20px_rgba(80,72,229,0.4)]";

/**
 * Card shadow for panels and cards
 * Provides depth in dark mode
 */
export const shadowCard = "shadow-[0_4px_20px_rgba(0,0,0,0.5)]";

/**
 * Elevated shadow for floating elements
 * Stronger depth for modals and popovers
 */
export const shadowElevated = "shadow-[0_10px_30px_rgba(0,0,0,0.4)]";

// =============================================================================
// PANEL & SURFACE UTILITIES
// =============================================================================

/**
 * Standard panel styling for cards, sidebars, and content containers
 * Uses the panel-dark background with border styling
 *
 * @example
 * ```tsx
 * <div className={cn(panel, "p-4")}>Panel content</div>
 * ```
 */
export const panel = "bg-card border border-border rounded-xl";

/**
 * Elevated panel with shadow
 * For panels that need visual hierarchy
 */
export const panelElevated = "bg-card border border-border rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)]";

/**
 * Surface styling for content areas
 * Lighter background than panels
 */
export const surface = "bg-background";

/**
 * Canvas background for builder workspaces
 * Darkest background level
 */
export const canvas = "bg-background";

// =============================================================================
// INTERACTIVE ELEMENT UTILITIES
// =============================================================================

/**
 * Focus ring styling consistent with Hyyve design
 * Uses primary color for accessibility
 */
export const focusRing = "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

/**
 * Hover state for interactive elements
 * Subtle background change
 */
export const hoverInteractive = "hover:bg-accent transition-colors";

/**
 * Disabled state styling
 */
export const disabled = "disabled:pointer-events-none disabled:opacity-50";

// =============================================================================
// BORDER UTILITIES
// =============================================================================

/**
 * Standard border styling
 * Uses the border-dark color in dark mode
 */
export const borderDefault = "border border-border";

/**
 * Input border styling
 * Used for form elements
 */
export const borderInput = "border border-input";

// =============================================================================
// TEXT UTILITIES
// =============================================================================

/**
 * Primary text color
 */
export const textPrimary = "text-foreground";

/**
 * Secondary/muted text color
 */
export const textSecondary = "text-muted-foreground";

// =============================================================================
// STATUS COLOR UTILITIES
// =============================================================================

/**
 * Success status styling (emerald green)
 */
export const statusSuccess = "bg-emerald-500/10 text-emerald-400";

/**
 * Warning status styling (amber)
 */
export const statusWarning = "bg-amber-500/10 text-amber-400";

/**
 * Error status styling (red)
 */
export const statusError = "bg-destructive/10 text-destructive";

/**
 * Info status styling (blue)
 */
export const statusInfo = "bg-blue-500/10 text-blue-400";

// =============================================================================
// COMBINED UTILITIES
// =============================================================================

/**
 * Default card/panel container styles
 * Combines panel styling with padding
 */
export const cardContainer = "bg-card border border-border rounded-xl p-6";

/**
 * Interactive card styles
 * Card with hover effect
 */
export const cardInteractive = "bg-card border border-border rounded-xl p-6 transition-colors hover:border-primary/50";

/**
 * Primary button base styles
 * Combines primary background, glow, and interaction states
 */
export const buttonPrimary = "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(80,72,229,0.3)] hover:bg-accent";

/**
 * Input field base styles
 * Combines background, border, and focus states
 */
export const inputBase = "bg-input border border-input rounded-md focus-visible:ring-1 focus-visible:ring-ring";

// =============================================================================
// THEME EXPORT
// =============================================================================

/**
 * Combined theme utilities export
 * Provides all theme utilities in a single object for convenient access
 *
 * @example
 * ```tsx
 * import { theme } from '@/components/ui/theme';
 * <div className={theme.panel}>Content</div>
 * ```
 */
export const theme = {
  // Shadows
  primaryGlow,
  primaryGlowLg,
  shadowCard,
  shadowElevated,

  // Panels & Surfaces
  panel,
  panelElevated,
  surface,
  canvas,

  // Interactive
  focusRing,
  hoverInteractive,
  disabled,

  // Borders
  borderDefault,
  borderInput,

  // Text
  textPrimary,
  textSecondary,

  // Status
  statusSuccess,
  statusWarning,
  statusError,
  statusInfo,

  // Combined
  cardContainer,
  cardInteractive,
  buttonPrimary,
  inputBase,
} as const;

export default theme;
