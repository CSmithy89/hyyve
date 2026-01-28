/**
 * Backup Codes Display Component
 *
 * Story: 1-1-9 MFA Backup Codes Generation
 * Wireframe: mfa_backup_codes
 *
 * Features:
 * - Display 10 backup codes in a grid layout
 * - Copy all codes to clipboard
 * - Download codes as text file
 * - Print codes option
 * - Security warning about storing codes
 * - Confirmation checkbox before continuing
 * - Navigation to success page
 * - Loading state skeleton
 * - Full accessibility with ARIA attributes
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { BackupCodeCard } from './backup-code-card';

/**
 * Props for the BackupCodesDisplay component
 */
export interface BackupCodesDisplayProps {
  /** Array of backup codes to display */
  codes: string[];
  /** Whether codes are loading */
  isLoading?: boolean;
  /** Callback when Continue is clicked */
  onContinue?: () => void;
  /** Callback when codes are copied */
  onCopy?: () => void;
  /** Callback when codes are downloaded */
  onDownload?: () => void;
  /** Callback when print is clicked */
  onPrint?: () => void;
}

/**
 * Hyyve Logo Component
 */
function HyyveLogo() {
  return (
    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
      <svg
        className="size-5"
        fill="none"
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

/**
 * Loading Skeleton Component
 */
function LoadingSkeleton() {
  return (
    <div data-testid="backup-codes-loading" className="animate-pulse space-y-6">
      {/* Title skeleton */}
      <div className="h-8 bg-gray-200 dark:bg-surface-border rounded w-3/4" />
      <div className="h-4 bg-gray-200 dark:bg-surface-border rounded w-1/2" />

      {/* Warning skeleton */}
      <div className="h-20 bg-amber-100/50 dark:bg-amber-500/10 rounded-lg" />

      {/* Codes grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="h-12 bg-gray-100 dark:bg-background-dark rounded-lg"
          />
        ))}
      </div>

      {/* Buttons skeleton */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="h-10 bg-gray-200 dark:bg-surface-border rounded-lg flex-1" />
        <div className="h-10 bg-gray-200 dark:bg-surface-border rounded-lg flex-1" />
        <div className="h-10 bg-gray-200 dark:bg-surface-border rounded-lg flex-1" />
      </div>

      {/* Checkbox skeleton */}
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 bg-gray-200 dark:bg-surface-border rounded" />
        <div className="h-4 bg-gray-200 dark:bg-surface-border rounded w-2/3" />
      </div>

      {/* Continue button skeleton */}
      <div className="h-12 bg-primary/20 rounded-lg" />
    </div>
  );
}

/**
 * BackupCodesDisplay Component
 *
 * Main component for displaying backup codes after TOTP setup.
 * Handles code display, copy, download, print, and navigation.
 */
export function BackupCodesDisplay({
  codes,
  isLoading = false,
  onContinue,
  onCopy,
  onDownload,
  onPrint,
}: BackupCodesDisplayProps) {
  const router = useRouter();
  const { user } = useUser();

  // State
  const [hasCopied, setHasCopied] = React.useState(false);
  const [isConfirmed, setIsConfirmed] = React.useState(false);

  /**
   * Generate formatted file content for download
   */
  const generateFileContent = (): string => {
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return [
      '=== HYYVE BACKUP CODES ===',
      `Generated: ${date}`,
      '',
      'IMPORTANT: Store these codes in a secure location.',
      'Each code can only be used once.',
      'Do not share these codes with anyone.',
      '',
      '--- BACKUP CODES ---',
      '',
      ...codes.map((code, i) => `${String(i + 1).padStart(2, '0')}. ${code}`),
      '',
      '=== END OF BACKUP CODES ===',
    ].join('\n');
  };

  /**
   * Copy all codes to clipboard
   */
  const handleCopy = async () => {
    try {
      const codesText = codes.join('\n');
      await navigator.clipboard.writeText(codesText);
      setHasCopied(true);
      onCopy?.();

      // Reset after 3 seconds
      setTimeout(() => {
        setHasCopied(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy codes:', err);
    }
  };

  /**
   * Download codes as text file
   */
  const handleDownload = () => {
    const content = generateFileContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'hyyve-backup-codes.txt';
    link.click();

    URL.revokeObjectURL(url);
    onDownload?.();
  };

  /**
   * Print codes
   */
  const handlePrint = () => {
    window.print();
    onPrint?.();
  };

  /**
   * Handle Continue button click
   */
  const handleContinue = () => {
    onContinue?.();
    router.push('/auth/mfa-setup/success');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-dark text-white font-display antialiased selection:bg-primary/30 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 flex w-full items-center justify-between border-b border-border-dark bg-background-dark/80 px-6 py-4 backdrop-blur-md md:px-10">
        <div className="flex items-center gap-4 text-white">
          <HyyveLogo />
          <h2 className="text-lg font-bold leading-tight tracking-tight">Hyyve</h2>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex gap-6">
            <Link
              href="/dashboard"
              className="text-gray-600 dark:text-text-secondary hover:text-primary dark:hover:text-white text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/deployments"
              className="text-gray-600 dark:text-text-secondary hover:text-primary dark:hover:text-white text-sm font-medium transition-colors"
            >
              Deployments
            </Link>
            <span className="text-primary dark:text-white text-sm font-medium">
              Settings
            </span>
            <Link
              href="/support"
              className="text-gray-600 dark:text-text-secondary hover:text-primary dark:hover:text-white text-sm font-medium transition-colors"
            >
              Support
            </Link>
          </nav>
          <div className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-surface-border">
            <span className="text-xs text-gray-500 dark:text-text-secondary hidden sm:block">
              {user?.emailAddresses?.[0]?.emailAddress || 'user@example.com'}
            </span>
            <div
              className="bg-center bg-no-repeat bg-cover rounded-full size-9 ring-2 ring-primary/20"
              aria-label="User profile avatar"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex justify-center py-10 px-4 sm:px-6">
        <div className="w-full max-w-2xl flex flex-col gap-8">
          {/* Page Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-primary mb-1">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <Link
                href="/settings/security"
                className="text-sm font-medium hover:underline"
              >
                Back to Security Settings
              </Link>
            </div>
            <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight">
              Save Your Backup Codes
            </h1>
            <p className="text-gray-500 dark:text-text-secondary text-base">
              Use these recovery codes if you ever lose access to your authenticator app. Each code can only be used once.
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-border rounded-xl p-6 md:p-10 shadow-sm">
              <LoadingSkeleton />
            </div>
          )}

          {/* Content Card */}
          {!isLoading && codes.length > 0 && (
            <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-border rounded-xl p-6 md:p-10 shadow-sm flex flex-col gap-6">
              {/* Security Warning */}
              <div
                role="alert"
                className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-start gap-3"
              >
                <span className="material-symbols-outlined text-amber-500 text-[20px] flex-shrink-0 mt-0.5">
                  warning
                </span>
                <div className="text-sm text-amber-600 dark:text-amber-400">
                  <p className="font-semibold">Store these codes safely</p>
                  <p className="mt-1">
                    These codes will only be shown once. They cannot be retrieved again after you leave this page.
                    Save them in a secure location like a password manager.
                  </p>
                </div>
              </div>

              {/* Backup Codes Grid */}
              <ul
                role="list"
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {codes.map((code, index) => (
                  <BackupCodeCard
                    key={code}
                    number={index + 1}
                    code={code}
                  />
                ))}
              </ul>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {/* Copy Button */}
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label={hasCopied ? 'Copied to clipboard' : 'Copy all codes to clipboard'}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg',
                    'border border-gray-200 dark:border-surface-border',
                    'bg-white dark:bg-surface-dark',
                    'text-gray-700 dark:text-white text-sm font-medium',
                    'hover:bg-gray-50 dark:hover:bg-background-dark',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark',
                    'transition-all w-full sm:w-auto'
                  )}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {hasCopied ? 'check' : 'content_copy'}
                  </span>
                  <span>{hasCopied ? 'Copied!' : 'Copy All'}</span>
                </button>

                {/* Download Button */}
                <button
                  type="button"
                  onClick={handleDownload}
                  aria-label="Download codes as text file"
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg',
                    'border border-gray-200 dark:border-surface-border',
                    'bg-white dark:bg-surface-dark',
                    'text-gray-700 dark:text-white text-sm font-medium',
                    'hover:bg-gray-50 dark:hover:bg-background-dark',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark',
                    'transition-all w-full sm:w-auto'
                  )}
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span>Download</span>
                </button>

                {/* Print Button */}
                <button
                  type="button"
                  onClick={handlePrint}
                  aria-label="Print codes"
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg',
                    'border border-gray-200 dark:border-surface-border',
                    'bg-white dark:bg-surface-dark',
                    'text-gray-700 dark:text-white text-sm font-medium',
                    'hover:bg-gray-50 dark:hover:bg-background-dark',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark',
                    'transition-all w-full sm:w-auto'
                  )}
                >
                  <span className="material-symbols-outlined text-[18px]">print</span>
                  <span>Print</span>
                </button>
              </div>

              {/* Confirmation Checkbox */}
              <div className="flex items-start gap-3 pt-4 border-t border-gray-200 dark:border-surface-border">
                <input
                  type="checkbox"
                  id="confirm-saved"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  aria-label="I have saved my backup codes in a secure location"
                  className={cn(
                    'mt-0.5 size-5 rounded border-gray-300 dark:border-surface-border',
                    'text-primary focus:ring-primary focus:ring-offset-background-dark',
                    'cursor-pointer'
                  )}
                />
                <label
                  htmlFor="confirm-saved"
                  className="text-sm text-gray-600 dark:text-text-secondary cursor-pointer select-none"
                >
                  I have saved my backup codes in a secure location
                </label>
              </div>

              {/* Continue Button */}
              <button
                type="button"
                onClick={handleContinue}
                disabled={!isConfirmed}
                className={cn(
                  'w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg',
                  'shadow-lg shadow-primary/25 transition-all',
                  'flex items-center justify-center gap-2',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark',
                  !isConfirmed && 'opacity-50 cursor-not-allowed'
                )}
              >
                <span>Continue</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          header,
          .no-print {
            display: none !important;
          }

          body {
            background: white !important;
            color: black !important;
          }

          .bg-surface-dark,
          .bg-background-dark {
            background: white !important;
          }

          .text-white,
          .text-text-secondary {
            color: black !important;
          }

          .border {
            border-color: #ccc !important;
          }

          main {
            padding: 20px !important;
          }

          button {
            display: none !important;
          }

          input[type='checkbox'] {
            display: none !important;
          }

          label[for='confirm-saved'] {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default BackupCodesDisplay;
