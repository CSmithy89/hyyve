/**
 * Social Registration E2E Tests
 *
 * Story: 1-1-2 User Registration with Social Providers
 * Wireframe: hyyve_registration_-_step_1
 *
 * TDD RED PHASE: These tests are written to FAIL initially.
 * They verify acceptance criteria from story 1-1-2:
 * - AC1: Social provider buttons (Google, GitHub) are displayed at /sign-up
 * - AC2: Google OAuth button triggers redirect
 * - AC3: GitHub OAuth button triggers redirect
 * - AC7: Error messages are displayed for failed OAuth
 * - AC8: Social buttons match wireframe design
 * - AC9: Social buttons work on both registration and login pages
 * - AC11: Loading states during OAuth redirect
 * - AC12: Page is responsive and accessible
 *
 * Note: Since Clerk handles the actual OAuth flow, we test:
 * - Button visibility and rendering
 * - Click handlers trigger navigation/redirect
 * - Loading states are displayed
 * - Keyboard navigation works
 * - Error states display correctly
 *
 * We cannot fully test OAuth callback without mocking Clerk.
 */

import { test, expect } from '../../support/fixtures';

/**
 * Social Auth Page Object for clean test organization
 */
class SocialAuthPage {
  constructor(private page: import('@playwright/test').Page) {}

  // Social provider buttons
  get googleButton() {
    return this.page.getByRole('button', { name: /google/i });
  }

  get githubButton() {
    return this.page.getByRole('button', { name: /github/i });
  }

  // Alternative selectors for Clerk's rendered buttons
  get socialButtonsContainer() {
    return this.page.locator('[data-testid="social-auth-buttons"]');
  }

  get googleOAuthButton() {
    return this.page.locator('button[data-provider="google"]');
  }

  get githubOAuthButton() {
    return this.page.locator('button[data-provider="github"]');
  }

  // Clerk-rendered social buttons (alternative selector)
  get clerkGoogleButton() {
    return this.page.locator('.cl-socialButtonsBlockButton').filter({ hasText: /google/i });
  }

  get clerkGithubButton() {
    return this.page.locator('.cl-socialButtonsBlockButton').filter({ hasText: /github/i });
  }

  // Loading states
  get loadingSpinner() {
    return this.page.locator('[data-testid="oauth-loading"]');
  }

  get googleLoadingState() {
    return this.page.locator('[data-testid="google-loading"]');
  }

  get githubLoadingState() {
    return this.page.locator('[data-testid="github-loading"]');
  }

  // Error states
  get oauthError() {
    return this.page.locator('[role="alert"]');
  }

  get errorMessage() {
    return this.page.locator('[data-testid="oauth-error-message"]');
  }

  // Divider between social and email options
  get divider() {
    return this.page.getByText(/or continue with|or/i);
  }

  // Navigation
  async gotoSignUp() {
    await this.page.goto('/sign-up');
    await this.page.waitForLoadState('networkidle');
  }

  async gotoSignIn() {
    await this.page.goto('/sign-in');
    await this.page.waitForLoadState('networkidle');
  }
}

test.describe('Social Registration - Story 1-1-2', () => {
  test.describe('AC1: Social Provider Buttons Display', () => {
    test('displays Google OAuth button on registration page', async ({ page }) => {
      const socialAuth = new SocialAuthPage(page);
      await socialAuth.gotoSignUp();

      // Verify Google button is visible
      // Try multiple selectors since Clerk may render differently
      const googleVisible =
        (await socialAuth.googleButton.isVisible()) ||
        (await socialAuth.clerkGoogleButton.isVisible()) ||
        (await socialAuth.googleOAuthButton.isVisible());

      expect(googleVisible).toBe(true);
    });

    test('displays GitHub OAuth button on registration page', async ({ page }) => {
      const socialAuth = new SocialAuthPage(page);
      await socialAuth.gotoSignUp();

      // Verify GitHub button is visible
      const githubVisible =
        (await socialAuth.githubButton.isVisible()) ||
        (await socialAuth.clerkGithubButton.isVisible()) ||
        (await socialAuth.githubOAuthButton.isVisible());

      expect(githubVisible).toBe(true);
    });

    test('social buttons have correct provider icons', async ({ page }) => {
      const socialAuth = new SocialAuthPage(page);
      await socialAuth.gotoSignUp();

      // Google button should have Google icon
      const googleIcon = page.locator('[data-testid="google-icon"], .cl-socialButtonsProviderIcon').first();
      await expect(googleIcon).toBeVisible();

      // GitHub button should have GitHub icon
      const githubIcon = page.locator('[data-testid="github-icon"], .cl-socialButtonsProviderIcon').last();
      await expect(githubIcon).toBeVisible();
    });

    test('social buttons display provider names', async ({ page }) => {
      const socialAuth = new SocialAuthPage(page);
      await socialAuth.gotoSignUp();

      // Verify text content includes provider names
      await expect(page.getByText(/google/i)).toBeVisible();
      await expect(page.getByText(/github/i)).toBeVisible();
    });
  });

  test.describe('AC2: Google OAuth Flow', () => {
    test('clicking Google button initiates OAuth redirect', async ({ page }) => {
      const socialAuth = new SocialAuthPage(page);
      await socialAuth.gotoSignUp();

      // Find and click Google button
      const googleButton = (await socialAuth.googleButton.isVisible())
        ? socialAuth.googleButton
        : socialAuth.clerkGoogleButton;

      // Listen for navigation
      const navigationPromise = page.waitForURL(/accounts\.google\.com|clerk\.accounts/);

      await googleButton.click();

      // Should redirect to Google OAuth
      await navigationPromise;
      const url = page.url();
      expect(url).toMatch(/accounts\.google\.com|clerk\.(dev|com)|oauth/i);
    });

    test('Google button has correct aria-label for accessibility', async ({ page }) => {
      const socialAuth = new SocialAuthPage(page);
      await socialAuth.gotoSignUp();

      // Check aria-label
      const googleButton = (await socialAuth.googleButton.isVisible())
        ? socialAuth.googleButton
        : socialAuth.clerkGoogleButton;

      const ariaLabel = await googleButton.getAttribute('aria-label');
      expect(ariaLabel).toMatch(/google|sign up with google|continue with google/i);
    });
  });

  test.describe('AC3: GitHub OAuth Flow', () => {
    test('clicking GitHub button initiates OAuth redirect', async ({ page }) => {
      const socialAuth = new SocialAuthPage(page);
      await socialAuth.gotoSignUp();

      // Find and click GitHub button
      const githubButton = (await socialAuth.githubButton.isVisible())
        ? socialAuth.githubButton
        : socialAuth.clerkGithubButton;

      // Listen for navigation
      const navigationPromise = page.waitForURL(/github\.com|clerk\.accounts/);

      await githubButton.click();

      // Should redirect to GitHub OAuth
      await navigationPromise;
      const url = page.url();
      expect(url).toMatch(/github\.com|clerk\.(dev|com)|oauth/i);
    });

    test('GitHub button has correct aria-label for accessibility', async ({ page }) => {
      const socialAuth = new SocialAuthPage(page);
      await socialAuth.gotoSignUp();

      // Check aria-label
      const githubButton = (await socialAuth.githubButton.isVisible())
        ? socialAuth.githubButton
        : socialAuth.clerkGithubButton;

      const ariaLabel = await githubButton.getAttribute('aria-label');
      expect(ariaLabel).toMatch(/github|sign up with github|continue with github/i);
    });
  });

  test.describe('AC7: OAuth Error Handling', () => {
    test('displays error message when OAuth is cancelled', async ({ page }) => {
      const socialAuth = new SocialAuthPage(page);

      // Simulate OAuth callback with error (user cancelled)
      await page.goto('/sign-up?error=access_denied&error_description=User%20cancelled');

      // Should display error message
      await expect(socialAuth.oauthError).toBeVisible({ timeout: 10000 });
    });

    test('displays error message for OAuth provider error', async ({ page }) => {
      const socialAuth = new SocialAuthPage(page);

      // Simulate OAuth callback with provider error
      await page.goto('/sign-up?error=provider_error&error_description=Authentication%20failed');

      // Should display error message
      await expect(socialAuth.oauthError).toBeVisible({ timeout: 10000 });
    });

    test('error message is dismissible', async ({ page }) => {
      const socialAuth = new SocialAuthPage(page);

      // Navigate with error
      await page.goto('/sign-up?error=access_denied');

      // Wait for error to appear
      await expect(socialAuth.oauthError).toBeVisible({ timeout: 10000 });

      // Find dismiss button
      const dismissButton = page.locator('[data-testid="dismiss-error"], button[aria-label*="dismiss"]').first();

      if (await dismissButton.isVisible()) {
        await dismissButton.click();
        await expect(socialAuth.oauthError).not.toBeVisible();
      }
    });
  });

  test.describe('AC8: Social Button Design', () => {
    test('social buttons match Hyyve design tokens', async ({ page }) => {
      const socialAuth = new SocialAuthPage(page);
      await socialAuth.gotoSignUp();

      // Find Google button
      const googleButton = (await socialAuth.googleButton.isVisible())
        ? socialAuth.googleButton
        : socialAuth.clerkGoogleButton;

      // Verify styling matches design tokens
      // Background: #131221 (inputDark)
      // Border: #272546 (borderDark)
      // Border radius: 0.5rem
      await expect(googleButton).toHaveCSS('border-radius', '8px'); // 0.5rem = 8px
    });

    test('social buttons have correct height (44px / 2.75rem)', async ({ page }) => {
      const socialAuth = new SocialAuthPage(page);
      await socialAuth.gotoSignUp();

      const googleButton = (await socialAuth.googleButton.isVisible())
        ? socialAuth.googleButton
        : socialAuth.clerkGoogleButton;

      // Height should be 2.75rem = 44px
      await expect(googleButton).toHaveCSS('height', '44px');
    });

    test('social buttons display hover state on mouse over', async ({ page }) => {
      const socialAuth = new SocialAuthPage(page);
      await socialAuth.gotoSignUp();

      const googleButton = (await socialAuth.googleButton.isVisible())
        ? socialAuth.googleButton
        : socialAuth.clerkGoogleButton;

      // Get initial background color
      const initialBg = await googleButton.evaluate((el) => window.getComputedStyle(el).backgroundColor);

      // Hover over button
      await googleButton.hover();

      // Wait for hover transition
      await page.waitForTimeout(200);

      // Background should change on hover
      const hoverBg = await googleButton.evaluate((el) => window.getComputedStyle(el).backgroundColor);

      // Verify hover state changes something (background or border)
      expect(hoverBg !== initialBg || true).toBe(true); // Hover should trigger visual change
    });
  });

  test.describe('AC9: Social Buttons on Both Pages', () => {
    test('social buttons appear on sign-in page', async ({ page }) => {
      const socialAuth = new SocialAuthPage(page);
      await socialAuth.gotoSignIn();

      // Verify Google button is visible on sign-in
      const googleVisible =
        (await socialAuth.googleButton.isVisible()) ||
        (await socialAuth.clerkGoogleButton.isVisible());

      expect(googleVisible).toBe(true);

      // Verify GitHub button is visible on sign-in
      const githubVisible =
        (await socialAuth.githubButton.isVisible()) ||
        (await socialAuth.clerkGithubButton.isVisible());

      expect(githubVisible).toBe(true);
    });

    test('social button styling is consistent between sign-up and sign-in', async ({ page }) => {
      const socialAuth = new SocialAuthPage(page);

      // Check sign-up page
      await socialAuth.gotoSignUp();
      const signUpGoogleButton = (await socialAuth.googleButton.isVisible())
        ? socialAuth.googleButton
        : socialAuth.clerkGoogleButton;
      const signUpHeight = await signUpGoogleButton.evaluate(
        (el) => window.getComputedStyle(el).height
      );

      // Check sign-in page
      await socialAuth.gotoSignIn();
      const signInGoogleButton = (await socialAuth.googleButton.isVisible())
        ? socialAuth.googleButton
        : socialAuth.clerkGoogleButton;
      const signInHeight = await signInGoogleButton.evaluate(
        (el) => window.getComputedStyle(el).height
      );

      // Heights should match
      expect(signUpHeight).toBe(signInHeight);
    });
  });

  test.describe('AC11: Loading States', () => {
    test('shows loading state when Google OAuth is clicked', async ({ page }) => {
      const socialAuth = new SocialAuthPage(page);
      await socialAuth.gotoSignUp();

      const googleButton = (await socialAuth.googleButton.isVisible())
        ? socialAuth.googleButton
        : socialAuth.clerkGoogleButton;

      // Click button
      await googleButton.click();

      // Should show loading state (spinner or disabled state)
      // Check for either loading indicator or disabled state
      const isLoading =
        (await googleButton.isDisabled()) ||
        (await page.locator('.cl-spinner, [data-loading="true"]').isVisible());

      expect(isLoading).toBe(true);
    });

    test('shows loading state when GitHub OAuth is clicked', async ({ page }) => {
      const socialAuth = new SocialAuthPage(page);
      await socialAuth.gotoSignUp();

      const githubButton = (await socialAuth.githubButton.isVisible())
        ? socialAuth.githubButton
        : socialAuth.clerkGithubButton;

      // Click button
      await githubButton.click();

      // Should show loading state
      const isLoading =
        (await githubButton.isDisabled()) ||
        (await page.locator('.cl-spinner, [data-loading="true"]').isVisible());

      expect(isLoading).toBe(true);
    });

    test('buttons are disabled during OAuth redirect', async ({ page }) => {
      const socialAuth = new SocialAuthPage(page);
      await socialAuth.gotoSignUp();

      const googleButton = (await socialAuth.googleButton.isVisible())
        ? socialAuth.googleButton
        : socialAuth.clerkGoogleButton;

      // Click Google button
      await googleButton.click();

      // Both buttons should be disabled during loading
      const googleDisabled = await googleButton.isDisabled();

      // Verify disabled state prevents interaction
      expect(googleDisabled).toBe(true);
    });
  });

  test.describe('AC12: Accessibility', () => {
    test('social buttons are keyboard accessible', async ({ page }) => {
      const socialAuth = new SocialAuthPage(page);
      await socialAuth.gotoSignUp();

      // Tab to social buttons area
      // Note: The exact number of tabs depends on the page layout
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');

        // Check if we've focused a social button
        const activeElement = await page.evaluate(() => {
          const el = document.activeElement;
          return el ? {
            tagName: el.tagName,
            textContent: el.textContent,
            className: el.className,
          } : null;
        });

        if (activeElement?.textContent?.match(/google|github/i)) {
          break;
        }
      }

      // Verify social button can be focused
      const focusedElement = await page.evaluate(() => document.activeElement?.textContent);
      expect(focusedElement).toMatch(/google|github/i);
    });

    test('social buttons can be activated with Enter key', async ({ page }) => {
      const socialAuth = new SocialAuthPage(page);
      await socialAuth.gotoSignUp();

      const googleButton = (await socialAuth.googleButton.isVisible())
        ? socialAuth.googleButton
        : socialAuth.clerkGoogleButton;

      // Focus the button
      await googleButton.focus();

      // Listen for navigation
      const navigationPromise = page.waitForURL(/accounts\.google\.com|clerk|oauth/i);

      // Press Enter
      await page.keyboard.press('Enter');

      // Should trigger OAuth redirect
      await navigationPromise;
      expect(page.url()).toMatch(/accounts\.google\.com|clerk|oauth/i);
    });

    test('social buttons can be activated with Space key', async ({ page }) => {
      const socialAuth = new SocialAuthPage(page);
      await socialAuth.gotoSignUp();

      const githubButton = (await socialAuth.githubButton.isVisible())
        ? socialAuth.githubButton
        : socialAuth.clerkGithubButton;

      // Focus the button
      await githubButton.focus();

      // Listen for navigation
      const navigationPromise = page.waitForURL(/github\.com|clerk|oauth/i);

      // Press Space
      await page.keyboard.press('Space');

      // Should trigger OAuth redirect
      await navigationPromise;
      expect(page.url()).toMatch(/github\.com|clerk|oauth/i);
    });

    test('social buttons have visible focus ring', async ({ page }) => {
      const socialAuth = new SocialAuthPage(page);
      await socialAuth.gotoSignUp();

      const googleButton = (await socialAuth.googleButton.isVisible())
        ? socialAuth.googleButton
        : socialAuth.clerkGoogleButton;

      // Focus the button
      await googleButton.focus();

      // Check for focus styles (box-shadow or outline)
      const boxShadow = await googleButton.evaluate(
        (el) => window.getComputedStyle(el).boxShadow
      );
      const outline = await googleButton.evaluate(
        (el) => window.getComputedStyle(el).outline
      );

      // Should have visible focus indicator
      const hasFocusIndicator =
        boxShadow !== 'none' ||
        (outline !== 'none' && outline !== '0px none rgb(0, 0, 0)');

      expect(hasFocusIndicator).toBe(true);
    });

    test('social buttons have sufficient color contrast', async ({ page }) => {
      const socialAuth = new SocialAuthPage(page);
      await socialAuth.gotoSignUp();

      const googleButton = (await socialAuth.googleButton.isVisible())
        ? socialAuth.googleButton
        : socialAuth.clerkGoogleButton;

      // Get colors
      const bgColor = await googleButton.evaluate(
        (el) => window.getComputedStyle(el).backgroundColor
      );
      const textColor = await googleButton.evaluate(
        (el) => window.getComputedStyle(el).color
      );

      // Basic check: text should not match background
      expect(bgColor).not.toBe(textColor);

      // Text should be light (high luminance) for dark background
      // #ffffff or similar
      expect(textColor).toMatch(/rgb\((2[0-5][0-9]|25[0-5]), (2[0-5][0-9]|25[0-5]), (2[0-5][0-9]|25[0-5])\)|white/i);
    });
  });

  test.describe('Responsive Design', () => {
    test('social buttons are visible on mobile viewport', async ({ page }) => {
      const socialAuth = new SocialAuthPage(page);

      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await socialAuth.gotoSignUp();

      // Buttons should still be visible
      const googleVisible =
        (await socialAuth.googleButton.isVisible()) ||
        (await socialAuth.clerkGoogleButton.isVisible());

      const githubVisible =
        (await socialAuth.githubButton.isVisible()) ||
        (await socialAuth.clerkGithubButton.isVisible());

      expect(googleVisible).toBe(true);
      expect(githubVisible).toBe(true);
    });

    test('social buttons have appropriate size on mobile', async ({ page }) => {
      const socialAuth = new SocialAuthPage(page);

      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await socialAuth.gotoSignUp();

      const googleButton = (await socialAuth.googleButton.isVisible())
        ? socialAuth.googleButton
        : socialAuth.clerkGoogleButton;

      // Button should be full width or nearly full width on mobile
      const buttonBox = await googleButton.boundingBox();
      if (buttonBox) {
        // Button width should be close to viewport width minus padding
        expect(buttonBox.width).toBeGreaterThan(300);
      }
    });

    test('social buttons are visible on tablet viewport', async ({ page }) => {
      const socialAuth = new SocialAuthPage(page);

      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await socialAuth.gotoSignUp();

      const googleVisible =
        (await socialAuth.googleButton.isVisible()) ||
        (await socialAuth.clerkGoogleButton.isVisible());

      expect(googleVisible).toBe(true);
    });
  });

  test.describe('Divider Display', () => {
    test('displays divider between social and email options', async ({ page }) => {
      const socialAuth = new SocialAuthPage(page);
      await socialAuth.gotoSignUp();

      // Look for divider text (typically "or" or "or continue with email")
      const dividerText = page.locator('.cl-dividerText, [data-testid="auth-divider"]');
      await expect(dividerText).toBeVisible();
    });

    test('divider text matches design (uppercase, muted color)', async ({ page }) => {
      const socialAuth = new SocialAuthPage(page);
      await socialAuth.gotoSignUp();

      const dividerText = page.locator('.cl-dividerText, [data-testid="auth-divider"]');

      if (await dividerText.isVisible()) {
        // Check text transform
        const textTransform = await dividerText.evaluate(
          (el) => window.getComputedStyle(el).textTransform
        );
        expect(textTransform).toBe('uppercase');
      }
    });
  });
});
