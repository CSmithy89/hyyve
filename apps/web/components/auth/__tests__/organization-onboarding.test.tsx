/**
 * Organization & Onboarding Unit Tests
 *
 * Story: 1-1-3 Organization & Onboarding Setup
 * Wireframes: hyyve_registration_-_step_2, hyyve_registration_-_step_3
 *
 * TDD RED PHASE: These tests are written to FAIL initially.
 * They test the organization setup and personalization components
 * that follow user account creation.
 *
 * Tests cover:
 * - OrganizationSetupForm component (Step 2)
 * - BuilderSelectionForm component (Step 3)
 * - OnboardingStepper component
 * - Form validation utilities
 * - Loading and error states
 */

/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

// Components to be implemented (these imports will fail in RED phase)
import {
  OrganizationSetupForm,
  BuilderSelectionForm,
  OnboardingStepper,
} from '../index';
import {
  validateOrganizationName,
  validateOrganizationType,
  validateTeamSize,
  validateBuilderSelection,
} from '../../../lib/validations/onboarding';

// Mock Clerk hooks
const mockUser = {
  id: 'user_test123',
  fullName: 'Jane Doe',
  primaryEmailAddress: {
    emailAddress: 'jane@example.com',
  },
};

vi.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: mockUser,
    isLoaded: true,
  }),
}));

// Mock router
const mockPush = vi.fn();
const mockReplace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}));

// Mock server actions
const mockCreateOrganization = vi.fn();
const mockUpdateUserPreferences = vi.fn();

vi.mock('../../../actions/onboarding', () => ({
  createOrganization: (data: unknown) => mockCreateOrganization(data),
  updateUserPreferences: (data: unknown) => mockUpdateUserPreferences(data),
}));

/**
 * =============================================================================
 * OnboardingStepper Component Tests
 *
 * Wireframe references:
 * - Step 2 (hyyve_registration_-_step_2): lines 64-93
 * - Step 3 (hyyve_registration_-_step_3): lines 87-110
 * =============================================================================
 */
describe('OnboardingStepper', () => {
  const steps = [
    { label: 'Account', description: 'Account Setup' },
    { label: 'Organization', description: 'Workspace' },
    { label: 'Usage', description: 'Personalization' },
  ];

  it('renders all three steps', () => {
    render(<OnboardingStepper currentStep={1} steps={steps} />);

    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByText('Organization')).toBeInTheDocument();
    expect(screen.getByText('Usage')).toBeInTheDocument();
  });

  it('shows step 1 as completed when currentStep is 1 (Organization)', () => {
    render(<OnboardingStepper currentStep={1} steps={steps} />);

    // Step 1 (Account) should show checkmark icon (completed state)
    const step0 = screen.getByTestId('onboarding-step-0');
    expect(step0).toHaveAttribute('data-state', 'completed');
    expect(within(step0).getByTestId('step-check-icon')).toBeInTheDocument();
  });

  it('shows step 2 as active when currentStep is 1', () => {
    render(<OnboardingStepper currentStep={1} steps={steps} />);

    const step1 = screen.getByTestId('onboarding-step-1');
    expect(step1).toHaveAttribute('data-state', 'active');
    expect(within(step1).getByText('2')).toBeInTheDocument();
  });

  it('shows step 3 as pending when currentStep is 1', () => {
    render(<OnboardingStepper currentStep={1} steps={steps} />);

    const step2 = screen.getByTestId('onboarding-step-2');
    expect(step2).toHaveAttribute('data-state', 'pending');
  });

  it('shows all steps completed when currentStep is 2 (final step)', () => {
    render(<OnboardingStepper currentStep={2} steps={steps} />);

    expect(screen.getByTestId('onboarding-step-0')).toHaveAttribute('data-state', 'completed');
    expect(screen.getByTestId('onboarding-step-1')).toHaveAttribute('data-state', 'completed');
    expect(screen.getByTestId('onboarding-step-2')).toHaveAttribute('data-state', 'active');
  });

  it('renders progress line with correct width for step 2 (50%)', () => {
    render(<OnboardingStepper currentStep={1} steps={steps} />);

    const progressLine = screen.getByTestId('progress-line-active');
    // Step 2 is 1/2 of the way = 50%
    expect(progressLine).toHaveStyle({ width: '50%' });
  });

  it('renders progress line at 100% when on final step', () => {
    render(<OnboardingStepper currentStep={2} steps={steps} />);

    const progressLine = screen.getByTestId('progress-line-active');
    expect(progressLine).toHaveStyle({ width: '100%' });
  });

  it('applies correct styling for completed step (green bg)', () => {
    render(<OnboardingStepper currentStep={1} steps={steps} />);

    const completedStep = screen.getByTestId('onboarding-step-0');
    const stepCircle = within(completedStep).getByTestId('step-circle');
    expect(stepCircle).toHaveClass('bg-green-500');
  });

  it('applies correct styling for active step (primary bg)', () => {
    render(<OnboardingStepper currentStep={1} steps={steps} />);

    const activeStep = screen.getByTestId('onboarding-step-1');
    const stepCircle = within(activeStep).getByTestId('step-circle');
    expect(stepCircle).toHaveClass('bg-primary');
  });

  it('applies correct styling for pending step (card-dark bg with opacity)', () => {
    render(<OnboardingStepper currentStep={1} steps={steps} />);

    const pendingStep = screen.getByTestId('onboarding-step-2');
    expect(pendingStep).toHaveClass('opacity-50');
  });

  it('hides step labels on mobile (sm:block)', () => {
    render(<OnboardingStepper currentStep={1} steps={steps} />);

    // Labels should have responsive classes
    const stepLabels = screen.getAllByTestId(/step-label/);
    stepLabels.forEach((label) => {
      expect(label).toHaveClass('hidden', 'sm:block');
    });
  });

  it('shows step count text on Step 3 (wireframe: "Step 3 of 3")', () => {
    render(<OnboardingStepper currentStep={2} steps={steps} showStepCount />);

    expect(screen.getByText(/Step 3 of 3/i)).toBeInTheDocument();
  });
});

/**
 * =============================================================================
 * OrganizationSetupForm Component Tests (Step 2)
 *
 * Wireframe: hyyve_registration_-_step_2/code.html
 * =============================================================================
 */
describe('OrganizationSetupForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateOrganization.mockResolvedValue({ success: true, organizationId: 'org_123' });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Rendering', () => {
    it('renders the form header with correct title and subtitle', () => {
      render(<OrganizationSetupForm />);

      expect(screen.getByRole('heading', { name: /tell us about your team/i })).toBeInTheDocument();
      expect(
        screen.getByText(/this helps us customize your hyyve workspace experience/i)
      ).toBeInTheDocument();
    });

    it('renders organization name input field', () => {
      render(<OrganizationSetupForm />);

      const input = screen.getByLabelText(/organization name/i);
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'e.g. Acme AI Labs');
    });

    it('renders business icon next to organization name input', () => {
      render(<OrganizationSetupForm />);

      expect(screen.getByTestId('org-name-business-icon')).toBeInTheDocument();
    });

    it('renders organization type dropdown', () => {
      render(<OrganizationSetupForm />);

      expect(screen.getByLabelText(/organization type/i)).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: /organization type/i })).toBeInTheDocument();
    });

    it('renders all organization type options in dropdown', () => {
      render(<OrganizationSetupForm />);

      const dropdown = screen.getByRole('combobox', { name: /organization type/i });
      fireEvent.click(dropdown);

      // Wireframe options from lines 122-128
      const expectedOptions = [
        'Startup',
        'Enterprise',
        'Agency / Dev Shop',
        'Research Lab',
        'Freelance / Personal',
        'Non-profit / Education',
      ];

      expectedOptions.forEach((option) => {
        expect(screen.getByRole('option', { name: option })).toBeInTheDocument();
      });
    });

    it('renders team size label', () => {
      render(<OrganizationSetupForm />);

      expect(screen.getByText(/team size/i)).toBeInTheDocument();
    });

    it('renders 4 team size radio options in a grid', () => {
      render(<OrganizationSetupForm />);

      // Wireframe: 2x4 grid (grid-cols-2 sm:grid-cols-4) from lines 140-185
      const teamSizeGroup = screen.getByRole('radiogroup', { name: /team size/i });
      const options = within(teamSizeGroup).getAllByRole('radio');

      expect(options).toHaveLength(4);
    });

    it('renders "Just me" option with person icon', () => {
      render(<OrganizationSetupForm />);

      const justMeOption = screen.getByLabelText(/just me/i);
      expect(justMeOption).toBeInTheDocument();
      expect(justMeOption).toHaveAttribute('value', '1');
      expect(screen.getByTestId('team-size-icon-1')).toBeInTheDocument();
    });

    it('renders "2-10" team size option', () => {
      render(<OrganizationSetupForm />);

      const option = screen.getByLabelText(/2-10/i);
      expect(option).toBeInTheDocument();
      expect(option).toHaveAttribute('value', '2-10');
    });

    it('renders "11-50" team size option', () => {
      render(<OrganizationSetupForm />);

      const option = screen.getByLabelText(/11-50/i);
      expect(option).toBeInTheDocument();
      expect(option).toHaveAttribute('value', '11-50');
    });

    it('renders "50+" team size option', () => {
      render(<OrganizationSetupForm />);

      const option = screen.getByLabelText(/50\+/i);
      expect(option).toBeInTheDocument();
      expect(option).toHaveAttribute('value', '50+');
    });

    it('renders "Skip for now" link', () => {
      render(<OrganizationSetupForm />);

      expect(screen.getByRole('button', { name: /skip for now/i })).toBeInTheDocument();
    });

    it('renders "Back" button', () => {
      render(<OrganizationSetupForm />);

      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    });

    it('renders "Continue" button', () => {
      render(<OrganizationSetupForm />);

      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    });
  });

  describe('Form Interaction', () => {
    it('allows typing in organization name field', async () => {
      const user = userEvent.setup();
      render(<OrganizationSetupForm />);

      const input = screen.getByLabelText(/organization name/i);
      await user.type(input, 'My AI Startup');

      expect(input).toHaveValue('My AI Startup');
    });

    it('allows selecting organization type from dropdown', async () => {
      const user = userEvent.setup();
      render(<OrganizationSetupForm />);

      const dropdown = screen.getByRole('combobox', { name: /organization type/i });
      await user.selectOptions(dropdown, 'startup');

      expect(dropdown).toHaveValue('startup');
    });

    it('allows selecting team size option', async () => {
      const user = userEvent.setup();
      render(<OrganizationSetupForm />);

      const option = screen.getByLabelText(/2-10/i);
      await user.click(option);

      expect(option).toBeChecked();
    });

    it('only allows one team size selection at a time', async () => {
      const user = userEvent.setup();
      render(<OrganizationSetupForm />);

      const justMe = screen.getByLabelText(/just me/i);
      const twoToTen = screen.getByLabelText(/2-10/i);

      await user.click(justMe);
      expect(justMe).toBeChecked();
      expect(twoToTen).not.toBeChecked();

      await user.click(twoToTen);
      expect(justMe).not.toBeChecked();
      expect(twoToTen).toBeChecked();
    });

    it('shows checked circle icon when team size is selected', async () => {
      const user = userEvent.setup();
      render(<OrganizationSetupForm />);

      const option = screen.getByLabelText(/just me/i);
      await user.click(option);

      const checkIcon = screen.getByTestId('team-size-check-1');
      expect(checkIcon).toBeVisible();
    });
  });

  describe('Validation', () => {
    it('shows error for empty organization name on submit', async () => {
      const user = userEvent.setup();
      render(<OrganizationSetupForm />);

      // Select other required fields
      await user.selectOptions(
        screen.getByRole('combobox', { name: /organization type/i }),
        'startup'
      );
      await user.click(screen.getByLabelText(/just me/i));

      // Submit without org name
      await user.click(screen.getByRole('button', { name: /continue/i }));

      expect(screen.getByTestId('org-name-error')).toBeVisible();
      expect(screen.getByTestId('org-name-error')).toHaveTextContent(/organization name is required/i);
    });

    it('shows error for organization name less than 2 characters', async () => {
      const user = userEvent.setup();
      render(<OrganizationSetupForm />);

      const input = screen.getByLabelText(/organization name/i);
      await user.type(input, 'A');
      await user.click(screen.getByRole('button', { name: /continue/i }));

      expect(screen.getByTestId('org-name-error')).toHaveTextContent(/at least 2 characters/i);
    });

    it('shows error for organization name more than 50 characters', async () => {
      const user = userEvent.setup();
      render(<OrganizationSetupForm />);

      const input = screen.getByLabelText(/organization name/i);
      await user.type(input, 'A'.repeat(51));
      await user.click(screen.getByRole('button', { name: /continue/i }));

      expect(screen.getByTestId('org-name-error')).toHaveTextContent(/no more than 50 characters/i);
    });

    it('shows error for invalid characters in organization name', async () => {
      const user = userEvent.setup();
      render(<OrganizationSetupForm />);

      const input = screen.getByLabelText(/organization name/i);
      await user.type(input, 'My Company @#$%');
      await user.click(screen.getByRole('button', { name: /continue/i }));

      expect(screen.getByTestId('org-name-error')).toHaveTextContent(
        /only alphanumeric characters and spaces/i
      );
    });

    it('accepts valid organization name with alphanumeric and spaces', async () => {
      const user = userEvent.setup();
      render(<OrganizationSetupForm />);

      const input = screen.getByLabelText(/organization name/i);
      await user.type(input, 'Acme AI Labs 123');

      // Complete the form
      await user.selectOptions(
        screen.getByRole('combobox', { name: /organization type/i }),
        'startup'
      );
      await user.click(screen.getByLabelText(/just me/i));
      await user.click(screen.getByRole('button', { name: /continue/i }));

      // Should not show org name error
      expect(screen.queryByTestId('org-name-error')).not.toBeInTheDocument();
    });

    it('shows error when organization type is not selected', async () => {
      const user = userEvent.setup();
      render(<OrganizationSetupForm />);

      await user.type(screen.getByLabelText(/organization name/i), 'Valid Org');
      await user.click(screen.getByLabelText(/just me/i));
      await user.click(screen.getByRole('button', { name: /continue/i }));

      expect(screen.getByTestId('org-type-error')).toBeVisible();
      expect(screen.getByTestId('org-type-error')).toHaveTextContent(/select an organization type/i);
    });

    it('shows error when team size is not selected', async () => {
      const user = userEvent.setup();
      render(<OrganizationSetupForm />);

      await user.type(screen.getByLabelText(/organization name/i), 'Valid Org');
      await user.selectOptions(
        screen.getByRole('combobox', { name: /organization type/i }),
        'startup'
      );
      await user.click(screen.getByRole('button', { name: /continue/i }));

      expect(screen.getByTestId('team-size-error')).toBeVisible();
      expect(screen.getByTestId('team-size-error')).toHaveTextContent(/select your team size/i);
    });

    it('clears validation errors when field is corrected', async () => {
      const user = userEvent.setup();
      render(<OrganizationSetupForm />);

      // Submit empty to trigger error
      await user.click(screen.getByRole('button', { name: /continue/i }));
      expect(screen.getByTestId('org-name-error')).toBeVisible();

      // Fix the field
      await user.type(screen.getByLabelText(/organization name/i), 'Valid Org');

      // Error should be cleared
      expect(screen.queryByTestId('org-name-error')).not.toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('calls createOrganization with form data on submit', async () => {
      const user = userEvent.setup();
      render(<OrganizationSetupForm />);

      await user.type(screen.getByLabelText(/organization name/i), 'Acme AI Labs');
      await user.selectOptions(
        screen.getByRole('combobox', { name: /organization type/i }),
        'startup'
      );
      await user.click(screen.getByLabelText(/2-10/i));
      await user.click(screen.getByRole('button', { name: /continue/i }));

      expect(mockCreateOrganization).toHaveBeenCalledWith({
        name: 'Acme AI Labs',
        type: 'startup',
        teamSize: '2-10',
      });
    });

    it('shows loading state during submission', async () => {
      const user = userEvent.setup();
      mockCreateOrganization.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(<OrganizationSetupForm />);

      await user.type(screen.getByLabelText(/organization name/i), 'Acme AI Labs');
      await user.selectOptions(
        screen.getByRole('combobox', { name: /organization type/i }),
        'startup'
      );
      await user.click(screen.getByLabelText(/just me/i));
      await user.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /continue/i })).toBeDisabled();
        expect(screen.getByTestId('submit-loading')).toBeInTheDocument();
      });
    });

    it('disables form fields during submission', async () => {
      const user = userEvent.setup();
      mockCreateOrganization.mockImplementation(() => new Promise(() => {}));

      render(<OrganizationSetupForm />);

      await user.type(screen.getByLabelText(/organization name/i), 'Acme AI Labs');
      await user.selectOptions(
        screen.getByRole('combobox', { name: /organization type/i }),
        'startup'
      );
      await user.click(screen.getByLabelText(/just me/i));
      await user.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(screen.getByLabelText(/organization name/i)).toBeDisabled();
        expect(screen.getByRole('combobox', { name: /organization type/i })).toBeDisabled();
      });
    });

    it('displays error message when submission fails', async () => {
      const user = userEvent.setup();
      mockCreateOrganization.mockRejectedValue(new Error('Failed to create organization'));

      render(<OrganizationSetupForm />);

      await user.type(screen.getByLabelText(/organization name/i), 'Acme AI Labs');
      await user.selectOptions(
        screen.getByRole('combobox', { name: /organization type/i }),
        'startup'
      );
      await user.click(screen.getByLabelText(/just me/i));
      await user.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeVisible();
        expect(screen.getByRole('alert')).toHaveTextContent(/failed to create organization/i);
      });
    });

    it('calls onSuccess callback after successful submission', async () => {
      const user = userEvent.setup();
      const onSuccess = vi.fn();
      mockCreateOrganization.mockResolvedValue({ success: true, organizationId: 'org_456' });

      render(<OrganizationSetupForm onSuccess={onSuccess} />);

      await user.type(screen.getByLabelText(/organization name/i), 'Acme AI Labs');
      await user.selectOptions(
        screen.getByRole('combobox', { name: /organization type/i }),
        'startup'
      );
      await user.click(screen.getByLabelText(/just me/i));
      await user.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith({ organizationId: 'org_456' });
      });
    });
  });

  describe('Navigation', () => {
    it('calls onBack when Back button is clicked', async () => {
      const user = userEvent.setup();
      const onBack = vi.fn();

      render(<OrganizationSetupForm onBack={onBack} />);

      await user.click(screen.getByRole('button', { name: /back/i }));

      expect(onBack).toHaveBeenCalled();
    });

    it('calls onSkip when "Skip for now" is clicked', async () => {
      const user = userEvent.setup();
      const onSkip = vi.fn();

      render(<OrganizationSetupForm onSkip={onSkip} />);

      await user.click(screen.getByRole('button', { name: /skip for now/i }));

      expect(onSkip).toHaveBeenCalled();
    });

    it('navigates to Step 3 after successful submission by default', async () => {
      const user = userEvent.setup();

      render(<OrganizationSetupForm />);

      await user.type(screen.getByLabelText(/organization name/i), 'Acme AI Labs');
      await user.selectOptions(
        screen.getByRole('combobox', { name: /organization type/i }),
        'startup'
      );
      await user.click(screen.getByLabelText(/just me/i));
      await user.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/auth/register/personalize');
      });
    });
  });

  describe('Button States', () => {
    it('disables Continue button when form is invalid', () => {
      render(<OrganizationSetupForm />);

      // Form is initially empty, so Continue should be disabled
      expect(screen.getByRole('button', { name: /continue/i })).toBeDisabled();
    });

    it('enables Continue button when all fields are valid', async () => {
      const user = userEvent.setup();
      render(<OrganizationSetupForm />);

      await user.type(screen.getByLabelText(/organization name/i), 'Acme AI Labs');
      await user.selectOptions(
        screen.getByRole('combobox', { name: /organization type/i }),
        'startup'
      );
      await user.click(screen.getByLabelText(/just me/i));

      expect(screen.getByRole('button', { name: /continue/i })).toBeEnabled();
    });
  });
});

/**
 * =============================================================================
 * BuilderSelectionForm Component Tests (Step 3)
 *
 * Wireframe: hyyve_registration_-_step_3/code.html
 * =============================================================================
 */
describe('BuilderSelectionForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateUserPreferences.mockResolvedValue({ success: true });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Rendering', () => {
    it('renders the page heading', () => {
      render(<BuilderSelectionForm />);

      expect(
        screen.getByRole('heading', { name: /what do you want to build first/i })
      ).toBeInTheDocument();
    });

    it('renders the subtitle text', () => {
      render(<BuilderSelectionForm />);

      expect(
        screen.getByText(/select a starting point to customize your hyyve workspace experience/i)
      ).toBeInTheDocument();
    });

    it('renders 4 builder options in a 2x2 grid', () => {
      render(<BuilderSelectionForm />);

      const options = screen.getAllByRole('radio');
      expect(options).toHaveLength(4);
    });

    it('renders Module Builder option with correct details', () => {
      render(<BuilderSelectionForm />);

      const moduleOption = screen.getByLabelText(/module builder/i);
      expect(moduleOption).toBeInTheDocument();
      expect(moduleOption).toHaveAttribute('value', 'module');

      expect(
        screen.getByText(/construct custom logic blocks and backend workflows visually/i)
      ).toBeInTheDocument();
    });

    it('renders Chatbot Builder option with correct details', () => {
      render(<BuilderSelectionForm />);

      const chatbotOption = screen.getByLabelText(/chatbot builder/i);
      expect(chatbotOption).toBeInTheDocument();
      expect(chatbotOption).toHaveAttribute('value', 'chatbot');

      expect(
        screen.getByText(/design intelligent conversational flows and automated responses/i)
      ).toBeInTheDocument();
    });

    it('renders Voice Agent option with correct details', () => {
      render(<BuilderSelectionForm />);

      const voiceOption = screen.getByLabelText(/voice agent/i);
      expect(voiceOption).toBeInTheDocument();
      expect(voiceOption).toHaveAttribute('value', 'voice');

      expect(
        screen.getByText(/deploy voice-responsive ai assistants for phone or web/i)
      ).toBeInTheDocument();
    });

    it('renders Canvas Builder option with correct details', () => {
      render(<BuilderSelectionForm />);

      const canvasOption = screen.getByLabelText(/canvas builder/i);
      expect(canvasOption).toBeInTheDocument();
      expect(canvasOption).toHaveAttribute('value', 'canvas');

      expect(
        screen.getByText(/freeform visually guided ai creation on an infinite canvas/i)
      ).toBeInTheDocument();
    });

    it('renders icons for each builder option', () => {
      render(<BuilderSelectionForm />);

      expect(screen.getByTestId('builder-icon-module')).toBeInTheDocument();
      expect(screen.getByTestId('builder-icon-chatbot')).toBeInTheDocument();
      expect(screen.getByTestId('builder-icon-voice')).toBeInTheDocument();
      expect(screen.getByTestId('builder-icon-canvas')).toBeInTheDocument();
    });

    it('renders "Go Back" link', () => {
      render(<BuilderSelectionForm />);

      expect(screen.getByRole('link', { name: /go back/i })).toBeInTheDocument();
    });

    it('renders "Get Started" button', () => {
      render(<BuilderSelectionForm />);

      expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
    });
  });

  describe('Default Selection', () => {
    it('has Chatbot Builder selected by default', () => {
      render(<BuilderSelectionForm />);

      const chatbotOption = screen.getByLabelText(/chatbot builder/i);
      expect(chatbotOption).toBeChecked();
    });

    it('shows check icon on default selected option', () => {
      render(<BuilderSelectionForm />);

      const chatbotCard = screen.getByTestId('builder-card-chatbot');
      expect(within(chatbotCard).getByTestId('builder-check-icon')).toBeVisible();
    });
  });

  describe('Selection Behavior', () => {
    it('allows selecting a different builder option', async () => {
      const user = userEvent.setup();
      render(<BuilderSelectionForm />);

      const moduleOption = screen.getByLabelText(/module builder/i);
      await user.click(moduleOption);

      expect(moduleOption).toBeChecked();
      expect(screen.getByLabelText(/chatbot builder/i)).not.toBeChecked();
    });

    it('only allows one selection at a time', async () => {
      const user = userEvent.setup();
      render(<BuilderSelectionForm />);

      // Select each option in sequence
      await user.click(screen.getByLabelText(/module builder/i));
      expect(screen.getByLabelText(/module builder/i)).toBeChecked();

      await user.click(screen.getByLabelText(/voice agent/i));
      expect(screen.getByLabelText(/voice agent/i)).toBeChecked();
      expect(screen.getByLabelText(/module builder/i)).not.toBeChecked();

      await user.click(screen.getByLabelText(/canvas builder/i));
      expect(screen.getByLabelText(/canvas builder/i)).toBeChecked();
      expect(screen.getByLabelText(/voice agent/i)).not.toBeChecked();
    });

    it('updates visual styling when selection changes', async () => {
      const user = userEvent.setup();
      render(<BuilderSelectionForm />);

      const moduleCard = screen.getByTestId('builder-card-module');
      const chatbotCard = screen.getByTestId('builder-card-chatbot');

      // Chatbot should have selected styles by default
      expect(chatbotCard).toHaveClass('border-primary');

      // Select module
      await user.click(screen.getByLabelText(/module builder/i));

      // Module should now have selected styles
      expect(moduleCard).toHaveClass('border-primary');
      // Chatbot should lose selected styles
      expect(chatbotCard).not.toHaveClass('border-primary');
    });

    it('shows check icon on selected card and hides from others', async () => {
      const user = userEvent.setup();
      render(<BuilderSelectionForm />);

      await user.click(screen.getByLabelText(/voice agent/i));

      const voiceCard = screen.getByTestId('builder-card-voice');
      const chatbotCard = screen.getByTestId('builder-card-chatbot');

      expect(within(voiceCard).getByTestId('builder-check-icon')).toBeVisible();
      expect(within(chatbotCard).queryByTestId('builder-check-icon')).not.toBeVisible();
    });
  });

  describe('Form Submission', () => {
    it('calls updateUserPreferences with selected builder on submit', async () => {
      const user = userEvent.setup();
      render(<BuilderSelectionForm />);

      await user.click(screen.getByLabelText(/module builder/i));
      await user.click(screen.getByRole('button', { name: /get started/i }));

      expect(mockUpdateUserPreferences).toHaveBeenCalledWith({
        preferredBuilder: 'module',
      });
    });

    it('shows loading state during submission', async () => {
      const user = userEvent.setup();
      mockUpdateUserPreferences.mockImplementation(() => new Promise(() => {}));

      render(<BuilderSelectionForm />);

      await user.click(screen.getByRole('button', { name: /get started/i }));

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /get started/i });
        expect(button).toBeDisabled();
        expect(screen.getByTestId('submit-loading')).toBeInTheDocument();
      });
    });

    it('disables builder selection during submission', async () => {
      const user = userEvent.setup();
      mockUpdateUserPreferences.mockImplementation(() => new Promise(() => {}));

      render(<BuilderSelectionForm />);

      await user.click(screen.getByRole('button', { name: /get started/i }));

      await waitFor(() => {
        const options = screen.getAllByRole('radio');
        options.forEach((option) => {
          expect(option).toBeDisabled();
        });
      });
    });

    it('displays error message when submission fails', async () => {
      const user = userEvent.setup();
      mockUpdateUserPreferences.mockRejectedValue(new Error('Failed to save preferences'));

      render(<BuilderSelectionForm />);

      await user.click(screen.getByRole('button', { name: /get started/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeVisible();
        expect(screen.getByRole('alert')).toHaveTextContent(/failed to save preferences/i);
      });
    });

    it('navigates to dashboard after successful submission', async () => {
      const user = userEvent.setup();

      render(<BuilderSelectionForm />);

      await user.click(screen.getByRole('button', { name: /get started/i }));

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('calls onComplete callback after successful submission', async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();

      render(<BuilderSelectionForm onComplete={onComplete} />);

      await user.click(screen.getByLabelText(/voice agent/i));
      await user.click(screen.getByRole('button', { name: /get started/i }));

      await waitFor(() => {
        expect(onComplete).toHaveBeenCalledWith({ preferredBuilder: 'voice' });
      });
    });
  });

  describe('Navigation', () => {
    it('"Go Back" link navigates to organization setup page', async () => {
      render(<BuilderSelectionForm />);

      const goBackLink = screen.getByRole('link', { name: /go back/i });
      expect(goBackLink).toHaveAttribute('href', '/auth/register/org');
    });

    it('calls onBack when provided instead of default navigation', async () => {
      const user = userEvent.setup();
      const onBack = vi.fn();

      render(<BuilderSelectionForm onBack={onBack} />);

      await user.click(screen.getByRole('button', { name: /go back/i }));

      expect(onBack).toHaveBeenCalled();
    });
  });
});

/**
 * =============================================================================
 * Validation Utility Tests
 * =============================================================================
 */
describe('validateOrganizationName', () => {
  it('returns invalid for empty name', () => {
    const result = validateOrganizationName('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Organization name is required');
  });

  it('returns invalid for name less than 2 characters', () => {
    const result = validateOrganizationName('A');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('at least 2 characters');
  });

  it('returns invalid for name more than 50 characters', () => {
    const result = validateOrganizationName('A'.repeat(51));
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('no more than 50 characters');
  });

  it('returns invalid for name with special characters', () => {
    const result = validateOrganizationName('Company@#$%');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('alphanumeric characters and spaces');
  });

  it('returns valid for name with alphanumeric and spaces', () => {
    const result = validateOrganizationName('Acme AI Labs 123');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('trims whitespace before validation', () => {
    const result = validateOrganizationName('  Valid Name  ');
    expect(result.isValid).toBe(true);
  });
});

describe('validateOrganizationType', () => {
  it('returns invalid for empty type', () => {
    const result = validateOrganizationType('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please select an organization type');
  });

  it('returns invalid for invalid type value', () => {
    const result = validateOrganizationType('invalid_type');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please select a valid organization type');
  });

  it('returns valid for valid type values', () => {
    const validTypes = ['startup', 'enterprise', 'agency', 'research', 'freelance', 'nonprofit'];

    validTypes.forEach((type) => {
      const result = validateOrganizationType(type);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });
});

describe('validateTeamSize', () => {
  it('returns invalid for empty team size', () => {
    const result = validateTeamSize('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please select your team size');
  });

  it('returns invalid for invalid team size value', () => {
    const result = validateTeamSize('100');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please select a valid team size');
  });

  it('returns valid for valid team size values', () => {
    const validSizes = ['1', '2-10', '11-50', '50+'];

    validSizes.forEach((size) => {
      const result = validateTeamSize(size);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });
});

describe('validateBuilderSelection', () => {
  it('returns invalid for empty selection', () => {
    const result = validateBuilderSelection('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please select a builder');
  });

  it('returns invalid for invalid builder value', () => {
    const result = validateBuilderSelection('invalid_builder');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please select a valid builder option');
  });

  it('returns valid for valid builder values', () => {
    const validBuilders = ['module', 'chatbot', 'voice', 'canvas'];

    validBuilders.forEach((builder) => {
      const result = validateBuilderSelection(builder);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });
});

/**
 * =============================================================================
 * Accessibility Tests
 * =============================================================================
 */
describe('Accessibility', () => {
  describe('OrganizationSetupForm', () => {
    it('form fields have proper labels', () => {
      render(<OrganizationSetupForm />);

      expect(screen.getByLabelText(/organization name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/organization type/i)).toBeInTheDocument();
    });

    it('team size radio group has accessible name', () => {
      render(<OrganizationSetupForm />);

      expect(screen.getByRole('radiogroup', { name: /team size/i })).toBeInTheDocument();
    });

    it('form buttons have accessible names', () => {
      render(<OrganizationSetupForm />);

      expect(screen.getByRole('button', { name: /skip for now/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    });

    it('error messages have role="alert"', async () => {
      const user = userEvent.setup();
      render(<OrganizationSetupForm />);

      await user.click(screen.getByRole('button', { name: /continue/i }));

      const errorMessages = screen.getAllByRole('alert');
      expect(errorMessages.length).toBeGreaterThan(0);
    });

    it('supports keyboard navigation through form fields', async () => {
      const user = userEvent.setup();
      render(<OrganizationSetupForm />);

      // Tab through form
      await user.tab(); // Focus org name
      expect(screen.getByLabelText(/organization name/i)).toHaveFocus();

      await user.tab(); // Focus org type
      expect(screen.getByRole('combobox', { name: /organization type/i })).toHaveFocus();

      await user.tab(); // Focus first team size option
      const teamSizeOptions = screen.getAllByRole('radio');
      expect(teamSizeOptions[0]).toHaveFocus();
    });

    it('team size options can be selected with keyboard', async () => {
      const user = userEvent.setup();
      render(<OrganizationSetupForm />);

      // Focus the first team size option
      const firstOption = screen.getByLabelText(/just me/i);
      firstOption.focus();

      // Press Space to select
      await user.keyboard(' ');
      expect(firstOption).toBeChecked();

      // Press Arrow keys to navigate
      await user.keyboard('{ArrowRight}');
      const secondOption = screen.getByLabelText(/2-10/i);
      expect(secondOption).toHaveFocus();
    });
  });

  describe('BuilderSelectionForm', () => {
    it('builder options have accessible labels', () => {
      render(<BuilderSelectionForm />);

      expect(screen.getByLabelText(/module builder/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/chatbot builder/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/voice agent/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/canvas builder/i)).toBeInTheDocument();
    });

    it('builder selection can be changed with keyboard', async () => {
      const user = userEvent.setup();
      render(<BuilderSelectionForm />);

      // Focus the first option
      const chatbotOption = screen.getByLabelText(/chatbot builder/i);
      chatbotOption.focus();

      // Navigate with arrows
      await user.keyboard('{ArrowUp}');
      expect(screen.getByLabelText(/module builder/i)).toHaveFocus();

      await user.keyboard(' ');
      expect(screen.getByLabelText(/module builder/i)).toBeChecked();
    });
  });
});
