/**
 * MFA Info Box Component
 *
 * Story: 1-1-7 MFA Setup - Method Selection
 * Wireframe: mfa_method_selection/code.html (lines 152-158)
 *
 * Features:
 * - Displays "Why enable 2FA?" informational content
 * - Blue themed styling to indicate informational content
 * - Info icon for visual hierarchy
 * - Customizable title and content via props
 *
 * Design tokens from wireframe:
 * - Background: bg-blue-500/10
 * - Border: border-blue-500/20
 * - Icon: text-blue-400
 * - Title: text-blue-100
 * - Content: text-blue-200/70
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for the MfaInfoBox component
 */
export interface MfaInfoBoxProps {
  /** Optional custom title (defaults to "Why enable 2FA?") */
  title?: string;
  /** Optional custom content (defaults to security explanation) */
  content?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Info Icon Component
 */
function InfoIcon({ className }: { className?: string }) {
  return (
    <span
      data-testid="info-icon"
      className={cn('material-symbols-outlined shrink-0', className)}
      aria-hidden="true"
    >
      info
    </span>
  );
}

/**
 * Default content explaining 2FA benefits
 */
const DEFAULT_TITLE = 'Why enable 2FA?';
const DEFAULT_CONTENT =
  'Two-factor authentication adds an extra layer of security to your account by requiring more than just a password to log in. This significantly reduces the chance of unauthorized access.';

/**
 * MfaInfoBox Component
 *
 * Informational box explaining the benefits of two-factor authentication.
 * Uses blue color scheme to distinguish it as helpful information rather
 * than a warning or error.
 */
export function MfaInfoBox({
  title = DEFAULT_TITLE,
  content = DEFAULT_CONTENT,
  className,
}: MfaInfoBoxProps) {
  return (
    <div
      className={cn(
        'flex gap-4 rounded-lg bg-blue-500/10 p-4 border border-blue-500/20',
        className
      )}
    >
      <InfoIcon className="text-blue-400" />
      <div className="flex flex-col gap-1">
        <h4 className="text-sm font-semibold text-blue-100">{title}</h4>
        <p className="text-sm text-blue-200/70">{content}</p>
      </div>
    </div>
  );
}

export default MfaInfoBox;
