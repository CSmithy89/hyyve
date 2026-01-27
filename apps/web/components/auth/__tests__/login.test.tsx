/**
 * Login Form Unit Tests
 *
 * Story: 1-1-4 User Login with Email/Password
 * Wireframe: hyyve_login_page
 *
 * TDD RED PHASE: These tests are written to FAIL initially.
 */

/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { LoginForm } from '../index';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockPush,
  }),
}));

const mockCreate = vi.fn();
const mockPrepareSecondFactor = vi.fn();
const mockAttemptSecondFactor = vi.fn();
const mockSetActive = vi.fn();
vi.mock('@clerk/nextjs', () => ({
  useSignIn: () => ({
    isLoaded: true,
    signIn: {
      create: mockCreate,
      prepareSecondFactor: mockPrepareSecondFactor,
      attemptSecondFactor: mockAttemptSecondFactor,
    },
    setActive: mockSetActive,
  }),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreate.mockResolvedValue({ status: 'complete', createdSessionId: 'sess_123' });
    mockSetActive.mockResolvedValue(undefined);
  });

  it('renders heading and subtitle', () => {
    render(<LoginForm />);

    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    expect(
      screen.getByText(/enter your credentials to access your workspace/i)
    ).toBeInTheDocument();
  });

  it('renders email and password inputs', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i, { selector: 'input' })).toBeInTheDocument();
  });

  it('renders remember me checkbox and forgot password link', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /forgot password/i })).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const passwordInput = screen.getByLabelText(/password/i, { selector: 'input' }) as HTMLInputElement;
    expect(passwordInput.type).toBe('password');

    await user.click(screen.getByRole('button', { name: /toggle password visibility/i }));
    expect(passwordInput.type).toBe('text');
  });

  it('shows validation errors when submitting invalid form', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
  });

  it('calls sign-in action with form data on submit', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email address/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), 'ValidPass123!');
    await user.click(screen.getByLabelText(/remember me/i));

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        strategy: 'password',
        identifier: 'jane@example.com',
        password: 'ValidPass123!',
      });
    });
  });

  it('navigates to dashboard on successful login', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email address/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), 'ValidPass123!');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockSetActive).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays error message when login fails', async () => {
    mockCreate.mockRejectedValueOnce(new Error('Invalid credentials'));
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email address/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), 'WrongPass!');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/failed to sign in/i);
    });
  });
});
