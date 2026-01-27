/**
 * Registration Component Unit Tests
 *
 * Story: 1-1-1 User Registration with Email/Password
 * Wireframe: hyyve_registration_-_step_1
 *
 * TDD RED PHASE: These tests are written to FAIL initially.
 * They test the custom registration components that extend Clerk's SignUp.
 *
 * Tests cover:
 * - Password strength indicator logic
 * - Password requirements validation
 * - Email validation utilities
 * - Registration form validation
 */

/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Components to be implemented (these imports will fail in RED phase)
import {
  PasswordStrengthIndicator,
  PasswordRequirements,
  RegistrationStepper,
} from '../index';
import {
  validatePassword,
  validateEmail,
  calculatePasswordStrength,
} from '../../../lib/validations/auth';

/**
 * Password Strength Indicator Tests
 *
 * Wireframe reference: lines 107-118
 * - 4-segment progress bar
 * - Color coding (red/yellow/green)
 * - Text feedback (Weak/Medium/Strong)
 */
describe('PasswordStrengthIndicator', () => {
  it('renders 4 segments in the strength meter', () => {
    render(<PasswordStrengthIndicator password="" />);

    const segments = screen.getAllByTestId(/strength-segment/);
    expect(segments).toHaveLength(4);
  });

  it('shows all segments as inactive when password is empty', () => {
    render(<PasswordStrengthIndicator password="" />);

    const segments = screen.getAllByTestId(/strength-segment/);
    segments.forEach((segment) => {
      expect(segment).toHaveAttribute('data-active', 'false');
    });
  });

  it('displays "Weak" text for weak passwords', () => {
    render(<PasswordStrengthIndicator password="abc" />);

    expect(screen.getByTestId('password-strength-text')).toHaveTextContent(/weak/i);
  });

  it('displays "Medium" text for medium strength passwords', () => {
    render(<PasswordStrengthIndicator password="password123" />);

    expect(screen.getByTestId('password-strength-text')).toHaveTextContent(/medium/i);
  });

  it('displays "Strong" text for strong passwords', () => {
    render(<PasswordStrengthIndicator password="SecurePass123!" />);

    expect(screen.getByTestId('password-strength-text')).toHaveTextContent(/strong/i);
  });

  it('colors segments red for weak passwords', () => {
    render(<PasswordStrengthIndicator password="abc" />);

    const firstSegment = screen.getByTestId('strength-segment-0');
    expect(firstSegment).toHaveClass('bg-red-500');
  });

  it('colors segments yellow for medium passwords', () => {
    render(<PasswordStrengthIndicator password="password123" />);

    // Medium should have 2 segments active in yellow
    const firstSegment = screen.getByTestId('strength-segment-0');
    const secondSegment = screen.getByTestId('strength-segment-1');
    expect(firstSegment).toHaveClass('bg-yellow-500');
    expect(secondSegment).toHaveClass('bg-yellow-500');
  });

  it('colors segments green for strong passwords', () => {
    render(<PasswordStrengthIndicator password="SecurePass123!" />);

    // Strong should have all 4 segments active in green
    const segments = screen.getAllByTestId(/strength-segment/);
    segments.forEach((segment) => {
      expect(segment).toHaveClass('bg-green-500');
    });
  });

  it('updates strength in real-time when password changes', async () => {
    const { rerender } = render(<PasswordStrengthIndicator password="" />);

    // Initially no strength text
    expect(screen.queryByTestId('password-strength-text')).not.toHaveTextContent(/weak|medium|strong/i);

    // Type weak password
    rerender(<PasswordStrengthIndicator password="abc" />);
    expect(screen.getByTestId('password-strength-text')).toHaveTextContent(/weak/i);

    // Type medium password
    rerender(<PasswordStrengthIndicator password="password123" />);
    expect(screen.getByTestId('password-strength-text')).toHaveTextContent(/medium/i);

    // Type strong password
    rerender(<PasswordStrengthIndicator password="SecurePass123!" />);
    expect(screen.getByTestId('password-strength-text')).toHaveTextContent(/strong/i);
  });
});

/**
 * Password Requirements Tests
 *
 * Wireframe reference: lines 120-133
 * - List of requirements with check/uncheck icons
 * - Real-time validation feedback
 */
describe('PasswordRequirements', () => {
  it('renders all three password requirements', () => {
    render(<PasswordRequirements password="" />);

    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/contains a number/i)).toBeInTheDocument();
    expect(screen.getByText(/contains a symbol or uppercase/i)).toBeInTheDocument();
  });

  it('shows unchecked state for all requirements when password is empty', () => {
    render(<PasswordRequirements password="" />);

    const requirements = screen.getAllByTestId(/requirement-/);
    requirements.forEach((req) => {
      expect(req).toHaveAttribute('data-met', 'false');
    });
  });

  it('shows checked state for "8 characters" when password has 8+ chars', () => {
    render(<PasswordRequirements password="12345678" />);

    expect(screen.getByTestId('requirement-min-length')).toHaveAttribute('data-met', 'true');
  });

  it('shows unchecked state for "8 characters" when password has <8 chars', () => {
    render(<PasswordRequirements password="1234567" />);

    expect(screen.getByTestId('requirement-min-length')).toHaveAttribute('data-met', 'false');
  });

  it('shows checked state for "contains a number" when password has digit', () => {
    render(<PasswordRequirements password="password1" />);

    expect(screen.getByTestId('requirement-number')).toHaveAttribute('data-met', 'true');
  });

  it('shows unchecked state for "contains a number" when password has no digit', () => {
    render(<PasswordRequirements password="password" />);

    expect(screen.getByTestId('requirement-number')).toHaveAttribute('data-met', 'false');
  });

  it('shows checked state for "contains a symbol" when password has special char', () => {
    render(<PasswordRequirements password="password!" />);

    expect(screen.getByTestId('requirement-symbol')).toHaveAttribute('data-met', 'true');
  });

  it('shows checked state for "contains a symbol" when password has uppercase letter', () => {
    render(<PasswordRequirements password="Password" />);

    expect(screen.getByTestId('requirement-symbol')).toHaveAttribute('data-met', 'true');
  });

  it('shows unchecked state for "contains a symbol" when password has no special char or uppercase', () => {
    render(<PasswordRequirements password="password123" />);

    expect(screen.getByTestId('requirement-symbol')).toHaveAttribute('data-met', 'false');
  });

  it('displays check icon for met requirements', () => {
    render(<PasswordRequirements password="SecurePass123!" />);

    const metRequirements = screen.getAllByTestId(/requirement-/);
    metRequirements.forEach((req) => {
      const icon = req.querySelector('[data-icon="check"]');
      expect(icon).toBeInTheDocument();
    });
  });

  it('displays circle icon for unmet requirements', () => {
    render(<PasswordRequirements password="" />);

    const unmetRequirements = screen.getAllByTestId(/requirement-/);
    unmetRequirements.forEach((req) => {
      const icon = req.querySelector('[data-icon="circle"]');
      expect(icon).toBeInTheDocument();
    });
  });
});

/**
 * Registration Stepper Tests
 *
 * Wireframe reference: lines 47-75
 * - 3-step progress indicator
 * - Active/completed/pending states
 */
describe('RegistrationStepper', () => {
  const steps = ['Account', 'Organization', 'Review'];

  it('renders all three steps', () => {
    render(<RegistrationStepper currentStep={0} steps={steps} />);

    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByText('Organization')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
  });

  it('shows step 1 as active when currentStep is 0', () => {
    render(<RegistrationStepper currentStep={0} steps={steps} />);

    expect(screen.getByTestId('step-0')).toHaveAttribute('data-state', 'active');
    expect(screen.getByTestId('step-1')).toHaveAttribute('data-state', 'pending');
    expect(screen.getByTestId('step-2')).toHaveAttribute('data-state', 'pending');
  });

  it('shows step 1 as completed and step 2 as active when currentStep is 1', () => {
    render(<RegistrationStepper currentStep={1} steps={steps} />);

    expect(screen.getByTestId('step-0')).toHaveAttribute('data-state', 'completed');
    expect(screen.getByTestId('step-1')).toHaveAttribute('data-state', 'active');
    expect(screen.getByTestId('step-2')).toHaveAttribute('data-state', 'pending');
  });

  it('shows all steps as completed when currentStep is beyond last step', () => {
    render(<RegistrationStepper currentStep={3} steps={steps} />);

    expect(screen.getByTestId('step-0')).toHaveAttribute('data-state', 'completed');
    expect(screen.getByTestId('step-1')).toHaveAttribute('data-state', 'completed');
    expect(screen.getByTestId('step-2')).toHaveAttribute('data-state', 'completed');
  });

  it('renders step numbers', () => {
    render(<RegistrationStepper currentStep={0} steps={steps} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('applies correct styles for active step', () => {
    render(<RegistrationStepper currentStep={0} steps={steps} />);

    const activeStep = screen.getByTestId('step-0');
    expect(activeStep).toHaveClass('bg-primary');
  });

  it('applies correct styles for pending step', () => {
    render(<RegistrationStepper currentStep={0} steps={steps} />);

    const pendingStep = screen.getByTestId('step-1');
    expect(pendingStep).toHaveClass('bg-[#2a2845]');
  });

  it('renders progress line between steps', () => {
    render(<RegistrationStepper currentStep={0} steps={steps} />);

    expect(screen.getByTestId('progress-line')).toBeInTheDocument();
    expect(screen.getByTestId('progress-line-active')).toBeInTheDocument();
  });

  it('progress line width reflects current step', () => {
    const { rerender } = render(<RegistrationStepper currentStep={0} steps={steps} />);

    // At step 0 (33% progress)
    let activeLine = screen.getByTestId('progress-line-active');
    expect(activeLine).toHaveStyle({ width: '33%' });

    // At step 1 (66% progress)
    rerender(<RegistrationStepper currentStep={1} steps={steps} />);
    activeLine = screen.getByTestId('progress-line-active');
    expect(activeLine).toHaveStyle({ width: '66%' });

    // At step 2 (100% progress)
    rerender(<RegistrationStepper currentStep={2} steps={steps} />);
    activeLine = screen.getByTestId('progress-line-active');
    expect(activeLine).toHaveStyle({ width: '100%' });
  });
});

/**
 * Password Validation Utility Tests
 */
describe('validatePassword', () => {
  it('returns invalid for empty password', () => {
    const result = validatePassword('');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password is required');
  });

  it('returns invalid for password under 8 characters', () => {
    const result = validatePassword('short');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters');
  });

  it('returns invalid for password without number', () => {
    const result = validatePassword('password');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one number');
  });

  it('returns invalid for password without symbol or uppercase', () => {
    const result = validatePassword('password123');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one symbol or uppercase letter');
  });

  it('returns valid for password meeting all requirements', () => {
    const result = validatePassword('SecurePass123!');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('returns detailed validation state for each requirement', () => {
    const result = validatePassword('password123');

    expect(result.requirements.minLength).toBe(true);
    expect(result.requirements.hasNumber).toBe(true);
    expect(result.requirements.hasSymbol).toBe(false);
  });
});

/**
 * Email Validation Utility Tests
 */
describe('validateEmail', () => {
  it('returns invalid for empty email', () => {
    const result = validateEmail('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Email is required');
  });

  it('returns invalid for email without @', () => {
    const result = validateEmail('invalidemail');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please enter a valid email address');
  });

  it('returns invalid for email without domain', () => {
    const result = validateEmail('user@');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please enter a valid email address');
  });

  it('returns invalid for email without TLD', () => {
    const result = validateEmail('user@domain');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please enter a valid email address');
  });

  it('returns valid for standard email format', () => {
    const result = validateEmail('user@example.com');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('returns valid for email with subdomain', () => {
    const result = validateEmail('user@mail.example.com');
    expect(result.isValid).toBe(true);
  });

  it('returns valid for email with plus sign', () => {
    const result = validateEmail('user+tag@example.com');
    expect(result.isValid).toBe(true);
  });

  it('returns valid for email with dots in local part', () => {
    const result = validateEmail('first.last@example.com');
    expect(result.isValid).toBe(true);
  });
});

/**
 * Password Strength Calculator Tests
 */
describe('calculatePasswordStrength', () => {
  it('returns "none" for empty password', () => {
    expect(calculatePasswordStrength('')).toBe('none');
  });

  it('returns "weak" for password under 8 characters', () => {
    expect(calculatePasswordStrength('abc')).toBe('weak');
  });

  it('returns "weak" for 8+ chars without number or symbol', () => {
    expect(calculatePasswordStrength('abcdefgh')).toBe('weak');
  });

  it('returns "medium" for 8+ chars with number only', () => {
    expect(calculatePasswordStrength('password123')).toBe('medium');
  });

  it('returns "medium" for 8+ chars with symbol only', () => {
    expect(calculatePasswordStrength('password!')).toBe('medium');
  });

  it('returns "strong" for 8+ chars with both number and symbol', () => {
    expect(calculatePasswordStrength('SecurePass123!')).toBe('strong');
  });

  it('returns "strong" for very long password with all requirements', () => {
    expect(calculatePasswordStrength('ThisIsAVeryLongPassword123!')).toBe('strong');
  });

  it('returns strength level as number for segment counting', () => {
    const strengthLevels = {
      none: 0,
      weak: 1,
      medium: 2,
      strong: 4,
    };

    expect(strengthLevels[calculatePasswordStrength('')]).toBe(0);
    expect(strengthLevels[calculatePasswordStrength('abc')]).toBe(1);
    expect(strengthLevels[calculatePasswordStrength('password123')]).toBe(2);
    expect(strengthLevels[calculatePasswordStrength('SecurePass123!')]).toBe(4);
  });
});

/**
 * Integration Tests - Password Field with Indicator
 */
describe('Password Field Integration', () => {
  // This test simulates the full password input experience
  it('updates all related components when password changes', async () => {
    // Mock combined component that includes input, strength, and requirements
    const PasswordFieldWithIndicator = () => {
      const [password, setPassword] = React.useState('');
      return (
        <div>
          <input
            data-testid="password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordStrengthIndicator password={password} />
          <PasswordRequirements password={password} />
        </div>
      );
    };

    render(<PasswordFieldWithIndicator />);

    const input = screen.getByTestId('password-input');

    // Type weak password
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(screen.getByTestId('password-strength-text')).toHaveTextContent(/weak/i);

    // Type medium password
    fireEvent.change(input, { target: { value: 'password123' } });
    expect(screen.getByTestId('password-strength-text')).toHaveTextContent(/medium/i);
    expect(screen.getByTestId('requirement-min-length')).toHaveAttribute('data-met', 'true');
    expect(screen.getByTestId('requirement-number')).toHaveAttribute('data-met', 'true');
    expect(screen.getByTestId('requirement-symbol')).toHaveAttribute('data-met', 'false');

    // Type strong password
    fireEvent.change(input, { target: { value: 'SecurePass123!' } });
    expect(screen.getByTestId('password-strength-text')).toHaveTextContent(/strong/i);
    expect(screen.getByTestId('requirement-min-length')).toHaveAttribute('data-met', 'true');
    expect(screen.getByTestId('requirement-number')).toHaveAttribute('data-met', 'true');
    expect(screen.getByTestId('requirement-symbol')).toHaveAttribute('data-met', 'true');
  });
});
