/**
 * Auth Components
 *
 * Story: 1-1-1 User Registration with Email/Password
 *
 * This barrel file exports authentication-related components.
 * Components are implemented to support Clerk integration with
 * Hyyve custom UI elements (password strength indicator, stepper, etc.)
 */

// Re-export prop interfaces
export type { PasswordStrengthIndicatorProps } from './password-strength-indicator';
export type { PasswordRequirementsProps } from './password-requirements';
export type { RegistrationStepperProps } from './registration-stepper';

// Export components
export { PasswordStrengthIndicator } from './password-strength-indicator';
export { PasswordRequirements } from './password-requirements';
export { RegistrationStepper } from './registration-stepper';
