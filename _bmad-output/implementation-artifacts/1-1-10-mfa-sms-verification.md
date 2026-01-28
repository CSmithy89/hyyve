# Story 1-1-10: MFA SMS Verification

**Epic:** E1.1 - User Authentication & Identity
**Status:** done
**Priority:** High
**Estimate:** 5 story points

## User Story

As a **user who selected SMS Verification MFA**,
I want **to configure SMS-based MFA by entering my phone number and verifying with a code sent via text**,
So that **I have two-factor authentication protecting my account using my mobile phone**.

## Acceptance Criteria

### AC1: Navigate from Method Selection
- [x] **Given** I selected "SMS Verification" on the MFA method selection page (Story 1.1.7)
- [x] **When** I click "Continue Setup"
- [x] **Then** I am navigated to `/auth/mfa-setup/sms`
- [x] **And** the page displays "Setup SMS Verification" as the heading

### AC2: Display Phone Number Input
- [x] **Given** I am on the SMS verification setup page
- [x] **When** the page loads
- [x] **Then** I see a phone number input field with country code selector
- [x] **And** the country code defaults to my detected country or US (+1)
- [x] **And** a step indicator shows "1. Enter Phone Number"

### AC3: Country Code Selector
- [x] **Given** I need to enter my phone number
- [x] **When** I click the country code selector
- [x] **Then** I see a dropdown with common country codes
- [x] **And** I can search for a specific country
- [x] **And** selecting a country updates the input prefix

### AC4: Phone Number Validation
- [x] **Given** I am entering my phone number
- [x] **When** I type in the phone number field
- [x] **Then** the input only accepts numeric characters
- [x] **And** the phone number is formatted automatically (e.g., (555) 123-4567)
- [x] **And** the Send Code button is disabled until valid phone number is entered

### AC5: Send Verification Code
- [x] **Given** I have entered a valid phone number
- [x] **When** I click "Send Verification Code"
- [x] **Then** Clerk's SMS verification API is called
- [x] **And** a loading spinner is displayed during the API call
- [x] **And** upon success, the UI transitions to the verification code input

### AC6: Display SMS Code Input
- [x] **Given** a verification code has been sent to my phone
- [x] **When** I see the verification section
- [x] **Then** I see a step indicator showing "2. Enter Verification Code"
- [x] **And** I see 6 individual input boxes for the SMS code
- [x] **And** the inputs use the same OTP input component as TOTP setup

### AC7: Resend Code with Cooldown
- [x] **Given** I have requested a verification code
- [x] **When** I view the verification section
- [x] **Then** I see a "Resend Code" button
- [x] **And** the button is disabled for 60 seconds with a countdown timer
- [x] **And** after 60 seconds, I can click to resend the code

### AC8: Verify SMS Code
- [x] **Given** I have entered the 6-digit SMS code
- [x] **When** I click "Verify & Enable"
- [x] **Then** the code is verified against Clerk's phone verification API
- [x] **And** if valid, SMS MFA is enabled on my account
- [x] **And** I am navigated to `/auth/mfa-setup/backup` (Story 1.1.9)

### AC9: Handle Invalid Code
- [x] **Given** I have entered an incorrect SMS code
- [x] **When** I click "Verify & Enable"
- [x] **Then** I see an error message "Invalid verification code. Please try again."
- [x] **And** the input fields are cleared and re-focused on the first input
- [x] **And** I can retry with a new code or resend a new code

### AC10: Handle SMS Delivery Failure
- [x] **Given** the SMS could not be delivered
- [x] **When** the API returns an error
- [x] **Then** I see an error message explaining the issue
- [x] **And** I am given the option to try a different phone number

### AC11: Skip/Cancel Setup
- [x] **Given** I am on the SMS setup page
- [x] **When** I click "I'll do this later"
- [x] **Then** I see a confirmation warning about security risks
- [x] **And** I can choose to continue without MFA or return to setup
- [x] **And** if I skip, I am navigated to `/settings/security`

### AC12: Information Boxes
- [x] **Given** I am on the SMS setup page
- [x] **When** I view the page footer
- [x] **Then** I see a "Why SMS verification?" info box
- [x] **And** I see a "Didn't receive the code?" help box

### AC13: Back Navigation
- [x] **Given** I am on the SMS setup page
- [x] **When** I click the back link
- [x] **Then** I am navigated to `/auth/mfa-setup` (method selection)

### AC14: Responsive Design
- [x] **Given** I am on a mobile device (< 768px width)
- [x] **When** I view the SMS setup page
- [x] **Then** the layout is optimized for mobile
- [x] **And** the phone input spans full width
- [x] **And** the OTP input boxes are appropriately sized

### AC15: Accessibility Requirements
- [x] **Given** I am using assistive technology
- [x] **When** I navigate the SMS setup page
- [x] **Then** the phone input has proper labels for screen readers
- [x] **And** the OTP inputs are properly labeled
- [x] **And** error messages are announced to screen readers
- [x] **And** all interactive elements are keyboard accessible

## Technical Requirements

### Authentication Provider
- **Provider:** Clerk (via `@clerk/nextjs`)
- **Phone Verification API:**
  - `user.createPhoneNumber({ phoneNumber })` - Add phone number to user
  - `phoneNumber.prepareVerification()` - Send SMS code
  - `phoneNumber.attemptVerification({ code })` - Verify the code
- **Integration:** Use Clerk's built-in phone verification APIs

### Clerk Phone Verification API Usage

```typescript
import { useUser } from '@clerk/nextjs';

// Add phone number and send verification code
const { user } = useUser();
const phoneNumber = await user.createPhoneNumber({ phoneNumber: '+15551234567' });
await phoneNumber.prepareVerification({ strategy: 'phone_code' });

// Verify SMS code
try {
  await phoneNumber.attemptVerification({ code: '123456' });
  // Phone is now verified and can be used for MFA
  await user.update({
    primaryPhoneNumberId: phoneNumber.id,
  });
  // Enable phone-based MFA
} catch (error) {
  // Handle verification failure
}
```

### State Management

```typescript
interface SmsSetupState {
  step: 'phone-entry' | 'code-verification';
  phoneNumber: string;
  countryCode: string;
  verificationCode: string[];
  isLoading: boolean;
  isSendingCode: boolean;
  isVerifying: boolean;
  error: string | null;
  resendCooldown: number; // Seconds remaining before resend is allowed
  phoneNumberId: string | null;
}
```

### Key Routes

| Route | Purpose |
|-------|---------|
| `/auth/mfa-setup` | MFA method selection (Story 1.1.7) |
| `/auth/mfa-setup/sms` | SMS setup (this story) |
| `/auth/mfa-setup/backup` | Backup codes display (Story 1.1.9) |
| `/settings/security` | Return destination after cancel |

### Key Files to Create/Modify

```
apps/web/app/(auth)/auth/mfa-setup/sms/page.tsx              (NEW - main page)
apps/web/app/(auth)/auth/mfa-setup/sms/loading.tsx           (NEW - loading state)
apps/web/app/(auth)/auth/mfa-setup/sms/error.tsx             (NEW - error boundary)
apps/web/components/auth/sms-mfa-setup-form.tsx              (NEW - form component)
apps/web/components/auth/phone-input.tsx                      (NEW - phone input with country code)
apps/web/components/auth/__tests__/sms-mfa-setup.test.tsx    (NEW - unit tests)
tests/e2e/auth/sms-mfa-setup.spec.ts                         (NEW - E2E tests)
apps/web/components/auth/index.ts                            (MODIFY - add exports)
```

### Design Tokens (from Wireframe)

```css
--color-primary: #5048e5
--color-background-dark: #121121
--color-surface-dark: #1c1b32
--color-surface-border: #272546
--color-text-secondary: #9795c6
```

### Component Structure

```
<SmsMfaSetupForm>
  <Header />                        (navbar with logo, nav links, user avatar)
  <main className="flex-1 flex justify-center py-10 px-4 sm:px-6">
    <div className="w-full max-w-lg">
      <BackLink />                  ("Back to Method Selection")
      <PageHeading />               (title + description)
      <ContentCard>                 (bg-surface-dark rounded-xl)
        {step === 'phone-entry' && (
          <>
            <StepIndicator num={1} text="Enter Phone Number" />
            <PhoneInput
              countryCode={countryCode}
              phoneNumber={phoneNumber}
              onChange={...}
            />
            <SendCodeButton />
          </>
        )}
        {step === 'code-verification' && (
          <>
            <StepIndicator num={2} text="Enter Verification Code" />
            <PhoneDisplay />        (shows the phone number code was sent to)
            <OtpInput value={verificationCode} onChange={...} />
            <ResendButton cooldown={resendCooldown} />
            <VerifyButton />
          </>
        )}
        <SkipButton />
      </ContentCard>
      <InfoBoxes>
        <WhySmsBox />
        <HelpBox />
      </InfoBoxes>
    </div>
  </main>
</SmsMfaSetupForm>
```

## Wireframe Reference

| Attribute | Value |
|-----------|-------|
| **Screen ID** | 1.1.5, 1.10.2 |
| **Route** | `/auth/mfa-setup/sms` |
| **Wireframe Folder** | `mfa_method_selection`, `account_&_security_settings_2` |

### Design Implementation Notes

- Use similar styling to TOTP setup page for consistency
- Phone input should have a clear country code dropdown
- Verification code section uses same OTP input component
- Resend button shows countdown timer when cooling down

## Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Story 1.1.7 | Prerequisite | Done - MFA method selection |
| Clerk Phone API | External | Available - Built into Clerk SDK |
| OtpInput component | Internal | Done - from Story 1.1.8 |
| Story 1.1.9 | Successor | Done - Backup codes (navigate to on success) |

## Test Scenarios

### Unit Tests

1. **Render Test:** SMS setup page renders phone input initially
2. **Country Code Selector:** Dropdown shows country options
3. **Phone Validation:** Invalid phone numbers show error
4. **Send Code Button:** Disabled until valid phone entered
5. **Send Code Loading:** Shows loading state during API call
6. **Transition to Verification:** UI updates after code sent
7. **OTP Input:** Verification code inputs work correctly
8. **Resend Cooldown:** Button disabled during cooldown
9. **Verify Button Disabled:** Button disabled when code incomplete
10. **Verify Loading:** Shows loading state during verification
11. **Error Display:** Invalid code shows error message
12. **Skip Confirmation:** Skip button shows warning dialog
13. **Accessibility:** ARIA labels on all inputs

### E2E Tests (Playwright)

See `tests/e2e/auth/sms-mfa-setup.spec.ts`

## Security Considerations

1. **Phone Number Validation:** Validate format before sending to API
2. **Rate Limiting:** Clerk enforces rate limits on SMS sends
3. **Resend Cooldown:** 60-second cooldown prevents spam
4. **Code Expiration:** SMS codes expire after 10 minutes
5. **Maximum Attempts:** Clerk limits verification attempts
6. **Transport Security:** All API calls over HTTPS
7. **Phone Privacy:** Only show last 4 digits after verification sent

## Definition of Done

- [x] All acceptance criteria verified
- [x] Unit tests passing (minimum 80% coverage)
- [x] E2E tests created
- [x] Code reviewed
- [x] UI matches design patterns from TOTP setup
- [x] Accessibility requirements met
- [x] Mobile responsive design verified
- [x] Dark mode styling correct
- [x] No TypeScript errors
- [x] Clerk phone verification integration working
- [x] Resend cooldown working correctly
- [x] Error handling implemented
- [x] Documentation updated

## Notes

- This story builds on Story 1.1.7 (method selection). User must select SMS method to reach this page.
- Clerk's phone verification APIs handle the SMS delivery. Do NOT implement custom SMS sending.
- The success flow navigates to Story 1.1.9 (backup codes) which is required after enabling any MFA method.
- Phone number is stored with the user after successful verification for future logins.
- Consider adding phone number change functionality in settings later.

---

**Created:** 2026-01-28
**Last Updated:** 2026-01-28
**Author:** Claude Code (create-story workflow)
