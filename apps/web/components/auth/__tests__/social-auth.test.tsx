/**
 * Social Auth Component Unit Tests
 *
 * Story: 1-1-2 User Registration with Social Providers
 * Wireframe: hyyve_registration_-_step_1
 *
 * TDD RED PHASE: These tests are written to FAIL initially.
 * They test the SocialAuthButtons component that provides custom
 * social OAuth buttons for Google and GitHub integration with Clerk.
 *
 * Tests cover:
 * - Component renders both social providers
 * - Button click handlers trigger OAuth flow
 * - Loading state display during OAuth
 * - Error state display for failed OAuth
 * - Accessibility requirements (ARIA, keyboard)
 *
 * Implementation notes:
 * - Clerk handles actual OAuth flow via @clerk/nextjs
 * - This component provides custom UI matching Hyyve design
 * - Uses Clerk's signIn/signUp methods under the hood
 */

/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

// Component to be implemented (will fail in RED phase)
import { SocialAuthButtons } from '../social-auth-buttons';

// Mock Clerk hooks
const mockSignInWithOAuth = vi.fn();
const mockSignUpWithOAuth = vi.fn();

// Control isLoaded state for testing
let mockIsLoaded = true;

vi.mock('@clerk/nextjs', () => ({
  useSignIn: () => ({
    signIn: mockIsLoaded ? {
      authenticateWithRedirect: mockSignInWithOAuth,
    } : null,
    isLoaded: mockIsLoaded,
  }),
  useSignUp: () => ({
    signUp: mockIsLoaded ? {
      authenticateWithRedirect: mockSignUpWithOAuth,
    } : null,
    isLoaded: mockIsLoaded,
  }),
}));

/**
 * SocialAuthButtons Component Tests
 *
 * This component renders Google and GitHub OAuth buttons
 * that trigger Clerk's OAuth flow when clicked.
 */
describe('SocialAuthButtons', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to loaded state before each test
    mockIsLoaded = true;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Rendering', () => {
    it('renders Google OAuth button', () => {
      render(<SocialAuthButtons mode="signUp" />);

      const googleButton = screen.getByRole('button', { name: /google/i });
      expect(googleButton).toBeInTheDocument();
    });

    it('renders GitHub OAuth button', () => {
      render(<SocialAuthButtons mode="signUp" />);

      const githubButton = screen.getByRole('button', { name: /github/i });
      expect(githubButton).toBeInTheDocument();
    });

    it('renders both buttons in a container', () => {
      render(<SocialAuthButtons mode="signUp" />);

      const container = screen.getByTestId('social-auth-buttons');
      expect(container).toBeInTheDocument();

      // Both buttons should be children of the container
      const buttons = container.querySelectorAll('button');
      expect(buttons).toHaveLength(2);
    });

    it('renders Google icon in Google button', () => {
      render(<SocialAuthButtons mode="signUp" />);

      const googleIcon = screen.getByTestId('google-icon');
      expect(googleIcon).toBeInTheDocument();
    });

    it('renders GitHub icon in GitHub button', () => {
      render(<SocialAuthButtons mode="signUp" />);

      const githubIcon = screen.getByTestId('github-icon');
      expect(githubIcon).toBeInTheDocument();
    });

    it('displays "Continue with Google" text by default', () => {
      render(<SocialAuthButtons mode="signUp" />);

      expect(screen.getByText(/continue with google/i)).toBeInTheDocument();
    });

    it('displays "Continue with GitHub" text by default', () => {
      render(<SocialAuthButtons mode="signUp" />);

      expect(screen.getByText(/continue with github/i)).toBeInTheDocument();
    });

    it('displays "Sign up with" text when mode is signUp and showActionText is true', () => {
      render(<SocialAuthButtons mode="signUp" showActionText />);

      expect(screen.getByText(/sign up with google/i)).toBeInTheDocument();
      expect(screen.getByText(/sign up with github/i)).toBeInTheDocument();
    });

    it('displays "Sign in with" text when mode is signIn and showActionText is true', () => {
      render(<SocialAuthButtons mode="signIn" showActionText />);

      expect(screen.getByText(/sign in with google/i)).toBeInTheDocument();
      expect(screen.getByText(/sign in with github/i)).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies Hyyve design tokens to buttons', () => {
      render(<SocialAuthButtons mode="signUp" />);

      const googleButton = screen.getByRole('button', { name: /google/i });

      // Should have dark background matching inputDark: #131221
      expect(googleButton).toHaveClass('bg-background-dark');
    });

    it('applies border styling from design tokens', () => {
      render(<SocialAuthButtons mode="signUp" />);

      const googleButton = screen.getByRole('button', { name: /google/i });

      // Should have border matching card-border: #272546
      expect(googleButton).toHaveClass('border');
      expect(googleButton).toHaveClass('border-card-border');
    });

    it('applies correct border radius (rounded-lg)', () => {
      render(<SocialAuthButtons mode="signUp" />);

      const googleButton = screen.getByRole('button', { name: /google/i });
      expect(googleButton).toHaveClass('rounded-lg');
    });

    it('applies correct height (h-11 for 44px)', () => {
      render(<SocialAuthButtons mode="signUp" />);

      const googleButton = screen.getByRole('button', { name: /google/i });
      expect(googleButton).toHaveClass('h-11');
    });

    it('applies hover styles', () => {
      render(<SocialAuthButtons mode="signUp" />);

      const googleButton = screen.getByRole('button', { name: /google/i });

      // Should have hover class
      expect(googleButton).toHaveClass('hover:bg-panel-dark');
      expect(googleButton).toHaveClass('hover:border-primary');
    });

    it('uses white text color', () => {
      render(<SocialAuthButtons mode="signUp" />);

      const googleButton = screen.getByRole('button', { name: /google/i });
      expect(googleButton).toHaveClass('text-white');
    });

    it('renders buttons with full width when fullWidth prop is true', () => {
      render(<SocialAuthButtons mode="signUp" fullWidth />);

      const googleButton = screen.getByRole('button', { name: /google/i });
      expect(googleButton).toHaveClass('w-full');
    });

    it('renders buttons stacked vertically by default', () => {
      render(<SocialAuthButtons mode="signUp" />);

      const container = screen.getByTestId('social-auth-buttons');
      expect(container).toHaveClass('flex-col');
    });

    it('renders buttons side by side when layout is horizontal', () => {
      render(<SocialAuthButtons mode="signUp" layout="horizontal" />);

      const container = screen.getByTestId('social-auth-buttons');
      expect(container).toHaveClass('flex-row');
    });
  });

  describe('Click Handlers', () => {
    it('calls signUp.authenticateWithRedirect for Google when mode is signUp', async () => {
      const user = userEvent.setup();
      render(<SocialAuthButtons mode="signUp" />);

      const googleButton = screen.getByRole('button', { name: /google/i });
      await user.click(googleButton);

      expect(mockSignUpWithOAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          strategy: 'oauth_google',
        })
      );
    });

    it('calls signUp.authenticateWithRedirect for GitHub when mode is signUp', async () => {
      const user = userEvent.setup();
      render(<SocialAuthButtons mode="signUp" />);

      const githubButton = screen.getByRole('button', { name: /github/i });
      await user.click(githubButton);

      expect(mockSignUpWithOAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          strategy: 'oauth_github',
        })
      );
    });

    it('calls signIn.authenticateWithRedirect for Google when mode is signIn', async () => {
      const user = userEvent.setup();
      render(<SocialAuthButtons mode="signIn" />);

      const googleButton = screen.getByRole('button', { name: /google/i });
      await user.click(googleButton);

      expect(mockSignInWithOAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          strategy: 'oauth_google',
        })
      );
    });

    it('calls signIn.authenticateWithRedirect for GitHub when mode is signIn', async () => {
      const user = userEvent.setup();
      render(<SocialAuthButtons mode="signIn" />);

      const githubButton = screen.getByRole('button', { name: /github/i });
      await user.click(githubButton);

      expect(mockSignInWithOAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          strategy: 'oauth_github',
        })
      );
    });

    it('passes redirectUrl to OAuth method', async () => {
      const user = userEvent.setup();
      const redirectUrl = '/dashboard';

      render(<SocialAuthButtons mode="signUp" redirectUrl={redirectUrl} />);

      const googleButton = screen.getByRole('button', { name: /google/i });
      await user.click(googleButton);

      expect(mockSignUpWithOAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          redirectUrl,
        })
      );
    });

    it('passes redirectUrlComplete to OAuth method', async () => {
      const user = userEvent.setup();
      const redirectUrlComplete = '/onboarding';

      render(<SocialAuthButtons mode="signUp" redirectUrlComplete={redirectUrlComplete} />);

      const googleButton = screen.getByRole('button', { name: /google/i });
      await user.click(googleButton);

      expect(mockSignUpWithOAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          redirectUrlComplete,
        })
      );
    });

    it('calls onOAuthStart callback when OAuth is initiated', async () => {
      const user = userEvent.setup();
      const onOAuthStart = vi.fn();

      render(<SocialAuthButtons mode="signUp" onOAuthStart={onOAuthStart} />);

      const googleButton = screen.getByRole('button', { name: /google/i });
      await user.click(googleButton);

      expect(onOAuthStart).toHaveBeenCalledWith('google');
    });
  });

  describe('Loading States', () => {
    it('shows loading spinner when Google OAuth is in progress', async () => {
      const user = userEvent.setup();

      // Make the OAuth call hang
      mockSignUpWithOAuth.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<SocialAuthButtons mode="signUp" />);

      const googleButton = screen.getByRole('button', { name: /google/i });
      await user.click(googleButton);

      // Should show loading state
      await waitFor(() => {
        expect(screen.getByTestId('google-loading')).toBeInTheDocument();
      });
    });

    it('shows loading spinner when GitHub OAuth is in progress', async () => {
      const user = userEvent.setup();

      mockSignUpWithOAuth.mockImplementation(
        () => new Promise(() => {})
      );

      render(<SocialAuthButtons mode="signUp" />);

      const githubButton = screen.getByRole('button', { name: /github/i });
      await user.click(githubButton);

      await waitFor(() => {
        expect(screen.getByTestId('github-loading')).toBeInTheDocument();
      });
    });

    it('disables Google button during loading', async () => {
      const user = userEvent.setup();

      mockSignUpWithOAuth.mockImplementation(
        () => new Promise(() => {})
      );

      render(<SocialAuthButtons mode="signUp" />);

      const googleButton = screen.getByRole('button', { name: /google/i });
      await user.click(googleButton);

      await waitFor(() => {
        expect(googleButton).toBeDisabled();
      });
    });

    it('disables GitHub button during loading', async () => {
      const user = userEvent.setup();

      mockSignUpWithOAuth.mockImplementation(
        () => new Promise(() => {})
      );

      render(<SocialAuthButtons mode="signUp" />);

      const githubButton = screen.getByRole('button', { name: /github/i });
      await user.click(githubButton);

      await waitFor(() => {
        expect(githubButton).toBeDisabled();
      });
    });

    it('disables both buttons when one is loading', async () => {
      const user = userEvent.setup();

      mockSignUpWithOAuth.mockImplementation(
        () => new Promise(() => {})
      );

      render(<SocialAuthButtons mode="signUp" />);

      const googleButton = screen.getByRole('button', { name: /google/i });
      const githubButton = screen.getByRole('button', { name: /github/i });

      await user.click(googleButton);

      await waitFor(() => {
        expect(googleButton).toBeDisabled();
        expect(githubButton).toBeDisabled();
      });
    });

    it('replaces button text with spinner during loading', async () => {
      const user = userEvent.setup();

      mockSignUpWithOAuth.mockImplementation(
        () => new Promise(() => {})
      );

      render(<SocialAuthButtons mode="signUp" />);

      const googleButton = screen.getByRole('button', { name: /google/i });
      await user.click(googleButton);

      await waitFor(() => {
        const spinner = screen.getByTestId('google-loading');
        expect(spinner).toBeInTheDocument();
      });
    });

    it('shows loading prop passed externally', () => {
      render(<SocialAuthButtons mode="signUp" isLoading />);

      const googleButton = screen.getByRole('button', { name: /google/i });
      const githubButton = screen.getByRole('button', { name: /github/i });

      expect(googleButton).toBeDisabled();
      expect(githubButton).toBeDisabled();
    });
  });

  describe('Error States', () => {
    it('displays error message when OAuth fails', async () => {
      const user = userEvent.setup();
      const errorMessage = 'OAuth failed: User cancelled';

      mockSignUpWithOAuth.mockRejectedValueOnce(new Error(errorMessage));

      render(<SocialAuthButtons mode="signUp" />);

      const googleButton = screen.getByRole('button', { name: /google/i });
      await user.click(googleButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText(/oauth failed/i)).toBeInTheDocument();
      });
    });

    it('calls onError callback when OAuth fails', async () => {
      const user = userEvent.setup();
      const onError = vi.fn();
      const error = new Error('OAuth failed');

      mockSignUpWithOAuth.mockRejectedValueOnce(error);

      render(<SocialAuthButtons mode="signUp" onError={onError} />);

      const googleButton = screen.getByRole('button', { name: /google/i });
      await user.click(googleButton);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(error, 'google');
      });
    });

    it('displays passed error prop', () => {
      const errorMessage = 'Authentication failed';

      render(<SocialAuthButtons mode="signUp" error={errorMessage} />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('error message has accessible role', () => {
      render(<SocialAuthButtons mode="signUp" error="Test error" />);

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('clears error when user clicks a button', async () => {
      const user = userEvent.setup();

      mockSignUpWithOAuth.mockRejectedValueOnce(new Error('First error'));

      render(<SocialAuthButtons mode="signUp" />);

      const googleButton = screen.getByRole('button', { name: /google/i });
      await user.click(googleButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      // Simulate clicking again (should clear error)
      mockSignUpWithOAuth.mockResolvedValueOnce(undefined);
      await user.click(googleButton);

      // Error should be cleared while loading
      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('Google button has aria-label', () => {
      render(<SocialAuthButtons mode="signUp" />);

      const googleButton = screen.getByRole('button', { name: /google/i });
      expect(googleButton).toHaveAccessibleName();
    });

    it('GitHub button has aria-label', () => {
      render(<SocialAuthButtons mode="signUp" />);

      const githubButton = screen.getByRole('button', { name: /github/i });
      expect(githubButton).toHaveAccessibleName();
    });

    it('buttons have type="button"', () => {
      render(<SocialAuthButtons mode="signUp" />);

      const googleButton = screen.getByRole('button', { name: /google/i });
      const githubButton = screen.getByRole('button', { name: /github/i });

      expect(googleButton).toHaveAttribute('type', 'button');
      expect(githubButton).toHaveAttribute('type', 'button');
    });

    it('loading state is announced to screen readers', async () => {
      const user = userEvent.setup();

      mockSignUpWithOAuth.mockImplementation(
        () => new Promise(() => {})
      );

      render(<SocialAuthButtons mode="signUp" />);

      const googleButton = screen.getByRole('button', { name: /google/i });
      await user.click(googleButton);

      await waitFor(() => {
        // Button should have aria-busy or loading indicator should have aria-live
        expect(googleButton).toHaveAttribute('aria-busy', 'true');
      });
    });

    it('disabled state is announced to screen readers', () => {
      render(<SocialAuthButtons mode="signUp" isLoading />);

      const googleButton = screen.getByRole('button', { name: /google/i });
      expect(googleButton).toHaveAttribute('aria-disabled', 'true');
    });

    it('icons have aria-hidden', () => {
      render(<SocialAuthButtons mode="signUp" />);

      const googleIcon = screen.getByTestId('google-icon');
      const githubIcon = screen.getByTestId('github-icon');

      expect(googleIcon).toHaveAttribute('aria-hidden', 'true');
      expect(githubIcon).toHaveAttribute('aria-hidden', 'true');
    });

    it('supports keyboard activation with Enter', async () => {
      const user = userEvent.setup();
      render(<SocialAuthButtons mode="signUp" />);

      const googleButton = screen.getByRole('button', { name: /google/i });

      // Focus and press Enter
      googleButton.focus();
      await user.keyboard('{Enter}');

      expect(mockSignUpWithOAuth).toHaveBeenCalled();
    });

    it('supports keyboard activation with Space', async () => {
      const user = userEvent.setup();
      render(<SocialAuthButtons mode="signUp" />);

      const githubButton = screen.getByRole('button', { name: /github/i });

      // Focus and press Space
      githubButton.focus();
      await user.keyboard(' ');

      expect(mockSignUpWithOAuth).toHaveBeenCalled();
    });

    it('buttons are focusable', () => {
      render(<SocialAuthButtons mode="signUp" />);

      const googleButton = screen.getByRole('button', { name: /google/i });

      // Focus the button
      googleButton.focus();

      expect(document.activeElement).toBe(googleButton);
    });

    it('has visible focus indicator', () => {
      render(<SocialAuthButtons mode="signUp" />);

      const googleButton = screen.getByRole('button', { name: /google/i });

      // Should have focus ring classes
      expect(googleButton).toHaveClass('focus:ring-2');
      expect(googleButton).toHaveClass('focus:ring-primary/50');
    });
  });

  describe('Provider Configuration', () => {
    it('renders only specified providers', () => {
      render(<SocialAuthButtons mode="signUp" providers={['google']} />);

      expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /github/i })).not.toBeInTheDocument();
    });

    it('renders providers in specified order', () => {
      render(<SocialAuthButtons mode="signUp" providers={['github', 'google']} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveTextContent(/github/i);
      expect(buttons[1]).toHaveTextContent(/google/i);
    });

    it('renders default providers (google, github) when not specified', () => {
      render(<SocialAuthButtons mode="signUp" />);

      expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /github/i })).toBeInTheDocument();
    });
  });

  describe('Integration with Clerk', () => {
    it('does not render buttons when Clerk is not loaded', () => {
      // Set Clerk to not loaded state
      mockIsLoaded = false;

      render(<SocialAuthButtons mode="signUp" />);

      // Should show loading skeleton or nothing
      expect(screen.queryByRole('button', { name: /google/i })).not.toBeInTheDocument();
      expect(screen.getByTestId('social-auth-loading')).toBeInTheDocument();
    });
  });
});

/**
 * SocialAuthButton (individual button) Tests
 */
describe('SocialAuthButton', () => {
  // Individual button component tests if implemented separately
  it.todo('renders with provider-specific icon');
  it.todo('handles loading state');
  it.todo('handles disabled state');
  it.todo('handles click handler');
});
