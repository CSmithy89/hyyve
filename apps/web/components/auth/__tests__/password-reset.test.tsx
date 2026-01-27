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

const mockRequestReset = vi.fn();
const mockResetPassword = vi.fn();
vi.mock('../../../actions/auth', () => ({
  requestPasswordReset: (data: unknown) => mockRequestReset(data),
  resetPasswordWithToken: (data: unknown) => mockResetPassword(data),
}));

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRequestReset.mockResolvedValue({ success: true });
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
      expect(mockRequestReset).toHaveBeenCalledWith({ email: 'jane@example.com' });
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

  it('shows error when request fails', async () => {
    mockRequestReset.mockResolvedValueOnce({ success: false, error: 'User not found' });
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText(/email address/i), 'missing@example.com');
    await user.click(screen.getByRole('button', { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/user not found/i);
    });
  });
});

describe('ResetPasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockResetPassword.mockResolvedValue({ success: true });
  });

  it('renders password fields', () => {
    render(<ResetPasswordForm token="reset-token" />);

    expect(screen.getByLabelText(/new password/i, { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i, { selector: 'input' })).toBeInTheDocument();
  });

  it('shows validation error when passwords do not match', async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm token="reset-token" />);

    await user.type(screen.getByLabelText(/new password/i, { selector: 'input' }), 'ValidPass123!');
    await user.type(screen.getByLabelText(/confirm password/i, { selector: 'input' }), 'Mismatch123!');
    await user.click(screen.getByRole('button', { name: /reset password/i }));

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('calls resetPasswordWithToken with token and password', async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm token="reset-token" />);

    await user.type(screen.getByLabelText(/new password/i, { selector: 'input' }), 'ValidPass123!');
    await user.type(screen.getByLabelText(/confirm password/i, { selector: 'input' }), 'ValidPass123!');
    await user.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith({
        token: 'reset-token',
        password: 'ValidPass123!',
      });
    });
  });

  it('navigates to login after success', async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm token="reset-token" />);

    await user.type(screen.getByLabelText(/new password/i, { selector: 'input' }), 'ValidPass123!');
    await user.type(screen.getByLabelText(/confirm password/i, { selector: 'input' }), 'ValidPass123!');
    await user.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/auth/login');
    });
  });
});
