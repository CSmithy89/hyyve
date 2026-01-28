# Story 1-1-11: MFA Login Verification

## Story Details

**Epic:** E1.1 - User Authentication & Identity
**Status:** ready-for-dev
**Implements:** FR2 (MFA verification)
**Research Reference:** T5-SSO Section 4.5

### User Story

As a **user with MFA enabled**,
I want **to verify my identity during login**,
So that **my account remains secure**.

---

## Acceptance Criteria

### AC1: MFA Challenge Detection
- **Given** I entered valid credentials and have MFA enabled
- **When** I complete the first-factor authentication
- **Then** I am redirected to the MFA challenge page at `/auth/mfa-challenge`

### AC2: TOTP Verification
- **Given** I have TOTP (authenticator app) enabled
- **When** I am on the MFA challenge page
- **Then** I can enter a 6-digit TOTP code from my authenticator app
- **And** the code is verified via Clerk `attemptFirstFactor` or `attemptSecondFactor`

### AC3: SMS Code Verification
- **Given** I have SMS MFA enabled
- **When** I am on the MFA challenge page
- **Then** I can request an SMS code via `prepareSecondFactor`
- **And** I can enter the 6-digit SMS code to complete verification

### AC4: Backup Code Verification
- **Given** I need to use a backup code
- **When** I click "Use backup code" on the MFA challenge page
- **Then** I can enter one of my 8-character backup codes
- **And** the code is marked as used after successful verification
- **And** I am warned if I have few backup codes remaining

### AC5: Rate Limiting
- **Given** I have entered incorrect MFA codes multiple times
- **When** I exceed 5 failed attempts within 15 minutes
- **Then** I am locked out temporarily with a clear message
- **And** the lockout duration is communicated

### AC6: Recovery Options
- **Given** I am on the MFA challenge page
- **When** I click "Lost access?" or "Need help?"
- **Then** I see recovery options (backup codes, account recovery)
- **And** I can access support contact information

### AC7: Successful Verification
- **Given** I entered a valid MFA code
- **When** verification completes successfully
- **Then** I am redirected to the dashboard or intended destination
- **And** my session is fully authenticated

### AC8: Method Selection
- **Given** I have multiple MFA methods enabled
- **When** I am on the MFA challenge page
- **Then** I can see and switch between available verification methods
- **And** TOTP is shown by default if available

### AC9: Error Handling
- **Given** I entered an invalid MFA code
- **When** verification fails
- **Then** I see a clear error message
- **And** I can retry entering the code
- **And** the input field is cleared and refocused

### AC10: Loading States
- **Given** I submitted an MFA code
- **When** verification is in progress
- **Then** I see a loading indicator on the submit button
- **And** form inputs are disabled during verification

### AC11: Accessibility
- **Given** I use assistive technology
- **When** I interact with the MFA challenge page
- **Then** all form elements have proper ARIA labels
- **And** error messages are announced to screen readers
- **And** keyboard navigation works correctly

### AC12: Responsive Design
- **Given** I access the MFA challenge page on any device
- **When** the page renders
- **Then** it displays correctly on mobile, tablet, and desktop
- **And** follows the Hyyve design system

---

## Technical Requirements

### Component: `MfaLoginForm`

**Location:** `apps/web/components/auth/mfa-login-form.tsx`

**Dependencies:**
- `@clerk/nextjs` - `useSignIn` hook for MFA verification
- `OtpInput` - Existing 6-digit code input component
- Design tokens from `lib/design-tokens.ts`

**State Management:**
- `verificationMethod`: 'totp' | 'sms' | 'backup'
- `otpCode`: string[] (6 digits)
- `backupCode`: string (8 characters)
- `isVerifying`: boolean
- `error`: string | null
- `attempts`: number

**Clerk Integration:**
```typescript
// TOTP verification
signIn.attemptSecondFactor({
  strategy: 'totp',
  code: otpCode.join('')
});

// SMS verification
signIn.prepareSecondFactor({ strategy: 'phone_code' });
signIn.attemptSecondFactor({
  strategy: 'phone_code',
  code: smsCode.join('')
});

// Backup code verification
signIn.attemptSecondFactor({
  strategy: 'backup_code',
  code: backupCode
});
```

### Routes

| Route | Description |
|-------|-------------|
| `/auth/mfa-challenge` | MFA verification during login |

### Design Tokens (from hyyve_login_page wireframe)

- **Background:** bg-background-dark (#0f172a)
- **Card:** bg-card-dark (#1e293b)
- **Border:** border-border-dark (#334155)
- **Primary:** #5048e5
- **Text Primary:** text-white
- **Text Secondary:** text-slate-400

---

## Test Plan

### Unit Tests (`apps/web/components/auth/__tests__/mfa-login.test.tsx`)

1. Renders MFA challenge form with default TOTP method
2. Displays all available verification methods
3. Allows switching between TOTP, SMS, and backup code methods
4. Handles 6-digit OTP code input correctly
5. Handles 8-character backup code input correctly
6. Shows loading state during verification
7. Displays error message on failed verification
8. Clears and refocuses input after error
9. Disables form during verification
10. Navigates to dashboard on successful verification
11. Shows "Lost access?" link with recovery options
12. Accessibility: proper ARIA labels on all inputs
13. Accessibility: error messages announced to screen readers

### E2E Tests (`tests/e2e/auth/mfa-login.spec.ts`)

1. AC1: User with MFA enabled is redirected to challenge page after login
2. AC2: TOTP code verification flow
3. AC3: SMS code verification with request and entry
4. AC4: Backup code verification with usage marking
5. AC5: Rate limiting after 5 failed attempts
6. AC6: Recovery options visibility and interaction
7. AC7: Successful verification redirects to dashboard
8. AC8: Method switching between TOTP and backup codes
9. AC9: Error handling with retry capability
10. AC10: Loading states during verification
11. AC11: Accessibility requirements
12. AC12: Responsive design on mobile/tablet/desktop

---

## Wireframe Reference

**Primary Wireframe:** `hyyve_login_page/code.html`
**Screen ID:** 1.1.1
**Route:** `/auth/login` -> `/auth/mfa-challenge`

The MFA challenge page follows the same design language as the login page, with:
- Centered card layout (max-w-[440px])
- Dark theme with primary (#5048e5) accents
- Background gradient effects matching login page
- OTP input component matching TOTP setup page style

---

## Dependencies

- Story 1-1-7: MFA Setup - Method Selection (completed)
- Story 1-1-8: MFA Setup - TOTP Authenticator (completed)
- Story 1-1-9: MFA Backup Codes Generation (completed)
- Story 1-1-10: MFA SMS Verification (completed)

---

## Notes

- Uses Clerk's `useSignIn` hook for MFA verification during login flow
- Rate limiting is enforced by Clerk backend (5 attempts per 15 minutes)
- Backup codes are one-time use and tracked by Clerk
- The component should detect available MFA methods from the signIn object
