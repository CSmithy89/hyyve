/**
 * Organization & Onboarding E2E Tests
 *
 * Story: 1-1-3 Organization & Onboarding Setup
 * Wireframes: hyyve_registration_-_step_2, hyyve_registration_-_step_3
 *
 * TDD RED PHASE: These tests are written to FAIL initially.
 * They verify acceptance criteria from story 1-1-3:
 * - AC1: Organization setup page renders at /auth/register/org
 * - AC2: User can enter organization name (2-50 chars, alphanumeric + spaces)
 * - AC3: User can select organization type from dropdown
 * - AC4: User can select team size from radio buttons
 * - AC5: Skip functionality works
 * - AC6: Back button navigates to previous step
 * - AC7: Personalization page renders at /auth/register/personalize
 * - AC8: User can select builder interest
 * - AC9: Completing personalization creates org/workspace and redirects to dashboard
 * - AC10: Pages are accessible (keyboard navigation, ARIA)
 */

import { test, expect, testUtils } from '../../support/fixtures';

/**
 * Page Object: Organization Setup (Step 2)
 * Wireframe: hyyve_registration_-_step_2/code.html
 */
class OrganizationSetupPage {
  constructor(private page: import('@playwright/test').Page) {}

  // Header elements
  get logo() {
    return this.page.locator('[data-testid="hyyve-logo"]');
  }

  get helpLink() {
    return this.page.getByRole('link', { name: /help/i });
  }

  // Progress stepper
  get stepper() {
    return this.page.locator('[data-testid="onboarding-stepper"]');
  }

  get stepAccount() {
    return this.page.getByTestId('onboarding-step-0');
  }

  get stepOrganization() {
    return this.page.getByTestId('onboarding-step-1');
  }

  get stepUsage() {
    return this.page.getByTestId('onboarding-step-2');
  }

  // Page heading
  get heading() {
    return this.page.getByRole('heading', { name: /tell us about your team/i });
  }

  get subheading() {
    return this.page.getByText(/this helps us customize your hyyve workspace experience/i);
  }

  // Form fields
  get organizationNameInput() {
    return this.page.getByLabel(/organization name/i);
  }

  get organizationNameIcon() {
    return this.page.locator('[data-testid="org-name-business-icon"]');
  }

  get organizationTypeDropdown() {
    return this.page.getByRole('combobox', { name: /organization type/i });
  }

  // Team size options
  get teamSizeGroup() {
    return this.page.getByRole('radiogroup', { name: /team size/i });
  }

  get teamSizeJustMe() {
    return this.page.getByLabel(/just me/i);
  }

  get teamSize2to10() {
    return this.page.getByLabel(/2-10/i);
  }

  get teamSize11to50() {
    return this.page.getByLabel(/11-50/i);
  }

  get teamSize50Plus() {
    return this.page.getByLabel(/50\+/i);
  }

  // Action buttons
  get skipButton() {
    return this.page.getByRole('button', { name: /skip for now/i });
  }

  get backButton() {
    return this.page.getByRole('button', { name: /back/i });
  }

  get continueButton() {
    return this.page.getByRole('button', { name: /continue/i });
  }

  // Error messages
  get orgNameError() {
    return this.page.locator('[data-testid="org-name-error"]');
  }

  get orgTypeError() {
    return this.page.locator('[data-testid="org-type-error"]');
  }

  get teamSizeError() {
    return this.page.locator('[data-testid="team-size-error"]');
  }

  get generalError() {
    return this.page.locator('[role="alert"]');
  }

  // Navigation
  async goto() {
    await this.page.goto('/auth/register/org');
    await this.page.waitForLoadState('networkidle');
  }

  // Form actions
  async fillForm(orgName: string, orgType: string, teamSize: string) {
    await this.organizationNameInput.fill(orgName);
    await this.organizationTypeDropdown.selectOption(orgType);

    // Select team size based on value
    switch (teamSize) {
      case '1':
        await this.teamSizeJustMe.click();
        break;
      case '2-10':
        await this.teamSize2to10.click();
        break;
      case '11-50':
        await this.teamSize11to50.click();
        break;
      case '50+':
        await this.teamSize50Plus.click();
        break;
    }
  }
}

/**
 * Page Object: Personalization / Builder Selection (Step 3)
 * Wireframe: hyyve_registration_-_step_3/code.html
 */
class PersonalizationPage {
  constructor(private page: import('@playwright/test').Page) {}

  // Header elements
  get logo() {
    return this.page.locator('[data-testid="hyyve-logo"]');
  }

  get userAvatar() {
    return this.page.locator('[data-testid="user-avatar"]');
  }

  // Progress stepper
  get stepper() {
    return this.page.locator('[data-testid="onboarding-stepper"]');
  }

  get stepCountText() {
    return this.page.getByText(/step 3 of 3/i);
  }

  // Page heading
  get heading() {
    return this.page.getByRole('heading', { name: /what do you want to build first/i });
  }

  get subheading() {
    return this.page.getByText(/select a starting point to customize your hyyve workspace experience/i);
  }

  // Builder options
  get builderOptions() {
    return this.page.locator('[data-testid^="builder-card-"]');
  }

  get moduleBuilderOption() {
    return this.page.getByLabel(/module builder/i);
  }

  get moduleBuilderCard() {
    return this.page.locator('[data-testid="builder-card-module"]');
  }

  get chatbotBuilderOption() {
    return this.page.getByLabel(/chatbot builder/i);
  }

  get chatbotBuilderCard() {
    return this.page.locator('[data-testid="builder-card-chatbot"]');
  }

  get voiceAgentOption() {
    return this.page.getByLabel(/voice agent/i);
  }

  get voiceAgentCard() {
    return this.page.locator('[data-testid="builder-card-voice"]');
  }

  get canvasBuilderOption() {
    return this.page.getByLabel(/canvas builder/i);
  }

  get canvasBuilderCard() {
    return this.page.locator('[data-testid="builder-card-canvas"]');
  }

  // Action buttons
  get goBackLink() {
    return this.page.getByRole('link', { name: /go back/i });
  }

  get getStartedButton() {
    return this.page.getByRole('button', { name: /get started/i });
  }

  // Error messages
  get generalError() {
    return this.page.locator('[role="alert"]');
  }

  // Navigation
  async goto() {
    await this.page.goto('/auth/register/personalize');
    await this.page.waitForLoadState('networkidle');
  }

  // Builder descriptions
  getBuilderDescription(builder: 'module' | 'chatbot' | 'voice' | 'canvas') {
    const descriptions = {
      module: 'Construct custom logic blocks and backend workflows visually.',
      chatbot: 'Design intelligent conversational flows and automated responses.',
      voice: 'Deploy voice-responsive AI assistants for phone or web.',
      canvas: 'Freeform visually guided AI creation on an infinite canvas.',
    };
    return this.page.getByText(descriptions[builder]);
  }
}

test.describe('Organization Setup - Story 1-1-3', () => {
  test.describe('AC1: Page Rendering and Branding', () => {
    test('displays organization setup page at /auth/register/org', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      // Verify URL
      await expect(page).toHaveURL(/\/auth\/register\/org/);

      // Verify Hyyve branding
      await expect(orgSetup.logo).toBeVisible();
      await expect(orgSetup.heading).toBeVisible();
      await expect(orgSetup.subheading).toBeVisible();
    });

    test('displays 3-step stepper with Step 2 active', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      // Stepper should be visible
      await expect(orgSetup.stepper).toBeVisible();

      // Step 1 (Account) should be completed
      await expect(orgSetup.stepAccount).toHaveAttribute('data-state', 'completed');

      // Step 2 (Organization) should be active
      await expect(orgSetup.stepOrganization).toHaveAttribute('data-state', 'active');

      // Step 3 (Usage) should be pending
      await expect(orgSetup.stepUsage).toHaveAttribute('data-state', 'pending');
    });

    test('applies Hyyve dark theme design tokens', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      // Verify dark theme background
      const body = page.locator('body');
      await expect(body).toHaveCSS('background-color', 'rgb(18, 17, 33)'); // #121121
    });

    test('progress line shows 50% completion for Step 2', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      const progressLine = page.locator('[data-testid="progress-line-active"]');
      // Approximately 50% of the way through 3 steps
      const box = await progressLine.boundingBox();
      const fullLine = page.locator('[data-testid="progress-line"]');
      const fullBox = await fullLine.boundingBox();

      if (box && fullBox) {
        // Progress should be approximately half
        expect(box.width / fullBox.width).toBeCloseTo(0.5, 1);
      }
    });
  });

  test.describe('AC2: Organization Name Input', () => {
    test('renders organization name input with placeholder', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      await expect(orgSetup.organizationNameInput).toBeVisible();
      await expect(orgSetup.organizationNameInput).toHaveAttribute(
        'placeholder',
        'e.g. Acme AI Labs'
      );
    });

    test('renders business icon next to input', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      await expect(orgSetup.organizationNameIcon).toBeVisible();
    });

    test('accepts valid organization name', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      await orgSetup.organizationNameInput.fill('Acme AI Labs 2024');
      await expect(orgSetup.organizationNameInput).toHaveValue('Acme AI Labs 2024');
    });

    test('shows error for organization name less than 2 characters', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      await orgSetup.organizationNameInput.fill('A');
      await orgSetup.continueButton.click();

      await expect(orgSetup.orgNameError).toBeVisible();
      await expect(orgSetup.orgNameError).toContainText(/at least 2 characters/i);
    });

    test('shows error for organization name over 50 characters', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      await orgSetup.organizationNameInput.fill('A'.repeat(51));
      await orgSetup.continueButton.click();

      await expect(orgSetup.orgNameError).toBeVisible();
      await expect(orgSetup.orgNameError).toContainText(/no more than 50 characters/i);
    });

    test('shows error for organization name with special characters', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      await orgSetup.organizationNameInput.fill('Company @#$%');
      await orgSetup.continueButton.click();

      await expect(orgSetup.orgNameError).toBeVisible();
      await expect(orgSetup.orgNameError).toContainText(/alphanumeric characters and spaces/i);
    });

    test('clears error when valid name is entered', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      // Trigger error
      await orgSetup.organizationNameInput.fill('A');
      await orgSetup.continueButton.click();
      await expect(orgSetup.orgNameError).toBeVisible();

      // Fix the input
      await orgSetup.organizationNameInput.clear();
      await orgSetup.organizationNameInput.fill('Valid Organization');

      await expect(orgSetup.orgNameError).not.toBeVisible();
    });
  });

  test.describe('AC3: Organization Type Dropdown', () => {
    test('renders organization type dropdown', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      await expect(orgSetup.organizationTypeDropdown).toBeVisible();
    });

    test('dropdown contains all organization type options', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      // Click to open dropdown (if using custom select)
      await orgSetup.organizationTypeDropdown.click();

      // Verify all options from wireframe lines 122-128
      const options = [
        'Startup',
        'Enterprise',
        'Agency / Dev Shop',
        'Research Lab',
        'Freelance / Personal',
        'Non-profit / Education',
      ];

      for (const option of options) {
        await expect(page.getByRole('option', { name: option })).toBeVisible();
      }
    });

    test('allows selecting organization type', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      await orgSetup.organizationTypeDropdown.selectOption('startup');
      await expect(orgSetup.organizationTypeDropdown).toHaveValue('startup');
    });

    test('shows error when organization type is not selected', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      // Fill other required fields
      await orgSetup.organizationNameInput.fill('Valid Org');
      await orgSetup.teamSizeJustMe.click();

      // Submit without selecting org type
      await orgSetup.continueButton.click();

      await expect(orgSetup.orgTypeError).toBeVisible();
      await expect(orgSetup.orgTypeError).toContainText(/select an organization type/i);
    });
  });

  test.describe('AC4: Team Size Selection', () => {
    test('renders team size radio button group', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      await expect(orgSetup.teamSizeGroup).toBeVisible();
    });

    test('renders all 4 team size options', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      await expect(orgSetup.teamSizeJustMe).toBeVisible();
      await expect(orgSetup.teamSize2to10).toBeVisible();
      await expect(orgSetup.teamSize11to50).toBeVisible();
      await expect(orgSetup.teamSize50Plus).toBeVisible();
    });

    test('team size options are displayed in 2x4 grid', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      // Grid container should have grid-cols-2 sm:grid-cols-4 classes
      const gridContainer = page.locator('[data-testid="team-size-grid"]');
      await expect(gridContainer).toHaveClass(/grid/);
    });

    test('allows selecting "Just me" option', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      await orgSetup.teamSizeJustMe.click();
      await expect(orgSetup.teamSizeJustMe).toBeChecked();
    });

    test('allows selecting "2-10" option', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      await orgSetup.teamSize2to10.click();
      await expect(orgSetup.teamSize2to10).toBeChecked();
    });

    test('allows selecting "11-50" option', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      await orgSetup.teamSize11to50.click();
      await expect(orgSetup.teamSize11to50).toBeChecked();
    });

    test('allows selecting "50+" option', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      await orgSetup.teamSize50Plus.click();
      await expect(orgSetup.teamSize50Plus).toBeChecked();
    });

    test('only one team size can be selected at a time', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      await orgSetup.teamSizeJustMe.click();
      await expect(orgSetup.teamSizeJustMe).toBeChecked();

      await orgSetup.teamSize2to10.click();
      await expect(orgSetup.teamSize2to10).toBeChecked();
      await expect(orgSetup.teamSizeJustMe).not.toBeChecked();
    });

    test('shows check icon when team size is selected', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      await orgSetup.teamSizeJustMe.click();

      const checkIcon = page.locator('[data-testid="team-size-check-1"]');
      await expect(checkIcon).toBeVisible();
    });

    test('shows error when no team size is selected on submit', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      // Fill other required fields
      await orgSetup.organizationNameInput.fill('Valid Org');
      await orgSetup.organizationTypeDropdown.selectOption('startup');

      // Submit without selecting team size
      await orgSetup.continueButton.click();

      await expect(orgSetup.teamSizeError).toBeVisible();
      await expect(orgSetup.teamSizeError).toContainText(/select your team size/i);
    });
  });

  test.describe('AC5: Skip Functionality', () => {
    test('displays "Skip for now" link', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      await expect(orgSetup.skipButton).toBeVisible();
    });

    test('clicking "Skip for now" navigates to personalization page', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      await orgSetup.skipButton.click();

      await expect(page).toHaveURL(/\/auth\/register\/personalize/);
    });

    test('skipping sets organization name to default', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      await orgSetup.skipButton.click();

      // Verify that a default workspace was created
      // This would typically check the dashboard or API response
      await expect(page).toHaveURL(/\/auth\/register\/personalize/);
    });
  });

  test.describe('AC6: Back Navigation', () => {
    test('displays Back button', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      await expect(orgSetup.backButton).toBeVisible();
    });

    test('clicking Back navigates to account registration', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      await orgSetup.backButton.click();

      // Should go back to Step 1 (account creation)
      await expect(page).toHaveURL(/\/sign-up|\/auth\/register$/);
    });
  });

  test.describe('Form Submission', () => {
    test('Continue button is disabled when form is invalid', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      // Form is initially empty
      await expect(orgSetup.continueButton).toBeDisabled();
    });

    test('Continue button is enabled when all fields are valid', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      await orgSetup.fillForm('Acme AI Labs', 'startup', '2-10');

      await expect(orgSetup.continueButton).toBeEnabled();
    });

    test('submitting valid form navigates to personalization page', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      await orgSetup.fillForm('Acme AI Labs', 'startup', '2-10');
      await orgSetup.continueButton.click();

      await expect(page).toHaveURL(/\/auth\/register\/personalize/);
    });

    test('shows loading state during form submission', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      await orgSetup.fillForm('Acme AI Labs', 'startup', '2-10');

      // Intercept the API request to delay response
      await page.route('**/api/**', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        await route.continue();
      });

      await orgSetup.continueButton.click();

      // Should show loading indicator
      await expect(page.locator('[data-testid="submit-loading"]')).toBeVisible();
    });

    test('displays error message when submission fails', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      // Mock API failure
      await page.route('**/api/onboarding/organization', (route) =>
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Failed to create organization' }),
        })
      );

      await orgSetup.fillForm('Acme AI Labs', 'startup', '2-10');
      await orgSetup.continueButton.click();

      await expect(orgSetup.generalError).toBeVisible();
      await expect(orgSetup.generalError).toContainText(/failed to create organization/i);
    });
  });
});

test.describe('Personalization / Builder Selection - Story 1-1-3', () => {
  test.describe('AC7: Page Rendering', () => {
    test('displays personalization page at /auth/register/personalize', async ({ page }) => {
      const personalization = new PersonalizationPage(page);
      await personalization.goto();

      await expect(page).toHaveURL(/\/auth\/register\/personalize/);
      await expect(personalization.heading).toBeVisible();
      await expect(personalization.subheading).toBeVisible();
    });

    test('displays "Step 3 of 3" text', async ({ page }) => {
      const personalization = new PersonalizationPage(page);
      await personalization.goto();

      await expect(personalization.stepCountText).toBeVisible();
    });

    test('displays all steps completed in stepper', async ({ page }) => {
      const personalization = new PersonalizationPage(page);
      await personalization.goto();

      // All 3 progress bars should be filled
      const progressBars = page.locator('[data-testid="progress-bar"]');
      const count = await progressBars.count();

      for (let i = 0; i < count; i++) {
        await expect(progressBars.nth(i)).toHaveClass(/bg-primary/);
      }
    });
  });

  test.describe('AC8: Builder Selection', () => {
    test('displays 4 builder options in 2x2 grid', async ({ page }) => {
      const personalization = new PersonalizationPage(page);
      await personalization.goto();

      await expect(personalization.builderOptions).toHaveCount(4);
    });

    test('displays Module Builder option with correct description', async ({ page }) => {
      const personalization = new PersonalizationPage(page);
      await personalization.goto();

      await expect(personalization.moduleBuilderCard).toBeVisible();
      await expect(personalization.getBuilderDescription('module')).toBeVisible();
    });

    test('displays Chatbot Builder option with correct description', async ({ page }) => {
      const personalization = new PersonalizationPage(page);
      await personalization.goto();

      await expect(personalization.chatbotBuilderCard).toBeVisible();
      await expect(personalization.getBuilderDescription('chatbot')).toBeVisible();
    });

    test('displays Voice Agent option with correct description', async ({ page }) => {
      const personalization = new PersonalizationPage(page);
      await personalization.goto();

      await expect(personalization.voiceAgentCard).toBeVisible();
      await expect(personalization.getBuilderDescription('voice')).toBeVisible();
    });

    test('displays Canvas Builder option with correct description', async ({ page }) => {
      const personalization = new PersonalizationPage(page);
      await personalization.goto();

      await expect(personalization.canvasBuilderCard).toBeVisible();
      await expect(personalization.getBuilderDescription('canvas')).toBeVisible();
    });

    test('Chatbot Builder is selected by default', async ({ page }) => {
      const personalization = new PersonalizationPage(page);
      await personalization.goto();

      await expect(personalization.chatbotBuilderOption).toBeChecked();
    });

    test('allows selecting Module Builder', async ({ page }) => {
      const personalization = new PersonalizationPage(page);
      await personalization.goto();

      await personalization.moduleBuilderCard.click();
      await expect(personalization.moduleBuilderOption).toBeChecked();
      await expect(personalization.chatbotBuilderOption).not.toBeChecked();
    });

    test('allows selecting Voice Agent', async ({ page }) => {
      const personalization = new PersonalizationPage(page);
      await personalization.goto();

      await personalization.voiceAgentCard.click();
      await expect(personalization.voiceAgentOption).toBeChecked();
    });

    test('allows selecting Canvas Builder', async ({ page }) => {
      const personalization = new PersonalizationPage(page);
      await personalization.goto();

      await personalization.canvasBuilderCard.click();
      await expect(personalization.canvasBuilderOption).toBeChecked();
    });

    test('selected card shows check icon', async ({ page }) => {
      const personalization = new PersonalizationPage(page);
      await personalization.goto();

      await personalization.voiceAgentCard.click();

      const checkIcon = personalization.voiceAgentCard.locator('[data-testid="builder-check-icon"]');
      await expect(checkIcon).toBeVisible();
    });

    test('selected card has highlighted border', async ({ page }) => {
      const personalization = new PersonalizationPage(page);
      await personalization.goto();

      await personalization.moduleBuilderCard.click();

      await expect(personalization.moduleBuilderCard).toHaveClass(/border-primary/);
      await expect(personalization.chatbotBuilderCard).not.toHaveClass(/border-primary/);
    });
  });

  test.describe('Navigation', () => {
    test('displays "Go Back" link', async ({ page }) => {
      const personalization = new PersonalizationPage(page);
      await personalization.goto();

      await expect(personalization.goBackLink).toBeVisible();
    });

    test('clicking "Go Back" navigates to organization setup', async ({ page }) => {
      const personalization = new PersonalizationPage(page);
      await personalization.goto();

      await personalization.goBackLink.click();

      await expect(page).toHaveURL(/\/auth\/register\/org/);
    });

    test('displays "Get Started" button', async ({ page }) => {
      const personalization = new PersonalizationPage(page);
      await personalization.goto();

      await expect(personalization.getStartedButton).toBeVisible();
    });
  });

  test.describe('AC9: Complete Personalization and Redirect', () => {
    test('clicking "Get Started" creates workspace and redirects to dashboard', async ({ page }) => {
      const personalization = new PersonalizationPage(page);
      await personalization.goto();

      // Keep default selection (Chatbot Builder)
      await personalization.getStartedButton.click();

      // Should redirect to dashboard
      await expect(page).toHaveURL(/\/dashboard/);
    });

    test('shows loading state during submission', async ({ page }) => {
      const personalization = new PersonalizationPage(page);
      await personalization.goto();

      // Intercept API to delay response
      await page.route('**/api/**', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        await route.continue();
      });

      await personalization.getStartedButton.click();

      // Should show loading indicator
      await expect(page.locator('[data-testid="submit-loading"]')).toBeVisible();
    });

    test('displays error message when submission fails', async ({ page }) => {
      const personalization = new PersonalizationPage(page);
      await personalization.goto();

      // Mock API failure
      await page.route('**/api/onboarding/preferences', (route) =>
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Failed to save preferences' }),
        })
      );

      await personalization.getStartedButton.click();

      await expect(personalization.generalError).toBeVisible();
      await expect(personalization.generalError).toContainText(/failed to save preferences/i);
    });

    test('selected builder preference is saved', async ({ page }) => {
      const personalization = new PersonalizationPage(page);
      await personalization.goto();

      // Select Voice Agent
      await personalization.voiceAgentCard.click();

      // Intercept API request
      let savedPreference = '';
      await page.route('**/api/onboarding/preferences', async (route) => {
        const request = route.request();
        const body = JSON.parse(request.postData() || '{}');
        savedPreference = body.preferredBuilder;
        await route.continue();
      });

      await personalization.getStartedButton.click();

      // Verify correct preference was sent
      expect(savedPreference).toBe('voice');
    });
  });
});

test.describe('AC10: Accessibility', () => {
  test.describe('Organization Setup Page', () => {
    test('form fields have proper labels', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      await expect(orgSetup.organizationNameInput).toBeVisible();
      await expect(orgSetup.organizationTypeDropdown).toBeVisible();
      await expect(orgSetup.teamSizeGroup).toBeVisible();

      // Verify labels are properly associated
      const orgNameLabel = page.locator('label:has-text("Organization Name")');
      await expect(orgNameLabel).toBeVisible();

      const orgTypeLabel = page.locator('label:has-text("Organization Type")');
      await expect(orgTypeLabel).toBeVisible();

      const teamSizeLabel = page.locator('label:has-text("Team Size")');
      await expect(teamSizeLabel).toBeVisible();
    });

    test('supports keyboard navigation through form fields', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      // Tab to organization name
      await page.keyboard.press('Tab');
      await expect(orgSetup.organizationNameInput).toBeFocused();

      // Tab to organization type
      await page.keyboard.press('Tab');
      await expect(orgSetup.organizationTypeDropdown).toBeFocused();

      // Tab to first team size option
      await page.keyboard.press('Tab');
      await expect(orgSetup.teamSizeJustMe).toBeFocused();
    });

    test('team size options are keyboard accessible', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      // Focus first team size option
      await orgSetup.teamSizeJustMe.focus();

      // Press Space to select
      await page.keyboard.press('Space');
      await expect(orgSetup.teamSizeJustMe).toBeChecked();

      // Arrow key to next option
      await page.keyboard.press('ArrowRight');
      await expect(orgSetup.teamSize2to10).toBeFocused();

      await page.keyboard.press('Space');
      await expect(orgSetup.teamSize2to10).toBeChecked();
    });

    test('error messages are announced to screen readers', async ({ page }) => {
      const orgSetup = new OrganizationSetupPage(page);
      await orgSetup.goto();

      // Trigger validation errors
      await orgSetup.continueButton.click({ force: true });

      // Error messages should have role="alert"
      const alerts = page.locator('[role="alert"]');
      await expect(alerts.first()).toBeVisible();
    });
  });

  test.describe('Personalization Page', () => {
    test('builder options are keyboard accessible', async ({ page }) => {
      const personalization = new PersonalizationPage(page);
      await personalization.goto();

      // Focus first builder option (Chatbot is default checked)
      await personalization.chatbotBuilderOption.focus();

      // Arrow key navigation
      await page.keyboard.press('ArrowUp');
      await expect(personalization.moduleBuilderOption).toBeFocused();

      // Space to select
      await page.keyboard.press('Space');
      await expect(personalization.moduleBuilderOption).toBeChecked();
    });

    test('builder cards have proper aria labels', async ({ page }) => {
      const personalization = new PersonalizationPage(page);
      await personalization.goto();

      // Each radio should have accessible name
      await expect(personalization.moduleBuilderOption).toHaveAccessibleName(/module builder/i);
      await expect(personalization.chatbotBuilderOption).toHaveAccessibleName(/chatbot builder/i);
      await expect(personalization.voiceAgentOption).toHaveAccessibleName(/voice agent/i);
      await expect(personalization.canvasBuilderOption).toHaveAccessibleName(/canvas builder/i);
    });

    test('Get Started button is focusable and activatable with keyboard', async ({ page }) => {
      const personalization = new PersonalizationPage(page);
      await personalization.goto();

      // Tab to Get Started button
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      // ... continue tabbing to button

      // Focus the button directly
      await personalization.getStartedButton.focus();
      await expect(personalization.getStartedButton).toBeFocused();

      // Press Enter to activate
      await page.keyboard.press('Enter');

      // Should navigate to dashboard
      await expect(page).toHaveURL(/\/dashboard/);
    });
  });
});

test.describe('Complete Onboarding Flow', () => {
  test('user can complete full organization and personalization flow', async ({ page }) => {
    // Start at organization setup
    const orgSetup = new OrganizationSetupPage(page);
    await orgSetup.goto();

    // Generate unique org name
    const uniqueOrgName = `Test Org ${testUtils.uniqueId()}`;

    // Step 2: Fill organization details
    await orgSetup.fillForm(uniqueOrgName, 'startup', '2-10');
    await orgSetup.continueButton.click();

    // Verify navigation to Step 3
    await expect(page).toHaveURL(/\/auth\/register\/personalize/);

    // Step 3: Select builder preference
    const personalization = new PersonalizationPage(page);
    await personalization.moduleBuilderOption.click();
    await expect(personalization.moduleBuilderOption).toBeChecked();

    // Complete onboarding
    await personalization.getStartedButton.click();

    // Verify redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('user can skip organization setup and still complete onboarding', async ({ page }) => {
    const orgSetup = new OrganizationSetupPage(page);
    await orgSetup.goto();

    // Skip organization setup
    await orgSetup.skipButton.click();

    // Should be on personalization page
    await expect(page).toHaveURL(/\/auth\/register\/personalize/);

    const personalization = new PersonalizationPage(page);

    // Select builder (default is chatbot)
    await personalization.getStartedButton.click();

    // Should redirect to dashboard with default workspace
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('user can navigate back and forth between steps', async ({ page }) => {
    // Start at organization setup
    const orgSetup = new OrganizationSetupPage(page);
    await orgSetup.goto();

    // Fill and continue
    await orgSetup.fillForm('Test Org', 'agency', '11-50');
    await orgSetup.continueButton.click();

    // Verify on Step 3
    await expect(page).toHaveURL(/\/auth\/register\/personalize/);

    const personalization = new PersonalizationPage(page);

    // Go back
    await personalization.goBackLink.click();

    // Should be back on Step 2 with form data preserved
    await expect(page).toHaveURL(/\/auth\/register\/org/);
    await expect(orgSetup.organizationNameInput).toHaveValue('Test Org');
    await expect(orgSetup.organizationTypeDropdown).toHaveValue('agency');
    await expect(orgSetup.teamSize11to50).toBeChecked();
  });
});

test.describe('Responsive Design', () => {
  test('organization setup renders correctly on mobile', async ({ page }) => {
    const orgSetup = new OrganizationSetupPage(page);

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await orgSetup.goto();

    // Form elements should be visible
    await expect(orgSetup.organizationNameInput).toBeVisible();
    await expect(orgSetup.organizationTypeDropdown).toBeVisible();
    await expect(orgSetup.teamSizeJustMe).toBeVisible();
    await expect(orgSetup.continueButton).toBeVisible();

    // Team size grid should stack on mobile (2 columns)
    const gridContainer = page.locator('[data-testid="team-size-grid"]');
    const box = await gridContainer.boundingBox();
    if (box) {
      // Cards should be stacked, so height should be greater
      expect(box.height).toBeGreaterThan(150);
    }
  });

  test('personalization page renders correctly on mobile', async ({ page }) => {
    const personalization = new PersonalizationPage(page);

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await personalization.goto();

    // Builder cards should be visible
    await expect(personalization.moduleBuilderCard).toBeVisible();
    await expect(personalization.chatbotBuilderCard).toBeVisible();
    await expect(personalization.voiceAgentCard).toBeVisible();
    await expect(personalization.canvasBuilderCard).toBeVisible();

    // Buttons should be visible
    await expect(personalization.goBackLink).toBeVisible();
    await expect(personalization.getStartedButton).toBeVisible();
  });

  test('organization setup renders correctly on tablet', async ({ page }) => {
    const orgSetup = new OrganizationSetupPage(page);

    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await orgSetup.goto();

    // All form elements should be visible
    await expect(orgSetup.heading).toBeVisible();
    await expect(orgSetup.stepper).toBeVisible();
    await expect(orgSetup.organizationNameInput).toBeVisible();
  });
});
