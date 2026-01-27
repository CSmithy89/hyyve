/**
 * Authentication Validation Utilities
 *
 * Story: 1-1-1 User Registration with Email/Password
 *
 * Provides validation logic for:
 * - Password strength calculation
 * - Password requirements checking
 * - Email format validation
 *
 * TDD RED PHASE: These implementations are stubs that will fail tests.
 * The actual logic will be implemented in the GREEN phase.
 */

import { z } from 'zod';

/**
 * Shared regex patterns to avoid duplication
 */
const NUMBER_REGEX = /\d/;
const SYMBOL_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
const UPPERCASE_REGEX = /[A-Z]/;

/**
 * Password strength levels
 */
export type PasswordStrength = 'none' | 'weak' | 'medium' | 'strong';

/**
 * Individual password requirement validation states
 */
export interface PasswordRequirementStatus {
  minLength: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
}

/**
 * Password validation result
 */
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  requirements: PasswordRequirementStatus;
}

/**
 * Email validation result
 */
export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates a password against all requirements
 *
 * Requirements from Story 1-1-1 AC4:
 * - At least 8 characters
 * - Contains a number
 * - Contains a symbol (uppercase letter OR special character)
 *
 * @param password - The password to validate
 * @returns Validation result with errors and requirement status
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  const requirements: PasswordRequirementStatus = {
    minLength: password.length >= 8,
    hasNumber: NUMBER_REGEX.test(password),
    // AC4: "Contains a symbol (uppercase, special character)" - either uppercase OR special char satisfies this
    hasSymbol: SYMBOL_REGEX.test(password) || UPPERCASE_REGEX.test(password),
  };

  if (!password) {
    errors.push('Password is required');
  }
  if (!requirements.minLength) {
    errors.push('Password must be at least 8 characters');
  }
  if (!requirements.hasNumber) {
    errors.push('Password must contain at least one number');
  }
  if (!requirements.hasSymbol) {
    errors.push('Password must contain at least one symbol or uppercase letter');
  }

  return {
    isValid: errors.length === 0,
    errors,
    requirements,
  };
}

/**
 * Zod schema for email validation
 * Per project-context.md: "ALWAYS validate external data with Zod at boundaries"
 */
const EmailSchema = z.string().email('Please enter a valid email address');

/**
 * Validates an email address format using Zod
 *
 * @param email - The email to validate
 * @returns Validation result with error message if invalid
 */
export function validateEmail(email: string): EmailValidationResult {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  const result = EmailSchema.safeParse(email);
  if (!result.success) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
}

/**
 * Calculates the overall password strength
 *
 * Strength levels:
 * - none: Empty password
 * - weak: Under 8 chars OR missing both number and symbol/uppercase
 * - medium: 8+ chars with either number OR symbol/uppercase
 * - strong: 8+ chars with both number AND symbol/uppercase
 *
 * @param password - The password to analyze
 * @returns Password strength level
 */
export function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return 'none';
  }

  const hasMinLength = password.length >= 8;
  const hasNumber = NUMBER_REGEX.test(password);
  // AC4: Symbol includes uppercase letters or special characters
  const hasSymbol = SYMBOL_REGEX.test(password) || UPPERCASE_REGEX.test(password);

  if (!hasMinLength) {
    return 'weak';
  }

  if (hasNumber && hasSymbol) {
    return 'strong';
  }

  if (hasNumber || hasSymbol) {
    return 'medium';
  }

  return 'weak';
}

/**
 * Maps password strength to number of active segments (out of 4)
 *
 * @param strength - The password strength level
 * @returns Number of segments to display as active (0-4)
 */
export function strengthToSegments(strength: PasswordStrength): number {
  const segmentMap: Record<PasswordStrength, number> = {
    none: 0,
    weak: 1,
    medium: 2,
    strong: 4,
  };

  return segmentMap[strength];
}

/**
 * Maps password strength to color class
 *
 * @param strength - The password strength level
 * @returns Tailwind CSS color class
 */
export function strengthToColor(strength: PasswordStrength): string {
  const colorMap: Record<PasswordStrength, string> = {
    none: 'bg-[#383663]', // inactive segment color from wireframe
    weak: 'bg-red-500',
    medium: 'bg-yellow-500',
    strong: 'bg-green-500',
  };

  return colorMap[strength];
}
