/**
 * Onboarding Validation Utilities
 *
 * Story: 1-1-3 Organization & Onboarding Setup
 *
 * Provides validation logic for:
 * - Organization name (2-50 chars, alphanumeric + spaces)
 * - Organization type selection
 * - Team size selection
 * - Builder selection
 */

import { z } from 'zod';

import {
  ORGANIZATION_TYPES,
  TEAM_SIZE_OPTIONS,
  BUILDER_OPTIONS,
} from '@/lib/constants/onboarding';

/**
 * Valid organization types derived from constants
 */
const validOrgTypes = ORGANIZATION_TYPES.map((t) => t.value);

/**
 * Valid team sizes derived from constants
 */
const validTeamSizes = TEAM_SIZE_OPTIONS.map((t) => t.value);

/**
 * Valid builder options derived from constants
 */
const validBuilders = BUILDER_OPTIONS.map((b) => b.value);

/**
 * Regex pattern for organization name validation
 * Allows alphanumeric characters and spaces only
 */
const ORG_NAME_REGEX = /^[a-zA-Z0-9\s]+$/;

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Organization form data interface
 */
export interface OrganizationFormData {
  name: string;
  type: string;
  teamSize: string;
}

/**
 * Organization form validation result
 */
export interface OrganizationFormValidationResult {
  isValid: boolean;
  errors: {
    name?: string;
    type?: string;
    teamSize?: string;
  };
}

/**
 * Zod schema for organization name
 */
const OrganizationNameSchema = z
  .string()
  .min(2, 'Organization name must be at least 2 characters')
  .max(50, 'Organization name must be no more than 50 characters')
  .regex(ORG_NAME_REGEX, 'Only alphanumeric characters and spaces allowed');

/**
 * Validates an organization name
 *
 * Requirements from Story 1-1-3 AC2:
 * - 2-50 characters
 * - Alphanumeric characters and spaces only
 *
 * @param name - The organization name to validate
 * @returns Validation result with error message if invalid
 */
export function validateOrganizationName(name: string): ValidationResult {
  if (!name || name.trim() === '') {
    return { isValid: false, error: 'Organization name is required' };
  }

  const result = OrganizationNameSchema.safeParse(name);
  if (!result.success) {
    const error = result.error.issues[0]?.message || 'Invalid organization name';
    return { isValid: false, error };
  }

  return { isValid: true };
}

/**
 * Validates an organization type selection
 *
 * @param type - The organization type value to validate
 * @returns Validation result with error message if invalid
 */
export function validateOrganizationType(type: string): ValidationResult {
  if (!type || type.trim() === '') {
    return { isValid: false, error: 'Please select an organization type' };
  }

  if (!validOrgTypes.includes(type)) {
    return { isValid: false, error: 'Please select a valid organization type' };
  }

  return { isValid: true };
}

/**
 * Validates a team size selection
 *
 * @param size - The team size value to validate
 * @returns Validation result with error message if invalid
 */
export function validateTeamSize(size: string): ValidationResult {
  if (!size || size.trim() === '') {
    return { isValid: false, error: 'Please select your team size' };
  }

  if (!validTeamSizes.includes(size)) {
    return { isValid: false, error: 'Please select a valid team size' };
  }

  return { isValid: true };
}

/**
 * Validates a builder selection
 *
 * @param builder - The builder value to validate
 * @returns Validation result with error message if invalid
 */
export function validateBuilderSelection(builder: string): ValidationResult {
  if (!builder || builder.trim() === '') {
    return { isValid: false, error: 'Please select a builder' };
  }

  if (!validBuilders.includes(builder)) {
    return { isValid: false, error: 'Please select a valid builder option' };
  }

  return { isValid: true };
}

/**
 * Validates the complete organization form
 *
 * @param data - The form data to validate
 * @returns Validation result with field-specific errors
 */
export function validateOrganizationForm(
  data: OrganizationFormData
): OrganizationFormValidationResult {
  const errors: OrganizationFormValidationResult['errors'] = {};

  const nameResult = validateOrganizationName(data.name);
  if (!nameResult.isValid) {
    errors.name = nameResult.error;
  }

  const typeResult = validateOrganizationType(data.type);
  if (!typeResult.isValid) {
    errors.type = typeResult.error;
  }

  const sizeResult = validateTeamSize(data.teamSize);
  if (!sizeResult.isValid) {
    errors.teamSize = sizeResult.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
