/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck - Test file with array access patterns that TypeScript struggles with
/**
 * SMS MFA Setup Component Unit Tests
 *
 * Story: 1-1-10 MFA SMS Verification
 * Wireframe: mfa_method_selection, account_&_security_settings_2
 *
 * TDD RED PHASE: These tests verify acceptance criteria from story 1-1-10:
 * - AC1: Navigate from method selection
 * - AC2: Display phone number input
 * - AC3: Country code selector
 * - AC4: Phone number validation
 * - AC5: Send verification code
 * - AC6: Display SMS code input
 * - AC7: Resend code with cooldown
 * - AC8: Verify SMS code
 * - AC9: Handle invalid code
 * - AC11: Skip/cancel setup
 * - AC12: Information boxes
 * - AC15: Accessibility requirements
 */

/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

// Components to be tested
import {
  SmsMfaSetupForm,
  PhoneInput,
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
const mockCreatePhoneNumber = vi.fn();
const mockPrepareVerification = vi.fn();
const mockAttemptVerification = vi.fn();
const mockUpdate = vi.fn();

const mockPhoneNumber = {
  id: 'phone_123',
  phoneNumber: '+15551234567',
  prepareVerification: mockPrepareVerification,
  attemptVerification: mockAttemptVerification,
};

const mockUserData = {
  id: 'user_123',
  emailAddresses: [{ emailAddress: 'test@example.com', verification: { status: 'verified' } }],
  phoneNumbers: [],
  createPhoneNumber: mockCreatePhoneNumber,
  update: mockUpdate,
  twoFactorEnabled: false,
};

vi.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: mockUserData,
    isLoaded: true,
  }),
}));

/**
 * SmsMfaSetupForm Component Tests
 */
describe('SmsMfaSetupForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockCreatePhoneNumber.mockResolvedValue(mockPhoneNumber);
    mockPrepareVerification.mockResolvedValue({});
    mockAttemptVerification.mockResolvedValue({ verification: { status: 'verified' } });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  describe('Rendering', () => {
    it('renders page heading "Setup SMS Verification"', () => {
      render(<SmsMfaSetupForm />);
      expect(screen.getByRole('heading', { name: /setup sms verification/i })).toBeInTheDocument();
    });

    it('renders page description', () => {
      render(<SmsMfaSetupForm />);
      expect(screen.getByText(/receive verification codes via text message/i)).toBeInTheDocument();
    });

    it('renders back link to method selection', () => {
      render(<SmsMfaSetupForm />);
      expect(screen.getByRole('link', { name: /back to method selection/i })).toBeInTheDocument();
    });

    it('renders step 1 indicator initially', () => {
      render(<SmsMfaSetupForm />);
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText(/enter phone number/i)).toBeInTheDocument();
    });
  });

  describe('AC2: Phone Number Input', () => {
    it('displays phone number input field', () => {
      render(<SmsMfaSetupForm />);
      expect(screen.getByRole('textbox', { name: /phone number/i })).toBeInTheDocument();
    });

    it('displays country code selector', () => {
      render(<SmsMfaSetupForm />);
      expect(screen.getByRole('combobox', { name: /country code/i })).toBeInTheDocument();
    });

    it('defaults to US country code (+1)', () => {
      render(<SmsMfaSetupForm />);
      expect(screen.getByText('+1')).toBeInTheDocument();
    });
  });

  describe('AC3: Country Code Selector', () => {
    it('opens dropdown when clicked', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<SmsMfaSetupForm />);

      await act(async () => {
        await user.click(screen.getByRole('combobox', { name: /country code/i }));
      });

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('shows common country codes in dropdown', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<SmsMfaSetupForm />);

      await act(async () => {
        await user.click(screen.getByRole('combobox', { name: /country code/i }));
      });

      // Common country codes should be visible
      expect(screen.getByText(/united states/i)).toBeInTheDocument();
      expect(screen.getByText(/united kingdom/i)).toBeInTheDocument();
    });

    it('updates input prefix when country is selected', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<SmsMfaSetupForm />);

      await act(async () => {
        await user.click(screen.getByRole('combobox', { name: /country code/i }));
        await user.click(screen.getByText(/united kingdom/i));
      });

      expect(screen.getByText('+44')).toBeInTheDocument();
    });
  });

  describe('AC4: Phone Number Validation', () => {
    it('only accepts numeric input', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<SmsMfaSetupForm />);

      const phoneInput = screen.getByRole('textbox', { name: /phone number/i });

      await act(async () => {
        await user.type(phoneInput, 'abc123def');
      });

      // Should only contain numbers
      expect(phoneInput).toHaveValue('123');
    });

    it('Send Code button is disabled with empty phone', () => {
      render(<SmsMfaSetupForm />);
      expect(screen.getByRole('button', { name: /send.*code/i })).toBeDisabled();
    });

    it('Send Code button is enabled with valid phone number', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<SmsMfaSetupForm />);

      const phoneInput = screen.getByRole('textbox', { name: /phone number/i });

      await act(async () => {
        await user.type(phoneInput, '5551234567');
      });

      expect(screen.getByRole('button', { name: /send.*code/i })).toBeEnabled();
    });
  });

  describe('AC5: Send Verification Code', () => {
    it('shows loading state when sending code', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      mockCreatePhoneNumber.mockImplementation(() => new Promise(() => {})); // Never resolves
      render(<SmsMfaSetupForm />);

      const phoneInput = screen.getByRole('textbox', { name: /phone number/i });

      await act(async () => {
        await user.type(phoneInput, '5551234567');
        await user.click(screen.getByRole('button', { name: /send.*code/i }));
      });

      expect(screen.getByRole('button', { name: /sending/i })).toBeInTheDocument();
    });

    it('calls Clerk API to create phone number', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<SmsMfaSetupForm />);

      const phoneInput = screen.getByRole('textbox', { name: /phone number/i });

      await act(async () => {
        await user.type(phoneInput, '5551234567');
        await user.click(screen.getByRole('button', { name: /send.*code/i }));
      });

      expect(mockCreatePhoneNumber).toHaveBeenCalledWith({
        phoneNumber: '+15551234567',
      });
    });

    it('transitions to verification step after code sent', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<SmsMfaSetupForm />);

      const phoneInput = screen.getByRole('textbox', { name: /phone number/i });

      await act(async () => {
        await user.type(phoneInput, '5551234567');
        await user.click(screen.getByRole('button', { name: /send.*code/i }));
      });

      // Should now show step 2
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText(/enter verification code/i)).toBeInTheDocument();
    });
  });

  describe('AC6: SMS Code Input', () => {
    const setupVerificationStep = async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<SmsMfaSetupForm />);

      const phoneInput = screen.getByRole('textbox', { name: /phone number/i });
      await act(async () => {
        await user.type(phoneInput, '5551234567');
        await user.click(screen.getByRole('button', { name: /send.*code/i }));
      });

      return user;
    };

    it('displays 6 OTP input boxes after code sent', async () => {
      await setupVerificationStep();

      const inputs = screen.getAllByRole('textbox', { name: /digit/i });
      expect(inputs).toHaveLength(6);
    });

    it('displays phone number code was sent to (masked)', async () => {
      await setupVerificationStep();

      expect(screen.getByText(/\*\*\*-\*\*\*-4567/)).toBeInTheDocument();
    });

    it('displays step 2 indicator', async () => {
      await setupVerificationStep();

      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText(/enter verification code/i)).toBeInTheDocument();
    });
  });

  describe('AC7: Resend Code with Cooldown', () => {
    const setupVerificationStep = async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<SmsMfaSetupForm />);

      const phoneInput = screen.getByRole('textbox', { name: /phone number/i });
      await act(async () => {
        await user.type(phoneInput, '5551234567');
        await user.click(screen.getByRole('button', { name: /send.*code/i }));
      });

      return user;
    };

    it('displays Resend Code button', async () => {
      await setupVerificationStep();

      expect(screen.getByRole('button', { name: /resend/i })).toBeInTheDocument();
    });

    it('Resend button is disabled initially with countdown', async () => {
      await setupVerificationStep();

      const resendButton = screen.getByRole('button', { name: /resend/i });
      expect(resendButton).toBeDisabled();
      expect(screen.getByText(/60s|59s/)).toBeInTheDocument();
    });

    it('countdown decrements every second', async () => {
      await setupVerificationStep();

      expect(screen.getByText(/60s|59s/)).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(screen.getByText(/55s|54s/)).toBeInTheDocument();
    });

    it('Resend button is enabled after cooldown expires', async () => {
      await setupVerificationStep();

      act(() => {
        vi.advanceTimersByTime(61000); // 61 seconds
      });

      const resendButton = screen.getByRole('button', { name: /resend/i });
      expect(resendButton).toBeEnabled();
    });

    it('clicking Resend sends new code', async () => {
      const user = await setupVerificationStep();

      act(() => {
        vi.advanceTimersByTime(61000);
      });

      await act(async () => {
        await user.click(screen.getByRole('button', { name: /resend/i }));
      });

      expect(mockPrepareVerification).toHaveBeenCalledTimes(2);
    });
  });

  describe('AC8: Verify SMS Code', () => {
    const setupAndEnterCode = async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<SmsMfaSetupForm />);

      // Enter phone and send code
      const phoneInput = screen.getByRole('textbox', { name: /phone number/i });
      await act(async () => {
        await user.type(phoneInput, '5551234567');
        await user.click(screen.getByRole('button', { name: /send.*code/i }));
      });

      // Enter verification code
      const inputs = screen.getAllByRole('textbox', { name: /digit/i });
      await act(async () => {
        inputs[0]!.focus();
        await user.paste('123456');
      });

      return user;
    };

    it('Verify button is disabled when code is incomplete', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<SmsMfaSetupForm />);

      const phoneInput = screen.getByRole('textbox', { name: /phone number/i });
      await act(async () => {
        await user.type(phoneInput, '5551234567');
        await user.click(screen.getByRole('button', { name: /send.*code/i }));
      });

      expect(screen.getByRole('button', { name: /verify/i })).toBeDisabled();
    });

    it('Verify button is enabled when code is complete', async () => {
      await setupAndEnterCode();

      expect(screen.getByRole('button', { name: /verify/i })).toBeEnabled();
    });

    it('calls Clerk API to verify code', async () => {
      const user = await setupAndEnterCode();

      await act(async () => {
        await user.click(screen.getByRole('button', { name: /verify/i }));
      });

      expect(mockAttemptVerification).toHaveBeenCalledWith({ code: '123456' });
    });

    it('navigates to backup codes on success', async () => {
      const user = await setupAndEnterCode();

      await act(async () => {
        await user.click(screen.getByRole('button', { name: /verify/i }));
      });

      expect(mockPush).toHaveBeenCalledWith('/auth/mfa-setup/backup');
    });
  });

  describe('AC9: Handle Invalid Code', () => {
    it('displays error message on invalid code', async () => {
      mockAttemptVerification.mockRejectedValue(new Error('Invalid code'));
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<SmsMfaSetupForm />);

      // Enter phone and send code
      const phoneInput = screen.getByRole('textbox', { name: /phone number/i });
      await act(async () => {
        await user.type(phoneInput, '5551234567');
        await user.click(screen.getByRole('button', { name: /send.*code/i }));
      });

      // Enter wrong code
      const inputs = screen.getAllByRole('textbox', { name: /digit/i });
      await act(async () => {
        inputs[0]!.focus();
        await user.paste('000000');
        await user.click(screen.getByRole('button', { name: /verify/i }));
      });

      await act(async () => {
        vi.advanceTimersByTime(10);
      });

      expect(screen.getByText(/invalid|incorrect/i)).toBeInTheDocument();
    });

    it('clears inputs on error', async () => {
      mockAttemptVerification.mockRejectedValue(new Error('Invalid code'));
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<SmsMfaSetupForm />);

      const phoneInput = screen.getByRole('textbox', { name: /phone number/i });
      await act(async () => {
        await user.type(phoneInput, '5551234567');
        await user.click(screen.getByRole('button', { name: /send.*code/i }));
      });

      const inputs = screen.getAllByRole('textbox', { name: /digit/i });
      await act(async () => {
        inputs[0]!.focus();
        await user.paste('000000');
        await user.click(screen.getByRole('button', { name: /verify/i }));
      });

      await act(async () => {
        vi.advanceTimersByTime(10);
      });

      expect(inputs[0]!).toHaveValue('');
    });
  });

  describe('AC11: Skip/Cancel Setup', () => {
    it('renders skip button', () => {
      render(<SmsMfaSetupForm />);
      expect(screen.getByRole('button', { name: /i'll do this later/i })).toBeInTheDocument();
    });

    it('clicking skip opens warning dialog', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<SmsMfaSetupForm />);

      await act(async () => {
        await user.click(screen.getByRole('button', { name: /i'll do this later/i }));
      });

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('warning dialog contains security message', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<SmsMfaSetupForm />);

      await act(async () => {
        await user.click(screen.getByRole('button', { name: /i'll do this later/i }));
      });

      expect(screen.getByText(/security|risk|recommend|protect/i)).toBeInTheDocument();
    });

    it('can return to setup from warning', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<SmsMfaSetupForm />);

      await act(async () => {
        await user.click(screen.getByRole('button', { name: /i'll do this later/i }));
      });

      await act(async () => {
        await user.click(screen.getByRole('button', { name: /return to setup|go back/i }));
      });

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('confirming skip navigates to security settings', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<SmsMfaSetupForm />);

      await act(async () => {
        await user.click(screen.getByRole('button', { name: /i'll do this later/i }));
      });

      await act(async () => {
        await user.click(screen.getByRole('button', { name: /skip|continue without/i }));
      });

      expect(mockPush).toHaveBeenCalledWith('/settings/security');
    });
  });

  describe('AC12: Information Boxes', () => {
    it('displays "Why SMS verification?" info box', () => {
      render(<SmsMfaSetupForm />);
      expect(screen.getByText(/why sms verification\?/i)).toBeInTheDocument();
    });

    it('displays help info box', () => {
      render(<SmsMfaSetupForm />);
      expect(screen.getByText(/didn't receive|having trouble/i)).toBeInTheDocument();
    });
  });

  describe('AC15: Accessibility', () => {
    it('phone input has proper label', () => {
      render(<SmsMfaSetupForm />);

      const phoneInput = screen.getByRole('textbox', { name: /phone number/i });
      expect(phoneInput).toHaveAccessibleName(/phone number/i);
    });

    it('country selector has proper label', () => {
      render(<SmsMfaSetupForm />);

      const selector = screen.getByRole('combobox', { name: /country code/i });
      expect(selector).toHaveAccessibleName(/country code/i);
    });

    it('error messages are announced to screen readers', async () => {
      mockAttemptVerification.mockRejectedValue(new Error('Invalid'));
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<SmsMfaSetupForm />);

      const phoneInput = screen.getByRole('textbox', { name: /phone number/i });
      await act(async () => {
        await user.type(phoneInput, '5551234567');
        await user.click(screen.getByRole('button', { name: /send.*code/i }));
      });

      const inputs = screen.getAllByRole('textbox', { name: /digit/i });
      await act(async () => {
        inputs[0]!.focus();
        await user.paste('000000');
        await user.click(screen.getByRole('button', { name: /verify/i }));
      });

      await act(async () => {
        vi.advanceTimersByTime(10);
      });

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('buttons are keyboard accessible', async () => {
      render(<SmsMfaSetupForm />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((btn) => {
        expect(btn).not.toHaveAttribute('tabindex', '-1');
      });
    });
  });

  describe('Callback Props', () => {
    it('calls onVerifySuccess when verification succeeds', async () => {
      const onVerifySuccess = vi.fn();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<SmsMfaSetupForm onVerifySuccess={onVerifySuccess} />);

      const phoneInput = screen.getByRole('textbox', { name: /phone number/i });
      await act(async () => {
        await user.type(phoneInput, '5551234567');
        await user.click(screen.getByRole('button', { name: /send.*code/i }));
      });

      const inputs = screen.getAllByRole('textbox', { name: /digit/i });
      await act(async () => {
        inputs[0]!.focus();
        await user.paste('123456');
        await user.click(screen.getByRole('button', { name: /verify/i }));
      });

      expect(onVerifySuccess).toHaveBeenCalled();
    });

    it('calls onSkip when user confirms skip', async () => {
      const onSkip = vi.fn();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<SmsMfaSetupForm onSkip={onSkip} />);

      await act(async () => {
        await user.click(screen.getByRole('button', { name: /i'll do this later/i }));
        await user.click(screen.getByRole('button', { name: /skip|continue without/i }));
      });

      expect(onSkip).toHaveBeenCalled();
    });
  });
});

/**
 * PhoneInput Component Tests
 */
describe('PhoneInput', () => {
  const defaultProps = {
    value: '',
    countryCode: '+1',
    onChange: vi.fn(),
    onCountryCodeChange: vi.fn(),
    disabled: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders phone input field', () => {
    render(<PhoneInput {...defaultProps} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders country code selector', () => {
    render(<PhoneInput {...defaultProps} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('displays current country code', () => {
    render(<PhoneInput {...defaultProps} countryCode="+44" />);
    expect(screen.getByText('+44')).toBeInTheDocument();
  });

  it('calls onChange with formatted value', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<PhoneInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, '5551234567');

    expect(onChange).toHaveBeenCalled();
  });

  it('filters non-numeric characters', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<PhoneInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'abc123');

    // Should only pass numeric values
    const calls = onChange.mock.calls;
    const lastCall = calls[calls.length - 1];
    expect(lastCall[0]).toMatch(/^\d+$/);
  });

  it('is disabled when disabled prop is true', () => {
    render(<PhoneInput {...defaultProps} disabled={true} />);

    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('shows error styling when error prop is true', () => {
    const { container } = render(<PhoneInput {...defaultProps} error={true} />);

    const input = container.querySelector('input');
    expect(input).toHaveClass('border-red-500');
  });

  it('has accessible label', () => {
    render(<PhoneInput {...defaultProps} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAccessibleName();
  });
});
