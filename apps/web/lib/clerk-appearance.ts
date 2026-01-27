/**
 * Clerk Appearance Configuration
 *
 * Story: 0-2-8 Implement Auth Pages (Clerk UI)
 * AC3: Clerk appearance customization
 *
 * Customizes Clerk components to match Hyyve design tokens:
 * - Primary color: #5048e5
 * - Dark theme as default
 * - Border radius matching card styling
 * - Consistent button and input styling
 *
 * @see https://clerk.com/docs/customization/overview
 */

import type { Appearance } from '@clerk/types';

/**
 * Hyyve design tokens for Clerk styling
 * Exported for use by other Clerk-related components
 */
export const hyyveTokens = {
  // Brand colors
  primary: '#5048e5',
  primaryHover: '#4338ca', // indigo-600
  primaryLight: 'rgba(80, 72, 229, 0.2)',

  // Background colors (dark theme)
  backgroundDark: '#0f172a', // slate-900
  cardDark: '#1e293b', // slate-800
  inputDark: '#0f172a',

  // Border colors
  borderDark: '#334155', // slate-700

  // Text colors
  textLight: '#f8fafc', // slate-50
  textMuted: '#94a3b8', // slate-400

  // Border radius
  borderRadius: '0.75rem', // rounded-xl
  borderRadiusInput: '0.5rem', // rounded-lg
};

/**
 * Clerk appearance configuration matching Hyyve design system
 *
 * This configuration is used by both SignIn and SignUp components
 * to ensure consistent styling across authentication pages.
 */
export const clerkAppearance: Appearance = {
  // Base theme
  baseTheme: undefined, // We customize everything ourselves

  // CSS Variables for theming
  variables: {
    // Colors
    colorPrimary: hyyveTokens.primary,
    colorBackground: hyyveTokens.cardDark,
    colorInputBackground: hyyveTokens.inputDark,
    colorInputText: hyyveTokens.textLight,
    colorText: hyyveTokens.textLight,
    colorTextSecondary: hyyveTokens.textMuted,
    colorDanger: '#ef4444', // red-500

    // Typography
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '14px',
    fontWeight: {
      normal: 400,
      medium: 500,
      bold: 600,
    },

    // Border radius
    borderRadius: hyyveTokens.borderRadius,

    // Spacing
    spacingUnit: '4px',
  },

  // Element-level styling
  elements: {
    // Root card container
    rootBox: {
      width: '100%',
    },
    card: {
      backgroundColor: 'transparent',
      boxShadow: 'none',
      border: 'none',
    },

    // Header area
    headerTitle: {
      color: hyyveTokens.textLight,
      fontSize: '1.5rem',
      fontWeight: 700,
    },
    headerSubtitle: {
      color: hyyveTokens.textMuted,
      fontSize: '0.875rem',
    },

    // Social OAuth buttons (Google, GitHub)
    socialButtonsBlockButton: {
      backgroundColor: hyyveTokens.inputDark,
      border: `1px solid ${hyyveTokens.borderDark}`,
      borderRadius: hyyveTokens.borderRadiusInput,
      color: hyyveTokens.textLight,
      fontSize: '0.875rem',
      fontWeight: 500,
      height: '2.75rem',
      '&:hover': {
        backgroundColor: hyyveTokens.cardDark,
        borderColor: hyyveTokens.primary,
      },
    },
    socialButtonsBlockButtonText: {
      color: hyyveTokens.textLight,
    },
    socialButtonsProviderIcon: {
      width: '1.25rem',
      height: '1.25rem',
    },

    // Divider
    dividerLine: {
      backgroundColor: hyyveTokens.borderDark,
    },
    dividerText: {
      color: hyyveTokens.textMuted,
      fontSize: '0.75rem',
      textTransform: 'uppercase' as const,
    },

    // Form fields
    formFieldLabel: {
      color: hyyveTokens.textLight,
      fontSize: '0.875rem',
      fontWeight: 500,
      marginBottom: '0.375rem',
    },
    formFieldInput: {
      backgroundColor: hyyveTokens.inputDark,
      border: `1px solid ${hyyveTokens.borderDark}`,
      borderRadius: hyyveTokens.borderRadiusInput,
      color: hyyveTokens.textLight,
      fontSize: '0.875rem',
      height: '2.75rem',
      padding: '0 0.75rem',
      '&:focus': {
        borderColor: hyyveTokens.primary,
        boxShadow: `0 0 0 2px ${hyyveTokens.primaryLight}`,
      },
      '&::placeholder': {
        color: hyyveTokens.textMuted,
      },
    },
    formFieldInputShowPasswordButton: {
      color: hyyveTokens.textMuted,
      '&:hover': {
        color: hyyveTokens.textLight,
      },
    },

    // Primary action buttons
    formButtonPrimary: {
      backgroundColor: hyyveTokens.primary,
      borderRadius: hyyveTokens.borderRadiusInput,
      color: '#ffffff',
      fontSize: '0.875rem',
      fontWeight: 600,
      height: '2.75rem',
      textTransform: 'none' as const,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      '&:hover': {
        backgroundColor: hyyveTokens.primaryHover,
      },
      '&:active': {
        transform: 'scale(0.98)',
      },
    },

    // Footer links
    footerActionLink: {
      color: hyyveTokens.primary,
      fontWeight: 500,
      '&:hover': {
        color: hyyveTokens.primaryHover,
      },
    },
    footerActionText: {
      color: hyyveTokens.textMuted,
      fontSize: '0.875rem',
    },

    // Alternative actions
    alternativeMethodsBlockButton: {
      backgroundColor: hyyveTokens.inputDark,
      border: `1px solid ${hyyveTokens.borderDark}`,
      borderRadius: hyyveTokens.borderRadiusInput,
      color: hyyveTokens.textLight,
      '&:hover': {
        backgroundColor: hyyveTokens.cardDark,
      },
    },

    // Identity preview (email display)
    identityPreview: {
      backgroundColor: hyyveTokens.inputDark,
      border: `1px solid ${hyyveTokens.borderDark}`,
      borderRadius: hyyveTokens.borderRadiusInput,
    },
    identityPreviewText: {
      color: hyyveTokens.textLight,
    },
    identityPreviewEditButton: {
      color: hyyveTokens.primary,
    },

    // Error states
    formFieldErrorText: {
      color: '#ef4444',
      fontSize: '0.75rem',
    },
    alert: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: hyyveTokens.borderRadiusInput,
    },

    // Loading states
    spinner: {
      color: hyyveTokens.primary,
    },

    // User button (for authenticated state)
    userButtonAvatarBox: {
      borderRadius: '9999px',
    },
    userButtonPopoverCard: {
      backgroundColor: hyyveTokens.cardDark,
      border: `1px solid ${hyyveTokens.borderDark}`,
      borderRadius: hyyveTokens.borderRadius,
    },
  },

  // Layout configuration
  layout: {
    socialButtonsPlacement: 'bottom',
    socialButtonsVariant: 'blockButton',
    showOptionalFields: false,
  },
};

/**
 * Get appearance config with optional overrides
 */
export function getClerkAppearance(overrides?: Partial<Appearance>): Appearance {
  if (!overrides) return clerkAppearance;

  // Shallow merge to avoid complex union types
  return {
    ...clerkAppearance,
    ...overrides,
  } as Appearance;
}

export default clerkAppearance;
