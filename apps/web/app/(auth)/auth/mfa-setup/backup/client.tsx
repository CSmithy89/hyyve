/**
 * MFA Backup Codes Client Component
 *
 * Story: 1-1-9 MFA Backup Codes Generation
 *
 * Client component wrapper for the backup codes display.
 * Handles navigation protection and state management.
 */

'use client';

import * as React from 'react';
import { BackupCodesDisplay } from '@/components/auth/backup-codes-display';

interface BackupCodesClientProps {
  codes: string[];
}

/**
 * BackupCodesClient Component
 *
 * Wraps BackupCodesDisplay with navigation protection.
 * Warns users if they try to leave before saving codes.
 */
export function BackupCodesClient({ codes }: BackupCodesClientProps) {
  const [hasConfirmed, setHasConfirmed] = React.useState(false);

  // Navigation protection - warn before leaving if not confirmed
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasConfirmed) {
        e.preventDefault();
        // Modern browsers ignore custom messages, but we still need to call preventDefault
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasConfirmed]);

  const handleContinue = () => {
    setHasConfirmed(true);
  };

  return (
    <BackupCodesDisplay
      codes={codes}
      onContinue={handleContinue}
    />
  );
}
