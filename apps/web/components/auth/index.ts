/**
 * Auth Components
 *
 * Story: 1-1-1 User Registration with Email/Password
 * Story: 1-1-2 User Registration with Social Providers
 * Story: 1-1-3 Organization & Onboarding Setup
 * Story: 1-1-7 MFA Setup - Method Selection
 * Story: 1-1-8 MFA Setup - TOTP Authenticator
 * Story: 1-1-9 MFA Backup Codes Generation
 * Story: 1-1-10 MFA SMS Verification
 * Story: 1-1-11 MFA Login Verification
 * Story: 1-1-12 Enterprise SSO SAML Configuration
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
export type { RegistrationFormProps } from './registration-form';
export type { MfaMethodSelectionProps } from './mfa-method-selection';
export type { MfaMethodCardProps, MfaMethod } from './mfa-method-card';
export type { MfaInfoBoxProps } from './mfa-info-box';
export type { SkipMfaWarningModalProps } from './skip-mfa-warning-modal';
export type { TotpSetupFormProps } from './totp-setup-form';
export type { OtpInputProps } from './otp-input';
export type { QrCodeDisplayProps } from './qr-code-display';
export type { ManualKeyInputProps } from './manual-key-input';
export type { SetupTimerProps } from './setup-timer';
export type { TotpInfoBoxProps } from './totp-info-box';
export type { SkipTotpWarningModalProps } from './skip-totp-warning-modal';
export type { BackupCodesDisplayProps } from './backup-codes-display';
export type { BackupCodeCardProps } from './backup-code-card';
export type { SmsMfaSetupFormProps } from './sms-mfa-setup-form';
export type { PhoneInputProps } from './phone-input';
export type { MfaLoginFormProps } from './mfa-login-form';
export type { SamlConfigFormProps, SamlConfig } from './saml-config-form';
export type { SamlMetadataDisplayProps } from './saml-metadata-display';
export type { SsoConnectionCardProps } from './sso-connection-card';
export type { IdpProviderCardProps, IdpProvider } from './idp-provider-card';
export type { AttributeMappingRowProps } from './attribute-mapping-row';

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
export { RegistrationForm } from './registration-form';
export { MfaMethodSelection } from './mfa-method-selection';
export { MfaMethodCard } from './mfa-method-card';
export { MfaInfoBox } from './mfa-info-box';
export { SkipMfaWarningModal } from './skip-mfa-warning-modal';
export { TotpSetupForm } from './totp-setup-form';
export { OtpInput } from './otp-input';
export { QrCodeDisplay } from './qr-code-display';
export { ManualKeyInput } from './manual-key-input';
export { SetupTimer } from './setup-timer';
export { TotpInfoBox } from './totp-info-box';
export { SkipTotpWarningModal } from './skip-totp-warning-modal';
export { BackupCodesDisplay } from './backup-codes-display';
export { BackupCodeCard } from './backup-code-card';
export { SmsMfaSetupForm } from './sms-mfa-setup-form';
export { PhoneInput } from './phone-input';
export { MfaLoginForm } from './mfa-login-form';
export { SamlConfigForm } from './saml-config-form';
export { SamlMetadataDisplay } from './saml-metadata-display';
export { SsoConnectionCard } from './sso-connection-card';
export { IdpProviderCard } from './idp-provider-card';
export { AttributeMappingRow } from './attribute-mapping-row';
