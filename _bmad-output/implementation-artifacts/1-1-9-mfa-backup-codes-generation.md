# Story 1-1-9: MFA - Backup Codes Generation

**Epic:** E1.1 - User Authentication & Identity
**Status:** ready-for-dev
**Priority:** High
**Estimate:** 3 story points

## User Story

As a **user with MFA enabled**,
I want **to generate and save backup recovery codes after TOTP setup**,
So that **I can recover my account if I lose access to my authenticator app**.

## Acceptance Criteria

### AC1: Display Backup Codes After TOTP Verification
- [ ] **Given** I have successfully verified my TOTP code (Story 1-1-8)
- [ ] **When** I am navigated to `/auth/mfa-setup/backup`
- [ ] **Then** 10 single-use backup codes are displayed (8 characters each, alphanumeric)
- [ ] **And** the page displays "Save Your Backup Codes" as the heading
- [ ] **And** a warning message explains these codes will only be shown once

### AC2: Backup Code Display Format
- [ ] **Given** I am on the backup codes page
- [ ] **When** the codes are displayed
- [ ] **Then** each code is shown in a monospace font for readability
- [ ] **And** codes are displayed in a grid layout (2 columns)
- [ ] **And** each code has a sequential number (1-10)
- [ ] **And** codes are formatted as 8-character alphanumeric strings

### AC3: Copy All Codes to Clipboard
- [ ] **Given** I am viewing my backup codes
- [ ] **When** I click the "Copy All Codes" button
- [ ] **Then** all 10 codes are copied to clipboard (one per line)
- [ ] **And** I see visual feedback confirming the copy (button text changes to "Copied!")
- [ ] **And** the button resets after 3 seconds

### AC4: Download Codes as Text File
- [ ] **Given** I am viewing my backup codes
- [ ] **When** I click the "Download Codes" button
- [ ] **Then** a text file named "hyyve-backup-codes.txt" is downloaded
- [ ] **And** the file contains all 10 codes, one per line
- [ ] **And** the file includes a header with date and security instructions

### AC5: Print Codes Option
- [ ] **Given** I am viewing my backup codes
- [ ] **When** I click the "Print Codes" button
- [ ] **Then** the browser print dialog opens
- [ ] **And** a print-friendly version of the codes is displayed
- [ ] **And** the print version includes the Hyyve logo and security instructions

### AC6: Security Warning Display
- [ ] **Given** I am on the backup codes page
- [ ] **When** the page loads
- [ ] **Then** I see a prominent warning about storing codes securely
- [ ] **And** the warning has a warning/alert styling (yellow/amber)
- [ ] **And** the warning explains codes cannot be retrieved again

### AC7: Confirmation Checkbox Before Continuing
- [ ] **Given** I am viewing my backup codes
- [ ] **When** I want to continue to the completion page
- [ ] **Then** I must check a confirmation checkbox
- [ ] **And** the checkbox label says "I have saved my backup codes in a secure location"
- [ ] **And** the "Continue" button is disabled until the checkbox is checked

### AC8: Navigation to Success Page
- [ ] **Given** I have saved my backup codes and checked the confirmation
- [ ] **When** I click "Continue"
- [ ] **Then** I am navigated to `/auth/mfa-setup/success` (or `/settings/security`)
- [ ] **And** a success message confirms MFA is now enabled

### AC9: Back Navigation Warning
- [ ] **Given** I am on the backup codes page
- [ ] **When** I try to navigate away (back button or close tab)
- [ ] **Then** I see a browser confirmation dialog warning about losing codes
- [ ] **And** I can choose to stay on the page or leave

### AC10: Responsive Design
- [ ] **Given** I am on a mobile device (< 768px width)
- [ ] **When** I view the backup codes page
- [ ] **Then** the code grid displays in a single column
- [ ] **And** all action buttons are full-width and stacked
- [ ] **And** the page remains usable and readable

### AC11: Accessibility Requirements
- [ ] **Given** I am using assistive technology
- [ ] **When** I navigate the backup codes page
- [ ] **Then** backup codes are in an accessible list with proper semantics
- [ ] **And** all buttons have proper aria-labels
- [ ] **And** the confirmation checkbox is properly labeled
- [ ] **And** warnings are announced to screen readers with appropriate roles

### AC12: Loading State
- [ ] **Given** I am navigating to the backup codes page
- [ ] **When** codes are being generated
- [ ] **Then** a loading skeleton is displayed
- [ ] **And** the loading state matches the page layout

## Technical Requirements

### Authentication Provider
- **Provider:** Clerk (via `@clerk/nextjs`)
- **Backup Codes API:**
  - `user.createBackupCode()` - Generates new backup codes
  - Backup codes should be retrieved after TOTP verification
- **Integration:** Use Clerk's built-in backup codes if available, otherwise generate mock codes for development

### Clerk Backup Codes API Usage

```typescript
import { useUser } from '@clerk/nextjs';

// Generate backup codes after TOTP is enabled
const { user } = useUser();

// Option 1: If Clerk provides backup codes API
const backupCodes = await user.createBackupCode?.();

// Option 2: Mock codes for development/if API not available
const generateMockBackupCodes = (): string[] => {
  return Array.from({ length: 10 }, () =>
    Math.random().toString(36).substring(2, 10).toUpperCase()
  );
};
```

### State Management

```typescript
// Component state
interface BackupCodesState {
  codes: string[];           // Array of 10 backup codes
  isLoading: boolean;        // Loading state
  hasCopied: boolean;        // Copy feedback state
  isConfirmed: boolean;      // Checkbox state
  error: string | null;      // Error message
}

const [state, setState] = useState<BackupCodesState>({
  codes: [],
  isLoading: true,
  hasCopied: false,
  isConfirmed: false,
  error: null,
});
```

### Key Routes

| Route | Purpose |
|-------|---------|
| `/auth/mfa-setup/authenticator` | TOTP setup (Story 1.1.8) |
| `/auth/mfa-setup/backup` | Backup codes display (this story) |
| `/auth/mfa-setup/success` | MFA setup complete |
| `/settings/security` | Return destination |

### Implementation Approach

1. **Create Backup Codes Page**
   - Build `BackupCodesPage` at `apps/web/app/(auth)/auth/mfa-setup/backup/page.tsx`
   - Server component for route protection, client component for interactive UI

2. **Create BackupCodesDisplay Component**
   - Main container displaying the codes grid
   - Handle loading state and error display

3. **Create BackupCodeCard Component**
   - Individual code display with number and monospace formatting
   - Consistent styling with TOTP setup page

4. **Implement Copy/Download/Print Actions**
   - Copy using Clipboard API
   - Download using Blob and anchor tag
   - Print using window.print() with print styles

5. **Add Navigation Protection**
   - Use `beforeunload` event to warn about leaving
   - Reset protection after confirmation

### Key Files to Create/Modify

```
apps/web/app/(auth)/auth/mfa-setup/backup/page.tsx         (NEW - main page)
apps/web/app/(auth)/auth/mfa-setup/backup/loading.tsx      (NEW - loading state)
apps/web/components/auth/backup-codes-display.tsx          (NEW - main component)
apps/web/components/auth/backup-code-card.tsx              (NEW - individual code)
apps/web/components/auth/index.ts                          (MODIFY - add exports)
apps/web/components/auth/__tests__/backup-codes.test.tsx   (NEW - unit tests)
tests/e2e/auth/backup-codes.spec.ts                        (NEW - E2E tests)
```

### Design Tokens (from Wireframe)

```css
--color-primary: #5048e5
--color-background-dark: #121121
--color-surface-dark: #1c1b32
--color-surface-border: #272546
--color-text-secondary: #9795c6
--color-warning: #f59e0b (amber for warnings)
```

### Component Structure

```
<BackupCodesPage>
  <Header />                        (navbar from layout)
  <main className="flex-1 flex justify-center py-10 px-4 sm:px-6">
    <div className="w-full max-w-2xl">
      <BackLink />                  ("Back to Security Settings")
      <PageHeading />               (title + description)
      <WarningBanner />             (yellow/amber security warning)
      <BackupCodesDisplay>
        <CodesGrid>                 (2-column grid on desktop)
          <BackupCodeCard key={1} number={1} code="ABCD1234" />
          ... x10
        </CodesGrid>
        <ActionButtons>
          <CopyButton />
          <DownloadButton />
          <PrintButton />
        </ActionButtons>
      </BackupCodesDisplay>
      <ConfirmationCheckbox />
      <ContinueButton disabled={!confirmed} />
    </div>
  </main>
</BackupCodesPage>
```

### File Download Implementation

```typescript
const handleDownload = () => {
  const date = new Date().toLocaleDateString();
  const content = [
    '=== HYYVE BACKUP CODES ===',
    `Generated: ${date}`,
    '',
    'IMPORTANT: Store these codes in a secure location.',
    'Each code can only be used once.',
    'Do not share these codes with anyone.',
    '',
    '--- BACKUP CODES ---',
    '',
    ...codes.map((code, i) => `${(i + 1).toString().padStart(2, '0')}. ${code}`),
    '',
    '=== END OF BACKUP CODES ===',
  ].join('\n');

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'hyyve-backup-codes.txt';
  link.click();
  URL.revokeObjectURL(url);
};
```

## Functional Requirements Mapping

| FR# | Requirement | Implementation |
|-----|-------------|----------------|
| FR2 | Users can enable multi-factor authentication | Backup codes generated after TOTP setup |

## Wireframe Reference

| Attribute | Value |
|-----------|-------|
| **Screen ID** | 1.1.7 |
| **Route** | `/auth/mfa-setup/backup` |
| **Wireframe Folder** | `mfa_backup_codes` (or similar) |
| **HTML Source** | Check `_bmad-output/planning-artifacts/Stitch Hyyve/` |

### Design Implementation Notes

Following patterns from TOTP setup page:
- Content card: `bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-border rounded-xl p-6 md:p-10`
- Code display: `font-mono tracking-wider text-lg bg-gray-50 dark:bg-background-dark px-4 py-3 rounded-lg`
- Warning banner: `bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-amber-500`
- Action buttons: Grid layout with consistent hover states
- Checkbox: Custom styled checkbox with primary accent

## Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Story 1.1.8 | Prerequisite | Done - TOTP setup navigates here on success |
| Clerk Backup Codes API | External | Check availability, mock if needed |
| Story 1.1.10 | Related | Backlog - SMS verification (alternative MFA) |

## Test Scenarios

### Unit Tests

1. **Render Test:** Backup codes page renders with 10 codes displayed
2. **Code Format:** Each code is 8 characters alphanumeric
3. **Copy Button:** Clicking copy copies all codes to clipboard
4. **Copy Feedback:** Button shows "Copied!" after clicking
5. **Download Button:** Clicking download creates and downloads text file
6. **Print Button:** Clicking print opens print dialog
7. **Warning Display:** Security warning is visible with proper styling
8. **Checkbox Disabled:** Continue button is disabled when unchecked
9. **Checkbox Enabled:** Continue button is enabled when checked
10. **Navigation:** Clicking continue navigates to success page
11. **Loading State:** Loading skeleton is displayed initially
12. **Accessibility:** ARIA labels present on all interactive elements

### E2E Tests (Playwright)

```typescript
test.describe('MFA Setup - Backup Codes (Story 1-1-9)', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // Navigate to backup codes page (after TOTP setup)
    await authenticatedPage.goto('/auth/mfa-setup/backup');
  });

  test('displays 10 backup codes', async ({ authenticatedPage }) => {
    const codes = await authenticatedPage.locator('[data-testid="backup-code"]').all();
    expect(codes).toHaveLength(10);
  });

  test('codes are 8 characters alphanumeric', async ({ authenticatedPage }) => {
    const code = authenticatedPage.locator('[data-testid="backup-code"]').first();
    const text = await code.textContent();
    expect(text).toMatch(/^[A-Z0-9]{8}$/);
  });

  test('copy button copies codes to clipboard', async ({ authenticatedPage, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await authenticatedPage.getByRole('button', { name: /copy all/i }).click();
    await expect(authenticatedPage.getByRole('button', { name: /copied/i })).toBeVisible();

    const clipboardText = await authenticatedPage.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText.split('\n').filter(Boolean)).toHaveLength(10);
  });

  test('download button downloads text file', async ({ authenticatedPage }) => {
    const downloadPromise = authenticatedPage.waitForEvent('download');
    await authenticatedPage.getByRole('button', { name: /download/i }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('hyyve-backup-codes.txt');
  });

  test('displays security warning', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.getByText(/store these codes/i)).toBeVisible();
    await expect(authenticatedPage.locator('.bg-amber-500, [class*="bg-warning"]')).toBeVisible();
  });

  test('continue button is disabled until checkbox is checked', async ({ authenticatedPage }) => {
    const continueButton = authenticatedPage.getByRole('button', { name: /continue/i });
    await expect(continueButton).toBeDisabled();

    await authenticatedPage.getByRole('checkbox').click();
    await expect(continueButton).toBeEnabled();
  });

  test('navigates to success page after confirmation', async ({ authenticatedPage }) => {
    await authenticatedPage.getByRole('checkbox').click();
    await authenticatedPage.getByRole('button', { name: /continue/i }).click();
    await expect(authenticatedPage).toHaveURL(/\/auth\/mfa-setup\/success|\/settings\/security/);
  });
});
```

### Integration Tests

1. **Route Protection:** Ensure page requires authentication
2. **Navigation Flow:** Verify correct navigation from TOTP setup
3. **Clerk Integration:** Test backup codes generation with Clerk API
4. **Clipboard API:** Verify cross-browser clipboard support
5. **File Download:** Verify file content and format

## Research References

- **T5-SSO** - `technical-sso-enterprise-auth-research-2026-01-21.md` Section 4.3 (Backup Codes)
- **Clerk Backup Codes** - Clerk's MFA documentation
- **NIST SP 800-63B** - Digital Identity Guidelines (recovery codes)

## Security Considerations

1. **One-Time Display:** Codes are only shown once after generation
2. **Hashing:** Clerk hashes codes before storage (bcrypt)
3. **Single-Use:** Each code can only be used once for account recovery
4. **No Retrieval:** Codes cannot be retrieved after leaving the page
5. **Secure Storage:** User is warned to store codes securely
6. **Transport Security:** All API calls over HTTPS

## Definition of Done

- [ ] All acceptance criteria verified
- [ ] Unit tests passing (minimum 80% coverage)
- [ ] E2E tests passing
- [ ] Code reviewed and approved
- [ ] UI matches design system patterns
- [ ] Accessibility audit passing (axe-core)
- [ ] Mobile responsive design verified
- [ ] Dark mode styling correct
- [ ] No TypeScript errors
- [ ] Copy/Download/Print functionality working
- [ ] Navigation protection implemented
- [ ] Documentation updated

## Notes

- This story is the final step in the TOTP MFA setup flow (after Story 1.1.8).
- If Clerk doesn't provide a backup codes API, implement mock code generation that matches the expected format.
- Consider adding regenerate functionality in a future story (with confirmation to invalidate previous codes).
- The confirmation checkbox is a UX pattern to ensure users understand the importance of saving codes.
- Browser's beforeunload protection helps prevent accidental navigation away.

---

**Created:** 2026-01-28
**Last Updated:** 2026-01-28
**Author:** Claude Code (TDD workflow)
