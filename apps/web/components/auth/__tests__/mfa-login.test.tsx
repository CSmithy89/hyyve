/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/**
 * MFA Login Verification Unit Tests
 *
 * Story: 1-1-11 MFA Login Verification
 * Wireframe: hyyve_login_page
 *
 * TDD RED PHASE: These tests are written to FAIL initially.
 * Tests cover MfaLoginForm component functionality:
 * - Rendering with default TOTP method
 * - Method switching (TOTP, SMS, backup codes)
 * - OTP code input handling
 * - Backup code input handling
 * - Loading and error states
 * - Verification flow
 * - Accessibility
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Clerk hooks
const mockAttemptSecondFactor = vi.fn();
const mockPrepareSecondFactor = vi.fn();
const mockSignIn = {
  status: 'needs_second_factor',
  supportedSecondFactors: [
    { strategy: 'totp' },
    { strategy: 'phone_code' },
    { strategy: 'backup_code' },
  ],
  attemptSecondFactor: mockAttemptSecondFactor,
  prepareSecondFactor: mockPrepareSecondFactor,
};

vi.mock('@clerk/nextjs', () => ({
  useSignIn: () => ({
    signIn: mockSignIn,
    setActive: vi.fn(),
    isLoaded: true,
  }),
  useUser: () => ({
    user: {
      id: 'test-user-id',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
      primaryEmailAddress: { emailAddress: 'test@example.com' },
    },
    isLoaded: true,
  }),
}));

// Import component after mocks
import { MfaLoginForm } from '../mfa-login-form';

describe('MfaLoginForm', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders MFA challenge heading', () => {
      render(<MfaLoginForm />);

      expect(
        screen.getByRole('heading', { name: /verify your identity|two-factor|mfa/i })
      ).toBeInTheDocument();
    });

    it('renders with TOTP method as default', () => {
      render(<MfaLoginForm />);

      // OTP inputs should be visible
      expect(screen.getByLabelText(/digit 1 of 6/i)).toBeInTheDocument();
    });

    it('renders all 6 OTP input fields', () => {
      render(<MfaLoginForm />);

      for (let i = 1; i <= 6; i++) {
        expect(screen.getByLabelText(`Digit ${i} of 6`)).toBeInTheDocument();
      }
    });

    it('renders verify button', () => {
      render(<MfaLoginForm />);

      expect(
        screen.getByRole('button', { name: /verify|confirm|submit/i })
      ).toBeInTheDocument();
    });

    it('renders method selection options', () => {
      render(<MfaLoginForm />);

      // Should show method tabs/buttons
      expect(
        screen.getByRole('button', { name: /authenticator|totp/i }) ||
        screen.getByRole('tab', { name: /authenticator|totp/i })
      ).toBeInTheDocument();
    });

    it('renders "Lost access?" link', () => {
      render(<MfaLoginForm />);

      expect(
        screen.getByText(/lost access|need help|trouble/i)
      ).toBeInTheDocument();
    });

    it('applies dark theme classes', () => {
      const { container } = render(<MfaLoginForm />);

      // Should have dark background classes
      expect(
        container.querySelector('[class*="bg-background-dark"], [class*="bg-slate-900"]')
      ).toBeInTheDocument();
    });
  });

  describe('Method Selection', () => {
    it('displays TOTP tab/button', () => {
      render(<MfaLoginForm />);

      expect(
        screen.getByRole('button', { name: /authenticator/i }) ||
        screen.getByRole('tab', { name: /authenticator/i })
      ).toBeInTheDocument();
    });

    it('displays backup code tab/button', () => {
      render(<MfaLoginForm />);

      expect(
        screen.getByRole('button', { name: /backup code/i }) ||
        screen.getByRole('tab', { name: /backup code/i })
      ).toBeInTheDocument();
    });

    it('switches to backup code method when clicked', async () => {
      render(<MfaLoginForm />);

      const backupButton = screen.getByRole('button', { name: /backup code/i });
      await act(async () => {
        await user.click(backupButton);
      });

      // Backup code input should appear
      expect(
        screen.getByRole('textbox', { name: /backup code/i }) ||
        screen.getByPlaceholderText(/backup/i)
      ).toBeInTheDocument();
    });

    it('switches back to TOTP method', async () => {
      render(<MfaLoginForm />);

      // Switch to backup
      const backupButton = screen.getByRole('button', { name: /backup code/i });
      await act(async () => {
        await user.click(backupButton);
      });

      // Switch back to TOTP
      const totpButton = screen.getByRole('button', { name: /authenticator/i });
      await act(async () => {
        await user.click(totpButton);
      });

      // OTP inputs should be visible again
      expect(screen.getByLabelText(/digit 1 of 6/i)).toBeInTheDocument();
    });

    it('displays SMS option when available', () => {
      render(<MfaLoginForm />);

      // SMS button should be visible if supported
      expect(
        screen.queryByRole('button', { name: /sms|text/i }) ||
        screen.queryByRole('tab', { name: /sms|text/i })
      ).toBeInTheDocument();
    });
  });

  describe('OTP Input Handling', () => {
    it('accepts numeric input', async () => {
      render(<MfaLoginForm />);

      const firstInput = screen.getByLabelText(/digit 1 of 6/i);
      await act(async () => {
        await user.type(firstInput, '1');
      });

      expect(firstInput).toHaveValue('1');
    });

    it('auto-advances to next input on digit entry', async () => {
      render(<MfaLoginForm />);

      const firstInput = screen.getByLabelText(/digit 1 of 6/i);
      await act(async () => {
        await user.type(firstInput, '1');
      });

      const secondInput = screen.getByLabelText(/digit 2 of 6/i);
      expect(document.activeElement).toBe(secondInput);
    });

    it('navigates back on backspace', async () => {
      render(<MfaLoginForm />);

      const firstInput = screen.getByLabelText(/digit 1 of 6/i);
      const secondInput = screen.getByLabelText(/digit 2 of 6/i);

      await act(async () => {
        await user.type(firstInput, '1');
      });

      expect(document.activeElement).toBe(secondInput);

      await act(async () => {
        await user.keyboard('{Backspace}');
      });

      expect(document.activeElement).toBe(firstInput);
    });

    it('handles paste of 6-digit code', async () => {
      render(<MfaLoginForm />);

      const firstInput = screen.getByLabelText(/digit 1 of 6/i);
      await act(async () => {
        await user.click(firstInput);
        await user.paste('123456');
      });

      // All inputs should be filled
      expect(screen.getByLabelText(/digit 1 of 6/i)).toHaveValue('1');
      expect(screen.getByLabelText(/digit 2 of 6/i)).toHaveValue('2');
      expect(screen.getByLabelText(/digit 3 of 6/i)).toHaveValue('3');
      expect(screen.getByLabelText(/digit 4 of 6/i)).toHaveValue('4');
      expect(screen.getByLabelText(/digit 5 of 6/i)).toHaveValue('5');
      expect(screen.getByLabelText(/digit 6 of 6/i)).toHaveValue('6');
    });

    it('ignores non-numeric input', async () => {
      render(<MfaLoginForm />);

      const firstInput = screen.getByLabelText(/digit 1 of 6/i);
      await act(async () => {
        await user.type(firstInput, 'a');
      });

      expect(firstInput).toHaveValue('');
    });
  });

  describe('Backup Code Input Handling', () => {
    it('accepts alphanumeric backup code', async () => {
      render(<MfaLoginForm />);

      // Switch to backup code method
      const backupButton = screen.getByRole('button', { name: /backup code/i });
      await act(async () => {
        await user.click(backupButton);
      });

      const input = screen.getByRole('textbox', { name: /backup code/i }) ||
        screen.getByPlaceholderText(/backup/i);

      await act(async () => {
        await user.type(input, 'ABCD1234');
      });

      expect(input).toHaveValue('ABCD1234');
    });

    it('accepts 8-character code', async () => {
      render(<MfaLoginForm />);

      const backupButton = screen.getByRole('button', { name: /backup code/i });
      await act(async () => {
        await user.click(backupButton);
      });

      const input = screen.getByRole('textbox', { name: /backup code/i }) ||
        screen.getByPlaceholderText(/backup/i);

      await act(async () => {
        await user.type(input, '12345678');
      });

      expect(input).toHaveValue('12345678');
    });
  });

  describe('Verification Flow', () => {
    it('calls attemptSecondFactor on TOTP verification', async () => {
      render(<MfaLoginForm />);

      // Enter code
      const firstInput = screen.getByLabelText(/digit 1 of 6/i);
      await act(async () => {
        await user.click(firstInput);
        await user.paste('123456');
      });

      // Click verify
      const verifyButton = screen.getByRole('button', { name: /verify/i });
      await act(async () => {
        await user.click(verifyButton);
      });

      expect(mockAttemptSecondFactor).toHaveBeenCalledWith({
        strategy: 'totp',
        code: '123456',
      });
    });

    it('calls attemptSecondFactor with backup_code strategy', async () => {
      render(<MfaLoginForm />);

      // Switch to backup code
      const backupButton = screen.getByRole('button', { name: /backup code/i });
      await act(async () => {
        await user.click(backupButton);
      });

      // Enter backup code
      const input = screen.getByRole('textbox', { name: /backup code/i }) ||
        screen.getByPlaceholderText(/backup/i);
      await act(async () => {
        await user.type(input, 'ABCD1234');
      });

      // Click verify
      const verifyButton = screen.getByRole('button', { name: /verify/i });
      await act(async () => {
        await user.click(verifyButton);
      });

      expect(mockAttemptSecondFactor).toHaveBeenCalledWith({
        strategy: 'backup_code',
        code: 'ABCD1234',
      });
    });

    it('disables form during verification', async () => {
      mockAttemptSecondFactor.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );

      render(<MfaLoginForm />);

      const firstInput = screen.getByLabelText(/digit 1 of 6/i);
      await act(async () => {
        await user.click(firstInput);
        await user.paste('123456');
      });

      const verifyButton = screen.getByRole('button', { name: /verify/i });
      await act(async () => {
        await user.click(verifyButton);
      });

      // Inputs should be disabled
      expect(firstInput).toBeDisabled();
      expect(verifyButton).toBeDisabled();
    });
  });

  describe('Loading States', () => {
    it('shows loading indicator during verification', async () => {
      mockAttemptSecondFactor.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );

      render(<MfaLoginForm />);

      const firstInput = screen.getByLabelText(/digit 1 of 6/i);
      await act(async () => {
        await user.click(firstInput);
        await user.paste('123456');
      });

      const verifyButton = screen.getByRole('button', { name: /verify/i });
      await act(async () => {
        await user.click(verifyButton);
      });

      // Loading indicator should be visible
      expect(
        screen.getByRole('button', { name: /verifying/i }) ||
        screen.getByLabelText(/loading/i) ||
        document.querySelector('.animate-spin')
      ).toBeInTheDocument();
    });

    it('button shows loading text', async () => {
      mockAttemptSecondFactor.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );

      render(<MfaLoginForm />);

      const firstInput = screen.getByLabelText(/digit 1 of 6/i);
      await act(async () => {
        await user.click(firstInput);
        await user.paste('123456');
      });

      const verifyButton = screen.getByRole('button', { name: /verify/i });
      await act(async () => {
        await user.click(verifyButton);
      });

      expect(screen.getByText(/verifying/i)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('displays error message on verification failure', async () => {
      mockAttemptSecondFactor.mockRejectedValue(new Error('Invalid code'));

      render(<MfaLoginForm />);

      const firstInput = screen.getByLabelText(/digit 1 of 6/i);
      await act(async () => {
        await user.click(firstInput);
        await user.paste('000000');
      });

      const verifyButton = screen.getByRole('button', { name: /verify/i });
      await act(async () => {
        await user.click(verifyButton);
      });

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });

    it('clears inputs after error', async () => {
      mockAttemptSecondFactor.mockRejectedValue(new Error('Invalid code'));

      render(<MfaLoginForm />);

      const firstInput = screen.getByLabelText(/digit 1 of 6/i);
      await act(async () => {
        await user.click(firstInput);
        await user.paste('000000');
      });

      const verifyButton = screen.getByRole('button', { name: /verify/i });
      await act(async () => {
        await user.click(verifyButton);
      });

      await waitFor(() => {
        expect(firstInput).toHaveValue('');
      });
    });

    it('refocuses first input after error', async () => {
      mockAttemptSecondFactor.mockRejectedValue(new Error('Invalid code'));

      render(<MfaLoginForm />);

      const firstInput = screen.getByLabelText(/digit 1 of 6/i);
      await act(async () => {
        await user.click(firstInput);
        await user.paste('000000');
      });

      const verifyButton = screen.getByRole('button', { name: /verify/i });
      await act(async () => {
        await user.click(verifyButton);
      });

      await waitFor(() => {
        expect(document.activeElement).toBe(firstInput);
      });
    });

    it('error message is visible in error alert', async () => {
      mockAttemptSecondFactor.mockRejectedValue(new Error('Invalid code'));

      render(<MfaLoginForm />);

      const firstInput = screen.getByLabelText(/digit 1 of 6/i);
      await act(async () => {
        await user.click(firstInput);
        await user.paste('000000');
      });

      const verifyButton = screen.getByRole('button', { name: /verify/i });
      await act(async () => {
        await user.click(verifyButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/invalid|incorrect|wrong/i)).toBeInTheDocument();
      });
    });
  });

  describe('Recovery Options', () => {
    it('shows recovery options when "Lost access?" is clicked', async () => {
      render(<MfaLoginForm />);

      const lostAccessLink = screen.getByText(/lost access|need help/i);
      await act(async () => {
        await user.click(lostAccessLink);
      });

      // Recovery options should be visible
      expect(
        screen.getByText(/backup code/i) ||
        screen.getByText(/recovery/i)
      ).toBeInTheDocument();
    });

    it('shows support contact information', async () => {
      render(<MfaLoginForm />);

      const lostAccessLink = screen.getByText(/lost access|need help/i);
      await act(async () => {
        await user.click(lostAccessLink);
      });

      expect(screen.getByText(/support|contact|help/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('all OTP inputs have aria-labels', () => {
      render(<MfaLoginForm />);

      for (let i = 1; i <= 6; i++) {
        expect(screen.getByLabelText(`Digit ${i} of 6`)).toBeInTheDocument();
      }
    });

    it('error message has role="alert"', async () => {
      mockAttemptSecondFactor.mockRejectedValue(new Error('Invalid code'));

      render(<MfaLoginForm />);

      const firstInput = screen.getByLabelText(/digit 1 of 6/i);
      await act(async () => {
        await user.click(firstInput);
        await user.paste('000000');
      });

      const verifyButton = screen.getByRole('button', { name: /verify/i });
      await act(async () => {
        await user.click(verifyButton);
      });

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });

    it('verify button has proper aria attributes during loading', async () => {
      mockAttemptSecondFactor.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );

      render(<MfaLoginForm />);

      const firstInput = screen.getByLabelText(/digit 1 of 6/i);
      await act(async () => {
        await user.click(firstInput);
        await user.paste('123456');
      });

      const verifyButton = screen.getByRole('button', { name: /verify/i });
      await act(async () => {
        await user.click(verifyButton);
      });

      expect(verifyButton).toHaveAttribute('aria-busy', 'true');
    });

    it('form has proper heading hierarchy', () => {
      render(<MfaLoginForm />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('buttons have visible focus indicators', () => {
      render(<MfaLoginForm />);

      const verifyButton = screen.getByRole('button', { name: /verify/i });
      expect(verifyButton.className).toMatch(/focus/);
    });
  });

  describe('Props and Callbacks', () => {
    it('calls onSuccess callback after successful verification', async () => {
      mockAttemptSecondFactor.mockResolvedValue({ status: 'complete' });
      const onSuccess = vi.fn();

      render(<MfaLoginForm onSuccess={onSuccess} />);

      const firstInput = screen.getByLabelText(/digit 1 of 6/i);
      await act(async () => {
        await user.click(firstInput);
        await user.paste('123456');
      });

      const verifyButton = screen.getByRole('button', { name: /verify/i });
      await act(async () => {
        await user.click(verifyButton);
      });

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });

    it('calls onCancel callback when cancel is clicked', async () => {
      const onCancel = vi.fn();

      render(<MfaLoginForm onCancel={onCancel} />);

      const cancelButton = screen.getByRole('button', { name: /cancel|back/i });
      await act(async () => {
        await user.click(cancelButton);
      });

      expect(onCancel).toHaveBeenCalled();
    });
  });

  describe('SMS Verification', () => {
    it('shows send code button for SMS method', async () => {
      render(<MfaLoginForm />);

      const smsButton = screen.getByRole('button', { name: /sms|text/i });
      await act(async () => {
        await user.click(smsButton);
      });

      expect(
        screen.getByRole('button', { name: /send code|request/i })
      ).toBeInTheDocument();
    });

    it('calls prepareSecondFactor for SMS', async () => {
      render(<MfaLoginForm />);

      const smsButton = screen.getByRole('button', { name: /sms|text/i });
      await act(async () => {
        await user.click(smsButton);
      });

      const sendButton = screen.getByRole('button', { name: /send code/i });
      await act(async () => {
        await user.click(sendButton);
      });

      expect(mockPrepareSecondFactor).toHaveBeenCalledWith({
        strategy: 'phone_code',
      });
    });

    it('shows OTP inputs after SMS is sent', async () => {
      mockPrepareSecondFactor.mockResolvedValue({});

      render(<MfaLoginForm />);

      const smsButton = screen.getByRole('button', { name: /sms|text/i });
      await act(async () => {
        await user.click(smsButton);
      });

      const sendButton = screen.getByRole('button', { name: /send code/i });
      await act(async () => {
        await user.click(sendButton);
      });

      await waitFor(() => {
        expect(screen.getByLabelText(/digit 1 of 6/i)).toBeInTheDocument();
      });
    });
  });

  describe('Verify Button State', () => {
    it('verify button is disabled when code is incomplete', () => {
      render(<MfaLoginForm />);

      const verifyButton = screen.getByRole('button', { name: /verify/i });
      expect(verifyButton).toBeDisabled();
    });

    it('verify button is enabled when code is complete', async () => {
      render(<MfaLoginForm />);

      const firstInput = screen.getByLabelText(/digit 1 of 6/i);
      await act(async () => {
        await user.click(firstInput);
        await user.paste('123456');
      });

      const verifyButton = screen.getByRole('button', { name: /verify/i });
      expect(verifyButton).toBeEnabled();
    });

    it('verify button disabled for incomplete backup code', async () => {
      render(<MfaLoginForm />);

      const backupButton = screen.getByRole('button', { name: /backup code/i });
      await act(async () => {
        await user.click(backupButton);
      });

      const input = screen.getByRole('textbox', { name: /backup code/i }) ||
        screen.getByPlaceholderText(/backup/i);
      await act(async () => {
        await user.type(input, 'ABC');
      });

      const verifyButton = screen.getByRole('button', { name: /verify/i });
      expect(verifyButton).toBeDisabled();
    });

    it('verify button enabled for complete backup code', async () => {
      render(<MfaLoginForm />);

      const backupButton = screen.getByRole('button', { name: /backup code/i });
      await act(async () => {
        await user.click(backupButton);
      });

      const input = screen.getByRole('textbox', { name: /backup code/i }) ||
        screen.getByPlaceholderText(/backup/i);
      await act(async () => {
        await user.type(input, 'ABCD1234');
      });

      const verifyButton = screen.getByRole('button', { name: /verify/i });
      expect(verifyButton).toBeEnabled();
    });
  });
});
