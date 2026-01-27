/**
 * Registration Form Unit Tests
 *
 * Story: 1-1-1 User Registration with Email/Password
 */

/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { RegistrationForm } from '../index';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockPush,
  }),
}));

const mockCreate = vi.fn();
const mockPrepare = vi.fn();
const mockAttemptVerify = vi.fn();
const mockSetActive = vi.fn();
vi.mock('@clerk/nextjs', () => ({
  useSignUp: () => ({
    isLoaded: true,
    signUp: {
      create: mockCreate,
      prepareEmailAddressVerification: mockPrepare,
      attemptEmailAddressVerification: mockAttemptVerify,
    },
    setActive: mockSetActive,
  }),
}));

describe('RegistrationForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreate.mockResolvedValue({ status: 'missing_requirements' });
    mockPrepare.mockResolvedValue(undefined);
  });

  it('renders heading, stepper, and inputs', () => {
    render(<RegistrationForm />);

    expect(screen.getByRole('heading', { name: /create your account/i })).toBeInTheDocument();
    expect(screen.getByTestId('step-0')).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/work email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i, { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm />);

    await user.click(screen.getByRole('button', { name: /continue/i }));

    expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
  });

  it('submits sign-up request to Clerk', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm />);

    await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/work email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), 'ValidPass123!');
    await user.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        emailAddress: 'jane@example.com',
        password: 'ValidPass123!',
        firstName: 'Jane',
        lastName: 'Doe',
      });
    });

    await waitFor(() => {
      expect(mockPrepare).toHaveBeenCalledWith({ strategy: 'email_code' });
    });
  });

  it('verifies email code and redirects on success', async () => {
    mockAttemptVerify.mockResolvedValueOnce({ status: 'complete', createdSessionId: 'sess_123' });
    const user = userEvent.setup();
    render(<RegistrationForm />);

    await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/work email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), 'ValidPass123!');
    await user.click(screen.getByRole('button', { name: /continue/i }));

    const codeInput = await screen.findByLabelText(/verification code/i);
    await user.type(codeInput, '123456');
    await user.click(screen.getByRole('button', { name: /verify email/i }));

    await waitFor(() => {
      expect(mockAttemptVerify).toHaveBeenCalledWith({ code: '123456' });
      expect(mockSetActive).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/auth/register/org');
    });
  });
});
