/**
 * MFA Backup Codes Page
 *
 * Story: 1-1-9 MFA Backup Codes Generation
 * Route: /auth/mfa-setup/backup
 *
 * This page displays backup codes after TOTP setup is complete.
 * It's the final step in the MFA setup flow before the success page.
 *
 * Features:
 * - Generate and display 10 backup codes
 * - Copy, download, and print functionality
 * - Security warning about storing codes safely
 * - Confirmation checkbox before continuing
 */

import * as React from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { BackupCodesClient } from './client';

/**
 * Generate mock backup codes
 * In production, these would come from Clerk's backup codes API
 */
function generateBackupCodes(): string[] {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const codes: string[] = [];

  for (let i = 0; i < 10; i++) {
    let code = '';
    for (let j = 0; j < 8; j++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    codes.push(code);
  }

  return codes;
}

/**
 * BackupCodesPage Server Component
 *
 * Handles authentication check and generates backup codes.
 * The actual UI is rendered by the client component.
 */
export default async function BackupCodesPage() {
  // Check authentication
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Generate backup codes
  // In production, use Clerk's API: await clerk.users.createBackupCode(userId)
  const backupCodes = generateBackupCodes();

  return <BackupCodesClient codes={backupCodes} />;
}
