/**
 * Social Auth Buttons Component
 *
 * Story: 1-1-2 User Registration with Social Providers
 * Wireframe: hyyve_registration_-_step_1
 *
 * Features:
 * - Google OAuth button with Google icon
 * - GitHub OAuth button with GitHub icon
 * - Support for both sign-up and sign-in modes
 * - Loading states during OAuth redirect
 * - Error display for failed OAuth attempts
 * - Accessible with keyboard navigation and screen reader support
 *
 * Design tokens from wireframe:
 * - Button height: h-11 (44px)
 * - Background: bg-background-dark (#131221)
 * - Border: border border-card-border (#272546)
 * - Border radius: rounded-lg
 * - Text: text-white text-sm
 * - Hover: hover:bg-panel-dark hover:border-primary
 */

'use client';

import * as React from 'react';
import { useSignIn, useSignUp } from '@clerk/nextjs';

import { cn } from '@/lib/utils';

/**
 * Supported OAuth providers
 */
export type OAuthProvider = 'google' | 'github';

/**
 * Props for the SocialAuthButtons component
 */
export interface SocialAuthButtonsProps {
  /** Authentication mode - sign up for new users, sign in for existing users */
  mode: 'signUp' | 'signIn';
  /** Show action text (Sign up with/Sign in with) instead of "Continue with" */
  showActionText?: boolean;
  /** Make buttons full width */
  fullWidth?: boolean;
  /** Layout direction */
  layout?: 'vertical' | 'horizontal';
  /** External loading state */
  isLoading?: boolean;
  /** External error message */
  error?: string;
  /** Callback when OAuth flow starts */
  onOAuthStart?: (provider: OAuthProvider) => void;
  /** Callback when OAuth fails */
  onError?: (error: Error, provider: OAuthProvider) => void;
  /** URL to redirect to after OAuth */
  redirectUrl?: string;
  /** URL to redirect to after OAuth flow completes */
  redirectUrlComplete?: string;
  /** Providers to display (default: ['google', 'github']) */
  providers?: OAuthProvider[];
}

/**
 * Google Icon SVG Component
 */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      data-testid="google-icon"
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

/**
 * GitHub Icon SVG Component
 */
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      data-testid="github-icon"
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

/**
 * Provider configuration - moved outside component to avoid recreation on each render
 */
const PROVIDER_CONFIG: Record<OAuthProvider, { icon: typeof GoogleIcon; label: string }> = {
  google: { icon: GoogleIcon, label: 'Google' },
  github: { icon: GitHubIcon, label: 'GitHub' },
};

/**
 * Loading Spinner Component
 */
function LoadingSpinner({
  provider,
  className,
}: {
  provider: OAuthProvider;
  className?: string;
}) {
  return (
    <svg
      data-testid={`${provider}-loading`}
      className={cn('animate-spin', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

/**
 * SocialAuthButtons Component
 *
 * Renders Google and GitHub OAuth buttons that integrate with Clerk's
 * authentication flow. Supports both sign-up and sign-in modes.
 */
export function SocialAuthButtons({
  mode,
  showActionText = false,
  fullWidth = false,
  layout = 'vertical',
  isLoading: externalLoading = false,
  error: externalError,
  onOAuthStart,
  onError,
  redirectUrl,
  redirectUrlComplete,
  providers = ['google', 'github'],
}: SocialAuthButtonsProps) {
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();

  const [loadingProvider, setLoadingProvider] = React.useState<OAuthProvider | null>(null);
  const [internalError, setInternalError] = React.useState<string | null>(null);

  const isClerkLoaded = mode === 'signIn' ? isSignInLoaded : isSignUpLoaded;
  const isAnyLoading = externalLoading || loadingProvider !== null;
  const displayError = externalError || internalError;

  /**
   * Get the button text based on mode and showActionText prop
   */
  const getButtonText = (provider: OAuthProvider): string => {
    const providerName = provider === 'google' ? 'Google' : 'GitHub';

    if (showActionText) {
      return mode === 'signUp' ? `Sign up with ${providerName}` : `Sign in with ${providerName}`;
    }

    return `Continue with ${providerName}`;
  };

  /**
   * Handle OAuth button click - memoized to prevent unnecessary re-renders
   */
  const handleOAuthClick = React.useCallback(async (provider: OAuthProvider) => {
    // Clear any existing error
    setInternalError(null);

    // Notify parent that OAuth is starting
    onOAuthStart?.(provider);

    // Set loading state
    setLoadingProvider(provider);

    try {
      const strategy = provider === 'google' ? 'oauth_google' : 'oauth_github';
      const authRedirectUrl = redirectUrl || '/sso-callback';
      const authRedirectUrlComplete = redirectUrlComplete || '/dashboard';

      if (mode === 'signUp' && signUp) {
        await signUp.authenticateWithRedirect({
          strategy: strategy as 'oauth_google' | 'oauth_github',
          redirectUrl: authRedirectUrl,
          redirectUrlComplete: authRedirectUrlComplete,
        });
      } else if (mode === 'signIn' && signIn) {
        await signIn.authenticateWithRedirect({
          strategy: strategy as 'oauth_google' | 'oauth_github',
          redirectUrl: authRedirectUrl,
          redirectUrlComplete: authRedirectUrlComplete,
        });
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('OAuth failed');
      setInternalError(error.message);
      onError?.(error, provider);
      setLoadingProvider(null);
    }
  }, [mode, signUp, signIn, redirectUrl, redirectUrlComplete, onOAuthStart, onError]);

  // Render loading skeleton when Clerk is not yet loaded
  if (!isClerkLoaded) {
    return (
      <div
        data-testid="social-auth-loading"
        className={cn(
          'flex gap-3',
          layout === 'vertical' ? 'flex-col' : 'flex-row'
        )}
      >
        {providers.map((provider) => (
          <div
            key={provider}
            className={cn(
              'h-11 rounded-lg bg-background-dark border border-card-border animate-pulse',
              fullWidth && 'w-full'
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Error Alert */}
      {displayError && (
        <div
          role="alert"
          className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm"
        >
          {displayError}
        </div>
      )}

      {/* Social Auth Buttons Container */}
      <div
        data-testid="social-auth-buttons"
        className={cn(
          'flex gap-3',
          layout === 'vertical' ? 'flex-col' : 'flex-row'
        )}
      >
        {providers.map((provider) => {
          const { icon: Icon } = PROVIDER_CONFIG[provider];
          const isButtonLoading = loadingProvider === provider;
          const isDisabled = isAnyLoading;

          return (
            <button
              key={provider}
              type="button"
              disabled={isDisabled}
              aria-busy={isButtonLoading}
              aria-disabled={isDisabled}
              aria-label={getButtonText(provider)}
              onClick={() => handleOAuthClick(provider)}
              className={cn(
                // Base styles
                'h-11 rounded-lg text-white text-sm font-medium',
                'bg-background-dark border border-card-border',
                'flex items-center justify-center gap-3',
                'transition-all duration-200',
                // Focus styles
                'focus:outline-none focus:ring-2 focus:ring-primary/50',
                // Hover styles (when not disabled)
                !isDisabled && 'hover:bg-panel-dark hover:border-primary',
                // Disabled styles
                isDisabled && 'opacity-50 cursor-not-allowed',
                // Width
                fullWidth ? 'w-full' : 'px-4'
              )}
            >
              {isButtonLoading ? (
                <LoadingSpinner provider={provider} className="h-5 w-5" />
              ) : (
                <>
                  <Icon className="h-5 w-5" />
                  <span>{getButtonText(provider)}</span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
