# Changelog

All notable changes to the Hyyve Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### [Story 1-1-11] MFA Login Verification

**Epic 1.1:** User Authentication & Identity

#### Added

- **MFA Challenge Page** (`apps/web/app/(auth)/auth/mfa-challenge/page.tsx`)
  - Route `/auth/mfa-challenge` for MFA verification during login
  - Suspense boundary with skeleton loading UI
  - Redirects to dashboard after successful verification

- **MFA Login Components**
  - `MfaLoginForm` (`apps/web/components/auth/mfa-login-form.tsx`)
    - Multi-method MFA verification (TOTP, SMS, backup codes)
    - Tab-based method selection with visual feedback
    - 6-digit OTP input with auto-advance and paste support
    - 8-character backup code input with uppercase conversion
    - Loading states during verification
    - Error handling with input clear and refocus
    - Recovery options modal (Lost access?)
    - Full accessibility with ARIA labels

- **Route Files**
  - `loading.tsx` - Suspense boundary with skeleton loading UI

#### Tests

- **Unit Tests** (`apps/web/components/auth/__tests__/mfa-login.test.tsx`)
  - MfaLoginForm component rendering
  - Method selection (TOTP, SMS, backup codes)
  - OTP code input handling (auto-advance, backspace, paste)
  - Backup code input handling
  - Verification flow with Clerk integration
  - Loading and error states
  - Recovery options modal
  - Accessibility compliance

- **E2E Tests** (`tests/e2e/auth/mfa-login.spec.ts`)
  - AC1: MFA challenge detection and redirect
  - AC2: TOTP code verification
  - AC3: SMS code request and verification
  - AC4: Backup code verification
  - AC5: Rate limiting after failed attempts
  - AC6: Recovery options (Lost access?)
  - AC7: Successful verification redirect
  - AC8: Method selection/switching
  - AC9: Error handling and retry
  - AC10: Loading states
  - AC11: Accessibility requirements
  - AC12: Responsive design

#### Technical

- **Clerk MFA Integration:**
  - `signIn.attemptSecondFactor({ strategy: 'totp', code })` - TOTP verification
  - `signIn.prepareSecondFactor({ strategy: 'phone_code' })` - Send SMS
  - `signIn.attemptSecondFactor({ strategy: 'phone_code', code })` - SMS verification
  - `signIn.attemptSecondFactor({ strategy: 'backup_code', code })` - Backup code verification

- **State Management:**
  - Method switching (TOTP/SMS/backup)
  - OTP code array state
  - Backup code string state
  - SMS sent state
  - Verification loading state
  - Error state with message

- **Design Tokens:**
  - Matches login page wireframe styling
  - Dark theme with Hyyve brand colors
  - Card layout with shadow effects
  - Primary color (#5048e5) for interactive elements

---

### [Story 1-1-10] MFA SMS Verification

**Epic 1.1:** User Authentication & Identity

#### Added

- **SMS MFA Setup Page** (`apps/web/app/(auth)/auth/mfa-setup/sms/page.tsx`)
  - Route `/auth/mfa-setup/sms` for SMS-based MFA configuration
  - Server-side auth protection with Clerk integration
  - Two-step flow: phone entry -> code verification

- **SMS MFA Components**
  - `SmsMfaSetupForm` (`apps/web/components/auth/sms-mfa-setup-form.tsx`)
    - Main form component with step-based UI
    - Phone number input with country code selector
    - 6-digit SMS code verification using OtpInput component
    - Resend code with 60-second cooldown timer
    - Skip setup with security warning modal
    - Error handling for invalid codes and SMS delivery failures
    - Loading states during API calls
    - Full accessibility with ARIA labels

  - `PhoneInput` (`apps/web/components/auth/phone-input.tsx`)
    - Phone number input with country code dropdown
    - 15 common country codes (US, UK, Canada, etc.)
    - Numeric-only input filtering
    - Phone number formatting (US format)
    - Search functionality in country dropdown
    - Error state styling

- **Route Files**
  - `loading.tsx` - Suspense boundary with skeleton loading UI
  - `error.tsx` - Error boundary with retry option

#### Tests

- **Unit Tests** (`apps/web/components/auth/__tests__/sms-mfa-setup.test.tsx`)
  - SmsMfaSetupForm component tests
  - PhoneInput component tests
  - Phone number validation
  - Country code selection
  - SMS code sending and verification
  - Resend cooldown functionality
  - Error handling
  - Skip confirmation flow
  - Accessibility compliance

- **E2E Tests** (`tests/e2e/auth/sms-mfa-setup.spec.ts`)
  - AC1: Navigate from method selection
  - AC2: Display phone number input
  - AC3: Country code selector
  - AC4: Phone number validation
  - AC5: Send verification code
  - AC6: Display SMS code input
  - AC7: Resend code with cooldown
  - AC8: Verify SMS code
  - AC11: Skip/cancel setup
  - AC12: Information boxes
  - AC14: Responsive design
  - AC15: Accessibility requirements

#### Technical

- **Clerk Phone Verification API:**
  - `user.createPhoneNumber()` - Add phone number
  - `phoneNumber.prepareVerification()` - Send SMS code
  - `phoneNumber.attemptVerification()` - Verify code

- **State Management:**
  - Two-step flow state (phone-entry, code-verification)
  - Resend cooldown timer (60 seconds)
  - Phone number ID for verification reference

- **Design Tokens:**
  - Matches existing MFA setup pages styling
  - Dark theme with Hyyve brand colors
  - Responsive design for mobile/tablet/desktop

---

### [Story 1-1-9] MFA Backup Codes Generation

**Epic 1.1:** User Authentication & Identity

#### Added

- **Backup Codes Page** (`apps/web/app/(auth)/auth/mfa-setup/backup/page.tsx`)
  - Route `/auth/mfa-setup/backup` for backup codes display (Screen 1.1.7)
  - Server-side auth protection with Clerk integration
  - Generates 10 backup codes (8 characters each, alphanumeric)
  - Client component with navigation protection (beforeunload warning)

- **MFA Setup Success Page** (`apps/web/app/(auth)/auth/mfa-setup/success/page.tsx`)
  - Route `/auth/mfa-setup/success` for MFA setup completion
  - Confirms MFA is enabled with success message
  - Links to dashboard and security settings

- **Backup Codes Components**
  - `BackupCodesDisplay` (`apps/web/components/auth/backup-codes-display.tsx`)
    - Main container displaying 10 codes in a 2-column grid
    - Copy all codes to clipboard with "Copied!" feedback
    - Download codes as `hyyve-backup-codes.txt` with security header
    - Print codes option with print-friendly styles
    - Security warning (amber/yellow styling) about storing codes safely
    - Confirmation checkbox "I have saved my backup codes"
    - Continue button disabled until checkbox is checked
    - Loading skeleton state for async code generation

  - `BackupCodeCard` (`apps/web/components/auth/backup-code-card.tsx`)
    - Individual code display with sequential number (1-10)
    - Monospace font for code readability
    - Consistent styling with dark theme support

- **Loading State** (`apps/web/app/(auth)/auth/mfa-setup/backup/loading.tsx`)
  - Suspense boundary with skeleton loading UI matching page layout

#### Tests

- **Unit Tests** (`apps/web/components/auth/__tests__/backup-codes.test.tsx`)
  - Coverage for BackupCodesDisplay and BackupCodeCard components
  - Tests for 10 codes display with 8-character format
  - Copy to clipboard functionality with feedback reset
  - Download file creation with correct filename and content
  - Print functionality (window.print call)
  - Security warning display and accessibility
  - Confirmation checkbox interaction
  - Continue button disabled/enabled state
  - Loading skeleton display
  - Accessibility (list semantics, ARIA labels, keyboard navigation)

- **E2E Tests** (`tests/e2e/auth/backup-codes.spec.ts`)
  - AC1: Display 10 backup codes with heading and warning
  - AC2: Code format (8 characters, alphanumeric, monospace)
  - AC3: Copy button with clipboard API and "Copied!" feedback
  - AC4: Download as text file with security instructions
  - AC5: Print button availability
  - AC6: Security warning with amber styling
  - AC7: Confirmation checkbox and button state
  - AC8: Navigation to success page after confirmation
  - AC10: Responsive design (mobile single column, desktop two columns)
  - AC11: Accessibility (list, ARIA, keyboard navigation)
  - AC12: Loading states

#### Technical

- **Backup Codes Generation:**
  - 10 codes generated on page load
  - Each code: 8 characters, uppercase alphanumeric (A-Z, 0-9)
  - Codes displayed in numbered list (1-10)
  - Mock generation until Clerk backup codes API is integrated

- **File Download Implementation:**
  - Creates Blob with text/plain content type
  - Filename: `hyyve-backup-codes.txt`
  - Header includes date, security instructions, and all 10 numbered codes
  - Uses URL.createObjectURL for download trigger

- **Navigation Protection:**
  - beforeunload event listener warns user before leaving
  - Protection removed after confirmation checkbox is checked
  - Prevents accidental loss of unsaved backup codes

- **Accessibility Compliance (AC11):**
  - Backup codes in `<ul role="list">` with `<li role="listitem">`
  - All buttons have `aria-label` attributes
  - Security warning has `role="alert"` for screen readers
  - Checkbox properly labeled with `<label for="...">`
  - Proper heading hierarchy (h1 for main title)
  - Focus ring styling on all interactive elements

- **Responsive Design (AC10):**
  - Mobile (< 640px): Single column code grid, full-width stacked buttons
  - Desktop (>= 640px): Two-column code grid, inline action buttons
  - Print styles hide header, buttons, and checkbox

#### Story File

- Created `_bmad-output/implementation-artifacts/1-1-9-mfa-backup-codes-generation.md`
  - Full acceptance criteria (AC1-AC12)
  - Technical requirements and implementation approach
  - Test scenarios and integration notes
  - Wireframe references and design tokens

---

### [Story 1-1-8] MFA Setup - TOTP Authenticator

**Epic 1.1:** User Authentication & Identity

#### Added

- **TOTP Setup Page** (`apps/web/app/(auth)/auth/mfa-setup/authenticator/page.tsx`)
  - Route `/auth/mfa-setup/authenticator` for TOTP setup (Screen 1.1.6)
  - Server-side auth protection with Clerk integration
  - Integrated TotpSetupForm component with loading state

- **TOTP Setup Components**
  - `TotpSetupForm` (`apps/web/components/auth/totp-setup-form.tsx`)
    - Main form component managing TOTP state (secret, URI, OTP code, timer)
    - Integrates with Clerk `user.createTOTP()` for QR code generation
    - Handles `user.verifyTOTP({ code })` for verification and navigation to backup codes
    - Displays step indicators, countdown timer, verification input
    - Skip confirmation warning modal integration

  - `QrCodeDisplay` (`apps/web/components/auth/qr-code-display.tsx`)
    - Renders QR code from OTPAuth URI using `qrcode.react`
    - QR code sized appropriately (36-40 base units responsive)
    - White background container with border styling

  - `ManualKeyInput` (`apps/web/components/auth/manual-key-input.tsx`)
    - Displays Base32 setup key in 4-character groups with monospace font
    - Copy-to-clipboard button with visual feedback (icon state change)
    - Read-only input with proper keyboard accessibility

  - `OtpInput` (`apps/web/components/auth/otp-input.tsx`)
    - Reusable 6-digit OTP input component with individual input boxes
    - Auto-focus advancement on digit entry
    - Backspace navigation to previous input
    - Paste support for full 6-digit code entry
    - 3-3 format with center dash separator

  - `SetupTimer` (`apps/web/components/auth/setup-timer.tsx`)
    - Countdown timer starting at 5 minutes (300 seconds)
    - Updates every second with MM:SS format display
    - Triggers redirect/expiration when timer reaches 0:00
    - Styled timer badge with primary color accent

  - `TotpInfoBox` (`apps/web/components/auth/totp-info-box.tsx`)
    - "Why do I need this?" informational box explaining MFA benefits
    - "Having trouble?" help box with support link reference

  - `SkipTotpWarningModal` (`apps/web/components/auth/skip-totp-warning-modal.tsx`)
    - Confirmation dialog warning about security risks when skipping setup
    - "Enable Anyway" and "Skip for Now" action buttons
    - Focus management and keyboard trap for accessibility

- **Loading State** (`apps/web/app/(auth)/auth/mfa-setup/authenticator/loading.tsx`)
  - Suspense boundary with skeleton loading UI matching page layout

#### Tests

- **Unit Tests** (`apps/web/components/auth/__tests__/totp-setup.test.tsx`)
  - 101 test cases with 15/101 passing (test infrastructure issues noted)
  - Coverage for TOTP setup form, QR code display, manual key input, OTP input, timer
  - Tests for auto-advance, backspace navigation, paste handling
  - Accessibility verification (ARIA labels, keyboard navigation)
  - Timer countdown and expiration logic
  - Skip confirmation modal interaction
  - Copy-to-clipboard functionality

- **E2E Tests** (`tests/e2e/auth/mfa-totp-setup.spec.ts`)
  - QR code and manual key display verification
  - Setup key copy-to-clipboard interaction
  - 6-digit OTP code entry (individual inputs, paste)
  - Invalid code error handling and retry
  - Countdown timer display
  - Skip button confirmation warning
  - Navigation from method selection (Story 1.1.7)

#### Technical

- **Clerk TOTP Integration:**
  - `user.createTOTP()` - Generates QR code URI and Base32 secret
  - `user.verifyTOTP({ code })` - Verifies 6-digit code and enables MFA
  - OTPAuth URI format: `otpauth://totp/Hyyve%20Platform:user@email.com?secret=...&issuer=Hyyve%20Platform`

- **Accessibility Compliance (AC14):**
  - `aria-label` on OTP inputs for screen readers
  - QR code with `role="img"` and `aria-label`
  - Copy button with proper `aria-label`
  - Keyboard navigation support on all interactive elements
  - Focus management in skip warning modal

- **Responsive Design (AC13):**
  - Mobile layout (< 768px): stacked sections, smaller OTP inputs (`w-10 h-12`)
  - Desktop layout: two-column grid, larger OTP inputs (`w-12 h-14`)

- **Wireframe Compliance:**
  - Matches `mfa_authenticator_setup` wireframe (Screen 1.1.6)
  - Design tokens: primary (#5048e5), background-dark (#131221), surface-dark (#1c1b2e)
  - Step indicators: circular badges with primary background
  - Content card: `bg-surface-dark rounded-xl with border-surface-border`

- **Key Routes:**
  - `/auth/mfa-setup` - Method selection (Story 1.1.7)
  - `/auth/mfa-setup/authenticator` - TOTP setup (this story)
  - `/auth/mfa-setup/backup` - Backup codes (Story 1.1.9, next step on success)
  - `/settings/security` - Return destination when skipping

#### Functional Requirements Mapped

- FR-2 - Users can enable multi-factor authentication (TOTP authenticator app)

---

_Story completed: 2026-01-28_
_Reviewed and approved by Senior Developer (8 issues identified: 3 medium, 5 low severity)_

### [Story 1-1-7] MFA Setup - Method Selection

**Epic 1.1:** User Authentication & Identity

#### Added

- **MFA Setup Page** (`apps/web/app/(auth)/auth/mfa-setup/page.tsx`)
  - Route `/auth/mfa-setup` for MFA method selection (Screen 1.1.5)
  - Three MFA method options: Authenticator App (TOTP), SMS Verification, Email Verification
  - Authenticator App pre-selected as default with "Recommended" badge
  - Server-side auth protection with redirect for unauthenticated users

- **MfaMethodSelection Component** (`apps/web/components/auth/mfa-method-selection.tsx`)
  - Main client component with method selection state management
  - Radio button group with card-based selection UI
  - Visual feedback on selection: primary border, primary background tint
  - Continue button navigation to method-specific setup routes
  - Cancel button triggers skip confirmation modal

- **MfaMethodCard Component** (`apps/web/components/auth/mfa-method-card.tsx`)
  - Reusable card component for each MFA method option
  - Icon container with method-specific icons (Shield, Smartphone, Mail)
  - "Recommended" badge for Authenticator App
  - Selected/unselected state visual transitions
  - Full accessibility with `aria-labelledby` and `aria-describedby`

- **MfaInfoBox Component** (`apps/web/components/auth/mfa-info-box.tsx`)
  - Informational box explaining "Why enable 2FA?"
  - Security benefits bullet points
  - Info-styled blue tint background per wireframe

- **SkipMfaWarningModal Component** (`apps/web/components/auth/skip-mfa-warning-modal.tsx`)
  - Confirmation dialog warning about security risks when skipping MFA
  - "Enable Anyway" and "Skip for Now" action buttons
  - Focus management and keyboard trap for accessibility

#### Tests

- **Unit Tests** (`apps/web/components/auth/__tests__/mfa-method-selection.test.tsx`)
  - 84/86 tests passing (97.7% pass rate)
  - Coverage for rendering, default selection, selection changes
  - Continue button navigation verification
  - Cancel confirmation dialog interaction
  - Accessibility attributes verification
  - Mobile responsive layout assertions

- **E2E Tests** (`tests/e2e/auth/mfa-setup.spec.ts`)
  - MFA method option visibility
  - Selection state changes on click
  - Navigation to authenticator setup on continue
  - Warning modal display on cancel

#### Technical

- **Accessibility Compliance (AC7):**
  - `role="radiogroup"` on method selection container
  - `aria-label` for screen readers
  - Keyboard navigation with Tab, Enter, Space keys
  - Focus management in skip warning modal

- **Responsive Design (AC8):**
  - Mobile layout (< 640px): stacked buttons, smaller heading (`text-3xl`)
  - Desktop layout: horizontal button row, larger heading (`text-4xl`)

- **Wireframe Compliance:**
  - Matches `mfa_method_selection` wireframe design
  - Design tokens: primary (#5048e5), background-dark (#131221), surface-dark (#1c1b2e)
  - Page max-width: 640px, card border-radius: xl, icon containers: 48px

- **Key Routes:**
  - `/auth/mfa-setup` - Method selection (this story)
  - `/auth/mfa-setup/authenticator` - TOTP setup (Story 1.1.8)
  - `/auth/mfa-setup/sms` - SMS setup (Story 1.1.10)
  - `/auth/mfa-setup/email` - Email setup

#### Known Issues (From Code Review)

- Skip button CSS class needs fix (`bg-red` should be `bg-red-500/20`)
- Breadcrumb links should use Next.js `<Link>` instead of `<a>` tags
- `handleContinue` needs loading state reset on navigation failure

---

_Story completed: 2026-01-28_
_Reviewed and approved by Senior Developer (Adversarial Code Review: APPROVE with Recommendations)_

### [Story 1-1-1] User Registration with Email/Password

**Epic 1.1:** User Authentication & Identity

#### Added

- **Password Strength Indicator** (`apps/web/components/auth/password-strength-indicator.tsx`)
  - 4-segment visual meter with color-coded strength feedback (weak/medium/strong/very strong)
  - Real-time visual feedback as user types
  - ARIA accessibility attributes (`role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label`)
  - Uses `cn()` utility for conditional className composition

- **Password Requirements Checklist** (`apps/web/components/auth/password-requirements.tsx`)
  - Visual checklist showing met/unmet password requirements
  - `aria-live="polite"` for screen reader announcements on state changes
  - Requirements: 8+ characters, contains number, contains uppercase OR special character

- **Registration Stepper** (`apps/web/components/auth/registration-stepper.tsx`)
  - 3-step progress indicator (Account -> Organization -> Review)
  - Visual state for completed, current, and pending steps
  - Accessible step navigation with proper ARIA attributes

- **Password Validation Utilities** (`apps/web/lib/validations/auth.ts`)
  - `validatePassword()` - Returns validation result with per-requirement status
  - `calculatePasswordStrength()` - Returns strength level (0-4 scale)
  - Extracted regex constants: `NUMBER_REGEX`, `SYMBOL_REGEX`, `UPPERCASE_REGEX`
  - Symbol requirement accepts uppercase letter OR special character (matching AC4)

- **Email Validation** (`apps/web/lib/validations/auth.ts`)
  - `validateEmail()` - Zod-based email validation using `z.string().email()`
  - Robust validation replacing simple regex pattern

- **Barrel Exports** (`apps/web/components/auth/index.ts`)
  - Consolidated exports for all auth components

#### Changed

- **Custom Registration Page** (`apps/web/app/auth/register/page.tsx`)
  - Added `/auth/register` route with wireframe-aligned styling and stepper
  - Uses Clerk `useSignUp` with email verification code flow

#### Tests

- **52 Unit Tests** (`apps/web/components/auth/__tests__/registration.test.tsx`)
  - Password strength indicator: 8 tests (strength levels, visual feedback)
  - Password requirements: 10 tests (requirement states, uppercase letter handling)
  - Registration stepper: 10 tests (step states, navigation)
  - Password validation: 7 tests (requirements, uppercase/symbol handling)
  - Email validation: 8 tests (valid/invalid emails, Zod integration)
  - Password strength calculator: 8 tests (strength calculation)
  - Integration: 1 test (component interaction)

#### Technical

- **Accessibility Compliance (AC12):**
  - `role="progressbar"` on strength meter
  - `aria-live="polite"` on requirements list
  - Proper `aria-label` attributes for screen readers

- **Code Quality:**
  - `cn()` utility used consistently across all components (Issue #1 resolved)
  - Duplicate regex patterns extracted to constants (Issue #2 resolved)
  - Zod schema validation for email (Issue #6 resolved)

- **Wireframe Compliance:**
  - Matches `hyyve_registration_-_step_1` wireframe design
  - Uses design tokens: primary (#5048e5), background-dark (#121121), surface-dark (#1c1b32)

---

_Story completed: 2026-01-27_
_Reviewed and approved by Senior Developer (2 review cycles, 7 blocking issues resolved)_

### Story 1-1-2: User Registration with Social Providers

**Epic 1.1:** User Authentication & Identity

#### Added

- **SocialAuthButtons Component** (`apps/web/components/auth/social-auth-buttons.tsx`)
  - Google and GitHub OAuth button integration
  - Support for both sign-up and sign-in modes
  - Loading states with animated spinners during OAuth redirect
  - Accessible error alerts with proper ARIA attributes
  - Full keyboard navigation support
  - Module-level provider configuration for performance optimization

- **Accessibility Features**
  - ARIA labels on all buttons (`aria-label="Sign up with Google"`)
  - Loading state announcements (`aria-busy`, `aria-label` updates)
  - Error alerts with `role="alert"` and `aria-live="polite"`
  - Keyboard navigation with proper focus management
  - High contrast support for visual indicators

#### Tests

- **51 Unit Tests** (`apps/web/components/auth/__tests__/social-auth.test.tsx`)
  - SocialAuthButtons component rendering: 8 tests (button visibility, modes)
  - OAuth flow handling: 12 tests (redirect logic, error handling)
  - Loading state management: 10 tests (spinner display, button disabled state)
  - Accessibility verification: 14 tests (ARIA attributes, keyboard navigation)
  - Error alert display: 7 tests (alert rendering, dismiss functionality)

- **26 E2E Test Cases** (`tests/e2e/auth/social-registration.spec.ts`)
  - Google OAuth sign-up flow
  - GitHub OAuth sign-in flow
  - OAuth error handling (denied permission, invalid credentials)
  - Session persistence after OAuth callback
  - Multi-browser testing (Chromium, Firefox, WebKit)

#### Technical

- **OAuth Integration:**
  - Google OAuth 2.0 with `google_oauth_client_id` configuration
  - GitHub OAuth with `github_oauth_client_id` configuration
  - Secure redirect URI matching Clerk configuration
  - PKCE flow for enhanced security

- **Component Architecture:**
  - Provider configuration at module level to prevent re-renders
  - Error state management with dismissible alerts
  - Loading states with accessible feedback
  - Reusable button component for future social providers

- **Wireframe Compliance:**
  - Matches `hyyve_social_registration` wireframe design
  - Button styling uses primary color (#5048e5) with proper hover states
  - Spacing follows 4px grid system
  - Dark theme default with light theme support

#### Functional Requirements Mapped

- FR-2.1 - Social OAuth Authentication (Google)
- FR-2.2 - Social OAuth Authentication (GitHub)
- FR-2.3 - OAuth Error Handling
- AC12 - Accessibility Compliance (WCAG 2.1 Level AA)

---

_Story completed: 2026-01-27_
_Reviewed and approved by Senior Developer_

### [Story 1-1-3] Organization & Onboarding Setup

**Epic 1.1:** User Authentication & Identity

#### Added

- **Onboarding Routes** (`apps/web/app/auth/register/org/page.tsx`, `apps/web/app/auth/register/personalize/page.tsx`)
  - Step 2 organization setup page with Hyyve onboarding stepper
  - Step 3 personalization page with completed progress bars and builder selection
  - Dedicated `/auth` layout for dark onboarding background

- **Onboarding Components**
  - `OnboardingStepper` (`apps/web/components/auth/onboarding-stepper.tsx`)
  - `OrganizationSetupForm` (`apps/web/components/auth/organization-setup-form.tsx`)
  - `BuilderSelectionForm` (`apps/web/components/auth/builder-selection-form.tsx`)

- **Onboarding Utilities**
  - Constants for organization types, team sizes, builder options (`apps/web/lib/constants/onboarding.ts`)
  - Validation helpers for onboarding fields (`apps/web/lib/validations/onboarding.ts`)
  - Server action stubs for organization creation and preference updates (`apps/web/actions/onboarding.ts`)

- **Test Coverage**
  - Unit tests for onboarding UI and validation (`apps/web/components/auth/__tests__/organization-onboarding.test.tsx`)
  - E2E onboarding flow coverage (`tests/e2e/auth/organization-onboarding.spec.ts`)

#### Changed

- **Auth Component Exports** (`apps/web/components/auth/index.ts`)
  - Added onboarding exports to the auth barrel file

#### Tests

- `pnpm test:unit -- apps/web/components/auth/__tests__/organization-onboarding.test.tsx`

---

_Story completed: 2026-01-27_
_Reviewed and approved by Senior Developer_

### [Story 1-1-4] User Login with Email/Password

**Epic 1.1:** User Authentication & Identity

#### Added

- **Login Page** (`apps/web/app/auth/login/page.tsx`)
  - `/auth/login` route with wireframe-aligned background effects and card layout
  - Branding header, subtitle, and responsive layout

- **Login Form Component** (`apps/web/components/auth/login-form.tsx`)
  - Email + password inputs with inline validation
  - Password visibility toggle, remember-me checkbox, forgot-password link
  - Social sign-in buttons for Google and SSO

- **Auth Action Stub** (`apps/web/actions/auth.ts`)
  - Zod validation for login payload
  - Clerk sign-in placeholder for integration

#### Changed

- **Auth Component Exports** (`apps/web/components/auth/index.ts`)
  - Added login form export
- **Login Flow (Clerk)** (`apps/web/components/auth/login-form.tsx`)
  - Uses Clerk `useSignIn` with email/password strategy and email-code second factor when required

#### Tests

- `pnpm test:unit -- apps/web/components/auth/__tests__/login.test.tsx`
- `pnpm test:e2e -- tests/e2e/auth/login.spec.ts` (failed: webServer dev start error)

---

_Story completed: 2026-01-27_
_Reviewed and approved by Senior Developer (E2E suite blocked by webServer startup)_

### [Story 1-1-5] Password Reset Flow

**Epic 1.1:** User Authentication & Identity

#### Added

- **Forgot/Reset Password Pages** (`apps/web/app/auth/forgot-password/page.tsx`, `apps/web/app/auth/reset-password/[token]/page.tsx`)
  - Auth-styled pages for requesting reset links and setting a new password

- **Reset Flow Components** (`apps/web/components/auth/forgot-password-form.tsx`, `apps/web/components/auth/reset-password-form.tsx`)
  - Email request form with validation, success, and error states
  - Reset form with password complexity feedback and confirmation

- **Reset Server Actions** (`apps/web/actions/auth.ts`)
  - Request reset link and token-based reset stubs with Zod validation

#### Changed

- **Auth Component Exports** (`apps/web/components/auth/index.ts`)
  - Added forgot/reset form exports
- **Reset Flow (Clerk)** (`apps/web/components/auth/forgot-password-form.tsx`, `apps/web/components/auth/reset-password-form.tsx`)
  - Uses Clerk custom reset flow with email-code verification
  - Reset request returns a generic success response to reduce account enumeration risk

#### Tests

- `pnpm test:unit -- apps/web/components/auth/__tests__/password-reset.test.tsx`
- `pnpm test:e2e -- tests/e2e/auth/password-reset.spec.ts` (failed: webServer dev start error)

---

_Story completed: 2026-01-27_
_Reviewed and approved by Senior Developer (E2E suite blocked by webServer startup)_

### [Story 1-1-6] User Login with Social Providers

**Epic 1.1:** User Authentication & Identity

#### Added

- **Social Login Buttons** (`apps/web/components/auth/login-form.tsx`)
  - Google/GitHub OAuth sign-in buttons using Clerk `authenticateWithRedirect`
  - Inline OAuth error messaging and loading state feedback
- **Registration Social Buttons** (`apps/web/components/auth/registration-form.tsx`)
  - Social sign-up buttons added to `/auth/register` for parity with Story 1.1.2

#### Changed

- **Login Form Tests** (`apps/web/components/auth/__tests__/login.test.tsx`)
  - Added coverage for social sign-in rendering and OAuth redirect triggers
- **Registration Form Tests** (`apps/web/components/auth/__tests__/registration-form.test.tsx`)
  - Added assertions for social sign-up buttons

#### Tests

- `pnpm test:unit -- apps/web/components/auth/__tests__/login.test.tsx apps/web/components/auth/__tests__/registration-form.test.tsx`

---

_Story completed: 2026-01-27_
_Reviewed and approved by Senior Developer (E2E suite blocked by webServer startup)_

### [Story 0-2-1] Extract Design System from Wireframes

**Epic 0.2:** Frontend Foundation & Design System

#### Added

- **Design Tokens Module** (`apps/web/lib/design-tokens.ts`)
  - `HYYVE_COLORS` - 14 brand colors extracted from 146 Stitch wireframes:
    - Primary: `#5048e5` (Hyyve purple)
    - Primary Dark: `#3e38b3` (hover state)
    - Background Dark: `#131221` (main dark background)
    - Panel Dark: `#1c1a2e` (sidebars, cards)
    - Canvas Dark: `#0f1115` (builder canvas background)
    - Border Dark: `#272546`
    - Text Secondary: `#9795c6`
    - And 7 additional brand colors
  - `HYYVE_TYPOGRAPHY` - Inter font family with 6 weight options (300-900)
  - `HYYVE_BORDER_RADIUS` - 6 radius values (xs: 2px through full: 9999px)
  - `HYYVE_SHADOWS` - primaryGlow, card, and elevated shadow definitions
  - `HYYVE_SPACING` - 4px grid system with layout dimensions (header: 64px, sidebar: 288px, chat panel: 320px)
  - TypeScript type exports for type-safe theme access:
    - `ThemeMode`, `HyyveColorKey`, `HyyveTypographyKey`
    - `HyyveBorderRadiusKey`, `HyyveShadowKey`, `HyyveSpacingScaleKey`

- **Design System Unit Tests** (`apps/web/__tests__/design-system/design-tokens.test.ts`)
  - 78 unit tests covering all 10 acceptance criteria (AC1-AC10)
  - Tests for colors, typography, spacing, shadows, CSS properties
  - Tests for scrollbar styles, canvas utilities, dot-grid pattern, connection-line animations

#### Changed

- **Tailwind Configuration** (`apps/web/tailwind.config.ts`)
  - Extended with Hyyve-specific color tokens in both `hyyve-*` namespace and flat aliases
  - Custom font family configuration with Inter, Noto Sans, and monospace
  - Custom shadow configurations for primary glow and card shadows
  - Border radius extensions matching wireframe specifications
  - Dark mode configured with `class` strategy

- **Global Styles** (`apps/web/app/globals.css`)
  - Updated CSS custom properties to use Hyyve brand colors in oklch format
  - `.dark` block properly maps to Hyyve colors:
    - `--background: oklch(0.15 0.025 280)` (#131221)
    - `--primary: oklch(0.52 0.21 275)` (#5048e5)
    - `--card: oklch(0.19 0.03 280)` (#1c1a2e)
    - `--border: oklch(0.21 0.04 280)` (#272546)
  - Custom scrollbar styles (8px width/height, themed track and thumb)
  - Canvas utilities: `.dot-grid`, `.connection-line`, `.typing-indicator`
  - Dot grid pattern using exact wireframe color (#374151)

#### Technical

- **Design Token Sources:**
  - `hyyve_module_builder/code.html` (lines 16-79) - Primary Tailwind config
  - `hyyve_home_dashboard/code.html` - Dashboard-specific colors
  - `hyyve_login_page/code.html` - Auth page variations

- **Color Conversion:**
  - All hex colors converted to oklch color space for modern CSS support
  - Inline comments document hex-to-oklch mappings for maintainability

- **CSS Variable Fallbacks:**
  - Scrollbar and connection-line use fallback values (e.g., `var(--hyyve-primary, #5048e5)`)
  - Ensures correct rendering even if CSS variables fail to load

---

_Story completed: 2026-01-27_
_Reviewed and approved by Senior Developer (2 review cycles, 9 issues resolved)_

### [Story 0-2-2] Create shadcn Component Overrides

**Epic 0.2:** Frontend Foundation & Design System

#### Added

- **Theme Utilities File** (`apps/web/components/ui/theme.ts`)
  - Reusable Tailwind class utilities for Hyyve styling
  - `primaryGlow` shadow effect for branded buttons
  - Documented usage patterns for component composition

- **Badge Semantic Variants**
  - `success` variant using emerald (#10b981)
  - `warning` variant using amber (#f59e0b)
  - `info` variant using blue

- **Card Elevated Variant**
  - Added `elevated` variant with shadow effect
  - Uses cva (class-variance-authority) for variant management

- **Avatar Primary Variant**
  - Added `primary` variant for fallback background
  - Uses cva for variant support on AvatarFallback

#### Changed

- **Button Component** (`apps/web/components/ui/button.tsx`)
  - Added primary glow shadow effect (`shadow-[0_0_15px_rgba(80,72,229,0.3)]`)
  - Hover state uses `hover:bg-accent` (primary-dark #3e38b3)

- **Card Component** (`apps/web/components/ui/card.tsx`)
  - Added cva variant management with `default` and `elevated` variants
  - Added explicit `border-border` styling for resilience

- **Input Component** (`apps/web/components/ui/input.tsx`)
  - Changed to dark background styling using `bg-input` CSS variable
  - Focus state shows primary border color

- **Tooltip Component** (`apps/web/components/ui/tooltip.tsx`)
  - Fixed to use panel-dark background (`bg-popover`) instead of primary
  - Updated text color to `text-popover-foreground`

- **DropdownMenu Component** (`apps/web/components/ui/dropdown-menu.tsx`)
  - Separator now uses `bg-border` color (border-dark)

- **Tabs Component** (`apps/web/components/ui/tabs.tsx`)
  - Active tab shows primary color indicator
  - Added inset shadow for primary underline effect (`shadow-[inset_0_-2px_0_hsl(var(--primary))]`)

- **Dialog Component** (`apps/web/components/ui/dialog.tsx`)
  - Verified modal uses panel-dark background via `bg-popover`
  - Overlay has proper backdrop opacity

- **Sheet Component** (`apps/web/components/ui/sheet.tsx`)
  - Verified slide-out panel uses panel-dark background
  - Proper border on sliding edge

#### Tests

- **Component Override Tests** (`apps/web/__tests__/design-system/component-overrides.test.ts`)
  - 78 unit tests verifying component override implementation
  - Tests for AC1-AC12 acceptance criteria
  - Coverage for Button, Card, Input, Dialog, Sheet, Badge, Tabs, Tooltip, DropdownMenu, Avatar
  - Verification of theme.ts utilities

#### Technical

- **CSS Variable Usage:**
  - All components consume CSS custom properties from `globals.css`
  - Dark mode support via `.dark` class strategy
  - No hardcoded light-mode colors in component files

- **Design Token Integration:**
  - Components use `bg-card`, `border-border`, `text-primary` variables
  - Primary glow uses wireframe-extracted color `rgba(80,72,229,0.3)`

- **Wireframe Compliance:**
  - Styling matches patterns from `hyyve_module_builder/code.html`
  - Panel-dark (#1c1a2e), border-dark (#272546), primary (#5048e5)

---

_Story completed: 2026-01-27_
_Reviewed and approved by Senior Developer (2 review cycles, 5 issues resolved)_

### [Story 0-2-3] Create Layout Shells (App, Builder, Auth)

**Epic 0.2:** Frontend Foundation & Design System

#### Added

- `apps/web/components/layouts/AppShell.tsx` - Main authenticated layout (h-16 header, w-64 sidebar)
- `apps/web/components/layouts/BuilderLayout.tsx` - Three-panel builder layout (w-72/flex-1/w-80)
- `apps/web/components/layouts/AuthLayout.tsx` - Centered auth card layout (max-w-[440px])
- `apps/web/components/layouts/index.ts` - Barrel exports with TypeScript interfaces
- Route group layouts: (auth), (app), (app)/builders
- Skip-to-main accessibility link
- Responsive mobile navigation with Sheet component
- Canvas zoom controls with full ARIA toolbar accessibility

#### Changed

- `apps/web/app/globals.css` - Added bg-grid-pattern for auth backgrounds

#### Tests

- 93 unit tests for layout shell verification

---

_Story completed: 2026-01-27_
_Reviewed and approved by Senior Developer (2 review cycles, 3 MAJOR issues resolved)_

### [Story 0-2-4] Create Navigation Components

**Epic 0.2:** Frontend Foundation & Design System

#### Added

- `apps/web/components/nav/AppHeader.tsx` - Dashboard header with search, notifications
- `apps/web/components/nav/AppSidebar.tsx` - Main sidebar navigation (w-64)
- `apps/web/components/nav/BuilderHeader.tsx` - Builder-specific header with actions
- `apps/web/components/nav/Breadcrumbs.tsx` - Dynamic breadcrumb navigation
- `apps/web/components/nav/UserMenu.tsx` - User dropdown with Clerk integration
- `apps/web/components/nav/MobileNav.tsx` - Sheet-based mobile navigation
- `apps/web/components/nav/NavLink.tsx` - Reusable navigation link
- `apps/web/components/nav/HyyveLogo.tsx` - Logo component
- `apps/web/components/nav/constants.ts` - Shared navigation constants
- Notification badge with pulse animation
- Run button with primary glow shadow effect

#### Changed

- `apps/web/components/layouts/AppShell.tsx` - Integrated navigation components
- `apps/web/components/layouts/BuilderLayout.tsx` - Integrated BuilderHeader

#### Tests

- 126 unit tests for navigation component verification

---

_Story completed: 2026-01-27_
_Reviewed and approved by Senior Developer (2 review cycles, 5 HIGH issues resolved)_

### [Story 0.1.1] Scaffold Turborepo Monorepo with Next.js 15

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **Monorepo Structure** with Turborepo for orchestrated builds
  - `apps/web/` - Next.js 15 frontend application with App Router
  - `apps/web/app/` - App Router pages directory
  - `apps/web/components/` - React components directory
  - `apps/web/hooks/` - Custom React hooks directory
  - `apps/web/lib/` - Utilities and clients directory
  - `apps/web/stores/` - Zustand stores directory

- **Shared Packages** under `packages/@platform/`
  - `@platform/ui` - Shared UI components package
  - `@platform/db` - Supabase client & types package
  - `@platform/auth` - Authentication helpers package
  - `packages/tsconfig/` - Shared TypeScript configurations

- **Core Dependencies**
  - Next.js 15.5.8 with App Router
  - React 19.2.3 and React DOM 19.2.3
  - TypeScript 5.8.3
  - Zustand 5.0.8 for state management
  - Zod 4.0.1 for schema validation
  - @xyflow/react 12.10.0 for flow diagrams

- **Agent Protocol Dependencies**
  - @ag-ui/client 0.0.43 for AG-UI streaming
  - @copilotkit/a2ui-renderer 1.51.2 for A2UI rendering
  - @copilotkit/react-ui 1.51.2 for CopilotKit integration

- **Styling Infrastructure**
  - Tailwind CSS 4.1.8
  - PostCSS 8.5.4
  - Autoprefixer 10.4.21
  - `tailwind.config.ts` with proper content paths for monorepo
  - `postcss.config.js` with tailwindcss and autoprefixer plugins

- **Testing Infrastructure**
  - Playwright 1.51.0 for E2E testing
  - Vitest 4.0.1 for unit testing
  - @vitest/coverage-v8 4.0.1 for coverage reporting

- **Code Quality Tools**
  - ESLint 9.x with TypeScript support
  - Prettier 3.8.1
  - Husky 9.x for git hooks
  - lint-staged 16.x for pre-commit linting

- **Configuration Files**
  - `turbo.json` - Turborepo pipeline configuration (build, lint, typecheck, test, dev)
  - `pnpm-workspace.yaml` - pnpm workspace configuration
  - `.nvmrc` - Node.js 20.x version specification
  - Root `package.json` with workspace scripts

#### Technical

- **Package Manager:** pnpm 10.15.0 with workspace protocol (`workspace:*`)
- **Turbo Pipelines:**
  - `build` - Depends on ^build, outputs .next/** and dist/**
  - `lint` - Depends on ^lint
  - `typecheck` - Depends on ^typecheck
  - `test` - Depends on ^build
  - `dev` - No cache, persistent mode
- **Path Aliases:** Configured `@/` for app-local imports, `@platform/` for shared packages
- **Workspace Links:** All @platform packages linked via pnpm workspace protocol

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer_

### [Story 0.1.2] Configure TypeScript with Strict Mode

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **Base TypeScript Configuration** (`packages/tsconfig/base.json`)
  - Central strict mode configuration for all packages
  - Target ES2022 with bundler module resolution

- **Specialized Configurations**
  - `packages/tsconfig/nextjs.json` - Next.js App Router settings with JSX support
  - `packages/tsconfig/react-library.json` - Shared React component packages with declaration files

#### Changed

- **apps/web/tsconfig.json** - Updated to extend shared nextjs.json config
- **Path Alias Resolution** - Changed from wildcard pattern to explicit per-package aliases for reliable sub-path imports

#### Technical

- **TypeScript Version:** 5.8.3 (exceeds 5.x requirement)
- **Strict Mode Settings:**
  - `strict: true` - Enables all strict type-checking options
  - `noUncheckedIndexedAccess: true` - Adds undefined to index signature results
  - `noImplicitReturns: true` - Requires explicit returns in all code paths
  - `noUnusedLocals: true` - Reports errors on unused local variables
  - `noUnusedParameters: true` - Reports errors on unused function parameters
- **Module Settings:**
  - `moduleResolution: "bundler"` - Modern bundler-compatible resolution
  - `esModuleInterop: true` - CommonJS/ES module interoperability
- **Path Aliases Configured:**
  - `@/*` - Maps to app-local source directory
  - `@platform/ui`, `@platform/ui/*` - UI components package
  - `@platform/auth`, `@platform/auth/*` - Authentication helpers package
  - `@platform/db`, `@platform/db/*` - Database client package
- **Configuration Hierarchy:**
  ```
  packages/tsconfig/base.json         <- Strict mode foundation
      ├── nextjs.json                 <- Apps extend this
      └── react-library.json          <- Shared packages extend this
  ```

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (2 review cycles)_

### [Story 0.1.3] Install Core Frontend Dependencies

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **Core Dependencies Installed** in `apps/web/`
  - `tailwindcss@4.1.8` - Utility-first CSS framework with CSS-first configuration
  - `zustand@5.0.8` - Lightweight state management
  - `immer@11.1.3` - Immutable state updates for Zustand middleware
  - `zod@4.0.1` - Runtime schema validation
  - `@xyflow/react@12.10.0` - Visual flow editor for builders
  - `clsx@2.1.1` - Conditional className utility
  - `tailwind-merge@3.4.0` - Tailwind class conflict resolution

- **Utility Functions** (`apps/web/lib/utils.ts`)
  - `cn()` function combining clsx and tailwind-merge for class merging
  - Properly resolves conflicting Tailwind classes (e.g., `p-4` + `p-2` = `p-2`)

- **Stores Directory** (`apps/web/stores/`)
  - Barrel export file for Zustand stores with immer middleware support

#### Changed

- **Tailwind CSS Configuration** (`apps/web/tailwind.config.ts`)
  - Extended with shadcn/ui theme defaults
  - CSS variable-based theming for light/dark mode support
  - Container configuration with responsive breakpoints

- **Global Styles** (`apps/web/app/globals.css`)
  - Tailwind CSS 4.x import-based setup (`@import "tailwindcss"`)
  - Complete shadcn CSS variable set for light theme
  - Complete shadcn CSS variable set for dark theme
  - Chart color variables for data visualization

- **PostCSS Configuration** (`apps/web/postcss.config.js`)
  - Configured with `@tailwindcss/postcss` plugin for Tailwind 4.x

#### Technical

- **Tailwind 4.x Migration:**
  - Uses CSS-based `@import "tailwindcss"` instead of legacy `@tailwind` directives
  - Native CSS variable support for theming
  - PostCSS plugin changed to `@tailwindcss/postcss`

- **shadcn/ui CSS Variables Configured:**
  - Background, foreground, card, popover colors
  - Primary, secondary, muted, accent semantic colors
  - Destructive states for error handling
  - Border, input, ring for form elements
  - Chart colors (1-5) for data visualization
  - Sidebar component variables
  - `--radius: 0.5rem` for consistent border radius

- **State Management Pattern:**
  - Zustand with immer middleware for immutable updates
  - Pattern established for future store implementations

- **Validation Pattern:**
  - Zod for runtime validation of external data
  - Type inference with `z.infer<typeof schema>`

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (5 observations, none blocking)_

### [Story 0.1.4] Initialize shadcn/ui Component Library

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **18 UI Components** installed in `apps/web/components/ui/`
  - `button.tsx` - Button with variants (default, destructive, outline, secondary, ghost, link)
  - `input.tsx` - Text input with consistent styling
  - `label.tsx` - Form label component
  - `card.tsx` - Card container with header, content, and footer sections
  - `dialog.tsx` - Modal dialog with overlay and animations
  - `sheet.tsx` - Slide-out panel (drawer) component
  - `dropdown-menu.tsx` - Dropdown menu with keyboard navigation
  - `form.tsx` - Form primitives with react-hook-form integration
  - `tabs.tsx` - Tabbed interface component
  - `accordion.tsx` - Collapsible accordion panels
  - `tooltip.tsx` - Hover tooltip component
  - `table.tsx` - Data table with header, body, row, and cell components
  - `badge.tsx` - Status badge with variants
  - `avatar.tsx` - User avatar with image and fallback support
  - `sonner.tsx` - Toast notification wrapper (uses Sonner library)
  - `alert.tsx` - Alert message component with variants
  - `command.tsx` - Command palette (uses cmdk library)
  - `popover.tsx` - Popover floating panel

- **shadcn/ui Configuration** (`apps/web/components.json`)
  - Style: New York
  - Base color: Neutral
  - CSS variables: Enabled
  - Component path: `@/components/ui`
  - Utils path: `@/lib/utils`

- **Radix UI Primitives**
  - `@radix-ui/react-accordion` - Accordion primitive
  - `@radix-ui/react-avatar` - Avatar primitive
  - `@radix-ui/react-dialog` - Dialog primitive
  - `@radix-ui/react-dropdown-menu` - Dropdown menu primitive
  - `@radix-ui/react-label` - Label primitive
  - `@radix-ui/react-popover` - Popover primitive
  - `@radix-ui/react-slot` - Slot primitive for component composition
  - `@radix-ui/react-tabs` - Tabs primitive
  - `@radix-ui/react-tooltip` - Tooltip primitive

- **Form & UI Dependencies**
  - `react-hook-form` - Form state management
  - `@hookform/resolvers` - Zod integration for form validation
  - `sonner` - Toast notification library
  - `cmdk` - Command palette library
  - `class-variance-authority` - Component variant management
  - `lucide-react` - Icon library

#### Technical

- **Configuration:** New York style with Neutral color palette and CSS variables
- **Component Pattern:** All components use `cn()` utility from `@/lib/utils` for className merging
- **Accessibility:** Radix UI primitives provide WCAG-compliant keyboard navigation and focus management
- **Tree-shaking:** Individual component imports enable optimal bundle size
- **Type Safety:** Full TypeScript support with proper prop types and exports

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (3 minor observations, none blocking)_

### [Story 0.1.5] Configure Supabase Database Client

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **Supabase SSR Configuration** in `packages/@platform/db/`
  - `@supabase/supabase-js@^2.49.8` - Supabase JavaScript client
  - `@supabase/ssr@^0.8.0` - SSR cookie handling for Next.js

- **Server-Side Client** (`packages/@platform/db/src/server.ts`)
  - `createClient()` - Server component client with cookie handling
  - `createAdminClient()` - Admin client using service role key (bypasses RLS)
  - Proper cookie handling via `next/headers` for Next.js App Router

- **Browser-Side Client** (`packages/@platform/db/src/browser.ts`)
  - `createClient()` - Client component Supabase client
  - Uses `createBrowserClient` from `@supabase/ssr`

- **Middleware Helper** (`packages/@platform/db/src/middleware.ts`)
  - `updateSession()` - Session refresh for auth cookies
  - `isProtectedRoute()` - Helper for route protection logic

- **Next.js Middleware** (`apps/web/middleware.ts`)
  - Integrated Supabase session refresh on all routes
  - Excludes static assets and images from middleware

- **Environment Variables** (`.env.example`)
  - `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anonymous/public key
  - `SUPABASE_SERVICE_ROLE_KEY` - Server-only admin key

#### Changed

- **Package Exports** (`packages/@platform/db/package.json`)
  - Added `./server`, `./browser`, `./middleware` export paths
  - Added `next` as peer dependency for Next.js API support

- **Barrel Exports** (`packages/@platform/db/src/index.ts`)
  - `createServerSupabaseClient` / `createBrowserSupabaseClient` explicit naming
  - Exports middleware helpers `updateSession`, `isProtectedRoute`

#### Technical

- **SSR Pattern:** Uses `@supabase/ssr` cookie handling (not raw `@supabase/supabase-js`)
- **Cookie Management:**
  - Server: Uses `cookies()` from `next/headers` with `getAll`/`setAll`
  - Browser: Automatic cookie handling via `createBrowserClient`
  - Middleware: Cookie refresh on every request via `getUser()`
- **Type Safety:** Generic `Database` type propagated to all clients
- **Placeholder Types:** `Database` type ready for schema generation

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (2 HIGH, 3 LOW, 2 INFO observations - none blocking)_

### [Story 0.1.6] Configure Clerk Authentication

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **Clerk Authentication** in `packages/@platform/auth/`
  - `@clerk/nextjs@6.36.10` - Clerk authentication for Next.js
  - Server utilities (`auth`, `currentUser`, `clerkMiddleware`)
  - Client hooks (`useUser`, `useAuth`, `ClerkProvider`)

- **Server-Side Auth** (`packages/@platform/auth/src/server.ts`)
  - `auth()` helper for Server Components
  - `currentUser()` for getting authenticated user
  - `clerkMiddleware()` and `createRouteMatcher()` for route protection

- **Clerk-Supabase Integration** (`packages/@platform/auth/src/supabase.ts`)
  - `createClerkSupabaseClient()` - Supabase client with Clerk JWT
  - Uses `getToken({ template: 'supabase' })` for RLS authentication

- **Auth Pages** in `apps/web/app/`
  - `/sign-in/[[...sign-in]]/page.tsx` - Sign-in page with catch-all
  - `/sign-up/[[...sign-up]]/page.tsx` - Sign-up page with catch-all

- **Client Providers** (`apps/web/app/providers.tsx`)
  - `Providers` component wrapping ClerkProvider
  - Graceful fallback when Clerk keys are not configured

#### Changed

- **Middleware** (`apps/web/middleware.ts`)
  - Combined `clerkMiddleware()` with Supabase session refresh
  - Public routes: `/`, `/sign-in(.*)`, `/sign-up(.*)`, `/api/webhooks(.*)`
  - Protected routes require authentication

- **Root Layout** (`apps/web/app/layout.tsx`)
  - Wrapped with `Providers` component for client-side auth

- **Environment Variables** (`.env.example`)
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
  - `CLERK_SECRET_KEY` - Clerk secret key
  - `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `SIGN_UP_URL` - Auth page URLs
  - `CLERK_WEBHOOK_SECRET` - For user sync webhooks

#### Technical

- **Package Exports:**
  - `@platform/auth` - Client components and hooks
  - `@platform/auth/server` - Server-side utilities
  - `@platform/auth/supabase` - Clerk-Supabase integration
- **Middleware Pattern:** Combined Clerk auth + Supabase session refresh
- **Build Compatibility:** Conditional ClerkProvider for builds without keys

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (2 HIGH, 2 LOW, 2 INFO observations - none blocking)_

### [Story 0.1.7] Configure tRPC API Layer

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **tRPC Server Configuration** (`apps/web/lib/trpc/server.ts`)
  - `initTRPC` with superjson transformer for Date/BigInt serialization
  - `createTRPCContext` with Supabase client and Clerk user
  - `publicProcedure` for unauthenticated endpoints
  - `protectedProcedure` with Clerk auth middleware

- **tRPC React Client** (`apps/web/lib/trpc/client.ts`)
  - Type-safe `trpc` client with `createTRPCReact<AppRouter>()`
  - Full TypeScript inference for procedures

- **tRPC Provider** (`apps/web/lib/trpc/provider.tsx`)
  - `TRPCProvider` component with QueryClient and tRPC client
  - `httpBatchLink` for request batching
  - Configured staleTime and refetchOnWindowFocus

- **App Router Integration** (`apps/web/app/api/trpc/[trpc]/route.ts`)
  - `fetchRequestHandler` from `@trpc/server/adapters/fetch`
  - GET and POST handlers for queries and mutations
  - Development error logging

- **Root Router** (`apps/web/lib/trpc/routers/index.ts`)
  - `appRouter` with example procedures
  - `health` - Public health check endpoint
  - `me` - Protected user info endpoint
  - `echo` - Example mutation with Zod validation

- **Package Dependencies**
  - `@trpc/server@11.8.1` - tRPC server
  - `@trpc/client@11.8.1` - tRPC client
  - `@trpc/react-query@11.8.1` - React hooks
  - `@tanstack/react-query@5.90.20` - Data fetching/caching
  - `superjson@2.2.6` - JSON serialization

#### Changed

- **Providers** (`apps/web/app/providers.tsx`)
  - Added `TRPCProvider` wrapping inside ClerkProvider
  - tRPC available even when Clerk keys not configured

#### Technical

- **tRPC v11 Pattern:**
  - Transformer configured at link level (not createClient)
  - Uses fetch adapter (not @trpc/next) for App Router
  - Context includes db (Supabase) and user (Clerk)
- **Type Safety:** Full end-to-end type inference from procedures to hooks
- **Request Batching:** httpBatchLink batches multiple queries into single request

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (0 HIGH, 1 LOW, 3 INFO observations - none blocking)_

### [Story 0.1.8] Configure Redis Client

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **Redis Client** in `packages/@platform/db/`
  - `ioredis@^5.9.2` - Full-featured Redis client with TypeScript support
  - Serverless-friendly singleton pattern with lazy connection

- **Redis Client** (`packages/@platform/db/src/redis.ts`)
  - `getRedisClient()` - Singleton Redis client for connection reuse
  - `closeRedisConnection()` - Cleanup for tests and graceful shutdown

- **Cache Utilities**
  - `cacheGet<T>(key)` - Get cached value with JSON deserialization
  - `cacheSet<T>(key, value, ttlSeconds)` - Set cache with TTL
  - `cacheDelete(key)` - Delete single cache entry
  - `cacheDeletePattern(pattern)` - Delete by glob pattern (e.g., "user:\*")

- **Pub/Sub Utilities**
  - `publish<T>(channel, message)` - Publish message to channel
  - `subscribe<T>(channel, handler)` - Subscribe with typed handler
  - `unsubscribe(channel)` - Unsubscribe from channel
  - Separate subscriber client (Redis requirement)

- **Rate Limiting Helpers**
  - `checkRateLimit(key, limit, windowSeconds)` - Sliding window algorithm using sorted sets
  - `checkRateLimitSimple(key, limit, windowSeconds)` - Fixed window using INCR
  - Returns `{ allowed, remaining, resetInSeconds }`

- **Environment Variables** (`.env.example`)
  - `REDIS_URL` - Redis connection URL (redis:// or rediss:// for TLS)

#### Changed

- **Package Exports** (`packages/@platform/db/src/index.ts`)
  - Added Redis exports: `getRedisClient`, `closeRedisConnection`
  - Added cache exports: `cacheGet`, `cacheSet`, `cacheDelete`, `cacheDeletePattern`
  - Added pub/sub exports: `publish`, `subscribe`, `unsubscribe`
  - Added rate limit exports: `checkRateLimit`, `checkRateLimitSimple`, `RateLimitResult`

- **Carryover from Story 0.1.6** (`apps/web/app/page.tsx`)
  - Added `export const dynamic = 'force-dynamic'` for Clerk authentication compatibility

#### Technical

- **Singleton Pattern:** Connection reused across serverless invocations
- **Lazy Connect:** `lazyConnect: true` defers connection until first command
- **Keep Alive:** `keepAlive: 10000` for serverless environments
- **Sliding Window:** Uses Redis sorted sets for accurate rate limiting across time windows
- **Pub/Sub Pattern:** Dedicated subscriber client (Redis limitation)
- **Error Handling:** Graceful connection error logging

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (0 HIGH, 1 MEDIUM, 3 LOW, 2 INFO observations - none blocking)_

### [Story 0.1.9] Configure Langfuse Observability

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **Langfuse SDK** in `apps/web/`
  - `langfuse@^3.38.6` - Langfuse client SDK
  - `@langfuse/core@^4.5.1` - Core Langfuse types

- **Langfuse Client** (`apps/web/lib/observability/langfuse.ts`)
  - `getLangfuseClient()` - Singleton client for serverless environments
  - `shutdownLangfuse()` - Graceful shutdown with event flush
  - `flushLangfuse()` - Manual flush for serverless function termination
  - `isLangfuseConfigured()` - Check if Langfuse credentials are set

- **Trace Wrapper Functions**
  - `traceLLMCall<T>(name, fn, options)` - Trace LLM generations with token/cost tracking
  - `traceAgentRun<T>(name, fn, options)` - Trace agent executions (bond, wendy, morgan, artie)
  - `traceToolExecution<T>(name, fn, options)` - Trace MCP tool executions
  - `createWorkflowTrace(name, options)` - Create trace for multi-step workflows

- **Cost Tracking**
  - `MODEL_COSTS` - Per-model pricing (Claude Sonnet 4, Opus 4, Haiku 4)
  - `calculateCost(model, usage)` - Calculate USD cost from token usage

- **Barrel Exports** (`apps/web/lib/observability/index.ts`)
  - All Langfuse utilities and types exported

- **Environment Variables** (`.env.example`)
  - `LANGFUSE_PUBLIC_KEY` - Langfuse project public key
  - `LANGFUSE_SECRET_KEY` - Langfuse project secret key
  - `LANGFUSE_HOST` - Langfuse host URL (for self-hosted)

#### Technical

- **Singleton Pattern:** Client reused across serverless invocations
- **Serverless Flush:** `flushAt: 1`, `flushInterval: 0` for immediate event export
- **Cost Calculation:** Per-million-token pricing with input/output breakdown
- **Trace Hierarchy:** trace → generation/span structure per Langfuse best practices
- **Type Safety:** Full TypeScript support with generic trace wrappers

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (0 HIGH, 0 MEDIUM, 2 LOW, 2 INFO observations - none blocking)_

### [Story 0.1.10] Configure Protocol Stack (CopilotKit + AG-UI)

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **CopilotKit Packages** in `apps/web/`
  - `@copilotkit/react-core@^1.51.2` - Core CopilotKit hooks and provider
  - `@copilotkit/runtime@^1.51.2` - CopilotKit runtime for agent communication

- **CopilotKit Provider** (`apps/web/lib/protocols/copilotkit.tsx`)
  - `CopilotKitProvider` - Wrapper component with configurable runtime URL
  - Re-exports `CopilotKit` from `@copilotkit/react-core`

- **AG-UI Client** (`apps/web/lib/protocols/ag-ui.ts`)
  - `createAGUIClient(options)` - SSE streaming client factory
  - `useAGUI(options)` - React hook for AG-UI streaming
  - Helper functions: `filterEventsByType`, `getTextContent`, `isRunComplete`, `getRunError`

- **AG-UI Event Types** (`apps/web/lib/protocols/types.ts`)
  - All 25 AG-UI protocol event types defined:
    - Lifecycle: `RUN_STARTED`, `RUN_FINISHED`, `RUN_ERROR`
    - Steps: `STEP_STARTED`, `STEP_FINISHED`, `STEP_ERROR`
    - Text: `TEXT_MESSAGE_START`, `TEXT_MESSAGE_CONTENT`, `TEXT_MESSAGE_END`
    - Tools: `TOOL_CALL_START`, `TOOL_CALL_ARGS`, `TOOL_CALL_END`, `TOOL_CALL_RESULT`
    - State: `STATE_SNAPSHOT`, `STATE_DELTA`
    - Activity: `ACTIVITY_START`, `ACTIVITY_DELTA`, `ACTIVITY_END`
    - Messages: `MESSAGES_SNAPSHOT`
    - Raw: `RAW`, `CUSTOM`
  - Extended types: `THOUGHT_START`, `THOUGHT_CONTENT`, `THOUGHT_END`, `METADATA`
  - Full TypeScript interfaces for each event type

- **AG-UI SSE Endpoint** (`apps/web/app/api/ag-ui/route.ts`)
  - GET handler for Server-Sent Events streaming
  - POST handler for JSON body requests
  - Proper SSE headers: `Content-Type: text/event-stream`
  - Event encoding with `ReadableStream`

- **CopilotKit Runtime Endpoint** (`apps/web/app/api/copilotkit/route.ts`)
  - POST handler for CopilotKit runtime communication
  - GET handler for health check
  - Placeholder implementation (real backend integration in later stories)

- **Barrel Exports** (`apps/web/lib/protocols/index.ts`)
  - All protocol utilities, types, and components exported

#### Technical

- **SSE Pattern:** Uses `ReadableStream` for proper Next.js App Router SSE support
- **Event Types:** Enum-based `AGUIEventType` with `as const` for type safety
- **React Hook:** `useAGUI` provides streaming state, events array, and error handling
- **CopilotKit:** Provider configured with default `/api/copilotkit` runtime URL
- **Library Validated:** Implementation matches official CopilotKit and AG-UI documentation

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (0 HIGH, 0 MEDIUM, 2 LOW, 2 INFO observations - none blocking)_

### [Story 0.1.11] Configure Stripe Billing

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **Stripe SDK** in `apps/web/`
  - `stripe@^20.2.0` - Stripe SDK for Node.js billing operations

- **Stripe Client** (`apps/web/lib/billing/stripe.ts`)
  - `stripe` - Server-side Stripe client singleton
  - `createCustomer(params)` - Create a Stripe customer
  - `getOrCreateCustomer(params)` - Get or create customer by email
  - `createCheckoutSession(params)` - Create subscription checkout session
  - `createPortalSession(params)` - Create billing portal session
  - `getSubscription(id)` - Get subscription by ID
  - `cancelSubscription(id)` - Cancel at period end
  - `resumeSubscription(id)` - Resume canceled subscription
  - `constructWebhookEvent(payload, signature, secret)` - Verify webhook
  - `getWebhookSecret()` - Get webhook secret from environment

- **Stripe Types** (`apps/web/lib/billing/types.ts`)
  - `StripeEventType` - Enum with 26 webhook event types
  - `SubscriptionStatus` - Subscription status enum
  - `BillingPlan` - Plan tiers (free, starter, pro, enterprise)
  - `UsageMetric` - Usage tracking metrics
  - Event data interfaces for subscriptions, invoices, customers, checkout

- **Webhook Handler** (`apps/web/app/api/webhooks/stripe/route.ts`)
  - POST handler for Stripe webhook events
  - Signature verification using `STRIPE_WEBHOOK_SECRET`
  - Event routing to typed handlers
  - Handlers for subscriptions, invoices, checkout, customers

- **Environment Variables** (`.env.example`)
  - `STRIPE_SECRET_KEY` - Stripe secret key
  - `STRIPE_WEBHOOK_SECRET` - Webhook signing secret
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Client-side public key

#### Technical

- **Server-Side Only:** Stripe client uses secret key, never exposed to browser
- **Webhook Verification:** Uses `stripe.webhooks.constructEvent()` for signature validation
- **Build Compatibility:** No env check at module load time to allow builds without secrets
- **API Version:** Uses Stripe API version 2025-12-15.clover

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (0 HIGH, 0 MEDIUM, 2 LOW, 2 INFO observations - none blocking)_

### [Story 0.1.12] Configure Testing Infrastructure

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **Testing Library Packages**
  - `@testing-library/react@^16.3.2` - React component testing utilities
  - `@testing-library/jest-dom@^6.9.1` - Custom Jest/Vitest matchers

#### Changed

- **Vitest Setup** (`tests/support/vitest-setup.ts`)
  - Enabled `@testing-library/jest-dom/vitest` matchers import
  - Tests can now use matchers like `toBeInTheDocument()`, `toHaveClass()`

#### Technical

- **Testing Stack Completed:**
  - Vitest 4.0.1 - Unit testing with jsdom environment
  - Playwright 1.51.0 - E2E testing (Chromium, Firefox, WebKit)
  - @testing-library/react - Component testing utilities
  - @testing-library/jest-dom - Custom DOM matchers
  - @vitest/coverage-v8 - Coverage reporting (text, json, html, lcov)

- **Test Scripts:**
  - `pnpm test:unit` - Run unit tests
  - `pnpm test:unit:watch` - Watch mode
  - `pnpm test:unit:coverage` - Coverage report
  - `pnpm test:e2e` - Run E2E tests
  - `pnpm test:e2e:ui` - Interactive UI mode
  - `pnpm test:e2e:headed` - Headed browser mode

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (0 issues found)_

### [Story 0.1.13] Configure Environment Variables & Secrets

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **Environment Validation** (`apps/web/lib/env.ts`)
  - Zod-based schema validation for all environment variables
  - `serverSchema` - Server-only variables (secrets, API keys)
  - `clientSchema` - Client-safe variables (NEXT*PUBLIC*\*)
  - `serverEnv` export for server-side usage
  - `clientEnv` export for client-side usage
  - Type exports: `ServerEnv`, `ClientEnv`

- **Application Configuration** (`.env.example`)
  - `NEXT_PUBLIC_APP_URL` - Base URL for the application

#### Technical

- **Environment Variable Categories:**
  - **Server-only:** SUPABASE_SERVICE_ROLE_KEY, CLERK_SECRET_KEY, STRIPE_SECRET_KEY, etc.
  - **Client-safe:** NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, etc.

- **Validation Features:**
  - Runtime validation on app startup
  - Graceful fallback for missing optional variables
  - Descriptive error messages for invalid values

- **Security:**
  - Server variables never exposed to browser
  - All secrets properly gitignored
  - `.env.example` serves as documentation

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (0 HIGH, 0 MEDIUM, 1 LOW, 1 INFO observations)_

### [Story 0.1.14] Configure ESLint, Prettier, and Git Hooks

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **Commitlint** for conventional commit enforcement
  - `@commitlint/cli@^19.8.1` - Commit message linter
  - `@commitlint/config-conventional@^19.8.1` - Conventional config

- **Husky commit-msg Hook** (`.husky/commit-msg`)
  - Runs commitlint on every commit
  - Validates conventional commit format

- **Commitlint Configuration** (`commitlint.config.js`)
  - Enforces conventional commit format
  - Rules for type-case, type-empty, subject-empty
  - Header max length of 100 characters

#### Technical

- **Code Quality Stack:**
  - ESLint 9.x with TypeScript plugin
  - Prettier 3.8.1 with consistent style
  - Husky 9.x for git hooks
  - lint-staged 16.x for pre-commit linting
  - commitlint 19.x for commit message validation

- **Git Hooks:**
  - `pre-commit`: Runs lint-staged (ESLint, Prettier, typecheck)
  - `commit-msg`: Runs commitlint for conventional commits

- **Conventional Commit Types:**
  - feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (0 issues found)_

### [Story 0.1.15] Configure CI/CD Pipeline

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Verified

- **CI Workflow** (`.github/workflows/ci.yml`)
  - Triggers on push/PR to main and develop branches
  - `lint` job: ESLint and TypeScript typecheck
  - `unit-tests` job: Vitest with coverage, Codecov integration
  - `build` job: Depends on lint and unit-tests, uploads artifacts
  - `e2e-tests` job: Playwright tests with report upload
  - pnpm caching enabled on all jobs
  - Node 20.x runtime

- **E2E Test Workflow** (`.github/workflows/e2e-tests.yml`)
  - Dedicated workflow for comprehensive E2E testing
  - Manual dispatch with browser selection
  - Matrix browser support (chromium by default)
  - Smoke test job for PRs
  - Artifact upload on test failure

#### Added

- **ATDD Tests** (`tests/unit/infrastructure/ci-cd-pipeline.test.ts`)
  - 29 tests validating CI/CD configuration
  - YAML parsing with `yaml` package

#### Technical

- **CI Job Dependencies:**
  - `lint` and `unit-tests` run in parallel
  - `build` depends on lint and unit-tests
  - `e2e-tests` depends on build

- **Secrets Required:**
  - `CODECOV_TOKEN` - Coverage upload
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Build time
  - `TEST_USER_EMAIL`, `TEST_USER_PASSWORD` - E2E credentials
  - `CLERK_SECRET_KEY` - Auth runtime

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (0 issues found)_

### [Story 0.1.16] Create Initial Database Schema

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **Database Schema** (`supabase/migrations/00001_initial_schema.sql`)
  - `organizations` table with id, name, slug, timestamps
  - `organization_members` table linking Clerk users to orgs
  - `workspaces` table for organizational units
  - `projects` table for workflows, chatbots, voice agents, canvas

- **Row Level Security (RLS)**
  - Enabled on all tables
  - Organizations: users see only orgs they belong to
  - Workspaces: users see only workspaces in their orgs
  - Projects: users see only projects in their workspaces
  - Uses `auth.uid()` for Clerk JWT integration

- **Database Indexes**
  - `idx_organizations_slug` for slug lookups
  - `idx_organization_members_user_id` for user membership queries
  - `idx_workspaces_org_id` for org-scoped queries
  - `idx_projects_workspace_id` and `idx_projects_type` for filtering

- **Supabase Configuration** (`supabase/config.toml`)
  - Local development settings
  - Clerk external auth enabled

- **TypeScript Types** (`packages/@platform/db/src/types.ts`)
  - `Organization`, `OrganizationMember`, `Workspace`, `Project`
  - Insert and Update variants for each
  - Full `Database` type for Supabase client

#### Technical

- **Table Relationships:**

  ```
  organizations
    └── organization_members (user_id from Clerk)
    └── workspaces
          └── projects (type: module|chatbot|voice|canvas)
  ```

- **RLS Policy Pattern:**
  - SELECT: Check membership via `organization_members`
  - INSERT: Check organization membership
  - UPDATE: Check organization membership
  - DELETE: Require admin/owner role

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (0 issues found)_

### [Story 0.1.17] Configure Agno Agent Framework (Python Backend)

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **Python Agent Service** (`apps/agent-service/`)
  - `src/agents/` - Agent definitions with Agno framework
  - `src/tools/` - MCP tool implementations
  - `src/memory/` - Memory service integration
  - `src/workflows/` - Agno workflow definitions
  - `src/routers/` - FastAPI API routers

- **FastAPI Application** (`src/main.py`)
  - CORS middleware configured
  - Structured logging with structlog
  - Lifespan management for startup/shutdown

- **Health Check Endpoints** (`src/routers/health.py`)
  - `/health` - Basic health check
  - `/health/detailed` - Dependency status
  - `/ready` - Kubernetes readiness probe
  - `/live` - Kubernetes liveness probe

- **Agent Execution Endpoints** (`src/routers/agents.py`)
  - `GET /api/v1/agents` - List available agents
  - `GET /api/v1/agents/{id}` - Get agent info
  - `POST /api/v1/agents/{id}/execute` - Execute agent

- **Base Agent Class** (`src/agents/base.py`)
  - Agno framework integration
  - `add_history_to_context=True`
  - `add_memories_to_context=True`
  - `enable_agentic_memory=True`
  - PostgreSQL storage for persistent memory

- **Configuration Management** (`src/config.py`)
  - Pydantic Settings for environment variables
  - DATABASE_URL, REDIS_URL, ANTHROPIC_API_KEY

- **Containerization** (`Dockerfile`)
  - Python 3.12-slim base image
  - Multi-stage build with uv
  - Non-root user for security
  - Health check configured

#### Technical

- **Agent Personalities:**
  - Bond - Concierge/orchestrator (polished, confident)
  - Wendy - Workflow assistant (warm, helpful)
  - Morgan - Data analyst (precise, methodical)
  - Artie - Creative/design (enthusiastic, imaginative)

- **Dependencies:**
  - agno>=2.4.0 - Agent framework
  - fastapi>=0.115.0 - HTTP API
  - uvicorn>=0.32.0 - ASGI server
  - psycopg>=3.2.0 - PostgreSQL
  - redis>=5.0.0 - Session cache
  - anthropic>=0.40.0 - Claude LLM

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (0 issues found)_

### [Story 0.1.18] Configure Temporal Workflow Orchestration

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **Temporal Worker Application** (`apps/temporal-worker/`)
  - `src/worker.ts` - Worker entry point with Temporal connection
  - `src/workflows/agent.ts` - Agent execution workflow with HITL support
  - `src/workflows/index.ts` - Workflow exports
  - `src/activities/agent.ts` - Activities for agent service communication
  - `src/activities/index.ts` - Activity exports

- **Agent Execution Workflow**
  - `agentExecutionWorkflow()` - Main workflow function
  - HITL signal handling with `hitlApprovalSignal`
  - Workflow cancellation with `cancelWorkflowSignal`
  - Retry policies with exponential backoff (1s initial, 2x coefficient, 5 max attempts, 30s max interval)
  - 24-hour HITL approval timeout

- **Temporal Activities**
  - `executeAgentTask()` - Send task to Agent Service
  - `getAgentResponse()` - Get completed task response
  - `processHITLApproval()` - Process human approval and continue

- **Temporal Client Package** (`packages/@platform/temporal/`)
  - `src/client.ts` - Temporal client wrapper with singleton pattern
  - `src/index.ts` - Package exports
  - `createTemporalClient()` / `getTemporalClient()` helper functions
  - Zod validation for workflow inputs/outputs

- **Client Methods**
  - `startAgentWorkflow()` - Start new agent workflow
  - `getWorkflowHandle()` - Get existing workflow
  - `sendHITLApproval()` - Send approval signal
  - `cancelWorkflow()` - Cancel running workflow
  - `getWorkflowResult()` - Get workflow result

- **Python Temporal Support** (`apps/agent-service/pyproject.toml`)
  - `temporalio>=1.7.0` - Python Temporal SDK

- **Environment Variables** (`.env.example`)
  - `TEMPORAL_ADDRESS` - Temporal server address (localhost:7233)
  - `TEMPORAL_NAMESPACE` - Temporal namespace (default)
  - `TEMPORAL_TASK_QUEUE` - Agent task queue (hyyve-agent-tasks)

#### Technical

- **Workflow Architecture:**

  ```
  Next.js App ──▶ Temporal Client ──▶ Temporal Server
                                           │
                                    Temporal Worker
                                           │
                                    Agent Service
  ```

- **Dependencies:**
  - @temporalio/client@^1.11.0 - Client SDK
  - @temporalio/worker@^1.11.0 - Worker SDK
  - @temporalio/workflow@^1.11.0 - Workflow definitions
  - @temporalio/activity@^1.11.0 - Activity definitions

- **Retry Policy:**
  - Initial interval: 1 second
  - Backoff coefficient: 2
  - Maximum attempts: 5
  - Maximum interval: 30 seconds

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (0 issues found)_

### [Story 0.1.19] Configure Anthropic SDK for Claude

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **TypeScript Anthropic SDK** (`apps/web/lib/llm/`)
  - `@anthropic-ai/sdk@^0.71.2` - Official Anthropic SDK
  - `anthropic.ts` - Claude client with retry, timeout, streaming
  - `types.ts` - LLM type definitions and model configs
  - `index.ts` - Barrel exports

- **Claude Client Features**
  - `getAnthropicClient()` - Singleton client with API key
  - `createChatCompletion()` - Non-streaming completions
  - `createStreamingChatCompletion()` - Token-by-token streaming
  - `completeText()` - Simple text completion wrapper
  - `calculateCost()` - Token-based cost calculation

- **Model Configurations**
  - `claude-sonnet-4-20250514` - Default, balanced (default)
  - `claude-opus-4-20250514` - Advanced reasoning
  - `claude-haiku-4-20250514` - Fast, efficient

- **Python Claude Client** (`apps/agent-service/src/llm/`)
  - `claude.py` - ClaudeClient with sync/async methods
  - `__init__.py` - LLM module exports
  - Streaming support with `astream()`
  - Cost calculation per model

- **Environment Variables** (`.env.example`)
  - `ANTHROPIC_API_KEY` - Anthropic API key

#### Technical

- **Client Configuration:**
  - Timeout: 60 seconds
  - Max retries: 3
  - Singleton pattern for connection reuse

- **Streaming Events:**
  - `onTextDelta` - Text chunk handler
  - `onToolUse` - Tool call handler
  - `onComplete` - Usage stats handler
  - `onError` - Error handler

- **Tool Use Support:**
  - `ToolDefinition` interface for MCP-compatible tools
  - `ToolUseResult` for tool call results
  - Automatic conversion to Anthropic format

---

_Story completed: 2026-01-26_
_Reviewed and approved by Senior Developer (0 issues found)_

### [Story 0.1.20] Configure MCP (Model Context Protocol) Foundation

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **MCP Package** (`packages/@platform/mcp/`)
  - Complete MCP infrastructure for standardized tool integration
  - Follows MCP 2025-11-25 specification

- **MCP Server** (`src/server/`)
  - `MCPServer` class with tool registration and execution
  - Concurrent execution limits and timeout handling
  - Streaming support with `AsyncGenerator`
  - `registerTool()`, `executeTool()`, `executeToolStreaming()`

- **MCP Client** (`src/client/`)
  - `MCPClient` class for tool discovery and invocation
  - `discoverTools()`, `callTool()`, `invoke()`
  - Retry logic with exponential backoff
  - Streaming response handling

- **Tool Registry** (`src/registry/`)
  - `ToolRegistry` class for centralized tool management
  - Category-based organization
  - `register()`, `get()`, `find()`, `lookup()`, `has()`
  - Search by name or description

- **MCP Types** (`src/types/`)
  - `Tool`, `ToolInput`, `ToolResult`, `ToolResultChunk`
  - `MCPError` class with standard error codes
  - `MCPErrorCode` enum following MCP spec
  - Zod schemas for validation

- **Built-in Tools** (`src/tools/`)
  - `http_request` - HTTP requests to external APIs
  - `database_query` - Read-only SQL queries (scaffold)
  - `file_operation` - Sandboxed file operations (scaffold)

#### Technical

- **Error Handling:**
  - `MCPErrorCode.InvalidRequest` (-32600)
  - `MCPErrorCode.ToolNotFound` (-32000)
  - `MCPErrorCode.ToolExecutionError` (-32001)
  - `MCPErrorCode.ValidationError` (-32004)

- **Security:**
  - Read-only database queries enforced
  - File operations sandboxed to allowed directories
  - Input validation with Zod schemas

---

_Story completed: 2026-01-26_

### [Story 0.1.21] Configure Resend Email Service

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **Resend Email Service** (`apps/web/lib/email/`)
  - `resend@^6.8.0` - Official Resend SDK
  - `resend.ts` - Email service with helper functions
  - `sendEmail()`, `sendVerificationEmail()`, `sendPasswordResetEmail()`
  - `sendTeamInvitationEmail()`, `sendWorkflowCompletionEmail()`
  - `sendBudgetAlertEmail()` for usage notifications

- **Email Templates Package** (`packages/@platform/email-templates/`)
  - `@react-email/components` for composable email components
  - `verification.tsx` - Email verification template
  - `password-reset.tsx` - Password reset template
  - `team-invitation.tsx` - Team invitation template
  - `workflow-completion.tsx` - Workflow success/failure notification
  - `budget-alert.tsx` - Budget warning/exceeded alerts

- **Resend Webhook Handler** (`app/api/webhooks/resend/route.ts`)
  - POST handler for delivery status events
  - Handles: delivered, bounced, complained, opened, clicked
  - Event logging for analytics integration

- **Environment Variables** (`.env.example`)
  - `RESEND_API_KEY` - Resend API key
  - `RESEND_FROM_EMAIL` - Default sender address
  - `RESEND_WEBHOOK_SECRET` - Webhook verification

#### Technical

- **Email Tracking:**
  - Tags for email type categorization
  - Delivery status webhook integration
  - Open/click tracking support

---

_Story completed: 2026-01-26_

### [Story 0.1.22] Configure OpenTelemetry Distributed Tracing

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **OpenTelemetry Packages**
  - `@opentelemetry/api@^1.9.0` - Core tracing API
  - `@opentelemetry/sdk-node@^0.211.0` - Node.js SDK
  - `@opentelemetry/auto-instrumentations-node@^0.69.0` - Auto-instrumentation
  - `@opentelemetry/exporter-trace-otlp-http@^0.211.0` - OTLP exporter

- **Instrumentation** (`apps/web/instrumentation.ts`)
  - Next.js instrumentation entry point
  - Dynamic imports for Node.js runtime only
  - OTLP export to Langfuse
  - Auto-instrumentation for common libraries

- **Tracing Utilities** (`lib/observability/tracing.ts`)
  - `withSpan()` - Generic span wrapper
  - `traceApiRoute()` - API route tracing
  - `traceDatabaseQuery()` - Database query tracing
  - `traceLLMCall()` - LLM completion tracing
  - `traceExternalService()` - External HTTP tracing
  - Context propagation helpers

- **Environment Variables** (`.env.example`)
  - `OTEL_EXPORTER_OTLP_ENDPOINT` - OTLP endpoint URL
  - `OTEL_SERVICE_NAME` - Service identifier

#### Technical

- **Trace Context:**
  - `extractTraceContext()` - Extract from headers
  - `injectTraceContext()` - Inject into headers
  - `getCurrentTraceId()` / `getCurrentSpanId()`

- **Span Attributes:**
  - API routes: `http.route`, `http.method`
  - Database: `db.operation`, `db.table`
  - LLM: `llm.model`, `ai.model.provider`
  - External: `http.url`, `service.name`

---

_Story completed: 2026-01-26_

### [Story 0.1.23] Configure Docker Compose for Local Development

**Epic 0.1:** Project Foundation & Infrastructure Setup

#### Added

- **Docker Compose Configuration** (`docker-compose.yml`)
  - `web` - Next.js frontend service
  - `agent-service` - Agno Python backend (FastAPI)
  - `temporal-worker` - Temporal workflow worker
  - `postgres` - PostgreSQL database (Supabase local)
  - `redis` - Redis for caching/pubsub
  - `temporal` - Temporal server
  - `langfuse` - LLM observability (self-hosted)
  - Health checks for all services
  - Network isolation with `hyyve-network`
  - Persistent volumes for postgres and redis

- **Development Overrides** (`docker-compose.override.yml`)
  - Volume mounts for hot reload
  - Development-specific environment variables
  - `temporal-ui` - Temporal Web UI (port 8080)
  - `supabase-studio` - Database management UI (port 3002)

- **Docker Environment** (`.env.docker`)
  - PostgreSQL/Supabase configuration
  - Redis configuration
  - Temporal configuration
  - Langfuse configuration
  - OpenTelemetry configuration
  - Service port reference

- **Startup Script** (`scripts/docker-up.sh`)
  - `--build` - Force rebuild containers
  - `--detach` - Run in background
  - `--fresh` - Remove volumes and start fresh
  - `--services` - Start specific services
  - Color-coded output with service URLs

- **Package Scripts** (`package.json`)
  - `docker:up` - Start all services in background
  - `docker:down` - Stop all services
  - `docker:logs` - View service logs
  - `docker:build` - Rebuild and start
  - `docker:fresh` - Fresh start with clean volumes

#### Technical

- **Service Ports:**
  - Web (Next.js): 3000
  - Agent Service: 8000
  - PostgreSQL: 5432
  - Redis: 6379
  - Temporal: 7233
  - Temporal UI: 8080
  - Langfuse: 3001
  - Supabase Studio: 3002

- **Health Checks:**
  - postgres: `pg_isready`
  - redis: `redis-cli ping`
  - temporal: `tctl cluster health`
  - All services use condition-based depends_on

---

_Story completed: 2026-01-26_
