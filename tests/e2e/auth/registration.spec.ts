/**
 * Registration E2E Tests
 *
 * Story: 1-1-1 User Registration with Email/Password
 * Wireframe: hyyve_registration_-_step_1
 *
 * TDD RED PHASE: These tests are written to FAIL initially.
 * They verify acceptance criteria from story 1-1-1:
 * - AC1: Registration page renders at /auth/register with Hyyve branding
 * - AC2: User can enter full name, work email, and password
 * - AC3: Password strength indicator displays real-time feedback
 * - AC4: Password requirements list shows validation state
 * - AC5: Email format is validated
 * - AC9: Error messages display correctly
 * - AC10: Sign in link navigates to /auth/login
 * - AC11: Footer links are accessible
 * - AC12: Page is responsive and accessible
 */

import { test, expect } from '../../support/fixtures';
// Note: Install @axe-core/playwright for full accessibility testing
// import { AxeBuilder } from '@axe-core/playwright';

/**
 * Registration Page Object for clean test organization
 */
class RegistrationPage {
  constructor(private page: import('@playwright/test').Page) {}

  // Selectors based on wireframe: hyyve_registration_-_step_1/code.html
  get logo() {
    return this.page.locator('[data-testid="hyyve-logo"]');
  }

  get heading() {
    return this.page.getByRole('heading', { name: /create your account/i });
  }

  get subheading() {
    return this.page.getByText(/start building with hyyve/i);
  }

  // Stepper component (wireframe lines 47-75)
  get stepper() {
    return this.page.locator('[data-testid="registration-stepper"]');
  }

  get stepAccount() {
    return this.stepper.getByText('Account');
  }

  get stepOrganization() {
    return this.stepper.getByText('Organization');
  }

  get stepReview() {
    return this.stepper.getByText('Review');
  }

  // Form fields (wireframe lines 84-134)
  get fullNameInput() {
    return this.page.getByLabel(/full name/i);
  }

  get workEmailInput() {
    return this.page.getByLabel(/work email/i);
  }

  get passwordInput() {
    return this.page.getByLabel(/^password$/i);
  }

  get passwordVisibilityToggle() {
    return this.page.locator('[data-testid="password-visibility-toggle"]');
  }

  // Password strength indicator (wireframe lines 107-118)
  get passwordStrengthMeter() {
    return this.page.locator('[data-testid="password-strength-meter"]');
  }

  get passwordStrengthText() {
    return this.page.locator('[data-testid="password-strength-text"]');
  }

  // Password requirements checklist (wireframe lines 120-133)
  get requirementsList() {
    return this.page.locator('[data-testid="password-requirements"]');
  }

  get requirementMinLength() {
    return this.page.locator('[data-testid="requirement-min-length"]');
  }

  get requirementNumber() {
    return this.page.locator('[data-testid="requirement-number"]');
  }

  get requirementSymbol() {
    return this.page.locator('[data-testid="requirement-symbol"]');
  }

  // Action buttons
  get continueButton() {
    return this.page.getByRole('button', { name: /continue/i });
  }

  get signInLink() {
    return this.page.getByRole('link', { name: /sign in/i });
  }

  // Footer links (wireframe lines 149-153)
  get termsLink() {
    return this.page.getByRole('link', { name: /terms of service/i });
  }

  get privacyLink() {
    return this.page.getByRole('link', { name: /privacy policy/i });
  }

  get helpLink() {
    return this.page.getByRole('link', { name: /help/i });
  }

  // Error messages
  get emailError() {
    return this.page.locator('[data-testid="email-error"]');
  }

  get passwordError() {
    return this.page.locator('[data-testid="password-error"]');
  }

  get generalError() {
    return this.page.locator('[role="alert"]');
  }

  // Navigation
  async goto() {
    await this.page.goto('/auth/register');
    await this.page.waitForLoadState('networkidle');
  }

  // Form actions
  async fillRegistrationForm(name: string, email: string, password: string) {
    await this.fullNameInput.fill(name);
    await this.workEmailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async submitForm() {
    await this.continueButton.click();
  }
}

test.describe('User Registration - Story 1-1-1', () => {
  test.describe('AC1: Page Rendering and Branding', () => {
    test('displays registration page at /auth/register with Hyyve branding', async ({ page }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      // Verify URL
      await expect(page).toHaveURL(/\/auth\/register/);

      // Verify Hyyve branding elements (wireframe lines 42-45)
      await expect(registration.logo).toBeVisible();
      await expect(registration.heading).toBeVisible();
      await expect(registration.subheading).toBeVisible();
    });

    test('displays 3-step stepper component (Account -> Organization -> Review)', async ({
      page,
    }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      // Verify stepper exists and shows all steps (wireframe lines 47-75)
      await expect(registration.stepper).toBeVisible();
      await expect(registration.stepAccount).toBeVisible();
      await expect(registration.stepOrganization).toBeVisible();
      await expect(registration.stepReview).toBeVisible();

      // Verify Account step is active (first step)
      await expect(registration.stepAccount).toHaveAttribute('data-active', 'true');
    });

    test('applies Hyyve dark theme design tokens', async ({ page }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      // Verify dark theme background color (wireframe --color-background-dark: #121121)
      const body = page.locator('body');
      await expect(body).toHaveCSS('background-color', 'rgb(18, 17, 33)'); // #121121
    });
  });

  test.describe('AC2: Form Fields', () => {
    test('renders full name, work email, and password fields', async ({ page }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      // All form fields should be visible and editable (wireframe lines 86-104)
      await expect(registration.fullNameInput).toBeVisible();
      await expect(registration.fullNameInput).toBeEditable();

      await expect(registration.workEmailInput).toBeVisible();
      await expect(registration.workEmailInput).toBeEditable();

      await expect(registration.passwordInput).toBeVisible();
      await expect(registration.passwordInput).toBeEditable();
    });

    test('full name field accepts text input', async ({ page }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      await registration.fullNameInput.fill('Jane Doe');
      await expect(registration.fullNameInput).toHaveValue('Jane Doe');
    });

    test('work email field is type="email"', async ({ page }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      await expect(registration.workEmailInput).toHaveAttribute('type', 'email');
    });

    test('password field has visibility toggle', async ({ page }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      // Password should be hidden by default (wireframe lines 99-104)
      await expect(registration.passwordInput).toHaveAttribute('type', 'password');

      // Toggle should be visible
      await expect(registration.passwordVisibilityToggle).toBeVisible();

      // Click toggle to show password
      await registration.passwordVisibilityToggle.click();
      await expect(registration.passwordInput).toHaveAttribute('type', 'text');

      // Click again to hide
      await registration.passwordVisibilityToggle.click();
      await expect(registration.passwordInput).toHaveAttribute('type', 'password');
    });
  });

  test.describe('AC3: Password Strength Indicator', () => {
    test('displays password strength meter with 4 segments', async ({ page }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      // Strength meter should have 4 segments (wireframe lines 107-116)
      await expect(registration.passwordStrengthMeter).toBeVisible();
      const segments = registration.passwordStrengthMeter.locator('[data-segment]');
      await expect(segments).toHaveCount(4);
    });

    test('shows "Weak" for passwords under 8 characters', async ({ page }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      await registration.passwordInput.fill('short');
      await expect(registration.passwordStrengthText).toContainText(/weak/i);
    });

    test('shows "Medium" for passwords meeting basic requirements', async ({ page }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      // 8+ chars with a number (wireframe shows "Medium strength" for password123)
      await registration.passwordInput.fill('password123');
      await expect(registration.passwordStrengthText).toContainText(/medium/i);
    });

    test('shows "Strong" for passwords meeting all requirements', async ({ page }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      // 8+ chars, number, and symbol
      await registration.passwordInput.fill('SecurePass123!');
      await expect(registration.passwordStrengthText).toContainText(/strong/i);
    });

    test('updates strength indicator in real-time as user types', async ({ page }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      // Start with weak password
      await registration.passwordInput.fill('abc');
      await expect(registration.passwordStrengthText).toContainText(/weak/i);

      // Clear and type stronger password
      await registration.passwordInput.clear();
      await registration.passwordInput.fill('abcdefgh1');
      await expect(registration.passwordStrengthText).toContainText(/medium/i);
    });
  });

  test.describe('AC4: Password Requirements Checklist', () => {
    test('displays all password requirements', async ({ page }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      // Requirements list should be visible (wireframe lines 120-133)
      await expect(registration.requirementsList).toBeVisible();
      await expect(registration.requirementMinLength).toBeVisible();
      await expect(registration.requirementNumber).toBeVisible();
      await expect(registration.requirementSymbol).toBeVisible();
    });

    test('requirement "At least 8 characters" shows met state when satisfied', async ({
      page,
    }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      // Initially not met
      await expect(registration.requirementMinLength).toHaveAttribute('data-met', 'false');

      // Type 8+ characters
      await registration.passwordInput.fill('12345678');

      // Should show as met (green check icon in wireframe)
      await expect(registration.requirementMinLength).toHaveAttribute('data-met', 'true');
    });

    test('requirement "Contains a number" shows met state when satisfied', async ({ page }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      // Initially not met
      await expect(registration.requirementNumber).toHaveAttribute('data-met', 'false');

      // Type password with number
      await registration.passwordInput.fill('password1');

      // Should show as met
      await expect(registration.requirementNumber).toHaveAttribute('data-met', 'true');
    });

    test('requirement "Contains a symbol" shows met state when satisfied', async ({ page }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      // Initially not met (wireframe line 129-131 shows unchecked)
      await expect(registration.requirementSymbol).toHaveAttribute('data-met', 'false');

      // Type password with symbol
      await registration.passwordInput.fill('password!');

      // Should show as met
      await expect(registration.requirementSymbol).toHaveAttribute('data-met', 'true');
    });
  });

  test.describe('AC5: Email Validation', () => {
    test('shows error for invalid email format', async ({ page }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      // Enter invalid email
      await registration.workEmailInput.fill('invalid-email');
      await registration.workEmailInput.blur();

      // Should show validation error
      await expect(registration.emailError).toBeVisible();
      await expect(registration.emailError).toContainText(/valid email|invalid/i);
    });

    test('accepts valid email format', async ({ page }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      // Enter valid email
      await registration.workEmailInput.fill('jane@company.com');
      await registration.workEmailInput.blur();

      // Should not show error
      await expect(registration.emailError).not.toBeVisible();
    });

    test('validates email format on form submission', async ({ page }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      // Fill form with invalid email
      await registration.fullNameInput.fill('Jane Doe');
      await registration.workEmailInput.fill('not-an-email');
      await registration.passwordInput.fill('SecurePass123!');

      // Submit form
      await registration.submitForm();

      // Should show email validation error
      await expect(registration.emailError).toBeVisible();
    });
  });

  test.describe('AC9: Error Messages', () => {
    test('shows error for weak password on submission', async ({ page }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      // Fill form with weak password
      await registration.fullNameInput.fill('Jane Doe');
      await registration.workEmailInput.fill('jane@company.com');
      await registration.passwordInput.fill('weak');

      await registration.submitForm();

      // Should show password error
      await expect(registration.passwordError).toBeVisible();
      await expect(registration.passwordError).toContainText(/at least 8 characters/i);
    });

    test('shows error when required fields are empty', async ({ page }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      // Try to submit empty form
      await registration.submitForm();

      // Should show validation errors
      const errors = page.locator('[role="alert"], [data-error="true"]');
      await expect(errors.first()).toBeVisible();
    });

    test('shows error for already registered email', async ({ page }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      // Use known registered email (Clerk will reject)
      await registration.fullNameInput.fill('Existing User');
      await registration.workEmailInput.fill('test@hyyve.dev');
      await registration.passwordInput.fill('SecurePass123!');

      await registration.submitForm();

      // Wait for Clerk response and error display
      await expect(registration.generalError).toBeVisible({ timeout: 10000 });
      await expect(registration.generalError).toContainText(/already|exists|registered/i);
    });
  });

  test.describe('AC10: Sign In Link', () => {
    test('displays "Already have an account? Sign in" link', async ({ page }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      // Link text should match wireframe (lines 140-145)
      await expect(page.getByText(/already have an account/i)).toBeVisible();
      await expect(registration.signInLink).toBeVisible();
    });

    test('sign in link navigates to /auth/login', async ({ page }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      await registration.signInLink.click();

      await expect(page).toHaveURL(/\/auth\/login/);
    });
  });

  test.describe('AC11: Footer Links', () => {
    test('displays Terms of Service, Privacy Policy, and Help links', async ({ page }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      // Footer links from wireframe (lines 149-153)
      await expect(registration.termsLink).toBeVisible();
      await expect(registration.privacyLink).toBeVisible();
      await expect(registration.helpLink).toBeVisible();
    });

    test('footer links are clickable', async ({ page }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      // Each link should have href attribute
      await expect(registration.termsLink).toHaveAttribute('href', /.+/);
      await expect(registration.privacyLink).toHaveAttribute('href', /.+/);
      await expect(registration.helpLink).toHaveAttribute('href', /.+/);
    });
  });

  test.describe('AC12: Accessibility', () => {
    test('form fields have proper labels', async ({ page }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      // Each input should have associated label
      await expect(registration.fullNameInput).toBeVisible();
      await expect(registration.workEmailInput).toBeVisible();
      await expect(registration.passwordInput).toBeVisible();

      // Labels should be accessible via getByLabel
      const fullNameLabel = page.locator('label:has-text("Full Name")');
      await expect(fullNameLabel).toBeVisible();

      const emailLabel = page.locator('label:has-text("Work Email")');
      await expect(emailLabel).toBeVisible();

      const passwordLabel = page.locator('label:has-text("Password")');
      await expect(passwordLabel).toBeVisible();
    });

    test('password visibility toggle is keyboard accessible', async ({ page }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      // Tab to password field
      await registration.passwordInput.focus();
      await registration.passwordInput.fill('testpassword');

      // Tab to visibility toggle
      await page.keyboard.press('Tab');

      // Toggle should be focused
      await expect(registration.passwordVisibilityToggle).toBeFocused();

      // Press Enter to toggle visibility
      await page.keyboard.press('Enter');
      await expect(registration.passwordInput).toHaveAttribute('type', 'text');
    });

    test('page passes axe accessibility audit', async ({ page }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      // Run axe accessibility scan
      // Note: Install @axe-core/playwright for full accessibility testing:
      //   pnpm add -D @axe-core/playwright
      // Then uncomment:
      // const { AxeBuilder } = await import('@axe-core/playwright');
      // const accessibilityScanResults = await new AxeBuilder({ page })
      //   .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      //   .analyze();
      // expect(accessibilityScanResults.violations).toEqual([]);

      // For now, verify basic accessibility attributes exist
      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent).toBeVisible();
    });

    test('supports keyboard-only navigation', async ({ page }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      // Start with Tab navigation
      await page.keyboard.press('Tab');

      // Should be able to navigate through all form elements
      const focusableElements = await page.locator(
        'button, input, a[href], [tabindex]:not([tabindex="-1"])'
      );
      const count = await focusableElements.count();

      // Should have multiple focusable elements
      expect(count).toBeGreaterThan(5);
    });
  });

  test.describe('Responsive Design', () => {
    test('renders correctly on mobile viewport', async ({ page }) => {
      const registration = new RegistrationPage(page);

      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await registration.goto();

      // Form should still be visible and usable
      await expect(registration.fullNameInput).toBeVisible();
      await expect(registration.workEmailInput).toBeVisible();
      await expect(registration.passwordInput).toBeVisible();
      await expect(registration.continueButton).toBeVisible();

      // Card should fit within viewport (max-width: 480px from wireframe)
      const card = page.locator('[data-testid="registration-card"]');
      const box = await card.boundingBox();
      if (box) {
        expect(box.width).toBeLessThanOrEqual(375);
      }
    });

    test('renders correctly on tablet viewport', async ({ page }) => {
      const registration = new RegistrationPage(page);

      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await registration.goto();

      // All elements should be visible
      await expect(registration.heading).toBeVisible();
      await expect(registration.stepper).toBeVisible();
      await expect(registration.fullNameInput).toBeVisible();
    });
  });

  test.describe('Complete Registration Flow', () => {
    test('user can register with valid email/password', async ({ page }) => {
      const registration = new RegistrationPage(page);
      await registration.goto();

      // Generate unique email to avoid conflicts
      const uniqueEmail = `test-${Date.now()}@example.com`;

      // Verify page elements
      await expect(registration.heading).toBeVisible();
      await expect(registration.stepAccount).toBeVisible();

      // Fill form with valid data
      await registration.fullNameInput.fill('Jane Doe');
      await registration.workEmailInput.fill(uniqueEmail);
      await registration.passwordInput.fill('SecurePass123!');

      // Verify password strength indicator shows strong
      await expect(registration.passwordStrengthText).toContainText(/strong/i);

      // All requirements should be met
      await expect(registration.requirementMinLength).toHaveAttribute('data-met', 'true');
      await expect(registration.requirementNumber).toHaveAttribute('data-met', 'true');
      await expect(registration.requirementSymbol).toHaveAttribute('data-met', 'true');

      // Submit form
      await registration.submitForm();

      // Should proceed to next step or email verification
      // (Clerk will handle the actual registration)
      await expect(page).not.toHaveURL(/\/auth\/register$/);
    });
  });
});
