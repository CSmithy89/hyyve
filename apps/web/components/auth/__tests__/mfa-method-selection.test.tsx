/**
 * MFA Method Selection Component Unit Tests
 *
 * Story: 1-1-7 MFA Setup - Method Selection
 * Wireframe: mfa_method_selection
 *
 * TDD RED PHASE: These tests are written to FAIL initially.
 * They verify acceptance criteria from story 1-1-7:
 * - AC2: Display MFA method options as radio button cards
 * - AC3: Method selection visual feedback
 * - AC4: Skip option with security warning modal
 * - AC5: Continue to method-specific setup
 * - AC7: Accessibility requirements
 *
 * Tests cover:
 * - Component renders three MFA method cards
 * - Selection state management
 * - Continue button disabled until selection (if needed)
 * - Skip warning modal functionality
 * - Accessibility (ARIA, keyboard navigation)
 */

/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

// Components to be implemented (will fail in RED phase)
// These imports will fail until the components are created
import {
  MfaMethodSelection,
  MfaMethodCard,
  MfaInfoBox,
  SkipMfaWarningModal,
} from '../index';

// Mock next/navigation
const mockPush = vi.fn();
const mockBack = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

// Mock Clerk hooks
const mockUserData = {
  id: 'user_123',
  emailAddresses: [{ emailAddress: 'test@example.com', verification: { status: 'verified' } }],
  phoneNumbers: [],
  twoFactorEnabled: false,
};

vi.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: mockUserData,
    isLoaded: true,
  }),
}));

/**
 * MfaMethodSelection Component Tests
 *
 * Main component that renders the MFA method selection page.
 */
describe('MfaMethodSelection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Rendering', () => {
    it('renders page heading "Choose Authentication Method"', () => {
      render(<MfaMethodSelection />);

      expect(screen.getByRole('heading', { name: /choose authentication method/i })).toBeInTheDocument();
    });

    it('renders page subheading', () => {
      render(<MfaMethodSelection />);

      expect(screen.getByText(/add an extra layer of security to your hyyve workspace/i)).toBeInTheDocument();
    });

    it('renders all three MFA method options', () => {
      render(<MfaMethodSelection />);

      expect(screen.getByRole('radio', { name: /authenticator app/i })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: /sms verification/i })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: /email verification/i })).toBeInTheDocument();
    });

    it('renders MFA methods inside a radiogroup', () => {
      render(<MfaMethodSelection />);

      const radiogroup = screen.getByRole('radiogroup', { name: /mfa methods/i });
      expect(radiogroup).toBeInTheDocument();

      // All radios should be within the group
      const radios = within(radiogroup).getAllByRole('radio');
      expect(radios).toHaveLength(3);
    });

    it('renders "Recommended" badge on Authenticator App', () => {
      render(<MfaMethodSelection />);

      const recommendedBadge = screen.getByText('Recommended');
      expect(recommendedBadge).toBeInTheDocument();

      // Badge should be near the Authenticator App option
      const authenticatorSection = screen.getByText(/authenticator app/i).closest('label');
      expect(authenticatorSection).toContainElement(recommendedBadge);
    });

    it('renders Continue Setup button', () => {
      render(<MfaMethodSelection />);

      expect(screen.getByRole('button', { name: /continue setup/i })).toBeInTheDocument();
    });

    it('renders Cancel button', () => {
      render(<MfaMethodSelection />);

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('renders info box explaining 2FA benefits', () => {
      render(<MfaMethodSelection />);

      expect(screen.getByText(/why enable 2fa\?/i)).toBeInTheDocument();
      expect(screen.getByText(/extra layer of security/i)).toBeInTheDocument();
    });

    it('renders breadcrumb navigation', () => {
      render(<MfaMethodSelection />);

      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Security')).toBeInTheDocument();
      expect(screen.getByText('MFA Setup')).toBeInTheDocument();
    });
  });

  describe('Default Selection State', () => {
    it('has Authenticator App selected by default', () => {
      render(<MfaMethodSelection />);

      const authenticatorRadio = screen.getByRole('radio', { name: /authenticator app/i });
      expect(authenticatorRadio).toBeChecked();
    });

    it('SMS Verification is not selected by default', () => {
      render(<MfaMethodSelection />);

      const smsRadio = screen.getByRole('radio', { name: /sms verification/i });
      expect(smsRadio).not.toBeChecked();
    });

    it('Email Verification is not selected by default', () => {
      render(<MfaMethodSelection />);

      const emailRadio = screen.getByRole('radio', { name: /email verification/i });
      expect(emailRadio).not.toBeChecked();
    });
  });

  describe('Selection State Management', () => {
    it('changes selection when clicking SMS option', async () => {
      const user = userEvent.setup();
      render(<MfaMethodSelection />);

      const smsOption = screen.getByText(/sms verification/i).closest('label')!;
      await user.click(smsOption);

      expect(screen.getByRole('radio', { name: /sms verification/i })).toBeChecked();
      expect(screen.getByRole('radio', { name: /authenticator app/i })).not.toBeChecked();
    });

    it('changes selection when clicking Email option', async () => {
      const user = userEvent.setup();
      render(<MfaMethodSelection />);

      const emailOption = screen.getByText(/email verification/i).closest('label')!;
      await user.click(emailOption);

      expect(screen.getByRole('radio', { name: /email verification/i })).toBeChecked();
      expect(screen.getByRole('radio', { name: /authenticator app/i })).not.toBeChecked();
    });

    it('only allows one selection at a time', async () => {
      const user = userEvent.setup();
      render(<MfaMethodSelection />);

      // Select SMS
      await user.click(screen.getByText(/sms verification/i).closest('label')!);
      expect(screen.getByRole('radio', { name: /sms verification/i })).toBeChecked();

      // Select Email
      await user.click(screen.getByText(/email verification/i).closest('label')!);

      // Only Email should be checked
      expect(screen.getByRole('radio', { name: /email verification/i })).toBeChecked();
      expect(screen.getByRole('radio', { name: /sms verification/i })).not.toBeChecked();
      expect(screen.getByRole('radio', { name: /authenticator app/i })).not.toBeChecked();
    });

    it('updates visual state when selection changes', async () => {
      const user = userEvent.setup();
      render(<MfaMethodSelection />);

      const authenticatorCard = screen.getByText(/authenticator app/i).closest('label')!;
      const smsCard = screen.getByText(/sms verification/i).closest('label')!;

      // Initially Authenticator should have primary styling
      expect(authenticatorCard).toHaveClass('border-primary');

      // Select SMS
      await user.click(smsCard);

      // SMS should now have primary styling, Authenticator should not
      expect(smsCard).toHaveClass('border-primary');
      expect(authenticatorCard).not.toHaveClass('border-primary');
    });
  });

  describe('Continue Button Functionality', () => {
    it('navigates to /auth/mfa-setup/authenticator when Authenticator is selected', async () => {
      const user = userEvent.setup();
      render(<MfaMethodSelection />);

      const continueButton = screen.getByRole('button', { name: /continue setup/i });
      await user.click(continueButton);

      expect(mockPush).toHaveBeenCalledWith('/auth/mfa-setup/authenticator');
    });

    it('navigates to /auth/mfa-setup/sms when SMS is selected', async () => {
      const user = userEvent.setup();
      render(<MfaMethodSelection />);

      // Select SMS
      await user.click(screen.getByText(/sms verification/i).closest('label')!);

      // Click Continue
      await user.click(screen.getByRole('button', { name: /continue setup/i }));

      expect(mockPush).toHaveBeenCalledWith('/auth/mfa-setup/sms');
    });

    it('navigates to /auth/mfa-setup/email when Email is selected', async () => {
      const user = userEvent.setup();
      render(<MfaMethodSelection />);

      // Select Email
      await user.click(screen.getByText(/email verification/i).closest('label')!);

      // Click Continue
      await user.click(screen.getByRole('button', { name: /continue setup/i }));

      expect(mockPush).toHaveBeenCalledWith('/auth/mfa-setup/email');
    });

    it('Continue button is enabled when a method is selected', () => {
      render(<MfaMethodSelection />);

      const continueButton = screen.getByRole('button', { name: /continue setup/i });
      expect(continueButton).toBeEnabled();
    });

    it('shows loading state while navigating', async () => {
      const user = userEvent.setup();
      render(<MfaMethodSelection />);

      const continueButton = screen.getByRole('button', { name: /continue setup/i });
      await user.click(continueButton);

      // Button should show loading state
      await waitFor(() => {
        expect(continueButton).toHaveAttribute('aria-busy', 'true');
      });
    });
  });

  describe('Cancel Button and Skip Warning Modal', () => {
    it('opens warning modal when Cancel is clicked', async () => {
      const user = userEvent.setup();
      render(<MfaMethodSelection />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      // Modal should appear
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('modal contains security warning message', async () => {
      const user = userEvent.setup();
      render(<MfaMethodSelection />);

      await user.click(screen.getByRole('button', { name: /cancel/i }));

      // Warning message should be visible
      expect(screen.getByText(/security|risk|recommend|protect/i)).toBeInTheDocument();
    });

    it('modal has "Continue Without MFA" button', async () => {
      const user = userEvent.setup();
      render(<MfaMethodSelection />);

      await user.click(screen.getByRole('button', { name: /cancel/i }));

      expect(screen.getByRole('button', { name: /skip|continue without mfa/i })).toBeInTheDocument();
    });

    it('modal has "Return to Setup" button', async () => {
      const user = userEvent.setup();
      render(<MfaMethodSelection />);

      await user.click(screen.getByRole('button', { name: /cancel/i }));

      expect(screen.getByRole('button', { name: /return to setup|go back/i })).toBeInTheDocument();
    });

    it('clicking "Return to Setup" closes the modal', async () => {
      const user = userEvent.setup();
      render(<MfaMethodSelection />);

      await user.click(screen.getByRole('button', { name: /cancel/i }));
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /return to setup|go back/i }));

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('clicking "Continue Without MFA" navigates away', async () => {
      const user = userEvent.setup();
      render(<MfaMethodSelection />);

      await user.click(screen.getByRole('button', { name: /cancel/i }));
      await user.click(screen.getByRole('button', { name: /skip|continue without mfa/i }));

      expect(mockPush).toHaveBeenCalledWith(expect.stringMatching(/\/settings|\/dashboard/));
    });

    it('modal can be closed with Escape key', async () => {
      const user = userEvent.setup();
      render(<MfaMethodSelection />);

      await user.click(screen.getByRole('button', { name: /cancel/i }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('radiogroup has aria-label', () => {
      render(<MfaMethodSelection />);

      const radiogroup = screen.getByRole('radiogroup');
      expect(radiogroup).toHaveAttribute('aria-label', /mfa methods/i);
    });

    it('radio buttons have aria-labelledby', () => {
      render(<MfaMethodSelection />);

      const authenticatorRadio = screen.getByRole('radio', { name: /authenticator app/i });
      expect(authenticatorRadio).toHaveAttribute('aria-labelledby');
    });

    it('radio buttons have aria-describedby', () => {
      render(<MfaMethodSelection />);

      const authenticatorRadio = screen.getByRole('radio', { name: /authenticator app/i });
      expect(authenticatorRadio).toHaveAttribute('aria-describedby');
    });

    it('supports keyboard navigation with Arrow keys', async () => {
      const user = userEvent.setup();
      render(<MfaMethodSelection />);

      const authenticatorRadio = screen.getByRole('radio', { name: /authenticator app/i });
      authenticatorRadio.focus();

      // Press ArrowDown to move to SMS
      await user.keyboard('{ArrowDown}');

      expect(screen.getByRole('radio', { name: /sms verification/i })).toBeChecked();
    });

    it('supports selection with Space key', async () => {
      const user = userEvent.setup();
      render(<MfaMethodSelection />);

      const smsRadio = screen.getByRole('radio', { name: /sms verification/i });
      smsRadio.focus();
      await user.keyboard(' ');

      expect(smsRadio).toBeChecked();
    });

    it('buttons have type="button"', () => {
      render(<MfaMethodSelection />);

      const continueButton = screen.getByRole('button', { name: /continue setup/i });
      const cancelButton = screen.getByRole('button', { name: /cancel/i });

      expect(continueButton).toHaveAttribute('type', 'button');
      expect(cancelButton).toHaveAttribute('type', 'button');
    });

    it('has proper heading hierarchy', () => {
      render(<MfaMethodSelection />);

      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent(/choose authentication method/i);
    });

    it('modal traps focus when open', async () => {
      const user = userEvent.setup();
      render(<MfaMethodSelection />);

      await user.click(screen.getByRole('button', { name: /cancel/i }));

      // Focus should be inside the modal
      const dialog = screen.getByRole('dialog');
      expect(dialog.contains(document.activeElement)).toBeTruthy();
    });

    it('focus returns to Cancel button when modal closes', async () => {
      const user = userEvent.setup();
      render(<MfaMethodSelection />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      await user.click(screen.getByRole('button', { name: /return to setup|go back/i }));

      await waitFor(() => {
        expect(document.activeElement).toBe(cancelButton);
      });
    });
  });

  describe('Visual Styling', () => {
    it('selected card has primary border', () => {
      render(<MfaMethodSelection />);

      const authenticatorCard = screen.getByText(/authenticator app/i).closest('label')!;
      expect(authenticatorCard).toHaveClass('border-primary');
    });

    it('selected card has primary background tint', () => {
      render(<MfaMethodSelection />);

      const authenticatorCard = screen.getByText(/authenticator app/i).closest('label')!;
      expect(authenticatorCard).toHaveClass('bg-primary/5');
    });

    it('unselected cards have default border', () => {
      render(<MfaMethodSelection />);

      const smsCard = screen.getByText(/sms verification/i).closest('label')!;
      expect(smsCard).toHaveClass('border-border-dark');
    });

    it('unselected cards have surface background', () => {
      render(<MfaMethodSelection />);

      const smsCard = screen.getByText(/sms verification/i).closest('label')!;
      expect(smsCard).toHaveClass('bg-surface-dark');
    });

    it('info box has blue styling', () => {
      render(<MfaMethodSelection />);

      const infoBox = screen.getByText(/why enable 2fa/i).closest('div[class*="bg-blue"]');
      expect(infoBox).toBeInTheDocument();
    });

    it('Continue button has primary styling', () => {
      render(<MfaMethodSelection />);

      const continueButton = screen.getByRole('button', { name: /continue setup/i });
      expect(continueButton).toHaveClass('bg-primary');
    });

    it('Cancel button has secondary styling', () => {
      render(<MfaMethodSelection />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      expect(cancelButton).toHaveClass('bg-surface-dark');
    });
  });

  describe('Method Descriptions', () => {
    it('displays description for Authenticator App', () => {
      render(<MfaMethodSelection />);

      expect(screen.getByText(/use google authenticator, authy, or 1password/i)).toBeInTheDocument();
    });

    it('displays description for SMS Verification', () => {
      render(<MfaMethodSelection />);

      expect(screen.getByText(/receive a unique one-time code via text message/i)).toBeInTheDocument();
    });

    it('displays description for Email Verification', () => {
      render(<MfaMethodSelection />);

      expect(screen.getByText(/receive a unique one-time code via your registered email/i)).toBeInTheDocument();
    });
  });

  describe('Icon Display', () => {
    it('displays icon for Authenticator App', () => {
      render(<MfaMethodSelection />);

      const authenticatorCard = screen.getByText(/authenticator app/i).closest('label')!;
      const icon = within(authenticatorCard).getByTestId('icon-phonelink_lock');
      expect(icon).toBeInTheDocument();
    });

    it('displays icon for SMS Verification', () => {
      render(<MfaMethodSelection />);

      const smsCard = screen.getByText(/sms verification/i).closest('label')!;
      const icon = within(smsCard).getByTestId('icon-sms');
      expect(icon).toBeInTheDocument();
    });

    it('displays icon for Email Verification', () => {
      render(<MfaMethodSelection />);

      const emailCard = screen.getByText(/email verification/i).closest('label')!;
      const icon = within(emailCard).getByTestId('icon-mail');
      expect(icon).toBeInTheDocument();
    });

    it('selected icon has primary styling', () => {
      render(<MfaMethodSelection />);

      const authenticatorCard = screen.getByText(/authenticator app/i).closest('label')!;
      const iconContainer = within(authenticatorCard).getByTestId('icon-container');
      expect(iconContainer).toHaveClass('bg-primary/20');
      expect(iconContainer).toHaveClass('text-primary');
    });

    it('unselected icon has default styling', () => {
      render(<MfaMethodSelection />);

      const smsCard = screen.getByText(/sms verification/i).closest('label')!;
      const iconContainer = within(smsCard).getByTestId('icon-container');
      expect(iconContainer).toHaveClass('bg-border-dark');
      expect(iconContainer).toHaveClass('text-text-secondary');
    });
  });

  describe('Callback Props', () => {
    it('calls onMethodSelect when selection changes', async () => {
      const onMethodSelect = vi.fn();
      const user = userEvent.setup();
      render(<MfaMethodSelection onMethodSelect={onMethodSelect} />);

      await user.click(screen.getByText(/sms verification/i).closest('label')!);

      expect(onMethodSelect).toHaveBeenCalledWith('sms');
    });

    it('calls onContinue when Continue button is clicked', async () => {
      const onContinue = vi.fn();
      const user = userEvent.setup();
      render(<MfaMethodSelection onContinue={onContinue} />);

      await user.click(screen.getByRole('button', { name: /continue setup/i }));

      expect(onContinue).toHaveBeenCalledWith('app');
    });

    it('calls onSkip when user confirms skip', async () => {
      const onSkip = vi.fn();
      const user = userEvent.setup();
      render(<MfaMethodSelection onSkip={onSkip} />);

      await user.click(screen.getByRole('button', { name: /cancel/i }));
      await user.click(screen.getByRole('button', { name: /skip|continue without mfa/i }));

      expect(onSkip).toHaveBeenCalled();
    });
  });
});

/**
 * MfaMethodCard Component Tests
 */
describe('MfaMethodCard', () => {
  const defaultProps = {
    method: 'app' as const,
    title: 'Authenticator App',
    description: 'Use Google Authenticator to generate codes.',
    icon: 'phonelink_lock',
    selected: false,
    onChange: vi.fn(),
  };

  it('renders method title', () => {
    render(<MfaMethodCard {...defaultProps} />);

    expect(screen.getByText('Authenticator App')).toBeInTheDocument();
  });

  it('renders method description', () => {
    render(<MfaMethodCard {...defaultProps} />);

    expect(screen.getByText(/use google authenticator/i)).toBeInTheDocument();
  });

  it('renders radio input', () => {
    render(<MfaMethodCard {...defaultProps} />);

    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('radio is checked when selected is true', () => {
    render(<MfaMethodCard {...defaultProps} selected={true} />);

    expect(screen.getByRole('radio')).toBeChecked();
  });

  it('radio is not checked when selected is false', () => {
    render(<MfaMethodCard {...defaultProps} selected={false} />);

    expect(screen.getByRole('radio')).not.toBeChecked();
  });

  it('calls onChange when clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<MfaMethodCard {...defaultProps} onChange={onChange} />);

    await user.click(screen.getByRole('radio'));

    expect(onChange).toHaveBeenCalledWith('app');
  });

  it('renders Recommended badge when recommended is true', () => {
    render(<MfaMethodCard {...defaultProps} recommended={true} />);

    expect(screen.getByText('Recommended')).toBeInTheDocument();
  });

  it('does not render Recommended badge when recommended is false', () => {
    render(<MfaMethodCard {...defaultProps} recommended={false} />);

    expect(screen.queryByText('Recommended')).not.toBeInTheDocument();
  });

  it('applies selected styling when selected', () => {
    const { container } = render(<MfaMethodCard {...defaultProps} selected={true} />);

    const label = container.querySelector('label');
    expect(label).toHaveClass('border-primary');
    expect(label).toHaveClass('bg-primary/5');
  });

  it('applies unselected styling when not selected', () => {
    const { container } = render(<MfaMethodCard {...defaultProps} selected={false} />);

    const label = container.querySelector('label');
    expect(label).toHaveClass('border-border-dark');
    expect(label).toHaveClass('bg-surface-dark');
  });

  it('has aria-labelledby attribute', () => {
    render(<MfaMethodCard {...defaultProps} />);

    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('aria-labelledby');
  });

  it('has aria-describedby attribute', () => {
    render(<MfaMethodCard {...defaultProps} />);

    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('aria-describedby');
  });
});

/**
 * MfaInfoBox Component Tests
 */
describe('MfaInfoBox', () => {
  it('renders with default content', () => {
    render(<MfaInfoBox />);

    expect(screen.getByText(/why enable 2fa\?/i)).toBeInTheDocument();
    expect(screen.getByText(/extra layer of security/i)).toBeInTheDocument();
  });

  it('has info icon', () => {
    render(<MfaInfoBox />);

    expect(screen.getByTestId('info-icon')).toBeInTheDocument();
  });

  it('applies blue styling', () => {
    const { container } = render(<MfaInfoBox />);

    const box = container.firstChild;
    expect(box).toHaveClass('bg-blue-500/10');
    expect(box).toHaveClass('border-blue-500/20');
  });

  it('renders custom title when provided', () => {
    render(<MfaInfoBox title="Custom Title" />);

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('renders custom content when provided', () => {
    render(<MfaInfoBox content="Custom content text" />);

    expect(screen.getByText('Custom content text')).toBeInTheDocument();
  });
});

/**
 * SkipMfaWarningModal Component Tests
 */
describe('SkipMfaWarningModal', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    onConfirmSkip: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders when open is true', () => {
    render(<SkipMfaWarningModal {...defaultProps} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    render(<SkipMfaWarningModal {...defaultProps} open={false} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('displays warning title', () => {
    render(<SkipMfaWarningModal {...defaultProps} />);

    expect(screen.getByRole('heading', { name: /skip mfa|security warning/i })).toBeInTheDocument();
  });

  it('displays security warning message', () => {
    render(<SkipMfaWarningModal {...defaultProps} />);

    expect(screen.getByText(/security|risk|recommend|protect/i)).toBeInTheDocument();
  });

  it('has "Continue Without MFA" button', () => {
    render(<SkipMfaWarningModal {...defaultProps} />);

    expect(screen.getByRole('button', { name: /skip|continue without mfa/i })).toBeInTheDocument();
  });

  it('has "Return to Setup" button', () => {
    render(<SkipMfaWarningModal {...defaultProps} />);

    expect(screen.getByRole('button', { name: /return to setup|go back/i })).toBeInTheDocument();
  });

  it('calls onClose when "Return to Setup" is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<SkipMfaWarningModal {...defaultProps} onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: /return to setup|go back/i }));

    expect(onClose).toHaveBeenCalled();
  });

  it('calls onConfirmSkip when "Continue Without MFA" is clicked', async () => {
    const onConfirmSkip = vi.fn();
    const user = userEvent.setup();
    render(<SkipMfaWarningModal {...defaultProps} onConfirmSkip={onConfirmSkip} />);

    await user.click(screen.getByRole('button', { name: /skip|continue without mfa/i }));

    expect(onConfirmSkip).toHaveBeenCalled();
  });

  it('has warning icon', () => {
    render(<SkipMfaWarningModal {...defaultProps} />);

    expect(screen.getByTestId('warning-icon')).toBeInTheDocument();
  });

  it('modal has proper accessibility attributes', () => {
    render(<SkipMfaWarningModal {...defaultProps} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
  });

  it('focuses on the Return to Setup button when opened', async () => {
    render(<SkipMfaWarningModal {...defaultProps} />);

    await waitFor(() => {
      const returnButton = screen.getByRole('button', { name: /return to setup|go back/i });
      expect(document.activeElement).toBe(returnButton);
    });
  });

  it('closes when Escape key is pressed', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<SkipMfaWarningModal {...defaultProps} onClose={onClose} />);

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalled();
  });

  it('Skip button has destructive styling', () => {
    render(<SkipMfaWarningModal {...defaultProps} />);

    const skipButton = screen.getByRole('button', { name: /skip|continue without mfa/i });
    // Button uses bg-red-500/20 for subtle destructive styling
    expect(skipButton).toHaveClass('text-red-400');
  });

  it('Return button has primary styling', () => {
    render(<SkipMfaWarningModal {...defaultProps} />);

    const returnButton = screen.getByRole('button', { name: /return to setup|go back/i });
    expect(returnButton).toHaveClass('bg-primary');
  });
});
