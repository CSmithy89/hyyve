/**
 * Auth Components
 *
 * Story: 1-1-1 User Registration with Email/Password
 * Story: 1-1-2 User Registration with Social Providers
 * Story: 1-1-3 Organization & Onboarding Setup
 *
 * This barrel file exports authentication-related components.
 * Components are implemented to support Clerk integration with
 * Hyyve custom UI elements (password strength indicator, stepper, social auth, etc.)
 */

// Re-export prop interfaces
export type { PasswordStrengthIndicatorProps } from './password-strength-indicator';
export type { PasswordRequirementsProps } from './password-requirements';
export type { RegistrationStepperProps } from './registration-stepper';
export type { SocialAuthButtonsProps, OAuthProvider } from './social-auth-buttons';
export type { OnboardingStepperProps } from './onboarding-stepper';
export type { OrganizationSetupFormProps } from './organization-setup-form';
export type { BuilderSelectionFormProps } from './builder-selection-form';
export type { LoginFormProps } from './login-form';
export type { ForgotPasswordFormProps } from './forgot-password-form';
export type { ResetPasswordFormProps } from './reset-password-form';

// Export components
export { PasswordStrengthIndicator } from './password-strength-indicator';
export { PasswordRequirements } from './password-requirements';
export { RegistrationStepper } from './registration-stepper';
export { SocialAuthButtons } from './social-auth-buttons';
export { OnboardingStepper } from './onboarding-stepper';
export { OrganizationSetupForm } from './organization-setup-form';
export { BuilderSelectionForm } from './builder-selection-form';
export { LoginForm } from './login-form';
export { ForgotPasswordForm } from './forgot-password-form';
export { ResetPasswordForm } from './reset-password-form';
