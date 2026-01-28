/**
 * MFA Backup Codes Loading State
 *
 * Story: 1-1-9 MFA Backup Codes Generation
 *
 * Loading skeleton displayed while backup codes are being generated.
 */

import * as React from 'react';
import { BackupCodesDisplay } from '@/components/auth/backup-codes-display';

export default function BackupCodesLoading() {
  return <BackupCodesDisplay codes={[]} isLoading={true} />;
}
