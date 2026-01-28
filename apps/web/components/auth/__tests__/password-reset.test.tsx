/**
 * Password Reset Forms Unit Tests
 *
 * Story: 1-1-5 Password Reset Flow
 *
 * TDD RED PHASE: These tests are written to FAIL initially.
 */

/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { ForgotPasswordForm, ResetPasswordForm } from '../index';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockPush,
  }),
}));

const mockCreate = vi.fn();
const mockAttemptFirstFactor = vi.fn();
const mockSetActive = vi.fn();
vi.mock('@clerk/nextjs', () => ({
  useSignIn: () => ({
    isLoaded: true,
    signIn: {
      create: mockCreate,
      attemptFirstFactor: mockAttemptFirstFactor,
    },
    setActive: mockSetActive,
  }),
}));

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreate.mockResolvedValue({ status: 'needs_first_factor' });
  });

  it('renders heading and instructions', () => {
    render(<ForgotPasswordForm />);

    expect(screen.getByRole('heading', { name: /forgot your password/i })).toBeInTheDocument();
    expect(screen.getByText(/enter your email/i)).toBeInTheDocument();
  });

  it('renders email input and submit button', () => {
    render(<ForgotPasswordForm />);

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
  });

  it('shows validation error on empty submit', async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.click(screen.getByRole('button', { name: /send reset link/i }));

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('calls requestPasswordReset with form data', async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText(/email address/i), 'jane@example.com');
    await user.click(screen.getByRole('button', { name: /send reset link/i }));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        strategy: 'reset_password_email_code',
        identifier: 'jane@example.com',
      });
    });
  });

  it('shows success message after request', async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText(/email address/i), 'jane@example.com');
    await user.click(screen.getByRole('button', { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByText(/check your email/i)).toBeInTheDocument();
    });
  });

  it('shows generic success message when request fails', async () => {
    mockCreate.mockRejectedValueOnce(new Error('User not found'));
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText(/email address/i), 'missing@example.com');
    await user.click(screen.getByRole('button', { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByText(/if an account exists/i)).toBeInTheDocument();
    });
  });
});

describe('ResetPasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAttemptFirstFactor.mockResolvedValue({ status: 'complete', createdSessionId: 'sess_123' });
    mockSetActive.mockResolvedValue(undefined);
  });

  it('renders password fields', () => {
    render(<ResetPasswordForm token="reset-token" />);

    expect(screen.getByLabelText(/verification code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i, { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i, { selector: 'input' })).toBeInTheDocument();
  });

  it('shows validation error when passwords do not match', async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm token="reset-token" />);

    const codeInput = screen.getByLabelText(/verification code/i);
    await user.clear(codeInput);
    await user.type(codeInput, '123456');
    await user.type(screen.getByLabelText(/new password/i, { selector: 'input' }), 'ValidPass123!');
    await user.type(screen.getByLabelText(/confirm password/i, { selector: 'input' }), 'Mismatch123!');
    await user.click(screen.getByRole('button', { name: /reset password/i }));

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('calls resetPasswordWithToken with token and password', async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm token="reset-token" />);

    const codeInput = screen.getByLabelText(/verification code/i);
    await user.clear(codeInput);
    await user.type(codeInput, '123456');
    await user.type(screen.getByLabelText(/new password/i, { selector: 'input' }), 'ValidPass123!');
    await user.type(screen.getByLabelText(/confirm password/i, { selector: 'input' }), 'ValidPass123!');
    await user.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(mockAttemptFirstFactor).toHaveBeenCalledWith({
        strategy: 'reset_password_email_code',
        code: '123456',
        password: 'ValidPass123!',
      });
    });
  });

  it('navigates to login after success', async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm token="reset-token" />);

    const codeInput = screen.getByLabelText(/verification code/i);
    await user.clear(codeInput);
    await user.type(codeInput, '123456');
    await user.type(screen.getByLabelText(/new password/i, { selector: 'input' }), 'ValidPass123!');
    await user.type(screen.getByLabelText(/confirm password/i, { selector: 'input' }), 'ValidPass123!');
    await user.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(mockSetActive).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/auth/login');
    });
  });
});
