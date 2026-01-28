/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck - Test file with array access patterns that TypeScript struggles with
/**
 * Backup Codes Component Unit Tests
 *
 * Story: 1-1-9 MFA Backup Codes Generation
 * Wireframe: mfa_backup_codes
 *
 * TDD RED PHASE: These tests are written to FAIL initially.
 * They verify acceptance criteria from story 1-1-9:
 * - AC1: Display backup codes after TOTP verification
 * - AC2: Backup code display format
 * - AC3: Copy all codes to clipboard
 * - AC4: Download codes as text file
 * - AC5: Print codes option
 * - AC6: Security warning display
 * - AC7: Confirmation checkbox before continuing
 * - AC8: Navigation to success page
 * - AC10: Responsive design
 * - AC11: Accessibility requirements
 * - AC12: Loading state
 *
 * Tests cover:
 * - Display of 10 backup codes
 * - Code format (8-character alphanumeric)
 * - Copy to clipboard functionality
 * - Download as text file
 * - Print functionality
 * - Security warning visibility
 * - Confirmation checkbox interaction
 * - Continue button state
 * - Loading state
 * - Accessibility (ARIA, keyboard nav)
 */

/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

// Components to be implemented (will fail in RED phase)
import {
  BackupCodesDisplay,
  BackupCodeCard,
} from '../index';

// Mock next/navigation
const mockPush = vi.fn();
const mockBack = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

// Mock Clerk hooks
const mockUserData = {
  id: 'user_123',
  emailAddresses: [{ emailAddress: 'test@example.com', verification: { status: 'verified' } }],
  twoFactorEnabled: true,
};

vi.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: mockUserData,
    isLoaded: true,
  }),
}));

// Mock clipboard API
const mockClipboard = {
  writeText: vi.fn().mockResolvedValue(undefined),
};
Object.assign(navigator, { clipboard: mockClipboard });

// Mock window.print
const mockPrint = vi.fn();
Object.assign(window, { print: mockPrint });

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockCreateObjectURL = vi.fn(() => 'blob:mock-url');
const mockRevokeObjectURL = vi.fn();
Object.assign(URL, { createObjectURL: mockCreateObjectURL, revokeObjectURL: mockRevokeObjectURL });

// Mock backup codes
const mockBackupCodes = [
  'ABCD1234',
  'EFGH5678',
  'IJKL9012',
  'MNOP3456',
  'QRST7890',
  'UVWX1234',
  'YZAB5678',
  'CDEF9012',
  'GHIJ3456',
  'KLMN7890',
];

/**
 * BackupCodesDisplay Component Tests
 *
 * Main component that displays backup codes after TOTP setup.
 */
describe('BackupCodesDisplay', () => {
  const defaultProps = {
    codes: mockBackupCodes,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Rendering', () => {
    it('renders page heading "Save Your Backup Codes"', () => {
      render(<BackupCodesDisplay {...defaultProps} />);

      expect(screen.getByRole('heading', { name: /save your backup codes/i })).toBeInTheDocument();
    });

    it('renders page description explaining backup codes purpose', () => {
      render(<BackupCodesDisplay {...defaultProps} />);

      expect(screen.getByText(/recovery codes|use these codes|lose access/i)).toBeInTheDocument();
    });

    it('renders "Back to Security Settings" link', () => {
      render(<BackupCodesDisplay {...defaultProps} />);

      expect(screen.getByRole('link', { name: /back to security settings/i })).toBeInTheDocument();
    });
  });

  describe('AC1: Display Backup Codes After TOTP Verification', () => {
    it('displays 10 backup codes', () => {
      render(<BackupCodesDisplay {...defaultProps} />);

      const codeElements = screen.getAllByTestId('backup-code');
      expect(codeElements).toHaveLength(10);
    });

    it('each code is 8 characters', () => {
      render(<BackupCodesDisplay {...defaultProps} />);

      const codeElements = screen.getAllByTestId('backup-code');
      codeElements.forEach((element) => {
        const text = element.textContent?.replace(/^\d+\.\s*/, ''); // Remove number prefix
        expect(text).toHaveLength(8);
      });
    });

    it('displays warning that codes are shown only once', () => {
      render(<BackupCodesDisplay {...defaultProps} />);

      expect(screen.getByText(/only be shown once|one time|store.*safely/i)).toBeInTheDocument();
    });
  });

  describe('AC2: Backup Code Display Format', () => {
    it('displays codes in monospace font', () => {
      const { container } = render(<BackupCodesDisplay {...defaultProps} />);

      const codeElements = container.querySelectorAll('[data-testid="backup-code"]');
      codeElements.forEach((element) => {
        expect(element).toHaveClass('font-mono');
      });
    });

    it('displays codes in a grid layout (2 columns on desktop)', () => {
      const { container } = render(<BackupCodesDisplay {...defaultProps} />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1', 'sm:grid-cols-2');
    });

    it('each code has a sequential number (1-10)', () => {
      render(<BackupCodesDisplay {...defaultProps} />);

      for (let i = 1; i <= 10; i++) {
        expect(screen.getByText(new RegExp(`^${i}\\.`))).toBeInTheDocument();
      }
    });

    it('codes are alphanumeric', () => {
      render(<BackupCodesDisplay {...defaultProps} />);

      const codeElements = screen.getAllByTestId('backup-code');
      codeElements.forEach((element) => {
        const codeText = element.textContent?.replace(/^\d+\.\s*/, '');
        expect(codeText).toMatch(/^[A-Z0-9]+$/);
      });
    });
  });

  describe('AC3: Copy All Codes to Clipboard', () => {
    it('renders "Copy All Codes" button', () => {
      render(<BackupCodesDisplay {...defaultProps} />);

      expect(screen.getByRole('button', { name: /copy all/i })).toBeInTheDocument();
    });

    it('clicking copy button copies all codes to clipboard', async () => {
      const user = userEvent.setup();
      render(<BackupCodesDisplay {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: /copy all/i }));

      expect(mockClipboard.writeText).toHaveBeenCalled();
      const clipboardContent = mockClipboard.writeText.mock.calls[0][0];
      expect(clipboardContent.split('\n').filter(Boolean)).toHaveLength(10);
    });

    it('copy button shows "Copied!" feedback after clicking', async () => {
      const user = userEvent.setup();
      render(<BackupCodesDisplay {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: /copy all/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument();
      });
    });

    it('copy button resets after 3 seconds', async () => {
      vi.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<BackupCodesDisplay {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: /copy all/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument();
      });

      act(() => {
        vi.advanceTimersByTime(3500);
      });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /copy all/i })).toBeInTheDocument();
      });

      vi.useRealTimers();
    });
  });

  describe('AC4: Download Codes as Text File', () => {
    it('renders "Download Codes" button', () => {
      render(<BackupCodesDisplay {...defaultProps} />);

      expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
    });

    it('clicking download creates a blob with correct content', async () => {
      const user = userEvent.setup();
      // Mock document.createElement for anchor element
      const mockAnchor = {
        href: '',
        download: '',
        click: vi.fn(),
      };
      vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as unknown as HTMLElement);

      render(<BackupCodesDisplay {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: /download/i }));

      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockAnchor.download).toBe('hyyve-backup-codes.txt');
      expect(mockAnchor.click).toHaveBeenCalled();
    });

    it('downloaded file includes security instructions header', async () => {
      const user = userEvent.setup();
      let blobContent = '';
      vi.spyOn(global, 'Blob').mockImplementation((content) => {
        blobContent = content?.[0] as string || '';
        return {} as Blob;
      });

      render(<BackupCodesDisplay {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: /download/i }));

      expect(blobContent).toContain('HYYVE');
      expect(blobContent).toContain('BACKUP CODES');
    });
  });

  describe('AC5: Print Codes Option', () => {
    it('renders "Print Codes" button', () => {
      render(<BackupCodesDisplay {...defaultProps} />);

      expect(screen.getByRole('button', { name: /print/i })).toBeInTheDocument();
    });

    it('clicking print button opens print dialog', async () => {
      const user = userEvent.setup();
      render(<BackupCodesDisplay {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: /print/i }));

      expect(mockPrint).toHaveBeenCalled();
    });
  });

  describe('AC6: Security Warning Display', () => {
    it('displays security warning with prominent styling', () => {
      const { container } = render(<BackupCodesDisplay {...defaultProps} />);

      const warning = screen.getByText(/store.*securely|secure location|cannot be retrieved/i);
      expect(warning).toBeInTheDocument();

      // Should have warning/amber styling
      const warningContainer = container.querySelector('.bg-amber-500, [class*="bg-amber"], [class*="bg-yellow"]');
      expect(warningContainer).toBeInTheDocument();
    });

    it('warning explains codes cannot be retrieved again', () => {
      render(<BackupCodesDisplay {...defaultProps} />);

      expect(screen.getByText(/cannot be retrieved|only shown once|will not be displayed again/i)).toBeInTheDocument();
    });
  });

  describe('AC7: Confirmation Checkbox Before Continuing', () => {
    it('renders confirmation checkbox', () => {
      render(<BackupCodesDisplay {...defaultProps} />);

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('checkbox has correct label text', () => {
      render(<BackupCodesDisplay {...defaultProps} />);

      expect(screen.getByText(/i have saved my backup codes|secure location/i)).toBeInTheDocument();
    });

    it('Continue button is disabled when checkbox is unchecked', () => {
      render(<BackupCodesDisplay {...defaultProps} />);

      const continueButton = screen.getByRole('button', { name: /continue/i });
      expect(continueButton).toBeDisabled();
    });

    it('Continue button is enabled when checkbox is checked', async () => {
      const user = userEvent.setup();
      render(<BackupCodesDisplay {...defaultProps} />);

      await user.click(screen.getByRole('checkbox'));

      const continueButton = screen.getByRole('button', { name: /continue/i });
      expect(continueButton).toBeEnabled();
    });
  });

  describe('AC8: Navigation to Success Page', () => {
    it('clicking Continue navigates to success page when checkbox is checked', async () => {
      const user = userEvent.setup();
      render(<BackupCodesDisplay {...defaultProps} />);

      await user.click(screen.getByRole('checkbox'));
      await user.click(screen.getByRole('button', { name: /continue/i }));

      expect(mockPush).toHaveBeenCalledWith(expect.stringMatching(/\/auth\/mfa-setup\/success|\/settings\/security/));
    });
  });

  describe('AC10: Responsive Design', () => {
    it('has responsive grid classes for mobile (single column)', () => {
      const { container } = render(<BackupCodesDisplay {...defaultProps} />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1');
    });

    it('has responsive button classes for mobile', () => {
      const { container } = render(<BackupCodesDisplay {...defaultProps} />);

      const buttons = container.querySelectorAll('button');
      // Buttons should have full-width or responsive classes
      const hasResponsiveClasses = Array.from(buttons).some(
        (btn) => btn.className.includes('w-full') || btn.className.includes('sm:')
      );
      expect(hasResponsiveClasses).toBe(true);
    });
  });

  describe('AC11: Accessibility Requirements', () => {
    it('backup codes are in an accessible list', () => {
      render(<BackupCodesDisplay {...defaultProps} />);

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();

      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(10);
    });

    it('all buttons have proper aria-labels', () => {
      render(<BackupCodesDisplay {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveAccessibleName();
      });
    });

    it('confirmation checkbox is properly labeled', () => {
      render(<BackupCodesDisplay {...defaultProps} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAccessibleName();
    });

    it('warning has appropriate role for screen readers', () => {
      render(<BackupCodesDisplay {...defaultProps} />);

      const warning = screen.getByRole('alert');
      expect(warning).toBeInTheDocument();
    });

    it('all interactive elements are keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<BackupCodesDisplay {...defaultProps} />);

      // Tab through elements
      await user.tab();

      // Should be able to reach buttons and checkbox
      const focusableElements = screen.getAllByRole('button');
      focusableElements.forEach((el) => {
        expect(el).not.toHaveAttribute('tabindex', '-1');
      });
    });

    it('page has proper heading hierarchy', () => {
      render(<BackupCodesDisplay {...defaultProps} />);

      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent(/save your backup codes/i);
    });
  });

  describe('AC12: Loading State', () => {
    it('shows loading skeleton when loading prop is true', () => {
      render(<BackupCodesDisplay codes={[]} isLoading={true} />);

      expect(screen.getByTestId('backup-codes-loading')).toBeInTheDocument();
    });

    it('loading skeleton matches page layout', () => {
      const { container } = render(<BackupCodesDisplay codes={[]} isLoading={true} />);

      // Should have skeleton elements
      const skeletons = container.querySelectorAll('[class*="animate-pulse"], [class*="skeleton"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Callback Props', () => {
    it('calls onContinue when Continue is clicked with checkbox checked', async () => {
      const onContinue = vi.fn();
      const user = userEvent.setup();
      render(<BackupCodesDisplay {...defaultProps} onContinue={onContinue} />);

      await user.click(screen.getByRole('checkbox'));
      await user.click(screen.getByRole('button', { name: /continue/i }));

      expect(onContinue).toHaveBeenCalled();
    });

    it('calls onCopy when codes are copied', async () => {
      const onCopy = vi.fn();
      const user = userEvent.setup();
      render(<BackupCodesDisplay {...defaultProps} onCopy={onCopy} />);

      await user.click(screen.getByRole('button', { name: /copy all/i }));

      expect(onCopy).toHaveBeenCalled();
    });

    it('calls onDownload when codes are downloaded', async () => {
      const onDownload = vi.fn();
      const user = userEvent.setup();
      render(<BackupCodesDisplay {...defaultProps} onDownload={onDownload} />);

      await user.click(screen.getByRole('button', { name: /download/i }));

      expect(onDownload).toHaveBeenCalled();
    });

    it('calls onPrint when print is clicked', async () => {
      const onPrint = vi.fn();
      const user = userEvent.setup();
      render(<BackupCodesDisplay {...defaultProps} onPrint={onPrint} />);

      await user.click(screen.getByRole('button', { name: /print/i }));

      expect(onPrint).toHaveBeenCalled();
    });
  });
});

/**
 * BackupCodeCard Component Tests
 */
describe('BackupCodeCard', () => {
  const defaultProps = {
    number: 1,
    code: 'ABCD1234',
  };

  it('renders the code number', () => {
    render(<BackupCodeCard {...defaultProps} />);

    expect(screen.getByText('1.')).toBeInTheDocument();
  });

  it('renders the code value', () => {
    render(<BackupCodeCard {...defaultProps} />);

    expect(screen.getByText('ABCD1234')).toBeInTheDocument();
  });

  it('displays code in monospace font', () => {
    const { container } = render(<BackupCodeCard {...defaultProps} />);

    const codeElement = container.querySelector('.font-mono');
    expect(codeElement).toBeInTheDocument();
  });

  it('has proper background styling', () => {
    const { container } = render(<BackupCodeCard {...defaultProps} />);

    const card = container.firstChild;
    expect(card).toHaveClass('bg-gray-50', 'dark:bg-background-dark');
  });

  it('has correct padding and border radius', () => {
    const { container } = render(<BackupCodeCard {...defaultProps} />);

    const card = container.firstChild;
    expect(card).toHaveClass('px-4', 'py-3', 'rounded-lg');
  });

  it('has listitem role for accessibility', () => {
    render(<BackupCodeCard {...defaultProps} />);

    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });

  it('has data-testid for testing', () => {
    render(<BackupCodeCard {...defaultProps} />);

    expect(screen.getByTestId('backup-code')).toBeInTheDocument();
  });
});

/**
 * Integration Tests
 */
describe('BackupCodes Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('full flow: user can copy, check confirmation, and continue', async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();

    render(<BackupCodesDisplay codes={mockBackupCodes} onContinue={onContinue} />);

    // Copy codes
    await user.click(screen.getByRole('button', { name: /copy all/i }));
    expect(mockClipboard.writeText).toHaveBeenCalled();

    // Check confirmation
    await user.click(screen.getByRole('checkbox'));

    // Continue
    await user.click(screen.getByRole('button', { name: /continue/i }));
    expect(onContinue).toHaveBeenCalled();
  });

  it('displays all codes with correct numbering', () => {
    render(<BackupCodesDisplay codes={mockBackupCodes} />);

    mockBackupCodes.forEach((code, index) => {
      expect(screen.getByText(`${index + 1}.`)).toBeInTheDocument();
      expect(screen.getByText(code)).toBeInTheDocument();
    });
  });
});
